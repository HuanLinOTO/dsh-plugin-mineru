/**
 * Locale meta spec for the Plugins-page display contract (dsh app-boot
 * `package-meta`): `locale/en.json` anchors the localization, every
 * `locale/*.json` must be reachable through the exports glob, and
 * `meta.title` / `meta.description` must be non-empty strings.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const root = new URL('..', import.meta.url)

type LocaleMeta = { meta?: { title?: unknown; description?: unknown } }

function readJson(relative: string): LocaleMeta {
  return JSON.parse(readFileSync(new URL(relative, root), 'utf8')) as LocaleMeta
}

function nonEmpty(value: unknown): boolean {
  return typeof value === 'string' && value.trim() !== ''
}

describe('locale meta (Plugins-page display contract)', () => {
  it('ships exactly en.json and zh.json as language files', () => {
    expect(readdirSync(new URL('locale/', root)).sort()).toEqual(['en.json', 'zh.json'])
  })

  it('keeps meta.title and meta.description non-empty in every language', () => {
    for (const language of ['en', 'zh']) {
      const meta = readJson(`locale/${language}.json`).meta
      expect(meta, `${language}: meta`).toBeTypeOf('object')
      expect(nonEmpty(meta?.title), `${language}: meta.title non-empty`).toBe(true)
      expect(nonEmpty(meta?.description), `${language}: meta.description non-empty`).toBe(true)
    }
  })

  it('exports the locale glob and ships the directory in files', () => {
    const pkg = readJson('package.json') as LocaleMeta & {
      exports?: Record<string, unknown>
      files?: string[]
    }
    expect(pkg.exports?.['./locale/*.json']).toBe('./locale/*.json')
    expect(pkg.files).toContain('locale/')
  })
})
