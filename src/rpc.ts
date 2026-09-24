/**
 * rpc.ts — host-side health probe for the browser settings page.
 *
 * Wire endpoint (POST, exact Fetch route on the shared `/api` channel,
 * Connection client-request / server-response envelopes):
 *   - `mineru.health`  payload: {} → { status, version, queued_tasks, ... } | error
 *
 * Why an exact Fetch route and not a dedicated `rpc.handle` channel: the
 * dedicated-channel registry resolves `webServer` through the calling
 * fiber's context chain, and the web profile mounts the webserver as a
 * sibling loader row — never an ancestor of this plugin — so every dedicated
 * channel fails to register. Exact routes dispatch inside the already-mounted
 * `/api` carrier (the dsh-client-file-upload / ya-subagent pattern),
 * inheriting its Host/Origin trust fence and browser authentication.
 *
 * Config read/write does NOT ride this channel: since dsh 0.1.7-rc.1
 * (`DSH-0.1.7-J1-04`/`J1-27`) the settings page reads and writes the entry's
 * volatile Config through the Host settings service (`ctx.configForms` on the
 * browser side), which persists to the profile's `cordis.patch.yml` under the
 * entry id and hot-reloads the running instance in place.
 */

import type { Context } from '@deepseek-ai/cordis'
import { API_PATH, type ConnectionRpcResult } from '@deepseek-ai/dsh-client-connection'
import { MinerUClient, type HealthResponse } from './client.js'

/** Local alias: the carrier-neutral Connection RPC result shape. */
type RpcResult<T> = ConnectionRpcResult<T>

/** Wire shape of the `mineru.health` response. */
export interface HealthResponseWire {
  readonly status: string
  readonly version?: string
  readonly queued_tasks?: number
  readonly processing_tasks?: number
  readonly completed_tasks?: number
  readonly failed_tasks?: number
  readonly max_concurrent_requests?: number
}

type MineruValue = HealthResponseWire

/** Wire endpoint this route owns; the client calls `rpc.call('/api', 'mineru.health', {})`. */
export const HEALTH_ENDPOINT = 'mineru.health'

function ok(value: MineruValue): RpcResult<MineruValue> {
  return { ok: true, value }
}

function fail(message: string): RpcResult<MineruValue> {
  return { ok: false, error: { code: 'internal', message, details: {} } }
}

/** Connection client-request envelope (mirror of dsh-client-connection's wire contract). */
interface ClientRequestEnvelope {
  readonly type: 'client-request'
  readonly rpcId: string
  readonly method: string
  readonly payload: unknown
}

/** Serialize one RPC result as a server-response envelope. */
function envelopeResponse(rpcId: string, result: RpcResult<unknown>): Response {
  return new Response(JSON.stringify({ type: 'server-response', rpcId, result }), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

export interface MineruRpcDeps {
  readonly getClient: () => MinerUClient
}

/**
 * Register the `mineru.health` exact Fetch route on the host's connection
 * service. The route rolls back with the plugin fiber; trust and browser
 * authentication live on the physical `/api` carrier.
 * @param ctx - host context (`connection` is injected by the entry).
 * @param deps - live MinerU client getter (sees the latest config).
 */
export function registerRpc(ctx: Context, deps: MineruRpcDeps): void {
  ctx.logger.info(`dsh-mineru: registering ${API_PATH}/${HEALTH_ENDPOINT} Fetch route`)
  ctx.effect(
    () => ctx.connection.fetch.register({
      path: `${API_PATH}/${HEALTH_ENDPOINT}`,
      methods: ['POST'],
      requestBody: 'buffered',
      fetch: async (request) => {
        if (request.method !== 'POST') {
          return new Response('not found', { status: 404 })
        }
        const mediaType = request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase()
        if (mediaType !== 'application/json') {
          return new Response('content type must be application/json', { status: 415 })
        }
        let body: unknown
        try {
          body = await request.json()
        } catch {
          return new Response('body is not JSON', { status: 400 })
        }
        const envelope = body as Partial<ClientRequestEnvelope> | null
        if (envelope === null || typeof envelope !== 'object'
          || envelope.type !== 'client-request'
          || typeof envelope.rpcId !== 'string' || envelope.rpcId === ''
          || typeof envelope.method !== 'string') {
          return envelopeResponse('invalid-request', fail('invalid client-request message'))
        }
        if (envelope.method !== HEALTH_ENDPOINT) {
          return envelopeResponse(envelope.rpcId, fail(
            `method ${JSON.stringify(envelope.method)} does not match endpoint ${JSON.stringify(HEALTH_ENDPOINT)}`,
          ))
        }
        try {
          const h: HealthResponse = await deps.getClient().health(request.signal)
          return envelopeResponse(envelope.rpcId, ok({
            status: h.status,
            version: h.version,
            queued_tasks: h.queued_tasks,
            processing_tasks: h.processing_tasks,
            completed_tasks: h.completed_tasks,
            failed_tasks: h.failed_tasks,
            max_concurrent_requests: h.max_concurrent_requests,
          }))
        } catch (err) {
          return envelopeResponse(envelope.rpcId, fail(err instanceof Error ? err.message : String(err)))
        }
      },
    }),
    `dsh-mineru: ${API_PATH}/${HEALTH_ENDPOINT} Fetch route`,
  )
}
