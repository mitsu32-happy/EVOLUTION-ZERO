# ND02 New Playable Dinosaurs Data Definitions

Date: 2026-06-16
Branch: `feature/new-dinos-six-v1`

## Scope

ND02 adds code-level IDs, base configs, normal attack IDs, and evolution branch IDs for the six new playable dinosaurs. It does not add or connect new image assets, sprite sheets, effects, unlock routes, news, version changes, or main integration.

The new dinosaurs are intentionally not exposed in dino select or codex UI during ND02. This avoids loading missing asset keys before ND03-ND07 provide production art and UI states.

## Added Dinosaur IDs

| ID | Display name | Gameplay concept | Companion synergy reservation |
| --- | --- | --- | --- |
| `ankylosaurus` | アンキロサウルス | Defense, durability, close-range knockback | `medic_saur` |
| `parasaurolophus` | パラサウロロフス | Sonic support, exploration, pickup support | `para_juvenile` |
| `stegosaurus` | ステゴサウルス | Area attacks, plate energy, crowd control | `stego_calf` |
| `pteranodon` | プテラノドン | Mobility, ranged wind attacks, aerial support | `ptera_chick` |
| `compsognathus` | コンプソグナトゥス | Speed, many small hits, pack cleanup | `compy_pack` |
| `ornithomimus` | オルニトミムス | High speed, pickup tempo, growth support | `exp_chaser` |

The companion synergy IDs already match `src/data/companion_synergy.js`. ND02 does not enable the six future synergies.

## Normal Attack IDs

| Dinosaur ID | Normal attack ID | Shape | ND02 asset handling |
| --- | --- | --- | --- |
| `ankylosaurus` | `ankylosaurusTailClub` | Circle | Reuses safe triceratops impact effect/icon |
| `parasaurolophus` | `parasaurolophusSonicPulse` | Cone | Reuses safe spinosaurus water slash effect/icon |
| `stegosaurus` | `stegosaurusPlateQuake` | Circle | Reuses safe triceratops impact effect/icon |
| `pteranodon` | `pteranodonWindLance` | Rectangle | Reuses safe velociraptor claw effect/icon |
| `compsognathus` | `compsognathusPackBite` | Arc | Reuses safe velociraptor claw effect/icon |
| `ornithomimus` | `ornithomimusSprintKick` | Rectangle | Reuses safe velociraptor claw effect/icon |

These attacks are data-ready fallbacks only. Dedicated visual effect assets are planned for ND05.

## Evolution Branch IDs

Each new dinosaur now has speed, hunting, attack, and zero branch data. The non-ZERO branches use `assetStatus: "pending"` and do not define `heroPath`, `portraitPath`, `sheetPath`, or `specialIconPath`.

| Dinosaur ID | Speed | Hunting | Attack | ZERO |
| --- | --- | --- | --- | --- |
| `ankylosaurus` | `ankylosaurus_speed` | `ankylosaurus_hunting` | `ankylosaurus_attack` | `ankylosaurus_zero` |
| `parasaurolophus` | `parasaurolophus_speed` | `parasaurolophus_hunting` | `parasaurolophus_attack` | `parasaurolophus_zero` |
| `stegosaurus` | `stegosaurus_speed` | `stegosaurus_hunting` | `stegosaurus_attack` | `stegosaurus_zero` |
| `pteranodon` | `pteranodon_speed` | `pteranodon_hunting` | `pteranodon_attack` | `pteranodon_zero` |
| `compsognathus` | `compsognathus_speed` | `compsognathus_hunting` | `compsognathus_attack` | `compsognathus_zero` |
| `ornithomimus` | `ornithomimus_speed` | `ornithomimus_hunting` | `ornithomimus_attack` | `ornithomimus_zero` |

## ZERO Evolution Policy

The six new ZERO branches are data-only reservations. They use:

- `tier: "zero"`
- `zeroRoute: true`
- `hiddenUntilDiscovered: true`
- `unlockCondition: "future ZERO route"`
- Lv8 plus speed / hunting / attack Lv3 requirements

No stage reward route is assigned in ND02. Public unlock routing is deferred to ND06/ND07.

## Spinosaurus ZERO

`spinosaurus_zero` already exists in main and is not duplicated in ND02. ND06 should re-check its asset quality, unlock condition, and ZERO reward route because the branch data exists but route reward mapping still needs final validation.

## Changed Files

- `src/data/run_config.js`
  - Added six `DINO_CONFIGS` entries.
- `src/data/normal_attacks.js`
  - Added six normal attack definitions with safe existing effect/icon keys.
- `src/data/evolution_data.js`
  - Added pending branch helper functions.
  - Added 24 branch definitions for six new dinosaurs.
- `src/core/game_state.js`
  - Added six ZERO requirement entries.
- `docs/design/new_dinos_six_v1_plan.md`
  - Added ND02 result notes.
- `docs/design/new_dinos_data_nd02.md`
  - Added this implementation handoff.

## Asset Safety

ND02 does not add new asset manifest keys and does not reference missing asset files. New branch entries omit direct paths until production assets exist. Dino select and codex UI are not expanded in this step, so the current app continues to load only existing production assets.

## Unlock Policy

The six dinosaurs are not publicly unlockable in ND02. ND03-ND07 should decide:

- when each dinosaur appears in dino select
- whether entries are locked, hidden, or research-gated
- how codex unknown states should render
- how save migration handles invalid selected IDs

## QA Notes

Required ND02 checks:

- `node --check` on touched JS files
- import smoke test for new dino configs, normal attacks, branches, and disabled synergy reservations
- `git diff --check`
- `npm.cmd run build`

Runtime PlayScene QA should continue using existing four playable dinosaurs until ND03+ provides safe UI assets for the new six.

## ND03 Handoff

ND03 should generate and connect:

- base hero art
- icon / portrait art
- dino select card imagery
- codex UI imagery
- contact sheets and QA reports

The implementation should keep the P04j companion sprite-sheet safety rules: one subject per cell, fixed facing, transparent padding, no edge clipping, no adjacent-cell contamination, and contact-sheet review before manifest connection.
