//#region vendor/ipld-explorer-components/node_modules/multiformats/dist/src/bytes.js
function equals(aa, bb) {
	if (aa === bb) return true;
	if (aa.byteLength !== bb.byteLength) return false;
	for (let ii = 0; ii < aa.byteLength; ii++) if (aa[ii] !== bb[ii]) return false;
	return true;
}
function coerce(o) {
	if (o instanceof Uint8Array && o.constructor.name === "Uint8Array") return o;
	if (o instanceof ArrayBuffer) return new Uint8Array(o);
	if (ArrayBuffer.isView(o)) return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
	throw new Error("Unknown type, must be binary type");
}
function fromString(str) {
	return new TextEncoder().encode(str);
}
function toString(b) {
	return new TextDecoder().decode(b);
}
//#endregion
export { toString as i, equals as n, fromString as r, coerce as t };
