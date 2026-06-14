# MVP-P04d Companion Animation Asset Regeneration

## Purpose

P04d regenerates the 10 Companion Dino animation sheets to solve the remaining release-quality problems found after P04c/P04c.1:

- in-play companions still looked too small
- move frames did not read clearly as walking/flying/floating
- several P04c cells were too close to the frame edge
- some action frames risked adjacent-cell contamination when rendered

This pass does not change companion save data, AI behavior, balance values, egg flow, hatch flow, or main branch integration.

## Generated Assets

All assets are stored under `public/assets/companions/`.

| Companion | Sprite Sheet | Effect Sheet |
| --- | --- | --- |
| `raptorling` | `raptorling_sprite_sheet_p04d.png` | `raptorling_effect_sheet_p04d.png` |
| `spino_pup` | `spino_pup_sprite_sheet_p04d.png` | `spino_pup_effect_sheet_p04d.png` |
| `medic_saur` | `medic_saur_sprite_sheet_p04d.png` | `medic_saur_effect_sheet_p04d.png` |
| `ptera_chick` | `ptera_chick_sprite_sheet_p04d.png` | `ptera_chick_effect_sheet_p04d.png` |
| `tricera_calf` | `tricera_calf_sprite_sheet_p04d.png` | `tricera_calf_effect_sheet_p04d.png` |
| `para_juvenile` | `para_juvenile_sprite_sheet_p04d.png` | `para_juvenile_effect_sheet_p04d.png` |
| `stego_calf` | `stego_calf_sprite_sheet_p04d.png` | `stego_calf_effect_sheet_p04d.png` |
| `rex_hatchling` | `rex_hatchling_sprite_sheet_p04d.png` | `rex_hatchling_effect_sheet_p04d.png` |
| `compy_pack` | `compy_pack_sprite_sheet_p04d.png` | `compy_pack_effect_sheet_p04d.png` |
| `exp_chaser` | `exp_chaser_sprite_sheet_p04d.png` | `exp_chaser_effect_sheet_p04d.png` |

Supporting QA files:

- `docs/assets/p04d_companion_animation_contact.png`
- `docs/assets/p04d_companion_animation_report.json`

## Sheet Specs

Sprite sheets:

- 4 columns x 3 rows
- frame size: 384 x 384
- rows: `idle`, `move`, `action`
- transparent PNG
- each frame is centered with safety padding

Effect sheets:

- 4 columns x 1 row
- frame size: 320 x 320
- row: `active`
- transparent PNG
- each effect is centered with safety padding

## Edge and Cell Contamination Prevention

P04c had edge-risk cells in several action/move rows, especially `spino_pup`, `ptera_chick`, `stego_calf`, `rex_hatchling`, and `compy_pack`.

P04d fixes this by:

- increasing sprite frame size from 320 to 384
- increasing effect frame size from 256 to 320
- cropping each source subject by alpha bounds before placement
- resizing into a safe inner area
- recentering every frame inside its own cell
- validating all sprite/effect cells for edge margin

The P04d validation report records no edge-risk cells below the safety threshold.

## Walk / Move Improvements

For walking companions:

- move frames alternate visible left/right leg cue positions
- intermediate frames include a crossed/centered leg posture
- body scale and vertical position vary across the cycle
- the body leans forward/back during movement

For non-walking companions:

- `ptera_chick`: move frames emphasize wingbeat and vertical flight bob
- `compy_pack`: move/action frames emphasize multiple small bodies rushing together
- `exp_chaser`: move/action frames emphasize floating scan and particle follow behavior

## Per-Companion Improvements

| Companion | Improvement |
| --- | --- |
| `raptorling` | larger single-target predator silhouette, stronger alternating leg cues, clearer lunge action |
| `spino_pup` | larger aquatic body, water-colored move/action cues, cleaned action cell margins |
| `medic_saur` | larger support silhouette, green pulse action frames, readable heal feedback |
| `ptera_chick` | stronger flying/wingbeat posture and air-shot action cue |
| `tricera_calf` | larger heavy body close to player presence, guard aura action frames |
| `para_juvenile` | clearer walking support body plus sonar/collection action cue |
| `stego_calf` | larger plate silhouette, shockwave action cue, cleaned action cell margins |
| `rex_hatchling` | near-player presence, stronger bite/lunge action, cleaned right-edge risk |
| `compy_pack` | enlarged pack readability, stronger rushing lines and group movement |
| `exp_chaser` | larger floating support silhouette, purple scan/EXP trace action cue |

## Runtime Connection

`src/data/asset_manifest.js` now points the existing companion sprite/effect keys to the P04d sheets.

P04c assets are preserved on disk for comparison and rollback, but are no longer the active manifest targets.

`PlayScene` now uses:

- companion display baseline: 170 x 134
- wider follow offset from the player
- wider orbit distance
- larger default companion effect scale

The normal guide ring remains hidden in normal play. It is available only through:

- `debugCompanion=1`
- `debugCompanionGuide=1`

## Performance Notes

- No new persistent gameplay arrays were added.
- Existing `companionEffects` pooling and `MAX_COMPANION_EFFECTS` limit remain active.
- `performanceLoadSheddingLevel >= 2` still blocks new companion effects.
- Larger sheets increase texture size, but the number of active companion sprites/effects is unchanged.
- P04d should be rechecked in ZERO/ENDLESS with `debugPerformance=1` before main integration.

## Remaining QA

- Run `debugCompanionId` smoke checks for all 10 companions.
- Confirm real iPhone/PWA visibility after the larger display baseline.
- Check dense boss fights to ensure the larger companion does not block enemy/projectile readability.
- If action timing is still unclear, tune action effect timing rather than changing AI or damage.

## P04e Supersession

P04d is no longer the active runtime sheet set.

Reason:

- P04d runtime size was too large after `displayScale`, profile scale, and action scale stacked together.
- Some source-level small fragments still looked like cell contamination after enlargement.
- P04d action/backdrop strokes increased the flicker/fragment impression.

P04e supersedes P04d by:

- regenerating sheets from cleaned P04 single PNGs, not from P04c/P04d sheets
- removing small isolated alpha components before frame generation
- reducing runtime display baseline to `124 x 98`
- removing permanent `profile.scale` from the runtime scale stack
- keeping P04d files only for comparison/rollback

P04f follow-up:

- P04f did not regenerate assets.
- P04f fixed the remaining bean-size/standard-size flicker in runtime by reapplying fixed sprite display size every time the companion texture changes.
- P04e remains the active asset set after P04f.

P04g follow-up:

- P04g adds new active `public/assets/companions/{id}_sprite_sheet_p04g.png` sheets and keeps the `384 x 384` cell layout.
- Only the `move` row is regenerated; idle/action rows are inherited from P04e.
- P04g avoids additive foot markers, afterimages, and ghost-body layering because those read as double images in play.
- Runtime sizing, anchors, and P04f frame-size stabilization were not changed.
- Contact image: `docs/assets/p04g_companion_walk_contact.png`.
- Detailed notes: `docs/design/companion_walk_motion_p04g.md`.
