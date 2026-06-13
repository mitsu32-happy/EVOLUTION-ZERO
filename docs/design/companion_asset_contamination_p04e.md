# MVP-P04e Companion Asset Contamination and Display Stabilization

## Scope

P04e addresses the post-P04d display regression:

- flickering impression during movement/action
- oversized companion display, especially heavy companions
- persistent small visual fragments that looked like adjacent-cell contamination
- unstable release direction from scaling polluted sheets larger

This pass does not change save data, companion AI, hatch flow, egg flow, damage, cooldowns, or main branch integration.

## Giant Display Cause

P04d increased the runtime display baseline to `170 x 134`.

That baseline was then multiplied by:

- per-companion `displayScale`
- the older `profile.scale` animation multiplier
- action scale during action frames

For `rex_hatchling`, this could push the effective width well above the player display size. This made some frames look like a giant image rather than a companion.

Fix:

- runtime display baseline reduced to `124 x 98`
- permanent size now uses only `displayScale`
- `profile.scale` was removed from the per-frame runtime scale calculation
- larger companions remain slightly larger through `displayScale`, but no longer double-scale

## Flicker Cause

The frame switching code itself clamps frame indexes and uses valid sub-textures. No out-of-range frame index was found.

The flicker impression came from:

- oversized P04d display exaggerating frame deltas
- P04d action/backdrop strokes inside sprite cells
- action/move frames changing too visibly at the oversized scale

Fix:

- reduced runtime size to a safer playfield range
- regenerated cleaner P04e sheets with fewer loose in-cell strokes
- kept normal guide/ring hidden
- reduced default companion effect scale from `0.52` to `0.42`

## Contamination Cause

The most important finding is that the active P04d sheet validation only proved each P04d cell had margin. It did not prove the source art was clean.

Component inspection found small isolated alpha components inside several P04 single PNGs, for example:

- `medic_saur_sprite_p04.png`
- `ptera_chick_sprite_p04.png`
- `rex_hatchling_sprite_p04.png`
- `spino_pup_sprite_p04.png`
- `para_juvenile_sprite_p04.png`

These were not adjacent-cell bleed from P04d slicing. They were already present as small separated fragments in the single source PNGs or were added during P04d generation as small action cues. When enlarged, they looked like cell contamination.

## Adopted Fix

P04e uses a clean-asset regeneration pipeline:

1. Start from P04 single companion PNGs, not P04c/P04d sheets.
2. Remove small isolated connected alpha components before generating frames.
3. Rebuild `idle`, `move`, and `action` rows from the cleaned subject.
4. Keep each frame centered inside a 384 x 384 cell.
5. Regenerate effect sheets from cleaned P04 effect PNGs.
6. Keep P04d assets on disk for comparison, but remove them from active manifest references.

## Generated P04e Assets

Sprite sheets:

- `public/assets/companions/{id}_sprite_sheet_p04e.png`
- 4 columns x 3 rows
- 384 x 384 per frame

Effect sheets:

- `public/assets/companions/{id}_effect_sheet_p04e.png`
- 4 columns x 1 row
- 320 x 320 per frame

QA files:

- `docs/assets/p04e_companion_animation_contact.png`
- `docs/assets/p04e_companion_animation_report.json`

## Size Re-Adjustment

P04e runtime display size:

- base width: `124`
- base height: `98`

This is larger than the P04c.1 visual direction, but safely below the oversized P04d result. Heavy companions such as `rex_hatchling` and `tricera_calf` remain slightly larger through `displayScale`.

Follow position was also reduced from the P04d wide offset:

- initial offset: `+92, +38`
- orbit offset: `52 x, 22 y` around `+92, +38`

## Fallback

No full fallback to P04b/P04c.1 was required.

Instead, P04e supersedes P04d with cleaned P04-source sheets and safer runtime sizing.

P04d files remain available for investigation but are no longer active manifest targets.

## Remaining Risk

- The P04e sheets are still generated from single pose art, not hand-drawn full walk cycles.
- Move rows use clean body lean/scale/position changes rather than individually redrawn legs.
- Real-device visual QA should confirm the cleaned sheets no longer look contaminated.
- If true walk readability is still insufficient, the next pass should create hand-authored per-frame art rather than deriving frames from single PNGs.
