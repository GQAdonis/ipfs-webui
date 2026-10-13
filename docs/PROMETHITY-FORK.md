# Promethity fork delta

This file maps the structural divergence between this fork (`GQAdonis/ipfs-webui`, product name Promethity) and upstream `ipfs/ipfs-webui`. It exists so that future `git merge upstream/main` runs have every expected conflict already mapped: when upstream touches one of the files listed below, the conflict is expected and this table is the merge guide; a conflict anywhere else is a signal to stop and re-check.

Source: `assessment-ui.md` section 5.8 (phase `agent-backend-settings`), which fixes the strategy. The rebrand is an override layer, not a rewrite:

- New `src/promethity/` folder (`tokens.css`, `fonts.css`, `base.css`, `theme-overrides.css`, `brand.js` constants, logo components) imported last in `src/index.js`. `theme-overrides.css` remaps the ipfs-css/Tachyons colour classes (`.bg-navy`, `.aqua`, `.teal`, `.bg-snow`, `.charcoal`, `.b--*`, and friends) onto Promethity tokens, so the ~163 files using Tachyons classes recolour with zero edits. Override-layer files do not conflict with upstream at all.
- The brand name lives in one constant (`src/promethity/brand.js`) and one Helmet helper, so titles compose as `${t('title')} | ${brand.name}` instead of editing the Transifex-managed locale files.
- Only the ~12 files below are structurally edited. Everything else is upstream code under an override layer.

Non-goals (recorded so a merger does not "fix" them): no React 19 / Vite / Tailwind migration of this shell, no rewrite of Tachyons markup across the 163 files, and no edits inside `ipld-explorer-components` (the `/explore` route is themed at the wrapper level only; its internal markup stays upstream and is a known visual seam).

## Structural files

| File | Why it diverges | Upstream-merge note |
|---|---|---|
| `src/App.js` | Shell redesign: `surface` rail + `ground` top bar replace the navy rail and washed-blue top bar; inline hex styles (lines ~70/74) and the `main` class change. | Small file; reapply the shell wrapper on top of upstream's route/bundle wiring. |
| `src/navigation/NavBar.js` | Rail restyle: Promethity wordmark (p icon when collapsed under 860px), Lucide icons, active item is `accent-text` + 600 with a fill step, no accent bars. | Upstream adds nav items here often; take upstream's item list, keep the fork's presentation. |
| `src/navigation/NavBar.css` | Styles for the rail restyle. | Fork-owned presentation; prefer the fork side, re-check upstream additions. |
| `src/components/box/Box.js` | `Box` white sheets become `surface` panels on tokens; fills, no borders, no shadows. | Presentation-only change; take the fork side. |
| `src/settings/Title.js` | `ttu tracked` teal section titles (line 5) replaced by the type scale (Syne titles, Hanken UI text per DESIGN.md). | One-line class change; reapply after merge. |
| `src/components/button/button.tsx` | Button variants restyled on tokens (44px primary targets, fills, no borders/shadows). | Watch for upstream prop/API changes; restyle, don't restructure. |
| `src/components/button/button.css` | Button styles on tokens. | Fork-owned presentation; prefer the fork side. |
| `src/settings/SettingsPage.js` | The agent-chat and WebMCP boxes are removed and replaced by a summary row linking to `#/settings/agent`. | Upstream adds settings boxes here; merge their boxes, keep the fork's agent summary row. |
| `src/status/CountryChart.js` | Chart.js series colours come from `src/promethity/tokens.js` (CSS variables resolved at render and on theme change); no raw hex. | Presentation only; keep token lookups, take upstream data logic. |
| `src/status/NetworkTraffic.js` | Same chart reskin as `CountryChart.js`. | Same note. |
| `src/status/NodeBandwidthChart.js` | Same chart reskin; gradients (line ~121) become flat fills from tokens. | Same note. |
| `public/index.html` | Two `theme-color` metas, title, description and generator for Promethity; font preloads for the bundled woff2 set. | Reapply meta/title changes onto upstream's HTML shell changes. |
| `public/manifest.json` | Promethity name, icon set (192, 512, maskable) and theme colours. | Fork-owned; prefer the fork side unless upstream adds required manifest keys. |

## Everything else

- `src/promethity/**`, `public/fonts/**`, the agent-chat island assets under `public/agent-chat/**`, and `src/agent-chat/**` are fork-only files; upstream never touches them.
- `public/locales/en/**` carries `en`-only copy edits; other locales are Transifex-managed and stay upstream.
- If an upstream merge conflicts in a file not listed above, treat it as unplanned divergence: check whether the override layer should have absorbed the change before resolving by hand.
