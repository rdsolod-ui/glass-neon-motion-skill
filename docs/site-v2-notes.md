# Site v2 implementation and checks

2026-10-21. Original CSS optical studies adapted from Ивана references, without copying image assets.

| Before | After | Why |
|---|---|---|
| Dense hero card on a soft wash | Visible cyan sphere, magenta sphere, lime ring, rear pane, frosted foreground and floating chip | References 2/9/17: make transmitted colour and overlap visible |
| Similar material silhouettes | Frost diffusion, dark Smoke with lime underlay, thick-edge Prism | References 13/20/21/24: distinguish the material recipes |
| Static material examples only | Functional Frost/Smoke/Prism buttons and a moving glass selection lens | Inspired by reference 23; timing is an original implementation, not inferred from thumbnail |
| Broad opaque panels | Translucent optical specimens with stable text colour per theme; form inputs remain readable | Separate material expression from text legibility |

## Implementation
- `site/expressive.css` loaded after base styles only by the website. Board styles have independent ownership.
- Existing `site/app.js` adds a native button group, immediate `aria-pressed` and live status, 320 ms cancellable WAAPI lens translation. No loop or new dependency.
- Live and pre-load reduced motion skips lens movement; responsive resize snaps to selected button. Resize listener cleanup and BFCache restore included.
- Original locally hosted Manrope/font licensing and existing icon-free abstract forms retained.
- Solid mode, unsupported backdrop-filter, reduced transparency and forced colors have explicit substitutions. CSS is a diffusion/highlight simulation, not physically accurate refraction.

## Executed checks
- `node --check site/app.js`: pass.
- `qa-site.cjs v2`: 23 of 24 checks passed, all viewport overflow/modal/menu/form/export/live-reduce checks. Its separate page reduced-before-load assertion returned false during the multipage CDP run; isolated fresh context with reduced motion before navigation passed. This discrepancy is retained rather than hidden.
- `qa/site-v2-interactions.cjs`: 5/5 pass: isolated reduced-before-load, touch selection, keyboard selection, reduced lens has no animation, resize alignment.
- `qa-site-touch.cjs`: touch menu opens and closes on navigation.
- Composited screenshot background contrast: six samples pass, minimum 6.92:1. Scope is the sampled hero muted text, floating chip and settings note, not a full contrast audit.
- Screenshots saved for light/dark at 1440/768/390/320 in `qa/site-review-v2-*`; light mobile full-page inspected, root independently reviews hero desktop.

Limits: Chromium emulation, not physical iOS/Safari or full WCAG certification. No performance score claimed.

## Final review corrections
- Removed continuous decorative perimeter borders. Frost and Smoke now explicitly represent 2D film; Prism has directional 3D highlight/inner-shadow thickness. Focus outlines remain for keyboard access.
- Independent skill reviewer found late CSS overrides defeating reduced-transparency/unsupported-filter fallbacks; comprehensive final selectors and removal of repeated rear-pane background fix the cascade. Smoke-specific selectors included.
- BFCache restore now restores resize handling; repeated pagehide continues cleanup instead of a once-only handler.
- Final `qa-site.cjs v2-final`: 24/24 pass, no runtime failures. Reduced preference uses an isolated context and bounded synchronization with actual emulated media state. Exact prior transient cause was not established. Independent diagnostic captured `prefers-reduced-motion=true` at document start, immediately after navigation, and after 150 ms, with zero active effects throughout (`qa/site-reduced-diagnostic.json`).
- Mobile viewport-only screenshots: `qa/v2-site-{light,dark}-mobile-{hero,art,tactile}.png`.
