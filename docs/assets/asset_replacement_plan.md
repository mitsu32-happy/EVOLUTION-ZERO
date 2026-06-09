# EVOLUTION ZERO アセット差し替え計画書

更新フェーズ: MVP-057 対応版

---

# 目的

本ドキュメントは、EVOLUTION ZERO における
実画像アセット・スプライトシート・音声素材の導入方針を定義する。

目的は以下。

- 実素材投入時の事故削減
- Codexによる画像生成・実装運用の統一
- SpriteSheet アニメーション方式への移行
- GitHub Pages / スマホブラウザ前提での安全運用
- fallback維持による開発継続性確保

---

# 現在のフェーズ

現在は「本格アセット投入フェーズ初期段階」。

以下は完了済み。

- fallback描画
- AssetLoader
- asset preview screen
- reload / missing cache clear
- asset state 表示
- visual rules
- bottom navigation統一
- スマホ縦UI調整

現在の方針:

- 基盤整備は十分
- 今後は「ゲーム感」「見た目」「演出」を優先
- 過剰な管理ツール開発は優先度を下げる

---

# 実素材運用方針

## 重要

Codex は以下を担当する。

- GPT-image-2.0 を利用した画像生成
- スプライトシート生成
- 実装
- asset_manifest.js 接続
- fallback維持
- preview画面確認

ユーザー側で画像を手動作成する前提ではない。

---

# 本番素材と検証素材

## 検証素材

以下は検証用・暫定素材として扱う。

- velociraptor.png
- swarm.png
- exp_small.png
- *_dummy.png

これらは:

- 差し替え経路確認
- Sprite表示確認
- anchor確認
- size確認

を目的とする。

最終本番素材ではない。

---

# 推奨アセット構成

## dinos

public/assets/dinos/

例:

- velociraptor_sheet.png
- triceratops_sheet.png
- tyrannosaurus_sheet.png

---

## enemies

public/assets/enemies/

例:

- swarm_sheet.png
- fast_sheet.png
- tank_sheet.png

---

## bosses

public/assets/bosses/

例:

- mutant_predator_sheet.png

---

## pickups

public/assets/effects/pickups/

例:

- exp_small.png
- exp_medium.png
- exp_large.png
- exp_boss.png

---

## UI icons

public/assets/ui/icons/

例:

- icon_home.png
- icon_research.png
- icon_codex.png
- icon_settings.png

---

## stage backgrounds

public/assets/backgrounds/

例:

- stage_jungle.png
- stage_volcanic.png
- stage_ruins.png

---

# スプライトシート推奨仕様

## 基本方針

- 透明PNG
- 右向き基準
- 各セルに完全な1体
- セル同士が接触しない
- 小サイズ表示でも読める輪郭
- モバイル向け2Dゲーム調
- 太めアウトライン推奨

---

## 推奨フォーマット

4行 x 4列

### Row 1
idle

### Row 2
run

### Row 3
attack

### Row 4
death

---

## 推奨セル仕様

- 正方形または近い比率
- 余白あり
- 足元が見切れない
- 武器・尻尾がセル外へ出ない

---

# velociraptor 推奨仕様

## 保存先

public/assets/dinos/velociraptor_sheet.png

---

## 推奨表示サイズ

116 x 92 基準

---

## anchor

0.5, 0.62

---

## アニメーション

### idle

軽い呼吸

### run

高速移動

### attack

噛みつき / 引っかき

### death

倒れる

---

# asset_manifest.js 方針

## 基本

manifestは以下を管理する。

- path
- spriteSheet
- fallback
- animation定義
- visual rules
- provisional状態
- testAsset状態

---

## animation定義例

```js
animations: {
  idle: {
    row: 0,
    frames: [0,1,2,3],
    fps: 6,
    loop: true
  }
}
```

---

# fallback方針

## 重要

実素材未配置でも:

- build成功
- 起動成功
- プレイ可能

を維持すること。

fallbackは絶対に削除しない。

---

# preview画面方針

## 表示対象

- loaded
- dummy OK
- fallback
- missing
- spriteSheet
- animation定義

---

## reload

- reload button維持
- missing cache clear維持
- cache busting維持

---

# GitHub Pages キャッシュ対策

## 推奨

- asset_reload クエリ使用
- 再読込ボタン使用
- Safariは強制リロード推奨

---

## iPhone Safari

iPhone Safari はキャッシュが強い。

反映されない場合:

1. 再読込ボタン
2. Safari再読み込み
3. タブ閉じ
4. Safari再起動

を試す。

---

# 音声素材運用方針

## 方針

Codex側で:

- ライセンスフリー素材取得
- AudioManager接続
- 音量調整
- 再生確認

まで行う。

---

## 必須ルール

以下を docs/audio/audio_credits.md に記録する。

- 出典URL
- 作者名
- ライセンス
- 商用利用可否
- クレジット要否
- 取得日

---

## 禁止

- ライセンス不明素材
- 利用規約違反取得
- 著作権侵害音源

---

# 今後の優先順位

## 高優先

- プレイヤー本格Sprite
- ボス演出
- 必殺演出
- 背景
- UIアイコン
- ゲーム感
- 手触り

---

## 低優先

- 過剰な検証ツール
- 過剰な管理UI
- 完璧な自動化
- 過剰なfallback拡張

---

# 今後の推奨進行

## MVP-057

ヴェロキラプトル本格SpriteSheet

---

## MVP-058

fast / tank / boss の本格Sprite

---

## MVP-059

必殺演出・hit effect

---

## MVP-060

背景アセット導入

---

## MVP-061

UIアイコン本格化

---

# 最重要方針

EVOLUTION ZERO は:

- スマホ縦
- 片手操作
- 分岐進化
- 適応タグ
- DNA研究中心
- プレイ中成長は一時

を軸とする。

アセット導入後も、
一本道進化・恒久Lv制に見える表現は禁止。
# MVP-057: Codex生成スプライトシート運用メモ

- `velociraptor.png` / `swarm.png` / `exp_small.png` は最終素材ではなく、差し替え経路確認用の provisional asset として扱う。
- ヴェロキラプトルの現在の優先アセットは `public/assets/dinos/velociraptor_sheet.png`。
- シート仕様は 4行 x 4列、1024x1024 PNG、1セル 256x256。
- 行定義:
  - Row 1: idle
  - Row 2: run
  - Row 3: attack
  - Row 4: death
- 右向き基準、透過PNG、余白あり、地面影なし、文字なしで生成する。
- sheet 読み込みに失敗した場合は `dinos.velociraptor` の単体PNGへfallbackする。
- 今後ほかの恐竜も `dinos.<id>Sheet` と `dinos.<id>` fallback の組み合わせで展開する。
- 画像生成時は、EVOLUTION ZERO の方向性として「セミリアル、ダークSF、古代生物、サバイバル感、控えめな発光、漫画調を避ける」を優先する。
- 歩行フレームはプロンプトだけでは脚の交互運動が崩れやすい。MVP-057では実装側のオーバーレイ補助は採用せず、ポーズガイドとシート正規化でイラスト側の解決を優先する。

---

# MVP-058: 量産向け4x4スプライトシート改善手順

## 基本方針

- 標準方式は `4x4 sprite sheet` の一括生成を維持する。
- `idle / run / attack / death` を完全個別生成する方式は標準採用しない。
- 実装側で脚を描き足すオーバーレイ補助は採用しない。
- 生成後の軽い自動補正で、セル切り出し、足元ライン、胴体中心、余白を整える。
- 一括生成と自動補正でも明確に破綻する場合のみ、`run` 行だけを例外的に最小再生成する。

## 生成プロンプト必須条件

- `animation model sheet`
- `consistent character across all frames`
- `fixed ground contact line`
- `aligned body center in every cell`
- `idle breathing only, no jumping`
- `run cycle with alternating legs`
- `left and right legs clearly switch positions`
- `no sliding single rear leg`
- `same scale in every frame`
- `same silhouette proportions in every frame`
- `side view facing right`
- `transparent background or solid #ff00ff background`

## idle 制約

- 待機はジャンプ禁止。
- 足位置は固定。
- 体の上下移動はほぼなし。
- 胸、首、尻尾の微小な呼吸差分のみ。
- 4フレームすべて同じ接地ラインにする。

## run 制約

- 4フレームで交互脚サイクルを作る。
- Frame 1: 前脚A・後脚Bが前、反対脚が後ろ。
- Frame 2: 両脚が体下を通過。
- Frame 3: Frame 1の逆脚。
- Frame 4: 両脚が体下を通過。
- 同じ脚だけが後ろに流れ続ける構図は禁止。
- 胴体高さ、頭位置、接地ラインを大きく変えない。

## 生成後補正

量産用補正スクリプト:

```powershell
python tools\sprite_sheet_postprocess.py `
  --input <generated_png> `
  --output public\assets\dinos\<dino>_sheet.png `
  --report docs\assets\<dino>_sheet_report.json `
  --target-width 218 `
  --target-height 172 `
  --foot-line 204 `
  --overlap 76
```

補正内容:

- `#ff00ff` 背景を透明化。
- マゼンタの縁残りを軽く除去。
- 近傍ウィンドウから本体成分を拾い、固定セル境界による尾や爪の見切れを軽減。
- 非透明ピクセルの bbox を取得。
- セル内の中心Xを揃える。
- upright 行の足元ラインを揃える。
- `idle` の上下ブレを抑制。
- セル外にはみ出さないように余白を再配置。

## 今回の velociraptor 設定

- 出力: `public/assets/dinos/velociraptor_sheet.png`
- レポート: `docs/assets/velociraptor_sheet_mvp058_report.json`
- セル: 256x256
- シート: 1024x1024
- 補正値: `target-width 218`, `target-height 172`, `foot-line 204`, `overlap 76`
- fallback: `dinos.velociraptor`

## 判断メモ

- MVP-058では一括生成のまま `idle` の飛び跳ね感を抑え、`run` の片足流れっぱなし感を軽減した。
- それでも完全な骨格アニメーション精度が必要な場合は、量産標準ではなく例外対応として `run` 行のみ再生成または手修正する。

---

# MVP-059: 敵内部ロールと表示ラベルの分離

## 基本方針

- 内部処理の enemy type は `swarm / fast / tank / boss` のまま維持する。
- プレイヤーに見える表示は、内部名ではなく危険個体ラベルとして扱う。
- スポーン、戦闘、報酬、バランス処理は内部 type を参照する。
- 描画、リング、開発用アセット確認画面は display profile を参照する。

## 表示ラベル

| 内部type | プレイヤー表示 | 用途 |
| --- | --- | --- |
| `swarm` | ラベルなし / NORMAL | 通常敵。表示は控えめにする。 |
| `fast` | ELITE | 高速・鋭さ・要注意感。 |
| `tank` | MUTANT | 重装・変異・硬さ。 |
| `boss` | APEX | ボス級・最危険。 |

## 素材制作方針

- 敵素材は役割名ではなく、危険個体として見えるシルエットを優先する。
- 量産時の優先順位は `silhouette > motion > readability > detail`。
- `FAST / TANK` のような開発者向け文字はプレイヤー画面に出さない。
- アセット確認画面では混乱防止のため、`type: fast / label: ELITE` のように内部名と表示名を併記する。

## 敵スプライト生成方針

- `swarm`: 小型・低脅威・群れ感・通常個体。
- `ELITE / fast`: 細身・前傾・長脚・鋭い・高速感。
- `MUTANT / tank`: 低重心・幅広・装甲感・重い・変異感。
- `APEX / boss`: 大型・最危険・異常進化体。

今後 `ANOMALY` などの特殊個体を追加する場合も、内部 type と表示ラベルを分離して追加する。

---

# MVP-060: 敵スプライトシート量産結果

## 生成した敵シート

| 内部type | 表示ラベル | 保存先 | 方針 |
| --- | --- | --- | --- |
| `swarm` | ラベルなし / NORMAL | `public/assets/enemies/swarm_sheet.png` | 小型・低脅威・群れ感・通常個体 |
| `fast` | ELITE | `public/assets/enemies/fast_sheet.png` | 細身・前傾・長脚・鋭い・高速感 |
| `tank` | MUTANT | `public/assets/enemies/tank_sheet.png` | 低重心・幅広・装甲感・重い・変異感 |

## アニメーション構成

全敵共通で 4行 x 4列、1024x1024 PNG、セル 256x256。

- Row 1: idle
- Row 2: move
- Row 3: attack
- Row 4: death

## postprocess

量産補正は `tools/sprite_sheet_postprocess.py` を使用する。

今回の設定:

```powershell
python tools\sprite_sheet_postprocess.py --input <generated_swarm> --output public\assets\enemies\swarm_sheet.png --report docs\assets\swarm_sheet_mvp060_report.json --target-width 210 --target-height 150 --foot-line 204 --overlap 76
python tools\sprite_sheet_postprocess.py --input <generated_fast> --output public\assets\enemies\fast_sheet.png --report docs\assets\fast_sheet_mvp060_report.json --target-width 224 --target-height 164 --foot-line 205 --overlap 84
python tools\sprite_sheet_postprocess.py --input <generated_tank> --output public\assets\enemies\tank_sheet.png --report docs\assets\tank_sheet_mvp060_report.json --target-width 230 --target-height 178 --foot-line 208 --overlap 88
```

## fallback

- `enemies.swarm` は sheet を優先し、失敗時は `enemies.swarmFallback`、さらに図形fallbackへ戻る。
- `enemies.fast` は sheet を優先し、失敗時は `enemies.fastFallback`、さらに図形fallbackへ戻る。
- `enemies.tank` は sheet を優先し、失敗時は `enemies.tankFallback`、さらに図形fallbackへ戻る。

## 視認性メモ

- `swarm` はラベルなしで控えめにし、群れの密度を邪魔しない。
- `ELITE` は細身の高速シルエットとシアン系リングで要注意個体として見せる。
- `MUTANT` は低重心の装甲シルエットとオレンジ系リングで硬い個体として見せる。
- 量産時の優先順位は引き続き `silhouette > motion > readability > detail`。

---

# MVP-061: APEXボススプライトシート

## 生成したボスシート

| 内部type | 表示ラベル | 保存先 | 方針 |
| --- | --- | --- | --- |
| `boss` | APEX | `public/assets/bosses/mutant_predator_sheet.png` | 巨大・低重心・異常進化体・最危険 |

## アニメーション構成

4行 x 4列、1024x1024 PNG、セル 256x256。

- Row 1: idle
- Row 2: move
- Row 3: attack
- Row 4: death

## 見た目方針

- 通常敵より明確に巨大。
- 低重心で、APEXリング内でも読みやすい横長シルエット。
- 赤黒、暗緑、くすんだ金、骨質装甲を中心に危険感を出す。
- 画像内の過剰発光は避け、APEXラベルと二重リングを主役に残す。
- 量産優先順位は `silhouette > threat > readability > detail`。

## postprocess

```powershell
python tools\sprite_sheet_postprocess.py --input <generated_boss> --output public\assets\bosses\mutant_predator_sheet.png --report docs\assets\mutant_predator_sheet_mvp061_report.json --target-width 236 --target-height 180 --foot-line 210 --overlap 96
```

## fallback

- `bosses.mutantPredator` は sheet を優先し、失敗時は `bosses.mutantPredatorFallback`、さらに図形fallbackへ戻る。
- 内部typeは `boss` のまま維持し、表示ラベルは `APEX` とする。

---

# MVP-062: マゼンタ / シアン縁の軽減

## 方針
- `tools/sprite_sheet_postprocess.py` に軽い縁色補正を追加した。
- `#ff00ff` 背景の透明化後に残りやすいマゼンタ縁と、生成時に混ざりやすいシアン縁を検出する。
- 輪郭削除ではなく、周辺の非透明ピクセル色をサンプリングして 1〜2px 程度を自然に寄せる。
- シルエット維持を最優先とし、アルファを大きく削らない。

## レポート
各シートの postprocess report に `edgeCleanup` を出力する。

- `edgeResidueReplaced`: 縁色を近傍色へ寄せたピクセル数
- `edgeAlphaSoftened`: 透明境界の過剰な色残りを軽くなじませたピクセル数

対象:
- `public/assets/dinos/velociraptor_sheet.png`
- `public/assets/enemies/swarm_sheet.png`
- `public/assets/enemies/fast_sheet.png`
- `public/assets/enemies/tank_sheet.png`
- `public/assets/bosses/mutant_predator_sheet.png`

---

# MVP-063〜065: 背景アセット基盤とステージ背景

## 保存先
- `public/assets/maps/backgrounds/jungle_battlefield_tile.png`
- `public/assets/maps/backgrounds/volcanic_battlefield_tile.png`
- `public/assets/maps/backgrounds/ruins_battlefield_tile.png`

## Manifest
`src/data/asset_manifest.js` の `stageBackgrounds` で以下へ接続する。

- `jungle` → `jungle_battlefield_tile.png`
- `volcano` → `volcanic_battlefield_tile.png`
- `swamp` → `ruins_battlefield_tile.png`（沼地専用素材ができるまでの仮運用）

## 生成・後処理方針
- 背景は鑑賞用ではなく戦闘フィールド用。
- 中彩度、暗め、低コントラスト、低ノイズを優先する。
- キャラ、敵、EXP、HUDの視認性を邪魔しない。
- `tools/background_tile_postprocess.py` で 1024x1024 に整え、軽いエッジブレンドでループ時の継ぎ目を抑える。

例:

```powershell
python tools\background_tile_postprocess.py --input <generated_png> --output public\assets\maps\backgrounds\jungle_battlefield_tile.png --report docs\assets\jungle_battlefield_tile_mvp064_report.json
```

## プレイ中の扱い
- `PlayScene` では背景タイルをワールド最背面に敷く。
- 既存の仮タイルマップは半透明で上に重ね、プレイ領域と視認性を維持する。
- 画像が読み込めない場合は従来の仮マップ表示だけで動作する。

---

# MVP-066: 背景導入後の視認性ルール

- 背景レイヤーは控えめな alpha で表示する。
- 敵リング、APEXラベル、EXP発光、HUD背景は従来どおり最前面の視認性を優先する。
- 背景の派手さより、`player / enemy / EXP / HUD` が埋もれないことを優先する。
- 今後の背景量産でも `silhouette > readability > atmosphere > detail` を守る。

---

# MVP-067: swamp専用背景と実戦視認性確認

## 追加背景
- `public/assets/maps/backgrounds/swamp_battlefield_tile.png`
- report: `docs/assets/swamp_battlefield_tile_mvp067_report.json`

## 生成方針
- 暗めの沼地、湿地、浅い水面、泥、沈んだ古代植物を含む。
- ダークSF / 異常進化 / サバイバル感を優先。
- 背景は主役ではなく戦闘フィールドなので、低コントラスト・低彩度で後処理した。
- 大きな水面反射や明るすぎる発光は避ける。

## 接続
- `stageBackgrounds.swamp` は `swamp_battlefield_tile.png` を参照する。
- `stageBackgrounds.ruins` は `ruins_battlefield_tile.png` として残し、将来の ruins 系ステージ用に分離した。

## 視認性メモ
- `jungle`: 暗緑中心。player / enemy ring / EXP glow は読める。細かい植物は背景 alpha と仮タイル重ねで抑える。
- `volcanic`: 赤茶系だが暗め。APEX警告や赤系エフェクトとは競合しすぎない程度に抑えている。
- `ruins`: 灰紫系。MUTANTやAPEXのシルエットが沈みにくい。将来の遺跡ステージ候補。
- `swamp`: 泥と浅水面を暗く抑えた。EXPとHUDを邪魔しないが、専用ギミック追加時は水面表現を強めすぎないこと。

## 運用ルール
- 背景が強く感じる場合は、背景画像自体を派手にするのではなく `PlayScene.backgroundLayer.alpha` または後処理の brightness / contrast / color を下げる。
- 敵・EXPが埋もれる場合は、背景より先に enemy ring / EXP glow を軽く調整する。

---

# MVP-068: 背景レイヤー優先ルール

## 目的
背景アセット導入後、既存仮タイルが背景を潰してステージ差が分かりにくくなる問題を軽減する。

## PlayScene 方針
- stage background が loaded の場合:
  - 実背景画像を主背景として扱う。
  - 既存仮タイルのダイヤ形状、植物、粒子は描画しない。
  - 戦闘視認性のため、ワールド上にごく薄い暗幕だけ重ねる。
- stage background が missing / fallback の場合:
  - 従来の仮タイルマップを表示する。
  - 画像未配置でもプレイ可能な fallback を維持する。

## 調整値
- 背景レイヤー alpha: `0.86`
- 背景 loaded 時の暗幕 alpha: `0.12`
- fallback 時の仮タイルは従来どおり表示する。

## 確認観点
- 背景が見えること。
- player / enemy / EXP / HUD が埋もれないこと。
- ステージ差が戦闘中にも分かること。
- 背景未読込時に仮タイルfallbackへ戻ること。

---

# MVP-068 follow-up: 出撃時の背景再読込修正

## 原因
`PlayScene` の stage background 読み込みが初期生成時だけで、`restart()` で新しい `GameState` と選択ステージを再設定した後に背景を再読込していなかった。
そのため出撃後は `stageBackgroundStatus` が fallback 側のまま残り、旧仮タイルが描画される場合があった。

## 修正
- `restart()` 後に `loadStageBackground()` を呼ぶ。
- `stageBackgroundKey` を保持し、選択ステージが変わった場合だけ背景レイヤーをクリアして再読込する。
- 読み込み中は fallback 仮タイルを表示し、読み込み完了後は背景優先表示へ切り替える。
- 背景読み込み失敗時は従来の仮タイル fallback を維持する。

---

# MVP-069: ステージ選択専用サムネイル

## 方針変更
- 戦闘背景とステージ選択サムネイルは役割を分ける。
- 戦闘背景: プレイ中の視認性を最優先。
- ステージサムネイル: 出撃前の世界観訴求を優先。
- ただし、カード上のステージ名・危険度・適応タグ・推奨タイプが読めることを最優先する。

## 保存先
- `public/assets/maps/thumbnails/jungle_thumb.png`
- `public/assets/maps/thumbnails/volcano_thumb.png`
- `public/assets/maps/thumbnails/swamp_thumb.png`
- `public/assets/maps/thumbnails/ruins_thumb.png`

## Manifest
`src/data/asset_manifest.js` に `stageThumbnails` を追加する。

- `stageThumbnails.jungle`
- `stageThumbnails.volcano`
- `stageThumbnails.swamp`
- `stageThumbnails.ruins`

## UIルール
- `StageSelectScreen` のカードは `stageThumbnails` を読み込んで表示する。
- 未読込・missing の場合は従来の色面fallbackを表示する。
- 文字可読性のため、サムネイル上に暗幕と下部ラベル帯を重ねる。
- 選択中カードは枠色とサムネイル明度で強調する。

## 生成後処理
`tools/stage_thumbnail_postprocess.py` で 1024x576 に整える。
カード上で使う前提のため、戦闘背景より印象は強めでよいが、中心の情報量は抑える。

---

# MVP-070: ステージ選択UIモック寄せ

## 方針
- 変更範囲はステージ選択画面に限定する。
- 戦闘背景ではなく、MVP-069 のステージ選択専用サムネイルをカードと大きめプレビューに使う。
- サムネイルはカードで読みやすいよう、MVP-070 後処理で明度と彩度を少し上げた。
- 文字可読性を優先し、サムネイル上には暗幕と下部ラベル帯を重ねる。

## ステージ選択用UIアセット
保存先: `public/assets/ui/stage_select/`

- `card_frame.png`
- `card_frame_selected.png`
- `card_frame_locked.png`
- `badge_danger.png`
- `badge_adaptation.png`
- `deploy_type_button.png`
- `deploy_type_button_selected.png`
- `deploy_type_button_locked.png`
- `detail_panel.png`

これらは文字なしのUI枠・ボタン素材として扱う。読み込み失敗時は `StageSelectScreen` の `Graphics` fallback で表示する。

## Manifest
`src/data/asset_manifest.js` に `stageSelectUi` を追加する。

- `stageSelectUi.cardFrame`
- `stageSelectUi.cardFrameSelected`
- `stageSelectUi.cardFrameLocked`
- `stageSelectUi.badgeDanger`
- `stageSelectUi.badgeAdaptation`
- `stageSelectUi.deployTypeButton`
- `stageSelectUi.deployTypeButtonSelected`
- `stageSelectUi.deployTypeButtonLocked`
- `stageSelectUi.detailPanel`

## 出撃タイプ表示ルール
- 画面表示は `NORMAL / HARD / EXPERT / ENDLESS / ZERO` を同列に扱う。
- 「通常」という表示は使わない。
- 内部値は既存互換を優先し、通常出撃は `selectedMode: standard` と `selectedDifficulty: normal | hard | expert` を維持する。
- `ENDLESS` は `selectedMode: endless`、`ZERO` は `selectedMode: zero` とする。
- `ZERO` はロック表示のままにする。

## UI生成運用メモ
- 単純な枠・ボタンは `tools/stage_select_ui_asset_builder.py` で再生成できる。
- GPT-image 系は、カード枠により強い質感やモック寄せの装飾を入れたい場合に検討する。
- ただし、文字入り画像にはしない。UI文言はPixiJS側のTextで描画し、ローカライズと可読性を保つ。

---

# MVP-071: ステージ選択UIアセット品質向上

## 最重要参照
- `references/ui/stage_select_ui_v2.png`

## 生成方針
- 汎用ダークSFではなく、`stage_select_ui_v2.png` の暗色研究施設UI、赤警告、DNA発光、半透明パネル、硬質SF感へ寄せる。
- 画像内に文字、ロゴ、数字、UI説明は入れない。
- ステージ選択画面の文言は PixiJS の `Text` で描画し、文字可読性と日本語差し替えを維持する。
- UIアセットは `#ff00ff` クロマキー背景で生成し、`tools/stage_select_ui_atlas_extract.py` で切り出しと透明化を行う。

## 再生成したUIアセット
保存先: `public/assets/ui/stage_select/`

- `card_frame.png`
- `card_frame_selected.png`
- `card_frame_locked.png`
- `badge_danger.png`
- `badge_adaptation.png`
- `deploy_type_button.png`
- `deploy_type_button_selected.png`
- `deploy_type_button_locked.png`
- `detail_panel.png`

MVP-070版は同じフォルダに `*_mvp070.png` として退避している。

## 再生成したステージサムネイル
保存先: `public/assets/maps/thumbnails/`

- `jungle_thumb.png`
- `volcano_thumb.png`
- `swamp_thumb.png`
- `ruins_thumb.png`

MVP-070版は `*_thumb_mvp070.png` として退避している。MVP-071版は戦闘背景より明るく、カード内でもステージ差が分かるように後処理した。

## 後処理レポート
- `docs/assets/jungle_thumb_mvp071_report.json`
- `docs/assets/volcano_thumb_mvp071_report.json`
- `docs/assets/swamp_thumb_mvp071_report.json`
- `docs/assets/ruins_thumb_mvp071_report.json`

## 運用ルール
- サムネイルは戦闘背景とは別の世界観訴求用画像として扱う。
- 中央は文字が載っても読める密度に抑え、環境差は外周の地形・発光・色で出す。
- UIアセットが読み込めない場合も `StageSelectScreen` の fallback Graphics を維持する。

## MVP-076 home UI assets

ホーム画面は `references/ui/home_ui_v3.png.png` を正本参照にする。
MVP-076では、下部ナビと重複する中央ショートカット、右上ハンバーガーメニュー、`次の出撃エリア` 見出し、`永続進行ハブ` テキストを表示しない方針に整理した。

追加アセット:

- `public/assets/ui/home/home_background.png`
- `public/assets/ui/home/sortie_button_frame.png`
- `public/assets/ui/home/info_panel_frame.png`

生成方針:

- 文字、数字、ロゴを画像に焼き込まない。
- UI文言はPixiJS Textで描画する。
- 暗色研究施設、DNA発光、シアン / アンバー / 赤警告を基調にする。
- スマホ縦画面で文字可読性を邪魔しない暗さにする。
- アセット未読込時はGraphics fallbackで起動可能にする。

登録:

- `src/data/asset_manifest.js` の `ASSET_KEYS.homeUi`
- `ASSET_MANIFEST.homeUi`

## MVP-077 home / common navigation UI assets

ホーム画面は `references/ui/home_ui_v3.png.png` を最重要参照として、永続進行ハブに再整理する。

追加アセット:

- `public/assets/ui/home/evolution_zero_logo.png`
- `public/assets/ui/home/resource_panel.png`
- `public/assets/ui/home/unlock_status_panel.png`
- `public/assets/ui/home/record_panel.png`
- `public/assets/ui/home/daily_mission_panel.png`

共通下部ナビ追加アセット:

- `public/assets/ui/common/bottom_nav_background.png`
- `public/assets/ui/common/nav_button_idle.png`
- `public/assets/ui/common/nav_button_selected.png`
- `public/assets/ui/common/nav_home_icon.png`
- `public/assets/ui/common/nav_research_icon.png`
- `public/assets/ui/common/nav_codex_icon.png`
- `public/assets/ui/common/nav_settings_icon.png`

運用ルール:

- UIアセットにはホームの表示文言、数値、説明文を焼き込まない。
- 例外として `evolution_zero_logo.png` は `EVOLUTION ZERO` のみを含むロゴアセットとして扱う。
- ホームではステージ名、難易度、出撃条件を表示しない。
- 研究状況の詳細はDNA研究画面へ集約する。
- デイリーミッションはMVP-077では表示のみ。保存形式を破壊しない。
- 下部ナビはアセット読込成功時に `nav_button_selected.png` / `nav_button_idle.png` と各アイコンを使う。
- 下部ナビアセット未読込時は従来のGraphics fallbackを維持する。

登録:

- `src/data/asset_manifest.js` の `ASSET_KEYS.homeUi`
- `src/data/asset_manifest.js` の `ASSET_KEYS.commonUi`
- `ASSET_MANIFEST.homeUi`
- `ASSET_MANIFEST.commonUi`

## MVP-079 home panel regeneration

MVP-079では、ホーム画面のテキスト配置問題を文字位置調整ではなくUIアセット構造側から改善する。ホーム用パネルは外枠中心のデザインに再生成し、内部の細かい装飾枠を減らして実際の配置可能領域を広げる。

再生成アセット:

- `public/assets/ui/home/resource_panel.png`
- `public/assets/ui/home/unlock_status_panel.png`
- `public/assets/ui/home/record_panel.png`
- `public/assets/ui/home/daily_mission_panel.png`

新規アセット:

- `public/assets/ui/home/home_dino_selector.png`
- `public/assets/ui/home/home_dino_switch_left.png`
- `public/assets/ui/home/home_dino_switch_right.png`

運用ルール:

- パネル画像には文字、数値、ラベルを焼き込まない。
- リソース、解放状況、記録、デイリーはコード側テキストを置きやすい広い空白を優先する。
- デイリーミッションは3行表示に戻し、達成時のみ小型の受け取りボタンを表示する。
- ホーム表示恐竜は解放済み恐竜のみ左右切替対象にする。
- 下部ナビアイコンは各ボタン枠の中央へ寄せるため、MVP-078より少し下へ配置する。
- アセット未読込時はGraphics fallbackと透明タップ領域を維持する。

## MVP-080 home-ratio panels and integrated bottom nav

MVP-080では、ホーム画面の実表示比率に合わせてホームUIアセットを再生成する。目的は、文字位置の微調整ではなく、アセット自体の構造をホーム用途向けにして配置ズレを目立たなくすること。

再生成ホームパネル:

- `public/assets/ui/home/resource_panel.png`
- `public/assets/ui/home/unlock_status_panel.png`
- `public/assets/ui/home/record_panel.png`
- `public/assets/ui/home/daily_mission_panel.png`

新規リソースアイコン:

- `public/assets/ui/home/icon_dna_red.png`
- `public/assets/ui/home/icon_research_beaker_blue.png`

新規下部ナビ一体型アセット:

- `public/assets/ui/common/nav_home_idle.png`
- `public/assets/ui/common/nav_home_selected.png`
- `public/assets/ui/common/nav_research_idle.png`
- `public/assets/ui/common/nav_research_selected.png`
- `public/assets/ui/common/nav_codex_idle.png`
- `public/assets/ui/common/nav_codex_selected.png`
- `public/assets/ui/common/nav_settings_idle.png`
- `public/assets/ui/common/nav_settings_selected.png`

運用ルール:

- ホームパネルは外枠中心とし、内部の細かい項目枠は作らない。
- UIアセットには文字、数値、ラベルを焼き込まない。
- 右上リソースは DNA / 研究Pt の2項目に限定する。
- 最高スコアは記録パネル側へ集約する。
- 下部ナビは枠+アイコン一体型を標準とし、旧フレーム+旧アイコンはfallback互換として残す。
- タップ領域は維持し、下部ナビ高さは大きくしない。

## MVP-085 DNA research UI assets

DNA研究画面は `references/ui/dna_research_ui_v2.png` を最重要参照とし、研究施設の中核UIとして再構成する。

追加アセット:

- `public/assets/ui/research/research_background.png`
- `public/assets/ui/research/dna_core_panel.png`
- `public/assets/ui/research/research_category_tab.png`
- `public/assets/ui/research/research_category_tab_selected.png`
- `public/assets/ui/research/research_card_frame.png`
- `public/assets/ui/research/research_card_locked.png`
- `public/assets/ui/research/research_card_completed.png`
- `public/assets/ui/research/research_cost_badge.png`
- `public/assets/ui/research/analysis_convert_panel.png`

運用ルール:

- UIアセットには文字、数値、ラベルを焼き込まない。
- 5カテゴリはコード側のタブ表示で切り替える。
- DNA / 研究Pt / 研究名 / 状態表示はコード側で描画する。
- パネル内部は細分枠を増やしすぎず、テキスト配置領域を広めに取る。
- 未読込時はGraphics fallbackを維持する。
## MVP-085 follow-up: DNA research icons and card width normalization

DNA研究画面では、各カテゴリと研究カードに専用アイコンを使用する。アイコンは文字なし・ロゴなしの透過PNGとし、未読込時はGraphics fallbackを表示する。

追加アイコン:

- `public/assets/ui/research/icons/icon_dna_resource.png`
- `public/assets/ui/research/icons/icon_research_pt.png`
- `public/assets/ui/research/icons/icon_body_enhancement.png`
- `public/assets/ui/research/icons/icon_adaptation_ability.png`
- `public/assets/ui/research/icons/icon_special_mutation.png`
- `public/assets/ui/research/icons/icon_unknown_domain.png`
- `public/assets/ui/research/icons/icon_analysis_conversion.png`
- `public/assets/ui/research/icons/icon_dna_gain.png`
- `public/assets/ui/research/icons/icon_initial_durability.png`
- `public/assets/ui/research/icons/icon_attack_foundation.png`
- `public/assets/ui/research/icons/icon_slash_wave.png`
- `public/assets/ui/research/icons/icon_poison_spore.png`
- `public/assets/ui/research/icons/icon_bone_spike.png`
- `public/assets/ui/research/icons/icon_evolution_branch.png`
- `public/assets/ui/research/icons/icon_unknown_dino_scan.png`
- `public/assets/ui/research/icons/icon_stage_scan.png`

カード幅ルール:

- `research_card_frame.png`
- `research_card_locked.png`
- `research_card_completed.png`
- `analysis_convert_panel.png`

上記4種は画面上の見え幅が揃うようにする。通常カード3種は、透明キャンバス内の外枠描画幅を `analysis_convert_panel.png` と同等比率へ横方向補正済み。コード側では外枠装飾に被らないよう左右安全余白を取り、アイコン・本文・素材バッジを内側に配置する。

## MVP-088 battlefield brightness pass

戦闘背景は世界観よりもプレイ中の視認性を優先する。暗すぎる場合は新規大量生成より先に、既存タイルの後処理で brightness / contrast / color を調整する。

MVP-088では既存4背景を退避し、同一タイルを再後処理した。

- backup: `public/assets/maps/backgrounds/mvp088_originals/`
- summary: `docs/assets/background_brightness_mvp088_summary.json`
- contact sheet: `docs/assets/background_brightness_mvp088_contact_sheet.jpg`

stage別プリセット:

- jungle: brightness 1.28 / contrast 1.04 / color 1.13。暗緑を維持しつつ青緑霧と地面形状を少し見せる。
- volcano: brightness 1.20 / contrast 1.01 / color 1.10。赤茶を少し明るくし、溶岩光は強くしすぎない。
- swamp: brightness 1.48 / contrast 1.02 / color 1.22。暗すぎを改善し、毒性の黄緑/青緑を少し見せる。
- ruins: brightness 1.22 / contrast 1.02 / color 1.10。灰紫を少し明るくし、地形認識を優先する。

PlayScene側では実背景読み込み時の `backgroundLayer.alpha` を 0.94、背景あり時の黒い補助塗りを 0.08 に調整した。fallback時の仮タイル表示は従来通り維持する。

## MVP-089 combat readability pass

背景明度調整後は、敵・EXP・警告・HUDが「何が起きているか」を最短で読ませる基準にする。

- swarm: ラベルなしを維持し、リングだけを軽く強める。通常敵が画面を埋めても主張しすぎないこと。
- ELITE / MUTANT: リングを少し強め、ラベルには暗色の小さな背景を付ける。ラベルは背景と敵スプライトの上で読めることを優先する。
- APEX: 赤リングと外周金リングを通常敵より明確に強くし、APEXラベルにも暗色背景を付ける。
- EXP: glowと輪郭を少し強め、small / medium / large / boss の価値差が小画面で分かるようにする。サイズの極端な拡大は避ける。
- boss warning: 赤黒パネル、金矢印、表示時間を少し強める。警告として読めるが、長く画面を塞ぎすぎない。
- HUD: 背景パネルalphaをわずかに上げ、危険HPは小さな赤黒パネルで独立させる。必殺READYは軽い文字サイズ差と既存リング発光で知らせる。

このパスでは背景再生成・ゲームロジック変更・セーブ形式変更は行わない。

## MVP-086 common confirmation UI assets

DNA研究の身体強化購入では、誤操作防止のため共通確認ダイアログを使用する。アセットに文字は焼き込まず、タイトル、本文、`はい`、`いいえ` はコード側で描画する。

追加アセット:

- `public/assets/ui/common/confirm_dialog_panel.png`
- `public/assets/ui/common/confirm_button_yes.png`
- `public/assets/ui/common/confirm_button_no.png`

運用ルール:

- 購入可能カードを押した時点ではセーブを変更しない。
- `はい` でのみDNA消費と研究段階保存を行う。
- `いいえ` はキャンセル通知のみで保存しない。
- 共通アセットとして、今後の危険操作、素材消費、変換処理にも流用する。
- アセット未読込時はGraphics fallbackで表示する。
## MVP-090 to MVP-094 major UI quality pass

コンテンツ量産前の主要UI高品質化として、HUD、選択UI、ポーズ、図鑑、設定のUIアセット群を追加する。
すべて文字、数値、ロゴを焼き込まず、コード側で表示テキストを管理する。
未読込時はGraphics fallbackを維持し、起動不能にしない。

HUD:

- `public/assets/ui/hud/hud_top_panel.png`
- `public/assets/ui/hud/hp_bar_frame.png`
- `public/assets/ui/hud/exp_bar_frame.png`
- `public/assets/ui/hud/special_button_idle.png`
- `public/assets/ui/hud/special_button_ready.png`
- `public/assets/ui/hud/special_button_pressed.png`
- `public/assets/ui/hud/pause_button_frame.png`
- `public/assets/ui/hud/warning_chip.png`
- `public/assets/ui/hud/evolution_notice_panel.png`

選択UI:

- `public/assets/ui/selection/selection_panel.png`
- `public/assets/ui/selection/choice_card_frame.png`
- `public/assets/ui/selection/choice_card_selected.png`
- `public/assets/ui/selection/choice_card_locked.png`
- `public/assets/ui/selection/reroll_button.png`
- `public/assets/ui/selection/evolution_choice_panel.png`
- `public/assets/ui/selection/evolution_choice_card.png`
- `public/assets/ui/selection/dna_analysis_glow.png`

ポーズ:

- `public/assets/ui/pause/pause_panel.png`
- `public/assets/ui/pause/pause_button_resume.png`
- `public/assets/ui/pause/pause_button_options.png`
- `public/assets/ui/pause/pause_button_end_run.png`
- `public/assets/ui/pause/pause_button_title.png`
- `public/assets/ui/pause/pause_status_panel.png`

図鑑:

- `public/assets/ui/codex/codex_background.png`
- `public/assets/ui/codex/archive_panel.png`
- `public/assets/ui/codex/lineage_card.png`
- `public/assets/ui/codex/branch_node_known.png`
- `public/assets/ui/codex/branch_node_unknown.png`
- `public/assets/ui/codex/adaptation_tag_chip.png`
- `public/assets/ui/codex/discovery_rate_panel.png`

設定:

- `public/assets/ui/options/options_background.png`
- `public/assets/ui/options/options_panel.png`
- `public/assets/ui/options/slider_frame.png`
- `public/assets/ui/options/toggle_on.png`
- `public/assets/ui/options/toggle_off.png`
- `public/assets/ui/options/option_button_frame.png`

運用ルール:

- HUDはプレイ領域を潰さず、敵、EXP、警告、ボスHPの視認性を優先する。
- レベルアップ選択はDNA適応候補、進化選択は分岐候補として扱う。Lv表記は禁止。
- ポーズ画面には下部ナビを表示しない。プレイ中設定から戻ると必ずポーズへ戻る。
- 図鑑は分岐進化 + 適応タグ方式を守り、一本道進化に見せない。
- 設定画面は通常設定のみ下部ナビを表示し、プレイ中設定では非表示にする。
## MVP-095 play HUD mock assets

HUD v2の本格実装前に、確認用モックと仮アセットを追加する。
この時点では実ゲームHUDへ接続しない。

モック画像:

- `docs/mockups/mvp095/play_hud_mock_v1_pre_evolution.png`
- `docs/mockups/mvp095/play_hud_mock_v2_evolved_special.png`
- `docs/mockups/mvp095/play_hud_mock_v3_revised_layout.png`
- `docs/mockups/mvp095/play_hud_mock_v4_bottom_skill_slots.png`
- `docs/mockups/mvp095/play_hud_mock_v5_image2_adopted.png` - 採用モック

仮アセット:

- `public/assets/ui/hud_mock/hud_top_panel_v2.png`
- `public/assets/ui/hud_mock/pause_button_frame_v2.png`
- `public/assets/ui/hud_mock/skill_slot_frame.png`
- `public/assets/ui/hud_mock/special_skill_frame.png`
- `public/assets/ui/hud_mock/virtual_stick_base.png`
- `public/assets/ui/hud_mock/virtual_stick_knob.png`
- `public/assets/ui/hud_mock/special_icon_speed_claw.png`
- `public/assets/ui/hud_mock/special_icon_hunting_trace.png`
- `public/assets/ui/hud_mock/special_icon_attack_roar.png`

方針:

- 進化前は必殺UIを表示しない。
- 進化後のみ右下に必殺UIを追加する。
- 必殺アイコンは進化先ごとに差し替える前提。
- スキルスロットは3枠で、下部に横並び配置する案を確認する。
- 仮想スティックは左下固定、半透明、シアン発光でHUDと統一する。

## MVP-096 Play HUD Asset Policy
- Adopted reference: `docs/mockups/mvp095/play_hud_mock_v5_image2_adopted.png`.
- Runtime HUD assets live under `public/assets/ui/hud/`.
- HUD assets must be text-free. HP/EXP/DNA/score/time/skill labels are drawn in code.
- The red DNA icon is reused from `public/assets/ui/home/icon_dna_red.png`.
- The special button is hidden before evolution. Special button frames and evolution-specific icons are only used when `selectedEvolution` exists.
- Special icons:
  - `public/assets/ui/hud/special_icons/special_speed.png`
  - `public/assets/ui/hud/special_icons/special_hunting.png`
  - `public/assets/ui/hud/special_icons/special_attack.png`
- Virtual stick assets:
  - `public/assets/ui/hud/virtual_stick_base.png`
  - `public/assets/ui/hud/virtual_stick_knob.png`
- Every HUD asset must keep Graphics/Text fallback so play remains possible when an image fails to load.
- MVP-097 generated `public/assets/ui/hud/portrait_frame.png`, but the runtime standard is now the full-width `hud_top_panel.png` portrait bay. The separate portrait frame is optional/unused unless the top panel fallback needs it.
- HUD dinosaur portraits under `public/assets/dinos/portraits/` are cropped from dino select detail hero art, not from card portraits. The final HUD portrait export uses a circular soft-edge alpha mask so the boundary does not fight the generated top HUD frame.
- Runtime text/gauge placement must use the top HUD panel's three inner safe areas: left portrait, center HP/EXP/DNA, and right time/kills/score. HP and EXP frames are centered horizontally inside the center safe area and spaced evenly vertically.
- MVP-097 final HUD icons use a generated 3x3 source sheet at `public/assets/ui/hud/hud_icon_sheet_generated_raw.png`. Runtime icons are split into `public/assets/ui/hud/adapt_icons/` and `public/assets/ui/hud/special_icons/`, with text-free transparent PNGs for adaptation slots and evolution-specific special buttons.
- HUD notification layering keeps evolution notices at the top, boss name/HP underneath with at least 48px of vertical clearance, and normal HUD below/around the play area so labels do not overlap.
- MVP-099 selection surrounding UI uses generated PNG panels/buttons/badges under `public/assets/ui/selection/`; MVP-098 tag card panels remain unchanged and icon-free.
- Pause, codex, and options screens now treat generated PNGs as primary UI assets, with the previous Graphics rendering retained as fallback.
- MVP-100 raises these screens to v2 generated UI assets:
  - Selection: `docs/mockups/mvp100/selection_asset_sheet_v2_raw.png`
  - Pause: `docs/mockups/mvp100/pause_asset_sheet_v2_raw.png`
  - Codex: `docs/mockups/mvp100/codex_asset_sheet_v2_raw.png`
  - Options: `docs/mockups/mvp100/options_asset_sheet_v2_raw.png`
- v2 assets are preferred at runtime; older PNGs remain as secondary fallback and Graphics remains the final fallback.
- MVP-101 simplified the DNA adaptation selection surrounding UI after visual review:
  - `public/assets/ui/selection/selection_background_panel_v3.png`
  - `public/assets/ui/selection/selection_header_panel_v3.png`
  - `public/assets/ui/selection/selection_subtitle_strip_v3.png`
- Selection v3 rule: avoid stacking multiple decorative frames. Use one main backdrop, one slim header, the existing `analysis_warning_chip.png`, approved adaptation cards, and the existing reroll button. Do not show a footer frame behind reroll because it creates a double-frame look.
- MVP-101 micro-adjustment: the selection backdrop is displayed nearly full width and runtime elements must stay within the inner safe area. Reroll now uses green variants (`reroll_button_green_idle/disabled/pressed.png`) to reduce visual competition with adaptation cards.
- MVP-102 pause UI generated a pause-specific v3 sheet at `docs/mockups/mvp102/pause_asset_sheet_v3_raw.png`. Runtime prefers `public/assets/ui/pause/*_v3.png` for the central panel, resume/options/end/title buttons, status panel, and warning chip. Older v2/v1 assets remain fallback.
- MVP-102c generated pause v4 button/status assets at `docs/mockups/mvp102c/pause_asset_sheet_v4_raw.png`. Runtime uses v4 button frames first, with separate left icons and a dedicated three-slot current adaptation panel. The adopted color policy is: resume emphasized, other actions dark/neutral, dangerous actions only thin red warning accents.

## MVP-103: 恐竜ごとの分岐進化図鑑
- 図鑑UIはラプトル固定ではなく、対象恐竜を選択してその恐竜の分岐進化を確認する構成にする。
- `codex_branch_card_known_v3.png` / `codex_branch_card_unknown_v3.png` / `codex_origin_card_v3.png` は汎用カードとして生成し、カード内に特定恐竜のシルエットを焼き込まない。
- 恐竜画像はコード側でカード上へ重ねる。解放済み分岐は進化先画像、未解放分岐は `codex_unknown_dino_silhouette.png` を使う。
- 進化先の図鑑用画像は `public/assets/dinos/evolutions/<dino>_<branch>_codex.png` を優先する。初期想定は `velociraptor_speed_codex.png` / `velociraptor_hunting_codex.png` / `velociraptor_attack_codex.png`。
- 進化先の図鑑用画像が未配置の場合は、近接HUD portraitではなく原種detail heroへfallbackし、カード上で切れて見える表示を避ける。
- `codex_selected_dino_panel_v3.png` と `codex_dino_selector_card_v3.png` は恐竜選択用の汎用UIとして扱い、将来4体目以降が増えても再利用できるようにする。
- 分岐表示はスマホ操作性を優先してカード一覧を維持しつつ、左側の接続ライン/ノードで原種から複数分岐していることを補う。
- 禁止: 恐竜Lv表記、段階進化に見える縦一本道、カード内への文字焼き込み、特定恐竜専用シルエット入りカード。

## MVP-104: 設定画面v3アセット
- 生成元: `docs/mockups/mvp104/options_asset_sheet_v3_raw.png`
- 出力先: `public/assets/ui/options/`
- 追加アセット:
  - `options_panel_v3.png`
  - `option_row_panel_wide_v3.png`
  - `option_section_panel_v3.png`
  - `slider_frame_v3.png`
  - `slider_knob_v3.png`
  - `mute_toggle_on.png`
  - `mute_toggle_off.png`
  - `mute_toggle_disabled.png`
  - `option_button_frame_v3.png`
  - `dev_button_frame_v3.png`
  - `option_chip_cyan_v3.png`
  - `option_chip_amber_v3.png`
- ミュートはボタンではなくトグルスイッチ型アセットを標準にする。
- 設定行は外枠中心のパネルを使い、テキストとトグルは安全領域内へコード側で重ねる。
- 演出/操作/表示は「準備中」表示を使わず、保存可能な切替UIとして表示する。
- チップ文言は状態が分かる表記を標準にする。長文化するため、演出/操作/表示チップは2段グリッドで安全領域内へ収める。
- 反映済み設定: 揺れ、発光、ダメージ数字、簡易表示、スティック表示、タップ補助、ガイド、高視認性、暗幕、HUDサイズ。

## MVP-105: 共通確認ダイアログv2
- 生成元: `docs/mockups/mvp105/confirm_dialog_asset_sheet_v2_raw.png`
- 出力先: `public/assets/ui/common/`
- 追加アセット:
  - `confirm_dialog_panel_v2.png`
  - `confirm_button_yes_v2.png`
  - `confirm_button_no_v2.png`
  - `confirm_warning_chip_v2.png`
  - `confirm_cost_badge_v2.png`
- 確認ダイアログは共通UIとして扱い、研究画面だけに依存した文字やアイコンを画像に焼き込まない。
- v2未読込時はMVP-086の旧確認UIアセットへfallbackし、それも失敗した場合のみGraphics描画へfallbackする。
- 研究購入ではタイトルチップ、本文、コストバッジ、はい/いいえボタンをそれぞれ安全領域内へコード側で配置する。

## MVP-106: Triceratops / Tyrannosaurus player asset completion
- Generated raw sources:
  - `docs/assets/generated_raw/triceratops_sheet_mvp106_raw.png`
  - `docs/assets/generated_raw/tyrannosaurus_sheet_mvp106_raw.png`
  - `docs/assets/generated_raw/triceratops_hero_mvp106_raw.png`
  - `docs/assets/generated_raw/tyrannosaurus_hero_mvp106_raw.png`
- Runtime sprite sheets:
  - `public/assets/dinos/triceratops_sheet.png`
  - `public/assets/dinos/tyrannosaurus_sheet.png`
- Postprocess reports:
  - `docs/assets/triceratops_sheet_mvp106_report.json`
  - `docs/assets/tyrannosaurus_sheet_mvp106_report.json`
- Still fallbacks:
  - `public/assets/dinos/triceratops.png`
  - `public/assets/dinos/tyrannosaurus.png`
- Shared hero art:
  - `public/assets/dinos/dino_select/triceratops_hero.png`
  - `public/assets/dinos/dino_select/tyrannosaurus_hero.png`
- Shared portrait art:
  - `public/assets/dinos/dino_select/velociraptor_portrait.png`
  - `public/assets/dinos/dino_select/triceratops_portrait.png`
  - `public/assets/dinos/dino_select/tyrannosaurus_portrait.png`
  - `public/assets/dinos/portraits/triceratops.png`
  - `public/assets/dinos/portraits/tyrannosaurus.png`
- Sprite sheet standard remains 4x4, 256px cells, right-facing, text-free, shadow-free, with rows for idle / move / attack / death.
- Hero images are the shared master for dino select detail, home favorite display, codex cards, and future result UI. Do not generate separate one-off codex/home hero images unless a layout genuinely requires a derived crop.
- Portrait images are derived from the shared hero with explicit transparent safe margins. HUD portraits keep extra edge padding for circular and framed display so faces do not appear clipped.
- Runtime UI must display hero/portrait art with aspect-preserving contain scaling. Do not set width and height independently in a way that distorts the dinosaur image.
- If a sheet fails to load, the runtime falls back to the still first-frame PNG and then to the existing Graphics fallback path.

## MVP-107: Normal attack effect and icon asset plan

- MVP-107 is a specification and preparation phase. It does not generate or connect the final normal attack effect assets yet.
- Planned normal attack effects:
  - `public/assets/effects/normal_attacks/raptor_claw_slash.png`
  - `public/assets/effects/normal_attacks/triceratops_horn_impact.png`
  - `public/assets/effects/normal_attacks/tyrannosaurus_bite_shock.png`
- Planned normal attack icons:
  - `public/assets/ui/skills/normal_attack/icon_raptor_claw.png`
  - `public/assets/ui/skills/normal_attack/icon_triceratops_horn.png`
  - `public/assets/ui/skills/normal_attack/icon_trex_bite.png`
- Effects should be transparent PNGs, text-free, short-lived, readable on all four battlefield backgrounds, and rotatable or mirrorable by code.
- Icons should prioritize small-size readability and match the HUD / DNA research UI tone.
- Final generation and `asset_manifest.js` registration are planned for MVP-108 when normal attack execution becomes data-driven.

## MVP-108: Normal attack effect and icon assets

- Generated raw sheets:
  - `docs/assets/generated_raw/normal_attack_effects_mvp108_raw.png`
  - `docs/assets/generated_raw/normal_attack_icons_mvp108_raw.png`
- Runtime normal attack effects:
  - `public/assets/effects/attacks/raptor_claw_slash.png`
  - `public/assets/effects/attacks/triceratops_horn_impact.png`
  - `public/assets/effects/attacks/tyrannosaurus_bite_shock.png`
- Runtime normal attack icons:
  - `public/assets/ui/skills/icon_raptor_claw.png`
  - `public/assets/ui/skills/icon_triceratops_horn.png`
  - `public/assets/ui/skills/icon_trex_bite.png`
- Effects are text-free chroma-key processed PNGs and are rotated by `CombatSystem` toward the current attack direction.
- If an effect is not loaded, `CombatSystem` uses a per-attack Graphics fallback so combat remains playable.
- Icons are registered in `asset_manifest.js` for future skill explanation, codex, and debug surfaces. MVP-108 does not force them into the HUD.

## MVP-109: Adaptation tag and tagless upgrade assets

- Generated raw sheets:
  - `docs/assets/generated_raw/adaptation_none_card_mvp109_raw.png`
  - `docs/assets/generated_raw/adaptation_tag_icons_mvp109_raw.png`
- Runtime tagless selection cards:
  - `public/assets/ui/selection/adaptation_card_none_panel.png`
  - `public/assets/ui/selection/adaptation_card_none_panel_selected.png`
- Runtime adaptation tag icons:
  - `public/assets/ui/adaptations/icon_adapt_speed.png`
  - `public/assets/ui/adaptations/icon_adapt_hunting.png`
  - `public/assets/ui/adaptations/icon_adapt_attack.png`
  - `public/assets/ui/adaptations/icon_adapt_none.png`
- Tagless cards are gray and text-free. They are used for status-up, pickup range,
  DNA gain, EXP support, and other choices that do not occupy skill slots.
- Adaptation tag icons are overlaid by code, not baked into cards. This keeps
  card panels reusable and avoids double icons.
- Future adaptation skill effects should be generated under
  `public/assets/effects/adaptation_skills/` as transparent, text-free PNGs.
- Future adaptation skill icons should be registered separately from normal
  attack icons so UI can distinguish base attacks from additional skills.

## MVP-110: Adaptation skill effect and icon assets

- Generated raw sheets:
  - `docs/assets/generated_raw/adaptation_skill_effects_mvp110_raw.png`
  - `docs/assets/generated_raw/adaptation_skill_icons_mvp110_raw.png`
- Runtime adaptation skill effects:
  - `public/assets/effects/adaptation_skills/afterimage_claw.png`
  - `public/assets/effects/adaptation_skills/accel_blades.png`
  - `public/assets/effects/adaptation_skills/tracking_fang.png`
  - `public/assets/effects/adaptation_skills/predator_mark.png`
  - `public/assets/effects/adaptation_skills/shock_roar.png`
  - `public/assets/effects/adaptation_skills/flame_breath.png`
- Runtime adaptation skill icons:
  - `public/assets/ui/skills/icon_afterimage_claw.png`
  - `public/assets/ui/skills/icon_accel_blades.png`
  - `public/assets/ui/skills/icon_tracking_fang.png`
  - `public/assets/ui/skills/icon_predator_mark.png`
  - `public/assets/ui/skills/icon_shock_roar.png`
  - `public/assets/ui/skills/icon_flame_breath.png`
- MVP-110 uses the initial three effects in combat and registers all six icons/effects for future research-gated skill work.
- If a runtime effect is missing, combat falls back to existing Graphics effects so play remains functional.

## MVP-111: Adaptation skill runtime usage

- The six MVP-110 effect and icon assets are now used by periodic auto adaptation skills.
- Initial runtime skills:
  - `afterimage_claw.png`
  - `tracking_fang.png`
  - `shock_roar.png`
- Research-gated runtime skills:
  - `accel_blades.png`
  - `predator_mark.png`
  - `flame_breath.png`
- The effects remain short-lived and text-free. They should read clearly over battle backgrounds without filling the play area.
- Missing textures must continue to fall back to Graphics effects.
- Debug flags for visual QA:
  - `?debugResearchUnlock=1`
  - `?debugAdaptationSkills=1`

## MVP-112: Homing fang projectile pass

- `tracking_fang.png` is reused as the visible projectile texture for `追尾牙`.
- The same effect asset is also reused for a short hit flash.
- If a dedicated projectile sheet is generated later, use these names:
  - `public/assets/effects/adaptation_skills/tracking_fang_projectile.png`
  - `public/assets/effects/adaptation_skills/tracking_fang_hit.png`
  - `public/assets/effects/adaptation_skills/tracking_fang_trail.png`
- Projectile assets must remain text-free, transparent, readable at small size, and not overly bright.
- Fallback uses a small amber Graphics fang so play remains functional if the texture is missing.

## MVP-113: Adaptation balance and research point loop

- No new visual assets were required.
- Existing adaptation effects are reused with more restrained cooldowns and less perfect auto-aim.
- Speed and attack effects should be authored as direction/area visuals rather than perfect target-seeking visuals.
- Hunting effects may keep tracking or marking visuals, but projectile speed and simultaneous count should stay controlled.
- Result and daily UI text now surface researchPt rewards using existing panels and text rendering.

## MVP-114: Tagless boost card and icon pass

- Runtime tagless selection cards:
  - `public/assets/ui/selection/adaptation_card_none_panel_v2.png`
  - `public/assets/ui/selection/adaptation_card_none_panel_selected_v2.png`
- The v2 tagless cards remain gray/silver, but add white/cyan glow so they read as selectable generic boost cards rather than locked cards.
- Runtime tagless boost icons:
  - `public/assets/ui/skills/icon_boost_hp.png`
  - `public/assets/ui/skills/icon_boost_move_speed.png`
  - `public/assets/ui/skills/icon_boost_attack_rate.png`
  - `public/assets/ui/skills/icon_boost_attack_range.png`
  - `public/assets/ui/skills/icon_boost_pickup_range.png`
  - `public/assets/ui/skills/icon_boost_dna_gain.png`
  - `public/assets/ui/skills/icon_boost_exp_sense.png`
- These icons are text-free PNGs and are overlaid by code on tagless cards.
- Adaptation ability research cards now use existing DNA and researchPt icons for costs instead of text-only `D/P` abbreviations.
- Fallback remains: if v2 tagless card/icon assets fail, the UI falls back to older none card and generic none adaptation icon.
## MVP-114: Expanded adaptation skills and research assets

- New initial adaptation skill effects:
  - `public/assets/effects/adaptation_skills/gale_blade.png`
  - `public/assets/effects/adaptation_skills/sense_spike.png`
  - `public/assets/effects/adaptation_skills/burst_fang.png`
- New initial adaptation skill icons:
  - `public/assets/ui/skills/icon_gale_blade.png`
  - `public/assets/ui/skills/icon_sense_spike.png`
  - `public/assets/ui/skills/icon_burst_fang.png`
- Research unlock cards should prefer dedicated skill icons over generic adaptation icons.
- Body enhancement expansion uses existing research icon fallbacks and does not require researchPt icons beyond the existing DNA/researchPt resource icons.

## MVP-115: Research Conversion and Skill Display Rules

- Body enhancement research cards use a scroll/list interaction when the item count exceeds the mobile card viewport. Page arrow assets are not required for this category.
- Analysis conversion cards are active common research UI: show DNA icon/value, researchPt gain, and route execution through the shared confirm dialog.
- Analysis conversion copy is `余剰DNAを研究Ptへ変換する`; no `準備中` placeholder remains.
- HUD and pause skill slots use skill-specific icons for all nine adaptation skills. Generic adaptation icons are fallback only.
- Pause screen skill summary mirrors the HUD skill slot contents: icon, short skill label, and strengthening stage.
- Debug skill grants are limited to `?debugAdaptationSkills=1`; normal play must not start with test skills populated.

## MVP-116: Adaptation Skill Variety Pass

- Adaptation skills should not all share the same frontal attack silhouette.
- `gale_blade` keeps its existing icon/effect but now represents spread/side-crossing speed blades.
- `sense_spike` keeps its existing icon/effect but now represents short-lived detection traps around the player.
- `burst_fang` keeps its existing icon/effect but now represents delayed explosive fangs.
- If later visual polish is needed, regenerate these three effects with the same text-free transparent PNG rules.
- Options UI keeps the play-settings section below the mute row with visible safety spacing.

## MVP-117: Adaptation Skill Effect Refresh

- Generated and connected dedicated behavior-specific VFX:
  - `public/assets/effects/adaptation_skills/gale_blade_spread.png`
  - `public/assets/effects/adaptation_skills/sense_spike_trap.png`
  - `public/assets/effects/adaptation_skills/sense_spike_trigger.png`
  - `public/assets/effects/adaptation_skills/burst_fang_mine.png`
  - `public/assets/effects/adaptation_skills/burst_fang_explosion.png`
- `gale_blade` now prefers the spread-blade asset so the skill reads as left/right or diagonal speed paths.
- `sense_spike` now uses a placed trap texture and a separate trigger flare texture.
- `burst_fang` now uses a planted mine texture and a separate explosion texture.
- MVP-114 single-effect textures remain fallback. If all textures fail, CombatSystem still draws Graphics fallback effects.
- Existing dedicated skill icons remain in use because they are already registered and skill-specific.
- Follow-up: regenerated the three visible skill icons in place so HUD slots and level-up cards no longer use simplified line icons:
  - `public/assets/ui/skills/icon_gale_blade.png`
  - `public/assets/ui/skills/icon_sense_spike.png`
  - `public/assets/ui/skills/icon_burst_fang.png`

### MVP-117 Follow-up: Tempo and Card Placement

- No new art was required for the tempo adjustment.
- Existing MVP-117 trap/mine assets are now used for lingering field objects:
  - `sense_spike_trap.png` remains briefly on the ground before triggering.
  - `burst_fang_mine.png` remains as a mine and can detonate by contact or timer.
- Tagless boost icons keep their existing individual icon assets, but their card placement is centered against the none-card circular frame separately from tagged adaptation cards.

## MVP-118: Result UI Asset Pass

- Generated and connected result screen UI assets:
  - `public/assets/ui/result/result_background.png`
  - `public/assets/ui/result/result_panel.png`
  - `public/assets/ui/result/result_header_clear.png`
  - `public/assets/ui/result/result_header_gameover.png`
  - `public/assets/ui/result/result_score_panel.png`
  - `public/assets/ui/result/result_reward_panel.png`
  - `public/assets/ui/result/result_stat_card.png`
  - `public/assets/ui/result/result_button_retry.png`
  - `public/assets/ui/result/result_button_home.png`
  - `public/assets/ui/result/result_reward_chip.png`
  - `public/assets/ui/result/result_title_reward_frame.png`
- Assets are text-free. Result labels, values, and button text are drawn in code.
- Result screen uses the generated panel assets first and keeps the previous Graphics-based panel/button style as fallback.
- The result reward area now has safe slots for DNA, researchPt, first-clear rewards, ZERO rewards, title rewards, and future evolution-route discoveries.

## MVP-118b: Result UI Layout Revision

- No new bitmap assets were required; the MVP-118 result assets were reused with adjusted alpha and layout rules.
- `result_background.png` is treated as a low-emphasis atmosphere layer, and `result_panel.png` is the only primary result frame.
- Internal cards should remain sparse: major stats, DNA / first-clear / title / evolution discovery rewards, acquired skill icons, optional first-clear reward details, and best records.
- ResearchPt is no longer shown or granted from normal run results. The resource remains tied to daily missions, analysis conversion, and future explicitly special rewards.
- Acquired adaptation skills in the result screen use the same skill-specific icon keys as HUD slots. If an icon fails to load, the text and slot frame remain visible as fallback.
- `ZERO解析` is deprecated as a display label. ZERO rewards should be surfaced as `ZERO初回`, title rewards, or new evolution route discovery.

### MVP-118b Follow-up: Pause-to-Result Alignment

- The result main panel reuses the generated pause panel asset at the exact pause-screen rect (`x=10`, `y=72`, `width=screenWidth-20`, `height=screenHeight-86`). Do not use the pause fallback Graphics rect as the result alignment target.
- Internal result panels are centered within a 24px horizontal safe inset from the main panel. Text and icons are placed inside each panel's own safe area instead of against the generated border art.
- Result skill icons are loaded from the same skill-specific PNGs used by HUD slots and re-render after asynchronous texture loading. Graphics line icons are fallback only.
- Generated Sprite panels must not receive direct scale-based intro motion after their explicit `width` and `height` are set. That overwrites PixiJS scale and can make reused panel PNGs appear enlarged compared with the pause screen.
- Result panel contents should be grouped and centered within each panel's safe rectangle: statistics as a 3x2 grid, rewards as a 4-column grid, acquired skills as a 3-slot row, and best records as a 2-column grid.
- Result UI aligns visible alpha bounds for asymmetric assets such as `result_score_panel.png`, `result_reward_panel.png`, `result_header_*`, and result buttons. Full PNG rectangles are not reliable alignment boxes when one side has extra transparent padding.
- Result UI stat rows need extra vertical safe spacing; keep the two label/value rows separated and center retry/home buttons from the shared panel center instead of using hand-tuned fixed X offsets.
- Result state selection should use `gameState.runResult` when available. Boss-defeat stage clear should set `type: 'clear'` with `reason: 'boss'`, while pause end / HP0 should stay `type: 'gameover'`. Do not rely on `defeatedBosses` alone for future stage-clear logic.

## MVP-119: Evolution / ZERO / Reward Asset Planning

- MVP-119 is a specification pass. Do not mass-generate evolution assets until the branch list and reward flow are approved.
- Evolution branch hero art should use shared master images:
  - `public/assets/dinos/evolutions/heroes/<dino>_<branch>_hero.png`
  - `public/assets/dinos/evolutions/portraits/<dino>_<branch>_portrait.png`
- The same front-facing hero source should feed dino detail, codex cards, home favorite display, result rewards, and HUD portrait crops.
- Do not bake dinosaur silhouettes into codex/result cards. Cards stay generic; dinosaur/evolution art is overlaid by code.
- Branch-specific ultimate assets should be generated per evolution route:
  - `public/assets/ui/hud/special_icons/<dino>_<branch>.png`
  - `public/assets/effects/ultimates/<dino>_<branch>_ultimate.png`
- ZERO reward routes require special, rare visual treatment:
  - black / red warning / white DNA fracture / restrained gold accents
  - shown as `新規進化ルート発見`, title rewards, or title frames
  - do not use the old ambiguous `ZERO解析` label
- ZERO difficulty is unlocked by stage difficulty progression, not research. Any ZERO research art should read as environmental prediction or support analysis, never as the ZERO gate.
- Stage reward/title assets should be planned separately:
  - normal title frame
  - deluxe ZERO title frame
  - first-clear reward chip
  - new evolution route discovery chip
- Future stage/boss assets should follow the stage-difficulty spec: stage-specific enemies, stage-specific bosses, and ZERO multi-boss escalation.

## MVP-120 Generated Velociraptor Evolution Assets

- Heroes:
  - `public/assets/dinos/evolutions/heroes/velociraptor_speed_hero.png`
  - `public/assets/dinos/evolutions/heroes/velociraptor_hunting_hero.png`
  - `public/assets/dinos/evolutions/heroes/velociraptor_attack_hero.png`
- Portraits:
  - `public/assets/dinos/evolutions/portraits/velociraptor_speed_portrait.png`
  - `public/assets/dinos/evolutions/portraits/velociraptor_hunting_portrait.png`
  - `public/assets/dinos/evolutions/portraits/velociraptor_attack_portrait.png`
- Special icons:
  - `public/assets/ui/hud/special_icons/special_speed_raptor.png`
  - `public/assets/ui/hud/special_icons/special_hunting_raptor.png`
  - `public/assets/ui/hud/special_icons/special_attack_raptor.png`
- ZERO unknown:
  - `public/assets/dinos/evolutions/zero_unknown_silhouette.png`
- These are transparent PNGs produced from image generation plus chroma-key postprocess. Keep Graphics fallback and generic special-icon fallback active.

## MVP-121 Evolution Discovery Save Data

- `src/data/evolution_data.js` defines branch ids, shared asset paths, ZERO unknown metadata, and save normalization helpers.
- Save data now stores `discoveredEvolutions` as an object keyed by branch id; legacy arrays remain readable.
- Home favorites may store `currentHomeEvolutionId`; this is optional and defaults to null for old saves.
- Asset fallback remains unchanged: missing evolution hero/portrait assets should fall back to existing silhouettes or base dinosaur art.

## MVP-122 Evolution Presentation Assets

- MVP-122 uses the existing generated evolution portraits for the short evolution presentation:
  - `assets/dinos/evolutions/portraits/velociraptor_speed_portrait.png`
  - `assets/dinos/evolutions/portraits/velociraptor_hunting_portrait.png`
  - `assets/dinos/evolutions/portraits/velociraptor_attack_portrait.png`
- Dedicated `public/assets/ui/evolution/` presentation panels remain optional for a later polish pass.
- Graphics fallback remains active: DNA lines, dark overlay, branch panel, and codex update chip are rendered in Pixi when no dedicated panel asset is present.

## MVP-123 Evolution Presentation UI Assets

- Dedicated evolution presentation assets were generated and connected under `public/assets/ui/evolution/`:
  - `evolution_panel.png`
  - `evolution_name_plate.png`
  - `evolution_portrait_frame.png`
  - `evolution_dna_ring.png`
  - `codex_update_chip.png`
  - `new_evolution_chip.png`
  - `evolution_flash_speed.png`
  - `evolution_flash_hunting.png`
  - `evolution_flash_attack.png`
- All assets are text-free PNGs. Runtime text is rendered by Pixi so localization and layout can remain code-controlled.
- The flash assets are tag-specific overlays: speed cyan, hunting amber, attack red-orange.
- The panel / plate / portrait frame / DNA ring should be treated as presentation-only assets, not general HUD widgets.
- If any asset is missing, `EvolutionSequence` must keep the Graphics fallback for the missing layer only instead of failing the entire presentation.
- Future evolution branches should reuse the same panel and chip assets, adding only branch-specific portrait / hero / flash art when needed.

## MVP-124 Velociraptor Evolution Sprite Sheets

- Generated and postprocessed 4x4 evolution player sprite sheets:
  - `public/assets/dinos/evolutions/sheets/velociraptor_speed_sheet.png`
  - `public/assets/dinos/evolutions/sheets/velociraptor_hunting_sheet.png`
  - `public/assets/dinos/evolutions/sheets/velociraptor_attack_sheet.png`
- Raw generated sheets are archived in `docs/assets/generated_raw/`:
  - `velociraptor_speed_sheet_mvp124_raw.png`
  - `velociraptor_hunting_sheet_mvp124_raw.png`
  - `velociraptor_attack_sheet_mvp124_raw.png`
- Postprocess reports:
  - `docs/assets/velociraptor_speed_sheet_mvp124_report.json`
  - `docs/assets/velociraptor_hunting_sheet_mvp124_report.json`
  - `docs/assets/velociraptor_attack_sheet_mvp124_report.json`
- All three sheets use the existing player sprite-sheet layout: 4 rows x 4 columns, 256px cells, row 1 idle, row 2 run, row 3 attack, row 4 death.
- Runtime fallback is the base velociraptor sheet. Missing evolution sheets must never hide the player.

## MVP-124b Base / Evolution Front Art Refresh

- Refreshed base front-facing shared hero / portrait art:
  - `public/assets/dinos/dino_select/triceratops_hero.png`
  - `public/assets/dinos/dino_select/triceratops_portrait.png`
  - `public/assets/dinos/portraits/triceratops.png`
  - `public/assets/dinos/dino_select/tyrannosaurus_hero.png`
  - `public/assets/dinos/dino_select/tyrannosaurus_portrait.png`
  - `public/assets/dinos/portraits/tyrannosaurus.png`
- Refreshed velociraptor evolution front-facing shared hero / portrait art:
  - `public/assets/dinos/evolutions/heroes/velociraptor_speed_hero.png`
  - `public/assets/dinos/evolutions/heroes/velociraptor_hunting_hero.png`
  - `public/assets/dinos/evolutions/heroes/velociraptor_attack_hero.png`
  - `public/assets/dinos/evolutions/portraits/velociraptor_speed_portrait.png`
  - `public/assets/dinos/evolutions/portraits/velociraptor_hunting_portrait.png`
  - `public/assets/dinos/evolutions/portraits/velociraptor_attack_portrait.png`
- Raw generated hero masters are archived in `docs/assets/generated_raw/` with `*_hero_mvp124b_raw.png` names.
- Art placement rule: use aspect-preserving contain scaling and crop only through derived portrait canvases. UI code should not stretch or mask these master hero images in a way that cuts off faces.

## MVP-125 Velociraptor Special Effects

- Generated and connected branch special effect assets:
  - `public/assets/effects/specials/special_speed_slash.png`
  - `public/assets/effects/specials/special_hunting_swarm.png`
  - `public/assets/effects/specials/special_attack_burst.png`
- Raw generated sources are archived as:
  - `docs/assets/generated_raw/special_speed_slash_mvp125_raw.png`
  - `docs/assets/generated_raw/special_hunting_swarm_mvp125_raw.png`
  - `docs/assets/generated_raw/special_attack_burst_mvp125_raw.png`
- Chroma-key postprocess removes the `#ff00ff` background and keeps text-free transparent PNGs for runtime use.
- The files are registered under `ASSET_KEYS.specialEffects` and are used by `UltimateSystem`.
- Graphics fallback remains mandatory for each branch special so missing assets do not block play.

## MVP-126 Special Effect Tuning

- No new bitmap assets are required for MVP-126; the MVP-125 special effect PNGs remain the source assets.
- Runtime tuning adjusts scale, alpha, pulse count, duration, and boss damage multipliers in code.
- The fallback renderer now treats hunting pursuit effects as a directional strike rather than a ring so missing textures do not create invalid radius rendering.
- Future branches should keep this split:
  - bitmap assets define branch identity and polish
  - code tuning defines combat balance, gauge tempo, boss multiplier, and screen readability

## MVP-127 Triceratops Evolution Asset Set

- Heroes:
  - `public/assets/dinos/evolutions/heroes/triceratops_speed_hero.png`
  - `public/assets/dinos/evolutions/heroes/triceratops_hunting_hero.png`
  - `public/assets/dinos/evolutions/heroes/triceratops_attack_hero.png`
- Portraits:
  - `public/assets/dinos/evolutions/portraits/triceratops_speed_portrait.png`
  - `public/assets/dinos/evolutions/portraits/triceratops_hunting_portrait.png`
  - `public/assets/dinos/evolutions/portraits/triceratops_attack_portrait.png`
- Sprite sheets:
  - `public/assets/dinos/evolutions/sheets/triceratops_speed_sheet.png`
  - `public/assets/dinos/evolutions/sheets/triceratops_hunting_sheet.png`
  - `public/assets/dinos/evolutions/sheets/triceratops_attack_sheet.png`
- Postprocess reports:
  - `docs/assets/triceratops_speed_sheet_mvp127_report.json`
  - `docs/assets/seravel_speed_sheet_fix_report.json` (RC fix: rebuilt セラヴェル move/attack rows from clean cells to remove cross-cell cyan streaks and neighboring body fragments; `frameEdgeIssues: 0`)
  - `docs/assets/triceratops_hunting_sheet_mvp127_report.json`
  - `docs/assets/triceratops_attack_sheet_mvp127_report.json`
- Special icons:
  - `public/assets/ui/hud/special_icons/special_speed_triceratops.png`
  - `public/assets/ui/hud/special_icons/special_hunting_triceratops.png`
  - `public/assets/ui/hud/special_icons/special_attack_triceratops.png`
- Special effects:
  - `public/assets/effects/specials/special_triceratops_speed_charge.png`
  - `public/assets/effects/specials/special_triceratops_hunting_bastion.png`
  - `public/assets/effects/specials/special_triceratops_attack_quake.png`

## MVP-128 Tyrannosaurus Evolution Asset Set

- Heroes:
  - `public/assets/dinos/evolutions/heroes/tyrannosaurus_speed_hero.png`
  - `public/assets/dinos/evolutions/heroes/tyrannosaurus_hunting_hero.png`
  - `public/assets/dinos/evolutions/heroes/tyrannosaurus_attack_hero.png`
- Portraits:
  - `public/assets/dinos/evolutions/portraits/tyrannosaurus_speed_portrait.png`
  - `public/assets/dinos/evolutions/portraits/tyrannosaurus_hunting_portrait.png`
  - `public/assets/dinos/evolutions/portraits/tyrannosaurus_attack_portrait.png`
- Sprite sheets:
  - `public/assets/dinos/evolutions/sheets/tyrannosaurus_speed_sheet.png`
  - `public/assets/dinos/evolutions/sheets/tyrannosaurus_hunting_sheet.png`
  - `public/assets/dinos/evolutions/sheets/tyrannosaurus_attack_sheet.png`
- Postprocess reports:
  - `docs/assets/tyrannosaurus_speed_sheet_mvp128_report.json`
  - `docs/assets/tyrannosaurus_hunting_sheet_mvp128_report.json`
  - `docs/assets/tyrannosaurus_attack_sheet_mvp128_report.json`
- Special icons:
  - `public/assets/ui/hud/special_icons/special_speed_tyrannosaurus.png`
  - `public/assets/ui/hud/special_icons/special_hunting_tyrannosaurus.png`
  - `public/assets/ui/hud/special_icons/special_attack_tyrannosaurus.png`
- Special effects:
  - `public/assets/effects/specials/special_tyrannosaurus_speed_pounce.png`
  - `public/assets/effects/specials/special_tyrannosaurus_hunting_terror.png`
  - `public/assets/effects/specials/special_tyrannosaurus_attack_devour.png`

Fallback remains mandatory: if a branch sheet, icon, portrait, or effect fails to load, runtime must continue with base dinosaur visuals or generic branch effects.

## MVP-129 Evolution Asset Identity QA

- Evolution assets must not be accepted as simple tint/color swaps of the base dinosaur.
- QA should check the visible silhouette first: head, jaw, horn/frill, spines, armor, posture, and branch-specific marks must change enough that the branch reads as a different evolved form at mobile HUD size.
- MVP-129 replaced weak triceratops/tyrannosaurus hero and portrait masters with branch-specific generated sources:
  - `public/assets/dinos/evolutions/heroes/triceratops_<branch>_hero.png`
  - `public/assets/dinos/evolutions/portraits/triceratops_<branch>_portrait.png`
  - `public/assets/dinos/evolutions/heroes/tyrannosaurus_<branch>_hero.png`
  - `public/assets/dinos/evolutions/portraits/tyrannosaurus_<branch>_portrait.png`
- MVP-129 replaced dino-specific special icons and effects for triceratops and tyrannosaurus:
  - `public/assets/ui/hud/special_icons/special_<branch>_triceratops.png`
  - `public/assets/ui/hud/special_icons/special_<branch>_tyrannosaurus.png`
  - `public/assets/effects/specials/special_triceratops_*`
  - `public/assets/effects/specials/special_tyrannosaurus_*`
- Tyrannosaurus evolution sheets were regenerated because the previous sheets read too much like branch-colored variants:
  - `public/assets/dinos/evolutions/sheets/tyrannosaurus_speed_sheet.png`
  - `public/assets/dinos/evolutions/sheets/tyrannosaurus_hunting_sheet.png`
  - `public/assets/dinos/evolutions/sheets/tyrannosaurus_attack_sheet.png`
- MVP-129 postprocess reports:
  - `docs/assets/tyrannosaurus_speed_sheet_mvp129_report.json`
  - `docs/assets/tyrannosaurus_hunting_sheet_mvp129_report.json`
  - `docs/assets/tyrannosaurus_attack_sheet_mvp129_report.json`
- Raw/contact QA images are archived under `docs/assets/generated_raw/` so future polishing can compare before/after identity without touching runtime assets.
- Branch-specific assets remain optional at runtime. If one fails to load, keep the existing fallback chain: exact branch asset -> generic branch asset -> base dinosaur -> Graphics fallback.

## MVP-130 Evolution Name And Cropping Follow-up

- `tyrannosaurus_attack` hero/portrait was regenerated because the previous master had enough canvas margin but the art itself looked clipped on the left side.
- Updated runtime assets:
  - `public/assets/dinos/evolutions/heroes/tyrannosaurus_attack_hero.png`
  - `public/assets/dinos/evolutions/portraits/tyrannosaurus_attack_portrait.png`
- Raw source is archived at `docs/assets/generated_raw/tyrannosaurus_attack_hero_mvp130_raw.png`.
- Display names were revised for memorability while preserving stable internal ids. Do not rename asset file ids or `discoveredEvolutions` keys when changing display names.
- Home/codex/HUD/result should show evolution dinosaur names, not adaptation tag labels.

## MVP-130b Evolution Display Name Cleanup

- Evolution display names were revised again to avoid repeated suffix templates and to read as individual species names:
  - `velociraptor_speed` -> `ファルクス`
  - `velociraptor_hunting` -> `ノクスヴェナ`
  - `velociraptor_attack` -> `ヴォルグラム`
  - `triceratops_speed` -> `セラヴェル`
  - `triceratops_hunting` -> `セラノクス`
  - `triceratops_attack` -> `グランボルグ`
  - `tyrannosaurus_speed` -> `レグナクス`
  - `tyrannosaurus_hunting` -> `ヴェナトロス`
  - `tyrannosaurus_attack` -> `レクスヴォルグ`
- Asset filenames and internal ids remain unchanged. Future art replacement should keep the existing id/path convention and only change display text when renaming.
- Home selector QA must use lineage order rather than name order: base dinosaur, speed, hunting, attack for each dino.

## MVP-131 Stage Enemy And Boss Asset Planning

- Do not mass-generate enemy/boss assets before the stage enemy spec is implemented.
- Future stage enemy assets should be generated in stage batches:
  - one common enemy
  - one elite or mutant variant
  - one stage boss
- ZERO second/final boss assets should be generated only after standard stage bosses are playable.
- All enemy and boss sprite sheets follow the existing game asset rules:
  - transparent PNG or `#ff00ff` background for postprocess
  - no baked text, UI, ground, shadow, or logo
  - readable silhouette at mobile scale
  - fallback Graphics behavior preserved
- Stage boss UI assets should reuse the current boss HUD safe-area and warning rules. Boss warning, evolution notice, and upper HUD must not overlap.

## MVP-132 Stage Progress UI Hooks

- MVP-132 adds save-driven difficulty locks and result hooks; no new UI art is required.
- Stage select difficulty button assets are reused. Locked states should rely on existing locked button/fallback visuals plus clear text:
  - HARD: NORMAL clear
  - EXPERT: HARD clear
  - ENDLESS/ZERO: EXPERT clear
- Result UI reuses existing reward/future panels to display first-clear and newly unlocked difficulties.
- Future title/frame reward assets should read `saveInfo.stageResult` and `saveInfo.unlockedDifficulties` rather than recomputing clear state from UI.

## MVP-133 Title Reward Asset Plan

- MVP-133 implements the save and display path for title rewards without adding new image assets.
- Home uses lightweight generated frame drawing for the equipped title until dedicated title-frame PNGs are requested.
- Result UI reuses the existing reward/future panels and receives title/frame metadata from `saveInfo`.
- Future asset candidates:
  - `title_frame_normal.png`
  - `title_frame_hard.png`
  - `title_frame_expert.png`
  - `title_frame_zero_deluxe.png`
  - `result_title_reward_chip.png`
- Title frame art must remain cosmetic and must not imply dinosaur level, permanent rank power, or research progression.

## MVP-134 Stage Gimmick And Pickup Assets

Generated source sheet:

- `docs/assets/generated_raw/mvp134_stage_gimmicks_items_pickups_sheet.png`

Stage gimmick effects:

- `public/assets/effects/stage_gimmicks/volcano_lava_burst.png`
- `public/assets/effects/stage_gimmicks/volcano_fire_floor.png`
- `public/assets/effects/stage_gimmicks/swamp_poison_mist.png`
- `public/assets/effects/stage_gimmicks/swamp_toxic_pool.png`
- `public/assets/effects/stage_gimmicks/ruins_electro_pulse.png`
- `public/assets/effects/stage_gimmicks/ruins_laser_warning.png`

Drop item assets:

- `public/assets/items/item_meat_heal.png`
- `public/assets/items/item_magnet_core.png`
- `public/assets/items/item_dna_cluster.png`

Pickup assets:

- `public/assets/pickups/exp_crystal_small.png`
- `public/assets/pickups/exp_crystal_medium.png`
- `public/assets/pickups/exp_crystal_large.png`

Runtime policy:

- EXP pickups prefer the new crystal assets and fall back to Graphics if loading fails.
- HP recovery meat is connected as a low-frequency drop and uses the same magnet behavior as EXP.
- Magnet core and DNA cluster are asset-ready but remain unconnected until their temporary buff / DNA reward rules are implemented.
- Stage gimmick art is registered for later runtime use; current hazard Graphics remain fallback-safe.

## MVP-135 Stage Gimmick Runtime Use

The MVP-134 gimmick PNGs are now connected to the play scene for `volcano`, `swamp`, and `ruins`.

Runtime mapping:

- `volcano_lava_burst.png`: active lava eruption circle.
- `volcano_fire_floor.png`: lingering fire-floor hazard.
- `swamp_toxic_pool.png`: poison pool with damage and light slow.
- `swamp_poison_mist.png`: poison mist with softer visual alpha and light slow.
- `ruins_electro_pulse.png`: electromagnetic pulse circle with mild knockback.
- `ruins_laser_warning.png`: facility laser lane; warning polygon remains visible before the active line.

Fallback policy:

- Warning telegraphs are drawn with Graphics regardless of asset status.
- If a PNG is unavailable, the active hazard keeps a colored Graphics fill/ring so the hit area remains readable.
- `jungle` intentionally has no runtime gimmick asset use in this pass.

Debug URLs:

- `?debugStage=volcano&debugGimmicks=1&debugGimmickFast=1`
- `?debugStage=swamp&debugGimmicks=1&debugGimmickFast=1`
- `?debugStage=ruins&debugGimmicks=1&debugGimmickFast=1`

## MVP-136 Jungle Boss Asset Policy

MVP-136 connects the jungle boss prototype with existing boss visuals to avoid expanding the asset surface before behavior is approved.

Future dedicated asset candidates:

- `public/assets/enemies/bosses/jungle_boss.png`
- `public/assets/effects/boss/jungle_boss_warning.png`
- `public/assets/effects/boss/jungle_boss_attack_effect.png`

The current runtime must keep the Graphics charge telegraph visible even when future boss assets are absent.

## MVP-137 Jungle Boss Dedicated Assets

Generated source:

- `C:\Users\oushi\.codex\generated_images\019e2f7d-a1e1-7731-8beb-a0158ce5112c\ig_0a826edd58dc23fe016a0c697eb57481918e1543e92aacf94d.png`
- `C:\Users\oushi\.codex\generated_images\019e2f7d-a1e1-7731-8beb-a0158ce5112c\ig_0fa5d0f13a01bef1016a0c6bceee408191bd382821ac2b55dd.png`

Runtime boss assets:

- `public/assets/enemies/bosses/jungle_canopy_devourer_sheet.png`
- `public/assets/enemies/bosses/jungle_canopy_devourer.png`
- `public/assets/enemies/bosses/jungle_canopy_devourer_portrait.png`

Runtime boss effect assets:

- `public/assets/effects/boss/jungle_boss_charge_warning.png`
- `public/assets/effects/boss/jungle_boss_charge_slash.png`
- `public/assets/effects/boss/jungle_boss_roar_wave.png`
- `public/assets/effects/boss/jungle_boss_summon_spore.png`

Postprocess report:

- `docs/assets/jungle_canopy_devourer_sheet_mvp137_report.json`

Fallback policy:

- The animated sheet is preferred for in-play display.
- `jungle_canopy_devourer.png` is the static fallback.
- Boss telegraphs continue to draw Graphics shapes even when generated effect PNGs are unavailable.

## MVP-138 Volcano Enemy And Boss Assets

Generated source images:

- `C:\Users\oushi\.codex\generated_images\019e2f7d-a1e1-7731-8beb-a0158ce5112c\ig_0fa5d0f13a01bef1016a0c710ffcec8191869586bffcfc0062.png`
- `C:\Users\oushi\.codex\generated_images\019e2f7d-a1e1-7731-8beb-a0158ce5112c\ig_0fa5d0f13a01bef1016a0c71735e808191a66503ff138b5abf.png`
- `C:\Users\oushi\.codex\generated_images\019e2f7d-a1e1-7731-8beb-a0158ce5112c\ig_0fa5d0f13a01bef1016a0c722d08448191ba44578f5d266bd7.png`
- `C:\Users\oushi\.codex\generated_images\019e2f7d-a1e1-7731-8beb-a0158ce5112c\ig_0fa5d0f13a01bef1016a0c6ff8a5dc8191aad1f3aa26b69af1.png`
- `C:\Users\oushi\.codex\generated_images\019e2f7d-a1e1-7731-8beb-a0158ce5112c\ig_0fa5d0f13a01bef1016a0c705ddc5c81919da470a906f74da9.png`

Runtime animated enemy assets:

- `public/assets/enemies/volcano/volcano_heavy_sheet.png`
- `public/assets/enemies/volcano/volcano_bomber_sheet.png`
- `public/assets/enemies/volcano/volcano_fast_sheet.png`

Runtime boss assets:

- `public/assets/enemies/bosses/volcano_boss_sheet.png`
- `public/assets/enemies/bosses/volcano_boss.png`
- `public/assets/enemies/bosses/volcano_boss_portrait.png`

Runtime boss effect assets:

- `public/assets/effects/boss/volcano_boss_lava_warning.png`
- `public/assets/effects/boss/volcano_boss_lava_burst.png`
- `public/assets/effects/boss/volcano_boss_fire_floor.png`
- `public/assets/effects/boss/volcano_boss_slam_wave.png`

Postprocess reports:

- `docs/assets/volcano_heavy_sheet_mvp138_report.json`
- `docs/assets/volcano_bomber_sheet_mvp138_report.json`
- `docs/assets/volcano_fast_sheet_mvp138_report.json`
- `docs/assets/volcano_boss_sheet_mvp138_report.json`

Fallback policy:

- Volcano enemies prefer animated 4x4 sheets and fall back to existing enemy sheets if unavailable.
- Volcano boss prefers `volcano_boss_sheet.png` and falls back to `volcano_boss.png`.
- Lava warning/hit areas continue to draw Graphics rings even if boss effect PNGs fail to load.

## MVP-138b Volcano Gimmick Animation And Enemy Display Fix

Cleaned/rebuilt volcano stage-gimmick runtime assets:

- `public/assets/effects/stage_gimmicks/volcano_lava_burst.png`
- `public/assets/effects/stage_gimmicks/volcano_lava_burst_sheet.png`
- `public/assets/effects/stage_gimmicks/volcano_fire_floor.png`
- `public/assets/effects/stage_gimmicks/volcano_fire_floor_sheet.png`

Reports:

- `docs/assets/volcano_lava_burst_sheet_mvp138b_report.json`
- `docs/assets/volcano_fire_floor_sheet_mvp138b_report.json`

Runtime policy:

- Animated 4x4 sheets are preferred for active volcano hazards.
- Static PNGs remain cleaned fallback frames.
- Graphics warning rings remain the fallback readability layer.
- Volcano enemies should use their dedicated animated sheets. Generic enemy fallback is allowed only when the dedicated asset fails to load.
- `debugEnemySet=volcano` and `debugSpawnVolcanoEnemies=1` are QA-only helpers for verifying volcano enemy display.

Follow-up stage fire floor hitbox polish:

- `public/assets/effects/stage_gimmicks/volcano_fire_floor.png`
- `public/assets/effects/stage_gimmicks/volcano_fire_floor_sheet.png`

Report:

- `docs/assets/volcano_fire_floor_16flame_mvp138e_report.json`

Runtime policy:

- Volcano stage fire floor is a 4x4 small-flame hazard, not a single large circular hazard.
- Each small flame has its own hitbox; warning graphics mirror those 16 hitboxes.
- The active sheet uses a pop-in animation so the small flames swell into view before looping.

## MVP-138e Boss Effect Folder Cleanup

Rebuilt jungle and volcano boss effect assets from illustration-generated atlas sources, then removed chroma backgrounds and centered each result in transparent runtime frames. Each static PNG is centered in a 512px transparent canvas, and each runtime effect has a matching animated 4x4 sheet.

Static fallbacks:

- `public/assets/effects/boss/jungle_boss_charge_warning.png`
- `public/assets/effects/boss/jungle_boss_charge_slash.png`
- `public/assets/effects/boss/jungle_boss_roar_wave.png`
- `public/assets/effects/boss/jungle_boss_summon_spore.png`
- `public/assets/effects/boss/volcano_boss_lava_warning.png`
- `public/assets/effects/boss/volcano_boss_lava_burst.png`
- `public/assets/effects/boss/volcano_boss_fire_floor.png`
- `public/assets/effects/boss/volcano_boss_slam_wave.png`

Animated sheets:

- `public/assets/effects/boss/jungle_boss_charge_warning_sheet.png`
- `public/assets/effects/boss/jungle_boss_charge_slash_sheet.png`
- `public/assets/effects/boss/jungle_boss_roar_wave_sheet.png`
- `public/assets/effects/boss/jungle_boss_summon_spore_sheet.png`
- `public/assets/effects/boss/volcano_boss_lava_warning_sheet.png`
- `public/assets/effects/boss/volcano_boss_lava_burst_sheet.png`
- `public/assets/effects/boss/volcano_boss_fire_floor_sheet.png`
- `public/assets/effects/boss/volcano_boss_slam_wave_sheet.png`

Report:

- `docs/assets/jungle_boss_effects_mvp138e_report.json`
- `docs/assets/boss_effects_illustrated_mvp138e_report.json`

Runtime policy:

- Jungle and volcano boss effects prefer animated sheets and fall back to static PNGs.
- Boss effect PNGs must not touch frame edges, include chroma backgrounds, or include unrelated generated fragments.
- The same fallback hierarchy used by volcano boss effects applies: sheet, static PNG, Graphics telegraph.
- Stage `volcano_fire_floor` was also rebuilt from a generated 4x4 flame source and keeps the 16 independent hitbox rule.
- Boss melee/summon/charge telegraphs use generated effect sprites at low alpha during windup. Graphics circles/rectangles are reserved for missing-asset fallback and should not be visible in normal play.
- Boss attack tuning now uses wider damage areas to match the generated effects: jungle/volcano melee and volcano lava burst radii were expanded, and boss 3x3 fire-floor hitboxes use larger per-flame circles than the stage 4x4 fire floor.

## MVP-138c Debug Stage Selection Routing

Runtime QA URLs must drive the actual run selection, not only PlayScene-local visuals.

Supported URL examples:

- `?debugStage=volcano&debugDifficulty=normal&debugGimmicks=1&debugGimmickFast=1&debugEnemySet=volcano`
- `?debugStage=volcano&debugDifficulty=hard&debugBossFast=1&debugWeakBoss=1`
- `?debugStage=jungle&debugDifficulty=normal&debugBossFast=1&debugWeakBoss=1`

ScreenManager reapplies debug stage/difficulty after save restoration and before StageSelect, DinoSelect, or PlayScene startup. PlayScene also reapplies stage/difficulty immediately before `restart()` builds the new run config, so stage backgrounds, enemy tables, gimmicks, and bosses use the requested debug stage.

## MVP-138d Volcano Boss Attack Effect Sheets

Recentered static fallbacks:

- `public/assets/effects/boss/volcano_boss_lava_warning.png`
- `public/assets/effects/boss/volcano_boss_lava_burst.png`
- `public/assets/effects/boss/volcano_boss_fire_floor.png`
- `public/assets/effects/boss/volcano_boss_slam_wave.png`

Animated 4x4 sheets:

- `public/assets/effects/boss/volcano_boss_lava_warning_sheet.png`
- `public/assets/effects/boss/volcano_boss_lava_burst_sheet.png`
- `public/assets/effects/boss/volcano_boss_fire_floor_sheet.png`
- `public/assets/effects/boss/volcano_boss_slam_wave_sheet.png`

Reports:

- `docs/assets/volcano_boss_effects_mvp138d_report.json`
- `docs/assets/volcano_boss_effects_mvp138d_sheet_report.json`
- `docs/assets/volcano_boss_lava_burst_mvp138d_clean_report.json`

Runtime policy:

- Boss attack sheets are preferred for lava warning, lava burst, fire floor, and slam wave.
- Static PNGs are the first fallback and Graphics telegraphs remain the last fallback.
- Lava burst source cleanup removes an unrelated edge fragment before sheet assembly.
- Boss hazard warnings may use a generated warning sprite during windup, while active hazards animate during the damage window.

Follow-up fire floor hitbox polish:

- `public/assets/effects/boss/volcano_boss_fire_floor.png`
- `public/assets/effects/boss/volcano_boss_fire_floor_sheet.png`

Report:

- `docs/assets/volcano_boss_fire_floor_9flame_mvp138d_report.json`

Runtime policy:

- Fire floor is a 3x3 small-flame hazard, not one large circular hazard.
- Each small flame has its own hitbox; warning graphics mirror those 9 hitboxes.
- The active sheet uses a pop-in animation so each small flame swells into view before looping.
# MVP-139 Swamp Stage Enemy/Boss Assets

Generated and connected image-based assets:

- `public/assets/enemies/swamp/swamp_poison_sheet.png`
- `public/assets/enemies/swamp/swamp_slow_sheet.png`
- `public/assets/enemies/swamp/swamp_toxic_bomber_sheet.png`
- `public/assets/enemies/bosses/swamp_boss_sheet.png`
- `public/assets/enemies/bosses/swamp_boss.png`
- `public/assets/enemies/bosses/swamp_boss_portrait.png`
- `public/assets/effects/boss/swamp_boss_poison_warning.png`
- `public/assets/effects/boss/swamp_boss_poison_warning_sheet.png`
- `public/assets/effects/boss/swamp_boss_poison_mist.png`
- `public/assets/effects/boss/swamp_boss_poison_mist_sheet.png`
- `public/assets/effects/boss/swamp_boss_toxic_pool.png`
- `public/assets/effects/boss/swamp_boss_toxic_pool_sheet.png`
- `public/assets/effects/boss/swamp_boss_summon_spore.png`
- `public/assets/effects/boss/swamp_boss_summon_spore_sheet.png`

Postprocess / report files:

- `docs/assets/swamp_poison_sheet_mvp139_report.json`
- `docs/assets/swamp_slow_sheet_mvp139_report.json`
- `docs/assets/swamp_toxic_bomber_sheet_mvp139_report.json`
- `docs/assets/swamp_boss_sheet_mvp139_report.json`
- `docs/assets/swamp_boss_effects_mvp139_report.json`

Fallback policy:

- Swamp enemy sheets fallback to existing swarm/tank enemy sheets.
- Swamp boss sheet falls back to `swamp_boss.png`, then existing boss graphics fallback.
- Swamp boss effect sheets fallback to their static PNGs, then Graphics fallback.

# MVP-140 Ruins Stage Enemy/Boss Assets

Generated and connected image-based assets:

- `public/assets/enemies/ruins/ruins_shooter_sheet.png`
- `public/assets/enemies/ruins/ruins_electro_sheet.png`
- `public/assets/enemies/ruins/ruins_summoner_sheet.png`
- `public/assets/enemies/bosses/ruins_boss_sheet.png`
- `public/assets/enemies/bosses/ruins_boss.png`
- `public/assets/enemies/bosses/ruins_boss_portrait.png`
- `public/assets/effects/boss/ruins_boss_electro_warning.png`
- `public/assets/effects/boss/ruins_boss_electro_warning_sheet.png`
- `public/assets/effects/boss/ruins_boss_electro_pulse.png`
- `public/assets/effects/boss/ruins_boss_electro_pulse_sheet.png`
- `public/assets/effects/boss/ruins_boss_laser_warning.png`
- `public/assets/effects/boss/ruins_boss_laser_warning_sheet.png`
- `public/assets/effects/boss/ruins_boss_laser_beam.png`
- `public/assets/effects/boss/ruins_boss_laser_beam_sheet.png`
- `public/assets/effects/boss/ruins_boss_summon_field.png`
- `public/assets/effects/boss/ruins_boss_summon_field_sheet.png`

Fallback policy:

- Ruins enemy sheets fallback to existing fast/tank/swarm sheets.
- Ruins boss sheet falls back to `ruins_boss.png`, then existing boss graphics fallback.
- Ruins boss effect sheets fallback to their static PNGs, then Graphics fallback.
- Laser hazards use the displayed animated beam as a line-shaped hit area rather than one invisible circle.

# MVP-140b Effect Sheet Runtime Fix

Runtime metadata fix:

- `flattenAssetManifest()` now flattens nested `meta` objects so boss effect sheets expose `spriteSheet`, `sheet`, and `animations` in the same shape as stage gimmick sheets.
- This prevents `*_sheet.png` atlases from rendering as one large static image.
- Verified metadata shape for:
  - `bossEffects.ruinsElectroPulseSheet`
  - `bossEffects.volcanoFireFloorSheet`
  - `stageGimmicks.volcanoFireFloorSheet`

Hitbox / layout policy:

- Volcano fire floor and swamp toxic pools use clustered small hitboxes with slight deterministic offsets.
- Boss toxic pools also use clustered hitboxes.
- Laser beams use line-shaped hit areas.
- Warning positions and active hitboxes share the same spawned origin so effects do not drift between windup and damage.

# MVP-140c Effect QA Follow-up

Stage gimmick animation reuse:

- `stageGimmicks.swampPoisonMistSheet` now points to `public/assets/effects/boss/swamp_boss_poison_mist_sheet.png`.
- `stageGimmicks.swampToxicPoolSheet` now points to `public/assets/effects/boss/swamp_boss_toxic_pool_sheet.png`.
- `stageGimmicks.ruinsElectroPulseSheet` now points to `public/assets/effects/boss/ruins_boss_electro_pulse_sheet.png`.
- `stageGimmicks.ruinsLaserBeamSheet` now points to `public/assets/effects/boss/ruins_boss_laser_beam_sheet.png`.

Runtime polish:

- Boss windup effect alpha was reduced for melee, summon, and charge patterns.
- Static stage PNGs remain fallback assets.
- No new generated image assets were added in this pass.

# MVP-140d Ruins Illustrated Asset Quality Pass

Generated and connected replacement assets:

- `public/assets/enemies/ruins/ruins_shooter_sheet.png`
- `public/assets/enemies/ruins/ruins_electro_sheet.png`
- `public/assets/enemies/ruins/ruins_summoner_sheet.png`
- `public/assets/enemies/bosses/ruins_boss_sheet.png`
- `public/assets/enemies/bosses/ruins_boss.png`
- `public/assets/enemies/bosses/ruins_boss_portrait.png`
- `public/assets/effects/boss/ruins_boss_electro_pulse.png`
- `public/assets/effects/boss/ruins_boss_electro_pulse_sheet.png`
- `public/assets/effects/boss/ruins_boss_electro_warning.png`
- `public/assets/effects/boss/ruins_boss_laser_warning.png`
- `public/assets/effects/boss/ruins_boss_laser_warning_sheet.png`
- `public/assets/effects/boss/ruins_boss_laser_beam.png`
- `public/assets/effects/boss/ruins_boss_laser_beam_sheet.png`
- `public/assets/effects/boss/ruins_boss_summon_field.png`
- `public/assets/effects/boss/ruins_boss_summon_field_sheet.png`
- `public/assets/effects/stage_gimmicks/ruins_electro_pulse.png`
- `public/assets/effects/stage_gimmicks/ruins_electro_pulse_sheet.png`
- `public/assets/effects/stage_gimmicks/ruins_laser_warning.png`
- `public/assets/effects/stage_gimmicks/ruins_laser_warning_sheet.png`
- `public/assets/effects/stage_gimmicks/ruins_laser_beam.png`
- `public/assets/effects/stage_gimmicks/ruins_laser_beam_sheet.png`

Postprocess / report file:

- `docs/assets/ruins_assets_mvp140d_report.json`

Asset direction:

- Ruins enemies now use illustrated old-research-facility biomechanical silhouettes instead of simple placeholder shapes.
- The ruins boss is an illustrated `アーク・レヴナント` sheet with biological armor, floating facility fragments, and blue-purple electromagnetic lighting.
- Boss electro pulse, laser warning, laser beam, and summon field effects are generated sheet/static pairs.
- Stage gimmick copies are kept separate from boss effect keys so later tuning can diverge without breaking fallback paths.

Runtime / fallback policy:

- All `_sheet.png` ruins effects must be frame-split at runtime and never drawn as a full atlas.
- Static PNGs remain first fallback; Graphics fallback remains last resort.
- Warning frames stay damage-free. Active frames use the existing line/circle/cluster hit area rules.
- Stage and boss effects should keep natural small-object placement where relevant and avoid rigid grid presentation.

# MVP-141 Cross-Stage Asset QA

Generated QA artifacts:

- `docs/assets/chromakey_cleanup_candidates_mvp141.md`
- `docs/assets/chromakey_cleanup_candidates_mvp141.json`

Scan scope:

- `public/assets/enemies/`
- `public/assets/enemies/bosses/`
- `public/assets/effects/`
- `public/assets/dinos/`
- `public/assets/ui/`

Candidate detection rules:

- near-magenta pixels that may indicate `#ff00ff` chroma remnants,
- cyan fringe pixels that may indicate cutout edge glow,
- low-alpha debris that can haze around sprites,
- outer-edge or sprite-sheet cell-edge contact that may indicate clipping or frame bleed.

QA result:

- Browser QA did not find runtime console errors/warnings for the checked four-stage routes.
- The candidate list is intentionally conservative; generated glow and UI frame edges can be false positives and should be visually reviewed before regeneration.
- Highest-priority follow-up is animation sheet cell-edge contact, because it can produce visible clipping, neighbor-frame bleed, or apparent extra parts during motion.

Pre-ZERO asset polish candidates:

- review APEX/enemy ring presentation so it does not read as an attack guide,
- inspect high-priority chromakey candidates before ZERO boss/effect generation,
- avoid large-scale regeneration unless the visual issue is visible in gameplay.

# MVP-142 Chromakey Cleanup Triage

Generated cleanup artifacts:

- `docs/assets/chromakey_cleanup_before_mvp142_contact.png`
- `docs/assets/chromakey_cleanup_selected_before_mvp142_contact.png`
- `docs/assets/chromakey_cleanup_after_mvp142_contact.png`
- `docs/assets/chromakey_cleanup_mvp142_report.json`
- `docs/assets/chromakey_cleanup_mvp142_summary.md`

Backup location:

- `docs/assets/backup/mvp142_chromakey_cleanup/`

Safe-cleaned gameplay assets:

- `public/assets/enemies/bosses/ruins_boss_sheet.png`
- `public/assets/enemies/bosses/ruins_boss.png`
- `public/assets/enemies/bosses/ruins_boss_portrait.png`
- `public/assets/enemies/ruins/ruins_electro_sheet.png`
- `public/assets/enemies/ruins/ruins_shooter_sheet.png`
- `public/assets/enemies/ruins/ruins_summoner_sheet.png`
- `public/assets/enemies/bosses/swamp_boss_sheet.png`
- `public/assets/enemies/bosses/swamp_boss.png`
- `public/assets/enemies/bosses/swamp_boss_portrait.png`
- `public/assets/enemies/swamp/swamp_poison_sheet.png`
- `public/assets/enemies/swamp/swamp_slow_sheet.png`
- `public/assets/enemies/swamp/swamp_toxic_bomber_sheet.png`

Selection policy:

- Do not batch-process all chromakey candidates. The MVP-141 scan is intentionally conservative and includes many intentional neon glows.
- Prioritize sprites that can visibly leak chromakey remnants during gameplay: enemies, bosses, boss portraits, and animation sheets.
- Exclude UI frames, selection panels, skill icons, and effect sheets when detected magenta/cyan pixels are part of intended glow or visible framing.
- Prefer low-risk postprocess cleanup before regeneration. Regenerate only when neighbor-frame bleed, strong edge tint, or internal chromakey contamination cannot be cleaned without damaging the subject.

Cleanup rules used:

- Remove very low-alpha debris.
- Remove exact and near-pure chromakey magenta.
- Remove weak magenta fuzz only at cutout edges.
- For 4x4 sprite sheets, clean around cell boundaries without deleting opaque body pixels or changing the grid.
- Preserve silhouette, foot alignment, center position, and fallback paths.

QA result:

- Jungle, volcano, swamp, and ruins debug routes were opened in the in-app browser after cleanup.
- No runtime console errors or warnings were observed during the checked routes.
- The edited swamp and ruins sprites remained visible after cleanup.

Deferred candidates:

- Purple ruins/swamp effects were left unchanged because the detected magenta-like pixels are intentional electromagnetic or poison glow.
- UI frame candidates were left unchanged because they are intentional neon borders or transparent padding around generated UI assets.
- Cyan fringes on HUD/skill icons were left unchanged when they read as deliberate lighting at UI scale.

# MVP-142b Effect Candidate Recheck

Generated review artifacts:

- `docs/assets/effect_review_mvp142b_contact.png`
- `docs/assets/effect_review_mvp142b_after_contact.png`
- `docs/assets/burst_fang_regenerated_mvp142b_contact.png`
- `docs/assets/effect_review_mvp142b_report.json`
- `docs/assets/effect_review_mvp142b_after_report.json`
- `docs/assets/effect_review_mvp142b_regen_report.json`
- `docs/assets/generated_raw/mvp142b_effect_regen/burst_fang_mine_generated_raw.png`
- `docs/assets/generated_raw/mvp142b_effect_regen/burst_fang_explosion_generated_raw.png`

Backups:

- `docs/assets/backup/mvp142b_effect_review/burst_fang_mine.png`
- `docs/assets/backup/mvp142b_effect_review/burst_fang_explosion.png`
- `docs/assets/backup/mvp142b_effect_review/burst_fang_mine_before_regen.png`
- `docs/assets/backup/mvp142b_effect_review/burst_fang_explosion_before_regen.png`

Regenerated assets:

- `public/assets/effects/adaptation_skills/burst_fang_mine.png`
- `public/assets/effects/adaptation_skills/burst_fang_explosion.png`

Review result:

- `burst_fang_mine.png` was in active use through `adaptationSkillEffects.burstFangMine` and had visible edge pressure plus an extra detached component. It was regenerated as a centered single fang-mine object with a safer transparent margin.
- `burst_fang_explosion.png` was registered through `adaptationSkillEffects.burstFangExplosion` and had visible edge pressure. It was regenerated as a centered burst effect with the full fang-shard explosion inside the canvas.
- Boss and stage effect candidates were reviewed as a contact sheet. Most purple/cyan detections are intended electromagnetic, poison, laser, or warning glow and should not be chromakey-cleaned mechanically.

Effect review rule:

- For boss/stage effects, do not remove magenta/cyan by color alone. Reconsider or regenerate only when the rendered asset shows clipping, unrelated fragments, sheet bleed, or an effect shape that conflicts with the gameplay hit area.
- Maintain static/sheet fallback and preserve existing manifest keys when replacing an effect asset in place.

## MVP-142b High-Ratio Candidate Regeneration

High residual-color ratio candidates were re-sorted by visible-pixel ratio, not only raw pixel count. The highest gameplay-relevant clusters were regenerated individually instead of chromakey-cleaned:

- `public/assets/effects/boss/ruins_boss_laser_warning.png`
- `public/assets/effects/boss/ruins_boss_laser_warning_sheet.png`
- `public/assets/effects/stage_gimmicks/ruins_laser_warning.png`
- `public/assets/effects/stage_gimmicks/ruins_laser_warning_sheet.png`
- `public/assets/effects/boss/ruins_boss_laser_beam.png`
- `public/assets/effects/boss/ruins_boss_laser_beam_sheet.png`
- `public/assets/effects/stage_gimmicks/ruins_laser_beam.png`
- `public/assets/effects/stage_gimmicks/ruins_laser_beam_sheet.png`
- `public/assets/effects/boss/swamp_boss_poison_warning.png`
- `public/assets/effects/boss/swamp_boss_poison_warning_sheet.png`
- `public/assets/effects/boss/swamp_boss_summon_spore.png`
- `public/assets/effects/boss/swamp_boss_summon_spore_sheet.png`
- `public/assets/effects/boss/swamp_boss_poison_mist.png`
- `public/assets/effects/boss/swamp_boss_poison_mist_sheet.png`
- `public/assets/effects/stage_gimmicks/swamp_poison_mist.png`
- `public/assets/effects/stage_gimmicks/swamp_poison_mist_sheet.png`

Additional boss presentation fixes:

- `public/assets/enemies/bosses/swamp_boss_portrait.png`
- `public/assets/enemies/bosses/ruins_boss_portrait.png`
- `public/assets/enemies/bosses/swamp_boss_sheet.png`

Generated raw and backup folders:

- `docs/assets/generated_raw/mvp142b_high_ratio_regen/`
- `docs/assets/generated_raw/mvp142b_boss_portrait_regen/`
- `docs/assets/backup/mvp142b_high_ratio_regen/`
- `docs/assets/backup/mvp142b_boss_portrait_regen/`

Review/contact artifacts:

- `docs/assets/chromakey_high_ratio_regenerated_mvp142b_contact.png`
- `docs/assets/boss_portrait_sheet_regen_mvp142b_contact.png`
- `docs/assets/chromakey_high_ratio_regen_mvp142b_report.json`
- `docs/assets/chromakey_high_ratio_regen_swamp_mist_mvp142b_report.json`
- `docs/assets/chromakey_boss_portrait_regen_mvp142b_report.json`

Regeneration rule:

- When residual chromakey-like colors are a large ratio of visible pixels in gameplay effects, regenerate with cleaner colors and padding rather than deleting glow by threshold.
- Keep manifest keys stable and replace assets in place so fallback and runtime references remain intact.
- For boss animation sheets, prefer cell-safe relayout when the source is usable but cell margins are too tight.

## MVP-142c Boss Sheet Full Regeneration

Fully regenerated boss sprite sheets:

- `public/assets/enemies/bosses/swamp_boss_sheet.png`
- `public/assets/enemies/bosses/ruins_boss_sheet.png`

Reason:

- Both sheets still had visible residual-color concerns and animation clipping risk after safer cleanup.
- The previous swamp sheet in particular had a wide silhouette and tight per-cell margins, which could read as clipping during motion.

Generated raw and backup folders:

- `docs/assets/generated_raw/mvp142c_boss_sheet_regen/`
- `docs/assets/backup/mvp142c_boss_sheet_regen/`

Reports / contact sheets:

- `docs/assets/boss_sheet_regen_mvp142c_report.json`
- `docs/assets/boss_sheet_regen_mvp142c_component_cleanup_report.json`
- `docs/assets/boss_sheet_regen_mvp142c_contact.png`

Processing:

- Generated fresh 4x4 boss sheets on chroma-key backgrounds.
- Converted to the existing `1024x1024` / `4x4` / `256px` cell format.
- Removed chroma-key green and despilled edges.
- Refit each cell into a safe area with consistent padding.
- Removed detached non-primary components per cell while preserving the main boss silhouette and major attack effects.
- Manifest keys and animation metadata remain unchanged.

Follow-up clipping fix:

- `docs/assets/boss_sheet_extra_padding_mvp142c_report.json`
- After initial regeneration, runtime/display review still indicated possible clipping. Each boss sheet cell was refit a second time with smaller maximum bounds:
  - swamp boss cells target a tighter safe area,
  - ruins boss cells target a tighter safe area,
  - grounded placement is preserved while keeping more side/top/bottom padding.
## MVP-142c boss sheet rebuild note

- `public/assets/enemies/bosses/swamp_boss_sheet.png` and `public/assets/enemies/bosses/ruins_boss_sheet.png` were rebuilt from single illustrated side-view cutouts instead of direct 4x4 generated sheets.
- Reason: direct 4x4 generation can bleed tails, glow, or body parts across cell boundaries. Single-source rebuild keeps every 256x256 cell inside a conservative safe area.
- Backups: `docs/assets/backup/mvp142c_boss_sheet_single_source/`.
- Raw sources: `docs/assets/generated_raw/mvp142c_boss_sheet_single_source/`.
- QA artifacts: `docs/assets/boss_sheet_single_source_regen_mvp142c_contact.png` and `docs/assets/boss_sheet_single_source_regen_mvp142c_report.json`.

## MVP-143 ENDLESS mode assets

- ENDLESS formalization did not require new raster assets.
- Existing stage enemy, boss, gimmick, result, and title-frame assets are reused.
- Future polish: add a dedicated ENDLESS result header/frame only if the reused result layout feels too close to standard GAME OVER.
# MVP-143b swamp / ruins boss animation finish

- Rebuilt `public/assets/enemies/bosses/swamp_boss_sheet.png` and `public/assets/enemies/bosses/ruins_boss_sheet.png` from single-source boss cutouts with stronger per-frame differences while preserving 256x256 cell safety.
- The previous MVP-142c version prioritized no clipping; MVP-143b keeps that safety but adds clearer idle breathing, move bob/lateral motion, attack emission/lunge, and death collapse/fade frames.
- Backup path: `docs/assets/backup/mvp143b_boss_animation_finish/`
- Raw source copy path: `docs/assets/generated_raw/mvp143b_boss_animation_finish/`
- QA artifacts:
  - `docs/assets/boss_animation_finish_mvp143b_contact.png`
  - `docs/assets/boss_animation_finish_mvp143b_report.json`
- `frameEdgeIssues` must remain 0 for both swamp and ruins boss sheets. Direct full 4x4 image generation remains discouraged for these bosses because it previously caused cell spill and clipping.

# MVP-143 ENDLESS mode asset note

- ENDLESS uses existing stage enemy, boss, gimmick, and reward UI assets. No new dedicated ENDLESS art was generated in MVP-143.
- Future ENDLESS polish may add a dedicated result header, endurance title frames, and late-run warning chips, but the current implementation intentionally reuses existing UI to avoid asset churn before ZERO.
# MVP-143c swamp / ruins boss bulk 4x4 regeneration

- Regenerated `swamp_boss_sheet.png` and `ruins_boss_sheet.png` as full 4x4 sprite sheets in a single image generation pass, then normalized and postprocessed each cell.
- Source generated images were 1254x1254 and were resized to 1024x1024 before 4x4 cell extraction.
- Postprocess rules:
  - remove `#ff00ff` and near-magenta background
  - split into 16 cells
  - inspect bbox and alpha per cell
  - fit each generated cell back into the 256x256 safe area
  - preserve the generated row animation differences
  - reject sheets with edge contact, adjacent-cell bleed, or bottom-right alpha collapse
- Adopted outputs:
  - `public/assets/enemies/bosses/swamp_boss_sheet.png`
  - `public/assets/enemies/bosses/ruins_boss_sheet.png`
  - `public/assets/enemies/bosses/swamp_boss.png`
  - `public/assets/enemies/bosses/ruins_boss.png`
- Backup path: `docs/assets/backup/mvp143c_boss_sheet_bulk_regen/`
- Raw generated source path: `docs/assets/generated_raw/mvp143c_boss_sheet_bulk_regen/`
- QA artifacts:
  - `docs/assets/boss_sheet_regen_mvp143c_contact.png`
  - `docs/assets/boss_sheet_regen_mvp143c_report.json`

# MVP-143c add QA: move row review

- Added Row 2 move review artifacts:
  - `docs/assets/boss_move_row_mvp143c_addqa_contact.png`
  - `docs/assets/boss_move_row_mvp143c_addqa_after_contact.png`
  - `docs/assets/boss_move_row_mvp143c_addqa_final_contact.png`
  - `docs/assets/boss_move_row_mvp143c_addqa_report.json`
  - `docs/assets/boss_move_row_mvp143c_addqa_final_report.json`
- Swamp move row keeps the bulk-generated walking poses and removes tiny detached artifacts that read as adjacent-cell contamination.
- Ruins move row keeps the bulk-generated floating/biomechanical motion cues.
- Backup path for the final move cleanup: `docs/assets/backup/mvp143c_addqa_move_cleanup/`

# MVP-144 ZERO base assets

- MVP-144 intentionally keeps ZERO asset work minimal.
- The MVP-144 ZERO final boss temporarily reused the ruins boss sheet/effects as `エクリプス・プロトコル`.
- MVP-145 replaces that temporary fallback with dedicated ZERO final-boss assets listed below.
- Replacement rule: dedicated ZERO art must preserve the existing sheet-frame split rules, no sheet-wide rendering, no text baked into images, and no unavoidable attack visuals.

# MVP-145 ZERO final boss asset replacement

Generated and connected dedicated ZERO final boss assets:

- `public/assets/enemies/bosses/zero_eclipse_protocol_sheet.png`
- `public/assets/enemies/bosses/zero_eclipse_protocol.png`
- `public/assets/enemies/bosses/zero_eclipse_protocol_portrait.png`

Generated and connected ZERO boss effect sheets:

- `public/assets/effects/boss/zero_boss_eclipse_warning_sheet.png`
- `public/assets/effects/boss/zero_boss_eclipse_beam_sheet.png`
- `public/assets/effects/boss/zero_boss_gravity_field_sheet.png`
- `public/assets/effects/boss/zero_boss_core_burst_sheet.png`
- `public/assets/effects/boss/zero_boss_summon_gate_sheet.png`

Generated ZERO result receptacle assets:

- `public/assets/ui/result/result_header_zero_clear.png`
- `public/assets/ui/result/zero_result_panel.png`
- `public/assets/ui/result/zero_reward_frame.png`
- `public/assets/ui/result/zero_evolution_route_chip.png`

Raw generated sources and backups:

- `docs/assets/generated_raw/mvp145_zero_boss/`
- `docs/assets/backup/mvp145_zero_boss/`
- `docs/assets/zero_boss_assets_mvp145_report.json`

Fallback rules:

- ZERO final boss sheet falls back to `zero_eclipse_protocol.png`; runtime can still fall back to existing boss drawing if asset loading fails.
- ZERO boss attack sheets use the existing sheet-splitting path. Sheet-wide rendering remains prohibited.
- ZERO result header falls back to the standard clear header if unavailable.

# MVP-146 ZERO final boss QA notes

- No new assets were generated in MVP-146.
- Existing ZERO assets were runtime-checked:
  - `zero_eclipse_protocol_sheet.png`
  - `zero_boss_eclipse_beam_sheet.png`
  - `zero_boss_gravity_field_sheet.png`
  - `zero_boss_core_burst_sheet.png`
  - `zero_boss_summon_gate_sheet.png`
  - `result_header_zero_clear.png`
- QA focus:
  - sheet-wide rendering must not occur.
  - warnings must remain visible but not dominate the play field.
  - active effects should align with collision shape closely enough for player reading.
- Tuning was code-side only: cooldown/windup/damage/alpha/summon count were adjusted in the boss config rather than regenerating art.
- Final polish candidates:
  - a dedicated ZERO reward panel texture can be used more aggressively once all reward rows are finalized.
  - long manual ZERO runs should validate effect accumulation and summon cleanup.

# MVP-147 ZERO pacing QA notes

- No new assets were generated in MVP-147.
- ZERO play-feel tuning was code-side only:
  - boss schedule
  - enemy pressure scaling
  - gimmick pressure scaling
  - boss HP/damage scale
- Asset rules remain unchanged:
  - ZERO boss/effect sheets must remain frame-split animations.
  - no sheet-wide rendering.
  - fallback assets must remain available.
- Future polish:
  - longer non-debug ZERO playtest after ZERO reward evolution routes are connected.
  - optional dedicated on-screen phase warning art for phase 2 and final phase.

# MVP-148 ZERO phase UI assets

Generated ZERO phase presentation assets:

- `public/assets/ui/zero/zero_phase_panel.png`
- `public/assets/ui/zero/zero_warning_panel.png`
- `public/assets/ui/zero/zero_final_warning_panel.png`
- `public/assets/ui/zero/zero_phase_chip.png`
- `public/assets/effects/zero/zero_protocol_noise_sheet.png`
- `public/assets/effects/zero/zero_core_activation_sheet.png`

Runtime rules:

- Text is drawn in code; image assets contain no baked gameplay text.
- `*_sheet.png` assets are registered as 4x4 frame-split animation sheets and must not be displayed as a full sheet.
- If a ZERO panel or sheet is missing, PlayScene falls back to Graphics panels and simply skips the animated accent.
- ZERO phase assets are only used in ZERO mode. Standard and ENDLESS HUD paths must remain unaffected.

# MVP-149 Tyrannosaurus ZERO route assets

Generated and registered:

- `public/assets/dinos/evolutions/heroes/tyrannosaurus_zero_hero.png`
- `public/assets/dinos/evolutions/portraits/tyrannosaurus_zero_portrait.png`
- `public/assets/dinos/evolutions/sheets/tyrannosaurus_zero_sheet.png`
- `public/assets/ui/hud/special_icons/special_zero_tyrannosaurus.png`

Rules:

- `tyrannosaurus_zero_sheet.png` is a 4x4 evolution sheet and must use the same frame-splitting rules as other evolution sheets.
- Fallbacks should resolve to the tyrannosaurus attack branch assets when ZERO assets are missing.
- The ZERO special icon is connected now; the dedicated ZERO special effect remains future work.

# MVP-150 Omega Rex full rebuild

Rebuilt as fully dedicated assets:

- `public/assets/dinos/evolutions/heroes/tyrannosaurus_zero_hero.png`
- `public/assets/dinos/evolutions/portraits/tyrannosaurus_zero_portrait.png`
- `public/assets/dinos/evolutions/sheets/tyrannosaurus_zero_sheet.png`
- `public/assets/ui/hud/special_icons/special_zero_tyrannosaurus.png`
- `public/assets/effects/specials/special_zero_omega_burst_sheet.png`
- `public/assets/effects/specials/special_zero_omega_core_sheet.png`
- `public/assets/effects/specials/special_zero_omega_beam_sheet.png`
- `public/assets/effects/specials/special_zero_omega_burst.png`
- `public/assets/effects/specials/special_zero_omega_core.png`
- `public/assets/effects/specials/special_zero_omega_beam.png`

Generated/QA artifacts:

- `docs/assets/backup/mvp150_omega_rebuild/`
- `docs/assets/generated_raw/mvp150_omega_rebuild/`
- `docs/assets/omega_rebuild_mvp150_contact.png`
- `docs/assets/omega_rebuild_mvp150_report.json`

Rules:

- Do not complete future ZERO reward evolutions by recoloring existing branch art.
- Sprite sheets must be cell-checked for bbox, alpha, frame edge issues, and adjacent-cell contamination.
- Dedicated ZERO ultimate effects may provide both sheet sources and static runtime textures until the effect system supports animated special textures.

# MVP-151 Omega Burst Runtime Sheet Connection

Registered animated special effect sheets:

- `public/assets/effects/specials/special_zero_omega_core_sheet.png`
- `public/assets/effects/specials/special_zero_omega_burst_sheet.png`
- `public/assets/effects/specials/special_zero_omega_beam_sheet.png`

Runtime rules:

- Special effect sheets are split as 4x4 frames in `UltimateSystem`.
- Static `special_zero_omega_*.png` assets remain fallback, then Graphics fallback.
- Codex loads `public/assets/dinos/evolutions/heroes/tyrannosaurus_zero_hero.png` explicitly so the Omega Rex route does not display the base tyrannosaurus hero after unlock.

# MVP-151b Omega Rex Codex Wording

- No new bitmap assets are required.
- The Omega Rex codex card must distinguish route unlock from in-run evolution requirements.
- `ZERO CLEAR` remains an unlock source in data/specs, but it is not drawn as the card evolution condition.
- Current card-only display uses compact concrete requirement lines: `対象: ティラノ系統 / Lv8+`, `高速Lv3 / 狩猟Lv3`, and `攻撃Lv3 / ルート解析済`.
- A full codex detail panel is deferred; future UI assets may add a larger readable condition area.

# MVP-151d Codex Condition Layout

- No new bitmap assets are required.
- Evolution card text now uses `displayConditions` from evolution data so normal branches and ZERO upper branches share one display rule.
- Cards use mutation/tag label plus two condition lines. Trait/role text is omitted on compact cards when condition readability would suffer.
- Future detail-panel assets may reintroduce full description, role, unlock source, and long condition text after release.

# MVP-151e Production Asset Rule

- No new bitmap assets are required for the codex color fix.
- Evolution condition lines on a single codex card must use one consistent color; ZERO cards may use a ZERO accent, but both condition lines share it.
- Future production implementations must not be considered complete when they are only recolors or simple edits of existing assets.
- New characters, evolutions, bosses, ultimates, and stage-specific hazards require dedicated primary assets and dedicated effects when promoted from prototype to production.
- Temporary reuse is allowed only during prototype work and must be labeled as temporary in the relevant spec.
- 4x4 sprite sheets must be checked for clipping, adjacent-cell contamination, alpha issues, chromakey residue, and motion readability before adoption.
- Runtime UI display and in-play visibility must be verified after asset replacement.
- Fallback chains remain mandatory: dedicated asset -> static/older asset where applicable -> Graphics fallback.

# MVP-151c ZERO Reward Route Asset Scope

- No new assets are generated in this scope pass.
- Current production ZERO route asset set belongs to `tyrannosaurus_zero` / Omega Rex and is assigned to swamp ZERO clear.
- Planned but not production-ready:
  - jungle ZERO reward -> `velociraptor_zero` / `アビスラプス` implemented in MVP-152
  - volcano ZERO reward -> `triceratops_zero`
- ruins ZERO reward route is post-release content and should not receive placeholder production assets until the fourth dinosaur is defined.
- Any future ZERO route promoted to production must follow the MVP-151e dedicated-asset rule, not a recolor or simple reuse.

# MVP-152 Velociraptor ZERO Asset Set

- New production ZERO route assets for `velociraptor_zero` / `アビスラプス`:
  - `public/assets/dinos/evolutions/heroes/velociraptor_zero_hero.png`
  - `public/assets/dinos/evolutions/portraits/velociraptor_zero_portrait.png`
  - `public/assets/dinos/evolutions/sheets/velociraptor_zero_sheet.png`
  - `public/assets/ui/hud/special_icons/special_zero_velociraptor.png`
  - `public/assets/effects/specials/special_zero_raptor_core_sheet.png`
  - `public/assets/effects/specials/special_zero_raptor_slash_sheet.png`
  - `public/assets/effects/specials/special_zero_raptor_dash_sheet.png`
- Source and QA artifacts:
  - `docs/assets/generated_raw/mvp152_velociraptor_zero/`
  - `docs/assets/velociraptor_zero_mvp152_contact.png`
  - `docs/assets/velociraptor_zero_mvp152_report.json`
- Adoption checks:
  - dedicated generated source, not a simple recolor of the existing raptor.
  - 4x4 sheet structure preserved.
  - `frameEdgeIssues` target: 0.
  - alpha/chromakey and cell containment inspected before adoption.
- Fallback rule remains: dedicated ZERO route asset -> nearest existing velociraptor evolution asset -> Graphics fallback.

# MVP-152b Abyss Raptor Asset Replacement

- Preserved:
  - `public/assets/dinos/evolutions/heroes/velociraptor_zero_hero.png`
  - `public/assets/dinos/evolutions/portraits/velociraptor_zero_portrait.png`
- Regenerated from dedicated image-generation sources:
  - `public/assets/dinos/evolutions/sheets/velociraptor_zero_sheet.png`
  - `public/assets/ui/hud/special_icons/special_zero_velociraptor.png`
  - `public/assets/effects/specials/special_zero_raptor_core_sheet.png`
  - `public/assets/effects/specials/special_zero_raptor_slash_sheet.png`
  - `public/assets/effects/specials/special_zero_raptor_dash_sheet.png`
- Backup and raw sources:
  - `docs/assets/backup/mvp152b_velociraptor_zero_assets/`
  - `docs/assets/generated_raw/mvp152b_velociraptor_zero_assets/`
- QA artifacts:
  - `docs/assets/velociraptor_zero_mvp152b_contact.png`
  - `docs/assets/velociraptor_zero_mvp152b_report.json`
- Adoption checks:
  - sprite/effect sheets normalized to 1024x1024 4x4 layout.
  - chroma-key background removed.
  - frame-edge and alpha checks recorded.
  - `frameEdgeIssues` result: 0 for sprite, core, slash, and dash sheets.
- Rule update: a hero-derived safe sheet can be used as a temporary bridge, but production ZERO route sheets, icons, and effects require dedicated generation and QA.

# MVP-152c Jungle / Swamp ZERO Boss Assets

- MVP-153 / volcano `triceratops_zero` assets remain deferred.
- Generated and adopted dedicated ZERO final boss assets:
  - `public/assets/enemies/bosses/jungle_zero_final_boss_sheet.png`
  - `public/assets/enemies/bosses/jungle_zero_final_boss.png`
  - `public/assets/enemies/bosses/jungle_zero_final_boss_portrait.png`
  - `public/assets/enemies/bosses/swamp_zero_final_boss_sheet.png`
  - `public/assets/enemies/bosses/swamp_zero_final_boss.png`
  - `public/assets/enemies/bosses/swamp_zero_final_boss_portrait.png`
  - `public/assets/effects/boss/jungle_zero_final_attack_sheet.png`
  - `public/assets/effects/boss/jungle_zero_final_attack.png`
  - `public/assets/effects/boss/swamp_zero_final_attack_sheet.png`
  - `public/assets/effects/boss/swamp_zero_final_attack.png`
- QA artifacts:
  - `docs/assets/generated_raw/mvp152c_zero_bosses/`
  - `docs/assets/backup/mvp152c_zero_bosses/`
  - `docs/assets/zero_bosses_mvp152c_contact.png`
  - `docs/assets/zero_bosses_mvp152c_report.json`
- Adoption checks:
  - all four sheets reported `frameEdgeIssues: 0`.
  - alpha mean range stayed stable with no right-bottom fade issue.
  - static fallbacks were extracted from representative frames.
  - sheet metadata uses 4x4 frame splitting; sheet-wide display remains prohibited.
- Fallback rule remains: dedicated ZERO final boss/effect asset -> static fallback -> existing Graphics fallback.

# MVP-152d Jungle / Swamp ZERO Second Boss Assets

- MVP-153 / volcano `triceratops_zero` assets remain deferred.
- Generated and adopted dedicated ZERO second boss assets:
  - `public/assets/enemies/bosses/jungle_zero_second_boss_sheet.png`
  - `public/assets/enemies/bosses/jungle_zero_second_boss.png`
  - `public/assets/enemies/bosses/jungle_zero_second_boss_portrait.png`
  - `public/assets/enemies/bosses/swamp_zero_second_boss_sheet.png`
  - `public/assets/enemies/bosses/swamp_zero_second_boss.png`
  - `public/assets/enemies/bosses/swamp_zero_second_boss_portrait.png`
  - `public/assets/effects/boss/jungle_zero_second_warning_sheet.png`
  - `public/assets/effects/boss/jungle_zero_second_warning.png`
  - `public/assets/effects/boss/jungle_zero_second_attack_sheet.png`
  - `public/assets/effects/boss/jungle_zero_second_attack.png`
  - `public/assets/effects/boss/swamp_zero_second_warning_sheet.png`
  - `public/assets/effects/boss/swamp_zero_second_warning.png`
  - `public/assets/effects/boss/swamp_zero_second_attack_sheet.png`
  - `public/assets/effects/boss/swamp_zero_second_attack.png`
- QA artifacts:
  - `docs/assets/generated_raw/mvp152d_zero_second_bosses/`
  - `docs/assets/backup/mvp152d_zero_second_bosses/`
  - `docs/assets/zero_second_bosses_mvp152d_contact.png`
  - `docs/assets/zero_second_bosses_mvp152d_report.json`
- Adoption checks:
  - all four generated sheets report `frameEdgeIssues: 0`.
  - processed contact sheet confirms chroma background removal and no sheet-wide display source.
  - manifest metadata uses 4x4 frame splitting for boss and effect sheets.
- Fallback rule remains: dedicated ZERO second boss/effect asset -> static fallback -> existing Graphics fallback.

## MVP-153 Volcano ZERO Assets

- New production evolution assets:
  - `public/assets/dinos/evolutions/heroes/triceratops_zero_hero.png`
  - `public/assets/dinos/evolutions/portraits/triceratops_zero_portrait.png`
  - `public/assets/dinos/evolutions/sheets/triceratops_zero_sheet.png`
  - `public/assets/ui/hud/special_icons/special_zero_triceratops.png`
  - `public/assets/effects/specials/special_zero_triceratops_core_sheet.png`
  - `public/assets/effects/specials/special_zero_triceratops_charge_sheet.png`
  - `public/assets/effects/specials/special_zero_triceratops_impact_sheet.png`
- New production volcano ZERO boss assets:
  - `public/assets/enemies/bosses/volcano_zero_second_boss_sheet.png`
  - `public/assets/enemies/bosses/volcano_zero_second_boss.png`
  - `public/assets/enemies/bosses/volcano_zero_second_boss_portrait.png`
  - `public/assets/enemies/bosses/volcano_zero_final_boss_sheet.png`
  - `public/assets/enemies/bosses/volcano_zero_final_boss.png`
  - `public/assets/enemies/bosses/volcano_zero_final_boss_portrait.png`
  - `public/assets/effects/boss/volcano_zero_second_warning_sheet.png`
  - `public/assets/effects/boss/volcano_zero_second_attack_sheet.png`
  - `public/assets/effects/boss/volcano_zero_final_warning_sheet.png`
  - `public/assets/effects/boss/volcano_zero_final_attack_sheet.png`
- QA artifacts:
  - `docs/assets/volcano_zero_mvp153_contact.png`
  - `docs/assets/volcano_zero_mvp153_report.json`
  - `docs/assets/volcano_zero_mvp153_effect_chromakey_fix2_contact.png`
  - `docs/assets/volcano_zero_mvp153_chromakey_fix2.json`
- Green chroma residue in generated effect sheets is not accepted as production-is. MVP-153 remaps remaining green hue contamination into volcanic orange / ZERO purple and removes low-alpha green speckles before manifest registration.

### MVP-154 ZERO 3-route cross QA
- Scope: pre-release ZERO routes are jungle -> `velociraptor_zero` / アビスラプス, volcano -> `triceratops_zero` / イグニケラ, and swamp -> `tyrannosaurus_zero` / オメガレクス.
- QA confirmed route reward mapping through `SaveManager.grantZeroRewards`: jungle grants `jungle_zero_clear` + `jungle_zero_frame` + `velociraptor_zero`; volcano grants `volcano_zero_clear` + `volcano_zero_frame` + `triceratops_zero`; swamp grants `swamp_zero_clear` + `swamp_zero_frame` + `tyrannosaurus_zero`; ruins grants no ZERO route reward.
- Duplicate reward QA confirmed the second volcano ZERO clear does not re-grant the route, title, or frame.
- ZERO upper evolution QA confirmed all three routes require route unlock, matching lineage, Lv8+, speed/hunting/attack Lv3+, and do not become eligible again after `hasZeroEvolved` is set.
- Existing `hasEvolved` normal evolution state does not block ZERO upper evolution eligibility.
- ZERO candidate UI copy was normalized to readable Japanese for route解析済み / 全適応Lv3+ / Lv8+.
- Browser smoke QA covered jungle, volcano, swamp ZERO starts; direct ZERO evolutions and their specials; stage select locking; and ruins ZERO lock.
- Final polish candidates: full manual ZERO CLEAR pacing per route, boss HP tuning without `debugWeakBoss`, and longer performance soak.

### MVP-155 ZERO pre-release balance QA
- Scope: normal-strength ZERO QA for jungle / volcano / swamp without `debugWeakBoss`; ruins ZERO remains post-release locked.
- Early-run QA found jungle stable, volcano level-up tempo acceptable, and swamp pressure slightly high in the first 20 seconds.
- Balance adjustments:
  - ZERO boss spawn times: `[95, 190, 285]` -> `[90, 180, 270]` seconds to reduce run fatigue while keeping three distinct phases.
  - ZERO phase gap: `42` -> `36` seconds to avoid overly long downtime between boss phases.
  - ZERO enemy HP scale: `1.34` -> `1.30`.
  - ZERO enemy damage scale: `1.18` -> `1.12`.
  - ZERO spawn rate scale: `1.24` -> `1.20`.
  - ZERO secondary boss HP/damage: `1.42 / 1.12` -> `1.34 / 1.10`.
  - ZERO final boss HP/damage: `1.95 / 1.24` -> `1.82 / 1.20`.
  - ZERO EXP multiplier: `1.18` -> `1.24` to make Lv8+ and all-adaptation Lv3+ upper-evolution conditions more reachable before the final phase.
- ZERO reward QA reconfirmed jungle -> `velociraptor_zero`, volcano -> `triceratops_zero`, swamp -> `tyrannosaurus_zero`, and ruins -> no route/title/frame reward.
- ZERO duplicate reward QA remains unchanged: second clears do not re-grant route, title, or frame rewards.
- Browser QA after tuning confirmed route starts and fast phase checks with no runtime console error/warn.
- Final polish candidates: full no-debug manual clear attempts, exact boss time-to-kill measurements per dino/evolution, and touch-control survivability tuning.

### MVP-156 Release Precheck
- No new asset generation was added in MVP-156.
- Release asset QA should prioritize visible chromakey residue in frequently seen ZERO specials, boss attacks, and stage gimmicks.
- Final polish should recheck sheet frame splitting, edge contact, and sprite/effect alpha issues on the public ZERO routes.
- Deferred asset work: ruins ZERO assets, fourth dinosaur assets, audio, PWA icon polish, and optional codex detail imagery.

### MVP-157 Mobile / PWA Asset Notes
- No new raster assets were generated in MVP-157.
- PWA icon and splash treatment remain deferred.
- Safe-area and fullscreen behavior should be checked again if PWA install-mode assets or manifest fields are added.
- Long soak QA should continue watching effect accumulation and visual clutter before any additional high-alpha effect assets are introduced.

### MVP-157b Mobile RC Asset / Soak Notes
- No assets were generated or replaced.
- Browser-equivalent ENDLESS and ZERO soaks were limited to 90 seconds each and produced no app runtime console error/warn.
- Physical-device long soaks should still watch high-alpha effects, ZERO boss attacks, and special effects for readability and accumulation before audio work is considered release-ready.

### MVP-158 Minimal Audio Assets

- Adopted local CC0 audio assets from Kenney for the first minimal audio pass.
- Audio files are stored in:
  - `public/assets/audio/bgm/`
  - `public/assets/audio/se/`
  - `public/assets/audio/ui/`
  - `public/assets/audio/evolution/`
  - `public/assets/audio/ultimate/`
  - `public/assets/audio/boss/`
- Source/license records:
  - `docs/assets/audio_credits_mvp158.md`
  - `docs/assets/audio_source_list_mvp158.json`
- BGM coverage:
  - title/home
  - normal/ENDLESS stage
  - ZERO
  - boss temporary cue
  - result jingle
- SE coverage:
  - UI select/confirm/cancel
  - attack, hit, defeat, pickup/level-up
  - evolution warning/burst
  - boss/ZERO warning
  - existing speed/hunting/attack/ZERO ultimate cues
- MVP-158 intentionally avoids final mix balancing, per-stage BGM, full enemy/attack SE coverage, environment ambience, and route-specific boss music. These remain MVP-160 audio full implementation tasks.
- Audio-source rule: external CDN or direct-link playback is prohibited; adopted audio must be copied into `public/assets/audio/` and listed in the credits/source JSON with URL, author, license, commercial-use status, credit requirement, and confirmation date.
## MVP-159 Final Polish Rules

- 新規キャラ、進化、ボス、必殺は色替えや簡易流用だけで本実装扱いにしない。仮実装で流用する場合は仕様書へ「仮」と明記する。
- 4x4 sprite sheet は見切れ、隣セル混入、右下透過、クロマキー残りを検査してから採用する。
- 公開前最終掃除では、UI装飾や意図的な発光を無差別に削らず、実画面で違和感が出るクロマキー残り・低アルファゴミだけを個別修正する。
- フォントは `public/assets/fonts/` に同梱し、外部CDN直読み込みをしない。ライセンスと出典は `docs/assets/font_credits_mvp159.md` に記録する。
- MVP-160では音声フル実装、ステージ/ボス別SE拡張、音量ミックス最終調整を候補とする。

### MVP-160 Full Audio Assets

- BGM / jingle source family: DOVA-SYNDROME, downloaded locally after checking the official license and terms.
- SE source family: 効果音ラボ, downloaded locally after checking the official terms.
- Source records:
  - `docs/assets/audio_credits_mvp160.md`
  - `docs/assets/audio_source_list_mvp160.json`
- Runtime rule remains unchanged: never stream from external URLs; all adopted files live under `public/assets/audio/`.
- New BGM files:
  - `title_home_full.mp3`
  - `home_cyber_room.mp3`
  - `stage_cyber_function.mp3`
  - `zero_cyber_battle.mp3`
  - `boss_midbattle.mp3`
  - `clear_jingle.mp3`
  - `zero_clear_jingle.mp3`
- New SE files:
  - `ui/*_full.mp3`
  - `se/*_full.mp3`
  - `boss/*_full.mp3`
  - `ultimate/*_full.mp3`
- MVP-158 Kenney CC0 audio remains in the tree as fallback / legacy material, but MVP-160 runtime IDs prefer the higher-quality DOVA / 効果音ラボ assets where implemented.
- Per-entry volume in `audio_catalog.js` is required for any future audio additions so pickup/hit/special sounds do not overwhelm BGM.

### MVP-160b SE Tail / Motion Polish

- Added dinosaur-specific normal attack SE from 効果音ラボ:
  - `public/assets/audio/se/raptor_claw_full.mp3`
  - `public/assets/audio/se/triceratops_impact_full.mp3`
  - `public/assets/audio/se/tyrannosaurus_bite_full.mp3`
- `trexBiteShock` now maps to `tyrannosaurus_bite_se` instead of the generic slash hit so the heavy bite motion has a closer low-impact cue.
- `audio_catalog.js` entries may define `durationHintMs`, `fadeOutMs`, `interruptGroup`, and `stopPrevious`; use these first when an otherwise-good SE has a tail that lingers too long.
- Combat spam controls were tightened for hit/pickup/ultimate sounds via lower volume, longer cooldown where needed, and lower max instance counts.
## MVP-160c Daily / Title / Research Text

- No new bitmap assets were required for MVP-160c.
- Home title and title-frame presentation uses the existing Graphics fallback and saved title/frame definitions.
- Daily mission UI continues to use `public/assets/ui/home/daily_mission_panel.png`.
- ResearchPt UI continues to use `public/assets/ui/research/icons/icon_research_pt.png`.
- If future title-frame PNGs are generated, they must remain optional; Home must continue to render the Graphics fallback when frame textures are missing.

## MVP-160d Title Select / Daily Reward

- No new bitmap assets were required for the title selection UI.
- Title selection uses Graphics panels/buttons and existing title/frame metadata.
- Daily reward display continues to use the Home daily panel asset, but rewards are ResearchPt-only.
- Future title-frame PNG assets can be added later without changing the save contract.

## MVP-160e Title UI Assets

- Generated source: `docs/assets/generated_raw/mvp160e_title_ui/title_ui_kit_source.png`
- Backup/report:
  - `docs/assets/backup/mvp160e_title_ui/`
  - `docs/assets/title_ui_mvp160e_contact.png`
  - `docs/assets/title_ui_mvp160e_report.json`
- Runtime assets:
  - `public/assets/ui/titles/title_select_panel.png`
  - `public/assets/ui/titles/title_select_tab_selected.png`
  - `public/assets/ui/titles/title_select_tab_inactive.png`
  - `public/assets/ui/titles/title_select_slot.png`
  - `public/assets/ui/titles/title_select_slot_selected.png`
  - `public/assets/ui/titles/title_select_button_equip.png`
  - `public/assets/ui/titles/title_select_button_close.png`
  - `public/assets/ui/titles/title_select_scroll_bar.png`
  - `public/assets/ui/titles/title_select_preview_frame.png`
  - `public/assets/ui/titles/title_frame_normal.png`
  - `public/assets/ui/titles/title_frame_hard.png`
  - `public/assets/ui/titles/title_frame_expert.png`
  - `public/assets/ui/titles/title_frame_zero_jungle.png`
  - `public/assets/ui/titles/title_frame_zero_volcano.png`
  - `public/assets/ui/titles/title_frame_zero_swamp.png`
- Asset rule: title selection UI must not regress to Graphics-only presentation except as fallback for missing textures.

## MVP-160f Title UI Layout Fix

- `title_select_slot.png` / `title_select_slot_selected.png` はカード高さ86pxへ拡張表示し、内部安全領域を確保する。
- `title_select_button_equip.png` はカード右下の安全領域内に収める。
- 今回は新規アセット生成なし。MVP-160e生成済みアセットを再利用し、コード側の配置とイベントを修正した。
## MVP-160f Title Frame Differentiation

- Added / regenerated title-frame assets:
  - `public/assets/ui/titles/title_frame_zero_deluxe.png`
  - `public/assets/ui/titles/title_frame_zero_jungle.png`
  - `public/assets/ui/titles/title_frame_zero_swamp.png`
- `zero_deluxe_frame` no longer maps to the jungle ZERO frame.
- Jungle ZERO and swamp ZERO frames were regenerated to avoid same-looking green/purple frame silhouettes.
- Source and QA files:
  - `docs/assets/generated_raw/mvp160f_title_frame_check/`
  - `docs/assets/backup/mvp160f_title_frame_check/`
  - `docs/assets/title_frames_mvp160f_contact.png`
  - `docs/assets/title_frame_check_mvp160f_report.json`

## MVP-161 Playfeel Assets

- No new bitmap assets were added.
- Stage and boss warning guides use runtime Graphics so they stay perfectly aligned with the active hitboxes.
- Existing warning/effect sprite sheets remain in use for flavor; the Graphics guide is the functional readability layer.
- Pickup feedback uses runtime Text and Graphics bursts to avoid adding many tiny pickup-label assets.

## MVP-162 RC Asset Notes

- No new assets were added during RC.
- MVP-161 warning guides remain runtime Graphics aligned to hitboxes, so there is no additional asset QA burden.
- No chromakey or frame-regeneration work was performed in MVP-162.

## MVP-163 Publish Asset Notes

- No new visual/audio assets were added in MVP-163.
- `public/` remains part of the publish target and includes game assets, fonts, audio, and intro video/audio.
- `docs/assets/backup/` and `docs/assets/generated_raw/` are sizable but kept as development provenance for now.
- `tmp/` is explicitly ignored because it contains browser profile/cache data and must not be published.
- Public repository consumers should refer to audio and asset license notes before reusing individual assets outside this project.

## Seranox Hunting Sheet / Player Damage SE Final Polish

- `public/assets/dinos/evolutions/sheets/triceratops_hunting_sheet.png`
  - セラノクスの idle 行にあった浮いた体勢/弧状の混入を、接地が揃っている move 行ベースの4フレームへ差し替えた。
  - 4x4構造、右向き基準、接地ラインを維持し、`frameEdgeIssues: 0` を確認。
  - 比較/検査: `docs/assets/seranox_hunting_sheet_fix_contact.png`, `docs/assets/seranox_hunting_sheet_fix_report.json`
- `player_damage` / `hit`
  - 斬撃寄りだった `player_damage_full.mp3` から、重めの被弾感に近い `triceratops_impact_full.mp3` へ割り当てを変更。
  - SEの尾を短く保つため、`durationHintMs` と `fadeOutMs` を維持している。
- Page resume audio:
  - ページ復帰後の初回タップで UI/SE が沈黙しないよう、AudioContext 復帰時に一時SEの cooldown / active count をリセットする。
## Post-RC Evolution Normal Attack Effects

- Replaced the simple Graphics-driven normal attack visuals for evolved dinosaurs with dedicated generated effect sprites.
- Scope: all public evolution branches for Velociraptor, Triceratops, and Tyrannosaurus, including ZERO reward evolutions.
- New assets live under `public/assets/effects/attacks/evolutions/`.
- Runtime rule:
  - Evolution branches define `normalAttackEffectKey` in `evolution_data.js`.
  - `CombatSystem.applyEvolution()` loads that texture and uses it for evolved normal attacks.
  - If the texture is missing or still loading, the existing Graphics fallback remains active.
- Generated asset list:
  - `velociraptor_speed_slash.png`
  - `velociraptor_hunting_fang.png`
  - `velociraptor_attack_impact.png`
  - `velociraptor_zero_abyss_slash.png`
  - `triceratops_speed_charge.png`
  - `triceratops_hunting_pulse.png`
  - `triceratops_attack_quake.png`
  - `triceratops_zero_ignis_charge.png`
  - `tyrannosaurus_speed_bite.png`
  - `tyrannosaurus_hunting_fang_wave.png`
  - `tyrannosaurus_attack_bite_burst.png`
  - `tyrannosaurus_zero_omega_bite.png`
- QA artifacts:
  - `docs/assets/evolution_normal_attack_effects_contact.png`
  - `docs/assets/evolution_normal_attack_effects_report.json`
- Future polish:
  - Recheck exact on-screen scale per branch during manual combat QA.
  - If any effect feels too large on mobile, adjust only `getEvolutionNormalAttackEffectSize()` rather than regenerating assets.

## Post-RC Heal Pickup Readability

- HP recovery pickups now use a stronger green-white glow and a subtle pulse so they stand out from EXP crystals and combat effects.
- Heal amount is based on max HP (`18%`, minimum `14`) and popup text is rounded to an integer.
- Dedicated evolution normal attack effects are expected for all public evolution routes; the selected evolution object must carry `normalAttackEffectKey` into combat setup.

## MVP-A01: Spinosaurus Asset Addition

- Added dedicated Spinosaurus base, 3 normal evolutions, and future ZERO evolution assets.
- Added generated report: `docs/assets/spinosaurus_addition_report.json`.
- Added contact sheet: `docs/assets/spinosaurus_addition_contact.png`.
- Sprite/effect QA target: 4x4 sheets, transparent background, frameEdgeIssues 0.
- Do not treat simple recolors or hero cutouts as complete for fifth/sixth dinosaurs.

## MVP-A01b Spinosaurus Asset And UI Cleanup

- Replaced the Spinosaurus family assets at their existing runtime paths with dedicated water/abyss themed raster assets.
- Re-registered Spinosaurus assets inside the correct manifest groups (`dinos`, `dinoSelectHero`, `evolutionSheets`, `evolutionHeroes`, `evolutionPortraits`, `evolutionSpecialIcons`, `normalAttackEffects`, `specialEffects`) so runtime lookup no longer falls through to generic fallback keys.
- Added QA output: `docs/assets/spinosaurus_a01b_report.json` and `docs/assets/spinosaurus_a01b_contact.png`.
- All generated Spinosaurus sprite/effect sheets are checked with `frameEdgeIssues: 0`.
- Codex top dinosaur selector now uses a masked horizontal swipe area so 4+ dinosaurs do not overflow the screen.
- Research unlock UI now shows Research Pt-only cost clearly and saves `unlockedDinos.spinosaurus` after purchase.


## MVP-A01d Spinosaurus Runtime Asset Extraction

- MVP-A01c?????????????????5??base / speed / hunting / attack / zero?????????PNG???????
- A01b?????/procedural/fallback?????????????????????????A01d???????????
- 4x4 sprite sheet?1024x1024?1??256px??????frameEdgeIssues?0??
- ????????ZERO????????A01c??????/?/??/?????????16????sheet???????
- ???: docs/assets/spinosaurus_a01d_contact.png / docs/assets/spinosaurus_a01d_ingame_compare.png / docs/assets/spinosaurus_a01d_report.json?
## MVP-A02 Asset Impact

- No new Home UI bitmap generation is required for MVP-A02.
- Existing Home panel assets are reused:
  - `public/assets/ui/home/daily_mission_panel.png`
  - `public/assets/ui/home/record_panel.png`
  - `public/assets/ui/home/unlock_status_panel.png`
  - `public/assets/ui/home/sortie_button_frame.png`
- The tab strip is drawn in code to avoid adding more small UI assets before the PWA/loading pass.
- Future fifth/sixth dinosaur additions should not require new always-visible Home panels. Add new summary fields to the Home tabs or a later detail surface.
- Next asset-heavy phases remain loading optimization, PWA icons/manifest, and post-release content assets.

## MVP-A02b Home Common Panel Assets

- Generated one shared Home lower information panel and shared tab frames for Daily / Record / Unlock.
- New runtime assets:
  - `public/assets/ui/home/home_info_panel_common.png`
  - `public/assets/ui/home/home_info_panel_common_active_glow.png`
  - `public/assets/ui/home/home_info_tab_selected.png`
  - `public/assets/ui/home/home_info_tab_inactive.png`
- Generated source is preserved at `docs/assets/generated_raw/mvp_a02b_home_panel/home_panel_common_sheet_chromakey.png`.
- The previous tab-specific panel assets remain in the repo for compatibility, but normal Home A02b layout prefers the new common panel manifest keys.
- QA artifacts:
  - `docs/assets/home_panel_common_mvp_a02b_contact.png`
  - `docs/assets/home_panel_common_mvp_a02b_report.json`
- Future Home content should switch text and rows inside the common panel instead of adding one panel background per tab.

## MVP-A03 Loading Group Asset Policy

- Asset loading is now grouped by route timing rather than allowing every screen constructor to start loading at boot.
- `AssetLoader` owns group membership and request dedupe for `boot`, `home`, `stageSelect`, `dinoSelect`, `research`, `options`, `codex`, `battle`, `zero`, `stage:<id>`, and `dino:<id>`.
- Boot group is intentionally small and contains only title-critical UI assets.
- Home / Codex / Stage / Dino / Play assets are loaded on first route entry and then reused from the loader cache.
- Audio boot preload is reduced to UI feedback and title BGM. Stage/Boss/ZERO/Result audio is left for later playback or play-start timing.
- Reports:
  - `docs/assets/loading_a03_current_report.md`
  - `docs/assets/loading_a03_current_report.json`
  - `docs/assets/loading_a03_after_report.md`
  - `docs/assets/loading_a03_after_report.json`

## MVP-A04 Visibility Assist

- Add `視認性補正` as a runtime display option instead of regenerating stage backgrounds.
- The option uses three levels: `standard`, `bright`, and `high`.
- Runtime treatment:
  - background layer alpha: `0.94` / `0.98` / `1.0`
  - background lift: none / subtle cyan-white lift / slightly stronger cyan-white lift
  - vignette multiplier: `1.0` / `0.82` / `0.68`
  - hazard guide alpha boost: `1.0` / `1.12` / `1.24`
  - player/enemy/boss outline assist: disabled at standard, subtle at bright/high
- This is a visibility correction layer only. Do not replace background art, recolor dinosaur assets, or turn the playfield into a bright daytime look.
- QA should prioritize swamp, volcano, ruins, ZERO, and dark Spinosaurus body readability on mobile Safari/Chrome.

## MVP-A05 Play Fix Assets

- Corrected normal attack effects:
  - `public/assets/effects/attacks/evolutions/tyrannosaurus_hunting_fang_wave.png`
  - `public/assets/effects/attacks/evolutions/tyrannosaurus_attack_bite_burst.png`
- Backups are stored in `docs/assets/backup/mvp_a05/`.
- `triceratops_attack_sheet.png` move row middle frames were vertically stabilized to reduce the jumping read.
- Added locked Spinosaurus silhouette:
  - `public/assets/dinos/locked/spinosaurus_locked_silhouette.png`
- Added Spinosaurus water normal attack SE:
  - `public/assets/audio/se/spinosaurus_water_slash.wav`
- QA artifacts:
  - `docs/assets/fix_attack_effects_mvp_a05_contact.png`
  - `docs/assets/fix_attack_effects_mvp_a05_report.json`
  - `docs/assets/boss_clear_effect_mvp_a05_report.md`

## MVP-A06 PWA Install Assets

- Added PWA icons:
  - `public/assets/icons/icon-192.png`
  - `public/assets/icons/icon-512.png`
  - `public/assets/icons/icon-512-maskable.png`
  - `public/apple-touch-icon.png`
- Added install metadata:
  - `public/manifest.webmanifest`
  - `public/service-worker.js`
- A06 service worker intentionally does not precache game images, audio, JS, CSS, or HTML.
- Manifest/icon pathing is designed for GitHub Pages under `/EVOLUTION-ZERO/`.
- MVP-A06b keeps the same assets and only verifies endpoints/runtime behavior; no new cache-heavy assets are added.

## MVP-A06c Official PWA Icon Replacement

- Replaced the temporary PWA icon art with the provided official EVOLUTION ZERO app icon source.
- Updated generated icon files in place:
  - `public/assets/icons/icon-192.png`
  - `public/assets/icons/icon-512.png`
  - `public/assets/icons/icon-512-maskable.png`
  - `public/apple-touch-icon.png`
- Source and QA outputs:
  - conversation attachment `ChatGPT Image 2026年5月26日 22_38_16.png`
  - `docs/assets/pwa_icon_mvp_a06c_contact.png`
  - `docs/assets/pwa_icon_mvp_a06c_report.json`
- `manifest.webmanifest` and `index.html` keep the same stable icon paths.

## MVP-A06d PWA Update Notice

- No new large assets are added.
- Service worker cache scope remains minimal and does not precache gameplay assets.
- Added app version/update logic in code only:
  - `src/data/app_version.js`
  - `src/main.js`
  - `src/ui/title_screen.js`
  - `src/ui/home_screen.js`
  - `src/core/screen_manager.js`
- Auto-apply is limited to Title and Home and does not show a user-facing update prompt. Result/Play keep updates pending until a safe surface is visible.

## MVP-A06e PWA Standalone Viewport Adjustment

- No asset changes.
- PWA standalone/fullscreen CSS now keeps the top safe-area inset, caps the bottom gutter, removes the previous 430px/844px app cap, and applies a small 1.05 top-centered visual scale so iPhone Home Screen launches can use more of the available display area.
- Standard Safari/browser layout keeps the conservative safe-area sizing.
## MVP-A07 UI / Balance Follow-up

- No new large raster asset pack was added in this pass.
- Home uses existing generated home panel and sortie button assets, with a runtime readable name plate and notice line.
- Evolution candidate cards now prefer existing hero art inside the card when available instead of simple marker-only cards.
- Further polish candidate: regenerate the sortie button frame as a dedicated textless launch frame if a future art pass is scheduled.
## MVP-A07b Dedicated UI Assets

- Added Home news UI assets:
  - `public/assets/ui/home/news_entry_button_a07b.png`
  - `public/assets/ui/home/news_panel_a07b.png`
  - `public/assets/ui/home/news_list_card_a07b.png`
  - `public/assets/ui/home/news_detail_panel_a07b.png`
- Added boss / ZERO notice assets:
  - `public/assets/ui/hud/boss_warning_panel_a07b.png`
  - `public/assets/ui/hud/boss_appear_alert_chip_a07b.png`
  - `public/assets/ui/hud/zero_phase_notice_panel_a07b.png`
  - `public/assets/ui/hud/zero_final_notice_panel_a07b.png`
- Added selection assets:
  - `public/assets/ui/selection/evolution_candidate_card_a07b.png`
  - `public/assets/ui/selection/fallback_reward_card_a07b.png`
- All are text-free PNGs; runtime code renders labels and body copy for localization and future update reuse.

## MVP-A07c Generated UI Replacement

- A07c generated a text-free illustrated UI source sheet and 18 adopted PNG assets.
- Runtime paths now prefer A07c assets for news, boss/ZERO notices, evolution candidates, and fallback reward cards.
- A07b assets remain as historical artifacts but are classified as simple and not the preferred runtime route.
- QA artifacts: `docs/assets/a07c_ui_assets_contact.png`, `docs/assets/a07c_ui_assets_report.json`, `docs/a07b_asset_quality_audit_mvp_a07c.md`, and `docs/a07b_asset_quality_audit_mvp_a07c.json`.
## MVP-A07d News UI Asset Polish

- Added generated A07d news UI assets under `public/assets/ui/home/`.
- Normal route now uses:
  - `news_button_a07d.png`
  - `news_panel_outer_a07d.png`
  - `news_list_item_a07d.png`
  - `news_button_close_a07d.png`
  - `news_button_back_a07d.png`
  - `news_badge_update_a07d.png`
- A07c news assets remain in the repository for traceability but are no longer referenced by the normal news UI.
- The A07d policy is a shared outer frame, minimal inner decoration, and code-rendered text over a matte readable surface.

## MVP-A07e News UI Final Adjustment

- No new replacement assets were required.
- News modal button placement was corrected in code so close/back controls sit inside the A07d outer frame.
- The modal overlay now acts as the outside-click close target while the panel captures internal taps.
- Home news entry text was enlarged and centered over `news_button_a07d.png`.

## MVP-A07e.1 News UI Micro Adjustment

- No new replacement assets were required.
- Home news entry text was increased and re-centered over the existing A07d button asset.
- The detail close button was removed from the normal detail route; only the back button remains in-frame.
- The detail back button was moved inward to avoid the outer frame decoration.

## MVP-A07e.2 News UI Micro Adjustment

- No new replacement assets were required.
- The news close button is removed from both list and detail views in code.
- Closing the modal is handled by tapping outside the A07d frame.
- The Home news button text was nudged downward over the existing `news_button_a07d.png`.

## MVP-A08 Result UI Redesign

- Added generated text-free result UI assets:
  - `public/assets/ui/result/result_summary_panel_a08.png`
  - `public/assets/ui/result/result_reward_panel_a08.png`
  - `public/assets/ui/result/result_reward_row_a08.png`
  - `public/assets/ui/result/result_next_button_a08.png`
  - `public/assets/ui/result/result_retry_button_a08.png`
  - `public/assets/ui/result/result_home_button_a08.png`
  - `public/assets/ui/result/result_clear_header_a08.png`
  - `public/assets/ui/result/result_gameover_header_a08.png`
  - `public/assets/ui/result/result_endless_header_a08.png`
  - `public/assets/ui/result/result_zero_clear_header_a08.png`
- Runtime result flow now uses a summary panel first and a reward panel second.
- Old result Graphics panels remain fallback only. Normal route should prefer A08 PNG assets from the manifest.
- QA/contact artifacts: `docs/assets/result_ui_a08_contact.png`, `docs/assets/result_ui_a08_report.json`, and `docs/assets/result_ui_a08_audit.md`.

## MVP-A09 Boss / ZERO Notice Polish

- No new bitmap replacement assets were required.
- Existing A07c assets remain the preferred runtime path:
  - `public/assets/ui/hud/boss_notice_panel_a07c.png`
  - `public/assets/ui/hud/boss_notice_alert_chip_a07c.png`
  - `public/assets/ui/hud/zero_notice_panel_a07c.png`
  - `public/assets/ui/hud/zero_final_protocol_panel_a07c.png`
- A09 adjusts placement, duration, text safe area, fade, pulse, and overlay alpha in code only.
- Audit artifact: `docs/assets/a09_boss_notice_audit.md`.

## MVP-A10 Unfinished UI Asset Replacement

- Added generated text-free A10 UI assets for the limited A10 target scope.
- Home sortie assets:
  - `public/assets/ui/home/sortie_button_frame_a10.png`
  - `public/assets/ui/home/sortie_button_left_icon_a10.png`
  - `public/assets/ui/home/sortie_button_glow_a10.png`
  - `public/assets/ui/home/sortie_panel_a10.png`
- Evolution candidate assets:
  - `public/assets/ui/selection/evolution_card_panel_a10.png`
  - `public/assets/ui/selection/evolution_card_selected_a10.png`
  - `public/assets/ui/selection/evolution_card_portrait_frame_a10.png`
  - `public/assets/ui/selection/evolution_card_type_chip_a10.png`
  - `public/assets/ui/selection/evolution_card_button_select_a10.png`
- Evolution presentation assets:
  - `public/assets/ui/evolution/evolution_unlock_panel_a10.png`
  - `public/assets/ui/evolution/evolution_unlock_frame_a10.png`
  - `public/assets/ui/evolution/evolution_unlock_glow_a10.png`
- Source/contact/report artifacts:
  - `docs/assets/a10_ui_source_sheet.png`
  - `docs/assets/a10_ui_contact.png`
  - `docs/assets/a10_ui_report.json`
- Runtime text and portraits stay code-rendered. Existing older assets are retained but are no longer preferred for the A10 routes.

## MVP-A10b Evolution UI Asset Replacement

- Added generated text-free A10b assets for the remaining evolution UI surfaces.
- Level-up branch reaction assets:
  - `public/assets/ui/selection/evolution_reaction_panel_a10b.png`
  - `public/assets/ui/selection/evolution_reaction_glow_a10b.png`
  - `public/assets/ui/selection/evolution_reaction_chip_a10b.png`
- Evolution selection background assets:
  - `public/assets/ui/selection/evolution_select_background_a10b.png`
  - `public/assets/ui/selection/evolution_select_overlay_a10b.png`
- Play HUD BRANCH assets:
  - `public/assets/ui/hud/branch_panel_a10b.png`
  - `public/assets/ui/hud/branch_icon_frame_a10b.png`
  - `public/assets/ui/hud/branch_glow_a10b.png`
- Source/contact/report artifacts:
  - `docs/assets/a10b_evolution_ui_source_sheet.png`
  - `docs/assets/a10b_branch_ui_source_sheet.png`
  - `docs/assets/a10b_evolution_ui_contact.png`
  - `docs/assets/a10b_evolution_ui_report.json`
- Runtime labels and branch portraits remain code-rendered. Graphics fallback remains only for missing textures.
## MVP-A10c Level-up / Evolution UI Polish

- Added generated A10c stat upgrade cards and icons:
  - `public/assets/ui/selection/levelup_stat_card_common_a10c.png`
  - `public/assets/ui/selection/levelup_stat_card_hp_a10c.png`
  - `public/assets/ui/selection/levelup_stat_card_attack_a10c.png`
  - `public/assets/ui/selection/levelup_stat_card_speed_a10c.png`
  - `public/assets/ui/selection/levelup_stat_card_rate_a10c.png`
  - `public/assets/ui/selection/levelup_stat_card_pickup_a10c.png`
  - `public/assets/ui/selection/levelup_stat_icon_hp_a10c.png`
  - `public/assets/ui/selection/levelup_stat_icon_attack_a10c.png`
  - `public/assets/ui/selection/levelup_stat_icon_speed_a10c.png`
  - `public/assets/ui/selection/levelup_stat_icon_rate_a10c.png`
  - `public/assets/ui/selection/levelup_stat_icon_pickup_a10c.png`
- Source/contact/report artifacts:
  - `docs/assets/a10c_levelup_evolution_ui_source_sheet.png`
  - `docs/assets/a10c_levelup_rate_ui_source_sheet.png`
  - `docs/assets/a10c_levelup_evolution_ui_contact.png`
  - `docs/assets/a10c_levelup_evolution_ui_report.json`
- A10c keeps text code-rendered, improves branch reaction contrast, simplifies stat copy, tightens evolution candidate card layout, and enlarges BRANCH HUD portrait display.
## MVP-A10d Level-up / Evolution UI Fix

- A10d adopts embedded icons for A10c stat cards and disables code-side stat icon overlay on normal stat cards.
- Added audit/contact/report artifacts:
  - `docs/assets/a10d_stat_card_icon_audit.md`
  - `docs/assets/a10d_levelup_evolution_ui_contact.png`
  - `docs/assets/a10d_levelup_evolution_ui_report.json`
- Evolution candidate cards now receive branch `heroPath`/`portraitPath` and prefer portrait images for card display.
- BRANCH HUD portrait route remains required, with fallback only for missing textures.
## MVP-A10d.1 Level-up / Evolution UI Fix

- Added A10d.1 stat card tone variants under `public/assets/ui/selection/`.
- Candidate cards and BRANCH HUD now draw the portrait sprite above the generated frame interior to avoid hidden/blank icon areas.
- QA artifacts:
  - `docs/assets/a10d1_levelup_stat_card_qa.png`
  - `docs/assets/a10d1_evolution_portrait_qa.png`
  - `docs/assets/a10d1_branch_portrait_qa.png`
  - `docs/assets/a10d1_report.json`

## MVP-A10d.2 HUD Base / Branch Role Split

- Upper-left HUD portrait now stays on the selected base dinosaur for the full run.
- BRANCH HUD owns the evolved destination portrait and display name.
- QA screenshots:
  - `docs/assets/a10d2_hud_branch_velociraptor_qa.png`
  - `docs/assets/a10d2_hud_branch_triceratops_qa.png`
  - `docs/assets/a10d2_hud_branch_tyrannosaurus_qa.png`
  - `docs/assets/a10d2_hud_branch_spinosaurus_zero_qa.png`
  - `docs/assets/a10d2_hud_branch_velociraptor_zero_qa.png`

## MVP-A10d.3 HUD Overlap Layout

- No new assets were added for A10d.3.
- Boss / ZERO notices keep their existing A07c generated panels.
- BRANCH keeps the A10b generated panel/frame/glow assets.
- Runtime layout now suppresses the boss HP bar while boss / ZERO notices are visible.
- When BRANCH is active and the notice has ended, the boss HP bar is restored lower in the HUD to avoid overlap.
- Audit and QA notes: `docs/assets/a10d3_hud_overlap_audit.md`.

## MVP-A10d.4 Result Subtitle Spacing

- No new result assets were added.
- Runtime layout moves the result subtitle line upward to avoid overlap with the main result/reward panel.
- Existing A08 result panels/buttons remain unchanged.

## MVP-A12 Management UI Readability

- No new raster UI panels were generated for A12.
- Existing research, codex, and options assets remain in use; readability was improved through runtime text, spacing, and status-label changes.
- Added QA/contact/report artifacts:
  - `docs/assets/a12_research_qa.png`
  - `docs/assets/a12_codex_qa.png`
  - `docs/assets/a12_options_qa.png`
  - `docs/assets/a12_management_ui_contact.png`
  - `docs/assets/a12_management_ui_report.json`

## MVP-A12b Management UI Asset Refresh

- Added generated common management UI source/contact/report:
  - `docs/assets/a12b_management_ui_source_sheet.png`
  - `docs/assets/a12b_management_ui_contact.png`
  - `docs/assets/a12b_management_ui_report.json`
  - `docs/assets/a12b_management_ui_asset_audit.md`
  - `docs/assets/a12b_management_ui_asset_audit.json`
- Added shared management assets:
  - `public/assets/ui/management/management_panel_outer_a12b.png`
  - `public/assets/ui/management/management_card_panel_a12b.png`
  - `public/assets/ui/management/management_card_selected_a12b.png`
  - `public/assets/ui/management/management_resource_chip_a12b.png`
- Added and connected research/codex/options A12b assets:
  - `public/assets/ui/research/research_card_ready_a12b.png`
  - `public/assets/ui/research/research_card_done_a12b.png`
  - `public/assets/ui/research/research_card_locked_a12b.png`
  - `public/assets/ui/research/research_button_study_a12b.png`
  - `public/assets/ui/codex/codex_card_known_a12b.png`
  - `public/assets/ui/codex/codex_card_locked_a12b.png`
  - `public/assets/ui/codex/codex_card_zero_a12b.png`
  - `public/assets/ui/codex/codex_selector_chip_a12b.png`
  - `public/assets/ui/options/options_section_panel_a12b.png`
  - `public/assets/ui/options/options_slider_row_a12b.png`
  - `public/assets/ui/options/options_toggle_on_a12b.png`
  - `public/assets/ui/options/options_toggle_off_a12b.png`
- Runtime text remains code-rendered. Graphics fallback is retained only for missing generated textures.
## MVP-A12c Management UI Micro Polish

- No new raster assets were generated for A12c.
- Research copy was simplified in `src/data/research.js`.
- Codex selector image placement was adjusted and the bottom note was removed from the normal visual flow.
- Options screen visual density was reduced through alpha tuning rather than extra decoration.
## MVP-A12d Spinosaurus Hero Cleanup

- Spinosaurus hero and portrait PNGs were cleaned with a detached-fragment pass while preserving the main alpha component.
- Backup copies are kept locally under `docs/assets/backup/a12d_spinosaurus_hero_cleanup/` but should not be pushed unless explicitly needed.
- QA/report artifacts:
  - `docs/assets/a12d_spinosaurus_hero_cleanup_contact.png`
  - `docs/assets/a12d_spinosaurus_hero_cleanup_report.json`
## MVP-A11 Gameplay Tuning Note

MVP-A11 did not add or replace visual assets.

Changed area:

- Gameplay balance only.
- Enemy pressure, difficulty multipliers, adaptation skill values, dinosaur identities, evolution bonuses, and ZERO ultimate values.

No new image/audio asset generation is required for this MVP.

## MVP-A11b Spinosaurus Icon Artifact Cleanup

- Cleaned detached top fragments from existing spinosaurus portrait assets used by selector/HUD icon contexts:
  - `public/assets/dinos/portraits/spinosaurus.png`
  - `public/assets/dinos/evolutions/portraits/spinosaurus_speed_portrait.png`
  - `public/assets/dinos/evolutions/portraits/spinosaurus_hunting_portrait.png`
  - `public/assets/dinos/evolutions/portraits/spinosaurus_attack_portrait.png`
  - `public/assets/dinos/evolutions/portraits/spinosaurus_zero_portrait.png`
- No new dedicated thumbnail files were required; the existing formal portrait paths remain the runtime source.
- HUD rendering now contains base and BRANCH portraits inside their generated frames with aspect-preserving fit.
- QA/contact/report artifacts:
  - `docs/assets/a11b_spino_icon_artifact_audit.md`
  - `docs/assets/a11b_spino_icon_artifact_contact.png`
  - `docs/assets/a11b_spino_icon_artifact_report.json`

## MVP-A11d Evolution / Attack Display Fix

- No new assets were generated.
- Evolution candidate portraits now use smaller safe-box fitting in the existing A10 card frame.
- Triceratops ZERO is connected to the formal `triceratopsZero` sprite sheet.
- Spinosaurus normal attack data was adjusted so the formal water slash effect better matches its hit area near the player.

## MVP-A11d.2 Ignicera Player Sheet Replacement

- Replaced `public/assets/dinos/evolutions/sheets/triceratops_zero_sheet.png` because the old player sheet read too much like a different / boss-like character in gameplay.
- Kept the existing Ignicera hero and portrait assets.
- The new sheet is a player-scale triceratops ZERO form with broad frill, three horns, volcanic armor, lava cracks, and purple ZERO core.
- Chroma-key removal and per-cell cleanup were applied; final frame edge issues are 0.
- QA artifacts:
  - `docs/assets/a11d2_ignicera_asset_content_audit.md`
  - `docs/assets/a11d2_ignicera_contact.png`
  - `docs/assets/a11d2_ignicera_report.json`

## MVP-A13 Tutorial and Level-up Text

- No new raster assets were generated for A13.
- The tutorial modal uses code-rendered panels and text to keep copy flexible and readable.
- Existing UI tone is reused: dark panel, cyan/gold accents, short Japanese runtime text.
- Level-up cards were updated through runtime text layout rather than new card art.

## MVP-A13b Tutorial UI Asset Reuse

- A13b reuses formal UI assets instead of adding new raster files:
  - `assets/ui/management/management_panel_outer_a12b.png`
  - `assets/ui/options/option_button_frame_v3.png`
  - `assets/ui/home/news_badge_update_a07d.png`
- Graphics are used only for spotlight masking, highlight strokes, pointer lines, and fallback drawing.
- QA artifacts:
  - `docs/assets/a13b_tutorial_ui_contact.png`
  - `docs/assets/a13b_tutorial_ui_report.json`

## MVP-A13b.1 Tutorial UI Polish

- No new raster assets were generated.
- Existing A12b/A07d assets remain in use, with decoration kept secondary to readable runtime text.
- The full-screen overlay now acts as a pointer blocker, while the spotlight and panel remain code-rendered.

## MVP-A13b.2 Tutorial Text Panel

- Added `public/assets/ui/tutorial_text_panel_simple_a13b2.png`.
- The panel is a simple outer-frame-only tutorial text surface with a dark interior and no baked text.
- It replaces the A12b management panel in the tutorial overlay because the previous right-top ornament could compete with copy.

## MVP-A13b.3 Tutorial Release Prep

- No additional tutorial art was generated.
- The A13b.2 simple panel remains the runtime tutorial panel.
- Public-facing update news and `VERSION 0.8.2` are part of the release push.

## MVP-C01 Gamepad Support

- No new raster UI assets were generated.
- Gamepad connect/disconnect notices use code-rendered HUD graphics and runtime text.
- Existing touch and HUD assets remain unchanged.

## MVP-C02 Gamepad Menu Support

- No new raster assets were generated.
- Controller connection notices, debug overlay, and the virtual mouse cursor are code-rendered.
- Existing screen assets remain unchanged.
- The overlay/cursor graphics use `eventMode = none` and do not block touch or mouse input.
- Right-stick menu scrolling reuses existing wheel/scroll behavior; no scroll-specific raster asset was added.

## MVP-A14 Boss Finish Effects

- A14 adds generated effect-only boss finish assets:
  - `public/assets/effects/boss/boss_death_explosion_a14.png`
  - `public/assets/effects/boss/boss_death_shockwave_a14.png`
  - `public/assets/effects/boss/zero_boss_death_core_a14.png`
- These assets intentionally do not include a boss body, silhouette, or species-specific form.
- The standard boss finish uses the explosion and shockwave assets.
- ZERO final finish adds the ZERO core asset for a stronger climax.
- Flash, shake, SE, and small runtime particles support the generated effect layer without becoming the main visual.
- A first generated explosion candidate that included a boss-like body was rejected so the final assets stay reusable across all bosses.
- QA/report artifacts:
  - `docs/assets/a14_boss_death_contact.png`
  - `docs/assets/a14_boss_death_report.json`

## MVP-A14.1 Difficulty Reinforcement

- No new raster assets were generated.
- A14.1 is a gameplay-number pass only.
- Existing A14 boss finish effect assets remain in use:
  - `public/assets/effects/boss/boss_death_explosion_a14.png`
  - `public/assets/effects/boss/boss_death_shockwave_a14.png`
  - `public/assets/effects/boss/zero_boss_death_core_a14.png`
- Enemy level, spawn density, EXP requirement, and boss scaling changes are documented in the design specs.
## MVP-A15 Adaptation Synergy

- No new raster art was required for A15.
- Synergy activation uses a runtime HUD notice with layered glow/stroke drawing and the existing `evolution_ready` SE.
- The persistent synergy HUD uses compact runtime text (`高速Ⅱ`, `狩猟Ⅰ`, `攻撃Ⅱ`) so localization remains code-side.
- Future art replacement candidate: a dedicated synergy notice panel and small synergy chips if the HUD needs stronger visual identity.

## MVP-A15.2 Adaptation Research / Critical Feedback

- No new raster assets were generated.
- Synergy HUD overlap with BRANCH is handled by runtime positioning.
- `CRITICAL` feedback is code-rendered in the existing damage number layer for adaptation-skill critical hits.
- Adaptation Analysis and Adaptation Enhancement Theory use existing research card/icon assets.
