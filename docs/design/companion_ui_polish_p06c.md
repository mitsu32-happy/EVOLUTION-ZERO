# MVP-P06c Companion UI Polish

## Scope

P06c polishes the Companion Dino home, selection, and research UI introduced in
P06b. It does not change companion combat AI, save ownership rules, damage,
healing, EXP, or PlayScene stability work.

## Regenerated UI Assets

P06c replaces the P06b bitmap frames with more detailed dark-SF research
terminal assets. Text remains rendered by the UI layer.

- `public/assets/ui/companions/home_companion_frame_p06c.png`
- `public/assets/ui/companions/companion_select_panel_p06c.png`
- `public/assets/ui/companions/companion_select_card_p06c.png`
- `public/assets/ui/companions/companion_select_button_p06c.png`
- `public/assets/ui/companions/companion_owned_panel_p06c.png`
- `public/assets/ui/companions/companion_upgrade_card_p06c.png`
- `public/assets/ui/companions/companion_upgrade_button_p06c.png`
- `public/assets/ui/companions/companion_hatch_device_p06c.png`
- `public/assets/ui/companions/companion_hatch_button_p06c.png`
- `public/assets/ui/research/icons/icon_companion_research_p06c.png`
- `public/assets/ui/research/icons/icon_companion_unknown_p06c.png`

Design notes:

- black / blue-green / cyan base palette
- gold accent only on primary action or selected state
- frame interiors keep text-safe dark areas
- icon art avoids baked text
- hatch device reads as a bio-capsule / DNA incubator

## Home UI

- The companion panel remains under the top-left logo.
- It remains hidden until at least one companion is owned.
- The regenerated frame adds icon well, scan lines, and a compact text region.
- No changes were made to home dinosaur placement.

## Companion Selection UI

- Owned-only display is preserved.
- Upgrade controls remain removed from the home selection modal.
- Selection cards and button frame use P06c assets.
- Short role text remains one line where possible to avoid phone-width crowding.

## Research Companion Tab

The companion research tab keeps the P06b two-view layout:

- `所持お供`
- `卵孵化`

P06c changes:

- P06c tab icons replace the P06b simple icons.
- The unknown state uses a more intentional locked research-domain icon.
- The owned panel, hatch device, hatch button, upgrade card, and upgrade button
  use regenerated assets.
- Hatch button placement was lifted within the panel to avoid bottom-edge
  crowding on phone-height layouts.

## Controller / Virtual Mouse

P06c adds minimum gamepad focus routing for the companion research subview:

- left / right toggles `所持お供` and `卵孵化`
- up / down moves through available actions
- confirm activates hatch, upgrade, mode switch, or page switch
- previous / next still changes research categories
- cancel keeps the existing research-screen back behavior

This is not a full C02-style focus grid, but it prevents the new UI from
becoming an operation dead end.

## Smartphone Text Check

Text was kept short in the critical surfaces:

- unknown-state explanation: two short lines
- hatch state: status plus cost / duration
- owned companion rows: current level, short effect summary, three growth labels
- buttons: `孵化させる`, `受け取る`, `強化`, `MAX`

Remaining risk: companion names and effect summaries depend on the companion data
strings. If later localization strings grow, the owned-row text should be
rechecked on iPhone-width screens.

## Remaining Work

- Full controller focus styling inside the new companion research panel.
- Final physical phone QA after localization cleanup.
- If movement/effect/speed become independent upgrade tracks, add a real save
  migration and replace the current level-derived display labels.

## P06d Production Asset Follow-up

P06d supersedes the P06c bitmap frames for active runtime use. The P06c layout,
owned-only display rules, and controller focus routing remain the baseline, but
the simple generated PNGs are replaced by production illustrated dark-SF
research-terminal assets.

See `docs/design/companion_ui_asset_generation_p06d.md`.
