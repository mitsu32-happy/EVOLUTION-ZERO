# MVP-P07b Companion Animation Gap

## Release Quality Requirement

For main integration as a release-quality feature, companion dinos should feel alive and readable during play.

Required baseline:

- Idle/follow movement has visible life, not just a static cutout sliding near the player.
- Attack, heal, pickup, defense, EXP, and boss support actions are readable without debug labels.
- Effects are timed to the companion action and appear near the correct target or player.
- The 10 companions are distinguishable in silhouette and in behavior.
- Mobile scale remains readable.
- Feedback is not overdone and does not add high-density performance risk.

## Current State

- Each companion has production icon/sprite/effect PNG assets.
- PlayScene shows one static sprite following the player.
- Follow position has orbit/bob movement, but the sprite itself is not animated.
- Actions use short effect sprites and damage/support logic.
- Debug labels can show state, but normal users rely on subtle effect feedback.

P07b judgment:

- Current state is good enough for feature-branch system validation.
- Current state is not yet release-quality for main integration.

## Main Integration Impact

Main integration impact: **blocking**.

Reason:

- Static sprite presentation creates an unfinished impression.
- Several support actions are mechanically active but visually subtle.
- The player may not reliably understand when healing, pickup assist, EXP assist, or defense support happened.

## 10 Companion Gap Matrix

| ID | Current Readability | Main-Ready Gap | Priority |
| --- | --- | --- | --- |
| `raptorling` | Role is understandable through close attack and hit effect. | Needs bite/claw motion or quick lunge. | High |
| `spino_pup` | Area role is readable by effect, but body remains static. | Needs water slash tell and recoil/pose shift. | High |
| `medic_saur` | Heal effect is present but easy to miss in combat. | Needs clear heal pulse from companion to player. | High |
| `ptera_chick` | Ranged role is understandable, but flight feel is weak. | Needs wing/hover motion and shot tell. | High |
| `tricera_calf` | Defense effect exists, but guard state is subtle. | Needs shield stance or horn brace moment. | High |
| `para_juvenile` | Pickup assist is useful, but visual cause is unclear. | Needs visible pull line or collection pulse. | Medium |
| `stego_calf` | Area/synergy role can read through effect. | Needs plate glow before pulse. | Medium |
| `rex_hatchling` | Boss role is understandable by heavy hit concept. | Needs chomp/lunge action and bigger boss-hit feedback. | High |
| `compy_pack` | Swarm fantasy is limited by single static sprite. | Needs multiple small afterimages or pack motion. | High |
| `exp_chaser` | EXP support is mechanically subtle. | Needs small EXP scan/pulse around pickups. | Medium |

## P04b Required Work

P04b should implement a lightweight animation and feedback pass before main release:

1. Add static-sheet or procedural motion per role:
   - idle bob
   - follow tilt
   - attack squash/lunge
   - heal/support pulse
2. Add action-specific timing:
   - effect appears when action triggers
   - effect origin matches companion/player/target
3. Improve role readability:
   - attack and boss: lunge/chomp
   - heal: green pulse
   - pickup/EXP: pull or scan line
   - defense: shield flash
   - ranged/flying: hover/shot tell
4. Keep performance limits:
   - no unbounded particles
   - reuse existing companion effect pool
   - keep `MAX_COMPANION_EFFECTS`
5. Add release QA:
   - normal combat without debug labels
   - mobile scale
   - ZERO/ENDLESS high-density combat

## Priority

High priority before main:

- `raptorling`, `spino_pup`, `medic_saur`, `ptera_chick`, `tricera_calf`, `rex_hatchling`, `compy_pack`.

Medium priority before main:

- `para_juvenile`, `stego_calf`, `exp_chaser`.

## Conclusion

The companion feature should not merge to main as a release feature yet.

The system foundation is strong, but animation and action feedback need a P04b-quality pass first.

## P04b Update

P04b added a lightweight runtime animation pass in `PlayScene`.

Implemented:

- per-companion animation profiles
- idle bob and follow tilt
- action lunge / pulse / guard / sonar / shockwave / swarm dash feedback
- persistent trail and action aura layers inside `companionView`
- role-specific action triggers for attack, heal, defense, pickup, and EXP support
- continued use of P04 production sprite/effect PNGs and the capped companion effect pool

P04b addresses the most obvious "static cutout sliding" issue, but final main integration still needs visual QA across all 10 companions, smartphone width, and ZERO/ENDLESS high-density scenes.

Current provisional impact after P04b:

- The animation gap is reduced.
- Main integration should still be judged only after P04b visual QA, because the implementation remains procedural rather than authored sprite-sheet animation.
