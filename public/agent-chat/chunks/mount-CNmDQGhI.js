import { n as e, r as t } from "./endpoint-BhoYC3ie.js";
//#region \0rolldown/runtime.js
var n = Object.create, r = Object.defineProperty, i = Object.getOwnPropertyDescriptor, a = Object.getOwnPropertyNames, o = Object.getPrototypeOf, s = Object.prototype.hasOwnProperty, c = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), l = (e, t, n, o) => {
	if (t && typeof t == "object" || typeof t == "function") for (var c = a(t), l = 0, u = c.length, d; l < u; l++) d = c[l], !s.call(e, d) && d !== n && r(e, d, {
		get: ((e) => t[e]).bind(null, d),
		enumerable: !(o = i(t, d)) || o.enumerable
	});
	return e;
}, u = (e, t, i) => (i = e == null ? {} : n(o(e)), l(t || !e || !e.__esModule || !s.call(e, "default") ? r(i, "default", {
	value: e,
	enumerable: !0
}) : i, e));
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/util.js
function d(e) {
	let t = Object.values(e).filter((e) => typeof e == "number");
	return Object.entries(e).filter(([e, n]) => t.indexOf(+e) === -1).map(([e, t]) => t);
}
function f(e, t = "|") {
	return e.map((e) => ge(e)).join(t);
}
function p(e, t) {
	return typeof t == "bigint" ? t.toString() : t;
}
var m = class {
	constructor(e) {
		this._getter = e, this._value = void 0;
	}
	get value() {
		let e = this._getter;
		return e !== void 0 && (this._value = e(), this._getter = void 0), this._value;
	}
};
function h(e) {
	return new m(e);
}
function g(e) {
	return e == null;
}
function _(e) {
	let t = +!!e.startsWith("^"), n = e.endsWith("$") ? e.length - 1 : e.length;
	return e.slice(t, n);
}
function v(e, t) {
	let n = e / t, r = Math.round(n), i = 4 * 2 ** -52 * Math.max(Math.abs(n), 1);
	return Math.abs(n - r) < i ? 0 : n - r;
}
function y(e, t, n) {
	Object.defineProperty(e, t, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
function ee(e) {
	let t = Object.getOwnPropertyDescriptor(e, "shape");
	return t?.get ? t.get.raw : t?.value;
}
function te(e) {
	return ee(e._zod.def) ?? e._zod.def.shape;
}
function ne(e, t, n) {
	Object.defineProperty(e, t, {
		get() {
			let e = n();
			return y(this, t, e), e;
		},
		enumerable: !0,
		configurable: !0
	});
}
function re(e, t, n) {
	t in e ? y(e, t, n) : e[t] = n;
}
function b(e, t, n, r) {
	let i = te(t);
	for (let a of n) {
		let n = Object.getOwnPropertyDescriptor(i, a);
		n.enumerable && (n.get ? ne(e, a, () => {
			let e = t._zod.def.shape[a];
			return r ? r(e, a) : e;
		}) : re(e, a, r ? r(n.value, a) : n.value));
	}
}
function ie(e, t) {
	for (let n of Reflect.ownKeys(t)) {
		let r = Object.getOwnPropertyDescriptor(t, n);
		r.enumerable && (r.get ? ne(e, n, () => t[n]) : re(e, n, r.value));
	}
}
function ae(...e) {
	let t = {};
	for (let n of e) {
		let e = Object.getOwnPropertyDescriptors(n);
		Object.assign(t, e);
	}
	return Object.defineProperties({}, t);
}
function oe(e) {
	return JSON.stringify(e);
}
function se(e) {
	return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var ce = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {};
function le(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
var ue = /* @__PURE__*/ h(() => {
	if (rt.jitless || typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
	try {
		return Function(""), !0;
	} catch {
		return !1;
	}
});
function de(e) {
	if (le(e) === !1) return !1;
	let t = e.constructor;
	if (t === void 0 || typeof t != "function") return !0;
	let n = t.prototype;
	return le(n) !== !1 && Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") !== !1;
}
function fe(e) {
	return de(e) ? { ...e } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e;
}
var pe = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function me(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function he(e, t, n) {
	let r = new e._zod.constr(t ?? e._zod.def);
	return (!t || n?.parent) && (r._zod.parent = e), r;
}
function x(e) {
	let t = e;
	if (!t) return {};
	if (typeof t == "string") return { error: () => t };
	if (t?.message !== void 0) {
		if (t?.error !== void 0) throw Error("Cannot specify both `message` and `error` params");
		t.error = t.message;
	}
	return delete t.message, typeof t.error == "string" ? {
		...t,
		error: () => t.error
	} : t;
}
function ge(e) {
	return typeof e == "bigint" ? e.toString() + "n" : typeof e == "string" ? `"${e}"` : `${e}`;
}
function _e(e) {
	return Object.keys(e).filter((t) => e[t]._zod.optin !== void 0 && e[t]._zod.optout === "optional");
}
var ve = {
	safeint: [-(2 ** 53 - 1), 2 ** 53 - 1],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}, ye = {
	int64: [/* @__PURE__*/ BigInt("-9223372036854775808"), /* @__PURE__*/ BigInt("9223372036854775807")],
	uint64: [/* @__PURE__*/ BigInt(0), /* @__PURE__*/ BigInt("18446744073709551615")]
};
function be(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".pick() cannot be used on object schemas containing refinements");
	let i = {};
	return b(i, e, xe(e, t)), he(e, ae(n, {
		shape: i,
		checks: []
	}));
}
function xe(e, t) {
	let n = te(e), r = [];
	for (let e of Reflect.ownKeys(t)) {
		if (!Object.getOwnPropertyDescriptor(n, e)?.enumerable) throw Error(`Unrecognized key: "${String(e)}"`);
		t[e] && r.push(e);
	}
	return r;
}
function Se(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".omit() cannot be used on object schemas containing refinements");
	let i = new Set(xe(e, t)), a = {};
	return b(a, e, Reflect.ownKeys(te(e)).filter((e) => !i.has(e))), he(e, ae(n, {
		shape: a,
		checks: []
	}));
}
function Ce(e, t) {
	if (!de(t)) throw Error("Invalid input to extend: expected a plain object");
	let n = e._zod.def.checks;
	if (n && n.length > 0) {
		let n = te(e);
		for (let e of Reflect.ownKeys(t)) if (Object.getOwnPropertyDescriptor(n, e) !== void 0) throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return he(e, ae(e._zod.def, { shape: we(e, t) }));
}
function we(e, t) {
	let n = {};
	return b(n, e, Reflect.ownKeys(te(e))), ie(n, t), n;
}
function Te(e, t) {
	if (!de(t)) throw Error("Invalid input to safeExtend: expected a plain object");
	return he(e, ae(e._zod.def, { shape: we(e, t) }));
}
function S(e, t) {
	if (!t?._zod?.def) throw Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
	if (e._zod.def.checks?.length) throw Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	let n = {};
	return b(n, e, Reflect.ownKeys(te(e))), b(n, t, Reflect.ownKeys(te(t))), he(e, ae(e._zod.def, {
		shape: n,
		get catchall() {
			return t._zod.def.catchall;
		},
		checks: t._zod.def.checks ?? []
	}));
}
function Ee(e, t, n, r = "partial") {
	let i = t._zod.def.checks;
	if (i && i.length > 0) throw Error(`.${r}() cannot be used on object schemas containing refinements`);
	let a = n ? new Set(xe(t, n)) : void 0, o = {};
	return b(o, t, Reflect.ownKeys(te(t)), e && ((t, n) => a && !a.has(n) ? t : new e({
		type: "optional",
		innerType: t
	}))), he(t, ae(t._zod.def, {
		shape: o,
		checks: []
	}));
}
function De(e, t, n) {
	let r = n ? new Set(xe(t, n)) : void 0, i = {};
	return b(i, t, Reflect.ownKeys(te(t)), (t, n) => r && !r.has(n) ? t : new e({
		type: "nonoptional",
		innerType: t
	})), he(t, ae(t._zod.def, { shape: i }));
}
function Oe(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0;
	return !1;
}
function ke(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue === !1) return !0;
	return !1;
}
function Ae(e, t) {
	return t.map((t) => {
		var n;
		return (n = t).path ?? (n.path = []), t.path.unshift(e), t;
	});
}
function je(e) {
	return typeof e == "string" ? e : e?.message;
}
function Me(e, t, n) {
	var r;
	for (let i = t; i < e.length; i++) (r = e[i]).schema ?? (r.schema = n);
}
function Ne(e, t, n) {
	var r;
	let i = e.inst?._zod?.traits;
	i?.has("$ZodType") && (i.has("$ZodCheck") ? (r = e).schema ?? (r.schema = e.inst) : e.schema = e.inst);
	let a = e.schema === e.inst ? void 0 : e.schema?._zod.def?.error, o = e.message ? e.message : je(e.inst?._zod.def?.error?.(e)) ?? je(a?.(e)) ?? je(t?.error?.(e)) ?? je(n.customError?.(e)) ?? je(n.localeError?.(e)) ?? "Invalid input", s = {};
	for (let t of Object.keys(e)) t !== "inst" && t !== "schema" && t !== "continue" && t !== "input" && t !== "__proto__" && (s[t] = e[t]);
	return s.path ??= [], s.message = o, t?.reportInput && (s.input = e.input), s;
}
var Pe = /[\uD800-\uDBFF]/;
function Fe(e) {
	let t = e.length;
	if (!Pe.test(e)) return t;
	let n = t;
	for (let r = 0; r < t - 1; r++) (e.charCodeAt(r) & 64512) == 55296 && (e.charCodeAt(r + 1) & 64512) == 56320 && (n--, r++);
	return n;
}
function Ie(e) {
	return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function Le(e) {
	let t = typeof e;
	switch (t) {
		case "number": return Number.isNaN(e) ? "nan" : "number";
		case "object": {
			if (e === null) return "null";
			if (Array.isArray(e)) return "array";
			let t = e;
			if (t && Object.getPrototypeOf(t) !== Object.prototype && "constructor" in t && t.constructor) return t.constructor.name;
		}
	}
	return t;
}
function Re(...e) {
	let [t, n, r] = e;
	return typeof t == "string" ? {
		message: t,
		code: "custom",
		input: n,
		inst: r
	} : { ...t };
}
function ze(e, t) {
	for (let n in t) {
		let r = Object.getOwnPropertyDescriptor(t, n);
		r.get ? Object.defineProperty(e, n, {
			...r,
			enumerable: !1
		}) : Ue(e, n, r.value);
	}
}
function Be(e, t, n, r = !0) {
	return Object.defineProperty(e, t, {
		configurable: !0,
		writable: !0,
		enumerable: r,
		value: n
	}), n;
}
function Ve(e, t, n) {
	return Be(e, t, n, !1);
}
function He(e, t) {
	for (let n in e) {
		let r = e[n];
		Object.defineProperty(t, n, {
			configurable: !0,
			enumerable: !0,
			get() {
				return Be(this, n, r(this));
			},
			set(e) {
				Be(this, n, e);
			}
		});
	}
	return t;
}
function Ue(e, t, n) {
	Object.defineProperty(e, t, {
		configurable: !0,
		get() {
			return this == null ? n : Be(this, t, n.bind(this));
		},
		set(e) {
			Be(this, t, e);
		}
	});
}
function We(e, t) {
	let n = Object.getPrototypeOf(e);
	return t in n ? void 0 : n;
}
var Ge, Ke = !1, qe = {
	configurable: !0,
	get() {
		Ke = !0;
	}
};
function C(e, t, n) {
	let r = Object.getPrototypeOf(e._zod);
	t in r && Ge !== e._zod ? Ge = void 0 : (Ge = e._zod, Object.defineProperty(r, t, {
		configurable: !0,
		get() {
			Object.defineProperty(this, t, qe);
			let e = Ke;
			Ke = !1;
			try {
				let r = n(this);
				return Ke ? delete this[t] : Object.defineProperty(this, t, {
					configurable: !0,
					writable: !0,
					value: r
				}), Ke ||= e, r;
			} catch (n) {
				throw delete this[t], Ke ||= e, n;
			}
		},
		set(e) {
			Object.defineProperty(this, t, {
				configurable: !0,
				writable: !0,
				value: e
			});
		}
	}));
}
function Je(e, t, n, r) {
	let i = We(e, t);
	i && Object.defineProperty(i, t, {
		configurable: !0,
		get() {
			let e = {
				configurable: !0,
				writable: !0,
				enumerable: r,
				value: void 0
			};
			return Object.defineProperty(this, t, e), e.value = n(this), Object.defineProperty(this, t, e), e.value;
		},
		set(e) {
			Object.defineProperty(this, t, {
				configurable: !0,
				writable: !0,
				enumerable: r,
				value: e
			});
		}
	});
}
var Ye = "~constantCatch";
function Xe(e) {
	let t = () => e;
	return t[Ye] = !0, t;
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/core.js
var Ze, Qe = {
	value: void 0,
	enumerable: !1
}, $e = "captureStackTrace" in Error ? Error : null;
function et(e) {
	let t = $e;
	if (t) {
		let n = t.stackTraceLimit;
		if (typeof n == "number") {
			try {
				t.stackTraceLimit = 0;
			} catch {
				return $e = null, new e();
			}
			try {
				return new e();
			} finally {
				t.stackTraceLimit = n;
			}
		}
	}
	return new e();
}
function w(e, t, n, r) {
	let i = {};
	function a(e) {
		this.def = e, this.constr = d, this.traits = /* @__PURE__ */ new Set();
	}
	a.prototype = i;
	let o = n, s = o && /* @__PURE__ */ new WeakSet();
	function c(n, r) {
		if (!n._zod) {
			Qe.value = new a(r);
			try {
				Object.defineProperty(n, "_zod", Qe);
			} finally {
				Qe.value = void 0;
			}
		} else if (n._zod.traits.has(e)) return;
		if (n._zod.traits.add(e), t(n, r), s) {
			let e = Object.getPrototypeOf(n), t = n._zod.constr.prototype, r = e;
			for (; r && r !== t;) r = Object.getPrototypeOf(r);
			let i = r ?? e;
			s.has(i) || (s.add(i), ze(i, o));
		}
		let i = d.prototype;
		for (let e in i) Object.prototype.hasOwnProperty.call(i, e) && (e in n || (n[e] = i[e].bind(n)));
	}
	let l = r?.Parent ?? Object;
	class u extends l {}
	Object.defineProperty(u, "name", { value: e });
	function d(e) {
		let t = r?.Parent ? et(u) : this;
		c(t, e);
		let n = t._zod.deferred;
		if (n) {
			for (let e of n) e();
			t._zod.deferred = void 0;
		}
		let i = globalThis.__zod_globalConfig?.postProcessor;
		return i && i(t), t;
	}
	return Object.defineProperty(d, "init", { value: c }), Object.defineProperty(d, Symbol.hasInstance, { value: (t) => r?.Parent && t instanceof r.Parent ? !0 : t?._zod?.traits?.has(e) }), Object.defineProperty(d, "name", { value: e }), d;
}
var tt = class extends Error {
	constructor() {
		super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
	}
}, nt = class extends Error {
	constructor(e) {
		super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError";
	}
};
(Ze = globalThis).__zod_globalConfig ?? (Ze.__zod_globalConfig = {});
var rt = globalThis.__zod_globalConfig;
function it(e) {
	return e && Object.assign(rt, e), rt;
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/errors.js
function at() {
	let e = this._zod;
	return e.message ??= JSON.stringify(e.def, p, 2), e.message;
}
function ot(e) {
	this._zod.message = e;
}
var st = {
	get: at,
	set: ot,
	enumerable: !0,
	configurable: !0
}, ct = {
	value: void 0,
	enumerable: !1
}, lt = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]), ut = (e, t) => {
	e.name = "$ZodError", ct.value = t, Object.defineProperty(e, "issues", ct), ct.value = void 0, Object.defineProperty(e, "message", st);
	let n = Object.getPrototypeOf(e);
	lt.has(n) || (lt.add(n), Object.defineProperty(n, "toString", {
		configurable: !0,
		enumerable: !1,
		get() {
			let e = () => this.message;
			return Object.defineProperty(this, "toString", {
				value: e,
				configurable: !0,
				writable: !0
			}), e;
		},
		set(e) {
			Object.defineProperty(this, "toString", {
				value: e,
				configurable: !0,
				writable: !0
			});
		}
	}));
}, dt = w("$ZodError", ut);
w("$ZodError", ut, void 0, { Parent: Error });
function ft(e, t, n) {
	return Object.prototype.hasOwnProperty.call(e, t) || (t === "__proto__" ? Object.defineProperty(e, t, {
		value: n(),
		writable: !0,
		enumerable: !0,
		configurable: !0
	}) : e[t] = n()), e[t];
}
function pt(e, t = (e) => e.message) {
	let n = {}, r = [];
	for (let i of e.issues) i.path.length > 0 ? ft(n, i.path[0], () => []).push(t(i)) : r.push(t(i));
	return {
		formErrors: r,
		fieldErrors: n
	};
}
function mt(e, t = (e) => e.message) {
	let n = { _errors: [] }, r = (e, i = []) => {
		for (let a of e.issues) if (a.code === "invalid_union" && a.errors.length) a.errors.map((e) => r({ issues: e }, [...i, ...a.path]));
		else if (a.code === "invalid_key") r({ issues: a.issues }, [...i, ...a.path]);
		else if (a.code === "invalid_element") r({ issues: a.issues }, [...i, ...a.path]);
		else {
			let e = [...i, ...a.path];
			if (e.length === 0) n._errors.push(t(a));
			else {
				let r = n, i = 0;
				for (; i < e.length;) {
					let n = e[i], o = i === e.length - 1;
					if (n === "_errors") {
						o && r._errors.push(t(a)), i++;
						continue;
					}
					Object.prototype.hasOwnProperty.call(r, n) || Object.defineProperty(r, n, {
						value: { _errors: [] },
						enumerable: !0,
						writable: !0,
						configurable: !0
					});
					let s = r[n];
					o && s._errors.push(t(a)), r = s, i++;
				}
			}
		}
	};
	return r(e), n;
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/parse.js
function ht(e, t) {
	return {
		callee: t?.callee ?? e,
		Err: t?.Err
	};
}
var gt = (e) => {
	let t = (n, r, i, a) => {
		let o = i ? {
			...i,
			async: !1
		} : { async: !1 }, s = n._zod.run({
			value: r,
			issues: []
		}, o);
		if (s instanceof Promise) throw new tt();
		if (s.issues.length) {
			let n = new ((a?.Err) ?? e)(s.issues.map((e) => Ne(e, o, it())));
			throw ce(n, a?.callee ?? t), n;
		}
		return s.value;
	};
	return t;
}, _t = (e) => {
	let t = async (n, r, i, a) => {
		let o = i ? {
			...i,
			async: !0
		} : { async: !0 }, s = n._zod.run({
			value: r,
			issues: []
		}, o);
		if (s instanceof Promise && (s = await s), s.issues.length) {
			let n = new ((a?.Err) ?? e)(s.issues.map((e) => Ne(e, o, it())));
			throw ce(n, a?.callee ?? t), n;
		}
		return s.value;
	};
	return t;
}, vt = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		async: !1
	} : { async: !1 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	if (a instanceof Promise) throw new tt();
	return a.issues.length ? yt(e, a.issues, i) : {
		success: !0,
		data: a.value
	};
};
function yt(e, t, n) {
	let r;
	return {
		success: !1,
		get error() {
			return r || (r = new e(t.map((e) => Ne(e, n, it()))), t = void 0, n = void 0), r;
		},
		set error(e) {
			r = e, t = void 0, n = void 0;
		}
	};
}
var bt = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		async: !0
	} : { async: !0 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	return a instanceof Promise && (a = await a), a.issues.length ? yt(e, a.issues, i) : {
		success: !0,
		data: a.value
	};
}, xt = /* @__PURE__ */ Symbol.for("zod.compile.invalid"), St = /* @__PURE__ */ Symbol.for("zod.compile.fallback"), Ct = ((e, t, n) => {
	let r = e._zod.bag.validator;
	if (r !== void 0) {
		if (r(t) !== xt) return !0;
		if (r.definite === !0 && n === void 0) return !1;
	}
	return wt(e, t, n);
});
function wt(e, t, n) {
	let r = n ? {
		...n,
		async: !1,
		abortEarly: !0
	} : {
		async: !1,
		abortEarly: !0
	}, i = e._zod.bag.fallbackRun, a;
	if (i ? (r[St] = !0, a = i({
		value: t,
		issues: []
	}, r)) : a = e._zod.run({
		value: t,
		issues: []
	}, r), a instanceof Promise) throw new tt();
	return a.issues.length === 0;
}
var Tt = async (e, t, n) => {
	let r = n ? {
		...n,
		async: !0,
		abortEarly: !0
	} : {
		async: !0,
		abortEarly: !0
	}, i = e._zod.run({
		value: t,
		issues: []
	}, r);
	return i instanceof Promise && (i = await i), i.issues.length === 0;
}, Et = (e) => {
	let t = gt(e), n = (e, r, i, a) => {
		let o = i ? {
			...i,
			direction: "backward"
		} : { direction: "backward" };
		return t(e, r, o, ht(n, a));
	};
	return n;
}, Dt = (e) => {
	let t = gt(e), n = (e, r, i, a) => t(e, r, i, ht(n, a));
	return n;
}, Ot = (e) => {
	let t = _t(e), n = async (e, r, i, a) => {
		let o = i ? {
			...i,
			direction: "backward"
		} : { direction: "backward" };
		return await t(e, r, o, ht(n, a));
	};
	return n;
}, kt = (e) => {
	let t = _t(e), n = async (e, r, i, a) => await t(e, r, i, ht(n, a));
	return n;
}, At = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return vt(e)(t, n, i);
}, jt = (e) => (t, n, r) => vt(e)(t, n, r), Mt = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return bt(e)(t, n, i);
}, Nt = (e) => async (t, n, r) => bt(e)(t, n, r), Pt = /^[cC][0-9a-z]{6,}$/, Ft = /^[0-9a-z]+$/, It = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/, Lt = /^[0-9a-vA-V]{20}$/, Rt = /^[A-Za-z0-9]{27}$/, zt = /^[a-zA-Z0-9_-]{21}$/;
function Bt(e) {
	return RegExp(`^[a-zA-Z0-9_-]{${e}}$`);
}
var Vt = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, Ht = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, Ut = (e) => e ? RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, Wt = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, Gt = "^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$";
function Kt() {
	return new RegExp(Gt, "u");
}
var qt = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Jt = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, Yt = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, Xt = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Zt = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, Qt = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/, $t = /^https?$/, en = /^\+[1-9]\d{6,14}$/, tn = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))";
function nn(e) {
	return RegExp(`^${e}$`);
}
var rn = /*@__PURE__*/ nn(tn);
function an(e) {
	let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
	return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : e.seconds ? `${t}:[0-5]\\d(?:\\.\\d+)?` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function on(e) {
	return RegExp(`^${an(e)}$`);
}
function sn(e) {
	let t = ["Z"];
	e.offset && t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
	let n = `${an({
		precision: e.precision,
		seconds: !0
	})}(?:${t.join("|")})`, r = e.local ? `${n}|${an({ precision: e.precision })}` : n;
	return RegExp(`^${tn}T(?:${r})$`);
}
var cn = /^[\s\S]{0,}$/, ln = /^-?\d+$/, un = /^-?\d+(?:\.\d+)?$/, dn = /^(?:true|false)$/i, fn = /^[^A-Z]*$/, pn = /^[^a-z]*$/, mn = /*@__PURE__*/ w("$ZodCheck", (e, t) => {
	var n;
	e._zod ??= {}, e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), hn = (e) => {
	let t = e.value;
	return !g(t) && t.length !== void 0;
}, gn = {
	number: "number",
	bigint: "bigint",
	object: "date"
}, _n = /*@__PURE__*/ w("$ZodCheckLessThan", (e, t) => {
	mn.init(e, t);
	let n = gn[typeof t.value];
	e._zod.check = (r) => {
		(t.inclusive ? r.value <= t.value : r.value < t.value) || r.issues.push({
			origin: gn[typeof r.value] ?? n,
			code: "too_big",
			maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), vn = /*@__PURE__*/ w("$ZodCheckGreaterThan", (e, t) => {
	mn.init(e, t);
	let n = gn[typeof t.value];
	e._zod.check = (r) => {
		(t.inclusive ? r.value >= t.value : r.value > t.value) || r.issues.push({
			origin: gn[typeof r.value] ?? n,
			code: "too_small",
			minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), yn = /*@__PURE__*/ w("$ZodCheckMultipleOf", (e, t) => {
	mn.init(e, t), e._zod.check = (n) => {
		if (typeof n.value != typeof t.value) throw Error("Cannot mix number and bigint in multiple_of check.");
		(typeof n.value == "bigint" ? t.value !== BigInt(0) && n.value % t.value === BigInt(0) : v(n.value, t.value) === 0) || n.issues.push({
			origin: typeof n.value,
			code: "not_multiple_of",
			divisor: t.value,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), bn = /*@__PURE__*/ w("$ZodCheckNumberFormat", (e, t) => {
	mn.init(e, t), t.format = t.format || "float64";
	let n = t.format?.includes("int"), r = n ? "int" : "number", [i, a] = ve[t.format];
	e._zod.check = (o) => {
		let s = o.value;
		if (n) {
			if (!Number.isInteger(s)) {
				o.issues.push({
					expected: r,
					format: t.format,
					code: "invalid_type",
					continue: !1,
					input: s,
					inst: e
				});
				return;
			}
			if (!Number.isSafeInteger(s)) {
				s > 0 ? o.issues.push({
					input: s,
					code: "too_big",
					maximum: 2 ** 53 - 1,
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				}) : o.issues.push({
					input: s,
					code: "too_small",
					minimum: -(2 ** 53 - 1),
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				});
				return;
			}
		}
		s < i && o.issues.push({
			origin: "number",
			input: s,
			code: "too_small",
			minimum: i,
			inclusive: !0,
			inst: e,
			continue: !t.abort
		}), s > a && o.issues.push({
			origin: "number",
			input: s,
			code: "too_big",
			maximum: a,
			inclusive: !0,
			inst: e,
			continue: !t.abort
		});
	};
}), xn = /*@__PURE__*/ w("$ZodCheckMaxLength", (e, t) => {
	var n;
	mn.init(e, t), (n = e._zod.def).when ?? (n.when = hn), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if ((typeof r == "string" && i > t.maximum ? Fe(r) : i) <= t.maximum) return;
		let a = Ie(r);
		n.issues.push({
			origin: a,
			code: "too_big",
			maximum: t.maximum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), Sn = /*@__PURE__*/ w("$ZodCheckMinLength", (e, t) => {
	var n;
	mn.init(e, t), (n = e._zod.def).when ?? (n.when = hn), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if ((typeof r == "string" && i >= t.minimum && i < t.minimum * 2 ? Fe(r) : i) >= t.minimum) return;
		let a = Ie(r);
		n.issues.push({
			origin: a,
			code: "too_small",
			minimum: t.minimum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), Cn = /*@__PURE__*/ w("$ZodCheckLengthEquals", (e, t) => {
	var n;
	mn.init(e, t), (n = e._zod.def).when ?? (n.when = hn), e._zod.check = (n) => {
		let r = n.value, i = r.length, a = typeof r == "string" && i >= t.length && i <= t.length * 2 ? Fe(r) : i;
		if (a === t.length) return;
		let o = Ie(r), s = a > t.length;
		n.issues.push({
			origin: o,
			...s ? {
				code: "too_big",
				maximum: t.length
			} : {
				code: "too_small",
				minimum: t.length
			},
			inclusive: !0,
			exact: !0,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), wn = /*@__PURE__*/ w("$ZodCheckStringFormat", (e, t) => {
	var n, r;
	mn.init(e, t), t.pattern ? (n = e._zod).check ?? (n.check = (n) => {
		t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: t.format,
			input: n.value,
			...t.pattern ? { pattern: t.pattern.toString() } : {},
			inst: e,
			continue: !t.abort
		});
	}) : (r = e._zod).check ?? (r.check = () => {});
}), Tn = /*@__PURE__*/ w("$ZodCheckRegex", (e, t) => {
	wn.init(e, t), e._zod.check = (n) => {
		t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: n.value,
			pattern: t.pattern.toString(),
			inst: e,
			continue: !t.abort
		});
	};
}), En = /*@__PURE__*/ w("$ZodCheckLowerCase", (e, t) => {
	t.pattern ??= fn, wn.init(e, t);
}), Dn = /*@__PURE__*/ w("$ZodCheckUpperCase", (e, t) => {
	t.pattern ??= pn, wn.init(e, t);
}), On = /*@__PURE__*/ w("$ZodCheckIncludes", (e, t) => {
	mn.init(e, t);
	let n = me(t.includes);
	t.pattern = new RegExp(typeof t.position == "number" ? `^.{${t.position},}${n}` : n), e._zod.check = (n) => {
		n.value.includes(t.includes, t.position) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: t.includes,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), kn = /*@__PURE__*/ w("$ZodCheckStartsWith", (e, t) => {
	mn.init(e, t);
	let n = RegExp(`^${me(t.prefix)}.*`);
	t.pattern ??= n, e._zod.check = (n) => {
		n.value.startsWith(t.prefix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: t.prefix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), An = /*@__PURE__*/ w("$ZodCheckEndsWith", (e, t) => {
	mn.init(e, t);
	let n = RegExp(`.*${me(t.suffix)}$`);
	t.pattern ??= n, e._zod.check = (n) => {
		n.value.endsWith(t.suffix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: t.suffix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), jn = /*@__PURE__*/ w("$ZodCheckOverwrite", (e, t) => {
	mn.init(e, t), e._zod.check = (e) => {
		e.value = t.tx(e.value);
	};
}), Mn = class {
	constructor(e = [], t = {}) {
		this.content = [], this.indent = 0, this.args = e, this.closed = t;
	}
	indented(e) {
		this.indent += 1;
		try {
			e(this);
		} finally {
			--this.indent;
		}
	}
	write(e) {
		if (typeof e == "function") {
			e(this, { execution: "sync" }), e(this, { execution: "async" });
			return;
		}
		let t = e.split("\n").filter((e) => e), n = Math.min(...t.map((e) => e.length - e.trimStart().length)), r = t.map((e) => e.slice(n)).map((e) => " ".repeat(this.indent * 2) + e);
		for (let e of r) this.content.push(e);
	}
	compile() {
		let e = Function, t = this?.content ?? [""];
		return new e(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {\n${t.join("\n")}\n};`)(...Object.values(this.closed));
	}
}, Nn = {
	major: 4,
	minor: 6,
	patch: 5
}, Pn = /*@__PURE__*/ w("$ZodType", (e, t) => {
	var n;
	e ??= {}, e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = Nn;
	let r = e._zod.def.checks, i = e._zod.traits.has("$ZodCheck") ? [e, ...r ?? []] : r?.length ? [...r] : [];
	for (let t of i) for (let n of t._zod.onattach) n(e);
	if (i.length === 0) (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
		e._zod.run = e._zod.parse;
	});
	else {
		let t = (t, n, r) => {
			if (t.memo) return t;
			let i = Oe(t), a;
			for (let o of n) {
				if (o._zod.def.when) {
					if (ke(t) || !o._zod.def.when(t)) continue;
				} else if (i) continue;
				let n = t.issues.length, s = o._zod.check(t);
				if (s instanceof Promise && r?.async === !1) throw new tt();
				if (a || s instanceof Promise) a = (a ?? Promise.resolve()).then(async () => {
					await s, t.issues.length !== n && (Me(t.issues, n, e), i ||= Oe(t, n));
				});
				else {
					if (t.issues.length === n) continue;
					Me(t.issues, n, e), i ||= Oe(t, n);
				}
			}
			return a ? a.then(() => t) : t;
		}, n = (n, r, a) => {
			if (Oe(n)) return n.aborted = !0, n;
			let o = t(r, i, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new tt();
				return o.then((t) => e._zod.parse(t, a));
			}
			return e._zod.parse(o, a);
		};
		e._zod.run = (r, a) => {
			if (a.skipChecks) return e._zod.parse(r, a);
			if (a.direction === "backward") {
				let t = e._zod.parse({
					value: r.value,
					issues: []
				}, {
					...a,
					skipChecks: !0
				});
				return t instanceof Promise ? t.then((e) => n(e, r, a)) : n(t, r, a);
			}
			let o = e._zod.parse(r, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new tt();
				return o.then((e) => t(e, i, a));
			}
			return t(o, i, a);
		};
	}
}, {
	get "~standard"() {
		return Ve(this, "~standard", Ln(this));
	},
	set "~standard"(e) {
		Be(this, "~standard", e);
	}
}), Fn = (e, t) => e.issues.length ? { issues: e.issues.map((e) => Ne(e, t, it())) } : { value: e.value };
async function In(e, t) {
	let n = { async: !0 };
	return Fn(await e._zod.run({
		value: t,
		issues: []
	}, n), n);
}
function Ln(e) {
	return {
		validate: (t) => {
			let n = { async: !1 };
			try {
				let r = e._zod.run({
					value: t,
					issues: []
				}, n);
				if (!(r instanceof Promise)) return Fn(r, n);
			} catch {}
			return In(e, t);
		},
		vendor: "zod",
		version: 1
	};
}
var Rn = /*@__PURE__*/ w("$ZodString", (e, t) => {
	Pn.init(e, t), e._zod.pattern = t.pattern ?? cn, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = String(n.value);
		} catch {}
		return typeof n.value == "string" || n.issues.push({
			expected: "string",
			code: "invalid_type",
			input: n.value,
			inst: e
		}), n;
	};
}), T = /*@__PURE__*/ w("$ZodStringFormat", (e, t) => {
	wn.init(e, t), Rn.init(e, t);
}), zn = /*@__PURE__*/ w("$ZodGUID", (e, t) => {
	t.pattern ??= Ht, T.init(e, t);
}), Bn = /*@__PURE__*/ w("$ZodUUID", (e, t) => {
	if (t.version) {
		let e = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[t.version];
		if (e === void 0) throw Error(`Invalid UUID version: "${t.version}"`);
		t.pattern ??= Ut(e);
	} else t.pattern ??= Ut();
	T.init(e, t);
}), Vn = /*@__PURE__*/ w("$ZodEmail", (e, t) => {
	t.pattern ??= Wt, T.init(e, t);
});
function Hn(e) {
	try {
		return typeof URL < "u" && typeof URL.canParse == "function" ? URL.canParse(e) : (new URL(e), !0);
	} catch {
		return !1;
	}
}
function Un(e, t) {
	return !("normalize" in t) && !("hostname" in t) && !("protocol" in t) ? Hn(e) || 2 : Wn(e, t);
}
function Wn(e, t) {
	if (!t.normalize && t.protocol?.source === $t.source && !/^https?:\/\//i.test(e)) return 1;
	try {
		if (typeof URL < "u") {
			let t = URL;
			if (typeof t.parse == "function") return t.parse(e) ?? 2;
		}
		return new URL(e);
	} catch {
		return 2;
	}
}
var Gn = /[\t\n\r]/g;
function Kn(e) {
	return e.replace(Gn, "");
}
function qn(e, t) {
	return t.lastIndex = 0, t.test(e.hostname);
}
function Jn(e, t) {
	return t.lastIndex = 0, t.test(e.protocol.endsWith(":") ? e.protocol.slice(0, -1) : e.protocol);
}
var Yn = /*@__PURE__*/ w("$ZodURL", (e, t) => {
	T.init(e, t), e._zod.check = (n) => {
		try {
			let r = n.value.trim(), i = Un(r, t);
			if (i === 1) {
				n.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid URL format",
					input: n.value,
					inst: e,
					continue: !t.abort
				});
				return;
			}
			if (i === 2) {
				n.issues.push({
					code: "invalid_format",
					format: "url",
					input: n.value,
					inst: e,
					continue: !t.abort
				});
				return;
			}
			if (i === !0) {
				n.value = Kn(r);
				return;
			}
			t.hostname && !qn(i, t.hostname) && n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: t.hostname.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			}), t.protocol && !Jn(i, t.protocol) && n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: t.protocol.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			}), n.value = t.normalize ? i.href : Kn(r);
			return;
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "url",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
}), Xn = /*@__PURE__*/ w("$ZodEmoji", (e, t) => {
	t.pattern ??= Kt(), T.init(e, t);
}), Zn = /*@__PURE__*/ w("$ZodNanoID", (e, t) => {
	if (t.length !== void 0 && (!Number.isInteger(t.length) || t.length < 1)) throw Error(`Invalid nanoid length: ${t.length}`);
	t.pattern ??= t.length === void 0 ? zt : Bt(t.length), T.init(e, t);
}), Qn = /*@__PURE__*/ w("$ZodCUID", (e, t) => {
	t.pattern ??= Pt, T.init(e, t);
}), $n = /*@__PURE__*/ w("$ZodCUID2", (e, t) => {
	t.pattern ??= Ft, T.init(e, t);
}), er = /*@__PURE__*/ w("$ZodULID", (e, t) => {
	t.pattern ??= It, T.init(e, t);
}), tr = /*@__PURE__*/ w("$ZodXID", (e, t) => {
	t.pattern ??= Lt, T.init(e, t);
}), nr = /*@__PURE__*/ w("$ZodKSUID", (e, t) => {
	t.pattern ??= Rt, T.init(e, t);
}), rr = /*@__PURE__*/ w("$ZodISODateTime", (e, t) => {
	t.pattern ??= sn(t), T.init(e, t);
}), ir = /*@__PURE__*/ w("$ZodISODate", (e, t) => {
	t.pattern ??= rn, T.init(e, t);
}), ar = /*@__PURE__*/ w("$ZodISOTime", (e, t) => {
	t.pattern ??= on(t), T.init(e, t);
}), or = /*@__PURE__*/ w("$ZodISODuration", (e, t) => {
	t.pattern ??= Vt, T.init(e, t);
}), sr = /*@__PURE__*/ w("$ZodIPv4", (e, t) => {
	t.pattern ??= qt, T.init(e, t);
}), cr = /^[0-9a-fA-F:.]+$/;
function lr(e) {
	return cr.test(e) ? Hn(`http://[${e}]`) : !1;
}
var ur = /*@__PURE__*/ w("$ZodIPv6", (e, t) => {
	t.pattern ??= Jt, T.init(e, t), e._zod.check = (n) => {
		lr(n.value) || n.issues.push({
			code: "invalid_format",
			format: "ipv6",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), dr = /*@__PURE__*/ w("$ZodCIDRv4", (e, t) => {
	t.pattern ??= Yt, T.init(e, t);
});
function fr(e) {
	let t = e.split("/");
	if (t.length !== 2) return !1;
	let [n, r] = t;
	if (!r) return !1;
	let i = Number(r);
	return `${i}` !== r || i < 0 || i > 128 ? !1 : lr(n);
}
var pr = /*@__PURE__*/ w("$ZodCIDRv6", (e, t) => {
	t.pattern ??= Xt, T.init(e, t), e._zod.check = (n) => {
		fr(n.value) || n.issues.push({
			code: "invalid_format",
			format: "cidrv6",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
});
function mr(e) {
	if (e === "") return !0;
	if (/\s/.test(e) || e.length % 4 != 0) return !1;
	try {
		return atob(e), !0;
	} catch {
		return !1;
	}
}
var hr = /^[0-9a-zA-Z+/]*={0,2}$/, gr = /*@__PURE__*/ w("$ZodBase64", (e, t) => {
	t.pattern ??= hr, T.init(e, t), e._zod.check = (n) => {
		mr(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), _r = /^[A-Za-z0-9_-]*$/;
function vr(e) {
	if (!_r.test(e)) return !1;
	let t = e.replace(/[-_]/g, (e) => e === "-" ? "+" : "/");
	return mr(t.padEnd(Math.ceil(t.length / 4) * 4, "="));
}
var yr = /*@__PURE__*/ w("$ZodBase64URL", (e, t) => {
	t.pattern ??= _r, T.init(e, t), e._zod.check = (n) => {
		vr(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), br = /*@__PURE__*/ w("$ZodE164", (e, t) => {
	t.pattern ??= en, T.init(e, t);
});
function xr(e, t = null) {
	try {
		let n = e.split(".");
		if (n.length !== 3) return !1;
		let [r] = n;
		if (!r) return !1;
		let i = JSON.parse(atob(r));
		return !("typ" in i && i?.typ !== "JWT" || !i.alg || t && (!("alg" in i) || i.alg !== t));
	} catch {
		return !1;
	}
}
var Sr = /*@__PURE__*/ w("$ZodJWT", (e, t) => {
	T.init(e, t), e._zod.check = (n) => {
		xr(n.value, t.alg) || n.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Cr = /*@__PURE__*/ w("$ZodNumber", (e, t) => {
	Pn.init(e, t), e._zod.pattern = un, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = Number(n.value);
		} catch {}
		let i = n.value;
		if (typeof i == "number" && !Number.isNaN(i) && Number.isFinite(i)) return n;
		let a = typeof i == "number" ? Number.isNaN(i) ? "NaN" : Number.isFinite(i) ? void 0 : String(i) : void 0;
		return n.issues.push({
			expected: "number",
			code: "invalid_type",
			input: i,
			inst: e,
			...a ? { received: a } : {}
		}), n;
	};
}), wr = /*@__PURE__*/ w("$ZodNumberFormat", (e, t) => {
	bn.init(e, t), Cr.init(e, t);
}), Tr = /*@__PURE__*/ w("$ZodBoolean", (e, t) => {
	Pn.init(e, t), e._zod.pattern = dn, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = !!n.value;
		} catch {}
		let i = n.value;
		return typeof i == "boolean" || n.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input: i,
			inst: e
		}), n;
	};
}), Er = /*@__PURE__*/ w("$ZodUnknown", (e, t) => {
	Pn.init(e, t), e._zod.parse = (e) => e;
}), Dr = /*@__PURE__*/ w("$ZodNever", (e, t) => {
	Pn.init(e, t), e._zod.parse = (t, n) => (t.issues.push({
		expected: "never",
		code: "invalid_type",
		input: t.value,
		inst: e
	}), t);
});
function Or(e, t, n) {
	e.issues.length && t.issues.push(...Ae(n, e.issues)), t.value[n] = e.value;
}
var kr = /*@__PURE__*/ w("$ZodArray", (e, t) => {
	Pn.init(e, t);
	let n = rt.memoizer;
	n?.attach(e), e._zod.parse = (r, i) => {
		let a = r.value;
		if (!Array.isArray(a)) return r.issues.push({
			expected: "array",
			code: "invalid_type",
			input: a,
			inst: e
		}), r;
		r.value = n ? n.alloc(e, r, Array(a.length), i) : Array(a.length);
		let o = [], s = i?.abortEarly;
		for (let e = 0; e < a.length; e++) {
			let n = a[e], c = t.element._zod.run({
				value: n,
				issues: []
			}, i);
			if (c instanceof Promise) o.push(c.then((t) => Or(t, r, e)));
			else if (Or(c, r, e), s && c.issues.length !== 0 && Oe(c)) break;
		}
		return o.length ? Promise.all(o).then(() => r) : r;
	};
});
function Ar(e, t, n, r, i, a) {
	let o = n in r, s = a === "optional";
	if (o || !s || i !== "optional") {
		if (e.issues.length) {
			if (i !== void 0 && s && !o) return;
			t.issues.push(...Ae(n, e.issues));
		}
		!o && i === void 0 ? e.issues.length || t.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [n]
		}) : e.value === void 0 ? (o || i === "defaulted" && !s) && (t.value[n] = void 0) : t.value[n] = e.value;
	}
}
var jr = [];
function Mr(e) {
	let t = Object.keys(e.shape), n = Object.getOwnPropertySymbols(e.shape), r = n.length ? n : jr, i = r.length ? [...t, ...r] : t;
	for (let t of i) if (!e.shape?.[t]?._zod?.traits?.has("$ZodType")) throw Error(`Invalid element at key "${String(t)}": expected a Zod schema`);
	let a = _e(e.shape);
	return {
		...e,
		allKeys: i,
		symbolKeys: r,
		keySet: new Set(t),
		numKeys: t.length,
		optionalKeys: new Set(a)
	};
}
function Nr(e, t, n, r, i, a, o) {
	let s = [], c = i.keySet, l = i.catchall._zod, u = l.def.type, d = l.optin, f = l.optout, p = 0;
	for (let i in t) {
		if (o && n.issues.length !== p) {
			if (Oe(n, p)) break;
			p = n.issues.length;
		}
		if (c.has(i)) continue;
		if (i === "__proto__") {
			u === "never" && s.push(i);
			continue;
		}
		if (u === "never") {
			s.push(i);
			continue;
		}
		let a = l.run({
			value: t[i],
			issues: []
		}, r);
		a instanceof Promise ? e.push(a.then((e) => Ar(e, n, i, t, d, f))) : Ar(a, n, i, t, d, f);
	}
	return s.length && n.issues.push({
		code: "unrecognized_keys",
		keys: s,
		input: t,
		inst: a,
		continue: !0
	}), e.length ? Promise.all(e).then(() => n) : n;
}
var Pr = /*@__PURE__*/ w("$ZodObject", (e, t) => {
	Pn.init(e, t);
	let n = Object.getOwnPropertyDescriptor(t, "shape"), r = n?.get ? n.get.raw : t.shape ?? {};
	if (r) {
		let e = () => {
			let n = { ...r };
			return Object.defineProperty(t, "shape", { value: n }), e.raw = n, n;
		};
		e.raw = r, Object.defineProperty(t, "shape", { get: e });
	}
	let i = h(() => Mr(t));
	C(e, "propValues", (e) => {
		let t = e.def.shape, n = {};
		for (let e in t) {
			let r = t[e]._zod;
			if (r.values) {
				Object.prototype.hasOwnProperty.call(n, e) || y(n, e, /* @__PURE__ */ new Set());
				for (let t of r.values) n[e].add(t);
				r.optin !== void 0 && n[e].add(void 0);
			}
		}
		return n;
	});
	let a = le, o = t.catchall, s, c = rt.memoizer;
	c?.attach(e), e._zod.parse = (t, n) => {
		s ??= i.value;
		let r = t.value;
		if (!a(r)) return t.issues.push({
			expected: "object",
			code: "invalid_type",
			input: r,
			inst: e
		}), t;
		t.value = c ? c.alloc(e, t, {}, n) : {};
		let l = [], u = s.shape, d = n?.abortEarly, f = t.issues.length;
		for (let e of s.allKeys) {
			if (d && t.issues.length !== f) {
				if (Oe(t, f)) break;
				f = t.issues.length;
			}
			if (e === "__proto__") continue;
			let i = u[e], a = i._zod.optin, o = i._zod.optout, s = i._zod.run({
				value: r[e],
				issues: []
			}, n);
			s instanceof Promise ? l.push(s.then((n) => Ar(n, t, e, r, a, o))) : Ar(s, t, e, r, a, o);
		}
		return o ? Nr(l, r, t, n, i.value, e, d === !0) : l.length ? Promise.all(l).then(() => t) : t;
	};
}), Fr = /*@__PURE__*/ w("$ZodObjectJIT", (e, t) => {
	Pr.init(e, t);
	let n = e._zod.parse, r = h(() => Mr(t)), i = rt.memoizer, a = (t) => {
		let n = r.value, a = n.symbolKeys, o = new Mn(["payload", "ctx"], {
			shape: t,
			inst: e,
			memo: i,
			syms: a
		}), s = (e) => `shape[${e}]._zod.run({ value: input[${e}], issues: [] }, ctx)`, c = (e, t) => `
          let ${e}_ab = false;
          for (let i = 0; i < ${e}.issues.length; i++) {
            const iss = ${e}.issues[i];
            iss.path = iss.path ? [${t}, ...iss.path] : [${t}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${e}_ab = true;
          }
          if (${e}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
		o.write("const input = payload.value;");
		let l = Object.create(null), u = 0;
		for (let e of n.allKeys) l[e] = `key_${u++}`;
		o.write(i ? "const newResult = memo.alloc(inst, payload, {}, ctx);" : "const newResult = {};");
		for (let e of n.allKeys) {
			if (e === "__proto__") continue;
			let n = l[e], r = typeof e == "symbol" ? `syms[${a.indexOf(e)}]` : oe(e), i = `${r} in input`, u = t[e], d = u?._zod?.optin, f = d !== void 0, p = u?._zod?.optout === "optional";
			if (o.write(`const ${n} = ${s(r)};`), f && p) {
				let e = d === "optional" ? `${n}_present` : `${n}.value !== undefined || ${n}_present`;
				o.write(`
        const ${n}_present = ${i};
        if (!${n}.issues.length || ${n}_present) {
          if (${n}.issues.length) {${c(n, r)}
          }

          if (${e}) {
            newResult[${r}] = ${n}.value;
          }
        }

      `);
			} else f ? (o.write(`
        if (${n}.issues.length) {${c(n, r)}
        }
      `), d === "defaulted" ? o.write(`newResult[${r}] = ${n}.value;`) : o.write(`
        if (${n}.value !== undefined || ${i}) {
          newResult[${r}] = ${n}.value;
        }
      `)) : o.write(`
        const ${n}_present = ${i};
        if (${n}.issues.length) {${c(n, r)}
        }
        if (!${n}_present && !${n}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${r}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${n}_present) {
          newResult[${r}] = ${n}.value;
        }

      `);
		}
		return o.write("payload.value = newResult;"), o.write("return payload;"), o.compile();
	}, o, s = le, c = !rt.jitless, l = c && ue.value, u = t.catchall, d;
	e._zod.parse = (i, f) => {
		d ??= r.value;
		let p = i.value;
		return s(p) ? c && l && f?.async === !1 && f.jitless !== !0 ? (o ||= a(t.shape), i = o(i, f), u ? Nr([], p, i, f, d, e, f?.abortEarly === !0) : i) : n(i, f) : (i.issues.push({
			expected: "object",
			code: "invalid_type",
			input: p,
			inst: e
		}), i);
	};
});
function Ir(e, t, n, r) {
	for (let n of e) if (n.issues.length === 0) return t.value = n.value, t;
	let i = e.filter((e) => !Oe(e));
	return i.length === 1 ? (t.value = i[0].value, i[0]) : (t.issues.push({
		code: "invalid_union",
		input: t.value,
		inst: n,
		errors: e.map((e) => e.issues.map((e) => Ne(e, r, it())))
	}), t);
}
var Lr = /*@__PURE__*/ w("$ZodUnion", (e, t) => {
	Pn.init(e, t), C(e, "optin", (e) => e.def.options.some((e) => e._zod.optin === "defaulted") ? "defaulted" : e.def.options.some((e) => e._zod.optin !== void 0) ? "optional" : void 0), C(e, "optout", (e) => e.def.options.some((e) => e._zod.optout === "optional") ? "optional" : void 0), C(e, "values", (e) => {
		if (e.def.options.every((e) => e._zod.values)) return new Set(e.def.options.flatMap((e) => Array.from(e._zod.values)));
	}), C(e, "pattern", (e) => {
		if (e.def.options.every((e) => e._zod.pattern)) {
			let t = e.def.options.map((e) => e._zod.pattern);
			return RegExp(`^(${t.map((e) => _(e.source)).join("|")})$`);
		}
	});
	let n = t.options.length === 1 ? t.options[0]._zod.run : null;
	e._zod.parse = (r, i) => {
		if (n) return n(r, i);
		let a = !1, o = [];
		for (let e of t.options) {
			let t = e._zod.run({
				value: r.value,
				issues: []
			}, i);
			if (t instanceof Promise) o.push(t), a = !0;
			else {
				if (t.issues.length === 0) return t;
				o.push(t);
			}
		}
		return a ? Promise.all(o).then((t) => Ir(t, r, e, i)) : Ir(o, r, e, i);
	};
});
function Rr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.options) {
		let r = n._zod.propValues?.[e.discriminator];
		if (!r || r.size === 0) throw Error(`Invalid discriminated union option at index "${e.options.indexOf(n)}"`);
		for (let e of r) if (t.has(e)) {
			if (e !== void 0) throw Error(`Duplicate discriminator value "${String(e)}"`);
			t.set(e, null);
		} else t.set(e, n);
	}
	return t;
}
var zr = /*@__PURE__*/ w("$ZodDiscriminatedUnion", (e, t) => {
	t.inclusive = !1, Lr.init(e, t);
	let n = e._zod.parse;
	C(e, "propValues", (e) => {
		let t = {}, n = 0;
		for (let r of e.def.options) {
			let i = r._zod.propValues;
			if (!i || Object.keys(i).length === 0) throw Error(`Invalid discriminated union option at index "${e.def.options.indexOf(r)}"`);
			i[e.def.discriminator]?.has(void 0) && n++;
			for (let [e, n] of Object.entries(i)) {
				Object.prototype.hasOwnProperty.call(t, e) || y(t, e, /* @__PURE__ */ new Set());
				for (let r of n) t[e].add(r);
			}
		}
		return !e.def.unionFallback && n > 1 && t[e.def.discriminator]?.delete(void 0), t;
	}), t.options.forEach((e, n) => {
		let r = ee(e._zod.def);
		if (r && !Object.prototype.hasOwnProperty.call(r, t.discriminator)) throw Error(`Invalid discriminated union option at index "${n}"`);
	});
	let r = h(() => Rr(t));
	e._zod.parse = (i, a) => {
		let o = i.value;
		if (!le(o)) return i.issues.push({
			code: "invalid_type",
			expected: "object",
			input: o,
			inst: e
		}), i;
		let s = o?.[t.discriminator], c = r.value.get(s);
		return c && (s !== void 0 || a.direction !== "backward") ? c._zod.run(i, a) : t.unionFallback || a.direction === "backward" ? n(i, a) : (i.issues.push({
			code: "invalid_union",
			errors: [],
			note: "No matching discriminator",
			discriminator: t.discriminator,
			options: Array.from(r.value.keys()).filter((e) => r.value.get(e) !== null),
			input: o,
			path: [t.discriminator],
			inst: e
		}), i);
	};
}), Br = /*@__PURE__*/ w("$ZodIntersection", (e, t) => {
	Pn.init(e, t), e._zod.parse = (e, n) => {
		let r = e.value, i = t.left._zod.run({
			value: r,
			issues: []
		}, n), a = t.right._zod.run({
			value: r,
			issues: []
		}, n);
		return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([t, n]) => Hr(e, t, n)) : Hr(e, i, a);
	};
});
function Vr(e, t) {
	if (e === t || e instanceof Date && t instanceof Date && +e == +t) return {
		valid: !0,
		data: e
	};
	if (de(e) && de(t)) {
		let n = Object.keys(t), r = Object.keys(e).filter((e) => n.indexOf(e) !== -1), i = {
			...e,
			...t
		};
		Object.prototype.hasOwnProperty.call(i, "__proto__") && delete i.__proto__;
		for (let n of r) {
			if (n === "__proto__") continue;
			let r = Vr(e[n], t[n]);
			if (!r.valid) return {
				valid: !1,
				mergeErrorPath: [n, ...r.mergeErrorPath]
			};
			i[n] = r.data;
		}
		return {
			valid: !0,
			data: i
		};
	}
	if (Array.isArray(e) && Array.isArray(t)) {
		if (e.length !== t.length) return {
			valid: !1,
			mergeErrorPath: []
		};
		let n = [];
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = t[r], o = Vr(i, a);
			if (!o.valid) return {
				valid: !1,
				mergeErrorPath: [r, ...o.mergeErrorPath]
			};
			n.push(o.data);
		}
		return {
			valid: !0,
			data: n
		};
	}
	return {
		valid: !1,
		mergeErrorPath: []
	};
}
function Hr(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i, a = /* @__PURE__ */ new Map(), o = (e, t) => {
		let n;
		if (e.code === "unrecognized_keys" && !e.path?.length) i ??= e, n = e.keys;
		else if (e.code === "invalid_key" && e.origin === "record" && e.path?.length === 1) {
			let t = String(e.path[0]);
			a.has(t) || a.set(t, e), n = [t];
		} else return !1;
		for (let e of n) r.has(e) || r.set(e, {}), r.get(e)[t] = !0;
		return !0;
	};
	for (let n of t.issues) o(n, "l") || e.issues.push(n);
	for (let t of n.issues) o(t, "r") || e.issues.push(t);
	let s = [...r].filter(([, e]) => e.l && e.r).map(([e]) => e);
	if (s.length) {
		let t = i ? s.filter((e) => i.keys.includes(e)) : [];
		t.length && e.issues.push({
			...i,
			keys: t
		});
		for (let n of s) !t.includes(n) && a.has(n) && e.issues.push(a.get(n));
	}
	let c = Vr(t.value, n.value);
	if (!c.valid) {
		if (Oe(e)) return e;
		throw Error(`Unmergable intersection. Error path: ${JSON.stringify(c.mergeErrorPath)}`);
	}
	return e.value = c.data, e;
}
var Ur = /*@__PURE__*/ w("$ZodRecord", (e, t) => {
	Pn.init(e, t);
	let n = rt.memoizer;
	n?.attach(e), e._zod.parse = (r, i) => {
		let a = r.value;
		if (!de(a)) return r.issues.push({
			expected: "record",
			code: "invalid_type",
			input: a,
			inst: e
		}), r;
		let o = [], s = t.keyType._zod.values;
		if (s && !t.partial) {
			r.value = n ? n.alloc(e, r, {}, i) : {};
			let c = /* @__PURE__ */ new Set();
			for (let n of s) if (typeof n == "string" || typeof n == "number" || typeof n == "symbol") {
				if (c.add(typeof n == "number" ? n.toString() : n), n === "__proto__") continue;
				let s = t.keyType._zod.run({
					value: n,
					issues: []
				}, i);
				if (s instanceof Promise) throw Error("Async schemas not supported in object keys currently");
				if (s.issues.length) {
					r.issues.push({
						code: "invalid_key",
						origin: "record",
						issues: s.issues.map((e) => Ne(e, i, it())),
						input: n,
						path: [n],
						inst: e
					});
					continue;
				}
				let l = s.value;
				if (l === "__proto__") continue;
				let u = t.valueType._zod.run({
					value: a[n],
					issues: []
				}, i);
				u instanceof Promise ? o.push(u.then((e) => {
					e.issues.length && r.issues.push(...Ae(n, e.issues)), r.value[l] = e.value;
				})) : (u.issues.length && r.issues.push(...Ae(n, u.issues)), r.value[l] = u.value);
			}
			let l;
			for (let e in a) if (!c.has(e)) {
				if (t.mode === "loose") {
					if (e === "__proto__") continue;
					r.value[e] = a[e];
				} else l ??= [], l.push(e);
			}
			l && l.length > 0 && r.issues.push({
				code: "unrecognized_keys",
				input: a,
				inst: e,
				keys: l,
				continue: !0
			});
		} else {
			r.value = n ? n.alloc(e, r, {}, i) : {};
			let c;
			for (let n of Reflect.ownKeys(a)) {
				if (n === "__proto__" || !Object.prototype.propertyIsEnumerable.call(a, n)) continue;
				let l = t.keyType._zod.run({
					value: n,
					issues: []
				}, i);
				if (l instanceof Promise) throw Error("Async schemas not supported in object keys currently");
				if (typeof n == "string" && un.test(n) && l.issues.length) {
					let e = t.keyType._zod.run({
						value: Number(n),
						issues: []
					}, i);
					if (e instanceof Promise) throw Error("Async schemas not supported in object keys currently");
					e.issues.length === 0 && (l = e);
				}
				if (l.issues.length) {
					t.mode === "loose" ? r.value[n] = a[n] : s ? (c ??= [], c.push(n)) : r.issues.push({
						code: "invalid_key",
						origin: "record",
						issues: l.issues.map((e) => Ne(e, i, it())),
						input: n,
						path: [n],
						inst: e
					});
					continue;
				}
				let u = l.value;
				if (u === "__proto__") continue;
				let d = t.valueType._zod.run({
					value: a[n],
					issues: []
				}, i);
				d instanceof Promise ? o.push(d.then((e) => {
					e.issues.length && r.issues.push(...Ae(n, e.issues)), r.value[u] = e.value;
				})) : (d.issues.length && r.issues.push(...Ae(n, d.issues)), r.value[u] = d.value);
			}
			c && c.length > 0 && r.issues.push({
				code: "unrecognized_keys",
				input: a,
				inst: e,
				keys: c,
				continue: !0
			});
		}
		return o.length ? Promise.all(o).then(() => r) : r;
	};
}), Wr = /*@__PURE__*/ w("$ZodEnum", (e, t) => {
	Pn.init(e, t);
	let n = d(t.entries), r = new Set(n);
	e._zod.values = r, C(e, "pattern", (e) => {
		let t = d(e.def.entries).filter((e) => pe.has(typeof e));
		return RegExp(t.length ? `^(${t.map((e) => me(e.toString())).join("|")})$` : "^[^\\s\\S]$");
	}), e._zod.parse = (t, i) => {
		let a = t.value;
		return r.has(a) || t.issues.push({
			code: "invalid_value",
			values: n,
			input: a,
			inst: e
		}), t;
	};
}), Gr = /*@__PURE__*/ w("$ZodLiteral", (e, t) => {
	Pn.init(e, t);
	let n = new Set(t.values);
	e._zod.values = n, C(e, "pattern", (e) => {
		let t = e.def.values;
		return RegExp(t.length ? `^(${t.map((e) => typeof e == "string" ? me(e) : e ? me(e.toString()) : String(e)).join("|")})$` : "^[^\\s\\S]$");
	}), e._zod.parse = (r, i) => {
		let a = r.value;
		return n.has(a) || r.issues.push({
			code: "invalid_value",
			values: t.values,
			input: a,
			inst: e
		}), r;
	};
}), Kr = /*@__PURE__*/ w("$ZodTransform", (e, t) => {
	Pn.init(e, t), e._zod.optin = "optional", rt.memoizer?.guard(e), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new nt(e.constructor.name);
		let i = t.transform(n.value, n);
		if (r.async) return (i instanceof Promise ? i : Promise.resolve(i)).then((e) => (n.value = e, n));
		if (i instanceof Promise) throw new tt();
		return n.value = i, n;
	};
});
function qr(e, t) {
	return e.value = t.issues.length ? void 0 : t.value, e;
}
var Jr = /*@__PURE__*/ w("$ZodOptional", (e, t) => {
	Pn.init(e, t), C(e, "optin", (e) => e.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), e._zod.optout = "optional", C(e, "values", (e) => {
		let t = e.def.innerType._zod.values;
		return t ? /* @__PURE__ */ new Set([...t, void 0]) : void 0;
	}), C(e, "pattern", (e) => {
		let t = e.def.innerType._zod.pattern;
		return t ? RegExp(`^(${_(t.source)})?$`) : void 0;
	}), e._zod.parse = (e, n) => {
		if (e.value === void 0) {
			if (t.innerType._zod.optin !== "defaulted") return e;
			let r = t.innerType._zod.run({
				value: e.value,
				issues: []
			}, n);
			return r instanceof Promise ? r.then((t) => qr(e, t)) : qr(e, r);
		}
		return t.innerType._zod.run(e, n);
	};
}), Yr = /*@__PURE__*/ w("$ZodExactOptional", (e, t) => {
	Jr.init(e, t), C(e, "values", (e) => e.def.innerType._zod.values), C(e, "pattern", (e) => e.def.innerType._zod.pattern), e._zod.parse = (e, n) => t.innerType._zod.run(e, n);
}), Xr = /*@__PURE__*/ w("$ZodNullable", (e, t) => {
	Pn.init(e, t), C(e, "optin", (e) => e.def.innerType._zod.optin), C(e, "optout", (e) => e.def.innerType._zod.optout), C(e, "pattern", (e) => {
		let t = e.def.innerType._zod.pattern;
		return t ? RegExp(`^(${_(t.source)}|null)$`) : void 0;
	}), C(e, "values", (e) => e.def.innerType._zod.values ? /* @__PURE__ */ new Set([...e.def.innerType._zod.values, null]) : void 0), e._zod.parse = (e, n) => e.value === null ? e : t.innerType._zod.run(e, n);
}), Zr = /*@__PURE__*/ w("$ZodDefault", (e, t) => {
	Pn.init(e, t), e._zod.optin = "defaulted", C(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		if (e.value === void 0) return e.value = t.defaultValue, e;
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => Qr(e, t)) : Qr(r, t);
	};
});
function Qr(e, t) {
	return e.value === void 0 && (e.value = t.defaultValue), e;
}
var $r = /*@__PURE__*/ w("$ZodPrefault", (e, t) => {
	Pn.init(e, t), e._zod.optin = "defaulted", C(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => (n.direction === "backward" || e.value === void 0 && (e.value = t.defaultValue), t.innerType._zod.run(e, n));
}), ei = /*@__PURE__*/ w("$ZodNonOptional", (e, t) => {
	Pn.init(e, t), C(e, "values", (e) => {
		let t = e.def.innerType._zod.values;
		return t ? new Set([...t].filter((e) => e !== void 0)) : void 0;
	}), e._zod.parse = (n, r) => {
		let i = t.innerType._zod.run(n, r);
		return i instanceof Promise ? i.then((t) => ti(t, e)) : ti(i, e);
	};
});
function ti(e, t) {
	return !e.issues.length && e.value === void 0 && e.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: e.value,
		inst: t
	}), e;
}
function ni(e, t, n, r) {
	return t.issues.length ? (e.value = n.catchValue({
		...t,
		value: e.value,
		error: { issues: t.issues.map((e) => Ne(e, r, it())) },
		input: e.value
	}), e) : (e.value = t.value, t.memo && (e.memo = !0), e);
}
var ri = /*@__PURE__*/ w("$ZodCatch", (e, t) => {
	Pn.init(e, t), C(e, "optin", (e) => e.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), C(e, "optout", (e) => e.def.innerType._zod.optout), C(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run({
			value: e.value,
			issues: []
		}, n);
		return r instanceof Promise ? r.then((r) => ni(e, r, t, n)) : ni(e, r, t, n);
	};
}), ii = /*@__PURE__*/ w("$ZodPipe", (e, t) => {
	Pn.init(e, t), C(e, "values", (e) => e.def.in._zod.values), C(e, "optin", (e) => e.def.in._zod.optin), C(e, "optout", (e) => e.def.out._zod.optout), C(e, "propValues", (e) => e.def.in._zod.propValues), e._zod.parse = (e, n) => {
		if (n.direction === "backward") {
			let r = t.out._zod.run(e, n);
			return r instanceof Promise ? r.then((e) => ai(e, t.in, n)) : ai(r, t.in, n);
		}
		let r = t.in._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => ai(e, t.out, n)) : ai(r, t.out, n);
	};
});
function ai(e, t, n) {
	return e.issues.some((e) => e.code !== "unrecognized_keys") ? (e.aborted = !0, e) : t._zod.run({
		value: e.value,
		issues: e.issues
	}, n);
}
var oi = /*@__PURE__*/ w("$ZodReadonly", (e, t) => {
	Pn.init(e, t), C(e, "propValues", (e) => e.def.innerType._zod.propValues), C(e, "values", (e) => e.def.innerType._zod.values), C(e, "optin", (e) => e.def.innerType?._zod?.optin), C(e, "optout", (e) => e.def.innerType?._zod?.optout), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then(si) : si(r);
	};
});
function si(e) {
	return e.memo || (e.value = Object.freeze(e.value)), e;
}
var ci = /*@__PURE__*/ w("$ZodCustom", (e, t) => {
	mn.init(e, t), Pn.init(e, t), e._zod.parse = (e, t) => e, e._zod.check = (n) => {
		let r = n.value, i = t.fn(r);
		if (i instanceof Promise) return i.then((t) => li(t, n, r, e));
		li(i, n, r, e);
	};
});
function li(e, t, n, r) {
	if (!e) {
		let e = {
			code: "custom",
			input: n,
			inst: r,
			path: [...r._zod.def.path ?? []],
			continue: !r._zod.def.abort
		};
		r._zod.def.params && (e.params = r._zod.def.params), t.issues.push(Re(e));
	}
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/memoizer.js
var ui = class extends Error {
	constructor() {
		super("Cannot parse a reference cycle that closes through a transform"), this.name = "ZodCyclicError";
	}
}, di = "~memo", fi = [];
function pi(e) {
	return typeof e == "object" && !!e;
}
function mi(e) {
	return e.map((e) => e.path ? {
		...e,
		path: e.path.slice()
	} : { ...e });
}
var hi = /*@__PURE__*/ new WeakMap(), gi = 0, _i = 1, vi = 2;
function yi(e, t, n) {
	let r = hi.get(e);
	if (r !== void 0) return r ? vi : gi;
	if (t.has(e)) return vi;
	t.add(e);
	let i = gi, a = (e) => {
		if (i !== vi && e?._zod) {
			let r = yi(e, t, n);
			r > i && (i = r);
		}
	}, o = (e, r) => {
		let i = gi;
		for (let a of Reflect.ownKeys(e)) {
			let o = Object.getOwnPropertyDescriptor(e, a);
			if (r && !o.enumerable) continue;
			let s = o.get ? _i : o.value?._zod ? yi(o.value, t, n) : gi;
			s > i && (i = s);
		}
		return i;
	}, s = (e) => {
		e > i && (i = e);
	}, c = e._zod.def;
	switch (c.type) {
		case "object": {
			let e = ee(c);
			s(e ? o(e, !0) : _i), a(c.catchall);
			break;
		}
		case "array":
			a(c.element);
			break;
		case "tuple":
			for (let e of c.items) a(e);
			a(c.rest);
			break;
		case "record":
		case "map":
			a(c.keyType), a(c.valueType);
			break;
		case "set":
			a(c.valueType);
			break;
		case "union":
			for (let e of c.options) a(e);
			break;
		case "intersection":
			a(c.left), a(c.right);
			break;
		case "optional":
		case "nullable":
		case "default":
		case "prefault":
		case "catch":
		case "readonly":
		case "nonoptional":
		case "promise":
		case "success":
			a(c.innerType);
			break;
		case "pipe":
			a(c.in), a(c.out);
			break;
		case "function":
			a(c.input), a(c.output);
			break;
		case "lazy": {
			let r = c._cachedInner ?? (n ? e._zod.innerType : void 0);
			s(r ? yi(r, t, !1) : _i);
			break;
		}
		case "template_literal":
		case "string":
		case "number":
		case "int":
		case "boolean":
		case "bigint":
		case "symbol":
		case "undefined":
		case "null":
		case "void":
		case "never":
		case "any":
		case "unknown":
		case "date":
		case "nan":
		case "enum":
		case "literal":
		case "file":
		case "transform":
		case "custom": break;
		default: for (let e in c) {
			let t = Object.getOwnPropertyDescriptor(c, e);
			if (!t || t.get) continue;
			let n = t.value;
			if (n && typeof n == "object") {
				if (n._zod) a(n);
				else if (Array.isArray(n)) for (let e of n) a(e);
			}
		}
	}
	return t.delete(e), bi(e, i);
}
function bi(e, t) {
	return t !== _i && hi.set(e, t === vi), t;
}
function xi(e, t) {
	let n = e.buckets.get(t);
	return n || (n = /* @__PURE__ */ new WeakMap(), e.buckets.set(t, n)), n;
}
var Si, Ci = [], wi = {
	alloc(e, t, n) {
		let r = Si;
		if (!r) return n;
		Si = void 0;
		let i = {
			value: n,
			issues: null
		};
		return r.set(t.value, i), Ci.push(i), n;
	},
	guard(e) {
		var t;
		(t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
			let t = e._zod.parse, n = (e, n) => {
				if (n.direction !== "backward" && Ei(n, e.value)) throw new ui();
				return t(e, n);
			};
			e._zod.parse = n, e._zod.run === t && (e._zod.run = n);
		});
	},
	attach(e) {
		var t;
		let n, r = !1, i, a;
		(t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
			let t = e._zod.parse, o = (s, c) => {
				if (n === void 0) {
					let i = yi(e, /* @__PURE__ */ new Set(), !1);
					if (i === gi) return e._zod.parse = t, e._zod.run === o && (e._zod.run = t), t(s, c);
					i === vi || r ? n = !0 : r = !0;
				}
				let l = s.value;
				if (!pi(l)) return t(s, c);
				let u = c[di];
				u || (u = {
					buckets: /* @__PURE__ */ new WeakMap(),
					backEdges: void 0
				}, c[di] = u);
				let d;
				i === c ? d = a : (d = xi(u, e), i = c, a = d);
				let f = d.get(l);
				if (f) return s.value = f.value, f.issues ? f.issues.length && s.issues.push(...mi(f.issues)) : (s.memo = !0, u.backEdges ?? (u.backEdges = /* @__PURE__ */ new WeakSet()), u.backEdges.add(f.value)), s;
				Si = d;
				let p = Ci.length, m = t(s, c);
				Si = void 0;
				let h = Ci.length > p ? Ci.pop() : void 0;
				return m instanceof Promise ? m.then((e) => (h && (h.issues = e.issues.length ? mi(e.issues) : fi), e)) : (h && (h.issues = m.issues.length ? mi(m.issues) : fi), m);
			};
			e._zod.parse = o, e._zod.run === t && (e._zod.run = o);
		});
	}
};
function Ti() {
	return wi;
}
function Ei(e, t) {
	let n = e[di]?.backEdges;
	return n !== void 0 && pi(t) && n.has(t);
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/en.js
var Di = () => {
	let e = {
		string: {
			unit: "characters",
			verb: "to have"
		},
		file: {
			unit: "bytes",
			verb: "to have"
		},
		array: {
			unit: "items",
			verb: "to have"
		},
		set: {
			unit: "items",
			verb: "to have"
		},
		map: {
			unit: "entries",
			verb: "to have"
		}
	};
	function t(t) {
		return e[t] ?? null;
	}
	let n = {
		regex: "input",
		email: "email address",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO datetime",
		date: "ISO date",
		time: "ISO time",
		duration: "ISO duration",
		ipv4: "IPv4 address",
		ipv6: "IPv6 address",
		mac: "MAC address",
		cidrv4: "IPv4 range",
		cidrv6: "IPv6 range",
		base64: "base64-encoded string",
		base64url: "base64url-encoded string",
		json_string: "JSON string",
		e164: "E.164 number",
		currency_code: "currency code",
		credit_card: "credit card number",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	}, r = { nan: "NaN" };
	function i(e, t) {
		return e === "number" && typeof t == "number" && !Number.isFinite(t) ? String(t) : r[e] ?? e;
	}
	return (e) => {
		switch (e.code) {
			case "invalid_type": return `Invalid input: expected ${i(e.expected)}, received ${i(Le(e.input), e.input)}`;
			case "invalid_value": return e.values.length === 1 ? `Invalid input: expected ${ge(e.values[0])}` : `Invalid option: expected one of ${f(e.values, "|")}`;
			case "too_big": {
				let n = e.exact ? "exactly " : e.inclusive ? "<=" : "<", r = t(e.origin);
				return r ? `Too big: expected ${e.origin ?? "value"} to have ${n}${e.maximum.toString()} ${r.unit ?? "elements"}` : `Too big: expected ${e.origin ?? "value"} to be ${n}${e.maximum.toString()}`;
			}
			case "too_small": {
				let n = e.exact ? "exactly " : e.inclusive ? ">=" : ">", r = t(e.origin);
				return r ? `Too small: expected ${e.origin} to have ${n}${e.minimum.toString()} ${r.unit}` : `Too small: expected ${e.origin} to be ${n}${e.minimum.toString()}`;
			}
			case "invalid_format": {
				let t = e;
				return t.format === "starts_with" ? `Invalid string: must start with "${t.prefix}"` : t.format === "ends_with" ? `Invalid string: must end with "${t.suffix}"` : t.format === "includes" ? `Invalid string: must include "${t.includes}"` : t.format === "regex" ? `Invalid string: must match pattern ${t.pattern}` : `Invalid ${n[t.format] ?? e.format}`;
			}
			case "not_multiple_of": return `Invalid number: must be a multiple of ${e.divisor}`;
			case "unrecognized_keys": return `Unrecognized key${e.keys.length > 1 ? "s" : ""}: ${f(e.keys, ", ")}`;
			case "invalid_key": return `Invalid key in ${e.origin}`;
			case "invalid_union": return e.options && Array.isArray(e.options) && e.options.length > 0 ? `Invalid discriminator value. Expected ${e.options.map((e) => `'${e}'`).join(" | ")}` : e.inclusive === !1 ? "Invalid input: more than one option matched" : "Invalid input";
			case "invalid_element": return `Invalid value in ${e.origin}`;
			default: return "Invalid input";
		}
	};
};
function Oi() {
	return { localeError: Di() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/registries.js
var ki, Ai = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
	}
	add(e, ...t) {
		let n = t[0];
		return this._map.set(e, n), n && typeof n == "object" && "id" in n && this._idmap.set(n.id, e), this;
	}
	clear() {
		return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
	}
	remove(e) {
		let t = this._map.get(e);
		return t && typeof t == "object" && "id" in t && this._idmap.delete(t.id), this._map.delete(e), this;
	}
	get(e) {
		let t = e._zod.parent;
		if (t) {
			let n = { ...this.get(t) ?? {} };
			delete n.id;
			let r = {
				...n,
				...this._map.get(e)
			};
			return Object.keys(r).length ? r : void 0;
		}
		return this._map.get(e);
	}
	has(e) {
		return this._map.has(e);
	}
};
function ji() {
	return new Ai();
}
(ki = globalThis).__zod_globalRegistry ?? (ki.__zod_globalRegistry = ji());
var Mi = globalThis.__zod_globalRegistry;
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/api.js
function Ni(e) {
	return e.checks &&= [...e.checks], e;
}
// @__NO_SIDE_EFFECTS__
function Pi(e, t) {
	return new e(Ni({
		type: "string",
		...x(t)
	}));
}
// @__NO_SIDE_EFFECTS__
function Fi(e, t) {
	return new e({
		type: "string",
		format: "email",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ii(e, t) {
	return new e({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Li(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ri(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v4",
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function zi(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v6",
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Bi(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v7",
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Vi(e, t) {
	return new e({
		type: "string",
		format: "url",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Hi(e, t) {
	return new e({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ui(e, t) {
	return new e({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Wi(e, t) {
	return new e({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Gi(e, t) {
	return new e({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ki(e, t) {
	return new e({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function qi(e, t) {
	return new e({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ji(e, t) {
	return new e({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Yi(e, t) {
	return new e({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Xi(e, t) {
	return new e({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Zi(e, t) {
	return new e({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Qi(e, t) {
	return new e({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function $i(e, t) {
	return new e({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ea(e, t) {
	return new e({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ta(e, t) {
	return new e({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function na(e, t) {
	return new e({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ra(e, t) {
	return new e({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: !1,
		local: !1,
		precision: null,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ia(e, t) {
	return new e({
		type: "string",
		format: "date",
		check: "string_format",
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function aa(e, t) {
	return new e({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function oa(e, t) {
	return new e({
		type: "string",
		format: "duration",
		check: "string_format",
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function sa(e, t) {
	return new e(Ni({
		type: "number",
		checks: [],
		...x(t)
	}));
}
// @__NO_SIDE_EFFECTS__
function ca(e, t) {
	return new e({
		type: "number",
		check: "number_format",
		abort: !1,
		format: "safeint",
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function la(e, t) {
	return new e({
		type: "boolean",
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ua(e) {
	return new e({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function da(e, t) {
	return new e({
		type: "never",
		...x(t)
	});
}
// @__NO_SIDE_EFFECTS__
function fa(e, t) {
	return new _n({
		check: "less_than",
		...x(t),
		value: e,
		inclusive: !1
	});
}
// @__NO_SIDE_EFFECTS__
function pa(e, t) {
	return new _n({
		check: "less_than",
		...x(t),
		value: e,
		inclusive: !0
	});
}
// @__NO_SIDE_EFFECTS__
function ma(e, t) {
	return new vn({
		check: "greater_than",
		...x(t),
		value: e,
		inclusive: !1
	});
}
// @__NO_SIDE_EFFECTS__
function ha(e, t) {
	return new vn({
		check: "greater_than",
		...x(t),
		value: e,
		inclusive: !0
	});
}
// @__NO_SIDE_EFFECTS__
function E(e, t) {
	return new yn({
		check: "multiple_of",
		...x(t),
		value: e
	});
}
// @__NO_SIDE_EFFECTS__
function ga(e, t) {
	return new xn({
		check: "max_length",
		...x(t),
		maximum: e
	});
}
// @__NO_SIDE_EFFECTS__
function _a(e, t) {
	return new Sn({
		check: "min_length",
		...x(t),
		minimum: e
	});
}
// @__NO_SIDE_EFFECTS__
function va(e, t) {
	return new Cn({
		check: "length_equals",
		...x(t),
		length: e
	});
}
// @__NO_SIDE_EFFECTS__
function ya(e, t) {
	return new Tn({
		check: "string_format",
		format: "regex",
		...x(t),
		pattern: e
	});
}
// @__NO_SIDE_EFFECTS__
function ba(e) {
	return new En({
		check: "string_format",
		format: "lowercase",
		...x(e)
	});
}
// @__NO_SIDE_EFFECTS__
function xa(e) {
	return new Dn({
		check: "string_format",
		format: "uppercase",
		...x(e)
	});
}
// @__NO_SIDE_EFFECTS__
function Sa(e, t) {
	return new On({
		check: "string_format",
		format: "includes",
		...x(t),
		includes: e
	});
}
// @__NO_SIDE_EFFECTS__
function Ca(e, t) {
	return new kn({
		check: "string_format",
		format: "starts_with",
		...x(t),
		prefix: e
	});
}
// @__NO_SIDE_EFFECTS__
function wa(e, t) {
	return new An({
		check: "string_format",
		format: "ends_with",
		...x(t),
		suffix: e
	});
}
// @__NO_SIDE_EFFECTS__
function Ta(e) {
	return new jn({
		check: "overwrite",
		tx: e
	});
}
// @__NO_SIDE_EFFECTS__
function Ea(e) {
	return /* @__PURE__ */ Ta((t) => t.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function Da() {
	return /* @__PURE__ */ Ta((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function Oa() {
	return /* @__PURE__ */ Ta((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function ka() {
	return /* @__PURE__ */ Ta((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function Aa() {
	return /* @__PURE__ */ Ta((e) => se(e));
}
// @__NO_SIDE_EFFECTS__
function ja(e, t, n) {
	return new e({
		type: "array",
		element: t,
		...x(n)
	});
}
// @__NO_SIDE_EFFECTS__
function Ma(e, t, n) {
	return new e({
		type: "custom",
		check: "custom",
		fn: t,
		...x(n)
	});
}
// @__NO_SIDE_EFFECTS__
function Na(e, t) {
	let n = /* @__PURE__ */ Pa((t) => (t.addIssue = (e) => {
		if (typeof e == "string") t.issues.push(Re(e, t.value, n._zod.def));
		else {
			let r = e;
			r.fatal && (r.continue = !1), r.code ??= "custom", "input" in r || (r.input = t.value), r.inst ??= n, r.continue ??= !n._zod.def.abort, t.issues.push(Re(r));
		}
	}, e(t.value, t)), t);
	return n;
}
// @__NO_SIDE_EFFECTS__
function Pa(e, t) {
	let n = new mn({
		check: "custom",
		...x(t)
	});
	return n._zod.check = e, n;
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/to-json-schema.js
function Fa(e, ...t) {
	for (let n of t) for (let t of Reflect.ownKeys(n)) Object.prototype.propertyIsEnumerable.call(n, t) && y(e, t, n[t]);
	return e;
}
function Ia(e) {
	let t = e?.target ?? "draft-2020-12";
	return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
		processors: e.processors ?? {},
		metadataRegistry: e?.metadata ?? Mi,
		target: t,
		unrepresentable: e?.unrepresentable ?? "throw",
		override: e?.override ?? (() => {}),
		io: e?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		sharedDefsExtractedFor: void 0,
		sharedEmitDoneFor: void 0,
		cycles: e?.cycles ?? "ref",
		reused: e?.reused ?? "inline",
		intersections: [],
		deferred: [],
		external: e?.external ?? void 0
	};
}
function La(e, t, n, r, i) {
	let a = typeof t.unrepresentable == "function" ? t.unrepresentable({
		zodSchema: e,
		path: r.path,
		message: i
	}) : t.unrepresentable;
	if (a === "any") return !1;
	if (a === void 0 || a === "throw") throw Error(i);
	return Object.assign(n, a), !0;
}
function Ra(e, t, n = {
	path: [],
	schemaPath: []
}) {
	var r;
	let i = e._zod.def, a = t.seen.get(e);
	if (a) return a.count++, n.schemaPath.includes(e) && (a.cycle = n.path), a.schema;
	let o = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: n.path
	};
	t.seen.set(e, o), t.sharedDefsExtractedFor = void 0, t.sharedEmitDoneFor = void 0;
	let s = e._zod.toJSONSchema?.();
	if (s) o.schema = s;
	else {
		let r = {
			...n,
			schemaPath: [...n.schemaPath, e],
			path: n.path
		};
		if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, o.schema, r);
		else {
			let n = o.schema, a = t.processors[i.type];
			if (!a) throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);
			a(e, t, n, r);
		}
		let a = e._zod.parent;
		a && (o.ref ||= a, Ra(a, t, r), t.seen.get(a).isParent = !0);
	}
	let c = t.metadataRegistry.get(e);
	return c && Fa(o.schema, c), t.io === "input" && Ja(e) && (delete o.schema.examples, delete o.schema.default), t.io === "input" && "_prefault" in o.schema && ((r = o.schema).default ?? (r.default = o.schema._prefault)), delete o.schema._prefault, t.seen.get(e).schema;
}
function za(e) {
	return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
function Ba(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	if (e.external && e.sharedDefsExtractedFor === e.external) return;
	let r = /* @__PURE__ */ new Map();
	for (let t of e.seen.entries()) {
		let n = e.metadataRegistry.get(t[0])?.id;
		if (n) {
			let e = r.get(n);
			if (e && e !== t[0]) throw Error(`Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			r.set(n, t[0]);
		}
	}
	let i = (t) => {
		let r = e.target === "draft-2020-12" ? "$defs" : "definitions";
		if (e.external) {
			let n = e.external.registry.get(t[0])?.id, i = e.external.uri ?? ((e) => e);
			if (n) return { ref: i(n) };
			let a = t[1].defId ?? t[1].schema.id ?? `schema${e.counter++}`;
			return t[1].defId = a, {
				defId: a,
				ref: `${i("__shared")}#/${r}/${za(a)}`
			};
		}
		let i = `#/${r}/`;
		if (t[1] === n && !t[1].schema.id) return { ref: "#" };
		let a = t[1].schema.id ?? `__schema${e.counter++}`;
		return {
			defId: a,
			ref: i + za(a)
		};
	}, a = (e) => {
		if (e[1].schema.$ref) return;
		let t = e[1], { ref: n, defId: r } = i(e);
		t.def = { ...t.schema }, r && (t.defId = r);
		let a = t.schema;
		for (let e in a) delete a[e];
		a.$ref = n;
	};
	if (e.cycles === "throw") for (let t of e.seen.entries()) {
		let e = t[1];
		if (e.cycle) throw Error(`Cycle detected: #/${e.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (let n of e.seen.entries()) {
		let r = n[1];
		if (t === n[0]) a(n);
		else {
			if (e.external) {
				let r = e.external.registry.get(n[0])?.id;
				if (t !== n[0] && r) {
					a(n);
					continue;
				}
			}
			(e.metadataRegistry.get(n[0])?.id || r.cycle || r.count > 1 && e.reused === "ref") && a(n);
		}
	}
	e.external && (e.sharedDefsExtractedFor = e.external);
}
function Va(e) {
	let t = e.anyOf;
	if (!Array.isArray(t) || t.length === 0 || e.type !== void 0) return;
	let n = [];
	for (let e of t) {
		if (!e || typeof e != "object") return;
		Va(e);
		let t = Object.keys(e);
		if (t.length !== 1 || t[0] !== "type") return;
		let r = e.type;
		for (let e of Array.isArray(r) ? r : [r]) {
			if (typeof e != "string") return;
			n.includes(e) || n.push(e);
		}
	}
	delete e.anyOf, e.type = n.length === 1 ? n[0] : n;
}
var Ha = /* @__PURE__ */ new Set([
	"type",
	"properties",
	"required",
	"additionalProperties"
]), Ua = ["oneOf", "anyOf"];
function Wa(e) {
	let t = e.additionalProperties;
	return t === void 0 || t === !1 || typeof t != "object" || !t ? null : Object.keys(t).length ? t : null;
}
function Ga(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != "object" || n.type !== "object") return null;
		for (let e in n) if (!Ha.has(e)) return null;
		t.push(n);
	}
	let n = {}, r = /* @__PURE__ */ new Set();
	for (let e of t) {
		for (let r in e.properties) {
			if (Object.prototype.hasOwnProperty.call(n, r)) continue;
			let e = [];
			for (let n of t) {
				let t = n.properties?.[r] ?? Wa(n);
				t != null && (e.some((e) => JSON.stringify(e) === JSON.stringify(t)) || e.push(t));
			}
			y(n, r, e.length === 1 ? e[0] : Ga(e) ?? { allOf: e });
		}
		for (let t of e.required ?? []) r.add(t);
	}
	let i = {
		type: "object",
		properties: n
	};
	if (r.size && (i.required = [...r]), t.every((e) => e.additionalProperties === !1)) i.additionalProperties = !1;
	else {
		let e = [];
		for (let n of t) {
			let t = Wa(n);
			t && !e.some((e) => JSON.stringify(e) === JSON.stringify(t)) && e.push(t);
		}
		e.length === 1 ? i.additionalProperties = e[0] : e.length > 1 && (i.additionalProperties = { allOf: e });
	}
	return i;
}
function Ka(e) {
	let t = e.allOf;
	if (!Array.isArray(t) || t.length < 2) return;
	for (let t of Ha) if (t in e) return;
	let n = t.filter((e) => Ua.some((t) => Array.isArray(e[t]))), r = null;
	if (!n.length) r = Ga(t);
	else {
		let e = n[0], i = Ua.find((t) => Array.isArray(e[t]));
		if (Object.keys(e).length !== 1) return;
		let a = t.filter((t) => t !== e), o = e[i].map((e) => Ga([...a, e]));
		if (o.some((e) => !e)) return;
		r = { [i]: o };
	}
	r && (delete e.allOf, Fa(e, r));
}
function qa(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = (t) => {
		let n = e.seen.get(t);
		if (n.ref === null) return;
		let i = n.def ?? n.schema, a = { ...i }, o = n.ref;
		if (n.ref = null, o) {
			r(o);
			let n = e.seen.get(o), s = n.schema;
			if (s.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (i.allOf = i.allOf ?? [], i.allOf.push(s)) : Fa(i, s), Fa(i, a), t._zod.parent === o) for (let e in i) e !== "$ref" && e !== "allOf" && (e in a || delete i[e]);
			if (s.$ref && n.def) for (let e in i) e !== "$ref" && e !== "allOf" && e in n.def && JSON.stringify(i[e]) === JSON.stringify(n.def[e]) && delete i[e];
		}
		let s = t._zod.parent;
		if (s && s !== o) {
			r(s);
			let t = e.seen.get(s);
			if (t?.schema.$ref && (i.$ref = t.schema.$ref, t.def)) for (let e in i) e !== "$ref" && e !== "allOf" && e in t.def && JSON.stringify(i[e]) === JSON.stringify(t.def[e]) && delete i[e];
		}
		e.override({
			zodSchema: t,
			jsonSchema: i,
			path: n.path ?? []
		});
	};
	if (!e.external || e.sharedEmitDoneFor !== e.external) {
		for (let t of [...e.seen.entries()].reverse()) r(t[0]);
		if (e.target !== "openapi-3.0") for (let t of e.seen.entries()) Va(t[1].def ?? t[1].schema);
		for (let t of e.deferred) t();
		if (e.intersections.length) {
			let t = /* @__PURE__ */ new Map();
			for (let n of e.seen.values()) for (let e of [n.schema, n.def]) {
				let n = e?.allOf;
				if (!Array.isArray(n)) continue;
				let r = t.get(n);
				r ? r.push(e) : t.set(n, [e]);
			}
			for (let n of e.intersections) for (let e of t.get(n) ?? []) Ka(e);
		}
	}
	let i = {};
	if (e.target === "draft-2020-12" ? i.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? i.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? i.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
		let n = e.external.registry.get(t)?.id;
		if (!n) throw Error("Schema is missing an `id` property");
		i.$id = e.external.uri(n);
	}
	Fa(i, n.defId ? n.schema : n.def ?? n.schema);
	let a = e.metadataRegistry.get(t)?.id;
	a !== void 0 && i.id === a && delete i.id;
	let o = e.external?.defs ?? {};
	if (!e.external || e.sharedEmitDoneFor !== e.external) for (let t of e.seen.entries()) {
		let e = t[1];
		e.def && e.defId && (e.def.id === e.defId && delete e.def.id, y(o, e.defId, e.def));
	}
	e.external && (e.sharedEmitDoneFor = e.external), e.external || Object.keys(o).length > 0 && (e.target === "draft-2020-12" ? i.$defs = o : i.definitions = o);
	try {
		let n = JSON.parse(JSON.stringify(i));
		return Object.defineProperty(n, "~standard", {
			value: {
				...t["~standard"],
				jsonSchema: {
					input: Xa(t, "input", e.processors),
					output: Xa(t, "output", e.processors)
				}
			},
			enumerable: !1,
			writable: !1
		}), n;
	} catch {
		throw Error("Error converting schema to JSON.");
	}
}
function Ja(e, t) {
	let n = t ?? { seen: /* @__PURE__ */ new Set() };
	if (n.seen.has(e)) return !1;
	n.seen.add(e);
	let r = e._zod.def;
	if (r.type === "transform") return !0;
	if (r.type === "array") return Ja(r.element, n);
	if (r.type === "set") return Ja(r.valueType, n);
	if (r.type === "lazy") return Ja(r.getter(), n);
	if (r.type === "promise" || r.type === "optional" || r.type === "nonoptional" || r.type === "nullable" || r.type === "readonly" || r.type === "default" || r.type === "prefault" || r.type === "catch") return Ja(r.innerType, n);
	if (r.type === "intersection") return Ja(r.left, n) || Ja(r.right, n);
	if (r.type === "record" || r.type === "map") return Ja(r.keyType, n) || Ja(r.valueType, n);
	if (r.type === "pipe") return e._zod.traits.has("$ZodCodec") ? !0 : Ja(r.in, n) || Ja(r.out, n);
	if (r.type === "object") {
		for (let e in r.shape) if (Ja(r.shape[e], n)) return !0;
		return !1;
	}
	if (r.type === "union") {
		for (let e of r.options) if (Ja(e, n)) return !0;
		return !1;
	}
	if (r.type === "tuple") {
		for (let e of r.items) if (Ja(e, n)) return !0;
		return !!(r.rest && Ja(r.rest, n));
	}
	return !1;
}
var Ya = (e, t = {}) => (n) => {
	let r = Ia({
		...n,
		processors: t
	});
	return Ra(e, r), Ba(r, e), qa(r, e);
}, Xa = (e, t, n = {}) => (r) => {
	let { libraryOptions: i, target: a } = r ?? {}, o = Ia({
		...i ?? {},
		target: a,
		io: t,
		processors: n
	});
	return Ra(e, o), Ba(o, e), qa(o, e);
}, Za = (e, t, n) => {
	(e[t] === void 0 || n > e[t]) && (e[t] = n);
}, Qa = (e, t, n) => {
	(e[t] === void 0 || n < e[t]) && (e[t] = n);
}, $a = (e, t) => {
	Za(e, "minimum", t), Qa(e, "maximum", t);
}, eo = (e, t) => {
	e.multipleOf ??= [], e.multipleOf.includes(t) || e.multipleOf.push(t);
}, to = (e, t) => {
	e.patterns ??= /* @__PURE__ */ new Set(), e.patterns.add(t);
}, no = (e, t) => {
	e.mime = e.mime ? e.mime.filter((e) => t.includes(e)) : [...t];
}, ro = (e, t) => {
	e.format = t, t.includes("int") && (e.isInt = !0);
}, io = (e, t) => Za(e, "minimum", t.minimum), ao = (e, t) => Qa(e, "maximum", t.maximum), oo = (e) => (t, n) => {
	ro(t, n.format);
	let [r, i] = e[n.format];
	Za(t, "minimum", r), Qa(t, "maximum", i);
}, so = {
	greater_than: (e, t) => Za(e, t.inclusive ? "minimum" : "exclusiveMinimum", t.value),
	less_than: (e, t) => Qa(e, t.inclusive ? "maximum" : "exclusiveMaximum", t.value),
	multiple_of: (e, t) => eo(e, t.value),
	number_format: oo(ve),
	bigint_format: oo(ye),
	min_length: io,
	max_length: ao,
	length_equals: (e, t) => $a(e, t.length),
	min_size: io,
	max_size: ao,
	size_equals: (e, t) => $a(e, t.size),
	string_format: (e, t) => {
		ro(e, t.format), t.pattern && to(e, t.pattern), (t.format === "base64" || t.format === "base64url") && (e.contentEncoding = t.format), (t.local || t.precision === -1) && (e.laxFormat = !0);
	},
	mime_type: (e, t) => no(e, t.mime)
};
function co(e) {
	let t = {}, n = e._zod.def, r = e._zod.traits.has("$ZodCheck") ? [e, ...n.checks ?? []] : n.checks ?? [];
	for (let e of r) so[e._zod.def.check]?.(t, e._zod.def);
	let i = e._zod.bag;
	i.minimum !== void 0 && Za(t, "minimum", i.minimum), i.exclusiveMinimum !== void 0 && Za(t, "exclusiveMinimum", i.exclusiveMinimum), i.maximum !== void 0 && Qa(t, "maximum", i.maximum), i.exclusiveMaximum !== void 0 && Qa(t, "exclusiveMaximum", i.exclusiveMaximum), i.multipleOf !== void 0 && eo(t, i.multipleOf), i.format !== void 0 && (t.format ??= i.format, i.format.includes("int") && (t.isInt = !0)), i.mime && no(t, i.mime);
	for (let e of i.patterns ?? []) to(t, e);
	return t;
}
var lo = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
}, uo = /* @__PURE__ */ new Map([[hr, Zt], [_r, Qt]]), fo = (e) => uo.get(e) ?? e, po = (e, t, n, r) => {
	let i = n;
	i.type = "string";
	let { minimum: a, maximum: o, format: s, patterns: c, contentEncoding: l, laxFormat: u } = co(e);
	if (typeof a == "number" && (i.minLength = a), typeof o == "number" && (i.maxLength = o), s && (i.format = lo[s] ?? s, i.format === "" && delete i.format, (s === "time" || u) && delete i.format), l && (i.contentEncoding = l), c && c.size > 0) {
		let e = [...c].map(fo);
		e.length === 1 ? i.pattern = e[0].source : e.length > 1 && (i.allOf = [...e.map((e) => ({
			...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: e.source
		}))]);
	}
}, mo = (e, t, n, r) => {
	let i = n, { minimum: a, maximum: o, multipleOf: s, exclusiveMaximum: c, exclusiveMinimum: l, isInt: u } = co(e);
	i.type = u ? "integer" : "number";
	let d = typeof l == "number" && l >= (a ?? -Infinity), f = typeof c == "number" && c <= (o ?? Infinity), p = t.target === "draft-04" || t.target === "openapi-3.0";
	if (d ? p ? (i.minimum = l, i.exclusiveMinimum = !0) : i.exclusiveMinimum = l : typeof a == "number" && (i.minimum = a), f ? p ? (i.maximum = c, i.exclusiveMaximum = !0) : i.exclusiveMaximum = c : typeof o == "number" && (i.maximum = o), s) {
		let n = /* @__PURE__ */ new Set();
		for (let a of s) Number.isFinite(a) && a !== 0 ? n.add(Math.abs(a)) : La(e, t, i, r, `A multipleOf divisor of ${a} cannot be represented in JSON Schema`);
		let [a, ...o] = n;
		a !== void 0 && (i.multipleOf = a), o.length && (i.allOf = [...i.allOf ?? [], ...o.map((e) => ({ multipleOf: e }))]);
	}
}, ho = (e, t, n, r) => {
	n.type = "boolean";
}, go = (e, t, n, r) => {
	n.not = {};
}, _o = (e, t, n, r) => {
	let i = e._zod.def, a = d(i.entries);
	a.length === 0 ? n.not = {} : (a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), n.enum = a);
}, vo = (e, t, n, r) => {
	let i = e._zod.def;
	if (i.values.length === 0) {
		n.not = {};
		return;
	}
	let a = [];
	for (let o of i.values) if (o === void 0) {
		if (La(e, t, n, r, "Literal `undefined` cannot be represented in JSON Schema")) return;
	} else if (typeof o == "bigint") {
		if (La(e, t, n, r, "BigInt literals cannot be represented in JSON Schema")) return;
		a.push(Number(o));
	} else a.push(o);
	if (a.length !== 0) {
		if (a.length === 1) {
			let e = a[0];
			n.type = e === null ? "null" : typeof e, t.target === "draft-04" || t.target === "openapi-3.0" ? n.enum = [e] : n.const = e;
		} else a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), a.every((e) => typeof e == "boolean") && (n.type = "boolean"), a.every((e) => e === null) && (n.type = "null"), n.enum = a;
	}
}, yo = (e, t, n, r) => {
	La(e, t, n, r, "Custom types cannot be represented in JSON Schema");
}, bo = (e, t, n, r) => {
	La(e, t, n, r, "Transforms cannot be represented in JSON Schema");
}, xo = (e, t, n, r) => {
	let i = n, a = e._zod.def, { minimum: o, maximum: s } = co(e);
	typeof o == "number" && (i.minItems = o), typeof s == "number" && (i.maxItems = s), i.type = "array", i.items = Ra(a.element, t, {
		...r,
		path: [...r.path, "items"]
	});
};
function So(e) {
	let t = e._zod.def;
	return t.type === "pipe" && t.in._zod.traits.has("$ZodTransform") ? So(t.out) : t.type === "catch" ? So(t.innerType) : e._zod.optin;
}
var Co = (e, t, n, r) => {
	let i = n, a = e._zod.def, o = a.shape;
	if (Object.getOwnPropertySymbols(o).length && La(e, t, i, r, "Symbol keys cannot be represented in JSON Schema")) return;
	i.type = "object", i.properties = {};
	for (let e in o) y(i.properties, e, Ra(o[e], t, {
		...r,
		path: [
			...r.path,
			"properties",
			e
		]
	}));
	let s = [];
	for (let e of Object.keys(o)) {
		let n = a.shape[e];
		(t.io === "input" ? So(n) === void 0 : n._zod.optout === void 0) && s.push(e);
	}
	s.length > 0 && (i.required = s), a.catchall?._zod.def.type === "never" ? i.additionalProperties = !1 : a.catchall ? a.catchall && (i.additionalProperties = Ra(a.catchall, t, {
		...r,
		path: [...r.path, "additionalProperties"]
	})) : t.io === "output" && (i.additionalProperties = !1);
}, wo = (e, t, n, r) => {
	let i = e._zod.def, a = i.inclusive === !1, o = i.options.map((e, n) => Ra(e, t, {
		...r,
		path: [
			...r.path,
			a ? "oneOf" : "anyOf",
			n
		]
	}));
	a ? n.oneOf = o : n.anyOf = o;
}, To = (e, t, n, r) => {
	let i = e._zod.def, a = Ra(i.left, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			0
		]
	}), o = Ra(i.right, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			1
		]
	}), s = (e) => "allOf" in e && Object.keys(e).length === 1, c = [...s(a) ? a.allOf : [a], ...s(o) ? o.allOf : [o]];
	n.allOf = c, t.intersections.push(c);
};
function Eo(e, t, n) {
	if (t.$ref) {
		if (n.has(t)) return t;
		n.add(t);
		let r = e.get(t)?.def;
		if (!r) return t;
		let i = Eo(e, r, n);
		return i === r ? t : i;
	}
	for (let r of ["anyOf", "oneOf"]) {
		let i = t[r];
		if (!Array.isArray(i)) continue;
		let a = i.map((t) => Eo(e, t, n));
		a.some((e, t) => e !== i[t]) && (t = {
			...t,
			[r]: a
		});
	}
	let r = Array.isArray(t.type) ? t.type : [t.type], i = !r.includes("string") && r.some((e) => e === "number" || e === "integer"), a = t.enum ?? (t.const === void 0 ? void 0 : [t.const]);
	if (!i && !a?.some((e) => typeof e == "number")) return t;
	let { minimum: o, maximum: s, exclusiveMinimum: c, exclusiveMaximum: l, multipleOf: u, format: d, id: f, ...p } = t;
	return p.enum ? p.enum = p.enum.map((e) => typeof e == "number" ? String(e) : e) : typeof p.const == "number" && (p.const = String(p.const)), i && (p.type = "string", a || (p.pattern = (r.includes("number") ? un : ln).source)), p;
}
var Do = /* @__PURE__ */ new WeakMap();
function Oo(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.seen.values()) n.def && !t.has(n.schema) && t.set(n.schema, n);
	let n = /* @__PURE__ */ new Map();
	for (let r of Do.get(e) ?? []) {
		let i = e.seen.get(r), a = (i?.def ?? i?.schema)?.propertyNames;
		if (!a || a === !0 || n.has(a)) continue;
		let o = Eo(t, a, /* @__PURE__ */ new Set());
		o !== a && n.set(a, o);
	}
	if (n.size) for (let t of e.seen.values()) for (let e of [t.schema, t.def]) {
		let t = e && n.get(e.propertyNames);
		t && (e.propertyNames = t);
	}
}
var ko = (e, t, n, r) => {
	let i = n, a = e._zod.def;
	i.type = "object";
	let o = a.keyType, s = co(o).patterns;
	if (a.mode === "loose" && s && s.size > 0) {
		let e = Ra(a.valueType, t, {
			...r,
			path: [
				...r.path,
				"patternProperties",
				"*"
			]
		});
		i.patternProperties = {};
		for (let t of s) y(i.patternProperties, fo(t).source, e);
	} else {
		if (t.target === "draft-07" || t.target === "draft-2020-12") {
			i.propertyNames = Ra(a.keyType, t, {
				...r,
				path: [...r.path, "propertyNames"]
			});
			let n = Do.get(t);
			n || (n = [], Do.set(t, n), t.deferred.push(() => Oo(t))), n.push(e);
		}
		i.additionalProperties = Ra(a.valueType, t, {
			...r,
			path: [...r.path, "additionalProperties"]
		});
	}
	let c = o._zod.values, l = t.io === "input" && So(a.valueType) !== void 0;
	if (c && !a.partial && !l) {
		let e = [...c].filter((e) => typeof e == "string" || typeof e == "number");
		e.length > 0 && (i.required = e.map(String));
	}
}, Ao = (e, t, n, r) => {
	let i = e._zod.def, a = Ra(i.innerType, t, r), o = t.seen.get(e);
	t.target === "openapi-3.0" ? (o.ref = i.innerType, n.nullable = !0) : n.anyOf = [a, { type: "null" }];
}, jo = (e, t, n, r) => {
	let i = e._zod.def;
	Ra(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, Mo = Symbol();
function No(e, t, n, r, i) {
	let a = !1, o = JSON.stringify(e, (e, t) => typeof t == "bigint" ? (a = !0, null) : t);
	return a ? (La(t, n, r, i, "BigInt defaults cannot be represented in JSON Schema"), Mo) : JSON.parse(o);
}
var Po = (e, t, n, r) => {
	let i = e._zod.def;
	Ra(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o = No(i.defaultValue, e, t, n, r);
	o !== Mo && (n.default = o);
}, Fo = (e, t, n, r) => {
	let i = e._zod.def;
	Ra(i.innerType, t, r);
	let a = t.seen.get(e);
	if (a.ref = i.innerType, t.io !== "input") return;
	let o = No(i.defaultValue, e, t, n, r);
	o !== Mo && (n._prefault = o);
}, Io = (e, t, n, r) => {
	let i = e._zod.def;
	Ra(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o;
	try {
		o = i.catchValue(void 0);
	} catch {
		La(e, t, n, r, "Dynamic catch values are not supported in JSON Schema");
		return;
	}
	n.default = o;
}, Lo = (e, t, n, r) => {
	let i = e._zod.def, a = i.in._zod.traits.has("$ZodTransform"), o = t.io === "input" ? a ? i.out : i.in : i.out;
	Ra(o, t, r);
	let s = t.seen.get(e);
	s.ref = o;
}, Ro = (e, t, n, r) => {
	let i = e._zod.def;
	Ra(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.readOnly = !0;
}, zo = (e, t, n, r) => {
	let i = e._zod.def;
	Ra(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, Bo = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function Vo(e, t, n) {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		get() {
			let e = n(this);
			return Object.defineProperty(this, t, {
				value: e,
				configurable: !0,
				writable: !0
			}), e;
		},
		set(e) {
			Object.defineProperty(this, t, {
				value: e,
				configurable: !0,
				writable: !0
			});
		}
	});
}
var Ho = /*@__PURE__*/ w("ZodError", (e, t) => {
	dt.init(e, t), e.name = "ZodError";
	let n = Object.getPrototypeOf(e);
	Bo.has(n) || (Bo.add(n), Vo(n, "format", (e) => (t) => mt(e, t)), Vo(n, "flatten", (e) => (t) => pt(e, t)), Vo(n, "addIssue", (e) => (t) => {
		e.issues.push(t), e.message = JSON.stringify(e.issues, p, 2);
	}), Vo(n, "addIssues", (e) => (t) => {
		e.issues.push(...t), e.message = JSON.stringify(e.issues, p, 2);
	}), Object.defineProperty(n, "isEmpty", {
		configurable: !0,
		enumerable: !1,
		get() {
			return this.issues.length === 0;
		}
	}));
}, void 0, { Parent: Error }), Uo = /* @__PURE__ */ gt(Ho), Wo = /* @__PURE__ */ _t(Ho), Go = /* @__PURE__ */ vt(Ho), Ko = /* @__PURE__ */ bt(Ho), qo = /* @__PURE__ */ Et(Ho), Jo = /* @__PURE__ */ Dt(Ho), Yo = /* @__PURE__ */ Ot(Ho), Xo = /* @__PURE__ */ kt(Ho), Zo = /* @__PURE__ */ At(Ho), Qo = /* @__PURE__ */ jt(Ho), $o = /* @__PURE__ */ Mt(Ho), D = /* @__PURE__ */ Nt(Ho);
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/schemas.js
function es() {
	rt.localeError || it(Oi());
}
function ts() {
	rt.memoizer || it({ memoizer: Ti() });
}
var ns = /*@__PURE__*/ w("ZodType", (e, t) => (es(), Pn.init(e, t), e.def = t, e.type = t.type, e), {
	check(...e) {
		let t = this.def;
		return this.clone(ae(t, { checks: [...t.checks ?? [], ...e.map((e) => typeof e == "function" ? { _zod: {
			check: e,
			def: { check: "custom" },
			onattach: []
		} } : e)] }), { parent: !0 });
	},
	with(...e) {
		return this.check(...e);
	},
	clone(e, t) {
		return he(this, e, t);
	},
	brand() {
		return this;
	},
	register(e, t) {
		return e.add(this, t), this;
	},
	refine(e, t) {
		return this.check(bc(e, t));
	},
	superRefine(e, t) {
		return this.check(xc(e, t));
	},
	overwrite(e) {
		return this.check(/* @__PURE__ */ Ta(e));
	},
	optional() {
		return nc(this);
	},
	exactOptional() {
		return ic(this);
	},
	nullable() {
		return oc(this);
	},
	nullish() {
		return nc(oc(this));
	},
	nonoptional(e) {
		return fc(this, e);
	},
	array() {
		return k(this);
	},
	or(e) {
		return Us([this, e]);
	},
	and(e) {
		return qs(this, e);
	},
	transform(e) {
		return gc(this, ec(e));
	},
	default(e) {
		return cc(this, e);
	},
	prefault(e) {
		return uc(this, e);
	},
	catch(e) {
		return mc(this, e);
	},
	pipe(e) {
		return gc(this, e);
	},
	readonly() {
		return vc(this);
	},
	describe(e) {
		let t = this.clone();
		return Mi.add(t, { description: e }), t;
	},
	meta(...e) {
		if (e.length === 0) return Mi.get(this);
		let t = this.clone();
		return Mi.add(t, e[0]), t;
	},
	isOptional() {
		return this.safeParse(void 0).success;
	},
	isNullable() {
		return this.safeParse(null).success;
	},
	apply(e, ...t) {
		return t.length === 0 ? e(this) : e(this, ...t);
	},
	get "~standard"() {
		return Ve(this, "~standard", {
			...Ln(this),
			jsonSchema: {
				input: Xa(this, "input"),
				output: Xa(this, "output")
			}
		});
	},
	set "~standard"(e) {
		Be(this, "~standard", e);
	},
	parse: function e(t, n) {
		return Uo(this, t, n, { callee: e });
	},
	parseAsync: async function e(t, n) {
		return await Wo(this, t, n, { callee: e });
	},
	safeParse(e, t) {
		return Go(this, e, t);
	},
	async safeParseAsync(e, t) {
		return Ko(this, e, t);
	},
	get spa() {
		return this?.safeParseAsync;
	},
	set spa(e) {
		Be(this, "spa", e);
	},
	validate(e, t) {
		return Ct(this, e, t);
	},
	validateAsync(e, t) {
		return Tt(this, e, t);
	},
	encode: function e(t, n) {
		return qo(this, t, n, { callee: e });
	},
	decode: function e(t, n) {
		return Jo(this, t, n, { callee: e });
	},
	encodeAsync: async function e(t, n) {
		return await Yo(this, t, n, { callee: e });
	},
	decodeAsync: async function e(t, n) {
		return await Xo(this, t, n, { callee: e });
	},
	safeEncode(e, t) {
		return Zo(this, e, t);
	},
	safeDecode(e, t) {
		return Qo(this, e, t);
	},
	async safeEncodeAsync(e, t) {
		return $o(this, e, t);
	},
	async safeDecodeAsync(e, t) {
		return D(this, e, t);
	},
	toJSONSchema(e) {
		return Ya(this, {})(e);
	},
	get description() {
		return Mi.get(this)?.description;
	},
	get _def() {
		return this._zod.def;
	}
}), rs = /*@__PURE__*/ w("_ZodString", (e, t) => {
	Rn.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => po(e, t, n, r);
}, /*@__PURE__*/ He({
	format: (e) => co(e).format ?? null,
	minLength: (e) => co(e).minimum ?? null,
	maxLength: (e) => co(e).maximum ?? null
}, {
	regex(...e) {
		return this.check(/* @__PURE__ */ ya(...e));
	},
	includes(...e) {
		return this.check(/* @__PURE__ */ Sa(...e));
	},
	startsWith(...e) {
		return this.check(/* @__PURE__ */ Ca(...e));
	},
	endsWith(...e) {
		return this.check(/* @__PURE__ */ wa(...e));
	},
	min(...e) {
		return this.check(/* @__PURE__ */ _a(...e));
	},
	max(...e) {
		return this.check(/* @__PURE__ */ ga(...e));
	},
	length(...e) {
		return this.check(/* @__PURE__ */ va(...e));
	},
	nonempty(...e) {
		return this.check(/* @__PURE__ */ _a(1, ...e));
	},
	lowercase(e) {
		return this.check(/* @__PURE__ */ ba(e));
	},
	uppercase(e) {
		return this.check(/* @__PURE__ */ xa(e));
	},
	trim() {
		return this.check(/* @__PURE__ */ Da());
	},
	normalize(...e) {
		return this.check(/* @__PURE__ */ Ea(...e));
	},
	toLowerCase() {
		return this.check(/* @__PURE__ */ Oa());
	},
	toUpperCase() {
		return this.check(/* @__PURE__ */ ka());
	},
	slugify() {
		return this.check(/* @__PURE__ */ Aa());
	}
})), is = /*@__PURE__*/ w("ZodString", (e, t) => {
	Rn.init(e, t), rs.init(e, t);
}, {
	email(e) {
		return this.check(/* @__PURE__ */ Fi(us, e));
	},
	url(e) {
		return this.check(/* @__PURE__ */ Vi(ps, e));
	},
	jwt(e) {
		return this.check(/* @__PURE__ */ na(Os, e));
	},
	emoji(e) {
		return this.check(/* @__PURE__ */ Hi(ms, e));
	},
	guid(e) {
		return this.check(/* @__PURE__ */ Ii(ds, e));
	},
	uuid(e) {
		return this.check(/* @__PURE__ */ Li(fs, e));
	},
	uuidv4(e) {
		return this.check(/* @__PURE__ */ Ri(fs, e));
	},
	uuidv6(e) {
		return this.check(/* @__PURE__ */ zi(fs, e));
	},
	uuidv7(e) {
		return this.check(/* @__PURE__ */ Bi(fs, e));
	},
	nanoid(e) {
		return this.check(/* @__PURE__ */ Ui(hs, e));
	},
	cuid(e) {
		return this.check(/* @__PURE__ */ Wi(gs, e));
	},
	cuid2(e) {
		return this.check(/* @__PURE__ */ Gi(_s, e));
	},
	ulid(e) {
		return this.check(/* @__PURE__ */ Ki(vs, e));
	},
	base64(e) {
		return this.check(/* @__PURE__ */ $i(Ts, e));
	},
	base64url(e) {
		return this.check(/* @__PURE__ */ ea(Es, e));
	},
	xid(e) {
		return this.check(/* @__PURE__ */ qi(ys, e));
	},
	ksuid(e) {
		return this.check(/* @__PURE__ */ Ji(bs, e));
	},
	ipv4(e) {
		return this.check(/* @__PURE__ */ Yi(xs, e));
	},
	ipv6(e) {
		return this.check(/* @__PURE__ */ Xi(Ss, e));
	},
	cidrv4(e) {
		return this.check(/* @__PURE__ */ Zi(Cs, e));
	},
	cidrv6(e) {
		return this.check(/* @__PURE__ */ Qi(ws, e));
	},
	e164(e) {
		return this.check(/* @__PURE__ */ ta(Ds, e));
	},
	datetime(e) {
		return this.check(/* @__PURE__ */ ra(os, e));
	},
	date(e) {
		return this.check(/* @__PURE__ */ ia(ss, e));
	},
	time(e) {
		return this.check(/* @__PURE__ */ aa(cs, e));
	},
	duration(e) {
		return this.check(/* @__PURE__ */ oa(ls, e));
	}
});
function O(e) {
	return /* @__PURE__ */ Pi(is, e);
}
var as = /*@__PURE__*/ w("ZodStringFormat", (e, t) => {
	T.init(e, t), rs.init(e, t);
}), os = /*@__PURE__*/ w("ZodISODateTime", (e, t) => {
	rr.init(e, t), as.init(e, t);
}), ss = /*@__PURE__*/ w("ZodISODate", (e, t) => {
	ir.init(e, t), as.init(e, t);
}), cs = /*@__PURE__*/ w("ZodISOTime", (e, t) => {
	ar.init(e, t), as.init(e, t);
}), ls = /*@__PURE__*/ w("ZodISODuration", (e, t) => {
	or.init(e, t), as.init(e, t);
}), us = /*@__PURE__*/ w("ZodEmail", (e, t) => {
	Vn.init(e, t), as.init(e, t);
}), ds = /*@__PURE__*/ w("ZodGUID", (e, t) => {
	zn.init(e, t), as.init(e, t);
}), fs = /*@__PURE__*/ w("ZodUUID", (e, t) => {
	Bn.init(e, t), as.init(e, t);
}), ps = /*@__PURE__*/ w("ZodURL", (e, t) => {
	Yn.init(e, t), as.init(e, t);
}), ms = /*@__PURE__*/ w("ZodEmoji", (e, t) => {
	Xn.init(e, t), as.init(e, t);
}), hs = /*@__PURE__*/ w("ZodNanoID", (e, t) => {
	Zn.init(e, t), as.init(e, t);
}), gs = /*@__PURE__*/ w("ZodCUID", (e, t) => {
	Qn.init(e, t), as.init(e, t);
}), _s = /*@__PURE__*/ w("ZodCUID2", (e, t) => {
	$n.init(e, t), as.init(e, t);
}), vs = /*@__PURE__*/ w("ZodULID", (e, t) => {
	er.init(e, t), as.init(e, t);
}), ys = /*@__PURE__*/ w("ZodXID", (e, t) => {
	tr.init(e, t), as.init(e, t);
}), bs = /*@__PURE__*/ w("ZodKSUID", (e, t) => {
	nr.init(e, t), as.init(e, t);
}), xs = /*@__PURE__*/ w("ZodIPv4", (e, t) => {
	sr.init(e, t), as.init(e, t);
}), Ss = /*@__PURE__*/ w("ZodIPv6", (e, t) => {
	ur.init(e, t), as.init(e, t);
}), Cs = /*@__PURE__*/ w("ZodCIDRv4", (e, t) => {
	dr.init(e, t), as.init(e, t);
}), ws = /*@__PURE__*/ w("ZodCIDRv6", (e, t) => {
	pr.init(e, t), as.init(e, t);
}), Ts = /*@__PURE__*/ w("ZodBase64", (e, t) => {
	gr.init(e, t), as.init(e, t);
}), Es = /*@__PURE__*/ w("ZodBase64URL", (e, t) => {
	yr.init(e, t), as.init(e, t);
}), Ds = /*@__PURE__*/ w("ZodE164", (e, t) => {
	br.init(e, t), as.init(e, t);
}), Os = /*@__PURE__*/ w("ZodJWT", (e, t) => {
	Sr.init(e, t), as.init(e, t);
}), ks = /*@__PURE__*/ w("ZodNumber", (e, t) => {
	Cr.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => mo(e, t, n, r), e.isFinite = !0;
}, /*@__PURE__*/ He({
	minValue: (e) => {
		let { minimum: t, exclusiveMinimum: n } = co(e);
		return Math.max(t ?? -Infinity, n ?? -Infinity);
	},
	maxValue: (e) => {
		let { maximum: t, exclusiveMaximum: n } = co(e);
		return Math.min(t ?? Infinity, n ?? Infinity);
	},
	isInt: (e) => {
		let { isInt: t, multipleOf: n } = co(e);
		return !!t || !!n?.some(Number.isSafeInteger);
	},
	format: (e) => co(e).format ?? null
}, {
	gt(e, t) {
		return this.check(/* @__PURE__ */ ma(e, t));
	},
	gte(e, t) {
		return this.check(/* @__PURE__ */ ha(e, t));
	},
	min(e, t) {
		return this.check(/* @__PURE__ */ ha(e, t));
	},
	lt(e, t) {
		return this.check(/* @__PURE__ */ fa(e, t));
	},
	lte(e, t) {
		return this.check(/* @__PURE__ */ pa(e, t));
	},
	max(e, t) {
		return this.check(/* @__PURE__ */ pa(e, t));
	},
	int(e) {
		return this.check(Ms(e));
	},
	safe(e) {
		return this.check(Ms(e));
	},
	positive(e) {
		return this.check(/* @__PURE__ */ ma(0, e));
	},
	nonnegative(e) {
		return this.check(/* @__PURE__ */ ha(0, e));
	},
	negative(e) {
		return this.check(/* @__PURE__ */ fa(0, e));
	},
	nonpositive(e) {
		return this.check(/* @__PURE__ */ pa(0, e));
	},
	multipleOf(e, t) {
		return this.check(/* @__PURE__ */ E(e, t));
	},
	step(e, t) {
		return this.check(/* @__PURE__ */ E(e, t));
	},
	finite() {
		return this;
	}
}));
function As(e) {
	return /* @__PURE__ */ sa(ks, e);
}
var js = /*@__PURE__*/ w("ZodNumberFormat", (e, t) => {
	wr.init(e, t), ks.init(e, t);
});
function Ms(e) {
	return /* @__PURE__ */ ca(js, e);
}
var Ns = /*@__PURE__*/ w("ZodBoolean", (e, t) => {
	Tr.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => ho(e, t, n, r);
});
function Ps(e) {
	return /* @__PURE__ */ la(Ns, e);
}
var Fs = /*@__PURE__*/ w("ZodUnknown", (e, t) => {
	Er.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (e, t, n) => void 0;
});
function Is() {
	return /* @__PURE__ */ ua(Fs);
}
var Ls = /*@__PURE__*/ w("ZodNever", (e, t) => {
	Dr.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => go(e, t, n, r);
});
function Rs(e) {
	return /* @__PURE__ */ da(Ls, e);
}
var zs = /*@__PURE__*/ w("ZodArray", (e, t) => {
	ts(), kr.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => xo(e, t, n, r), e.element = t.element;
}, {
	min(e, t) {
		return this.check(/* @__PURE__ */ _a(e, t));
	},
	nonempty(e) {
		return this.check(/* @__PURE__ */ _a(1, e));
	},
	max(e, t) {
		return this.check(/* @__PURE__ */ ga(e, t));
	},
	length(e, t) {
		return this.check(/* @__PURE__ */ va(e, t));
	},
	unwrap() {
		return this.element;
	}
});
function k(e, t) {
	return /* @__PURE__ */ ja(zs, e, t);
}
var Bs = /*@__PURE__*/ w("ZodObject", (e, t) => {
	ts(), Fr.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => Co(e, t, n, r), Je(e, "shape", (e) => e._zod.def.shape, !1);
}, {
	keyof() {
		return Zs(Object.keys(this._zod.def.shape));
	},
	catchall(e) {
		return this.clone(ae(this._zod.def, { catchall: e }));
	},
	passthrough() {
		return this.clone(ae(this._zod.def, { catchall: Is() }));
	},
	loose() {
		return this.clone(ae(this._zod.def, { catchall: Is() }));
	},
	strict() {
		return this.clone(ae(this._zod.def, { catchall: Rs() }));
	},
	strip() {
		return this.clone(ae(this._zod.def, { catchall: void 0 }));
	},
	extend(e) {
		return Ce(this, e);
	},
	safeExtend(e) {
		return Te(this, e);
	},
	merge(e) {
		return S(this, e);
	},
	pick(e) {
		return be(this, e);
	},
	omit(e) {
		return Se(this, e);
	},
	partial(...e) {
		return Ee(tc, this, e[0]);
	},
	exactPartial(...e) {
		return Ee(rc, this, e[0], "exactPartial");
	},
	required(...e) {
		return De(dc, this, e[0]);
	}
});
function A(e, t) {
	return new Bs({
		type: "object",
		shape: e,
		catchall: Rs(),
		...x(t)
	});
}
function Vs(e, t) {
	return new Bs({
		type: "object",
		shape: e,
		catchall: Is(),
		...x(t)
	});
}
var Hs = /*@__PURE__*/ w("ZodUnion", (e, t) => {
	Lr.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => wo(e, t, n, r), e.options = t.options;
});
function Us(e, t) {
	return new Hs({
		type: "union",
		options: e,
		...x(t)
	});
}
var Ws = /*@__PURE__*/ w("ZodDiscriminatedUnion", (e, t) => {
	Hs.init(e, t), zr.init(e, t);
});
function Gs(e, t, n) {
	return new Ws({
		type: "union",
		options: t,
		discriminator: e,
		...x(n)
	});
}
var Ks = /*@__PURE__*/ w("ZodIntersection", (e, t) => {
	Br.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => To(e, t, n, r);
});
function qs(e, t) {
	return new Ks({
		type: "intersection",
		left: e,
		right: t
	});
}
var Js = /*@__PURE__*/ w("ZodRecord", (e, t) => {
	ts(), Ur.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => ko(e, t, n, r), e.keyType = t.keyType, e.valueType = t.valueType;
});
function Ys(e, t, n) {
	return !t || !t._zod ? new Js({
		type: "record",
		keyType: O(),
		valueType: e,
		...x(t)
	}) : new Js({
		type: "record",
		keyType: e,
		valueType: t,
		...x(n)
	});
}
var Xs = /*@__PURE__*/ w("ZodEnum", (e, t) => {
	Wr.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => _o(e, t, n, r), e.enum = t.entries, e.options = [...e._zod.values];
	let n = new Set(Object.keys(t.entries));
	e.extract = (e, r) => {
		let i = {};
		for (let r of e) if (n.has(r)) i[r] = t.entries[r];
		else throw Error(`Key ${r} not found in enum`);
		return new Xs({
			...t,
			checks: [],
			...x(r),
			entries: i
		});
	}, e.exclude = (e, r) => {
		let i = { ...t.entries };
		for (let t of e) if (n.has(t)) delete i[t];
		else throw Error(`Key ${t} not found in enum`);
		return new Xs({
			...t,
			checks: [],
			...x(r),
			entries: i
		});
	};
});
function Zs(e, t) {
	return new Xs({
		type: "enum",
		entries: Array.isArray(e) ? Object.fromEntries(e.map((e) => [e, e])) : e,
		...x(t)
	});
}
var Qs = /*@__PURE__*/ w("ZodLiteral", (e, t) => {
	Gr.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => vo(e, t, n, r), e.values = new Set(t.values), Object.defineProperty(e, "value", { get() {
		if (t.values.length > 1) throw Error("This schema contains multiple valid literal values. Use `.values` instead.");
		return t.values[0];
	} });
});
function j(e, t) {
	return new Qs({
		type: "literal",
		values: Array.isArray(e) ? e : [e],
		...x(t)
	});
}
var $s = /*@__PURE__*/ w("ZodTransform", (e, t) => {
	ts(), Kr.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => bo(e, t, n, r), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new nt(e.constructor.name);
		n.addIssue = (r) => {
			if (typeof r == "string") n.issues.push(Re(r, n.value, t));
			else {
				let t = r;
				t.fatal && (t.continue = !1), t.code ??= "custom", "input" in t || (t.input = n.value), t.inst ??= e, n.issues.push(Re(t));
			}
		};
		let i = t.transform(n.value, n);
		return i instanceof Promise ? i.then((e) => (n.value = e, n)) : (n.value = i, n);
	};
});
function ec(e) {
	return new $s({
		type: "transform",
		transform: e
	});
}
var tc = /*@__PURE__*/ w("ZodOptional", (e, t) => {
	Jr.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => zo(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function nc(e) {
	return new tc({
		type: "optional",
		innerType: e
	});
}
var rc = /*@__PURE__*/ w("ZodExactOptional", (e, t) => {
	Yr.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => zo(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function ic(e) {
	return new rc({
		type: "optional",
		innerType: e
	});
}
var ac = /*@__PURE__*/ w("ZodNullable", (e, t) => {
	Xr.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ao(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function oc(e) {
	return new ac({
		type: "nullable",
		innerType: e
	});
}
var sc = /*@__PURE__*/ w("ZodDefault", (e, t) => {
	Zr.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => Po(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function cc(e, t) {
	return new sc({
		type: "default",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : fe(t);
		}
	});
}
var lc = /*@__PURE__*/ w("ZodPrefault", (e, t) => {
	$r.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => Fo(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function uc(e, t) {
	return new lc({
		type: "prefault",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : fe(t);
		}
	});
}
var dc = /*@__PURE__*/ w("ZodNonOptional", (e, t) => {
	ei.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => jo(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function fc(e, t) {
	return new dc({
		type: "nonoptional",
		innerType: e,
		...x(t)
	});
}
var pc = /*@__PURE__*/ w("ZodCatch", (e, t) => {
	ri.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => Io(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function mc(e, t) {
	return new pc({
		type: "catch",
		innerType: e,
		catchValue: typeof t == "function" ? t : Xe(t)
	});
}
var hc = /*@__PURE__*/ w("ZodPipe", (e, t) => {
	ii.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => Lo(e, t, n, r), e.in = t.in, e.out = t.out;
});
function gc(e, t) {
	return new hc({
		type: "pipe",
		in: e,
		out: t
	});
}
var _c = /*@__PURE__*/ w("ZodReadonly", (e, t) => {
	oi.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ro(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function vc(e) {
	return new _c({
		type: "readonly",
		innerType: e
	});
}
var yc = /*@__PURE__*/ w("ZodCustom", (e, t) => {
	ci.init(e, t), ns.init(e, t), e._zod.processJSONSchema = (t, n, r) => yo(e, t, n, r);
});
function bc(e, t = {}) {
	return /* @__PURE__ */ Ma(yc, e, t);
}
function xc(e, t) {
	return /* @__PURE__ */ Na(e, t);
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/iso.js
function Sc(e) {
	return /* @__PURE__ */ ra(os, e);
}
//#endregion
//#region src/island/zod-config.ts
it({ jitless: !0 });
//#endregion
//#region node_modules/.pnpm/scheduler@0.28.0/node_modules/scheduler/cjs/scheduler.production.js
var Cc = /* @__PURE__ */ c(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function ee(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function te(e) {
		if (h = !1, ee(e), !m) {
			if (n(c) !== null) m = !0, ne || (ne = !0, se());
			else {
				var t = n(l);
				t !== null && ue(te, t.startTime - e);
			}
		}
	}
	var ne = !1, re = -1, b = 5, ie = -1;
	function ae() {
		return g ? !0 : !(e.unstable_now() - ie < b);
	}
	function oe() {
		if (g = !1, ne) {
			var t = e.unstable_now();
			ie = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(re), re = -1), p = !0;
					var a = f;
					try {
						b: {
							for (ee(t), d = n(c); d !== null && !(d.expirationTime > t && ae());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, ee(t), i = !0;
										break b;
									}
									d === n(c) && r(c), ee(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && ue(te, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? se() : ne = !1;
			}
		}
	}
	var se;
	if (typeof y == "function") se = function() {
		y(oe);
	};
	else if (typeof MessageChannel < "u") {
		var ce = new MessageChannel(), le = ce.port2;
		ce.port1.onmessage = oe, se = function() {
			le.postMessage(null);
		};
	} else se = function() {
		_(oe, 0);
	};
	function ue(t, n) {
		re = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : b = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(re), re = -1) : h = !0, ue(te, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, ne || (ne = !0, se()))), r;
	}, e.unstable_shouldYield = ae, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), wc = /* @__PURE__ */ c(((e, t) => {
	t.exports = Cc();
})), Tc = /* @__PURE__ */ c(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.for("react.view_transition"), m = Symbol.iterator;
	function h(e) {
		return typeof e != "object" || !e ? null : (e = m && e[m] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var g = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, _ = Object.assign, v = {};
	function y(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, y.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function ee() {}
	ee.prototype = y.prototype;
	function te(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var ne = te.prototype = new ee();
	ne.constructor = te, _(ne, y.prototype), ne.isPureReactComponent = !0;
	var re = Array.isArray;
	function b() {}
	var ie = {
		H: null,
		A: null,
		T: null,
		S: null
	}, ae = Object.prototype.hasOwnProperty;
	function oe(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function se(e, t) {
		return oe(e.type, t, e.props);
	}
	function ce(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function le(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var ue = /\/+/g;
	function de(e, t) {
		return typeof e == "object" && e && e.key != null ? le("" + e.key) : t.toString(36);
	}
	function fe(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(b, b) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function pe(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, pe(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + de(e, 0) : a, re(o) ? (i = "", c != null && (i = c.replace(ue, "$&/") + "/"), pe(o, r, i, "", function(e) {
			return e;
		})) : o != null && (ce(o) && (o = se(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(ue, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (re(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + de(a, u), c += pe(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + de(a, u++), c += pe(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return pe(fe(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function me(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return pe(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function he(e) {
		if (e._status === -1) {
			var t = e._result, n = t();
			n.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t, n.status === void 0 && (n.status = "fulfilled", n.value = t));
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t, n.status === void 0 && (n.status = "rejected", n.reason = t));
			}), e._status === -1 && (e._status = 0, e._result = n);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var x = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	};
	function ge(e) {
		var t = ie.T, n = {};
		n.types = t === null ? null : t.types, ie.T = n;
		try {
			var r = e(), i = ie.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(b, x);
		} catch (e) {
			x(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), ie.T = t;
		}
	}
	function _e(e) {
		var t = ie.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else ge(_e.bind(null, e));
	}
	var ve = {
		map: me,
		forEach: function(e, t, n) {
			me(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return me(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return me(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!ce(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = ve, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = te, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ie, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return ie.H.useMemoCache(e);
		}
	}, e.addTransitionType = _e, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !ae.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return oe(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) ae.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return oe(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = ce, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: he
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = ge, e.unstable_useCacheRefresh = function() {
		return ie.H.useCacheRefresh();
	}, e.use = function(e) {
		return ie.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return ie.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return ie.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return ie.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return ie.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return ie.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return ie.H.useEffectEvent(e);
	}, e.useId = function() {
		return ie.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return ie.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return ie.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return ie.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return ie.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return ie.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return ie.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return ie.H.useRef(e);
	}, e.useState = function(e) {
		return ie.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return ie.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return ie.H.useTransition();
	}, e.version = "19.3.0";
})), Ec = /* @__PURE__ */ c(((e, t) => {
	t.exports = Tc();
})), Dc = /* @__PURE__ */ c(((e) => {
	var t = Ec();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal"), o = Symbol.for("react.recoverable"), s = Symbol.for("react.optimistic_key");
	function c(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : r === s ? s : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var l = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function u(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.browser = function(e) {
		return {
			$$typeof: o,
			_reason: e
		};
	}, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return c(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = l.T, n = i.p;
		try {
			if (l.T = null, i.p = 2, e) return e();
		} finally {
			l.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = u(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = u(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0,
						fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = u(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = u(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return l.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return l.H.useHostTransitionStatus();
	}, e.version = "19.3.0";
})), Oc = /* @__PURE__ */ c(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = Dc();
})), kc = /* @__PURE__ */ c(((e) => {
	var t = wc(), n = Ec(), r = Oc();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		for (var t = e, n = t; n && !n.alternate;) t = n, t.flags & 4098 && (e = t.return), n = t.return;
		for (; t.return;) t = t.return;
		return t.tag === 3 ? e : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function u(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function d(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = d(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	function f(e, t, n, r, i, a) {
		for (; e !== null;) {
			if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && f(e.child, t, n, r, i, a)) return !0;
			e = e.sibling;
		}
		return !1;
	}
	function p(e) {
		for (e = e.return; e !== null;) {
			if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
			e = e.return;
		}
		return null;
	}
	function m(e) {
		var t = !1;
		for (e = e.return; e !== null && (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);) e = e.return;
		return t;
	}
	function h(e) {
		var t = [null, null], n = p(e);
		return n === null || g(t, e, n.child, { foundSelf: !1 }), t;
	}
	function g(e, t, n, r) {
		for (; n !== null;) {
			if (n === t) r.foundSelf = !0;
			else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
				if (r.foundSelf) return e[1] = n, !0;
				e[0] = n;
			} else if ((n.tag !== 22 || n.memoizedState === null) && g(e, t, n.child, r)) return !0;
			n = n.sibling;
		}
		return !1;
	}
	function _(e) {
		switch (e.tag) {
			case 5:
			case 27:
			case 6: return e.stateNode;
			case 3: return e.stateNode.containerInfo;
			default: throw Error(i(559));
		}
	}
	var v = null, y = null;
	function ee(e, t, n) {
		return e === n || e === t && (v = e, !0);
	}
	function te(e, t, n) {
		return e === n ? (y = e, !1) : e === t && (y !== null && (v = e), !0);
	}
	function ne(e) {
		if (e === null) return null;
		do
			e = e === null ? null : e.return;
		while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
		return e || null;
	}
	function re(e, t, n) {
		for (var r = 0, i = e; i; i = n(i)) r++;
		i = 0;
		for (var a = t; a; a = n(a)) i++;
		for (; 0 < r - i;) e = n(e), r--;
		for (; 0 < i - r;) t = n(t), i--;
		for (; r--;) {
			if (e === t || t !== null && e === t.alternate) return e;
			e = n(e), t = n(t);
		}
		return null;
	}
	var b = Object.assign, ie = Symbol.for("react.element"), ae = Symbol.for("react.transitional.element"), oe = Symbol.for("react.portal"), se = Symbol.for("react.fragment"), ce = Symbol.for("react.strict_mode"), le = Symbol.for("react.profiler"), ue = Symbol.for("react.consumer"), de = Symbol.for("react.context"), fe = Symbol.for("react.forward_ref"), pe = Symbol.for("react.suspense"), me = Symbol.for("react.suspense_list"), he = Symbol.for("react.memo"), x = Symbol.for("react.lazy"), ge = Symbol.for("react.activity"), _e = Symbol.for("react.legacy_hidden"), ve = Symbol.for("react.memo_cache_sentinel"), ye = Symbol.for("react.view_transition"), be = Symbol.for("react.recoverable"), xe = Symbol.iterator;
	function Se(e) {
		return typeof e != "object" || !e ? null : (e = xe && e[xe] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var Ce = Symbol.for("react.client.reference");
	function we(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === Ce ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case se: return "Fragment";
			case le: return "Profiler";
			case ce: return "StrictMode";
			case pe: return "Suspense";
			case me: return "SuspenseList";
			case ge: return "Activity";
			case ye: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case oe: return "Portal";
			case de: return e.displayName || "Context";
			case ue: return (e._context.displayName || "Context") + ".Consumer";
			case fe:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case he: return t = e.displayName || null, t === null ? we(e.type) || "Memo" : t;
			case x:
				t = e._payload, e = e._init;
				try {
					return we(e(t));
				} catch {}
		}
		return null;
	}
	var Te = Array.isArray, S = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Ee = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, De = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, Oe = [], ke = -1;
	function Ae(e) {
		return { current: e };
	}
	function je(e) {
		0 > ke || (e.current = Oe[ke], Oe[ke] = null, ke--);
	}
	function Me(e, t) {
		ke++, Oe[ke] = e.current, e.current = t;
	}
	var Ne = Ae(null), Pe = Ae(null), Fe = Ae(null), Ie = Ae(null);
	function Le(e, t) {
		switch (Me(Fe, t), Me(Pe, e), Me(Ne, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? Tp(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = Tp(t), e = Ep(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		je(Ne), Me(Ne, e);
	}
	function Re() {
		je(Ne), je(Pe), je(Fe);
	}
	function ze(e) {
		var t = e.memoizedState;
		t !== null && (mh._currentValue = t.memoizedState, Me(Ie, e)), t = Ne.current;
		var n = Ep(t, e.type);
		t !== n && (Me(Pe, e), Me(Ne, n));
	}
	function Be(e) {
		Pe.current === e && (je(Ne), je(Pe)), Ie.current === e && (je(Ie), mh._currentValue = De);
	}
	var Ve, He;
	function Ue(e) {
		if (Ve === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Ve = t && t[1] || "", He = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Ve + e + He;
	}
	var We = !1;
	function Ge(e, t) {
		if (!e || We) return "";
		We = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							n = !1;
							try {
								var i = Object.getOwnPropertyDescriptor(e.prototype, "props");
								Object.defineProperty(e.prototype, "props", {
									configurable: !0,
									set: function() {
										throw Error();
									}
								}), n = !0, new e();
							} finally {
								n && (i === void 0 ? delete e.prototype.props : Object.defineProperty(e.prototype, "props", i));
							}
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			We = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Ue(n) : "";
	}
	function Ke(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Ue(e.type);
			case 16: return Ue("Lazy");
			case 13: return e.child !== t && t !== null ? Ue("Suspense Fallback") : Ue("Suspense");
			case 19: return Ue("SuspenseList");
			case 0:
			case 15: return Ge(e.type, !1);
			case 11: return Ge(e.type.render, !1);
			case 1: return Ge(e.type, !0);
			case 31: return Ue("Activity");
			case 30: return Ue("ViewTransition");
			default: return "";
		}
	}
	function qe(e) {
		try {
			var t = "", n = null;
			do
				t += Ke(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var C = Object.prototype.hasOwnProperty, Je = t.unstable_scheduleCallback, Ye = t.unstable_cancelCallback, Xe = t.unstable_shouldYield, Ze = t.unstable_requestPaint, Qe = t.unstable_now, $e = t.unstable_getCurrentPriorityLevel, et = t.unstable_ImmediatePriority, w = t.unstable_UserBlockingPriority, tt = t.unstable_NormalPriority, nt = t.unstable_LowPriority, rt = t.unstable_IdlePriority, it = t.log, at = t.unstable_setDisableYieldValue, ot = null, st = null;
	function ct(e) {
		if (typeof it == "function" && at(e), st && typeof st.setStrictMode == "function") try {
			st.setStrictMode(ot, e);
		} catch {}
	}
	var lt = Math.clz32 ? Math.clz32 : ft, ut = Math.log, dt = Math.LN2;
	function ft(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (ut(e) / dt | 0) | 0;
	}
	var pt = 256, mt = 262144, ht = 4194304;
	function gt(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & -e;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function _t(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = gt(n))) : i = gt(o) : i = gt(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = gt(n))) : i = gt(o)) : i = gt(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function vt(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function yt(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - lt(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function bt(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function xt() {
		var e = ht;
		return ht <<= 1, !(ht & 62914560) && (ht = 4194304), e;
	}
	function St(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function Ct(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function wt(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - lt(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && Tt(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function Tt(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - lt(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function Et(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - lt(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function Dt(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : Ot(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function Ot(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function kt(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function At() {
		var e = Ee.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Ah(e.type)) : e;
	}
	function jt(e, t) {
		var n = Ee.p;
		try {
			return Ee.p = e, t();
		} finally {
			Ee.p = n;
		}
	}
	var Mt = Math.random().toString(36).slice(2), Nt = "__reactFiber$" + Mt, Pt = "__reactProps$" + Mt, Ft = "__reactContainer$" + Mt, It = "__reactEvents$" + Mt, Lt = "__reactListeners$" + Mt, Rt = "__reactHandles$" + Mt, zt = "__reactResources$" + Mt, Bt = "__reactMarker$" + Mt, Vt = "__reactLoad$" + Mt;
	function Ht(e) {
		delete e[Nt], delete e[Pt], delete e[Lt], delete e[Rt];
	}
	function Ut(e) {
		var t;
		if (t = e[Nt]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[Ft] || n[Nt]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = Dm(e); e !== null;) {
					if (n = e[Nt]) return n;
					e = Dm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Wt(e) {
		if (e = e[Nt] || e[Ft]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Gt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Kt(e) {
		var t = e[zt];
		return t ||= e[zt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function qt(e) {
		e[Bt] = !0;
	}
	function Jt(e) {
		e[Vt] = void 0;
	}
	var Yt = /* @__PURE__ */ new Set(), Xt = {};
	function Zt(e, t) {
		Qt(e, t), Qt(e + "Capture", t);
	}
	function Qt(e, t) {
		for (Xt[e] = t, e = 0; e < t.length; e++) Yt.add(t[e]);
	}
	var $t = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), en = {}, tn = {};
	function nn(e) {
		return C.call(tn, e) ? !0 : C.call(en, e) ? !1 : $t.test(e) ? tn[e] = !0 : (en[e] = !0, !1);
	}
	var rn = !1;
	function an() {
		var e = rn;
		return rn = !1, e;
	}
	function on(e, t, n) {
		if (nn(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, n);
			}
		}
	}
	function sn(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, n);
		}
	}
	function cn(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, r);
		}
	}
	function ln(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function un(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function dn(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function fn(e) {
		if (!e._valueTracker) {
			var t = un(e) ? "checked" : "value";
			e._valueTracker = dn(e, t, "" + e[t]);
		}
	}
	function pn(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = un(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var mn = /[\n"\\]/g;
	function hn(e) {
		return e.replace(mn, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function gn(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + ln(t)) : e.value !== "" + ln(t) && (e.value = "" + ln(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : vn(e, ln(n)) : o === "number" && e.value == t ? vn(e, ln(e.value)) : vn(e, ln(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + ln(s) : e.removeAttribute("name");
	}
	function _n(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				fn(e);
				return;
			}
			n = n == null ? "" : "" + ln(n), t = t == null ? n : "" + ln(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), fn(e);
	}
	function vn(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function yn(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + ln(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function bn(e, t, n) {
		t != null && (t = "" + ln(t), t !== e.value && (e.value = t), n == null) ? e.defaultValue !== t && (e.defaultValue = t) : e.defaultValue = n == null ? "" : "" + ln(n);
	}
	function xn(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (Te(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = ln(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), fn(e);
	}
	function Sn(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var Cn = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function wn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || Cn.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function Tn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", rn = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (wn(e, a, r), rn = !0);
		} else for (var o in t) t.hasOwnProperty(o) && wn(e, o, t[o]);
	}
	function En(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var Dn = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["maskType", "mask-type"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), On = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function kn(e) {
		return On.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function An() {}
	var jn = null;
	function Mn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var Nn = null, Pn = null;
	function Fn(e) {
		var t = Wt(e);
		if (t && (e = t.stateNode)) {
			var n = e[Pt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (gn(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + hn("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[Pt] || null;
								if (!a) throw Error(i(90));
								gn(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && pn(r);
					}
					break a;
				case "textarea":
					bn(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && yn(e, !!n.multiple, t, !1);
			}
		}
	}
	var In = !1;
	function Ln(e, t, n) {
		if (In) return e(t, n);
		In = !0;
		try {
			return e(t);
		} finally {
			if (In = !1, (Nn !== null || Pn !== null) && (Qd(), Nn && (t = Nn, e = Pn, Pn = Nn = null, Fn(t), e))) for (t = 0; t < e.length; t++) Fn(e[t]);
		}
	}
	function Rn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[Pt] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var T = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, zn = !1;
	if (T) try {
		var Bn = {};
		Object.defineProperty(Bn, "passive", { get: function() {
			zn = !0;
		} }), window.addEventListener("test", Bn, Bn), window.removeEventListener("test", Bn, Bn);
	} catch {
		zn = !1;
	}
	var Vn = null, Hn = null, Un = null;
	function Wn() {
		if (Un) return Un;
		var e, t = Hn, n = t.length, r, i = "value" in Vn ? Vn.value : Vn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Un = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function Gn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Kn() {
		return !0;
	}
	function qn() {
		return !1;
	}
	function Jn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Kn : qn, this.isPropagationStopped = qn, this;
		}
		return b(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Kn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Kn);
			},
			persist: function() {},
			isPersistent: Kn
		}), t;
	}
	var Yn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Xn = Jn(Yn), Zn = b({}, Yn, {
		view: 0,
		detail: 0
	}), Qn = Jn(Zn), $n, er, tr, nr = b({}, Zn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: pr,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== tr && (tr && e.type === "mousemove" ? ($n = e.screenX - tr.screenX, er = e.screenY - tr.screenY) : er = $n = 0, tr = e), $n);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : er;
		}
	}), rr = Jn(nr), ir = Jn(b({}, nr, { dataTransfer: 0 })), ar = Jn(b({}, Zn, { relatedTarget: 0 })), or = Jn(b({}, Yn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), sr = Jn(b({}, Yn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), cr = Jn(b({}, Yn, { data: 0 })), lr = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, ur = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, dr = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function fr(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = dr[e]) ? !!t[e] : !1;
	}
	function pr() {
		return fr;
	}
	var mr = Jn(b({}, Zn, {
		key: function(e) {
			if (e.key) {
				var t = lr[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = Gn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? ur[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: pr,
		charCode: function(e) {
			return e.type === "keypress" ? Gn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? Gn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), hr = Jn(b({}, nr, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), gr = Jn(b({}, Yn, { submitter: 0 })), _r = Jn(b({}, Zn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: pr
	})), vr = Jn(b({}, Yn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), yr = Jn(b({}, nr, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), br = Jn(b({}, Yn, {
		newState: 0,
		oldState: 0,
		source: 0
	})), xr = [
		9,
		13,
		27,
		32
	], Sr = T && "CompositionEvent" in window, Cr = null;
	T && "documentMode" in document && (Cr = document.documentMode);
	var wr = T && "TextEvent" in window && !Cr, Tr = T && (!Sr || Cr && 8 < Cr && 11 >= Cr), Er = " ", Dr = !1;
	function Or(e, t) {
		switch (e) {
			case "keyup": return xr.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function kr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var Ar = !1;
	function jr(e, t) {
		switch (e) {
			case "compositionend": return kr(t);
			case "keypress": return t.which === 32 ? (Dr = !0, Er) : null;
			case "textInput": return e = t.data, e === Er && Dr ? null : e;
			default: return null;
		}
	}
	function Mr(e, t) {
		if (Ar) return e === "compositionend" || !Sr && Or(e, t) ? (e = Wn(), Un = Hn = Vn = null, Ar = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return Tr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var Nr = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function Pr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!Nr[e.type] : t === "textarea";
	}
	function Fr(e, t, n, r) {
		Nn ? Pn ? Pn.push(r) : Pn = [r] : Nn = r, t = cp(t, "onChange"), 0 < t.length && (n = new Xn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var Ir = null, Lr = null;
	function Rr(e) {
		tp(e, 0);
	}
	function zr(e) {
		if (pn(Gt(e))) return e;
	}
	function Br(e, t) {
		if (e === "change") return t;
	}
	var Vr = !1;
	if (T) {
		var Hr;
		if (T) {
			var Ur = "oninput" in document;
			if (!Ur) {
				var Wr = document.createElement("div");
				Wr.setAttribute("oninput", "return;"), Ur = typeof Wr.oninput == "function";
			}
			Hr = Ur;
		} else Hr = !1;
		Vr = Hr && (!document.documentMode || 9 < document.documentMode);
	}
	function Gr() {
		Ir && (Ir.detachEvent("onpropertychange", Kr), Lr = Ir = null);
	}
	function Kr(e) {
		if (e.propertyName === "value" && zr(Lr)) {
			var t = [];
			Fr(t, Lr, e, Mn(e)), Ln(Rr, t);
		}
	}
	function qr(e, t, n) {
		e === "focusin" ? (Gr(), Ir = t, Lr = n, Ir.attachEvent("onpropertychange", Kr)) : e === "focusout" && Gr();
	}
	function Jr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return zr(Lr);
	}
	function Yr(e, t) {
		if (e === "click") return zr(t);
	}
	function Xr(e, t) {
		if (e === "input" || e === "change") return zr(t);
	}
	function Zr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Qr = typeof Object.is == "function" ? Object.is : Zr;
	function $r(e, t) {
		if (Qr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!C.call(t, i) || !Qr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function ei(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function ti(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function ni(e, t) {
		var n = ti(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = ti(n);
		}
	}
	function ri(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? ri(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function ii(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = ei(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = ei(e.document);
		}
		return t;
	}
	function ai(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var oi = T && "documentMode" in document && 11 >= document.documentMode, si = null, ci = null, li = null, ui = !1;
	function di(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		ui || si == null || si !== ei(r) || (r = si, "selectionStart" in r && ai(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), li && $r(li, r) || (li = r, r = cp(ci, "onSelect"), 0 < r.length && (t = new Xn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = si)));
	}
	function fi(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var pi = {
		animationend: fi("Animation", "AnimationEnd"),
		animationiteration: fi("Animation", "AnimationIteration"),
		animationstart: fi("Animation", "AnimationStart"),
		transitionrun: fi("Transition", "TransitionRun"),
		transitionstart: fi("Transition", "TransitionStart"),
		transitioncancel: fi("Transition", "TransitionCancel"),
		transitionend: fi("Transition", "TransitionEnd")
	}, mi = {}, hi = {};
	T && (hi = document.createElement("div").style, "AnimationEvent" in window || (delete pi.animationend.animation, delete pi.animationiteration.animation, delete pi.animationstart.animation), "TransitionEvent" in window || delete pi.transitionend.transition);
	function gi(e) {
		if (mi[e]) return mi[e];
		if (!pi[e]) return e;
		var t = pi[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in hi) return mi[e] = t[n];
		return e;
	}
	var _i = gi("animationend"), vi = gi("animationiteration"), yi = gi("animationstart"), bi = gi("transitionrun"), xi = gi("transitionstart"), Si = gi("transitioncancel"), Ci = gi("transitionend"), wi = /* @__PURE__ */ new Map(), Ti = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	Ti.push("scrollEnd");
	function Ei(e, t) {
		wi.set(e, t), Zt(t, [e]);
	}
	var Di = 0;
	function Oi(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = Nd.identifierPrefix;
		var n = Di++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function ki(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = Vd;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function Ai(e, t) {
		return e = ki(e), t = ki(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var ji = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, Mi = [], Ni = 0, Pi = 0;
	function Fi() {
		for (var e = Ni, t = Pi = Ni = 0; t < e;) {
			var n = Mi[t];
			Mi[t++] = null;
			var r = Mi[t];
			Mi[t++] = null;
			var i = Mi[t];
			Mi[t++] = null;
			var a = Mi[t];
			if (Mi[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && zi(n, i, a);
		}
	}
	function Ii(e, t, n, r) {
		Mi[Ni++] = e, Mi[Ni++] = t, Mi[Ni++] = n, Mi[Ni++] = r, Pi |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function Li(e, t, n, r) {
		return Ii(e, t, n, r), Bi(e);
	}
	function Ri(e, t) {
		return Ii(e, null, null, t), Bi(e);
	}
	function zi(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - lt(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function Bi(e) {
		if (50 < Hd) throw Hd = 0, Ud = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var Vi = {};
	function Hi(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function Ui(e, t, n, r) {
		return new Hi(e, t, n, r);
	}
	function Wi(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function Gi(e, t) {
		var n = e.alternate;
		return n === null ? (n = Ui(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Ki(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function qi(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") Wi(r) && (s = 1);
		else if (typeof r == "string") s = nh(e, n, Ne.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case ge: return e = Ui(31, n, t, a), e.elementType = ge, e.lanes = o, e;
			case se: return Ji(n.children, a, o, t);
			case ce:
				s = 8, a |= 24;
				break;
			case le: return e = Ui(12, n, t, a | 2), e.elementType = le, e.lanes = o, e;
			case pe: return e = Ui(13, n, t, a), e.elementType = pe, e.lanes = o, e;
			case me: return e = Ui(19, n, t, a), e.elementType = me, e.lanes = o, e;
			case _e:
			case ye: return e = a | 32, e = Ui(30, n, t, e), e.elementType = ye, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case de:
						s = 10;
						break a;
					case ue:
						s = 9;
						break a;
					case fe:
						s = 11;
						break a;
					case he:
						s = 14;
						break a;
					case x:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = Ui(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function Ji(e, t, n, r) {
		return e = Ui(7, e, r, t), e.lanes = n, e;
	}
	function Yi(e, t, n) {
		return e = Ui(6, e, null, t), e.lanes = n, e;
	}
	function Xi(e) {
		var t = Ui(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Zi(e, t, n) {
		return t = Ui(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Qi = /* @__PURE__ */ new WeakMap();
	function $i(e, t) {
		if (typeof e == "object" && e) {
			var n = Qi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: qe(t)
			}, Qi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: qe(t)
		};
	}
	var ea = [], ta = 0, na = null, ra = 0, ia = [], aa = 0, oa = null, sa = 1, ca = "";
	function la(e, t) {
		ea[ta++] = ra, ea[ta++] = na, na = e, ra = t;
	}
	function ua(e, t, n) {
		ia[aa++] = sa, ia[aa++] = ca, ia[aa++] = oa, oa = e;
		var r = sa;
		e = ca;
		var i = 32 - lt(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - lt(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, sa = 1 << 32 - lt(t) + i | n << i | r, ca = a + e;
		} else sa = 1 << a | n << i | r, ca = e;
	}
	function da(e) {
		e.return !== null && (la(e, 1), ua(e, 1, 0));
	}
	function fa(e) {
		for (; e === na;) na = ea[--ta], ea[ta] = null, ra = ea[--ta], ea[ta] = null;
		for (; e === oa;) oa = ia[--aa], ia[aa] = null, ca = ia[--aa], ia[aa] = null, sa = ia[--aa], ia[aa] = null;
	}
	function pa(e, t) {
		ia[aa++] = sa, ia[aa++] = ca, ia[aa++] = oa, sa = t.id, ca = t.overflow, oa = e;
	}
	var ma = null, ha = null, E = !1, ga = null, _a = !1, va = Error(i(519));
	function ya(e) {
		throw Ta($i(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), va;
	}
	function ba(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[Nt] = e, t[Pt] = r, n) {
			case "dialog":
				R("cancel", t), R("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				R("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < $f.length; n++) R($f[n], t);
				break;
			case "source":
				R("error", t);
				break;
			case "img":
			case "image":
			case "link":
				R("error", t), R("load", t);
				break;
			case "details":
				R("toggle", t);
				break;
			case "input":
				R("invalid", t), _n(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				R("invalid", t);
				break;
			case "textarea": R("invalid", t), xn(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || mp(t.textContent, n) ? (r.popover != null && (R("beforetoggle", t), R("toggle", t)), r.onScroll != null && R("scroll", t), r.onScrollEnd != null && R("scrollend", t), r.onClick != null && (t.onclick = An), t = !0) : t = !1, t || ya(e, !0);
	}
	function xa(e) {
		for (ma = e.return; ma;) switch (ma.tag) {
			case 5:
			case 31:
			case 13:
				_a = !1;
				return;
			case 27:
			case 3:
				_a = !0;
				return;
			default: ma = ma.return;
		}
	}
	function Sa(e) {
		if (e !== ma) return !1;
		if (!E) return xa(e), E = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || Op(e.type, e.memoizedProps)), n = !n), n && ha && ya(e), xa(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			ha = Em(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			ha = Em(e);
		} else t === 27 ? (t = ha, Lp(e.type) ? (e = Tm, Tm = null, ha = e) : ha = t) : ha = ma ? wm(e.stateNode.nextSibling) : null;
		return !0;
	}
	function Ca() {
		ha = ma = null, E = !1;
	}
	function wa() {
		var e = ga;
		return e !== null && (Td === null ? Td = e : Td.push.apply(Td, e), ga = null), e;
	}
	function Ta(e) {
		ga === null ? ga = [e] : ga.push(e);
	}
	var Ea = Ae(null), Da = null, Oa = null;
	function ka(e, t, n) {
		Me(Ea, t._currentValue), t._currentValue = n;
	}
	function Aa(e) {
		e._currentValue = Ea.current, je(Ea);
	}
	function ja(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function Ma(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), ja(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), ja(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), ja(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function Na(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					Qr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === Ie.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [mh] : e.push(mh));
			}
			a = a.return;
		}
		return e !== null && Ma(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function Pa(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Qr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function Fa(e) {
		Da = e, Oa = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function Ia(e) {
		return Ra(Da, e);
	}
	function La(e, t) {
		return Da === null && Fa(e), Ra(e, t);
	}
	function Ra(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, Oa === null) {
			if (e === null) throw Error(i(308));
			Oa = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else Oa = Oa.next = t;
		return n;
	}
	var za = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, Ba = t.unstable_scheduleCallback, Va = t.unstable_NormalPriority, Ha = {
		$$typeof: de,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function Ua() {
		return {
			controller: new za(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function Wa(e) {
		e.refCount--, e.refCount === 0 && Ba(Va, function() {
			e.controller.abort();
		});
	}
	function Ga(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var Ka = null;
	function qa(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var Ja = null, Ya = 0, Xa = 0, Za = null;
	function Qa(e, t) {
		if (Ja === null) {
			var n = Ja = [];
			Ya = 0, Xa = Jf(), Za = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return Ya++, t.then($a, $a), t;
	}
	function $a() {
		if (--Ya === 0 && (Ka = null, Ja !== null)) {
			Za !== null && (Za.status = "fulfilled");
			var e = Ja;
			Ja = null, Xa = 0, Za = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function eo(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var to = S.S;
	S.S = function(e, t) {
		if (Od = Qe(), typeof t == "object" && t && typeof t.then == "function" && Qa(e, t), Ka !== null) for (var n = Pf; n !== null;) Ga(n, Ka), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = Pf; r !== null;) Ga(r, n), r = r.next;
			if (Xa !== 0) {
				r = Ka, r === null && (r = Ka = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		to !== null && to(e, t);
	};
	var no = Ae(null);
	function ro() {
		var e = no.current;
		return e === null ? dd.pooledCache : e;
	}
	function io(e, t) {
		t === null ? Me(no, no.current) : Me(no, t.pool);
	}
	function ao() {
		var e = ro();
		return e === null ? null : {
			parent: Ha._currentValue,
			pool: e
		};
	}
	var oo = Error(i(460)), so = Error(i(474)), co = Error(i(542)), lo = { then: function() {} };
	function uo(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function fo(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(An, An), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, go(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(An, An);
				else {
					if (e = dd, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, go(e), e;
				}
				throw mo = t, oo;
		}
	}
	function po(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (mo = e, oo) : e;
		}
	}
	var mo = null;
	function ho() {
		if (mo === null) throw Error(i(459));
		var e = mo;
		return mo = null, e;
	}
	function go(e) {
		if (e === oo || e === co) throw Error(i(483));
	}
	var _o = null, vo = 0;
	function yo(e) {
		var t = vo;
		return vo += 1, _o === null && (_o = []), fo(_o, e, t);
	}
	function bo(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function xo(e, t) {
		throw t.$$typeof === ie ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function So(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = Gi(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = Yi(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === se ? (e = d(e, t, n.props.children, r, n.key), bo(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === x && po(i) === t.type) ? (t = a(t, n.props), bo(t, n), t.return = e, t) : (t = qi(n.type, n.key, n.props, null, e.mode, r), bo(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Zi(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = Ji(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Yi("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case ae: return n = qi(t.type, t.key, t.props, null, e.mode, n), bo(n, t), n.return = e, n;
					case oe: return t = Zi(t, e.mode, n), t.return = e, t;
					case x: return t = po(t), f(e, t, n);
				}
				if (Te(t) || Se(t)) return t = Ji(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, yo(t), n);
				if (t.$$typeof === de) return f(e, La(e, t), n);
				xo(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case ae: return n.key === i ? l(e, t, n, r) : null;
					case oe: return n.key === i ? u(e, t, n, r) : null;
					case x: return n = po(n), p(e, t, n, r);
				}
				if (Te(n) || Se(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, yo(n), r);
				if (n.$$typeof === de) return p(e, t, La(e, n), r);
				xo(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case ae: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case oe: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case x: return r = po(r), m(e, t, n, r, i);
				}
				if (Te(r) || Se(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, yo(r), i);
				if (r.$$typeof === de) return m(e, t, n, La(t, r), i);
				xo(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), E && la(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return E && la(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), E && la(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), E && la(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return E && la(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), E && la(a, g), u;
		}
		function _(e, r, o, c) {
			if (typeof o == "object" && o && o.type === se && o.key === null && o.props.ref === void 0 && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case ae:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === se) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), bo(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === x && po(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), bo(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === se ? (c = Ji(o.props.children, e.mode, c, o.key), bo(c, o), c.return = e, e = c) : (c = qi(o.type, o.key, o.props, null, e.mode, c), bo(c, o), c.return = e, e = c);
						}
						return s(e);
					case oe:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = Zi(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case x: return o = po(o), _(e, r, o, c);
				}
				if (Te(o)) return h(e, r, o, c);
				if (Se(o)) {
					if (l = Se(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, yo(o), c);
				if (o.$$typeof === de) return _(e, r, La(e, o), c);
				xo(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = Yi(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				vo = 0;
				var i = _(e, t, n, r);
				return _o = null, i;
			} catch (t) {
				if (t === oo || t === co) throw t;
				var a = Ui(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var Co = So(!0), wo = So(!1), To = !1;
	function Eo(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function Do(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function Oo(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function ko(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, ud & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = Bi(e), zi(e, null, n), t;
		}
		return Ii(e, r, t, n), Bi(e);
	}
	function Ao(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, Et(e, n);
		}
	}
	function jo(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
		} else e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var Mo = !1;
	function No() {
		if (Mo) {
			var e = Za;
			if (e !== null) throw e;
		}
	}
	function Po(e, t, n, r) {
		Mo = !1;
		var i = e.updateQueue;
		To = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (L & f) === f : (r & f) === f) {
					f !== 0 && f === Xa && (Mo = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, h = s;
						f = t;
						var g = n;
						switch (h.tag) {
							case 1:
								if (m = h.payload, typeof m == "function") {
									d = m.call(g, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = h.payload, f = typeof m == "function" ? m.call(g, d, f) : m, f == null) break a;
								d = b({}, d, f);
								break a;
							case 2: To = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), yd |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function Fo(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function Io(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Fo(n[e], t);
	}
	var Lo = Ae(null), Ro = Ae(0);
	function zo(e, t) {
		e = _d, Me(Ro, e), Me(Lo, t), _d = e | t.baseLanes;
	}
	function Bo() {
		Me(Ro, _d), Me(Lo, Lo.current);
	}
	function Vo() {
		_d = Ro.current, je(Lo), je(Ro);
	}
	var Ho = Ae(null), Uo = null;
	function Wo(e) {
		var t = e.alternate;
		Me(Yo, Yo.current & 1), Me(Ho, e), Uo === null && (t === null || Lo.current !== null || t.memoizedState !== null) && (Uo = e);
	}
	function Go(e) {
		Me(Yo, Yo.current), Me(Ho, e), Uo === null && (Uo = e);
	}
	function Ko(e) {
		e.tag === 22 ? (Me(Yo, Yo.current), Me(Ho, e), Uo === null && (Uo = e)) : qo();
	}
	function qo() {
		Me(Yo, Yo.current), Me(Ho, Ho.current);
	}
	function Jo(e) {
		je(Ho), Uo === e && (Uo = null), je(Yo);
	}
	var Yo = Ae(0);
	function Xo(e, t) {
		Me(Ho, Ho.current), Me(Yo, t);
	}
	function Zo(e) {
		je(Yo), je(Ho), Uo === e && (Uo = null);
	}
	function Qo(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || xm(n) || Sm(n))) return t;
			} else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var $o = 0, D = null, es = null, ts = null, ns = !1, rs = !1, is = !1, O = 0, as = 0, os = null, ss = 0;
	function cs() {
		throw Error(i(321));
	}
	function ls(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Qr(e[n], t[n])) return !1;
		return !0;
	}
	function us(e, t, n, r, i, a) {
		return $o = a, D = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, S.H = e === null || e.memoizedState === null ? Tc : Dc, is = !1, a = n(r, i), is = !1, rs && (a = fs(t, n, r, i)), ds(e), a;
	}
	function ds(e) {
		S.H = Cc;
		var t = es !== null && es.next !== null;
		if ($o = 0, ts = es = D = null, ns = !1, as = 0, os = null, t) throw Error(i(300));
		e === null || Wc || (e = e.dependencies, e !== null && Pa(e) && (Wc = !0));
	}
	function fs(e, t, n, r) {
		D = e;
		var a = 0;
		do {
			if (rs && (os = null), as = 0, rs = !1, 25 <= a) throw Error(i(301));
			if (a += 1, ts = es = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			S.H = kc, o = t(n, r);
		} while (rs);
		return o;
	}
	function ps() {
		var e = S.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? bs(t) : t, e = e.useState()[0], (es === null ? null : es.memoizedState) !== e && (D.flags |= 1024), t;
	}
	function ms() {
		var e = O !== 0;
		return O = 0, e;
	}
	function hs(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function gs(e) {
		if (ns) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			ns = !1;
		}
		$o = 0, ts = es = D = null, rs = !1, as = O = 0, os = null;
	}
	function _s() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return ts === null ? D.memoizedState = ts = e : ts = ts.next = e, ts;
	}
	function vs() {
		if (es === null) {
			var e = D.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = es.next;
		var t = ts === null ? D.memoizedState : ts.next;
		if (t !== null) ts = t, es = e;
		else {
			if (e === null) throw D.alternate === null ? Error(i(467)) : Error(i(310));
			es = e, e = {
				memoizedState: es.memoizedState,
				baseState: es.baseState,
				baseQueue: es.baseQueue,
				queue: es.queue,
				next: null
			}, ts === null ? D.memoizedState = ts = e : ts = ts.next = e;
		}
		return ts;
	}
	function ys() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function bs(e) {
		var t = as;
		return as += 1, os === null && (os = []), e = fo(os, e, t), t = D, (ts === null ? t.memoizedState : ts.next) === null && (t = t.alternate, S.H = t === null || t.memoizedState === null ? Tc : Dc), e;
	}
	function xs(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return bs(e);
			if (e.$$typeof === be) return;
			if (e.$$typeof === de) return Ia(e);
		}
		throw Error(i(438, String(e)));
	}
	function Ss(e) {
		var t = null, n = D.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = D.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = ys(), D.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = ve;
		return t.index++, n;
	}
	function Cs(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function ws(e) {
		return Ts(vs(), es, e);
	}
	function Ts(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? ($o & f) === f : (L & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === Xa && (d = !0);
					else if (($o & p) === p) {
						u = u.next, p === Xa && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, D.lanes |= p, yd |= p;
					f = u.action, is && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, D.lanes |= f, yd |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Qr(o, e.memoizedState) && (Wc = !0, d && (n = Za, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function Es(e) {
		var t = vs(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Qr(o, t.memoizedState) || (Wc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function Ds(e, t, n) {
		var r = D, a = vs(), o = E;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Qr((es || a).memoizedState, n);
		if (s && (a.memoizedState = n, Wc = !0), a = a.queue, Xs(As.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || ts !== null && !!(ts.memoizedState.tag & 1), Gs(e ? 9 : 8, { destroy: void 0 }, ks.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, dd === null) throw Error(i(349));
			o || $o & 127 || Os(r, t, n);
		}
		return n;
	}
	function Os(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = D.updateQueue, t === null ? (t = ys(), D.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function ks(e, t, n, r) {
		t.value = n, t.getSnapshot = r, js(t) && Ms(e);
	}
	function As(e, t, n) {
		return n(function() {
			js(t) && Ms(e);
		});
	}
	function js(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Qr(e, n);
		} catch {
			return !0;
		}
	}
	function Ms(e) {
		var t = Ri(e, 2);
		t !== null && qd(t, e, 2);
	}
	function Ns(e) {
		var t = _s();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), is) {
				ct(!0);
				try {
					n();
				} finally {
					ct(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Cs,
			lastRenderedState: e
		}, t;
	}
	function Ps(e, t, n, r) {
		return e.baseState = n, Ts(e, es, typeof r == "function" ? r : Cs);
	}
	function Fs(e, t, n, r, a) {
		if (bc(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			S.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Is(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Is(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = S.T, o = {};
			o.types = a === null ? null : a.types, S.T = o;
			try {
				var s = n(i, r), c = S.S;
				c !== null && c(o, s), Ls(e, t, s);
			} catch (n) {
				zs(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), S.T = a;
			}
		} else try {
			a = n(i, r), Ls(e, t, a);
		} catch (n) {
			zs(e, t, n);
		}
	}
	function Ls(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Rs(e, t, n);
		}, function(n) {
			return zs(e, t, n);
		}) : Rs(e, t, n);
	}
	function Rs(e, t, n) {
		t.status = "fulfilled", t.value = n, k(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Is(e, n)));
	}
	function zs(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, k(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function k(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Bs(e, t) {
		return t;
	}
	function A(e, t) {
		if (E) {
			var n = dd.formState;
			if (n !== null) {
				a: {
					var r = D;
					if (E) {
						if (ha) {
							b: {
								for (var i = ha, a = _a; i.nodeType !== 8;) if (!a || (i = wm(i.nextSibling), i === null)) {
									i = null;
									break b;
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								ha = wm(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						ya(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = _s(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Bs,
			lastRenderedState: t
		}, n.queue = r, n = _c.bind(null, D, r), r.dispatch = n, r = Ns(!1), a = yc.bind(null, D, !1, r.queue), r = _s(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Fs.bind(null, D, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function Vs(e) {
		return Hs(vs(), es, e);
	}
	function Hs(e, t, n) {
		if (t = Ts(e, t, Bs)[0], e = ws(Cs)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = bs(t);
		} catch (e) {
			throw e === oo ? co : e;
		}
		else r = t;
		t = vs();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (D.flags |= 2048, Gs(9, { destroy: void 0 }, Us.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Us(e, t) {
		e.action = t;
	}
	function Ws(e) {
		var t = vs(), n = es;
		if (n !== null) return Hs(t, n, e);
		vs(), t = t.memoizedState, n = vs();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function Gs(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = D.updateQueue, t === null && (t = ys(), D.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function Ks() {
		return vs().memoizedState;
	}
	function qs(e, t, n, r) {
		var i = _s();
		D.flags |= e, i.memoizedState = Gs(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Js(e, t, n, r) {
		var i = vs();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		es !== null && r !== null && ls(r, es.memoizedState.deps) ? i.memoizedState = Gs(t, a, n, r) : (D.flags |= e, i.memoizedState = Gs(1 | t, a, n, r));
	}
	function Ys(e, t) {
		qs(8390656, 8, e, t);
	}
	function Xs(e, t) {
		Js(2048, 8, e, t);
	}
	function Zs(e) {
		D.flags |= 4;
		var t = D.updateQueue;
		if (t === null) t = ys(), D.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Qs(e) {
		var t = vs().memoizedState;
		return Zs({
			ref: t,
			nextImpl: e
		}), function() {
			if (ud & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function j(e, t) {
		return Js(4, 2, e, t);
	}
	function $s(e, t) {
		return Js(4, 4, e, t);
	}
	function ec(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function tc(e, t, n) {
		n = n == null ? null : n.concat([e]), Js(4, 4, ec.bind(null, t, e), n);
	}
	function nc() {}
	function rc(e, t) {
		var n = vs();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && ls(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function ic(e, t) {
		var n = vs();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && ls(t, r[1])) return r[0];
		if (r = e(), is) {
			ct(!0);
			try {
				e();
			} finally {
				ct(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function ac(e, t, n) {
		return n === void 0 || $o & 1073741824 && !(L & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Gd(), D.lanes |= e, yd |= e, n);
	}
	function oc(e, t, n, r) {
		return Qr(n, t) ? n : Lo.current === null ? !($o & 106) || $o & 1073741824 && !(L & 261930) ? (Wc = !0, e.memoizedState = n) : (e = Gd(), D.lanes |= e, yd |= e, t) : (e = ac(e, n, r), Qr(e, t) || (Wc = !0), e);
	}
	function sc(e, t, n, r, i) {
		var a = Ee.p;
		Ee.p = a !== 0 && 8 > a ? a : 8;
		var o = S.T, s = {};
		s.types = o === null ? null : o.types, S.T = s, yc(e, !1, t, n);
		try {
			var c = i(), l = S.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? vc(e, t, eo(c, r), Wd(e)) : vc(e, t, r, Wd(e));
		} catch (n) {
			vc(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, Wd());
		} finally {
			Ee.p = a, o !== null && s.types !== null && (o.types = s.types), S.T = o;
		}
	}
	function cc() {}
	function lc(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = uc(e).queue;
		sc(e, a, t, De, n === null ? cc : function() {
			return dc(e), n(r);
		});
	}
	function uc(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: De,
			baseState: De,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Cs,
				lastRenderedState: De
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Cs,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function dc(e) {
		var t = uc(e);
		t.next === null && (t = e.alternate.memoizedState), vc(e, t.next.queue, {}, Wd());
	}
	function fc() {
		return Ia(mh);
	}
	function pc() {
		return vs().memoizedState;
	}
	function mc() {
		return vs().memoizedState;
	}
	function hc(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = Wd();
					e = Oo(n);
					var r = ko(t, e, n);
					r !== null && (qd(r, t, n), Ao(r, t, n)), t = { cache: Ua() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function gc(e, t, n) {
		var r = Wd();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, bc(e) ? xc(t, n) : (n = Li(e, t, n, r), n !== null && (qd(n, e, r), Sc(n, t, r)));
	}
	function _c(e, t, n) {
		vc(e, t, n, Wd());
	}
	function vc(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (bc(e)) xc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Qr(s, o)) return Ii(e, t, i, 0), dd === null && Fi(), !1;
			} catch {}
			if (n = Li(e, t, i, r), n !== null) return qd(n, e, r), Sc(n, t, r), !0;
		}
		return !1;
	}
	function yc(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Jf(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, bc(e)) {
			if (t) throw Error(i(479));
		} else t = Li(e, n, r, 2), t !== null && qd(t, e, 2);
	}
	function bc(e) {
		var t = e.alternate;
		return e === D || t !== null && t === D;
	}
	function xc(e, t) {
		rs = ns = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function Sc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, Et(e, n);
		}
	}
	var Cc = {
		readContext: Ia,
		use: xs,
		useCallback: cs,
		useContext: cs,
		useEffect: cs,
		useImperativeHandle: cs,
		useLayoutEffect: cs,
		useInsertionEffect: cs,
		useMemo: cs,
		useReducer: cs,
		useRef: cs,
		useState: cs,
		useDebugValue: cs,
		useDeferredValue: cs,
		useTransition: cs,
		useSyncExternalStore: cs,
		useId: cs,
		useHostTransitionStatus: cs,
		useFormState: cs,
		useActionState: cs,
		useOptimistic: cs,
		useMemoCache: cs,
		useCacheRefresh: cs,
		useEffectEvent: cs
	}, Tc = {
		readContext: Ia,
		use: xs,
		useCallback: function(e, t) {
			return _s().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: Ia,
		useEffect: Ys,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), qs(4194308, 4, ec.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return qs(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			qs(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = _s();
			t = t === void 0 ? null : t;
			var r = e();
			if (is) {
				ct(!0);
				try {
					e();
				} finally {
					ct(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = _s();
			if (n !== void 0) {
				var i = n(t);
				if (is) {
					ct(!0);
					try {
						n(t);
					} finally {
						ct(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = gc.bind(null, D, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = _s();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Ns(e);
			var t = e.queue, n = _c.bind(null, D, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: nc,
		useDeferredValue: function(e, t) {
			return ac(_s(), e, t);
		},
		useTransition: function() {
			var e = Ns(!1);
			return e = sc.bind(null, D, e.queue, !0, !1), _s().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = D, a = _s();
			if (E) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), dd === null) throw Error(i(349));
				L & 127 || Os(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Ys(As.bind(null, r, o, e), [e]), r.flags |= 2048, Gs(9, { destroy: void 0 }, ks.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = _s(), t = dd.identifierPrefix;
			if (E) {
				var n = ca, r = sa;
				n = (r & ~(1 << 32 - lt(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = O++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = ss++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: fc,
		useFormState: A,
		useActionState: A,
		useOptimistic: function(e) {
			var t = _s();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = yc.bind(null, D, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: Ss,
		useCacheRefresh: function() {
			return _s().memoizedState = hc.bind(null, D);
		},
		useEffectEvent: function(e) {
			var t = _s(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (ud & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, Dc = {
		readContext: Ia,
		use: xs,
		useCallback: rc,
		useContext: Ia,
		useEffect: Xs,
		useImperativeHandle: tc,
		useInsertionEffect: j,
		useLayoutEffect: $s,
		useMemo: ic,
		useReducer: ws,
		useRef: Ks,
		useState: function() {
			return ws(Cs);
		},
		useDebugValue: nc,
		useDeferredValue: function(e, t) {
			return oc(vs(), es.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ws(Cs)[0], t = vs().memoizedState;
			return [typeof e == "boolean" ? e : bs(e), t];
		},
		useSyncExternalStore: Ds,
		useId: pc,
		useHostTransitionStatus: fc,
		useFormState: Vs,
		useActionState: Vs,
		useOptimistic: function(e, t) {
			return Ps(vs(), es, e, t);
		},
		useMemoCache: Ss,
		useCacheRefresh: mc,
		useEffectEvent: Qs
	}, kc = {
		readContext: Ia,
		use: xs,
		useCallback: rc,
		useContext: Ia,
		useEffect: Xs,
		useImperativeHandle: tc,
		useInsertionEffect: j,
		useLayoutEffect: $s,
		useMemo: ic,
		useReducer: Es,
		useRef: Ks,
		useState: function() {
			return Es(Cs);
		},
		useDebugValue: nc,
		useDeferredValue: function(e, t) {
			var n = vs();
			return es === null ? ac(n, e, t) : oc(n, es.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Es(Cs)[0], t = vs().memoizedState;
			return [typeof e == "boolean" ? e : bs(e), t];
		},
		useSyncExternalStore: Ds,
		useId: pc,
		useHostTransitionStatus: fc,
		useFormState: Ws,
		useActionState: Ws,
		useOptimistic: function(e, t) {
			var n = vs();
			return es === null ? (n.baseState = e, [e, n.queue.dispatch]) : Ps(n, es, e, t);
		},
		useMemoCache: Ss,
		useCacheRefresh: mc,
		useEffectEvent: Qs
	};
	function Ac(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : b({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var jc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = Wd(), i = Oo(r);
			i.payload = t, n != null && (i.callback = n), t = ko(e, i, r), t !== null && (qd(t, e, r), Ao(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = Wd(), i = Oo(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = ko(e, i, r), t !== null && (qd(t, e, r), Ao(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = Wd(), r = Oo(n);
			r.tag = 2, t != null && (r.callback = t), t = ko(e, r, n), t !== null && (qd(t, e, n), Ao(t, e, n));
		}
	};
	function Mc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !$r(n, r) || !$r(i, a) : !0;
	}
	function Nc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && jc.enqueueReplaceState(t, t.state, null);
	}
	function Pc(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = b({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Fc(e) {
		ji(e);
	}
	function Ic(e) {
		console.error(e);
	}
	function Lc(e) {
		ji(e);
	}
	function Rc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function zc(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Bc(e, t, n) {
		return n = Oo(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Rc(e, t);
		}, n;
	}
	function Vc(e) {
		return e = Oo(e), e.tag = 3, e;
	}
	function Hc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				zc(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			zc(t, n, r), typeof i != "function" && (jd === null ? jd = /* @__PURE__ */ new Set([this]) : jd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function M(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && Na(t, n, a, !0), n = Ho.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return Uo === null ? of() : n.alternate === null && vd === 0 && (vd = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === lo ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), Of(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === lo ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), Of(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return Of(e, r, a), of(), !1;
		}
		if (E) return t = Ho.current, t === null ? (r !== va && (t = Error(i(423), { cause: r }), Ta($i(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = $i(r, n), a = Bc(e.stateNode, r, a), jo(e, a), vd !== 4 && (vd = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== va && (e = Error(i(422), { cause: r }), Ta($i(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = $i(o, n), wd === null ? wd = [o] : wd.push(o), vd !== 4 && (vd = 2), t === null) return !0;
		r = $i(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Bc(n.stateNode, r, e), jo(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (jd === null || !jd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = Vc(a), Hc(a, e, n, r), jo(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Uc = Error(i(461)), Wc = !1;
	function Gc(e, t, n, r) {
		t.child = e === null ? wo(t, null, n, r) : Co(t, e.child, n, r);
	}
	function Kc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return Fa(t), r = us(e, t, n, o, a, i), s = ms(), e !== null && !Wc ? (hs(e, t, i), yl(e, t, i)) : (E && s && da(t), t.flags |= 1, Gc(e, t, r, i), t.child);
	}
	function qc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !Wi(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, Jc(e, t, a, r, i)) : (e = qi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !bl(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? $r : n, n(o, r) && e.ref === t.ref) return yl(e, t, i);
		}
		return t.flags |= 1, e = Gi(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function Jc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if ($r(a, r) && e.ref === t.ref) {
				if (Wc = !1, t.pendingProps = r = a, bl(e, i)) e.flags & 131072 && (Wc = !0);
				else return t.lanes = e.lanes, yl(e, t, i);
			}
		}
		return nl(e, t, n, r, i);
	}
	function Yc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return Zc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && io(t, a === null ? null : a.cachePool), a === null ? Bo() : zo(t, a), Ko(t);
			else return r = t.lanes = 536870912, Zc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && io(t, null), Bo(), qo()) : (io(t, a.cachePool), zo(t, a), qo(), t.memoizedState = null);
		return Gc(e, t, i, n), t.child;
	}
	function Xc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function Zc(e, t, n, r, i) {
		var a = ro();
		return a = a === null ? null : {
			parent: Ha._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && io(t, null), Bo(), Ko(t), e !== null && Na(e, t, r, !0), t.childLanes = i, null;
	}
	function Qc(e, t) {
		return t = dl({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function $c(e, t, n) {
		return Co(t, e.child, null, n), e = Qc(t, t.pendingProps), e.flags |= 2, Jo(t), t.memoizedState = null, e;
	}
	function el(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (E) {
				if (r.mode === "hidden") return e = Qc(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Xc(null, e);
				if (Go(t), (e = ha) ? (e = bm(e, _a), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: oa === null ? null : {
						id: sa,
						overflow: ca
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Xi(e), n.return = t, t.child = n, ma = t, ha = null)) : e = null, e === null) throw ya(t);
				return t.lanes = 536870912, null;
			}
			return Qc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Go(t), a) {
				if (t.flags & 256) t.flags &= -257, t = $c(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Wc || Na(e, t, n, !1), a = (n & e.childLanes) !== 0, Wc || a) {
				if (Lo.current === null) {
					if (r = dd, r !== null && (s = Dt(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, Ri(e, s), qd(r, e, s), Uc;
					of();
				}
				t = $c(e, t, n);
			} else e = o.treeContext, ha = wm(s.nextSibling), ma = t, E = !0, ga = null, _a = !1, e !== null && pa(t, e), t = Qc(t, r), t.flags |= 134221824;
			return t;
		}
		return e = Gi(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function tl(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function nl(e, t, n, r, i) {
		return Fa(t), n = us(e, t, n, r, void 0, i), r = ms(), e !== null && !Wc ? (hs(e, t, i), yl(e, t, i)) : (E && r && da(t), t.flags |= 1, Gc(e, t, n, i), t.child);
	}
	function rl(e, t, n, r, i, a) {
		return Fa(t), t.updateQueue = null, n = fs(t, r, n, i), ds(e), r = ms(), e !== null && !Wc ? (hs(e, t, a), yl(e, t, a)) : (E && r && da(t), t.flags |= 1, Gc(e, t, n, a), t.child);
	}
	function il(e, t, n, r, i) {
		if (Fa(t), t.stateNode === null) {
			var a = Vi, o = n.contextType;
			typeof o == "object" && o && (a = Ia(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = jc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, Eo(t), o = n.contextType, a.context = typeof o == "object" && o ? Ia(o) : Vi, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Ac(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && jc.enqueueReplaceState(a, a.state, null), Po(t, r, a, i), No(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = Pc(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = Vi, typeof u == "object" && u && (o = Ia(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Nc(t, a, r, o), To = !1;
			var f = t.memoizedState;
			a.state = f, Po(t, r, a, i), No(), l = t.memoizedState, s || f !== l || To ? (typeof d == "function" && (Ac(t, n, d, r), l = t.memoizedState), (c = To || Mc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, Do(e, t), o = t.memoizedProps, u = Pc(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = Vi, typeof l == "object" && l && (c = Ia(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Nc(t, a, r, c), To = !1, f = t.memoizedState, a.state = f, Po(t, r, a, i), No();
			var p = t.memoizedState;
			o !== d || f !== p || To || e !== null && e.dependencies !== null && Pa(e.dependencies) ? (typeof s == "function" && (Ac(t, n, s, r), p = t.memoizedState), (u = To || Mc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && Pa(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, tl(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = Co(t, e.child, null, i), t.child = Co(t, null, n, i)) : Gc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = yl(e, t, i), e;
	}
	function al(e, t, n, r) {
		return Ca(), t.flags |= 256, Gc(e, t, n, r), t.child;
	}
	var ol = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function sl(e) {
		return {
			baseLanes: e,
			cachePool: ao()
		};
	}
	function cl(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= Sd), e;
	}
	function ll(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(Yo.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (E) {
				if (i ? Wo(t) : qo(), (e = ha) ? (e = bm(e, _a), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: oa === null ? null : {
						id: sa,
						overflow: ca
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Xi(e), n.return = t, t.child = n, ma = t, ha = null)) : e = null, e === null) throw ya(t);
				return t.lanes = Sm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (qo(), i = t.mode, a = dl({
				mode: "hidden",
				children: a
			}, i), r = Ji(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = sl(n), r.childLanes = cl(e, o, n), t.memoizedState = ol, Xc(null, r)) : (Wo(t), ul(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return pl(e, t, a, o, r, c, s, n);
		}
		return i ? (qo(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = Gi(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = Ji(i, a, n, null), i.flags |= 2) : i = Gi(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Xc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = sl(n) : (a = i.cachePool, a === null ? a = ao() : (s = Ha._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = cl(e, o, n), t.memoizedState = ol, Xc(e.child, r)) : (Wo(t), n = e.child, e = n.sibling, n = Gi(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function ul(e, t) {
		return t = dl({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function dl(e, t) {
		return e = Ui(22, e, null, t), e.lanes = 0, e;
	}
	function fl(e, t, n) {
		return Co(t, e.child, null, n), e = ul(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function pl(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (Wo(t), t.flags &= -257, fl(e, t, c)) : t.memoizedState === null ? (qo(), o = a.fallback, s = t.mode, a = dl({
			mode: "visible",
			children: a.children
		}, s), o = Ji(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, Co(t, e.child, null, c), a = t.child, a.memoizedState = sl(c), a.childLanes = cl(e, r, c), t.memoizedState = ol, Xc(null, a)) : (qo(), t.child = e.child, t.flags |= 128, null);
		if (Wo(t), Sm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, Ta({
				value: a,
				source: null,
				stack: null
			})), fl(e, t, c);
		}
		if (Wc || Na(e, t, c, !1), r = (c & e.childLanes) !== 0, Wc || r) {
			if (Lo.current !== null) return fl(e, t, c);
			if (r = dd, r !== null && (a = Dt(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, Ri(e, a), qd(r, e, a), Uc;
			return xm(o) || of(), fl(e, t, c);
		}
		return xm(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, ha = wm(o.nextSibling), ma = t, E = !0, ga = null, _a = !1, e !== null && pa(t, e), t = ul(t, a.children), t.flags |= 134221824, t);
	}
	function ml(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), ja(e.return, t, n);
	}
	function hl(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && Qo(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function N(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function gl(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function _l(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = Yo.current;
		if (t.flags & 128) return Xo(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Xo(t, o), i === "backwards" && e !== null ? (gl(e), Gc(e, t, r, n), gl(e)) : Gc(e, t, r, n), r = E ? ra : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && ml(e, n, t);
			else if (e.tag === 19) ml(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "backwards":
				n = hl(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, gl(t)), N(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && Qo(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				N(t, !0, n, null, a, r);
				break;
			case "together":
				N(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = hl(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), N(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function vl(e, t, n) {
		var r = t.pendingProps;
		return ka(t, t.type, r.value), Gc(e, t, r.children, n), t.child;
	}
	function yl(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), yd |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (Na(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = Gi(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Gi(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function bl(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && Pa(e)));
	}
	function xl(e, t, n) {
		switch (t.tag) {
			case 3:
				Le(t, t.stateNode.containerInfo), ka(t, Ha, e.memoizedState.cache), Ca();
				break;
			case 27:
			case 5:
				ze(t);
				break;
			case 4:
				Le(t, t.stateNode.containerInfo);
				break;
			case 10:
				ka(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Go(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return Wo(t), t.flags |= 128, null;
					r = Na(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? ll(e, t, n) : (Wo(t), e = yl(e, t, n), e === null ? null : e.sibling);
				}
				Wo(t);
				break;
			case 19:
				if (t.flags & 128) return _l(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (Na(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return _l(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Xo(t, Yo.current), r) break;
				return null;
			case 22: return t.lanes = 0, Yc(e, t, n, t.pendingProps);
			case 24: ka(t, Ha, e.memoizedState.cache);
		}
		return yl(e, t, n);
	}
	function Sl(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Wc = !0;
			else {
				if (!bl(e, n) && !(t.flags & 128)) return Wc = !1, xl(e, t, n);
				Wc = !!(e.flags & 131072);
			}
		} else Wc = !1, E && t.flags & 1048576 && ua(t, ra, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = po(t.elementType), t.type = e, typeof e == "function") Wi(e) ? (r = Pc(e, r), t.tag = 1, t = il(null, t, e, r, n)) : (t.tag = 0, t = nl(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === fe) {
								t.tag = 11, t = Kc(null, t, e, r, n);
								break a;
							}
							if (a === he) {
								t.tag = 14, t = qc(null, t, e, r, n);
								break a;
							}
							if (a === de) {
								t.tag = 10, t.type = e, t = vl(null, t, n);
								break a;
							}
						}
						throw t = we(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return nl(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = Pc(r, t.pendingProps), il(e, t, r, a, n);
			case 3:
				a: {
					if (Le(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, Do(e, t), Po(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, ka(t, Ha, r), r !== o.cache && Ma(t, [Ha], n, !0), No(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = al(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = $i(Error(i(424)), t), Ta(a), t = al(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (ha = wm(e.firstChild), ma = t, E = !0, ga = null, _a = !0, n = wo(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (Ca(), r === a) {
							t = yl(e, t, n);
							break a;
						}
						Gc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return tl(e, t), e === null ? (n = Gm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : E || (t.stateNode = Dp(t.type, t.pendingProps, Fe.current, t)) : t.memoizedState = Gm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return ze(t), e === null && E && (r = t.stateNode = Am(t.type, t.pendingProps, Fe.current), ma = t, _a = !0, a = ha, Lp(t.type) ? (Tm = a, ha = wm(r.firstChild)) : ha = a), Gc(e, t, t.pendingProps.children, n), tl(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && E && ((a = r = ha) && (r = vm(r, t.type, t.pendingProps, _a), r === null ? a = !1 : (t.stateNode = r, ma = t, ha = wm(r.firstChild), _a = !1, a = !0)), a || ya(t)), ze(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, Op(a, o) ? r = null : s !== null && Op(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = us(e, t, ps, null, null, n), mh._currentValue = a), tl(e, t), Gc(e, t, r, n), t.child;
			case 6: return e === null && E && ((e = n = ha) && (n = ym(n, t.pendingProps, _a), n === null ? e = !1 : (t.stateNode = n, ma = t, ha = null, e = !0)), e || ya(t)), null;
			case 13: return ll(e, t, n);
			case 4: return Le(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Co(t, null, r, n) : Gc(e, t, r, n), t.child;
			case 11: return Kc(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, tl(e, t), Gc(e, t, r, n), t.child;
			case 8: return Gc(e, t, t.pendingProps.children, n), t.child;
			case 12: return Gc(e, t, t.pendingProps.children, n), t.child;
			case 10: return vl(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, Fa(t), a = Ia(a), r = r(a), t.flags |= 1, Gc(e, t, r, n), t.child;
			case 14: return qc(e, t, t.type, t.pendingProps, n);
			case 15: return Jc(e, t, t.type, t.pendingProps, n);
			case 19: return _l(e, t, n);
			case 31: return el(e, t, n);
			case 22: return Yc(e, t, n, t.pendingProps);
			case 24: return Fa(t), r = Ia(Ha), e === null ? (a = ro(), a === null && (a = dd, o = Ua(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, Eo(t), ka(t, Ha, a)) : ((e.lanes & n) !== 0 && (Do(e, t), Po(t, null, null, n), No()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, ka(t, Ha, r), r !== a.cache && Ma(t, [Ha], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), ka(t, Ha, r))), Gc(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : E && da(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : tl(e, t), Gc(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function Cl(e) {
		e.flags |= 4;
	}
	function wl(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? G(t, r) : G(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (nf()) e.flags |= 8192;
				else throw mo = lo, so;
			}
		} else e.flags &= -16777217;
	}
	function Tl(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !K(t)) {
			if (nf()) e.flags |= 8192;
			else throw mo = lo, so;
		}
	}
	function El(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : xt(), e.lanes |= t, Cd |= t);
	}
	function Dl(e, t) {
		if (!E) switch (e.tailMode) {
			case "visible": break;
			case "collapsed":
				for (var n = e.tail, r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
				break;
			default:
				for (t = e.tail, n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
		}
	}
	function Ol(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function kl(e, t, n) {
		var r = t.pendingProps;
		switch (fa(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return Ol(t), null;
			case 1: return Ol(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Aa(Ha), Re(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Sa(t) ? Cl(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, wa())), Ol(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (Cl(t), o === null ? (Ol(t), wl(t, a, null, r, n)) : (Ol(t), Tl(t, o))) : o ? o === e.memoizedState ? (Ol(t), t.flags &= -16777217) : (Cl(t), Ol(t), Tl(t, o)) : (e = e.memoizedProps, e !== r && Cl(t), Ol(t), wl(t, a, e, r, n)), null;
			case 27:
				if (Be(t), n = Fe.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Cl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Ol(t), t.subtreeFlags &= -33554433, null;
					}
					e = Ne.current, Sa(t) ? ba(t, e) : (e = Am(a, r, n), t.stateNode = e, Cl(t));
				}
				return Ol(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (Be(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Cl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Ol(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = Ne.current, Sa(t)) ba(t, o);
					else {
						var s = wp(Fe.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[Nt] = t, o[Pt] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (_p(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && Cl(t);
					}
				}
				return Ol(t), t.subtreeFlags &= -33554433, wl(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && Cl(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = Fe.current, Sa(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = ma, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[Nt] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || mp(e.nodeValue, n)), e || ya(t, !0);
					} else e = wp(e).createTextNode(r), e[Nt] = t, t.stateNode = e;
				}
				return Ol(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Sa(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[Nt] = t;
						} else Ca(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Ol(t), e = !1;
					} else n = wa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (Jo(t), t) : (Jo(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return Ol(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = Sa(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[Nt] = t;
						} else Ca(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Ol(t), a = !1;
					} else a = wa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (Jo(t), t) : (Jo(t), null);
				}
				return Jo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), El(t, t.updateQueue), Ol(t), null);
			case 4: return Re(), e === null && ip(t.stateNode.containerInfo), t.flags |= 67108864, Ol(t), null;
			case 10: return Aa(t.type), Ol(t), null;
			case 19:
				if (Zo(t), r = t.memoizedState, r === null) return Ol(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) Dl(r, !1);
					else {
						if (vd !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = Qo(e), o !== null) {
								for (t.flags |= 128, Dl(r, !1), e = o.updateQueue, t.updateQueue = e, El(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Ki(n, e), n = n.sibling;
								return Xo(t, Yo.current & 1 | 2), E && la(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Qe() > kd && (t.flags |= 128, a = !0, Dl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = Qo(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, El(t, e), Dl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !E) return Ol(t), null;
						} else 2 * Qe() - r.renderingStartTime > kd && n !== 536870912 && (t.flags |= 128, a = !0, Dl(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				if (r.tail !== null) {
					e = r.tail;
					a: {
						for (n = e; n !== null;) {
							if (n.alternate !== null) {
								n = !1;
								break a;
							}
							n = n.sibling;
						}
						n = !0;
					}
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Qe(), e.sibling = null, o = Yo.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || E ? Xo(t, o) : (n = o, Me(Ho, t), Me(Yo, n), Uo === null && (Uo = t)), E && la(t, r.treeForkCount), e;
				}
				return Ol(t), null;
			case 22:
			case 23: return Jo(t), Vo(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (Ol(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ol(t), n = t.updateQueue, n !== null && El(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && je(no), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Aa(Ha), Ol(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, Ol(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function Al(e, t) {
		switch (fa(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return Aa(Ha), Re(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return Be(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (Jo(t), t.alternate === null) throw Error(i(340));
					Ca();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (Jo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					Ca();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return Zo(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return Re(), null;
			case 10: return Aa(t.type), null;
			case 22:
			case 23: return Jo(t), Vo(), e !== null && je(no), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return Aa(Ha), null;
			case 25: return null;
			default: return null;
		}
	}
	function jl(e, t) {
		switch (fa(t), t.tag) {
			case 3:
				Aa(Ha), Re();
				break;
			case 26:
			case 27:
			case 5:
				Be(t);
				break;
			case 4:
				Re();
				break;
			case 31:
				t.memoizedState !== null && Jo(t);
				break;
			case 13:
				Jo(t);
				break;
			case 19:
				Zo(t);
				break;
			case 10:
				Aa(t.type);
				break;
			case 22:
			case 23:
				Jo(t), Vo(), e !== null && je(no);
				break;
			case 24: Aa(Ha);
		}
	}
	function Ml(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			Df(t, t.return, e);
		}
	}
	function Nl(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								Df(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			Df(t, t.return, e);
		}
	}
	function Pl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				Io(t, n);
			} catch (t) {
				Df(e, e.return, t);
			}
		}
	}
	function Fl(e, t, n) {
		n.props = Pc(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Df(e, t, n);
		}
	}
	function Il(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						var i = e.stateNode, a = Oi(e.memoizedProps, i);
						(i.ref === null || i.ref.name !== a) && (i.ref = Yp(a)), r = i.ref;
						break;
					case 7:
						if (e.stateNode === null) {
							var o = new Xp(e);
							f(e.child, !1, pm, o, void 0, void 0), e.stateNode = o;
						}
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			Df(e, t, n);
		}
	}
	function Ll(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				Df(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				Df(e, t, n);
			}
			else n.current = null;
		}
	}
	function Rl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) hm(e.stateNode, t[n]);
	}
	function zl(e) {
		for (var t = e.return; t !== null && (Vl(t) && hm(e.stateNode, t.stateNode), !Bl(t));) t = t.return;
	}
	function P(e) {
		for (var t = e.return; t !== null && (Vl(t) && gm(e.stateNode, t.stateNode), !Bl(t));) t = t.return;
	}
	function Bl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function Vl(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function Hl(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			Df(e, e.return, t);
		}
	}
	function Ul(e, t, n) {
		try {
			var r = e.stateNode;
			yp(r, e.type, n, t), r[Pt] = t;
		} catch (t) {
			Df(e, e.return, t);
		}
	}
	function Wl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Lp(e.type) || e.tag === 4;
	}
	function Gl(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Wl(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Lp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Kl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = An)), Rl(e, r), rn = !0;
		else if (i !== 4 && (i === 27 && (Rl(e, r), r = null, Lp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (Kl(e, t, n, r), e = e.sibling; e !== null;) Kl(e, t, n, r), e = e.sibling;
	}
	function ql(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), Rl(e, r), rn = !0;
		else if (i !== 4 && (i === 27 && (Rl(e, r), r = null, Lp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (ql(e, t, n, r), e = e.sibling; e !== null;) ql(e, t, n, r), e = e.sibling;
	}
	function Jl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			_p(t, r, n), t[Nt] = e, t[Pt] = n;
		} catch (t) {
			Df(e, e.return, t);
		}
	}
	var Yl = !1, Xl = null;
	function Zl(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (Yl = !0);
	}
	var Ql = null;
	function $l() {
		var e = Ql;
		return Ql = null, e;
	}
	var F = 0;
	function eu(e, t, n, r, i) {
		return F = 0, tu(e.child, t, n, r, i);
	}
	function tu(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = Up(o);
					r.push(s), s.view && (a = !0);
				} else a || Up(o).view && (a = !0);
				Yl = !0, Bp(o, F === 0 ? t : t + "_" + F, n), F++;
			} else (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && i || tu(e.child, t, n, r, i) && (a = !0));
			e = e.sibling;
		}
		return a;
	}
	function nu(e, t) {
		for (; e !== null;) e.tag === 5 ? Vp(e.stateNode, e.memoizedProps) : (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && t || nu(e.child, t)), e = e.sibling;
	}
	function ru(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (ru(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = Ai(t.default, t.share), t !== "none" && (eu(e, n, t, null, !1) || nu(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function iu(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = Oi(r, n), a = Ai(r.default, n.paired ? r.share : r.enter);
			a === "none" ? ru(e) : eu(e, i, a, null, !1) ? (ru(e), n.paired || t || Kd(e, r.onEnter)) : nu(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) iu(e, t), e = e.sibling;
		else ru(e);
	}
	function au(e) {
		if (Xl !== null && Xl.size !== 0) {
			var t = Xl;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = Ai(n.default, n.share);
								if (a !== "none" && (eu(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, Kd(e, n.onShare)) : nu(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					au(e);
				}
				e = e.sibling;
			}
		}
	}
	function ou(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = Oi(t, e.stateNode), r = Xl === null ? void 0 : Xl.get(n), i = Ai(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (eu(e, n, i, null, !1) ? r === void 0 ? Kd(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Xl.delete(n), Kd(e, t.onShare)) : nu(e.child, !1)), Xl !== null && au(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) ou(e), e = e.sibling;
		else Xl !== null && au(e);
	}
	function su(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = Oi(t, e.stateNode);
				t = Ai(t.default, t.update), e.flags &= -5, t !== "none" && eu(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && su(e);
			e = e.sibling;
		}
	}
	function cu(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, nu(e.child, !1));
				}
				cu(e);
			}
			e = e.sibling;
		}
	}
	function lu(e) {
		if (e.tag === 30) e.stateNode.paired = null, nu(e.child, !1), cu(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) lu(e), e = e.sibling;
		else cu(e);
	}
	function uu(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? nu(e.child, !1) : e.subtreeFlags & 33554432 && uu(e), e = e.sibling;
	}
	function du(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && F < a.length) {
					var l = a[F], u = Up(c);
					(l.view || u.view) && (s = !0);
					var d;
					if (d = !(e.flags & 4)) {
						if (u.clip) d = !0;
						else {
							d = l.rect;
							var f = u.rect;
							d = d.y !== f.y || d.x !== f.x || d.height !== f.height || d.width !== f.width;
						}
					}
					d && (e.flags |= 4), u.abs ? u = !l.abs : (l = l.rect, u = u.rect, u = l.height !== u.height || l.width !== u.width), u && (e.flags |= 32);
				} else e.flags |= 32;
				e.flags & 4 && Bp(c, F === 0 ? n : n + "_" + F, i), s && e.flags & 4 || (Ql === null && (Ql = []), Ql.push(c, F === 0 ? r : r + "_" + F, t.memoizedProps)), F++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : du(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function fu(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = Oi(n, r), a = Ai(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(Wp);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				F = 0, i = du(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || Kd(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && fu(e, t);
			e = e.sibling;
		}
	}
	var pu = !1, mu = !1, hu = !1, gu = !1, _u = typeof WeakSet == "function" ? WeakSet : Set, vu = null, yu = !1, bu = !1, xu = !1, Su = !1;
	function Cu(e, t, n) {
		if (e = e.containerInfo, Sp = Ch, e = ii(e), ai(e)) {
			if ("selectionStart" in e) var r = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				r = (r = e.ownerDocument) && r.defaultView || window;
				var i = r.getSelection && r.getSelection();
				if (i && i.rangeCount !== 0) {
					r = i.anchorNode;
					var a = i.anchorOffset, o = i.focusNode;
					i = i.focusOffset;
					try {
						r.nodeType, o.nodeType;
					} catch {
						r = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== r || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || i !== 0 && f.nodeType !== 3 || (l = s + i), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === r && ++u === a && (c = s), p === o && ++d === i && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					r = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else r = null;
			}
			r ||= {
				start: 0,
				end: 0
			};
		} else r = null;
		for (Cp = {
			focusedElem: e,
			selectionRange: r
		}, Ch = !1, n = (n & 335544064) === n, vu = t, t = n ? 9270 : 1024; vu !== null;) {
			if (e = vu, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && ou(r[a]);
			if (e.alternate === null && e.flags & 2) n && Zl(e), wu(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && ou(r), wu(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Zl(e), wu(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, vu = r) : (n && su(e), wu(n));
			}
		}
		Xl = null;
	}
	function wu(e) {
		for (; vu !== null;) {
			var t = vu, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = Pc(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							Df(t, t.return, e);
						}
					}
					break;
				case 3:
					if (a & 1024) {
						if (r = t.stateNode.containerInfo, n = r.nodeType, n === 9) _m(r);
						else if (n === 1) switch (r.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								_m(r);
								break;
							default: r.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				case 30:
					n && r !== null && (n = Oi(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = Ai(a.default, a.update), a !== "none" && eu(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, vu = r;
				break;
			}
			vu = t.return;
		}
	}
	function Tu(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Gu(e, n), r & 4 && Ml(5, n);
				break;
			case 1:
				if (Gu(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						Df(n, n.return, e);
					}
					else {
						var i = Pc(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							Df(n, n.return, e);
						}
					}
				}
				r & 64 && Pl(n), r & 512 && Il(n, n.return);
				break;
			case 3:
				if (Gu(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						Io(e, t);
					} catch (e) {
						Df(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Jl(n);
			case 26:
			case 5:
				Gu(e, n), t === null && r & 4 && Hl(n), r & 512 && Il(n, n.return);
				break;
			case 12:
				Gu(e, n);
				break;
			case 31:
				Gu(e, n), r & 4 && Pu(e, n);
				break;
			case 13:
				Gu(e, n), r & 4 && Fu(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = jf.bind(null, n), Cm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || pu, !r) {
					var a = t !== null && t.memoizedState !== null || mu;
					t = pu, i = mu, pu = r, (mu = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), qu(e, n, r)) : Gu(e, n), pu = t, mu = i;
				}
				break;
			case 30:
				Gu(e, n), r & 512 && Il(n, n.return);
				break;
			case 7: r & 512 && Il(n, n.return);
			default: Gu(e, n);
		}
	}
	function Eu(e, t) {
		for (e = e.child; e !== null;) Du(e, t), e = e.sibling;
	}
	function Du(e, t) {
		switch (e.tag) {
			case 5:
			case 26:
				try {
					var n = e.stateNode;
					if (t) {
						var r = n.style;
						typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
					} else {
						var i = e.stateNode, a = e.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null;
						i.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
					}
				} catch (t) {
					Df(e, e.return, t);
				}
				Ou(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, rn = !0;
				} catch (t) {
					Df(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? zp(s, !0) : zp(e.stateNode, !1);
				} catch (t) {
					Df(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && Eu(e, t);
				break;
			default: Eu(e, t);
		}
	}
	function Ou(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						Du(n, r);
						break a;
					case 22:
						n.memoizedState === null && Ou(n, r);
						break a;
					default: Ou(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function ku(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, ku(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Ht(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var Au = null, ju = !1;
	function Mu(e, t, n) {
		for (n = n.child; n !== null;) Nu(e, t, n), n = n.sibling;
	}
	function Nu(e, t, n) {
		if (st && typeof st.onCommitFiberUnmount == "function") try {
			st.onCommitFiberUnmount(ot, n);
		} catch {}
		switch (n.tag) {
			case 26:
				mu || Ll(n, t), Mu(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !mu && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				mu || Ll(n, t), P(n);
				var r = Au, i = ju;
				Lp(n.type) && (Au = n.stateNode, ju = !1), Mu(e, t, n), jm(n.stateNode, n.type, n.memoizedProps), Au = r, ju = i;
				break;
			case 5: mu || Ll(n, t), P(n);
			case 6:
				if (n.tag === 6 && P(n), r = Au, i = ju, Au = null, Mu(e, t, n), Au = r, ju = i, Au !== null) {
					if (ju) try {
						(Au.nodeType === 9 ? Au.body : Au.nodeName === "HTML" ? Au.ownerDocument.body : Au).removeChild(n.stateNode), rn = !0;
					} catch (e) {
						Df(n, t, e);
					}
					else try {
						Au.removeChild(n.stateNode), rn = !0;
					} catch (e) {
						Df(n, t, e);
					}
				}
				break;
			case 18:
				Au !== null && (ju ? (e = Au, Rp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Yh(e)) : Rp(Au, n.stateNode));
				break;
			case 4:
				r = Au, i = ju, Au = n.stateNode.containerInfo, ju = !0, Mu(e, t, n), Au = r, ju = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Nl(2, n, t), mu || Nl(4, n, t), Mu(e, t, n);
				break;
			case 1:
				mu || (Ll(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Fl(n, t, r)), Mu(e, t, n);
				break;
			case 21:
				Mu(e, t, n);
				break;
			case 22:
				mu = (r = mu) || n.memoizedState !== null, Mu(e, t, n), mu = r;
				break;
			case 30:
				Ll(n, t), Mu(e, t, n);
				break;
			case 7:
				mu || Ll(n, t), Mu(e, t, n);
				break;
			default: Mu(e, t, n);
		}
	}
	function Pu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Yh(e);
			} catch (e) {
				Df(t, t.return, e);
			}
		}
	}
	function Fu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Yh(e);
		} catch (e) {
			Df(t, t.return, e);
		}
	}
	function Iu(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new _u()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new _u()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function Lu(e, t) {
		var n = Iu(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = Mf.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function Ru(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (Lp(l.type)) {
							Au = l.stateNode, ju = !1;
							break a;
						}
						break;
					case 5:
						Au = l.stateNode, ju = !1;
						break a;
					case 3:
					case 4:
						Au = l.stateNode.containerInfo, ju = !0;
						break a;
				}
				l = l.return;
			}
			if (Au === null) throw Error(i(160));
			Nu(s, c, o), Au = null, ju = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Bu(t, e, n), t = t.sibling;
	}
	var zu = null;
	function Bu(e, t, n) {
		var r = e.alternate, a = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				if (a & 4 && (r = e.updateQueue, r = r === null ? null : r.events, r !== null)) for (var o = 0; o < r.length; o++) {
					var s = r[o];
					s.ref.impl = s.nextImpl;
				}
				Ru(t, e, n), Vu(e), a & 4 && (Nl(3, e, e.return), Ml(3, e), Nl(5, e, e.return));
				break;
			case 1:
				Ru(t, e, n), Vu(e), a & 512 && (mu || r === null || Ll(r, r.return)), a & 64 && pu && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = zu, Ru(t, e, n), Vu(e), a & 512 && (mu || r === null || Ll(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (pu) e.stateNode = Dp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[Bt] || r[Nt] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), _p(r, t, n), r[Nt] = e, qt(r), t = r;
												break a;
											case "link":
												if (o = W("link", "href", a).get(t + (n.href || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), _p(r, t, n), a.head.appendChild(r);
												break;
											case "meta":
												if (o = W("meta", "content", a).get(t + (n.content || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), _p(r, t, n), a.head.appendChild(r);
												break;
											default: throw Error(i(468, t));
										}
										r[Nt] = e, qt(r), t = r;
									}
									e.stateNode = t;
								}
							} else pu || th(o, e.type, e.stateNode);
						} else e.stateNode = Xm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && Ul(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || mu || t.parentNode.removeChild(t)) : a.count--, n === null ? pu || th(o, e.type, e.stateNode) : Xm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				Ru(t, e, n), Vu(e), a & 512 && (mu || r === null || Ll(r, r.return)), r !== null && a & 4 && Ul(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = hu, hu = !1, Ru(t, e, n), hu = o, Vu(e), a & 512 && (mu || r === null || Ll(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						Sn(t, ""), rn = !0;
					} catch (t) {
						Df(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, Ul(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (gu = !0);
				break;
			case 6:
				if (Ru(t, e, n), Vu(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, rn = !0;
					} catch (t) {
						Df(e, e.return, t);
					}
				}
				break;
			case 3:
				if (rn = !1, eh = null, o = zu, zu = Fm(t.containerInfo), Ru(t, e, n), zu = o, Vu(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Yh(t.containerInfo);
				} catch (t) {
					Df(e, e.return, t);
				}
				gu && (gu = !1, Hu(e)), rn = !1;
				break;
			case 4:
				a = hu, hu = pu, r = an(), o = zu, zu = Fm(e.stateNode.containerInfo), Ru(t, e, n), Vu(e), zu = o, rn && bu && (xu = !0), rn = r, hu = a;
				break;
			case 12:
				Ru(t, e, n), Vu(e);
				break;
			case 31:
				Ru(t, e, n), Vu(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Lu(e, t)));
				break;
			case 13:
				Ru(t, e, n), Vu(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (Dd = Qe()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Lu(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = pu, l = mu, u = hu;
				pu = c || o, hu = u || o, mu = l || s, Ru(t, e, n), mu = l, hu = u, pu = c, Vu(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || pu || mu || (t = s || mu, n = pu, r = mu, pu = o || pu, mu = t, Ku(e, 2), pu = n, mu = r), !o && hu || Eu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, Lu(e, n))));
				break;
			case 19:
				Ru(t, e, n), Vu(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Lu(e, t)));
				break;
			case 30:
				a & 512 && (mu || r === null || Ll(r, r.return)), a = an(), o = bu, s = (n & 335544064) === n, c = e.memoizedProps, bu = s && Ai(c.default, c.update) !== "none", Ru(t, e, n), Vu(e), s && r !== null && rn && (e.flags |= 4), bu = o, rn = a;
				break;
			case 21: break;
			case 7: a & 512 && (mu || r === null || Ll(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: Ru(t, e, n), Vu(e);
		}
	}
	function Vu(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Wl(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (Vl(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (Bl(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						ql(e, Gl(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (Sn(l, ""), n.flags &= -33), ql(e, Gl(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						Kl(e, Gl(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				Df(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Hu(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Hu(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, Ch = !0, t.reset(), Ch = !1), e = e.sibling;
		}
	}
	function Uu(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Wu(t, e), t = t.sibling;
		else fu(t, !1);
	}
	function Wu(e, t) {
		var n = e.alternate;
		if (n === null) iu(e, !1);
		else switch (e.tag) {
			case 3:
				if (Su = yu = !1, $l(), Uu(t, e), !yu && !xu) {
					if (e = Ql, e !== null) for (var r = 0; r < e.length; r += 3) {
						n = e[r];
						var i = e[r + 1];
						Vp(n, e[r + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate({
							opacity: [0, 0],
							pointerEvents: ["none", "none"]
						}, {
							duration: 0,
							fill: "forwards",
							pseudoElement: "::view-transition-group(" + i + ")"
						});
					}
					e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate({
						opacity: [0, 0],
						pointerEvents: ["none", "none"]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition-group(root)"
					}), e.animate({
						width: [0, 0],
						height: [0, 0]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition"
					})), Su = !0;
				}
				Ql = null;
				break;
			case 5:
				Uu(t, e);
				break;
			case 4:
				r = yu, yu = !1, Uu(t, e), yu && (xu = !0), yu = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? Uu(t, e) : iu(e, !1));
				break;
			case 30:
				r = yu, i = $l(), yu = !1, Uu(t, e), yu && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = Oi(a, o), o = Oi(n.memoizedProps, o);
				var s = Ai(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, F = 0, t = du(e, n, t, o, s, a, !0), F !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (Kd(e, e.memoizedProps.onUpdate), Ql = i) : i !== null && (i.push.apply(i, Ql), Ql = i), yu = e.flags & 32 ? !0 : r;
				break;
			default: Uu(t, e);
		}
	}
	function Gu(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) Tu(e, t.alternate, t), t = t.sibling;
	}
	function Ku(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Nl(4, n, n.return), Ku(n, r);
					break;
				case 1:
					Ll(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && Fl(n, n.return, i), Ku(n, r);
					break;
				case 27: r & 2 && jm(n.stateNode, n.type, n.memoizedProps);
				case 5:
					Ll(n, n.return), n.tag !== 5 && n.tag !== 27 || P(n), Ku(n, r);
					break;
				case 6:
					P(n);
					break;
				case 26:
					Ll(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || mu || i.parentNode.removeChild(i), Ku(n, r);
					break;
				case 22:
					n.memoizedState === null && Ku(n, r);
					break;
				case 30:
					Ll(n, n.return), Ku(n, r);
					break;
				case 7: Ll(n, n.return);
				default: Ku(n, r);
			}
			e = e.sibling;
		}
	}
	function qu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					qu(i, a, n), Ml(4, a);
					break;
				case 1:
					if (qu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Df(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) Fo(l[i], c);
						} catch (e) {
							Df(r, r.return, e);
						}
					}
					s && o & 64 && Pl(a), Il(a, a.return);
					break;
				case 27: n & 2 && Jl(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || zl(a), qu(i, a, n), s && r === null && o & 4 && Hl(a), Il(a, a.return);
					break;
				case 6:
					zl(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || pu || th(Fm(c.ownerDocument), a.type, c), qu(i, a, n), s && r === null && o & 4 && Hl(a), Il(a, a.return);
					break;
				case 12:
					qu(i, a, n);
					break;
				case 31:
					qu(i, a, n), s && o & 4 && Pu(i, a);
					break;
				case 13:
					qu(i, a, n), s && o & 4 && Fu(i, a);
					break;
				case 22:
					a.memoizedState === null && qu(i, a, n), Il(a, a.return);
					break;
				case 30:
					qu(i, a, n), Il(a, a.return);
					break;
				case 7: Il(a, a.return);
				default: qu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Ju(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Wa(n));
	}
	function Yu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Wa(e));
	}
	function Xu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Zu(e, t, n, r), t = t.sibling;
		else i && uu(t);
	}
	function Zu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && lu(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Xu(e, t, n, r), a & 2048 && Ml(9, t);
				break;
			case 1:
				Xu(e, t, n, r);
				break;
			case 3:
				Xu(e, t, n, r), i && Su && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && Wa(a)));
				break;
			case 12:
				if (a & 2048) {
					Xu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						Df(t, t.return, e);
					}
				} else Xu(e, t, n, r);
				break;
			case 31:
				Xu(e, t, n, r);
				break;
			case 13:
				Xu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && lu(t), o._visibility & 2 ? Xu(e, t, n, r) : (o._visibility |= 2, Qu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && lu(s), o._visibility & 2 ? Xu(e, t, n, r) : $u(e, t)), a & 2048 && Ju(s, t);
				break;
			case 24:
				Xu(e, t, n, r), a & 2048 && Yu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (nu(a.child, !0), nu(t.child, !0))), Xu(e, t, n, r);
				break;
			default: Xu(e, t, n, r);
		}
	}
	function Qu(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Qu(a, o, s, c, i), Ml(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Qu(a, o, s, c, i)) : u._visibility & 2 ? Qu(a, o, s, c, i) : $u(a, o), i && l & 2048 && Ju(o.alternate, o);
					break;
				case 24:
					Qu(a, o, s, c, i), i && l & 2048 && Yu(o.alternate, o);
					break;
				default: Qu(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function $u(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					$u(n, r), i & 2048 && Ju(r.alternate, r);
					break;
				case 24:
					$u(n, r), i & 2048 && Yu(r.alternate, r);
					break;
				default: $u(n, r);
			}
			t = t.sibling;
		}
	}
	var ed = 8192;
	function td(e, t, n) {
		if (e.subtreeFlags & ed) for (e = e.child; e !== null;) nd(e, t, n), e = e.sibling;
	}
	function nd(e, t, n) {
		switch (e.tag) {
			case 26:
				td(e, t, n), e.flags & ed && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && ih(n, e)) : ah(n, zu, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				td(e, t, n), e.flags & ed && (e = e.stateNode, (t & 335544128) === t && ih(n, e));
				break;
			case 3:
			case 4:
				var r = zu;
				zu = Fm(e.stateNode.containerInfo), td(e, t, n), zu = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = ed, ed = 16777216, td(e, t, n), ed = r) : td(e, t, n));
				break;
			case 30:
				if ((e.flags & ed) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Xl === null && (Xl = /* @__PURE__ */ new Map()), Xl.set(r, i);
				}
				td(e, t, n);
				break;
			default: td(e, t, n);
		}
	}
	function rd(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function id(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				vu = r, sd(r, e);
			}
			rd(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) ad(e), e = e.sibling;
	}
	function ad(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				id(e), e.flags & 2048 && Nl(9, e, e.return);
				break;
			case 3:
				id(e);
				break;
			case 12:
				id(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, od(e)) : id(e);
				break;
			default: id(e);
		}
	}
	function od(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				vu = r, sd(r, e);
			}
			rd(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Nl(8, t, t.return), od(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, od(t));
					break;
				default: od(t);
			}
			e = e.sibling;
		}
	}
	function sd(e, t) {
		for (; vu !== null;) {
			var n = vu;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Nl(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: Wa(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, vu = r;
			else a: for (n = e; vu !== null;) {
				r = vu;
				var i = r.sibling, a = r.return;
				if (ku(r), r === n) {
					vu = null;
					break a;
				}
				if (i !== null) {
					i.return = a, vu = i;
					break a;
				}
				vu = a;
			}
		}
	}
	var cd = {
		getCacheForType: function(e) {
			var t = Ia(Ha), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return Ia(Ha).controller.signal;
		}
	}, ld = typeof WeakMap == "function" ? WeakMap : Map, ud = 0, dd = null, I = null, L = 0, fd = 0, pd = null, md = !1, hd = !1, gd = !1, _d = 0, vd = 0, yd = 0, bd = 0, xd = 0, Sd = 0, Cd = 0, wd = null, Td = null, Ed = !1, Dd = 0, Od = 0, kd = Infinity, Ad = null, jd = null, Md = 0, Nd = null, Pd = null, Fd = 0, Id = 0, Ld = null, Rd = null, zd = null, Bd = null, Vd = null, Hd = 0, Ud = null;
	function Wd() {
		return ud & 2 && L !== 0 ? L & -L : S.T === null ? At() : Jf();
	}
	function Gd() {
		if (Sd === 0) {
			if (!(L & 536870912) || E) {
				var e = mt;
				mt <<= 1, !(mt & 3932160) && (mt = 262144), Sd = e;
			} else Sd = 536870912;
		}
		return e = Ho.current, e !== null && (e.flags |= 32), Sd;
	}
	function Kd(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Yp(Oi(e.memoizedProps, n))), Bd === null && (Bd = []), Bd.push(t.bind(null, r));
		}
	}
	function qd(e, t, n) {
		(e === dd && (fd === 2 || fd === 9) || e.cancelPendingCommit !== null) && (ef(e, 0), Zd(e, L, Sd, !1)), Ct(e, n), (!(ud & 2) || e !== dd) && (e === dd && (!(ud & 2) && (bd |= n), vd === 4 && Zd(e, L, Sd, !1)), Bf(e));
	}
	function Jd(e, t, n) {
		if (ud & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || vt(e, t), a = r ? lf(e, t) : sf(e, t, !0), o = r;
		do {
			if (a === 0) {
				hd && !r && Zd(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !Xd(n)) a = sf(e, t, !1), o = !1;
			else {
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = wd;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (ef(c, s).flags |= 256), s = sf(c, s, !1), s !== 2 && s !== 6) {
								if (gd && !l) {
									c.errorRecoveryDisabledLanes |= o, bd |= o, a = 4;
									break a;
								}
								o = Td, Td = a, o !== null && (Td === null ? Td = o : Td.push.apply(Td, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					ef(e, 0), Zd(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
						case 6:
							Zd(r, t, Sd, !md);
							break a;
						case 2:
							Td = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = Dd + 300 - Qe(), 10 < a)) {
						if (Zd(r, t, Sd, !md), _t(r, 0, !0) !== 0) break a;
						Fd = t, r.timeoutHandle = jp(Yd.bind(null, r, n, Td, Ad, Ed, t, Sd, bd, Cd, md, o, "Throttled", -0, 0), a);
						break a;
					}
					Yd(r, n, Td, Ad, Ed, t, Sd, bd, Cd, md, o, null, -0, 0);
				}
				break;
			}
		} while (1);
		Bf(e);
	}
	function Yd(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		e.timeoutHandle = -1;
		var m = t.subtreeFlags, h = (a & 335544064) === a;
		d = null, (h || m & 8192 || (m & 16785408) == 16785408) && (d = {
			stylesheets: null,
			count: 0,
			imgCount: 0,
			imgBytes: 0,
			suspenseyImages: [],
			waitingForImages: !0,
			waitingForViewTransition: !1,
			unsuspend: An
		}, Xl = null, nd(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = lh.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? Dd - Qe() : (a & 4194048) === a ? Od - Qe() : 0, m = sh(d, m), m !== null) ? (Fd = a, e.cancelPendingCommit = m(gf.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Zd(e, a, o, !l)) : gf(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Xd(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Qr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function Zd(e, t, n, r) {
		t = yt(e, t), t &= ~xd, t &= ~bd, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - lt(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && Tt(e, n, t);
	}
	function Qd() {
		return ud & 6 ? !0 : (Vf(0, !1), !1);
	}
	function $d() {
		if (I !== null) {
			if (fd === 0) var e = I.return;
			else e = I, Oa = Da = null, gs(e), _o = null, vo = 0, e = I;
			for (; e !== null;) jl(e.alternate, e), e = e.return;
			I = null;
		}
	}
	function ef(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, Mp(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Fd = 0, $d(), dd = e, I = n = Gi(e.current, null), L = t, fd = 0, pd = null, md = !1, hd = vt(e, t), gd = !1, Cd = Sd = xd = bd = yd = vd = 0, Td = wd = null, Ed = !1, _d = yt(e, t), Fi(), n;
	}
	function tf(e, t) {
		D = null, S.H = Cc, t === oo || t === co ? (t = ho(), fd = 3) : t === so ? (t = ho(), fd = 4) : fd = t === Uc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, pd = t, I === null && (vd = 1, Rc(e, $i(t, e.current)));
	}
	function nf() {
		var e = Ho.current;
		return e === null ? !0 : (L & 4194048) === L ? Uo === null : (L & 62914560) === L || L & 536870912 ? e === Uo : !1;
	}
	function rf() {
		var e = S.H;
		return S.H = Cc, e === null ? Cc : e;
	}
	function af() {
		var e = S.A;
		return S.A = cd, e;
	}
	function of() {
		vd = 4, md || (L & 4194048) !== L && Ho.current !== null || (hd = !0), !(yd & 134217727) && !(bd & 134217727) || dd === null || Zd(dd, L, Sd, !1);
	}
	function sf(e, t, n) {
		var r = ud;
		ud |= 2;
		var i = rf(), a = af();
		(dd !== e || L !== t) && (Ad = null, ef(e, t)), t = !1;
		var o = vd;
		a: do
			try {
				if (fd !== 0 && I !== null) {
					var s = I, c = pd;
					switch (fd) {
						case 8:
							$d(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							Ho.current === null && (t = !0);
							var l = fd;
							if (fd = 0, pd = null, pf(e, s, c, l), n && hd) {
								o = 0;
								break a;
							}
							break;
						default: l = fd, fd = 0, pd = null, pf(e, s, c, l);
					}
				}
				cf(), o = vd;
				break;
			} catch (t) {
				tf(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, Oa = Da = null, ud = r, S.H = i, S.A = a, I === null && (dd = null, L = 0, Fi()), o;
	}
	function cf() {
		for (; I !== null;) df(I);
	}
	function lf(e, t) {
		var n = ud;
		ud |= 2;
		var r = rf(), a = af();
		dd !== e || L !== t ? (Ad = null, kd = Qe() + 500, ef(e, t)) : hd = vt(e, t);
		a: do
			try {
				if (fd !== 0 && I !== null) {
					t = I;
					var o = pd;
					b: switch (fd) {
						case 1:
							fd = 0, pd = null, pf(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (uo(o)) {
								fd = 0, pd = null, ff(t);
								break;
							}
							t = function() {
								fd !== 2 && fd !== 9 || dd !== e || (fd = 7), Bf(e);
							}, o.then(t, t);
							break a;
						case 3:
							fd = 7;
							break a;
						case 4:
							fd = 5;
							break a;
						case 7:
							uo(o) ? (fd = 0, pd = null, ff(t)) : (fd = 0, pd = null, pf(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (I.tag) {
								case 26: s = I.memoizedState;
								case 5:
								case 27:
									var c = I;
									if (s ? K(s) : c.stateNode.complete) {
										fd = 0, pd = null;
										var l = c.sibling;
										if (l !== null) I = l;
										else {
											var u = c.return;
											u === null ? I = null : (I = u, mf(u));
										}
										break b;
									}
							}
							fd = 0, pd = null, pf(e, t, o, 5);
							break;
						case 6:
							fd = 0, pd = null, pf(e, t, o, 6);
							break;
						case 8:
							$d(), vd = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				uf();
				break;
			} catch (t) {
				tf(e, t);
			}
		while (1);
		return Oa = Da = null, S.H = r, S.A = a, ud = n, I === null ? (dd = null, L = 0, Fi(), vd) : 0;
	}
	function uf() {
		for (; I !== null && !Xe();) df(I);
	}
	function df(e) {
		var t = Sl(e.alternate, e, _d);
		e.memoizedProps = e.pendingProps, t === null ? mf(e) : I = t;
	}
	function ff(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = rl(n, t, t.pendingProps, t.type, void 0, L);
				break;
			case 11:
				t = rl(n, t, t.pendingProps, t.type.render, t.ref, L);
				break;
			case 5:
				gs(t);
				var r = t;
				r === ma && (E ? (xa(r), r.tag === 5 && r.stateNode != null && (ha = r.stateNode)) : (xa(r), E = !0));
			default: jl(n, t), t = I = Ki(t, _d), t = Sl(n, t, _d);
		}
		e.memoizedProps = e.pendingProps, t === null ? mf(e) : I = t;
	}
	function pf(e, t, n, r) {
		Oa = Da = null, gs(t), _o = null, vo = 0;
		var i = t.return;
		try {
			if (M(e, i, t, n, L)) {
				vd = 1, Rc(e, $i(n, e.current)), I = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw I = i, t;
			vd = 1, Rc(e, $i(n, e.current)), I = null;
			return;
		}
		t.flags & 32768 ? (E || r === 1 ? e = !0 : hd || L & 536870912 ? e = !1 : (md = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = Ho.current, r !== null && r.tag === 13 && (r.flags |= 16384))), hf(t, e)) : mf(t);
	}
	function mf(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				hf(t, md);
				return;
			}
			e = t.return;
			var n = kl(t.alternate, t, _d);
			if (n !== null) {
				I = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				I = t;
				return;
			}
			I = t = e;
		} while (t !== null);
		vd === 0 && (vd = 5);
	}
	function hf(e, t) {
		do {
			var n = Al(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, I = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				I = e;
				return;
			}
			I = e = n;
		} while (e !== null);
		vd = 6, I = null;
	}
	function gf(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			wf();
		while (Md !== 0);
		if (ud & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === dd && (I = dd = null, L = 0), Pd = t, Nd = e, Fd = n, Ld = a, Rd = r, _f(e, t, n, s, c, l, f);
		}
	}
	function _f(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (Id = s, s |= Pi, wt(e, n, s, r, i, a), Bd = null, (n & 335544064) === n ? (Vd = qa(e), r = 10262) : (Vd = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, Nf(tt, function() {
			return Tf(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), Yl = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = S.T, S.T = null, i = Ee.p, Ee.p = 2, a = ud, ud |= 4;
			try {
				Cu(e, t, n);
			} finally {
				ud = a, Ee.p = i, S.T = r;
			}
		}
		Md = 1, Yl ? zd = qp(o, e.containerInfo, Vd, bf, xf, yf, Sf, Tf, vf, null, null) : (bf(), xf(), Sf());
	}
	function vf(e) {
		if (Md !== 0) {
			var t = Nd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function yf() {
		Md === 3 && (Md = 0, Wu(Pd, Nd), Md = 4);
	}
	function bf() {
		if (Md === 1) {
			Md = 0;
			var e = Nd, t = Pd, n = Fd, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = S.T, S.T = null;
				var i = Ee.p;
				Ee.p = 2;
				var a = ud;
				ud |= 4;
				try {
					bu = xu = !1, Bu(t, e, n), n = Cp;
					var o = ii(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && ri(s.ownerDocument.documentElement, s)) {
						if (c !== null && ai(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = ni(s, h), v = ni(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var ee = d[s];
							ee.element.scrollLeft = ee.left, ee.element.scrollTop = ee.top;
						}
					}
					Ch = !!Sp, Cp = Sp = null;
				} finally {
					ud = a, Ee.p = i, S.T = r;
				}
			}
			e.current = t, Md = 2;
		}
	}
	function xf() {
		if (Md === 2) {
			Md = 0;
			var e = Nd, t = Pd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = S.T, S.T = null;
				var r = Ee.p;
				Ee.p = 2;
				var i = ud;
				ud |= 4;
				try {
					Tu(e, t.alternate, t);
				} finally {
					ud = i, Ee.p = r, S.T = n;
				}
			}
			Md = 3;
		}
	}
	function Sf() {
		if (Md === 4 || Md === 3) {
			Md = 0;
			var e = zd;
			zd = null, Ze();
			var t = Nd, n = Pd, r = Fd, i = Rd, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? Md = 5 : (Md = 0, Pd = Nd = null, Cf(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (jd = null), kt(r), n = n.stateNode, st && typeof st.onCommitFiberRoot == "function") try {
				st.onCommitFiberRoot(ot, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = S.T, a = Ee.p, Ee.p = 2, S.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					S.T = n, Ee.p = a;
				}
			}
			if (i = Bd, o = Vd, Vd = null, i !== null && (Bd = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			Fd & 3 && wf(), Bf(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === Ud ? Hd++ : (Hd = 0, Ud = t) : (Hd = 0, Ud = null), Vf(0, !1);
		}
	}
	function Cf(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Wa(t)));
	}
	function wf() {
		return zd !== null && (zd.skipTransition(), zd = null), bf(), xf(), Sf(), Tf();
	}
	function Tf() {
		if (Md !== 5) return !1;
		var e = Nd, t = Id;
		Id = 0;
		var n = kt(Fd), r = S.T, a = Ee.p;
		try {
			Ee.p = 32 > n ? 32 : n, S.T = null, n = Ld, Ld = null;
			var o = Nd, s = Fd;
			if (Md = 0, Pd = Nd = null, Fd = 0, ud & 6) throw Error(i(331));
			var c = ud;
			if (ud |= 4, ad(o.current), Zu(o, o.current, s, n), ud = c, Vf(0, !1), st && typeof st.onPostCommitFiberRoot == "function") try {
				st.onPostCommitFiberRoot(ot, o);
			} catch {}
			return !0;
		} finally {
			Ee.p = a, S.T = r, Cf(e, t);
		}
	}
	function Ef(e, t, n) {
		t = $i(n, t), t = Bc(e.stateNode, t, 2), e = ko(e, t, 2), e !== null && (Ct(e, 2), Bf(e));
	}
	function Df(e, t, n) {
		if (e.tag === 3) Ef(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				Ef(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (jd === null || !jd.has(r))) {
					e = $i(n, e), n = Vc(2), r = ko(t, n, 2), r !== null && (Hc(n, r, t, e), Ct(r, 2), Bf(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function Of(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new ld();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (gd = !0, i.add(n), e = kf.bind(null, e, t, n), t.then(e, e));
	}
	function kf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, dd === e && (L & n) === n && (vd === 4 || vd === 3 && (L & 62914560) === L && 300 > Qe() - Dd ? ud & 2 ? xd |= n : ef(e, 0) : xd |= n, Cd === L && (Cd = 0)), Bf(e);
	}
	function Af(e, t) {
		t === 0 && (t = xt()), e = Ri(e, t), e !== null && (Ct(e, t), Bf(e));
	}
	function jf(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), Af(e, n);
	}
	function Mf(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), Af(e, n);
	}
	function Nf(e, t) {
		return Je(e, t);
	}
	var Pf = null, Ff = null, If = !1, Lf = !1, Rf = !1, zf = 0;
	function Bf(e) {
		e !== Ff && e.next === null && (Ff === null ? Pf = Ff = e : Ff = Ff.next = e), Lf = !0, If || (If = !0, qf());
	}
	function Vf(e, t) {
		if (!Rf && Lf) {
			Rf = !0;
			do
				for (var n = !1, r = Pf; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - lt(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, Kf(r, a));
						} else a = L, a = _t(r, r === dd ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || vt(r, a) || (n = !0, Kf(r, a));
					}
					r = r.next;
				}
			while (n);
			Rf = !1;
		}
	}
	function Hf() {
		Uf();
	}
	function Uf() {
		Lf = If = !1;
		var e = 0;
		zf !== 0 && Ap() && (e = zf);
		for (var t = Qe(), n = null, r = Pf; r !== null;) {
			var i = r.next, a = Wf(r, t);
			a === 0 ? (r.next = null, n === null ? Pf = i : n.next = i, i === null && (Ff = n)) : (n = r, (e !== 0 || a & 3) && (Lf = !0)), r = i;
		}
		Md !== 0 && Md !== 5 || Vf(e, !1), zf !== 0 && (zf = 0);
	}
	function Wf(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - lt(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = bt(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = dd, n = L, n = _t(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (fd === 2 || fd === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Ye(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || vt(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Ye(r), kt(n)) {
				case 2:
				case 8:
					n = w;
					break;
				case 32:
					n = tt;
					break;
				case 268435456:
					n = rt;
					break;
				default: n = tt;
			}
			return r = Gf.bind(null, e), n = Je(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Ye(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function Gf(e, t) {
		if (Md !== 0 && Md !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (wf() && e.callbackNode !== n) return null;
		var r = L;
		return r = _t(e, e === dd ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Jd(e, r, t), Wf(e, Qe()), e.callbackNode != null && e.callbackNode === n ? Gf.bind(null, e) : null);
	}
	function Kf(e, t) {
		if (wf()) return null;
		Jd(e, t, !0);
	}
	function qf() {
		Fp(function() {
			ud & 6 ? Je(et, Hf) : Uf();
		});
	}
	function Jf() {
		if (zf === 0) {
			var e = Xa;
			e === 0 && (e = pt, pt <<= 1, !(pt & 261888) && (pt = 256)), zf = e;
		}
		return zf;
	}
	function Yf(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : kn(e);
	}
	function Xf(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = Yf((i[Pt] || null).action), o = r.submitter;
			o && (t = (t = o[Pt] || null) ? Yf(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new Xn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (zf !== 0) {
								var e = new FormData(i, o);
								lc(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), lc(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var Zf = 0; Zf < Ti.length; Zf++) {
		var Qf = Ti[Zf];
		Ei(Qf.toLowerCase(), "on" + (Qf[0].toUpperCase() + Qf.slice(1)));
	}
	Ei(_i, "onAnimationEnd"), Ei(vi, "onAnimationIteration"), Ei(yi, "onAnimationStart"), Ei("dblclick", "onDoubleClick"), Ei("focusin", "onFocus"), Ei("focusout", "onBlur"), Ei(bi, "onTransitionRun"), Ei(xi, "onTransitionStart"), Ei(Si, "onTransitionCancel"), Ei(Ci, "onTransitionEnd"), Qt("onMouseEnter", ["mouseout", "mouseover"]), Qt("onMouseLeave", ["mouseout", "mouseover"]), Qt("onPointerEnter", ["pointerout", "pointerover"]), Qt("onPointerLeave", ["pointerout", "pointerover"]), Zt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Zt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Zt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Zt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Zt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Zt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var $f = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), ep = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat($f));
	function tp(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						ji(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						ji(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function R(e, t) {
		var n = t[It];
		n === void 0 && (n = t[It] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (ap(t, e, 2, !1), n.add(r));
	}
	function np(e, t, n) {
		var r = 0;
		t && (r |= 4), ap(n, e, r, t);
	}
	var rp = "_reactListening" + Math.random().toString(36).slice(2);
	function ip(e) {
		if (!e[rp]) {
			e[rp] = !0, Yt.forEach(function(t) {
				t !== "selectionchange" && (ep.has(t) || np(t, !1, e), np(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[rp] || (t[rp] = !0, np("selectionchange", !1, t));
		}
	}
	function ap(e, t, n, r) {
		switch (Ah(t)) {
			case 2:
				var i = wh;
				break;
			case 8:
				i = Th;
				break;
			default: i = Eh;
		}
		n = i.bind(null, t, n, e), i = void 0, !zn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function op(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = Ut(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		Ln(function() {
			var r = a, i = Mn(n), s = [];
			a: {
				var c = wi.get(e);
				if (c !== void 0) {
					var l = Xn, u = e;
					switch (e) {
						case "keypress": if (Gn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = mr;
							break;
						case "focusin":
							u = "focus", l = ar;
							break;
						case "focusout":
							u = "blur", l = ar;
							break;
						case "beforeblur":
						case "afterblur":
							l = ar;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = rr;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = ir;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = _r;
							break;
						case _i:
						case vi:
						case yi:
							l = or;
							break;
						case Ci:
							l = vr;
							break;
						case "scroll":
						case "scrollend":
							l = Qn;
							break;
						case "wheel":
							l = yr;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = sr;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = hr;
							break;
						case "submit":
							l = gr;
							break;
						case "toggle":
						case "beforetoggle": l = br;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = Rn(m, p), g != null && d.push(sp(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== jn && (u = n.relatedTarget || n.fromElement) && (Ut(u) || u[Ft])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? Ut(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = rr, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = hr, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : Gt(c), h = l == null ? u : Gt(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, Ut(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? re(c, l, lp) : null, c !== null && up(s, u, c, d, !1), l !== null && f !== null && up(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? Gt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = Br;
					else if (Pr(c)) {
						if (Vr) _ = Xr;
						else {
							_ = Jr;
							var v = qr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && En(r.elementType) && (_ = Br) : _ = Yr;
					if (_ &&= _(e, r)) {
						Fr(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? Gt(r) : window, e) {
					case "focusin":
						(Pr(v) || v.contentEditable === "true") && (si = v, ci = r, li = null);
						break;
					case "focusout":
						li = ci = si = null;
						break;
					case "mousedown":
						ui = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						ui = !1, di(s, n, i);
						break;
					case "selectionchange": if (oi) break;
					case "keydown":
					case "keyup": di(s, n, i);
				}
				var y;
				if (Sr) b: {
					switch (e) {
						case "compositionstart":
							var ee = "onCompositionStart";
							break b;
						case "compositionend":
							ee = "onCompositionEnd";
							break b;
						case "compositionupdate":
							ee = "onCompositionUpdate";
							break b;
					}
					ee = void 0;
				}
				else Ar ? Or(e, n) && (ee = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (ee = "onCompositionStart");
				ee && (Tr && n.locale !== "ko" && (Ar || ee !== "onCompositionStart" ? ee === "onCompositionEnd" && Ar && (y = Wn()) : (Vn = i, Hn = "value" in Vn ? Vn.value : Vn.textContent, Ar = !0)), v = cp(r, ee), 0 < v.length && (ee = new cr(ee, e, null, n, i), s.push({
					event: ee,
					listeners: v
				}), y ? ee.data = y : (y = kr(n), y !== null && (ee.data = y)))), (y = wr ? jr(e, n) : Mr(e, n)) && (ee = cp(r, "onBeforeInput"), 0 < ee.length && (v = new cr("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: v,
					listeners: ee
				}), v.data = y)), Xf(s, e, r, n, i);
			}
			tp(s, t);
		});
	}
	function sp(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function cp(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = Rn(e, n), i != null && r.unshift(sp(e, i, a)), i = Rn(e, t), i != null && r.push(sp(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function lp(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function up(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = Rn(n, a), l != null && o.unshift(sp(n, l, c))) : i || (l = Rn(n, a), l != null && o.push(sp(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var dp = /\r\n?/g, fp = /\u0000|\uFFFD/g;
	function pp(e) {
		return (typeof e == "string" ? e : "" + e).replace(dp, "\n").replace(fp, "");
	}
	function mp(e, t) {
		return t = pp(t), pp(e) === t;
	}
	function hp(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || Sn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && Sn(e, "" + r);
				else return;
				break;
			case "className":
				sn(e, "class", r);
				break;
			case "tabIndex":
				sn(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				sn(e, n, r);
				break;
			case "style":
				Tn(e, r, o);
				return;
			case "data": if (t !== "object") {
				sn(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href") || r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = kn(r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && hp(e, t, "name", a.name, a, null), hp(e, t, "formEncType", a.formEncType, a, null), hp(e, t, "formMethod", a.formMethod, a, null), hp(e, t, "formTarget", a.formTarget, a, null)) : (hp(e, t, "encType", a.encType, a, null), hp(e, t, "method", a.method, a, null), hp(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = kn(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = An);
				return;
			case "onScroll":
				r != null && R("scroll", e);
				return;
			case "onScrollEnd":
				r != null && R("scrollend", e);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = kn(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "credentialless":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				R("beforetoggle", e), R("toggle", e), on(e, "popover", r);
				break;
			case "xlinkActuate":
				cn(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				cn(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				cn(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				cn(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				cn(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				cn(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				cn(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				cn(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				cn(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				on(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = Dn.get(n) || n, on(e, n, r);
			else return;
		}
		rn = !0;
	}
	function gp(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				Tn(e, r, o);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "children":
				if (typeof r == "string") Sn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") Sn(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && R("scroll", e);
				return;
			case "onScrollEnd":
				r != null && R("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = An);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!Xt.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[Pt] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					rn = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : on(e, n, r);
				}
				return;
		}
		rn = !0;
	}
	function _p(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				R("error", e), R("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: hp(e, t, o, s, n, null);
					}
				}
				a && hp(e, t, "srcSet", n.srcSet, n, null), r && hp(e, t, "src", n.src, n, null);
				return;
			case "input":
				R("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: hp(e, t, r, d, n, null);
					}
				}
				_n(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in R("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: hp(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && yn(e, !!r, n, !0) : yn(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in R("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: hp(e, t, s, c, n, null);
				}
				xn(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: hp(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				R("beforetoggle", e), R("toggle", e), R("cancel", e), R("close", e);
				break;
			case "iframe":
			case "object":
				R("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < $f.length; r++) R($f[r], e);
				break;
			case "image":
				R("error", e), R("load", e);
				break;
			case "details":
				R("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": R("error", e), R("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: hp(e, t, u, r, n, null);
				}
				return;
			default: if (En(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && gp(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && hp(e, t, c, r, n, null));
	}
	var vp = {};
	function yp(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || hp(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							m !== f && (rn = !0), o = m;
							break;
						case "name":
							m !== f && (rn = !0), a = m;
							break;
						case "checked":
							m !== f && (rn = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (rn = !0), d = m;
							break;
						case "value":
							m !== f && (rn = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (rn = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && hp(e, t, p, m, r, f);
					}
				}
				gn(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || hp(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (rn = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (rn = !0), c = o;
						break;
					case "multiple": o !== l && (rn = !0), s = o;
					default: o !== l && hp(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? yn(e, !!n, n ? [] : "", !1) : yn(e, !!n, t, !0)) : yn(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: hp(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (rn = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (rn = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && hp(e, t, s, a, r, o);
				}
				bn(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: hp(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						p !== m && (rn = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: hp(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && hp(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: hp(e, t, u, p, r, m);
				}
				return;
			default: if (En(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && gp(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || gp(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && hp(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || hp(e, t, f, p, r, m);
	}
	function bp(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function xp() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && bp(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && bp(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var Sp = null, Cp = null;
	function wp(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function Tp(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function Ep(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function Dp(e, t, n, r) {
		return n = wp(n).createElement(e), n[Nt] = r, n[Pt] = t, _p(n, e, t), qt(n), n;
	}
	function Op(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var kp = null;
	function Ap() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== kp && (kp = e, !0) : (kp = null, !1);
	}
	var jp = typeof setTimeout == "function" ? setTimeout : void 0, Mp = typeof clearTimeout == "function" ? clearTimeout : void 0, Np = typeof Promise == "function" ? Promise : void 0, Pp = typeof requestAnimationFrame == "function" ? requestAnimationFrame : jp, Fp = typeof queueMicrotask == "function" ? queueMicrotask : Np === void 0 ? jp : function(e) {
		return Np.resolve(null).then(e).catch(Ip);
	};
	function Ip(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Lp(e) {
		return e === "head";
	}
	function Rp(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Yh(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") Mm(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, Mm(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[Bt] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && Mm(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Yh(t);
	}
	function zp(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function Bp(e, t, n) {
		if (t = CSS.escape(t) === t ? t : "r-" + btoa(t).replace(/=/g, ""), e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
			if (t = e.getClientRects(), t.length === 1) var r = 1;
			else for (var i = r = 0; i < t.length; i++) {
				var a = t[i];
				0 < a.width && 0 < a.height && r++;
			}
			r === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
		}
	}
	function Vp(e, t) {
		e = e.style, t = t.style;
		var n = t == null ? null : t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null;
		e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t == null ? null : t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n == null ? (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t) : e.margin = n));
	}
	function Hp(e, t, n) {
		return n = n.ownerDocument.defaultView, {
			rect: e,
			abs: t.position === "absolute" || t.position === "fixed",
			clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
			view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
		};
	}
	function Up(e) {
		return Hp(e.getBoundingClientRect(), getComputedStyle(e), e);
	}
	function Wp(e) {
		var t = e.getBoundingClientRect();
		t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
		var n = getComputedStyle(e);
		return Hp(t, n, e);
	}
	function Gp(e) {
		return e.documentElement.clientHeight;
	}
	function Kp(e) {
		this.addEventListener("load", e), this.addEventListener("error", e);
	}
	function qp(e, t, n, r, i, a, o, s, c) {
		var l = t.nodeType === 9 ? t : t.ownerDocument;
		try {
			var u = l.startViewTransition({
				update: function() {
					var t = l.defaultView, n = t.navigation && t.navigation.transition, o = l.fonts.status;
					r();
					var s = [];
					if (o === "loaded" && (Gp(l), l.fonts.status === "loading" && s.push(l.fonts.ready)), o = s.length, e !== null) for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
						var f = c[d];
						if (!f.complete) {
							var p = f.getBoundingClientRect();
							if (0 < p.bottom && 0 < p.right && p.top < t.innerHeight && p.left < t.innerWidth) {
								if (u += rh(f), u > oh) {
									s.length = o;
									break;
								}
								f = new Promise(Kp.bind(f)), s.push(f);
							}
						}
					}
					if (0 < s.length) return t = Promise.race([Promise.all(s), new Promise(function(e) {
						return setTimeout(e, 500);
					})]).then(i, i), (n ? Promise.allSettled([n.finished, t]) : t).then(a, a);
					if (i(), n) return n.finished.then(a, a);
					a();
				},
				types: n
			});
			l.__reactViewTransition = u;
			var d = [];
			return u.ready.then(function() {
				for (var e = l.documentElement.getAnimations({ subtree: !0 }), t = 0; t < e.length; t++) {
					var n = e[t], r = n.effect, i = r.pseudoElement;
					if (i != null && i.startsWith("::view-transition")) {
						d.push(n), n = r.getKeyframes();
						for (var a = i = void 0, s = !0, c = 0; c < n.length; c++) {
							var u = n[c], f = u.width;
							if (i === void 0) i = f;
							else if (i !== f) {
								s = !1;
								break;
							}
							if (f = u.height, a === void 0) a = f;
							else if (a !== f) {
								s = !1;
								break;
							}
							delete u.width, delete u.height, u.transform === "none" && delete u.transform;
						}
						s && i !== void 0 && a !== void 0 && (r.setKeyframes(n), s = getComputedStyle(r.target, r.pseudoElement), s.width !== i || s.height !== a) && (s = n[0], s.width = i, s.height = a, s = n[n.length - 1], s.width = i, s.height = a, r.setKeyframes(n));
					}
				}
				o();
			}, function(e) {
				l.__reactViewTransition === u && (l.__reactViewTransition = null);
				try {
					if (typeof e == "object" && e) switch (e.name) {
						case "InvalidStateError": (e.message === "View transition was skipped because document visibility state is hidden." || e.message === "Skipping view transition because document visibility state has become hidden." || e.message === "Skipping view transition because viewport size changed." || e.message === "Transition was aborted because of invalid state") && (e = null);
					}
					e !== null && c(e);
				} finally {
					r(), i(), o();
				}
			}), u.finished.finally(function() {
				for (var e = 0; e < d.length; e++) d[e].cancel();
				l.__reactViewTransition === u && (l.__reactViewTransition = null), s();
			}), u;
		} catch {
			return r(), i(), o(), null;
		}
	}
	function Jp(e, t) {
		this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
	}
	Jp.prototype.animate = function(e, t) {
		return t = typeof t == "number" ? { duration: t } : b({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
	}, Jp.prototype.getAnimations = function() {
		for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), r = [], i = 0; i < n.length; i++) {
			var a = n[i].effect;
			a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
		}
		return r;
	}, Jp.prototype.getComputedStyle = function() {
		return getComputedStyle(this._scope, this._selector);
	};
	function Yp(e) {
		return {
			name: e,
			group: new Jp("group", e),
			imagePair: new Jp("image-pair", e),
			old: new Jp("old", e),
			new: new Jp("new", e)
		};
	}
	function Xp(e) {
		this._fragmentFiber = e, this._observers = this._eventListeners = null;
	}
	Xp.prototype.addEventListener = function(e, t, n) {
		var r = null, i = null;
		if (!(n != null && typeof n != "boolean" && (r = n.signal || null, r !== null && r.aborted))) {
			this._eventListeners === null && (this._eventListeners = []);
			var a = this._eventListeners;
			if (tm(a, e, t, n) === -1) {
				var o = this, s = t;
				n != null && typeof n != "boolean" && !0 === n.once && (s = function(r) {
					o.removeEventListener(e, t, n), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
				}), r !== null && (i = o.removeEventListener.bind(o, e, t, n), r.addEventListener("abort", i, { once: !0 }), i = r.removeEventListener.bind(r, "abort", i)), r = $p(n), a.push({
					type: e,
					listener: t,
					optionsOrUseCapture: n,
					attachedListener: s,
					cleanup: i
				}), f(this._fragmentFiber.child, !1, Zp, e, s, r);
			}
			this._eventListeners = a;
		}
	};
	function Zp(e, t, n, r) {
		return _(e).addEventListener(t, n, r), !1;
	}
	Xp.prototype.removeEventListener = function(e, t, n) {
		var r = this._eventListeners;
		if (r !== null && (t = tm(r, e, t, n), t !== -1)) {
			var i = r[t];
			n = i.attachedListener;
			var a = i.cleanup;
			i = $p(i.optionsOrUseCapture), f(this._fragmentFiber.child, !1, Qp, e, n, i), r.splice(t, 1), a !== null && a();
		}
	};
	function Qp(e, t, n, r) {
		return _(e).removeEventListener(t, n, r), !1;
	}
	function $p(e) {
		return e != null && typeof e != "boolean" && (!0 === e.once || e.signal instanceof AbortSignal) ? {
			capture: e.capture,
			passive: e.passive
		} : e;
	}
	function em(e) {
		return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
	}
	function tm(e, t, n, r) {
		if (e.length === 0) return -1;
		r = em(r);
		for (var i = 0; i < e.length; i++) {
			var a = e[i];
			if (a.type === t && a.listener === n && em(a.optionsOrUseCapture) === r) return i;
		}
		return -1;
	}
	Xp.prototype.dispatchEvent = function(e) {
		var t = p(this._fragmentFiber);
		if (t === null) return !0;
		t = _(t);
		var n = this._eventListeners;
		if (n !== null && 0 < n.length || !e.bubbles) {
			var r = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
			if (n) for (var i = 0; i < n.length; i++) {
				var a = n[i];
				r.addEventListener(a.type, a.attachedListener, $p(a.optionsOrUseCapture));
			}
			if (t.appendChild(r), e = r.dispatchEvent(e), n) for (i = 0; i < n.length; i++) a = n[i], r.removeEventListener(a.type, a.attachedListener, $p(a.optionsOrUseCapture));
			return t.removeChild(r), e;
		}
		return t.dispatchEvent(e);
	}, Xp.prototype.focus = function(e) {
		f(this._fragmentFiber.child, !0, nm, e, void 0, void 0);
	};
	function nm(e, t) {
		return e.tag !== 6 && (e = _(e), Om(e, t));
	}
	Xp.prototype.focusLast = function(e) {
		var t = [];
		f(this._fragmentFiber.child, !0, rm, t, void 0, void 0);
		for (var n = t.length - 1; 0 <= n && !nm(t[n], e); n--);
	};
	function rm(e, t) {
		return t.push(e), !1;
	}
	Xp.prototype.blur = function() {
		var e = p(this._fragmentFiber);
		e !== null && (e = _(e), e = wp(e).activeElement, e !== null && f(this._fragmentFiber.child, !1, im, e, void 0, void 0));
	};
	function im(e, t) {
		return e.tag !== 6 && (e = _(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
	}
	Xp.prototype.observeUsing = function(e) {
		this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), f(this._fragmentFiber.child, !1, am, e, void 0, void 0);
	};
	function am(e, t) {
		return e.tag === 6 || (e = _(e), t.observe(e)), !1;
	}
	Xp.prototype.unobserveUsing = function(e) {
		var t = this._observers;
		if (t !== null && t.has(e)) {
			t.delete(e), f(this._fragmentFiber.child, !1, om, e, void 0, void 0);
			for (var n = t = 0; n < sm.length; n++) {
				var r = sm[n];
				r.fragmentInstance === this && r.observer === e ? e.unobserve(r.instance) : sm[t++] = r;
			}
			sm.length = t;
		}
	};
	function om(e, t) {
		return e.tag === 6 || (e = _(e), t.unobserve(e)), !1;
	}
	var sm = [], cm = !1;
	function lm(e, t, n) {
		sm.push({
			fragmentInstance: e,
			observer: t,
			instance: n
		}), cm || (cm = !0, km(function() {
			cm = !1;
			var e = sm;
			sm = [];
			for (var t = 0; t < e.length; t++) {
				var n = e[t];
				n.observer.unobserve(n.instance);
			}
		}));
	}
	Xp.prototype.getClientRects = function() {
		var e = [];
		return f(this._fragmentFiber.child, !1, um, e, void 0, void 0), e;
	};
	function um(e, t) {
		if (e.tag === 6) {
			e = e.stateNode;
			var n = e.ownerDocument.createRange();
			n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
		} else e = _(e), t.push.apply(t, e.getClientRects());
		return !1;
	}
	Xp.prototype.getRootNode = function(e) {
		var t = p(this._fragmentFiber);
		return t === null ? this : _(t).getRootNode(e);
	}, Xp.prototype.compareDocumentPosition = function(e) {
		var t = p(this._fragmentFiber);
		if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		var n = [];
		f(this._fragmentFiber.child, !1, rm, n, void 0, void 0);
		var r = _(t);
		if (n.length === 0) {
			if (n = r, m(this._fragmentFiber)) {
				a: {
					for (t = this._fragmentFiber.return; t !== null;) {
						if (t.tag === 4) {
							t = t.stateNode.containerInfo;
							break a;
						}
						if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
						t = t.return;
					}
					t = null;
				}
				t != null && (n = t);
			}
			t = this._fragmentFiber;
			var i = r = n.compareDocumentPosition(e);
			return n === e ? i = Node.DOCUMENT_POSITION_CONTAINS : r & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = h(t)[1], n === null ? i = Node.DOCUMENT_POSITION_PRECEDING : (e = _(n).compareDocumentPosition(e), i = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
		t = _(n[0]), i = _(n[n.length - 1]);
		var a = m(this._fragmentFiber) ? t.parentElement : r;
		if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		r = a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, a = a.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY;
		var o = t.compareDocumentPosition(e), s = i.compareDocumentPosition(e), c = o & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
		return s = r && a && o & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = r && t === e || a && i === e || c || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !r && t === e || !a && i === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || dm(t, this._fragmentFiber, n[0], n[n.length - 1], e) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	};
	function dm(e, t, n, r, i) {
		var a = Ut(i);
		if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
			if (n = !!a) a: {
				for (; a !== null;) {
					if (a.tag === 7 && (a === t || a.alternate === t)) {
						n = !0;
						break a;
					}
					a = a.return;
				}
				n = !1;
			}
			return n;
		}
		if (e & Node.DOCUMENT_POSITION_CONTAINS) {
			if (a === null) return a = i.ownerDocument, i === a || i === a.documentElement || i === a.body;
			a: {
				for (a = t, t = p(t); a !== null;) {
					if (!(a.tag !== 5 && a.tag !== 3 && a.tag !== 27 || a !== t && a.alternate !== t)) {
						a = !0;
						break a;
					}
					a = a.return;
				}
				a = !1;
			}
			return a;
		}
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = re(n, a, ne), t === null ? t = !1 : (f(t, !0, ee, a, n), a = v, v = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = re(r, a, ne), t === null ? t = !1 : (f(t, !0, te, a, r), a = v, y = v = null, t = a !== null)), t) : !1;
	}
	function fm(e, t) {
		var n = e.ownerDocument.createRange();
		n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(window.scrollX + e.left, t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight);
	}
	Xp.prototype.scrollIntoView = function(e) {
		if (typeof e == "object") throw Error(i(566));
		var t = [];
		f(this._fragmentFiber.child, !1, rm, t, void 0, void 0);
		var n = !1 !== e;
		if (t.length === 0) {
			var r = h(this._fragmentFiber);
			if (r = n ? r[1] || r[0] || p(this._fragmentFiber) : r[0] || r[1], r === null) return;
			if (r.tag === 6) {
				e = _(r), fm(e, n);
				return;
			}
			if (r = _(r), r.nodeType !== 9) {
				if (r.nodeType === 11) {
					n = "host" in r ? r.host : null, n !== null && n.scrollIntoView(e);
					return;
				}
				r.scrollIntoView(e);
			}
		}
		for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
			var a = t[r];
			a.tag === 6 ? (a = _(a), fm(a, n)) : _(a).scrollIntoView(e), r += n ? -1 : 1;
		}
	};
	function pm(e, t) {
		return e = _(e), mm(e, t), !1;
	}
	function mm(e, t) {
		e.reactFragments ??= /* @__PURE__ */ new Set(), e.reactFragments.add(t);
	}
	function hm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.addEventListener(i.type, i.attachedListener, $p(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			for (var r = 0, i = 0; i < sm.length; i++) {
				var a = sm[i];
				(a.fragmentInstance !== t || a.observer !== n || a.instance !== e) && (sm[r++] = a);
			}
			sm.length = r, n.observe(e);
		}), mm(e, t));
	}
	function gm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.removeEventListener(i.type, i.attachedListener, $p(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			typeof n.rootMargin == "string" ? lm(t, n, e) : n.unobserve(e);
		}), e.reactFragments != null && e.reactFragments.delete(t));
	}
	function _m(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					_m(n), Ht(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function vm(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[Bt]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = wm(e.nextSibling), e === null) break;
		}
		return null;
	}
	function ym(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = wm(e.nextSibling), e === null)) return null;
		return e;
	}
	function bm(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = wm(e.nextSibling), e === null)) return null;
		return e;
	}
	function xm(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function Sm(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function Cm(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function wm(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var Tm = null;
	function Em(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return wm(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function Dm(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function Om(e, t) {
		function n() {
			r = !0;
		}
		if (e.ownerDocument.activeElement === e) return !0;
		var r = !1;
		try {
			e.ownerDocument.addEventListener("focus", n, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
		} finally {
			e.ownerDocument.removeEventListener("focus", n, !0);
		}
		return r;
	}
	function km(e) {
		Pp(function() {
			Pp(function(t) {
				return e(t);
			});
		});
	}
	function Am(e, t, n) {
		switch (t = wp(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function jm(e, t, n) {
		for (var r in n) {
			var i = n[r];
			n.hasOwnProperty(r) && i != null && hp(e, t, r, null, vp, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === An && (e.onclick = null), Ht(e);
	}
	function Mm(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		Ht(e);
	}
	var Nm = /* @__PURE__ */ new Map(), Pm = /* @__PURE__ */ new Set();
	function Fm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var Im = Ee.d;
	Ee.d = {
		f: Lm,
		r: Rm,
		D: z,
		C: Vm,
		L: B,
		m: Hm,
		X: Um,
		S: V,
		M: Wm
	};
	function Lm() {
		var e = Im.f(), t = Qd();
		return e || t;
	}
	function Rm(e) {
		var t = Wt(e);
		t !== null && t.tag === 5 && t.type === "form" ? dc(t) : Im.r(e);
	}
	var zm = typeof document > "u" ? null : document;
	function Bm(e, t, n) {
		var r = zm;
		if (r && typeof t == "string" && t) {
			var i = hn(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), Pm.has(i) || (Pm.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), _p(t, "link", e), qt(t), r.head.appendChild(t)));
		}
	}
	function z(e) {
		Im.D(e), Bm("dns-prefetch", e, null);
	}
	function Vm(e, t) {
		Im.C(e, t), Bm("preconnect", e, t);
	}
	function B(e, t, n) {
		Im.L(e, t, n);
		var r = zm;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + hn(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + hn(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + hn(n.imageSizes) + "\"]")) : i += "[href=\"" + hn(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Km(e);
					break;
				case "script": a = U(e);
			}
			if (!(Nm.has(a) || (e = b({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), Nm.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(qm(a)) || t === "script" && r.querySelector(Ym(a))))) {
				var o = r.createElement("link");
				_p(o, "link", e), t === "style" && (o[Vt] = !0, o.onload = o.onerror = function() {
					Jt(o);
				}), qt(o), r.head.appendChild(o);
			}
		}
	}
	function Hm(e, t) {
		Im.m(e, t);
		var n = zm;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + hn(r) + "\"][href=\"" + hn(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = U(e);
			}
			if (!Nm.has(a) && (e = b({
				rel: "modulepreload",
				href: e
			}, t), Nm.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(Ym(a))) return;
				}
				r = n.createElement("link"), _p(r, "link", e), qt(r), n.head.appendChild(r);
			}
		}
	}
	function V(e, t, n) {
		Im.S(e, t, n);
		var r = zm;
		if (r && e) {
			var i = Kt(r).hoistableStyles, a = Km(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(qm(a))) s.loading = 5;
				else {
					e = b({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = Nm.get(a)) && Qm(e, n);
					var c = o = r.createElement("link");
					qt(c), _p(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Zm(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function Um(e, t) {
		Im.X(e, t);
		var n = zm;
		if (n && e) {
			var r = Kt(n).hoistableScripts, i = U(e), a = r.get(i);
			a || (a = n.querySelector(Ym(i)), a || (e = b({
				src: e,
				async: !0
			}, t), (t = Nm.get(i)) && $m(e, t), a = n.createElement("script"), qt(a), _p(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Wm(e, t) {
		Im.M(e, t);
		var n = zm;
		if (n && e) {
			var r = Kt(n).hoistableScripts, i = U(e), a = r.get(i);
			a || (a = n.querySelector(Ym(i)), a || (e = b({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = Nm.get(i)) && $m(e, t), a = n.createElement("script"), qt(a), _p(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Gm(e, t, n, r) {
		var a = (a = Fe.current) ? Fm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Km(n.href), t = Kt(a).hoistableStyles, r = t.get(n), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Km(n.href);
					var o = Kt(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(qm(e))) ? o._p || (s.instance = o, s.state.loading = 5) : (o = Nm.get(e), o || (o = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, Nm.set(e, o)), Jm(a, e, o, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = U(n), t = Kt(a).hoistableScripts, r = t.get(n), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Km(e) {
		return "href=\"" + hn(e) + "\"";
	}
	function qm(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function H(e) {
		return b({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Jm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[Vt]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[Vt] = !0, t.onload = t.onerror = Jt.bind(null, t), _p(t, "link", n), qt(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function U(e) {
		return "[src=\"" + hn(e) + "\"]";
	}
	function Ym(e) {
		return "script[async]" + e;
	}
	function Xm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + hn(n.href) + "\"]");
				if (r) return t.instance = r, qt(r), r;
				var a = b({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), qt(r), _p(r, "style", a), Zm(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Km(n.href);
				var o = e.querySelector(qm(a));
				if (o) return t.state.loading |= 4, t.instance = o, qt(o), o;
				r = H(n), (a = Nm.get(a)) && Qm(r, a), o = (e.ownerDocument || e).createElement("link"), qt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), _p(o, "link", r), t.state.loading |= 4, Zm(o, n.precedence, e), t.instance = o;
			case "script": return o = U(n.src), (a = e.querySelector(Ym(o))) ? (t.instance = a, qt(a), a) : (r = n, (a = Nm.get(o)) && (r = b({}, n), $m(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), qt(a), _p(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Zm(r, n.precedence, e));
		return t.instance;
	}
	function Zm(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Qm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function $m(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var eh = null;
	function W(e, t, n) {
		if (eh === null) {
			var r = /* @__PURE__ */ new Map(), i = eh = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = eh, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[Bt] || a[Nt] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function th(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function nh(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function G(e, t) {
		return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
	}
	function K(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function rh(e) {
		return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * .25;
	}
	function ih(e, t) {
		typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += rh(t), e.suspenseyImages.push(t)), e = uh.bind(e), t.decode().then(e, e));
	}
	function ah(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Km(r.href), a = t.querySelector(qm(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = lh.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, qt(a);
					return;
				}
				a = t.ownerDocument || t, r = H(r), (i = Nm.get(i)) && Qm(r, i), a = a.createElement("link"), qt(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), _p(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = lh.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var oh = 0;
	function sh(e, t) {
		return e.stylesheets && e.count === 0 && fh(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && fh(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && oh === 0 && (oh = 62500 * xp());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && fh(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > oh ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function ch(e) {
		if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
			if (e.stylesheets) fh(e, e.stylesheets);
			else if (e.unsuspend) {
				var t = e.unsuspend;
				e.unsuspend = null, t();
			}
		}
	}
	function lh() {
		this.count--, ch(this);
	}
	function uh() {
		this.imgCount--, ch(this);
	}
	var dh = null;
	function fh(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, dh = /* @__PURE__ */ new Map(), t.forEach(ph, e), dh = null, lh.call(e));
	}
	function ph(e, t) {
		if (!(t.state.loading & 4)) {
			var n = dh.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), dh.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = lh.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var mh = {
		$$typeof: de,
		Provider: null,
		Consumer: null,
		_currentValue: De,
		_currentValue2: De,
		_threadCount: 0
	};
	function hh(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = St(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = St(0), this.hiddenUpdates = St(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function gh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new hh(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = Ui(3, null, null, t), e.current = a, a.stateNode = e, t = Ua(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, Eo(a), e;
	}
	function _h(e) {
		return e ? (e = Vi, e) : Vi;
	}
	function vh(e, t, n, r, i, a) {
		i = _h(i), r.context === null ? r.context = i : r.pendingContext = i, r = Oo(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = ko(e, r, t), n !== null && (qd(n, e, t), Ao(n, e, t));
	}
	function yh(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function bh(e, t) {
		yh(e, t), (e = e.alternate) && yh(e, t);
	}
	function xh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Ri(e, 67108864);
			t !== null && qd(t, e, 67108864), bh(e, 67108864);
		}
	}
	function Sh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Wd();
			t = Ot(t);
			var n = Ri(e, t);
			n !== null && qd(n, e, t), bh(e, t);
		}
	}
	var Ch = !0;
	function wh(e, t, n, r) {
		var i = S.T;
		S.T = null;
		var a = Ee.p;
		try {
			Ee.p = 2, Eh(e, t, n, r);
		} finally {
			Ee.p = a, S.T = i;
		}
	}
	function Th(e, t, n, r) {
		var i = S.T;
		S.T = null;
		var a = Ee.p;
		try {
			Ee.p = 8, Eh(e, t, n, r);
		} finally {
			Ee.p = a, S.T = i;
		}
	}
	function Eh(e, t, n, r) {
		if (Ch) {
			var i = Dh(r);
			if (i === null) op(e, t, r, Oh, n), zh(e, r);
			else if (Vh(i, e, t, n, r)) r.stopPropagation();
			else if (zh(e, r), t & 4 && -1 < Rh.indexOf(e)) {
				for (; i !== null;) {
					var a = Wt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = gt(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - lt(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									Bf(a), !(ud & 6) && (kd = Qe() + 500, Vf(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = Ri(a, 2), s !== null && qd(s, a, 2), Qd(), bh(a, 2);
					}
					if (a = Dh(r), a === null && op(e, t, r, Oh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else op(e, t, r, null, n);
		}
	}
	function Dh(e) {
		return e = Mn(e), kh(e);
	}
	var Oh = null;
	function kh(e) {
		if (Oh = null, e = Ut(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return Oh = e, null;
	}
	function Ah(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "fullscreenerror":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "resize":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch ($e()) {
				case et: return 2;
				case w: return 8;
				case tt:
				case nt: return 32;
				case rt: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var jh = !1, Mh = null, Nh = null, Ph = null, Fh = /* @__PURE__ */ new Map(), Ih = /* @__PURE__ */ new Map(), Lh = [], Rh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function zh(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Mh = null;
				break;
			case "dragenter":
			case "dragleave":
				Nh = null;
				break;
			case "mouseover":
			case "mouseout":
				Ph = null;
				break;
			case "pointerover":
			case "pointerout":
				Fh.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": Ih.delete(t.pointerId);
		}
	}
	function Bh(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = Wt(t), t !== null && xh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Vh(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Mh = Bh(Mh, e, t, n, r, i), !0;
			case "dragenter": return Nh = Bh(Nh, e, t, n, r, i), !0;
			case "mouseover": return Ph = Bh(Ph, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return Fh.set(a, Bh(Fh.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, Ih.set(a, Bh(Ih.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Hh(e) {
		var t = Ut(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, jt(e.priority, function() {
							Sh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, jt(e.priority, function() {
							Sh(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Uh(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = Dh(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				jn = r, n.target.dispatchEvent(r), jn = null;
			} else return t = Wt(n), t !== null && xh(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Wh(e, t, n) {
		Uh(e) && n.delete(t);
	}
	function Gh() {
		jh = !1, Mh !== null && Uh(Mh) && (Mh = null), Nh !== null && Uh(Nh) && (Nh = null), Ph !== null && Uh(Ph) && (Ph = null), Fh.forEach(Wh), Ih.forEach(Wh);
	}
	function Kh(e, n) {
		e.blockedOn === n && (e.blockedOn = null, jh || (jh = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Gh)));
	}
	var qh = null;
	function Jh(e) {
		qh !== e && (qh = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			qh === e && (qh = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (kh(r || n) === null) continue;
					break;
				}
				var a = Wt(n);
				a !== null && (e.splice(t, 3), t -= 3, lc(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Yh(e) {
		function t(t) {
			return Kh(t, e);
		}
		Mh !== null && Kh(Mh, e), Nh !== null && Kh(Nh, e), Ph !== null && Kh(Ph, e), Fh.forEach(t), Ih.forEach(t);
		for (var n = 0; n < Lh.length; n++) {
			var r = Lh[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Lh.length && (n = Lh[0], n.blockedOn === null);) Hh(n), n.blockedOn === null && Lh.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[Pt] || null;
			if (typeof a == "function") o || Jh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[Pt] || null) s = o.formAction;
					else if (kh(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Jh(n);
			}
		}
	}
	function Xh() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Zh(e) {
		this._internalRoot = e;
	}
	Qh.prototype.render = Zh.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		vh(n, Wd(), e, t, null, null);
	}, Qh.prototype.unmount = Zh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			vh(e.current, 2, null, e, null, null), Qd(), t[Ft] = null;
		}
	};
	function Qh(e) {
		this._internalRoot = e;
	}
	Qh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = At();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Lh.length && t !== 0 && t < Lh[n].priority; n++);
			Lh.splice(n, 0, e), n === 0 && Hh(e);
		}
	};
	var $h = n.version;
	if ($h !== "19.3.0") throw Error(i(527, $h, "19.3.0"));
	Ee.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = u(t), e = e === null ? null : d(e), e = e === null ? null : e.stateNode, e;
	};
	var eg = {
		bundleType: 0,
		version: "19.3.0",
		rendererPackageName: "react-dom",
		currentDispatcherRef: S,
		reconcilerVersion: "19.3.0"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var tg = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!tg.isDisabled && tg.supportsFiber) try {
			ot = tg.inject(eg), st = tg;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Fc, s = Ic, c = Lc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = gh(e, 1, !1, null, null, n, r, null, o, s, c, Xh), e[Ft] = t.current, ip(e), new Zh(t);
	};
})), Ac = /* @__PURE__ */ c(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = kc();
})), jc = /* @__PURE__ */ c(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), Mc = /* @__PURE__ */ c(((e, t) => {
	t.exports = jc();
})), Nc = (e) => e?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
//#endregion
//#region node_modules/.pnpm/lucide-react@1.53.0_@types+react@19.3.0_react@19.3.0/node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
function Pc(e, t, n = []) {
	if (t == null) throw Error("[lucide]: iconNode is required when icon name is used");
	return {
		name: Nc(e),
		size: 24,
		node: t,
		...n.length > 0 ? { aliases: n } : {}
	};
}
//#endregion
//#region node_modules/.pnpm/lucide-react@1.53.0_@types+react@19.3.0_react@19.3.0/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
var Fc = (e) => {
	let t = "", n = !1;
	for (let r of e) r === "-" || r === "_" || r <= " " ? n = t.length > 0 : (t.length === 0 ? t += r.toLowerCase() : t += n ? r.toUpperCase() : r, n = !1);
	return t;
}, Ic = (e) => {
	let t = Fc(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, Lc = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), Rc = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
//#endregion
//#region node_modules/.pnpm/lucide-react@1.53.0_@types+react@19.3.0_react@19.3.0/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs
function zc(e) {
	return e != null;
}
function Bc(e, t = {}) {
	let n = t.attributeNames ?? {}, r = (e) => n[e] ?? e, i = e.size ?? e.width ?? Rc.width, a = e.size ?? e.height ?? Rc.height, o = e.aliases?.filter((e) => typeof e == "string" && e.trim() !== "").map((e) => `lucide-${e}`) ?? [], s = [...e.name ? [`lucide-${e.name}`] : [], ...o], c = t.className?.split(" ").filter(Boolean) ?? [], l = t.includeDefaultClasses === !1 ? Lc(...c) : Lc("lucide", ...s, ...c), u = t.absoluteStrokeWidth ? Number(t.strokeWidth ?? Rc["stroke-width"]) * Number(e.size ?? e.width ?? Rc.width) / Number(t.size ?? t.width ?? Rc.width) : t.strokeWidth ?? Rc["stroke-width"];
	return [
		"svg",
		{
			...Object.entries(Rc).reduce((e, [t, n]) => (e[r(t)] = n, e), {}),
			..."color" in t && t.color && { [r("stroke")]: t.color },
			..."size" in t && zc(t.size) && {
				[r("width")]: t.size,
				[r("height")]: t.size
			},
			..."width" in t && zc(t.width) && { [r("width")]: t.width },
			..."height" in t && zc(t.height) && { [r("height")]: t.height },
			[r("stroke-width")]: u,
			...l && { [r("class")]: l },
			[r("viewBox")]: `0 0 ${i} ${a}`,
			...t.hasA11yProp === !1 ? { [r("aria-hidden")]: "true" } : {},
			..."attributes" in t && t.attributes
		},
		e.node.map((e) => {
			let [n, i, a] = e, o = t.nonScalingStroke ? {
				[r("vector-effect")]: "non-scaling-stroke",
				...i
			} : i;
			return a ? [
				n,
				o,
				a
			] : [n, o];
		})
	];
}
//#endregion
//#region node_modules/.pnpm/lucide-react@1.53.0_@types+react@19.3.0_react@19.3.0/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs
function Vc(e, t = {}) {
	return Bc(e, {
		...t,
		attributeNames: {
			...t.attributeNames,
			class: "className",
			"stroke-width": "strokeWidth",
			"stroke-linecap": "strokeLinecap",
			"stroke-linejoin": "strokeLinejoin",
			"vector-effect": "vectorEffect"
		}
	});
}
//#endregion
//#region node_modules/.pnpm/lucide-react@1.53.0_@types+react@19.3.0_react@19.3.0/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
var Hc = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, M = /* @__PURE__ */ u(Ec(), 1), Uc = (0, M.createContext)({}), Wc = () => (0, M.useContext)(Uc), Gc = (0, M.forwardRef)(({ color: e, size: t, width: n, height: r, strokeWidth: i, absoluteStrokeWidth: a, nonScalingStroke: o, className: s = "", children: c, iconNode: l = [], icon: u = {
	node: l,
	aliases: [],
	size: 24
}, ...d }, f) => {
	let { size: p = 24, strokeWidth: m = 2, absoluteStrokeWidth: h = !1, nonScalingStroke: g = !1, color: _ = "currentColor", className: v = "" } = Wc() ?? {}, y = !!c || Hc(d), [ee, te, ne = []] = Vc(u, {
		color: e ?? _,
		width: n ?? t ?? p,
		height: r ?? t ?? p,
		strokeWidth: i ?? m,
		absoluteStrokeWidth: a ?? h,
		nonScalingStroke: o ?? g,
		className: Lc(v, s),
		hasA11yProp: y,
		attributes: d
	});
	return (0, M.createElement)(ee, {
		ref: f,
		...te
	}, [...ne.map(([e, t]) => (0, M.createElement)(e, t)), ...Array.isArray(c) ? c : [c]]);
});
//#endregion
//#region node_modules/.pnpm/lucide-react@1.53.0_@types+react@19.3.0_react@19.3.0/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
function Kc(e, t = [], n = []) {
	let r = typeof e == "string" ? Pc(e, t, n) : e, i = (0, M.forwardRef)(({ className: e, ...t }, n) => (0, M.createElement)(Gc, {
		ref: n,
		icon: r,
		className: e,
		...t
	}));
	return r.name && (i.displayName = Ic(r.name)), i;
}
//#endregion
//#region node_modules/.pnpm/lucide-react@1.53.0_@types+react@19.3.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/check.mjs
var qc = {
	name: "check",
	size: 24,
	node: [["path", {
		d: "M20 6 9 17l-5-5",
		key: "1gmf2c"
	}]]
};
qc.node;
var Jc = Kc(qc), Yc = {
	name: "chevron-right",
	size: 24,
	node: [["path", {
		d: "m9 18 6-6-6-6",
		key: "mthhwq"
	}]]
};
Yc.node;
var Xc = Kc(Yc), Zc = {
	name: "circle-alert",
	size: 24,
	node: [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "8",
			y2: "12",
			key: "1pkeuh"
		}],
		["line", {
			x1: "12",
			x2: "12.01",
			y1: "16",
			y2: "16",
			key: "4dfq90"
		}]
	],
	aliases: ["alert-circle"]
};
Zc.node;
var Qc = Kc(Zc), $c = {
	name: "circle-check",
	size: 24,
	node: [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "m16 9-5.5 5.5L8 12",
		key: "xofnsj"
	}]],
	aliases: ["check-circle-2"]
};
$c.node;
var el = Kc($c), tl = {
	name: "circle-x",
	size: 24,
	node: [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "m15 9-6 6",
			key: "1uzhvr"
		}],
		["path", {
			d: "m9 9 6 6",
			key: "z0biqf"
		}]
	],
	aliases: ["x-circle"]
};
tl.node;
var nl = Kc(tl), rl = {
	name: "clock",
	size: 24,
	node: [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "M12 6v6l4 2",
		key: "mmk7yg"
	}]]
};
rl.node;
var il = Kc(rl), al = {
	name: "copy",
	size: 24,
	node: [["rect", {
		width: "14",
		height: "14",
		x: "8",
		y: "8",
		rx: "2",
		ry: "2",
		key: "17jyea"
	}], ["path", {
		d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
		key: "zix9uf"
	}]]
};
al.node;
var ol = Kc(al), sl = {
	name: "file",
	size: 24,
	node: [["path", {
		d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
		key: "1oefj6"
	}], ["path", {
		d: "M14 2v5a1 1 0 0 0 1 1h5",
		key: "wfsgrz"
	}]]
};
sl.node;
var cl = Kc(sl), ll = {
	name: "folder",
	size: 24,
	node: [["path", {
		d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
		key: "1kt360"
	}]]
};
ll.node;
var ul = Kc(ll), dl = {
	name: "key-round",
	size: 24,
	node: [["path", {
		d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
		key: "1s6t7t"
	}], ["circle", {
		cx: "16.5",
		cy: "7.5",
		r: ".5",
		fill: "currentColor",
		key: "w0ekpg"
	}]]
};
dl.node;
var fl = Kc(dl), pl = {
	name: "x",
	size: 24,
	node: [["path", {
		d: "M18 6 6 18",
		key: "1bl5f8"
	}], ["path", {
		d: "m6 6 12 12",
		key: "d8bk6v"
	}]]
};
pl.node;
var ml = Kc(pl), hl = Ac(), N = Mc(), gl = [
	"[data-ipfs-ui]{all:initial;--ground:#0c0b0a;--surface:#171614;--raised:#222120;--control:#2d2c2a;--text:#f5f2ee;--text-muted:#a09890;--accent:#e96a12;--on-accent:#0c0b0a;--accent-text:#e96a12;--accent-tint:#342214;--glow:#f49e12;--ok:#5fbf7a;--ok-tint:#212e22;--warn:#f2b33d;--warn-tint:#362c1a;--err:#f0705a;--err-tint:#35231e;--info:#7fb2d9;--info-tint:#262c30;--lightningcss-light: ;--lightningcss-dark:initial;color-scheme:dark}[data-ipfs-ui][data-theme=light]{--ground:#f5f2ee;--surface:#fbf9f6;--raised:#ece7e0;--control:#e1dbd2;--text:#141210;--text-muted:#5e5750;--accent:#ce3012;--on-accent:#fff;--accent-text:#b02a10;--accent-tint:#f6e5df;--glow:#f49e12;--ok:#1a6b35;--ok-tint:#e4ebe3;--warn:#8a5a00;--warn-tint:#f0e9dd;--err:#b3261e;--err-tint:#f4e4e0;--info:#1f5e8c;--info-tint:#e5eaeb;--lightningcss-light:initial;--lightningcss-dark: ;color-scheme:light}@media (prefers-color-scheme:light){[data-ipfs-ui][data-theme=auto]{--ground:#f5f2ee;--surface:#fbf9f6;--raised:#ece7e0;--control:#e1dbd2;--text:#141210;--text-muted:#5e5750;--accent:#ce3012;--on-accent:#fff;--accent-text:#b02a10;--accent-tint:#f6e5df;--glow:#f49e12;--ok:#1a6b35;--ok-tint:#e4ebe3;--warn:#8a5a00;--warn-tint:#f0e9dd;--err:#b3261e;--err-tint:#f4e4e0;--info:#1f5e8c;--info-tint:#e5eaeb;--lightningcss-light:initial;--lightningcss-dark: ;color-scheme:light}}[data-ipfs-ui]{--space-1:4px;--space-2:8px;--space-3:14px;--space-4:24px;--space-5:40px;--space-6:56px;--space-7:88px;--radius-sm:6px;--radius-md:10px;--radius-lg:16px;--radius-pill:999px;--font-heading:\"IPFS UI Syne\", \"Avenir Next\", \"Segoe UI\", system-ui, sans-serif;--font-body:\"IPFS UI Hanken Grotesk\", \"Helvetica Neue\", Arial, system-ui, sans-serif;--font-quote:Newsreader, Georgia, \"Times New Roman\", serif;--font-mono:\"IPFS UI JetBrains Mono\", ui-monospace, Menlo, Consolas, monospace;--iu-text-body:15px;--iu-text-small:14px;--iu-text-code:13px;--iu-focus:2px solid var(--accent);--iu-focus-offset:2px;--iu-ease:cubic-bezier(.16, 1, .3, 1);--iu-duration:.18s}",
	"[data-ipfs-ui]{box-sizing:border-box;color:var(--text);font-family:var(--font-body);font-size:var(--iu-text-body);font-variant-numeric:tabular-nums;-webkit-text-size-adjust:100%;-moz-text-size-adjust:100%;text-size-adjust:100%;-webkit-font-smoothing:antialiased;line-height:1.55;display:block}[data-ipfs-ui].iu-ground{background:var(--ground)}[data-ipfs-ui] *,[data-ipfs-ui] :before,[data-ipfs-ui] :after{box-sizing:inherit}[data-ipfs-ui] :is(h1,h2,h3,h4,p,ul,ol,dl,dd,figure,pre){margin:0}[data-ipfs-ui] :is(ul,ol){padding:0;list-style:none}[data-ipfs-ui] ::selection{background:var(--accent-tint);color:var(--text)}[data-ipfs-ui] :is(a,button,input,select,textarea,summary,[tabindex]):focus-visible{outline:var(--iu-focus);outline-offset:var(--iu-focus-offset)}[data-ipfs-ui] :is(a,button,summary,[role=button]){cursor:pointer}[data-ipfs-ui] a{color:var(--accent-text);text-underline-offset:.2em;font-weight:600}[data-ipfs-ui] code,[data-ipfs-ui] pre,[data-ipfs-ui] kbd,[data-ipfs-ui] samp{font-family:var(--font-mono);font-size:var(--iu-text-code);line-height:1.7}[data-ipfs-ui] *{scrollbar-color:var(--control) transparent;scrollbar-width:thin;caret-color:var(--accent-text)}.iu-sr-only{clip-path:inset(50%);white-space:nowrap;border:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}@media (prefers-reduced-motion:reduce){[data-ipfs-ui],[data-ipfs-ui] *,[data-ipfs-ui] :before,[data-ipfs-ui] :after{scroll-behavior:auto!important;transition:none!important;animation:none!important}}",
	".iu-panel{gap:var(--space-3);min-width:0;padding:var(--space-4);border-radius:var(--radius-md);background:var(--surface);display:grid;container-type:inline-size}.iu-head{align-items:baseline;gap:var(--space-2) var(--space-3);flex-wrap:wrap;display:flex}.iu-title{font-family:var(--font-heading);letter-spacing:-.005em;font-size:17px;font-weight:600;line-height:1.3}.iu-subtitle{margin-top:var(--space-2);font-family:var(--font-heading);font-size:17px;font-weight:600;line-height:1.3}.iu-tool{color:var(--text-muted);font-size:12px}.iu-head__actions{margin-inline-start:auto}.iu-muted{color:var(--text-muted)}.iu-num{font-variant-numeric:tabular-nums;white-space:nowrap}th.iu-num,td.iu-num{text-align:end}.iu-wrap{overflow-wrap:anywhere;word-break:break-word}.iu-list{gap:var(--space-2);display:grid}.iu-empty{padding:var(--space-4);border-radius:var(--radius-md);background:var(--raised);color:var(--text-muted)}.iu-btn{justify-content:center;align-items:center;gap:var(--space-2);border-radius:var(--radius-sm);min-height:44px;font-family:var(--font-body);white-space:nowrap;transition:background-color var(--iu-duration) var(--iu-ease), filter var(--iu-duration) var(--iu-ease);border:0;padding:0 20px;font-size:14.5px;font-weight:600;line-height:1;display:inline-flex}.iu-btn--primary{background:var(--accent);color:var(--on-accent)}.iu-btn--primary:hover{filter:brightness(1.08)}.iu-btn--secondary{background:var(--control);color:var(--text)}.iu-btn--secondary:hover{background:var(--raised)}.iu-btn--text{padding:0 var(--space-1);color:var(--accent-text);background:0 0}.iu-btn--text:hover{text-underline-offset:.2em;text-decoration:underline}.iu-btn--compact{min-height:32px;padding:0 var(--space-2);font-size:14px}.iu-btn[disabled]{opacity:.45;cursor:not-allowed}.iu-badge{border-radius:var(--radius-pill);background:var(--control);color:var(--text);white-space:nowrap;align-items:center;gap:6px;padding:3px 10px;font-size:12px;font-weight:600;line-height:1.5;display:inline-flex}.iu-badge--accent{background:var(--accent-tint);color:var(--accent-text)}.iu-badge--ok{background:var(--ok-tint);color:var(--ok)}.iu-badge--warn{background:var(--warn-tint);color:var(--warn)}.iu-badge--err{background:var(--err-tint);color:var(--err)}.iu-badge--info{background:var(--info-tint);color:var(--info)}.iu-badges{gap:var(--space-2);flex-wrap:wrap;display:flex}.iu-id{align-items:center;gap:0 var(--space-1);flex-wrap:wrap;min-width:0;display:inline-flex}.iu-id__value{overflow-wrap:anywhere;word-break:break-all;color:var(--text)}.iu-copy{color:var(--accent-text)}.iu-table-wrap{border-radius:var(--radius-md);background:var(--surface);position:relative;overflow-x:auto}.iu-table{border-collapse:collapse;width:100%;font-size:var(--iu-text-small)}.iu-table th{background:var(--control);color:var(--text-muted);font-family:var(--font-mono);letter-spacing:.1em;text-align:start;text-transform:uppercase;white-space:nowrap;padding:10px 14px;font-size:10.5px;font-weight:600}.iu-table td{color:var(--text-muted);vertical-align:top;padding:10px 14px}.iu-table td:first-child{color:var(--text);font-weight:500}.iu-table tbody tr:nth-child(2n) td{background:var(--raised)}.iu-entry{align-items:center;gap:var(--space-2);min-width:0;display:inline-flex}.iu-kv{gap:var(--space-2);display:grid}.iu-kv__row{gap:var(--space-1) var(--space-3);grid-template-columns:minmax(8rem,12rem) minmax(0,1fr);align-items:baseline;display:grid}.iu-kv dt{color:var(--text-muted);font-size:13px;font-weight:600}.iu-kv dd{overflow-wrap:anywhere;min-width:0}@container (width<=420px){.iu-kv__row{grid-template-columns:minmax(0,1fr)}}.iu-frame{gap:var(--space-3);padding:var(--space-3);border-radius:var(--radius-md);background:var(--raised);display:grid}.iu-frame__label{color:var(--text-muted);font-size:13px;font-weight:600}.iu-frame .iu-table-wrap,.iu-frame .iu-table tbody tr:nth-child(odd) td{background:var(--raised)}.iu-frame .iu-table tbody tr:nth-child(2n) td{background:var(--surface)}.iu-notice{padding:var(--space-3);border-radius:var(--radius-md);background:var(--control);color:var(--text);font-size:var(--iu-text-small)}.iu-notice--ok{background:var(--ok-tint)}.iu-notice--warn{background:var(--warn-tint)}.iu-notice--err{background:var(--err-tint)}.iu-notice--info{background:var(--info-tint)}.iu-notice--ok .iu-notice__label{color:var(--ok)}.iu-notice--warn .iu-notice__label{color:var(--warn)}.iu-notice--err .iu-notice__label{color:var(--err)}.iu-notice--info .iu-notice__label{color:var(--info)}.iu-more{justify-content:flex-start;display:flex}.iu-pre{max-height:24rem;padding:var(--space-3);border-radius:var(--radius-sm);background:var(--surface);color:var(--text);white-space:pre-wrap;overflow-wrap:anywhere;margin:0;overflow:auto}.iu-hits{gap:var(--space-3);display:grid}.iu-hit{gap:var(--space-2);padding:var(--space-3);border-radius:var(--radius-sm);background:var(--surface);display:grid}.iu-hit__meta{align-items:center;gap:var(--space-2) var(--space-3);flex-wrap:wrap;display:flex}.iu-hit__text{white-space:pre-wrap;overflow-wrap:anywhere;max-width:66ch}.iu-trail{align-items:center;gap:var(--space-1);flex-wrap:wrap;display:flex}.iu-trail li{align-items:center;gap:var(--space-1);display:inline-flex}.iu-trail__sep{color:var(--text-muted)}.iu-trail__here{font-weight:600}.iu-meter{gap:var(--space-1);display:grid}.iu-meter__track{border-radius:var(--radius-pill);background:var(--control);height:8px;overflow:hidden}.iu-meter__track svg{width:100%;height:100%;display:block}.iu-meter__fill{fill:var(--text-muted)}.iu-meter__fill--warn{fill:var(--warn)}.iu-meter__text{color:var(--text-muted);font-size:var(--iu-text-small)}",
	".iu-approval{gap:var(--space-3);border-radius:var(--radius-md);background:var(--raised);min-width:0;color:var(--text);padding:18px 20px;display:grid}.iu-approval__row{align-items:center;gap:var(--space-2);flex-wrap:wrap;display:flex}.iu-approval__title{font-family:var(--font-heading);overflow-wrap:anywhere;font-size:17px;font-weight:600;line-height:1.3}.iu-approval__status{max-width:66ch}.iu-approval__meta{font-family:var(--font-mono);color:var(--text-muted);gap:2px;font-size:12px;line-height:1.6;display:grid}.iu-approval__meta>div{gap:0 var(--space-2);flex-wrap:wrap;display:flex}.iu-approval__meta dt{min-width:7.5rem}.iu-approval__meta dd{min-width:0;color:var(--text)}.iu-approval__actions{gap:var(--space-3);flex-wrap:wrap;display:flex}.iu-approval--approved{background:var(--ok-tint)}.iu-approval--denied,.iu-approval--expired{background:var(--err-tint)}.iu-approval--pending,.iu-approval--waiting_system_prompt{background:var(--raised)}.iu-approval--approved .iu-approval__meta,.iu-approval--denied .iu-approval__meta,.iu-approval--expired .iu-approval__meta{color:var(--text)}.iu-approval--approved .iu-badge,.iu-approval--denied .iu-badge,.iu-approval--expired .iu-badge{background:var(--surface)}.iu-json{padding:var(--space-3);border-radius:var(--radius-sm);background:var(--surface);font-family:var(--font-mono);font-size:var(--iu-text-code);line-height:1.7;overflow-x:auto}.iu-json__group>summary{cursor:pointer;border-radius:var(--radius-sm);min-block-size:24px;padding-block:1px;line-height:22px;list-style:none}.iu-json__group>summary::-webkit-details-marker{display:none}.iu-json__group>summary:before{content:\"▸\";width:1.2em;color:var(--text-muted);transition:transform var(--iu-duration) var(--iu-ease);display:inline-block}.iu-json__group[open]>summary:before{transform:rotate(90deg)}.iu-json__children{margin-inline-start:.6em;padding-inline-start:var(--space-3)}.iu-json__row{padding-inline-start:1.2em}.iu-json__key{color:var(--text-muted);font-weight:500}.iu-json__str,.iu-json__num,.iu-json__bool{color:var(--text)}.iu-json__null{color:var(--text-muted);font-style:italic}",
	".iu-stream{gap:var(--space-3);min-width:0;display:grid}.iu-msg{gap:var(--space-1);min-width:0;max-width:66ch;display:grid}.iu-msg__who{color:var(--text-muted);font-size:13px;font-weight:600}.iu-msg__text{white-space:pre-wrap;overflow-wrap:anywhere}.iu-msg--user .iu-msg__text{padding:var(--space-2) var(--space-3);border-radius:var(--radius-md);background:var(--raised)}.iu-msg--system .iu-msg__text{color:var(--text-muted);font-size:var(--iu-text-small)}.iu-msg__more{color:var(--text-muted)}.iu-call{gap:var(--space-3);min-width:0;display:grid}.iu-call__head{align-items:center;gap:var(--space-2) var(--space-3);flex-wrap:wrap;display:flex}.iu-call__title{font-family:var(--font-heading);font-size:17px;font-weight:600;line-height:1.3}.iu-call__args>summary{width:fit-content;box-sizing:border-box;min-block-size:24px;padding:var(--space-1) 0;color:var(--accent-text);border-radius:var(--radius-sm);font-weight:600}.iu-call__args[open]>summary{margin-bottom:var(--space-2)}.iu-egress{align-items:center;gap:var(--space-2);max-width:66ch;font-size:var(--iu-text-small);color:var(--text-muted);flex-wrap:wrap;display:flex}"
].join("\n"), _l = (0, M.createContext)(null), vl = {}, yl = () => void 0;
function bl() {
	return (0, M.use)(_l)?.actions ?? vl;
}
function xl() {
	return (0, M.use)(_l)?.announce ?? yl;
}
function Sl({ theme: e, injectStyles: t = !0, paint: n = !1, actions: r, className: i, style: a, children: o }) {
	let s = (0, M.use)(_l), [c, l] = (0, M.useState)(""), u = (0, M.useMemo)(() => ({
		...s?.actions,
		...r
	}), [s, r]), d = (0, M.useMemo)(() => ({
		actions: u,
		announce: l
	}), [u]);
	if (s && e === void 0 && r === void 0 && a === void 0) return /* @__PURE__ */ (0, N.jsx)(N.Fragment, { children: o });
	let f = [
		"iu-root",
		n ? "iu-ground" : "",
		i ?? ""
	].filter(Boolean).join(" ");
	return /* @__PURE__ */ (0, N.jsx)(_l, {
		value: d,
		children: /* @__PURE__ */ (0, N.jsxs)("div", {
			"data-ipfs-ui": "",
			"data-theme": e ?? "dark",
			className: f,
			style: a,
			children: [
				t && !s ? /* @__PURE__ */ (0, N.jsx)("style", {
					"data-ipfs-ui-styles": "",
					dangerouslySetInnerHTML: { __html: gl }
				}) : null,
				o,
				/* @__PURE__ */ (0, N.jsx)("div", {
					role: "status",
					"aria-live": "polite",
					"aria-atomic": "true",
					className: "iu-sr-only",
					"data-ipfs-ui-live": "",
					children: c
				})
			]
		})
	});
}
var Cl = "https://github.com/GQAdonis/kubo/blob/master/mcp/ui/catalog/ipfs-mcp.catalog.json", wl = {
	ipfs_node_info: {
		name: "ipfs_node_info",
		group: "node",
		title: "Node info",
		confirmation: "none",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "NodeStatusPanel",
		appView: "node-status",
		summaryTemplate: null
	},
	ipfs_node_status: {
		name: "ipfs_node_status",
		group: "node",
		title: "Server status",
		confirmation: "none",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "NodeStatusPanel",
		appView: "node-status",
		summaryTemplate: null
	},
	ipfs_add: {
		name: "ipfs_add",
		group: "content",
		title: "Add content",
		confirmation: "write",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "ContentCard",
		appView: "content",
		summaryTemplate: "Add new content to IPFS (pin={pin}, provide={provide})"
	},
	ipfs_cat: {
		name: "ipfs_cat",
		group: "content",
		title: "Read file",
		confirmation: "none",
		returnsUntrustedContent: !0,
		contentEgress: !0,
		paginated: !1,
		component: "ContentCard",
		appView: "content",
		summaryTemplate: null
	},
	ipfs_get: {
		name: "ipfs_get",
		group: "content",
		title: "Get content",
		confirmation: "none",
		returnsUntrustedContent: !0,
		contentEgress: !0,
		paginated: !1,
		component: "ContentCard",
		appView: "content",
		summaryTemplate: null
	},
	ipfs_ls: {
		name: "ipfs_ls",
		group: "content",
		title: "List directory",
		confirmation: "none",
		returnsUntrustedContent: !0,
		contentEgress: !0,
		paginated: !0,
		component: "ContentCard",
		appView: "content",
		summaryTemplate: null
	},
	pin_ls: {
		name: "pin_ls",
		group: "pin",
		title: "List pins",
		confirmation: "none",
		returnsUntrustedContent: !1,
		contentEgress: !0,
		paginated: !0,
		component: "PinList",
		appView: "pins",
		summaryTemplate: null
	},
	pin_add: {
		name: "pin_add",
		group: "pin",
		title: "Pin content",
		confirmation: "write",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "PinList",
		appView: "pins",
		summaryTemplate: "Pin {path} (recursive={recursive})"
	},
	pin_verify: {
		name: "pin_verify",
		group: "pin",
		title: "Verify pins",
		confirmation: "none",
		returnsUntrustedContent: !1,
		contentEgress: !0,
		paginated: !0,
		component: "PinList",
		appView: "pins",
		summaryTemplate: null
	},
	pin_update: {
		name: "pin_update",
		group: "pin",
		title: "Update pin",
		confirmation: "destructive",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "PinList",
		appView: "pins",
		summaryTemplate: "Move pin from {from} to {to} (unpin old={unpin})"
	},
	pin_rm: {
		name: "pin_rm",
		group: "pin",
		title: "Remove pin",
		confirmation: "destructive",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "PinList",
		appView: "pins",
		summaryTemplate: "Remove the pin on {path} (recursive={recursive})"
	},
	mfs_ls: {
		name: "mfs_ls",
		group: "mfs",
		title: "List MFS directory",
		confirmation: "none",
		returnsUntrustedContent: !0,
		contentEgress: !0,
		paginated: !0,
		component: "MfsTree",
		appView: "mfs",
		summaryTemplate: null
	},
	mfs_stat: {
		name: "mfs_stat",
		group: "mfs",
		title: "Stat MFS path",
		confirmation: "none",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "MfsTree",
		appView: "mfs",
		summaryTemplate: null
	},
	mfs_read: {
		name: "mfs_read",
		group: "mfs",
		title: "Read MFS file",
		confirmation: "none",
		returnsUntrustedContent: !0,
		contentEgress: !0,
		paginated: !1,
		component: "ContentCard",
		appView: "mfs",
		summaryTemplate: null
	},
	mfs_write: {
		name: "mfs_write",
		group: "mfs",
		title: "Write MFS file",
		confirmation: "write",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "MfsTree",
		appView: "mfs",
		summaryTemplate: "Replace the content of MFS file {path}"
	},
	mfs_mkdir: {
		name: "mfs_mkdir",
		group: "mfs",
		title: "Make MFS directory",
		confirmation: "write",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "MfsTree",
		appView: "mfs",
		summaryTemplate: "Create MFS directory {path}"
	},
	mfs_cp: {
		name: "mfs_cp",
		group: "mfs",
		title: "Copy into MFS",
		confirmation: "write",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "MfsTree",
		appView: "mfs",
		summaryTemplate: "Copy {source} to MFS {destination}"
	},
	mfs_mv: {
		name: "mfs_mv",
		group: "mfs",
		title: "Move MFS path",
		confirmation: "write",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "MfsTree",
		appView: "mfs",
		summaryTemplate: "Move MFS {source} to {destination}"
	},
	mfs_rm: {
		name: "mfs_rm",
		group: "mfs",
		title: "Remove MFS path",
		confirmation: "destructive",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "MfsTree",
		appView: "mfs",
		summaryTemplate: "Remove MFS {path} (recursive={recursive})"
	},
	ipns_publish: {
		name: "ipns_publish",
		group: "names",
		title: "Publish IPNS name",
		confirmation: "write",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "IpnsRecordCard",
		appView: null,
		summaryTemplate: "Publish {path} under IPNS key {key}"
	},
	ipns_resolve: {
		name: "ipns_resolve",
		group: "names",
		title: "Resolve IPNS name",
		confirmation: "none",
		returnsUntrustedContent: !0,
		contentEgress: !0,
		paginated: !1,
		component: "IpnsRecordCard",
		appView: null,
		summaryTemplate: null
	},
	key_list: {
		name: "key_list",
		group: "names",
		title: "List keys",
		confirmation: "none",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "IpnsRecordCard",
		appView: null,
		summaryTemplate: null
	},
	key_gen: {
		name: "key_gen",
		group: "names",
		title: "Generate key",
		confirmation: "write",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "IpnsRecordCard",
		appView: null,
		summaryTemplate: "Generate key {name} ({type})"
	},
	key_rename: {
		name: "key_rename",
		group: "names",
		title: "Rename key",
		confirmation: "write",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "IpnsRecordCard",
		appView: null,
		summaryTemplate: "Rename key {old_name} to {new_name}"
	},
	key_rm: {
		name: "key_rm",
		group: "names",
		title: "Remove key",
		confirmation: "destructive",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "IpnsRecordCard",
		appView: null,
		summaryTemplate: "Remove key {name}"
	},
	dag_get: {
		name: "dag_get",
		group: "dag",
		title: "Get DAG node",
		confirmation: "none",
		returnsUntrustedContent: !0,
		contentEgress: !0,
		paginated: !1,
		component: "DagViewer",
		appView: "dag",
		summaryTemplate: null
	},
	dag_stat: {
		name: "dag_stat",
		group: "dag",
		title: "DAG statistics",
		confirmation: "none",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "DagViewer",
		appView: "dag",
		summaryTemplate: null
	},
	dag_put: {
		name: "dag_put",
		group: "dag",
		title: "Put DAG node",
		confirmation: "write",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "DagViewer",
		appView: "dag",
		summaryTemplate: "Store a DAG node ({store_codec}, pin={pin})"
	},
	car_import: {
		name: "car_import",
		group: "dag",
		title: "Import CAR",
		confirmation: "write",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "DagViewer",
		appView: "dag",
		summaryTemplate: "Import a CAR file (pin roots={pin_roots})"
	},
	car_export: {
		name: "car_export",
		group: "dag",
		title: "Export CAR",
		confirmation: "none",
		returnsUntrustedContent: !0,
		contentEgress: !0,
		paginated: !1,
		component: "DagViewer",
		appView: "dag",
		summaryTemplate: null
	},
	routing_findprovs: {
		name: "routing_findprovs",
		group: "routing",
		title: "Find providers",
		confirmation: "none",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "NodeStatusPanel",
		appView: "node-status",
		summaryTemplate: null
	},
	routing_findpeer: {
		name: "routing_findpeer",
		group: "routing",
		title: "Find peer",
		confirmation: "none",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "NodeStatusPanel",
		appView: "node-status",
		summaryTemplate: null
	},
	routing_provide: {
		name: "routing_provide",
		group: "routing",
		title: "Announce CID",
		confirmation: "write",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "NodeStatusPanel",
		appView: "node-status",
		summaryTemplate: "Announce {cid} to the routing system (recursive={recursive})"
	},
	swarm_peers: {
		name: "swarm_peers",
		group: "diag",
		title: "Connected peers",
		confirmation: "none",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !0,
		component: "NodeStatusPanel",
		appView: "node-status",
		summaryTemplate: null
	},
	stats_bw: {
		name: "stats_bw",
		group: "diag",
		title: "Bandwidth",
		confirmation: "none",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "NodeStatusPanel",
		appView: "node-status",
		summaryTemplate: null
	},
	repo_stat: {
		name: "repo_stat",
		group: "diag",
		title: "Repo statistics",
		confirmation: "none",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "NodeStatusPanel",
		appView: "node-status",
		summaryTemplate: null
	},
	repo_gc: {
		name: "repo_gc",
		group: "diag",
		title: "Garbage collect",
		confirmation: "destructive",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "NodeStatusPanel",
		appView: "node-status",
		summaryTemplate: "Run garbage collection on the repo"
	},
	ipfs_index_search: {
		name: "ipfs_index_search",
		group: "index",
		title: "Search index",
		confirmation: "none",
		returnsUntrustedContent: !0,
		contentEgress: !0,
		paginated: !1,
		component: "ContentCard",
		appView: "content",
		summaryTemplate: null
	},
	ipfs_index_cid: {
		name: "ipfs_index_cid",
		group: "index",
		title: "Index CID",
		confirmation: "write",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "ContentCard",
		appView: "content",
		summaryTemplate: "Index {cid} with the configured embedder"
	},
	ipfs_index_status: {
		name: "ipfs_index_status",
		group: "index",
		title: "Index status",
		confirmation: "none",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !1,
		component: "NodeStatusPanel",
		appView: "node-status",
		summaryTemplate: null
	},
	ipfs_index_reconcile: {
		name: "ipfs_index_reconcile",
		group: "index",
		title: "Reconcile index",
		confirmation: "write",
		returnsUntrustedContent: !1,
		contentEgress: !1,
		paginated: !0,
		component: "NodeStatusPanel",
		appView: "node-status",
		summaryTemplate: "Delete index entries of unpinned CIDs (dry run={dry_run})"
	}
}, Tl = [
	{
		name: "ContentCard",
		kind: "view",
		description: "File bytes, directory listing or search hit for a CID or path, with untrusted-content framing."
	},
	{
		name: "PinList",
		kind: "view",
		description: "Pins with type, name and verification state; paginated."
	},
	{
		name: "MfsTree",
		kind: "view",
		description: "MFS directory tree and file details."
	},
	{
		name: "DagViewer",
		kind: "view",
		description: "IPLD node, DAG statistics and CAR import/export results."
	},
	{
		name: "IpnsRecordCard",
		kind: "view",
		description: "IPNS name, resolved value and keystore keys (never key material)."
	},
	{
		name: "ConfirmationDialog",
		kind: "view",
		description: "Renders a confirmation Summary for elicitation-capable surfaces."
	},
	{
		name: "NodeStatusPanel",
		kind: "view",
		description: "Node identity, server status, peers, provider and peer lookups, provide announcements, bandwidth, repo and index status."
	},
	{
		name: "MessageStream",
		kind: "chat",
		description: "AG-UI text message stream."
	},
	{
		name: "ToolCallCard",
		kind: "chat",
		description: "One tool call with arguments and result; embeds the tool's view component when it has one."
	},
	{
		name: "ApprovalCard",
		kind: "chat",
		description: "Interrupt state for a write or destructive call: pending, approved, denied, expired, waiting for the system prompt. Shows no approve control when the approval is out of band."
	},
	{
		name: "EgressBadge",
		kind: "chat",
		description: "Marks results that carry node content and states which acknowledged host may receive it."
	}
], El = {
	ToolCallCard: "always",
	ApprovalCard: "not-equal:confirmation:none",
	EgressBadge: "copy:contentEgress",
	untrustedFrame: "copy:returnsUntrustedContent"
}, Dl = new Intl.NumberFormat("en-US"), Ol = new Intl.NumberFormat("en-US", {
	maximumFractionDigits: 2,
	minimumFractionDigits: 0
}), kl = [
	"B",
	"KiB",
	"MiB",
	"GiB",
	"TiB",
	"PiB"
];
function Al(e) {
	return Dl.format(e);
}
function jl(e) {
	if (!Number.isFinite(e) || e < 0) return "0 B";
	let t = e, n = 0;
	for (; t >= 1024 && n < kl.length - 1;) t /= 1024, n++;
	return `${n === 0 ? Dl.format(t) : Ol.format(t)} ${kl[n]}`;
}
function Ml(e) {
	return e < 1024 ? `${Dl.format(e)} ${e === 1 ? "byte" : "bytes"}` : `${jl(e)} (${Dl.format(e)} bytes)`;
}
function Nl(e) {
	return `${jl(e)}/s`;
}
function Pl(e) {
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : `${t.toISOString().slice(0, 19).replace("T", " ")} UTC`;
}
function Fl(e, t = 12, n = 8) {
	return e.length <= t + n + 1 ? e : `${e.slice(0, t)}…${e.slice(-n)}`;
}
function Il(e, t, n = `${t}s`) {
	return `${Dl.format(e)} ${e === 1 ? t : n}`;
}
var Ll = /[‪-‮⁦-⁩‎‏؜]/gu, Rl = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/gu, zl = (e) => `\\u{${e.toString(16).toUpperCase()}}`;
function P(e) {
	return e.replace(Ll, (e) => zl(e.codePointAt(0) ?? 0)).replace(Rl, (e) => zl(e.codePointAt(0) ?? 0));
}
function Bl(e, t) {
	return e.length <= t ? {
		text: e,
		clipped: !1,
		omitted: 0
	} : {
		text: e.slice(0, t),
		clipped: !0,
		omitted: e.length - t
	};
}
var Vl = 65536, Hl = {
	size: 16,
	strokeWidth: 1.5,
	"aria-hidden": !0,
	focusable: !1
}, Ul = (e) => /* @__PURE__ */ (0, N.jsx)(ol, {
	...Hl,
	...e
}), Wl = (e) => /* @__PURE__ */ (0, N.jsx)(Jc, {
	...Hl,
	...e
}), Gl = (e) => /* @__PURE__ */ (0, N.jsx)(Xc, {
	...Hl,
	...e
}), Kl = (e) => /* @__PURE__ */ (0, N.jsx)(ul, {
	...Hl,
	...e
}), ql = (e) => /* @__PURE__ */ (0, N.jsx)(cl, {
	...Hl,
	...e
}), Jl = (e) => /* @__PURE__ */ (0, N.jsx)(il, {
	...Hl,
	...e
}), Yl = (e) => /* @__PURE__ */ (0, N.jsx)(Qc, {
	...Hl,
	...e
}), Xl = (e) => /* @__PURE__ */ (0, N.jsx)(el, {
	...Hl,
	...e
}), Zl = (e) => /* @__PURE__ */ (0, N.jsx)(nl, {
	...Hl,
	...e
}), Ql = (e) => /* @__PURE__ */ (0, N.jsx)(fl, {
	...Hl,
	...e
});
function $l({ variant: e = "secondary", compact: t = !1, className: n, ...r }) {
	let i = [
		"iu-btn",
		`iu-btn--${e}`,
		t ? "iu-btn--compact" : "",
		n ?? ""
	].filter(Boolean).join(" ");
	return /* @__PURE__ */ (0, N.jsx)("button", {
		type: "button",
		className: i,
		...r
	});
}
function F({ tone: e = "neutral", icon: t, children: n }) {
	return /* @__PURE__ */ (0, N.jsxs)("span", {
		className: `iu-badge iu-badge--${e}`,
		children: [t, n]
	});
}
function eu(e) {
	let { copy: t } = bl(), n = xl(), [r, i] = (0, M.useState)("idle"), a = (0, M.useRef)(void 0);
	return (0, M.useEffect)(() => () => clearTimeout(a.current), []), [r, async (r) => {
		let o = "copied";
		try {
			t ? await t(r) : await navigator.clipboard.writeText(r);
		} catch {
			o = "failed";
		}
		i(o), n(o === "copied" ? `${e}: copied` : `${e}: copy failed`), clearTimeout(a.current), a.current = setTimeout(() => i("idle"), 2e3);
	}];
}
function tu({ value: e, label: t }) {
	let [n, r] = eu(t);
	return /* @__PURE__ */ (0, N.jsx)(N.Fragment, { children: /* @__PURE__ */ (0, N.jsxs)("button", {
		type: "button",
		className: "iu-btn iu-btn--text iu-btn--compact iu-copy",
		onClick: () => void r(e),
		"aria-label": t,
		children: [(0, N.jsx)(n === "copied" ? Wl : n === "failed" ? Yl : Ul, {}), /* @__PURE__ */ (0, N.jsx)("span", { children: n === "copied" ? "Copied" : n === "failed" ? "Copy failed" : "Copy" })]
	}) });
}
function nu({ value: e, kind: t = "CID", compact: n = !1, noCopy: r = !1 }) {
	let i = n ? Fl(e) : e;
	return /* @__PURE__ */ (0, N.jsxs)("span", {
		className: "iu-id",
		children: [/* @__PURE__ */ (0, N.jsx)("code", {
			className: "iu-id__value",
			children: n && i !== e ? /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsx)("span", {
				"aria-hidden": "true",
				children: i
			}), /* @__PURE__ */ (0, N.jsx)("span", {
				className: "iu-sr-only",
				children: e
			})] }) : e
		}), r ? null : /* @__PURE__ */ (0, N.jsx)(tu, {
			value: e,
			label: `Copy ${t} ${Fl(e, 10, 6)}`
		})]
	});
}
function ru(e) {
	return /* @__PURE__ */ (0, N.jsx)(nu, {
		kind: "CID",
		...e
	});
}
function iu({ value: e, exact: t = !1 }) {
	return /* @__PURE__ */ (0, N.jsx)("span", {
		className: "iu-num",
		title: Ml(e),
		children: t ? Ml(e) : jl(e)
	});
}
function au({ title: e, tool: t, headingLevel: n = 3, actions: r, children: i, className: a }) {
	let o = `h${n}`, s = (0, M.useId)();
	return /* @__PURE__ */ (0, N.jsxs)("section", {
		role: "group",
		className: ["iu-panel", a ?? ""].filter(Boolean).join(" "),
		"aria-labelledby": s,
		children: [/* @__PURE__ */ (0, N.jsxs)("header", {
			className: "iu-head",
			children: [
				/* @__PURE__ */ (0, N.jsx)(o, {
					id: s,
					className: "iu-title",
					children: e
				}),
				t ? /* @__PURE__ */ (0, N.jsx)("code", {
					className: "iu-tool",
					children: t
				}) : null,
				r ? /* @__PURE__ */ (0, N.jsx)("div", {
					className: "iu-head__actions",
					children: r
				}) : null
			]
		}), i]
	});
}
function ou({ items: e }) {
	return /* @__PURE__ */ (0, N.jsx)("dl", {
		className: "iu-kv",
		children: e.map((e) => /* @__PURE__ */ (0, N.jsxs)("div", {
			className: "iu-kv__row",
			children: [/* @__PURE__ */ (0, N.jsx)("dt", { children: e.label }), /* @__PURE__ */ (0, N.jsx)("dd", { children: e.value })]
		}, e.label))
	});
}
function su({ caption: e, columns: t, rows: n, rowKey: r, empty: i }) {
	return n.length === 0 ? /* @__PURE__ */ (0, N.jsx)(N.Fragment, { children: i ?? /* @__PURE__ */ (0, N.jsx)(cu, { children: "Nothing to show." }) }) : /* @__PURE__ */ (0, N.jsx)("div", {
		className: "iu-table-wrap",
		role: "region",
		"aria-label": e,
		tabIndex: 0,
		children: /* @__PURE__ */ (0, N.jsxs)("table", {
			className: "iu-table",
			children: [
				/* @__PURE__ */ (0, N.jsx)("caption", {
					className: "iu-sr-only",
					children: e
				}),
				/* @__PURE__ */ (0, N.jsx)("thead", { children: /* @__PURE__ */ (0, N.jsx)("tr", { children: t.map((e) => /* @__PURE__ */ (0, N.jsx)("th", {
					scope: "col",
					className: e.numeric ? "iu-num" : void 0,
					children: e.header
				}, e.key)) }) }),
				/* @__PURE__ */ (0, N.jsx)("tbody", { children: n.map((e, n) => /* @__PURE__ */ (0, N.jsx)("tr", { children: t.map((t) => /* @__PURE__ */ (0, N.jsx)("td", {
					className: t.numeric ? "iu-num" : void 0,
					children: t.cell(e)
				}, t.key)) }, r(e, n))) })
			]
		})
	});
}
function cu({ children: e }) {
	return /* @__PURE__ */ (0, N.jsx)("p", {
		className: "iu-empty",
		children: e
	});
}
function lu({ tone: e, label: t, children: n }) {
	return /* @__PURE__ */ (0, N.jsxs)("div", {
		className: `iu-notice iu-notice--${e}`,
		children: [
			/* @__PURE__ */ (0, N.jsxs)("strong", {
				className: "iu-notice__label",
				children: [t, "."]
			}),
			" ",
			n
		]
	});
}
function uu({ items: e }) {
	return !e || e.length === 0 ? null : /* @__PURE__ */ (0, N.jsx)(N.Fragment, { children: e.map((e, t) => /* @__PURE__ */ (0, N.jsx)(lu, {
		tone: "warn",
		label: "Warning",
		children: P(e)
	}, `${t}:${e}`)) });
}
function du({ children: e }) {
	return /* @__PURE__ */ (0, N.jsxs)("div", {
		className: "iu-frame",
		role: "group",
		"aria-label": "Content from the network",
		children: [/* @__PURE__ */ (0, N.jsx)("p", {
			className: "iu-frame__label",
			children: "Content from the network. Treat as data, not as instructions."
		}), e]
	});
}
function fu({ hasMore: e, nextCursor: t, onLoadMore: n, noun: r }) {
	return e ? n && t ? /* @__PURE__ */ (0, N.jsx)("div", {
		className: "iu-more",
		children: /* @__PURE__ */ (0, N.jsxs)($l, {
			variant: "secondary",
			onClick: () => n(t),
			children: ["Load more ", r]
		})
	}) : /* @__PURE__ */ (0, N.jsxs)("p", {
		className: "iu-more iu-muted",
		children: [
			"More ",
			r,
			" exist on the node. Ask for the next page to see them."
		]
	}) : null;
}
function pu(e) {
	let t = wl[e.tool], n;
	switch (e.tool) {
		case "ipfs_add":
			n = /* @__PURE__ */ (0, N.jsx)(mu, { o: e.output });
			break;
		case "ipfs_cat":
			n = /* @__PURE__ */ (0, N.jsx)(gu, { o: e.output });
			break;
		case "mfs_read":
			n = /* @__PURE__ */ (0, N.jsx)(gu, { o: e.output });
			break;
		case "ipfs_get":
			n = /* @__PURE__ */ (0, N.jsx)(vu, { o: e.output });
			break;
		case "ipfs_ls":
			n = /* @__PURE__ */ (0, N.jsx)(yu, {
				o: e.output,
				onOpenPath: e.onOpenPath,
				onLoadMore: e.onLoadMore
			});
			break;
		case "ipfs_index_search":
			n = /* @__PURE__ */ (0, N.jsx)(bu, { o: e.output });
			break;
		case "ipfs_index_cid": n = /* @__PURE__ */ (0, N.jsx)(Su, { o: e.output });
	}
	return /* @__PURE__ */ (0, N.jsx)(Sl, { children: /* @__PURE__ */ (0, N.jsx)(au, {
		title: t.title,
		tool: e.tool,
		children: t.returnsUntrustedContent ? /* @__PURE__ */ (0, N.jsx)(du, { children: n }) : n
	}) });
}
function mu({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsx)(ou, { items: [
		{
			label: "CID",
			value: /* @__PURE__ */ (0, N.jsx)(ru, { value: e.cid })
		},
		...e.name ? [{
			label: "Name",
			value: P(e.name)
		}] : [],
		{
			label: "Size",
			value: /* @__PURE__ */ (0, N.jsx)(iu, {
				value: e.size,
				exact: !0
			})
		},
		{
			label: "Pin",
			value: /* @__PURE__ */ (0, N.jsx)(F, {
				tone: e.pinned ? "ok" : "neutral",
				children: e.pinned ? "Pinned" : "Not pinned"
			})
		},
		{
			label: "Providing",
			value: /* @__PURE__ */ (0, N.jsx)(F, {
				tone: e.provided ? "ok" : "neutral",
				children: e.provided ? "Announced" : "Not announced"
			})
		},
		...e.resource ? [{
			label: "Resource",
			value: /* @__PURE__ */ (0, N.jsx)("code", { children: e.resource.uri })
		}] : []
	] }), /* @__PURE__ */ (0, N.jsx)(uu, { items: e.warnings })] });
}
function hu({ content: e, encoding: t }) {
	let n = Bl(t === "utf8" ? P(e) : e, Vl);
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
		t === "base64" ? /* @__PURE__ */ (0, N.jsx)(lu, {
			tone: "info",
			label: "Binary content",
			children: "These bytes are not valid text, so they are shown as base64."
		}) : null,
		/* @__PURE__ */ (0, N.jsx)("pre", {
			className: "iu-pre",
			tabIndex: 0,
			"aria-label": t === "utf8" ? "Content text" : "Content as base64",
			children: n.text
		}),
		n.clipped ? /* @__PURE__ */ (0, N.jsxs)(lu, {
			tone: "warn",
			label: "Preview clipped",
			children: [Al(n.omitted), " more characters were returned but are not rendered."]
		}) : null
	] });
}
function gu({ o: e }) {
	let t = e.offset + e.length;
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
		/* @__PURE__ */ (0, N.jsx)(ou, { items: [{
			label: "Path",
			value: /* @__PURE__ */ (0, N.jsx)("code", {
				className: "iu-wrap",
				children: P(e.path)
			})
		}, {
			label: "Range",
			value: /* @__PURE__ */ (0, N.jsxs)("span", {
				className: "iu-num",
				children: [
					"bytes ",
					Al(e.offset),
					" to ",
					Al(t),
					e.size === void 0 ? "" : ` of ${Ml(e.size)}`
				]
			})
		}] }),
		e.truncated ? /* @__PURE__ */ (0, N.jsxs)(lu, {
			tone: "warn",
			label: "Truncated",
			children: [
				"The node returned ",
				Al(e.length),
				" bytes",
				e.size === void 0 ? "" : ` of ${Al(e.size)}`,
				". Ask for a later offset to read the rest."
			]
		}) : null,
		e.length === 0 ? /* @__PURE__ */ (0, N.jsx)(cu, { children: "This range is empty." }) : /* @__PURE__ */ (0, N.jsx)(hu, {
			content: e.content,
			encoding: e.encoding
		})
	] });
}
var _u = {
	file: "File",
	directory: "Directory",
	symlink: "Symlink",
	unknown: "Unknown type"
};
function vu({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsx)(ou, { items: [
		{
			label: "Path",
			value: /* @__PURE__ */ (0, N.jsx)("code", {
				className: "iu-wrap",
				children: P(e.path)
			})
		},
		{
			label: "CID",
			value: /* @__PURE__ */ (0, N.jsx)(ru, { value: e.cid })
		},
		{
			label: "Type",
			value: /* @__PURE__ */ (0, N.jsx)(F, { children: _u[e.type] ?? e.type })
		},
		...e.size === void 0 ? [] : [{
			label: "Size",
			value: /* @__PURE__ */ (0, N.jsx)(iu, {
				value: e.size,
				exact: !0
			})
		}],
		{
			label: "Read separately",
			value: /* @__PURE__ */ (0, N.jsx)("code", {
				className: "iu-wrap",
				children: e.resource.uri
			})
		}
	] }), e.content !== void 0 && e.encoding ? /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [e.truncated ? /* @__PURE__ */ (0, N.jsx)(lu, {
		tone: "warn",
		label: "Truncated",
		children: "Only the start of this content is inline. Read the resource for the whole object."
	}) : null, /* @__PURE__ */ (0, N.jsx)(hu, {
		content: e.content,
		encoding: e.encoding
	})] }) : /* @__PURE__ */ (0, N.jsx)("p", {
		className: "iu-muted",
		children: "No inline content. Read the resource above to fetch the bytes."
	})] });
}
function yu({ o: e, onOpenPath: t, onLoadMore: n }) {
	let r = e.path.replace(/\/$/, "");
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
		/* @__PURE__ */ (0, N.jsxs)("p", {
			className: "iu-muted",
			children: ["Listing ", /* @__PURE__ */ (0, N.jsx)("code", {
				className: "iu-wrap",
				children: P(e.path)
			})]
		}),
		/* @__PURE__ */ (0, N.jsx)(su, {
			caption: `Entries in ${e.path}`,
			rows: e.entries,
			rowKey: (e, t) => `${e.cid}:${e.name}:${t}`,
			empty: /* @__PURE__ */ (0, N.jsx)(cu, { children: "This directory has no entries." }),
			columns: [
				{
					key: "name",
					header: "Name",
					cell: (e) => /* @__PURE__ */ (0, N.jsxs)("span", {
						className: "iu-entry",
						children: [e.type === "directory" ? /* @__PURE__ */ (0, N.jsx)(Kl, {}) : /* @__PURE__ */ (0, N.jsx)(ql, {}), e.type === "directory" && t ? /* @__PURE__ */ (0, N.jsx)($l, {
							variant: "text",
							compact: !0,
							onClick: () => t(`${r}/${e.name}`),
							children: P(e.name)
						}) : /* @__PURE__ */ (0, N.jsx)("span", {
							className: "iu-wrap",
							children: P(e.name)
						})]
					})
				},
				{
					key: "type",
					header: "Type",
					cell: (e) => _u[e.type] ?? e.type
				},
				{
					key: "size",
					header: "Size",
					numeric: !0,
					cell: (e) => e.size === void 0 ? "-" : /* @__PURE__ */ (0, N.jsx)(iu, { value: e.size })
				},
				{
					key: "cid",
					header: "CID",
					cell: (e) => /* @__PURE__ */ (0, N.jsx)(ru, {
						value: e.cid,
						compact: !0
					})
				}
			]
		}),
		/* @__PURE__ */ (0, N.jsx)(fu, {
			hasMore: e.page.has_more,
			nextCursor: e.page.next_cursor,
			onLoadMore: n,
			noun: "entries"
		})
	] });
}
function bu({ o: e }) {
	return e.results.length === 0 ? /* @__PURE__ */ (0, N.jsxs)(cu, { children: [
		"No indexed chunk matches. The search used model ",
		e.model,
		"."
	] }) : /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsxs)("p", {
		className: "iu-muted",
		children: [
			Al(e.results.length),
			" ",
			e.results.length === 1 ? "match" : "matches",
			" from model ",
			/* @__PURE__ */ (0, N.jsx)("code", { children: e.model }),
			", best first."
		]
	}), /* @__PURE__ */ (0, N.jsx)("ol", {
		className: "iu-hits",
		children: e.results.map((e) => /* @__PURE__ */ (0, N.jsxs)("li", {
			className: "iu-hit",
			children: [/* @__PURE__ */ (0, N.jsxs)("div", {
				className: "iu-hit__meta",
				children: [
					/* @__PURE__ */ (0, N.jsxs)(F, {
						tone: "info",
						children: ["Score ", e.score.toFixed(3)]
					}),
					/* @__PURE__ */ (0, N.jsx)(ru, {
						value: e.cid,
						compact: !0
					}),
					e.path ? /* @__PURE__ */ (0, N.jsx)("code", {
						className: "iu-wrap",
						children: P(e.path)
					}) : null,
					e.mime ? /* @__PURE__ */ (0, N.jsx)("span", {
						className: "iu-muted",
						children: P(e.mime)
					}) : null,
					/* @__PURE__ */ (0, N.jsxs)("span", {
						className: "iu-muted",
						children: ["chunk ", Al(e.chunk_index)]
					})
				]
			}), /* @__PURE__ */ (0, N.jsx)("p", {
				className: "iu-hit__text",
				children: P(e.text)
			})]
		}, `${e.cid}:${e.chunk_index}`))
	})] });
}
var xu = {
	mime_not_allowed: "The media type is not on the index allow list.",
	too_large: "The content is larger than the index size limit.",
	already_indexed: "This CID was already indexed.",
	not_a_file: "The CID is a directory or other non-file node, so there is no text to index.",
	empty: "The file has no content to index."
};
function Su({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsx)(ou, { items: [
		{
			label: "CID",
			value: /* @__PURE__ */ (0, N.jsx)(ru, { value: e.cid })
		},
		{
			label: "Chunks indexed",
			value: /* @__PURE__ */ (0, N.jsx)("span", {
				className: "iu-num",
				children: Al(e.chunks_indexed)
			})
		},
		...e.model ? [{
			label: "Model",
			value: /* @__PURE__ */ (0, N.jsx)("code", { children: e.model })
		}] : []
	] }), e.skipped_reason ? /* @__PURE__ */ (0, N.jsx)(lu, {
		tone: "info",
		label: "Skipped",
		children: xu[e.skipped_reason] ?? e.skipped_reason
	}) : null] });
}
function Cu(e) {
	let t = wl[e.tool], n;
	switch (e.tool) {
		case "pin_ls":
			n = /* @__PURE__ */ (0, N.jsx)(Tu, {
				o: e.output,
				onLoadMore: e.onLoadMore,
				onRequestUnpin: e.onRequestUnpin
			});
			break;
		case "pin_add":
			n = /* @__PURE__ */ (0, N.jsx)(Du, { o: e.output });
			break;
		case "pin_rm":
			n = /* @__PURE__ */ (0, N.jsx)(Ou, { o: e.output });
			break;
		case "pin_update":
			n = /* @__PURE__ */ (0, N.jsx)(ku, { o: e.output });
			break;
		case "pin_verify": n = /* @__PURE__ */ (0, N.jsx)(Au, {
			o: e.output,
			onLoadMore: e.onLoadMore
		});
	}
	return /* @__PURE__ */ (0, N.jsx)(Sl, { children: /* @__PURE__ */ (0, N.jsx)(au, {
		title: t.title,
		tool: e.tool,
		children: n
	}) });
}
var wu = {
	recursive: "Recursive",
	direct: "Direct",
	indirect: "Indirect"
};
function Tu({ o: e, onLoadMore: t, onRequestUnpin: n }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
		/* @__PURE__ */ (0, N.jsxs)("p", {
			className: "iu-muted",
			children: [
				Il(e.pins.length, "pin"),
				" on this page",
				e.page.has_more ? "; more exist" : "",
				"."
			]
		}),
		/* @__PURE__ */ (0, N.jsx)(su, {
			caption: "Pins",
			rows: e.pins,
			rowKey: (e, t) => `${e.cid}:${t}`,
			empty: /* @__PURE__ */ (0, N.jsx)(cu, { children: "No pins match. Pin content with an agent and it appears here." }),
			columns: [
				{
					key: "cid",
					header: "CID",
					cell: (e) => /* @__PURE__ */ (0, N.jsx)(ru, {
						value: e.cid,
						compact: !0
					})
				},
				{
					key: "type",
					header: "Type",
					cell: (e) => /* @__PURE__ */ (0, N.jsx)(F, { children: wu[e.type] ?? e.type })
				},
				{
					key: "name",
					header: "Name",
					cell: (e) => e.name ? P(e.name) : /* @__PURE__ */ (0, N.jsx)("span", {
						className: "iu-muted",
						children: "No name"
					})
				},
				...n ? [{
					key: "action",
					header: "Action",
					cell: (e) => /* @__PURE__ */ (0, N.jsxs)($l, {
						variant: "text",
						compact: !0,
						onClick: () => n(e.cid),
						children: [
							"Request unpin",
							" ",
							/* @__PURE__ */ (0, N.jsx)("span", {
								className: "iu-sr-only",
								children: e.cid
							})
						]
					})
				}] : []
			]
		}),
		n && e.pins.length > 0 ? /* @__PURE__ */ (0, N.jsx)("p", {
			className: "iu-muted",
			children: "Request unpin asks the agent to remove a pin. A person still approves it first."
		}) : null,
		/* @__PURE__ */ (0, N.jsx)(fu, {
			hasMore: e.page.has_more,
			nextCursor: e.page.next_cursor,
			onLoadMore: t,
			noun: "pins"
		})
	] });
}
function Eu({ cids: e }) {
	return /* @__PURE__ */ (0, N.jsx)("ul", {
		className: "iu-list",
		children: e.map((e) => /* @__PURE__ */ (0, N.jsx)("li", { children: /* @__PURE__ */ (0, N.jsx)(ru, { value: e }) }, e))
	});
}
function Du({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsxs)("p", { children: [
		/* @__PURE__ */ (0, N.jsx)(F, {
			tone: "ok",
			icon: /* @__PURE__ */ (0, N.jsx)(Xl, {}),
			children: "Pinned"
		}),
		" ",
		Il(e.pins.length, "CID"),
		" now pinned on your node",
		e.name ? ` as ${P(e.name)}` : "",
		"."
	] }), /* @__PURE__ */ (0, N.jsx)(Eu, { cids: e.pins })] });
}
function Ou({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
		/* @__PURE__ */ (0, N.jsxs)("p", { children: [
			/* @__PURE__ */ (0, N.jsx)(F, {
				tone: "warn",
				children: "Unpinned"
			}),
			" ",
			Il(e.unpinned.length, "CID"),
			". Unpinned content becomes eligible for garbage collection."
		] }),
		/* @__PURE__ */ (0, N.jsx)(Eu, { cids: e.unpinned }),
		/* @__PURE__ */ (0, N.jsx)(uu, { items: e.warnings })
	] });
}
function ku({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsx)(ou, { items: [
		{
			label: "From",
			value: /* @__PURE__ */ (0, N.jsx)(ru, { value: e.from })
		},
		{
			label: "To",
			value: /* @__PURE__ */ (0, N.jsx)(ru, { value: e.to })
		},
		{
			label: "Old pin",
			value: /* @__PURE__ */ (0, N.jsx)(F, {
				tone: e.unpinned_old ? "warn" : "neutral",
				children: e.unpinned_old ? "Unpinned" : "Kept"
			})
		}
	] }), /* @__PURE__ */ (0, N.jsx)(uu, { items: e.warnings })] });
}
function Au({ o: e, onLoadMore: t }) {
	let n = e.results.filter((e) => !e.ok).length;
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
		/* @__PURE__ */ (0, N.jsxs)("p", { children: [
			n === 0 ? /* @__PURE__ */ (0, N.jsx)(F, {
				tone: "ok",
				icon: /* @__PURE__ */ (0, N.jsx)(Xl, {}),
				children: "All verified"
			}) : /* @__PURE__ */ (0, N.jsxs)(F, {
				tone: "err",
				icon: /* @__PURE__ */ (0, N.jsx)(Zl, {}),
				children: [Al(n), " damaged"]
			}),
			" ",
			Il(e.results.length, "pin"),
			" checked on this page."
		] }),
		/* @__PURE__ */ (0, N.jsx)(su, {
			caption: "Pin verification",
			rows: e.results,
			rowKey: (e, t) => `${e.cid}:${t}`,
			columns: [
				{
					key: "cid",
					header: "CID",
					cell: (e) => /* @__PURE__ */ (0, N.jsx)(ru, {
						value: e.cid,
						compact: !0
					})
				},
				{
					key: "state",
					header: "State",
					cell: (e) => e.ok ? /* @__PURE__ */ (0, N.jsx)(F, {
						tone: "ok",
						children: "Verified"
					}) : /* @__PURE__ */ (0, N.jsx)(F, {
						tone: "err",
						children: "Damaged"
					})
				},
				{
					key: "detail",
					header: "Detail",
					cell: (e) => e.bad_nodes && e.bad_nodes.length > 0 ? /* @__PURE__ */ (0, N.jsxs)("details", { children: [/* @__PURE__ */ (0, N.jsx)("summary", { children: Il(e.bad_nodes.length, "bad block") }), /* @__PURE__ */ (0, N.jsx)("ul", {
						className: "iu-list",
						children: e.bad_nodes.map((e) => /* @__PURE__ */ (0, N.jsxs)("li", { children: [
							/* @__PURE__ */ (0, N.jsx)(ru, {
								value: e.cid,
								compact: !0
							}),
							" ",
							/* @__PURE__ */ (0, N.jsx)("span", {
								className: "iu-muted",
								children: P(e.error)
							})
						] }, e.cid))
					})] }) : /* @__PURE__ */ (0, N.jsx)("span", {
						className: "iu-muted",
						children: "None"
					})
				}
			]
		}),
		n > 0 ? /* @__PURE__ */ (0, N.jsx)(lu, {
			tone: "err",
			label: "Damaged",
			children: "Damaged blocks are missing or fail their hash check. The content may be unreadable until it is fetched again."
		}) : null,
		/* @__PURE__ */ (0, N.jsx)(fu, {
			hasMore: e.page.has_more,
			nextCursor: e.page.next_cursor,
			onLoadMore: t,
			noun: "results"
		})
	] });
}
function ju(e) {
	let t = wl[e.tool], n;
	switch (e.tool) {
		case "mfs_ls":
			n = /* @__PURE__ */ (0, N.jsx)(Pu, {
				o: e.output,
				onOpenPath: e.onOpenPath,
				onLoadMore: e.onLoadMore
			});
			break;
		case "mfs_stat":
			n = /* @__PURE__ */ (0, N.jsx)(Fu, { o: e.output });
			break;
		case "mfs_write":
			n = /* @__PURE__ */ (0, N.jsx)(Iu, { o: e.output });
			break;
		case "mfs_mkdir":
			n = /* @__PURE__ */ (0, N.jsx)(Lu, { o: e.output });
			break;
		case "mfs_cp":
			n = /* @__PURE__ */ (0, N.jsx)(Ru, {
				o: e.output,
				verb: "Copied"
			});
			break;
		case "mfs_mv":
			n = /* @__PURE__ */ (0, N.jsx)(Ru, {
				o: e.output,
				verb: "Moved"
			});
			break;
		case "mfs_rm": n = /* @__PURE__ */ (0, N.jsx)(zu, { o: e.output });
	}
	return /* @__PURE__ */ (0, N.jsx)(Sl, { children: /* @__PURE__ */ (0, N.jsx)(au, {
		title: t.title,
		tool: e.tool,
		children: t.returnsUntrustedContent ? /* @__PURE__ */ (0, N.jsx)(du, { children: n }) : n
	}) });
}
function Mu(e) {
	let t = e.split("/").filter(Boolean), n = [{
		name: "/",
		path: "/"
	}], r = "";
	for (let e of t) r += `/${e}`, n.push({
		name: e,
		path: r
	});
	return n;
}
function Nu({ path: e, onOpenPath: t }) {
	let n = Mu(e);
	return /* @__PURE__ */ (0, N.jsx)("nav", {
		"aria-label": "Path",
		children: /* @__PURE__ */ (0, N.jsx)("ol", {
			className: "iu-trail",
			children: n.map((e, r) => {
				let i = r === n.length - 1;
				return /* @__PURE__ */ (0, N.jsxs)("li", { children: [r > 0 ? /* @__PURE__ */ (0, N.jsx)(Gl, { className: "iu-trail__sep" }) : null, t && !i ? /* @__PURE__ */ (0, N.jsx)($l, {
					variant: "text",
					compact: !0,
					onClick: () => t(e.path),
					children: P(e.name === "/" ? "Root" : e.name)
				}) : /* @__PURE__ */ (0, N.jsx)("span", {
					"aria-current": i ? "page" : void 0,
					className: i ? "iu-trail__here" : void 0,
					children: P(e.name === "/" ? "Root" : e.name)
				})] }, e.path);
			})
		})
	});
}
function Pu({ o: e, onOpenPath: t, onLoadMore: n }) {
	let r = e.path === "/" ? "" : e.path.replace(/\/$/, "");
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
		/* @__PURE__ */ (0, N.jsx)(Nu, {
			path: e.path,
			onOpenPath: t
		}),
		/* @__PURE__ */ (0, N.jsx)(su, {
			caption: `Entries in ${e.path}`,
			rows: e.entries,
			rowKey: (e, t) => `${e.name}:${t}`,
			empty: /* @__PURE__ */ (0, N.jsx)(cu, { children: "This directory is empty." }),
			columns: [
				{
					key: "name",
					header: "Name",
					cell: (e) => /* @__PURE__ */ (0, N.jsxs)("span", {
						className: "iu-entry",
						children: [e.type === "directory" ? /* @__PURE__ */ (0, N.jsx)(Kl, {}) : /* @__PURE__ */ (0, N.jsx)(ql, {}), t ? /* @__PURE__ */ (0, N.jsxs)($l, {
							variant: "text",
							compact: !0,
							onClick: () => t(`${r}/${e.name}`),
							children: [P(e.name), /* @__PURE__ */ (0, N.jsx)("span", {
								className: "iu-sr-only",
								children: e.type === "directory" ? ", open directory" : ", show details"
							})]
						}) : /* @__PURE__ */ (0, N.jsx)("span", {
							className: "iu-wrap",
							children: P(e.name)
						})]
					})
				},
				{
					key: "type",
					header: "Type",
					cell: (e) => e.type === "directory" ? "Directory" : "File"
				},
				{
					key: "size",
					header: "Size",
					numeric: !0,
					cell: (e) => e.size === void 0 ? "-" : /* @__PURE__ */ (0, N.jsx)(iu, { value: e.size })
				},
				{
					key: "cid",
					header: "CID",
					cell: (e) => e.cid ? /* @__PURE__ */ (0, N.jsx)(ru, {
						value: e.cid,
						compact: !0
					}) : "-"
				}
			]
		}),
		/* @__PURE__ */ (0, N.jsx)(fu, {
			hasMore: e.page.has_more,
			nextCursor: e.page.next_cursor,
			onLoadMore: n,
			noun: "entries"
		})
	] });
}
function Fu({ o: e }) {
	return /* @__PURE__ */ (0, N.jsx)(ou, { items: [
		{
			label: "Path",
			value: /* @__PURE__ */ (0, N.jsx)("code", {
				className: "iu-wrap",
				children: P(e.path)
			})
		},
		{
			label: "Type",
			value: /* @__PURE__ */ (0, N.jsx)(F, { children: e.type === "directory" ? "Directory" : "File" })
		},
		{
			label: "CID",
			value: /* @__PURE__ */ (0, N.jsx)(ru, { value: e.cid })
		},
		{
			label: "Size",
			value: /* @__PURE__ */ (0, N.jsx)(iu, {
				value: e.size,
				exact: !0
			})
		},
		...e.cumulative_size === void 0 ? [] : [{
			label: "With children",
			value: /* @__PURE__ */ (0, N.jsx)(iu, {
				value: e.cumulative_size,
				exact: !0
			})
		}],
		...e.blocks === void 0 ? [] : [{
			label: "Blocks",
			value: /* @__PURE__ */ (0, N.jsx)("span", {
				className: "iu-num",
				children: Al(e.blocks)
			})
		}]
	] });
}
function Iu({ o: e }) {
	return /* @__PURE__ */ (0, N.jsx)(ou, { items: [
		{
			label: "Wrote",
			value: /* @__PURE__ */ (0, N.jsx)("code", {
				className: "iu-wrap",
				children: P(e.path)
			})
		},
		{
			label: "Bytes written",
			value: /* @__PURE__ */ (0, N.jsx)(iu, {
				value: e.bytes_written,
				exact: !0
			})
		},
		{
			label: "New CID",
			value: /* @__PURE__ */ (0, N.jsx)(ru, { value: e.cid })
		}
	] });
}
function Lu({ o: e }) {
	return /* @__PURE__ */ (0, N.jsx)(ou, { items: [{
		label: "Created",
		value: /* @__PURE__ */ (0, N.jsx)("code", {
			className: "iu-wrap",
			children: P(e.path)
		})
	}, {
		label: "CID",
		value: /* @__PURE__ */ (0, N.jsx)(ru, { value: e.cid })
	}] });
}
function Ru({ o: e, verb: t }) {
	return /* @__PURE__ */ (0, N.jsx)(ou, { items: [
		{
			label: t,
			value: /* @__PURE__ */ (0, N.jsx)("code", {
				className: "iu-wrap",
				children: P(e.source)
			})
		},
		{
			label: "To",
			value: /* @__PURE__ */ (0, N.jsx)("code", {
				className: "iu-wrap",
				children: P(e.destination)
			})
		},
		..."cid" in e ? [{
			label: "CID",
			value: /* @__PURE__ */ (0, N.jsx)(ru, { value: e.cid })
		}] : []
	] });
}
function zu({ o: e }) {
	return /* @__PURE__ */ (0, N.jsx)(ou, { items: [{
		label: "Removed",
		value: /* @__PURE__ */ (0, N.jsx)("code", {
			className: "iu-wrap",
			children: P(e.removed)
		})
	}, {
		label: "Effect",
		value: "The path is gone from MFS. Pinned content stays on your node."
	}] });
}
var Bu = 12, Vu = 1, Hu = 100;
function Uu({ value: e, label: t }) {
	return /* @__PURE__ */ (0, N.jsx)("div", {
		className: "iu-json",
		role: "group",
		"aria-label": t,
		children: /* @__PURE__ */ (0, N.jsx)(qu, {
			name: null,
			value: e,
			depth: 0
		})
	});
}
function Wu(e) {
	if (e && typeof e == "object" && !Array.isArray(e)) {
		let t = Object.keys(e);
		if (t.length === 1 && t[0] === "/" && typeof e["/"] == "string") return e["/"];
	}
	return null;
}
function Gu(e) {
	if (e && typeof e == "object" && !Array.isArray(e)) {
		let t = Object.keys(e), n = e["/"];
		if (t.length === 1 && t[0] === "/" && n && typeof n == "object" && !Array.isArray(n)) {
			let e = n.bytes;
			if (typeof e == "string") return e;
		}
	}
	return null;
}
function Ku({ name: e }) {
	return e === null ? null : /* @__PURE__ */ (0, N.jsxs)("span", {
		className: "iu-json__key",
		children: [P(e), ": "]
	});
}
function qu({ name: e, value: t, depth: n }) {
	let r = Wu(t);
	if (r !== null) return /* @__PURE__ */ (0, N.jsxs)("div", {
		className: "iu-json__row",
		children: [
			/* @__PURE__ */ (0, N.jsx)(Ku, { name: e }),
			/* @__PURE__ */ (0, N.jsx)("span", {
				className: "iu-muted",
				children: "link "
			}),
			/* @__PURE__ */ (0, N.jsx)(ru, {
				value: r,
				compact: !0
			})
		]
	});
	let i = Gu(t);
	if (i !== null) return /* @__PURE__ */ (0, N.jsxs)("div", {
		className: "iu-json__row",
		children: [/* @__PURE__ */ (0, N.jsx)(Ku, { name: e }), /* @__PURE__ */ (0, N.jsxs)("span", {
			className: "iu-muted",
			children: [
				"bytes, ",
				i.length,
				" base64 characters"
			]
		})]
	});
	if (typeof t != "object" || !t) return /* @__PURE__ */ (0, N.jsxs)("div", {
		className: "iu-json__row",
		children: [/* @__PURE__ */ (0, N.jsx)(Ku, { name: e }), /* @__PURE__ */ (0, N.jsx)(Ju, { value: t })]
	});
	if (n >= Bu) return /* @__PURE__ */ (0, N.jsxs)("div", {
		className: "iu-json__row",
		children: [/* @__PURE__ */ (0, N.jsx)(Ku, { name: e }), /* @__PURE__ */ (0, N.jsxs)("span", {
			className: "iu-muted",
			children: [
				"nested deeper than ",
				Bu,
				" levels, not rendered"
			]
		})]
	});
	let a = Array.isArray(t), o = a ? t.map((e, t) => [String(t), e]) : Object.entries(t), s = o.slice(0, Hu), c = a ? `array, ${o.length} ${o.length === 1 ? "item" : "items"}` : `object, ${o.length} ${o.length === 1 ? "key" : "keys"}`;
	return /* @__PURE__ */ (0, N.jsxs)("details", {
		className: "iu-json__group",
		open: n < Vu,
		children: [/* @__PURE__ */ (0, N.jsxs)("summary", { children: [/* @__PURE__ */ (0, N.jsx)(Ku, { name: e }), /* @__PURE__ */ (0, N.jsx)("span", {
			className: "iu-muted",
			children: c
		})] }), /* @__PURE__ */ (0, N.jsxs)("div", {
			className: "iu-json__children",
			children: [s.map(([e, t]) => /* @__PURE__ */ (0, N.jsx)(qu, {
				name: a ? `[${e}]` : e,
				value: t,
				depth: n + 1
			}, e)), o.length > Hu ? /* @__PURE__ */ (0, N.jsxs)("p", {
				className: "iu-muted",
				children: [o.length - Hu, " more entries are not rendered."]
			}) : null]
		})]
	});
}
function Ju({ value: e }) {
	return e === null ? /* @__PURE__ */ (0, N.jsx)("span", {
		className: "iu-json__null",
		children: "null"
	}) : typeof e == "string" ? /* @__PURE__ */ (0, N.jsx)("span", {
		className: "iu-json__str",
		children: JSON.stringify(P(e))
	}) : /* @__PURE__ */ (0, N.jsx)("span", {
		className: typeof e == "number" ? "iu-json__num" : "iu-json__bool",
		children: String(e)
	});
}
function Yu(e) {
	let t = wl[e.tool], n;
	switch (e.tool) {
		case "dag_get":
			n = /* @__PURE__ */ (0, N.jsx)(Xu, { o: e.output });
			break;
		case "dag_stat":
			n = /* @__PURE__ */ (0, N.jsx)(Zu, { o: e.output });
			break;
		case "dag_put":
			n = /* @__PURE__ */ (0, N.jsx)(Qu, { o: e.output });
			break;
		case "car_import":
			n = /* @__PURE__ */ (0, N.jsx)($u, { o: e.output });
			break;
		case "car_export": n = /* @__PURE__ */ (0, N.jsx)(ed, { o: e.output });
	}
	return /* @__PURE__ */ (0, N.jsx)(Sl, { children: /* @__PURE__ */ (0, N.jsx)(au, {
		title: t.title,
		tool: e.tool,
		children: t.returnsUntrustedContent ? /* @__PURE__ */ (0, N.jsx)(du, { children: n }) : n
	}) });
}
function Xu({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
		/* @__PURE__ */ (0, N.jsx)(ou, { items: [
			{
				label: "Path",
				value: /* @__PURE__ */ (0, N.jsx)("code", {
					className: "iu-wrap",
					children: e.path
				})
			},
			{
				label: "CID",
				value: /* @__PURE__ */ (0, N.jsx)(ru, { value: e.cid })
			},
			...e.codec ? [{
				label: "Codec",
				value: /* @__PURE__ */ (0, N.jsx)("code", { children: e.codec })
			}] : [],
			...e.resource ? [{
				label: "Read separately",
				value: /* @__PURE__ */ (0, N.jsx)("code", {
					className: "iu-wrap",
					children: e.resource.uri
				})
			}] : []
		] }),
		e.truncated ? /* @__PURE__ */ (0, N.jsx)(lu, {
			tone: "warn",
			label: "Truncated",
			children: "This node is larger than the inline limit. Read the resource for the whole node."
		}) : null,
		e.node === void 0 ? /* @__PURE__ */ (0, N.jsx)("p", {
			className: "iu-muted",
			children: "No inline node. Read the resource above for the encoded block."
		}) : /* @__PURE__ */ (0, N.jsx)(Uu, {
			value: e.node,
			label: "IPLD node"
		})
	] });
}
function Zu({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsx)(ou, { items: [
		{
			label: "Total size",
			value: /* @__PURE__ */ (0, N.jsx)(iu, {
				value: e.total_size,
				exact: !0
			})
		},
		{
			label: "Unique blocks",
			value: /* @__PURE__ */ (0, N.jsx)("span", {
				className: "iu-num",
				children: Al(e.unique_blocks)
			})
		},
		...e.shared_size === void 0 ? [] : [{
			label: "Shared size",
			value: /* @__PURE__ */ (0, N.jsx)(iu, {
				value: e.shared_size,
				exact: !0
			})
		}],
		...e.ratio === void 0 ? [] : [{
			label: "Dedup ratio",
			value: /* @__PURE__ */ (0, N.jsx)("span", {
				className: "iu-num",
				children: e.ratio.toFixed(2)
			})
		}]
	] }), /* @__PURE__ */ (0, N.jsx)(su, {
		caption: "DAGs measured",
		rows: e.dags,
		rowKey: (e, t) => `${e.cid}:${t}`,
		empty: /* @__PURE__ */ (0, N.jsx)(cu, { children: "No DAG was measured." }),
		columns: [
			{
				key: "cid",
				header: "Root CID",
				cell: (e) => /* @__PURE__ */ (0, N.jsx)(ru, {
					value: e.cid,
					compact: !0
				})
			},
			{
				key: "size",
				header: "Size",
				numeric: !0,
				cell: (e) => /* @__PURE__ */ (0, N.jsx)(iu, { value: e.size })
			},
			{
				key: "blocks",
				header: "Blocks",
				numeric: !0,
				cell: (e) => Al(e.num_blocks)
			}
		]
	})] });
}
function Qu({ o: e }) {
	return /* @__PURE__ */ (0, N.jsx)(ou, { items: [{
		label: "Stored as",
		value: /* @__PURE__ */ (0, N.jsx)(ru, { value: e.cid })
	}, {
		label: "Pin",
		value: /* @__PURE__ */ (0, N.jsx)(F, {
			tone: e.pinned ? "ok" : "neutral",
			children: e.pinned ? "Pinned" : "Not pinned"
		})
	}] });
}
function $u({ o: e }) {
	let t = e.roots.filter((e) => e.pin_error);
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
		/* @__PURE__ */ (0, N.jsxs)("p", { children: [
			Il(e.roots.length, "root"),
			" imported",
			e.block_count === void 0 ? "" : `, ${Il(e.block_count, "block")} read`,
			"."
		] }),
		/* @__PURE__ */ (0, N.jsx)(su, {
			caption: "Imported roots",
			rows: e.roots,
			rowKey: (e, t) => `${e.cid}:${t}`,
			columns: [
				{
					key: "cid",
					header: "Root CID",
					cell: (e) => /* @__PURE__ */ (0, N.jsx)(ru, {
						value: e.cid,
						compact: !0
					})
				},
				{
					key: "pinned",
					header: "Pin",
					cell: (e) => /* @__PURE__ */ (0, N.jsx)(F, {
						tone: e.pinned ? "ok" : e.pin_error ? "err" : "neutral",
						children: e.pinned ? "Pinned" : e.pin_error ? "Pin failed" : "Not pinned"
					})
				},
				{
					key: "error",
					header: "Detail",
					cell: (e) => e.pin_error ?? /* @__PURE__ */ (0, N.jsx)("span", {
						className: "iu-muted",
						children: "None"
					})
				}
			]
		}),
		t.length > 0 ? /* @__PURE__ */ (0, N.jsxs)(lu, {
			tone: "err",
			label: "Pin failed",
			children: [Il(t.length, "root"), " imported but not pinned. Garbage collection can remove unpinned blocks."]
		}) : null
	] });
}
function ed({ o: e }) {
	return /* @__PURE__ */ (0, N.jsx)(ou, { items: [
		{
			label: "Root",
			value: /* @__PURE__ */ (0, N.jsx)(ru, { value: e.root })
		},
		...e.size === void 0 ? [] : [{
			label: "Archive size",
			value: /* @__PURE__ */ (0, N.jsx)(iu, {
				value: e.size,
				exact: !0
			})
		}],
		{
			label: "Delivery",
			value: e.inline ? /* @__PURE__ */ (0, N.jsxs)(F, {
				tone: "info",
				children: [
					"Inline base64, ",
					e.car_base64 ? Al(e.car_base64.length) : 0,
					" characters"
				]
			}) : /* @__PURE__ */ (0, N.jsx)(F, { children: "Read as a resource" })
		},
		...e.resource ? [{
			label: "Resource",
			value: /* @__PURE__ */ (0, N.jsx)("code", {
				className: "iu-wrap",
				children: e.resource.uri
			})
		}] : []
	] });
}
var td = "Only the key name and public ID are shown. Private key material never leaves the node.";
function nd(e) {
	let t = wl[e.tool], n;
	switch (e.tool) {
		case "ipns_resolve":
			n = /* @__PURE__ */ (0, N.jsx)(rd, { o: e.output });
			break;
		case "ipns_publish":
			n = /* @__PURE__ */ (0, N.jsx)(id, { o: e.output });
			break;
		case "key_list":
			n = /* @__PURE__ */ (0, N.jsx)(ad, { o: e.output });
			break;
		case "key_gen":
			n = /* @__PURE__ */ (0, N.jsx)(od, { o: e.output });
			break;
		case "key_rename":
			n = /* @__PURE__ */ (0, N.jsx)(sd, { o: e.output });
			break;
		case "key_rm": n = /* @__PURE__ */ (0, N.jsx)(cd, { o: e.output });
	}
	return /* @__PURE__ */ (0, N.jsx)(Sl, { children: /* @__PURE__ */ (0, N.jsx)(au, {
		title: t.title,
		tool: e.tool,
		children: t.returnsUntrustedContent ? /* @__PURE__ */ (0, N.jsx)(du, { children: n }) : n
	}) });
}
function rd({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsx)(ou, { items: [{
		label: "Name",
		value: /* @__PURE__ */ (0, N.jsx)(nu, {
			value: e.name,
			kind: "IPNS name"
		})
	}, {
		label: "Resolves to",
		value: /* @__PURE__ */ (0, N.jsx)(nu, {
			value: e.path,
			kind: "path"
		})
	}] }), /* @__PURE__ */ (0, N.jsx)("p", {
		className: "iu-muted",
		children: "A name can point somewhere else at any time. Check the target before you rely on it."
	})] });
}
function id({ o: e }) {
	return /* @__PURE__ */ (0, N.jsx)(ou, { items: [
		{
			label: "Name",
			value: /* @__PURE__ */ (0, N.jsx)(nu, {
				value: e.name,
				kind: "IPNS name"
			})
		},
		{
			label: "Now points to",
			value: /* @__PURE__ */ (0, N.jsx)(nu, {
				value: e.value,
				kind: "path"
			})
		},
		{
			label: "Record",
			value: /* @__PURE__ */ (0, N.jsx)(F, {
				tone: "ok",
				children: "Published"
			})
		}
	] });
}
function ad({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsx)(su, {
		caption: "Keystore keys",
		rows: e.keys,
		rowKey: (e) => e.name,
		empty: /* @__PURE__ */ (0, N.jsx)(cu, { children: "The keystore has no keys." }),
		columns: [{
			key: "name",
			header: "Name",
			cell: (e) => /* @__PURE__ */ (0, N.jsxs)("span", {
				className: "iu-entry",
				children: [/* @__PURE__ */ (0, N.jsx)(Ql, {}), P(e.name)]
			})
		}, {
			key: "id",
			header: "Public ID",
			cell: (e) => /* @__PURE__ */ (0, N.jsx)(nu, {
				value: e.id,
				kind: "key ID",
				compact: !0
			})
		}]
	}), /* @__PURE__ */ (0, N.jsxs)("p", {
		className: "iu-muted",
		children: [
			Il(e.keys.length, "key"),
			". ",
			td
		]
	})] });
}
function od({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsx)(ou, { items: [{
		label: "Key name",
		value: P(e.name)
	}, {
		label: "Public ID",
		value: /* @__PURE__ */ (0, N.jsx)(nu, {
			value: e.id,
			kind: "key ID"
		})
	}] }), /* @__PURE__ */ (0, N.jsx)("p", {
		className: "iu-muted",
		children: td
	})] });
}
function sd({ o: e }) {
	return /* @__PURE__ */ (0, N.jsx)(ou, { items: [
		{
			label: "Was",
			value: P(e.old_name)
		},
		{
			label: "Now",
			value: P(e.new_name)
		},
		{
			label: "Public ID",
			value: /* @__PURE__ */ (0, N.jsx)(nu, {
				value: e.id,
				kind: "key ID"
			})
		}
	] });
}
function cd({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsx)(su, {
		caption: "Removed keys",
		rows: e.removed,
		rowKey: (e) => e.name,
		columns: [{
			key: "name",
			header: "Name",
			cell: (e) => P(e.name)
		}, {
			key: "id",
			header: "Public ID",
			cell: (e) => /* @__PURE__ */ (0, N.jsx)(nu, {
				value: e.id,
				kind: "key ID",
				compact: !0
			})
		}]
	}), /* @__PURE__ */ (0, N.jsx)("p", {
		className: "iu-muted",
		children: "IPNS names published with a removed key can no longer be updated."
	})] });
}
var ld = .9;
function ud({ label: e, value: t, max: n, text: r }) {
	let i = n > 0 ? Math.min(Math.max(t / n, 0), 1) : 0, a = Math.round(i * 1e3) / 10;
	return /* @__PURE__ */ (0, N.jsxs)("div", {
		className: "iu-meter",
		children: [/* @__PURE__ */ (0, N.jsx)("div", {
			role: "meter",
			"aria-label": e,
			"aria-valuemin": 0,
			"aria-valuemax": n,
			"aria-valuenow": Math.min(t, n),
			"aria-valuetext": `${r}, ${Al(Math.round(a))} percent`,
			className: "iu-meter__track",
			children: /* @__PURE__ */ (0, N.jsx)("svg", {
				viewBox: "0 0 100 8",
				preserveAspectRatio: "none",
				"aria-hidden": "true",
				focusable: "false",
				children: /* @__PURE__ */ (0, N.jsx)("rect", {
					className: i >= ld ? "iu-meter__fill iu-meter__fill--warn" : "iu-meter__fill",
					x: "0",
					y: "0",
					width: a,
					height: "8"
				})
			})
		}), /* @__PURE__ */ (0, N.jsxs)("span", {
			className: "iu-meter__text iu-num",
			children: [r, i >= ld ? " (nearly full)" : ""]
		})]
	});
}
function dd(e) {
	let t = wl[e.tool], n;
	switch (e.tool) {
		case "ipfs_node_info":
			n = /* @__PURE__ */ (0, N.jsx)(I, { o: e.output });
			break;
		case "ipfs_node_status":
			n = /* @__PURE__ */ (0, N.jsx)(fd, { o: e.output });
			break;
		case "routing_findprovs":
			n = /* @__PURE__ */ (0, N.jsx)(md, { o: e.output });
			break;
		case "routing_findpeer":
			n = /* @__PURE__ */ (0, N.jsx)(hd, { o: e.output });
			break;
		case "routing_provide":
			n = /* @__PURE__ */ (0, N.jsx)(_d, { o: e.output });
			break;
		case "swarm_peers":
			n = /* @__PURE__ */ (0, N.jsx)(pd, {
				o: e.output,
				onLoadMore: e.onLoadMore
			});
			break;
		case "stats_bw":
			n = /* @__PURE__ */ (0, N.jsx)(vd, { o: e.output });
			break;
		case "repo_stat":
			n = /* @__PURE__ */ (0, N.jsx)(yd, { o: e.output });
			break;
		case "repo_gc":
			n = /* @__PURE__ */ (0, N.jsx)(bd, { o: e.output });
			break;
		case "ipfs_index_status":
			n = /* @__PURE__ */ (0, N.jsx)(Sd, { o: e.output });
			break;
		case "ipfs_index_reconcile": n = /* @__PURE__ */ (0, N.jsx)(Cd, { o: e.output });
	}
	return /* @__PURE__ */ (0, N.jsx)(Sl, { children: /* @__PURE__ */ (0, N.jsx)(au, {
		title: t.title,
		tool: e.tool,
		children: n
	}) });
}
function I({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
		/* @__PURE__ */ (0, N.jsx)(ou, { items: [
			{
				label: "Peer ID",
				value: /* @__PURE__ */ (0, N.jsx)(nu, {
					value: e.peer_id,
					kind: "peer ID"
				})
			},
			{
				label: "Version",
				value: /* @__PURE__ */ (0, N.jsx)("code", { children: e.version })
			},
			...e.agent_version ? [{
				label: "Agent",
				value: /* @__PURE__ */ (0, N.jsx)("code", {
					className: "iu-wrap",
					children: e.agent_version
				})
			}] : [],
			...e.commit ? [{
				label: "Commit",
				value: /* @__PURE__ */ (0, N.jsx)("code", { children: e.commit })
			}] : [],
			...e.repo_version ? [{
				label: "Repo version",
				value: /* @__PURE__ */ (0, N.jsx)("code", { children: e.repo_version })
			}] : []
		] }),
		/* @__PURE__ */ (0, N.jsx)("h4", {
			className: "iu-subtitle",
			children: "Addresses"
		}),
		e.addresses.length === 0 ? /* @__PURE__ */ (0, N.jsx)(cu, { children: "The node reports no addresses." }) : /* @__PURE__ */ (0, N.jsx)("ul", {
			className: "iu-list",
			children: e.addresses.map((e) => /* @__PURE__ */ (0, N.jsx)("li", { children: /* @__PURE__ */ (0, N.jsx)(nu, {
				value: e,
				kind: "address"
			}) }, e))
		})
	] });
}
var L = {
	missing_rpc_command: "The daemon lacks an RPC command this tool needs.",
	daemon_too_old: "The daemon is older than this tool requires.",
	group_disabled: "The tool group is not enabled.",
	destructive_disabled: "Destructive tools are off by default. Name the destructive selector to offer it; every call still asks first.",
	read_only: "This server runs read-only.",
	not_configured: "It needs configuration that is not set.",
	principal_not_granted: "Your principal is not granted this tool."
};
function fd({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
		/* @__PURE__ */ (0, N.jsxs)("div", {
			className: "iu-badges",
			children: [
				/* @__PURE__ */ (0, N.jsx)(F, {
					tone: e.daemon_reachable ? "ok" : "err",
					icon: e.daemon_reachable ? /* @__PURE__ */ (0, N.jsx)(Xl, {}) : /* @__PURE__ */ (0, N.jsx)(Yl, {}),
					children: e.daemon_reachable ? "Daemon reachable" : "Daemon unreachable"
				}),
				/* @__PURE__ */ (0, N.jsx)(F, {
					tone: e.version_supported ? "ok" : "warn",
					children: e.version_supported ? "Version supported" : "Version not supported"
				}),
				/* @__PURE__ */ (0, N.jsx)(F, {
					tone: e.read_only ? "info" : "neutral",
					children: e.read_only ? "Read-only" : "Writes enabled"
				}),
				/* @__PURE__ */ (0, N.jsxs)(F, { children: ["Transport ", e.transport] })
			]
		}),
		/* @__PURE__ */ (0, N.jsx)(ou, { items: [
			...e.daemon_version ? [{
				label: "Daemon version",
				value: /* @__PURE__ */ (0, N.jsx)("code", { children: e.daemon_version })
			}] : [],
			...e.min_kubo_version ? [{
				label: "Minimum daemon",
				value: /* @__PURE__ */ (0, N.jsx)("code", { children: e.min_kubo_version })
			}] : [],
			{
				label: "Contract version",
				value: /* @__PURE__ */ (0, N.jsx)("code", { children: e.contract_version })
			},
			{
				label: "Enabled groups",
				value: e.enabled_groups.length === 0 ? "None" : /* @__PURE__ */ (0, N.jsx)("ul", {
					className: "iu-badges",
					"aria-label": "Enabled tool groups",
					children: e.enabled_groups.map((e) => /* @__PURE__ */ (0, N.jsx)("li", { children: /* @__PURE__ */ (0, N.jsx)(F, { children: e }) }, e))
				})
			}
		] }),
		e.unavailable_tools.length > 0 ? /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsxs)("h4", {
			className: "iu-subtitle",
			children: [Il(e.unavailable_tools.length, "tool"), " unavailable"]
		}), /* @__PURE__ */ (0, N.jsx)(su, {
			caption: "Unavailable tools",
			rows: e.unavailable_tools,
			rowKey: (e) => e.name,
			columns: [
				{
					key: "name",
					header: "Tool",
					cell: (e) => /* @__PURE__ */ (0, N.jsx)("code", { children: e.name })
				},
				{
					key: "reason",
					header: "Why",
					cell: (e) => L[e.reason] ?? e.reason
				},
				{
					key: "rpc",
					header: "Missing RPC",
					cell: (e) => e.missing_rpc?.length ? /* @__PURE__ */ (0, N.jsx)("code", {
						className: "iu-wrap",
						children: e.missing_rpc.join(", ")
					}) : "-"
				}
			]
		})] }) : null
	] });
}
function pd({ o: e, onLoadMore: t }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
		/* @__PURE__ */ (0, N.jsxs)("p", {
			className: "iu-muted",
			children: [
				Il(e.peers.length, "peer"),
				" connected",
				e.page.has_more ? " on this page; more exist" : "",
				"."
			]
		}),
		/* @__PURE__ */ (0, N.jsx)(su, {
			caption: "Connected peers",
			rows: e.peers,
			rowKey: (e, t) => `${e.id}:${t}`,
			empty: /* @__PURE__ */ (0, N.jsx)(cu, { children: "No peers are connected. The node cannot fetch content it does not hold." }),
			columns: [
				{
					key: "id",
					header: "Peer ID",
					cell: (e) => /* @__PURE__ */ (0, N.jsx)(nu, {
						value: e.id,
						kind: "peer ID",
						compact: !0
					})
				},
				{
					key: "addr",
					header: "Address",
					cell: (e) => /* @__PURE__ */ (0, N.jsx)("code", {
						className: "iu-wrap",
						children: P(e.addr)
					})
				},
				{
					key: "dir",
					header: "Direction",
					cell: (e) => e.direction ?? "-"
				},
				{
					key: "lat",
					header: "Latency",
					numeric: !0,
					cell: (e) => e.latency ?? "-"
				}
			]
		}),
		/* @__PURE__ */ (0, N.jsx)(fu, {
			hasMore: e.page.has_more,
			nextCursor: e.page.next_cursor,
			onLoadMore: t,
			noun: "peers"
		})
	] });
}
function md({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsxs)("p", {
		className: "iu-muted",
		children: [
			Il(e.providers.length, "provider"),
			" found for ",
			/* @__PURE__ */ (0, N.jsx)(ru, {
				value: e.cid,
				compact: !0
			}),
			"."
		]
	}), /* @__PURE__ */ (0, N.jsx)(su, {
		caption: "Providers",
		rows: e.providers,
		rowKey: (e, t) => `${e.id}:${t}`,
		empty: /* @__PURE__ */ (0, N.jsx)(cu, { children: "No provider was found for this CID. It may be held by no reachable peer." }),
		columns: [{
			key: "id",
			header: "Peer ID",
			cell: (e) => /* @__PURE__ */ (0, N.jsx)(nu, {
				value: e.id,
				kind: "peer ID",
				compact: !0
			})
		}, {
			key: "addrs",
			header: "Addresses",
			cell: (e) => /* @__PURE__ */ (0, N.jsx)(gd, { addrs: e.addrs })
		}]
	})] });
}
function hd({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
		/* @__PURE__ */ (0, N.jsx)(ou, { items: [{
			label: "Peer ID",
			value: /* @__PURE__ */ (0, N.jsx)(nu, {
				value: e.id,
				kind: "peer ID"
			})
		}] }),
		/* @__PURE__ */ (0, N.jsx)("h4", {
			className: "iu-subtitle",
			children: "Addresses"
		}),
		e.addrs.length === 0 ? /* @__PURE__ */ (0, N.jsx)(cu, { children: "The peer was found but advertises no addresses." }) : /* @__PURE__ */ (0, N.jsx)(gd, { addrs: e.addrs })
	] });
}
function gd({ addrs: e }) {
	return e.length === 0 ? /* @__PURE__ */ (0, N.jsx)("span", {
		className: "iu-muted",
		children: "None advertised"
	}) : /* @__PURE__ */ (0, N.jsx)("ul", {
		className: "iu-list",
		children: e.map((e) => /* @__PURE__ */ (0, N.jsx)("li", { children: /* @__PURE__ */ (0, N.jsx)("code", {
			className: "iu-wrap",
			children: P(e)
		}) }, e))
	});
}
function _d({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
		/* @__PURE__ */ (0, N.jsx)("div", {
			className: "iu-badges",
			children: /* @__PURE__ */ (0, N.jsx)(F, {
				tone: e.announced ? "ok" : "warn",
				icon: e.announced ? /* @__PURE__ */ (0, N.jsx)(Xl, {}) : /* @__PURE__ */ (0, N.jsx)(Yl, {}),
				children: e.announced ? "Announced" : "Not announced"
			})
		}),
		/* @__PURE__ */ (0, N.jsx)(ou, { items: [{
			label: "CID",
			value: /* @__PURE__ */ (0, N.jsx)(ru, { value: e.cid })
		}] }),
		e.providing_disabled ? /* @__PURE__ */ (0, N.jsx)(lu, {
			tone: "warn",
			label: "Providing is off",
			children: "This node has providing switched off, so it does not announce content to the network."
		}) : null
	] });
}
function vd({ o: e }) {
	return /* @__PURE__ */ (0, N.jsx)(ou, { items: [
		{
			label: "Received in total",
			value: /* @__PURE__ */ (0, N.jsx)(iu, {
				value: e.total_in,
				exact: !0
			})
		},
		{
			label: "Sent in total",
			value: /* @__PURE__ */ (0, N.jsx)(iu, {
				value: e.total_out,
				exact: !0
			})
		},
		{
			label: "Receiving now",
			value: /* @__PURE__ */ (0, N.jsx)("span", {
				className: "iu-num",
				children: Nl(e.rate_in)
			})
		},
		{
			label: "Sending now",
			value: /* @__PURE__ */ (0, N.jsx)("span", {
				className: "iu-num",
				children: Nl(e.rate_out)
			})
		}
	] });
}
function yd({ o: e }) {
	let t = e.storage_max > 0;
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [t ? /* @__PURE__ */ (0, N.jsx)(ud, {
		label: "Repo usage",
		value: e.repo_size,
		max: e.storage_max,
		text: `${jl(e.repo_size)} of ${jl(e.storage_max)}`
	}) : null, /* @__PURE__ */ (0, N.jsx)(ou, { items: [
		{
			label: "Repo size",
			value: /* @__PURE__ */ (0, N.jsx)(iu, {
				value: e.repo_size,
				exact: !0
			})
		},
		{
			label: "Storage limit",
			value: t ? /* @__PURE__ */ (0, N.jsx)(iu, {
				value: e.storage_max,
				exact: !0
			}) : "No limit set"
		},
		{
			label: "Objects",
			value: /* @__PURE__ */ (0, N.jsx)("span", {
				className: "iu-num",
				children: Al(e.num_objects)
			})
		},
		...e.version ? [{
			label: "Repo version",
			value: /* @__PURE__ */ (0, N.jsx)("code", { children: e.version })
		}] : []
	] })] });
}
function bd({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
		/* @__PURE__ */ (0, N.jsxs)("p", { children: [
			/* @__PURE__ */ (0, N.jsx)(F, {
				tone: e.errors?.length ? "warn" : "ok",
				children: "Garbage collection ran"
			}),
			" It removed",
			" ",
			Il(e.removed_count, "block"),
			"."
		] }),
		e.removed_sample?.length ? /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsx)("h4", {
			className: "iu-subtitle",
			children: "Sample of removed blocks"
		}), /* @__PURE__ */ (0, N.jsx)("ul", {
			className: "iu-list",
			children: e.removed_sample.map((e) => /* @__PURE__ */ (0, N.jsx)("li", { children: /* @__PURE__ */ (0, N.jsx)(ru, {
				value: e,
				compact: !0
			}) }, e))
		})] }) : null,
		e.errors?.map((e) => /* @__PURE__ */ (0, N.jsx)(lu, {
			tone: "err",
			label: "Error",
			children: P(e)
		}, e)),
		/* @__PURE__ */ (0, N.jsx)(uu, { items: e.warnings })
	] });
}
var xd = {
	disabled: "Index disabled",
	embedded: "Embedded index",
	remote: "Remote index"
};
function Sd({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsxs)("div", {
		className: "iu-badges",
		children: [
			/* @__PURE__ */ (0, N.jsx)(F, {
				tone: e.enabled ? "ok" : "neutral",
				children: e.enabled ? "Indexing on" : "Indexing off"
			}),
			/* @__PURE__ */ (0, N.jsx)(F, { children: xd[e.mode] ?? e.mode }),
			e.store_reachable === void 0 ? null : /* @__PURE__ */ (0, N.jsx)(F, {
				tone: e.store_reachable ? "ok" : "err",
				children: e.store_reachable ? "Store reachable" : "Store unreachable"
			}),
			/* @__PURE__ */ (0, N.jsx)(F, { children: e.auto ? "Automatic" : "On request" })
		]
	}), /* @__PURE__ */ (0, N.jsx)(ou, { items: [
		...e.model ? [{
			label: "Model",
			value: /* @__PURE__ */ (0, N.jsx)("code", { children: e.model })
		}] : [],
		...e.dimensions === void 0 ? [] : [{
			label: "Dimensions",
			value: /* @__PURE__ */ (0, N.jsx)("span", {
				className: "iu-num",
				children: Al(e.dimensions)
			})
		}],
		...e.indexed_cids === void 0 ? [] : [{
			label: "Indexed CIDs",
			value: /* @__PURE__ */ (0, N.jsx)("span", {
				className: "iu-num",
				children: Al(e.indexed_cids)
			})
		}],
		...e.chunk_count === void 0 ? [] : [{
			label: "Chunks",
			value: /* @__PURE__ */ (0, N.jsx)("span", {
				className: "iu-num",
				children: Al(e.chunk_count)
			})
		}],
		...e.cid_indexed === void 0 ? [] : [{
			label: "Asked CID",
			value: /* @__PURE__ */ (0, N.jsx)(F, {
				tone: e.cid_indexed ? "ok" : "neutral",
				children: e.cid_indexed ? "Indexed" : "Not indexed"
			})
		}]
	] })] });
}
function Cd({ o: e }) {
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
		/* @__PURE__ */ (0, N.jsxs)("p", { children: [
			e.dry_run ? /* @__PURE__ */ (0, N.jsx)(F, {
				tone: "info",
				children: "Dry run"
			}) : /* @__PURE__ */ (0, N.jsx)(F, {
				tone: "warn",
				children: "Applied"
			}),
			" Checked ",
			Il(e.checked, "CID"),
			":",
			" ",
			Al(e.kept),
			" kept, ",
			Al(e.deleted.length),
			" ",
			e.dry_run ? "would be deleted" : "deleted",
			"."
		] }),
		e.deleted.length > 0 ? /* @__PURE__ */ (0, N.jsx)("ul", {
			className: "iu-list",
			children: e.deleted.map((e) => /* @__PURE__ */ (0, N.jsx)("li", { children: /* @__PURE__ */ (0, N.jsx)(ru, {
				value: e,
				compact: !0
			}) }, e))
		}) : null,
		e.page.has_more ? /* @__PURE__ */ (0, N.jsx)("p", {
			className: "iu-muted",
			children: "More entries remain to check. Run it again to continue."
		}) : null,
		/* @__PURE__ */ (0, N.jsx)(uu, { items: e.warnings })
	] });
}
var wd = Zs(["write", "destructive"]), Td = A({
	kind: Zs([
		"cid",
		"content_path",
		"mfs_path",
		"key",
		"ipns_name",
		"peer",
		"repo",
		"index",
		"content"
	]),
	value: O().max(4096)
}), Ed = Zs([
	"elicitation",
	"agui-interrupt",
	"desktop",
	"macos-localauth",
	"linux-polkit",
	"cli"
]), Dd = O().regex(/* @__PURE__ */ RegExp("^cf_[A-Za-z0-9_-]{16,64}$")), Od = A({
	tool: O(),
	class: wd,
	text: O().min(5).max(500),
	targets: k(Td)
}), kd = A({
	confirmation_id: Dd,
	state: Zs([
		"pending",
		"denied",
		"expired"
	]),
	summary: Od,
	expires_at: Sc({ offset: !0 }),
	resolvers: k(Ed).min(1).refine((e) => new Set(e).size === e.length, { message: "items must be unique" }),
	confirm_token: O().regex(/* @__PURE__ */ RegExp("^[A-Za-z0-9_-]{32,1000}$")).optional(),
	requires_native_prompt: Ps().optional(),
	principal_kind: Zs([
		"human-mcp",
		"ui",
		"a2a",
		"uar"
	]).optional()
}).refine((e) => !("principal_kind" in e && ["a2a", "uar"].includes(e.principal_kind)) || e.confirm_token === void 0, {
	message: "confirm_token must be absent when principal_kind is a2a or uar",
	path: ["confirm_token"]
}).refine((e) => e.requires_native_prompt !== !0 || e.summary.class === "destructive" && !e.resolvers.includes("agui-interrupt"), {
	message: "requires_native_prompt requires summary.class destructive and no agui-interrupt resolver",
	path: ["requires_native_prompt"]
});
A({
	confirmation_id: Dd,
	state: Zs([
		"pending",
		"approved",
		"denied",
		"expired",
		"executed"
	]),
	principal: O(),
	principal_kind: Zs([
		"human-mcp",
		"ui",
		"a2a",
		"uar"
	]).optional(),
	summary: Od,
	resolver: Ed.optional(),
	requires_native_prompt: Ps().optional(),
	created_at: Sc({ offset: !0 }),
	expires_at: Sc({ offset: !0 }),
	resolved_at: Sc({ offset: !0 }).optional()
}), A({
	confirmation_id: Dd,
	status: Zs([
		"declined",
		"denied",
		"expired",
		"invalid"
	])
});
var Ad = Zs([
	"pending",
	"waiting_system_prompt",
	"approved",
	"denied",
	"expired"
]);
A({
	confirmationId: O().min(1),
	tool: O().min(1),
	class: wd,
	summary: O().min(1),
	targets: k(Td),
	expiresAt: Sc({ offset: !0 }).optional(),
	resolvers: k(Ed),
	phase: Ad
});
var jd = {
	ipfs_add: "Approve add",
	pin_add: "Approve pin",
	pin_update: "Approve pin move",
	pin_rm: "Approve pin removal",
	mfs_write: "Approve file write",
	mfs_mkdir: "Approve new folder",
	mfs_cp: "Approve copy",
	mfs_mv: "Approve move",
	mfs_rm: "Approve MFS removal",
	ipns_publish: "Approve IPNS publish",
	key_gen: "Approve new key",
	key_rename: "Approve key rename",
	key_rm: "Approve key removal",
	dag_put: "Approve DAG store",
	car_import: "Approve CAR import",
	routing_provide: "Approve announce",
	repo_gc: "Approve garbage collection",
	ipfs_index_cid: "Approve indexing",
	ipfs_index_reconcile: "Approve index cleanup"
};
function Md(e, t) {
	return jd[e] ?? (t === "destructive" ? "Approve removal" : "Approve change");
}
var Nd = {
	elicitation: "your agent host's confirmation prompt",
	"agui-interrupt": "the chat",
	desktop: "the IPFS Desktop confirmation window",
	"macos-localauth": "the macOS system prompt",
	"linux-polkit": "the system authentication prompt",
	cli: "the terminal where ipfs mcp runs"
};
function Pd(e) {
	let t = e.map((e) => Nd[e]);
	return t.length === 0 ? "a prompt outside this panel" : t.length === 1 ? t[0] : `${t.slice(0, -1).join(", ")} or ${t[t.length - 1]}`;
}
var Fd = {
	pending: {
		word: "Awaiting a person",
		tone: "warn"
	},
	waiting_system_prompt: {
		word: "Waiting for system prompt",
		tone: "warn"
	},
	approved: {
		word: "Approved",
		tone: "ok"
	},
	denied: {
		word: "Denied",
		tone: "err"
	},
	expired: {
		word: "Expired",
		tone: "err"
	}
};
function Id(e, t) {
	switch (e.phase) {
		case "pending": return t ? "Nothing has run. Approve to run this call once, or deny to cancel it." : `Nothing has run. Approval happens in ${Pd(e.resolvers)}. This panel cannot approve.`;
		case "waiting_system_prompt": return "Nothing has run. Approval happens in the system prompt on this machine, not in this panel. Answering here does not approve.";
		case "approved": return "The call runs once.";
		case "denied": return "Nothing was changed. Deny is final.";
		case "expired": return "Expiry is denial. Nothing was changed.";
	}
}
var Ld = {
	pending: /* @__PURE__ */ (0, N.jsx)(Jl, {}),
	waiting_system_prompt: /* @__PURE__ */ (0, N.jsx)(Jl, {}),
	approved: /* @__PURE__ */ (0, N.jsx)(Xl, {}),
	denied: /* @__PURE__ */ (0, N.jsx)(Zl, {}),
	expired: /* @__PURE__ */ (0, N.jsx)(Yl, {})
};
function Rd({ model: e, onApprove: t, onDeny: n, focusSafeAction: r = !1, headingLevel: i = 3, variant: a }) {
	let o = (0, M.useId)(), s = (0, M.useId)(), c = `h${i}`, l = Fd[e.phase], u = e.phase === "pending" && t !== void 0, d = (e.phase === "pending" || e.phase === "waiting_system_prompt") && n !== void 0, f = e.class === "destructive", p = Id(e, u), m = a === "alertdialog" && (u || d) ? "alertdialog" : "group";
	return /* @__PURE__ */ (0, N.jsxs)("section", {
		className: `iu-approval iu-approval--${e.phase}`,
		role: m,
		"aria-labelledby": o,
		"aria-describedby": s,
		"data-phase": e.phase,
		children: [
			/* @__PURE__ */ (0, N.jsxs)("div", {
				className: "iu-approval__row",
				children: [/* @__PURE__ */ (0, N.jsx)(F, {
					tone: l.tone,
					icon: Ld[e.phase],
					children: l.word
				}), /* @__PURE__ */ (0, N.jsx)(F, {
					tone: f ? "err" : "neutral",
					children: f ? "Destructive" : "Write"
				})]
			}),
			/* @__PURE__ */ (0, N.jsx)(c, {
				id: o,
				className: "iu-approval__title",
				children: P(e.summary)
			}),
			/* @__PURE__ */ (0, N.jsxs)("p", {
				id: s,
				role: "status",
				className: "iu-approval__status",
				children: [
					/* @__PURE__ */ (0, N.jsxs)("strong", { children: [l.word, "."] }),
					" ",
					p
				]
			}),
			/* @__PURE__ */ (0, N.jsxs)("dl", {
				className: "iu-approval__meta",
				children: [
					/* @__PURE__ */ (0, N.jsxs)("div", { children: [/* @__PURE__ */ (0, N.jsx)("dt", { children: "Tool" }), /* @__PURE__ */ (0, N.jsx)("dd", { children: e.tool })] }),
					e.targets.map((e) => /* @__PURE__ */ (0, N.jsxs)("div", { children: [/* @__PURE__ */ (0, N.jsx)("dt", { children: e.kind.replace(/_/g, " ") }), /* @__PURE__ */ (0, N.jsx)("dd", {
						className: "iu-wrap",
						children: P(e.value)
					})] }, `${e.kind}:${e.value}`)),
					e.expiresAt ? /* @__PURE__ */ (0, N.jsxs)("div", { children: [/* @__PURE__ */ (0, N.jsx)("dt", { children: "Expires" }), /* @__PURE__ */ (0, N.jsx)("dd", { children: Pl(e.expiresAt) })] }) : null,
					/* @__PURE__ */ (0, N.jsxs)("div", { children: [/* @__PURE__ */ (0, N.jsx)("dt", { children: "Confirmation" }), /* @__PURE__ */ (0, N.jsx)("dd", { children: e.confirmationId })] })
				]
			}),
			u || d ? /* @__PURE__ */ (0, N.jsxs)("div", {
				className: "iu-approval__actions",
				role: "group",
				"aria-label": "Decision",
				children: [d ? /* @__PURE__ */ (0, N.jsx)($l, {
					variant: "secondary",
					onClick: n,
					autoFocus: r,
					children: "Deny"
				}) : null, u ? /* @__PURE__ */ (0, N.jsx)($l, {
					variant: "primary",
					onClick: t,
					children: Md(e.tool, e.class)
				}) : null]
			}) : null
		]
	});
}
var zd = A({
	confirmation: kd,
	resolution: Zs(["approved", "denied"]).optional()
});
function Bd(e) {
	let t = e.confirmation, n = t.requires_native_prompt === !0, r = t.state;
	return e.resolution === "denied" ? r = "denied" : n && t.state === "pending" ? r = "waiting_system_prompt" : e.resolution && (r = e.resolution), {
		confirmationId: t.confirmation_id,
		tool: t.summary.tool,
		class: t.summary.class,
		summary: t.summary.text,
		targets: t.summary.targets,
		expiresAt: t.expires_at,
		resolvers: t.resolvers,
		phase: r
	};
}
function Vd({ onApprove: e, onDeny: t, ...n }) {
	let r = Bd(n);
	return /* @__PURE__ */ (0, N.jsx)(Sl, { children: /* @__PURE__ */ (0, N.jsx)(Rd, {
		model: r,
		onApprove: e,
		onDeny: t,
		focusSafeAction: !0,
		variant: "alertdialog"
	}) });
}
var Hd = /* @__PURE__ */ new Set(["confirmation_required", "confirmation_pending"]);
function Ud(e) {
	return !Hd.has(e.error.code);
}
function Wd({ error: e }) {
	let t = e.error;
	return /* @__PURE__ */ (0, N.jsx)(Sl, { children: /* @__PURE__ */ (0, N.jsxs)("div", {
		className: "iu-notice iu-notice--err",
		role: "group",
		"aria-label": "Tool error",
		children: [/* @__PURE__ */ (0, N.jsxs)("p", { children: [
			/* @__PURE__ */ (0, N.jsx)("strong", {
				className: "iu-notice__label",
				children: "Failed."
			}),
			" ",
			P(t.message)
		] }), /* @__PURE__ */ (0, N.jsxs)("p", {
			className: "iu-tool",
			children: [
				/* @__PURE__ */ (0, N.jsx)(F, {
					tone: "err",
					children: t.code
				}),
				t.tool ? /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [" ", t.tool] }) : null,
				" ",
				t.retryable ? "The same call may succeed later." : "Retrying the same call will not help."
			]
		})]
	}) });
}
var Gd = O().min(2).max(512).regex(/* @__PURE__ */ RegExp("^[A-Za-z0-9_-]+$")), Kd = O().min(2).max(4096).regex(/* @__PURE__ */ RegExp("^(?:/(?:ipfs|ipns|ipld)/(?:[^/.][^/]*|\\.[^/.][^/]*|\\.\\.[^/]+)(?:/(?:[^/.][^/]*|\\.[^/.][^/]*|\\.\\.[^/]+)?)*|[A-Za-z0-9_-]+(?:/(?:[^/.][^/]*|\\.[^/.][^/]*|\\.\\.[^/]+)?)*)$")), qd = O().min(1).max(4096).regex(/* @__PURE__ */ RegExp("^/(?:(?:[^/.i][^/]*|i(?:[^/p][^/]*)?|ip(?:[^/fnl][^/]*)?|ipf(?:[^/s][^/]*)?|ipn(?:[^/s][^/]*)?|ipl(?:[^/d][^/]*)?|ip(?:fs|ns|ld)[^/]+|\\.[^/.][^/]*|\\.\\.[^/]+)(?:/(?:[^/.][^/]*|\\.[^/.][^/]*|\\.\\.[^/]+)?)*|ip(?:fs|ns|ld))?$")), Jd = O().min(1).max(4096).regex(/* @__PURE__ */ RegExp("^/(?:(?:[^/.i][^/]*|i(?:[^/p][^/]*)?|ip(?:[^/fnl][^/]*)?|ipf(?:[^/s][^/]*)?|ipn(?:[^/s][^/]*)?|ipl(?:[^/d][^/]*)?|ip(?:fs|ns|ld)[^/]+|\\.[^/.][^/]*|\\.\\.[^/]+)(?:/(?:[^/.][^/]*|\\.[^/.][^/]*|\\.\\.[^/]+)?)*|ip(?:fs|ns|ld)|ipfs/[A-Za-z0-9_-]+(?:/(?:[^/.][^/]*|\\.[^/.][^/]*|\\.\\.[^/]+)?)*)?$")), Yd = O().regex(/* @__PURE__ */ RegExp("^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$")), Xd = O().min(20).max(128).regex(/* @__PURE__ */ RegExp("^(12D3KooW[1-9A-HJ-NP-Za-km-z]{44}|Qm[1-9A-HJ-NP-Za-km-z]{44}|[bk][a-z2-7]{20,})$")), Zd = Ps(), Qd = O().min(2).max(1024).regex(/* @__PURE__ */ RegExp("^/")), $d = O().min(1).max(512).regex(/* @__PURE__ */ RegExp("^(?:/ipns/)?[A-Za-z0-9_-][A-Za-z0-9._-]*(?:/(?:[^/.][^/]*|\\.[^/.][^/]*|\\.\\.[^/]+)?)*$"));
O().regex(/* @__PURE__ */ RegExp("^([0-9]+(\\.[0-9]+)?(ns|us|ms|s|m|h))+$"));
var ef = Zs(["utf8", "base64"]), tf = O().min(1).max(1024);
As().int().min(1).max(1e3);
var nf = A({
	has_more: Ps(),
	next_cursor: tf.optional()
}), rf = A({
	uri: O().regex(/* @__PURE__ */ RegExp("^(ipfs|ipns)://[^\\s]+$")),
	mime_type: O().max(255).optional(),
	size: As().int().min(0).optional()
}), af = As().int().min(0), of = k(O());
O().regex(/* @__PURE__ */ RegExp("^[A-Za-z0-9_-]{32,1000}$"));
var sf = A({ error: A({
	code: Zs([
		"invalid_argument",
		"not_found",
		"already_exists",
		"unauthenticated",
		"permission_denied",
		"egress_not_acknowledged",
		"confirmation_required",
		"confirmation_pending",
		"confirmation_declined",
		"confirmation_expired",
		"confirmation_invalid",
		"confirmation_unavailable",
		"tool_unavailable",
		"daemon_unreachable",
		"daemon_version_unsupported",
		"size_limit_exceeded",
		"session_busy",
		"failed_precondition",
		"resource_exhausted",
		"timeout",
		"cancelled",
		"index_unavailable",
		"rpc_error",
		"internal"
	]),
	message: O().min(1).max(2e3),
	retryable: Ps(),
	tool: O().optional(),
	details: Ys(O(), Is()).optional(),
	confirmation: kd.optional()
}) }), cf = A({
	peer_id: Xd,
	agent_version: O().optional(),
	version: O(),
	commit: O().optional(),
	repo_version: O().optional(),
	addresses: k(Qd)
}), lf = A({
	daemon_reachable: Ps(),
	daemon_version: O().optional(),
	min_kubo_version: O().optional(),
	version_supported: Ps(),
	contract_version: O(),
	transport: Zs(["stdio", "http"]),
	read_only: Ps(),
	enabled_groups: k(O()),
	unavailable_tools: k(A({
		name: O(),
		reason: Zs([
			"missing_rpc_command",
			"daemon_too_old",
			"group_disabled",
			"destructive_disabled",
			"read_only",
			"not_configured",
			"principal_not_granted"
		]),
		missing_rpc: k(O()).optional()
	}))
}), uf = A({
	cid: Gd,
	size: af,
	name: O().optional(),
	pinned: Ps(),
	provided: Ps(),
	resource: rf.optional(),
	warnings: k(O()).optional()
}), df = A({
	path: Kd,
	offset: af,
	length: af,
	size: af.optional(),
	truncated: Ps(),
	encoding: ef,
	content: O()
}), ff = A({
	path: Kd,
	cid: Gd,
	type: Zs([
		"file",
		"directory",
		"symlink",
		"unknown"
	]),
	size: af.optional(),
	resource: rf,
	encoding: ef.optional(),
	content: O().optional(),
	truncated: Ps().optional()
}), pf = A({
	path: Kd,
	entries: k(A({
		name: O(),
		cid: Gd,
		type: Zs([
			"file",
			"directory",
			"symlink",
			"unknown"
		]),
		size: af.optional()
	})),
	page: nf
}), mf = A({
	pins: k(A({
		cid: Gd,
		type: Zs([
			"direct",
			"recursive",
			"indirect"
		]),
		name: O().optional()
	})),
	page: nf
}), hf = A({
	pins: k(Gd),
	name: O().optional()
}), gf = A({
	results: k(A({
		cid: Gd,
		ok: Ps(),
		bad_nodes: k(A({
			cid: Gd,
			error: O()
		})).optional()
	})),
	page: nf
}), _f = A({
	from: Gd,
	to: Gd,
	unpinned_old: Ps(),
	warnings: of.optional()
}), vf = A({
	unpinned: k(Gd),
	warnings: of.optional()
}), yf = A({
	path: qd,
	entries: k(A({
		name: O(),
		type: Zs(["file", "directory"]),
		size: af.optional(),
		cid: Gd.optional()
	})),
	page: nf
}), bf = A({
	path: qd,
	cid: Gd,
	type: Zs(["file", "directory"]),
	size: af,
	cumulative_size: af.optional(),
	blocks: As().int().min(0).optional()
}), xf = A({
	path: qd,
	offset: af,
	length: af,
	size: af.optional(),
	truncated: Ps(),
	encoding: ef,
	content: O()
}), Sf = A({
	path: qd,
	cid: Gd,
	bytes_written: af
}), Cf = A({
	path: qd,
	cid: Gd
}), wf = A({
	source: Jd,
	destination: qd,
	cid: Gd
}), Tf = A({
	source: qd,
	destination: qd
}), Ef = A({ removed: qd }), Df = A({
	name: $d,
	value: Kd
}), Of = A({
	name: $d,
	path: Kd
}), kf = A({ keys: k(A({
	name: Yd,
	id: O()
})) }), Af = A({
	name: Yd,
	id: O()
}), jf = A({
	old_name: Yd,
	new_name: Yd,
	id: O()
}), Mf = A({ removed: k(A({
	name: Yd,
	id: O()
})) }), Nf = A({
	path: Kd,
	cid: Gd,
	codec: O().optional(),
	node: Is().optional(),
	resource: rf.optional(),
	truncated: Ps()
}), Pf = A({
	dags: k(A({
		cid: Gd,
		size: af,
		num_blocks: As().int().min(0)
	})),
	total_size: af,
	unique_blocks: As().int().min(0),
	shared_size: af.optional(),
	ratio: As().min(0).optional()
}), Ff = A({
	cid: Gd,
	pinned: Ps()
}), If = A({
	roots: k(A({
		cid: Gd,
		pinned: Ps(),
		pin_error: O().optional()
	})),
	block_count: As().int().min(0).optional()
}), Lf = A({
	root: Gd,
	size: af.optional(),
	car_base64: O().optional(),
	resource: rf.optional(),
	inline: Ps()
}), Rf = A({
	cid: Gd,
	providers: k(A({
		id: Xd,
		addrs: k(Qd),
		untrusted: Zd.optional()
	}))
}), zf = A({
	id: Xd,
	addrs: k(Qd),
	untrusted: Zd.optional()
}), Bf = A({
	cid: Gd,
	announced: Ps(),
	providing_disabled: Ps()
}), Vf = A({
	peers: k(A({
		id: Xd,
		addr: Qd,
		untrusted: Zd.optional(),
		direction: Zs([
			"inbound",
			"outbound",
			"unknown"
		]).optional(),
		latency: O().optional()
	})),
	page: nf
}), Hf = A({
	total_in: af,
	total_out: af,
	rate_in: As().min(0),
	rate_out: As().min(0)
}), Uf = A({
	repo_size: af,
	storage_max: af,
	num_objects: As().int().min(0),
	version: O().optional()
}), Wf = A({
	removed_count: As().int().min(0),
	removed_sample: k(Gd).max(100).optional(),
	errors: k(O()).optional(),
	warnings: of.optional()
}), Gf = A({
	model: O(),
	results: k(A({
		cid: Gd,
		path: O().optional(),
		mime: O().optional(),
		chunk_index: As().int().min(0),
		score: As(),
		text: O()
	}))
}), Kf = A({
	cid: Gd,
	chunks_indexed: As().int().min(0),
	model: O().optional(),
	skipped_reason: Zs([
		"mime_not_allowed",
		"too_large",
		"already_indexed",
		"not_a_file",
		"empty"
	]).optional()
}), qf = A({
	enabled: Ps(),
	mode: Zs([
		"disabled",
		"embedded",
		"remote"
	]),
	store_reachable: Ps().optional(),
	auto: Ps(),
	model: O().optional(),
	dimensions: As().int().min(1).optional(),
	indexed_cids: As().int().min(0).optional(),
	chunk_count: As().int().min(0).optional(),
	cid_indexed: Ps().optional()
}), Jf = A({
	checked: As().int().min(0),
	deleted: k(Gd),
	kept: As().int().min(0),
	dry_run: Ps(),
	page: nf,
	warnings: of.optional()
}), Yf = Gs("tool", [
	A({
		tool: j("ipfs_add"),
		output: uf
	}),
	A({
		tool: j("ipfs_cat"),
		output: df
	}),
	A({
		tool: j("ipfs_get"),
		output: ff
	}),
	A({
		tool: j("ipfs_ls"),
		output: pf
	}),
	A({
		tool: j("mfs_read"),
		output: xf
	}),
	A({
		tool: j("ipfs_index_search"),
		output: Gf
	}),
	A({
		tool: j("ipfs_index_cid"),
		output: Kf
	})
]), Xf = Gs("tool", [
	A({
		tool: j("pin_ls"),
		output: mf
	}),
	A({
		tool: j("pin_add"),
		output: hf
	}),
	A({
		tool: j("pin_verify"),
		output: gf
	}),
	A({
		tool: j("pin_update"),
		output: _f
	}),
	A({
		tool: j("pin_rm"),
		output: vf
	})
]), Zf = Gs("tool", [
	A({
		tool: j("mfs_ls"),
		output: yf
	}),
	A({
		tool: j("mfs_stat"),
		output: bf
	}),
	A({
		tool: j("mfs_write"),
		output: Sf
	}),
	A({
		tool: j("mfs_mkdir"),
		output: Cf
	}),
	A({
		tool: j("mfs_cp"),
		output: wf
	}),
	A({
		tool: j("mfs_mv"),
		output: Tf
	}),
	A({
		tool: j("mfs_rm"),
		output: Ef
	})
]), Qf = Gs("tool", [
	A({
		tool: j("dag_get"),
		output: Nf
	}),
	A({
		tool: j("dag_stat"),
		output: Pf
	}),
	A({
		tool: j("dag_put"),
		output: Ff
	}),
	A({
		tool: j("car_import"),
		output: If
	}),
	A({
		tool: j("car_export"),
		output: Lf
	})
]), $f = Gs("tool", [
	A({
		tool: j("ipns_publish"),
		output: Df
	}),
	A({
		tool: j("ipns_resolve"),
		output: Of
	}),
	A({
		tool: j("key_list"),
		output: kf
	}),
	A({
		tool: j("key_gen"),
		output: Af
	}),
	A({
		tool: j("key_rename"),
		output: jf
	}),
	A({
		tool: j("key_rm"),
		output: Mf
	})
]), ep = Gs("tool", [
	A({
		tool: j("ipfs_node_info"),
		output: cf
	}),
	A({
		tool: j("ipfs_node_status"),
		output: lf
	}),
	A({
		tool: j("routing_findprovs"),
		output: Rf
	}),
	A({
		tool: j("routing_findpeer"),
		output: zf
	}),
	A({
		tool: j("routing_provide"),
		output: Bf
	}),
	A({
		tool: j("swarm_peers"),
		output: Vf
	}),
	A({
		tool: j("stats_bw"),
		output: Hf
	}),
	A({
		tool: j("repo_stat"),
		output: Uf
	}),
	A({
		tool: j("repo_gc"),
		output: Wf
	}),
	A({
		tool: j("ipfs_index_status"),
		output: qf
	}),
	A({
		tool: j("ipfs_index_reconcile"),
		output: Jf
	})
]), tp = {
	ContentCard: [
		"ipfs_add",
		"ipfs_cat",
		"ipfs_get",
		"ipfs_ls",
		"mfs_read",
		"ipfs_index_search",
		"ipfs_index_cid"
	],
	PinList: [
		"pin_ls",
		"pin_add",
		"pin_verify",
		"pin_update",
		"pin_rm"
	],
	MfsTree: [
		"mfs_ls",
		"mfs_stat",
		"mfs_write",
		"mfs_mkdir",
		"mfs_cp",
		"mfs_mv",
		"mfs_rm"
	],
	DagViewer: [
		"dag_get",
		"dag_stat",
		"dag_put",
		"car_import",
		"car_export"
	],
	IpnsRecordCard: [
		"ipns_publish",
		"ipns_resolve",
		"key_list",
		"key_gen",
		"key_rename",
		"key_rm"
	],
	NodeStatusPanel: [
		"ipfs_node_info",
		"ipfs_node_status",
		"routing_findprovs",
		"routing_findpeer",
		"routing_provide",
		"swarm_peers",
		"stats_bw",
		"repo_stat",
		"repo_gc",
		"ipfs_index_status",
		"ipfs_index_reconcile"
	]
};
function R(e, t, n) {
	return {
		name: e,
		schema: t,
		render: n
	};
}
var np = {
	ContentCard: R("ContentCard", Yf, (e, t) => /* @__PURE__ */ (0, N.jsx)(pu, {
		...e,
		onOpenPath: t.onOpenPath,
		onLoadMore: t.onLoadMore
	})),
	PinList: R("PinList", Xf, (e, t) => /* @__PURE__ */ (0, N.jsx)(Cu, {
		...e,
		onLoadMore: t.onLoadMore,
		onRequestUnpin: t.onRequestUnpin
	})),
	MfsTree: R("MfsTree", Zf, (e, t) => /* @__PURE__ */ (0, N.jsx)(ju, {
		...e,
		onOpenPath: t.onOpenPath,
		onLoadMore: t.onLoadMore
	})),
	DagViewer: R("DagViewer", Qf, (e) => /* @__PURE__ */ (0, N.jsx)(Yu, { ...e })),
	IpnsRecordCard: R("IpnsRecordCard", $f, (e) => /* @__PURE__ */ (0, N.jsx)(nd, { ...e })),
	NodeStatusPanel: R("NodeStatusPanel", ep, (e, t) => /* @__PURE__ */ (0, N.jsx)(dd, {
		...e,
		onLoadMore: t.onLoadMore
	})),
	ConfirmationDialog: R("ConfirmationDialog", zd, (e, t) => /* @__PURE__ */ (0, N.jsx)(Vd, {
		...e,
		onApprove: t.onApprove,
		onDeny: t.onDeny
	}))
};
function rp(e, t, n = {}) {
	let r = wl[e].component;
	if (!r || !(r in np)) return { kind: "unbound" };
	let i = np[r], a = i.schema.safeParse({
		tool: e,
		output: t
	});
	return a.success ? {
		kind: "view",
		component: r,
		node: i.render(a.data, n)
	} : {
		kind: "invalid",
		component: r,
		issues: a.error.issues.slice(0, 5).map((e) => `${e.path.join(".") || "(root)"}: ${e.message}`)
	};
}
var ip = A({ messages: k(A({
	id: O().min(1),
	role: Zs([
		"developer",
		"system",
		"assistant",
		"user",
		"tool"
	]),
	content: O(),
	streaming: Ps().optional()
})) });
function ap({ message: e, as: t = "div" }) {
	let n = op[e.role];
	return n === void 0 ? null : /* @__PURE__ */ (0, N.jsxs)(t, {
		className: `iu-msg iu-msg--${e.role}`,
		children: [/* @__PURE__ */ (0, N.jsx)("span", {
			className: "iu-msg__who",
			children: n
		}), /* @__PURE__ */ (0, N.jsxs)("p", {
			className: "iu-msg__text",
			children: [P(e.content), e.streaming ? /* @__PURE__ */ (0, N.jsx)("span", {
				className: "iu-msg__more",
				children: " Writing"
			}) : null]
		})]
	});
}
var op = {
	user: "You",
	assistant: "Agent",
	system: "System"
};
function sp({ messages: e, label: t = "Conversation" }) {
	let n = e.filter((e) => op[e.role] !== void 0 && (e.content !== "" || e.streaming === !0)), r = n.some((e) => e.streaming === !0);
	return /* @__PURE__ */ (0, N.jsx)(Sl, { children: /* @__PURE__ */ (0, N.jsx)("div", {
		role: "log",
		"aria-label": t,
		"aria-live": "polite",
		"aria-relevant": "additions text",
		"aria-busy": r,
		children: /* @__PURE__ */ (0, N.jsx)("ol", {
			className: "iu-stream",
			children: n.map((e) => /* @__PURE__ */ (0, N.jsx)(ap, {
				as: "li",
				message: e
			}, e.id))
		})
	}) });
}
var cp = O().min(1).max(128);
Vs({
	id: cp,
	role: Zs([
		"developer",
		"system",
		"assistant",
		"user",
		"tool"
	]),
	content: O().optional(),
	toolCallId: cp.optional(),
	toolCalls: k(Vs({
		id: cp,
		type: j("function"),
		function: Vs({
			name: O(),
			arguments: O()
		})
	})).optional()
});
var lp = Vs({
	id: cp,
	reason: j("tool_call"),
	message: O().min(5),
	toolCallId: cp,
	responseSchema: Ys(O(), Is()).optional(),
	expiresAt: Sc({ offset: !0 }).optional(),
	metadata: Vs({ "ipfs-mcp": A({
		confirmation_id: O().regex(/* @__PURE__ */ RegExp("^cf_[A-Za-z0-9_-]{16,64}$")),
		tool: O(),
		class: Zs(["write", "destructive"]),
		requires_native_prompt: Ps()
	}) })
}), up = [
	"max_steps",
	"max_tokens",
	"wall_clock",
	"backend_error",
	"session_busy",
	"session_full",
	"interrupt_open"
], dp = {
	max_steps: {
		label: "Stopped",
		body: "The agent reached its step limit before it finished. Ask again with a narrower request."
	},
	max_tokens: {
		label: "Stopped",
		body: "The agent reached its token limit before it finished. Ask for something shorter."
	},
	wall_clock: {
		label: "Stopped",
		body: "The agent ran out of time before it finished. Ask again, or ask for less at once."
	},
	backend_error: {
		label: "Failed",
		body: "The model backend failed. Nothing on your node changed because of this error. Try again in a moment."
	},
	session_busy: {
		label: "Busy",
		body: "A reply is still streaming on this thread. Send again when it ends."
	},
	session_full: {
		label: "Full",
		body: "This conversation reached its length limit. Start a new chat to continue."
	},
	interrupt_open: {
		label: "Waiting",
		body: "Answer the open question first. This thread has an approval waiting."
	}
}, fp = {
	label: "Failed",
	body: "The run failed for a reason this panel does not recognize."
}, pp = (e) => typeof e == "string" && up.includes(e);
function mp(e) {
	return e ? dp[e] : fp;
}
var hp = {
	messages: [],
	toolCalls: [],
	interrupts: [],
	a2uiSurfaces: {},
	run: { status: "idle" }
}, gp = (e) => typeof e == "string" ? e : void 0;
function _p(e, t, n, r) {
	let i = e.findIndex((e) => e.id === t);
	return i < 0 ? [...e, r(n())] : e.map((e, t) => t === i ? r(e) : e);
}
var vp = (e) => e === "user" || e === "system" || e === "developer" || e === "tool" ? e : "assistant";
function yp(e, t) {
	switch (t.type) {
		case "RUN_STARTED": {
			let n = gp(t.threadId), r = gp(t.runId);
			return {
				...e,
				run: {
					status: "running",
					...n && { threadId: n },
					...r && { runId: r }
				}
			};
		}
		case "RUN_FINISHED": {
			let n = t.outcome, r = n?.type === "interrupt" ? Sp(n.interrupts) : [], i = [...e.interrupts];
			for (let e of r) i.some((t) => t.interrupt.id === e.id) || i.push({ interrupt: e });
			let a = new Set(r.map((e) => e.toolCallId));
			return {
				...e,
				interrupts: i,
				toolCalls: e.toolCalls.map((e) => a.has(e.id) ? {
					...e,
					status: "interrupted"
				} : e),
				run: {
					...e.run,
					status: r.length > 0 ? "interrupted" : "finished"
				}
			};
		}
		case "RUN_ERROR": {
			let n = pp(t.code) ? t.code : void 0, { errorCode: r, ...i } = e.run;
			return {
				...e,
				run: {
					...i,
					status: "error",
					error: mp(n).body,
					...n && { errorCode: n }
				}
			};
		}
		case "TEXT_MESSAGE_START": {
			let n = gp(t.messageId);
			return n ? {
				...e,
				messages: _p(e.messages, n, () => ({
					id: n,
					role: vp(t.role),
					content: "",
					streaming: !0
				}), (e) => ({
					...e,
					streaming: !0
				}))
			} : e;
		}
		case "TEXT_MESSAGE_CONTENT": {
			let n = gp(t.messageId), r = gp(t.delta) ?? "";
			return n ? {
				...e,
				messages: _p(e.messages, n, () => ({
					id: n,
					role: "assistant",
					content: "",
					streaming: !0
				}), (e) => ({
					...e,
					content: e.content + r
				}))
			} : e;
		}
		case "TEXT_MESSAGE_END": {
			let n = gp(t.messageId);
			return n ? {
				...e,
				messages: e.messages.map((e) => e.id === n ? {
					...e,
					streaming: !1
				} : e)
			} : e;
		}
		case "TOOL_CALL_START": {
			let n = gp(t.toolCallId), r = gp(t.toolCallName);
			if (!n || !r) return e;
			let i = gp(t.parentMessageId);
			return {
				...e,
				toolCalls: _p(e.toolCalls, n, () => ({
					id: n,
					name: r,
					argumentsText: "",
					status: "running"
				}), (e) => ({
					...e,
					name: r,
					...i && { parentMessageId: i }
				}))
			};
		}
		case "TOOL_CALL_ARGS": {
			let n = gp(t.toolCallId), r = gp(t.delta) ?? "";
			return n ? {
				...e,
				toolCalls: e.toolCalls.map((e) => e.id === n ? {
					...e,
					argumentsText: e.argumentsText + r
				} : e)
			} : e;
		}
		case "TOOL_CALL_END": return e;
		case "TOOL_CALL_RESULT": {
			let n = gp(t.toolCallId), r = gp(t.content);
			if (!n || r === void 0) return e;
			let i = gp(t.messageId), a = Dp(r), o = a ? "error" : "done", s = xp(a);
			return {
				...e,
				toolCalls: e.toolCalls.map((e) => e.id === n ? {
					...e,
					resultText: r,
					status: o,
					...i && { resultMessageId: i }
				} : e),
				interrupts: e.interrupts.map((e) => e.interrupt.toolCallId === n && e.resolution === void 0 ? {
					...e,
					resolution: s
				} : e)
			};
		}
		case "MESSAGES_SNAPSHOT": {
			let n = Array.isArray(t.messages) ? t.messages : [];
			return {
				...e,
				messages: Cp(e.messages, n),
				toolCalls: wp(e.toolCalls, n)
			};
		}
		case "CUSTOM": {
			if (gp(t.name) !== "a2ui") return e;
			let n = t.value;
			if (typeof n != "object" || !n || Array.isArray(n)) return e;
			let r = n;
			if (r.version !== "v0.9") return e;
			let i = bp(r);
			if (i === void 0) return e;
			let a = e.a2uiSurfaces[i] ?? [];
			return {
				...e,
				a2uiSurfaces: {
					...e.a2uiSurfaces,
					[i]: [...a, r]
				}
			};
		}
		default: return e;
	}
}
function bp(e) {
	for (let t of [
		"createSurface",
		"updateComponents",
		"updateDataModel",
		"deleteSurface"
	]) {
		let n = e[t];
		if (typeof n == "object" && n && !Array.isArray(n)) {
			let e = gp(n.surfaceId);
			if (e !== void 0 && e !== "") return e;
		}
	}
}
function xp(e) {
	return e?.error.code === "confirmation_declined" ? "denied" : e?.error.code === "confirmation_expired" ? "expired" : "approved";
}
function Sp(e) {
	let t = [];
	for (let n of e ?? []) {
		let e = lp.safeParse(n);
		e.success && t.push(e.data);
	}
	return t;
}
function Cp(e, t) {
	let n = new Map(e.map((e) => [e.id, e]));
	return t.filter((e) => e.role !== "tool").map((e) => {
		let t = n.get(e.id);
		return {
			id: e.id,
			role: e.role,
			content: e.content ?? t?.content ?? "",
			streaming: t?.streaming ?? !1
		};
	});
}
function wp(e, t) {
	let n = [...e];
	for (let e of t) for (let t of e.toolCalls ?? []) n.some((e) => e.id === t.id) || n.push({
		id: t.id,
		name: t.function.name,
		argumentsText: t.function.arguments,
		parentMessageId: e.id,
		status: "running"
	});
	return n;
}
function Tp(e, t) {
	let n = t.resume ?? [], r = e.interrupts.map((e) => {
		let t = n.find((t) => t.interruptId === e.interrupt.id);
		if (!t || t.payload && "wait" in t.payload) return e;
		let r = t.status === "resolved" && t.payload !== void 0 && "approved" in t.payload && t.payload.approved === !0;
		return {
			...e,
			resolution: r ? "approved" : "denied"
		};
	}), i = t.messages ?? [];
	return {
		...e,
		interrupts: r,
		messages: i.length > 0 ? Cp(e.messages, i) : e.messages,
		toolCalls: i.length > 0 ? wp(e.toolCalls, i) : e.toolCalls
	};
}
function Ep(e) {
	try {
		return JSON.parse(e);
	} catch {
		return;
	}
}
function Dp(e) {
	let t = sf.safeParse(Ep(e));
	return t.success ? t.data : null;
}
var Op = A({
	id: O().min(1),
	name: O().min(1),
	arguments: O(),
	result: O().optional(),
	status: Zs([
		"running",
		"interrupted",
		"done",
		"error"
	])
});
function kp(e) {
	return {
		id: e.id,
		name: e.name,
		arguments: e.argumentsText,
		...e.resultText !== void 0 && { result: e.resultText },
		status: e.status
	};
}
var Ap = A({
	tool: Zs(Object.keys(wl)),
	acknowledged_hosts: k(O().min(1).max(253)),
	refused: Ps().optional()
});
function jp({ tool: e, acknowledged_hosts: t, refused: n = !1 }) {
	if (!wl[e].contentEgress) return null;
	let r = t, i, a, o;
	return n ? (i = "err", a = "Content not sent", o = r.length > 0 ? `The destination is not in the acknowledged hosts (${r.join(", ")}), so the node content stayed on this machine.` : "No host is acknowledged, so the node content stayed on this machine.") : r.length > 0 ? (i = "info", a = "Carries node content", o = `May reach ${Il(r.length, "acknowledged host")}: ${r.join(", ")}. No other host receives it.`) : (i = "warn", a = "Carries node content", o = "No host is acknowledged, so a model host or embedder is refused this content."), /* @__PURE__ */ (0, N.jsx)(Sl, { children: /* @__PURE__ */ (0, N.jsxs)("p", {
		className: "iu-egress",
		children: [
			/* @__PURE__ */ (0, N.jsx)(F, {
				tone: i,
				children: a
			}),
			" ",
			/* @__PURE__ */ (0, N.jsx)("span", { children: o })
		]
	}) });
}
function Mp(e, t) {
	if (e === "always") return !0;
	let n = e.split(":"), r = n[0], i = n[1];
	if (r === "copy" && i) return !!t[i];
	if (r === "not-equal" && i) return String(t[i]) !== n[2];
	throw Error(`unsupported chat rule: ${e}`);
}
function Np(e) {
	let t = wl[e];
	return {
		toolCallCard: Mp(El.ToolCallCard, t),
		approvalCard: Mp(El.ApprovalCard, t),
		egressBadge: Mp(El.EgressBadge, t),
		untrustedFrame: Mp(El.untrustedFrame, t)
	};
}
var Pp = Op, Fp = {
	running: {
		word: "Running",
		tone: "info"
	},
	interrupted: {
		word: "Waiting for approval",
		tone: "warn"
	},
	done: {
		word: "Done",
		tone: "ok"
	},
	error: {
		word: "Failed",
		tone: "err"
	}
}, Ip = {
	none: "Read only",
	write: "Write",
	destructive: "Destructive"
}, Lp = {
	none: "neutral",
	write: "neutral",
	destructive: "err"
}, Rp = (e) => e in wl;
function zp({ call: e, acknowledgedHosts: t = [], handlers: n = {} }) {
	let r = Rp(e.name), i = r ? wl[e.name] : void 0, a = Ep(e.arguments), o = e.result === void 0 ? null : Dp(e.result), s = Fp[e.status];
	return /* @__PURE__ */ (0, N.jsx)(Sl, { children: /* @__PURE__ */ (0, N.jsxs)("article", {
		className: "iu-call",
		"aria-label": `Tool call ${e.name}`,
		children: [
			/* @__PURE__ */ (0, N.jsxs)("header", {
				className: "iu-call__head",
				children: [
					/* @__PURE__ */ (0, N.jsx)("h4", {
						className: "iu-call__title",
						children: i?.title ?? P(e.name)
					}),
					/* @__PURE__ */ (0, N.jsx)("code", {
						className: "iu-tool",
						children: P(e.name)
					}),
					/* @__PURE__ */ (0, N.jsx)(F, {
						tone: i ? Lp[i.confirmation] : "neutral",
						children: i ? Ip[i.confirmation] : "Unknown tool"
					}),
					/* @__PURE__ */ (0, N.jsx)(F, {
						tone: s.tone,
						children: s.word
					})
				]
			}),
			/* @__PURE__ */ (0, N.jsxs)("details", {
				className: "iu-call__args",
				children: [/* @__PURE__ */ (0, N.jsx)("summary", { children: "Arguments" }), typeof a == "object" && a ? /* @__PURE__ */ (0, N.jsx)(Uu, {
					value: a,
					label: `Arguments of ${e.name}`
				}) : /* @__PURE__ */ (0, N.jsx)("pre", {
					className: "iu-pre",
					tabIndex: 0,
					"aria-label": "Arguments text",
					children: P(e.arguments || "(none)")
				})]
			}),
			e.status === "interrupted" && e.result === void 0 ? /* @__PURE__ */ (0, N.jsx)("p", {
				className: "iu-muted",
				children: "Nothing has run. This call waits for a person to approve it."
			}) : null,
			e.status === "running" && e.result === void 0 ? /* @__PURE__ */ (0, N.jsx)("p", {
				className: "iu-muted",
				children: "Running on your node."
			}) : null,
			e.result === void 0 ? null : /* @__PURE__ */ (0, N.jsx)(Bp, {
				call: e,
				toolName: r ? e.name : void 0,
				error: o,
				acknowledgedHosts: t,
				handlers: n
			}),
			i && e.status !== "error" && Np(i.name).egressBadge ? /* @__PURE__ */ (0, N.jsx)(jp, {
				tool: i.name,
				acknowledged_hosts: [...t]
			}) : null
		]
	}) });
}
function Bp({ call: e, toolName: t, error: n, acknowledgedHosts: r, handlers: i }) {
	if (n) {
		let e = n.error.confirmation;
		return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
			e ? /* @__PURE__ */ (0, N.jsx)(Vd, {
				confirmation: e,
				onApprove: i.onApprove,
				onDeny: i.onDeny
			}) : null,
			Ud(n) ? /* @__PURE__ */ (0, N.jsx)(Wd, { error: n }) : null,
			n.error.code === "egress_not_acknowledged" && t ? /* @__PURE__ */ (0, N.jsx)(jp, {
				tool: t,
				acknowledged_hosts: [...r],
				refused: !0
			}) : null
		] });
	}
	let a = Ep(e.result ?? "");
	if (a === void 0) return /* @__PURE__ */ (0, N.jsxs)(lu, {
		tone: "warn",
		label: "Unreadable result",
		children: ["The result is not valid JSON, so it is shown as text.", /* @__PURE__ */ (0, N.jsx)("pre", {
			className: "iu-pre",
			tabIndex: 0,
			"aria-label": "Result text",
			children: P(e.result ?? "")
		})]
	});
	if (t) {
		let n = rp(t, a, i);
		if (n.kind === "view") return n.node;
		if (n.kind === "invalid") return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsxs)(lu, {
			tone: "warn",
			label: "Result does not match the contract",
			children: [
				t,
				" returned data its output schema does not describe, so no view is drawn. ",
				n.issues.join("; ")
			]
		}), /* @__PURE__ */ (0, N.jsx)(Uu, {
			value: a,
			label: `Raw result of ${e.name}`
		})] });
	}
	return /* @__PURE__ */ (0, N.jsx)(Uu, {
		value: a,
		label: `Result of ${e.name}`
	});
}
var Vp = A({
	interrupt: lp,
	resolution: Zs([
		"approved",
		"denied",
		"expired"
	]).optional(),
	expired: Ps().optional()
});
function Hp(e) {
	let t = e.interrupt.metadata["ipfs-mcp"], n = t.requires_native_prompt, r;
	return r = e.resolution === "denied" ? "denied" : e.expired || e.resolution === "expired" ? "expired" : e.resolution === "approved" ? "approved" : n ? "waiting_system_prompt" : "pending", {
		confirmationId: t.confirmation_id,
		tool: t.tool,
		class: t.class,
		summary: e.interrupt.message,
		targets: [],
		...e.interrupt.expiresAt && { expiresAt: e.interrupt.expiresAt },
		resolvers: n ? [] : ["agui-interrupt"],
		phase: r
	};
}
function Up(e, t) {
	return e.expiresAt ? Date.parse(e.expiresAt) <= Date.parse(t) : !1;
}
function Wp({ onApprove: e, onDeny: t, focusSafeAction: n, ...r }) {
	let i = Hp(r);
	return /* @__PURE__ */ (0, N.jsx)(Sl, { children: /* @__PURE__ */ (0, N.jsx)(Rd, {
		model: i,
		onApprove: e,
		onDeny: t,
		...n !== void 0 && { focusSafeAction: n },
		variant: "group",
		headingLevel: 4
	}) });
}
//#endregion
//#region ../ui/dist/index.js
var Gp = null;
function Kp(e = document) {
	return Gp || (Gp = qp(e), Gp);
}
async function qp(e) {
	let t = globalThis.FontFace;
	if (!t || !e.fonts) return 0;
	let { BUNDLED_FACES: n } = await import("./fonts-data-D_fXGTRc-DVfbGgFJ.js"), r = 0;
	for (let i of n) try {
		let n = new t(i.family, Jp(i.dataUri), {
			weight: i.weight,
			style: "normal",
			display: "swap"
		});
		e.fonts.add(await n.load()), r++;
	} catch {}
	return r;
}
function Jp(e) {
	let t = e.indexOf(","), n = atob(e.slice(t + 1)), r = new Uint8Array(n.length);
	for (let e = 0; e < n.length; e++) r[e] = n.charCodeAt(e);
	return r.buffer;
}
//#endregion
//#region src/generated/island.css?inline
var Yp = "@layer properties{*,:before,:after,::backdrop{--tw-border-style:solid;--tw-shadow:0 0 #0000;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-alpha:100%;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000}}@layer theme{:host{--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;--color-white:#fff;--spacing:.25rem;--font-weight-semibold:600;--radius-sm:.25rem;--radius-md:.375rem;--radius-lg:.5rem}}@layer base;@layer components{.ac-sidebar{--ac-width:min(416px, 100vw);z-index:1;inline-size:var(--ac-width);max-inline-size:100vw;background:var(--surface);color:var(--text);pointer-events:auto;visibility:hidden;transition:transform var(--iu-duration) var(--iu-ease), visibility 0s linear var(--iu-duration);flex-direction:column;padding-inline-start:var(--space-2);display:flex;position:fixed;inset-block:0;inset-inline-end:0;transform:translate(100%)}.ac-sidebar[data-state=open]{visibility:visible;transition:transform var(--iu-duration) var(--iu-ease), visibility 0s;transform:translate(0)}.ac-sidebar:before{content:\"\";inline-size:var(--space-2);background:var(--raised);position:absolute;inset-block:0;inset-inline-start:0}.ac-field{font-family:var(--font-body);field-sizing:content;resize:none;border:0;min-block-size:44px;max-block-size:152px}.ac-field::placeholder{color:var(--text-muted);opacity:1}@media (prefers-reduced-motion:reduce){.ac-sidebar,.ac-sidebar[data-state=open]{transition:none}}}@layer utilities{.flex{display:flex}.min-h-0{min-height:0}.w-full{width:100%}.max-w-\\[66ch\\]{max-width:66ch}.min-w-0{min-width:0}.flex-1{flex:1}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-center{align-items:center}.items-start{align-items:flex-start}.justify-between{justify-content:space-between}.gap-s2{gap:var(--space-2)}.gap-s3{gap:var(--space-3)}.gap-s4{gap:var(--space-4)}.overflow-y-auto{overflow-y:auto}.rounded-ui-sm{border-radius:var(--radius-sm)}.bg-control{background-color:var(--control)}.bg-raised{background-color:var(--raised)}.px-s3{padding-inline:var(--space-3)}.py-s2{padding-block:var(--space-2)}.py-s3{padding-block:var(--space-3)}.pt-s3{padding-top:var(--space-3)}.pb-s2{padding-bottom:var(--space-2)}.font-ui-heading{font-family:var(--font-heading)}.text-\\[17px\\]{font-size:17px}.text-\\[length\\:var\\(--iu-text-body\\)\\]{font-size:var(--iu-text-body)}.text-\\[length\\:var\\(--iu-text-small\\)\\]{font-size:var(--iu-text-small)}.leading-\\[1\\.3\\]{--tw-leading:1.3;line-height:1.3}.leading-\\[1\\.55\\]{--tw-leading:1.55;line-height:1.55}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.break-words{overflow-wrap:break-word}.text-foreground{color:var(--text)}.text-muted-foreground{color:var(--text-muted)}.disabled\\:opacity-45:disabled{opacity:.45}}[data-ipfs-ui] a.iu-btn{text-decoration:none}[data-ipfs-ui] a.iu-btn--primary{color:var(--on-accent)}[data-ipfs-ui] a.iu-btn--secondary{color:var(--text)}", Xp = class extends Error {
	name = "SseProtocolError";
};
function Zp(e) {
	let t = "", n = !1, r = "", i = [], a = 0, o, s = () => {
		i.length > 0 && e({
			event: r || "message",
			data: i.join("\n"),
			...o !== void 0 && { id: o }
		}), r = "", i = [], a = 0;
	}, c = (e) => {
		if (e === "") return s();
		if (e.startsWith(":")) return;
		let t = e.indexOf(":"), n = t === -1 ? e : e.slice(0, t), c = t === -1 ? "" : e.slice(t + 1);
		if (c.startsWith(" ") && (c = c.slice(1)), n === "data") {
			if (a += c.length + 1, a > 1048576) throw new Xp("An event exceeded the size limit.");
			i.push(c);
		} else n === "event" ? r = c : n === "id" && !c.includes("\0") && (o = c);
	}, l = (e) => {
		let n = 0;
		for (let r = 0; r < t.length; r++) {
			let i = t[r];
			if (i === "\n" || i === "\r") {
				if (i === "\r" && r === t.length - 1 && !e) break;
				c(t.slice(n, r)), i === "\r" && t[r + 1] === "\n" && r++, n = r + 1;
			}
		}
		if (t = t.slice(n), t.length > 1048576) throw new Xp("A line exceeded the size limit.");
	};
	return {
		push(e) {
			n || (n = !0, e.startsWith("﻿") && (e = e.slice(1))), t += e, l(!1);
		},
		end() {
			l(!0), t = "", i = [], r = "";
		}
	};
}
async function* Qp(e, t) {
	let n = e.getReader(), r = new TextDecoder("utf-8"), i = [], a = Zp((e) => i.push(e)), o = () => void n.cancel().catch(() => void 0);
	t?.addEventListener("abort", o, { once: !0 });
	try {
		for (;;) {
			let { done: e, value: t } = await n.read();
			if (e) {
				a.push(r.decode()), a.end();
				break;
			}
			for (a.push(r.decode(t, { stream: !0 })); i.length > 0;) yield i.shift();
		}
		for (; i.length > 0;) yield i.shift();
	} finally {
		t?.removeEventListener("abort", o), n.releaseLock();
	}
}
var $p = (e) => Math.min(300, Math.max(1, Math.ceil(e)));
function em(e, t) {
	let n = e?.trim();
	if (!n) return 5;
	if (/^\d{1,9}$/.test(n)) return $p(Number(n));
	let r = /^[A-Za-z]{3}, /.test(n) ? Date.parse(n) : NaN;
	return Number.isFinite(r) ? $p((r - t) / 1e3) : 5;
}
//#endregion
//#region src/agui/client.ts
var tm = class extends Error {
	kind;
	status;
	retryAfterSeconds;
	name = "AguiError";
	constructor(e, t, n, r) {
		super(t), this.kind = e, this.status = n, this.retryAfterSeconds = r;
	}
}, nm = {
	401: ["unauthorized", "The token was refused. Check the token for the ui principal."],
	403: ["forbidden", "ipfs mcp refused this page or this principal. Check the origin allowlist and the principal groups."],
	404: ["not_found", "ipfs mcp has no chat endpoint here. The chat is off until an LLM backend is configured."]
}, rm = "Your sign-in has ended. Sign in again.", im = "A reply is still streaming. Send again when it ends.", am = "Answer the open question first.", om = "The node is at its session limit. Try again shortly.", sm = "The node has no model backend yet. Choose one in Settings.";
async function cm(e) {
	try {
		let t = JSON.parse(await e.text()), n = typeof t == "object" && t ? t.error : void 0;
		return typeof n == "object" && !!n && n.code === "backend_not_configured";
	} catch {
		return !1;
	}
}
async function lm(e) {
	let t;
	try {
		t = Dp(await e.text())?.error.code;
	} catch {
		t = void 0;
	}
	return t === "failed_precondition" ? new tm("failed_precondition", am, 409) : new tm("session_busy", im, 409);
}
function um(e) {
	let { endpoint: n, getToken: r } = e, i = e.fetch ?? ((...e) => globalThis.fetch(...e)), a = t(n.origin, i);
	async function* o(t, i) {
		let o = e.session === !0, s = o ? void 0 : await r();
		if (!o && !s) throw new tm("config", "No token is set. The host page supplies it; the chat does not ask for it here.");
		let c;
		try {
			c = await a(n.href, {
				method: "POST",
				headers: {
					"content-type": "application/json",
					accept: "text/event-stream",
					...!o && { authorization: `Bearer ${s}` }
				},
				body: JSON.stringify(t),
				credentials: o ? "same-origin" : "omit",
				redirect: "error",
				referrerPolicy: "no-referrer",
				cache: "no-store",
				mode: "cors",
				...i && { signal: i }
			});
		} catch (e) {
			throw i?.aborted ? new tm("aborted", "Stopped.") : e instanceof Error && e.name === "OriginRefusedError" ? new tm("config", e.message) : new tm("network", "Cannot reach ipfs mcp. Check that it is running and that this page may connect to it.");
		}
		if (!c.ok) {
			if (o && c.status === 401) throw new tm("unauthorized", rm, 401);
			let t = nm[c.status];
			throw t ? new tm(t[0], t[1], c.status) : c.status === 409 ? await lm(c) : c.status === 503 ? await cm(c) ? new tm("backend_not_configured", sm, 503) : new tm("resource_exhausted", om, 503, em(c.headers.get("retry-after"), (e.now ?? Date.now)())) : new tm("http", `ipfs mcp answered ${c.status}.`, c.status);
		}
		if (!(c.headers.get("content-type") ?? "").toLowerCase().includes("text/event-stream") || !c.body) throw new tm("protocol", "ipfs mcp did not answer with an event stream.");
		try {
			for await (let e of Qp(c.body, i)) {
				let t;
				try {
					t = JSON.parse(e.data);
				} catch {
					throw new tm("protocol", "An event was not valid JSON.");
				}
				if (!dm(t)) throw new tm("protocol", "An event had no type.");
				yield t;
			}
			if (i?.aborted) throw new tm("aborted", "Stopped.");
		} catch (e) {
			throw e instanceof tm ? e : i?.aborted ? new tm("aborted", "Stopped.") : new tm("network", "The connection to ipfs mcp ended unexpectedly.");
		}
	}
	return { run: o };
}
function dm(e) {
	return typeof e == "object" && !!e && typeof e.type == "string";
}
//#endregion
//#region node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function fm(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = fm(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function pm() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = fm(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region src/ui/cn.ts
function mm(...e) {
	return pm(e);
}
//#endregion
//#region src/ui/sidebar.tsx
var hm = (0, M.createContext)(null);
function gm() {
	let e = (0, M.use)(hm);
	if (!e) throw Error("useSidebar must be used inside <SidebarProvider>.");
	return e;
}
function _m({ open: e, onOpenChange: t, children: n }) {
	let r = (0, M.useMemo)(() => ({
		open: e,
		side: "right",
		setOpen: t
	}), [e, t]);
	return /* @__PURE__ */ (0, N.jsx)(hm, {
		value: r,
		children: n
	});
}
function vm({ label: e, className: t, children: n, onKeyDown: r, ...i }) {
	let { open: a, side: o, setOpen: s } = gm();
	return /* @__PURE__ */ (0, N.jsx)("aside", {
		"data-slot": "sidebar",
		"data-state": a ? "open" : "closed",
		"data-side": o,
		"aria-label": e,
		inert: !a,
		className: mm("ac-sidebar", t),
		onKeyDown: (e) => {
			r?.(e), !e.defaultPrevented && e.key === "Escape" && !e.nativeEvent.isComposing && (e.stopPropagation(), s(!1));
		},
		...i,
		children: n
	});
}
function ym({ className: e, ...t }) {
	return /* @__PURE__ */ (0, N.jsx)("header", {
		"data-slot": "sidebar-header",
		className: mm("flex flex-col gap-s2 px-s3 pt-s3 pb-s2", e),
		...t
	});
}
function bm({ className: e, ...t }) {
	return /* @__PURE__ */ (0, N.jsx)("div", {
		"data-slot": "sidebar-content",
		className: mm("flex min-h-0 flex-1 flex-col", e),
		...t
	});
}
function xm({ className: e, ...t }) {
	return /* @__PURE__ */ (0, N.jsx)("footer", {
		"data-slot": "sidebar-footer",
		className: mm("flex flex-col gap-s2 bg-raised px-s3 py-s3", e),
		...t
	});
}
//#endregion
//#region src/island/BackendEmpty.tsx
var Sm = "#/settings/agent";
function Cm({ retryText: e, onRetry: t, onNavigate: n }) {
	return /* @__PURE__ */ (0, N.jsxs)("div", {
		className: "flex flex-col gap-s2 px-s3 py-s3",
		"data-testid": "backend-empty",
		children: [
			/* @__PURE__ */ (0, N.jsx)("h4", {
				className: "font-ui-heading text-[17px] leading-[1.3] font-semibold",
				children: "Choose a backend to start"
			}),
			/* @__PURE__ */ (0, N.jsxs)("p", {
				role: "status",
				className: "max-w-[66ch] text-muted-foreground",
				children: ["The agent needs a backend before it can answer. Choose one in Settings.", e === void 0 ? "" : " Your message was not sent. It is kept below until you send it again."]
			}),
			/* @__PURE__ */ (0, N.jsxs)("div", {
				className: "flex flex-wrap items-center gap-s2",
				children: [/* @__PURE__ */ (0, N.jsx)("a", {
					className: "iu-btn iu-btn--primary",
					href: Sm,
					onClick: n,
					children: "Choose a backend"
				}), e === void 0 ? null : /* @__PURE__ */ (0, N.jsx)($l, {
					variant: "secondary",
					onClick: t,
					children: "Send message again"
				})]
			}),
			e === void 0 ? null : /* @__PURE__ */ (0, N.jsxs)("p", {
				className: "max-w-[66ch] break-words text-muted-foreground",
				"data-testid": "backend-empty-unsent",
				children: [
					/* @__PURE__ */ (0, N.jsx)("strong", {
						className: "font-semibold text-foreground",
						children: "Not sent:"
					}),
					" ",
					e
				]
			})
		]
	});
}
//#endregion
//#region src/island/Composer.tsx
var wm = 8e3;
function Tm({ blockedReason: e, running: t, onSend: n, onStop: r }) {
	let [i, a] = (0, M.useState)(""), o = (0, M.useRef)(null), s = (0, M.useId)(), c = (0, M.useId)(), l = e !== void 0, u = i.length > wm, d = !l && !t && i.trim() !== "" && !u, f = () => {
		d && (n(i.trim()), a(""));
	};
	return /* @__PURE__ */ (0, N.jsxs)("div", {
		role: "group",
		"aria-label": "Message the agent",
		className: "flex flex-col gap-s2",
		children: [
			/* @__PURE__ */ (0, N.jsx)("label", {
				htmlFor: s,
				className: "iu-sr-only",
				children: "Message to the agent"
			}),
			/* @__PURE__ */ (0, N.jsx)("textarea", {
				ref: o,
				id: s,
				name: "message",
				rows: 1,
				value: i,
				disabled: l,
				"aria-describedby": c,
				"aria-invalid": u,
				placeholder: "Ask about your node",
				onChange: (e) => a(e.target.value),
				onKeyDown: (e) => {
					e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing || (e.preventDefault(), f());
				},
				className: "ac-field w-full rounded-ui-sm bg-control px-s3 py-s2 text-[length:var(--iu-text-body)] leading-[1.55] text-foreground disabled:opacity-45"
			}),
			/* @__PURE__ */ (0, N.jsxs)("div", {
				className: "flex items-center justify-between gap-s3",
				children: [/* @__PURE__ */ (0, N.jsx)("p", {
					id: c,
					className: "min-w-0 text-[length:var(--iu-text-small)] text-muted-foreground",
					children: l ? e : u ? `Too long by ${(i.length - wm).toLocaleString("en-US")} characters.` : "Enter sends. Shift and Enter adds a line."
				}), t ? /* @__PURE__ */ (0, N.jsx)($l, {
					variant: "secondary",
					onClick: r,
					children: "Stop run"
				}) : /* @__PURE__ */ (0, N.jsx)($l, {
					variant: "primary",
					onClick: f,
					disabled: !d,
					children: "Send message"
				})]
			})
		]
	});
}
//#endregion
//#region src/island/RunNotice.tsx
function Em(e, t) {
	if (e) switch (e.kind) {
		case "session_busy": return {
			tone: "warn",
			label: "Busy",
			text: e.message,
			status: "Busy",
			canRetry: e.retryText !== void 0
		};
		case "resource_exhausted": return {
			tone: "warn",
			label: "Busy",
			text: e.message,
			status: "Busy",
			canRetry: e.retryText !== void 0,
			retryNotBefore: e.retryNotBefore
		};
		case "backend_not_configured": return;
		case "failed_precondition": return {
			tone: "warn",
			label: "Waiting",
			text: e.message,
			status: "Waiting for approval",
			canRetry: !1
		};
		default: return {
			tone: "err",
			label: "Chat failed",
			text: e.message,
			status: "Failed",
			canRetry: !1
		};
	}
	if (t.status === "error") {
		let e = mp(t.errorCode), n = t.errorCode === "backend_error" || t.errorCode === void 0 ? "err" : "warn";
		return {
			tone: n,
			label: e.label,
			text: e.body,
			status: n === "err" ? "Failed" : e.label,
			canRetry: !1
		};
	}
}
function Dm({ model: e, nowMs: t, onRetry: n }) {
	let r = e.retryNotBefore !== void 0 && t < e.retryNotBefore;
	return /* @__PURE__ */ (0, N.jsxs)("div", {
		role: e.tone === "err" ? "alert" : "status",
		className: "flex flex-col items-start gap-s2 px-s3 pb-s2",
		children: [/* @__PURE__ */ (0, N.jsx)(lu, {
			tone: e.tone,
			label: e.label,
			children: e.text
		}), e.canRetry ? /* @__PURE__ */ (0, N.jsx)($l, {
			variant: "secondary",
			onClick: n,
			disabled: r,
			children: "Send message again"
		}) : null]
	});
}
//#endregion
//#region src/agui/wire.ts
function Om(e, t) {
	let n = /* @__PURE__ */ new Map(), r = [], i = new Set(e.messages.map((e) => e.id));
	for (let t of e.toolCalls) {
		let e = {
			id: t.id,
			type: "function",
			function: {
				name: t.name,
				arguments: t.argumentsText
			}
		};
		t.parentMessageId !== void 0 && i.has(t.parentMessageId) ? n.set(t.parentMessageId, [...n.get(t.parentMessageId) ?? [], e]) : r.push(e);
	}
	let a = [], o = (t) => {
		for (let n of t) {
			let t = e.toolCalls.find((e) => e.id === n.id);
			t?.resultText !== void 0 && a.push({
				id: t.resultMessageId ?? `msg-tool-${n.id}`,
				role: "tool",
				toolCallId: n.id,
				content: t.resultText
			});
		}
	};
	for (let t of e.messages) {
		let e = n.get(t.id);
		a.push({
			id: t.id,
			role: t.role,
			...t.content !== "" && { content: t.content },
			...e && { toolCalls: e }
		}), e && o(e);
	}
	return r.length > 0 && (a.push({
		id: `msg-asst-${r[0]?.id ?? "orphan"}`,
		role: "assistant",
		toolCalls: r
	}), o(r)), t.user && a.push({
		id: t.user.id,
		role: "user",
		content: t.user.text
	}), {
		threadId: t.threadId,
		runId: t.runId,
		messages: a,
		tools: [],
		context: [],
		...t.resume && t.resume.length > 0 && { resume: t.resume }
	};
}
//#endregion
//#region src/island/session.ts
var km = { ok: !0 }, Am = (e) => ({
	ok: !1,
	reason: e
}), jm = (e) => e.interrupt.metadata["ipfs-mcp"].requires_native_prompt, Mm = (e) => ({
	interruptId: e.interrupt.id,
	status: "resolved",
	payload: { wait: !0 }
});
function Nm(e, t) {
	if (!(e instanceof tm)) return {
		kind: "network",
		message: "The run failed."
	};
	if (e.kind === "resource_exhausted" && e.retryAfterSeconds !== void 0) {
		let n = e.retryAfterSeconds;
		return {
			kind: e.kind,
			message: `The node is at its session limit. Try again in ${n} ${n === 1 ? "second" : "seconds"}.`,
			retryNotBefore: t + n * 1e3
		};
	}
	return {
		kind: e.kind,
		message: e.message
	};
}
function Pm(e) {
	let t = {
		chat: hp,
		threadId: e.ids.thread(),
		running: !1,
		observing: []
	}, n, r = Promise.resolve(), i = !1, a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), s = () => {
		for (let e of o) e();
	}, c = (e) => {
		t = {
			...t,
			...e
		}, s();
	}, l = (e) => c({ chat: e(t.chat) }), u = () => new Date(e.now?.() ?? Date.now()).toISOString(), d = (e) => Up(e.interrupt, u()), f = () => t.chat.interrupts.filter((e) => e.resolution === void 0), p = () => f().filter((e) => !d(e));
	async function m(r, a) {
		let o = e.client;
		if (!o) return;
		n = new AbortController();
		let u = n, { error: d, ...p } = t;
		t = {
			...p,
			running: !0,
			observing: a
		}, s();
		try {
			for await (let e of o.run(r, u.signal)) {
				if (u.signal.aborted) break;
				l((t) => yp(t, e));
			}
			!u.signal.aborted && t.chat.run.status === "running" && c({ error: {
				kind: "incomplete",
				message: "The stream ended before the run finished."
			} });
		} catch (t) {
			u.signal.aborted || c({ error: Nm(t, e.now?.() ?? Date.now()) });
		} finally {
			n === u && (n = void 0), t.chat.run.status === "running" && (i && u.signal.aborted ? l((e) => ({
				...e,
				run: {
					...e.run,
					status: f().length > 0 ? "interrupted" : "finished"
				}
			})) : l((e) => ({
				...e,
				run: {
					...e.run,
					status: "error",
					error: e.run.error ?? "The run did not finish."
				}
			}))), i = !1, c({
				running: !1,
				observing: []
			});
		}
	}
	let h = (e, t = []) => (r = m(e, t), r), g = (n) => Om(t.chat, {
		threadId: t.chat.run.threadId ?? t.threadId,
		runId: e.ids.run(),
		resume: n
	});
	async function _() {
		if (t.running || t.error || t.chat.run.status !== "interrupted") return;
		let e = p(), n = e[0];
		e.length === 1 && n && jm(n) && !a.has(n.interrupt.id) && (a.add(n.interrupt.id), await h(g([Mm(n)]), [n.interrupt.id]));
	}
	return {
		getSnapshot: () => t,
		subscribe(e) {
			return o.add(e), () => o.delete(e);
		},
		async send(n) {
			if (!e.client) return Am("not_configured");
			if (t.running) return Am("busy");
			let r = t.error?.retryNotBefore;
			if (r !== void 0 && (e.now?.() ?? Date.now()) < r) return Am("retry_later");
			let i = n.trim();
			if (i === "") return Am("empty");
			if (p().length > 0) return Am("pending_interrupt");
			let a = e.ids.message(), o = Om(t.chat, {
				threadId: t.chat.run.threadId ?? t.threadId,
				runId: e.ids.run(),
				user: {
					id: a,
					text: i
				}
			});
			l((e) => ({
				...e,
				messages: [...e.messages, {
					id: a,
					role: "user",
					content: i,
					streaming: !1
				}]
			})), await h(o);
			let s = t.error;
			return s && (s.kind === "session_busy" || s.kind === "resource_exhausted" || s.kind === "backend_not_configured") ? (l((e) => ({
				...e,
				messages: e.messages.filter((e) => e.id !== a)
			})), c({ error: {
				...s,
				retryText: i
			} }), km) : (await _(), km);
		},
		async retry() {
			let e = t.error?.retryText;
			return e === void 0 ? Am("empty") : this.send(e);
		},
		async answer(a, o) {
			if (!e.client) return Am("not_configured");
			let s = t.chat.interrupts.find((e) => e.interrupt.id === a);
			if (s && o === "approve" && jm(s)) return Am("native_prompt");
			let c = s !== void 0 && t.observing.includes(a);
			if (t.running && !c) return Am("busy");
			if (!s) return Am("unknown_interrupt");
			if (s.resolution !== void 0) return Am("already_answered");
			if (d(s)) return Am("expired");
			c && (i = !0, n?.abort(), await r);
			let u = {
				interruptId: a,
				status: "resolved",
				payload: { approved: o === "approve" }
			};
			return l((e) => Tp(e, { resume: [u] })), await h(g([u])), await _(), km;
		},
		async observe(n) {
			if (!e.client) return Am("not_configured");
			if (t.running) return Am("busy");
			let r = t.chat.interrupts.find((e) => e.interrupt.id === n);
			return r ? r.resolution === void 0 ? d(r) ? Am("expired") : jm(r) ? p().length === 1 ? (await h(g([Mm(r)]), [r.interrupt.id]), km) : Am("pending_interrupt") : Am("not_native") : Am("already_answered") : Am("unknown_interrupt");
		},
		stop() {
			n?.abort();
		},
		reset() {
			n?.abort(), a.clear(), t = {
				chat: hp,
				threadId: e.ids.thread(),
				running: !1,
				observing: []
			}, s();
		}
	};
}
//#endregion
//#region src/island/timeline.ts
var Fm = /* @__PURE__ */ new Set([
	"user",
	"assistant",
	"system"
]);
function Im(e) {
	let t = [], n = /* @__PURE__ */ new Set(), r = (t) => e.interrupts.find((e) => e.interrupt.toolCallId === t), i = (i) => {
		for (let a of e.toolCalls) {
			if (n.has(a.id) || a.parentMessageId !== i) continue;
			n.add(a.id);
			let e = r(a.id);
			t.push({
				kind: "call",
				key: `call:${a.id}`,
				call: a,
				...e && { interrupt: e }
			});
		}
	};
	for (let n of e.messages) Fm.has(n.role) && (n.content !== "" || n.streaming) && t.push({
		kind: "message",
		key: `msg:${n.id}`,
		message: n
	}), i(n.id);
	for (let i of e.toolCalls) {
		if (n.has(i.id)) continue;
		n.add(i.id);
		let e = r(i.id);
		t.push({
			kind: "call",
			key: `call:${i.id}`,
			call: i,
			...e && { interrupt: e }
		});
	}
	return t;
}
function Lm(e) {
	if (!(e instanceof Element)) return "other";
	let t = e.closest(".iu-approval__actions button");
	return t ? t.classList.contains("iu-btn--primary") ? "approve" : "deny" : "other";
}
function Rm(e = () => performance.now()) {
	let t;
	return {
		record(n) {
			t = {
				decision: Lm(n.target),
				trusted: n.isTrusted === !0,
				at: e()
			};
		},
		consume(n) {
			let r = t;
			return t = void 0, r !== void 0 && r.trusted && r.decision === n && e() - r.at <= 400;
		}
	};
}
//#endregion
//#region src/island/InterruptItem.tsx
var zm = (0, M.createContext)((e) => e.isTrusted === !0);
function Bm({ item: e, nowIso: t, onAnswer: n, busy: r, observing: i, onWatchAgain: a }) {
	let { interrupt: o, resolution: s } = e, c = (0, M.useMemo)(() => Rm(), []), l = (0, M.use)(zm), [u, d] = (0, M.useState)(!1), f = s === void 0 && Up(o, t), p = s === void 0 && !f, m = o.metadata["ipfs-mcp"].requires_native_prompt, h = p && (!r || i), g = (e) => {
		c.consume(e) ? (d(!1), n(o.id, e)) : d(!0);
	};
	return /* @__PURE__ */ (0, N.jsxs)("div", {
		className: "flex flex-col gap-s2",
		onClickCapture: (e) => c.record({
			isTrusted: l(e.nativeEvent),
			target: e.target
		}),
		children: [
			/* @__PURE__ */ (0, N.jsx)(Wp, {
				interrupt: o,
				...s && { resolution: s },
				expired: f,
				focusSafeAction: !0,
				...h && {
					onApprove: () => g("approve"),
					onDeny: () => g("deny")
				}
			}),
			m && p && !r && a ? /* @__PURE__ */ (0, N.jsx)("div", { children: /* @__PURE__ */ (0, N.jsx)($l, {
				variant: "text",
				onClick: () => a(o.id),
				children: "Check the system prompt again"
			}) }) : null,
			u ? /* @__PURE__ */ (0, N.jsx)("div", {
				role: "alert",
				children: /* @__PURE__ */ (0, N.jsx)(lu, {
					tone: "err",
					label: "Not answered",
					children: "An answer needs a click or key press from you on the button itself."
				})
			}) : null
		]
	});
}
//#endregion
//#region node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/util.js
var z;
(function(e) {
	e.assertEqual = (e) => {};
	function t(e) {}
	e.assertIs = t;
	function n(e) {
		throw Error();
	}
	e.assertNever = n, e.arrayToEnum = (e) => {
		let t = {};
		for (let n of e) t[n] = n;
		return t;
	}, e.getValidEnumValues = (t) => {
		let n = e.objectKeys(t).filter((e) => typeof t[t[e]] != "number"), r = {};
		for (let e of n) r[e] = t[e];
		return e.objectValues(r);
	}, e.objectValues = (t) => e.objectKeys(t).map(function(e) {
		return t[e];
	}), e.objectKeys = typeof Object.keys == "function" ? (e) => Object.keys(e) : (e) => {
		let t = [];
		for (let n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
		return t;
	}, e.find = (e, t) => {
		for (let n of e) if (t(n)) return n;
	}, e.isInteger = typeof Number.isInteger == "function" ? (e) => Number.isInteger(e) : (e) => typeof e == "number" && Number.isFinite(e) && Math.floor(e) === e;
	function r(e, t = " | ") {
		return e.map((e) => typeof e == "string" ? `'${e}'` : e).join(t);
	}
	e.joinValues = r, e.jsonStringifyReplacer = (e, t) => typeof t == "bigint" ? t.toString() : t;
})(z ||= {});
var Vm;
(function(e) {
	e.mergeShapes = (e, t) => ({
		...e,
		...t
	});
})(Vm ||= {});
var B = z.arrayToEnum([
	"string",
	"nan",
	"number",
	"integer",
	"float",
	"boolean",
	"date",
	"bigint",
	"symbol",
	"function",
	"undefined",
	"null",
	"array",
	"object",
	"unknown",
	"promise",
	"void",
	"never",
	"map",
	"set"
]), Hm = (e) => {
	switch (typeof e) {
		case "undefined": return B.undefined;
		case "string": return B.string;
		case "number": return Number.isNaN(e) ? B.nan : B.number;
		case "boolean": return B.boolean;
		case "function": return B.function;
		case "bigint": return B.bigint;
		case "symbol": return B.symbol;
		case "object": return Array.isArray(e) ? B.array : e === null ? B.null : e.then && typeof e.then == "function" && e.catch && typeof e.catch == "function" ? B.promise : typeof Map < "u" && e instanceof Map ? B.map : typeof Set < "u" && e instanceof Set ? B.set : typeof Date < "u" && e instanceof Date ? B.date : B.object;
		default: return B.unknown;
	}
}, V = z.arrayToEnum([
	"invalid_type",
	"invalid_literal",
	"custom",
	"invalid_union",
	"invalid_union_discriminator",
	"invalid_enum_value",
	"unrecognized_keys",
	"invalid_arguments",
	"invalid_return_type",
	"invalid_date",
	"invalid_string",
	"too_small",
	"too_big",
	"invalid_intersection_types",
	"not_multiple_of",
	"not_finite"
]), Um = class e extends Error {
	get errors() {
		return this.issues;
	}
	constructor(e) {
		super(), this.issues = [], this.addIssue = (e) => {
			this.issues = [...this.issues, e];
		}, this.addIssues = (e = []) => {
			this.issues = [...this.issues, ...e];
		};
		let t = new.target.prototype;
		Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
	}
	format(e) {
		let t = e || function(e) {
			return e.message;
		}, n = { _errors: [] }, r = (e) => {
			for (let i of e.issues) if (i.code === "invalid_union") i.unionErrors.map(r);
			else if (i.code === "invalid_return_type") r(i.returnTypeError);
			else if (i.code === "invalid_arguments") r(i.argumentsError);
			else if (i.path.length === 0) n._errors.push(t(i));
			else {
				let e = n, r = 0;
				for (; r < i.path.length;) {
					let n = i.path[r];
					r === i.path.length - 1 ? (e[n] = e[n] || { _errors: [] }, e[n]._errors.push(t(i))) : e[n] = e[n] || { _errors: [] }, e = e[n], r++;
				}
			}
		};
		return r(this), n;
	}
	static assert(t) {
		if (!(t instanceof e)) throw Error(`Not a ZodError: ${t}`);
	}
	toString() {
		return this.message;
	}
	get message() {
		return JSON.stringify(this.issues, z.jsonStringifyReplacer, 2);
	}
	get isEmpty() {
		return this.issues.length === 0;
	}
	flatten(e = (e) => e.message) {
		let t = {}, n = [];
		for (let r of this.issues) if (r.path.length > 0) {
			let n = r.path[0];
			t[n] = t[n] || [], t[n].push(e(r));
		} else n.push(e(r));
		return {
			formErrors: n,
			fieldErrors: t
		};
	}
	get formErrors() {
		return this.flatten();
	}
};
Um.create = (e) => new Um(e);
//#endregion
//#region node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/locales/en.js
var Wm = (e, t) => {
	let n;
	switch (e.code) {
		case V.invalid_type:
			n = e.received === B.undefined ? "Required" : `Expected ${e.expected}, received ${e.received}`;
			break;
		case V.invalid_literal:
			n = `Invalid literal value, expected ${JSON.stringify(e.expected, z.jsonStringifyReplacer)}`;
			break;
		case V.unrecognized_keys:
			n = `Unrecognized key(s) in object: ${z.joinValues(e.keys, ", ")}`;
			break;
		case V.invalid_union:
			n = "Invalid input";
			break;
		case V.invalid_union_discriminator:
			n = `Invalid discriminator value. Expected ${z.joinValues(e.options)}`;
			break;
		case V.invalid_enum_value:
			n = `Invalid enum value. Expected ${z.joinValues(e.options)}, received '${e.received}'`;
			break;
		case V.invalid_arguments:
			n = "Invalid function arguments";
			break;
		case V.invalid_return_type:
			n = "Invalid function return type";
			break;
		case V.invalid_date:
			n = "Invalid date";
			break;
		case V.invalid_string:
			typeof e.validation == "object" ? "includes" in e.validation ? (n = `Invalid input: must include "${e.validation.includes}"`, typeof e.validation.position == "number" && (n = `${n} at one or more positions greater than or equal to ${e.validation.position}`)) : "startsWith" in e.validation ? n = `Invalid input: must start with "${e.validation.startsWith}"` : "endsWith" in e.validation ? n = `Invalid input: must end with "${e.validation.endsWith}"` : z.assertNever(e.validation) : n = e.validation === "regex" ? "Invalid" : `Invalid ${e.validation}`;
			break;
		case V.too_small:
			n = e.type === "array" ? `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "more than"} ${e.minimum} element(s)` : e.type === "string" ? `String must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "over"} ${e.minimum} character(s)` : e.type === "number" || e.type === "bigint" ? `Number must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${e.minimum}` : e.type === "date" ? `Date must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(e.minimum))}` : "Invalid input";
			break;
		case V.too_big:
			n = e.type === "array" ? `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "less than"} ${e.maximum} element(s)` : e.type === "string" ? `String must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "under"} ${e.maximum} character(s)` : e.type === "number" ? `Number must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` : e.type === "bigint" ? `BigInt must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` : e.type === "date" ? `Date must be ${e.exact ? "exactly" : e.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(e.maximum))}` : "Invalid input";
			break;
		case V.custom:
			n = "Invalid input";
			break;
		case V.invalid_intersection_types:
			n = "Intersection results could not be merged";
			break;
		case V.not_multiple_of:
			n = `Number must be a multiple of ${e.multipleOf}`;
			break;
		case V.not_finite:
			n = "Number must be finite";
			break;
		default: n = t.defaultError, z.assertNever(e);
	}
	return { message: n };
}, Gm = Wm;
function Km() {
	return Gm;
}
//#endregion
//#region node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/parseUtil.js
var qm = (e) => {
	let { data: t, path: n, errorMaps: r, issueData: i } = e, a = [...n, ...i.path || []], o = {
		...i,
		path: a
	};
	if (i.message !== void 0) return {
		...i,
		path: a,
		message: i.message
	};
	let s = "", c = r.filter((e) => !!e).slice().reverse();
	for (let e of c) s = e(o, {
		data: t,
		defaultError: s
	}).message;
	return {
		...i,
		path: a,
		message: s
	};
};
function H(e, t) {
	let n = Km(), r = qm({
		issueData: t,
		data: e.data,
		path: e.path,
		errorMaps: [
			e.common.contextualErrorMap,
			e.schemaErrorMap,
			n,
			n === Wm ? void 0 : Wm
		].filter((e) => !!e)
	});
	e.common.issues.push(r);
}
var Jm = class e {
	constructor() {
		this.value = "valid";
	}
	dirty() {
		this.value === "valid" && (this.value = "dirty");
	}
	abort() {
		this.value !== "aborted" && (this.value = "aborted");
	}
	static mergeArray(e, t) {
		let n = [];
		for (let r of t) {
			if (r.status === "aborted") return U;
			r.status === "dirty" && e.dirty(), n.push(r.value);
		}
		return {
			status: e.value,
			value: n
		};
	}
	static async mergeObjectAsync(t, n) {
		let r = [];
		for (let e of n) {
			let t = await e.key, n = await e.value;
			r.push({
				key: t,
				value: n
			});
		}
		return e.mergeObjectSync(t, r);
	}
	static mergeObjectSync(e, t) {
		let n = {};
		for (let r of t) {
			let { key: t, value: i } = r;
			if (t.status === "aborted" || i.status === "aborted") return U;
			t.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), t.value !== "__proto__" && (i.value !== void 0 || r.alwaysSet) && (n[t.value] = i.value);
		}
		return {
			status: e.value,
			value: n
		};
	}
}, U = Object.freeze({ status: "aborted" }), Ym = (e) => ({
	status: "dirty",
	value: e
}), Xm = (e) => ({
	status: "valid",
	value: e
}), Zm = (e) => e.status === "aborted", Qm = (e) => e.status === "dirty", $m = (e) => e.status === "valid", eh = (e) => typeof Promise < "u" && e instanceof Promise, W;
(function(e) {
	e.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, e.toString = (e) => typeof e == "string" ? e : e?.message;
})(W ||= {});
//#endregion
//#region node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/types.js
var th = class {
	constructor(e, t, n, r) {
		this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = r;
	}
	get path() {
		return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
	}
}, nh = (e, t) => {
	if ($m(t)) return {
		success: !0,
		data: t.value
	};
	if (!e.common.issues.length) throw Error("Validation failed but no issues detected.");
	return {
		success: !1,
		get error() {
			if (this._error) return this._error;
			let t = new Um(e.common.issues);
			return this._error = t, this._error;
		}
	};
};
function G(e) {
	if (!e) return {};
	let { errorMap: t, invalid_type_error: n, required_error: r, description: i } = e;
	if (t && (n || r)) throw Error("Can't use \"invalid_type_error\" or \"required_error\" in conjunction with custom error map.");
	return t ? {
		errorMap: t,
		description: i
	} : {
		errorMap: (t, i) => {
			let { message: a } = e;
			return t.code === "invalid_enum_value" ? { message: a ?? i.defaultError } : i.data === void 0 ? { message: a ?? r ?? i.defaultError } : t.code === "invalid_type" ? { message: a ?? n ?? i.defaultError } : { message: i.defaultError };
		},
		description: i
	};
}
var K = class {
	get description() {
		return this._def.description;
	}
	_getType(e) {
		return Hm(e.data);
	}
	_getOrReturnCtx(e, t) {
		return t || {
			common: e.parent.common,
			data: e.data,
			parsedType: Hm(e.data),
			schemaErrorMap: this._def.errorMap,
			path: e.path,
			parent: e.parent
		};
	}
	_processInputParams(e) {
		return {
			status: new Jm(),
			ctx: {
				common: e.parent.common,
				data: e.data,
				parsedType: Hm(e.data),
				schemaErrorMap: this._def.errorMap,
				path: e.path,
				parent: e.parent
			}
		};
	}
	_parseSync(e) {
		let t = this._parse(e);
		if (eh(t)) throw Error("Synchronous parse encountered promise.");
		return t;
	}
	_parseAsync(e) {
		let t = this._parse(e);
		return Promise.resolve(t);
	}
	parse(e, t) {
		let n = this.safeParse(e, t);
		if (n.success) return n.data;
		throw n.error;
	}
	safeParse(e, t) {
		let n = {
			common: {
				issues: [],
				async: t?.async ?? !1,
				contextualErrorMap: t?.errorMap
			},
			path: t?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: Hm(e)
		};
		return nh(n, this._parseSync({
			data: e,
			path: n.path,
			parent: n
		}));
	}
	"~validate"(e) {
		let t = {
			common: {
				issues: [],
				async: !!this["~standard"].async
			},
			path: [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: Hm(e)
		};
		if (!this["~standard"].async) try {
			let n = this._parseSync({
				data: e,
				path: [],
				parent: t
			});
			return $m(n) ? { value: n.value } : { issues: t.common.issues };
		} catch (e) {
			e?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = !0), t.common = {
				issues: [],
				async: !0
			};
		}
		return this._parseAsync({
			data: e,
			path: [],
			parent: t
		}).then((e) => $m(e) ? { value: e.value } : { issues: t.common.issues });
	}
	async parseAsync(e, t) {
		let n = await this.safeParseAsync(e, t);
		if (n.success) return n.data;
		throw n.error;
	}
	async safeParseAsync(e, t) {
		let n = {
			common: {
				issues: [],
				contextualErrorMap: t?.errorMap,
				async: !0
			},
			path: t?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: Hm(e)
		}, r = this._parse({
			data: e,
			path: n.path,
			parent: n
		});
		return nh(n, await (eh(r) ? r : Promise.resolve(r)));
	}
	refine(e, t) {
		let n = (e) => typeof t == "string" || t === void 0 ? { message: t } : typeof t == "function" ? t(e) : t;
		return this._refinement((t, r) => {
			let i = e(t), a = () => r.addIssue({
				code: V.custom,
				...n(t)
			});
			return typeof Promise < "u" && i instanceof Promise ? i.then((e) => e ? !0 : (a(), !1)) : i ? !0 : (a(), !1);
		});
	}
	refinement(e, t) {
		return this._refinement((n, r) => e(n) ? !0 : (r.addIssue(typeof t == "function" ? t(n, r) : t), !1));
	}
	_refinement(e) {
		return new ag({
			schema: this,
			typeName: q.ZodEffects,
			effect: {
				type: "refinement",
				refinement: e
			}
		});
	}
	superRefine(e) {
		return this._refinement(e);
	}
	constructor(e) {
		this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
			version: 1,
			vendor: "zod",
			validate: (e) => this["~validate"](e)
		};
	}
	optional() {
		return og.create(this, this._def);
	}
	nullable() {
		return sg.create(this, this._def);
	}
	nullish() {
		return this.nullable().optional();
	}
	array() {
		return Bh.create(this);
	}
	promise() {
		return ig.create(this, this._def);
	}
	or(e) {
		return Uh.create([this, e], this._def);
	}
	and(e) {
		return qh.create(this, e, this._def);
	}
	transform(e) {
		return new ag({
			...G(this._def),
			schema: this,
			typeName: q.ZodEffects,
			effect: {
				type: "transform",
				transform: e
			}
		});
	}
	default(e) {
		let t = typeof e == "function" ? e : () => e;
		return new cg({
			...G(this._def),
			innerType: this,
			defaultValue: t,
			typeName: q.ZodDefault
		});
	}
	brand() {
		return new dg({
			typeName: q.ZodBranded,
			type: this,
			...G(this._def)
		});
	}
	catch(e) {
		let t = typeof e == "function" ? e : () => e;
		return new lg({
			...G(this._def),
			innerType: this,
			catchValue: t,
			typeName: q.ZodCatch
		});
	}
	describe(e) {
		let t = this.constructor;
		return new t({
			...this._def,
			description: e
		});
	}
	pipe(e) {
		return fg.create(this, e);
	}
	readonly() {
		return pg.create(this);
	}
	isOptional() {
		return this.safeParse(void 0).success;
	}
	isNullable() {
		return this.safeParse(null).success;
	}
}, rh = /^c[^\s-]{8,}$/i, ih = /^[0-9a-z]+$/, ah = /^[0-9A-HJKMNP-TV-Z]{26}$/i, oh = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, sh = /^[a-z0-9_-]{21}$/i, ch = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, lh = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, uh = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, dh = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", fh, ph = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, mh = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, hh = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, gh = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, _h = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, vh = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, yh = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", bh = RegExp(`^${yh}$`);
function xh(e) {
	let t = "[0-5]\\d";
	e.precision ? t = `${t}\\.\\d{${e.precision}}` : e.precision ?? (t = `${t}(\\.\\d+)?`);
	let n = e.precision ? "+" : "?";
	return `([01]\\d|2[0-3]):[0-5]\\d(:${t})${n}`;
}
function Sh(e) {
	return RegExp(`^${xh(e)}$`);
}
function Ch(e) {
	let t = `${yh}T${xh(e)}`, n = [];
	return n.push(e.local ? "Z?" : "Z"), e.offset && n.push("([+-]\\d{2}:?\\d{2})"), t = `${t}(${n.join("|")})`, RegExp(`^${t}$`);
}
function wh(e, t) {
	return !((t !== "v4" && t || !ph.test(e)) && (t !== "v6" && t || !hh.test(e)));
}
function Th(e, t) {
	if (!ch.test(e)) return !1;
	try {
		let [n] = e.split(".");
		if (!n) return !1;
		let r = n.replace(/-/g, "+").replace(/_/g, "/").padEnd(n.length + (4 - n.length % 4) % 4, "="), i = JSON.parse(atob(r));
		return !(typeof i != "object" || !i || "typ" in i && i?.typ !== "JWT" || !i.alg || t && i.alg !== t);
	} catch {
		return !1;
	}
}
function Eh(e, t) {
	return !((t !== "v4" && t || !mh.test(e)) && (t !== "v6" && t || !gh.test(e)));
}
var Dh = class e extends K {
	_parse(e) {
		if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== B.string) {
			let t = this._getOrReturnCtx(e);
			return H(t, {
				code: V.invalid_type,
				expected: B.string,
				received: t.parsedType
			}), U;
		}
		let t = new Jm(), n;
		for (let r of this._def.checks) if (r.kind === "min") e.data.length < r.value && (n = this._getOrReturnCtx(e, n), H(n, {
			code: V.too_small,
			minimum: r.value,
			type: "string",
			inclusive: !0,
			exact: !1,
			message: r.message
		}), t.dirty());
		else if (r.kind === "max") e.data.length > r.value && (n = this._getOrReturnCtx(e, n), H(n, {
			code: V.too_big,
			maximum: r.value,
			type: "string",
			inclusive: !0,
			exact: !1,
			message: r.message
		}), t.dirty());
		else if (r.kind === "length") {
			let i = e.data.length > r.value, a = e.data.length < r.value;
			(i || a) && (n = this._getOrReturnCtx(e, n), i ? H(n, {
				code: V.too_big,
				maximum: r.value,
				type: "string",
				inclusive: !0,
				exact: !0,
				message: r.message
			}) : a && H(n, {
				code: V.too_small,
				minimum: r.value,
				type: "string",
				inclusive: !0,
				exact: !0,
				message: r.message
			}), t.dirty());
		} else if (r.kind === "email") uh.test(e.data) || (n = this._getOrReturnCtx(e, n), H(n, {
			validation: "email",
			code: V.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "emoji") fh ||= new RegExp(dh, "u"), fh.test(e.data) || (n = this._getOrReturnCtx(e, n), H(n, {
			validation: "emoji",
			code: V.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "uuid") oh.test(e.data) || (n = this._getOrReturnCtx(e, n), H(n, {
			validation: "uuid",
			code: V.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "nanoid") sh.test(e.data) || (n = this._getOrReturnCtx(e, n), H(n, {
			validation: "nanoid",
			code: V.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "cuid") rh.test(e.data) || (n = this._getOrReturnCtx(e, n), H(n, {
			validation: "cuid",
			code: V.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "cuid2") ih.test(e.data) || (n = this._getOrReturnCtx(e, n), H(n, {
			validation: "cuid2",
			code: V.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "ulid") ah.test(e.data) || (n = this._getOrReturnCtx(e, n), H(n, {
			validation: "ulid",
			code: V.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "url") try {
			new URL(e.data);
		} catch {
			n = this._getOrReturnCtx(e, n), H(n, {
				validation: "url",
				code: V.invalid_string,
				message: r.message
			}), t.dirty();
		}
		else r.kind === "regex" ? (r.regex.lastIndex = 0, r.regex.test(e.data) || (n = this._getOrReturnCtx(e, n), H(n, {
			validation: "regex",
			code: V.invalid_string,
			message: r.message
		}), t.dirty())) : r.kind === "trim" ? e.data = e.data.trim() : r.kind === "includes" ? e.data.includes(r.value, r.position) || (n = this._getOrReturnCtx(e, n), H(n, {
			code: V.invalid_string,
			validation: {
				includes: r.value,
				position: r.position
			},
			message: r.message
		}), t.dirty()) : r.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : r.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : r.kind === "startsWith" ? e.data.startsWith(r.value) || (n = this._getOrReturnCtx(e, n), H(n, {
			code: V.invalid_string,
			validation: { startsWith: r.value },
			message: r.message
		}), t.dirty()) : r.kind === "endsWith" ? e.data.endsWith(r.value) || (n = this._getOrReturnCtx(e, n), H(n, {
			code: V.invalid_string,
			validation: { endsWith: r.value },
			message: r.message
		}), t.dirty()) : r.kind === "datetime" ? Ch(r).test(e.data) || (n = this._getOrReturnCtx(e, n), H(n, {
			code: V.invalid_string,
			validation: "datetime",
			message: r.message
		}), t.dirty()) : r.kind === "date" ? bh.test(e.data) || (n = this._getOrReturnCtx(e, n), H(n, {
			code: V.invalid_string,
			validation: "date",
			message: r.message
		}), t.dirty()) : r.kind === "time" ? Sh(r).test(e.data) || (n = this._getOrReturnCtx(e, n), H(n, {
			code: V.invalid_string,
			validation: "time",
			message: r.message
		}), t.dirty()) : r.kind === "duration" ? lh.test(e.data) || (n = this._getOrReturnCtx(e, n), H(n, {
			validation: "duration",
			code: V.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "ip" ? wh(e.data, r.version) || (n = this._getOrReturnCtx(e, n), H(n, {
			validation: "ip",
			code: V.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "jwt" ? Th(e.data, r.alg) || (n = this._getOrReturnCtx(e, n), H(n, {
			validation: "jwt",
			code: V.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "cidr" ? Eh(e.data, r.version) || (n = this._getOrReturnCtx(e, n), H(n, {
			validation: "cidr",
			code: V.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "base64" ? _h.test(e.data) || (n = this._getOrReturnCtx(e, n), H(n, {
			validation: "base64",
			code: V.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "base64url" ? vh.test(e.data) || (n = this._getOrReturnCtx(e, n), H(n, {
			validation: "base64url",
			code: V.invalid_string,
			message: r.message
		}), t.dirty()) : z.assertNever(r);
		return {
			status: t.value,
			value: e.data
		};
	}
	_regex(e, t, n) {
		return this.refinement((t) => e.test(t), {
			validation: t,
			code: V.invalid_string,
			...W.errToObj(n)
		});
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	email(e) {
		return this._addCheck({
			kind: "email",
			...W.errToObj(e)
		});
	}
	url(e) {
		return this._addCheck({
			kind: "url",
			...W.errToObj(e)
		});
	}
	emoji(e) {
		return this._addCheck({
			kind: "emoji",
			...W.errToObj(e)
		});
	}
	uuid(e) {
		return this._addCheck({
			kind: "uuid",
			...W.errToObj(e)
		});
	}
	nanoid(e) {
		return this._addCheck({
			kind: "nanoid",
			...W.errToObj(e)
		});
	}
	cuid(e) {
		return this._addCheck({
			kind: "cuid",
			...W.errToObj(e)
		});
	}
	cuid2(e) {
		return this._addCheck({
			kind: "cuid2",
			...W.errToObj(e)
		});
	}
	ulid(e) {
		return this._addCheck({
			kind: "ulid",
			...W.errToObj(e)
		});
	}
	base64(e) {
		return this._addCheck({
			kind: "base64",
			...W.errToObj(e)
		});
	}
	base64url(e) {
		return this._addCheck({
			kind: "base64url",
			...W.errToObj(e)
		});
	}
	jwt(e) {
		return this._addCheck({
			kind: "jwt",
			...W.errToObj(e)
		});
	}
	ip(e) {
		return this._addCheck({
			kind: "ip",
			...W.errToObj(e)
		});
	}
	cidr(e) {
		return this._addCheck({
			kind: "cidr",
			...W.errToObj(e)
		});
	}
	datetime(e) {
		return typeof e == "string" ? this._addCheck({
			kind: "datetime",
			precision: null,
			offset: !1,
			local: !1,
			message: e
		}) : this._addCheck({
			kind: "datetime",
			precision: e?.precision === void 0 ? null : e?.precision,
			offset: e?.offset ?? !1,
			local: e?.local ?? !1,
			...W.errToObj(e?.message)
		});
	}
	date(e) {
		return this._addCheck({
			kind: "date",
			message: e
		});
	}
	time(e) {
		return typeof e == "string" ? this._addCheck({
			kind: "time",
			precision: null,
			message: e
		}) : this._addCheck({
			kind: "time",
			precision: e?.precision === void 0 ? null : e?.precision,
			...W.errToObj(e?.message)
		});
	}
	duration(e) {
		return this._addCheck({
			kind: "duration",
			...W.errToObj(e)
		});
	}
	regex(e, t) {
		return this._addCheck({
			kind: "regex",
			regex: e,
			...W.errToObj(t)
		});
	}
	includes(e, t) {
		return this._addCheck({
			kind: "includes",
			value: e,
			position: t?.position,
			...W.errToObj(t?.message)
		});
	}
	startsWith(e, t) {
		return this._addCheck({
			kind: "startsWith",
			value: e,
			...W.errToObj(t)
		});
	}
	endsWith(e, t) {
		return this._addCheck({
			kind: "endsWith",
			value: e,
			...W.errToObj(t)
		});
	}
	min(e, t) {
		return this._addCheck({
			kind: "min",
			value: e,
			...W.errToObj(t)
		});
	}
	max(e, t) {
		return this._addCheck({
			kind: "max",
			value: e,
			...W.errToObj(t)
		});
	}
	length(e, t) {
		return this._addCheck({
			kind: "length",
			value: e,
			...W.errToObj(t)
		});
	}
	nonempty(e) {
		return this.min(1, W.errToObj(e));
	}
	trim() {
		return new e({
			...this._def,
			checks: [...this._def.checks, { kind: "trim" }]
		});
	}
	toLowerCase() {
		return new e({
			...this._def,
			checks: [...this._def.checks, { kind: "toLowerCase" }]
		});
	}
	toUpperCase() {
		return new e({
			...this._def,
			checks: [...this._def.checks, { kind: "toUpperCase" }]
		});
	}
	get isDatetime() {
		return !!this._def.checks.find((e) => e.kind === "datetime");
	}
	get isDate() {
		return !!this._def.checks.find((e) => e.kind === "date");
	}
	get isTime() {
		return !!this._def.checks.find((e) => e.kind === "time");
	}
	get isDuration() {
		return !!this._def.checks.find((e) => e.kind === "duration");
	}
	get isEmail() {
		return !!this._def.checks.find((e) => e.kind === "email");
	}
	get isURL() {
		return !!this._def.checks.find((e) => e.kind === "url");
	}
	get isEmoji() {
		return !!this._def.checks.find((e) => e.kind === "emoji");
	}
	get isUUID() {
		return !!this._def.checks.find((e) => e.kind === "uuid");
	}
	get isNANOID() {
		return !!this._def.checks.find((e) => e.kind === "nanoid");
	}
	get isCUID() {
		return !!this._def.checks.find((e) => e.kind === "cuid");
	}
	get isCUID2() {
		return !!this._def.checks.find((e) => e.kind === "cuid2");
	}
	get isULID() {
		return !!this._def.checks.find((e) => e.kind === "ulid");
	}
	get isIP() {
		return !!this._def.checks.find((e) => e.kind === "ip");
	}
	get isCIDR() {
		return !!this._def.checks.find((e) => e.kind === "cidr");
	}
	get isBase64() {
		return !!this._def.checks.find((e) => e.kind === "base64");
	}
	get isBase64url() {
		return !!this._def.checks.find((e) => e.kind === "base64url");
	}
	get minLength() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxLength() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
};
Dh.create = (e) => new Dh({
	checks: [],
	typeName: q.ZodString,
	coerce: e?.coerce ?? !1,
	...G(e)
});
function Oh(e, t) {
	let n = (e.toString().split(".")[1] || "").length, r = (t.toString().split(".")[1] || "").length, i = n > r ? n : r;
	return Number.parseInt(e.toFixed(i).replace(".", "")) % Number.parseInt(t.toFixed(i).replace(".", "")) / 10 ** i;
}
var kh = class e extends K {
	constructor() {
		super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
	}
	_parse(e) {
		if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== B.number) {
			let t = this._getOrReturnCtx(e);
			return H(t, {
				code: V.invalid_type,
				expected: B.number,
				received: t.parsedType
			}), U;
		}
		let t, n = new Jm();
		for (let r of this._def.checks) r.kind === "int" ? z.isInteger(e.data) || (t = this._getOrReturnCtx(e, t), H(t, {
			code: V.invalid_type,
			expected: "integer",
			received: "float",
			message: r.message
		}), n.dirty()) : r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (t = this._getOrReturnCtx(e, t), H(t, {
			code: V.too_small,
			minimum: r.value,
			type: "number",
			inclusive: r.inclusive,
			exact: !1,
			message: r.message
		}), n.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (t = this._getOrReturnCtx(e, t), H(t, {
			code: V.too_big,
			maximum: r.value,
			type: "number",
			inclusive: r.inclusive,
			exact: !1,
			message: r.message
		}), n.dirty()) : r.kind === "multipleOf" ? Oh(e.data, r.value) !== 0 && (t = this._getOrReturnCtx(e, t), H(t, {
			code: V.not_multiple_of,
			multipleOf: r.value,
			message: r.message
		}), n.dirty()) : r.kind === "finite" ? Number.isFinite(e.data) || (t = this._getOrReturnCtx(e, t), H(t, {
			code: V.not_finite,
			message: r.message
		}), n.dirty()) : z.assertNever(r);
		return {
			status: n.value,
			value: e.data
		};
	}
	gte(e, t) {
		return this.setLimit("min", e, !0, W.toString(t));
	}
	gt(e, t) {
		return this.setLimit("min", e, !1, W.toString(t));
	}
	lte(e, t) {
		return this.setLimit("max", e, !0, W.toString(t));
	}
	lt(e, t) {
		return this.setLimit("max", e, !1, W.toString(t));
	}
	setLimit(t, n, r, i) {
		return new e({
			...this._def,
			checks: [...this._def.checks, {
				kind: t,
				value: n,
				inclusive: r,
				message: W.toString(i)
			}]
		});
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	int(e) {
		return this._addCheck({
			kind: "int",
			message: W.toString(e)
		});
	}
	positive(e) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: !1,
			message: W.toString(e)
		});
	}
	negative(e) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: !1,
			message: W.toString(e)
		});
	}
	nonpositive(e) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: !0,
			message: W.toString(e)
		});
	}
	nonnegative(e) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: !0,
			message: W.toString(e)
		});
	}
	multipleOf(e, t) {
		return this._addCheck({
			kind: "multipleOf",
			value: e,
			message: W.toString(t)
		});
	}
	finite(e) {
		return this._addCheck({
			kind: "finite",
			message: W.toString(e)
		});
	}
	safe(e) {
		return this._addCheck({
			kind: "min",
			inclusive: !0,
			value: -(2 ** 53 - 1),
			message: W.toString(e)
		})._addCheck({
			kind: "max",
			inclusive: !0,
			value: 2 ** 53 - 1,
			message: W.toString(e)
		});
	}
	get minValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
	get isInt() {
		return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && z.isInteger(e.value));
	}
	get isFinite() {
		let e = null, t = null;
		for (let n of this._def.checks) if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf") return !0;
		else n.kind === "min" ? (t === null || n.value > t) && (t = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
		return Number.isFinite(t) && Number.isFinite(e);
	}
};
kh.create = (e) => new kh({
	checks: [],
	typeName: q.ZodNumber,
	coerce: e?.coerce || !1,
	...G(e)
});
var Ah = class e extends K {
	constructor() {
		super(...arguments), this.min = this.gte, this.max = this.lte;
	}
	_parse(e) {
		if (this._def.coerce) try {
			e.data = BigInt(e.data);
		} catch {
			return this._getInvalidInput(e);
		}
		if (this._getType(e) !== B.bigint) return this._getInvalidInput(e);
		let t, n = new Jm();
		for (let r of this._def.checks) r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (t = this._getOrReturnCtx(e, t), H(t, {
			code: V.too_small,
			type: "bigint",
			minimum: r.value,
			inclusive: r.inclusive,
			message: r.message
		}), n.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (t = this._getOrReturnCtx(e, t), H(t, {
			code: V.too_big,
			type: "bigint",
			maximum: r.value,
			inclusive: r.inclusive,
			message: r.message
		}), n.dirty()) : r.kind === "multipleOf" ? e.data % r.value !== BigInt(0) && (t = this._getOrReturnCtx(e, t), H(t, {
			code: V.not_multiple_of,
			multipleOf: r.value,
			message: r.message
		}), n.dirty()) : z.assertNever(r);
		return {
			status: n.value,
			value: e.data
		};
	}
	_getInvalidInput(e) {
		let t = this._getOrReturnCtx(e);
		return H(t, {
			code: V.invalid_type,
			expected: B.bigint,
			received: t.parsedType
		}), U;
	}
	gte(e, t) {
		return this.setLimit("min", e, !0, W.toString(t));
	}
	gt(e, t) {
		return this.setLimit("min", e, !1, W.toString(t));
	}
	lte(e, t) {
		return this.setLimit("max", e, !0, W.toString(t));
	}
	lt(e, t) {
		return this.setLimit("max", e, !1, W.toString(t));
	}
	setLimit(t, n, r, i) {
		return new e({
			...this._def,
			checks: [...this._def.checks, {
				kind: t,
				value: n,
				inclusive: r,
				message: W.toString(i)
			}]
		});
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	positive(e) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: !1,
			message: W.toString(e)
		});
	}
	negative(e) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: !1,
			message: W.toString(e)
		});
	}
	nonpositive(e) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: !0,
			message: W.toString(e)
		});
	}
	nonnegative(e) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: !0,
			message: W.toString(e)
		});
	}
	multipleOf(e, t) {
		return this._addCheck({
			kind: "multipleOf",
			value: e,
			message: W.toString(t)
		});
	}
	get minValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
};
Ah.create = (e) => new Ah({
	checks: [],
	typeName: q.ZodBigInt,
	coerce: e?.coerce ?? !1,
	...G(e)
});
var jh = class extends K {
	_parse(e) {
		if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== B.boolean) {
			let t = this._getOrReturnCtx(e);
			return H(t, {
				code: V.invalid_type,
				expected: B.boolean,
				received: t.parsedType
			}), U;
		}
		return Xm(e.data);
	}
};
jh.create = (e) => new jh({
	typeName: q.ZodBoolean,
	coerce: e?.coerce || !1,
	...G(e)
});
var Mh = class e extends K {
	_parse(e) {
		if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== B.date) {
			let t = this._getOrReturnCtx(e);
			return H(t, {
				code: V.invalid_type,
				expected: B.date,
				received: t.parsedType
			}), U;
		}
		if (Number.isNaN(e.data.getTime())) return H(this._getOrReturnCtx(e), { code: V.invalid_date }), U;
		let t = new Jm(), n;
		for (let r of this._def.checks) r.kind === "min" ? e.data.getTime() < r.value && (n = this._getOrReturnCtx(e, n), H(n, {
			code: V.too_small,
			message: r.message,
			inclusive: !0,
			exact: !1,
			minimum: r.value,
			type: "date"
		}), t.dirty()) : r.kind === "max" ? e.data.getTime() > r.value && (n = this._getOrReturnCtx(e, n), H(n, {
			code: V.too_big,
			message: r.message,
			inclusive: !0,
			exact: !1,
			maximum: r.value,
			type: "date"
		}), t.dirty()) : z.assertNever(r);
		return {
			status: t.value,
			value: new Date(e.data.getTime())
		};
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	min(e, t) {
		return this._addCheck({
			kind: "min",
			value: e.getTime(),
			message: W.toString(t)
		});
	}
	max(e, t) {
		return this._addCheck({
			kind: "max",
			value: e.getTime(),
			message: W.toString(t)
		});
	}
	get minDate() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e == null ? null : new Date(e);
	}
	get maxDate() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e == null ? null : new Date(e);
	}
};
Mh.create = (e) => new Mh({
	checks: [],
	coerce: e?.coerce || !1,
	typeName: q.ZodDate,
	...G(e)
});
var Nh = class extends K {
	_parse(e) {
		if (this._getType(e) !== B.symbol) {
			let t = this._getOrReturnCtx(e);
			return H(t, {
				code: V.invalid_type,
				expected: B.symbol,
				received: t.parsedType
			}), U;
		}
		return Xm(e.data);
	}
};
Nh.create = (e) => new Nh({
	typeName: q.ZodSymbol,
	...G(e)
});
var Ph = class extends K {
	_parse(e) {
		if (this._getType(e) !== B.undefined) {
			let t = this._getOrReturnCtx(e);
			return H(t, {
				code: V.invalid_type,
				expected: B.undefined,
				received: t.parsedType
			}), U;
		}
		return Xm(e.data);
	}
};
Ph.create = (e) => new Ph({
	typeName: q.ZodUndefined,
	...G(e)
});
var Fh = class extends K {
	_parse(e) {
		if (this._getType(e) !== B.null) {
			let t = this._getOrReturnCtx(e);
			return H(t, {
				code: V.invalid_type,
				expected: B.null,
				received: t.parsedType
			}), U;
		}
		return Xm(e.data);
	}
};
Fh.create = (e) => new Fh({
	typeName: q.ZodNull,
	...G(e)
});
var Ih = class extends K {
	constructor() {
		super(...arguments), this._any = !0;
	}
	_parse(e) {
		return Xm(e.data);
	}
};
Ih.create = (e) => new Ih({
	typeName: q.ZodAny,
	...G(e)
});
var Lh = class extends K {
	constructor() {
		super(...arguments), this._unknown = !0;
	}
	_parse(e) {
		return Xm(e.data);
	}
};
Lh.create = (e) => new Lh({
	typeName: q.ZodUnknown,
	...G(e)
});
var Rh = class extends K {
	_parse(e) {
		let t = this._getOrReturnCtx(e);
		return H(t, {
			code: V.invalid_type,
			expected: B.never,
			received: t.parsedType
		}), U;
	}
};
Rh.create = (e) => new Rh({
	typeName: q.ZodNever,
	...G(e)
});
var zh = class extends K {
	_parse(e) {
		if (this._getType(e) !== B.undefined) {
			let t = this._getOrReturnCtx(e);
			return H(t, {
				code: V.invalid_type,
				expected: B.void,
				received: t.parsedType
			}), U;
		}
		return Xm(e.data);
	}
};
zh.create = (e) => new zh({
	typeName: q.ZodVoid,
	...G(e)
});
var Bh = class e extends K {
	_parse(e) {
		let { ctx: t, status: n } = this._processInputParams(e), r = this._def;
		if (t.parsedType !== B.array) return H(t, {
			code: V.invalid_type,
			expected: B.array,
			received: t.parsedType
		}), U;
		if (r.exactLength !== null) {
			let e = t.data.length > r.exactLength.value, i = t.data.length < r.exactLength.value;
			(e || i) && (H(t, {
				code: e ? V.too_big : V.too_small,
				minimum: i ? r.exactLength.value : void 0,
				maximum: e ? r.exactLength.value : void 0,
				type: "array",
				inclusive: !0,
				exact: !0,
				message: r.exactLength.message
			}), n.dirty());
		}
		if (r.minLength !== null && t.data.length < r.minLength.value && (H(t, {
			code: V.too_small,
			minimum: r.minLength.value,
			type: "array",
			inclusive: !0,
			exact: !1,
			message: r.minLength.message
		}), n.dirty()), r.maxLength !== null && t.data.length > r.maxLength.value && (H(t, {
			code: V.too_big,
			maximum: r.maxLength.value,
			type: "array",
			inclusive: !0,
			exact: !1,
			message: r.maxLength.message
		}), n.dirty()), t.common.async) return Promise.all([...t.data].map((e, n) => r.type._parseAsync(new th(t, e, t.path, n)))).then((e) => Jm.mergeArray(n, e));
		let i = [...t.data].map((e, n) => r.type._parseSync(new th(t, e, t.path, n)));
		return Jm.mergeArray(n, i);
	}
	get element() {
		return this._def.type;
	}
	min(t, n) {
		return new e({
			...this._def,
			minLength: {
				value: t,
				message: W.toString(n)
			}
		});
	}
	max(t, n) {
		return new e({
			...this._def,
			maxLength: {
				value: t,
				message: W.toString(n)
			}
		});
	}
	length(t, n) {
		return new e({
			...this._def,
			exactLength: {
				value: t,
				message: W.toString(n)
			}
		});
	}
	nonempty(e) {
		return this.min(1, e);
	}
};
Bh.create = (e, t) => new Bh({
	type: e,
	minLength: null,
	maxLength: null,
	exactLength: null,
	typeName: q.ZodArray,
	...G(t)
});
function Vh(e) {
	if (e instanceof Hh) {
		let t = {};
		for (let n in e.shape) {
			let r = e.shape[n];
			t[n] = og.create(Vh(r));
		}
		return new Hh({
			...e._def,
			shape: () => t
		});
	}
	return e instanceof Bh ? new Bh({
		...e._def,
		type: Vh(e.element)
	}) : e instanceof og ? og.create(Vh(e.unwrap())) : e instanceof sg ? sg.create(Vh(e.unwrap())) : e instanceof Jh ? Jh.create(e.items.map((e) => Vh(e))) : e;
}
var Hh = class e extends K {
	constructor() {
		super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
	}
	_getCached() {
		if (this._cached !== null) return this._cached;
		let e = this._def.shape(), t = z.objectKeys(e);
		return this._cached = {
			shape: e,
			keys: t
		}, this._cached;
	}
	_parse(e) {
		if (this._getType(e) !== B.object) {
			let t = this._getOrReturnCtx(e);
			return H(t, {
				code: V.invalid_type,
				expected: B.object,
				received: t.parsedType
			}), U;
		}
		let { status: t, ctx: n } = this._processInputParams(e), { shape: r, keys: i } = this._getCached(), a = [];
		if (!(this._def.catchall instanceof Rh && this._def.unknownKeys === "strip")) for (let e in n.data) i.includes(e) || a.push(e);
		let o = [];
		for (let e of i) {
			let t = r[e], i = n.data[e];
			o.push({
				key: {
					status: "valid",
					value: e
				},
				value: t._parse(new th(n, i, n.path, e)),
				alwaysSet: e in n.data
			});
		}
		if (this._def.catchall instanceof Rh) {
			let e = this._def.unknownKeys;
			if (e === "passthrough") for (let e of a) o.push({
				key: {
					status: "valid",
					value: e
				},
				value: {
					status: "valid",
					value: n.data[e]
				}
			});
			else if (e === "strict") a.length > 0 && (H(n, {
				code: V.unrecognized_keys,
				keys: a
			}), t.dirty());
			else if (e !== "strip") throw Error("Internal ZodObject error: invalid unknownKeys value.");
		} else {
			let e = this._def.catchall;
			for (let t of a) {
				let r = n.data[t];
				o.push({
					key: {
						status: "valid",
						value: t
					},
					value: e._parse(new th(n, r, n.path, t)),
					alwaysSet: t in n.data
				});
			}
		}
		return n.common.async ? Promise.resolve().then(async () => {
			let e = [];
			for (let t of o) {
				let n = await t.key, r = await t.value;
				e.push({
					key: n,
					value: r,
					alwaysSet: t.alwaysSet
				});
			}
			return e;
		}).then((e) => Jm.mergeObjectSync(t, e)) : Jm.mergeObjectSync(t, o);
	}
	get shape() {
		return this._def.shape();
	}
	strict(t) {
		return W.errToObj, new e({
			...this._def,
			unknownKeys: "strict",
			...t === void 0 ? {} : { errorMap: (e, n) => {
				let r = this._def.errorMap?.(e, n).message ?? n.defaultError;
				return e.code === "unrecognized_keys" ? { message: W.errToObj(t).message ?? r } : { message: r };
			} }
		});
	}
	strip() {
		return new e({
			...this._def,
			unknownKeys: "strip"
		});
	}
	passthrough() {
		return new e({
			...this._def,
			unknownKeys: "passthrough"
		});
	}
	extend(t) {
		return new e({
			...this._def,
			shape: () => ({
				...this._def.shape(),
				...t
			})
		});
	}
	merge(t) {
		return new e({
			unknownKeys: t._def.unknownKeys,
			catchall: t._def.catchall,
			shape: () => ({
				...this._def.shape(),
				...t._def.shape()
			}),
			typeName: q.ZodObject
		});
	}
	setKey(e, t) {
		return this.augment({ [e]: t });
	}
	catchall(t) {
		return new e({
			...this._def,
			catchall: t
		});
	}
	pick(t) {
		let n = {};
		for (let e of z.objectKeys(t)) t[e] && this.shape[e] && (n[e] = this.shape[e]);
		return new e({
			...this._def,
			shape: () => n
		});
	}
	omit(t) {
		let n = {};
		for (let e of z.objectKeys(this.shape)) t[e] || (n[e] = this.shape[e]);
		return new e({
			...this._def,
			shape: () => n
		});
	}
	deepPartial() {
		return Vh(this);
	}
	partial(t) {
		let n = {};
		for (let e of z.objectKeys(this.shape)) {
			let r = this.shape[e];
			n[e] = t && !t[e] ? r : r.optional();
		}
		return new e({
			...this._def,
			shape: () => n
		});
	}
	required(t) {
		let n = {};
		for (let e of z.objectKeys(this.shape)) if (t && !t[e]) n[e] = this.shape[e];
		else {
			let t = this.shape[e];
			for (; t instanceof og;) t = t._def.innerType;
			n[e] = t;
		}
		return new e({
			...this._def,
			shape: () => n
		});
	}
	keyof() {
		return tg(z.objectKeys(this.shape));
	}
};
Hh.create = (e, t) => new Hh({
	shape: () => e,
	unknownKeys: "strip",
	catchall: Rh.create(),
	typeName: q.ZodObject,
	...G(t)
}), Hh.strictCreate = (e, t) => new Hh({
	shape: () => e,
	unknownKeys: "strict",
	catchall: Rh.create(),
	typeName: q.ZodObject,
	...G(t)
}), Hh.lazycreate = (e, t) => new Hh({
	shape: e,
	unknownKeys: "strip",
	catchall: Rh.create(),
	typeName: q.ZodObject,
	...G(t)
});
var Uh = class extends K {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = this._def.options;
		function r(e) {
			for (let t of e) if (t.result.status === "valid") return t.result;
			for (let n of e) if (n.result.status === "dirty") return t.common.issues.push(...n.ctx.common.issues), n.result;
			let n = e.map((e) => new Um(e.ctx.common.issues));
			return H(t, {
				code: V.invalid_union,
				unionErrors: n
			}), U;
		}
		if (t.common.async) return Promise.all(n.map(async (e) => {
			let n = {
				...t,
				common: {
					...t.common,
					issues: []
				},
				parent: null
			};
			return {
				result: await e._parseAsync({
					data: t.data,
					path: t.path,
					parent: n
				}),
				ctx: n
			};
		})).then(r);
		{
			let e, r = [];
			for (let i of n) {
				let n = {
					...t,
					common: {
						...t.common,
						issues: []
					},
					parent: null
				}, a = i._parseSync({
					data: t.data,
					path: t.path,
					parent: n
				});
				if (a.status === "valid") return a;
				a.status === "dirty" && !e && (e = {
					result: a,
					ctx: n
				}), n.common.issues.length && r.push(n.common.issues);
			}
			if (e) return t.common.issues.push(...e.ctx.common.issues), e.result;
			let i = r.map((e) => new Um(e));
			return H(t, {
				code: V.invalid_union,
				unionErrors: i
			}), U;
		}
	}
	get options() {
		return this._def.options;
	}
};
Uh.create = (e, t) => new Uh({
	options: e,
	typeName: q.ZodUnion,
	...G(t)
});
var Wh = (e) => e instanceof $h ? Wh(e.schema) : e instanceof ag ? Wh(e.innerType()) : e instanceof eg ? [e.value] : e instanceof ng ? e.options : e instanceof rg ? z.objectValues(e.enum) : e instanceof cg ? Wh(e._def.innerType) : e instanceof Ph ? [void 0] : e instanceof Fh ? [null] : e instanceof og ? [void 0, ...Wh(e.unwrap())] : e instanceof sg ? [null, ...Wh(e.unwrap())] : e instanceof dg || e instanceof pg ? Wh(e.unwrap()) : e instanceof lg ? Wh(e._def.innerType) : [], Gh = class e extends K {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		if (t.parsedType !== B.object) return H(t, {
			code: V.invalid_type,
			expected: B.object,
			received: t.parsedType
		}), U;
		let n = this.discriminator, r = t.data[n], i = this.optionsMap.get(r);
		return i ? t.common.async ? i._parseAsync({
			data: t.data,
			path: t.path,
			parent: t
		}) : i._parseSync({
			data: t.data,
			path: t.path,
			parent: t
		}) : (H(t, {
			code: V.invalid_union_discriminator,
			options: Array.from(this.optionsMap.keys()),
			path: [n]
		}), U);
	}
	get discriminator() {
		return this._def.discriminator;
	}
	get options() {
		return this._def.options;
	}
	get optionsMap() {
		return this._def.optionsMap;
	}
	static create(t, n, r) {
		let i = /* @__PURE__ */ new Map();
		for (let e of n) {
			let n = Wh(e.shape[t]);
			if (!n.length) throw Error(`A discriminator value for key \`${t}\` could not be extracted from all schema options`);
			for (let r of n) {
				if (i.has(r)) throw Error(`Discriminator property ${String(t)} has duplicate value ${String(r)}`);
				i.set(r, e);
			}
		}
		return new e({
			typeName: q.ZodDiscriminatedUnion,
			discriminator: t,
			options: n,
			optionsMap: i,
			...G(r)
		});
	}
};
function Kh(e, t) {
	let n = Hm(e), r = Hm(t);
	if (e === t) return {
		valid: !0,
		data: e
	};
	if (n === B.object && r === B.object) {
		let n = z.objectKeys(t), r = z.objectKeys(e).filter((e) => n.indexOf(e) !== -1), i = {
			...e,
			...t
		};
		for (let n of r) {
			let r = Kh(e[n], t[n]);
			if (!r.valid) return { valid: !1 };
			i[n] = r.data;
		}
		return {
			valid: !0,
			data: i
		};
	}
	if (n === B.array && r === B.array) {
		if (e.length !== t.length) return { valid: !1 };
		let n = [];
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = t[r], o = Kh(i, a);
			if (!o.valid) return { valid: !1 };
			n.push(o.data);
		}
		return {
			valid: !0,
			data: n
		};
	}
	return n === B.date && r === B.date && +e == +t ? {
		valid: !0,
		data: e
	} : { valid: !1 };
}
var qh = class extends K {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e), r = (e, r) => {
			if (Zm(e) || Zm(r)) return U;
			let i = Kh(e.value, r.value);
			return i.valid ? ((Qm(e) || Qm(r)) && t.dirty(), {
				status: t.value,
				value: i.data
			}) : (H(n, { code: V.invalid_intersection_types }), U);
		};
		return n.common.async ? Promise.all([this._def.left._parseAsync({
			data: n.data,
			path: n.path,
			parent: n
		}), this._def.right._parseAsync({
			data: n.data,
			path: n.path,
			parent: n
		})]).then(([e, t]) => r(e, t)) : r(this._def.left._parseSync({
			data: n.data,
			path: n.path,
			parent: n
		}), this._def.right._parseSync({
			data: n.data,
			path: n.path,
			parent: n
		}));
	}
};
qh.create = (e, t, n) => new qh({
	left: e,
	right: t,
	typeName: q.ZodIntersection,
	...G(n)
});
var Jh = class e extends K {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== B.array) return H(n, {
			code: V.invalid_type,
			expected: B.array,
			received: n.parsedType
		}), U;
		if (n.data.length < this._def.items.length) return H(n, {
			code: V.too_small,
			minimum: this._def.items.length,
			inclusive: !0,
			exact: !1,
			type: "array"
		}), U;
		!this._def.rest && n.data.length > this._def.items.length && (H(n, {
			code: V.too_big,
			maximum: this._def.items.length,
			inclusive: !0,
			exact: !1,
			type: "array"
		}), t.dirty());
		let r = [...n.data].map((e, t) => {
			let r = this._def.items[t] || this._def.rest;
			return r ? r._parse(new th(n, e, n.path, t)) : null;
		}).filter((e) => !!e);
		return n.common.async ? Promise.all(r).then((e) => Jm.mergeArray(t, e)) : Jm.mergeArray(t, r);
	}
	get items() {
		return this._def.items;
	}
	rest(t) {
		return new e({
			...this._def,
			rest: t
		});
	}
};
Jh.create = (e, t) => {
	if (!Array.isArray(e)) throw Error("You must pass an array of schemas to z.tuple([ ... ])");
	return new Jh({
		items: e,
		typeName: q.ZodTuple,
		rest: null,
		...G(t)
	});
};
var Yh = class e extends K {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== B.object) return H(n, {
			code: V.invalid_type,
			expected: B.object,
			received: n.parsedType
		}), U;
		let r = [], i = this._def.keyType, a = this._def.valueType;
		for (let e in n.data) r.push({
			key: i._parse(new th(n, e, n.path, e)),
			value: a._parse(new th(n, n.data[e], n.path, e)),
			alwaysSet: e in n.data
		});
		return n.common.async ? Jm.mergeObjectAsync(t, r) : Jm.mergeObjectSync(t, r);
	}
	get element() {
		return this._def.valueType;
	}
	static create(t, n, r) {
		return n instanceof K ? new e({
			keyType: t,
			valueType: n,
			typeName: q.ZodRecord,
			...G(r)
		}) : new e({
			keyType: Dh.create(),
			valueType: t,
			typeName: q.ZodRecord,
			...G(n)
		});
	}
}, Xh = class extends K {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== B.map) return H(n, {
			code: V.invalid_type,
			expected: B.map,
			received: n.parsedType
		}), U;
		let r = this._def.keyType, i = this._def.valueType, a = [...n.data.entries()].map(([e, t], a) => ({
			key: r._parse(new th(n, e, n.path, [a, "key"])),
			value: i._parse(new th(n, t, n.path, [a, "value"]))
		}));
		if (n.common.async) {
			let e = /* @__PURE__ */ new Map();
			return Promise.resolve().then(async () => {
				for (let n of a) {
					let r = await n.key, i = await n.value;
					if (r.status === "aborted" || i.status === "aborted") return U;
					(r.status === "dirty" || i.status === "dirty") && t.dirty(), e.set(r.value, i.value);
				}
				return {
					status: t.value,
					value: e
				};
			});
		}
		{
			let e = /* @__PURE__ */ new Map();
			for (let n of a) {
				let r = n.key, i = n.value;
				if (r.status === "aborted" || i.status === "aborted") return U;
				(r.status === "dirty" || i.status === "dirty") && t.dirty(), e.set(r.value, i.value);
			}
			return {
				status: t.value,
				value: e
			};
		}
	}
};
Xh.create = (e, t, n) => new Xh({
	valueType: t,
	keyType: e,
	typeName: q.ZodMap,
	...G(n)
});
var Zh = class e extends K {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== B.set) return H(n, {
			code: V.invalid_type,
			expected: B.set,
			received: n.parsedType
		}), U;
		let r = this._def;
		r.minSize !== null && n.data.size < r.minSize.value && (H(n, {
			code: V.too_small,
			minimum: r.minSize.value,
			type: "set",
			inclusive: !0,
			exact: !1,
			message: r.minSize.message
		}), t.dirty()), r.maxSize !== null && n.data.size > r.maxSize.value && (H(n, {
			code: V.too_big,
			maximum: r.maxSize.value,
			type: "set",
			inclusive: !0,
			exact: !1,
			message: r.maxSize.message
		}), t.dirty());
		let i = this._def.valueType;
		function a(e) {
			let n = /* @__PURE__ */ new Set();
			for (let r of e) {
				if (r.status === "aborted") return U;
				r.status === "dirty" && t.dirty(), n.add(r.value);
			}
			return {
				status: t.value,
				value: n
			};
		}
		let o = [...n.data.values()].map((e, t) => i._parse(new th(n, e, n.path, t)));
		return n.common.async ? Promise.all(o).then((e) => a(e)) : a(o);
	}
	min(t, n) {
		return new e({
			...this._def,
			minSize: {
				value: t,
				message: W.toString(n)
			}
		});
	}
	max(t, n) {
		return new e({
			...this._def,
			maxSize: {
				value: t,
				message: W.toString(n)
			}
		});
	}
	size(e, t) {
		return this.min(e, t).max(e, t);
	}
	nonempty(e) {
		return this.min(1, e);
	}
};
Zh.create = (e, t) => new Zh({
	valueType: e,
	minSize: null,
	maxSize: null,
	typeName: q.ZodSet,
	...G(t)
});
var Qh = class e extends K {
	constructor() {
		super(...arguments), this.validate = this.implement;
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		if (t.parsedType !== B.function) return H(t, {
			code: V.invalid_type,
			expected: B.function,
			received: t.parsedType
		}), U;
		function n(e, n) {
			return qm({
				data: e,
				path: t.path,
				errorMaps: [
					t.common.contextualErrorMap,
					t.schemaErrorMap,
					Km(),
					Wm
				].filter((e) => !!e),
				issueData: {
					code: V.invalid_arguments,
					argumentsError: n
				}
			});
		}
		function r(e, n) {
			return qm({
				data: e,
				path: t.path,
				errorMaps: [
					t.common.contextualErrorMap,
					t.schemaErrorMap,
					Km(),
					Wm
				].filter((e) => !!e),
				issueData: {
					code: V.invalid_return_type,
					returnTypeError: n
				}
			});
		}
		let i = { errorMap: t.common.contextualErrorMap }, a = t.data;
		if (this._def.returns instanceof ig) {
			let e = this;
			return Xm(async function(...t) {
				let o = new Um([]), s = await e._def.args.parseAsync(t, i).catch((e) => {
					throw o.addIssue(n(t, e)), o;
				}), c = await Reflect.apply(a, this, s);
				return await e._def.returns._def.type.parseAsync(c, i).catch((e) => {
					throw o.addIssue(r(c, e)), o;
				});
			});
		}
		{
			let e = this;
			return Xm(function(...t) {
				let o = e._def.args.safeParse(t, i);
				if (!o.success) throw new Um([n(t, o.error)]);
				let s = Reflect.apply(a, this, o.data), c = e._def.returns.safeParse(s, i);
				if (!c.success) throw new Um([r(s, c.error)]);
				return c.data;
			});
		}
	}
	parameters() {
		return this._def.args;
	}
	returnType() {
		return this._def.returns;
	}
	args(...t) {
		return new e({
			...this._def,
			args: Jh.create(t).rest(Lh.create())
		});
	}
	returns(t) {
		return new e({
			...this._def,
			returns: t
		});
	}
	implement(e) {
		return this.parse(e);
	}
	strictImplement(e) {
		return this.parse(e);
	}
	static create(t, n, r) {
		return new e({
			args: t || Jh.create([]).rest(Lh.create()),
			returns: n || Lh.create(),
			typeName: q.ZodFunction,
			...G(r)
		});
	}
}, $h = class extends K {
	get schema() {
		return this._def.getter();
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		return this._def.getter()._parse({
			data: t.data,
			path: t.path,
			parent: t
		});
	}
};
$h.create = (e, t) => new $h({
	getter: e,
	typeName: q.ZodLazy,
	...G(t)
});
var eg = class extends K {
	_parse(e) {
		if (e.data !== this._def.value) {
			let t = this._getOrReturnCtx(e);
			return H(t, {
				received: t.data,
				code: V.invalid_literal,
				expected: this._def.value
			}), U;
		}
		return {
			status: "valid",
			value: e.data
		};
	}
	get value() {
		return this._def.value;
	}
};
eg.create = (e, t) => new eg({
	value: e,
	typeName: q.ZodLiteral,
	...G(t)
});
function tg(e, t) {
	return new ng({
		values: e,
		typeName: q.ZodEnum,
		...G(t)
	});
}
var ng = class e extends K {
	_parse(e) {
		if (typeof e.data != "string") {
			let t = this._getOrReturnCtx(e), n = this._def.values;
			return H(t, {
				expected: z.joinValues(n),
				received: t.parsedType,
				code: V.invalid_type
			}), U;
		}
		if (this._cache ||= new Set(this._def.values), !this._cache.has(e.data)) {
			let t = this._getOrReturnCtx(e), n = this._def.values;
			return H(t, {
				received: t.data,
				code: V.invalid_enum_value,
				options: n
			}), U;
		}
		return Xm(e.data);
	}
	get options() {
		return this._def.values;
	}
	get enum() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	get Values() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	get Enum() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	extract(t, n = this._def) {
		return e.create(t, {
			...this._def,
			...n
		});
	}
	exclude(t, n = this._def) {
		return e.create(this.options.filter((e) => !t.includes(e)), {
			...this._def,
			...n
		});
	}
};
ng.create = tg;
var rg = class extends K {
	_parse(e) {
		let t = z.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
		if (n.parsedType !== B.string && n.parsedType !== B.number) {
			let e = z.objectValues(t);
			return H(n, {
				expected: z.joinValues(e),
				received: n.parsedType,
				code: V.invalid_type
			}), U;
		}
		if (this._cache ||= new Set(z.getValidEnumValues(this._def.values)), !this._cache.has(e.data)) {
			let e = z.objectValues(t);
			return H(n, {
				received: n.data,
				code: V.invalid_enum_value,
				options: e
			}), U;
		}
		return Xm(e.data);
	}
	get enum() {
		return this._def.values;
	}
};
rg.create = (e, t) => new rg({
	values: e,
	typeName: q.ZodNativeEnum,
	...G(t)
});
var ig = class extends K {
	unwrap() {
		return this._def.type;
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		return t.parsedType !== B.promise && t.common.async === !1 ? (H(t, {
			code: V.invalid_type,
			expected: B.promise,
			received: t.parsedType
		}), U) : Xm((t.parsedType === B.promise ? t.data : Promise.resolve(t.data)).then((e) => this._def.type.parseAsync(e, {
			path: t.path,
			errorMap: t.common.contextualErrorMap
		})));
	}
};
ig.create = (e, t) => new ig({
	type: e,
	typeName: q.ZodPromise,
	...G(t)
});
var ag = class extends K {
	innerType() {
		return this._def.schema;
	}
	sourceType() {
		return this._def.schema._def.typeName === q.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
	}
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e), r = this._def.effect || null, i = {
			addIssue: (e) => {
				H(n, e), e.fatal ? t.abort() : t.dirty();
			},
			get path() {
				return n.path;
			}
		};
		if (i.addIssue = i.addIssue.bind(i), r.type === "preprocess") {
			let e = r.transform(n.data, i);
			if (n.common.async) return Promise.resolve(e).then(async (e) => {
				if (t.value === "aborted") return U;
				let r = await this._def.schema._parseAsync({
					data: e,
					path: n.path,
					parent: n
				});
				return r.status === "aborted" ? U : r.status === "dirty" || t.value === "dirty" ? Ym(r.value) : r;
			});
			{
				if (t.value === "aborted") return U;
				let r = this._def.schema._parseSync({
					data: e,
					path: n.path,
					parent: n
				});
				return r.status === "aborted" ? U : r.status === "dirty" || t.value === "dirty" ? Ym(r.value) : r;
			}
		}
		if (r.type === "refinement") {
			let e = (e) => {
				let t = r.refinement(e, i);
				if (n.common.async) return Promise.resolve(t);
				if (t instanceof Promise) throw Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
				return e;
			};
			if (n.common.async === !1) {
				let r = this._def.schema._parseSync({
					data: n.data,
					path: n.path,
					parent: n
				});
				return r.status === "aborted" ? U : (r.status === "dirty" && t.dirty(), e(r.value), {
					status: t.value,
					value: r.value
				});
			}
			return this._def.schema._parseAsync({
				data: n.data,
				path: n.path,
				parent: n
			}).then((n) => n.status === "aborted" ? U : (n.status === "dirty" && t.dirty(), e(n.value).then(() => ({
				status: t.value,
				value: n.value
			}))));
		}
		if (r.type === "transform") {
			if (n.common.async === !1) {
				let e = this._def.schema._parseSync({
					data: n.data,
					path: n.path,
					parent: n
				});
				if (!$m(e)) return U;
				let a = r.transform(e.value, i);
				if (a instanceof Promise) throw Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
				return {
					status: t.value,
					value: a
				};
			}
			return this._def.schema._parseAsync({
				data: n.data,
				path: n.path,
				parent: n
			}).then((e) => $m(e) ? Promise.resolve(r.transform(e.value, i)).then((e) => ({
				status: t.value,
				value: e
			})) : U);
		}
		z.assertNever(r);
	}
};
ag.create = (e, t, n) => new ag({
	schema: e,
	typeName: q.ZodEffects,
	effect: t,
	...G(n)
}), ag.createWithPreprocess = (e, t, n) => new ag({
	schema: t,
	effect: {
		type: "preprocess",
		transform: e
	},
	typeName: q.ZodEffects,
	...G(n)
});
var og = class extends K {
	_parse(e) {
		return this._getType(e) === B.undefined ? Xm(void 0) : this._def.innerType._parse(e);
	}
	unwrap() {
		return this._def.innerType;
	}
};
og.create = (e, t) => new og({
	innerType: e,
	typeName: q.ZodOptional,
	...G(t)
});
var sg = class extends K {
	_parse(e) {
		return this._getType(e) === B.null ? Xm(null) : this._def.innerType._parse(e);
	}
	unwrap() {
		return this._def.innerType;
	}
};
sg.create = (e, t) => new sg({
	innerType: e,
	typeName: q.ZodNullable,
	...G(t)
});
var cg = class extends K {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = t.data;
		return t.parsedType === B.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
			data: n,
			path: t.path,
			parent: t
		});
	}
	removeDefault() {
		return this._def.innerType;
	}
};
cg.create = (e, t) => new cg({
	innerType: e,
	typeName: q.ZodDefault,
	defaultValue: typeof t.default == "function" ? t.default : () => t.default,
	...G(t)
});
var lg = class extends K {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = {
			...t,
			common: {
				...t.common,
				issues: []
			}
		}, r = this._def.innerType._parse({
			data: n.data,
			path: n.path,
			parent: { ...n }
		});
		return eh(r) ? r.then((e) => ({
			status: "valid",
			value: e.status === "valid" ? e.value : this._def.catchValue({
				get error() {
					return new Um(n.common.issues);
				},
				input: n.data
			})
		})) : {
			status: "valid",
			value: r.status === "valid" ? r.value : this._def.catchValue({
				get error() {
					return new Um(n.common.issues);
				},
				input: n.data
			})
		};
	}
	removeCatch() {
		return this._def.innerType;
	}
};
lg.create = (e, t) => new lg({
	innerType: e,
	typeName: q.ZodCatch,
	catchValue: typeof t.catch == "function" ? t.catch : () => t.catch,
	...G(t)
});
var ug = class extends K {
	_parse(e) {
		if (this._getType(e) !== B.nan) {
			let t = this._getOrReturnCtx(e);
			return H(t, {
				code: V.invalid_type,
				expected: B.nan,
				received: t.parsedType
			}), U;
		}
		return {
			status: "valid",
			value: e.data
		};
	}
};
ug.create = (e) => new ug({
	typeName: q.ZodNaN,
	...G(e)
});
var dg = class extends K {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = t.data;
		return this._def.type._parse({
			data: n,
			path: t.path,
			parent: t
		});
	}
	unwrap() {
		return this._def.type;
	}
}, fg = class e extends K {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.common.async) return (async () => {
			let e = await this._def.in._parseAsync({
				data: n.data,
				path: n.path,
				parent: n
			});
			return e.status === "aborted" ? U : e.status === "dirty" ? (t.dirty(), Ym(e.value)) : this._def.out._parseAsync({
				data: e.value,
				path: n.path,
				parent: n
			});
		})();
		{
			let e = this._def.in._parseSync({
				data: n.data,
				path: n.path,
				parent: n
			});
			return e.status === "aborted" ? U : e.status === "dirty" ? (t.dirty(), {
				status: "dirty",
				value: e.value
			}) : this._def.out._parseSync({
				data: e.value,
				path: n.path,
				parent: n
			});
		}
	}
	static create(t, n) {
		return new e({
			in: t,
			out: n,
			typeName: q.ZodPipeline
		});
	}
}, pg = class extends K {
	_parse(e) {
		let t = this._def.innerType._parse(e), n = (e) => ($m(e) && (e.value = Object.freeze(e.value)), e);
		return eh(t) ? t.then((e) => n(e)) : n(t);
	}
	unwrap() {
		return this._def.innerType;
	}
};
pg.create = (e, t) => new pg({
	innerType: e,
	typeName: q.ZodReadonly,
	...G(t)
}), Hh.lazycreate;
var q;
(function(e) {
	e.ZodString = "ZodString", e.ZodNumber = "ZodNumber", e.ZodNaN = "ZodNaN", e.ZodBigInt = "ZodBigInt", e.ZodBoolean = "ZodBoolean", e.ZodDate = "ZodDate", e.ZodSymbol = "ZodSymbol", e.ZodUndefined = "ZodUndefined", e.ZodNull = "ZodNull", e.ZodAny = "ZodAny", e.ZodUnknown = "ZodUnknown", e.ZodNever = "ZodNever", e.ZodVoid = "ZodVoid", e.ZodArray = "ZodArray", e.ZodObject = "ZodObject", e.ZodUnion = "ZodUnion", e.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", e.ZodIntersection = "ZodIntersection", e.ZodTuple = "ZodTuple", e.ZodRecord = "ZodRecord", e.ZodMap = "ZodMap", e.ZodSet = "ZodSet", e.ZodFunction = "ZodFunction", e.ZodLazy = "ZodLazy", e.ZodLiteral = "ZodLiteral", e.ZodEnum = "ZodEnum", e.ZodEffects = "ZodEffects", e.ZodNativeEnum = "ZodNativeEnum", e.ZodOptional = "ZodOptional", e.ZodNullable = "ZodNullable", e.ZodDefault = "ZodDefault", e.ZodCatch = "ZodCatch", e.ZodPromise = "ZodPromise", e.ZodBranded = "ZodBranded", e.ZodPipeline = "ZodPipeline", e.ZodReadonly = "ZodReadonly";
})(q ||= {});
var J = Dh.create, Y = kh.create;
ug.create, Ah.create;
var mg = jh.create;
Mh.create, Nh.create, Ph.create, Fh.create;
var hg = Ih.create, gg = Lh.create;
Rh.create, zh.create;
var X = Bh.create, Z = Hh.create;
Hh.strictCreate;
var _g = Uh.create;
Gh.create;
var vg = qh.create;
Jh.create;
var yg = Yh.create;
Xh.create, Zh.create, Qh.create;
var bg = $h.create, xg = eg.create, Q = ng.create;
rg.create, ig.create, ag.create, og.create, sg.create, ag.createWithPreprocess, fg.create;
var Sg = {
	string: ((e) => Dh.create({
		...e,
		coerce: !0
	})),
	number: ((e) => kh.create({
		...e,
		coerce: !0
	})),
	boolean: ((e) => jh.create({
		...e,
		coerce: !0
	})),
	bigint: ((e) => Ah.create({
		...e,
		coerce: !0
	})),
	date: ((e) => Mh.create({
		...e,
		coerce: !0
	}))
}, Cg = class extends Error {
	constructor(e, t = "UNKNOWN_ERROR") {
		super(e), this.name = this.constructor.name, this.code = t, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
	}
}, $ = class extends Cg {
	constructor(e, t, n = "VALIDATION_ERROR") {
		super(e, n), this.details = t;
	}
}, wg = class extends Cg {
	constructor(e, t) {
		super(e, "DATA_ERROR"), this.path = t;
	}
}, Tg = class extends Cg {
	constructor(e, t, n) {
		super(e, "EXPRESSION_ERROR"), this.expression = t, this.details = n;
	}
}, Eg = class extends Cg {
	constructor(e) {
		super(e, "STATE_ERROR");
	}
}, Dg = class extends Cg {
	constructor(e, t = "CATALOG_ERROR") {
		super(e, t);
	}
}, Og = class extends $ {
	constructor(e, t, n = "INTEGRITY_ERROR") {
		super(e, t, n), this.name = "A2uiIntegrityError";
	}
}, kg = class extends $ {
	constructor(e, t, n = "RECURSION_ERROR") {
		super(e, t, n), this.name = "A2uiRecursionError";
	}
}, Ag;
(function(e) {
	e.INVALID_FUNCTION_CALL = "INVALID_FUNCTION_CALL", e.EXECUTION_ERROR = "EXECUTION_ERROR", e.UNKNOWN_FUNCTION = "UNKNOWN_FUNCTION", e.UNKNOWN_ERROR = "UNKNOWN_ERROR", e.TIMEOUT = "TIMEOUT", e.CANCELLED = "CANCELLED", e.DISPOSED = "DISPOSED", e.DUPLICATE = "DUPLICATE", e.NO_LISTENER = "NO_LISTENER";
})(Ag ||= {});
var jg = class extends Cg {
	constructor(e, t = Ag.UNKNOWN_ERROR, n, r) {
		let i = t || Ag.UNKNOWN_ERROR;
		super(`[${i}] ${e}`, i), this.functionCallId = n, this.details = r, this.name = "A2uiRpcError";
	}
};
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/types/child-ref-helpers.js
function Mg(e, t) {
	return e._def.a2uiChildRef = t, e;
}
function Ng(e) {
	return e?._def?.a2uiChildRef;
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/types/helpers.js
var Pg = 1e3;
Z({
	component: J().describe("The type name of the component."),
	id: bg(() => Fg).optional(),
	weight: Y().optional()
}).passthrough().describe("A generic A2UI component definition.");
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/types/common-types.js
var Fg = Mg(J().describe("REF:common_types.json#/$defs/ComponentId|The unique identifier for a component, used for both definitions and references within the same surface."), "component-id"), Ig = Z({ path: J().describe("A JSON Pointer path to a value in the data model.") }).describe("REF:common_types.json#/$defs/DataBinding"), Lg = Z({
	call: J().describe("The name of the function to call."),
	args: yg(J(), gg()).describe("Arguments passed to the function.").optional(),
	returnType: Q([
		"string",
		"number",
		"boolean",
		"array",
		"object",
		"any",
		"void"
	]).describe("The expected return type of the function call.").optional(),
	catalogId: J().describe("The catalog ID for this function, overriding any surface-level default catalogId.").optional()
}).describe("REF:common_types.json#/$defs/FunctionCall|Invokes a named function, combining common function properties with the catalog function definition."), Rg = _g([
	J(),
	Ig,
	Lg
]).describe("REF:common_types.json#/$defs/DynamicString|Represents a string"), zg = _g([
	mg(),
	Ig,
	Lg
]).describe("REF:common_types.json#/$defs/DynamicBoolean|A boolean value that can be a literal, a path, or a function call returning a boolean."), Bg = Z({
	label: Rg.optional(),
	description: Rg.optional(),
	live: Q([
		"off",
		"polite",
		"assertive"
	]).default("off").describe("Controls screen reader announcements for dynamic updates (WAI-ARIA aria-live). 'polite' waits for user pause; 'assertive' interrupts immediately for alerts.").optional(),
	hidden: zg.optional()
}).describe("REF:common_types.json#/$defs/AccessibilityAttributes|Attributes to enhance accessibility when using assistive technologies like screen readers or model understanding."), Vg = yg(J(), gg()).superRefine((e, t) => {
	for (let n in e) n.match(/^[\p{XID_Start}_][\p{XID_Continue}]*$/u) || t.addIssue({
		path: [n],
		code: V.custom,
		message: `Invalid extension key "${n}": Keys MUST be Unicode identifiers (UAX #31).`
	});
}).describe("REF:#/$defs/Extensions|Optional extension metadata. Keys MUST be Unicode identifiers (UAX #31). Keys starting with 'a2ui_' are reserved for official extensions.");
Z({
	id: Fg,
	accessibility: Bg.optional(),
	catalogId: J().describe("The catalog ID for this component, overriding any surface-level default catalogId.").optional(),
	metadata: Z({ extensions: Vg.optional() }).strict().describe("Optional component-level metadata for vendor extensions.").optional()
}).describe("REF:common_types.json#/$defs/ComponentCommon");
var Hg = Mg(_g([X(Fg).describe("A static list of child component IDs."), Z({
	componentId: Fg,
	path: J().describe("The path to the list of component property objects in the data model.")
}).describe("A template for generating a dynamic list of children.")]).describe("REF:common_types.json#/$defs/ChildList"), "child-list"), Ug = _g([
	J(),
	Y(),
	mg(),
	X(gg()),
	Ig,
	Lg,
	yg(J(), gg()).refine((e) => !e || !("path" in e) && !("call" in e))
]).describe("REF:common_types.json#/$defs/DynamicValue|A value that can be a literal, a path, or a function call returning any type."), Wg = _g([
	Y(),
	Ig,
	Lg
]).describe("REF:common_types.json#/$defs/DynamicNumber|Represents a value that can be either a literal number, a path to a number in the data model, or a function call returning a number."), Gg = _g([
	X(J()),
	Ig,
	Lg
]).describe("REF:common_types.json#/$defs/DynamicStringList|Represents a value that can be either a literal array of strings, a path to a string array in the data model, or a function call returning a string array."), Kg = Z({
	condition: _g([
		zg,
		Ig,
		Lg
	]).describe("Path or function call evaluating to a structured validation result object."),
	message: J().describe("Optional fallback error message.").optional()
}).describe("REF:common_types.json#/$defs/CheckRule|A single validation check rule applied to an input component. The condition function or path evaluates to a structured validation result object."), qg = Z({ checks: X(Kg).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional() }).describe("REF:common_types.json#/$defs/Checkable|Properties for components that support renderer-side checks."), Jg = _g([
	Z({ event: Z({
		name: J().describe("The name of the action to be dispatched to the server."),
		context: yg(J(), gg()).describe("A JSON object containing the key-value pairs for the action context. Values can be literals or paths. Use literal values unless the value must be dynamically bound to the data model. Do NOT use paths for static IDs.").optional()
	}).strict().describe("The event to dispatch to the server.") }).strict().describe("Triggers a server-side event."),
	Z({ functionCall: Lg }).strict().describe("Executes a local client-side function."),
	Z({ event: Z({
		name: J().describe("The name of the action to be dispatched to the agent."),
		userMessage: Rg.optional(),
		context: yg(J(), gg()).describe("A JSON object containing the key-value pairs for the action context. Values can be literals or paths. Use literal values unless the value must be dynamically bound to the data model. Do NOT use paths for static IDs.").optional()
	}).strict().describe("The event to dispatch to the agent.") }).strict().describe("Triggers an agent-side event."),
	Z({ functionCall: Lg }).strict().describe("Executes a renderer or agent-side function.")
]).describe("REF:common_types.json#/$defs/Action|Defines an interaction handler that can either trigger an agent-side event or execute a local renderer-side function."), Yg = J().describe("REF:common_types.json#/$defs/CallId|The unique identifier for a function call.");
Z({
	call: J().describe("The name of the function to call."),
	catalogId: J().describe("The catalog ID for this function, overriding any surface-level default catalogId.").optional()
}).describe("REF:common_types.json#/$defs/FunctionCommon|Baseline envelope properties common to all function calls. Function-specific argument schemas (\\'args\\') are defined individually by each function in the active catalog."), Z({
	call: xg("@index"),
	args: Z({ offset: Wg.optional() }).strict().optional()
}).strict().describe("REF:common_types.json#/$defs/IndexSystemFunction|Returns the 0-based index of the current item when rendering a dynamic list from a template. This function MUST ONLY be available when evaluating template items within a list context."), Z({
	component: xg("Surface").optional(),
	child: xg("root").optional()
}).strict().describe("REF:common_types.json#/$defs/Surface|The reserved canonical container component representing an A2UI surface. The Surface component is immutable and always has \\'child\\': \\'root\\'."), Z({
	functionCallId: Yg,
	value: gg().describe("The return value of the function.").optional(),
	error: Z({
		code: J(),
		message: J()
	}).strict().describe("An error object indicating failure of the function execution.").optional()
}).strict().describe("REF:common_types.json#/$defs/FunctionResponse|The return response matching a callAgentFunction or callRendererFunction invocation.");
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/common/semver.js
var Xg = /^[vV]?(0|[1-9]\d*)\.(0|[1-9]\d*)(?:\.(0|[1-9]\d*))?(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
function Zg(e) {
	if (!e || typeof e != "string") return "";
	let t = e.trim().replace(/^[vV]/, ""), n = t.indexOf("-"), r = t.indexOf("+"), i = t.length;
	return n !== -1 && r !== -1 ? i = Math.min(n, r) : n === -1 ? r !== -1 && (i = r) : i = n, `${t.slice(0, i).replace(/_/g, ".")}${t.slice(i)}`;
}
function Qg(e) {
	if (!e || typeof e != "string") return null;
	let t = e.trim().match(Xg);
	return t ? {
		major: parseInt(t[1], 10),
		minor: parseInt(t[2], 10),
		patch: t[3] === void 0 ? 0 : parseInt(t[3], 10),
		prerelease: t[4] ? t[4].split(".") : [],
		build: t[5] ? t[5].split(".") : []
	} : null;
}
function $g(e) {
	if (!e) return null;
	if (typeof e == "object") {
		let t = e;
		return typeof t.major != "number" || !Number.isInteger(t.major) || t.major < 0 || typeof t.minor == "number" && (!Number.isInteger(t.minor) || t.minor < 0) || typeof t.patch == "number" && (!Number.isInteger(t.patch) || t.patch < 0) ? null : {
			major: t.major,
			minor: typeof t.minor == "number" ? t.minor : 0,
			patch: typeof t.patch == "number" ? t.patch : 0,
			prerelease: Array.isArray(t.prerelease) ? t.prerelease : [],
			build: Array.isArray(t.build) ? t.build : []
		};
	}
	return Qg(Zg(e));
}
function e_(e) {
	if (!e) return null;
	let t = $g(e);
	if (!t) return null;
	if (t.patch === 0 && t.prerelease.length === 0 && t.build.length === 0) return `${t.major}.${t.minor}`;
	let n = t.prerelease.length > 0 ? `-${t.prerelease.join(".")}` : "", r = t.build.length > 0 ? `+${t.build.join(".")}` : "";
	return `${t.major}.${t.minor}.${t.patch}${n}${r}`;
}
function t_(e, t) {
	let n = /^\d+$/.test(e), r = /^\d+$/.test(t);
	return n && r ? e.length === t.length ? e < t ? -1 : +(e > t) : e.length - t.length : n ? -1 : r ? 1 : e < t ? -1 : +(e > t);
}
function n_(e, t) {
	if (e.length === 0 && t.length === 0) return 0;
	if (e.length === 0) return 1;
	if (t.length === 0) return -1;
	let n = Math.min(e.length, t.length);
	for (let r = 0; r < n; r++) {
		let n = t_(e[r], t[r]);
		if (n !== 0) return n;
	}
	return e.length - t.length;
}
function r_(e, t) {
	let n = $g(e), r = $g(t);
	return !n && !r ? 0 : n ? r ? n.major === r.major ? n.minor === r.minor ? n.patch === r.patch ? n_(n.prerelease, r.prerelease) : n.patch - r.patch : n.minor - r.minor : n.major - r.major : 1 : -1;
}
function i_(e, t) {
	if (!e) return !1;
	let n = $g(e), r = $g(t);
	return !n || !r ? !1 : r_(n, r) >= 0;
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/common/uax31.js
var a_ = /^[\p{XID_Start}_][\p{XID_Continue}]*$/u;
function o_(e) {
	if (!e) return !1;
	let t = e.startsWith("@") ? e.slice(1) : e;
	return a_.test(t);
}
function s_(e, t) {
	if (!o_(e)) throw new Dg(`Invalid UAX #31 ${t}`);
}
var c_ = {
	DynamicString: Rg,
	DynamicNumber: Wg,
	DynamicBoolean: zg,
	DynamicStringList: Gg,
	DynamicValue: Ug,
	ComponentId: Fg,
	ChildList: Hg,
	Action: Jg,
	CheckRule: Kg,
	Checkable: qg,
	AccessibilityAttributes: Bg,
	DataBinding: Ig,
	FunctionCall: Lg
};
function l_(e, t) {
	if (!t.startsWith("#/")) return;
	let n = t.slice(2).split("/").map((e) => e.replace(/~1/g, "/").replace(/~0/g, "~")), r = e;
	for (let e of n) if (r && typeof r == "object" && e in r) r = r[e];
	else return;
	return typeof r == "object" && r ? r : void 0;
}
function u_(e) {
	let t = e.split(/#\/(?:\$defs|definitions)\//)[1];
	return t ? c_[t] : void 0;
}
function d_(e) {
	return e.length === 0 ? gg() : e.every((e) => typeof e == "string") ? Q(e) : e.length === 1 ? xg(e[0]) : _g(e.map((e) => xg(e)));
}
function f_(e) {
	return typeof e != "object" || !e ? JSON.stringify(e) : Array.isArray(e) ? `[${e.map(f_).join(",")}]` : `{${Object.keys(e).sort().map((t) => `${JSON.stringify(t)}:${f_(e[t])}`).join(",")}}`;
}
function p_(e, t, n, r, i) {
	let a = e;
	if (t.not && typeof t.not == "object") {
		let e = g_(t.not, n, new Set(r), i);
		a = a.refine((t) => !e.safeParse(t).success, { message: "Value matched prohibited \"not\" schema" });
	}
	return t.default !== void 0 && (a = a.default(t.default)), typeof t.description == "string" && (a = a.describe(t.description)), a;
}
function m_(e, t, n, r, i) {
	let a = u_(e);
	if (a) {
		let n = e.split(/#\/(?:\$defs|definitions)\//)[1], r = typeof t.description == "string" ? `REF:common_types.json#/$defs/${n}|${t.description}` : a.description;
		return r ? a.describe(r) : a;
	}
	if (n && e.startsWith("#/")) {
		let a = l_(n, e);
		if (!a) return gg().superRefine((t, n) => {
			n.addIssue({
				code: V.custom,
				message: `Unresolvable schema reference: '${e}'`
			});
		});
		if (r.has(e)) {
			let t = i.get(e);
			return bg(() => (t || (t = i.get(e) ?? g_(a, n, /* @__PURE__ */ new Set([e]), i), i.set(e, t)), t));
		}
		let o = i.get(e);
		if (!o) {
			let t = new Set(r);
			t.add(e), o = g_(a, n, t, i), i.set(e, o);
		}
		return typeof t.description == "string" && (o = o.describe(t.description)), o;
	}
}
function h_(e, t, n, r) {
	let i = Array.isArray(e.oneOf), a = (e.oneOf || e.anyOf).filter((e) => typeof e == "object" && !!e);
	if (a.length === 0) return;
	let o = a.find((e) => Array.isArray(e.enum)), s = a.some((e) => typeof e.$ref == "string" && e.$ref.includes("DataBinding")), c = a.map((e) => g_(e, t, new Set(n), r)), l;
	if (c.length === 1) l = c[0];
	else {
		let e = _g([
			c[0],
			c[1],
			...c.slice(2)
		]);
		l = i ? hg().superRefine((e, t) => {
			let n = 0;
			for (let r of c) if (r.safeParse(e).success && ++n > 1) {
				t.addIssue({
					code: V.custom,
					message: "Value matched more than one schema in oneOf"
				});
				return;
			}
		}).pipe(e) : e;
	}
	e.default !== void 0 && (l = l.default(e.default));
	let u = (typeof e.description == "string" ? e.description : void 0) || (o && s ? "REF:common_types.json#/$defs/DynamicString" : void 0);
	return u ? l.describe(u) : l;
}
function g_(e, t, n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map()) {
	if (!e || typeof e != "object") return gg();
	if (e.$ref && typeof e.$ref == "string") {
		let i = m_(e.$ref, e, t, n, r);
		if (i) return i;
	}
	if (Array.isArray(e.oneOf) || Array.isArray(e.anyOf)) {
		let i = h_(e, t, n, r);
		if (i) return i;
	}
	if (e.const !== void 0) return p_(xg(e.const), e, t, n, r);
	if (Array.isArray(e.enum) && e.enum.length > 0) return p_(d_(e.enum), e, t, n, r);
	if (e.type === "array") {
		let i = X(e.items && typeof e.items == "object" ? g_(e.items, t, new Set(n), r) : gg());
		return typeof e.minItems == "number" && (i = i.min(e.minItems)), typeof e.maxItems == "number" && (i = i.max(e.maxItems)), e.uniqueItems === !0 && (i = i.refine((e) => new Set(e.map(f_)).size === e.length, { message: "Array items must be unique" })), p_(i, e, t, n, r);
	}
	switch (e.type) {
		case "string": {
			let i = J();
			if (typeof e.minLength == "number" && (i = i.min(e.minLength)), typeof e.maxLength == "number" && (i = i.max(e.maxLength)), typeof e.pattern == "string") try {
				i = i.regex(new RegExp(e.pattern, "u"));
			} catch {}
			return p_(i, e, t, n, r);
		}
		case "integer":
		case "number": {
			let i = e.type === "integer" ? Y().int() : Y();
			return typeof e.minimum == "number" && (i = i.min(e.minimum)), typeof e.maximum == "number" && (i = i.max(e.maximum)), typeof e.exclusiveMinimum == "number" && (i = i.gt(e.exclusiveMinimum)), typeof e.exclusiveMaximum == "number" && (i = i.lt(e.exclusiveMaximum)), typeof e.multipleOf == "number" && (i = i.multipleOf(e.multipleOf)), p_(i, e, t, n, r);
		}
		case "boolean": return p_(mg(), e, t, n, r);
		case "object": {
			let i = e.properties, a;
			if (typeof i == "object" && i) {
				let o = Z(__(i, Array.isArray(e.required) ? new Set(e.required.filter((e) => typeof e == "string")) : /* @__PURE__ */ new Set(), !1, t, n, r));
				a = e.additionalProperties === !1 || e.unevaluatedProperties === !1 ? o.strict() : o.passthrough();
			} else a = yg(gg());
			return p_(a, e, t, n, r);
		}
		default: return p_(gg(), e, t, n, r);
	}
}
function __(e, t, n = !1, r, i, a = /* @__PURE__ */ new Map()) {
	let o = {};
	for (let [s, c] of Object.entries(e)) {
		if (n && (s === "component" || s === "id")) continue;
		let e = g_(typeof c == "object" && c ? c : {}, r, i ? new Set(i) : /* @__PURE__ */ new Set(), a);
		o[s] = t.has(s) ? e : e.optional();
	}
	return o;
}
function v_(e, t, n = /* @__PURE__ */ new Set()) {
	let r = [];
	if (!e || typeof e != "object") return r;
	if (Array.isArray(e.allOf)) {
		for (let i of e.allOf) if (i && typeof i == "object") {
			if (typeof i.$ref == "string") {
				let e = i.$ref;
				if (e.includes("common_types.json") && e.includes("ComponentCommon")) r.push({ properties: { accessibility: Bg.optional() } });
				else if (e.startsWith("#/") && !n.has(e)) {
					n.add(e);
					let i = l_(t, e);
					i && r.push(...v_(i, t, n));
				}
			} else r.push(...v_(i, t, n));
		}
	}
	return e.properties && r.push(e), r;
}
function y_(e, t, n = !0, r = /* @__PURE__ */ new Map()) {
	let i = {}, a = v_(e, t), o = /* @__PURE__ */ new Set();
	for (let e of a) Array.isArray(e.required) && e.required.forEach((e) => {
		typeof e == "string" && o.add(e);
	});
	for (let e of a) {
		let a = __(e.properties || {}, o, n, t, void 0, r);
		Object.assign(i, a);
	}
	let s = Z(i);
	return e.unevaluatedProperties === !0 || typeof e.unevaluatedProperties == "object" && e.unevaluatedProperties !== null || e.additionalProperties === !0 || typeof e.additionalProperties == "object" && e.additionalProperties !== null ? s.passthrough() : s.strict();
}
function b_(e, t, n = /* @__PURE__ */ new Map()) {
	let r = new Set(Array.isArray(e.required) ? e.required.filter((e) => typeof e == "string") : []), i = Z(__(e.properties || {}, r, !1, t, void 0, n));
	return e.unevaluatedProperties === !0 || typeof e.unevaluatedProperties == "object" && e.unevaluatedProperties !== null || e.additionalProperties === !0 || typeof e.additionalProperties == "object" && e.additionalProperties !== null ? i.passthrough() : i.strict();
}
function x_(e, t, n, r = !1) {
	let i = [];
	if (!e) return i;
	let a = /* @__PURE__ */ new Map(), o = (e, t) => {
		if (r && (s_(e, `function identifier: '${e}'`), t && typeof t == "object")) for (let n of Object.keys(t)) s_(n, `argument identifier: '${n}' in function '${e}'`);
	};
	if (Array.isArray(e)) {
		for (let r of e) if (r && typeof r == "object" && typeof r.name == "string") {
			if (o(r.name, r.parameters), n && !n.has(r.name)) continue;
			let e = r.parameters && typeof r.parameters == "object" ? b_(r.parameters, t, a) : yg(gg());
			i.push({
				name: r.name,
				description: typeof r.description == "string" ? r.description : void 0,
				returnType: typeof r.returnType == "string" ? r.returnType : "any",
				allowedCallers: r.allowedCallers,
				requiresUserActivation: r.requiresUserActivation,
				schema: e
			});
		}
		return i;
	}
	if (typeof e == "object" && e) for (let [r, s] of Object.entries(e)) {
		let e = s && typeof s == "object" ? s : {};
		if (o(r, e.properties && typeof e.properties == "object" ? e.properties : e.parameters), n && !n.has(r) || !s || typeof s != "object") continue;
		let c = s, l = c.properties, u = l?.args ?? c.args ?? c.parameters;
		!u && l && !("call" in l) && !("function" in l) ? u = c : u && typeof u == "object" && !("properties" in u) && !("type" in u) && (u = {
			type: "object",
			properties: u,
			required: c.required,
			additionalProperties: c.additionalProperties
		});
		let d = u && typeof u == "object" ? b_(u, t, a) : yg(gg()), f = (typeof c.returnType == "string" ? c.returnType : void 0) ?? (typeof l?.returnType?.const == "string" ? (l?.returnType).const : "any"), p = c.allowedCallers ?? l?.allowedCallers?.const, m = c.requiresUserActivation ?? l?.requiresUserActivation?.const;
		i.push({
			name: r,
			description: typeof c.description == "string" ? c.description : void 0,
			returnType: f,
			allowedCallers: p,
			requiresUserActivation: m,
			schema: d
		});
	}
	return i;
}
function S_(e, t) {
	if (!Array.isArray(e)) return;
	let n = /* @__PURE__ */ new Set();
	for (let r of e) if (typeof r?.$ref == "string" && r.$ref.startsWith(t)) {
		let e = r.$ref.slice(t.length).replace(/~([01])/g, (e, t) => t === "1" ? "/" : "~");
		n.add(e);
	}
	return n;
}
function C_(e, t, n, r) {
	let i = [], a = /* @__PURE__ */ new Map();
	for (let [o, s] of Object.entries(e)) {
		let e = s || {};
		if (n) {
			s_(o, `component identifier: '${o}'`);
			let t = e.properties;
			if (t && typeof t == "object") for (let e of Object.keys(t)) s_(e, `property identifier: '${e}' in component '${o}'`);
		}
		if (r && !r.has(o)) continue;
		let c = y_(e, t, !0, a);
		i.push({
			name: o,
			schema: c,
			allowedParents: Array.isArray(e.allowedParents) ? e.allowedParents.filter((e) => typeof e == "string") : void 0,
			allowedChildren: Array.isArray(e.allowedChildren) ? e.allowedChildren.filter((e) => typeof e == "string") : void 0
		});
	}
	return i;
}
function w_(e, t) {
	let n = e.theme ?? e.themeSchema ?? e.styles ?? t?.theme;
	if (n && typeof n == "object") return y_(n, e, !1);
}
function T_(e, t) {
	let n = e.catalogId ?? e.$id ?? e.id;
	if (!n || typeof n != "string") throw Error("Catalog ID must be specified via catalog metadata ('catalogId' or '$id').");
	let r = e.$defs, i = r?.anyComponent, a = S_(i?.oneOf, "#/components/"), o = t ?? e.protocolVersion ?? "0.9", s = i_(o, "1.0"), c = C_(e.components ?? {}, e, s, a), l = r?.anyFunction, u = S_(l?.oneOf, "#/functions/");
	return new py(n, o, c, x_(e.functions, e, u, s), w_(e, r), typeof e.instructions == "string" ? e.instructions : void 0);
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/Options.js
var E_ = Symbol("Let zodToJsonSchema decide on which parser to use"), D_ = {
	name: void 0,
	$refStrategy: "root",
	basePath: ["#"],
	effectStrategy: "input",
	pipeStrategy: "all",
	dateStrategy: "format:date-time",
	mapStrategy: "entries",
	removeAdditionalStrategy: "passthrough",
	allowedAdditionalProperties: !0,
	rejectedAdditionalProperties: !1,
	definitionPath: "definitions",
	target: "jsonSchema7",
	strictUnions: !1,
	definitions: {},
	errorMessages: !1,
	markdownDescription: !1,
	patternStrategy: "escape",
	applyRegexFlags: !1,
	emailStrategy: "format:email",
	base64Strategy: "contentEncoding:base64",
	nameStrategy: "ref",
	openAiAnyTypeName: "OpenAiAnyType"
}, O_ = (e) => typeof e == "string" ? {
	...D_,
	name: e
} : {
	...D_,
	...e
}, k_ = (e) => {
	let t = O_(e), n = t.name === void 0 ? t.basePath : [
		...t.basePath,
		t.definitionPath,
		t.name
	];
	return {
		...t,
		flags: { hasReferencedOpenAiAnyType: !1 },
		currentPath: n,
		propertyPath: void 0,
		seen: new Map(Object.entries(t.definitions).map(([e, n]) => [n._def, {
			def: n._def,
			path: [
				...t.basePath,
				t.definitionPath,
				e
			],
			jsonSchema: void 0
		}]))
	};
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/errorMessages.js
function A_(e, t, n, r) {
	r?.errorMessages && n && (e.errorMessage = {
		...e.errorMessage,
		[t]: n
	});
}
function j_(e, t, n, r, i) {
	e[t] = n, A_(e, t, r, i);
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/getRelativePath.js
var M_ = (e, t) => {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n]; n++);
	return [(e.length - n).toString(), ...t.slice(n)].join("/");
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/any.js
function N_(e) {
	if (e.target !== "openAi") return {};
	let t = [
		...e.basePath,
		e.definitionPath,
		e.openAiAnyTypeName
	];
	return e.flags.hasReferencedOpenAiAnyType = !0, { $ref: e.$refStrategy === "relative" ? M_(t, e.currentPath) : t.join("/") };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/array.js
function P_(e, t) {
	let n = { type: "array" };
	return e.type?._def && e.type?._def?.typeName !== q.ZodAny && (n.items = wv(e.type._def, {
		...t,
		currentPath: [...t.currentPath, "items"]
	})), e.minLength && j_(n, "minItems", e.minLength.value, e.minLength.message, t), e.maxLength && j_(n, "maxItems", e.maxLength.value, e.maxLength.message, t), e.exactLength && (j_(n, "minItems", e.exactLength.value, e.exactLength.message, t), j_(n, "maxItems", e.exactLength.value, e.exactLength.message, t)), n;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/bigint.js
function F_(e, t) {
	let n = {
		type: "integer",
		format: "int64"
	};
	if (!e.checks) return n;
	for (let r of e.checks) switch (r.kind) {
		case "min":
			t.target === "jsonSchema7" ? r.inclusive ? j_(n, "minimum", r.value, r.message, t) : j_(n, "exclusiveMinimum", r.value, r.message, t) : (r.inclusive || (n.exclusiveMinimum = !0), j_(n, "minimum", r.value, r.message, t));
			break;
		case "max":
			t.target === "jsonSchema7" ? r.inclusive ? j_(n, "maximum", r.value, r.message, t) : j_(n, "exclusiveMaximum", r.value, r.message, t) : (r.inclusive || (n.exclusiveMaximum = !0), j_(n, "maximum", r.value, r.message, t));
			break;
		case "multipleOf": j_(n, "multipleOf", r.value, r.message, t);
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/boolean.js
function I_() {
	return { type: "boolean" };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/branded.js
function L_(e, t) {
	return wv(e.type._def, t);
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/catch.js
var R_ = (e, t) => wv(e.innerType._def, t);
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/date.js
function z_(e, t, n) {
	let r = n ?? t.dateStrategy;
	if (Array.isArray(r)) return { anyOf: r.map((n, r) => z_(e, t, n)) };
	switch (r) {
		case "string":
		case "format:date-time": return {
			type: "string",
			format: "date-time"
		};
		case "format:date": return {
			type: "string",
			format: "date"
		};
		case "integer": return B_(e, t);
	}
}
var B_ = (e, t) => {
	let n = {
		type: "integer",
		format: "unix-time"
	};
	if (t.target === "openApi3") return n;
	for (let r of e.checks) switch (r.kind) {
		case "min":
			j_(n, "minimum", r.value, r.message, t);
			break;
		case "max": j_(n, "maximum", r.value, r.message, t);
	}
	return n;
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/default.js
function V_(e, t) {
	return {
		...wv(e.innerType._def, t),
		default: e.defaultValue()
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/effects.js
function H_(e, t) {
	return t.effectStrategy === "input" ? wv(e.schema._def, t) : N_(t);
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/enum.js
function U_(e) {
	return {
		type: "string",
		enum: Array.from(e.values)
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/intersection.js
var W_ = (e) => "type" in e && e.type === "string" ? !1 : "allOf" in e;
function G_(e, t) {
	let n = [wv(e.left._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"allOf",
			"0"
		]
	}), wv(e.right._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"allOf",
			"1"
		]
	})].filter((e) => !!e), r = t.target === "jsonSchema2019-09" ? { unevaluatedProperties: !1 } : void 0, i = [];
	return n.forEach((e) => {
		if (W_(e)) i.push(...e.allOf), e.unevaluatedProperties === void 0 && (r = void 0);
		else {
			let t = e;
			if ("additionalProperties" in e && e.additionalProperties === !1) {
				let { additionalProperties: n, ...r } = e;
				t = r;
			} else r = void 0;
			i.push(t);
		}
	}), i.length ? {
		allOf: i,
		...r
	} : void 0;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/literal.js
function K_(e, t) {
	let n = typeof e.value;
	return n !== "bigint" && n !== "number" && n !== "boolean" && n !== "string" ? { type: Array.isArray(e.value) ? "array" : "object" } : t.target === "openApi3" ? {
		type: n === "bigint" ? "integer" : n,
		enum: [e.value]
	} : {
		type: n === "bigint" ? "integer" : n,
		const: e.value
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/string.js
var q_ = void 0, J_ = {
	cuid: /^[cC][^\s-]{8,}$/,
	cuid2: /^[0-9a-z]+$/,
	ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
	email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
	emoji: () => (q_ === void 0 && (q_ = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u")), q_),
	uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
	ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
	ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
	ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
	ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
	base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
	base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
	nanoid: /^[a-zA-Z0-9_-]{21}$/,
	jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function Y_(e, t) {
	let n = { type: "string" };
	if (e.checks) for (let r of e.checks) switch (r.kind) {
		case "min":
			j_(n, "minLength", typeof n.minLength == "number" ? Math.max(n.minLength, r.value) : r.value, r.message, t);
			break;
		case "max":
			j_(n, "maxLength", typeof n.maxLength == "number" ? Math.min(n.maxLength, r.value) : r.value, r.message, t);
			break;
		case "email":
			switch (t.emailStrategy) {
				case "format:email":
					$_(n, "email", r.message, t);
					break;
				case "format:idn-email":
					$_(n, "idn-email", r.message, t);
					break;
				case "pattern:zod": ev(n, J_.email, r.message, t);
			}
			break;
		case "url":
			$_(n, "uri", r.message, t);
			break;
		case "uuid":
			$_(n, "uuid", r.message, t);
			break;
		case "regex":
			ev(n, r.regex, r.message, t);
			break;
		case "cuid":
			ev(n, J_.cuid, r.message, t);
			break;
		case "cuid2":
			ev(n, J_.cuid2, r.message, t);
			break;
		case "startsWith":
			ev(n, RegExp(`^${X_(r.value, t)}`), r.message, t);
			break;
		case "endsWith":
			ev(n, RegExp(`${X_(r.value, t)}$`), r.message, t);
			break;
		case "datetime":
			$_(n, "date-time", r.message, t);
			break;
		case "date":
			$_(n, "date", r.message, t);
			break;
		case "time":
			$_(n, "time", r.message, t);
			break;
		case "duration":
			$_(n, "duration", r.message, t);
			break;
		case "length":
			j_(n, "minLength", typeof n.minLength == "number" ? Math.max(n.minLength, r.value) : r.value, r.message, t), j_(n, "maxLength", typeof n.maxLength == "number" ? Math.min(n.maxLength, r.value) : r.value, r.message, t);
			break;
		case "includes":
			ev(n, RegExp(X_(r.value, t)), r.message, t);
			break;
		case "ip":
			r.version !== "v6" && $_(n, "ipv4", r.message, t), r.version !== "v4" && $_(n, "ipv6", r.message, t);
			break;
		case "base64url":
			ev(n, J_.base64url, r.message, t);
			break;
		case "jwt":
			ev(n, J_.jwt, r.message, t);
			break;
		case "cidr":
			r.version !== "v6" && ev(n, J_.ipv4Cidr, r.message, t), r.version !== "v4" && ev(n, J_.ipv6Cidr, r.message, t);
			break;
		case "emoji":
			ev(n, J_.emoji(), r.message, t);
			break;
		case "ulid":
			ev(n, J_.ulid, r.message, t);
			break;
		case "base64":
			switch (t.base64Strategy) {
				case "format:binary":
					$_(n, "binary", r.message, t);
					break;
				case "contentEncoding:base64":
					j_(n, "contentEncoding", "base64", r.message, t);
					break;
				case "pattern:zod": ev(n, J_.base64, r.message, t);
			}
			break;
		case "nanoid": ev(n, J_.nanoid, r.message, t);
	}
	return n;
}
function X_(e, t) {
	return t.patternStrategy === "escape" ? Q_(e) : e;
}
var Z_ = /* @__PURE__ */ new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function Q_(e) {
	let t = "";
	for (let n = 0; n < e.length; n++) Z_.has(e[n]) || (t += "\\"), t += e[n];
	return t;
}
function $_(e, t, n, r) {
	e.format || e.anyOf?.some((e) => e.format) ? (e.anyOf ||= [], e.format && (e.anyOf.push({
		format: e.format,
		...e.errorMessage && r.errorMessages && { errorMessage: { format: e.errorMessage.format } }
	}), delete e.format, e.errorMessage && (delete e.errorMessage.format, Object.keys(e.errorMessage).length === 0 && delete e.errorMessage)), e.anyOf.push({
		format: t,
		...n && r.errorMessages && { errorMessage: { format: n } }
	})) : j_(e, "format", t, n, r);
}
function ev(e, t, n, r) {
	e.pattern || e.allOf?.some((e) => e.pattern) ? (e.allOf ||= [], e.pattern && (e.allOf.push({
		pattern: e.pattern,
		...e.errorMessage && r.errorMessages && { errorMessage: { pattern: e.errorMessage.pattern } }
	}), delete e.pattern, e.errorMessage && (delete e.errorMessage.pattern, Object.keys(e.errorMessage).length === 0 && delete e.errorMessage)), e.allOf.push({
		pattern: tv(t, r),
		...n && r.errorMessages && { errorMessage: { pattern: n } }
	})) : j_(e, "pattern", tv(t, r), n, r);
}
function tv(e, t) {
	if (!t.applyRegexFlags || !e.flags) return e.source;
	let n = {
		i: e.flags.includes("i"),
		m: e.flags.includes("m"),
		s: e.flags.includes("s")
	}, r = n.i ? e.source.toLowerCase() : e.source, i = "", a = !1, o = !1, s = !1;
	for (let e = 0; e < r.length; e++) if (a) i += r[e], a = !1;
	else {
		if (n.i) {
			if (o) {
				if (r[e].match(/[a-z]/)) {
					s ? (i += r[e], i += `${r[e - 2]}-${r[e]}`.toUpperCase(), s = !1) : r[e + 1] === "-" && r[e + 2]?.match(/[a-z]/) ? (i += r[e], s = !0) : i += `${r[e]}${r[e].toUpperCase()}`;
					continue;
				}
			} else if (r[e].match(/[a-z]/)) {
				i += `[${r[e]}${r[e].toUpperCase()}]`;
				continue;
			}
		}
		if (n.m) {
			if (r[e] === "^") {
				i += "(^|(?<=[\r\n]))";
				continue;
			}
			if (r[e] === "$") {
				i += "($|(?=[\r\n]))";
				continue;
			}
		}
		n.s && r[e] === "." ? i += o ? `${r[e]}\r\n` : `[${r[e]}\r\n]` : (i += r[e], r[e] === "\\" ? a = !0 : o && r[e] === "]" ? o = !1 : !o && r[e] === "[" && (o = !0));
	}
	try {
		new RegExp(i);
	} catch {
		return console.warn(`Could not convert regex pattern at ${t.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`), e.source;
	}
	return i;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/record.js
function nv(e, t) {
	if (t.target === "openAi" && console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead."), t.target === "openApi3" && e.keyType?._def.typeName === q.ZodEnum) return {
		type: "object",
		required: e.keyType._def.values,
		properties: e.keyType._def.values.reduce((n, r) => ({
			...n,
			[r]: wv(e.valueType._def, {
				...t,
				currentPath: [
					...t.currentPath,
					"properties",
					r
				]
			}) ?? N_(t)
		}), {}),
		additionalProperties: t.rejectedAdditionalProperties
	};
	let n = {
		type: "object",
		additionalProperties: wv(e.valueType._def, {
			...t,
			currentPath: [...t.currentPath, "additionalProperties"]
		}) ?? t.allowedAdditionalProperties
	};
	if (t.target === "openApi3") return n;
	if (e.keyType?._def.typeName === q.ZodString && e.keyType._def.checks?.length) {
		let { type: r, ...i } = Y_(e.keyType._def, t);
		return {
			...n,
			propertyNames: i
		};
	}
	if (e.keyType?._def.typeName === q.ZodEnum) return {
		...n,
		propertyNames: { enum: e.keyType._def.values }
	};
	if (e.keyType?._def.typeName === q.ZodBranded && e.keyType._def.type._def.typeName === q.ZodString && e.keyType._def.type._def.checks?.length) {
		let { type: r, ...i } = L_(e.keyType._def, t);
		return {
			...n,
			propertyNames: i
		};
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/map.js
function rv(e, t) {
	return t.mapStrategy === "record" ? nv(e, t) : {
		type: "array",
		maxItems: 125,
		items: {
			type: "array",
			items: [wv(e.keyType._def, {
				...t,
				currentPath: [
					...t.currentPath,
					"items",
					"items",
					"0"
				]
			}) || N_(t), wv(e.valueType._def, {
				...t,
				currentPath: [
					...t.currentPath,
					"items",
					"items",
					"1"
				]
			}) || N_(t)],
			minItems: 2,
			maxItems: 2
		}
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/nativeEnum.js
function iv(e) {
	let t = e.values, n = Object.keys(e.values).filter((e) => typeof t[t[e]] != "number").map((e) => t[e]), r = Array.from(new Set(n.map((e) => typeof e)));
	return {
		type: r.length === 1 ? r[0] === "string" ? "string" : "number" : ["string", "number"],
		enum: n
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/never.js
function av(e) {
	return e.target === "openAi" ? void 0 : { not: N_({
		...e,
		currentPath: [...e.currentPath, "not"]
	}) };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/null.js
function ov(e) {
	return e.target === "openApi3" ? {
		enum: ["null"],
		nullable: !0
	} : { type: "null" };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/union.js
var sv = {
	ZodString: "string",
	ZodNumber: "number",
	ZodBigInt: "integer",
	ZodBoolean: "boolean",
	ZodNull: "null"
};
function cv(e, t) {
	if (t.target === "openApi3") return lv(e, t);
	let n = e.options instanceof Map ? Array.from(e.options.values()) : e.options;
	if (n.every((e) => e._def.typeName in sv && (!e._def.checks || !e._def.checks.length))) {
		let e = n.reduce((e, t) => {
			let n = sv[t._def.typeName];
			return n && !e.includes(n) ? [...e, n] : e;
		}, []);
		return { type: e.length > 1 ? e : e[0] };
	}
	if (n.every((e) => e._def.typeName === "ZodLiteral" && !e.description)) {
		let e = n.reduce((e, t) => {
			let n = typeof t._def.value;
			switch (n) {
				case "string":
				case "number":
				case "boolean": return [...e, n];
				case "bigint": return [...e, "integer"];
				case "object": if (t._def.value === null) return [...e, "null"];
				default: return e;
			}
		}, []);
		if (e.length === n.length) {
			let t = e.filter((e, t, n) => n.indexOf(e) === t);
			return {
				type: t.length > 1 ? t : t[0],
				enum: n.reduce((e, t) => e.includes(t._def.value) ? e : [...e, t._def.value], [])
			};
		}
	} else if (n.every((e) => e._def.typeName === "ZodEnum")) return {
		type: "string",
		enum: n.reduce((e, t) => [...e, ...t._def.values.filter((t) => !e.includes(t))], [])
	};
	return lv(e, t);
}
var lv = (e, t) => {
	let n = (e.options instanceof Map ? Array.from(e.options.values()) : e.options).map((e, n) => wv(e._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"anyOf",
			`${n}`
		]
	})).filter((e) => !!e && (!t.strictUnions || typeof e == "object" && Object.keys(e).length > 0));
	return n.length ? { anyOf: n } : void 0;
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/nullable.js
function uv(e, t) {
	if ([
		"ZodString",
		"ZodNumber",
		"ZodBigInt",
		"ZodBoolean",
		"ZodNull"
	].includes(e.innerType._def.typeName) && (!e.innerType._def.checks || !e.innerType._def.checks.length)) return t.target === "openApi3" ? {
		type: sv[e.innerType._def.typeName],
		nullable: !0
	} : { type: [sv[e.innerType._def.typeName], "null"] };
	if (t.target === "openApi3") {
		let n = wv(e.innerType._def, {
			...t,
			currentPath: [...t.currentPath]
		});
		return n && "$ref" in n ? {
			allOf: [n],
			nullable: !0
		} : n && {
			...n,
			nullable: !0
		};
	}
	let n = wv(e.innerType._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"anyOf",
			"0"
		]
	});
	return n && { anyOf: [n, { type: "null" }] };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/number.js
function dv(e, t) {
	let n = { type: "number" };
	if (!e.checks) return n;
	for (let r of e.checks) switch (r.kind) {
		case "int":
			n.type = "integer", A_(n, "type", r.message, t);
			break;
		case "min":
			t.target === "jsonSchema7" ? r.inclusive ? j_(n, "minimum", r.value, r.message, t) : j_(n, "exclusiveMinimum", r.value, r.message, t) : (r.inclusive || (n.exclusiveMinimum = !0), j_(n, "minimum", r.value, r.message, t));
			break;
		case "max":
			t.target === "jsonSchema7" ? r.inclusive ? j_(n, "maximum", r.value, r.message, t) : j_(n, "exclusiveMaximum", r.value, r.message, t) : (r.inclusive || (n.exclusiveMaximum = !0), j_(n, "maximum", r.value, r.message, t));
			break;
		case "multipleOf": j_(n, "multipleOf", r.value, r.message, t);
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/object.js
function fv(e, t) {
	let n = t.target === "openAi", r = {
		type: "object",
		properties: {}
	}, i = [], a = e.shape();
	for (let e in a) {
		let o = a[e];
		if (o === void 0 || o._def === void 0) continue;
		let s = mv(o);
		s && n && (o._def.typeName === "ZodOptional" && (o = o._def.innerType), o.isNullable() || (o = o.nullable()), s = !1);
		let c = wv(o._def, {
			...t,
			currentPath: [
				...t.currentPath,
				"properties",
				e
			],
			propertyPath: [
				...t.currentPath,
				"properties",
				e
			]
		});
		c !== void 0 && (r.properties[e] = c, s || i.push(e));
	}
	i.length && (r.required = i);
	let o = pv(e, t);
	return o !== void 0 && (r.additionalProperties = o), r;
}
function pv(e, t) {
	if (e.catchall._def.typeName !== "ZodNever") return wv(e.catchall._def, {
		...t,
		currentPath: [...t.currentPath, "additionalProperties"]
	});
	switch (e.unknownKeys) {
		case "passthrough": return t.allowedAdditionalProperties;
		case "strict": return t.rejectedAdditionalProperties;
		case "strip": return t.removeAdditionalStrategy === "strict" ? t.allowedAdditionalProperties : t.rejectedAdditionalProperties;
	}
}
function mv(e) {
	try {
		return e.isOptional();
	} catch {
		return !0;
	}
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/optional.js
var hv = (e, t) => {
	if (t.currentPath.toString() === t.propertyPath?.toString()) return wv(e.innerType._def, t);
	let n = wv(e.innerType._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"anyOf",
			"1"
		]
	});
	return n ? { anyOf: [{ not: N_(t) }, n] } : N_(t);
}, gv = (e, t) => {
	if (t.pipeStrategy === "input") return wv(e.in._def, t);
	if (t.pipeStrategy === "output") return wv(e.out._def, t);
	let n = wv(e.in._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"allOf",
			"0"
		]
	});
	return { allOf: [n, wv(e.out._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"allOf",
			n ? "1" : "0"
		]
	})].filter((e) => e !== void 0) };
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/promise.js
function _v(e, t) {
	return wv(e.type._def, t);
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/set.js
function vv(e, t) {
	let n = {
		type: "array",
		uniqueItems: !0,
		items: wv(e.valueType._def, {
			...t,
			currentPath: [...t.currentPath, "items"]
		})
	};
	return e.minSize && j_(n, "minItems", e.minSize.value, e.minSize.message, t), e.maxSize && j_(n, "maxItems", e.maxSize.value, e.maxSize.message, t), n;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/tuple.js
function yv(e, t) {
	return e.rest ? {
		type: "array",
		minItems: e.items.length,
		items: e.items.map((e, n) => wv(e._def, {
			...t,
			currentPath: [
				...t.currentPath,
				"items",
				`${n}`
			]
		})).reduce((e, t) => t === void 0 ? e : [...e, t], []),
		additionalItems: wv(e.rest._def, {
			...t,
			currentPath: [...t.currentPath, "additionalItems"]
		})
	} : {
		type: "array",
		minItems: e.items.length,
		maxItems: e.items.length,
		items: e.items.map((e, n) => wv(e._def, {
			...t,
			currentPath: [
				...t.currentPath,
				"items",
				`${n}`
			]
		})).reduce((e, t) => t === void 0 ? e : [...e, t], [])
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/undefined.js
function bv(e) {
	return { not: N_(e) };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/unknown.js
function xv(e) {
	return N_(e);
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/readonly.js
var Sv = (e, t) => wv(e.innerType._def, t), Cv = (e, t, n) => {
	switch (t) {
		case q.ZodString: return Y_(e, n);
		case q.ZodNumber: return dv(e, n);
		case q.ZodObject: return fv(e, n);
		case q.ZodBigInt: return F_(e, n);
		case q.ZodBoolean: return I_();
		case q.ZodDate: return z_(e, n);
		case q.ZodUndefined: return bv(n);
		case q.ZodNull: return ov(n);
		case q.ZodArray: return P_(e, n);
		case q.ZodUnion:
		case q.ZodDiscriminatedUnion: return cv(e, n);
		case q.ZodIntersection: return G_(e, n);
		case q.ZodTuple: return yv(e, n);
		case q.ZodRecord: return nv(e, n);
		case q.ZodLiteral: return K_(e, n);
		case q.ZodEnum: return U_(e);
		case q.ZodNativeEnum: return iv(e);
		case q.ZodNullable: return uv(e, n);
		case q.ZodOptional: return hv(e, n);
		case q.ZodMap: return rv(e, n);
		case q.ZodSet: return vv(e, n);
		case q.ZodLazy: return () => e.getter()._def;
		case q.ZodPromise: return _v(e, n);
		case q.ZodNaN:
		case q.ZodNever: return av(n);
		case q.ZodEffects: return H_(e, n);
		case q.ZodAny: return N_(n);
		case q.ZodUnknown: return xv(n);
		case q.ZodDefault: return V_(e, n);
		case q.ZodBranded: return L_(e, n);
		case q.ZodReadonly: return Sv(e, n);
		case q.ZodCatch: return R_(e, n);
		case q.ZodPipeline: return gv(e, n);
		case q.ZodFunction:
		case q.ZodVoid:
		case q.ZodSymbol: return;
		default: return ((e) => void 0)(t);
	}
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parseDef.js
function wv(e, t, n = !1) {
	let r = t.seen.get(e);
	if (t.override) {
		let i = t.override?.(e, t, r, n);
		if (i !== E_) return i;
	}
	if (r && !n) {
		let e = Tv(r, t);
		if (e !== void 0) return e;
	}
	let i = {
		def: e,
		path: t.currentPath,
		jsonSchema: void 0
	};
	t.seen.set(e, i);
	let a = Cv(e, e.typeName, t), o = typeof a == "function" ? wv(a(), t) : a;
	if (o && Ev(e, t, o), t.postProcess) {
		let n = t.postProcess(o, e, t);
		return i.jsonSchema = o, n;
	}
	return i.jsonSchema = o, o;
}
var Tv = (e, t) => {
	switch (t.$refStrategy) {
		case "root": return { $ref: e.path.join("/") };
		case "relative": return { $ref: M_(t.currentPath, e.path) };
		case "none":
		case "seen": return e.path.length < t.currentPath.length && e.path.every((e, n) => t.currentPath[n] === e) ? (console.warn(`Recursive reference detected at ${t.currentPath.join("/")}! Defaulting to any`), N_(t)) : t.$refStrategy === "seen" ? N_(t) : void 0;
	}
}, Ev = (e, t, n) => (e.description && (n.description = e.description, t.markdownDescription && (n.markdownDescription = e.description)), n), Dv = (e, t) => {
	let n = k_(t), r = typeof t == "object" && t.definitions ? Object.entries(t.definitions).reduce((e, [t, r]) => ({
		...e,
		[t]: wv(r._def, {
			...n,
			currentPath: [
				...n.basePath,
				n.definitionPath,
				t
			]
		}, !0) ?? N_(n)
	}), {}) : void 0, i = typeof t == "string" ? t : t?.nameStrategy === "title" ? void 0 : t?.name, a = wv(e._def, i === void 0 ? n : {
		...n,
		currentPath: [
			...n.basePath,
			n.definitionPath,
			i
		]
	}, !1) ?? N_(n), o = typeof t == "object" && t.name !== void 0 && t.nameStrategy === "title" ? t.name : void 0;
	o !== void 0 && (a.title = o), n.flags.hasReferencedOpenAiAnyType && (r ||= {}, r[n.openAiAnyTypeName] || (r[n.openAiAnyTypeName] = {
		type: [
			"string",
			"number",
			"integer",
			"boolean",
			"array",
			"null"
		],
		items: { $ref: n.$refStrategy === "relative" ? "1" : [
			...n.basePath,
			n.definitionPath,
			n.openAiAnyTypeName
		].join("/") }
	}));
	let s = i === void 0 ? r ? {
		...a,
		[n.definitionPath]: r
	} : a : {
		$ref: [
			...n.$refStrategy === "relative" ? [] : n.basePath,
			n.definitionPath,
			i
		].join("/"),
		[n.definitionPath]: {
			...r,
			[i]: a
		}
	};
	return n.target === "jsonSchema7" ? s.$schema = "http://json-schema.org/draft-07/schema#" : (n.target === "jsonSchema2019-09" || n.target === "openAi") && (s.$schema = "https://json-schema.org/draft/2019-09/schema#"), n.target === "openAi" && ("anyOf" in s || "oneOf" in s || "allOf" in s || "type" in s && Array.isArray(s.type)) && console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property."), s;
}, Ov = {
	ComponentId: {
		description: "The unique identifier for a component, used for both definitions and references within the same surface.",
		type: "string"
	},
	TextItem: {
		additionalProperties: !1,
		description: "The value of the text field. This can be a literal string or a reference to a value in the data model ('path', e.g. '/user/name').",
		properties: {
			literalString: { type: "string" },
			path: { type: "string" }
		},
		type: "object"
	},
	UrlItem: {
		additionalProperties: !1,
		description: "The URL of the audio to be played. This can be a literal string ('literal') or a reference to a value in the data model ('path', e.g. '/song/url').",
		properties: {
			literalString: { type: "string" },
			path: { type: "string" }
		},
		type: "object"
	},
	AltTextItem: {
		additionalProperties: !1,
		description: "The alt text for the image. This can be a literal string ('literal') or a reference to a value in the data model ('path', e.g. '/thumbnail/altText').",
		properties: {
			literalString: { type: "string" },
			path: { type: "string" }
		},
		type: "object"
	},
	NameItem: {
		additionalProperties: !1,
		description: "The name of the icon to display. This can be a literal string or a reference to a value in the data model ('path', e.g. '/form/submit').",
		properties: {
			literalString: {
				enum: /* @__PURE__ */ "accountCircle.add.arrowBack.arrowForward.attachFile.calendarToday.call.camera.check.close.delete.download.edit.event.error.favorite.favoriteOff.folder.help.home.info.locationOn.lock.lockOpen.mail.menu.moreVert.moreHoriz.notificationsOff.notifications.payment.person.phone.photo.print.refresh.search.send.settings.share.shoppingCart.star.starHalf.starOff.upload.visibility.visibilityOff.warning".split("."),
				type: "string"
			},
			path: { type: "string" }
		},
		type: "object"
	},
	DescriptionItem: {
		additionalProperties: !1,
		description: "A description of the audio, such as a title or summary. This can be a literal string or a reference to a value in the data model ('path', e.g. '/song/title').",
		properties: {
			literalString: { type: "string" },
			path: { type: "string" }
		},
		type: "object"
	},
	ChildrenItem: {
		additionalProperties: !1,
		description: "Defines the children. Use 'explicitList' for a fixed set of children, or 'template' to generate children from a data list.",
		properties: {
			explicitList: {
				items: { type: "string" },
				type: "array"
			},
			template: {
				$ref: "#/$defs/TemplateItem",
				description: "A template for generating a dynamic list of children from a data model list. `componentId` is the component to use as a template, and `dataBinding` is the path to the map of components in the data model. Values in the map will define the list of children."
			}
		},
		type: "object"
	},
	TemplateItem: {
		additionalProperties: !1,
		description: "A template for generating a dynamic list of children from a data model list. `componentId` is the component to use as a template, and `dataBinding` is the path to the map of components in the data model. Values in the map will define the list of children.",
		properties: {
			componentId: { type: "string" },
			dataBinding: { type: "string" }
		},
		required: ["componentId", "dataBinding"],
		type: "object"
	},
	TabItemItem: {
		additionalProperties: !1,
		properties: {
			child: { type: "string" },
			title: { $ref: "#/$defs/TitleItem" }
		},
		required: ["title", "child"],
		type: "object"
	},
	TitleItem: {
		additionalProperties: !1,
		description: "The tab title. Defines the value as either a literal value or a path to data model value (e.g. '/options/title').",
		properties: {
			literalString: { type: "string" },
			path: { type: "string" }
		},
		type: "object"
	},
	ActionItem: {
		additionalProperties: !1,
		description: "The client-side action to be dispatched when the button is clicked. It includes the action's name and an optional context payload.",
		properties: {
			context: {
				items: { $ref: "#/$defs/ContextItem" },
				type: "array"
			},
			name: { type: "string" }
		},
		required: ["name"],
		type: "object"
	},
	ContextItem: {
		additionalProperties: !1,
		properties: {
			key: { type: "string" },
			value: {
				$ref: "#/$defs/ValueItem",
				description: "Defines the value to be included in the context as either a literal value or a path to a data model value (e.g. '/user/name')."
			}
		},
		required: ["key", "value"],
		type: "object"
	},
	ValueItem: {
		additionalProperties: !1,
		description: "The current value of the slider. This can be a literal number ('literalNumber') or a reference to a value in the data model ('path', e.g. '/restaurant/cost').",
		properties: {
			literalNumber: { type: "number" },
			path: { type: "string" }
		},
		type: "object"
	},
	LabelItem: {
		additionalProperties: !1,
		description: "The label for the slider. This can be a literal string or a reference to a value in the data model ('path').",
		properties: {
			literalString: { type: "string" },
			path: { type: "string" }
		},
		type: "object"
	},
	OptionItem: {
		additionalProperties: !1,
		properties: {
			label: {
				$ref: "#/$defs/LabelItem",
				description: "The text to display for this option. This can be a literal string or a reference to a value in the data model (e.g. '/option/label')."
			},
			value: {
				description: "The value to be associated with this option when selected.",
				type: "string"
			}
		},
		required: ["label", "value"],
		type: "object"
	},
	SelectionItem: {
		additionalProperties: !1,
		description: "The currently selected values for the component. This can be a literal array of strings or a path to an array in the data model('path', e.g. '/hotel/options').",
		properties: {
			literalArray: {
				items: { type: "string" },
				type: "array"
			},
			path: { type: "string" }
		},
		type: "object"
	}
}, kv = {
	childRefNames: /* @__PURE__ */ new Set([
		"ComponentId",
		"Child",
		"ChildComponentId"
	]),
	childListRefNames: /* @__PURE__ */ new Set([
		"ChildList",
		"TemplateChildList",
		"ChildrenItem",
		"TemplateItem"
	])
}, Av = {
	ComponentId: {
		type: "string",
		description: "The unique identifier for a component, used for both definitions and references within the same surface."
	},
	AccessibilityAttributes: {
		type: "object",
		description: "Attributes to enhance accessibility when using assistive technologies like screen readers.",
		properties: {
			label: {
				$ref: "#/$defs/DynamicString",
				description: "A short string, typically 1 to 3 words, used by assistive technologies to convey the purpose or intent of an element. For example, an input field might have an accessible label of 'User ID' or a button might be labeled 'Submit'."
			},
			description: {
				$ref: "#/$defs/DynamicString",
				description: "Additional information provided by assistive technologies about an element such as instructions, format requirements, or result of an action. For example, a mute button might have a label of 'Mute' and a description of 'Silences notifications about this conversation'."
			}
		}
	},
	ComponentCommon: {
		type: "object",
		properties: {
			id: { $ref: "#/$defs/ComponentId" },
			accessibility: { $ref: "#/$defs/AccessibilityAttributes" }
		},
		required: ["id"]
	},
	ChildList: { oneOf: [{
		type: "array",
		items: { $ref: "#/$defs/ComponentId" },
		description: "A static list of child component IDs."
	}, {
		type: "object",
		description: "A template for generating a dynamic list of children from a data model list. The `componentId` is the component to use as a template.",
		properties: {
			componentId: { $ref: "#/$defs/ComponentId" },
			path: {
				type: "string",
				description: "The path to the list of component property objects in the data model."
			}
		},
		required: ["componentId", "path"],
		additionalProperties: !1
	}] },
	DataBinding: {
		type: "object",
		properties: { path: {
			type: "string",
			description: "A JSON Pointer path to a value in the data model."
		} },
		required: ["path"],
		additionalProperties: !1
	},
	DynamicValue: {
		description: "A value that can be a literal, a path, or a function call returning any type.",
		oneOf: [
			{ type: "string" },
			{ type: "number" },
			{ type: "boolean" },
			{ type: "array" },
			{ $ref: "#/$defs/DataBinding" },
			{ $ref: "#/$defs/FunctionCall" }
		]
	},
	DynamicString: {
		description: "Represents a string",
		oneOf: [
			{ type: "string" },
			{ $ref: "#/$defs/DataBinding" },
			{ allOf: [{ $ref: "#/$defs/FunctionCall" }, { properties: { returnType: { const: "string" } } }] }
		]
	},
	DynamicNumber: {
		description: "Represents a value that can be either a literal number, a path to a number in the data model, or a function call returning a number.",
		oneOf: [
			{ type: "number" },
			{ $ref: "#/$defs/DataBinding" },
			{ allOf: [{ $ref: "#/$defs/FunctionCall" }, { properties: { returnType: { const: "number" } } }] }
		]
	},
	DynamicBoolean: {
		description: "A boolean value that can be a literal, a path, or a function call returning a boolean.",
		oneOf: [
			{ type: "boolean" },
			{ $ref: "#/$defs/DataBinding" },
			{ allOf: [{ $ref: "#/$defs/FunctionCall" }, { properties: { returnType: { const: "boolean" } } }] }
		]
	},
	DynamicStringList: {
		description: "Represents a value that can be either a literal array of strings, a path to a string array in the data model, or a function call returning a string array.",
		oneOf: [
			{
				type: "array",
				items: { type: "string" }
			},
			{ $ref: "#/$defs/DataBinding" },
			{ allOf: [{ $ref: "#/$defs/FunctionCall" }, { properties: { returnType: { const: "array" } } }] }
		]
	},
	FunctionCall: {
		type: "object",
		description: "Invokes a named function on the client.",
		properties: {
			call: {
				type: "string",
				description: "The name of the function to call."
			},
			args: {
				type: "object",
				description: "Arguments passed to the function.",
				additionalProperties: { anyOf: [{ $ref: "#/$defs/DynamicValue" }, {
					type: "object",
					description: "A literal object argument (e.g. configuration)."
				}] }
			},
			returnType: {
				type: "string",
				description: "The expected return type of the function call.",
				enum: [
					"string",
					"number",
					"boolean",
					"array",
					"object",
					"any",
					"void"
				],
				default: "boolean"
			}
		},
		required: ["call"],
		oneOf: [{ $ref: "catalog.json#/$defs/anyFunction" }]
	},
	CheckRule: {
		type: "object",
		description: "A single validation rule applied to an input component.",
		properties: {
			condition: { $ref: "#/$defs/DynamicBoolean" },
			message: {
				type: "string",
				description: "The error message to display if the check fails."
			}
		},
		required: ["condition", "message"],
		additionalProperties: !1
	},
	Checkable: {
		description: "Properties for components that support client-side checks.",
		type: "object",
		properties: { checks: {
			type: "array",
			description: "A list of checks to perform. These are function calls that must return a boolean indicating validity.",
			items: { $ref: "#/$defs/CheckRule" }
		} }
	},
	Action: {
		description: "Defines an interaction handler that can either trigger a server-side event or execute a local client-side function.",
		oneOf: [{
			type: "object",
			description: "Triggers a server-side event.",
			properties: { event: {
				type: "object",
				description: "The event to dispatch to the server.",
				properties: {
					name: {
						type: "string",
						description: "The name of the action to be dispatched to the server."
					},
					context: {
						type: "object",
						description: "A JSON object containing the key-value pairs for the action context. Values can be literals or paths. Use literal values unless the value must be dynamically bound to the data model. Do NOT use paths for static IDs.",
						additionalProperties: { $ref: "#/$defs/DynamicValue" }
					}
				},
				required: ["name"],
				additionalProperties: !1
			} },
			required: ["event"],
			additionalProperties: !1
		}, {
			type: "object",
			description: "Executes a local client-side function.",
			properties: { functionCall: { $ref: "#/$defs/FunctionCall" } },
			required: ["functionCall"],
			additionalProperties: !1
		}]
	}
}, jv = {
	"0.8": Ov,
	"0.9": Av,
	"0.9.1": Av,
	"1.0": {
		ComponentId: {
			type: "string",
			description: "The unique identifier for a component, used for both definitions and references within the same surface."
		},
		CallId: {
			type: "string",
			description: "The unique identifier for a function call."
		},
		AccessibilityAttributes: {
			type: "object",
			description: "Attributes to enhance accessibility when using assistive technologies like screen readers or model understanding.",
			properties: {
				label: {
					$ref: "#/$defs/DynamicString",
					description: "A short string, typically 1 to 3 words, used by assistive technologies to convey the purpose or intent of an element. For example, an input field might have an accessible label of 'User ID' or a button might be labeled 'Submit'."
				},
				description: {
					$ref: "#/$defs/DynamicString",
					description: "Additional information provided by assistive technologies about an element such as instructions, format requirements, or result of an action. For example, a mute button might have a label of 'Mute' and a description of 'Silences notifications about this conversation'."
				},
				live: {
					type: "string",
					enum: [
						"off",
						"polite",
						"assertive"
					],
					default: "off",
					description: "Controls screen reader announcements for dynamic updates (WAI-ARIA aria-live). 'polite' waits for user pause; 'assertive' interrupts immediately for alerts."
				},
				hidden: {
					$ref: "#/$defs/DynamicBoolean",
					description: "Hides the element and its children from assistive technologies when true. Default is false."
				}
			},
			additionalProperties: !1
		},
		Extensions: {
			type: "object",
			description: "Optional extension metadata. Keys MUST be Unicode identifiers (UAX #31). Keys starting with 'a2ui_' are reserved for official extensions.",
			patternProperties: { "^[\\p{XID_Start}_][\\p{XID_Continue}]*$": {} },
			additionalProperties: !1
		},
		ComponentCommon: {
			type: "object",
			properties: {
				id: { $ref: "#/$defs/ComponentId" },
				catalogId: {
					type: "string",
					description: "The catalog ID for this component, overriding any surface-level default catalogId."
				},
				accessibility: { $ref: "#/$defs/AccessibilityAttributes" },
				metadata: {
					type: "object",
					description: "Optional component-level metadata for vendor extensions.",
					properties: { extensions: { $ref: "#/$defs/Extensions" } },
					additionalProperties: !1
				}
			},
			required: ["id"]
		},
		Child: {
			$ref: "#/$defs/ComponentId",
			description: "A reference to a single child component ID."
		},
		ChildList: { oneOf: [{
			type: "array",
			items: { $ref: "#/$defs/ComponentId" },
			description: "A static list of child component IDs."
		}, {
			type: "object",
			description: "A template for generating a dynamic list of children from a data model list. The `componentId` is the component to use as a template.",
			properties: {
				componentId: { $ref: "#/$defs/ComponentId" },
				path: {
					type: "string",
					description: "The path to the list of component property objects in the data model."
				}
			},
			required: ["componentId", "path"],
			additionalProperties: !1
		}] },
		DataBinding: {
			type: "object",
			properties: { path: {
				type: "string",
				description: "A JSON Pointer path to a value in the data model."
			} },
			required: ["path"],
			additionalProperties: !1
		},
		DynamicValue: {
			description: "A value that can be a literal, a path, or a function call returning any type.",
			oneOf: [
				{ type: "string" },
				{ type: "number" },
				{ type: "boolean" },
				{ type: "array" },
				{
					type: "object",
					not: { anyOf: [{ required: ["path"] }, { required: ["call"] }] }
				},
				{ $ref: "#/$defs/DataBinding" },
				{ $ref: "#/$defs/FunctionCall" }
			]
		},
		DynamicString: {
			description: "Represents a string",
			oneOf: [
				{ type: "string" },
				{ $ref: "#/$defs/DataBinding" },
				{ $ref: "#/$defs/FunctionCall" }
			]
		},
		DynamicNumber: {
			description: "Represents a value that can be either a literal number, a path to a number in the data model, or a function call returning a number.",
			oneOf: [
				{ type: "number" },
				{ $ref: "#/$defs/DataBinding" },
				{ $ref: "#/$defs/FunctionCall" }
			]
		},
		DynamicBoolean: {
			description: "A boolean value that can be a literal, a path, or a function call returning a boolean.",
			oneOf: [
				{ type: "boolean" },
				{ $ref: "#/$defs/DataBinding" },
				{ $ref: "#/$defs/FunctionCall" }
			]
		},
		DynamicStringList: {
			description: "Represents a value that can be either a literal array of strings, a path to a string array in the data model, or a function call returning a string array.",
			oneOf: [
				{
					type: "array",
					items: { type: "string" }
				},
				{ $ref: "#/$defs/DataBinding" },
				{ $ref: "#/$defs/FunctionCall" }
			]
		},
		FunctionCommon: {
			type: "object",
			description: "Baseline envelope properties common to all function calls. Function-specific argument schemas ('args') are defined individually by each function in the active catalog.",
			properties: {
				call: {
					type: "string",
					description: "The name of the function to call."
				},
				catalogId: {
					type: "string",
					description: "The catalog ID for this function, overriding any surface-level default catalogId."
				}
			},
			required: ["call"]
		},
		IndexSystemFunction: {
			type: "object",
			description: "Returns the 0-based index of the current item when rendering a dynamic list from a template. This function MUST ONLY be available when evaluating template items within a list context.",
			returnType: "number",
			properties: {
				call: { const: "@index" },
				args: {
					type: "object",
					properties: { offset: {
						$ref: "#/$defs/DynamicNumber",
						description: "Optional. An offset to add to the 0-based index (e.g., 1 for 1-based indexing). Defaults to 0.",
						default: 0
					} },
					unevaluatedProperties: !1
				}
			},
			required: ["call"],
			unevaluatedProperties: !1
		},
		FunctionCall: {
			type: "object",
			description: "Invokes a named function, combining common function properties with the catalog function definition.",
			allOf: [{ $ref: "#/$defs/FunctionCommon" }, { oneOf: [{ $ref: "catalog.json#/$defs/anyFunction" }, { $ref: "#/$defs/IndexSystemFunction" }] }],
			unevaluatedProperties: !1
		},
		CheckRule: {
			type: "object",
			description: "A single validation check rule applied to an input component. The condition function or path evaluates to a structured validation result object.",
			properties: {
				condition: {
					oneOf: [{ $ref: "#/$defs/DataBinding" }, { $ref: "#/$defs/FunctionCall" }],
					description: "Path or function call evaluating to a structured validation result object."
				},
				message: {
					type: "string",
					description: "Optional fallback error message."
				}
			},
			required: ["condition"],
			additionalProperties: !1
		},
		Checkable: {
			description: "Properties for components that support renderer-side checks.",
			type: "object",
			properties: { checks: {
				type: "array",
				description: "A list of checks to perform. These are function calls that must return a boolean indicating validity.",
				items: { $ref: "#/$defs/CheckRule" }
			} }
		},
		Action: {
			description: "Defines an interaction handler that can either trigger an agent-side event or execute a local renderer-side function.",
			oneOf: [{
				type: "object",
				description: "Triggers an agent-side event.",
				properties: { event: {
					type: "object",
					description: "The event to dispatch to the agent.",
					properties: {
						name: {
							type: "string",
							description: "The name of the action to be dispatched to the agent."
						},
						userMessage: {
							$ref: "#/$defs/DynamicString",
							description: "An optional human-readable message describing the action performed by the user, to present in conversation history or user feedback."
						},
						context: {
							type: "object",
							description: "A JSON object containing the key-value pairs for the action context. Values can be literals or paths. Use literal values unless the value must be dynamically bound to the data model. Do NOT use paths for static IDs.",
							additionalProperties: { $ref: "#/$defs/DynamicValue" }
						}
					},
					required: ["name"],
					additionalProperties: !1
				} },
				required: ["event"],
				additionalProperties: !1
			}, {
				type: "object",
				description: "Executes a renderer or agent-side function.",
				properties: { functionCall: { $ref: "#/$defs/FunctionCall" } },
				required: ["functionCall"],
				additionalProperties: !1
			}]
		},
		Surface: {
			title: "Surface Container Component",
			description: "The reserved canonical container component representing an A2UI surface. The Surface component is immutable and always has 'child': 'root'.",
			type: "object",
			allowedParents: [],
			properties: {
				component: { const: "Surface" },
				child: { const: "root" }
			},
			additionalProperties: !1
		},
		FunctionResponse: {
			type: "object",
			description: "The return response matching a callAgentFunction or callRendererFunction invocation.",
			properties: {
				functionCallId: {
					$ref: "#/$defs/CallId",
					description: "The unique ID matching the initiating function call."
				},
				value: { description: "The return value of the function." },
				error: {
					type: "object",
					description: "An error object indicating failure of the function execution.",
					properties: {
						code: { type: "string" },
						message: { type: "string" }
					},
					required: ["code", "message"],
					additionalProperties: !1
				}
			},
			required: ["functionCallId"],
			oneOf: [{ required: ["value"] }, { required: ["error"] }],
			additionalProperties: !1
		}
	}
};
function Mv(e, t) {
	if (t?.standardDefs) return t.standardDefs;
	if (t?.protocolVersion) {
		let e = e_(t.protocolVersion) ?? Zg(t.protocolVersion);
		if (e in jv) return jv[e];
	}
	return Av;
}
function Nv(e) {
	if (typeof e.description != "string" || !e.description.startsWith("REF:")) return !1;
	let t = e.description.substring(4), n = t.indexOf("|"), r = n === -1 ? t : t.substring(0, n), i = n === -1 ? "" : t.substring(n + 1), a = e.default;
	for (let t of Object.keys(e)) delete e[t];
	return e.$ref = r.startsWith("#") ? r : `#/$defs/${r.split("/").pop()}`, a !== void 0 && (e.default = a), i && (e.description = i), !0;
}
function Pv(e) {
	Array.isArray(e.anyOf) && (e.oneOf = e.anyOf, delete e.anyOf), e.additionalProperties && typeof e.additionalProperties == "object" && Object.keys(e.additionalProperties).length === 0 && (e.additionalProperties = !0), e.unevaluatedProperties && typeof e.unevaluatedProperties == "object" && Object.keys(e.unevaluatedProperties).length === 0 && (e.unevaluatedProperties = !0), "$schema" in e && delete e.$schema;
}
function Fv(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e != "object" || !e || t.has(e)) return;
	if (t.add(e), Array.isArray(e)) {
		for (let n of e) Fv(n, t);
		return;
	}
	let n = e;
	if (!Nv(n)) {
		Pv(n);
		for (let e of Object.keys(n)) Fv(n[e], t);
	}
}
function Iv(e, t) {
	if (!e.themeSchema) return;
	let n = Dv(e.themeSchema, {
		target: "jsonSchema2019-09",
		$refStrategy: "none"
	});
	Fv(n), n.definitions && typeof n.definitions == "object" ? (Object.assign(t, n.definitions), delete n.definitions) : n.$defs && typeof n.$defs == "object" && (Object.assign(t, n.$defs), delete n.$defs);
	let r = e.id.includes("v0_8") || e.id.includes("v0.8");
	t.theme = {
		type: "object",
		properties: n.properties || {},
		...Array.isArray(n.required) && n.required.length > 0 ? { required: n.required } : {},
		...r ? {} : { additionalProperties: n.additionalProperties === void 0 || n.additionalProperties }
	};
}
function Lv(e, t) {
	if (!e.schema || typeof e.schema != "object" || !("safeParse" in e.schema)) return {
		props: {},
		reqList: [],
		additionalProps: void 0
	};
	let n = Dv(e.schema, {
		target: "jsonSchema2019-09",
		$refStrategy: "none"
	});
	Fv(n), n.definitions && typeof n.definitions == "object" ? Object.assign(t, n.definitions) : n.$defs && typeof n.$defs == "object" && Object.assign(t, n.$defs);
	let r = n.properties || {}, i = Array.isArray(n.required) ? n.required.filter((e) => e !== "component" && e !== "id") : [], a = n.unevaluatedProperties ?? n.additionalProperties;
	return {
		props: r,
		reqList: i,
		additionalProps: typeof a == "boolean" || typeof a == "object" && a ? a : void 0
	};
}
function Rv(e, t, n, r, i) {
	let { props: a, reqList: o, additionalProps: s } = Lv(t, n), { component: c, id: l, ...u } = a, d = {
		id: { $ref: "#/$defs/ComponentId" },
		...u,
		component: { const: e }
	}, f = [
		"id",
		...o,
		"component"
	], p;
	return p = i?.componentEnvelopeRef ? {
		allOf: [{ $ref: i.componentEnvelopeRef }, {
			type: "object",
			properties: d,
			required: f
		}],
		unevaluatedProperties: s !== void 0 && s
	} : {
		type: "object",
		properties: d,
		required: f,
		unevaluatedProperties: s !== void 0 && s
	}, t.allowedParents && t.allowedParents.length > 0 && (p.allowedParents = t.allowedParents), t.allowedChildren && t.allowedChildren.length > 0 && (p.allowedChildren = t.allowedChildren), p;
}
function zv(e, t, n, r) {
	if (e.components.size === 0) {
		t.components = {};
		return;
	}
	let i = {};
	for (let [t, a] of e.components.entries()) i[t] = Rv(t, a, n, e, r);
	t.components = i, n.anyComponent = {
		oneOf: Array.from(e.components.keys()).map((e) => ({ $ref: `#/components/${e}` })),
		discriminator: { propertyName: "component" }
	};
}
function Bv(e, t, n) {
	let r;
	if (t.schema && typeof t.schema == "object" && "safeParse" in t.schema) {
		let e = Dv(t.schema, {
			target: "jsonSchema2019-09",
			$refStrategy: "none"
		});
		Fv(e), e.definitions && typeof e.definitions == "object" ? (Object.assign(n, e.definitions), delete e.definitions) : e.$defs && typeof e.$defs == "object" && (Object.assign(n, e.$defs), delete e.$defs), r = e;
	} else r = {
		type: "object",
		properties: {}
	};
	if (t.description && r.description === void 0 && (r.description = t.description), r.type === "object") {
		let e = r.unevaluatedProperties ?? r.additionalProperties, t = typeof e == "boolean" || typeof e == "object" && e ? e : void 0;
		r.additionalProperties !== void 0 && delete r.additionalProperties, r.unevaluatedProperties = t !== void 0 && t;
	}
	return r;
}
function Vv(e, t, n) {
	if (e.functions.size === 0) return;
	let r = {};
	for (let [t, i] of e.functions.entries()) r[t] = Bv(t, i, n);
	t.functions = r, n.anyFunction = { oneOf: Array.from(e.functions.keys()).map((e) => ({ $ref: `#/functions/${e}` })) };
}
function Hv(e, t, n = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !n.has(e)) {
		if (n.add(e), typeof e.$ref == "string") {
			let n = e.$ref;
			n.startsWith("#/$defs/") && t.add(n.substring(8));
		}
		if (Array.isArray(e)) for (let r of e) Hv(r, t, n);
		else for (let r of Object.values(e)) Hv(r, t, n);
	}
}
function Uv(e, t) {
	let n = {
		$schema: "https://json-schema.org/draft/2020-12/schema",
		catalogId: e.id
	};
	e.instructions && (n.instructions = e.instructions);
	let r = {};
	Iv(e, r), zv(e, n, r, t), Vv(e, n, r);
	let i = Mv(e, t), a;
	do {
		a = Object.keys(r).length;
		let e = /* @__PURE__ */ new Set();
		Hv(n, e), Hv(r, e), (e.has("DynamicString") || e.has("DynamicNumber") || e.has("DynamicBoolean") || e.has("DynamicValue")) && (e.add("DataBinding"), e.add("FunctionCall"));
		for (let t of e) t in i && !(t in r) && (r[t] = i[t]);
	} while (Object.keys(r).length > a);
	return Object.keys(r).length > 0 && (n.$defs = r), n;
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/catalog/reference-map.js
function Wv(e) {
	if (!e) return "";
	let t = e.lastIndexOf("#");
	return (t === -1 ? e : e.slice(t + 1)).split("/").filter(Boolean).pop() ?? "";
}
function Gv(e, t) {
	if (!e?._def) return null;
	if (t) {
		if (t.has(e)) return null;
		t.add(e);
	}
	switch (e._def.typeName) {
		case "ZodOptional":
		case "ZodNullable":
		case "ZodDefault":
		case "ZodReadonly": return e._def.innerType;
		case "ZodBranded": return e._def.type;
		case "ZodEffects": return e._def.schema;
		case "ZodLazy": return e._def.getter();
		default: return null;
	}
}
function Kv(e) {
	let t = [], n = /* @__PURE__ */ new Set(), r = e;
	for (; r;) {
		r.description && t.push(r.description), r._def?.description && t.push(r._def.description);
		let e = Gv(r, n);
		if (!e) break;
		r = e;
	}
	return t;
}
function qv(e) {
	let t = /* @__PURE__ */ new Set(), n = e;
	for (; n;) {
		let e = Gv(n, t);
		if (!e) break;
		n = e;
	}
	return n;
}
function Jv(e, t) {
	if (!e) return null;
	let n = Wv(e), r = t.childListRefNames, i = t.childRefNames;
	return r.has(n) ? {
		isChild: !1,
		isChildList: !0
	} : i.has(n) ? {
		isChild: !0,
		isChildList: !1
	} : null;
}
function Yv(e, t) {
	let n = !1;
	for (let r of e) {
		if (typeof r != "object" || !r) continue;
		let e = Zv(r, t);
		if (e.isChildList) return {
			isChild: !1,
			isChildList: !0
		};
		e.isChild && (n = !0);
	}
	return n ? {
		isChild: !0,
		isChildList: !1
	} : null;
}
function Xv(e, t) {
	let n = !1;
	for (let r of [
		"oneOf",
		"anyOf",
		"allOf"
	]) {
		let i = e[r];
		if (!Array.isArray(i)) continue;
		let a = Yv(i, t);
		if (a?.isChildList) return a;
		a?.isChild && (n = !0);
	}
	return n ? {
		isChild: !0,
		isChildList: !1
	} : null;
}
function Zv(e, t) {
	let n = Jv(typeof e.$ref == "string" ? e.$ref : "", t);
	if (n) return n;
	if (e.type === "array" && e.items) {
		let n = Zv(e.items, t);
		if (n.isChild || n.isChildList) return {
			isChild: !1,
			isChildList: !0
		};
	}
	return Xv(e, t) || (e.type === "object" && e.properties && ("componentId" in e.properties && ("path" in e.properties || "dataBinding" in e.properties) || "explicitList" in e.properties || "template" in e.properties) ? {
		isChild: !1,
		isChildList: !0
	} : {
		isChild: !1,
		isChildList: !1
	});
}
function Qv(e) {
	if (e?._def?.typeName === "ZodObject" && typeof e._def.shape == "function") {
		let t = e._def.shape();
		return !!(t.componentId && (t.path || t.dataBinding) || t.explicitList || t.template);
	}
	return !1;
}
function $v(e, t) {
	return e?._def?.typeName === "ZodArray" && ay(qv(e._def.type), t).isChild;
}
function ey(e, t) {
	let n = !1, r = !1, i = !1;
	for (let a of e) {
		let e = qv(a);
		Qv(e) && (n = !0), $v(e, t) && (r = !0);
		let o = ay(e, t);
		if (o.isChildList) return {
			isChild: !1,
			isChildList: !0
		};
		o.isChild && (i = !0);
	}
	return n || r ? {
		isChild: !1,
		isChildList: !0
	} : i ? {
		isChild: !0,
		isChildList: !1
	} : {
		isChild: !1,
		isChildList: !1
	};
}
function ty(e, t) {
	if (!e) return !1;
	if (e.startsWith("REF:")) {
		let n = Wv(e.substring(4).split("|")[0]);
		if (t.has(n)) return !0;
	}
	let n = Wv(e.split("|")[0]);
	if (n && t.has(n)) return !0;
	let r = e.trim();
	return !!t.has(r);
}
function ny(e, t) {
	if (!e) return !1;
	if (e.startsWith("REF:")) {
		let n = Wv(e.substring(4).split("|")[0]);
		if (t.has(n)) return !0;
	}
	let n = Wv(e.split("|")[0]);
	if (n && t.has(n)) return !0;
	let r = e.trim();
	return !!t.has(r);
}
function ry(e, t) {
	let n = t.childListRefNames, r = t.childRefNames;
	for (let t of e) {
		if (ty(t, n)) return {
			isChild: !1,
			isChildList: !0
		};
		if (ny(t, r)) return {
			isChild: !0,
			isChildList: !1
		};
	}
	return null;
}
function iy(e, t) {
	let n = ay(e, t);
	return n.isChild || n.isChildList ? {
		isChild: !1,
		isChildList: !0
	} : {
		isChild: !1,
		isChildList: !1
	};
}
function ay(e, t) {
	if (!e || typeof e != "object") return {
		isChild: !1,
		isChildList: !1
	};
	let n = Ng(e);
	if (n === "component-id") return {
		isChild: !0,
		isChildList: !1
	};
	if (n === "child-list") return {
		isChild: !1,
		isChildList: !0
	};
	let r = ry(Kv(e), t);
	if (r) return r;
	let i = qv(e);
	if (!i?._def) return Zv(e, t);
	let a = Ng(i);
	if (a === "component-id") return {
		isChild: !0,
		isChildList: !1
	};
	if (a === "child-list") return {
		isChild: !1,
		isChildList: !0
	};
	let o = i._def.typeName;
	if (o === "ZodArray") return iy(qv(i._def.type), t);
	if (o === "ZodUnion") return ey(i._def.options ?? [], t);
	if (o === "ZodObject" && typeof i._def.shape == "function") {
		let e = i._def.shape();
		if (e.componentId && (e.path || e.dataBinding) || e.explicitList || e.template) return {
			isChild: !1,
			isChildList: !0
		};
	}
	return {
		isChild: !1,
		isChildList: !1
	};
}
function oy(e, t, n) {
	let r = e.nestedRefs[t];
	r ? r.add(n) : e.nestedRefs[t] = /* @__PURE__ */ new Set([n]);
}
function sy(e, t, n, r) {
	let i = ay(t, r);
	if (i.isChildList) {
		n.listRefs.add(e);
		return;
	}
	if (i.isChild) {
		n.singleRefs.add(e);
		return;
	}
	let a = qv(t);
	if (a?._def?.typeName !== "ZodArray") return;
	let o = qv(a._def.type);
	if (o?._def?.typeName !== "ZodObject" || typeof o._def.shape != "function") return;
	let s = o._def.shape();
	for (let [t, i] of Object.entries(s)) {
		let a = ay(i, r);
		(a.isChild || a.isChildList) && (n.listRefs.add(e), oy(n, e, t));
	}
}
function cy(e) {
	if (typeof e != "object" || !e) return null;
	let t = e;
	if (t.type !== "array" && !("items" in t)) return null;
	let n = t.items;
	if (typeof n != "object" || !n) return null;
	let r = n.properties;
	return typeof r != "object" || !r ? null : r;
}
function ly(e, t, n) {
	for (let [r, i] of Object.entries(e)) {
		let e = ay(i, n);
		if (e.isChildList) {
			t.listRefs.add(r);
			continue;
		}
		if (e.isChild) {
			t.singleRefs.add(r);
			continue;
		}
		let a = cy(i);
		if (a) for (let [e, i] of Object.entries(a)) {
			let a = ay(i, n);
			(a.isChild || a.isChildList) && (t.listRefs.add(r), oy(t, r, e));
		}
	}
}
function uy(e, t, n) {
	if (!e) return;
	let r = qv(e);
	if (r?._def?.typeName === "ZodObject" && typeof r._def.shape == "function") {
		let e = r._def.shape();
		for (let [r, i] of Object.entries(e)) sy(r, i, t, n);
	} else if (typeof e == "object" && e && "properties" in e) {
		let r = e.properties;
		typeof r == "object" && r && ly(r, t, n);
	}
}
function dy(e, t) {
	let n = {}, r = typeof e?.components?.values == "function" ? Array.from(e.components.values()) : Array.isArray(e) ? e : Array.from(e.values());
	for (let e of r) {
		let r = {
			singleRefs: /* @__PURE__ */ new Set(),
			listRefs: /* @__PURE__ */ new Set(),
			nestedRefs: {}
		};
		uy(e.schema, r, t), n[e.name] = {
			singleRefs: r.singleRefs,
			listRefs: r.listRefs,
			nestedRefs: r.nestedRefs
		};
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/catalog/types.js
function fy(e, t) {
	return {
		name: e.name,
		returnType: e.returnType,
		schema: e.schema,
		allowedCallers: e.allowedCallers,
		requiresUserActivation: e.requiresUserActivation,
		description: e.description,
		execute: t
	};
}
var py = class {
	get catalogSchema() {
		return this.cachedCatalogSchema ||= Uv(this), this.cachedCatalogSchema;
	}
	get componentRefMap() {
		return this._componentRefMap ||= dy(this, kv), this._componentRefMap;
	}
	constructor(e, t, n = [], r = [], i, a) {
		if (!t) throw new Dg("protocolVersion must be provided.");
		this.id = e, this.protocolVersion = t;
		let o = /* @__PURE__ */ new Map();
		for (let e of n) o.set(e.name, e);
		this.components = o;
		let s = /* @__PURE__ */ new Map();
		for (let e of r) s.set(e.name, e);
		this.functions = s, this.themeSchema = i, this.instructions = a, this.invoker = (e, t, n, r) => {
			let i = this.functions.get(e);
			if (!i) throw new Tg(`Function not found in catalog '${this.id}': ${e}`, e);
			let a = i.execute;
			if (typeof a != "function") throw new Tg(`Function '${e}' in catalog '${this.id}' is schema-only and has no implementation.`, e);
			try {
				let e = i.schema.parse(t);
				return a.call(i, e, n, r);
			} catch (t) {
				throw t?.name === "ZodError" || t instanceof Um ? new Tg(`Validation failed for function '${e}': ${t.message}`, e, t.errors ?? t.issues) : t;
			}
		};
	}
	static fromSchema(e, t) {
		return T_(e, t);
	}
}, my = class {
	constructor() {
		this.listeners = /* @__PURE__ */ new Set();
	}
	subscribe(e) {
		return this.listeners.add(e), { unsubscribe: () => this.listeners.delete(e) };
	}
	async emit(e) {
		for (let t of this.listeners) try {
			await t(e);
		} catch (e) {
			console.error("EventEmitter error:", e);
		}
	}
	dispose() {
		this.listeners.clear();
	}
}, hy = Symbol.for("preact-signals");
function gy() {
	if (Sy > 1) Sy--;
	else {
		var e, t = !1;
		for ((function() {
			var e = Ey;
			for (Ey = void 0; e !== void 0;) {
				var t = e.S;
				if (t.v === e.v) for (var n = t.t; n !== void 0; n = n.x) n.i === e.i && (n.i = t.i);
				e = e.o;
			}
		})(); xy !== void 0;) {
			var n = xy;
			for (xy = void 0, Cy++; n !== void 0;) {
				var r = n.u;
				if (n.u = void 0, n.f &= -3, !(8 & n.f) && jy(n)) try {
					n.c();
				} catch (n) {
					t ||= (e = n, !0);
				}
				n = r;
			}
		}
		if (Cy = 0, Sy--, t) throw e;
	}
}
function _y(e) {
	if (Sy > 0) return e();
	Ty = ++wy, Sy++;
	try {
		return e();
	} finally {
		gy();
	}
}
var vy, yy = void 0;
function by(e) {
	var t = yy, n = vy;
	yy = void 0, vy = void 0;
	try {
		return e();
	} finally {
		yy = t, vy = n;
	}
}
var xy = void 0, Sy = 0, Cy = 0, wy = 0, Ty = 0, Ey = void 0, Dy = 0;
function Oy(e) {
	if (yy !== void 0) {
		var t = e.n;
		if (t === void 0 || t.t !== yy) return t = {
			i: 0,
			S: e,
			p: yy.s,
			n: void 0,
			t: yy,
			e: void 0,
			x: void 0,
			r: t
		}, yy.s !== void 0 && (yy.s.n = t), yy.s = t, e.n = t, 32 & yy.f && e.S(t), t;
		if (t.i === -1) return t.i = 0, t.n !== void 0 && (t.n.p = t.p, t.p !== void 0 && (t.p.n = t.n), t.p = yy.s, t.n = void 0, yy.s.n = t, yy.s = t), t;
	}
}
function ky(e, t) {
	this.v = e, this.i = 0, this.n = void 0, this.t = void 0, this.l = 0, this.W = t?.watched, this.Z = t?.unwatched, this.name = t?.name;
}
ky.prototype.brand = hy, ky.prototype.h = function() {
	return !0;
}, ky.prototype.S = function(e) {
	var t = this, n = this.t;
	n !== e && e.e === void 0 && (e.x = n, this.t = e, n === void 0 ? by(function() {
		var e;
		(e = t.W) == null || e.call(t);
	}) : n.e = e);
}, ky.prototype.U = function(e) {
	var t = this;
	if (this.t !== void 0) {
		var n = e.e, r = e.x;
		n !== void 0 && (n.x = r, e.e = void 0), r !== void 0 && (r.e = n, e.x = void 0), e === this.t && (this.t = r, r === void 0 && by(function() {
			var e;
			(e = t.Z) == null || e.call(t);
		}));
	}
}, ky.prototype.subscribe = function(e) {
	var t = this;
	return By(function() {
		var n = t.value;
		by(function() {
			return e(n);
		});
	}, { name: "sub" });
}, ky.prototype.valueOf = function() {
	return this.value;
}, ky.prototype.toString = function() {
	return this.value + "";
}, ky.prototype.toJSON = function() {
	return this.value;
}, ky.prototype.peek = function() {
	var e = this;
	return by(function() {
		return e.value;
	});
}, Object.defineProperty(ky.prototype, "value", {
	get: function() {
		var e = Oy(this);
		return e !== void 0 && (e.i = this.i), this.v;
	},
	set: function(e) {
		if (e !== this.v) {
			if (Cy > 100) throw Error("Cycle detected");
			(function(e) {
				Sy !== 0 && Cy === 0 && e.l !== Ty && (e.l = Ty, Ey = {
					S: e,
					v: e.v,
					i: e.i,
					o: Ey
				});
			})(this), this.v = e, this.i++, Dy++, Sy++;
			try {
				for (var t = this.t; t !== void 0; t = t.x) t.t.N();
			} finally {
				gy();
			}
		}
	}
});
function Ay(e, t) {
	return new ky(e, t);
}
function jy(e) {
	for (var t = e.s; t !== void 0; t = t.n) if (t.S.i !== t.i || !t.S.h() || t.S.i !== t.i) return !0;
	return !1;
}
function My(e) {
	for (var t = e.s; t !== void 0; t = t.n) {
		var n = t.S.n;
		if (n !== void 0 && (t.r = n), t.S.n = t, t.i = -1, t.n === void 0) {
			e.s = t;
			break;
		}
	}
}
function Ny(e) {
	for (var t = e.s, n = void 0; t !== void 0;) {
		var r = t.p;
		t.i === -1 ? (t.S.U(t), r !== void 0 && (r.n = t.n), t.n !== void 0 && (t.n.p = r)) : n = t, t.S.n = t.r, t.r !== void 0 && (t.r = void 0), t = r;
	}
	e.s = n;
}
function Py(e, t) {
	ky.call(this, void 0, t), this.x = e, this.s = void 0, this.g = Dy - 1, this.f = 4;
}
Py.prototype = new ky(), Py.prototype.h = function() {
	if (this.f &= -3, 1 & this.f) return !1;
	if ((36 & this.f) == 32 || (this.f &= -5, this.g === Dy)) return !0;
	if (this.g = Dy, this.f |= 1, this.i > 0 && !jy(this)) return this.f &= -2, !0;
	var e = yy;
	try {
		My(this), yy = this;
		var t = this.x();
		(16 & this.f || this.v !== t || this.i === 0) && (this.v = t, this.f &= -17, this.i++);
	} catch (e) {
		this.v = e, this.f |= 16, this.i++;
	}
	return yy = e, Ny(this), this.f &= -2, !0;
}, Py.prototype.S = function(e) {
	if (this.t === void 0) {
		this.f |= 36;
		for (var t = this.s; t !== void 0; t = t.n) t.S.S(t);
	}
	ky.prototype.S.call(this, e);
}, Py.prototype.U = function(e) {
	if (this.t !== void 0 && (ky.prototype.U.call(this, e), this.t === void 0)) {
		this.f &= -33;
		for (var t = this.s; t !== void 0; t = t.n) t.S.U(t);
	}
}, Py.prototype.N = function() {
	if (!(2 & this.f)) {
		this.f |= 6;
		for (var e = this.t; e !== void 0; e = e.x) e.t.N();
	}
}, Object.defineProperty(Py.prototype, "value", { get: function() {
	if (1 & this.f) throw Error("Cycle detected");
	var e = Oy(this);
	if (this.h(), e !== void 0 && (e.i = this.i), 16 & this.f) throw this.v;
	return this.v;
} });
function Fy(e, t) {
	return new Py(e, t);
}
function Iy(e) {
	var t = e.m;
	if (e.m = void 0, typeof t == "function") {
		Sy++;
		var n = yy;
		yy = void 0;
		try {
			t();
		} catch (t) {
			throw e.f &= -2, e.f |= 8, Ly(e), t;
		} finally {
			yy = n, gy();
		}
	}
}
function Ly(e) {
	for (var t = e.s; t !== void 0; t = t.n) t.S.U(t);
	e.x = void 0, e.s = void 0, Iy(e);
}
function Ry(e) {
	if (yy !== this) throw Error("Out-of-order effect");
	Ny(this), yy = e, this.f &= -2, 8 & this.f && Ly(this), gy();
}
function zy(e, t) {
	this.x = e, this.m = void 0, this.s = void 0, this.u = void 0, this.f = 32, this.name = t?.name, vy && vy.push(this);
}
zy.prototype.c = function() {
	var e = this.S();
	try {
		if (8 & this.f || this.x === void 0) return;
		var t = this.x();
		typeof t == "function" && (this.m = t);
	} finally {
		e();
	}
}, zy.prototype.S = function() {
	if (1 & this.f) throw Error("Cycle detected");
	this.f |= 1, this.f &= -9, Iy(this), My(this), Sy++;
	var e = yy;
	return yy = this, Ry.bind(this, e);
}, zy.prototype.N = function() {
	2 & this.f || (this.f |= 2, this.u = xy, xy = this);
}, zy.prototype.d = function() {
	this.f |= 8, 1 & this.f || Ly(this);
}, zy.prototype.dispose = function() {
	this.d();
};
function By(e, t) {
	var n = new zy(e, t);
	try {
		n.c();
	} catch (e) {
		throw n.d(), e;
	}
	var r = n.d.bind(n);
	return r[Symbol.dispose] = r, r;
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/reactivity/signals.js
var Vy, Hy, Uy, Wy, Gy, Ky, qy, Jy;
Yy({
	signal: Ay,
	computed: Fy,
	effect: By,
	batchWrite: _y,
	isSignal: (e) => !!e && typeof e == "object" && "value" in e && "peek" in e,
	getValue: (e) => e.value,
	setValue: (e, t) => {
		e instanceof Py || (e.value = t);
	},
	peekValue: (e) => e.peek()
});
function Yy(e) {
	Vy = e.signal, Hy = e.computed, Uy = e.effect, Wy = e.batchWrite, Gy = e.isSignal, Ky = e.getValue, qy = e.setValue, Jy = e.peekValue;
}
function Xy(e) {
	return Vy(e);
}
function Zy(e) {
	return Hy(e);
}
function Qy(e) {
	return Uy(e);
}
function $y(e) {
	return Wy(e);
}
function eb(e) {
	return Gy(e);
}
function tb(e) {
	return Ky(e);
}
function nb(e, t) {
	qy(e, t);
}
function rb(e) {
	return Jy(e);
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/state/data-model.js
function ib(e) {
	return /^(0|[1-9]\d*)$/.test(e);
}
var ab = 1e4, ob = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]), sb = class {
	constructor(e = {}) {
		this.data = {}, this.signals = /* @__PURE__ */ new Map(), this.subscriptions = /* @__PURE__ */ new Set(), this.data = e;
	}
	getSignal(e) {
		let t = this.normalizePath(e);
		return this.signals.has(t) || this.signals.set(t, Xy(this.get(t))), this.signals.get(t);
	}
	set(e, t) {
		if (e == null) throw new wg("Path cannot be null or undefined.");
		if (e === "/" || e === "") return this.data = t ?? {}, this.notifyAllSignals(), this;
		let n = this.parsePath(e), r = n.pop();
		if (t == null && this.get(e) === void 0) return this;
		if (this.data === void 0 || this.data === null) this.data = {};
		else if (typeof this.data != "object") throw new wg(`Cannot set path '${e}': the data model root is a primitive value.`, e);
		let i = this.data;
		for (let t = 0; t < n.length; t++) {
			let a = n[t];
			if (Array.isArray(i)) {
				if (!ib(a)) throw new wg(`Cannot use non-numeric segment '${a}' on an array in path '${e}'.`, e);
				let o = parseInt(a, 10);
				if (o > 1e4) throw new wg(`Cannot set path '${e}': array index '${a}' exceeds maximum supported index (${ab}).`, e);
				let s = i[o];
				if (s != null && typeof s != "object") throw new wg(`Cannot set path '${e}': segment '${a}' is a primitive value.`, e);
				if (s == null) {
					let a = t < n.length - 1 ? n[t + 1] : r;
					if (ib(a)) {
						if (parseInt(a, 10) > 1e4) throw new wg(`Cannot set path '${e}': array index '${a}' exceeds maximum supported index (${ab}).`, e);
						i[o] = [];
					} else i[o] = {};
				}
			} else {
				let o = Object.prototype.hasOwnProperty.call(i, a);
				if (o) {
					let t = i[a];
					if (t != null && typeof t != "object") throw new wg(`Cannot set path '${e}': segment '${a}' is a primitive value.`, e);
				}
				if (!o || i[a] === void 0 || i[a] === null) {
					let o = t < n.length - 1 ? n[t + 1] : r;
					if (ib(o)) {
						if (parseInt(o, 10) > 1e4) throw new wg(`Cannot set path '${e}': array index '${o}' exceeds maximum supported index (${ab}).`, e);
						i[a] = [];
					} else i[a] = {};
				}
			}
			i = i[a];
		}
		if (Array.isArray(i)) {
			if (!ib(r)) throw new wg(`Cannot use non-numeric segment '${r}' on an array in path '${e}'.`, e);
			if (parseInt(r, 10) > 1e4) throw new wg(`Cannot set path '${e}': array index '${r}' exceeds maximum supported index (${ab}).`, e);
		}
		if (t == null) {
			if (Array.isArray(i)) {
				let e = parseInt(r, 10);
				e < i.length && (i[e] = void 0);
			} else delete i[r];
		} else i[r] = t;
		return this.notifySignals(e), this;
	}
	delete(e) {
		return this.set(e, void 0);
	}
	static resolvePath(e, t) {
		return e.startsWith("/") ? e : t ? `${t.endsWith("/") ? t : `${t}/`}${e}` : `/${e}`;
	}
	get(e) {
		if (e == null) throw new wg("Path cannot be null or undefined.");
		if (e === "/" || e === "") return this.data;
		let t = this.parsePath(e), n = this.data;
		for (let e of t) {
			if (typeof n != "object" || !n) return;
			if (Array.isArray(n)) {
				if (!ib(e)) return;
				let t = parseInt(e, 10);
				if (t < 0 || t >= n.length) return;
				n = n[t];
			} else {
				if (!Object.prototype.hasOwnProperty.call(n, e)) return;
				n = n[e];
			}
		}
		return n;
	}
	hasPath(e) {
		return e != null && this.get(e) !== void 0;
	}
	subscribe(e, t) {
		let n = this.getSignal(e), r = !0, i = rb(n), a = Qy(() => {
			let e = tb(n);
			i = e, r || t(e);
		});
		return r = !1, this.subscriptions.add(a), {
			get value() {
				return i;
			},
			unsubscribe: () => {
				a(), this.subscriptions.delete(a);
			}
		};
	}
	dispose() {
		for (let e of this.subscriptions) e();
		this.subscriptions.clear(), this.signals.clear();
	}
	normalizePath(e) {
		return e.length > 1 && e.endsWith("/") ? e.slice(0, -1) : e || "/";
	}
	parsePath(e) {
		return e.split("/").filter((e) => e.length > 0).map((t) => {
			let n = t.replace(/~([01])/g, (e, t) => t === "1" ? "/" : "~");
			if (ob.has(n)) throw new wg(`Forbidden path segment '${n}' in path '${e}'.`, e);
			return n;
		});
	}
	notifySignals(e) {
		let t = this.normalizePath(e);
		$y(() => {
			this.updateSignal(t);
			let e = t;
			for (; e !== "/" && e !== "";) e = e.substring(0, e.lastIndexOf("/")) || "/", this.updateSignal(e);
			for (let e of this.signals.keys()) this.isDescendant(e, t) && this.updateSignal(e);
		});
	}
	updateSignal(e) {
		let t = this.signals.get(e);
		if (t) {
			let n = this.get(e);
			Array.isArray(n) ? nb(t, n.slice()) : typeof n == "object" && n ? nb(t, { ...n }) : nb(t, n);
		}
	}
	notifyAllSignals() {
		$y(() => {
			for (let e of this.signals.keys()) this.updateSignal(e);
		});
	}
	isDescendant(e, t) {
		return t === "/" || t === "" ? e !== "/" : e.startsWith(t + "/");
	}
}, cb = /^(?:(?:\/(?:[^~/]|~[01])*)*|(?:[^~/]|~[01])+(?:\/(?:[^~/]|~[01])*)*)$/;
function* lb(e, t, n) {
	if (typeof e == "string") yield [e, t];
	else if (Array.isArray(e)) for (let r = 0; r < e.length; r++) {
		let i = e[r];
		yield* lb(i, `${t}[${r}]`, n);
	}
	else if (typeof e == "object" && e) {
		let r = e;
		if ("componentId" in r && typeof r.componentId == "string" && ("path" in r || "dataBinding" in r)) yield [r.componentId, `${t}.componentId`];
		else if (n?.size) for (let e of n) e in r && (yield* lb(r[e], `${t}.${e}`));
		else for (let [e, n] of Object.entries(r)) yield* lb(n, `${t}.${e}`);
	}
}
function ub(e) {
	return e.componentRefMap;
}
function* db(e, t) {
	if (!e || typeof e != "object") return;
	let n = t instanceof py ? ub(t) : t, r = e.component, i = "", a = e;
	if (typeof r == "string") i = r;
	else if (typeof r == "object" && r) {
		let e = r;
		i = Object.keys(e)[0] ?? "", a = e[i] ?? {};
	}
	if (!i || typeof a != "object" || !a) return;
	let o = n[i], s = o ? o.singleRefs : /* @__PURE__ */ new Set(), c = o ? o.listRefs : /* @__PURE__ */ new Set(), l = o?.nestedRefs;
	for (let [e, t] of Object.entries(a)) (s.has(e) || c.has(e)) && (yield* lb(t, e, l?.[e]));
}
Object.freeze({
	allowOrphanComponents: !1,
	allowDanglingReferences: !1,
	allowMissingRoot: !1,
	allowUnknownElements: !1
}), Object.freeze({
	allowOrphanComponents: !0,
	allowDanglingReferences: !0,
	allowMissingRoot: !0,
	allowUnknownElements: !0
});
function fb(e, t, n) {
	if (t > 50) throw new kg("Global recursion limit exceeded: Depth > 50");
	if (Array.isArray(e)) for (let r of e) fb(r, t + 1, n);
	else if (typeof e == "object" && e) {
		let r = e;
		if ("path" in r && typeof r.path == "string") {
			let e = r.path;
			if (!cb.test(e)) throw new $(`Invalid path syntax: '${e}'`);
		}
		let i = "functionCall" in r && typeof r.functionCall == "object" && r.functionCall !== null, a = "call" in r && "args" in r;
		if (i) {
			if (n >= 5) throw new kg("Recursion limit exceeded: functionCall depth > 5");
			for (let [e, i] of Object.entries(r)) e === "functionCall" ? fb(i, t + 1, n + 1) : fb(i, t + 1, n);
		} else if (a) {
			if (n >= 5) throw new kg("Recursion limit exceeded: functionCall depth > 5");
			for (let [e, i] of Object.entries(r)) e === "args" ? fb(i, t + 1, n + 1) : fb(i, t + 1, n);
		} else for (let e of Object.values(r)) fb(e, t + 1, n);
	}
}
function pb(e) {
	fb(e, 0, 0);
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/state/surface-components-model.js
var mb = class {
	constructor(e) {
		this.components = /* @__PURE__ */ new Map(), this._onCreated = new my(), this._onDeleted = new my(), this.onCreated = this._onCreated, this.onDeleted = this._onDeleted, e && this.setCatalog(e);
	}
	setCatalog(e) {
		this.refMap = e instanceof py ? e.componentRefMap : e;
	}
	get(e) {
		return this.components.get(e);
	}
	getAll() {
		return new Map(this.components);
	}
	has(e) {
		return this.components.has(e);
	}
	get entries() {
		return this.components.entries();
	}
	get keys() {
		return this.components.keys();
	}
	get values() {
		return this.components.values();
	}
	get size() {
		return this.components.size;
	}
	get componentsMap() {
		return this.components;
	}
	addComponent(e) {
		if (this.components.has(e.id)) throw new Eg(`Component with id '${e.id}' already exists.`);
		this.components.set(e.id, e), this._onCreated.emit(e);
	}
	removeComponent(e) {
		let t = this.components.get(e);
		t && (this.components.delete(e), t.dispose(), this._onDeleted.emit(e));
	}
	getChildReferences(e) {
		let t = this.components.get(e);
		if (!t) return [];
		let n = t.catalog?.components.size ? t.catalog.componentRefMap : this.refMap ?? t.catalog?.componentRefMap ?? {};
		return Array.from(db({
			id: t.id,
			component: t.type,
			...t.properties
		}, n));
	}
	getChildIds(e) {
		return this.getChildReferences(e).map(([e]) => e);
	}
	detectCycles(e = {}) {
		let t = e.rootId ?? "root", n = e.maxDepth ?? 50, r = e.allowMissingRoot ?? !1;
		for (let e of this.components.values()) for (let [t, n] of this.getChildReferences(e.id)) if (t === e.id) throw new kg(`Circular reference detected: Component '${e.id}' references itself in field '${n}' (Self-reference detected)`);
		let i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = (e, t) => {
			if (t > n) throw new kg(`Global recursion limit exceeded: logical depth > ${n}`);
			i.add(e), a.add(e);
			let r = this.getChildIds(e);
			for (let e of r) if (this.components.has(e)) {
				if (!i.has(e)) o(e, t + 1);
				else if (a.has(e)) throw new kg(`Circular reference detected involving component '${e}'`);
			}
			a.delete(e);
		};
		if (r) {
			let e = Array.from(this.components.keys()).sort();
			for (let t of e) i.has(t) || o(t, 0);
		} else this.components.has(t) && o(t, 0);
		return i;
	}
	validateTopology(e = {}) {
		if (this.components.size === 0) return;
		let t = e.rootId ?? "root", n = e.allowMissingRoot ?? !1, r = e.allowDanglingReferences ?? !1, i = e.allowOrphanComponents ?? !1;
		if (!n && !this.components.has(t)) throw new Og(`Missing root component: No component has id='${t}'`);
		if (!r) {
			for (let e of this.components.values()) for (let [t, n] of this.getChildReferences(e.id)) if (!this.components.has(t)) throw new Og(`Component '${e.id}' references non-existent component '${t}' in field '${n}' (Dangling reference '${t}' in component '${e.id}')`);
		}
		let a = this.detectCycles({
			rootId: t,
			allowMissingRoot: n,
			maxDepth: e.maxDepth
		});
		if (!i && !n && a.size < this.components.size) {
			let e = Array.from(this.components.keys()).filter((e) => !a.has(e)).sort();
			if (e.length > 0) throw new Og(`Component '${e[0]}' is not reachable from '${t}' (Orphaned component '${e[0]}' is not reachable from root)`);
		}
	}
	validateReferences(e = {}) {
		let t = [];
		try {
			this.validateTopology(e);
		} catch (e) {
			e instanceof $ ? t.push(e) : e instanceof Error && t.push(new $(e.message));
		}
		return t;
	}
	dispose() {
		for (let e of this.components.values()) e.dispose();
		this.components.clear(), this._onCreated.dispose(), this._onDeleted.dispose();
	}
}, hb = class {
	constructor(e, t, n = /* @__PURE__ */ new Map(), r = {}, i = !1, a, o = "root") {
		if (this.id = e, this.defaultCatalog = t, this.theme = r, this.sendDataModel = i, this.rootId = o, this._onAction = new my(), this._onError = new my(), this._onWarning = new my(), this.onAction = this._onAction, this.onError = this._onError, this.onWarning = this._onWarning, n != null && !(n instanceof Map)) throw TypeError("availableCatalogs must be a Map, or undefined/null. Note that availableCatalogs is now the 3rd argument to SurfaceModel and theme is the 4th argument.");
		let s = new Map(n ?? []);
		t?.id && !s.has(t.id) && s.set(t.id, t), this.availableCatalogs = s, this.dataModel = a ?? new sb({}), this.componentsModel = new mb(t);
	}
	get catalog() {
		return this.defaultCatalog;
	}
	async dispatchAction(e, t) {
		if (!e || typeof e != "object") return;
		let n = gb(e);
		if (!n) return;
		let r = n.name;
		if (!r || typeof r != "string") return;
		let i = n.context, a = i && typeof i == "object" && !Array.isArray(i) ? i : {}, o = {
			name: r,
			surfaceId: this.id,
			sourceComponentId: t,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			context: a
		}, s = n.catalogId ?? e.catalogId;
		typeof s == "string" && s && (o.catalogId = s), typeof n.userMessage == "string" && n.userMessage.length > 0 && (o.userMessage = n.userMessage), await this._onAction.emit(o);
	}
	async dispatchError(e) {
		await this._onError.emit({
			...e,
			surfaceId: this.id
		});
	}
	async dispatchWarning(e) {
		await this._onWarning.emit({
			...e,
			surfaceId: this.id
		});
	}
	dispose() {
		this.dataModel.dispose(), this.componentsModel.dispose(), this._onAction.dispose(), this._onError.dispose(), this._onWarning.dispose();
	}
};
function gb(e) {
	return "event" in e && e.event && typeof e.event == "object" ? e.event : "name" in e && typeof e.name == "string" ? e : null;
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/state/surface-group-model.js
var _b = class {
	constructor() {
		this.surfaces = /* @__PURE__ */ new Map(), this.surfaceUnsubscribers = /* @__PURE__ */ new Map(), this._onSurfaceCreated = new my(), this._onSurfaceDeleted = new my(), this._onAction = new my(), this.onSurfaceCreated = this._onSurfaceCreated, this.onSurfaceDeleted = this._onSurfaceDeleted, this.onAction = this._onAction;
	}
	addSurface(e) {
		if (this.surfaces.has(e.id)) {
			console.warn(`Surface ${e.id} already exists. Ignoring.`);
			return;
		}
		this.surfaces.set(e.id, e);
		let t = e.onAction.subscribe((e) => this._onAction.emit(e));
		this.surfaceUnsubscribers.set(e.id, t), this._onSurfaceCreated.emit(e);
	}
	deleteSurface(e) {
		let t = this.surfaces.get(e);
		if (t) {
			let n = this.surfaceUnsubscribers.get(e);
			n && (n.unsubscribe(), this.surfaceUnsubscribers.delete(e)), this.surfaces.delete(e), t.dispose(), this._onSurfaceDeleted.emit(e);
		}
	}
	getSurface(e) {
		return this.surfaces.get(e);
	}
	get surfacesMap() {
		return this.surfaces;
	}
	dispose() {
		for (let e of Array.from(this.surfaces.keys())) this.deleteSurface(e);
		this._onSurfaceCreated.dispose(), this._onSurfaceDeleted.dispose(), this._onAction.dispose();
	}
}, vb = class {
	constructor(e, t, n, r) {
		this.id = e, this.type = t, this.catalog = r, this._onUpdated = new my(), this.onUpdated = this._onUpdated, this._properties = n;
	}
	get properties() {
		return this._properties;
	}
	set properties(e) {
		this._properties = e, this._onUpdated.emit(this);
	}
	dispose() {
		this._onUpdated.dispose();
	}
	get componentTree() {
		return {
			id: this.id,
			type: this.type,
			...this._properties
		};
	}
};
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/processing/format-zod-issue.js
function yb(e) {
	let t = e.path.join(".") || "root";
	switch (e.code) {
		case V.invalid_union: {
			let n = e.unionErrors?.flatMap((e) => e.issues);
			return n && n.length > 0 ? n.map(yb).join("; ") : `${t}: Invalid union`;
		}
		case V.unrecognized_keys: return `${t}: Unrecognized key(s) in object: ${e.keys.map((e) => `'${e}'`).join(", ")}`;
		case V.invalid_enum_value: {
			let n = e;
			return `${t}: Invalid enum value. Expected ${n.options.map((e) => String(e)).join(" | ")}, received '${String(n.received)}'`;
		}
		case V.invalid_type: {
			let n = e;
			return `${t}: Expected ${n.expected}, received ${n.received}`;
		}
		case V.custom: return `${t}: ${e.message}`;
		default: return e.message ? `${t}: ${e.message}` : `${t}: Validation error (${e.code})`;
	}
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/processing/adapters/base.js
var bb = {
	"0.8": /* @__PURE__ */ new Set(["0.8"]),
	"0.9": /* @__PURE__ */ new Set(["0.9", "0.9.1"]),
	"0.9.1": /* @__PURE__ */ new Set(["0.9.1", "0.9"]),
	"1.0": /* @__PURE__ */ new Set(["1.0"])
};
function xb(e, t, n = bb) {
	if (!e || !t) return !1;
	let r = e_(e), i = e_(t);
	if (r && i) {
		if (r === i) return !0;
		let a = n[i];
		if (a && a.has(r)) return !0;
		let o = $g(e), s = $g(t);
		return !!(o && s && o.major >= 1 && o.major === s.major);
	}
	if (typeof e != "string" || typeof t != "string") return !1;
	let a = Zg(e), o = Zg(t);
	return a.length > 0 && a === o;
}
var Sb;
function Cb(e) {
	Sb = e;
}
function wb(e, t) {
	for (let n of t) {
		let t = e[n];
		if (t && typeof t == "object") {
			let e = t;
			if ("surfaceId" in e && e.surfaceId !== void 0 && typeof e.surfaceId != "string") throw new $("surfaceId must be a string");
		}
	}
}
var Tb = class {
	get compatibleCatalogVersions() {
		let e = e_(this.version);
		return e ? /* @__PURE__ */ new Set([e]) : /* @__PURE__ */ new Set();
	}
	get validActions() {
		return new Set(this.getNativeActionKeys());
	}
	isCatalogCompatible(e) {
		return e ? xb(e, this.version) : !1;
	}
	extractOperations(e) {
		if (!e || typeof e != "object") return [];
		if (Array.isArray(e)) return e.flatMap((e) => this.extractOperations(e));
		let t = e;
		if (Array.isArray(t.messages)) return this.extractOperations(t.messages);
		let n = this.getNativeActionKeys();
		wb(t, n);
		let r = n.filter((e) => e in t).sort();
		if (r.length > 1) throw new $(`Message contains multiple conflicting update actions: ${r.join(", ")}.`);
		if (r.length === 0) {
			let e = Sb ? Sb() : new Set(n), r = Object.keys(t).find((t) => e.has(t) && !n.includes(t)), i = n.slice().sort().join(", ");
			throw r ? new $(`Invalid ${this.version} message: action '${r}' is not supported in protocol version ${this.version}. Allowed actions: ${i}.`) : new $(`Invalid ${this.version} message: message must contain exactly one update action: ${i}.`);
		}
		let i = this.preparePayloadForValidation(t), a = this.schema.safeParse(i);
		if (!a.success) {
			let e = a.error.errors.map(yb).join("; ");
			throw new $(`Invalid ${this.version} message: ${e}`, a.error);
		}
		return this.extractOperationsFromObject(t);
	}
	preparePayloadForValidation(e) {
		return "version" in e ? e : {
			version: this.version,
			...e
		};
	}
}, Eb = (e, t) => {
	let n = Object.keys(e).filter((t) => e[t] !== void 0);
	n.length !== 1 && t.addIssue({
		code: V.custom,
		message: `Must define exactly one property, found ${n.length} (${n.join(", ")}).`
	});
}, Db = Z({
	path: J().optional(),
	literalString: J().optional(),
	literal: J().optional()
}).strict().superRefine(Eb), Ob = bg(() => Z({
	key: J(),
	valueString: J().optional(),
	valueNumber: Y().optional(),
	valueBoolean: mg().optional(),
	valueMap: X(Ob).optional()
}).strict().superRefine((e, t) => {
	let n = 0;
	e.valueString !== void 0 && n++, e.valueNumber !== void 0 && n++, e.valueBoolean !== void 0 && n++, e.valueMap !== void 0 && n++, n !== 1 && t.addIssue({
		code: V.custom,
		message: `Value map item must have exactly one value property (valueString, valueNumber, valueBoolean, valueMap), found ${n}.`
	});
}));
function kb(e = {}) {
	let t = e.maxDepth ?? 5;
	return Ob.superRefine((e, n) => {
		let r = (e, i) => {
			if (i > t) n.addIssue({
				code: V.custom,
				message: `valueMap recursion exceeded maximum depth of ${t}.`
			});
			else if (e.valueMap && Array.isArray(e.valueMap)) for (let t of e.valueMap) r(t, i + 1);
		};
		r(e, 1);
	});
}
var Ab = kb();
Z({
	path: J().optional(),
	literalNumber: Y().optional(),
	literal: Y().optional()
}).strict().superRefine(Eb), Z({
	path: J().optional(),
	literalBoolean: mg().optional(),
	literal: mg().optional()
}).strict().superRefine(Eb);
var jb = Z({
	name: J().describe("A unique name identifying the action (e.g., 'submitForm')."),
	context: X(Z({
		key: J(),
		value: Z({
			path: J().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
			literalString: J().describe("A fixed, hardcoded string value.").optional(),
			literalNumber: Y().optional(),
			literalBoolean: mg().optional()
		}).describe("The dynamic value. Define EXACTLY ONE of the nested properties.").strict().superRefine(Eb)
	})).describe("A key-value map of data bindings to be resolved when the action is triggered.").optional()
});
Z({
	text: Db,
	usageHint: Q([
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"caption",
		"body"
	]).optional()
}), Z({
	url: Db,
	usageHint: Q([
		"icon",
		"avatar",
		"smallFeature",
		"mediumFeature",
		"largeFeature",
		"header"
	]).optional(),
	fit: Q([
		"contain",
		"cover",
		"fill",
		"none",
		"scale-down"
	]).optional(),
	altText: Db.optional()
}), Z({ name: Db }), Z({ url: Db }), Z({
	url: Db,
	description: Db.optional().describe("A label, title, or placeholder text.")
}), Z({ tabItems: X(Z({
	title: Z({
		path: J().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
		literalString: J().describe("A fixed, hardcoded string value.").optional()
	}),
	child: J().describe("A reference to a component instance by its unique ID.")
}).strict().superRefine((e, t) => {
	e.title || t.addIssue({
		code: V.custom,
		message: "Tab item is missing 'title'."
	}), e.child || t.addIssue({
		code: V.custom,
		message: "Tab item is missing 'child'."
	}), e.title && Eb(e.title, t);
})).describe("A list of tabs, each with a title and a child component ID.") }), Z({
	axis: Q(["horizontal", "vertical"]).optional().describe("The orientation."),
	color: J().optional().describe("The color of the divider (e.g., hex code or semantic name)."),
	thickness: Y().optional().describe("The thickness of the divider.")
}), Z({
	entryPointChild: J().describe("The ID of the component (e.g., a button) that triggers the modal."),
	contentChild: J().describe("The ID of the component to display as the modal's content.")
}), Z({
	child: J().describe("The ID of the component to display as the button's content."),
	action: jb.describe("Represents a user-initiated action."),
	primary: mg().optional().describe("Indicates if this button should be styled as the primary action.")
}), Z({
	label: Db,
	value: Z({
		path: J().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
		literalBoolean: mg().optional()
	}).strict().superRefine(Eb)
}), Z({
	text: Db.optional(),
	label: Db.describe("A label, title, or placeholder text."),
	textFieldType: Q([
		"shortText",
		"number",
		"date",
		"longText",
		"obscured"
	]).optional(),
	validationRegexp: J().optional().describe("A regex string to validate the input.")
}), Z({
	value: Db,
	enableDate: mg().optional(),
	enableTime: mg().optional(),
	outputFormat: J().optional().describe("The string format for the output (e.g., 'YYYY-MM-DD').")
}), Z({
	selections: Z({
		path: J().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
		literalArray: X(J()).optional()
	}).strict().superRefine(Eb),
	options: X(Z({
		label: Z({
			path: J().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
			literalString: J().describe("A fixed, hardcoded string value.").optional()
		}).strict().superRefine(Eb),
		value: J()
	})).optional(),
	maxAllowedSelections: Y().optional(),
	type: Q(["checkbox", "chips"]).optional(),
	filterable: mg().optional()
}), Z({
	value: Z({
		path: J().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
		literalNumber: Y().optional()
	}).strict().superRefine(Eb),
	minValue: Y().optional(),
	maxValue: Y().optional(),
	label: Db.optional()
});
var Mb = Z({
	componentId: J(),
	dataBinding: J()
}), Nb = Z({
	explicitList: X(J()).optional(),
	template: Mb.describe("A template for generating a dynamic list of children from a data model list. `componentId` is the component to use as a template, and `dataBinding` is the path to the map of components in the data model. Values in the map will define the list of children.").optional()
}).strict().superRefine(Eb);
Z({
	children: Nb,
	distribution: Q([
		"start",
		"center",
		"end",
		"spaceBetween",
		"spaceAround",
		"spaceEvenly"
	]).optional(),
	alignment: Q([
		"start",
		"center",
		"end",
		"stretch"
	]).optional()
}), Z({
	children: Nb,
	distribution: Q([
		"start",
		"center",
		"end",
		"spaceBetween",
		"spaceAround",
		"spaceEvenly"
	]).optional(),
	alignment: Q([
		"start",
		"center",
		"end",
		"stretch"
	]).optional()
}), Z({
	children: Nb,
	direction: Q(["vertical", "horizontal"]).optional(),
	alignment: Q([
		"start",
		"center",
		"end",
		"stretch"
	]).optional()
}), Z({ child: J().describe("The ID of the component to be rendered inside the card.") });
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/v0_8/schema/server-to-client.js
var Pb = Ab.describe("A single data entry. Exactly one 'value*' property should be provided alongside the key."), Fb = yg(hg()).refine((e) => Object.keys(e).length === 1, "A wrapper object that MUST contain exactly one key, which is the name of the component type (e.g., 'Heading')."), Ib = Z({
	id: J().describe("The unique identifier for this component."),
	weight: Y().optional().describe("The relative weight of this component within a Row or Column. This corresponds to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column."),
	component: Fb.describe("A wrapper object that MUST contain exactly one key, which is the name of the component type (e.g., 'Heading'). The value is an object containing the properties for that specific component.")
}).strict().describe("Represents a *single* component in a UI widget tree. This component could be one of many supported types."), Lb = Z({
	surfaceId: J().describe("The unique identifier for the UI surface to be rendered."),
	catalogId: J().optional().describe("The identifier of the component catalog to use for this surface. If omitted, the client MUST default to the standard catalog for this A2UI version (https://a2ui.org/specification/v0_8/standard_catalog_definition.json)."),
	root: J().describe("The ID of the root component to render."),
	styles: Z({
		font: J().optional().describe("The primary font for the UI."),
		primaryColor: J().regex(/^#[0-9a-fA-F]{6}$/).optional().describe("The primary UI color as a hexadecimal code (e.g., '#00BFFF').")
	}).strict().optional().describe("Styling information for the UI.")
}).strict().describe("Signals the client to begin rendering a surface with a root component and specific styles."), Rb = Z({
	surfaceId: J().describe("The unique identifier for the UI surface to be updated. If you are adding a new surface this *must* be a new, unique identified that has never been used for any existing surfaces shown."),
	components: X(Ib).min(1).describe("A list containing all UI components for the surface.")
}).strict().superRefine((e, t) => {
	let n = /* @__PURE__ */ new Set();
	for (let r of e.components) r.id && (n.has(r.id) && t.addIssue({
		code: V.custom,
		message: `Duplicate component ID found: ${r.id}`,
		path: ["components"]
	}), n.add(r.id));
	let r = (e, r) => {
		for (let i of e) i && !n.has(i) && t.addIssue({
			code: V.custom,
			message: `Component '${r}' references non-existent component ID '${i}'.`,
			path: ["components"]
		});
	};
	for (let n of e.components) {
		if (!n.id || !n.component) continue;
		let e = Object.keys(n.component);
		if (e.length !== 1) continue;
		let i = e[0], a = n.component[i];
		switch (i) {
			case "Row":
			case "Column":
			case "List":
				if (a.children && !Array.isArray(a.children)) {
					let e = !!a.children.explicitList, i = !!a.children.template;
					(e && i || !e && !i) && t.addIssue({
						code: V.custom,
						message: `Component '${n.id}' must have either 'explicitList' or 'template' in children, but not both or neither.`
					}), e && r(a.children.explicitList, n.id), i && r([a.children.template?.componentId], n.id);
				}
				break;
			case "Card":
				a.child && r([a.child], n.id);
				break;
			case "Tabs":
				a.tabItems && Array.isArray(a.tabItems) && a.tabItems.forEach((e) => {
					e.child && r([e.child], n.id);
				});
				break;
			case "Modal":
				r([a.entryPointChild, a.contentChild], n.id);
				break;
			case "Button": a.child && r([a.child], n.id);
		}
	}
}).describe("Updates a surface with a new set of components."), zb = Z({
	surfaceId: J().describe("The unique identifier for the UI surface this data model update applies to."),
	path: J().optional().describe("An optional path to a location within the data model (e.g., '/user/name'). If omitted, or set to '/', the entire data model will be replaced."),
	contents: X(Pb).describe("An array of data entries. Each entry must contain a 'key' and exactly one corresponding typed 'value*' property.")
}).strict().describe("Updates the data model for a surface."), Bb = Z({ surfaceId: J().describe("The unique identifier for the UI surface to be deleted.") }).strict().describe("Signals the client to delete the surface identified by 'surfaceId'."), Vb = Z({
	beginRendering: Lb.optional(),
	surfaceUpdate: Rb.optional(),
	dataModelUpdate: zb.optional(),
	deleteSurface: Bb.optional()
}).strict().superRefine((e, t) => {
	Object.keys(e).filter((e) => [
		"beginRendering",
		"surfaceUpdate",
		"dataModelUpdate",
		"deleteSurface"
	].includes(e)).length !== 1 && t.addIssue({
		code: V.custom,
		message: "A2UI Protocol message must have exactly one of: surfaceUpdate, dataModelUpdate, beginRendering, deleteSurface."
	});
}).describe("Describes a JSON payload for an A2UI (Agent to UI) message, which is used to dynamically construct and update user interfaces. A message MUST contain exactly ONE of the action properties: 'beginRendering', 'surfaceUpdate', 'dataModelUpdate', or 'deleteSurface'.");
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/processing/adapters/v0_8.js
function Hb(e) {
	if (!e || typeof e != "object") return {
		id: "",
		component: ""
	};
	let t = e, n = typeof t.component == "string" ? t.component : "", r = {};
	for (let [e, n] of Object.entries(t)) e !== "component" && e !== "id" && (r[e] = n);
	if (t.component && typeof t.component == "object") {
		let e = t.component, i = Object.keys(e);
		if (i.length > 0) {
			n = i[0];
			let t = e[i[0]];
			t && typeof t == "object" && t && !Array.isArray(t) && Object.assign(r, t);
		}
	}
	return {
		...r,
		id: String(t.id ?? ""),
		component: n
	};
}
var Ub = class extends Tb {
	constructor() {
		super(...arguments), this.version = "v0.8", this.schema = Vb;
	}
	getNativeActionKeys() {
		return [
			"beginRendering",
			"surfaceUpdate",
			"dataModelUpdate",
			"deleteSurface"
		];
	}
	preparePayloadForValidation(e) {
		let t = { ...e };
		return delete t.version, t;
	}
	extractOperationsFromObject(e) {
		let t = [];
		if ("beginRendering" in e) {
			let n = e.beginRendering;
			t.push({
				type: "createSurface",
				surfaceId: String(n?.surfaceId ?? ""),
				catalogId: typeof n?.catalogId == "string" ? n.catalogId : void 0,
				theme: n?.theme ?? n?.styles,
				sendDataModel: !!n?.sendDataModel,
				components: Array.isArray(n?.components) ? n.components.map(Hb) : void 0,
				dataModel: n?.dataModel && typeof n.dataModel == "object" && !Array.isArray(n.dataModel) ? n.dataModel : void 0,
				version: typeof e.version == "string" ? e.version : this.version,
				rootId: typeof n?.root == "string" && n.root ? n.root : void 0
			});
		}
		if ("surfaceUpdate" in e) {
			let n = e.surfaceUpdate;
			t.push({
				type: "updateComponents",
				surfaceId: String(n?.surfaceId ?? ""),
				components: Array.isArray(n?.components) ? n.components.map(Hb) : []
			});
		}
		if ("dataModelUpdate" in e) {
			let n = e.dataModelUpdate, r = String(n?.surfaceId ?? "");
			if (Array.isArray(n?.contents)) {
				for (let e of n.contents) if (e && typeof e == "object" && typeof e.key == "string") {
					let n = "valueNumber" in e ? e.valueNumber : "valueString" in e ? e.valueString : "valueBoolean" in e ? e.valueBoolean : "valueObject" in e ? e.valueObject : "valueArray" in e ? e.valueArray : e.value;
					t.push({
						type: "updateDataModel",
						surfaceId: r,
						path: e.key,
						value: n
					});
				}
			} else t.push({
				type: "updateDataModel",
				surfaceId: r,
				path: typeof n?.path == "string" ? n.path : void 0,
				value: n?.value
			});
		}
		if ("deleteSurface" in e) {
			let n = e.deleteSurface;
			t.push({
				type: "deleteSurface",
				surfaceId: String(n?.surfaceId ?? "")
			});
		}
		return t;
	}
}, Wb = _g([
	Z({
		version: Q(["v0.9", "v0.9.1"]),
		createSurface: Z({
			surfaceId: J().describe("The unique identifier for the UI surface to be rendered."),
			catalogId: J().describe("A string that uniquely identifies this catalog. It is recommended to prefix this with an internet domain that you own, to avoid conflicts e.g. mycompany.com:somecatalog'."),
			theme: hg().optional(),
			sendDataModel: mg().describe("If true, the client will send the full data model of this surface in the metadata of every A2A message sent to the server that created the surface. Defaults to false.").optional()
		}).strict().describe("Signals the client to create a new surface and begin rendering it. It is an error to send 'createSurface' for a surfaceId that already exists without first deleting it. When this message is sent, the client will expect 'updateComponents' and/or 'updateDataModel' messages for the same surfaceId that define the component tree.")
	}).strict(),
	Z({
		version: Q(["v0.9", "v0.9.1"]),
		updateComponents: Z({
			surfaceId: J().describe("The unique identifier for the UI surface to be updated."),
			components: X(yg(J(), hg())).min(1).describe("A list containing all UI components for the surface.")
		}).strict().describe("Updates a surface with a new set of components. This message can be sent multiple times to update the component tree of an existing surface. One of the components in one of the components lists MUST have an 'id' of 'root' to serve as the root of the component tree. A createSurface message MUST have been previously sent for the 'surfaceId' in this message; the surface's catalog is the one specified by that createSurface.")
	}).strict(),
	Z({
		version: Q(["v0.9", "v0.9.1"]),
		updateDataModel: Z({
			surfaceId: J().describe("The unique identifier for the UI surface this data model update applies to."),
			path: J().describe("An optional path to a location within the data model (e.g., '/user/name'). If omitted, or set to '/', refers to the entire data model.").optional(),
			value: hg().describe("The data to be updated in the data model. If present, the value at 'path' is replaced (or created). If omitted, the key at 'path' is removed.").optional()
		}).strict().describe("Updates the data model for an existing surface. This message can be sent multiple times to update the data model. A createSurface message MUST have been previously sent for the 'surfaceId' in this message; the surface's catalog is the one specified by that createSurface.")
	}).strict(),
	Z({
		version: Q(["v0.9", "v0.9.1"]),
		deleteSurface: Z({ surfaceId: J().describe("The unique identifier for the UI surface to be deleted.") }).strict().describe("Signals the client to delete the surface identified by 'surfaceId'. A createSurface message MUST have been previously sent for the 'surfaceId' in this message; the surface's catalog is the one specified by that createSurface.")
	}).strict()
]);
Z({ messages: X(Wb).describe("A list of messages.") }).strict().describe("An object wrapping a list of messages.");
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/processing/adapters/v0_9.js
var Gb = class extends Tb {
	constructor() {
		super(...arguments), this.version = "v0.9", this.schema = Wb;
	}
	get compatibleCatalogVersions() {
		return /* @__PURE__ */ new Set(["0.9", "0.9.1"]);
	}
	getNativeActionKeys() {
		return [
			"createSurface",
			"updateComponents",
			"updateDataModel",
			"deleteSurface"
		];
	}
	extractOperationsFromObject(e) {
		let t = [];
		if ("createSurface" in e) {
			let n = e.createSurface;
			t.push({
				type: "createSurface",
				surfaceId: String(n?.surfaceId || ""),
				catalogId: typeof n?.catalogId == "string" ? n.catalogId : void 0,
				theme: n?.theme,
				sendDataModel: !!n?.sendDataModel,
				components: Array.isArray(n?.components) ? n.components : void 0,
				dataModel: n?.dataModel && typeof n.dataModel == "object" && !Array.isArray(n.dataModel) ? n.dataModel : void 0,
				version: typeof e.version == "string" ? e.version : this.version
			});
		}
		if ("updateComponents" in e) {
			let n = e.updateComponents;
			t.push({
				type: "updateComponents",
				surfaceId: String(n?.surfaceId || ""),
				components: Array.isArray(n?.components) ? n.components : []
			});
		}
		if ("updateDataModel" in e) {
			let n = e.updateDataModel;
			t.push({
				type: "updateDataModel",
				surfaceId: String(n?.surfaceId || ""),
				path: typeof n?.path == "string" ? n.path : void 0,
				value: n?.value
			});
		}
		if ("deleteSurface" in e) {
			let n = e.deleteSurface;
			t.push({
				type: "deleteSurface",
				surfaceId: String(n?.surfaceId || "")
			});
		}
		return t;
	}
}, Kb = [
	"createSurface",
	"updateComponents",
	"updateDataModel",
	"deleteSurface",
	"callRendererFunction",
	"agentFunctionResponse"
];
function qb(e) {
	return typeof e == "object" && !!e && "type" in e && typeof e.type == "string" && Kb.includes(e.type);
}
Z({
	componentId: bg(() => Yb),
	path: J().describe("The path to the list of component property objects in the data model.")
}).strict().describe("REF:#/$defs/TemplateChildList|A template for generating a dynamic list of children from a data model list. The `componentId` is the component to use as a template.");
var Jb = X(bg(() => ix.extend({ component: J() }).passthrough().refine((e) => e.component !== "Surface", { message: "Component type cannot be \"Surface\". \"Surface\" is a top-level protocol container defined in createSurface, not a child component." }))).min(1);
yg(J(), hg());
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/v1_0/schema/common-types.js
var Yb = Mg(J().describe("REF:#/$defs/ComponentId|The unique identifier for a component, used for both definitions and references within the same surface."), "component-id"), Xb = J().describe("REF:#/$defs/CallId|The unique identifier for a function call."), Zb = Z({ path: J().describe("A JSON Pointer path to a value in the data model.") }).strict().describe("REF:#/$defs/DataBinding"), Qb = Z({
	call: J().describe("The name of the function to call."),
	catalogId: J().describe("The catalog ID for this function, overriding any surface-level default catalogId.").optional()
}).describe("REF:#/$defs/FunctionCommon|Baseline envelope properties common to all function calls. Function-specific argument schemas ('args') are defined individually by each function in the active catalog."), $b = yg(J(), hg()).and(vg(Qb, hg())).describe("REF:#/$defs/FunctionCall|Invokes a named function, combining common function properties with the catalog function definition."), ex = _g([
	J(),
	Zb,
	$b
]).describe("REF:#/$defs/DynamicString|Represents a string"), tx = _g([
	mg(),
	Zb,
	$b
]).describe("REF:#/$defs/DynamicBoolean|A boolean value that can be a literal, a path, or a function call returning a boolean."), nx = Z({
	label: ex.optional(),
	description: ex.optional(),
	live: Q([
		"off",
		"polite",
		"assertive"
	]).describe("Controls screen reader announcements for dynamic updates (WAI-ARIA aria-live). 'polite' waits for user pause; 'assertive' interrupts immediately for alerts.").default("off"),
	hidden: tx.optional()
}).strict().describe("REF:#/$defs/AccessibilityAttributes|Attributes to enhance accessibility when using assistive technologies like screen readers or model understanding."), rx = yg(J(), gg()).superRefine((e, t) => {
	for (let n in e) n.match(/^[\p{XID_Start}_][\p{XID_Continue}:-]*$/u) || t.addIssue({
		path: [n],
		code: V.custom,
		message: `Invalid extension key "${n}": Keys MUST be Unicode identifiers (UAX #31).`
	});
}).describe("REF:#/$defs/Extensions|Optional extension metadata. Keys MUST be Unicode identifiers (UAX #31). Keys starting with 'a2ui_' are reserved for official extensions."), ix = Z({
	id: Yb,
	catalogId: J().describe("The catalog ID for this component, overriding any surface-level default catalogId.").optional(),
	accessibility: nx.optional(),
	metadata: Z({ extensions: rx.optional() }).strict().describe("Optional component-level metadata for vendor extensions.").optional()
}).describe("REF:#/$defs/ComponentCommon");
Mg(_g([X(Yb).describe("A static list of child component IDs."), Z({
	componentId: Yb,
	path: J().describe("The path to the list of component property objects in the data model.")
}).strict().describe("A template for generating a dynamic list of children from a data model list. The `componentId` is the component to use as a template.")]).describe("REF:#/$defs/ChildList"), "child-list");
var ax = _g([
	J(),
	Y(),
	mg(),
	X(hg()),
	yg(J(), gg()).refine((e) => !e || !("path" in e) && !("call" in e)),
	Zb,
	$b
]).describe("REF:#/$defs/DynamicValue|A value that can be a literal, a path, or a function call returning any type."), ox = _g([
	Y(),
	Zb,
	$b
]).describe("REF:#/$defs/DynamicNumber|Represents a value that can be either a literal number, a path to a number in the data model, or a function call returning a number.");
_g([
	X(J()),
	Zb,
	$b
]).describe("REF:#/$defs/DynamicStringList|Represents a value that can be either a literal array of strings, a path to a string array in the data model, or a function call returning a string array."), Z({
	call: xg("@index"),
	args: Z({ offset: ox.optional() }).optional()
}).describe("REF:#/$defs/IndexSystemFunction|Returns the 0-based index of the current item when rendering a dynamic list from a template. This function MUST ONLY be available when evaluating template items within a list context."), Z({ checks: X(Z({
	condition: _g([Zb, $b]).describe("Path or function call evaluating to a structured validation result object."),
	message: J().describe("Optional fallback error message.").optional()
}).strict().describe("REF:#/$defs/CheckRule|A single validation check rule applied to an input component. The condition function or path evaluates to a structured validation result object.")).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional() }).describe("REF:#/$defs/Checkable|Properties for components that support renderer-side checks."), _g([Z({ event: Z({
	name: J().describe("The name of the action to be dispatched to the agent."),
	userMessage: ex.optional(),
	context: yg(J(), ax).describe("A JSON object containing the key-value pairs for the action context. Values can be literals or paths. Use literal values unless the value must be dynamically bound to the data model. Do NOT use paths for static IDs.").optional()
}).strict().describe("The event to dispatch to the agent.") }).strict().describe("Triggers an agent-side event."), Z({ functionCall: $b }).strict().describe("Executes a renderer or agent-side function.")]).describe("REF:#/$defs/Action|Defines an interaction handler that can either trigger an agent-side event or execute a local renderer-side function."), Z({
	component: xg("Surface").optional(),
	child: xg("root").optional()
}).strict().describe("REF:#/$defs/Surface|The reserved canonical container component representing an A2UI surface. The Surface component is immutable and always has 'child': 'root'.");
var sx = Z({
	functionCallId: Xb,
	value: hg().describe("The return value of the function.").optional(),
	error: Z({
		code: J(),
		message: J()
	}).strict().describe("An error object indicating failure of the function execution.").optional()
}).strict().superRefine((e, t) => {
	let n = "value" in e, r = "error" in e;
	(n && r || !n && !r) && t.addIssue({
		code: V.custom,
		message: "FunctionResponse must have either \"value\" or \"error\", but not both or neither."
	});
}).describe("REF:#/$defs/FunctionResponse|The return response matching a callAgentFunction or callRendererFunction invocation."), cx = _g([
	Z({
		version: xg("v1.0"),
		createSurface: Z({
			surfaceId: J().describe("The unique identifier for the UI surface to be rendered. It must be globally unique for the renderer's lifetime."),
			catalogId: J().describe("A string that uniquely identifies the default catalog for this surface. It is recommended to prefix this with an internet domain that you own, to avoid conflicts e.g. 'mycompany.com:somecatalog'. Components and function calls that do not explicitly specify a catalogId will use this surface-level default catalogId.").optional(),
			sendDataModel: mg().describe("If true, the renderer will send the full data model of this surface in the metadata of every A2A message sent to the agent that created the surface. Defaults to false.").optional(),
			components: Jb.optional(),
			dataModel: yg(J(), hg()).describe("The initial root data model object for the surface.").optional(),
			metadata: Z({ extensions: rx.optional() }).strict().describe("Optional surface-level metadata.").optional()
		}).strict().describe("Signals the renderer to create a new surface and begin rendering it. Creating a surface implicitly instantiates the canonical 'Surface' container component ('common_types.json#/$defs/Surface') with 'child': 'root'. It is an error to try to create a surface with an existing ID without first deleting it; surfaceId MUST be globally unique for the renderer's lifetime. When this message is sent, the renderer expects 'updateComponents' and/or 'updateDataModel' messages for the same surfaceId to define the component tree.")
	}).strict(),
	Z({
		version: xg("v1.0"),
		updateComponents: Z({
			surfaceId: J().describe("The unique identifier for the UI surface to be updated. It must be globally unique for the renderer's lifetime."),
			components: Jb
		}).strict().describe("Updates a surface with a new set of components. This message can be sent multiple times to update the component tree of an existing surface. One of the components in one of the components lists MUST have an 'id' of 'root' to serve as the root of the component tree. The createSurface message MUST have been previously sent for this surfaceId.")
	}).strict(),
	Z({
		version: xg("v1.0"),
		updateDataModel: Z({
			surfaceId: J().describe("The unique identifier for the UI surface this data model update applies to. It must be globally unique for the renderer's lifetime."),
			path: J().describe("An optional path to a location within the data model (e.g., '/user/name'). If omitted, or set to '/', refers to the entire data model.").optional(),
			value: hg().describe("The data to be updated in the data model. To delete the key/value at 'path', set 'value' explicitly to null.")
		}).strict().describe("Updates the data model for an existing surface. This message can be sent multiple times to update the data model. The createSurface message MUST have been previously sent for this surfaceId.")
	}).strict(),
	Z({
		version: xg("v1.0"),
		deleteSurface: Z({ surfaceId: J().describe("The unique identifier for the UI surface to be deleted. It must be globally unique for the renderer's lifetime.") }).strict().describe("Signals the renderer to delete the surface identified by 'surfaceId'. The createSurface message MUST have been previously sent for this surfaceId.")
	}).strict(),
	Z({
		version: xg("v1.0"),
		callRendererFunction: Z({
			functionCallId: Xb,
			callFunction: vg($b, hg())
		}).strict().describe("Signals the renderer to execute a function locally on behalf of the agent.")
	}).strict(),
	Z({
		version: xg("v1.0"),
		agentFunctionResponse: sx
	}).strict()
]), lx = class extends Tb {
	constructor() {
		super(...arguments), this.version = "v1.0", this.schema = cx;
	}
	getNativeActionKeys() {
		return [...Kb];
	}
	extractOperationsFromObject(e) {
		let t = [];
		if ("createSurface" in e) {
			let n = e.createSurface;
			t.push({
				type: "createSurface",
				surfaceId: String(n?.surfaceId || ""),
				catalogId: typeof n?.catalogId == "string" ? n.catalogId : void 0,
				sendDataModel: !!n?.sendDataModel,
				components: Array.isArray(n?.components) ? n.components : void 0,
				dataModel: n?.dataModel && typeof n.dataModel == "object" && !Array.isArray(n.dataModel) ? n.dataModel : void 0,
				version: typeof e.version == "string" ? e.version : this.version
			});
		}
		if ("updateComponents" in e) {
			let n = e.updateComponents;
			t.push({
				type: "updateComponents",
				surfaceId: String(n?.surfaceId || ""),
				components: Array.isArray(n?.components) ? n.components : []
			});
		}
		if ("updateDataModel" in e) {
			let n = e.updateDataModel;
			t.push({
				type: "updateDataModel",
				surfaceId: String(n?.surfaceId || ""),
				path: typeof n?.path == "string" ? n.path : void 0,
				value: n?.value
			});
		}
		if ("deleteSurface" in e) {
			let n = e.deleteSurface;
			t.push({
				type: "deleteSurface",
				surfaceId: String(n?.surfaceId || "")
			});
		}
		if ("callRendererFunction" in e) {
			let n = e.callRendererFunction, r = n?.callFunction || {};
			t.push({
				type: "callRendererFunction",
				functionCallId: String(n?.functionCallId || ""),
				call: String(r?.call || ""),
				version: this.version,
				catalogId: typeof r?.catalogId == "string" ? r.catalogId : void 0,
				args: r?.args && typeof r.args == "object" && !Array.isArray(r.args) ? r.args : {}
			});
		}
		if ("agentFunctionResponse" in e) {
			let n = e.agentFunctionResponse;
			t.push({
				type: "agentFunctionResponse",
				functionCallId: String(n?.functionCallId || ""),
				version: this.version,
				value: n?.value,
				error: n?.error && typeof n.error == "object" ? n.error : void 0
			});
		}
		return t;
	}
}, ux = new class {
	constructor() {
		this.adapters = /* @__PURE__ */ new Map([
			["0.8", new Ub()],
			["0.9", new Gb()],
			["0.9.1", new Gb()],
			["1.0", new lx()]
		]);
	}
	getAllKnownActions() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.adapters.values()) if (t.validActions) for (let n of t.validActions) e.add(n);
		return e;
	}
	registerAdapter(e) {
		let t = e_(e.version) ?? Zg(e.version);
		this.adapters.set(t, e);
	}
	getAdapter(e) {
		let t = e_(e) ?? Zg(e), n = this.adapters.get(t);
		if (!n) throw new $(`[VersionAdapterFactory] Unsupported protocol version '${e}'. Supported versions: ${Array.from(new Set(Array.from(this.adapters.keys()).map((e) => e.startsWith("v") ? e : `v${e}`))).sort().join(", ")}.`);
		return n;
	}
	resolveFromPayload(e) {
		let t = Array.isArray(e) ? e[0] : e;
		if (typeof t == "object" && t) {
			if ("messages" in t && Array.isArray(t.messages)) return this.resolveFromPayload(t.messages);
			if ("version" in t) {
				let e = t.version;
				if (typeof e != "string") throw new $(`[VersionAdapterFactory] Message payload is missing a valid 'version' string: 'version' property must be a string, got ${typeof e}.`);
				return this.getAdapter(e);
			}
			if ("beginRendering" in t || "surfaceUpdate" in t || "dataModelUpdate" in t || "deleteSurface" in t) return this.getAdapter("v0.8");
		}
		throw new $("[VersionAdapterFactory] Message payload is missing a valid 'version' string.");
	}
	static registerAdapter(e) {
		ux.registerAdapter(e);
	}
	static getAdapter(e) {
		return ux.getAdapter(e);
	}
	static resolveFromPayload(e) {
		return ux.resolveFromPayload(e);
	}
	static getAllKnownActions() {
		return ux.getAllKnownActions();
	}
}();
Cb(() => ux.getAllKnownActions());
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/resolution/data-context.js
var dx = /* @__PURE__ */ new WeakMap();
function fx(e) {
	if (dx.has(e)) return dx.get(e);
	let t = (() => {
		let t = e;
		for (; t;) {
			if (t instanceof Hh || t._def?.typeName === "ZodObject") {
				if (t._def?.unknownKeys === "passthrough") return null;
				let e = typeof t.shape == "function" ? t.shape() : t.shape;
				return e && typeof e == "object" ? new Set(Object.keys(e)) : null;
			}
			if (t instanceof ag || t._def?.typeName === "ZodEffects") t = t._def.schema;
			else if (t instanceof og || t instanceof sg || t._def?.typeName === "ZodOptional" || t._def?.typeName === "ZodNullable") t = t._def.innerType;
			else if (t instanceof cg || t._def?.typeName === "ZodDefault") t = t._def.innerType;
			else if (t instanceof lg || t._def?.typeName === "ZodCatch") t = t._def.innerType;
			else {
				if (t instanceof qh || t._def?.typeName === "ZodIntersection") {
					let e = fx(t._def.left), n = fx(t._def.right);
					return !e || !n ? null : /* @__PURE__ */ new Set([...e, ...n]);
				}
				if (t instanceof Uh || t._def?.typeName === "ZodUnion") {
					let e = t._def.options, n = /* @__PURE__ */ new Set();
					for (let t of e) {
						let e = fx(t);
						if (!e) return null;
						for (let t of e) n.add(t);
					}
					return n;
				}
				return null;
			}
		}
		return null;
	})();
	return dx.set(e, t), t;
}
function px(e, t, n) {
	if (!t || typeof t != "object" || Array.isArray(t)) return;
	let r = Object.keys(t);
	if (r.length > 1e3) throw new Tg(`Function call '${e}' exceeds maximum allowed arguments count (${Pg})`, e);
	let i = n?.functions?.get?.(e);
	if (!i?.schema) return;
	let a = fx(i.schema);
	if (a) {
		for (let t of r) if (!a.has(t)) throw new Tg(`Unknown argument '${t}' passed to function '${e}'`, e);
		if (r.length > a.size) throw new Tg(`Too many arguments for function '${e}': expected at most ${a.size}, received ${r.length}`, e);
	}
}
function mx(e) {
	let t = e;
	for (; t;) {
		if (t.explicitIndex !== void 0 && Number.isFinite(t.explicitIndex)) return t.explicitIndex;
		if (!(t instanceof gx) && typeof t.getIndex == "function") {
			let e = t.getIndex();
			if (e !== void 0 && Number.isFinite(e)) return e;
		}
		if (!(t instanceof gx) && typeof t.index == "number" && Number.isFinite(t.index)) return t.index;
		if (typeof t.path == "string") {
			let e = t.path.split("/").filter(Boolean);
			if (e.length > 0 && /^\d+$/.test(e[e.length - 1])) return parseInt(e[e.length - 1], 10);
		}
		t = t.parent;
	}
}
var hx = 1e3, gx = class e {
	constructor(e, t, n, r) {
		this.surface = e, this.path = t, this.dataModel = e.dataModel, this.functionInvoker = e.defaultCatalog.invoker, this.explicitIndex = n, this.parent = r, this.warnedPaths = r ? r.warnedPaths : /* @__PURE__ */ new Set();
	}
	getIndex() {
		return mx(this);
	}
	get index() {
		return this.getIndex();
	}
	set(e, t) {
		let n = this.resolvePath(e);
		this.dataModel.set(n, t);
	}
	static isDataBindingObject(e) {
		return "path" in e && typeof e.path == "string" && !("componentId" in e);
	}
	static isFunctionCallObject(e) {
		return "call" in e && typeof e.call == "string";
	}
	static containsDynamicValue(t) {
		if (typeof t != "object" || !t) return !1;
		if (Array.isArray(t)) return t.some((t) => e.containsDynamicValue(t));
		let n = t;
		return e.isDataBindingObject(n) || e.isFunctionCallObject(n) ? !0 : Object.values(n).some((t) => e.containsDynamicValue(t));
	}
	emitMissingDataBindingWarning(e) {
		typeof this.dataModel?.hasPath == "function" && !this.dataModel.hasPath(e) && !this.warnedPaths.has(e) && (this.warnedPaths.add(e), this.surface?.dispatchWarning?.({
			code: "MISSING_DATA_BINDING",
			path: e,
			message: `Preflight DataBinding Warning: The bound JSON Pointer '${e}' does not physically exist in the active DataModel. Evaluating to None.`
		}));
	}
	resolveDynamicValue(t, n = 0) {
		if (n > 1e3) {
			let e = new Tg(`Maximum dynamic value nesting depth exceeded (${hx})`);
			this.dispatchExpressionError(e, "DynamicValue");
			return;
		}
		if (typeof t != "object" || !t) return t;
		if (Array.isArray(t)) return e.containsDynamicValue(t) ? t.map((e) => this.resolveDynamicValue(e, n + 1)) : t;
		let r = t;
		if (e.isDataBindingObject(r)) {
			let e = this.resolvePath(t.path), n = this.dataModel.get(e);
			return n === void 0 && this.emitMissingDataBindingWarning(e), n;
		}
		return e.isFunctionCallObject(r) ? this.resolveFunctionCallValue(t, n) : this.resolvePlainObjectValue(r, n);
	}
	resolveFunctionCallValue(e, t = 0) {
		let n;
		try {
			n = this.resolveFunctionCatalog(e.catalogId), px(e.call, e.args, n);
		} catch (t) {
			this.dispatchExpressionError(t, e.call);
			return;
		}
		let r = {};
		for (let [n, i] of Object.entries(e.args ?? {})) r[n] = this.resolveDynamicValue(i, t + 1);
		let i = new AbortController(), a = this.evaluateFunctionReactive(e.call, r, i.signal, e.catalogId, n.invoker);
		if (a !== void 0) return eb(a) ? rb(a) : a;
	}
	resolvePlainObjectValue(t, n = 0) {
		if (!e.containsDynamicValue(t)) return t;
		let r = {};
		for (let [e, i] of Object.entries(t)) r[e] = this.resolveDynamicValue(i, n + 1);
		return r;
	}
	subscribeDynamicValue(e, t) {
		let n = this.resolveSignal(e), r = !0, i = rb(n), a = Qy(() => {
			let e = tb(n);
			i = e, r || t(e);
		});
		return r = !1, {
			get value() {
				return i;
			},
			unsubscribe: () => {
				a(), n.unsubscribe?.();
			}
		};
	}
	resolveSignal(t, n = 0) {
		if (n > 1e3) {
			let e = new Tg(`Maximum dynamic value nesting depth exceeded (${hx})`);
			return this.dispatchExpressionError(e, typeof t == "object" && t && "call" in t ? t.call : "DynamicValue"), Xy(void 0);
		}
		if (typeof t != "object" || !t) return Xy(t);
		if (Array.isArray(t)) {
			if (!e.containsDynamicValue(t)) return Xy(t);
			let r = t.map((e) => this.resolveSignal(e, n + 1)), i = Zy(() => r.map((e) => tb(e)));
			return i.unsubscribe = () => {
				for (let e of r) e.unsubscribe?.();
			}, i;
		}
		let r = t;
		if (e.isDataBindingObject(r)) {
			let e = this.resolvePath(t.path);
			return this.emitMissingDataBindingWarning(e), this.dataModel.getSignal(e);
		}
		if (e.isFunctionCallObject(r)) {
			let e = t, r;
			try {
				r = this.resolveFunctionCatalog(e.catalogId), px(e.call, e.args, r);
			} catch (t) {
				return this.dispatchExpressionError(t, e.call), Xy(void 0);
			}
			let i = {};
			for (let [t, r] of Object.entries(e.args ?? {})) i[t] = this.resolveSignal(r, n + 1);
			if (Object.keys(i).length === 0) {
				let t = new AbortController(), n = this.evaluateFunctionReactive(e.call, {}, t.signal, e.catalogId, r.invoker), i = eb(n) ? n : Xy(n);
				return i.unsubscribe = () => t.abort(), i;
			}
			let a = Object.keys(i), o = Xy(void 0), s, c, l = Zy(() => {
				let e = {};
				for (let t = 0; t < a.length; t++) e[a[t]] = tb(i[a[t]]);
				return e;
			}), u = Qy(() => {
				try {
					let t = tb(l);
					s && s.abort(), c &&= (c(), void 0), s = new AbortController();
					let n = this.evaluateFunctionReactive(e.call, t, s.signal, e.catalogId, r.invoker);
					eb(n) ? c = Qy(() => {
						nb(o, tb(n));
					}) : nb(o, n);
				} catch (t) {
					this.dispatchExpressionError(t, e.call), nb(o, void 0);
				}
			});
			return o.unsubscribe = () => {
				u(), c && c(), s && s.abort();
				for (let e = 0; e < a.length; e++) i[a[e]].unsubscribe?.();
			}, o;
		}
		if (!e.containsDynamicValue(r)) return Xy(t);
		let i = Object.entries(r).map(([e, t]) => [e, this.resolveSignal(t)]), a = Zy(() => {
			let e = {};
			for (let [t, n] of i) e[t] = tb(n);
			return e;
		}), o = a.unsubscribe?.bind(a);
		return a.unsubscribe = () => {
			o?.();
			for (let [, e] of i) e.unsubscribe?.();
		}, a;
	}
	resolveAction(e) {
		if ("event" in e) {
			let t = {};
			if (e.event.context) for (let [n, r] of Object.entries(e.event.context)) t[n] = this.resolveDynamicValue(r);
			return { event: {
				...e.event,
				context: t
			} };
		}
		return "functionCall" in e ? this.resolveDynamicValue(e.functionCall) : e;
	}
	resolveFunctionCatalog(e) {
		if (e === void 0) return this.surface.defaultCatalog;
		let t = this.surface.availableCatalogs?.get(e);
		if (!t) throw new Dg(`Catalog not found: ${e}`);
		return t;
	}
	evaluateFunctionReactive(e, t, n, r, i) {
		let a = i ?? (r === void 0 ? this.functionInvoker : this.resolveFunctionCatalog(r).invoker);
		try {
			return a(e, t, this, n);
		} catch (t) {
			this.dispatchExpressionError(t, e);
			return;
		}
	}
	dispatchExpressionError(e, t) {
		if (e instanceof Um || typeof e == "object" && e && e.name === "ZodError") {
			let n = e, r = new Tg(`Validation failed for function '${t}': ${n.message}`, t, n.errors ?? n.issues);
			this.surface.dispatchError({
				code: "EXPRESSION_ERROR",
				message: r.message,
				expression: t,
				details: r.details
			});
		} else if (e instanceof Tg) this.surface.dispatchError({
			code: "EXPRESSION_ERROR",
			message: e.message,
			expression: e.expression,
			details: e.details
		});
		else {
			let n = typeof e == "object" && e ? e : {};
			this.surface.dispatchError({
				code: "EXPRESSION_ERROR",
				message: n.message ?? `An unexpected error occurred in function ${t}.`,
				expression: t
			});
		}
	}
	nested(t, n) {
		let r = this.resolvePath(t);
		return new e(this.surface, r, n, this);
	}
	resolvePath(e) {
		if (e.startsWith("/")) return e;
		if (e === "" || e === ".") return this.path;
		let t = this.path;
		return t.endsWith("/") && t.length > 1 && (t = t.slice(0, -1)), t === "/" && (t = ""), `${t}/${e}`;
	}
}, _x = {
	name: "@index",
	returnType: "number",
	allowedCallers: "rendererOnly",
	schema: Z({ offset: Sg.number().optional() })
};
fy(_x, (e, t) => {
	let n = typeof e.offset == "number" && Number.isFinite(e.offset) ? e.offset : 0, r = mx(t);
	if (r === void 0 || !Number.isFinite(r)) throw new $("@index function can only be evaluated inside a collection template iteration scope.");
	return r + n;
});
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/validation/payload-validator.js
var vx = [
	"id",
	"component",
	"catalogId",
	"catalogID"
], yx = class {
	constructor(e, t) {
		this.catalog = e, this.config = t, this.enforceIdentifiers = i_(e.protocolVersion, "1.0");
	}
	get allowUnknown() {
		return this.config ? this.config.allowUnknownElements ?? !1 : !0;
	}
	validateComponent(e, t) {
		let n = e.id;
		if (typeof n != "string" || !n) throw new $(`Component '${e.component}' is missing an 'id'; entries require a valid string 'id'.`);
		this.assertIdentifier(n, `Component id '${n}' must be a valid UAX #31 identifier`);
		let r = e.component, i = typeof r == "string" ? r : t;
		if (!i) throw new $(`Cannot create component ${n} without a type.`);
		let a = this.catalog.components.get(i);
		if (!a) {
			if (!this.allowUnknown) throw new $(`Unknown component type '${i}' not found in catalog '${this.catalog.id}'.`);
			return;
		}
		let o = bx(e), s = a.schema.safeParse(o);
		if (!s.success) throw new $(`Validation failed for component '${i}' (${n}): ${s.error.errors.map(yb).join(", ")}`, s.error.issues);
		this.validateNestedFunctions(o);
	}
	assertFunctionIdentifiers(e, t) {
		if (this.assertIdentifier(e, `Function name '${e}' must be a valid UAX #31 identifier`), t && typeof t == "object" && !Array.isArray(t)) {
			let n = Object.keys(t);
			if (n.length > 1e3) throw new $(`Function call '${e}' exceeds maximum allowed arguments count (${Pg})`);
			for (let t of n) this.assertIdentifier(t, `Function argument '${t}' in function '${e}' must be a valid UAX #31 identifier`);
		}
	}
	validateNestedFunctions(e) {
		if (Array.isArray(e)) {
			for (let t of e) this.validateNestedFunctions(t);
			return;
		}
		if (typeof e != "object" || !e) return;
		let t = e, n = t.call ?? t.function;
		if (typeof n == "string" && n.length > 0) {
			let e = t.args, r = e === void 0 ? {} : e, i = typeof t.catalogId == "string" && t.catalogId.length > 0 ? t.catalogId : void 0;
			i && i !== this.catalog.id ? this.assertFunctionIdentifiers(n, r) : this.validateFunction(n, r);
		}
		for (let [e, n] of Object.entries(t)) e !== "id" && e !== "component" && this.validateNestedFunctions(n);
	}
	validateFunction(e, t) {
		this.assertFunctionIdentifiers(e, t);
		let n = this.catalog.functions.get(e) ?? (this.enforceIdentifiers && e === "@index" ? _x : void 0);
		if (!n) {
			if (!this.allowUnknown) throw new $(`Unrecognized function '${e}'`);
			return t ?? {};
		}
		if (!n.schema) {
			if (t !== void 0 && (typeof t != "object" || !t || Array.isArray(t))) throw new $(`Validation failed for function '${e}': Expected object, received ${Array.isArray(t) ? "array" : typeof t}`);
			return t ?? {};
		}
		let r = n.schema.safeParse(t ?? {});
		if (!r.success) throw new $(`Validation failed for function '${e}': ${r.error.errors.map(yb).join(", ")}`, r.error.issues);
		return r.data;
	}
	validateTheme(e) {
		let t = this.catalog.themeSchema;
		if (!t) return e;
		let n = t.safeParse(e);
		if (!n.success) throw new $(`Validation failed for theme: ${n.error.errors.map(yb).join(", ")}`, n.error.issues);
		return n.data;
	}
	assertIdentifier(e, t) {
		if (this.enforceIdentifiers && !o_(e)) throw new $(t);
	}
};
function bx(e) {
	let t = {};
	for (let [n, r] of Object.entries(e)) vx.includes(n) || (t[n] = r);
	return t;
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/rpc/rpc-handler.js
var xx = class {
	constructor(e, t) {
		if (this.pendingAgentCalls = /* @__PURE__ */ new Map(), this.isDisposed = !1, Array.isArray(e)) this.catalogs = e, this.outboundListener = t, this.defaultTimeoutMs = 3e4;
		else {
			let t = e ?? {};
			this.catalogs = t.catalogs ?? [], this.outboundListener = t.outboundListener, this.defaultTimeoutMs = t.defaultTimeoutMs ?? 3e4;
		}
	}
	get disposed() {
		return this.isDisposed;
	}
	async handleCallRendererFunction(e, t, n = !1) {
		let r = this.validateInboundMessage(e);
		if (r) return await this.emitOutboundResponse(r), r;
		let { version: i, callRendererFunction: a } = e, { functionCallId: o, callFunction: s } = a, { call: c, catalogId: l, args: u } = s, d = this.resolveFunctionImplementation(l, c, t, i);
		if ("error" in d) {
			let e = this.createResponseError(o, Ag.INVALID_FUNCTION_CALL, d.error, i);
			return await this.emitOutboundResponse(e), e;
		}
		let f = this.checkExecutionPermissions(d.funcImpl, c, n);
		if (f) {
			let e = this.createResponseError(o, Ag.INVALID_FUNCTION_CALL, f, i);
			return await this.emitOutboundResponse(e), e;
		}
		let p = this.parseArguments(d.catalog, d.funcImpl, u, c);
		if ("error" in p) {
			let e = this.createResponseError(o, Ag.INVALID_FUNCTION_CALL, p.error, i);
			return await this.emitOutboundResponse(e), e;
		}
		let m = await this.executeFunctionSafely(d.funcImpl, p.args, t, o, i);
		return await this.emitOutboundResponse(m), m;
	}
	handleAgentFunctionResponse(e) {
		if (!e || !e.agentFunctionResponse) return;
		let { functionCallId: t, value: n, error: r } = e.agentFunctionResponse, i = this.pendingAgentCalls.get(t);
		if (i) {
			if (this.pendingAgentCalls.delete(t), r) {
				let e = r.code ?? Ag.UNKNOWN_ERROR, n = r.message ?? "Agent function execution failed";
				i.reject(new jg(n, e, t, r));
			} else i.resolve(n);
		}
	}
	callAgentFunction(e, t, n) {
		if (this.isDisposed) return Promise.reject(new jg("RpcHandler has been disposed.", Ag.DISPOSED));
		if (!this.outboundListener) return Promise.reject(new jg("Cannot call agent function without outboundListener configured.", Ag.NO_LISTENER));
		if (!t || !t.call) return Promise.reject(new jg("Missing or invalid function call name.", Ag.INVALID_FUNCTION_CALL));
		let r = n ?? {}, i = r.functionCallId ?? this.generateFunctionCallId(), a = r.timeoutMs ?? this.defaultTimeoutMs;
		if (this.pendingAgentCalls.has(i)) return Promise.reject(new jg(`A call with functionCallId '${i}' is already pending.`, Ag.DUPLICATE, i));
		let o = {
			functionCallId: i,
			call: t,
			effectiveTimeoutMs: a,
			version: r.version
		};
		return this.dispatchAgentCall(e, o);
	}
	dispose() {
		if (!this.isDisposed) {
			this.isDisposed = !0;
			for (let [e, t] of this.pendingAgentCalls.entries()) t.reject(new jg(`RpcHandler disposed while call '${e}' was pending.`, Ag.CANCELLED, e));
			this.pendingAgentCalls.clear();
		}
	}
	async emitOutboundResponse(e) {
		if (this.outboundListener) try {
			let t = this.outboundListener(e);
			t && typeof t.catch == "function" && await t;
		} catch {}
	}
	validateInboundMessage(e) {
		if (!e) return this.createResponseError("unknown", Ag.INVALID_FUNCTION_CALL, "Inbound message is null or undefined.", "unknown");
		let t = e.version;
		return this.isDisposed ? this.createResponseError(e.callRendererFunction?.functionCallId ?? "unknown", Ag.DISPOSED, "RpcHandler has been disposed.", t) : e.callRendererFunction?.callFunction ? null : this.createResponseError(e.callRendererFunction?.functionCallId ?? "unknown", Ag.INVALID_FUNCTION_CALL, "Malformed message: missing callRendererFunction or callFunction.", t);
	}
	resolveFunctionImplementation(e, t, n, r) {
		let i;
		if (e) {
			if (i = this.catalogs.find((t) => t.id === e), !i) return { error: `Catalog not found: ${e}` };
		} else n?.surface?.defaultCatalog && (i = n.surface.defaultCatalog);
		if (!i) return { error: "No catalog available for function resolution." };
		if (i.protocolVersion && r && !xb(i.protocolVersion, r)) return { error: `Catalog '${i.id}' specification version (${i.protocolVersion}) does not match message protocol version (${r}).` };
		let a = i.functions?.get(t);
		return a ? {
			funcImpl: a,
			catalog: i
		} : { error: `Function not found: ${t}` };
	}
	checkExecutionPermissions(e, t, n) {
		let r = e.allowedCallers ?? "rendererOnly";
		return r !== "rendererOrAgent" && r !== "agentOnly" ? `Function '${t}' cannot be called by agent (allowedCallers is ${r}).` : e.requiresUserActivation && !n ? `Function '${t}' requires user activation context to execute.` : null;
	}
	parseArguments(e, t, n, r) {
		try {
			return { args: new yx(e, { allowUnknownElements: !1 }).validateFunction(r, n) };
		} catch (e) {
			return { error: `Invalid function arguments for '${r}': ${this.extractErrorMessage(e)}` };
		}
	}
	async executeFunctionSafely(e, t, n, r, i) {
		let a = i || "v1.0";
		try {
			let i = await Promise.resolve(e.execute(t, n)), o = eb(i) ? tb(i) : i;
			return {
				version: a,
				rendererFunctionResponse: {
					functionCallId: r,
					value: o === void 0 ? null : o
				}
			};
		} catch (e) {
			let t = this.extractErrorMessage(e);
			return {
				version: a,
				rendererFunctionResponse: {
					functionCallId: r,
					error: {
						code: Ag.EXECUTION_ERROR,
						message: t || "An error occurred during function execution."
					}
				}
			};
		}
	}
	generateFunctionCallId() {
		if (typeof globalThis.crypto?.randomUUID == "function") return globalThis.crypto.randomUUID();
		let e = Math.random().toString(36).substring(2, 15).padEnd(13, "0");
		return `call-${Date.now()}-${e}`;
	}
	dispatchAgentCall(e, t) {
		let { functionCallId: n, call: r, effectiveTimeoutMs: i, version: a } = t;
		return new Promise((t, o) => {
			let s, c = () => {
				s &&= (clearTimeout(s), void 0), this.pendingAgentCalls.delete(n);
			};
			s = this.createTimeoutTimer(n, r.call, i, c, o), this.pendingAgentCalls.set(n, {
				resolve: (e) => {
					c(), t(e);
				},
				reject: (e) => {
					c(), o(e);
				}
			}), this.sendOutboundMessage(e, n, r, a, c, o);
		});
	}
	createTimeoutTimer(e, t, n, r, i) {
		if (!(n <= 0)) return setTimeout(() => {
			this.pendingAgentCalls.delete(e) && (r(), i(new jg(`Agent function call '${t}' timed out after ${n}ms.`, Ag.TIMEOUT, e)));
		}, n);
	}
	sendOutboundMessage(e, t, n, r, i, a) {
		let o = {
			version: r || "v1.0",
			callAgentFunction: {
				surfaceId: e,
				functionCallId: t,
				callFunction: n
			}
		};
		try {
			let e = this.outboundListener(o);
			e && typeof e.catch == "function" && e.catch((e) => {
				i(), a(e);
			});
		} catch (e) {
			i(), a(e);
		}
	}
	extractErrorMessage(e) {
		return e instanceof Error ? e.message : String(e);
	}
	createResponseError(e, t, n, r) {
		return {
			version: r || "v1.0",
			rendererFunctionResponse: {
				functionCallId: e,
				error: {
					code: t,
					message: n
				}
			}
		};
	}
}, Sx = class {
	constructor(e, t, n) {
		this.catalogs = e, this.actionHandler = t, this.model = new _b(), this.adapterRegistry = n?.adapterRegistry ?? ux, this.rpc = new xx({
			catalogs: this.catalogs,
			outboundListener: n?.outboundListener,
			defaultTimeoutMs: n?.defaultTimeoutMs
		}), this.validationConfig = n?.validationConfig ? {
			allowOrphanComponents: !1,
			allowDanglingReferences: !1,
			allowMissingRoot: !1,
			allowUnknownElements: !1,
			...n.validationConfig
		} : void 0, this.actionHandler && this.model.onAction.subscribe(this.actionHandler);
	}
	callAgentFunction(e, t, n) {
		return this.rpc.callAgentFunction(e, t, n);
	}
	dispose() {
		this.rpc.dispose();
	}
	getRendererCapabilities(e) {
		if (!e?.versions || e.versions.length === 0) throw new $("At least one protocol version must be provided in CapabilitiesOptions to generate renderer capabilities.");
		let t = e.versions, n = {};
		for (let r of t) {
			let t = { supportedCatalogIds: this.catalogs.map((e) => e.id) }, i = e?.includeInlineCatalogs ? this.catalogs.map((t) => r_(r, "1.0") >= 0 ? Uv(t, {
				componentEnvelopeRef: e?.componentEnvelopeRef,
				protocolVersion: r
			}) : this.generateLegacyInlineCatalog(t, e?.componentEnvelopeRef ?? "common_types.json#/$defs/ComponentCommon")) : void 0;
			i && (t.inlineCatalogs = i), n[r] = t;
		}
		return n;
	}
	getClientCapabilities(e) {
		return this.getRendererCapabilities(e);
	}
	generateLegacyInlineCatalog(e, t = "common_types.json#/$defs/ComponentCommon") {
		let n = Uv(e, { componentEnvelopeRef: t }), r = n.components || {}, i = n.functions, a = [];
		for (let t of e.functions.values()) {
			let e = i?.[t.name];
			a.push({
				name: t.name,
				description: t.description,
				returnType: t.returnType,
				parameters: e?.properties?.args ?? {
					type: "object",
					properties: {}
				}
			});
		}
		let o = n.$defs?.theme?.properties;
		return {
			catalogId: e.id,
			components: r,
			...a.length > 0 ? { functions: a } : {},
			...o ? { theme: o } : {}
		};
	}
	getRendererDataModel(e) {
		let t = Array.from(this.model.surfacesMap.values()).filter((e) => e.sendDataModel);
		if (t.length === 0) return;
		if (e !== void 0) {
			let n = {};
			for (let r of t) {
				let t = r.defaultCatalog?.protocolVersion;
				(!t || xb(t, e)) && (n[r.id] = r.dataModel.get("/"));
			}
			return Object.keys(n).length === 0 ? void 0 : {
				version: e,
				surfaces: n
			};
		}
		let n = /* @__PURE__ */ new Set();
		for (let e of t) if (e.defaultCatalog?.protocolVersion) {
			let t = e_(e.defaultCatalog.protocolVersion), r = t ? `v${t}` : e.defaultCatalog.protocolVersion;
			n.add(r);
		}
		if (n.size > 1) throw new $(`Multiple protocol versions detected among active surfaces: ${Array.from(n).sort().join(", ")}. Specify a target protocol version in getRendererDataModel(version).`);
		let r = n.size === 1 ? n.values().next().value : "v1.0", i = {};
		for (let e of t) i[e.id] = e.dataModel.get("/");
		return {
			version: r,
			surfaces: i
		};
	}
	getClientDataModel(e) {
		return this.getRendererDataModel(e);
	}
	resolvePath(e, t) {
		return sb.resolvePath(e, t);
	}
	getSurfaces() {
		return this.model.surfacesMap;
	}
	getSurface(e) {
		return this.model.getSurface(e);
	}
	onSurfaceCreated(e) {
		return this.model.onSurfaceCreated.subscribe(e);
	}
	onSurfaceDeleted(e) {
		return this.model.onSurfaceDeleted.subscribe(e);
	}
	processMessages(e, t) {
		let n = this.prepareOperations(e);
		for (let e of n) this.processOperation(e, t);
	}
	async processMessagesAsync(e, t) {
		let n = this.prepareOperations(e), r = [];
		for (let e of n) {
			let n = await this.processOperationAsync(e, t);
			n && r.push(n);
		}
		return r;
	}
	prepareOperations(e) {
		return !e || Array.isArray(e) && e.length === 0 ? [] : (this.validationConfig && pb(e), this.validationConfig?.targetVersion && this.validateTargetVersion(e), qb(e) ? [e] : this.adapterRegistry.resolveFromPayload(e).extractOperations(e));
	}
	validateTargetVersion(e) {
		let t = this.validationConfig?.targetVersion;
		if (!t) return;
		let n = (e) => {
			if (typeof e == "object" && e && "version" in e) {
				let n = e.version;
				if (n && (e_(n) ?? n) !== (e_(t) ?? t)) throw new $(`Message version '${n}' does not match expected target version '${t}'`);
			}
		};
		if (Array.isArray(e)) for (let t of e) n(t);
		else n(e);
	}
	applyStateOperation(e) {
		if (this.validationConfig?.allowedMessages && !this.validationConfig.allowedMessages.includes(e.type)) throw new $(`Operation '${e.type}' is not permitted by ValidationConfig.allowedMessages`);
		switch (e.type) {
			case "createSurface":
				this.processCreateSurfaceOp(e);
				break;
			case "deleteSurface":
				this.processDeleteSurfaceOp(e);
				break;
			case "updateComponents":
				this.processUpdateComponentsOp(e);
				break;
			case "updateDataModel":
				this.processUpdateDataModelOp(e);
				break;
			case "agentFunctionResponse": this.rpc.handleAgentFunctionResponse({
				version: e.version ?? "v1.0",
				agentFunctionResponse: {
					functionCallId: e.functionCallId,
					value: e.value,
					error: e.error
				}
			});
		}
	}
	resolveRpcDataContext(e) {
		let t = (e.catalogId ? this.catalogs.find((t) => t.id === e.catalogId) : void 0) ?? this.catalogs[0], n = (e.catalogId ? Array.from(this.model.surfacesMap.values()).find((t) => t.defaultCatalog?.id === e.catalogId || t.availableCatalogs?.has(e.catalogId)) : void 0) ?? this.model.surfacesMap.values().next().value;
		if (n) return new gx(n, "/");
		let r = `_rpc_fallback_${e.functionCallId || "default"}`, i = /* @__PURE__ */ new Map();
		for (let e of this.catalogs) t?.protocolVersion && e.protocolVersion && xb(t.protocolVersion, e.protocolVersion) && i.set(e.id, e);
		return t && i.set(t.id, t), new gx(new hb(r, t, i), "/");
	}
	processOperation(e, t) {
		if (e.type === "callRendererFunction") {
			let n = this.resolveRpcDataContext(e), r = t?.isUserActivated ?? e.isUserActivated ?? !1, i = {
				version: e.version ?? "v1.0",
				callRendererFunction: {
					functionCallId: e.functionCallId,
					callFunction: {
						call: e.call,
						catalogId: e.catalogId,
						args: e.args
					}
				}
			};
			this.rpc.handleCallRendererFunction(i, n, r).catch((t) => {
				console.error(`Unhandled error in callRendererFunction (${e.call}):`, t);
			});
		} else this.applyStateOperation(e);
	}
	async processOperationAsync(e, t) {
		if (e.type === "callRendererFunction") {
			let n = this.resolveRpcDataContext(e), r = t?.isUserActivated ?? e.isUserActivated ?? !1, i = {
				version: e.version ?? "v1.0",
				callRendererFunction: {
					functionCallId: e.functionCallId,
					callFunction: {
						call: e.call,
						catalogId: e.catalogId,
						args: e.args
					}
				}
			};
			return await this.rpc.handleCallRendererFunction(i, n, r);
		}
		return this.applyStateOperation(e), null;
	}
	processCreateSurfaceOp(e) {
		let { surfaceId: t, catalogId: n, theme: r, sendDataModel: i, components: a, dataModel: o } = e, s = n === void 0 ? this.catalogs[0] : this.catalogs.find((e) => e.id === n);
		if (!s) throw new Eg(`Catalog not found: ${n}`);
		let c = e.version;
		if (s.protocolVersion && c && !xb(s.protocolVersion, c)) throw new $(`Surface '${t}' catalog '${n ?? s.id}' specification version (${s.protocolVersion}) does not match message protocol version (${c}).`);
		if (this.model.getSurface(t)) throw new Eg(`Surface ${t} already exists.`);
		let l = r;
		if (r && s.themeSchema) try {
			l = new yx(s, this.validationConfig).validateTheme(r);
		} catch (e) {
			throw e instanceof $ ? new $(e.message.replace(/^Validation failed for theme:/, `Validation failed for theme on surface '${t}':`), e.details) : e;
		}
		let u = new hb(t, s, new Map(this.catalogs.filter((e) => xb(e.protocolVersion, s.protocolVersion)).map((e) => [e.id, e])), l, i ?? !1, void 0, e.rootId ?? "root");
		this.model.addSurface(u), o && u.dataModel.set("/", o), a && a.length > 0 && this.processUpdateComponentsOp({
			type: "updateComponents",
			surfaceId: t,
			components: a
		});
	}
	processDeleteSurfaceOp(e) {
		e.surfaceId && this.model.deleteSurface(e.surfaceId);
	}
	validateComponentProperties(e, t) {
		let { id: n, component: r } = e, i = e.catalogId ?? e.catalogID;
		if (typeof n != "string" || !n) throw new $(`Component '${r}' is missing an 'id'; entries require a valid string 'id'.`);
		let a = t.defaultCatalog;
		if (typeof i == "string" && i) {
			let e = t.availableCatalogs.get(i);
			if (!e) {
				let e = this.catalogs.find((e) => e.id === i);
				throw e ? new $(`Component '${n}' catalog '${i}' specification version (${e.protocolVersion}) does not match surface default catalog version (${t.defaultCatalog.protocolVersion}).`) : new $(`Unknown catalog ID '${i}' for component '${n}'. Available catalogs: ${this.catalogs.map((e) => e.id).join(", ")}`);
			}
			a = e;
		}
		let o = t.componentsModel.get(n);
		new yx(a, this.validationConfig).validateComponent(e, o?.type);
	}
	applyComponentUpdate(e, t) {
		let { id: n, component: r, ...i } = e;
		if (typeof n != "string") return;
		let a = e.catalogId ?? e.catalogID, o = t.componentsModel.get(n), s = t.defaultCatalog;
		if (typeof a == "string" && a) {
			let e = t.availableCatalogs.get(a);
			e && (s = e);
		}
		if (o) {
			let e = typeof r == "string" ? r : o.type;
			if (e !== o.type || a && o.catalog?.id !== s.id) {
				t.componentsModel.removeComponent(n);
				let r = new vb(n, e, i, s);
				t.componentsModel.addComponent(r);
			} else o.properties = i;
		} else {
			if (typeof r != "string" || !r) throw new $(`Cannot create component ${n} without a type.`);
			let e = new vb(n, r, i, s);
			t.componentsModel.addComponent(e);
		}
	}
	processUpdateComponentsOp(e) {
		if (!e.surfaceId) return;
		let t = this.model.getSurface(e.surfaceId);
		if (!t) throw new Eg(`Surface not found for message: ${e.surfaceId}`);
		for (let n of e.components) this.validateComponentProperties(n, t);
		this.validateCompositionConstraints(t, e.components), this.validateCandidateTopology(t, e.components);
		for (let n of e.components) this.applyComponentUpdate(n, t);
	}
	processUpdateDataModelOp(e) {
		if (!e.surfaceId) return;
		let t = this.model.getSurface(e.surfaceId);
		if (!t) throw new Eg(`Surface not found for message: ${e.surfaceId}`);
		let n = e.path || "/", r = e.value;
		t.dataModel.set(n, r);
	}
	validateParentConstraints(e, t, n, r) {
		if (!r || r.length === 0) {
			if ((e === "root" || this.validationConfig && this.validationConfig.allowOrphanComponents === !1) && !n.includes("Surface")) throw new $(`Component '${e}' (${t}) cannot be placed under parent 'Surface' (Surface). Allowed parents: ${JSON.stringify(n)}.`, void 0, "UNALLOWED_PARENT");
		} else for (let i of r) if (!n.includes(i.parentType)) throw new $(`Component '${e}' (${t}) cannot be placed under parent '${i.parentId}' (${i.parentType || "unknown"}). Allowed parents: ${JSON.stringify(n)}.`, void 0, "UNALLOWED_PARENT");
	}
	validateChildConstraints(e, t, n, r, i) {
		for (let a of r) {
			let r = i.get(a);
			if (r && !n.includes(r)) throw new $(`Container '${e}' (${t}) cannot contain child '${a}' (${r}). Allowed children: ${JSON.stringify(n)}.`, void 0, "UNALLOWED_CHILD");
		}
	}
	buildCompositionTopology(e, t) {
		let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
		for (let [t, a] of e.componentsModel.entries) {
			n.set(t, a.type), a.catalog && r.set(t, a.catalog);
			let o = e.componentsModel.getChildIds(t);
			o.length > 0 && i.set(t, o);
		}
		for (let a of t) {
			let { id: t, component: o, ...s } = a;
			if (typeof t != "string") continue;
			let c = e.defaultCatalog, l = a.catalogId ?? a.catalogID;
			if (typeof l == "string" && l) {
				let n = e.availableCatalogs.get(l);
				n && (c = n, r.set(t, n));
			}
			let u = e.componentsModel.get(t), d = (typeof o == "string" ? o : u?.type) ?? "";
			d && n.set(t, d);
			let f = {
				id: t,
				component: d,
				...s
			}, p = Array.from(db(f, c)).map(([e]) => e);
			p.length > 0 ? i.set(t, p) : i.delete(t);
		}
		let a = /* @__PURE__ */ new Map();
		for (let [e, t] of i.entries()) {
			let r = n.get(e) || "Unknown";
			for (let n of t) {
				let t = a.get(n) ?? [];
				t.push({
					parentId: e,
					parentType: r
				}), a.set(n, t);
			}
		}
		return {
			typeMap: n,
			compCatalogMap: r,
			childMap: i,
			parentMap: a
		};
	}
	validateCompositionConstraints(e, t) {
		let { typeMap: n, compCatalogMap: r, childMap: i, parentMap: a } = this.buildCompositionTopology(e, t);
		for (let [t, o] of n.entries()) {
			let s = (r.get(t) ?? e.defaultCatalog).components.get(o);
			s && (s.allowedParents && s.allowedParents.length > 0 && this.validateParentConstraints(t, o, s.allowedParents, a.get(t)), s.allowedChildren && s.allowedChildren.length > 0 && this.validateChildConstraints(t, o, s.allowedChildren, i.get(t) || [], n));
		}
	}
	validateCandidateTopology(e, t) {
		if (!this.validationConfig) return;
		let n = new mb(e.defaultCatalog);
		for (let [t, r] of e.componentsModel.entries) n.addComponent(new vb(t, r.type, r.properties, r.catalog));
		for (let r of t) {
			let { id: t, component: i, ...a } = r;
			if (typeof t != "string" || !t) continue;
			let o = r.catalogId ?? r.catalogID, s = e.defaultCatalog;
			if (typeof o == "string" && o) {
				let t = e.availableCatalogs.get(o);
				t && (s = t);
			}
			let c = n.get(t), l = (typeof i == "string" ? i : c?.type) || "";
			l && (c ? l !== c.type || o && c.catalog?.id !== s.id ? (n.removeComponent(t), n.addComponent(new vb(t, l, a, s))) : c.properties = a : n.addComponent(new vb(t, l, a, s)));
		}
		n.validateTopology({
			...this.validationConfig,
			rootId: this.validationConfig.rootId ?? e.rootId
		});
	}
}, Cx = class {
	constructor(e, t, n = "/", r, i) {
		let a = e.componentsModel.get(t);
		if (!a) throw new Eg(`Component not found: ${t}`);
		this.componentModel = a, this.surfaceComponents = e.componentsModel, this.theme = e.theme, this.dataContext = new gx(e, n, i, r), this._actionDispatcher = (t) => e.dispatchAction(t, this.componentModel.id);
	}
	dispatchAction(e) {
		return this._actionDispatcher(e);
	}
};
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/resolution/generic-binder.js
function wx(e) {
	return Px(e);
}
function Tx(e) {
	let t = e;
	for (; t;) {
		let e = t._def?.typeName;
		if (e === "ZodOptional" || e === "ZodNullable" || e === "ZodDefault" || e === "ZodReadonly") t = t._def.innerType;
		else if (e === "ZodEffects") t = t._def.schema;
		else if (e === "ZodBranded") t = t._def.type;
		else if (e === "ZodLazy") t = t._def.getter();
		else break;
	}
	return t;
}
function Ex(e) {
	let t = e, n = "";
	for (; t && (n = t.description ?? t._def?.description ?? "", !n);) {
		let e = t._def?.typeName;
		if (e === "ZodOptional" || e === "ZodNullable" || e === "ZodDefault" || e === "ZodReadonly") t = t._def.innerType;
		else if (e === "ZodEffects") t = t._def.schema;
		else if (e === "ZodBranded") t = t._def.type;
		else if (e === "ZodLazy") t = t._def.getter();
		else break;
	}
	return !n || !n.startsWith("REF:") ? "" : Wv(n.slice(4).split("|")[0]);
}
function Dx(e) {
	let t = Ex(e);
	if (t === "Checkable" || t === "CheckRule") return !0;
	let n = Tx(e);
	if (n?._def?.typeName === "ZodArray") {
		let e = n._def.type;
		if (Ex(e) === "CheckRule") return !0;
	}
	return !1;
}
function Ox(e) {
	if (Ex(e) === "Action") return !0;
	let t = Tx(e)._def;
	return t?.typeName === "ZodObject" && !!t.shape?.().event;
}
function kx(e) {
	let t = Ex(e);
	if (t === "DataBinding" || t.startsWith("Dynamic")) return !0;
	let n = Tx(e)._def;
	if (n?.typeName !== "ZodObject") return !1;
	let r = n.shape?.() || {}, i = Object.values(r).some((e) => Ex(e) === "ComponentId");
	return !!r.path && !i;
}
function Ax(e) {
	if (Ng(e) === "child-list" || Ex(e) === "ChildList") return !0;
	let t = Tx(e)._def;
	if (t?.typeName !== "ZodObject") return !1;
	let n = t.shape?.() || {};
	return Object.values(n).some((e) => Ex(e) === "ComponentId");
}
function jx(e, t) {
	return (e === "DataBinding" || e.startsWith("Dynamic")) && t !== "ZodObject" && t !== "ZodArray";
}
function Mx(e) {
	if (e.some(Ox)) return { type: "ACTION" };
	if (e.some(kx)) return { type: "DYNAMIC" };
	if (e.some(Ax)) return { type: "STRUCTURAL" };
}
function Nx(e) {
	let t = {};
	for (let [n, r] of Object.entries(e)) t[n] = Px(r);
	return t;
}
function Px(e) {
	let t = Ex(e);
	if (Dx(e)) return { type: "CHECKABLE" };
	if (t === "Action") return { type: "ACTION" };
	let n = Tx(e);
	if (Ng(n) === "child-list" || t === "ChildList") return { type: "STRUCTURAL" };
	if (jx(t, n._def?.typeName)) return { type: "DYNAMIC" };
	if (n._def.typeName === "ZodUnion") {
		let e = Mx(n._def.options);
		if (e) return e;
	}
	return n._def.typeName === "ZodArray" ? {
		type: "ARRAY",
		element: Px(n._def.type)
	} : n._def.typeName === "ZodObject" ? {
		type: "OBJECT",
		shape: Nx(n._def.shape())
	} : { type: "STATIC" };
}
var Fx = 1e4;
function Ix(e) {
	return Array.isArray(e) ? e.length > 1e4 ? e.slice(0, Fx) : e : [];
}
var Lx = class {
	constructor(e, t) {
		this.dataListeners = [], this.propsListeners = [], this.currentProps = {}, this.isConnected = !1, this.actionClosures = /* @__PURE__ */ new Map(), this.context = e, this.behaviorTree = wx(t), this.behaviorTree.type !== "OBJECT" && (this.behaviorTree = {
			type: "OBJECT",
			shape: {}
		}), this.resolveInitialProps();
	}
	resolveInitialProps() {
		let e = this.context.componentModel.properties, t = this.resolveAndBind(e, this.behaviorTree, [], !0);
		this.currentProps = {
			...this.currentProps,
			...t || {}
		};
	}
	connect() {
		if (this.isConnected) return;
		this.isConnected = !0;
		let e = this.context.componentModel.onUpdated.subscribe(() => {
			this.rebuildAllBindings();
		});
		this.compUnsub = () => e.unsubscribe(), this.rebuildAllBindings();
	}
	rebuildAllBindings() {
		this.dataListeners.forEach((e) => e()), this.dataListeners = [];
		let e = this.context.componentModel.properties, t = this.resolveAndBind(e, this.behaviorTree, [], !1);
		this.currentProps = {
			...this.currentProps,
			...t || {}
		}, this.notify();
	}
	bindDynamicValue(e, t, n) {
		let r = this.context.dataContext.subscribeDynamicValue(e, (e) => {
			this.updateDeepValue(t, e), this.notify();
		});
		return n ? r.unsubscribe() : this.dataListeners.push(() => r.unsubscribe()), r.value;
	}
	resolveDeepSync(e, t = 0) {
		if (typeof e != "object" || !e) return e;
		if (t > 1e3) return;
		if ("path" in e || "call" in e) return this.context.dataContext.resolveDynamicValue(e, t);
		if (Array.isArray(e)) return e.map((e) => this.resolveDeepSync(e, t + 1));
		let n = {};
		for (let [r, i] of Object.entries(e)) n[r] = this.resolveDeepSync(i, t + 1);
		return n;
	}
	resolveEventAction(e) {
		if (typeof e != "object" || !e) return e;
		let t = e;
		if ("event" in t && typeof t.event == "object" && t.event !== null) {
			let e = t.event, n = {
				...e,
				context: e.context ? this.resolveDeepSync(e.context, 1) : void 0
			};
			return e.userMessage !== void 0 && (n.userMessage = this.resolveDeepSync(e.userMessage, 1)), {
				...t,
				event: n
			};
		}
		if ("name" in t) {
			let e = {
				...t,
				context: t.context ? this.resolveDeepSync(t.context, 1) : void 0
			};
			return t.userMessage !== void 0 && (e.userMessage = this.resolveDeepSync(t.userMessage, 1)), e;
		}
		return this.resolveDeepSync(e, 0);
	}
	bindAction(e, t) {
		let n = t.join("/"), r = this.actionClosures.get(n);
		if (r && Rx(r.raw, e)) return r.closure;
		let i = () => {
			if (e && typeof e == "object") {
				let t = e, n = t.functionCall && typeof t.functionCall == "object" ? t.functionCall : t;
				if (typeof n.call == "string") {
					this.context.dataContext.resolveDynamicValue(n);
					return;
				}
			}
			this.context.dispatchAction(this.resolveEventAction(e));
		};
		return this.actionClosures.set(n, {
			raw: e,
			closure: i
		}), i;
	}
	mapTemplateChildren(e, t, n) {
		let r = Ix(e), i = this.context.dataContext.nested(n);
		return r.map((e, n) => ({
			id: t,
			basePath: i.nested(String(n)).path
		}));
	}
	bindStructuralTemplate(e, t, n) {
		if (!e || typeof e != "object" || Array.isArray(e)) return e;
		let r = e, i = typeof r.path == "string" ? r.path : void 0, a = typeof r.componentId == "string" ? r.componentId : void 0;
		if (!i || !a) return e;
		let o = this.context.dataContext.subscribeDynamicValue({ path: i }, (e) => {
			let n = this.mapTemplateChildren(e, a, i);
			this.updateDeepValue(t, n), this.notify();
		});
		return n ? o.unsubscribe() : this.dataListeners.push(() => o.unsubscribe()), this.mapTemplateChildren(o.value, a, i);
	}
	extractValidationResult(e, t) {
		if (typeof e == "object" && e && "valid" in e) {
			let n = e.message;
			return {
				valid: !!e.valid,
				message: n == null ? t : String(n)
			};
		}
		return {
			valid: !!e,
			message: t
		};
	}
	bindCheckable(e, t, n) {
		let r = Array.isArray(e) ? e : [], i = r.map(() => ({
			valid: !0,
			message: ""
		})), a = t.slice(0, -1), o = () => {
			let e = i.filter((e) => !e.valid).map((e) => e.message);
			this.updateDeepValue([...a, "isValid"], e.length === 0), this.updateDeepValue([...a, "validationErrors"], e), this.notify();
		};
		r.forEach((e, t) => {
			let r = typeof e == "object" && e ? e : void 0, a = r && r.condition !== void 0 ? r.condition : e, s = typeof r?.message == "string" ? r.message : "Validation failed";
			i[t].message = s;
			let c = this.context.dataContext.subscribeDynamicValue(a, (e) => {
				i[t] = this.extractValidationResult(e, s), o();
			});
			n ? c.unsubscribe() : this.dataListeners.push(() => c.unsubscribe()), i[t] = this.extractValidationResult(c.value, s);
		});
		let s = i.filter((e) => !e.valid).map((e) => e.message);
		return this.updateDeepValue([...a, "isValid"], s.length === 0), this.updateDeepValue([...a, "validationErrors"], s), e;
	}
	bindObject(e, t, n, r) {
		let i = {};
		for (let [a, o] of Object.entries(e)) {
			let e = t[a] || { type: "STATIC" };
			i[a] = this.resolveAndBind(o, e, [...n, a], r);
		}
		for (let [n, r] of Object.entries(t)) if (r.type === "DYNAMIC") {
			let t = `set${n.charAt(0).toUpperCase() + n.slice(1)}`, r = e[n];
			i[t] = (e) => {
				if (r && typeof r == "object" && "path" in r) {
					let t = r.path;
					typeof t == "string" && this.context.dataContext.set(t, e);
				}
			};
		}
		return i;
	}
	resolveAndBind(e, t, n, r) {
		if (e == null) return e;
		switch (t.type) {
			case "DYNAMIC": return this.bindDynamicValue(e, n, r);
			case "ACTION": return this.bindAction(e, n);
			case "STRUCTURAL": return this.bindStructuralTemplate(e, n, r);
			case "CHECKABLE": return this.bindCheckable(e, n, r);
			case "STATIC": return e;
			case "ARRAY": return Array.isArray(e) ? e.map((e, i) => this.resolveAndBind(e, t.element, [...n, i.toString()], r)) : e;
			case "OBJECT": return typeof e == "object" ? this.bindObject(e, t.shape, n, r) : e;
		}
	}
	updateDeepValue(e, t) {
		this.currentProps = this.cloneAndUpdate(this.currentProps, e, t);
	}
	cloneAndUpdate(e, t, n) {
		if (t.length === 0) return n;
		let [r, ...i] = t;
		if (Array.isArray(e)) {
			let t = [...e];
			return t[Number(r)] = this.cloneAndUpdate(t[Number(r)], i, n), t;
		}
		{
			let t = typeof e == "object" && e ? e : {};
			return {
				...t,
				[r]: this.cloneAndUpdate(t[r], i, n)
			};
		}
	}
	dispose() {
		this.isConnected && (this.isConnected = !1, this.dataListeners.forEach((e) => e()), this.dataListeners = [], this.compUnsub &&= (this.compUnsub(), void 0));
	}
	notify() {
		this.propsListeners.forEach((e) => e(this.currentProps));
	}
	subscribe(e) {
		return this.propsListeners.length === 0 && this.connect(), this.propsListeners.push(e), { unsubscribe: () => {
			this.propsListeners = this.propsListeners.filter((t) => t !== e), this.propsListeners.length === 0 && this.dispose();
		} };
	}
	get snapshot() {
		return this.currentProps;
	}
};
function Rx(e, t) {
	if (Object.is(e, t)) return !0;
	if (typeof e != "object" || typeof t != "object" || e === null || t === null) return !1;
	if (Array.isArray(e) || Array.isArray(t)) return !Array.isArray(e) || !Array.isArray(t) || e.length !== t.length ? !1 : e.every((e, n) => Rx(e, t[n]));
	let n = Object.keys(e), r = Object.keys(t);
	return n.length === r.length && n.every((n) => Object.prototype.hasOwnProperty.call(t, n) && Rx(e[n], t[n]));
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/resolution/resolved-binding.js
var zx = class {
	constructor(e) {
		this.value = e;
	}
}, Bx = class extends zx {
	constructor(e, t, n) {
		super(e), this.set = t, this.path = n;
	}
};
function Vx(e) {
	return e instanceof Bx;
}
function Hx(e, t) {
	return Vx(e) !== Vx(t) || Vx(e) && Vx(t) && e.path !== t.path ? !1 : Ux(e.value, t.value);
}
function Ux(e, t) {
	if (Object.is(e, t)) return !0;
	if (Array.isArray(e) && Array.isArray(t)) return e.length === t.length && e.every((e, n) => Ux(e, t[n]));
	if (Wx(e) && Wx(t)) {
		let n = Object.keys(e), r = Object.keys(t);
		return n.length === r.length && n.every((n) => n in t && Ux(e[n], t[n]));
	}
	return !1;
}
function Wx(e) {
	if (typeof e != "object" || !e) return !1;
	let t = Object.getPrototypeOf(e);
	return t === Object.prototype || t === null;
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/resolution/component-node.js
var Gx = "Placeholder";
function Kx(e) {
	return e instanceof qx;
}
var qx = class {
	constructor(e, t, n, r, i, a, o = "resolved") {
		this._onDestroyed = new my(), this.onDestroyed = this._onDestroyed, this.cleanups = [], this._disposed = !1, this.instanceId = e, this.componentId = t, this.type = n, this.dataPath = r, this.props = Xy(i), this.impl = a, this.state = o;
	}
	get disposed() {
		return this._disposed;
	}
	get isPlaceholder() {
		return this.state !== "resolved";
	}
	addCleanup(e) {
		this.cleanups.push(e);
	}
	toJSON() {
		if (this.isPlaceholder) return {
			id: this.componentId,
			type: this.type,
			state: this.state
		};
		let e = {
			id: this.componentId,
			type: this.type
		}, t = rb(this.props);
		for (let [n, r] of Object.entries(t)) e[n] = Jx(r);
		return e;
	}
	setProps(e) {
		this._disposed || Yx(rb(this.props), e) || nb(this.props, e);
	}
	dispose() {
		if (!this._disposed) {
			this._disposed = !0;
			for (let e of this.cleanups) try {
				e();
			} catch (e) {
				console.error(`ComponentNode cleanup error (${this.instanceId}):`, e);
			}
			this.cleanups = [], this._onDestroyed.emit(), this._onDestroyed.dispose();
		}
	}
};
function Jx(e) {
	if (Kx(e)) return e.toJSON();
	if (e instanceof zx) return Jx(e.value);
	if (typeof e == "function") return "<Action>";
	if (Array.isArray(e)) return e.map(Jx);
	if (e && typeof e == "object") {
		let t = {};
		for (let [n, r] of Object.entries(e)) t[n] = Jx(r);
		return t;
	}
	return e;
}
function Yx(e, t) {
	if (Object.is(e, t)) return !0;
	let n = Object.keys(e), r = Object.keys(t);
	if (n.length !== r.length) return !1;
	for (let r of n) if (!Object.is(e[r], t[r])) return !1;
	return !0;
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/resolution/ref-fields.js
var Xx = "REF:common_types.json#/$defs/ComponentId", Zx = "REF:common_types.json#/$defs/ChildList", Qx = /* @__PURE__ */ new Map(), $x = /* @__PURE__ */ new WeakMap();
function eS(e) {
	let t = $x.get(e);
	if (t) return t;
	let n = tS(e);
	if (n.schema._def.typeName !== "ZodObject") return $x.set(e, Qx), Qx;
	let r = /* @__PURE__ */ new Map(), i = n.schema.shape;
	for (let [e, t] of Object.entries(i)) {
		let n = tS(t);
		if (rS(n) || aS(n.schema)) r.set(e, { kind: "list" });
		else if (nS(n)) r.set(e, { kind: "single" });
		else if (n.schema._def.typeName === "ZodArray") {
			let t = tS(n.schema._def.type);
			if (nS(t)) {
				r.set(e, { kind: "list" });
				continue;
			}
			if (t.schema._def.typeName === "ZodObject") {
				let n = /* @__PURE__ */ new Set(), i = t.schema.shape;
				for (let [e, t] of Object.entries(i)) nS(tS(t)) && n.add(e);
				n.size > 0 && r.set(e, {
					kind: "nested",
					keys: n
				});
			}
		}
	}
	let a = r;
	return $x.set(e, a), a;
}
function tS(e) {
	let t = [], n = /* @__PURE__ */ new Set(), r = e;
	for (;;) {
		r.description && t.push(r.description);
		let e = Ng(r);
		e && n.add(e);
		let i = r._def.typeName;
		if (i === "ZodOptional" || i === "ZodNullable" || i === "ZodDefault") r = r._def.innerType;
		else if (i === "ZodEffects") r = r._def.schema;
		else return {
			schema: r,
			descriptions: t,
			refs: n
		};
	}
}
function nS(e) {
	return e.refs.has("component-id") || iS(e.descriptions, Xx);
}
function rS(e) {
	return e.refs.has("child-list") || iS(e.descriptions, Zx);
}
function iS(e, t) {
	return e.some((e) => e.startsWith(t));
}
function aS(e) {
	return e._def.typeName === "ZodUnion" && e._def.options.some((e) => {
		if (e._def.typeName !== "ZodObject") return !1;
		let t = e.shape;
		return t.componentId && t.path;
	});
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/resolution/node-resolver.js
var oS = "root", sS = "/", cS = /* @__PURE__ */ new Map(), lS = class {
	constructor(e, t) {
		if (this.records = /* @__PURE__ */ new Map(), this.nodesByEdge = /* @__PURE__ */ new Map(), this.nodesByComponentId = /* @__PURE__ */ new Map(), this.pendingParents = /* @__PURE__ */ new Map(), this.dispatchedErrors = /* @__PURE__ */ new Map(), this.modelSubs = [], this._disposed = !1, t !== e.defaultCatalog) throw new Eg("NodeResolver requires the same catalog instance its surface was constructed with.");
		this.surface = e, this.catalog = t, this.rootId = e.rootId ?? oS, this.rootNode = Xy(void 0), this.modelSubs.push(e.componentsModel.onCreated.subscribe((e) => this.onComponentCreated(e))), this.modelSubs.push(e.componentsModel.onDeleted.subscribe((e) => this.onComponentDeleted(e))), e.componentsModel.get(this.rootId) && this.buildRoot();
	}
	dispatchOnce(e, t, n, r) {
		let i = this.dispatchedErrors.get(t);
		i || (i = /* @__PURE__ */ new Map(), this.dispatchedErrors.set(t, i));
		let a = i.get(n);
		a || (a = /* @__PURE__ */ new Set(), i.set(n, a)), !a.has(e) && (a.add(e), this.surface.dispatchError({
			code: e,
			message: r
		}));
	}
	clearDispatched(e, t) {
		let n = this.dispatchedErrors.get(e);
		n?.delete(t) && n.size === 0 && this.dispatchedErrors.delete(e);
	}
	get activeNodeCount() {
		return this.records.size;
	}
	get disposed() {
		return this._disposed;
	}
	dispose() {
		if (!this._disposed) {
			this._disposed = !0;
			for (let e of this.modelSubs) e.unsubscribe();
			this.modelSubs.length = 0;
			for (let e of [...this.records.keys()]) this.disposeNode(e);
			this.pendingParents.clear(), this.dispatchedErrors.clear(), this.rootRecord = void 0, nb(this.rootNode, void 0);
		}
	}
	buildRoot() {
		if (this.rootRecord) return;
		let e = `>${dS(this.rootId)}>${dS(this.rootId)}@/`, t = this.createNode(this.rootId, sS, e, void 0);
		this.rootRecord = this.records.get(t), nb(this.rootNode, t);
	}
	onComponentCreated(e) {
		if (this._disposed) return;
		if (e.id === this.rootId) {
			let e = this.surface.componentsModel.get(this.rootId);
			this.rootRecord && this.rootRecord.componentModel !== e && (this.disposeNode(this.rootRecord.node), this.rootRecord = void 0, e || nb(this.rootNode, void 0)), e && this.buildRoot();
		}
		let t = this.pendingParents.get(e.id);
		if (t) {
			this.pendingParents.delete(e.id);
			for (let e of t) {
				let t = this.records.get(e);
				t && !e.disposed && this.materialize(t);
			}
		}
	}
	onComponentDeleted(e) {
		if (this._disposed) return;
		this.dispatchedErrors.delete(e);
		let t = this.surface.componentsModel.get(e), n = this.nodesByComponentId.get(e);
		if (!n) return;
		let r = /* @__PURE__ */ new Set(), i = !1;
		for (let e of [...n]) {
			let t = this.records.get(e);
			t && (t.parent ? r.add(t.parent) : i = !0);
		}
		i && this.rootRecord && (t ? this.rootRecord.componentModel !== t && (this.disposeNode(this.rootRecord.node), this.rootRecord = void 0, this.buildRoot()) : (this.disposeNode(this.rootRecord.node), this.rootRecord = void 0, nb(this.rootNode, void 0)));
		for (let e of r) {
			let t = this.records.get(e);
			t && !e.disposed && this.materialize(t);
		}
	}
	createNode(e, t, n, r, i = 1) {
		let a = this.surface.componentsModel.get(e);
		if (!a) {
			let a = this.registerNode(new qx(fS(e, t, i), e, Gx, t, {}, void 0, "pending"), {
				edgeKey: n,
				parent: r,
				occurrence: i,
				refFields: cS
			});
			return r && this.registerPendingParent(e, r), a.node;
		}
		let o = (a.catalog?.components.size ? a.catalog : void 0) ?? this.catalog, s = o.components.get(a.type);
		if (!s) return this.dispatchOnce("UNKNOWN_COMPONENT_TYPE", e, t, `Component '${e}' has type '${a.type}', which is not in catalog '${o.id}'.`), this.registerNode(new qx(fS(e, t, i), e, a.type, t, {}, void 0, "unknown-type"), {
			edgeKey: n,
			parent: r,
			occurrence: i,
			refFields: cS,
			componentModel: a
		}).node;
		this.clearDispatched(e, t);
		let c = r ? this.records.get(r)?.context?.dataContext : void 0, l = new Cx(this.surface, e, t, c), u = new Lx(l, s.schema), d = this.registerNode(new qx(fS(e, t, i), e, a.type, t, {}, s), {
			edgeKey: n,
			parent: r,
			occurrence: i,
			refFields: eS(s.schema),
			behavior: wx(s.schema),
			context: l,
			componentModel: a,
			binder: u
		});
		return d.binderSub = u.subscribe((e) => {
			d.lastBinderProps = e, this.materialize(d);
		}), d.lastBinderProps = u.snapshot, this.materialize(d), d.node;
	}
	registerNode(e, t) {
		let n = {
			node: e,
			edgeKey: t.edgeKey,
			parent: t.parent,
			occurrence: t.occurrence,
			refFields: t.refFields,
			behavior: t.behavior,
			context: t.context,
			componentModel: t.componentModel,
			binder: t.binder,
			childEdges: /* @__PURE__ */ new Map()
		};
		this.records.set(e, n), this.nodesByEdge.set(t.edgeKey, e);
		let r = this.nodesByComponentId.get(e.componentId);
		return r || (r = /* @__PURE__ */ new Set(), this.nodesByComponentId.set(e.componentId, r)), r.add(e), n;
	}
	childNode(e, t, n, r, i = 1) {
		let a = this.nodesByEdge.get(n);
		if (this.isCyclic(e, t, r)) return a && !a.disposed && a.isPlaceholder && this.records.get(a)?.occurrence === i ? a : (a && !a.disposed && this.disposeNode(a), this.dispatchOnce("CYCLIC_REFERENCE", e, t, `Component '${e}' at '${t}' is referenced by one of its own descendants; rendering a placeholder instead.`), this.registerNode(new qx(fS(e, t, i), e, Gx, t, {}, void 0, "cyclic"), {
			edgeKey: n,
			parent: r,
			occurrence: i,
			refFields: cS
		}).node);
		if (a && !a.disposed) {
			let n = this.surface.componentsModel.get(e), o = (n?.catalog?.components.size ? n.catalog : void 0) ?? this.catalog, s = n ? o.components.get(n.type) : void 0, c = this.records.get(a);
			if (a.componentId === e && a.dataPath === t && c?.occurrence === i && (a.isPlaceholder ? n === void 0 && a.state === "pending" || n !== void 0 && s === void 0 && a.state === "unknown-type" && c?.componentModel === n : n !== void 0 && a.type === n.type && c?.componentModel === n)) return a.state === "pending" && this.registerPendingParent(e, r), a;
			this.disposeNode(a);
		}
		return this.createNode(e, t, n, r, i);
	}
	registerPendingParent(e, t) {
		let n = this.pendingParents.get(e);
		n || (n = /* @__PURE__ */ new Set(), this.pendingParents.set(e, n)), n.add(t);
	}
	isCyclic(e, t, n) {
		for (let r = n; r; r = this.records.get(r)?.parent) if (r.componentId === e && r.dataPath === t) return !0;
		return !1;
	}
	materialize(e) {
		if (e.node.disposed) return;
		let t = { ...e.lastBinderProps ?? e.binder?.snapshot ?? {} }, n = /* @__PURE__ */ new Map(), r = e.componentModel?.properties;
		if (r) for (let n of e.refFields.keys()) n in t && !(n in r) && delete t[n];
		let i = /* @__PURE__ */ new Map(), a = (t, r, a) => {
			let o = `${dS(r)}@${dS(a)}`, s = (i.get(o) ?? 0) + 1;
			i.set(o, s);
			let c = `${e.edgeKey}>${t}>${o}`, l = this.childNode(r, a, c, e.node, s);
			return n.set(c, l), l;
		};
		for (let [n, r] of e.refFields) switch (r.kind) {
			case "single": {
				let r = t[n];
				typeof r == "string" && r && (t[n] = a(dS(n), r, e.node.dataPath));
				break;
			}
			case "list": {
				let r = t[n];
				if (!Array.isArray(r)) break;
				t[n] = Ix(r).map((t, r) => {
					if (typeof t == "string" && t) return a(`${dS(n)}[${r}]`, t, e.node.dataPath);
					if (t && typeof t == "object" && !Array.isArray(t)) {
						let i = t;
						if (typeof i.id == "string" && typeof i.basePath == "string") return a(`${dS(n)}[${r}]`, i.id, i.basePath);
						if (typeof i.componentId == "string" && i.componentId) return a(`${dS(n)}[${r}]`, i.componentId, e.node.dataPath);
					}
					return t;
				});
				break;
			}
			case "nested": {
				let i = t[n];
				if (!Array.isArray(i)) break;
				t[n] = i.map((t, i) => {
					if (!t || typeof t != "object" || Array.isArray(t)) return t;
					let o = { ...t }, s = !1;
					for (let t of r.keys) {
						let r = o[t];
						typeof r == "string" && r && (o[t] = a(`${dS(n)}[${i}].${dS(t)}`, r, e.node.dataPath), s = !0);
					}
					return s ? o : t;
				});
				break;
			}
		}
		for (let [t, r] of e.childEdges) if (!n.has(t) && (this.disposeNode(r), r.isPlaceholder && ![...n.values()].some((e) => e.isPlaceholder && e.componentId === r.componentId))) {
			let t = this.pendingParents.get(r.componentId);
			t && (t.delete(e.node), t.size === 0 && this.pendingParents.delete(r.componentId));
		}
		e.childEdges = n;
		let o = e.behavior && e.context ? pS(t, e.behavior, r ?? {}, e.context.dataContext) : t, s = rb(e.node.props);
		for (let e of Object.keys(o)) o[e] = mS(s[e], o[e]);
		e.node.setProps(o);
	}
	disposeNode(e) {
		if (e.disposed) return;
		let t = this.records.get(e);
		if (t) {
			for (let e of t.childEdges.values()) this.disposeNode(e);
			t.childEdges.clear(), t.binderSub?.unsubscribe(), t.binderSub = void 0, this.nodesByEdge.get(t.edgeKey) === e && this.nodesByEdge.delete(t.edgeKey), this.records.delete(e);
		}
		let n = this.nodesByComponentId.get(e.componentId);
		n && (n.delete(e), n.size === 0 && this.nodesByComponentId.delete(e.componentId));
		for (let [t, n] of this.pendingParents) n.delete(e), n.size === 0 && this.pendingParents.delete(t);
		e.state === "cyclic" && this.clearDispatched(e.componentId, e.dataPath), e.dispose();
	}
}, uS = {
	"~": "~0",
	"#": "~1",
	"[": "~2",
	"]": "~3",
	">": "~4",
	"@": "~5"
};
function dS(e) {
	return e.replace(/[~#[\]>@]/g, (e) => uS[e]);
}
function fS(e, t, n) {
	let r = t.replace(/\/+$/, "") || sS, i = t === sS ? dS(e) : `${dS(e)}-[${dS(r)}]`;
	return n > 1 ? `${i}#${n}` : i;
}
function pS(e, t, n, r) {
	switch (t.type) {
		case "DYNAMIC": {
			let t = n && typeof n == "object" && !Array.isArray(n) && typeof n.path == "string" ? n.path : void 0;
			return t === void 0 ? new zx(e) : new Bx(e, (e) => r.set(t, e), t);
		}
		case "ARRAY": {
			if (!Array.isArray(e)) return e;
			let i = Array.isArray(n) ? n : [];
			return e.map((e, n) => pS(e, t.element, i[n], r));
		}
		case "OBJECT": {
			if (!e || typeof e != "object" || Array.isArray(e)) return e;
			let i = /* @__PURE__ */ new Set();
			for (let [e, n] of Object.entries(t.shape)) n.type === "DYNAMIC" && i.add(`set${e.charAt(0).toUpperCase()}${e.slice(1)}`);
			let a = n && typeof n == "object" && !Array.isArray(n) ? n : {}, o = {};
			for (let [n, s] of Object.entries(e)) i.has(n) || (o[n] = pS(s, t.shape[n] ?? { type: "STATIC" }, a[n], r));
			for (let [e, n] of Object.entries(t.shape)) n.type === "DYNAMIC" && !(e in o) && (o[e] = new zx(void 0));
			return o;
		}
		default: return e;
	}
}
function mS(e, t) {
	if (Object.is(e, t)) return t;
	if (e instanceof zx && t instanceof zx) return Hx(e, t) ? e : t;
	if (Kx(e) || Kx(t)) return t;
	if (Array.isArray(e) && Array.isArray(t) && e.length === t.length) {
		let n = !0, r = t.map((t, r) => {
			let i = mS(e[r], t);
			return Object.is(i, e[r]) || (n = !1), i;
		});
		return n ? e : r;
	}
	if (hS(e) && hS(t)) {
		let n = Object.keys(e), r = Object.keys(t);
		if (n.length === r.length) {
			let n = !0, i = {};
			for (let a of r) {
				let r = mS(e[a], t[a]);
				i[a] = r, (!(a in e) || !Object.is(r, e[a])) && (n = !1);
			}
			return n ? e : i;
		}
	}
	return t;
}
function hS(e) {
	if (!e || typeof e != "object" || Array.isArray(e) || Kx(e)) return !1;
	let t = Object.getPrototypeOf(e);
	return t === Object.prototype || t === null;
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/v0_9/schema/common-types.js
var gS = Mg(J().describe("REF:#/$defs/ComponentId|The unique identifier for a component, used for both definitions and references within the same surface."), "component-id"), _S = Z({ path: J().describe("A JSON Pointer path to a value in the data model.") }).strict().describe("REF:#/$defs/DataBinding"), vS = _g([
	J(),
	Y(),
	mg(),
	X(hg()),
	_S,
	bg(() => yS)
]).describe("REF:#/$defs/DynamicValue|A value that can be a literal, a path, or a function call returning any type."), yS = Z({
	call: J().describe("The name of the function to call."),
	args: yg(J(), _g([vS, yg(J(), hg()).describe("A literal object argument (e.g. configuration).")])).describe("Arguments passed to the function.").optional(),
	returnType: Q([
		"string",
		"number",
		"boolean",
		"array",
		"object",
		"any",
		"void"
	]).describe("The expected return type of the function call.").default("boolean")
}).describe("REF:#/$defs/FunctionCall|Invokes a named function on the client."), bS = _g([
	J(),
	_S,
	yS
]).describe("REF:#/$defs/DynamicString|Represents a string"), xS = Z({
	label: bS.optional(),
	description: bS.optional()
}).describe("REF:#/$defs/AccessibilityAttributes|Attributes to enhance accessibility when using assistive technologies like screen readers."), SS = Z({
	id: gS,
	accessibility: xS.optional()
}).describe("REF:#/$defs/ComponentCommon"), CS = Mg(_g([X(gS).describe("A static list of child component IDs."), Z({
	componentId: gS,
	path: J().describe("The path to the list of component property objects in the data model.")
}).strict().describe("A template for generating a dynamic list of children from a data model list. The `componentId` is the component to use as a template.")]).describe("REF:#/$defs/ChildList"), "child-list"), wS = _g([
	Y(),
	_S,
	yS
]).describe("REF:#/$defs/DynamicNumber|Represents a value that can be either a literal number, a path to a number in the data model, or a function call returning a number."), TS = _g([
	mg(),
	_S,
	yS
]).describe("REF:#/$defs/DynamicBoolean|A boolean value that can be a literal, a path, or a function call returning a boolean."), ES = _g([
	X(J()),
	_S,
	yS
]).describe("REF:#/$defs/DynamicStringList|Represents a value that can be either a literal array of strings, a path to a string array in the data model, or a function call returning a string array."), DS = Z({
	condition: TS,
	message: J().describe("The error message to display if the check fails.")
}).strict().describe("REF:#/$defs/CheckRule|A single validation rule applied to an input component."), OS = Z({ checks: X(DS).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional() }).describe("REF:#/$defs/Checkable|Properties for components that support client-side checks."), kS = _g([Z({ event: Z({
	name: J().describe("The name of the action to be dispatched to the server."),
	context: yg(J(), vS).describe("A JSON object containing the key-value pairs for the action context. Values can be literals or paths. Use literal values unless the value must be dynamically bound to the data model. Do NOT use paths for static IDs.").optional()
}).strict().describe("The event to dispatch to the server.") }).strict().describe("Triggers a server-side event."), Z({ functionCall: yS }).strict().describe("Executes a local client-side function.")]).describe("REF:#/$defs/Action|Defines an interaction handler that can either trigger a server-side event or execute a local client-side function."), AS = {
	ComponentId: gS,
	DataBinding: _S,
	DynamicValue: vS,
	FunctionCall: yS,
	DynamicString: bS,
	AccessibilityAttributes: xS,
	ComponentCommon: SS,
	ChildList: CS,
	DynamicNumber: wS,
	DynamicBoolean: TS,
	DynamicStringList: ES,
	CheckRule: DS,
	Checkable: OS,
	Action: kS
}, jS = {
	name: "Text",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		text: bS.describe("REF:#/$defs/DynamicString|The text content to display. While simple Markdown formatting is supported (i.e. without HTML, images, or links), utilizing dedicated UI components is generally preferred for a richer and more structured presentation."),
		variant: Q([
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"caption",
			"body"
		]).default("body").describe("A hint for the base text style.").optional()
	}).strict()
}, MS = {
	name: "Image",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		url: bS.describe("REF:#/$defs/DynamicString|The URL of the image to display."),
		description: bS.describe("REF:#/$defs/DynamicString|Accessibility text for the image.").optional(),
		fit: Q([
			"contain",
			"cover",
			"fill",
			"none",
			"scaleDown"
		]).default("fill").describe("Specifies how the image should be resized to fit its container. This corresponds to the CSS 'object-fit' property.").optional(),
		variant: Q([
			"icon",
			"avatar",
			"smallFeature",
			"mediumFeature",
			"largeFeature",
			"header"
		]).default("mediumFeature").describe("A hint for the image size and style.").optional()
	}).strict()
}, NS = {
	name: "Icon",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		name: _g([
			Q(/* @__PURE__ */ "accountCircle.add.arrowBack.arrowForward.attachFile.calendarToday.call.camera.check.close.delete.download.edit.event.error.fastForward.favorite.favoriteOff.folder.help.home.info.locationOn.lock.lockOpen.mail.menu.moreVert.moreHoriz.notificationsOff.notifications.pause.payment.person.phone.photo.play.print.refresh.rewind.search.send.settings.share.shoppingCart.skipNext.skipPrevious.star.starHalf.starOff.stop.upload.visibility.visibilityOff.volumeDown.volumeMute.volumeOff.volumeUp.warning".split(".")),
			Z({ svgPath: J() }),
			_S.describe("REF:#/$defs/DataBinding")
		]).describe("The name of the icon to display.")
	}).strict()
}, PS = {
	name: "Video",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		url: bS.describe("REF:#/$defs/DynamicString|The URL of the video to display.")
	}).strict()
}, FS = {
	name: "AudioPlayer",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		url: bS.describe("REF:#/$defs/DynamicString|The URL of the audio to be played."),
		description: bS.describe("REF:#/$defs/DynamicString|A description of the audio, such as a title or summary.").optional()
	}).strict()
}, IS = {
	name: "Row",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		children: CS.describe("REF:#/$defs/ChildList|Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID."),
		justify: Q([
			"center",
			"end",
			"spaceAround",
			"spaceBetween",
			"spaceEvenly",
			"start",
			"stretch"
		]).default("start").describe("Defines the arrangement of children along the main axis (horizontally). Use 'spaceBetween' to push items to the edges, or 'start'/'end'/'center' to pack them together.").optional(),
		align: Q([
			"start",
			"center",
			"end",
			"stretch"
		]).default("stretch").describe("Defines the alignment of children along the cross axis (vertically). This is similar to the CSS 'align-items' property, but uses camelCase values (e.g., 'start').").optional()
	}).strict()
}, LS = {
	name: "Column",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		children: CS.describe("REF:#/$defs/ChildList|Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID."),
		justify: Q([
			"start",
			"center",
			"end",
			"spaceBetween",
			"spaceAround",
			"spaceEvenly",
			"stretch"
		]).default("start").describe("Defines the arrangement of children along the main axis (vertically). Use 'spaceBetween' to push items to the edges (e.g. header at top, footer at bottom), or 'start'/'end'/'center' to pack them together.").optional(),
		align: Q([
			"center",
			"end",
			"start",
			"stretch"
		]).default("stretch").describe("Defines the alignment of children along the cross axis (horizontally). This is similar to the CSS 'align-items' property.").optional()
	}).strict()
}, RS = {
	name: "List",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		children: CS.describe("REF:#/$defs/ChildList|Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list."),
		direction: Q(["vertical", "horizontal"]).default("vertical").describe("The direction in which the list items are laid out.").optional(),
		align: Q([
			"start",
			"center",
			"end",
			"stretch"
		]).default("stretch").describe("Defines the alignment of children along the cross axis.").optional()
	}).strict()
}, zS = {
	name: "Card",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		child: gS.describe("REF:#/$defs/ComponentId|The ID of the single child component to be rendered inside the card. To display multiple elements, you MUST wrap them in a layout component (like Column or Row) and pass that container's ID here. Do NOT pass multiple IDs or a non-existent ID.")
	}).strict()
}, BS = {
	name: "Tabs",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		tabs: X(Z({
			title: bS.describe("REF:#/$defs/DynamicString|The tab title."),
			child: gS.describe("REF:#/$defs/ComponentId|The ID of the child component.")
		})).min(1).describe("An array of objects, where each object defines a tab with a title and a child component.")
	}).strict()
}, VS = {
	name: "Modal",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		trigger: gS.describe("REF:#/$defs/ComponentId|The ID of the component that opens the modal when interacted with (e.g., a button)."),
		content: gS.describe("REF:#/$defs/ComponentId|The ID of the component to be displayed inside the modal.")
	}).strict()
}, HS = {
	name: "Divider",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		axis: Q(["horizontal", "vertical"]).default("horizontal").describe("The orientation of the divider.").optional()
	}).strict()
}, US = {
	name: "Button",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		checks: X(DS).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional(),
		child: gS.describe("REF:#/$defs/ComponentId|The ID of the child component. Use a 'Text' component for a labeled button. Only use an 'Icon' if the requirements explicitly ask for an icon-only button."),
		variant: Q([
			"default",
			"primary",
			"borderless"
		]).default("default").describe("A hint for the button style. If omitted, a default button style is used. 'primary' indicates this is the main call-to-action button. 'borderless' means the button has no visual border or background, making its child content appear like a clickable link.").optional(),
		action: kS.describe("REF:#/$defs/Action")
	}).strict()
}, WS = {
	name: "TextField",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		checks: X(DS).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional(),
		label: bS.describe("REF:#/$defs/DynamicString|The text label for the input field."),
		value: bS.describe("REF:#/$defs/DynamicString|The value of the text field.").optional(),
		variant: Q([
			"longText",
			"number",
			"shortText",
			"obscured"
		]).default("shortText").describe("The type of input field to display.").optional(),
		validationRegexp: J().describe("A regular expression used for client-side validation of the input.").optional()
	}).strict()
}, GS = {
	name: "CheckBox",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		checks: X(DS).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional(),
		label: bS.describe("REF:#/$defs/DynamicString|The text to display next to the checkbox."),
		value: TS.describe("REF:#/$defs/DynamicBoolean|The current state of the checkbox (true for checked, false for unchecked).")
	}).strict()
}, KS = {
	name: "ChoicePicker",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		checks: X(DS).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional(),
		label: bS.describe("REF:#/$defs/DynamicString|The label for the group of options.").optional(),
		variant: Q(["multipleSelection", "mutuallyExclusive"]).default("mutuallyExclusive").describe("A hint for how the choice picker should be displayed and behave.").optional(),
		options: X(Z({
			label: bS.describe("REF:#/$defs/DynamicString|The text to display for this option."),
			value: J().describe("The stable value associated with this option.")
		})).describe("The list of available options to choose from."),
		value: ES.describe("REF:#/$defs/DynamicStringList|The list of currently selected values. This should be bound to a string array in the data model."),
		displayStyle: Q(["checkbox", "chips"]).default("checkbox").describe("The display style of the component.").optional(),
		filterable: mg().default(!1).describe("If true, displays a search input to filter the options.").optional()
	}).strict()
}, qS = {
	name: "Slider",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		checks: X(DS).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional(),
		label: bS.describe("REF:#/$defs/DynamicString|The label for the slider.").optional(),
		min: Y().default(0).describe("The minimum value of the slider.").optional(),
		max: Y().describe("The maximum value of the slider."),
		value: wS.describe("REF:#/$defs/DynamicNumber|The current value of the slider.")
	}).strict()
}, JS = {
	name: "DateTimeInput",
	schema: Z({
		accessibility: xS.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		weight: Y().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		checks: X(DS).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional(),
		value: bS.describe("REF:#/$defs/DynamicString|The selected date and/or time value in ISO 8601 format. If not yet set, initialize with an empty string."),
		enableDate: mg().default(!1).describe("If true, allows the user to select a date.").optional(),
		enableTime: mg().default(!1).describe("If true, allows the user to select a time.").optional(),
		min: bS.describe("REF:#/$defs/DynamicString|The minimum allowed date/time in ISO 8601 format.").optional(),
		max: bS.describe("REF:#/$defs/DynamicString|The maximum allowed date/time in ISO 8601 format.").optional(),
		label: bS.describe("REF:#/$defs/DynamicString|The text label for the input field.").optional()
	}).strict()
}, YS = `
  :where(:root) {
    color-scheme: light dark;
  }

  :where(.a2ui-dark) {
    color-scheme: dark;
  }

  :where(.a2ui-light) {
    color-scheme: light;
  }

  :where(:root), :where(.a2ui-dark), :where(.a2ui-light) {
    --a2ui-color-background: light-dark(#eee, #111);
    --a2ui-color-on-background: light-dark(#333, #eee);

    --a2ui-color-surface: light-dark(
      color-mix(in oklab, var(--a2ui-color-background) 85%, white),
      color-mix(in oklab, var(--a2ui-color-background) 95%, white)
    );
    --a2ui-color-on-surface: light-dark(#333, #eee);

    --a2ui-color-primary: #17e;
    --a2ui-color-primary-light: ${$S("light", { colorVar: "--a2ui-color-primary" })};
    --a2ui-color-primary-dark: ${$S("dark", { colorVar: "--a2ui-color-primary" })};
    --a2ui-color-primary-hover: ${$S("hover", {
	darkVar: "--a2ui-color-primary-dark",
	lightVar: "--a2ui-color-primary-light"
})};
    --a2ui-color-on-primary: #fff;

    --a2ui-color-secondary: light-dark(#ddd, #333);
    --a2ui-color-secondary-light: ${$S("light", { colorVar: "--a2ui-color-secondary" })};
    --a2ui-color-secondary-dark: ${$S("dark", {
	colorVar: "--a2ui-color-secondary",
	percentage: 95
})};
    --a2ui-color-secondary-hover: ${$S("hover", {
	darkVar: "--a2ui-color-secondary-dark",
	lightVar: "--a2ui-color-secondary-light"
})};
    --a2ui-color-on-secondary: light-dark(#333, #eee);

    --a2ui-border-radius: 0.25rem;
    --a2ui-color-border: light-dark(#ccc, #444);
    --a2ui-border-width: 1px;
    --a2ui-border: 1px solid var(--a2ui-color-border, #ccc);

    --a2ui-font-family-title: inherit;
    --a2ui-font-family-monospace: monospace;
    --a2ui-color-input: light-dark(#fff, #2a2a2a);
    --a2ui-color-on-input: light-dark(#333, #eee);

    --a2ui-grid-base: 0.5rem;
    --a2ui-spacing-xs: calc(var(--a2ui-spacing-s) / 2);
    --a2ui-spacing-s: calc(var(--a2ui-spacing-m) / 2);
    --a2ui-spacing-m: var(--a2ui-grid-base);
    --a2ui-spacing-l: calc(var(--a2ui-spacing-m) * 2);
    --a2ui-spacing-xl: calc(var(--a2ui-spacing-l) * 2);

    --a2ui-font-size: 1rem;
    --a2ui-font-scale: 1.2;
    --a2ui-font-size-xs: calc(var(--a2ui-font-size-s) / var(--a2ui-font-scale));
    --a2ui-font-size-s: calc(var(--a2ui-font-size-m) / var(--a2ui-font-scale));
    --a2ui-font-size-m: var(--a2ui-font-size);
    --a2ui-font-size-l: calc(var(--a2ui-font-size-m) * var(--a2ui-font-scale));
    --a2ui-font-size-xl: calc(var(--a2ui-font-size-l) * var(--a2ui-font-scale));
    --a2ui-font-size-2xl: calc(var(--a2ui-font-size-xl) * var(--a2ui-font-scale));

    --a2ui-line-height-headings: 1.2;
    --a2ui-line-height-body: 1.5;
  }
`, XS;
function ZS() {
	return XS || (XS = new CSSStyleSheet(), XS.replaceSync(YS)), XS;
}
function QS(e) {
	if (typeof document > "u") return;
	let t = ZS(), n = typeof document < "u" ? document.adoptedStyleSheets : null;
	if (n && typeof n.includes == "function" && !n.includes(t)) try {
		document.adoptedStyleSheets = [...n, t];
	} catch {}
	if (e && e !== document) {
		let n = e.adoptedStyleSheets;
		if (n && typeof n.includes == "function" && !n.includes(t)) try {
			e.adoptedStyleSheets = [...n, t];
		} catch {}
	}
}
function $S(e, t) {
	switch (e) {
		case "light": {
			let e = t;
			return `color-mix(in oklab, var(${e.colorVar}) ${e.percentage ?? 85}%, ${e.mixColor ?? "white"})`;
		}
		case "dark": {
			let e = t;
			return `color-mix(in oklab, var(${e.colorVar}) ${e.percentage ?? 85}%, ${e.mixColor ?? "black"})`;
		}
		case "hover": {
			let e = t;
			return `light-dark(var(${e.darkVar}), var(${e.lightVar}))`;
		}
	}
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/v0_9/basic_catalog/theme.js
var eC = /* @__PURE__ */ u((/* @__PURE__ */ c(((e, t) => {
	t.exports = function(e) {
		var t = {};
		function n(r) {
			if (t[r]) return t[r].exports;
			var i = t[r] = {
				i: r,
				l: !1,
				exports: {}
			};
			return e[r].call(i.exports, i, i.exports, n), i.l = !0, i.exports;
		}
		return n.m = e, n.c = t, n.d = function(e, t, r) {
			n.o(e, t) || Object.defineProperty(e, t, {
				enumerable: !0,
				get: r
			});
		}, n.r = function(e) {
			typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
		}, n.t = function(e, t) {
			if (1 & t && (e = n(e)), 8 & t || 4 & t && typeof e == "object" && e && e.__esModule) return e;
			var r = Object.create(null);
			if (n.r(r), Object.defineProperty(r, "default", {
				enumerable: !0,
				value: e
			}), 2 & t && typeof e != "string") for (var i in e) n.d(r, i, function(t) {
				return e[t];
			}.bind(null, i));
			return r;
		}, n.n = function(e) {
			var t = e && e.__esModule ? function() {
				return e.default;
			} : function() {
				return e;
			};
			return n.d(t, "a", t), t;
		}, n.o = function(e, t) {
			return Object.prototype.hasOwnProperty.call(e, t);
		}, n.p = "", n(n.s = 0);
	}([function(e, t, n) {
		n.r(t), n.d(t, "validateHTMLColorName", (function() {
			return o;
		})), n.d(t, "validateHTMLColorSpecialName", (function() {
			return s;
		})), n.d(t, "validateHTMLColorHex", (function() {
			return c;
		})), n.d(t, "validateHTMLColorRgb", (function() {
			return p;
		})), n.d(t, "validateHTMLColorHsl", (function() {
			return m;
		})), n.d(t, "validateHTMLColorHwb", (function() {
			return h;
		})), n.d(t, "validateHTMLColorLab", (function() {
			return g;
		})), n.d(t, "validateHTMLColorLch", (function() {
			return _;
		})), n.d(t, "validateHTMLColor", (function() {
			return v;
		}));
		let r = (e) => e && typeof e == "string", i = /* @__PURE__ */ "AliceBlue.AntiqueWhite.Aqua.Aquamarine.Azure.Beige.Bisque.Black.BlanchedAlmond.Blue.BlueViolet.Brown.BurlyWood.CadetBlue.Chartreuse.Chocolate.Coral.CornflowerBlue.Cornsilk.Crimson.Cyan.DarkBlue.DarkCyan.DarkGoldenrod.DarkGray.DarkGrey.DarkGreen.DarkKhaki.DarkMagenta.DarkOliveGreen.DarkOrange.DarkOrchid.DarkRed.DarkSalmon.DarkSeaGreen.DarkSlateBlue.DarkSlateGray.DarkSlateGrey.DarkTurquoise.DarkViolet.DeepPink.DeepSkyBlue.DimGray.DimGrey.DodgerBlue.FireBrick.FloralWhite.ForestGreen.Fuchsia.Gainsboro.GhostWhite.Gold.Goldenrod.Gray.Grey.Green.GreenYellow.HoneyDew.HotPink.IndianRed.Indigo.Ivory.Khaki.Lavender.LavenderBlush.LawnGreen.LemonChiffon.LightBlue.LightCoral.LightCyan.LightGoldenrodYellow.LightGray.LightGrey.LightGreen.LightPink.LightSalmon.LightSalmon.LightSeaGreen.LightSkyBlue.LightSlateGray.LightSlateGrey.LightSteelBlue.LightYellow.Lime.LimeGreen.Linen.Magenta.Maroon.MediumAquamarine.MediumBlue.MediumOrchid.MediumPurple.MediumSeaGreen.MediumSlateBlue.MediumSlateBlue.MediumSpringGreen.MediumTurquoise.MediumVioletRed.MidnightBlue.MintCream.MistyRose.Moccasin.NavajoWhite.Navy.OldLace.Olive.OliveDrab.Orange.OrangeRed.Orchid.PaleGoldenrod.PaleGreen.PaleTurquoise.PaleVioletRed.PapayaWhip.PeachPuff.Peru.Pink.Plum.PowderBlue.Purple.RebeccaPurple.Red.RosyBrown.RoyalBlue.SaddleBrown.Salmon.SandyBrown.SeaGreen.SeaShell.Sienna.Silver.SkyBlue.SlateBlue.SlateGray.SlateGrey.Snow.SpringGreen.SteelBlue.Tan.Teal.Thistle.Tomato.Turquoise.Violet.Wheat.White.WhiteSmoke.Yellow.YellowGreen".split("."), a = [
			"currentColor",
			"inherit",
			"transparent"
		], o = (e) => {
			let t = !1;
			return r(e) && i.map((n) => (e.toLowerCase() === n.toLowerCase() && (t = !0), null)), t;
		}, s = (e) => {
			let t = !1;
			return r(e) && a.map((n) => (e.toLowerCase() === n.toLowerCase() && (t = !0), null)), t;
		}, c = (e) => r(e) ? e && /^#([\da-f]{3}){1,2}$|^#([\da-f]{4}){1,2}$/i.test(e) : !1, l = "(([0-9]|[1-9][0-9]|100)%)", u = `(${l}|(0?((\\.([\\d]{1,5}))?))|1)`, d = `([\\s]{0,5})\\)?)(([\\s]{0,5})(\\/?)([\\s]{1,5})${`(((${l}))|(0?((\\.([\\d]{1,5}))?))|1))?`}([\\s]{0,5})\\)`, f = "(-?(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9])((\\.([\\d]{1,5}))?)|360)(deg)?)", p = (e) => {
			if (r(e)) {
				let t = "([\\s]{0,5})([\\d]{1,5})%?([\\s]{0,5}),?", n = "((([\\s]{0,5}),?([\\s]{0,5}))|(([\\s]{1,5})))", r = RegExp(`^(rgb)a?\\(${`${t}${n}`}${`${t}${n}`}${`${t}${n}`}((\\/?([\\s]{0,5})(0?\\.?([\\d]{1,5})%?([\\s]{0,5}))?|1|0))?\\)$`);
				return e && r.test(e);
			}
			return !1;
		}, m = (e) => {
			if (r(e)) {
				let t = RegExp(`^(hsl)a?\\((([\\s]{0,5})(${f}|(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-9][0-9]|400)grad)|((([0-5])?\\.([\\d]{1,5})|6\\.([0-9]|1[0-9]|2[0-8])|[0-6])rad)|((0?((\\.([\\d]{1,5}))?)|1)turn))((([\\s]{0,5}),([\\s]{0,5}))|(([\\s]{1,5}))))(([\\s]{0,5})(0|${l})((([\\s]{0,5}),([\\s]{0,5}))|(([\\s]{1,5}))))(([\\s]{0,5})(0|${l})([\\s]{0,5})\\)?)(([\\s]{0,5})(\\/?|,?)([\\s]{0,5})(((${l}))|(0?((\\.([\\d]{1,5}))?))|1))?\\)$`);
				return e && t.test(e);
			}
			return !1;
		}, h = (e) => {
			if (r(e)) {
				let t = RegExp(`^(hwb\\(([\\s]{0,5})${f}([\\s]{1,5}))((0|${l})([\\s]{1,5}))((0|${l})${d}$`);
				return e && t.test(e);
			}
			return !1;
		}, g = (e) => {
			if (r(e)) {
				let t = "(-?(([0-9]|[1-9][0-9]|1[0-5][0-9])((\\.([\\d]{1,5}))?)?|160))", n = RegExp(`^(lab\\(([\\s]{0,5})((([\\d]{0,5})((\\.([\\d]{1,5}))?))%)([\\s]{1,5})${t}([\\s]{1,5})${t}${d}$`);
				return e && n.test(e);
			}
			return !1;
		}, _ = (e) => {
			if (r(e)) {
				let t = `((${f})|(0|${u})|(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9])((\\.([\\d]{1,5}))?)|360))`, n = `(\\/([\\s]{0,5})${u})`, r = RegExp(`^lch\\(${`(([\\s]{0,5})((([0-9]|[1-9][0-9])?((\\.([\\d]{1,5}))?)|100)(%)?)([\\s]{1,5})(([\\d]{0,5})((\\.([\\d]{1,5}))?))([\\s]{1,5})${t}([\\s]{0,5})(${n})?)`}\\)$`);
				return e && r.test(e);
			}
			return !1;
		}, v = (e) => !!(e && c(e) || p(e) || m(e) || h(e) || g(e) || _(e));
		t.default = (e) => !!(e && c(e) || o(e) || s(e) || p(e) || m(e) || h(e) || g(e) || _(e));
	}]);
})))(), 1);
function tC(e) {
	if (typeof e != "string" || !e.trim()) return !1;
	let t = e.trim();
	if (typeof CSS < "u" && typeof CSS.supports == "function") return CSS.supports("color", t);
	let n = typeof eC.default == "function" ? eC.default : eC.default?.default;
	return typeof n == "function" && n(t);
}
var nC = Z({
	primaryColor: J().refine((e) => tC(e), "primaryColor must be a valid CSS color (e.g. '#00BFFF', '#17e', 'red', 'rgb(255, 0, 0)')").optional().describe("The primary brand color used for highlights (e.g., primary buttons, active borders). Renderers may generate variants of this color for different contexts. Format: Hexadecimal code, named color, or functional notation (e.g., '#00BFFF', 'red', 'rgb(255, 0, 0)')."),
	iconUrl: J().optional().describe("A URL for an image that identifies the agent or tool associated with the surface."),
	agentDisplayName: J().optional().describe("Text to be displayed next to the surface to identify the agent or tool that created it.")
}).passthrough(), rC = {
	name: "required",
	returnType: "boolean",
	schema: Z({ value: hg().refine((e) => e !== void 0, "Required").describe("The value to check.") })
}, iC = {
	name: "regex",
	returnType: "boolean",
	schema: Z({
		value: bS.describe("REF:#/$defs/DynamicString"),
		pattern: J().describe("The regex pattern to match against.")
	})
}, aC = {
	name: "length",
	returnType: "boolean",
	schema: Z({
		value: bS.describe("REF:#/$defs/DynamicString"),
		min: Y().int().describe("The minimum allowed length.").optional(),
		max: Y().int().describe("The maximum allowed length.").optional()
	})
}, oC = {
	name: "numeric",
	returnType: "boolean",
	schema: Z({
		value: wS.describe("REF:#/$defs/DynamicNumber"),
		min: Y().describe("The minimum allowed value.").optional(),
		max: Y().describe("The maximum allowed value.").optional()
	})
}, sC = {
	name: "email",
	returnType: "boolean",
	schema: Z({ value: bS.describe("REF:#/$defs/DynamicString") })
}, cC = {
	name: "formatString",
	returnType: "string",
	schema: Z({ value: bS.describe("REF:#/$defs/DynamicString") })
}, lC = {
	name: "formatNumber",
	returnType: "string",
	schema: Z({
		value: wS.describe("REF:#/$defs/DynamicNumber|The number to format."),
		decimals: wS.describe("REF:#/$defs/DynamicNumber|Optional. The number of decimal places to show. Defaults to 0 or 2 depending on locale.").optional(),
		grouping: TS.describe("REF:#/$defs/DynamicBoolean|Optional. If true, uses locale-specific grouping separators (e.g. '1,000'). If false, returns raw digits (e.g. '1000'). Defaults to true.").optional()
	})
}, uC = {
	name: "formatCurrency",
	returnType: "string",
	schema: Z({
		value: wS.describe("REF:#/$defs/DynamicNumber|The monetary amount."),
		currency: bS.describe("REF:#/$defs/DynamicString|The ISO 4217 currency code (e.g., 'USD', 'EUR')."),
		decimals: wS.describe("REF:#/$defs/DynamicNumber|Optional. The number of decimal places to show. Defaults to 0 or 2 depending on locale.").optional(),
		grouping: TS.describe("REF:#/$defs/DynamicBoolean|Optional. If true, uses locale-specific grouping separators (e.g. '1,000'). If false, returns raw digits (e.g. '1000'). Defaults to true.").optional()
	})
}, dC = {
	name: "formatDate",
	returnType: "string",
	schema: Z({
		value: vS.describe("REF:#/$defs/DynamicValue|The date to format."),
		format: bS.describe("REF:#/$defs/DynamicString|A Unicode TR35 date pattern string.\n\nToken Reference:\n- Year: 'yy' (26), 'yyyy' (2026)\n- Month: 'M' (1), 'MM' (01), 'MMM' (Jan), 'MMMM' (January)\n- Day: 'd' (1), 'dd' (01), 'E' (Tue), 'EEEE' (Tuesday)\n- Hour (12h): 'h' (1-12), 'hh' (01-12) - requires 'a' for AM/PM\n- Hour (24h): 'H' (0-23), 'HH' (00-23) - Military Time\n- Minute: 'mm' (00-59)\n- Second: 'ss' (00-59)\n- Period: 'a' (AM/PM)\n\nExamples:\n- 'MMM dd, yyyy' -> 'Jan 16, 2026'\n- 'HH:mm' -> '14:30' (Military)\n- 'h:mm a' -> '2:30 PM'\n- 'EEEE, d MMMM' -> 'Friday, 16 January'")
	})
}, fC = {
	name: "pluralize",
	returnType: "string",
	schema: Z({
		value: wS.describe("REF:#/$defs/DynamicNumber|The numeric value used to determine the plural category."),
		zero: bS.describe("REF:#/$defs/DynamicString|String for the 'zero' category (e.g., 0 items).").optional(),
		one: bS.describe("REF:#/$defs/DynamicString|String for the 'one' category (e.g., 1 item).").optional(),
		two: bS.describe("REF:#/$defs/DynamicString|String for the 'two' category (used in Arabic, Welsh, etc.).").optional(),
		few: bS.describe("REF:#/$defs/DynamicString|String for the 'few' category (e.g., small groups in Slavic languages).").optional(),
		many: bS.describe("REF:#/$defs/DynamicString|String for the 'many' category (e.g., large groups in various languages).").optional(),
		other: bS.describe("REF:#/$defs/DynamicString|The default/fallback string (used for general plural cases).")
	})
}, pC = {
	name: "openUrl",
	returnType: "void",
	schema: Z({ url: J().describe("The URL to open.") })
}, mC = {
	name: "and",
	returnType: "boolean",
	schema: Z({ values: X(TS).min(2).describe("The list of boolean values to evaluate.") })
}, hC = {
	name: "or",
	returnType: "boolean",
	schema: Z({ values: X(TS).min(2).describe("The list of boolean values to evaluate.") })
}, gC = {
	name: "not",
	returnType: "boolean",
	schema: Z({ value: TS.describe("REF:#/$defs/DynamicBoolean|The boolean value to negate.") })
}, _C = 1e4, vC = 1e3, yC = class e {
	parse(t, n = 0) {
		if (n > e.MAX_DEPTH) throw new Tg("Max recursion depth reached in parse");
		if (t && t.length > 1e4) throw new Tg(`Expression template length (${t.length}) exceeds maximum limit (${_C})`);
		if (!t) return [];
		if (!t.includes("${")) return [t];
		let r = [], i = new bC(t);
		for (; !i.isAtEnd();) {
			if (r.length >= 1e3) throw new Tg(`Expression parts count exceeds maximum limit (${vC})`);
			if (i.matches("${")) {
				i.advance(2);
				let e = this.extractInterpolationContent(i), t = this.parseExpression(e, n + 1);
				t !== null && r.push(t);
			} else if (i.peek() === "\\" && i.peek(1) === "$" && i.peek(2) === "{") i.advance(), r.push("${"), i.advance(2);
			else {
				let e = i.pos;
				for (; !i.isAtEnd() && !(i.matches("${") || i.peek() === "\\" && i.peek(1) === "$" && i.peek(2) === "{");) i.advance();
				r.push(i.input.substring(e, i.pos));
			}
		}
		return r.filter((e) => e !== null && e !== "");
	}
	extractInterpolationContent(e) {
		let t = e.pos, n = 1;
		for (; !e.isAtEnd() && n > 0;) {
			let t = e.advance();
			if (t === "{") n++;
			else if (t === "}") n--;
			else if (t === "'" || t === "\"") {
				let n = t;
				for (; !e.isAtEnd();) {
					let t = e.advance();
					if (t === "\\") e.advance();
					else if (t === n) break;
				}
			}
		}
		if (n > 0) throw new Tg("Unclosed interpolation: missing '}'");
		return e.input.substring(t, e.pos - 1);
	}
	parseExpression(e, t = 0) {
		if (e = e.trim(), !e) return "";
		let n = new bC(e), r = this.parseExpressionInternal(n, t);
		if (!n.isAtEnd()) throw new Tg(`Unexpected characters at end of expression: '${n.input.substring(n.pos)}'`);
		return r;
	}
	parseExpressionInternal(t, n) {
		if (n > e.MAX_DEPTH) throw new Tg("Max recursion depth reached in parse");
		if (t.skipWhitespace(), t.isAtEnd()) return "";
		if (t.matches("${")) {
			t.advance(2);
			let e = this.extractInterpolationContent(t);
			return this.parseExpression(e, n + 1);
		}
		if (t.matchesString("'") || t.matchesString("\"")) return this.parseStringLiteral(t);
		if (this.isDigit(t.peek()) || (t.peek() === "-" || t.peek() === "+") && this.isDigit(t.peek(1))) return this.parseNumberLiteral(t);
		if (t.matchesKeyword("true")) return !0;
		if (t.matchesKeyword("false")) return !1;
		if (t.matchesKeyword("null")) return "";
		let r = this.scanPathOrIdentifier(t);
		return t.skipWhitespace(), t.peek() === "(" ? this.parseFunctionCall(r, t, n) : r ? { path: r } : "";
	}
	scanPathOrIdentifier(e) {
		let t = e.pos;
		for (; !e.isAtEnd();) {
			let t = e.peek();
			if (this.isAlnum(t) || t === "/" || t === "." || t === "_" || t === "-") e.advance();
			else break;
		}
		return e.input.substring(t, e.pos);
	}
	parseFunctionCall(e, t, n) {
		t.match("("), t.skipWhitespace();
		let r = {};
		for (; !t.isAtEnd() && t.peek() !== ")";) {
			let i = this.scanIdentifier(t);
			if (t.skipWhitespace(), !t.match(":")) throw new Tg(`Expected ':' after argument name '${i}' in function '${e}'`);
			t.skipWhitespace(), r[i] = this.parseExpressionInternal(t, n + 1), t.skipWhitespace(), t.peek() === "," && (t.advance(), t.skipWhitespace());
		}
		if (!t.match(")")) throw new Tg(`Expected ')' after function arguments for '${e}'`);
		return {
			call: e,
			args: r,
			returnType: "any"
		};
	}
	scanIdentifier(e) {
		let t = e.pos;
		for (; !e.isAtEnd() && (this.isAlnum(e.peek()) || e.peek() === "_");) e.advance();
		return e.input.substring(t, e.pos);
	}
	parseStringLiteral(e) {
		let t = e.advance(), n = "";
		for (; !e.isAtEnd();) {
			let r = e.advance();
			if (r === "\\") {
				let t = e.advance();
				n += t === "n" ? "\n" : t === "t" ? "	" : t === "r" ? "\r" : t;
			} else if (r === t) break;
			else n += r;
		}
		return n;
	}
	parseNumberLiteral(e) {
		let t = e.pos;
		for ((e.peek() === "-" || e.peek() === "+") && e.advance(); !e.isAtEnd() && (this.isDigit(e.peek()) || e.peek() === ".");) e.advance();
		if (!e.isAtEnd() && (e.peek() === "e" || e.peek() === "E")) for (e.advance(), !e.isAtEnd() && (e.peek() === "+" || e.peek() === "-") && e.advance(); !e.isAtEnd() && this.isDigit(e.peek());) e.advance();
		let n = e.input.substring(t, e.pos);
		if (!/^[+-]?\d+\.?\d*(?:[eE][+-]?\d+)?$/.test(n)) throw new Tg(`Invalid number literal: '${n}'`);
		return Number(n);
	}
	isAlnum(e) {
		return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e >= "0" && e <= "9";
	}
	isDigit(e) {
		return e >= "0" && e <= "9";
	}
};
yC.MAX_DEPTH = 100;
var bC = class {
	constructor(e) {
		this.input = e, this.pos = 0;
	}
	isAtEnd() {
		return this.pos >= this.input.length;
	}
	peek(e = 0) {
		return this.pos + e >= this.input.length ? "\0" : this.input[this.pos + e];
	}
	advance(e = 1) {
		let t = this.input.substring(this.pos, this.pos + e);
		return this.pos += e, t;
	}
	match(e) {
		return this.peek() === e && (this.advance(), !0);
	}
	matches(e) {
		return !!this.input.startsWith(e, this.pos);
	}
	matchesString(e) {
		return this.peek() === e;
	}
	matchesKeyword(e) {
		if (this.input.startsWith(e, this.pos)) {
			let t = this.peek(e.length);
			if (!/[a-zA-Z0-9_]/.test(t)) return this.advance(e.length), !0;
		}
		return !1;
	}
	skipWhitespace() {
		for (; !this.isAtEnd() && /\s/.test(this.peek());) this.advance();
	}
}, xC = "en-US";
function SC(e) {
	if (!e) return xC;
	try {
		return Intl.NumberFormat.supportedLocalesOf(e).length > 0 ? e : xC;
	} catch {
		return xC;
	}
}
function CC(e) {
	if (e == null) return "";
	if (typeof e == "object") try {
		return JSON.stringify(e) ?? String(e);
	} catch {
		return String(e);
	}
	return String(e);
}
function wC(e) {
	let t = !0;
	return (e == null || typeof e == "string" && e === "" || Array.isArray(e) && e.length === 0) && (t = !1), {
		valid: t,
		...t ? {} : { message: "This field is required." }
	};
}
function TC(e, t) {
	try {
		let n = new RegExp(t).test(String(e ?? ""));
		return {
			valid: n,
			...n ? {} : { message: "Value does not match required pattern." }
		};
	} catch (e) {
		throw new Tg(`Invalid regex pattern: ${t}`, "regex", e);
	}
}
function EC(e, t, n) {
	let r = 0;
	(typeof e == "string" || Array.isArray(e)) && (r = e.length);
	let i = !0, a;
	return t !== void 0 && !isNaN(t) && r < t ? (i = !1, a = `Minimum length is ${t}.`) : n !== void 0 && !isNaN(n) && r > n && (i = !1, a = `Maximum length is ${n}.`), {
		valid: i,
		...a ? { message: a } : {}
	};
}
function DC(e, t, n) {
	let r = Number(e);
	if (isNaN(r)) return {
		valid: !1,
		message: "Value must be a valid number."
	};
	let i = !0, a;
	return t !== void 0 && !isNaN(t) && r < t ? (i = !1, a = `Minimum value is ${t}.`) : n !== void 0 && !isNaN(n) && r > n && (i = !1, a = `Maximum value is ${n}.`), {
		valid: i,
		...a ? { message: a } : {}
	};
}
var OC = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
function kC(e) {
	let t = typeof e == "string" && OC.test(e);
	return {
		valid: t,
		...t ? {} : { message: "Must be a valid email address." }
	};
}
var AC = /* @__PURE__ */ new Map();
function jC(e, t, n) {
	let r = `${e}:${t ?? "undef"}:${n ?? "true"}`, i = AC.get(r);
	return i || (i = new Intl.NumberFormat(e, {
		minimumFractionDigits: t,
		maximumFractionDigits: t,
		useGrouping: n
	}), AC.set(r, i)), i;
}
var MC = /* @__PURE__ */ new Map();
function NC(e, t, n, r) {
	let i = `${e}:${t}:${n ?? "undef"}:${r ?? "true"}`, a = MC.get(i);
	return a || (a = new Intl.NumberFormat(e, {
		style: "currency",
		currency: t,
		minimumFractionDigits: n,
		maximumFractionDigits: n,
		useGrouping: r
	}), MC.set(i, a)), a;
}
var PC = "USD", FC = /* @__PURE__ */ new Map();
function IC(e, t, n) {
	let r = `${e}:${t ?? "undef"}:${n ?? "true"}`, i = FC.get(r);
	return i || (i = new Intl.NumberFormat(e, {
		style: "currency",
		currency: PC,
		currencyDisplay: "code",
		minimumFractionDigits: t,
		maximumFractionDigits: t,
		useGrouping: n
	}), FC.set(r, i)), i;
}
var LC = /* @__PURE__ */ new Map();
function RC(e) {
	let t = LC.get(e);
	if (!t) {
		let n = (t, n) => {
			let r = new Intl.DateTimeFormat(e, {
				...t,
				timeZone: "UTC"
			});
			return n.map((e) => r.format(e));
		}, r = Array.from({ length: 12 }, (e, t) => new Date(Date.UTC(2021, t, 15))), i = Array.from({ length: 7 }, (e, t) => new Date(Date.UTC(2021, 2, 1 + t)));
		t = {
			monthsLong: n({ month: "long" }, r),
			monthsShort: n({ month: "short" }, r),
			weekdaysLong: n({ weekday: "long" }, i),
			weekdaysShort: n({ weekday: "short" }, i)
		}, LC.set(e, t);
	}
	return t;
}
var zC = /yyyy|yy|MMMM|MMM|MM|M|EEEE|E|dd|d|HH|H|hh|h|mm|ss|a/g, BC = /(?:Z|[+-]\d{2}:?\d{2})$/;
function VC(e) {
	let t = BC.test(e), n = new Date(t ? e : `${e}Z`);
	if (isNaN(n.getTime())) return null;
	let r = 0, i = /([+-])(\d{2}):?(\d{2})$/.exec(e);
	return i && (r = (i[1] === "-" ? -1 : 1) * (Number(i[2]) * 60 + Number(i[3]))), {
		shifted: new Date(n.getTime() + r * 6e4),
		instant: n
	};
}
var HC = /* @__PURE__ */ new Map();
function UC(e) {
	let t = HC.get(e);
	return t || (t = new Intl.PluralRules(e), HC.set(e, t)), t;
}
function WC(e) {
	return Array.isArray(e) ? e.every((e) => !!e) : !1;
}
function GC(e) {
	return Array.isArray(e) ? e.some((e) => !!e) : !1;
}
function KC(e) {
	return !e;
}
function qC(e, t) {
	let n = new yC().parse(e);
	if (n.length === 0) return "";
	let r = n.map((e) => typeof e != "object" || !e || Array.isArray(e) ? e : t.resolveSignal(e));
	return Zy(() => r.map((e) => CC(eb(e) ? tb(e) : e)).join(""));
}
function JC(e, t, n, r = xC) {
	return isNaN(e) ? "" : jC(r, t, n).format(e);
}
function YC(e, t, n = 2, r, i = xC) {
	if (isNaN(e)) return "";
	let a = String(t).toUpperCase();
	try {
		return NC(i, a, n, r).format(e);
	} catch {
		return IC(i, n, r).formatToParts(e).map((e) => e.type === "currency" ? a : e.value).join("");
	}
}
function XC(e, t = "yyyy-MM-dd", n = xC) {
	if (!e) return "";
	let r = VC(String(e));
	if (!r) return "";
	let { shifted: i, instant: a } = r, o = t || "yyyy-MM-dd";
	if (o === "ISO") return a.toISOString();
	let s = RC(n), c = (i.getUTCDay() + 6) % 7, l = i.getUTCHours(), u = l % 12 || 12;
	return o.replace(zC, (e) => {
		switch (e) {
			case "yyyy": return String(i.getUTCFullYear());
			case "yy": return String(i.getUTCFullYear()).slice(-2);
			case "MMMM": return s.monthsLong[i.getUTCMonth()];
			case "MMM": return s.monthsShort[i.getUTCMonth()];
			case "MM": return String(i.getUTCMonth() + 1).padStart(2, "0");
			case "M": return String(i.getUTCMonth() + 1);
			case "EEEE": return s.weekdaysLong[c];
			case "E": return s.weekdaysShort[c];
			case "dd": return String(i.getUTCDate()).padStart(2, "0");
			case "d": return String(i.getUTCDate());
			case "HH": return String(l).padStart(2, "0");
			case "H": return String(l);
			case "hh": return String(u).padStart(2, "0");
			case "h": return String(u);
			case "mm": return String(i.getUTCMinutes()).padStart(2, "0");
			case "ss": return String(i.getUTCSeconds()).padStart(2, "0");
			case "a": return l < 12 ? "AM" : "PM";
			default: return e;
		}
	});
}
function ZC(e, t, n = xC) {
	let r;
	return r = e === 0 && t.zero !== void 0 ? "zero" : e === 1 && t.one !== void 0 ? "one" : e === 2 && t.two !== void 0 ? "two" : UC(n).select(e), String(t[r] ?? t.other ?? "");
}
function QC(e) {
	let t = typeof e == "string" ? e : void 0;
	if (!t || typeof window > "u" || !window.open) return;
	let n = window.location !== void 0 && window.location.href ? window.location.href : void 0, r;
	try {
		r = n ? new URL(t, n) : new URL(t);
	} catch (e) {
		throw new Tg(`Invalid URL specified: ${t}`, "openUrl", e);
	}
	if (r.protocol !== "https:" && r.protocol !== "http:") throw new Tg(`Unsupported URL scheme: ${r.protocol}`, "openUrl");
	window.open(r.href, "_blank", "noopener,noreferrer");
}
function $C(e) {
	return fy(e, (e) => WC(e.values));
}
function ew(e) {
	return fy(e, (e) => GC(e.values));
}
function tw(e) {
	return fy(e, (e) => KC(e.value));
}
function nw(e) {
	return fy(e, (e, t) => qC(e.value, t));
}
function rw(e, t) {
	let n = SC(t);
	return fy(e, (e) => JC(e.value, e.decimals, e.grouping, n));
}
function iw(e, t) {
	let n = SC(t);
	return fy(e, (e) => YC(e.value, e.currency, e.decimals ?? 2, e.grouping, n));
}
function aw(e, t) {
	let n = SC(t);
	return fy(e, (e) => XC(e.value, e.format, n));
}
function ow(e, t) {
	let n = SC(t);
	return fy(e, (e) => ZC(e.value, e, n));
}
function sw(e) {
	return fy(e, (e) => QC(e.url));
}
//#endregion
//#region node_modules/.pnpm/@a2ui+web_core@0.12.0/node_modules/@a2ui/web_core/src/v0_9/basic_catalog/functions/basic_functions.js
var cw = $C(mC), lw = ew(hC), uw = tw(gC), dw = fy(rC, (e) => wC(e.value).valid), fw = fy(iC, (e) => TC(e.value, e.pattern).valid), pw = fy(aC, (e) => EC(e.value, e.min, e.max).valid), mw = fy(oC, (e) => DC(e.value, e.min, e.max).valid), hw = fy(sC, (e) => kC(e.value).valid), gw = nw(cC);
function _w(e) {
	return rw(lC, e);
}
_w();
function vw(e) {
	return iw(uC, e);
}
vw();
function yw(e) {
	return aw(dC, e);
}
yw();
function bw(e) {
	return ow(fC, e);
}
bw();
var xw = sw(pC);
function Sw(e) {
	let t = e?.locale;
	return [
		cw,
		lw,
		uw,
		dw,
		fw,
		pw,
		mw,
		hw,
		gw,
		_w(t),
		vw(t),
		yw(t),
		bw(t),
		xw
	];
}
var Cw = Sw(), ww = (0, M.createContext)(null), Tw = ({ componentId: e }) => /* @__PURE__ */ (0, N.jsxs)("div", {
	style: {
		color: "gray",
		padding: "4px"
	},
	children: [
		"[Loading ",
		e,
		"...]"
	]
}), Ew = /* @__PURE__ */ new WeakMap(), Dw = ({ surface: e, id: t, requestedPath: n, detail: r }) => {
	let i = `Unresolved child reference '${t}' at '${n}': ${r}`;
	return (0, M.useEffect)(() => {
		if (!e) return;
		let r = Ew.get(e);
		r || (r = /* @__PURE__ */ new Set(), Ew.set(e, r));
		let a = JSON.stringify([t, n]);
		r.has(a) || (r.add(a), e.dispatchError({
			code: "UNRESOLVED_CHILD_REFERENCE",
			message: i
		}));
	}, [
		e,
		t,
		n,
		i
	]), /* @__PURE__ */ (0, N.jsx)("div", {
		style: { color: "red" },
		children: i
	});
};
function Ow(e) {
	let t = (0, M.useCallback)((t) => Qy(() => {
		tb(e), t();
	}), [e]), n = (0, M.useCallback)(() => rb(e), [e]);
	return (0, M.useSyncExternalStore)(t, n);
}
function kw() {
	return {
		byToken: /* @__PURE__ */ new Map(),
		byId: /* @__PURE__ */ new Map()
	};
}
function Aw(e, t, n, r) {
	let i = e.get(t);
	i || (i = /* @__PURE__ */ new Map(), e.set(t, i)), (!r || !i.has(n.dataPath)) && i.set(n.dataPath, n);
}
function jw(e, t) {
	return Aw(e.byToken, t.instanceId, t, !1), Aw(e.byId, t.componentId, t, !0), t.instanceId;
}
function Mw(e, t, n) {
	if (Kx(t)) {
		let r = jw(n, t);
		return t.dataPath === e.dataPath ? r : {
			id: r,
			basePath: t.dataPath
		};
	}
	return t instanceof zx ? Mw(e, t.value, n) : Array.isArray(t) ? t.map((t) => Mw(e, t, n)) : Nw(t) ? Pw(e, t, n) : t;
}
function Nw(e) {
	if (!e || typeof e != "object") return !1;
	let t = Object.getPrototypeOf(e);
	return t === Object.prototype || t === null;
}
function Pw(e, t, n) {
	let r = {};
	for (let [i, a] of Object.entries(t)) a instanceof zx ? (r[i] = Mw(e, a.value, n), r[`set${i.charAt(0).toUpperCase()}${i.slice(1)}`] = Vx(a) ? a.set : () => {}) : r[i] = Mw(e, a, n);
	return r;
}
function Fw(e, t) {
	let n = (0, M.useContext)(ww), r = Ow(e.props), { viewProps: i, childIndex: a } = (0, M.useMemo)(() => {
		let t = kw();
		return {
			viewProps: Pw(e, r, t),
			childIndex: t
		};
	}, [e, r]), o = (0, M.useMemo)(() => n && n.componentsModel.get(e.componentId) ? new Cx(n, e.componentId, e.dataPath) : void 0, [n, e]), s = (0, M.useCallback)((r, i, a) => {
		let o = a ?? e.dataPath, s = r.get(i), c = s?.get(o);
		if (c) return t(c, a);
		let l = s ? [...s.keys()] : [];
		return l.length > 0 ? /* @__PURE__ */ (0, N.jsx)(Dw, {
			surface: n,
			id: i,
			requestedPath: o,
			detail: `instances exist at ${l.join(", ")}. Instances are created only at the data paths the payload implies; buildChild selects among them.`
		}, JSON.stringify([i, o])) : t(i, a);
	}, [
		t,
		e,
		n
	]), c = (0, M.useCallback)((e, t) => s(a.byToken, e, t), [s, a]), l = (0, M.useCallback)((e, t) => s(a.byId, e, t), [s, a]);
	if (!n) throw Error("A2UI component views render only inside A2uiSurface.");
	return {
		viewProps: i,
		context: o,
		viewBuildChild: c,
		rawBuildChild: l
	};
}
var Iw = ({ node: e, impl: t, buildChild: n }) => {
	let { context: r, rawBuildChild: i } = Fw(e, n), a = t.render;
	return r ? /* @__PURE__ */ (0, N.jsx)(a, {
		context: r,
		buildChild: i
	}) : /* @__PURE__ */ (0, N.jsx)(Tw, { componentId: e.componentId });
}, Lw = (0, M.memo)(({ surface: e, node: t }) => {
	let n = (0, M.useCallback)((n, r) => {
		if (Kx(n)) return /* @__PURE__ */ (0, N.jsx)(Lw, {
			surface: e,
			node: n
		}, n.instanceId);
		let i = r ?? t.dataPath, a = e.componentsModel.get(n) ? "the component exists, but the catalog schema does not mark the referencing property as a component id. Use componentId() or childList() from @a2ui/web_core." : "no component with this id exists on the surface.";
		return /* @__PURE__ */ (0, N.jsx)(Dw, {
			surface: e,
			id: n,
			requestedPath: i,
			detail: a
		}, JSON.stringify([n, i]));
	}, [e, t]);
	if (t.state === "unknown-type") return /* @__PURE__ */ (0, N.jsxs)("div", {
		style: { color: "red" },
		children: ["Unknown component type: ", t.type]
	});
	if (t.isPlaceholder) return /* @__PURE__ */ (0, N.jsx)(Tw, { componentId: t.componentId });
	let r = t.impl;
	if (!r) return null;
	let i = r.view;
	return i ? /* @__PURE__ */ (0, N.jsx)(i, {
		node: t,
		buildChild: n
	}) : /* @__PURE__ */ (0, N.jsx)(Iw, {
		node: t,
		impl: r,
		buildChild: n
	});
});
Lw.displayName = "NodeView";
var Rw = ({ surface: e }) => {
	let t = (0, M.useMemo)(() => ({ resolver: void 0 }), [e]), n = (0, M.useCallback)((n) => {
		let r = new lS(e, e.defaultCatalog);
		t.resolver = r;
		let i = Qy(() => {
			tb(r.rootNode), n();
		});
		return () => {
			i(), r.dispose(), t.resolver === r && (t.resolver = void 0);
		};
	}, [e, t]), r = (0, M.useCallback)(() => t.resolver ? rb(t.resolver.rootNode) : void 0, [t]), i = (0, M.useSyncExternalStore)(n, r);
	return i ? /* @__PURE__ */ (0, N.jsx)(ww.Provider, {
		value: e,
		children: /* @__PURE__ */ (0, N.jsx)(Lw, {
			surface: e,
			node: i
		})
	}) : /* @__PURE__ */ (0, N.jsx)(Tw, { componentId: "root" });
};
function zw(e, t) {
	let n = (0, M.memo)(t, (e, t) => e.props === t.props && e.buildChild === t.buildChild && e.context.componentModel.id === t.context.componentModel.id && e.context.dataContext.path === t.context.dataContext.path), r = ({ context: t, buildChild: r }) => {
		let i = (0, M.useRef)(null);
		i.current ? i.current.context !== t && (i.current.dispose(), i.current = new Lx(t, e.schema)) : i.current = new Lx(t, e.schema);
		let a = i.current, o = (0, M.useCallback)((e) => {
			let t = a.subscribe(e);
			return () => t.unsubscribe();
		}, [a]), s = (0, M.useCallback)(() => a.snapshot, [a]), c = (0, M.useSyncExternalStore)(o, s);
		return (0, M.useEffect)(() => () => a.dispose(), [a]), /* @__PURE__ */ (0, N.jsx)(n, {
			props: c || {},
			buildChild: r,
			context: t
		});
	}, i = ({ node: e, buildChild: t }) => {
		let { viewProps: r, context: i, viewBuildChild: a } = Fw(e, t);
		return i ? /* @__PURE__ */ (0, N.jsx)(n, {
			props: r,
			buildChild: a,
			context: i
		}) : /* @__PURE__ */ (0, N.jsx)(Tw, { componentId: e.componentId });
	};
	return i.displayName = `${e.name}.view`, {
		name: e.name,
		schema: e.schema,
		render: r,
		view: i
	};
}
var Bw = () => {
	(0, M.useEffect)(() => {
		typeof document < "u" && document.adoptedStyleSheets && QS();
	}, []);
}, Vw = (e) => {
	switch (e) {
		case "center": return "center";
		case "end": return "flex-end";
		case "spaceAround": return "space-around";
		case "spaceBetween": return "space-between";
		case "spaceEvenly": return "space-evenly";
		case "start": return "flex-start";
		case "stretch": return "stretch";
		default: return "flex-start";
	}
}, Hw = (e) => {
	switch (e) {
		case "start": return "flex-start";
		case "center": return "center";
		case "end": return "flex-end";
		case "stretch": return "stretch";
		default: return "stretch";
	}
}, Uw = () => ({ boxSizing: "border-box" }), Ww = () => ({ boxSizing: "border-box" }), Gw = (e) => typeof e == "number" ? {
	flex: `${e}`,
	minWidth: 0,
	minHeight: 0
} : {}, Kw = (0, M.createContext)(void 0), qw = () => (0, M.useContext)(Kw), Jw = !1;
function Yw(e, t) {
	let n = qw(), [r, i] = (0, M.useState)(null), a = JSON.stringify(t);
	return (0, M.useEffect)(() => {
		if (!n) {
			Jw ||= (console.warn("[useMarkdown]", "can't render markdown because no markdown renderer is configured.\n", "Use `@a2ui/markdown-it`, or your own markdown renderer."), !0), i(null);
			return;
		}
		let t = !0, r = a ? JSON.parse(a) : void 0;
		return n(e, r).then((e) => {
			t && i(e);
		}).catch((e) => {
			console.error("[useMarkdown] Render failed:", e);
		}), () => {
			t = !1;
		};
	}, [
		e,
		n,
		a
	]), r;
}
var Xw = {}, Zw = /* @__PURE__ */ new Set([
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"caption"
]);
function Qw({ text: e, className: t, style: n }) {
	let r = Yw(e), i = r === null ? `${t} no-markdown-renderer` : t;
	return /* @__PURE__ */ (0, N.jsx)("div", {
		className: i,
		style: n,
		...r === null ? { children: e } : { dangerouslySetInnerHTML: { __html: r } }
	});
}
function $w({ text: e, variant: t, className: n, style: r }) {
	let i = t === "caption", a = i ? "em" : t;
	return i ? /* @__PURE__ */ (0, N.jsx)("span", {
		className: n,
		style: r,
		children: /* @__PURE__ */ (0, N.jsx)(a, { children: e })
	}) : /* @__PURE__ */ (0, N.jsx)("div", {
		className: n,
		style: r,
		children: /* @__PURE__ */ (0, N.jsx)(a, { children: e })
	});
}
var eT = zw(jS, ({ props: e }) => {
	Bw();
	let t = typeof e.text == "string" ? e.text : String(e.text ?? ""), n = e.variant, r = {
		...Uw(),
		...Gw(e.weight)
	};
	if (n && Zw.has(n)) {
		let e = n === "caption", i = [Xw.a2uiText, e ? Xw.a2uiCaption : n].join(" ");
		return /* @__PURE__ */ (0, N.jsx)($w, {
			text: t,
			variant: n,
			className: i,
			style: r
		});
	}
	let i = [Xw.a2uiText, n || "body"].join(" ");
	return /* @__PURE__ */ (0, N.jsx)(Qw, {
		text: t,
		className: i,
		style: r
	});
}), tT = zw(MS, ({ props: e }) => {
	Bw();
	let t = (e) => e === "scaleDown" ? "scale-down" : e || "fill", n = {
		...Uw(),
		...Gw(e.weight),
		objectFit: t(e.fit),
		display: "block",
		borderRadius: "var(--a2ui-image-border-radius, 0)"
	};
	return e.variant === "icon" ? (n.width = "var(--a2ui-image-icon-size, 24px)", n.height = "var(--a2ui-image-icon-size, 24px)") : e.variant === "avatar" ? (n.width = "var(--a2ui-image-avatar-size, 40px)", n.height = "var(--a2ui-image-avatar-size, 40px)", n.borderRadius = "50%") : e.variant === "smallFeature" ? n.maxWidth = "var(--a2ui-image-small-feature-size, 100px)" : e.variant === "largeFeature" ? n.maxHeight = "var(--a2ui-image-large-feature-size, 400px)" : e.variant === "header" && (n.height = "var(--a2ui-image-header-size, 200px)", n.objectFit = "cover"), /* @__PURE__ */ (0, N.jsx)("img", {
		src: e.url,
		alt: e.description || "",
		style: n
	});
}), nT = {
	play: "play_arrow",
	rewind: "fast_rewind",
	favoriteOff: "favorite_border",
	starOff: "star_border"
};
function rT(e) {
	return nT[e] ?? e.replace(/[A-Z]/g, (e) => "_" + e.toLowerCase());
}
var iT = zw(NS, ({ props: e }) => {
	Bw();
	let t = typeof e.name == "object" && e.name !== null && "svgPath" in e.name, n = {
		...Uw(),
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "var(--a2ui-icon-size, var(--a2ui-font-size-xl, 24px))",
		color: "var(--a2ui-icon-color, inherit)",
		lineHeight: 1
	};
	if (t) {
		let t = e.name.svgPath;
		return /* @__PURE__ */ (0, N.jsx)("svg", {
			className: "a2ui-icon svg",
			viewBox: "0 0 24 24",
			style: {
				...n,
				fill: "currentColor",
				width: "var(--a2ui-icon-size, 24px)",
				height: "var(--a2ui-icon-size, 24px)"
			},
			children: /* @__PURE__ */ (0, N.jsx)("path", { d: t })
		});
	}
	let r = typeof e.name == "string" ? rT(e.name) : "", i = {
		...n,
		fontFamily: "var(--a2ui-icon-font-family, \"Material Symbols Outlined\", sans-serif)",
		fontVariationSettings: "var(--a2ui-icon-font-variation-settings, \"FILL\" 1)",
		fontWeight: "normal",
		fontStyle: "normal",
		letterSpacing: "normal",
		textTransform: "none"
	};
	return /* @__PURE__ */ (0, N.jsx)("span", {
		className: "material-symbols-outlined",
		style: i,
		children: r
	});
}), aT = zw(PS, ({ props: e }) => {
	Bw();
	let t = {
		...Uw(),
		width: "100%",
		height: "auto",
		borderRadius: "var(--a2ui-video-border-radius, 0)"
	};
	return /* @__PURE__ */ (0, N.jsx)("video", {
		src: e.url,
		controls: !0,
		style: t
	});
}), oT = zw(FS, ({ props: e }) => (Bw(), /* @__PURE__ */ (0, N.jsxs)("div", {
	style: {
		display: "flex",
		flexDirection: "column",
		gap: "var(--a2ui-spacing-xs, 0.25rem)",
		background: "var(--a2ui-audioplayer-background, transparent)",
		borderRadius: "var(--a2ui-audioplayer-border-radius, 0)",
		padding: "var(--a2ui-audioplayer-padding, 0)"
	},
	children: [e.description && /* @__PURE__ */ (0, N.jsx)("span", {
		style: {
			fontSize: "var(--a2ui-font-size-xs, 0.75rem)",
			color: "var(--a2ui-text-caption-color, light-dark(#666, #aaa))"
		},
		children: e.description
	}), /* @__PURE__ */ (0, N.jsx)("audio", {
		src: e.url,
		controls: !0
	})]
}))), sT = ({ childList: e, buildChild: t }) => Array.isArray(e) ? /* @__PURE__ */ (0, N.jsx)(N.Fragment, { children: e.map((e, n) => typeof e == "string" ? /* @__PURE__ */ (0, N.jsx)(M.Fragment, { children: t(e) }, `${e}-${n}`) : /* @__PURE__ */ (0, N.jsx)(M.Fragment, { children: t(e.id, e.basePath) }, `${e.id}-${e.basePath}`)) }) : null, cT = zw(IS, ({ props: e, buildChild: t, context: n }) => (Bw(), /* @__PURE__ */ (0, N.jsx)("div", {
	style: {
		...Gw(e.weight),
		display: "flex",
		flexDirection: "row",
		justifyContent: Vw(e.justify),
		alignItems: Hw(e.align),
		gap: "var(--a2ui-row-gap, var(--a2ui-spacing-m))"
	},
	children: /* @__PURE__ */ (0, N.jsx)(sT, {
		childList: e.children,
		buildChild: t,
		context: n
	})
}))), lT = zw(LS, ({ props: e, buildChild: t, context: n }) => (Bw(), /* @__PURE__ */ (0, N.jsx)("div", {
	style: {
		...Gw(e.weight),
		display: "flex",
		flexDirection: "column",
		justifyContent: Vw(e.justify),
		alignItems: Hw(e.align),
		gap: "var(--a2ui-column-gap, var(--a2ui-spacing-m))"
	},
	children: /* @__PURE__ */ (0, N.jsx)(sT, {
		childList: e.children,
		buildChild: t,
		context: n
	})
}))), uT = zw(RS, ({ props: e, buildChild: t, context: n }) => {
	Bw();
	let r = e.direction === "horizontal", i = {
		display: "flex",
		flexDirection: r ? "row" : "column",
		alignItems: Hw(e.align),
		overflowX: r ? "auto" : "hidden",
		overflowY: r ? "hidden" : "auto",
		gap: "var(--a2ui-list-gap, var(--a2ui-spacing-s))",
		padding: "var(--a2ui-list-padding, 0)"
	};
	return /* @__PURE__ */ (0, N.jsx)("div", {
		style: i,
		children: /* @__PURE__ */ (0, N.jsx)(sT, {
			childList: e.children,
			buildChild: t,
			context: n
		})
	});
}), dT = zw(zS, ({ props: e, buildChild: t }) => {
	Bw();
	let n = {
		...Ww(),
		...Gw(e.weight),
		display: "block",
		border: "var(--a2ui-card-border, var(--a2ui-border))",
		borderRadius: "var(--a2ui-card-border-radius, var(--a2ui-border-radius, 8px))",
		padding: "var(--a2ui-card-padding, var(--a2ui-spacing-m, 16px))",
		background: "var(--a2ui-card-background, var(--a2ui-color-surface, #fff))",
		color: "var(--a2ui-color-on-surface, #333)",
		boxShadow: "var(--a2ui-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1))",
		margin: "var(--a2ui-card-margin, var(--a2ui-spacing-m))"
	};
	return /* @__PURE__ */ (0, N.jsx)("div", {
		className: "a2ui-card",
		style: n,
		children: e.child ? t(e.child) : null
	});
}), fT = zw(BS, ({ props: e, buildChild: t }) => {
	Bw();
	let [n, r] = (0, M.useState)(0), i = e.tabs || [], a = i[n], o = { display: "block" }, s = {
		display: "flex",
		gap: "var(--a2ui-spacing-xs, 0.25rem)",
		borderBottom: "var(--a2ui-tabs-border, var(--a2ui-border-width, 1px) solid var(--a2ui-color-border, #ccc))",
		marginBottom: "var(--a2ui-spacing-m, 0.5rem)"
	}, c = {
		padding: "var(--a2ui-spacing-m, 0.5rem) var(--a2ui-spacing-l, 1rem)",
		background: "var(--a2ui-tabs-header-background, transparent)",
		color: "var(--a2ui-tabs-header-color, var(--a2ui-color-on-surface))",
		border: "none",
		borderRadius: "var(--a2ui-border-radius, 0.25rem) var(--a2ui-border-radius, 0.25rem) 0 0",
		cursor: "pointer",
		fontFamily: "inherit"
	}, l = {
		background: "var(--a2ui-tabs-header-background-active, var(--a2ui-color-secondary, #eee))",
		color: "var(--a2ui-tabs-header-color-active, var(--a2ui-color-on-secondary, #333))"
	};
	return /* @__PURE__ */ (0, N.jsxs)("div", {
		style: o,
		children: [/* @__PURE__ */ (0, N.jsx)("div", {
			style: s,
			children: i.map((e, t) => /* @__PURE__ */ (0, N.jsx)("button", {
				className: `a2ui-tabs-header a2ui-tab-button ${n === t ? "active" : ""}`,
				onClick: () => r(t),
				style: {
					...c,
					...n === t ? l : {}
				},
				children: e.title
			}, t))
		}), /* @__PURE__ */ (0, N.jsx)("div", {
			style: { padding: "var(--a2ui-tabs-content-padding, 0 var(--a2ui-spacing-m, 0.5rem))" },
			children: a ? t(a.child) : null
		})]
	});
}), pT = zw(HS, ({ props: e }) => {
	Bw();
	let t = e.axis === "vertical", n = {
		border: "none",
		backgroundColor: "var(--a2ui-color-border, #ccc)"
	};
	return t ? (n.width = "var(--a2ui-border-width, 1px)", n.height = "100%", n.margin = "0 var(--a2ui-divider-spacing, var(--a2ui-spacing-m, 0.5rem))") : (n.width = "100%", n.height = "var(--a2ui-border-width, 1px)", n.margin = "var(--a2ui-divider-spacing, var(--a2ui-spacing-m, 0.5rem)) 0"), /* @__PURE__ */ (0, N.jsx)("div", { style: n });
}), mT = zw(VS, ({ props: e, buildChild: t }) => {
	Bw();
	let [n, r] = (0, M.useState)(!1);
	return /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsx)("div", {
		className: "a2ui-modal-trigger",
		onClick: () => r(!0),
		style: { display: "inline-block" },
		children: e.trigger ? t(e.trigger) : null
	}), n && /* @__PURE__ */ (0, N.jsx)("div", {
		className: "a2ui-modal-overlay",
		style: {
			position: "fixed",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "var(--a2ui-modal-overlay-color, rgba(0, 0, 0, 0.5))",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			zIndex: 1e3
		},
		onClick: () => r(!1),
		children: /* @__PURE__ */ (0, N.jsxs)("div", {
			style: {
				backgroundColor: "var(--a2ui-color-surface, #fff)",
				padding: "var(--a2ui-modal-padding, var(--a2ui-spacing-l, 24px))",
				borderRadius: "var(--a2ui-modal-border-radius, var(--a2ui-border-radius, 8px))",
				maxWidth: "90%",
				maxHeight: "90%",
				overflow: "auto",
				display: "flex",
				flexDirection: "column",
				color: "var(--a2ui-color-on-surface, inherit)"
			},
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, N.jsx)("div", {
				style: {
					display: "flex",
					justifyContent: "flex-end"
				},
				children: /* @__PURE__ */ (0, N.jsx)("button", {
					className: "a2ui-modal-close",
					onClick: () => r(!1),
					style: {
						border: "none",
						background: "none",
						fontSize: "var(--a2ui-font-size-xl, 1.5rem)",
						cursor: "pointer",
						padding: "var(--a2ui-spacing-xs, 4px)",
						color: "var(--a2ui-color-on-surface, inherit)"
					},
					children: "×"
				})
			}), /* @__PURE__ */ (0, N.jsx)("div", {
				style: { flex: 1 },
				children: e.content ? t(e.content) : null
			})]
		})
	})] });
}), hT = {}, gT = zw(US, ({ props: e, buildChild: t }) => {
	Bw();
	let n = [hT.button];
	return e.variant === "primary" ? n.push(hT.primary) : e.variant === "borderless" && n.push(hT.borderless), /* @__PURE__ */ (0, N.jsx)("button", {
		className: n.join(" "),
		onClick: e.action,
		disabled: e.isValid === !1,
		children: e.child ? t(e.child) : null
	});
}), _T = {}, vT = zw(WS, ({ props: e }) => {
	Bw();
	let t = (t) => {
		e.setValue(t.target.value);
	}, n = e.variant === "longText", r = e.variant === "number" ? "number" : e.variant === "obscured" ? "password" : "text", i = M.useId(), a = e.validationErrors && e.validationErrors.length > 0, o = `${_T.input} ${a ? _T.invalid : ""}`;
	return /* @__PURE__ */ (0, N.jsxs)("div", {
		className: _T.host,
		children: [
			e.label && /* @__PURE__ */ (0, N.jsx)("label", {
				htmlFor: i,
				className: _T.label,
				children: e.label
			}),
			n ? /* @__PURE__ */ (0, N.jsx)("textarea", {
				id: i,
				className: o,
				value: e.value || "",
				onChange: t
			}) : /* @__PURE__ */ (0, N.jsx)("input", {
				id: i,
				type: r,
				className: o,
				value: e.value || "",
				onChange: t
			}),
			a && /* @__PURE__ */ (0, N.jsx)("span", {
				className: _T.error,
				children: e.validationErrors[0]
			})
		]
	});
}), yT = zw(GS, ({ props: e }) => {
	Bw();
	let t = (t) => {
		e.setValue(t.target.checked);
	}, n = M.useId(), r = e.validationErrors && e.validationErrors.length > 0, i = {
		display: "flex",
		flexDirection: "column",
		margin: "var(--a2ui-checkbox-margin, var(--a2ui-spacing-m))"
	}, a = {
		display: "flex",
		alignItems: "center",
		gap: "var(--a2ui-checkbox-gap, var(--a2ui-spacing-s, 0.5rem))"
	}, o = {
		cursor: "pointer",
		width: "var(--a2ui-checkbox-size, 1rem)",
		height: "var(--a2ui-checkbox-size, 1rem)",
		background: "var(--a2ui-checkbox-background, inherit)",
		border: "var(--a2ui-checkbox-border, var(--a2ui-border))",
		borderRadius: "var(--a2ui-checkbox-border-radius, 4px)",
		outline: "none"
	}, s = { outline: "1px solid var(--a2ui-checkbox-color-error, red)" }, c = {
		cursor: "pointer",
		color: "var(--a2ui-color-on-surface, inherit)",
		fontSize: "var(--a2ui-checkbox-label-font-size, var(--a2ui-label-font-size, var(--a2ui-font-size-s)))",
		fontWeight: "var(--a2ui-checkbox-label-font-weight, var(--a2ui-label-font-weight, bold))"
	}, l = { color: "var(--a2ui-checkbox-color-error, red)" }, u = {
		fontSize: "var(--a2ui-font-size-xs, 0.75rem)",
		color: "var(--a2ui-checkbox-color-error, red)",
		marginTop: "4px"
	};
	return /* @__PURE__ */ (0, N.jsxs)("div", {
		style: i,
		children: [/* @__PURE__ */ (0, N.jsxs)("div", {
			style: a,
			children: [/* @__PURE__ */ (0, N.jsx)("input", {
				id: n,
				type: "checkbox",
				checked: !!e.value,
				onChange: t,
				style: {
					...o,
					...r ? s : {}
				}
			}), e.label && /* @__PURE__ */ (0, N.jsx)("label", {
				htmlFor: n,
				style: {
					...c,
					...r ? l : {}
				},
				children: e.label
			})]
		}), r && /* @__PURE__ */ (0, N.jsx)("span", {
			style: u,
			children: e.validationErrors?.[0]
		})]
	});
}), bT = {}, xT = zw(KS, ({ props: e }) => {
	Bw();
	let [t, n] = (0, M.useState)(""), r = M.useId(), i = Array.isArray(e.value) ? e.value : [], a = e.variant === "mutuallyExclusive", o = (t) => {
		if (a) e.setValue([t]);
		else {
			let n = i.includes(t) ? i.filter((e) => e !== t) : [...i, t];
			e.setValue(n);
		}
	}, s = (e.options || []).filter((n) => !e.filterable || t === "" || String(n.label).toLowerCase().includes(t.toLowerCase())), c = `${bT.options} ${e.displayStyle === "chips" ? bT.chips : ""}`;
	return /* @__PURE__ */ (0, N.jsxs)("div", {
		className: bT.host,
		children: [
			e.label && /* @__PURE__ */ (0, N.jsx)("strong", {
				className: bT.label,
				children: e.label
			}),
			e.filterable && /* @__PURE__ */ (0, N.jsx)("input", {
				type: "text",
				placeholder: "Filter options...",
				value: t,
				onChange: (e) => n(e.target.value),
				className: bT.filterInput
			}),
			/* @__PURE__ */ (0, N.jsx)("div", {
				className: c,
				children: s.map((t, n) => {
					let s = i.includes(t.value);
					return e.displayStyle === "chips" ? /* @__PURE__ */ (0, N.jsx)("button", {
						onClick: () => o(t.value),
						className: `${bT.chip} chip ${s ? `${bT.selected} selected` : ""}`,
						"aria-pressed": s,
						children: t.label
					}, n) : /* @__PURE__ */ (0, N.jsxs)("label", {
						className: bT.optionLabel,
						children: [/* @__PURE__ */ (0, N.jsx)("input", {
							type: a ? "radio" : "checkbox",
							checked: s,
							onChange: () => o(t.value),
							name: a ? r : void 0
						}), /* @__PURE__ */ (0, N.jsx)("span", {
							className: bT.optionText,
							children: t.label
						})]
					}, n);
				})
			})
		]
	});
}), ST = zw(qS, ({ props: e }) => {
	Bw();
	let t = (t) => {
		e.setValue(Number(t.target.value));
	}, n = M.useId();
	return /* @__PURE__ */ (0, N.jsxs)("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			gap: "var(--a2ui-spacing-xs, 0.25rem)",
			margin: "var(--a2ui-slider-margin, var(--a2ui-spacing-m))"
		},
		children: [/* @__PURE__ */ (0, N.jsxs)("div", {
			style: {
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center"
			},
			children: [e.label && /* @__PURE__ */ (0, N.jsx)("label", {
				htmlFor: n,
				style: {
					fontSize: "var(--a2ui-slider-label-font-size, var(--a2ui-label-font-size, var(--a2ui-font-size-s)))",
					fontWeight: "var(--a2ui-slider-label-font-weight, var(--a2ui-label-font-weight, bold))"
				},
				children: e.label
			}), /* @__PURE__ */ (0, N.jsx)("span", {
				style: {
					fontSize: "var(--a2ui-font-size-xs, 0.75rem)",
					color: "var(--a2ui-text-caption-color, light-dark(#666, #aaa))"
				},
				children: e.value
			})]
		}), /* @__PURE__ */ (0, N.jsx)("input", {
			id: n,
			type: "range",
			min: e.min ?? 0,
			max: e.max,
			value: e.value ?? 0,
			onChange: t,
			style: {
				width: "100%",
				cursor: "pointer",
				accentColor: "var(--a2ui-slider-thumb-color, var(--a2ui-color-primary, #007bff))",
				background: "var(--a2ui-slider-track-color, var(--a2ui-color-secondary, #e9ecef))"
			}
		})]
	});
});
function CT(e, t) {
	if (!e) return "";
	let n = e.includes("T"), r = e.split("T"), i = (n ? r[0] : e)?.substring(0, 10) ?? "", a = (n ? r[1] : e)?.substring(0, 5) ?? "";
	switch (t) {
		case "date": return i;
		case "time": return a;
		case "datetime-local": return `${i}T${a}`;
	}
	return "";
}
new py("https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json", "0.9", [
	eT,
	tT,
	iT,
	aT,
	oT,
	cT,
	lT,
	uT,
	dT,
	fT,
	pT,
	mT,
	gT,
	vT,
	yT,
	xT,
	ST,
	zw(JS, ({ props: e }) => {
		Bw();
		let t = (t) => {
			e.setValue(t.target.value);
		}, n = M.useId();
		if (!(e.enableDate || e.enableTime)) return null;
		let r = "datetime-local";
		e.enableDate && !e.enableTime && (r = "date"), !e.enableDate && e.enableTime && (r = "time");
		let i = CT(e.value, r);
		return /* @__PURE__ */ (0, N.jsxs)("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				gap: "var(--a2ui-spacing-xs, 0.25rem)"
			},
			children: [e.label && /* @__PURE__ */ (0, N.jsx)("label", {
				htmlFor: n,
				style: {
					fontSize: "var(--a2ui-datetimeinput-label-font-size, var(--a2ui-label-font-size, var(--a2ui-font-size-s)))",
					fontWeight: "var(--a2ui-datetimeinput-label-font-weight, var(--a2ui-label-font-weight, bold))"
				},
				children: e.label
			}), /* @__PURE__ */ (0, N.jsx)("input", {
				id: n,
				className: "a2ui-date-time-input",
				type: r,
				style: {
					backgroundColor: "var(--a2ui-datetimeinput-background, var(--a2ui-color-input, #fff))",
					color: "var(--a2ui-datetimeinput-color, var(--a2ui-color-on-input, #333))",
					border: "var(--a2ui-datetimeinput-border, var(--a2ui-border))",
					borderRadius: "var(--a2ui-datetimeinput-border-radius, var(--a2ui-border-radius))",
					padding: "var(--a2ui-datetimeinput-padding, var(--a2ui-spacing-s))",
					boxSizing: "border-box"
				},
				value: i,
				onChange: t,
				min: typeof e.min == "string" ? e.min : void 0,
				max: typeof e.max == "string" ? e.max : void 0
			})]
		});
	})
], Cw, nC);
//#endregion
//#region ../ui/dist/a2ui.js
var { DataBinding: wT, DynamicBoolean: TT, DynamicString: ET, DynamicStringList: DT, Action: OT } = AS, kT = (e, t, n) => e.describe(`REF:#/$defs/${t}|${n}`), AT = (e) => _g([yg(J(), gg()).describe(e), wT]).describe(e), jT = (e) => _g([X(yg(J(), gg())).describe(e), wT]).describe(e), MT = (e) => {
	let [t, ...n] = e;
	if (t === void 0) throw Error("A2UI view component has no bound tools");
	return [t, ...n];
}, NT = (e) => ({
	tool: Q(MT(tp[e] ?? [])).describe("The contract tool whose structured output this view draws."),
	output: AT("The structured output of the tool, as the contract output schema defines it. Usually a data model path.")
}), PT = kT(OT, "Action", "Dispatched when the person asks for the next page. Bind the cursor in the action context.").optional(), FT = (e, t) => ({
	name: e,
	schema: Z({
		...t,
		accessibility: AS.AccessibilityAttributes.optional()
	})
}), IT = FT("ContentCard", {
	...NT("ContentCard"),
	loadMoreAction: PT
}), LT = FT("PinList", {
	...NT("PinList"),
	loadMoreAction: PT
}), RT = FT("MfsTree", {
	...NT("MfsTree"),
	loadMoreAction: PT
}), zT = FT("DagViewer", NT("DagViewer")), BT = FT("IpnsRecordCard", NT("IpnsRecordCard")), VT = FT("NodeStatusPanel", {
	...NT("NodeStatusPanel"),
	loadMoreAction: PT
}), HT = FT("ConfirmationDialog", {
	confirmation: AT("A ConfirmationRequired payload (ToolError.error.confirmation). When its requires_native_prompt is true the system prompt decides: no approve control is drawn."),
	resolution: kT(ET, "DynamicString", "approved or denied, once decided on this surface.").optional(),
	approveAction: kT(OT, "Action", "Dispatched on approve. Omit it when approval happens elsewhere: no approve control is drawn.").optional(),
	denyAction: kT(OT, "Action", "Dispatched on deny.").optional()
}), UT = FT("MessageStream", { messages: jT("AG-UI messages: id, role (user, assistant, system), content.") }), WT = FT("ToolCallCard", {
	call: AT("One tool call: id, name, arguments (JSON text), optional result (JSON text), status."),
	acknowledgedHosts: kT(DT, "DynamicStringList", "Hosts acknowledged for content egress.").optional()
}), GT = FT("ApprovalCard", {
	interrupt: AT("The AG-UI interrupt from RUN_FINISHED, with metadata.ipfs-mcp."),
	resolution: kT(ET, "DynamicString", "approved or denied, once the person answered in this chat.").optional(),
	expired: kT(TT, "DynamicBoolean", "True when the interrupt expiry has passed. Expiry is denial.").optional(),
	approveAction: kT(OT, "Action", "Dispatched on approve. Not drawn when the system prompt decides.").optional(),
	denyAction: kT(OT, "Action", "Dispatched on deny.").optional()
}), KT = FT("EgressBadge", {
	tool: kT(ET, "DynamicString", "The tool whose result this marks."),
	acknowledgedHosts: kT(DT, "DynamicStringList", "Hosts in egress_ack."),
	refused: kT(TT, "DynamicBoolean", "True when the content was refused.").optional()
}), qT = Tl.map((e) => e.name), JT = /* @__PURE__ */ new Set([
	"dark",
	"light",
	"auto"
]);
function YT(e) {
	let t = e?.mode;
	return typeof t == "string" && JT.has(t) ? t : void 0;
}
function XT({ what: e, issues: t }) {
	return /* @__PURE__ */ (0, N.jsxs)(lu, {
		tone: "err",
		label: "Invalid data",
		children: [
			e,
			" does not match the contract schema, so nothing is drawn. ",
			t.join("; ")
		]
	});
}
var ZT = (e) => e.issues.slice(0, 5).map((e) => `${e.path.map(String).join(".") || "(root)"}: ${e.message}`);
function QT({ theme: e, children: t }) {
	return /* @__PURE__ */ (0, N.jsx)(Sl, {
		theme: YT(e),
		children: t
	});
}
function $T(e, t, n) {
	let r = rp(e, t, n);
	return r.kind === "view" ? r.node : r.kind === "invalid" ? /* @__PURE__ */ (0, N.jsx)(XT, {
		what: `The ${e} output`,
		issues: r.issues
	}) : /* @__PURE__ */ (0, N.jsx)(XT, {
		what: `The ${e} output`,
		issues: ["no view is bound to this tool"]
	});
}
var eE = (e) => e ? { onLoadMore: () => e() } : {}, tE = zw(IT, ({ props: e, context: t }) => /* @__PURE__ */ (0, N.jsx)(QT, {
	theme: t.theme,
	children: $T(e.tool, e.output, eE(e.loadMoreAction))
})), nE = zw(LT, ({ props: e, context: t }) => /* @__PURE__ */ (0, N.jsx)(QT, {
	theme: t.theme,
	children: $T(e.tool, e.output, eE(e.loadMoreAction))
})), rE = zw(RT, ({ props: e, context: t }) => /* @__PURE__ */ (0, N.jsx)(QT, {
	theme: t.theme,
	children: $T(e.tool, e.output, eE(e.loadMoreAction))
})), iE = zw(zT, ({ props: e, context: t }) => /* @__PURE__ */ (0, N.jsx)(QT, {
	theme: t.theme,
	children: $T(e.tool, e.output, {})
})), aE = zw(BT, ({ props: e, context: t }) => /* @__PURE__ */ (0, N.jsx)(QT, {
	theme: t.theme,
	children: $T(e.tool, e.output, {})
})), oE = zw(VT, ({ props: e, context: t }) => /* @__PURE__ */ (0, N.jsx)(QT, {
	theme: t.theme,
	children: $T(e.tool, e.output, eE(e.loadMoreAction))
})), sE = {
	ContentCard: tE,
	PinList: nE,
	MfsTree: rE,
	DagViewer: iE,
	IpnsRecordCard: aE,
	ConfirmationDialog: zw(HT, ({ props: e, context: t }) => {
		let n = zd.safeParse({
			confirmation: e.confirmation,
			...e.resolution !== void 0 && { resolution: e.resolution }
		});
		return /* @__PURE__ */ (0, N.jsx)(QT, {
			theme: t.theme,
			children: n.success ? /* @__PURE__ */ (0, N.jsx)(Vd, {
				...n.data,
				onApprove: e.approveAction ? () => e.approveAction?.() : void 0,
				onDeny: e.denyAction ? () => e.denyAction?.() : void 0
			}) : /* @__PURE__ */ (0, N.jsx)(XT, {
				what: "The confirmation",
				issues: ZT(n.error)
			})
		});
	}),
	NodeStatusPanel: oE,
	MessageStream: zw(UT, ({ props: e, context: t }) => {
		let n = ip.safeParse({ messages: e.messages });
		return /* @__PURE__ */ (0, N.jsx)(QT, {
			theme: t.theme,
			children: n.success ? /* @__PURE__ */ (0, N.jsx)(sp, { messages: n.data.messages }) : /* @__PURE__ */ (0, N.jsx)(XT, {
				what: "The messages",
				issues: ZT(n.error)
			})
		});
	}),
	ToolCallCard: zw(WT, ({ props: e, context: t }) => {
		let n = Pp.safeParse(e.call);
		return /* @__PURE__ */ (0, N.jsx)(QT, {
			theme: t.theme,
			children: n.success ? /* @__PURE__ */ (0, N.jsx)(zp, {
				call: n.data,
				acknowledgedHosts: e.acknowledgedHosts ?? []
			}) : /* @__PURE__ */ (0, N.jsx)(XT, {
				what: "The tool call",
				issues: ZT(n.error)
			})
		});
	}),
	ApprovalCard: zw(GT, ({ props: e, context: t }) => {
		let n = Vp.safeParse({
			interrupt: e.interrupt,
			...e.resolution !== void 0 && { resolution: e.resolution },
			...e.expired !== void 0 && { expired: e.expired }
		});
		return /* @__PURE__ */ (0, N.jsx)(QT, {
			theme: t.theme,
			children: n.success ? /* @__PURE__ */ (0, N.jsx)(Wp, {
				...n.data,
				onApprove: e.approveAction ? () => e.approveAction?.() : void 0,
				onDeny: e.denyAction ? () => e.denyAction?.() : void 0
			}) : /* @__PURE__ */ (0, N.jsx)(XT, {
				what: "The interrupt",
				issues: ZT(n.error)
			})
		});
	}),
	EgressBadge: zw(KT, ({ props: e, context: t }) => {
		let n = Ap.safeParse({
			tool: e.tool,
			acknowledged_hosts: e.acknowledgedHosts,
			...e.refused !== void 0 && { refused: e.refused }
		});
		return /* @__PURE__ */ (0, N.jsx)(QT, {
			theme: t.theme,
			children: n.success ? /* @__PURE__ */ (0, N.jsx)(jp, { ...n.data }) : /* @__PURE__ */ (0, N.jsx)(XT, {
				what: "The egress badge",
				issues: ZT(n.error)
			})
		});
	})
}, cE = "v0.9", lE = Z({ mode: Q([
	"dark",
	"light",
	"auto"
]).optional().describe("dark (default), light, or follow the system setting.") }), uE = [
	"IPFS components for an agent that operates the person's own Kubo node. Each view component draws the",
	"structured output of one MCP tool: set `tool` to the tool name and bind `output` to the data model",
	"path that holds the tool's structuredContent. Output that does not match the tool's schema is not drawn.",
	"Write and destructive tools always pass a confirmation first: use ApprovalCard or ConfirmationDialog to",
	"show it, and wire approveAction only when this surface can really approve. Never imply an action ran",
	"before it did."
].join(" ");
function dE() {
	return qT.map((e) => {
		let t = sE[e];
		if (!t) throw Error(`mcp/ui: contract component ${e} has no A2UI implementation`);
		return t;
	});
}
function fE() {
	return new py(Cl, cE, dE(), [], lE, uE);
}
var pE = fE(), mE = "v0.9", hE = (e, t, n) => [
	{
		version: mE,
		createSurface: {
			surfaceId: e,
			catalogId: Cl,
			theme: { mode: t }
		}
	},
	{
		version: mE,
		updateComponents: {
			surfaceId: e,
			components: [{
				id: "root",
				component: "ToolCallCard",
				call: { path: "/call" }
			}]
		}
	},
	{
		version: mE,
		updateDataModel: {
			surfaceId: e,
			path: "/call",
			value: kp(n)
		}
	}
], gE = (e, t) => e.map((e) => {
	let n = e.createSurface;
	return typeof n != "object" || !n || Array.isArray(n) ? e : {
		...e,
		createSurface: {
			...n,
			theme: { mode: t }
		}
	};
}), _E = () => void 0, vE = (0, M.memo)(function({ call: e, theme: t, serverMessages: n }) {
	let r = `call-${e.id}`, i = n !== void 0 && n.length > 0, [a] = (0, M.useState)(() => {
		let a = new Sx([pE], _E);
		return a.processMessages(i ? gE(n, t) : hE(r, t, e)), a;
	}), o = (0, M.useRef)(i ? n.length : 0);
	(0, M.useEffect)(() => {
		if (!i) {
			a.processMessages([{
				version: mE,
				updateDataModel: {
					surfaceId: r,
					path: "/call",
					value: kp(e)
				}
			}]);
			return;
		}
		let s = n.slice(o.current);
		if (s.length === 0) return;
		let c = o.current === 0 ? [{
			version: mE,
			deleteSurface: { surfaceId: r }
		}, ...gE(s, t)] : gE(s, t);
		a.processMessages(c), o.current = n.length;
	}, [
		a,
		r,
		e,
		t,
		i,
		n
	]);
	let s = a.model.surfacesMap.get(r);
	return s ? /* @__PURE__ */ (0, N.jsx)(Rw, { surface: s }) : null;
});
//#endregion
//#region src/island/Transcript.tsx
function yE({ items: e, theme: t, surfaces: n, nowIso: r, running: i, observing: a, onAnswer: o, onWatchAgain: s }) {
	let c = (0, M.useRef)(null), l = (0, M.useRef)(!0);
	return (0, M.useLayoutEffect)(() => {
		let e = c.current;
		e && l.current && (e.scrollTop = e.scrollHeight);
	}), /* @__PURE__ */ (0, N.jsx)("div", {
		ref: c,
		role: "log",
		"aria-label": "Conversation",
		"aria-live": "polite",
		"aria-relevant": "additions text",
		"aria-busy": i,
		tabIndex: 0,
		onScroll: (e) => {
			let t = e.currentTarget;
			l.current = t.scrollHeight - t.scrollTop - t.clientHeight < 24;
		},
		className: "min-h-0 flex-1 overflow-y-auto px-s3 py-s2",
		children: /* @__PURE__ */ (0, N.jsx)("ol", {
			className: "flex flex-col gap-s4",
			children: e.map((e) => /* @__PURE__ */ (0, N.jsx)("li", {
				className: "min-w-0",
				children: e.kind === "message" ? /* @__PURE__ */ (0, N.jsx)(ap, { message: e.message }) : /* @__PURE__ */ (0, N.jsxs)("div", {
					className: "flex flex-col gap-s3",
					children: [/* @__PURE__ */ (0, N.jsx)(vE, {
						call: e.call,
						theme: t,
						serverMessages: n[`call-${e.call.id}`]
					}), e.interrupt ? /* @__PURE__ */ (0, N.jsx)(Bm, {
						item: e.interrupt,
						nowIso: r,
						onAnswer: o,
						busy: i,
						observing: a.includes(e.interrupt.interrupt.id),
						...s && { onWatchAgain: s }
					}) : null]
				})
			}, e.key))
		})
	});
}
//#endregion
//#region src/island/Conversation.tsx
function bE(e, t) {
	let [n, r] = (0, M.useState)(t), i = (0, M.useMemo)(() => {
		let t = e.map((e) => Date.parse(e)).filter((e) => Number.isFinite(e) && e > n);
		return t.length > 0 ? Math.min(...t) : void 0;
	}, [e, n]);
	return (0, M.useEffect)(() => {
		if (i === void 0) return;
		let e = setTimeout(() => r(t()), Math.max(0, i - t()) + 25);
		return () => clearTimeout(e);
	}, [i, t]), new Date(n).toISOString();
}
var xE = {
	ready: {
		title: "Ask about your node",
		body: "Reads run at once. A change waits for your approval in this panel. A removal waits for the system prompt, where you can also deny it."
	},
	"no-endpoint": {
		title: "Chat is not configured",
		body: "The host page sets the ipfs mcp address. Until it does, this panel sends nothing."
	},
	"no-token": {
		title: "Chat has no token",
		body: "The host page supplies the token for the ui principal. Until it does, this panel sends nothing."
	}
};
function SE({ client: e, readiness: t, theme: n, ids: r, now: i = Date.now }) {
	let [a] = (0, M.useState)(() => Pm({
		client: e,
		ids: r,
		now: i
	})), { chat: o, running: s, observing: c, error: l } = (0, M.useSyncExternalStore)(a.subscribe, a.getSnapshot), { open: u, setOpen: d } = gm(), f = (0, M.useRef)(null);
	(0, M.useEffect)(() => {
		u && (f.current?.querySelector("textarea:not([disabled])") ?? f.current?.querySelector("h3"))?.focus({ preventScroll: !0 });
	}, [u]), (0, M.useEffect)(() => () => a.stop(), [a]);
	let p = (0, M.useMemo)(() => Im(o), [o]), m = (0, M.useMemo)(() => o.interrupts.filter((e) => e.resolution === void 0 && e.interrupt.expiresAt).map((e) => e.interrupt.expiresAt), [o.interrupts]), h = Em(l, o.run), g = l?.kind === "backend_not_configured", _ = l?.retryNotBefore, v = bE((0, M.useMemo)(() => _ === void 0 ? m : [...m, new Date(_).toISOString()], [m, _]), i), y = Date.parse(v), ee = _ !== void 0 && y < _, te = o.interrupts.some((e) => e.resolution === void 0 && !Up(e.interrupt, v)), ne = t.state === "no-endpoint" ? "Not configured." : t.state === "no-token" ? "No token." : te ? "Answer the approval above first." : ee ? "The node asked for a short wait." : void 0, re = t.state === "no-endpoint" ? {
		word: "Not configured",
		tone: "neutral"
	} : t.state === "no-token" ? {
		word: "Needs token",
		tone: "warn"
	} : c.length > 0 ? {
		word: "Waiting for system prompt",
		tone: "warn"
	} : s ? {
		word: "Running",
		tone: "info"
	} : te ? {
		word: "Waiting for approval",
		tone: "warn"
	} : g ? {
		word: "No backend",
		tone: "warn"
	} : h ? {
		word: h.status,
		tone: h.tone
	} : {
		word: "Ready",
		tone: "neutral"
	}, b = xE[t.state], ie = (e, t) => void a.answer(e, t), ae = !s && l !== void 0 ? (e) => void a.observe(e) : void 0;
	return /* @__PURE__ */ (0, N.jsxs)(vm, {
		label: "Agent chat",
		ref: f,
		children: [
			/* @__PURE__ */ (0, N.jsxs)(ym, { children: [/* @__PURE__ */ (0, N.jsxs)("div", {
				className: "flex items-center justify-between gap-s2",
				children: [/* @__PURE__ */ (0, N.jsx)("h3", {
					tabIndex: -1,
					className: "font-ui-heading text-[17px] leading-[1.3] font-semibold",
					children: "Agent chat"
				}), /* @__PURE__ */ (0, N.jsxs)($l, {
					variant: "secondary",
					onClick: () => d(!1),
					children: [/* @__PURE__ */ (0, N.jsx)(ml, {
						size: 16,
						strokeWidth: 1.5,
						"aria-hidden": "true"
					}), "Close"]
				})]
			}), /* @__PURE__ */ (0, N.jsxs)("div", {
				className: "flex items-center justify-between gap-s2",
				children: [/* @__PURE__ */ (0, N.jsx)(F, {
					tone: re.tone,
					children: re.word
				}), /* @__PURE__ */ (0, N.jsx)($l, {
					variant: "secondary",
					onClick: () => a.reset(),
					disabled: p.length === 0 && !s,
					children: "New chat"
				})]
			})] }),
			/* @__PURE__ */ (0, N.jsxs)(bm, { children: [
				p.length === 0 && g ? null : p.length === 0 ? /* @__PURE__ */ (0, N.jsxs)("div", {
					className: "flex flex-col gap-s2 px-s3 py-s3",
					children: [/* @__PURE__ */ (0, N.jsx)("h4", {
						className: "font-ui-heading text-[17px] leading-[1.3] font-semibold",
						children: b.title
					}), /* @__PURE__ */ (0, N.jsx)("p", {
						className: "max-w-[66ch] text-muted-foreground",
						children: t.state === "no-endpoint" ? `${b.body} ${t.reason}` : b.body
					})]
				}) : /* @__PURE__ */ (0, N.jsx)(yE, {
					items: p,
					theme: n,
					surfaces: o.a2uiSurfaces,
					nowIso: v,
					running: s,
					observing: c,
					onAnswer: ie,
					onWatchAgain: ae
				}),
				g ? /* @__PURE__ */ (0, N.jsx)(Cm, {
					retryText: l?.retryText,
					onRetry: () => void a.retry(),
					onNavigate: () => d(!1)
				}) : null,
				h ? /* @__PURE__ */ (0, N.jsx)(Dm, {
					model: h,
					nowMs: y,
					onRetry: () => void a.retry()
				}) : null
			] }),
			/* @__PURE__ */ (0, N.jsx)(xm, { children: /* @__PURE__ */ (0, N.jsx)(Tm, {
				blockedReason: ne,
				running: s,
				onSend: (e) => void a.send(e),
				onStop: () => a.stop()
			}) })
		]
	});
}
//#endregion
//#region src/island/IslandApp.tsx
var CE = 0, wE = (e) => `${e}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${(CE++).toString(36)}`}`, TE = {
	thread: () => wE("thread"),
	run: () => wE("run"),
	message: () => wE("msg-u")
};
function EE({ endpoint: t, getToken: n, tokenSet: r, session: i = !1, onSessionExpired: a, open: o, theme: s, onOpenChange: c, fetchImpl: l, ids: u = TE, now: d }) {
	let f = (0, M.useMemo)(() => e(t), [t]), p = (0, M.useMemo)(() => {
		if (!f.ok) return null;
		let e = um({
			endpoint: f.url,
			getToken: n,
			session: i,
			...l && { fetch: l }
		});
		return !i || !a ? e : { async *run(t, n) {
			try {
				yield* e.run(t, n);
			} catch (e) {
				throw e instanceof tm && e.kind === "unauthorized" && a(), e;
			}
		} };
	}, [
		f,
		n,
		i,
		a,
		l
	]), m = f.ok ? !r && !i ? { state: "no-token" } : { state: "ready" } : {
		state: "no-endpoint",
		reason: t ? f.reason : ""
	};
	return /* @__PURE__ */ (0, N.jsx)(Sl, {
		theme: s,
		injectStyles: !1,
		className: "ac-root",
		children: /* @__PURE__ */ (0, N.jsx)(_m, {
			open: o,
			onOpenChange: c,
			children: /* @__PURE__ */ (0, N.jsx)(SE, {
				client: p,
				readiness: m,
				theme: s,
				ids: u,
				...d && { now: d }
			}, f.ok ? f.url.href : "unconfigured")
		})
	});
}
//#endregion
//#region src/island/mount.tsx
function DE(e, t) {
	if (typeof CSSStyleSheet < "u" && "adoptedStyleSheets" in e) try {
		let n = new CSSStyleSheet();
		n.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, n];
		return;
	} catch {}
	let n = document.createElement("style");
	n.textContent = t, e.append(n);
}
function OE(e, t) {
	DE(e, gl), DE(e, Yp), Kp();
	let n = document.createElement("div");
	n.dataset.acMount = "", e.append(n);
	let r = (0, hl.createRoot)(n);
	return r.render(/* @__PURE__ */ (0, N.jsx)(EE, { ...t })), {
		update: (e) => r.render(/* @__PURE__ */ (0, N.jsx)(EE, { ...e })),
		unmount: () => {
			r.unmount(), n.remove();
		}
	};
}
//#endregion
export { OE as mountIsland };

//# sourceMappingURL=mount-CNmDQGhI.js.map