# ND10pre Home UI Banner and Background

## Scope

This pass adjusts the home screen after the research point cleanup and new-dino release preparation. It does not merge or push to main, does not update Version, and does not update update news.

## Home Resource Area

- Removed the top-right DNA resource display from the home screen.
- Moved the news entry button to the top-right header area.
- Kept the existing news modal flow intact.

## Three-Zone Home Background

The home background is now split into three generated, visually connected areas:

1. Top header area: logo and news button.
2. Hero/sortie area: dinosaur hero display and sortie button.
3. Bottom area: new-dino banner and bottom navigation.

Generated assets:

- `public/assets/ui/home/home_background_top_nd10pre.png`
- `public/assets/ui/home/home_background_hero_nd10pre.png`
- `public/assets/ui/home/home_background_bottom_nd10pre.png`

The previous `home_background.png` hero-area asset is retained as a project asset, but the visible home layout now uses the segmented generated backgrounds.

## New Six Dino Banner

- Added `public/assets/ui/home/banner_new_dinos_six_nd10pre.png`.
- The banner is generated with baked Japanese text:
  - `新規キャラ6体追加！`
  - `研究で解放しよう`
- The banner includes the six new playable dinosaurs and uses the dark SF research-facility style.
- The banner is clickable and opens the research screen with the unknown-domain tab selected.

## Research Unknown Tab Cost Text

Unknown-domain dino unlock cards already show the DNA cost on the right side with the DNA icon and value, so inline DNA amount text on the left side was removed. The left helper text now stays descriptive.

## Tutorial Bounds

Home tutorial target bounds were updated for the new layout:

- `home.deploy`: sortie button area.
- `home.news`: top-right news button.
- `home.banner`: new-dino banner area for future use.

The sortie tutorial highlight was verified by screenshot after the layout change.

## Loading Text Check

- Fixed mojibake in the loading menu title, detail, and tip strings.
- Replaced corrupted question-mark / mojibake strings with Japanese runtime text:
  - `ロード中`
  - `資源読み込み中`
  - `適応Lvは進化条件に影響します`
  - `ZEROは最高難度の特殊ルートです`
  - `DNAは研究と解放に使用します`
  - `恐竜ごとの特徴を活かしましょう`
- Checked the runtime source for remaining mojibake patterns after the fix.

## QA

- Home screen visual layout checked at mobile width.
- News button moved to the top-right and remains clickable.
- New-dino banner displays with baked Japanese text.
- Banner click opens Research screen on the Unknown tab.
- Unknown tab displays new dino cards and right-side DNA costs.
- Loading menu runtime strings no longer contain question-mark mojibake or garbled text.
- Runtime console warning/error count: 0 in the browser smoke checks.

## QA Artifacts

- `docs/assets/nd10pre_home_segmented_background_contact.png`
- `docs/assets/nd10pre_new_dinos_banner_contact.png`
- `docs/assets/nd10pre_home_ui_layout_contact.png`
- `docs/assets/nd10pre_home_banner_to_unknown_contact.png`
- `docs/assets/nd10pre_home_tutorial_deploy_contact.png`
- `docs/assets/nd10pre_home_banner_report.json`

## Remaining Notes

- News tutorial bounds were updated in code. The screenshot pass confirmed sortie bounds; the news page was not recaptured in overlay state after the tutorial flow completed, so it should be rechecked during ND10 full tutorial QA.
