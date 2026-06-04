# MVP-A11 Gameplay Balance Before / After

Date: 2026-06-04

## High-Level Before

- Early enemy density was already acceptable.
- HARD and EXPERT did not punish contact damage enough.
- ENDLESS and ZERO late pressure climbed too gently.
- Adaptation skill level-ups were useful but not always obvious.
- Normal evolution improved play, but the power spike could be clearer.
- ZERO evolution was visually special, but combat reward needed more weight.

## High-Level After

- Early density is intentionally close to before.
- Mid and late density climbs harder, especially ENDLESS and ZERO.
- HARD and EXPERT now have clearer contact-damage and durability differences.
- Adaptation skills gain more damage, range, targets, radius, or cooldown improvements.
- Base dinosaurs have stronger identities.
- Normal evolution has a clearer immediate benefit.
- ZERO evolution has stronger attack, range, target, ultimate, and boss-damage payoff.

## Key Numeric Direction

| Area | Before | After |
| --- | --- | --- |
| NORMAL | approachable | still approachable |
| HARD | modest damage step | clearer hit danger |
| EXPERT | pressure, but recoverable | more costly mistakes |
| ENDLESS late | gentle scaling | stronger long-run pressure |
| ZERO late | high but manageable | heavier enemy and boss pressure |
| Adaptation Lv scaling | modest | more visible per level |
| Normal evolution | useful | stronger spike |
| ZERO evolution | special | clearly above normal evolution |

## Risk Notes

- ZERO and ENDLESS should be watched for mobile performance because late caps are higher.
- EXPERT and ZERO damage should be tested without `debugWeakBoss` before final public tuning.
- Adaptation buffs may shorten NORMAL clears; this is acceptable for A11 because NORMAL is intended to prioritize爽快感.
