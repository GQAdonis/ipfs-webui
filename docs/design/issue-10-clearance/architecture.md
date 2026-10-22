# WebUI issue #10: scoped architecture and delivery assessment

2026-10-21. Architect-owned additive assessment for the operator's selected scoped closure. This document does not change production, acceptance predicates, canonical phase state, or previous evidence. Root owns final validation, publication and the issue action; separate contrast assessment remains outside this author's work.

The implementation and retained review satisfy the bounded family-isolation and width-authoring change. They do not complete whole UI-112. The uncomfortable delivery limitation is that the fix lives in an uncommitted migrated frontend tree: closing the scoped issue must not imply a merged, remotely installed or independently runnable release.

## Acceptance map

| Issue acceptance | Evidence and disposition |
| --- | --- |
| Exactly five families and four slots; independent Desktop contributions unchanged | Current registration imports the fixed family/slot lists; final WU has 20 outcomes. Twelve A2UI/inbox/context contributions PASS; eight decisions/shell contributions BLOCK. Desktop's four UI-112 contributions PASS independently. |
| Complete current-export validation and path/symlink/hash guards | Registration calls `getMetadata` before dispatch; the production accessor performs complete export validation. Existing composition helper validates source/fixture paths and before/after hashes. Independent security review reports no weakened guard. |
| Attempt every family and preserve FAIL > BLOCKED > NOT_EXERCISED > PASS | Actual imported-registration regressions record causal old behavior 7 PASS/22 FAIL followed by unchanged 29/29 PASS. Source review confirms unsuccessful callbacks are followed by source validation without downgrading stronger errors. |
| Actual assertions, PNG evidence and current bindings required for PASS | Composition keeps unsuccessful outcomes distinct from successful contribution bindings. Frozen tests cover empty callbacks, generic results, missing families, source mutation and missing evidence. Independent security review rehashed successful WU artifacts and 95 SU artifacts. |
| Meaningful red followed by unchanged green through actual loader | Retained task-1/task-2 regression receipts and source freezes are preserved. Unit callback evidence is orchestration proof only. Measured heading correction additionally retains shared 43/45 and chat 4/9 old results, then 45/45 and 9/9 green; additive naming coverage is excluded from causal defect proof. |
| Six adopted shell widths plus breakpoint probes, both themes and existing checks | `shell-accessibility.mjs` authors 320/375/539/540/768/1024/1440/1920 across all four slots and both themes. No actual shell viewport proof is claimed while the node prerequisite is absent. |
| Normal frontend export/assembly and source-bound WU/SU with cleanup | Retained producers each exited zero once. Assembly wrapper's baseline-path error remains retained separately from subsequent read-only validator PASS. Final WU records 21 PASS/46 BLOCKED/0 FAIL; SU records 7 PASS/2 BLOCKED/1 NOT_EXERCISED/0 FAIL. Both outer packets are source-current at execution and have empty cleanup. Root separately checks present freshness. |
| Independent fixture results visible while whole UI-112 remains BLOCKED | All 20 family outcomes remain visible. No fallback shell/decision host, backend build, lease adoption, validator relaxation, live-effect inference or physical-AT certification is supplied by this assessment. |

## Bound evidence

Paths below are relative to the isolated Kubo root. These identities were read from existing records, and the selected 18 source files were independently rehashed before copying.

| Artifact | SHA-256 |
| --- | --- |
| `evidence/agentic-ui-frontend/correction-batch/frontend-accessibility-family-isolation/task3/measured-correction/final-source-freeze.json` | `c4b523ea5be5041d5bbd0140829b3a4bc3962f898d8265ba54540fea55f33176` |
| Same directory, `confirmation-summary.json` | `ca98a12ae4d3eec6bc798f6ca7b8727a2f8d938078c1f371db84bcb4d0fd3c23` |
| Shared frontend artifact | `1fba713ea487e0985eae8b110b8395e485c04b2fec718349918c0da0392a7338` |
| Final WU lane manifest | `f33eec8e7c3f67e5c511869951ec5fc2f41f2838cebb9831101e93e36d7db707` |
| Final SU lane manifest | `458541f6040523bcc05c9a2d6d63d68f84c9a324705089b9f4aa1d0b05dd1917` |
| `.agent-team/kubo-ipfs-agentic/findings/security/frontend-accessibility-and-reporting.md` | `16b70c098a36baaa1d5e860269f38dfd22158b7ea8dc09b8b6395ebfa6d68a4c` |
| `.agent-team/kubo-ipfs-agentic/findings/review/frontend-accessibility-and-reporting.md` | `759d68aae33ee61b71afb4f8e04d04ee49364b85bdadd842f71c807bade99ef2` |
| This handoff's `source-bundle/manifest.json` | `e2331fdf3e634f11d83ac743ecc2b2b2382a284986817ca077f76d23ae3242df` |

Both independent reviews give scoped PASS and whole-phase BLOCKED. Their conclusions rely on retained executions, not new execution by this author. All sixteen retained static axe reports have zero violations but 384 repeated color-contrast incomplete node occurrences. Prior visual inspection did not resolve those incomplete checks. Any new manual contrast disposition must cite the separately produced assessment and its actual coverage; this architecture document grants none.

## Actual node blocker and remaining owners

The isolated `cmd/ipfs/ipfs` is absent. `test/helpers/owned-kubo.mjs` requires that literal local non-symlink path, rejects redirected `IPFS_GO_EXEC`, and checks Makefile-injected build fields. Shell requires the actual shared-path gateway host; decisions use node-backed presentation fixtures. Neither requires the separate backend decision lease merely to execute these UI-112 contributions.

The primary checkout has a binary, but its source snapshot differs from the isolated checkout in 45 files. Read-only snapshot results were isolated `a0a6718f5b47ca947aa578f53cc0ef7831d6ec97bce9378deb9d2b4888c490de` and primary `dbe2cb1b51bd926298d9a9a8c9d190124a7e38511337ffbecc1952d2a137cd4c`. Copying that binary into the expected pathname would not establish compatible source/build provenance. This issue does not authorize that substitution or a backend build.

- [Kubo #10](https://github.com/GQAdonis/kubo/issues/10) remains the owner-delivery/source-binding anchor for compatible backend artifacts and live follow-through.
- [WebUI #9](https://github.com/GQAdonis/ipfs-webui/issues/9) retains separate strict backend lease-adapter adoption. It is not silently incorporated into this closure.
- [Desktop #6](https://github.com/tribe-health/ipfs-desktop/issues/6) retains the protected Desktop delivery boundary. Native presence, live effects, model interruption and physical AT remain unverified by these fixtures.

## Local source handoff and Git feasibility

The source bundle contains exactly 18 files totaling 178,307 bytes: seven original WebUI scope files, four measured WebUI files, five Kubo components and two Kubo regression files. Its manifest lists every path, hash, byte count, checkout-head tracking status and freeze provenance. Every copied file matched its selected frozen final hash. It includes no backend binary, credentials, dependencies, build output or Desktop source.

Read-only Git inspection found WebUI HEAD `ac12af52cf461890d6bc2d4593b1ff4a77c029b9` and Kubo HEAD `a3bd2fbbe3114e217730b514ef82732a369510ea`. WebUI boundary files and runner are untracked; the checked local remote-tracking baseline has no boundary tree. Kubo RunInspector and its regression file are untracked, while the other measured files are modified. No remote fetch was performed; this is local Git-state evidence, not proof of every current remote branch.

This bundle is a durable local, hash-bound handoff of full file snapshots, not a standalone patch or published delivery. Its files contain surrounding migration context. They require the matching existing migration, boundary runner/process/evidence/export helpers, family fixtures, production shell/chat views, shared contracts, manifests/locks and generated artifacts. Committing only these files against the old HEAD would not deliver a runnable correction; sweeping in prerequisites would exceed the approved narrow closure.

The authorized course is to preserve this local handoff, accurately link its manifest/evidence in the scoped closure, and make no PR/merge claim. Future code delivery should land separately owned migration prerequisites in reviewable commits, freeze that baseline, then port the bounded correction and run the normal export/assembly plus WU/SU checks. No commit, push, PR, archive, backend adoption or deployment was performed here. A local package path is not a remote download link.
