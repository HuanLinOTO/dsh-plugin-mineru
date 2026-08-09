/**
 * tools.ts — 5 model-facing MinerU tools.
 *
 * Tools:
 *   mineru_health             — GET /health (capacity preflight)
 *   mineru_submit_parse_job   — POST /tasks (async submit, returns task_id)
 *   mineru_get_parse_status   — GET /tasks/{id} (poll status)
 *   mineru_get_parse_result   — GET /tasks/{id}/result (fetch completed result)
 *   mineru_parse_document     — high-level folded flow: submit → poll → result
 *
 * Conventions (per plugin-development-guide.md §3):
 *   C4 — execute returns a canonical JSON value; render is a separate pure projection.
 *   C6 — exec.signal is honored at every await point.
 *   C10 — no UI-specific formats in the canonical value.
 */

import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import type { Context } from 'cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { ContentBlock, ToolRunContext } from '@deepseek-ai/dsh-tools'
import {
  type ParseParams,
  type HealthResponse,
  type TaskSubmitResponse,
  type TaskStatusResponse,
  type TaskResultResponse,
  type TaskStatus,
  MinerUClient,
  pollUntilDone,
} from './client.js'

export interface ResolvedConfig {
  baseURL: string
  apiKeyEnv: string
  defaultBackend: string
  defaultParseMethod: string
  defaultLang: string
  pollIntervalMs: number
  pollTimeoutMs: number
  requestTimeoutMs: number
  maxMdOutputChars: number
}

const MINERU_BACKENDS = ['pipeline', 'vlm-engine', 'hybrid-engine', 'vlm-http-client', 'hybrid-http-client'] as const
const MINERU_PARSE_METHODS = ['auto', 'txt', 'ocr'] as const

function textRender<T>(fn: (value: T) => string): (_args: unknown, value: unknown) => ContentBlock[] {
  return (_args, value) => [{ type: 'text', text: fn(value as T) }]
}

type ParseToolArgs = {
  file_path: string
  backend?: string
  parse_method?: string
  lang_list?: string[]
  formula_enable?: boolean
  table_enable?: boolean
  return_middle_json?: boolean
  return_content_list?: boolean
  return_images?: boolean
  start_page_id?: number
  end_page_id?: number
}

function toParseParams(args: ParseToolArgs, config: ResolvedConfig): ParseParams {
  return {
    backend: args.backend ?? config.defaultBackend,
    parse_method: args.parse_method ?? config.defaultParseMethod,
    lang_list: args.lang_list ?? [config.defaultLang],
    formula_enable: args.formula_enable ?? true,
    table_enable: args.table_enable ?? true,
    return_md: true,
    return_middle_json: args.return_middle_json ?? false,
    return_content_list: args.return_content_list ?? false,
    return_images: args.return_images ?? false,
    start_page_id: args.start_page_id ?? 0,
    end_page_id: args.end_page_id ?? 99999,
  }
}

interface TruncateResult {
  content: string
  truncated: boolean
  fullMdPath?: string
}

export async function maybeTruncateMd(md: string, maxChars: number, taskId: string): Promise<TruncateResult> {
  if (md.length <= maxChars) return { content: md, truncated: false }
  const fullMdPath = join(tmpdir(), `mineru-${taskId}.md`)
  await writeFile(fullMdPath, md, 'utf8')
  return {
    content: md.slice(0, maxChars) + `\n\n... [truncated; full content saved to ${fullMdPath}]`,
    truncated: true,
    fullMdPath,
  }
}

export function renderHealthOutput(value: {
  status: string
  version?: string
  queued_tasks?: number
  processing_tasks?: number
  completed_tasks?: number
  failed_tasks?: number
  max_concurrent_requests?: number
}): string {
  const lines: string[] = [`MinerU server: ${value.status}`]
  if (value.version) lines.push(`Version: ${value.version}`)
  if (value.queued_tasks !== undefined) {
    lines.push(`Queue: ${value.queued_tasks} queued, ${value.processing_tasks ?? 0} processing, ${value.completed_tasks ?? 0} completed, ${value.failed_tasks ?? 0} failed`)
  }
  if (value.max_concurrent_requests !== undefined) {
    lines.push(`Capacity: ${value.max_concurrent_requests} max concurrent`)
  }
  return lines.join('\n')
}

export function renderSubmitOutput(value: {
  task_id: string
  status: string
  status_url?: string
  result_url?: string
  queued_ahead?: number
}): string {
  const lines: string[] = [
    `MinerU task submitted: ${value.task_id}`,
    `Status: ${value.status}`,
  ]
  if (value.queued_ahead !== undefined) lines.push(`Queued ahead: ${value.queued_ahead}`)
  if (value.status_url) lines.push(`Status URL: ${value.status_url}`)
  if (value.result_url) lines.push(`Result URL: ${value.result_url}`)
  lines.push('')
  lines.push('Poll with mineru_get_parse_status, then fetch with mineru_get_parse_result.')
  return lines.join('\n')
}

export function renderStatusOutput(value: {
  task_id: string
  status: string
  file_names?: string[]
  created_at?: string | null
  completed_at?: string | null
  error?: string | null
  queued_ahead?: number
}): string {
  const lines: string[] = [
    `Task ${value.task_id}: ${value.status}`,
  ]
  if (value.file_names && value.file_names.length > 0) lines.push(`Files: ${value.file_names.join(', ')}`)
  if (value.queued_ahead !== undefined) lines.push(`Queued ahead: ${value.queued_ahead}`)
  if (value.created_at) lines.push(`Created: ${value.created_at}`)
  if (value.completed_at) lines.push(`Completed: ${value.completed_at}`)
  if (value.error) lines.push(`Error: ${value.error}`)
  return lines.join('\n')
}

export function renderResultOutput(value: {
  task_id: string
  backend?: string
  version?: string
  file_stems?: string[]
  md_content?: string
  md_truncated?: boolean
  full_md_path?: string
  raw_result_path?: string
}): string {
  const lines: string[] = [`MinerU result for task ${value.task_id}`]
  if (value.backend) lines.push(`Backend: ${value.backend} (v${value.version ?? '?'})`)
  if (value.file_stems && value.file_stems.length > 0) lines.push(`Files: ${value.file_stems.join(', ')}`)
  if (value.raw_result_path) lines.push(`Full result JSON: ${value.raw_result_path}`)
  if (value.md_truncated && value.full_md_path) lines.push(`Full markdown: ${value.full_md_path}`)
  if (value.md_content) {
    lines.push('')
    lines.push(value.md_content)
  }
  return lines.join('\n')
}

export function renderParseDocOutput(value: {
  task_id: string
  status: string
  backend?: string
  version?: string
  file_stems?: string[]
  md_content?: string
  md_truncated?: boolean
  full_md_path?: string
  error?: string
}): string {
  const lines: string[] = [`MinerU parse ${value.status} (task: ${value.task_id})`]
  if (value.backend) lines.push(`Backend: ${value.backend} (v${value.version ?? '?'})`)
  if (value.file_stems && value.file_stems.length > 0) lines.push(`Files: ${value.file_stems.join(', ')}`)
  if (value.error) {
    lines.push(`Error: ${value.error}`)
  } else if (value.md_content) {
    if (value.md_truncated && value.full_md_path) {
      lines.push(`[Markdown truncated; full content at ${value.full_md_path}]`)
    }
    lines.push('')
    lines.push(value.md_content)
  }
  return lines.join('\n')
}

function toHealthOutput(h: HealthResponse) {
  return {
    status: h.status,
    version: h.version,
    queued_tasks: h.queued_tasks,
    processing_tasks: h.processing_tasks,
    completed_tasks: h.completed_tasks,
    failed_tasks: h.failed_tasks,
    max_concurrent_requests: h.max_concurrent_requests,
  }
}

function toSubmitOutput(s: TaskSubmitResponse) {
  const out: {
    task_id: string
    status: string
    status_url?: string
    result_url?: string
    queued_ahead?: number
  } = {
    task_id: s.task_id,
    status: s.status,
  }
  if (s.status_url) out.status_url = s.status_url
  if (s.result_url) out.result_url = s.result_url
  if (s.queued_ahead !== undefined) out.queued_ahead = s.queued_ahead
  return out
}

function toStatusOutput(s: TaskStatusResponse) {
  const out: {
    task_id: string
    status: TaskStatus
    file_names?: string[]
    created_at?: string
    started_at?: string
    completed_at?: string
    error?: string
    queued_ahead?: number
  } = {
    task_id: s.task_id,
    status: s.status,
  }
  if (s.file_names && s.file_names.length > 0) out.file_names = s.file_names
  if (s.created_at) out.created_at = s.created_at
  if (s.started_at) out.started_at = s.started_at
  if (s.completed_at) out.completed_at = s.completed_at
  if (s.error) out.error = s.error
  if (s.queued_ahead !== undefined) out.queued_ahead = s.queued_ahead
  return out
}

export function registerTools(ctx: Context, getClient: () => MinerUClient, getConfig: () => ResolvedConfig): void {
  const client = () => getClient()
  const config = () => getConfig()
  ctx.tools.register(defineTool({
    name: 'mineru_health',
    description:
      'Check MinerU server health and capacity. Returns server status, version, queue depth '
      + '(queued/processing/completed/failed task counts), and max concurrency. '
      + 'Useful before submitting large batch jobs to check available capacity. No parameters required.',
    parameters: {},
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          status: { type: 'string', required: true, description: 'Server health status: "healthy" or "unhealthy".' },
          version: { type: 'string', description: 'MinerU server version.' },
          queued_tasks: { type: 'integer', description: 'Number of tasks waiting in queue.' },
          processing_tasks: { type: 'integer', description: 'Number of tasks currently being processed.' },
          completed_tasks: { type: 'integer', description: 'Number of completed tasks (retained 24h).' },
          failed_tasks: { type: 'integer', description: 'Number of failed tasks.' },
          max_concurrent_requests: { type: 'integer', description: 'Maximum concurrent processing requests.' },
        },
      },
      render: textRender(renderHealthOutput),
    },
    execute: async (_args: unknown, exec: ToolRunContext) => {
      exec.signal.throwIfAborted()
      const h = await client().health(exec.signal)
      return toHealthOutput(h)
    },
  }))

  ctx.tools.register(defineTool({
    name: 'mineru_submit_parse_job',
    description:
      'Submit a document to MinerU for asynchronous parsing and return immediately with a task_id. '
      + 'Poll the task status with mineru_get_parse_status, then fetch results with mineru_get_parse_result. '
      + 'Use this for large documents that may take minutes to parse, or when submitting multiple jobs in parallel. '
      + 'The file must be a local filesystem path; if you only have a URL, download it first (e.g., via bash curl). '
      + "Default backend is 'pipeline' (hallucination-free, supports all languages).",
    parameters: {
      file_path: {
        type: 'string',
        required: true,
        description: 'Local filesystem path to the document (PDF, PNG, JPG, DOCX, PPTX, or XLSX).',
      },
      backend: {
        type: 'string',
        enum: MINERU_BACKENDS,
        description: "Parsing backend. 'pipeline': hallucination-free, multi-language. 'hybrid-engine': MinerU default, requires VLM. 'vlm-engine': VLM only.",
      },
      parse_method: {
        type: 'string',
        enum: MINERU_PARSE_METHODS,
        description: "Parse method (pipeline/hybrid only). 'auto': auto-detect. 'txt': text only (fast). 'ocr': force OCR.",
      },
      lang_list: {
        type: 'array',
        items: { type: 'string' },
        description: "Language codes for pipeline backend (e.g., 'ch' for Chinese/English/Japanese). Defaults to ['ch'].",
      },
      formula_enable: {
        type: 'boolean',
        description: 'Enable formula parsing. Default: true.',
      },
      table_enable: {
        type: 'boolean',
        description: 'Enable table parsing. Default: true.',
      },
      start_page_id: {
        type: 'integer',
        description: 'PDF page range start (0-indexed). Default: 0.',
      },
      end_page_id: {
        type: 'integer',
        description: 'PDF page range end (0-indexed, inclusive). Default: 99999 (all pages).',
      },
      return_middle_json: {
        type: 'boolean',
        description: 'Include middle JSON (intermediate parsing structure). Default: false.',
      },
      return_content_list: {
        type: 'boolean',
        description: 'Include content list JSON (structured content blocks). Default: false.',
      },
      return_images: {
        type: 'boolean',
        description: 'Include extracted images (base64 data URLs). Can be large. Default: false.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          task_id: { type: 'string', required: true, description: 'MinerU task ID. Use with mineru_get_parse_status and mineru_get_parse_result.' },
          status: { type: 'string', required: true, description: 'Initial task status (typically "pending").' },
          status_url: { type: 'string', description: 'URL to poll task status.' },
          result_url: { type: 'string', description: 'URL to fetch task result.' },
          queued_ahead: { type: 'integer', description: 'Number of tasks ahead in queue.' },
        },
      },
      render: textRender(renderSubmitOutput),
    },
    timeoutMs: 120000,
    execute: async (args: unknown, exec: ToolRunContext) => {
      const a = args as ParseToolArgs
      exec.signal.throwIfAborted()
      const submit = await client().submitTask(a.file_path, toParseParams(a, config()), exec.signal)
      return toSubmitOutput(submit)
    },
  }))

  ctx.tools.register(defineTool({
    name: 'mineru_get_parse_status',
    description:
      'Check the status of an asynchronous MinerU parsing task. '
      + 'Returns: "pending" (in queue), "processing" (being parsed), "completed" (done — fetch with mineru_get_parse_result), '
      + 'or "failed" (error occurred). Poll every few seconds; a 1-page PDF takes ~1-2s, large documents can take minutes.',
    parameters: {
      task_id: {
        type: 'string',
        required: true,
        description: 'Task ID returned by mineru_submit_parse_job.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          task_id: { type: 'string', required: true },
          status: { type: 'string', description: 'Task status: "pending", "processing", "completed", or "failed".', required: true },
          file_names: { type: 'array', items: { type: 'string' }, description: 'Normalized file stems being parsed.' },
          created_at: { type: 'string', description: 'ISO-8601 timestamp.' },
          started_at: { type: 'string', description: 'ISO-8601 timestamp.' },
          completed_at: { type: 'string', description: 'ISO-8601 timestamp.' },
          error: { type: 'string', description: 'Error message if status is "failed".' },
          queued_ahead: { type: 'integer', description: 'Tasks ahead in queue (only while pending).' },
        },
      },
      render: textRender(renderStatusOutput),
    },
    execute: async (args: unknown, exec: ToolRunContext) => {
      const a = args as { task_id: string }
      exec.signal.throwIfAborted()
      const status = await client().getTaskStatus(a.task_id, exec.signal)
      return toStatusOutput(status)
    },
  }))

  ctx.tools.register(defineTool({
    name: 'mineru_get_parse_result',
    description:
      'Fetch the parsing result for a completed MinerU task. The task must have status "completed" '
      + '(check with mineru_get_parse_status first). Returns the parsed markdown content inline '
      + '(truncated if very large; full content saved to a file). The full structured JSON result '
      + '(including middle_json, content_list, and images if requested at submit time) is always '
      + 'saved to raw_result_path for inspection with file-reading tools.',
    parameters: {
      task_id: {
        type: 'string',
        required: true,
        description: 'Task ID of a completed parsing job.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          task_id: { type: 'string', required: true },
          backend: { type: 'string' },
          version: { type: 'string' },
          file_stems: { type: 'array', items: { type: 'string' } },
          md_content: { type: 'string', description: 'Parsed markdown of the first file (truncated if exceeds maxMdOutputChars).' },
          md_truncated: { type: 'boolean', description: 'Whether md_content was truncated.' },
          full_md_path: { type: 'string', description: 'Path to full markdown file if truncated.' },
          raw_result_path: { type: 'string', description: 'Path to a JSON file with the full structured result (all files, all formats).' },
        },
      },
      render: textRender(renderResultOutput),
    },
    timeoutMs: 120000,
    execute: async (args: unknown, exec: ToolRunContext) => {
      const a = args as { task_id: string }
      exec.signal.throwIfAborted()
      const result: TaskResultResponse = await client().getTaskResult(a.task_id, exec.signal)
      const fileStems = Object.keys(result.results)
      const firstStem = fileStems[0]
      const firstResult = firstStem !== undefined ? result.results[firstStem] : undefined
      const mdContent = firstResult?.md_content ?? ''

      const rawResultPath = join(tmpdir(), `mineru-result-${a.task_id}.json`)
      await writeFile(rawResultPath, JSON.stringify(result, null, 2), 'utf8')

      const { content, truncated, fullMdPath } = await maybeTruncateMd(mdContent, config().maxMdOutputChars, a.task_id)

      const out: {
        task_id: string
        backend?: string
        version?: string
        file_stems?: string[]
        md_content?: string
        md_truncated?: boolean
        full_md_path?: string
        raw_result_path?: string
      } = {
        task_id: a.task_id,
        raw_result_path: rawResultPath,
      }
      if (result.backend) out.backend = result.backend
      if (result.version) out.version = result.version
      if (fileStems.length > 0) out.file_stems = fileStems
      if (content) out.md_content = content
      if (truncated) out.md_truncated = truncated
      if (fullMdPath) out.full_md_path = fullMdPath
      return out
    },
  }))

  ctx.tools.register(defineTool({
    name: 'mineru_parse_document',
    description:
      'Parse a local document (PDF, image, DOCX, PPTX, or XLSX) via MinerU and return the extracted markdown. '
      + 'This is the recommended high-level tool: it submits the file, polls until parsing completes (up to poll_timeout_ms), '
      + 'and returns the markdown content inline. For large documents or when you need to interleave other work, '
      + 'use mineru_submit_parse_job + mineru_get_parse_status + mineru_get_parse_result instead. '
      + 'The file must be a local filesystem path; if you only have a URL, download it first (e.g., via bash curl). '
      + "Default backend is 'pipeline' (hallucination-free, supports all languages).",
    parameters: {
      file_path: {
        type: 'string',
        required: true,
        description: 'Local filesystem path to the document (PDF, PNG, JPG, DOCX, PPTX, or XLSX).',
      },
      backend: {
        type: 'string',
        enum: MINERU_BACKENDS,
        description: "Parsing backend. 'pipeline': hallucination-free, multi-language. 'hybrid-engine': requires VLM model. Default: 'pipeline'.",
      },
      parse_method: {
        type: 'string',
        enum: MINERU_PARSE_METHODS,
        description: "Parse method (pipeline/hybrid only). 'auto': auto-detect. 'txt': text only (fast). 'ocr': force OCR.",
      },
      lang_list: {
        type: 'array',
        items: { type: 'string' },
        description: "Language codes for pipeline backend (e.g., 'ch'). Defaults to ['ch'].",
      },
      formula_enable: {
        type: 'boolean',
        description: 'Enable formula parsing. Default: true.',
      },
      table_enable: {
        type: 'boolean',
        description: 'Enable table parsing. Default: true.',
      },
      start_page_id: {
        type: 'integer',
        description: 'PDF page range start (0-indexed). Default: 0.',
      },
      end_page_id: {
        type: 'integer',
        description: 'PDF page range end (0-indexed, inclusive). Default: 99999 (all pages).',
      },
      return_middle_json: {
        type: 'boolean',
        description: 'Include middle JSON in the saved result file. Default: false.',
      },
      return_content_list: {
        type: 'boolean',
        description: 'Include content list JSON in the saved result file. Default: false.',
      },
      return_images: {
        type: 'boolean',
        description: 'Include extracted images in the saved result file. Default: false.',
      },
      poll_timeout_ms: {
        type: 'number',
        description: 'Maximum time (ms) to wait for parsing before timing out. Default: 600000 (10 min).',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          task_id: { type: 'string', required: true },
          status: { type: 'string', description: 'Parse status: "completed" or "failed".', required: true },
          backend: { type: 'string' },
          version: { type: 'string' },
          file_stems: { type: 'array', items: { type: 'string' } },
          md_content: { type: 'string', description: 'Parsed markdown content (truncated if very large).' },
          md_truncated: { type: 'boolean' },
          full_md_path: { type: 'string', description: 'Path to full markdown if truncated.' },
          error: { type: 'string', description: 'Error message if status is "failed".' },
        },
      },
      render: textRender(renderParseDocOutput),
    },
    timeoutMs: 900000,
    execute: async (args: unknown, exec: ToolRunContext) => {
      const a = args as ParseToolArgs & { poll_timeout_ms?: number }
      exec.signal.throwIfAborted()

      const cfg = config()
      const c = client()
      const submit = await c.submitTask(a.file_path, toParseParams(a, cfg), exec.signal)

      const pollTimeoutMs = a.poll_timeout_ms ?? cfg.pollTimeoutMs
      const finalStatus = await pollUntilDone(c, submit.task_id, {
        intervalMs: cfg.pollIntervalMs,
        timeoutMs: pollTimeoutMs,
        signal: exec.signal,
      })

      if (finalStatus.status === 'failed') {
        return {
          task_id: submit.task_id,
          status: 'failed' as const,
          error: finalStatus.error ?? 'Task failed without error message',
        }
      }

      const result = await c.getTaskResult(submit.task_id, exec.signal)
      const fileStems = Object.keys(result.results)
      const firstStem = fileStems[0]
      const firstResult = firstStem !== undefined ? result.results[firstStem] : undefined
      const mdContent = firstResult?.md_content ?? ''

      const { content, truncated, fullMdPath } = await maybeTruncateMd(mdContent, cfg.maxMdOutputChars, submit.task_id)

      const out: {
        task_id: string
        status: 'completed' | 'failed'
        backend?: string
        version?: string
        file_stems?: string[]
        md_content?: string
        md_truncated?: boolean
        full_md_path?: string
        error?: string
      } = {
        task_id: submit.task_id,
        status: 'completed' as const,
      }
      if (result.backend) out.backend = result.backend
      if (result.version) out.version = result.version
      if (fileStems.length > 0) out.file_stems = fileStems
      if (content) out.md_content = content
      if (truncated) out.md_truncated = truncated
      if (fullMdPath) out.full_md_path = fullMdPath
      return out
    },
  }))
}
