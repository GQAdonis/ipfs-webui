# WebMCP in the Web UI (fork only)

Lets an agent in a WebMCP-capable browser or app (Codex desktop, Kimi desktop) use IPFS tools on the node this Web UI talks to. Design: ADR-0002 in the kubo fork (`docs/mcp/0002-webmcp-web-ui.md`).

## Off switches

- **Settings, "Agent tools (WebMCP)"**: off by default. Nothing is registered and no dialog exists while it is off.
- **Second switch**: tools that change the node are offered only while it is on, and turning the first switch off turns it off too. Every call from such a tool opens a confirmation dialog first. Tools that delete or remove are never offered.
- **Operator**: serve this Web UI with the response header `Permissions-Policy: tools=()`. The browser then refuses WebMCP registration for the page.
- No `exposedTo` is passed to `registerTool`; the tools belong to this top-level page only.

## Where the tools come from

`vendor/` is a built copy of `mcp/webmcp` from the kubo fork (framework-free ES modules, generated from `mcp/contract`). Do not edit it. `vendor/MANIFEST.json` holds a hash for each file, and a Jest test fails when they differ.

```
# in the kubo repository
cd mcp/webmcp && pnpm gen && pnpm build
# in this repository
npm run webmcp:vendor         # re-sync from ../kubo/mcp/webmcp/dist
npm run webmcp:vendor:check   # verify
```

The tools use the `ipfs` client the Web UI already holds (the API address setting). The page opens no other connection.

## Files

- `WebMcpHost.js`: registers the tools while the switch is on and `document.modelContext` exists; mounted in `App.js`.
- `WebMcpConfirmDialog.js` and `confirmation-queue.js`: the in-page confirmation. Deny has initial focus; Escape, expiry (2 minutes), a host cancel and switching the feature off all deny.
- `WebMcpSettings.js`, `settings-store.js`, `registration-status.js`: the Settings panel and what it reports.
- Copy: `public/locales/en/webmcp.json`.
