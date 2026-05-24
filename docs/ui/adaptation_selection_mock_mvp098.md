# MVP-098 DNA Adaptation Selection Mock

## Status

This MVP is a mock-only checkpoint. Do not implement the runtime UI until the mock is approved.

## Current Adaptation Tags

Runtime data in `src/data/skills.js` currently uses 3 active adaptation tags:

- `speed`
- `hunting`
- `attack`

Future/planned visual tags already have HUD icon coverage, but are not active adaptation tags yet:

- `defense`
- `toxic`
- `crystal`

## Mock Images

- `docs/mockups/mvp098/adaptation_selection_mock_v1_image2_base.png`
  - Text-free Image2.0 base mock.
- `docs/mockups/mvp098/adaptation_selection_mock_v3_current_tags.png`
  - Current recommended review mock for the 3 active tags.
- `docs/mockups/mvp098/adaptation_selection_mock_v4_final.png`
  - Final approved mock direction. Card frames contain no baked icons; adaptation icons are separate overlays.

## Current Tag Card Panel Assets

Mock card panel assets are prepared for the current 3 active tags:

- `docs/mockups/mvp098/card_assets/adaptation_card_speed_panel.png`
- `docs/mockups/mvp098/card_assets/adaptation_card_hunting_panel.png`
- `docs/mockups/mvp098/card_assets/adaptation_card_attack_panel.png`
- `docs/mockups/mvp098/card_assets/adaptation_card_panel_sheet_current_tags_final_raw.png`

Final approved runtime assets are:

- `public/assets/ui/selection/adaptation_card_speed_panel.png`
- `public/assets/ui/selection/adaptation_card_hunting_panel.png`
- `public/assets/ui/selection/adaptation_card_attack_panel.png`

## Tag Panel Direction

- `speed`: cyan, high-speed mutation, sharp motion/DNA accents.
- `hunting`: amber, predator tracking, reticle/research feel.
- `attack`: red-orange, volatile attack adaptation, warning edge accents.

If `defense`, `toxic`, or `crystal` become active adaptation tags later, create matching card panels before connecting them to runtime data.

## Icon Direction

Use existing/generated HUD adaptation icons as the icon source:

- `public/assets/ui/hud/adapt_icons/adapt_slot_speed.png`
- `public/assets/ui/hud/adapt_icons/adapt_slot_hunting.png`
- `public/assets/ui/hud/adapt_icons/adapt_slot_attack.png`
- `public/assets/ui/hud/adapt_icons/adapt_slot_defense.png`
- `public/assets/ui/hud/adapt_icons/adapt_slot_toxic.png`
- `public/assets/ui/hud/adapt_icons/adapt_slot_crystal.png`

Cards must keep icons separate from the panel frame so text and icon placement can be adjusted safely in code. Do not bake tag icons, circles, DNA symbols, labels, or status chips into the card frame assets.

## Runtime Implementation Notes

- Keep a 3-choice layout for the current runtime.
- Place text only inside the dark inner safe area; avoid outer frame overlap.
- Use code-rendered text for all labels, names, effect summaries, costs, and state chips.
- Use state chips such as `NEW`, `UPGRADE`, `LOCKED`, `UNKNOWN`, and `SELECTED`.
- Do not use `Lv` or permanent dinosaur level wording.
- Locked/unknown cards may be shown, but selection must be disabled.
- Reroll should be a small secondary action.
- Confirm/selection should be visually clear but not larger than the card choices.

## MVP-099 Surrounding UI

MVP-099 keeps the approved MVP-098 tag card frames unchanged and upgrades only the surrounding selection UI.

Generated review/source assets are stored in:

- `docs/mockups/mvp099/selection_surrounding_ui_sheet_raw.png`

Runtime surrounding UI assets:

- `public/assets/ui/selection/selection_background_panel.png`
- `public/assets/ui/selection/selection_header_panel.png`
- `public/assets/ui/selection/selection_footer_panel.png`
- `public/assets/ui/selection/reroll_button_idle.png`
- `public/assets/ui/selection/reroll_button_disabled.png`
- `public/assets/ui/selection/reroll_button_pressed.png`
- `public/assets/ui/selection/badge_new.png`
- `public/assets/ui/selection/badge_upgrade.png`
- `public/assets/ui/selection/badge_owned.png`
- `public/assets/ui/selection/badge_locked.png`

MVP-100 v2 runtime assets:

- `public/assets/ui/selection/selection_background_panel_v2.png`
- `public/assets/ui/selection/selection_header_panel_v2.png`
- `public/assets/ui/selection/selection_subtitle_panel_v2.png`
- `public/assets/ui/selection/selection_footer_panel_v2.png`
- `public/assets/ui/selection/selection_overlay_gradient_v2.png`
- `public/assets/ui/selection/badge_new_v2.png`
- `public/assets/ui/selection/badge_upgrade_v2.png`
- `public/assets/ui/selection/badge_owned_v2.png`
- `public/assets/ui/selection/badge_locked_v2.png`
- `public/assets/ui/selection/analysis_warning_chip.png`
- `public/assets/ui/selection/dna_analysis_header_icon.png`

MVP-100 source sheet:

- `docs/mockups/mvp100/selection_asset_sheet_v2_raw.png`

Rules:

- Card frames must remain icon-free; adaptation icons are separate runtime overlays.
- Badge assets are also text-free. `新規解析`, `強化 n→m`, and `取得済み` are rendered in code.
- Reroll text and remaining count are rendered in code over the button frame.
- The background panel and header/footer provide atmosphere only; they must not constrain text into small baked compartments.
- Fallback Graphics drawing remains required if any generated UI asset fails to load.
- MVP-100 v2 assets are preferred at runtime. The previous MVP-099 assets remain as secondary fallback before Graphics fallback.

## MVP-101 Header Composition

MVP-101 keeps the generated v2 assets and strengthens their runtime placement instead of regenerating the approved card frames.

Runtime layout rules:

- `selection_background_panel_v2.png` is expanded close to full screen width and acts as the main selection terminal frame.
- `selection_header_panel_v2.png` is the primary top header surface, not a faint decoration.
- `dna_analysis_header_icon.png` is placed inside the left side of the header as the main analysis emblem.
- `DNA適応候補` is placed inside the header safe area, to the right of the DNA analysis emblem.
- `適応反応 n→m` is shortened to `反応 n→m` and rendered as a compact status chip inside the header.
- `selection_subtitle_panel_v2.png` carries the sub heading `解析候補を選択`.
- `analysis_warning_chip.png` carries a short analysis state such as `安定解析中`, `反応探索中`, `分岐反応あり`, or `強反応検出`.
- Long hint text is not shown in the header area because it makes the upper block look like plain stacked text.

The approved adaptation cards and reroll button remain unchanged. Only spacing around the v2 header/subtitle/background frame is adjusted.

## MVP-101 Simplification Pass

After review, the v2 surrounding UI was judged too busy because multiple frames were layered at once. The simplified pass keeps the approved adaptation cards, the reroll button, and `analysis_warning_chip.png`, then replaces the rest of the surrounding frame structure with quieter v3 assets.

Generated source files:

- `docs/mockups/mvp101/selection_simple_asset_sheet_v3_raw.png`
- `docs/mockups/mvp101/selection_background_portrait_v3_raw.png`

Runtime assets:

- `public/assets/ui/selection/selection_background_panel_v3.png`
- `public/assets/ui/selection/selection_header_panel_v3.png`
- `public/assets/ui/selection/selection_subtitle_strip_v3.png`

Runtime composition:

- Use only one main backdrop panel and one header strip.
- Do not show `selection_footer_panel_v2.png`; the reroll button already has its own frame and must not be double-framed.
- Do not show the DNA header icon in this layout; it made the top area visually noisy.
- Do not show the response chip background separately; `反応 n→m` is rendered as small text inside the header.
- Keep `analysis_warning_chip.png` as the only status chip under the header.
- Keep adaptation card assets unchanged.

Micro-adjustments after review:

- The portrait backdrop is cropped tighter to its alpha bounds and rendered at nearly full screen width.
- Runtime content must stay inside the backdrop safe area; current card/action placement keeps at least about 24px from the left/right visual frame.
- Header text is moved upward and centered inside the header panel's usable area so it does not sit on the lower frame edge.
- Reroll uses green variants:
  - `public/assets/ui/selection/reroll_button_green_idle.png`
  - `public/assets/ui/selection/reroll_button_green_disabled.png`
  - `public/assets/ui/selection/reroll_button_green_pressed.png`
