# MVP-S03 ZERO Final Phase Whiteout Investigation

Date: 2026-06-10

## Scope

S03 focuses on the recurring whiteout / complete-stop report in the ZERO final phase after S01/S02 stabilization. This pass does not change difficulty values or add gameplay features. It adds stronger diagnostics and reduces rendering/allocation pressure in the final phase.

## Reproduction Target

- Mode: ZERO
- Stage: volcano
- Difficulty: expert
- Timing: second boss through final boss
- Pressure source: high enemy density, boss hazards, warning guide drawing, UltimateSystem effects, damage / CRITICAL / pickup visuals, SE bursts

Suggested URL:

```text
?debugIntroSeen=1&debugAutoPlay=1&debugPerformance=1&debugPerfTimeScale=12&debugInvincible=1&debugMaxSpawn=1&debugStressKill=1&debugStage=volcano&debugMode=zero&debugDifficulty=expert&debugDino=spinosaurus&debugUnlockDino=spinosaurus&debugUnlockZeroRoute=spinosaurus_zero&debugZeroFinalBoss=1
```

## S03 Diagnostics Added

`debugPerformance=1` now records a rolling snapshot buffer and saves the latest data to `localStorage`.

Saved keys:

- `EVOLUTION_ZERO_LAST_PERF_SNAPSHOT`
- `EVOLUTION_ZERO_PERF_SNAPSHOTS`
- `EVOLUTION_ZERO_PERF_DUMP`

Manual dump:

- Press `F10`, or call `window.__EVOLUTION_ZERO_DUMP_PERF__()`.

QA stress route:

- Add `debugPerfTimeScale=12` with `debugPerformance=1` to advance combat time faster during local soak checks. This is a debug-only diagnostic route and does not affect normal play.
- Add `debugInvincible=1&debugMaxSpawn=1` to keep the player alive while forcing the spawn system toward its implemented cap.
- `debugMaxSpawn=1` also disables player outgoing damage and pickup collection, so the test can hold maximum enemy pressure without leveling, clearing enemies, or collecting items.
- Add `debugStressKill=1` when the enemy count should first build up, then release maximum player damage against non-boss enemies. Bosses stay invulnerable in this route so clear/result flow does not interrupt the pickup / damage display stress test.
- `debugNoPlayerDamage=1` and `debugNoPickupCollect=1` are available for narrower checks.

Snapshot fields:

- frameCount
- elapsedTime
- enemyCount
- projectileCount
- bossProjectileCount
- hazardCount
- warningGuideCount
- effectCount
- ultimateEffectCount
- damageTextCount
- criticalTextCount
- pickupCount
- containerChildren / containerChildrenTotal
- tickerDelta
- rawTickerDelta
- debugTimeScale
- debugStressKillEnabled
- debugStressKillThreshold
- loadSheddingLevel
- spawnBudget
- activeAudioCount / activeAudioBufferCount
- pool free counts
- staleCleanupCount
- invalidCleanupCount
- activeBoss
- runtime diagnostics

## Runtime / Renderer Capture

The PlayScene now records:

- `window.error`
- `unhandledrejection`
- WebGL `webglcontextlost`
- WebGL `webglcontextrestored`
- ticker stall suspicion while `debugPerformance=1`

When a context-lost or ticker-stall condition is detected, a small DOM fallback panel is shown and a performance dump is saved. This avoids a silent white canvas with no postmortem data.

## Likely Recurrent Pressure Points

S02 stabilized damage / CRITICAL / pickup displays, but S03 identified remaining allocation-heavy paths:

- UltimateSystem effects were still created and destroyed directly.
- enemy projectile graphics were still created and destroyed directly.
- final-phase warning guide drawing could still iterate and draw too many active hazards.
- ZERO final boss hazards could stay visually dense while the scene was already under load.

## S03 Stabilization

- UltimateSystem effect views are pooled.
- UltimateSystem active effect count is capped.
- high-load final-phase UltimateSystem effects skip non-core visuals first.
- enemy projectile graphics are pooled.
- enemy projectile cap trimming now returns views to the pool.
- final-phase load shedding activates earlier for ZERO phase 3.
- boss hazard overlap is reduced sooner under final-phase load.
- warning guide drawing prioritizes boss warnings and caps non-boss warning draw count under load.
- `debugPerformance=1` overlay now includes ultimate effect and enemy projectile pool state.

## Context Lost Status

S03 adds detection but does not yet prove WebGL context loss as the root cause. If the issue recurs, inspect `EVOLUTION_ZERO_PERF_DUMP` and the diagnostics fields:

- `diagnostics.contextLost`
- `diagnostics.runtimeErrors`
- `diagnostics.unhandledRejections`
- `diagnostics.tickerStalls`

## S03 QA Notes

Confirmed routes:

- ZERO final boss debug route with `debugPerfTimeScale=12`
- max-pressure route with `debugInvincible=1&debugMaxSpawn=1`
- stress-kill route with `debugStressKill=1`
- normal / endless smoke routes with `debugPerformance=1`

Observed in local QA:

- runtime console error / warning count: 0
- WebGL context lost count: 0
- runtime error count in performance diagnostics: 0
- ticker stall count in performance diagnostics: 0
- max-pressure route reached high enemy / pickup / container counts without whiteout
- stress-kill route switched to non-boss enemy kill phase and continued without observed whiteout

User visual QA:

- stress-kill phase was observed on screen and appeared to keep running normally.

## Remaining Follow-Up Candidates

- Pool full boss hazard containers if future content adds more complex hazard sprites.
- Add renderer GPU memory metrics if Pixi/browser exposes stable values.
- Add a compact in-game recovery screen that can return to title after context loss.
