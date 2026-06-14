# P08 Hotfix ZERO Volcano Whiteout Investigation

## Scope

- Branch: `hotfix/zero-volcano-whiteout-p08`
- Version base: `0.10.0`
- Build base: `companion-dino-p08`
- Target issue: ZERO volcano late phase can enter a white screen without the crash diagnostics screen.
- Main merge/push: not performed in this hotfix branch.

## Reproduction Focus

The reported route is ZERO volcano late game, including final boss pressure and dense effects. The investigation compares:

- ZERO volcano without Companion Dino.
- ZERO volcano with Companion Dino.
- High pressure debug routes with `debugPerformance=1`.
- `debugMaxSpawn` and normal spawn pressure.

## Findings

The existing crash diagnostics covered runtime errors, unhandled rejections, WebGL context lost, and ticker stalls. The whiteout report did not show the crash screen, which points to a render-state or full-screen overlay issue where the ticker may still be alive enough to avoid the crash screen path.

The most relevant full-screen bright render path is the boss clear sequence:

- `bossDefeatFxLayer` draws a full-screen flash.
- ZERO final boss clear uses bright cyan/white assets and strokes.
- If the sequence receives invalid values or remains active beyond its expected duration, the layer can visually dominate the screen without producing a JavaScript error.

Companion Dino is not assumed to be the cause. Companion-specific metrics are now captured in the whiteout dump so a recurrence can show whether Companion effects or scans are involved.

## Fix

Implemented in `src/scenes/play_scene.js`:

- Added `EVOLUTION_ZERO_WHITEOUT_DUMP` localStorage diagnostics.
- Added `data-ez-whiteout-dump` and `data-ez-whiteout-summary` DOM attributes for browser QA.
- Captures stage, mode, difficulty, elapsed time, counts, Companion effect/scan data, renderer/canvas state, container children, active filters, full-screen graphics state, WebGL context lost state, and boss clear sequence state.
- Saves the same dump when WebGL context lost is detected.
- Hardened boss clear sequence:
  - Clamps full-screen flash alpha.
  - Rejects invalid progress, screen position, or radius.
  - Detects sequence duration overrun.
  - Clears and hides the full-screen boss defeat graphics on normal completion, invalid state, overrun, restart, and inactive sequence.
  - Rejects invalid or extreme boss death sprite scale.
- Added whiteout dump status to `debugPerformance=1`.

## Companion Impact

No code path was found that requires Companion Dino for this whiteout. The dump records:

- `compFx`
- `compScan`
- active Companion id
- Companion effect pool counts

This allows future reports to distinguish Companion-related growth from stage/boss overlay issues.

## QA Notes

Required before merging:

- ZERO volcano with no Companion: no whiteout.
- ZERO volcano with Companion: no whiteout.
- ZERO volcano high pressure: no whiteout and no crash diagnostics.
- ENDLESS high pressure short soak: no regression.
- Runtime console error/warn: 0.
- `EVOLUTION_ZERO_WHITEOUT_DUMP` should only be written on context lost or guarded whiteout-suspect boss clear states.

## Local QA Results

2026-06-14 local browser checks on `http://127.0.0.1:5176/EVOLUTION-ZERO/`:

- ZERO volcano, no Companion, `debugPerformance=1`, invincible, final boss debug route, 26 seconds:
  - `perf`: `t=18.16 enemy=30 pickup=2 children=50 compFx=0 compScan=0/0 shed=0 stress=0 ctx=0 err=0`
  - Crash screen: no
  - Whiteout dump: no
  - Console warn/error: 0
- ZERO volcano, `exp_chaser` Lv5, `debugMaxSpawn=1`, no pickup collect, final boss debug route, 32 seconds:
  - `perf`: `t=375.82 enemy=205 pickup=0 children=223 compFx=0 compScan=0/0 shed=0 stress=0 ctx=0 err=0`
  - Crash screen: no
  - Whiteout dump: no
  - Console warn/error: 0
- ZERO volcano, `rex_hatchling` Lv5, `debugMaxSpawn=1`, no pickup collect, final boss debug route, 32 seconds:
  - `perf`: `t=375.68 enemy=205 pickup=0 children=223 compFx=0 compScan=996/0 shed=0 stress=0 ctx=0 err=0`
  - Crash screen: no
  - Whiteout dump: no
  - Console warn/error: 0
- ENDLESS jungle, `exp_chaser` Lv5, `debugMaxSpawn=1`, no pickup collect, 26 seconds:
  - `perf`: `t=25.16 enemy=31 pickup=0 children=50 compFx=0 compScan=0/0 shed=0 stress=0 ctx=0 err=0`
  - Crash screen: no
  - Whiteout dump: no
  - Console warn/error: 0

The Node REPL host emitted unrelated Statsig networking errors while controlling the browser. Those were not game-page console entries; `tab.dev.logs({ levels: ['warn', 'error'] })` returned 0 game warn/error entries for the checked routes.

## Remaining Risks

- The original report was a late-game visual whiteout without crash diagnostics. If the actual cause is a different full-screen overlay or GPU/browser-specific renderer state, the new dump should provide concrete evidence on the next occurrence.
- Full iPhone/PWA WebGL behavior still needs real-device confirmation after this branch is validated locally.

## Main Reflection

Main reflection is allowed only after the hotfix branch QA passes and the user approves merge/push.
