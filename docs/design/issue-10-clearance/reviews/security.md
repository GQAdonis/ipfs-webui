# Independent security review: WebUI issue #10 scoped clearance

2026-10-21. **Scoped disposition: PASS. Whole UI-112 and full-phase certification: BLOCKED.** No actionable security vulnerability was identified in this bounded source/evidence handoff. This approves the accuracy of the reviewed scoped closure, not backend authorization, a release, live consent or full accessibility conformance.

## Independence and boundary

Separate native `security_reviewer` context, after the scoped implementation froze. `K`, `W` and `D` denote `kubo`, `ipfs-webui` and `ipfs-desktop` under `/Users/gqadonis/.codex/worktrees/agentic-ui-frontend/`. Inspected actual registration/composition, source guards, presentation controls, previous independent report, additive architecture/verification/contrast evidence, exact source bundle and closure/follow-up drafts. Read AGENTS.md, current waypoint, gotchas, role instructions, UI protocol, PRODUCT.md, DESIGN.md and TypeScript rules. Applied `mcp-implementation-security-review`, `agent-runtime-security`, `prometheus-ui-review` and `better-accessibility`; the generic `security-review` skill was not found in searched installed roots, and no use of it is claimed. No taste or user-only review skill was loaded.

No tests, builds, browser/axe sessions, services, credentials, backend edits/adoption, GitHub writes, production edits or canonical-state mutations were performed. Independently read and hashed files; this report is the sole reviewer write. The current 29/29 result is the root's retained invocation, not a new reviewer invocation. Retained screenshots were hash-checked here; visual observations in the contrast author's report remain attributed to that author.

## Threat model and source findings

The relevant threats are stronger failures being hidden by early prerequisites, substituted/stale source or screenshots acquiring acceptance authority, fixtures acquiring consent authority, credential-bearing diagnostics, and an offline explanation being presented as live assurance. Contributors are trusted checked-in/source-owned executable modules, not an isolation boundary for hostile plugins. Hashes bind evidence to bytes but do not sandbox a process capable of rewriting the checkout.

| Check | Disposition and file/line evidence |
| --- | --- |
| Family isolation and failure precedence | PASS. `W/test/boundary/registrations/accessibility.mjs:12` verifies metadata before dispatch; lines 14–30 independently attempt five fixed families, retain outcomes and throw the strongest error. `W/test/boundary/accessibility/contributions.mjs:37` and lines 40–48 preserve FAIL over BLOCKED over NOT_EXERCISED; lines 64–69 and 94–99 retain source-validation failures alongside the initiating failure. |
| Export and path integrity | PASS within the trusted-source boundary. `W/scripts/agentic-boundary.mjs:45` wires the complete `assertLocalWebuiExport` validator; `W/test/boundary/artifact-access.mjs:5` separates verified metadata from node publication. `W/test/boundary/accessibility/contributions.mjs:15` rejects invalid/traversing paths, final symlinks and realpath escapes; lines 27–35 reject duplicate and changed inputs. No weaker validator was introduced. |
| Actual contribution evidence | PASS. `W/test/boundary/accessibility/contributions.mjs:81` hashes artifacts; lines 89–101 require source checks before/after callbacks, assertions and PNG evidence for successful bindings, while preserving unsuccessful evidence separately. `W/test/boundary/accessibility/registration.test.js:11` labels its tiny PNG/callbacks orchestration-only. These requirements do not establish physical AT or human presence. |
| Approval authority | PASS for the bounded delta. `K/mcp/ui/src/chat/ApprovalCard.tsx:63` still forwards the existing model and callbacks into ApprovalPanel; lines 77–78 change presentation grouping/hierarchy. No new resolver is introduced. `W/test/boundary/accessibility/contributions/inbox.mjs:16` explicitly labels synthetic expiry as presentation-only; lines 40 and 48 retain unauthenticated fixture boundaries and absence of Approve authority. |
| Shell width claim | PASS as source authoring only. `W/test/boundary/chat-runtime/shell-accessibility.mjs:8` authors both themes and all eight widths, including 539/540; lines 16–35 retain phone navigation, focus, overflow, axe, reduced-motion and screenshot checks. `K/evidence/agentic-ui-frontend/issue10-clearance/closure.md:13` correctly declines observed real-shell proof. |
| Diagnostic privacy and agency | No new exposure observed. `W/test/boundary/accessibility/contributions/inbox.mjs:67` preserves raw axe reports and screenshots before assertions for source-owned, unauthenticated presentation fixtures. `K/evidence/agentic-ui-frontend/issue10-clearance/verify.mjs:31` supplies an explicit credential-free command environment. Raw axe/error HTML is not a general secret-redaction mechanism for future authenticated captures. This scoped handoff adds no reporting endpoint, background retrieval, pin/provide cause or configurable-service default. |
| Contrast and closure honesty | PASS. `K/evidence/agentic-ui-frontend/issue10-clearance/contrast/assessment.json:17` records zero manual clearances and 384 retained incompletes. `contrast/analyze.py:105` preserves the occurrence count and lines 106–114 separate candidate ratios from runtime measurements. `closure.md:15` preserves 12 PASS/eight BLOCKED; lines 23–27 retain contrast, live-host, physical-AT and full-certification limits. `followup-draft.md:14` retains source-compatible artifact prerequisites and forbids weaker freshness/fallback hosting. |
| Local delivery provenance | PASS with explicit limitation. `K/evidence/agentic-ui-frontend/issue10-clearance/source-bundle/manifest.json:7` says `standalone: false` and line 8 disclaims publication. `source-bundle/README.md:5` describes untracked migration prerequisites; lines 7–9 prohibit treating these snapshots as a standalone application patch. User-selected local delivery must remain explicit in the remote closure. |

No severity-ranked code finding is opened. Residual evidence gaps below are required limitations, not newly demonstrated vulnerabilities.

## Independent bindings

Independently rehashed all **53 frozen entries**, all **18 current and copied bundle files**, all three focused-test receipt files, every original axe report and its PNG (**16 pairs**), and confirmed **384** original incomplete occurrences. The categories total 268 sidebar-edge pseudo-elements + 108 virtual-event overscan occurrences + eight fixture-only headings; none becomes a manual PASS.

For **each** retained outer packet, independently checked all **3,443** recorded source entries against current files, all **24** runtime hash facts, browser/Electron executable identities, equal source/runtime/output before-and-after snapshots, and original outer exit-2 logs. Independently rehashed **361 WU and 95 SU lane artifacts**; packets and lane manifests matched their retained hashes and empty cleanup. Actual WU family outcomes remain **12 PASS/eight BLOCKED**. WU stays 21 PASS/46 BLOCKED; SU stays seven PASS/two BLOCKED/one NOT_EXERCISED. No historical browser run was repeated or relabelled.

| Reviewed evidence | SHA-256 |
| --- | --- |
| `issue10-clearance/verification.json` | `798be3b788b4c50aa5e8b77d7202154bfd11930ff5838ab84321d6dbb4bdb0a4` |
| `issue10-clearance/test-receipt.json` | `b8f56004a85c81e640af4a224b9ca4b1e2683cd9a4bd6f834c88c928a6e9b90d` |
| `issue10-clearance/retained-bindings.json` | `e4aa2201cf048c67317f491291944e23ad037fcad20813d9654444b65a46d64f` |
| `issue10-clearance/source-bundle/manifest.json` | `e2331fdf3e634f11d83ac743ecc2b2b2382a284986817ca077f76d23ae3242df` |
| `issue10-clearance/contrast/assessment.json` | `b3046e335844e31871638e7777fb54671c69b10fee0c425f2fa8f9ad045825f8` |
| Reviewed `issue10-clearance/closure.md` draft | `0101d3ca19c4a09e176a0bbeedb1a69529c249588d5f13d1844d7df182cb0b93` |
| Reviewed `issue10-clearance/followup-draft.md` | `bcc2b91f0f5abfe717f2b1af754b9eb3f4f44fa0d7c3ec82b3780dbaaccfe590` |

Evidence names above are relative to `K/evidence/agentic-ui-frontend/`. Later insertion of real issue/review links does not make the reviewed drafts historical proof of those remote actions.

## Unavailable checks and remaining gates

Whole UI-112 remains **BLOCKED** pending compatible owner-delivered local artifacts and actual node-backed shell/decision executions, runtime contrast/geometry assessment, and applicable manual accessibility evidence. The dedicated follow-up must retain all 384 incompletes and eight blocked contributions; Kubo #10, WebUI #9 and tribe-health/ipfs-desktop #6 retain their separately owned obligations. No differently sourced primary binary may substitute for the isolated build.

MCP-01 through MCP-05 server identity/session/rate/schema/SDK controls are outside this presentation/evidence delta and **not re-certified**. RCE command injection, eval, deserialization, SSTI and SSRF are not introduced by these fixed-source contributor paths; path integrity is assessed above, and dependency safety is not re-audited by a source bundle. The OWASP token/scope/tool-poisoning/supply-chain/prompt-injection/authentication/context risks remain subject to their existing backend reviews. No tracking or centralized audit collection is recommended in conflict with AGENTS.md.

In particular this review grants no new assurance for stdio/Streamable HTTP/AG-UI/A2A authorization, principal scopes or `egress_ack`, same-user self-confirmation, shell tools, LLM/embedding SSRF or resource budgets, retrieved-content prompt injection, origin/DNS rebinding, MCP App sandbox/CSP, A2UI catalog admission, Electron webSecurity/safeStorage, or plugin binary launching. Their frozen source identities do not replace their own security acceptance. **Scoped PASS; whole UI-112 BLOCKED.**
