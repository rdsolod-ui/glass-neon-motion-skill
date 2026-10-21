# HTML atlas — coverage and implementation

Updated 2026-10-21 for Иван. This is an extension of the approved LUMA material system, not a new visual direction. Existing user references and typography remain authoritative; no additional gallery search or third-party imagery was needed for a bounded reference atlas.

## Scope

- **113 conforming HTML tag names** from the WHATWG Elements index, including `search`, `selectedcontent`, `slot` and `template`.
- **2 foreign namespace roots** (`svg`, `math`) clearly excluded from the HTML count.
- **22 input types**, including hidden, image, button, reset and submit.
- **11 semantic groups**: controls, disclosure, sections, headings, text blocks, lists, inline semantics, tables, media, embedded content, document/templates.
- **12 state/pattern specimens**: button hierarchy; toggle/icon/disabled; finite loading; radio segments; multiple select; switch; mixed checkbox; required/readonly/disabled; error/helper text; popover; current navigation; keyboard/hover/active.

The roster is pinned separately in [html-atlas-source-roster.json](html-atlas-source-roster.json). It was manually normalized from the WHATWG index viewed through the web tool, expanding the combined h1–h6 row and excluding the separate SVG, MathML and custom-element rows. It is not derived from the implementation array. Sources: [WHATWG index](https://html.spec.whatwg.org/multipage/indices.html#elements-3), [MDN elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements), [MDN input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input). Checked 2026-10-21; WHATWG page reported last update 2026-10-20.

## Honest specimen types

Visible semantic elements use actual native markup. Context-dependent table/list/ruby tags are shown in complete valid parent structures, so some related rows intentionally share a specimen. The complete code is visible alongside it. Document metadata, scripts, template/slot, main, selectedcontent, track and embed use escaped recipes instead of injecting global document behavior or missing resources.

Audio/video show native controls and an original poster, explicitly labelled **without media files**. They are not playable media examples. `search` shows a search field, explicitly without a local data filter. The main atlas search is functional. SVG images are original inline/data assets; nothing was copied from the user's image references.

New and obsolete/nonstandard tags are separated from the base count. Arbitrary Web Components and complete SVG/MathML dictionaries are out of scope. Composite ARIA patterns such as tabs, combobox, tree and grid are named as implementation recipes, not claimed as fully implemented accessible widgets.

## Integration contract

- `scripts/html-atlas-section.mjs`: exports `htmlAtlasSection()`, `htmlElements`, `inputTypes`, `obsoleteElements`.
- `site/html-atlas.css`: scoped `.ha-*` layout/material, independent light/dark variables, 2D no rim, 3D local inset light and shadow.
- `site/html-atlas.js`: module, search/groups, native local form feedback, toggle/mixed/range, dialog, finite loading and one-time canvas draw.
- Import function in render-atlas; add stylesheet and module script. Stable anchor `#html-atlas`; state anchor `#ha-states`.
- Uses page `html[data-theme]`, `html[data-solid]`, `html[data-reduce]`. No added dependencies.
- All demo forms use `method="dialog"` plus `preventDefault()` when JS is present; outside a dialog this prevents no-JS submission/navigation. They never send or store entered data. Native form validation is retained.
- Browser-native details/select/radio work without JS. Disabled search/filter controls clearly indicate unavailable enhancement without JS.

## Author QA

Actual Chromium over the existing dedicated CDP bridge, isolated browser context. `qa/html-atlas-qa.mjs` / `qa/html-atlas-qa.json` contain **30/30 passing checks**, no page errors: counts/unique IDs, search/no-results/group filtering, select, local form, dialog Escape/focus restore, toggle, mixed checkbox, popover, finite loading, all expanded specimens at 1440/768/390/320 in both themes, 2D/3D separation, solid, reduced motion, forced colors and no-JS select/forms. A first failure found an invalid unquoted CSS attribute value `3d`; fixed and rerun. Screenshots were inspected; a button specificity issue was then corrected before final screenshot refresh.

These are author checks, not independent acceptance. They do not certify Safari, physical phones, all assistive technology, WCAG conformance or performance. The parent/reviewer performs separate final acceptance.
