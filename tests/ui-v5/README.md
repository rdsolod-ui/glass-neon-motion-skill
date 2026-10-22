# UI Atlas V5 verification

Run `npm run generate`, `npm run check`, `npm run build`. Start one project server (`npm start`, loopback4177). Browser scripts use the existing dedicated CDP9223 and create/close only their own contexts. Set `PLAYWRIGHT_MODULE` to an existing Playwright package if not using the verified Windows installation. No browser-testing dependency is shipped to the website.

Run browser suites **sequentially**, especially media emulation. In this environment concurrent preference tests produced contradictory matchMedia readbacks. Use explicit page.emulateMedia before navigation and verify the preference rather than inferring it from context creation.

```powershell
node tests/ui-v5/qa.cjs
node tests/ui-v5/materials.cjs
node tests/ui-v5/fallback.cjs
node tests/ui-v5/legacy.cjs
node tests/ui-v5/controls.cjs
node tests/ui-v5/compositions.cjs
node tests/ui-v5/data.cjs
node tests/ui-v5/peer-controls.cjs
node tests/ui-v5/peer-compositions.cjs
node tests/ui-v5/peer-compositions-recheck.cjs
node tests/ui-v5/peer-data.cjs
```

The source suites check actions and observable outcomes, not just screenshots. `BASE_URL` points the integration/material/legacy suites at a deployed base URL. Test-specific environment options are visible at the top of each script. Large screenshots and temporary failure output are in ignored `qa/ui-v5/`; compact final receipts are in `evidence/`.

Coverage, findings, repair and limitations: [acceptance-v5](../../docs/acceptance-v5.md). Test results do not imply physical-device, Safari, full WCAG or native-agent discovery coverage. Current publication proof is separate in [release-v5](../../docs/release-v5.md).
