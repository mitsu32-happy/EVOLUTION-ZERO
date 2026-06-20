# PF04 normal attack trigger review

## Current structure

- `CombatSystem.update()` decrements the attack timer, updates existing effects/projectiles/adaptation skills, then searches for a nearest target within `targetAcquireRange`.
- If no target is acquired, normal attack processing does not run.
- Existing evolution attacks use the acquired target path.

## Issue found

For dino-specific normal attacks, `performNormalAttack()` could acquire a target but still produce no actual hit after applying the attack shape. This happens when the target is inside acquisition range but outside the specific cone/arc/rectangle/circle hit geometry.

Before PF04, the effect still spawned in that case, which made the attack look like it fired without a valid enemy.

## Fix

`performNormalAttack()` now exits without spawning the normal attack effect when `hitTargets.length <= 0`.

This preserves:

- no attack with no target
- no visual-only attack when the enemy is outside the attack shape
- normal firing when an enemy is inside the actual hit area

## Intended always-on attacks

No new six-dino base normal attack is documented as a constant aura. Any future always-on aura should be explicitly marked in `normal_attacks.js` and documented before implementation.

## QA plan

- Enemy absent: no normal attack effect.
- Enemy outside target acquisition range: no normal attack effect.
- Enemy inside acquisition range but outside attack hit shape: no visual-only effect.
- Enemy inside attack hit shape: effect and damage occur.
- Confirm existing four dinosaurs and representative new six dinosaurs.
