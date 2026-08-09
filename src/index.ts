/**
 * index.ts — dsh-mineru cordis plugin entry (host half).
 *
 * Dual-entry bundle: this is the host half (exports `.`). The browser half
 * ships via `./client` (see `src/client/index.ts`).
 *
 * Architecture:
 *   - 5 model-facing tools (health, submit, status, result, parse_document)
 *     registered once at load; each tool reads the live client/config via
 *     getters, so RPC config mutations hot-reload without re-registration.
 *   - Settings namespace `mineru` persists user edits to `$DSH_HOME/settings.yaml`;
 *     cordis.yml `config:` is the composition base (first-boot seed).
 *   - RPC on `/api` channel: `mineru/config.get`/`.set`/`.health` for the
 *     browser settings page (bypasses the `WEB_SETTINGS_NAMESPACES` wire
 *     allowlist — same pattern as yet-another-subagent).
 */

import z from 'schemastery'
import type { Context } from 'cordis'
import { MineRUClient } from './client.js'
import { registerTools } from './tools.js'
import type { ResolvedConfig } from './tools.js'
import { registerRpc, type MineruRuntimeConfig } from './rpc.js'
import type {} from '@deepseek-ai/dsh-client-connection'

export const name = 'dsh-mineru'
export const inject = ['tools', 'connection']

export type MineruBackend = 'pipeline' | 'vlm-engine' | 'hybrid-engine' | 'vlm-http-client' | 'hybrid-http-client'
export type MineruParseMethod = 'auto' | 'txt' | 'ocr'

export interface Config {
  baseURL: string
  apiKeyEnv?: string
  defaultBackend?: MineruBackend
  defaultParseMethod?: MineruParseMethod
  defaultLang?: string
  pollIntervalMs?: number
  pollTimeoutMs?: number
  requestTimeoutMs?: number
  maxMdOutputChars?: number
}

export const Config: z<Config> = z.object({
  baseURL: z.string().description('MineRU API base URL (e.g. http://host:18000). Required.'),
  apiKeyEnv: z.string().role('credential-ref').default('MINERU_API_KEY'),
  defaultBackend: z.union(['pipeline', 'vlm-engine', 'hybrid-engine', 'vlm-http-client', 'hybrid-http-client']).default('pipeline'),
  defaultParseMethod: z.union(['auto', 'txt', 'ocr']).default('auto'),
  defaultLang: z.string().default('ch'),
  pollIntervalMs: z.number().default(2000),
  pollTimeoutMs: z.number().default(600000),
  requestTimeoutMs: z.number().default(60000),
  maxMdOutputChars: z.number().default(200000),
})

function resolveConfig(config: Config): ResolvedConfig {
  if (typeof config.baseURL !== 'string' || config.baseURL === '') {
    throw new Error('dsh-mineru: config "baseURL" is required. Set it in the DSH GUI settings or cordis.patch.yml.')
  }
  return {
    baseURL: config.baseURL,
    apiKeyEnv: config.apiKeyEnv ?? 'MINERU_API_KEY',
    defaultBackend: config.defaultBackend ?? 'pipeline',
    defaultParseMethod: config.defaultParseMethod ?? 'auto',
    defaultLang: config.defaultLang ?? 'ch',
    pollIntervalMs: config.pollIntervalMs ?? 2000,
    pollTimeoutMs: config.pollTimeoutMs ?? 600000,
    requestTimeoutMs: config.requestTimeoutMs ?? 60000,
    maxMdOutputChars: config.maxMdOutputChars ?? 200000,
  }
}

function makeClient(ctx: Context, resolved: ResolvedConfig): MineRUClient {
  return new MineRUClient({
    baseURL: resolved.baseURL,
    timeoutMs: resolved.requestTimeoutMs,
    apiKeyResolver: async () => {
      try {
        const credentials = ctx.get('credentials') as
          | { resolve?: (ref: string) => Promise<{ value: string } | undefined> }
          | undefined
        if (credentials?.resolve) {
          const hit = await credentials.resolve(resolved.apiKeyEnv)
          if (hit?.value) return hit.value
        }
      } catch {
        // credentials service not available; fall through to env
      }
      const envVal = process.env[resolved.apiKeyEnv]
      return envVal && envVal.length > 0 ? envVal : undefined
    },
  })
}

export function apply(ctx: Context, config: Config = {} as Config): void {
  let resolved = resolveConfig(config)
  let client = makeClient(ctx, resolved)

  const getResolved = (): ResolvedConfig => resolved
  const getClient = (): MineRUClient => client

  const onConfigChanged = (next: ResolvedConfig): void => {
    resolved = next
    client = makeClient(ctx, resolved)
    ctx.logger.info(`dsh-mineru: config updated, baseURL=${resolved.baseURL}`)
  }

  // 1. Register tools (once; getters make them see live config).
  registerTools(ctx, getClient, getResolved)

  // 2. RPC: config CRUD + health probe for the browser settings page.
  registerRpc(ctx, { getResolved, getClient, onConfigChanged })
}
