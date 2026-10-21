# Reference and moodboard acceptance review

Reviewer: specialist moodboard/art-direction agent. Research date: 2026-10-21 (Europe/Moscow). Brief owner: Иван.

## Direction gate

**Accepted for development:** an optical-material atlas, with frosted alabaster in light mode and smoked obsidian in dark mode. Cyan, lime and magenta are selectable accents; use one dominant accent in a local composition. Glass separates layers; neon identifies interaction. Long reading surfaces remain calm and sufficiently opaque.

The explicit brief overrides `design-taste-frontend-v2` house bans on glass, gradients and glows. Its useful composition and real-browser QA guidance still applies. A generic prohibition must not erase the requested design. No stock-photo quota is appropriate for a material/component atlas.

## Sources and observed evidence

The following are references, not copied assets or licensed templates. Browser observations cover the views described, not a full accessibility or performance audit. Gallery screenshots do not establish motion behavior. Prices, product claims and business results shown inside examples are not facts about this project.

| ID | Exact source | What was verified | Proposed original adaptation |
|---|---|---|---|
| G1 | [GlassKit LUMEN demo](https://glasskit-web.jungherz.com/demo/) | Real browser screenshots in dark and light after operating the theme toggle. Teal smoked / pale frosted surfaces, layered interface hero, rounded segmented controls, orange action emphasis. | Compare the same specimen in two independently tuned themes; material changes are more than color inversion. Use our own palette, content and CSS. |
| G2 | [Remember Style glassmorphism](https://remember.style/glassmorphism) | Browser visually shows a dark violet/cyan background, central translucent pane, bright edge, cyan primary action and glass-like rings. Hero content appeared after an entrance; no full timeline measurement was made. The page also exposes layer-isolation and light controls in its accessibility tree; those controls were not functionally audited. | Original layer laboratory showing fill, edge, blur and depth; render text immediately and let decorative motion enhance it. Do not copy imagery or rely on its claimed GPU performance. |
| G3 | [Microsoft Fluent material](https://fluent2.microsoft.design/material) | Primary documentation read. Defines solid, acrylic, mica and smoke; acrylic is suited to transient surfaces. | Material roles: solid reading surface, acrylic menu, dark smoke modal scrim. This is a web interpretation, not a WinUI component. |
| G4 | [Microsoft acrylic guidance](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic) | Primary documentation read; discusses translucency, blur, tint and noise; cautions against confusing multiple acrylic layers. | Limit nested blur, use a stable opaque fallback and test actual composited contrast. Platform-specific APIs are not web dependencies. |
| G5 | [Apple Liquid Glass announcement](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/) | Primary text read. Describes adaptive materials on controls, navigation, widgets and sidebars, including movement-reactive highlights. | Optical hierarchy and restrained specular accents. CSS backdrop blur is not equivalent to Apple's native refraction engine; no parity claim. |
| H1 | [Supahero: Reflect](https://supahero.io/hero/reflect) | Gallery image visually inspected in browser: centered headline, luminous violet horizon, dark UI pane beneath, compact navigation. | A single clear headline above a purposeful interactive specimen. Neon remains behind, not inside, long text. Reference motion unknown. |
| P1 | [Pricing Pages: Fey](https://pricingpages.design/sites/fey) | Desktop and mobile gallery images inspected. One dominant price, restrained dark composition, support explanation and FAQ below. Large numeral is intentionally low contrast in source. | Use pricing as a legibility/comparison exercise; any demo price must be explicit demo data. Do not copy the low-contrast essential numeral. Reference motion unknown. |
| N1 | [Navbar Gallery: Supaste](https://www.navbar.gallery/navbar/supaste) | Desktop and mobile gallery views inspected: compact top navigation and a separate stacked mobile menu. | Glass navigation shell with short labels; mobile menu has an explicit accessible control and vertical links. Screenshot does not establish keyboard behavior. |
| C1 | [CTA Gallery: Eternalblue](https://www.cta.gallery/cta/eternalblue) | Desktop/mobile images inspected: light product composition with a small contextual action, mobile puts copy below product image. **Structural, not glass, reference.** | CTA placed beside the content that explains its outcome; on mobile preserve reading order and a generous hit area. No conversion claim. |
| F1 | [Footer Design: Eclipse Space](https://www.footer.design/sites/eclipse-space) | Gallery image inspected: dominant visual identity with compact grouped utility links. **Composition, not glass, reference.** Gallery tags list motion/WebGL, but their behavior was not inspected. | Designed closing composition, source links and grouped docs navigation on a stable panel. No custom cursor or WebGL needed. |

All five required gallery families were considered and one exact example from each was visually inspected. The material direction comes primarily from G1/G2, supported by G3–G5. Structural gallery references are not mislabeled as glass examples. External images have not been packaged for redistribution.

## Coverage map: 48 named element families

This is an explicit broad scope, not a claim to enumerate every element that could ever exist. Rows are design targets; inclusion here is **not** proof that each has a working demo. The interactive moodboard must state whether a row is a visual specimen, functional demo, or documented recipe.

Material codes: **R** = stable reading surface, light near-white / dark near-black; **G** = bounded frosted panel, theme-specific tint and edge; **A** = accent fill with verified text contrast; **S** = smoke scrim plus R/G panel. Dense content uses R within G rather than repeated nested blur.

| # | Family | Named element / states | Source mapping | Material | Proposed motion |
|---|---|---|---|---|---|
| 1 | Foundation | Theme + accent selector | G1/G3 | R/A | M8 |
| 2 | Foundation | Glass surface / edge / depth | G2/G4 | G | M1 |
| 3 | Foundation | Typography + icon specimen | G1/H1 | R | None |
| 4 | Layout | Container / responsive grid | H1/C1 | R | None |
| 5 | Layout | Hero / product preview | H1/G1 | G | M1 |
| 6 | Layout | Feature / bento panel | G1 | G/R | M1/M2 |
| 7 | Layout | Process / timeline | G1 | R | M1 |
| 8 | Navigation | Header / sticky navigation | N1/G1 | G | M1 |
| 9 | Navigation | Mobile drawer | N1/G3 | S | M5 |
| 10 | Navigation | Sidebar / table of contents | G3/G5 | G | M5 |
| 11 | Navigation | Breadcrumb / current location | N1 | R | None |
| 12 | Navigation | Tabs / segmented control | G1/G5 | G/A | M3 |
| 13 | Navigation | Pagination | N1 | R/A | M3 |
| 14 | Navigation | Footer / utility links | F1 | R/G | M1 |
| 15 | Content | Article / rich text / code | G3 | R | None |
| 16 | Content | Card / card grid | G1 | G | M2 |
| 17 | Content | Accordion / FAQ | P1/G1 | R/G | M4 |
| 18 | Content | Quote / testimonial | G1 | R | M1 |
| 19 | Content | Logo strip / avatar group | G1 | R | None |
| 20 | Content | Badge / tag / chip | G1 | A/R | M3 |
| 21 | Forms | Primary / secondary / icon button | G1/C1 | A/G | M2 |
| 22 | Forms | Text field / textarea | G1 | R | M2 |
| 23 | Forms | Select / combobox | G3 | R/G | M5 |
| 24 | Forms | Checkbox / radio | G5 | R/A | M3 |
| 25 | Forms | Switch | G1/G5 | A/R | M3 |
| 26 | Forms | Slider / range | G5 | A/R | M6 |
| 27 | Forms | Date / time picker | G3 | R/G | M5 |
| 28 | Forms | File upload / drop area | G1 | R/G | M2/M7 |
| 29 | Forms | Search / filter / empty results | N1 | R/G | M3 |
| 30 | Forms | Validation / help / success | G1 | R | M7 |
| 31 | Data | Statistics / KPI | G1 | R/G | M1 |
| 32 | Data | Table / sort / row selection | G3 | R | M3 |
| 33 | Data | List / activity feed | G1 | R/G | M3 |
| 34 | Data | Chart / legend / accessible summary | G3 | R | M1 |
| 35 | Media | Image / gallery / caption | C1 | R/G | M1 |
| 36 | Media | Carousel / previous / next | C1 | R/G | M3 |
| 37 | Media | Video / playback controls | G5 | G/R | M2 |
| 38 | Media | Map / zoom / static alternative | G5 | G/R | M6 |
| 39 | Feedback | Tooltip / popover | G3/G4 | G | M5 |
| 40 | Feedback | Dialog / sheet / confirmation | G3 | S | M5 |
| 41 | Feedback | Toast / alert / banner | G3 | R/G | M7 |
| 42 | Feedback | Progress / loading / skeleton | G1 | R/A | M7 |
| 43 | Feedback | Empty / error / offline state | G3 | R | M7 |
| 44 | Commerce | Pricing card / billing selector | P1 | R/G/A | M3 |
| 45 | Commerce | Comparison / feature table | P1 | R | None |
| 46 | Commerce | Product / cart / quantity | C1 | R/G | M3 |
| 47 | Motion | Scroll reveal / restrained depth | H1/G2 | G | M1/M9 |
| 48 | Motion | Pointer highlight / optical specimen | G2/G5 | G | M6 |

Quotes, logos, KPIs and commerce data use explicitly labeled fictional examples if the brief supplies no real data. Map, checkout, uploads and account actions need real integrations in a production task; visual specimens must not pretend to perform them.

## Motion proposal map

These are our proposed recipes, not assertions about the source sites' implementations. Durations are starting values to tune, not accessibility standards. CSS handles feedback; WAAPI handles bounded replayable specimen motion. Optional framework recipes may use Motion or GSAP, with one owner per property.

| Code | Trigger / movement | Starting timing | Interruption and reduced-motion substitute |
|---|---|---|---|
| M1 | Once visible: opacity + translateY 8–16px | 280–420ms, ease-out | Cancel on preference change; immediately show final readable state. No permanently hidden content on script failure. |
| M2 | Hover on fine pointer / press / focus: subtle translate or scale | 120–180ms | Release returns to rest; focus ring never depends on animation. Reduced mode keeps color/outline feedback without travel. |
| M3 | Selection / tabs / filter: indicator translate, content replacement | 180–240ms | Latest selection wins; cancel stale transitions. Reduced mode switches immediately with selected state announced. |
| M4 | Accordion expansion | 200–280ms | Synchronize semantic open state; do not clip focusable children. Reduced mode opens immediately. |
| M5 | Menu / dialog open-close: opacity + tiny translate | 160–240ms | Escape/close interrupts; modal focus trap and return are required. Reduced mode immediate panel/scrim changes. |
| M6 | Pointer drag / bounded light response | Direct manipulation, no perpetual loop | Clamp geometry, cancel at pointer leave/cancel; keyboard alternative. Reduced/coarse pointer mode uses stationary light and native control. |
| M7 | Task feedback: progress or status change | Actual state, not a fake timer | No fake completion. Skeleton stops; reduced mode static placeholder and textual status. |
| M8 | Theme/accent change | Immediate or ≤180ms color transition | No full-screen flash or crossfade hiding content. Explicit user choice persists; system theme updates only when following system. Reduced mode immediate. |
| M9 | Optional scroll depth: small decorative translation | Bounded by section progress | No hijacked scrolling or reading dependency; reduced mode static. Avoid large blur repaint and remove listeners/observers on cleanup. |

## Acceptance checklist and stage status

**Reference/concept stage accepted for development**, with the conditions below. Finished moodboard and site acceptance is pending inspection of their actual files and browser views.

- Both themes are designed independently; borders remain visible without excessive white halos.
- Neon is deliberate, not applied to every word or every panel; body text has a quiet stable surface.
- Each displayed specimen has a recognizable purpose, a source link, and an explicit specimen/demo/recipe status.
- At least one real functional example demonstrates each implemented motion family. A static screenshot is not animation proof.
- Focus/hover/touch do not rely on glow alone; reduced motion works at initial load and after live preference change.
- Contrast is checked on rendered/composited backgrounds, not only isolated hex colors.
- Responsive previews remain readable; no artificial page-wide overflow clipping hides defects.
- Scope claims match evidence: no invented benchmark, performance score, native Liquid Glass equivalence or universal component coverage.
- Sources stay attributable and linked; copying a source's assets, font, code or template requires its own license review.

Excluded from baseline demo unless explicitly added: real payments/authentication, server uploads, live geolocation/maps, WebGL refraction, 3D assets, CMS, native Apple/Windows APIs, and every possible enterprise-domain widget. These are extension routes, not prerequisites for functional glass websites.
