import { paginate, rpc, str, toContentPath } from './util.js';
export const pin_ls = async (input, ctx) => {
    const options = { ...rpc(ctx), type: input.type ?? 'all', names: true };
    if (input.path !== undefined)
        options.paths = toContentPath(input.path);
    if (input.name !== undefined)
        options.name = input.name;
    const { items, page } = await paginate(ctx.client.pin.ls(options), ctx, input.cursor, input.limit);
    return {
        pins: items.map((p) => {
            const pin = { cid: str(p.cid), type: p.type };
            if (p.name)
                pin.name = p.name;
            return pin;
        }),
        page,
    };
};
export const pin_add = async (input, ctx) => {
    const options = { ...rpc(ctx), recursive: input.recursive ?? true };
    if (input.name !== undefined)
        options.name = input.name;
    const cid = await ctx.client.pin.add(toContentPath(input.path), options);
    const out = { pins: [str(cid)] };
    if (input.name !== undefined)
        out.name = input.name;
    return out;
};
