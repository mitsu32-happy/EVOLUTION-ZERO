# Z04-05 ruins ZERO Reward

## Scope

Z04-05 connects the `ruins` ZERO clear reward.

Out of scope:

- main merge / push
- version or news updates
- ZERO evolution research cards
- new six ZERO route rewards
- new stages

## Policy Revision

The earlier Z04-01 to Z04-04 research-card proposal is not adopted.

ZERO evolutions continue to use the existing direct ZERO clear reward model:

| ZERO route | Reward route |
| --- | --- |
| `jungle` ZERO clear | `velociraptor_zero` |
| `volcano` ZERO clear | `triceratops_zero` |
| `swamp` ZERO clear | `tyrannosaurus_zero` |
| `ruins` ZERO clear | `spinosaurus_zero` |

## Implemented Reward

Updated file:

- `src/save/save_manager.js`

Change:

- Added `ruins: 'spinosaurus_zero'` to `ZERO_ROUTE_REWARD_BY_STAGE`.

Effect:

- First `ruins` ZERO clear writes `unlockedZeroRoutes.spinosaurus_zero`.
- First `ruins` ZERO clear mirrors the route into `discoveredEvolutions.spinosaurus_zero`.
- Result UI can use the existing `newEvolutionRoute` flow.
- Codex and evolution selection can use the existing route-unlock checks.

## Save Compatibility

Old saves can exist in this intermediate state:

```text
stageProgress.ruins.zero.cleared === true
unlockedZeroRoutes.spinosaurus_zero missing
```

Z04-05 adds a normalize-time backfill for this case only.

Backfill rules:

- If a stage ZERO clear flag is true and the mapped ZERO route is missing, add the mapped route.
- `ruins` backfills only to `spinosaurus_zero`.
- Uncleared `ruins` saves do not unlock `spinosaurus_zero`.
- New six ZERO routes are not backfilled.

The backfill is persisted on load when needed.

## New Six ZERO Routes

These remain locked in Z04-05:

- `ankylosaurus_zero`
- `parasaurolophus_zero`
- `stegosaurus_zero`
- `pteranodon_zero`
- `compsognathus_zero`
- `ornithomimus_zero`

Planned direction:

- Stage 5 ZERO -> one new ZERO route
- Stage 6 ZERO -> one new ZERO route
- Stage 7 ZERO -> one new ZERO route
- Stage 8 ZERO -> one new ZERO route
- Stage 9 ZERO -> one new ZERO route
- Stage 10 ZERO -> one new ZERO route

Exact assignment remains future design work.

## QA Result

Local save tests:

- `jungle` ZERO clear -> `velociraptor_zero`: pass.
- `volcano` ZERO clear -> `triceratops_zero`: pass.
- `swamp` ZERO clear -> `tyrannosaurus_zero`: pass.
- `ruins` ZERO clear -> `spinosaurus_zero`: pass.
- Old save with `stageProgress.ruins.zero.cleared === true` backfills `spinosaurus_zero`: pass.
- Old save with `stageProgress.ruins.zero.cleared === false` does not unlock `spinosaurus_zero`: pass.
- New six ZERO routes remain locked after ruins reward test: pass.

Runtime QA:

- Browser smoke with `debugUnlockZeroRoute=spinosaurus_zero` confirmed `spinosaurus_zero` appears as the Spinosaurus ZERO branch candidate.
- Runtime console error/warn: 0.
- Full clear-result screen and codex route QA should be rechecked in Z04-06 full route QA.

## Remaining Work

Z04-06 should perform full route QA:

- Clear `ruins` ZERO through the result screen.
- Confirm result route-unlock display.
- Confirm Codex display.
- Confirm `spinosaurus` can choose `spinosaurus_zero` when Lv/adaptation requirements are met.
- Confirm new six ZERO routes remain locked.
