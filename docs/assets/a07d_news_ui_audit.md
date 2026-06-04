# MVP-A07d News UI Audit

Date: 2026-05-31

## Scope

- Home news entry button
- News list modal
- News detail modal
- Close / back controls
- News list cards and badge chips

## Current A07c Issues

- The news entry button is visually close to the dark home background and does not read as a tappable control quickly enough.
- The list modal uses a highly decorated panel with multiple internal frame-like areas. It makes the empty space look busy even when only a few news items exist.
- The detail modal has a large readable text area, but the DNA side decoration and layered frame density still compete with the body text.
- Close and back controls combine generated button frames with code-rendered labels, which can feel crowded on narrow mobile screens.
- A07c uses separate list/detail panel assets even though both screens can share one simpler outer frame.

## A07d Direction

- Use one shared outer news modal panel for list and detail.
- Keep the modal interior mostly matte dark blue for text readability.
- Remove unused inner frames and decorative empty cards from the normal route.
- Use a single simple list card for important and normal news; show importance with a small badge and text color.
- Use icon-first close/back controls and only show fallback text if the image asset is missing.
- Keep all text code-rendered for localization and future update entries.

## Adopted Assets

- `public/assets/ui/home/news_button_a07d.png`
- `public/assets/ui/home/news_panel_outer_a07d.png`
- `public/assets/ui/home/news_list_item_a07d.png`
- `public/assets/ui/home/news_button_close_a07d.png`
- `public/assets/ui/home/news_button_back_a07d.png`
- `public/assets/ui/home/news_badge_update_a07d.png`

## A07c Assets Removed From Normal Route

- `news_button_a07c.png`
- `news_panel_list_a07c.png`
- `news_panel_detail_a07c.png`
- `news_list_item_a07c.png`
- `news_list_item_unread_a07c.png`
- `news_button_close_a07c.png`
- `news_button_back_a07c.png`
- `news_badge_update_a07c.png`
- `news_badge_normal_a07c.png`

The A07c files are kept on disk for traceability and are no longer referenced by the normal news UI route.
