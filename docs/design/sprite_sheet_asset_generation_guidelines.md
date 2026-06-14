# Sprite Sheet Asset Generation Guidelines

## Purpose

This guide captures the P04j companion generation workflow so it can be reused
for player character and enemy sprite sheet generation.

The main lesson is that animation sheets should be generated as consistent,
direction-locked pose sets with enough cell safety margin for runtime slicing.
Do not rely on post-generation stretching, leg-only editing, or compositing to
create motion.

## Prompt Requirements

Use these rules for player, companion, and enemy animation sheets:

- fixed facing direction for every frame in the sheet
- one subject per frame unless the unit is intentionally a group unit
- no unrelated dinosaurs, enemies, allies, animals, shadows, or background figures
- each frame is a complete finished pose, not a partial body or layer
- frame rows must have a clear state definition such as `idle`, `move`, `action`
- subject centered in each cell
- subject should occupy about 50-60% of each cell, leaving wide transparent padding
- no text, grid, separators, UI frame, floor shadow, scenery, or decorative border
- use a flat chroma key background such as `#ff00ff` only when transparent output is unavailable
- keep world style consistent with EVOLUTION ZERO: dark SF, ancient creature, readable silhouette

## Direction Lock

Direction must be chosen before generation and kept stable.

Recommended default:

- right-facing side view for player/companions/enemies

Reason:

- runtime facing can be controlled by scale/flipping
- animation state logic stays simple
- attack and movement frames do not need per-direction remapping
- contact sheets are easier to inspect

Do not mix front, three-quarter, and side views in the same runtime sheet unless
the runtime renderer has explicit direction-state support.

## Cell Safety

Each generated sheet should be processed into fixed runtime cells.

Recommended runtime cell:

- companions: `384 x 384`
- effects: `320 x 320`
- player/enemy: choose based on source size, but keep all states the same cell size

Safety rules:

- crop source cells inward before normalization when generated cells are close to boundaries
- normalize every frame to a fixed canvas
- keep at least `32px` runtime margin after normalization
- reject sheets with tails, wings, weapons, effects, or particles touching the cell edge
- reject sheets with adjacent-cell remnants or another character in the frame

## Processing Pipeline

Recommended local pipeline:

1. Generate source sheet with fixed rows and columns.
2. Remove chroma key or background.
3. Slice by source grid.
4. Apply inward safe crop if needed.
5. Find alpha bbox per frame.
6. Resize subject to target maximum width/height.
7. Paste onto a fixed transparent runtime cell.
8. Run a final chroma-key removal pass.
9. Create a contact sheet on checker background.
10. Create a JSON report with bbox, margins, missing frames, and edge issues.

## QA Requirements

Every generated sheet should have:

- contact sheet for visual review
- JSON report with per-frame margins
- missing frame count
- edge issue count
- minimum margin
- exact or key-like background pixel check where relevant

Reject a sheet if:

- any runtime frame is missing
- any subject touches the runtime cell boundary
- another cell or character appears in the frame
- state rows use inconsistent perspective
- sprite size changes wildly between frames
- runtime animation would need frame-specific scale fixes

## Runtime Integration Rules

Runtime display should remain stable even as texture frames change:

- fixed display width/height per entity type
- fixed anchor
- fixed base scale
- no frame-specific scale recalculation
- no fallback texture alternation during an active animation
- if a frame is missing, freeze on a safe single PNG or first valid frame

This mirrors the P04f companion stabilization and prevents flicker, giant-sheet
display, and tiny/normal frame alternation.

## Notes From P04j

P04j used:

- `384 x 384` cells
- `4 columns x 3 rows`
- `30px` inward crop before normalization
- reduced subject target size compared with P04i
- minimum runtime frame margin of `45px`
- final contact sheet and JSON report

This approach is suitable for future player-character and enemy sheets as long
as each asset type defines its own final runtime display size.
