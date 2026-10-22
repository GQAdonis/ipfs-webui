# Independent security review: issue #11 build provenance and contrast

2026-10-21 America/Chicago. **Final scoped security disposition: PASS**, including source/build corrections, authored UI-112 runtime evidence, original-384 contrast measurements and inspected draft-publication packaging. I11-SEC-01 and I11-SEC-02 are resolved; no actionable scoped security finding remains. The broader WU run remains FAIL and the overall phase remains BLOCKED; full WCAG, native physical presence and real backend-effect coverage are not certified. The complete original BLOCKED report is preserved separately as `issue11-clearance-v1.md`, SHA-256 `e18913df7857fca9cd0d817db498301a037b263449386a0dcb369b008713daa6`.

## Boundary and independence

Separate native `security_reviewer` context, reviewing the frozen initial issue #11 implementation. `W` = `/Users/gqadonis/.codex/worktrees/agentic-ui-frontend/ipfs-webui-issue10-publication`; `K` = sibling `kubo`. Scope: owned-node build identity, explicit test-only receipt forwarding, receipt/source/log integrity and supplemental contrast observation. Existing repository/role/security/UI-review instructions continue to apply. No tests, builds, browser sessions, process inspections, services, backend edits or evidence mutations were performed. Only this assigned report is written.

The relevant threat is stale or substituted build input acquiring source-current evidence authority. Receipt files are trusted local provenance records, not cryptographic attestations against a hostile process already able to rewrite the checkout. Neither these records nor component-fixture measurements grant consent, backend compatibility, BE04, lease or external-collaborator authority.

## Historical finding I11-SEC-01 — MEDIUM, resolved in v2

This section records the initial defect and correction requirement. It describes the revoked first freeze; the v2 confirmation below supersedes its initial blocked disposition.

**Complete embedded-input provenance is not captured or rechecked.**

`W/test/boundary/make-build-receipt.mjs:9` hardcodes embed coverage for `mcp/app/dist`, `mcp/ui/catalog` and Makefile inputs. Lines 54–55 restrict the general source inventory to Go/module/Make files. Lines 60–64 combine that inventory with `kuboInputs` and the hardcoded embed snapshot; lines 115–119 accept equality of these incomplete captures as current source/embed provenance.

Two actual non-Go embedded input groups are absent:

- `K/mcp/contract/contract.go:20` embeds `catalog.json`, `catalog.schema.json`, `schemas`, `confirmation`, `resources`, `derivations`, `agentic`, `fixtures`, `config`, `settings`, `routes` and `decisions`. The package describes these as the single source of truth at lines 1–8.
- `K/assets/assets.go:15` embeds `init-doc`.

`W/test/boundary/evidence-schema.mjs:22` does not include either directory in `kuboInputs`. Independent inspection of the actual owner build receipt confirms its `kuboInputs` has no `mcp/contract` entries, its `buildSource` includes only the 18 contract Go files, and its `embedsAndMake` has no contract data. The assets embedded documents are likewise outside the captures. Swift confirmation-helper data is covered by the existing full `mcp/server` snapshot; this finding does not assert that every embed is missing.

**Effect:** changing embedded contract JSON or initial-document bytes after the recorded build can leave all compared captures equal. The explicit receipt can therefore accept a binary built against different embedded inputs from the current checkout, contrary to the complete source/embed binding claimed by `W/test/boundary/OPERATIONS.md:64`. Contract data affects tool/schema/route semantics, so this is material provenance integrity even though the changed path is test infrastructure rather than production authorization.

**Required correction:** capture all actual compiled embedded inputs, including these two groups, before/after the genuine owner build and in current receipt validation. Add negative coverage that mutates contract data and assets data and requires rejection. Preserve the original receipt and its historical BLOCKED verdict. Because the original build did not record these embedded bytes, a later current-only snapshot cannot retrospectively prove what that build consumed; produce a fresh canonical owner build with complete input captures, or supply genuinely retained equivalent build-time evidence. Do not reinterpret a generic PASS or add a fallback source/binary path.

Root accepted this finding, stopped depending on the original receipt route and revoked the freeze for the correction. The missing inputs and new evidence must receive independent confirmation before this finding can close.

## Other inspected controls and pending checks

| Control | Initial observation |
| --- | --- |
| Explicit test-only opt-in | `W/scripts/agentic-boundary.mjs:187` requires `testOnly: true`, rejects unknown configuration fields and validates a nonempty explicit receipt path. Line 38 forwards it to the existing owned-node helper. Complete export validation remains at line 49. No environment-selected alternative binary or lease authority is introduced. |
| Legacy route | `W/test/helpers/owned-kubo.mjs:23` retains the literal local binary path, symlink rejection and `IPFS_GO_EXEC` constraint. Lines 27–32 keep the original Makefile metadata route when no explicit receipt is supplied. This does not cure I11-SEC-01 in the new route. |
| File/log limits | `W/test/boundary/make-build-receipt.mjs:29` requires confined regular non-symlink evidence, bounded reads and matching hashes. Lines 80–87 check successful command identity/time bounds and both streams; lines 126–158 check canonical compile output, binary and current tool identities. These are trusted-local-file controls, not anti-tamper signing. |
| Tampering regressions | `W/test/boundary/make-build-receipt-negative.test.js:80` covers source/embed/binary/log/path/tool mutations and unsupported receipts. The initial embed negative only changes the MCP App HTML at line 83; it does not cover the omitted contract/assets inputs. Retained 27/27 is root-produced evidence, not reviewer execution. |
| Contrast conservatism | `W/test/boundary/accessibility/contrast/inspect.mjs:95` keeps unsupported effects, clipping, absent background, obscuring hits and mixed descendant colors UNKNOWN; line 136 separates PASS/FAIL/UNKNOWN. `run.mjs:127` initializes each retained occurrence UNKNOWN, binds before/after semantic targets, geometry and PNGs, checks paint stability at lines 147–151, and preserves incomplete/failure summary states at lines 214–219. Final real runtime outputs and independent screenshot review remain pending; source inspection is not contrast clearance. |

## Evidence inspected at this boundary

Independently rehashed the original receipt's bound diagnostic and command logs, all 946 `kuboInputs` files, 971 general build-source files and 20 hardcoded embed/Make files. All recorded hashes matched the current files in those captured sets; the finding concerns omitted input sets, not a mismatch in recorded ones. Actual binary SHA-256 matched `792cb3b214b54daafd8ae432113a8a22c5cf6e0df7c4a15c38de60b28f52eccf`. Original build status remains BLOCKED and its captured before/after sets match.

The reviewed initial source freeze records `make-build-receipt.mjs` as `63fcb9aaf44dcbaa02f6c2d78fd3d9469ec822b11fd757c6d048d447209232b3`, `owned-kubo.mjs` as `a8bcdd02cf72d145e931f5adf708ab3b64348c6a1bb103a2f69e03932649bc19`, and `scripts/agentic-boundary.mjs` as `877d6ff021c5912f3542876f65b5347753a2c4f08e4343b0b2622511dc8bfdf4`. Subsequent correction revokes this initial freeze; those hashes do not approve later bytes.

## V2 source/build confirmation

Independently inspected `W/test/boundary/make-build-receipt.mjs:9`, which now captures full assets and contract trees and the native Swift helper alongside prior App/catalog/Make inputs. Lines 61–79 check every recognized non-test Go embed directive against captured bytes; unsupported quoted syntax and uncaptured expanded inputs fail closed. Existing explicit test-only opt-in, literal binary path, legacy metadata route, confined bounded regular evidence reads, successful canonical command checks and lease/compatibility separation remain intact.

The actual fresh owner build is recorded under `K/evidence/agentic-ui-frontend/issue11-clearance/node-delivery-v2/`. Independently verified all **946 Kubo-input files, 971 Go/module/Make source files and 325 embedded/Make files**, all recorded command-log hashes, bound original/diagnostic hashes and unchanged before/after snapshots. All current bytes match. Original Go/Make/gmake/gofmt executable hashes also match their before/after captures. The canonical fresh `/usr/bin/make build` has PID **70900**, exit **0**. Its generic metadata verdict remains truthfully BLOCKED while the additive binding establishes local-build identity only. This is a genuine new before/build/after capture, not retrospective completion of v1.

V2 artifact binding SHA-256: `e287fe22098788748416505771132acc5f7c06fbf204848000b840a339a16383`. Complete embed/Make digest: `27220580dac3068046397614f2a5b534499ef7431acbc1a81cffa74cfa071223`. Binary bytes remain `792cb3b214b54daafd8ae432113a8a22c5cf6e0df7c4a15c38de60b28f52eccf`; equal binary hashes do not replace the fresh provenance evidence.

Independently hashed every source and retained log in `provenance-regression/source-freeze-v2.json`; all matched. Its retained focused result is **31/31 PASS**, including actual v2 original-helper acceptance, explicit rejection of original v1 provenance and synthetic contract/init-doc/Swift/future-embed tampering cases (`W/test/boundary/make-build-receipt.test.js:27`, `make-build-receipt-negative.test.js:73,88`). These are root/owner executions, not reviewer reruns. The v2 receipt helper hash is `1e82213dea1f9e0c38ca5e966e2a223b06d3b0662fd89f3b6b847c24e784839b`.

### Historical I11-SEC-02 — LOW, resolved by v3 guard/regression

`W/test/boundary/make-build-receipt.mjs:65` recognizes only column-zero `//go:embed`. Go's scanner/compiler accepts whitespace before a standalone directive (local Go compiler `cmd/compile/internal/syntax/scanner.go:741` and `cmd/compile/internal/noder/noder.go:225,304`), so an indented future directive can be skipped rather than rejected. Current five embed-owner directives are column zero and all actual v2 inputs are bound: this does **not** reopen I11-SEC-01 for this build. Harden the parser to recognize leading horizontal whitespace and add an indented unbound-target regression, or use the compiler's embed inventory, before claiming arbitrary future directives fail closed. No implementation or test was run by this reviewer to change that behavior.

### Runtime evidence still pending

The first supplemental contrast run truthfully reports **376 PASS, zero FAIL, eight UNKNOWN** out of 384, status INCOMPLETE and empty cleanup. The observer correction records CSS BODY/HTML overflow propagation and preserves actual container clipping/hit testing (`W/test/boundary/accessibility/contrast/inspect.mjs:11,73`). Its controlled regression exercises propagation, containment, real clipping and obscuring overlays (`inspect.test.mjs:36`). The fresh runtime-2 result below does not rewrite runtime-1's historical unknowns. Final WU/SU packets and published-evidence review remain pending at this report revision.

## V3 and supplemental runtime-2 confirmation

`W/test/boundary/make-build-receipt.mjs:65` now recognizes leading horizontal whitespace. The added indented unbound-target regression at `make-build-receipt-negative.test.js:77` has a retained causal red against the old guard and unchanged green against the correction. Independently hashed all v3 source/evidence entries; they match `provenance-regression/source-freeze-v3.json`, SHA-256 `68279c4865652c0f1881e3a3ab3b9bff09ad188ab35732f93b6d630670d55ca1`. Retained result **32/32 PASS**. Final receipt-helper SHA-256 is `8f5df9b6947fb139f14c0e482096fdfe6bf86c3593cb80469e600db7b76d7f48`. No Go/build-input change is introduced by that JavaScript guard correction, so it does not require another owner build. I11-SEC-02 is resolved.

Independently verified `contrast/runtime-2/summary.json`, SHA-256 `d6312aa9ab89fdc488d61723bf215a55901db3b810ca44398cefe91fd2a40475`: **384 PASS, zero FAIL, zero UNKNOWN**, status COMPUTED-CONTRAST-COMPLETE and empty cleanup. All helper, fixture-record, original report and **384 PNG** hashes match; all 384 original HTML/selector identities match the original node indexes. Recorded targets remain uniquely bound, post-capture paint comparisons are stable, assessments have no unresolved reasons and all ratios meet their applicable thresholds. Minimum recorded ratio is **4.908531945906348**. The current export manifest hash `991c5b3ffeac3c536ac3b0e3fb22d94b67052fd0070659db49c9c3872b4f06f8` matches the runtime record, for artifact `d33f8a78ff496756ff0c28a8dfff75e8e7543641739e7dd39558356e0fb74733`. No stale fallback was required.

Independently opened six bound screenshots from `contrast/runtime-2/screenshots/`: `0001-a2ui-a2ui-axe-light-375-node-0.png`, `0061-a2ui-a2ui-axe-dark-375-node-0.png`, `0183-context-context-axe-light-375-node-62.png`, `0311-context-context-axe-dark-375-node-62.png`, `0377-inbox-inbox-axe-inbox-light-375-node-0.png`, and `0381-inbox-inbox-axe-inbox-dark-375-node-0.png`. The sidebar text lies outside the decorative strip; native scroll exposes the actual event-10 text; the formerly unresolved heading is fully visible in light/dark. The decision fixture explicitly declares no endpoint/authority and leaves review controls disabled. Visual inspection here covers these six representative captures, not every PNG or all application states.

These are supplemental measurements of the reproduced original 384 occurrences on the earlier d33 artifact, with actual computed colors/geometry and retained captures. The subsequent WebUI consumer correction below changes the current export to b9, so final acceptance requires the announced runtime-3 refresh against b9. Runtime-2 remains valid historical evidence, not current-export proof after that change. These measurements do not convert original axe incomplete entries into original automated passes, certify a deployed host, prove physical AT/native presence, or grant consent/lease authority. Runtime-1 and initial blocker evidence remain unchanged.

## Ignored Electron dependency-copy repair

Independently reviewed `K/evidence/agentic-ui-frontend/issue11-clearance/repair-su-electron-copy.py:27` and its immutable before/after inventories. The repair requires every regular file already to match, accepts only the known original-relative-to-copied-absolute link rewrite, requires exactly 14 corrections and compares full origin/copy inventories afterwards at lines 48–49. It changes ignored dependency symlink text, not application source, validator flags, runtime arguments or binary bytes. The failed pre-repair run remains historical; a fresh unmodified standard SU run is required.

Independently checked **all 273 entries in both current origin and copied Electron distributions**: 259 regular-file SHA-256/mode pairs and 14 symlink targets match the original source inventory. Every copied link now resolves within the copied distribution. Zero regular-file differences were present before repair. This is a faithful materialization correction, not an alternate Electron runtime or source-path exception.

Bound evidence hashes: `su-electron-copy-before-repair.json` = `ef4610fed5a132b7e9efe38fd97c8984872ca406d79d46f4c52fb85575b986ad`; `su-electron-copy-repair.json` = `815df5173035999062df75e3c5c275de55f47ae991bd18c5a5e336ea7c466302`; repair script = `f2d9ca97561193149db85572410155a3e0631ca4b78b69ecf4b735bf96adec8d`.

The new shell/decision axe producer records, if they omit incomplete results, establish neither zero incompletes nor comprehensive contrast clearance for those additional surfaces. Keep those results NOT VERIFIED with explicit follow-up. The reproduced original-384 supplemental contrast scope above does not silently expand to cover them.

## Bounded production shell correction and causal confirmation

Independently inspected all four files frozen by `K/evidence/agentic-ui-frontend/issue11-clearance/shell-axe-diagnostic/source-freeze.json`, SHA-256 `c4b4cf0c28946afc19d5edd44152b100ac04753bf9f71d8cc13f29d9127ad2da`, and rehashed its source, original-red and confirmation-adapter bindings. All match.

`W/src/agent-chat/ComposedChat.jsx:13` changes the fixed consumer composer fill to the existing raised token; no palette, callback or authority changes are introduced. `W/src/shell/Home.jsx:8` gives the existing labelled suggestion container a group role while preserving the three explicit `type=button` draft-only actions. `Home.test.jsx:5` checks the named group, each draft action and no submission. `W/test/boundary/chat-runtime/shell-accessibility.mjs:32` now retains the full axe result and screenshot before the unchanged tagged violation assertion at line 36. This improves failure/incomplete retention without weakening the predicate or expanding host authority. The shell is explicitly credential-free and shared-path agent-disabled; raw axe HTML is not asserted safe for arbitrary future authenticated captures.

Independently rehashed `shell-axe-diagnostic/confirmation.json`, SHA-256 `9cfb232caa0d544f0d2ee66737276e793cb9a19adf7b390c482287866b0fc553`, its bound summaries, source freeze, unit receipt, both complete report/PNG/rendered-record sets and the current export manifest. Original dark540 retains one contrast violation and one ARIA incomplete. New dark540 and dark539 reports each contain zero violations and zero incompletes. The exact active Remove-reference target is recorded at 5:1 (`#e96a12` against `#222120`) for a 4.5:1 requirement; the original dark540 contrast failure remains unmodified. Independently opened both new production captures: disabled-origin status/copy remains visible, and the More dialog is present at 539. The guided-tour overlay remains in the captures rather than being suppressed.

Current artifact is `b9c25a7631a0d37d1353efd8f38be7a059f9f63c22f269a3112c1c7e3cc5d69c`, with manifest SHA-256 `2f0e9cf93eff83219987f1d2f10b5b377af7c7ebf89e9345bf8a0b30437a1768`. This two-state causal confirmation is narrower than final all-width/all-slot WU/SU execution and original-384 contrast refresh, which remain pending. Remaining new node-backed axe-retention/coverage gaps are assigned by root to [WebUI #12](https://github.com/GQAdonis/ipfs-webui/issues/12); no zero-incomplete or whole-WCAG claim is inferred for omitted results.

## Final current-artifact runtime confirmation

The completed final WU manifest is `K/evidence/agentic-ui-frontend/issue11-clearance/boundary-final/runs/webui-2026-10-21T23-51-34-263Z-70341/manifest.json`, SHA-256 `ae5c5af0966919a58c7f9cebed04ebe4d892d0276eb07949a9bde3f38eeebea6`. Independently rehashed **all 946 retained artifacts**, command stdout/stderr, current harness and Kubo source inventories. All 20 family outcomes and 20 successful source/assertion/PNG bindings are PASS across the five families/four slots. All **16 complete shell axe reports** retain zero violations and zero incompletes. Cleanup is empty and no interruption is recorded. This does **not** change the broader WU result: **38 PASS, 17 BLOCKED, 12 FAIL**, outer FAIL, phase BLOCKED. The twelve failures in UI-101/102/105/114/115 remain explicit and are outside this bounded UI-112 clearance.

The completed final SU manifest is the adjacent `desktop-2026-10-21T23-52-03-762Z-75027/manifest.json`, SHA-256 `a38be27af68b625ea2a10b01c35d01e812529294797710acd3c1660173fcb1a0`. Independently rehashed **all 95 retained artifacts**, command streams and current copied Desktop/Kubo inputs. Four independent UI-112 slots PASS, cleanup is empty and no interruption is recorded. Overall SU remains **seven PASS, two BLOCKED, one NOT_EXERCISED**, outer BLOCKED. Native physical presence/effect obligations do not become passes through this presentation evidence.

Independently verified all 53 historical original source guards and all 53 current publication guard entries in `source-guard-reconciliation.json`: **51 unchanged and two expressly authorized deltas** (receipt forwarding in the runner and stronger shell failure/incomplete evidence retention). The original checkouts' 53 entries remain unchanged. This is an explicit reconciliation, not a claim that publication source is byte-identical to the old freeze.

The final SU transfer records 6,617 copied entries and equal origin-before/origin-after/copied source snapshots at transfer time. Independently checked current bytes: **6,616 entries still match both original and copied paths**; the sole expected derived-output change is copied `src/agent/confirm/ui/local-assembly.json`, rewritten by the normal assembly for the snapshot host paths. That report is covered by the current successful lane input/assembly record. Do not relabel it as unexplained source drift or claim all 6,617 entries remain identical after assembly.

Fresh `contrast/runtime-3/summary.json`, SHA-256 `d682a4dae0d87ce333c4607171364b50de71b04e56e50e8270d4b7e204bd71dc`, records **384 supported computed PASS, zero FAIL, zero UNKNOWN**, empty cleanup, on current b9. Independently rehashed all helpers/records/original reports and **384 PNGs**; every original node index/HTML/selector is preserved, each paint comparison is stable and each recorded ratio meets its applicable threshold. `contrast/current-manifest.json`, SHA-256 `4ec0abc5c4bb48b69d294e4affa3b43069a317a726eb1d5982df54ff37c6fb9d`, and its disposition/report/script bindings also match. These are distinct manifest and summary hashes. Original incomplete reports remain unchanged and the helper reports no new axe invocation.

For visual confirmation, four of the six representative runtime-3 captures are byte-identical to the corresponding runtime-2 images inspected above. Independently opened the two differing current images (`0061-a2ui-a2ui-axe-dark-375-node-0.png` and `0377-inbox-inbox-axe-inbox-light-375-node-0.png`); their current content supports the same bounded observations. This is representative visual review, not a claim of visual inspection of every PNG.

Post-runtime build validation `post-runtime-build-validation/receipt.json`, SHA-256 `cb157caa9cf2352e7e4ee6f6a37c6249c14b36a22fd3d9ce5adfb88b5851ce02`, retains PASS/empty cleanup. Independently verified its script hash, current binary bytes and all six command-log bindings. It uses the strict local-build-only provenance method, with no new lease or backend authority.

The decision contributor still omits axe incomplete data at `W/test/boundary/accessibility/contributions/decisions.mjs:132`; its incomplete inventory remains **NOT VERIFIED**, with [WebUI #12](https://github.com/GQAdonis/ipfs-webui/issues/12) retaining the reporting/assessment work. The final shell reports now retain their full inventory. Neither the authored UI-112 passes nor the original-384 measurements certify full WCAG, whole-phase success, physical AT, live backend effects or model interruption.

## Final draft-publication package

Independently inspected `W/docs/design/issue-11-clearance/README.md`, `verification.json`, `evidence-index.json`, `source-transfer-reconciliation.json`, the archive and candidate source inventory after root declared the package ready. The operator authorized publication of the frontend migration with the scoped correction; this review does not authorize merge or imply publication of the sibling Kubo packages.

The README and verification accurately distinguish the five-family/four-slot presentation passes and original-384 measurements from the broader WU FAIL/SU BLOCKED results, remaining decision incomplete inventory, physical/native/backend-effect gaps and whole-phase/WCAG non-certification. The README explicitly requires a **draft PR targeting main** pending immutable companion frontend packages, reproducible CI composition and remaining phase gates. It documents representative capture selection, nonportable local paths, the need for fresh source-bound evidence after relocation, and the expected generated assembly-report difference. The published transfer reconciliation matches the independently observed 6,616/6,617 distinction above.

Independently checked `verification-evidence.tar.gz`: SHA-256 `817901a4b9cc362a13603d4265ab05d28bee3e607dbdb041aec229ac7c64f694`, **11,444,643 compressed bytes**, **516 regular-file members**, **187,044,225 expanded bytes**. Every member is unique, non-absolute, free of traversal, backslashes, control characters and drive paths, with no symlink, hardlink, device or other special entry. Every extracted-in-memory member's size/hash matches both the index and its retained original. No filesystem extraction or archive script execution was performed. The archive is bounded evidence data, not a portable build or backend authority package.

Independently checked all **121 separately published representative PNGs** against their originals, index hashes, byte lengths and PNG signatures. Full omitted capture corpora remain referenced rather than falsely claimed included. Historical failures, original contrast reports and new complete raw measurement/shell data retain their own identities.

Candidate inventory `K/evidence/agentic-ui-frontend/issue11-clearance/publication-candidate.json` contains **1,195 operations: 1,183 writes and 12 deletions**, with **43,405,843 written bytes**. Independently verified every current candidate hash/size or deletion. No candidate installed `node_modules` path, source symlink or native binary is introduced. The earlier separately reviewed dependency cache materializations remain outside the source publication.

Scanned all candidate source/evidence files and every decompressed archive member for private-key, GitHub/AWS/OpenAI token, JWT and credential-bearing URL markers, emitting locations only. No high-risk secret marker was found. All URL-userinfo matches in archived unit results/stdout exactly match known source test/example strings; no observed operator credential was found. No private-key/database/daemon-config/HAR archive filename was present. The package intentionally retains disclosed local checkout-path metadata and test-owned node identities, not an operator's live repository. These checks are not a guarantee against arbitrary undisclosed secrets. No process arguments or unrelated tool-output credential values were inspected or reproduced.

The archived unit result independently records **2,022 PASS, six pending, zero failures** (2,028 total), with `success: true`; its full archived bytes match the retained original. The package reports all six quality checks passing while keeping them separate from broader runtime failures. No new tests, builds, dependency installs, network operations or runtime sessions were launched by this reviewer.

| Inspected publication document | SHA-256 |
| --- | --- |
| `README.md` | `6f2a745f622d578fb1a9e300278b120d9ecacf320423191be2eb9210acd9e4a7` |
| `verification.json` | `352aab8fa42722211e8afd4c32f993dbd16d416abbf77d5823dc4bf97fa2644d` |
| `evidence-index.json` | `026dd04cb74d2efe595b2e867a8f989043b142dd5060fa4a7166b03f858e036d` |
| `source-transfer-reconciliation.json` | `c2fc5af82918f05977083eaad240396b06d66a56c1f9f079ce887a971591086c` |

Root will add the final independent reports and file manifest after this review; those expected documentation additions do not expand this security disposition to new production source or broader readiness. Preserve the exact reviewed source/evidence and draft/non-certification statements when staging and publishing.

**Final scoped security PASS. Both security findings resolved; broader phase BLOCKED, broader WU FAIL, decision incomplete inventory NOT VERIFIED under #12.** No production MCP authentication, principal scopes, egress/confirmation enforcement, shell tools, SSRF, DNS rebinding, CSP/sandbox, Electron safeStorage or plugin-launch security is re-certified by this test-infrastructure and packaging review. No tracking, endpoint/off-switch or no-silent-CID-injection exception is granted.

## Staging addendum: preserve hash-bound license line endings

**Packaging-only correction PASS; scoped disposition unchanged.** Final staging exposed `text=auto` normalizing two already reviewed vendored license files from CRLF to LF. Root added only these exact `-text` entries to `W/.gitattributes:6` and line 7:

- `vendor/ipld-explorer-components/dist/licenses/filesize@10.1.6/LICENSE`
- `vendor/ipld-explorer-components/dist/licenses/tslib@2.8.0/LICENSE.txt`

Independently inspected the staged attributes diff: the existing general/fixture rules are unchanged, with no broad normalization exception. `.gitattributes` lies outside the existing export and boundary input sets. Its staged and worktree bytes match, SHA-256 `d362c8142e196c47b975e55e9935ef802006c2b14496aade2d1b6eccc1c84487`.

The first plain restage retained stale normalized index blobs; independent verification detected that and root forced exact-file re-indexing with `git add --renormalize`. Final independent checks show `i/crlf w/crlf attr/-text` for both paths, and **staged blob = worktree bytes = reviewed candidate hash**:

| License | SHA-256 | Preserved CRLF sequences |
| --- | --- | ---: |
| `filesize@10.1.6/LICENSE` | `a1ac0a1c975fdadf4a1b13fb4be3dff5083eb19ce4c396721e71676be401916f` | 28 |
| `tslib@2.8.0/LICENSE.txt` | `210b19e543130388c68654b7497e967119ce17145f66ab7d85688fbd70f08751` | 11 |

No license content was rewritten and no runtime, validator, export, boundary or production-source input changed. The exact attributes file is an additional reviewed packaging operation beyond the earlier 1,195-operation inventory, alongside the previously planned final reports/hash manifest. Existing generated/vendor patch whitespace and frozen migration-document warnings are not cleared or represented as newly fixed by this addendum. No test or build rerun is needed to verify this byte-preserving staging correction; this reviewer used read-only Git/blob/hash inspection only. **Final scoped security PASS remains in effect.**
