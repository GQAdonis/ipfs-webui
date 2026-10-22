# Issue 11: live presentation and retained contrast evidence

The scoped issue 11 acceptance is **PASS** on artifact `b9c25a7631a0d37d1353efd8f38be7a059f9f63c22f269a3112c1c7e3cc5d69c`: twenty WebUI family/slot contributions, four independent Desktop slots and all 384 retained contrast occurrences have current evidence. The normal export and Desktop assembly were used; both lanes completed with empty cleanup. Separate final reviews are stored under `reviews/`.

| Family | Viewport/themes | Keyboard/focus | Axe | Reduced motion |
| --- | --- | --- | --- | --- |
| decisions | PASS | PASS | PASS | PASS |
| shell | PASS | PASS | PASS | PASS |
| a2ui | PASS | PASS | PASS | PASS |
| inbox | PASS | PASS | PASS | PASS |
| context | PASS | PASS | PASS | PASS |
| Desktop | PASS | PASS | PASS | PASS |

The actual WebUI shell was observed in both themes at **320, 375, 539, 540, 768, 1024, 1440 and 1920**. Decision presentation covers the existing eleven phases and three surfaces. These are presentation checks; backend consent/effect/model interruption and physical native/assistive-technology proof retain their separate owner obligations.

## Acceptance and evidence map

| Requirement | Current source and evidence |
| --- | --- |
| Same-checkout local node | `test/helpers/owned-kubo.mjs` and `test/boundary/make-build-receipt.mjs`; fresh canonical owner `make build`, full Go/source/embed before/after/current bindings, binary/version/toolchain checks and 32 passing focused tests. All five Go embed owners are covered. `post-runtime-build-validation/` rechecks complete identity after the runs. |
| Existing five families/four slots and actual widths | `test/boundary/registrations/accessibility.mjs`, `test/boundary/accessibility/contributions/`, and `test/boundary/chat-runtime/shell-accessibility.mjs`; current lane manifests, positive assertions, source/runtime/PNG bindings and twenty family outcomes. |
| All original 384 incompletes | `test/boundary/accessibility/contrast/`; sixteen exact original reports, exhaustive current dispositions, computed foreground/composited background/effects, real scrolling, clipping/hit tests, stable capture and PNG bindings. Current result is 384 PASS / 0 FAIL / 0 UNKNOWN; minimum measured ratio is 4.908531945906348:1. Original axe reports remain unchanged. |
| Honest unsuccessful outcomes | Original missing-metadata and incomplete-embed receipts, the observer's eight UNKNOWN results, actual dark540 contrast failure and Desktop setup failures remain separately retained. No unsuccessful contribution was relabeled PASS. |
| Current artifacts and independent lanes | Normal `export:local`, strict current export checks and normal Desktop assembly; real sibling source snapshot with 6,617 transferred files, complete static assets and unchanged runtime bundle layout. |

The actual dark540 failure measured Remove-reference text at 4.34:1 on a host-overridden composer fill. Using the existing `--raised` surface produces 5:1 in the unchanged live axe check. Named suggestions now expose group semantics. Full shell axe JSON and PNGs are retained before the unchanged assertion; all sixteen current shell reports contain zero violations and zero incompletes. The original 29 orchestration tests pass in the current full unit run; the complete run has 2,022 passing tests, 6 pending and zero failures. ESLint, TypeScript, dependency checks, vendored-artifact validation and production build pass. The optional build-bound test was also exercised separately in the 32/32 focused run; the conservative contrast observer has four passing tests, including real-browser clipping controls.

## Published handoff

`verification.json` maps current outcomes. `evidence-index.json` binds every archived member and published capture. `verification-evidence.tar.gz` has 516 regular-file evidence members; its SHA-256 is `817901a4b9cc362a13603d4265ab05d28bee3e607dbdb041aec229ac7c64f694`. It contains current full measurement/axe JSON, owner build and tool receipts, source/transfer manifests, original contrast reports, retained failures, command logs and reproduction tools. Published images are a **representative subset**; full capture corpora remain at their bound local run paths. Omitted PNGs are referenced by exact hashes and are not claimed included.

Archives retain the actual local paths used during execution. They are evidence, not portable build/backend authority. A relocated checkout needs fresh source-bound artifacts, its own matching canonical build receipt, and fresh runtime evidence; copying an archived binary or PASS receipt does not qualify. The existing-worktree recipe is described in `test/boundary/OPERATIONS.md`, the contrast README and archived `prepare-su-final-snapshot.mjs`. Use the pinned Node 26.5.0 and existing pinned browser. Regenerate through `npm run export:local -- --kubo ../kubo`, run the standard WebUI boundary with explicit test-only `makeBuildReceipt`, and run standard Desktop assembly/boundary in a complete source-identical sibling layout. No source/artifact symlink, fallback host or relaxed validator is used. After normal assembly, 6,616 transferred files remain identical; the sole expected changed file is the generated Desktop local-assembly provenance report, which now binds the current artifact. `source-transfer-reconciliation.json` records both hashes and confirms original worktrees stayed unchanged.

The historical 53 source guards still match the original worktrees. Publication preserves 51 original hashes; two architect-authorized deltas add explicit build-receipt wiring and stronger shell failure evidence. The original frozen registry and all scenario oracles are preserved. `source-guard-reconciliation.json` explains these deltas; current lane harness/export hashes bind the new bytes.

## Draft and remaining work

The broader WebUI packet remains **FAIL** ({'PASS': 38, 'FAIL': 12, 'BLOCKED': 17}); the broader Desktop packet remains **BLOCKED** ({'PASS': 7, 'BLOCKED': 2, 'NOT_EXERCISED': 1}). Their raw results are preserved; this clearance does not promote those other checks. Whole UI-112, full WCAG and whole-phase certification are not claimed. [Issue 12](https://github.com/GQAdonis/ipfs-webui/issues/12) tracks the remaining decision axe incomplete inventory, which the existing decision registration does not retain. Its missing data is unverified, not zero.

This PR publishes the approved WebUI React 19/Vite migration and fixes. It remains a **draft targeting main** until matching sibling Kubo frontend packages are committed/pinned for consumers, CI reproduces that composition, and remaining phase gates are resolved. This PR does not publish those Kubo packages. Local dependency installation used `npm ci --ignore-scripts` after the legacy Kubo binary download timed out, then explicitly applied the root postinstall patches. No PR merge, release, WebUI CID bump, backend API/contract change or whole-phase adoption is performed.

## References

- https://github.com/GQAdonis/ipfs-webui/issues/10
- https://github.com/GQAdonis/ipfs-webui/issues/11
- https://github.com/GQAdonis/ipfs-webui/issues/12
- https://github.com/GQAdonis/kubo/issues/10
- https://github.com/GQAdonis/ipfs-webui/issues/9
- https://github.com/tribe-health/ipfs-desktop/issues/6
