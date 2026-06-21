# Z04-06b 全ステージ背景再生成・適用

## 目的

Z04-06a で確立した ruins 背景の品質基準を、未対応だった以下 3 ステージへ水平展開した。

- jungle
- volcano
- swamp

ruins は Z04-06a で対応済みのため、今回の差分では原稿変更していない。

## 共通方針

- 同一ステージ内では NORMAL / HARD / EXPERT / ZERO で同じ背景タイルを使用する。
- ZERO 感は背景そのものではなく、既存 ZERO 演出、warning、ボス演出レイヤーで表現する。
- 背景は敵、弾、警告、UI の視認性を阻害しない低コントラストにする。
- 1024x1024 の背景タイルを生成し、Z04-06a ruins と同じ対辺ブレンド処理で継ぎ目を抑えた。
- 大きな一枚絵ではなく、既存 PlayScene のタイル描画方式を維持し、メモリ増加と描画方式変更を避けた。

## 生成アセット

### jungle

出力:

- `public/assets/maps/backgrounds/jungle_battlefield_tile.png`

コンセプト:

- 原始ジャングル
- 湿った樹木と根
- 進化実験施設の残骸
- 控えめな青緑の発光
- 視界を塗りつぶさない植物量

シーム確認:

- 生成直後の対辺平均差: left/right `8.9076`, top/bottom `9.1914`
- ブレンド後の対辺平均差: left/right `0.0`, top/bottom `0.0`

### volcano

出力:

- `public/assets/maps/backgrounds/volcanic_battlefield_tile.png`

コンセプト:

- 黒い岩盤の火山地帯
- 控えめな溶岩流
- 崩壊した古代研究施設の痕跡
- 赤橙の発光は警告や攻撃を邪魔しない強さに制限

シーム確認:

- 生成直後の対辺平均差: left/right `11.1595`, top/bottom `11.5182`
- ブレンド後の対辺平均差: left/right `0.0`, top/bottom `0.0`

### swamp

出力:

- `public/assets/maps/backgrounds/swamp_battlefield_tile.png`

コンセプト:

- 毒沼と湿地
- 沈んだ研究施設の床板
- 黒い泥と控えめな緑/紫の液体
- 薄い霧

シーム確認:

- 生成直後の対辺平均差: left/right `10.1191`, top/bottom `11.1615`
- ブレンド後の対辺平均差: left/right `0.0`, top/bottom `0.0`

## 接続内容

`src/data/asset_manifest.js` の `stageBackgrounds` にある既存キーを維持し、各背景ファイルを同じパスで差し替えた。

- `stageBackgrounds.jungle`
- `stageBackgrounds.volcano`
- `stageBackgrounds.swamp`

Z04-06a で PlayScene 側は難易度別に背景を分岐しない方針へ整理済みのため、今回の Z04-06b では PlayScene の描画ロジック変更は不要だった。

## 適用先

### jungle

- NORMAL
- HARD
- EXPERT
- ZERO

### volcano

- NORMAL
- HARD
- EXPERT
- ZERO

### swamp

- NORMAL
- HARD
- EXPERT
- ZERO

## ZERO 演出の扱い

背景は通常難易度と ZERO で共通にした。ZERO 専用の雰囲気は、既存の ZERO overlay、warning guide、boss effect、hazard effect で重ねる。これにより、背景だけが過度に赤紫/青緑へ寄って通常ステージの視認性を損なうことを避けた。

## ruins への影響

ruins 背景および ruins ZERO 演出は Z04-06a の状態を維持した。今回の変更対象は jungle / volcano / swamp の背景画像と manifest 説明のみで、ruins 関連の asset 参照、ZERO 報酬、ボス、描画、演出には触れていない。

## パフォーマンス配慮

- 既存と同じ 1024x1024 PNG タイル方式を維持した。
- 常時 particle や追加 Sprite を増やしていない。
- 大きな一枚絵への変更は避け、PlayScene の既存背景描画コストに収めた。
- ファイルサイズは約 2.0-2.2MB で、ruins と同じ運用範囲に収めた。

## QA 成果物

- `docs/assets/z04_06b_stage_background_contact.png`
- `docs/assets/z04_06b_all_stage_difficulties_contact.png`
- `docs/assets/z04_06b_background_asset_report.json`
- `docs/assets/z04_06b_browser_qa_results.json`

## ブラウザ QA 結果

Codex 内ブラウザで以下 12 パターンを起動確認した。

- jungle NORMAL / HARD / EXPERT / ZERO
- volcano NORMAL / HARD / EXPERT / ZERO
- swamp NORMAL / HARD / EXPERT / ZERO

確認結果:

- 全パターンで canvas 表示あり。
- 全パターンでクラッシュ画面なし。
- 全パターンでページ console warn/error `0`。
- ZERO モードでも既存 ZERO 演出レイヤーが維持されている。

## 残課題

- 追加背景の長時間プレイ時視認性は Z04-07 またはリリース前 QA で再確認する。
- 今回は背景のみの差し替えであり、機構、ZERO 報酬、ボス、描画パターンは変更していない。
