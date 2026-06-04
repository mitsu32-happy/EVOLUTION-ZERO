# Options UI Spec

## MVP-161 プレイ設定の実反映

- `揺れ`: `PlayScene.triggerScreenShake` を抑制する。
- `発光`: 被弾時の赤フラッシュを抑制する。
- `ダメージ`: ダメージ数値と pickup 取得ポップを抑制する。
- `簡易表示`: EffectLayer の全体 alpha を下げ、戦闘エフェクトは `CombatSystem.simpleEffects` の軽量描画を使う。
- `スティック表示`: 左下 virtual stick の表示 / 非表示を切り替える。
- `タッチ補助`: ドラッグ移動のデッドゾーンを小さくし、短いドラッグでも入力しやすくする。
- `警告ガイド`: ボス攻撃、ZEROボス攻撃、ステージギミックの危険範囲ガイドを表示 / 非表示にする。デフォルトは ON。
- `視認性`: 背景ビネットと危険範囲ガイドの見やすさを上げる。
- `背景暗転`: 背景ビネットの濃さを調整する。
- `HUD`: HUD全体のスケールを小 / 標準 / 大で切り替える。

未実装のチップは残さない。将来追加する設定は、保存だけでなく PlayScene / HUD / Effect / Warning 表示への実反映を同じMVP内で確認する。

## 正本参照
- `references/ui/options_ui_v1.png`

## 役割
- 設定画面は、音量・演出・操作・表示を短時間で調整する研究施設端末UIとして扱う。
- ホームから開く通常設定では下部ナビを維持する。
- プレイ中設定では下部ナビと開発用アセット確認を非表示にし、戻る操作で必ずポーズへ復帰する。

## MVP-104 表示項目
- 音量:
  - マスター音量
  - BGM音量
  - SE音量
  - UI音量
  - ミュート
- 演出:
  - 画面揺れ
  - フラッシュ
  - ダメージ数字
  - 簡易演出
- 操作:
  - 仮想スティック表示
  - タップ範囲補助
  - 操作ガイド表示
- 表示:
  - 高視認性モード
  - 背景暗幕
  - HUDサイズ

## 保存形式
- 音量は既存の `audioSettings` を継続利用する。
- 演出、操作、表示は `gameplaySettings` にoptional/default補完で保存する。
- 既存セーブに `gameplaySettings` がない場合は初期値を補完し、セーブ破壊は行わない。

## 実プレイ反映
- 画面揺れOFF: `PlayScene.triggerScreenShake` を抑制する。
- フラッシュOFF: 被弾フラッシュを抑制する。
- ダメージ数字OFF: `CombatSystem` のダメージ数字生成を抑制する。
- 簡易表示ON: 攻撃エフェクトの尺、スケール、発光量を控えめにする。
- 仮想スティックOFF: 左下スティック表示を非表示にする。ドラッグ操作自体は維持する。
- タップ補助ON: スティックガイドの補助線を少し濃くし、入力範囲を読みやすくする。
- ガイドOFF: スティックガイド線を非表示にする。
- 高視認性: 背景暗幕/ビネットを軽くして、敵・EXP・HUDを読みやすくする。
- 暗幕OFF: 背景暗幕を弱める。
- HUDサイズ: 小/標準/大をHUDコンテナの軽いスケール差として反映する。

## 安全領域
- 各行パネルは外枠装飾を避け、左右20px以上を基本安全余白とする。
- 右側トグル/チップはパネル外枠に乗せない。
- 演出/操作/表示はチップ自体を意味のある状態ラベルにし、行内の説明文は原則表示しない。
- チップ文言は `揺れON/OFF`、`発光ON/OFF`、`ダメージON/OFF`、`簡易表示ON/OFF`、`スティック表示/非表示`、`タップ補助ON/OFF`、`ガイドON/OFF`、`高視認性/低視認性`、`暗幕ON/OFF`、`HUD小/標準/大` を標準とする。
- チップが長くなる場合は1行に詰めず、2段グリッドへ配置して安全領域内に収める。
- 音量行はカード外枠が強いため、ラベル、数値、スライダーを内側へ寄せて配置する。
- 分類見出しは `音量設定` / `プレイ設定` とし、小さな英字のみの見出しは避ける。
- スライダー値、トグル文字、チップ文字は画像に焼き込まずコード側で描画する。

## UIアセット
- `assets/ui/options/options_panel_v3.png`
- `assets/ui/options/option_row_panel_wide_v3.png`
- `assets/ui/options/option_section_panel_v3.png`
- `assets/ui/options/slider_frame_v3.png`
- `assets/ui/options/slider_knob_v3.png`
- `assets/ui/options/mute_toggle_on.png`
- `assets/ui/options/mute_toggle_off.png`
- `assets/ui/options/mute_toggle_disabled.png`
- `assets/ui/options/option_button_frame_v3.png`
- `assets/ui/options/dev_button_frame_v3.png`
- `assets/ui/options/option_chip_cyan_v3.png`
- `assets/ui/options/option_chip_amber_v3.png`

## MVP-115b Debug Visibility
- 開発用アセット確認ボタンはデバッグURLでのみ表示する。
- デバッグ判定は `debug` で始まるクエリ、または `debugMode=1` を基準にする。
- 通常URLとプレイ中設定では開発用アセット確認を表示しない。

## MVP-116 Layout Adjustment
- 「プレイ設定」見出しはミュート行の下に独立して見えるよう、ミュート行から8px以上離す。
- 演出/操作/表示の設定行は見出しより下へまとめて移動し、下部ナビと干渉しない範囲で安全領域内に収める。

## MVP-A04 視認性補正
- 表示設定に `視認性補正` を追加し、`標準` / `やや明るい` / `明るい` の3段階で切り替える。
- 保存キーは `gameplaySettings.display.visibilityAssist`。既存の `highVisibility` は旧セーブ互換用として残し、未設定時に `やや明るい` 相当へ正規化する。
- チップ表示は `補正:標準` / `補正:やや明` / `補正:明` とし、スマホ幅で潰れない短い文言にする。
- チップ色は3段階で変える。標準は暗いスレート、やや明はシアン、明はアンバー寄りにして、現在の補正強度が視覚的に分かるようにする。
- 変更後はOptions保存、リロード維持、プレイ画面へ戻った時の即時反映を確認する。

## fallback
- v3アセット未読込時はv2/v1アセット、またはGraphics描画へfallbackする。
- 音声素材未配置時でもoptional SE呼び出しによりconsole warn/errorを出さない。

## MVP-A12 Options Readability

- Setting groups show short descriptions so players understand what each row changes.
- Chip labels are shortened for mobile readability while retaining the meaning of ON/OFF or cycle states.
- Effects, controls, and display groups prioritize readable Japanese labels over compact technical labels.
- A12 QA artifacts: `docs/assets/a12_options_qa.png`, `docs/assets/a12_management_ui_contact.png`, and `docs/assets/a12_management_ui_report.json`.

## MVP-A12b Options Asset Refresh

- Settings rows and section panels now use generated A12b management UI assets with cleaner interior safe areas.
- ON/OFF and cycle chips use generated A12b toggle chip textures when available; Graphics fallback remains only for missing textures.
- Existing background, main options panel, slider knob, and mute switch assets remain unchanged to keep the screen visually stable.
- Chip text remains code-rendered and must stay short enough for 390px mobile layouts.
## MVP-A12c Options Simplification

- Options screen decoration is reduced by lowering the background, outer panel, and row frame alpha.
- Setting rows, labels, descriptions, and chips remain the primary visual focus.
- No additional frames or decorative assets were added for A12c.