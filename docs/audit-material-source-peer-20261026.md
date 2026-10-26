# Glass material audit — source and runtime peer review

> Исторический срез до исправлений, commit655c3c7. Изменения по этому аудиту: [release-material-contract.md](release-material-contract.md). Скриншоты находятся в локальном каталоге QA и не публикуются с исходниками.

Иван, материальное несоответствие подтверждается. Ниже четыре разных причины; это не утверждение, что всякая непрозрачная кнопка или каждая карточка должна стать прозрачной.

Дата: 2026-10-26. Source baseline: `655c3c77a115de6dc301d3947f05fac1927bde29`. Reviewed by a non-author of the implementation. Scope: source cascade, material propagation and targeted runtime reproduction; no implementation edits or publication.

Browser: separate headless Chrome `156.0.8078.48`, Playwright; task-owned pages, no shared CDP media changes. Public pages: `https://rdsolod-ui.github.io/glass-neon-motion-skill/` and `/moodboard.html`. Targeted runtime checks at 1440 × 1000; source comparison covered all four finish/edge combinations. The final reproduction below used the public site. The coordinator owns the broader desktop/mobile screenshot matrix.

## Findings

### P1 — Clear overrides Smoke's dark surface but leaves its white text

- **Location:** `site/material-finishes.css:10`, `.luma-site .tactile-preview`; local Smoke definition in `site/expressive.css:10`, current refinement in `site/expressive.css:44`; state labels in `site/app.js:40–42`.
- **Reproduction:** open the public main page in light theme; retain the default Clear / Glass material; in «Стекло в действии» select Smoke.
- **Observed:** `.tactile-preview` becomes `rgba(255,255,255,.12)` with `blur(.8px)`. Its `h3` remains `rgb(248,250,255)` and paragraph `rgb(220,231,247)`; body is `rgb(233,232,246)`. The status still says `Выбран Smoke · 2D-тонировка`. Frost and Smoke share the same clear fill in this state, although the local control promises different material behavior. Dark theme conceals the contrast failure; the override still occurs.
- **Evidence:** reviewed coordinator screenshot `qa/glass-audit-20261026/tactile-smoke.png`; text is visibly lost. Exact composited contrast ratio was not measured in this source review.
- **Why it matters:** this is both an unreadable real state and a false material demonstration. The explanatory copy says that the tint preserves contrast while the CSS removes that tint.
- **Correction:** give the local three-material study its own scoped finish/edge tokens, or make it explicitly follow the global material and update its controls/copy together. Apply the background and its matching text colors as one state. Do not fix only the text while leaving the Smoke control semantically ineffective.
- **Targeted recheck:** light/dark × Clear/Frost global selection × all three local states, then solid/forced-colors and keyboard selection. In light/Smoke the text must be readable and the actual surface must match the label.

### P2 — The common edge setting reaches only part of the interface

- **Location:** `site/theme-studio.js:29–44` (`aliases`, `buildThemeCSS`); `site/board-v2.css:35–38`; `site/html-atlas.css:32–35`; `site/motion-atlas.css:15–17`.
- **Reproduction:** on the public moodboard keep Clear and switch `material.edge` between `film` and `depth` through `GlassTheme.setSnapshot` (the same state consumed by the visible controls).
- **Observed:** `.ty-card` and `.ui-example-card::before` acquire directed inset highlights in Depth. `.board-copy`, `.ha-entry` and `.ma-card` retain exactly `rgba(39,50,75,.333) 0px 20px 55px -25px` in both modes. The latter selectors consume `--glass-shadow`; the dynamic edge token is `--glass-edge-shadow` / `--gt-edge`. Their fill and blur change, but their edge does not.
- **Why it matters:** the visible global material state is not enough to predict what a selected component exports or how its shell appears. This is a partial propagation contract, not 236 separate defects and not a requirement to give every nested control a bevel.
- **Correction:** explicitly classify surfaces as global-material shells, fixed teaching specimens, or readable wells. Route the first class through one edge token; keep intentional flat/fixed surfaces explicitly marked. Document exceptions in the inventory instead of relying on the CSS class family.
- **Targeted recheck:** compare the same substrate and content for film/depth in each declared global-material family. Keep functional focus-visible and forced-color contours.

### P2 — Exported HTML samples lose the selected local 3D edge

- **Location:** `site/code-export.js:18–25`, `:53–55`, `:90–102`; `site/theme-studio.js:55` (`runtimeSource`); `scripts/html-atlas-section.mjs:164`; `site/html-atlas.js:27`.
- **Reproduction:** on the public moodboard set the common theme to `edge: depth`; select `3D край` in the HTML section; export `ha-tag-button` and open the returned autonomous HTML.
- **Observed:** source page: `html[data-material-edge=depth]`, `#html-atlas[data-ha-edge=3d]`, and `.ha-surface` has two inset shadows plus a contact shadow. Export: the HTML root still says `depth`, but the captured `#html-atlas` says `data-ha-edge=2d`, `.ha-surface` has `box-shadow:none` and fixed `blur(14px)`. The generated runtime synchronizes `.ui-atlas` only. The collection path reuses the same captured specimen and runtime contract.
- **Why it matters:** the common theme and preview can say 3D while the actual exported HTML specimen renders 2D. Unlike the deliberately fixed comparison fixtures, this follows an explicit user material selection.
- **Correction:** resolve material ownership when building the export. Either map global `film/depth` to the HTML sample's `2d/3d` state, or snapshot and declare its independent material override. Preserve semantic input defaults without freezing stale visual controls.
- **Targeted recheck:** single export and mixed collection/ZIP: source selection, exported root, local material attribute and computed optical layer must agree. Verify both directions (2D → 3D and 3D → 2D), including offline files.

### P2 — Readability patches fragment the main glass plane into opaque labels

- **Location:** `site/material-finishes.css:11` and `:37`; `.instrument h3`, `.instrument .muted`, `.instrument .eyebrow`, `.float-chip>span:last-child`, `.topbar :is(.brand,nav a,.actions .btn)`.
- **Observed:** in Clear the navigation adds `background:var(--solid)` and a same-color four-pixel spread shadow to every label. Hero text receives separate dense rectangular fills. This is visible in the coordinator's `qa/glass-audit-20261026/index-light-desktop.png`, reviewed here. The optical panel remains behind a group of opaque patches, so it reads like labels pasted onto a sheet rather than one coherent glass component.
- **Why it matters:** the mechanism preserves text readability but weakens the intended continuous material. This is a visual design issue; opaque text/data wells themselves are valid and should not be removed indiscriminately.
- **Correction:** redesign the reading area as one deliberate well or a controlled local scrim, keeping a meaningful uncovered portion of the same panel for substrate visibility. For the navigation use a single readable backing plane or theme-specific contrast treatment rather than separate solid islands around each text run.
- **Targeted recheck:** compare readable text and continuous substrate in both themes at desktop/mobile, including keyboard focus. Aesthetic improvement must not reduce contrast.

## What is not a defect on this evidence

- The four `.finish-card` comparison specimens are intentionally fixed and need not follow a global preset.
- The six optical studies and the motion specimens have their own teaching substrates/material settings. Their fixed values alone do not establish a defect; the UI should make that independence clear.
- Opaque form fields, data tables, editor output and long-reading wells are allowed by the skill. Making every control transparent would create new readability problems.
- The new straight/bold typography and color accents are compatible with the brief; no serif/italic discrepancy was established in this material review.
- The baseline decorative borders were already removed in later cascade rules. A stale earlier `border` declaration is not evidence of an active perimeter outline. Focus and forced-colors outlines have a separate functional purpose.

## Limits and handoff

No site, skill, runtime or generated files changed. Only this audit note was added. No commit, push or deployment performed.

The coordinator should combine these four findings with the independently captured desktop/mobile and theme screenshots, assign implementation ownership, then request targeted rechecks. This review did not measure FPS, all browser engines, all 401 specimens, OS-level accessibility settings or every composited contrast ratio. It does not accept the whole site based on the inspected subset.
