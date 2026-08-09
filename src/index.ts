/**
 * index.ts — dsh-mineru cordis plugin entry.
 *
 * Exposes 5 MineRU tools (health, submit, status, result, parse_document)
 * to the model via ctx.tools.register(defineTool(...)).
 *
 * Config (Schemastery schema, surfaced in the DSH GUI):
 *   baseURL         — MineRU API base URL (required)
 *   apiKeyEnv       — env var / credential ref for optional API key
 *   defaultBackend  — 'pipeline' (safe) | 'hybrid-engine' | ...
 *   defaultParseMethod, defaultLang, pollIntervalMs, pollTimeoutMs,
 *   requestTimeoutMs, maxMdOutputChars
 *
 * Form: function plugin (export name / inject / Config / apply).
 */

import z from 'schemastery'
import type { Context } from 'cordis'
import { MineRUClient } from './client.js'
import { registerTools } from './tools.js'
import type { ResolvedConfig } from './tools.js'

export const name = 'dsh-mineru'
export const inject = ['tools']

export type MineruBackend = 'pipeline' | 'vlm-engine' | 'hybrid-engine' | 'vlm-http-client' | 'hybrid-http-client'
export type MineruParseMethod = 'auto' | 'txt' | 'ocr'

export interface Config {
  /** MineRU API base URL, e.g. 'http://your-mineru-host:18000' for the test instance or your self-hosted MineRU server. Required. */
  baseURL: string
  /** Environment variable name (or credential ref) for the optional API key. The plugin reads the key from the DSH credential store if loaded, otherwise from this env var. MineRU's open-source server has no built-in auth, so this is only needed behind an auth-protecting reverse proxy. */
  apiKeyEnv?: string
  /** Default parsing backend. 'pipeline' is hallucination-free and supports all languages; 'hybrid-engine' is MineRU's default but requires a VLM model on the server. */
  defaultBackend?: MineruBackend
  /** Default parse method (pipeline/hybrid only). 'auto' = auto-detect, 'txt' = text only (fast, no OCR), 'ocr' = force OCR. */
  defaultParseMethod?: MineruParseMethod
  /** Default language code for pipeline backend (e.g. 'ch' = Chinese/English/Japanese). */
  defaultLang?: string
  /** Polling interval (ms) for async task status checks in mineru_parse_document. */
  pollIntervalMs?: number
  /** Maximum total polling time (ms) for mineru_parse_document before timing out. */
  pollTimeoutMs?: number
  /** HTTP request timeout (ms) for each individual MineRU API call. */
  requestTimeoutMs?: number
  /** Maximum characters of markdown returned inline to the model. Full content is saved to a temp file if exceeded. */
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

export function apply(ctx: Context, config: Config = {} as Config): void {
  const resolved = resolveConfig(config)

  const client = new MineRUClient({
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

  registerTools(ctx, client, resolved)
}
