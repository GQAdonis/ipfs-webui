# Promethity straggler sweep (webui-route-polish 1.1 and 1.4)

Round 5, 2026-10-14; re-run in the Round 5 correction cycle with the widened glyph pattern and the emoji scan (output in kubo `mcp/server/evidence/2026-10-14-round5-ui-fixes/sweep-output.txt`). The sweep looks for what the redesign must not leave in app code: a hex colour literal, a `b--*` border-colour class, a shadow class or property, a row rule (`bt`, `bb`, `bl` on a list row), an import of an upstream `Glyph*`/`Stroke*` icon (by any path, relative or absolute), and an emoji or dingbat used as an icon. It covers every `src/**` file except the paths listed under "Excluded". Re-run the commands below after an upstream merge; anything new that is not on the allowlist is a straggler.

## Commands

```sh
G='src/icons/|\.test\.|\.stories\.|webmcp/vendor|settings/agent|agent-chat|tokens\.css|fonts\.css|languages.json'

# hex literals
grep -rnE "#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b" src --include=*.js --include=*.tsx --include=*.ts --include=*.css --include=*.jsx | grep -vE "$G"

# b-- classes (theme-overrides.css defines the remap and is not a use)
grep -rnE "\bb--[a-z]" src --include=*.js --include=*.tsx --include=*.ts --include=*.css --include=*.jsx | grep -vE "$G|theme-overrides"

# shadows
grep -rnE "\bshadow-[0-9]|box-shadow|drop-shadow|text-shadow" src --include=*.js --include=*.tsx --include=*.ts --include=*.css --include=*.jsx | grep -vE "$G"

# row rules in the route directories and shared components
grep -rnE "\b(bt|bb|bl)\b" src/files src/pins src/peers src/diagnostics src/components --include=*.js --include=*.tsx | grep -vE "$G" | grep -E "className|class="

# upstream glyph imports outside src/icons: by name, by path, and the relative barrel
# (`from '../../icons'` reaches src/icons/index without the word Glyph in the path)
grep -rnE "icons/(hocs/)?(Glyph|Stroke|stroke-icons)|from '(\.\./|\./)+icons(/[^']*)?'" src --include=*.js --include=*.tsx --include=*.ts --include=*.jsx | grep -vE "^src/icons/|promethity/icons|\.stories\."

# emoji and dingbats as icons, in code and in the English strings (country flags are drawn by
# react-country-flag and are not in the source as characters)
find src public/locales/en -type f \( -name '*.js' -o -name '*.tsx' -o -name '*.ts' -o -name '*.jsx' -o -name '*.css' -o -name '*.json' \) \
  | grep -vE "$G|src/icons/" \
  | xargs perl -CSD -ne 'print "$ARGV:$.: $_" if /[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{2B50}\x{2B06}\x{2B07}\x{FE0F}\x{200D}]/; close ARGV if eof' | cut -c1-200
```

Excluded from the glyph, emoji and colour greps: `src/icons/**` (upstream glyph source, no longer imported by the app), tests and stories, `src/webmcp/vendor/**` (generated), `src/settings/agent/**` and `src/agent-chat/**` (the agent settings page and chat island, swept with their own change), the token and font definitions.

## Result

- Hex: 7 hits, all on the allowlist (comments and one dead module).
- `b--` classes: 16 hits, all validity-state edges on the allowlist. At the start of this round the same grep found 53 neutral `b--*` classes (`b--black-20`, `b--light-gray`, `b--near-white`, `b--black-10`, `b--gray`): 37 in `src/files`, `src/pins`, `src/peers`, `src/diagnostics` and 16 in `src/components`. All of them are removed.
- Shadows: 19 hits, all on the allowlist (inset edges and resets). The three `shadow-*` class uses (`shadow-2` golog autocomplete, `shadow-3` Popover, `shadow-4` Modal) are removed; the one remaining `shadow-4` string is a negative assertion in `modal.test.tsx`.
- Row rules: no hit.
- Upstream glyph imports, by name, by path and through the relative barrel (`from '../../icons'`): no hit. The first Round 5 regex missed the barrel form; seven `src/diagnostics/dht-provide` files used it and now import `src/promethity/icons.js`.
- Emoji and dingbats as icons, in `src` and `public/locales/en`: one hit, a comment (allowlisted). Removed in this cycle: the handshake and globe on the Peers table, the thinking face for an unnamed protocol, the magnifier in two pinning strings, the envelope in the feedback link, the sad face in the file preview, the warning sign in the log warning modal and the unsupported-Kubo notice, the flag for an unknown peer location, and the `✕` clear button of the files search.

## Allowlist

| Location | Why it stays |
|---|---|
| `src/promethity/brand-p-icon.js:7`, `src/promethity/brand-wordmark.js:7-8`, `src/promethity/theme-overrides.css:392` | Hex values in comments that document the token values or the upstream inline colour the Explore seam overrides. Not code. |
| `src/bundles/config-save.js:80` | An emoji in an upstream code comment. Not rendered. |
| `src/lib/count-dirs.js:22` | A URL fragment (`#add`) in a comment. Not a colour. |
| `src/peers/WorldMap/Map.js:28-29` (`#AAA`, `#DDD`) | Dead module: nothing imports `Map.js` (`PeersPage.js` imports `WorldMap.js`, which uses the static dot-grid SVG as a mask over a `control` fill). D3 `attr('fill', ...)` takes a presentation attribute, where `var(--token)` is not reliable, so the literals are not tokenised; the module is left as upstream for merge simplicity. |
| `b--red-muted` and `b--green-muted` on `GatewayForm.js:41`, `TextInputModal.js:69,73,76`, `api-address-form.tsx:71`, `IpfsCheckForm.js:57`, `golog-level-autocomplete.tsx:391`, `AddByPathModal.js:55,58`, `AddByCarModal.js:51,53`, `files-explore-form.tsx:38,40`, `files-explore-form.css:33`, `AddConnection.js:79,82` | Input validity edges. DESIGN.md D7 keeps a 1px form-control edge, and `theme-overrides.css` maps `b--red*` to `--err` and `b--green*` to `--ok` and exempts them from the border-width reset, so an invalid or valid field is never signalled by fill alone (WCAG 1.4.11). The words come from the message beside the field (state is words first). |
| `box-shadow: inset 0 0 0 Npx var(--text-muted)` in `Checkbox.css:6`, `radio.css:6`, `theme-toggle.css:15`, `promethity/components/primitives.css:73,86,95,130,208` (and the `transition: box-shadow` at `:77`) | The D7 form-control edge, drawn as an inset ring (not a drop shadow) so it follows the control's radius; each has a forced-colors border fallback. |
| `box-shadow: none` in `theme-overrides.css:378`, `Popover.css:26,44`, `settings/editor/theme/ipfs_dark.js:42` | Resets that remove an upstream glow or shadow. |
| `src/settings/editor/theme/ipfs_dark.js:90` (`box-shadow: inset -1px 0 0 var(--control)`) | The code editor's indent guide, a code affordance inside the Ace editor, in a token colour. It is not a surface rule. |
| `src/index.js:36` (`text-shadow` in a `console.log` style string) | The "Stop!" warning printed to the developer console. It never renders in the app UI. |
| `ba` (without a `b--` class) on inputs and selects across the forms | The D7 edge: `theme-overrides.css` keeps the 1px width on `input`/`textarea`/`select` and sets the colour to `--text-muted`. |
| `/explore` route, `.prom-explore .ba/.bt/.bb/.bl/.br` | The accepted D9 seam: `ipld-explorer-components` keeps its own borders and inline colours (the package is not patched). The wrapper themes it only through the `--explore-*` token variables (`src/promethity/explore-tokens.js`). |

## Not a stragglers list

Tachyons colour helpers that the override layer remaps onto tokens (`bg-white`, `charcoal`, `bg-teal`, `fill-aqua`, `bg-near-white`, and the like) are not stragglers: they are the override-layer mechanism described in `PROMETHITY-FORK.md`, and a unit test (`src/promethity/tokens.test.js`) pins the resulting contrast.
