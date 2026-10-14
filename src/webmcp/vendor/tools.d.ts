import type { WebMcpTool, WebMcpToolOptions } from './types.js';
/** Error text can come from a peer or a gateway. Collapse whitespace, strip URLs and credentials, cut it short. */
export declare function redact(text: string): string;
/**
 * Build the tools a page registers. Class `none` tools are always included. Write tools
 * are included only when `includeWrites` is true and a confirmation hook was supplied.
 * Destructive tools do not exist in the generated list, so no option can add them.
 */
export declare function createWebMcpTools(options: WebMcpToolOptions): WebMcpTool[];
