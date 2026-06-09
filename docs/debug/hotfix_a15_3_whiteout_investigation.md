# HOTFIX-A15.3 ZERO Whiteout Investigation

## Reported Symptom

- Route: ZERO mode, after the second ZERO boss appears.
- Timing: after enemies and combat feedback increase for a while.
- Result: screen turns white, BGM/SE stop, and gameplay becomes fully stopped.

## Initial Reproduction Context

- Local route used for smoke setup:
  - `?debugIntroSeen=1&debugStage=volcano&debugMode=zero&debugDifficulty=expert&debugUnlockDino=spinosaurus&debugUnlockZeroRoute=spinosaurus_zero&debugZeroBoss=1&debugWeakBoss=1&debugAdaptationAllLevel=3&qaHotfixA153Soak=1`
- Initial page load console error/warn count: 0.
- Browser-side debug handles were not consistently readable before the hotfix, so runtime stats export was expanded.

## Hotfix Soak Check

- Current-source dev route:
  - `?debugIntroSeen=1&debugAutoPlay=1&debugStage=volcano&debugMode=zero&debugDifficulty=expert&debugDino=spinosaurus&debugUnlockDino=spinosaurus&debugUnlockZeroRoute=spinosaurus_zero&debugZeroBoss=1&debugAdaptationAllLevel=3&qaHotfixA153Soak=4`
- Duration: 75 seconds after page load.
- Result: app remained responsive with canvas present.
- Browser tab console error/warn count: 0.
- Last runtime error state: null.
- Note: the browser inspection environment used for this check did not expose page-world debug expando properties back to the automation context, but the debug stats export is available in normal page context for future manual/device checks.

## Suspected Cause

The issue is most likely a compound load spike rather than a single static asset problem:

- A15.2 added `CRITICAL` damage text for adaptation skills.
- A15.3 increased late enemy pressure and introduced higher phase caps.
- ZERO phase 2 can combine boss hazards, boss summons, normal enemies, adaptation effects, damage numbers, pickups, and warning sprites.
- Several runtime visual collections had cleanup by lifespan, but did not have hard simultaneous-count caps.

## Hotfix Stabilization

- Added hard caps for adaptation combat effects, adaptation projectiles, damage numbers, and critical damage numbers.
- Added hard caps for enemy projectiles, stage/boss gimmicks, pickup burst effects, pickup popups, and world pickups.
- Updated boss summons to respect the A15.3 progression phase enemy cap instead of only the mode soft cap.
- Added a frame delta cap in `ScreenManager.update` so tab stalls or large delta spikes cannot advance spawning/effects in a single huge step.
- Added a guarded PlayScene update path that records the last update exception to `window.__EVOLUTION_ZERO_LAST_RUNTIME_ERROR__` in debug contexts.
- Added debug runtime stats at `window.__EVOLUTION_ZERO_RUN_DEBUG_STATS__` and `#app.__EVOLUTION_ZERO_RUN_DEBUG_STATS__`.

## Debug Stats

Debug routes now expose:

- enemy count
- enemy projectile count
- stage/boss gimmick count
- combat projectile count
- combat effect count
- damage text count
- pickup burst count
- pickup popup count
- pickup count
- layer child counts
- active audio instance count
- active boss id / phase / HP

## Expected Stability Target

- ZERO phase 2 can still apply pressure, but visual feedback and hazard objects must not grow without bounds.
- CRITICAL-heavy adaptation builds should keep feedback readable without creating unlimited text objects.
- Boss summons should not bypass the current phase enemy cap.
- If an unexpected update exception occurs, it should be recorded for debugging instead of silently white-screening the run.
