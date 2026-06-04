# MVP-A11d.2 Ignicera Asset Content Audit

## Finding

A11d.1 confirmed that runtime references were not pointing at volcano ZERO boss assets. However, visual comparison showed that the old player `triceratops_zero_sheet.png` did not read as the same character as the Ignicera hero / portrait.

## Old Asset Issue

- Hero / portrait: frontal heavy triceratops ZERO form with a broad frill, three horns, lava cracks, and a purple ZERO core.
- Old sheet: side-view volcanic quadruped with a thinner silhouette and a more boss-like / different-character impression during gameplay.
- Boss sheet: separate file path, but shares a red-purple volcanic palette that made the old player sheet feel visually confusing.

## Action

- Replaced only:
  - `public/assets/dinos/evolutions/sheets/triceratops_zero_sheet.png`
- Kept:
  - `public/assets/dinos/evolutions/heroes/triceratops_zero_hero.png`
  - `public/assets/dinos/evolutions/portraits/triceratops_zero_portrait.png`

## New Sheet Criteria

- Player-scale Ignicera, not a boss.
- Right-facing 4x4 sheet.
- Broad triceratops frill, three horns, obsidian armor, orange lava cracks, and purple ZERO core.
- Transparent background after chroma-key removal.
- Each 256x256 cell is refit to a safe box; frame edge issues are 0 after cleanup.

## Evidence

- Content comparison before replacement:
  - `docs/assets/a11d2_ignicera_asset_content_compare.png`
- Adopted sheet contact:
  - `docs/assets/a11d2_ignicera_contact.png`
- Report:
  - `docs/assets/a11d2_ignicera_report.json`
- Backup:
  - `docs/assets/backup/a11d2_ignicera/triceratops_zero_sheet_before_a11d2.png`
