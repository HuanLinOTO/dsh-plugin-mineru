export type MineruKey =
  | 'nav'
  | 'page.title'
  | 'page.intro'
  | 'field.baseURL'
  | 'field.baseURL.placeholder'
  | 'field.apiKeyEnv'
  | 'field.apiKeyEnv.placeholder'
  | 'field.defaultBackend'
  | 'field.defaultParseMethod'
  | 'field.defaultLang'
  | 'field.pollIntervalMs'
  | 'field.pollTimeoutMs'
  | 'field.requestTimeoutMs'
  | 'field.maxMdOutputChars'
  | 'action.save'
  | 'action.saved'
  | 'action.test'
  | 'action.testing'
  | 'test.healthy'
  | 'test.unhealthy'
  | 'test.error'
  | 'backend.pipeline'
  | 'backend.vlm-engine'
  | 'backend.hybrid-engine'
  | 'backend.vlm-http-client'
  | 'backend.hybrid-http-client'
  | 'parse.auto'
  | 'parse.txt'
  | 'parse.ocr'

export const NS = 'dsh-mineru'

export const en: Record<MineruKey, string> = {
  'nav': 'MinerU',
  'page.title': 'MinerU Configuration',
  'page.intro': 'Configure the MinerU document parsing server. Changes apply immediately to all mineru_* tools.',
  'field.baseURL': 'API Base URL',
  'field.baseURL.placeholder': 'http://your-mineru-host:18000',
  'field.apiKeyEnv': 'API Key Env Var',
  'field.apiKeyEnv.placeholder': 'MINERU_API_KEY',
  'field.defaultBackend': 'Default Backend',
  'field.defaultParseMethod': 'Default Parse Method',
  'field.defaultLang': 'Default Language',
  'field.pollIntervalMs': 'Poll Interval (ms)',
  'field.pollTimeoutMs': 'Poll Timeout (ms)',
  'field.requestTimeoutMs': 'Request Timeout (ms)',
  'field.maxMdOutputChars': 'Max Markdown Output Chars',
  'action.save': 'Save',
  'action.saved': 'Saved',
  'action.test': 'Test Connection',
  'action.testing': 'Testing…',
  'test.healthy': 'Healthy',
  'test.unhealthy': 'Unhealthy',
  'test.error': 'Connection failed',
  'backend.pipeline': 'pipeline (no VLM, multi-language)',
  'backend.vlm-engine': 'vlm-engine (VLM only)',
  'backend.hybrid-engine': 'hybrid-engine (VLM + pipeline)',
  'backend.vlm-http-client': 'vlm-http-client',
  'backend.hybrid-http-client': 'hybrid-http-client',
  'parse.auto': 'auto',
  'parse.txt': 'txt (text only, no OCR)',
  'parse.ocr': 'ocr (force OCR)',
}

export const zh: Record<MineruKey, string> = {
  'nav': 'MinerU',
  'page.title': 'MinerU 配置',
  'page.intro': '配置 MinerU 文档解析服务器。修改后立即对所有 mineru_* 工具生效。',
  'field.baseURL': 'API 地址',
  'field.baseURL.placeholder': 'http://your-mineru-host:18000',
  'field.apiKeyEnv': 'API Key 环境变量',
  'field.apiKeyEnv.placeholder': 'MINERU_API_KEY',
  'field.defaultBackend': '默认后端',
  'field.defaultParseMethod': '默认解析方式',
  'field.defaultLang': '默认语言',
  'field.pollIntervalMs': '轮询间隔 (ms)',
  'field.pollTimeoutMs': '轮询超时 (ms)',
  'field.requestTimeoutMs': '请求超时 (ms)',
  'field.maxMdOutputChars': 'Markdown 输出字符上限',
  'action.save': '保存',
  'action.saved': '已保存',
  'action.test': '测试连接',
  'action.testing': '测试中…',
  'test.healthy': '健康',
  'test.unhealthy': '异常',
  'test.error': '连接失败',
  'backend.pipeline': 'pipeline（无 VLM，多语言）',
  'backend.vlm-engine': 'vlm-engine（仅 VLM）',
  'backend.hybrid-engine': 'hybrid-engine（VLM + pipeline）',
  'backend.vlm-http-client': 'vlm-http-client',
  'backend.hybrid-http-client': 'hybrid-http-client',
  'parse.auto': 'auto',
  'parse.txt': 'txt（仅文本，不 OCR）',
  'parse.ocr': 'ocr（强制 OCR）',
}
