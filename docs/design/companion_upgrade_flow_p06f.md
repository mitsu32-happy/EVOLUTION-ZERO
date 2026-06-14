# MVP-P06f Companion Upgrade Flow

## Scope

P06f separates companion upgrades into three independent lines and fixes the
selection / confirmation UI. It does not merge to main, add new companions, or
change core companion AI roles.

## Upgrade Lines

Each owned companion now stores per-line upgrade levels:

```js
companion.upgradeLevels[id] = {
  range: 1,
  effect: 1,
  speed: 1,
}
```

The old `companion.levels[id]` field is kept for compatibility and display. It
is normalized to the highest of the three line levels.

## Save Compatibility

- Old saves with only `levels[id]` are migrated by initializing
  `range/effect/speed` to that old level.
- New hatches and debug grants initialize all three lines safely.
- Invalid or missing line levels are clamped to `1..maxLevel`.
- `selectedId: null` is valid and means the player owns companions but takes no
  companion into play.

## Upgrade Flow

Old flow:

1. Upgrade button.
2. Confirmation.
3. Upgrade.

New flow:

1. Upgrade button.
2. Upgrade line selection.
3. Confirmation.
4. Upgrade.

The line selection modal shows:

- Line name.
- Current level to next level.
- DNA cost.
- Short description.

The confirmation dialog is shortened to two lines:

- `{line}: Lv current -> next`
- `消費DNA cost`

## Upgrade Effects

| Line | Runtime effect |
| --- | --- |
| Range | Feeds the P05b companion movement radius and skill/pickup range scaling. |
| Effect | Feeds damage, healing, guard duration, EXP bonus, pull strength, and boss bonus scaling. |
| Speed | Feeds P05c movement speed bonus and action interval scaling. |

The speed and effect gains reuse existing companion growth values; no large
balance increase was added.

## Research UI

- Owned companion rows show `範囲Lv / 効果Lv / 速度Lv`.
- The row button text is always `強化` when any line can still upgrade.
- Minimum next DNA cost is shown in the row details as `DNAxx〜`.
- MAX rows show `MAX` and disable the button.

## Home Selection UI

- Owned cards now show `セット中` for the currently selected companion.
- Other owned cards show `選択`.
- A `セット解除` button saves `selectedId: null`.
- When owned companions exist but none is selected, the home companion panel
  remains visible as `未セット` so the player can re-open selection easily.

## QA Checklist

- `強化` text fits inside the research button.
- Upgrade line selection opens before confirmation.
- Each of the three lines can be upgraded independently.
- Confirmation text fits in the dialog.
- Home selection cards are never blank on the right side.
- `セット解除` persists and PlayScene starts with no companion.
- Old saves with only `levels` continue to normalize correctly.

## MVP-P06f2 Hotfix Notes

- Home companion selection cards now force a readable right-side state label:
  selected cards show `セット中`, and all other owned cards show `選択`.
- The selected-state label uses light text with a dark stroke so it remains
  visible on the P06d selection button asset.
- The research companion upgrade row keeps the runtime `強化` label on the
  P06d upgrade button asset.
- The upgrade line selection modal now reuses P06d production assets for the
  panel, option cards, and action buttons instead of relying on simple
  `Graphics` shapes as the primary appearance.
- Detailed UI notes: `docs/design/companion_upgrade_select_ui_p06f2.md`.
