window.__ModuleLoader__.load({
	id: "@huanlin/dsh-plugin-mineru",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region \0dsh-css:D:\Projects\deepseek-harness\dsh-mineru\src\client\SettingsPage.module.css.mjs
		const css = ".ljbh0j_section {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  max-width: 720px;\n  color: var(--dsw-alias-label-primary);\n}\n\n.ljbh0j_title {\n  margin: 0;\n  font-size: 16px;\n  line-height: 24px;\n  font-weight: 500;\n  color: var(--dsw-alias-label-primary);\n}\n\n.ljbh0j_intro {\n  margin: 0;\n  font-size: 14px;\n  line-height: 22px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.ljbh0j_error {\n  margin: 0;\n  padding: 8px 12px;\n  border: 1px solid var(--dsw-alias-state-error-primary);\n  border-radius: 8px;\n  background: var(--dsw-alias-interactive-bg-hover-danger);\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--dsw-alias-state-error-primary);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n\n.ljbh0j_errorDismiss {\n  flex: none;\n  border: none;\n  background: transparent;\n  color: inherit;\n  font-size: 16px;\n  line-height: 1;\n  cursor: pointer;\n  padding: 0 4px;\n}\n\n.ljbh0j_loading {\n  font-size: 14px;\n  line-height: 22px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.ljbh0j_editor {\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 12px;\n  padding: 14px 16px;\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n  background: var(--dsw-alias-bg-module-platform);\n}\n\n.ljbh0j_row {\n  display: flex;\n  gap: 12px;\n}\n\n.ljbh0j_row > .ljbh0j_field {\n  flex: 1;\n}\n\n.ljbh0j_field {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.ljbh0j_fieldLabel {\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.ljbh0j_input,\n.ljbh0j_select {\n  height: 32px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  padding: 0 10px;\n  font-size: 14px;\n  line-height: 20px;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-bg-layer-1);\n  outline: none;\n}\n\n.ljbh0j_input:focus,\n.ljbh0j_select:focus {\n  border-color: var(--dsw-alias-state-focus-primary);\n}\n\n.ljbh0j_select {\n  appearance: none;\n  cursor: pointer;\n}\n\n.ljbh0j_actions {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  flex-wrap: wrap;\n}\n\n.ljbh0j_primaryButton {\n  height: 36px;\n  border: none;\n  border-radius: 18px;\n  padding: 0 18px;\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--dsw-alias-text-on-primary);\n  background: var(--dsw-alias-interactive-bg-primary);\n  cursor: pointer;\n}\n\n.ljbh0j_primaryButton:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.ljbh0j_secondaryButton {\n  height: 36px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 18px;\n  padding: 0 18px;\n  font-size: 14px;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-bg-layer-1);\n  cursor: pointer;\n}\n\n.ljbh0j_secondaryButton:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.ljbh0j_testOk {\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--dsw-alias-state-success-primary);\n}\n\n.ljbh0j_testWarn {\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--dsw-alias-state-warning-primary);\n}\n\n.ljbh0j_testErr {\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--dsw-alias-state-error-primary);\n}\n";
		const classMap = {
			"section": "ljbh0j_section",
			"title": "ljbh0j_title",
			"intro": "ljbh0j_intro",
			"error": "ljbh0j_error",
			"errorDismiss": "ljbh0j_errorDismiss",
			"loading": "ljbh0j_loading",
			"editor": "ljbh0j_editor",
			"row": "ljbh0j_row",
			"field": "ljbh0j_field",
			"fieldLabel": "ljbh0j_fieldLabel",
			"input": "ljbh0j_input",
			"select": "ljbh0j_select",
			"actions": "ljbh0j_actions",
			"primaryButton": "ljbh0j_primaryButton",
			"secondaryButton": "ljbh0j_secondaryButton",
			"testOk": "ljbh0j_testOk",
			"testWarn": "ljbh0j_testWarn",
			"testErr": "ljbh0j_testErr"
		};
		const tagId = "@huanlin/dsh-plugin-mineru/SettingsPage.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@huanlin/dsh-plugin-mineru";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		} else if (typeof document !== "undefined") {
			const existing = document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]");
			if (existing) existing.textContent = css;
		}
		//#endregion
		//#region src/client/SettingsPage.tsx
		const BACKENDS = [
			"pipeline",
			"vlm-engine",
			"hybrid-engine",
			"vlm-http-client",
			"hybrid-http-client"
		];
		const PARSE_METHODS = [
			"auto",
			"txt",
			"ocr"
		];
		async function callRpc(rpc, endpoint, payload) {
			return rpc.call("/mineru-api", endpoint, payload);
		}
		function SettingsPage({ rpc, t }) {
			const [config, setConfig] = (0, react.useState)(null);
			const [draft, setDraft] = (0, react.useState)(null);
			const [loading, setLoading] = (0, react.useState)(true);
			const [saving, setSaving] = (0, react.useState)(false);
			const [saved, setSaved] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)(void 0);
			const [testStatus, setTestStatus] = (0, react.useState)("idle");
			const [testMessage, setTestMessage] = (0, react.useState)(void 0);
			const refresh = (0, react.useCallback)(async () => {
				setLoading(true);
				setError(void 0);
				try {
					const result = await callRpc(rpc, "mineru/config.get", {});
					if (result.ok) {
						setConfig(result.value.config);
						setDraft(result.value.config);
					} else setError(result.error.message);
				} catch (err) {
					setError(err instanceof Error ? err.message : String(err));
				} finally {
					setLoading(false);
				}
			}, [rpc]);
			(0, react.useEffect)(() => {
				refresh();
			}, [refresh]);
			const save = (0, react.useCallback)(async () => {
				if (draft === null) return;
				setSaving(true);
				setError(void 0);
				setSaved(false);
				try {
					const result = await callRpc(rpc, "mineru/config.set", { config: draft });
					if (result.ok) {
						setConfig(result.value.config);
						setDraft(result.value.config);
						setSaved(true);
						setTimeout(() => setSaved(false), 2e3);
					} else setError(result.error.message);
				} catch (err) {
					setError(err instanceof Error ? err.message : String(err));
				} finally {
					setSaving(false);
				}
			}, [draft, rpc]);
			const testConnection = (0, react.useCallback)(async () => {
				if (draft === null) return;
				setTestStatus("testing");
				setTestMessage(void 0);
				try {
					const result = await callRpc(rpc, "mineru/health", {});
					if (result.ok && result.value.status === "healthy") {
						setTestStatus("healthy");
						const v = result.value.version ? ` v${result.value.version}` : "";
						const q = result.value.queued_tasks !== void 0 ? ` (${result.value.queued_tasks} queued)` : "";
						setTestMessage(`${t("test.healthy")}${v}${q}`);
					} else if (result.ok) {
						setTestStatus("unhealthy");
						setTestMessage(t("test.unhealthy"));
					} else {
						setTestStatus("error");
						setTestMessage(result.error.message);
					}
				} catch (err) {
					setTestStatus("error");
					setTestMessage(err instanceof Error ? err.message : String(err));
				}
			}, [
				draft,
				rpc,
				t
			]);
			const patch = (p) => {
				setDraft((prev) => prev === null ? prev : {
					...prev,
					...p
				});
			};
			if (loading || draft === null) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: classMap.section,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
					className: classMap.title,
					children: t("page.title")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: classMap.loading,
					children: "…"
				})]
			});
			const dirty = JSON.stringify(draft) !== JSON.stringify(config);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: classMap.section,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
						className: classMap.title,
						children: t("page.title")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: classMap.intro,
						children: t("page.intro")
					}),
					error !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: classMap.error,
						children: [error, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: classMap.errorDismiss,
							onClick: () => setError(void 0),
							children: "×"
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: classMap.editor,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: classMap.field,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: classMap.fieldLabel,
									children: t("field.baseURL")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									className: classMap.input,
									value: draft.baseURL,
									placeholder: t("field.baseURL.placeholder"),
									onChange: (e) => patch({ baseURL: e.target.value })
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: classMap.field,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: classMap.fieldLabel,
									children: t("field.apiKeyEnv")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									className: classMap.input,
									value: draft.apiKeyEnv,
									placeholder: t("field.apiKeyEnv.placeholder"),
									onChange: (e) => patch({ apiKeyEnv: e.target.value })
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: classMap.row,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: classMap.field,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: classMap.fieldLabel,
										children: t("field.defaultBackend")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
										className: classMap.select,
										value: draft.defaultBackend,
										onChange: (e) => patch({ defaultBackend: e.target.value }),
										children: BACKENDS.map((b) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: b,
											children: t(`backend.${b}`)
										}, b))
									})]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: classMap.field,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: classMap.fieldLabel,
										children: t("field.defaultParseMethod")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
										className: classMap.select,
										value: draft.defaultParseMethod,
										onChange: (e) => patch({ defaultParseMethod: e.target.value }),
										children: PARSE_METHODS.map((m) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: m,
											children: t(`parse.${m}`)
										}, m))
									})]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: classMap.row,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: classMap.field,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: classMap.fieldLabel,
										children: t("field.defaultLang")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										className: classMap.input,
										value: draft.defaultLang,
										onChange: (e) => patch({ defaultLang: e.target.value })
									})]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: classMap.field,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: classMap.fieldLabel,
										children: t("field.pollIntervalMs")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "number",
										className: classMap.input,
										value: draft.pollIntervalMs,
										onChange: (e) => patch({ pollIntervalMs: Number(e.target.value) })
									})]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: classMap.row,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: classMap.field,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: classMap.fieldLabel,
										children: t("field.pollTimeoutMs")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "number",
										className: classMap.input,
										value: draft.pollTimeoutMs,
										onChange: (e) => patch({ pollTimeoutMs: Number(e.target.value) })
									})]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: classMap.field,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: classMap.fieldLabel,
										children: t("field.requestTimeoutMs")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "number",
										className: classMap.input,
										value: draft.requestTimeoutMs,
										onChange: (e) => patch({ requestTimeoutMs: Number(e.target.value) })
									})]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: classMap.field,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: classMap.fieldLabel,
									children: t("field.maxMdOutputChars")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "number",
									className: classMap.input,
									value: draft.maxMdOutputChars,
									onChange: (e) => patch({ maxMdOutputChars: Number(e.target.value) })
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: classMap.actions,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: classMap.primaryButton,
								onClick: () => void save(),
								disabled: !dirty || saving,
								children: saving ? "…" : saved ? t("action.saved") : t("action.save")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: classMap.secondaryButton,
								onClick: () => void testConnection(),
								disabled: testStatus === "testing",
								children: testStatus === "testing" ? t("action.testing") : t("action.test")
							}),
							testStatus === "healthy" && testMessage !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: classMap.testOk,
								children: testMessage
							}),
							testStatus === "unhealthy" && testMessage !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: classMap.testWarn,
								children: testMessage
							}),
							testStatus === "error" && testMessage !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: classMap.testErr,
								children: [
									t("test.error"),
									": ",
									testMessage
								]
							})
						]
					})
				]
			});
		}
		//#endregion
		//#region src/client/locales.ts
		const NS = "dsh-mineru";
		const en = {
			"nav": "MinerU",
			"page.title": "MinerU Configuration",
			"page.intro": "Configure the MinerU document parsing server. Changes apply immediately to all mineru_* tools.",
			"field.baseURL": "API Base URL",
			"field.baseURL.placeholder": "http://your-mineru-host:18000",
			"field.apiKeyEnv": "API Key Env Var",
			"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
			"field.defaultBackend": "Default Backend",
			"field.defaultParseMethod": "Default Parse Method",
			"field.defaultLang": "Default Language",
			"field.pollIntervalMs": "Poll Interval (ms)",
			"field.pollTimeoutMs": "Poll Timeout (ms)",
			"field.requestTimeoutMs": "Request Timeout (ms)",
			"field.maxMdOutputChars": "Max Markdown Output Chars",
			"action.save": "Save",
			"action.saved": "Saved",
			"action.test": "Test Connection",
			"action.testing": "Testing…",
			"test.healthy": "Healthy",
			"test.unhealthy": "Unhealthy",
			"test.error": "Connection failed",
			"backend.pipeline": "pipeline (no VLM, multi-language)",
			"backend.vlm-engine": "vlm-engine (VLM only)",
			"backend.hybrid-engine": "hybrid-engine (VLM + pipeline)",
			"backend.vlm-http-client": "vlm-http-client",
			"backend.hybrid-http-client": "hybrid-http-client",
			"parse.auto": "auto",
			"parse.txt": "txt (text only, no OCR)",
			"parse.ocr": "ocr (force OCR)"
		};
		const zh = {
			"nav": "MinerU",
			"page.title": "MinerU 配置",
			"page.intro": "配置 MinerU 文档解析服务器。修改后立即对所有 mineru_* 工具生效。",
			"field.baseURL": "API 地址",
			"field.baseURL.placeholder": "http://your-mineru-host:18000",
			"field.apiKeyEnv": "API Key 环境变量",
			"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
			"field.defaultBackend": "默认后端",
			"field.defaultParseMethod": "默认解析方式",
			"field.defaultLang": "默认语言",
			"field.pollIntervalMs": "轮询间隔 (ms)",
			"field.pollTimeoutMs": "轮询超时 (ms)",
			"field.requestTimeoutMs": "请求超时 (ms)",
			"field.maxMdOutputChars": "Markdown 输出字符上限",
			"action.save": "保存",
			"action.saved": "已保存",
			"action.test": "测试连接",
			"action.testing": "测试中…",
			"test.healthy": "健康",
			"test.unhealthy": "异常",
			"test.error": "连接失败",
			"backend.pipeline": "pipeline（无 VLM，多语言）",
			"backend.vlm-engine": "vlm-engine（仅 VLM）",
			"backend.hybrid-engine": "hybrid-engine（VLM + pipeline）",
			"backend.vlm-http-client": "vlm-http-client",
			"backend.hybrid-http-client": "hybrid-http-client",
			"parse.auto": "auto",
			"parse.txt": "txt（仅文本，不 OCR）",
			"parse.ocr": "ocr（强制 OCR）"
		};
		//#endregion
		//#region src/client/dictionaries.ts
		const dicts = {
			"ja": {
				"nav": "MinerU",
				"page.title": "MinerU 設定",
				"page.intro": "MinerU ドキュメント解析サーバーを設定します。変更はすべての mineru_* ツールにすぐに反映されます。",
				"field.baseURL": "API ベース URL",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "API キー環境変数",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "デフォルトのバックエンド",
				"field.defaultParseMethod": "デフォルトの解析方法",
				"field.defaultLang": "デフォルトの言語",
				"field.pollIntervalMs": "ポーリング間隔 (ms)",
				"field.pollTimeoutMs": "ポーリングタイムアウト (ms)",
				"field.requestTimeoutMs": "リクエストタイムアウト (ms)",
				"field.maxMdOutputChars": "Markdown 出力の最大文字数",
				"action.save": "保存",
				"action.saved": "保存しました",
				"action.test": "接続テスト",
				"action.testing": "テスト中…",
				"test.healthy": "正常",
				"test.unhealthy": "異常",
				"test.error": "接続に失敗しました",
				"backend.pipeline": "pipeline（VLM なし、多言語対応）",
				"backend.vlm-engine": "vlm-engine（VLM のみ）",
				"backend.hybrid-engine": "hybrid-engine（VLM + pipeline）",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt（テキストのみ、OCR なし）",
				"parse.ocr": "ocr（OCR 強制）"
			},
			"de": {
				"nav": "MinerU",
				"page.title": "MinerU-Konfiguration",
				"page.intro": "MinerU-Dokumentparser-Server konfigurieren. Änderungen wirken sofort auf alle mineru_*-Tools.",
				"field.baseURL": "API-Basis-URL",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "API-Schlüssel-Umgebungsvariable",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "Standard-Backend",
				"field.defaultParseMethod": "Standard-Parsemethode",
				"field.defaultLang": "Standardsprache",
				"field.pollIntervalMs": "Polling-Intervall (ms)",
				"field.pollTimeoutMs": "Polling-Timeout (ms)",
				"field.requestTimeoutMs": "Anfrage-Timeout (ms)",
				"field.maxMdOutputChars": "Max. Markdown-Ausgabezeichen",
				"action.save": "Speichern",
				"action.saved": "Gespeichert",
				"action.test": "Verbindung testen",
				"action.testing": "Teste…",
				"test.healthy": "In Ordnung",
				"test.unhealthy": "Nicht in Ordnung",
				"test.error": "Verbindung fehlgeschlagen",
				"backend.pipeline": "pipeline (kein VLM, mehrsprachig)",
				"backend.vlm-engine": "vlm-engine (nur VLM)",
				"backend.hybrid-engine": "hybrid-engine (VLM + pipeline)",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt (nur Text, kein OCR)",
				"parse.ocr": "ocr (OCR erzwingen)"
			},
			"fr": {
				"nav": "MinerU",
				"page.title": "Configuration de MinerU",
				"page.intro": "Configurez le serveur d'analyse de documents MinerU. Les modifications s'appliquent immédiatement à tous les outils mineru_*.",
				"field.baseURL": "URL de base de l'API",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "Variable d'environnement de la clé API",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "Backend par défaut",
				"field.defaultParseMethod": "Méthode d'analyse par défaut",
				"field.defaultLang": "Langue par défaut",
				"field.pollIntervalMs": "Intervalle de sondage (ms)",
				"field.pollTimeoutMs": "Délai de sondage (ms)",
				"field.requestTimeoutMs": "Délai de requête (ms)",
				"field.maxMdOutputChars": "Nombre max de caractères Markdown",
				"action.save": "Enregistrer",
				"action.saved": "Enregistré",
				"action.test": "Tester la connexion",
				"action.testing": "Test en cours…",
				"test.healthy": "Opérationnel",
				"test.unhealthy": "Défaillant",
				"test.error": "Échec de la connexion",
				"backend.pipeline": "pipeline (sans VLM, multilingue)",
				"backend.vlm-engine": "vlm-engine (VLM uniquement)",
				"backend.hybrid-engine": "hybrid-engine (VLM + pipeline)",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt (texte seul, sans OCR)",
				"parse.ocr": "ocr (OCR forcé)"
			},
			"pt": {
				"nav": "MinerU",
				"page.title": "Configuração do MinerU",
				"page.intro": "Configure o servidor de análise de documentos MinerU. As alterações são aplicadas imediatamente a todas as ferramentas mineru_*.",
				"field.baseURL": "URL base da API",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "Variável de ambiente da chave de API",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "Backend padrão",
				"field.defaultParseMethod": "Método de análise padrão",
				"field.defaultLang": "Idioma padrão",
				"field.pollIntervalMs": "Intervalo de consulta (ms)",
				"field.pollTimeoutMs": "Tempo limite de consulta (ms)",
				"field.requestTimeoutMs": "Tempo limite de requisição (ms)",
				"field.maxMdOutputChars": "Máx. de caracteres de saída Markdown",
				"action.save": "Salvar",
				"action.saved": "Salvo",
				"action.test": "Testar conexão",
				"action.testing": "Testando…",
				"test.healthy": "Saudável",
				"test.unhealthy": "Anormal",
				"test.error": "Falha na conexão",
				"backend.pipeline": "pipeline (sem VLM, multilíngue)",
				"backend.vlm-engine": "vlm-engine (somente VLM)",
				"backend.hybrid-engine": "hybrid-engine (VLM + pipeline)",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt (somente texto, sem OCR)",
				"parse.ocr": "ocr (forçar OCR)"
			},
			"ko": {
				"nav": "MinerU",
				"page.title": "MinerU 설정",
				"page.intro": "MinerU 문서 파싱 서버를 구성합니다. 변경 사항은 모든 mineru_* 도구에 즉시 적용됩니다.",
				"field.baseURL": "API 기본 URL",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "API 키 환경 변수",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "기본 백엔드",
				"field.defaultParseMethod": "기본 파싱 방식",
				"field.defaultLang": "기본 언어",
				"field.pollIntervalMs": "폴링 간격 (ms)",
				"field.pollTimeoutMs": "폴링 제한 시간 (ms)",
				"field.requestTimeoutMs": "요청 제한 시간 (ms)",
				"field.maxMdOutputChars": "Markdown 출력 최대 문자 수",
				"action.save": "저장",
				"action.saved": "저장됨",
				"action.test": "연결 테스트",
				"action.testing": "테스트 중…",
				"test.healthy": "정상",
				"test.unhealthy": "비정상",
				"test.error": "연결 실패",
				"backend.pipeline": "pipeline (VLM 없음, 다국어)",
				"backend.vlm-engine": "vlm-engine (VLM 전용)",
				"backend.hybrid-engine": "hybrid-engine (VLM + pipeline)",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt (텍스트 전용, OCR 없음)",
				"parse.ocr": "ocr (OCR 강제)"
			},
			"ar": {
				"nav": "MinerU",
				"page.title": "إعدادات MinerU",
				"page.intro": "قم بتكوين خادم تحليل المستندات MinerU. تُطبَّق التغييرات فورًا على جميع أدوات mineru_*.",
				"field.baseURL": "عنوان URL الأساسي للـ API",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "متغير بيئة مفتاح API",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "الخادم الخلفي الافتراضي",
				"field.defaultParseMethod": "طريقة التحليل الافتراضية",
				"field.defaultLang": "اللغة الافتراضية",
				"field.pollIntervalMs": "فاصل الاستعلام (بالملي ثانية)",
				"field.pollTimeoutMs": "مهلة الاستعلام (بالملي ثانية)",
				"field.requestTimeoutMs": "مهلة الطلب (بالملي ثانية)",
				"field.maxMdOutputChars": "الحد الأقصى لأحرف إخراج Markdown",
				"action.save": "حفظ",
				"action.saved": "تم الحفظ",
				"action.test": "اختبار الاتصال",
				"action.testing": "جارٍ الاختبار…",
				"test.healthy": "سليم",
				"test.unhealthy": "غير سليم",
				"test.error": "فشل الاتصال",
				"backend.pipeline": "pipeline (بدون VLM، متعدد اللغات)",
				"backend.vlm-engine": "vlm-engine (VLM فقط)",
				"backend.hybrid-engine": "hybrid-engine (VLM + pipeline)",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt (نص فقط، بدون OCR)",
				"parse.ocr": "ocr (فرض OCR)"
			},
			"hi": {
				"nav": "MinerU",
				"page.title": "MinerU कॉन्फ़िगरेशन",
				"page.intro": "MinerU दस्तावेज़ पार्सिंग सर्वर कॉन्फ़िगर करें। परिवर्तन सभी mineru_* टूल पर तुरंत लागू होते हैं।",
				"field.baseURL": "API बेस URL",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "API कुंजी एनवायरनमेंट वेरिएबल",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "डिफ़ॉल्ट बैकएंड",
				"field.defaultParseMethod": "डिफ़ॉल्ट पार्सिंग विधि",
				"field.defaultLang": "डिफ़ॉल्ट भाषा",
				"field.pollIntervalMs": "पोलिंग अंतराल (ms)",
				"field.pollTimeoutMs": "पोलिंग टाइमआउट (ms)",
				"field.requestTimeoutMs": "अनुरोध टाइमआउट (ms)",
				"field.maxMdOutputChars": "अधिकतम Markdown आउटपुट वर्ण",
				"action.save": "सहेजें",
				"action.saved": "सहेजा गया",
				"action.test": "कनेक्शन जाँचें",
				"action.testing": "जाँच हो रही है…",
				"test.healthy": "स्वस्थ",
				"test.unhealthy": "अस्वस्थ",
				"test.error": "कनेक्शन विफल",
				"backend.pipeline": "pipeline (कोई VLM नहीं, बहुभाषी)",
				"backend.vlm-engine": "vlm-engine (केवल VLM)",
				"backend.hybrid-engine": "hybrid-engine (VLM + pipeline)",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt (केवल टेक्स्ट, कोई OCR नहीं)",
				"parse.ocr": "ocr (OCR ज़बरदस्ती)"
			},
			"id": {
				"nav": "MinerU",
				"page.title": "Konfigurasi MinerU",
				"page.intro": "Konfigurasikan server parsing dokumen MinerU. Perubahan langsung berlaku untuk semua alat mineru_*.",
				"field.baseURL": "URL Dasar API",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "Variabel Lingkungan Kunci API",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "Backend Default",
				"field.defaultParseMethod": "Metode Parsing Default",
				"field.defaultLang": "Bahasa Default",
				"field.pollIntervalMs": "Interval Polling (ms)",
				"field.pollTimeoutMs": "Waktu Tunggu Polling (ms)",
				"field.requestTimeoutMs": "Waktu Tunggu Permintaan (ms)",
				"field.maxMdOutputChars": "Maks. Karakter Output Markdown",
				"action.save": "Simpan",
				"action.saved": "Tersimpan",
				"action.test": "Uji Koneksi",
				"action.testing": "Menguji…",
				"test.healthy": "Sehat",
				"test.unhealthy": "Tidak Sehat",
				"test.error": "Koneksi gagal",
				"backend.pipeline": "pipeline (tanpa VLM, multibahasa)",
				"backend.vlm-engine": "vlm-engine (khusus VLM)",
				"backend.hybrid-engine": "hybrid-engine (VLM + pipeline)",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt (teks saja, tanpa OCR)",
				"parse.ocr": "ocr (paksa OCR)"
			},
			"tr": {
				"nav": "MinerU",
				"page.title": "MinerU Yapılandırması",
				"page.intro": "MinerU belge ayrıştırma sunucusunu yapılandırın. Değişiklikler tüm mineru_* araçlarına anında uygulanır.",
				"field.baseURL": "API Temel URL",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "API Anahtarı Ortam Değişkeni",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "Varsayılan Arka Uç",
				"field.defaultParseMethod": "Varsayılan Ayrıştırma Yöntemi",
				"field.defaultLang": "Varsayılan Dil",
				"field.pollIntervalMs": "Yoklama Aralığı (ms)",
				"field.pollTimeoutMs": "Yoklama Zaman Aşımı (ms)",
				"field.requestTimeoutMs": "İstek Zaman Aşımı (ms)",
				"field.maxMdOutputChars": "Maks. Markdown Çıktı Karakteri",
				"action.save": "Kaydet",
				"action.saved": "Kaydedildi",
				"action.test": "Bağlantıyı Test Et",
				"action.testing": "Test ediliyor…",
				"test.healthy": "Sağlıklı",
				"test.unhealthy": "Sağlıksız",
				"test.error": "Bağlantı başarısız",
				"backend.pipeline": "pipeline (VLM yok, çok dilli)",
				"backend.vlm-engine": "vlm-engine (yalnızca VLM)",
				"backend.hybrid-engine": "hybrid-engine (VLM + pipeline)",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt (yalnızca metin, OCR yok)",
				"parse.ocr": "ocr (OCR zorla)"
			},
			"vi": {
				"nav": "MinerU",
				"page.title": "Cấu hình MinerU",
				"page.intro": "Định cấu hình máy chủ phân tích tài liệu MinerU. Thay đổi áp dụng ngay cho mọi công cụ mineru_*.",
				"field.baseURL": "URL gốc API",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "Biến môi trường khóa API",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "Backend mặc định",
				"field.defaultParseMethod": "Phương thức phân tích mặc định",
				"field.defaultLang": "Ngôn ngữ mặc định",
				"field.pollIntervalMs": "Khoảng thời gian thăm dò (ms)",
				"field.pollTimeoutMs": "Hết thời gian thăm dò (ms)",
				"field.requestTimeoutMs": "Hết thời gian yêu cầu (ms)",
				"field.maxMdOutputChars": "Tối đa ký tự xuất Markdown",
				"action.save": "Lưu",
				"action.saved": "Đã lưu",
				"action.test": "Kiểm tra kết nối",
				"action.testing": "Đang kiểm tra…",
				"test.healthy": "Hoạt động tốt",
				"test.unhealthy": "Không ổn",
				"test.error": "Kết nối thất bại",
				"backend.pipeline": "pipeline (không VLM, đa ngôn ngữ)",
				"backend.vlm-engine": "vlm-engine (chỉ VLM)",
				"backend.hybrid-engine": "hybrid-engine (VLM + pipeline)",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt (chỉ văn bản, không OCR)",
				"parse.ocr": "ocr (buộc OCR)"
			},
			"th": {
				"nav": "MinerU",
				"page.title": "การกำหนดค่า MinerU",
				"page.intro": "กำหนดค่าเซิร์ฟเวอร์แยกวิเคราะห์เอกสาร MinerU การเปลี่ยนแปลงมีผลทันทีกับเครื่องมือ mineru_* ทั้งหมด",
				"field.baseURL": "URL ฐานของ API",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "ตัวแปรสภาพแวดล้อมคีย์ API",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "แบ็กเอนด์เริ่มต้น",
				"field.defaultParseMethod": "วิธีแยกวิเคราะห์เริ่มต้น",
				"field.defaultLang": "ภาษาเริ่มต้น",
				"field.pollIntervalMs": "ช่วงเวลาการสอบถาม (ms)",
				"field.pollTimeoutMs": "หมดเวลาการสอบถาม (ms)",
				"field.requestTimeoutMs": "หมดเวลาคำขอ (ms)",
				"field.maxMdOutputChars": "อักขระสูงสุดของเอาต์พุต Markdown",
				"action.save": "บันทึก",
				"action.saved": "บันทึกแล้ว",
				"action.test": "ทดสอบการเชื่อมต่อ",
				"action.testing": "กำลังทดสอบ…",
				"test.healthy": "ปกติ",
				"test.unhealthy": "ผิดปกติ",
				"test.error": "การเชื่อมต่อล้มเหลว",
				"backend.pipeline": "pipeline (ไม่มี VLM, หลายภาษา)",
				"backend.vlm-engine": "vlm-engine (เฉพาะ VLM)",
				"backend.hybrid-engine": "hybrid-engine (VLM + pipeline)",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt (เฉพาะข้อความ ไม่มี OCR)",
				"parse.ocr": "ocr (บังคับ OCR)"
			},
			"ru": {
				"nav": "MinerU",
				"page.title": "Конфигурация MinerU",
				"page.intro": "Настройте сервер разбора документов MinerU. Изменения немедленно применяются ко всем инструментам mineru_*.",
				"field.baseURL": "Базовый URL API",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "Переменная окружения ключа API",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "Бэкенд по умолчанию",
				"field.defaultParseMethod": "Метод разбора по умолчанию",
				"field.defaultLang": "Язык по умолчанию",
				"field.pollIntervalMs": "Интервал опроса (мс)",
				"field.pollTimeoutMs": "Таймаут опроса (мс)",
				"field.requestTimeoutMs": "Таймаут запроса (мс)",
				"field.maxMdOutputChars": "Макс. символов вывода Markdown",
				"action.save": "Сохранить",
				"action.saved": "Сохранено",
				"action.test": "Проверить соединение",
				"action.testing": "Проверка…",
				"test.healthy": "Исправно",
				"test.unhealthy": "Неисправно",
				"test.error": "Ошибка соединения",
				"backend.pipeline": "pipeline (без VLM, мультиязычный)",
				"backend.vlm-engine": "vlm-engine (только VLM)",
				"backend.hybrid-engine": "hybrid-engine (VLM + pipeline)",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt (только текст, без OCR)",
				"parse.ocr": "ocr (принудительный OCR)"
			},
			"it": {
				"nav": "MinerU",
				"page.title": "Configurazione MinerU",
				"page.intro": "Configura il server di parsing documenti MinerU. Le modifiche si applicano immediatamente a tutti gli strumenti mineru_*.",
				"field.baseURL": "URL di base API",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "Variabile d'ambiente chiave API",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "Backend predefinito",
				"field.defaultParseMethod": "Metodo di parsing predefinito",
				"field.defaultLang": "Lingua predefinita",
				"field.pollIntervalMs": "Intervallo di polling (ms)",
				"field.pollTimeoutMs": "Timeout polling (ms)",
				"field.requestTimeoutMs": "Timeout richiesta (ms)",
				"field.maxMdOutputChars": "Max caratteri output Markdown",
				"action.save": "Salva",
				"action.saved": "Salvato",
				"action.test": "Testa connessione",
				"action.testing": "Test in corso…",
				"test.healthy": "Funzionante",
				"test.unhealthy": "Non funzionante",
				"test.error": "Connessione fallita",
				"backend.pipeline": "pipeline (senza VLM, multilingue)",
				"backend.vlm-engine": "vlm-engine (solo VLM)",
				"backend.hybrid-engine": "hybrid-engine (VLM + pipeline)",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt (solo testo, senza OCR)",
				"parse.ocr": "ocr (OCR forzato)"
			},
			"nl": {
				"nav": "MinerU",
				"page.title": "MinerU-configuratie",
				"page.intro": "Configureer de MinerU-documentparsingserver. Wijzigingen zijn direct van toepassing op alle mineru_*-tools.",
				"field.baseURL": "API-basis-URL",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "API-sleutelomgevingsvariabele",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "Standaardbackend",
				"field.defaultParseMethod": "Standaardparsingmethode",
				"field.defaultLang": "Standaardtaal",
				"field.pollIntervalMs": "Polling-interval (ms)",
				"field.pollTimeoutMs": "Polling-timeout (ms)",
				"field.requestTimeoutMs": "Aanvraagtimeout (ms)",
				"field.maxMdOutputChars": "Max. Markdown-uitvoertekens",
				"action.save": "Opslaan",
				"action.saved": "Opgeslagen",
				"action.test": "Verbinding testen",
				"action.testing": "Bezig met testen…",
				"test.healthy": "Gezond",
				"test.unhealthy": "Ongezond",
				"test.error": "Verbinding mislukt",
				"backend.pipeline": "pipeline (geen VLM, meertalig)",
				"backend.vlm-engine": "vlm-engine (alleen VLM)",
				"backend.hybrid-engine": "hybrid-engine (VLM + pipeline)",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt (alleen tekst, geen OCR)",
				"parse.ocr": "ocr (OCR afdwingen)"
			},
			"sv": {
				"nav": "MinerU",
				"page.title": "MinerU-konfiguration",
				"page.intro": "Konfigurera MinerU-servern för dokumentparsning. Ändringar tillämpas omedelbart på alla mineru_*-verktyg.",
				"field.baseURL": "API-bas-URL",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "API-nyckelns miljövariabel",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "Standardbackend",
				"field.defaultParseMethod": "Standardparsningsmetod",
				"field.defaultLang": "Standardspråk",
				"field.pollIntervalMs": "Pollningsintervall (ms)",
				"field.pollTimeoutMs": "Pollningstimeout (ms)",
				"field.requestTimeoutMs": "Begärandetimeout (ms)",
				"field.maxMdOutputChars": "Max Markdown-utdatatecken",
				"action.save": "Spara",
				"action.saved": "Sparat",
				"action.test": "Testa anslutningen",
				"action.testing": "Testar…",
				"test.healthy": "Fungerar",
				"test.unhealthy": "Fungerar inte",
				"test.error": "Anslutningen misslyckades",
				"backend.pipeline": "pipeline (ingen VLM, flerspråkig)",
				"backend.vlm-engine": "vlm-engine (endast VLM)",
				"backend.hybrid-engine": "hybrid-engine (VLM + pipeline)",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt (endast text, ingen OCR)",
				"parse.ocr": "ocr (tvinga OCR)"
			},
			"pl": {
				"nav": "MinerU",
				"page.title": "Konfiguracja MinerU",
				"page.intro": "Skonfiguruj serwer parsowania dokumentów MinerU. Zmiany natychmiast dotyczą wszystkich narzędzi mineru_*.",
				"field.baseURL": "Bazowy URL API",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "Zmienna środowiskowa klucza API",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "Domyślny backend",
				"field.defaultParseMethod": "Domyślna metoda parsowania",
				"field.defaultLang": "Domyślny język",
				"field.pollIntervalMs": "Interwał odpytywania (ms)",
				"field.pollTimeoutMs": "Limit czasu odpytywania (ms)",
				"field.requestTimeoutMs": "Limit czasu żądania (ms)",
				"field.maxMdOutputChars": "Maks. znaków wyjściowych Markdown",
				"action.save": "Zapisz",
				"action.saved": "Zapisano",
				"action.test": "Testuj połączenie",
				"action.testing": "Testowanie…",
				"test.healthy": "Sprawny",
				"test.unhealthy": "Niesprawny",
				"test.error": "Nie udało się połączyć",
				"backend.pipeline": "pipeline (bez VLM, wielojęzyczny)",
				"backend.vlm-engine": "vlm-engine (tylko VLM)",
				"backend.hybrid-engine": "hybrid-engine (VLM + pipeline)",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt (tylko tekst, bez OCR)",
				"parse.ocr": "ocr (wymuś OCR)"
			},
			"zh-HK": {
				"nav": "MinerU",
				"page.title": "MinerU 設定",
				"page.intro": "設定 MinerU 文件解析伺服器。修改後即時對所有 mineru_* 工具生效。",
				"field.baseURL": "API 位址",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "API Key 環境變數",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "預設後端",
				"field.defaultParseMethod": "預設解析方式",
				"field.defaultLang": "預設語言",
				"field.pollIntervalMs": "輪詢間隔 (ms)",
				"field.pollTimeoutMs": "輪詢逾時 (ms)",
				"field.requestTimeoutMs": "請求逾時 (ms)",
				"field.maxMdOutputChars": "Markdown 輸出字元上限",
				"action.save": "儲存",
				"action.saved": "已儲存",
				"action.test": "測試連線",
				"action.testing": "測試中…",
				"test.healthy": "健康",
				"test.unhealthy": "異常",
				"test.error": "連線失敗",
				"backend.pipeline": "pipeline（無 VLM，多語言）",
				"backend.vlm-engine": "vlm-engine（僅 VLM）",
				"backend.hybrid-engine": "hybrid-engine（VLM + pipeline）",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt（僅文字，不 OCR）",
				"parse.ocr": "ocr（強制 OCR）"
			},
			"zh-TW": {
				"nav": "MinerU",
				"page.title": "MinerU 設定",
				"page.intro": "設定 MinerU 文件解析伺服器。修改後立即對所有 mineru_* 工具生效。",
				"field.baseURL": "API 位址",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "API Key 環境變數",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "預設後端",
				"field.defaultParseMethod": "預設解析方式",
				"field.defaultLang": "預設語言",
				"field.pollIntervalMs": "輪詢間隔 (ms)",
				"field.pollTimeoutMs": "輪詢逾時 (ms)",
				"field.requestTimeoutMs": "請求逾時 (ms)",
				"field.maxMdOutputChars": "Markdown 輸出字元上限",
				"action.save": "儲存",
				"action.saved": "已儲存",
				"action.test": "測試連線",
				"action.testing": "測試中…",
				"test.healthy": "健康",
				"test.unhealthy": "異常",
				"test.error": "連線失敗",
				"backend.pipeline": "pipeline（無 VLM，多語言）",
				"backend.vlm-engine": "vlm-engine（僅 VLM）",
				"backend.hybrid-engine": "hybrid-engine（VLM + pipeline）",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt（僅文字，不 OCR）",
				"parse.ocr": "ocr（強制 OCR）"
			},
			"zh-MO": {
				"nav": "MinerU",
				"page.title": "MinerU 設定",
				"page.intro": "設定 MinerU 文件解析伺服器。修改後即時對所有 mineru_* 工具生效。",
				"field.baseURL": "API 位址",
				"field.baseURL.placeholder": "http://your-mineru-host:18000",
				"field.apiKeyEnv": "API Key 環境變數",
				"field.apiKeyEnv.placeholder": "MINERU_API_KEY",
				"field.defaultBackend": "預設後端",
				"field.defaultParseMethod": "預設解析方式",
				"field.defaultLang": "預設語言",
				"field.pollIntervalMs": "輪詢間隔 (ms)",
				"field.pollTimeoutMs": "輪詢逾時 (ms)",
				"field.requestTimeoutMs": "請求逾時 (ms)",
				"field.maxMdOutputChars": "Markdown 輸出字元上限",
				"action.save": "儲存",
				"action.saved": "已儲存",
				"action.test": "測試連線",
				"action.testing": "測試中…",
				"test.healthy": "健康",
				"test.unhealthy": "異常",
				"test.error": "連線失敗",
				"backend.pipeline": "pipeline（無 VLM，多語言）",
				"backend.vlm-engine": "vlm-engine（僅 VLM）",
				"backend.hybrid-engine": "hybrid-engine（VLM + pipeline）",
				"backend.vlm-http-client": "vlm-http-client",
				"backend.hybrid-http-client": "hybrid-http-client",
				"parse.auto": "auto",
				"parse.txt": "txt（僅文字，不 OCR）",
				"parse.ocr": "ocr（強制 OCR）"
			}
		};
		//#endregion
		//#region src/client/index.ts
		const inject = [
			"slots",
			"locale",
			"connection"
		];
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "dsh-mineru: dictionaries");
			const betterLocale = ctx.get("betterLocale");
			if (betterLocale) ctx.effect(() => betterLocale.register(NS, dicts), "dsh-mineru: better-locale override dicts");
			const connection = ctx.connection;
			const t = ctx.locale.bind(NS);
			const settingsInjected = () => ({
				rpc: connection.rpc,
				t
			});
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "dsh-mineru",
				order: 40,
				label: () => t("nav"),
				inject: settingsInjected
			}, SettingsPage));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map