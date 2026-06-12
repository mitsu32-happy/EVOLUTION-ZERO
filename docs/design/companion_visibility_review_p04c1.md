# MVP-P04c.1 Companion Dino Visibility Review

## Scope

P04c.1 focuses only on in-play companion visibility. It does not change companion AI, save data, balance values, egg flow, or main branch integration.

## Current Size

- Previous companion sprite display size: 74 x 58.
- Standard player sheet display size reference: 116 x 92.
- Previous ratio against player: about 64% width and 63% height.
- Common enemy display sizes range from about 68 x 48 to 104 x 78, with large enemies and bosses above that.

The companion was technically visible, but on mobile screens it was too close to small enemy scale. Because companions need to communicate identity, animation state, and action timing, the 74 x 58 size was not enough for release-quality readability.

## Problems

- The companion looked too small to identify during movement.
- Idle/move/action sprite sheet differences were difficult to read.
- Action timing was hard to notice unless the player watched closely.
- The guide ring around the companion looked like a development overlay rather than an in-world effect.
- The previous follow offset could make the companion feel tucked too close to the player once effects or enemies crowded the screen.

## Options Considered

### Option A: Uniform Enlargement

Increase every companion by the same amount. This is simple and predictable, but weakens body-size differences such as compy_pack being small and rex_hatchling/tricera_calf being heavier.

### Option B: Per-Companion Scale

Give each companion its own display multiplier. This preserves personality and species silhouette, but needs a shared baseline to avoid uneven UI expectations.

### Option C: Dedicated Companion Display Baseline

Use a companion-specific base size independent of general UI scale, then allow small per-companion variation. This is the most stable approach because it keeps combat readability separate from UI tuning.

## Adopted Approach

P04c.1 uses Option B + Option C.

- New companion display baseline: 104 x 82.
- Per-companion displayScale controls body-size identity.
- Approximate resulting sizes:
  - raptorling: 106 x 84
  - spino_pup: 110 x 87
  - medic_saur: 108 x 85
  - ptera_chick: 104 x 82
  - tricera_calf: 119 x 93
  - para_juvenile: 108 x 85
  - stego_calf: 112 x 89
  - rex_hatchling: 121 x 95
  - compy_pack: 98 x 77
  - exp_chaser: 104 x 82

This keeps companions smaller than the player but large enough for animation and action state to read on mobile.

## Guide Ring Decision

The companion guide ring has low player-facing value and looks like a debug marker. It is now hidden during normal play.

Retained debug use:

- `debugCompanion=1`
- `debugCompanionGuide=1`

Normal play keeps only a subtle shadow, soft glow, and action-time emphasis. This preserves readability without showing a development-style target ring.

## Implementation

- Added `COMPANION_BASE_WIDTH` and `COMPANION_BASE_HEIGHT`.
- Added `displayScale` to each `COMPANION_ANIMATION_PROFILES` entry.
- Enlarged the sprite display baseline from 74 x 58 to 104 x 82 with per-companion scaling.
- Moved the follow anchor slightly farther from the player to reduce overlap.
- Increased the orbit spacing slightly.
- Increased action lunge distance slightly to make action frames easier to notice.
- Removed the normal persistent guide ring.
- Kept ring display available only for debug companion inspection.
- Kept action aura visible only during action emphasis.

## Visibility Evaluation

Expected improvement:

- Companion identity is easier to see during normal play.
- P04c animation sheet states are more readable.
- Larger companions still do not exceed player size.
- compy_pack remains intentionally smaller, while rex_hatchling and tricera_calf read as heavier companions.
- The playfield no longer shows a permanent debug-like ring.

## Remaining Follow-Up

- Confirm on iPhone/PWA real device after this build.
- Check boss fights where warning guides and boss effects are dense.
- If readability is still weak, consider a very subtle outline shader/tint pass rather than further size growth.
- If action timing is still unclear, tune action effect duration rather than base damage or AI.

## P04d Follow-Up

P04c.1 was still too small on real-device visual review, so P04d supersedes the P04c.1 runtime size.

P04d changes:

- sprite sheets regenerated at 384 x 384 cells
- effect sheets regenerated at 320 x 320 cells
- companion display baseline increased to 170 x 134
- follow offset widened to keep the larger companion away from the player body
- orbit spacing widened
- default companion effect scale increased for clearer action feedback
- normal guide ring remains hidden; debug-only guide remains available

P04d keeps the P04c.1 principle of a dedicated companion scale baseline with per-companion variation, but the baseline is now intentionally much larger for mobile readability.
