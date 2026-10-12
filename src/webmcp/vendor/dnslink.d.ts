/** True when `name` (no /ipns/ prefix, no sub-path) is a libp2p key, so resolving it needs no DNS. */
export declare function isKeyName(name: string): boolean;
/** The first argument of `tool` that would trigger a DNSLink lookup, if any. */
export declare function dnsLinkArgument(tool: string, input: Record<string, unknown>): string | undefined;
