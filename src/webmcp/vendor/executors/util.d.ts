import type { ExecContext } from '../types.js';
/**
 * Options every RPC call carries: the host's abort signal when it sent one, otherwise a
 * signal that fires after the timeout (Kimi passes none), and the client's own timeout.
 */
export declare function rpc(ctx: ExecContext): {
    signal?: AbortSignal;
    timeout: number;
};
/** A bare CID or CID/sub/path becomes /ipfs/...; /ipfs, /ipns and /ipld paths pass through. */
export declare function toContentPath(path: string): string;
/** Largest safe integer for sizes that arrive as bigint. */
export declare function toNumber(v: unknown): number;
export interface Page<T> {
    items: T[];
    page: {
        has_more: boolean;
        next_cursor?: string;
    };
}
/** A cursor is accepted only if this tool set issued it, so an agent cannot jump to an offset it was not given. */
export declare function parseCursor(cursor: unknown, issued: Set<string>): number;
/**
 * Offset pagination over an async source. The cursor is opaque to the agent. The source
 * is read only as far as one page plus one item, so a long listing is not pulled whole.
 */
export declare function paginate<T>(source: AsyncIterable<T> | Iterable<T>, ctx: ExecContext, cursor: unknown, limit: unknown): Promise<Page<T>>;
export declare function paginateArray<T>(all: T[], ctx: ExecContext, cursor: unknown, limit: unknown): Page<T>;
export declare function str(v: unknown): string;
