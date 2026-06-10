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

Deferred pool candidates:

- small sprite effects
- adaptation projectiles
- warning guides
- pickup bursts

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

Runtime stats are also exposed through `window.__EVOLUTION_ZERO_RUN_DEBUG_STATS__` and `#app.__EVOLUTION_ZERO_RUN_DEBUG_STATS__` for browser automation.

## Audio Stability

Existing high-frequency hit and attack SE calls are throttled in play code and passed with small `maxInstances` values. Future high-density effects should use cooldown/max-instance options and avoid per-hit unique SE when multi-hit skills are active.
