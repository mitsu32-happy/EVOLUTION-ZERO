# Combat System Spec

## MVP-107 Scope

MVP-107 is a specification and preparation phase for base dinosaur normal attacks.
It does not replace the current runtime attack logic yet. The goal is to define the data shape, hit area policy, visual effect policy, and next implementation steps for MVP-108.

## Attack Categories

### Normal Attack

- Available before evolution.
- Different for each base dinosaur.
- Auto-fired by the combat system.
- Supports the concept that dinosaur selection is a playstyle choice.
- Separate from level-up skills, adaptation skills, and special attacks.
- Uses compact effects and readable hit timing so mobile play remains clear.

### Adaptation Skill

- Unlocked or expanded through DNA research and level-up choices.
- Belongs to the one-run build layer.
- Can add status, projectile, field, or passive behavior.
- Should not replace the base dinosaur normal attack identity.

### Special Attack

- Appears only after evolution.
- Uses evolution-specific icons and HUD display.
- Higher impact than normal attacks and adaptation skills.
- Not part of MVP-107 / MVP-108 normal attack implementation.

## Base Dinosaur Normal Attacks

### Velociraptor: Raptor Claw

- Role: speed type.
- Concept: fast close-range claw slash.
- Attack interval: short.
- Range: narrow.
- Targeting: single target to small arc.
- Hit shape: short forward arc.
- Effect direction: cyan claw slash, short-lived.
- Gameplay identity: keeps pressure with high tempo, but needs positioning.

Planned data:

- `id`: `raptorClaw`
- `ownerDinoId`: `velociraptor`
- `attackType`: `arc`
- `damage`: 12
- `cooldown`: 0.5
- `range`: 76
- `angle`: 70
- `originOffset`: `{ x: 26, y: 0 }`
- `maxTargets`: 2
- `knockback`: 14
- `hitTiming`: 0.11
- `effectKey`: `normalAttackEffects.raptorClawSlash`
- `iconKey`: `normalAttackIcons.raptorClaw`

### Triceratops: Horn Impact

- Role: defense / control type.
- Concept: horn thrust and short frontal impact.
- Attack interval: medium.
- Range: short to medium.
- Targeting: front width, designed to stop groups.
- Hit shape: forward rectangle by default. Cone can be tested if rectangle feels stiff.
- Effect direction: horn impact, dust, amber or blue-green shock.
- Gameplay identity: slower but safer, with stronger knockback and crowd control.

Planned data:

- `id`: `triceratopsHornImpact`
- `ownerDinoId`: `triceratops`
- `attackType`: `rectangle`
- `damage`: 16
- `cooldown`: 0.75
- `range`: 82
- `width`: 62
- `originOffset`: `{ x: 32, y: 0 }`
- `maxTargets`: 3
- `knockback`: 34
- `hitTiming`: 0.18
- `effectKey`: `normalAttackEffects.triceratopsHornImpact`
- `iconKey`: `normalAttackIcons.triceratopsHorn`

### Tyrannosaurus: Bite Shock

- Role: heavy attack type.
- Concept: bite and short shock roar.
- Attack interval: slow.
- Range: medium.
- Targeting: wider forward area.
- Hit shape: forward cone.
- Effect direction: red-orange bite marks and shock wave.
- Gameplay identity: large hits with slower tempo and heavier commitment.

Planned data:

- `id`: `trexBiteShock`
- `ownerDinoId`: `tyrannosaurus`
- `attackType`: `cone`
- `damage`: 26
- `cooldown`: 0.92
- `range`: 94
- `angle`: 92
- `originOffset`: `{ x: 36, y: 0 }`
- `maxTargets`: 3
- `knockback`: 26
- `hitTiming`: 0.22
- `effectKey`: `normalAttackEffects.trexBiteShock`
- `iconKey`: `normalAttackIcons.trexBite`

## Hit Detection Policy

Normal attacks should be represented by data, not by hardcoded dinosaur branches.

Shared fields:

- `id`: stable attack id.
- `name`: Japanese display name.
- `ownerDinoId`: base dinosaur id.
- `attackType`: `arc`, `cone`, `rectangle`, or `circle`.
- `damage`: base damage before skills/research.
- `cooldown`: seconds between auto attacks.
- `range`: forward reach or radius.
- `angle`: arc/cone angle in degrees.
- `width`: rectangle width.
- `originOffset`: offset from player position along facing direction.
- `maxTargets`: maximum enemies affected by one attack.
- `knockback`: knockback strength.
- `hitTiming`: normalized or second-based timing from animation start to hit.
- `facing`: normally `target`; future values may include `move` or `locked`.
- `effectKey`: visual effect asset key.
- `iconKey`: normal attack icon key.
- `description`: short UI/debug text.

Shape behavior:

- `arc`: checks distance and angle from the facing vector; good for fast slashes.
- `cone`: checks distance and angle with a wider visual fan; good for bite/roar attacks.
- `rectangle`: projects target position into local facing coordinates; good for horn charge and shove attacks.
- `circle`: reserved for future centered pulses; not used by the MVP-107 base dinosaurs.

Facing:

- The attack should face the current acquired target at fire time.
- The player sprite may turn toward the target as it does today.
- Hit detection should not depend on screen direction; it uses world-space vectors.

Hit timing:

- MVP-108 should trigger the hit after the attack animation begins, using `hitTiming`.
- Until animation events are formalized, `hitTiming` can be implemented as a short delayed damage event inside `CombatSystem`.

## Effect Asset Policy

Future generated effects:

- `public/assets/effects/normal_attacks/raptor_claw_slash.png`
- `public/assets/effects/normal_attacks/triceratops_horn_impact.png`
- `public/assets/effects/normal_attacks/tyrannosaurus_bite_shock.png`

Rules:

- Transparent PNG.
- Text-free.
- Short duration, roughly 0.12 to 0.28 seconds.
- Rotates to match attack direction.
- Can be mirrored when needed.
- Readable on jungle, volcano, swamp, and ruins battle backgrounds.
- Not overly bright; gameplay readability is more important than spectacle.
- No pop, cute, comic, or generic fantasy styling.

Effect identity:

- Raptor: cyan short claw slash.
- Triceratops: amber / blue-green horn impact and dust.
- Tyrannosaurus: red-orange bite mark and shock wave.

## Icon Asset Policy

Future generated icons:

- `public/assets/ui/skills/normal_attack/icon_raptor_claw.png`
- `public/assets/ui/skills/normal_attack/icon_triceratops_horn.png`
- `public/assets/ui/skills/normal_attack/icon_trex_bite.png`

Usage:

- Skill/debug explanations.
- Codex combat profile.
- Future result or loadout summaries.
- Not shown as a selectable level-up skill by default.

Rules:

- Text-free transparent PNG.
- Small-size readability first.
- Same dark sci-fi, DNA research UI tone as HUD and research icons.

## Data Preparation

MVP-107 adds `src/data/normal_attacks.js` as the source of planned normal attack definitions.

Current preparation:

- `DINO_CONFIGS.velociraptor.normalAttackId = 'raptorClaw'`
- `DINO_CONFIGS.triceratops.normalAttackId = 'triceratopsHornImpact'`
- `DINO_CONFIGS.tyrannosaurus.normalAttackId = 'trexBiteShock'`
- `CombatSystem.applyDinoConfig()` stores the matching normal attack definition for future use.

Runtime behavior is intentionally unchanged in MVP-107. Existing attack speed/range/damage bonuses remain active until MVP-108 replaces the normal attack execution path.

## MVP-108 Implementation Plan

1. Add generic target query helpers for `arc`, `cone`, and `rectangle`.
2. Replace hardcoded base `performNormalAttack()` behavior with data-driven normal attack execution.
3. Keep evolution attack branches separate and only apply after evolution.
4. Trigger attack animation row 3 through `player.playAction('attack')`.
5. Apply `hitTiming` to delay damage and effect emission until the animation reads correctly.
6. Add generated normal attack effect PNGs and register them in `asset_manifest.js`.
7. Add generated normal attack icons and register them only for UI/debug/codex usage.
8. Verify each base dinosaur:
   - Velociraptor: fast short arc.
   - Triceratops: frontal shove with knockback.
   - Tyrannosaurus: slow high-damage cone.
9. Confirm no changes to save format, adaptation skill unlocks, or special attack logic.

## MVP-108 Implementation Notes

MVP-108 connects the MVP-107 normal attack definitions to live play while keeping adaptation skills, evolution attacks, and special attacks out of scope.

Implemented hit shapes:

- `arc`: distance plus facing-angle check. Used by `raptorClaw`.
- `rectangle`: local forward/side projection from the attack origin. Used by `triceratopsHornImpact`.
- `cone`: distance plus wider facing-angle check. Used by `trexBiteShock`.

Runtime fields now consumed by `CombatSystem`:

- `damage`
- `cooldown`
- `range`
- `angle`
- `width`
- `originOffset`
- `maxTargets`
- `knockback`
- `effectKey`
- `effectDuration`
- `effectSize`
- `effectOffset`

Balance snapshot:

- Velociraptor `raptorClaw`: base damage 12, cooldown 0.5, range 76, 70 degree arc, max 2 targets.
- Triceratops `triceratopsHornImpact`: base damage 16, cooldown 0.75, range 82, width 62 rectangle, max 3 targets, strong knockback.
- Tyrannosaurus `trexBiteShock`: base damage 26, cooldown 0.92, range 94, 92 degree cone, max 3 targets.

Generated effect assets:

- `public/assets/effects/attacks/raptor_claw_slash.png`
- `public/assets/effects/attacks/triceratops_horn_impact.png`
- `public/assets/effects/attacks/tyrannosaurus_bite_shock.png`

Generated icon assets:

- `public/assets/ui/skills/icon_raptor_claw.png`
- `public/assets/ui/skills/icon_triceratops_horn.png`
- `public/assets/ui/skills/icon_trex_bite.png`

Fallback:

- If a normal attack effect texture is not loaded yet, `CombatSystem` draws a lightweight Graphics fallback for that attack id.
- Normal attack icons are registered for future UI/codex/debug use, but are not required for runtime combat.

Debug:

- `?debugDino=velociraptor`
- `?debugDino=triceratops`
- `?debugDino=tyrannosaurus`

Next extension direction:

- Adaptation skills should build on top of the normal attack identity rather than replacing it.
- Future skill effects can reuse the same target query helpers, but should live in a separate adaptation-skill execution layer.

## Prohibited Expressions

- Dinosaur level or permanent dinosaur Lv wording.
- Stage-like evolution progression.
- Linear evolution tree wording.
- Presenting normal attacks as adaptation skills.
- Presenting special attacks before evolution.
## MVP-139 Tyrannosaurus First-Hit Adjustment

- `trexBiteShock` was adjusted so its trigger timing and actual hit cone line up better.
- Range changed from 94 to 112 before dino bonuses.
- Cone angle changed from 92 degrees to 102 degrees.
- Origin offset moved slightly forward from 36 to 42.
- Effect size was widened so the bite shock visual better matches the hit area.
- The tyrannosaurus normal attack remains slower and heavier than the velociraptor and triceratops attacks.
