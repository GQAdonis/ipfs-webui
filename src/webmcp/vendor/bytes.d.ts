export declare function toBase64(bytes: Uint8Array): string;
export declare function fromBase64(text: string): Uint8Array;
export declare function concat(parts: Uint8Array[]): Uint8Array;
/** Decode a tool `content` field. Throws a RangeError when base64 is malformed. */
export declare function decodeContent(content: string, encoding: 'utf8' | 'base64'): Uint8Array;
/** utf8 when the bytes are valid UTF-8, base64 otherwise (the contract's rule for cat and read). */
export declare function encodeContent(bytes: Uint8Array, wanted: 'utf8' | 'base64'): {
    encoding: 'utf8' | 'base64';
    content: string;
};
/**
 * Collect up to `limit` bytes from a byte stream and say whether more existed. Stops
 * reading after limit + 1 bytes, so a huge file is never pulled into memory.
 */
export declare function collectLimited(source: AsyncIterable<Uint8Array>, limit: number): Promise<{
    bytes: Uint8Array;
    more: boolean;
}>;
/**
 * SHA-256 as lowercase hex, in plain JavaScript so it is synchronous and works in every
 * page and test environment (SubtleCrypto is async and absent in some). Used only to show
 * the person a fingerprint of the content they are asked to approve.
 */
export declare function sha256Hex(data: Uint8Array): string;
