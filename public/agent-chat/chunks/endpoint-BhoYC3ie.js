//#region src/agui/endpoint.ts
var e = "http://127.0.0.1:5050/agui", t = /* @__PURE__ */ new Set([
	"127.0.0.1",
	"localhost",
	"[::1]"
]);
function n(e) {
	if (!e) return {
		ok: !1,
		reason: "No endpoint is configured."
	};
	let n;
	try {
		n = new URL(e);
	} catch {
		return {
			ok: !1,
			reason: "The endpoint is not an absolute URL."
		};
	}
	return n.protocol !== "https:" && n.protocol !== "http:" ? {
		ok: !1,
		reason: "The endpoint must use https, or http on a loopback address."
	} : n.protocol === "http:" && !t.has(n.hostname) ? {
		ok: !1,
		reason: "The endpoint uses http on a non-loopback host. The bearer would travel in clear text."
	} : n.username || n.password ? {
		ok: !1,
		reason: "The endpoint must not carry credentials in the URL."
	} : n.search || n.hash ? {
		ok: !1,
		reason: "The endpoint must not carry a query or fragment."
	} : n.pathname.endsWith("/agui") ? {
		ok: !0,
		url: n,
		origin: n.origin
	} : {
		ok: !1,
		reason: "The endpoint path must end in /agui."
	};
}
var r = class extends Error {
	name = "OriginRefusedError";
};
function i(e, t) {
	return ((n, i) => {
		let a = n instanceof Request ? n.url : String(n), o;
		try {
			o = new URL(a).origin;
		} catch {
			throw new r("The request URL is not absolute.");
		}
		if (o !== e) throw new r(`Refused a request to ${o}. The chat talks only to ${e}.`);
		return t(n, i);
	});
}
//#endregion
export { n, i as r, e as t };

//# sourceMappingURL=endpoint-BhoYC3ie.js.map