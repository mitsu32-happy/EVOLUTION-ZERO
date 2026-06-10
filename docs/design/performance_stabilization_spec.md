# Performance Stabilization Spec

## MVP-S01 Runtime Stability Policy

Heavy combat scenes must remain playable even when enemy count, damage text, pickups, boss hazards, and effects spike at the same time.

Priority:

1. Do not crash or whiteout.
2. Do not stop the game loop because of one invalid runtime object.
3. Preserve late-game pressure and combat readability.
4. Prefer bounded reuse over repeated creation/destruction.

## Runtime Caps

The combat scene uses explicit simultaneous object caps for volatile runtime objects:

- enemy projectiles
- boss hazards / stage gimmicks
- combat projectiles
- combat effects
- damage / CRITICAL text
- pickup bursts
- pickup popups
- world pickups

When a cap is exceeded, the oldest low-priority display object is removed safely from its container and array.

EXP pickups are special: when the world pickup cap is exceeded, trimmed EXP value is merged into an existing EXP pickup when possible so the display load is reduced without losing reward value.

## Pooling

Damage number and CRITICAL text entries are pooled.

Lifecycle:

1. Acquire an inactive `Text` from the pool, or create one if the pool is empty.
2. Reconfigure text, style, position, duration, and visibility.
3. Return the entry to the pool when its lifespan ends or when caps require trimming.
4. Destroy only when the pool itself is full.

Pool target:

- damage / CRITICAL text
- adaptation projectile views
- small combat effect views
- pickup burst views
- pickup popup text

Deferred pool candidates:

- warning guides
- full boss hazard containers

## Game Loop Guards

Update loops for enemies, bosses, enemy projectiles, and stage gimmicks validate entries before updating them.

Invalid entries include:

- missing object
- destroyed view
- non-finite position
- non-finite projectile velocity / ttl
- broken gimmick duration values

Invalid entries are removed and counted in debug stats. They do not write normal console warnings because runtime QA requires zero console warnings/errors.

## Debug Performance Overlay

Use:

```text
?debugPerformance=1
```

The overlay shows:

- FPS estimate
- active enemy count
- projectile counts
- boss hazard / stage gimmick count
- effect count
- damage text count and pool free count
- pickup count
- audio instance count
- load shedding level
- total container children
- spawn budget
- audio buffer instance count

Runtime stats are also exposed through `window.__EVOLUTION_ZERO_RUN_DEBUG_STATS__` and `#app.__EVOLUTION_ZERO_RUN_DEBUG_STATS__` for browser automation.

## Audio Stability

Existing high-frequency hit and attack SE calls are throttled in play code and passed with small `maxInstances` values. Future high-density effects should use cooldown/max-instance options and avoid per-hit unique SE when multi-hit skills are active.

## MVP-S02 Emergency Load Shedding

S02 adds load shedding based on FPS estimate, runtime object count, and container children count.

When pressure rises:

- non-critical damage display can be thinned
- CRITICAL display can be lightly thinned only at the highest pressure
- EXP popup / pickup burst visuals can be skipped
- small combat effects can be skipped
- boss hazard overlap is temporarily reduced
- low-priority SE cooldowns and instance limits become stricter

Damage, EXP, boss state, and progression are not removed by load shedding.

## MVP-S02 Spawn Budget

Enemy spawning now uses a small budget bucket. This keeps current pacing effectively intact during normal play while preventing future dense content from spawning too many enemies within one short update window.

The budget is visible through `debugPerformance=1`.

## MVP-S03 Final Phase Hardening

S03 targets the remaining whiteout risk reported around the ZERO final phase.

Additional diagnostics:

- rolling performance snapshots are kept for recent combat state
- the latest snapshot and dump are saved to localStorage
- manual dump is available with F10 or `window.__EVOLUTION_ZERO_DUMP_PERF__()`
- `debugPerfTimeScale` can accelerate combat time only when `debugPerformance=1`
- `debugInvincible` and `debugMaxSpawn` can force a maximum-pressure soak route without changing normal play
- `debugMaxSpawn` disables outgoing player damage and pickup collection so stress tests preserve enemy pressure
- `debugStressKill` re-enables non-boss enemy damage after the enemy count reaches a threshold, while bosses remain invulnerable to prevent result flow from interrupting the test
- runtime error, unhandled rejection, WebGL context lost/restored, and ticker-stall suspicion are recorded

Snapshot keys:

- `EVOLUTION_ZERO_LAST_PERF_SNAPSHOT`
- `EVOLUTION_ZERO_PERF_SNAPSHOTS`
- `EVOLUTION_ZERO_PERF_DUMP`

New / strengthened caps and reuse:

- enemy projectile Graphics are pooled and capped
- UltimateSystem Graphics / Sprite effect views are pooled and capped
- UltimateSystem skips non-core visuals first when load shedding reaches the hard level
- ZERO final phase raises load shedding earlier than normal play
- boss hazard overlap is reduced sooner during ZERO final phase pressure
- warning guide drawing is capped under load while boss warnings are prioritized

The intent is to preserve damage, enemy behavior, rewards, and difficulty while reducing high-frequency drawing and allocation pressure.

If a future whiteout occurs, QA should record:

- URL and route
- `EVOLUTION_ZERO_PERF_DUMP`
- browser console error / warning count
- whether `diagnostics.contextLost`, `diagnostics.runtimeErrors`, or `diagnostics.tickerStalls` changed
