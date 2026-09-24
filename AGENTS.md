# dsh-mineru — Agent Guide

## Plugin overview

Bundle-style DSH plugin exposing 5 MinerU document-parsing tools to the model. The bundle row's configure card on the Plugins page (`plugins.row.config`) edits `baseURL` + optional API key + parse defaults. Tools wrap the MinerU FastAPI server (v3.4.4, protocol v2).

## Key conventions

- **Bundle form**: `cordis.patch.yml` inserts one plugin row; `package.json` has `dsh.bundle.patch`. No source patches to DSH staging.
- **Peer deps**: `@deepseek-ai/cordis` + `@deepseek-ai/dsh-tools` / `dsh-llm` (host half) and `dsh-client-connection` / `dsh-client-locale` / `dsh-client-ui-settings` / `dsh-client-ui-slots` / `dsh-client-ui-renderer` (client half, type-only). `schemastery` is a direct dependency (config validator).
- **Types from real packages**: `ctx.tools` / `ctx.connection` / `ctx.locale` / `ctx.slots` come from each package's `@deepseek-ai/cordis` Context merge resolved through node_modules links; `src/types.d.ts` only declares CSS modules.
- **ESM-only**: `"type": "module"`, relative imports use `.js` extensions (NodeNext).
- **defineTool contract**: `execute` returns a canonical JSON value; `render` is a separate pure projection. `exec.signal` honored at every await point.
- **API key**: resolved lazily via `ctx.get('credentials')` (if loaded) then `process.env[apiKeyEnv]`. MinerU's open-source server has no built-in auth.
- **Settings are the profile-owned Cordis Config** (dsh 0.1.7-rc.1 `DSH-0.1.7-J1-04`): every user-editable field is `.volatile()`, so `apply` receives live references (`EntryConfig`) whose values re-resolve on every read. The settings page reads/writes through `ctx.configForms` (`DSH-0.1.7-J1-27`); edits persist to the active profile's `cordis.patch.yml` under the entry id `dsh-mineru` and hot-reload the running instance. `settings.configure({ auto: false })` suppresses the schema-generated page (this plugin ships its own `plugins.row.config` card on the Plugins page).
- **Health RPC is an exact Fetch route on `/api`** (`mineru.health` via `connection.fetch.register`): dedicated `rpc.handle` channels cannot mount in the web profile (the webserver is a sibling loader row, never an ancestor of this fiber).

## File responsibilities

| File | Role |
|------|------|
| `src/index.ts` | Entry: `name`, `inject = ['tools', 'connection']`, `Config` (Schemastery, all fields `.volatile()`), `apply` (live-config getters + settings own-page policy + RPC) |
| `src/client.ts` | `MinerUClient` (fetch + signal + optional bearer), `buildFormData`, `pollUntilDone`, `sleep`, types |
| `src/tools.ts` | 5 `defineTool` definitions, `registerTools()`, render helpers, `maybeTruncateMd` |
| `src/rpc.ts` | Host RPC: `mineru.health` exact Fetch route on `/api` (envelope handling; config CRUD lives in the settings service, not here) |
| `src/types.d.ts` | Ambient CSS-module declarations |
| `src/client/index.ts` | Client entry: `inject = ['slots','locale','connection','configForms']`; binds the entry `ConfigForm`, registers the `plugins.row.config` card (key `@huanlin/dsh-plugin-mineru#dsh-mineru`) while the Host serves the entry |
| `src/client/settings-form.ts` | `MineruSettingsController`: staged edits over the `ConfigForm`, publishes the card snapshot store |
| `src/client/SettingsPage.tsx` | Plugins-page row config card: `view: 'summary'` one-liner + `view: 'page'` form (9 fields + save + test connection, reads via bound `useMineruSettings`) |
| `src/client/locales.ts` | en/zh dictionaries (`dsh-mineru` namespace) |
| `src/client/dictionaries.ts` | better-locale override dictionaries (19 languages) |
| `tests/tools.spec.ts` | Unit tests (mocked fetch, no live server) |

## Commands

```sh
pnpm run typecheck    # tsc --noEmit (src only)
pnpm test             # vitest run
pnpm run build        # tsc -p tsconfig.json → lib/
```

## Adding a new tool

1. Add a `ctx.tools.register(defineTool({ ... }))` call in `registerTools()` in `src/tools.ts`.
2. Follow the C-contract: `parameters` as plain `ParameterSchemaSpec` object, `output.schema` as `ValueSchemaSpec`, `output.render` as pure function returning `ContentBlock[]`.
3. Object schemas must declare `additionalProperties: boolean`.
4. Honor `exec.signal` — call `exec.signal.throwIfAborted()` before async work and pass `exec.signal` to `fetch`.

## MinerU API gotchas

- Default backend `hybrid-engine` requires a VLM model; use `pipeline` for CPU-only servers.
- `lang_list` is pipeline-only; silently ignored for VLM/hybrid backends.
- `return_images` can produce very large base64 payloads; prefer `response_format_zip` for image-heavy docs.
- Tasks are retained 24h; don't cache `task_id` across long sessions.
- `end_page_id` default is `99999` (not "last page").
- File stems in results are normalized (no extension); match via the `file_names` array from the submit response.
