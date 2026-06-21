# Z04-06a ruins背景・停止画面調整

## 目的

Z04-05時点のruins ZERO確認で見つかった以下を優先対応した。

- 停止画面 / game loop stalled / whiteout diagnostics 画面の座標ずれ確認と修正
- ruins ZERO背景の継ぎ目違和感の修正
- 修正後のruins背景を ruins NORMAL / HARD / EXPERT / ZERO に適用
- jungle / volcano / swamp の背景再生成は次工程へ分離

## 停止画面

対象:

- `src/diagnostics/crash_diagnostics.js`
- `debugCrash=runtime` による停止画面表示

修正内容:

- 停止画面の外枠をcanvas矩形基準ではなく、ビューポート全体基準へ変更。
- `position: fixed; left: 0; top: 0; width: window.innerWidth; height: window.innerHeight` とし、カードを中央寄せ。
- スマホ幅での見切れ対策として、カードに `max-height: calc(100dvh - 24px)` と内部スクロールを設定。
- safe area を考慮したpaddingをCSS側で指定。
- ボタンに `min-height: 40px` を指定し、スマホ幅では縦積みにできるようにした。
- 停止画面の日本語文言をDOM生成後に正常な日本語へ上書きし、文字化け表示を防止。

QA結果:

- 390x844相当のブラウザ実測で、rootは `390x844`。
- cardは `390x820`、X方向中央ずれ `0`。
- overflow X/Y は `0/0`。
- copy / reload ボタンは画面内。
- ブラウザのスクリーンショットAPIは停止画面表示後にタイムアウトしたため、DOM矩形実測を `docs/assets/z04_06a_crash_screen_layout_metrics.json` に保存。

成果物:

- `docs/assets/z04_06a_crash_screen_layout_contact.png`
- `docs/assets/z04_06a_crash_screen_layout_metrics.json`

## ruins背景

方針:

- 大きな1枚絵ではなく、既存PlaySceneの1024pxタイル描画方式に合わせたシームレス背景を採用。
- 大きな背景1枚はメモリ負荷と既存描画方式の変更が大きいため、今回は避けた。
- 画像生成で本番品質のruins研究施設背景を作成し、反対辺の差分が出ないよう後処理した。

生成/接続したアセット:

- `public/assets/maps/backgrounds/ruins_battlefield_tile.png`

コンセプト:

- 旧研究施設の遺跡
- ダークSF
- 壊れた研究設備
- 古代遺跡と人工施設の融合
- ZERO専用すぎない低コントラスト背景
- 敵/弾/警告の視認性を邪魔しない

シーム確認:

- 生成元の反対辺平均差分:
  - left/right: `10.0612`
  - top/bottom: `8.6348`
- 後処理後の反対辺平均差分:
  - left/right: `0.0`
  - top/bottom: `0.0`

成果物:

- `docs/assets/z04_06a_ruins_background_contact.png`
- `docs/assets/z04_06a_background_asset_report.json`

## ruins全難易度適用

対象:

- ruins NORMAL
- ruins HARD
- ruins EXPERT
- ruins ZERO

修正内容:

- `PlayScene.getStageBackgroundAssetKey()` のruins ZERO専用背景分岐を削除。
- ruins ZERO も通常ruinsと同じ `stageBackgrounds.ruins` を使うようにした。
- `asset_manifest.js` の `stageBackgrounds.ruinsZero` は互換用aliasとして `ruins_battlefield_tile.png` を参照する。

ZERO時の扱い:

- ZEROの雰囲気は背景ではなく、既存の `ruinsZeroReactorPulse` / `ruinsZeroLaserWarning` / boss effect / hazard effect などの専用演出で重ねる。
- 既存ruins通常ステージにも合う背景にし、ZERO専用すぎる色調は避けた。

QA結果:

390x844相当で以下を起動確認した。

- ruins NORMAL: canvas `390x844`, crashなし, console warn/error `0`
- ruins HARD: canvas `390x844`, crashなし, console warn/error `0`
- ruins EXPERT: canvas `390x844`, crashなし, console warn/error `0`
- ruins ZERO: canvas `390x844`, crashなし, console warn/error `0`
- jungle NORMAL: canvas `390x844`, crashなし, console warn/error `0`
- volcano NORMAL: canvas `390x844`, crashなし, console warn/error `0`
- swamp NORMAL: canvas `390x844`, crashなし, console warn/error `0`

ブラウザのスクリーンショットAPIは通常画面でもタイムアウトしたため、DOM/canvas実測とconsoleログを `docs/assets/z04_06a_browser_qa_results.json` に保存した。

成果物:

- `docs/assets/z04_06a_ruins_all_difficulties_contact.png`
- `docs/assets/z04_06a_browser_qa_results.json`

## 既存影響

- jungle / volcano / swamp の背景参照は変更していない。
- 既存ZEROボス/ギミック/警告アセットは変更していない。
- ZERO進化報酬、ボス、敵構成、攻撃パターンは変更していない。

## 次工程

次工程案:

```text
Z04-06b 全ステージ背景再生成・適用
```

対象予定:

- jungle
- volcano
- swamp
- ruins確認後の基準反映

方針:

- Z04-06aのruinsと同じく、ステージコンセプトに合う本番品質背景を生成。
- PlaySceneのタイル方式に合わせ、継ぎ目違和感のない背景へ更新。
- 高負荷化しないサイズ/形式を維持。

