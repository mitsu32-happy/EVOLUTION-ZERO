# Z04-03 ruins ZERO Assets

## Scope

Z04-03 adds the first dedicated visual layer for the `ruins` ZERO route. Boss implementation, boss balancing, and ZERO evolution research card connection remain deferred to Z04-04/Z04-05.

## Concept

`ruins` ZERO is treated as an old research facility ruin where ZERO contamination has reached the deep reactor core.

Visual targets:

- Ruined stone facility plus abandoned sci-fi reactor machinery.
- Cyan/teal reactor glow mixed with restrained red-purple ZERO corruption.
- High difficulty mood without losing enemy, warning, and pickup readability.
- Static texture-driven effects rather than high-count particles.

## Generated Assets

### Stage Background

- `public/assets/maps/backgrounds/ruins_zero_battlefield_tile.png`
  - Generated from a dedicated ruins ZERO illustration.
  - Center-cropped and resized to a 1024x1024 combat tile.
  - Used only when `selectedStage === 'ruins'` and `selectedMode === 'zero'`.

### Environment / Stage Effect Textures

- `public/assets/effects/stage_gimmicks/ruins_zero/ruins_zero_reactor_pulse.png`
- `public/assets/effects/stage_gimmicks/ruins_zero/ruins_zero_corruption_mist.png`
- `public/assets/effects/stage_gimmicks/ruins_zero/ruins_zero_broken_light.png`
- `public/assets/effects/stage_gimmicks/ruins_zero/ruins_zero_energy_vein.png`
- `public/assets/effects/boss/ruins_zero/ruins_zero_laser_warning.png`

Current Z04-03 runtime connection:

- `ruinsZeroReactorPulse` replaces the standard ruins electro pulse visual in `ruins` ZERO.
- `ruinsZeroLaserWarning` replaces the standard ruins laser visual in `ruins` ZERO.
- Damage, interval, active timing, count, and hitbox behavior are unchanged.

Reserved textures:

- `ruinsZeroCorruptionMist`
- `ruinsZeroBrokenLight`
- `ruinsZeroEnergyVein`

These are registered for later lightweight ambience or boss phase work, but are not spawned as new always-on particles in Z04-03.

### Warning / Gimmick Telegraph Textures

- `public/assets/effects/boss/ruins_zero/ruins_zero_reactor_warning.png`
- `public/assets/effects/boss/ruins_zero/ruins_zero_laser_warning.png`
- `public/assets/effects/boss/ruins_zero/ruins_zero_em_field_warning.png`
- `public/assets/effects/boss/ruins_zero/ruins_zero_shockwave_warning.png`

These are registered under `bossEffects` for Z04-04 boss/gimmick telegraphs. They are static transparent textures with generous margins, not animated particle systems.

## Code Connections

- `src/data/asset_manifest.js`
  - Added `stageBackgrounds.ruinsZero`.
  - Added `stageGimmicks.ruinsZero*` texture keys.
  - Added `bossEffects.ruinsZero*Warning` texture keys.
- `src/scenes/play_scene.js`
  - Added `getStageBackgroundAssetKey(stageId)`.
  - Uses `stageBackgrounds.ruinsZero` only for `ruins` ZERO.
  - Switches the two existing ruins stage gimmick visuals to ZERO-specific textures only in `ruins` ZERO.

## Performance Notes

- No new particle systems were added.
- No new stage gimmick count or spawn interval changes were added.
- New runtime visuals are static texture sprites.
- Existing PF04b visual budget and `MAX_STAGE_GIMMICKS` behavior remains unchanged.
- Warning readability remains code-driven through existing hitbox warnings; Z04-04 can opt into the new warning textures where appropriate.

## QA Assets

- `docs/assets/z04_03_ruins_zero_background_contact.png`
- `docs/assets/z04_03_ruins_zero_effect_contact.png`
- `docs/assets/z04_03_ruins_zero_warning_contact.png`
- `docs/assets/z04_03_asset_report.json`

Asset report results:

- Background tile: 1024x1024.
- Effect/warning textures: 512x512 with alpha.
- Transparent corners: true for all effect/warning textures.
- Minimum effect/warning margin: 41px.
- Cell contamination risk: low after quadrant split and recentering.

## QA Result

Checked in Codex browser on localhost:

- `ruins` ZERO with `debugAllowRuinsZero=1` and `debugGimmickFast=1`
  - Canvas displayed.
  - Dedicated `ruinsZero` background visible.
  - ZERO reactor stage texture visible.
  - Runtime console warn/error: 0.
- Normal `ruins` expert with `debugGimmickFast=1`
  - Canvas displayed.
  - Normal ruins route still booted.
  - Runtime console warn/error: 0.
- Existing `jungle` ZERO expert
  - Canvas displayed.
  - Existing ZERO route still booted.
  - Runtime console warn/error: 0.

## Handoff

Z04-04 should use the registered `bossEffects.ruinsZero*Warning` textures for the dedicated ruins ZERO boss/gimmick implementation.
