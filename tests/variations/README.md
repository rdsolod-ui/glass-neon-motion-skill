# Variation layer QA

Start the existing loopback server on 4177; use dedicated CDP 9223. Run sequentially:

```
node tests/variations/advanced.cjs
node tests/variations/touch.cjs
node tests/variations/qa.cjs
node tests/ui-v5/materials.cjs
node tests/ui-v5/fallback.cjs
node tests/ui-v5/legacy.cjs
npm run check
npm run build
```

The new suite creates and closes only its own contexts; it does not launch browsers or modify global configuration. Reports/screenshots: ignored `qa/variations/`. Covers actual state changes, native scroll, search/deep links, layout widths 1440/768/390/320, material axes in two themes, reduced motion before/live, solid/reduced-transparency/forced colors, cleanup/remount and no-JS disclosure. Synthetic persisted pageshow tests handler restoration, not a guarantee of real BFCache admission.

Set BASE_URL to the staged release preview or the verified public base URL. Native scrollbar appearance varies by OS.
