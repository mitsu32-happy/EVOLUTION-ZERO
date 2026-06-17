# ND06 New Dino Evolutions

## Scope

ND06 generated and connected evolution assets for the six new playable dinosaur candidates:

- `ankylosaurus`
- `parasaurolophus`
- `stegosaurus`
- `pteranodon`
- `compsognathus`
- `ornithomimus`

Each dinosaur now has four evolution branches prepared:

- `speed`
- `hunting`
- `attack`
- `zero`

This creates 24 evolution branch sets total. The ZERO branches are implemented as data/assets but remain future-route gated. ND06 does not unlock them unconditionally.

## Generated Asset Sets

Each of the 24 branches includes:

- hero: `public/assets/dinos/evolutions/heroes/{branch_id}_hero.png`
- portrait: `public/assets/dinos/evolutions/portraits/{branch_id}_portrait.png`
- gameplay sprite sheet: `public/assets/dinos/evolutions/sheets/{branch_id}_sheet.png`
- special icon: `public/assets/ui/hud/special_icons/special_{tag}_{dino_id}.png`
- branch normal-attack accent: `public/assets/effects/attacks/evolutions/{branch_id}_attack.png`
- ultimate/special effect: `public/assets/effects/specials/new_dinos/special_{branch_id}_ultimate.png`

Sprite sheets use the ND04/P04j-safe format:

- 4 columns x 4 rows
- 384 x 384 px per cell
- transparent PNG
- one dinosaur per cell
- fixed frame size
- central placement with transparent safety margin

## Branch List

| Dinosaur | Speed | Hunting | Attack | ZERO |
| --- | --- | --- | --- | --- |
| `ankylosaurus` | `ankylosaurus_speed` | `ankylosaurus_hunting` | `ankylosaurus_attack` | `ankylosaurus_zero` |
| `parasaurolophus` | `parasaurolophus_speed` | `parasaurolophus_hunting` | `parasaurolophus_attack` | `parasaurolophus_zero` |
| `stegosaurus` | `stegosaurus_speed` | `stegosaurus_hunting` | `stegosaurus_attack` | `stegosaurus_zero` |
| `pteranodon` | `pteranodon_speed` | `pteranodon_hunting` | `pteranodon_attack` | `pteranodon_zero` |
| `compsognathus` | `compsognathus_speed` | `compsognathus_hunting` | `compsognathus_attack` | `compsognathus_zero` |
| `ornithomimus` | `ornithomimus_speed` | `ornithomimus_hunting` | `ornithomimus_attack` | `ornithomimus_zero` |

## Code Connections

Updated files:

- `src/data/evolution_data.js`
  - ND02 pending branches now resolve dedicated ND06 `heroPath`, `portraitPath`, `sheetPath`, `specialIconPath`, and branch attack effect keys.
  - `assetStatus` changed from `pending` to `connected` for the six new dinosaurs' branch factory output.
  - ZERO branch unlock condition remains future ZERO route gated.
- `src/data/asset_manifest.js`
  - Registers all 24 branch heroes, portraits, sprite sheets, special icons, branch attack accents, and ultimate/special effects.
  - Adds matching `ASSET_KEYS` entries for new evolution branches.
- `src/scenes/play_scene.js`
  - Evolution sprite sheet lookup now resolves branch sheets generically by `dinoId + tag`, so the new six dinosaurs can use their own sheets instead of falling back to existing dinosaurs.
- `src/systems/ultimate_system.js`
  - Adds lightweight ultimate definitions for the new branch IDs.
  - Loads ND06 `*Ultimate` special effect textures dynamically.

## ZERO Evolution Policy

The six new ZERO evolutions are asset-complete and data-connected, but they are not public-unlocked in ND06.

Current policy:

- data implemented
- hero/portrait/sheet/icon/effect assets implemented
- `zeroRoute: true`
- `hiddenUntilDiscovered: true`
- `unlockCondition: future ZERO route`
- no unconditional save unlock
- no new ZERO reward stage assignment in ND06

This keeps the branches ready for future stage/reward design without changing current progression.

## `spinosaurus_zero` Check

`spinosaurus_zero` already existed before ND06 and was not duplicated.

Confirmed:

- `src/data/evolution_data.js` includes `spinosaurus_zero`
- `src/data/asset_manifest.js` includes hero, portrait, sprite sheet, and special icon entries
- `src/systems/ultimate_system.js` includes `spinosaurus_zero`
- `src/core/game_state.js` includes a ZERO requirement entry
- `src/save/save_manager.js` does not currently map a stage reward to `spinosaurus_zero`

Status:

- asset presence: OK
- sprite sheet report: no missing file
- reward route: future/unasigned in current public route mapping
- ND07/ND08 should decide whether a future `ruins` ZERO route should unlock `spinosaurus_zero`

## QA Assets

- `docs/assets/nd06_new_dinos_evolution_hero_contact.png`
- `docs/assets/nd06_new_dinos_evolution_sprite_contact.png`
- `docs/assets/nd06_new_dinos_evolution_effect_contact.png`
- `docs/assets/nd06_new_dinos_evolution_asset_report.json`

Report summary:

- branch sets: 24
- generated hero count: 24
- generated sprite sheet count: 24
- generated effect count: 24
- total sprite edge issues: 0
- minimum sprite cell margin: 8px

## Remaining Risks

- The new evolution branches are connected but not final-balanced for public unlock.
- New branch ultimate definitions intentionally use existing safe behavior families with dedicated ND06 textures. Deeper bespoke ultimate mechanics can be handled later.
- ZERO route assignment for the six new dinosaurs and `spinosaurus_zero` remains a future progression task.
- Full evolution selection, result, codex, and long-play QA should be done in ND07/ND08.

## ND07 Follow-up

ND07 connected the six new base dinosaurs to research unlocks and display recovery paths:

- research unlocks were added for all six base dinosaurs
- dino select now treats the six base dinosaurs as research-locked instead of permanently future-locked
- codex base entries now unlock from save state and non-ZERO branch cards hydrate from ND06 `evolution_data`
- HUD and result screens now load the ND06 evolution portraits and special icons for these dinosaurs

ZERO branch policy is unchanged from ND06: the six new ZERO branches and `spinosaurus_zero` remain implemented but future route gated, with no unconditional unlock in ND07.

## QA Result

Static checks:

- `node --check src/data/asset_manifest.js`
- `node --check src/data/evolution_data.js`
- `node --check src/scenes/play_scene.js`
- `node --check src/systems/ultimate_system.js`
- `git diff --check`
- `npm.cmd run build`

Asset resolution check:

- 24/24 generated branches resolve hero, portrait, sprite sheet, special icon, branch attack effect, and ultimate/special effect paths.
- Missing generated assets: 0
- Generated sprite edge issues: 0
- Minimum generated sprite cell margin: 8px
- `spinosaurus_zero` hero, portrait, sprite sheet, and special icon all exist.

Browser PlayScene checks:

- `ankylosaurus`: boot OK, canvas visible, app console warn/error 0
- `parasaurolophus`: boot OK, canvas visible, app console warn/error 0
- `stegosaurus`: boot OK, canvas visible, app console warn/error 0
- `pteranodon`: boot OK, canvas visible, app console warn/error 0
- `compsognathus`: boot OK, canvas visible, app console warn/error 0
- `ornithomimus`: boot OK, canvas visible, app console warn/error 0
- Existing representative checks: `velociraptor` and `spinosaurus` boot OK, app console warn/error 0

Notes:

- A browser-control environment Statsig network message appeared once during automation. It was not present in the app tab console logs and is not counted as an EVOLUTION ZERO runtime warning.
- Build succeeded with the existing Vite chunk-size warning.

## ND09 Supersession

ND09 supersedes the visual content of the ND06 evolution branch assets.

Reason:

- User review after ND08 found that the ND06 branch assets looked too close to base dinosaur color variants.
- `speed`, `hunting`, `attack`, and `zero` needed clearer branch identity in silhouette, organs, glow, and effects.

ND09 reprocessed all 24 evolution sets in place while preserving runtime paths and manifest keys:

- hero
- portrait
- gameplay sprite sheet
- special icon
- branch attack effect
- ultimate effect

New QA artifacts:

- `docs/assets/nd09_new_dinos_evolution_hero_contact.png`
- `docs/assets/nd09_new_dinos_evolution_sprite_contact.png`
- `docs/assets/nd09_new_dinos_evolution_effect_contact.png`
- `docs/assets/nd09_new_dinos_evolution_asset_report.json`

Detailed notes are in `docs/design/new_dinos_evolution_asset_polish_nd09.md`.

## ND09b Supersession

ND09b supersedes ND09 for the final visual direction.

- ND09 was a local polish pass and was not accepted as release-quality.
- ND09b uses generated creature concept sheets and generated VFX sheets for the
  24 branch replacements.
- Runtime paths and manifest keys remain unchanged.

Detailed notes are in `docs/design/new_dinos_evolution_asset_regen_nd09b.md`.
