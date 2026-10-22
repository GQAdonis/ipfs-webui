# Accessibility correction and frontend migration publication

This change publishes the React 19/Vite frontend migration required by [WebUI #10](https://github.com/GQAdonis/ipfs-webui/issues/10). The scoped accessibility correction preserves exactly five independent families across four slots, complete current-export validation, source/path/hash guards, actual assertion/PNG bindings, and FAIL before BLOCKED before NOT_EXERCISED before PASS. Both themes author shell widths 320/375/539/540/768/1024/1440/1920. Missing node prerequisites remain explicit.

The migration includes the operational shell, decision/Activity presentation, context/run-fact views, feature controls, React store/overlay compatibility, maintained Explorer artifact and provenance, and current build/test tooling. Earlier console-session behavior from the feature branch is preserved. Installed dependencies and caches are excluded. The maintained Explorer's generated `dist` is intentionally included because its packed local dependency exports those exact artifacts; its nested `node_modules` is not included.

## Build dependency and draft status

This PR is a draft until the matching Kubo frontend packages are published and CI consumes their immutable revision. Vite, Vitest, Storybook and TypeScript require built sibling `../kubo/mcp/ui` and `../kubo/mcp/chat` exports; boundary tests also read sibling contract/App fixtures. Those packages are not supplied by WebUI's `npm ci`. Existing GitHub workflows check out only WebUI and therefore cannot currently reproduce this multi-repository build. The scheduled Node-version matrix also needs to be aligned with the pinned Node 26.5.0 baseline in that integration work. No source/receipt checks were weakened to disguise the dependency.

Local validation uses the matching existing sibling Kubo frontend worktree. It does not certify a standalone clone, publish those sibling sources, adopt a backend lease or establish live-node/native accessibility acceptance. Readiness requires committing the companion frontend packages, pinning their provenance and adding the appropriate CI checkout/build arrangement before marking this PR ready to merge.

## Retained issue #10 evidence

The files in this directory preserve the completed local checkpoint, before publication. Their historical statements that no commit/PR was performed describe that checkpoint; this README records the subsequent authorized publication. Absolute paths in the receipts identify the original local execution and are not remote source or download links.

- `source-bundle.manifest.json` binds 18 exact source/test/document snapshots across WebUI and Kubo inside `source-bundle.tar.gz`. The compressed archive keeps historical cross-repository files out of application compilation and dependency scanning. It is non-standalone; its Kubo copies are evidence, not installed application modules.
- `test-receipt.json` records the unchanged focused orchestration tests passing 29/29. Original causal failures and browser evidence remain referenced separately.
- `verification.json` records strict export/Desktop assembly validation and 53 matching frozen source entries. `retained-bindings.json` revalidates the historical WU/SU source/runtime bindings without rerunning browser acceptance.
- `reviews/` contains separate scoped product and security PASS dispositions. They certify the bounded issue #10 change, not the entire migration as release ready.
- `contrast/` classifies all 384 retained incomplete color-contrast occurrences. No manual clearances are claimed; source-palette candidate ratios are not exact per-node rendered contrast measurements. The offline script references the original retained reports and requires that evidence checkout.

At the retained issue #10 checkpoint, whole UI-112 was BLOCKED: 12 static contributions passed and eight node-dependent decisions/shell contributions were blocked. The subsequent [issue #11 handoff](../issue-11-clearance/README.md) records twenty current WebUI contributions, four Desktop slots and all 384 retained contrast occurrences passing with actual-host evidence. [WebUI #12](https://github.com/GQAdonis/ipfs-webui/issues/12) tracks the remaining decision axe incomplete inventory; whole UI-112, WCAG and whole-phase certification are not claimed. [Kubo #10](https://github.com/GQAdonis/kubo/issues/10), [WebUI #9](https://github.com/GQAdonis/ipfs-webui/issues/9) and [Desktop #6](https://github.com/tribe-health/ipfs-desktop/issues/6) retain their separate backend, adapter and privileged/native obligations.

No deployment, WebUI CID bump, whole-WCAG certification, native presence or live effect/model-interruption proof is implied by this publication.
