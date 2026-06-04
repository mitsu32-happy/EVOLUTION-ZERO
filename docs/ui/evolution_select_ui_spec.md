# Evolution Candidate UI Spec

## MVP-A07b Candidate Card Polish

- The branch evolution candidate screen uses dedicated generated card art: `public/assets/ui/selection/evolution_candidate_card_a07b.png`.
- Card text is rendered in code so evolution name, type, and short description can be changed without regenerating the asset.
- Each card should show the candidate portrait or hero art when available.
- Fallback marker graphics are allowed only when the image asset has not loaded.
- The screen copy should stay simple:
  - `分岐進化`
  - `進化先を選択`
  - `カードをタップして進化`
- The same structure must be able to host future ZERO evolution candidates without changing the screen layout.

## MVP-A07c Generated Evolution Candidate Assets

- Evolution candidates now prefer `evolution_card_panel_a07c.png` generated from the A07c illustrated UI kit.
- `evolution_card_selected_a07c.png` is available for special/selected candidate presentation such as future ZERO candidates.
- Portraits and text remain runtime-rendered inside the generated frame safe area.

## MVP-A10 Candidate Card Asset Replacement

- Branch evolution candidates now prefer the generated A10 set:
  - `public/assets/ui/selection/evolution_card_panel_a10.png`
  - `public/assets/ui/selection/evolution_card_selected_a10.png`
  - `public/assets/ui/selection/evolution_card_portrait_frame_a10.png`
  - `public/assets/ui/selection/evolution_card_type_chip_a10.png`
  - `public/assets/ui/selection/evolution_card_button_select_a10.png`
- Candidate portraits remain required and are rendered inside the A10 portrait frame.
- Card text remains runtime-rendered: evolution name, type label, and one short feature line.
- A07c card assets are kept as historical assets but are no longer the preferred candidate route.

## MVP-A10b Evolution Select Background

- The branch evolution selection modal now prefers generated A10b background assets:
  - `public/assets/ui/selection/evolution_select_background_a10b.png`
  - `public/assets/ui/selection/evolution_select_overlay_a10b.png`
- The background is a quiet DNA-analysis panel so candidate cards remain the visual focus.
- The Graphics panel remains fallback only when the A10b background fails to load.

## MVP-A10c Evolution Candidate Card Polish

- A10 card assets remain the preferred card frames, but card layout is cleaned up for readability.
- Candidate portrait/hero art is larger and kept inside the generated portrait frame.
- Evolution name, type/mutation label, and short feature text are compacted to avoid overflow on narrow mobile widths.
- Card spacing is slightly increased so 1-3 candidates and ZERO candidates remain readable.
## MVP-A10d Evolution Candidate Portrait Fix

- Evolution candidate objects now pass branch `heroPath` and `portraitPath` into the selection UI.
- Candidate cards prefer `portraitPath` first, then `heroPath`, then any candidate image fallback.
- This makes branch portraits/icons visible in the card instead of relying on text-only cards or fallback markers.
## MVP-A10d.1 Candidate Portrait Display

- Evolution candidate cards keep the A10 frame assets but render the candidate portrait above the portrait frame interior so the image is visible in the actual card.
- Candidate image loading still prefers `portraitPath`, then `heroPath`, then any fallback candidate image.
- `debugEvolutionReady=<tag>` is available as a QA-only route to open the candidate screen without auto-selecting a branch.
