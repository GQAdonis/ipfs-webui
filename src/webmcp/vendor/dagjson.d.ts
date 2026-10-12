/** Decoded IPLD value to dag-json shape: CID -> {"/": cid}, bytes -> {"/": {"bytes": b64}}. */
export declare function toDagJson(value: unknown): unknown;
/**
 * The inverse, for dag_put. Property names that could reach Object.prototype are refused,
 * so what the person approved is exactly what is stored.
 */
export declare function fromDagJson(value: unknown): unknown;
