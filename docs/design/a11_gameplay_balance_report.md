# MVP-A11 Gameplay Balance Report

Date: 2026-06-04

## Enemy Count And Pressure

Adjusted files:

- `src/systems/spawn_system.js`
- `src/data/run_config.js`

Changes:

- Added elapsed enemy pressure as a separate helper so early game stays close to current pacing.
- Normal stages now add extra cap pressure mostly after about 80s and 140s.
- ENDLESS and ZERO add more late cap pressure and can reach higher soft caps.
- ENDLESS late phases now scale to higher spawn rate, damage, and enemy cap.
- ZERO mid and late pressure ramps start earlier and climb higher.

Intent:

- Early game remains readable.
- Mid game becomes busier.
- Late game and ZERO feel more dangerous and crowded.

## Enemy Damage And Difficulty

Adjusted files:

- `src/data/run_config.js`
- `src/systems/spawn_system.js`
- `src/scenes/play_scene.js`

Changes:

- Added difficulty enemy HP and damage multipliers.
- HARD receives a clearer contact-damage step.
- EXPERT receives a stronger contact-damage step.
- ZERO enemy damage baseline and late scaling increased.
- ZERO second/final boss hazard damage and final summon pressure increased.
- ENDLESS boss long-run damage scaling increased.

Intent:

- NORMAL remains爽快感-focused.
- HARD makes repeated hits dangerous.
- EXPERT requires cleaner movement.
- ZERO is intentionally heavy, especially late.

## Adaptation Skills

Adjusted files:

- `src/data/adaptation_skills.js`
- `src/systems/combat_system.js`

Changes:

- Most adaptation skill base damage, range, search range, or cooldown received modest buffs.
- Level scaling now adds more visible damage growth.
- Skill cooldown reduction per level is stronger.
- Several skill implementations now gain more targets, range, radius, or projectile count at higher levels.

Intent:

- Lv1 to Lv2 and Lv3 to Lv4 should feel more noticeable.
- Area and multi-hit skills should clear groups more satisfyingly.

## Dinosaur Identity

Adjusted files:

- `src/data/run_config.js`
- `src/data/normal_attacks.js`

Changes:

- Velociraptor: faster movement, faster attacks, slightly larger target handling.
- Triceratops: higher HP, lower damage taken, stronger knockback and stability.
- Tyrannosaurus: higher base hit damage, range, and one-hit identity.
- Spinosaurus: wider mid-range water control with better range, targets, and survivability.

Intent:

- Each starting dinosaur should feel more distinct before evolution.

## Evolution And ZERO Evolution

Adjusted files:

- `src/entities/player.js`
- `src/systems/combat_system.js`
- `src/systems/ultimate_system.js`

Changes:

- Speed evolution attacks faster and gains more practical acquisition range.
- Hunting evolution gains more range, targets, and damage.
- Attack evolution gains more damage and knockback while staying heavy.
- ZERO evolution gains stronger damage, range, acquisition, cooldown, and adaptation damage.
- ZERO ultimates gain more area, targets, boss multipliers, and damage.

Intent:

- Normal evolution should feel like an immediate power spike.
- ZERO evolution should feel clearly above normal evolution while ZERO mode remains dangerous.

## QA Notes

The final verification for this MVP should include:

- NORMAL jungle or stage clear route
- HARD or EXPERT stage route
- ZERO route with debug final boss
- ENDLESS fast route if time permits
- Runtime console error/warn check
- `npm.cmd run build`

## Late-Game Pressure Follow-Up

Adjusted files:

- `src/data/run_config.js`
- `src/systems/spawn_system.js`
- `src/scenes/play_scene.js`

Changes:

- ENDLESS phase 2+ and long-run scaling now gain more HP, damage, spawn rate, enemy cap, and elite pressure.
- ZERO enemy damage, spawn rate, enemy cap, late pressure, and boss damage were raised.
- Boss damage scaling now applies to explicit boss attack entries, including hazard damage and melee damage multipliers.
- HARD/EXPERT enemy and boss damage multipliers were raised without changing early spawn composition.
- Heal pickup amount is slightly reduced in HARD, EXPERT, ZERO, and ENDLESS late runs.

Intent:

- Keep early NORMAL clearable.
- Preserve adaptation skill爽快感.
- Make ENDLESS eventually collapse under escalating pressure.
- Make ZERO less likely to be cleared on the first attempt, especially near the final boss.
