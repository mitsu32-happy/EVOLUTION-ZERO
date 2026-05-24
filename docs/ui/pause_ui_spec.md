# Pause UI Spec

## 正本参照
- `references/ui/pause_ui_v1.png`

## 役割
- プレイ中の一時停止と復帰を最優先に扱う。
- 半透明の危険研究施設UIとして、背後にプレイ中である気配を残す。
- 下部ナビは表示しない。

## 表示要素
- タイトル: `一時停止`
- 主導線: `再開`
- 副導線: `設定`, `出撃終了`, `タイトルへ戻る`
- 生存時間、撃破数、DNA/EXP見込み、現在分岐。
- 主な適応スロット最大3件。

## 導線
- `再開`: そのままプレイへ戻る。
- `設定`: プレイ中設定へ移動する。プレイ中設定では下部ナビを非表示にする。
- `出撃終了`: リザルトへ移動する。
- `タイトルへ戻る`: タイトル画面へ戻る。

## UIアセット
- `assets/ui/pause/pause_panel.png`
- `assets/ui/pause/pause_button_resume.png`
- `assets/ui/pause/pause_button_options.png`
- `assets/ui/pause/pause_button_end_run.png`
- `assets/ui/pause/pause_button_title.png`
- `assets/ui/pause/pause_status_panel.png`
- `assets/ui/pause/pause_panel_v3.png`
- `assets/ui/pause/pause_button_resume_v3.png`
- `assets/ui/pause/pause_button_options_v3.png`
- `assets/ui/pause/pause_button_end_run_v3.png`
- `assets/ui/pause/pause_button_title_v3.png`
- `assets/ui/pause/pause_status_panel_v3.png`
- `assets/ui/pause/pause_warning_chip_v3.png`

## 実装ルール
- 生成済みPNGを主表示に使い、Graphicsはfallbackとして残す。
- `pause_panel.png` は画面中央の主パネルとして使い、ボタンとステータス表示はその内側の安全領域に配置する。
- `pause_status_panel.png` は生存情報と主な適応の2領域に流用する。テキストは枠線に乗らないよう左右20px以上の余白を取る。
- 再開ボタンを最優先導線として、他ボタンより視線が集まりやすい位置と発光差を維持する。
- MVP-100では `*_v2.png` を優先表示する。生成元は `docs/mockups/mvp100/pause_asset_sheet_v2_raw.png`。
- v2ボタンは再開=アンバー、設定=シアン、出撃終了=赤警告、タイトル= muted steel の色差を持つ。
- MVP-102では `*_v3.png` を最優先表示する。生成元は `docs/mockups/mvp102/pause_asset_sheet_v3_raw.png`。
- v3は `pause_ui_v1.png` の赤警告・プレイ中感を正本として、再開を最も大きい赤警告ボタン、設定をシアン系、出撃終了/タイトルを警告赤系にする。
- プレイ背景が完全に隠れないよう、黒幕は濃すぎない alpha にする。主パネルは読みやすさ優先で半透明ガラス調を維持する。
- ステータス表示は `生存時間`, `撃破数`, `DNA/EXP`, `分岐` の4項目まで。主な適応は3件までに抑える。
- ボタン文字はフレーム外周から左右74px以上、上下10px以上内側に置き、枠線と発光に乗せない。
- MVP-102b: v3ボタンは `button.asset` を保持して `resumeButtonV3` などを最優先参照する。v3が読めない場合のみv2/v1/Graphicsへfallbackする。
- `pause_warning_chip_v3.png` は空フレームとして単独表示しない。`RUN PAUSED` の背景として同じ中心座標に配置し、意味のあるラベル背景にする。
- MVP-102c: ボタン色は案Aを採用する。再開だけ強調し、設定/出撃終了/タイトルは暗色基調にする。危険操作は細い赤警告ラインで示し、赤塗りを多用しない。
- v4描画優先順位は `v4 -> v3 -> v2 -> v1 -> Graphics fallback`。
- ボタン左側には `pause_icon_*` をコード側で重ねる。アイコン未読込時は非表示にし、ボタン操作は維持する。
- `主な適応` は `現在の適応状況` に変更する。
- 現在の適応状況は3スロット横並びで表示する。各スロットはアイコンと短いラベルを中央揃えにし、未取得/空きは `--` と薄い空枠で表示する。
- ステータスパネルは下枠に文字が乗らないよう、ラベル/値ともパネル内側へ寄せ、行間を詰めすぎない。

## MVP-115 現在の適応状況

- `現在の適応状況` は適応タグ集計ではなく、現在取得済みの適応技を表示する。
- 表示はHUDの3スキルスロットと揃え、アイコン + 短い技名 + `強N` を3枠で表示する。
- 未取得枠は薄い空枠と `空き` 表示にする。
- 通常技、タグなし強化、必殺技はこの枠に表示しない。
- `?debugAdaptationSkills=1` 以外では、出撃開始時に確認用スキルを自動付与しない。

## MVP-115b Skill Popup
- ポーズ画面の「現在の適応状況」は、取得済み適応技の3スロット表示とする。
- スロットに取得済みスキルがある場合、アイコンをタップすると共通ポップアップを表示する。
- ポップアップにはアイコン、技名、適応タグ、強化段階、説明、強化効果を表示する。
- 未取得スロットは「空き」と表示し、タップしてもポップアップを出さない。
- 通常技、タグなし強化、必殺技はこの3スロットには含めない。

## fallback
- アセット未読込時はGraphics描画で継続する。
- プレイ復帰とプレイ中設定の制限を優先し、装飾読み込み失敗では停止しない。
