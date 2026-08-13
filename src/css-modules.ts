import { readFile } from 'node:fs/promises'
import { basename, dirname, resolve as resolvePath } from 'node:path'
import { existsSync } from 'node:fs'

const ID = '@huanlin/dsh-plugin-mineru'

const CSS_VIRTUAL_PREFIX = '\0dsh-css:'
const CSS_VIRTUAL_SUFFIX = '.mjs'

/** Resolve a CSS import source against its importer (mirrors yet-another-subagent). */
function resolveCssPath(source: string, importer: string | undefined): string {
  if (importer === undefined) return source
  const resolved = resolvePath(dirname(importer), source)
  if (existsSync(resolved)) return resolved
  return resolved
}

function transformCssModules(filename: string, source: Buffer): { classMap: Record<string, string>; cssText: string } {
  const hash = Array.from(filename).reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0, 0).toString(36).replace('-', '')
  const cssText = source.toString('utf8')
  const classMap: Record<string, string> = {}
  const classPattern = /\.([a-zA-Z_][a-zA-Z0-9_-]*)/g
  let match: RegExpExecArray | null
  while ((match = classPattern.exec(cssText)) !== null) {
    const local = match[1]
    if (local !== undefined && classMap[local] === undefined) {
      classMap[local] = `${hash}_${local}`
    }
  }
  const transformedCss = cssText.replace(/\.([a-zA-Z_][a-zA-Z0-9_-]*)/g, (full, name: string) => {
    if (classMap[name] !== undefined) return `.${classMap[name]}`
    return full
  })
  return { classMap, cssText: transformedCss }
}

export const cssModulesPlugin = {
  name: 'dsh-css-modules-inline',
  resolveId(source: string, importer: string | undefined) {
    if (!source.endsWith('.module.css')) return null
    const abs = resolveCssPath(source, importer)
    return CSS_VIRTUAL_PREFIX + abs + CSS_VIRTUAL_SUFFIX
  },
  async load(virtualId: string) {
    if (!virtualId.startsWith(CSS_VIRTUAL_PREFIX)) return null
    const fileId = virtualId.slice(CSS_VIRTUAL_PREFIX.length, -CSS_VIRTUAL_SUFFIX.length)
    const source = await readFile(fileId)
    const { classMap, cssText } = transformCssModules(fileId, source)
    const tagId = `${ID}/${basename(fileId)}`
    return [
      `const css = ${JSON.stringify(cssText)};`,
      `const classMap = ${JSON.stringify(classMap)};`,
      `const tagId = ${JSON.stringify(tagId)};`,
      'if (typeof document !== \'undefined\' && document.querySelector(\'style[data-plugin-css=\' + JSON.stringify(tagId) + \']\') === null) {',
      '  const tag = document.createElement(\'style\');',
      `  tag.dataset.plugin = ${JSON.stringify(ID)};`,
      '  tag.dataset.pluginCss = tagId;',
      '  tag.textContent = css;',
      '  document.head.appendChild(tag);',
      '} else if (typeof document !== \'undefined\') {',
      '  const existing = document.querySelector(\'style[data-plugin-css=\' + JSON.stringify(tagId) + \']\');',
      '  if (existing) existing.textContent = css;',
      '}',
      'export default classMap;',
    ].join('\n')
  },
}

export const CLIENT_EXTERNALS = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'cordis',
  '@deepseek-ai/dsh-client-runtime',
  '@deepseek-ai/dsh-client-runtime/client',
  '@deepseek-ai/dsh-client-locale',
  '@deepseek-ai/dsh-client-locale/client',
  '@deepseek-ai/dsh-client-connection',
  '@deepseek-ai/dsh-client-connection/client',
  '@deepseek-ai/dsh-client-ui-settings',
  '@deepseek-ai/dsh-client-ui-settings/client',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-ui-primitives',
]

export const CLIENT_ID = ID
