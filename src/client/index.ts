/**
 * dsh-mineru browser half: registers the MinerU configuration card into the
 * Plugins page's `plugins.row.config` slot, keyed `<package>#<row id>` (dsh
 * 0.1.7-rc.1 retired the rc.2 plugin-config card slot and the Settings-panel
 * section entry — a bundle row's shared settings entry point is the row's
 * configure page on the Plugins manager).
 *
 * The settings transport stays `ctx.configForms` (`DSH-0.1.7-J1-27`): this
 * half binds the host entry's shared `ConfigForm` through
 * `ctx.configForms.get('dsh-mineru')` (the entry id in `cordis.patch.yml`),
 * stages edits in a controller, and writes through `form.set` on save. Reads
 * ride the settings describe mirror; writes persist per profile in
 * `cordis.patch.yml` and hot-reload the running host instance in place.
 *
 * The `Test connection` button still probes the MinerU server through one
 * Host RPC endpoint (`mineru.health`), served as an exact Fetch route on the
 * shared `/api` channel.
 */

import type { Context } from '@deepseek-ai/cordis'
import type { ConnectionHandle, RpcResult } from '@deepseek-ai/dsh-client-connection/client'
import type {} from '@deepseek-ai/dsh-client-connection/client'
import type {} from '@deepseek-ai/dsh-client-connection'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: pulls the Plugins page SlotMap merge (the 'plugins.row.config'
// keyed row — this half's registration target).
import type {} from '@deepseek-ai/dsh-client-ui-plugin-manager/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import { SettingsPage, type HealthProbe, type MineruSettingsInjected } from './SettingsPage.js'
import { MineruSettingsController, type MineruFormValues } from './settings-form.js'
import { en, NS, zh, type MineruKey } from './locales.js'
import { dicts } from './dictionaries.js'
import type { HealthResponseWire } from '../rpc.js'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'dsh-mineru': MineruKey
  }
}

/**
 * Profile entry id the host composes this plugin under: the `id` of the row
 * in `cordis.patch.yml`. It is also the namespace the Host serves the entry's
 * volatile Config under, so it keys `ctx.configForms.get`.
 */
const ENTRY_ID = 'dsh-mineru'

/** The bundle's npm package name — the `name` the patch row declares. */
const PACKAGE_NAME = '@huanlin/dsh-plugin-mineru'

/** `plugins.row.config` key: the bundle's package name `#` the row id. */
const ROW_KEY = `${PACKAGE_NAME}#${ENTRY_ID}`

export const inject = ['slots', 'locale', 'connection', 'configForms']

type HealthRpcResult = RpcResult<HealthResponseWire>

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

  const controller = new MineruSettingsController(
    ctx.configForms.get<MineruFormValues>(ENTRY_ID),
  )

  const probeHealth = async (): Promise<HealthProbe> => {
    const result = await connection.rpc.call('/api', 'mineru.health', {}) as HealthRpcResult
    if (result.ok) {
      return {
        ok: true,
        status: result.value.status,
        version: result.value.version,
        queued_tasks: result.value.queued_tasks,
      }
    }
    return { ok: false, message: result.error.message }
  }

  const settingsInjected = (): MineruSettingsInjected => ({
    hooks: { mineruSettings: controller.snapshot },
    edit: (field, value) => controller.edit(field, value),
    save: () => controller.save(),
    probeHealth,
  })

  // Register the row's configure card only while the Host serves this entry's
  // config, so a deployment that disabled the host row offers no configure
  // entry on the Plugins page.
  ctx.effect(
    () => ctx.configForms.whileServed([ENTRY_ID], () => ctx.slots.inject('plugins.row.config', function* () {
      yield ctx.slots.register({
        name: 'plugins.row.config',
        key: ROW_KEY,
        locale: NS,
        inject: settingsInjected,
      }, SettingsPage)
    })),
    'dsh-mineru: plugins row config card',
  )
}
