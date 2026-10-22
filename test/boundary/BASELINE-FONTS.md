# UI-102 immutable screens and local fonts

Current Q/1 preserves and rebinds the `immutable-token-baseline` and `local-fonts` registrations. No
historical install/build, render, capture, font loading or QA ran during authoring.
They execute only through the lead's final `test:agentic-boundary` packet.

## Incumbent comparison

`assembleBaselineSources` reads the recorded pre-production commit/file hashes
from the hash-pinned `test/boundary/incumbent-source-authority.json`, retained byte-for-byte from the original source-baselines authority, creates exclusive scratch archives and validates
the extracted source. Its two variants share the same immutable incumbent shell.
The token-only variant differs in exactly two places: the new alias stylesheet
and a literal import prefix. An App rewrite, palette change or other source delta
fails the fixture. The current redesigned shell is never one of the compared
images and no historical React or generated baseline is shipped.

Final-only dependency derivation uses the original lock and `npm ci
--include=dev --ignore-scripts --strict-peer-deps --no-audit --no-fund`. User/global
npm configs and caches are isolated; operator credentials are not loaded.
Only the original named patch-package action and original CRA compiler then run,
using the actual boundary Node executable and immutable Git revision. The
incumbent `.npmrc`/`.env` bytes stay intact, including their historical Node
options. Every archived input is hash-checked again after derivation. A peer,
engine, missing lifecycle prerequisite or compiler failure blocks the slot with
its exact command/error; there is no lock repair, force or legacy-peer fallback.

Both compiled variants are imported as explicit fixtures into the same isolated
make-built node and served by its real non-default-port gateway. Each shows the
same Files/Pins/Explore/Settings screen at 375 and 1440 pixels, dark and light,
English locale, fixed Date and live timers, identical seeded MFS data and the
same node identity. Chat/WebMCP are explicitly off in both comparison profiles.
Screen-specific readiness, bundled-font readiness and consecutive stable viewport
captures precede comparison. Real RPC responses are never mocked.

Browser PNG decoding yields actual RGBA data; comparison requires identical
dimensions and zero changed pixels, with no masks or tolerance. All original,
settling, token-only and negative PNGs plus pixel/source/build/process hashes are
retained. A deliberate fixture-only ground/surface palette override must cause
an observed screenshot mismatch at each theme/width. Unstable content blocks
comparison instead of being hidden by broad masks.

## Font proof

WebUI face descriptors come from its real CSS. Shared descriptors come from the
real bundled-font module. WOFF2 signatures and SHA-256 are compared with the
immutable incumbent font bytes and the current export inputs/artifacts.
The actual shared font-registration source is compiled to an exclusive test-only
ES-module fixture using the installed shared Vite graph, with source/lock hashes
before/after. This font-only dependency fixture is separate from production UI
bundles and does not claim a full shared UI render or create another React root.

In the real browser, every declared family/weight/style must produce an actual
loaded FontFace, not merely a truthy fallback `document.fonts.check`. WebUI font
requests must stay under the actual gateway artifact path and each response's
WOFF2 bytes must match its immutable source. The compiled shared registration
loads embedded bytes and must register every expected face. The browser renders
family-labelled samples and records local font requests/responses and screenshots.
An actual external-font negative attempt is detected even though the existing
egress guard aborts it; no remote font response may occur. Public evidence omits
credentials and query values.

Focused authored fixtures cover exact source deltas, one-pixel/dimension palette
negatives, empty/remote font declarations, missing/shared import mappings, remote
or wrong-CID request evidence, and stale baseline authority. All four UI-102 slots
require a current source-binding artifact at final aggregation, including the
current immutable-authority file and every referenced assertion/helper byte.

## Source identity clarification

The retained clean WebUI Git commit ac12af52cf461890d6bc2d4593b1ff4a77c029b9 and its 885 recorded inputs are the incumbent reconstruction authority. The original shared capture was dirty elsewhere, but all eight recorded style inputs are available as exact matching Git bytes at 4bd08d5023ad1d9e73b948f6aa22eb99b82ef279; reconstruction still compares every required hash. The separate 1,004-input pre-F/2 import archive already contains prior migration/token work. Its provenance is linked by baseline-authority.json, but it is neither untouched incumbent nor token-only parity proof. No current-shell screenshot substitutes for either historical variant. The optional shared role helper authorityRoot/path injection requires the exact retained content hash and confines the file to its trusted source root.
