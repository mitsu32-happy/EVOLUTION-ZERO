# PF03 Companion Synergy Connection For New Dinos

## Scope

New six player dinosaurs are now implemented, so PF03 enabled the six companion synergy pairs that were previously future reservations.

No save fields were added. Synergy state is still derived from:

- selected player dino id
- selected companion id

## Enabled Pairs

| Player dino | Companion | Synergy id | Effect | Value |
| --- | --- | --- | --- | --- |
| `ankylosaurus` | `medic_saur` | `ankylo_regen_armor` | healing support up | +10% |
| `parasaurolophus` | `para_juvenile` | `para_echo_scavenger` | pickup assist range up | +10% |
| `stegosaurus` | `stego_calf` | `stego_plate_shock` | area support damage up | +10% |
| `pteranodon` | `ptera_chick` | `pteranodon_wing_cover` | ranged support damage up | +10% |
| `compsognathus` | `compy_pack` | `compy_pack_hunt` | low-HP pursuit damage up | +12% |
| `ornithomimus` | `exp_chaser` | `ornithomimus_exp_runner` | EXP support up | +6% |

All 10 companion synergies are now enabled.

## Runtime Connection

Implemented in `PlayScene`:

- `healing`
  - Multiplies `medic_saur` healing amount.
- `pickupRange`
  - Multiplies `para_juvenile` pickup assist radius.
- `areaDamage`
  - Multiplies `stego_calf` support attack damage.
- `rangedSupport`
  - Multiplies `ptera_chick` support attack damage.
- `lowHpPursuit`
  - Multiplies `compy_pack` support attack damage only when the target is under 45% HP.
- `expGain`
  - Multiplies `exp_chaser` EXP gain support and EXP pickup assist radius.

Existing first-wave effects remain unchanged:

- `bossDamage`
- `critRate`
- `companionSkillDamage`
- `damageTaken`

## UI Display

The six new pairs no longer use `publicPlayerDinoName: '未発見の恐竜'`.

The companion selection modal and research companion list now resolve these partner names:

- アンキロサウルス
- パラサウロロフス
- ステゴサウルス
- プテラノドン
- コンプソグナトゥス
- オルニトミムス

Home still does not show a persistent `発動中` synergy label, matching the CS05c decision that the home dino may differ from final sortie selection.

## QA

Static data check:

- 10 total synergies.
- 10 enabled synergies.
- New six pair `isCompanionSynergyActive(...)` results are all `true`.
- Non-synergy check `ankylosaurus x exp_chaser` returns `false`.

Browser checks:

- `ornithomimus x exp_chaser`
  - PlayScene debug line showed `syn ornithomimus_exp_runner expGain 0.06`.
  - console error/warn 0.
- `ankylosaurus x medic_saur`
  - PlayScene launched with the active pair.
  - console error/warn 0.
- `ankylosaurus x exp_chaser`
  - PlayScene debug line showed `syn -`.
  - console error/warn 0.
- Companion selection modal displayed implemented dino partner names instead of `未発見の恐竜`.

## Balance Notes

Values are intentionally modest:

- Support damage boosts are 10% except low-HP pursuit at 12%.
- EXP boost remains 6% because `exp_chaser` already increases growth pace.
- Pickup range and healing are utility-only boosts and do not directly increase player damage.

Non-synergy combinations remain valid and playable.
