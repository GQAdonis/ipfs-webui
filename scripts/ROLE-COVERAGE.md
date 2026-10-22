# Praxis surface role coverage

V1.5 authoring only. Do not run this lint or its fixtures until the final phase
boundary. `src/shell/` and `src/activity/` are still future production surfaces;
their absence is a required failure, never a clean-tree pass.

At the final boundary:

```sh
COREPACK_ENABLE_AUTO_PIN=0 npm run lint:roles
```

The UI-102 `role-parity` registration invokes the exact Node command directly
with `--json <owned-evidence-path>`. It requires both directories, production
renderers, actual role-bearing styling connected through relative imports,
nonempty inventories and zero diagnostics. Every scanned source and canonical
token/role definition is matched against the current local artifact input hash.
The runner also executes `scripts/role-coverage.test.js` with the existing role
fixtures, retaining exact process receipts and hashed reports. The final lane
aggregator revalidates scanner/fixture bytes through its closed source binding.

## Rule and supported syntax

- CSS declarations, nested CSS/media rules, static JS/JSX/TS/TSX styles, SVG JSX
  fill/stroke/style attributes, arbitrary style classes, supported tagged CSS
  templates and DOM `style`/custom-property calls are inspected. CSS parses with
  the adopted Vite compiler's already locked PostCSS dependency. JS/TS parses
  with the existing direct Babel core dependency; no dependency/lock change.
- Hex color literals and raw Promethity custom-property references or
  declarations are forbidden in production styling. Raw names are derived from
  `src/promethity/tokens.css`, including typography/spacing tokens. Inherit those
  properties or reuse existing primitives/classes. The only role names accepted
  are the fourteen declarations in `src/promethity/roles.css`.
- JS Unicode/string escapes, scope-correct constant bindings, static `+`
  concatenation and template substitution are resolved. CSS identifier/color
  escapes are decoded. Unresolved constructed `var()` names block coverage.
- Comments, ordinary route/CID data, CSS selector IDs and URL fragments are not
  interpreted as color values. Tests/specs/stories/declaration files and named
  test-fixture directories do not count as production or pollute this lint.
- Syntax errors, source symlinks and unsupported surface stylesheet languages
  fail closed. New supported syntax needs a parser/fixture amendment rather than
  a silent exclusion. Missing/empty directories, comments-only/test-only sources,
  unused role strings and unimported styling cannot produce a coverage pass.

This static rule implements the exact hex/raw-token restriction, not a complete
CSS security policy or a certification of runtime-computed styles. Actual theme,
contrast and composed component-state evidence remains required by UI-102/112.
It does not add a ban on other CSS syntax or change any incumbent styling.

The `--root <exclusive-fixture-directory>` option is for source-controlled
negative fixtures only; the final positive command always scans the actual
WebUI checkout. Fixtures cover a clean pair of real surfaces, a planted production
hex color, raw font/spacing/color tokens, escaped/split/template bypasses,
incorrect roles, parser failures and absent/empty/unconnected surfaces.
