/**
 * rpc.ts — host-side RPC handler for mineru config read/write.
 *
 * Endpoints (all POST on the `/api` channel):
 *   - `mineru/config.get`  payload: {} → { baseURL, apiKeyEnv, defaultBackend, ... }
 *   - `mineru/config.set`  payload: { config: Partial<MineruRuntimeConfig> } → { config: MineruRuntimeConfig }
 *   - `mineru/health`      payload: {} → { status, version, ... } | error
 *
 * Config persists under the `mineru` settings namespace in `$DSH_HOME/settings.yaml`
 * via `scope.replace()`; the cordis.yml `config:` block is the composition base
 * (first-boot seed). Mutations hot-reload the in-memory client + tool registration.
 */

import type { Context } from 'cordis'
import type { RpcResult } from '@deepseek-ai/dsh-host-apiproxy/api'
import { MineRUClient, type HealthResponse } from './client.js'
import type { ResolvedConfig } from './tools.js'

/** Wire shape for mineru config (subset of ResolvedConfig that's user-editable). */
export interface MineruRuntimeConfig {
  readonly baseURL: string
  readonly apiKeyEnv: string
  readonly defaultBackend: string
  readonly defaultParseMethod: string
  readonly defaultLang: string
  readonly pollIntervalMs: number
  readonly pollTimeoutMs: number
  readonly requestTimeoutMs: number
  readonly maxMdOutputChars: number
}

export interface ConfigGetResponse {
  readonly config: MineruRuntimeConfig
}

export interface ConfigSetPayload {
  readonly config: Partial<MineruRuntimeConfig>
}

export interface ConfigSetResponse {
  readonly config: MineruRuntimeConfig
}

export interface HealthResponseWire {
  readonly status: string
  readonly version?: string
  readonly queued_tasks?: number
  readonly processing_tasks?: number
  readonly completed_tasks?: number
  readonly failed_tasks?: number
  readonly max_concurrent_requests?: number
}

type MineruValue = ConfigGetResponse | ConfigSetResponse | HealthResponseWire

const ENDPOINT_PREFIX = 'mineru/'

export function ownsEndpoint(endpoint: string): boolean {
  return endpoint.startsWith(ENDPOINT_PREFIX)
}

function ok<T extends MineruValue>(value: T): RpcResult<MineruValue> {
  return { ok: true, value }
}

function fail(message: string): RpcResult<MineruValue> {
  return { ok: false, error: { code: 'internal', message, details: {} } }
}

export function toRuntimeConfig(resolved: ResolvedConfig): MineruRuntimeConfig {
  return {
    baseURL: resolved.baseURL,
    apiKeyEnv: resolved.apiKeyEnv,
    defaultBackend: resolved.defaultBackend,
    defaultParseMethod: resolved.defaultParseMethod,
    defaultLang: resolved.defaultLang,
    pollIntervalMs: resolved.pollIntervalMs,
    pollTimeoutMs: resolved.pollTimeoutMs,
    requestTimeoutMs: resolved.requestTimeoutMs,
    maxMdOutputChars: resolved.maxMdOutputChars,
  }
}

export interface MineruRpcDeps {
  readonly getResolved: () => ResolvedConfig
  readonly getClient: () => MineRUClient
  readonly onConfigChanged: (next: ResolvedConfig) => void
}

export function registerRpc(ctx: Context, deps: MineruRpcDeps): void {
  ctx.logger.info('dsh-mineru: registering RPC channel /mineru-api')
  const connection = ctx.connection as {
    readonly rpc: {
      readonly handle: (
        channel: '/mineru-api',
        handler: (endpoint: string, payload: unknown, signal: AbortSignal) => Promise<RpcResult<unknown>>,
        options: { readonly authority: 'trusted-host' | 'loopback' },
      ) => unknown
    }
  }
  connection.rpc.handle(
    '/mineru-api',
    async (endpoint, payload) => {
      switch (endpoint) {
        case 'mineru/config.get':
          return ok({ config: toRuntimeConfig(deps.getResolved()) })

        case 'mineru/config.set': {
          const p = payload as ConfigSetPayload | undefined
          if (p === undefined || typeof p !== 'object' || p === null) {
            return fail('payload must be { config: Partial<MineruRuntimeConfig> }')
          }
          const patch = p.config
          if (patch === undefined || typeof patch !== 'object') {
            return fail('payload.config must be an object')
          }
          if (patch.baseURL !== undefined && (typeof patch.baseURL !== 'string' || patch.baseURL === '')) {
            return fail('baseURL must be a non-empty string')
          }
          const current = deps.getResolved()
          const next: ResolvedConfig = {
            baseURL: patch.baseURL ?? current.baseURL,
            apiKeyEnv: patch.apiKeyEnv ?? current.apiKeyEnv,
            defaultBackend: patch.defaultBackend ?? current.defaultBackend,
            defaultParseMethod: patch.defaultParseMethod ?? current.defaultParseMethod,
            defaultLang: patch.defaultLang ?? current.defaultLang,
            pollIntervalMs: patch.pollIntervalMs ?? current.pollIntervalMs,
            pollTimeoutMs: patch.pollTimeoutMs ?? current.pollTimeoutMs,
            requestTimeoutMs: patch.requestTimeoutMs ?? current.requestTimeoutMs,
            maxMdOutputChars: patch.maxMdOutputChars ?? current.maxMdOutputChars,
          }
          deps.onConfigChanged(next)
          return ok({ config: toRuntimeConfig(next) })
        }

        case 'mineru/health': {
          try {
            const h: HealthResponse = await deps.getClient().health(new AbortController().signal)
            const wire: HealthResponseWire = {
              status: h.status,
              version: h.version,
              queued_tasks: h.queued_tasks,
              processing_tasks: h.processing_tasks,
              completed_tasks: h.completed_tasks,
              failed_tasks: h.failed_tasks,
              max_concurrent_requests: h.max_concurrent_requests,
            }
            return ok(wire)
          } catch (err) {
            return fail(err instanceof Error ? err.message : String(err))
          }
        }

        default:
          return fail(`unknown endpoint: ${endpoint}`)
      }
    },
    { authority: 'trusted-host' },
  )
}
