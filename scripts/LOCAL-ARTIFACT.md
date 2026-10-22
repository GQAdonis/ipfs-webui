# Local WebUI export for Desktop

Run from this WebUI checkout with the sibling local Kubo checkout available:

```sh
COREPACK_ENABLE_AUTO_PIN=0 npm run prepare:explorer-artifact
COREPACK_ENABLE_AUTO_PIN=0 npm run export:local -- --kubo ../kubo
```

The first command is necessary after maintained Explorer source, original/derived lock, patch, provenance, build configuration or license changes. It regenerates the isolated dependency and refreshes the packed installed copy and host integrity. The second command fails immediately if that prerequisite is absent or stale. It installs the existing shared locks with frozen-lockfile/strict-peer enforcement and dependency lifecycle scripts disabled, runs the UI contract/catalog and WebMCP tool producers, builds the local shared UI, chat (standalone and composed React), MCP App and WebMCP dependency artifacts, invokes the existing chat/WebMCP vendor generators and locale producer, then assembles `build/`. No test, lint, typecheck-only, verification-build, gateway-download, signing, publishing or release command is invoked. The existing synthetic constraint-fixture producer also refreshes `mcp/ui/tests/fixtures/converter-schemas.generated.ts` without executing it; its input and emitted bytes are recorded. Only generated source/catalog outputs of those existing producers are written; their implementation and handcrafted package sources are not changed. Declaration emission is part of the shared dependency package builds.

This is consumer artifact production, not runtime compatibility or acceptance evidence. Shared builders can reject invalid source/exports. Concurrent changes to shared source, lock, configuration, catalog or contract inputs fail the before/after snapshot rather than recording a mixed artifact. The generated chat CSS is recorded as a derived input; its original stylesheet and compiler script stay in the source snapshot. The exporter promotes a complete staged build only after its assembly preconditions hold; a failed build does not replace a previous `build/`.

## Output and provenance

`build/index.html` retains `base: './'`, hash navigation, relative asset imports, bundled fonts and locale files. Copy the entire directory, including hidden `.vite/`, `licenses/`, `provenance/` and the manifest. Do not delete/minify files after recording the inventory.

`build/WEBUI_ARTIFACT.json` has `schemaVersion: 1` and `kind: 'ipfs-webui-local'`. Its fields are:

- `entry: 'index.html'`, `base: './'`, `routing: 'hash'`.
- `locations`: relative checkout hints; verifiers take explicit trusted source paths and do not resolve artifact paths through these hints.
- `environment`: the existing allowlisted public build metadata. Other environment variables and credentials are not serialized.
- `toolchain`: actual Node/pnpm versions plus installed compiler/runtime versions, package manifest hashes and resolved entry hashes.
- `inputs`: sorted WebUI source/config/lock/patch/public inputs; each shared package's source/scripts/config/lock/fonts/catalog; the full local `mcp/contract` tree. Each input has a sorted relative file-to-SHA256 map and aggregate hash. Any later edit requires regeneration, including later foundation or feature tasks.
- `sharedArtifacts`: every local UI/chat/App/WebMCP `dist/` file hash, including type exports, React host entry and runtime reports. MCP App HTML stays in its producer's `mcp/app/dist/`; it is not copied into the WebUI or given new host authority.
- `explorer`: maintained source/original-lock/derived-lock/config/patch/provenance and installed packed-copy freshness, plus emitted artifact hashes. The original and derived locks retain distinct logical identities and byte-for-byte snapshots despite npm's omission of `package-lock.json` from packed packages.
- `reactRuntime`: compiler-resolved React/DOM package identities and exact module hashes for the WebUI root. This records compilation inputs; final browser/Electron fixtures still establish actual runtime behavior.
- `artifacts`: every output file's SHA256, excluding `WEBUI_ARTIFACT.json` itself. `artifactSha256` is SHA256 of `JSON.stringify()` of that map sorted by UTF-16 key order. No timestamps or absolute checkout paths enter the manifest.

`provenance/explorer/` retains the producer manifest, upstream provenance, original/derived lock copies, immutable source/closure inventory and compatibility patches. `provenance/shared-artifacts.json` records shared outputs; `provenance/react-runtime.json` records the WebUI compiler report. `licenses/ipld-explorer-components/` copies the entire preserved Explorer notice inventory. Root, shared and installed dependency notice inventories are retained too. The conservative installed-package notice superset is labelled as such; it is not represented as a precise bundled-package inventory. Existing public control/font notices remain in the build.

## Desktop handoff

Set `IPFS_WEBUI_PATH` to the absolute `ipfs-webui/build` directory. The local Desktop copy path must require this artifact and fail when it is missing, stale or incomplete. It must not reach the existing wildcard gateway-download build path or change any shipped CID.

Before copying, use the source-aware packaging precondition:

```sh
node /path/to/ipfs-webui/scripts/check-local-export.mjs \
  --directory /path/to/ipfs-webui/build \
  --webui /path/to/ipfs-webui \
  --kubo /path/to/kubo
```

After copying byte-for-byte, artifact-only inventory validation can run against the copy:

```sh
node /path/to/ipfs-webui/scripts/check-local-export.mjs \
  --directory /path/to/ipfs-desktop/assets/webui --artifact-only
```

The source-aware check rejects changed source, lock, catalog, contract, shared outputs, Explorer installed copy and actual compiler/runtime files. Artifact-only validation checks the portable output inventory, rejects missing/extra/tampered files and symlinks, and makes no claim about unavailable source freshness. `scripts/local-artifact.mjs` exports `assertExportArtifacts(directory)` and `assertLocalWebuiExport({ root, kubo, directory })` without importing Vite or running a build.

Final scenario runners belong to foundation1.10 and the single final QA boundary. No acceptance is inferred from producing these artifacts or evaluating their required packaging preconditions.
## Pinned CSS compatibility

The PostCSS configuration removes only Tachyons 4.12.0's `.cf { *zoom: 1 }`
declaration from that package's CSS input. This IE 6/7 hasLayout hack is outside
the supported browser targets and is invalid in Lightning CSS. The clearfix
pseudo-elements and ordinary styles remain intact; other CSS parse errors remain
fatal. The focused transformation fixture is authored in `toolchain.test.js`.

## Incumbent peer address matcher

`AddConnection.js` already imported `@multiformats/multiaddr-matcher` without a
direct manifest declaration. The original host lock supplied version 1.4.0 via
Explorer's `@helia/block-brokers` dependency. Isolating Explorer's closure exposed
this implicit dependency. The host now declares that identical 1.4.0 pin directly,
with its original `@chainsafe/is-ip` 2.0.2 closure scoped only to that matcher.
The existing host multiaddr 12.5.1 and multiformats 13.4.0 pins and other chainsafe
consumers remain unchanged. Peer address validation still uses the original
`P2P`, `Circuit` and `WebRTC` matchers.

## Native modal prerequisite

The remaining `react-overlays` consumer uses a native modal `<dialog>` in the
existing body portal. `showModal()` supplies top-layer focus and background
inertness; cancel prevents native dismissal until the controlled parent changes
`show`. Body scroll locking is reference-counted across nested dialogs and
restores prior inline styles. Cleanup restores a connected opener only when the
closing dialog owns focus. The existing sheet/scrim visuals and outside-click
dismissal remain. Production requires the native API rather than silently
degrading to a nonmodal overlay. The focused jsdom fixture models open/close
calls only; final browser fixtures must establish actual native keyboard/focus
and nested-dialog behavior.

