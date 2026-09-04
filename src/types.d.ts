/**
 * types.d.ts — 环境声明。
 *
 * 仅声明 CSS 模块（tsdown 内联 + tsc 类型面）。所有 peer 依赖的类型都来自
 * node_modules 中各包随 junction/link 解析的真实声明：`ctx.tools` 由
 * `@deepseek-ai/dsh-tools` merge 进 `@deepseek-ai/cordis` 的 Context，
 * `ctx.connection` / `ctx.locale` / `ctx.slots` 同理分别来自
 * dsh-client-connection / dsh-client-locale / ui-renderer。
 */

declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.css' {
  const classes: Record<string, string>
  export default classes
}
