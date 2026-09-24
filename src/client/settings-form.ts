/**
 * The MinerU settings page's staged form over the plugin's profile entry
 * Config.
 *
 * Since dsh 0.1.7-rc.1 (`DSH-0.1.7-J1-27`) the client settings transport is
 * `ctx.configForms`: the apply half binds the
 * entry's shared {@link ConfigForm} (`ctx.configForms.get('dsh-mineru')`),
 * whose reads ride the settings describe mirror and whose writes go through
 * the Host settings service (`form.set` resolves to whether the Host
 * accepted the write).
 *
 * This controller stages the nine editable fields, overlays drafts on the
 * accepted section value, and publishes one snapshot the page renders
 * through its bound `useMineruSettings` hook. Pattern follows
 * dsh-plugin-preface-context's card controller (the upstream `CardForm`
 * helper is an internal module no external plugin can reuse).
 */

import type { SnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { ConfigForm, ConfigFormSnapshot } from '@deepseek-ai/dsh-client-ui-settings/client'

/**
 * A minimal snapshot store: a value + a listener set. Self-contained so the
 * controller pulls no browser-bundle symbol into its unit-test graph.
 */
class MiniSnapshotStore<T> implements SnapshotStore<T> {
  private snapshot: T
  private readonly listeners = new Set<() => void>()

  constructor(initial: T) {
    this.snapshot = initial
  }

  getSnapshot(): T {
    return this.snapshot
  }

  set(value: T): void {
    this.snapshot = value
    for (const listener of [...this.listeners]) listener()
  }

  update(mutator: (draft: T) => void): void {
    // Shallow-clone then mutate (the projections here are plain objects with
    // no nested mutation, so a deep immer draft is unnecessary).
    const draft = { ...this.snapshot as object } as T
    mutator(draft)
    this.set(draft)
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }
}

/** The nine fields the settings page edits (mirrors the host entry Config). */
export interface MineruFormValues {
  readonly baseURL: string
  readonly apiKeyEnv: string
  readonly defaultBackend: string
  readonly defaultParseMethod: string
  readonly defaultLang: string
  readonly pollIntervalMs: number
  readonly pollTimeoutMs: number
  readonly requestTimeoutMs: number
  readonly maxMdOutputChars: number
}

/** Composition-layer defaults, mirroring the host Config schema exactly. */
export const MINERU_FORM_DEFAULTS: MineruFormValues = {
  baseURL: '',
  apiKeyEnv: 'MINERU_API_KEY',
  defaultBackend: 'pipeline',
  defaultParseMethod: 'auto',
  defaultLang: 'ch',
  pollIntervalMs: 2000,
  pollTimeoutMs: 600000,
  requestTimeoutMs: 60000,
  maxMdOutputChars: 200000,
}

/** Page-level state shared with the component. */
export interface MineruSettingsState {
  /** `loading` until the first Host view, `unavailable` when the entry is not served. */
  status: ConfigFormSnapshot<MineruFormValues>['status']
  /** Whether the Host document accepts writes. */
  writable: boolean
  /** Whether staged edits exist a save would write. */
  dirty: boolean
  /** Whether a save is crossing the wire. */
  saving: boolean
  /** Whether the last save landed (transient flash). */
  saved: boolean
  /** Whether the last save did not land as staged. */
  failed: boolean
  /** Accepted section value overlaid with staged drafts. */
  values: MineruFormValues
}

/** How long the "Saved" confirmation stays visible after a landed save. */
const SAVED_FLASH_MS = 2000

/**
 * Bridges the `dsh-mineru` entry's {@link ConfigForm} onto the page's staged
 * form: publishes through a snapshot store because the component reads
 * through a bound selector while the form and the local drafts change
 * underneath.
 */
export class MineruSettingsController {
  private readonly store: MiniSnapshotStore<MineruSettingsState>
  private readonly staged = new Map<keyof MineruFormValues, unknown>()
  private saving = false
  private saved = false
  private failed = false
  private savedTimer: ReturnType<typeof setTimeout> | undefined

  /** @param form - the bound config form for the `dsh-mineru` entry. */
  constructor(private readonly form: ConfigForm<MineruFormValues>) {
    this.store = new MiniSnapshotStore<MineruSettingsState>(this.project())
    form.subscribe(() => { this.publish() })
  }

  /** @returns the store the page's slot registration injects. */
  get snapshot(): SnapshotStore<MineruSettingsState> {
    return this.store
  }

  /** Stage one field edit; the draft overlays the accepted value until save. */
  edit<K extends keyof MineruFormValues>(field: K, value: MineruFormValues[K]): void {
    this.staged.set(field, value)
    this.failed = false
    this.publish()
  }

  /** Write every staged edit, then re-seed from what the Host accepted. */
  save(): void {
    void this.commit()
  }

  private async commit(): Promise<void> {
    if (this.staged.size === 0 || this.saving) return
    this.saving = true
    this.failed = false
    this.publish()
    let landed = true
    for (const [field, value] of this.staged) {
      try {
        // `set` resolves to whether the Host accepted the write; a refusal
        // (false) keeps the drafts for correction.
        const accepted = await this.form.set(field, value)
        if (!accepted) landed = false
      } catch {
        // Transport failure counts as refused; drafts stay staged.
        landed = false
      }
    }
    this.saving = false
    if (landed) {
      this.staged.clear()
      this.flashSaved()
    }
    this.failed = !landed
    this.publish()
  }

  private flashSaved(): void {
    this.saved = true
    if (this.savedTimer !== undefined) clearTimeout(this.savedTimer)
    this.savedTimer = setTimeout(() => {
      this.savedTimer = undefined
      this.saved = false
      this.publish()
    }, SAVED_FLASH_MS)
  }

  private publish(): void {
    this.store.set(this.project())
  }

  private project(): MineruSettingsState {
    const snapshot = this.form.getSnapshot()
    const values: MineruFormValues = { ...MINERU_FORM_DEFAULTS }
    if (snapshot.status === 'ready' && snapshot.value !== undefined) {
      Object.assign(values, snapshot.value)
    }
    for (const [field, value] of this.staged) {
      (values as Record<keyof MineruFormValues, unknown>)[field] = value
    }
    return {
      status: snapshot.status,
      writable: snapshot.writable,
      dirty: this.staged.size > 0,
      saving: this.saving,
      saved: this.saved,
      failed: this.failed,
      values,
    }
  }
}
