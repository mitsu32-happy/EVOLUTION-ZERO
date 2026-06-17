# ND07 New Dinos Unlock / Codex / Save QA

## Scope

ND07 connects the six new base dinosaurs to the normal player-facing unlock flow. The goal is to make them unlockable from research like `spinosaurus`, without granting them by default and without changing ZERO evolution route rewards.

Target dinosaurs:

- `ankylosaurus`
- `parasaurolophus`
- `stegosaurus`
- `pteranodon`
- `compsognathus`
- `ornithomimus`

## Research Unlocks

All six dinosaurs are added to the `unknownDomain` research category as one-level unlock research items.

| Dino | Research ID | DNA | Research Pt | Notes |
| --- | --- | ---: | ---: | --- |
| `ankylosaurus` | `ankylosaurus_unlock` | 1400 | 260 | Heavy defense type; cost slightly above `spinosaurus` |
| `parasaurolophus` | `parasaurolophus_unlock` | 1200 | 250 | Sonic support type |
| `stegosaurus` | `stegosaurus_unlock` | 1400 | 270 | Area-control type |
| `pteranodon` | `pteranodon_unlock` | 1300 | 260 | Air support type |
| `compsognathus` | `compsognathus_unlock` | 1100 | 240 | Small pack / high-tempo type |
| `ornithomimus` | `ornithomimus_unlock` | 1200 | 250 | Speed/growth support type |

The existing `spinosaurus_unlock` cost remains unchanged at Research Pt 220.

## Dino Select

The six dinosaurs now use `locked: 'research'` instead of permanent future-lock state.

Before unlock:

- card is visible as a research candidate
- preview art remains available
- sortie is blocked
- unlock hint shows DNA / Research Pt cost

After unlock:

- card becomes selectable
- hero and portrait art resolve from ND03 assets
- PlayScene can start without `debugDino`

## Codex

Codex entries remain locked until the dinosaur is unlocked in save data.

After unlock:

- base name, role, origin, and hero image are visible
- non-ZERO `speed`, `hunting`, and `attack` branch cards are connected to `evolution_data`
- ZERO branch remains undiscovered / locked unless the existing ZERO discovery path unlocks it

## Save Compatibility

No save schema change is required.

Compatibility behavior:

- existing saves without new unlock flags remain valid
- `unlockedDinos` is normalized as before
- if a save already has a new research unlock level greater than 0, `normalizeData()` backfills the matching `unlockedDinos` entry
- unlock source is preserved when present, otherwise set to `research`

Research-to-dino backfill IDs:

- `spinosaurus_unlock` -> `spinosaurus`
- `ankylosaurus_unlock` -> `ankylosaurus`
- `parasaurolophus_unlock` -> `parasaurolophus`
- `stegosaurus_unlock` -> `stegosaurus`
- `pteranodon_unlock` -> `pteranodon`
- `compsognathus_unlock` -> `compsognathus`
- `ornithomimus_unlock` -> `ornithomimus`

## Home / HUD / Result Display

Home dinosaur rotation now includes the six new dinosaurs only after unlock. The default unlocked home roster remains the original three base dinosaurs.

HUD and result screens now load the new base portraits and ND06 evolution portraits / special icons so an unlocked new dinosaur does not fall back to an unrelated existing dinosaur portrait.

## ZERO Evolution Handling

The six new ZERO branches are still data/assets ready but not unconditionally unlocked.

ND07 does not:

- add a new ZERO stage reward route
- grant any new ZERO branch from research
- enable companion synergy reservations

`spinosaurus_zero` remains implemented but unassigned in `ZERO_ROUTE_REWARD_BY_STAGE`.

## QA Result

Static checks:

- `node --check src/data/research.js`
- `node --check src/save/save_manager.js`
- `node --check src/ui/dino_select_screen.js`
- `node --check src/ui/codex_screen.js`
- `node --check src/ui/home_screen.js`
- `node --check src/ui/hud.js`
- `node --check src/ui/result_ui.js`
- `node --check src/core/screen_manager.js`
- `node --check src/scenes/play_scene.js`
- `git diff --check`
- `npm.cmd run build`

Data checks:

- 6/6 new research unlock items exist
- 6/6 in-memory research purchases unlocked the matching dinosaur
- 6/6 legacy saves with only `researchLevels` greater than 0 backfilled `unlockedDinos`
- generated HUD/result portrait and special icon asset paths: missing 0

Browser checks:

- `ankylosaurus`: PlayScene boot OK, canvas visible, app console warn/error 0
- `parasaurolophus`: PlayScene boot OK, canvas visible, app console warn/error 0
- `stegosaurus`: PlayScene boot OK, canvas visible, app console warn/error 0
- `pteranodon`: PlayScene boot OK, canvas visible, app console warn/error 0
- `compsognathus`: PlayScene boot OK, canvas visible, app console warn/error 0
- `ornithomimus`: PlayScene boot OK, canvas visible, app console warn/error 0
- Home with unlocked roster debug: boot OK, canvas visible, app console warn/error 0
- Existing `velociraptor` PlayScene representative: boot OK, canvas visible, app console warn/error 0

Build result:

- Build succeeded.
- Existing Vite chunk-size warning remains.

## Remaining Work

- ND08 should perform release-candidate QA across clean save, existing save, all six research unlocks, and longer PlayScene runs.
- ZERO route assignment for the six new dinosaurs and `spinosaurus_zero` remains a future progression decision.
- Companion synergy reservations for the six new player dinosaurs remain `enabled: false` until a dedicated synergy activation phase.
