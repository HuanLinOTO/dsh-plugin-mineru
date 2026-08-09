import { useCallback, useEffect, useState } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { ClientConnectionRpc, RpcResult } from '@deepseek-ai/dsh-client-connection/client'
import type { MineruRuntimeConfig } from '../rpc.js'
import type { MineruKey } from './locales.js'
import css from './SettingsPage.module.css'

export interface MineruSettingsInjected {
  readonly rpc: ClientConnectionRpc
  readonly t: (key: string) => string
}

type SettingsPageProps = PropsRuntime<'settings.section'> & PropsLocale<'dsh-mineru'> & MineruSettingsInjected

type ConfigGetResult = RpcResult<{ readonly config: MineruRuntimeConfig }>
type ConfigSetResult = RpcResult<{ readonly config: MineruRuntimeConfig }>
type HealthResult = RpcResult<{ readonly status: string; readonly version?: string; readonly queued_tasks?: number; readonly processing_tasks?: number }>

const BACKENDS = ['pipeline', 'vlm-engine', 'hybrid-engine', 'vlm-http-client', 'hybrid-http-client'] as const
const PARSE_METHODS = ['auto', 'txt', 'ocr'] as const

async function callRpc<T>(rpc: ClientConnectionRpc, endpoint: string, payload: unknown): Promise<T> {
  return rpc.call('/api', endpoint, payload) as Promise<T>
}

export function SettingsPage({ rpc, t }: SettingsPageProps) {
  const [config, setConfig] = useState<MineruRuntimeConfig | null>(null)
  const [draft, setDraft] = useState<MineruRuntimeConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'healthy' | 'unhealthy' | 'error'>('idle')
  const [testMessage, setTestMessage] = useState<string | undefined>(undefined)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(undefined)
    try {
      const result = await callRpc<ConfigGetResult>(rpc, 'mineru/config.get', {})
      if (result.ok) {
        setConfig(result.value.config)
        setDraft(result.value.config)
      } else {
        setError(result.error.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [rpc])

  useEffect(() => { void refresh() }, [refresh])

  const save = useCallback(async () => {
    if (draft === null) return
    setSaving(true)
    setError(undefined)
    setSaved(false)
    try {
      const result = await callRpc<ConfigSetResult>(rpc, 'mineru/config.set', { config: draft })
      if (result.ok) {
        setConfig(result.value.config)
        setDraft(result.value.config)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } else {
        setError(result.error.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }, [draft, rpc])

  const testConnection = useCallback(async () => {
    if (draft === null) return
    setTestStatus('testing')
    setTestMessage(undefined)
    try {
      const result = await callRpc<HealthResult>(rpc, 'mineru/health', {})
      if (result.ok && result.value.status === 'healthy') {
        setTestStatus('healthy')
        const v = result.value.version ? ` v${result.value.version}` : ''
        const q = result.value.queued_tasks !== undefined ? ` (${result.value.queued_tasks} queued)` : ''
        setTestMessage(`${t('test.healthy')}${v}${q}`)
      } else if (result.ok) {
        setTestStatus('unhealthy')
        setTestMessage(t('test.unhealthy'))
      } else {
        setTestStatus('error')
        setTestMessage(result.error.message)
      }
    } catch (err) {
      setTestStatus('error')
      setTestMessage(err instanceof Error ? err.message : String(err))
    }
  }, [draft, rpc, t])

  const patch = (p: Partial<MineruRuntimeConfig>): void => {
    setDraft(prev => prev === null ? prev : { ...prev, ...p })
  }

  if (loading || draft === null) {
    return (
      <section className={css.section}>
        <h2 className={css.title}>{t('page.title')}</h2>
        <div className={css.loading}>…</div>
      </section>
    )
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(config)

  return (
    <section className={css.section}>
      <h2 className={css.title}>{t('page.title')}</h2>
      <p className={css.intro}>{t('page.intro')}</p>

      {error !== undefined && (
        <div className={css.error}>
          {error}
          <button type="button" className={css.errorDismiss} onClick={() => setError(undefined)}>×</button>
        </div>
      )}

      <div className={css.editor}>
        <label className={css.field}>
          <span className={css.fieldLabel}>{t('field.baseURL')}</span>
          <input
            className={css.input}
            value={draft.baseURL}
            placeholder={t('field.baseURL.placeholder')}
            onChange={e => patch({ baseURL: e.target.value })}
          />
        </label>

        <label className={css.field}>
          <span className={css.fieldLabel}>{t('field.apiKeyEnv')}</span>
          <input
            className={css.input}
            value={draft.apiKeyEnv}
            placeholder={t('field.apiKeyEnv.placeholder')}
            onChange={e => patch({ apiKeyEnv: e.target.value })}
          />
        </label>

        <div className={css.row}>
          <label className={css.field}>
            <span className={css.fieldLabel}>{t('field.defaultBackend')}</span>
            <select
              className={css.select}
              value={draft.defaultBackend}
              onChange={e => patch({ defaultBackend: e.target.value })}
            >
              {BACKENDS.map(b => (
                <option key={b} value={b}>{t(`backend.${b}` as MineruKey)}</option>
              ))}
            </select>
          </label>

          <label className={css.field}>
            <span className={css.fieldLabel}>{t('field.defaultParseMethod')}</span>
            <select
              className={css.select}
              value={draft.defaultParseMethod}
              onChange={e => patch({ defaultParseMethod: e.target.value })}
            >
              {PARSE_METHODS.map(m => (
                <option key={m} value={m}>{t(`parse.${m}` as MineruKey)}</option>
              ))}
            </select>
          </label>
        </div>

        <div className={css.row}>
          <label className={css.field}>
            <span className={css.fieldLabel}>{t('field.defaultLang')}</span>
            <input
              className={css.input}
              value={draft.defaultLang}
              onChange={e => patch({ defaultLang: e.target.value })}
            />
          </label>

          <label className={css.field}>
            <span className={css.fieldLabel}>{t('field.pollIntervalMs')}</span>
            <input
              type="number"
              className={css.input}
              value={draft.pollIntervalMs}
              onChange={e => patch({ pollIntervalMs: Number(e.target.value) })}
            />
          </label>
        </div>

        <div className={css.row}>
          <label className={css.field}>
            <span className={css.fieldLabel}>{t('field.pollTimeoutMs')}</span>
            <input
              type="number"
              className={css.input}
              value={draft.pollTimeoutMs}
              onChange={e => patch({ pollTimeoutMs: Number(e.target.value) })}
            />
          </label>

          <label className={css.field}>
            <span className={css.fieldLabel}>{t('field.requestTimeoutMs')}</span>
            <input
              type="number"
              className={css.input}
              value={draft.requestTimeoutMs}
              onChange={e => patch({ requestTimeoutMs: Number(e.target.value) })}
            />
          </label>
        </div>

        <label className={css.field}>
          <span className={css.fieldLabel}>{t('field.maxMdOutputChars')}</span>
          <input
            type="number"
            className={css.input}
            value={draft.maxMdOutputChars}
            onChange={e => patch({ maxMdOutputChars: Number(e.target.value) })}
          />
        </label>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.primaryButton}
          onClick={() => void save()}
          disabled={!dirty || saving}
        >
          {saving ? '…' : saved ? t('action.saved') : t('action.save')}
        </button>
        <button
          type="button"
          className={css.secondaryButton}
          onClick={() => void testConnection()}
          disabled={testStatus === 'testing'}
        >
          {testStatus === 'testing' ? t('action.testing') : t('action.test')}
        </button>
        {testStatus === 'healthy' && testMessage !== undefined && (
          <span className={css.testOk}>{testMessage}</span>
        )}
        {testStatus === 'unhealthy' && testMessage !== undefined && (
          <span className={css.testWarn}>{testMessage}</span>
        )}
        {testStatus === 'error' && testMessage !== undefined && (
          <span className={css.testErr}>{t('test.error')}: {testMessage}</span>
        )}
      </div>
    </section>
  )
}
