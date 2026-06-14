# MVP-P06f2 Companion Upgrade Select UI Hotfix

## Scope

P06f2 fixes three release-blocking UI gaps in the Companion Dino management
flow without changing save rules, battle AI, or balance values.

## Home Selection Status

- The right side of every owned companion card is always populated.
- The selected companion shows `セット中`.
- Other owned companions show `選択`.
- When `selectedId` is `null`, all owned companion cards show `選択`.
- The selected label now uses light text with a dark stroke so it remains
  readable on the production selection button asset.

## Research Upgrade Button

- Owned companion rows in the research companion tab continue to draw the
  runtime label `強化` or `MAX` on top of the P06d upgrade button asset.
- The label is kept short and centered to fit phone-width layouts.

## Upgrade Line Selection Modal

The P06f line selection modal no longer relies on simple `Graphics` as the
primary look. It now reuses production P06d assets:

| Surface | Runtime texture |
| --- | --- |
| Modal panel | `public/assets/ui/companions/owned_companion_panel_p06d.png` |
| Option card | `public/assets/ui/companions/upgrade_card_p06d.png` |
| Option action button | `public/assets/ui/companions/upgrade_button_p06d.png` |

Runtime text remains code-rendered so Japanese labels stay sharp and can be
shortened without regenerating images.

The gold focus frame is input-mode aware:

- Mouse / touch opening: no persistent option focus frame.
- Gamepad opening or D-pad movement: focused option frame is shown.
- The gamepad focus ring remains available for controller navigation without
  making the touch UI feel selected by default.

## Option Contents

Each line card displays:

- line name: `移動範囲`, `効果`, or `速度`
- current level to next level
- required DNA or `MAX`
- short description
- action label: `選択` or `MAX`

## QA Notes

- Confirm selected cards visibly show `セット中`.
- Confirm unset state changes all owned card actions to `選択`.
- Confirm multiple owned companions page correctly in home selection.
- Confirm multiple owned companions page correctly in research owned view.
- Confirm research owned rows show the `強化` label.
- Confirm the upgrade line selection modal appears with P06d production
  panel/card/button assets.
- Confirm the upgrade option focus frame is hidden for mouse/touch opening and
  kept for gamepad navigation.
- Confirm no runtime error/warn is introduced.
