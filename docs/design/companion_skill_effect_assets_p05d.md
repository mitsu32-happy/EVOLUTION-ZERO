# Companion Dino Skill Effect Assets P05d

## Scope

P05d improves companion action feedback by making the existing dedicated
effect sheets the primary visual feedback for skills and support actions.

No save data, AI power, damage, healing, EXP, or balance values were changed.

## Existing Effect Asset Investigation

All ten companions already had dedicated animated effect sheets from P04e.
They are present under `public/assets/companions/`, registered in
`src/data/asset_manifest.js`, and referenced through each companion
`effectAssetKey`.

The available sheets are all RGBA PNG files sized `1280x320`, arranged as
`4 columns x 1 row` with `320x320` frames.

| Companion | Effect sheet | P05d usage |
| --- | --- | --- |
| `raptorling` | `raptorling_effect_sheet_p04e.png` | slash / claw hit |
| `spino_pup` | `spino_pup_effect_sheet_p04e.png` | water splash hit |
| `medic_saur` | `medic_saur_effect_sheet_p04e.png` | healing aura |
| `ptera_chick` | `ptera_chick_effect_sheet_p04e.png` | wind / air shot |
| `tricera_calf` | `tricera_calf_effect_sheet_p04e.png` | guard shield |
| `para_juvenile` | `para_juvenile_effect_sheet_p04e.png` | sonar / pickup assist |
| `stego_calf` | `stego_calf_effect_sheet_p04e.png` | shockwave |
| `rex_hatchling` | `rex_hatchling_effect_sheet_p04e.png` | bite / heavy impact |
| `compy_pack` | `compy_pack_effect_sheet_p04e.png` | swarm slash |
| `exp_chaser` | `exp_chaser_effect_sheet_p04e.png` | EXP scan / trace |

## Implementation

P05d adds `COMPANION_EFFECT_PROFILES` in `PlayScene`.

Each profile defines:

- `kind`
- `scale`
- `duration`
- `growth`
- `alpha`
- `rotationSpeed`
- `fps`

`spawnCompanionEffect()` now applies these profiles before using the pooled
effect sprite. This makes the dedicated effect sheet visible enough to carry
the action feedback without changing the underlying effect strength.

## Simplified Graphics Replacement

Before P05d, companion action feedback still had normal-play `Graphics` rings,
lines, and aura shapes layered on top of the sprite. Those shapes made the
skill feedback look like debug/simple graphics even though dedicated effect
sheets existed.

P05d changes that behavior:

- normal play keeps only a subtle shadow/glow around the companion
- companion trail lines are shown only in `debugCompanionGuide`
- action aura rings/shapes are shown only in debug guide mode
- actual action feedback comes from the companion effect sheet sprite

## Pool / Cleanup Management

The existing capped effect lifecycle is preserved:

- `companionEffects`
- `companionEffectPool`
- `MAX_COMPANION_EFFECTS`
- `trimCompanionEffects()`
- `updateCompanionEffects()`
- `performanceLoadSheddingLevel >= 2` suppresses new companion effects

P05d only changes the profile used by a spawned effect. It does not increase
the number of active companion effect sprites.

## Remaining Work

- A future asset pass may create P05d-named replacement sheets if device QA
  finds any P04e sheet still too generic.
- Release QA should confirm every companion skill reads clearly on a phone
  without `debugCompanionGuide`.
- If any effect feels too large in dense ZERO combat, adjust the profile scale
  first rather than changing skill values.
