# Implementation prompt: Promethity node + agent redesign (IPFS Web UI fork)

Paste everything below the line into Claude Code at the root of this repository, on branch `feat/ipfs-mcp-server` or a branch cut from it. It is written for an agent team. Use the team in `.claude/agents/` where it exists, and Claude Code subagents where it doesn't.

---

You are the lead of an agent team implementing an approved UI/UX redesign in **this repository**. The design is finished and lives in `docs/design/`. Your job is to turn it into working code that keeps every existing IPFS function, and to verify that it works.

## 1. Sources of truth (read before planning)

1. `docs/design/DESIGN-PROPOSAL.md`: rationale, the Praxis conformance table, the navigation, the assistant pane, decision model v2, Home, Desktop, MCP hosts, visual roles, the per-repo map, deviations, the full views (§13) and the phone layout (§14).
2. `docs/design/prototype/index.html`, the clickable reference. Open it directly in a browser; it needs no build. Each view is a hash route: `#/home`, `#/files`, `#/pins`, `#/explore`, `#/peers`, `#/activity`, `#/settings/agent`, `#/setup`, `#/thread`, `#/surfaces` (design board). The published copy is at https://ipfs.prometheusags.ai/ipns/k51qzi5uqu5dkruhr6deso7sb43vt9vprqe8hkzcb5jdg3g1o45688c4a2brl6/
3. `docs/design/openspec/<change>/`: the OpenSpec changes for this repo. Each one has `proposal.md` and `tasks.md`; Kubo-owned changes also have `design.md` and spec deltas. **The `tasks.md` checklists are your work breakdown.** The canonical copies live in the Kubo repo at `openspec/changes/praxis-*`. If they differ, Kubo wins; tell the lead.
4. `docs/design/kbd-phase/`: the assessment, analysis (decisions D1–D13), plan, decision log (PX-00 to PX-16) and reflection behind the design.
5. This repo's `AGENTS.md` / `CLAUDE.md` and the brand system at `/Users/gqadonis/Projects/promethity/branding/promethity-brand-system.md`.
6. The standard: KnowMe Praxis agentic workspace container spec, edition 1.2, https://ipfs.prometheusags.ai/ipfs/bafybeianggntnigojmuqpsn2bskslb3mob5lkbaagd3wcgtfjokgv2dazi/specification.html

The prototype is a **visual and behavioural reference**, not code to copy. Rebuild it in this repo's stack and conventions.

## 2. Changes in scope for this repo

| OpenSpec change | Where | Round |
|---|---|---|
| `praxis-visual-roles` | ipfs-webui `src/promethity/` + kubo `mcp/ui` tokens | R1 |
| `praxis-shell-modes` | ipfs-webui `src/App.js`, `src/navigation/`, new `src/shell/` | R2 |
| `praxis-decision-inbox` | ipfs-webui `src/activity/`; kubo decisions endpoint + `mcp/ui` DecisionInbox | R3 |
| `praxis-context-inspector` | kubo `mcp/chat` island; webui context bridge | R3 |
| `praxis-origin-and-cid-honesty` | ipfs-webui `src/agent-chat/`, `src/files/`, `src/pins/` | R3 |
| `praxis-mcp-app-a2ui-seam` | kubo `mcp/app`, `mcp/ui`; webui mount | R2 |
| `praxis-decision-model-v2` | kubo `mcp/ui`, `mcp/app`, `mcp/contract` (+ Go confirm path) | R1 |

This repo owns:
- praxis-visual-roles
- praxis-shell-modes
- praxis-decision-inbox (client half)
- praxis-context-inspector (webui bridge)
- praxis-origin-and-cid-honesty
- praxis-mcp-app-a2ui-seam (webui mount)

Rounds run in order, R1 → R4. Changes within a round can run in parallel. Don't start a change until the changes it depends on have merged; the dependencies are listed in each `proposal.md`.

## 3. Team

| Role | Agent | Owns |
|---|---|---|
| Lead | `ipfs-agent-architect` (from the kubo repo team) | Scope, merge order, cross-repo contract questions |
| Shell + views | `ui-ux-engineer` | Navigator, assistant pane modes, Home composer, Files/Pins/Explore/Peers/Activity views, phone layout |
| Agent surfaces | `ui-ux-engineer` (second instance) | Decision inbox, context strip + inspector wiring, origin guard, WebMCP modal on decision card v2 |
| Accessibility | `a11y-architect` | Keyboard paths, focus return, 44px targets, reduced motion, contrast in both themes |
| Security | `security-reviewer` | Origin guard (WEB-06), no tokens to agents, untrusted-content framing |
| Phase gate | `reviewer` | Visual parity with the prototype and regression of every existing IPFS function |

Spawn teammates in parallel for independent changes in the same round. Give each one:
- the change folder
- the exact files it may touch
- the prototype routes to match
- the checks it must pass

You integrate, resolve conflicts and keep `tasks.md` checkboxes current.

## 4. Non-negotiable rules

- **One decision model everywhere.** Decision card v2 has ten states, and the badge words are verbatim:
  - Awaiting a person
  - Waiting for system prompt
  - Approved, not yet run
  - Done
  - Denied
  - Expired
  - Changed since you saw it
  - Answered on another screen
  - Outcome unknown, checking
  - Can't resume
- **Card rules:**
  - Deny takes focus first, and Approve unlocks after 1 s.
  - The card always shows who asked, where, what, network egress and the effect digest.
  - "Approved" never means "done".
  - A timeout is uncertain, not failed.
  - An agent can't approve its own request, and A2A peers can never approve.
- **Writes and deletes always ask first.** Nothing an agent proposes changes the node until a person approves it.
- **Network content is data.** Show it inside the "Content from the network" frame, and never let it act as instructions.
- **Honest copy.**
  - Unpinning: "Unpinning stops this node from keeping a copy. Other nodes that have it can still serve it."
  - A CID is not access control.
  - Peer builds are "reported", never "verified".
- **Visual system (PX-02):** Praxis structure and token roles, Promethity values.
  - Fonts: Syne, Hanken Grotesk, JetBrains Mono, bundled locally.
  - Ember appears once per view.
  - The AI/streaming role uses `info`.
  - No borders, no layout shadows, no gradients, no emoji.
  - Lucide icons at 1.5 stroke.
  - Every state is written as a word on its tint.
  - If the operator flips PX-02 to full KnowMe Flat 2.0, only `praxis-visual-roles` changes.
- **Accessibility:** WCAG 2.2 AA in both themes, every flow works by keyboard, 44px touch targets, reduced motion respected.
- **Phones:** ≤540px works with no sideways scroll; the details are in §14 of the proposal.
- **Scope:** do only what the OpenSpec tasks say. Record any deviation in the change's `design.md` and tell the lead. Don't silently drop a task.
- **Git:** commit per task with conventional commit messages. Never push, merge or rewrite history without the operator's say-so.

## 5. Repo-specific notes

- The stack stays React 16 / CRA / Tachyons with the Promethity override layer. Don't migrate frameworks as part of this work.
- Every existing route and action must survive: Files (import, share, copy CID, inspect, pin, download, CAR, rename, remove, IPNS publish, retrieval check), Pins (local + remote services), Explore, Peers, Diagnostics, Settings, Welcome.
- The chat island (`<ipfs-agent-chat>`) moves from the floating launcher into the docked pane host. Keep the shadow root, and remove `--ac-launcher-clearance`.
- Explore agent profiles depend on a Kubo setting that doesn't exist yet. Build the UI behind a feature flag until the Kubo change lands.
- The phone layout (≤540px) is part of the scope: bottom bar with More, tables become stacked cards, drawers and menus become bottom sheets.

## 6. Checks before a task is marked done

- `npm ci`, `npm run build`, `npm run test:unit`, `npx jest <path>` for single files
- Lint and the Promethity sweep rules in `docs/PROMETHITY-SWEEP.md` (no hex, borders, shadows or emoji)
- Playwright screenshots at 375, 768, 1024 and 1440, dark and light, compared against the prototype views

- Compare the screen against the matching prototype route at 375px and 1440px, in dark and light. Note any intentional differences.
- Exercise the feature as a user would: click through the flow, approve and deny a decision, and use it on a phone-sized viewport. Passing unit tests alone is not done.

## 7. Report back

At the end of each round, write `docs/design/IMPLEMENTATION-LOG.md` (append, don't rewrite) with:
- tasks completed, with commit hashes
- the checks run and their real output
- deviations and why
- anything blocked, and what it waits on

Tick the boxes in the change's `tasks.md`. Say plainly what was not verified.

Start by reading the sources in §1. Then post a short plan for Round 1, listing teammates, files and checks, and begin.
