# dsh-mineru — Agent Guide

## Plugin overview

Bundle-style DSH plugin exposing 5 MineRU document-parsing tools to the model. Config page has `baseURL` + optional API key + parse defaults. Tools wrap the MineRU FastAPI server (v3.4.4, protocol v2).

## Key conventions

- **Bundle form**: `cordis.patch.yml` inserts one plugin row; `package.json` has `dsh.bundle.patch`. No source patches to DSH staging.
- **Peer deps**: `cordis` + `@deepseek-ai/dsh-tools` (provided by host). `schemastery` is a direct dependency (config validator).
- **Ambient types**: `src/types.d.ts` declares `@deepseek-ai/dsh-tools` and `cordis` for standalone typecheck (these are private packages, not on npm).
- **ESM-only**: `"type": "module"`, relative imports use `.js` extensions (NodeNext).
- **defineTool contract**: `execute` returns a canonical JSON value; `render` is a separate pure projection. `exec.signal` honored at every await point.
- **API key**: resolved lazily via `ctx.get('credentials')` (if loaded) then `process.env[apiKeyEnv]`. MineRU's open-source server has no built-in auth.

## File responsibilities

| File | Role |
|------|------|
| `src/index.ts` | Entry: `name`, `inject = ['tools']`, `Config` (Schemastery), `apply` |
| `src/client.ts` | `MineRUClient` (fetch + signal + optional bearer), `buildFormData`, `pollUntilDone`, `sleep`, types |
| `src/tools.ts` | 5 `defineTool` definitions, `registerTools()`, render helpers, `maybeTruncateMd` |
| `src/types.d.ts` | Ambient declarations for peer-dep modules |
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

## MineRU API gotchas

- Default backend `hybrid-engine` requires a VLM model; use `pipeline` for CPU-only servers.
- `lang_list` is pipeline-only; silently ignored for VLM/hybrid backends.
- `return_images` can produce very large base64 payloads; prefer `response_format_zip` for image-heavy docs.
- Tasks are retained 24h; don't cache `task_id` across long sessions.
- `end_page_id` default is `99999` (not "last page").
- File stems in results are normalized (no extension); match via the `file_names` array from the submit response.
