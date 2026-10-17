import { t as e } from "./chunks/endpoint-BhoYC3ie.js";
//#region src/island-loader.ts
var t = () => import("./chunks/mount-CNmDQGhI.js"), n = "ipfs-agent-chat", r = "ipfs-agent-chat-openchange", i = "ipfs-agent-chat-notice", a = "ipfs-agent-chat-session-expired", o = [
	"dark",
	"light",
	"auto"
], s = "\n:host { all: initial; position: fixed; inset: 0; z-index: var(--ipfs-agent-chat-z-index, 1000); display: block;\n  overflow: hidden; pointer-events: none; contain: layout style; }\n:host(:not([data-active])) { display: none; }\n", c = () => new Promise((e) => {
	let t = globalThis.requestAnimationFrame;
	if (typeof t != "function") return void setTimeout(e, 16);
	t(() => t(() => e()));
}), l = class extends HTMLElement {
	static observedAttributes = [
		"endpoint",
		"open",
		"theme",
		"session"
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
	get session() {
		return this.hasAttribute("session");
	}
	set session(e) {
		this.toggleAttribute("session", !!e);
	}
	get theme() {
		let e = this.getAttribute("theme");
		return o.includes(e) ? e : "auto";
	}
	set theme(e) {
		this.setAttribute("theme", e);
	}
	get token() {}
	set token(e) {
		this.#e = typeof e == "string" && e !== "" ? e : void 0, this.#d();
	}
	get tokenProvider() {}
	set tokenProvider(e) {
		this.#t = typeof e == "function" ? e : void 0, this.#d();
	}
	get tokenSet() {
		return this.session || this.#e !== void 0 || this.#t !== void 0;
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
		this.#n || (this.#n = this.attachShadow({ mode: "closed" }), u(this.#n)), this.hasAttribute("token") && (this.removeAttribute("token"), this.dispatchEvent(new CustomEvent(i, { detail: { message: "The token attribute is ignored and removed. Set the token property." } }))), this.#d();
	}
	disconnectedCallback() {
		this.#o++, this.#r?.unmount(), this.#r = void 0, this.#i = void 0, this.removeAttribute("data-active");
	}
	attributeChangedCallback(e, t, n) {
		t !== n && (e === "open" && this.#l(n !== null), this.#d());
	}
	#s = async () => {
		if (this.#e !== void 0) return this.#e;
		try {
			return await this.#t?.() || void 0;
		} catch {
			return;
		}
	};
	#c = () => {
		this.dispatchEvent(new CustomEvent(a, {
			bubbles: !0,
			composed: !0
		}));
	};
	#l(e) {
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
	#u(e) {
		return {
			endpoint: this.endpoint,
			getToken: this.#s,
			tokenSet: this.tokenSet,
			session: this.session,
			onSessionExpired: this.#c,
			open: e,
			theme: this.theme,
			onOpenChange: (e) => {
				this.open = e;
			}
		};
	}
	#d() {
		this.isConnected && this.#n && (this.#r || this.open) && this.#f();
	}
	async #f() {
		let e = this.#o, n = this.#n;
		n && (this.#r ? this.#r.update(this.#u(this.open)) : (this.#i ??= t().then(async ({ mountIsland: t }) => {
			e !== this.#o || this.#r || (this.#r = t(n, this.#u(!1)), this.setAttribute("data-active", ""), this.open && (await c(), e === this.#o && this.#r?.update(this.#u(this.open))));
		}), await this.#i));
	}
};
function u(e) {
	if (typeof CSSStyleSheet < "u" && "adoptedStyleSheets" in e) try {
		let t = new CSSStyleSheet();
		t.replaceSync(s), e.adoptedStyleSheets = [t];
		return;
	} catch {}
	let t = document.createElement("style");
	t.textContent = s, e.append(t);
}
function d(e = n) {
	customElements.get(e) || customElements.define(e, l);
}
//#endregion
//#region src/index.ts
d();
//#endregion
export { n as ELEMENT_TAG, l as IpfsAgentChatElement, i as NOTICE_EVENT, r as OPEN_CHANGE_EVENT, a as SESSION_EXPIRED_EVENT, e as SUGGESTED_AGUI_ENDPOINT, d as defineIpfsAgentChat };

//# sourceMappingURL=ipfs-agent-chat.js.map