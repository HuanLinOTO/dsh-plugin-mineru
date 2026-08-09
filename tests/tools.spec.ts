import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { writeFile, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

vi.mock('@deepseek-ai/dsh-tools', () => ({
  defineTool: vi.fn((opts: unknown) => opts),
}))

import {
  mimeTypeForExt,
  buildFormData,
  sleep,
  pollUntilDone,
  MineRUClient,
  MineRUError,
} from '../src/client.js'
import {
  maybeTruncateMd,
  renderHealthOutput,
  renderSubmitOutput,
  renderStatusOutput,
  renderResultOutput,
  renderParseDocOutput,
} from '../src/tools.js'

function mockResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function makeClient(apiKeyResolver?: () => Promise<string | undefined>): MineRUClient {
  return new MineRUClient({
    baseURL: 'http://test:18000',
    timeoutMs: 5000,
    ...apiKeyResolver ? { apiKeyResolver } : {},
  })
}

const mockFetch = vi.fn()

beforeEach(() => {
  mockFetch.mockReset()
  vi.stubGlobal('fetch', mockFetch)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('mimeTypeForExt', () => {
  it('returns correct MIME for known extensions', () => {
    expect(mimeTypeForExt('.pdf')).toBe('application/pdf')
    expect(mimeTypeForExt('.PNG')).toBe('image/png')
    expect(mimeTypeForExt('.docx')).toContain('wordprocessingml')
    expect(mimeTypeForExt('.pptx')).toContain('presentationml')
    expect(mimeTypeForExt('.xlsx')).toContain('spreadsheetml')
  })

  it('returns octet-stream for unknown extensions', () => {
    expect(mimeTypeForExt('.xyz')).toBe('application/octet-stream')
  })
})

describe('sleep', () => {
  it('resolves after the specified duration', async () => {
    const controller = new AbortController()
    await sleep(10, controller.signal)
    expect(controller.signal.aborted).toBe(false)
  })

  it('rejects when signal is already aborted', async () => {
    const controller = new AbortController()
    controller.abort()
    await expect(sleep(10, controller.signal)).rejects.toThrow('Aborted')
  })

  it('rejects when signal aborts during sleep', async () => {
    const controller = new AbortController()
    const promise = sleep(1000, controller.signal)
    setTimeout(() => controller.abort(), 5)
    await expect(promise).rejects.toThrow('Aborted')
  })
})

describe('buildFormData', () => {
  it('builds form with file and params', async () => {
    const tmpFile = join(tmpdir(), `mineru-test-${Date.now()}.pdf`)
    await writeFile(tmpFile, Buffer.from('%PDF-1.4 test content'))

    try {
      const form = await buildFormData(tmpFile, {
        backend: 'pipeline',
        parse_method: 'auto',
        formula_enable: true,
        table_enable: false,
        return_md: true,
        start_page_id: 0,
        end_page_id: 5,
        lang_list: ['ch', 'en'],
      })

      expect(form.get('backend')).toBe('pipeline')
      expect(form.get('parse_method')).toBe('auto')
      expect(form.get('formula_enable')).toBe('true')
      expect(form.get('table_enable')).toBe('false')
      expect(form.get('return_md')).toBe('true')
      expect(form.get('start_page_id')).toBe('0')
      expect(form.get('end_page_id')).toBe('5')
      expect(form.get('files')).not.toBeNull()
      expect(typeof form.get('files')).not.toBe('string')

      const langEntries = form.getAll('lang_list')
      expect(langEntries).toEqual(['ch', 'en'])
    } finally {
      await rm(tmpFile, { force: true })
    }
  })

  it('omits undefined params', async () => {
    const tmpFile = join(tmpdir(), `mineru-test-${Date.now()}.pdf`)
    await writeFile(tmpFile, Buffer.from('test'))

    try {
      const form = await buildFormData(tmpFile, { backend: 'pipeline' })
      expect(form.get('backend')).toBe('pipeline')
      expect(form.get('parse_method')).toBeNull()
      expect(form.get('formula_enable')).toBeNull()
    } finally {
      await rm(tmpFile, { force: true })
    }
  })
})

describe('pollUntilDone', () => {
  it('polls until completed', async () => {
    const mockClient = {
      getTaskStatus: vi.fn()
        .mockResolvedValueOnce({ task_id: 't1', status: 'pending' })
        .mockResolvedValueOnce({ task_id: 't1', status: 'processing' })
        .mockResolvedValueOnce({ task_id: 't1', status: 'completed' }),
    } as unknown as MineRUClient

    const result = await pollUntilDone(mockClient, 't1', {
      intervalMs: 1,
      timeoutMs: 5000,
      signal: new AbortController().signal,
    })

    expect(result.status).toBe('completed')
    expect(mockClient.getTaskStatus).toHaveBeenCalledTimes(3)
  })

  it('returns immediately when failed', async () => {
    const mockClient = {
      getTaskStatus: vi.fn()
        .mockResolvedValueOnce({ task_id: 't1', status: 'failed', error: 'boom' }),
    } as unknown as MineRUClient

    const result = await pollUntilDone(mockClient, 't1', {
      intervalMs: 1,
      timeoutMs: 5000,
      signal: new AbortController().signal,
    })

    expect(result.status).toBe('failed')
    expect(result.error).toBe('boom')
    expect(mockClient.getTaskStatus).toHaveBeenCalledTimes(1)
  })

  it('throws on timeout', async () => {
    const mockClient = {
      getTaskStatus: vi.fn().mockResolvedValue({ task_id: 't1', status: 'pending' }),
    } as unknown as MineRUClient

    await expect(pollUntilDone(mockClient, 't1', {
      intervalMs: 1,
      timeoutMs: 20,
      signal: new AbortController().signal,
    })).rejects.toThrow('timed out')
  })
})

describe('maybeTruncateMd', () => {
  it('does not truncate when under limit', async () => {
    const result = await maybeTruncateMd('hello world', 100, 't1')
    expect(result.content).toBe('hello world')
    expect(result.truncated).toBe(false)
    expect(result.fullMdPath).toBeUndefined()
  })

  it('truncates and saves full content when over limit', async () => {
    const longMd = 'x'.repeat(200)
    const result = await maybeTruncateMd(longMd, 100, 't2')
    expect(result.truncated).toBe(true)
    expect(result.fullMdPath).toBeDefined()
    expect(result.content.length).toBeLessThan(longMd.length)
    expect(result.content).toContain('truncated')

    const saved = await readFile(result.fullMdPath!, 'utf8')
    expect(saved).toBe(longMd)
    await rm(result.fullMdPath!, { force: true })
  })
})

describe('MineRUClient', () => {
  it('health calls GET /health and returns parsed response', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({
      status: 'healthy',
      version: '3.4.4',
      protocol_version: 2,
      queued_tasks: 0,
      processing_tasks: 0,
      completed_tasks: 4,
      failed_tasks: 0,
      max_concurrent_requests: 3,
      processing_window_size: 64,
      task_retention_seconds: 86400,
      task_cleanup_interval_seconds: 300,
    }))

    const client = makeClient()
    const result = await client.health(new AbortController().signal)

    expect(result.status).toBe('healthy')
    expect(result.version).toBe('3.4.4')
    expect(result.max_concurrent_requests).toBe(3)
    expect(mockFetch).toHaveBeenCalledWith(
      'http://test:18000/health',
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('submitTask calls POST /tasks with FormData', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({
      task_id: 'abc-123',
      status: 'pending',
      backend: 'pipeline',
      file_names: ['test'],
      created_at: '2026-01-01T00:00:00Z',
      started_at: null,
      completed_at: null,
      error: null,
      status_url: 'http://test:18000/tasks/abc-123',
      result_url: 'http://test:18000/tasks/abc-123/result',
    }, 202))

    const tmpFile = join(tmpdir(), `mineru-test-${Date.now()}.pdf`)
    await writeFile(tmpFile, Buffer.from('%PDF-1.4 test'))

    try {
      const client = makeClient()
      const result = await client.submitTask(tmpFile, { backend: 'pipeline' }, new AbortController().signal)

      expect(result.task_id).toBe('abc-123')
      expect(result.status).toBe('pending')
      expect(mockFetch).toHaveBeenCalledWith(
        'http://test:18000/tasks',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        }),
      )
    } finally {
      await rm(tmpFile, { force: true })
    }
  })

  it('getTaskStatus calls GET /tasks/{id}', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({
      task_id: 't1',
      status: 'completed',
      backend: 'pipeline',
      file_names: ['doc'],
      created_at: null,
      started_at: null,
      completed_at: null,
      error: null,
      status_url: 'http://test:18000/tasks/t1',
      result_url: 'http://test:18000/tasks/t1/result',
    }))

    const client = makeClient()
    const result = await client.getTaskStatus('t1', new AbortController().signal)

    expect(result.status).toBe('completed')
    expect(mockFetch).toHaveBeenCalledWith(
      'http://test:18000/tasks/t1',
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('getTaskResult returns parsed result on 200', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({
      backend: 'pipeline',
      version: '3.4.4',
      results: {
        doc: { md_content: '# Hello\n\nWorld' },
      },
    }))

    const client = makeClient()
    const result = await client.getTaskResult('t1', new AbortController().signal)

    expect(result.backend).toBe('pipeline')
    expect(result.results['doc']?.md_content).toBe('# Hello\n\nWorld')
  })

  it('getTaskResult throws MineRUError on 202 (not ready)', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({
      task_id: 't1',
      status: 'processing',
      message: 'Task result is not ready yet',
    }, 202))

    const client = makeClient()
    await expect(client.getTaskResult('t1', new AbortController().signal))
      .rejects.toThrow('returned 202')
  })

  it('getTaskResult throws MineRUError on 404', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ detail: 'Task not found' }, 404))

    const client = makeClient()
    await expect(client.getTaskResult('nope', new AbortController().signal))
      .rejects.toThrow('returned 404')
  })

  it('throws MineRUError on non-JSON response', async () => {
    mockFetch.mockResolvedValueOnce(new Response('not json', {
      status: 200,
      headers: { 'content-type': 'text/plain' },
    }))

    const client = makeClient()
    await expect(client.health(new AbortController().signal))
      .rejects.toThrow('non-JSON')
  })

  it('sends Authorization header when apiKeyResolver returns a key', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({
      status: 'healthy',
      version: '3.4.4',
      protocol_version: 2,
      queued_tasks: 0,
      processing_tasks: 0,
      completed_tasks: 0,
      failed_tasks: 0,
      max_concurrent_requests: 3,
      processing_window_size: 64,
      task_retention_seconds: 86400,
      task_cleanup_interval_seconds: 300,
    }))

    const client = new MineRUClient({
      baseURL: 'http://test:18000',
      timeoutMs: 5000,
      apiKeyResolver: async () => 'secret-key',
    })

    await client.health(new AbortController().signal)

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test:18000/health',
      expect.objectContaining({
        headers: { authorization: 'Bearer secret-key' },
        redirect: 'error',
      }),
    )
  })

  it('strips trailing slashes from baseURL', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({
      status: 'healthy',
      version: '3.4.4',
      protocol_version: 2,
      queued_tasks: 0,
      processing_tasks: 0,
      completed_tasks: 0,
      failed_tasks: 0,
      max_concurrent_requests: 3,
      processing_window_size: 64,
      task_retention_seconds: 86400,
      task_cleanup_interval_seconds: 300,
    }))

    const client = new MineRUClient({ baseURL: 'http://test:18000///', timeoutMs: 5000 })
    await client.health(new AbortController().signal)

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test:18000/health',
      expect.anything(),
    )
  })
})

describe('MineRUError', () => {
  it('carries status and body', () => {
    const err = new MineRUError('test message', 404, { detail: 'not found' })
    expect(err.message).toBe('test message')
    expect(err.status).toBe(404)
    expect(err.body).toEqual({ detail: 'not found' })
    expect(err.name).toBe('MineRUError')
  })
})

describe('render functions', () => {
  it('renderHealthOutput', () => {
    const text = renderHealthOutput({
      status: 'healthy',
      version: '3.4.4',
      queued_tasks: 2,
      processing_tasks: 1,
      completed_tasks: 5,
      failed_tasks: 0,
      max_concurrent_requests: 3,
    })
    expect(text).toContain('healthy')
    expect(text).toContain('3.4.4')
    expect(text).toContain('2 queued')
    expect(text).toContain('3 max concurrent')
  })

  it('renderSubmitOutput', () => {
    const text = renderSubmitOutput({
      task_id: 'abc-123',
      status: 'pending',
      status_url: 'http://test/tasks/abc-123',
      result_url: 'http://test/tasks/abc-123/result',
      queued_ahead: 2,
    })
    expect(text).toContain('abc-123')
    expect(text).toContain('pending')
    expect(text).toContain('Queued ahead: 2')
    expect(text).toContain('mineru_get_parse_status')
  })

  it('renderStatusOutput', () => {
    const text = renderStatusOutput({
      task_id: 't1',
      status: 'completed',
      file_names: ['doc'],
      error: null,
    })
    expect(text).toContain('completed')
    expect(text).toContain('Files: doc')
  })

  it('renderResultOutput with markdown', () => {
    const text = renderResultOutput({
      task_id: 't1',
      backend: 'pipeline',
      version: '3.4.4',
      file_stems: ['doc'],
      md_content: '# Hello',
      raw_result_path: '/tmp/result.json',
    })
    expect(text).toContain('# Hello')
    expect(text).toContain('/tmp/result.json')
  })

  it('renderParseDocOutput completed', () => {
    const text = renderParseDocOutput({
      task_id: 't1',
      status: 'completed',
      backend: 'pipeline',
      version: '3.4.4',
      file_stems: ['doc'],
      md_content: '# Parsed content',
    })
    expect(text).toContain('completed')
    expect(text).toContain('# Parsed content')
  })

  it('renderParseDocOutput failed', () => {
    const text = renderParseDocOutput({
      task_id: 't1',
      status: 'failed',
      error: 'OCR engine crashed',
    })
    expect(text).toContain('failed')
    expect(text).toContain('OCR engine crashed')
  })

  it('renderParseDocOutput truncated', () => {
    const text = renderParseDocOutput({
      task_id: 't1',
      status: 'completed',
      md_content: 'truncated content...',
      md_truncated: true,
      full_md_path: '/tmp/full.md',
    })
    expect(text).toContain('truncated')
    expect(text).toContain('/tmp/full.md')
  })
})
