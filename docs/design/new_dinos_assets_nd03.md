# ND03 New Playable Dinosaurs Hero/Icon/UI Assets

Date: 2026-06-16
Branch: `feature/new-dinos-six-v1`

## Scope

ND03 generates and connects base hero, dino-select portrait, and icon/HUD portrait assets for the six new playable dinosaurs. It does not generate gameplay sprite sheets, normal attack effects, evolution branch assets, ZERO branch assets, unlock routes, version updates, news, or main integration.

## Hero Composition Correction

During generation review, the existing hero images were re-checked:

- `public/assets/dinos/dino_select/velociraptor_hero.png`
- `public/assets/dinos/dino_select/triceratops_hero.png`
- `public/assets/dinos/dino_select/tyrannosaurus_hero.png`
- `public/assets/dinos/dino_select/spinosaurus_hero.png`

The correct hero composition is not a right-facing side profile. Existing hero art uses a frontal or three-quarter-front intimidation pose: the dinosaur faces the player, roars, braces, or lunges toward the camera. Side-profile drafts generated earlier in ND03 were not adopted.

## Generated Base Assets

| Dinosaur ID | Hero | Dino-select portrait | Icon / HUD portrait |
| --- | --- | --- | --- |
| `ankylosaurus` | `public/assets/dinos/dino_select/ankylosaurus_hero.png` | `public/assets/dinos/dino_select/ankylosaurus_portrait.png` | `public/assets/dinos/portraits/ankylosaurus.png` |
| `parasaurolophus` | `public/assets/dinos/dino_select/parasaurolophus_hero.png` | `public/assets/dinos/dino_select/parasaurolophus_portrait.png` | `public/assets/dinos/portraits/parasaurolophus.png` |
| `stegosaurus` | `public/assets/dinos/dino_select/stegosaurus_hero.png` | `public/assets/dinos/dino_select/stegosaurus_portrait.png` | `public/assets/dinos/portraits/stegosaurus.png` |
| `pteranodon` | `public/assets/dinos/dino_select/pteranodon_hero.png` | `public/assets/dinos/dino_select/pteranodon_portrait.png` | `public/assets/dinos/portraits/pteranodon.png` |
| `compsognathus` | `public/assets/dinos/dino_select/compsognathus_hero.png` | `public/assets/dinos/dino_select/compsognathus_portrait.png` | `public/assets/dinos/portraits/compsognathus.png` |
| `ornithomimus` | `public/assets/dinos/dino_select/ornithomimus_hero.png` | `public/assets/dinos/dino_select/ornithomimus_portrait.png` | `public/assets/dinos/portraits/ornithomimus.png` |

## Contact / QA Artifacts

- `docs/assets/nd03_new_dinos_hero_contact.png`
- `docs/assets/nd03_new_dinos_icon_contact.png`
- `docs/assets/nd03_new_dinos_asset_report.json`

The report records source size, alpha bounding boxes, output paths, and output sizes.

## Visual Notes By Dinosaur

### `ankylosaurus`

- Heavy armored body and tail club are readable.
- Front-facing defensive threat matches the hero-screen direction.
- Tail club remains visible inside the crop.

### `parasaurolophus`

- Head crest is prominent and not clipped.
- Support/sonic identity is implied through cyan resonance markings.
- Body reads as herbivore dinosaur rather than mammal or mascot.

### `stegosaurus`

- Dorsal plates and tail spikes are readable.
- Heavy braced pose supports the area-control role.
- Plate silhouette stays within the hero crop.

### `pteranodon`

- Reads as pterosaur / winged reptile rather than bird.
- Wings are contained in the hero crop with safe margins.
- Wider silhouette should be rechecked when dino select layout is tested on narrow screens.

### `compsognathus`

- Pack identity is visible through a lead small theropod and packmates.
- The lead body is large enough for selector recognition.
- Future sprite work should keep pack spacing controlled to avoid clutter.

### `ornithomimus`

- Long legs and lightweight runner silhouette are clear.
- Reads as a theropod dinosaur rather than a bird.
- The tall body shape should be checked again in mobile card crops.

## Asset Manifest Keys

Added `ASSET_KEYS.dinoSelectPortraits`:

- `ankylosaurus`
- `parasaurolophus`
- `stegosaurus`
- `pteranodon`
- `compsognathus`
- `ornithomimus`

Added `ASSET_KEYS.dinoSelectHero`:

- `ankylosaurus`
- `parasaurolophus`
- `stegosaurus`
- `pteranodon`
- `compsognathus`
- `ornithomimus`

No player sprite or player sheet asset keys were added in ND03. Gameplay sheets are deferred to ND04.

## UI Exposure Policy

### Dino Select

The six dinosaurs are listed as locked future candidates. They show their generated preview art but cannot be selected for sortie.

Reason:

- ND03 provides base UI assets only.
- Gameplay sprite sheets and dedicated effects do not exist yet.
- Unlock and save migration behavior should be finalized in ND07.

### Codex

The six dinosaurs are registered with basic codex information. Normal UI shows them as locked/unknown. Debug unlock parameters can reveal their generated art for QA:

- `debugUnlockDino={id}`
- `debugUnlockAllDinos=1`

### Home / PlayScene

The six dinosaurs are not added to the home rotation or PlayScene asset loading in ND03. This prevents missing sprite sheet references.

## Deferred Assets

Deferred to later ND phases:

- base gameplay sprite sheets
- normal attack effect assets
- speed / hunting / attack branch hero images
- speed / hunting / attack branch portraits
- speed / hunting / attack branch sprite sheets
- ZERO branch hero images
- ZERO branch portraits
- ZERO branch sprite sheets
- special icons

## ND04 Handoff

ND04 should generate gameplay sprite sheets with the same safety rules used for Companion Dino P04j:

- fixed facing and consistent cell size
- one subject per cell
- sufficient transparent padding
- no clipping on tail, wings, plates, crest, feet, or legs
- no adjacent-cell contamination
- contact sheet and JSON report before manifest connection
