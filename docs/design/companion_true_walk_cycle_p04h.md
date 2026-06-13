# MVP-P04h Companion True Walk Cycle

P04h adds a stronger movement animation pass for Companion Dino. P04g improved safety and removed double-image artifacts, but it still relied on whole-sprite pose changes. P04h generates new active sprite sheets with dedicated movement frames.

## Scope

- Active sprite sheets: `public/assets/companions/{id}_sprite_sheet_p04h.png`
- Cell size: `384 x 384`
- Layout: `4 columns x 3 rows`
- Rows: `idle`, `move`, `action`
- Updated row: `move`
- Idle/action rows are inherited from the previous P04g/P04e sheet path
- Effect sheets are unchanged
- Save data, AI, cooldowns, damage, balance, and P04f runtime fixed-size rendering are unchanged

P04g sheets remain on disk as fallback/reference.

## Generation Method

P04h starts from clean P04 single companion PNGs, removes stray alpha components, and builds move frames as distinct poses.

Walking companions:

- original lower-leg area is faded back
- new articulated legs are drawn per frame as body parts
- frames use different leg placement instead of only scaling/tilting the whole sprite
- four-frame loop: left-forward contact, low/crossing step, right-forward contact, kick-off

Non-walking companions:

- `ptera_chick`: wing-up, wing-down, body-up, body-down flap silhouettes
- `compy_pack`: multiple bodies move in offset phases so the pack reads as running
- `exp_chaser`: floating body positions plus scan/particle motion

## Per-Companion Frames

| Companion | P04h move content |
| --- | --- |
| `raptorling` | Small-run cycle with alternating long front/rear legs and a lifted kick-off frame. |
| `spino_pup` | Heavier low gait with longer bracing legs and slower weight-shift feel. |
| `medic_saur` | Gentle, upright walk with smaller leg extension and softer vertical motion. |
| `tricera_calf` | Heavy quadruped steps with paired support legs and stomp-like contact. |
| `para_juvenile` | Light biped walk with more visible crossing and kick-off leg placement. |
| `stego_calf` | Heavy plate-backed walk with low body and alternating support legs. |
| `rex_hatchling` | Power trot with forward/rear leg swaps and lifted kick-off. |
| `ptera_chick` | Wing flap cycle with raised/lowered wing silhouette and body bob. |
| `compy_pack` | Pack run cycle with multiple bodies offset by position and timing. |
| `exp_chaser` | Floating tracking cycle with vertical drift and scan particles. |

## P04g Improvements

Compared with P04g:

- walking frames include separately posed legs
- the move row is not only whole-sprite scale/tilt/position changes
- no additive foot-marker lines are used
- no ghost-body overlay is used for walking companions
- P04f fixed-size rendering remains untouched

## QA Notes

Required checks:

- `debugCompanionId` for all 10 companions
- no size flicker
- no bean-size/standard-size alternation
- no adjacent-cell contamination
- no normal guide ring
- console error/warn 0
- build success

## Remaining Work

P04h is a procedural true-walk generation pass. It provides distinct leg poses, but a hand-authored or model-generated frame-by-frame sheet would still improve anatomy and polish before final main integration.
