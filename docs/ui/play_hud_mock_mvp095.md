# MVP-095 Play HUD Mock

## 目的
本格実装前に、プレイHUDの情報整理、必殺表示、スキルスロット、操作コントローラの方向性を確認する。
このMVPではHUDの全面実装は行わない。

## 生成モック
- `docs/mockups/mvp095/play_hud_mock_v1_pre_evolution.png`
- `docs/mockups/mvp095/play_hud_mock_v2_evolved_special.png`
- `docs/mockups/mvp095/play_hud_mock_v3_revised_layout.png`
- `docs/mockups/mvp095/play_hud_mock_v4_bottom_skill_slots.png`
- `docs/mockups/mvp095/play_hud_mock_v5_image2_adopted.png` - 採用モック

## HUDレイアウト案
- 上部左にHP、EXP、スコア、DNA見込みを集約する。
- DNA見込みはホーム画面の赤DNAアイコンを流用する前提。
- 生存時間と撃破数は上部HUDから少し下げた右側小パネルに分離する。
- ポーズボタンは右上に独立配置し、HP/EXP群とは混ぜない。
- 下部中央にEXPバーを置き、レベルアップ直前の状態を読みやすくする。

## 必殺UI案
- 進化前は必殺UIを表示しない。
- 分岐進化後のみ右下に必殺ボタンを追加する。
- READY時はアンバー発光、クールダウン時は進捗リングで表示する想定。
- 必殺アイコンは進化先ごとに差し替える。

代表例:
- 高速変異: 高速爪撃
- 狩猟変異: 追尾狩猟
- 攻撃変異: 衝撃咆哮

## スキルスロット案
- ユーザー確認により、3スロットは右側縦並びではなく下部横並びを優先する。
- 各スロットはアイコン、短い名前、強化段階数値を表示する。
- プレイ領域を潰さないよう、スロット幅は小さく保つ。
- 詳細説明はタップ時またはポーズ画面側に逃がす想定。

## 操作コントローラ案
- 左下に仮想スティックを固定表示する。
- 半透明の二重リングと小さなノブで、押下範囲と現在入力を分ける。
- シアン発光を使うが、背景とEXPを邪魔しない薄さにする。

## 仮アセット
- `public/assets/ui/hud_mock/hud_top_panel_v2.png`
- `public/assets/ui/hud_mock/pause_button_frame_v2.png`
- `public/assets/ui/hud_mock/skill_slot_frame.png`
- `public/assets/ui/hud_mock/special_skill_frame.png`
- `public/assets/ui/hud_mock/virtual_stick_base.png`
- `public/assets/ui/hud_mock/virtual_stick_knob.png`
- `public/assets/ui/hud_mock/special_icon_speed_claw.png`
- `public/assets/ui/hud_mock/special_icon_hunting_trace.png`
- `public/assets/ui/hud_mock/special_icon_attack_roar.png`

## 確認待ち
- 採用モックは `play_hud_mock_v5_image2_adopted.png` とする。
- 必殺ボタンは右下でよいか。
- 進化後のみ必殺UIが出る見せ方でよいか。
- スキルスロットはv4のような下部横並びでよいか。
- EXPバーは下部中央でよいか。
- 仮想スティックの大きさと透明度はこの方向でよいか。

## MVP-096 実装反映
- 採用モック `play_hud_mock_v5_image2_adopted.png` をプレイHUD実装の正本参照として扱う。
- 上部HUD、右側独立ポーズ、下部3スキル枠、左下仮想スティック、進化後のみ右下必殺UIという構成を実装へ反映する。
- 進化前は必殺UIを非表示にする。モック上に必殺ボタンが描かれていても常時表示しない。
- 必殺UIは `selectedEvolution.tag` に応じて speed / hunting / attack の専用アイコンを表示する。
- DNA表示はホーム用の赤DNAアイコンを流用し、HUD専用の重複DNAアイコンは増やさない。
- `public/assets/ui/hud/` 配下の本実装用アセットは文字なしPNGとし、表示テキストはコード側で描画する。

## MVP-097 反映メモ
- 左上恐竜アイコンは恐竜選択画面の詳細表示hero画像をHUD用に正面寄りで切り出す。
- 左上外枠は生成アセット `public/assets/ui/hud/portrait_frame.png` を使用する。
- 右上の時刻/撃破数/スコア表示は、枠外にはみ出さないようMVP-096より少し左へ寄せる。
- 進化後確認は `?debugEvolution=attack` などのURLクエリで行う。

## HUD重なり回避メモ
- 進化通知は上段の独立通知として扱う。
- ボス名とボスHPバーは進化通知の下へ下げ、通知中でも最低48px程度の縦余白を確保する。
- 分岐通知、ボスHP、通常HUDのテキストは互いに重ねず、それぞれの安全領域内で中央寄せする。
