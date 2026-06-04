# Title Select UI Spec

## MVP-160e

- Homeの称号表示エリアから称号選択UIを開く。
- UIは `public/assets/ui/titles/` の専用PNGを優先して表示する。
- PNG未読込時のみGraphics fallbackで起動不能を防ぐ。
- タブ:
  - `称号`: 所有済み称号一覧。
  - `フレーム`: 所有済み称号フレーム一覧。
- 一覧はスマホ縦画面前提のページング表示とし、横スクロールは禁止。
- 行は専用slot画像を使い、ZERO称号は選択枠と色で通常称号より豪華に見せる。
- 装備ボタンは専用PNGを使い、テキストはコード描画する。
- 未所有称号/未所有フレームは装備不可。SaveManager側でも拒否する。
- 装備変更時に保存する値:
  - `equippedTitleId`
  - `equippedTitleFrameId`
- 装備変更はHomeへ即時反映し、リロード後も維持する。

## Asset List

- `title_select_panel.png`
- `title_select_tab_selected.png`
- `title_select_tab_inactive.png`
- `title_select_slot.png`
- `title_select_slot_selected.png`
- `title_select_button_equip.png`
- `title_select_button_close.png`
- `title_select_scroll_bar.png`
- `title_select_preview_frame.png`

## Title Frame Assets

- `title_frame_normal.png`
- `title_frame_hard.png`
- `title_frame_expert.png`
- `title_frame_zero_jungle.png`
- `title_frame_zero_volcano.png`
- `title_frame_zero_swamp.png`

## Debug

- `debugUnlockAllTitles=1`: 通常/ENDLESS/ZERO称号とフレームをQA用に解放。
- `debugTitleReward=1`: 軽量QA用に通常称号を付与。
- `debugResetEquippedTitle=1`: 装備中称号/フレームを解除。

## MVP-160f Title Selection Fix

- 称号カードは「選択」と「装備」を分離する。
  - カード本体タップ: 選択状態を更新。
  - カード内の装備ボタン: `SaveManager` 経由で保存。
- カード安全領域:
  - 1ページ4件表示。
  - カード高さは86px、上下余白12px、左右余白22pxを基準にする。
  - 称号名は上段、条件/スコープは下段、装備ボタンは右下の安全領域へ配置。
  - ボタンはカード外へ出さず、タップ領域はボタン周囲に少し余白を持たせる。
- 装備失敗時はconsole errorではなく、UI内フィードバックで知らせる。
- `debugUnlockAllTitles=1` で称号/フレーム両タブのページングと装備状態を確認する。
## MVP-160f Frame Reuse Check

- Frame file hashes were checked for `title_frame_*.png`; no current PNG file is byte-identical.
- A runtime reuse was found: `zero_deluxe_frame` was pointing at the jungle ZERO frame.
- `zero_deluxe_frame` now uses its own generated asset: `public/assets/ui/titles/title_frame_zero_deluxe.png`.
- Jungle and swamp ZERO frames were too close visually, so both were regenerated with separate concepts:
  - jungle: canopy predator, vines, claw accents, emerald / violet / cyan.
  - swamp: toxic miasma, slime membranes, poison bubbles, yellow-green / violet.
- Runtime frame mapping:
  - `zero_deluxe_frame` -> `title_frame_zero_deluxe.png`
  - `jungle_zero_frame` -> `title_frame_zero_jungle.png`
  - `volcano_zero_frame` -> `title_frame_zero_volcano.png`
  - `swamp_zero_frame` -> `title_frame_zero_swamp.png`
- Contact sheet for QA: `docs/assets/title_frames_mvp160f_contact.png`.

## MVP-A12d Title Select Close Behavior

- The title/frame selection modal no longer shows the close button.
- Tapping outside the modal panel closes it, matching the News modal rule.
- Taps inside the panel, tabs, title/frame rows, paging controls, and equip buttons must not close the modal accidentally.