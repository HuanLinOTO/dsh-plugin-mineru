/**
 * types.d.ts — peer 依赖的最小环境声明。
 *
 * `@deepseek-ai/dsh-tools` 与 `cordis` 是运行时由宿主 dsh 提供的 peer 依赖
 * （私有包，不能 npm install）。本文件仅为 src/* 的独立 typecheck 提供
 * 最小声明：只声明用到的成员与形状，与官方类型不完全一致；官方权威定义见
 * DSH staging packages/core/tools/src/schema.ts 与 vendor/cordis。
 */

declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.css' {
  const classes: Record<string, string>
  export default classes
}

declare module '@deepseek-ai/dsh-tools' {
  export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

  export type ContentBlock = { type: 'text'; text: string }

  export interface ValueSchemaAnnotations {
    description?: string
    title?: string
    default?: JsonValue
    examples?: JsonValue
  }

  export interface StringValueSchemaSpec extends ValueSchemaAnnotations {
    type: 'string'
    enum?: readonly string[]
    const?: string
  }

  export interface NumberValueSchemaSpec extends ValueSchemaAnnotations {
    type: 'number' | 'integer'
    enum?: readonly number[]
    const?: number
  }

  export interface BooleanValueSchemaSpec extends ValueSchemaAnnotations {
    type: 'boolean'
  }

  export interface NullValueSchemaSpec extends ValueSchemaAnnotations {
    type: 'null'
  }

  export interface ArrayValueSchemaSpec extends ValueSchemaAnnotations {
    type: 'array'
    items?: ValueSchemaSpec
  }

  export interface ObjectValueSchemaSpec extends ValueSchemaAnnotations {
    type: 'object'
    properties?: ParameterSchemaSpec
    additionalProperties: boolean
  }

  export interface JsonValueSchemaSpec extends ValueSchemaAnnotations {
    type: 'json'
  }

  export interface OneOfValueSchemaSpec extends ValueSchemaAnnotations {
    oneOf: readonly [ValueSchemaSpec, ValueSchemaSpec, ...ValueSchemaSpec[]]
  }

  export type ValueSchemaSpec =
    | StringValueSchemaSpec
    | NumberValueSchemaSpec
    | BooleanValueSchemaSpec
    | NullValueSchemaSpec
    | ArrayValueSchemaSpec
    | ObjectValueSchemaSpec
    | JsonValueSchemaSpec
    | OneOfValueSchemaSpec

  export type ParameterPropertySpec = ValueSchemaSpec & { required?: true }

  export type ParameterSchemaSpec = {
    [key: string]: ParameterPropertySpec
    [key: symbol]: never
  }

  type InferObject<S> =
    S extends { properties: infer P }
      ? S extends { additionalProperties: true }
        ? InferProps<P> & Record<string, JsonValue>
        : InferProps<P>
      : S extends { additionalProperties: true }
        ? Record<string, JsonValue>
        : Record<string, never>

  type InferProps<S> = S extends undefined
    ? Record<string, never>
    : {
        [K in Extract<keyof S, string> as S[K] extends { required: true } ? K : never]: InferValueAt<S[K]>
      } & {
        [K in Extract<keyof S, string> as S[K] extends { required: true } ? never : K]?: InferValueAt<S[K]>
      }

  type InferValueAt<S> =
    S extends { type: 'string' } ? string :
      S extends { type: 'number' | 'integer' } ? number :
        S extends { type: 'boolean' } ? boolean :
          S extends { type: 'null' } ? null :
            S extends { type: 'array' }
              ? S extends { items: infer I } ? InferValueAt<I>[] : JsonValue[]
              : S extends { type: 'object' } ? InferObject<S> :
                S extends { type: 'json' } ? JsonValue :
                  S extends { oneOf: readonly unknown[] } ? InferValueAt<S['oneOf'][number]> :
                    never

  export type InferArgs<S> = InferProps<S>

  export type InferValue<S> = InferValueAt<S>

  export interface ToolRunContext {
    readonly signal: AbortSignal
    readonly callId: string
    readonly name: string
    readonly arguments: unknown
  }

  export interface DefineToolOptions {
    readonly name: string
    readonly description: string
    readonly parameters: ParameterSchemaSpec
    readonly output: {
      readonly schema: ValueSchemaSpec
      render(args: unknown, value: unknown): ContentBlock[]
    }
    readonly timeoutMs?: number
    execute(args: unknown, exec: ToolRunContext): Promise<unknown>
  }

  export function defineTool(options: DefineToolOptions): unknown
}

declare module 'cordis' {
  export interface Context {
    tools: {
      register(definition: unknown): () => void
      schemas(): readonly { name: string; description: string }[]
    }
    get(name: string): unknown
    effect(fn: () => unknown, label?: string): () => void
    on(event: string, listener: (...args: unknown[]) => unknown): () => void
    inject(services: readonly string[], callback: (ctx: Context) => void): void
    readonly logger: {
      info(...args: unknown[]): void
      warn(...args: unknown[]): void
      error(...args: unknown[]): void
      debug(...args: unknown[]): void
    }
    readonly connection: {
      readonly rpc: {
        readonly handle: (
          channel: string,
          handler: (endpoint: string, payload: unknown, signal: AbortSignal) => Promise<unknown>,
          options: { readonly authority: 'trusted-host' | 'loopback' },
        ) => unknown
      }
    }
    readonly slots: {
      inject(slotName: string, factory: (ctx: Context) => unknown): void
      register(options: { name: string; id: string; order?: number; label: () => string; inject: () => unknown }, component: unknown): () => void
    }
    readonly locale: {
      register(ns: string, dicts: Record<string, Record<string, string>>): () => void
      bind(ns: string): (key: string) => string
    }
  }
}
