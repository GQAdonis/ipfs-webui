import type { JsonSchema } from './types.js';
/**
 * A small validator for the JSON Schema subset the contract's tool inputs use: type,
 * enum, pattern, min/max length and value, items, properties, required and
 * additionalProperties:false. Agent input crosses a trust boundary, so executors
 * validate it before they touch the RPC client. Unknown keywords are ignored; the
 * conformance test checks that the subset covers every generated schema.
 *
 * Input is parsed JSON from the host, so it can carry own properties named `__proto__`,
 * `constructor` or `prototype`. They are rejected at any depth, every property lookup uses
 * own-property checks, and the validated copy has no prototype to pollute.
 */
export interface ValidationResult {
    ok: boolean;
    errors: string[];
    /** The input with schema defaults applied. Present when ok. */
    value?: Record<string, unknown>;
}
export declare function validateInput(schema: JsonSchema, input: unknown): ValidationResult;
