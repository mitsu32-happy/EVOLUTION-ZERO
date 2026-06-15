# Companion Synergy UI CS04

## Scope

CS04 makes Companion Synergy visible in existing UI surfaces. It does not change synergy effects, save data, assets, or balance values.

## Display Targets

### Home Companion Panel

When the currently set companion has an active synergy with the currently selected home player dino, the compact home panel shows:

- `{shortLabel} 発動中`

If no active synergy exists, no extra text is shown in the compact home panel to avoid clutter.

### Companion Selection Modal

Owned companion cards show:

- Enabled synergy: `相性: {publicPlayerDinoName} / {synergyName}`
- Enabled synergy detail: `{shortLabel} / {発動中|未発動}`
- Disabled future synergy: `相性: 未発見の恐竜`

Disabled future synergies do not show a synergy name, effect description, or future-update notice in normal UI.

The selected companion detail area follows the same rule.

### Research Companion Owned Panel

Owned companion rows show a compact synergy line:

- Enabled synergy: `相性:{publicPlayerDinoName} {synergyName} / {発動中|未発動}`
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

CS04b tightened this further: normal UI also hides future-update wording such as `将来解放予定` and `将来のアップデートで解放予定`.

## Text Policy

- Numeric effect values are not shown in CS04.
- UI uses short labels like `ボス特化`, `連撃`, `水弾支援`, and `防御補助`.
- Disabled future synergies are intentionally minimal to avoid over-explaining unreleased content.
- Cards use compact lines to avoid overflowing on mobile.

## Verification Notes

- UI lookups happen during render only; no per-frame synergy search was added.
- Save structure is unchanged.
- No new assets were generated.

## Remaining Work

- CS05 should perform visual QA with all 10 companions and the first four active pairings.
- If mobile text still feels tight, consider a dedicated synergy chip in the companion card art/layout.
