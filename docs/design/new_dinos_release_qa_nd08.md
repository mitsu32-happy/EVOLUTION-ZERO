# ND08 New Dinos Release QA

## Scope

ND08 is the release-candidate QA pass for the six new player dinosaurs on `feature/new-dinos-six-v1`.

Target dinosaurs:

- `ankylosaurus`
- `parasaurolophus`
- `stegosaurus`
- `pteranodon`
- `compsognathus`
- `ornithomimus`

No feature changes, version updates, news updates, main merge, or push were performed in ND08.

## Post-QA Asset Quality Follow-Up

ND08 initially reached a main-merge candidate judgment, but later visual review
found the new six dinosaurs' evolution branches were not yet production quality.

Follow-up passes:

- ND09: attempted evolution-asset polish, rejected as too close to local
  processing / color-shift treatment.
- ND09b: regenerated dedicated evolution illustrations and effects for all 24
  branches.
- ND09c: corrected hero composition and regenerated branch-specific gameplay
  animation sheets.

Current ND09c asset QA summary:

- 24 evolution hero images now use the front / three-quarter-front intimidation
  composition expected by existing hero art.
- 24 evolution gameplay sprite sheets now exist as individual right-facing
  `4x4` sheets per branch.
- `docs/assets/nd09c_new_dinos_evolution_asset_report.json` reports missing
  asset 0, edge issue 0, cell contamination 0, and minimum sprite cell margin
  32 px.

Main-merge readiness must be rechecked after ND09c runtime QA.

## Clean Save QA

Method:

- Used an in-memory `SaveManager` instance with no existing save data.
- Checked base unlock state, research item presence, cost data, research purchase, save, and reload.

Results:

- New six dinosaurs are locked on clean save.
- All six research unlock items exist in `unknownDomain`.
- Cost display data resolves:
  - `ankylosaurus_unlock`: DNA 1400 / Research Pt 260
  - `parasaurolophus_unlock`: DNA 1200 / Research Pt 250
  - `stegosaurus_unlock`: DNA 1400 / Research Pt 270
  - `pteranodon_unlock`: DNA 1300 / Research Pt 260
  - `compsognathus_unlock`: DNA 1100 / Research Pt 240
  - `ornithomimus_unlock`: DNA 1200 / Research Pt 250
- With insufficient resources, existing research purchase guards still block purchase.
- With sufficient DNA / Research Pt, all six unlock and persist.
- Reloaded save restores all six unlocked states.

Result: PASS

## Existing Save Compatibility

Method:

- Loaded an old-shape save with `researchLevels` but without `unlockedDinos`.
- Checked unlock backfill.

Results:

- Existing saves with no new dino data remain valid and keep new six locked.
- Old-shape saves with completed research levels backfill the matching `unlockedDinos` entries.
- Existing base dinosaurs remain unaffected.

Result: PASS

## New Six PlayScene QA

Browser QA route:

- `debugIntroSeen=1`
- `debugAutoPlay=1`
- `debugNoPickupCollect=1`
- `debugInvincible=1`
- `debugDino={id}`
- `debugStage=jungle`
- `debugDifficulty=normal`

Results:

| Dino | Boot | Canvas | Runtime warn/error |
| --- | --- | --- | --- |
| `ankylosaurus` | OK | OK | 0 |
| `parasaurolophus` | OK | OK | 0 |
| `stegosaurus` | OK | OK | 0 |
| `pteranodon` | OK | OK | 0 |
| `compsognathus` | OK | OK | 0 |
| `ornithomimus` | OK | OK | 0 |

Covered:

- PlayScene boot
- gameplay sprite visibility
- idle / move loop present through live scene
- normal attack definitions/effects connected
- HUD portrait fallback no longer points to an unrelated existing dinosaur

Result: PASS

## Evolution Branch QA

Browser QA route:

- `debugDino={id}`
- `debugEvolution={speed|hunting|attack}`

Results:

- 18/18 non-ZERO branch combinations booted successfully.
- Canvas visible for every branch.
- Runtime warn/error: 0 for every branch.
- Evolution portrait and special icon path checks resolve through ND06 assets.

ZERO policy:

- `speed`, `hunting`, and `attack` are connected for QA.
- `zero` branches exist in data/assets.
- `zero` branches are not unconditionally unlocked in normal save state.

Result: PASS

## Codex QA

Checked by data flow and browser-safe boot:

- Unlocked state is driven by `SaveManager.isDinoUnlocked()`.
- Locked new dinosaurs remain hidden/unknown in normal save state.
- After research unlock, base dino information is available.
- Non-ZERO branch cards hydrate from `evolution_data`.
- ZERO branches remain future route gated / undiscovered.

Result: PASS

## Home / Select QA

Checked:

- Home boot with unlocked roster debug: canvas visible, runtime warn/error 0.
- New six are included in home rotation only after unlock.
- Dino select treats new six as `locked: 'research'`, not permanent future lock.
- Locked cards retain preview art and cost hints.
- Unlocked entries are selectable and can boot PlayScene.
- Existing dino select paths remain available.

Result: PASS

## Companion Synergy QA

The new six are companion synergy reservation targets, but ND08 does not activate those synergies.

Checked:

- `ankylosaurus` x `medic_saur`: `enabled: false`, active false
- `parasaurolophus` x `para_juvenile`: `enabled: false`, active false
- `stegosaurus` x `stego_calf`: `enabled: false`, active false
- `pteranodon` x `ptera_chick`: `enabled: false`, active false
- `compsognathus` x `compy_pack`: `enabled: false`, active false
- `ornithomimus` x `exp_chaser`: `enabled: false`, active false

Result: PASS

## High Difficulty QA

Short browser boot checks:

| Route | Result | Runtime warn/error |
| --- | --- | --- |
| ZERO `ankylosaurus` | Boot OK / canvas visible | 0 |
| ZERO `pteranodon` attack evolution, special ready | Boot OK / canvas visible | 0 |
| ENDLESS `compsognathus` | Boot OK / canvas visible | 0 |
| ENDLESS `ornithomimus` speed evolution, special ready | Boot OK / canvas visible | 0 |
| Existing `spinosaurus` representative | Boot OK / canvas visible | 0 |

Result: PASS

## Balance Evaluation

Initial ND08 balance rating is based on current normal attack parameters, role identity, and short boot/visual checks. No tuning was applied in ND08.

| Dino | Normal attack | Movement feel | Evolution set | Ultimate set | Initial rating |
| --- | --- | --- | --- | --- | --- |
| `ankylosaurus` | close-range, high knockback, slow cadence | heavy | defensive/heavy identity clear | safe heavy variants | Appropriate |
| `parasaurolophus` | mid-range cone sonic support | moderate | support/search identity clear | safe sonic variants | Appropriate |
| `stegosaurus` | short-range area control | heavy | range-control identity clear | safe quake/plate variants | Appropriate |
| `pteranodon` | long narrow ranged wind lance | agile | air-support identity clear | safe wind variants | Appropriate |
| `compsognathus` | low-damage high-frequency close cleanup | fast/small | pack identity clear | safe pack variants | Appropriate, watch sustained DPS later |
| `ornithomimus` | quick forward impact | fast | speed/growth identity clear | safe sprint variants | Appropriate, watch mobility value later |

No immediate main-blocking balance issue was found.

## Checks

Required checks:

- `node --check` target JS: PASS
- `git diff --check`: PASS
- `npm.cmd run build`: PASS

Build note:

- Existing Vite chunk-size warning remains.

Browser note:

- A browser-control environment Statsig network message appeared during automation. It was not present in app-tab warn/error results and is not counted as EVOLUTION ZERO runtime warning.

## Main Integration Decision

## main統合可

Reason:

- clean save and existing save compatibility passed
- all six base dinosaurs boot in PlayScene
- all 18 non-ZERO branch combinations boot
- ZERO branches remain future-gated
- companion synergy reservations remain disabled
- short ZERO / ENDLESS representative checks passed
- runtime app console warn/error count was 0 in checked routes
- build passed

## Remaining Issues / Follow-up

- ND09 or release prep should perform longer play soaks for all six if time allows.
- Future route planning is still required for the six new ZERO branches and `spinosaurus_zero`.
- Companion synergy activation for the six new dinosaurs remains a separate feature phase.
- Minor balance tuning may be useful after broader player-feel testing, especially `compsognathus` sustained DPS and `ornithomimus` mobility value.

## ND09 Visual Reassessment

After ND08, user visual review found a release-quality asset issue:

- the 24 new evolution branch sets looked too close to base dinosaur color variants
- branch-specific anatomy and effect identity were not strong enough

ND09 was opened to reprocess those assets before main integration. The ND08 `main統合可` judgment is therefore superseded by ND09 visual QA until the polished assets pass checks.

See:

- `docs/design/new_dinos_evolution_asset_polish_nd09.md`
- `docs/assets/nd09_new_dinos_evolution_asset_report.json`

## ND09b Visual Reassessment

ND09 was not accepted as final release-quality art because it was still too close
to local decoration over existing assets. ND09b replaces the ND09 approach with
generated creature/effect sheets for all 24 evolution branches.

The ND08 `main統合可` judgment remains superseded until ND09b visual QA is
accepted.

See:

- `docs/design/new_dinos_evolution_asset_regen_nd09b.md`
- `docs/assets/nd09b_new_dinos_evolution_asset_report.json`
