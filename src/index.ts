/**
 * index.ts — dsh-mineru cordis plugin entry (host half).
 *
 * Dual-entry bundle: this is the host half (exports `.`). The browser half
 * ships via `./client` (see `src/client/index.ts`).
 *
 * Architecture:
 *   - 5 model-facing tools (health, submit, status, result, parse_document)
 *     registered once at load; each tool reads the live client/config via
 *     getters, so config mutations hot-reload without re-registration.
 *   - Settings are the profile-owned Cordis Config (dsh 0.1.7-rc.1
 *     `DSH-0.1.7-J1-04`): every user-editable field is `.volatile()`, so the
 *     Loader hands `apply` live references whose `.get()` returns the latest
 *     accepted value. Edits from the plugin's configuration card (Plugins
 *     page) travel through the Host
 *     settings service (`ctx.configForms` on the browser side), persist per
 *     profile in `cordis.patch.yml` under the entry id `dsh-mineru`, and
 *     update the volatile references in place — no plugin remount. The
 *     cordis.yml `config:` block stays the composition base (first-boot seed).
 *   - One RPC endpoint remains for the browser configuration card: the
 *     `mineru.health` probe, served as an exact Fetch route on the shared
 *     `/api` channel (`connection.fetch.register`). Dedicated `rpc.handle`
 *     channels cannot mount in the web profile (the webserver is a sibling
 *     loader row, never an ancestor of this fiber), so config CRUD no longer
 *     rides a custom channel at all.
 */

import z from '@deepseek-ai/schemastery'
import type { Context, Volatile } from '@deepseek-ai/cordis'
// Type-only: pulls the `ctx.settings` Context merge (SettingsForms).
import type {} from '@deepseek-ai/dsh-settings'
import { MinerUClient } from './client.js'
import { registerTools } from './tools.js'
import type { ResolvedConfig } from './tools.js'
import { registerRpc } from './rpc.js'
import type {} from '@deepseek-ai/dsh-client-connection'

export const name = 'dsh-mineru'
export const inject = ['tools', 'connection']

export type MineruBackend = 'pipeline' | 'vlm-engine' | 'hybrid-engine' | 'vlm-http-client' | 'hybrid-http-client'
export type MineruParseMethod = 'auto' | 'txt' | 'ocr'

/**
 * The live Cordis config the Loader passes to `apply` (dsh 0.1.7-rc.1).
 *
 * Every field is a stable volatile reference read through `.get()`; a
 * committed settings edit updates it in place without remounting the plugin.
 */
export interface EntryConfig {
  /** Live MinerU API base URL. */
  baseURL: Volatile<string> | string
  /** Live env-var name the API key is resolved from. */
  apiKeyEnv: Volatile<string> | string
  /** Live default parsing backend. */
  defaultBackend: Volatile<string> | string
  /** Live default parse method. */
  defaultParseMethod: Volatile<string> | string
  /** Live pipeline-backend language code. */
  defaultLang: Volatile<string> | string
  /** Live async-status poll interval. */
  pollIntervalMs: Volatile<number> | number
  /** Live `mineru_parse_document` poll timeout. */
  pollTimeoutMs: Volatile<number> | number
  /** Live per-request HTTP timeout. */
  requestTimeoutMs: Volatile<number> | number
  /** Live inline-markdown truncation limit. */
  maxMdOutputChars: Volatile<number> | number
}

/**
 * Schemastery schema for the plugin's profile-owned Config.
 *
 * Every field is `.volatile()` (dsh 0.1.7-rc.1): the settings service
 * enumerates them for the configuration form, and a committed edit updates
 * the running reference in place. Defaults are the composition-layer seed.
 */
export const Config = z.object({
  baseURL: z.string().description('MinerU API base URL (e.g. http://host:18000). Required.').volatile(),
  apiKeyEnv: z.string().role('credential-ref').default('MINERU_API_KEY').volatile(),
  defaultBackend: z.union(['pipeline', 'vlm-engine', 'hybrid-engine', 'vlm-http-client', 'hybrid-http-client']).default('pipeline').volatile(),
  defaultParseMethod: z.union(['auto', 'txt', 'ocr']).default('auto').volatile(),
  defaultLang: z.string().default('ch').volatile(),
  pollIntervalMs: z.number().default(2000).volatile(),
  pollTimeoutMs: z.number().default(600000).volatile(),
  requestTimeoutMs: z.number().default(60000).volatile(),
  maxMdOutputChars: z.number().default(200000).volatile(),
}) as unknown as z<EntryConfig>

/** Read the current value of a volatile (or plain, in hand-built contexts) field. */
function live<T>(ref: Volatile<T> | T): T {
  if (typeof ref === 'object' && ref !== null && typeof (ref as Volatile<T>).get === 'function') {
    // `get()` returns VolatileSnapshot<T>, which is T itself for the scalar
    // field types this entry declares.
    return (ref as Volatile<T>).get() as T
  }
  return ref as T
}

function resolveConfig(entry: EntryConfig): ResolvedConfig {
  const baseURL = live(entry.baseURL)
  if (typeof baseURL !== 'string' || baseURL === '') {
    throw new Error('dsh-mineru: config "baseURL" is required. Set it on the plugin\'s configure page in the DSH GUI Plugins list or in cordis.patch.yml.')
  }
  return {
    baseURL,
    apiKeyEnv: live(entry.apiKeyEnv) ?? 'MINERU_API_KEY',
    defaultBackend: live(entry.defaultBackend) ?? 'pipeline',
    defaultParseMethod: live(entry.defaultParseMethod) ?? 'auto',
    defaultLang: live(entry.defaultLang) ?? 'ch',
    pollIntervalMs: live(entry.pollIntervalMs) ?? 2000,
    pollTimeoutMs: live(entry.pollTimeoutMs) ?? 600000,
    requestTimeoutMs: live(entry.requestTimeoutMs) ?? 60000,
    maxMdOutputChars: live(entry.maxMdOutputChars) ?? 200000,
  }
}

function makeClient(ctx: Context, resolved: ResolvedConfig): MinerUClient {
  return new MinerUClient({
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

export function apply(ctx: Context, config: EntryConfig = {} as EntryConfig): void {
  // Fail loud at load when the composition layers provide no baseURL.
  let resolved = resolveConfig(config)
  let client = makeClient(ctx, resolved)

  // Re-read the volatile references on every access; a committed settings
  // edit hot-swaps the in-memory client without re-registering tools.
  const getResolved = (): ResolvedConfig => {
    const next = resolveConfig(config)
    if (JSON.stringify(next) !== JSON.stringify(resolved)) {
      resolved = next
      client = makeClient(ctx, next)
      ctx.logger.info(`dsh-mineru: config updated, baseURL=${next.baseURL}`)
    }
    return resolved
  }
  const getClient = (): MinerUClient => {
    void getResolved()
    return client
  }

  // 1. Register tools (once; getters make them see live config).
  registerTools(ctx, getClient, getResolved)

  // 2. Settings presentation policy: this plugin ships its own configuration
  //    card on the Plugins page (`plugins.row.config`, browser side), so
  //    suppress the schema-generated page. Values persist per profile under
  //    the entry id via the settings service.
  ctx.inject(['settings'], (sctx) => {
    sctx.effect(() => sctx.settings.configure({ auto: false }, ctx.fiber))
  })

  // 3. RPC: health probe for the browser configuration card (`/api` Fetch route).
  registerRpc(ctx, { getClient })
}
