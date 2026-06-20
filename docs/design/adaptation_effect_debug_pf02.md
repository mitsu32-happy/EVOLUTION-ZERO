# PF02 Adaptation Effect Debug Counters

## Scope

PF02 adds instrumentation for adaptation-skill effect rendering. It does not change effect visuals, effect balance, fallback behavior, load-shedding thresholds, difficulty, stages, version, or update news.

Branch:

- `feature/adaptation-effect-performance-v1`

## Added Counters

Counters are collected per adaptation skill in `CombatSystem`.

For each skill:

- `textureEffectCount`
  - Number of adaptation visual/projectile/effect views spawned with a texture.
- `graphicsFallbackCount`
  - Number of adaptation views that fell back to Graphics because no renderable texture was available.
- `skippedEffectCount`
  - Number of adaptation visual spawns skipped by `shouldShedSmallEffect()`.
- `missingTextureCount`
  - Number of Graphics fallback spawns where an effect key was expected.
- `pooledEffectReuseCount`
  - Number of adaptation views pulled from the `Sprite` / `Graphics` pools.
- `newEffectCreateCount`
  - Number of adaptation views that required a new `Sprite` / `Graphics` allocation.
- `loadSheddingEffectCount`
  - Number of adaptation effect spawns that happened while performance pressure was active.
- `loadSheddingSkippedCount`
  - Number of skipped adaptation effects while performance pressure was active.

The counter object is available through:

- `CombatSystem.getPerformanceStats().adaptationEffects`

Shape:

```js
{
  totals: {
    textureEffectCount,
    graphicsFallbackCount,
    skippedEffectCount,
    missingTextureCount,
    pooledEffectReuseCount,
    newEffectCreateCount,
    loadSheddingEffectCount,
    loadSheddingSkippedCount,
  },
  bySkill: {
    [skillId]: { ...same counters },
  },
  topOffenders: [
    {
      skillId,
      graphicsFallbackCount,
      skippedEffectCount,
      missingTextureCount,
      loadSheddingSkippedCount,
    },
  ],
}
```

## Instrumented Spawn Paths

The counters cover these adaptation-specific paths:

- `spawnAdaptationSpriteEffect()`
- `spawnAdaptationAreaEffect()`
- `spawnHomingFangProjectile()`
- `spawnDelayedBurstProjectile()`
- `spawnSenseSpikeTrap()`
- adaptation fallback calls through `spawnSlashEffect()`

This covers all 9 runtime adaptation skills:

- `afterimage_claw`
- `gale_blade`
- `accelerated_blades`
- `homing_fang`
- `sense_spike`
- `predator_marking`
- `shock_roar_wave`
- `burst_fang`
- `flame_breath`

## debugPerformance Display

When `debugPerformance=1` is active, the performance overlay now includes:

```text
adaptFx tex <texture> / gfx <graphics> / skip <skipped> / miss <missing>
adaptTop <skillId> g<graphics>/s<skipped>/m<missing>, ...
```

Example:

```text
adaptFx tex 120 / gfx 8 / skip 3 / miss 2
adaptTop gale_blade g5/s0/m5, sense_spike g1/s3/m1
```

The overlay was kept compact to avoid covering the playfield more than necessary.

## Dump Additions

`PlayScene.buildPerformanceSnapshot()` now includes:

- `adaptationEffects.totals`
- `adaptationEffects.bySkill`
- `adaptationEffects.topOffenders`

This means existing dumps such as:

- `EVOLUTION_ZERO_PERF_DUMP`
- whiteout/performance snapshots using `buildPerformanceSnapshot()`

can identify which adaptation skill caused:

- texture use
- Graphics fallback
- missing texture fallback
- skipped effect spawns
- load-shedding-time effect activity

## QA Result

Static checks:

- `node --check src/systems/combat_system.js`
- `node --check src/scenes/play_scene.js`
- `git diff --check`
- `npm.cmd run build`

Runtime smoke:

- `debugPerformance=1`
- `debugAdaptationSkills=1`
- `debugAdaptationAllLevel=3`
- representative PlayScene launch with `velociraptor`

Expected runtime behavior:

- `adaptFx` appears in the debug overlay.
- `adaptTop` appears only when there is fallback / skip / missing activity.
- console error/warn remains 0.

## PF03 Priority

PF03 should use the new counters in high-load sessions and fix the top offenders in this order:

1. Skills with high `missingTextureCount`.
2. Skills with high `graphicsFallbackCount`.
3. Skills with high `loadSheddingSkippedCount`.
4. Skills with high `newEffectCreateCount` and low pool reuse.

Likely initial focus based on PF01 structure:

1. `sense_spike`
2. `burst_fang`
3. `gale_blade`
4. `accelerated_blades`
5. `flame_breath`

No PF03 visual changes should be made until a high-load run confirms actual top offenders with these counters.
