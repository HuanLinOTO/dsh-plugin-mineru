import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client'
import type {} from '@deepseek-ai/dsh-client-connection/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { SettingsPage, type MineruSettingsInjected } from './SettingsPage.js'
import { en, NS, zh, type MineruKey } from './locales.js'
import { dicts } from './dictionaries.js'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'dsh-mineru': MineruKey
  }
}

export const inject = ['slots', 'locale', 'connection']

export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-mineru: dictionaries')

  ctx.effect(() => {
    let dispose: (() => void) | undefined
    const sync = (): void => {
      dispose?.()
      dispose = undefined
      const store = ctx.get('betterLocale') as
        | { register(ns: string, dicts: Record<string, Record<string, string>>): () => void }
        | undefined
      if (store !== undefined) {
        dispose = store.register(NS, dicts)
      }
    }
    sync()
    const unsubscribe = ctx.locale.subscribe(sync)
    return () => {
      unsubscribe()
      dispose?.()
    }
  }, 'dsh-mineru: better-locale override dicts')

  const connection = ctx.connection as unknown as ConnectionHandle
  const t = ctx.locale.bind(NS) as (key: string) => string

  const settingsInjected = (): MineruSettingsInjected => ({
    rpc: connection.rpc,
    t,
  })

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'dsh-mineru',
    order: 40,
    label: () => t('nav'),
    inject: settingsInjected,
  }, SettingsPage))
}
