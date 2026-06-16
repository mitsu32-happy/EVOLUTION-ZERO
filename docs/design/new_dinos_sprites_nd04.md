# ND04 New Playable Dinosaurs Gameplay Sprite Sheets

Date: 2026-06-17
Branch: `feature/new-dinos-six-v1`

## Scope

ND04 generates and connects base gameplay sprite sheets for the six new playable dinosaurs:

- `ankylosaurus`
- `parasaurolophus`
- `stegosaurus`
- `pteranodon`
- `compsognathus`
- `ornithomimus`

This pass does not implement dedicated skill effects, evolution branch sprite sheets, ZERO evolution sprite sheets, unlock routes, version changes, news, or main integration.

## Output Assets

| Dinosaur ID | Static fallback | Gameplay sprite sheet |
| --- | --- | --- |
| `ankylosaurus` | `public/assets/dinos/ankylosaurus.png` | `public/assets/dinos/ankylosaurus_sheet.png` |
| `parasaurolophus` | `public/assets/dinos/parasaurolophus.png` | `public/assets/dinos/parasaurolophus_sheet.png` |
| `stegosaurus` | `public/assets/dinos/stegosaurus.png` | `public/assets/dinos/stegosaurus_sheet.png` |
| `pteranodon` | `public/assets/dinos/pteranodon.png` | `public/assets/dinos/pteranodon_sheet.png` |
| `compsognathus` | `public/assets/dinos/compsognathus.png` | `public/assets/dinos/compsognathus_sheet.png` |
| `ornithomimus` | `public/assets/dinos/ornithomimus.png` | `public/assets/dinos/ornithomimus_sheet.png` |

## Frame Structure

All six gameplay sheets use the same runtime-safe structure:

- `columns`: 4
- `rows`: 4
- `frameWidth`: 384
- `frameHeight`: 384
- row 0: `idle`
- row 1: `run`
- row 2: `attack`
- row 3: `death` / down fallback

Although the ND04 visual target is idle / move / action, the fourth row is included so the existing `Player` animation contract can keep using `death` without row remapping or missing-frame fallback logic.

## Animation Direction

| Dinosaur ID | Idle | Move | Action |
| --- | --- | --- | --- |
| `ankylosaurus` | armored breathing and weight shift | heavy walk with tail-club sway | tail-club windup / impact |
| `parasaurolophus` | calm breathing and crest motion | light walk with crest bob | sonic pulse posture |
| `stegosaurus` | heavy breathing and plate motion | heavy plate-sway walk | plate glow / stomp posture |
| `pteranodon` | hovering wing hold | flap / glide cycle | wind-blade wing sweep |
| `compsognathus` | alert small theropod idle | fast little run | quick bite / slash posture |
| `ornithomimus` | alert runner idle | long-leg sprint | dash-kick posture |

Gameplay facing is fixed to right-facing. Left-facing movement should continue to use the existing sprite flip behavior rather than separate left-facing assets.

## Safety Processing

The generated source sheets were not connected directly. Each frame was postprocessed:

- chroma magenta background removal
- one source frame split per cell
- alpha bounding box crop
- center placement into a fixed 384x384 transparent cell
- dino-specific fit box to protect wings, tails, crests, plates, and long legs
- fixed display width / height in `asset_manifest.js`
- static fallback frame extracted from idle row frame 0

This follows the Companion Dino P04j lesson: treat generated sheets as source material, then normalize every runtime frame into a fixed cell before manifest connection.

## QA Artifacts

- `docs/assets/nd04_new_dinos_sprite_contact.png`
- `docs/assets/nd04_new_dinos_sprite_report.json`

The JSON report records source path, output paths, frame size, display size, missing frames, source edge risk, final edge issues, and minimum output margins.

## Edge Issue Summary

| Dinosaur ID | Missing frames | Final edge issues | Minimum output margin |
| --- | ---: | ---: | ---: |
| `ankylosaurus` | 0 | 0 | 42px |
| `parasaurolophus` | 0 | 0 | 49px |
| `stegosaurus` | 0 | 0 | 35px |
| `pteranodon` | 0 | 0 | 29px |
| `compsognathus` | 0 | 0 | 66px |
| `ornithomimus` | 0 | 0 | 48px |

Some generated source cells placed limbs or action accents near a source-cell boundary. The runtime outputs were re-centered and re-padded; final 384px output cells have `edgeIssues: 0`.

## Connected Manifest Keys

Added `ASSET_KEYS.player`:

- `ankylosaurus`
- `parasaurolophus`
- `stegosaurus`
- `pteranodon`
- `compsognathus`
- `ornithomimus`

Added `ASSET_KEYS.playerSheets`:

- `ankylosaurus`
- `parasaurolophus`
- `stegosaurus`
- `pteranodon`
- `compsognathus`
- `ornithomimus`

Added matching entries to `ASSET_MANIFEST.dinos` for each static fallback and sheet.

## UI / Gameplay Exposure

The assets are now safe for PlayScene loading by direct debug selection, for example `debugDino=ankylosaurus`.

Normal UI exposure remains unchanged from ND03:

- the six dinosaurs are still locked / future candidates in the dino select screen
- unlock routing is deferred to ND07
- evolution branch sprite sheets are not generated yet

## ND05 Handoff

ND05 should add dedicated normal-attack and skill effect assets. It should not reuse row 2 action pose effects as full attack VFX; ND04 row 2 only provides body animation frames.

ND05 should check:

- `ankylosaurusTailClub`
- `parasaurolophusSonicPulse`
- `stegosaurusPlateQuake`
- `pteranodonWindLance`
- `compsognathusPackBite`
- `ornithomimusSprintKick`

## ND05 Result

ND05 added dedicated base normal attack effect assets and icons for the six attack IDs listed above. The ND04 body animation row 2 remains body-action animation only; actual attack VFX now comes from `normalAttackEffects` through `src/data/normal_attacks.js`.

## Remaining Risks

- The new dinosaurs are not fully balanced as playable unlocks yet.
- Evolution branch and ZERO branch sheets are still absent.
- Dedicated attack effect sheets are still absent.
- `pteranodon` has the widest silhouette and should be rechecked again after ND05 effects are added.

## QA Result

Static checks:

- `node --check src/data/asset_manifest.js`
- `node --check src/data/run_config.js`
- `node --check src/data/normal_attacks.js`
- `node --check src/data/evolution_data.js`
- `node --check src/ui/dino_select_screen.js`
- `node --check src/ui/codex_screen.js`
- `node --check src/core/game_state.js`
- `git diff --check`
- `npm.cmd run build`

Browser PlayScene checks used `debugDino={id}` for all six new dinosaurs:

- `ankylosaurus`: PlayScene boot OK, runtime error/warn 0
- `parasaurolophus`: PlayScene boot OK, runtime error/warn 0
- `stegosaurus`: PlayScene boot OK, runtime error/warn 0
- `pteranodon`: PlayScene boot OK, runtime error/warn 0
- `compsognathus`: PlayScene boot OK, runtime error/warn 0
- `ornithomimus`: PlayScene boot OK, runtime error/warn 0

Representative visual check:

- `ornithomimus` with `debugNoPickupCollect=1` and `debugInvincible=1`
- sprite visible in PlayScene
- no sheet-wide giant display
- no frame-size flicker observed during the short check
- runtime error/warn 0

Build result:

- build succeeded
- existing Vite chunk-size warning remains
