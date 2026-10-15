import { t as e } from "./chunks/endpoint-BhoYC3ie.js";
//#region src/island-loader.ts
var t = () => import("./chunks/mount-DYmoEgTR.js"), n = "ipfs-agent-chat", r = "ipfs-agent-chat-openchange", i = "ipfs-agent-chat-notice", a = [
	"dark",
	"light",
	"auto"
], o = "\n:host { all: initial; position: fixed; inset: 0; z-index: var(--ipfs-agent-chat-z-index, 1000); display: block;\n  overflow: hidden; pointer-events: none; contain: layout style; }\n:host(:not([data-active])) { display: none; }\n", s = () => new Promise((e) => {
	let t = globalThis.requestAnimationFrame;
	if (typeof t != "function") return void setTimeout(e, 16);
	t(() => t(() => e()));
}), c = class extends HTMLElement {
	static observedAttributes = [
		"endpoint",
		"open",
		"theme"
	];
	#e;
	#t;
	#n;
	#r;
	#i;
	#a = null;
	#o = 0;
	get endpoint() {
		return this.getAttribute("endpoint") ?? void 0;
	}
	set endpoint(e) {
		e === void 0 || e === "" ? this.removeAttribute("endpoint") : this.setAttribute("endpoint", e);
	}
	get open() {
		return this.hasAttribute("open");
	}
	set open(e) {
		this.toggleAttribute("open", !!e);
	}
	get theme() {
		let e = this.getAttribute("theme");
		return a.includes(e) ? e : "auto";
	}
	set theme(e) {
		this.setAttribute("theme", e);
	}
	get token() {}
	set token(e) {
		this.#e = typeof e == "string" && e !== "" ? e : void 0, this.#u();
	}
	get tokenProvider() {}
	set tokenProvider(e) {
		this.#t = typeof e == "function" ? e : void 0, this.#u();
	}
	get tokenSet() {
		return this.#e !== void 0 || this.#t !== void 0;
	}
	openPanel() {
		this.open = !0;
	}
	close() {
		this.open = !1;
	}
	toggle() {
		this.open = !this.open;
	}
	connectedCallback() {
		this.#n || (this.#n = this.attachShadow({ mode: "closed" }), l(this.#n)), this.hasAttribute("token") && (this.removeAttribute("token"), this.dispatchEvent(new CustomEvent(i, { detail: { message: "The token attribute is ignored and removed. Set the token property." } }))), this.#u();
	}
	disconnectedCallback() {
		this.#o++, this.#r?.unmount(), this.#r = void 0, this.#i = void 0, this.removeAttribute("data-active");
	}
	attributeChangedCallback(e, t, n) {
		t !== n && (e === "open" && this.#c(n !== null), this.#u());
	}
	#s = async () => {
		if (this.#e !== void 0) return this.#e;
		try {
			return await this.#t?.() || void 0;
		} catch {
			return;
		}
	};
	#c(e) {
		if (e) {
			let e = document.activeElement;
			this.#a = e && e !== this ? e : null;
		} else {
			let e = this.#a;
			this.#a = null, e instanceof HTMLElement && e.isConnected && e.focus({ preventScroll: !0 });
		}
		this.dispatchEvent(new CustomEvent(r, {
			detail: { open: e },
			bubbles: !0,
			composed: !0
		}));
	}
	#l(e) {
		return {
			endpoint: this.endpoint,
			getToken: this.#s,
			tokenSet: this.tokenSet,
			open: e,
			theme: this.theme,
			onOpenChange: (e) => {
				this.open = e;
			}
		};
	}
	#u() {
		this.isConnected && this.#n && (this.#r || this.open) && this.#d();
	}
	async #d() {
		let e = this.#o, n = this.#n;
		n && (this.#r ? this.#r.update(this.#l(this.open)) : (this.#i ??= t().then(async ({ mountIsland: t }) => {
			e !== this.#o || this.#r || (this.#r = t(n, this.#l(!1)), this.setAttribute("data-active", ""), this.open && (await s(), e === this.#o && this.#r?.update(this.#l(this.open))));
		}), await this.#i));
	}
};
function l(e) {
	if (typeof CSSStyleSheet < "u" && "adoptedStyleSheets" in e) try {
		let t = new CSSStyleSheet();
		t.replaceSync(o), e.adoptedStyleSheets = [t];
		return;
	} catch {}
	let t = document.createElement("style");
	t.textContent = o, e.append(t);
}
function u(e = n) {
	customElements.get(e) || customElements.define(e, c);
}
//#endregion
//#region src/index.ts
u();
//#endregion
export { n as ELEMENT_TAG, c as IpfsAgentChatElement, i as NOTICE_EVENT, r as OPEN_CHANGE_EVENT, e as SUGGESTED_AGUI_ENDPOINT, u as defineIpfsAgentChat };

//# sourceMappingURL=ipfs-agent-chat.js.map