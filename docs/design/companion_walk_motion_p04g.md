# MVP-P04g Companion Walk Motion Pass

P04g improves the readability of companion movement without changing save data, AI strength, balance values, display size, or the P04f fixed-size runtime path.

## Goal

P04f stabilized frame size, flicker, and mixed-frame display. The remaining issue was that the `move` row still looked like a mostly static image sliding around. P04g generates new sprite sheets from the clean P04 single companion PNGs and replaces the active sprite-sheet paths with P04g sheets.

## Scope

- Active files added: `public/assets/companions/{id}_sprite_sheet_p04g.png`
- Cell size remains `384 x 384`
- Sheet layout remains `4 columns x 3 rows`
- Updated row: `move` row only
- Idle/action rows remain from P04e
- Effect sheets remain unchanged
- Runtime display size and P04f texture-size stabilization remain unchanged
- The P04e sheets remain on disk for rollback/reference

## Frame Construction

Walking companions use four move frames:

1. forward lean with one foot extended
2. lifted/crossing intermediate pose
3. opposite foot extended
4. lifted recovery pose

The pass strengthens frame-to-frame pose differences:

- body lean
- body vertical motion
- subtle head/tail weight shift
- species-specific movement rhythm

P04g intentionally avoids additive foot markers, afterimages, ghost bodies, or duplicated overlays because those read as double images in real play.

Non-walking companions use role-specific motion:

- `ptera_chick`: stronger wing-flap up/down silhouettes
- `compy_pack`: pack silhouette shifts as one regenerated frame, not layered ghost copies
- `exp_chaser`: floating follow pose difference

## Per-Companion Changes

| Companion | Move improvement |
| --- | --- |
| `raptorling` | Faster forward-leaning run with clearer pose difference. |
| `spino_pup` | Heavier aquatic step with slower body sway and shorter stride. |
| `medic_saur` | Gentle low-impact walk with smaller lift. |
| `tricera_calf` | Heavy stomp with lower body feel and guarded foot placement. |
| `para_juvenile` | Lighter walk with more head/body sway. |
| `stego_calf` | Heavy step with plate-sway impression and purple contact cues. |
| `rex_hatchling` | Stronger power trot with head/tail balance and larger stride. |
| `ptera_chick` | Wing-flap phase contrast, including raised and lowered silhouettes. |
| `compy_pack` | Pack silhouette shifts without extra ghost layering. |
| `exp_chaser` | Floating follow motion with stronger up/down pose difference. |

## P04f Stability Impact

No P04f runtime stabilizers were changed:

- `applyCompanionSpriteTexture()` remains the texture switch path
- fixed companion width/height remains active on every texture change
- anchor and base scale remain fixed
- frame switch order remains texture first, runtime scale second
- sub-texture `orig` handling remains active
- normal gameplay guide rings remain hidden

## QA Notes

Expected checks:

- `debugCompanionId` for all 10 companions
- no bean-size/standard-size alternating display
- no frame-size flicker
- no adjacent-cell contamination
- no console error/warn
- build succeeds

## Remaining Work

P04g is still a generated motion pass based on existing P04e art. Full hand-authored animation can further improve foot anatomy and species-specific gait, but this pass moves the active sheets closer to a readable product-level movement baseline without destabilizing runtime rendering.
