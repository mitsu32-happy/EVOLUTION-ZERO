# MVP-A09 Boss / ZERO Notice Audit

## Scope

- Normal boss arrival notice.
- ZERO PHASE 1 / PHASE 2 notices.
- FINAL PROTOCOL notice.
- Boss defeat shockwave / flash connection into CLEAR and ZERO CLEAR.

## Current State Before A09

- Runtime uses A07c illustrated assets:
  - `public/assets/ui/hud/boss_notice_panel_a07c.png`
  - `public/assets/ui/hud/boss_notice_alert_chip_a07c.png`
  - `public/assets/ui/hud/zero_notice_panel_a07c.png`
  - `public/assets/ui/hud/zero_final_protocol_panel_a07c.png`
- Text is rendered in code, so boss names and phase labels remain readable/localizable.
- ZERO mode suppresses the normal boss-arrival banner and uses phase notices instead.
- Notices are blocked during level-up, evolution choice, result display, pause, and game-over states.

## Issues Found

- Normal boss notice used a strong pulse and appeared slightly lower than ideal, which could compete with the center combat space.
- Normal boss text had no wrapping/shadow protection for longer boss names.
- ZERO PHASE notices were readable, but the warning overlay could feel a touch heavy for non-final phases.
- FINAL PROTOCOL had strong art density but benefited from a slightly wider panel, softer noise/core alpha, and a more deliberate lower placement.

## A09 Adjustments

- Normal boss notice:
  - Moved upward from y=178 to y=164.
  - Expanded the panel safe area to 342x84 when the A07c panel is loaded.
  - Added text wrapping, center alignment, and subtle drop shadow.
  - Reduced pulse strength and added explicit fade-in/fade-out timing.
  - Runtime duration set to 1.95s.
- ZERO PHASE:
  - PHASE 1 duration: 2.02s.
  - PHASE 2 duration: 2.12s.
  - ZERO start notice duration: 1.90s.
  - Notice panel moved to y=158 and widened slightly.
  - Non-final noise alpha reduced to keep play readability.
- FINAL PROTOCOL:
  - Duration set to 2.62s.
  - Panel widened and moved slightly lower.
  - Dim overlay reduced to 0.24 alpha.
  - Noise/core alpha reduced so text remains legible.

## QA Notes

- Required debug routes:
  - `?debugStage=jungle&debugBossFast=1&debugWeakBoss=1`
  - `?debugStage=jungle&debugMode=zero&debugZeroFast=1&debugUnlockDifficulties=1`
  - `?debugZeroBoss=1`
  - `?debugZeroFinalBoss=1`
- Build and syntax checks are mandatory after adjustment.
- Real-device QA should still recheck notification legibility over dense late ZERO combat.

## A09 Verification Results

- `node --check src/scenes/play_scene.js`: pass.
- `node --check src/ui/result_ui.js`: pass.
- `npm.cmd run build`: pass, with existing Vite large chunk warning only.
- A07c notice assets returned HTTP 200 from the local dev server.
- Browser route logs:
  - Normal boss route reached play/boss state with console error/warn 0 at the checked point.
  - ZERO fast route reopened after the A08 result guard fix with console error/warn 0 at the checked point.
  - ZERO final protocol debug route opened and ran for the checked window with console error/warn 0.
- Visual screenshot capture became unstable in the in-app browser after a long route, so final visual judgment should still be rechecked manually on device.