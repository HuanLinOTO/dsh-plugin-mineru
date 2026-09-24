import { useCallback, useState, type ReactNode } from 'react'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { MineruFormValues, MineruSettingsState } from './settings-form.js'
import type { MineruKey } from './locales.js'
import css from './SettingsPage.module.css'

/** Normalized outcome of one `mineru.health` probe (Host RPC). */
export type HealthProbe =
  | { readonly ok: true; readonly status: string; readonly version?: string; readonly queued_tasks?: number }
  | { readonly ok: false; readonly message: string }

/** Injected dependencies of the row config card (slot `inject`). */
export interface MineruSettingsInjected {
  hooks: {
    /** Card snapshot bound by the renderer as useMineruSettings. */
    mineruSettings: SnapshotStore<MineruSettingsState>
  }
  /** Stage one field edit. */
  edit: <K extends keyof MineruFormValues>(field: K, value: MineruFormValues[K]) => void
  /** Write every staged edit through the config form. */
  save: () => void
  /** Probe the configured MinerU server (`mineru.health` Host RPC). */
  probeHealth: () => Promise<HealthProbe>
}

type SettingsPageProps = PropsRuntime<'plugins.row.config'> & PropsLocale<'dsh-mineru'> & InjectFace<MineruSettingsInjected>

const BACKENDS = ['pipeline', 'vlm-engine', 'hybrid-engine', 'vlm-http-client', 'hybrid-http-client'] as const
const PARSE_METHODS = ['auto', 'txt', 'ocr'] as const

export function SettingsPage(props: SettingsPageProps): ReactNode {
  const { t } = props
  // The row page draws the title, icon, and crumb itself; `summary` is only
  // the fallback one-liner the page shows when the row carries no
  // description of its own.
  if (props.view === 'summary') return t('page.summary')

  const state = props.useMineruSettings(snapshot => snapshot)
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'healthy' | 'unhealthy' | 'error'>('idle')
  const [testMessage, setTestMessage] = useState<string | undefined>(undefined)

  const testConnection = useCallback(async () => {
    setTestStatus('testing')
    setTestMessage(undefined)
    try {
      const result = await props.probeHealth()
      if (result.ok && result.status === 'healthy') {
        setTestStatus('healthy')
        const v = result.version ? ` v${result.version}` : ''
        const q = result.queued_tasks !== undefined ? ` (${result.queued_tasks} queued)` : ''
        setTestMessage(`${t('test.healthy')}${v}${q}`)
      } else if (result.ok) {
        setTestStatus('unhealthy')
        setTestMessage(t('test.unhealthy'))
      } else {
        setTestStatus('error')
        setTestMessage(result.message)
      }
    } catch (err) {
      setTestStatus('error')
      setTestMessage(err instanceof Error ? err.message : String(err))
    }
  }, [props, t])

  if (state.status !== 'ready') {
    return (
      <section className={css.section}>
        <div className={css.loading}>{state.status === 'loading' ? '…' : t('page.unavailable')}</div>
      </section>
    )
  }

  const { values } = state

  return (
    <section className={css.section}>
      {!state.writable && <p className={css.loading}>{t('page.readOnly')}</p>}
      {state.failed && <div className={css.error}>{t('action.saveFailed')}</div>}

      <div className={css.editor}>
        <label className={css.field}>
          <span className={css.fieldLabel}>{t('field.baseURL')}</span>
          <input
            className={css.input}
            value={values.baseURL}
            placeholder={t('field.baseURL.placeholder')}
            onChange={e => props.edit('baseURL', e.target.value)}
          />
        </label>

        <label className={css.field}>
          <span className={css.fieldLabel}>{t('field.apiKeyEnv')}</span>
          <input
            className={css.input}
            value={values.apiKeyEnv}
            placeholder={t('field.apiKeyEnv.placeholder')}
            onChange={e => props.edit('apiKeyEnv', e.target.value)}
          />
        </label>

        <div className={css.row}>
          <label className={css.field}>
            <span className={css.fieldLabel}>{t('field.defaultBackend')}</span>
            <select
              className={css.select}
              value={values.defaultBackend}
              onChange={e => props.edit('defaultBackend', e.target.value)}
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
              value={values.defaultParseMethod}
              onChange={e => props.edit('defaultParseMethod', e.target.value)}
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
              value={values.defaultLang}
              onChange={e => props.edit('defaultLang', e.target.value)}
            />
          </label>

          <label className={css.field}>
            <span className={css.fieldLabel}>{t('field.pollIntervalMs')}</span>
            <input
              type="number"
              className={css.input}
              value={values.pollIntervalMs}
              onChange={e => props.edit('pollIntervalMs', Number(e.target.value))}
            />
          </label>
        </div>

        <div className={css.row}>
          <label className={css.field}>
            <span className={css.fieldLabel}>{t('field.pollTimeoutMs')}</span>
            <input
              type="number"
              className={css.input}
              value={values.pollTimeoutMs}
              onChange={e => props.edit('pollTimeoutMs', Number(e.target.value))}
            />
          </label>

          <label className={css.field}>
            <span className={css.fieldLabel}>{t('field.requestTimeoutMs')}</span>
            <input
              type="number"
              className={css.input}
              value={values.requestTimeoutMs}
              onChange={e => props.edit('requestTimeoutMs', Number(e.target.value))}
            />
          </label>
        </div>

        <label className={css.field}>
          <span className={css.fieldLabel}>{t('field.maxMdOutputChars')}</span>
          <input
            type="number"
            className={css.input}
            value={values.maxMdOutputChars}
            onChange={e => props.edit('maxMdOutputChars', Number(e.target.value))}
          />
        </label>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.primaryButton}
          onClick={props.save}
          disabled={!state.dirty || state.saving || !state.writable}
        >
          {state.saving ? '…' : state.saved ? t('action.saved') : t('action.save')}
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
