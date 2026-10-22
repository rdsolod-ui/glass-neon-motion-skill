# Variation layer — local acceptance, 2026-10-22

Scope: 44 new live-local variants / 15 families in a separate section; preserve 24/76 UI, original labs and clear+depth default. Release authorized by Иван; publication receipt is recorded separately in docs/release-variations.md. Global installed-skill copy is not modified. Current base HEAD: `9aff0e66583d39743afcc8ef9c860b5d477c56c1`; staged-only source snapshot tested at loopback4188, excluding unrelated work.

## Evidence

- `node tests/variations/qa.cjs`: 85/85, zero browser/resource errors; report `qa/variations/report.json`.
- `node tests/variations/advanced.cjs`: 43/43 including escaped file metadata, queue limits, focus after disabling, notifications undo, dual bounds and split panes.
- `node tests/variations/touch.cjs`: 5/5, emulated mobile touchscreen actions, keyboard focus and long input; `qa/variations/touch.json`.
- Existing materials suite: 47/47, both LUMA and Glass Atlas.
- Existing fallback suite: 10/10.
- Existing legacy suite: 50/50 including dialogs/focus and legacy motion.
- `npm run check`: 30 base + 11 UI + 6 variation checks; `npm run build`: success.
- Real Chromium screenshots inspected: light/dark desktop/mobile, scroll samples and progress samples. Outputs in ignored `qa/variations/`.

The first new-suite run passed 80 checks but timed out during no-JS pointer stability on a long page. No-JS disclosure was retested using actual focus/Enter; the complete rerun passed. No simulated test result.

## Independent review and fixes

Native `glass_qa`, child `/root/variations_review`, read-only code review followed by targeted recheck PASS. Browser checks and visual inspection are by the implementing coordinator, not claimed independent.

| Before | After | Reason |
|---|---|---|
| Generic search tags included progress/scroll on every variant | Only variation/вариант shared; per-card tags carry subject | Narrow searches exclude unrelated controls |
| Mount disabled every Back button | Both step buttons derive disabled state from saved step | Restored final step remains navigable |
| Opaque fallback used alpha .91/.92 wells | Uses `--solid` | Solid/reduced-transparency/no-backdrop become opaque |
| Motion checked an unused data-motion value | Reads data-reduce and data-ui-reduced plus OS media | Live preference cancels active WAAPI |
| Light progress used bright lime on near-white | Functional indicator uses dark teal; dark theme retains accent | Stronger visible distinction of fill and track |

## Limits

Chromium via the existing dedicated CDP bridge; widths 320, 390, 768, 1440. Mobile is emulation, not a physical device. Safari/Firefox, full WCAG certification and FPS are not claimed. Persisted pageshow is simulated to verify remount state; actual BFCache admission is not proven. HTML recipes require the layer's CSS/JS; no backend upload/auth/payment is implied. Native scrollbar geometry depends on OS/browser.

Existing uncommitted `html-atlas.js`, `motion-atlas.js`, theme-studio files and code-theme-peer work were not edited by this task. Generator/shared integration changed only to include this layer. Main-site source was not changed; its existing material/legacy behavior was retested. Repository skill reference updated; global installed copy was not replaced.

## Extended families and release snapshot

Second native glass_qa review found focus loss on disabled commands and missing explicit keyboard access on scroll panels. Both fixed and independently rechecked by code; browser tests verify focus and panel tabindex. Exact staged snapshot excludes unrelated html-atlas/motion-atlas/theme-studio changes. Initial checkout-index copy used Windows CRLF and failed generator string equality; copied again with per-command core.autocrlf=false (no global setting change) and the exact staged LF bytes passed 47 checks. Browser suites on snapshot: 85+43+5 new, 47+10+50 preserved.
