# MVP-A11d.1 Ignicera Asset Audit

## Scope

- Confirm whether triceratops ZERO / Ignicera player evolution uses player assets or volcano ZERO boss assets.
- Do not change gameplay balance, PWA, result UI, boss notice UI, or unrelated evolution UI.

## Player Evolution References

- `getEvolutionSheetKey()` now resolves triceratops ZERO to `ASSET_KEYS.evolutionSheets.triceratopsZero`.
- `ASSET_KEYS.evolutionSheets.triceratopsZero` maps to `evolutionSheets.triceratopsZero`.
- `evolutionSheets.triceratopsZero` path:
  - `public/assets/dinos/evolutions/sheets/triceratops_zero_sheet.png`
- `evolutionHeroes.triceratopsZero` path:
  - `public/assets/dinos/evolutions/heroes/triceratops_zero_hero.png`
- `evolutionPortraits.triceratopsZero` path:
  - `public/assets/dinos/evolutions/portraits/triceratops_zero_portrait.png`
- `evolution_data.js` also defines triceratops ZERO with the same player sheet / hero / portrait paths.

## Volcano ZERO Boss References

- `bosses.volcanoZeroSecondBoss` path:
  - `public/assets/enemies/bosses/volcano_zero_second_boss_sheet.png`
- `bosses.volcanoZeroFinalBoss` path:
  - `public/assets/enemies/bosses/volcano_zero_final_boss_sheet.png`
- These boss keys are used by ZERO boss phase config in `PlayScene`, not by player evolution sheet selection.

## Misreference Result

- No player-to-boss asset key misreference was found.
- Ignicera player visual uses the player evolution sheet path, not the volcano ZERO second/final boss sheet path.
- The player Ignicera art and volcano ZERO boss art share a red/purple volcanic ZERO palette, so they can feel visually related, but the assets are separate.

## QA Evidence

- Comparison image:
  - `docs/assets/a11d1_ignicera_asset_compare.png`
- JSON report:
  - `docs/assets/a11d1_report.json`
- In-app browser QA confirmed:
  - player body displays the player-side Ignicera sheet after ZERO evolution.
  - upper-left HUD remains the base triceratops portrait.
  - BRANCH card shows Ignicera portrait/name.
