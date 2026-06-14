# MVP-P04c Companion Dino Animation Assets

## Scope

P04c generates and connects animation assets for the 10 existing companion dinos on `feature/companion-dino-p01`.

This is an asset and presentation implementation pass. It does not change save data, hatch flow, companion ownership, upgrade costs, or major AI balance values.

## Asset Generation Method

The P04 production transparent PNGs were used as the visual source of truth.

- Source sprite: `public/assets/companions/{id}_sprite_p04.png`
- Source effect: `public/assets/companions/{id}_effect_p04.png`
- Generated sprite sheet: `public/assets/companions/{id}_sprite_sheet_p04c.png`
- Generated effect sheet: `public/assets/companions/{id}_effect_sheet_p04c.png`

The generated sprite sheets are transparent PNGs with:

- 4 columns
- 3 rows
- 320 x 320 frame size
- row 0: `idle`
- row 1: `move`
- row 2: `action`

The generated effect sheets are transparent PNGs with:

- 4 columns
- 1 row
- 256 x 256 frame size
- row 0: `active`

Contact preview:

- `docs/assets/p04c_companion_animation_contact.png`

Generation report:

- `docs/assets/p04c_companion_animation_report.json`

## Asset Key Mapping

The existing companion asset keys now point to P04c sheets:

| Companion | Sprite key | Sprite path | Effect key | Effect path |
| --- | --- | --- | --- | --- |
| `raptorling` | `companions.raptorlingSprite` | `assets/companions/raptorling_sprite_sheet_p04c.png` | `companions.raptorlingEffect` | `assets/companions/raptorling_effect_sheet_p04c.png` |
| `spino_pup` | `companions.spinoPupSprite` | `assets/companions/spino_pup_sprite_sheet_p04c.png` | `companions.spinoPupEffect` | `assets/companions/spino_pup_effect_sheet_p04c.png` |
| `medic_saur` | `companions.medicSaurSprite` | `assets/companions/medic_saur_sprite_sheet_p04c.png` | `companions.medicSaurEffect` | `assets/companions/medic_saur_effect_sheet_p04c.png` |
| `ptera_chick` | `companions.pteraChickSprite` | `assets/companions/ptera_chick_sprite_sheet_p04c.png` | `companions.pteraChickEffect` | `assets/companions/ptera_chick_effect_sheet_p04c.png` |
| `tricera_calf` | `companions.triceraCalfSprite` | `assets/companions/tricera_calf_sprite_sheet_p04c.png` | `companions.triceraCalfEffect` | `assets/companions/tricera_calf_effect_sheet_p04c.png` |
| `para_juvenile` | `companions.paraJuvenileSprite` | `assets/companions/para_juvenile_sprite_sheet_p04c.png` | `companions.paraJuvenileEffect` | `assets/companions/para_juvenile_effect_sheet_p04c.png` |
| `stego_calf` | `companions.stegoCalfSprite` | `assets/companions/stego_calf_sprite_sheet_p04c.png` | `companions.stegoCalfEffect` | `assets/companions/stego_calf_effect_sheet_p04c.png` |
| `rex_hatchling` | `companions.rexHatchlingSprite` | `assets/companions/rex_hatchling_sprite_sheet_p04c.png` | `companions.rexHatchlingEffect` | `assets/companions/rex_hatchling_effect_sheet_p04c.png` |
| `compy_pack` | `companions.compyPackSprite` | `assets/companions/compy_pack_sprite_sheet_p04c.png` | `companions.compyPackEffect` | `assets/companions/compy_pack_effect_sheet_p04c.png` |
| `exp_chaser` | `companions.expChaserSprite` | `assets/companions/exp_chaser_sprite_sheet_p04c.png` | `companions.expChaserEffect` | `assets/companions/exp_chaser_effect_sheet_p04c.png` |

## Per-Companion Animation Content

| Companion | Idle | Move | Action | Special / Effect |
| --- | --- | --- | --- | --- |
| `raptorling` | light breathing bob | forward lean and dash streak | claw/bite lunge | cyan-red claw burst |
| `spino_pup` | swim-like body sway | water-trail movement | water shot posture | splash ring sheet |
| `medic_saur` | gentle support bob | soft support drift | heal pulse glow | green recovery pulse sheet |
| `ptera_chick` | wing/hover bob | higher flying tilt | air support shot | blue aerial strike sheet |
| `tricera_calf` | grounded brace | heavy step | guard stance | shield aura sheet |
| `para_juvenile` | scan-like bob | guided movement | sonic pull wave | sonar/collection sheet |
| `stego_calf` | plate glow idle | heavy movement | plate shockwave | orange/purple shock sheet |
| `rex_hatchling` | heavy breathing | weighty advance | boss bite lunge | heavy impact sheet |
| `compy_pack` | small pack bob | multi-body run | swarm dash | orange swarm slash sheet |
| `exp_chaser` | floating crystal pulse | hover trace | EXP scan pulse | purple EXP trace sheet |

## Runtime Implementation

`PlayScene` now reads companion sprite sheet metadata from `asset_manifest.js` and cuts frame textures with Pixi `Texture` + `Rectangle`.

Runtime states:

- `idle`: used when the companion is settled near the player
- `move`: used during follow movement
- `action`: used while `companionActionTimer` is active

Companion effect sheets are also cut into frames and advanced during the existing short-lived companion effect lifecycle.

P04b procedural bob, tilt, trail, aura, and action feedback remain as secondary polish on top of the P04c sheet frames.

## Performance Notes

- No new save arrays or permanent spawned entities were added.
- Sprite frame textures are derived from loaded sheet sources.
- Effect frames use the existing `companionEffects` list and `companionEffectPool`.
- `MAX_COMPANION_EFFECTS` remains unchanged.
- `performanceLoadSheddingLevel >= 2` still suppresses new companion effect spawns.

## QA Performed

- Generated all 20 P04c sheets.
- Verified alpha content and transparent corners.
- Confirmed generated contact sheet visually.

Required follow-up:

- `debugCompanionId` runtime smoke for all 10 companions.
- Smartphone-width visual check.
- ZERO/ENDLESS short soak with attack and utility companions.

## Remaining Items

- These are generated sheet variants derived from P04 art, not hand-authored frame-by-frame character animation.
- Final release judgment still requires human visual QA in combat, especially for `compy_pack`, `ptera_chick`, and support companions.

## P04d Supersession

P04d supersedes the active runtime use of P04c sheets.

Reason:

- P04c sheets were still too small in real-device play.
- Some action/move frames were too close to the cell edge.
- The walking/flying motion difference was not strong enough for release-quality readability.

Current active assets:

- `public/assets/companions/{id}_sprite_sheet_p04d.png`
- `public/assets/companions/{id}_effect_sheet_p04d.png`

P04c assets remain on disk for comparison and rollback only.
