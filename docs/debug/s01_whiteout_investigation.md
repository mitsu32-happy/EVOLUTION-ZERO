# MVP-S01 Whiteout Investigation

Date: 2026-06-10

## Scope

MVP-S01 investigates the ZERO late-game whiteout / full-stop risk around the second ZERO boss and final boss where enemies, pickups, damage numbers, CRITICAL text, boss hazards, and effects can all spike at the same time.

This pass intentionally avoids difficulty tuning. The goal is to keep combat pressure while preventing one overloaded subsystem from stopping the game loop.

## Likely Failure Pattern

No single deterministic stack trace was available at the start of this pass, but the high-risk path is clear from the runtime object graph:

- Adaptation skills and synergies can generate many damage numbers and CRITICAL text entries in a short interval.
- Heavy enemy waves can leave many EXP pickups on the field.
- ZERO boss phases can add stage gimmicks / warning sprites while normal combat effects continue.
- Repeated `new Text` / `destroy` churn for damage output is expensive during high-kill bursts.
- If a destroyed or invalid display object remains in an update array, a later update can stop the scene.

## Instrumentation Added

Use:

```text
?debugPerformance=1
```

The overlay shows:

- FPS estimate
- enemy count
- enemy projectile count
- combat projectile count
- boss hazard / stage gimmick count
- combat effect count
- active damage text count
- free damage text pool count
- pickup count
- active audio count

The same values are also published to:

- `window.__EVOLUTION_ZERO_RUN_DEBUG_STATS__`
- `#app.__EVOLUTION_ZERO_RUN_DEBUG_STATS__`

## Stabilization Changes

- Damage / CRITICAL text now uses a bounded object pool instead of creating and destroying a `Text` object for every hit.
- Active damage text and CRITICAL text still have explicit simultaneous display caps.
- World EXP pickup cap now merges trimmed EXP value into an existing EXP pickup when possible, reducing display load without silently deleting reward value.
- Enemy, boss, enemy projectile, and stage gimmick update loops now remove invalid entries before they can break the update loop.
- Invalid-entry removals are counted in the debug performance stats instead of written to normal console output.

## Object Caps

Current runtime caps:

- enemy projectiles: 56
- boss hazards / stage gimmicks: 34
- combat projectiles: 52
- combat effects: 96
- damage numbers: 86
- CRITICAL damage numbers: 24
- damage number pool: 64
- pickup bursts: 48
- pickup popups: 40
- world pickups: 180

## Verification Notes

Primary QA route:

```text
?debugIntroSeen=1&debugAutoPlay=1&debugPerformance=1&debugStage=volcano&debugMode=zero&debugDifficulty=expert&debugDino=spinosaurus&debugUnlockDino=spinosaurus&debugUnlockZeroRoute=spinosaurus_zero&debugZeroBoss=1
```

Expected result:

- ZERO second-boss runtime continues without whiteout.
- BGM/SE do not stop.
- Damage and CRITICAL display remains bounded.
- Pickup count remains bounded.
- `runtime console error / warn` remains 0.

## S01 QA Result

- ZERO second-boss route was soaked for 75 seconds with `debugAutoPlay=1` and `debugPerformance=1`.
- ZERO final-boss route was soaked for 45 seconds with `debugAutoPlay=1` and `debugPerformance=1`.
- Browser runtime console error / warn count: 0 for both routes.
- No whiteout or navigation loss was observed during the automated soak windows.
- Screenshot capture through the browser bridge timed out once after the second-boss soak, but the tab stayed alive, retained the `EVOLUTION ZERO` title, and still reported 0 runtime error / warn entries after reconnect.
- NORMAL jungle and ENDLESS jungle were also smoke-tested for 15 seconds each with `debugAutoPlay=1`; both reported 0 runtime error / warn entries.

## Deferred Work

- Pooling combat projectiles and stage gimmick warning sprites would further reduce allocation churn, but the first high-impact stabilization target is damage / CRITICAL text because it spikes with every multi-hit kill burst.
- A deeper Pixi object-lifecycle audit can be done before adding future high-density systems such as companion dinosaurs or co-evolution.
