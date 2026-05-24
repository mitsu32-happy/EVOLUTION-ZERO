# MVP-142 Chromakey Cleanup Summary

Backup: `docs/assets/backup/mvp142_chromakey_cleanup`

## Edited Assets

| Asset | Changed pixels | Before near-magenta | After near-magenta | Before low alpha | After low alpha |
| --- | ---: | ---: | ---: | ---: | ---: |
| `public/assets/enemies/bosses/ruins_boss_sheet.png` | 38455 | 2876 | 8 | 33957 | 419 |
| `public/assets/enemies/bosses/ruins_boss.png` | 2366 | 217 | 0 | 2103 | 27 |
| `public/assets/enemies/bosses/ruins_boss_portrait.png` | 2376 | 217 | 2 | 2051 | 19 |
| `public/assets/enemies/ruins/ruins_electro_sheet.png` | 32660 | 1344 | 1 | 29837 | 489 |
| `public/assets/enemies/ruins/ruins_shooter_sheet.png` | 22426 | 1505 | 7 | 20022 | 212 |
| `public/assets/enemies/ruins/ruins_summoner_sheet.png` | 33638 | 1946 | 8 | 29697 | 391 |
| `public/assets/enemies/bosses/swamp_boss_sheet.png` | 16081 | 856 | 40 | 14610 | 373 |
| `public/assets/enemies/bosses/swamp_boss.png` | 4738 | 350 | 16 | 4307 | 194 |
| `public/assets/enemies/bosses/swamp_boss_portrait.png` | 4360 | 337 | 11 | 3913 | 133 |
| `public/assets/enemies/swamp/swamp_poison_sheet.png` | 6475 | 1148 | 28 | 4654 | 241 |
| `public/assets/enemies/swamp/swamp_slow_sheet.png` | 8310 | 1979 | 66 | 5350 | 255 |
| `public/assets/enemies/swamp/swamp_toxic_bomber_sheet.png` | 7580 | 598 | 34 | 6518 | 453 |

## Not Edited

- UI frames and selection panels were excluded because the scan mostly detected intentional neon borders, visible frame edges, or asymmetric transparent padding.
- Purple ruins/swamp effect sheets were excluded from destructive chromakey cleanup because magenta-like pixels are part of the intended electromagnetic/poison glow.
- Skill and HUD icons with cyan fringe were excluded because the fringe is intentional lighting at UI scale.

## Contact Sheets

- `docs/assets/chromakey_cleanup_selected_before_mvp142_contact.png`
- `docs/assets/chromakey_cleanup_after_mvp142_contact.png`
- `docs/assets/chromakey_cleanup_before_mvp142_contact.png`