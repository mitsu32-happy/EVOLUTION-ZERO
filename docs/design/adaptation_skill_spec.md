# Adaptation Skill Spec

MVP-109 defines adaptation tags and adaptation skills before runtime implementation.
Normal attacks are already handled separately by MVP-108. This document covers the
additional techniques that appear through DNA adaptation choices.

## Role

- Normal attacks: dino-specific base attacks, available from sortie start.
- Adaptation skills: additional active techniques gained during a run.
- Special skills: evolution-only powerful actions shown after evolution.
- Status upgrades: tagless upgrades such as HP, speed, frequency, pickup range,
  DNA gain, and EXP support.

Adaptation skills support `dino = play style choice` without replacing normal
attacks. A skill has exactly one adaptation tag.

## Initial Tags

| Tag | Display Role | Direction |
| --- | --- | --- |
| `speed` | 高速変異 | Fast movement, afterimages, rapid slashes, repeated hits. |
| `hunting` | 狩猟本能 | Homing, tracking, predation, marking, traps. |
| `attack` | 攻撃適応 | High damage, shock waves, explosion, roar, flame. |

Future tags can include `defense`, `toxic`, `crystal`, `fire`, and `thunder`.
Future tags should receive the same treatment: one clear role, one icon, one
card direction, and no overlap with tagless status upgrades.

## Tagless Upgrades

Status-up choices have no adaptation tag.

Examples:

- 最大HP上昇
- 移動速度上昇
- 攻撃頻度上昇
- 回収範囲上昇
- DNA獲得補正
- EXP吸収補助

Rules:

- Use `tag: null` or an explicit `none` presentation id.
- Do not occupy skill slots.
- Do not count toward adaptation tag totals.
- Do not affect evolution conditions.
- May still appear in level-up choices.
- Use a gray tagless card asset.

## MVP-109 Skill Set

Each initial tag gets two skills: one available by default and one unlocked by
DNA research later.

| Tag | Skill | Unlock | Runtime Direction |
| --- | --- | --- | --- |
| speed | 残影爪 | initial | Fast cyan forward slash / afterimage hit. |
| speed | 加速刃群 | research | Orbiting rapid blades, multi-hit. |
| hunting | 追尾牙 | initial | Homing fang projectile toward nearby enemies. |
| hunting | 捕食マーキング | research | Marks targets for bonus damage or pull effects. |
| attack | 衝撃咆哮 | initial | Red-orange frontal shock wave. |
| attack | 火炎吐息 | research | Short frontal flame with damage-over-time. |

Flame and similar unrealistic abilities are allowed as environmental adaptation
abilities, as long as they keep the dark sci-fi / abnormal evolution tone.

## Data Shape

Runtime data should be data-driven and independent from card UI.

```js
{
  id: 'afterimage_claw',
  name: '残影爪',
  type: 'adaptationSkill',
  tag: 'speed',
  unlockType: 'initial', // initial | research
  researchId: null,
  cooldown: 2.8,
  damage: 16,
  range: 118,
  effectKey: 'adaptationSkillEffects.afterimageClaw',
  iconKey: 'adaptationSkillIcons.afterimageClaw',
  description: '前方へシアンの残像斬撃を走らせる。',
  levelUpText: '斬撃数と再発動速度が向上',
  maxLevel: 5,
  scaling: { damage: 0.16, cooldownReduction: 0.04 }
}
```

MVP-109 adds this data as preparation only. Combat execution is deferred.

## Research Connection

The DNA research `適応能力` category unlocks research-gated adaptation skills.

Planned research unlocks:

- `research_unlock_accelerated_blades`
- `research_unlock_predator_marking`
- `research_unlock_flame_breath`

Save compatibility:

- Use optional/default fields.
- Existing saves without these research ids must load normally.
- Locked research skills do not appear in normal level-up choices until their
  research unlock is completed.

## Selection UI Connection

DNA adaptation selection should classify choices before card rendering:

- Adaptation skill: use tag-specific card and tag icon.
- Tagless status upgrade: use gray none card and none icon.
- Locked or unresearched skill: hidden or shown as locked depending on screen
  policy.

The tagless card must not suggest evolution progress. It is a general facility
enhancement / temporary run improvement card.

## Assets

Generated MVP-109 assets:

- `public/assets/ui/selection/adaptation_card_none_panel.png`
- `public/assets/ui/selection/adaptation_card_none_panel_selected.png`
- `public/assets/ui/adaptations/icon_adapt_speed.png`
- `public/assets/ui/adaptations/icon_adapt_hunting.png`
- `public/assets/ui/adaptations/icon_adapt_attack.png`
- `public/assets/ui/adaptations/icon_adapt_none.png`

Future runtime assets:

- `public/assets/effects/adaptation_skills/afterimage_claw.png`
- `public/assets/effects/adaptation_skills/accelerated_blades.png`
- `public/assets/effects/adaptation_skills/homing_fang.png`
- `public/assets/effects/adaptation_skills/predator_marking.png`
- `public/assets/effects/adaptation_skills/shock_roar_wave.png`
- `public/assets/effects/adaptation_skills/flame_breath.png`

All assets are text-free. Runtime text is code-rendered.

## Next MVP Plan

MVP-110 should:

- Gate research-unlocked skills from level-up choices.
- Add runtime effect/icon assets for the six skills.
- Implement cooldown, damage, hit detection, and scaling per adaptation skill.
- Keep tagless status upgrades outside skill slots and evolution tag counts.
- Keep normal attacks, adaptation skills, and special skills as separate systems.

## MVP-110 Runtime Connection

Implemented initial adaptation skills:

- `afterimage_claw`: speed / 残影爪. Auto-casts a short frontal cyan arc slash.
- `homing_fang`: hunting / 追尾牙. Auto-casts amber homing fang hits against nearby enemies.
- `shock_roar_wave`: attack / 衝撃咆哮. Auto-casts a frontal red-orange cone shock wave with light knockback.

Research-gated skills prepared but not fully executed in combat:

- `accelerated_blades`: speed / 加速刃群.
- `predator_marking`: hunting / 捕食マーキング.
- `flame_breath`: attack / 火炎吐息.

Candidate gate:

- Initial skills appear in level-up choices from the start.
- Research skills are hidden unless their `researchId` has a saved research level above 0.
- Existing saves without those research ids behave as unresearched.

Runtime rules:

- Adaptation skills use separate cooldowns from normal attacks.
- Adaptation skills occupy the 3 HUD skill slots.
- Tagless upgrades never occupy skill slots.
- Only adaptation skills increment adaptation tag counts.
- Tagless upgrades do not affect evolution candidate detection.

Generated runtime assets:

- `public/assets/effects/adaptation_skills/afterimage_claw.png`
- `public/assets/effects/adaptation_skills/accel_blades.png`
- `public/assets/effects/adaptation_skills/tracking_fang.png`
- `public/assets/effects/adaptation_skills/predator_mark.png`
- `public/assets/effects/adaptation_skills/shock_roar.png`
- `public/assets/effects/adaptation_skills/flame_breath.png`
- `public/assets/ui/skills/icon_afterimage_claw.png`
- `public/assets/ui/skills/icon_accel_blades.png`
- `public/assets/ui/skills/icon_tracking_fang.png`
- `public/assets/ui/skills/icon_predator_mark.png`
- `public/assets/ui/skills/icon_shock_roar.png`
- `public/assets/ui/skills/icon_flame_breath.png`

Fallback:

- If an adaptation effect texture is missing, `CombatSystem` draws a lightweight Graphics slash/shock fallback.
- If a skill icon is missing, HUD and selection UI fall back to the tag icon.

Next implementation:

- Connect research purchase for the three research-gated adaptation skills.
- Implement the full combat behavior for 加速刃群, 捕食マーキング, and 火炎吐息.
- Add balance pass after real combat timing is visible.

## MVP-111 Periodic Auto Skill Runtime

Adaptation skills are now treated as periodic auto skills, separate from normal attacks.

- Normal attacks remain dino-specific base attacks that are primarily triggered by nearby enemies.
- Adaptation skills tick on their own cooldowns and then release, place, track, or sweep when a valid target exists in a broader search range.
- The skills do not require enemies to be in melee range, so they feel like additional Vampire Survivors-style output rather than another close attack.
- Empty casts are avoided when no target exists in the skill's search range.

Implemented runtime behavior:

- `afterimage_claw`: periodically releases a fast cyan frontal slash toward a nearby target.
- `homing_fang`: periodically launches one or more amber tracking fang hits at nearby targets.
- `shock_roar_wave`: periodically emits a red-orange frontal cone shockwave with knockback.
- `accelerated_blades`: periodically creates a short circular blade burst around the player.
- `predator_marking`: periodically marks nearby targets with amber hunting damage.
- `flame_breath`: periodically emits a frontal cone of flame with multi-target damage.

Research gate:

- `accelerated_blades`, `predator_marking`, and `flame_breath` remain hidden from normal level-up candidates unless their corresponding research id has a saved level above 0.
- Existing saves without those research keys remain valid and treat them as locked.
- `?debugResearchUnlock=1` temporarily unlocks the three research-gated adaptation skills for runtime verification without writing to save data.

Debug verification:

- `?debugAdaptationSkills=1` grants all six adaptation skills for a run and activates their combat states.
- The HUD remains limited to 3 skill slots by design, but all six skills can run in combat during this debug mode.

Load and balance notes:

- Projectile/field-like effects use short lifetimes.
- Each skill owns its cooldown and avoids high-frequency spam.
- Research-gated skills are slightly stronger or wider than initial skills, but cooldowns are longer to avoid screen flooding.

## MVP-112 Upgrade Feel and Projectile Pass

Upgrade display:

- Level-up cards must avoid `Lv` and use `強化 n→m` or `新規解析`.
- Cards show a short next-upgrade preview such as `次: 追尾数+1`, `次: 範囲 / 持続強化`, or `次: 炎の幅 / 射程強化`.
- Tagless upgrades still use gray cards and do not affect skill slots or adaptation tags.

Scaling policy:

- `afterimage_claw`: gains additional slash visuals at stronger stages and expands slash width/range.
- `homing_fang`: gains more projectiles and slightly faster homing.
- `shock_roar_wave`: expands cone range/angle and knockback.
- `accelerated_blades`: expands circular area and extends visible blade burst duration.
- `predator_marking`: increases marked target count and bonus damage.
- `flame_breath`: increases flame reach, width, and visible duration.

Projectile specification:

- `homing_fang` now spawns visible projectiles from near the player.
- Each projectile homes toward its target, has a short lifetime, and applies damage on contact.
- Simultaneous homing fang projectiles are capped to prevent visual and CPU overload.
- If the projectile texture is missing, a small Graphics fang fallback is drawn.

Research purchase:

- The three research-unlocked adaptation skills can be purchased from DNA研究 > 適応能力.
- Purchase cost uses both DNA and 研究Pt.
- Bought research stores `researchLevels[researchId] = 1`, which makes the skill eligible for level-up candidates.
- Existing saves without the research ids remain compatible and treat those skills as unresearched.

Debug:

- `?debugResearchUnlock=1`: temporarily unlocks the three research-gated skills.
- `?debugAdaptationSkills=1`: grants all six adaptation skills.
- `?debugSkillLevel=3`: grants debug skills at the requested strengthening stage, clamped to 1-5.

## MVP-113 Balance Pass

Targeting policy:

- Auto-aim is limited mainly to hunting skills.
- Speed and attack skills are biased toward player-facing direction, movement direction, frontal cones, and local area effects.
- Skills may check for enemies in a broad search range before firing, but should not all snap perfectly to the nearest enemy.

Balance adjustments:

- Cooldowns are lengthened because upgrade stages now increase count, range, and duration.
- Initial skills remain easy to use, but should not cover the screen constantly.
- Research skills are more valuable but use longer cooldowns and restrained damage.

Current runtime roles:

- `afterimage_claw`: player-facing frontal slash. It no longer fully aims at a nearby enemy.
- `homing_fang`: hunting projectile skill. It keeps homing but uses lower speed, shorter lifetime, and a simultaneous projectile cap.
- `shock_roar_wave`: player-facing cone shockwave.
- `accelerated_blades`: local area burst around the player.
- `predator_marking`: hunting auto-target skill with reduced target count and damage.
- `flame_breath`: player-facing cone flame with restrained width and cooldown.

Debug remains:

- `?debugResearchUnlock=1`
- `?debugAdaptationSkills=1`
- `?debugSkillLevel=4`

## MVP-114 Periodic Cast And Candidate Tempo

- Adaptation skills keep their own cooldowns and are treated as periodic auto skills.
- Non-hunting skills cast even without nearby enemies so the player can read the rhythm of the build:
  - `afterimage_claw`: fires forward in the current/player-facing direction.
  - `shock_roar_wave`: fires a frontal cone shock wave.
  - `accelerated_blades`: opens a short-lived area around the player.
  - `flame_breath`: breathes forward even when no enemy is inside the cone.
- Hunting skills remain target-aware:
  - `homing_fang` and `predator_marking` require a nearby target and may no-op if no enemy is present.
- Level-up candidates use weighted selection:
  - Tagless boosts appear regularly.
  - Owned adaptation skills are weighted as natural strengthening candidates.
  - Initial adaptation skills stay available early.
  - Research-gated skills appear only when their research id is completed.
  - If possible, at least one adaptation skill appears so a roll does not become all generic boosts.
- Tagless boosts remain outside skill slots, outside adaptation tag counts, and outside evolution conditions.
- Tagless boost icons are now per-feature rather than one generic icon.

## MVP-114 Addendum: Initial 6 / Research 3 Skill Set

- Initial adaptation skills are now 2 per active tag, 6 total:
  - speed: `afterimage_claw` / `gale_blade`
  - hunting: `homing_fang` / `sense_spike`
  - attack: `shock_roar_wave` / `burst_fang`
- Research unlock skills remain 1 per active tag, 3 total:
  - speed: `accelerated_blades`
  - hunting: `predator_marking`
  - attack: `flame_breath`
- New initial skills are intentionally lighter and easier to read:
  - `gale_blade`: frontal speed blade, direction based, not perfect homing.
  - `sense_spike`: hunting scan spike, limited target count.
  - `burst_fang`: frontal attack burst, compact cone damage.
- Research skills should remain more distinctive or wider in effect than initial skills.
- Skill slot rules are unchanged: adaptation skills only. Tagless boosts never enter skill slots and never add adaptation tags.

## MVP-115 Addendum: Skill Display and Debug Boundaries

- HUD skill slots and pause skill summary both read from the acquired adaptation skill list.
- Pause screen `現在の適応状況` displays skill icons, short skill names, and `強N`; it does not summarize speed/hunting/attack tag counts.
- Empty skill slots remain visible as empty/placeholder slots.
- `?debugAdaptationSkills=1` is the only run-start route that grants all adaptation skills for verification. Normal URLs start with no acquired adaptation skills unless the player selects them during the run.
- `?debugResearchUnlock=1` only opens research-gated candidate checks and must not silently grant skills.

## MVP-116 Addendum: Skill Role Revision

- Normal attacks stay as dinosaur-specific close/frontal base attacks.
- Adaptation skills are periodic extra skills and should not all behave like frontal normal attacks.
- `gale_blade` changed from a frontal lane into spread blades that cross left/right or diagonal paths from the player-facing direction.
- `sense_spike` changed from direct target damage into a short-lived trap ring that reacts to enemies near each spike.
- `burst_fang` changed from a frontal cone into delayed explosive fangs placed ahead of the player.
- Hunting skills may keep target awareness, but speed and attack skills should lean into movement trails, orbiting, traps, explosions, fields, or delayed attacks.

## MVP-117 Effect Asset Update

- `gale_blade` now uses `adaptationSkillEffects.galeBladeSpread` (`gale_blade_spread.png`) as its primary VFX. The old `galeBlade` texture remains a fallback.
- `sense_spike` now separates placed trap and triggered reaction visuals:
  - primary: `adaptationSkillEffects.senseSpikeTrap` (`sense_spike_trap.png`)
  - trigger: `adaptationSkillEffects.senseSpikeTrigger` (`sense_spike_trigger.png`)
  - fallback: old `senseSpike` texture, then Graphics fallback.
- `burst_fang` now separates mine and explosion visuals:
  - primary: `adaptationSkillEffects.burstFangMine` (`burst_fang_mine.png`)
  - explosion: `adaptationSkillEffects.burstFangExplosion` (`burst_fang_explosion.png`)
  - fallback: old `burstFang` texture, then Graphics fallback.
- Runtime code supports optional secondary effect textures on an adaptation skill state. Missing optional art must not stop the skill; it should fall back to the main texture or Graphics.
- The three refreshed effects intentionally emphasize different silhouettes: speed spread blades, amber trap/trigger, and red-orange mine/explosion.
- The three matching icons were regenerated in place (`icon_gale_blade.png`, `icon_sense_spike.png`, `icon_burst_fang.png`) so HUD slots, level-up cards, and pause skill popups use the same upgraded visual language without changing icon keys.

## MVP-117 Follow-up: Tempo and Lingering Hazards

- Adaptation skill cooldowns were shortened by roughly 10-20% from the restrained MVP-113 values to restore more frequent, satisfying periodic casts.
- Hunting skills remain the safest place for tracking behavior. Speed and attack skills keep direction, spread, orbit, mine, or field roles rather than becoming guaranteed hits.
- `sense_spike` is now a short-lived placed trap set around the player. It remains on the field briefly, reacts when enemies enter its radius, then plays the trigger effect.
- `burst_fang` is now a delayed mine that can also detonate early when an enemy touches the danger zone.
- `accelerated_blades` and `flame_breath` received slightly longer visual duration so their periodic cast is easier to read.
- Tagless boost card icons are centered separately from tagged adaptation cards because the gray/silver card art uses a different circular icon well.
