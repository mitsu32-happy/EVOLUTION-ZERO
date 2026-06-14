# P08 Hotfix Companion Hatch Button

## Scope

- Branch: `hotfix/companion-hatch-button-p08`
- Base version: `0.10.0`
- Base build: `companion-dino-p08`
- Target screen: Research > Companion tab > Egg hatch screen

## Issue

The hatch button could appear missing on the Companion egg hatch screen.

## Cause

The production hatch button asset is a dark sci-fi frame. The UI drew the enabled label with a dark fill (`#071015`) and only drew the fallback button frame when the asset was missing. When the asset was loaded, the dark label and low-contrast button body could visually blend into the hatch panel, especially near the lower panel area.

The button was also placed close to the lower panel edge, making the visibility issue easier to notice on compact/mobile layouts.

## Fix

Implemented in `src/ui/research_screen.js`:

- Moved the hatch button from `y=650` to `y=642`.
- Moved hatch cost text slightly upward.
- Updated gamepad/focus bounds to match the new hatch button position.
- Always draws a lightweight button highlight/stroke over the hatch button area, even when the production asset is loaded.
- Uses light label colors on the dark production asset.
- Keeps disabled states visible:
  - Egg ready: `受け取る`
  - Egg pending with enough cost: `孵化させる`
  - Egg incubating: `孵化中`
  - No egg: `卵なし`

## QA Plan

- Research Companion tab opens.
- Egg hatch mode shows hatch device and button.
- Egg available with enough DNA/researchPt shows a visible enabled hatch button.
- Egg unavailable shows a visible disabled state or clear empty-state text.
- Console warn/error: 0.
- Build succeeds.

## Local QA Results

2026-06-14 local browser checks on `http://127.0.0.1:5176/EVOLUTION-ZERO/`:

- Egg pending, DNA 9999, researchPt 9999:
  - Research > Companion > Egg hatch screen opened.
  - Hatch device visible.
  - `孵化させる` button visible and readable.
  - Console warn/error: 0.
- Egg pending, DNA 0, researchPt 0:
  - Hatch screen opened after tutorial completion.
  - Disabled `孵化させる` button visible and readable.
  - Console warn/error: 0.
- No egg / clean save:
  - Research screen did not crash.
  - Console warn/error: 0.
- Companion PlayScene startup:
  - `rex_hatchling` debug route started.
  - Crash/fallback: no.
  - Runtime summary: `t=7.55 enemy=0 pickup=0 children=16 compFx=0 compScan=0/0 shed=0 stress=0 ctx=0 err=0`.
  - Console warn/error: 0.

## Main Reflection

This hotfix is approved for main merge/push after build and browser QA pass.
