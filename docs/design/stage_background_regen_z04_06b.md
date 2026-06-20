# Z04-06b 全ステージ背景再生成・適用

## 目的

Z04-06aで確立したruins背景の品質基準を、未対応だった以下3ステージへ水平展開した。

- jungle
- volcano
- swamp

ruinsはZ04-06aで対応済みのため、今回の差分では原則変更していない。

## 共通方針

- 同一ステージ内ではNORMAL / HARD / EXPERT / ZEROで同じ背景タイルを使用する。
- ZERO感は背景そのものではなく、既存ZERO演出、警告、ボス演出レイヤーで表現する。
- 背景は敵、弾、警告、UIの視認性を邪魔しない低コントラストにする。
- 1024x1024の背景タイルを生成し、Z04-06a ruinsと同じ対辺ブレンド処理で継ぎ目を抑えた。
- 大きな一枚絵ではなく既存PlaySceneのタイル描画方式を維持し、メモリ増加と描画方式変更を避けた。

## 生成アセット

### jungle

出力:

- `public/assets/maps/backgrounds/jungle_battlefield_tile.png`

コンセプト:

- 原始ジャングル
- 湿った樹木と根
- 進化実験施設の残骸
- 控えめな青緑の微光
- 視界を塞がない植物量

シーム確認:

- 生成直後の対辺平均差: left/right `8.9076`, top/bottom `9.1914`
- ブレンド後の対辺平均差: left/right `0.0`, top/bottom `0.0`

### volcano

出力:

- `public/assets/maps/backgrounds/volcanic_battlefield_tile.png`

コンセプト:

- 黒い岩盤の火山地帯
- 控えめな溶岩流
- 融解した古代研究施設の痕跡
- 赤橙の発光は警告や攻撃を邪魔しない強さに制限

シーム確認:

- 生成直後の対辺平均差: left/right `11.1595`, top/bottom `11.5182`
- ブレンド後の対辺平均差: left/right `0.0`, top/bottom `0.0`

### swamp

出力:

- `public/assets/maps/backgrounds/swamp_battlefield_tile.png`

コンセプト:

- 毒沼と湿地
- 沈んだ研究施設の床材
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

Z04-06aでPlayScene側は難易度別に背景を分岐しない方針へ整理済みのため、今回のZ04-06bではPlaySceneの描画ロジック変更は不要だった。

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

## ZERO演出の扱い

背景は通常難易度とZEROで共通にした。ZERO専用の雰囲気は、既存のZERO overlay、warning guide、boss effect、hazard effectで重ねる。これにより、背景だけが過度に赤紫/青緑へ寄って通常ステージの視認性を損なうことを避けた。

## ruinsへの影響

ruins背景およびruins ZERO演出はZ04-06aの状態を維持した。今回の変更対象はjungle / volcano / swampの背景画像とmanifest説明のみで、ruins関連のasset参照、ZERO報酬、ボス、攻撃、演出には触れていない。

## パフォーマンス配慮

- 既存と同じ1024x1024 PNGタイル方式を維持した。
- 常時particleや追加Spriteを増やしていない。
- 大きな一枚絵への変更は避け、PlaySceneの既存背景描画コストに収めた。
- ファイルサイズは約2.0-2.2MBで、ruinsと同じ運用範囲に収めた。

## QA成果物

- `docs/assets/z04_06b_stage_background_contact.png`
- `docs/assets/z04_06b_all_stage_difficulties_contact.png`
- `docs/assets/z04_06b_background_asset_report.json`
- `docs/assets/z04_06b_browser_qa_results.json`

## ブラウザQA結果

Codex内ブラウザで以下12パターンを起動確認した。

- jungle NORMAL / HARD / EXPERT / ZERO
- volcano NORMAL / HARD / EXPERT / ZERO
- swamp NORMAL / HARD / EXPERT / ZERO

確認結果:

- 全パターンでcanvas表示あり。
- 全パターンでクラッシュ画面なし。
- 全パターンでページconsole warn/error `0`。
- ZEROモードでも既存ZERO演出レイヤーが維持されている。

## 残課題

- 追加背景の長時間プレイ時視認性はZ04-07またはリリース前QAで再確認する。
- 今回は背景のみの差し替えであり、敵構成、ZERO報酬、ボス、攻撃パターンは変更していない。
