# MVP-P04i Companion Sprite Sheet Regeneration

P04i replaces the P04h procedural leg-pose direction with generated sprite
sheets that are authored as animation frames from the start.

## Direction Change From P04h

P04h created stronger movement by fading and rebuilding leg areas from the
existing still sprites. That was useful for proving the runtime path, but it
still read as a constructed pose pass.

P04i changes the source strategy:

- each cell is generated as one complete finished pose
- no leg-only composition is used for the final P04i sheets
- every frame is prompted as a right-facing side-view pose
- every frame forbids unrelated dinosaurs or extra creatures
- `compy_pack` is the only exception, and it is limited to the intended three
  compy companions
- generated source sheets use a flat `#ff00ff` chroma-key background
- local post-processing removes the key color and normalizes every cell to
  `384 x 384`

P04f fixed-size runtime rendering remains unchanged.

## Generated Runtime Sheets

All active companion sprite keys now point to:

| Companion | Runtime sheet | Move content | Action content |
| --- | --- | --- | --- |
| `raptorling` | `public/assets/companions/raptorling_sprite_sheet_p04i.png` | Right-facing fast run with alternating contact and kick-off poses. | Leap, claw, bite, recovery. |
| `spino_pup` | `public/assets/companions/spino_pup_sprite_sheet_p04i.png` | Heavy right-facing walk with sail, tail, and weight shift. | Water shot, water blade, splash recoil, recovery. |
| `medic_saur` | `public/assets/companions/medic_saur_sprite_sheet_p04i.png` | Gentle right-facing walk. | Self-contained healing aura, no patient or extra dinosaur. |
| `ptera_chick` | `public/assets/companions/ptera_chick_sprite_sheet_p04i.png` | Right-facing wing-up, wing-down, glide, rise/sink. | Aerial aim, projectile, recoil, recovery. |
| `tricera_calf` | `public/assets/companions/tricera_calf_sprite_sheet_p04i.png` | Heavy right-facing stomp walk with horn/head motion. | Brace, shield aura, guard pulse, recovery. |
| `para_juvenile` | `public/assets/companions/para_juvenile_sprite_sheet_p04i.png` | Light right-facing walk with crest/head/tail motion. | Crest charge, sonar pulse, pickup signal, recovery. |
| `stego_calf` | `public/assets/companions/stego_calf_sprite_sheet_p04i.png` | Heavy right-facing walk with plate/tail motion. | Plate charge, stomp shockwave, area pulse, recovery. |
| `rex_hatchling` | `public/assets/companions/rex_hatchling_sprite_sheet_p04i.png` | Forceful right-facing small-run with counterbalancing tail. | Charge, bite, impact, recovery. |
| `compy_pack` | `public/assets/companions/compy_pack_sprite_sheet_p04i.png` | Three-compy right-facing pack run with offset timing. | Group lunge, bite flurry, split strike, recovery. |
| `exp_chaser` | `public/assets/companions/exp_chaser_sprite_sheet_p04i.png` | Right-facing hover pursuit, rotation, chase tilt, scan particles. | Scan charge, EXP particle attraction, tracking beam, recovery. |

## Frame Layout

- Columns: `4`
- Rows: `3`
- Cell size: `384 x 384`
- Row 0: `idle`
- Row 1: `move`
- Row 2: `action`

This keeps the existing PlayScene animation metadata and frame switching logic
compatible with the P04f stabilization.

## Post-Processing

Helper:

- `tools/process_companion_sprite_p04i.py`

The helper performs:

- `#ff00ff` key removal
- per-cell slicing from the generated source
- alpha bbox normalization
- fixed `384 x 384` runtime cells
- baseline normalization for walking vs flying/floating companions
- contact sheet generation
- JSON QA report generation

QA artifacts:

- `docs/assets/p04i_companion_sprite_contact.png`
- `docs/assets/p04i_companion_sprite_report.json`

Report summary:

- Missing frames: `0`
- Frame edge issues: `0`
- Minimum frame margin: `18px`

## Visual QA Notes

The contact sheet confirms:

- all companions are consistently right-facing
- `medic_saur` healing frames do not include another dinosaur
- `para_juvenile` action frames remain a single companion
- no obvious adjacent-cell contamination is visible
- the P04f fixed display size can continue to control final in-game size

## Remaining Work

P04i improves the source direction and removes the P04h procedural-leg approach,
but final art still needs live gameplay review on device:

- check whether the right-facing-only source and runtime facing flip feel natural
- verify action frames read clearly at smartphone size
- inspect each companion during actual attack/support triggers
- decide whether future P04j/P08 work should use a dedicated artist pass or
  model-native transparent generation for even cleaner edges

## P04j Supersession

P04j supersedes P04i for active runtime use.

P04j keeps the P04i direction:

- right-facing generated poses
- no unrelated dinosaurs or support subjects
- fixed `384 x 384` runtime cells
- P04f fixed-size rendering unchanged

P04j improves:

- stricter source prompts for dinosaur/ancient-creature readability
- wider generated-source padding
- `30px` inward source-cell crop before normalization
- smaller normalized subject scale to preserve runtime margins
- active runtime display baseline reduced to about 80% of player size

New QA artifacts:

- `docs/assets/p04j_companion_sprite_contact.png`
- `docs/assets/p04j_companion_sprite_report.json`

The P04j report records `0` missing frames, `0` edge issues, and minimum frame
margins of `45px` or greater.
