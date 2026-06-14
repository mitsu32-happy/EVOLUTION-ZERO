# MVP-P07e Companion Dino final QA

Date: 2026-06-14
Branch: `feature/companion-dino-p01`
Purpose: complete the remaining P07c QA items after the P07d performance hotfix and reassess main merge readiness.

No `main` merge or push was performed.

## Summary

| Area | Result | Notes |
| --- | --- | --- |
| No-debug natural route | Partial pass | No-debug title, intro skip, START, and home were verified with app console error/warn 0. Full natural egg drop through hatch could not be completed in browser because the current in-app browser save was not a new clean save and page-scope storage mutation is unavailable. SaveManager flow coverage was used for egg/hatch/set/upgrade/unset/restart persistence. |
| Existing-save compatibility | Pass | Missing companion, legacy `levels` only, partial `upgradeLevels`, egg discovery backfill, null selected, and invalid selected states normalized safely. |
| Smartphone width UI | Pass with note | 390x844 viewport checked for home, unknown research tab, all-owned selection modal pages, companion research owned list, and upgrade item selection. No fatal overflow or unusable button was observed. |
| Controller / virtual mouse | Partial pass | Virtual pointer/touch interactions could open and close companion selection and upgrade flows. `Escape` did not close the upgrade item modal; physical controller hardware was not available in this environment. |
| ZERO maxSpawn soak | Pass | `rex_hatchling` level 5 route reached `03:01`; crash screen not shown; app console error/warn 0. |
| ENDLESS maxSpawn soak | Pass | `exp_chaser` level 5 route reached `03:20`; crash screen not shown; app console error/warn 0. |

## No-debug natural route

Route:

`http://127.0.0.1:5176/EVOLUTION-ZERO/?p07eNatural=1`

Observed:

- Title screen displayed without crash diagnostics.
- Intro screen opened and skipped normally.
- START opened the home screen.
- Existing save home state restored.
- App console error/warn: `0`.

Limitation:

- A fully clean no-debug egg drop -> result -> research hatch -> set -> upgrade -> restart run was not completed in the browser.
- The in-app browser page evaluation surface is read-only for storage, so the current browser save could not be reset or seeded from the test harness.
- Egg drop is intentionally random, so forcing it without debug parameters would not be deterministic.

Compensating verification:

- SaveManager flow was tested with an empty in-memory storage through egg grant, incubation, forced completion, selection, range/effect upgrade, unset, and reload.
- Restored state retained owned companion, `selectedId: null`, upgrade levels, `eggDiscovered: true`, and `lastHatchedId`.

## Existing-save compatibility

Tested with `SaveManager` and production save key `evolution_zero_save_v1`.

Cases:

| Case | Result |
| --- | --- |
| Missing `companion` | Normalized to default companion state. |
| Legacy `levels` only | Owned/selected `rex_hatchling` retained; range/effect/speed levels backfilled from old level. |
| Partial `upgradeLevels` | Missing upgrade types backfilled safely. |
| Egg pending without `eggDiscovered` | `eggDiscovered` backfilled to true. |
| `selectedId: null` | Preserved and play-compatible. |
| Invalid selected id | Normalized to null without deleting owned companion data. |
| Over-max legacy level | Clamped to companion max level. |

SaveManager flow result:

- `grantCompanionEgg`: pass
- `startCompanionEggIncubation({ instant: true })`: pass
- `completeCompanionEggIncubation({ force: true })`: pass
- `setSelectedCompanion(id)`: pass
- `upgradeCompanion(id, 'range')`: pass
- `upgradeCompanion(id, 'effect')`: pass
- `setSelectedCompanion(null)`: pass
- Reload from the same storage: pass

## Smartphone width QA

Viewport: `390x844`

Screens checked:

- No-owned home: companion panel hidden, home UI usable.
- Research unknown tab: `???` tab visible; copy stayed within the panel.
- All-owned home: companion panel displayed below the logo and did not cover the main dinosaur.
- Companion selection modal:
  - Page `1/2` displayed owned cards and `選択`.
  - Page `2/2` displayed `rex_hatchling` as `セット中`.
  - `セット解除` button was visible.
- Research companion owned view:
  - Three owned rows per page visible.
  - `強化` buttons visible.
  - Page indicator visible.
- Upgrade item selection:
  - `移動範囲`, `効果`, and `速度` cards were visible.
  - Descriptions and DNA costs fit inside the cards.
  - `キャンセル` button was visible and worked.

App console error/warn: `0`.

## Controller / virtual mouse QA

Confirmed:

- Pointer/touch style operations can open the companion modal from the home panel.
- Companion selection modal can page between owned companions.
- Companion selection modal can be closed by the on-screen close area.
- Research companion tab can switch to the owned companion view.
- Upgrade item selection modal can be opened.
- Upgrade item selection modal can be closed with the on-screen `キャンセル` button.

Not confirmed:

- Physical controller hardware was not available.
- `Escape` did not close the upgrade item selection modal in the browser smoke test. This is not a crash, but keyboard-only fallback is incomplete.

## High-load recheck

### ZERO maxSpawn

Route:

`debugIntroSeen=1&debugAutoPlay=1&debugPerformance=1&debugInvincible=1&debugMaxSpawn=1&debugNoPickupCollect=1&debugCompanionId=rex_hatchling&debugCompanionLevel=5&debugDino=spinosaurus&debugUnlockDino=spinosaurus&debugUnlockZeroRoute=spinosaurus_zero&debugStage=volcano&debugMode=zero&debugDifficulty=expert`

Observed:

- Elapsed: `03:01`
- FPS display: `120`
- enemy: `104/-`
- container children: about `130`
- `compFx`: `1/24`
- `compScan`: `e995/p0`
- Crash diagnostics screen: not shown
- App console error/warn: `0`

### ENDLESS maxSpawn

Route:

`debugIntroSeen=1&debugAutoPlay=1&debugPerformance=1&debugInvincible=1&debugMaxSpawn=1&debugNoPickupCollect=1&debugCompanionId=exp_chaser&debugCompanionLevel=5&debugDino=velociraptor&debugStage=jungle&debugMode=endless&debugDifficulty=expert`

Observed:

- Elapsed: `03:20`
- FPS display: `120`
- enemy: `112/-`
- container children: about `132`
- `compFx`: `0/24`
- `compScan`: `e0/p0`
- Crash diagnostics screen: not shown
- App console error/warn: `0`

Note:

- Tool-side Statsig networking errors appeared in the Node/browser-control output during ENDLESS wait chunks.
- The game tab dev log was checked separately and remained error/warn `0`.

## Checks

Mandatory command results:

- `node --check src/core/screen_manager.js src/data/companion_dinos.js src/save/save_manager.js src/scenes/play_scene.js src/ui/home_screen.js src/ui/research_screen.js`: pass
- `git diff --check`: pass
- `npm.cmd run build`: pass

Build note:

- Vite emitted the existing chunk-size warning for the main bundle. The build completed successfully.

## Main merge judgment

`main integration: hold`

Reason:

- The P07d performance blocker is mitigated in P07e high-load rechecks.
- However, the strict P07e release gate still has two incomplete product-quality verification items:
  1. Full no-debug natural egg drop -> hatch -> set -> upgrade -> restart flow was not completed in a clean browser save.
  2. Physical controller QA was not available; only virtual pointer/touch smoke was completed.

Recommended next step:

- Run one final manual QA on a clean browser/device save without debug parameters until egg acquisition, hatch, set, upgrade, unset, and restart restore are confirmed.
- Run one physical controller pass for companion selection, research companion tab, upgrade item selection, confirm/cancel, and modal close behavior.
- If those pass without new issues, the branch can be reconsidered for `main integration: pass`.
