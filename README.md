# dsh-mineru

DSH 插件：向模型暴露 [MinerU](https://github.com/opendatalab/MinerU) 文档解析工具。MinerU 可将 PDF、图片、DOCX、PPTX、XLSX 等文件转换为结构化的 Markdown / JSON。

## 安装

```sh
# 从 git 安装（推荐）：
dsh plugin --profile <profile> add github:huanlinoto/dsh-plugin-mineru

# 从本地 checkout 开发安装：
dsh plugin --profile <profile> add link:D:\Projects\deepseek-harness\dsh-mineru
```

pnpm ≥10 从 git 安装时，需在 profile 的 `pnpm-workspace.yaml` 中允许构建：

```yaml
allowBuilds:
  '@huanlin/dsh-plugin-mineru': true
```

## 配置

在 DSH GUI 设置页或 `cordis.patch.yml` 中配置：

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `baseURL` | string | *(必填)* | MinerU API 地址，如 `http://your-mineru-host:18000` |
| `apiKeyEnv` | credential-ref | `MINERU_API_KEY` | API key 的环境变量名 / 凭据引用。测试实例无需鉴权。 |
| `defaultBackend` | enum | `pipeline` | `pipeline` / `vlm-engine` / `hybrid-engine` / `vlm-http-client` / `hybrid-http-client` |
| `defaultParseMethod` | enum | `auto` | `auto` / `txt` / `ocr` |
| `defaultLang` | string | `ch` | pipeline 后端的语言代码 |
| `pollIntervalMs` | number | `2000` | 异步状态轮询间隔 |
| `pollTimeoutMs` | number | `600000` | `mineru_parse_document` 最大轮询时长（10 分钟） |
| `requestTimeoutMs` | number | `60000` | 单次 HTTP 请求超时 |
| `maxMdOutputChars` | number | `200000` | 内联返回给模型的 markdown 字符上限；超出时完整内容存到临时文件 |

## 工具

### `mineru_parse_document`（推荐）

解析本地文档并返回提取出的 markdown。内部自动完成：提交文件 → 轮询至完成 → 返回 markdown。大多数解析任务用这个即可。

### `mineru_submit_parse_job`

异步提交解析任务，立即返回 `task_id`。适合大文档或并行批量提交。

### `mineru_get_parse_status`

轮询异步任务状态，返回 `pending` / `processing` / `completed` / `failed`。

### `mineru_get_parse_result`

获取已完成任务的结果。内联返回 markdown（过大则截断），并将完整结构化 JSON 存到 `raw_result_path`。

### `mineru_health`

检查服务器健康状态、版本、队列深度与并发容量。

## 开发

```sh
pnpm install          # 安装开发依赖（schemastery、typescript、vitest）
pnpm run typecheck    # tsc --noEmit 类型检查
pnpm test             # vitest run 单元测试
pnpm run build        # tsdown 构建 → lib/
```

## 目录结构

```
dsh-mineru/
├── src/
│   ├── index.ts        # 入口：name、inject、Config（Schemastery）、apply
│   ├── client.ts       # MinerUClient（基于 fetch 的 HTTP 客户端 + 类型）
│   ├── tools.ts        # 5 个 defineTool 定义 + 辅助函数 + registerTools
│   └── types.d.ts      # @deepseek-ai/dsh-tools + cordis 的环境类型声明
├── tests/
│   └── tools.spec.ts   # 单元测试（mock fetch，无需真实服务器）
├── cordis.patch.yml    # bundle 层：插入 dsh-mineru 插件行
├── package.json        # dsh.bundle.patch 声明 + peerDeps
└── tsconfig.json       # NodeNext、ES2022、strict
```

## 测试 API

请自己部署 MinerU 实例。`cordis.patch.yml` 默认指向 `http://localhost:18000`，请在 DSH GUI 中覆盖 `baseURL` 改为你的 MinerU 服务器地址。
