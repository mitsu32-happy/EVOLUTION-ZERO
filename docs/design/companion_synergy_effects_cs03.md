# Companion Synergy Effects CS03

## Scope

CS03 connects the enabled Companion Synergy data to play-time effects only.

- UI display is not implemented in this pass.
- Save data is unchanged.
- The six future synergies remain disabled.
- Effect values are read from `src/data/companion_synergy.js`.

## Active Effects

| Player dino | Companion | synergyId | effectType | value | Runtime effect |
| --- | --- | --- | --- | --- | --- |
| `tyrannosaurus` | `rex_hatchling` | `tyranno_rex_boss_hunter` | `bossDamage` | `0.12` | Player attack damage against bosses is multiplied by `1.12`. Normal enemies are not affected. |
| `velociraptor` | `raptorling` | `raptor_double_claw` | `critRate` | `0.06` | Player attack critical chance gains `+6%`, clamped with the existing critical path. |
| `spinosaurus` | `spino_pup` | `spino_tide_support` | `companionSkillDamage` | `0.12` | `spino_pup` support attack damage is multiplied by `1.12`. Player damage is not changed by this synergy. |
| `triceratops` | `tricera_calf` | `tricera_guard_resonance` | `damageTaken` | `-0.1` | Player incoming damage multiplier is multiplied by `0.9`. Debug invincibility still overrides to `0`. |

## Runtime Hooks

- `PlayScene.refreshCompanionSynergy()` resolves the active enabled synergy from the selected player dino and selected companion.
- `CombatSystem.setCompanionSynergy()` receives the active synergy once at run setup rather than searching every frame.
- `CombatSystem.applyPlayerAttackDamage()` applies player-side boss damage and critical effects target-by-target.
- `PlayScene.updateCompanionSupportAttack()` applies the `spino_pup` support damage synergy only to that companion's own attack.
- `debugPerformance` snapshots and `debugCompanion=1` include synergy id/type/value for verification.

## Non-Synergy Behavior

- Non-matching player/companion pairs return `null` from `getCompanionSynergy({ includeDisabled: false })`.
- Disabled future synergies are ignored by runtime effects.
- No companion selected means no synergy.
- No save field is written for synergy state.

## Balance Notes

- Boss damage is boss-only and does not affect normal enemies.
- Critical chance is capped at `75%` inside the combat helper to avoid runaway stacking.
- Damage taken reduction is clamped so the final multiplier cannot go below `0.25` through this hook.
- CS03 avoids adding extra projectiles/effects, so performance impact is negligible.

## Remaining Work

- CS04 should add UI display in the companion selection/research surfaces.
- CS05 should perform balance QA in NORMAL/HARD/EXPERT/ZERO with matching and non-matching pairs.
