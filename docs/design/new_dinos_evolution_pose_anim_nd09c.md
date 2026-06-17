# ND09c New Dino Evolution Hero Pose / Animation Sheet Pass

## Purpose

ND09b improved the evolution-branch creature designs, but two production issues
remained possible:

- evolution hero images could drift from the existing front-facing intimidation
  hero composition
- evolution gameplay sheets could look like static branch art rather than
  right-facing animation-ready sprite sheets

ND09c keeps the ND09b evolution design direction, then regenerates the hero
composition sources and sprite-pose sources for all 24 new-dino evolution
branches.

## Scope

Target branches:

- `ankylosaurus_speed`, `ankylosaurus_hunting`, `ankylosaurus_attack`, `ankylosaurus_zero`
- `parasaurolophus_speed`, `parasaurolophus_hunting`, `parasaurolophus_attack`, `parasaurolophus_zero`
- `stegosaurus_speed`, `stegosaurus_hunting`, `stegosaurus_attack`, `stegosaurus_zero`
- `pteranodon_speed`, `pteranodon_hunting`, `pteranodon_attack`, `pteranodon_zero`
- `compsognathus_speed`, `compsognathus_hunting`, `compsognathus_attack`, `compsognathus_zero`
- `ornithomimus_speed`, `ornithomimus_hunting`, `ornithomimus_attack`, `ornithomimus_zero`

Runtime paths are unchanged.

## Hero Composition Fix

Existing confirmed hero references:

- `public/assets/dinos/dino_select/velociraptor_hero.png`
- `public/assets/dinos/dino_select/tyrannosaurus_hero.png`
- `public/assets/dinos/dino_select/triceratops_hero.png`
- `public/assets/dinos/dino_select/spinosaurus_hero.png`

Observed target style:

- front to three-quarter-front threat pose
- face and upper body are prominent
- transparent background
- not a side-facing gameplay pose

ND09c source hero sheets were generated in that front intimidation composition,
then split into the existing hero runtime files:

- `public/assets/dinos/evolutions/heroes/{id}_hero.png`

Reference/contact output:

- `docs/assets/nd09c_existing_hero_reference_contact.png`
- `docs/assets/nd09c_new_dinos_evolution_hero_contact.png`

## Sprite Sheet Animation Fix

User feedback noted that each evolution branch should have its own sprite sheet
for animation control. ND09c confirms this as the runtime rule.

Runtime sprite policy:

- one 4x4 sprite sheet per evolution branch
- `512x512` cell size
- row 0: idle
- row 1: move / run / fly
- row 2: action
- row 3: death fallback
- right-facing fixed source pose
- transparent background
- no sheet-level display fallback

Generated source sheets are organized by dinosaur, but final runtime sheets are
split into 24 branch-specific files:

- `public/assets/dinos/evolutions/sheets/{id}_sheet.png`

## Margin / Contamination Safety

The first ND09c sprite-pose source pass was rejected internally because several
source cells were too close to their cell edge. A second source generation pass
was used with stronger padding instructions before creating the runtime sheets.

Final runtime checks:

- `assetCount`: 24
- `missingAssetCount`: 0
- `edgeIssueCount`: 0
- `cellContaminationCount`: 0
- `minMargin`: 32 px
- `frameSizeStable`: true

Additional review after user feedback:

- The animation contact sheet can visually suggest uneven vertical placement
  because it compresses several different action poses into a small strip.
- Runtime sheet inspection found no alpha touching any cell border, but visual
  review found that several generated action source cells were already clipped
  at their own source-cell top edge.
- Row metrics were added to
  `docs/assets/nd09c_new_dinos_evolution_asset_report.json`.
- ND09c now treats source-edge-touching action art as unsafe and falls back to
  contained full-body poses for the runtime action row.
- Detached specks were removed more aggressively before sheet assembly.
- Runtime rows are generated with a shared baseline and height normalization.
- The final runtime sheets were increased from `384x384` cells to `512x512`
  cells after visual review still found possible top-edge clipping in action
  rows.
- `src/data/asset_manifest.js` was updated so the new six evolution sheets use
  `frameWidth: 512` and `frameHeight: 512`.
- Final strict review reports problem count 0 across all 24 sheets, edge issues
  0, cell contamination 0, minimum margin 67 px, and move/action row vertical
  variation no higher than 4 px.

The target margin is based on the already confirmed pre-evolution
`tyrannosaurus`, `velociraptor`, and `triceratops` sprite sheets, then scaled for
the larger `512x512` evolution cell size.

## QA Artifacts

- `docs/assets/nd09c_new_dinos_evolution_hero_contact.png`
- `docs/assets/nd09c_new_dinos_evolution_sprite_contact.png`
- `docs/assets/nd09c_new_dinos_evolution_animation_contact.png`
- `docs/assets/nd09c_new_dinos_evolution_asset_report.json`

## Runtime QA

Browser QA route:

- `debugIntroSeen=1`
- `debugAutoPlay=1`
- `debugInvincible=1`
- `debugDino={dino}`
- `debugForceEvolution={speed|hunting|attack|zero}`
- `debugStage=jungle`
- `debugDifficulty=normal`

Results:

- 24/24 new-dino evolution branches loaded with a visible canvas after the
  `512x512` cell manifest update.
- `ankylosaurus_speed`, `ankylosaurus_hunting`, `ankylosaurus_attack`, `ankylosaurus_zero`: PASS
- `parasaurolophus_speed`, `parasaurolophus_hunting`, `parasaurolophus_attack`, `parasaurolophus_zero`: PASS
- `stegosaurus_speed`, `stegosaurus_hunting`, `stegosaurus_attack`, `stegosaurus_zero`: PASS
- `pteranodon_speed`, `pteranodon_hunting`, `pteranodon_attack`, `pteranodon_zero`: PASS
- `compsognathus_speed`, `compsognathus_hunting`, `compsognathus_attack`, `compsognathus_zero`: PASS
- `ornithomimus_speed`, `ornithomimus_hunting`, `ornithomimus_attack`, `ornithomimus_zero`: PASS

Console:

- runtime error/warn: 0
- Node/browser harness emitted an unrelated Statsig network message outside the
  page console; it was not counted as a runtime page warning/error.

Existing representative check:

- `velociraptor` base PlayScene boot: PASS

## Retained From ND09b

The following ND09b assets are retained because the issue was hero composition
and gameplay animation readiness, not effect or icon design quality:

- portraits
- special icons
- branch attack effects
- ultimate effects

## Residual Risk

ND09c uses generated branch-pose sheets as source art and expands each branch
into a stable 4x4 runtime sheet. If future QA requires every single animation
cell to be independently illustrated, that can become a separate ND09d pass.

## Main Merge Status

No main merge or push was performed in ND09c.
