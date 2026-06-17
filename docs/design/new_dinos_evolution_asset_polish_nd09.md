# ND09 New Dino Evolution Asset Polish

## Background

ND08 reached a technical main-integration-ready state, but visual review found a release-quality blocker in the six new dinosaurs' evolution branch assets.

Issue:

- Several evolution branches read as base dinosaur color variants.
- `speed`, `hunting`, `attack`, and `zero` did not communicate enough branch identity.
- Branch attack effects and ultimate effects were too similar between tags.

ND09 replaces the branch assets in-place while preserving the existing manifest keys and file names.

## Non-Color-Only Rule

ND09 does not treat palette shifting as sufficient.

Each branch now receives visible differentiation through one or more of:

- silhouette accents
- armor / plate / wing / crest / tail / leg modifications
- branch-specific glowing organs
- targeting or sensor motifs
- ZERO corruption cracks and crystals
- branch-specific attack / ultimate effect geometry

The original dinosaur species identity remains recognizable.

## Regenerated / Reprocessed Asset Set

24 evolution sets were reprocessed:

- 6 dinosaurs
- 4 tags each: `speed`, `hunting`, `attack`, `zero`

Each set includes:

- hero
- portrait
- gameplay sprite sheet
- special icon
- branch attack effect
- ultimate effect

Runtime paths are unchanged.

## Branch Direction Differentiation

### Speed

- Thin cyan speed rails
- Streamlined fins / wing edges / leg trails
- Lighter motion silhouettes
- Intended read: fast and agile

### Hunting

- Amber sensor rings
- Eye / crest / head tracking marks
- Claw / talon / pursuit cues
- Intended read: tracking, crit, and pursuit

### Attack

- Red/orange weapon-organ emphasis
- Larger plates, tail cores, shock emitters, wing blades, or leg impact flares
- Heavier attack effect shapes
- Intended read: power and area impact

### ZERO

- Purple/cyan corruption arcs
- Crystal-like growths
- Fissure/crack overlays
- Abnormal glow around organs
- Intended read: unstable ZERO evolution

## Per-Dinosaur Differentiation

| Dino | Speed | Hunting | Attack | ZERO |
| --- | --- | --- | --- | --- |
| `ankylosaurus` | low sprint armor rails | tail-hammer tracking rings | enlarged tail-hammer core and armor spikes | crystallized armor seams and corrupted tail glow |
| `parasaurolophus` | streamlined crest channel | sonar dish / scan rings | large sonic pressure cones | ZERO resonance through crest |
| `stegosaurus` | swept plate edges | sensor plates | enlarged powered plates | reactor-like dorsal plates |
| `pteranodon` | high-speed wing rails | talons / aerial targeting | wing-blade wind-lance edges | corrupted wing membrane arcs |
| `compsognathus` | running afterimages | pack pursuit marks | aggressive claw/pack-slash cues | ZERO-resonant ghost pack marks |
| `ornithomimus` | leg speed rails | head/eye tracking marks | reinforced leg impact | neural leg conduits and ZERO glow |

## Effects

Branch attack and ultimate effects were regenerated in-place.

Effect differentiation:

- `speed`: layered cyan motion slices and airflow rails
- `hunting`: amber target reticles, scan rings, and pursuit motes
- `attack`: red/orange impact cores with heavier burst rays
- `zero`: purple/cyan unstable nodes, arcs, and corruption motes

Species motif overlays were added:

- ankylosaurus: circular tail-club shock core
- parasaurolophus: sonic crest arc
- stegosaurus: plate-shaped quake emitters
- pteranodon: wing / wind-lance geometry
- compsognathus: pack multi-hit marks
- ornithomimus: sprint-leg impact line

## QA Artifacts

- `docs/assets/nd09_new_dinos_evolution_hero_contact.png`
- `docs/assets/nd09_new_dinos_evolution_sprite_contact.png`
- `docs/assets/nd09_new_dinos_evolution_effect_contact.png`
- `docs/assets/nd09_new_dinos_evolution_asset_report.json`

Report summary:

- branch count: 24
- missing assets: 0
- sprite/effect edge issues: 0
- minimum reported margin: 12px
- color-only risk: reduced by geometric silhouette/effect additions

## QA Result

Static asset QA:

- 24/24 sets present
- missing asset 0
- edge issue 0
- runtime filenames unchanged
- manifest/code references unchanged

Verification:

- `node --check` passed for the relevant asset/evolution/play/HUD JS files.
- `python -m py_compile tools\polish_new_dino_evolutions_nd09.py` passed.
- `python -m json.tool docs\assets\nd09_new_dinos_evolution_asset_report.json` passed.
- `git diff --check` passed.
- `npm.cmd run build` passed with only the existing Vite chunk size warning.

Browser smoke QA:

- 4 representative branch loads passed:
  - `ankylosaurus` + `speed`
  - `parasaurolophus` + `attack`
  - `pteranodon` + `hunting`
  - `ornithomimus` + `zero`
- All 24 new-dinosaur evolution branch combinations were loaded with
  `debugForceEvolution`.
- Each route produced a canvas and no page runtime console error/warn entries.
- No white screen, giant sheet display, or asset-load crash was observed in the
  smoke pass.

Note: the browser automation runtime emitted unrelated Statsig network telemetry
errors while looping routes. Page console logs for the game remained at 0
error/warn entries.

## Remaining Risk

ND09 is a targeted polish pass over the existing ND06 branch assets. It substantially improves branch readability, but a future full artist pass could still further improve natural anatomy integration for:

- cleaner organic integration of added branch organs
- more bespoke hand-authored frame poses per evolution branch
- deeper branch-specific ultimate mechanics
