# PF04b normal attack motion guard

## Problem

PF04 stopped normal attack effects when the dino-specific hit shape found no targets. The follow-up concern was that other parts of the attack might still fire:

- attack animation
- action row
- attack SE
- cooldown consumption
- empty attack motion without an effect

## Review result

PlayScene only plays the player attack animation and attack SE when `combatResult.targets.length > 0`.

However, `CombatSystem.update()` consumed `attackTimer` before the dino-specific hit-shape check. That meant a target inside acquisition range but outside the actual hit shape could still consume cooldown, even though no effect or damage occurred.

## Fix

For dino-specific normal attacks, `CombatSystem.update()` now checks the actual normal attack hit candidates before consuming cooldown.

New order:

1. acquire nearest target
2. calculate attack facing
3. calculate hit candidates from the attack shape
4. if no candidates, return without cooldown consumption
5. consume cooldown
6. face the target
7. run attack effect, damage, animation, and SE through the existing result path

## QA expectations

- No enemy: no attack result, no animation, no SE, no cooldown consumption.
- Enemy out of acquisition range: no attack result, no animation, no SE, no cooldown consumption.
- Enemy in acquisition range but outside hit shape: no attack result, no animation, no SE, no cooldown consumption.
- Enemy inside hit shape: cooldown, attack animation, SE, effect, and damage occur.

## Notes

No normal attack is currently documented as an always-on aura. Future always-on attacks should use an explicit data flag and separate QA.
