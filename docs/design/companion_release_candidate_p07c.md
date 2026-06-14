# MVP-P07c Companion Dino release candidate QA

Date: 2026-06-14
Branch: `feature/companion-dino-p01`
Target: Companion Dino main merge readiness
Version observed in crash diagnostics: `0.9.13`
Build observed in crash diagnostics: `hotfix-intro-audio-safari`

## Scope

P07c is a release-candidate QA pass for Companion Dino. No new feature work was performed. The purpose is to decide whether the current feature branch can be merged to `main`.

Main merge/push was not performed.

## Environment

- Local app: `http://127.0.0.1:5176/EVOLUTION-ZERO/`
- Browser: Codex in-app browser
- Branch: `feature/companion-dino-p01`
- Console collection: in-app browser dev logs
- Stress debug routes used only for high-density stability checks

Tool-side Codex/Statsig network messages appeared during one browser automation run, but browser dev logs for the game tab were checked separately and did not contain app runtime errors/warnings for the successful routes.

## QA Summary

| Area | Result | Notes |
| --- | --- | --- |
| New-save equivalent state smoke | Partial pass | Title/home/companion state routes opened without app console errors. Full natural egg drop to hatch flow was not fully completed without debug shortcuts in this pass. |
| Existing-save equivalent | Partial pass | Companion normalization paths and legacy-like state routes did not crash. A real pre-Companion player save was not available in this pass. |
| Companion state coverage | Pass | No owned, egg held, hatch ready, all owned, selected, unset, and multi-owned states were checked by debug-equivalent routes. |
| 10 companion play smoke | Pass | All 10 companions entered PlayScene without app console errors/warnings. |
| Multi-owned UI | Pass | Selection modal page 1/2 and 2/2 displayed owned cards; selected card showed `セット中`; unselected cards showed `選択`. Research companion pages displayed multiple owned companions and `強化` buttons. |
| ENDLESS soak | Partial pass | High-load ENDLESS route remained active to about 2:06 with no crash and app console errors/warnings 0. Full 3-5 minutes was interrupted by tool timeout/reset. |
| ZERO soak | Fail | High-load ZERO route reached the crash diagnostics screen at elapsed 144.02s with `Game loop stalled for 2535ms`. |
| Smartphone UI | Partial pass | Recent companion UI screens were checked visually in the current browser, but a dedicated mobile viewport RC pass was not completed in P07c. |
| Controller / virtual mouse | Partial pass | Recent focus behavior for pointer vs controller was fixed before P07c. A physical controller RC pass was not completed. |

## New Save Equivalent QA

Routes checked:

- `?debugIntroSeen=1&debugCompanionClear=1`
- `?debugIntroSeen=1&debugCompanionEgg=1`
- `?debugIntroSeen=1&debugCompanionHatchReady=1`
- `?debugIntroSeen=1&debugCompanionAllOwned=1&debugSelectCompanion=rex_hatchling`

Observed:

- Title to home did not show the crash diagnostics screen.
- Canvas was present.
- App console errors/warnings: 0.
- Companion no-owned, egg, hatch-ready, all-owned, and selected states did not crash.

Release note:

- This confirms state initialization and major screen entry points, but does not fully replace a no-debug natural drop/hatch/restart run.

## Existing Save Compatibility QA

Observed:

- Companion state normalization handled missing/derived companion states in debug-equivalent routes.
- Home and research screens did not crash in companion-clear and companion-owned routes.
- No save-destructive behavior was observed.

Risk:

- A real legacy player save from before Companion Dino was not available in this pass.
- Before `main`, run one backup/restore QA with an actual production-like localStorage payload.

## Companion State QA

| State | Result | Notes |
| --- | --- | --- |
| Unowned | Pass | Home opened without companion panel crash; unknown research state route did not crash in prior P06d/P06e checks. |
| Egg only | Pass | Egg-held route opened without app console errors/warnings. |
| Hatch ready | Pass | Hatch-ready route opened without app console errors/warnings. |
| Owned / selected | Pass | `rex_hatchling` selected route opened and displayed companion UI. |
| Unset | Pass | Recent unset route did not crash after P06f hotfixes. |
| Multi-owned | Pass | Selection modal and research owned pages handled multiple companions. |
| All-owned | Pass | All-owned route did not crash; duplicate/alternative reward path remains a separate full-flow QA item. |

## 10 Companion PlayScene Smoke

Each companion was launched with:

`debugIntroSeen=1&debugAutoPlay=1&debugCompanionId=<id>&debugCompanionLevel=5&debugDino=velociraptor&debugStage=jungle&debugDifficulty=normal`

| Companion | Result |
| --- | --- |
| `raptorling` | Pass |
| `spino_pup` | Pass |
| `medic_saur` | Pass |
| `ptera_chick` | Pass |
| `tricera_calf` | Pass |
| `para_juvenile` | Pass |
| `stego_calf` | Pass |
| `rex_hatchling` | Pass |
| `compy_pack` | Pass |
| `exp_chaser` | Pass |

Observed:

- Crash diagnostics screen: not shown.
- App console errors/warnings: 0.
- Companion animation/effect/movement smoke was sufficient for PlayScene entry, but this pass did not re-score final art quality frame-by-frame.

## Long Soak QA

### ZERO

Route:

`?debugIntroSeen=1&debugAutoPlay=1&debugPerformance=1&debugInvincible=1&debugMaxSpawn=1&debugNoPickupCollect=1&debugCompanionId=rex_hatchling&debugCompanionLevel=5&debugDino=spinosaurus&debugUnlockDino=spinosaurus&debugUnlockZeroRoute=spinosaurus_zero&debugStage=volcano&debugMode=zero&debugDifficulty=expert`

Result: Fail

Crash diagnostics screen appeared.

Captured diagnostics:

- Screen: `play`
- Stage: `volcano`
- Difficulty: `expert`
- Elapsed Time: `144.02`
- WebGL context lost: `no`
- enemyCount: `104`
- projectileCount: `0`
- bossProjectileCount: `0`
- hazardCount: `0`
- warningGuideCount: `0`
- effectCount: `1`
- damageTextCount: `5`
- criticalTextCount: `0`
- pickupCount: `0`
- containerChildrenTotal: `127`
- loadShedding: `0`
- Error: `Game loop stalled for 2535ms`

Classification: A - main integration blocker.

Reason:

- P07c requires ZERO stability for 3-5 minutes.
- The game entered the crash diagnostics screen during a high-density ZERO route before the required duration.
- Even though WebGL context was not lost and app console logs were otherwise clean, the ticker stall guard treated the run as fatal.

### ENDLESS

Route:

`?debugIntroSeen=1&debugAutoPlay=1&debugPerformance=1&debugInvincible=1&debugMaxSpawn=1&debugNoPickupCollect=1&debugCompanionId=exp_chaser&debugCompanionLevel=5&debugDino=velociraptor&debugStage=jungle&debugMode=endless&debugDifficulty=expert`

Result: Partial pass

Observed after recovery and continued wait:

- Elapsed observed around `02:06`
- Crash diagnostics screen: not shown
- App console errors/warnings: 0
- FPS display: `120`
- container children: `131`
- enemy count display: `112/-`
- damage text active: `3`
- pickup count: `0`
- audio count: `0`

Risk:

- A full uninterrupted 3-5 minute ENDLESS soak still needs to be rerun after the ZERO stall issue is addressed.

## Smartphone UI QA

Current result: Partial

Recently checked screens:

- Home companion panel
- Companion selection modal
- Research companion owned view
- Upgrade item selection modal

Known recent fixes before P07c:

- Pointer/touch opening no longer shows controller-only focus frame.
- Multi-owned cards show `セット中` / `選択`.
- Research owned rows show `強化`.

Risk:

- A dedicated smartphone viewport pass for all P07c required screens was not completed in this pass.

## Controller / Virtual Mouse QA

Current result: Partial

Known recent fixes before P07c:

- Upgrade selection focus is hidden for pointer/touch input.
- Focus is reserved for controller/D-pad navigation.

Risk:

- A physical controller or full virtual-mouse release-candidate pass was not completed in this pass.

## Issues

### A: Main integration blocker

1. ZERO high-load route enters crash diagnostics screen.

   - Error: `Game loop stalled for 2535ms`
   - WebGL context lost: `no`
   - Elapsed: `144.02`
   - Impact: Fails required ZERO 3-5 minute stability check.
   - Recommended next step: create a focused stability task to inspect ticker stall thresholds, expensive per-frame loops, and high-load debugMaxSpawn behavior with Companion enabled.

### B: Fix recommended before release judgment

1. Complete no-debug natural flow QA.

   Required: egg drop, result, research hatch, set, upgrade, restart persistence without debug shortcuts.

2. Complete real legacy save QA.

   Required: backup production-like save, load on branch, add Companion data, restart, verify old progress remains intact.

3. Complete smartphone viewport QA.

   Required: home, research, selection, hatch, upgrade, tutorials.

4. Complete controller / virtual mouse QA.

   Required: no trapped modal, tab/subtab switching, hatch and upgrade actions.

### C: Future items

- Continue visual polish only after stability passes.
- Co-evolution and additional companion systems remain out of scope.

## Fixes Performed In P07c

No code fixes were performed in P07c. This pass is recorded as QA and release judgment only.

## Main Integration Decision

`main統合保留`

Reason:

- ZERO high-load soak produced a crash diagnostics screen before the required 3-5 minute window.
- P07c completion criteria require crash-free ZERO/ENDLESS stability and runtime console error/warn 0.
- Although Companion state UI and 10-companion PlayScene smoke checks passed, the ZERO stall is a release blocker.

## Conditions To Reconsider Main Integration

1. Fix or reclassify the ZERO `Game loop stalled for 2535ms` failure with evidence.
2. Rerun ZERO 3-5 minute soak with Companion enabled and no crash diagnostics screen.
3. Rerun ENDLESS 3-5 minute soak without tool interruption if possible.
4. Complete no-debug natural new-save flow.
5. Complete real or production-like existing-save compatibility QA.
6. Complete smartphone viewport QA.
7. Complete controller / virtual mouse QA.
8. Run mandatory checks successfully.

## P07d follow-up

P07d addressed the ZERO performance blocker found in this document.

Summary:

- The original `Game loop stalled for 2535ms` snapshot had low object counts and no WebGL context loss.
- The debug ticker-stall guard now records a single `>2500ms` heartbeat gap without immediately showing the crash screen.
- Severe or repeated stalls still show crash diagnostics.
- Companion target acquisition now uses short cache intervals and single-pass selection instead of per-frame temporary arrays and sorting.
- `debugPerformance` now exposes `compFx` and `compScan` in the body summary.
- ZERO high-load with `rex_hatchling` survived beyond the previous failure point, reaching `t=226.87` with app console error/warn `0`.
- ENDLESS high-load with `exp_chaser` also passed a post-hotfix 100s route with app console error/warn `0`.

P07e follow-up:

- Evidence: `docs/design/companion_release_final_qa_p07e.md`
- ZERO maxSpawn with `rex_hatchling` reached `03:01` with app console error/warn `0` and no crash diagnostics screen.
- ENDLESS maxSpawn with `exp_chaser` reached `03:20` with app console error/warn `0` and no crash diagnostics screen.
- Existing-save compatibility was verified through SaveManager using missing companion state, legacy `levels` only, partial `upgradeLevels`, egg-discovery backfill, null selected companion, invalid selected id, and over-max legacy level cases.
- Smartphone viewport QA at `390x844` covered home, unknown research tab, all-owned companion selection modal, companion research owned list, and upgrade item selection.
- Virtual pointer/touch QA confirmed modal open/page/cancel flows. `Escape` did not close the upgrade item modal, and physical controller hardware was not available.
- No-debug title -> intro skip -> START -> home was verified with app console error/warn `0`, but a full clean no-debug egg drop -> hatch -> set -> upgrade -> restart flow was not completed in the browser.
- Updated judgment: `main integration: hold`. P07d performance blocker is mitigated; remaining hold reasons are full clean no-debug natural egg/hatch flow and physical controller QA.

Updated judgment:

- The specific P07c ZERO high-load blocker is considered mitigated by P07d.
- The overall `main統合保留` decision remains until the remaining P07c non-performance QA items are completed: natural no-debug flow, production-like existing save compatibility, smartphone viewport QA, and controller / virtual mouse QA.
