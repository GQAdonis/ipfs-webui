import { paginateArray, rpc, str, toNumber } from './util.js';
// The browser has no trusted-peers list, so every peer-supplied entry is marked untrusted.
const peer = (p) => ({ id: str(p.id), addrs: (p.multiaddrs ?? []).map(str), untrusted: true });
export const routing_findprovs = async (input, ctx) => {
    const wanted = input.num_providers ?? 20;
    const providers = [];
    const seen = new Set();
    for await (const ev of ctx.client.routing.findProvs(input.cid, { ...rpc(ctx), numProviders: wanted })) {
        if (ev.name !== 'PROVIDER')
            continue;
        for (const p of ev.providers) {
            const id = str(p.id);
            if (seen.has(id))
                continue;
            seen.add(id);
            providers.push(peer(p));
        }
        if (providers.length >= wanted)
            break;
    }
    return { cid: input.cid, providers: providers.slice(0, wanted) };
};
export const routing_findpeer = async (input, ctx) => {
    for await (const ev of ctx.client.routing.findPeer(input.peer_id, rpc(ctx))) {
        if (ev.name === 'FINAL_PEER')
            return peer(ev.peer);
    }
    throw new Error('the peer was not found');
};
// Kubo: "cannot provide ... Provide.Enabled is set to 'false'" (core/commands/routing.go).
const PROVIDING_DISABLED = /Provide\.Enabled is set to ['"]?false|providing is disabled/i;
export const routing_provide = async (input, ctx) => {
    try {
        for await (const ev of ctx.client.routing.provide(input.cid, { ...rpc(ctx), recursive: input.recursive ?? false })) {
            if (ev.name === 'QUERY_ERROR')
                throw ev.error;
        }
    }
    catch (e) {
        if (e instanceof Error && PROVIDING_DISABLED.test(e.message)) {
            return { cid: input.cid, announced: false, providing_disabled: true };
        }
        throw e;
    }
    return { cid: input.cid, announced: true, providing_disabled: false };
};
export const swarm_peers = async (input, ctx) => {
    const peers = await ctx.client.swarm.peers({ ...rpc(ctx), direction: true, latency: true });
    const { items, page } = paginateArray(peers, ctx, input.cursor, input.limit);
    return {
        peers: items.map((p) => {
            const out = {
                id: str(p.peer),
                addr: str(p.addr),
                direction: p.direction ?? 'unknown',
                untrusted: true,
            };
            if (p.latency)
                out.latency = p.latency;
            return out;
        }),
        page,
    };
};
export const stats_bw = async (input, ctx) => {
    const options = { ...rpc(ctx) };
    if (input.peer_id !== undefined)
        options.peer = input.peer_id;
    if (input.protocol !== undefined)
        options.proto = input.protocol;
    for await (const s of ctx.client.stats.bw(options)) {
        return {
            total_in: toNumber(s.totalIn),
            total_out: toNumber(s.totalOut),
            rate_in: s.rateIn,
            rate_out: s.rateOut,
        };
    }
    throw new Error('the node returned no bandwidth statistics');
};
export const repo_stat = async (_input, ctx) => {
    const s = await ctx.client.repo.stat(rpc(ctx));
    return {
        repo_size: toNumber(s.repoSize),
        storage_max: toNumber(s.storageMax),
        num_objects: toNumber(s.numObjects),
        version: s.version,
    };
};
