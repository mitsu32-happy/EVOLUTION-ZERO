# ND01 New Playable Dinosaurs Six V1 Plan

Date: 2026-06-16
Branch: `feature/new-dinos-six-v1`

## Purpose

This document starts the implementation plan for adding six new playable dinosaurs and connecting them to the existing EVOLUTION ZERO systems at production quality.

Target dinosaurs:

- Ankylosaurus
- Parasaurolophus
- Stegosaurus
- Pteranodon
- Compsognathus
- Ornithomimus

The update is a large feature. ND01 is investigation and design only. No runtime code, save format, version, news, or asset changes are included in this step.

## Existing Implementation Survey

### Current playable dinosaur IDs

Current main supports these player dinosaur IDs:

- `velociraptor`
- `triceratops`
- `tyrannosaurus`
- `spinosaurus`

Observed entry points:

- `src/ui/dino_select_screen.js`
  - `BASE_DINOS`
  - locked/unlocked display
  - card and detail hero rendering
- `src/data/run_config.js`
  - `DINO_CONFIGS`
  - passive stats and `normalAttackId`
- `src/data/normal_attacks.js`
  - normal attack definitions keyed by attack ID
- `src/data/evolution_data.js`
  - speed / hunting / attack / zero branches per dinosaur
- `src/data/asset_manifest.js`
  - base sprites, sprite sheets, portraits, hero art, evolution sheets, special icons, attack effects
- `src/core/game_state.js`
  - selected dinosaur state
  - ZERO evolution requirements
- `src/save/save_manager.js`
  - `unlockedDinos`
  - `unlockedZeroRoutes`
  - `recordDiscoveredEvolution()`
  - `grantZeroRewards()`
- `src/core/screen_manager.js`
  - debug dino IDs
  - asset group loading by selected dinosaur
- `src/scenes/play_scene.js`
  - debug dino IDs
  - player asset selection
  - evolution sheet selection
  - normal attack audio routing
- `src/systems/combat_system.js`
  - normal attack definition usage
  - effect styling helpers
- `src/systems/ultimate_system.js`
  - branch ultimate definitions and effect textures
- `src/ui/codex_screen.js`
  - `CODEX_DINOS`
  - branch cards
  - ZERO route visibility
- `src/ui/home_screen.js`
  - home dinosaur IDs and hero display
- `src/ui/hud.js`
  - portraits and special icons
- `src/ui/result_ui.js`
  - result portraits and new route display
- `src/data/research.js`
  - dinosaur unlock research, currently used for `spinosaurus_unlock`

### Current ZERO route state

`spinosaurus_zero` is already present in current main in:

- `src/data/evolution_data.js`
- `src/core/game_state.js`
- `src/data/asset_manifest.js`
- `src/systems/ultimate_system.js`
- `src/ui/hud.js`
- `src/effects/evolution_sequence.js`
- `src/ui/result_ui.js`

Current public ZERO route reward map in `src/save/save_manager.js`:

- `jungle -> velociraptor_zero`
- `volcano -> triceratops_zero`
- `swamp -> tyrannosaurus_zero`
- `ruins -> no route reward currently`

ND06 should treat `spinosaurus_zero` as an existing implementation to verify and align, not as a completely missing route. If product direction still wants a new or revised Spinosaurus ZERO route, it should be a replacement / polish task with explicit migration and QA.

## ID Plan

Use the IDs already reserved by Companion Synergy CS01-CS06:

| Dinosaur | ID | Companion synergy |
| --- | --- | --- |
| Ankylosaurus | `ankylosaurus` | `medic_saur` |
| Parasaurolophus | `parasaurolophus` | `para_juvenile` |
| Stegosaurus | `stegosaurus` | `stego_calf` |
| Pteranodon | `pteranodon` | `ptera_chick` |
| Compsognathus | `compsognathus` | `compy_pack` |
| Ornithomimus | `ornithomimus` | `exp_chaser` |

Do not enable the six reserved Companion Synergy definitions automatically in this branch. Enabling should be a separate CS follow-up after the dinosaurs are stable and their balance is known.

## Dinosaur Concepts

### Ankylosaurus

- ID: `ankylosaurus`
- Role: tank / counter / armor sustain
- Existing roster gap: true defense specialist beyond Triceratops. Slower, tougher, more reactive.
- Normal attack direction: tail club arc or short circle impact.
- Suggested attack ID: `ankylosaurusTailClub`
- Core traits:
  - high HP
  - strongest damage reduction
  - slow turn and movement
  - short-range heavy control
- Companion synergy target: `medic_saur`

### Parasaurolophus

- ID: `parasaurolophus`
- Role: sonar / pickup control / support pressure
- Existing roster gap: utility dinosaur that improves field awareness and pickup tempo.
- Normal attack direction: sonic cone or resonance pulse.
- Suggested attack ID: `parasaurolophusSonicPulse`
- Core traits:
  - medium HP
  - mid-range cone
  - pickup / detection support hooks
  - moderate attack tempo
- Companion synergy target: `para_juvenile`

### Stegosaurus

- ID: `stegosaurus`
- Role: area control / plate shock / anti-swarm
- Existing roster gap: slow but reliable around-body area pressure.
- Normal attack direction: dorsal plate shockwave or tail sweep.
- Suggested attack ID: `stegosaurusPlateQuake`
- Core traits:
  - high HP
  - wide close-range area
  - slow attack interval
  - strong knockback
- Companion synergy target: `stego_calf`

### Pteranodon

- ID: `pteranodon`
- Role: ranged / evasive / aerial support
- Existing roster gap: fragile, mobile, long-range line or projectile style.
- Normal attack direction: wind blade, dive slash, or air lance.
- Suggested attack ID: `pteranodonWindLance`
- Core traits:
  - low-to-mid HP
  - high speed
  - longer reach
  - lower knockback / lower contact tolerance
- Companion synergy target: `ptera_chick`

### Compsognathus

- ID: `compsognathus`
- Role: swarm / speed / low-HP cleanup
- Existing roster gap: tiny fast playstyle with rapid strikes and target count.
- Normal attack direction: multi-bite dash or small pack slash.
- Suggested attack ID: `compsognathusPackBite`
- Core traits:
  - low HP
  - very high speed
  - fastest attack tempo
  - low per-hit damage, many targets or chain behavior
- Companion synergy target: `compy_pack`

### Ornithomimus

- ID: `ornithomimus`
- Role: runner / EXP tempo / mobility survival
- Existing roster gap: movement and progression economy without raw DPS dominance.
- Normal attack direction: sprint kick, dust slash, or fast peck line.
- Suggested attack ID: `ornithomimusSprintKick`
- Core traits:
  - high movement speed
  - moderate HP
  - light attacks
  - EXP / pickup tempo hooks
- Companion synergy target: `exp_chaser`

## Existing Dinosaur Differentiation Reference

Current base roster identity:

- `velociraptor`: high speed, fast attack tempo, low-to-mid power.
- `triceratops`: high HP and damage reduction, heavy control.
- `tyrannosaurus`: high damage and range, slower movement.
- `spinosaurus`: mid-range water control, broader group pressure.

New dinosaurs should not collapse into these exact roles:

- Ankylosaurus should be more defensive/reactive than Triceratops.
- Parasaurolophus should be utility/sonic, not just a weaker Spinosaurus.
- Stegosaurus should be area denial, not Tyrannosaurus damage.
- Pteranodon should use range/evasion, not Velociraptor ground speed.
- Compsognathus should feel like swarm speed, not simply small Velociraptor.
- Ornithomimus should emphasize movement and growth tempo, not raw DPS.

## ND05 Base Attack Result

ND05 replaced the ND02 borrowed normal attack effect references with dedicated base attack assets:

| Dinosaur ID | Attack ID | Effect asset |
| --- | --- | --- |
| `ankylosaurus` | `ankylosaurusTailClub` | `public/assets/effects/attacks/ankylosaurus_tail_club.png` |
| `parasaurolophus` | `parasaurolophusSonicPulse` | `public/assets/effects/attacks/parasaurolophus_sonic_pulse.png` |
| `stegosaurus` | `stegosaurusPlateQuake` | `public/assets/effects/attacks/stegosaurus_plate_quake.png` |
| `pteranodon` | `pteranodonWindLance` | `public/assets/effects/attacks/pteranodon_wind_lance.png` |
| `compsognathus` | `compsognathusPackBite` | `public/assets/effects/attacks/compsognathus_pack_bite.png` |
| `ornithomimus` | `ornithomimusSprintKick` | `public/assets/effects/attacks/ornithomimus_sprint_kick.png` |

Each attack also has a matching icon in `public/assets/ui/skills/`.

ND05 keeps the ND02 balance values broadly intact and focuses on world-fit, readability, and removing borrowed placeholder visuals.

## Required Asset Matrix

Each new dinosaur requires base, branch, UI, and effect assets before production completion.

### Base playable dinosaur assets

Per dinosaur:

- `public/assets/dinos/<id>.png`
- `public/assets/dinos/<id>_sheet.png`
- `public/assets/dinos/portraits/<id>.png`
- `public/assets/dinos/dino_select/<id>_hero.png`
- `public/assets/dinos/dino_select/<id>_portrait.png`
- normal attack effect under `public/assets/effects/attacks/`
- normal attack icon under `public/assets/ui/skills/` or existing normal attack icon location
- optional locked silhouette under `public/assets/dinos/locked/` if the dinosaur is not unlocked by default

### Evolution branch assets

For every new dinosaur and every branch:

- speed hero
- hunting hero
- attack hero
- ZERO hero
- speed portrait
- hunting portrait
- attack portrait
- ZERO portrait
- speed sprite sheet
- hunting sprite sheet
- attack sprite sheet
- ZERO sprite sheet
- speed special icon
- hunting special icon
- attack special icon
- ZERO special icon
- speed ultimate / special effect
- hunting ultimate / special effect
- attack ultimate / special effect
- ZERO ultimate / special effect

Recommended paths:

- `public/assets/dinos/evolutions/heroes/<id>_<tag>_hero.png`
- `public/assets/dinos/evolutions/portraits/<id>_<tag>_portrait.png`
- `public/assets/dinos/evolutions/sheets/<id>_<tag>_sheet.png`
- `public/assets/ui/hud/special_icons/special_<tag>_<id>.png`
- `public/assets/effects/specials/special_<id>_<tag>_<effect_name>_sheet.png`

### Asset manifest keys

Add matching keys in `src/data/asset_manifest.js`:

- `ASSET_KEYS.dinos.<id>`
- `ASSET_KEYS.playerSheets.<id>`
- `ASSET_KEYS.dinoSelectPortraits.<id>`
- `ASSET_KEYS.dinoSelectHero.<id>`
- `ASSET_KEYS.evolutionSheets.<id><Tag>`
- `ASSET_KEYS.evolutionHeroes.<id><Tag>`
- `ASSET_KEYS.evolutionPortraits.<id><Tag>`
- `ASSET_KEYS.evolutionSpecialIcons.<id><Tag>`
- `ASSET_KEYS.normalAttackEffects.<attackId>`
- `ASSET_KEYS.normalAttackIcons.<attackId>`
- `ASSET_KEYS.specialEffects.<id><Tag>...`

Use the existing camel-case key style such as `spinosaurusZero`.

## Hero Image Direction

Hero images must match existing dinosaur select and codex art:

- front-facing to slight side angle
- large readable body, head, and signature silhouette
- dark SF / ancient creature / evolution experiment mood
- no pop mascot styling
- no hard background; transparent or UI-compatible art
- enough margins for dino select, home, codex, and result reuse

Species-specific hero risks:

- Ankylosaurus: armor and tail club must read without becoming a low dark blob.
- Parasaurolophus: crest must stay inside the frame and remain recognizable.
- Stegosaurus: plates must not merge into noisy spikes.
- Pteranodon: wingspan must fit without extreme cropping.
- Compsognathus: small body must remain readable at UI sizes.
- Ornithomimus: long legs and neck must not feel like a bird or mammal.

## Sprite Sheet Safety Generation Policy

Follow `docs/design/sprite_sheet_asset_generation_guidelines.md` and the P04j companion workflow.

Required rules:

- fixed right-facing side view
- one dinosaur per frame, except intentional pack/group treatment for `compsognathus`
- no unrelated creatures or other dinosaurs in any frame
- no text, grid, separator, ground shadow, background, or UI frame
- transparent PNG output, or chroma key source processed to transparency
- each frame is a finished pose, not a stretched duplicate
- all states use the same perspective and facing
- cell safety margin after normalization
- contact sheet for visual QA
- JSON report with missing frames, alpha bbox, margin, and edge issue counts

Recommended runtime source:

- 4 columns x 4 rows for base and evolution player sheets
- rows: idle / run / attack / death
- cell size: `256 x 256` minimum for current player pipeline, or larger source processed down to current runtime cells
- final display width/height fixed in manifest to avoid frame-size flicker

Special risks:

- Pteranodon: wings must fit with at least 32px margin after normalization.
- Stegosaurus: dorsal plates must not touch the upper edge.
- Ankylosaurus: tail club must not touch left/right cell boundaries.
- Parasaurolophus: crest must not touch top boundary.
- Ornithomimus: legs must not be cut at the feet.
- Compsognathus: pack must remain visible, but each frame must avoid adjacent-cell remnants.

## Evolution Branch Plan

Each new dinosaur should follow the existing branch tags:

- `speed`
- `hunting`
- `attack`
- `zero`

### Ankylosaurus branches

| Tag | ID | Concept |
| --- | --- | --- |
| speed | `ankylosaurus_speed` | Rolling momentum / faster tail club reposition |
| hunting | `ankylosaurus_hunting` | Sensor armor / counter-marking |
| attack | `ankylosaurus_attack` | Crater tail / heavy quake control |
| zero | `ankylosaurus_zero` | ZERO bunker armor / regeneration counter |

### Parasaurolophus branches

| Tag | ID | Concept |
| --- | --- | --- |
| speed | `parasaurolophus_speed` | Resonance dash / tempo support |
| hunting | `parasaurolophus_hunting` | Echo tracking / pickup sonar |
| attack | `parasaurolophus_attack` | Harmonic rupture / cone burst |
| zero | `parasaurolophus_zero` | ZERO resonance amplifier / field scan |

### Stegosaurus branches

| Tag | ID | Concept |
| --- | --- | --- |
| speed | `stegosaurus_speed` | Plate rail charge / short burst reposition |
| hunting | `stegosaurus_hunting` | Plate sensor field / reactive traps |
| attack | `stegosaurus_attack` | Back-plate quake / area denial |
| zero | `stegosaurus_zero` | ZERO plate reactor / periodic shock field |

### Pteranodon branches

| Tag | ID | Concept |
| --- | --- | --- |
| speed | `pteranodon_speed` | Razor flight / rapid lateral movement |
| hunting | `pteranodon_hunting` | Sky tracking / marked target support |
| attack | `pteranodon_attack` | Wind lance / piercing ranged strike |
| zero | `pteranodon_zero` | ZERO sky rift / aerial beam dive |

### Compsognathus branches

| Tag | ID | Concept |
| --- | --- | --- |
| speed | `compsognathus_speed` | Swarm sprint / rapid reposition |
| hunting | `compsognathus_hunting` | Pack mark / low-HP pursuit |
| attack | `compsognathus_attack` | Frenzy bites / many small hits |
| zero | `compsognathus_zero` | ZERO pack hive / abnormal swarm burst |

### Ornithomimus branches

| Tag | ID | Concept |
| --- | --- | --- |
| speed | `ornithomimus_speed` | Hyper runner / dodge and movement |
| hunting | `ornithomimus_hunting` | Route scanning / pickup guidance |
| attack | `ornithomimus_attack` | Sprint impact / line strike |
| zero | `ornithomimus_zero` | ZERO accelerator / EXP tempo burst |

## ZERO Route Plan

Current public ZERO stages cover jungle, volcano, and swamp. Ruins is currently locked / no route reward in public flow.

For the six new dinosaurs, ND06 should define data and assets for ZERO branches while keeping public unlock gated until route scope is intentionally assigned.

Recommended route expansion options:

1. Add post-release stage or sub-route rewards for new dinosaur ZERO branches.
2. Add alternate ZERO route rewards based on selected dinosaur family, not only stage.
3. Keep all six new ZERO branches data-defined but hidden until later content unlocks them.

Do not silently assign all six to existing stages. That would make route rewards ambiguous and could break expectation around one clear -> one route discovery.

Spinosaurus note:

- `spinosaurus_zero` already exists and should be validated in ND06.
- `ruins` currently has no ZERO route reward in `ZERO_ROUTE_REWARD_BY_STAGE`.
- If Spinosaurus ZERO should become a public reward through ruins or another route, that is a route-scope decision, not just an asset/data task.

## Implementation Target Files

### Data

- `src/data/run_config.js`
- `src/data/normal_attacks.js`
- `src/data/evolution_data.js`
- `src/data/asset_manifest.js`
- `src/data/research.js`
- `src/data/companion_synergy.js` only when enabling future synergies in a later CS task

### Core and save

- `src/core/game_state.js`
- `src/core/screen_manager.js`
- `src/save/save_manager.js`

### Play runtime

- `src/scenes/play_scene.js`
- `src/entities/player.js` only if sheet metadata support needs extension
- `src/systems/combat_system.js`
- `src/systems/ultimate_system.js`
- `src/audio/audio_catalog.js`
- `src/audio/audio_manager.js` if new attack SE needs throttling

### UI

- `src/ui/dino_select_screen.js`
- `src/ui/home_screen.js`
- `src/ui/codex_screen.js`
- `src/ui/hud.js`
- `src/ui/result_ui.js`
- `src/ui/research_screen.js` if unlock research is added
- `src/ui/stage_select_screen.js` only if ZERO route scope or locks change

### Docs and QA artifacts

- `docs/design/new_dinos_six_v1_plan.md`
- future contact sheets and reports under `docs/assets/`
- update `docs/design/dino_roster_spec.md`
- update `docs/design/evolution_system_spec.md`
- update `docs/design/combat_system_spec.md`
- update `docs/design/companion_synergy_design_v1.md` only after synergy enable decision

## Save Compatibility

Current save structure can support new dinosaurs if IDs are added consistently:

- base default unlocked dinosaurs are hard-coded in `SaveManager.isDinoUnlocked()`.
- locked dinosaurs use `unlockedDinos.<id>.unlocked`.
- selected dinosaur persists via `lastSelectedDino`.
- ZERO routes persist via `unlockedZeroRoutes.<routeId>.unlocked`.
- evolution discovery persists via `discoveredEvolutions.<branchId>`.

ND02 must decide which of the six are default unlocked and which are research / stage / achievement locked.

Recommended conservative approach:

- keep existing three default dinosaurs unchanged
- keep `spinosaurus` research unlock unchanged
- add the six as locked by research or staged unlocks
- normalize invalid `lastSelectedDino` to `velociraptor` if an old save references a removed or unavailable ID
- never delete `unlockedDinos` or `unlockedZeroRoutes`

## Unlock Direction

Potential unlock model:

- Ankylosaurus: research unlock after Triceratops usage or defense research.
- Parasaurolophus: research unlock after pickup / exploration research.
- Stegosaurus: research unlock after area attack / durability research.
- Pteranodon: research unlock after stage clear or movement research.
- Compsognathus: research unlock after defeat count / swarm research.
- Ornithomimus: research unlock after EXP / mobility research.

ND02 should define exact costs and requirements. Do not add all six as free default choices without UI pagination QA.

## Companion Synergy Connection

The future synergy IDs already exist in `src/data/companion_synergy.js` and design docs:

| Player dinosaur | Companion | Current status |
| --- | --- | --- |
| `ankylosaurus` | `medic_saur` | `enabled: false` |
| `parasaurolophus` | `para_juvenile` | `enabled: false` |
| `stegosaurus` | `stego_calf` | `enabled: false` |
| `pteranodon` | `ptera_chick` | `enabled: false` |
| `compsognathus` | `compy_pack` | `enabled: false` |
| `ornithomimus` | `exp_chaser` | `enabled: false` |

ND implementation should only align IDs. Enabling these synergies should wait for:

- playable dinosaur QA
- balance QA
- UI text review
- companion synergy CS follow-up approval

## Development Steps

### ND02: Data definitions

- Add six base dinosaurs to roster data and debug ID sets.
- Add `DINO_CONFIGS` entries.
- Add normal attack definitions with placeholder asset keys only if assets are planned in the same branch phase.
- Add unlock policy draft.
- Add branch definitions for speed / hunting / attack / zero.
- Keep assets and runtime effects behind safe fallbacks until ND03-ND05.

### ND03: Hero / icon / UI assets

- Generate base hero and portrait assets.
- Add dino select / home / codex display assets.
- Confirm visual consistency with existing hero art.
- Add contact sheet for hero/portrait crops.

### ND04: Sprite sheets

- Generate base sprite sheets and branch sheets.
- Use fixed facing, one subject, safe cell margins, contact sheets, and JSON reports.
- Connect manifest metadata with fixed display sizes.
- Verify no flicker, no giant-sheet display, no adjacent-cell contamination.

### ND05: Normal attacks and effects

- Implement each normal attack and visual effect.
- Add sound hooks only if assets exist or a safe reuse is approved.
- Keep balance conservative.
- Verify all six can start PlayScene without console warnings.

### ND06: Evolution and ZERO branches

- Connect speed / hunting / attack branch behavior and ultimates.
- Add ZERO branch data and assets.
- Validate existing `spinosaurus_zero`.
- Decide whether any new ZERO branch becomes publicly unlockable in this update.

### ND07: Codex / unlock / save QA

- Add codex entries and unknown states.
- Add research or unlock routes.
- Verify existing saves, invalid selected IDs, locked dinosaurs, and route discovery.

### ND08: Production QA and merge decision

- Full normal / hard / expert / zero smoke QA.
- Mobile UI QA for dino select pagination and codex.
- Performance QA with all new sheets loaded.
- Version/news only when main integration is approved.

## Risks

- Six dinosaurs plus full branch trees is a large asset count and can bloat bundle size.
- Current roster and codex UI contain hard-coded arrays and special cases; adding six at once may expose layout constraints.
- Sprite sheet generation can regress into edge clipping or adjacent-cell contamination if not processed through the P04j-style QA pipeline.
- Pteranodon and Compsognathus have unusual silhouettes that may need custom display sizes.
- ZERO route reward mapping cannot simply assign many rewards to existing stages without changing reward design.
- Companion synergy IDs are reserved, but enabling them before balance QA can create overpowered combinations.
- Existing `spinosaurus_zero` contradicts the older "missing" assumption; avoid duplicate route IDs.

## QA Policy

Minimum QA before production completion:

- `node --check` all touched JS files
- `git diff --check`
- `npm.cmd run build`
- dino select with 10 total dinosaurs
- home display for each unlocked dinosaur
- PlayScene start for each base dinosaur
- normal attack visual and hit QA for each base dinosaur
- sprite sheet frame stability QA
- evolution branch selection for every new normal branch
- ZERO branch hidden / discovered states
- codex known / unknown states
- save migration with old saves
- mobile width dino select and codex
- runtime console error/warn 0

## ND01 Result

ND01 completed as design-only investigation.

No code, asset, save, version, or news changes were made.

## ND02 Result

ND02 added data-only definitions for the six planned playable dinosaurs.

Added dinosaur IDs:

- `ankylosaurus`
- `parasaurolophus`
- `stegosaurus`
- `pteranodon`
- `compsognathus`
- `ornithomimus`

Added normal attack IDs:

- `ankylosaurusTailClub`
- `parasaurolophusSonicPulse`
- `stegosaurusPlateQuake`
- `pteranodonWindLance`
- `compsognathusPackBite`
- `ornithomimusSprintKick`

Added branch IDs:

- `ankylosaurus_speed`, `ankylosaurus_hunting`, `ankylosaurus_attack`, `ankylosaurus_zero`
- `parasaurolophus_speed`, `parasaurolophus_hunting`, `parasaurolophus_attack`, `parasaurolophus_zero`
- `stegosaurus_speed`, `stegosaurus_hunting`, `stegosaurus_attack`, `stegosaurus_zero`
- `pteranodon_speed`, `pteranodon_hunting`, `pteranodon_attack`, `pteranodon_zero`
- `compsognathus_speed`, `compsognathus_hunting`, `compsognathus_attack`, `compsognathus_zero`
- `ornithomimus_speed`, `ornithomimus_hunting`, `ornithomimus_attack`, `ornithomimus_zero`

ND02 intentionally does not expose the six dinosaurs in dino select or codex UI, does not add asset manifest keys, and does not reference missing image files. The new normal attacks reuse existing safe effect/icon keys until ND05 creates dedicated effects.

Companion synergy ID alignment was confirmed with the existing future reservations:

- `ankylosaurus` x `medic_saur`
- `parasaurolophus` x `para_juvenile`
- `stegosaurus` x `stego_calf`
- `pteranodon` x `ptera_chick`
- `compsognathus` x `compy_pack`
- `ornithomimus` x `exp_chaser`

These six synergies remain disabled. Enabling them is a later balance and QA decision, not part of ND02.

`spinosaurus_zero` already exists in main and was not duplicated. ND06 should verify its quality, route unlock, and ZERO reward mapping.

Detailed implementation notes are in `docs/design/new_dinos_data_nd02.md`.

## ND03 Result

ND03 generated and connected base UI art for the six new dinosaurs:

- hero images for dino select detail
- dino-select portrait images
- 144px icon / HUD portrait images

The existing hero images were rechecked during ND03. Their composition is a frontal or three-quarter-front intimidation pose, not a right-facing side profile. Early right-facing drafts were not adopted; final ND03 assets use the front-facing threat composition to match existing `velociraptor`, `triceratops`, `tyrannosaurus`, and `spinosaurus` hero art.

New assets:

- `public/assets/dinos/dino_select/ankylosaurus_hero.png`
- `public/assets/dinos/dino_select/ankylosaurus_portrait.png`
- `public/assets/dinos/portraits/ankylosaurus.png`
- `public/assets/dinos/dino_select/parasaurolophus_hero.png`
- `public/assets/dinos/dino_select/parasaurolophus_portrait.png`
- `public/assets/dinos/portraits/parasaurolophus.png`
- `public/assets/dinos/dino_select/stegosaurus_hero.png`
- `public/assets/dinos/dino_select/stegosaurus_portrait.png`
- `public/assets/dinos/portraits/stegosaurus.png`
- `public/assets/dinos/dino_select/pteranodon_hero.png`
- `public/assets/dinos/dino_select/pteranodon_portrait.png`
- `public/assets/dinos/portraits/pteranodon.png`
- `public/assets/dinos/dino_select/compsognathus_hero.png`
- `public/assets/dinos/dino_select/compsognathus_portrait.png`
- `public/assets/dinos/portraits/compsognathus.png`
- `public/assets/dinos/dino_select/ornithomimus_hero.png`
- `public/assets/dinos/dino_select/ornithomimus_portrait.png`
- `public/assets/dinos/portraits/ornithomimus.png`

Contact / report artifacts:

- `docs/assets/nd03_new_dinos_hero_contact.png`
- `docs/assets/nd03_new_dinos_icon_contact.png`
- `docs/assets/nd03_new_dinos_asset_report.json`

UI exposure:

- Dino select now lists the six dinosaurs as locked future candidates with preview art.
- Codex registers the six dinosaurs as locked/unknown entries with debug unlock support for QA.
- Home and PlayScene do not load the six dinosaurs yet.

Deferred to later phases:

- gameplay sprite sheets
- normal attack effect assets
- evolution branch hero/portrait/icon assets
- ZERO branch assets
- public unlock routes
- save migration and full playable QA

Detailed implementation notes are in `docs/design/new_dinos_assets_nd03.md`.

## ND06 Result

ND06 generated and connected the six new dinosaurs' evolution branch assets:

- 24 branch hero images
- 24 branch portraits
- 24 branch gameplay sprite sheets
- 24 branch special icons
- 24 branch normal-attack accent effects
- 24 branch ultimate/special effect images

The branch set covers `speed`, `hunting`, `attack`, and `zero` for:

- `ankylosaurus`
- `parasaurolophus`
- `stegosaurus`
- `pteranodon`
- `compsognathus`
- `ornithomimus`

The six ZERO branches are now data/assets ready but remain future ZERO route gated. ND06 did not unlock them unconditionally and did not change save progression.

`spinosaurus_zero` was rechecked. Its hero, portrait, sprite sheet, special icon, evolution definition, and ultimate definition already exist. It remains unassigned in the current stage-to-ZERO-route reward map and should be considered for a future route such as `ruins`.

Detailed implementation notes are in `docs/design/new_dinos_evolutions_nd06.md`.

## ND07 Result

ND07 connected the six new base dinosaurs to the same research-unlock flow used by `spinosaurus`.

Added research unlocks:

- `ankylosaurus_unlock` -> `ankylosaurus`
- `parasaurolophus_unlock` -> `parasaurolophus`
- `stegosaurus_unlock` -> `stegosaurus`
- `pteranodon_unlock` -> `pteranodon`
- `compsognathus_unlock` -> `compsognathus`
- `ornithomimus_unlock` -> `ornithomimus`

The new dinosaurs are no longer permanent future-lock entries in dino select. They remain locked until research is purchased, then become selectable and available in Home rotation. Existing saves remain compatible; if a save has a completed research level but no `unlockedDinos` entry, normalization backfills the unlock.

Codex entries are connected to base unlock state. After unlock, base information is visible and non-ZERO branches can hydrate from `evolution_data`; ZERO branches remain future route gated.

HUD and result display now resolve base/evolution portraits and special icons for the six new dinosaurs, avoiding fallback to existing dinosaur portraits.

ND07 did not enable companion synergy reservations and did not assign new ZERO route rewards.

Detailed implementation notes are in `docs/design/new_dinos_unlock_qa_nd07.md`.

## ND09 Result

ND09 was opened after ND08 because visual review found that the six new dinosaurs'
evolution branches were too close to color variants of the base dinosaurs.

ND09 reprocessed all 24 evolution sets in place while preserving existing runtime
paths and manifest keys:

- hero
- portrait
- gameplay sprite sheet
- special icon
- branch attack effect
- ultimate effect

The polish pass adds branch-specific silhouette, organ, and effect cues:

- `speed`: lighter streamlined accents, motion rails, thinner cyan energy lines.
- `hunting`: sensor/eye/targeting cues, claw and pursuit accents.
- `attack`: heavier weapon-organ emphasis, stronger impact and energy shapes.
- `zero`: abnormal cracks, crystal/corruption cues, cyan/red-purple unstable glow.

The pass also regenerated ND09 QA artifacts:

- `docs/assets/nd09_new_dinos_evolution_hero_contact.png`
- `docs/assets/nd09_new_dinos_evolution_sprite_contact.png`
- `docs/assets/nd09_new_dinos_evolution_effect_contact.png`
- `docs/assets/nd09_new_dinos_evolution_asset_report.json`

Report result:

- missing asset: 0
- sprite/effect edge issue: 0
- minimum measured transparent margin: 12 px

ND09 does not change unlock rules, save structure, companion synergy enabled
state, version, or news. The ND08 merge decision should be considered superseded
until ND09 visual QA is accepted.

Detailed implementation notes are in
`docs/design/new_dinos_evolution_asset_polish_nd09.md`.

## ND09b Result

ND09 was rejected as a final art pass because it relied on local reprocessing.
ND09b replaces the 24 evolution branch sets again, this time using generated
creature concept sheets and generated branch effect sheets as the source.

Generated source sheets are stored in:

- `docs/assets/nd09b_sources/`

ND09b regenerated:

- `docs/assets/nd09b_new_dinos_evolution_hero_contact.png`
- `docs/assets/nd09b_new_dinos_evolution_sprite_contact.png`
- `docs/assets/nd09b_new_dinos_evolution_effect_contact.png`
- `docs/assets/nd09b_new_dinos_evolution_asset_report.json`

Report result:

- branch count: 24
- missing asset: 0
- sprite/effect edge issue: 0
- minimum measured transparent margin: 12 px

ND09b does not change unlock rules, ZERO route gating, save structure, companion
synergy enabled state, version, or news.

Detailed implementation notes are in
`docs/design/new_dinos_evolution_asset_regen_nd09b.md`.
