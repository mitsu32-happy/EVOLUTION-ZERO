# ND09b New Dino Evolution Asset Regeneration

## Purpose

ND09 was rejected for release-quality use because it relied on local polish over
the ND06 branch assets. It improved readability, but it still felt close to:

- palette shifts
- glow overlays
- simple added parts
- local image-processing decoration

ND09b replaces that direction with generated evolution concept sheets and
generated effect sheets. The generated sources are preserved under
`docs/assets/nd09b_sources/` so the asset origin is inspectable.

## Generation Policy

ND09b uses generated illustration sources for:

- each dinosaur's four evolution branch bodies
- each dinosaur's four evolution branch effects

Allowed local processing in ND09b:

- chroma-key removal
- cropping each generated quadrant
- resizing to existing runtime dimensions
- composing dark hero/portrait presentation panels
- assembling gameplay sprite sheets from the generated branch illustration
- creating contact sheets and QA reports

Not used as completion criteria:

- recoloring the base dinosaur only
- drawing simple lines on the previous branch art only
- treating local procedural graphics as the evolution design source

## Generated Source Files

Creature concept sheets:

- `docs/assets/nd09b_sources/ankylosaurus_concept.png`
- `docs/assets/nd09b_sources/parasaurolophus_concept.png`
- `docs/assets/nd09b_sources/stegosaurus_concept.png`
- `docs/assets/nd09b_sources/pteranodon_concept.png`
- `docs/assets/nd09b_sources/compsognathus_concept.png`
- `docs/assets/nd09b_sources/ornithomimus_concept.png`

Effect concept sheets:

- `docs/assets/nd09b_sources/ankylosaurus_effects.png`
- `docs/assets/nd09b_sources/parasaurolophus_effects.png`
- `docs/assets/nd09b_sources/stegosaurus_effects.png`
- `docs/assets/nd09b_sources/pteranodon_effects.png`
- `docs/assets/nd09b_sources/compsognathus_effects.png`
- `docs/assets/nd09b_sources/ornithomimus_effects.png`

## ND09c Follow-Up

ND09c supersedes the ND09b hero and gameplay sprite sheet outputs for the new
six dinosaurs' evolution branches.

Reason:

- ND09b creature designs were accepted as dedicated evolution concepts, but hero
  composition still needed to match the existing front intimidation style.
- Gameplay sprite sheets needed branch-specific animation-ready sheets rather
  than relying on a single processed branch illustration.
- User review also flagged sprite source margin risk, so ND09c regenerated the
  sprite-pose sources with stronger transparent padding before splitting into
  runtime sheets.

ND09c updates:

- 24 front / three-quarter-front hero images regenerated and replaced in place.
- 24 right-facing `4x4` gameplay sprite sheets regenerated and replaced in
  place, one sheet per evolution branch.
- Final runtime sprite report: missing asset 0, edge issue 0, cell
  contamination 0, minimum cell margin 32 px.

Detailed record:

- `docs/design/new_dinos_evolution_pose_anim_nd09c.md`

## Replaced Asset Types

For all 24 evolution branches, ND09b replaces the existing runtime files in
place:

- hero
- portrait
- gameplay sprite sheet
- special icon
- branch attack effect
- ultimate effect

Runtime paths and manifest keys are unchanged.

## Branch Differentiation

### Speed

- generated lightweight body silhouettes
- streamlined wings, legs, plates, or armor
- thin cyan motion/acceleration readability

### Hunting

- generated predator or tracking posture
- emphasized eyes, claws, pursuit organs, sensor-like organic features
- amber tracking/evasion visual language

### Attack

- generated heavier body mass and attack organs
- enlarged tail, crest, dorsal plates, wing edges, claws, or legs
- red/orange impact and destructive energy effects

### ZERO

- generated ZERO-corrupted silhouettes
- blackened tissue, cracks, crystalline organs, cyan and red-purple glow
- special branch identity while keeping the original species readable

## Per-Dinosaur Direction

| Dino | Speed | Hunting | Attack | ZERO |
| --- | --- | --- | --- | --- |
| `ankylosaurus` | low-slung fast armor | tracking head/tail-club posture | oversized tail hammer | crystallized corrupted armor |
| `parasaurolophus` | streamlined sonic crest | sonar/tracking crest | sonic-cannon crest | ZERO crest resonance |
| `stegosaurus` | swept thin plates | sensor plates | huge powered plates | reactor-like corrupted plates |
| `pteranodon` | narrow fast wings | predatory beak/talons | wind-lance wings | corrupted wing membranes |
| `compsognathus` | fast small theropod | pack hunter stance | aggressive claw/tooth form | ghost-pack ZERO resonance |
| `ornithomimus` | long-legged sprint form | pursuit tracker posture | reinforced sprint-kick legs | neural leg ZERO mutation |

## Effect Differentiation

Generated effect sheets replaced the ND09 local VFX pass:

- `speed`: cyan dash trails, motion arcs, sonic/airflow slices
- `hunting`: amber scan cones, targeting rings, pursuit motes
- `attack`: red/orange impact bursts, quake pressure, multi-hit slashes
- `zero`: purple/cyan corrupted arcs, unstable waveforms, dark-energy cracks

The branch attack effect and ultimate effect both use the generated branch VFX
source, with different output framing and scale.

## QA Artifacts

- `docs/assets/nd09b_new_dinos_evolution_hero_contact.png`
- `docs/assets/nd09b_new_dinos_evolution_sprite_contact.png`
- `docs/assets/nd09b_new_dinos_evolution_effect_contact.png`
- `docs/assets/nd09b_new_dinos_evolution_asset_report.json`

Report summary after regeneration:

- branch count: 24
- missing assets: 0
- edge issues: 0
- minimum margin: 12px
- cell contamination: not detected by alpha-edge checks
- color-only risk: low, because the creature/effect source is generated per
  branch rather than palette-only

Verification:

- `node --check` passed for the relevant asset/evolution/play/HUD JS files.
- `python -m py_compile tools\regenerate_new_dino_evolutions_nd09b.py` passed.
- `python -m json.tool docs\assets\nd09b_new_dinos_evolution_asset_report.json` passed.
- `git diff --check` passed.
- `npm.cmd run build` passed with only the existing Vite chunk size warning.

Browser smoke QA:

- all 24 new-dinosaur evolution branch routes were loaded with
  `debugForceEvolution`
- new base representative: `ornithomimus`
- existing dinosaur representative: `velociraptor`
- each route produced a canvas
- game page runtime console error/warn count: 0

Note: the browser automation runtime emitted unrelated Statsig network telemetry
messages during the loop. These were not game page console entries and are not
counted as EVOLUTION ZERO runtime warnings.

## Remaining Risk

Hero, portrait, icons, and effects now clearly come from dedicated generated
branch illustrations. Gameplay sprite sheets are assembled from the generated
branch creature illustration, so they are no longer based on the base sprite,
but frame-to-frame pose variation is still a local assembly step. A future
artist pass could further improve:

- fully hand/generated idle/move/action poses per branch
- more anatomical consistency across all gameplay frames
- branch-specific ultimate animation timing

ND09b does not change unlock rules, ZERO route gating, companion synergy flags,
version, news, or save structure.
