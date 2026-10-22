# Issue #11 independent product review — scoped final acceptance

2026-10-21. Independent native reviewer context `/root/issue10_product_review`, separate from implementation and root verification. Read-only outside this findings file. Uses the previously loaded `code-review-and-quality`, `prometheus-ui-review`/`better-accessibility` and OpenSpec verification guidance. No taste guidance, redesign, implementation, build, tests or browser launch was performed by this reviewer.

**Final scoped disposition: PASS. Draft publication handoff: PASS. Broader phase/release readiness: BLOCKED.** The final confirmation sections below supersede the interim BLOCKED findings, which remain preserved as causal history. All required current UI-112 family/slot contributions pass and every original retained contrast occurrence has a supported current disposition. No whole-WCAG, physical assistive-technology, native-presence or backend-effect certification is supplied. Publication approval covers the exact reviewed candidate and evidence bundle; root owns external actions and subsequent final review/manifest additions.

## Historical acceptance blockers — subsequently corrected

The completed actual-node WU execution independently contains 19 of 20 UI-112 family contributions PASS and `shell/axe` FAIL. Root identified the failing scan as dark-theme width 540, after light-theme widths and dark 320/375/539 executed. It blocks the explicit issue criterion to run the existing production-path registrations with all families, slots, themes and widths. It must not be reclassified as a missing backend prerequisite or offset by the supplemental contrast result. The original packet, diagnostic and causal failure remain history while the owner establishes the minimum coherent correction.

The completed post-link-repair Desktop run also fails all four UI-112 slots with a five-second polling timeout (`Expected: true; Received: false`). Its cleanup is empty, which does not establish that the accessibility checks passed. The cause still requires owner diagnosis and successful current-source confirmation; this is a second acceptance blocker.

| Completed failing packet, beneath `evidence/agentic-ui-frontend/issue11-clearance/boundary-v2/runs/` | Manifest SHA-256 | Result |
| --- | --- | --- |
| `webui-2026-10-21T23-33-07-525Z-3972/manifest.json` | `823a2aa37607b962eaea2345b84cd730142a4d9a1d4b276adcb8407bafc979f9` | FAIL; 36 PASS/17 BLOCKED/14 FAIL overall; 19/20 accessibility family outcomes PASS; empty cleanup |
| `desktop-2026-10-21T23-40-20-957Z-30084/manifest.json` | `9cde4cdbe0c7a09c20cd4bf68d7a66181cad61d50c7a23c20ea3c2fb014fffdc` | FAIL; 1 PASS/8 FAIL/1 NOT_EXERCISED overall; all four accessibility slots FAIL; empty cleanup |

`test/boundary/chat-runtime/shell-accessibility.mjs` currently asserts before retaining the failing per-width report/PNG; the reporter returns passes/violations without an incomplete inventory. The original assertion remains valid; absent detailed failure evidence is a diagnostic coverage limit. No source change is authorized by this review. Final disposition requires actual corrected-source evidence through normal export/assembly and affected WU/SU confirmation.

Independent inspection of the later full actual-node diagnostic confirms the cause: `mcp/ui/src/styles/components.css:368` applies the `iu-btn--text` treatment to the normal 14.5px Remove reference button in the composer. Axe reports foreground `#e96a12` on `#2d2c2a`, 4.34:1 against required 4.5:1. The dark-540 PNG visibly includes that orange Remove label. The dark-539 diagnostic has zero violations. All six diagnostic report/rendered/PNG bindings rehashed without mismatch. The dark-540 full report also retains one `aria-prohibited-attr` incomplete on the generic Draft suggestions container; it is a disclosed incomplete, not an inferred PASS.

## Completed source and retained-evidence checks

- The explicit test-only make-build receipt path preserves legacy Makefile build-info validation when not selected. It rejects symlinks, out-of-evidence logs, oversized receipts, stale source/embeds/tool identities, altered binary/version/buildinfo, failed/ambiguous commands and missing canonical injection proof. It does not trust an overall PASS label or grant backend authorization. The v3 embed guard covers leading spaces/tabs; retained causal red and unchanged green record 32/32 passing including the actual owner-build receipt and rejection of incomplete v1.
- Independently rehashed every captured fresh-v2 build source/embed input against current Kubo files with zero mismatches; before and after captures are equal. Current binary SHA-256 is `792cb3b214b54daafd8ae432113a8a22c5cf6e0df7c4a15c38de60b28f52eccf`. The original generic BLOCKED identity result caused by omitted trimpath linker metadata remains preserved rather than overwritten. This establishes local build identity, not backend compatibility or lease adoption.
- Independently rehashed v3 provenance source/evidence files and all quality-v2 log bindings with zero mismatches. Six recorded checks exit zero: eslint, typecheck, dependency check, vendored WebMCP check, unit and build. The unit receipt records 2,020 PASS, six pending, zero failures. Tests were inspected rather than rerun here.
- Contrast runtime-2 maps every original incomplete report/index/target/HTML to exactly one measured occurrence: all 384 original nodes, all sixteen reports and all 384 screenshot hashes matched. All 439 recursively retained source/runtime/report/PNG file facts matched current files at this review checkpoint. All helper hashes matched. Result: 384 computed PASS, zero FAIL/UNKNOWN, empty cleanup. Original axe incomplete records remain unchanged.
- Reviewed all sixteen state-representative runtime-2 PNGs spanning A2UI/context and inbox/Activity, both themes and 375/1440 widths; additionally inspected exposed virtual event 10 (`0311-context-context-axe-dark-375-node-62.png`) and minimum-ratio Type header (`0107-a2ui-a2ui-axe-dark-1440-node-14.png`). The latter measures 4.908531945906348 against 4.5, with the eight-pixel edge pseudo-element outside the text geometry. All 108 formerly clipped event occurrences record ancestor scrolling and fully visible hit-tested target text. All eight fixture headings record viewport-propagated BODY overflow, positive text geometry and unobscured H1 hits.

The first multi-image tool presentation appeared to crop Activity headings; standalone reinspection of the exact same hashes showed the full headings. The suspected screenshot inconsistency was retracted to root. It is not a product defect or a reason to rerun evidence.

## Contrast scope and remaining verification

Runtime-2 summary SHA-256: `d6312aa9ab89fdc488d61723bf215a55901db3b810ca44398cefe91fd2a40475`, under `evidence/agentic-ui-frontend/issue11-clearance/contrast/runtime-2/`. It is supplemental current-component evidence for the original 268 pseudo-element, 108 clipped-event and eight fixture-heading occurrences. It does not automatically clear new node-backed audit incompletes, physical AT, deployed-host overrides or whole WCAG certification. Recheck relevant payload bindings after any product correction before adopting it as current evidence.

Existing decisions and shell axe contributors retain passes/violations while omitting incomplete results. Therefore new node-backed incomplete inventories are **Not verified**, never zero by inference. This limits broader contrast certification. In isolation it is not a scoped #11 closure blocker: the issue names the retained sixteen static reports/384 occurrences and separately requires execution of the existing node-backed assertions. The actual dark-540 assertion failure above is a direct scoped blocker and remains so until corrected and confirmed. Any claim that all accessibility incompletes or WCAG are fully cleared would be unsupported.

Corrected WU/SU evidence, successful owned cleanup, all twenty family outcomes/four Desktop accessibility slots and current artifact/source/runtime bindings remain to be reviewed. Root disclosed an earlier SU failure from copied Electron framework links; its failed packet remains history. A separate ignored-dependency layout repair restores fourteen original relative links while retaining regular bytes/modes. The post-repair packet above reaches a different actual failure; neither failed packet can be reused as a PASS.

Root subsequently identified the post-link-repair timeout as missing copied static locales (`assets/locales/en.json`), not an established Desktop application defect. Its source snapshot supplement copies the original static assets byte-for-byte and excludes derived `assets/webui`. This explains the failure without converting it into successful UI evidence; the new fully supplied execution remains required.

No Go/RPC/gateway/CID/wire, contract or privileged Desktop source implementation is reviewed as changed here. Go lint/targeted compatibility tests were not executed by this frontend reviewer and are not certified by frontend or local build receipts.

## Bounded correction review — final packets still pending

The architect-authorized correction is confined to four publication WebUI paths: ComposedChat changes the composer background from existing `control` to approved `raised` without changing field/button fills or any palette value; Home adds the semantic group role to its existing named Draft suggestions container; the focused Home test verifies all three suggestions set their intended draft/intent and never submit; shell accessibility writes the complete axe result and PNG before the original unchanged assertion. Both themes, all eight widths, rule tags, thresholds and family membership remain intact.

Independently rehashed all four correction files against `shell-axe-diagnostic/source-freeze.json` with zero mismatches. Freeze SHA-256: `c4b4cf0c28946afc19d5edd44152b100ac04753bf9f71d8cc13f29d9127ad2da`. The retained 15/15 focused tests supplement the original real-browser causal red; they do not substitute for browser confirmation.

The subsequent actual-node `shell-axe-diagnostic/confirmation-1` diagnostic retains zero violations and zero incompletes at dark 540 and 539, with empty cleanup. Its six report/PNG/rendered bindings independently rehashed without mismatch, and the dark-540 PNG was viewed. The exact Remove reference node now appears in the color-contrast **passes**: foreground `#e96a12`, background `#222120`, ratio 5 against required 4.5, normal 14.5px. The named suggestions group no longer yields the earlier aria incomplete. Confirmation summary SHA-256: `d84bacd480ffcffdaf2e1b628a5f45d532fe96979fe09e8093edb1a52e3ab46a`.

This supports the narrow product correction. It does not yet replace the failed whole WU/SU runs above or establish issue closure: refreshed contrast-runtime-3, full current WU and the complete-asset Desktop confirmation remain pending independent inspection.

## Current contrast and quality confirmation

Runtime-3 has since completed on refreshed artifact `b9c25a7631a0d37d1353efd8f38be7a059f9f63c22f269a3112c1c7e3cc5d69c`: **384 computed PASS, zero FAIL/UNKNOWN, empty cleanup**. Independently revalidated all 384 original report/index/selector/HTML mappings, all 384 screenshot hashes, 439 nested retained/current file facts and every individual disposition's ratio, threshold, visibility, hit-test and paint-stability correspondence. No mismatch. Reviewed current changed state captures; unchanged representative screenshot hashes reuse already inspected pixels across the sixteen represented states. The minimum supported ratio remains 4.908531945906348. The full packet confirmations remain pending; this is not a whole-phase disposition.

| Current contrast evidence, beneath `evidence/agentic-ui-frontend/issue11-clearance/contrast/` | SHA-256 |
| --- | --- |
| `runtime-3/summary.json` | `d682a4dae0d87ce333c4607171364b50de71b04e56e50e8270d4b7e204bd71dc` |
| `current-manifest.json` | `4ec0abc5c4bb48b69d294e4affa3b43069a317a726eb1d5982df54ff37c6fb9d` |
| `report-current.md` | `9cd033762f68f379eb6084a5b7e0c9563105e0d3e8d0398a7a362eee91d8afd5` |
| `runtime-3-dispositions.json` | `9ef960500eaec78400a3e733fd25d5a48959c547924dd918bcb77531276181f6` |

The current quality-v3 receipt records all six checks exit zero and 2,022 unit tests PASS, six pending, zero failures. Every corresponding stdout/stderr binding independently rehashed without mismatch. Source/test changes after the preceding quality-v2 receipt are therefore represented separately; earlier counts remain historical.

## Final current-artifact runtime confirmation

Reviewed against the new architect-owned `frontend-accessibility-live-evidence` proposal/design/tasks and its exact correction grants. The change intentionally sets `skip_specs: true`; new delta-spec mapping is not applicable. Task deliverables are checked against source and actual evidence here; task checkboxes remain root's administrative reconciliation, not proof of implementation or phase completion.

| Final packet, beneath `evidence/agentic-ui-frontend/issue11-clearance/boundary-final/runs/` | Manifest SHA-256 | Actual disposition |
| --- | --- | --- |
| `webui-2026-10-21T23-51-34-263Z-70341/manifest.json` | `ae5c5af0966919a58c7f9cebed04ebe4d892d0276eb07949a9bde3f38eeebea6` | UI-112 PASS; all twenty family outcomes PASS; empty cleanup; no interruption. Outer WU remains FAIL: 38 PASS/17 BLOCKED/12 FAIL. |
| `desktop-2026-10-21T23-52-03-762Z-75027/manifest.json` | `a38be27af68b625ea2a10b01c35d01e812529294797710acd3c1660173fcb1a0` | All four independent UI-112 slots PASS; empty cleanup. Outer SU remains BLOCKED: 7 PASS/2 BLOCKED/1 NOT_EXERCISED. |

Both final lanes bind artifact `b9c25a7631a0d37d1353efd8f38be7a059f9f63c22f269a3112c1c7e3cc5d69c`. Independently rehashed the WU manifest, 2,699 current source/harness/package input entries, Node/browser executable identities and every command stdout/stderr binding with no mismatch. Its 117 commands contain 116 exits zero and one exit one from the broader role-coverage check; no all-commands-green claim is made. Both owned Kubo fixtures bind the exact local owner-built binary `792cb3b214b54daafd8ae432113a8a22c5cf6e0df7c4a15c38de60b28f52eccf` through the strict explicit make-build receipt. Their API/gateway/swarm ports are dedicated loopback ports, rather than the operator defaults.

All twenty successful WU contribution records independently retain positive assertions, actual PNG artifacts and current source bindings. Rehashed their 395 unique contribution artifacts and every declared contributor/fixture input with no mismatch. Each shell slot has all sixteen actual theme/width results: light and dark at 320/375/539/540/768/1024/1440/1920. The sixteen newly retained full shell axe reports contain **zero violations and zero incompletes**. Width coverage is now observed execution, not authoring alone. Viewed current light-320 open-More and dark-1920 production-shell PNGs in addition to the exact corrected dark-540 diagnostic.

All four Desktop slots independently retain successful actual-Electron observations and artifacts. Rehashed all 56 UI-112 Desktop artifacts, 2,801 captured current source/package inputs, Node/Electron executable identities and all 36 command log bindings with no mismatch. Eighteen commands exit zero. Inspected native dark axe and result-keyboard-focus captures; their operation-outcome language stays explicitly unknown where appropriate. These fixture-renderer results do not establish OS presence-factor success or physical screen-reader behavior. The original ICU-link and missing-locale failures remain valid historical setup failures; the complete-asset snapshot's successful execution supplies new evidence rather than relabeling either failure.

The source-guard reconciliation is accurate: all 53 historical guards remain unchanged in their original worktrees; publication has 51 unchanged entries and two explicitly authorized changes (strict receipt configuration wiring and stronger shell axe evidence retention). Independently rehashed all 53 current publication entries with no mismatch against their stated current hashes. Do not describe all 53 publication hashes as identical to the old freeze. Reconciliation SHA-256: `adbb52566bfddea397f7c858ebbaac6a9db5a40d9165b82ac1e0f2b569f05ae3`.

The original 384 contrast dispositions are now bound to this same artifact through runtime-3, as verified above. They are supported computed rendered-node dispositions plus scoped independent visual inspection, while the original axe incomplete records remain untouched. Full visual review of all 384 PNGs is not claimed.

## Remaining scope limits and final finding

No unresolved blocker remains for the bounded #11 requirements: exact local owner build provenance, all existing actual-host accessibility contributions, all authored shell cases actually executed, all 384 original contrast dispositions, current artifact/source/runtime bindings and successful owned cleanup are supplied.

The remaining node-backed **decision** axe incomplete inventory is not retained by its existing reporter, so it remains **Not verified**, never zero by inference. [WebUI #12](https://github.com/GQAdonis/ipfs-webui/issues/12) is open with concrete full-retention and assessment criteria; its current body accurately excludes the shell gap now corrected. This does not invalidate the issue's original sixteen-report/384-occurrence disposition or the existing decision assertion results. It prevents broader claims that every possible incomplete or WCAG requirement is cleared.

Outer packet failures remain real outside this bounded acceptance: relative production routes, role coverage/token baseline, composer/phone-navigation behavior, Files/Pins controls and several Explore/Peers/Diagnostics/Settings checks still fail in the wider WU packet. They are not all missing-backend blockers and do not become PASS through this scoped review. The migration PR remains a draft until its broader readiness requirements, immutable sibling-package delivery and reproducible CI are addressed. Existing backend lease/native obligations also remain separate. Root must preserve these statuses in issue/publication wording.

Approve the scoped runtime result for issue #11. Do not mark the whole phase, broader migration, release or full accessibility compliance complete from this report.

## Final publication handoff review

Reviewed publication `docs/design/issue-11-clearance/{README.md,verification.json,evidence-index.json,source-transfer-reconciliation.json}`, the evidence archive, all published capture bindings and the exact publication candidate inventory. **PASS for a draft PR targeting main.** No actionable publication correction was found.

The README and verification document accurately distinguish scoped #11 PASS from raw WU FAIL/SU BLOCKED, unverified decision incomplete inventory (#12), whole UI-112/WCAG certification, physical AT/native presence and backend effects. They preserve the exact current artifact and counts, the 32/32 focused provenance and 2,022 passing/six pending unit results, normal export/assembly and source-guard deltas. Historical failures and prior local-only delivery statements remain history. The unpublished sibling Kubo frontend packages and missing reproducible single-repository CI are explicit draft-readiness blockers. The bundle does not claim to publish those companion packages or to supply portable backend execution authority.

Independently read the archive without extracting it: **516 unique regular-file members**, no absolute/traversing member names or link members, all indexed hashes/byte counts equal both archive payloads and their original retained files. The compressed archive has 11,444,643 bytes, SHA-256 `817901a4b9cc362a13603d4265ab05d28bee3e607dbdb041aec229ac7c64f694`. All **121 published PNGs** matched both their indexed hashes/byte counts/signatures and original files: 72 WebUI, 24 Desktop, 21 contrast and four shell-correction captures. The documentation correctly calls these representative captures and does not claim to include the full screenshot corpus. The twenty-one contrast captures retain all sixteen report-state representatives plus additional event/minimum-ratio cases; current JSON retains all 384 measured occurrences and omitted-image hashes.

Independently rehashed all **6,617 source transfers**. Every current origin matches its transferred original hash; 6,616 copied files remain identical. The sole expected copied difference is `ipfs-desktop/src/agent/confirm/ui/local-assembly.json`, regenerated normally from original hash `fa59c5e830d186be1cf9d28bf2f4c8342417844fa3dec72d98364216c102b6c6` to current hash `b7158e4981d967a5072ea07d2cf44173d1bddf98fcf3bde3d7e871f5e1d73bae`. The reconciliation reports that exact exception rather than claiming every copied byte stayed unchanged. The post-runtime complete build-validation receipt is PASS with empty cleanup, matching binary identity and six successful commands; all twelve associated log hashes matched independently.

Publication candidate SHA-256: `cbdb6a4ae7082c90c6bf678e5c83b09d79e2f91c2d225a33467309b082a4ff50`. Independently checked **1,195 candidate entries: 1,183 writes and twelve deletions**, totaling 43,405,843 written bytes. Every current candidate file hash/size and deletion matches. The inventory contains no installed cache files, source symlinks or native executables. The largest candidate is the explicitly documented evidence archive. This is the approved migration-plus-fix draft scope, not a claim that the entire migration is independently release-ready. Final review copies and the final file manifest are root-owned additive metadata after this checkpoint; a product-source change would require fresh relevant review.

| Reviewed publication document | SHA-256 |
| --- | --- |
| `README.md` | `6f2a745f622d578fb1a9e300278b120d9ecacf320423191be2eb9210acd9e4a7` |
| `verification.json` | `352aab8fa42722211e8afd4c32f993dbd16d416abbf77d5823dc4bf97fa2644d` |
| `evidence-index.json` | `026dd04cb74d2efe595b2e867a8f989043b142dd5060fa4a7166b03f858e036d` |
| `source-transfer-reconciliation.json` | `c2fc5af82918f05977083eaad240396b06d66a56c1f9f079ce887a971591086c` |

The reproduction notes correctly require matching current sibling sources, pinned tools, a new same-checkout canonical build/receipt and normal producers for a relocated checkout. Archived absolute paths are retained execution identities, not rewritten as portable current authority; omitted local captures are references, not fabricated downloads. No new test/build/browser execution was performed for this publication review.

## Staging addendum — exact vendored license bytes

**PASS for the packaging-only attributes correction.** Root `.gitattributes` adds exactly two literal `-text` rules: `vendor/ipld-explorer-components/dist/licenses/filesize@10.1.6/LICENSE` and `vendor/ipld-explorer-components/dist/licenses/tslib@2.8.0/LICENSE.txt`. No wildcard normalization policy or product source changes are included. Attributes-file SHA-256 is `d362c8142e196c47b975e55e9935ef802006c2b14496aade2d1b6eccc1c84487`; the staged and worktree attributes bytes are identical.

The initial `text=auto` index had normalized both hash-bound licenses to LF. Ordinary restaging after adding the attributes still left the normalized blobs, which this reviewer caught and reported before approval. Root then forced exact-file re-indexing with `git add --renormalize`. Independent final `git show :<path>` byte checks confirm index equals worktree and the reviewed candidate for both files:

| License | Exact staged SHA-256 | Preserved CRLF sequences |
| --- | --- | ---: |
| `filesize@10.1.6/LICENSE` | `a1ac0a1c975fdadf4a1b13fb4be3dff5083eb19ce4c396721e71676be401916f` | 28 |
| `tslib@2.8.0/LICENSE.txt` | `210b19e543130388c68654b7497e967119ce17145f66ab7d85688fbd70f08751` | 11 |

`git ls-files --eol` now reports `i/crlf w/crlf attr/-text` on both. The attributes file is absent from the actual current export input captures and WU harness capture; this correction preserves the previously reviewed artifact/license bytes rather than changing runtime inputs. No new runtime execution is required by this packaging correction. Existing generated/vendor patch whitespace and frozen migration-document warnings remain disclosed rather than rewritten after verification. The final candidate/file manifest must include the attributes addition and refreshed final review copy; broader draft/readiness limitations remain unchanged.
