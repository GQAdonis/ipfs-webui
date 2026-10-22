# Maintained React 19 compatibility fork

This private package is maintained in the GQAdonis/ipfs-webui repository by the
`ui-ux-engineer` Web UI lane (WU) of the `kubo-ipfs-agentic` team. That lane owns
compatibility fixes, source import review, dependency freezes and parity
fixtures. The upstream project remains IPFS's `ipld-explorer-components`; this
is not an upstream release or a replacement explorer.

The base is upstream **8.1.3**, commit
`57d625dadb934556506030fc532bf5ad24f36dc6`. `provenance.json` records the immutable
archives, their hashes, source inventory, notices and local changes. The npm
archive's SHA512 matches the adopted ADR-0014 integrity. Source was imported
from that exact GitHub commit, rather than reconstructed from generated output.
The original package/lock/build configuration and README are retained in
`upstream/`; `upstream/source-sha256.json` identifies the unmodified inputs.

## What changed

The local package version is `8.1.3-react19.1`. Public root, providers, pages,
start-exploring, forms and CSS entry points remain available. The package exports a private prebundled ES-module artifact, and React/DOM are
exact host peers (`19.3.1`). It creates no React root and ships no second React
runtime. The owned source remains authoritative. Private host TypeScript paths
read that source against its own frozen build-input graph; runtime imports use
the artifact.

- Native React 19 `<title>` replaces Helmet 6 in both pages.
- Joyride moves from 2.9.2 to **3.2.0**, with the named `Joyride` export,
  `onEvent`, and step options. Existing steps, run controls, completion callback
  shape, scrolling and progress remain. Inspector moves from 6.0.2 to
  **9.0.0**, whose published peers support React 18/19 and whose object, byte,
  theme and expansion APIs are retained. A small keyboard delegate operates
  those existing inspector controls; it does not decode or render IPLD itself.
- Providers retain modern React context. Initialization is shared while
  pending, callbacks/context values are stable, late results cannot overwrite a
  newer navigation, and provider teardown stops even a late-created Helia node.
  Graph teardown destroys Cytoscape, and CID metadata discards stale responses.
  Changing a path also clears the old node, canonical path and graph inputs
  immediately, including navigation back to the start route. A delayed graph
  click cannot resolve through a node that is no longer present.
- Nullable DOM refs and `React.JSX` types follow React 19. CSS-module property
  access works with the host's default naming. Links-table rows retain their
  existing click operation and also support Enter/Space.
- Pure codec, CID, hash, block retrieval, normalization, CAR import and DAG
  traversal implementations are retained. The original networking configuration,
  local gateway/trustless options and `explore.ipld.gatewayEnabled` off switch
  remain. No new endpoint or networking behavior was introduced.

The original non-React runtime closure is frozen from the immutable upstream
lock, including Helia HTTP 2.0.0, brokers 4.0.0, routers 2.0.0, interface 5.0.0,
multiformats 13.3.0 and dag-jose's separate 13.1.3. The fork's own `package-lock.json` freezes those development/build inputs; they
are bundled into `dist/**` and are not dependencies re-resolved by the host.
`upstream/runtime-closure.json` is the original closure; resolved metadata is
recorded separately in `provenance.json`. The generator explicitly uses the
host's pinned Vite 8.3.4/plugin-react 6.1.2. All React/DOM subpaths, the i18next
family, react-i18next, Tachyons, ipfs-css and Joyride are external host adapters.
Inspector 9 is bundled with its React imports external. Upstream development
and release tooling is archival only, not this fork's build toolchain.

A source-import strategy with scoped host overrides was rejected: npm shared
host ancestors and drifted multiformats 13.3.0 to 13.4.0, p-timeout 6.1.3 to
6.1.4, progress-events 1.0.1 to 1.1.0 and @chainsafe/is-ip 2.0.2 to 2.1.0. Those
are not accepted closure changes. The unsuccessful overrides were removed; the
prebundle restores the upstream package's bundled-protocol boundary.

Compatibility changes are recorded as numbered, source-level patches in
`patches/series`. Applicable upstream source and CSS copyright comments remain.
`LICENSE`, `LICENSE-MIT`, and `LICENSE-APACHE` are verbatim copies. Upstream had
no separate NOTICE file. The loader CSS's Daniel Cardoso MIT notice is retained.
Dependencies such as Inspector and Joyride retain their own packaged licenses.

## Local installation and freshness

The host declares `file:vendor/ipld-explorer-components`. Its source-controlled
`.npmrc` sets `install-links=true`, so npm installs the packaged artifact rather
than a mutable directory link. Use that configuration for both `npm install`
and `npm ci`. The runtime package has host-adapter peers and no protocol runtime
dependencies. Never ignore peer errors or patch installed files.

After editing the fork, increment the prerelease suffix for the next maintenance
release and update provenance/patches. From the host root:

1. `COREPACK_ENABLE_AUTO_PIN=0 npm ci` supplies the pinned host tooling and
   previously committed private artifact.
2. `COREPACK_ENABLE_AUTO_PIN=0 npm --prefix vendor/ipld-explorer-components ci --ignore-scripts --strict-peer-deps`
   supplies the isolated, frozen protocol build inputs.
3. `COREPACK_ENABLE_AUTO_PIN=0 npm run build:explorer-artifact` generates only
   this required dependency. The generator rejects another host toolchain or
   source changes during compilation, copies the complete locked dependency
   notice inventory, and writes `dist/artifact-manifest.json` with source,
   own-lock/config and artifact hashes. It is not a Web UI verification build.
   The exact own lock is also carried as `dist/build-inputs.lock.json`, because
   npm intentionally omits a root `package-lock.json` from packed dependencies.
4. When the package manifest changed, regenerate the host lock with
   `COREPACK_ENABLE_AUTO_PIN=0 npm update ipld-explorer-components`. A clean
   `COREPACK_ENABLE_AUTO_PIN=0 npm ci` then installs the current artifact from
   the source-controlled directory. Commit the source, own lock, generated
   artifact/stamp and host lock together when a commit is authorized.

CI assembly uses the committed locks and those same configurations. A fresh
host install after artifact generation is mandatory: packed copies do not
follow source or output edits, even if their version strings match.
`npm run check:explorer-freshness` rejects stale source/own-lock/config hashes,
changed or missing dist files, and missing/linked/different installed copies.
F1.9 must call `assertExplorerFreshness(root)` from `scripts/freshness.mjs`
before the Web UI build and record its source/installed/dist hashes. It must
regenerate/reinstall after an input change, never copy a receipt or bypass the
precondition. F1.9 must also carry `dist/licenses/**` with the exported Web UI
artifact: an application bundler does not automatically copy unreferenced
package license files. No QA command was run to author this artifact.

## Fixtures and the final phase gate

`npm run test:explorer` includes the preserved upstream CID, normalization,
traversal and breadcrumb fixtures through the **owned source and isolated lock**, plus host
fixtures for pending-node cleanup, stale navigation, malformed CID recovery,
object/raw previews, graph teardown, tour events/off state, network off state,
and stale-copy rejection. The upstream HTTP test helper is adapted to a bounded
in-memory blockstore; no test helper starts a router or uses the operator node.

`test/e2e/navigation.js` exports a browser fixture registrar for the F1.10
boundary runner: DAG link keyboard navigation, browser back/forward, invalid
input recovery and raw CID display, using only the isolated fixture node. The final browser exercises the installed artifact. The
historical host `test/e2e/explore.test.js` continues to cover codec displays and
CID form operations. F1.10 must wire the registrar into its browser command map.
No fixture authorship or dependency installation constitutes acceptance. Tests,
build verification, screenshots and independent review remain at the single
final phase gate after all production work.

## Deliberate upstream updates

1. Record the proposed immutable commit, release and npm integrity separately.
   Fetch its source and published archive; retain the current base until review.
2. Compare all notices and the upstream source/protocol lock closure, including
   default endpoints and off switches. Networking changes need their own
   architecture decision; a React update does not authorize them.
3. Rebase the small compatibility patch series. Inspect React-sensitive peers
   for actual APIs and supported React versions; never force peer resolution.
4. Increment the local prerelease version, regenerate the scoped closure and
   isolated and host locks with normal npm resolution, and refresh source/hash/provenance
   inventories. Compare installed freshness before deterministic assembly.
5. Refresh parity fixtures for every changed operation. Run the adopted final
   browser/operation/security gate and independent review before replacing the
   maintained version in a release. Never silently switch to upstream 8.2.x or
   delete a control to satisfy a build.

## Packed-lock preservation during local assembly

Npm excludes files named `package-lock.json` from packed file dependencies, including the archived `upstream/package-lock.json`. Keep the source originals untouched. The artifact generator copies the exact derived lock bytes to `dist/build-inputs.lock.json` and the exact immutable upstream lock bytes to `dist/upstream-original.lock.json`. The packed-copy checker maps their distinct logical source keys back to these snapshots. Both snapshots are in the artifact hash inventory. Source freshness also includes `upstream/**`, `patches/**`, `provenance.json` and this maintenance document. Version equality cannot bypass any of these checks.

Run `COREPACK_ENABLE_AUTO_PIN=0 npm run prepare:explorer-artifact` from the WebUI root after changes. It installs the fork's own strict lock, compiles its dependency artifact, removes/reinstalls only the packed local dependency to refresh its integrity/copy, and checks those assembly preconditions. It does not run the application, parity tests or QA. A later `npm ci` consumes the refreshed host lock and `install-links=true`; run the same freshness precondition before consuming that copy.

## Final frontend correction batch

`0006-final-boundary-compatibility.patch` records maintained-source type/lint
repairs, current pinned Storybook imports, ArrayBuffer-backed SHA-1 input and
the existing Inspector keyboard delegation. Its reconstructed pre-correction
source matches all 72 recorded initial Q2 source hashes. The immutable upstream
inventory, protocol runtime closure and package version are unchanged. These
are corrections within the current unreleased React 19 foundation. Regenerate
and strictly reinstall this same-version artifact before consumer assembly.
