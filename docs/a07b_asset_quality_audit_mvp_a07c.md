# MVP-A07c A07b Asset Quality Audit

## Scope

A07c reviews the UI assets introduced during A07b and replaces assets that still read as simple runtime graphics or simple PNG frames.

## Classification

| Asset | Classification | Reason | A07c action |
| --- | --- | --- | --- |
| `public/assets/ui/home/news_entry_button_a07b.png` | Simple asset | Mostly geometric frame, limited illustration density. | Regenerate as `news_button_a07c.png`. |
| `public/assets/ui/home/news_panel_a07b.png` | Simple asset | Flat panel feel, not enough EVOLUTION ZERO facility detail. | Regenerate as `news_panel_list_a07c.png`. |
| `public/assets/ui/home/news_detail_panel_a07b.png` | Simple asset | Detail area reads as framed rectangle. | Regenerate as `news_panel_detail_a07c.png`. |
| `public/assets/ui/home/news_list_card_a07b.png` | Simple asset | Repeated plain item card. | Regenerate list item variants. |
| `public/assets/ui/hud/boss_warning_panel_a07b.png` | Simple asset | Warning frame lacks illustrated alert hardware. | Regenerate as boss notice assets. |
| `public/assets/ui/hud/boss_appear_alert_chip_a07b.png` | Simple asset | Simple chip. | Regenerate as alert chip. |
| `public/assets/ui/hud/zero_phase_notice_panel_a07b.png` | Simple asset | Purple panel lacks ZERO glitch/core detail. | Regenerate as ZERO notice panel. |
| `public/assets/ui/hud/zero_final_notice_panel_a07b.png` | Simple asset | Needs stronger final protocol art density. | Regenerate as final protocol panel. |
| `public/assets/ui/selection/evolution_candidate_card_a07b.png` | Simple asset | Card frame is functional but not a full evolution UI card. | Regenerate evolution card set. |
| `public/assets/ui/selection/fallback_reward_card_a07b.png` | Simple asset | Generic fallback card; needs reward-specific variants. | Regenerate DNA/heal/score variants. |

## Summary

All A07b-added UI PNGs are treated as regeneration-required for A07c. Graphics fallbacks remain allowed only as emergency missing-texture paths, not as the normal route.

## A07c Replacement Result

- Generated source sheet: `docs/assets/a07c_ui_asset_source_sheet.png`
- Contact sheet: `docs/assets/a07c_ui_assets_contact.png`
- Report JSON: `docs/assets/a07c_ui_assets_report.json`
- Adopted replacement assets: 18 PNGs under `public/assets/ui/home/`, `public/assets/ui/hud/`, and `public/assets/ui/selection/`.
- A07b PNGs remain on disk for traceability, but runtime manifest paths now prefer A07c assets.
## MVP-A07d News UI Follow-up

A07c successfully replaced simple placeholders with generated bitmap UI, but the news area was still visually dense. MVP-A07d narrows the news route to a smaller reusable set:

- Shared outer modal panel: `news_panel_outer_a07d.png`
- Simplified list card: `news_list_item_a07d.png`
- Clearer Home entry button: `news_button_a07d.png`
- Icon-first close/back controls: `news_button_close_a07d.png`, `news_button_back_a07d.png`
- Compact update badge: `news_badge_update_a07d.png`

The A07c news assets are retained for reference and are removed from the normal manifest route.
