# PF04b performance load reduction

## Goal

Reduce endgame iPhone heat and whiteout risk without degrading adaptation effects into simple graphics.

## Implemented

### Enemy visual budget

High-load scenes now apply a visual-only enemy budget:

- Internal enemy existence remains unchanged.
- HP, collision, drops, damage, and AI remain active.
- Only the enemy view render/update path is reduced.

The visual budget activates only under pressure:

- `thermalSafetyLevel >= 1`
- `performanceLoadSheddingLevel >= 1`
- debug stress pressure
- high enemy count
- high container child pressure

### Overlap culling

When enabled, enemies in the same small world cell with the same enemy type and similar radius keep only the first two rendered views. Later overlapping views are set `renderable=false`.

Protected enemies are never culled:

- projectile/electro/summon ability enemies
- high-level enemies
- low-HP enemies
- dead enemies during cleanup/death animation

### Offscreen render and animation throttling

Enemies far outside the camera margin can set `renderable=false` under pressure. Near-offscreen enemies keep rendering but skip some animation/draw updates.

### Debug counters

`debugPerformance=1` now shows:

```text
enemyCull c{overlap}/o{offscreen}/a{animationThrottle}
```

The same counters are included in performance snapshots and whiteout dumps as `enemyVisualBudget`.

## Not implemented

- Enemy count reduction: rejected because it changes difficulty.
- Adaptation simple Graphics fallback: rejected because it directly worsens visual quality.
- Full target-scan rewrite: deferred because it is higher risk and needs a focused PF05 pass.
- Compsognathus miniPack: remains design-only because it adds actors during a performance hardening pass.

## Expected effect

The largest benefit should appear when many enemies are packed together or far offscreen. It reduces display work and animation churn while preserving gameplay simulation.

## QA focus

- Overlapped enemies should not appear to vanish unnaturally.
- Collision, damage, drops, and attacks must continue for culled enemies.
- `culledEnemySprites` / `offscreenRenderCulled` should increase only under high load.
- Runtime console error/warn count must remain 0.
