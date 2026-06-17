# ND09d New Dino Evolution Motion Sprite Sheet Pass

## Purpose

ND09c fixed the runtime cell size and improved safety margins, but user visual
review still found two release-blocking concerns:

- some contact views appeared to show clipping / adjacent-cell contamination
- row-level motion was not strong enough, especially the action row

ND09d replaces the ND09c gameplay sprite source approach with one generated
motion sheet per evolution branch. The runtime paths remain unchanged.

## Scope

Regenerated gameplay sprite sheets for all 24 new-dinosaur evolution branches:

- `ankylosaurus_speed`, `ankylosaurus_hunting`, `ankylosaurus_attack`, `ankylosaurus_zero`
- `parasaurolophus_speed`, `parasaurolophus_hunting`, `parasaurolophus_attack`, `parasaurolophus_zero`
- `stegosaurus_speed`, `stegosaurus_hunting`, `stegosaurus_attack`, `stegosaurus_zero`
- `pteranodon_speed`, `pteranodon_hunting`, `pteranodon_attack`, `pteranodon_zero`
- `compsognathus_speed`, `compsognathus_hunting`, `compsognathus_attack`, `compsognathus_zero`
- `ornithomimus_speed`, `ornithomimus_hunting`, `ornithomimus_attack`, `ornithomimus_zero`

## Motion Source Policy

ND09d uses 24 generated `4x4` motion sheets preserved under:

- `docs/assets/nd09d_sources/{branch_id}_motion_source.png`

Each generated source sheet follows:

- row 0: idle
- row 1: move / run / fly
- row 2: action
- row 3: death fallback

Local processing is limited to chroma-key removal, cell splitting, small speck
cleanup, and safe placement into the existing `512x512` runtime cells.

## Action Row Improvements

Action rows now use generated attack poses instead of duplicated idle/move
frames:

| Dino | Action direction |
| --- | --- |
| `ankylosaurus` | tail hammer wind-up / swing / impact / recovery |
| `parasaurolophus` | crest sonic charge / pulse / recovery |
| `stegosaurus` | plate charge / stomp / ground pulse / recovery |
| `pteranodon` | wing draw / slash / wind release / recovery |
| `compsognathus` | crouch / leap / bite-slash / recovery |
| `ornithomimus` | sprint wind-up / dash / kick impact / recovery |

## Margin / Contamination Review

ND09d keeps `512x512` cells and increases the placement target margins.

Report summary:

- `assetCount`: 24
- `missingAssetCount`: 0
- `edgeIssueCount`: 0
- `cellContaminationCount`: 0
- `minMargin`: 104 px
- `frameSizeStable`: true
- `regeneratedProblemCellsCount`: 0

Visual review notes:

- The previously reported top clipping on row 2 / row 3 is not present in the
  runtime sheets after ND09d safe placement.
- Adjacent-cell contamination is not visible in the ND09d contact sheets or the
  inspected runtime sheets.
- `ornithomimus_zero` and `ankylosaurus_zero` were manually opened after
  regeneration because they are representative high-risk action-pose cases.
- Some ZERO action frames intentionally retain cyan / purple / green-leaning
  energy particles. These are generated effect colors inside the cell, not
  adjacent-cell contamination.

## QA Artifacts

- `docs/assets/nd09d_new_dinos_evolution_sprite_contact.png`
- `docs/assets/nd09d_new_dinos_evolution_animation_contact.png`
- `docs/assets/nd09d_new_dinos_evolution_problem_cells_contact.png`
- `docs/assets/nd09d_new_dinos_evolution_asset_report.json`

## Runtime QA

Browser QA target:

- `debugIntroSeen=1`
- `debugAutoPlay=1`
- `debugInvincible=1`
- `debugDino={dino}`
- `debugForceEvolution={speed|hunting|attack|zero}`
- `debugStage=jungle`
- `debugDifficulty=normal`

Representative routes opened:

- `ornithomimus_zero`: canvas visible, runtime console warn/error 0
- `ankylosaurus_zero`: canvas visible, runtime console warn/error 0
- existing `velociraptor`: canvas visible, runtime console warn/error 0

Full evolution branch sweep:

- 24/24 `debugForceEvolution` routes opened
- every route produced a visible canvas
- app page runtime console warn/error count: 0

Note: the browser automation runtime emitted an unrelated Statsig network
message outside the EVOLUTION ZERO page console. It was not counted as an app
runtime warning/error.

Build/check results:

- `python -m py_compile tools\regenerate_new_dino_motion_sheets_nd09d.py`: PASS
- `node --check` relevant JS: PASS
- `git diff --check`: PASS
- `npm.cmd run build`: PASS, with the existing Vite chunk size warning only

## Remaining Risk

ND09d improves the source basis to generated motion sheets per evolution branch.
Because this is still generated art, final acceptance should remain visual:
contact sheets should be inspected whenever new source sheets are regenerated.

No main merge or push was performed in ND09d.
