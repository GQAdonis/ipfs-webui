import type { ConfirmationRequest, ConfirmationTarget, GeneratedTool } from './types.js';
/** Replace invisible and direction-changing code points with visible tokens. */
export declare function sanitize(text: string): string;
/** Cut a long value in the middle so both ends stay visible. */
export declare function middleTruncate(text: string, max: number): string;
/** Short, single-line text for the person: sanitized, then cut in the middle. */
export declare function preview(text: string, max?: number): string;
/** One labelled value for the dialog. `full` carries the whole sanitized value when it was cut. */
export declare function item(label: string, raw: unknown, max?: number): ConfirmationTarget;
/** Tools that have a describer. A write tool without one is not exported (a test enforces it). */
export declare const DESCRIBED_TOOLS: readonly string[];
export declare function describeWrite(tool: GeneratedTool, input: Record<string, unknown>): ConfirmationRequest;
