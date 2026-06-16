# Companion Synergy UI CS04 / CS05c

## Scope

Companion Synergy is shown in pre-sortie UI surfaces so the player can understand useful pairings before choosing a run setup.

This UI layer does not change synergy effects, save data, assets, or balance values.

## Display Targets

### Home Companion Panel

The compact home panel does not show `発動中`.

Reason:

- The home dino is not necessarily the final dino chosen for sortie.
- Showing an active label here can mislead the player.

The home panel keeps basic information only:

- Companion name.
- Level.
- Change affordance.

### Companion Selection Modal

Owned companion cards show:

- Enabled synergy line: `共存シナジー: {publicPlayerDinoName}`
- Enabled synergy detail: `効果: {shortLabel} / {発動中|未発動}`
- Disabled future synergy: `相性: 未発見の恐竜`

Disabled future synergies do not show:

- Synergy name.
- Effect description.
- Future-update notice.
- Unreleased dino name.

The selected companion detail area follows the same rule.

### Research Companion Owned Panel

Owned companion rows use a compact line:

- Enabled synergy: `共存:{publicPlayerDinoName} 効果:{shortLabel} / {発動中|未発動}`
- Disabled future synergy: `相性:未発見の恐竜`

This is intentionally short so the row remains readable on mobile width.

## Status Rules

| Case | Display |
| --- | --- |
| Enabled synergy and current dino matches | `発動中` |
| Enabled synergy but current dino does not match | `未発動` |
| Disabled future synergy | `相性: 未発見の恐竜` only |
| No synergy data | Omitted or `共存シナジー: なし` depending on surface |

## Future Dino Names

Disabled future synergies use `publicPlayerDinoName`, which is `未発見の恐竜` for normal UI. The internal future dino IDs and names remain documented in `companion_synergy_design_v1.md`, but normal UI does not expose those names.

CS04b tightened this further: normal UI hides future-update wording such as `将来解放予定` and `将来のアップデートで解放予定`.

## Text Policy

- Numeric effect values are not shown.
- UI uses short labels like `ボス特化`, `連撃`, `水弾支援`, and `防御補助`.
- Disabled future synergies are intentionally minimal to avoid over-explaining unreleased content.
- Cards use compact lines to avoid overflowing on mobile.

## Verification Notes

- UI lookups happen during render only; no per-frame synergy search is added.
- Save structure is unchanged.
- No new assets are generated.

## Remaining Work

- Main-release QA should confirm card text with all 10 companions on mobile width.
- If mobile text still feels tight, consider a dedicated synergy chip in the companion card art/layout.
