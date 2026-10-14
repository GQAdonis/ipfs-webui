import type { Executor } from '../types.js';
/** One executor per exported tool, keyed by contract tool name. */
export declare const EXECUTORS: Readonly<Record<string, Executor>>;
/**
 * Checks that need only the input text. They run before the confirmation hook, so a person
 * is never asked to approve a call that would be refused anyway.
 */
export declare const PRECHECKS: Readonly<Record<string, (input: Record<string, any>) => void>>;
