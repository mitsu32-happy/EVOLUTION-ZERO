# MVP-S02 Whiteout Reinvestigation

Date: 2026-06-10

## Scope

S01 reduced damage / CRITICAL text churn, but ZERO final-phase whiteout could still recur when enemies, projectiles, warning guides, EXP pickups, small effects, and audio events overlapped.

S02 focuses on additional high-density combat stability without changing combat difficulty numbers.

## Recurrent Risk Areas

The remaining high-risk areas after S01 were:

- adaptation projectile and small effect creation/destruction
- pickup burst / pickup popup creation/destruction
- stale Pixi children remaining in runtime containers after array cleanup
- high-density hazard and warning guide overlap during ZERO boss fights
- bursty low-priority SE playback during mass hits / pickups
- enemy spawn pacing needing a budget guard for future dense content

## Added Stabilization

- Combat Graphics/Sprite object pools were added for adaptation projectiles and small effects.
- Pickup burst and pickup popup displays now use local pools.
- Emergency load shedding now uses FPS estimate, total runtime object pressure, and container children totals.
- Under load, non-critical damage text, EXP popup text, pickup burst visuals, and small effects can be temporarily thinned.
- Boss hazard overlap is reduced only during active load shedding.
- Spawn budget throttling smooths enemy creation and prevents future burst-style spawning from creating too many enemies in one short window.
- Stale child cleanup removes display objects that are no longer referenced by runtime arrays.
- Audio load shedding raises cooldowns / lowers max instances for low-priority hit and pickup SE.

## Debug Performance Additions

`debugPerformance=1` now exposes:

- load shedding level
- total container children
- spawn budget
- projectile / hazard / effect / damage / pickup counts
- active audio element and buffer counts
- object caps and invalid cleanup counts

## QA Routes

Primary:

```text
?debugIntroSeen=1&debugAutoPlay=1&debugPerformance=1&debugStage=volcano&debugMode=zero&debugDifficulty=expert&debugDino=spinosaurus&debugUnlockDino=spinosaurus&debugUnlockZeroRoute=spinosaurus_zero&debugZeroFinalBoss=1
```

Secondary:

```text
?debugIntroSeen=1&debugAutoPlay=1&debugPerformance=1&debugStage=volcano&debugMode=zero&debugDifficulty=expert&debugDino=spinosaurus&debugUnlockDino=spinosaurus&debugUnlockZeroRoute=spinosaurus_zero&debugZeroBoss=1
```

## Notes

S02 still preserves gameplay state and reward state. Load shedding reduces low-priority visuals and low-priority SE, not damage, EXP, boss state, or progression rewards.

## S02 QA Result

- ZERO final-boss route was soaked for about 120 seconds with `debugAutoPlay=1` and `debugPerformance=1`; after reconnect the tab retained the `EVOLUTION ZERO` title and reported 0 app runtime error / warn entries.
- ZERO second-boss route was soaked for 90 seconds with `debugAutoPlay=1` and `debugPerformance=1`; app runtime error / warn count was 0.
- NORMAL jungle and ENDLESS jungle were smoke-tested for 15 seconds each; app runtime error / warn count was 0.
- The browser automation environment emitted external Statsig network errors during two checks, but the inspected app tab logs returned 0 error / warn entries.
