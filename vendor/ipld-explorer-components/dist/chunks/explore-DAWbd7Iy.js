import { a as base58btc, c as base32, d as from$1, f as rfc4648, g as __toESM, i as base58_exports, l as base32_exports, m as __exportAll, n as create, o as base36, p as __commonJSMin, r as decode$8, s as base36_exports, t as CID, u as baseX } from "./cid-BdjsvP7U.js";
import { i as toString$3, r as fromString$1, t as coerce } from "./bytes-CKiE5OTq.js";
import { a as decodeErrPrefix, c as decodeCodePointsArray, d as Type, i as makeCborEncoders, l as fromString$2, n as encode$9, o as encodeErrPrefix, r as encodeCustom, s as asU8A, t as decode$9, u as Token } from "./cborg-ylRO_W9U.js";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/bases/base10.js
var base10_exports = /* @__PURE__ */ __exportAll({ base10: () => base10 });
var base10 = baseX({
	prefix: "9",
	name: "base10",
	alphabet: "0123456789"
});
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/bases/base16.js
var base16_exports = /* @__PURE__ */ __exportAll({
	base16: () => base16,
	base16upper: () => base16upper
});
var base16 = rfc4648({
	prefix: "f",
	name: "base16",
	alphabet: "0123456789abcdef",
	bitsPerChar: 4
});
var base16upper = rfc4648({
	prefix: "F",
	name: "base16upper",
	alphabet: "0123456789ABCDEF",
	bitsPerChar: 4
});
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/bases/base2.js
var base2_exports = /* @__PURE__ */ __exportAll({ base2: () => base2 });
var base2 = rfc4648({
	prefix: "0",
	name: "base2",
	alphabet: "01",
	bitsPerChar: 1
});
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/bases/base256emoji.js
var base256emoji_exports = /* @__PURE__ */ __exportAll({ base256emoji: () => base256emoji });
var alphabet = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂");
var alphabetBytesToChars = alphabet.reduce((p, c, i) => {
	p[i] = c;
	return p;
}, []);
var alphabetCharsToBytes = alphabet.reduce((p, c, i) => {
	const codePoint = c.codePointAt(0);
	if (codePoint == null) throw new Error(`Invalid character: ${c}`);
	p[codePoint] = i;
	return p;
}, []);
function encode$8(data) {
	return data.reduce((p, c) => {
		p += alphabetBytesToChars[c];
		return p;
	}, "");
}
function decode$7(str) {
	const byts = [];
	for (const char of str) {
		const codePoint = char.codePointAt(0);
		if (codePoint == null) throw new Error(`Invalid character: ${char}`);
		const byt = alphabetCharsToBytes[codePoint];
		if (byt == null) throw new Error(`Non-base256emoji character: ${char}`);
		byts.push(byt);
	}
	return new Uint8Array(byts);
}
var base256emoji = from$1({
	prefix: "🚀",
	name: "base256emoji",
	encode: encode$8,
	decode: decode$7
});
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/bases/base64.js
var base64_exports = /* @__PURE__ */ __exportAll({
	base64: () => base64,
	base64pad: () => base64pad,
	base64url: () => base64url,
	base64urlpad: () => base64urlpad
});
var base64 = rfc4648({
	prefix: "m",
	name: "base64",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
	bitsPerChar: 6
});
var base64pad = rfc4648({
	prefix: "M",
	name: "base64pad",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	bitsPerChar: 6
});
var base64url = rfc4648({
	prefix: "u",
	name: "base64url",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
	bitsPerChar: 6
});
var base64urlpad = rfc4648({
	prefix: "U",
	name: "base64urlpad",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
	bitsPerChar: 6
});
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/bases/base8.js
var base8_exports = /* @__PURE__ */ __exportAll({ base8: () => base8 });
var base8 = rfc4648({
	prefix: "7",
	name: "base8",
	alphabet: "01234567",
	bitsPerChar: 3
});
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/bases/identity.js
var identity_exports$1 = /* @__PURE__ */ __exportAll({ identity: () => identity$1 });
var identity$1 = from$1({
	prefix: "\0",
	name: "identity",
	encode: (buf) => toString$3(buf),
	decode: (str) => fromString$1(str)
});
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/codecs/json.js
var json_exports = /* @__PURE__ */ __exportAll({
	code: () => 512,
	decode: () => decode$6,
	encode: () => encode$7,
	name: () => name$6
});
var textEncoder$2 = new TextEncoder();
var textDecoder$1 = new TextDecoder();
var name$6 = "json";
function encode$7(node) {
	return textEncoder$2.encode(JSON.stringify(node));
}
function decode$6(data) {
	return JSON.parse(textDecoder$1.decode(data));
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/codecs/raw.js
var raw_exports = /* @__PURE__ */ __exportAll({
	code: () => 85,
	decode: () => decode$5,
	encode: () => encode$6,
	name: () => "raw"
});
function encode$6(node) {
	return coerce(node);
}
function decode$5(data) {
	return coerce(data);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/hashes/identity.js
var identity_exports = /* @__PURE__ */ __exportAll({ identity: () => identity });
var code$3 = 0;
var name$4 = "identity";
var encode$5 = coerce;
function digest(input) {
	return create(code$3, encode$5(input));
}
var identity = {
	code: code$3,
	name: name$4,
	encode: encode$5,
	digest
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/hashes/hasher.js
function from({ name, code, encode }) {
	return new Hasher(name, code, encode);
}
/**
* Hasher represents a hashing algorithm implementation that produces as
* `MultihashDigest`.
*/
var Hasher = class {
	name;
	code;
	encode;
	constructor(name, code, encode) {
		this.name = name;
		this.code = code;
		this.encode = encode;
	}
	digest(input) {
		if (input instanceof Uint8Array) {
			const result = this.encode(input);
			return result instanceof Uint8Array ? create(this.code, result) : result.then((digest) => create(this.code, digest));
		} else throw Error("Unknown type, must be binary type");
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/hashes/sha2-browser.js
var sha2_browser_exports = /* @__PURE__ */ __exportAll({
	sha256: () => sha256$1,
	sha512: () => sha512$1
});
function sha(name) {
	return async (data) => new Uint8Array(await crypto.subtle.digest(name, data));
}
var sha256$1 = from({
	name: "sha2-256",
	code: 18,
	encode: sha("SHA-256")
});
var sha512$1 = from({
	name: "sha2-512",
	code: 19,
	encode: sha("SHA-512")
});
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/basics.js
var bases = {
	...identity_exports$1,
	...base2_exports,
	...base8_exports,
	...base10_exports,
	...base16_exports,
	...base32_exports,
	...base36_exports,
	...base58_exports,
	...base64_exports,
	...base256emoji_exports
};
({
	...sha2_browser_exports,
	...identity_exports
});
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@ipld/dag-cbor/src/index.js
var src_exports$2 = /* @__PURE__ */ __exportAll({
	code: () => 113,
	decode: () => decode$4,
	decodeOptions: () => decodeOptions$1,
	encode: () => encode$4,
	encodeOptions: () => encodeOptions$1,
	name: () => name$3,
	toByteView: () => toByteView$2
});
var CID_CBOR_TAG = 42;
/**
* @template T
* @typedef {import('multiformats/codecs/interface').ByteView<T>} ByteView
*/
/**
* @template T
* @typedef {import('multiformats/codecs/interface').ArrayBufferView<T>} ArrayBufferView
*/
/**
* @template T
* @param {ByteView<T> | ArrayBufferView<T>} buf
* @returns {ByteView<T>}
*/
function toByteView$2(buf) {
	if (buf instanceof ArrayBuffer) return new Uint8Array(buf, 0, buf.byteLength);
	return buf;
}
/**
* cidEncoder will receive all Objects during encode, it needs to filter out
* anything that's not a CID and return `null` for that so it's encoded as
* normal.
*
* @param {any} obj
* @returns {cborg.Token[]|null}
*/
function cidEncoder$1(obj) {
	if (obj.asCID !== obj && obj["/"] !== obj.bytes) return null;
	const cid = CID.asCID(obj);
	/* c8 ignore next 4 */
	if (!cid) return null;
	const bytes = new Uint8Array(cid.bytes.byteLength + 1);
	bytes.set(cid.bytes, 1);
	return [new Token(Type.tag, CID_CBOR_TAG), new Token(Type.bytes, bytes)];
}
/**
* Intercept all `undefined` values from an object walk and reject the entire
* object if we find one.
*
* @returns {null}
*/
function undefinedEncoder$1() {
	throw new Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded");
}
/**
* Intercept all `number` values from an object walk and reject the entire
* object if we find something that doesn't fit the IPLD data model (NaN &
* Infinity).
*
* @param {number} num
* @returns {null}
*/
function numberEncoder$1(num) {
	if (Number.isNaN(num)) throw new Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");
	if (num === Infinity || num === -Infinity) throw new Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");
	return null;
}
var _encodeOptions = {
	float64: true,
	typeEncoders: {
		Object: cidEncoder$1,
		undefined: undefinedEncoder$1,
		number: numberEncoder$1
	}
};
var encodeOptions$1 = {
	..._encodeOptions,
	typeEncoders: { ..._encodeOptions.typeEncoders }
};
/**
* @param {Uint8Array} bytes
* @returns {CID}
*/
function cidDecoder(bytes) {
	if (bytes[0] !== 0) throw new Error("Invalid CID for CBOR tag 42; expected leading 0x00");
	return CID.decode(bytes.subarray(1));
}
var _decodeOptions = {
	allowIndefinite: false,
	coerceUndefinedToNull: true,
	allowNaN: false,
	allowInfinity: false,
	allowBigInt: true,
	strict: true,
	useMaps: false,
	rejectDuplicateMapKeys: true,
	/** @type {import('cborg').TagDecoder[]} */
	tags: []
};
_decodeOptions.tags[CID_CBOR_TAG] = cidDecoder;
var decodeOptions$1 = {
	..._decodeOptions,
	tags: _decodeOptions.tags.slice()
};
var name$3 = "dag-cbor";
/**
* @template T
* @param {T} node
* @returns {ByteView<T>}
*/
var encode$4 = (node) => encode$9(node, _encodeOptions);
/**
* @template T
* @param {ByteView<T> | ArrayBufferView<T>} data
* @returns {T}
*/
var decode$4 = (data) => decode$9(toByteView$2(data), _decodeOptions);
//#endregion
//#region vendor/ipld-explorer-components/node_modules/cborg/lib/json/encode.js
/**
* @typedef {import('../../interface').EncodeOptions} EncodeOptions
* @typedef {import('../token').Token} Token
* @typedef {import('../bl').Bl} Bl
*/
var JSONEncoder = class extends Array {
	constructor() {
		super();
		/** @type {{type:Type,elements:number}[]} */
		this.inRecursive = [];
	}
	/**
	* @param {Bl} buf
	*/
	prefix(buf) {
		const recurs = this.inRecursive[this.inRecursive.length - 1];
		if (recurs) {
			if (recurs.type === Type.array) {
				recurs.elements++;
				if (recurs.elements !== 1) buf.push([44]);
			}
			if (recurs.type === Type.map) {
				recurs.elements++;
				if (recurs.elements !== 1) {
					if (recurs.elements % 2 === 1) buf.push([44]);
					else buf.push([58]);
				}
			}
		}
	}
	/**
	* @param {Bl} buf
	* @param {Token} token
	*/
	[Type.uint.major](buf, token) {
		this.prefix(buf);
		const is = String(token.value);
		const isa = [];
		for (let i = 0; i < is.length; i++) isa[i] = is.charCodeAt(i);
		buf.push(isa);
	}
	/**
	* @param {Bl} buf
	* @param {Token} token
	*/
	[Type.negint.major](buf, token) {
		this[Type.uint.major](buf, token);
	}
	/**
	* @param {Bl} _buf
	* @param {Token} _token
	*/
	[Type.bytes.major](_buf, _token) {
		throw new Error(`${encodeErrPrefix} unsupported type: Uint8Array`);
	}
	/**
	* @param {Bl} buf
	* @param {Token} token
	*/
	[Type.string.major](buf, token) {
		this.prefix(buf);
		const byts = fromString$2(JSON.stringify(token.value));
		buf.push(byts.length > 32 ? asU8A(byts) : byts);
	}
	/**
	* @param {Bl} buf
	* @param {Token} _token
	*/
	[Type.array.major](buf, _token) {
		this.prefix(buf);
		this.inRecursive.push({
			type: Type.array,
			elements: 0
		});
		buf.push([91]);
	}
	/**
	* @param {Bl} buf
	* @param {Token} _token
	*/
	[Type.map.major](buf, _token) {
		this.prefix(buf);
		this.inRecursive.push({
			type: Type.map,
			elements: 0
		});
		buf.push([123]);
	}
	/**
	* @param {Bl} _buf
	* @param {Token} _token
	*/
	[Type.tag.major](_buf, _token) {}
	/**
	* @param {Bl} buf
	* @param {Token} token
	*/
	[Type.float.major](buf, token) {
		if (token.type.name === "break") {
			const recurs = this.inRecursive.pop();
			if (recurs) {
				if (recurs.type === Type.array) buf.push([93]);
				else if (recurs.type === Type.map) buf.push([125]);
				else throw new Error("Unexpected recursive type; this should not happen!");
				return;
			}
			/* c8 ignore next 2 */
			throw new Error("Unexpected break; this should not happen!");
		}
		if (token.value === void 0) throw new Error(`${encodeErrPrefix} unsupported type: undefined`);
		this.prefix(buf);
		if (token.type.name === "true") {
			buf.push([
				116,
				114,
				117,
				101
			]);
			return;
		} else if (token.type.name === "false") {
			buf.push([
				102,
				97,
				108,
				115,
				101
			]);
			return;
		} else if (token.type.name === "null") {
			buf.push([
				110,
				117,
				108,
				108
			]);
			return;
		}
		const is = String(token.value);
		const isa = [];
		let dp = false;
		for (let i = 0; i < is.length; i++) {
			isa[i] = is.charCodeAt(i);
			if (!dp && (isa[i] === 46 || isa[i] === 101 || isa[i] === 69)) dp = true;
		}
		if (!dp) {
			isa.push(46);
			isa.push(48);
		}
		buf.push(isa);
	}
};
/**
* @param {(Token|Token[])[]} e1
* @param {(Token|Token[])[]} e2
* @returns {number}
*/
function mapSorter(e1, e2) {
	if (Array.isArray(e1[0]) || Array.isArray(e2[0])) throw new Error(`${encodeErrPrefix} complex map keys are not supported`);
	const keyToken1 = e1[0];
	const keyToken2 = e2[0];
	if (keyToken1.type !== Type.string || keyToken2.type !== Type.string) throw new Error(`${encodeErrPrefix} non-string map keys are not supported`);
	if (keyToken1 < keyToken2) return -1;
	if (keyToken1 > keyToken2) return 1;
	/* c8 ignore next 1 */
	throw new Error(`${encodeErrPrefix} unexpected duplicate map keys, this is not supported`);
}
var defaultEncodeOptions = {
	addBreakTokens: true,
	mapSorter
};
/**
* @param {any} data
* @param {EncodeOptions} [options]
* @returns {Uint8Array}
*/
function encode$3(data, options) {
	options = Object.assign({}, defaultEncodeOptions, options);
	return encodeCustom(data, new JSONEncoder(), options);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/cborg/lib/json/decode.js
/**
* @typedef {import('../../interface').DecodeOptions} DecodeOptions
* @typedef {import('../../interface').DecodeTokenizer} DecodeTokenizer
*/
/**
* @implements {DecodeTokenizer}
*/
var Tokenizer = class {
	/**
	* @param {Uint8Array} data
	* @param {DecodeOptions} options
	*/
	constructor(data, options = {}) {
		this._pos = 0;
		this.data = data;
		this.options = options;
		/** @type {string[]} */
		this.modeStack = ["value"];
		this.lastToken = "";
	}
	pos() {
		return this._pos;
	}
	/**
	* @returns {boolean}
	*/
	done() {
		return this._pos >= this.data.length;
	}
	/**
	* @returns {number}
	*/
	ch() {
		return this.data[this._pos];
	}
	/**
	* @returns {string}
	*/
	currentMode() {
		return this.modeStack[this.modeStack.length - 1];
	}
	skipWhitespace() {
		let c = this.ch();
		while (c === 32 || c === 9 || c === 13 || c === 10) c = this.data[++this._pos];
	}
	/**
	* @param {number[]} str
	*/
	expect(str) {
		if (this.data.length - this._pos < str.length) throw new Error(`${decodeErrPrefix} unexpected end of input at position ${this._pos}`);
		for (let i = 0; i < str.length; i++) if (this.data[this._pos++] !== str[i]) throw new Error(`${decodeErrPrefix} unexpected token at position ${this._pos}, expected to find '${String.fromCharCode(...str)}'`);
	}
	parseNumber() {
		const startPos = this._pos;
		let negative = false;
		let float = false;
		/**
		* @param {number[]} chars
		*/
		const swallow = (chars) => {
			while (!this.done()) {
				const ch = this.ch();
				if (chars.includes(ch)) this._pos++;
				else break;
			}
		};
		if (this.ch() === 45) {
			negative = true;
			this._pos++;
		}
		if (this.ch() === 48) {
			this._pos++;
			if (this.ch() === 46) {
				this._pos++;
				float = true;
			} else return new Token(Type.uint, 0, this._pos - startPos);
		}
		swallow([
			48,
			49,
			50,
			51,
			52,
			53,
			54,
			55,
			56,
			57
		]);
		if (negative && this._pos === startPos + 1) throw new Error(`${decodeErrPrefix} unexpected token at position ${this._pos}`);
		if (!this.done() && this.ch() === 46) {
			if (float) throw new Error(`${decodeErrPrefix} unexpected token at position ${this._pos}`);
			float = true;
			this._pos++;
			swallow([
				48,
				49,
				50,
				51,
				52,
				53,
				54,
				55,
				56,
				57
			]);
		}
		if (!this.done() && (this.ch() === 101 || this.ch() === 69)) {
			float = true;
			this._pos++;
			if (!this.done() && (this.ch() === 43 || this.ch() === 45)) this._pos++;
			swallow([
				48,
				49,
				50,
				51,
				52,
				53,
				54,
				55,
				56,
				57
			]);
		}
		const numStr = String.fromCharCode.apply(null, this.data.subarray(startPos, this._pos));
		const num = parseFloat(numStr);
		if (float) return new Token(Type.float, num, this._pos - startPos);
		if (this.options.allowBigInt !== true || Number.isSafeInteger(num)) return new Token(num >= 0 ? Type.uint : Type.negint, num, this._pos - startPos);
		return new Token(num >= 0 ? Type.uint : Type.negint, BigInt(numStr), this._pos - startPos);
	}
	/**
	* @returns {Token}
	*/
	parseString() {
		/* c8 ignore next 4 */
		if (this.ch() !== 34) throw new Error(`${decodeErrPrefix} unexpected character at position ${this._pos}; this shouldn't happen`);
		this._pos++;
		for (let i = this._pos, l = 0; i < this.data.length && l < 65536; i++, l++) {
			const ch = this.data[i];
			if (ch === 92 || ch < 32 || ch >= 128) break;
			if (ch === 34) {
				const str = String.fromCharCode.apply(null, this.data.subarray(this._pos, i));
				this._pos = i + 1;
				return new Token(Type.string, str, l);
			}
		}
		const startPos = this._pos;
		const chars = [];
		const readu4 = () => {
			if (this._pos + 4 >= this.data.length) throw new Error(`${decodeErrPrefix} unexpected end of unicode escape sequence at position ${this._pos}`);
			let u4 = 0;
			for (let i = 0; i < 4; i++) {
				let ch = this.ch();
				if (ch >= 48 && ch <= 57) ch -= 48;
				else if (ch >= 97 && ch <= 102) ch = ch - 97 + 10;
				else if (ch >= 65 && ch <= 70) ch = ch - 65 + 10;
				else throw new Error(`${decodeErrPrefix} unexpected unicode escape character at position ${this._pos}`);
				u4 = u4 * 16 + ch;
				this._pos++;
			}
			return u4;
		};
		const readUtf8Char = () => {
			const firstByte = this.ch();
			let codePoint = null;
			/* c8 ignore next 1 */
			let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
			if (this._pos + bytesPerSequence > this.data.length) throw new Error(`${decodeErrPrefix} unexpected unicode sequence at position ${this._pos}`);
			let secondByte, thirdByte, fourthByte, tempCodePoint;
			switch (bytesPerSequence) {
				/* c8 ignore next 6 */
				case 1:
					if (firstByte < 128) codePoint = firstByte;
					break;
				case 2:
					secondByte = this.data[this._pos + 1];
					if ((secondByte & 192) === 128) {
						tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
						if (tempCodePoint > 127) codePoint = tempCodePoint;
					}
					break;
				case 3:
					secondByte = this.data[this._pos + 1];
					thirdByte = this.data[this._pos + 2];
					if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
						tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
						/* c8 ignore next 3 */
						if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) codePoint = tempCodePoint;
					}
					break;
				case 4:
					secondByte = this.data[this._pos + 1];
					thirdByte = this.data[this._pos + 2];
					fourthByte = this.data[this._pos + 3];
					if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
						tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
						if (tempCodePoint > 65535 && tempCodePoint < 1114112) codePoint = tempCodePoint;
					}
			}
			/* c8 ignore next 5 */
			if (codePoint === null) {
				codePoint = 65533;
				bytesPerSequence = 1;
			} else if (codePoint > 65535) {
				codePoint -= 65536;
				chars.push(codePoint >>> 10 & 1023 | 55296);
				codePoint = 56320 | codePoint & 1023;
			}
			chars.push(codePoint);
			this._pos += bytesPerSequence;
		};
		while (!this.done()) {
			const ch = this.ch();
			let ch1;
			switch (ch) {
				case 92:
					this._pos++;
					if (this.done()) throw new Error(`${decodeErrPrefix} unexpected string termination at position ${this._pos}`);
					ch1 = this.ch();
					this._pos++;
					switch (ch1) {
						case 34:
						case 39:
						case 92:
						case 47:
							chars.push(ch1);
							break;
						case 98:
							chars.push(8);
							break;
						case 116:
							chars.push(9);
							break;
						case 110:
							chars.push(10);
							break;
						case 102:
							chars.push(12);
							break;
						case 114:
							chars.push(13);
							break;
						case 117:
							chars.push(readu4());
							break;
						default: throw new Error(`${decodeErrPrefix} unexpected string escape character at position ${this._pos}`);
					}
					break;
				case 34:
					this._pos++;
					return new Token(Type.string, decodeCodePointsArray(chars), this._pos - startPos);
				default: if (ch < 32) throw new Error(`${decodeErrPrefix} invalid control character at position ${this._pos}`);
				else if (ch < 128) {
					chars.push(ch);
					this._pos++;
				} else readUtf8Char();
			}
		}
		throw new Error(`${decodeErrPrefix} unexpected end of string at position ${this._pos}`);
	}
	/**
	* @returns {Token}
	*/
	parseValue() {
		switch (this.ch()) {
			case 123:
				this.modeStack.push("obj-start");
				this._pos++;
				return new Token(Type.map, Infinity, 1);
			case 91:
				this.modeStack.push("array-start");
				this._pos++;
				return new Token(Type.array, Infinity, 1);
			case 34: return this.parseString();
			case 110:
				this.expect([
					110,
					117,
					108,
					108
				]);
				return new Token(Type.null, null, 4);
			case 102:
				this.expect([
					102,
					97,
					108,
					115,
					101
				]);
				return new Token(Type.false, false, 5);
			case 116:
				this.expect([
					116,
					114,
					117,
					101
				]);
				return new Token(Type.true, true, 4);
			case 45:
			case 48:
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57: return this.parseNumber();
			default: throw new Error(`${decodeErrPrefix} unexpected character at position ${this._pos}`);
		}
	}
	/**
	* @returns {Token}
	*/
	next() {
		this.skipWhitespace();
		switch (this.currentMode()) {
			case "value":
				this.modeStack.pop();
				return this.parseValue();
			case "array-value":
				this.modeStack.pop();
				if (this.ch() === 93) {
					this._pos++;
					this.skipWhitespace();
					return new Token(Type.break, void 0, 1);
				}
				if (this.ch() !== 44) throw new Error(`${decodeErrPrefix} unexpected character at position ${this._pos}, was expecting array delimiter but found '${String.fromCharCode(this.ch())}'`);
				this._pos++;
				this.modeStack.push("array-value");
				this.skipWhitespace();
				return this.parseValue();
			case "array-start":
				this.modeStack.pop();
				if (this.ch() === 93) {
					this._pos++;
					this.skipWhitespace();
					return new Token(Type.break, void 0, 1);
				}
				this.modeStack.push("array-value");
				this.skipWhitespace();
				return this.parseValue();
			case "obj-key":
				if (this.ch() === 125) {
					this.modeStack.pop();
					this._pos++;
					this.skipWhitespace();
					return new Token(Type.break, void 0, 1);
				}
				if (this.ch() !== 44) throw new Error(`${decodeErrPrefix} unexpected character at position ${this._pos}, was expecting object delimiter but found '${String.fromCharCode(this.ch())}'`);
				this._pos++;
				this.skipWhitespace();
			case "obj-start": {
				this.modeStack.pop();
				if (this.ch() === 125) {
					this._pos++;
					this.skipWhitespace();
					return new Token(Type.break, void 0, 1);
				}
				const token = this.parseString();
				this.skipWhitespace();
				if (this.ch() !== 58) throw new Error(`${decodeErrPrefix} unexpected character at position ${this._pos}, was expecting key/value delimiter ':' but found '${String.fromCharCode(this.ch())}'`);
				this._pos++;
				this.modeStack.push("obj-value");
				return token;
			}
			case "obj-value":
				this.modeStack.pop();
				this.modeStack.push("obj-key");
				this.skipWhitespace();
				return this.parseValue();
			/* c8 ignore next 2 */
			default: throw new Error(`${decodeErrPrefix} unexpected parse state at position ${this._pos}; this shouldn't happen`);
		}
	}
};
/**
* @param {Uint8Array} data
* @param {DecodeOptions} [options]
* @returns {any}
*/
function decode$3(data, options) {
	options = Object.assign({ tokenizer: new Tokenizer(data, options) }, options);
	return decode$9(data, options);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@ipld/dag-json/src/index.js
var src_exports$1 = /* @__PURE__ */ __exportAll({
	code: () => 297,
	decode: () => decode$2,
	encode: () => encode$2,
	format: () => format,
	name: () => name$2,
	parse: () => parse$2,
	stringify: () => format
});
/**
* @template T
* @typedef {import('multiformats/codecs/interface').ByteView<T>} ByteView
*/
/**
* @template T
* @typedef {import('multiformats/codecs/interface').ArrayBufferView<T>} ArrayBufferView
*/
/**
* @template T
* @typedef {import('multiformats').ToString<T>} ToString
*/
/**
* @typedef {import('cborg/interface').DecodeTokenizer} DecodeTokenizer
*/
/**
* @template T
* @param {ByteView<T> | ArrayBufferView<T>} buf
* @returns {ByteView<T>}
*/
function toByteView$1(buf) {
	if (buf instanceof ArrayBuffer) return new Uint8Array(buf, 0, buf.byteLength);
	return buf;
}
/**
* cidEncoder will receive all Objects during encode, it needs to filter out
* anything that's not a CID and return `null` for that so it's encoded as
* normal. Encoding a CID means replacing it with a `{"/":"<CidString>}`
* object as per the DAG-JSON spec.
*
* @param {any} obj
* @returns {Token[]|null}
*/
function cidEncoder(obj) {
	if (obj.asCID !== obj && obj["/"] !== obj.bytes) return null;
	const cid = CID.asCID(obj);
	/* c8 ignore next 4 */
	if (!cid) return null;
	const cidString = cid.toString();
	return [
		new Token(Type.map, Infinity, 1),
		new Token(Type.string, "/", 1),
		new Token(Type.string, cidString, cidString.length),
		new Token(Type.break, void 0, 1)
	];
}
/**
* bytesEncoder will receive all Uint8Arrays (and friends) during encode, it
* needs to replace it with a `{"/":{"bytes":"Base64ByteString"}}` object as
* per the DAG-JSON spec.
*
* @param {Uint8Array} bytes
* @returns {Token[]|null}
*/
function bytesEncoder(bytes) {
	const bytesString = base64.encode(bytes).slice(1);
	return [
		new Token(Type.map, Infinity, 1),
		new Token(Type.string, "/", 1),
		new Token(Type.map, Infinity, 1),
		new Token(Type.string, "bytes", 5),
		new Token(Type.string, bytesString, bytesString.length),
		new Token(Type.break, void 0, 1),
		new Token(Type.break, void 0, 1)
	];
}
/**
* taBytesEncoder wraps bytesEncoder() but for the more exotic typed arrays so
* that we access the underlying ArrayBuffer data
*
* @param {Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array|Uint8ClampedArray|BigInt64Array|BigUint64Array} obj
* @returns {Token[]|null}
*/
function taBytesEncoder(obj) {
	return bytesEncoder(new Uint8Array(obj.buffer, obj.byteOffset, obj.byteLength));
}
/**
* abBytesEncoder wraps bytesEncoder() but for plain ArrayBuffers
*
* @param {ArrayBuffer} ab
* @returns {Token[]|null}
*/
function abBytesEncoder(ab) {
	return bytesEncoder(new Uint8Array(ab));
}
/**
* Intercept all `undefined` values from an object walk and reject the entire
* object if we find one.
*
* @returns {null}
*/
function undefinedEncoder() {
	throw new Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded");
}
/**
* Intercept all `number` values from an object walk and reject the entire
* object if we find something that doesn't fit the IPLD data model (NaN &
* Infinity).
*
* @param {number} num
* @returns {null}
*/
function numberEncoder(num) {
	if (Number.isNaN(num)) throw new Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");
	if (num === Infinity || num === -Infinity) throw new Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");
	return null;
}
var encodeOptions = { typeEncoders: {
	Object: cidEncoder,
	Buffer: bytesEncoder,
	Uint8Array: bytesEncoder,
	Int8Array: taBytesEncoder,
	Uint16Array: taBytesEncoder,
	Int16Array: taBytesEncoder,
	Uint32Array: taBytesEncoder,
	Int32Array: taBytesEncoder,
	Float32Array: taBytesEncoder,
	Float64Array: taBytesEncoder,
	Uint8ClampedArray: taBytesEncoder,
	BigInt64Array: taBytesEncoder,
	BigUint64Array: taBytesEncoder,
	DataView: taBytesEncoder,
	ArrayBuffer: abBytesEncoder,
	undefined: undefinedEncoder,
	number: numberEncoder
} };
/**
* @implements {DecodeTokenizer}
*/
var DagJsonTokenizer = class extends Tokenizer {
	/**
	* @param {Uint8Array} data
	* @param {object} [options]
	*/
	constructor(data, options) {
		super(data, options);
		/** @type {Token[]} */
		this.tokenBuffer = [];
	}
	/**
	* @returns {boolean}
	*/
	done() {
		return this.tokenBuffer.length === 0 && super.done();
	}
	/**
	* @returns {Token}
	*/
	_next() {
		if (this.tokenBuffer.length > 0) return this.tokenBuffer.pop();
		return super.next();
	}
	/**
	* Implements rules outlined in https://github.com/ipld/specs/pull/356
	*
	* @returns {Token}
	*/
	next() {
		const token = this._next();
		if (token.type === Type.map) {
			const keyToken = this._next();
			if (keyToken.type === Type.string && keyToken.value === "/") {
				const valueToken = this._next();
				if (valueToken.type === Type.string) {
					if (this._next().type !== Type.break) throw new Error("Invalid encoded CID form");
					this.tokenBuffer.push(valueToken);
					return new Token(Type.tag, 42, 0);
				}
				if (valueToken.type === Type.map) {
					const innerKeyToken = this._next();
					if (innerKeyToken.type === Type.string && innerKeyToken.value === "bytes") {
						const innerValueToken = this._next();
						if (innerValueToken.type === Type.string) {
							for (let i = 0; i < 2; i++) if (this._next().type !== Type.break) throw new Error("Invalid encoded Bytes form");
							const bytes = base64.decode(`m${innerValueToken.value}`);
							return new Token(Type.bytes, bytes, innerValueToken.value.length);
						}
						this.tokenBuffer.push(innerValueToken);
					}
					this.tokenBuffer.push(innerKeyToken);
				}
				this.tokenBuffer.push(valueToken);
			}
			this.tokenBuffer.push(keyToken);
		}
		return token;
	}
};
var decodeOptions = {
	allowIndefinite: false,
	allowUndefined: false,
	allowNaN: false,
	allowInfinity: false,
	allowBigInt: true,
	strict: true,
	useMaps: false,
	rejectDuplicateMapKeys: true,
	/** @type {import('cborg').TagDecoder[]} */
	tags: []
};
decodeOptions.tags[42] = CID.parse;
var name$2 = "dag-json";
/**
* @template T
* @param {T} node
* @returns {ByteView<T>}
*/
var encode$2 = (node) => encode$3(node, encodeOptions);
/**
* @template T
* @param {ByteView<T> | ArrayBufferView<T>} data
* @returns {T}
*/
var decode$2 = (data) => {
	const buf = toByteView$1(data);
	return decode$3(buf, Object.assign(decodeOptions, { tokenizer: new DagJsonTokenizer(buf, decodeOptions) }));
};
/**
* @template T
* @param {T} node
* @returns {ToString<T>}
*/
var format = (node) => utf8Decoder.decode(encode$2(node));
var utf8Decoder = new TextDecoder();
/**
* @template T
* @param {ToString<T>} data
* @returns {T}
*/
var parse$2 = (data) => decode$2(utf8Encoder.encode(data));
var utf8Encoder = new TextEncoder();
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@ipld/dag-pb/src/pb-decode.js
var textDecoder = new TextDecoder();
/**
* @typedef {import('./interface.js').RawPBLink} RawPBLink
*/
/**
* @typedef {import('./interface.js').RawPBNode} RawPBNode
*/
/**
* @param {Uint8Array} bytes
* @param {number} offset
* @returns {[number, number]}
*/
function decodeVarint$1(bytes, offset) {
	let v = 0;
	for (let shift = 0;; shift += 7) {
		/* c8 ignore next 3 */
		if (shift >= 64) throw new Error("protobuf: varint overflow");
		/* c8 ignore next 3 */
		if (offset >= bytes.length) throw new Error("protobuf: unexpected end of data");
		const b = bytes[offset++];
		v += shift < 28 ? (b & 127) << shift : (b & 127) * 2 ** shift;
		if (b < 128) break;
	}
	return [v, offset];
}
/**
* @param {Uint8Array} bytes
* @param {number} offset
* @returns {[Uint8Array, number]}
*/
function decodeBytes(bytes, offset) {
	let byteLen;
	[byteLen, offset] = decodeVarint$1(bytes, offset);
	const postOffset = offset + byteLen;
	/* c8 ignore next 3 */
	if (byteLen < 0 || postOffset < 0) throw new Error("protobuf: invalid length");
	/* c8 ignore next 3 */
	if (postOffset > bytes.length) throw new Error("protobuf: unexpected end of data");
	return [bytes.subarray(offset, postOffset), postOffset];
}
/**
* @param {Uint8Array} bytes
* @param {number} index
* @returns {[number, number, number]}
*/
function decodeKey(bytes, index) {
	let wire;
	[wire, index] = decodeVarint$1(bytes, index);
	return [
		wire & 7,
		wire >> 3,
		index
	];
}
/**
* @param {Uint8Array} bytes
* @returns {RawPBLink}
*/
function decodeLink(bytes) {
	/** @type {RawPBLink} */
	const link = {};
	const l = bytes.length;
	let index = 0;
	while (index < l) {
		let wireType, fieldNum;
		[wireType, fieldNum, index] = decodeKey(bytes, index);
		if (fieldNum === 1) {
			if (link.Hash) throw new Error("protobuf: (PBLink) duplicate Hash section");
			if (wireType !== 2) throw new Error(`protobuf: (PBLink) wrong wireType (${wireType}) for Hash`);
			if (link.Name !== void 0) throw new Error("protobuf: (PBLink) invalid order, found Name before Hash");
			if (link.Tsize !== void 0) throw new Error("protobuf: (PBLink) invalid order, found Tsize before Hash");
			[link.Hash, index] = decodeBytes(bytes, index);
		} else if (fieldNum === 2) {
			if (link.Name !== void 0) throw new Error("protobuf: (PBLink) duplicate Name section");
			if (wireType !== 2) throw new Error(`protobuf: (PBLink) wrong wireType (${wireType}) for Name`);
			if (link.Tsize !== void 0) throw new Error("protobuf: (PBLink) invalid order, found Tsize before Name");
			let byts;
			[byts, index] = decodeBytes(bytes, index);
			link.Name = textDecoder.decode(byts);
		} else if (fieldNum === 3) {
			if (link.Tsize !== void 0) throw new Error("protobuf: (PBLink) duplicate Tsize section");
			if (wireType !== 0) throw new Error(`protobuf: (PBLink) wrong wireType (${wireType}) for Tsize`);
			[link.Tsize, index] = decodeVarint$1(bytes, index);
		} else throw new Error(`protobuf: (PBLink) invalid fieldNumber, expected 1, 2 or 3, got ${fieldNum}`);
	}
	/* c8 ignore next 3 */
	if (index > l) throw new Error("protobuf: (PBLink) unexpected end of data");
	return link;
}
/**
* @param {Uint8Array} bytes
* @returns {RawPBNode}
*/
function decodeNode(bytes) {
	const l = bytes.length;
	let index = 0;
	/** @type {RawPBLink[]|void} */
	let links = void 0;
	let linksBeforeData = false;
	/** @type {Uint8Array|void} */
	let data = void 0;
	while (index < l) {
		let wireType, fieldNum;
		[wireType, fieldNum, index] = decodeKey(bytes, index);
		if (wireType !== 2) throw new Error(`protobuf: (PBNode) invalid wireType, expected 2, got ${wireType}`);
		if (fieldNum === 1) {
			if (data) throw new Error("protobuf: (PBNode) duplicate Data section");
			[data, index] = decodeBytes(bytes, index);
			if (links) linksBeforeData = true;
		} else if (fieldNum === 2) {
			if (linksBeforeData) throw new Error("protobuf: (PBNode) duplicate Links section");
			else if (!links) links = [];
			let byts;
			[byts, index] = decodeBytes(bytes, index);
			links.push(decodeLink(byts));
		} else throw new Error(`protobuf: (PBNode) invalid fieldNumber, expected 1 or 2, got ${fieldNum}`);
	}
	/* c8 ignore next 3 */
	if (index > l) throw new Error("protobuf: (PBNode) unexpected end of data");
	/** @type {RawPBNode} */
	const node = {};
	if (data) node.Data = data;
	node.Links = links || [];
	return node;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@ipld/dag-pb/src/pb-encode.js
var textEncoder$1 = new TextEncoder();
var maxInt32 = 2 ** 32;
var maxUInt32 = 2 ** 31;
/**
* @typedef {import('./interface.js').RawPBLink} RawPBLink
*/
/**
* @typedef {import('./interface.js').RawPBNode} RawPBNode
*/
/**
* encodeLink() is passed a slice of the parent byte array that ends where this
* link needs to end, so it packs to the right-most part of the passed `bytes`
*
* @param {RawPBLink} link
* @param {Uint8Array} bytes
* @returns {number}
*/
function encodeLink(link, bytes) {
	let i = bytes.length;
	if (typeof link.Tsize === "number") {
		if (link.Tsize < 0) throw new Error("Tsize cannot be negative");
		if (!Number.isSafeInteger(link.Tsize)) throw new Error("Tsize too large for encoding");
		i = encodeVarint(bytes, i, link.Tsize) - 1;
		bytes[i] = 24;
	}
	if (typeof link.Name === "string") {
		const nameBytes = textEncoder$1.encode(link.Name);
		i -= nameBytes.length;
		bytes.set(nameBytes, i);
		i = encodeVarint(bytes, i, nameBytes.length) - 1;
		bytes[i] = 18;
	}
	if (link.Hash) {
		i -= link.Hash.length;
		bytes.set(link.Hash, i);
		i = encodeVarint(bytes, i, link.Hash.length) - 1;
		bytes[i] = 10;
	}
	return bytes.length - i;
}
/**
* Encodes a PBNode into a new byte array of precisely the correct size
*
* @param {RawPBNode} node
* @returns {Uint8Array}
*/
function encodeNode(node) {
	const size = sizeNode(node);
	const bytes = new Uint8Array(size);
	let i = size;
	if (node.Data) {
		i -= node.Data.length;
		bytes.set(node.Data, i);
		i = encodeVarint(bytes, i, node.Data.length) - 1;
		bytes[i] = 10;
	}
	if (node.Links) for (let index = node.Links.length - 1; index >= 0; index--) {
		const size = encodeLink(node.Links[index], bytes.subarray(0, i));
		i -= size;
		i = encodeVarint(bytes, i, size) - 1;
		bytes[i] = 18;
	}
	return bytes;
}
/**
* work out exactly how many bytes this link takes up
*
* @param {RawPBLink} link
* @returns
*/
function sizeLink(link) {
	let n = 0;
	if (link.Hash) {
		const l = link.Hash.length;
		n += 1 + l + sov(l);
	}
	if (typeof link.Name === "string") {
		const l = textEncoder$1.encode(link.Name).length;
		n += 1 + l + sov(l);
	}
	if (typeof link.Tsize === "number") n += 1 + sov(link.Tsize);
	return n;
}
/**
* Work out exactly how many bytes this node takes up
*
* @param {RawPBNode} node
* @returns {number}
*/
function sizeNode(node) {
	let n = 0;
	if (node.Data) {
		const l = node.Data.length;
		n += 1 + l + sov(l);
	}
	if (node.Links) for (const link of node.Links) {
		const l = sizeLink(link);
		n += 1 + l + sov(l);
	}
	return n;
}
/**
* @param {Uint8Array} bytes
* @param {number} offset
* @param {number} v
* @returns {number}
*/
function encodeVarint(bytes, offset, v) {
	offset -= sov(v);
	const base = offset;
	while (v >= maxUInt32) {
		bytes[offset++] = v & 127 | 128;
		v /= 128;
	}
	while (v >= 128) {
		bytes[offset++] = v & 127 | 128;
		v >>>= 7;
	}
	bytes[offset] = v;
	return base;
}
/**
* size of varint
*
* @param {number} x
* @returns {number}
*/
function sov(x) {
	if (x % 2 === 0) x++;
	return Math.floor((len64(x) + 6) / 7);
}
/**
* golang math/bits, how many bits does it take to represent this integer?
*
* @param {number} x
* @returns {number}
*/
function len64(x) {
	let n = 0;
	if (x >= maxInt32) {
		x = Math.floor(x / maxInt32);
		n = 32;
	}
	if (x >= 65536) {
		x >>>= 16;
		n += 16;
	}
	if (x >= 256) {
		x >>>= 8;
		n += 8;
	}
	return n + len8tab[x];
}
var len8tab = [
	0,
	1,
	2,
	2,
	3,
	3,
	3,
	3,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8
];
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@ipld/dag-pb/src/util.js
/**
* @typedef {import('./interface.js').PBLink} PBLink
* @typedef {import('./interface.js').PBNode} PBNode
*/
/**
* @template T
* @typedef {import('multiformats/codecs/interface').ByteView<T>} ByteView
*/
/**
* @template T
* @typedef {import('multiformats/codecs/interface').ArrayBufferView<T>} ArrayBufferView
*/
var pbNodeProperties = ["Data", "Links"];
var pbLinkProperties = [
	"Hash",
	"Name",
	"Tsize"
];
var textEncoder = new TextEncoder();
/**
* @param {PBLink} a
* @param {PBLink} b
* @returns {number}
*/
function linkComparator(a, b) {
	if (a === b) return 0;
	const abuf = a.Name ? textEncoder.encode(a.Name) : [];
	const bbuf = b.Name ? textEncoder.encode(b.Name) : [];
	let x = abuf.length;
	let y = bbuf.length;
	for (let i = 0, len = Math.min(x, y); i < len; ++i) if (abuf[i] !== bbuf[i]) {
		x = abuf[i];
		y = bbuf[i];
		break;
	}
	return x < y ? -1 : y < x ? 1 : 0;
}
/**
* @param {any} node
* @param {string[]} properties
* @returns {boolean}
*/
function hasOnlyProperties(node, properties) {
	return !Object.keys(node).some((p) => !properties.includes(p));
}
/**
* Converts a CID, or a PBLink-like object to a PBLink
*
* @param {any} link
* @returns {PBLink}
*/
function asLink(link) {
	if (typeof link.asCID === "object") {
		const Hash = CID.asCID(link);
		if (!Hash) throw new TypeError("Invalid DAG-PB form");
		return { Hash };
	}
	if (typeof link !== "object" || Array.isArray(link)) throw new TypeError("Invalid DAG-PB form");
	const pbl = {};
	if (link.Hash) {
		let cid = CID.asCID(link.Hash);
		try {
			if (!cid) {
				if (typeof link.Hash === "string") cid = CID.parse(link.Hash);
				else if (link.Hash instanceof Uint8Array) cid = CID.decode(link.Hash);
			}
		} catch (e) {
			throw new TypeError(`Invalid DAG-PB form: ${e.message}`);
		}
		if (cid) pbl.Hash = cid;
	}
	if (!pbl.Hash) throw new TypeError("Invalid DAG-PB form");
	if (typeof link.Name === "string") pbl.Name = link.Name;
	if (typeof link.Tsize === "number") pbl.Tsize = link.Tsize;
	return pbl;
}
/**
* @param {any} node
* @returns {PBNode}
*/
function prepare(node) {
	if (node instanceof Uint8Array || typeof node === "string") node = { Data: node };
	if (typeof node !== "object" || Array.isArray(node)) throw new TypeError("Invalid DAG-PB form");
	/** @type {PBNode} */
	const pbn = {};
	if (node.Data !== void 0) {
		if (typeof node.Data === "string") pbn.Data = textEncoder.encode(node.Data);
		else if (node.Data instanceof Uint8Array) pbn.Data = node.Data;
		else throw new TypeError("Invalid DAG-PB form");
	}
	if (node.Links !== void 0) {
		if (Array.isArray(node.Links)) {
			pbn.Links = node.Links.map(asLink);
			pbn.Links.sort(linkComparator);
		} else throw new TypeError("Invalid DAG-PB form");
	} else pbn.Links = [];
	return pbn;
}
/**
* @param {PBNode} node
*/
function validate$1(node) {
	if (!node || typeof node !== "object" || Array.isArray(node) || node instanceof Uint8Array || node["/"] && node["/"] === node.bytes) throw new TypeError("Invalid DAG-PB form");
	if (!hasOnlyProperties(node, pbNodeProperties)) throw new TypeError("Invalid DAG-PB form (extraneous properties)");
	if (node.Data !== void 0 && !(node.Data instanceof Uint8Array)) throw new TypeError("Invalid DAG-PB form (Data must be bytes)");
	if (!Array.isArray(node.Links)) throw new TypeError("Invalid DAG-PB form (Links must be a list)");
	for (let i = 0; i < node.Links.length; i++) {
		const link = node.Links[i];
		if (!link || typeof link !== "object" || Array.isArray(link) || link instanceof Uint8Array || link["/"] && link["/"] === link.bytes) throw new TypeError("Invalid DAG-PB form (bad link)");
		if (!hasOnlyProperties(link, pbLinkProperties)) throw new TypeError("Invalid DAG-PB form (extraneous properties on link)");
		if (link.Hash === void 0) throw new TypeError("Invalid DAG-PB form (link must have a Hash)");
		if (link.Hash == null || !link.Hash["/"] || link.Hash["/"] !== link.Hash.bytes) throw new TypeError("Invalid DAG-PB form (link Hash must be a CID)");
		if (link.Name !== void 0 && typeof link.Name !== "string") throw new TypeError("Invalid DAG-PB form (link Name must be a string)");
		if (link.Tsize !== void 0) {
			if (typeof link.Tsize !== "number" || link.Tsize % 1 !== 0) throw new TypeError("Invalid DAG-PB form (link Tsize must be an integer)");
			if (link.Tsize < 0) throw new TypeError("Invalid DAG-PB form (link Tsize cannot be negative)");
		}
		if (i > 0 && linkComparator(link, node.Links[i - 1]) === -1) throw new TypeError("Invalid DAG-PB form (links must be sorted by Name bytes)");
	}
}
/**
* @param {Uint8Array} data
* @param {PBLink[]} [links=[]]
* @returns {PBNode}
*/
function createNode(data, links = []) {
	return prepare({
		Data: data,
		Links: links
	});
}
/**
* @param {string} name
* @param {number} size
* @param {CID} cid
* @returns {PBLink}
*/
function createLink(name, size, cid) {
	return asLink({
		Hash: cid,
		Name: name,
		Tsize: size
	});
}
/**
* @template T
* @param {ByteView<T> | ArrayBufferView<T>} buf
* @returns {ByteView<T>}
*/
function toByteView(buf) {
	if (buf instanceof ArrayBuffer) return new Uint8Array(buf, 0, buf.byteLength);
	return buf;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@ipld/dag-pb/src/index.js
var src_exports = /* @__PURE__ */ __exportAll({
	code: () => 112,
	createLink: () => createLink,
	createNode: () => createNode,
	decode: () => decode$1,
	encode: () => encode$1,
	name: () => name$1,
	prepare: () => prepare,
	validate: () => validate$1
});
/**
* @template T
* @typedef {import('multiformats/codecs/interface').ByteView<T>} ByteView
*/
/**
* @template T
* @typedef {import('multiformats/codecs/interface').ArrayBufferView<T>} ArrayBufferView
*/
/**
* @typedef {import('./interface.js').PBLink} PBLink
* @typedef {import('./interface.js').PBNode} PBNode
*/
var name$1 = "dag-pb";
/**
* @param {PBNode} node
* @returns {ByteView<PBNode>}
*/
function encode$1(node) {
	validate$1(node);
	const pbn = {};
	if (node.Links) pbn.Links = node.Links.map((l) => {
		const link = {};
		if (l.Hash) link.Hash = l.Hash.bytes;
		if (l.Name !== void 0) link.Name = l.Name;
		if (l.Tsize !== void 0) link.Tsize = l.Tsize;
		return link;
	});
	if (node.Data) pbn.Data = node.Data;
	return encodeNode(pbn);
}
/**
* @param {ByteView<PBNode> | ArrayBufferView<PBNode>} bytes
* @returns {PBNode}
*/
function decode$1(bytes) {
	const pbn = decodeNode(toByteView(bytes));
	const node = {};
	if (pbn.Data) node.Data = pbn.Data;
	if (pbn.Links) node.Links = pbn.Links.map((l) => {
		const link = {};
		try {
			link.Hash = CID.decode(l.Hash);
		} catch (e) {}
		if (!link.Hash) throw new Error("Invalid Hash field found in link, expected CID");
		if (l.Name !== void 0) link.Name = l.Name;
		if (l.Tsize !== void 0) link.Tsize = l.Tsize;
		return link;
	});
	return node;
}
//#endregion
//#region vendor/ipld-explorer-components/src/lib/cid.ts
/**
* Converts a value to a CID or returns null if it cannot be converted.
*/
function toCidOrNull(value, base) {
	if (value == null) return null;
	try {
		return CID.asCID(value) ?? CID.parse(value, base);
	} catch (err) {
		return null;
	}
}
/**
* This function is deprecated, use `getCodeOrNull` instead.
*
* `cid.codec` is deprecated, use integer "code" property instead
*
* @deprecated
*/
function getCodecOrNull(value) {
	const cid = toCidOrNull(value);
	if (cid == null) return null;
	switch (cid.code) {
		case 113: return name$3;
		case 297: return name$2;
		case 112: return name$1;
		default: return null;
	}
}
function getCodeOrNull(value) {
	const cid = toCidOrNull(value);
	if (cid == null) return null;
	return cid.code;
}
function toCidStrOrNull(value) {
	const cid = toCidOrNull(value);
	if (cid == null) return null;
	return cid.toString();
}
/**
* [js-sha3]{@link https://github.com/emn178/js-sha3}
*
* @version 0.9.3
* @author Chen, Yi-Cyuan [emn178@gmail.com]
* @copyright Chen, Yi-Cyuan 2015-2023
* @license MIT
*/
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@multiformats/sha3/src/index.js
var import_sha3 = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		"use strict";
		var INPUT_ERROR = "input is invalid type";
		var FINALIZE_ERROR = "finalize already called";
		var WINDOW = typeof window === "object";
		var root = WINDOW ? window : {};
		if (root.JS_SHA3_NO_WINDOW) WINDOW = false;
		var WEB_WORKER = !WINDOW && typeof self === "object";
		if (!root.JS_SHA3_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node) root = global;
		else if (WEB_WORKER) root = self;
		var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && typeof module === "object" && module.exports;
		var AMD = typeof define === "function" && define.amd;
		var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
		var HEX_CHARS = "0123456789abcdef".split("");
		var SHAKE_PADDING = [
			31,
			7936,
			2031616,
			520093696
		];
		var CSHAKE_PADDING = [
			4,
			1024,
			262144,
			67108864
		];
		var KECCAK_PADDING = [
			1,
			256,
			65536,
			16777216
		];
		var PADDING = [
			6,
			1536,
			393216,
			100663296
		];
		var SHIFT = [
			0,
			8,
			16,
			24
		];
		var RC = [
			1,
			0,
			32898,
			0,
			32906,
			2147483648,
			2147516416,
			2147483648,
			32907,
			0,
			2147483649,
			0,
			2147516545,
			2147483648,
			32777,
			2147483648,
			138,
			0,
			136,
			0,
			2147516425,
			0,
			2147483658,
			0,
			2147516555,
			0,
			139,
			2147483648,
			32905,
			2147483648,
			32771,
			2147483648,
			32770,
			2147483648,
			128,
			2147483648,
			32778,
			0,
			2147483658,
			2147483648,
			2147516545,
			2147483648,
			32896,
			2147483648,
			2147483649,
			0,
			2147516424,
			2147483648
		];
		var BITS = [
			224,
			256,
			384,
			512
		];
		var SHAKE_BITS = [128, 256];
		var OUTPUT_TYPES = [
			"hex",
			"buffer",
			"arrayBuffer",
			"array",
			"digest"
		];
		var CSHAKE_BYTEPAD = {
			"128": 168,
			"256": 136
		};
		var isArray = root.JS_SHA3_NO_NODE_JS || !Array.isArray ? function(obj) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		} : Array.isArray;
		var isView = ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView) ? function(obj) {
			return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
		} : ArrayBuffer.isView;
		var formatMessage = function(message) {
			var type = typeof message;
			if (type === "string") return [message, true];
			if (type !== "object" || message === null) throw new Error(INPUT_ERROR);
			if (ARRAY_BUFFER && message.constructor === ArrayBuffer) return [new Uint8Array(message), false];
			if (!isArray(message) && !isView(message)) throw new Error(INPUT_ERROR);
			return [message, false];
		};
		var empty = function(message) {
			return formatMessage(message)[0].length === 0;
		};
		var cloneArray = function(array) {
			var newArray = [];
			for (var i = 0; i < array.length; ++i) newArray[i] = array[i];
			return newArray;
		};
		var createOutputMethod = function(bits, padding, outputType) {
			return function(message) {
				return new Keccak(bits, padding, bits).update(message)[outputType]();
			};
		};
		var createShakeOutputMethod = function(bits, padding, outputType) {
			return function(message, outputBits) {
				return new Keccak(bits, padding, outputBits).update(message)[outputType]();
			};
		};
		var createCshakeOutputMethod = function(bits, padding, outputType) {
			return function(message, outputBits, n, s) {
				return methods["cshake" + bits].update(message, outputBits, n, s)[outputType]();
			};
		};
		var createKmacOutputMethod = function(bits, padding, outputType) {
			return function(key, message, outputBits, s) {
				return methods["kmac" + bits].update(key, message, outputBits, s)[outputType]();
			};
		};
		var createOutputMethods = function(method, createMethod, bits, padding) {
			for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
				var type = OUTPUT_TYPES[i];
				method[type] = createMethod(bits, padding, type);
			}
			return method;
		};
		var createMethod = function(bits, padding) {
			var method = createOutputMethod(bits, padding, "hex");
			method.create = function() {
				return new Keccak(bits, padding, bits);
			};
			method.update = function(message) {
				return method.create().update(message);
			};
			return createOutputMethods(method, createOutputMethod, bits, padding);
		};
		var createShakeMethod = function(bits, padding) {
			var method = createShakeOutputMethod(bits, padding, "hex");
			method.create = function(outputBits) {
				return new Keccak(bits, padding, outputBits);
			};
			method.update = function(message, outputBits) {
				return method.create(outputBits).update(message);
			};
			return createOutputMethods(method, createShakeOutputMethod, bits, padding);
		};
		var createCshakeMethod = function(bits, padding) {
			var w = CSHAKE_BYTEPAD[bits];
			var method = createCshakeOutputMethod(bits, padding, "hex");
			method.create = function(outputBits, n, s) {
				if (empty(n) && empty(s)) return methods["shake" + bits].create(outputBits);
				else return new Keccak(bits, padding, outputBits).bytepad([n, s], w);
			};
			method.update = function(message, outputBits, n, s) {
				return method.create(outputBits, n, s).update(message);
			};
			return createOutputMethods(method, createCshakeOutputMethod, bits, padding);
		};
		var createKmacMethod = function(bits, padding) {
			var w = CSHAKE_BYTEPAD[bits];
			var method = createKmacOutputMethod(bits, padding, "hex");
			method.create = function(key, outputBits, s) {
				return new Kmac(bits, padding, outputBits).bytepad(["KMAC", s], w).bytepad([key], w);
			};
			method.update = function(key, message, outputBits, s) {
				return method.create(key, outputBits, s).update(message);
			};
			return createOutputMethods(method, createKmacOutputMethod, bits, padding);
		};
		var algorithms = [
			{
				name: "keccak",
				padding: KECCAK_PADDING,
				bits: BITS,
				createMethod
			},
			{
				name: "sha3",
				padding: PADDING,
				bits: BITS,
				createMethod
			},
			{
				name: "shake",
				padding: SHAKE_PADDING,
				bits: SHAKE_BITS,
				createMethod: createShakeMethod
			},
			{
				name: "cshake",
				padding: CSHAKE_PADDING,
				bits: SHAKE_BITS,
				createMethod: createCshakeMethod
			},
			{
				name: "kmac",
				padding: CSHAKE_PADDING,
				bits: SHAKE_BITS,
				createMethod: createKmacMethod
			}
		];
		var methods = {}, methodNames = [];
		for (var i = 0; i < algorithms.length; ++i) {
			var algorithm = algorithms[i];
			var bits = algorithm.bits;
			for (var j = 0; j < bits.length; ++j) {
				var methodName = algorithm.name + "_" + bits[j];
				methodNames.push(methodName);
				methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
				if (algorithm.name !== "sha3") {
					var newMethodName = algorithm.name + bits[j];
					methodNames.push(newMethodName);
					methods[newMethodName] = methods[methodName];
				}
			}
		}
		function Keccak(bits, padding, outputBits) {
			this.blocks = [];
			this.s = [];
			this.padding = padding;
			this.outputBits = outputBits;
			this.reset = true;
			this.finalized = false;
			this.block = 0;
			this.start = 0;
			this.blockCount = 1600 - (bits << 1) >> 5;
			this.byteCount = this.blockCount << 2;
			this.outputBlocks = outputBits >> 5;
			this.extraBytes = (outputBits & 31) >> 3;
			for (var i = 0; i < 50; ++i) this.s[i] = 0;
		}
		Keccak.prototype.update = function(message) {
			if (this.finalized) throw new Error(FINALIZE_ERROR);
			var result = formatMessage(message);
			message = result[0];
			var isString = result[1];
			var blocks = this.blocks, byteCount = this.byteCount, length = message.length, blockCount = this.blockCount, index = 0, s = this.s, i, code;
			while (index < length) {
				if (this.reset) {
					this.reset = false;
					blocks[0] = this.block;
					for (i = 1; i < blockCount + 1; ++i) blocks[i] = 0;
				}
				if (isString) for (i = this.start; index < length && i < byteCount; ++index) {
					code = message.charCodeAt(index);
					if (code < 128) blocks[i >> 2] |= code << SHIFT[i++ & 3];
					else if (code < 2048) {
						blocks[i >> 2] |= (192 | code >> 6) << SHIFT[i++ & 3];
						blocks[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
					} else if (code < 55296 || code >= 57344) {
						blocks[i >> 2] |= (224 | code >> 12) << SHIFT[i++ & 3];
						blocks[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[i++ & 3];
						blocks[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
					} else {
						code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
						blocks[i >> 2] |= (240 | code >> 18) << SHIFT[i++ & 3];
						blocks[i >> 2] |= (128 | code >> 12 & 63) << SHIFT[i++ & 3];
						blocks[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[i++ & 3];
						blocks[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
					}
				}
				else for (i = this.start; index < length && i < byteCount; ++index) blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
				this.lastByteIndex = i;
				if (i >= byteCount) {
					this.start = i - byteCount;
					this.block = blocks[blockCount];
					for (i = 0; i < blockCount; ++i) s[i] ^= blocks[i];
					f(s);
					this.reset = true;
				} else this.start = i;
			}
			return this;
		};
		Keccak.prototype.encode = function(x, right) {
			var o = x & 255, n = 1;
			var bytes = [o];
			x = x >> 8;
			o = x & 255;
			while (o > 0) {
				bytes.unshift(o);
				x = x >> 8;
				o = x & 255;
				++n;
			}
			if (right) bytes.push(n);
			else bytes.unshift(n);
			this.update(bytes);
			return bytes.length;
		};
		Keccak.prototype.encodeString = function(str) {
			var result = formatMessage(str);
			str = result[0];
			var isString = result[1];
			var bytes = 0, length = str.length;
			if (isString) for (var i = 0; i < str.length; ++i) {
				var code = str.charCodeAt(i);
				if (code < 128) bytes += 1;
				else if (code < 2048) bytes += 2;
				else if (code < 55296 || code >= 57344) bytes += 3;
				else {
					code = 65536 + ((code & 1023) << 10 | str.charCodeAt(++i) & 1023);
					bytes += 4;
				}
			}
			else bytes = length;
			bytes += this.encode(bytes * 8);
			this.update(str);
			return bytes;
		};
		Keccak.prototype.bytepad = function(strs, w) {
			var bytes = this.encode(w);
			for (var i = 0; i < strs.length; ++i) bytes += this.encodeString(strs[i]);
			var paddingBytes = (w - bytes % w) % w;
			var zeros = [];
			zeros.length = paddingBytes;
			this.update(zeros);
			return this;
		};
		Keccak.prototype.finalize = function() {
			if (this.finalized) return;
			this.finalized = true;
			var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
			blocks[i >> 2] |= this.padding[i & 3];
			if (this.lastByteIndex === this.byteCount) {
				blocks[0] = blocks[blockCount];
				for (i = 1; i < blockCount + 1; ++i) blocks[i] = 0;
			}
			blocks[blockCount - 1] |= 2147483648;
			for (i = 0; i < blockCount; ++i) s[i] ^= blocks[i];
			f(s);
		};
		Keccak.prototype.toString = Keccak.prototype.hex = function() {
			this.finalize();
			var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i = 0, j = 0;
			var hex = "", block;
			while (j < outputBlocks) {
				for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
					block = s[i];
					hex += HEX_CHARS[block >> 4 & 15] + HEX_CHARS[block & 15] + HEX_CHARS[block >> 12 & 15] + HEX_CHARS[block >> 8 & 15] + HEX_CHARS[block >> 20 & 15] + HEX_CHARS[block >> 16 & 15] + HEX_CHARS[block >> 28 & 15] + HEX_CHARS[block >> 24 & 15];
				}
				if (j % blockCount === 0) {
					s = cloneArray(s);
					f(s);
					i = 0;
				}
			}
			if (extraBytes) {
				block = s[i];
				hex += HEX_CHARS[block >> 4 & 15] + HEX_CHARS[block & 15];
				if (extraBytes > 1) hex += HEX_CHARS[block >> 12 & 15] + HEX_CHARS[block >> 8 & 15];
				if (extraBytes > 2) hex += HEX_CHARS[block >> 20 & 15] + HEX_CHARS[block >> 16 & 15];
			}
			return hex;
		};
		Keccak.prototype.arrayBuffer = function() {
			this.finalize();
			var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i = 0, j = 0;
			var bytes = this.outputBits >> 3;
			var buffer;
			if (extraBytes) buffer = /* @__PURE__ */ new ArrayBuffer(outputBlocks + 1 << 2);
			else buffer = new ArrayBuffer(bytes);
			var array = new Uint32Array(buffer);
			while (j < outputBlocks) {
				for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) array[j] = s[i];
				if (j % blockCount === 0) {
					s = cloneArray(s);
					f(s);
				}
			}
			if (extraBytes) {
				array[j] = s[i];
				buffer = buffer.slice(0, bytes);
			}
			return buffer;
		};
		Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;
		Keccak.prototype.digest = Keccak.prototype.array = function() {
			this.finalize();
			var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i = 0, j = 0;
			var array = [], offset, block;
			while (j < outputBlocks) {
				for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
					offset = j << 2;
					block = s[i];
					array[offset] = block & 255;
					array[offset + 1] = block >> 8 & 255;
					array[offset + 2] = block >> 16 & 255;
					array[offset + 3] = block >> 24 & 255;
				}
				if (j % blockCount === 0) {
					s = cloneArray(s);
					f(s);
				}
			}
			if (extraBytes) {
				offset = j << 2;
				block = s[i];
				array[offset] = block & 255;
				if (extraBytes > 1) array[offset + 1] = block >> 8 & 255;
				if (extraBytes > 2) array[offset + 2] = block >> 16 & 255;
			}
			return array;
		};
		function Kmac(bits, padding, outputBits) {
			Keccak.call(this, bits, padding, outputBits);
		}
		Kmac.prototype = new Keccak();
		Kmac.prototype.finalize = function() {
			this.encode(this.outputBits, true);
			return Keccak.prototype.finalize.call(this);
		};
		var f = function(s) {
			var h, l, n = 0, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
			for (; n < 48; n += 2) {
				c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
				c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
				c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
				c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
				c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
				c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
				c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
				c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
				c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
				c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];
				h = c8 ^ (c2 << 1 | c3 >>> 31);
				l = c9 ^ (c3 << 1 | c2 >>> 31);
				s[0] ^= h;
				s[1] ^= l;
				s[10] ^= h;
				s[11] ^= l;
				s[20] ^= h;
				s[21] ^= l;
				s[30] ^= h;
				s[31] ^= l;
				s[40] ^= h;
				s[41] ^= l;
				h = c0 ^ (c4 << 1 | c5 >>> 31);
				l = c1 ^ (c5 << 1 | c4 >>> 31);
				s[2] ^= h;
				s[3] ^= l;
				s[12] ^= h;
				s[13] ^= l;
				s[22] ^= h;
				s[23] ^= l;
				s[32] ^= h;
				s[33] ^= l;
				s[42] ^= h;
				s[43] ^= l;
				h = c2 ^ (c6 << 1 | c7 >>> 31);
				l = c3 ^ (c7 << 1 | c6 >>> 31);
				s[4] ^= h;
				s[5] ^= l;
				s[14] ^= h;
				s[15] ^= l;
				s[24] ^= h;
				s[25] ^= l;
				s[34] ^= h;
				s[35] ^= l;
				s[44] ^= h;
				s[45] ^= l;
				h = c4 ^ (c8 << 1 | c9 >>> 31);
				l = c5 ^ (c9 << 1 | c8 >>> 31);
				s[6] ^= h;
				s[7] ^= l;
				s[16] ^= h;
				s[17] ^= l;
				s[26] ^= h;
				s[27] ^= l;
				s[36] ^= h;
				s[37] ^= l;
				s[46] ^= h;
				s[47] ^= l;
				h = c6 ^ (c0 << 1 | c1 >>> 31);
				l = c7 ^ (c1 << 1 | c0 >>> 31);
				s[8] ^= h;
				s[9] ^= l;
				s[18] ^= h;
				s[19] ^= l;
				s[28] ^= h;
				s[29] ^= l;
				s[38] ^= h;
				s[39] ^= l;
				s[48] ^= h;
				s[49] ^= l;
				b0 = s[0];
				b1 = s[1];
				b32 = s[11] << 4 | s[10] >>> 28;
				b33 = s[10] << 4 | s[11] >>> 28;
				b14 = s[20] << 3 | s[21] >>> 29;
				b15 = s[21] << 3 | s[20] >>> 29;
				b46 = s[31] << 9 | s[30] >>> 23;
				b47 = s[30] << 9 | s[31] >>> 23;
				b28 = s[40] << 18 | s[41] >>> 14;
				b29 = s[41] << 18 | s[40] >>> 14;
				b20 = s[2] << 1 | s[3] >>> 31;
				b21 = s[3] << 1 | s[2] >>> 31;
				b2 = s[13] << 12 | s[12] >>> 20;
				b3 = s[12] << 12 | s[13] >>> 20;
				b34 = s[22] << 10 | s[23] >>> 22;
				b35 = s[23] << 10 | s[22] >>> 22;
				b16 = s[33] << 13 | s[32] >>> 19;
				b17 = s[32] << 13 | s[33] >>> 19;
				b48 = s[42] << 2 | s[43] >>> 30;
				b49 = s[43] << 2 | s[42] >>> 30;
				b40 = s[5] << 30 | s[4] >>> 2;
				b41 = s[4] << 30 | s[5] >>> 2;
				b22 = s[14] << 6 | s[15] >>> 26;
				b23 = s[15] << 6 | s[14] >>> 26;
				b4 = s[25] << 11 | s[24] >>> 21;
				b5 = s[24] << 11 | s[25] >>> 21;
				b36 = s[34] << 15 | s[35] >>> 17;
				b37 = s[35] << 15 | s[34] >>> 17;
				b18 = s[45] << 29 | s[44] >>> 3;
				b19 = s[44] << 29 | s[45] >>> 3;
				b10 = s[6] << 28 | s[7] >>> 4;
				b11 = s[7] << 28 | s[6] >>> 4;
				b42 = s[17] << 23 | s[16] >>> 9;
				b43 = s[16] << 23 | s[17] >>> 9;
				b24 = s[26] << 25 | s[27] >>> 7;
				b25 = s[27] << 25 | s[26] >>> 7;
				b6 = s[36] << 21 | s[37] >>> 11;
				b7 = s[37] << 21 | s[36] >>> 11;
				b38 = s[47] << 24 | s[46] >>> 8;
				b39 = s[46] << 24 | s[47] >>> 8;
				b30 = s[8] << 27 | s[9] >>> 5;
				b31 = s[9] << 27 | s[8] >>> 5;
				b12 = s[18] << 20 | s[19] >>> 12;
				b13 = s[19] << 20 | s[18] >>> 12;
				b44 = s[29] << 7 | s[28] >>> 25;
				b45 = s[28] << 7 | s[29] >>> 25;
				b26 = s[38] << 8 | s[39] >>> 24;
				b27 = s[39] << 8 | s[38] >>> 24;
				b8 = s[48] << 14 | s[49] >>> 18;
				b9 = s[49] << 14 | s[48] >>> 18;
				s[0] = b0 ^ ~b2 & b4;
				s[1] = b1 ^ ~b3 & b5;
				s[10] = b10 ^ ~b12 & b14;
				s[11] = b11 ^ ~b13 & b15;
				s[20] = b20 ^ ~b22 & b24;
				s[21] = b21 ^ ~b23 & b25;
				s[30] = b30 ^ ~b32 & b34;
				s[31] = b31 ^ ~b33 & b35;
				s[40] = b40 ^ ~b42 & b44;
				s[41] = b41 ^ ~b43 & b45;
				s[2] = b2 ^ ~b4 & b6;
				s[3] = b3 ^ ~b5 & b7;
				s[12] = b12 ^ ~b14 & b16;
				s[13] = b13 ^ ~b15 & b17;
				s[22] = b22 ^ ~b24 & b26;
				s[23] = b23 ^ ~b25 & b27;
				s[32] = b32 ^ ~b34 & b36;
				s[33] = b33 ^ ~b35 & b37;
				s[42] = b42 ^ ~b44 & b46;
				s[43] = b43 ^ ~b45 & b47;
				s[4] = b4 ^ ~b6 & b8;
				s[5] = b5 ^ ~b7 & b9;
				s[14] = b14 ^ ~b16 & b18;
				s[15] = b15 ^ ~b17 & b19;
				s[24] = b24 ^ ~b26 & b28;
				s[25] = b25 ^ ~b27 & b29;
				s[34] = b34 ^ ~b36 & b38;
				s[35] = b35 ^ ~b37 & b39;
				s[44] = b44 ^ ~b46 & b48;
				s[45] = b45 ^ ~b47 & b49;
				s[6] = b6 ^ ~b8 & b0;
				s[7] = b7 ^ ~b9 & b1;
				s[16] = b16 ^ ~b18 & b10;
				s[17] = b17 ^ ~b19 & b11;
				s[26] = b26 ^ ~b28 & b20;
				s[27] = b27 ^ ~b29 & b21;
				s[36] = b36 ^ ~b38 & b30;
				s[37] = b37 ^ ~b39 & b31;
				s[46] = b46 ^ ~b48 & b40;
				s[47] = b47 ^ ~b49 & b41;
				s[8] = b8 ^ ~b0 & b2;
				s[9] = b9 ^ ~b1 & b3;
				s[18] = b18 ^ ~b10 & b12;
				s[19] = b19 ^ ~b11 & b13;
				s[28] = b28 ^ ~b20 & b22;
				s[29] = b29 ^ ~b21 & b23;
				s[38] = b38 ^ ~b30 & b32;
				s[39] = b39 ^ ~b31 & b33;
				s[48] = b48 ^ ~b40 & b42;
				s[49] = b49 ^ ~b41 & b43;
				s[0] ^= RC[n];
				s[1] ^= RC[n + 1];
			}
		};
		if (COMMON_JS) module.exports = methods;
		else {
			for (i = 0; i < methodNames.length; ++i) root[methodNames[i]] = methods[methodNames[i]];
			if (AMD) define(function() {
				return methods;
			});
		}
	})();
})))(), 1);
/**
* @param {sha3.Hash} fn
* @returns {(inp:Uint8Array)=>Uint8Array}
*/
function encoder(fn) {
	return (b) => new Uint8Array(fn.array(b));
}
from({
	code: 23,
	name: "sha3-224",
	encode: encoder(import_sha3.default.sha3_224)
});
from({
	code: 22,
	name: "sha3-256",
	encode: encoder(import_sha3.default.sha3_256)
});
from({
	code: 21,
	name: "sha3-384",
	encode: encoder(import_sha3.default.sha3_384)
});
var sha3512 = from({
	code: 20,
	name: "sha3-512",
	encode: encoder(import_sha3.default.sha3_512)
});
from({
	code: 24,
	name: "shake-128",
	encode: (b) => new Uint8Array(import_sha3.default.shake128.array(b, 256))
});
from({
	code: 25,
	name: "shake-256",
	encode: (b) => new Uint8Array(import_sha3.default.shake256.array(b, 512))
});
from({
	code: 26,
	name: "keccak-224",
	encode: encoder(import_sha3.default.keccak224)
});
var keccak256 = from({
	code: 27,
	name: "keccak-256",
	encode: encoder(import_sha3.default.keccak256)
});
from({
	code: 28,
	name: "keccak-384",
	encode: encoder(import_sha3.default.keccak384)
});
from({
	code: 29,
	name: "keccak-512",
	encode: encoder(import_sha3.default.keccak512)
});
//#endregion
//#region vendor/ipld-explorer-components/src/lib/hash-importer.ts
async function getHashersForCodes(...codes) {
	const hashers = [];
	for (const code of codes) try {
		hashers.push(await getHasherForCode(code));
	} catch (error) {
		console.error(`Failed to get hasher for code ${code}: ${error}`);
	}
	return hashers;
}
/**
* Helper function to prevent `this` from being lost when calling `encode` and `digest` on a hasher.
*/
function getBoundHasher(hasher) {
	return {
		...hasher,
		encode: hasher.encode.bind(hasher),
		digest: hasher.digest.bind(hasher)
	};
}
async function getHasherForCode(code) {
	switch (code) {
		case identity.code: return getBoundHasher({
			...identity,
			name: "identity"
		});
		case sha256$1.code: return getBoundHasher(sha256$1);
		case sha512$1.code: return getBoundHasher(sha512$1);
		case 17: return getBoundHasher(from({
			name: "sha1",
			code,
			encode: async (data) => {
				const hashBuffer = await globalThis.crypto.subtle.digest("SHA-1", new Uint8Array(data));
				return new Uint8Array(hashBuffer);
			}
		}));
		case sha3512.code: return getBoundHasher(sha3512);
		case keccak256.code: return getBoundHasher(keccak256);
		case 30: return getBoundHasher(from({
			name: "blake3",
			code,
			encode: async (data) => {
				const { createBLAKE3 } = await import("./index.esm-5SdKXlyC.js");
				const blake3Hasher = await createBLAKE3();
				blake3Hasher.init();
				blake3Hasher.update(data);
				return blake3Hasher.digest("binary");
			}
		}));
		case 45600: return getBoundHasher(from({
			name: "blake2b-256",
			code,
			encode: async (data) => {
				const { createBLAKE2b } = await import("./index.esm-5SdKXlyC.js");
				const blake2bHasher = await createBLAKE2b(256);
				blake2bHasher.init();
				blake2bHasher.update(data);
				return blake2bHasher.digest("binary");
			}
		}));
		case 45632: return getBoundHasher(from({
			name: "blake2b-512",
			code,
			encode: async (data) => {
				const { createBLAKE2b } = await import("./index.esm-5SdKXlyC.js");
				const blake2bHasher = await createBLAKE2b(512);
				blake2bHasher.init();
				blake2bHasher.update(data);
				return blake2bHasher.digest("binary");
			}
		}));
		default: throw new Error(`unknown multihasher code '${code}'`);
	}
}
//#endregion
//#region vendor/ipld-explorer-components/src/lib/get-codec-name-from-code.ts
/**
* Converts supported codec codes from https://github.com/multiformats/multicodec/blob/master/table.csv to their names.
*/
function getCodecNameFromCode(code) {
	switch (code) {
		case 113: return "dag-cbor";
		case 112: return "dag-pb";
		case 120: return "git-raw";
		case 85: return "raw";
		case 512: return "json";
		case 297: return "dag-json";
		case 133: return "dag-jose";
		default: return "unknown";
	}
}
//#endregion
//#region vendor/ipld-explorer-components/src/lib/codec-importer.ts
async function codecImporter(codeOrName) {
	let codecName;
	if (typeof codeOrName === "string") codecName = codeOrName;
	else codecName = getCodecNameFromCode(codeOrName);
	switch (codecName) {
		case "dag-cbor": return Promise.resolve().then(() => src_exports$2);
		case "dag-pb": return Promise.resolve().then(() => src_exports);
		case "git-raw": throw new Error("git-raw is unsupported until https://github.com/ipld/js-ipld-git is updated.");
		case "raw": return Promise.resolve().then(() => raw_exports);
		case "json": return Promise.resolve().then(() => json_exports);
		case "dag-json": return Promise.resolve().then(() => src_exports$1);
		case "dag-jose": return import("./lib-DXfWiLfx.js");
		default: throw new Error(`unsupported codec: ${codeOrName}=${codecName}`);
	}
}
//#endregion
//#region vendor/ipld-explorer-components/src/lib/helpers.ts
function ensureLeadingSlash(str) {
	if (str.startsWith("/")) return str;
	return `/${str}`;
}
/**
* When migrating to typescript and removing redux-bundler, a lot of old code
* had checks like `path ? path : null` which would fire as "false" when the
* path was an empty string. This function helps the migration path but should
* be removed once all the old code is updated.
*/
function isFalsy(str) {
	if (str == null || str === "") return true;
	return false;
}
function isTruthy(str) {
	return !isFalsy(str);
}
async function addDagNodeToHelia(helia, codecName, node, hasherCode = 18) {
	const codec = await codecImporter(codecName);
	const hasher = await getHasherForCode(hasherCode);
	const encodedNode = codec.encode(node);
	const mhDigest = await hasher.digest(encodedNode);
	const cid = CID.createV1(codec.code, mhDigest);
	return helia.blockstore.put(cid, encodedNode);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/varint/encode.js
var require_encode = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = encode;
	var MSB = 128;
	var MSBALL = -128;
	var INT = Math.pow(2, 31);
	function encode(num, out, offset) {
		if (Number.MAX_SAFE_INTEGER && num > Number.MAX_SAFE_INTEGER) {
			encode.bytes = 0;
			throw new RangeError("Could not encode varint");
		}
		out = out || [];
		offset = offset || 0;
		var oldOffset = offset;
		while (num >= INT) {
			out[offset++] = num & 255 | MSB;
			num /= 128;
		}
		while (num & MSBALL) {
			out[offset++] = num & 255 | MSB;
			num >>>= 7;
		}
		out[offset] = num | 0;
		encode.bytes = offset - oldOffset + 1;
		return out;
	}
}));
//#endregion
//#region vendor/ipld-explorer-components/node_modules/varint/decode.js
var require_decode = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = read;
	var MSB = 128;
	var REST = 127;
	function read(buf, offset) {
		var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf.length;
		do {
			if (counter >= l || shift > 49) {
				read.bytes = 0;
				throw new RangeError("Could not decode varint");
			}
			b = buf[counter++];
			res += shift < 28 ? (b & REST) << shift : (b & REST) * Math.pow(2, shift);
			shift += 7;
		} while (b >= MSB);
		read.bytes = counter - offset;
		return res;
	}
}));
//#endregion
//#region vendor/ipld-explorer-components/node_modules/varint/length.js
var require_length = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var N1 = Math.pow(2, 7);
	var N2 = Math.pow(2, 14);
	var N3 = Math.pow(2, 21);
	var N4 = Math.pow(2, 28);
	var N5 = Math.pow(2, 35);
	var N6 = Math.pow(2, 42);
	var N7 = Math.pow(2, 49);
	var N8 = Math.pow(2, 56);
	var N9 = Math.pow(2, 63);
	module.exports = function(value) {
		return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
	};
}));
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@ipld/car/src/decoder-common.js
var import_varint = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		encode: require_encode(),
		decode: require_decode(),
		encodingLength: require_length()
	};
})))(), 1);
var CIDV0_BYTES = {
	SHA2_256: 18,
	LENGTH: 32,
	DAG_PB: 112
};
/**
* Decodes varint and seeks the buffer
*
* ```js
* // needs bytes to be read first
* const bytes = reader.upTo(8) // maybe async
* ```
*
* @param {Uint8Array} bytes
* @param {import('./coding').Seekable} seeker
* @returns {number}
*/
function decodeVarint(bytes, seeker) {
	if (!bytes.length) throw new Error("Unexpected end of data");
	const i = import_varint.default.decode(bytes);
	seeker.seek(import_varint.default.decode.bytes);
	return i;
}
/**
* Decode v2 header
*
* ```js
* // needs bytes to be read first
* const bytes = reader.exactly(V2_HEADER_LENGTH, true) // maybe async
* ```
*
* @param {Uint8Array} bytes
* @returns {import('./coding').CarV2FixedHeader}
*/
function decodeV2Header(bytes) {
	const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	let offset = 0;
	return {
		version: 2,
		/** @type {[bigint, bigint]} */
		characteristics: [dv.getBigUint64(offset, true), dv.getBigUint64(offset += 8, true)],
		dataOffset: Number(dv.getBigUint64(offset += 8, true)),
		dataSize: Number(dv.getBigUint64(offset += 8, true)),
		indexOffset: Number(dv.getBigUint64(offset += 8, true))
	};
}
/**
* Checks the length of the multihash to be read afterwards
*
* ```js
* // needs bytes to be read first
* const bytes = reader.upTo(8) // maybe async
* ```
*
* @param {Uint8Array} bytes
*/
function getMultihashLength(bytes) {
	import_varint.default.decode(bytes);
	const codeLength = import_varint.default.decode.bytes;
	const length = import_varint.default.decode(bytes.subarray(import_varint.default.decode.bytes));
	return codeLength + import_varint.default.decode.bytes + length;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@ipld/car/src/header-validator.js
/** Auto-generated with @ipld/schema@v4.2.0 at Thu Sep 14 2023 from IPLD Schema:
*
* # CarV1HeaderOrV2Pragma is a more relaxed form, and can parse {version:x} where
* # roots are optional. This is typically useful for the {verison:2} CARv2
* # pragma.
*
* type CarV1HeaderOrV2Pragma struct {
* 	roots optional [&Any]
* 	# roots is _not_ optional for CarV1 but we defer that check within code to
* 	# gracefully handle the V2 case where it's just {version:X}
* 	version Int
* }
*
* # CarV1Header is the strict form of the header, and requires roots to be
* # present. This is compatible with the CARv1 specification.
*
* # type CarV1Header struct {
* # 	roots [&Any]
* # 	version Int
* # }
*
*/
var Kinds = {
	Null: /** @returns {undefined|null} */ (obj) => obj === null ? obj : void 0,
	Int: /** @returns {undefined|number} */ (obj) => Number.isInteger(obj) ? obj : void 0,
	Float: /** @returns {undefined|number} */ (obj) => typeof obj === "number" && Number.isFinite(obj) ? obj : void 0,
	String: /** @returns {undefined|string} */ (obj) => typeof obj === "string" ? obj : void 0,
	Bool: /** @returns {undefined|boolean} */ (obj) => typeof obj === "boolean" ? obj : void 0,
	Bytes: /** @returns {undefined|Uint8Array} */ (obj) => obj instanceof Uint8Array ? obj : void 0,
	Link: /** @returns {undefined|object} */ (obj) => obj !== null && typeof obj === "object" && obj.asCID === obj ? obj : void 0,
	List: /** @returns {undefined|Array<any>} */ (obj) => Array.isArray(obj) ? obj : void 0,
	Map: /** @returns {undefined|object} */ (obj) => obj !== null && typeof obj === "object" && obj.asCID !== obj && !Array.isArray(obj) && !(obj instanceof Uint8Array) ? obj : void 0
};
/** @type {{ [k in string]: (obj:any)=>undefined|any}} */
var Types = {
	"CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)": Kinds.Link,
	"CarV1HeaderOrV2Pragma > roots (anon)": /** @returns {undefined|any} */ (obj) => {
		if (Kinds.List(obj) === void 0) return;
		for (let i = 0; i < obj.length; i++) {
			let v = obj[i];
			v = Types["CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)"](v);
			if (v === void 0) return;
			if (v !== obj[i]) {
				const ret = obj.slice(0, i);
				for (let j = i; j < obj.length; j++) {
					let v = obj[j];
					v = Types["CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)"](v);
					if (v === void 0) return;
					ret.push(v);
				}
				return ret;
			}
		}
		return obj;
	},
	Int: Kinds.Int,
	CarV1HeaderOrV2Pragma: /** @returns {undefined|any} */ (obj) => {
		if (Kinds.Map(obj) === void 0) return;
		const entries = Object.entries(obj);
		/** @type {{[k in string]: any}} */
		let ret = obj;
		let requiredCount = 1;
		for (let i = 0; i < entries.length; i++) {
			const [key, value] = entries[i];
			switch (key) {
				case "roots":
					{
						const v = Types["CarV1HeaderOrV2Pragma > roots (anon)"](obj[key]);
						if (v === void 0) return;
						if (v !== value || ret !== obj) {
							if (ret === obj) {
								/** @type {{[k in string]: any}} */
								ret = {};
								for (let j = 0; j < i; j++) ret[entries[j][0]] = entries[j][1];
							}
							ret.roots = v;
						}
					}
					break;
				case "version":
					{
						requiredCount--;
						const v = Types.Int(obj[key]);
						if (v === void 0) return;
						if (v !== value || ret !== obj) {
							if (ret === obj) {
								/** @type {{[k in string]: any}} */
								ret = {};
								for (let j = 0; j < i; j++) ret[entries[j][0]] = entries[j][1];
							}
							ret.version = v;
						}
					}
					break;
				default: return;
			}
		}
		if (requiredCount > 0) return;
		return ret;
	}
};
/** @type {{ [k in string]: (obj:any)=>undefined|any}} */
var Reprs = {
	"CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)": Kinds.Link,
	"CarV1HeaderOrV2Pragma > roots (anon)": /** @returns {undefined|any} */ (obj) => {
		if (Kinds.List(obj) === void 0) return;
		for (let i = 0; i < obj.length; i++) {
			let v = obj[i];
			v = Reprs["CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)"](v);
			if (v === void 0) return;
			if (v !== obj[i]) {
				const ret = obj.slice(0, i);
				for (let j = i; j < obj.length; j++) {
					let v = obj[j];
					v = Reprs["CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)"](v);
					if (v === void 0) return;
					ret.push(v);
				}
				return ret;
			}
		}
		return obj;
	},
	Int: Kinds.Int,
	CarV1HeaderOrV2Pragma: /** @returns {undefined|any} */ (obj) => {
		if (Kinds.Map(obj) === void 0) return;
		const entries = Object.entries(obj);
		/** @type {{[k in string]: any}} */
		let ret = obj;
		let requiredCount = 1;
		for (let i = 0; i < entries.length; i++) {
			const [key, value] = entries[i];
			switch (key) {
				case "roots":
					{
						const v = Reprs["CarV1HeaderOrV2Pragma > roots (anon)"](value);
						if (v === void 0) return;
						if (v !== value || ret !== obj) {
							if (ret === obj) {
								/** @type {{[k in string]: any}} */
								ret = {};
								for (let j = 0; j < i; j++) ret[entries[j][0]] = entries[j][1];
							}
							ret.roots = v;
						}
					}
					break;
				case "version":
					{
						requiredCount--;
						const v = Reprs.Int(value);
						if (v === void 0) return;
						if (v !== value || ret !== obj) {
							if (ret === obj) {
								/** @type {{[k in string]: any}} */
								ret = {};
								for (let j = 0; j < i; j++) ret[entries[j][0]] = entries[j][1];
							}
							ret.version = v;
						}
					}
					break;
				default: return;
			}
		}
		if (requiredCount > 0) return;
		return ret;
	}
};
var CarV1HeaderOrV2Pragma = {
	toTyped: Types.CarV1HeaderOrV2Pragma,
	toRepresentation: Reprs.CarV1HeaderOrV2Pragma
};
makeCborEncoders();
new Token(Type.map, 2), new Token(Type.string, "version"), new Token(Type.uint, 1), new Token(Type.string, "roots");
new Token(Type.tag, 42);
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@ipld/car/src/decoder.js
/**
* @typedef {import('./api').Block} Block
* @typedef {import('./api').BlockHeader} BlockHeader
* @typedef {import('./api').BlockIndex} BlockIndex
* @typedef {import('./coding').BytesReader} BytesReader
* @typedef {import('./coding').CarHeader} CarHeader
* @typedef {import('./coding').CarV2Header} CarV2Header
* @typedef {import('./coding').CarV2FixedHeader} CarV2FixedHeader
* @typedef {import('./coding').CarDecoder} CarDecoder
*/
/**
* Reads header data from a `BytesReader`. The header may either be in the form
* of a `CarHeader` or `CarV2Header` depending on the CAR being read.
*
* @name async decoder.readHeader(reader)
* @param {BytesReader} reader
* @param {number} [strictVersion]
* @returns {Promise<CarHeader|CarV2Header>}
*/
async function readHeader(reader, strictVersion) {
	const length = decodeVarint(await reader.upTo(8), reader);
	if (length === 0) throw new Error("Invalid CAR header (zero length)");
	const block = decode$4(await reader.exactly(length, true));
	if (CarV1HeaderOrV2Pragma.toTyped(block) === void 0) throw new Error("Invalid CAR header format");
	if (block.version !== 1 && block.version !== 2 || strictVersion !== void 0 && block.version !== strictVersion) throw new Error(`Invalid CAR version: ${block.version}${strictVersion !== void 0 ? ` (expected ${strictVersion})` : ""}`);
	if (block.version === 1) {
		if (!Array.isArray(block.roots)) throw new Error("Invalid CAR header format");
		return block;
	}
	if (block.roots !== void 0) throw new Error("Invalid CAR header format");
	const v2Header = decodeV2Header(await reader.exactly(40, true));
	reader.seek(v2Header.dataOffset - reader.pos);
	const v1Header = await readHeader(reader, 1);
	return Object.assign(v1Header, v2Header);
}
/**
* @param {BytesReader} reader
* @returns {Promise<CID>}
*/
async function readCid(reader) {
	const first = await reader.exactly(2, false);
	if (first[0] === CIDV0_BYTES.SHA2_256 && first[1] === CIDV0_BYTES.LENGTH) {
		const bytes = await reader.exactly(34, true);
		const multihash = decode$8(bytes);
		return CID.create(0, CIDV0_BYTES.DAG_PB, multihash);
	}
	const version = decodeVarint(await reader.upTo(8), reader);
	if (version !== 1) throw new Error(`Unexpected CID version (${version})`);
	const codec = decodeVarint(await reader.upTo(8), reader);
	const bytes = await reader.exactly(getMultihashLength(await reader.upTo(8)), true);
	const multihash = decode$8(bytes);
	return CID.create(version, codec, multihash);
}
/**
* Reads the leading data of an individual block from CAR data from a
* `BytesReader`. Returns a `BlockHeader` object which contains
* `{ cid, length, blockLength }` which can be used to either index the block
* or read the block binary data.
*
* @name async decoder.readBlockHead(reader)
* @param {BytesReader} reader
* @returns {Promise<BlockHeader>}
*/
async function readBlockHead(reader) {
	const start = reader.pos;
	let length = decodeVarint(await reader.upTo(8), reader);
	if (length === 0) throw new Error("Invalid CAR section (zero length)");
	length += reader.pos - start;
	const cid = await readCid(reader);
	const blockLength = length - Number(reader.pos - start);
	return {
		cid,
		length,
		blockLength
	};
}
/**
* @param {BytesReader} reader
* @returns {Promise<Block>}
*/
async function readBlock(reader) {
	const { cid, blockLength } = await readBlockHead(reader);
	return {
		bytes: await reader.exactly(blockLength, true),
		cid
	};
}
/**
* @param {BytesReader} reader
* @returns {Promise<BlockIndex>}
*/
async function readBlockIndex(reader) {
	const offset = reader.pos;
	const { cid, length, blockLength } = await readBlockHead(reader);
	const index = {
		cid,
		length,
		blockLength,
		offset,
		blockOffset: reader.pos
	};
	reader.seek(index.blockLength);
	return index;
}
/**
* Creates a `CarDecoder` from a `BytesReader`. The `CarDecoder` is as async
* interface that will consume the bytes from the `BytesReader` to yield a
* `header()` and either `blocks()` or `blocksIndex()` data.
*
* @name decoder.createDecoder(reader)
* @param {BytesReader} reader
* @returns {CarDecoder}
*/
function createDecoder(reader) {
	const headerPromise = (async () => {
		const header = await readHeader(reader);
		if (header.version === 2) {
			const v1length = reader.pos - header.dataOffset;
			reader = limitReader(reader, header.dataSize - v1length);
		}
		return header;
	})();
	return {
		header: () => headerPromise,
		async *blocks() {
			await headerPromise;
			while ((await reader.upTo(8)).length > 0) yield await readBlock(reader);
		},
		async *blocksIndex() {
			await headerPromise;
			while ((await reader.upTo(8)).length > 0) yield await readBlockIndex(reader);
		}
	};
}
/**
* Creates a `BytesReader` from a `Uint8Array`.
*
* @name decoder.bytesReader(bytes)
* @param {Uint8Array} bytes
* @returns {BytesReader}
*/
function bytesReader(bytes) {
	let pos = 0;
	/** @type {BytesReader} */
	return {
		async upTo(length) {
			return bytes.subarray(pos, pos + Math.min(length, bytes.length - pos));
		},
		async exactly(length, seek = false) {
			if (length > bytes.length - pos) throw new Error("Unexpected end of data");
			const out = bytes.subarray(pos, pos + length);
			if (seek) pos += length;
			return out;
		},
		seek(length) {
			pos += length;
		},
		get pos() {
			return pos;
		}
	};
}
/**
* @ignore
* reusable reader for streams and files, we just need a way to read an
* additional chunk (of some undetermined size) and a way to close the
* reader when finished
* @param {() => Promise<Uint8Array|null>} readChunk
* @returns {BytesReader}
*/
function chunkReader(readChunk) {
	let pos = 0;
	let have = 0;
	let offset = 0;
	let currentChunk = /* @__PURE__ */ new Uint8Array(0);
	const read = async (length) => {
		have = currentChunk.length - offset;
		const bufa = [currentChunk.subarray(offset)];
		while (have < length) {
			const chunk = await readChunk();
			if (chunk == null) break;
			/* c8 ignore next 8 */
			if (have < 0) {
				/* c8 ignore next 4 */
				if (chunk.length > have) bufa.push(chunk.subarray(-have));
			} else bufa.push(chunk);
			have += chunk.length;
		}
		currentChunk = new Uint8Array(bufa.reduce((p, c) => p + c.length, 0));
		let off = 0;
		for (const b of bufa) {
			currentChunk.set(b, off);
			off += b.length;
		}
		offset = 0;
	};
	/** @type {BytesReader} */
	return {
		async upTo(length) {
			if (currentChunk.length - offset < length) await read(length);
			return currentChunk.subarray(offset, offset + Math.min(currentChunk.length - offset, length));
		},
		async exactly(length, seek = false) {
			if (currentChunk.length - offset < length) await read(length);
			if (currentChunk.length - offset < length) throw new Error("Unexpected end of data");
			const out = currentChunk.subarray(offset, offset + length);
			if (seek) {
				pos += length;
				offset += length;
			}
			return out;
		},
		seek(length) {
			pos += length;
			offset += length;
		},
		get pos() {
			return pos;
		}
	};
}
/**
* Creates a `BytesReader` from an `AsyncIterable<Uint8Array>`, which allows for
* consumption of CAR data from a streaming source.
*
* @name decoder.asyncIterableReader(asyncIterable)
* @param {AsyncIterable<Uint8Array>} asyncIterable
* @returns {BytesReader}
*/
function asyncIterableReader(asyncIterable) {
	const iterator = asyncIterable[Symbol.asyncIterator]();
	async function readChunk() {
		const next = await iterator.next();
		if (next.done) return null;
		return next.value;
	}
	return chunkReader(readChunk);
}
/**
* Wraps a `BytesReader` in a limiting `BytesReader` which limits maximum read
* to `byteLimit` bytes. It _does not_ update `pos` of the original
* `BytesReader`.
*
* @name decoder.limitReader(reader, byteLimit)
* @param {BytesReader} reader
* @param {number} byteLimit
* @returns {BytesReader}
*/
function limitReader(reader, byteLimit) {
	let bytesRead = 0;
	/** @type {BytesReader} */
	return {
		async upTo(length) {
			let bytes = await reader.upTo(length);
			if (bytes.length + bytesRead > byteLimit) bytes = bytes.subarray(0, byteLimit - bytesRead);
			return bytes;
		},
		async exactly(length, seek = false) {
			const bytes = await reader.exactly(length, seek);
			if (bytes.length + bytesRead > byteLimit) throw new Error("Unexpected end of data");
			if (seek) bytesRead += length;
			return bytes;
		},
		seek(length) {
			bytesRead += length;
			reader.seek(length);
		},
		get pos() {
			return reader.pos;
		}
	};
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@ipld/car/src/iterator.js
/**
* @typedef {import('multiformats').CID} CID
* @typedef {import('./api').Block} Block
* @typedef {import('./api').RootsReader} RootsReader
* @typedef {import('./coding').BytesReader} BytesReader
*/
/**
* @class
* @implements {RootsReader}
* @property {number} version The version number of the CAR referenced by this reader (should be `1`).
*/
var CarIteratorBase = class {
	/**
	* @param {number} version
	* @param {CID[]} roots
	* @param {AsyncIterable<Block>|void} iterable
	*/
	constructor(version, roots, iterable) {
		this._version = version;
		this._roots = roots;
		this._iterable = iterable;
		this._decoded = false;
	}
	get version() {
		return this._version;
	}
	/**
	* @returns {Promise<CID[]>}
	*/
	async getRoots() {
		return this._roots;
	}
};
/**
* Provides an iterator over all of the `Block`s in a CAR. Implements a
* `BlockIterator` interface, or `AsyncIterable<Block>`. Where a `Block` is
* a `{ cid:CID, bytes:Uint8Array }` pair.
*
* As an implementer of `AsyncIterable`, this class can be used directly in a
* `for await (const block of iterator) {}` loop. Where the `iterator` is
* constructed using {@link CarBlockiterator.fromBytes} or
* {@link CarBlockiterator.fromIterable}.
*
* An iteration can only be performce _once_ per instantiation.
*
* `CarBlockIterator` also implements the `RootsReader` interface and provides
* the {@link CarBlockiterator.getRoots `getRoots()`} method.
*
* Load this class with either
* `import { CarBlockIterator } from '@ipld/car/iterator'`
* (`const { CarBlockIterator } = require('@ipld/car/iterator')`). Or
* `import { CarBlockIterator } from '@ipld/car'`
* (`const { CarBlockIterator } = require('@ipld/car')`).
*
* @name CarBlockIterator
* @class
* @implements {RootsReader}
* @implements {AsyncIterable<Block>}
* @property {number} version The version number of the CAR referenced by this
* iterator (should be `1`).
*/
var CarBlockIterator = class CarBlockIterator extends CarIteratorBase {
	/**
	* Get the list of roots defined by the CAR referenced by this iterator. May be
	* zero or more `CID`s.
	*
	* @function getRoots
	* @memberof CarBlockIterator
	* @instance
	* @async
	* @returns {Promise<CID[]>}
	*/
	/**
	* @returns {AsyncIterator<Block>}
	*/
	[Symbol.asyncIterator]() {
		if (this._decoded) throw new Error("Cannot decode more than once");
		/* c8 ignore next 3 */
		if (!this._iterable) throw new Error("Block iterable not found");
		this._decoded = true;
		return this._iterable[Symbol.asyncIterator]();
	}
	/**
	* Instantiate a {@link CarBlockIterator} from a `Uint8Array` blob. Rather
	* than decoding the entire byte array prior to returning the iterator, as in
	* {@link CarReader.fromBytes}, only the header is decoded and the remainder
	* of the CAR is parsed as the `Block`s as yielded.
	*
	* @async
	* @static
	* @memberof CarBlockIterator
	* @param {Uint8Array} bytes
	* @returns {Promise<CarBlockIterator>}
	*/
	static async fromBytes(bytes) {
		const { version, roots, iterator } = await fromBytes(bytes);
		return new CarBlockIterator(version, roots, iterator);
	}
	/**
	* Instantiate a {@link CarBlockIterator} from a `AsyncIterable<Uint8Array>`,
	* such as a [modern Node.js stream](https://nodejs.org/api/stream.html#stream_streams_compatibility_with_async_generators_and_async_iterators).
	* Rather than decoding the entire byte array prior to returning the iterator,
	* as in {@link CarReader.fromIterable}, only the header is decoded and the
	* remainder of the CAR is parsed as the `Block`s as yielded.
	*
	* @async
	* @static
	* @param {AsyncIterable<Uint8Array>} asyncIterable
	* @returns {Promise<CarBlockIterator>}
	*/
	static async fromIterable(asyncIterable) {
		const { version, roots, iterator } = await fromIterable(asyncIterable);
		return new CarBlockIterator(version, roots, iterator);
	}
};
/**
* @param {Uint8Array} bytes
* @returns {Promise<{ version:number, roots:CID[], iterator:AsyncIterable<Block>}>}
*/
async function fromBytes(bytes) {
	if (!(bytes instanceof Uint8Array)) throw new TypeError("fromBytes() requires a Uint8Array");
	return decodeIterator(bytesReader(bytes));
}
/**
* @param {AsyncIterable<Uint8Array>} asyncIterable
* @returns {Promise<{ version:number, roots:CID[], iterator:AsyncIterable<Block>}>}
*/
async function fromIterable(asyncIterable) {
	if (!asyncIterable || !(typeof asyncIterable[Symbol.asyncIterator] === "function")) throw new TypeError("fromIterable() requires an async iterable");
	return decodeIterator(asyncIterableReader(asyncIterable));
}
/**
* @private
* @param {BytesReader} reader
* @returns {Promise<{ version:number, roots:CID[], iterator:AsyncIterable<Block>}>}
*/
async function decodeIterator(reader) {
	const decoder = createDecoder(reader);
	const { version, roots } = await decoder.header();
	return {
		version,
		roots,
		iterator: decoder.blocks()
	};
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/stream-to-it/dist/src/source.js
/**
* Convert a Node.js [`Readable`](https://nodejs.org/dist/latest/docs/api/stream.html#class-streamreadable)
* stream or a browser [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* to an [iterable source](https://achingbrain.github.io/it-stream-types/types/Source.html).
*/
function source(readable) {
	if (isReadableStream(readable)) return (async function* () {
		const reader = readable.getReader();
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) return;
				yield value;
			}
		} finally {
			reader.releaseLock();
		}
	})();
	if (isNodeStream(readable)) return readable;
	throw new Error("unknown stream");
}
function isNodeStream(obj) {
	return obj[Symbol.asyncIterator] != null;
}
function isReadableStream(obj) {
	return typeof obj?.getReader === "function";
}
//#endregion
//#region vendor/ipld-explorer-components/src/lib/import-car.ts
/**
* Given a file object representing a CAR archive, import it into the given Helia instance,
* and return the CID for the root block
*
* TODO: Handle multiple roots
*/
async function importCar(file, helia) {
	const inStream = file.stream();
	const CarIterator = await CarBlockIterator.fromIterable(source(inStream));
	for await (const { cid, bytes } of CarIterator) await helia.blockstore.put(cid, bytes);
	return (await CarIterator.getRoots())[0];
}
//#endregion
//#region vendor/ipld-explorer-components/src/lib/parse-ipld-path.ts
var pathRegEx = /(\/(ipns|ipfs|ipld)\/)?([^/]+)(\/.*)?/;
function parseIpldPath(str) {
	const res = pathRegEx.exec(str);
	if (res == null) return null;
	return {
		namespace: res[2],
		cidOrFqdn: res[3],
		rest: res[4],
		address: res[0]
	};
}
//#endregion
//#region vendor/ipld-explorer-components/src/lib/guards.ts
function isNotNullish(value) {
	return value != null;
}
function isPBNode(value) {
	return isNotNullish(value) && typeof value === "object" && value.Data != null && value.Links != null;
}
//#endregion
//#region vendor/ipld-explorer-components/src/lib/get-codec-for-cid.ts
/**
* Resolve a path in a decoded object
*
* @see https://github.com/ipld/js-blockcodec-to-ipld-format/blob/13ad9bc518e232527078e27f0807ad3392b33698/src/index.js#L38-L55
* @param decodeFn
* @returns
*/
var resolveFn = (decodeFn) => (buf, path) => {
	let value = decodeFn(buf);
	const entries = path.split("/").filter((x) => x);
	while (entries.length > 0) {
		const entry = entries.shift();
		if (entry == null) throw new Error("Not found");
		value = value[entry];
		if (typeof value === "undefined") throw new Error("Not found");
		if (CID.asCID(value) != null) {
			const remainderPath = entries.length > 0 ? ensureLeadingSlash(entries.join("/")) : "";
			return {
				value,
				remainderPath
			};
		}
	}
	return {
		value,
		remainderPath: ""
	};
};
var codecResolverMap = { "dag-pb": async (node, path) => {
	if (!isPBNode(node)) throw new Error("node is not a PBNode");
	const pathSegments = path.split("/");
	let firstPathSegment = pathSegments.splice(1, 1)[0];
	if (firstPathSegment === "Links") firstPathSegment = `${firstPathSegment}/${pathSegments.splice(1, 1)[0]}`;
	let remainderPath = pathSegments.join("/");
	let link = node.Links.find((link) => link.Name === firstPathSegment);
	if (link == null && firstPathSegment?.includes("Links")) {
		const linkIndex = Number(firstPathSegment.split("/")[1]);
		link = node.Links[linkIndex];
	}
	let value = node;
	if (link != null) value = link;
	else remainderPath = [firstPathSegment, ...pathSegments].join("/").replace("//", "/");
	return {
		value,
		remainderPath
	};
} };
async function getCodecForCid(cid) {
	const codecCode = cid.code;
	if (codecCode === void 0) throw new Error(`CID codec code is undefined for CID '${cid.toString()}'`);
	const codecName = getCodecNameFromCode(codecCode);
	const codec = await codecImporter(codecCode);
	const decode = (bytes) => {
		if (codec.decode != null) return codec.decode(bytes);
		throw new Error(`codec ${codecCode}=${codecName} does not have a decode function`);
	};
	return {
		decode,
		resolve: async (path, bytes) => {
			if (codecResolverMap[codecName] != null) try {
				return await codecResolverMap[codecName](decode(bytes), path);
			} catch (err) {
				console.error(err);
				console.error("error resolving path for cid with codecResolverMap", cid, path);
			}
			try {
				return resolveFn(decode)(bytes, path);
			} catch (err) {
				console.error("error resolving path for cid with resolveFn", cid, path);
			}
			throw new Error(`codec ${codecCode}=${codecName} does not have a resolve function`);
		}
	};
}
//#endregion
//#region vendor/ipld-explorer-components/src/lib/errors.ts
var IpldExploreError = class extends Error {
	options;
	constructor(options) {
		super();
		this.options = options;
		this.name = this.constructor.name;
	}
	/**
	* See IpldExploreError for usage.
	* You must pass a t function that is registered with namespace 'explore' and keyPrefix 'errors'.
	*
	* @param t - the i18next-react t function
	* @returns the translated string
	* @example
	* const {t} = useTranslation('explore', { keyPrefix: 'errors' })
	* t('NameOfErrorClassThatExtendsIpldExploreError')
	*/
	toString(t) {
		return t(this.name, this.options);
	}
};
var BlockFetchTimeoutError = class extends IpldExploreError {};
//#endregion
//#region vendor/ipld-explorer-components/src/lib/get-raw-block.ts
/**
* Method for getting a raw block either with helia from trustless gateways or a local Kubo gateway.
*/
async function getRawBlock(helia, cid, timeout = 3e4) {
	const abortController = new AbortController();
	try {
		const timeoutId = setTimeout(() => {
			abortController.abort("Request timed out");
		}, timeout);
		const rawBlock = await helia.blockstore.get(cid, { signal: abortController.signal });
		clearTimeout(timeoutId);
		return rawBlock;
	} catch (err) {
		console.error("unable to get raw block", err);
		if (abortController.signal.aborted) throw new BlockFetchTimeoutError({ timeout: timeout / 1e3 });
		throw err;
	}
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/ipfs-unixfs/dist/src/errors.js
var InvalidTypeError = class InvalidTypeError extends Error {
	static name = "InvalidTypeError";
	static code = "ERR_INVALID_TYPE";
	name = InvalidTypeError.name;
	code = InvalidTypeError.code;
	constructor(message = "Invalid type") {
		super(message);
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/uint8arrays/dist/src/alloc.js
/**
* Returns a `Uint8Array` of the requested size. Referenced memory will
* be initialized to 0.
*/
function alloc$1(size = 0) {
	return new Uint8Array(size);
}
/**
* Where possible returns a Uint8Array of the requested size that references
* uninitialized memory. Only use if you are certain you will immediately
* overwrite every value in the returned `Uint8Array`.
*/
function allocUnsafe(size = 0) {
	return new Uint8Array(size);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/uint8-varint/dist/src/index.js
var N1 = Math.pow(2, 7);
var N2 = Math.pow(2, 14);
var N3 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
/** Most significant bit of a byte */
var MSB = 128;
/** Rest of the bits in a byte */
var REST = 127;
function encodingLength(value) {
	if (value < N1) return 1;
	if (value < N2) return 2;
	if (value < N3) return 3;
	if (value < N4) return 4;
	if (value < N5) return 5;
	if (value < N6) return 6;
	if (value < N7) return 7;
	if (Number.MAX_SAFE_INTEGER != null && value > Number.MAX_SAFE_INTEGER) throw new RangeError("Could not encode varint");
	return 8;
}
function encodeUint8Array(value, buf, offset = 0) {
	switch (encodingLength(value)) {
		case 8:
			buf[offset++] = value & 255 | MSB;
			value /= 128;
		case 7:
			buf[offset++] = value & 255 | MSB;
			value /= 128;
		case 6:
			buf[offset++] = value & 255 | MSB;
			value /= 128;
		case 5:
			buf[offset++] = value & 255 | MSB;
			value /= 128;
		case 4:
			buf[offset++] = value & 255 | MSB;
			value >>>= 7;
		case 3:
			buf[offset++] = value & 255 | MSB;
			value >>>= 7;
		case 2:
			buf[offset++] = value & 255 | MSB;
			value >>>= 7;
		case 1:
			buf[offset++] = value & 255;
			value >>>= 7;
			break;
		default: throw new Error("unreachable");
	}
	return buf;
}
function encodeUint8ArrayList(value, buf, offset = 0) {
	switch (encodingLength(value)) {
		case 8:
			buf.set(offset++, value & 255 | MSB);
			value /= 128;
		case 7:
			buf.set(offset++, value & 255 | MSB);
			value /= 128;
		case 6:
			buf.set(offset++, value & 255 | MSB);
			value /= 128;
		case 5:
			buf.set(offset++, value & 255 | MSB);
			value /= 128;
		case 4:
			buf.set(offset++, value & 255 | MSB);
			value >>>= 7;
		case 3:
			buf.set(offset++, value & 255 | MSB);
			value >>>= 7;
		case 2:
			buf.set(offset++, value & 255 | MSB);
			value >>>= 7;
		case 1:
			buf.set(offset++, value & 255);
			value >>>= 7;
			break;
		default: throw new Error("unreachable");
	}
	return buf;
}
function decodeUint8Array(buf, offset) {
	let b = buf[offset];
	let res = 0;
	res += b & REST;
	if (b < MSB) return res;
	b = buf[offset + 1];
	res += (b & REST) << 7;
	if (b < MSB) return res;
	b = buf[offset + 2];
	res += (b & REST) << 14;
	if (b < MSB) return res;
	b = buf[offset + 3];
	res += (b & REST) << 21;
	if (b < MSB) return res;
	b = buf[offset + 4];
	res += (b & REST) * N4;
	if (b < MSB) return res;
	b = buf[offset + 5];
	res += (b & REST) * N5;
	if (b < MSB) return res;
	b = buf[offset + 6];
	res += (b & REST) * N6;
	if (b < MSB) return res;
	b = buf[offset + 7];
	res += (b & REST) * N7;
	if (b < MSB) return res;
	throw new RangeError("Could not decode varint");
}
function decodeUint8ArrayList(buf, offset) {
	let b = buf.get(offset);
	let res = 0;
	res += b & REST;
	if (b < MSB) return res;
	b = buf.get(offset + 1);
	res += (b & REST) << 7;
	if (b < MSB) return res;
	b = buf.get(offset + 2);
	res += (b & REST) << 14;
	if (b < MSB) return res;
	b = buf.get(offset + 3);
	res += (b & REST) << 21;
	if (b < MSB) return res;
	b = buf.get(offset + 4);
	res += (b & REST) * N4;
	if (b < MSB) return res;
	b = buf.get(offset + 5);
	res += (b & REST) * N5;
	if (b < MSB) return res;
	b = buf.get(offset + 6);
	res += (b & REST) * N6;
	if (b < MSB) return res;
	b = buf.get(offset + 7);
	res += (b & REST) * N7;
	if (b < MSB) return res;
	throw new RangeError("Could not decode varint");
}
function encode(value, buf, offset = 0) {
	if (buf == null) buf = allocUnsafe(encodingLength(value));
	if (buf instanceof Uint8Array) return encodeUint8Array(value, buf, offset);
	else return encodeUint8ArrayList(value, buf, offset);
}
function decode(buf, offset = 0) {
	if (buf instanceof Uint8Array) return decodeUint8Array(buf, offset);
	else return decodeUint8ArrayList(buf, offset);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/protons-runtime/dist/src/utils/float.js
var f32 = new Float32Array([-0]);
var f8b = new Uint8Array(f32.buffer);
/**
* Writes a 32 bit float to a buffer using little endian byte order
*/
function writeFloatLE(val, buf, pos) {
	f32[0] = val;
	buf[pos] = f8b[0];
	buf[pos + 1] = f8b[1];
	buf[pos + 2] = f8b[2];
	buf[pos + 3] = f8b[3];
}
/**
* Reads a 32 bit float from a buffer using little endian byte order
*/
function readFloatLE(buf, pos) {
	f8b[0] = buf[pos];
	f8b[1] = buf[pos + 1];
	f8b[2] = buf[pos + 2];
	f8b[3] = buf[pos + 3];
	return f32[0];
}
var f64 = new Float64Array([-0]);
var d8b = new Uint8Array(f64.buffer);
/**
* Writes a 64 bit double to a buffer using little endian byte order
*/
function writeDoubleLE(val, buf, pos) {
	f64[0] = val;
	buf[pos] = d8b[0];
	buf[pos + 1] = d8b[1];
	buf[pos + 2] = d8b[2];
	buf[pos + 3] = d8b[3];
	buf[pos + 4] = d8b[4];
	buf[pos + 5] = d8b[5];
	buf[pos + 6] = d8b[6];
	buf[pos + 7] = d8b[7];
}
/**
* Reads a 64 bit double from a buffer using little endian byte order
*/
function readDoubleLE(buf, pos) {
	d8b[0] = buf[pos];
	d8b[1] = buf[pos + 1];
	d8b[2] = buf[pos + 2];
	d8b[3] = buf[pos + 3];
	d8b[4] = buf[pos + 4];
	d8b[5] = buf[pos + 5];
	d8b[6] = buf[pos + 6];
	d8b[7] = buf[pos + 7];
	return f64[0];
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/protons-runtime/dist/src/utils/longbits.js
var MAX_SAFE_NUMBER_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
var MIN_SAFE_NUMBER_INTEGER = BigInt(Number.MIN_SAFE_INTEGER);
/**
* Constructs new long bits.
*
* @classdesc Helper class for working with the low and high bits of a 64 bit value.
* @memberof util
* @function Object() { [native code] }
* @param {number} lo - Low 32 bits, unsigned
* @param {number} hi - High 32 bits, unsigned
*/
var LongBits = class LongBits {
	lo;
	hi;
	constructor(lo, hi) {
		/**
		* Low bits
		*/
		this.lo = lo | 0;
		/**
		* High bits
		*/
		this.hi = hi | 0;
	}
	/**
	* Converts this long bits to a possibly unsafe JavaScript number
	*/
	toNumber(unsigned = false) {
		if (!unsigned && this.hi >>> 31 > 0) {
			const lo = ~this.lo + 1 >>> 0;
			let hi = ~this.hi >>> 0;
			if (lo === 0) hi = hi + 1 >>> 0;
			return -(lo + hi * 4294967296);
		}
		return this.lo + this.hi * 4294967296;
	}
	/**
	* Converts this long bits to a bigint
	*/
	toBigInt(unsigned = false) {
		if (unsigned) return BigInt(this.lo >>> 0) + (BigInt(this.hi >>> 0) << 32n);
		if (this.hi >>> 31 !== 0) {
			const lo = ~this.lo + 1 >>> 0;
			let hi = ~this.hi >>> 0;
			if (lo === 0) hi = hi + 1 >>> 0;
			return -(BigInt(lo) + (BigInt(hi) << 32n));
		}
		return BigInt(this.lo >>> 0) + (BigInt(this.hi >>> 0) << 32n);
	}
	/**
	* Converts this long bits to a string
	*/
	toString(unsigned = false) {
		return this.toBigInt(unsigned).toString();
	}
	/**
	* Zig-zag encodes this long bits
	*/
	zzEncode() {
		const mask = this.hi >> 31;
		this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
		this.lo = (this.lo << 1 ^ mask) >>> 0;
		return this;
	}
	/**
	* Zig-zag decodes this long bits
	*/
	zzDecode() {
		const mask = -(this.lo & 1);
		this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
		this.hi = (this.hi >>> 1 ^ mask) >>> 0;
		return this;
	}
	/**
	* Calculates the length of this longbits when encoded as a varint.
	*/
	length() {
		const part0 = this.lo;
		const part1 = (this.lo >>> 28 | this.hi << 4) >>> 0;
		const part2 = this.hi >>> 24;
		return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
	}
	/**
	* Constructs new long bits from the specified number
	*/
	static fromBigInt(value) {
		if (value === 0n) return zero;
		if (value < MAX_SAFE_NUMBER_INTEGER && value > MIN_SAFE_NUMBER_INTEGER) return this.fromNumber(Number(value));
		const negative = value < 0n;
		if (negative) value = -value;
		let hi = value >> 32n;
		let lo = value - (hi << 32n);
		if (negative) {
			hi = ~hi | 0n;
			lo = ~lo | 0n;
			if (++lo > TWO_32) {
				lo = 0n;
				if (++hi > TWO_32) hi = 0n;
			}
		}
		return new LongBits(Number(lo), Number(hi));
	}
	/**
	* Constructs new long bits from the specified number
	*/
	static fromNumber(value) {
		if (value === 0) return zero;
		const sign = value < 0;
		if (sign) value = -value;
		let lo = value >>> 0;
		let hi = (value - lo) / 4294967296 >>> 0;
		if (sign) {
			hi = ~hi >>> 0;
			lo = ~lo >>> 0;
			if (++lo > 4294967295) {
				lo = 0;
				if (++hi > 4294967295) hi = 0;
			}
		}
		return new LongBits(lo, hi);
	}
	/**
	* Constructs new long bits from a number, long or string
	*/
	static from(value) {
		if (typeof value === "number") return LongBits.fromNumber(value);
		if (typeof value === "bigint") return LongBits.fromBigInt(value);
		if (typeof value === "string") return LongBits.fromBigInt(BigInt(value));
		return value.low != null || value.high != null ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
	}
};
var zero = new LongBits(0, 0);
zero.toBigInt = function() {
	return 0n;
};
zero.zzEncode = zero.zzDecode = function() {
	return this;
};
zero.length = function() {
	return 1;
};
var TWO_32 = 4294967296n;
//#endregion
//#region vendor/ipld-explorer-components/node_modules/protons-runtime/dist/src/utils/utf8.js
/**
* Calculates the UTF8 byte length of a string
*/
function length(string) {
	let len = 0;
	let c = 0;
	for (let i = 0; i < string.length; ++i) {
		c = string.charCodeAt(i);
		if (c < 128) len += 1;
		else if (c < 2048) len += 2;
		else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
			++i;
			len += 4;
		} else len += 3;
	}
	return len;
}
/**
* Reads UTF8 bytes as a string
*/
function read(buffer, start, end) {
	if (end - start < 1) return "";
	let parts;
	const chunk = [];
	let i = 0;
	let t;
	while (start < end) {
		t = buffer[start++];
		if (t < 128) chunk[i++] = t;
		else if (t > 191 && t < 224) chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
		else if (t > 239 && t < 365) {
			t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 65536;
			chunk[i++] = 55296 + (t >> 10);
			chunk[i++] = 56320 + (t & 1023);
		} else chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
		if (i > 8191) {
			(parts ?? (parts = [])).push(String.fromCharCode.apply(String, chunk));
			i = 0;
		}
	}
	if (parts != null) {
		if (i > 0) parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
		return parts.join("");
	}
	return String.fromCharCode.apply(String, chunk.slice(0, i));
}
/**
* Writes a string as UTF8 bytes
*/
function write(string, buffer, offset) {
	const start = offset;
	let c1;
	let c2;
	for (let i = 0; i < string.length; ++i) {
		c1 = string.charCodeAt(i);
		if (c1 < 128) buffer[offset++] = c1;
		else if (c1 < 2048) {
			buffer[offset++] = c1 >> 6 | 192;
			buffer[offset++] = c1 & 63 | 128;
		} else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
			c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
			++i;
			buffer[offset++] = c1 >> 18 | 240;
			buffer[offset++] = c1 >> 12 & 63 | 128;
			buffer[offset++] = c1 >> 6 & 63 | 128;
			buffer[offset++] = c1 & 63 | 128;
		} else {
			buffer[offset++] = c1 >> 12 | 224;
			buffer[offset++] = c1 >> 6 & 63 | 128;
			buffer[offset++] = c1 & 63 | 128;
		}
	}
	return offset - start;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/protons-runtime/dist/src/utils/reader.js
/* istanbul ignore next */
function indexOutOfRange(reader, writeLength) {
	return RangeError(`index out of range: ${reader.pos} + ${writeLength ?? 1} > ${reader.len}`);
}
function readFixed32End(buf, end) {
	return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
}
/**
* Constructs a new reader instance using the specified buffer.
*/
var Uint8ArrayReader = class {
	buf;
	pos;
	len;
	_slice = Uint8Array.prototype.subarray;
	constructor(buffer) {
		/**
		* Read buffer
		*/
		this.buf = buffer;
		/**
		* Read buffer position
		*/
		this.pos = 0;
		/**
		* Read buffer length
		*/
		this.len = buffer.length;
	}
	/**
	* Reads a varint as an unsigned 32 bit value
	*/
	uint32() {
		let value = 4294967295;
		value = (this.buf[this.pos] & 127) >>> 0;
		if (this.buf[this.pos++] < 128) return value;
		value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
		if (this.buf[this.pos++] < 128) return value;
		value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
		if (this.buf[this.pos++] < 128) return value;
		value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
		if (this.buf[this.pos++] < 128) return value;
		value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
		if (this.buf[this.pos++] < 128) return value;
		if ((this.pos += 5) > this.len) {
			this.pos = this.len;
			throw indexOutOfRange(this, 10);
		}
		return value;
	}
	/**
	* Reads a varint as a signed 32 bit value
	*/
	int32() {
		return this.uint32() | 0;
	}
	/**
	* Reads a zig-zag encoded varint as a signed 32 bit value
	*/
	sint32() {
		const value = this.uint32();
		return value >>> 1 ^ -(value & 1) | 0;
	}
	/**
	* Reads a varint as a boolean
	*/
	bool() {
		return this.uint32() !== 0;
	}
	/**
	* Reads fixed 32 bits as an unsigned 32 bit integer
	*/
	fixed32() {
		if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
		return readFixed32End(this.buf, this.pos += 4);
	}
	/**
	* Reads fixed 32 bits as a signed 32 bit integer
	*/
	sfixed32() {
		if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
		return readFixed32End(this.buf, this.pos += 4) | 0;
	}
	/**
	* Reads a float (32 bit) as a number
	*/
	float() {
		if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
		const value = readFloatLE(this.buf, this.pos);
		this.pos += 4;
		return value;
	}
	/**
	* Reads a double (64 bit float) as a number
	*/
	double() {
		/* istanbul ignore if */
		if (this.pos + 8 > this.len) throw indexOutOfRange(this, 4);
		const value = readDoubleLE(this.buf, this.pos);
		this.pos += 8;
		return value;
	}
	/**
	* Reads a sequence of bytes preceded by its length as a varint
	*/
	bytes() {
		const length = this.uint32();
		const start = this.pos;
		const end = this.pos + length;
		/* istanbul ignore if */
		if (end > this.len) throw indexOutOfRange(this, length);
		this.pos += length;
		return start === end ? /* @__PURE__ */ new Uint8Array(0) : this.buf.subarray(start, end);
	}
	/**
	* Reads a string preceded by its byte length as a varint
	*/
	string() {
		const bytes = this.bytes();
		return read(bytes, 0, bytes.length);
	}
	/**
	* Skips the specified number of bytes if specified, otherwise skips a varint
	*/
	skip(length) {
		if (typeof length === "number") {
			/* istanbul ignore if */
			if (this.pos + length > this.len) throw indexOutOfRange(this, length);
			this.pos += length;
		} else do
			/* istanbul ignore if */
			if (this.pos >= this.len) throw indexOutOfRange(this);
		while ((this.buf[this.pos++] & 128) !== 0);
		return this;
	}
	/**
	* Skips the next element of the specified wire type
	*/
	skipType(wireType) {
		switch (wireType) {
			case 0:
				this.skip();
				break;
			case 1:
				this.skip(8);
				break;
			case 2:
				this.skip(this.uint32());
				break;
			case 3:
				while ((wireType = this.uint32() & 7) !== 4) this.skipType(wireType);
				break;
			case 5:
				this.skip(4);
				break;
			/* istanbul ignore next */
			default: throw Error(`invalid wire type ${wireType} at offset ${this.pos}`);
		}
		return this;
	}
	readLongVarint() {
		const bits = new LongBits(0, 0);
		let i = 0;
		if (this.len - this.pos > 4) {
			for (; i < 4; ++i) {
				bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
				if (this.buf[this.pos++] < 128) return bits;
			}
			bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
			bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
			if (this.buf[this.pos++] < 128) return bits;
			i = 0;
		} else {
			for (; i < 3; ++i) {
				/* istanbul ignore if */
				if (this.pos >= this.len) throw indexOutOfRange(this);
				bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
				if (this.buf[this.pos++] < 128) return bits;
			}
			bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
			return bits;
		}
		if (this.len - this.pos > 4) for (; i < 5; ++i) {
			bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
			if (this.buf[this.pos++] < 128) return bits;
		}
		else for (; i < 5; ++i) {
			if (this.pos >= this.len) throw indexOutOfRange(this);
			bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
			if (this.buf[this.pos++] < 128) return bits;
		}
		throw Error("invalid varint encoding");
	}
	readFixed64() {
		if (this.pos + 8 > this.len) throw indexOutOfRange(this, 8);
		return new LongBits(readFixed32End(this.buf, this.pos += 4), readFixed32End(this.buf, this.pos += 4));
	}
	/**
	* Reads a varint as a signed 64 bit value
	*/
	int64() {
		return this.readLongVarint().toBigInt();
	}
	/**
	* Reads a varint as a signed 64 bit value returned as a possibly unsafe
	* JavaScript number
	*/
	int64Number() {
		return this.readLongVarint().toNumber();
	}
	/**
	* Reads a varint as a signed 64 bit value returned as a string
	*/
	int64String() {
		return this.readLongVarint().toString();
	}
	/**
	* Reads a varint as an unsigned 64 bit value
	*/
	uint64() {
		return this.readLongVarint().toBigInt(true);
	}
	/**
	* Reads a varint as an unsigned 64 bit value returned as a possibly unsafe
	* JavaScript number
	*/
	uint64Number() {
		const value = decodeUint8Array(this.buf, this.pos);
		this.pos += encodingLength(value);
		return value;
	}
	/**
	* Reads a varint as an unsigned 64 bit value returned as a string
	*/
	uint64String() {
		return this.readLongVarint().toString(true);
	}
	/**
	* Reads a zig-zag encoded varint as a signed 64 bit value
	*/
	sint64() {
		return this.readLongVarint().zzDecode().toBigInt();
	}
	/**
	* Reads a zig-zag encoded varint as a signed 64 bit value returned as a
	* possibly unsafe JavaScript number
	*/
	sint64Number() {
		return this.readLongVarint().zzDecode().toNumber();
	}
	/**
	* Reads a zig-zag encoded varint as a signed 64 bit value returned as a
	* string
	*/
	sint64String() {
		return this.readLongVarint().zzDecode().toString();
	}
	/**
	* Reads fixed 64 bits
	*/
	fixed64() {
		return this.readFixed64().toBigInt();
	}
	/**
	* Reads fixed 64 bits returned as a possibly unsafe JavaScript number
	*/
	fixed64Number() {
		return this.readFixed64().toNumber();
	}
	/**
	* Reads fixed 64 bits returned as a string
	*/
	fixed64String() {
		return this.readFixed64().toString();
	}
	/**
	* Reads zig-zag encoded fixed 64 bits
	*/
	sfixed64() {
		return this.readFixed64().toBigInt();
	}
	/**
	* Reads zig-zag encoded fixed 64 bits returned as a possibly unsafe
	* JavaScript number
	*/
	sfixed64Number() {
		return this.readFixed64().toNumber();
	}
	/**
	* Reads zig-zag encoded fixed 64 bits returned as a string
	*/
	sfixed64String() {
		return this.readFixed64().toString();
	}
};
function createReader(buf) {
	return new Uint8ArrayReader(buf instanceof Uint8Array ? buf : buf.subarray());
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/protons-runtime/dist/src/decode.js
function decodeMessage(buf, codec, opts) {
	const reader = createReader(buf);
	return codec.decode(reader, void 0, opts);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/uint8arrays/dist/src/util/bases.js
function createCodec$1(name, prefix, encode, decode) {
	return {
		name,
		prefix,
		encoder: {
			name,
			prefix,
			encode
		},
		decoder: { decode }
	};
}
var string$1 = createCodec$1("utf8", "u", (buf) => {
	return "u" + new TextDecoder("utf8").decode(buf);
}, (str) => {
	return new TextEncoder().encode(str.substring(1));
});
var ascii = createCodec$1("ascii", "a", (buf) => {
	let string = "a";
	for (let i = 0; i < buf.length; i++) string += String.fromCharCode(buf[i]);
	return string;
}, (str) => {
	str = str.substring(1);
	const buf = allocUnsafe(str.length);
	for (let i = 0; i < str.length; i++) buf[i] = str.charCodeAt(i);
	return buf;
});
var BASES = {
	utf8: string$1,
	"utf-8": string$1,
	hex: bases.base16,
	latin1: ascii,
	ascii,
	binary: ascii,
	...bases
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/uint8arrays/dist/src/from-string.js
/**
* Create a `Uint8Array` from the passed string
*
* Supports `utf8`, `utf-8`, `hex`, and any encoding supported by the multiformats module.
*
* Also `ascii` which is similar to node's 'binary' encoding.
*/
function fromString(string, encoding = "utf8") {
	const base = BASES[encoding];
	if (base == null) throw new Error(`Unsupported encoding "${encoding}"`);
	return base.decoder.decode(`${base.prefix}${string}`);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/protons-runtime/dist/src/utils/pool.js
/**
* A general purpose buffer pool
*/
function pool(size) {
	const SIZE = size ?? 8192;
	const MAX = SIZE >>> 1;
	let slab;
	let offset = SIZE;
	return function poolAlloc(size) {
		if (size < 1 || size > MAX) return allocUnsafe(size);
		if (offset + size > SIZE) {
			slab = allocUnsafe(SIZE);
			offset = 0;
		}
		const buf = slab.subarray(offset, offset += size);
		if ((offset & 7) !== 0) offset = (offset | 7) + 1;
		return buf;
	};
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/protons-runtime/dist/src/utils/writer.js
/**
* Constructs a new writer operation instance.
*
* @classdesc Scheduled writer operation
*/
var Op = class {
	/**
	* Function to call
	*/
	fn;
	/**
	* Value byte length
	*/
	len;
	/**
	* Next operation
	*/
	next;
	/**
	* Value to write
	*/
	val;
	constructor(fn, len, val) {
		this.fn = fn;
		this.len = len;
		this.next = void 0;
		this.val = val;
	}
};
/* istanbul ignore next */
function noop() {}
/**
* Constructs a new writer state instance
*/
var State = class {
	/**
	* Current head
	*/
	head;
	/**
	* Current tail
	*/
	tail;
	/**
	* Current buffer length
	*/
	len;
	/**
	* Next state
	*/
	next;
	constructor(writer) {
		this.head = writer.head;
		this.tail = writer.tail;
		this.len = writer.len;
		this.next = writer.states;
	}
};
var bufferPool = pool();
/**
* Allocates a buffer of the specified size
*/
function alloc(size) {
	if (globalThis.Buffer != null) return allocUnsafe(size);
	return bufferPool(size);
}
/**
* When a value is written, the writer calculates its byte length and puts it into a linked
* list of operations to perform when finish() is called. This both allows us to allocate
* buffers of the exact required size and reduces the amount of work we have to do compared
* to first calculating over objects and then encoding over objects. In our case, the encoding
* part is just a linked list walk calling operations with already prepared values.
*/
var Uint8ArrayWriter = class {
	/**
	* Current length
	*/
	len;
	/**
	* Operations head
	*/
	head;
	/**
	* Operations tail
	*/
	tail;
	/**
	* Linked forked states
	*/
	states;
	constructor() {
		this.len = 0;
		this.head = new Op(noop, 0, 0);
		this.tail = this.head;
		this.states = null;
	}
	/**
	* Pushes a new operation to the queue
	*/
	_push(fn, len, val) {
		this.tail = this.tail.next = new Op(fn, len, val);
		this.len += len;
		return this;
	}
	/**
	* Writes an unsigned 32 bit value as a varint
	*/
	uint32(value) {
		this.len += (this.tail = this.tail.next = new VarintOp((value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5, value)).len;
		return this;
	}
	/**
	* Writes a signed 32 bit value as a varint`
	*/
	int32(value) {
		return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
	}
	/**
	* Writes a 32 bit value as a varint, zig-zag encoded
	*/
	sint32(value) {
		return this.uint32((value << 1 ^ value >> 31) >>> 0);
	}
	/**
	* Writes an unsigned 64 bit value as a varint
	*/
	uint64(value) {
		const bits = LongBits.fromBigInt(value);
		return this._push(writeVarint64, bits.length(), bits);
	}
	/**
	* Writes an unsigned 64 bit value as a varint
	*/
	uint64Number(value) {
		return this._push(encodeUint8Array, encodingLength(value), value);
	}
	/**
	* Writes an unsigned 64 bit value as a varint
	*/
	uint64String(value) {
		return this.uint64(BigInt(value));
	}
	/**
	* Writes a signed 64 bit value as a varint
	*/
	int64(value) {
		return this.uint64(value);
	}
	/**
	* Writes a signed 64 bit value as a varint
	*/
	int64Number(value) {
		return this.uint64Number(value);
	}
	/**
	* Writes a signed 64 bit value as a varint
	*/
	int64String(value) {
		return this.uint64String(value);
	}
	/**
	* Writes a signed 64 bit value as a varint, zig-zag encoded
	*/
	sint64(value) {
		const bits = LongBits.fromBigInt(value).zzEncode();
		return this._push(writeVarint64, bits.length(), bits);
	}
	/**
	* Writes a signed 64 bit value as a varint, zig-zag encoded
	*/
	sint64Number(value) {
		const bits = LongBits.fromNumber(value).zzEncode();
		return this._push(writeVarint64, bits.length(), bits);
	}
	/**
	* Writes a signed 64 bit value as a varint, zig-zag encoded
	*/
	sint64String(value) {
		return this.sint64(BigInt(value));
	}
	/**
	* Writes a boolish value as a varint
	*/
	bool(value) {
		return this._push(writeByte, 1, value ? 1 : 0);
	}
	/**
	* Writes an unsigned 32 bit value as fixed 32 bits
	*/
	fixed32(value) {
		return this._push(writeFixed32, 4, value >>> 0);
	}
	/**
	* Writes a signed 32 bit value as fixed 32 bits
	*/
	sfixed32(value) {
		return this.fixed32(value);
	}
	/**
	* Writes an unsigned 64 bit value as fixed 64 bits
	*/
	fixed64(value) {
		const bits = LongBits.fromBigInt(value);
		return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
	}
	/**
	* Writes an unsigned 64 bit value as fixed 64 bits
	*/
	fixed64Number(value) {
		const bits = LongBits.fromNumber(value);
		return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
	}
	/**
	* Writes an unsigned 64 bit value as fixed 64 bits
	*/
	fixed64String(value) {
		return this.fixed64(BigInt(value));
	}
	/**
	* Writes a signed 64 bit value as fixed 64 bits
	*/
	sfixed64(value) {
		return this.fixed64(value);
	}
	/**
	* Writes a signed 64 bit value as fixed 64 bits
	*/
	sfixed64Number(value) {
		return this.fixed64Number(value);
	}
	/**
	* Writes a signed 64 bit value as fixed 64 bits
	*/
	sfixed64String(value) {
		return this.fixed64String(value);
	}
	/**
	* Writes a float (32 bit)
	*/
	float(value) {
		return this._push(writeFloatLE, 4, value);
	}
	/**
	* Writes a double (64 bit float).
	*
	* @function
	* @param {number} value - Value to write
	* @returns {Writer} `this`
	*/
	double(value) {
		return this._push(writeDoubleLE, 8, value);
	}
	/**
	* Writes a sequence of bytes
	*/
	bytes(value) {
		const len = value.length >>> 0;
		if (len === 0) return this._push(writeByte, 1, 0);
		return this.uint32(len)._push(writeBytes, len, value);
	}
	/**
	* Writes a string
	*/
	string(value) {
		const len = length(value);
		return len !== 0 ? this.uint32(len)._push(write, len, value) : this._push(writeByte, 1, 0);
	}
	/**
	* Forks this writer's state by pushing it to a stack.
	* Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
	*/
	fork() {
		this.states = new State(this);
		this.head = this.tail = new Op(noop, 0, 0);
		this.len = 0;
		return this;
	}
	/**
	* Resets this instance to the last state
	*/
	reset() {
		if (this.states != null) {
			this.head = this.states.head;
			this.tail = this.states.tail;
			this.len = this.states.len;
			this.states = this.states.next;
		} else {
			this.head = this.tail = new Op(noop, 0, 0);
			this.len = 0;
		}
		return this;
	}
	/**
	* Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
	*/
	ldelim() {
		const head = this.head;
		const tail = this.tail;
		const len = this.len;
		this.reset().uint32(len);
		if (len !== 0) {
			this.tail.next = head.next;
			this.tail = tail;
			this.len += len;
		}
		return this;
	}
	/**
	* Finishes the write operation
	*/
	finish() {
		let head = this.head.next;
		const buf = alloc(this.len);
		let pos = 0;
		while (head != null) {
			head.fn(head.val, buf, pos);
			pos += head.len;
			head = head.next;
		}
		return buf;
	}
};
function writeByte(val, buf, pos) {
	buf[pos] = val & 255;
}
function writeVarint32(val, buf, pos) {
	while (val > 127) {
		buf[pos++] = val & 127 | 128;
		val >>>= 7;
	}
	buf[pos] = val;
}
/**
* Constructs a new varint writer operation instance.
*
* @classdesc Scheduled varint writer operation
*/
var VarintOp = class extends Op {
	next;
	constructor(len, val) {
		super(writeVarint32, len, val);
		this.next = void 0;
	}
};
function writeVarint64(val, buf, pos) {
	while (val.hi !== 0) {
		buf[pos++] = val.lo & 127 | 128;
		val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
		val.hi >>>= 7;
	}
	while (val.lo > 127) {
		buf[pos++] = val.lo & 127 | 128;
		val.lo = val.lo >>> 7;
	}
	buf[pos++] = val.lo;
}
function writeFixed32(val, buf, pos) {
	buf[pos] = val & 255;
	buf[pos + 1] = val >>> 8 & 255;
	buf[pos + 2] = val >>> 16 & 255;
	buf[pos + 3] = val >>> 24;
}
function writeBytes(val, buf, pos) {
	buf.set(val, pos);
}
if (globalThis.Buffer != null) {
	Uint8ArrayWriter.prototype.bytes = function(value) {
		const len = value.length >>> 0;
		this.uint32(len);
		if (len > 0) this._push(writeBytesBuffer, len, value);
		return this;
	};
	Uint8ArrayWriter.prototype.string = function(value) {
		const len = globalThis.Buffer.byteLength(value);
		this.uint32(len);
		if (len > 0) this._push(writeStringBuffer, len, value);
		return this;
	};
}
function writeBytesBuffer(val, buf, pos) {
	buf.set(val, pos);
}
function writeStringBuffer(val, buf, pos) {
	if (val.length < 40) write(val, buf, pos);
	else if (buf.utf8Write != null) buf.utf8Write(val, pos);
	else buf.set(fromString(val), pos);
}
/**
* Creates a new writer
*/
function createWriter() {
	return new Uint8ArrayWriter();
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/protons-runtime/dist/src/encode.js
function encodeMessage(message, codec) {
	const w = createWriter();
	codec.encode(message, w, { lengthDelimited: false });
	return w.finish();
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/protons-runtime/dist/src/codec.js
var CODEC_TYPES;
(function(CODEC_TYPES) {
	CODEC_TYPES[CODEC_TYPES["VARINT"] = 0] = "VARINT";
	CODEC_TYPES[CODEC_TYPES["BIT64"] = 1] = "BIT64";
	CODEC_TYPES[CODEC_TYPES["LENGTH_DELIMITED"] = 2] = "LENGTH_DELIMITED";
	CODEC_TYPES[CODEC_TYPES["START_GROUP"] = 3] = "START_GROUP";
	CODEC_TYPES[CODEC_TYPES["END_GROUP"] = 4] = "END_GROUP";
	CODEC_TYPES[CODEC_TYPES["BIT32"] = 5] = "BIT32";
})(CODEC_TYPES || (CODEC_TYPES = {}));
function createCodec(name, type, encode, decode) {
	return {
		name,
		type,
		encode,
		decode
	};
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/protons-runtime/dist/src/codecs/enum.js
function enumeration(v) {
	function findValue(val) {
		if (v[val.toString()] == null) throw new Error("Invalid enum value");
		return v[val];
	}
	return createCodec("enum", CODEC_TYPES.VARINT, function enumEncode(val, writer) {
		const enumValue = findValue(val);
		writer.int32(enumValue);
	}, function enumDecode(reader) {
		return findValue(reader.int32());
	});
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/protons-runtime/dist/src/codecs/message.js
function message(encode, decode) {
	return createCodec("message", CODEC_TYPES.LENGTH_DELIMITED, encode, decode);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/ipfs-unixfs/dist/src/unixfs.js
var Data;
(function(Data) {
	(function(DataType) {
		DataType["Raw"] = "Raw";
		DataType["Directory"] = "Directory";
		DataType["File"] = "File";
		DataType["Metadata"] = "Metadata";
		DataType["Symlink"] = "Symlink";
		DataType["HAMTShard"] = "HAMTShard";
	})(Data.DataType || (Data.DataType = {}));
	let __DataTypeValues;
	(function(__DataTypeValues) {
		__DataTypeValues[__DataTypeValues["Raw"] = 0] = "Raw";
		__DataTypeValues[__DataTypeValues["Directory"] = 1] = "Directory";
		__DataTypeValues[__DataTypeValues["File"] = 2] = "File";
		__DataTypeValues[__DataTypeValues["Metadata"] = 3] = "Metadata";
		__DataTypeValues[__DataTypeValues["Symlink"] = 4] = "Symlink";
		__DataTypeValues[__DataTypeValues["HAMTShard"] = 5] = "HAMTShard";
	})(__DataTypeValues || (__DataTypeValues = {}));
	(function(DataType) {
		DataType.codec = () => {
			return enumeration(__DataTypeValues);
		};
	})(Data.DataType || (Data.DataType = {}));
	let _codec;
	Data.codec = () => {
		if (_codec == null) _codec = message((obj, w, opts = {}) => {
			if (opts.lengthDelimited !== false) w.fork();
			if (obj.Type != null) {
				w.uint32(8);
				Data.DataType.codec().encode(obj.Type, w);
			}
			if (obj.Data != null) {
				w.uint32(18);
				w.bytes(obj.Data);
			}
			if (obj.filesize != null) {
				w.uint32(24);
				w.uint64(obj.filesize);
			}
			if (obj.blocksizes != null) for (const value of obj.blocksizes) {
				w.uint32(32);
				w.uint64(value);
			}
			if (obj.hashType != null) {
				w.uint32(40);
				w.uint64(obj.hashType);
			}
			if (obj.fanout != null) {
				w.uint32(48);
				w.uint64(obj.fanout);
			}
			if (obj.mode != null) {
				w.uint32(56);
				w.uint32(obj.mode);
			}
			if (obj.mtime != null) {
				w.uint32(66);
				UnixTime.codec().encode(obj.mtime, w);
			}
			if (opts.lengthDelimited !== false) w.ldelim();
		}, (reader, length) => {
			const obj = { blocksizes: [] };
			const end = length == null ? reader.len : reader.pos + length;
			while (reader.pos < end) {
				const tag = reader.uint32();
				switch (tag >>> 3) {
					case 1:
						obj.Type = Data.DataType.codec().decode(reader);
						break;
					case 2:
						obj.Data = reader.bytes();
						break;
					case 3:
						obj.filesize = reader.uint64();
						break;
					case 4:
						obj.blocksizes.push(reader.uint64());
						break;
					case 5:
						obj.hashType = reader.uint64();
						break;
					case 6:
						obj.fanout = reader.uint64();
						break;
					case 7:
						obj.mode = reader.uint32();
						break;
					case 8:
						obj.mtime = UnixTime.codec().decode(reader, reader.uint32());
						break;
					default: reader.skipType(tag & 7);
				}
			}
			return obj;
		});
		return _codec;
	};
	Data.encode = (obj) => {
		return encodeMessage(obj, Data.codec());
	};
	Data.decode = (buf) => {
		return decodeMessage(buf, Data.codec());
	};
})(Data || (Data = {}));
var UnixTime;
(function(UnixTime) {
	let _codec;
	UnixTime.codec = () => {
		if (_codec == null) _codec = message((obj, w, opts = {}) => {
			if (opts.lengthDelimited !== false) w.fork();
			if (obj.Seconds != null) {
				w.uint32(8);
				w.int64(obj.Seconds);
			}
			if (obj.FractionalNanoseconds != null) {
				w.uint32(21);
				w.fixed32(obj.FractionalNanoseconds);
			}
			if (opts.lengthDelimited !== false) w.ldelim();
		}, (reader, length) => {
			const obj = {};
			const end = length == null ? reader.len : reader.pos + length;
			while (reader.pos < end) {
				const tag = reader.uint32();
				switch (tag >>> 3) {
					case 1:
						obj.Seconds = reader.int64();
						break;
					case 2:
						obj.FractionalNanoseconds = reader.fixed32();
						break;
					default: reader.skipType(tag & 7);
				}
			}
			return obj;
		});
		return _codec;
	};
	UnixTime.encode = (obj) => {
		return encodeMessage(obj, UnixTime.codec());
	};
	UnixTime.decode = (buf) => {
		return decodeMessage(buf, UnixTime.codec());
	};
})(UnixTime || (UnixTime = {}));
var Metadata;
(function(Metadata) {
	let _codec;
	Metadata.codec = () => {
		if (_codec == null) _codec = message((obj, w, opts = {}) => {
			if (opts.lengthDelimited !== false) w.fork();
			if (obj.MimeType != null) {
				w.uint32(10);
				w.string(obj.MimeType);
			}
			if (opts.lengthDelimited !== false) w.ldelim();
		}, (reader, length) => {
			const obj = {};
			const end = length == null ? reader.len : reader.pos + length;
			while (reader.pos < end) {
				const tag = reader.uint32();
				switch (tag >>> 3) {
					case 1:
						obj.MimeType = reader.string();
						break;
					default: reader.skipType(tag & 7);
				}
			}
			return obj;
		});
		return _codec;
	};
	Metadata.encode = (obj) => {
		return encodeMessage(obj, Metadata.codec());
	};
	Metadata.decode = (buf) => {
		return decodeMessage(buf, Metadata.codec());
	};
})(Metadata || (Metadata = {}));
//#endregion
//#region vendor/ipld-explorer-components/node_modules/ipfs-unixfs/dist/src/index.js
/**
* @packageDocumentation
*
* This module contains the protobuf definition of the UnixFS data structure found at the root of all UnixFS DAGs.
*
* The UnixFS spec can be found in the [ipfs/specs repository](http://github.com/ipfs/specs)
*
* @example Create a file composed of several blocks
*
* ```JavaScript
* const data = new UnixFS({ type: 'file' })
* data.addBlockSize(256) // add the size of each block
* data.addBlockSize(256)
* // ...
* ```
*
* @example Create a directory that contains several files
*
* Creating a directory that contains several files is achieve by creating a unixfs element that identifies a MerkleDAG node as a directory. The links of that MerkleDAG node are the files that are contained in this directory.
*
* ```JavaScript
* const data = new UnixFS({ type: 'directory' })
* ```
*
* @example Create an unixfs Data element
*
* ```JavaScript
* const data = new UnixFS([options])
* ```
*
* `options` is an optional object argument that might include the following keys:
*
* - type (string, default `file`): The type of UnixFS entry.  Can be:
*   - `raw`
*   - `directory`
*   - `file`
*   - `metadata`
*   - `symlink`
*   - `hamt-sharded-directory`
* - data (Uint8Array): The optional data field for this node
* - blockSizes (Array, default: `[]`): If this is a `file` node that is made up of multiple blocks, `blockSizes` is a list numbers that represent the size of the file chunks stored in each child node. It is used to calculate the total file size.
* - mode (Number, default `0644` for files, `0755` for directories/hamt-sharded-directories) file mode
* - mtime (`Date`, `{ secs, nsecs }`, `{ Seconds, FractionalNanoseconds }`, `[ secs, nsecs ]`): The modification time of this node
*
* @example Add and remove a block size to the block size list
*
* ```JavaScript
* data.addBlockSize(<size in bytes>)
* ```
*
* ```JavaScript
* data.removeBlockSize(<index>)
* ```
*
* @example Get total fileSize
*
* ```JavaScript
* data.fileSize() // => size in bytes
* ```
*
* @example Marshal and unmarshal
*
* ```javascript
* const marshaled = data.marshal()
* const unmarshaled = Unixfs.unmarshal(marshaled)
* ```
*
* @example Is this UnixFS entry a directory?
*
* ```JavaScript
* const dir = new Data({ type: 'directory' })
* dir.isDirectory() // true
*
* const file = new Data({ type: 'file' })
* file.isDirectory() // false
* ```
*
* @example Has an mtime been set?
*
* If no modification time has been set, no `mtime` property will be present on the `Data` instance:
*
* ```JavaScript
* const file = new Data({ type: 'file' })
* file.mtime // undefined
*
* Object.prototype.hasOwnProperty.call(file, 'mtime') // false
*
* const dir = new Data({ type: 'dir', mtime: new Date() })
* dir.mtime // { secs: Number, nsecs: Number }
* ```
*/
var types = {
	Raw: "raw",
	Directory: "directory",
	File: "file",
	Metadata: "metadata",
	Symlink: "symlink",
	HAMTShard: "hamt-sharded-directory"
};
var dirTypes = ["directory", "hamt-sharded-directory"];
var DEFAULT_FILE_MODE = parseInt("0644", 8);
var DEFAULT_DIRECTORY_MODE = parseInt("0755", 8);
var UnixFS = class UnixFS {
	/**
	* Decode from protobuf https://github.com/ipfs/specs/blob/master/UNIXFS.md
	*/
	static unmarshal(marshaled) {
		const message = Data.decode(marshaled);
		const data = new UnixFS({
			type: types[message.Type != null ? message.Type.toString() : "File"],
			data: message.Data,
			blockSizes: message.blocksizes,
			mode: message.mode,
			mtime: message.mtime != null ? {
				secs: message.mtime.Seconds ?? 0n,
				nsecs: message.mtime.FractionalNanoseconds
			} : void 0,
			fanout: message.fanout
		});
		data._originalMode = message.mode ?? 0;
		return data;
	}
	type;
	data;
	blockSizes;
	hashType;
	fanout;
	mtime;
	_mode;
	_originalMode;
	constructor(options = { type: "file" }) {
		const { type, data, blockSizes, hashType, fanout, mtime, mode } = options;
		if (type != null && !Object.values(types).includes(type)) throw new InvalidTypeError("Type: " + type + " is not valid");
		this.type = type ?? "file";
		this.data = data;
		this.hashType = hashType;
		this.fanout = fanout;
		this.blockSizes = blockSizes ?? [];
		this._originalMode = 0;
		this.mode = mode;
		this.mtime = mtime;
	}
	set mode(mode) {
		if (mode == null) this._mode = this.isDirectory() ? DEFAULT_DIRECTORY_MODE : DEFAULT_FILE_MODE;
		else this._mode = mode & 4095;
	}
	get mode() {
		return this._mode;
	}
	isDirectory() {
		return dirTypes.includes(this.type);
	}
	addBlockSize(size) {
		this.blockSizes.push(size);
	}
	removeBlockSize(index) {
		this.blockSizes.splice(index, 1);
	}
	/**
	* Returns `0n` for directories or `data.length + sum(blockSizes)` for everything else
	*/
	fileSize() {
		if (this.isDirectory()) return 0n;
		let sum = 0n;
		this.blockSizes.forEach((size) => {
			sum += size;
		});
		if (this.data != null) sum += BigInt(this.data.length);
		return sum;
	}
	/**
	* encode to protobuf Uint8Array
	*/
	marshal() {
		let type;
		switch (this.type) {
			case "raw":
				type = Data.DataType.Raw;
				break;
			case "directory":
				type = Data.DataType.Directory;
				break;
			case "file":
				type = Data.DataType.File;
				break;
			case "metadata":
				type = Data.DataType.Metadata;
				break;
			case "symlink":
				type = Data.DataType.Symlink;
				break;
			case "hamt-sharded-directory":
				type = Data.DataType.HAMTShard;
				break;
			default: throw new InvalidTypeError(`Type: ${type} is not valid`);
		}
		let data = this.data;
		if (this.data == null || this.data.length === 0) data = void 0;
		let mode;
		if (this.mode != null) {
			mode = this._originalMode & 4294963200 | (this.mode ?? 0);
			if (mode === DEFAULT_FILE_MODE && !this.isDirectory()) mode = void 0;
			if (mode === DEFAULT_DIRECTORY_MODE && this.isDirectory()) mode = void 0;
		}
		let mtime;
		if (this.mtime != null) mtime = {
			Seconds: this.mtime.secs,
			FractionalNanoseconds: this.mtime.nsecs
		};
		return Data.encode({
			Type: type,
			Data: data,
			filesize: this.isDirectory() ? void 0 : this.fileSize(),
			blocksizes: this.blockSizes,
			hashType: this.hashType,
			fanout: this.fanout,
			mode,
			mtime
		});
	}
};
//#endregion
//#region vendor/ipld-explorer-components/src/lib/normalise-dag-node.ts
function isDagPbNode(node, cid) {
	return getCodeOrNull(cid) === 112;
}
/**
* Provide a uniform shape for all^ node types.
*
* Spare the rest of the codebase from having to cope with all possible node
* shapes.
*
* ^: currently dag-cbor and dag-pb are supported.
*
* @function normaliseDagNode
* @param {dagNode|import('@ipld/dag-pb').PBNode} node - the `value` prop from `ipfs.dag.get` response.
* @param {string} cidStr - the cid string passed to `ipfs.dag.get`
* @returns {import('../types').NormalizedDagNode}
*/
function normaliseDagNode(node, cidStr) {
	const code$6 = getCodeOrNull(cidStr);
	if (isDagPbNode(node, cidStr)) return normaliseDagPb(node, cidStr, 112);
	return normaliseDagCbor(node, cidStr, code$6 ?? 113);
}
/**
* Normalize links and add type info. Add unixfs info where available
*/
function normaliseDagPb(node, cid, type) {
	const cidStr = toCidStrOrNull(cid);
	if (cidStr == null) throw new Error(`cidStr is null for cid: ${cid}`);
	let format = "non-unixfs";
	const data = node.Data;
	if (data != null) try {
		const unixFsObj = UnixFS.unmarshal(data);
		const { type, data: unixFsData, blockSizes } = unixFsObj;
		format = "unixfs";
		return {
			cid: cidStr,
			type,
			data: {
				type,
				data: unixFsData,
				blockSizes
			},
			links: normaliseDagPbLinks(node.Links, cid),
			size: unixFsObj.fileSize(),
			format
		};
	} catch (err) {}
	return {
		cid: cidStr,
		type,
		data,
		links: normaliseDagPbLinks(node.Links, cid),
		format
	};
}
/**
* Convert DagLink shape into normalized form that can be used interchangeably
* with links found in dag-cbor
*/
function normaliseDagPbLinks(links, sourceCid) {
	return links.map((link, index) => ({
		path: isTruthy(link.Name) ? link.Name : `Links/${index}`,
		source: sourceCid,
		target: toCidStrOrNull(link.Hash) ?? "",
		size: BigInt(link.Tsize ?? 0),
		index
	}));
}
/**
* Find links and add type and cid info
*
* @function normaliseDagCbor
* @param {import('../types').NormalizedDagNode['data']} data - The data object
* @param {string} cid - The string representation of the CID
* @param {number} code - multicodec code, see https://github.com/multiformats/multicodec/blob/master/table.csv
* @returns {import('../types').NormalizedDagNode}
*/
function normaliseDagCbor(data, cid, code) {
	const links = findAndReplaceDagCborLinks(data, cid);
	return {
		cid,
		type: code,
		data,
		links,
		size: links.reduce((acc, { size }) => acc + size, BigInt(0)),
		format: "unknown"
	};
}
function isPlainObjectOrArray(obj) {
	return obj !== null && typeof obj === "object" && !(obj instanceof ArrayBuffer) && !ArrayBuffer.isView(obj) && !(typeof obj === "string");
}
/**
* This should be called after `isPlainObjectOrArray` to avoid type errors.
*/
function isDagCborNodeObject(obj) {
	return Object.keys(obj).length === 1 && obj["/"] != null;
}
/**
* A valid IPLD link in a dag-cbor node is an object with single "/" property.
*/
function findAndReplaceDagCborLinks(obj, sourceCid, path = "") {
	if (!isPlainObjectOrArray(obj)) return [];
	const cid = toCidOrNull(obj);
	if (typeof obj === "string" || cid != null) {
		if (cid != null) return [{
			path,
			source: sourceCid,
			target: cid.toString(),
			size: BigInt(0),
			index: 0
		}];
		return [];
	}
	if (Array.isArray(obj)) {
		if (obj.length === 0) return [];
		return obj.map((val, i) => findAndReplaceDagCborLinks(val, sourceCid, path != null ? `${path}/${i}` : `${i}`)).reduce((a, b) => a.concat(b)).filter((a) => Boolean(a));
	}
	const keys = Object.keys(obj);
	if (isDagCborNodeObject(obj)) {
		const targetCid = toCidOrNull(obj["/"]);
		if (targetCid == null) return [];
		const target = targetCid.toString();
		obj["/"] = target;
		return [{
			path,
			source: sourceCid,
			target,
			size: BigInt(0),
			index: 0
		}];
	}
	if (keys.length > 0) return keys.map((key) => findAndReplaceDagCborLinks(obj[key], sourceCid, isTruthy(path) ? `${path}/${key}` : `${key}`)).reduce((a, b) => a.concat(b)).filter((a) => Boolean(a));
	else return [];
}
//#endregion
//#region vendor/ipld-explorer-components/src/lib/resolve-ipld-path.ts
/**
* Walk an IPLD path to find all the nodes and path boundaries it traverses.
*
* Normalizes nodes into a common structure:
*
* ```js
* { cid: String, type: 'dag-cbor' | 'dag-pb' | 'git-raw' | ..., data: *, links: [{cid, name}] }
* ```
*
* Path boundaries capture the source and target cid where a path traverses a link:
*
* ```js
* { linkPath: 'a/b', source: `zdpHash1` target: `zdpHash2`' }
* ```
*
* Usage:
* ```js
* const res = resolveIpldPath(getHelia, 'zdpuHash' '/favourites/0/a/css')
* const {targetNode, canonicalPath, localPath, nodes, pathBoundaries} = res
* ```
* Where:
* - `targetNode` is the normalised node that the path lands in.
* - `canonicalPath` is the shortest cid + path that can be used to locate the targetNode
* - `localPath` is the tail part of the path that is local to the targetNode. May be ''
* - `nodes` is the array of nodes that the path traverses.
* - `pathBoundaries` is the array of links that the path traverses.
*/
async function resolveIpldPath(helia, sourceCid, path, nodes = [], pathBoundaries = []) {
	const { value, remainderPath } = await ipldGetNodeAndRemainder(helia, sourceCid, path);
	if (sourceCid == null) {
		console.trace("sourceCid is null");
		throw new Error("sourceCid is null");
	}
	const sourceCidStr = sourceCid.toString();
	const node = normaliseDagNode(value, sourceCidStr);
	nodes.push(node);
	const link = findLink(node, findLinkPath(path, remainderPath));
	if (link != null) {
		pathBoundaries.push(link);
		return resolveIpldPath(helia, link.target, remainderPath, nodes, pathBoundaries);
	}
	return {
		targetNode: node,
		canonicalPath: path != null ? `${sourceCidStr}${path}` : sourceCidStr,
		localPath: path,
		nodes,
		pathBoundaries
	};
}
async function ipldGetNodeAndRemainder(helia, sourceCid, path) {
	if (sourceCid == null) throw new Error("sourceCid is null");
	let cidInstance = CID.asCID(sourceCid);
	if (cidInstance === null) cidInstance = CID.parse(sourceCid);
	const codecWrapper = await getCodecForCid(cidInstance);
	const encodedValue = await getRawBlock(helia, cidInstance);
	const value = codecWrapper.decode(encodedValue);
	const codecWrapperResolveResult = await codecWrapper.resolve(isTruthy(path) ? path : "/", encodedValue);
	const resolveValue = {};
	const { remainderPath } = codecWrapperResolveResult;
	if (resolveValue?.Hash != null) return ipldGetNodeAndRemainder(helia, value.Hash, remainderPath);
	return {
		value,
		remainderPath
	};
}
/**
* Find the link object that matches linkPath
*
* @param {import('./normalise-dag-node').NormalizedDagNode} node - a `normalisedDagNode`
* @param {string} linkPath - an IPLD path string
* @returns {import('./normalise-dag-node').NormalizedDagLink} the link object for `linkPath`
*/
function findLink(node, linkPath) {
	if (isFalsy(linkPath)) return null;
	if (isFalsy(node)) return null;
	const { links } = node;
	return links.find((link) => link.path === linkPath) ?? null;
}
function findLinkPath(fullPath, remainderPath) {
	if (isFalsy(fullPath) || fullPath === "/") return null;
	if (isFalsy(remainderPath)) return trimSlashes(fullPath);
	if (!fullPath.endsWith(remainderPath)) throw new Error(`Requested IPLD path should end with the remainder path: fullPath=${fullPath}, remainderPath=${remainderPath}`);
	return trimSlashes(fullPath.substring(0, fullPath.length - remainderPath.length));
}
function trimSlashes(str) {
	if (str.startsWith("/")) str = str.substring(1);
	if (str.endsWith("/")) str = str.substring(0, str.length - 1);
	return str;
}
var package_default = {
	name: "ipld-explorer-components",
	description: "React components for https://explore.ipld.io",
	license: "Apache-2.0 OR MIT",
	author: "olizilla",
	version: "8.1.3-react19.1",
	"private": true,
	type: "module",
	repository: {
		"type": "git",
		"url": "git+https://github.com/ipfs/ipld-explorer-components.git"
	},
	engines: { "node": "^22.22.2 || ^24.15.0 || >=26.0.0" },
	exports: {
		".": {
			"types": "./src/index.ts",
			"import": "./dist/index.js"
		},
		"./providers": {
			"types": "./src/providers/index.ts",
			"import": "./dist/providers.js"
		},
		"./pages": {
			"types": "./src/pages.ts",
			"import": "./dist/pages.js"
		},
		"./pages/start-exploring": {
			"types": "./src/components/StartExploringPage.tsx",
			"import": "./dist/start-exploring.js"
		},
		"./forms": {
			"types": "./src/forms.ts",
			"import": "./dist/forms.js"
		},
		"./css": "./dist/style.css"
	},
	files: [
		"src",
		"public",
		"LICENSE",
		"LICENSE-MIT",
		"LICENSE-APACHE",
		"FORK.md",
		"provenance.json",
		"upstream",
		"patches",
		"scripts",
		"test",
		"dist",
		"package-lock.json"
	],
	sideEffects: ["**/*.css"],
	peerDependencies: {
		"i18next": "^23.15.2",
		"i18next-browser-languagedetector": "^8.0.0",
		"i18next-http-backend": "^2.6.2",
		"i18next-icu": "^2.3.0",
		"ipfs-css": "^1.4.0",
		"react": "19.3.1",
		"react-dom": "19.3.1",
		"react-i18next": "^15.0.2",
		"tachyons": "^4.12.0",
		"react-joyride": "3.2.0"
	},
	devDependencies: {
		"@helia/block-brokers": "4.0.0",
		"@helia/http": "2.0.0",
		"@helia/interface": "5.0.0",
		"@helia/routers": "2.0.0",
		"@ipld/car": "5.3.2",
		"@ipld/dag-cbor": "9.2.1",
		"@ipld/dag-json": "10.2.2",
		"@ipld/dag-pb": "4.1.2",
		"@multiformats/sha3": "3.0.2",
		"cytoscape": "3.30.2",
		"cytoscape-dagre": "2.5.0",
		"dag-jose": "5.1.1",
		"filesize": "10.1.6",
		"hash-wasm": "4.11.0",
		"i18next-chained-backend": "4.6.2",
		"i18next-localstorage-backend": "4.2.0",
		"ipfs-unixfs": "11.2.0",
		"multiformats": "13.3.0",
		"stream-to-it": "1.0.1",
		"react-inspector": "9.0.0"
	},
	scripts: { "build:artifact": "node scripts/build-artifact.mjs" },
	overrides: {
		"@babel/runtime": "7.25.7",
		"@chainsafe/is-ip": "2.0.2",
		"@chainsafe/netmask": "2.0.0",
		"@helia/bitswap": "2.0.0",
		"@helia/block-brokers": "4.0.0",
		"@helia/delegated-routing-v1-http-api-client": "4.1.0",
		"@helia/http": "2.0.0",
		"@helia/interface": "5.0.0",
		"@helia/routers": "2.0.0",
		"@helia/utils": "1.0.0",
		"@ipld/car": "5.3.2",
		"@ipld/dag-cbor": "9.2.1",
		"@ipld/dag-json": "10.2.2",
		"@ipld/dag-pb": "4.1.2",
		"@leichtgewicht/ip-codec": "2.0.5",
		"@libp2p/crypto": "5.0.5",
		"@libp2p/interface": "2.1.3",
		"@libp2p/logger": "5.1.1",
		"@libp2p/peer-collections": "6.0.8",
		"@libp2p/peer-id": "5.0.5",
		"@libp2p/utils": "6.1.1",
		"@multiformats/dns": "1.0.6",
		"@multiformats/multiaddr": "12.3.1",
		"@multiformats/multiaddr-matcher": "1.3.0",
		"@multiformats/multiaddr-to-uri": "10.1.0",
		"@multiformats/sha3": "3.0.2",
		"@multiformats/uri-to-multiaddr": "8.0.0",
		"@noble/curves": "1.6.0",
		"@noble/hashes": "1.5.0",
		"@sindresorhus/fnv1a": "3.1.0",
		"@types/dns-packet": "5.6.5",
		"@types/murmurhash3js-revisited": "3.0.3",
		"@types/node": "22.7.6",
		"any-signal": "4.1.1",
		"asn1js": "3.0.5",
		"base64-js": "1.5.1",
		"blockstore-core": "5.0.2",
		"browser-readablestream-to-it": "2.0.7",
		"buffer": "6.0.3",
		"cborg": "4.2.4",
		"clone-regexp": "3.0.0",
		"convert-hrtime": "5.0.0",
		"cytoscape": "3.30.2",
		"cytoscape-dagre": "2.5.0",
		"dag-jose": {
			".": "5.1.1",
			"multiformats": "13.1.3"
		},
		"dagre": "0.8.5",
		"datastore-core": "10.0.2",
		"delay": "6.0.0",
		"dns-packet": "5.6.1",
		"eventemitter3": "5.0.1",
		"filesize": "10.1.6",
		"function-timeout": "0.1.1",
		"get-iterator": "2.0.1",
		"graphlib": "2.1.8",
		"hash-wasm": "4.11.0",
		"hashlru": "2.3.0",
		"i18next-chained-backend": "4.6.2",
		"i18next-localstorage-backend": "4.2.0",
		"ieee754": "1.2.1",
		"interface-blockstore": "5.3.1",
		"interface-datastore": "8.3.1",
		"interface-store": "6.0.2",
		"ip-regex": "5.0.0",
		"ipfs-unixfs": "11.2.0",
		"ipns": "10.0.0",
		"is-ip": "5.0.1",
		"is-loopback-addr": "2.0.2",
		"is-regexp": "3.1.0",
		"it-all": "3.0.6",
		"it-byte-stream": "1.1.0",
		"it-drain": "3.0.7",
		"it-filter": "3.1.1",
		"it-first": "3.0.6",
		"it-foreach": "2.1.1",
		"it-length-prefixed": "9.1.0",
		"it-length-prefixed-stream": "1.2.0",
		"it-map": "3.1.1",
		"it-merge": "3.0.5",
		"it-ndjson": "1.0.7",
		"it-peekable": "3.0.5",
		"it-pipe": "3.0.1",
		"it-pushable": "3.2.3",
		"it-queueless-pushable": "1.0.0",
		"it-reader": "6.0.4",
		"it-sort": "3.0.6",
		"it-stream-types": "2.0.2",
		"it-take": "3.0.6",
		"js-sha3": "0.9.3",
		"lodash": "4.17.21",
		"mortice": "3.0.4",
		"murmurhash3js-revisited": "3.0.0",
		"netmask": "2.0.2",
		"observable-webworkers": "2.0.1",
		"p-defer": "4.0.1",
		"p-queue": "8.0.1",
		"p-timeout": "6.1.3",
		"progress-events": "1.0.1",
		"protons-runtime": "5.5.0",
		"pvtsutils": "1.3.5",
		"pvutils": "1.1.3",
		"race-event": "1.3.0",
		"race-signal": "1.1.0",
		"regenerator-runtime": "0.14.1",
		"stream-to-it": "1.0.1",
		"super-regex": "0.2.0",
		"time-span": "5.1.0",
		"timestamp-nano": "1.0.1",
		"tslib": "2.8.0",
		"uint8-varint": "2.0.4",
		"uint8arraylist": "2.4.8",
		"uint8arrays": "5.1.0",
		"undici-types": "6.19.8",
		"varint": "6.0.0",
		"weald": "1.0.4",
		"ms": "3.0.0-canary.1",
		"supports-color": "9.4.0",
		"multiformats": "13.3.0"
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/interface/dist/src/content-routing/index.js
/**
* Any object that implements this Symbol as a property should return a
* ContentRouting instance as the property value, similar to how
* `Symbol.Iterable` can be used to return an `Iterable` from an `Iterator`.
*
* @example
*
* ```TypeScript
* import { contentRoutingSymbol, ContentRouting } from '@libp2p/content-routing'
*
* class MyContentRouter implements ContentRouting {
*   get [contentRoutingSymbol] () {
*     return this
*   }
*
*   // ...other methods
* }
* ```
*/
var contentRoutingSymbol = Symbol.for("@libp2p/content-routing");
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/interface/dist/src/peer-id/index.js
/**
* All PeerId implementations must use this symbol as the name of a property
* with a boolean `true` value
*/
var peerIdSymbol = Symbol.for("@libp2p/peer-id");
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/interface/dist/src/peer-routing/index.js
/**
* Any object that implements this Symbol as a property should return a
* PeerRouting instance as the property value, similar to how
* `Symbol.Iterable` can be used to return an `Iterable` from an `Iterator`.
*
* @example
*
* ```TypeScript
* import { peerRouting, PeerRouting } from '@libp2p/peer-routing'
*
* class MyPeerRouter implements PeerRouting {
*   get [peerRouting] () {
*     return this
*   }
*
*   // ...other methods
* }
* ```
*/
var peerRoutingSymbol = Symbol.for("@libp2p/peer-routing");
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/interface/dist/src/errors.js
/**
* When this error is thrown it means an operation was aborted,
* usually in response to the `abort` event being emitted by an
* AbortSignal.
*/
var AbortError$4 = class extends Error {
	static name = "AbortError";
	constructor(message = "The operation was aborted") {
		super(message);
		this.name = "AbortError";
	}
};
/**
* Thrown when invalid parameters are passed to a function or method call
*/
var InvalidParametersError = class extends Error {
	static name = "InvalidParametersError";
	constructor(message = "Invalid parameters") {
		super(message);
		this.name = "InvalidParametersError";
	}
};
/**
* Thrown when a public key is invalid
*/
var InvalidPublicKeyError = class extends Error {
	static name = "InvalidPublicKeyError";
	constructor(message = "Invalid public key") {
		super(message);
		this.name = "InvalidPublicKeyError";
	}
};
/**
* Thrown when a value could not be found
*/
var NotFoundError$1 = class extends Error {
	static name = "NotFoundError";
	constructor(message = "Not found") {
		super(message);
		this.name = "NotFoundError";
	}
};
/**
* Thrown when an invalid CID is encountered
*/
var InvalidCIDError = class extends Error {
	static name = "InvalidCIDError";
	constructor(message = "Invalid CID") {
		super(message);
		this.name = "InvalidCIDError";
	}
};
/**
* Thrown when an invalid multihash is encountered
*/
var InvalidMultihashError = class extends Error {
	static name = "InvalidMultihashError";
	constructor(message = "Invalid Multihash") {
		super(message);
		this.name = "InvalidMultihashError";
	}
};
/**
* Thrown when and attempt to operate on an unsupported key was made
*/
var UnsupportedKeyTypeError = class extends Error {
	static name = "UnsupportedKeyTypeError";
	constructor(message = "Unsupported key type") {
		super(message);
		this.name = "UnsupportedKeyTypeError";
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/interface/dist/src/events.js
/**
* Create a setMaxListeners that doesn't break browser usage
*/
var setMaxListeners = (n, ...eventTargets) => {
	try {
		[...eventTargets];
	} catch {}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/interface/dist/src/event-target.js
/**
* An implementation of a typed event target
* etc
*/
var TypedEventEmitter = class extends EventTarget {
	#listeners = /* @__PURE__ */ new Map();
	constructor() {
		super();
		setMaxListeners(Infinity, this);
	}
	listenerCount(type) {
		const listeners = this.#listeners.get(type);
		if (listeners == null) return 0;
		return listeners.length;
	}
	addEventListener(type, listener, options) {
		super.addEventListener(type, listener, options);
		let list = this.#listeners.get(type);
		if (list == null) {
			list = [];
			this.#listeners.set(type, list);
		}
		list.push({
			callback: listener,
			once: (options !== true && options !== false && options?.once) ?? false
		});
	}
	removeEventListener(type, listener, options) {
		super.removeEventListener(type.toString(), listener ?? null, options);
		let list = this.#listeners.get(type);
		if (list == null) return;
		list = list.filter(({ callback }) => callback !== listener);
		this.#listeners.set(type, list);
	}
	dispatchEvent(event) {
		const result = super.dispatchEvent(event);
		let list = this.#listeners.get(event.type);
		if (list == null) return result;
		list = list.filter(({ once }) => !once);
		this.#listeners.set(event.type, list);
		return result;
	}
	safeDispatchEvent(type, detail = {}) {
		return this.dispatchEvent(new CustomEvent(type, detail));
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/interface/dist/src/startable.js
function isStartable(obj) {
	return obj != null && typeof obj.start === "function" && typeof obj.stop === "function";
}
async function start(...objs) {
	const startables = [];
	for (const obj of objs) if (isStartable(obj)) startables.push(obj);
	await Promise.all(startables.map(async (s) => {
		if (s.beforeStart != null) await s.beforeStart();
	}));
	await Promise.all(startables.map(async (s) => {
		await s.start();
	}));
	await Promise.all(startables.map(async (s) => {
		if (s.afterStart != null) await s.afterStart();
	}));
}
async function stop(...objs) {
	const startables = [];
	for (const obj of objs) if (isStartable(obj)) startables.push(obj);
	await Promise.all(startables.map(async (s) => {
		if (s.beforeStop != null) await s.beforeStop();
	}));
	await Promise.all(startables.map(async (s) => {
		await s.stop();
	}));
	await Promise.all(startables.map(async (s) => {
		if (s.afterStop != null) await s.afterStop();
	}));
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/any-signal/dist/src/index.js
/**
* Takes an array of AbortSignals and returns a single signal.
* If any signals are aborted, the returned signal will be aborted.
*/
function anySignal(signals) {
	const controller = new globalThis.AbortController();
	function onAbort() {
		controller.abort();
		for (const signal of signals) if (signal?.removeEventListener != null) signal.removeEventListener("abort", onAbort);
	}
	for (const signal of signals) {
		if (signal?.aborted === true) {
			onAbort();
			break;
		}
		if (signal?.addEventListener != null) signal.addEventListener("abort", onAbort);
	}
	function clear() {
		for (const signal of signals) if (signal?.removeEventListener != null) signal.removeEventListener("abort", onAbort);
	}
	const signal = controller.signal;
	signal.clear = clear;
	return signal;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/p-defer/index.js
function pDefer() {
	const deferred = {};
	deferred.promise = new Promise((resolve, reject) => {
		deferred.resolve = resolve;
		deferred.reject = reject;
	});
	return deferred;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/it-pushable/dist/src/fifo.js
var FixedFIFO = class {
	buffer;
	mask;
	top;
	btm;
	next;
	constructor(hwm) {
		if (!(hwm > 0) || (hwm - 1 & hwm) !== 0) throw new Error("Max size for a FixedFIFO should be a power of two");
		this.buffer = new Array(hwm);
		this.mask = hwm - 1;
		this.top = 0;
		this.btm = 0;
		this.next = null;
	}
	push(data) {
		if (this.buffer[this.top] !== void 0) return false;
		this.buffer[this.top] = data;
		this.top = this.top + 1 & this.mask;
		return true;
	}
	shift() {
		const last = this.buffer[this.btm];
		if (last === void 0) return;
		this.buffer[this.btm] = void 0;
		this.btm = this.btm + 1 & this.mask;
		return last;
	}
	isEmpty() {
		return this.buffer[this.btm] === void 0;
	}
};
var FIFO = class {
	size;
	hwm;
	head;
	tail;
	constructor(options = {}) {
		this.hwm = options.splitLimit ?? 16;
		this.head = new FixedFIFO(this.hwm);
		this.tail = this.head;
		this.size = 0;
	}
	calculateSize(obj) {
		if (obj?.byteLength != null) return obj.byteLength;
		return 1;
	}
	push(val) {
		if (val?.value != null) this.size += this.calculateSize(val.value);
		if (!this.head.push(val)) {
			const prev = this.head;
			this.head = prev.next = new FixedFIFO(2 * this.head.buffer.length);
			this.head.push(val);
		}
	}
	shift() {
		let val = this.tail.shift();
		if (val === void 0 && this.tail.next != null) {
			const next = this.tail.next;
			this.tail.next = null;
			this.tail = next;
			val = this.tail.shift();
		}
		if (val?.value != null) this.size -= this.calculateSize(val.value);
		return val;
	}
	isEmpty() {
		return this.head.isEmpty();
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/it-pushable/dist/src/index.js
/**
* @packageDocumentation
*
* An iterable that you can push values into.
*
* @example
*
* ```js
* import { pushable } from 'it-pushable'
*
* const source = pushable()
*
* setTimeout(() => source.push('hello'), 100)
* setTimeout(() => source.push('world'), 200)
* setTimeout(() => source.end(), 300)
*
* const start = Date.now()
*
* for await (const value of source) {
*   console.log(`got "${value}" after ${Date.now() - start}ms`)
* }
* console.log(`done after ${Date.now() - start}ms`)
*
* // Output:
* // got "hello" after 105ms
* // got "world" after 207ms
* // done after 309ms
* ```
*
* @example
*
* ```js
* import { pushableV } from 'it-pushable'
* import all from 'it-all'
*
* const source = pushableV()
*
* source.push(1)
* source.push(2)
* source.push(3)
* source.end()
*
* console.info(await all(source))
*
* // Output:
* // [ [1, 2, 3] ]
* ```
*/
var AbortError$3 = class extends Error {
	type;
	code;
	constructor(message, code) {
		super(message ?? "The operation was aborted");
		this.type = "aborted";
		this.code = code ?? "ABORT_ERR";
	}
};
function pushable(options = {}) {
	const getNext = (buffer) => {
		const next = buffer.shift();
		if (next == null) return { done: true };
		if (next.error != null) throw next.error;
		return {
			done: next.done === true,
			value: next.value
		};
	};
	return _pushable(getNext, options);
}
function _pushable(getNext, options) {
	options = options ?? {};
	let onEnd = options.onEnd;
	let buffer = new FIFO();
	let pushable;
	let onNext;
	let ended;
	let drain = pDefer();
	const waitNext = async () => {
		try {
			if (!buffer.isEmpty()) return getNext(buffer);
			if (ended) return { done: true };
			return await new Promise((resolve, reject) => {
				onNext = (next) => {
					onNext = null;
					buffer.push(next);
					try {
						resolve(getNext(buffer));
					} catch (err) {
						reject(err);
					}
					return pushable;
				};
			});
		} finally {
			if (buffer.isEmpty()) queueMicrotask(() => {
				drain.resolve();
				drain = pDefer();
			});
		}
	};
	const bufferNext = (next) => {
		if (onNext != null) return onNext(next);
		buffer.push(next);
		return pushable;
	};
	const bufferError = (err) => {
		buffer = new FIFO();
		if (onNext != null) return onNext({ error: err });
		buffer.push({ error: err });
		return pushable;
	};
	const push = (value) => {
		if (ended) return pushable;
		if (options?.objectMode !== true && value?.byteLength == null) throw new Error("objectMode was not true but tried to push non-Uint8Array value");
		return bufferNext({
			done: false,
			value
		});
	};
	const end = (err) => {
		if (ended) return pushable;
		ended = true;
		return err != null ? bufferError(err) : bufferNext({ done: true });
	};
	const _return = () => {
		buffer = new FIFO();
		end();
		return { done: true };
	};
	const _throw = (err) => {
		end(err);
		return { done: true };
	};
	pushable = {
		[Symbol.asyncIterator]() {
			return this;
		},
		next: waitNext,
		return: _return,
		throw: _throw,
		push,
		end,
		get readableLength() {
			return buffer.size;
		},
		onEmpty: async (options) => {
			const signal = options?.signal;
			signal?.throwIfAborted();
			if (buffer.isEmpty()) return;
			let cancel;
			let listener;
			if (signal != null) cancel = new Promise((resolve, reject) => {
				listener = () => {
					reject(new AbortError$3());
				};
				signal.addEventListener("abort", listener);
			});
			try {
				await Promise.race([drain.promise, cancel]);
			} finally {
				if (listener != null && signal != null) signal?.removeEventListener("abort", listener);
			}
		}
	};
	if (onEnd == null) return pushable;
	const _pushable = pushable;
	pushable = {
		[Symbol.asyncIterator]() {
			return this;
		},
		next() {
			return _pushable.next();
		},
		throw(err) {
			_pushable.throw(err);
			if (onEnd != null) {
				onEnd(err);
				onEnd = void 0;
			}
			return { done: true };
		},
		return() {
			_pushable.return();
			if (onEnd != null) {
				onEnd();
				onEnd = void 0;
			}
			return { done: true };
		},
		push,
		end(err) {
			_pushable.end(err);
			if (onEnd != null) {
				onEnd(err);
				onEnd = void 0;
			}
			return pushable;
		},
		get readableLength() {
			return _pushable.readableLength;
		},
		onEmpty: (opts) => {
			return _pushable.onEmpty(opts);
		}
	};
	return pushable;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/race-event/dist/src/index.js
/**
* @packageDocumentation
*
* Race an event against an AbortSignal, taking care to remove any event
* listeners that were added.
*
* @example Getting started
*
* ```TypeScript
* import { raceEvent } from 'race-event'
*
* const controller = new AbortController()
* const emitter = new EventTarget()
*
* setTimeout(() => {
*   controller.abort()
* }, 500)
*
* setTimeout(() => {
*   // too late
*   emitter.dispatchEvent(new CustomEvent('event'))
* }, 1000)
*
* // throws an AbortError
* const resolve = await raceEvent(emitter, 'event', controller.signal)
* ```
*
* @example Aborting the promise with an error event
*
* ```TypeScript
* import { raceEvent } from 'race-event'
*
* const emitter = new EventTarget()
*
* setTimeout(() => {
*   emitter.dispatchEvent(new CustomEvent('failure', {
*     detail: new Error('Oh no!')
*   }))
* }, 1000)
*
* // throws 'Oh no!' error
* const resolve = await raceEvent(emitter, 'success', AbortSignal.timeout(5000), {
*   errorEvent: 'failure'
* })
* ```
*
* @example Customising the thrown AbortError
*
* The error message and `.code` property of the thrown `AbortError` can be
* specified by passing options:
*
* ```TypeScript
* import { raceEvent } from 'race-event'
*
* const controller = new AbortController()
* const emitter = new EventTarget()
*
* setTimeout(() => {
*   controller.abort()
* }, 500)
*
* // throws a Error: Oh no!
* const resolve = await raceEvent(emitter, 'event', controller.signal, {
*   errorMessage: 'Oh no!',
*   errorCode: 'ERR_OH_NO'
* })
* ```
*
* @example Only resolving on specific events
*
* Where multiple events with the same type are emitted, a `filter` function can
* be passed to only resolve on one of them:
*
* ```TypeScript
* import { raceEvent } from 'race-event'
*
* const controller = new AbortController()
* const emitter = new EventTarget()
*
* // throws a Error: Oh no!
* const resolve = await raceEvent(emitter, 'event', controller.signal, {
*   filter: (evt: Event) => {
*     return evt.detail.foo === 'bar'
*   }
* })
* ```
*
* @example Terminating early by throwing from the filter
*
* You can cause listening for the event to cease and all event listeners to be
* removed by throwing from the filter:
*
* ```TypeScript
* import { raceEvent } from 'race-event'
*
* const controller = new AbortController()
* const emitter = new EventTarget()
*
* // throws Error: Cannot continue
* const resolve = await raceEvent(emitter, 'event', controller.signal, {
*   filter: (evt) => {
*     if (...reasons) {
*       throw new Error('Cannot continue')
*     }
*
*     return true
*   }
* })
* ```
*/
/**
* An abort error class that extends error
*/
var AbortError$2 = class extends Error {
	type;
	code;
	constructor(message, code) {
		super(message ?? "The operation was aborted");
		this.type = "aborted";
		this.name = "AbortError";
		this.code = code ?? "ABORT_ERR";
	}
};
/**
* Race a promise against an abort signal
*/
async function raceEvent(emitter, eventName, signal, opts) {
	const error = new AbortError$2(opts?.errorMessage, opts?.errorCode);
	if (signal?.aborted === true) return Promise.reject(error);
	return new Promise((resolve, reject) => {
		function removeListeners() {
			signal?.removeEventListener("abort", abortListener);
			emitter.removeEventListener(eventName, eventListener);
			if (opts?.errorEvent != null) emitter.removeEventListener(opts.errorEvent, errorEventListener);
		}
		const eventListener = (evt) => {
			try {
				if (opts?.filter?.(evt) === false) return;
			} catch (err) {
				removeListeners();
				reject(err);
				return;
			}
			removeListeners();
			resolve(evt);
		};
		const errorEventListener = (evt) => {
			removeListeners();
			reject(evt.detail);
		};
		const abortListener = () => {
			removeListeners();
			reject(error);
		};
		signal?.addEventListener("abort", abortListener);
		emitter.addEventListener(eventName, eventListener);
		if (opts?.errorEvent != null) emitter.addEventListener(opts.errorEvent, errorEventListener);
	});
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/utils/dist/src/errors.js
var QueueFullError = class extends Error {
	static name = "QueueFullError";
	constructor(message = "The queue was full") {
		super(message);
		this.name = "QueueFullError";
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/race-signal/dist/src/index.js
/**
* An abort error class that extends error
*/
var AbortError$1 = class extends Error {
	type;
	code;
	constructor(message, code, name) {
		super(message ?? "The operation was aborted");
		this.type = "aborted";
		this.name = name ?? "AbortError";
		this.code = code ?? "ABORT_ERR";
	}
};
/**
* Race a promise against an abort signal
*/
async function raceSignal(promise, signal, opts) {
	if (signal == null) return promise;
	if (signal.aborted) return Promise.reject(new AbortError$1(opts?.errorMessage, opts?.errorCode, opts?.errorName));
	let listener;
	const error = new AbortError$1(opts?.errorMessage, opts?.errorCode, opts?.errorName);
	try {
		return await Promise.race([promise, new Promise((resolve, reject) => {
			listener = () => {
				reject(error);
			};
			signal.addEventListener("abort", listener);
		})]);
	} finally {
		if (listener != null) signal.removeEventListener("abort", listener);
	}
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/utils/dist/src/queue/recipient.js
var JobRecipient = class {
	deferred;
	signal;
	constructor(signal) {
		this.signal = signal;
		this.deferred = pDefer();
		this.onAbort = this.onAbort.bind(this);
		this.signal?.addEventListener("abort", this.onAbort);
	}
	onAbort() {
		this.deferred.reject(this.signal?.reason ?? new AbortError$4());
	}
	cleanup() {
		this.signal?.removeEventListener("abort", this.onAbort);
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/utils/dist/src/queue/job.js
/**
* Returns a random string
*/
function randomId() {
	return `${parseInt(String(Math.random() * 1e9), 10).toString()}${Date.now()}`;
}
var Job = class {
	id;
	fn;
	options;
	recipients;
	status;
	timeline;
	controller;
	constructor(fn, options) {
		this.id = randomId();
		this.status = "queued";
		this.fn = fn;
		this.options = options;
		this.recipients = [];
		this.timeline = { created: Date.now() };
		this.controller = new AbortController();
		setMaxListeners(Infinity, this.controller.signal);
		this.onAbort = this.onAbort.bind(this);
	}
	abort(err) {
		this.controller.abort(err);
	}
	onAbort() {
		if (this.recipients.reduce((acc, curr) => {
			return acc && curr.signal?.aborted === true;
		}, true)) {
			this.controller.abort(new AbortError$4());
			this.cleanup();
		}
	}
	async join(options = {}) {
		const recipient = new JobRecipient(options.signal);
		this.recipients.push(recipient);
		options.signal?.addEventListener("abort", this.onAbort);
		return recipient.deferred.promise;
	}
	async run() {
		this.status = "running";
		this.timeline.started = Date.now();
		try {
			this.controller.signal.throwIfAborted();
			const result = await raceSignal(this.fn({
				...this.options ?? {},
				signal: this.controller.signal
			}), this.controller.signal);
			this.recipients.forEach((recipient) => {
				recipient.deferred.resolve(result);
			});
			this.status = "complete";
		} catch (err) {
			this.recipients.forEach((recipient) => {
				recipient.deferred.reject(err);
			});
			this.status = "errored";
		} finally {
			this.timeline.finished = Date.now();
			this.cleanup();
		}
	}
	cleanup() {
		this.recipients.forEach((recipient) => {
			recipient.cleanup();
			recipient.signal?.removeEventListener("abort", this.onAbort);
		});
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/utils/dist/src/queue/index.js
/**
* Heavily influence by `p-queue` with the following differences:
*
* 1. Items remain at the head of the queue while they are running so `queue.size` includes `queue.pending` items - this is so interested parties can join the results of a queue item while it is running
* 2. The options for a job are stored separately to the job in order for them to be modified while they are still in the queue
*/
var Queue = class extends TypedEventEmitter {
	concurrency;
	maxSize;
	queue;
	pending;
	sort;
	constructor(init = {}) {
		super();
		this.concurrency = init.concurrency ?? Number.POSITIVE_INFINITY;
		this.maxSize = init.maxSize ?? Number.POSITIVE_INFINITY;
		this.pending = 0;
		if (init.metricName != null) init.metrics?.registerMetricGroup(init.metricName, { calculate: () => {
			return {
				size: this.queue.length,
				running: this.pending,
				queued: this.queue.length - this.pending
			};
		} });
		this.sort = init.sort;
		this.queue = [];
	}
	tryToStartAnother() {
		if (this.size === 0) {
			queueMicrotask(() => {
				this.safeDispatchEvent("empty");
			});
			if (this.running === 0) queueMicrotask(() => {
				this.safeDispatchEvent("idle");
			});
			return false;
		}
		if (this.pending < this.concurrency) {
			let job;
			for (const j of this.queue) if (j.status === "queued") {
				job = j;
				break;
			}
			if (job == null) return false;
			this.safeDispatchEvent("active");
			this.pending++;
			job.run().finally(() => {
				for (let i = 0; i < this.queue.length; i++) if (this.queue[i] === job) {
					this.queue.splice(i, 1);
					break;
				}
				this.pending--;
				this.tryToStartAnother();
				this.safeDispatchEvent("next");
			});
			return true;
		}
		return false;
	}
	enqueue(job) {
		this.queue.push(job);
		if (this.sort != null) this.queue.sort(this.sort);
	}
	/**
	* Adds a sync or async task to the queue. Always returns a promise.
	*/
	async add(fn, options) {
		options?.signal?.throwIfAborted();
		if (this.size === this.maxSize) throw new QueueFullError();
		const job = new Job(fn, options);
		this.enqueue(job);
		this.safeDispatchEvent("add");
		this.tryToStartAnother();
		return job.join(options).then((result) => {
			this.safeDispatchEvent("completed", { detail: result });
			this.safeDispatchEvent("success", { detail: {
				job,
				result
			} });
			return result;
		}).catch((err) => {
			if (job.status === "queued") {
				for (let i = 0; i < this.queue.length; i++) if (this.queue[i] === job) {
					this.queue.splice(i, 1);
					break;
				}
			}
			this.safeDispatchEvent("error", { detail: err });
			this.safeDispatchEvent("failure", { detail: {
				job,
				error: err
			} });
			throw err;
		});
	}
	/**
	* Clear the queue
	*/
	clear() {
		this.queue.splice(0, this.queue.length);
	}
	/**
	* Abort all jobs in the queue and clear it
	*/
	abort() {
		this.queue.forEach((job) => {
			job.abort(new AbortError$4());
		});
		this.clear();
	}
	/**
	* Can be called multiple times. Useful if you for example add additional items at a later time.
	*
	* @returns A promise that settles when the queue becomes empty.
	*/
	async onEmpty(options) {
		if (this.size === 0) return;
		await raceEvent(this, "empty", options?.signal);
	}
	/**
	* @returns A promise that settles when the queue size is less than the given
	* limit: `queue.size < limit`.
	*
	* If you want to avoid having the queue grow beyond a certain size you can
	* `await queue.onSizeLessThan()` before adding a new item.
	*
	* Note that this only limits the number of items waiting to start. There
	* could still be up to `concurrency` jobs already running that this call does
	* not include in its calculation.
	*/
	async onSizeLessThan(limit, options) {
		if (this.size < limit) return;
		await raceEvent(this, "next", options?.signal, { filter: () => this.size < limit });
	}
	/**
	* The difference with `.onEmpty` is that `.onIdle` guarantees that all work
	* from the queue has finished. `.onEmpty` merely signals that the queue is
	* empty, but it could mean that some promises haven't completed yet.
	*
	* @returns A promise that settles when the queue becomes empty, and all
	* promises have completed; `queue.size === 0 && queue.pending === 0`.
	*/
	async onIdle(options) {
		if (this.pending === 0 && this.size === 0) return;
		await raceEvent(this, "idle", options?.signal);
	}
	/**
	* Size of the queue including running items
	*/
	get size() {
		return this.queue.length;
	}
	/**
	* The number of queued items waiting to run.
	*/
	get queued() {
		return this.queue.length - this.pending;
	}
	/**
	* The number of items currently running.
	*/
	get running() {
		return this.pending;
	}
	/**
	* Returns an async generator that makes it easy to iterate over the results
	* of jobs added to the queue.
	*
	* The generator will end when the queue becomes idle, that is there are no
	* jobs running and no jobs that have yet to run.
	*
	* If you need to keep the queue open indefinitely, consider using it-pushable
	* instead.
	*/
	async *toGenerator(options) {
		options?.signal?.throwIfAborted();
		const stream = pushable({ objectMode: true });
		const cleanup = (err) => {
			if (err != null) this.abort();
			else this.clear();
			stream.end(err);
		};
		const onQueueJobComplete = (evt) => {
			if (evt.detail != null) stream.push(evt.detail);
		};
		const onQueueError = (evt) => {
			cleanup(evt.detail);
		};
		const onQueueIdle = () => {
			cleanup();
		};
		const onSignalAbort = () => {
			cleanup(new AbortError$4("Queue aborted"));
		};
		this.addEventListener("completed", onQueueJobComplete);
		this.addEventListener("error", onQueueError);
		this.addEventListener("idle", onQueueIdle);
		options?.signal?.addEventListener("abort", onSignalAbort);
		try {
			yield* stream;
		} finally {
			this.removeEventListener("completed", onQueueJobComplete);
			this.removeEventListener("error", onQueueError);
			this.removeEventListener("idle", onQueueIdle);
			options?.signal?.removeEventListener("abort", onSignalAbort);
			cleanup();
		}
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/utils/dist/src/peer-queue.js
/**
* Extends Queue to add support for querying queued jobs by peer id
*/
var PeerQueue = class extends Queue {
	has(peerId) {
		return this.find(peerId) != null;
	}
	find(peerId) {
		return this.queue.find((job) => {
			return peerId.equals(job.options.peerId);
		});
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/it-drain/dist/src/index.js
/**
* @packageDocumentation
*
* Mostly useful for tests or when you want to be explicit about consuming an iterable without doing anything with any yielded values.
*
* @example
*
* ```javascript
* import drain from 'it-drain'
*
* // This can also be an iterator, generator, etc
* const values = [0, 1, 2, 3, 4]
*
* drain(values)
* ```
*
* Async sources must be awaited:
*
* ```javascript
* import drain from 'it-drain'
*
* const values = async function * {
*   yield * [0, 1, 2, 3, 4]
* }
*
* await drain(values())
* ```
*/
function isAsyncIterable$8(thing) {
	return thing[Symbol.asyncIterator] != null;
}
function drain(source) {
	if (isAsyncIterable$8(source)) return (async () => {
		for await (const _ of source);
	})();
	else for (const _ of source);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/uint8arrays/dist/src/util/as-uint8array.js
/**
* To guarantee Uint8Array semantics, convert nodejs Buffers
* into vanilla Uint8Arrays
*/
function asUint8Array(buf) {
	return buf;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/uint8arrays/dist/src/concat.js
/**
* Returns a new Uint8Array created by concatenating the passed Uint8Arrays
*/
function concat$1(arrays, length) {
	if (length == null) length = arrays.reduce((acc, curr) => acc + curr.length, 0);
	const output = allocUnsafe(length);
	let offset = 0;
	for (const arr of arrays) {
		output.set(arr, offset);
		offset += arr.length;
	}
	return asUint8Array(output);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/uint8arrays/dist/src/equals.js
/**
* Returns true if the two passed Uint8Arrays have the same content
*/
function equals(a, b) {
	if (a === b) return true;
	if (a.byteLength !== b.byteLength) return false;
	for (let i = 0; i < a.byteLength; i++) if (a[i] !== b[i]) return false;
	return true;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/uint8arraylist/dist/src/index.js
/**
* @packageDocumentation
*
* A class that lets you do operations over a list of Uint8Arrays without
* copying them.
*
* ```js
* import { Uint8ArrayList } from 'uint8arraylist'
*
* const list = new Uint8ArrayList()
* list.append(Uint8Array.from([0, 1, 2]))
* list.append(Uint8Array.from([3, 4, 5]))
*
* list.subarray()
* // -> Uint8Array([0, 1, 2, 3, 4, 5])
*
* list.consume(3)
* list.subarray()
* // -> Uint8Array([3, 4, 5])
*
* // you can also iterate over the list
* for (const buf of list) {
*   // ..do something with `buf`
* }
*
* list.subarray(0, 1)
* // -> Uint8Array([0])
* ```
*
* ## Converting Uint8ArrayLists to Uint8Arrays
*
* There are two ways to turn a `Uint8ArrayList` into a `Uint8Array` - `.slice` and `.subarray` and one way to turn a `Uint8ArrayList` into a `Uint8ArrayList` with different contents - `.sublist`.
*
* ### slice
*
* Slice follows the same semantics as [Uint8Array.slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice) in that it creates a new `Uint8Array` and copies bytes into it using an optional offset & length.
*
* ```js
* const list = new Uint8ArrayList()
* list.append(Uint8Array.from([0, 1, 2]))
* list.append(Uint8Array.from([3, 4, 5]))
*
* list.slice(0, 1)
* // -> Uint8Array([0])
* ```
*
* ### subarray
*
* Subarray attempts to follow the same semantics as [Uint8Array.subarray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray) with one important different - this is a no-copy operation, unless the requested bytes span two internal buffers in which case it is a copy operation.
*
* ```js
* const list = new Uint8ArrayList()
* list.append(Uint8Array.from([0, 1, 2]))
* list.append(Uint8Array.from([3, 4, 5]))
*
* list.subarray(0, 1)
* // -> Uint8Array([0]) - no-copy
*
* list.subarray(2, 5)
* // -> Uint8Array([2, 3, 4]) - copy
* ```
*
* ### sublist
*
* Sublist creates and returns a new `Uint8ArrayList` that shares the underlying buffers with the original so is always a no-copy operation.
*
* ```js
* const list = new Uint8ArrayList()
* list.append(Uint8Array.from([0, 1, 2]))
* list.append(Uint8Array.from([3, 4, 5]))
*
* list.sublist(0, 1)
* // -> Uint8ArrayList([0]) - no-copy
*
* list.sublist(2, 5)
* // -> Uint8ArrayList([2], [3, 4]) - no-copy
* ```
*
* ## Inspiration
*
* Borrows liberally from [bl](https://www.npmjs.com/package/bl) but only uses native JS types.
*/
var symbol$1 = Symbol.for("@achingbrain/uint8arraylist");
function findBufAndOffset(bufs, index) {
	if (index == null || index < 0) throw new RangeError("index is out of bounds");
	let offset = 0;
	for (const buf of bufs) {
		const bufEnd = offset + buf.byteLength;
		if (index < bufEnd) return {
			buf,
			index: index - offset
		};
		offset = bufEnd;
	}
	throw new RangeError("index is out of bounds");
}
/**
* Check if object is a CID instance
*
* @example
*
* ```js
* import { isUint8ArrayList, Uint8ArrayList } from 'uint8arraylist'
*
* isUint8ArrayList(true) // false
* isUint8ArrayList([]) // false
* isUint8ArrayList(new Uint8ArrayList()) // true
* ```
*/
function isUint8ArrayList(value) {
	return Boolean(value?.[symbol$1]);
}
var Uint8ArrayList = class Uint8ArrayList {
	bufs;
	length;
	[symbol$1] = true;
	constructor(...data) {
		this.bufs = [];
		this.length = 0;
		if (data.length > 0) this.appendAll(data);
	}
	*[Symbol.iterator]() {
		yield* this.bufs;
	}
	get byteLength() {
		return this.length;
	}
	/**
	* Add one or more `bufs` to the end of this Uint8ArrayList
	*/
	append(...bufs) {
		this.appendAll(bufs);
	}
	/**
	* Add all `bufs` to the end of this Uint8ArrayList
	*/
	appendAll(bufs) {
		let length = 0;
		for (const buf of bufs) if (buf instanceof Uint8Array) {
			length += buf.byteLength;
			this.bufs.push(buf);
		} else if (isUint8ArrayList(buf)) {
			length += buf.byteLength;
			this.bufs.push(...buf.bufs);
		} else throw new Error("Could not append value, must be an Uint8Array or a Uint8ArrayList");
		this.length += length;
	}
	/**
	* Add one or more `bufs` to the start of this Uint8ArrayList
	*/
	prepend(...bufs) {
		this.prependAll(bufs);
	}
	/**
	* Add all `bufs` to the start of this Uint8ArrayList
	*/
	prependAll(bufs) {
		let length = 0;
		for (const buf of bufs.reverse()) if (buf instanceof Uint8Array) {
			length += buf.byteLength;
			this.bufs.unshift(buf);
		} else if (isUint8ArrayList(buf)) {
			length += buf.byteLength;
			this.bufs.unshift(...buf.bufs);
		} else throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");
		this.length += length;
	}
	/**
	* Read the value at `index`
	*/
	get(index) {
		const res = findBufAndOffset(this.bufs, index);
		return res.buf[res.index];
	}
	/**
	* Set the value at `index` to `value`
	*/
	set(index, value) {
		const res = findBufAndOffset(this.bufs, index);
		res.buf[res.index] = value;
	}
	/**
	* Copy bytes from `buf` to the index specified by `offset`
	*/
	write(buf, offset = 0) {
		if (buf instanceof Uint8Array) for (let i = 0; i < buf.length; i++) this.set(offset + i, buf[i]);
		else if (isUint8ArrayList(buf)) for (let i = 0; i < buf.length; i++) this.set(offset + i, buf.get(i));
		else throw new Error("Could not write value, must be an Uint8Array or a Uint8ArrayList");
	}
	/**
	* Remove bytes from the front of the pool
	*/
	consume(bytes) {
		bytes = Math.trunc(bytes);
		if (Number.isNaN(bytes) || bytes <= 0) return;
		if (bytes === this.byteLength) {
			this.bufs = [];
			this.length = 0;
			return;
		}
		while (this.bufs.length > 0) if (bytes >= this.bufs[0].byteLength) {
			bytes -= this.bufs[0].byteLength;
			this.length -= this.bufs[0].byteLength;
			this.bufs.shift();
		} else {
			this.bufs[0] = this.bufs[0].subarray(bytes);
			this.length -= bytes;
			break;
		}
	}
	/**
	* Extracts a section of an array and returns a new array.
	*
	* This is a copy operation as it is with Uint8Arrays and Arrays
	* - note this is different to the behaviour of Node Buffers.
	*/
	slice(beginInclusive, endExclusive) {
		const { bufs, length } = this._subList(beginInclusive, endExclusive);
		return concat$1(bufs, length);
	}
	/**
	* Returns a alloc from the given start and end element index.
	*
	* In the best case where the data extracted comes from a single Uint8Array
	* internally this is a no-copy operation otherwise it is a copy operation.
	*/
	subarray(beginInclusive, endExclusive) {
		const { bufs, length } = this._subList(beginInclusive, endExclusive);
		if (bufs.length === 1) return bufs[0];
		return concat$1(bufs, length);
	}
	/**
	* Returns a allocList from the given start and end element index.
	*
	* This is a no-copy operation.
	*/
	sublist(beginInclusive, endExclusive) {
		const { bufs, length } = this._subList(beginInclusive, endExclusive);
		const list = new Uint8ArrayList();
		list.length = length;
		list.bufs = [...bufs];
		return list;
	}
	_subList(beginInclusive, endExclusive) {
		beginInclusive = beginInclusive ?? 0;
		endExclusive = endExclusive ?? this.length;
		if (beginInclusive < 0) beginInclusive = this.length + beginInclusive;
		if (endExclusive < 0) endExclusive = this.length + endExclusive;
		if (beginInclusive < 0 || endExclusive > this.length) throw new RangeError("index is out of bounds");
		if (beginInclusive === endExclusive) return {
			bufs: [],
			length: 0
		};
		if (beginInclusive === 0 && endExclusive === this.length) return {
			bufs: this.bufs,
			length: this.length
		};
		const bufs = [];
		let offset = 0;
		for (let i = 0; i < this.bufs.length; i++) {
			const buf = this.bufs[i];
			const bufStart = offset;
			const bufEnd = bufStart + buf.byteLength;
			offset = bufEnd;
			if (beginInclusive >= bufEnd) continue;
			const sliceStartInBuf = beginInclusive >= bufStart && beginInclusive < bufEnd;
			const sliceEndsInBuf = endExclusive > bufStart && endExclusive <= bufEnd;
			if (sliceStartInBuf && sliceEndsInBuf) {
				if (beginInclusive === bufStart && endExclusive === bufEnd) {
					bufs.push(buf);
					break;
				}
				const start = beginInclusive - bufStart;
				bufs.push(buf.subarray(start, start + (endExclusive - beginInclusive)));
				break;
			}
			if (sliceStartInBuf) {
				if (beginInclusive === 0) {
					bufs.push(buf);
					continue;
				}
				bufs.push(buf.subarray(beginInclusive - bufStart));
				continue;
			}
			if (sliceEndsInBuf) {
				if (endExclusive === bufEnd) {
					bufs.push(buf);
					break;
				}
				bufs.push(buf.subarray(0, endExclusive - bufStart));
				break;
			}
			bufs.push(buf);
		}
		return {
			bufs,
			length: endExclusive - beginInclusive
		};
	}
	indexOf(search, offset = 0) {
		if (!isUint8ArrayList(search) && !(search instanceof Uint8Array)) throw new TypeError("The \"value\" argument must be a Uint8ArrayList or Uint8Array");
		const needle = search instanceof Uint8Array ? search : search.subarray();
		offset = Number(offset ?? 0);
		if (isNaN(offset)) offset = 0;
		if (offset < 0) offset = this.length + offset;
		if (offset < 0) offset = 0;
		if (search.length === 0) return offset > this.length ? this.length : offset;
		const M = needle.byteLength;
		if (M === 0) throw new TypeError("search must be at least 1 byte long");
		const radix = 256;
		const rightmostPositions = new Int32Array(radix);
		for (let c = 0; c < radix; c++) rightmostPositions[c] = -1;
		for (let j = 0; j < M; j++) rightmostPositions[needle[j]] = j;
		const right = rightmostPositions;
		const lastIndex = this.byteLength - needle.byteLength;
		const lastPatIndex = needle.byteLength - 1;
		let skip;
		for (let i = offset; i <= lastIndex; i += skip) {
			skip = 0;
			for (let j = lastPatIndex; j >= 0; j--) {
				const char = this.get(i + j);
				if (needle[j] !== char) {
					skip = Math.max(1, j - right[char]);
					break;
				}
			}
			if (skip === 0) return i;
		}
		return -1;
	}
	getInt8(byteOffset) {
		const buf = this.subarray(byteOffset, byteOffset + 1);
		return new DataView(buf.buffer, buf.byteOffset, buf.byteLength).getInt8(0);
	}
	setInt8(byteOffset, value) {
		const buf = allocUnsafe(1);
		new DataView(buf.buffer, buf.byteOffset, buf.byteLength).setInt8(0, value);
		this.write(buf, byteOffset);
	}
	getInt16(byteOffset, littleEndian) {
		const buf = this.subarray(byteOffset, byteOffset + 2);
		return new DataView(buf.buffer, buf.byteOffset, buf.byteLength).getInt16(0, littleEndian);
	}
	setInt16(byteOffset, value, littleEndian) {
		const buf = alloc$1(2);
		new DataView(buf.buffer, buf.byteOffset, buf.byteLength).setInt16(0, value, littleEndian);
		this.write(buf, byteOffset);
	}
	getInt32(byteOffset, littleEndian) {
		const buf = this.subarray(byteOffset, byteOffset + 4);
		return new DataView(buf.buffer, buf.byteOffset, buf.byteLength).getInt32(0, littleEndian);
	}
	setInt32(byteOffset, value, littleEndian) {
		const buf = alloc$1(4);
		new DataView(buf.buffer, buf.byteOffset, buf.byteLength).setInt32(0, value, littleEndian);
		this.write(buf, byteOffset);
	}
	getBigInt64(byteOffset, littleEndian) {
		const buf = this.subarray(byteOffset, byteOffset + 8);
		return new DataView(buf.buffer, buf.byteOffset, buf.byteLength).getBigInt64(0, littleEndian);
	}
	setBigInt64(byteOffset, value, littleEndian) {
		const buf = alloc$1(8);
		new DataView(buf.buffer, buf.byteOffset, buf.byteLength).setBigInt64(0, value, littleEndian);
		this.write(buf, byteOffset);
	}
	getUint8(byteOffset) {
		const buf = this.subarray(byteOffset, byteOffset + 1);
		return new DataView(buf.buffer, buf.byteOffset, buf.byteLength).getUint8(0);
	}
	setUint8(byteOffset, value) {
		const buf = allocUnsafe(1);
		new DataView(buf.buffer, buf.byteOffset, buf.byteLength).setUint8(0, value);
		this.write(buf, byteOffset);
	}
	getUint16(byteOffset, littleEndian) {
		const buf = this.subarray(byteOffset, byteOffset + 2);
		return new DataView(buf.buffer, buf.byteOffset, buf.byteLength).getUint16(0, littleEndian);
	}
	setUint16(byteOffset, value, littleEndian) {
		const buf = alloc$1(2);
		new DataView(buf.buffer, buf.byteOffset, buf.byteLength).setUint16(0, value, littleEndian);
		this.write(buf, byteOffset);
	}
	getUint32(byteOffset, littleEndian) {
		const buf = this.subarray(byteOffset, byteOffset + 4);
		return new DataView(buf.buffer, buf.byteOffset, buf.byteLength).getUint32(0, littleEndian);
	}
	setUint32(byteOffset, value, littleEndian) {
		const buf = alloc$1(4);
		new DataView(buf.buffer, buf.byteOffset, buf.byteLength).setUint32(0, value, littleEndian);
		this.write(buf, byteOffset);
	}
	getBigUint64(byteOffset, littleEndian) {
		const buf = this.subarray(byteOffset, byteOffset + 8);
		return new DataView(buf.buffer, buf.byteOffset, buf.byteLength).getBigUint64(0, littleEndian);
	}
	setBigUint64(byteOffset, value, littleEndian) {
		const buf = alloc$1(8);
		new DataView(buf.buffer, buf.byteOffset, buf.byteLength).setBigUint64(0, value, littleEndian);
		this.write(buf, byteOffset);
	}
	getFloat32(byteOffset, littleEndian) {
		const buf = this.subarray(byteOffset, byteOffset + 4);
		return new DataView(buf.buffer, buf.byteOffset, buf.byteLength).getFloat32(0, littleEndian);
	}
	setFloat32(byteOffset, value, littleEndian) {
		const buf = alloc$1(4);
		new DataView(buf.buffer, buf.byteOffset, buf.byteLength).setFloat32(0, value, littleEndian);
		this.write(buf, byteOffset);
	}
	getFloat64(byteOffset, littleEndian) {
		const buf = this.subarray(byteOffset, byteOffset + 8);
		return new DataView(buf.buffer, buf.byteOffset, buf.byteLength).getFloat64(0, littleEndian);
	}
	setFloat64(byteOffset, value, littleEndian) {
		const buf = alloc$1(8);
		new DataView(buf.buffer, buf.byteOffset, buf.byteLength).setFloat64(0, value, littleEndian);
		this.write(buf, byteOffset);
	}
	equals(other) {
		if (other == null) return false;
		if (!(other instanceof Uint8ArrayList)) return false;
		if (other.bufs.length !== this.bufs.length) return false;
		for (let i = 0; i < this.bufs.length; i++) if (!equals(this.bufs[i], other.bufs[i])) return false;
		return true;
	}
	/**
	* Create a Uint8ArrayList from a pre-existing list of Uint8Arrays.  Use this
	* method if you know the total size of all the Uint8Arrays ahead of time.
	*/
	static fromUint8Arrays(bufs, length) {
		const list = new Uint8ArrayList();
		list.bufs = bufs;
		if (length == null) length = bufs.reduce((acc, curr) => acc + curr.byteLength, 0);
		list.length = length;
		return list;
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/it-peekable/dist/src/index.js
/**
* @packageDocumentation
*
* Lets you look at the contents of an async iterator and decide what to do
*
* @example
*
* ```javascript
* import peekable from 'it-peekable'
*
* // This can also be an iterator, generator, etc
* const values = [0, 1, 2, 3, 4]
*
* const it = peekable(value)
*
* const first = it.peek()
*
* console.info(first) // 0
*
* it.push(first)
*
* console.info([...it])
* // [ 0, 1, 2, 3, 4 ]
* ```
*
* Async sources must be awaited:
*
* ```javascript
* import peekable from 'it-peekable'
*
* const values = async function * () {
*   yield * [0, 1, 2, 3, 4]
* }
*
* const it = peekable(values())
*
* const first = await it.peek()
*
* console.info(first) // 0
*
* it.push(first)
*
* console.info(await all(it))
* // [ 0, 1, 2, 3, 4 ]
* ```
*/
function peekable(iterable) {
	const [iterator, symbol] = iterable[Symbol.asyncIterator] != null ? [iterable[Symbol.asyncIterator](), Symbol.asyncIterator] : [iterable[Symbol.iterator](), Symbol.iterator];
	const queue = [];
	return {
		peek: () => {
			return iterator.next();
		},
		push: (value) => {
			queue.push(value);
		},
		next: () => {
			if (queue.length > 0) return {
				done: false,
				value: queue.shift()
			};
			return iterator.next();
		},
		[symbol]() {
			return this;
		}
	};
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/it-map/dist/src/index.js
/**
* @packageDocumentation
*
* Convert one value from an (async)iterator into another.
*
* @example
*
* ```javascript
* import map from 'it-map'
*
* // This can also be an iterator, generator, etc
* const values = [0, 1, 2, 3, 4]
*
* const result = map(values, (val, index) => val++)
*
* console.info(result) // [1, 2, 3, 4, 5]
* ```
*
* Async sources and transforms must be awaited:
*
* ```javascript
* import map from 'it-map'
*
* const values = async function * () {
*   yield * [0, 1, 2, 3, 4]
* }
*
* const result = await map(values(), async (val, index) => val++)
*
* console.info(result) // [1, 2, 3, 4, 5]
* ```
*/
function isAsyncIterable$7(thing) {
	return thing[Symbol.asyncIterator] != null;
}
function map(source, func) {
	let index = 0;
	if (isAsyncIterable$7(source)) return (async function* () {
		for await (const val of source) yield func(val, index++);
	})();
	const peekable$3 = peekable(source);
	const { value, done } = peekable$3.next();
	if (done === true) return function* () {}();
	const res = func(value, index++);
	if (typeof res.then === "function") return (async function* () {
		yield await res;
		for await (const val of peekable$3) yield func(val, index++);
	})();
	const fn = func;
	return (function* () {
		yield res;
		for (const val of peekable$3) yield fn(val, index++);
	})();
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/it-merge/dist/src/index.js
/**
* @packageDocumentation
*
* Merge several (async)iterables into one, yield values as they arrive.
*
* Nb. sources are iterated over in parallel so the order of emitted items is not guaranteed.
*
* @example
*
* ```javascript
* import merge from 'it-merge'
* import all from 'it-all'
*
* // This can also be an iterator, generator, etc
* const values1 = [0, 1, 2, 3, 4]
* const values2 = [5, 6, 7, 8, 9]
*
* const arr = all(merge(values1, values2))
*
* console.info(arr) // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
* ```
*
* Async sources must be awaited:
*
* ```javascript
* import merge from 'it-merge'
* import all from 'it-all'
*
* // This can also be an iterator, async iterator, generator, etc
* const values1 = async function * () {
*   yield * [0, 1, 2, 3, 4]
* }
* const values2 = async function * () {
*   yield * [5, 6, 7, 8, 9]
* }
*
* const arr = await all(merge(values1(), values2()))
*
* console.info(arr) // 0, 1, 5, 6, 2, 3, 4, 7, 8, 9  <- nb. order is not guaranteed
* ```
*/
function isAsyncIterable$6(thing) {
	return thing[Symbol.asyncIterator] != null;
}
function merge(...sources) {
	const syncSources = [];
	for (const source of sources) if (!isAsyncIterable$6(source)) syncSources.push(source);
	if (syncSources.length === sources.length) return (function* () {
		for (const source of syncSources) yield* source;
	})();
	return (async function* () {
		const output = pushable({ objectMode: true });
		Promise.resolve().then(async () => {
			try {
				await Promise.all(sources.map(async (source) => {
					for await (const item of source) output.push(item);
				}));
				output.end();
			} catch (err) {
				output.end(err);
			}
		});
		yield* output;
	})();
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/it-take/dist/src/index.js
/**
* @packageDocumentation
*
* For when you only want a few values out of an (async)iterable.
*
* @example
*
* ```javascript
* import take from 'it-take'
* import all from 'it-all'
*
* // This can also be an iterator, generator, etc
* const values = [0, 1, 2, 3, 4]
*
* const arr = all(take(values, 2))
*
* console.info(arr) // 0, 1
* ```
*
* Async sources must be awaited:
*
* ```javascript
* import take from 'it-take'
* import all from 'it-all'
*
* const values = async function * () {
*   yield * [0, 1, 2, 3, 4]
* }
*
* const arr = await all(take(values(), 2))
*
* console.info(arr) // 0, 1
* ```
*/
function isAsyncIterable$5(thing) {
	return thing[Symbol.asyncIterator] != null;
}
function take(source, limit) {
	if (isAsyncIterable$5(source)) return (async function* () {
		let items = 0;
		if (limit < 1) return;
		for await (const entry of source) {
			yield entry;
			items++;
			if (items === limit) return;
		}
	})();
	return (function* () {
		let items = 0;
		if (limit < 1) return;
		for (const entry of source) {
			yield entry;
			items++;
			if (items === limit) return;
		}
	})();
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/progress-events/dist/src/index.js
/**
* An implementation of the ProgressEvent interface, this is essentially
* a typed `CustomEvent` with a `type` property that lets us disambiguate
* events passed to `progress` callbacks.
*/
var CustomProgressEvent = class extends Event {
	type;
	detail;
	constructor(type, detail) {
		super(type);
		this.type = type;
		this.detail = detail;
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@noble/hashes/esm/_assert.js
function number$1(n) {
	if (!Number.isSafeInteger(n) || n < 0) throw new Error(`positive integer expected, not ${n}`);
}
function isBytes$1(a) {
	return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
function bytes(b, ...lengths) {
	if (!isBytes$1(b)) throw new Error("Uint8Array expected");
	if (lengths.length > 0 && !lengths.includes(b.length)) throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
}
function hash(h) {
	if (typeof h !== "function" || typeof h.create !== "function") throw new Error("Hash should be wrapped by utils.wrapConstructor");
	number$1(h.outputLen);
	number$1(h.blockLen);
}
function exists(instance, checkFinished = true) {
	if (instance.destroyed) throw new Error("Hash instance has been destroyed");
	if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
function output(out, instance) {
	bytes(out);
	const min = instance.outputLen;
	if (out.length < min) throw new Error(`digestInto() expects output buffer of length at least ${min}`);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@noble/hashes/esm/crypto.js
var crypto$1 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@noble/hashes/esm/utils.js
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var rotr = (word, shift) => word << 32 - shift | word >>> shift;
new Uint8Array(new Uint32Array([287454020]).buffer)[0];
/**
* @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
*/
function utf8ToBytes$1(str) {
	if (typeof str !== "string") throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
	return new Uint8Array(new TextEncoder().encode(str));
}
/**
* Normalizes (non-hex) string or Uint8Array to Uint8Array.
* Warning: when Uint8Array is passed, it would NOT get copied.
* Keep in mind for future mutable operations.
*/
function toBytes$1(data) {
	if (typeof data === "string") data = utf8ToBytes$1(data);
	bytes(data);
	return data;
}
/**
* Copies several Uint8Arrays into one.
*/
function concatBytes$1(...arrays) {
	let sum = 0;
	for (let i = 0; i < arrays.length; i++) {
		const a = arrays[i];
		bytes(a);
		sum += a.length;
	}
	const res = new Uint8Array(sum);
	for (let i = 0, pad = 0; i < arrays.length; i++) {
		const a = arrays[i];
		res.set(a, pad);
		pad += a.length;
	}
	return res;
}
var Hash = class {
	clone() {
		return this._cloneInto();
	}
};
({}).toString;
function wrapConstructor(hashCons) {
	const hashC = (msg) => hashCons().update(toBytes$1(msg)).digest();
	const tmp = hashCons();
	hashC.outputLen = tmp.outputLen;
	hashC.blockLen = tmp.blockLen;
	hashC.create = () => hashCons();
	return hashC;
}
/**
* Secure PRNG. Uses `crypto.getRandomValues`, which defers to OS.
*/
function randomBytes$1(bytesLength = 32) {
	if (crypto$1 && typeof crypto$1.getRandomValues === "function") return crypto$1.getRandomValues(new Uint8Array(bytesLength));
	if (crypto$1 && typeof crypto$1.randomBytes === "function") return crypto$1.randomBytes(bytesLength);
	throw new Error("crypto.getRandomValues must be defined");
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@noble/hashes/esm/_md.js
/**
* Polyfill for Safari 14
*/
function setBigUint64(view, byteOffset, value, isLE) {
	if (typeof view.setBigUint64 === "function") return view.setBigUint64(byteOffset, value, isLE);
	const _32n = BigInt(32);
	const _u32_max = BigInt(4294967295);
	const wh = Number(value >> _32n & _u32_max);
	const wl = Number(value & _u32_max);
	const h = isLE ? 4 : 0;
	const l = isLE ? 0 : 4;
	view.setUint32(byteOffset + h, wh, isLE);
	view.setUint32(byteOffset + l, wl, isLE);
}
/**
* Choice: a ? b : c
*/
var Chi = (a, b, c) => a & b ^ ~a & c;
/**
* Majority function, true if any two inputs is true
*/
var Maj = (a, b, c) => a & b ^ a & c ^ b & c;
/**
* Merkle-Damgard hash construction base class.
* Could be used to create MD5, RIPEMD, SHA1, SHA2.
*/
var HashMD = class extends Hash {
	constructor(blockLen, outputLen, padOffset, isLE) {
		super();
		this.blockLen = blockLen;
		this.outputLen = outputLen;
		this.padOffset = padOffset;
		this.isLE = isLE;
		this.finished = false;
		this.length = 0;
		this.pos = 0;
		this.destroyed = false;
		this.buffer = new Uint8Array(blockLen);
		this.view = createView(this.buffer);
	}
	update(data) {
		exists(this);
		const { view, buffer, blockLen } = this;
		data = toBytes$1(data);
		const len = data.length;
		for (let pos = 0; pos < len;) {
			const take = Math.min(blockLen - this.pos, len - pos);
			if (take === blockLen) {
				const dataView = createView(data);
				for (; blockLen <= len - pos; pos += blockLen) this.process(dataView, pos);
				continue;
			}
			buffer.set(data.subarray(pos, pos + take), this.pos);
			this.pos += take;
			pos += take;
			if (this.pos === blockLen) {
				this.process(view, 0);
				this.pos = 0;
			}
		}
		this.length += data.length;
		this.roundClean();
		return this;
	}
	digestInto(out) {
		exists(this);
		output(out, this);
		this.finished = true;
		const { buffer, view, blockLen, isLE } = this;
		let { pos } = this;
		buffer[pos++] = 128;
		this.buffer.subarray(pos).fill(0);
		if (this.padOffset > blockLen - pos) {
			this.process(view, 0);
			pos = 0;
		}
		for (let i = pos; i < blockLen; i++) buffer[i] = 0;
		setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
		this.process(view, 0);
		const oview = createView(out);
		const len = this.outputLen;
		if (len % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
		const outLen = len / 4;
		const state = this.get();
		if (outLen > state.length) throw new Error("_sha2: outputLen bigger than state");
		for (let i = 0; i < outLen; i++) oview.setUint32(4 * i, state[i], isLE);
	}
	digest() {
		const { buffer, outputLen } = this;
		this.digestInto(buffer);
		const res = buffer.slice(0, outputLen);
		this.destroy();
		return res;
	}
	_cloneInto(to) {
		to || (to = new this.constructor());
		to.set(...this.get());
		const { blockLen, buffer, length, finished, destroyed, pos } = this;
		to.length = length;
		to.pos = pos;
		to.finished = finished;
		to.destroyed = destroyed;
		if (length % blockLen) to.buffer.set(buffer);
		return to;
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@noble/hashes/esm/_u64.js
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
	if (le) return {
		h: Number(n & U32_MASK64),
		l: Number(n >> _32n & U32_MASK64)
	};
	return {
		h: Number(n >> _32n & U32_MASK64) | 0,
		l: Number(n & U32_MASK64) | 0
	};
}
function split(lst, le = false) {
	let Ah = new Uint32Array(lst.length);
	let Al = new Uint32Array(lst.length);
	for (let i = 0; i < lst.length; i++) {
		const { h, l } = fromBig(lst[i], le);
		[Ah[i], Al[i]] = [h, l];
	}
	return [Ah, Al];
}
var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
var shrSH = (h, _l, s) => h >>> s;
var shrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
var rotr32H = (_h, l) => l;
var rotr32L = (h, _l) => h;
var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
function add(Ah, Al, Bh, Bl) {
	const l = (Al >>> 0) + (Bl >>> 0);
	return {
		h: Ah + Bh + (l / 2 ** 32 | 0) | 0,
		l: l | 0
	};
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
var u64 = {
	fromBig,
	split,
	toBig,
	shrSH,
	shrSL,
	rotrSH,
	rotrSL,
	rotrBH,
	rotrBL,
	rotr32H,
	rotr32L,
	rotlSH,
	rotlSL,
	rotlBH,
	rotlBL,
	add,
	add3L,
	add3H,
	add4L,
	add4H,
	add5H,
	add5L
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@noble/hashes/esm/sha512.js
var [SHA512_Kh, SHA512_Kl] = /* @__PURE__ */ (() => u64.split([
	"0x428a2f98d728ae22",
	"0x7137449123ef65cd",
	"0xb5c0fbcfec4d3b2f",
	"0xe9b5dba58189dbbc",
	"0x3956c25bf348b538",
	"0x59f111f1b605d019",
	"0x923f82a4af194f9b",
	"0xab1c5ed5da6d8118",
	"0xd807aa98a3030242",
	"0x12835b0145706fbe",
	"0x243185be4ee4b28c",
	"0x550c7dc3d5ffb4e2",
	"0x72be5d74f27b896f",
	"0x80deb1fe3b1696b1",
	"0x9bdc06a725c71235",
	"0xc19bf174cf692694",
	"0xe49b69c19ef14ad2",
	"0xefbe4786384f25e3",
	"0x0fc19dc68b8cd5b5",
	"0x240ca1cc77ac9c65",
	"0x2de92c6f592b0275",
	"0x4a7484aa6ea6e483",
	"0x5cb0a9dcbd41fbd4",
	"0x76f988da831153b5",
	"0x983e5152ee66dfab",
	"0xa831c66d2db43210",
	"0xb00327c898fb213f",
	"0xbf597fc7beef0ee4",
	"0xc6e00bf33da88fc2",
	"0xd5a79147930aa725",
	"0x06ca6351e003826f",
	"0x142929670a0e6e70",
	"0x27b70a8546d22ffc",
	"0x2e1b21385c26c926",
	"0x4d2c6dfc5ac42aed",
	"0x53380d139d95b3df",
	"0x650a73548baf63de",
	"0x766a0abb3c77b2a8",
	"0x81c2c92e47edaee6",
	"0x92722c851482353b",
	"0xa2bfe8a14cf10364",
	"0xa81a664bbc423001",
	"0xc24b8b70d0f89791",
	"0xc76c51a30654be30",
	"0xd192e819d6ef5218",
	"0xd69906245565a910",
	"0xf40e35855771202a",
	"0x106aa07032bbd1b8",
	"0x19a4c116b8d2d0c8",
	"0x1e376c085141ab53",
	"0x2748774cdf8eeb99",
	"0x34b0bcb5e19b48a8",
	"0x391c0cb3c5c95a63",
	"0x4ed8aa4ae3418acb",
	"0x5b9cca4f7763e373",
	"0x682e6ff3d6b2b8a3",
	"0x748f82ee5defb2fc",
	"0x78a5636f43172f60",
	"0x84c87814a1f0ab72",
	"0x8cc702081a6439ec",
	"0x90befffa23631e28",
	"0xa4506cebde82bde9",
	"0xbef9a3f7b2c67915",
	"0xc67178f2e372532b",
	"0xca273eceea26619c",
	"0xd186b8c721c0c207",
	"0xeada7dd6cde0eb1e",
	"0xf57d4f7fee6ed178",
	"0x06f067aa72176fba",
	"0x0a637dc5a2c898a6",
	"0x113f9804bef90dae",
	"0x1b710b35131c471b",
	"0x28db77f523047d84",
	"0x32caab7b40c72493",
	"0x3c9ebe0a15c9bebc",
	"0x431d67c49c100d4c",
	"0x4cc5d4becb3e42b6",
	"0x597f299cfc657e2a",
	"0x5fcb6fab3ad6faec",
	"0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
var SHA512 = class extends HashMD {
	constructor() {
		super(128, 64, 16, false);
		this.Ah = 1779033703;
		this.Al = -205731576;
		this.Bh = -1150833019;
		this.Bl = -2067093701;
		this.Ch = 1013904242;
		this.Cl = -23791573;
		this.Dh = -1521486534;
		this.Dl = 1595750129;
		this.Eh = 1359893119;
		this.El = -1377402159;
		this.Fh = -1694144372;
		this.Fl = 725511199;
		this.Gh = 528734635;
		this.Gl = -79577749;
		this.Hh = 1541459225;
		this.Hl = 327033209;
	}
	get() {
		const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
		return [
			Ah,
			Al,
			Bh,
			Bl,
			Ch,
			Cl,
			Dh,
			Dl,
			Eh,
			El,
			Fh,
			Fl,
			Gh,
			Gl,
			Hh,
			Hl
		];
	}
	set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
		this.Ah = Ah | 0;
		this.Al = Al | 0;
		this.Bh = Bh | 0;
		this.Bl = Bl | 0;
		this.Ch = Ch | 0;
		this.Cl = Cl | 0;
		this.Dh = Dh | 0;
		this.Dl = Dl | 0;
		this.Eh = Eh | 0;
		this.El = El | 0;
		this.Fh = Fh | 0;
		this.Fl = Fl | 0;
		this.Gh = Gh | 0;
		this.Gl = Gl | 0;
		this.Hh = Hh | 0;
		this.Hl = Hl | 0;
	}
	process(view, offset) {
		for (let i = 0; i < 16; i++, offset += 4) {
			SHA512_W_H[i] = view.getUint32(offset);
			SHA512_W_L[i] = view.getUint32(offset += 4);
		}
		for (let i = 16; i < 80; i++) {
			const W15h = SHA512_W_H[i - 15] | 0;
			const W15l = SHA512_W_L[i - 15] | 0;
			const s0h = u64.rotrSH(W15h, W15l, 1) ^ u64.rotrSH(W15h, W15l, 8) ^ u64.shrSH(W15h, W15l, 7);
			const s0l = u64.rotrSL(W15h, W15l, 1) ^ u64.rotrSL(W15h, W15l, 8) ^ u64.shrSL(W15h, W15l, 7);
			const W2h = SHA512_W_H[i - 2] | 0;
			const W2l = SHA512_W_L[i - 2] | 0;
			const s1h = u64.rotrSH(W2h, W2l, 19) ^ u64.rotrBH(W2h, W2l, 61) ^ u64.shrSH(W2h, W2l, 6);
			const s1l = u64.rotrSL(W2h, W2l, 19) ^ u64.rotrBL(W2h, W2l, 61) ^ u64.shrSL(W2h, W2l, 6);
			const SUMl = u64.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
			const SUMh = u64.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
			SHA512_W_H[i] = SUMh | 0;
			SHA512_W_L[i] = SUMl | 0;
		}
		let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
		for (let i = 0; i < 80; i++) {
			const sigma1h = u64.rotrSH(Eh, El, 14) ^ u64.rotrSH(Eh, El, 18) ^ u64.rotrBH(Eh, El, 41);
			const sigma1l = u64.rotrSL(Eh, El, 14) ^ u64.rotrSL(Eh, El, 18) ^ u64.rotrBL(Eh, El, 41);
			const CHIh = Eh & Fh ^ ~Eh & Gh;
			const CHIl = El & Fl ^ ~El & Gl;
			const T1ll = u64.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
			const T1h = u64.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
			const T1l = T1ll | 0;
			const sigma0h = u64.rotrSH(Ah, Al, 28) ^ u64.rotrBH(Ah, Al, 34) ^ u64.rotrBH(Ah, Al, 39);
			const sigma0l = u64.rotrSL(Ah, Al, 28) ^ u64.rotrBL(Ah, Al, 34) ^ u64.rotrBL(Ah, Al, 39);
			const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
			const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
			Hh = Gh | 0;
			Hl = Gl | 0;
			Gh = Fh | 0;
			Gl = Fl | 0;
			Fh = Eh | 0;
			Fl = El | 0;
			({h: Eh, l: El} = u64.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
			Dh = Ch | 0;
			Dl = Cl | 0;
			Ch = Bh | 0;
			Cl = Bl | 0;
			Bh = Ah | 0;
			Bl = Al | 0;
			const All = u64.add3L(T1l, sigma0l, MAJl);
			Ah = u64.add3H(All, T1h, sigma0h, MAJh);
			Al = All | 0;
		}
		({h: Ah, l: Al} = u64.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
		({h: Bh, l: Bl} = u64.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
		({h: Ch, l: Cl} = u64.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
		({h: Dh, l: Dl} = u64.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
		({h: Eh, l: El} = u64.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
		({h: Fh, l: Fl} = u64.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
		({h: Gh, l: Gl} = u64.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
		({h: Hh, l: Hl} = u64.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
		this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
	}
	roundClean() {
		SHA512_W_H.fill(0);
		SHA512_W_L.fill(0);
	}
	destroy() {
		this.buffer.fill(0);
		this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
};
var sha512 = /* @__PURE__ */ wrapConstructor(() => new SHA512());
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@noble/curves/esm/abstract/utils.js
var utils_exports = /* @__PURE__ */ __exportAll({
	aInRange: () => aInRange,
	abool: () => abool,
	abytes: () => abytes,
	bitGet: () => bitGet,
	bitLen: () => bitLen,
	bitMask: () => bitMask,
	bitSet: () => bitSet,
	bytesToHex: () => bytesToHex,
	bytesToNumberBE: () => bytesToNumberBE,
	bytesToNumberLE: () => bytesToNumberLE,
	concatBytes: () => concatBytes,
	createHmacDrbg: () => createHmacDrbg,
	ensureBytes: () => ensureBytes,
	equalBytes: () => equalBytes,
	hexToBytes: () => hexToBytes,
	hexToNumber: () => hexToNumber,
	inRange: () => inRange,
	isBytes: () => isBytes,
	memoized: () => memoized,
	notImplemented: () => notImplemented,
	numberToBytesBE: () => numberToBytesBE,
	numberToBytesLE: () => numberToBytesLE,
	numberToHexUnpadded: () => numberToHexUnpadded,
	numberToVarBytesBE: () => numberToVarBytesBE,
	utf8ToBytes: () => utf8ToBytes,
	validateObject: () => validateObject
});
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$4 = /* @__PURE__ */ BigInt(0);
var _1n$6 = /* @__PURE__ */ BigInt(1);
var _2n$4 = /* @__PURE__ */ BigInt(2);
function isBytes(a) {
	return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
function abytes(item) {
	if (!isBytes(item)) throw new Error("Uint8Array expected");
}
function abool(title, value) {
	if (typeof value !== "boolean") throw new Error(`${title} must be valid boolean, got "${value}".`);
}
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
/**
* @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
*/
function bytesToHex(bytes) {
	abytes(bytes);
	let hex = "";
	for (let i = 0; i < bytes.length; i++) hex += hexes[bytes[i]];
	return hex;
}
function numberToHexUnpadded(num) {
	const hex = num.toString(16);
	return hex.length & 1 ? `0${hex}` : hex;
}
function hexToNumber(hex) {
	if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
	return BigInt(hex === "" ? "0" : `0x${hex}`);
}
var asciis = {
	_0: 48,
	_9: 57,
	_A: 65,
	_F: 70,
	_a: 97,
	_f: 102
};
function asciiToBase16(char) {
	if (char >= asciis._0 && char <= asciis._9) return char - asciis._0;
	if (char >= asciis._A && char <= asciis._F) return char - (asciis._A - 10);
	if (char >= asciis._a && char <= asciis._f) return char - (asciis._a - 10);
}
/**
* @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
*/
function hexToBytes(hex) {
	if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
	const hl = hex.length;
	const al = hl / 2;
	if (hl % 2) throw new Error("padded hex string expected, got unpadded hex of length " + hl);
	const array = new Uint8Array(al);
	for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
		const n1 = asciiToBase16(hex.charCodeAt(hi));
		const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
		if (n1 === void 0 || n2 === void 0) {
			const char = hex[hi] + hex[hi + 1];
			throw new Error("hex string expected, got non-hex character \"" + char + "\" at index " + hi);
		}
		array[ai] = n1 * 16 + n2;
	}
	return array;
}
function bytesToNumberBE(bytes) {
	return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
	abytes(bytes);
	return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n, len) {
	return hexToBytes(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
	return numberToBytesBE(n, len).reverse();
}
function numberToVarBytesBE(n) {
	return hexToBytes(numberToHexUnpadded(n));
}
/**
* Takes hex string or Uint8Array, converts to Uint8Array.
* Validates output length.
* Will throw error for other types.
* @param title descriptive title for an error e.g. 'private key'
* @param hex hex string or Uint8Array
* @param expectedLength optional, will compare to result array's length
* @returns
*/
function ensureBytes(title, hex, expectedLength) {
	let res;
	if (typeof hex === "string") try {
		res = hexToBytes(hex);
	} catch (e) {
		throw new Error(`${title} must be valid hex string, got "${hex}". Cause: ${e}`);
	}
	else if (isBytes(hex)) res = Uint8Array.from(hex);
	else throw new Error(`${title} must be hex string or Uint8Array`);
	const len = res.length;
	if (typeof expectedLength === "number" && len !== expectedLength) throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
	return res;
}
/**
* Copies several Uint8Arrays into one.
*/
function concatBytes(...arrays) {
	let sum = 0;
	for (let i = 0; i < arrays.length; i++) {
		const a = arrays[i];
		abytes(a);
		sum += a.length;
	}
	const res = new Uint8Array(sum);
	for (let i = 0, pad = 0; i < arrays.length; i++) {
		const a = arrays[i];
		res.set(a, pad);
		pad += a.length;
	}
	return res;
}
function equalBytes(a, b) {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
	return diff === 0;
}
/**
* @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
*/
function utf8ToBytes(str) {
	if (typeof str !== "string") throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
	return new Uint8Array(new TextEncoder().encode(str));
}
var isPosBig = (n) => typeof n === "bigint" && _0n$4 <= n;
function inRange(n, min, max) {
	return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
/**
* Asserts min <= n < max. NOTE: It's < max and not <= max.
* @example
* aInRange('x', x, 1n, 256n); // would assume x is in (1n..255n)
*/
function aInRange(title, n, min, max) {
	if (!inRange(n, min, max)) throw new Error(`expected valid ${title}: ${min} <= n < ${max}, got ${typeof n} ${n}`);
}
/**
* Calculates amount of bits in a bigint.
* Same as `n.toString(2).length`
*/
function bitLen(n) {
	let len = 0;
	for (; n > _0n$4; n >>= _1n$6, len += 1);
	return len;
}
/**
* Gets single bit at position.
* NOTE: first bit position is 0 (same as arrays)
* Same as `!!+Array.from(n.toString(2)).reverse()[pos]`
*/
function bitGet(n, pos) {
	return n >> BigInt(pos) & _1n$6;
}
/**
* Sets single bit at position.
*/
function bitSet(n, pos, value) {
	return n | (value ? _1n$6 : _0n$4) << BigInt(pos);
}
/**
* Calculate mask for N bits. Not using ** operator with bigints because of old engines.
* Same as BigInt(`0b${Array(i).fill('1').join('')}`)
*/
var bitMask = (n) => (_2n$4 << BigInt(n - 1)) - _1n$6;
var u8n = (data) => new Uint8Array(data);
var u8fr = (arr) => Uint8Array.from(arr);
/**
* Minimal HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
* @returns function that will call DRBG until 2nd arg returns something meaningful
* @example
*   const drbg = createHmacDRBG<Key>(32, 32, hmac);
*   drbg(seed, bytesToKey); // bytesToKey must return Key or undefined
*/
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
	if (typeof hashLen !== "number" || hashLen < 2) throw new Error("hashLen must be a number");
	if (typeof qByteLen !== "number" || qByteLen < 2) throw new Error("qByteLen must be a number");
	if (typeof hmacFn !== "function") throw new Error("hmacFn must be a function");
	let v = u8n(hashLen);
	let k = u8n(hashLen);
	let i = 0;
	const reset = () => {
		v.fill(1);
		k.fill(0);
		i = 0;
	};
	const h = (...b) => hmacFn(k, v, ...b);
	const reseed = (seed = u8n()) => {
		k = h(u8fr([0]), seed);
		v = h();
		if (seed.length === 0) return;
		k = h(u8fr([1]), seed);
		v = h();
	};
	const gen = () => {
		if (i++ >= 1e3) throw new Error("drbg: tried 1000 values");
		let len = 0;
		const out = [];
		while (len < qByteLen) {
			v = h();
			const sl = v.slice();
			out.push(sl);
			len += v.length;
		}
		return concatBytes(...out);
	};
	const genUntil = (seed, pred) => {
		reset();
		reseed(seed);
		let res = void 0;
		while (!(res = pred(gen()))) reseed();
		reset();
		return res;
	};
	return genUntil;
}
var validatorFns = {
	bigint: (val) => typeof val === "bigint",
	function: (val) => typeof val === "function",
	boolean: (val) => typeof val === "boolean",
	string: (val) => typeof val === "string",
	stringOrUint8Array: (val) => typeof val === "string" || isBytes(val),
	isSafeInteger: (val) => Number.isSafeInteger(val),
	array: (val) => Array.isArray(val),
	field: (val, object) => object.Fp.isValid(val),
	hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
};
function validateObject(object, validators, optValidators = {}) {
	const checkField = (fieldName, type, isOptional) => {
		const checkVal = validatorFns[type];
		if (typeof checkVal !== "function") throw new Error(`Invalid validator "${type}", expected function`);
		const val = object[fieldName];
		if (isOptional && val === void 0) return;
		if (!checkVal(val, object)) throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type}`);
	};
	for (const [fieldName, type] of Object.entries(validators)) checkField(fieldName, type, false);
	for (const [fieldName, type] of Object.entries(optValidators)) checkField(fieldName, type, true);
	return object;
}
/**
* throws not implemented error
*/
var notImplemented = () => {
	throw new Error("not implemented");
};
/**
* Memoizes (caches) computation result.
* Uses WeakMap: the value is going auto-cleaned by GC after last reference is removed.
*/
function memoized(fn) {
	const map = /* @__PURE__ */ new WeakMap();
	return (arg, ...args) => {
		const val = map.get(arg);
		if (val !== void 0) return val;
		const computed = fn(arg, ...args);
		map.set(arg, computed);
		return computed;
	};
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@noble/curves/esm/abstract/modular.js
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$3 = BigInt(0);
var _1n$5 = BigInt(1);
var _2n$3 = BigInt(2);
var _3n$1 = BigInt(3);
var _4n = BigInt(4);
var _5n$1 = BigInt(5);
var _8n$2 = BigInt(8);
var _9n = BigInt(9);
var _16n = BigInt(16);
function mod(a, b) {
	const result = a % b;
	return result >= _0n$3 ? result : b + result;
}
/**
* Efficiently raise num to power and do modular division.
* Unsafe in some contexts: uses ladder, so can expose bigint bits.
* @example
* pow(2n, 6n, 11n) // 64n % 11n == 9n
*/
function pow(num, power, modulo) {
	if (modulo <= _0n$3 || power < _0n$3) throw new Error("Expected power/modulo > 0");
	if (modulo === _1n$5) return _0n$3;
	let res = _1n$5;
	while (power > _0n$3) {
		if (power & _1n$5) res = res * num % modulo;
		num = num * num % modulo;
		power >>= _1n$5;
	}
	return res;
}
function pow2(x, power, modulo) {
	let res = x;
	while (power-- > _0n$3) {
		res *= res;
		res %= modulo;
	}
	return res;
}
function invert(number, modulo) {
	if (number === _0n$3 || modulo <= _0n$3) throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
	let a = mod(number, modulo);
	let b = modulo;
	let x = _0n$3, y = _1n$5, u = _1n$5, v = _0n$3;
	while (a !== _0n$3) {
		const q = b / a;
		const r = b % a;
		const m = x - u * q;
		const n = y - v * q;
		b = a, a = r, x = u, y = v, u = m, v = n;
	}
	if (b !== _1n$5) throw new Error("invert: does not exist");
	return mod(x, modulo);
}
/**
* Tonelli-Shanks square root search algorithm.
* 1. https://eprint.iacr.org/2012/685.pdf (page 12)
* 2. Square Roots from 1; 24, 51, 10 to Dan Shanks
* Will start an infinite loop if field order P is not prime.
* @param P field order
* @returns function that takes field Fp (created from P) and number n
*/
function tonelliShanks(P) {
	const legendreC = (P - _1n$5) / _2n$3;
	let Q, S, Z;
	for (Q = P - _1n$5, S = 0; Q % _2n$3 === _0n$3; Q /= _2n$3, S++);
	for (Z = _2n$3; Z < P && pow(Z, legendreC, P) !== P - _1n$5; Z++);
	if (S === 1) {
		const p1div4 = (P + _1n$5) / _4n;
		return function tonelliFast(Fp, n) {
			const root = Fp.pow(n, p1div4);
			if (!Fp.eql(Fp.sqr(root), n)) throw new Error("Cannot find square root");
			return root;
		};
	}
	const Q1div2 = (Q + _1n$5) / _2n$3;
	return function tonelliSlow(Fp, n) {
		if (Fp.pow(n, legendreC) === Fp.neg(Fp.ONE)) throw new Error("Cannot find square root");
		let r = S;
		let g = Fp.pow(Fp.mul(Fp.ONE, Z), Q);
		let x = Fp.pow(n, Q1div2);
		let b = Fp.pow(n, Q);
		while (!Fp.eql(b, Fp.ONE)) {
			if (Fp.eql(b, Fp.ZERO)) return Fp.ZERO;
			let m = 1;
			for (let t2 = Fp.sqr(b); m < r; m++) {
				if (Fp.eql(t2, Fp.ONE)) break;
				t2 = Fp.sqr(t2);
			}
			const ge = Fp.pow(g, _1n$5 << BigInt(r - m - 1));
			g = Fp.sqr(ge);
			x = Fp.mul(x, ge);
			b = Fp.mul(b, g);
			r = m;
		}
		return x;
	};
}
function FpSqrt(P) {
	if (P % _4n === _3n$1) {
		const p1div4 = (P + _1n$5) / _4n;
		return function sqrt3mod4(Fp, n) {
			const root = Fp.pow(n, p1div4);
			if (!Fp.eql(Fp.sqr(root), n)) throw new Error("Cannot find square root");
			return root;
		};
	}
	if (P % _8n$2 === _5n$1) {
		const c1 = (P - _5n$1) / _8n$2;
		return function sqrt5mod8(Fp, n) {
			const n2 = Fp.mul(n, _2n$3);
			const v = Fp.pow(n2, c1);
			const nv = Fp.mul(n, v);
			const i = Fp.mul(Fp.mul(nv, _2n$3), v);
			const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
			if (!Fp.eql(Fp.sqr(root), n)) throw new Error("Cannot find square root");
			return root;
		};
	}
	if (P % _16n === _9n) {}
	return tonelliShanks(P);
}
var isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n$5) === _1n$5;
var FIELD_FIELDS = [
	"create",
	"isValid",
	"is0",
	"neg",
	"inv",
	"sqrt",
	"sqr",
	"eql",
	"add",
	"sub",
	"mul",
	"pow",
	"div",
	"addN",
	"subN",
	"mulN",
	"sqrN"
];
function validateField(field) {
	return validateObject(field, FIELD_FIELDS.reduce((map, val) => {
		map[val] = "function";
		return map;
	}, {
		ORDER: "bigint",
		MASK: "bigint",
		BYTES: "isSafeInteger",
		BITS: "isSafeInteger"
	}));
}
/**
* Same as `pow` but for Fp: non-constant-time.
* Unsafe in some contexts: uses ladder, so can expose bigint bits.
*/
function FpPow(f, num, power) {
	if (power < _0n$3) throw new Error("Expected power > 0");
	if (power === _0n$3) return f.ONE;
	if (power === _1n$5) return num;
	let p = f.ONE;
	let d = num;
	while (power > _0n$3) {
		if (power & _1n$5) p = f.mul(p, d);
		d = f.sqr(d);
		power >>= _1n$5;
	}
	return p;
}
/**
* Efficiently invert an array of Field elements.
* `inv(0)` will return `undefined` here: make sure to throw an error.
*/
function FpInvertBatch(f, nums) {
	const tmp = new Array(nums.length);
	const lastMultiplied = nums.reduce((acc, num, i) => {
		if (f.is0(num)) return acc;
		tmp[i] = acc;
		return f.mul(acc, num);
	}, f.ONE);
	const inverted = f.inv(lastMultiplied);
	nums.reduceRight((acc, num, i) => {
		if (f.is0(num)) return acc;
		tmp[i] = f.mul(acc, tmp[i]);
		return f.mul(acc, num);
	}, inverted);
	return tmp;
}
function nLength(n, nBitLength) {
	const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
	return {
		nBitLength: _nBitLength,
		nByteLength: Math.ceil(_nBitLength / 8)
	};
}
/**
* Initializes a finite field over prime. **Non-primes are not supported.**
* Do not init in loop: slow. Very fragile: always run a benchmark on a change.
* Major performance optimizations:
* * a) denormalized operations like mulN instead of mul
* * b) same object shape: never add or remove keys
* * c) Object.freeze
* NOTE: operations don't check 'isValid' for all elements for performance reasons,
* it is caller responsibility to check this.
* This is low-level code, please make sure you know what you doing.
* @param ORDER prime positive bigint
* @param bitLen how many bits the field consumes
* @param isLE (def: false) if encoding / decoding should be in little-endian
* @param redef optional faster redefinitions of sqrt and other methods
*/
function Field(ORDER, bitLen, isLE = false, redef = {}) {
	if (ORDER <= _0n$3) throw new Error(`Expected Field ORDER > 0, got ${ORDER}`);
	const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen);
	if (BYTES > 2048) throw new Error("Field lengths over 2048 bytes are not supported");
	const sqrtP = FpSqrt(ORDER);
	const f = Object.freeze({
		ORDER,
		BITS,
		BYTES,
		MASK: bitMask(BITS),
		ZERO: _0n$3,
		ONE: _1n$5,
		create: (num) => mod(num, ORDER),
		isValid: (num) => {
			if (typeof num !== "bigint") throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
			return _0n$3 <= num && num < ORDER;
		},
		is0: (num) => num === _0n$3,
		isOdd: (num) => (num & _1n$5) === _1n$5,
		neg: (num) => mod(-num, ORDER),
		eql: (lhs, rhs) => lhs === rhs,
		sqr: (num) => mod(num * num, ORDER),
		add: (lhs, rhs) => mod(lhs + rhs, ORDER),
		sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
		mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
		pow: (num, power) => FpPow(f, num, power),
		div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
		sqrN: (num) => num * num,
		addN: (lhs, rhs) => lhs + rhs,
		subN: (lhs, rhs) => lhs - rhs,
		mulN: (lhs, rhs) => lhs * rhs,
		inv: (num) => invert(num, ORDER),
		sqrt: redef.sqrt || ((n) => sqrtP(f, n)),
		invertBatch: (lst) => FpInvertBatch(f, lst),
		cmov: (a, b, c) => c ? b : a,
		toBytes: (num) => isLE ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
		fromBytes: (bytes) => {
			if (bytes.length !== BYTES) throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes.length}`);
			return isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
		}
	});
	return Object.freeze(f);
}
/**
* Returns total number of bytes consumed by the field element.
* For example, 32 bytes for usual 256-bit weierstrass curve.
* @param fieldOrder number of field elements, usually CURVE.n
* @returns byte length of field
*/
function getFieldBytesLength(fieldOrder) {
	if (typeof fieldOrder !== "bigint") throw new Error("field order must be bigint");
	const bitLength = fieldOrder.toString(2).length;
	return Math.ceil(bitLength / 8);
}
/**
* Returns minimal amount of bytes that can be safely reduced
* by field order.
* Should be 2^-128 for 128-bit curve such as P256.
* @param fieldOrder number of field elements, usually CURVE.n
* @returns byte length of target hash
*/
function getMinHashLength(fieldOrder) {
	const length = getFieldBytesLength(fieldOrder);
	return length + Math.ceil(length / 2);
}
/**
* "Constant-time" private key generation utility.
* Can take (n + n/2) or more bytes of uniform input e.g. from CSPRNG or KDF
* and convert them into private scalar, with the modulo bias being negligible.
* Needs at least 48 bytes of input for 32-byte private key.
* https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/
* FIPS 186-5, A.2 https://csrc.nist.gov/publications/detail/fips/186/5/final
* RFC 9380, https://www.rfc-editor.org/rfc/rfc9380#section-5
* @param hash hash output from SHA3 or a similar function
* @param groupOrder size of subgroup - (e.g. secp256k1.CURVE.n)
* @param isLE interpret hash bytes as LE num
* @returns valid private scalar
*/
function mapHashToField(key, fieldOrder, isLE = false) {
	const len = key.length;
	const fieldLen = getFieldBytesLength(fieldOrder);
	const minLen = getMinHashLength(fieldOrder);
	if (len < 16 || len < minLen || len > 1024) throw new Error(`expected ${minLen}-1024 bytes of input, got ${len}`);
	const reduced = mod(isLE ? bytesToNumberBE(key) : bytesToNumberLE(key), fieldOrder - _1n$5) + _1n$5;
	return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@noble/curves/esm/abstract/curve.js
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$2 = BigInt(0);
var _1n$4 = BigInt(1);
var pointPrecomputes = /* @__PURE__ */ new WeakMap();
var pointWindowSizes = /* @__PURE__ */ new WeakMap();
function wNAF(c, bits) {
	const constTimeNegate = (condition, item) => {
		const neg = item.negate();
		return condition ? neg : item;
	};
	const validateW = (W) => {
		if (!Number.isSafeInteger(W) || W <= 0 || W > bits) throw new Error(`Wrong window size=${W}, should be [1..${bits}]`);
	};
	const opts = (W) => {
		validateW(W);
		return {
			windows: Math.ceil(bits / W) + 1,
			windowSize: 2 ** (W - 1)
		};
	};
	return {
		constTimeNegate,
		unsafeLadder(elm, n) {
			let p = c.ZERO;
			let d = elm;
			while (n > _0n$2) {
				if (n & _1n$4) p = p.add(d);
				d = d.double();
				n >>= _1n$4;
			}
			return p;
		},
		/**
		* Creates a wNAF precomputation window. Used for caching.
		* Default window size is set by `utils.precompute()` and is equal to 8.
		* Number of precomputed points depends on the curve size:
		* 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
		* - 𝑊 is the window size
		* - 𝑛 is the bitlength of the curve order.
		* For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
		* @returns precomputed point tables flattened to a single array
		*/
		precomputeWindow(elm, W) {
			const { windows, windowSize } = opts(W);
			const points = [];
			let p = elm;
			let base = p;
			for (let window = 0; window < windows; window++) {
				base = p;
				points.push(base);
				for (let i = 1; i < windowSize; i++) {
					base = base.add(p);
					points.push(base);
				}
				p = base.double();
			}
			return points;
		},
		/**
		* Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
		* @param W window size
		* @param precomputes precomputed tables
		* @param n scalar (we don't check here, but should be less than curve order)
		* @returns real and fake (for const-time) points
		*/
		wNAF(W, precomputes, n) {
			const { windows, windowSize } = opts(W);
			let p = c.ZERO;
			let f = c.BASE;
			const mask = BigInt(2 ** W - 1);
			const maxNumber = 2 ** W;
			const shiftBy = BigInt(W);
			for (let window = 0; window < windows; window++) {
				const offset = window * windowSize;
				let wbits = Number(n & mask);
				n >>= shiftBy;
				if (wbits > windowSize) {
					wbits -= maxNumber;
					n += _1n$4;
				}
				const offset1 = offset;
				const offset2 = offset + Math.abs(wbits) - 1;
				const cond1 = window % 2 !== 0;
				const cond2 = wbits < 0;
				if (wbits === 0) f = f.add(constTimeNegate(cond1, precomputes[offset1]));
				else p = p.add(constTimeNegate(cond2, precomputes[offset2]));
			}
			return {
				p,
				f
			};
		},
		wNAFCached(P, n, transform) {
			const W = pointWindowSizes.get(P) || 1;
			let comp = pointPrecomputes.get(P);
			if (!comp) {
				comp = this.precomputeWindow(P, W);
				if (W !== 1) pointPrecomputes.set(P, transform(comp));
			}
			return this.wNAF(W, comp, n);
		},
		setWindowSize(P, W) {
			validateW(W);
			pointWindowSizes.set(P, W);
			pointPrecomputes.delete(P);
		}
	};
}
/**
* Pippenger algorithm for multi-scalar multiplication (MSM).
* MSM is basically (Pa + Qb + Rc + ...).
* 30x faster vs naive addition on L=4096, 10x faster with precomputes.
* For N=254bit, L=1, it does: 1024 ADD + 254 DBL. For L=5: 1536 ADD + 254 DBL.
* Algorithmically constant-time (for same L), even when 1 point + scalar, or when scalar = 0.
* @param c Curve Point constructor
* @param field field over CURVE.N - important that it's not over CURVE.P
* @param points array of L curve points
* @param scalars array of L scalars (aka private keys / bigints)
*/
function pippenger(c, field, points, scalars) {
	if (!Array.isArray(points) || !Array.isArray(scalars) || scalars.length !== points.length) throw new Error("arrays of points and scalars must have equal length");
	scalars.forEach((s, i) => {
		if (!field.isValid(s)) throw new Error(`wrong scalar at index ${i}`);
	});
	points.forEach((p, i) => {
		if (!(p instanceof c)) throw new Error(`wrong point at index ${i}`);
	});
	const wbits = bitLen(BigInt(points.length));
	const windowSize = wbits > 12 ? wbits - 3 : wbits > 4 ? wbits - 2 : wbits ? 2 : 1;
	const MASK = (1 << windowSize) - 1;
	const buckets = new Array(MASK + 1).fill(c.ZERO);
	const lastBits = Math.floor((field.BITS - 1) / windowSize) * windowSize;
	let sum = c.ZERO;
	for (let i = lastBits; i >= 0; i -= windowSize) {
		buckets.fill(c.ZERO);
		for (let j = 0; j < scalars.length; j++) {
			const scalar = scalars[j];
			const wbits = Number(scalar >> BigInt(i) & BigInt(MASK));
			buckets[wbits] = buckets[wbits].add(points[j]);
		}
		let resI = c.ZERO;
		for (let j = buckets.length - 1, sumI = c.ZERO; j > 0; j--) {
			sumI = sumI.add(buckets[j]);
			resI = resI.add(sumI);
		}
		sum = sum.add(resI);
		if (i !== 0) for (let j = 0; j < windowSize; j++) sum = sum.double();
	}
	return sum;
}
function validateBasic(curve) {
	validateField(curve.Fp);
	validateObject(curve, {
		n: "bigint",
		h: "bigint",
		Gx: "field",
		Gy: "field"
	}, {
		nBitLength: "isSafeInteger",
		nByteLength: "isSafeInteger"
	});
	return Object.freeze({
		...nLength(curve.n, curve.nBitLength),
		...curve,
		p: curve.Fp.ORDER
	});
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@noble/curves/esm/abstract/edwards.js
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$1 = BigInt(0);
var _1n$3 = BigInt(1);
var _2n$2 = BigInt(2);
var _8n$1 = BigInt(8);
var VERIFY_DEFAULT = { zip215: true };
function validateOpts$1(curve) {
	const opts = validateBasic(curve);
	validateObject(curve, {
		hash: "function",
		a: "bigint",
		d: "bigint",
		randomBytes: "function"
	}, {
		adjustScalarBytes: "function",
		domain: "function",
		uvRatio: "function",
		mapToCurve: "function"
	});
	return Object.freeze({ ...opts });
}
/**
* Creates Twisted Edwards curve with EdDSA signatures.
* @example
* import { Field } from '@noble/curves/abstract/modular';
* // Before that, define BigInt-s: a, d, p, n, Gx, Gy, h
* const curve = twistedEdwards({ a, d, Fp: Field(p), n, Gx, Gy, h })
*/
function twistedEdwards(curveDef) {
	const CURVE = validateOpts$1(curveDef);
	const { Fp, n: CURVE_ORDER, prehash, hash: cHash, randomBytes, nByteLength, h: cofactor } = CURVE;
	const MASK = _2n$2 << BigInt(nByteLength * 8) - _1n$3;
	const modP = Fp.create;
	const Fn = Field(CURVE.n, CURVE.nBitLength);
	const uvRatio = CURVE.uvRatio || ((u, v) => {
		try {
			return {
				isValid: true,
				value: Fp.sqrt(u * Fp.inv(v))
			};
		} catch (e) {
			return {
				isValid: false,
				value: _0n$1
			};
		}
	});
	const adjustScalarBytes = CURVE.adjustScalarBytes || ((bytes) => bytes);
	const domain = CURVE.domain || ((data, ctx, phflag) => {
		abool("phflag", phflag);
		if (ctx.length || phflag) throw new Error("Contexts/pre-hash are not supported");
		return data;
	});
	function aCoordinate(title, n) {
		aInRange("coordinate " + title, n, _0n$1, MASK);
	}
	function assertPoint(other) {
		if (!(other instanceof Point)) throw new Error("ExtendedPoint expected");
	}
	const toAffineMemo = memoized((p, iz) => {
		const { ex: x, ey: y, ez: z } = p;
		const is0 = p.is0();
		if (iz == null) iz = is0 ? _8n$1 : Fp.inv(z);
		const ax = modP(x * iz);
		const ay = modP(y * iz);
		const zz = modP(z * iz);
		if (is0) return {
			x: _0n$1,
			y: _1n$3
		};
		if (zz !== _1n$3) throw new Error("invZ was invalid");
		return {
			x: ax,
			y: ay
		};
	});
	const assertValidMemo = memoized((p) => {
		const { a, d } = CURVE;
		if (p.is0()) throw new Error("bad point: ZERO");
		const { ex: X, ey: Y, ez: Z, et: T } = p;
		const X2 = modP(X * X);
		const Y2 = modP(Y * Y);
		const Z2 = modP(Z * Z);
		const Z4 = modP(Z2 * Z2);
		const aX2 = modP(X2 * a);
		if (modP(Z2 * modP(aX2 + Y2)) !== modP(Z4 + modP(d * modP(X2 * Y2)))) throw new Error("bad point: equation left != right (1)");
		if (modP(X * Y) !== modP(Z * T)) throw new Error("bad point: equation left != right (2)");
		return true;
	});
	class Point {
		constructor(ex, ey, ez, et) {
			this.ex = ex;
			this.ey = ey;
			this.ez = ez;
			this.et = et;
			aCoordinate("x", ex);
			aCoordinate("y", ey);
			aCoordinate("z", ez);
			aCoordinate("t", et);
			Object.freeze(this);
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		static fromAffine(p) {
			if (p instanceof Point) throw new Error("extended point not allowed");
			const { x, y } = p || {};
			aCoordinate("x", x);
			aCoordinate("y", y);
			return new Point(x, y, _1n$3, modP(x * y));
		}
		static normalizeZ(points) {
			const toInv = Fp.invertBatch(points.map((p) => p.ez));
			return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
		}
		static msm(points, scalars) {
			return pippenger(Point, Fn, points, scalars);
		}
		_setWindowSize(windowSize) {
			wnaf.setWindowSize(this, windowSize);
		}
		assertValidity() {
			assertValidMemo(this);
		}
		equals(other) {
			assertPoint(other);
			const { ex: X1, ey: Y1, ez: Z1 } = this;
			const { ex: X2, ey: Y2, ez: Z2 } = other;
			const X1Z2 = modP(X1 * Z2);
			const X2Z1 = modP(X2 * Z1);
			const Y1Z2 = modP(Y1 * Z2);
			const Y2Z1 = modP(Y2 * Z1);
			return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
		}
		is0() {
			return this.equals(Point.ZERO);
		}
		negate() {
			return new Point(modP(-this.ex), this.ey, this.ez, modP(-this.et));
		}
		double() {
			const { a } = CURVE;
			const { ex: X1, ey: Y1, ez: Z1 } = this;
			const A = modP(X1 * X1);
			const B = modP(Y1 * Y1);
			const C = modP(_2n$2 * modP(Z1 * Z1));
			const D = modP(a * A);
			const x1y1 = X1 + Y1;
			const E = modP(modP(x1y1 * x1y1) - A - B);
			const G = D + B;
			const F = G - C;
			const H = D - B;
			const X3 = modP(E * F);
			const Y3 = modP(G * H);
			const T3 = modP(E * H);
			const Z3 = modP(F * G);
			return new Point(X3, Y3, Z3, T3);
		}
		add(other) {
			assertPoint(other);
			const { a, d } = CURVE;
			const { ex: X1, ey: Y1, ez: Z1, et: T1 } = this;
			const { ex: X2, ey: Y2, ez: Z2, et: T2 } = other;
			if (a === BigInt(-1)) {
				const A = modP((Y1 - X1) * (Y2 + X2));
				const B = modP((Y1 + X1) * (Y2 - X2));
				const F = modP(B - A);
				if (F === _0n$1) return this.double();
				const C = modP(Z1 * _2n$2 * T2);
				const D = modP(T1 * _2n$2 * Z2);
				const E = D + C;
				const G = B + A;
				const H = D - C;
				const X3 = modP(E * F);
				const Y3 = modP(G * H);
				const T3 = modP(E * H);
				const Z3 = modP(F * G);
				return new Point(X3, Y3, Z3, T3);
			}
			const A = modP(X1 * X2);
			const B = modP(Y1 * Y2);
			const C = modP(T1 * d * T2);
			const D = modP(Z1 * Z2);
			const E = modP((X1 + Y1) * (X2 + Y2) - A - B);
			const F = D - C;
			const G = D + C;
			const H = modP(B - a * A);
			const X3 = modP(E * F);
			const Y3 = modP(G * H);
			const T3 = modP(E * H);
			const Z3 = modP(F * G);
			return new Point(X3, Y3, Z3, T3);
		}
		subtract(other) {
			return this.add(other.negate());
		}
		wNAF(n) {
			return wnaf.wNAFCached(this, n, Point.normalizeZ);
		}
		multiply(scalar) {
			const n = scalar;
			aInRange("scalar", n, _1n$3, CURVE_ORDER);
			const { p, f } = this.wNAF(n);
			return Point.normalizeZ([p, f])[0];
		}
		multiplyUnsafe(scalar) {
			const n = scalar;
			aInRange("scalar", n, _0n$1, CURVE_ORDER);
			if (n === _0n$1) return I;
			if (this.equals(I) || n === _1n$3) return this;
			if (this.equals(G)) return this.wNAF(n).p;
			return wnaf.unsafeLadder(this, n);
		}
		isSmallOrder() {
			return this.multiplyUnsafe(cofactor).is0();
		}
		isTorsionFree() {
			return wnaf.unsafeLadder(this, CURVE_ORDER).is0();
		}
		toAffine(iz) {
			return toAffineMemo(this, iz);
		}
		clearCofactor() {
			const { h: cofactor } = CURVE;
			if (cofactor === _1n$3) return this;
			return this.multiplyUnsafe(cofactor);
		}
		static fromHex(hex, zip215 = false) {
			const { d, a } = CURVE;
			const len = Fp.BYTES;
			hex = ensureBytes("pointHex", hex, len);
			abool("zip215", zip215);
			const normed = hex.slice();
			const lastByte = hex[len - 1];
			normed[len - 1] = lastByte & -129;
			const y = bytesToNumberLE(normed);
			aInRange("pointHex.y", y, _0n$1, zip215 ? MASK : Fp.ORDER);
			const y2 = modP(y * y);
			const u = modP(y2 - _1n$3);
			const v = modP(d * y2 - a);
			let { isValid, value: x } = uvRatio(u, v);
			if (!isValid) throw new Error("Point.fromHex: invalid y coordinate");
			const isXOdd = (x & _1n$3) === _1n$3;
			const isLastByteOdd = (lastByte & 128) !== 0;
			if (!zip215 && x === _0n$1 && isLastByteOdd) throw new Error("Point.fromHex: x=0 and x_0=1");
			if (isLastByteOdd !== isXOdd) x = modP(-x);
			return Point.fromAffine({
				x,
				y
			});
		}
		static fromPrivateKey(privKey) {
			return getExtendedPublicKey(privKey).point;
		}
		toRawBytes() {
			const { x, y } = this.toAffine();
			const bytes = numberToBytesLE(y, Fp.BYTES);
			bytes[bytes.length - 1] |= x & _1n$3 ? 128 : 0;
			return bytes;
		}
		toHex() {
			return bytesToHex(this.toRawBytes());
		}
	}
	Point.BASE = new Point(CURVE.Gx, CURVE.Gy, _1n$3, modP(CURVE.Gx * CURVE.Gy));
	Point.ZERO = new Point(_0n$1, _1n$3, _1n$3, _0n$1);
	const { BASE: G, ZERO: I } = Point;
	const wnaf = wNAF(Point, nByteLength * 8);
	function modN(a) {
		return mod(a, CURVE_ORDER);
	}
	function modN_LE(hash) {
		return modN(bytesToNumberLE(hash));
	}
	/** Convenience method that creates public key and other stuff. RFC8032 5.1.5 */
	function getExtendedPublicKey(key) {
		const len = nByteLength;
		key = ensureBytes("private key", key, len);
		const hashed = ensureBytes("hashed private key", cHash(key), 2 * len);
		const head = adjustScalarBytes(hashed.slice(0, len));
		const prefix = hashed.slice(len, 2 * len);
		const scalar = modN_LE(head);
		const point = G.multiply(scalar);
		return {
			head,
			prefix,
			scalar,
			point,
			pointBytes: point.toRawBytes()
		};
	}
	function getPublicKey(privKey) {
		return getExtendedPublicKey(privKey).pointBytes;
	}
	function hashDomainToScalar(context = /* @__PURE__ */ new Uint8Array(), ...msgs) {
		const msg = concatBytes(...msgs);
		return modN_LE(cHash(domain(msg, ensureBytes("context", context), !!prehash)));
	}
	/** Signs message with privateKey. RFC8032 5.1.6 */
	function sign(msg, privKey, options = {}) {
		msg = ensureBytes("message", msg);
		if (prehash) msg = prehash(msg);
		const { prefix, scalar, pointBytes } = getExtendedPublicKey(privKey);
		const r = hashDomainToScalar(options.context, prefix, msg);
		const R = G.multiply(r).toRawBytes();
		const s = modN(r + hashDomainToScalar(options.context, R, pointBytes, msg) * scalar);
		aInRange("signature.s", s, _0n$1, CURVE_ORDER);
		return ensureBytes("result", concatBytes(R, numberToBytesLE(s, Fp.BYTES)), nByteLength * 2);
	}
	const verifyOpts = VERIFY_DEFAULT;
	function verify(sig, msg, publicKey, options = verifyOpts) {
		const { context, zip215 } = options;
		const len = Fp.BYTES;
		sig = ensureBytes("signature", sig, 2 * len);
		msg = ensureBytes("message", msg);
		if (zip215 !== void 0) abool("zip215", zip215);
		if (prehash) msg = prehash(msg);
		const s = bytesToNumberLE(sig.slice(len, 2 * len));
		let A, R, SB;
		try {
			A = Point.fromHex(publicKey, zip215);
			R = Point.fromHex(sig.slice(0, len), zip215);
			SB = G.multiplyUnsafe(s);
		} catch (error) {
			return false;
		}
		if (!zip215 && A.isSmallOrder()) return false;
		const k = hashDomainToScalar(context, R.toRawBytes(), A.toRawBytes(), msg);
		return R.add(A.multiplyUnsafe(k)).subtract(SB).clearCofactor().equals(Point.ZERO);
	}
	G._setWindowSize(8);
	return {
		CURVE,
		getPublicKey,
		sign,
		verify,
		ExtendedPoint: Point,
		utils: {
			getExtendedPublicKey,
			randomPrivateKey: () => randomBytes(Fp.BYTES),
			/**
			* We're doing scalar multiplication (used in getPublicKey etc) with precomputed BASE_POINT
			* values. This slows down first getPublicKey() by milliseconds (see Speed section),
			* but allows to speed-up subsequent getPublicKey() calls up to 20x.
			* @param windowSize 2, 4, 8, 16
			*/
			precompute(windowSize = 8, point = Point.BASE) {
				point._setWindowSize(windowSize);
				point.multiply(BigInt(3));
				return point;
			}
		}
	};
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@noble/curves/esm/ed25519.js
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/**
* ed25519 Twisted Edwards curve with following addons:
* - X25519 ECDH
* - Ristretto cofactor elimination
* - Elligator hash-to-group / point indistinguishability
*/
var ED25519_P = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949");
var ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
var _1n$2 = BigInt(1);
var _2n$1 = BigInt(2);
var _5n = BigInt(5);
var _8n = BigInt(8);
function ed25519_pow_2_252_3(x) {
	const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
	const P = ED25519_P;
	const b2 = x * x % P * x % P;
	const b5 = pow2(pow2(b2, _2n$1, P) * b2 % P, _1n$2, P) * x % P;
	const b10 = pow2(b5, _5n, P) * b5 % P;
	const b20 = pow2(b10, _10n, P) * b10 % P;
	const b40 = pow2(b20, _20n, P) * b20 % P;
	const b80 = pow2(b40, _40n, P) * b40 % P;
	return {
		pow_p_5_8: pow2(pow2(pow2(pow2(b80, _80n, P) * b80 % P, _80n, P) * b80 % P, _10n, P) * b10 % P, _2n$1, P) * x % P,
		b2
	};
}
function adjustScalarBytes(bytes) {
	bytes[0] &= 248;
	bytes[31] &= 127;
	bytes[31] |= 64;
	return bytes;
}
function uvRatio(u, v) {
	const P = ED25519_P;
	const v3 = mod(v * v * v, P);
	const pow = ed25519_pow_2_252_3(u * mod(v3 * v3 * v, P)).pow_p_5_8;
	let x = mod(u * v3 * pow, P);
	const vx2 = mod(v * x * x, P);
	const root1 = x;
	const root2 = mod(x * ED25519_SQRT_M1, P);
	const useRoot1 = vx2 === u;
	const useRoot2 = vx2 === mod(-u, P);
	const noRoot = vx2 === mod(-u * ED25519_SQRT_M1, P);
	if (useRoot1) x = root1;
	if (useRoot2 || noRoot) x = root2;
	if (isNegativeLE(x, P)) x = mod(-x, P);
	return {
		isValid: useRoot1 || useRoot2,
		value: x
	};
}
var Fp$1 = /* @__PURE__ */ (() => Field(ED25519_P, void 0, true))();
var ed25519Defaults = /* @__PURE__ */ (() => ({
	a: BigInt(-1),
	d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
	Fp: Fp$1,
	n: BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"),
	h: _8n,
	Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
	Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960"),
	hash: sha512,
	randomBytes: randomBytes$1,
	adjustScalarBytes,
	uvRatio
}))();
/**
* ed25519 curve with EdDSA signatures.
*/
var ed25519 = /* @__PURE__ */ (() => twistedEdwards(ed25519Defaults))();
function hashAndVerify$2(publicKey, sig, msg) {
	return ed25519.verify(sig, msg instanceof Uint8Array ? msg : msg.subarray(), publicKey);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/crypto/dist/src/keys/ed25519/ed25519.js
var Ed25519PublicKey = class {
	type = "Ed25519";
	raw;
	constructor(key) {
		this.raw = ensureEd25519Key(key, 32);
	}
	toMultihash() {
		return identity.digest(publicKeyToProtobuf(this));
	}
	toCID() {
		return CID.createV1(114, this.toMultihash());
	}
	toString() {
		return base58btc.encode(this.toMultihash().bytes).substring(1);
	}
	equals(key) {
		if (key == null || !(key.raw instanceof Uint8Array)) return false;
		return equals(this.raw, key.raw);
	}
	verify(data, sig) {
		return hashAndVerify$2(this.raw, sig, data);
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/crypto/dist/src/keys/ed25519/utils.js
function unmarshalEd25519PublicKey(bytes) {
	bytes = ensureEd25519Key(bytes, 32);
	return new Ed25519PublicKey(bytes);
}
function ensureEd25519Key(key, length) {
	key = Uint8Array.from(key ?? []);
	if (key.length !== length) throw new InvalidParametersError(`Key must be a Uint8Array of length ${length}, got ${key.length}`);
	return key;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/crypto/dist/src/keys/keys.js
var KeyType;
(function(KeyType) {
	KeyType["RSA"] = "RSA";
	KeyType["Ed25519"] = "Ed25519";
	KeyType["secp256k1"] = "secp256k1";
})(KeyType || (KeyType = {}));
var __KeyTypeValues;
(function(__KeyTypeValues) {
	__KeyTypeValues[__KeyTypeValues["RSA"] = 0] = "RSA";
	__KeyTypeValues[__KeyTypeValues["Ed25519"] = 1] = "Ed25519";
	__KeyTypeValues[__KeyTypeValues["secp256k1"] = 2] = "secp256k1";
})(__KeyTypeValues || (__KeyTypeValues = {}));
(function(KeyType) {
	KeyType.codec = () => {
		return enumeration(__KeyTypeValues);
	};
})(KeyType || (KeyType = {}));
var PublicKey;
(function(PublicKey) {
	let _codec;
	PublicKey.codec = () => {
		if (_codec == null) _codec = message((obj, w, opts = {}) => {
			if (opts.lengthDelimited !== false) w.fork();
			if (obj.Type != null) {
				w.uint32(8);
				KeyType.codec().encode(obj.Type, w);
			}
			if (obj.Data != null) {
				w.uint32(18);
				w.bytes(obj.Data);
			}
			if (opts.lengthDelimited !== false) w.ldelim();
		}, (reader, length, opts = {}) => {
			const obj = {};
			const end = length == null ? reader.len : reader.pos + length;
			while (reader.pos < end) {
				const tag = reader.uint32();
				switch (tag >>> 3) {
					case 1:
						obj.Type = KeyType.codec().decode(reader);
						break;
					case 2:
						obj.Data = reader.bytes();
						break;
					default: reader.skipType(tag & 7);
				}
			}
			return obj;
		});
		return _codec;
	};
	PublicKey.encode = (obj) => {
		return encodeMessage(obj, PublicKey.codec());
	};
	PublicKey.decode = (buf, opts) => {
		return decodeMessage(buf, PublicKey.codec(), opts);
	};
})(PublicKey || (PublicKey = {}));
var PrivateKey;
(function(PrivateKey) {
	let _codec;
	PrivateKey.codec = () => {
		if (_codec == null) _codec = message((obj, w, opts = {}) => {
			if (opts.lengthDelimited !== false) w.fork();
			if (obj.Type != null) {
				w.uint32(8);
				KeyType.codec().encode(obj.Type, w);
			}
			if (obj.Data != null) {
				w.uint32(18);
				w.bytes(obj.Data);
			}
			if (opts.lengthDelimited !== false) w.ldelim();
		}, (reader, length, opts = {}) => {
			const obj = {};
			const end = length == null ? reader.len : reader.pos + length;
			while (reader.pos < end) {
				const tag = reader.uint32();
				switch (tag >>> 3) {
					case 1:
						obj.Type = KeyType.codec().decode(reader);
						break;
					case 2:
						obj.Data = reader.bytes();
						break;
					default: reader.skipType(tag & 7);
				}
			}
			return obj;
		});
		return _codec;
	};
	PrivateKey.encode = (obj) => {
		return encodeMessage(obj, PrivateKey.codec());
	};
	PrivateKey.decode = (buf, opts) => {
		return decodeMessage(buf, PrivateKey.codec(), opts);
	};
})(PrivateKey || (PrivateKey = {}));
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@noble/hashes/esm/sha256.js
var SHA256_K = /* @__PURE__ */ new Uint32Array([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
var SHA256_IV = /* @__PURE__ */ new Uint32Array([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA256 = class extends HashMD {
	constructor() {
		super(64, 32, 8, false);
		this.A = SHA256_IV[0] | 0;
		this.B = SHA256_IV[1] | 0;
		this.C = SHA256_IV[2] | 0;
		this.D = SHA256_IV[3] | 0;
		this.E = SHA256_IV[4] | 0;
		this.F = SHA256_IV[5] | 0;
		this.G = SHA256_IV[6] | 0;
		this.H = SHA256_IV[7] | 0;
	}
	get() {
		const { A, B, C, D, E, F, G, H } = this;
		return [
			A,
			B,
			C,
			D,
			E,
			F,
			G,
			H
		];
	}
	set(A, B, C, D, E, F, G, H) {
		this.A = A | 0;
		this.B = B | 0;
		this.C = C | 0;
		this.D = D | 0;
		this.E = E | 0;
		this.F = F | 0;
		this.G = G | 0;
		this.H = H | 0;
	}
	process(view, offset) {
		for (let i = 0; i < 16; i++, offset += 4) SHA256_W[i] = view.getUint32(offset, false);
		for (let i = 16; i < 64; i++) {
			const W15 = SHA256_W[i - 15];
			const W2 = SHA256_W[i - 2];
			const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
			const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
			SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
		}
		let { A, B, C, D, E, F, G, H } = this;
		for (let i = 0; i < 64; i++) {
			const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
			const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
			const T2 = (rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22)) + Maj(A, B, C) | 0;
			H = G;
			G = F;
			F = E;
			E = D + T1 | 0;
			D = C;
			C = B;
			B = A;
			A = T1 + T2 | 0;
		}
		A = A + this.A | 0;
		B = B + this.B | 0;
		C = C + this.C | 0;
		D = D + this.D | 0;
		E = E + this.E | 0;
		F = F + this.F | 0;
		G = G + this.G | 0;
		H = H + this.H | 0;
		this.set(A, B, C, D, E, F, G, H);
	}
	roundClean() {
		SHA256_W.fill(0);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0);
		this.buffer.fill(0);
	}
};
/**
* SHA2-256 hash function
* @param message - data that would be hashed
*/
var sha256 = /* @__PURE__ */ wrapConstructor(() => new SHA256());
/*!
* MIT License
* 
* Copyright (c) 2017-2022 Peculiar Ventures, LLC
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
* 
*/
//#endregion
//#region vendor/ipld-explorer-components/node_modules/pvutils/build/utils.es.js
var import_build = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports) => {
	var ARRAY_BUFFER_NAME = "[object ArrayBuffer]";
	var BufferSourceConverter = class BufferSourceConverter {
		static isArrayBuffer(data) {
			return Object.prototype.toString.call(data) === ARRAY_BUFFER_NAME;
		}
		static toArrayBuffer(data) {
			if (this.isArrayBuffer(data)) return data;
			if (data.byteLength === data.buffer.byteLength) return data.buffer;
			if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) return data.buffer;
			return this.toUint8Array(data.buffer).slice(data.byteOffset, data.byteOffset + data.byteLength).buffer;
		}
		static toUint8Array(data) {
			return this.toView(data, Uint8Array);
		}
		static toView(data, type) {
			if (data.constructor === type) return data;
			if (this.isArrayBuffer(data)) return new type(data);
			if (this.isArrayBufferView(data)) return new type(data.buffer, data.byteOffset, data.byteLength);
			throw new TypeError("The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
		}
		static isBufferSource(data) {
			return this.isArrayBufferView(data) || this.isArrayBuffer(data);
		}
		static isArrayBufferView(data) {
			return ArrayBuffer.isView(data) || data && this.isArrayBuffer(data.buffer);
		}
		static isEqual(a, b) {
			const aView = BufferSourceConverter.toUint8Array(a);
			const bView = BufferSourceConverter.toUint8Array(b);
			if (aView.length !== bView.byteLength) return false;
			for (let i = 0; i < aView.length; i++) if (aView[i] !== bView[i]) return false;
			return true;
		}
		static concat(...args) {
			let buffers;
			if (Array.isArray(args[0]) && !(args[1] instanceof Function)) buffers = args[0];
			else if (Array.isArray(args[0]) && args[1] instanceof Function) buffers = args[0];
			else if (args[args.length - 1] instanceof Function) buffers = args.slice(0, args.length - 1);
			else buffers = args;
			let size = 0;
			for (const buffer of buffers) size += buffer.byteLength;
			const res = new Uint8Array(size);
			let offset = 0;
			for (const buffer of buffers) {
				const view = this.toUint8Array(buffer);
				res.set(view, offset);
				offset += view.length;
			}
			if (args[args.length - 1] instanceof Function) return this.toView(res, args[args.length - 1]);
			return res.buffer;
		}
	};
	var STRING_TYPE = "string";
	var HEX_REGEX = /^[0-9a-f]+$/i;
	var BASE64_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
	var BASE64URL_REGEX = /^[a-zA-Z0-9-_]+$/;
	var Utf8Converter = class {
		static fromString(text) {
			const s = unescape(encodeURIComponent(text));
			const uintArray = new Uint8Array(s.length);
			for (let i = 0; i < s.length; i++) uintArray[i] = s.charCodeAt(i);
			return uintArray.buffer;
		}
		static toString(buffer) {
			const buf = BufferSourceConverter.toUint8Array(buffer);
			let encodedString = "";
			for (let i = 0; i < buf.length; i++) encodedString += String.fromCharCode(buf[i]);
			return decodeURIComponent(escape(encodedString));
		}
	};
	var Utf16Converter = class {
		static toString(buffer, littleEndian = false) {
			const arrayBuffer = BufferSourceConverter.toArrayBuffer(buffer);
			const dataView = new DataView(arrayBuffer);
			let res = "";
			for (let i = 0; i < arrayBuffer.byteLength; i += 2) {
				const code = dataView.getUint16(i, littleEndian);
				res += String.fromCharCode(code);
			}
			return res;
		}
		static fromString(text, littleEndian = false) {
			const res = /* @__PURE__ */ new ArrayBuffer(text.length * 2);
			const dataView = new DataView(res);
			for (let i = 0; i < text.length; i++) dataView.setUint16(i * 2, text.charCodeAt(i), littleEndian);
			return res;
		}
	};
	var Convert = class Convert {
		static isHex(data) {
			return typeof data === STRING_TYPE && HEX_REGEX.test(data);
		}
		static isBase64(data) {
			return typeof data === STRING_TYPE && BASE64_REGEX.test(data);
		}
		static isBase64Url(data) {
			return typeof data === STRING_TYPE && BASE64URL_REGEX.test(data);
		}
		static ToString(buffer, enc = "utf8") {
			const buf = BufferSourceConverter.toUint8Array(buffer);
			switch (enc.toLowerCase()) {
				case "utf8": return this.ToUtf8String(buf);
				case "binary": return this.ToBinary(buf);
				case "hex": return this.ToHex(buf);
				case "base64": return this.ToBase64(buf);
				case "base64url": return this.ToBase64Url(buf);
				case "utf16le": return Utf16Converter.toString(buf, true);
				case "utf16":
				case "utf16be": return Utf16Converter.toString(buf);
				default: throw new Error(`Unknown type of encoding '${enc}'`);
			}
		}
		static FromString(str, enc = "utf8") {
			if (!str) return /* @__PURE__ */ new ArrayBuffer(0);
			switch (enc.toLowerCase()) {
				case "utf8": return this.FromUtf8String(str);
				case "binary": return this.FromBinary(str);
				case "hex": return this.FromHex(str);
				case "base64": return this.FromBase64(str);
				case "base64url": return this.FromBase64Url(str);
				case "utf16le": return Utf16Converter.fromString(str, true);
				case "utf16":
				case "utf16be": return Utf16Converter.fromString(str);
				default: throw new Error(`Unknown type of encoding '${enc}'`);
			}
		}
		static ToBase64(buffer) {
			const buf = BufferSourceConverter.toUint8Array(buffer);
			if (typeof btoa !== "undefined") {
				const binary = this.ToString(buf, "binary");
				return btoa(binary);
			} else return Buffer.from(buf).toString("base64");
		}
		static FromBase64(base64) {
			const formatted = this.formatString(base64);
			if (!formatted) return /* @__PURE__ */ new ArrayBuffer(0);
			if (!Convert.isBase64(formatted)) throw new TypeError("Argument 'base64Text' is not Base64 encoded");
			if (typeof atob !== "undefined") return this.FromBinary(atob(formatted));
			else return new Uint8Array(Buffer.from(formatted, "base64")).buffer;
		}
		static FromBase64Url(base64url) {
			const formatted = this.formatString(base64url);
			if (!formatted) return /* @__PURE__ */ new ArrayBuffer(0);
			if (!Convert.isBase64Url(formatted)) throw new TypeError("Argument 'base64url' is not Base64Url encoded");
			return this.FromBase64(this.Base64Padding(formatted.replace(/\-/g, "+").replace(/\_/g, "/")));
		}
		static ToBase64Url(data) {
			return this.ToBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
		}
		static FromUtf8String(text, encoding = Convert.DEFAULT_UTF8_ENCODING) {
			switch (encoding) {
				case "ascii": return this.FromBinary(text);
				case "utf8": return Utf8Converter.fromString(text);
				case "utf16":
				case "utf16be": return Utf16Converter.fromString(text);
				case "utf16le":
				case "usc2": return Utf16Converter.fromString(text, true);
				default: throw new Error(`Unknown type of encoding '${encoding}'`);
			}
		}
		static ToUtf8String(buffer, encoding = Convert.DEFAULT_UTF8_ENCODING) {
			switch (encoding) {
				case "ascii": return this.ToBinary(buffer);
				case "utf8": return Utf8Converter.toString(buffer);
				case "utf16":
				case "utf16be": return Utf16Converter.toString(buffer);
				case "utf16le":
				case "usc2": return Utf16Converter.toString(buffer, true);
				default: throw new Error(`Unknown type of encoding '${encoding}'`);
			}
		}
		static FromBinary(text) {
			const stringLength = text.length;
			const resultView = new Uint8Array(stringLength);
			for (let i = 0; i < stringLength; i++) resultView[i] = text.charCodeAt(i);
			return resultView.buffer;
		}
		static ToBinary(buffer) {
			const buf = BufferSourceConverter.toUint8Array(buffer);
			let res = "";
			for (let i = 0; i < buf.length; i++) res += String.fromCharCode(buf[i]);
			return res;
		}
		static ToHex(buffer) {
			const buf = BufferSourceConverter.toUint8Array(buffer);
			let result = "";
			const len = buf.length;
			for (let i = 0; i < len; i++) {
				const byte = buf[i];
				if (byte < 16) result += "0";
				result += byte.toString(16);
			}
			return result;
		}
		static FromHex(hexString) {
			let formatted = this.formatString(hexString);
			if (!formatted) return /* @__PURE__ */ new ArrayBuffer(0);
			if (!Convert.isHex(formatted)) throw new TypeError("Argument 'hexString' is not HEX encoded");
			if (formatted.length % 2) formatted = `0${formatted}`;
			const res = new Uint8Array(formatted.length / 2);
			for (let i = 0; i < formatted.length; i = i + 2) {
				const c = formatted.slice(i, i + 2);
				res[i / 2] = parseInt(c, 16);
			}
			return res.buffer;
		}
		static ToUtf16String(buffer, littleEndian = false) {
			return Utf16Converter.toString(buffer, littleEndian);
		}
		static FromUtf16String(text, littleEndian = false) {
			return Utf16Converter.fromString(text, littleEndian);
		}
		static Base64Padding(base64) {
			const padCount = 4 - base64.length % 4;
			if (padCount < 4) for (let i = 0; i < padCount; i++) base64 += "=";
			return base64;
		}
		static formatString(data) {
			return (data === null || data === void 0 ? void 0 : data.replace(/[\n\r\t ]/g, "")) || "";
		}
	};
	Convert.DEFAULT_UTF8_ENCODING = "utf8";
	exports.BufferSourceConverter = BufferSourceConverter;
	exports.Convert = Convert;
})))());
/*!
Copyright (c) Peculiar Ventures, LLC
*/
function utilFromBase(inputBuffer, inputBase) {
	let result = 0;
	if (inputBuffer.length === 1) return inputBuffer[0];
	for (let i = inputBuffer.length - 1; i >= 0; i--) result += inputBuffer[inputBuffer.length - 1 - i] * Math.pow(2, inputBase * i);
	return result;
}
function utilToBase(value, base, reserved = -1) {
	const internalReserved = reserved;
	let internalValue = value;
	let result = 0;
	let biggest = Math.pow(2, base);
	for (let i = 1; i < 8; i++) {
		if (value < biggest) {
			let retBuf;
			if (internalReserved < 0) {
				retBuf = new ArrayBuffer(i);
				result = i;
			} else {
				if (internalReserved < i) return /* @__PURE__ */ new ArrayBuffer(0);
				retBuf = new ArrayBuffer(internalReserved);
				result = internalReserved;
			}
			const retView = new Uint8Array(retBuf);
			for (let j = i - 1; j >= 0; j--) {
				const basis = Math.pow(2, j * base);
				retView[result - j - 1] = Math.floor(internalValue / basis);
				internalValue -= retView[result - j - 1] * basis;
			}
			return retBuf;
		}
		biggest *= Math.pow(2, base);
	}
	return /* @__PURE__ */ new ArrayBuffer(0);
}
function utilConcatView(...views) {
	let outputLength = 0;
	let prevLength = 0;
	for (const view of views) outputLength += view.length;
	const retBuf = new ArrayBuffer(outputLength);
	const retView = new Uint8Array(retBuf);
	for (const view of views) {
		retView.set(view, prevLength);
		prevLength += view.length;
	}
	return retView;
}
function utilDecodeTC() {
	const buf = new Uint8Array(this.valueHex);
	if (this.valueHex.byteLength >= 2) {
		const condition1 = buf[0] === 255 && buf[1] & 128;
		const condition2 = buf[0] === 0 && (buf[1] & 128) === 0;
		if (condition1 || condition2) this.warnings.push("Needlessly long format");
	}
	const bigIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
	const bigIntView = new Uint8Array(bigIntBuffer);
	for (let i = 0; i < this.valueHex.byteLength; i++) bigIntView[i] = 0;
	bigIntView[0] = buf[0] & 128;
	const bigInt = utilFromBase(bigIntView, 8);
	const smallIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
	const smallIntView = new Uint8Array(smallIntBuffer);
	for (let j = 0; j < this.valueHex.byteLength; j++) smallIntView[j] = buf[j];
	smallIntView[0] &= 127;
	return utilFromBase(smallIntView, 8) - bigInt;
}
function utilEncodeTC(value) {
	const modValue = value < 0 ? value * -1 : value;
	let bigInt = 128;
	for (let i = 1; i < 8; i++) {
		if (modValue <= bigInt) {
			if (value < 0) {
				const retBuf = utilToBase(bigInt - modValue, 8, i);
				const retView = new Uint8Array(retBuf);
				retView[0] |= 128;
				return retBuf;
			}
			let retBuf = utilToBase(modValue, 8, i);
			let retView = new Uint8Array(retBuf);
			if (retView[0] & 128) {
				const tempBuf = retBuf.slice(0);
				const tempView = new Uint8Array(tempBuf);
				retBuf = new ArrayBuffer(retBuf.byteLength + 1);
				retView = new Uint8Array(retBuf);
				for (let k = 0; k < tempBuf.byteLength; k++) retView[k + 1] = tempView[k];
				retView[0] = 0;
			}
			return retBuf;
		}
		bigInt *= Math.pow(2, 8);
	}
	return /* @__PURE__ */ new ArrayBuffer(0);
}
function isEqualBuffer(inputBuffer1, inputBuffer2) {
	if (inputBuffer1.byteLength !== inputBuffer2.byteLength) return false;
	const view1 = new Uint8Array(inputBuffer1);
	const view2 = new Uint8Array(inputBuffer2);
	for (let i = 0; i < view1.length; i++) if (view1[i] !== view2[i]) return false;
	return true;
}
function padNumber(inputNumber, fullLength) {
	const str = inputNumber.toString(10);
	if (fullLength < str.length) return "";
	const dif = fullLength - str.length;
	const padding = new Array(dif);
	for (let i = 0; i < dif; i++) padding[i] = "0";
	return padding.join("").concat(str);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/asn1js/build/index.es.js
/*!
* Copyright (c) 2014, GMO GlobalSign
* Copyright (c) 2015-2022, Peculiar Ventures
* All rights reserved.
* 
* Author 2014-2019, Yury Strozhevsky
* 
* Redistribution and use in source and binary forms, with or without modification,
* are permitted provided that the following conditions are met:
* 
* * Redistributions of source code must retain the above copyright notice, this
*   list of conditions and the following disclaimer.
* 
* * Redistributions in binary form must reproduce the above copyright notice, this
*   list of conditions and the following disclaimer in the documentation and/or
*   other materials provided with the distribution.
* 
* * Neither the name of the copyright holder nor the names of its
*   contributors may be used to endorse or promote products derived from
*   this software without specific prior written permission.
* 
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
* ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
* ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* 
*/
function assertBigInt() {
	if (typeof BigInt === "undefined") throw new Error("BigInt is not defined. Your environment doesn't implement BigInt.");
}
function concat(buffers) {
	let outputLength = 0;
	let prevLength = 0;
	for (let i = 0; i < buffers.length; i++) {
		const buffer = buffers[i];
		outputLength += buffer.byteLength;
	}
	const retView = new Uint8Array(outputLength);
	for (let i = 0; i < buffers.length; i++) {
		const buffer = buffers[i];
		retView.set(new Uint8Array(buffer), prevLength);
		prevLength += buffer.byteLength;
	}
	return retView.buffer;
}
function checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength) {
	if (!(inputBuffer instanceof Uint8Array)) {
		baseBlock.error = "Wrong parameter: inputBuffer must be 'Uint8Array'";
		return false;
	}
	if (!inputBuffer.byteLength) {
		baseBlock.error = "Wrong parameter: inputBuffer has zero length";
		return false;
	}
	if (inputOffset < 0) {
		baseBlock.error = "Wrong parameter: inputOffset less than zero";
		return false;
	}
	if (inputLength < 0) {
		baseBlock.error = "Wrong parameter: inputLength less than zero";
		return false;
	}
	if (inputBuffer.byteLength - inputOffset - inputLength < 0) {
		baseBlock.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
		return false;
	}
	return true;
}
var ViewWriter = class {
	constructor() {
		this.items = [];
	}
	write(buf) {
		this.items.push(buf);
	}
	final() {
		return concat(this.items);
	}
};
var powers2 = [new Uint8Array([1])];
var digitsString = "0123456789";
var EMPTY_STRING = "";
var EMPTY_BUFFER = /* @__PURE__ */ new ArrayBuffer(0);
var EMPTY_VIEW = /* @__PURE__ */ new Uint8Array(0);
var END_OF_CONTENT_NAME = "EndOfContent";
var OCTET_STRING_NAME = "OCTET STRING";
var BIT_STRING_NAME = "BIT STRING";
function HexBlock(BaseClass) {
	var _a = class Some extends BaseClass {
		constructor(...args) {
			var _a;
			super(...args);
			const params = args[0] || {};
			this.isHexOnly = (_a = params.isHexOnly) !== null && _a !== void 0 ? _a : false;
			this.valueHexView = params.valueHex ? import_build.BufferSourceConverter.toUint8Array(params.valueHex) : EMPTY_VIEW;
		}
		get valueHex() {
			return this.valueHexView.slice().buffer;
		}
		set valueHex(value) {
			this.valueHexView = new Uint8Array(value);
		}
		fromBER(inputBuffer, inputOffset, inputLength) {
			const view = inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer;
			if (!checkBufferParams(this, view, inputOffset, inputLength)) return -1;
			const endLength = inputOffset + inputLength;
			this.valueHexView = view.subarray(inputOffset, endLength);
			if (!this.valueHexView.length) {
				this.warnings.push("Zero buffer length");
				return inputOffset;
			}
			this.blockLength = inputLength;
			return endLength;
		}
		toBER(sizeOnly = false) {
			if (!this.isHexOnly) {
				this.error = "Flag 'isHexOnly' is not set, abort";
				return EMPTY_BUFFER;
			}
			if (sizeOnly) return new ArrayBuffer(this.valueHexView.byteLength);
			return this.valueHexView.byteLength === this.valueHexView.buffer.byteLength ? this.valueHexView.buffer : this.valueHexView.slice().buffer;
		}
		toJSON() {
			return {
				...super.toJSON(),
				isHexOnly: this.isHexOnly,
				valueHex: import_build.Convert.ToHex(this.valueHexView)
			};
		}
	};
	return _a.NAME = "hexBlock", _a;
}
var LocalBaseBlock = class {
	constructor({ blockLength = 0, error = EMPTY_STRING, warnings = [], valueBeforeDecode = EMPTY_VIEW } = {}) {
		this.blockLength = blockLength;
		this.error = error;
		this.warnings = warnings;
		this.valueBeforeDecodeView = import_build.BufferSourceConverter.toUint8Array(valueBeforeDecode);
	}
	static blockName() {
		return this.NAME;
	}
	get valueBeforeDecode() {
		return this.valueBeforeDecodeView.slice().buffer;
	}
	set valueBeforeDecode(value) {
		this.valueBeforeDecodeView = new Uint8Array(value);
	}
	toJSON() {
		return {
			blockName: this.constructor.NAME,
			blockLength: this.blockLength,
			error: this.error,
			warnings: this.warnings,
			valueBeforeDecode: import_build.Convert.ToHex(this.valueBeforeDecodeView)
		};
	}
};
LocalBaseBlock.NAME = "baseBlock";
var ValueBlock = class extends LocalBaseBlock {
	fromBER(inputBuffer, inputOffset, inputLength) {
		throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
	}
	toBER(sizeOnly, writer) {
		throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
	}
};
ValueBlock.NAME = "valueBlock";
var LocalIdentificationBlock = class extends HexBlock(LocalBaseBlock) {
	constructor({ idBlock = {} } = {}) {
		var _a, _b, _c, _d;
		super();
		if (idBlock) {
			this.isHexOnly = (_a = idBlock.isHexOnly) !== null && _a !== void 0 ? _a : false;
			this.valueHexView = idBlock.valueHex ? import_build.BufferSourceConverter.toUint8Array(idBlock.valueHex) : EMPTY_VIEW;
			this.tagClass = (_b = idBlock.tagClass) !== null && _b !== void 0 ? _b : -1;
			this.tagNumber = (_c = idBlock.tagNumber) !== null && _c !== void 0 ? _c : -1;
			this.isConstructed = (_d = idBlock.isConstructed) !== null && _d !== void 0 ? _d : false;
		} else {
			this.tagClass = -1;
			this.tagNumber = -1;
			this.isConstructed = false;
		}
	}
	toBER(sizeOnly = false) {
		let firstOctet = 0;
		switch (this.tagClass) {
			case 1:
				firstOctet |= 0;
				break;
			case 2:
				firstOctet |= 64;
				break;
			case 3:
				firstOctet |= 128;
				break;
			case 4:
				firstOctet |= 192;
				break;
			default:
				this.error = "Unknown tag class";
				return EMPTY_BUFFER;
		}
		if (this.isConstructed) firstOctet |= 32;
		if (this.tagNumber < 31 && !this.isHexOnly) {
			const retView = /* @__PURE__ */ new Uint8Array(1);
			if (!sizeOnly) {
				let number = this.tagNumber;
				number &= 31;
				firstOctet |= number;
				retView[0] = firstOctet;
			}
			return retView.buffer;
		}
		if (!this.isHexOnly) {
			const encodedBuf = utilToBase(this.tagNumber, 7);
			const encodedView = new Uint8Array(encodedBuf);
			const size = encodedBuf.byteLength;
			const retView = new Uint8Array(size + 1);
			retView[0] = firstOctet | 31;
			if (!sizeOnly) {
				for (let i = 0; i < size - 1; i++) retView[i + 1] = encodedView[i] | 128;
				retView[size] = encodedView[size - 1];
			}
			return retView.buffer;
		}
		const retView = new Uint8Array(this.valueHexView.byteLength + 1);
		retView[0] = firstOctet | 31;
		if (!sizeOnly) {
			const curView = this.valueHexView;
			for (let i = 0; i < curView.length - 1; i++) retView[i + 1] = curView[i] | 128;
			retView[this.valueHexView.byteLength] = curView[curView.length - 1];
		}
		return retView.buffer;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		const inputView = import_build.BufferSourceConverter.toUint8Array(inputBuffer);
		if (!checkBufferParams(this, inputView, inputOffset, inputLength)) return -1;
		const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
		if (intBuffer.length === 0) {
			this.error = "Zero buffer length";
			return -1;
		}
		switch (intBuffer[0] & 192) {
			case 0:
				this.tagClass = 1;
				break;
			case 64:
				this.tagClass = 2;
				break;
			case 128:
				this.tagClass = 3;
				break;
			case 192:
				this.tagClass = 4;
				break;
			default:
				this.error = "Unknown tag class";
				return -1;
		}
		this.isConstructed = (intBuffer[0] & 32) === 32;
		this.isHexOnly = false;
		const tagNumberMask = intBuffer[0] & 31;
		if (tagNumberMask !== 31) {
			this.tagNumber = tagNumberMask;
			this.blockLength = 1;
		} else {
			let count = 1;
			let intTagNumberBuffer = this.valueHexView = /* @__PURE__ */ new Uint8Array(255);
			let tagNumberBufferMaxLength = 255;
			while (intBuffer[count] & 128) {
				intTagNumberBuffer[count - 1] = intBuffer[count] & 127;
				count++;
				if (count >= intBuffer.length) {
					this.error = "End of input reached before message was fully decoded";
					return -1;
				}
				if (count === tagNumberBufferMaxLength) {
					tagNumberBufferMaxLength += 255;
					const tempBufferView = new Uint8Array(tagNumberBufferMaxLength);
					for (let i = 0; i < intTagNumberBuffer.length; i++) tempBufferView[i] = intTagNumberBuffer[i];
					intTagNumberBuffer = this.valueHexView = new Uint8Array(tagNumberBufferMaxLength);
				}
			}
			this.blockLength = count + 1;
			intTagNumberBuffer[count - 1] = intBuffer[count] & 127;
			const tempBufferView = new Uint8Array(count);
			for (let i = 0; i < count; i++) tempBufferView[i] = intTagNumberBuffer[i];
			intTagNumberBuffer = this.valueHexView = new Uint8Array(count);
			intTagNumberBuffer.set(tempBufferView);
			if (this.blockLength <= 9) this.tagNumber = utilFromBase(intTagNumberBuffer, 7);
			else {
				this.isHexOnly = true;
				this.warnings.push("Tag too long, represented as hex-coded");
			}
		}
		if (this.tagClass === 1 && this.isConstructed) switch (this.tagNumber) {
			case 1:
			case 2:
			case 5:
			case 6:
			case 9:
			case 13:
			case 14:
			case 23:
			case 24:
			case 31:
			case 32:
			case 33:
			case 34:
				this.error = "Constructed encoding used for primitive type";
				return -1;
		}
		return inputOffset + this.blockLength;
	}
	toJSON() {
		return {
			...super.toJSON(),
			tagClass: this.tagClass,
			tagNumber: this.tagNumber,
			isConstructed: this.isConstructed
		};
	}
};
LocalIdentificationBlock.NAME = "identificationBlock";
var LocalLengthBlock = class extends LocalBaseBlock {
	constructor({ lenBlock = {} } = {}) {
		var _a, _b, _c;
		super();
		this.isIndefiniteForm = (_a = lenBlock.isIndefiniteForm) !== null && _a !== void 0 ? _a : false;
		this.longFormUsed = (_b = lenBlock.longFormUsed) !== null && _b !== void 0 ? _b : false;
		this.length = (_c = lenBlock.length) !== null && _c !== void 0 ? _c : 0;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		const view = import_build.BufferSourceConverter.toUint8Array(inputBuffer);
		if (!checkBufferParams(this, view, inputOffset, inputLength)) return -1;
		const intBuffer = view.subarray(inputOffset, inputOffset + inputLength);
		if (intBuffer.length === 0) {
			this.error = "Zero buffer length";
			return -1;
		}
		if (intBuffer[0] === 255) {
			this.error = "Length block 0xFF is reserved by standard";
			return -1;
		}
		this.isIndefiniteForm = intBuffer[0] === 128;
		if (this.isIndefiniteForm) {
			this.blockLength = 1;
			return inputOffset + this.blockLength;
		}
		this.longFormUsed = !!(intBuffer[0] & 128);
		if (this.longFormUsed === false) {
			this.length = intBuffer[0];
			this.blockLength = 1;
			return inputOffset + this.blockLength;
		}
		const count = intBuffer[0] & 127;
		if (count > 8) {
			this.error = "Too big integer";
			return -1;
		}
		if (count + 1 > intBuffer.length) {
			this.error = "End of input reached before message was fully decoded";
			return -1;
		}
		const lenOffset = inputOffset + 1;
		const lengthBufferView = view.subarray(lenOffset, lenOffset + count);
		if (lengthBufferView[count - 1] === 0) this.warnings.push("Needlessly long encoded length");
		this.length = utilFromBase(lengthBufferView, 8);
		if (this.longFormUsed && this.length <= 127) this.warnings.push("Unnecessary usage of long length form");
		this.blockLength = count + 1;
		return inputOffset + this.blockLength;
	}
	toBER(sizeOnly = false) {
		let retBuf;
		let retView;
		if (this.length > 127) this.longFormUsed = true;
		if (this.isIndefiniteForm) {
			retBuf = /* @__PURE__ */ new ArrayBuffer(1);
			if (sizeOnly === false) {
				retView = new Uint8Array(retBuf);
				retView[0] = 128;
			}
			return retBuf;
		}
		if (this.longFormUsed) {
			const encodedBuf = utilToBase(this.length, 8);
			if (encodedBuf.byteLength > 127) {
				this.error = "Too big length";
				return EMPTY_BUFFER;
			}
			retBuf = new ArrayBuffer(encodedBuf.byteLength + 1);
			if (sizeOnly) return retBuf;
			const encodedView = new Uint8Array(encodedBuf);
			retView = new Uint8Array(retBuf);
			retView[0] = encodedBuf.byteLength | 128;
			for (let i = 0; i < encodedBuf.byteLength; i++) retView[i + 1] = encodedView[i];
			return retBuf;
		}
		retBuf = /* @__PURE__ */ new ArrayBuffer(1);
		if (sizeOnly === false) {
			retView = new Uint8Array(retBuf);
			retView[0] = this.length;
		}
		return retBuf;
	}
	toJSON() {
		return {
			...super.toJSON(),
			isIndefiniteForm: this.isIndefiniteForm,
			longFormUsed: this.longFormUsed,
			length: this.length
		};
	}
};
LocalLengthBlock.NAME = "lengthBlock";
var typeStore = {};
var BaseBlock = class extends LocalBaseBlock {
	constructor({ name = EMPTY_STRING, optional = false, primitiveSchema, ...parameters } = {}, valueBlockType) {
		super(parameters);
		this.name = name;
		this.optional = optional;
		if (primitiveSchema) this.primitiveSchema = primitiveSchema;
		this.idBlock = new LocalIdentificationBlock(parameters);
		this.lenBlock = new LocalLengthBlock(parameters);
		this.valueBlock = valueBlockType ? new valueBlockType(parameters) : new ValueBlock(parameters);
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
		if (resultOffset === -1) {
			this.error = this.valueBlock.error;
			return resultOffset;
		}
		if (!this.idBlock.error.length) this.blockLength += this.idBlock.blockLength;
		if (!this.lenBlock.error.length) this.blockLength += this.lenBlock.blockLength;
		if (!this.valueBlock.error.length) this.blockLength += this.valueBlock.blockLength;
		return resultOffset;
	}
	toBER(sizeOnly, writer) {
		const _writer = writer || new ViewWriter();
		if (!writer) prepareIndefiniteForm(this);
		const idBlockBuf = this.idBlock.toBER(sizeOnly);
		_writer.write(idBlockBuf);
		if (this.lenBlock.isIndefiniteForm) {
			_writer.write(new Uint8Array([128]).buffer);
			this.valueBlock.toBER(sizeOnly, _writer);
			_writer.write(/* @__PURE__ */ new ArrayBuffer(2));
		} else {
			const valueBlockBuf = this.valueBlock.toBER(sizeOnly);
			this.lenBlock.length = valueBlockBuf.byteLength;
			const lenBlockBuf = this.lenBlock.toBER(sizeOnly);
			_writer.write(lenBlockBuf);
			_writer.write(valueBlockBuf);
		}
		if (!writer) return _writer.final();
		return EMPTY_BUFFER;
	}
	toJSON() {
		const object = {
			...super.toJSON(),
			idBlock: this.idBlock.toJSON(),
			lenBlock: this.lenBlock.toJSON(),
			valueBlock: this.valueBlock.toJSON(),
			name: this.name,
			optional: this.optional
		};
		if (this.primitiveSchema) object.primitiveSchema = this.primitiveSchema.toJSON();
		return object;
	}
	toString(encoding = "ascii") {
		if (encoding === "ascii") return this.onAsciiEncoding();
		return import_build.Convert.ToHex(this.toBER());
	}
	onAsciiEncoding() {
		return `${this.constructor.NAME} : ${import_build.Convert.ToHex(this.valueBlock.valueBeforeDecodeView)}`;
	}
	isEqual(other) {
		if (this === other) return true;
		if (!(other instanceof this.constructor)) return false;
		return isEqualBuffer(this.toBER(), other.toBER());
	}
};
BaseBlock.NAME = "BaseBlock";
function prepareIndefiniteForm(baseBlock) {
	if (baseBlock instanceof typeStore.Constructed) {
		for (const value of baseBlock.valueBlock.value) if (prepareIndefiniteForm(value)) baseBlock.lenBlock.isIndefiniteForm = true;
	}
	return !!baseBlock.lenBlock.isIndefiniteForm;
}
var BaseStringBlock = class extends BaseBlock {
	constructor({ value = EMPTY_STRING, ...parameters } = {}, stringValueBlockType) {
		super(parameters, stringValueBlockType);
		if (value) this.fromString(value);
	}
	getValue() {
		return this.valueBlock.value;
	}
	setValue(value) {
		this.valueBlock.value = value;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
		if (resultOffset === -1) {
			this.error = this.valueBlock.error;
			return resultOffset;
		}
		this.fromBuffer(this.valueBlock.valueHexView);
		if (!this.idBlock.error.length) this.blockLength += this.idBlock.blockLength;
		if (!this.lenBlock.error.length) this.blockLength += this.lenBlock.blockLength;
		if (!this.valueBlock.error.length) this.blockLength += this.valueBlock.blockLength;
		return resultOffset;
	}
	onAsciiEncoding() {
		return `${this.constructor.NAME} : '${this.valueBlock.value}'`;
	}
};
BaseStringBlock.NAME = "BaseStringBlock";
var LocalPrimitiveValueBlock = class extends HexBlock(ValueBlock) {
	constructor({ isHexOnly = true, ...parameters } = {}) {
		super(parameters);
		this.isHexOnly = isHexOnly;
	}
};
LocalPrimitiveValueBlock.NAME = "PrimitiveValueBlock";
var _a$w;
var Primitive = class extends BaseBlock {
	constructor(parameters = {}) {
		super(parameters, LocalPrimitiveValueBlock);
		this.idBlock.isConstructed = false;
	}
};
_a$w = Primitive;
(() => {
	typeStore.Primitive = _a$w;
})();
Primitive.NAME = "PRIMITIVE";
function localChangeType(inputObject, newType) {
	if (inputObject instanceof newType) return inputObject;
	const newObject = new newType();
	newObject.idBlock = inputObject.idBlock;
	newObject.lenBlock = inputObject.lenBlock;
	newObject.warnings = inputObject.warnings;
	newObject.valueBeforeDecodeView = inputObject.valueBeforeDecodeView;
	return newObject;
}
function localFromBER(inputBuffer, inputOffset = 0, inputLength = inputBuffer.length) {
	const incomingOffset = inputOffset;
	let returnObject = new BaseBlock({}, ValueBlock);
	const baseBlock = new LocalBaseBlock();
	if (!checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength)) {
		returnObject.error = baseBlock.error;
		return {
			offset: -1,
			result: returnObject
		};
	}
	if (!inputBuffer.subarray(inputOffset, inputOffset + inputLength).length) {
		returnObject.error = "Zero buffer length";
		return {
			offset: -1,
			result: returnObject
		};
	}
	let resultOffset = returnObject.idBlock.fromBER(inputBuffer, inputOffset, inputLength);
	if (returnObject.idBlock.warnings.length) returnObject.warnings.concat(returnObject.idBlock.warnings);
	if (resultOffset === -1) {
		returnObject.error = returnObject.idBlock.error;
		return {
			offset: -1,
			result: returnObject
		};
	}
	inputOffset = resultOffset;
	inputLength -= returnObject.idBlock.blockLength;
	resultOffset = returnObject.lenBlock.fromBER(inputBuffer, inputOffset, inputLength);
	if (returnObject.lenBlock.warnings.length) returnObject.warnings.concat(returnObject.lenBlock.warnings);
	if (resultOffset === -1) {
		returnObject.error = returnObject.lenBlock.error;
		return {
			offset: -1,
			result: returnObject
		};
	}
	inputOffset = resultOffset;
	inputLength -= returnObject.lenBlock.blockLength;
	if (!returnObject.idBlock.isConstructed && returnObject.lenBlock.isIndefiniteForm) {
		returnObject.error = "Indefinite length form used for primitive encoding form";
		return {
			offset: -1,
			result: returnObject
		};
	}
	let newASN1Type = BaseBlock;
	switch (returnObject.idBlock.tagClass) {
		case 1:
			if (returnObject.idBlock.tagNumber >= 37 && returnObject.idBlock.isHexOnly === false) {
				returnObject.error = "UNIVERSAL 37 and upper tags are reserved by ASN.1 standard";
				return {
					offset: -1,
					result: returnObject
				};
			}
			switch (returnObject.idBlock.tagNumber) {
				case 0:
					if (returnObject.idBlock.isConstructed && returnObject.lenBlock.length > 0) {
						returnObject.error = "Type [UNIVERSAL 0] is reserved";
						return {
							offset: -1,
							result: returnObject
						};
					}
					newASN1Type = typeStore.EndOfContent;
					break;
				case 1:
					newASN1Type = typeStore.Boolean;
					break;
				case 2:
					newASN1Type = typeStore.Integer;
					break;
				case 3:
					newASN1Type = typeStore.BitString;
					break;
				case 4:
					newASN1Type = typeStore.OctetString;
					break;
				case 5:
					newASN1Type = typeStore.Null;
					break;
				case 6:
					newASN1Type = typeStore.ObjectIdentifier;
					break;
				case 10:
					newASN1Type = typeStore.Enumerated;
					break;
				case 12:
					newASN1Type = typeStore.Utf8String;
					break;
				case 13:
					newASN1Type = typeStore.RelativeObjectIdentifier;
					break;
				case 14:
					newASN1Type = typeStore.TIME;
					break;
				case 15:
					returnObject.error = "[UNIVERSAL 15] is reserved by ASN.1 standard";
					return {
						offset: -1,
						result: returnObject
					};
				case 16:
					newASN1Type = typeStore.Sequence;
					break;
				case 17:
					newASN1Type = typeStore.Set;
					break;
				case 18:
					newASN1Type = typeStore.NumericString;
					break;
				case 19:
					newASN1Type = typeStore.PrintableString;
					break;
				case 20:
					newASN1Type = typeStore.TeletexString;
					break;
				case 21:
					newASN1Type = typeStore.VideotexString;
					break;
				case 22:
					newASN1Type = typeStore.IA5String;
					break;
				case 23:
					newASN1Type = typeStore.UTCTime;
					break;
				case 24:
					newASN1Type = typeStore.GeneralizedTime;
					break;
				case 25:
					newASN1Type = typeStore.GraphicString;
					break;
				case 26:
					newASN1Type = typeStore.VisibleString;
					break;
				case 27:
					newASN1Type = typeStore.GeneralString;
					break;
				case 28:
					newASN1Type = typeStore.UniversalString;
					break;
				case 29:
					newASN1Type = typeStore.CharacterString;
					break;
				case 30:
					newASN1Type = typeStore.BmpString;
					break;
				case 31:
					newASN1Type = typeStore.DATE;
					break;
				case 32:
					newASN1Type = typeStore.TimeOfDay;
					break;
				case 33:
					newASN1Type = typeStore.DateTime;
					break;
				case 34:
					newASN1Type = typeStore.Duration;
					break;
				default: {
					const newObject = returnObject.idBlock.isConstructed ? new typeStore.Constructed() : new typeStore.Primitive();
					newObject.idBlock = returnObject.idBlock;
					newObject.lenBlock = returnObject.lenBlock;
					newObject.warnings = returnObject.warnings;
					returnObject = newObject;
				}
			}
			break;
		default: newASN1Type = returnObject.idBlock.isConstructed ? typeStore.Constructed : typeStore.Primitive;
	}
	returnObject = localChangeType(returnObject, newASN1Type);
	resultOffset = returnObject.fromBER(inputBuffer, inputOffset, returnObject.lenBlock.isIndefiniteForm ? inputLength : returnObject.lenBlock.length);
	returnObject.valueBeforeDecodeView = inputBuffer.subarray(incomingOffset, incomingOffset + returnObject.blockLength);
	return {
		offset: resultOffset,
		result: returnObject
	};
}
function fromBER(inputBuffer) {
	if (!inputBuffer.byteLength) {
		const result = new BaseBlock({}, ValueBlock);
		result.error = "Input buffer has zero length";
		return {
			offset: -1,
			result
		};
	}
	return localFromBER(import_build.BufferSourceConverter.toUint8Array(inputBuffer).slice(), 0, inputBuffer.byteLength);
}
function checkLen(indefiniteLength, length) {
	if (indefiniteLength) return 1;
	return length;
}
var LocalConstructedValueBlock = class extends ValueBlock {
	constructor({ value = [], isIndefiniteForm = false, ...parameters } = {}) {
		super(parameters);
		this.value = value;
		this.isIndefiniteForm = isIndefiniteForm;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		const view = import_build.BufferSourceConverter.toUint8Array(inputBuffer);
		if (!checkBufferParams(this, view, inputOffset, inputLength)) return -1;
		this.valueBeforeDecodeView = view.subarray(inputOffset, inputOffset + inputLength);
		if (this.valueBeforeDecodeView.length === 0) {
			this.warnings.push("Zero buffer length");
			return inputOffset;
		}
		let currentOffset = inputOffset;
		while (checkLen(this.isIndefiniteForm, inputLength) > 0) {
			const returnObject = localFromBER(view, currentOffset, inputLength);
			if (returnObject.offset === -1) {
				this.error = returnObject.result.error;
				this.warnings.concat(returnObject.result.warnings);
				return -1;
			}
			currentOffset = returnObject.offset;
			this.blockLength += returnObject.result.blockLength;
			inputLength -= returnObject.result.blockLength;
			this.value.push(returnObject.result);
			if (this.isIndefiniteForm && returnObject.result.constructor.NAME === END_OF_CONTENT_NAME) break;
		}
		if (this.isIndefiniteForm) {
			if (this.value[this.value.length - 1].constructor.NAME === END_OF_CONTENT_NAME) this.value.pop();
			else this.warnings.push("No EndOfContent block encoded");
		}
		return currentOffset;
	}
	toBER(sizeOnly, writer) {
		const _writer = writer || new ViewWriter();
		for (let i = 0; i < this.value.length; i++) this.value[i].toBER(sizeOnly, _writer);
		if (!writer) return _writer.final();
		return EMPTY_BUFFER;
	}
	toJSON() {
		const object = {
			...super.toJSON(),
			isIndefiniteForm: this.isIndefiniteForm,
			value: []
		};
		for (const value of this.value) object.value.push(value.toJSON());
		return object;
	}
};
LocalConstructedValueBlock.NAME = "ConstructedValueBlock";
var _a$v;
var Constructed = class extends BaseBlock {
	constructor(parameters = {}) {
		super(parameters, LocalConstructedValueBlock);
		this.idBlock.isConstructed = true;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
		const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
		if (resultOffset === -1) {
			this.error = this.valueBlock.error;
			return resultOffset;
		}
		if (!this.idBlock.error.length) this.blockLength += this.idBlock.blockLength;
		if (!this.lenBlock.error.length) this.blockLength += this.lenBlock.blockLength;
		if (!this.valueBlock.error.length) this.blockLength += this.valueBlock.blockLength;
		return resultOffset;
	}
	onAsciiEncoding() {
		const values = [];
		for (const value of this.valueBlock.value) values.push(value.toString("ascii").split("\n").map((o) => `  ${o}`).join("\n"));
		const blockName = this.idBlock.tagClass === 3 ? `[${this.idBlock.tagNumber}]` : this.constructor.NAME;
		return values.length ? `${blockName} :\n${values.join("\n")}` : `${blockName} :`;
	}
};
_a$v = Constructed;
(() => {
	typeStore.Constructed = _a$v;
})();
Constructed.NAME = "CONSTRUCTED";
var LocalEndOfContentValueBlock = class extends ValueBlock {
	fromBER(inputBuffer, inputOffset, inputLength) {
		return inputOffset;
	}
	toBER(sizeOnly) {
		return EMPTY_BUFFER;
	}
};
LocalEndOfContentValueBlock.override = "EndOfContentValueBlock";
var _a$u;
var EndOfContent = class extends BaseBlock {
	constructor(parameters = {}) {
		super(parameters, LocalEndOfContentValueBlock);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 0;
	}
};
_a$u = EndOfContent;
(() => {
	typeStore.EndOfContent = _a$u;
})();
EndOfContent.NAME = END_OF_CONTENT_NAME;
var _a$t;
var Null = class extends BaseBlock {
	constructor(parameters = {}) {
		super(parameters, ValueBlock);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 5;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		if (this.lenBlock.length > 0) this.warnings.push("Non-zero length of value block for Null type");
		if (!this.idBlock.error.length) this.blockLength += this.idBlock.blockLength;
		if (!this.lenBlock.error.length) this.blockLength += this.lenBlock.blockLength;
		this.blockLength += inputLength;
		if (inputOffset + inputLength > inputBuffer.byteLength) {
			this.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
			return -1;
		}
		return inputOffset + inputLength;
	}
	toBER(sizeOnly, writer) {
		const retBuf = /* @__PURE__ */ new ArrayBuffer(2);
		if (!sizeOnly) {
			const retView = new Uint8Array(retBuf);
			retView[0] = 5;
			retView[1] = 0;
		}
		if (writer) writer.write(retBuf);
		return retBuf;
	}
	onAsciiEncoding() {
		return `${this.constructor.NAME}`;
	}
};
_a$t = Null;
(() => {
	typeStore.Null = _a$t;
})();
Null.NAME = "NULL";
var LocalBooleanValueBlock = class extends HexBlock(ValueBlock) {
	constructor({ value, ...parameters } = {}) {
		super(parameters);
		if (parameters.valueHex) this.valueHexView = import_build.BufferSourceConverter.toUint8Array(parameters.valueHex);
		else this.valueHexView = /* @__PURE__ */ new Uint8Array(1);
		if (value) this.value = value;
	}
	get value() {
		for (const octet of this.valueHexView) if (octet > 0) return true;
		return false;
	}
	set value(value) {
		this.valueHexView[0] = value ? 255 : 0;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		const inputView = import_build.BufferSourceConverter.toUint8Array(inputBuffer);
		if (!checkBufferParams(this, inputView, inputOffset, inputLength)) return -1;
		this.valueHexView = inputView.subarray(inputOffset, inputOffset + inputLength);
		if (inputLength > 1) this.warnings.push("Boolean value encoded in more then 1 octet");
		this.isHexOnly = true;
		utilDecodeTC.call(this);
		this.blockLength = inputLength;
		return inputOffset + inputLength;
	}
	toBER() {
		return this.valueHexView.slice();
	}
	toJSON() {
		return {
			...super.toJSON(),
			value: this.value
		};
	}
};
LocalBooleanValueBlock.NAME = "BooleanValueBlock";
var _a$s;
var Boolean$1 = class extends BaseBlock {
	constructor(parameters = {}) {
		super(parameters, LocalBooleanValueBlock);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 1;
	}
	getValue() {
		return this.valueBlock.value;
	}
	setValue(value) {
		this.valueBlock.value = value;
	}
	onAsciiEncoding() {
		return `${this.constructor.NAME} : ${this.getValue}`;
	}
};
_a$s = Boolean$1;
(() => {
	typeStore.Boolean = _a$s;
})();
Boolean$1.NAME = "BOOLEAN";
var LocalOctetStringValueBlock = class extends HexBlock(LocalConstructedValueBlock) {
	constructor({ isConstructed = false, ...parameters } = {}) {
		super(parameters);
		this.isConstructed = isConstructed;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		let resultOffset = 0;
		if (this.isConstructed) {
			this.isHexOnly = false;
			resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
			if (resultOffset === -1) return resultOffset;
			for (let i = 0; i < this.value.length; i++) {
				const currentBlockName = this.value[i].constructor.NAME;
				if (currentBlockName === END_OF_CONTENT_NAME) {
					if (this.isIndefiniteForm) break;
					else {
						this.error = "EndOfContent is unexpected, OCTET STRING may consists of OCTET STRINGs only";
						return -1;
					}
				}
				if (currentBlockName !== OCTET_STRING_NAME) {
					this.error = "OCTET STRING may consists of OCTET STRINGs only";
					return -1;
				}
			}
		} else {
			this.isHexOnly = true;
			resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
			this.blockLength = inputLength;
		}
		return resultOffset;
	}
	toBER(sizeOnly, writer) {
		if (this.isConstructed) return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
		return sizeOnly ? new ArrayBuffer(this.valueHexView.byteLength) : this.valueHexView.slice().buffer;
	}
	toJSON() {
		return {
			...super.toJSON(),
			isConstructed: this.isConstructed
		};
	}
};
LocalOctetStringValueBlock.NAME = "OctetStringValueBlock";
var _a$r;
var OctetString = class OctetString extends BaseBlock {
	constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
		var _b, _c;
		(_b = parameters.isConstructed) !== null && _b !== void 0 || (parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0 ? void 0 : _c.length));
		super({
			idBlock: {
				isConstructed: parameters.isConstructed,
				...idBlock
			},
			lenBlock: {
				...lenBlock,
				isIndefiniteForm: !!parameters.isIndefiniteForm
			},
			...parameters
		}, LocalOctetStringValueBlock);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 4;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		this.valueBlock.isConstructed = this.idBlock.isConstructed;
		this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
		if (inputLength === 0) {
			if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
			if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
			return inputOffset;
		}
		if (!this.valueBlock.isConstructed) {
			const buf = (inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer).subarray(inputOffset, inputOffset + inputLength);
			try {
				if (buf.byteLength) {
					const asn = localFromBER(buf, 0, buf.byteLength);
					if (asn.offset !== -1 && asn.offset === inputLength) this.valueBlock.value = [asn.result];
				}
			} catch (e) {}
		}
		return super.fromBER(inputBuffer, inputOffset, inputLength);
	}
	onAsciiEncoding() {
		if (this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length) return Constructed.prototype.onAsciiEncoding.call(this);
		return `${this.constructor.NAME} : ${import_build.Convert.ToHex(this.valueBlock.valueHexView)}`;
	}
	getValue() {
		if (!this.idBlock.isConstructed) return this.valueBlock.valueHexView.slice().buffer;
		const array = [];
		for (const content of this.valueBlock.value) if (content instanceof OctetString) array.push(content.valueBlock.valueHexView);
		return import_build.BufferSourceConverter.concat(array);
	}
};
_a$r = OctetString;
(() => {
	typeStore.OctetString = _a$r;
})();
OctetString.NAME = OCTET_STRING_NAME;
var LocalBitStringValueBlock = class extends HexBlock(LocalConstructedValueBlock) {
	constructor({ unusedBits = 0, isConstructed = false, ...parameters } = {}) {
		super(parameters);
		this.unusedBits = unusedBits;
		this.isConstructed = isConstructed;
		this.blockLength = this.valueHexView.byteLength;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		if (!inputLength) return inputOffset;
		let resultOffset = -1;
		if (this.isConstructed) {
			resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
			if (resultOffset === -1) return resultOffset;
			for (const value of this.value) {
				const currentBlockName = value.constructor.NAME;
				if (currentBlockName === END_OF_CONTENT_NAME) {
					if (this.isIndefiniteForm) break;
					else {
						this.error = "EndOfContent is unexpected, BIT STRING may consists of BIT STRINGs only";
						return -1;
					}
				}
				if (currentBlockName !== BIT_STRING_NAME) {
					this.error = "BIT STRING may consists of BIT STRINGs only";
					return -1;
				}
				const valueBlock = value.valueBlock;
				if (this.unusedBits > 0 && valueBlock.unusedBits > 0) {
					this.error = "Using of \"unused bits\" inside constructive BIT STRING allowed for least one only";
					return -1;
				}
				this.unusedBits = valueBlock.unusedBits;
			}
			return resultOffset;
		}
		const inputView = import_build.BufferSourceConverter.toUint8Array(inputBuffer);
		if (!checkBufferParams(this, inputView, inputOffset, inputLength)) return -1;
		const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
		this.unusedBits = intBuffer[0];
		if (this.unusedBits > 7) {
			this.error = "Unused bits for BitString must be in range 0-7";
			return -1;
		}
		if (!this.unusedBits) {
			const buf = intBuffer.subarray(1);
			try {
				if (buf.byteLength) {
					const asn = localFromBER(buf, 0, buf.byteLength);
					if (asn.offset !== -1 && asn.offset === inputLength - 1) this.value = [asn.result];
				}
			} catch (e) {}
		}
		this.valueHexView = intBuffer.subarray(1);
		this.blockLength = intBuffer.length;
		return inputOffset + inputLength;
	}
	toBER(sizeOnly, writer) {
		if (this.isConstructed) return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
		if (sizeOnly) return new ArrayBuffer(this.valueHexView.byteLength + 1);
		if (!this.valueHexView.byteLength) return EMPTY_BUFFER;
		const retView = new Uint8Array(this.valueHexView.length + 1);
		retView[0] = this.unusedBits;
		retView.set(this.valueHexView, 1);
		return retView.buffer;
	}
	toJSON() {
		return {
			...super.toJSON(),
			unusedBits: this.unusedBits,
			isConstructed: this.isConstructed
		};
	}
};
LocalBitStringValueBlock.NAME = "BitStringValueBlock";
var _a$q;
var BitString = class extends BaseBlock {
	constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
		var _b, _c;
		(_b = parameters.isConstructed) !== null && _b !== void 0 || (parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0 ? void 0 : _c.length));
		super({
			idBlock: {
				isConstructed: parameters.isConstructed,
				...idBlock
			},
			lenBlock: {
				...lenBlock,
				isIndefiniteForm: !!parameters.isIndefiniteForm
			},
			...parameters
		}, LocalBitStringValueBlock);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 3;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		this.valueBlock.isConstructed = this.idBlock.isConstructed;
		this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
		return super.fromBER(inputBuffer, inputOffset, inputLength);
	}
	onAsciiEncoding() {
		if (this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length) return Constructed.prototype.onAsciiEncoding.call(this);
		else {
			const bits = [];
			const valueHex = this.valueBlock.valueHexView;
			for (const byte of valueHex) bits.push(byte.toString(2).padStart(8, "0"));
			const bitsStr = bits.join("");
			return `${this.constructor.NAME} : ${bitsStr.substring(0, bitsStr.length - this.valueBlock.unusedBits)}`;
		}
	}
};
_a$q = BitString;
(() => {
	typeStore.BitString = _a$q;
})();
BitString.NAME = BIT_STRING_NAME;
var _a$p;
function viewAdd(first, second) {
	const c = new Uint8Array([0]);
	const firstView = new Uint8Array(first);
	const secondView = new Uint8Array(second);
	let firstViewCopy = firstView.slice(0);
	const firstViewCopyLength = firstViewCopy.length - 1;
	const secondViewCopy = secondView.slice(0);
	const secondViewCopyLength = secondViewCopy.length - 1;
	let value = 0;
	const max = secondViewCopyLength < firstViewCopyLength ? firstViewCopyLength : secondViewCopyLength;
	let counter = 0;
	for (let i = max; i >= 0; i--, counter++) {
		switch (true) {
			case counter < secondViewCopy.length:
				value = firstViewCopy[firstViewCopyLength - counter] + secondViewCopy[secondViewCopyLength - counter] + c[0];
				break;
			default: value = firstViewCopy[firstViewCopyLength - counter] + c[0];
		}
		c[0] = value / 10;
		switch (true) {
			case counter >= firstViewCopy.length:
				firstViewCopy = utilConcatView(new Uint8Array([value % 10]), firstViewCopy);
				break;
			default: firstViewCopy[firstViewCopyLength - counter] = value % 10;
		}
	}
	if (c[0] > 0) firstViewCopy = utilConcatView(c, firstViewCopy);
	return firstViewCopy;
}
function power2(n) {
	if (n >= powers2.length) for (let p = powers2.length; p <= n; p++) {
		const c = new Uint8Array([0]);
		let digits = powers2[p - 1].slice(0);
		for (let i = digits.length - 1; i >= 0; i--) {
			const newValue = new Uint8Array([(digits[i] << 1) + c[0]]);
			c[0] = newValue[0] / 10;
			digits[i] = newValue[0] % 10;
		}
		if (c[0] > 0) digits = utilConcatView(c, digits);
		powers2.push(digits);
	}
	return powers2[n];
}
function viewSub(first, second) {
	let b = 0;
	const firstView = new Uint8Array(first);
	const secondView = new Uint8Array(second);
	const firstViewCopy = firstView.slice(0);
	const firstViewCopyLength = firstViewCopy.length - 1;
	const secondViewCopy = secondView.slice(0);
	const secondViewCopyLength = secondViewCopy.length - 1;
	let value;
	let counter = 0;
	for (let i = secondViewCopyLength; i >= 0; i--, counter++) {
		value = firstViewCopy[firstViewCopyLength - counter] - secondViewCopy[secondViewCopyLength - counter] - b;
		switch (true) {
			case value < 0:
				b = 1;
				firstViewCopy[firstViewCopyLength - counter] = value + 10;
				break;
			default:
				b = 0;
				firstViewCopy[firstViewCopyLength - counter] = value;
		}
	}
	if (b > 0) for (let i = firstViewCopyLength - secondViewCopyLength + 1; i >= 0; i--, counter++) {
		value = firstViewCopy[firstViewCopyLength - counter] - b;
		if (value < 0) {
			b = 1;
			firstViewCopy[firstViewCopyLength - counter] = value + 10;
		} else {
			b = 0;
			firstViewCopy[firstViewCopyLength - counter] = value;
			break;
		}
	}
	return firstViewCopy.slice();
}
var LocalIntegerValueBlock = class extends HexBlock(ValueBlock) {
	constructor({ value, ...parameters } = {}) {
		super(parameters);
		this._valueDec = 0;
		if (parameters.valueHex) this.setValueHex();
		if (value !== void 0) this.valueDec = value;
	}
	setValueHex() {
		if (this.valueHexView.length >= 4) {
			this.warnings.push("Too big Integer for decoding, hex only");
			this.isHexOnly = true;
			this._valueDec = 0;
		} else {
			this.isHexOnly = false;
			if (this.valueHexView.length > 0) this._valueDec = utilDecodeTC.call(this);
		}
	}
	set valueDec(v) {
		this._valueDec = v;
		this.isHexOnly = false;
		this.valueHexView = new Uint8Array(utilEncodeTC(v));
	}
	get valueDec() {
		return this._valueDec;
	}
	fromDER(inputBuffer, inputOffset, inputLength, expectedLength = 0) {
		const offset = this.fromBER(inputBuffer, inputOffset, inputLength);
		if (offset === -1) return offset;
		const view = this.valueHexView;
		if (view[0] === 0 && (view[1] & 128) !== 0) this.valueHexView = view.subarray(1);
		else if (expectedLength !== 0) {
			if (view.length < expectedLength) {
				if (expectedLength - view.length > 1) expectedLength = view.length + 1;
				this.valueHexView = view.subarray(expectedLength - view.length);
			}
		}
		return offset;
	}
	toDER(sizeOnly = false) {
		const view = this.valueHexView;
		switch (true) {
			case (view[0] & 128) !== 0:
				{
					const updatedView = new Uint8Array(this.valueHexView.length + 1);
					updatedView[0] = 0;
					updatedView.set(view, 1);
					this.valueHexView = updatedView;
				}
				break;
			case view[0] === 0 && (view[1] & 128) === 0: this.valueHexView = this.valueHexView.subarray(1);
		}
		return this.toBER(sizeOnly);
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		const resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
		if (resultOffset === -1) return resultOffset;
		this.setValueHex();
		return resultOffset;
	}
	toBER(sizeOnly) {
		return sizeOnly ? new ArrayBuffer(this.valueHexView.length) : this.valueHexView.slice().buffer;
	}
	toJSON() {
		return {
			...super.toJSON(),
			valueDec: this.valueDec
		};
	}
	toString() {
		const firstBit = this.valueHexView.length * 8 - 1;
		let digits = new Uint8Array(this.valueHexView.length * 8 / 3);
		let bitNumber = 0;
		let currentByte;
		const asn1View = this.valueHexView;
		let result = "";
		let flag = false;
		for (let byteNumber = asn1View.byteLength - 1; byteNumber >= 0; byteNumber--) {
			currentByte = asn1View[byteNumber];
			for (let i = 0; i < 8; i++) {
				if ((currentByte & 1) === 1) switch (bitNumber) {
					case firstBit:
						digits = viewSub(power2(bitNumber), digits);
						result = "-";
						break;
					default: digits = viewAdd(digits, power2(bitNumber));
				}
				bitNumber++;
				currentByte >>= 1;
			}
		}
		for (let i = 0; i < digits.length; i++) {
			if (digits[i]) flag = true;
			if (flag) result += digitsString.charAt(digits[i]);
		}
		if (flag === false) result += digitsString.charAt(0);
		return result;
	}
};
_a$p = LocalIntegerValueBlock;
LocalIntegerValueBlock.NAME = "IntegerValueBlock";
(() => {
	Object.defineProperty(_a$p.prototype, "valueHex", {
		set: function(v) {
			this.valueHexView = new Uint8Array(v);
			this.setValueHex();
		},
		get: function() {
			return this.valueHexView.slice().buffer;
		}
	});
})();
var _a$o;
var Integer = class Integer extends BaseBlock {
	constructor(parameters = {}) {
		super(parameters, LocalIntegerValueBlock);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 2;
	}
	toBigInt() {
		assertBigInt();
		return BigInt(this.valueBlock.toString());
	}
	static fromBigInt(value) {
		assertBigInt();
		const bigIntValue = BigInt(value);
		const writer = new ViewWriter();
		const hex = bigIntValue.toString(16).replace(/^-/, "");
		const view = new Uint8Array(import_build.Convert.FromHex(hex));
		if (bigIntValue < 0) {
			const first = new Uint8Array(view.length + (view[0] & 128 ? 1 : 0));
			first[0] |= 128;
			const secondInt = BigInt(`0x${import_build.Convert.ToHex(first)}`) + bigIntValue;
			const second = import_build.BufferSourceConverter.toUint8Array(import_build.Convert.FromHex(secondInt.toString(16)));
			second[0] |= 128;
			writer.write(second);
		} else {
			if (view[0] & 128) writer.write(new Uint8Array([0]));
			writer.write(view);
		}
		return new Integer({ valueHex: writer.final() });
	}
	convertToDER() {
		const integer = new Integer({ valueHex: this.valueBlock.valueHexView });
		integer.valueBlock.toDER();
		return integer;
	}
	convertFromDER() {
		return new Integer({ valueHex: this.valueBlock.valueHexView[0] === 0 ? this.valueBlock.valueHexView.subarray(1) : this.valueBlock.valueHexView });
	}
	onAsciiEncoding() {
		return `${this.constructor.NAME} : ${this.valueBlock.toString()}`;
	}
};
_a$o = Integer;
(() => {
	typeStore.Integer = _a$o;
})();
Integer.NAME = "INTEGER";
var _a$n;
var Enumerated = class extends Integer {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 10;
	}
};
_a$n = Enumerated;
(() => {
	typeStore.Enumerated = _a$n;
})();
Enumerated.NAME = "ENUMERATED";
var LocalSidValueBlock = class extends HexBlock(ValueBlock) {
	constructor({ valueDec = -1, isFirstSid = false, ...parameters } = {}) {
		super(parameters);
		this.valueDec = valueDec;
		this.isFirstSid = isFirstSid;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		if (!inputLength) return inputOffset;
		const inputView = import_build.BufferSourceConverter.toUint8Array(inputBuffer);
		if (!checkBufferParams(this, inputView, inputOffset, inputLength)) return -1;
		const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
		this.valueHexView = new Uint8Array(inputLength);
		for (let i = 0; i < inputLength; i++) {
			this.valueHexView[i] = intBuffer[i] & 127;
			this.blockLength++;
			if ((intBuffer[i] & 128) === 0) break;
		}
		const tempView = new Uint8Array(this.blockLength);
		for (let i = 0; i < this.blockLength; i++) tempView[i] = this.valueHexView[i];
		this.valueHexView = tempView;
		if ((intBuffer[this.blockLength - 1] & 128) !== 0) {
			this.error = "End of input reached before message was fully decoded";
			return -1;
		}
		if (this.valueHexView[0] === 0) this.warnings.push("Needlessly long format of SID encoding");
		if (this.blockLength <= 8) this.valueDec = utilFromBase(this.valueHexView, 7);
		else {
			this.isHexOnly = true;
			this.warnings.push("Too big SID for decoding, hex only");
		}
		return inputOffset + this.blockLength;
	}
	set valueBigInt(value) {
		assertBigInt();
		let bits = BigInt(value).toString(2);
		while (bits.length % 7) bits = "0" + bits;
		const bytes = new Uint8Array(bits.length / 7);
		for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(bits.slice(i * 7, i * 7 + 7), 2) + (i + 1 < bytes.length ? 128 : 0);
		this.fromBER(bytes.buffer, 0, bytes.length);
	}
	toBER(sizeOnly) {
		if (this.isHexOnly) {
			if (sizeOnly) return new ArrayBuffer(this.valueHexView.byteLength);
			const curView = this.valueHexView;
			const retView = new Uint8Array(this.blockLength);
			for (let i = 0; i < this.blockLength - 1; i++) retView[i] = curView[i] | 128;
			retView[this.blockLength - 1] = curView[this.blockLength - 1];
			return retView.buffer;
		}
		const encodedBuf = utilToBase(this.valueDec, 7);
		if (encodedBuf.byteLength === 0) {
			this.error = "Error during encoding SID value";
			return EMPTY_BUFFER;
		}
		const retView = new Uint8Array(encodedBuf.byteLength);
		if (!sizeOnly) {
			const encodedView = new Uint8Array(encodedBuf);
			const len = encodedBuf.byteLength - 1;
			for (let i = 0; i < len; i++) retView[i] = encodedView[i] | 128;
			retView[len] = encodedView[len];
		}
		return retView;
	}
	toString() {
		let result = "";
		if (this.isHexOnly) result = import_build.Convert.ToHex(this.valueHexView);
		else if (this.isFirstSid) {
			let sidValue = this.valueDec;
			if (this.valueDec <= 39) result = "0.";
			else if (this.valueDec <= 79) {
				result = "1.";
				sidValue -= 40;
			} else {
				result = "2.";
				sidValue -= 80;
			}
			result += sidValue.toString();
		} else result = this.valueDec.toString();
		return result;
	}
	toJSON() {
		return {
			...super.toJSON(),
			valueDec: this.valueDec,
			isFirstSid: this.isFirstSid
		};
	}
};
LocalSidValueBlock.NAME = "sidBlock";
var LocalObjectIdentifierValueBlock = class extends ValueBlock {
	constructor({ value = EMPTY_STRING, ...parameters } = {}) {
		super(parameters);
		this.value = [];
		if (value) this.fromString(value);
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		let resultOffset = inputOffset;
		while (inputLength > 0) {
			const sidBlock = new LocalSidValueBlock();
			resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
			if (resultOffset === -1) {
				this.blockLength = 0;
				this.error = sidBlock.error;
				return resultOffset;
			}
			if (this.value.length === 0) sidBlock.isFirstSid = true;
			this.blockLength += sidBlock.blockLength;
			inputLength -= sidBlock.blockLength;
			this.value.push(sidBlock);
		}
		return resultOffset;
	}
	toBER(sizeOnly) {
		const retBuffers = [];
		for (let i = 0; i < this.value.length; i++) {
			const valueBuf = this.value[i].toBER(sizeOnly);
			if (valueBuf.byteLength === 0) {
				this.error = this.value[i].error;
				return EMPTY_BUFFER;
			}
			retBuffers.push(valueBuf);
		}
		return concat(retBuffers);
	}
	fromString(string) {
		this.value = [];
		let pos1 = 0;
		let pos2 = 0;
		let sid = "";
		let flag = false;
		do {
			pos2 = string.indexOf(".", pos1);
			if (pos2 === -1) sid = string.substring(pos1);
			else sid = string.substring(pos1, pos2);
			pos1 = pos2 + 1;
			if (flag) {
				const sidBlock = this.value[0];
				let plus = 0;
				switch (sidBlock.valueDec) {
					case 0: break;
					case 1:
						plus = 40;
						break;
					case 2:
						plus = 80;
						break;
					default:
						this.value = [];
						return;
				}
				const parsedSID = parseInt(sid, 10);
				if (isNaN(parsedSID)) return;
				sidBlock.valueDec = parsedSID + plus;
				flag = false;
			} else {
				const sidBlock = new LocalSidValueBlock();
				if (sid > Number.MAX_SAFE_INTEGER) {
					assertBigInt();
					sidBlock.valueBigInt = BigInt(sid);
				} else {
					sidBlock.valueDec = parseInt(sid, 10);
					if (isNaN(sidBlock.valueDec)) return;
				}
				if (!this.value.length) {
					sidBlock.isFirstSid = true;
					flag = true;
				}
				this.value.push(sidBlock);
			}
		} while (pos2 !== -1);
	}
	toString() {
		let result = "";
		let isHexOnly = false;
		for (let i = 0; i < this.value.length; i++) {
			isHexOnly = this.value[i].isHexOnly;
			let sidStr = this.value[i].toString();
			if (i !== 0) result = `${result}.`;
			if (isHexOnly) {
				sidStr = `{${sidStr}}`;
				if (this.value[i].isFirstSid) result = `2.{${sidStr} - 80}`;
				else result += sidStr;
			} else result += sidStr;
		}
		return result;
	}
	toJSON() {
		const object = {
			...super.toJSON(),
			value: this.toString(),
			sidArray: []
		};
		for (let i = 0; i < this.value.length; i++) object.sidArray.push(this.value[i].toJSON());
		return object;
	}
};
LocalObjectIdentifierValueBlock.NAME = "ObjectIdentifierValueBlock";
var _a$m;
var ObjectIdentifier = class extends BaseBlock {
	constructor(parameters = {}) {
		super(parameters, LocalObjectIdentifierValueBlock);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 6;
	}
	getValue() {
		return this.valueBlock.toString();
	}
	setValue(value) {
		this.valueBlock.fromString(value);
	}
	onAsciiEncoding() {
		return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
	}
	toJSON() {
		return {
			...super.toJSON(),
			value: this.getValue()
		};
	}
};
_a$m = ObjectIdentifier;
(() => {
	typeStore.ObjectIdentifier = _a$m;
})();
ObjectIdentifier.NAME = "OBJECT IDENTIFIER";
var LocalRelativeSidValueBlock = class extends HexBlock(LocalBaseBlock) {
	constructor({ valueDec = 0, ...parameters } = {}) {
		super(parameters);
		this.valueDec = valueDec;
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		if (inputLength === 0) return inputOffset;
		const inputView = import_build.BufferSourceConverter.toUint8Array(inputBuffer);
		if (!checkBufferParams(this, inputView, inputOffset, inputLength)) return -1;
		const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
		this.valueHexView = new Uint8Array(inputLength);
		for (let i = 0; i < inputLength; i++) {
			this.valueHexView[i] = intBuffer[i] & 127;
			this.blockLength++;
			if ((intBuffer[i] & 128) === 0) break;
		}
		const tempView = new Uint8Array(this.blockLength);
		for (let i = 0; i < this.blockLength; i++) tempView[i] = this.valueHexView[i];
		this.valueHexView = tempView;
		if ((intBuffer[this.blockLength - 1] & 128) !== 0) {
			this.error = "End of input reached before message was fully decoded";
			return -1;
		}
		if (this.valueHexView[0] === 0) this.warnings.push("Needlessly long format of SID encoding");
		if (this.blockLength <= 8) this.valueDec = utilFromBase(this.valueHexView, 7);
		else {
			this.isHexOnly = true;
			this.warnings.push("Too big SID for decoding, hex only");
		}
		return inputOffset + this.blockLength;
	}
	toBER(sizeOnly) {
		if (this.isHexOnly) {
			if (sizeOnly) return new ArrayBuffer(this.valueHexView.byteLength);
			const curView = this.valueHexView;
			const retView = new Uint8Array(this.blockLength);
			for (let i = 0; i < this.blockLength - 1; i++) retView[i] = curView[i] | 128;
			retView[this.blockLength - 1] = curView[this.blockLength - 1];
			return retView.buffer;
		}
		const encodedBuf = utilToBase(this.valueDec, 7);
		if (encodedBuf.byteLength === 0) {
			this.error = "Error during encoding SID value";
			return EMPTY_BUFFER;
		}
		const retView = new Uint8Array(encodedBuf.byteLength);
		if (!sizeOnly) {
			const encodedView = new Uint8Array(encodedBuf);
			const len = encodedBuf.byteLength - 1;
			for (let i = 0; i < len; i++) retView[i] = encodedView[i] | 128;
			retView[len] = encodedView[len];
		}
		return retView.buffer;
	}
	toString() {
		let result = "";
		if (this.isHexOnly) result = import_build.Convert.ToHex(this.valueHexView);
		else result = this.valueDec.toString();
		return result;
	}
	toJSON() {
		return {
			...super.toJSON(),
			valueDec: this.valueDec
		};
	}
};
LocalRelativeSidValueBlock.NAME = "relativeSidBlock";
var LocalRelativeObjectIdentifierValueBlock = class extends ValueBlock {
	constructor({ value = EMPTY_STRING, ...parameters } = {}) {
		super(parameters);
		this.value = [];
		if (value) this.fromString(value);
	}
	fromBER(inputBuffer, inputOffset, inputLength) {
		let resultOffset = inputOffset;
		while (inputLength > 0) {
			const sidBlock = new LocalRelativeSidValueBlock();
			resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
			if (resultOffset === -1) {
				this.blockLength = 0;
				this.error = sidBlock.error;
				return resultOffset;
			}
			this.blockLength += sidBlock.blockLength;
			inputLength -= sidBlock.blockLength;
			this.value.push(sidBlock);
		}
		return resultOffset;
	}
	toBER(sizeOnly, writer) {
		const retBuffers = [];
		for (let i = 0; i < this.value.length; i++) {
			const valueBuf = this.value[i].toBER(sizeOnly);
			if (valueBuf.byteLength === 0) {
				this.error = this.value[i].error;
				return EMPTY_BUFFER;
			}
			retBuffers.push(valueBuf);
		}
		return concat(retBuffers);
	}
	fromString(string) {
		this.value = [];
		let pos1 = 0;
		let pos2 = 0;
		let sid = "";
		do {
			pos2 = string.indexOf(".", pos1);
			if (pos2 === -1) sid = string.substring(pos1);
			else sid = string.substring(pos1, pos2);
			pos1 = pos2 + 1;
			const sidBlock = new LocalRelativeSidValueBlock();
			sidBlock.valueDec = parseInt(sid, 10);
			if (isNaN(sidBlock.valueDec)) return true;
			this.value.push(sidBlock);
		} while (pos2 !== -1);
		return true;
	}
	toString() {
		let result = "";
		let isHexOnly = false;
		for (let i = 0; i < this.value.length; i++) {
			isHexOnly = this.value[i].isHexOnly;
			let sidStr = this.value[i].toString();
			if (i !== 0) result = `${result}.`;
			if (isHexOnly) {
				sidStr = `{${sidStr}}`;
				result += sidStr;
			} else result += sidStr;
		}
		return result;
	}
	toJSON() {
		const object = {
			...super.toJSON(),
			value: this.toString(),
			sidArray: []
		};
		for (let i = 0; i < this.value.length; i++) object.sidArray.push(this.value[i].toJSON());
		return object;
	}
};
LocalRelativeObjectIdentifierValueBlock.NAME = "RelativeObjectIdentifierValueBlock";
var _a$l;
var RelativeObjectIdentifier = class extends BaseBlock {
	constructor(parameters = {}) {
		super(parameters, LocalRelativeObjectIdentifierValueBlock);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 13;
	}
	getValue() {
		return this.valueBlock.toString();
	}
	setValue(value) {
		this.valueBlock.fromString(value);
	}
	onAsciiEncoding() {
		return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
	}
	toJSON() {
		return {
			...super.toJSON(),
			value: this.getValue()
		};
	}
};
_a$l = RelativeObjectIdentifier;
(() => {
	typeStore.RelativeObjectIdentifier = _a$l;
})();
RelativeObjectIdentifier.NAME = "RelativeObjectIdentifier";
var _a$k;
var Sequence = class extends Constructed {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 16;
	}
};
_a$k = Sequence;
(() => {
	typeStore.Sequence = _a$k;
})();
Sequence.NAME = "SEQUENCE";
var _a$j;
var Set$1 = class extends Constructed {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 17;
	}
};
_a$j = Set$1;
(() => {
	typeStore.Set = _a$j;
})();
Set$1.NAME = "SET";
var LocalStringValueBlock = class extends HexBlock(ValueBlock) {
	constructor({ ...parameters } = {}) {
		super(parameters);
		this.isHexOnly = true;
		this.value = EMPTY_STRING;
	}
	toJSON() {
		return {
			...super.toJSON(),
			value: this.value
		};
	}
};
LocalStringValueBlock.NAME = "StringValueBlock";
var LocalSimpleStringValueBlock = class extends LocalStringValueBlock {};
LocalSimpleStringValueBlock.NAME = "SimpleStringValueBlock";
var LocalSimpleStringBlock = class extends BaseStringBlock {
	constructor({ ...parameters } = {}) {
		super(parameters, LocalSimpleStringValueBlock);
	}
	fromBuffer(inputBuffer) {
		this.valueBlock.value = String.fromCharCode.apply(null, import_build.BufferSourceConverter.toUint8Array(inputBuffer));
	}
	fromString(inputString) {
		const strLen = inputString.length;
		const view = this.valueBlock.valueHexView = new Uint8Array(strLen);
		for (let i = 0; i < strLen; i++) view[i] = inputString.charCodeAt(i);
		this.valueBlock.value = inputString;
	}
};
LocalSimpleStringBlock.NAME = "SIMPLE STRING";
var LocalUtf8StringValueBlock = class extends LocalSimpleStringBlock {
	fromBuffer(inputBuffer) {
		this.valueBlock.valueHexView = import_build.BufferSourceConverter.toUint8Array(inputBuffer);
		try {
			this.valueBlock.value = import_build.Convert.ToUtf8String(inputBuffer);
		} catch (ex) {
			this.warnings.push(`Error during "decodeURIComponent": ${ex}, using raw string`);
			this.valueBlock.value = import_build.Convert.ToBinary(inputBuffer);
		}
	}
	fromString(inputString) {
		this.valueBlock.valueHexView = new Uint8Array(import_build.Convert.FromUtf8String(inputString));
		this.valueBlock.value = inputString;
	}
};
LocalUtf8StringValueBlock.NAME = "Utf8StringValueBlock";
var _a$i;
var Utf8String = class extends LocalUtf8StringValueBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 12;
	}
};
_a$i = Utf8String;
(() => {
	typeStore.Utf8String = _a$i;
})();
Utf8String.NAME = "UTF8String";
var LocalBmpStringValueBlock = class extends LocalSimpleStringBlock {
	fromBuffer(inputBuffer) {
		this.valueBlock.value = import_build.Convert.ToUtf16String(inputBuffer);
		this.valueBlock.valueHexView = import_build.BufferSourceConverter.toUint8Array(inputBuffer);
	}
	fromString(inputString) {
		this.valueBlock.value = inputString;
		this.valueBlock.valueHexView = new Uint8Array(import_build.Convert.FromUtf16String(inputString));
	}
};
LocalBmpStringValueBlock.NAME = "BmpStringValueBlock";
var _a$h;
var BmpString = class extends LocalBmpStringValueBlock {
	constructor({ ...parameters } = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 30;
	}
};
_a$h = BmpString;
(() => {
	typeStore.BmpString = _a$h;
})();
BmpString.NAME = "BMPString";
var LocalUniversalStringValueBlock = class extends LocalSimpleStringBlock {
	fromBuffer(inputBuffer) {
		const copyBuffer = ArrayBuffer.isView(inputBuffer) ? inputBuffer.slice().buffer : inputBuffer.slice(0);
		const valueView = new Uint8Array(copyBuffer);
		for (let i = 0; i < valueView.length; i += 4) {
			valueView[i] = valueView[i + 3];
			valueView[i + 1] = valueView[i + 2];
			valueView[i + 2] = 0;
			valueView[i + 3] = 0;
		}
		this.valueBlock.value = String.fromCharCode.apply(null, new Uint32Array(copyBuffer));
	}
	fromString(inputString) {
		const strLength = inputString.length;
		const valueHexView = this.valueBlock.valueHexView = new Uint8Array(strLength * 4);
		for (let i = 0; i < strLength; i++) {
			const codeBuf = utilToBase(inputString.charCodeAt(i), 8);
			const codeView = new Uint8Array(codeBuf);
			if (codeView.length > 4) continue;
			const dif = 4 - codeView.length;
			for (let j = codeView.length - 1; j >= 0; j--) valueHexView[i * 4 + j + dif] = codeView[j];
		}
		this.valueBlock.value = inputString;
	}
};
LocalUniversalStringValueBlock.NAME = "UniversalStringValueBlock";
var _a$g;
var UniversalString = class extends LocalUniversalStringValueBlock {
	constructor({ ...parameters } = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 28;
	}
};
_a$g = UniversalString;
(() => {
	typeStore.UniversalString = _a$g;
})();
UniversalString.NAME = "UniversalString";
var _a$f;
var NumericString = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 18;
	}
};
_a$f = NumericString;
(() => {
	typeStore.NumericString = _a$f;
})();
NumericString.NAME = "NumericString";
var _a$e;
var PrintableString = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 19;
	}
};
_a$e = PrintableString;
(() => {
	typeStore.PrintableString = _a$e;
})();
PrintableString.NAME = "PrintableString";
var _a$d;
var TeletexString = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 20;
	}
};
_a$d = TeletexString;
(() => {
	typeStore.TeletexString = _a$d;
})();
TeletexString.NAME = "TeletexString";
var _a$c;
var VideotexString = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 21;
	}
};
_a$c = VideotexString;
(() => {
	typeStore.VideotexString = _a$c;
})();
VideotexString.NAME = "VideotexString";
var _a$b;
var IA5String = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 22;
	}
};
_a$b = IA5String;
(() => {
	typeStore.IA5String = _a$b;
})();
IA5String.NAME = "IA5String";
var _a$a;
var GraphicString = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 25;
	}
};
_a$a = GraphicString;
(() => {
	typeStore.GraphicString = _a$a;
})();
GraphicString.NAME = "GraphicString";
var _a$9;
var VisibleString = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 26;
	}
};
_a$9 = VisibleString;
(() => {
	typeStore.VisibleString = _a$9;
})();
VisibleString.NAME = "VisibleString";
var _a$8;
var GeneralString = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 27;
	}
};
_a$8 = GeneralString;
(() => {
	typeStore.GeneralString = _a$8;
})();
GeneralString.NAME = "GeneralString";
var _a$7;
var CharacterString = class extends LocalSimpleStringBlock {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 29;
	}
};
_a$7 = CharacterString;
(() => {
	typeStore.CharacterString = _a$7;
})();
CharacterString.NAME = "CharacterString";
var _a$6;
var UTCTime = class extends VisibleString {
	constructor({ value, valueDate, ...parameters } = {}) {
		super(parameters);
		this.year = 0;
		this.month = 0;
		this.day = 0;
		this.hour = 0;
		this.minute = 0;
		this.second = 0;
		if (value) {
			this.fromString(value);
			this.valueBlock.valueHexView = new Uint8Array(value.length);
			for (let i = 0; i < value.length; i++) this.valueBlock.valueHexView[i] = value.charCodeAt(i);
		}
		if (valueDate) {
			this.fromDate(valueDate);
			this.valueBlock.valueHexView = new Uint8Array(this.toBuffer());
		}
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 23;
	}
	fromBuffer(inputBuffer) {
		this.fromString(String.fromCharCode.apply(null, import_build.BufferSourceConverter.toUint8Array(inputBuffer)));
	}
	toBuffer() {
		const str = this.toString();
		const buffer = new ArrayBuffer(str.length);
		const view = new Uint8Array(buffer);
		for (let i = 0; i < str.length; i++) view[i] = str.charCodeAt(i);
		return buffer;
	}
	fromDate(inputDate) {
		this.year = inputDate.getUTCFullYear();
		this.month = inputDate.getUTCMonth() + 1;
		this.day = inputDate.getUTCDate();
		this.hour = inputDate.getUTCHours();
		this.minute = inputDate.getUTCMinutes();
		this.second = inputDate.getUTCSeconds();
	}
	toDate() {
		return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second));
	}
	fromString(inputString) {
		const parserArray = /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/gi.exec(inputString);
		if (parserArray === null) {
			this.error = "Wrong input string for conversion";
			return;
		}
		const year = parseInt(parserArray[1], 10);
		if (year >= 50) this.year = 1900 + year;
		else this.year = 2e3 + year;
		this.month = parseInt(parserArray[2], 10);
		this.day = parseInt(parserArray[3], 10);
		this.hour = parseInt(parserArray[4], 10);
		this.minute = parseInt(parserArray[5], 10);
		this.second = parseInt(parserArray[6], 10);
	}
	toString(encoding = "iso") {
		if (encoding === "iso") {
			const outputArray = new Array(7);
			outputArray[0] = padNumber(this.year < 2e3 ? this.year - 1900 : this.year - 2e3, 2);
			outputArray[1] = padNumber(this.month, 2);
			outputArray[2] = padNumber(this.day, 2);
			outputArray[3] = padNumber(this.hour, 2);
			outputArray[4] = padNumber(this.minute, 2);
			outputArray[5] = padNumber(this.second, 2);
			outputArray[6] = "Z";
			return outputArray.join("");
		}
		return super.toString(encoding);
	}
	onAsciiEncoding() {
		return `${this.constructor.NAME} : ${this.toDate().toISOString()}`;
	}
	toJSON() {
		return {
			...super.toJSON(),
			year: this.year,
			month: this.month,
			day: this.day,
			hour: this.hour,
			minute: this.minute,
			second: this.second
		};
	}
};
_a$6 = UTCTime;
(() => {
	typeStore.UTCTime = _a$6;
})();
UTCTime.NAME = "UTCTime";
var _a$5;
var GeneralizedTime = class extends UTCTime {
	constructor(parameters = {}) {
		var _b;
		super(parameters);
		(_b = this.millisecond) !== null && _b !== void 0 || (this.millisecond = 0);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 24;
	}
	fromDate(inputDate) {
		super.fromDate(inputDate);
		this.millisecond = inputDate.getUTCMilliseconds();
	}
	toDate() {
		return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond));
	}
	fromString(inputString) {
		let isUTC = false;
		let timeString = "";
		let dateTimeString = "";
		let fractionPart = 0;
		let parser;
		let hourDifference = 0;
		let minuteDifference = 0;
		if (inputString[inputString.length - 1] === "Z") {
			timeString = inputString.substring(0, inputString.length - 1);
			isUTC = true;
		} else {
			const number = new Number(inputString[inputString.length - 1]);
			if (isNaN(number.valueOf())) throw new Error("Wrong input string for conversion");
			timeString = inputString;
		}
		if (isUTC) {
			if (timeString.indexOf("+") !== -1) throw new Error("Wrong input string for conversion");
			if (timeString.indexOf("-") !== -1) throw new Error("Wrong input string for conversion");
		} else {
			let multiplier = 1;
			let differencePosition = timeString.indexOf("+");
			let differenceString = "";
			if (differencePosition === -1) {
				differencePosition = timeString.indexOf("-");
				multiplier = -1;
			}
			if (differencePosition !== -1) {
				differenceString = timeString.substring(differencePosition + 1);
				timeString = timeString.substring(0, differencePosition);
				if (differenceString.length !== 2 && differenceString.length !== 4) throw new Error("Wrong input string for conversion");
				let number = parseInt(differenceString.substring(0, 2), 10);
				if (isNaN(number.valueOf())) throw new Error("Wrong input string for conversion");
				hourDifference = multiplier * number;
				if (differenceString.length === 4) {
					number = parseInt(differenceString.substring(2, 4), 10);
					if (isNaN(number.valueOf())) throw new Error("Wrong input string for conversion");
					minuteDifference = multiplier * number;
				}
			}
		}
		let fractionPointPosition = timeString.indexOf(".");
		if (fractionPointPosition === -1) fractionPointPosition = timeString.indexOf(",");
		if (fractionPointPosition !== -1) {
			const fractionPartCheck = /* @__PURE__ */ new Number(`0${timeString.substring(fractionPointPosition)}`);
			if (isNaN(fractionPartCheck.valueOf())) throw new Error("Wrong input string for conversion");
			fractionPart = fractionPartCheck.valueOf();
			dateTimeString = timeString.substring(0, fractionPointPosition);
		} else dateTimeString = timeString;
		switch (true) {
			case dateTimeString.length === 8:
				parser = /(\d{4})(\d{2})(\d{2})/gi;
				if (fractionPointPosition !== -1) throw new Error("Wrong input string for conversion");
				break;
			case dateTimeString.length === 10:
				parser = /(\d{4})(\d{2})(\d{2})(\d{2})/gi;
				if (fractionPointPosition !== -1) {
					let fractionResult = 60 * fractionPart;
					this.minute = Math.floor(fractionResult);
					fractionResult = 60 * (fractionResult - this.minute);
					this.second = Math.floor(fractionResult);
					fractionResult = 1e3 * (fractionResult - this.second);
					this.millisecond = Math.floor(fractionResult);
				}
				break;
			case dateTimeString.length === 12:
				parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/gi;
				if (fractionPointPosition !== -1) {
					let fractionResult = 60 * fractionPart;
					this.second = Math.floor(fractionResult);
					fractionResult = 1e3 * (fractionResult - this.second);
					this.millisecond = Math.floor(fractionResult);
				}
				break;
			case dateTimeString.length === 14:
				parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/gi;
				if (fractionPointPosition !== -1) {
					const fractionResult = 1e3 * fractionPart;
					this.millisecond = Math.floor(fractionResult);
				}
				break;
			default: throw new Error("Wrong input string for conversion");
		}
		const parserArray = parser.exec(dateTimeString);
		if (parserArray === null) throw new Error("Wrong input string for conversion");
		for (let j = 1; j < parserArray.length; j++) switch (j) {
			case 1:
				this.year = parseInt(parserArray[j], 10);
				break;
			case 2:
				this.month = parseInt(parserArray[j], 10);
				break;
			case 3:
				this.day = parseInt(parserArray[j], 10);
				break;
			case 4:
				this.hour = parseInt(parserArray[j], 10) + hourDifference;
				break;
			case 5:
				this.minute = parseInt(parserArray[j], 10) + minuteDifference;
				break;
			case 6:
				this.second = parseInt(parserArray[j], 10);
				break;
			default: throw new Error("Wrong input string for conversion");
		}
		if (isUTC === false) {
			const tempDate = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
			this.year = tempDate.getUTCFullYear();
			this.month = tempDate.getUTCMonth();
			this.day = tempDate.getUTCDay();
			this.hour = tempDate.getUTCHours();
			this.minute = tempDate.getUTCMinutes();
			this.second = tempDate.getUTCSeconds();
			this.millisecond = tempDate.getUTCMilliseconds();
		}
	}
	toString(encoding = "iso") {
		if (encoding === "iso") {
			const outputArray = [];
			outputArray.push(padNumber(this.year, 4));
			outputArray.push(padNumber(this.month, 2));
			outputArray.push(padNumber(this.day, 2));
			outputArray.push(padNumber(this.hour, 2));
			outputArray.push(padNumber(this.minute, 2));
			outputArray.push(padNumber(this.second, 2));
			if (this.millisecond !== 0) {
				outputArray.push(".");
				outputArray.push(padNumber(this.millisecond, 3));
			}
			outputArray.push("Z");
			return outputArray.join("");
		}
		return super.toString(encoding);
	}
	toJSON() {
		return {
			...super.toJSON(),
			millisecond: this.millisecond
		};
	}
};
_a$5 = GeneralizedTime;
(() => {
	typeStore.GeneralizedTime = _a$5;
})();
GeneralizedTime.NAME = "GeneralizedTime";
var _a$4;
var DATE = class extends Utf8String {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 31;
	}
};
_a$4 = DATE;
(() => {
	typeStore.DATE = _a$4;
})();
DATE.NAME = "DATE";
var _a$3;
var TimeOfDay = class extends Utf8String {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 32;
	}
};
_a$3 = TimeOfDay;
(() => {
	typeStore.TimeOfDay = _a$3;
})();
TimeOfDay.NAME = "TimeOfDay";
var _a$2;
var DateTime = class extends Utf8String {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 33;
	}
};
_a$2 = DateTime;
(() => {
	typeStore.DateTime = _a$2;
})();
DateTime.NAME = "DateTime";
var _a$1;
var Duration = class extends Utf8String {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 34;
	}
};
_a$1 = Duration;
(() => {
	typeStore.Duration = _a$1;
})();
Duration.NAME = "Duration";
var _a;
var TIME = class extends Utf8String {
	constructor(parameters = {}) {
		super(parameters);
		this.idBlock.tagClass = 1;
		this.idBlock.tagNumber = 14;
	}
};
_a = TIME;
(() => {
	typeStore.TIME = _a;
})();
TIME.NAME = "TIME";
//#endregion
//#region vendor/ipld-explorer-components/node_modules/uint8arrays/dist/src/to-string.js
/**
* Turns a `Uint8Array` into a string.
*
* Supports `utf8`, `utf-8` and any encoding supported by the multibase module.
*
* Also `ascii` which is similar to node's 'binary' encoding.
*/
function toString$2(array, encoding = "utf8") {
	const base = BASES[encoding];
	if (base == null) throw new Error(`Unsupported encoding "${encoding}"`);
	return base.encoder.encode(array).substring(1);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/crypto/dist/src/random-bytes.js
/**
* Generates a Uint8Array with length `number` populated by random bytes
*/
function randomBytes(length) {
	if (isNaN(length) || length <= 0) throw new InvalidParametersError("random bytes length must be a Number bigger than 0");
	return randomBytes$1(length);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/crypto/dist/src/errors.js
/**
* Verifying a message signature failed
*/
var VerificationError = class extends Error {
	constructor(message = "An error occurred while verifying a message") {
		super(message);
		this.name = "VerificationError";
	}
};
/**
* WebCrypto was not available in the current context
*/
var WebCryptoMissingError = class extends Error {
	constructor(message = "Missing Web Crypto API") {
		super(message);
		this.name = "WebCryptoMissingError";
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/crypto/dist/src/webcrypto/index.js
var webcrypto_default = { get(win = globalThis) {
	const nativeCrypto = win.crypto;
	if (nativeCrypto?.subtle == null) throw new WebCryptoMissingError("Missing Web Crypto API. The most likely cause of this error is that this page is being accessed from an insecure context (i.e. not HTTPS). For more information and possible resolutions see https://github.com/libp2p/js-libp2p/blob/main/packages/crypto/README.md#web-crypto-api");
	return nativeCrypto;
} };
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/crypto/dist/src/keys/rsa/index.browser.js
async function hashAndVerify$1(key, sig, msg) {
	const publicKey = await webcrypto_default.get().subtle.importKey("jwk", key, {
		name: "RSASSA-PKCS1-v1_5",
		hash: { name: "SHA-256" }
	}, false, ["verify"]);
	return webcrypto_default.get().subtle.verify({ name: "RSASSA-PKCS1-v1_5" }, publicKey, sig, msg instanceof Uint8Array ? msg : msg.subarray());
}
function rsaKeySize(jwk) {
	if (jwk.kty !== "RSA") throw new InvalidParametersError("invalid key type");
	else if (jwk.n == null) throw new InvalidParametersError("invalid key modulus");
	return fromString(jwk.n, "base64url").length * 8;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/crypto/dist/src/keys/rsa/rsa.js
var RSAPublicKey = class {
	type = "RSA";
	_key;
	_raw;
	_multihash;
	constructor(key, digest) {
		this._key = key;
		this._multihash = digest;
	}
	get raw() {
		if (this._raw == null) this._raw = jwkToPkix(this._key);
		return this._raw;
	}
	toMultihash() {
		return this._multihash;
	}
	toCID() {
		return CID.createV1(114, this._multihash);
	}
	toString() {
		return base58btc.encode(this.toMultihash().bytes).substring(1);
	}
	equals(key) {
		if (key == null || !(key.raw instanceof Uint8Array)) return false;
		return equals(this.raw, key.raw);
	}
	verify(data, sig) {
		return hashAndVerify$1(this._key, sig, data);
	}
};
var SHA2_256_CODE = 18;
/**
* Convert a PKIX in ASN1 DER format to a JWK key
*/
function pkixToJwk(bytes) {
	const { result } = fromBER(bytes);
	const values = result.valueBlock.value[1].valueBlock.value[0].valueBlock.value;
	return {
		kty: "RSA",
		n: toString$2(bnToBuf(values[0].toBigInt()), "base64url"),
		e: toString$2(bnToBuf(values[1].toBigInt()), "base64url")
	};
}
/**
* Convert a JWK key to PKIX in ASN1 DER format
*/
function jwkToPkix(jwk) {
	if (jwk.n == null || jwk.e == null) throw new InvalidParametersError("JWK was missing components");
	const der = new Sequence({ value: [new Sequence({ value: [new ObjectIdentifier({ value: "1.2.840.113549.1.1.1" }), new Null()] }), new BitString({ valueHex: new Sequence({ value: [Integer.fromBigInt(bufToBn(fromString(jwk.n, "base64url"))), Integer.fromBigInt(bufToBn(fromString(jwk.e, "base64url")))] }).toBER() })] }).toBER();
	return new Uint8Array(der, 0, der.byteLength);
}
function bnToBuf(bn) {
	let hex = bn.toString(16);
	if (hex.length % 2 > 0) hex = `0${hex}`;
	const len = hex.length / 2;
	const u8 = new Uint8Array(len);
	let i = 0;
	let j = 0;
	while (i < len) {
		u8[i] = parseInt(hex.slice(j, j + 2), 16);
		i += 1;
		j += 2;
	}
	return u8;
}
function bufToBn(u8) {
	const hex = [];
	u8.forEach(function(i) {
		let h = i.toString(16);
		if (h.length % 2 > 0) h = `0${h}`;
		hex.push(h);
	});
	return BigInt("0x" + hex.join(""));
}
/**
* Turn PKIX bytes to a PublicKey
*/
function pkixToRSAPublicKey(bytes) {
	const jwk = pkixToJwk(bytes);
	if (rsaKeySize(jwk) > 8192) throw new InvalidPublicKeyError("Key size is too large");
	const hash = sha256(PublicKey.encode({
		Type: KeyType.RSA,
		Data: bytes
	}));
	return new RSAPublicKey(jwk, create(SHA2_256_CODE, hash));
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@noble/hashes/esm/hmac.js
var HMAC = class extends Hash {
	constructor(hash$1, _key) {
		super();
		this.finished = false;
		this.destroyed = false;
		hash(hash$1);
		const key = toBytes$1(_key);
		this.iHash = hash$1.create();
		if (typeof this.iHash.update !== "function") throw new Error("Expected instance of class which extends utils.Hash");
		this.blockLen = this.iHash.blockLen;
		this.outputLen = this.iHash.outputLen;
		const blockLen = this.blockLen;
		const pad = new Uint8Array(blockLen);
		pad.set(key.length > blockLen ? hash$1.create().update(key).digest() : key);
		for (let i = 0; i < pad.length; i++) pad[i] ^= 54;
		this.iHash.update(pad);
		this.oHash = hash$1.create();
		for (let i = 0; i < pad.length; i++) pad[i] ^= 106;
		this.oHash.update(pad);
		pad.fill(0);
	}
	update(buf) {
		exists(this);
		this.iHash.update(buf);
		return this;
	}
	digestInto(out) {
		exists(this);
		bytes(out, this.outputLen);
		this.finished = true;
		this.iHash.digestInto(out);
		this.oHash.update(out);
		this.oHash.digestInto(out);
		this.destroy();
	}
	digest() {
		const out = new Uint8Array(this.oHash.outputLen);
		this.digestInto(out);
		return out;
	}
	_cloneInto(to) {
		to || (to = Object.create(Object.getPrototypeOf(this), {}));
		const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
		to = to;
		to.finished = finished;
		to.destroyed = destroyed;
		to.blockLen = blockLen;
		to.outputLen = outputLen;
		to.oHash = oHash._cloneInto(to.oHash);
		to.iHash = iHash._cloneInto(to.iHash);
		return to;
	}
	destroy() {
		this.destroyed = true;
		this.oHash.destroy();
		this.iHash.destroy();
	}
};
/**
* HMAC: RFC2104 message authentication code.
* @param hash - function that would be used e.g. sha256
* @param key - message key
* @param message - message data
* @example
* import { hmac } from '@noble/hashes/hmac';
* import { sha256 } from '@noble/hashes/sha2';
* const mac1 = hmac(sha256, 'key', 'message');
*/
var hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
hmac.create = (hash, key) => new HMAC(hash, key);
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@noble/curves/esm/abstract/weierstrass.js
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function validateSigVerOpts(opts) {
	if (opts.lowS !== void 0) abool("lowS", opts.lowS);
	if (opts.prehash !== void 0) abool("prehash", opts.prehash);
}
function validatePointOpts(curve) {
	const opts = validateBasic(curve);
	validateObject(opts, {
		a: "field",
		b: "field"
	}, {
		allowedPrivateKeyLengths: "array",
		wrapPrivateKey: "boolean",
		isTorsionFree: "function",
		clearCofactor: "function",
		allowInfinityPoint: "boolean",
		fromBytes: "function",
		toBytes: "function"
	});
	const { endo, Fp, a } = opts;
	if (endo) {
		if (!Fp.eql(a, Fp.ZERO)) throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
		if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") throw new Error("Expected endomorphism with beta: bigint and splitScalar: function");
	}
	return Object.freeze({ ...opts });
}
var { bytesToNumberBE: b2n, hexToBytes: h2b } = utils_exports;
/**
* ASN.1 DER encoding utilities. ASN is very complex & fragile. Format:
*
*     [0x30 (SEQUENCE), bytelength, 0x02 (INTEGER), intLength, R, 0x02 (INTEGER), intLength, S]
*
* Docs: https://letsencrypt.org/docs/a-warm-welcome-to-asn1-and-der/, https://luca.ntop.org/Teaching/Appunti/asn1.html
*/
var DER = {
	Err: class DERErr extends Error {
		constructor(m = "") {
			super(m);
		}
	},
	_tlv: {
		encode: (tag, data) => {
			const { Err: E } = DER;
			if (tag < 0 || tag > 256) throw new E("tlv.encode: wrong tag");
			if (data.length & 1) throw new E("tlv.encode: unpadded data");
			const dataLen = data.length / 2;
			const len = numberToHexUnpadded(dataLen);
			if (len.length / 2 & 128) throw new E("tlv.encode: long form length too big");
			const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
			return `${numberToHexUnpadded(tag)}${lenLen}${len}${data}`;
		},
		decode(tag, data) {
			const { Err: E } = DER;
			let pos = 0;
			if (tag < 0 || tag > 256) throw new E("tlv.encode: wrong tag");
			if (data.length < 2 || data[pos++] !== tag) throw new E("tlv.decode: wrong tlv");
			const first = data[pos++];
			const isLong = !!(first & 128);
			let length = 0;
			if (!isLong) length = first;
			else {
				const lenLen = first & 127;
				if (!lenLen) throw new E("tlv.decode(long): indefinite length not supported");
				if (lenLen > 4) throw new E("tlv.decode(long): byte length is too big");
				const lengthBytes = data.subarray(pos, pos + lenLen);
				if (lengthBytes.length !== lenLen) throw new E("tlv.decode: length bytes not complete");
				if (lengthBytes[0] === 0) throw new E("tlv.decode(long): zero leftmost byte");
				for (const b of lengthBytes) length = length << 8 | b;
				pos += lenLen;
				if (length < 128) throw new E("tlv.decode(long): not minimal encoding");
			}
			const v = data.subarray(pos, pos + length);
			if (v.length !== length) throw new E("tlv.decode: wrong value length");
			return {
				v,
				l: data.subarray(pos + length)
			};
		}
	},
	_int: {
		encode(num) {
			const { Err: E } = DER;
			if (num < _0n) throw new E("integer: negative integers are not allowed");
			let hex = numberToHexUnpadded(num);
			if (Number.parseInt(hex[0], 16) & 8) hex = "00" + hex;
			if (hex.length & 1) throw new E("unexpected assertion");
			return hex;
		},
		decode(data) {
			const { Err: E } = DER;
			if (data[0] & 128) throw new E("Invalid signature integer: negative");
			if (data[0] === 0 && !(data[1] & 128)) throw new E("Invalid signature integer: unnecessary leading zero");
			return b2n(data);
		}
	},
	toSig(hex) {
		const { Err: E, _int: int, _tlv: tlv } = DER;
		const data = typeof hex === "string" ? h2b(hex) : hex;
		abytes(data);
		const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
		if (seqLeftBytes.length) throw new E("Invalid signature: left bytes after parsing");
		const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
		const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
		if (sLeftBytes.length) throw new E("Invalid signature: left bytes after parsing");
		return {
			r: int.decode(rBytes),
			s: int.decode(sBytes)
		};
	},
	hexFromSig(sig) {
		const { _tlv: tlv, _int: int } = DER;
		const seq = `${tlv.encode(2, int.encode(sig.r))}${tlv.encode(2, int.encode(sig.s))}`;
		return tlv.encode(48, seq);
	}
};
var _0n = BigInt(0);
var _1n$1 = BigInt(1);
var _3n = BigInt(3);
function weierstrassPoints(opts) {
	const CURVE = validatePointOpts(opts);
	const { Fp } = CURVE;
	const Fn = Field(CURVE.n, CURVE.nBitLength);
	const toBytes = CURVE.toBytes || ((_c, point, _isCompressed) => {
		const a = point.toAffine();
		return concatBytes(Uint8Array.from([4]), Fp.toBytes(a.x), Fp.toBytes(a.y));
	});
	const fromBytes = CURVE.fromBytes || ((bytes) => {
		const tail = bytes.subarray(1);
		return {
			x: Fp.fromBytes(tail.subarray(0, Fp.BYTES)),
			y: Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES))
		};
	});
	/**
	* y² = x³ + ax + b: Short weierstrass curve formula
	* @returns y²
	*/
	function weierstrassEquation(x) {
		const { a, b } = CURVE;
		const x2 = Fp.sqr(x);
		const x3 = Fp.mul(x2, x);
		return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
	}
	if (!Fp.eql(Fp.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx))) throw new Error("bad generator point: equation left != right");
	function isWithinCurveOrder(num) {
		return inRange(num, _1n$1, CURVE.n);
	}
	function normPrivateKeyToScalar(key) {
		const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n: N } = CURVE;
		if (lengths && typeof key !== "bigint") {
			if (isBytes(key)) key = bytesToHex(key);
			if (typeof key !== "string" || !lengths.includes(key.length)) throw new Error("Invalid key");
			key = key.padStart(nByteLength * 2, "0");
		}
		let num;
		try {
			num = typeof key === "bigint" ? key : bytesToNumberBE(ensureBytes("private key", key, nByteLength));
		} catch (error) {
			throw new Error(`private key must be ${nByteLength} bytes, hex or bigint, not ${typeof key}`);
		}
		if (wrapPrivateKey) num = mod(num, N);
		aInRange("private key", num, _1n$1, N);
		return num;
	}
	function assertPrjPoint(other) {
		if (!(other instanceof Point)) throw new Error("ProjectivePoint expected");
	}
	const toAffineMemo = memoized((p, iz) => {
		const { px: x, py: y, pz: z } = p;
		if (Fp.eql(z, Fp.ONE)) return {
			x,
			y
		};
		const is0 = p.is0();
		if (iz == null) iz = is0 ? Fp.ONE : Fp.inv(z);
		const ax = Fp.mul(x, iz);
		const ay = Fp.mul(y, iz);
		const zz = Fp.mul(z, iz);
		if (is0) return {
			x: Fp.ZERO,
			y: Fp.ZERO
		};
		if (!Fp.eql(zz, Fp.ONE)) throw new Error("invZ was invalid");
		return {
			x: ax,
			y: ay
		};
	});
	const assertValidMemo = memoized((p) => {
		if (p.is0()) {
			if (CURVE.allowInfinityPoint && !Fp.is0(p.py)) return;
			throw new Error("bad point: ZERO");
		}
		const { x, y } = p.toAffine();
		if (!Fp.isValid(x) || !Fp.isValid(y)) throw new Error("bad point: x or y not FE");
		const left = Fp.sqr(y);
		const right = weierstrassEquation(x);
		if (!Fp.eql(left, right)) throw new Error("bad point: equation left != right");
		if (!p.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
		return true;
	});
	/**
	* Projective Point works in 3d / projective (homogeneous) coordinates: (x, y, z) ∋ (x=x/z, y=y/z)
	* Default Point works in 2d / affine coordinates: (x, y)
	* We're doing calculations in projective, because its operations don't require costly inversion.
	*/
	class Point {
		constructor(px, py, pz) {
			this.px = px;
			this.py = py;
			this.pz = pz;
			if (px == null || !Fp.isValid(px)) throw new Error("x required");
			if (py == null || !Fp.isValid(py)) throw new Error("y required");
			if (pz == null || !Fp.isValid(pz)) throw new Error("z required");
			Object.freeze(this);
		}
		static fromAffine(p) {
			const { x, y } = p || {};
			if (!p || !Fp.isValid(x) || !Fp.isValid(y)) throw new Error("invalid affine point");
			if (p instanceof Point) throw new Error("projective point not allowed");
			const is0 = (i) => Fp.eql(i, Fp.ZERO);
			if (is0(x) && is0(y)) return Point.ZERO;
			return new Point(x, y, Fp.ONE);
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		/**
		* Takes a bunch of Projective Points but executes only one
		* inversion on all of them. Inversion is very slow operation,
		* so this improves performance massively.
		* Optimization: converts a list of projective points to a list of identical points with Z=1.
		*/
		static normalizeZ(points) {
			const toInv = Fp.invertBatch(points.map((p) => p.pz));
			return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
		}
		/**
		* Converts hash string or Uint8Array to Point.
		* @param hex short/long ECDSA hex
		*/
		static fromHex(hex) {
			const P = Point.fromAffine(fromBytes(ensureBytes("pointHex", hex)));
			P.assertValidity();
			return P;
		}
		static fromPrivateKey(privateKey) {
			return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
		}
		static msm(points, scalars) {
			return pippenger(Point, Fn, points, scalars);
		}
		_setWindowSize(windowSize) {
			wnaf.setWindowSize(this, windowSize);
		}
		assertValidity() {
			assertValidMemo(this);
		}
		hasEvenY() {
			const { y } = this.toAffine();
			if (Fp.isOdd) return !Fp.isOdd(y);
			throw new Error("Field doesn't support isOdd");
		}
		/**
		* Compare one point to another.
		*/
		equals(other) {
			assertPrjPoint(other);
			const { px: X1, py: Y1, pz: Z1 } = this;
			const { px: X2, py: Y2, pz: Z2 } = other;
			const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
			const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
			return U1 && U2;
		}
		/**
		* Flips point to one corresponding to (x, -y) in Affine coordinates.
		*/
		negate() {
			return new Point(this.px, Fp.neg(this.py), this.pz);
		}
		double() {
			const { a, b } = CURVE;
			const b3 = Fp.mul(b, _3n);
			const { px: X1, py: Y1, pz: Z1 } = this;
			let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
			let t0 = Fp.mul(X1, X1);
			let t1 = Fp.mul(Y1, Y1);
			let t2 = Fp.mul(Z1, Z1);
			let t3 = Fp.mul(X1, Y1);
			t3 = Fp.add(t3, t3);
			Z3 = Fp.mul(X1, Z1);
			Z3 = Fp.add(Z3, Z3);
			X3 = Fp.mul(a, Z3);
			Y3 = Fp.mul(b3, t2);
			Y3 = Fp.add(X3, Y3);
			X3 = Fp.sub(t1, Y3);
			Y3 = Fp.add(t1, Y3);
			Y3 = Fp.mul(X3, Y3);
			X3 = Fp.mul(t3, X3);
			Z3 = Fp.mul(b3, Z3);
			t2 = Fp.mul(a, t2);
			t3 = Fp.sub(t0, t2);
			t3 = Fp.mul(a, t3);
			t3 = Fp.add(t3, Z3);
			Z3 = Fp.add(t0, t0);
			t0 = Fp.add(Z3, t0);
			t0 = Fp.add(t0, t2);
			t0 = Fp.mul(t0, t3);
			Y3 = Fp.add(Y3, t0);
			t2 = Fp.mul(Y1, Z1);
			t2 = Fp.add(t2, t2);
			t0 = Fp.mul(t2, t3);
			X3 = Fp.sub(X3, t0);
			Z3 = Fp.mul(t2, t1);
			Z3 = Fp.add(Z3, Z3);
			Z3 = Fp.add(Z3, Z3);
			return new Point(X3, Y3, Z3);
		}
		add(other) {
			assertPrjPoint(other);
			const { px: X1, py: Y1, pz: Z1 } = this;
			const { px: X2, py: Y2, pz: Z2 } = other;
			let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
			const a = CURVE.a;
			const b3 = Fp.mul(CURVE.b, _3n);
			let t0 = Fp.mul(X1, X2);
			let t1 = Fp.mul(Y1, Y2);
			let t2 = Fp.mul(Z1, Z2);
			let t3 = Fp.add(X1, Y1);
			let t4 = Fp.add(X2, Y2);
			t3 = Fp.mul(t3, t4);
			t4 = Fp.add(t0, t1);
			t3 = Fp.sub(t3, t4);
			t4 = Fp.add(X1, Z1);
			let t5 = Fp.add(X2, Z2);
			t4 = Fp.mul(t4, t5);
			t5 = Fp.add(t0, t2);
			t4 = Fp.sub(t4, t5);
			t5 = Fp.add(Y1, Z1);
			X3 = Fp.add(Y2, Z2);
			t5 = Fp.mul(t5, X3);
			X3 = Fp.add(t1, t2);
			t5 = Fp.sub(t5, X3);
			Z3 = Fp.mul(a, t4);
			X3 = Fp.mul(b3, t2);
			Z3 = Fp.add(X3, Z3);
			X3 = Fp.sub(t1, Z3);
			Z3 = Fp.add(t1, Z3);
			Y3 = Fp.mul(X3, Z3);
			t1 = Fp.add(t0, t0);
			t1 = Fp.add(t1, t0);
			t2 = Fp.mul(a, t2);
			t4 = Fp.mul(b3, t4);
			t1 = Fp.add(t1, t2);
			t2 = Fp.sub(t0, t2);
			t2 = Fp.mul(a, t2);
			t4 = Fp.add(t4, t2);
			t0 = Fp.mul(t1, t4);
			Y3 = Fp.add(Y3, t0);
			t0 = Fp.mul(t5, t4);
			X3 = Fp.mul(t3, X3);
			X3 = Fp.sub(X3, t0);
			t0 = Fp.mul(t3, t1);
			Z3 = Fp.mul(t5, Z3);
			Z3 = Fp.add(Z3, t0);
			return new Point(X3, Y3, Z3);
		}
		subtract(other) {
			return this.add(other.negate());
		}
		is0() {
			return this.equals(Point.ZERO);
		}
		wNAF(n) {
			return wnaf.wNAFCached(this, n, Point.normalizeZ);
		}
		/**
		* Non-constant-time multiplication. Uses double-and-add algorithm.
		* It's faster, but should only be used when you don't care about
		* an exposed private key e.g. sig verification, which works over *public* keys.
		*/
		multiplyUnsafe(sc) {
			aInRange("scalar", sc, _0n, CURVE.n);
			const I = Point.ZERO;
			if (sc === _0n) return I;
			if (sc === _1n$1) return this;
			const { endo } = CURVE;
			if (!endo) return wnaf.unsafeLadder(this, sc);
			let { k1neg, k1, k2neg, k2 } = endo.splitScalar(sc);
			let k1p = I;
			let k2p = I;
			let d = this;
			while (k1 > _0n || k2 > _0n) {
				if (k1 & _1n$1) k1p = k1p.add(d);
				if (k2 & _1n$1) k2p = k2p.add(d);
				d = d.double();
				k1 >>= _1n$1;
				k2 >>= _1n$1;
			}
			if (k1neg) k1p = k1p.negate();
			if (k2neg) k2p = k2p.negate();
			k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
			return k1p.add(k2p);
		}
		/**
		* Constant time multiplication.
		* Uses wNAF method. Windowed method may be 10% faster,
		* but takes 2x longer to generate and consumes 2x memory.
		* Uses precomputes when available.
		* Uses endomorphism for Koblitz curves.
		* @param scalar by which the point would be multiplied
		* @returns New point
		*/
		multiply(scalar) {
			const { endo, n: N } = CURVE;
			aInRange("scalar", scalar, _1n$1, N);
			let point, fake;
			if (endo) {
				const { k1neg, k1, k2neg, k2 } = endo.splitScalar(scalar);
				let { p: k1p, f: f1p } = this.wNAF(k1);
				let { p: k2p, f: f2p } = this.wNAF(k2);
				k1p = wnaf.constTimeNegate(k1neg, k1p);
				k2p = wnaf.constTimeNegate(k2neg, k2p);
				k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
				point = k1p.add(k2p);
				fake = f1p.add(f2p);
			} else {
				const { p, f } = this.wNAF(scalar);
				point = p;
				fake = f;
			}
			return Point.normalizeZ([point, fake])[0];
		}
		/**
		* Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
		* Not using Strauss-Shamir trick: precomputation tables are faster.
		* The trick could be useful if both P and Q are not G (not in our case).
		* @returns non-zero affine point
		*/
		multiplyAndAddUnsafe(Q, a, b) {
			const G = Point.BASE;
			const mul = (P, a) => a === _0n || a === _1n$1 || !P.equals(G) ? P.multiplyUnsafe(a) : P.multiply(a);
			const sum = mul(this, a).add(mul(Q, b));
			return sum.is0() ? void 0 : sum;
		}
		toAffine(iz) {
			return toAffineMemo(this, iz);
		}
		isTorsionFree() {
			const { h: cofactor, isTorsionFree } = CURVE;
			if (cofactor === _1n$1) return true;
			if (isTorsionFree) return isTorsionFree(Point, this);
			throw new Error("isTorsionFree() has not been declared for the elliptic curve");
		}
		clearCofactor() {
			const { h: cofactor, clearCofactor } = CURVE;
			if (cofactor === _1n$1) return this;
			if (clearCofactor) return clearCofactor(Point, this);
			return this.multiplyUnsafe(CURVE.h);
		}
		toRawBytes(isCompressed = true) {
			abool("isCompressed", isCompressed);
			this.assertValidity();
			return toBytes(Point, this, isCompressed);
		}
		toHex(isCompressed = true) {
			abool("isCompressed", isCompressed);
			return bytesToHex(this.toRawBytes(isCompressed));
		}
	}
	Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
	Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
	const _bits = CURVE.nBitLength;
	const wnaf = wNAF(Point, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
	return {
		CURVE,
		ProjectivePoint: Point,
		normPrivateKeyToScalar,
		weierstrassEquation,
		isWithinCurveOrder
	};
}
function validateOpts(curve) {
	const opts = validateBasic(curve);
	validateObject(opts, {
		hash: "hash",
		hmac: "function",
		randomBytes: "function"
	}, {
		bits2int: "function",
		bits2int_modN: "function",
		lowS: "boolean"
	});
	return Object.freeze({
		lowS: true,
		...opts
	});
}
/**
* Creates short weierstrass curve and ECDSA signature methods for it.
* @example
* import { Field } from '@noble/curves/abstract/modular';
* // Before that, define BigInt-s: a, b, p, n, Gx, Gy
* const curve = weierstrass({ a, b, Fp: Field(p), n, Gx, Gy, h: 1n })
*/
function weierstrass(curveDef) {
	const CURVE = validateOpts(curveDef);
	const { Fp, n: CURVE_ORDER } = CURVE;
	const compressedLen = Fp.BYTES + 1;
	const uncompressedLen = 2 * Fp.BYTES + 1;
	function modN(a) {
		return mod(a, CURVE_ORDER);
	}
	function invN(a) {
		return invert(a, CURVE_ORDER);
	}
	const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
		...CURVE,
		toBytes(_c, point, isCompressed) {
			const a = point.toAffine();
			const x = Fp.toBytes(a.x);
			const cat = concatBytes;
			abool("isCompressed", isCompressed);
			if (isCompressed) return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
			else return cat(Uint8Array.from([4]), x, Fp.toBytes(a.y));
		},
		fromBytes(bytes) {
			const len = bytes.length;
			const head = bytes[0];
			const tail = bytes.subarray(1);
			if (len === compressedLen && (head === 2 || head === 3)) {
				const x = bytesToNumberBE(tail);
				if (!inRange(x, _1n$1, Fp.ORDER)) throw new Error("Point is not on curve");
				const y2 = weierstrassEquation(x);
				let y;
				try {
					y = Fp.sqrt(y2);
				} catch (sqrtError) {
					const suffix = sqrtError instanceof Error ? ": " + sqrtError.message : "";
					throw new Error("Point is not on curve" + suffix);
				}
				const isYOdd = (y & _1n$1) === _1n$1;
				if ((head & 1) === 1 !== isYOdd) y = Fp.neg(y);
				return {
					x,
					y
				};
			} else if (len === uncompressedLen && head === 4) return {
				x: Fp.fromBytes(tail.subarray(0, Fp.BYTES)),
				y: Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES))
			};
			else throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
		}
	});
	const numToNByteStr = (num) => bytesToHex(numberToBytesBE(num, CURVE.nByteLength));
	function isBiggerThanHalfOrder(number) {
		return number > CURVE_ORDER >> _1n$1;
	}
	function normalizeS(s) {
		return isBiggerThanHalfOrder(s) ? modN(-s) : s;
	}
	const slcNum = (b, from, to) => bytesToNumberBE(b.slice(from, to));
	/**
	* ECDSA signature with its (r, s) properties. Supports DER & compact representations.
	*/
	class Signature {
		constructor(r, s, recovery) {
			this.r = r;
			this.s = s;
			this.recovery = recovery;
			this.assertValidity();
		}
		static fromCompact(hex) {
			const l = CURVE.nByteLength;
			hex = ensureBytes("compactSignature", hex, l * 2);
			return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
		}
		static fromDER(hex) {
			const { r, s } = DER.toSig(ensureBytes("DER", hex));
			return new Signature(r, s);
		}
		assertValidity() {
			aInRange("r", this.r, _1n$1, CURVE_ORDER);
			aInRange("s", this.s, _1n$1, CURVE_ORDER);
		}
		addRecoveryBit(recovery) {
			return new Signature(this.r, this.s, recovery);
		}
		recoverPublicKey(msgHash) {
			const { r, s, recovery: rec } = this;
			const h = bits2int_modN(ensureBytes("msgHash", msgHash));
			if (rec == null || ![
				0,
				1,
				2,
				3
			].includes(rec)) throw new Error("recovery id invalid");
			const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
			if (radj >= Fp.ORDER) throw new Error("recovery id 2 or 3 invalid");
			const prefix = (rec & 1) === 0 ? "02" : "03";
			const R = Point.fromHex(prefix + numToNByteStr(radj));
			const ir = invN(radj);
			const u1 = modN(-h * ir);
			const u2 = modN(s * ir);
			const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
			if (!Q) throw new Error("point at infinify");
			Q.assertValidity();
			return Q;
		}
		hasHighS() {
			return isBiggerThanHalfOrder(this.s);
		}
		normalizeS() {
			return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
		}
		toDERRawBytes() {
			return hexToBytes(this.toDERHex());
		}
		toDERHex() {
			return DER.hexFromSig({
				r: this.r,
				s: this.s
			});
		}
		toCompactRawBytes() {
			return hexToBytes(this.toCompactHex());
		}
		toCompactHex() {
			return numToNByteStr(this.r) + numToNByteStr(this.s);
		}
	}
	const utils = {
		isValidPrivateKey(privateKey) {
			try {
				normPrivateKeyToScalar(privateKey);
				return true;
			} catch (error) {
				return false;
			}
		},
		normPrivateKeyToScalar,
		/**
		* Produces cryptographically secure private key from random of size
		* (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
		*/
		randomPrivateKey: () => {
			const length = getMinHashLength(CURVE.n);
			return mapHashToField(CURVE.randomBytes(length), CURVE.n);
		},
		/**
		* Creates precompute table for an arbitrary EC point. Makes point "cached".
		* Allows to massively speed-up `point.multiply(scalar)`.
		* @returns cached point
		* @example
		* const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
		* fast.multiply(privKey); // much faster ECDH now
		*/
		precompute(windowSize = 8, point = Point.BASE) {
			point._setWindowSize(windowSize);
			point.multiply(BigInt(3));
			return point;
		}
	};
	/**
	* Computes public key for a private key. Checks for validity of the private key.
	* @param privateKey private key
	* @param isCompressed whether to return compact (default), or full key
	* @returns Public key, full when isCompressed=false; short when isCompressed=true
	*/
	function getPublicKey(privateKey, isCompressed = true) {
		return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
	}
	/**
	* Quick and dirty check for item being public key. Does not validate hex, or being on-curve.
	*/
	function isProbPub(item) {
		const arr = isBytes(item);
		const str = typeof item === "string";
		const len = (arr || str) && item.length;
		if (arr) return len === compressedLen || len === uncompressedLen;
		if (str) return len === 2 * compressedLen || len === 2 * uncompressedLen;
		if (item instanceof Point) return true;
		return false;
	}
	/**
	* ECDH (Elliptic Curve Diffie Hellman).
	* Computes shared public key from private key and public key.
	* Checks: 1) private key validity 2) shared key is on-curve.
	* Does NOT hash the result.
	* @param privateA private key
	* @param publicB different public key
	* @param isCompressed whether to return compact (default), or full key
	* @returns shared public key
	*/
	function getSharedSecret(privateA, publicB, isCompressed = true) {
		if (isProbPub(privateA)) throw new Error("first arg must be private key");
		if (!isProbPub(publicB)) throw new Error("second arg must be public key");
		return Point.fromHex(publicB).multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
	}
	const bits2int = CURVE.bits2int || function(bytes) {
		const num = bytesToNumberBE(bytes);
		const delta = bytes.length * 8 - CURVE.nBitLength;
		return delta > 0 ? num >> BigInt(delta) : num;
	};
	const bits2int_modN = CURVE.bits2int_modN || function(bytes) {
		return modN(bits2int(bytes));
	};
	const ORDER_MASK = bitMask(CURVE.nBitLength);
	/**
	* Converts to bytes. Checks if num in `[0..ORDER_MASK-1]` e.g.: `[0..2^256-1]`.
	*/
	function int2octets(num) {
		aInRange(`num < 2^${CURVE.nBitLength}`, num, _0n, ORDER_MASK);
		return numberToBytesBE(num, CURVE.nByteLength);
	}
	function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
		if (["recovered", "canonical"].some((k) => k in opts)) throw new Error("sign() legacy options not supported");
		const { hash, randomBytes } = CURVE;
		let { lowS, prehash, extraEntropy: ent } = opts;
		if (lowS == null) lowS = true;
		msgHash = ensureBytes("msgHash", msgHash);
		validateSigVerOpts(opts);
		if (prehash) msgHash = ensureBytes("prehashed msgHash", hash(msgHash));
		const h1int = bits2int_modN(msgHash);
		const d = normPrivateKeyToScalar(privateKey);
		const seedArgs = [int2octets(d), int2octets(h1int)];
		if (ent != null && ent !== false) {
			const e = ent === true ? randomBytes(Fp.BYTES) : ent;
			seedArgs.push(ensureBytes("extraEntropy", e));
		}
		const seed = concatBytes(...seedArgs);
		const m = h1int;
		function k2sig(kBytes) {
			const k = bits2int(kBytes);
			if (!isWithinCurveOrder(k)) return;
			const ik = invN(k);
			const q = Point.BASE.multiply(k).toAffine();
			const r = modN(q.x);
			if (r === _0n) return;
			const s = modN(ik * modN(m + r * d));
			if (s === _0n) return;
			let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n$1);
			let normS = s;
			if (lowS && isBiggerThanHalfOrder(s)) {
				normS = normalizeS(s);
				recovery ^= 1;
			}
			return new Signature(r, normS, recovery);
		}
		return {
			seed,
			k2sig
		};
	}
	const defaultSigOpts = {
		lowS: CURVE.lowS,
		prehash: false
	};
	const defaultVerOpts = {
		lowS: CURVE.lowS,
		prehash: false
	};
	/**
	* Signs message hash with a private key.
	* ```
	* sign(m, d, k) where
	*   (x, y) = G × k
	*   r = x mod n
	*   s = (m + dr)/k mod n
	* ```
	* @param msgHash NOT message. msg needs to be hashed to `msgHash`, or use `prehash`.
	* @param privKey private key
	* @param opts lowS for non-malleable sigs. extraEntropy for mixing randomness into k. prehash will hash first arg.
	* @returns signature with recovery param
	*/
	function sign(msgHash, privKey, opts = defaultSigOpts) {
		const { seed, k2sig } = prepSig(msgHash, privKey, opts);
		const C = CURVE;
		return createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac)(seed, k2sig);
	}
	Point.BASE._setWindowSize(8);
	/**
	* Verifies a signature against message hash and public key.
	* Rejects lowS signatures by default: to override,
	* specify option `{lowS: false}`. Implements section 4.1.4 from https://www.secg.org/sec1-v2.pdf:
	*
	* ```
	* verify(r, s, h, P) where
	*   U1 = hs^-1 mod n
	*   U2 = rs^-1 mod n
	*   R = U1⋅G - U2⋅P
	*   mod(R.x, n) == r
	* ```
	*/
	function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
		const sg = signature;
		msgHash = ensureBytes("msgHash", msgHash);
		publicKey = ensureBytes("publicKey", publicKey);
		if ("strict" in opts) throw new Error("options.strict was renamed to lowS");
		validateSigVerOpts(opts);
		const { lowS, prehash } = opts;
		let _sig = void 0;
		let P;
		try {
			if (typeof sg === "string" || isBytes(sg)) try {
				_sig = Signature.fromDER(sg);
			} catch (derError) {
				if (!(derError instanceof DER.Err)) throw derError;
				_sig = Signature.fromCompact(sg);
			}
			else if (typeof sg === "object" && typeof sg.r === "bigint" && typeof sg.s === "bigint") {
				const { r, s } = sg;
				_sig = new Signature(r, s);
			} else throw new Error("PARSE");
			P = Point.fromHex(publicKey);
		} catch (error) {
			if (error.message === "PARSE") throw new Error(`signature must be Signature instance, Uint8Array or hex string`);
			return false;
		}
		if (lowS && _sig.hasHighS()) return false;
		if (prehash) msgHash = CURVE.hash(msgHash);
		const { r, s } = _sig;
		const h = bits2int_modN(msgHash);
		const is = invN(s);
		const u1 = modN(h * is);
		const u2 = modN(r * is);
		const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine();
		if (!R) return false;
		return modN(R.x) === r;
	}
	return {
		CURVE,
		getPublicKey,
		getSharedSecret,
		sign,
		verify,
		ProjectivePoint: Point,
		Signature,
		utils
	};
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@noble/curves/esm/_shortw_utils.js
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function getHash(hash) {
	return {
		hash,
		hmac: (key, ...msgs) => hmac(hash, key, concatBytes$1(...msgs)),
		randomBytes: randomBytes$1
	};
}
function createCurve(curveDef, defHash) {
	const create = (hash) => weierstrass({
		...curveDef,
		...getHash(hash)
	});
	return Object.freeze({
		...create(defHash),
		create
	});
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@noble/curves/esm/secp256k1.js
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
var secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
var _1n = BigInt(1);
var _2n = BigInt(2);
var divNearest = (a, b) => (a + b / _2n) / b;
/**
* √n = n^((p+1)/4) for fields p = 3 mod 4. We unwrap the loop and multiply bit-by-bit.
* (P+1n/4n).toString(2) would produce bits [223x 1, 0, 22x 1, 4x 0, 11, 00]
*/
function sqrtMod(y) {
	const P = secp256k1P;
	const _3n = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
	const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
	const b2 = y * y * y % P;
	const b3 = b2 * b2 * y % P;
	const b11 = pow2(pow2(pow2(b3, _3n, P) * b3 % P, _3n, P) * b3 % P, _2n, P) * b2 % P;
	const b22 = pow2(b11, _11n, P) * b11 % P;
	const b44 = pow2(b22, _22n, P) * b22 % P;
	const b88 = pow2(b44, _44n, P) * b44 % P;
	const root = pow2(pow2(pow2(pow2(pow2(pow2(b88, _88n, P) * b88 % P, _44n, P) * b44 % P, _3n, P) * b3 % P, _23n, P) * b22 % P, _6n, P) * b2 % P, _2n, P);
	if (!Fp.eql(Fp.sqr(root), y)) throw new Error("Cannot find square root");
	return root;
}
var Fp = Field(secp256k1P, void 0, void 0, { sqrt: sqrtMod });
/**
* secp256k1 short weierstrass curve and ECDSA signatures over it.
*/
var secp256k1 = createCurve({
	a: BigInt(0),
	b: BigInt(7),
	Fp,
	n: secp256k1N,
	Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
	Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
	h: BigInt(1),
	lowS: true,
	/**
	* secp256k1 belongs to Koblitz curves: it has efficiently computable endomorphism.
	* Endomorphism uses 2x less RAM, speeds up precomputation by 2x and ECDH / key recovery by 20%.
	* For precomputed wNAF it trades off 1/2 init time & 1/3 ram for 20% perf hit.
	* Explanation: https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066
	*/
	endo: {
		beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
		splitScalar: (k) => {
			const n = secp256k1N;
			const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
			const b1 = -_1n * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
			const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
			const b2 = a1;
			const POW_2_128 = BigInt("0x100000000000000000000000000000000");
			const c1 = divNearest(b2 * k, n);
			const c2 = divNearest(-b1 * k, n);
			let k1 = mod(k - c1 * a1 - c2 * a2, n);
			let k2 = mod(-c1 * b1 - c2 * b2, n);
			const k1neg = k1 > POW_2_128;
			const k2neg = k2 > POW_2_128;
			if (k1neg) k1 = n - k1;
			if (k2neg) k2 = n - k2;
			if (k1 > POW_2_128 || k2 > POW_2_128) throw new Error("splitScalar: Endomorphism failed, k=" + k);
			return {
				k1neg,
				k1,
				k2neg,
				k2
			};
		}
	}
}, sha256);
secp256k1.ProjectivePoint;
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/crypto/dist/src/util.js
function isPromise$2(thing) {
	if (thing == null) return false;
	return typeof thing.then === "function" && typeof thing.catch === "function" && typeof thing.finally === "function";
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/crypto/dist/src/keys/secp256k1/index.browser.js
/**
* Hash message and verify signature with public key
*/
function hashAndVerify(key, sig, msg) {
	const p = sha256$1.digest(msg instanceof Uint8Array ? msg : msg.subarray());
	if (isPromise$2(p)) return p.then(({ digest }) => secp256k1.verify(sig, digest, key)).catch((err) => {
		throw new VerificationError(String(err));
	});
	try {
		return secp256k1.verify(sig, p.digest, key);
	} catch (err) {
		throw new VerificationError(String(err));
	}
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/crypto/dist/src/keys/secp256k1/secp256k1.js
var Secp256k1PublicKey = class {
	type = "secp256k1";
	raw;
	_key;
	constructor(key) {
		this._key = validateSecp256k1PublicKey(key);
		this.raw = compressSecp256k1PublicKey(this._key);
	}
	toMultihash() {
		return identity.digest(publicKeyToProtobuf(this));
	}
	toCID() {
		return CID.createV1(114, this.toMultihash());
	}
	toString() {
		return base58btc.encode(this.toMultihash().bytes).substring(1);
	}
	equals(key) {
		if (key == null || !(key.raw instanceof Uint8Array)) return false;
		return equals(this.raw, key.raw);
	}
	verify(data, sig) {
		return hashAndVerify(this._key, sig, data);
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/crypto/dist/src/keys/secp256k1/utils.js
function unmarshalSecp256k1PublicKey(bytes) {
	return new Secp256k1PublicKey(bytes);
}
function compressSecp256k1PublicKey(key) {
	return secp256k1.ProjectivePoint.fromHex(key).toRawBytes(true);
}
function validateSecp256k1PublicKey(key) {
	try {
		secp256k1.ProjectivePoint.fromHex(key);
		return key;
	} catch (err) {
		throw new InvalidPublicKeyError(String(err));
	}
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/crypto/dist/src/keys/index.js
/**
* @packageDocumentation
*
* ## Supported Key Types
*
* Currently the `'RSA'`, `'ed25519'`, and `secp256k1` types are supported, although ed25519 and secp256k1 keys support only signing and verification of messages.
*
* For encryption / decryption support, RSA keys should be used.
*/
/**
* Converts a protobuf serialized public key into its representative object
*/
function publicKeyFromProtobuf(buf) {
	const { Type, Data } = PublicKey.decode(buf);
	const data = Data ?? /* @__PURE__ */ new Uint8Array();
	switch (Type) {
		case KeyType.RSA: return pkixToRSAPublicKey(data);
		case KeyType.Ed25519: return unmarshalEd25519PublicKey(data);
		case KeyType.secp256k1: return unmarshalSecp256k1PublicKey(data);
		default: throw new UnsupportedKeyTypeError();
	}
}
/**
* Creates a public key from an identity multihash which contains a protobuf
* encoded Ed25519 or secp256k1 public key.
*
* RSA keys are not supported as in practice we they are not stored in identity
* multihashes since the hash would be very large.
*/
function publicKeyFromMultihash(digest) {
	const { Type, Data } = PublicKey.decode(digest.digest);
	const data = Data ?? /* @__PURE__ */ new Uint8Array();
	switch (Type) {
		case KeyType.Ed25519: return unmarshalEd25519PublicKey(data);
		case KeyType.secp256k1: return unmarshalSecp256k1PublicKey(data);
		default: throw new UnsupportedKeyTypeError();
	}
}
/**
* Converts a public key object into a protobuf serialized public key
*/
function publicKeyToProtobuf(key) {
	return PublicKey.encode({
		Type: KeyType[key.type],
		Data: key.raw
	});
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/peer-id/dist/src/peer-id.js
/**
* @packageDocumentation
*
* An implementation of a peer id
*
* @example
*
* ```TypeScript
* import { peerIdFromString } from '@libp2p/peer-id'
* const peer = peerIdFromString('k51qzi5uqu5dkwkqm42v9j9kqcam2jiuvloi16g72i4i4amoo2m8u3ol3mqu6s')
*
* console.log(peer.toCID()) // CID(bafzaa...)
* console.log(peer.toString()) // "12D3K..."
* ```
*/
var inspect$1 = Symbol.for("nodejs.util.inspect.custom");
var LIBP2P_KEY_CODE$1 = 114;
var PeerIdImpl = class {
	type;
	multihash;
	publicKey;
	string;
	constructor(init) {
		this.type = init.type;
		this.multihash = init.multihash;
		Object.defineProperty(this, "string", {
			enumerable: false,
			writable: true
		});
	}
	get [Symbol.toStringTag]() {
		return `PeerId(${this.toString()})`;
	}
	[peerIdSymbol] = true;
	toString() {
		if (this.string == null) this.string = base58btc.encode(this.multihash.bytes).slice(1);
		return this.string;
	}
	toMultihash() {
		return this.multihash;
	}
	toCID() {
		return CID.createV1(LIBP2P_KEY_CODE$1, this.multihash);
	}
	toJSON() {
		return this.toString();
	}
	/**
	* Checks the equality of `this` peer against a given PeerId
	*/
	equals(id) {
		if (id == null) return false;
		if (id instanceof Uint8Array) return equals(this.multihash.bytes, id);
		else if (typeof id === "string") return this.toString() === id;
		else if (id?.toMultihash()?.bytes != null) return equals(this.multihash.bytes, id.toMultihash().bytes);
		else throw new Error("not valid Id");
	}
	/**
	* Returns PeerId as a human-readable string
	* https://nodejs.org/api/util.html#utilinspectcustom
	*
	* @example
	* ```TypeScript
	* import { peerIdFromString } from '@libp2p/peer-id'
	*
	* console.info(peerIdFromString('QmFoo'))
	* // 'PeerId(QmFoo)'
	* ```
	*/
	[inspect$1]() {
		return `PeerId(${this.toString()})`;
	}
};
var RSAPeerId = class extends PeerIdImpl {
	type = "RSA";
	publicKey;
	constructor(init) {
		super({
			...init,
			type: "RSA"
		});
		this.publicKey = init.publicKey;
	}
};
var Ed25519PeerId = class extends PeerIdImpl {
	type = "Ed25519";
	publicKey;
	constructor(init) {
		super({
			...init,
			type: "Ed25519"
		});
		this.publicKey = init.publicKey;
	}
};
var Secp256k1PeerId = class extends PeerIdImpl {
	type = "secp256k1";
	publicKey;
	constructor(init) {
		super({
			...init,
			type: "secp256k1"
		});
		this.publicKey = init.publicKey;
	}
};
var TRANSPORT_IPFS_GATEWAY_HTTP_CODE$2 = 2336;
var URLPeerId = class {
	type = "url";
	multihash;
	publicKey;
	url;
	constructor(url) {
		this.url = url.toString();
		this.multihash = identity.digest(fromString(this.url));
	}
	[inspect$1]() {
		return `PeerId(${this.url})`;
	}
	[peerIdSymbol] = true;
	toString() {
		return this.toCID().toString();
	}
	toMultihash() {
		return this.multihash;
	}
	toCID() {
		return CID.createV1(TRANSPORT_IPFS_GATEWAY_HTTP_CODE$2, this.toMultihash());
	}
	toJSON() {
		return this.toString();
	}
	equals(other) {
		if (other == null) return false;
		if (other instanceof Uint8Array) other = toString$2(other);
		return other.toString() === this.toString();
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/peer-id/dist/src/index.js
/**
* @packageDocumentation
*
* An implementation of a peer id
*
* @example
*
* ```TypeScript
* import { peerIdFromString } from '@libp2p/peer-id'
* const peer = peerIdFromString('k51qzi5uqu5dkwkqm42v9j9kqcam2jiuvloi16g72i4i4amoo2m8u3ol3mqu6s')
*
* console.log(peer.toCID()) // CID(bafzaa...)
* console.log(peer.toString()) // "12D3K..."
* ```
*/
var LIBP2P_KEY_CODE = 114;
var TRANSPORT_IPFS_GATEWAY_HTTP_CODE$1 = 2336;
function peerIdFromString(str, decoder) {
	let multihash;
	if (str.charAt(0) === "1" || str.charAt(0) === "Q") multihash = decode$8(base58btc.decode(`z${str}`));
	else {
		if (decoder == null) throw new InvalidParametersError("Please pass a multibase decoder for strings that do not start with \"1\" or \"Q\"");
		multihash = decode$8(decoder.decode(str));
	}
	return peerIdFromMultihash(multihash);
}
function peerIdFromMultihash(multihash) {
	if (isSha256Multihash(multihash)) return new RSAPeerId({ multihash });
	else if (isIdentityMultihash(multihash)) try {
		const publicKey = publicKeyFromMultihash(multihash);
		if (publicKey.type === "Ed25519") return new Ed25519PeerId({
			multihash,
			publicKey
		});
		else if (publicKey.type === "secp256k1") return new Secp256k1PeerId({
			multihash,
			publicKey
		});
	} catch (err) {
		const url = toString$2(multihash.digest);
		return new URLPeerId(new URL(url));
	}
	throw new InvalidMultihashError("Supplied PeerID Multihash is invalid");
}
function peerIdFromCID(cid) {
	if (cid?.multihash == null || cid.version == null || cid.version === 1 && cid.code !== LIBP2P_KEY_CODE && cid.code !== TRANSPORT_IPFS_GATEWAY_HTTP_CODE$1) throw new InvalidCIDError("Supplied PeerID CID is invalid");
	if (cid.code === TRANSPORT_IPFS_GATEWAY_HTTP_CODE$1) {
		const url = toString$2(cid.multihash.digest);
		return new URLPeerId(new URL(url));
	}
	return peerIdFromMultihash(cid.multihash);
}
function isIdentityMultihash(multihash) {
	return multihash.code === identity.code;
}
function isSha256Multihash(multihash) {
	return multihash.code === sha256$1.code;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/murmurhash3js-revisited/lib/murmurHash3js.js
var require_murmurHash3js = /* @__PURE__ */ __commonJSMin(((exports, module, this$2) => {
	(function(root, undefined) {
		"use strict";
		var library = {
			"version": "3.0.0",
			"x86": {},
			"x64": {},
			"inputValidation": true
		};
		function _validBytes(bytes) {
			if (!Array.isArray(bytes) && !ArrayBuffer.isView(bytes)) return false;
			for (var i = 0; i < bytes.length; i++) if (!Number.isInteger(bytes[i]) || bytes[i] < 0 || bytes[i] > 255) return false;
			return true;
		}
		function _x86Multiply(m, n) {
			return (m & 65535) * n + (((m >>> 16) * n & 65535) << 16);
		}
		function _x86Rotl(m, n) {
			return m << n | m >>> 32 - n;
		}
		function _x86Fmix(h) {
			h ^= h >>> 16;
			h = _x86Multiply(h, 2246822507);
			h ^= h >>> 13;
			h = _x86Multiply(h, 3266489909);
			h ^= h >>> 16;
			return h;
		}
		function _x64Add(m, n) {
			m = [
				m[0] >>> 16,
				m[0] & 65535,
				m[1] >>> 16,
				m[1] & 65535
			];
			n = [
				n[0] >>> 16,
				n[0] & 65535,
				n[1] >>> 16,
				n[1] & 65535
			];
			var o = [
				0,
				0,
				0,
				0
			];
			o[3] += m[3] + n[3];
			o[2] += o[3] >>> 16;
			o[3] &= 65535;
			o[2] += m[2] + n[2];
			o[1] += o[2] >>> 16;
			o[2] &= 65535;
			o[1] += m[1] + n[1];
			o[0] += o[1] >>> 16;
			o[1] &= 65535;
			o[0] += m[0] + n[0];
			o[0] &= 65535;
			return [o[0] << 16 | o[1], o[2] << 16 | o[3]];
		}
		function _x64Multiply(m, n) {
			m = [
				m[0] >>> 16,
				m[0] & 65535,
				m[1] >>> 16,
				m[1] & 65535
			];
			n = [
				n[0] >>> 16,
				n[0] & 65535,
				n[1] >>> 16,
				n[1] & 65535
			];
			var o = [
				0,
				0,
				0,
				0
			];
			o[3] += m[3] * n[3];
			o[2] += o[3] >>> 16;
			o[3] &= 65535;
			o[2] += m[2] * n[3];
			o[1] += o[2] >>> 16;
			o[2] &= 65535;
			o[2] += m[3] * n[2];
			o[1] += o[2] >>> 16;
			o[2] &= 65535;
			o[1] += m[1] * n[3];
			o[0] += o[1] >>> 16;
			o[1] &= 65535;
			o[1] += m[2] * n[2];
			o[0] += o[1] >>> 16;
			o[1] &= 65535;
			o[1] += m[3] * n[1];
			o[0] += o[1] >>> 16;
			o[1] &= 65535;
			o[0] += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0];
			o[0] &= 65535;
			return [o[0] << 16 | o[1], o[2] << 16 | o[3]];
		}
		function _x64Rotl(m, n) {
			n %= 64;
			if (n === 32) return [m[1], m[0]];
			else if (n < 32) return [m[0] << n | m[1] >>> 32 - n, m[1] << n | m[0] >>> 32 - n];
			else {
				n -= 32;
				return [m[1] << n | m[0] >>> 32 - n, m[0] << n | m[1] >>> 32 - n];
			}
		}
		function _x64LeftShift(m, n) {
			n %= 64;
			if (n === 0) return m;
			else if (n < 32) return [m[0] << n | m[1] >>> 32 - n, m[1] << n];
			else return [m[1] << n - 32, 0];
		}
		function _x64Xor(m, n) {
			return [m[0] ^ n[0], m[1] ^ n[1]];
		}
		function _x64Fmix(h) {
			h = _x64Xor(h, [0, h[0] >>> 1]);
			h = _x64Multiply(h, [4283543511, 3981806797]);
			h = _x64Xor(h, [0, h[0] >>> 1]);
			h = _x64Multiply(h, [3301882366, 444984403]);
			h = _x64Xor(h, [0, h[0] >>> 1]);
			return h;
		}
		library.x86.hash32 = function(bytes, seed) {
			if (library.inputValidation && !_validBytes(bytes)) return undefined;
			seed = seed || 0;
			var remainder = bytes.length % 4;
			var blocks = bytes.length - remainder;
			var h1 = seed;
			var k1 = 0;
			var c1 = 3432918353;
			var c2 = 461845907;
			for (var i = 0; i < blocks; i = i + 4) {
				k1 = bytes[i] | bytes[i + 1] << 8 | bytes[i + 2] << 16 | bytes[i + 3] << 24;
				k1 = _x86Multiply(k1, c1);
				k1 = _x86Rotl(k1, 15);
				k1 = _x86Multiply(k1, c2);
				h1 ^= k1;
				h1 = _x86Rotl(h1, 13);
				h1 = _x86Multiply(h1, 5) + 3864292196;
			}
			k1 = 0;
			switch (remainder) {
				case 3: k1 ^= bytes[i + 2] << 16;
				case 2: k1 ^= bytes[i + 1] << 8;
				case 1:
					k1 ^= bytes[i];
					k1 = _x86Multiply(k1, c1);
					k1 = _x86Rotl(k1, 15);
					k1 = _x86Multiply(k1, c2);
					h1 ^= k1;
			}
			h1 ^= bytes.length;
			h1 = _x86Fmix(h1);
			return h1 >>> 0;
		};
		library.x86.hash128 = function(bytes, seed) {
			if (library.inputValidation && !_validBytes(bytes)) return undefined;
			seed = seed || 0;
			var remainder = bytes.length % 16;
			var blocks = bytes.length - remainder;
			var h1 = seed;
			var h2 = seed;
			var h3 = seed;
			var h4 = seed;
			var k1 = 0;
			var k2 = 0;
			var k3 = 0;
			var k4 = 0;
			var c1 = 597399067;
			var c2 = 2869860233;
			var c3 = 951274213;
			var c4 = 2716044179;
			for (var i = 0; i < blocks; i = i + 16) {
				k1 = bytes[i] | bytes[i + 1] << 8 | bytes[i + 2] << 16 | bytes[i + 3] << 24;
				k2 = bytes[i + 4] | bytes[i + 5] << 8 | bytes[i + 6] << 16 | bytes[i + 7] << 24;
				k3 = bytes[i + 8] | bytes[i + 9] << 8 | bytes[i + 10] << 16 | bytes[i + 11] << 24;
				k4 = bytes[i + 12] | bytes[i + 13] << 8 | bytes[i + 14] << 16 | bytes[i + 15] << 24;
				k1 = _x86Multiply(k1, c1);
				k1 = _x86Rotl(k1, 15);
				k1 = _x86Multiply(k1, c2);
				h1 ^= k1;
				h1 = _x86Rotl(h1, 19);
				h1 += h2;
				h1 = _x86Multiply(h1, 5) + 1444728091;
				k2 = _x86Multiply(k2, c2);
				k2 = _x86Rotl(k2, 16);
				k2 = _x86Multiply(k2, c3);
				h2 ^= k2;
				h2 = _x86Rotl(h2, 17);
				h2 += h3;
				h2 = _x86Multiply(h2, 5) + 197830471;
				k3 = _x86Multiply(k3, c3);
				k3 = _x86Rotl(k3, 17);
				k3 = _x86Multiply(k3, c4);
				h3 ^= k3;
				h3 = _x86Rotl(h3, 15);
				h3 += h4;
				h3 = _x86Multiply(h3, 5) + 2530024501;
				k4 = _x86Multiply(k4, c4);
				k4 = _x86Rotl(k4, 18);
				k4 = _x86Multiply(k4, c1);
				h4 ^= k4;
				h4 = _x86Rotl(h4, 13);
				h4 += h1;
				h4 = _x86Multiply(h4, 5) + 850148119;
			}
			k1 = 0;
			k2 = 0;
			k3 = 0;
			k4 = 0;
			switch (remainder) {
				case 15: k4 ^= bytes[i + 14] << 16;
				case 14: k4 ^= bytes[i + 13] << 8;
				case 13:
					k4 ^= bytes[i + 12];
					k4 = _x86Multiply(k4, c4);
					k4 = _x86Rotl(k4, 18);
					k4 = _x86Multiply(k4, c1);
					h4 ^= k4;
				case 12: k3 ^= bytes[i + 11] << 24;
				case 11: k3 ^= bytes[i + 10] << 16;
				case 10: k3 ^= bytes[i + 9] << 8;
				case 9:
					k3 ^= bytes[i + 8];
					k3 = _x86Multiply(k3, c3);
					k3 = _x86Rotl(k3, 17);
					k3 = _x86Multiply(k3, c4);
					h3 ^= k3;
				case 8: k2 ^= bytes[i + 7] << 24;
				case 7: k2 ^= bytes[i + 6] << 16;
				case 6: k2 ^= bytes[i + 5] << 8;
				case 5:
					k2 ^= bytes[i + 4];
					k2 = _x86Multiply(k2, c2);
					k2 = _x86Rotl(k2, 16);
					k2 = _x86Multiply(k2, c3);
					h2 ^= k2;
				case 4: k1 ^= bytes[i + 3] << 24;
				case 3: k1 ^= bytes[i + 2] << 16;
				case 2: k1 ^= bytes[i + 1] << 8;
				case 1:
					k1 ^= bytes[i];
					k1 = _x86Multiply(k1, c1);
					k1 = _x86Rotl(k1, 15);
					k1 = _x86Multiply(k1, c2);
					h1 ^= k1;
			}
			h1 ^= bytes.length;
			h2 ^= bytes.length;
			h3 ^= bytes.length;
			h4 ^= bytes.length;
			h1 += h2;
			h1 += h3;
			h1 += h4;
			h2 += h1;
			h3 += h1;
			h4 += h1;
			h1 = _x86Fmix(h1);
			h2 = _x86Fmix(h2);
			h3 = _x86Fmix(h3);
			h4 = _x86Fmix(h4);
			h1 += h2;
			h1 += h3;
			h1 += h4;
			h2 += h1;
			h3 += h1;
			h4 += h1;
			return ("00000000" + (h1 >>> 0).toString(16)).slice(-8) + ("00000000" + (h2 >>> 0).toString(16)).slice(-8) + ("00000000" + (h3 >>> 0).toString(16)).slice(-8) + ("00000000" + (h4 >>> 0).toString(16)).slice(-8);
		};
		library.x64.hash128 = function(bytes, seed) {
			if (library.inputValidation && !_validBytes(bytes)) return undefined;
			seed = seed || 0;
			var remainder = bytes.length % 16;
			var blocks = bytes.length - remainder;
			var h1 = [0, seed];
			var h2 = [0, seed];
			var k1 = [0, 0];
			var k2 = [0, 0];
			var c1 = [2277735313, 289559509];
			var c2 = [1291169091, 658871167];
			for (var i = 0; i < blocks; i = i + 16) {
				k1 = [bytes[i + 4] | bytes[i + 5] << 8 | bytes[i + 6] << 16 | bytes[i + 7] << 24, bytes[i] | bytes[i + 1] << 8 | bytes[i + 2] << 16 | bytes[i + 3] << 24];
				k2 = [bytes[i + 12] | bytes[i + 13] << 8 | bytes[i + 14] << 16 | bytes[i + 15] << 24, bytes[i + 8] | bytes[i + 9] << 8 | bytes[i + 10] << 16 | bytes[i + 11] << 24];
				k1 = _x64Multiply(k1, c1);
				k1 = _x64Rotl(k1, 31);
				k1 = _x64Multiply(k1, c2);
				h1 = _x64Xor(h1, k1);
				h1 = _x64Rotl(h1, 27);
				h1 = _x64Add(h1, h2);
				h1 = _x64Add(_x64Multiply(h1, [0, 5]), [0, 1390208809]);
				k2 = _x64Multiply(k2, c2);
				k2 = _x64Rotl(k2, 33);
				k2 = _x64Multiply(k2, c1);
				h2 = _x64Xor(h2, k2);
				h2 = _x64Rotl(h2, 31);
				h2 = _x64Add(h2, h1);
				h2 = _x64Add(_x64Multiply(h2, [0, 5]), [0, 944331445]);
			}
			k1 = [0, 0];
			k2 = [0, 0];
			switch (remainder) {
				case 15: k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 14]], 48));
				case 14: k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 13]], 40));
				case 13: k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 12]], 32));
				case 12: k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 11]], 24));
				case 11: k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 10]], 16));
				case 10: k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 9]], 8));
				case 9:
					k2 = _x64Xor(k2, [0, bytes[i + 8]]);
					k2 = _x64Multiply(k2, c2);
					k2 = _x64Rotl(k2, 33);
					k2 = _x64Multiply(k2, c1);
					h2 = _x64Xor(h2, k2);
				case 8: k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 7]], 56));
				case 7: k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 6]], 48));
				case 6: k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 5]], 40));
				case 5: k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 4]], 32));
				case 4: k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 3]], 24));
				case 3: k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 2]], 16));
				case 2: k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 1]], 8));
				case 1:
					k1 = _x64Xor(k1, [0, bytes[i]]);
					k1 = _x64Multiply(k1, c1);
					k1 = _x64Rotl(k1, 31);
					k1 = _x64Multiply(k1, c2);
					h1 = _x64Xor(h1, k1);
			}
			h1 = _x64Xor(h1, [0, bytes.length]);
			h2 = _x64Xor(h2, [0, bytes.length]);
			h1 = _x64Add(h1, h2);
			h2 = _x64Add(h2, h1);
			h1 = _x64Fmix(h1);
			h2 = _x64Fmix(h2);
			h1 = _x64Add(h1, h2);
			h2 = _x64Add(h2, h1);
			return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
		};
		if (typeof exports !== "undefined") {
			if (typeof module !== "undefined" && module.exports) exports = module.exports = library;
			exports.murmurHash3 = library;
		} else if (typeof define === "function" && define.amd) define([], function() {
			return library;
		});
		else {
			library._murmurHash3 = root.murmurHash3;
			library.noConflict = function() {
				root.murmurHash3 = library._murmurHash3;
				library._murmurHash3 = undefined;
				library.noConflict = undefined;
				return library;
			};
			root.murmurHash3 = library;
		}
	})(this$2);
}));
//#endregion
//#region vendor/ipld-explorer-components/node_modules/murmurhash3js-revisited/index.js
var require_murmurhash3js_revisited = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_murmurHash3js();
}));
//#endregion
//#region vendor/ipld-explorer-components/node_modules/ms/dist/index.mjs
var s = 1e3;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
function ms(value, options) {
	try {
		if (typeof value === "string" && value.length > 0) return parse$1(value);
		else if (typeof value === "number" && isFinite(value)) return options?.long ? fmtLong(value) : fmtShort(value);
		throw new Error("Value is not a string or number.");
	} catch (error) {
		const message = isError(error) ? `${error.message}. value=${JSON.stringify(value)}` : "An unknown error has occured.";
		throw new Error(message);
	}
}
/**
* Parse the given `str` and return milliseconds.
*/
function parse$1(str) {
	str = String(str);
	if (str.length > 100) throw new Error("Value exceeds the maximum length of 100 characters.");
	const match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
	if (!match) return NaN;
	const n = parseFloat(match[1]);
	const type = (match[2] || "ms").toLowerCase();
	switch (type) {
		case "years":
		case "year":
		case "yrs":
		case "yr":
		case "y": return n * y;
		case "weeks":
		case "week":
		case "w": return n * w;
		case "days":
		case "day":
		case "d": return n * d;
		case "hours":
		case "hour":
		case "hrs":
		case "hr":
		case "h": return n * h;
		case "minutes":
		case "minute":
		case "mins":
		case "min":
		case "m": return n * m;
		case "seconds":
		case "second":
		case "secs":
		case "sec":
		case "s": return n * s;
		case "milliseconds":
		case "millisecond":
		case "msecs":
		case "msec":
		case "ms": return n;
		default: throw new Error(`The unit ${type} was matched, but no matching case exists.`);
	}
}
/**
* Short format for `ms`.
*/
function fmtShort(ms) {
	const msAbs = Math.abs(ms);
	if (msAbs >= d) return `${Math.round(ms / d)}d`;
	if (msAbs >= h) return `${Math.round(ms / h)}h`;
	if (msAbs >= m) return `${Math.round(ms / m)}m`;
	if (msAbs >= s) return `${Math.round(ms / s)}s`;
	return `${ms}ms`;
}
/**
* Long format for `ms`.
*/
function fmtLong(ms) {
	const msAbs = Math.abs(ms);
	if (msAbs >= d) return plural(ms, msAbs, d, "day");
	if (msAbs >= h) return plural(ms, msAbs, h, "hour");
	if (msAbs >= m) return plural(ms, msAbs, m, "minute");
	if (msAbs >= s) return plural(ms, msAbs, s, "second");
	return `${ms} ms`;
}
/**
* Pluralization helper.
*/
function plural(ms, msAbs, n, name) {
	const isPlural = msAbs >= n * 1.5;
	return `${Math.round(ms / n)} ${name}${isPlural ? "s" : ""}`;
}
/**
* A type guard for errors.
*/
function isError(error) {
	return typeof error === "object" && error !== null && "message" in error;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/weald/dist/src/common.js
/**
* This is the common logic for both the Node.js and web browser
* implementations of `debug()`.
*/
function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = ms;
	createDebug.destroy = destroy;
	Object.keys(env).forEach((key) => {
		createDebug[key] = env[key];
	});
	/**
	* The currently active debug mode names, and names to skip.
	*/
	createDebug.names = [];
	createDebug.skips = [];
	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};
	/**
	* Selects a color for a debug namespace
	*
	* @param {string} namespace - The namespace string for the debug instance to be colored
	* @returns {number | string} An ANSI color code for the given namespace
	*/
	function selectColor(namespace) {
		let hash = 0;
		for (let i = 0; i < namespace.length; i++) {
			hash = (hash << 5) - hash + namespace.charCodeAt(i);
			hash |= 0;
		}
		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;
	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {string} namespace
	* @returns {Function}
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;
		function debug(...args) {
			if (!debug.enabled) return;
			const self = debug;
			const curr = Number(/* @__PURE__ */ new Date());
			self.diff = curr - (prevTime || curr);
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;
			args[0] = createDebug.coerce(args[0]);
			if (typeof args[0] !== "string") args.unshift("%O");
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				if (match === "%%") return "%";
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === "function") {
					const val = args[index];
					match = formatter.call(self, val);
					args.splice(index, 1);
					index--;
				}
				return match;
			});
			createDebug.formatArgs.call(self, args);
			(self.log || createDebug.log).apply(self, args);
		}
		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy;
		Object.defineProperty(debug, "enabled", {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) return enableOverride;
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}
				return enabledCache;
			},
			set: (v) => {
				enableOverride = v;
			}
		});
		if (typeof createDebug.init === "function") createDebug.init(debug);
		return debug;
	}
	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}
	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {string} namespaces
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;
		createDebug.names = [];
		createDebug.skips = [];
		let i;
		const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
		const len = split.length;
		for (i = 0; i < len; i++) {
			if (!split[i]) continue;
			namespaces = split[i].replace(/\*/g, ".*?");
			if (namespaces[0] === "-") createDebug.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
			else createDebug.names.push(new RegExp("^" + namespaces + "$"));
		}
	}
	/**
	* Disable debug output.
	*
	* @returns {string} namespaces
	*/
	function disable() {
		const namespaces = [...createDebug.names.map(toNamespace), ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)].join(",");
		createDebug.enable("");
		return namespaces;
	}
	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {string} name
	* @returns {boolean}
	*/
	function enabled(name) {
		if (name[name.length - 1] === "*") return true;
		let i;
		let len;
		for (i = 0, len = createDebug.skips.length; i < len; i++) if (createDebug.skips[i].test(name)) return false;
		for (i = 0, len = createDebug.names.length; i < len; i++) if (createDebug.names[i].test(name)) return true;
		return false;
	}
	/**
	* Convert regexp to namespace
	*/
	function toNamespace(regexp) {
		return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
	}
	/**
	* Coerce `val`.
	*/
	function coerce(val) {
		if (val instanceof Error) return val.stack ?? val.message;
		return val;
	}
	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
	}
	createDebug.setupFormatters(createDebug.formatters);
	createDebug.enable(createDebug.load());
	return createDebug;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/weald/dist/src/browser.js
/**
* This is the web browser implementation of `debug()`.
*/
var storage = localstorage();
/**
* Colors.
*/
var colors = [
	"#0000CC",
	"#0000FF",
	"#0033CC",
	"#0033FF",
	"#0066CC",
	"#0066FF",
	"#0099CC",
	"#0099FF",
	"#00CC00",
	"#00CC33",
	"#00CC66",
	"#00CC99",
	"#00CCCC",
	"#00CCFF",
	"#3300CC",
	"#3300FF",
	"#3333CC",
	"#3333FF",
	"#3366CC",
	"#3366FF",
	"#3399CC",
	"#3399FF",
	"#33CC00",
	"#33CC33",
	"#33CC66",
	"#33CC99",
	"#33CCCC",
	"#33CCFF",
	"#6600CC",
	"#6600FF",
	"#6633CC",
	"#6633FF",
	"#66CC00",
	"#66CC33",
	"#9900CC",
	"#9900FF",
	"#9933CC",
	"#9933FF",
	"#99CC00",
	"#99CC33",
	"#CC0000",
	"#CC0033",
	"#CC0066",
	"#CC0099",
	"#CC00CC",
	"#CC00FF",
	"#CC3300",
	"#CC3333",
	"#CC3366",
	"#CC3399",
	"#CC33CC",
	"#CC33FF",
	"#CC6600",
	"#CC6633",
	"#CC9900",
	"#CC9933",
	"#CCCC00",
	"#CCCC33",
	"#FF0000",
	"#FF0033",
	"#FF0066",
	"#FF0099",
	"#FF00CC",
	"#FF00FF",
	"#FF3300",
	"#FF3333",
	"#FF3366",
	"#FF3399",
	"#FF33CC",
	"#FF33FF",
	"#FF6600",
	"#FF6633",
	"#FF9900",
	"#FF9933",
	"#FFCC00",
	"#FFCC33"
];
/**
* Currently only WebKit-based Web Inspectors, Firefox >= v31,
* and the Firebug extension (any Firefox version) are known
* to support "%c" CSS customizations.
*
* TODO: add a `localStorage` variable to explicitly enable/disable colors
*/
function useColors() {
	if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) return true;
	if (typeof navigator !== "undefined" && navigator.userAgent?.toLowerCase().match(/(edge|trident)\/(\d+)/) != null) return false;
	return typeof document !== "undefined" && document.documentElement?.style?.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent?.toLowerCase().match(/firefox\/(\d+)/) != null && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent?.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
* Colorize log arguments if enabled.
*/
function formatArgs(args) {
	args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + ms(this.diff);
	if (!this.useColors) return;
	const c = "color: " + this.color;
	args.splice(1, 0, c, "color: inherit");
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, (match) => {
		if (match === "%%") return;
		index++;
		if (match === "%c") lastC = index;
	});
	args.splice(lastC, 0, c);
}
/**
* Invokes `console.debug()` when available.
* No-op when `console.debug` is not a "function".
* If `console.debug` is not available, falls back
* to `console.log`.
*/
var log$5 = console.debug ?? console.log ?? (() => {});
/**
* Save `namespaces`.
*
* @param {string} namespaces
*/
function save(namespaces) {
	try {
		if (namespaces) storage?.setItem("debug", namespaces);
		else storage?.removeItem("debug");
	} catch (error) {}
}
/**
* Load `namespaces`.
*
* @returns {string} returns the previously persisted debug modes
*/
function load() {
	let r;
	try {
		r = storage?.getItem("debug");
	} catch (error) {}
	if (!r && typeof globalThis.process !== "undefined" && "env" in globalThis.process) r = globalThis.process.env.DEBUG;
	return r;
}
/**
* Localstorage attempts to return the localstorage.
*
* This is necessary because safari throws
* when a user disables cookies/localstorage
* and you attempt to access it.
*/
function localstorage() {
	try {
		return localStorage;
	} catch (error) {}
}
function setupFormatters(formatters) {
	/**
	* Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	*/
	formatters.j = function(v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return "[UnexpectedJSONParseError]: " + error.message;
		}
	};
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/weald/dist/src/index.js
/**
* @packageDocumentation
*
* This module is a fork of the [debug](https://www.npmjs.com/package/debug) module. It has been converted to TypeScript and the output is ESM.
*
* It is API compatible with no extra features or bug fixes, it should only be used if you want a 100% ESM application.
*
* ESM should be arriving in `debug@5.x.x` so this module can be retired after that.
*
* Please see [debug](https://www.npmjs.com/package/debug) for API details.
*/
/**
* Module dependencies.
*/
var src_default = setup({
	formatArgs,
	save,
	load,
	useColors,
	setupFormatters,
	colors,
	storage,
	log: log$5
});
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/logger/dist/src/index.js
/**
* @packageDocumentation
*
* A logger for libp2p based on the venerable [debug](https://www.npmjs.com/package/debug) module.
*
* @example
*
* ```TypeScript
* import { logger } from '@libp2p/logger'
*
* const log = logger('libp2p:my:component:name')
*
* try {
*   // an operation
*   log('something happened: %s', 'it was ok')
* } catch (err) {
*   log.error('something bad happened: %o', err)
* }
*
* log('with this peer: %p', {})
* log('and this base58btc: %b', Uint8Array.from([0, 1, 2, 3]))
* log('and this base32: %t', Uint8Array.from([4, 5, 6, 7]))
* ```
*
* ```console
* $ DEBUG=libp2p:* node index.js
* something happened: it was ok
* something bad happened: <stack trace>
* with this peer: 12D3Foo
* with this base58btc: Qmfoo
* with this base32: bafyfoo
* ```
*/
src_default.formatters.b = (v) => {
	return v == null ? "undefined" : base58btc.baseEncode(v);
};
src_default.formatters.t = (v) => {
	return v == null ? "undefined" : base32.baseEncode(v);
};
src_default.formatters.m = (v) => {
	return v == null ? "undefined" : base64.baseEncode(v);
};
src_default.formatters.p = (v) => {
	return v == null ? "undefined" : v.toString();
};
src_default.formatters.c = (v) => {
	return v == null ? "undefined" : v.toString();
};
src_default.formatters.k = (v) => {
	return v == null ? "undefined" : v.toString();
};
src_default.formatters.a = (v) => {
	return v == null ? "undefined" : v.toString();
};
src_default.formatters.e = (v) => {
	return v == null ? "undefined" : v.stack ?? v.message;
};
function createDisabledLogger(namespace) {
	const logger = () => {};
	logger.enabled = false;
	logger.color = "";
	logger.diff = 0;
	logger.log = () => {};
	logger.namespace = namespace;
	logger.destroy = () => true;
	logger.extend = () => logger;
	return logger;
}
/**
* Create a component logger
*
* @example
*
* ```TypeScript
* import { defaultLogger } from '@libp2p/logger'
* import { peerIdFromString } from '@libp2p/peer-id'
*
* const logger = defaultLogger()
*
* const log = logger.forComponent('my-component')
* log.info('hello world')
* // logs "my-component hello world"
* ```
*/
function defaultLogger() {
	return { forComponent(name) {
		return logger(name);
	} };
}
/**
* Creates a logger for the passed component name.
*
* @example
*
* ```TypeScript
* import { logger } from '@libp2p/logger'
*
* const log = logger('my-component')
* log.info('hello world')
* // logs "my-component hello world"
* ```
*/
function logger(name) {
	let trace = createDisabledLogger(`${name}:trace`);
	if (src_default.enabled(`${name}:trace`) && src_default.names.map((r) => r.toString()).find((n) => n.includes(":trace")) != null) trace = src_default(`${name}:trace`);
	return Object.assign(src_default(name), {
		error: src_default(`${name}:error`),
		trace
	});
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/eventemitter3/index.mjs
var import_eventemitter3 = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var has = Object.prototype.hasOwnProperty;
	var prefix = "~";
	/**
	* Constructor to create a storage for our `EE` objects.
	* An `Events` instance is a plain object whose properties are event names.
	*
	* @constructor
	* @private
	*/
	function Events() {}
	if (Object.create) {
		Events.prototype = Object.create(null);
		if (!new Events().__proto__) prefix = false;
	}
	/**
	* Representation of a single event listener.
	*
	* @param {Function} fn The listener function.
	* @param {*} context The context to invoke the listener with.
	* @param {Boolean} [once=false] Specify if the listener is a one-time listener.
	* @constructor
	* @private
	*/
	function EE(fn, context, once) {
		this.fn = fn;
		this.context = context;
		this.once = once || false;
	}
	/**
	* Add a listener for a given event.
	*
	* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} context The context to invoke the listener with.
	* @param {Boolean} once Specify if the listener is a one-time listener.
	* @returns {EventEmitter}
	* @private
	*/
	function addListener(emitter, event, fn, context, once) {
		if (typeof fn !== "function") throw new TypeError("The listener must be a function");
		var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
		if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
		else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
		else emitter._events[evt] = [emitter._events[evt], listener];
		return emitter;
	}
	/**
	* Clear event by name.
	*
	* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	* @param {(String|Symbol)} evt The Event name.
	* @private
	*/
	function clearEvent(emitter, evt) {
		if (--emitter._eventsCount === 0) emitter._events = new Events();
		else delete emitter._events[evt];
	}
	/**
	* Minimal `EventEmitter` interface that is molded against the Node.js
	* `EventEmitter` interface.
	*
	* @constructor
	* @public
	*/
	function EventEmitter() {
		this._events = new Events();
		this._eventsCount = 0;
	}
	/**
	* Return an array listing the events for which the emitter has registered
	* listeners.
	*
	* @returns {Array}
	* @public
	*/
	EventEmitter.prototype.eventNames = function eventNames() {
		var names = [], events, name;
		if (this._eventsCount === 0) return names;
		for (name in events = this._events) if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
		if (Object.getOwnPropertySymbols) return names.concat(Object.getOwnPropertySymbols(events));
		return names;
	};
	/**
	* Return the listeners registered for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Array} The registered listeners.
	* @public
	*/
	EventEmitter.prototype.listeners = function listeners(event) {
		var evt = prefix ? prefix + event : event, handlers = this._events[evt];
		if (!handlers) return [];
		if (handlers.fn) return [handlers.fn];
		for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) ee[i] = handlers[i].fn;
		return ee;
	};
	/**
	* Return the number of listeners listening to a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Number} The number of listeners.
	* @public
	*/
	EventEmitter.prototype.listenerCount = function listenerCount(event) {
		var evt = prefix ? prefix + event : event, listeners = this._events[evt];
		if (!listeners) return 0;
		if (listeners.fn) return 1;
		return listeners.length;
	};
	/**
	* Calls each of the listeners registered for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Boolean} `true` if the event had listeners, else `false`.
	* @public
	*/
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
		var evt = prefix ? prefix + event : event;
		if (!this._events[evt]) return false;
		var listeners = this._events[evt], len = arguments.length, args, i;
		if (listeners.fn) {
			if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
			switch (len) {
				case 1: return listeners.fn.call(listeners.context), true;
				case 2: return listeners.fn.call(listeners.context, a1), true;
				case 3: return listeners.fn.call(listeners.context, a1, a2), true;
				case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
				case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
				case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
			}
			for (i = 1, args = new Array(len - 1); i < len; i++) args[i - 1] = arguments[i];
			listeners.fn.apply(listeners.context, args);
		} else {
			var length = listeners.length, j;
			for (i = 0; i < length; i++) {
				if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
				switch (len) {
					case 1:
						listeners[i].fn.call(listeners[i].context);
						break;
					case 2:
						listeners[i].fn.call(listeners[i].context, a1);
						break;
					case 3:
						listeners[i].fn.call(listeners[i].context, a1, a2);
						break;
					case 4:
						listeners[i].fn.call(listeners[i].context, a1, a2, a3);
						break;
					default:
						if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) args[j - 1] = arguments[j];
						listeners[i].fn.apply(listeners[i].context, args);
				}
			}
		}
		return true;
	};
	/**
	* Add a listener for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} [context=this] The context to invoke the listener with.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.on = function on(event, fn, context) {
		return addListener(this, event, fn, context, false);
	};
	/**
	* Add a one-time listener for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} [context=this] The context to invoke the listener with.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.once = function once(event, fn, context) {
		return addListener(this, event, fn, context, true);
	};
	/**
	* Remove the listeners of a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn Only remove the listeners that match this function.
	* @param {*} context Only remove the listeners that have this context.
	* @param {Boolean} once Only remove one-time listeners.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
		var evt = prefix ? prefix + event : event;
		if (!this._events[evt]) return this;
		if (!fn) {
			clearEvent(this, evt);
			return this;
		}
		var listeners = this._events[evt];
		if (listeners.fn) {
			if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) clearEvent(this, evt);
		} else {
			for (var i = 0, events = [], length = listeners.length; i < length; i++) if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) events.push(listeners[i]);
			if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
			else clearEvent(this, evt);
		}
		return this;
	};
	/**
	* Remove all listeners, or those of the specified event.
	*
	* @param {(String|Symbol)} [event] The event name.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
		var evt;
		if (event) {
			evt = prefix ? prefix + event : event;
			if (this._events[evt]) clearEvent(this, evt);
		} else {
			this._events = new Events();
			this._eventsCount = 0;
		}
		return this;
	};
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	EventEmitter.prefixed = prefix;
	EventEmitter.EventEmitter = EventEmitter;
	if ("undefined" !== typeof module) module.exports = EventEmitter;
})))(), 1);
//#endregion
//#region vendor/ipld-explorer-components/node_modules/p-timeout/index.js
var TimeoutError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "TimeoutError";
	}
};
/**
An error to be thrown when the request is aborted by AbortController.
DOMException is thrown instead of this Error when DOMException is available.
*/
var AbortError = class extends Error {
	constructor(message) {
		super();
		this.name = "AbortError";
		this.message = message;
	}
};
/**
TODO: Remove AbortError and just throw DOMException when targeting Node 18.
*/
var getDOMException = (errorMessage) => globalThis.DOMException === void 0 ? new AbortError(errorMessage) : new DOMException(errorMessage);
/**
TODO: Remove below function and just 'reject(signal.reason)' when targeting Node 18.
*/
var getAbortedReason = (signal) => {
	const reason = signal.reason === void 0 ? getDOMException("This operation was aborted.") : signal.reason;
	return reason instanceof Error ? reason : getDOMException(reason);
};
function pTimeout(promise, options) {
	const { milliseconds, fallback, message, customTimers = {
		setTimeout,
		clearTimeout
	} } = options;
	let timer;
	const cancelablePromise = new Promise((resolve, reject) => {
		if (typeof milliseconds !== "number" || Math.sign(milliseconds) !== 1) throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
		if (options.signal) {
			const { signal } = options;
			if (signal.aborted) reject(getAbortedReason(signal));
			const abortHandler = () => {
				reject(getAbortedReason(signal));
			};
			signal.addEventListener("abort", abortHandler, { once: true });
			promise.finally(() => {
				signal.removeEventListener("abort", abortHandler);
			});
		}
		if (milliseconds === Number.POSITIVE_INFINITY) {
			promise.then(resolve, reject);
			return;
		}
		const timeoutError = new TimeoutError();
		timer = customTimers.setTimeout.call(void 0, () => {
			if (fallback) {
				try {
					resolve(fallback());
				} catch (error) {
					reject(error);
				}
				return;
			}
			if (typeof promise.cancel === "function") promise.cancel();
			if (message === false) resolve();
			else if (message instanceof Error) reject(message);
			else {
				timeoutError.message = message ?? `Promise timed out after ${milliseconds} milliseconds`;
				reject(timeoutError);
			}
		}, milliseconds);
		(async () => {
			try {
				resolve(await promise);
			} catch (error) {
				reject(error);
			}
		})();
	}).finally(() => {
		cancelablePromise.clear();
	});
	cancelablePromise.clear = () => {
		customTimers.clearTimeout.call(void 0, timer);
		timer = void 0;
	};
	return cancelablePromise;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/p-queue/dist/lower-bound.js
function lowerBound(array, value, comparator) {
	let first = 0;
	let count = array.length;
	while (count > 0) {
		const step = Math.trunc(count / 2);
		let it = first + step;
		if (comparator(array[it], value) <= 0) {
			first = ++it;
			count -= step + 1;
		} else count = step;
	}
	return first;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/p-queue/dist/priority-queue.js
var PriorityQueue = class {
	#queue = [];
	enqueue(run, options) {
		options = {
			priority: 0,
			...options
		};
		const element = {
			priority: options.priority,
			run
		};
		if (this.size && this.#queue[this.size - 1].priority >= options.priority) {
			this.#queue.push(element);
			return;
		}
		const index = lowerBound(this.#queue, element, (a, b) => b.priority - a.priority);
		this.#queue.splice(index, 0, element);
	}
	dequeue() {
		return this.#queue.shift()?.run;
	}
	filter(options) {
		return this.#queue.filter((element) => element.priority === options.priority).map((element) => element.run);
	}
	get size() {
		return this.#queue.length;
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/p-queue/dist/index.js
/**
Promise queue with concurrency control.
*/
var PQueue = class extends import_eventemitter3.default {
	#carryoverConcurrencyCount;
	#isIntervalIgnored;
	#intervalCount = 0;
	#intervalCap;
	#interval;
	#intervalEnd = 0;
	#intervalId;
	#timeoutId;
	#queue;
	#queueClass;
	#pending = 0;
	#concurrency;
	#isPaused;
	#throwOnTimeout;
	/**
	Per-operation timeout in milliseconds. Operations fulfill once `timeout` elapses if they haven't already.
	
	Applies to each future operation.
	*/
	timeout;
	constructor(options) {
		super();
		options = {
			carryoverConcurrencyCount: false,
			intervalCap: Number.POSITIVE_INFINITY,
			interval: 0,
			concurrency: Number.POSITIVE_INFINITY,
			autoStart: true,
			queueClass: PriorityQueue,
			...options
		};
		if (!(typeof options.intervalCap === "number" && options.intervalCap >= 1)) throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${options.intervalCap?.toString() ?? ""}\` (${typeof options.intervalCap})`);
		if (options.interval === void 0 || !(Number.isFinite(options.interval) && options.interval >= 0)) throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${options.interval?.toString() ?? ""}\` (${typeof options.interval})`);
		this.#carryoverConcurrencyCount = options.carryoverConcurrencyCount;
		this.#isIntervalIgnored = options.intervalCap === Number.POSITIVE_INFINITY || options.interval === 0;
		this.#intervalCap = options.intervalCap;
		this.#interval = options.interval;
		this.#queue = new options.queueClass();
		this.#queueClass = options.queueClass;
		this.concurrency = options.concurrency;
		this.timeout = options.timeout;
		this.#throwOnTimeout = options.throwOnTimeout === true;
		this.#isPaused = options.autoStart === false;
	}
	get #doesIntervalAllowAnother() {
		return this.#isIntervalIgnored || this.#intervalCount < this.#intervalCap;
	}
	get #doesConcurrentAllowAnother() {
		return this.#pending < this.#concurrency;
	}
	#next() {
		this.#pending--;
		this.#tryToStartAnother();
		this.emit("next");
	}
	#onResumeInterval() {
		this.#onInterval();
		this.#initializeIntervalIfNeeded();
		this.#timeoutId = void 0;
	}
	get #isIntervalPaused() {
		const now = Date.now();
		if (this.#intervalId === void 0) {
			const delay = this.#intervalEnd - now;
			if (delay < 0) this.#intervalCount = this.#carryoverConcurrencyCount ? this.#pending : 0;
			else {
				if (this.#timeoutId === void 0) this.#timeoutId = setTimeout(() => {
					this.#onResumeInterval();
				}, delay);
				return true;
			}
		}
		return false;
	}
	#tryToStartAnother() {
		if (this.#queue.size === 0) {
			if (this.#intervalId) clearInterval(this.#intervalId);
			this.#intervalId = void 0;
			this.emit("empty");
			if (this.#pending === 0) this.emit("idle");
			return false;
		}
		if (!this.#isPaused) {
			const canInitializeInterval = !this.#isIntervalPaused;
			if (this.#doesIntervalAllowAnother && this.#doesConcurrentAllowAnother) {
				const job = this.#queue.dequeue();
				if (!job) return false;
				this.emit("active");
				job();
				if (canInitializeInterval) this.#initializeIntervalIfNeeded();
				return true;
			}
		}
		return false;
	}
	#initializeIntervalIfNeeded() {
		if (this.#isIntervalIgnored || this.#intervalId !== void 0) return;
		this.#intervalId = setInterval(() => {
			this.#onInterval();
		}, this.#interval);
		this.#intervalEnd = Date.now() + this.#interval;
	}
	#onInterval() {
		if (this.#intervalCount === 0 && this.#pending === 0 && this.#intervalId) {
			clearInterval(this.#intervalId);
			this.#intervalId = void 0;
		}
		this.#intervalCount = this.#carryoverConcurrencyCount ? this.#pending : 0;
		this.#processQueue();
	}
	/**
	Executes all queued functions until it reaches the limit.
	*/
	#processQueue() {
		while (this.#tryToStartAnother());
	}
	get concurrency() {
		return this.#concurrency;
	}
	set concurrency(newConcurrency) {
		if (!(typeof newConcurrency === "number" && newConcurrency >= 1)) throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
		this.#concurrency = newConcurrency;
		this.#processQueue();
	}
	async #throwOnAbort(signal) {
		return new Promise((_resolve, reject) => {
			signal.addEventListener("abort", () => {
				reject(signal.reason);
			}, { once: true });
		});
	}
	async add(function_, options = {}) {
		options = {
			timeout: this.timeout,
			throwOnTimeout: this.#throwOnTimeout,
			...options
		};
		return new Promise((resolve, reject) => {
			this.#queue.enqueue(async () => {
				this.#pending++;
				this.#intervalCount++;
				try {
					options.signal?.throwIfAborted();
					let operation = function_({ signal: options.signal });
					if (options.timeout) operation = pTimeout(Promise.resolve(operation), { milliseconds: options.timeout });
					if (options.signal) operation = Promise.race([operation, this.#throwOnAbort(options.signal)]);
					const result = await operation;
					resolve(result);
					this.emit("completed", result);
				} catch (error) {
					if (error instanceof TimeoutError && !options.throwOnTimeout) {
						resolve();
						return;
					}
					reject(error);
					this.emit("error", error);
				} finally {
					this.#next();
				}
			}, options);
			this.emit("add");
			this.#tryToStartAnother();
		});
	}
	async addAll(functions, options) {
		return Promise.all(functions.map(async (function_) => this.add(function_, options)));
	}
	/**
	Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
	*/
	start() {
		if (!this.#isPaused) return this;
		this.#isPaused = false;
		this.#processQueue();
		return this;
	}
	/**
	Put queue execution on hold.
	*/
	pause() {
		this.#isPaused = true;
	}
	/**
	Clear the queue.
	*/
	clear() {
		this.#queue = new this.#queueClass();
	}
	/**
	Can be called multiple times. Useful if you for example add additional items at a later time.
	
	@returns A promise that settles when the queue becomes empty.
	*/
	async onEmpty() {
		if (this.#queue.size === 0) return;
		await this.#onEvent("empty");
	}
	/**
	@returns A promise that settles when the queue size is less than the given limit: `queue.size < limit`.
	
	If you want to avoid having the queue grow beyond a certain size you can `await queue.onSizeLessThan()` before adding a new item.
	
	Note that this only limits the number of items waiting to start. There could still be up to `concurrency` jobs already running that this call does not include in its calculation.
	*/
	async onSizeLessThan(limit) {
		if (this.#queue.size < limit) return;
		await this.#onEvent("next", () => this.#queue.size < limit);
	}
	/**
	The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.
	
	@returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
	*/
	async onIdle() {
		if (this.#pending === 0 && this.#queue.size === 0) return;
		await this.#onEvent("idle");
	}
	async #onEvent(event, filter) {
		return new Promise((resolve) => {
			const listener = () => {
				if (filter && !filter()) return;
				this.off(event, listener);
				resolve();
			};
			this.on(event, listener);
		});
	}
	/**
	Size of the queue, the number of queued items waiting to run.
	*/
	get size() {
		return this.#queue.size;
	}
	/**
	Size of the queue, filtered by the given options.
	
	For example, this can be used to find the number of items remaining in the queue with a specific priority level.
	*/
	sizeBy(options) {
		return this.#queue.filter(options).length;
	}
	/**
	Number of running items (no longer in the queue).
	*/
	get pending() {
		return this.#pending;
	}
	/**
	Whether the queue is currently paused.
	*/
	get isPaused() {
		return this.#isPaused;
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@multiformats/dns/dist/src/utils/get-types.js
function getTypes(types) {
	const DEFAULT_TYPES = [RecordType.A];
	if (types == null) return DEFAULT_TYPES;
	if (Array.isArray(types)) {
		if (types.length === 0) return DEFAULT_TYPES;
		return types;
	}
	return [types];
}
function toDNSResponse(obj) {
	return {
		Status: obj.Status ?? 0,
		TC: obj.TC ?? obj.flag_tc ?? false,
		RD: obj.RD ?? obj.flag_rd ?? false,
		RA: obj.RA ?? obj.flag_ra ?? false,
		AD: obj.AD ?? obj.flag_ad ?? false,
		CD: obj.CD ?? obj.flag_cd ?? false,
		Question: (obj.Question ?? obj.questions ?? []).map((question) => {
			return {
				name: question.name,
				type: RecordType[question.type]
			};
		}),
		Answer: (obj.Answer ?? obj.answers ?? []).map((answer) => {
			return {
				name: answer.name,
				type: RecordType[answer.type],
				TTL: answer.TTL ?? answer.ttl ?? 60,
				data: answer.data instanceof Uint8Array ? toString$2(answer.data) : answer.data
			};
		})
	};
}
/**
* Uses the RFC 8427 'application/dns-json' content-type to resolve DNS queries.
*
* Supports and server that uses the same schema as Google's DNS over HTTPS
* resolver.
*
* This resolver needs fewer dependencies than the regular DNS-over-HTTPS
* resolver so can result in a smaller bundle size and consequently is preferred
* for browser use.
*
* @see https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/
* @see https://github.com/curl/curl/wiki/DNS-over-HTTPS#publicly-available-servers
* @see https://dnsprivacy.org/public_resolvers/
* @see https://datatracker.ietf.org/doc/html/rfc8427
*/
function dnsJsonOverHttps(url, init = {}) {
	const httpQueue = new PQueue({ concurrency: init.queryConcurrency ?? 4 });
	return async (fqdn, options = {}) => {
		const searchParams = new URLSearchParams();
		searchParams.set("name", fqdn);
		getTypes(options.types).forEach((type) => {
			searchParams.append("type", RecordType[type]);
		});
		options.onProgress?.(new CustomProgressEvent("dns:query", { detail: fqdn }));
		const response = await httpQueue.add(async () => {
			const res = await fetch(`${url}?${searchParams}`, {
				headers: { accept: "application/dns-json" },
				signal: options?.signal
			});
			if (res.status !== 200) throw new Error(`Unexpected HTTP status: ${res.status} - ${res.statusText}`);
			const response = toDNSResponse(await res.json());
			options.onProgress?.(new CustomProgressEvent("dns:response", { detail: response }));
			return response;
		}, { signal: options.signal });
		if (response == null) throw new Error("No DNS response received");
		return response;
	};
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@multiformats/dns/dist/src/resolvers/default.browser.js
function defaultResolver() {
	return [dnsJsonOverHttps("https://cloudflare-dns.com/dns-query"), dnsJsonOverHttps("https://dns.google/resolve")];
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@multiformats/dns/dist/src/utils/cache.js
var import_hashlru = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function(max) {
		if (!max) throw Error("hashlru must have a max value, of type number, greater than 0");
		var size = 0, cache = Object.create(null), _cache = Object.create(null);
		function update(key, value) {
			cache[key] = value;
			size++;
			if (size >= max) {
				size = 0;
				_cache = cache;
				cache = Object.create(null);
			}
		}
		return {
			has: function(key) {
				return cache[key] !== void 0 || _cache[key] !== void 0;
			},
			remove: function(key) {
				if (cache[key] !== void 0) cache[key] = void 0;
				if (_cache[key] !== void 0) _cache[key] = void 0;
			},
			get: function(key) {
				var v = cache[key];
				if (v !== void 0) return v;
				if ((v = _cache[key]) !== void 0) {
					update(key, v);
					return v;
				}
			},
			set: function(key, value) {
				if (cache[key] !== void 0) cache[key] = value;
				else update(key, value);
			},
			clear: function() {
				cache = Object.create(null);
				_cache = Object.create(null);
			}
		};
	};
})))(), 1);
/**
* Time Aware Least Recent Used Cache
*
* @see https://arxiv.org/pdf/1801.00390
*/
var CachedAnswers = class {
	lru;
	constructor(maxSize) {
		this.lru = (0, import_hashlru.default)(maxSize);
	}
	get(fqdn, types) {
		let foundAllAnswers = true;
		const answers = [];
		for (const type of types) {
			const cached = this.getAnswers(fqdn, type);
			if (cached.length === 0) {
				foundAllAnswers = false;
				break;
			}
			answers.push(...cached);
		}
		if (foundAllAnswers) return toDNSResponse({ answers });
	}
	getAnswers(domain, type) {
		const key = `${domain.toLowerCase()}-${type}`;
		const answers = this.lru.get(key);
		if (answers != null) {
			const cachedAnswers = answers.filter((entry) => {
				return entry.expires > Date.now();
			}).map(({ expires, value }) => ({
				...value,
				TTL: Math.round((expires - Date.now()) / 1e3),
				type: RecordType[value.type]
			}));
			if (cachedAnswers.length === 0) this.lru.remove(key);
			return cachedAnswers;
		}
		return [];
	}
	add(domain, answer) {
		const key = `${domain.toLowerCase()}-${answer.type}`;
		const answers = this.lru.get(key) ?? [];
		answers.push({
			expires: Date.now() + (answer.TTL ?? 60) * 1e3,
			value: answer
		});
		this.lru.set(key, answers);
	}
	remove(domain, type) {
		const key = `${domain.toLowerCase()}-${type}`;
		this.lru.remove(key);
	}
	clear() {
		this.lru.clear();
	}
};
/**
* Avoid sending multiple queries for the same hostname by caching results
*/
function cache(size) {
	return new CachedAnswers(size);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@multiformats/dns/dist/src/dns.js
var DEFAULT_ANSWER_CACHE_SIZE = 1e3;
var DNS$1 = class {
	resolvers;
	cache;
	constructor(init) {
		this.resolvers = {};
		this.cache = cache(init.cacheSize ?? DEFAULT_ANSWER_CACHE_SIZE);
		Object.entries(init.resolvers ?? {}).forEach(([tld, resolver]) => {
			if (!Array.isArray(resolver)) resolver = [resolver];
			if (!tld.endsWith(".")) tld = `${tld}.`;
			this.resolvers[tld] = resolver;
		});
		if (this.resolvers["."] == null) this.resolvers["."] = defaultResolver();
	}
	/**
	* Queries DNS resolvers for the passed record types for the passed domain.
	*
	* If cached records exist for all desired types they will be returned
	* instead.
	*
	* Any new responses will be added to the cache for subsequent requests.
	*/
	async query(domain, options = {}) {
		const types = getTypes(options.types);
		const cached = options.cached !== false ? this.cache.get(domain, types) : void 0;
		if (cached != null) {
			options.onProgress?.(new CustomProgressEvent("dns:cache", { detail: cached }));
			return cached;
		}
		const tld = `${domain.split(".").pop()}.`;
		const resolvers = (this.resolvers[tld] ?? this.resolvers["."]).sort(() => {
			return Math.random() > .5 ? -1 : 1;
		});
		const errors = [];
		for (const resolver of resolvers) {
			if (options.signal?.aborted === true) break;
			try {
				const result = await resolver(domain, {
					...options,
					types
				});
				for (const answer of result.Answer) this.cache.add(domain, answer);
				return result;
			} catch (err) {
				errors.push(err);
				options.onProgress?.(new CustomProgressEvent("dns:error", { detail: err }));
			}
		}
		if (errors.length === 1) throw errors[0];
		throw new AggregateError(errors, `DNS lookup of ${domain} ${types} failed`);
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@multiformats/dns/dist/src/index.js
/**
* @packageDocumentation
*
* Query DNS records using `node:dns`, DNS over HTTP and/or DNSJSON over HTTP.
*
* A list of publicly accessible servers can be found [here](https://github.com/curl/curl/wiki/DNS-over-HTTPS#publicly-available-servers).
*
* @example Using the default resolver
*
* ```TypeScript
* import { dns } from '@multiformats/dns'
*
* const resolver = dns()
*
* // resolve A records with a 5s timeout
* const result = await dns.query('google.com', {
*   signal: AbortSignal.timeout(5000)
* })
* ```
*
* @example Using per-TLD resolvers
*
* ```TypeScript
* import { dns } from '@multiformats/dns'
* import { dnsJsonOverHttps } from '@multiformats/dns/resolvers'
*
* const resolver = dns({
*   resolvers: {
*     // will only be used to resolve `.com` addresses
*     'com.': dnsJsonOverHttps('https://cloudflare-dns.com/dns-query'),
*
*     // this can also be an array, resolvers will be shuffled and tried in
*     // series
*     'net.': [
*       dnsJsonOverHttps('https://dns.google/resolve'),
*       dnsJsonOverHttps('https://dns.pub/dns-query')
*     ],
*
*     // will only be used to resolve all other addresses
*     '.': dnsJsonOverHttps('https://dnsforge.de/dns-query'),
*   }
* })
* ```
*
* @example Query for specific record types
*
* ```TypeScript
* import { dns, RecordType } from '@multiformats/dns'
*
* const resolver = dns()
*
* // resolve only TXT records
* const result = await dns.query('google.com', {
*   types: [
*     RecordType.TXT
*   ]
* })
* ```
*
* ## Caching
*
* Individual Aanswers are cached so. If you make a request, for which all
* record types are cached, all values will be pulled from the cache.
*
* If any of the record types are not cached, a new request will be resolved as
* if none of the records were cached, and the cache will be updated to include
* the new results.
*
* @example Ignoring the cache
*
* ```TypeScript
* import { dns, RecordType } from '@multiformats/dns'
*
* const resolver = dns()
*
* // do not used cached results, always resolve a new query
* const result = await dns.query('google.com', {
*   cached: false
* })
* ```
*/
/**
* A subset of DNS Record Types
*
* @see https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4.
*/
var RecordType;
(function(RecordType) {
	RecordType[RecordType["A"] = 1] = "A";
	RecordType[RecordType["CNAME"] = 5] = "CNAME";
	RecordType[RecordType["TXT"] = 16] = "TXT";
	RecordType[RecordType["AAAA"] = 28] = "AAAA";
})(RecordType || (RecordType = {}));
function dns(init = {}) {
	return new DNS$1(init);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/interface-datastore/dist/src/key.js
var pathSepS = "/";
var pathSepB = new TextEncoder().encode(pathSepS);
var pathSep = pathSepB[0];
/**
* A Key represents the unique identifier of an object.
* Our Key scheme is inspired by file systems and Google App Engine key model.
* Keys are meant to be unique across a system. Keys are hierarchical,
* incorporating more and more specific namespaces. Thus keys can be deemed
* 'children' or 'ancestors' of other keys:
* - `new Key('/Comedy')`
* - `new Key('/Comedy/MontyPython')`
* Also, every namespace can be parametrized to embed relevant object
* information. For example, the Key `name` (most specific namespace) could
* include the object type:
* - `new Key('/Comedy/MontyPython/Actor:JohnCleese')`
* - `new Key('/Comedy/MontyPython/Sketch:CheeseShop')`
* - `new Key('/Comedy/MontyPython/Sketch:CheeseShop/Character:Mousebender')`
*
*/
var Key = class Key {
	_buf;
	/**
	* @param {string | Uint8Array} s
	* @param {boolean} [clean]
	*/
	constructor(s, clean) {
		if (typeof s === "string") this._buf = fromString(s);
		else if (s instanceof Uint8Array) this._buf = s;
		else throw new Error("Invalid key, should be String of Uint8Array");
		if (clean == null) clean = true;
		if (clean) this.clean();
		if (this._buf.byteLength === 0 || this._buf[0] !== pathSep) throw new Error("Invalid key");
	}
	/**
	* Convert to the string representation
	*
	* @param {import('uint8arrays/to-string').SupportedEncodings} [encoding='utf8'] - The encoding to use.
	* @returns {string}
	*/
	toString(encoding = "utf8") {
		return toString$2(this._buf, encoding);
	}
	/**
	* Return the Uint8Array representation of the key
	*
	* @returns {Uint8Array}
	*/
	uint8Array() {
		return this._buf;
	}
	/**
	* Return string representation of the key
	*
	* @returns {string}
	*/
	get [Symbol.toStringTag]() {
		return `Key(${this.toString()})`;
	}
	/**
	* Constructs a key out of a namespace array.
	*
	* @param {Array<string>} list - The array of namespaces
	* @returns {Key}
	*
	* @example
	* ```js
	* Key.withNamespaces(['one', 'two'])
	* // => Key('/one/two')
	* ```
	*/
	static withNamespaces(list) {
		return new Key(list.join(pathSepS));
	}
	/**
	* Returns a randomly (uuid) generated key.
	*
	* @returns {Key}
	*
	* @example
	* ```js
	* Key.random()
	* // => Key('/344502982398')
	* ```
	*/
	static random() {
		return new Key(Math.random().toString().substring(2));
	}
	/**
	* @param {*} other
	*/
	static asKey(other) {
		if (other instanceof Uint8Array || typeof other === "string") return new Key(other);
		if (typeof other.uint8Array === "function") return new Key(other.uint8Array());
		return null;
	}
	/**
	* Cleanup the current key
	*
	* @returns {void}
	*/
	clean() {
		if (this._buf == null || this._buf.byteLength === 0) this._buf = pathSepB;
		if (this._buf[0] !== pathSep) {
			const bytes = new Uint8Array(this._buf.byteLength + 1);
			bytes.fill(pathSep, 0, 1);
			bytes.set(this._buf, 1);
			this._buf = bytes;
		}
		while (this._buf.byteLength > 1 && this._buf[this._buf.byteLength - 1] === pathSep) this._buf = this._buf.subarray(0, -1);
	}
	/**
	* Check if the given key is sorted lower than ourself.
	*
	* @param {Key} key - The other Key to check against
	* @returns {boolean}
	*/
	less(key) {
		const list1 = this.list();
		const list2 = key.list();
		for (let i = 0; i < list1.length; i++) {
			if (list2.length < i + 1) return false;
			const c1 = list1[i];
			const c2 = list2[i];
			if (c1 < c2) return true;
			else if (c1 > c2) return false;
		}
		return list1.length < list2.length;
	}
	/**
	* Returns the key with all parts in reversed order.
	*
	* @returns {Key}
	*
	* @example
	* ```js
	* new Key('/Comedy/MontyPython/Actor:JohnCleese').reverse()
	* // => Key('/Actor:JohnCleese/MontyPython/Comedy')
	* ```
	*/
	reverse() {
		return Key.withNamespaces(this.list().slice().reverse());
	}
	/**
	* Returns the `namespaces` making up this Key.
	*
	* @returns {Array<string>}
	*/
	namespaces() {
		return this.list();
	}
	/** Returns the "base" namespace of this key.
	*
	* @returns {string}
	*
	* @example
	* ```js
	* new Key('/Comedy/MontyPython/Actor:JohnCleese').baseNamespace()
	* // => 'Actor:JohnCleese'
	* ```
	*/
	baseNamespace() {
		const ns = this.namespaces();
		return ns[ns.length - 1];
	}
	/**
	* Returns the `list` representation of this key.
	*
	* @returns {Array<string>}
	*
	* @example
	* ```js
	* new Key('/Comedy/MontyPython/Actor:JohnCleese').list()
	* // => ['Comedy', 'MontyPythong', 'Actor:JohnCleese']
	* ```
	*/
	list() {
		return this.toString().split(pathSepS).slice(1);
	}
	/**
	* Returns the "type" of this key (value of last namespace).
	*
	* @returns {string}
	*
	* @example
	* ```js
	* new Key('/Comedy/MontyPython/Actor:JohnCleese').type()
	* // => 'Actor'
	* ```
	*/
	type() {
		return namespaceType(this.baseNamespace());
	}
	/**
	* Returns the "name" of this key (field of last namespace).
	*
	* @returns {string}
	*
	* @example
	* ```js
	* new Key('/Comedy/MontyPython/Actor:JohnCleese').name()
	* // => 'JohnCleese'
	* ```
	*/
	name() {
		return namespaceValue(this.baseNamespace());
	}
	/**
	* Returns an "instance" of this type key (appends value to namespace).
	*
	* @param {string} s - The string to append.
	* @returns {Key}
	*
	* @example
	* ```js
	* new Key('/Comedy/MontyPython/Actor').instance('JohnClesse')
	* // => Key('/Comedy/MontyPython/Actor:JohnCleese')
	* ```
	*/
	instance(s) {
		return new Key(this.toString() + ":" + s);
	}
	/**
	* Returns the "path" of this key (parent + type).
	*
	* @returns {Key}
	*
	* @example
	* ```js
	* new Key('/Comedy/MontyPython/Actor:JohnCleese').path()
	* // => Key('/Comedy/MontyPython/Actor')
	* ```
	*/
	path() {
		let p = this.parent().toString();
		if (!p.endsWith(pathSepS)) p += pathSepS;
		p += this.type();
		return new Key(p);
	}
	/**
	* Returns the `parent` Key of this Key.
	*
	* @returns {Key}
	*
	* @example
	* ```js
	* new Key("/Comedy/MontyPython/Actor:JohnCleese").parent()
	* // => Key("/Comedy/MontyPython")
	* ```
	*/
	parent() {
		const list = this.list();
		if (list.length === 1) return new Key(pathSepS);
		return new Key(list.slice(0, -1).join(pathSepS));
	}
	/**
	* Returns the `child` Key of this Key.
	*
	* @param {Key} key - The child Key to add
	* @returns {Key}
	*
	* @example
	* ```js
	* new Key('/Comedy/MontyPython').child(new Key('Actor:JohnCleese'))
	* // => Key('/Comedy/MontyPython/Actor:JohnCleese')
	* ```
	*/
	child(key) {
		if (this.toString() === pathSepS) return key;
		else if (key.toString() === pathSepS) return this;
		return new Key(this.toString() + key.toString(), false);
	}
	/**
	* Returns whether this key is a prefix of `other`
	*
	* @param {Key} other - The other key to test against
	* @returns {boolean}
	*
	* @example
	* ```js
	* new Key('/Comedy').isAncestorOf('/Comedy/MontyPython')
	* // => true
	* ```
	*/
	isAncestorOf(other) {
		if (other.toString() === this.toString()) return false;
		return other.toString().startsWith(this.toString());
	}
	/**
	* Returns whether this key is a contains another as prefix.
	*
	* @param {Key} other - The other Key to test against
	* @returns {boolean}
	*
	* @example
	* ```js
	* new Key('/Comedy/MontyPython').isDecendantOf('/Comedy')
	* // => true
	* ```
	*/
	isDecendantOf(other) {
		if (other.toString() === this.toString()) return false;
		return this.toString().startsWith(other.toString());
	}
	/**
	* Checks if this key has only one namespace.
	*
	* @returns {boolean}
	*/
	isTopLevel() {
		return this.list().length === 1;
	}
	/**
	* Concats one or more Keys into one new Key.
	*
	* @param {Array<Key>} keys - The array of keys to concatenate
	* @returns {Key}
	*/
	concat(...keys) {
		return Key.withNamespaces([...this.namespaces(), ...flatten(keys.map((key) => key.namespaces()))]);
	}
};
/**
* The first component of a namespace. `foo` in `foo:bar`
*
* @param {string} ns
* @returns {string}
*/
function namespaceType(ns) {
	const parts = ns.split(":");
	if (parts.length < 2) return "";
	return parts.slice(0, -1).join(":");
}
/**
* The last component of a namespace, `baz` in `foo:bar:baz`.
*
* @param {string} ns
* @returns {string}
*/
function namespaceValue(ns) {
	const parts = ns.split(":");
	return parts[parts.length - 1];
}
/**
* Flatten array of arrays (only one level)
*
* @template T
* @param {Array<any>} arr
* @returns {T[]}
*/
function flatten(arr) {
	return [].concat(...arr);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/block.js
function readonly({ enumerable = true, configurable = false } = {}) {
	return {
		enumerable,
		configurable,
		writable: false
	};
}
function* linksWithin(path, value) {
	if (value != null && typeof value === "object") {
		if (Array.isArray(value)) for (const [index, element] of value.entries()) {
			const elementPath = [...path, index];
			const cid = CID.asCID(element);
			if (cid != null) yield [elementPath.join("/"), cid];
			else if (typeof element === "object") yield* links(element, elementPath);
		}
		else {
			const cid = CID.asCID(value);
			if (cid != null) yield [path.join("/"), cid];
			else yield* links(value, path);
		}
	}
}
function* links(source, base) {
	if (source == null || source instanceof Uint8Array) return;
	const cid = CID.asCID(source);
	if (cid != null) yield [base.join("/"), cid];
	for (const [key, value] of Object.entries(source)) yield* linksWithin([...base, key], value);
}
function* treeWithin(path, value) {
	if (Array.isArray(value)) for (const [index, element] of value.entries()) {
		const elementPath = [...path, index];
		yield elementPath.join("/");
		if (typeof element === "object" && CID.asCID(element) == null) yield* tree(element, elementPath);
	}
	else yield* tree(value, path);
}
function* tree(source, base) {
	if (source == null || typeof source !== "object") return;
	for (const [key, value] of Object.entries(source)) {
		const path = [...base, key];
		yield path.join("/");
		if (value != null && !(value instanceof Uint8Array) && typeof value === "object" && CID.asCID(value) == null) yield* treeWithin(path, value);
	}
}
function get(source, path) {
	let node = source;
	for (const [index, key] of path.entries()) {
		node = node[key];
		if (node == null) throw new Error(`Object has no property at ${path.slice(0, index + 1).map((part) => `[${JSON.stringify(part)}]`).join("")}`);
		const cid = CID.asCID(node);
		if (cid != null) return {
			value: cid,
			remaining: path.slice(index + 1).join("/")
		};
	}
	return { value: node };
}
/**
* @template T - Logical type of the data encoded in the block
* @template C - multicodec code corresponding to codec used to encode the block
* @template A - multicodec code corresponding to the hashing algorithm used in CID creation.
* @template V - CID version
*/
var Block = class {
	cid;
	bytes;
	value;
	asBlock;
	constructor({ cid, bytes, value }) {
		if (cid == null || bytes == null || typeof value === "undefined") throw new Error("Missing required argument");
		this.cid = cid;
		this.bytes = bytes;
		this.value = value;
		this.asBlock = this;
		Object.defineProperties(this, {
			cid: readonly(),
			bytes: readonly(),
			value: readonly(),
			asBlock: readonly()
		});
	}
	links() {
		return links(this.value, []);
	}
	tree() {
		return tree(this.value, []);
	}
	get(path = "/") {
		return get(this.value, path.split("/").filter(Boolean));
	}
};
/**
* @template T - Logical type of the data encoded in the block
* @template Code - multicodec code corresponding to codec used to encode the block
* @template Alg - multicodec code corresponding to the hashing algorithm used in CID creation.
* @template V - CID version
*/
function createUnsafe({ bytes, cid, value: maybeValue, codec }) {
	const value = maybeValue !== void 0 ? maybeValue : codec?.decode(bytes);
	if (value === void 0) throw new Error("Missing required argument, must either provide \"value\" or \"codec\"");
	return new Block({
		cid,
		bytes,
		value
	});
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/utils/dist/src/pins.js
var DATASTORE_PIN_PREFIX = "/pin/";
var DATASTORE_BLOCK_PREFIX = "/pinned-block/";
var DATASTORE_ENCODING = base36;
var DAG_WALK_QUEUE_CONCURRENCY = 1;
function toDSKey(cid) {
	if (cid.version === 0) cid = cid.toV1();
	return new Key(`${DATASTORE_PIN_PREFIX}${cid.toString(DATASTORE_ENCODING)}`);
}
var PinsImpl = class {
	datastore;
	blockstore;
	getCodec;
	constructor(datastore, blockstore, getCodec) {
		this.datastore = datastore;
		this.blockstore = blockstore;
		this.getCodec = getCodec;
	}
	async *add(cid, options = {}) {
		const pinKey = toDSKey(cid);
		if (await this.datastore.has(pinKey)) throw new Error("Already pinned");
		const depth = Math.round(options.depth ?? Infinity);
		if (depth < 0) throw new Error("Depth must be greater than or equal to 0");
		const queue = new Queue({ concurrency: DAG_WALK_QUEUE_CONCURRENCY });
		for await (const childCid of this.#walkDag(cid, queue, {
			...options,
			depth
		})) {
			await this.#updatePinnedBlock(childCid, (pinnedBlock) => {
				if (pinnedBlock.pinnedBy.find((c) => equals(c, cid.bytes)) != null) return false;
				pinnedBlock.pinCount++;
				pinnedBlock.pinnedBy.push(cid.bytes);
				return true;
			}, options);
			yield childCid;
		}
		const pin = {
			depth,
			metadata: options.metadata ?? {}
		};
		await this.datastore.put(pinKey, encode$9(pin), options);
	}
	/**
	* Walk a DAG in an iterable fashion
	*/
	async *#walkDag(cid, queue, options) {
		if (options.depth === -1) return;
		const codec = await this.getCodec(cid.code);
		const block = createUnsafe({
			bytes: await this.blockstore.get(cid, options),
			cid,
			codec
		});
		yield cid;
		for await (const [, cid] of block.links()) yield* await queue.add(async () => {
			return this.#walkDag(cid, queue, {
				...options,
				depth: options.depth - 1
			});
		});
	}
	/**
	* Update the pin count for the CID
	*/
	async #updatePinnedBlock(cid, withPinnedBlock, options) {
		const blockKey = new Key(`${DATASTORE_BLOCK_PREFIX}${DATASTORE_ENCODING.encode(cid.multihash.bytes)}`);
		let pinnedBlock = {
			pinCount: 0,
			pinnedBy: []
		};
		try {
			pinnedBlock = decode$9(await this.datastore.get(blockKey, options));
		} catch (err) {
			if (err.name !== "NotFoundError") throw err;
		}
		if (!withPinnedBlock(pinnedBlock)) return;
		if (pinnedBlock.pinCount === 0) {
			if (await this.datastore.has(blockKey)) {
				await this.datastore.delete(blockKey);
				return;
			}
		}
		await this.datastore.put(blockKey, encode$9(pinnedBlock), options);
		options.onProgress?.(new CustomProgressEvent("helia:pin:add", cid));
	}
	async *rm(cid, options = {}) {
		const pinKey = toDSKey(cid);
		const buf = await this.datastore.get(pinKey, options);
		const pin = decode$9(buf);
		await this.datastore.delete(pinKey, options);
		const queue = new Queue({ concurrency: DAG_WALK_QUEUE_CONCURRENCY });
		for await (const childCid of this.#walkDag(cid, queue, {
			...options,
			depth: pin.depth
		})) {
			await this.#updatePinnedBlock(childCid, (pinnedBlock) => {
				pinnedBlock.pinCount--;
				pinnedBlock.pinnedBy = pinnedBlock.pinnedBy.filter((c) => equals(c, cid.bytes));
				return true;
			}, {
				...options,
				depth: pin.depth
			});
			yield childCid;
		}
	}
	async *ls(options = {}) {
		for await (const { key, value } of this.datastore.query({ prefix: DATASTORE_PIN_PREFIX + (options.cid != null ? `${options.cid.toString(base36)}` : "") }, options)) yield {
			cid: CID.parse(key.toString().substring(5), base36),
			...decode$9(value)
		};
	}
	async isPinned(cid, options = {}) {
		const blockKey = new Key(`${DATASTORE_BLOCK_PREFIX}${DATASTORE_ENCODING.encode(cid.multihash.bytes)}`);
		return this.datastore.has(blockKey, options);
	}
	async get(cid, options) {
		const pinKey = toDSKey(cid);
		const buf = await this.datastore.get(pinKey, options);
		return decode$9(buf);
	}
	async setMetadata(cid, metadata, options) {
		const pinKey = toDSKey(cid);
		const buf = await this.datastore.get(pinKey, options);
		const pin = decode$9(buf);
		pin.metadata = metadata ?? {};
		await this.datastore.put(pinKey, encode$9(pin), options);
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/interface/dist/src/errors.js
var InsufficientProvidersError = class extends Error {
	static name = "InsufficientProvidersError";
	constructor(message = "Insufficient providers found") {
		super(message);
		this.name = "InsufficientProvidersError";
	}
};
var NoRoutersAvailableError = class extends Error {
	static name = "NoRoutersAvailableError";
	constructor(message = "No routers available") {
		super(message);
		this.name = "NoRoutersAvailableError";
	}
};
var UnknownHashAlgorithmError = class extends Error {
	static name = "UnknownHashAlgorithmError";
	constructor(message = "Unknown hash algorithm") {
		super(message);
		this.name = "UnknownHashAlgorithmError";
	}
};
var UnknownCodecError = class extends Error {
	static name = "UnknownCodecError";
	constructor(message = "Unknown codec") {
		super(message);
		this.name = "UnknownCodecError";
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/utils/dist/src/routing.js
var DEFAULT_PROVIDER_LOOKUP_CONCURRENCY = 5;
var Routing = class {
	log;
	routers;
	providerLookupConcurrency;
	constructor(components, init) {
		this.log = components.logger.forComponent("helia:routing");
		this.routers = init.routers ?? [];
		this.providerLookupConcurrency = init.providerLookupConcurrency ?? DEFAULT_PROVIDER_LOOKUP_CONCURRENCY;
	}
	async start() {
		await start(...this.routers);
	}
	async stop() {
		await stop(...this.routers);
	}
	/**
	* Iterates over all content routers in parallel to find providers of the
	* given key
	*/
	async *findProviders(key, options = {}) {
		if (this.routers.length === 0) throw new NoRoutersAvailableError("No content routers available");
		const queue = new PeerQueue({ concurrency: this.providerLookupConcurrency });
		queue.addEventListener("error", () => {});
		for await (const peer of merge(queue.toGenerator(), ...supports(this.routers, "findProviders").map((router) => router.findProviders(key, options)))) {
			if (peer == null) continue;
			if (peer.multiaddrs.length === 0) {
				if (queue.find(peer.id) != null) continue;
				queue.add(async () => {
					try {
						const provider = await this.findPeer(peer.id, options);
						if (provider.multiaddrs.length === 0) return null;
						return provider;
					} catch (err) {
						this.log.error("could not load multiaddrs for peer %p", peer.id, err);
						return null;
					}
				}, {
					peerId: peer.id,
					signal: options.signal
				}).catch((err) => {
					this.log.error("could not load multiaddrs for peer %p", peer.id, err);
				});
			}
			yield peer;
		}
	}
	/**
	* Iterates over all content routers in parallel to notify it is
	* a provider of the given key
	*/
	async provide(key, options = {}) {
		if (this.routers.length === 0) throw new NoRoutersAvailableError("No content routers available");
		await Promise.all(supports(this.routers, "provide").map(async (router) => {
			await router.provide(key, options);
		}));
	}
	/**
	* Store the given key/value pair in the available content routings
	*/
	async put(key, value, options) {
		await Promise.all(supports(this.routers, "put").map(async (router) => {
			await router.put(key, value, options);
		}));
	}
	/**
	* Get the value to the given key.
	* Times out after 1 minute by default.
	*/
	async get(key, options) {
		return Promise.any(supports(this.routers, "get").map(async (router) => {
			return router.get(key, options);
		}));
	}
	/**
	* Iterates over all peer routers in parallel to find the given peer
	*/
	async findPeer(id, options) {
		if (this.routers.length === 0) throw new NoRoutersAvailableError("No peer routers available");
		const self = this;
		const source = merge(...supports(this.routers, "findPeer").map((router) => (async function* () {
			try {
				yield await router.findPeer(id, options);
			} catch (err) {
				self.log.error(err);
			}
		})()));
		for await (const peer of source) {
			if (peer == null) continue;
			return peer;
		}
		throw new NotFoundError$1("Could not find peer in routing");
	}
	/**
	* Attempt to find the closest peers on the network to the given key
	*/
	async *getClosestPeers(key, options = {}) {
		if (this.routers.length === 0) throw new NoRoutersAvailableError("No peer routers available");
		for await (const peer of merge(...supports(this.routers, "getClosestPeers").map((router) => router.getClosestPeers(key, options)))) {
			if (peer == null) continue;
			yield peer;
		}
	}
};
function supports(routers, key) {
	return routers.filter((router) => router[key] != null);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/observable-webworkers/dist/src/index.js
var events = {};
var observable = (worker) => {
	worker.addEventListener("message", (event) => {
		observable.dispatchEvent("message", worker, event);
	});
	if (worker.port != null) worker.port.addEventListener("message", (event) => {
		observable.dispatchEvent("message", worker, event);
	});
};
observable.addEventListener = (type, fn) => {
	if (events[type] == null) events[type] = [];
	events[type].push(fn);
};
observable.removeEventListener = (type, fn) => {
	if (events[type] == null) return;
	events[type] = events[type].filter((listener) => listener === fn);
};
observable.dispatchEvent = function(type, worker, event) {
	if (events[type] == null) return;
	events[type].forEach((fn) => fn(worker, event));
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/mortice/dist/src/constants.js
var WORKER_REQUEST_READ_LOCK = "lock:worker:request-read";
var WORKER_RELEASE_READ_LOCK = "lock:worker:release-read";
var MASTER_GRANT_READ_LOCK = "lock:master:grant-read";
var WORKER_REQUEST_WRITE_LOCK = "lock:worker:request-write";
var WORKER_RELEASE_WRITE_LOCK = "lock:worker:release-write";
var MASTER_GRANT_WRITE_LOCK = "lock:master:grant-write";
//#endregion
//#region vendor/ipld-explorer-components/node_modules/mortice/dist/src/utils.js
var nanoid = (size = 21) => {
	return Math.random().toString().substring(2);
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/mortice/dist/src/browser.js
var handleWorkerLockRequest = (emitter, masterEvent, requestType, releaseType, grantType) => {
	return (worker, event) => {
		if (event.data.type !== requestType) return;
		const requestEvent = {
			type: event.data.type,
			name: event.data.name,
			identifier: event.data.identifier
		};
		emitter.dispatchEvent(new MessageEvent(masterEvent, { data: {
			name: requestEvent.name,
			handler: async () => {
				worker.postMessage({
					type: grantType,
					name: requestEvent.name,
					identifier: requestEvent.identifier
				});
				await new Promise((resolve) => {
					const releaseEventListener = (event) => {
						if (event == null || event.data == null) return;
						const releaseEvent = {
							type: event.data.type,
							name: event.data.name,
							identifier: event.data.identifier
						};
						if (releaseEvent.type === releaseType && releaseEvent.identifier === requestEvent.identifier) {
							worker.removeEventListener("message", releaseEventListener);
							resolve();
						}
					};
					worker.addEventListener("message", releaseEventListener);
				});
			}
		} }));
	};
};
var makeWorkerLockRequest = (name, requestType, grantType, releaseType) => {
	return async () => {
		const id = nanoid();
		globalThis.postMessage({
			type: requestType,
			identifier: id,
			name
		});
		return new Promise((resolve) => {
			const listener = (event) => {
				if (event == null || event.data == null) return;
				const responseEvent = {
					type: event.data.type,
					identifier: event.data.identifier
				};
				if (responseEvent.type === grantType && responseEvent.identifier === id) {
					globalThis.removeEventListener("message", listener);
					resolve(() => {
						globalThis.postMessage({
							type: releaseType,
							identifier: id,
							name
						});
					});
				}
			};
			globalThis.addEventListener("message", listener);
		});
	};
};
var defaultOptions$1 = { singleProcess: false };
var browser_default = (options) => {
	options = Object.assign({}, defaultOptions$1, options);
	if (Boolean(globalThis.document) || options.singleProcess) {
		const emitter = new EventTarget();
		observable.addEventListener("message", handleWorkerLockRequest(emitter, "requestReadLock", WORKER_REQUEST_READ_LOCK, WORKER_RELEASE_READ_LOCK, MASTER_GRANT_READ_LOCK));
		observable.addEventListener("message", handleWorkerLockRequest(emitter, "requestWriteLock", WORKER_REQUEST_WRITE_LOCK, WORKER_RELEASE_WRITE_LOCK, MASTER_GRANT_WRITE_LOCK));
		return emitter;
	}
	return {
		isWorker: true,
		readLock: (name) => makeWorkerLockRequest(name, WORKER_REQUEST_READ_LOCK, MASTER_GRANT_READ_LOCK, WORKER_RELEASE_READ_LOCK),
		writeLock: (name) => makeWorkerLockRequest(name, WORKER_REQUEST_WRITE_LOCK, MASTER_GRANT_WRITE_LOCK, WORKER_RELEASE_WRITE_LOCK)
	};
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/mortice/dist/src/index.js
/**
* @packageDocumentation
*
* - Reads occur concurrently
* - Writes occur one at a time
* - No reads occur while a write operation is in progress
* - Locks can be created with different names
* - Reads/writes can time out
*
* ## Usage
*
* ```javascript
* import mortice from 'mortice'
* import delay from 'delay'
*
* // the lock name & options objects are both optional
* const mutex = mortice('my-lock', {
*
*   // how long before write locks time out (default: 24 hours)
*   timeout: 30000,
*
*    // control how many read operations are executed concurrently (default: Infinity)
*   concurrency: 5,
*
*   // by default the the lock will be held on the main thread, set this to true if the
*   // a lock should reside on each worker (default: false)
*   singleProcess: false
* })
*
* Promise.all([
*   (async () => {
*     const release = await mutex.readLock()
*
*     try {
*       console.info('read 1')
*     } finally {
*       release()
*     }
*   })(),
*   (async () => {
*     const release = await mutex.readLock()
*
*     try {
*       console.info('read 2')
*     } finally {
*       release()
*     }
*   })(),
*   (async () => {
*     const release = await mutex.writeLock()
*
*     try {
*       await delay(1000)
*
*       console.info('write 1')
*     } finally {
*       release()
*     }
*   })(),
*   (async () => {
*     const release = await mutex.readLock()
*
*     try {
*       console.info('read 3')
*     } finally {
*       release()
*     }
*   })()
* ])
* ```
*
*     read 1
*     read 2
*     <small pause>
*     write 1
*     read 3
*
* ## Browser
*
* Because there's no global way to evesdrop on messages sent by Web Workers, please pass all created Web Workers to the [`observable-webworkers`](https://npmjs.org/package/observable-webworkers) module:
*
* ```javascript
* // main.js
* import mortice from 'mortice'
* import observe from 'observable-webworkers'
*
* // create our lock on the main thread, it will be held here
* const mutex = mortice()
*
* const worker = new Worker('worker.js')
*
* observe(worker)
* ```
*
* ```javascript
* // worker.js
* import mortice from 'mortice'
* import delay from 'delay'
*
* const mutex = mortice()
*
* let release = await mutex.readLock()
* // read something
* release()
*
* release = await mutex.writeLock()
* // write something
* release()
* ```
*/
var mutexes = {};
var implementation;
async function createReleaseable(queue, options) {
	let res;
	const p = new Promise((resolve) => {
		res = resolve;
	});
	queue.add(async () => pTimeout((async () => {
		await new Promise((resolve) => {
			res(() => {
				resolve();
			});
		});
	})(), { milliseconds: options.timeout }));
	return p;
}
var createMutex = (name, options) => {
	if (implementation.isWorker === true) return {
		readLock: implementation.readLock(name, options),
		writeLock: implementation.writeLock(name, options)
	};
	const masterQueue = new PQueue({ concurrency: 1 });
	let readQueue;
	return {
		async readLock() {
			if (readQueue != null) return createReleaseable(readQueue, options);
			readQueue = new PQueue({
				concurrency: options.concurrency,
				autoStart: false
			});
			const localReadQueue = readQueue;
			const readPromise = createReleaseable(readQueue, options);
			masterQueue.add(async () => {
				localReadQueue.start();
				await localReadQueue.onIdle().then(() => {
					if (readQueue === localReadQueue) readQueue = null;
				});
			});
			return readPromise;
		},
		async writeLock() {
			readQueue = null;
			return createReleaseable(masterQueue, options);
		}
	};
};
var defaultOptions = {
	name: "lock",
	concurrency: Infinity,
	timeout: 846e5,
	singleProcess: false
};
function createMortice(options) {
	const opts = Object.assign({}, defaultOptions, options);
	if (implementation == null) {
		implementation = browser_default(opts);
		if (implementation.isWorker !== true) {
			implementation.addEventListener("requestReadLock", (event) => {
				if (mutexes[event.data.name] == null) return;
				mutexes[event.data.name].readLock().then(async (release) => event.data.handler().finally(() => {
					release();
				}));
			});
			implementation.addEventListener("requestWriteLock", async (event) => {
				if (mutexes[event.data.name] == null) return;
				mutexes[event.data.name].writeLock().then(async (release) => event.data.handler().finally(() => {
					release();
				}));
			});
		}
	}
	if (mutexes[opts.name] == null) mutexes[opts.name] = createMutex(opts.name, opts);
	return mutexes[opts.name];
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/utils/dist/src/storage.js
/**
* BlockStorage is a hybrid blockstore that puts/gets blocks from a configured
* blockstore (that may be on disk, s3, or something else). If the blocks are
* not present Bitswap will be used to fetch them from network peers.
*/
var BlockStorage = class {
	lock;
	child;
	pins;
	started;
	/**
	* Create a new BlockStorage
	*/
	constructor(blockstore, pins, options = {}) {
		this.child = blockstore;
		this.pins = pins;
		this.lock = createMortice({ singleProcess: options.holdGcLock });
		this.started = false;
	}
	isStarted() {
		return this.started;
	}
	async start() {
		await start(this.child);
		this.started = true;
	}
	async stop() {
		await stop(this.child);
		this.started = false;
	}
	unwrap() {
		return this.child;
	}
	/**
	* Put a block to the underlying datastore
	*/
	async put(cid, block, options = {}) {
		options?.signal?.throwIfAborted();
		const releaseLock = await this.lock.readLock();
		try {
			return await this.child.put(cid, block, options);
		} finally {
			releaseLock();
		}
	}
	/**
	* Put a multiple blocks to the underlying datastore
	*/
	async *putMany(blocks, options = {}) {
		options?.signal?.throwIfAborted();
		const releaseLock = await this.lock.readLock();
		try {
			yield* this.child.putMany(blocks, options);
		} finally {
			releaseLock();
		}
	}
	/**
	* Get a block by cid
	*/
	async get(cid, options = {}) {
		options?.signal?.throwIfAborted();
		const releaseLock = await this.lock.readLock();
		try {
			return await this.child.get(cid, options);
		} finally {
			releaseLock();
		}
	}
	/**
	* Get multiple blocks back from an (async) iterable of cids
	*/
	async *getMany(cids, options = {}) {
		options?.signal?.throwIfAborted();
		const releaseLock = await this.lock.readLock();
		try {
			yield* this.child.getMany(cids, options);
		} finally {
			releaseLock();
		}
	}
	/**
	* Delete a block from the blockstore
	*/
	async delete(cid, options = {}) {
		options?.signal?.throwIfAborted();
		const releaseLock = await this.lock.writeLock();
		try {
			if (await this.pins.isPinned(cid)) throw new Error("CID was pinned");
			await this.child.delete(cid, options);
		} finally {
			releaseLock();
		}
	}
	/**
	* Delete multiple blocks from the blockstore
	*/
	async *deleteMany(cids, options = {}) {
		options?.signal?.throwIfAborted();
		const releaseLock = await this.lock.writeLock();
		try {
			const storage = this;
			yield* this.child.deleteMany(async function* () {
				for await (const cid of cids) {
					if (await storage.pins.isPinned(cid)) throw new Error("CID was pinned");
					yield cid;
				}
			}(), options);
		} finally {
			releaseLock();
		}
	}
	async has(cid, options = {}) {
		options?.signal?.throwIfAborted();
		const releaseLock = await this.lock.readLock();
		try {
			return await this.child.has(cid, options);
		} finally {
			releaseLock();
		}
	}
	async *getAll(options = {}) {
		options?.signal?.throwIfAborted();
		const releaseLock = await this.lock.readLock();
		try {
			yield* this.child.getAll(options);
		} finally {
			releaseLock();
		}
	}
	createSession(root, options) {
		options?.signal?.throwIfAborted();
		return this.child.createSession(root, options);
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/utils/dist/src/utils/datastore-version.js
var DS_VERSION_KEY = new Key("/version");
var CURRENT_VERSION = 1;
async function assertDatastoreVersionIsCurrent(datastore) {
	if (!await datastore.has(DS_VERSION_KEY)) {
		await datastore.put(DS_VERSION_KEY, fromString(`${CURRENT_VERSION}`));
		return;
	}
	const str = toString$2(await datastore.get(DS_VERSION_KEY));
	if (parseInt(str, 10) !== CURRENT_VERSION) throw new Error("Unknown datastore version, a datastore migration may be required");
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/utils/dist/src/utils/is-promise.js
function isPromise$1(p) {
	return p?.then != null;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/utils/dist/src/utils/get-codec.js
function getCodec(initialCodecs = [], loadCodec) {
	const codecs = {
		[112]: src_exports,
		[85]: raw_exports,
		[113]: src_exports$2,
		[297]: src_exports$1,
		[512]: json_exports
	};
	initialCodecs.forEach((codec) => {
		codecs[codec.code] = codec;
	});
	return async (code) => {
		let codec = codecs[code];
		if (codec == null && loadCodec != null) {
			const res = loadCodec(code);
			if (isPromise$1(res)) codec = await res;
			else codec = res;
			codecs[codec.code] = codec;
		}
		if (codec != null) return codec;
		throw new UnknownCodecError(`Could not load codec for ${code}`);
	};
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/utils/dist/src/utils/get-hasher.js
function getHasher(initialHashers = [], loadHasher) {
	const hashers = {
		[sha256$1.code]: sha256$1,
		[sha512$1.code]: sha512$1,
		[identity.code]: identity
	};
	initialHashers.forEach((hasher) => {
		hashers[hasher.code] = hasher;
	});
	return async (code) => {
		let hasher = hashers[code];
		if (hasher == null && loadHasher != null) {
			const res = loadHasher(code);
			if (isPromise$1(res)) hasher = await res;
			else hasher = res;
			hashers[hasher.code] = hasher;
		}
		if (hasher != null) return hasher;
		throw new UnknownHashAlgorithmError(`No hasher configured for multihash code 0x${code.toString(16)}, please configure one. You can look up which hash this is at https://github.com/multiformats/multicodec/blob/master/table.csv`);
	};
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/interface-store/dist/src/errors.js
var NotFoundError = class NotFoundError extends Error {
	static name = "NotFoundError";
	static code = "ERR_NOT_FOUND";
	name = NotFoundError.name;
	code = NotFoundError.code;
	constructor(message = "Not Found") {
		super(message);
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/blockstore-core/dist/src/base.js
var BaseBlockstore = class {
	has(key, options) {
		return Promise.reject(/* @__PURE__ */ new Error(".has is not implemented"));
	}
	put(key, val, options) {
		return Promise.reject(/* @__PURE__ */ new Error(".put is not implemented"));
	}
	async *putMany(source, options) {
		for await (const { cid, block } of source) {
			await this.put(cid, block, options);
			yield cid;
		}
	}
	get(key, options) {
		return Promise.reject(/* @__PURE__ */ new Error(".get is not implemented"));
	}
	async *getMany(source, options) {
		for await (const key of source) yield {
			cid: key,
			block: await this.get(key, options)
		};
	}
	delete(key, options) {
		return Promise.reject(/* @__PURE__ */ new Error(".delete is not implemented"));
	}
	async *deleteMany(source, options) {
		for await (const key of source) {
			await this.delete(key, options);
			yield key;
		}
	}
	/**
	* Extending classes should override `query` or implement this method
	*/
	async *getAll(options) {
		throw new Error(".getAll is not implemented");
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/blockstore-core/dist/src/identity.js
var IDENTITY_CODEC$1 = 0;
var IdentityBlockstore = class extends BaseBlockstore {
	child;
	constructor(child) {
		super();
		this.child = child;
	}
	put(key, block) {
		if (key.multihash.code === IDENTITY_CODEC$1) return key;
		if (this.child == null) return key;
		return this.child.put(key, block);
	}
	get(key) {
		if (key.multihash.code === IDENTITY_CODEC$1) return key.multihash.digest;
		if (this.child == null) throw new NotFoundError();
		return this.child.get(key);
	}
	has(key) {
		if (key.multihash.code === IDENTITY_CODEC$1) return true;
		if (this.child == null) return false;
		return this.child.has(key);
	}
	delete(key) {
		if (key.code === IDENTITY_CODEC$1) return;
		if (this.child != null) return this.child.delete(key);
	}
	getAll(options) {
		if (this.child != null) return this.child.getAll(options);
		return [];
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/it-filter/dist/src/index.js
/**
* @packageDocumentation
*
* Filter values out of an (async)iterable
*
* @example
*
* ```javascript
* import all from 'it-all'
* import filter from 'it-filter'
*
* // This can also be an iterator, generator, etc
* const values = [0, 1, 2, 3, 4]
*
* const fn = (val, index) => val > 2 // Return boolean to keep item
*
* const arr = all(filter(values, fn))
*
* console.info(arr) // 3, 4
* ```
*
* Async sources and filter functions must be awaited:
*
* ```javascript
* import all from 'it-all'
* import filter from 'it-filter'
*
* const values = async function * () {
*   yield * [0, 1, 2, 3, 4]
* }
*
* const fn = async val => (val, index) > 2 // Return boolean or promise of boolean to keep item
*
* const arr = await all(filter(values, fn))
*
* console.info(arr) // 3, 4
* ```
*/
function isAsyncIterable$4(thing) {
	return thing[Symbol.asyncIterator] != null;
}
function filter(source, fn) {
	let index = 0;
	if (isAsyncIterable$4(source)) return (async function* () {
		for await (const entry of source) if (await fn(entry, index++)) yield entry;
	})();
	const peekable$2 = peekable(source);
	const { value, done } = peekable$2.next();
	if (done === true) return function* () {}();
	const res = fn(value, index++);
	if (typeof res.then === "function") return (async function* () {
		if (await res) yield value;
		for await (const entry of peekable$2) if (await fn(entry, index++)) yield entry;
	})();
	const func = fn;
	return (function* () {
		if (res === true) yield value;
		for (const entry of peekable$2) if (func(entry, index++)) yield entry;
	})();
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/it-foreach/dist/src/index.js
/**
* @packageDocumentation
*
* Calls a function for each value in an (async)iterable.
*
* The function can be sync or async.
*
* Async functions can be awaited on so may slow down processing of the (async)iterable.
*
* @example
*
* ```javascript
* import each from 'it-foreach'
* import drain from 'it-drain'
*
* // This can also be an iterator, generator, etc
* const values = [0, 1, 2, 3, 4]
*
* // prints [0, 0], [1, 1], [2, 2], [3, 3], [4, 4]
* const arr = drain(
*   each(values, console.info)
* )
* ```
*
* Async sources and callbacks must be awaited:
*
* ```javascript
* import each from 'it-foreach'
* import drain from 'it-drain'
*
* const values = async function * () {
*   yield * [0, 1, 2, 3, 4]
* }
*
* // prints [0, 0], [1, 1], [2, 2], [3, 3], [4, 4]
* const arr = await drain(
*   each(values(), console.info)
* )
* ```
*/
function isAsyncIterable$3(thing) {
	return thing[Symbol.asyncIterator] != null;
}
function isPromise(thing) {
	return thing?.then != null;
}
function forEach(source, fn) {
	let index = 0;
	if (isAsyncIterable$3(source)) return (async function* () {
		for await (const val of source) {
			const res = fn(val, index++);
			if (isPromise(res)) await res;
			yield val;
		}
	})();
	const peekable$1 = peekable(source);
	const { value, done } = peekable$1.next();
	if (done === true) return function* () {}();
	if (typeof fn(value, index++)?.then === "function") return (async function* () {
		yield value;
		for await (const val of peekable$1) {
			const res = fn(val, index++);
			if (isPromise(res)) await res;
			yield val;
		}
	})();
	const func = fn;
	return (function* () {
		yield value;
		for (const val of peekable$1) {
			func(val, index++);
			yield val;
		}
	})();
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/utils/dist/src/utils/networked-storage.js
var Storage = class {
	child;
	getHasher;
	log;
	logger;
	components;
	/**
	* Create a new BlockStorage
	*/
	constructor(components) {
		this.log = components.logger.forComponent("helia:networked-storage");
		this.logger = components.logger;
		this.components = components;
		this.child = new IdentityBlockstore(components.blockstore);
		this.getHasher = components.getHasher;
	}
	/**
	* Put a block to the underlying datastore
	*/
	async put(cid, block, options = {}) {
		if (await this.child.has(cid, options)) {
			options.onProgress?.(new CustomProgressEvent("blocks:put:duplicate", cid));
			return cid;
		}
		options.onProgress?.(new CustomProgressEvent("blocks:put:providers:notify", cid));
		await Promise.all(this.components.blockBrokers.map(async (broker) => broker.announce?.(cid, block, options)));
		options.onProgress?.(new CustomProgressEvent("blocks:put:blockstore:put", cid));
		return this.child.put(cid, block, options);
	}
	/**
	* Put a multiple blocks to the underlying datastore
	*/
	async *putMany(blocks, options = {}) {
		const notifyEach = forEach(filter(blocks, async ({ cid }) => {
			const has = await this.child.has(cid, options);
			if (has) options.onProgress?.(new CustomProgressEvent("blocks:put-many:duplicate", cid));
			return !has;
		}), async ({ cid, block }) => {
			options.onProgress?.(new CustomProgressEvent("blocks:put-many:providers:notify", cid));
			await Promise.all(this.components.blockBrokers.map(async (broker) => broker.announce?.(cid, block, options)));
		});
		options.onProgress?.(new CustomProgressEvent("blocks:put-many:blockstore:put-many"));
		yield* this.child.putMany(notifyEach, options);
	}
	/**
	* Get a block by cid
	*/
	async get(cid, options = {}) {
		if (options.offline !== true && !await this.child.has(cid, options)) {
			const hasher = await this.getHasher(cid.multihash.code);
			options.onProgress?.(new CustomProgressEvent("blocks:get:providers:get", cid));
			const block = await raceBlockRetrievers(cid, this.components.blockBrokers, hasher, {
				...options,
				log: this.log
			});
			options.onProgress?.(new CustomProgressEvent("blocks:get:blockstore:put", cid));
			await this.child.put(cid, block, options);
			options.onProgress?.(new CustomProgressEvent("blocks:get:providers:notify", cid));
			await Promise.all(this.components.blockBrokers.map(async (broker) => broker.announce?.(cid, block, options)));
			return block;
		}
		options.onProgress?.(new CustomProgressEvent("blocks:get:blockstore:get", cid));
		return this.child.get(cid, options);
	}
	/**
	* Get multiple blocks back from an (async) iterable of cids
	*/
	async *getMany(cids, options = {}) {
		options.onProgress?.(new CustomProgressEvent("blocks:get-many:blockstore:get-many"));
		yield* this.child.getMany(forEach(cids, async (cid) => {
			if (options.offline !== true && !await this.child.has(cid, options)) {
				const hasher = await this.getHasher(cid.multihash.code);
				options.onProgress?.(new CustomProgressEvent("blocks:get-many:providers:get", cid));
				const block = await raceBlockRetrievers(cid, this.components.blockBrokers, hasher, {
					...options,
					log: this.log
				});
				options.onProgress?.(new CustomProgressEvent("blocks:get-many:blockstore:put", cid));
				await this.child.put(cid, block, options);
				options.onProgress?.(new CustomProgressEvent("blocks:get-many:providers:notify", cid));
				await Promise.all(this.components.blockBrokers.map(async (broker) => broker.announce?.(cid, block, options)));
			}
		}));
	}
	/**
	* Delete a block from the blockstore
	*/
	async delete(cid, options = {}) {
		options.onProgress?.(new CustomProgressEvent("blocks:delete:blockstore:delete", cid));
		await this.child.delete(cid, options);
	}
	/**
	* Delete multiple blocks from the blockstore
	*/
	async *deleteMany(cids, options = {}) {
		options.onProgress?.(new CustomProgressEvent("blocks:delete-many:blockstore:delete-many"));
		yield* this.child.deleteMany(async function* () {
			for await (const cid of cids) yield cid;
		}(), options);
	}
	async has(cid, options = {}) {
		return this.child.has(cid, options);
	}
	async *getAll(options = {}) {
		options.onProgress?.(new CustomProgressEvent("blocks:get-all:blockstore:get-many"));
		yield* this.child.getAll(options);
	}
};
/**
* Networked storage wraps a regular blockstore - when getting blocks if the
* blocks are not present, the configured BlockBrokers will be used to fetch them.
*/
var NetworkedStorage = class extends Storage {
	started;
	/**
	* Create a new BlockStorage
	*/
	constructor(components) {
		super(components);
		this.started = false;
	}
	isStarted() {
		return this.started;
	}
	async start() {
		await start(this.child, ...this.components.blockBrokers);
		this.started = true;
	}
	async stop() {
		await stop(this.child, ...this.components.blockBrokers);
		this.started = false;
	}
	unwrap() {
		return this.child;
	}
	createSession(root, options) {
		const blockBrokers = this.components.blockBrokers.map((broker) => {
			if (broker.createSession == null) return broker;
			return broker.createSession(options);
		});
		return new SessionStorage({
			blockstore: this.child,
			blockBrokers,
			getHasher: this.getHasher,
			logger: this.logger
		}, { root });
	}
};
/**
* Storage subclass that can cancel any ongoing operation at any point.
*/
var SessionStorage = class extends Storage {
	closeController;
	constructor(components, init) {
		super(components);
		this.closeController = new AbortController();
		setMaxListeners(Infinity, this.closeController.signal);
		this.log = components.logger.forComponent(`helia:session-storage:${init.root}`);
	}
	close() {
		this.closeController.abort();
	}
	/**
	* Put a block to the underlying datastore
	*/
	async put(cid, block, options = {}) {
		const signal = anySignal([this.closeController.signal, options.signal]);
		setMaxListeners(Infinity, signal);
		try {
			return await super.put(cid, block, {
				...options,
				signal
			});
		} finally {
			signal.clear();
		}
	}
	/**
	* Put a multiple blocks to the underlying datastore
	*/
	async *putMany(blocks, options = {}) {
		const signal = anySignal([this.closeController.signal, options.signal]);
		setMaxListeners(Infinity, signal);
		try {
			yield* super.putMany(blocks, {
				...options,
				signal
			});
		} finally {
			signal.clear();
		}
	}
	/**
	* Get a block by cid
	*/
	async get(cid, options = {}) {
		const signal = anySignal([this.closeController.signal, options.signal]);
		setMaxListeners(Infinity, signal);
		try {
			return await super.get(cid, {
				...options,
				signal
			});
		} finally {
			signal.clear();
		}
	}
	/**
	* Get multiple blocks back from an (async) iterable of cids
	*/
	async *getMany(cids, options = {}) {
		const signal = anySignal([this.closeController.signal, options.signal]);
		setMaxListeners(Infinity, signal);
		try {
			yield* super.getMany(cids, {
				...options,
				signal
			});
		} finally {
			signal.clear();
		}
	}
	/**
	* Delete a block from the blockstore
	*/
	async delete(cid, options = {}) {
		const signal = anySignal([this.closeController.signal, options.signal]);
		setMaxListeners(Infinity, signal);
		try {
			await super.delete(cid, {
				...options,
				signal
			});
		} finally {
			signal.clear();
		}
	}
	/**
	* Delete multiple blocks from the blockstore
	*/
	async *deleteMany(cids, options = {}) {
		const signal = anySignal([this.closeController.signal, options.signal]);
		setMaxListeners(Infinity, signal);
		try {
			yield* super.deleteMany(cids, {
				...options,
				signal
			});
		} finally {
			signal.clear();
		}
	}
	async has(cid, options = {}) {
		const signal = anySignal([this.closeController.signal, options.signal]);
		setMaxListeners(Infinity, signal);
		try {
			return await super.has(cid, {
				...options,
				signal
			});
		} finally {
			signal.clear();
		}
	}
	async *getAll(options = {}) {
		const signal = anySignal([this.closeController.signal, options.signal]);
		setMaxListeners(Infinity, signal);
		try {
			yield* super.getAll({
				...options,
				signal
			});
		} finally {
			signal.clear();
		}
	}
};
function isRetrievingBlockBroker(broker) {
	return typeof broker.retrieve === "function";
}
var getCidBlockVerifierFunction = (cid, hasher) => {
	if (hasher == null) throw new InvalidParametersError(`No hasher configured for multihash code 0x${cid.multihash.code.toString(16)}, please configure one. You can look up which hash this is at https://github.com/multiformats/multicodec/blob/master/table.csv`);
	return async (block) => {
		let hash;
		const res = hasher.digest(block);
		if (isPromise$1(res)) hash = await res;
		else hash = res;
		if (!equals(hash.digest, cid.multihash.digest)) throw new InvalidMultihashError("Hash of downloaded block did not match multihash from passed CID");
	};
};
/**
* Race block providers cancelling any pending requests once the block has been
* found.
*/
async function raceBlockRetrievers(cid, blockBrokers, hasher, options) {
	const validateFn = getCidBlockVerifierFunction(cid, hasher);
	const controller = new AbortController();
	const signal = anySignal([controller.signal, options.signal]);
	setMaxListeners(Infinity, controller.signal, signal);
	const retrievers = [];
	for (const broker of blockBrokers) if (isRetrievingBlockBroker(broker)) retrievers.push(broker);
	try {
		return await Promise.any(retrievers.map(async (retriever) => {
			try {
				let blocksWereValidated = false;
				const block = await retriever.retrieve(cid, {
					...options,
					signal,
					validateFn: async (block) => {
						await validateFn(block);
						blocksWereValidated = true;
					}
				});
				if (!blocksWereValidated) await validateFn(block);
				return block;
			} catch (err) {
				options.log.error("could not retrieve verified block for %c", cid, err);
				throw err;
			}
		}));
	} finally {
		controller.abort();
		signal.clear();
	}
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/utils/dist/src/bloom-filter.js
var import_murmurhash3js_revisited = /* @__PURE__ */ __toESM(require_murmurhash3js_revisited(), 1);
var LN2_SQUARED = Math.LN2 * Math.LN2;
var BloomFilter = class BloomFilter {
	/**
	* Create a `BloomFilter` with the smallest `bits` and `hashes` value for the
	* specified item count and error rate.
	*/
	static create(itemcount, errorRate = .005) {
		const opts = optimize(itemcount, errorRate);
		return new BloomFilter(opts);
	}
	seeds;
	bits;
	buffer;
	constructor(options = {}) {
		if (options.seeds != null) this.seeds = options.seeds;
		else this.seeds = generateSeeds(options.hashes ?? 8);
		this.bits = options.bits ?? 1024;
		this.buffer = alloc$1(Math.ceil(this.bits / 8));
	}
	/**
	* Add an item to the filter
	*/
	add(item) {
		if (typeof item === "string") item = fromString(item);
		for (let i = 0; i < this.seeds.length; i++) {
			const bit = import_murmurhash3js_revisited.default.x86.hash32(item, this.seeds[i]) % this.bits;
			this.setbit(bit);
		}
	}
	/**
	* Test if the filter has an item. If it returns false it definitely does not
	* have the item. If it returns true, it probably has the item but there's
	* an `errorRate` chance it doesn't.
	*/
	has(item) {
		if (typeof item === "string") item = fromString(item);
		for (let i = 0; i < this.seeds.length; i++) {
			const bit = import_murmurhash3js_revisited.default.x86.hash32(item, this.seeds[i]) % this.bits;
			if (!this.getbit(bit)) return false;
		}
		return true;
	}
	/**
	* Reset the filter
	*/
	clear() {
		this.buffer.fill(0);
	}
	setbit(bit) {
		let pos = 0;
		let shift = bit;
		while (shift > 7) {
			pos++;
			shift -= 8;
		}
		let bitfield = this.buffer[pos];
		bitfield |= 1 << shift;
		this.buffer[pos] = bitfield;
	}
	getbit(bit) {
		let pos = 0;
		let shift = bit;
		while (shift > 7) {
			pos++;
			shift -= 8;
		}
		return (this.buffer[pos] & 1 << shift) !== 0;
	}
};
function optimize(itemcount, errorRate = .005) {
	const bits = Math.round(-1 * itemcount * Math.log(errorRate) / LN2_SQUARED);
	return {
		bits,
		hashes: Math.round(bits / itemcount * Math.LN2)
	};
}
function generateSeeds(count) {
	let buf;
	let j;
	const seeds = [];
	for (let i = 0; i < count; i++) {
		buf = new Uint8ArrayList(randomBytes(4));
		seeds[i] = buf.getUint32(0, true);
		for (j = 0; j < i; j++) if (seeds[i] === seeds[j]) {
			i--;
			break;
		}
	}
	return seeds;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/utils/dist/src/abstract-session.js
var AbstractSession = class extends TypedEventEmitter {
	intialPeerSearchComplete;
	requests;
	name;
	log;
	logger;
	minProviders;
	maxProviders;
	providers;
	evictionFilter;
	constructor(components, init) {
		super();
		setMaxListeners(Infinity, this);
		this.name = init.name;
		this.logger = components.logger;
		this.log = components.logger.forComponent(this.name);
		this.requests = /* @__PURE__ */ new Map();
		this.minProviders = init.minProviders ?? 1;
		this.maxProviders = init.maxProviders ?? 5;
		this.providers = [];
		this.evictionFilter = BloomFilter.create(this.maxProviders);
	}
	async retrieve(cid, options = {}) {
		const cidStr = base64.encode(cid.multihash.bytes);
		const existingJob = this.requests.get(cidStr);
		if (existingJob != null) {
			this.log("join existing request for %c", cid);
			return existingJob;
		}
		const deferred = pDefer();
		this.requests.set(cidStr, deferred.promise);
		if (this.providers.length === 0) {
			let first = false;
			if (this.intialPeerSearchComplete == null) {
				first = true;
				this.log = this.logger.forComponent(`${this.name}:${cid}`);
				this.intialPeerSearchComplete = this.findProviders(cid, this.minProviders, options);
			}
			await this.intialPeerSearchComplete;
			if (first) this.log("found initial session peers for %c", cid);
		}
		let foundBlock = false;
		const queue = new Queue({ concurrency: this.maxProviders });
		queue.addEventListener("error", () => {});
		queue.addEventListener("failure", (evt) => {
			this.log.error("error querying provider %o, evicting from session", evt.detail.job.options.provider, evt.detail.error);
			this.evict(evt.detail.job.options.provider);
		});
		queue.addEventListener("success", (evt) => {
			foundBlock = true;
			deferred.resolve(evt.detail.result);
		});
		queue.addEventListener("idle", () => {
			if (foundBlock || options.signal?.aborted === true) return;
			Promise.resolve().then(async () => {
				this.log("no session peers had block for for %c, finding new providers", cid);
				for (let i = 0; i < this.minProviders; i++) {
					if (this.providers.length === 0) break;
					const provider = this.providers[Math.floor(Math.random() * this.providers.length)];
					this.evict(provider);
				}
				await this.findProviders(cid, this.minProviders, options);
				this.log("found new providers re-retrieving %c", cid);
				this.requests.delete(cidStr);
				deferred.resolve(await this.retrieve(cid, options));
			}).catch((err) => {
				this.log.error("could not find new providers for %c", cid, err);
				deferred.reject(err);
			});
		});
		const peerAddedToSessionListener = (event) => {
			queue.add(async () => {
				return this.queryProvider(cid, event.detail, options);
			}, { provider: event.detail }).catch((err) => {
				if (options.signal?.aborted === true) return;
				this.log.error("error retrieving session block for %c", cid, err);
			});
		};
		this.addEventListener("provider", peerAddedToSessionListener);
		Promise.all([...this.providers].map(async (provider) => {
			return queue.add(async () => {
				return this.queryProvider(cid, provider, options);
			}, { provider });
		})).catch((err) => {
			if (options.signal?.aborted === true) return;
			this.log.error("error retrieving session block for %c", cid, err);
		});
		try {
			return await deferred.promise;
		} finally {
			this.removeEventListener("provider", peerAddedToSessionListener);
			queue.clear();
			this.requests.delete(cidStr);
		}
	}
	evict(provider) {
		this.evictionFilter.add(this.toEvictionKey(provider));
		const index = this.providers.findIndex((prov) => this.equals(prov, provider));
		if (index === -1) return;
		this.providers.splice(index, 1);
	}
	isEvicted(provider) {
		return this.evictionFilter.has(this.toEvictionKey(provider));
	}
	hasProvider(provider) {
		if (this.providers.find((prov) => this.equals(prov, provider)) != null) return true;
		if (this.isEvicted(provider)) return true;
		return false;
	}
	async findProviders(cid, count, options) {
		const deferred = pDefer();
		let found = 0;
		Promise.resolve().then(async () => {
			this.log("finding %d-%d new provider(s) for %c", count, this.maxProviders, cid);
			for await (const provider of this.findNewProviders(cid, options)) {
				if (found === this.maxProviders || options.signal?.aborted === true) break;
				if (this.hasProvider(provider)) continue;
				this.log("found %d/%d new providers", found, this.maxProviders);
				this.providers.push(provider);
				this.safeDispatchEvent("provider", { detail: provider });
				found++;
				if (found === count) {
					this.log("session is ready");
					deferred.resolve();
				}
				if (this.providers.length === this.maxProviders) {
					this.log("found max session peers", found);
					break;
				}
			}
			this.log("found %d/%d new session peers", found, this.maxProviders);
			if (found < count) throw new InsufficientProvidersError(`Found ${found} of ${count} ${this.name} providers for ${cid}`);
		}).catch((err) => {
			this.log.error("error searching routing for potential session peers for %c", cid, err.errors ?? err);
			deferred.reject(err);
		});
		return deferred.promise;
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/utils/dist/src/index.js
/**
* @packageDocumentation
*
* Exports a `Helia` class that implements the Helia API.
*
* In general you should use the `helia` or `@helia/http` modules instead which
* pre-configure Helia for certain use-cases (p2p or pure-HTTP).
*
* @example
*
* ```typescript
* import { Helia } from '@helia/utils'
* import type { HeliaInit } from '@helia/utils'
*
* const node = new Helia({
*   // ...options
* } as HeliaInit)
* ```
*/
var Helia = class {
	blockstore;
	datastore;
	pins;
	logger;
	routing;
	getCodec;
	getHasher;
	dns;
	metrics;
	log;
	constructor(init) {
		this.logger = init.logger ?? defaultLogger();
		this.log = this.logger.forComponent("helia");
		this.getHasher = getHasher(init.hashers, init.loadHasher);
		this.getCodec = getCodec(init.codecs, init.loadCodec);
		this.dns = init.dns ?? dns();
		this.metrics = init.metrics;
		const components = {
			blockstore: init.blockstore,
			datastore: init.datastore,
			logger: this.logger,
			blockBrokers: [],
			getHasher: this.getHasher,
			getCodec: this.getCodec,
			dns: this.dns,
			metrics: this.metrics,
			...init.components ?? {}
		};
		this.routing = components.routing = new Routing(components, {
			routers: (init.routers ?? []).flatMap((router) => {
				const routers = [router];
				if (router[contentRoutingSymbol] != null) routers.push(router[contentRoutingSymbol]);
				if (router[peerRoutingSymbol] != null) routers.push(router[peerRoutingSymbol]);
				return routers;
			}),
			providerLookupConcurrency: init.providerLookupConcurrency
		});
		const networkedStorage = new NetworkedStorage(components);
		this.pins = new PinsImpl(init.datastore, networkedStorage, this.getCodec);
		this.blockstore = new BlockStorage(networkedStorage, this.pins, { holdGcLock: init.holdGcLock ?? true });
		this.datastore = init.datastore;
		components.blockBrokers = init.blockBrokers.map((fn) => {
			return fn(components);
		});
	}
	async start() {
		await assertDatastoreVersionIsCurrent(this.datastore);
		await start(this.blockstore, this.datastore, this.routing);
	}
	async stop() {
		await stop(this.blockstore, this.datastore, this.routing);
	}
	async gc(options = {}) {
		const releaseLock = await this.blockstore.lock.writeLock();
		try {
			const helia = this;
			const blockstore = this.blockstore.unwrap();
			this.log("gc start");
			await drain(blockstore.deleteMany(async function* () {
				for await (const { cid } of blockstore.getAll()) try {
					if (await helia.pins.isPinned(cid, options)) continue;
					yield cid;
					options.onProgress?.(new CustomProgressEvent("helia:gc:deleted", cid));
				} catch (err) {
					helia.log.error("Error during gc", err);
					options.onProgress?.(new CustomProgressEvent("helia:gc:error", err));
				}
			}()));
		} finally {
			releaseLock();
		}
		this.log("gc finished");
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@chainsafe/is-ip/lib/parser.js
var Parser = class {
	index = 0;
	input = "";
	new(input) {
		this.index = 0;
		this.input = input;
		return this;
	}
	/** Run a parser, and restore the pre-parse state if it fails. */
	readAtomically(fn) {
		const index = this.index;
		const result = fn();
		if (result === void 0) this.index = index;
		return result;
	}
	/** Run a parser, but fail if the entire input wasn't consumed. Doesn't run atomically. */
	parseWith(fn) {
		const result = fn();
		if (this.index !== this.input.length) return;
		return result;
	}
	/** Peek the next character from the input */
	peekChar() {
		if (this.index >= this.input.length) return;
		return this.input[this.index];
	}
	/** Read the next character from the input */
	readChar() {
		if (this.index >= this.input.length) return;
		return this.input[this.index++];
	}
	/** Read the next character from the input if it matches the target. */
	readGivenChar(target) {
		return this.readAtomically(() => {
			const char = this.readChar();
			if (char !== target) return;
			return char;
		});
	}
	/**
	* Helper for reading separators in an indexed loop. Reads the separator
	* character iff index > 0, then runs the parser. When used in a loop,
	* the separator character will only be read on index > 0 (see
	* readIPv4Addr for an example)
	*/
	readSeparator(sep, index, inner) {
		return this.readAtomically(() => {
			if (index > 0) {
				if (this.readGivenChar(sep) === void 0) return;
			}
			return inner();
		});
	}
	/**
	* Read a number off the front of the input in the given radix, stopping
	* at the first non-digit character or eof. Fails if the number has more
	* digits than max_digits or if there is no number.
	*/
	readNumber(radix, maxDigits, allowZeroPrefix, maxBytes) {
		return this.readAtomically(() => {
			let result = 0;
			let digitCount = 0;
			const leadingChar = this.peekChar();
			if (leadingChar === void 0) return;
			const hasLeadingZero = leadingChar === "0";
			const maxValue = 2 ** (8 * maxBytes) - 1;
			while (true) {
				const digit = this.readAtomically(() => {
					const char = this.readChar();
					if (char === void 0) return;
					const num = Number.parseInt(char, radix);
					if (Number.isNaN(num)) return;
					return num;
				});
				if (digit === void 0) break;
				result *= radix;
				result += digit;
				if (result > maxValue) return;
				digitCount += 1;
				if (maxDigits !== void 0) {
					if (digitCount > maxDigits) return;
				}
			}
			if (digitCount === 0) return;
			else if (!allowZeroPrefix && hasLeadingZero && digitCount > 1) return;
			else return result;
		});
	}
	/** Read an IPv4 address. */
	readIPv4Addr() {
		return this.readAtomically(() => {
			const out = /* @__PURE__ */ new Uint8Array(4);
			for (let i = 0; i < out.length; i++) {
				const ix = this.readSeparator(".", i, () => this.readNumber(10, 3, false, 1));
				if (ix === void 0) return;
				out[i] = ix;
			}
			return out;
		});
	}
	/** Read an IPv6 Address. */
	readIPv6Addr() {
		/**
		* Read a chunk of an IPv6 address into `groups`. Returns the number
		* of groups read, along with a bool indicating if an embedded
		* trailing IPv4 address was read. Specifically, read a series of
		* colon-separated IPv6 groups (0x0000 - 0xFFFF), with an optional
		* trailing embedded IPv4 address.
		*/
		const readGroups = (groups) => {
			for (let i = 0; i < groups.length / 2; i++) {
				const ix = i * 2;
				if (i < groups.length - 3) {
					const ipv4 = this.readSeparator(":", i, () => this.readIPv4Addr());
					if (ipv4 !== void 0) {
						groups[ix] = ipv4[0];
						groups[ix + 1] = ipv4[1];
						groups[ix + 2] = ipv4[2];
						groups[ix + 3] = ipv4[3];
						return [ix + 4, true];
					}
				}
				const group = this.readSeparator(":", i, () => this.readNumber(16, 4, true, 2));
				if (group === void 0) return [ix, false];
				groups[ix] = group >> 8;
				groups[ix + 1] = group & 255;
			}
			return [groups.length, false];
		};
		return this.readAtomically(() => {
			const head = /* @__PURE__ */ new Uint8Array(16);
			const [headSize, headIp4] = readGroups(head);
			if (headSize === 16) return head;
			if (headIp4) return;
			if (this.readGivenChar(":") === void 0) return;
			if (this.readGivenChar(":") === void 0) return;
			const tail = /* @__PURE__ */ new Uint8Array(14);
			const limit = 16 - (headSize + 2);
			const [tailSize] = readGroups(tail.subarray(0, limit));
			head.set(tail.subarray(0, tailSize), 16 - tailSize);
			return head;
		});
	}
	/** Read an IP Address, either IPv4 or IPv6. */
	readIPAddr() {
		return this.readIPv4Addr() ?? this.readIPv6Addr();
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@chainsafe/is-ip/lib/parse.js
var MAX_IPV6_LENGTH = 45;
var MAX_IPV4_LENGTH = 15;
var parser = new Parser();
/** Parse `input` into IPv4 bytes. */
function parseIPv4(input) {
	if (input.length > MAX_IPV4_LENGTH) return;
	return parser.new(input).parseWith(() => parser.readIPv4Addr());
}
/** Parse `input` into IPv6 bytes. */
function parseIPv6(input) {
	if (input.includes("%")) input = input.split("%")[0];
	if (input.length > MAX_IPV6_LENGTH) return;
	return parser.new(input).parseWith(() => parser.readIPv6Addr());
}
/** Parse `input` into IPv4 or IPv6 bytes. */
function parseIP(input) {
	if (input.includes("%")) input = input.split("%")[0];
	if (input.length > MAX_IPV6_LENGTH) return;
	return parser.new(input).parseWith(() => parser.readIPAddr());
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@chainsafe/is-ip/lib/is-ip.js
/** Check if `input` is IPv4. */
function isIPv4$1(input) {
	return Boolean(parseIPv4(input));
}
/** Check if `input` is IPv6. */
function isIPv6$1(input) {
	return Boolean(parseIPv6(input));
}
/** Check if `input` is IPv4 or IPv6. */
function isIP(input) {
	return Boolean(parseIP(input));
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@libp2p/utils/dist/src/private-ip.js
var import_netmask = (/* @__PURE__ */ __commonJSMin(((exports, module, this$1) => {
	(function() {
		var Netmask, atob, chr, chr0, chrA, chra, ip2long, long2ip = function(long) {
			return [
				(long & 255 << 24) >>> 24,
				(long & 255 << 16) >>> 16,
				(long & 65280) >>> 8,
				long & 255
			].join(".");
		};
		ip2long = function(ip) {
			var b = [], c, i = j = 0, j, n, ref;
			for (; j <= 3; i = ++j) {
				if (ip.length === 0) break;
				if (i > 0) {
					if (ip[0] !== ".") throw new Error("Invalid IP");
					ip = ip.substring(1);
				}
				ref = atob(ip), n = ref[0], c = ref[1];
				ip = ip.substring(c);
				b.push(n);
			}
			if (ip.length !== 0) throw new Error("Invalid IP");
			switch (b.length) {
				case 1:
					if (b[0] > 4294967295) throw new Error("Invalid IP");
					return b[0] >>> 0;
				case 2:
					if (b[0] > 255 || b[1] > 16777215) throw new Error("Invalid IP");
					return (b[0] << 24 | b[1]) >>> 0;
				case 3:
					if (b[0] > 255 || b[1] > 255 || b[2] > 65535) throw new Error("Invalid IP");
					return (b[0] << 24 | b[1] << 16 | b[2]) >>> 0;
				case 4:
					if (b[0] > 255 || b[1] > 255 || b[2] > 255 || b[3] > 255) throw new Error("Invalid IP");
					return (b[0] << 24 | b[1] << 16 | b[2] << 8 | b[3]) >>> 0;
				default: throw new Error("Invalid IP");
			}
		};
		chr = function(b) {
			return b.charCodeAt(0);
		};
		chr0 = chr("0");
		chra = chr("a");
		chrA = chr("A");
		atob = function(s) {
			var base, dmax, i, n = 0, start;
			base = 10;
			dmax = "9";
			i = 0;
			if (s.length > 1 && s[i] === "0") {
				if (s[i + 1] === "x" || s[i + 1] === "X") {
					i += 2;
					base = 16;
				} else if ("0" <= s[i + 1] && s[i + 1] <= "9") {
					i++;
					base = 8;
					dmax = "7";
				}
			}
			start = i;
			while (i < s.length) {
				if ("0" <= s[i] && s[i] <= dmax) n = n * base + (chr(s[i]) - chr0) >>> 0;
				else if (base === 16) {
					if ("a" <= s[i] && s[i] <= "f") n = n * base + (10 + chr(s[i]) - chra) >>> 0;
					else if ("A" <= s[i] && s[i] <= "F") n = n * base + (10 + chr(s[i]) - chrA) >>> 0;
					else break;
				} else break;
				if (n > 4294967295) throw new Error("too large");
				i++;
			}
			if (i === start) throw new Error("empty octet");
			return [n, i];
		};
		Netmask = (function() {
			function Netmask(net, mask) {
				var i, j, ref;
				if (typeof net !== "string") throw new Error("Missing `net' parameter");
				if (!mask) ref = net.split("/", 2), net = ref[0], mask = ref[1];
				if (!mask) mask = 32;
				if (typeof mask === "string" && mask.indexOf(".") > -1) {
					try {
						this.maskLong = ip2long(mask);
					} catch (error1) {
						throw new Error("Invalid mask: " + mask);
					}
					for (i = j = 32; j >= 0; i = --j) if (this.maskLong === 4294967295 << 32 - i >>> 0) {
						this.bitmask = i;
						break;
					}
				} else if (mask || mask === 0) {
					this.bitmask = parseInt(mask, 10);
					this.maskLong = 0;
					if (this.bitmask > 0) this.maskLong = 4294967295 << 32 - this.bitmask >>> 0;
				} else throw new Error("Invalid mask: empty");
				try {
					this.netLong = (ip2long(net) & this.maskLong) >>> 0;
				} catch (error1) {
					throw new Error("Invalid net address: " + net);
				}
				if (!(this.bitmask <= 32)) throw new Error("Invalid mask for ip4: " + mask);
				this.size = Math.pow(2, 32 - this.bitmask);
				this.base = long2ip(this.netLong);
				this.mask = long2ip(this.maskLong);
				this.hostmask = long2ip(~this.maskLong);
				this.first = this.bitmask <= 30 ? long2ip(this.netLong + 1) : this.base;
				this.last = this.bitmask <= 30 ? long2ip(this.netLong + this.size - 2) : long2ip(this.netLong + this.size - 1);
				this.broadcast = this.bitmask <= 30 ? long2ip(this.netLong + this.size - 1) : void 0;
			}
			Netmask.prototype.contains = function(ip) {
				if (typeof ip === "string" && (ip.indexOf("/") > 0 || ip.split(".").length !== 4)) ip = new Netmask(ip);
				if (ip instanceof Netmask) return this.contains(ip.base) && this.contains(ip.broadcast || ip.last);
				else return (ip2long(ip) & this.maskLong) >>> 0 === (this.netLong & this.maskLong) >>> 0;
			};
			Netmask.prototype.next = function(count) {
				if (count == null) count = 1;
				return new Netmask(long2ip(this.netLong + this.size * count), this.mask);
			};
			Netmask.prototype.forEach = function(fn) {
				var index, lastLong, long = ip2long(this.first);
				lastLong = ip2long(this.last);
				index = 0;
				while (long <= lastLong) {
					fn(long2ip(long), long, index);
					index++;
					long++;
				}
			};
			Netmask.prototype.toString = function() {
				return this.base + "/" + this.bitmask;
			};
			return Netmask;
		})();
		exports.ip2long = ip2long;
		exports.long2ip = long2ip;
		exports.Netmask = Netmask;
	}).call(this$1);
})))();
var NETMASK_RANGES = [
	"0.0.0.0/8",
	"10.0.0.0/8",
	"100.64.0.0/10",
	"127.0.0.0/8",
	"169.254.0.0/16",
	"172.16.0.0/12",
	"192.0.0.0/24",
	"192.0.0.0/29",
	"192.0.0.8/32",
	"192.0.0.9/32",
	"192.0.0.10/32",
	"192.0.0.170/32",
	"192.0.0.171/32",
	"192.0.2.0/24",
	"192.31.196.0/24",
	"192.52.193.0/24",
	"192.88.99.0/24",
	"192.168.0.0/16",
	"192.175.48.0/24",
	"198.18.0.0/15",
	"198.51.100.0/24",
	"203.0.113.0/24",
	"240.0.0.0/4",
	"255.255.255.255/32"
].map((ipRange) => new import_netmask.Netmask(ipRange));
function ipv4Check(ipAddr) {
	for (const r of NETMASK_RANGES) if (r.contains(ipAddr)) return true;
	return false;
}
function isIpv4MappedIpv6(ipAddr) {
	return /^::ffff:([0-9a-fA-F]{1,4}):([0-9a-fA-F]{1,4})$/.test(ipAddr);
}
/**
* @see https://datatracker.ietf.org/doc/html/rfc4291#section-2.5.5.2
*/
function ipv4MappedIpv6Check(ipAddr) {
	const parts = ipAddr.split(":");
	if (parts.length < 2) return false;
	const octet34 = parts[parts.length - 1].padStart(4, "0");
	const octet12 = parts[parts.length - 2].padStart(4, "0");
	return ipv4Check(`${parseInt(octet12.substring(0, 2), 16)}.${parseInt(octet12.substring(2), 16)}.${parseInt(octet34.substring(0, 2), 16)}.${parseInt(octet34.substring(2), 16)}`);
}
/**
* @see https://datatracker.ietf.org/doc/html/rfc4291#section-2.2 example 3
*/
function isIpv4EmbeddedIpv6(ipAddr) {
	return /^::ffff:([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/.test(ipAddr);
}
function ipv4EmbeddedIpv6Check(ipAddr) {
	const parts = ipAddr.split(":");
	const ip4 = parts[parts.length - 1];
	return ipv4Check(ip4);
}
function ipv6Check(ipAddr) {
	return /^::$/.test(ipAddr) || /^::1$/.test(ipAddr) || /^64:ff9b::([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/.test(ipAddr) || /^100::([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.test(ipAddr) || /^2001::([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.test(ipAddr) || /^2001:2[0-9a-fA-F]:([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.test(ipAddr) || /^2001:db8:([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.test(ipAddr) || /^2002:([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.test(ipAddr) || /^f[c-d]([0-9a-fA-F]{2,2}):/i.test(ipAddr) || /^fe[8-9a-bA-B][0-9a-fA-F]:/i.test(ipAddr) || /^ff([0-9a-fA-F]{2,2}):/i.test(ipAddr);
}
function isPrivateIp(ip) {
	if (isIPv4$1(ip)) return ipv4Check(ip);
	else if (isIpv4MappedIpv6(ip)) return ipv4MappedIpv6Check(ip);
	else if (isIpv4EmbeddedIpv6(ip)) return ipv4EmbeddedIpv6Check(ip);
	else if (isIPv6$1(ip)) return ipv6Check(ip);
	else return void 0;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@multiformats/multiaddr-matcher/dist/src/utils.js
/**
* Split a multiaddr into path components
*/
var toParts = (ma) => {
	return ma.toString().split("/").slice(1);
};
var func = (fn) => {
	return {
		match: (vals) => {
			if (vals.length < 1) return false;
			if (fn(vals[0])) return vals.slice(1);
			return false;
		},
		pattern: "fn"
	};
};
var literal = (str) => {
	return {
		match: (vals) => func((val) => val === str).match(vals),
		pattern: str
	};
};
var string = () => {
	return {
		match: (vals) => func((val) => typeof val === "string").match(vals),
		pattern: "{string}"
	};
};
var number = () => {
	return {
		match: (vals) => func((val) => !isNaN(parseInt(val))).match(vals),
		pattern: "{number}"
	};
};
var peerId = () => {
	return {
		match: (vals) => {
			if (vals.length < 2) return false;
			if (vals[0] !== "p2p" && vals[0] !== "ipfs") return false;
			if (vals[1].startsWith("Q") || vals[1].startsWith("1")) try {
				base58btc.decode(`z${vals[1]}`);
			} catch (err) {
				return false;
			}
			else return false;
			return vals.slice(2);
		},
		pattern: "/p2p/{peerid}"
	};
};
var certhash = () => {
	return {
		match: (vals) => {
			if (vals.length < 2) return false;
			if (vals[0] !== "certhash") return false;
			try {
				base64url.decode(vals[1]);
			} catch {
				return false;
			}
			return vals.slice(2);
		},
		pattern: "/certhash/{certhash}"
	};
};
var optional = (matcher) => {
	return {
		match: (vals) => {
			const result = matcher.match(vals);
			if (result === false) return vals;
			return result;
		},
		pattern: `optional(${matcher.pattern})`
	};
};
var or = (...matchers) => {
	return {
		match: (vals) => {
			let matches;
			for (const matcher of matchers) {
				const result = matcher.match(vals);
				if (result === false) continue;
				if (matches == null || result.length < matches.length) matches = result;
			}
			if (matches == null) return false;
			return matches;
		},
		pattern: `or(${matchers.map((m) => m.pattern).join(", ")})`
	};
};
var and = (...matchers) => {
	return {
		match: (vals) => {
			for (const matcher of matchers) {
				const result = matcher.match(vals);
				if (result === false) return false;
				vals = result;
			}
			return vals;
		},
		pattern: `and(${matchers.map((m) => m.pattern).join(", ")})`
	};
};
function fmt(...matchers) {
	function match(ma) {
		let parts = toParts(ma);
		for (const matcher of matchers) {
			const result = matcher.match(parts);
			if (result === false) return false;
			parts = result;
		}
		return parts;
	}
	function matches(ma) {
		return match(ma) !== false;
	}
	function exactMatch(ma) {
		const result = match(ma);
		if (result === false) return false;
		return result.length === 0;
	}
	return {
		matchers,
		matches,
		exactMatch
	};
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@multiformats/multiaddr-matcher/dist/src/index.js
/**
* @packageDocumentation
*
* This module exports various matchers that can be used to infer the type of a
* passed multiaddr.
*
* @example
*
* ```ts
* import { multiaddr } from '@multiformats/multiaddr'
* import { DNS } from '@multiformats/multiaddr-matcher'
*
* const ma = multiaddr('/dnsaddr/example.org')
*
* DNS.matches(ma) // true - this is a multiaddr with a DNS address at the start
* ```
*
* @example
*
* The default matching behaviour ignores any subsequent tuples in the multiaddr.
* If you want stricter matching you can use `.exactMatch`:
*
* ```ts
* import { multiaddr } from '@multiformats/multiaddr'
* import { DNS, Circuit } from '@multiformats/multiaddr-matcher'
*
* const ma = multiaddr('/dnsaddr/example.org/p2p/QmFoo/p2p-circuit/p2p/QmBar')
*
* DNS.exactMatch(ma) // false - this address has extra tuples after the DNS component
* Circuit.matches(ma) // true
* Circuit.exactMatch(ma) // true - the extra tuples are circuit relay related
* ```
*/
/**
* DNS matchers
*/
var _DNS4 = and(literal("dns4"), string());
var _DNS6 = and(literal("dns6"), string());
var _DNSADDR = and(literal("dnsaddr"), string());
var _DNS = and(literal("dns"), string());
optional(peerId());
optional(peerId());
optional(peerId());
/**
* Matches any dns address.
*
* @example
*
* ```ts
* import { multiaddr } from '@multiformats/multiaddr'
* import { DNS } from '@multiformats/multiaddr-matcher'
*
* DNS.matches(multiaddr('/dnsaddr/example.org')) // true
* DNS.matches(multiaddr('/dns4/example.org')) // true
* DNS.matches(multiaddr('/dns6/example.org')) // true
* DNS.matches(multiaddr('/dns6/example.org/p2p/Qmfoo')) // true
* ```
*/
var DNS = fmt(or(_DNS, _DNSADDR, _DNS4, _DNS6), optional(peerId()));
var _IP = or(and(literal("ip4"), func(isIPv4$1)), and(literal("ip6"), func(isIPv6$1)));
var _IP_OR_DOMAIN = or(_IP, _DNS, _DNS4, _DNS6, _DNSADDR);
or(_IP, and(or(_DNS, _DNSADDR, _DNS4, _DNS6), optional(peerId())));
var _TCP = and(_IP_OR_DOMAIN, literal("tcp"), number());
var _UDP = and(_IP_OR_DOMAIN, literal("udp"), number());
and(_TCP, optional(peerId()));
var _QUIC = and(_UDP, literal("quic"));
var _QUICV1 = and(_UDP, literal("quic-v1"));
var QUIC_V0_OR_V1 = or(_QUIC, _QUICV1);
var _WEB = or(_IP_OR_DOMAIN, _TCP, _UDP, _QUIC, _QUICV1);
var _WebSockets = or(and(_WEB, literal("ws"), optional(peerId())));
var _WebSocketsSecure = or(and(_WEB, literal("wss"), optional(peerId())), and(_WEB, literal("tls"), literal("ws"), optional(peerId())));
var _WebRTCDirect = and(_UDP, literal("webrtc-direct"), optional(certhash()), optional(certhash()), optional(peerId()));
var _WebTransport = and(_QUICV1, literal("webtransport"), optional(certhash()), optional(certhash()), optional(peerId()));
var _P2P = or(_WebSockets, _WebSocketsSecure, and(_TCP, optional(peerId())), and(QUIC_V0_OR_V1, optional(peerId())), and(_IP_OR_DOMAIN, optional(peerId())), _WebRTCDirect, _WebTransport, peerId());
and(_P2P, literal("p2p-circuit"), peerId());
or(and(_P2P, literal("p2p-circuit"), literal("webrtc"), optional(peerId())), and(_P2P, literal("webrtc"), optional(peerId())), literal("webrtc"));
/**
* Matches HTTP addresses
*
* @example
*
* ```ts
* import { multiaddr } from '@multiformats/multiaddr'
* import { HTTP } from '@multiformats/multiaddr-matcher'
*
* HTTP.matches(multiaddr('/dns/example.org/http')) // true
* ```
*/
var HTTP = fmt(or(and(_IP_OR_DOMAIN, literal("tcp"), number(), literal("http"), optional(peerId())), and(_IP_OR_DOMAIN, literal("http"), optional(peerId()))));
/**
* Matches HTTPS addresses
*
* @example
*
* ```ts
* import { multiaddr } from '@multiformats/multiaddr'
* import { HTTP } from '@multiformats/multiaddr-matcher'
*
* HTTP.matches(multiaddr('/dns/example.org/tls/http')) // true
* ```
*/
var HTTPS = fmt(or(and(_IP_OR_DOMAIN, literal("tcp"), or(and(literal("443"), literal("http")), and(number(), literal("https"))), optional(peerId())), and(_IP_OR_DOMAIN, literal("tls"), literal("http"), optional(peerId())), and(_IP_OR_DOMAIN, literal("https"), optional(peerId()))));
new Uint8Array([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	255,
	255
]);
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@multiformats/multiaddr/dist/src/ip.js
var isV4 = isIPv4$1;
var isV6 = isIPv6$1;
var toBytes = function(ip) {
	let offset = 0;
	ip = ip.toString().trim();
	if (isV4(ip)) {
		const bytes = new Uint8Array(offset + 4);
		ip.split(/\./g).forEach((byte) => {
			bytes[offset++] = parseInt(byte, 10) & 255;
		});
		return bytes;
	}
	if (isV6(ip)) {
		const sections = ip.split(":", 8);
		let i = 0;
		for (; i < sections.length; i++) {
			const isv4 = isV4(sections[i]);
			let v4Buffer;
			if (isv4) {
				v4Buffer = toBytes(sections[i]);
				sections[i] = toString$2(v4Buffer.slice(0, 2), "base16");
			}
			if (v4Buffer != null && ++i < 8) sections.splice(i, 0, toString$2(v4Buffer.slice(2, 4), "base16"));
		}
		if (sections[0] === "") while (sections.length < 8) sections.unshift("0");
		else if (sections[sections.length - 1] === "") while (sections.length < 8) sections.push("0");
		else if (sections.length < 8) {
			for (i = 0; i < sections.length && sections[i] !== ""; i++);
			const argv = [i, 1];
			for (i = 9 - sections.length; i > 0; i--) argv.push("0");
			sections.splice.apply(sections, argv);
		}
		const bytes = new Uint8Array(offset + 16);
		for (i = 0; i < sections.length; i++) {
			const word = parseInt(sections[i], 16);
			bytes[offset++] = word >> 8 & 255;
			bytes[offset++] = word & 255;
		}
		return bytes;
	}
	throw new Error("invalid ip address");
};
var toString$1 = function(buf, offset = 0, length) {
	offset = ~~offset;
	length = length ?? buf.length - offset;
	const view = new DataView(buf.buffer);
	if (length === 4) {
		const result = [];
		for (let i = 0; i < length; i++) result.push(buf[offset + i]);
		return result.join(".");
	}
	if (length === 16) {
		const result = [];
		for (let i = 0; i < length; i += 2) result.push(view.getUint16(offset + i).toString(16));
		return result.join(":").replace(/(^|:)0(:0)*:0(:|$)/, "$1::$3").replace(/:{3,4}/, "::");
	}
	return "";
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@multiformats/multiaddr/dist/src/protocols-table.js
var V = -1;
var names = {};
var codes = {};
[
	[
		4,
		32,
		"ip4"
	],
	[
		6,
		16,
		"tcp"
	],
	[
		33,
		16,
		"dccp"
	],
	[
		41,
		128,
		"ip6"
	],
	[
		42,
		V,
		"ip6zone"
	],
	[
		43,
		8,
		"ipcidr"
	],
	[
		53,
		V,
		"dns",
		true
	],
	[
		54,
		V,
		"dns4",
		true
	],
	[
		55,
		V,
		"dns6",
		true
	],
	[
		56,
		V,
		"dnsaddr",
		true
	],
	[
		132,
		16,
		"sctp"
	],
	[
		273,
		16,
		"udp"
	],
	[
		275,
		0,
		"p2p-webrtc-star"
	],
	[
		276,
		0,
		"p2p-webrtc-direct"
	],
	[
		277,
		0,
		"p2p-stardust"
	],
	[
		280,
		0,
		"webrtc-direct"
	],
	[
		281,
		0,
		"webrtc"
	],
	[
		290,
		0,
		"p2p-circuit"
	],
	[
		301,
		0,
		"udt"
	],
	[
		302,
		0,
		"utp"
	],
	[
		400,
		V,
		"unix",
		false,
		true
	],
	[
		421,
		V,
		"ipfs"
	],
	[
		421,
		V,
		"p2p"
	],
	[
		443,
		0,
		"https"
	],
	[
		444,
		96,
		"onion"
	],
	[
		445,
		296,
		"onion3"
	],
	[
		446,
		V,
		"garlic64"
	],
	[
		448,
		0,
		"tls"
	],
	[
		449,
		V,
		"sni"
	],
	[
		460,
		0,
		"quic"
	],
	[
		461,
		0,
		"quic-v1"
	],
	[
		465,
		0,
		"webtransport"
	],
	[
		466,
		V,
		"certhash"
	],
	[
		477,
		0,
		"ws"
	],
	[
		478,
		0,
		"wss"
	],
	[
		479,
		0,
		"p2p-websocket-star"
	],
	[
		480,
		0,
		"http"
	],
	[
		481,
		V,
		"http-path"
	],
	[
		777,
		V,
		"memory"
	]
].forEach((row) => {
	const proto = createProtocol(...row);
	codes[proto.code] = proto;
	names[proto.name] = proto;
});
function createProtocol(code, size, name, resolvable, path) {
	return {
		code,
		size,
		name,
		resolvable: Boolean(resolvable),
		path: Boolean(path)
	};
}
/**
* For the passed proto string or number, return a {@link Protocol}
*
* @example
*
* ```js
* import { protocol } from '@multiformats/multiaddr'
*
* console.info(protocol(4))
* // { code: 4, size: 32, name: 'ip4', resolvable: false, path: false }
* ```
*/
function getProtocol(proto) {
	if (typeof proto === "number") {
		if (codes[proto] != null) return codes[proto];
		throw new Error(`no protocol with code: ${proto}`);
	} else if (typeof proto === "string") {
		if (names[proto] != null) return names[proto];
		throw new Error(`no protocol with name: ${proto}`);
	}
	throw new Error(`invalid protocol id type: ${typeof proto}`);
}
getProtocol("ip4");
getProtocol("ip6");
getProtocol("ipcidr");
/**
* Convert [code,Uint8Array] to string
*/
function convertToString(proto, buf) {
	switch (getProtocol(proto).code) {
		case 4:
		case 41: return bytes2ip(buf);
		case 42: return bytes2str(buf);
		case 6:
		case 273:
		case 33:
		case 132: return bytes2port(buf).toString();
		case 53:
		case 54:
		case 55:
		case 56:
		case 400:
		case 449:
		case 777: return bytes2str(buf);
		case 421: return bytes2mh(buf);
		case 444: return bytes2onion(buf);
		case 445: return bytes2onion(buf);
		case 466: return bytes2mb(buf);
		case 481: return globalThis.encodeURIComponent(bytes2str(buf));
		default: return toString$2(buf, "base16");
	}
}
function convertToBytes(proto, str) {
	switch (getProtocol(proto).code) {
		case 4: return ip2bytes(str);
		case 41: return ip2bytes(str);
		case 42: return str2bytes(str);
		case 6:
		case 273:
		case 33:
		case 132: return port2bytes(parseInt(str, 10));
		case 53:
		case 54:
		case 55:
		case 56:
		case 400:
		case 449:
		case 777: return str2bytes(str);
		case 421: return mh2bytes(str);
		case 444: return onion2bytes(str);
		case 445: return onion32bytes(str);
		case 466: return mb2bytes(str);
		case 481: return str2bytes(globalThis.decodeURIComponent(str));
		default: return fromString(str, "base16");
	}
}
var decoders = Object.values(bases).map((c) => c.decoder);
var anybaseDecoder = (function() {
	let acc = decoders[0].or(decoders[1]);
	decoders.slice(2).forEach((d) => acc = acc.or(d));
	return acc;
})();
function ip2bytes(ipString) {
	if (!isIP(ipString)) throw new Error("invalid ip address");
	return toBytes(ipString);
}
function bytes2ip(ipBuff) {
	const ipString = toString$1(ipBuff, 0, ipBuff.length);
	if (ipString == null) throw new Error("ipBuff is required");
	if (!isIP(ipString)) throw new Error("invalid ip address");
	return ipString;
}
function port2bytes(port) {
	const buf = /* @__PURE__ */ new ArrayBuffer(2);
	new DataView(buf).setUint16(0, port);
	return new Uint8Array(buf);
}
function bytes2port(buf) {
	return new DataView(buf.buffer).getUint16(buf.byteOffset);
}
function str2bytes(str) {
	const buf = fromString(str);
	const size = Uint8Array.from(encode(buf.length));
	return concat$1([size, buf], size.length + buf.length);
}
function bytes2str(buf) {
	const size = decode(buf);
	buf = buf.slice(encodingLength(size));
	if (buf.length !== size) throw new Error("inconsistent lengths");
	return toString$2(buf);
}
function mh2bytes(hash) {
	let mh;
	if (hash[0] === "Q" || hash[0] === "1") mh = decode$8(base58btc.decode(`z${hash}`)).bytes;
	else mh = CID.parse(hash).multihash.bytes;
	const size = Uint8Array.from(encode(mh.length));
	return concat$1([size, mh], size.length + mh.length);
}
function mb2bytes(mbstr) {
	const mb = anybaseDecoder.decode(mbstr);
	const size = Uint8Array.from(encode(mb.length));
	return concat$1([size, mb], size.length + mb.length);
}
function bytes2mb(buf) {
	const size = decode(buf);
	const hash = buf.slice(encodingLength(size));
	if (hash.length !== size) throw new Error("inconsistent lengths");
	return "u" + toString$2(hash, "base64url");
}
/**
* Converts bytes to bas58btc string
*/
function bytes2mh(buf) {
	const size = decode(buf);
	const address = buf.slice(encodingLength(size));
	if (address.length !== size) throw new Error("inconsistent lengths");
	return toString$2(address, "base58btc");
}
function onion2bytes(str) {
	const addr = str.split(":");
	if (addr.length !== 2) throw new Error(`failed to parse onion addr: ["'${addr.join("\", \"")}'"]' does not contain a port number`);
	if (addr[0].length !== 16) throw new Error(`failed to parse onion addr: ${addr[0]} not a Tor onion address.`);
	const buf = base32.decode("b" + addr[0]);
	const port = parseInt(addr[1], 10);
	if (port < 1 || port > 65536) throw new Error("Port number is not in range(1, 65536)");
	const portBuf = port2bytes(port);
	return concat$1([buf, portBuf], buf.length + portBuf.length);
}
function onion32bytes(str) {
	const addr = str.split(":");
	if (addr.length !== 2) throw new Error(`failed to parse onion addr: ["'${addr.join("\", \"")}'"]' does not contain a port number`);
	if (addr[0].length !== 56) throw new Error(`failed to parse onion addr: ${addr[0]} not a Tor onion3 address.`);
	const buf = base32.decode(`b${addr[0]}`);
	const port = parseInt(addr[1], 10);
	if (port < 1 || port > 65536) throw new Error("Port number is not in range(1, 65536)");
	const portBuf = port2bytes(port);
	return concat$1([buf, portBuf], buf.length + portBuf.length);
}
function bytes2onion(buf) {
	const addrBytes = buf.slice(0, buf.length - 2);
	const portBytes = buf.slice(buf.length - 2);
	return `${toString$2(addrBytes, "base32")}:${bytes2port(portBytes)}`;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@multiformats/multiaddr/dist/src/codec.js
function stringToMultiaddrParts(str) {
	str = cleanPath(str);
	const tuples = [];
	const stringTuples = [];
	let path = null;
	const parts = str.split("/").slice(1);
	if (parts.length === 1 && parts[0] === "") return {
		bytes: /* @__PURE__ */ new Uint8Array(),
		string: "/",
		tuples: [],
		stringTuples: [],
		path: null
	};
	for (let p = 0; p < parts.length; p++) {
		const part = parts[p];
		const proto = getProtocol(part);
		if (proto.size === 0) {
			tuples.push([proto.code]);
			stringTuples.push([proto.code]);
			continue;
		}
		p++;
		if (p >= parts.length) throw ParseError("invalid address: " + str);
		if (proto.path === true) {
			path = cleanPath(parts.slice(p).join("/"));
			tuples.push([proto.code, convertToBytes(proto.code, path)]);
			stringTuples.push([proto.code, path]);
			break;
		}
		const bytes = convertToBytes(proto.code, parts[p]);
		tuples.push([proto.code, bytes]);
		stringTuples.push([proto.code, convertToString(proto.code, bytes)]);
	}
	return {
		string: stringTuplesToString(stringTuples),
		bytes: tuplesToBytes(tuples),
		tuples,
		stringTuples,
		path
	};
}
function bytesToMultiaddrParts(bytes) {
	const tuples = [];
	const stringTuples = [];
	let path = null;
	let i = 0;
	while (i < bytes.length) {
		const code = decode(bytes, i);
		const n = encodingLength(code);
		const p = getProtocol(code);
		const size = sizeForAddr(p, bytes.slice(i + n));
		if (size === 0) {
			tuples.push([code]);
			stringTuples.push([code]);
			i += n;
			continue;
		}
		const addr = bytes.slice(i + n, i + n + size);
		i += size + n;
		if (i > bytes.length) throw ParseError("Invalid address Uint8Array: " + toString$2(bytes, "base16"));
		tuples.push([code, addr]);
		const stringAddr = convertToString(code, addr);
		stringTuples.push([code, stringAddr]);
		if (p.path === true) {
			path = stringAddr;
			break;
		}
	}
	return {
		bytes: Uint8Array.from(bytes),
		string: stringTuplesToString(stringTuples),
		tuples,
		stringTuples,
		path
	};
}
/**
* [[str name, str addr]... ] -> string
*/
function stringTuplesToString(tuples) {
	const parts = [];
	tuples.map((tup) => {
		const proto = getProtocol(tup[0]);
		parts.push(proto.name);
		if (tup.length > 1 && tup[1] != null) parts.push(tup[1]);
		return null;
	});
	return cleanPath(parts.join("/"));
}
/**
* [[int code, Uint8Array ]... ] -> Uint8Array
*/
function tuplesToBytes(tuples) {
	return concat$1(tuples.map((tup) => {
		const proto = getProtocol(tup[0]);
		let buf = Uint8Array.from(encode(proto.code));
		if (tup.length > 1 && tup[1] != null) buf = concat$1([buf, tup[1]]);
		return buf;
	}));
}
/**
* For the passed address, return the serialized size
*/
function sizeForAddr(p, addr) {
	if (p.size > 0) return p.size / 8;
	else if (p.size === 0) return 0;
	else {
		const size = decode(addr instanceof Uint8Array ? addr : Uint8Array.from(addr));
		return size + encodingLength(size);
	}
}
function cleanPath(str) {
	return "/" + str.trim().split("/").filter((a) => a).join("/");
}
function ParseError(str) {
	return /* @__PURE__ */ new Error("Error parsing address: " + str);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@multiformats/multiaddr/dist/src/multiaddr.js
/**
* @packageDocumentation
*
* An implementation of a Multiaddr in JavaScript
*
* @example
*
* ```js
* import { multiaddr } from '@multiformats/multiaddr'
*
* const ma = multiaddr('/ip4/127.0.0.1/tcp/1234')
* ```
*/
var inspect = Symbol.for("nodejs.util.inspect.custom");
var symbol = Symbol.for("@multiformats/js-multiaddr/multiaddr");
var DNS_CODES = [
	getProtocol("dns").code,
	getProtocol("dns4").code,
	getProtocol("dns6").code,
	getProtocol("dnsaddr").code
];
var NoAvailableResolverError = class extends Error {
	constructor(message = "No available resolver") {
		super(message);
		this.name = "NoAvailableResolverError";
	}
};
/**
* Creates a {@link Multiaddr} from a {@link MultiaddrInput}
*/
var Multiaddr = class Multiaddr {
	bytes;
	#string;
	#tuples;
	#stringTuples;
	#path;
	[symbol] = true;
	constructor(addr) {
		if (addr == null) addr = "";
		let parts;
		if (addr instanceof Uint8Array) parts = bytesToMultiaddrParts(addr);
		else if (typeof addr === "string") {
			if (addr.length > 0 && addr.charAt(0) !== "/") throw new Error(`multiaddr "${addr}" must start with a "/"`);
			parts = stringToMultiaddrParts(addr);
		} else if (isMultiaddr(addr)) parts = bytesToMultiaddrParts(addr.bytes);
		else throw new Error("addr must be a string, Buffer, or another Multiaddr");
		this.bytes = parts.bytes;
		this.#string = parts.string;
		this.#tuples = parts.tuples;
		this.#stringTuples = parts.stringTuples;
		this.#path = parts.path;
	}
	toString() {
		return this.#string;
	}
	toJSON() {
		return this.toString();
	}
	toOptions() {
		let family;
		let transport;
		let host;
		let port;
		let zone = "";
		const tcp = getProtocol("tcp");
		const udp = getProtocol("udp");
		const ip4 = getProtocol("ip4");
		const ip6 = getProtocol("ip6");
		const dns6 = getProtocol("dns6");
		const ip6zone = getProtocol("ip6zone");
		for (const [code, value] of this.stringTuples()) {
			if (code === ip6zone.code) zone = `%${value ?? ""}`;
			if (DNS_CODES.includes(code)) {
				transport = tcp.name;
				port = 443;
				host = `${value ?? ""}${zone}`;
				family = code === dns6.code ? 6 : 4;
			}
			if (code === tcp.code || code === udp.code) {
				transport = getProtocol(code).name;
				port = parseInt(value ?? "");
			}
			if (code === ip4.code || code === ip6.code) {
				transport = getProtocol(code).name;
				host = `${value ?? ""}${zone}`;
				family = code === ip6.code ? 6 : 4;
			}
		}
		if (family == null || transport == null || host == null || port == null) throw new Error("multiaddr must have a valid format: \"/{ip4, ip6, dns4, dns6, dnsaddr}/{address}/{tcp, udp}/{port}\".");
		return {
			family,
			host,
			transport,
			port
		};
	}
	protos() {
		return this.#tuples.map(([code]) => Object.assign({}, getProtocol(code)));
	}
	protoCodes() {
		return this.#tuples.map(([code]) => code);
	}
	protoNames() {
		return this.#tuples.map(([code]) => getProtocol(code).name);
	}
	tuples() {
		return this.#tuples;
	}
	stringTuples() {
		return this.#stringTuples;
	}
	encapsulate(addr) {
		addr = new Multiaddr(addr);
		return new Multiaddr(this.toString() + addr.toString());
	}
	decapsulate(addr) {
		const addrString = addr.toString();
		const s = this.toString();
		const i = s.lastIndexOf(addrString);
		if (i < 0) throw new Error(`Address ${this.toString()} does not contain subaddress: ${addr.toString()}`);
		return new Multiaddr(s.slice(0, i));
	}
	decapsulateCode(code) {
		const tuples = this.tuples();
		for (let i = tuples.length - 1; i >= 0; i--) if (tuples[i][0] === code) return new Multiaddr(tuplesToBytes(tuples.slice(0, i)));
		return this;
	}
	getPeerId() {
		try {
			let tuples = [];
			this.stringTuples().forEach(([code, name]) => {
				if (code === names.p2p.code) tuples.push([code, name]);
				if (code === names["p2p-circuit"].code) tuples = [];
			});
			const tuple = tuples.pop();
			if (tuple?.[1] != null) {
				const peerIdStr = tuple[1];
				if (peerIdStr[0] === "Q" || peerIdStr[0] === "1") return toString$2(base58btc.decode(`z${peerIdStr}`), "base58btc");
				return toString$2(CID.parse(peerIdStr).multihash.bytes, "base58btc");
			}
			return null;
		} catch (e) {
			return null;
		}
	}
	getPath() {
		return this.#path;
	}
	equals(addr) {
		return equals(this.bytes, addr.bytes);
	}
	async resolve(options) {
		const resolvableProto = this.protos().find((p) => p.resolvable);
		if (resolvableProto == null) return [this];
		const resolver = resolvers.get(resolvableProto.name);
		if (resolver == null) throw new NoAvailableResolverError(`no available resolver for ${resolvableProto.name}`);
		return (await resolver(this, options)).map((str) => multiaddr(str));
	}
	nodeAddress() {
		const options = this.toOptions();
		if (options.transport !== "tcp" && options.transport !== "udp") throw new Error(`multiaddr must have a valid format - no protocol with name: "${options.transport}". Must have a valid transport protocol: "{tcp, udp}"`);
		return {
			family: options.family,
			address: options.host,
			port: options.port
		};
	}
	isThinWaistAddress(addr) {
		const protos = (addr ?? this).protos();
		if (protos.length !== 2) return false;
		if (protos[0].code !== 4 && protos[0].code !== 41) return false;
		if (protos[1].code !== 6 && protos[1].code !== 273) return false;
		return true;
	}
	/**
	* Returns Multiaddr as a human-readable string
	* https://nodejs.org/api/util.html#utilinspectcustom
	*
	* @example
	* ```js
	* import { multiaddr } from '@multiformats/multiaddr'
	*
	* console.info(multiaddr('/ip4/127.0.0.1/tcp/4001'))
	* // 'Multiaddr(/ip4/127.0.0.1/tcp/4001)'
	* ```
	*/
	[inspect]() {
		return `Multiaddr(${this.#string})`;
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@multiformats/multiaddr/dist/src/index.js
/**
* @packageDocumentation
*
* A standard way to represent addresses that
*
* - support any standard network protocol
* - are self-describing
* - have a binary packed format
* - have a nice string representation
* - encapsulate well
*
* @example
*
* ```TypeScript
* import { multiaddr } from '@multiformats/multiaddr'
* const addr =  multiaddr("/ip4/127.0.0.1/udp/1234")
* // Multiaddr(/ip4/127.0.0.1/udp/1234)
*
* const addr = multiaddr("/ip4/127.0.0.1/udp/1234")
* // Multiaddr(/ip4/127.0.0.1/udp/1234)
*
* addr.bytes
* // <Uint8Array 04 7f 00 00 01 11 04 d2>
*
* addr.toString()
* // '/ip4/127.0.0.1/udp/1234'
*
* addr.protos()
* // [
* //   {code: 4, name: 'ip4', size: 32},
* //   {code: 273, name: 'udp', size: 16}
* // ]
*
* // gives you an object that is friendly with what Node.js core modules expect for addresses
* addr.nodeAddress()
* // {
* //   family: 4,
* //   port: 1234,
* //   address: "127.0.0.1"
* // }
*
* addr.encapsulate('/sctp/5678')
* // Multiaddr(/ip4/127.0.0.1/udp/1234/sctp/5678)
* ```
*
* ## Resolving DNSADDR addresses
*
* [DNSADDR](https://github.com/multiformats/multiaddr/blob/master/protocols/DNSADDR.md) is a spec that allows storing a TXT DNS record that contains a Multiaddr.
*
* To resolve DNSADDR addresses, call the `.resolve()` function the multiaddr, optionally passing a `DNS` resolver.
*
* DNSADDR addresses can resolve to multiple multiaddrs, since there is no limit to the number of TXT records that can be stored.
*
* @example Resolving DNSADDR Multiaddrs
*
* ```TypeScript
* import { multiaddr, resolvers } from '@multiformats/multiaddr'
* import { dnsaddr } from '@multiformats/multiaddr/resolvers'
*
* resolvers.set('dnsaddr', dnsaddr)
*
* const ma = multiaddr('/dnsaddr/bootstrap.libp2p.io')
*
* // resolve with a 5s timeout
* const resolved = await ma.resolve({
*   signal: AbortSignal.timeout(5000)
* })
*
* console.info(await ma.resolve(resolved)
* // [Multiaddr('/ip4/147.75...'), Multiaddr('/ip4/147.75...'), Multiaddr('/ip4/147.75...')...]
* ```
*
* @example Using a custom DNS resolver to resolve DNSADDR Multiaddrs
*
* See the docs for [@multiformats/dns](https://www.npmjs.com/package/@multiformats/dns) for a full breakdown of how to specify multiple resolvers or resolvers that can be used for specific TLDs.
*
* ```TypeScript
* import { multiaddr } from '@multiformats/multiaddr'
* import { dns } from '@multiformats/dns'
* import { dnsJsonOverHttps } from '@multiformats/dns/resolvers'
*
* const resolver = dns({
*   '.': dnsJsonOverHttps('https://cloudflare-dns.com/dns-query')
* })
*
* const ma = multiaddr('/dnsaddr/bootstrap.libp2p.io')
* const resolved = await ma.resolve({
*  dns: resolver
* })
*
* console.info(resolved)
* // [Multiaddr('/ip4/147.75...'), Multiaddr('/ip4/147.75...'), Multiaddr('/ip4/147.75...')...]
* ```
*/
/**
* All configured {@link Resolver}s
*/
var resolvers = /* @__PURE__ */ new Map();
/**
* Check if object is a {@link Multiaddr} instance
*
* @example
*
* ```js
* import { isMultiaddr, multiaddr } from '@multiformats/multiaddr'
*
* isMultiaddr(5)
* // false
* isMultiaddr(multiaddr('/ip4/127.0.0.1'))
* // true
* ```
*/
function isMultiaddr(value) {
	return Boolean(value?.[symbol]);
}
/**
* A function that takes a {@link MultiaddrInput} and returns a {@link Multiaddr}
*
* @example
* ```js
* import { multiaddr } from '@libp2p/multiaddr'
*
* multiaddr('/ip4/127.0.0.1/tcp/4001')
* // Multiaddr(/ip4/127.0.0.1/tcp/4001)
* ```
*
* @param {MultiaddrInput} [addr] - If String or Uint8Array, needs to adhere to the address format of a [multiaddr](https://github.com/multiformats/multiaddr#string-format)
*/
function multiaddr(addr) {
	return new Multiaddr(addr);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@multiformats/multiaddr-to-uri/dist/src/index.js
/**
* @packageDocumentation
*
* This module allows easy conversion of Multiaddrs to string URIs.
*
* @example Converting multiaddrs to string URIs
*
* ```js
* import { multiaddrToUri } from '@multiformats/multiaddr-to-uri'
*
* console.log(multiaddrToUri('/dnsaddr/protocol.ai/https'))
* // -> https://protocol.ai
*
* console.log(multiaddrToUri('/ip4/127.0.0.1/tcp/8080'))
* // -> http://127.0.0.1:8080
*
* console.log(multiaddrToUri('/ip4/127.0.0.1/tcp/8080', { assumeHttp: false }))
* // -> tcp://127.0.0.1:8080
* ```
*
* Note:
*
* - When `/tcp` is the last (terminating) protocol HTTP is assumed by default (implicit `assumeHttp: true`)
*   - this means produced URIs will start with `http://` instead of `tcp://`
*   - passing `{ assumeHttp: false }` disables this behavior
* - Might be lossy - e.g. a DNSv6 multiaddr
* - Can throw if the passed multiaddr:
*   - is not a valid multiaddr
*   - is not supported as a URI e.g. circuit
*/
var ASSUME_HTTP_CODES = [
	getProtocol("tcp").code,
	getProtocol("dns").code,
	getProtocol("dnsaddr").code,
	getProtocol("dns4").code,
	getProtocol("dns6").code
];
function extractSNI(ma) {
	let sniProtoCode;
	try {
		sniProtoCode = getProtocol("sni").code;
	} catch (e) {
		return null;
	}
	for (const [proto, value] of ma) if (proto === sniProtoCode && value !== void 0) return value;
	return null;
}
function hasTLS(ma) {
	return ma.some(([proto, _]) => proto === getProtocol("tls").code);
}
function interpretNext(headProtoCode, headProtoVal, restMa) {
	const interpreter = interpreters[getProtocol(headProtoCode).name];
	if (interpreter === void 0) throw new Error(`Can't interpret protocol ${getProtocol(headProtoCode).name}`);
	const restVal = interpreter(headProtoVal, restMa);
	if (headProtoCode === getProtocol("ip6").code) return `[${restVal}]`;
	return restVal;
}
var interpreters = {
	ip4: (value, restMa) => value,
	ip6: (value, restMa) => {
		if (restMa.length === 0) return value;
		return `[${value}]`;
	},
	tcp: (value, restMa) => {
		const tailProto = restMa.pop();
		if (tailProto === void 0) throw new Error("Unexpected end of multiaddr");
		return `tcp://${interpretNext(tailProto[0], tailProto[1] ?? "", restMa)}:${value}`;
	},
	udp: (value, restMa) => {
		const tailProto = restMa.pop();
		if (tailProto === void 0) throw new Error("Unexpected end of multiaddr");
		return `udp://${interpretNext(tailProto[0], tailProto[1] ?? "", restMa)}:${value}`;
	},
	dnsaddr: (value, restMa) => value,
	dns4: (value, restMa) => value,
	dns6: (value, restMa) => value,
	dns: (value, restMa) => value,
	ipfs: (value, restMa) => {
		const tailProto = restMa.pop();
		if (tailProto === void 0) throw new Error("Unexpected end of multiaddr");
		return `${interpretNext(tailProto[0], tailProto[1] ?? "", restMa)}/ipfs/${value}`;
	},
	p2p: (value, restMa) => {
		const tailProto = restMa.pop();
		if (tailProto === void 0) throw new Error("Unexpected end of multiaddr");
		return `${interpretNext(tailProto[0], tailProto[1] ?? "", restMa)}/p2p/${value}`;
	},
	http: (value, restMa) => {
		const maHasTLS = hasTLS(restMa);
		const sni = extractSNI(restMa);
		if (maHasTLS && sni !== null) return `https://${sni}`;
		const protocol = maHasTLS ? "https://" : "http://";
		const tailProto = restMa.pop();
		if (tailProto === void 0) throw new Error("Unexpected end of multiaddr");
		let baseVal = interpretNext(tailProto[0], tailProto[1] ?? "", restMa);
		baseVal = baseVal.replace("tcp://", "");
		return `${protocol}${baseVal}`;
	},
	"http-path": (value, restMa) => {
		const tailProto = restMa.pop();
		if (tailProto === void 0) throw new Error("Unexpected end of multiaddr");
		return `${interpretNext(tailProto[0], tailProto[1] ?? "", restMa)}/${decodeURIComponent(value)}`;
	},
	tls: (value, restMa) => {
		const tailProto = restMa.pop();
		if (tailProto === void 0) throw new Error("Unexpected end of multiaddr");
		return interpretNext(tailProto[0], tailProto[1] ?? "", restMa);
	},
	sni: (value, restMa) => {
		const tailProto = restMa.pop();
		if (tailProto === void 0) throw new Error("Unexpected end of multiaddr");
		return interpretNext(tailProto[0], tailProto[1] ?? "", restMa);
	},
	https: (value, restMa) => {
		const tailProto = restMa.pop();
		if (tailProto === void 0) throw new Error("Unexpected end of multiaddr");
		let baseVal = interpretNext(tailProto[0], tailProto[1] ?? "", restMa);
		baseVal = baseVal.replace("tcp://", "");
		return `https://${baseVal}`;
	},
	ws: (value, restMa) => {
		const maHasTLS = hasTLS(restMa);
		const sni = extractSNI(restMa);
		if (maHasTLS && sni !== null) return `wss://${sni}`;
		const protocol = maHasTLS ? "wss://" : "ws://";
		const tailProto = restMa.pop();
		if (tailProto === void 0) throw new Error("Unexpected end of multiaddr");
		let baseVal = interpretNext(tailProto[0], tailProto[1] ?? "", restMa);
		baseVal = baseVal.replace("tcp://", "");
		return `${protocol}${baseVal}`;
	},
	wss: (value, restMa) => {
		const tailProto = restMa.pop();
		if (tailProto === void 0) throw new Error("Unexpected end of multiaddr");
		let baseVal = interpretNext(tailProto[0], tailProto[1] ?? "", restMa);
		baseVal = baseVal.replace("tcp://", "");
		return `wss://${baseVal}`;
	},
	"p2p-websocket-star": (value, restMa) => {
		const tailProto = restMa.pop();
		if (tailProto === void 0) throw new Error("Unexpected end of multiaddr");
		return `${interpretNext(tailProto[0], tailProto[1] ?? "", restMa)}/p2p-websocket-star`;
	},
	"p2p-webrtc-star": (value, restMa) => {
		const tailProto = restMa.pop();
		if (tailProto === void 0) throw new Error("Unexpected end of multiaddr");
		return `${interpretNext(tailProto[0], tailProto[1] ?? "", restMa)}/p2p-webrtc-star`;
	},
	"p2p-webrtc-direct": (value, restMa) => {
		const tailProto = restMa.pop();
		if (tailProto === void 0) throw new Error("Unexpected end of multiaddr");
		return `${interpretNext(tailProto[0], tailProto[1] ?? "", restMa)}/p2p-webrtc-direct`;
	}
};
function multiaddrToUri(input, opts) {
	const parts = multiaddr(input).stringTuples();
	const head = parts.pop();
	if (head === void 0) throw new Error("Unexpected end of multiaddr");
	const protocol = getProtocol(head[0]);
	const interpreter = interpreters[protocol.name];
	if (interpreter == null) throw new Error(`No interpreter found for ${protocol.name}`);
	let uri = interpreter(head[1] ?? "", parts);
	if (opts?.assumeHttp !== false && ASSUME_HTTP_CODES.includes(head[0])) {
		uri = uri.replace(/^.*:\/\//, "");
		if (head[1] === "443") uri = `https://${uri}`;
		else uri = `http://${uri}`;
	}
	if (uri.startsWith("http://") || uri.startsWith("https://")) {
		uri = new URL(uri).toString();
		if (uri.endsWith("/")) uri = uri.substring(0, uri.length - 1);
	}
	return uri;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/block-brokers/dist/src/trustless-gateway/trustless-gateway.js
/**
* A `TrustlessGateway` keeps track of the number of attempts, errors, and
* successes for a given gateway url so that we can prioritize gateways that
* have been more reliable in the past, and ensure that requests are distributed
* across all gateways within a given `TrustlessGatewayBlockBroker` instance.
*/
var TrustlessGateway = class {
	url;
	/**
	* The number of times this gateway has been attempted to be used to fetch a
	* block. This includes successful, errored, and aborted attempts. By counting
	* even aborted attempts, slow gateways that are out-raced by others will be
	* considered less reliable.
	*/
	#attempts = 0;
	/**
	* The number of times this gateway has errored while attempting to fetch a
	* block. This includes `response.ok === false` and any other errors that
	* throw while attempting to fetch a block. This does not include aborted
	* attempts.
	*/
	#errors = 0;
	/**
	* The number of times this gateway has returned an invalid block. A gateway
	* that returns the wrong blocks for a CID should be considered for removal
	* from the list of gateways to fetch blocks from.
	*/
	#invalidBlocks = 0;
	/**
	* The number of times this gateway has successfully fetched a block.
	*/
	#successes = 0;
	/**
	* A map of pending responses for this gateway. This is used to ensure that
	* only one request per CID is made to a given gateway at a time, and that we
	* don't make multiple in-flight requests for the same CID to the same gateway.
	*/
	#pendingResponses = /* @__PURE__ */ new Map();
	log;
	constructor(url, logger) {
		this.url = url instanceof URL ? url : new URL(url);
		this.log = logger.forComponent(`helia:trustless-gateway-block-broker:${this.url.hostname}`);
	}
	/**
	* This function returns a unique string for the multihash.bytes of the CID.
	*
	* Some useful resources for why this is needed can be found using the links below:
	*
	* - https://github.com/ipfs/helia/pull/503#discussion_r1572451331
	* - https://github.com/ipfs/kubo/issues/6815
	* - https://www.notion.so/pl-strflt/Handling-ambiguity-around-CIDs-9d5e14f6516f438980b01ef188efe15d#d9d45cd1ed8b4d349b96285de4aed5ab
	*/
	#uniqueBlockId(cid) {
		const multihashBytes = cid.multihash.bytes;
		return base64.encode(multihashBytes);
	}
	/**
	* Fetch a raw block from `this.url` following the specification defined at
	* https://specs.ipfs.tech/http-gateways/trustless-gateway/
	*/
	async getRawBlock(cid, signal) {
		const gwUrl = new URL(this.url.toString());
		gwUrl.pathname = `/ipfs/${cid.toString()}`;
		gwUrl.search = "?format=raw";
		if (signal?.aborted === true) throw new Error(`Signal to fetch raw block for CID ${cid} from gateway ${this.url} was aborted prior to fetch`);
		const blockId = this.#uniqueBlockId(cid);
		const innerController = new AbortController();
		const abortInnerSignal = () => {
			innerController.abort();
		};
		signal?.addEventListener("abort", abortInnerSignal);
		try {
			let pendingResponse = this.#pendingResponses.get(blockId);
			if (pendingResponse == null) {
				this.#attempts++;
				pendingResponse = fetch(gwUrl.toString(), {
					signal: innerController.signal,
					headers: { Accept: "application/vnd.ipld.raw" },
					cache: "force-cache"
				}).then(async (res) => {
					this.log("GET %s %d", gwUrl, res.status);
					if (!res.ok) {
						this.#errors++;
						throw new Error(`unable to fetch raw block for CID ${cid} from gateway ${this.url}`);
					}
					this.#successes++;
					return new Uint8Array(await res.arrayBuffer());
				});
				this.#pendingResponses.set(blockId, pendingResponse);
			}
			return await pendingResponse;
		} catch (cause) {
			if (signal?.aborted === true) throw new Error(`fetching raw block for CID ${cid} from gateway ${this.url} was aborted`);
			this.#errors++;
			throw new Error(`unable to fetch raw block for CID ${cid}`);
		} finally {
			signal?.removeEventListener("abort", abortInnerSignal);
			this.#pendingResponses.delete(blockId);
		}
	}
	/**
	* Encapsulate the logic for determining whether a gateway is considered
	* reliable, for prioritization. This is based on the number of successful attempts made
	* and the number of errors encountered.
	*
	* Unused gateways have 100% reliability; They will be prioritized over
	* gateways with a 100% success rate to ensure that we attempt all gateways.
	*/
	reliability() {
		/**
		* if we have never tried to use this gateway, it is considered the most
		* reliable until we determine otherwise (prioritize unused gateways)
		*/
		if (this.#attempts === 0) return 1;
		if (this.#invalidBlocks > 0) return -Infinity;
		/**
		* We have attempted the gateway, so we need to calculate the reliability
		* based on the number of attempts, errors, and successes. Gateways that
		* return a single error should drop their reliability score more than a
		* single success increases it.
		*
		* Play around with the below reliability function at https://www.desmos.com/calculator/d6hfhf5ukm
		*/
		return this.#successes / (this.#attempts + this.#errors * 3);
	}
	/**
	* Increment the number of invalid blocks returned by this gateway.
	*/
	incrementInvalidBlocks() {
		this.#invalidBlocks++;
	}
	getStats() {
		return {
			attempts: this.#attempts,
			errors: this.#errors,
			invalidBlocks: this.#invalidBlocks,
			successes: this.#successes,
			pendingResponses: this.#pendingResponses.size
		};
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/block-brokers/dist/src/trustless-gateway/utils.js
function filterNonHTTPMultiaddrs(multiaddrs, allowInsecure, allowLocal) {
	return multiaddrs.filter((ma) => {
		if (HTTPS.matches(ma) || allowInsecure && HTTP.matches(ma)) {
			if (allowLocal) return true;
			if (DNS.matches(ma)) return true;
			return isPrivateIp(ma.toOptions().host) === false;
		}
		if (!allowInsecure && allowLocal) {
			const { host } = ma.toOptions();
			if (host === "127.0.0.1" || host === "localhost" || host.endsWith(".localhost")) return true;
		}
		return false;
	});
}
async function* findHttpGatewayProviders(cid, routing, logger, allowInsecure, allowLocal, options) {
	for await (const provider of routing.findProviders(cid, options)) {
		const httpAddresses = filterNonHTTPMultiaddrs(provider.multiaddrs, allowInsecure, allowLocal);
		if (httpAddresses.length === 0) continue;
		yield new TrustlessGateway(multiaddrToUri(httpAddresses[0]), logger);
	}
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/block-brokers/dist/src/trustless-gateway/session.js
var TrustlessGatewaySession = class extends AbstractSession {
	routing;
	allowInsecure;
	allowLocal;
	constructor(components, init) {
		super(components, {
			...init,
			name: "helia:trustless-gateway:session"
		});
		this.routing = components.routing;
		this.allowInsecure = init.allowInsecure ?? false;
		this.allowLocal = init.allowLocal ?? false;
	}
	async queryProvider(cid, provider, options) {
		this.log("fetching BLOCK for %c from %s", cid, provider.url);
		const block = await provider.getRawBlock(cid, options.signal);
		this.log.trace("got block for %c from %s", cid, provider.url);
		await options.validateFn?.(block);
		return block;
	}
	async *findNewProviders(cid, options = {}) {
		yield* findHttpGatewayProviders(cid, this.routing, this.logger, this.allowInsecure, this.allowLocal, options);
	}
	toEvictionKey(provider) {
		return provider.url.toString();
	}
	equals(providerA, providerB) {
		return providerA.url.toString() === providerB.url.toString();
	}
};
function createTrustlessGatewaySession(components, init) {
	return new TrustlessGatewaySession(components, init);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/block-brokers/dist/src/trustless-gateway/broker.js
/**
* A class that accepts a list of trustless gateways that are queried
* for blocks.
*/
var TrustlessGatewayBlockBroker = class {
	allowInsecure;
	allowLocal;
	routing;
	log;
	logger;
	constructor(components, init = {}) {
		this.log = components.logger.forComponent("helia:trustless-gateway-block-broker");
		this.logger = components.logger;
		this.routing = components.routing;
		this.allowInsecure = init.allowInsecure ?? false;
		this.allowLocal = init.allowLocal ?? false;
	}
	async retrieve(cid, options = {}) {
		const aggregateErrors = [];
		for await (const gateway of findHttpGatewayProviders(cid, this.routing, this.logger, this.allowInsecure, this.allowLocal, options)) {
			this.log("getting block for %c from %s", cid, gateway.url);
			try {
				const block = await gateway.getRawBlock(cid, options.signal);
				this.log.trace("got block for %c from %s", cid, gateway.url);
				try {
					await options.validateFn?.(block);
				} catch (err) {
					this.log.error("failed to validate block for %c from %s", cid, gateway.url, err);
					continue;
				}
				return block;
			} catch (err) {
				this.log.error("failed to get block for %c from %s", cid, gateway.url, err);
				if (err instanceof Error) aggregateErrors.push(err);
				else aggregateErrors.push(/* @__PURE__ */ new Error(`Unable to fetch raw block for CID ${cid} from gateway ${gateway.url}`));
				if (options.signal?.aborted === true) {
					this.log.trace("request aborted while fetching raw block for CID %c from gateway %s", cid, gateway.url);
					break;
				}
			}
		}
		if (aggregateErrors.length > 0) throw new AggregateError(aggregateErrors, `Unable to fetch raw block for CID ${cid} from any gateway`);
		else throw new Error(`Unable to fetch raw block for CID ${cid} from any gateway`);
	}
	createSession(options = {}) {
		return createTrustlessGatewaySession({
			logger: this.logger,
			routing: this.routing
		}, {
			...options,
			allowLocal: this.allowLocal,
			allowInsecure: this.allowInsecure
		});
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/block-brokers/dist/src/trustless-gateway/index.js
function trustlessGateway(init = {}) {
	return (components) => new TrustlessGatewayBlockBroker(components, init);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/browser-readablestream-to-it/dist/src/index.js
/**
* @packageDocumentation
*
* Allows treating a browser readable stream as an async iterator.
*
* @example
*
* ```javascript
* import toIt from 'browser-readablestream-to-it'
* import all from 'it-all'
*
* const content = [0, 1, 2, 3, 4]
*
* const stream = new ReadableStream({
*   start(controller) {
*     for (let i = 0; i < content.length; i++) {
*       controller.enqueue(content[i])
*     }
*
*     controller.close()
*   }
* })
*
* const arr = await all(toIt(stream))
*
* console.info(arr) // 0, 1, 2, 3, 4
* ```
*
* ## preventCancel
*
* By default a readable stream will have [.cancel](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/cancel) called on it once it has ended or
* reading has stopped prematurely.
*
* To prevent this behaviour, pass `preventCancel: true` as an option:
*
* ```javascript
* const arr = await all(toIt(stream, { preventCancel: true }))
*
* console.info(arr) // 0, 1, 2, 3, 4
* ```
*/
/**
* Turns a browser readable stream into an async iterable. Async iteration over
* returned iterable will lock give stream, preventing any other consumer from
* acquiring a reader. The lock will be released if iteration loop is broken. To
* prevent stream cancelling optional `{ preventCancel: true }` could be passed
* as a second argument.
*/
async function* browserReadableStreamToIt(stream, options = {}) {
	const reader = stream.getReader();
	try {
		while (true) {
			const result = await reader.read();
			if (result.done) return;
			yield result.value;
		}
	} finally {
		if (options.preventCancel !== true) await reader.cancel();
		reader.releaseLock();
	}
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/ipns/dist/src/errors.js
var import_timestamp_min = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		"undefined" != typeof module && (module.exports = d);
		var l = 86400, s = 3200, T = 146097 * s / 400, e = l * T, f = 1e3 * e, c = 864e13, g = 4294967296, h = 1e6, u = "000000000", m = Math.trunc || function(n) {
			var t = n - n % 1;
			return 0 == t && (n < 0 || 0 === n && 1 / n != 1 / 0) ? -0 : t;
		}, n = d.prototype, o = (d.fromDate = function(n) {
			return new d(+n);
		}, d.fromInt64BE = r(0, 1, 2, 3, 0, 4), d.fromInt64LE = r(3, 2, 1, 0, 4, 0), d.fromString = function(n) {
			var e, r = new d(), n = (n += "").replace(/^\s*[+\-]?\d+/, function(n) {
				var n = +n, t = 1970 + (n - 1970) % 400;
				return r.year = n - t, t;
			}).replace(/(?:Z|([+\-]\d{2}):?(\d{2}))$/, function(n, t, r) {
				return t < 0 && (r *= -1), e = 6e4 * (60 * +t + +r), "";
			}).replace(/\.\d+$/, function(n) {
				return r.nano = +(n + u).substr(1, 9), "";
			}).split(/\D+/);
			1 < n.length ? n[1]-- : n[1] = 0;
			if (r.time = e = Date.UTC.apply(Date, n) - (e || 0), isNaN(e)) throw new TypeError("Invalid Date");
			return p(r);
		}, d.fromTimeT = function(n) {
			return y(n, 0);
		}, n.year = 0, n.time = 0, n.nano = 0, n.addNano = function(n) {
			return this.nano += +n || 0, this;
		}, n.getNano = function() {
			var n = p(this);
			return (n.time % 1e3 * h + +n.nano + 1e9) % 1e9;
		}, n.getTimeT = function() {
			var n = p(this), t = Math.floor(n.time / 1e3), n = n.year;
			n && (t += n * T * l / s);
			return t;
		}, n.getYear = function() {
			return this.toDate().getUTCFullYear() + this.year;
		}, n.toDate = function() {
			return M(p(this).time);
		}, n.toJSON = function() {
			return this.toString().replace(/0{1,6}Z$/, "Z");
		}, n.toString = function(n) {
			var t = this, r = t.toDate(), u = {
				H: function() {
					return C(r.getUTCHours());
				},
				L: function() {
					return D(r.getUTCMilliseconds(), 3);
				},
				M: function() {
					return C(r.getUTCMinutes());
				},
				N: function() {
					return D(t.getNano(), 9);
				},
				S: function() {
					return C(r.getUTCSeconds());
				},
				Y: function() {
					var n = t.getYear();
					return 999999 < n ? "+" + n : 9999 < n ? "+" + D(n, 6) : 0 <= n ? D(n, 4) : -999999 <= n ? "-" + D(-n, 6) : n;
				},
				a: function() {
					return a[r.getUTCDay()];
				},
				b: function() {
					return i[r.getUTCMonth()];
				},
				d: function() {
					return C(r.getUTCDate());
				},
				e: function() {
					return function(n) {
						return (9 < n ? "" : " ") + (0 | n);
					}(r.getUTCDate());
				},
				m: function() {
					return C(r.getUTCMonth() + 1);
				}
			};
			return function e(n) {
				return n.replace(/%./g, function(n) {
					var t = n[1], r = v[t], t = u[t];
					return r ? e(r) : t ? t() : n;
				});
			}(n || o);
		}, n.writeInt64BE = t(0, 1, 2, 3, 0, 4), n.writeInt64LE = t(3, 2, 1, 0, 4, 0), "%Y-%m-%dT%H:%M:%S.%NZ"), i = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec"
		], a = [
			"Sun",
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat"
		], v = {
			"%": "%",
			F: "%Y-%m-%d",
			n: "\n",
			R: "%H:%M",
			T: "%H:%M:%S",
			t: "	",
			X: "%T",
			Z: "GMT",
			z: "+0000"
		};
		return d;
		function d(n, t, r) {
			var e = this;
			if (!(e instanceof d)) return new d(n, t, r);
			e.time = +n || 0, e.nano = +t || 0, e.year = +r || 0, p(e);
		}
		function p(n) {
			var t, r, e, u = n.year, o = n.time, i = n.nano, a = ((i < 0 || h <= i) && (i -= (r = Math.floor(i / h)) * h, o += r, r = 1), u % s);
			return (o < -c || c < o || a) && ((t = m(o / f)) && (u += t * s, o -= t * f), (e = M(o)).setUTCFullYear(a + e.getUTCFullYear()), e = (o = +e) + (t = m((u -= a) / s)) * f, t && -c <= e && e <= c && (u -= t * s, o = e), r = 1), r && (n.year = u, n.time = o, n.nano = i), n;
		}
		function M(n) {
			var t = /* @__PURE__ */ new Date(0);
			return t.setTime(n), t;
		}
		function y(n, t) {
			n = +n || 0;
			var r = m((t = (t | 0) * g) / e) + m(n / e), t = t % e + n % e, n = m(t / e);
			return n && (r += n, t -= n * e), new d(1e3 * t, 0, r * s);
		}
		function t(e, u, o, i, a, f) {
			return function(n, t) {
				var r = p(this);
				n = n || new Array(8);
				w(n, t |= 0);
				var e = Math.floor(r.time / 1e3), r = r.year * (T * l / s), u = m(r / g) + m(e / g), r = r % g + e % g, e = Math.floor(r / g);
				e && (u += e, r -= e * g);
				return c(n, t + a, u), c(n, t + f, r), n;
			};
			function c(n, t, r) {
				n[t + e] = r >> 24 & 255, n[t + u] = r >> 16 & 255, n[t + o] = r >> 8 & 255, n[t + i] = 255 & r;
			}
		}
		function r(r, e, u, o, i, a) {
			return function(n, t) {
				w(n, t |= 0);
				var r = f(n, t + i);
				return y(f(n, t + a), r);
			};
			function f(n, t) {
				return 16777216 * n[t + r] + (n[t + e] << 16 | n[t + u] << 8 | n[t + o]);
			}
		}
		function w(n, t) {
			n = n && n.length;
			if (null == n) throw new TypeError("Invalid Buffer");
			if (n < t + 8) throw new RangeError("Out of range");
		}
		function C(n) {
			return (9 < n ? "" : "0") + (0 | n);
		}
		function D(n, t) {
			return (u + (0 | n)).substr(-t);
		}
	})();
})))(), 1);
var SignatureVerificationError = class extends Error {
	static name = "SignatureVerificationError";
	constructor(message = "Record signature verification failed") {
		super(message);
		this.name = "SignatureVerificationError";
	}
};
var RecordExpiredError = class extends Error {
	static name = "RecordExpiredError";
	constructor(message = "Record has expired") {
		super(message);
		this.name = "RecordExpiredError";
	}
};
var UnsupportedValidityError = class extends Error {
	static name = "UnsupportedValidityError";
	constructor(message = "The validity type is unsupported") {
		super(message);
		this.name = "UnsupportedValidityError";
	}
};
var RecordTooLargeError = class extends Error {
	static name = "RecordTooLargeError";
	constructor(message = "The record is too large") {
		super(message);
		this.name = "RecordTooLargeError";
	}
};
var InvalidValueError = class extends Error {
	static name = "InvalidValueError";
	constructor(message = "Value must be a valid content path starting with /") {
		super(message);
		this.name = "InvalidValueError";
	}
};
var InvalidRecordDataError = class extends Error {
	static name = "InvalidRecordDataError";
	constructor(message = "Invalid record data") {
		super(message);
		this.name = "InvalidRecordDataError";
	}
};
var InvalidEmbeddedPublicKeyError = class extends Error {
	static name = "InvalidEmbeddedPublicKeyError";
	constructor(message = "Invalid embedded public key") {
		super(message);
		this.name = "InvalidEmbeddedPublicKeyError";
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/ipns/dist/src/pb/ipns.js
var IpnsEntry;
(function(IpnsEntry) {
	(function(ValidityType) {
		ValidityType["EOL"] = "EOL";
	})(IpnsEntry.ValidityType || (IpnsEntry.ValidityType = {}));
	let __ValidityTypeValues;
	(function(__ValidityTypeValues) {
		__ValidityTypeValues[__ValidityTypeValues["EOL"] = 0] = "EOL";
	})(__ValidityTypeValues || (__ValidityTypeValues = {}));
	(function(ValidityType) {
		ValidityType.codec = () => {
			return enumeration(__ValidityTypeValues);
		};
	})(IpnsEntry.ValidityType || (IpnsEntry.ValidityType = {}));
	let _codec;
	IpnsEntry.codec = () => {
		if (_codec == null) _codec = message((obj, w, opts = {}) => {
			if (opts.lengthDelimited !== false) w.fork();
			if (obj.value != null) {
				w.uint32(10);
				w.bytes(obj.value);
			}
			if (obj.signatureV1 != null) {
				w.uint32(18);
				w.bytes(obj.signatureV1);
			}
			if (obj.validityType != null) {
				w.uint32(24);
				IpnsEntry.ValidityType.codec().encode(obj.validityType, w);
			}
			if (obj.validity != null) {
				w.uint32(34);
				w.bytes(obj.validity);
			}
			if (obj.sequence != null) {
				w.uint32(40);
				w.uint64(obj.sequence);
			}
			if (obj.ttl != null) {
				w.uint32(48);
				w.uint64(obj.ttl);
			}
			if (obj.pubKey != null) {
				w.uint32(58);
				w.bytes(obj.pubKey);
			}
			if (obj.signatureV2 != null) {
				w.uint32(66);
				w.bytes(obj.signatureV2);
			}
			if (obj.data != null) {
				w.uint32(74);
				w.bytes(obj.data);
			}
			if (opts.lengthDelimited !== false) w.ldelim();
		}, (reader, length, opts = {}) => {
			const obj = {};
			const end = length == null ? reader.len : reader.pos + length;
			while (reader.pos < end) {
				const tag = reader.uint32();
				switch (tag >>> 3) {
					case 1:
						obj.value = reader.bytes();
						break;
					case 2:
						obj.signatureV1 = reader.bytes();
						break;
					case 3:
						obj.validityType = IpnsEntry.ValidityType.codec().decode(reader);
						break;
					case 4:
						obj.validity = reader.bytes();
						break;
					case 5:
						obj.sequence = reader.uint64();
						break;
					case 6:
						obj.ttl = reader.uint64();
						break;
					case 7:
						obj.pubKey = reader.bytes();
						break;
					case 8:
						obj.signatureV2 = reader.bytes();
						break;
					case 9:
						obj.data = reader.bytes();
						break;
					default: reader.skipType(tag & 7);
				}
			}
			return obj;
		});
		return _codec;
	};
	IpnsEntry.encode = (obj) => {
		return encodeMessage(obj, IpnsEntry.codec());
	};
	IpnsEntry.decode = (buf, opts) => {
		return decodeMessage(buf, IpnsEntry.codec(), opts);
	};
})(IpnsEntry || (IpnsEntry = {}));
//#endregion
//#region vendor/ipld-explorer-components/node_modules/ipns/dist/src/utils.js
var log$4 = logger("ipns:utils");
var IPNS_PREFIX$2 = fromString("/ipns/");
var IDENTITY_CODEC = 0;
var SHA2_256_CODEC = 18;
/**
* Extracts a public key from the passed PeerId, falling back to the pubKey
* embedded in the ipns record
*/
function extractPublicKeyFromIPNSRecord(record) {
	let pubKey;
	if (record.pubKey != null) try {
		pubKey = publicKeyFromProtobuf(record.pubKey);
	} catch (err) {
		log$4.error(err);
		throw err;
	}
	if (pubKey != null) return pubKey;
}
/**
* Utility for creating the record data for being signed
*/
function ipnsRecordDataForV2Sig(data) {
	return concat$1([fromString("ipns-signature:"), data]);
}
function marshalIPNSRecord(obj) {
	if ("signatureV1" in obj) return IpnsEntry.encode({
		value: fromString(obj.value),
		signatureV1: obj.signatureV1,
		validityType: obj.validityType,
		validity: fromString(obj.validity),
		sequence: obj.sequence,
		ttl: obj.ttl,
		pubKey: obj.pubKey,
		signatureV2: obj.signatureV2,
		data: obj.data
	});
	else return IpnsEntry.encode({
		pubKey: obj.pubKey,
		signatureV2: obj.signatureV2,
		data: obj.data
	});
}
function unmarshalIPNSRecord(buf) {
	const message = IpnsEntry.decode(buf);
	if (message.sequence != null) message.sequence = BigInt(message.sequence);
	if (message.ttl != null) message.ttl = BigInt(message.ttl);
	if (message.signatureV2 == null || message.data == null) throw new SignatureVerificationError("Missing data or signatureV2");
	const data = parseCborData(message.data);
	const value = normalizeByteValue(data.Value);
	const validity = toString$2(data.Validity);
	if (message.value != null && message.signatureV1 != null) {
		validateCborDataMatchesPbData(message);
		return {
			value,
			validityType: IpnsEntry.ValidityType.EOL,
			validity,
			sequence: data.Sequence,
			ttl: data.TTL,
			pubKey: message.pubKey,
			signatureV1: message.signatureV1,
			signatureV2: message.signatureV2,
			data: message.data
		};
	} else if (message.signatureV2 != null) return {
		value,
		validityType: IpnsEntry.ValidityType.EOL,
		validity,
		sequence: data.Sequence,
		ttl: data.TTL,
		pubKey: message.pubKey,
		signatureV2: message.signatureV2,
		data: message.data
	};
	else throw new Error("invalid record: does not include signatureV1 or signatureV2");
}
function multihashToIPNSRoutingKey(digest) {
	return concat$1([IPNS_PREFIX$2, digest.bytes]);
}
function multihashFromIPNSRoutingKey(key) {
	const digest = decode$8(key.slice(IPNS_PREFIX$2.length));
	if (!isCodec(digest, IDENTITY_CODEC) && !isCodec(digest, SHA2_256_CODEC)) throw new InvalidMultihashError("Multihash in IPNS key was not identity or sha2-256");
	return digest;
}
function parseCborData(buf) {
	const data = decode$9(buf);
	if (data.ValidityType === 0) data.ValidityType = IpnsEntry.ValidityType.EOL;
	else throw new UnsupportedValidityError("The validity type is unsupported");
	if (Number.isInteger(data.Sequence)) data.Sequence = BigInt(data.Sequence);
	if (Number.isInteger(data.TTL)) data.TTL = BigInt(data.TTL);
	return data;
}
function normalizeByteValue(value) {
	const string = toString$2(value).trim();
	if (string.startsWith("/")) return string;
	try {
		return `/ipfs/${CID.decode(value).toV1().toString()}`;
	} catch {}
	try {
		return `/ipfs/${CID.parse(string).toV1().toString()}`;
	} catch {}
	throw new InvalidValueError("Value must be a valid content path starting with /");
}
function validateCborDataMatchesPbData(entry) {
	if (entry.data == null) throw new InvalidRecordDataError("Record data is missing");
	const data = parseCborData(entry.data);
	if (!equals(data.Value, entry.value ?? /* @__PURE__ */ new Uint8Array(0))) throw new SignatureVerificationError("Field \"value\" did not match between protobuf and CBOR");
	if (!equals(data.Validity, entry.validity ?? /* @__PURE__ */ new Uint8Array(0))) throw new SignatureVerificationError("Field \"validity\" did not match between protobuf and CBOR");
	if (data.ValidityType !== entry.validityType) throw new SignatureVerificationError("Field \"validityType\" did not match between protobuf and CBOR");
	if (data.Sequence !== entry.sequence) throw new SignatureVerificationError("Field \"sequence\" did not match between protobuf and CBOR");
	if (data.TTL !== entry.ttl) throw new SignatureVerificationError("Field \"ttl\" did not match between protobuf and CBOR");
}
function isCodec(digest, codec) {
	return digest.code === codec;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/ipns/dist/src/validator.js
var log$3 = logger("ipns:validator");
/**
* Limit valid IPNS record sizes to 10kb
*/
var MAX_RECORD_SIZE = 10240;
/**
* Validates the given IPNS Record against the given public key. We need a "raw"
* record in order to be able to access to all of its fields.
*/
var validate = async (publicKey, buf) => {
	const record = unmarshalIPNSRecord(buf);
	let isValid;
	try {
		const dataForSignature = ipnsRecordDataForV2Sig(record.data);
		isValid = await publicKey.verify(dataForSignature, record.signatureV2);
	} catch (err) {
		isValid = false;
	}
	if (!isValid) {
		log$3.error("record signature verification failed");
		throw new SignatureVerificationError("Record signature verification failed");
	}
	if (record.validityType === IpnsEntry.ValidityType.EOL) {
		if (import_timestamp_min.default.fromString(record.validity).toDate().getTime() < Date.now()) {
			log$3.error("record has expired");
			throw new RecordExpiredError("record has expired");
		}
	} else if (record.validityType != null) {
		log$3.error("the validity type is unsupported");
		throw new UnsupportedValidityError("The validity type is unsupported");
	}
	log$3("ipns record for %s is valid", record.value);
};
async function ipnsValidator(key, marshalledData) {
	if (marshalledData.byteLength > MAX_RECORD_SIZE) throw new RecordTooLargeError("The record is too large");
	const routingMultihash = multihashFromIPNSRoutingKey(key);
	let routingPubKey;
	if (isCodec(routingMultihash, 0)) routingPubKey = publicKeyFromMultihash(routingMultihash);
	const recordPubKey = extractPublicKeyFromIPNSRecord(unmarshalIPNSRecord(marshalledData)) ?? routingPubKey;
	if (recordPubKey == null) throw new InvalidEmbeddedPublicKeyError("Could not extract public key from IPNS record or routing key");
	if (!equals(key, multihashToIPNSRoutingKey(recordPubKey.toMultihash()))) throw new InvalidEmbeddedPublicKeyError("Embedded public key did not match routing key");
	await validate(recordPubKey, marshalledData);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/it-ndjson/dist/src/parse.js
async function* parse(source) {
	const matcher = /\r?\n/;
	const decoder = new TextDecoder("utf8");
	let buffer = "";
	for await (let chunk of source) {
		if (typeof chunk === "string") chunk = new TextEncoder().encode(chunk);
		buffer += decoder.decode(chunk, { stream: true });
		const parts = buffer.split(matcher);
		buffer = parts.pop() ?? "";
		for (let i = 0; i < parts.length; i++) yield JSON.parse(parts[i]);
	}
	buffer += decoder.decode();
	if (buffer !== "") yield JSON.parse(buffer);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/delegated-routing-v1-http-api-client/dist/src/errors.js
var InvalidRequestError = class extends Error {
	static name = "InvalidRequestError";
	constructor(message = "Invalid request") {
		super(message);
		this.name = "InvalidRequestError";
	}
};
var BadResponseError = class extends Error {
	static name = "BadResponseError";
	constructor(message = "Bad response") {
		super(message);
		this.name = "BadResponseError";
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/it-first/dist/src/index.js
/**
* @packageDocumentation
*
* Return the first value in an (async)iterable
*
* @example
*
* ```javascript
* import first from 'it-first'
*
* // This can also be an iterator, generator, etc
* const values = [0, 1, 2, 3, 4]
*
* const res = first(values)
*
* console.info(res) // 0
* ```
*
* Async sources must be awaited:
*
* ```javascript
* import first from 'it-first'
*
* const values = async function * () {
*   yield * [0, 1, 2, 3, 4]
* }
*
* const res = await first(values())
*
* console.info(res) // 0
* ```
*/
function isAsyncIterable$2(thing) {
	return thing[Symbol.asyncIterator] != null;
}
function first(source) {
	if (isAsyncIterable$2(source)) return (async () => {
		for await (const entry of source) return entry;
	})();
	for (const entry of source) return entry;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/delegated-routing-v1-http-api-client/dist/src/routings.js
var IPNS_PREFIX$1 = fromString("/ipns/");
function isIPNSKey$1(key) {
	return equals(key.subarray(0, IPNS_PREFIX$1.byteLength), IPNS_PREFIX$1);
}
/**
* Wrapper class to convert [http-routing-v1 content events](https://specs.ipfs.tech/routing/http-routing-v1/#response-body) into returned values
*/
var DelegatedRoutingV1HttpApiClientContentRouting = class {
	client;
	constructor(client) {
		this.client = client;
	}
	async *findProviders(cid, options = {}) {
		yield* map(this.client.getProviders(cid, options), (record) => {
			return {
				id: record.ID,
				multiaddrs: record.Addrs ?? []
			};
		});
	}
	async provide() {}
	async put(key, value, options) {
		if (!isIPNSKey$1(key)) return;
		const digest = multihashFromIPNSRoutingKey(key);
		const cid = CID.createV1(114, digest);
		const record = unmarshalIPNSRecord(value);
		await this.client.putIPNS(cid, record, options);
	}
	async get(key, options) {
		if (!isIPNSKey$1(key)) throw new NotFoundError$1("Not found");
		const digest = multihashFromIPNSRoutingKey(key);
		const cid = CID.createV1(114, digest);
		try {
			return marshalIPNSRecord(await this.client.getIPNS(cid, options));
		} catch (err) {
			if (err.name === "BadResponseError") throw new NotFoundError$1("Not found");
			throw err;
		}
	}
};
/**
* Wrapper class to convert [http-routing-v1](https://specs.ipfs.tech/routing/http-routing-v1/#response-body-0) events into expected libp2p values
*/
var DelegatedRoutingV1HttpApiClientPeerRouting = class {
	client;
	constructor(client) {
		this.client = client;
	}
	async findPeer(peerId, options = {}) {
		const peer = await first(this.client.getPeers(peerId, options));
		if (peer != null) return {
			id: peer.ID,
			multiaddrs: peer.Addrs ?? []
		};
		throw new NotFoundError$1("Not found");
	}
	async *getClosestPeers(key, options = {}) {}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/delegated-routing-v1-http-api-client/dist/src/client.js
var log$2 = logger("delegated-routing-v1-http-api-client");
var defaultValues = {
	concurrentRequests: 4,
	timeout: 3e4
};
var DefaultDelegatedRoutingV1HttpApiClient = class {
	started;
	httpQueue;
	shutDownController;
	clientUrl;
	timeout;
	contentRouting;
	peerRouting;
	filterAddrs;
	filterProtocols;
	/**
	* Create a new DelegatedContentRouting instance
	*/
	constructor(url, init = {}) {
		this.started = false;
		this.shutDownController = new AbortController();
		setMaxListeners(Infinity, this.shutDownController.signal);
		this.httpQueue = new PQueue({ concurrency: init.concurrentRequests ?? defaultValues.concurrentRequests });
		this.clientUrl = url instanceof URL ? url : new URL(url);
		this.timeout = init.timeout ?? defaultValues.timeout;
		this.filterAddrs = init.filterAddrs;
		this.filterProtocols = init.filterProtocols;
		this.contentRouting = new DelegatedRoutingV1HttpApiClientContentRouting(this);
		this.peerRouting = new DelegatedRoutingV1HttpApiClientPeerRouting(this);
	}
	get [contentRoutingSymbol]() {
		return this.contentRouting;
	}
	get [peerRoutingSymbol]() {
		return this.peerRouting;
	}
	isStarted() {
		return this.started;
	}
	start() {
		this.started = true;
	}
	stop() {
		this.httpQueue.clear();
		this.shutDownController.abort();
		this.started = false;
	}
	async *getProviders(cid, options = {}) {
		log$2("getProviders starts: %c", cid);
		const timeoutSignal = AbortSignal.timeout(this.timeout);
		const signal = anySignal([
			this.shutDownController.signal,
			timeoutSignal,
			options.signal
		]);
		setMaxListeners(Infinity, timeoutSignal, signal);
		const onStart = pDefer();
		const onFinish = pDefer();
		this.httpQueue.add(async () => {
			onStart.resolve();
			return onFinish.promise;
		});
		try {
			await onStart.promise;
			const url = new URL(`${this.clientUrl}routing/v1/providers/${cid.toString()}`);
			this.#addFilterParams(url, options.filterAddrs, options.filterProtocols);
			const res = await fetch(url, {
				headers: { Accept: "application/x-ndjson" },
				signal
			});
			if (res.status === 404) throw new NotFoundError$1("No matching records found");
			if (res.status === 422) throw new InvalidRequestError("Request does not conform to schema or semantic constraints");
			if (res.body == null) throw new BadResponseError("Routing response had no body");
			if (res.headers.get("Content-Type") === "application/json") {
				const body = await res.json();
				for (const provider of body.Providers) {
					const record = this.#conformToPeerSchema(provider);
					if (record != null) yield record;
				}
			} else for await (const provider of parse(browserReadableStreamToIt(res.body))) {
				const record = this.#conformToPeerSchema(provider);
				if (record != null) yield record;
			}
		} catch (err) {
			log$2.error("getProviders errored:", err);
		} finally {
			signal.clear();
			onFinish.resolve();
			log$2("getProviders finished: %c", cid);
		}
	}
	async *getPeers(peerId, options = {}) {
		log$2("getPeers starts: %c", peerId);
		const timeoutSignal = AbortSignal.timeout(this.timeout);
		const signal = anySignal([
			this.shutDownController.signal,
			timeoutSignal,
			options.signal
		]);
		setMaxListeners(Infinity, timeoutSignal, signal);
		const onStart = pDefer();
		const onFinish = pDefer();
		this.httpQueue.add(async () => {
			onStart.resolve();
			return onFinish.promise;
		});
		try {
			await onStart.promise;
			const url = new URL(`${this.clientUrl}routing/v1/peers/${peerId.toCID().toString()}`);
			this.#addFilterParams(url, options.filterAddrs, options.filterProtocols);
			const res = await fetch(url, {
				headers: { Accept: "application/x-ndjson" },
				signal
			});
			if (res.status === 404) throw new NotFoundError$1("No matching records found");
			if (res.status === 422) throw new InvalidRequestError("Request does not conform to schema or semantic constraints");
			if (res.body == null) throw new BadResponseError("Routing response had no body");
			if (res.headers.get("Content-Type") === "application/json") {
				const body = await res.json();
				for (const peer of body.Peers) {
					const record = this.#conformToPeerSchema(peer);
					if (record != null) yield record;
				}
			} else for await (const peer of parse(browserReadableStreamToIt(res.body))) {
				const record = this.#conformToPeerSchema(peer);
				if (record != null) yield record;
			}
		} catch (err) {
			log$2.error("getPeers errored:", err);
		} finally {
			signal.clear();
			onFinish.resolve();
			log$2("getPeers finished: %c", peerId);
		}
	}
	async getIPNS(libp2pKey, options = {}) {
		log$2("getIPNS starts: %s", libp2pKey);
		const timeoutSignal = AbortSignal.timeout(this.timeout);
		const signal = anySignal([
			this.shutDownController.signal,
			timeoutSignal,
			options.signal
		]);
		setMaxListeners(Infinity, timeoutSignal, signal);
		const onStart = pDefer();
		const onFinish = pDefer();
		this.httpQueue.add(async () => {
			onStart.resolve();
			return onFinish.promise;
		});
		const resource = `${this.clientUrl}routing/v1/ipns/${libp2pKey}`;
		try {
			await onStart.promise;
			const res = await fetch(resource, {
				headers: { Accept: "application/vnd.ipfs.ipns-record" },
				signal
			});
			log$2("getIPNS GET %s %d", resource, res.status);
			if (res.status === 404) throw new NotFoundError$1("No matching records found");
			if (res.status === 422) throw new InvalidRequestError("Request does not conform to schema or semantic constraints");
			if (res.body == null) throw new BadResponseError("GET ipns response had no body");
			const buf = await res.arrayBuffer();
			const body = new Uint8Array(buf, 0, buf.byteLength);
			if (options.validate !== false) await ipnsValidator(multihashToIPNSRoutingKey(libp2pKey.multihash), body);
			return unmarshalIPNSRecord(body);
		} catch (err) {
			log$2.error("getIPNS GET %s error:", resource, err);
			throw err;
		} finally {
			signal.clear();
			onFinish.resolve();
			log$2("getIPNS finished: %s", libp2pKey);
		}
	}
	async putIPNS(libp2pKey, record, options = {}) {
		log$2("putIPNS starts: %c", libp2pKey);
		const timeoutSignal = AbortSignal.timeout(this.timeout);
		const signal = anySignal([
			this.shutDownController.signal,
			timeoutSignal,
			options.signal
		]);
		setMaxListeners(Infinity, timeoutSignal, signal);
		const onStart = pDefer();
		const onFinish = pDefer();
		this.httpQueue.add(async () => {
			onStart.resolve();
			return onFinish.promise;
		});
		const resource = `${this.clientUrl}routing/v1/ipns/${libp2pKey}`;
		try {
			await onStart.promise;
			const getOptions = {
				method: "PUT",
				headers: { "Content-Type": "application/vnd.ipfs.ipns-record" },
				body: marshalIPNSRecord(record),
				signal
			};
			const res = await fetch(resource, getOptions);
			log$2("putIPNS PUT %s %d", resource, res.status);
			if (res.status !== 200) throw new BadResponseError("PUT ipns response had status other than 200");
		} catch (err) {
			log$2.error("putIPNS PUT %s error:", resource, err.stack);
			throw err;
		} finally {
			signal.clear();
			onFinish.resolve();
			log$2("putIPNS finished: %c", libp2pKey);
		}
	}
	#conformToPeerSchema(record) {
		try {
			const protocols = [];
			const multiaddrs = record.Addrs?.map(multiaddr) ?? [];
			if (record.Protocols != null) protocols.push(...record.Protocols);
			if (record.Protocol != null) {
				protocols.push(record.Protocol);
				delete record.Protocol;
			}
			return {
				...record,
				Schema: "peer",
				ID: peerIdFromString(record.ID),
				Addrs: multiaddrs,
				Protocols: protocols
			};
		} catch (err) {
			log$2.error("could not conform record to peer schema", err);
		}
	}
	#addFilterParams(url, filterAddrs, filterProtocols) {
		if (filterAddrs != null || this.filterAddrs != null) {
			const adressFilter = filterAddrs?.join(",") ?? this.filterAddrs?.join(",") ?? "";
			if (adressFilter !== "") url.searchParams.set("filter-addrs", adressFilter);
		}
		if (filterProtocols != null || this.filterProtocols != null) {
			const protocolFilter = filterProtocols?.join(",") ?? this.filterProtocols?.join(",") ?? "";
			if (protocolFilter !== "") url.searchParams.set("filter-protocols", protocolFilter);
		}
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/delegated-routing-v1-http-api-client/dist/src/index.js
/**
* @packageDocumentation
*
* A client implementation of the IPFS [Delegated Routing V1 HTTP API](https://specs.ipfs.tech/routing/http-routing-v1/) that can be used to interact with any compliant server implementation.
*
* @example
*
* ```typescript
* import { createDelegatedRoutingV1HttpApiClient } from '@helia/delegated-routing-v1-http-api-client'
* import { CID } from 'multiformats/cid'
*
* const client = createDelegatedRoutingV1HttpApiClient('https://example.org')
*
* for await (const prov of getProviders(CID.parse('QmFoo'))) {
*   // ...
* }
* ```
*
* ### How to use with libp2p
*
* The client can be configured as a libp2p service, this will enable it as both a {@link https://libp2p.github.io/js-libp2p/interfaces/_libp2p_interface.content_routing.ContentRouting.html | ContentRouting} and a {@link https://libp2p.github.io/js-libp2p/interfaces/_libp2p_interface.peer_routing.PeerRouting.html | PeerRouting} implementation
*
* @example
*
* ```typescript
* import { createDelegatedRoutingV1HttpApiClient } from '@helia/delegated-routing-v1-http-api-client'
* import { createLibp2p } from 'libp2p'
* import { peerIdFromString } from '@libp2p/peer-id'
*
* const client = createDelegatedRoutingV1HttpApiClient('https://example.org')
* const libp2p = await createLibp2p({
*   // other config here
*   services: {
*     delegatedRouting: client
*   }
* })
*
* // later this will use the configured HTTP gateway
* await libp2p.peerRouting.findPeer(peerIdFromString('QmFoo'))
* ```
*/
/**
* Create and return a client to use with a Routing V1 HTTP API server
*/
function createDelegatedRoutingV1HttpApiClient(url, init = {}) {
	return new DefaultDelegatedRoutingV1HttpApiClient(new URL(url), init);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/routers/dist/src/delegated-http-routing.js
var IPNS_PREFIX = fromString("/ipns/");
function isIPNSKey(key) {
	return equals(key.subarray(0, IPNS_PREFIX.byteLength), IPNS_PREFIX);
}
var DelegatedHTTPRouter = class {
	client;
	constructor(url) {
		this.client = createDelegatedRoutingV1HttpApiClient(url);
	}
	async provide(cid, options) {}
	async *findProviders(cid, options) {
		yield* map(this.client.getProviders(cid, options), (record) => {
			return {
				id: record.ID,
				multiaddrs: record.Addrs,
				protocols: record.Protocols
			};
		});
	}
	async put(key, value, options) {
		if (!isIPNSKey(key)) return;
		const digest = multihashFromIPNSRoutingKey(key);
		const cid = CID.createV1(114, digest);
		const record = unmarshalIPNSRecord(value);
		await this.client.putIPNS(cid, record, options);
	}
	async get(key, options) {
		if (!isIPNSKey(key)) throw new NotFoundError$1("Not found");
		const digest = multihashFromIPNSRoutingKey(key);
		const cid = CID.createV1(114, digest);
		try {
			return marshalIPNSRecord(await this.client.getIPNS(cid, options));
		} catch (err) {
			if (err.name === "BadResponseError") throw new NotFoundError$1("Not found");
			throw err;
		}
	}
	async findPeer(peerId, options) {
		const peer = await first(this.client.getPeers(peerId, options));
		if (peer != null) return {
			id: peer.ID,
			multiaddrs: peer.Addrs ?? []
		};
		throw new NotFoundError$1("Not found");
	}
	async *getClosestPeers(key, options) {}
};
/**
* Creates a Helia Router that connects to an endpoint that supports the [Delegated Routing V1 HTTP API](https://specs.ipfs.tech/routing/http-routing-v1/) spec.
*/
function delegatedHTTPRouting(url) {
	return new DelegatedHTTPRouter(new URL(url));
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/ip-regex/index.js
var word = "[a-fA-F\\d:]";
var boundry = (options) => options && options.includeBoundaries ? `(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))` : "";
var v4 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
var v6segment = "[a-fA-F\\d]{1,4}";
var v6 = `
(?:
(?:${v6segment}:){7}(?:${v6segment}|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6segment}:){6}(?:${v4}|:${v6segment}|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6segment}:){5}(?::${v4}|(?::${v6segment}){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6segment}:){4}(?:(?::${v6segment}){0,1}:${v4}|(?::${v6segment}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6segment}:){3}(?:(?::${v6segment}){0,2}:${v4}|(?::${v6segment}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6segment}:){2}(?:(?::${v6segment}){0,3}:${v4}|(?::${v6segment}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6segment}:){1}(?:(?::${v6segment}){0,4}:${v4}|(?::${v6segment}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::(?:(?::${v6segment}){0,5}:${v4}|(?::${v6segment}){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1
`.replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
var v46Exact = new RegExp(`(?:^${v4}$)|(?:^${v6}$)`);
var v4exact = new RegExp(`^${v4}$`);
var v6exact = new RegExp(`^${v6}$`);
var ipRegex = (options) => options && options.exact ? v46Exact : new RegExp(`(?:${boundry(options)}${v4}${boundry(options)})|(?:${boundry(options)}${v6}${boundry(options)})`, "g");
ipRegex.v4 = (options) => options && options.exact ? v4exact : new RegExp(`${boundry(options)}${v4}${boundry(options)}`, "g");
ipRegex.v6 = (options) => options && options.exact ? v6exact : new RegExp(`${boundry(options)}${v6}${boundry(options)}`, "g");
//#endregion
//#region vendor/ipld-explorer-components/node_modules/function-timeout/browser.js
function functionTimeout(function_) {
	const wrappedFunction = (...arguments_) => function_(...arguments_);
	Object.defineProperty(wrappedFunction, "name", {
		value: `functionTimeout(${function_.name || "<anonymous>"})`,
		configurable: true
	});
	return wrappedFunction;
}
function isTimeoutError() {
	return false;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/is-regexp/index.js
var { toString } = Object.prototype;
function isRegexp(value) {
	return toString.call(value) === "[object RegExp]";
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/clone-regexp/index.js
var flagMap = {
	global: "g",
	ignoreCase: "i",
	multiline: "m",
	dotAll: "s",
	sticky: "y",
	unicode: "u"
};
function clonedRegexp(regexp, options = {}) {
	if (!isRegexp(regexp)) throw new TypeError("Expected a RegExp instance");
	const flags = Object.keys(flagMap).map((flag) => (typeof options[flag] === "boolean" ? options[flag] : regexp[flag]) ? flagMap[flag] : "").join("");
	const clonedRegexp = new RegExp(options.source || regexp.source, flags);
	clonedRegexp.lastIndex = typeof options.lastIndex === "number" ? options.lastIndex : regexp.lastIndex;
	return clonedRegexp;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/super-regex/index.js
function isMatch(regex, string, { timeout } = {}) {
	try {
		return functionTimeout(() => clonedRegexp(regex).test(string), { timeout })();
	} catch (error) {
		if (isTimeoutError(error)) return false;
		throw error;
	}
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/is-ip/index.js
var maxIPv4Length = 15;
var maxIPv6Length = 45;
var options = { timeout: 400 };
function isIPv6(string) {
	if (string.length > maxIPv6Length) return false;
	return isMatch(ipRegex.v6({ exact: true }), string, options);
}
function isIPv4(string) {
	if (string.length > maxIPv4Length) return false;
	return isMatch(ipRegex.v4({ exact: true }), string, options);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@multiformats/uri-to-multiaddr/dist/src/index.js
/**
* @packageDocumentation
*
* ```typescript
* import { uriToMultiaddr } from '@multiformats/uri-to-multiaddr'
*
* console.log(uriToMultiaddr('https://protocol.ai'))
* // -> /dns4/protocol.ai/tcp/443/https
* ```
*
* Domain names can represent one of
*
* - `/dns4` - domain resolves to an ipv4 address (**default**)
* - `/dns6` - domain resolves to an ipv6 address
* - `/dnsaddr` - domain has a [DNSLink](https://docs.ipfs.io/guides/concepts/dnslink/) TXT record pointing to an IPFS CID
*
* This library assumes `/dns4` when it finds a domain name in the input string.
* It makes no attempt query DNS. To override the default assumption, you can pass
* in an options object as the second parameter to override it:
*
* ```typescript
* import { uriToMultiaddr } from '@multiformats/uri-to-multiaddr'
*
* console.log(uriToMultiaddr('https://protocol.ai'), { defaultDnsType: 'dns6' })
* // -> /dns6/protocol.ai/tcp/443/https
* ```
*
* See [test.js](./test.js) for the currently supported conversions.
*
* **Note**: `uri-to-multiaddr` will throw if the passed URI:
*
* - is not a valid, according the WHATWG URL spec implementation used.
* - is not supported yet
*
* ## Related
*
* - [@multiformats/multiaddr-to-uri](https://github.com/multiformats/js-multiaddr-to-uri) - convert it back again
*/
var portFor = {
	http: "80",
	https: "443",
	ws: "80",
	wss: "443"
};
var BROWSER_SCHEMES = [
	"http",
	"https",
	"ws",
	"wss"
];
/**
* Convert a URI to a multiaddr
*
* http://foobar.com => /dns4/foobar.com/tcp/80/http
* https://foobar.com => /dns4/foobar.com/tcp/443/https
* https://foobar.com:5001 => /dns4/foobar.com/tcp/5001/https
* https://127.0.0.1:8080 => /ip4/127.0.0.1/tcp/8080/https
* http://[::1]:8080 => /ip6/::1/tcp/8080/http
* tcp://foobar.com:8080 => /dns4/foobar.com/tcp/8080
* udp://foobar.com:8080 => /dns4/foobar.com/udp/8080
*/
function uriToMultiaddr(uriStr, opts) {
	opts = opts ?? {};
	const defaultDnsType = opts.defaultDnsType ?? "dns4";
	const { scheme, hostname, port } = parseUri(uriStr);
	return multiaddr("/" + [
		tupleForHostname(hostname, defaultDnsType),
		tupleForPort(port, scheme),
		tupleForScheme(scheme)
	].filter((x) => Boolean(x)).reduce((a, b) => a.concat(b), []).join("/"));
}
function parseUri(uriStr) {
	const [scheme] = uriStr.split(":");
	if (!BROWSER_SCHEMES.includes(scheme)) uriStr = "http" + uriStr.substring(scheme.length);
	let { protocol, hostname, port } = new URL(uriStr);
	if (port == null || port === "") {
		const protocolPort = portForProtocol(scheme);
		if (protocolPort != null) port = protocolPort;
		if (protocolPort == null && protocol === "http:") port = "80";
	}
	return {
		scheme,
		hostname,
		port
	};
}
function tupleForHostname(hostname, defaultDnsType) {
	if (hostname == null || hostname === "") return;
	if (isIPv4(hostname)) return ["ip4", hostname];
	if (isIPv6(hostname)) return ["ip6", hostname];
	if (hostname[0] === "[") {
		const trimmed = hostname.substring(1, hostname.length - 1);
		if (isIPv6(trimmed)) return ["ip6", trimmed];
	}
	return [defaultDnsType, hostname];
}
function tupleForPort(port, scheme) {
	if (port == null || port === "") return;
	if (scheme === "udp") return ["udp", port];
	return ["tcp", port];
}
function tupleForScheme(scheme) {
	if (scheme.match(/^tcp$|^udp$/) != null) return;
	return [scheme];
}
function portForProtocol(protocol) {
	if (protocol == null || protocol === "" || portFor[protocol] == null) return;
	return portFor[protocol];
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/routers/dist/src/http-gateway-routing.js
var DEFAULT_TRUSTLESS_GATEWAYS = ["https://trustless-gateway.link", "https://4everland.io"];
var TRANSPORT_IPFS_GATEWAY_HTTP_CODE = 2336;
function toPeerInfo(url) {
	url = url.toString();
	return {
		id: peerIdFromCID(CID.createV1(TRANSPORT_IPFS_GATEWAY_HTTP_CODE, identity.digest(fromString(url)))),
		multiaddrs: [uriToMultiaddr(url)]
	};
}
var HTTPGatwayRouter = class {
	gateways;
	constructor(init = {}) {
		this.gateways = (init.gateways ?? DEFAULT_TRUSTLESS_GATEWAYS).map((url) => toPeerInfo(url));
	}
	async *findProviders(cid, options) {
		yield* this.gateways.toSorted(() => Math.random() > .5 ? 1 : -1).map((info) => ({
			...info,
			protocols: ["transport-ipfs-gateway-http"]
		}));
	}
};
/**
* Returns a static list of HTTP Gateways as providers
*/
function httpGatewayRouting(init = {}) {
	return new HTTPGatwayRouter(init);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/blockstore-core/dist/src/memory.js
var MemoryBlockstore = class extends BaseBlockstore {
	data;
	constructor() {
		super();
		this.data = /* @__PURE__ */ new Map();
	}
	put(key, val) {
		this.data.set(base32.encode(key.multihash.bytes), val);
		return key;
	}
	get(key) {
		const buf = this.data.get(base32.encode(key.multihash.bytes));
		if (buf == null) throw new NotFoundError();
		return buf;
	}
	has(key) {
		return this.data.has(base32.encode(key.multihash.bytes));
	}
	async delete(key) {
		this.data.delete(base32.encode(key.multihash.bytes));
	}
	async *getAll() {
		for (const [key, value] of this.data.entries()) yield {
			cid: CID.createV1(85, decode$8(base32.decode(key))),
			block: value
		};
	}
};
logger("blockstore:core:tiered");
//#endregion
//#region vendor/ipld-explorer-components/node_modules/datastore-core/dist/src/shard.js
var SHARDING_FN = "SHARDING";
//#endregion
//#region vendor/ipld-explorer-components/node_modules/it-all/dist/src/index.js
/**
* @packageDocumentation
*
* For when you need a one-liner to collect iterable values.
*
* @example
*
* ```javascript
* import all from 'it-all'
*
* // This can also be an iterator, etc
* const values = function * () {
*   yield * [0, 1, 2, 3, 4]
* }
*
* const arr = all(values)
*
* console.info(arr) // 0, 1, 2, 3, 4
* ```
*
* Async sources must be awaited:
*
* ```javascript
* const values = async function * () {
*   yield * [0, 1, 2, 3, 4]
* }
*
* const arr = await all(values())
*
* console.info(arr) // 0, 1, 2, 3, 4
* ```
*/
function isAsyncIterable$1(thing) {
	return thing[Symbol.asyncIterator] != null;
}
function all(source) {
	if (isAsyncIterable$1(source)) return (async () => {
		const arr = [];
		for await (const entry of source) arr.push(entry);
		return arr;
	})();
	const arr = [];
	for (const entry of source) arr.push(entry);
	return arr;
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/it-sort/dist/src/index.js
/**
* @packageDocumentation
*
* Consumes all values from an (async)iterable and returns them sorted by the passed sort function.
*
* @example
*
* ```javascript
* import sort from 'it-sort'
* import all from 'it-all'
*
* const sorter = (a, b) => {
*   return a.localeCompare(b)
* }
*
* // This can also be an iterator, generator, etc
* const values = ['foo', 'bar']
*
* const arr = all(sort(values, sorter))
*
* console.info(arr) // 'bar', 'foo'
* ```
*
* Async sources must be awaited:
*
* ```javascript
* import sort from 'it-sort'
* import all from 'it-all'
*
* const sorter = (a, b) => {
*   return a.localeCompare(b)
* }
*
* const values = async function * () {
*   yield * ['foo', 'bar']
* }
*
* const arr = await all(sort(values, sorter))
*
* console.info(arr) // 'bar', 'foo'
* ```
*/
function isAsyncIterable(thing) {
	return thing[Symbol.asyncIterator] != null;
}
function sort(source, sorter) {
	if (isAsyncIterable(source)) return (async function* () {
		yield* (await all(source)).sort(sorter);
	})();
	return (function* () {
		yield* all(source).sort(sorter);
	})();
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/datastore-core/dist/src/base.js
var BaseDatastore = class {
	put(key, val, options) {
		return Promise.reject(/* @__PURE__ */ new Error(".put is not implemented"));
	}
	get(key, options) {
		return Promise.reject(/* @__PURE__ */ new Error(".get is not implemented"));
	}
	has(key, options) {
		return Promise.reject(/* @__PURE__ */ new Error(".has is not implemented"));
	}
	delete(key, options) {
		return Promise.reject(/* @__PURE__ */ new Error(".delete is not implemented"));
	}
	async *putMany(source, options = {}) {
		for await (const { key, value } of source) {
			await this.put(key, value, options);
			yield key;
		}
	}
	async *getMany(source, options = {}) {
		for await (const key of source) yield {
			key,
			value: await this.get(key, options)
		};
	}
	async *deleteMany(source, options = {}) {
		for await (const key of source) {
			await this.delete(key, options);
			yield key;
		}
	}
	batch() {
		let puts = [];
		let dels = [];
		return {
			put(key, value) {
				puts.push({
					key,
					value
				});
			},
			delete(key) {
				dels.push(key);
			},
			commit: async (options) => {
				await drain(this.putMany(puts, options));
				puts = [];
				await drain(this.deleteMany(dels, options));
				dels = [];
			}
		};
	}
	/**
	* Extending classes should override `query` or implement this method
	*/
	async *_all(q, options) {
		throw new Error("._all is not implemented");
	}
	/**
	* Extending classes should override `queryKeys` or implement this method
	*/
	async *_allKeys(q, options) {
		throw new Error("._allKeys is not implemented");
	}
	query(q, options) {
		let it = this._all(q, options);
		if (q.prefix != null) {
			const prefix = q.prefix;
			it = filter(it, (e) => e.key.toString().startsWith(prefix));
		}
		if (Array.isArray(q.filters)) it = q.filters.reduce((it, f) => filter(it, f), it);
		if (Array.isArray(q.orders)) it = q.orders.reduce((it, f) => sort(it, f), it);
		if (q.offset != null) {
			let i = 0;
			const offset = q.offset;
			it = filter(it, () => i++ >= offset);
		}
		if (q.limit != null) it = take(it, q.limit);
		return it;
	}
	queryKeys(q, options) {
		let it = this._allKeys(q, options);
		if (q.prefix != null) {
			const prefix = q.prefix;
			it = filter(it, (key) => key.toString().startsWith(prefix));
		}
		if (Array.isArray(q.filters)) it = q.filters.reduce((it, f) => filter(it, f), it);
		if (Array.isArray(q.orders)) it = q.orders.reduce((it, f) => sort(it, f), it);
		if (q.offset != null) {
			const offset = q.offset;
			let i = 0;
			it = filter(it, () => i++ >= offset);
		}
		if (q.limit != null) it = take(it, q.limit);
		return it;
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/datastore-core/dist/src/memory.js
var MemoryDatastore = class extends BaseDatastore {
	data;
	constructor() {
		super();
		this.data = /* @__PURE__ */ new Map();
	}
	put(key, val) {
		this.data.set(key.toString(), val);
		return key;
	}
	get(key) {
		const result = this.data.get(key.toString());
		if (result == null) throw new NotFoundError();
		return result;
	}
	has(key) {
		return this.data.has(key.toString());
	}
	delete(key) {
		this.data.delete(key.toString());
	}
	*_all() {
		for (const [key, value] of this.data.entries()) yield {
			key: new Key(key),
			value
		};
	}
	*_allKeys() {
		for (const key of this.data.keys()) yield new Key(key);
	}
};
new Key(SHARDING_FN);
logger("datastore:core:tiered");
//#endregion
//#region vendor/ipld-explorer-components/node_modules/@helia/http/dist/src/index.js
/**
* @packageDocumentation
*
* Exports a `createHeliaHTTP` function that returns an object that implements a lightweight version of the {@link Helia} API that functions only over HTTP.
*
* By default, content and peer routing are requests are resolved using the [Delegated HTTP Routing API](https://specs.ipfs.tech/routing/http-routing-v1/) and blocks are fetched from [Trustless Gateways](https://specs.ipfs.tech/http-gateways/trustless-gateway/).
*
* Pass it to other modules like {@link https://www.npmjs.com/package/@helia/unixfs | @helia/unixfs} to fetch files from the distributed web.
*
* @example
*
* ```typescript
* import { createHeliaHTTP } from '@helia/http'
* import { unixfs } from '@helia/unixfs'
* import { CID } from 'multiformats/cid'
*
* const helia = await createHeliaHTTP()
*
* const fs = unixfs(helia)
* fs.cat(CID.parse('bafyFoo'))
* ```
* @example with custom gateways and delegated routing endpoints
* ```typescript
* import { createHeliaHTTP } from '@helia/http'
* import { trustlessGateway } from '@helia/block-brokers'
* import { delegatedHTTPRouting, httpGatewayRouting } from '@helia/routers'
* import { unixfs } from '@helia/unixfs'
* import { CID } from 'multiformats/cid'
*
* const helia = await createHeliaHTTP({
*   blockBrokers: [
*     trustlessGateway()
*   ],
*   routers: [
*     delegatedHTTPRouting('https://delegated-ipfs.dev'),
*     httpGatewayRouting({
*       gateways: ['https://cloudflare-ipfs.com', 'https://ipfs.io']
*     })
*   ]
* })
*
* const fs = unixfs(helia)
* fs.cat(CID.parse('bafyFoo'))
* ```
*/
/**
* Create and return a Helia node
*/
async function createHeliaHTTP(init = {}) {
	const datastore = init.datastore ?? new MemoryDatastore();
	const blockstore = init.blockstore ?? new MemoryBlockstore();
	const helia = new Helia({
		...init,
		datastore,
		blockstore,
		blockBrokers: init.blockBrokers ?? [trustlessGateway()],
		routers: init.routers ?? [delegatedHTTPRouting("https://delegated-ipfs.dev"), httpGatewayRouting()]
	});
	if (init.start !== false) await helia.start();
	return helia;
}
//#endregion
//#region vendor/ipld-explorer-components/src/lib/init-helia.ts
var localStorageKey = "explore.ipld.gatewayEnabled";
console.info(`🎛️ Customise whether ipld-explorer-components fetches content from gateways by setting an '${localStorageKey}' value to true/false in localStorage. e.g. localStorage.setItem('${localStorageKey}', false) -- NOTE: defaults to true`);
/**
* Whether to enable remote gateways for fetching content. We default to true if the setting is not present.
*/
function areRemoteGatewaysEnabled() {
	const gatewayEnabledSetting = localStorage.getItem(localStorageKey);
	return gatewayEnabledSetting != null ? JSON.parse(gatewayEnabledSetting) : true;
}
async function initHelia(kuboGatewayOptions) {
	const routers = [];
	const kuboGatewayUrlString = `${kuboGatewayOptions.protocol ?? "http"}://${kuboGatewayOptions.host}:${kuboGatewayOptions.port}`;
	try {
		const kuboGatewayUrl = new URL(kuboGatewayUrlString);
		routers.push(httpGatewayRouting({ gateways: [kuboGatewayUrl.href] }));
	} catch (error) {
		console.error("Invalid kuboGateway url string: %s", kuboGatewayUrlString, error);
	}
	if (areRemoteGatewaysEnabled()) {
		console.log("remote gateways and delegated routing are enabled");
		routers.push(delegatedHTTPRouting("https://delegated-ipfs.dev"));
		routers.push(httpGatewayRouting());
	}
	const helia = await createHeliaHTTP({
		blockBrokers: [trustlessGateway(kuboGatewayOptions.trustlessBlockBrokerConfig?.init)],
		routers,
		hashers: await getHashersForCodes(17, 18, 19, 20, 27, 30, 45600, 45632)
	});
	await Promise.allSettled([
		addDagNodeToHelia(helia, "dag-json", { hello: "world" }),
		addDagNodeToHelia(helia, "dag-cbor", { hello: "world" }, 27),
		addDagNodeToHelia(helia, "json", { hello: "world" }, 20),
		addDagNodeToHelia(helia, "json", { hello: "world" }, 30),
		addDagNodeToHelia(helia, "raw", new TextEncoder().encode("hello"), 30),
		addDagNodeToHelia(helia, "dag-pb", {
			Data: new TextEncoder().encode("hello"),
			Links: []
		}, 45600),
		addDagNodeToHelia(helia, "dag-pb", {
			Data: new TextEncoder().encode("hello"),
			Links: []
		}, 45632)
	]);
	return helia;
}
//#endregion
//#region vendor/ipld-explorer-components/src/providers/helia.tsx
var defaultKuboGatewayOptions = {
	host: "127.0.0.1",
	port: "8080",
	protocol: "http",
	trustlessBlockBrokerConfig: { init: { allowLocal: true } }
};
var getDefaultKuboGatewayOptions = () => {
	const localStorageKuboGatewayOptions = localStorage.getItem("kuboGateway");
	if (localStorageKuboGatewayOptions != null) try {
		const kuboGatewaySettings = JSON.parse(localStorageKuboGatewayOptions);
		return {
			...defaultKuboGatewayOptions,
			...kuboGatewaySettings
		};
	} catch (e) {
		console.error("getDefaultKuboGatewayOptions error", e);
	}
	return defaultKuboGatewayOptions;
};
var HeliaContext = createContext(void 0);
var HeliaProvider = ({ children }) => {
	const [helia, setHelia] = useState(null);
	const [kuboGatewayOptions, setKuboGatewayOptions] = useState(getDefaultKuboGatewayOptions);
	const [error, setError] = useState(null);
	const request = useRef(null);
	useEffect(() => () => {
		const current = request.current;
		request.current = null;
		current?.promise.then((node) => node.stop().catch((failure) => {
			console.warn("Unable to stop Explorer node", failure);
		}), () => {});
	}, []);
	const selectHeliaReady = useCallback(() => helia !== null, [helia]);
	const selectHeliaIdentity = useCallback(() => {
		return `@helia/http@${package_default.devDependencies["@helia/http"]}`;
	}, []);
	const setKuboGatewayOptionsPublic = useCallback((kuboGatewayOptions) => {
		setKuboGatewayOptions((current) => ({
			...current,
			...kuboGatewayOptions
		}));
	}, []);
	const doInitHelia = useCallback(() => {
		if (request.current != null) return request.current.completion;
		const current = {
			promise: initHelia(kuboGatewayOptions),
			completion: Promise.resolve()
		};
		request.current = current;
		current.completion = current.promise.then((node) => {
			if (request.current !== current) return;
			setError(null);
			setHelia(node);
		}).catch((failure) => {
			if (request.current !== current) return;
			request.current = null;
			console.error("doInitHelia error", failure);
			setError(failure);
			setHelia(null);
		});
		return current.completion;
	}, [kuboGatewayOptions]);
	const value = useMemo(() => ({
		helia,
		error,
		kuboGatewayOptions,
		selectHeliaReady,
		selectHeliaIdentity,
		doInitHelia,
		setKuboGatewayOptions: setKuboGatewayOptionsPublic
	}), [
		helia,
		error,
		kuboGatewayOptions,
		selectHeliaReady,
		selectHeliaIdentity,
		doInitHelia,
		setKuboGatewayOptionsPublic
	]);
	return /* @__PURE__ */ jsx(HeliaContext.Provider, {
		value,
		children
	});
};
var useHelia = () => {
	const context = useContext(HeliaContext);
	if (context === void 0) throw new Error("useHelia must be used within a HeliaProvider");
	return context;
};
//#endregion
//#region vendor/ipld-explorer-components/src/providers/explore.tsx
var ExploreContext = createContext(void 0);
var getCidFromCidOrFqdn = (cidOrFqdn) => {
	if (typeof cidOrFqdn === "object" && "multihash" in cidOrFqdn) return cidOrFqdn;
	if (cidOrFqdn.toString().startsWith("/ipfs/")) return CID.parse(cidOrFqdn.slice(6));
	if (cidOrFqdn.toString().startsWith("/ipns/")) throw new Error("ipns not supported yet");
	if (cidOrFqdn.startsWith("/")) return CID.parse(cidOrFqdn.slice(1));
	return CID.parse(cidOrFqdn);
};
var processPath = (path, pathPrefix) => {
	let newPath = path;
	if (newPath != null) {
		if (newPath.startsWith(pathPrefix)) newPath = newPath.slice(pathPrefix.length);
		if (newPath.startsWith("/")) newPath = newPath.slice(1);
		if (newPath === "") newPath = null;
		else try {
			newPath = decodeURIComponent(newPath);
		} catch {}
	}
	return newPath;
};
var defaultState = {
	path: null,
	targetNode: null,
	canonicalPath: "",
	localPath: "",
	nodes: [],
	pathBoundaries: [],
	error: null
};
var ExploreProvider = ({ children, state, explorePathPrefix = "#/explore" }) => {
	const [exploreState, setExploreState] = useState(() => ({
		...defaultState,
		...state,
		path: processPath(state?.path === void 0 ? window.location.hash : state.path, explorePathPrefix)
	}));
	const { helia } = useHelia();
	const [isLoading, setIsLoading] = useState(false);
	const { path } = exploreState;
	useEffect(() => {
		let active = true;
		setIsLoading(true);
		(async () => {
			if (path == null || helia == null) return;
			setExploreState((exploreState) => ({
				...exploreState,
				targetNode: null,
				canonicalPath: "",
				localPath: "",
				nodes: [],
				pathBoundaries: [],
				error: null
			}));
			const pathParts = parseIpldPath(path);
			if (pathParts == null || helia == null) return;
			const { cidOrFqdn, rest } = pathParts;
			try {
				const cid = getCidFromCidOrFqdn(cidOrFqdn);
				const { targetNode, canonicalPath, localPath, nodes, pathBoundaries } = await resolveIpldPath(helia, cid, rest);
				if (!active) return;
				setExploreState((curr) => ({
					...curr,
					targetNode,
					canonicalPath,
					localPath,
					nodes,
					pathBoundaries,
					error: null
				}));
			} catch (error) {
				if (!active) return;
				console.warn("Failed to resolve path", path, error);
				setExploreState((prevState) => ({
					...prevState,
					error
				}));
			}
		})().catch((err) => {
			if (!active) return;
			console.error("Error fetching explore data", err);
			setExploreState((prevState) => ({
				...prevState,
				error: err
			}));
		}).finally(() => {
			if (active) setIsLoading(false);
		});
		return () => {
			active = false;
		};
	}, [helia, path]);
	const setExplorePath = useCallback((path) => {
		if (path != null && !window.location.href.includes(path)) throw new Error("setExplorePath should only be used to update the state, not the URL. If you are using a routing library that doesn't allow you to listen to hashchange events, ensure the URL is updated prior to calling setExplorePath.");
		const newPath = processPath(path, explorePathPrefix);
		setExploreState((exploreState) => exploreState.path === newPath ? exploreState : {
			...defaultState,
			path: newPath
		});
	}, [explorePathPrefix]);
	const doExploreLink = useCallback((link) => {
		const { nodes, pathBoundaries } = exploreState;
		if (!nodes[0]) return;
		const cid = nodes[0].cid;
		const pathParts = pathBoundaries.map((p) => p.path);
		if (link?.path != null) pathParts.push(link.path);
		pathParts.unshift(cid);
		const path = pathParts.map((part) => encodeURIComponent(part)).join("/");
		const hash = `${explorePathPrefix}/${path}`;
		window.location.hash = hash;
		setExplorePath(path);
	}, [
		exploreState,
		explorePathPrefix,
		setExplorePath
	]);
	/**
	* @deprecated - use setExplorePath instead
	*/
	const doExploreUserProvidedPath = useCallback((path) => {
		const hash = path != null ? `${explorePathPrefix}${ensureLeadingSlash(path)}` : explorePathPrefix;
		window.location.hash = hash;
	}, [explorePathPrefix]);
	const doUploadUserProvidedCar = useCallback(async (file, uploadImage) => {
		if (helia == null) {
			console.error("FIXME: Helia not ready yet, but user tried to upload a car file");
			return;
		}
		try {
			const rootCid = await importCar(file, helia);
			const hash = rootCid.toString() != null ? `${explorePathPrefix}${ensureLeadingSlash(rootCid.toString())}` : explorePathPrefix;
			window.location.hash = hash;
			const imageFileLoader = document.getElementById("car-loader-image");
			if (imageFileLoader != null) imageFileLoader.src = uploadImage;
		} catch (err) {
			console.error("Could not import car file", err);
		}
	}, [explorePathPrefix, helia]);
	const value = useMemo(() => ({
		exploreState,
		explorePathPrefix,
		isLoading,
		doExploreLink,
		doExploreUserProvidedPath,
		doUploadUserProvidedCar,
		setExplorePath
	}), [
		exploreState,
		explorePathPrefix,
		isLoading,
		doExploreLink,
		doExploreUserProvidedPath,
		doUploadUserProvidedCar,
		setExplorePath
	]);
	return /* @__PURE__ */ jsx(ExploreContext.Provider, {
		value,
		children
	});
};
var useExplore = () => {
	const context = useContext(ExploreContext);
	if (context === void 0) throw new Error("useExplore must be used within an ExploreProvider");
	return context;
};
//#endregion
export { useHelia as a, getHasherForCode as c, decode$4 as d, encode$4 as f, HeliaProvider as i, getCodecOrNull as l, ExploreProvider as n, isTruthy as o, bases as p, useExplore as r, getCodecNameFromCode as s, ExploreContext as t, toCidOrNull as u };
