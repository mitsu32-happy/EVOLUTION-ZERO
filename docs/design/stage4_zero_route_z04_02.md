# Z04-02 Stage 4 ZERO Route

## Scope

Z04-02 adds the basic `ruins` ZERO route gate and boot path. It does not add dedicated bosses, generated assets, route-specific rewards, version/news updates, or main merge/push.

## Route Definition

`ruins` is now treated as a production ZERO route candidate.

The implementation keeps the existing mode model:

- stage: `ruins`
- mode: `zero`
- difficulty: `expert`

No new stage ID is introduced.

## Unlock Condition

Production unlock condition:

```text
ruins EXPERT clear
+
jungle ZERO clear
+
volcano ZERO clear
+
swamp ZERO clear
```

Reasoning:

- `ruins` is the 4th stage and should remain an endgame route.
- Requiring existing public ZERO clears avoids unlocking it immediately after one EXPERT clear.
- This keeps the 4th ZERO route aligned with the current progression ladder.

Debug bypass:

```text
debugAllowRuinsZero=1
```

This remains available for QA without changing save data.

## Stage Select Display

Updated file:

- `src/ui/stage_select_screen.js`

Changes:

- `ruins` ZERO is no longer displayed only as "future update".
- If `ruins` EXPERT is not cleared, the lock reason is:
  - `ruins ZEROは遺跡EXPERTクリアで解放条件追加`
- If `ruins` EXPERT is cleared but existing ZERO routes are incomplete, the lock reason is:
  - `ruins ZEROは既存ZERO3種クリアで解放`
- If all conditions are met, ZERO can be selected like the other stages.
- `debugAllowRuinsZero=1` keeps the route selectable for QA.

## SaveManager Save Specification

Updated file:

- `src/save/save_manager.js`

Changes:

- Added `RUINS_ZERO_REQUIRED_ZERO_STAGES = ['jungle', 'volcano', 'swamp']`.
- `isDifficultyUnlocked('ruins', 'zero')` now uses the dedicated ruins ZERO condition instead of returning `false`.
- Added `isRuinsZeroUnlocked(progress)`.
- Added `getRuinsZeroUnlockState()`.

Save compatibility:

- No new required save key was added.
- Existing save files already normalize `stageProgress.ruins.zero`.
- Missing old save entries are still filled by `normalizeStageProgress()`.

Clear state:

- A successful ruins ZERO run records into existing:

```text
stageProgress.ruins.zero
```

Research groundwork:

- `getRuinsZeroUnlockState().zeroResearchAvailable` returns true after:

```text
stageProgress.ruins.zero.cleared === true
```

Z04-05 can use this to reveal ZERO evolution research cards.

## PlayScene Boot Path

Updated file:

- `src/scenes/play_scene.js`

Changes:

- `applyRuinsZeroPreReleaseLock()` no longer blocks all `ruins` ZERO production runs.
- It now allows the route if `saveManager.isDifficultyUnlocked('ruins', 'zero')` is true.
- It still falls back to standard EXPERT when conditions are missing.
- `debugAllowRuinsZero=1` remains a bypass.

Current boss behavior:

- Z04-02 does not implement dedicated `ruins` ZERO bosses.
- Phase 1 uses the scaled ruins boss.
- Phase 2 currently follows the existing fallback behavior.
- Phase 3 currently follows the existing generic ZERO fallback (`zero_eclipse_protocol`).
- Dedicated bosses and assets are deferred to Z04-03/Z04-04.

## ZERO Reward Research Groundwork

Z04-02 intentionally does not unlock:

- `spinosaurus_zero`
- `ankylosaurus_zero`
- `parasaurolophus_zero`
- `stegosaurus_zero`
- `pteranodon_zero`
- `compsognathus_zero`
- `ornithomimus_zero`

Instead, ruins ZERO clear provides a reliable state for later research cards:

```text
SaveManager.getRuinsZeroUnlockState().zeroResearchAvailable
```

Z04-05 should add DNA research items that individually unlock `unlockedZeroRoutes.<routeId>`.

## Existing ZERO Impact

The existing three ZERO routes remain unchanged:

- `jungle` ZERO still unlocks through jungle EXPERT clear.
- `volcano` ZERO still unlocks through volcano EXPERT clear.
- `swamp` ZERO still unlocks through swamp EXPERT clear.
- Existing route rewards are unchanged.

## QA Result

Static / unit-style checks:

- SaveManager ruins ZERO unlock condition was validated with a memory-storage instance.
- `ruins` ZERO stays locked when `ruins` EXPERT is missing.
- `ruins` ZERO stays locked when existing ZERO3 clears are incomplete.
- `ruins` ZERO unlocks when `ruins` EXPERT and all three existing ZERO clears are present.
- `stageProgress.ruins.zero` exists through save normalization.
- `zeroResearchAvailable` becomes true when `stageProgress.ruins.zero.cleared` is true.

Build checks:

- `node --check` target JS.
- `git diff --check`.
- `npm.cmd run build`.

Runtime QA:

- `debugAllowRuinsZero=1` ruins ZERO browser boot smoke.
- Existing jungle ZERO browser boot smoke.
- Runtime console error/warn: 0.

## Next Handoff

### Z04-03

- Generate ruins ZERO background / thumbnail.
- Generate ruins ZERO boss and effect assets.
- Add contact sheets and asset reports.

### Z04-04

- Add dedicated ruins ZERO phase 2 and final boss configs.
- Add stage-specific ZERO hazard variants.
- Tune warning visibility and effect count.

### Z04-05

- Add ZERO evolution research cards.
- Connect research card purchase to individual `unlockedZeroRoutes`.
- Add result/codex/research QA.
