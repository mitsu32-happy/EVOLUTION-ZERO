# PF01 Adaptation Effect Performance Review

## Scope

PF01 investigates why adaptation-skill effects can look like simplified Graphics under load, and defines the next implementation steps. This pass is intentionally design-only: no gameplay balance, effect strength, difficulty, stage, version, or news changes are included.

Branch:

- `feature/adaptation-effect-performance-v1`

Base:

- `main` / Version `0.11.0`
- Build `new-dinos-six-v1`

## Files Reviewed

- `src/data/adaptation_skills.js`
- `src/data/asset_manifest.js`
- `src/systems/combat_system.js`
- `src/systems/ultimate_system.js`
- `src/scenes/play_scene.js`
- `src/utils/asset_loader.js`
- `src/core/screen_manager.js`

## Current Effect Structure

Adaptation-skill definitions live in `src/data/adaptation_skills.js`.

There are 9 runtime adaptation skills:

| Skill | Tag | Runtime style | Main effect key | Extra / fallback keys |
| --- | --- | --- | --- | --- |
| `afterimage_claw` | speed | short arc slash bursts | `adaptationSkillEffects.afterimageClaw` | none |
| `gale_blade` | speed | spread projectile-like lane slashes | `adaptationSkillEffects.galeBladeSpread` | `fallbackEffectKey: galeBlade` |
| `accelerated_blades` | speed | area / orbit effect | `adaptationSkillEffects.acceleratedBlades` | none |
| `homing_fang` | hunting | homing projectile | `adaptationSkillEffects.homingFang` | none |
| `sense_spike` | hunting | placed traps + trigger burst | `adaptationSkillEffects.senseSpikeTrap` | `triggerEffectKey: senseSpikeTrigger`, `fallbackEffectKey: senseSpike` |
| `predator_marking` | hunting | per-target mark burst | `adaptationSkillEffects.predatorMarking` | none |
| `shock_roar_wave` | attack | cone wave | `adaptationSkillEffects.shockRoarWave` | none |
| `burst_fang` | attack | delayed mine + explosion | `adaptationSkillEffects.burstFangMine` | `explosionEffectKey: burstFangExplosion`, `fallbackEffectKey: burstFang` |
| `flame_breath` | attack | cone flame effect | `adaptationSkillEffects.flameBreath` | none |

All adaptation-skill effect keys are registered in `asset_manifest.js`, and the `battle` asset group includes `adaptationSkillEffects` and `adaptationSkillIcons`, so PlayScene should normally preload them before combat starts.

## Runtime Generation Path

`CombatSystem.applyAdaptationSkill()` stores skill runtime state and calls `loadAdaptationSkillEffect()`.

`loadAdaptationSkillEffect()` loads:

- `state.effectKey` into `state.texture`
- `fallbackEffectKey`, `triggerEffectKey`, `explosionEffectKey` into `state.extraTextures`

The actual runtime paths are:

- `updateAdaptationSkills()` checks cooldowns.
- `performAdaptationSkill()` dispatches to the specific skill implementation.
- Visuals are spawned by:
  - `spawnAdaptationSpriteEffect()`
  - `spawnAdaptationAreaEffect()`
  - `spawnHomingFangProjectile()`
  - `spawnDelayedBurstProjectile()`
  - `spawnSenseSpikeTrap()`

If a texture is present, pooled `Sprite` views are used. If a texture is absent, pooled `Graphics` views are used as fallback.

## Pool / Cap Status

Combat caps in `combat_system.js`:

- `MAX_COMBAT_EFFECTS = 96`
- `MAX_COMBAT_PROJECTILES = 52`
- `MAX_DAMAGE_NUMBERS = 86`
- `MAX_CRITICAL_DAMAGE_NUMBERS = 24`
- `MAX_DAMAGE_NUMBER_POOL = 64`
- `MAX_GRAPHICS_POOL = 80`
- `MAX_SPRITE_POOL = 64`

Pooling exists for:

- combat effect `Graphics`
- combat effect `Sprite`
- damage number `Text`
- combat projectiles using pooled `Sprite` / `Graphics`

This is a good baseline: the current issue is not "everything is always new each frame." The weaker points are fallback quality, trim behavior, and load-shedding policy.

## Load Shedding Status

`PlayScene.updatePerformanceLoadShedding()` computes pressure level:

- Level 1 if FPS estimate drops below 34, or children/object pressure exceeds soft thresholds.
- Level 2 if FPS estimate drops below 24, or children/object pressure exceeds hard thresholds.
- ZERO final pressure lowers practical thresholds.

Threshold constants in `play_scene.js`:

- `LOAD_SHEDDING_SOFT_CHILDREN = 680`
- `LOAD_SHEDDING_HARD_CHILDREN = 980`
- `LOAD_SHEDDING_SOFT_OBJECTS = 520`
- `LOAD_SHEDDING_HARD_OBJECTS = 760`

The level is passed into:

- `CombatSystem.setPerformancePressure(level)`
- `UltimateSystem.setPerformancePressure(level)`
- `AudioManager.setPerformanceLoadSheddingLevel(level)`

CombatSystem effects under pressure:

- `shouldShedSmallEffect()` can skip adaptation sprite/area effects when `effects.length >= MAX_COMBAT_EFFECTS * 0.72`.
  - pressure level 1 skip chance: 22%
  - pressure level 2 skip chance: 45%
- damage numbers are reduced at pressure level 2.
- `simpleEffects` from options shortens duration and scale.

Companion effects are more aggressively suppressed at pressure level 2. That helps performance, but adaptation effects remain mixed: some are skipped, and missing textures fall back to Graphics.

## Simplified Graphics Conditions

The visible simplified look can happen under these conditions:

1. **Texture unavailable or optional load failure**
   - `loadEffectTexture()` catches missing optional art and leaves fallback available.
   - `spawnAdaptationSpriteEffect()` and projectile spawns use `Graphics` when `state.texture` / extra texture is null.

2. **Old fallback keys are used**
   - `gale_blade`, `sense_spike`, and `burst_fang` still have `fallbackEffectKey`.
   - Their fallback PNGs are much smaller than revised main textures:
     - `gale_blade.png`: 3.5 KB
     - `sense_spike.png`: 7.3 KB
     - `burst_fang.png`: 9.6 KB
   - These look intentionally lightweight compared with newer effect art.

3. **High pressure skips small effects**
   - `shouldShedSmallEffect()` returns before spawning visuals.
   - This can make adaptation skills feel inconsistent during ZERO/ENDLESS high spawn.

4. **User simpleEffects option**
   - `effects.simpleEffects === true` shortens effect duration and scale globally.
   - If the user has this setting enabled, high-quality sprites still draw, but they are visually reduced.

5. **Caps trim older visuals**
   - Projectiles are capped at 52.
   - Effects are capped at 96.
   - Damage numbers are capped at 86, with extra critical cap of 24.
   - Multi-hit and trap skills can push into caps faster than single burst skills.

## Skills Most Likely To Show The Problem

High-risk skills:

- `sense_spike`
  - Spawns 4 to 10 traps plus trigger bursts.
  - Uses placed projectiles and trigger area effects.
  - Can multiply visuals before enemies are hit.

- `burst_fang`
  - Spawns 2 to 6 delayed mines.
  - Each mine can produce an explosion.
  - Has old fallback effect key and newer mine/explosion textures.

- `gale_blade`
  - Fires 2 to 6 lane effects.
  - More likely to be skipped by `shouldShedSmallEffect()` when many combat effects are active.

- `accelerated_blades`
  - Area effect plus multi-target damage number pressure.

- `flame_breath`
  - Large cone sprite with longer duration.
  - Less likely to multiply object count than traps/mines, but visually prominent if simplified.

Lower-risk skills:

- `afterimage_claw`
- `homing_fang`
- `predator_marking`
- `shock_roar_wave`

These can still degrade, but usually with fewer simultaneous objects.

## Debug / QA Observability

`debugPerformance=1` already shows:

- FPS
- load shedding level
- container children
- enemy counts
- projectile counts
- combat effects
- ultimate effects
- damage text counts
- pickup counts
- companion effect counts
- audio instance count
- whiteout dump state

`buildPerformanceSnapshot()` also captures:

- `projectileCount`
- `effectCount`
- `ultimateEffectCount`
- `damageTextCount`
- `criticalTextCount`
- `activeAudioCount`
- `companion.effects`
- pool free counts
- load shedding level

Gap: there is no adaptation-specific breakdown such as:

- adaptation skill effect spawns
- adaptation skill effects skipped by shedding
- texture vs Graphics fallback counts
- per-skill projectile counts

PF02 should add debug counters before changing visuals broadly.

## Cause Hypotheses

1. The most visible quality drop is likely not one single bug. It is a combination of:
   - pressure-based skipping,
   - texture-null Graphics fallback,
   - old fallback assets,
   - high object counts from mine/trap/multi-blade skills.

2. The `battle` asset group includes adaptation effects, so "not preloaded at all" is unlikely in normal PlayScene. However, optional load failure or temporary pending state can still cause fallback behavior after state creation.

3. The current fallback path prioritizes play continuity over visual quality. This is technically safe, but it can expose simple Graphics in exactly the moments where the screen is already busy.

4. Damage text and critical text can consume visual/object budget during multi-hit adaptation builds. Damage number shedding exists but only at pressure level 2.

5. `shouldShedSmallEffect()` skips adaptation visuals after combat effects reach about 69 active entries. It does not distinguish "player adaptation skill" from lower-priority combat decoration.

## Improvement Direction

### A. Preserve dedicated art for adaptation skills

Do not replace player adaptation effects with simple Graphics under load unless a texture is genuinely missing. Prefer a low-cost sprite variant over Graphics.

PF02 implementation idea:

- Add `lowCostEffectKey` or `performanceEffectKey` to adaptation skill definitions.
- Use smaller texture/sprite-sheet variants under pressure.
- Keep the same silhouette/identity for each skill.

### B. Replace old fallback assets

The fallback PNGs for `galeBlade`, `senseSpike`, and `burstFang` are tiny and likely visually weak.

PF02 should either:

- remove these fallback routes when revised main textures are reliable, or
- regenerate them as compact but production-looking low-cost versions.

### C. Add adaptation effect priority

Priority proposal:

1. Player direct adaptation cast visuals
2. Player adaptation projectile bodies
3. Boss/enemy attack warnings
4. Boss effects
5. Companion effects
6. Damage text / critical text
7. Decorative pulses / pickup bursts

Instead of skipping adaptation effects randomly, reduce non-critical categories first.

### D. Count and shed by category

Add lightweight counters:

- `adaptationEffectSpawns`
- `adaptationEffectsShed`
- `adaptationGraphicsFallbacks`
- `adaptationSpriteEffects`
- `adaptationProjectilesBySkill`

Expose in `debugPerformance=1` or performance snapshot.

### E. Reduce multi-object pressure without changing damage

Do not change skill values. Instead:

- merge visual-only trap rings at high pressure,
- shorten duration,
- reduce alpha,
- skip only duplicate secondary slashes,
- keep the main sprite pulse,
- cap per-skill simultaneous visuals separately.

### F. Texture-first projectile handling

For `homing_fang`, `sense_spike`, and `burst_fang`, ensure projectile bodies use sprites whenever available. If not available, make the fallback a pooled sprite using a shared low-cost texture rather than redrawing Graphics each update.

## Recommended PF02 Plan

PF02 should be a narrow implementation pass:

1. Add adaptation-specific debug counters in `CombatSystem`.
2. Add these counters to `getPerformanceStats()` and PlayScene performance overlay/snapshot.
3. Run high-load QA to identify exact skill/fallback counts.
4. Regenerate or reconnect low-cost texture variants for:
   - `gale_blade`
   - `sense_spike`
   - `burst_fang`
5. Change load shedding so adaptation skill visuals prefer:
   - dedicated full texture at level 0
   - dedicated low-cost texture at level 1/2
   - reduced duration/alpha at level 2
   - Graphics fallback only when texture is missing
6. Keep effect numbers, damage, cooldown, and balance unchanged.

## QA Plan For PF02/PF03

### Static

- Verify all adaptation skill effect keys exist in `asset_manifest.js`.
- Verify all files exist in `public/assets/effects/adaptation_skills/`.
- Verify no skill reaches Graphics fallback when its texture exists.

### Runtime

ZERO high load:

```text
?debugIntroSeen=1&debugAutoPlay=1&debugPerformance=1&debugInvincible=1&debugMaxSpawn=1&debugAdaptationSkills=1&debugAdaptationAllLevel=3&debugDino=velociraptor&debugStage=volcano&debugMode=zero&debugDifficulty=expert
```

ENDLESS high load:

```text
?debugIntroSeen=1&debugAutoPlay=1&debugPerformance=1&debugInvincible=1&debugMaxSpawn=1&debugAdaptationSkills=1&debugAdaptationAllLevel=3&debugCompanionId=exp_chaser&debugCompanionLevel=5&debugDino=velociraptor&debugStage=jungle&debugMode=endless&debugDifficulty=expert
```

Compare:

- Companionなし
- Companionあり
- `debugMaxSpawn=1`
- `debugMaxSpawn`なし
- ZERO
- ENDLESS

Observe:

- FPS
- load shedding level
- combat effects
- combat projectiles
- damage text
- critical text
- adaptation sprite vs Graphics fallback counters
- skipped adaptation effects
- whiteout dump
- runtime console error/warn count

## PF01 QA Result

- Branch created from `origin/main`: `feature/adaptation-effect-performance-v1`
- Code was inspected only; no gameplay implementation was changed.
- `git diff --check` is required for the docs-only diff.

## Main Integration Status

- Not merged to `main`.
- Not pushed to `main`.
