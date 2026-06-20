# PF04 iPhone whiteout / thermal mitigation

## Scope

PF04 targets the iPhone 15 whiteout / heat report without lowering adaptation skill effects into simple graphics. The goal is to keep texture-based effects visible while reducing lower-priority runtime pressure.

## Findings

- Existing performance pressure already watches FPS, runtime children, object pressure, ZERO final pressure, WebGL context lost, ticker stalls, and whiteout dumps.
- Adaptation effect PF02/PF03 counters showed texture effects in the high-load QA path with `graphicsFallback`, `skip`, and `missingTexture` at 0.
- The likely iPhone risk is cumulative endgame pressure: enemies, projectiles, damage/critical text, pickups, companion effects, warning guides, and container children increasing together.
- Damage and critical text are lower priority than player attacks, adaptation effects, enemy warnings, and companion attacks.

## Changes

- Added mobile thermal safety level detection for iPhone/iPad/Android-class browsers.
- Thermal safety does not switch effects to simple graphics. It raises only the combat visual pressure used by low-priority combat text.
- Damage number pressure now starts at level 1 and shortens text lifetime under pressure.
- Non-critical damage text is capped earlier under pressure; critical text is preserved longer but still bounded.
- Normal attack visuals no longer spawn when the acquired target is outside the actual attack hit shape.
- Performance and whiteout dumps now include:
  - `visibleEnemyCount`
  - `offscreenEnemyCount`
  - `thermalSafetyLevel`
  - layer child counts already present in `containerChildren`

## Whiteout dump additions

The `EVOLUTION_ZERO_WHITEOUT_DUMP` payload now records visible/offscreen enemy counts and thermal safety level, and the DOM whiteout summary includes `vis=visible/offscreen` and `thermal=level`.

## QA notes

- ZERO and ENDLESS high-load should be checked with `debugPerformance=1`.
- Watch `shed`, `thermal`, `enemy vis/off`, `dmg`, `adaptFx`, and `whiteout` rows.
- Acceptance target: adaptation effects continue to use texture assets, no missing textures, and runtime console error/warn count remains 0.

## Remaining risk

iPhone thermal behavior cannot be fully proven from desktop QA. If field reports continue, PF05 should add a user-copyable mobile diagnostic panel and consider offscreen enemy update throttling.
