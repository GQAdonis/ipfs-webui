//#region vendor/ipld-explorer-components/node_modules/hash-wasm/dist/index.esm.js
/*!
* hash-wasm (https://www.npmjs.com/package/hash-wasm)
* (c) Dani Biro
* @license MIT
*/
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __awaiter(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
}
var Mutex = class {
	constructor() {
		this.mutex = Promise.resolve();
	}
	lock() {
		let begin = () => {};
		this.mutex = this.mutex.then(() => new Promise(begin));
		return new Promise((res) => {
			begin = res;
		});
	}
	dispatch(fn) {
		return __awaiter(this, void 0, void 0, function* () {
			const unlock = yield this.lock();
			try {
				return yield Promise.resolve(fn());
			} finally {
				unlock();
			}
		});
	}
};
var _a;
function getGlobal() {
	if (typeof globalThis !== "undefined") return globalThis;
	if (typeof self !== "undefined") return self;
	if (typeof window !== "undefined") return window;
	return global;
}
var globalObject = getGlobal();
var nodeBuffer = (_a = globalObject.Buffer) !== null && _a !== void 0 ? _a : null;
var textEncoder = globalObject.TextEncoder ? new globalObject.TextEncoder() : null;
function hexCharCodesToInt(a, b) {
	return (a & 15) + (a >> 6 | a >> 3 & 8) << 4 | (b & 15) + (b >> 6 | b >> 3 & 8);
}
function writeHexToUInt8(buf, str) {
	const size = str.length >> 1;
	for (let i = 0; i < size; i++) {
		const index = i << 1;
		buf[i] = hexCharCodesToInt(str.charCodeAt(index), str.charCodeAt(index + 1));
	}
}
function hexStringEqualsUInt8(str, buf) {
	if (str.length !== buf.length * 2) return false;
	for (let i = 0; i < buf.length; i++) {
		const strIndex = i << 1;
		if (buf[i] !== hexCharCodesToInt(str.charCodeAt(strIndex), str.charCodeAt(strIndex + 1))) return false;
	}
	return true;
}
var alpha = "a".charCodeAt(0) - 10;
var digit = "0".charCodeAt(0);
function getDigestHex(tmpBuffer, input, hashLength) {
	let p = 0;
	for (let i = 0; i < hashLength; i++) {
		let nibble = input[i] >>> 4;
		tmpBuffer[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
		nibble = input[i] & 15;
		tmpBuffer[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
	}
	return String.fromCharCode.apply(null, tmpBuffer);
}
var getUInt8Buffer = nodeBuffer !== null ? (data) => {
	if (typeof data === "string") {
		const buf = nodeBuffer.from(data, "utf8");
		return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
	}
	if (nodeBuffer.isBuffer(data)) return new Uint8Array(data.buffer, data.byteOffset, data.length);
	if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
	throw new Error("Invalid data type!");
} : (data) => {
	if (typeof data === "string") return textEncoder.encode(data);
	if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
	throw new Error("Invalid data type!");
};
var base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64Lookup = /* @__PURE__ */ new Uint8Array(256);
for (let i = 0; i < 64; i++) base64Lookup[base64Chars.charCodeAt(i)] = i;
function getDecodeBase64Length(data) {
	let bufferLength = Math.floor(data.length * .75);
	const len = data.length;
	if (data[len - 1] === "=") {
		bufferLength -= 1;
		if (data[len - 2] === "=") bufferLength -= 1;
	}
	return bufferLength;
}
function decodeBase64(data) {
	const bufferLength = getDecodeBase64Length(data);
	const len = data.length;
	const bytes = new Uint8Array(bufferLength);
	let p = 0;
	for (let i = 0; i < len; i += 4) {
		const encoded1 = base64Lookup[data.charCodeAt(i)];
		const encoded2 = base64Lookup[data.charCodeAt(i + 1)];
		const encoded3 = base64Lookup[data.charCodeAt(i + 2)];
		const encoded4 = base64Lookup[data.charCodeAt(i + 3)];
		bytes[p] = encoded1 << 2 | encoded2 >> 4;
		p += 1;
		bytes[p] = (encoded2 & 15) << 4 | encoded3 >> 2;
		p += 1;
		bytes[p] = (encoded3 & 3) << 6 | encoded4 & 63;
		p += 1;
	}
	return bytes;
}
var MAX_HEAP = 16384;
var WASM_FUNC_HASH_LENGTH = 4;
var wasmMutex = new Mutex();
var wasmModuleCache = /* @__PURE__ */ new Map();
function WASMInterface(binary, hashLength) {
	return __awaiter(this, void 0, void 0, function* () {
		let wasmInstance = null;
		let memoryView = null;
		let initialized = false;
		if (typeof WebAssembly === "undefined") throw new Error("WebAssembly is not supported in this environment!");
		const writeMemory = (data, offset = 0) => {
			memoryView.set(data, offset);
		};
		const getMemory = () => memoryView;
		const getExports = () => wasmInstance.exports;
		const setMemorySize = (totalSize) => {
			wasmInstance.exports.Hash_SetMemorySize(totalSize);
			const arrayOffset = wasmInstance.exports.Hash_GetBuffer();
			const memoryBuffer = wasmInstance.exports.memory.buffer;
			memoryView = new Uint8Array(memoryBuffer, arrayOffset, totalSize);
		};
		const getStateSize = () => {
			return new DataView(wasmInstance.exports.memory.buffer).getUint32(wasmInstance.exports.STATE_SIZE, true);
		};
		const loadWASMPromise = wasmMutex.dispatch(() => __awaiter(this, void 0, void 0, function* () {
			if (!wasmModuleCache.has(binary.name)) {
				const asm = decodeBase64(binary.data);
				const promise = WebAssembly.compile(asm);
				wasmModuleCache.set(binary.name, promise);
			}
			const module = yield wasmModuleCache.get(binary.name);
			wasmInstance = yield WebAssembly.instantiate(module, {});
		}));
		const setupInterface = () => __awaiter(this, void 0, void 0, function* () {
			if (!wasmInstance) yield loadWASMPromise;
			const arrayOffset = wasmInstance.exports.Hash_GetBuffer();
			const memoryBuffer = wasmInstance.exports.memory.buffer;
			memoryView = new Uint8Array(memoryBuffer, arrayOffset, MAX_HEAP);
		});
		const init = (bits = null) => {
			initialized = true;
			wasmInstance.exports.Hash_Init(bits);
		};
		const updateUInt8Array = (data) => {
			let read = 0;
			while (read < data.length) {
				const chunk = data.subarray(read, read + MAX_HEAP);
				read += chunk.length;
				memoryView.set(chunk);
				wasmInstance.exports.Hash_Update(chunk.length);
			}
		};
		const update = (data) => {
			if (!initialized) throw new Error("update() called before init()");
			const Uint8Buffer = getUInt8Buffer(data);
			updateUInt8Array(Uint8Buffer);
		};
		const digestChars = new Uint8Array(hashLength * 2);
		const digest = (outputType, padding = null) => {
			if (!initialized) throw new Error("digest() called before init()");
			initialized = false;
			wasmInstance.exports.Hash_Final(padding);
			if (outputType === "binary") return memoryView.slice(0, hashLength);
			return getDigestHex(digestChars, memoryView, hashLength);
		};
		const save = () => {
			if (!initialized) throw new Error("save() can only be called after init() and before digest()");
			const stateOffset = wasmInstance.exports.Hash_GetState();
			const stateLength = getStateSize();
			const memoryBuffer = wasmInstance.exports.memory.buffer;
			const internalState = new Uint8Array(memoryBuffer, stateOffset, stateLength);
			const prefixedState = new Uint8Array(WASM_FUNC_HASH_LENGTH + stateLength);
			writeHexToUInt8(prefixedState, binary.hash);
			prefixedState.set(internalState, WASM_FUNC_HASH_LENGTH);
			return prefixedState;
		};
		const load = (state) => {
			if (!(state instanceof Uint8Array)) throw new Error("load() expects an Uint8Array generated by save()");
			const stateOffset = wasmInstance.exports.Hash_GetState();
			const stateLength = getStateSize();
			const overallLength = WASM_FUNC_HASH_LENGTH + stateLength;
			const memoryBuffer = wasmInstance.exports.memory.buffer;
			if (state.length !== overallLength) throw new Error(`Bad state length (expected ${overallLength} bytes, got ${state.length})`);
			if (!hexStringEqualsUInt8(binary.hash, state.subarray(0, WASM_FUNC_HASH_LENGTH))) throw new Error("This state was written by an incompatible hash implementation");
			const internalState = state.subarray(WASM_FUNC_HASH_LENGTH);
			new Uint8Array(memoryBuffer, stateOffset, stateLength).set(internalState);
			initialized = true;
		};
		const isDataShort = (data) => {
			if (typeof data === "string") return data.length < MAX_HEAP / 4;
			return data.byteLength < MAX_HEAP;
		};
		let canSimplify = isDataShort;
		switch (binary.name) {
			case "argon2":
			case "scrypt":
				canSimplify = () => true;
				break;
			case "blake2b":
			case "blake2s":
				canSimplify = (data, initParam) => initParam <= 512 && isDataShort(data);
				break;
			case "blake3":
				canSimplify = (data, initParam) => initParam === 0 && isDataShort(data);
				break;
			case "xxhash64":
			case "xxhash3":
			case "xxhash128": canSimplify = () => false;
		}
		const calculate = (data, initParam = null, digestParam = null) => {
			if (!canSimplify(data, initParam)) {
				init(initParam);
				update(data);
				return digest("hex", digestParam);
			}
			const buffer = getUInt8Buffer(data);
			memoryView.set(buffer);
			wasmInstance.exports.Hash_Calculate(buffer.length, initParam, digestParam);
			return getDigestHex(digestChars, memoryView, hashLength);
		};
		yield setupInterface();
		return {
			getMemory,
			writeMemory,
			getExports,
			setMemorySize,
			init,
			update,
			digest,
			save,
			load,
			calculate,
			hashLength
		};
	});
}
new Mutex();
var wasmJson$j = {
	name: "blake2b",
	data: "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",
	hash: "656e0f66"
};
new Mutex();
function validateBits$4(bits) {
	if (!Number.isInteger(bits) || bits < 8 || bits > 512 || bits % 8 !== 0) return /* @__PURE__ */ new Error("Invalid variant! Valid values: 8, 16, ..., 512");
	return null;
}
function getInitParam$1(outputBits, keyBits) {
	return outputBits | keyBits << 16;
}
/**
* Creates a new BLAKE2b hash instance
* @param bits Number of output bits, which has to be a number
*             divisible by 8, between 8 and 512. Defaults to 512.
* @param key Optional key (string, Buffer or TypedArray). Maximum length is 64 bytes.
*/
function createBLAKE2b(bits = 512, key = null) {
	if (validateBits$4(bits)) return Promise.reject(validateBits$4(bits));
	let keyBuffer = null;
	let initParam = bits;
	if (key !== null) {
		keyBuffer = getUInt8Buffer(key);
		if (keyBuffer.length > 64) return Promise.reject(/* @__PURE__ */ new Error("Max key length is 64 bytes"));
		initParam = getInitParam$1(bits, keyBuffer.length);
	}
	const outputSize = bits / 8;
	return WASMInterface(wasmJson$j, outputSize).then((wasm) => {
		if (initParam > 512) wasm.writeMemory(keyBuffer);
		wasm.init(initParam);
		const obj = {
			init: initParam > 512 ? () => {
				wasm.writeMemory(keyBuffer);
				wasm.init(initParam);
				return obj;
			} : () => {
				wasm.init(initParam);
				return obj;
			},
			update: (data) => {
				wasm.update(data);
				return obj;
			},
			digest: (outputType) => wasm.digest(outputType),
			save: () => wasm.save(),
			load: (data) => {
				wasm.load(data);
				return obj;
			},
			blockSize: 128,
			digestSize: outputSize
		};
		return obj;
	});
}
new Mutex();
var wasmJson$g = {
	name: "blake3",
	data: "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AAsLIAEpAyAhByABKQMoIQwgASkDMCENIAEpAzghDkEAKQPAiQEQBUEAQQAtAJCKASICQQFqOgCQigEgAkEFdCICQamKAWogCjcDACACQaGKAWogBDcDACACQZmKAWogBTcDACACQZGKAWogBjcDAEEAKQPAiQEgE0IBiHwQBUEAQQAtAJCKASICQQFqOgCQigEgAkEFdCICQamKAWogDjcDACACQaGKAWogDTcDACACQZmKAWogDDcDACACQZGKAWogBzcDAAtBAEEAKQPAiQEgE3wiBDcDwIkBIAMgEmohAyAAIBJrIgBBgAhLDQALIABFDQELQaCJASADIAAQBEEAKQPAiQEQBQsgAUHQAmokAAuGBwIJfwF+IwBBwABrIgMkAAJAAkAgAC0AaCIERQ0AAkBBwAAgBGsiBSACIAUgAkkbIgZFDQAgBkEDcSEHQQAhBQJAIAZBBEkNACAAIARqIQggBkF8cSEJQQAhBQNAIAggBWoiCkEoaiABIAVqIgstAAA6AAAgCkEpaiALQQFqLQAAOgAAIApBKmogC0ECai0AADoAACAKQStqIAtBA2otAAA6AAAgCSAFQQRqIgVHDQALCwJAIAdFDQAgASAFaiEKIAUgBGogAGpBKGohBQNAIAUgCi0AADoAACAKQQFqIQogBUEBaiEFIAdBf2oiBw0ACwsgAC0AaCEECyAAIAQgBmoiBzoAaCABIAZqIQECQCACIAZrIgINAEEAIQIMAgsgAyAAIABBKGpBwAAgACkDICAALQBqIABB6QBqIgUtAAAiCkVyEAIgACADKQMgIAMpAwCFNwMAIAAgAykDKCADKQMIhTcDCCAAIAMpAzAgAykDEIU3AxAgACADKQM4IAMpAxiFNwMYIABBADoAaCAFIApBAWo6AAAgAEHgAGpCADcDACAAQdgAakIANwMAIABB0ABqQgA3AwAgAEHIAGpCADcDACAAQcAAakIANwMAIABBOGpCADcDACAAQTBqQgA3AwAgAEIANwMoC0EAIQcgAkHBAEkNACAAQekAaiIKLQAAIQUgAC0AaiELIAApAyAhDANAIAMgACABQcAAIAwgCyAFQf8BcUVyQf8BcRACIAAgAykDICADKQMAhTcDACAAIAMpAyggAykDCIU3AwggACADKQMwIAMpAxCFNwMQIAAgAykDOCADKQMYhTcDGCAK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DkUNACAFIAdBBnRqIQEgBUGIAWogB0ECdGohAANAIAAgATYCACABQcAAaiEBIABBBGohACAOQX9qIg4NAAsLIAhBAmohAAsgBUGIAWogBkEBQgBBACADQQRyQQBBACAEEAEgACAJTw0AIAQgBkEFdGoiASAFIAZBBnRqIgApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggBkEBaiEGCyAFQeACaiQAIAYLrRAIAn8EfgF/AX4EfwR+BH8EfiMAQfABayIBJAACQCAARQ0AAkBBAC0AkIoBIgINACABQTBqQQApA9CJATcDACABQThqQQApA9iJATcDACABQQApA6CJASIDNwMAIAFBACkDqIkBIgQ3AwggAUEAKQOwiQEiBTcDECABQQApA7iJASIGNwMYIAFBACkDyIkBNwMoQQAtAIqKASECQQAtAImKASEHQQApA8CJASEIQQAtAIiKASEJIAFBwABqQQApA+CJATcDACABQcgAakEAKQPoiQE3AwAgAUHQAGpBACkD8IkBNwMAIAFB2ABqQQApA/iJATcDACABQeAAakEAKQOAigE3AwAgASAJOgBoIAEgCDcDICABIAIgB0VyIgJBAnI6AGkgAUEoaiEKQgAhCEGACSELIAJBCnJB/wFxIQwDQCABQbABaiABIAogCUH/AXEgCCAMEAIgASABKQPQASINIAEpA7ABhTcDcCABIAEpA9gBIg4gASkDuAGFNwN4IAEgASkD4AEiDyABKQPAAYU3A4ABIAEgASkD6AEiECAGhTcDqAEgASAPIAWFNwOgASABIA4gBIU3A5gBIAEgDSADhTcDkAEgASAQIAEpA8gBhTcDiAEgAEHAACAAQcAASRsiEUF/aiESAkACQCARQQdxIhMNACABQfAAaiECIAshByARIRQMAQsgEUH4AHEhFCABQfAAaiECIAshBwNAIAcgAi0AADoAACAHQQFqIQcgAkEBaiECIBNBf2oiEw0ACwsCQCASQQdJDQADQCAHIAIpAAA3AAAgB0EIaiEHIAJBCGohAiAUQXhqIhQNAAsLIAhCAXwhCCALIBFqIQsgACARayIADQAMAgsLAkACQAJAQQAtAImKASIHQQZ0QQBBAC0AiIoBIhFrRg0AIAEgEToAaCABQQApA4CKATcDYCABQQApA/iJATcDWCABQQApA/CJATcDUCABQQApA+iJATcDSCABQQApA+CJATcDQCABQQApA9iJATcDOCABQQApA9CJATcDMCABQQApA8iJATcDKCABQQApA8CJASIINwMgIAFBACkDuIkBIgM3AxggAUEAKQOwiQEiBDcDECABQQApA6iJASIFNwMIIAFBACkDoIkBIgY3AwAgAUEALQCKigEiEyAHRXJBAnIiCzoAaSATQQRyIRNBACkDmIkBIQ1BACkDkIkBIQ5BACkDiIkBIQ9BACkDgIkBIRAMAQtBwAAhESABQcAAOgBoQgAhCCABQgA3AyAgAUEAKQOYiQEiDTcDGCABQQApA5CJASIONwMQIAFBACkDiIkBIg83AwggAUEAKQOAiQEiEDcDACABQQAtAIqKAUEEciITOgBpIAEgAkF+aiICQQV0IgdByYoBaikDADcDYCABIAdBwYoBaikDADcDWCABIAdBuYoBaikDADcDUCABIAdBsYoBaikDADcDSCABIAdBqYoBaikDADcDQCABIAdBoYoBaikDADcDOCABIAdBmYoBaikDADcDMCABIAdBkYoBaikDADcDKCATIQsgECEGIA8hBSAOIQQgDSEDIAJFDQELIAJBf2oiB0EFdCIUQZGKAWopAwAhFSAUQZmKAWopAwAhFiAUQaGKAWopAwAhFyAUQamKAWopAwAhGCABIAM3A4gBIAEgBDcDgAEgASAFNwN4IAEgBjcDcCABQbABaiABQfAAaiABQShqIhQgESAIIAtB/wFxEAIgASATOgBpIAFBwAA6AGggASAYNwNAIAEgFzcDOCABIBY3AzAgASAVNwMoIAFCADcDICABIA03AxggASAONwMQIAEgDzcDCCABIBA3AwAgASABKQPoASABKQPIAYU3A2AgASABKQPgASABKQPAAYU3A1ggASABKQPYASABKQO4AYU3A1AgASABKQPQASABKQOwAYU3A0ggB0UNACACQQV0QemJAWohAiATQf8BcSERA0AgAkFoaikDACEIIAJBcGopAwAhAyACQXhqKQMAIQQgAikDACEFIAEgDTcDiAEgASAONwOAASABIA83A3ggASAQNwNwIAFBsAFqIAFB8ABqIBRBwABCACAREAIgASATOgBpIAFBwAA6AGggASAFNwNAIAEgBDcDOCABIAM3AzAgASAINwMoIAFCADcDICABIA03AxggASAONwMQIAEgDzcDCCABIBA3AwAgASABKQPoASABKQPIAYU3A2AgASABKQPgASABKQPAAYU3A1ggASABKQPYASABKQO4AYU3A1AgASABKQPQASABKQOwAYU3A0ggAkFgaiECIAdBf2oiBw0ACwsgAUEoaiEJQgAhCEGACSELIBNBCHJB/wFxIQoDQCABQbABaiABIAlBwAAgCCAKEAIgASABKQPQASIDIAEpA7ABhTcDcCABIAEpA9gBIgQgASkDuAGFNwN4IAEgASkD4AEiBSABKQPAAYU3A4ABIAEgDSABKQPoASIGhTcDqAEgASAOIAWFNwOgASABIA8gBIU3A5gBIAEgECADhTcDkAEgASAGIAEpA8gBhTcDiAEgAEHAACAAQcAASRsiEUF/aiESAkACQCARQQdxIhMNACABQfAAaiECIAshByARIRQMAQsgEUH4AHEhFCABQfAAaiECIAshBwNAIAcgAi0AADoAACAHQQFqIQcgAkEBaiECIBNBf2oiEw0ACwsCQCASQQdJDQADQCAHIAIpAAA3AAAgB0EIaiEHIAJBCGohAiAUQXhqIhQNAAsLIAhCAXwhCCALIBFqIQsgACARayIADQALCyABQfABaiQAC6MCAQR+AkACQCAAQSBGDQBCq7OP/JGjs/DbACEBQv+kuYjFkdqCm38hAkLy5rvjo6f9p6V/IQNC58yn0NbQ67O7fyEEQQAhAAwBC0EAKQOYCSEBQQApA5AJIQJBACkDiAkhA0EAKQOACSEEQRAhAAtBACAAOgCKigFBAEIANwOAigFBAEIANwP4iQFBAEIANwPwiQFBAEIANwPoiQFBAEIANwPgiQFBAEIANwPYiQFBAEIANwPQiQFBAEIANwPIiQFBAEIANwPAiQFBACABNwO4iQFBACACNwOwiQFBACADNwOoiQFBACAENwOgiQFBACABNwOYiQFBACACNwOQiQFBACADNwOIiQFBACAENwOAiQFBAEEAOgCQigFBAEEAOwGIigELBgAgABADCwYAIAAQBwsGAEGAiQELqwIBBH4CQAJAIAFBIEYNAEKrs4/8kaOz8NsAIQNC/6S5iMWR2oKbfyEEQvLmu+Ojp/2npX8hBULnzKfQ1tDrs7t/IQZBACEBDAELQQApA5gJIQNBACkDkAkhBEEAKQOICSEFQQApA4AJIQZBECEBC0EAIAE6AIqKAUEAQgA3A4CKAUEAQgA3A/iJAUEAQgA3A/CJAUEAQgA3A+iJAUEAQgA3A+CJAUEAQgA3A9iJAUEAQgA3A9CJAUEAQgA3A8iJAUEAQgA3A8CJAUEAIAM3A7iJAUEAIAQ3A7CJAUEAIAU3A6iJAUEAIAY3A6CJAUEAIAM3A5iJAUEAIAQ3A5CJAUEAIAU3A4iJAUEAIAY3A4CJAUEAQQA6AJCKAUEAQQA7AYiKASAAEAMgAhAHCwsLAQBBgAgLBHgHAAA=",
	hash: "540e8b8e"
};
new Mutex();
function validateBits$2(bits) {
	if (!Number.isInteger(bits) || bits < 8 || bits % 8 !== 0) return /* @__PURE__ */ new Error("Invalid variant! Valid values: 8, 16, ...");
	return null;
}
/**
* Creates a new BLAKE3 hash instance
* @param bits Number of output bits, which has to be a number
*             divisible by 8. Defaults to 256.
* @param key Optional key (string, Buffer or TypedArray). Length should be 32 bytes.
*/
function createBLAKE3(bits = 256, key = null) {
	if (validateBits$2(bits)) return Promise.reject(validateBits$2(bits));
	let keyBuffer = null;
	let initParam = 0;
	if (key !== null) {
		keyBuffer = getUInt8Buffer(key);
		if (keyBuffer.length !== 32) return Promise.reject(/* @__PURE__ */ new Error("Key length must be exactly 32 bytes"));
		initParam = 32;
	}
	const outputSize = bits / 8;
	const digestParam = outputSize;
	return WASMInterface(wasmJson$g, outputSize).then((wasm) => {
		if (initParam === 32) wasm.writeMemory(keyBuffer);
		wasm.init(initParam);
		const obj = {
			init: initParam === 32 ? () => {
				wasm.writeMemory(keyBuffer);
				wasm.init(initParam);
				return obj;
			} : () => {
				wasm.init(initParam);
				return obj;
			},
			update: (data) => {
				wasm.update(data);
				return obj;
			},
			digest: (outputType) => wasm.digest(outputType, digestParam),
			save: () => wasm.save(),
			load: (data) => {
				wasm.load(data);
				return obj;
			},
			blockSize: 64,
			digestSize: outputSize
		};
		return obj;
	});
}
new Mutex();
new Mutex();
new Mutex();
new Mutex();
new Mutex();
new Mutex();
new Mutex();
new Mutex();
new Mutex();
new Mutex();
new Mutex();
new Mutex();
new Mutex();
new Mutex();
new Mutex();
new Mutex();
new Mutex();
new Mutex();
//#endregion
export { createBLAKE2b, createBLAKE3 };
