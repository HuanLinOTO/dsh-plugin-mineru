# dsh-mineru

DSH plugin exposing [MineRU](https://github.com/opendatalab/MinerU) document parsing tools to the model. MineRU converts PDF, images, DOCX, PPTX, and XLSX files into structured Markdown / JSON.

## Installation

```sh
# From a local checkout (dev):
dsh plugin --profile demo add link:D:\Projects\deepseek-harness\dsh-mineru

# From git:
dsh plugin --profile demo add github:dsh-external/dsh-mineru
```

If installing from git with pnpm ≥10, add to your profile's `pnpm-workspace.yaml`:

```yaml
allowBuilds:
  '@dsh-external/dsh-mineru': true
```

## Configuration

Configure in the DSH GUI settings page (or `cordis.patch.yml`):

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `baseURL` | string | *(required)* | MineRU API base URL, e.g. `http://your-mineru-host:18000` |
| `apiKeyEnv` | credential-ref | `MINERU_API_KEY` | Env var or credential store ref for optional API key. The test instance requires no auth. |
| `defaultBackend` | enum | `pipeline` | `pipeline` / `vlm-engine` / `hybrid-engine` / `vlm-http-client` / `hybrid-http-client` |
| `defaultParseMethod` | enum | `auto` | `auto` / `txt` / `ocr` |
| `defaultLang` | string | `ch` | Language code for pipeline backend |
| `pollIntervalMs` | number | `2000` | Polling interval for async status checks |
| `pollTimeoutMs` | number | `600000` | Max polling time for `mineru_parse_document` (10 min) |
| `requestTimeoutMs` | number | `60000` | HTTP timeout per API call |
| `maxMdOutputChars` | number | `200000` | Max markdown chars returned inline; full content saved to temp file if exceeded |

## Tools

### `mineru_parse_document` (recommended)

Parse a local document and return the extracted markdown. Submits the file, polls until complete, and returns markdown inline. Use this for most parsing tasks.

### `mineru_submit_parse_job`

Submit a document for async parsing. Returns a `task_id` immediately. Use for large documents or parallel batch submission.

### `mineru_get_parse_status`

Poll the status of an async task. Returns `pending` / `processing` / `completed` / `failed`.

### `mineru_get_parse_result`

Fetch the result of a completed task. Returns markdown inline (truncated if large) and saves the full structured JSON to `raw_result_path`.

### `mineru_health`

Check server health, version, queue depth, and concurrency capacity.

## Development

```sh
pnpm install          # install dev deps (schemastery, typescript, vitest)
pnpm run typecheck    # tsc --noEmit
pnpm test             # vitest run
pnpm run build        # tsc -p tsconfig.json → lib/
```

## Architecture

```
dsh-mineru/
├── src/
│   ├── index.ts        # Entry: name, inject, Config (Schemastery), apply
│   ├── client.ts       # MineRUClient (fetch-based HTTP client + types)
│   ├── tools.ts        # 5 defineTool definitions + helpers + registerTools
│   └── types.d.ts      # Ambient declarations for @deepseek-ai/dsh-tools + cordis
├── tests/
│   └── tools.spec.ts   # Unit tests (mocked fetch, no live server needed)
├── cordis.patch.yml    # Bundle layer: inserts dsh-mineru plugin row
├── package.json        # dsh.bundle.patch manifest + peerDeps
└── tsconfig.json       # NodeNext, ES2022, strict
```

## Test API

A MineRU 3.4.4 test instance is available at `http://your-mineru-host:18000/` (no auth required). The default `cordis.patch.yml` points to it. Override `baseURL` in the GUI to use your own server.
