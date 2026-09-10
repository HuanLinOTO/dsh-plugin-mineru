import type { Context } from '@deepseek-ai/cordis'
import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client'
import type {} from '@deepseek-ai/dsh-client-connection/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import { SettingsPage, type MineruSettingsInjected } from './SettingsPage.js'
import { en, NS, zh, type MineruKey } from './locales.js'
import { dicts } from './dictionaries.js'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'dsh-mineru': MineruKey
  }
}

export const inject = ['slots', 'locale', 'connection']

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-mineru: dictionaries')

  ctx.effect(() => {
    const disposers = Object.entries(dicts).map(([locale, dict]) =>
      ctx.locale.register(NS, locale, dict),
    )
    return () => {
      for (const dispose of disposers) dispose()
    }
  }, 'dsh-mineru: language-pack dictionaries')

  const connection = ctx.connection as unknown as ConnectionHandle
  const t = ctx.locale.bind(NS)

  const settingsInjected = (): MineruSettingsInjected => ({
    rpc: connection.rpc,
  })

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'dsh-mineru',
    order: 40,
    label: () => t('nav'),
    locale: NS,
    inject: settingsInjected,
  }, SettingsPage))
}
