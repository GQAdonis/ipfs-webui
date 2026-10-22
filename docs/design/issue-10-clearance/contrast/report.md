# Issue 10 retained contrast evidence assessment

This is an additive offline assessment of the 16 retained axe reports named in `confirmation-summary.json`. It classifies every one of the **384 incomplete color-contrast node occurrences** and measures the relevant declared production token pairs. It does **not** turn any incomplete result into a pass, change an acceptance predicate, or certify WCAG conformance. No new axe invocation, browser launch, acceptance run, source edit, export or assembly was performed.

## What the retained evidence establishes

| Classification | Occurrences | Evidence and interpretation |
| --- | ---: | --- |
| Sidebar edge pseudo-element | 268 | 120 A2UI and 148 context occurrences use `pseudoContent`. Every related node names `.ac-sidebar`. The unchanged production `island.css` defines its `::before` as an opaque `raised` strip, 8px wide, at the leading edge; the sidebar reserves the same 8px with padding. This is a narrow decorative edge, not a texture covering the text. |
| Virtual event overscan clipping | 108 | Four context states each contain 27 incompletes: label, tool and timestamp for events 2–10. Each names `.iu-ground` as the obscuring node. `RunInspector.tsx` renders 168px absolute-positioned rows inside a 336px scrolling region, with an initial retained window of 11 rows. The retained screenshots show events 0 and 1; events 2–10 are outside the initial visible region. This is consistent with the intended overscan, not evidence of low-contrast visible text. |
| Fixture-only heading obscuration | 8 | All eight inbox/activity reports name exactly `<h1>Current frontend host fixture</h1>`, with `body` as the related node. The heading is authored in `test/boundary/host-fixtures/entry.jsx`; it is not a production Decisions or Activity component. The inspected light inbox and dark activity screenshots show readable heading text on the ordinary ground fill. The actual cause of axe's obscuration classification cannot be established from the retained report alone. |
| **Total** | **384** | No unclassified occurrences; no original records changed. |

The original reports each retain zero violations and an incomplete contrast rule. These are different outcomes: zero detected violations does not establish that the incomplete checks passed.

## Source-based contrast calculation

`analyze.py` reads the actual hex values from `mcp/ui/src/styles/tokens.css` and computes sRGB relative luminance and `(lighter + 0.05) / (darker + 0.05)`. It does not take the rounded DESIGN.md contrast table as evidence. Each occurrence receives a candidate pair set, preserving its original HTML, selector, report hash, node index and axe check data in `assessment.json`.

| Declared pair or conservative candidate set | Dark minimum | Light minimum |
| --- | ---: | ---: |
| `text` or `text-muted` against all four neutral fills | 4.9085:1 | 5.1656:1 |
| Primary `on-accent` against `accent` | 6.1196:1 | 5.1777:1 |
| `ok` against `ok-tint` | 6.2357:1 | 5.4062:1 |
| `info` against `info-tint` | 6.2426:1 | 5.6946:1 |
| Link/active-tab `accent-text` against surface or raised | 5.0023:1 | 5.3611:1 |
| Fixture heading `text` against ground | 17.6217:1 | 16.7457:1 |
| Event text or muted text against ground | 6.9190:1 | 6.3681:1 |

All of these declared candidate pairs exceed the 4.5:1 normal-text floor; the fixture heading's recorded threshold is 3:1. This rules out a low-contrast **declared pair** within the examined candidates. It is not a per-node runtime measurement. In particular, the ordinary neutral candidate set deliberately bounds both possible text tiers and all four fills rather than pretending the report retains an exact inherited color for every node. Status badges, primary buttons and link/tab labels are treated separately. No inactive-control exception was needed to obtain these candidate results.

The script also inventories exact palette RGB pixel counts in all 16 original PNGs. This corroborates that the palette appears in the captured rendering, but image-wide presence cannot assign a background to an individual node. It is therefore not used as an automatic manual-pass mechanism.

## Visual inspection and bindings

Six original **axe-slot** PNGs were opened with the image inspection tool, covering each family in light and dark and both recorded widths:

- `a2ui-a2ui-axe-light-375.png`
- `a2ui-a2ui-axe-dark-1440.png`
- `context-context-axe-light-375.png`
- `context-context-axe-dark-1440.png`
- `inbox-inbox-axe-inbox-light-375.png`
- `inbox-inbox-axe-activity-dark-1440.png`

The A2UI and context captures visibly place text outside the leading strip. The context captures show only the first two event rows inside the event scrollport. The fixture heading is visibly present in both inspected inbox/activity images. These observations support the classifications above; they do not recover the absent computed-style or intersection data. The other ten PNGs were hashed and their exact palette pixels inventoried, but are **not** claimed as visually inspected.

`assessment.json` binds all 16 JSON reports to the SHA-256 values in the original summary, and records all 16 corresponding PNG hashes and dimensions. It also records the source hashes, retained producer/runtime/family binding-file hashes and current hashes for produced inputs referenced by those bindings. At analysis time, all compared produced-input hashes matched the retained bindings. The source list explicitly includes the fixture geometry override, the producer, production sidebar styles, token/component/chat styles, composer, sidebar composition, and inspector. The distinction matters: the supplemental fixture overrides sidebar geometry to `position: relative`, full width and full height. Its evidence does not certify deployed WebUI sidebar placement.

Reproduce this offline analysis from the Kubo worktree root with:

```sh
python3 evidence/agentic-ui-frontend/issue10-clearance/contrast/analyze.py
```

This reads retained files and rewrites only `assessment.json` beside the script. Pillow is already available in the environment; the script installs nothing.

## Disposition and remaining limits

**384 original incompletes remain disclosed; zero manual clearances are claimed.** Their causes are now classified, and the examined production palette candidates meet the contrast floor without palette changes. The 108 clipped event occurrences are not 108 demonstrated color defects. Similarly, the eight host-fixture headings are not production inbox failures.

A scoped issue-fix closure can accurately retain these incompletes and cite this assessment as explanatory evidence if its acceptance target is the regression correction. A claim that *all contrast has been verified* cannot rely on this assessment. That would require authorized runtime evidence for the actual node foreground, composited background, opacity/filter ancestry and geometry; the event scrollport would need to expose the relevant rows. The fixture-only heading's obscuration reason would need a retained geometry/hit-test observation. No new audit is prescribed as necessary to close the bounded source regression, and no acceptance criterion is weakened here.

This assessment does not cover physical assistive technology, deployed node-backed decisions/shell, host-neutral overrides, additional component states, full WCAG 2.2 AA compliance or phase certification. It follows the existing PRODUCT.md/DESIGN.md authority and the Prometheus UI protocol, with the loaded `prometheus-ui-ux`, `better-accessibility` and `better-colors` guidance; it introduces no design direction.
