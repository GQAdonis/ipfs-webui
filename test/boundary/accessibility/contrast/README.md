# Retained incomplete contrast follow-up

`run.mjs` measures the 384 original incomplete contrast occurrences from the issue 10 confirmation summary against the current publication WebUI and its matching built sibling Kubo UI/chat packages. It does not run axe or change the original reports, production sources, fixture styles, contributors or acceptance predicates.

Run only after the root-owned strict local export has been refreshed and the browser execution boundary has been granted:

```sh
node test/boundary/accessibility/contrast/run.mjs --summary /absolute/path/to/confirmation-summary.json --out /absolute/path/to/kubo/evidence/agentic-ui-frontend/issue11-clearance/contrast/new-run
```

The destination must be a new directory. The existing `assertLocalWebuiExport` guard remains mandatory. Existing chat/host producers build only their own new scratch fixture outputs. Only the installed pinned Playwright browser is used; there is no runtime download, dev server, production node lease or remote collaborator. The static server binds a dedicated loopback port and browser requests outside that origin are rejected.

Each retained target is bound by its original CSS selector plus element tag, class set, selected attributes and text. Generated React IDs are rebound to the unique control/title/described hint. Generated Radix IDs are rebound by stable suffix inside the exact current-run inspector. Missing or ambiguous bindings are unknown, never a guessed match. The observer records before/after native scrolling; virtual event rows retain their `aria-posinset` identity. Only fully visible, unobscured text geometry can receive a computed result.

The observer records text-range geometry (or a conservative content box for textarea placeholders), shadow-aware point hits, ancestor clipping, real computed colors, opacity, filters, blends, backgrounds and pseudo-element geometry. It composes ordinary alpha backgrounds until an opaque fill is established and calculates unrounded WCAG sRGB contrast. Unsupported filters, group opacity, image backgrounds, masks, blend modes, pseudo overlap, mixed descendant foregrounds or unstable capture states remain unknown. It does not apply disabled-control exemptions. Every measured occurrence binds its screenshot and source report, and post-capture comparison rejects changed paint state.

All new reports are supplemental component-fixture evidence. A complete computed result is not full WCAG certification, deployed application/physical assistive technology coverage or automatic closure of a broader acceptance oracle. Independent visual review of retained captures remains required. Original fixture geometry overrides are preserved and identified by provenance.

The observer distinguishes computed overflow from overflow propagated to the viewport under [CSS Overflow 3 section 3.3](https://www.w3.org/TR/css-overflow-3/#overflow-propagation). It records the propagation source and root/body containment, and retains viewport clipping, ordinary container clipping and hit-test checks. This corrects the initial observer's false body-box clipping for the fixture heading; the first runtime report remains immutable.

The focused `node --test test/boundary/accessibility/contrast/inspect.test.mjs` tests cover color composition and negative cases that must not pass. One regression launches only the installed pinned browser against synthetic local markup: propagated body overflow, containment disabling that propagation, ordinary clipping and actual obscuring overlays.
