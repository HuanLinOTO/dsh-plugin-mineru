import z from "schemastery";
import { Context } from "cordis";
//#region src/index.d.ts
declare const name = "dsh-mineru";
declare const inject: string[];
type MineruBackend = 'pipeline' | 'vlm-engine' | 'hybrid-engine' | 'vlm-http-client' | 'hybrid-http-client';
type MineruParseMethod = 'auto' | 'txt' | 'ocr';
interface Config {
  baseURL: string;
  apiKeyEnv?: string;
  defaultBackend?: MineruBackend;
  defaultParseMethod?: MineruParseMethod;
  defaultLang?: string;
  pollIntervalMs?: number;
  pollTimeoutMs?: number;
  requestTimeoutMs?: number;
  maxMdOutputChars?: number;
}
declare const Config: z<Config>;
declare function apply(ctx: Context, config?: Config): void;
//#endregion
export { Config, MineruBackend, MineruParseMethod, apply, inject, name };