# Z04-04 ruins ZERO Boss and Gimmick

## Scope

Z04-04 makes the `ruins` ZERO route playable with dedicated enemy pressure, a second boss, and a final boss.

Out of scope:

- main merge / push
- version or news updates
- ZERO route reward connection
- new stage addition

## Enemy Composition

Updated file:

- `src/systems/spawn_system.js`

`ruins` ZERO now uses a dedicated spawn mix through `getRuinsZeroEnemyWeights()`.

Design:

- Keep total spawn pressure under the existing ZERO budget.
- Increase `ruinsShooter` and `ruinsElectro` weight to express the reactor-defense theme.
- Keep `ruinsSummoner` present but restrained so the route does not become a pure enemy-count stress test.
- Keep basic enemies as low-weight fillers for readability and pacing.

Late route mix:

- `ruinsShooter`: main ranged pressure
- `ruinsElectro`: electromagnetic hazard pressure
- `ruinsSummoner`: limited support pressure
- `tank` / `swarm`: small filler presence

## Second Boss

ID:

- `ruins_zero_second_boss`

Display name:

- `リアクター・セントリー`

Role:

- Mid-route reactor defense mechanism.
- Lower movement speed than jungle ZERO second boss.
- Uses readable warning textures rather than high projectile counts.

Asset keys:

- `bosses.ruinsZeroSecondBoss`
- `bosses.ruinsZeroSecondBossPortrait`

Main attacks:

- Reactor laser: linear warning / single beam.
- EM field: circular slow and chip damage field.
- Shockwave burst: local pulse with clear windup.
- Summon: limited `ruinsShooter` support.

## Final Boss

ID:

- `ruins_zero_final_boss`

Display name:

- `リアクター・オメガ`

Role:

- ZERO-contaminated deep reactor core.
- Stronger and larger than the second boss, but still uses one-shot readable telegraphs.

Asset keys:

- `bosses.ruinsZeroFinalBoss`
- `bosses.ruinsZeroFinalBossPortrait`

Main attacks:

- Reactor pulse beam: long warning, single line attack.
- EM field: large circular pressure field.
- Core burst: wide shockwave with visible reactor warning.
- Summon: limited `ruinsElectro` support.

## Generated Boss Assets

Generated and connected:

- `public/assets/enemies/bosses/ruins_zero_second_boss_sheet.png`
- `public/assets/enemies/bosses/ruins_zero_second_boss.png`
- `public/assets/enemies/bosses/ruins_zero_second_boss_portrait.png`
- `public/assets/enemies/bosses/ruins_zero_final_boss_sheet.png`
- `public/assets/enemies/bosses/ruins_zero_final_boss.png`
- `public/assets/enemies/bosses/ruins_zero_final_boss_portrait.png`

QA assets:

- `docs/assets/z04_04_ruins_zero_boss_contact.png`
- `docs/assets/z04_04_ruins_zero_boss_asset_report.json`

Asset report result:

- edge issue: 0
- cell contamination: 0 detected by generated report
- missing generated boss asset: 0

## Boss Effect Texture Mapping

Z04-04 reuses Z04-03 warning/effect textures.

Connected effect keys:

- `bossEffects.ruinsZeroReactorWarning`
- `bossEffects.ruinsZeroLaserWarning`
- `bossEffects.ruinsZeroEmFieldWarning`
- `bossEffects.ruinsZeroShockwaveWarning`

Implementation detail:

- `PlayScene.getZeroBossConfig()` now supports optional per-attack asset keys:
  - `beamAssetKey`
  - `fieldAssetKey`
  - `burstAssetKey`
- Existing ZERO bosses continue to fall back to their existing `attackAssetKey`.

## Performance Notes

- No always-on particle system was added.
- Boss attacks use single warning/effect textures and existing boss attack scheduling.
- Summon counts remain limited.
- Enemy pressure is shifted toward tougher ruins enemies instead of raising raw spawn count.
- Existing ZERO scaling and PF04b caps remain intact.

## Impact Check

Expected isolated impact:

- `ruins` ZERO gets dedicated phase 2 and phase 3 bosses.
- normal `ruins` keeps its existing boss and background behavior.
- existing ZERO routes keep their existing boss assets and attack behavior.

## QA Result

- `ruins` ZERO boot: pass with `debugAllowRuinsZero=1`.
- `ruins_zero_second_boss` spawn: pass with `debugZeroBoss=1`.
- `ruins_zero_final_boss` spawn: pass with `debugZeroFinalBoss=1`.
- Warning texture visibility: pass for reactor laser / EM field / shockwave smoke checks.
- normal `ruins` boot: pass with standard EXPERT debug boss smoke.
- existing ZERO boot: pass with jungle ZERO second boss smoke.
- runtime console error/warn: 0 in browser smoke checks.
- whiteout dump: none observed.
- build: pass, Vite chunk size warning only.

## Remaining Work

Z04-05 should connect ruins ZERO clear to the direct `spinosaurus_zero` route reward. ZERO evolution research cards are not used.
