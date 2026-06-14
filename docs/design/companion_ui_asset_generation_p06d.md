# MVP-P06d Companion UI Asset Generation

## Scope

P06d replaces the P06c companion management UI frames with production-facing
illustrated bitmap assets. It does not change companion save data, ownership
rules, gameplay AI, damage, healing, pickup behavior, or balance values.

## Generation Direction

- Dark sci-fi biological research facility UI.
- Gunmetal frames with cyan / teal emission and restrained gold accents.
- Bio-capsule, DNA analyzer, egg incubation, and research terminal motifs.
- Runtime text remains separate. No Japanese or English text is baked into the
  generated PNGs.
- Text-safe interiors are kept dark and low-noise.
- Decorative details are pushed to borders and icon areas.

## Generated Assets

| Asset | Path | Runtime use |
| --- | --- | --- |
| Home companion frame | `public/assets/ui/companions/home_companion_frame_p06d.png` | Home companion entry under the logo |
| Companion selection panel | `public/assets/ui/companions/companion_select_panel_p06d.png` | Home companion select modal |
| Companion selection card | `public/assets/ui/companions/companion_select_card_p06d.png` | Owned companion row in select modal |
| Companion selection button | `public/assets/ui/companions/companion_select_button_p06d.png` | Select / set action |
| Companion research tab icon | `public/assets/ui/research/icons/icon_companion_tab_p06d.png` | Research `お供` tab |
| Unknown companion tab icon | `public/assets/ui/research/icons/icon_companion_unknown_p06d.png` | Research `???` tab |
| Egg incubator | `public/assets/ui/companions/egg_incubator_p06d.png` | Hatch subview device |
| Hatch button | `public/assets/ui/companions/hatch_button_p06d.png` | Hatch / claim action button |
| Owned companion panel | `public/assets/ui/companions/owned_companion_panel_p06d.png` | Research owned-companion page frame |
| Upgrade card | `public/assets/ui/companions/upgrade_card_p06d.png` | Companion upgrade row |
| Upgrade button | `public/assets/ui/companions/upgrade_button_p06d.png` | Companion upgrade action |
| Contact sheet | `docs/assets/p06d_companion_ui_asset_contact.png` | QA/reference only |

## Improvements from P06c

- P06c simple terminal frames were replaced by illustrated metal/glass assets.
- The hatch device now reads as a bio-capsule with a glowing egg and mechanical
  structure rather than a flat icon panel.
- Companion tab icons use pictorial DNA / egg / footprint and locked egg motifs.
- Buttons keep runtime text clear while adding beveled metal and cyan lighting.
- All active runtime assets preserve P06c dimensions to avoid layout churn.

## Connections

- `src/data/asset_manifest.js` now points companion UI and companion research
  icons to P06d assets.
- `src/ui/home_screen.js` loads the P06d home / selection assets.
- `src/ui/research_screen.js` loads the P06d owned panel, hatch device, hatch
  button, upgrade card, upgrade button, and research tab icons.

## Screen Checks

- Home companion frame: owned companion state, no main dinosaur overlap.
- Companion selection modal: owned-only list remains readable.
- Research `???` tab: unknown icon and unanalysed panel remain visible.
- Research `お供` tab: owned / hatch subview toggle remains unchanged.
- Hatch screen: incubator fits the existing central slot.
- Upgrade cards: runtime labels remain on top of dark text-safe areas.

## Remaining Work

- Physical phone QA should still verify small text on lower-end screens.
- The P06d selection panel is more illustrated than P06c and should be checked
  again if the modal gains more dense rows.
- If hover / active button states become required, generate dedicated state
  variants instead of tinting one bitmap.
