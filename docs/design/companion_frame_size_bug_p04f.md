# MVP-P04f Companion Frame Size Bug

## Scope

P04f fixes the runtime frame-size instability observed after P04e. No new companion assets were generated in this pass.

## Symptom

Real-device QA showed:

- tiny frames and normal frames alternating
- flickering caused by the alternating visual size
- cell contamination could not be judged while the size flicker remained

## Cause

The root runtime issue was update order and texture-size reapplication.

Before P04f, `updateCompanion()` calculated and applied sprite scale, then called `updateCompanionSpriteAnimation()` afterward. If that animation call changed the sprite texture, the newly assigned texture could render for one frame without the intended fixed display width/height being reapplied in the same update cycle.

This created a visible alternation between:

- the intended companion display size
- a texture-frame-derived size for the newly switched frame

The issue was especially visible with P04e/P04d sheets because the visible subject inside each 384 x 384 frame differs by pose.

## Investigation Result

Confirmed runtime properties:

- frame indexes are clamped to valid columns
- state rows are clamped to valid rows
- fallback and sheet frames are not intentionally alternated
- manifest frame sizes match the P04e sheet dimensions
- the flicker path was not caused by missing assets or 404s

The risky path was texture assignment after scale calculation.

## Fix

P04f adds a single texture-application path:

- `applyCompanionSpriteTexture(texture)`

That helper always applies:

- texture
- anchor `(0.5, 0.72)`
- fixed companion display width/height
- refreshed base scale values

P04f also changes update order:

1. determine companion animation state
2. switch animation frame if needed
3. reapply fixed texture size
4. calculate action/facing scale
5. draw overlays

This ensures texture changes cannot leave a one-frame bean-size render.

## Texture Metadata Stabilization

P04f also sets `orig` explicitly when creating Pixi sub-textures from sprite/effect sheets.

This keeps the logical texture size aligned with:

- sprite frame: `384 x 384`
- effect frame: `320 x 320`

## Animation Status

Animation remains enabled.

No fallback to static idle-only display was required because the runtime fixed-size path addresses the observed alternating-size bug.

## Debug Support

When `debugCompanion=1`, the companion debug label now includes:

- current state
- frame index
- texture frame size
- sprite display size
- sprite scale
- anchor
- fallback usage

These values are hidden in normal play.

## Reopen Conditions

If flicker persists after P04f, the next investigation should capture the `debugCompanion=1` label during the flicker and compare:

- `tex`
- `size`
- `sc`
- `state/frame`

If those values are stable but the visible dinosaur still changes size, the remaining issue is likely inside the generated sheet art itself rather than runtime scale.
