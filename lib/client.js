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