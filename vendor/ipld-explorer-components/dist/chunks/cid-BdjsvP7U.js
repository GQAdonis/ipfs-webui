import { n as equals$1, t as coerce } from "./bytes-CKiE5OTq.js";
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod, mod.exports), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/vendor/base-x.js
/**
* @param {string} ALPHABET
* @param {any} name
*/
function base(ALPHABET, name) {
	if (ALPHABET.length >= 255) throw new TypeError("Alphabet too long");
	var BASE_MAP = /* @__PURE__ */ new Uint8Array(256);
	for (var j = 0; j < BASE_MAP.length; j++) BASE_MAP[j] = 255;
	for (var i = 0; i < ALPHABET.length; i++) {
		var x = ALPHABET.charAt(i);
		var xc = x.charCodeAt(0);
		if (BASE_MAP[xc] !== 255) throw new TypeError(x + " is ambiguous");
		BASE_MAP[xc] = i;
	}
	var BASE = ALPHABET.length;
	var LEADER = ALPHABET.charAt(0);
	var FACTOR = Math.log(BASE) / Math.log(256);
	var iFACTOR = Math.log(256) / Math.log(BASE);
	/**
	* @param {any[] | Iterable<number>} source
	*/
	function encode(source) {
		if (source instanceof Uint8Array);
		else if (ArrayBuffer.isView(source)) source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
		else if (Array.isArray(source)) source = Uint8Array.from(source);
		if (!(source instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
		if (source.length === 0) return "";
		var zeroes = 0;
		var length = 0;
		var pbegin = 0;
		var pend = source.length;
		while (pbegin !== pend && source[pbegin] === 0) {
			pbegin++;
			zeroes++;
		}
		var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
		var b58 = new Uint8Array(size);
		while (pbegin !== pend) {
			var carry = source[pbegin];
			var i = 0;
			for (var it1 = size - 1; (carry !== 0 || i < length) && it1 !== -1; it1--, i++) {
				carry += 256 * b58[it1] >>> 0;
				b58[it1] = carry % BASE >>> 0;
				carry = carry / BASE >>> 0;
			}
			if (carry !== 0) throw new Error("Non-zero carry");
			length = i;
			pbegin++;
		}
		var it2 = size - length;
		while (it2 !== size && b58[it2] === 0) it2++;
		var str = LEADER.repeat(zeroes);
		for (; it2 < size; ++it2) str += ALPHABET.charAt(b58[it2]);
		return str;
	}
	/**
	* @param {string | string[]} source
	*/
	function decodeUnsafe(source) {
		if (typeof source !== "string") throw new TypeError("Expected String");
		if (source.length === 0) return /* @__PURE__ */ new Uint8Array();
		var psz = 0;
		if (source[psz] === " ") return;
		var zeroes = 0;
		var length = 0;
		while (source[psz] === LEADER) {
			zeroes++;
			psz++;
		}
		var size = (source.length - psz) * FACTOR + 1 >>> 0;
		var b256 = new Uint8Array(size);
		while (source[psz]) {
			var carry = BASE_MAP[source.charCodeAt(psz)];
			if (carry === 255) return;
			var i = 0;
			for (var it3 = size - 1; (carry !== 0 || i < length) && it3 !== -1; it3--, i++) {
				carry += BASE * b256[it3] >>> 0;
				b256[it3] = carry % 256 >>> 0;
				carry = carry / 256 >>> 0;
			}
			if (carry !== 0) throw new Error("Non-zero carry");
			length = i;
			psz++;
		}
		if (source[psz] === " ") return;
		var it4 = size - length;
		while (it4 !== size && b256[it4] === 0) it4++;
		var vch = new Uint8Array(zeroes + (size - it4));
		var j = zeroes;
		while (it4 !== size) vch[j++] = b256[it4++];
		return vch;
	}
	/**
	* @param {string | string[]} string
	*/
	function decode(string) {
		var buffer = decodeUnsafe(string);
		if (buffer) return buffer;
		throw new Error(`Non-${name} character`);
	}
	return {
		encode,
		decodeUnsafe,
		decode
	};
}
var _brrp__multiformats_scope_baseX = base;
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/bases/base.js
/**
* Class represents both BaseEncoder and MultibaseEncoder meaning it
* can be used to encode to multibase or base encode without multibase
* prefix.
*/
var Encoder = class {
	name;
	prefix;
	baseEncode;
	constructor(name, prefix, baseEncode) {
		this.name = name;
		this.prefix = prefix;
		this.baseEncode = baseEncode;
	}
	encode(bytes) {
		if (bytes instanceof Uint8Array) return `${this.prefix}${this.baseEncode(bytes)}`;
		else throw Error("Unknown type, must be binary type");
	}
};
/**
* Class represents both BaseDecoder and MultibaseDecoder so it could be used
* to decode multibases (with matching prefix) or just base decode strings
* with corresponding base encoding.
*/
var Decoder = class {
	name;
	prefix;
	baseDecode;
	prefixCodePoint;
	constructor(name, prefix, baseDecode) {
		this.name = name;
		this.prefix = prefix;
		const prefixCodePoint = prefix.codePointAt(0);
		/* c8 ignore next 3 */
		if (prefixCodePoint === void 0) throw new Error("Invalid prefix character");
		this.prefixCodePoint = prefixCodePoint;
		this.baseDecode = baseDecode;
	}
	decode(text) {
		if (typeof text === "string") {
			if (text.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
			return this.baseDecode(text.slice(this.prefix.length));
		} else throw Error("Can only multibase decode strings");
	}
	or(decoder) {
		return or(this, decoder);
	}
};
var ComposedDecoder = class {
	decoders;
	constructor(decoders) {
		this.decoders = decoders;
	}
	or(decoder) {
		return or(this, decoder);
	}
	decode(input) {
		const prefix = input[0];
		const decoder = this.decoders[prefix];
		if (decoder != null) return decoder.decode(input);
		else throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
	}
};
function or(left, right) {
	return new ComposedDecoder({
		...left.decoders ?? { [left.prefix]: left },
		...right.decoders ?? { [right.prefix]: right }
	});
}
var Codec = class {
	name;
	prefix;
	baseEncode;
	baseDecode;
	encoder;
	decoder;
	constructor(name, prefix, baseEncode, baseDecode) {
		this.name = name;
		this.prefix = prefix;
		this.baseEncode = baseEncode;
		this.baseDecode = baseDecode;
		this.encoder = new Encoder(name, prefix, baseEncode);
		this.decoder = new Decoder(name, prefix, baseDecode);
	}
	encode(input) {
		return this.encoder.encode(input);
	}
	decode(input) {
		return this.decoder.decode(input);
	}
};
function from({ name, prefix, encode, decode }) {
	return new Codec(name, prefix, encode, decode);
}
function baseX({ name, prefix, alphabet }) {
	const { encode, decode } = _brrp__multiformats_scope_baseX(alphabet, name);
	return from({
		prefix,
		name,
		encode,
		decode: (text) => coerce(decode(text))
	});
}
function decode$3(string, alphabet, bitsPerChar, name) {
	const codes = {};
	for (let i = 0; i < alphabet.length; ++i) codes[alphabet[i]] = i;
	let end = string.length;
	while (string[end - 1] === "=") --end;
	const out = new Uint8Array(end * bitsPerChar / 8 | 0);
	let bits = 0;
	let buffer = 0;
	let written = 0;
	for (let i = 0; i < end; ++i) {
		const value = codes[string[i]];
		if (value === void 0) throw new SyntaxError(`Non-${name} character`);
		buffer = buffer << bitsPerChar | value;
		bits += bitsPerChar;
		if (bits >= 8) {
			bits -= 8;
			out[written++] = 255 & buffer >> bits;
		}
	}
	if (bits >= bitsPerChar || (255 & buffer << 8 - bits) !== 0) throw new SyntaxError("Unexpected end of data");
	return out;
}
function encode$1(data, alphabet, bitsPerChar) {
	const pad = alphabet[alphabet.length - 1] === "=";
	const mask = (1 << bitsPerChar) - 1;
	let out = "";
	let bits = 0;
	let buffer = 0;
	for (let i = 0; i < data.length; ++i) {
		buffer = buffer << 8 | data[i];
		bits += 8;
		while (bits > bitsPerChar) {
			bits -= bitsPerChar;
			out += alphabet[mask & buffer >> bits];
		}
	}
	if (bits !== 0) out += alphabet[mask & buffer << bitsPerChar - bits];
	if (pad) while ((out.length * bitsPerChar & 7) !== 0) out += "=";
	return out;
}
/**
* RFC4648 Factory
*/
function rfc4648({ name, prefix, bitsPerChar, alphabet }) {
	return from({
		prefix,
		name,
		encode(input) {
			return encode$1(input, alphabet, bitsPerChar);
		},
		decode(input) {
			return decode$3(input, alphabet, bitsPerChar, name);
		}
	});
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/bases/base32.js
var base32_exports = /* @__PURE__ */ __exportAll({
	base32: () => base32,
	base32hex: () => base32hex,
	base32hexpad: () => base32hexpad,
	base32hexpadupper: () => base32hexpadupper,
	base32hexupper: () => base32hexupper,
	base32pad: () => base32pad,
	base32padupper: () => base32padupper,
	base32upper: () => base32upper,
	base32z: () => base32z
});
var base32 = rfc4648({
	prefix: "b",
	name: "base32",
	alphabet: "abcdefghijklmnopqrstuvwxyz234567",
	bitsPerChar: 5
});
var base32upper = rfc4648({
	prefix: "B",
	name: "base32upper",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
	bitsPerChar: 5
});
var base32pad = rfc4648({
	prefix: "c",
	name: "base32pad",
	alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
	bitsPerChar: 5
});
var base32padupper = rfc4648({
	prefix: "C",
	name: "base32padupper",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
	bitsPerChar: 5
});
var base32hex = rfc4648({
	prefix: "v",
	name: "base32hex",
	alphabet: "0123456789abcdefghijklmnopqrstuv",
	bitsPerChar: 5
});
var base32hexupper = rfc4648({
	prefix: "V",
	name: "base32hexupper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
	bitsPerChar: 5
});
var base32hexpad = rfc4648({
	prefix: "t",
	name: "base32hexpad",
	alphabet: "0123456789abcdefghijklmnopqrstuv=",
	bitsPerChar: 5
});
var base32hexpadupper = rfc4648({
	prefix: "T",
	name: "base32hexpadupper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
	bitsPerChar: 5
});
var base32z = rfc4648({
	prefix: "h",
	name: "base32z",
	alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
	bitsPerChar: 5
});
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/bases/base36.js
var base36_exports = /* @__PURE__ */ __exportAll({
	base36: () => base36,
	base36upper: () => base36upper
});
var base36 = baseX({
	prefix: "k",
	name: "base36",
	alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
});
var base36upper = baseX({
	prefix: "K",
	name: "base36upper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/bases/base58.js
var base58_exports = /* @__PURE__ */ __exportAll({
	base58btc: () => base58btc,
	base58flickr: () => base58flickr
});
var base58btc = baseX({
	name: "base58btc",
	prefix: "z",
	alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr = baseX({
	name: "base58flickr",
	prefix: "Z",
	alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/vendor/varint.js
var encode_1 = encode;
var MSB = 128;
var MSBALL = -128;
var INT = Math.pow(2, 31);
/**
* @param {number} num
* @param {number[]} out
* @param {number} offset
*/
function encode(num, out, offset) {
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
var decode$2 = read;
var MSB$1 = 128;
var REST$1 = 127;
/**
* @param {string | any[]} buf
* @param {number} offset
*/
function read(buf, offset) {
	var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf.length;
	do {
		if (counter >= l) {
			read.bytes = 0;
			throw new RangeError("Could not decode varint");
		}
		b = buf[counter++];
		res += shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift);
		shift += 7;
	} while (b >= MSB$1);
	read.bytes = counter - offset;
	return res;
}
var N1 = Math.pow(2, 7);
var N2 = Math.pow(2, 14);
var N3 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
var N8 = Math.pow(2, 56);
var N9 = Math.pow(2, 63);
var length = function(value) {
	return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
};
var _brrp_varint = {
	encode: encode_1,
	decode: decode$2,
	encodingLength: length
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/varint.js
function decode$1(data, offset = 0) {
	return [_brrp_varint.decode(data, offset), _brrp_varint.decode.bytes];
}
function encodeTo(int, target, offset = 0) {
	_brrp_varint.encode(int, target, offset);
	return target;
}
function encodingLength(int) {
	return _brrp_varint.encodingLength(int);
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/hashes/digest.js
/**
* Creates a multihash digest.
*/
function create(code, digest) {
	const size = digest.byteLength;
	const sizeOffset = encodingLength(code);
	const digestOffset = sizeOffset + encodingLength(size);
	const bytes = new Uint8Array(digestOffset + size);
	encodeTo(code, bytes, 0);
	encodeTo(size, bytes, sizeOffset);
	bytes.set(digest, digestOffset);
	return new Digest(code, size, digest, bytes);
}
/**
* Turns bytes representation of multihash digest into an instance.
*/
function decode(multihash) {
	const bytes = coerce(multihash);
	const [code, sizeOffset] = decode$1(bytes);
	const [size, digestOffset] = decode$1(bytes.subarray(sizeOffset));
	const digest = bytes.subarray(sizeOffset + digestOffset);
	if (digest.byteLength !== size) throw new Error("Incorrect length");
	return new Digest(code, size, digest, bytes);
}
function equals(a, b) {
	if (a === b) return true;
	else {
		const data = b;
		return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals$1(a.bytes, data.bytes);
	}
}
/**
* Represents a multihash digest which carries information about the
* hashing algorithm and an actual hash digest.
*/
var Digest = class {
	code;
	size;
	digest;
	bytes;
	/**
	* Creates a multihash digest.
	*/
	constructor(code, size, digest, bytes) {
		this.code = code;
		this.size = size;
		this.digest = digest;
		this.bytes = bytes;
	}
};
//#endregion
//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/cid.js
function format(link, base) {
	const { bytes, version } = link;
	switch (version) {
		case 0: return toStringV0(bytes, baseCache(link), base ?? base58btc.encoder);
		default: return toStringV1(bytes, baseCache(link), base ?? base32.encoder);
	}
}
var cache = /* @__PURE__ */ new WeakMap();
function baseCache(cid) {
	const baseCache = cache.get(cid);
	if (baseCache == null) {
		const baseCache = /* @__PURE__ */ new Map();
		cache.set(cid, baseCache);
		return baseCache;
	}
	return baseCache;
}
var CID = class CID {
	code;
	version;
	multihash;
	bytes;
	"/";
	/**
	* @param version - Version of the CID
	* @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
	* @param multihash - (Multi)hash of the of the content.
	*/
	constructor(version, code, multihash, bytes) {
		this.code = code;
		this.version = version;
		this.multihash = multihash;
		this.bytes = bytes;
		this["/"] = bytes;
	}
	/**
	* Signalling `cid.asCID === cid` has been replaced with `cid['/'] === cid.bytes`
	* please either use `CID.asCID(cid)` or switch to new signalling mechanism
	*
	* @deprecated
	*/
	get asCID() {
		return this;
	}
	get byteOffset() {
		return this.bytes.byteOffset;
	}
	get byteLength() {
		return this.bytes.byteLength;
	}
	toV0() {
		switch (this.version) {
			case 0: return this;
			case 1: {
				const { code, multihash } = this;
				if (code !== DAG_PB_CODE) throw new Error("Cannot convert a non dag-pb CID to CIDv0");
				if (multihash.code !== SHA_256_CODE) throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
				return CID.createV0(multihash);
			}
			default: throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
		}
	}
	toV1() {
		switch (this.version) {
			case 0: {
				const { code, digest } = this.multihash;
				const multihash = create(code, digest);
				return CID.createV1(this.code, multihash);
			}
			case 1: return this;
			default: throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`);
		}
	}
	equals(other) {
		return CID.equals(this, other);
	}
	static equals(self, other) {
		const unknown = other;
		return unknown != null && self.code === unknown.code && self.version === unknown.version && equals(self.multihash, unknown.multihash);
	}
	toString(base) {
		return format(this, base);
	}
	toJSON() {
		return { "/": format(this) };
	}
	link() {
		return this;
	}
	[Symbol.toStringTag] = "CID";
	[Symbol.for("nodejs.util.inspect.custom")]() {
		return `CID(${this.toString()})`;
	}
	/**
	* Takes any input `value` and returns a `CID` instance if it was
	* a `CID` otherwise returns `null`. If `value` is instanceof `CID`
	* it will return value back. If `value` is not instance of this CID
	* class, but is compatible CID it will return new instance of this
	* `CID` class. Otherwise returns null.
	*
	* This allows two different incompatible versions of CID library to
	* co-exist and interop as long as binary interface is compatible.
	*/
	static asCID(input) {
		if (input == null) return null;
		const value = input;
		if (value instanceof CID) return value;
		else if (value["/"] != null && value["/"] === value.bytes || value.asCID === value) {
			const { version, code, multihash, bytes } = value;
			return new CID(version, code, multihash, bytes ?? encodeCID(version, code, multihash.bytes));
		} else if (value[cidSymbol] === true) {
			const { version, multihash, code } = value;
			const digest = decode(multihash);
			return CID.create(version, code, digest);
		} else return null;
	}
	/**
	* @param version - Version of the CID
	* @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
	* @param digest - (Multi)hash of the of the content.
	*/
	static create(version, code, digest) {
		if (typeof code !== "number") throw new Error("String codecs are no longer supported");
		if (!(digest.bytes instanceof Uint8Array)) throw new Error("Invalid digest");
		switch (version) {
			case 0: if (code !== DAG_PB_CODE) throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
			else return new CID(version, code, digest, digest.bytes);
			case 1: {
				const bytes = encodeCID(version, code, digest.bytes);
				return new CID(version, code, digest, bytes);
			}
			default: throw new Error("Invalid version");
		}
	}
	/**
	* Simplified version of `create` for CIDv0.
	*/
	static createV0(digest) {
		return CID.create(0, DAG_PB_CODE, digest);
	}
	/**
	* Simplified version of `create` for CIDv1.
	*
	* @param code - Content encoding format code.
	* @param digest - Multihash of the content.
	*/
	static createV1(code, digest) {
		return CID.create(1, code, digest);
	}
	/**
	* Decoded a CID from its binary representation. The byte array must contain
	* only the CID with no additional bytes.
	*
	* An error will be thrown if the bytes provided do not contain a valid
	* binary representation of a CID.
	*/
	static decode(bytes) {
		const [cid, remainder] = CID.decodeFirst(bytes);
		if (remainder.length !== 0) throw new Error("Incorrect length");
		return cid;
	}
	/**
	* Decoded a CID from its binary representation at the beginning of a byte
	* array.
	*
	* Returns an array with the first element containing the CID and the second
	* element containing the remainder of the original byte array. The remainder
	* will be a zero-length byte array if the provided bytes only contained a
	* binary CID representation.
	*/
	static decodeFirst(bytes) {
		const specs = CID.inspectBytes(bytes);
		const prefixSize = specs.size - specs.multihashSize;
		const multihashBytes = coerce(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
		if (multihashBytes.byteLength !== specs.multihashSize) throw new Error("Incorrect length");
		const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
		const digest = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
		return [specs.version === 0 ? CID.createV0(digest) : CID.createV1(specs.codec, digest), bytes.subarray(specs.size)];
	}
	/**
	* Inspect the initial bytes of a CID to determine its properties.
	*
	* Involves decoding up to 4 varints. Typically this will require only 4 to 6
	* bytes but for larger multicodec code values and larger multihash digest
	* lengths these varints can be quite large. It is recommended that at least
	* 10 bytes be made available in the `initialBytes` argument for a complete
	* inspection.
	*/
	static inspectBytes(initialBytes) {
		let offset = 0;
		const next = () => {
			const [i, length] = decode$1(initialBytes.subarray(offset));
			offset += length;
			return i;
		};
		let version = next();
		let codec = DAG_PB_CODE;
		if (version === 18) {
			version = 0;
			offset = 0;
		} else codec = next();
		if (version !== 0 && version !== 1) throw new RangeError(`Invalid CID version ${version}`);
		const prefixSize = offset;
		const multihashCode = next();
		const digestSize = next();
		const size = offset + digestSize;
		const multihashSize = size - prefixSize;
		return {
			version,
			codec,
			multihashCode,
			digestSize,
			multihashSize,
			size
		};
	}
	/**
	* Takes cid in a string representation and creates an instance. If `base`
	* decoder is not provided will use a default from the configuration. It will
	* throw an error if encoding of the CID is not compatible with supplied (or
	* a default decoder).
	*/
	static parse(source, base) {
		const [prefix, bytes] = parseCIDtoBytes(source, base);
		const cid = CID.decode(bytes);
		if (cid.version === 0 && source[0] !== "Q") throw Error("Version 0 CID string must not include multibase prefix");
		baseCache(cid).set(prefix, source);
		return cid;
	}
};
function parseCIDtoBytes(source, base) {
	switch (source[0]) {
		case "Q": {
			const decoder = base ?? base58btc;
			return [base58btc.prefix, decoder.decode(`${base58btc.prefix}${source}`)];
		}
		case base58btc.prefix: {
			const decoder = base ?? base58btc;
			return [base58btc.prefix, decoder.decode(source)];
		}
		case base32.prefix: {
			const decoder = base ?? base32;
			return [base32.prefix, decoder.decode(source)];
		}
		case base36.prefix: {
			const decoder = base ?? base36;
			return [base36.prefix, decoder.decode(source)];
		}
		default:
			if (base == null) throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");
			return [source[0], base.decode(source)];
	}
}
function toStringV0(bytes, cache, base) {
	const { prefix } = base;
	if (prefix !== base58btc.prefix) throw Error(`Cannot string encode V0 in ${base.name} encoding`);
	const cid = cache.get(prefix);
	if (cid == null) {
		const cid = base.encode(bytes).slice(1);
		cache.set(prefix, cid);
		return cid;
	} else return cid;
}
function toStringV1(bytes, cache, base) {
	const { prefix } = base;
	const cid = cache.get(prefix);
	if (cid == null) {
		const cid = base.encode(bytes);
		cache.set(prefix, cid);
		return cid;
	} else return cid;
}
var DAG_PB_CODE = 112;
var SHA_256_CODE = 18;
function encodeCID(version, code, multihash) {
	const codeOffset = encodingLength(version);
	const hashOffset = codeOffset + encodingLength(code);
	const bytes = new Uint8Array(hashOffset + multihash.byteLength);
	encodeTo(version, bytes, 0);
	encodeTo(code, bytes, codeOffset);
	bytes.set(multihash, hashOffset);
	return bytes;
}
var cidSymbol = Symbol.for("@ipld/js-cid/CID");
//#endregion
export { base58btc as a, base32 as c, from as d, rfc4648 as f, __toESM as g, __require as h, base58_exports as i, base32_exports as l, __exportAll as m, create as n, base36 as o, __commonJSMin as p, decode as r, base36_exports as s, CID as t, baseX as u };
