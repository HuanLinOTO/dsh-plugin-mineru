/**
 * client.ts — MineRU HTTP client.
 *
 * Minimal fetch-based client for the MineRU FastAPI server (v3.4.4, protocol v2).
 * Endpoints: GET /health, POST /tasks, GET /tasks/{id}, GET /tasks/{id}/result.
 *
 * Auth is optional: MineRU's open-source server has no built-in auth. When an
 * API key is resolved (via the credential store or env var), it is sent as
 * `Authorization: Bearer <key>`. Credential-bearing requests reject redirects.
 */

import { readFile } from 'node:fs/promises'
import { basename, extname } from 'node:path'

export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface HealthResponse {
  status: 'healthy' | 'unhealthy'
  version: string
  protocol_version: number
  queued_tasks: number
  processing_tasks: number
  completed_tasks: number
  failed_tasks: number
  max_concurrent_requests: number
  processing_window_size: number
  task_retention_seconds: number
  task_cleanup_interval_seconds: number
}

export interface TaskSubmitResponse {
  task_id: string
  status: TaskStatus
  backend: string
  file_names: string[]
  created_at: string | null
  started_at: string | null
  completed_at: string | null
  error: string | null
  status_url: string
  result_url: string
  queued_ahead?: number
  message?: string
}

export interface TaskStatusResponse extends TaskSubmitResponse {}

export interface FileParseResult {
  md_content?: string | null
  middle_json?: string | null
  model_output?: string | null
  content_list?: string | null
  images?: Record<string, string>
}

export interface TaskResultResponse {
  backend: string
  version: string
  results: Record<string, FileParseResult>
}

export interface ParseParams {
  backend?: string
  parse_method?: string
  lang_list?: string[]
  effort?: string
  formula_enable?: boolean
  table_enable?: boolean
  image_analysis?: boolean
  server_url?: string
  return_md?: boolean
  return_middle_json?: boolean
  return_model_output?: boolean
  return_content_list?: boolean
  return_images?: boolean
  response_format_zip?: boolean
  return_original_file?: boolean
  start_page_id?: number
  end_page_id?: number
}

export class MineRUError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(message)
    this.name = 'MineRUError'
  }
}

const MIME_BY_EXT: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',
  '.webp': 'image/webp',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export function mimeTypeForExt(ext: string): string {
  return MIME_BY_EXT[ext.toLowerCase()] ?? 'application/octet-stream'
}

export function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      const err = new Error('Aborted') as Error & { name: string }
      err.name = 'AbortError'
      reject(err)
      return
    }
    const timer = setTimeout(resolve, ms)
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      const err = new Error('Aborted') as Error & { name: string }
      err.name = 'AbortError'
      reject(err)
    }, { once: true })
  })
}

export async function buildFormData(filePath: string, params: ParseParams): Promise<FormData> {
  const buffer = await readFile(filePath)
  const fileName = basename(filePath)
  const mime = mimeTypeForExt(extname(fileName))
  const blob = new Blob([buffer], { type: mime })

  const form = new FormData()
  form.append('files', blob, fileName)

  const appendBool = (key: string, val: boolean | undefined) => {
    if (val !== undefined) form.append(key, String(val))
  }
  const appendStr = (key: string, val: string | undefined) => {
    if (val !== undefined) form.append(key, val)
  }
  const appendInt = (key: string, val: number | undefined) => {
    if (val !== undefined) form.append(key, String(val))
  }

  appendStr('backend', params.backend)
  appendStr('parse_method', params.parse_method)
  appendStr('effort', params.effort)
  appendStr('server_url', params.server_url)
  appendBool('formula_enable', params.formula_enable)
  appendBool('table_enable', params.table_enable)
  appendBool('image_analysis', params.image_analysis)
  appendBool('return_md', params.return_md)
  appendBool('return_middle_json', params.return_middle_json)
  appendBool('return_model_output', params.return_model_output)
  appendBool('return_content_list', params.return_content_list)
  appendBool('return_images', params.return_images)
  appendBool('response_format_zip', params.response_format_zip)
  appendBool('return_original_file', params.return_original_file)
  appendInt('start_page_id', params.start_page_id)
  appendInt('end_page_id', params.end_page_id)

  if (params.lang_list !== undefined) {
    for (const lang of params.lang_list) form.append('lang_list', lang)
  }

  return form
}

export interface MineRUClientOptions {
  baseURL: string
  timeoutMs: number
  apiKeyResolver?: () => Promise<string | undefined>
}

export class MineRUClient {
  private readonly baseURL: string
  private readonly timeoutMs: number
  private readonly apiKeyResolver?: () => Promise<string | undefined>

  constructor(opts: MineRUClientOptions) {
    this.baseURL = opts.baseURL.replace(/\/+$/, '')
    this.timeoutMs = opts.timeoutMs
    this.apiKeyResolver = opts.apiKeyResolver
  }

  async health(signal: AbortSignal): Promise<HealthResponse> {
    return this.request<HealthResponse>('GET', '/health', undefined, signal, [200])
  }

  async submitTask(filePath: string, params: ParseParams, signal: AbortSignal): Promise<TaskSubmitResponse> {
    const form = await buildFormData(filePath, params)
    return this.request<TaskSubmitResponse>('POST', '/tasks', form, signal, [202])
  }

  async getTaskStatus(taskId: string, signal: AbortSignal): Promise<TaskStatusResponse> {
    return this.request<TaskStatusResponse>('GET', `/tasks/${encodeURIComponent(taskId)}`, undefined, signal, [200])
  }

  async getTaskResult(taskId: string, signal: AbortSignal): Promise<TaskResultResponse> {
    return this.request<TaskResultResponse>('GET', `/tasks/${encodeURIComponent(taskId)}/result`, undefined, signal, [200])
  }

  private async request<T>(
    method: string,
    path: string,
    body: FormData | undefined,
    parentSignal: AbortSignal,
    acceptedStatuses: number[],
  ): Promise<T> {
    parentSignal.throwIfAborted()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs)
    const onParentAbort = () => controller.abort()
    parentSignal.addEventListener('abort', onParentAbort, { once: true })

    try {
      const apiKey = this.apiKeyResolver ? await this.apiKeyResolver() : undefined
      parentSignal.throwIfAborted()

      const headers: Record<string, string> = {}
      if (apiKey) headers['authorization'] = `Bearer ${apiKey}`

      const response = await fetch(`${this.baseURL}${path}`, {
        method,
        headers,
        body,
        signal: controller.signal,
        redirect: apiKey ? 'error' : 'follow',
      })

      const status = response.status

      if (!acceptedStatuses.includes(status)) {
        let errorBody: unknown
        try {
          errorBody = await response.json()
        } catch {
          try {
            errorBody = await response.text()
          } catch {
            errorBody = null
          }
        }
        throw new MineRUError(
          `MineRU ${method} ${path} returned ${status}`,
          status,
          errorBody,
        )
      }

      const contentType = response.headers.get('content-type') ?? ''
      if (!contentType.includes('application/json')) {
        throw new MineRUError(
          `MineRU ${method} ${path} returned non-JSON content-type: ${contentType}`,
          status,
          null,
        )
      }

      return (await response.json()) as T
    } finally {
      clearTimeout(timeoutId)
      parentSignal.removeEventListener('abort', onParentAbort)
    }
  }
}

export async function pollUntilDone(
  client: MineRUClient,
  taskId: string,
  opts: { intervalMs: number; timeoutMs: number; signal: AbortSignal },
): Promise<TaskStatusResponse> {
  const deadline = Date.now() + opts.timeoutMs
  for (;;) {
    opts.signal.throwIfAborted()
    const status = await client.getTaskStatus(taskId, opts.signal)
    if (status.status === 'completed' || status.status === 'failed') return status
    if (Date.now() >= deadline) {
      throw new MineRUError(
        `Polling timed out after ${opts.timeoutMs}ms for task ${taskId}`,
        408,
        status,
      )
    }
    await sleep(opts.intervalMs, opts.signal)
  }
}
