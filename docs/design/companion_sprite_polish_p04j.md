# MVP-P04j Companion Sprite Polish

## Purpose

P04j polishes the P04i companion sprite sheets after real-device review.

Goals:

- remove remaining adjacent-cell contamination risk
- reduce in-game companion display size to roughly 80% of the player
- make every companion read clearly as a dinosaur or ancient creature
- keep P04f fixed-size runtime rendering intact

No save, AI, balance, hatch, or UI flow changes are included.

## P04i Issues

- Some generated cells still placed tails, wings, or effects too close to cell boundaries.
- Runtime companions were close to player size, which made them feel too dominant.
- Several special-role companions needed stronger dinosaur or ancient-creature silhouettes:
  - `ptera_chick` needed to read as a pterosaur rather than a bird.
  - `medic_saur` needed to read as a small herbivorous dinosaur rather than a plush or mammal.
  - `compy_pack` needed to read as a pack of small dinosaurs rather than small animals.
  - `exp_chaser` needed a dinosaur-derived body instead of an abstract floating support object.

## Generation Rules

The P04j source prompts used these stricter rules:

- fixed right-facing side-view direction
- one companion species only in each frame
- no other dinosaurs, animals, creatures, silhouettes, or background characters
- subject centered in each cell
- subject occupies no more than roughly 55% of the cell width and height
- wide empty `#ff00ff` padding around every frame
- transparent-ready image, no text, no grid, no separators, no shadows
- P04 production PNGs used as visual style reference only

## Post-Processing

Helper:

- `tools/process_companion_sprite_p04j.py`

Processing steps:

- remove `#ff00ff` chroma key
- slice source rows/columns
- crop each source cell inward by `30px` before normalization
- normalize each pose into fixed `384 x 384` cells
- reduce normalized subject size versus P04i to preserve cell margins
- run final chroma removal after sheet assembly
- generate contact and JSON QA artifacts

QA artifacts:

- `docs/assets/p04j_companion_sprite_contact.png`
- `docs/assets/p04j_companion_sprite_report.json`

Report summary:

- Missing frames: `0`
- Frame edge issues: `0`
- Minimum frame margin: `45px` or greater

## Runtime Size

P04j changes the companion runtime baseline only:

- before: `124 x 98`
- after: `92 x 74`

The existing per-companion `displayScale` values remain in place. This keeps
large companions such as `rex_hatchling` and `tricera_calf` readable while
keeping the visible companion under the player-sized target.

P04f fixed-size texture switching remains unchanged:

- fixed width/height are reapplied after texture changes
- anchor remains fixed
- fallback and sprite sheet frames are not alternated
- normal guide ring remains hidden

## Active Sprite Sheets

| Companion | Runtime sheet | Visual check |
| --- | --- | --- |
| `raptorling` | `public/assets/companions/raptorling_sprite_sheet_p04j.png` | Small raptor silhouette, fast attack poses. |
| `spino_pup` | `public/assets/companions/spino_pup_sprite_sheet_p04j.png` | Spinosaur sail and water attack identity remain visible. |
| `medic_saur` | `public/assets/companions/medic_saur_sprite_sheet_p04j.png` | Small herbivorous dinosaur, self-contained healing frames. |
| `ptera_chick` | `public/assets/companions/ptera_chick_sprite_sheet_p04j.png` | Pterosaur-like wing and head silhouette, not a bird. |
| `tricera_calf` | `public/assets/companions/tricera_calf_sprite_sheet_p04j.png` | Triceratops calf silhouette and guard action. |
| `para_juvenile` | `public/assets/companions/para_juvenile_sprite_sheet_p04j.png` | Parasaurolophus crest and sonar/action identity. |
| `stego_calf` | `public/assets/companions/stego_calf_sprite_sheet_p04j.png` | Stegosaurus plates and area action. |
| `rex_hatchling` | `public/assets/companions/rex_hatchling_sprite_sheet_p04j.png` | T. rex hatchling silhouette and heavy bite action. |
| `compy_pack` | `public/assets/companions/compy_pack_sprite_sheet_p04j.png` | Three small dinosaurs only, pack motion. |
| `exp_chaser` | `public/assets/companions/exp_chaser_sprite_sheet_p04j.png` | Reptilian support creature with crystal/EXP scan cues. |

## Remaining QA

- Real-device smartphone review remains required for final art judgment.
- Confirm no subject becomes too small after the 80% runtime scale change.
- Confirm action frames remain readable in dense combat.
- Confirm no frame appears as a non-dinosaur silhouette during motion.
