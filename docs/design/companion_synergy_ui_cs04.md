# Companion Synergy UI CS04

## Scope

CS04 makes Companion Synergy visible in existing UI surfaces. It does not change synergy effects, save data, assets, or balance values.

## Display Targets

### Home Companion Panel

When the currently set companion has an active synergy with the currently selected home player dino, the compact home panel shows:

- `{shortLabel} 発動中`

If no active synergy exists, no extra text is shown in the compact home panel to avoid clutter.

### Companion Selection Modal

Owned companion cards now show:

- `相性: {publicPlayerDinoName} / {synergyName}`
- `{shortLabel or future notice} / {発動中|未発動|将来解放予定}`

The selected companion detail area also shows the current pair's synergy state.

### Research Companion Owned Panel

Owned companion rows now show a compact synergy line:

- `相性:{publicPlayerDinoName} {synergyName} / {status}`

This is intentionally short so the row remains readable on mobile width.

## Status Rules

| Case | Display |
| --- | --- |
| Enabled synergy and current dino matches | `発動中` |
| Enabled synergy but current dino does not match | `未発動` |
| Disabled future synergy | `将来解放予定` |
| No synergy data | `共存シナジーなし` or omitted in compact surfaces |

## Future Dino Names

Disabled future synergies use `publicPlayerDinoName`, which is `未発見の恐竜` for normal UI. The internal future dino IDs and names remain documented in `companion_synergy_design_v1.md`, but normal UI does not expose those names.

## Text Policy

- Numeric effect values are not shown in CS04.
- UI uses short labels like `ボス特化`, `連撃`, and `防御補助`.
- Cards use two compact lines to avoid overflowing on mobile.

## Verification Notes

- UI lookups happen during render only; no per-frame synergy search was added.
- Save structure is unchanged.
- No new assets were generated.

## Remaining Work

- CS05 should perform visual QA with all 10 companions and the first four active pairings.
- If mobile text still feels tight, consider a dedicated synergy chip in the companion card art/layout.
