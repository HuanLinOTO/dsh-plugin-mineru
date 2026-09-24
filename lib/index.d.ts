import z from "@deepseek-ai/schemastery";
import { Context, Volatile } from "@deepseek-ai/cordis";
//#region src/index.d.ts
declare const name = "dsh-mineru";
declare const inject: string[];
type MineruBackend = 'pipeline' | 'vlm-engine' | 'hybrid-engine' | 'vlm-http-client' | 'hybrid-http-client';
type MineruParseMethod = 'auto' | 'txt' | 'ocr';
/**
 * The live Cordis config the Loader passes to `apply` (dsh 0.1.7-rc.1).
 *
 * Every field is a stable volatile reference read through `.get()`; a
 * committed settings edit updates it in place without remounting the plugin.
 */
interface EntryConfig {
  /** Live MinerU API base URL. */
  baseURL: Volatile<string> | string;
  /** Live env-var name the API key is resolved from. */
  apiKeyEnv: Volatile<string> | string;
  /** Live default parsing backend. */
  defaultBackend: Volatile<string> | string;
  /** Live default parse method. */
  defaultParseMethod: Volatile<string> | string;
  /** Live pipeline-backend language code. */
  defaultLang: Volatile<string> | string;
  /** Live async-status poll interval. */
  pollIntervalMs: Volatile<number> | number;
  /** Live `mineru_parse_document` poll timeout. */
  pollTimeoutMs: Volatile<number> | number;
  /** Live per-request HTTP timeout. */
  requestTimeoutMs: Volatile<number> | number;
  /** Live inline-markdown truncation limit. */
  maxMdOutputChars: Volatile<number> | number;
}
/**
 * Schemastery schema for the plugin's profile-owned Config.
 *
 * Every field is `.volatile()` (dsh 0.1.7-rc.1): the settings service
 * enumerates them for the configuration form, and a committed edit updates
 * the running reference in place. Defaults are the composition-layer seed.
 */
declare const Config: z<EntryConfig>;
declare function apply(ctx: Context, config?: EntryConfig): void;
//#endregion
export { Config, EntryConfig, MineruBackend, MineruParseMethod, apply, inject, name };