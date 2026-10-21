# Independent skill-contract cross review — v2

Reviewer: skill_team_v2, not author of site/board implementation. Scope: source-code audit of expressive.css, board-v2.css, app.js, board.js and shared style.css. This report does not assert browser rendering or physical-device acceptance.

## Findings sent to owners

| ID | Severity | Location / evidence | Required correction | Status |
|---|---|---|---|---|
| S1 | P2 | expressive.css loads after style.css and sets .topbar/.material-card/.settings/.closing/.btn:not(.primary) translucent backgrounds; final fallbacks omit them. Later .glass also re-enables backdrop blur. | Put complete no-backdrop/reduced-transparency fallback after expressive rules; disable both filter forms and preserve ink. | Closed — corrected source re-read |
| S2 | P2 | .tactile-preview[data-surface-preview=smoke] has higher specificity than generic reduced/no-backdrop/forced-color .tactile-preview. | Override smoke selector and child p in every relevant fallback; verify Smoke selected in light mode. | Closed — corrected source re-read |
| S3 | P2 | app.js pagehide dispose removes resize syncLens; persisted pageshow restores media change only. | Restore resize listener on BFcache pageshow; resize after history back must align selected lens. | Closed — corrected source re-read |
| B1 | P2 | board-v2 reduced-transparency keeps backdrop filters on panes/tokens/mini-ui; @supports tests only unprefixed capability. | Disable both filters for reduced transparency; use prefixed OR unprefixed support condition. | Closed — corrected source re-read |
| B2 | P2 | Optical studies have no manual dense selector, while skill requires manual fallback for glass-dependent pages. | Expose solid-mode control on board and cover pane/token/mini-ui surfaces. | Closed — corrected source re-read |

## Positive source observations

Shared app.js motion helper cancels prior element animations; active animations cancel on live media change. Semantic surface selection updates immediately and selected lens has a persisted inline endpoint, so reduced-motion cancellation should retain selected state. Board examples delegate to the same helper. This is source reasoning, not browser proof.

Material direction is represented in original layered surfaces, colored substrate, pane highlights, and explicit CSS optical approximation descriptions. Skill/team review by coordinator accepted the contracts; requested ownership registry arrays were added. Native role discovery still unverified.

## Handoff

Owners correct and report; coordinator performs browser checks and release. Review status: **Approve for inspected source-contract scope**. All five findings corrected and latest files re-read. Browser/device acceptance belongs to the separate runtime review, not this source audit.

## Final targeted recheck

- Site fallback now covers late glass/button/smoke rules with adequate specificity and both filter properties. Repeated final rear-pane background was removed so it no longer overrides fallback.
- BFcache pageshow restores resize + media handlers; pagehide is persistent (no once:true), so subsequent exits also dispose.
- Board has a working solid-mode hookup in source and opaque specimen/token rules, with both filters disabled; support test checks prefixed OR unprefixed capability.
- After Иван’s clarification, 2D planes have no material perimeter border/bevel; 3D uses differentiated directional edge/shadow. Focus/forced-color outlines remain functional. Board modal recipe now teaches border:0 and explicitly separates3D treatment.
- No additional source blockers identified in these changed paths. This does not certify visual output or actual BFcache eligibility across browsers.
