# EVOLUTION ZERO Dino Select UI Spec

## 目的

恐竜選択画面は、恐竜の恒久育成画面ではなく、出撃前に戦い方を選ぶ画面として扱う。
MVP-073時点では `references/ui/dino_select_ui_v3.png` を正本参照にし、ステージ選択画面と同じUIシリーズに見える品質を目標にする。

## 最重要参照

- `references/ui/dino_select_ui_v3.png`

関連参照:

- `references/ui/stage_select_ui_v2.png`
- `references/ui/home_ui_v3.png`

## UIトーン

- 暗色研究施設UI
- DNA発光
- 半透明パネル
- 硬質SF
- シアン / アンバー / 赤警告
- スマホ縦1画面完結
- 文字可読性優先

ポップ、可愛い、漫画調、汎用ファンタジーUIには寄せない。

## 画面構成

上から順に以下の構成を維持する。

1. 戻るボタン
2. 画面タイトル
3. 恐竜カード列
4. 選択中恐竜の詳細パネル
5. 戦闘記録 / 初期特徴パネル
6. 出撃開始ボタン

## 表示情報

選択中恐竜には以下を表示する。

- 恐竜名
- 戦闘タイプ
- 戦い方説明
- 発見済み分岐
- 出撃回数
- 最長生存
- 最高撃破
- 初期特徴

## 文言ルール

禁止:

- `Lv`
- `レベル`
- `育成レベル`
- 恒久レベル制に見える表現
- 一本道進化に見える表現

推奨:

- `発見済み分岐`
- `戦闘タイプ`
- `初期特徴`
- `出撃回数`
- `最長生存`
- `最高撃破`

恐竜は「成長対象」ではなく「今回の戦い方の選択」として見せる。

未解放恐竜で使用する文言:

- `未解放`
- `解析待ち`
- `DNA研究で解放`
- `条件未達`
- `未解析`
- `解析データ不足`

未解放恐竜でも、恐竜ごとの恒久レベル不足に見える文言は使わない。

## 使用UIアセット

保存先:

- `public/assets/ui/dino_select/`

使用中アセット:

- `dino_card_frame.png`
- `dino_card_frame_selected.png`
- `locked_dino_frame.png`
- `dino_detail_panel.png`
- `combat_type_badge.png`
- `branch_count_badge.png`
- `stat_panel.png`
- `sortie_button_frame.png`
- `screen_backdrop.png`
- `../stage_select/back_button_frame.png` shared as the back button frame

画像には日本語、英字、数字、ロゴを焼き込まない。
UI文言はPixiJS Textで表示し、翻訳・短縮・可読性調整をコード側で行う。

## 恐竜表示

- 恐竜選択画面専用のポートレートPNGをカード表示に使用する。
- 恐竜選択画面専用のhero PNGを詳細表示に使用する。
- アセット未配置の恐竜はfallbackシルエットで表示する。
- 新規恐竜を追加するときも、カード用 `*_portrait.png` と詳細用 `*_hero.png` を分けて作成する。

保存先:

- `public/assets/dinos/dino_select/velociraptor_portrait.png`
- `public/assets/dinos/dino_select/triceratops_portrait.png`
- `public/assets/dinos/dino_select/tyrannosaurus_portrait.png`
- `public/assets/dinos/dino_select/velociraptor_hero.png`
- `public/assets/dinos/dino_select/triceratops_hero.png`
- `public/assets/dinos/dino_select/tyrannosaurus_hero.png`

`*_portrait.png` はカード選択用、`*_hero.png` は詳細画面用として扱う。
カード用は一覧性を優先した横向き全身シルエットでよい。
詳細用は画面に向かってポーズする三-quarter正面構図を推奨する。

詳細用heroの構図ルール:

- こちらを向いて少し左を向く。
- 吠える、威嚇する、踏み込む、攻撃するなど迫力のあるポーズにする。
- 頭、前脚、爪、角、牙などが大きく読めるようにする。
- 画面下の影はコード側で描画するため、画像内に影を焼き込まない。
- 頭、角、口、前脚、爪を見切らせない。

これらは恐竜選択画面専用であり、プレイ中スプライトとは別管理にする。

## 未解放恐竜表示

MVP-075時点では新恐竜を本番データに追加しない。
ただし、今後4体目以降の恐竜を追加する前提で、恐竜データは以下のロック情報を扱える構造にする。

- `locked`: `true` の場合は未解放扱い
- `unlockCondition`: 解放条件の短い表示文
- `unlockHint`: 条件達成に向けた補足表示文

現在の3体は `locked: false` を維持する。

未解放恐竜のカード表示:

- `locked_dino_frame.png` を優先して使用する。
- アセット未読込時はGraphics fallbackで暗色カードを描画する。
- 恐竜画像は表示せず、コード描画の暗いシルエットとロック記号で未知個体感を出す。
- カード名は `未解放`、タイプ欄は `解析待ち` を表示する。
- 未解放カードも選択できるが、出撃はできない。

未解放恐竜の詳細表示:

- 名前: `???`
- 戦闘タイプ: `未解析`
- 戦い方説明: `解析待ち。DNA研究で出撃登録に必要なデータを確認中。`
- 発見済み分岐: `???`
- 初期特徴: `解析データ不足`、`???`、`条件未達`
- 戦闘記録欄: `解放条件`、`unlockCondition`、`unlockHint`

出撃ボタン:

- 未解放恐竜選択時はボタン文言を `解析待ち` に変更する。
- サブ文言は `DNA研究で解放 / 条件未達` を基準にする。
- ボタンは押せない状態にし、`gameState.selectedDino` を未解放IDに更新しない。
- 既存3体では従来通り `出撃開始` とし、選択した恐竜でプレイへ遷移する。

検証用の隠しフラグ:

- `?mvp075LockedDino=1` をURLに付けると、MVP-075確認用のロックカードを一時表示できる。
- `localStorage` の `evolutionZero.devLockedDino` に `1` を入れて再読込しても同じ確認ができる。
- 確認用ロックカードは本番データの新恐竜追加ではなく、UIルール確認のための開発用表示とする。

## 背景

恐竜選択画面には専用の研究施設背景を使用する。

- `public/assets/ui/dino_select/lab_background.png`

背景はUI文字を邪魔しない暗さに抑え、選択中恐竜の見た目を引き立てるための補助要素として扱う。

## Fallback方針

アセット未読込でも画面遷移を止めない。

- UIフレーム未読込: Graphics描画へ戻す
- 恐竜PNG未読込: fallbackシルエットを表示
- 背景未読込: 標準の画面背景を表示

## 今後の拡張

恐竜を増やす場合、現在の横3枚カード表示を無理に縮小しない。
4体以上になった場合は、MVP-074で追加したカード送りUIを使う。

- 1ページの表示数: 3体
- 左右矢印: コード側の共通ボタン描画を使用
- ページドット: コード側のGraphics描画を使用
- 現在3体以下の場合: 非表示
- ページ移動時: 移動先ページの先頭恐竜を選択状態にする
- 選択中恐竜が別ページにある場合: そのページを自動表示する
- 移動先ページが未解放恐竜のみの場合: 先頭の未解放恐竜を選択し、詳細に解放条件を表示する
- 未解放恐竜を選択してもページング状態は維持し、出撃ボタンのみ無効化する

カード送りUIは、専用画像がなくても動くGraphics fallbackを標準にする。
将来ページング専用アセットを追加する場合も、未読込時に起動不能にしない。

恐竜ごとの恒久レベル制は導入しない。
永続進行はDNA研究画面を中心に扱う。

## 新規恐竜追加手順

1. カード用 `*_portrait.png` を作成する。
2. 詳細用 `*_hero.png` を作成する。
3. `src/data/asset_manifest.js` の `ASSET_KEYS.dinoSelectPortraits` と `ASSET_KEYS.dinoSelectHero` にキーを追加する。
4. `ASSET_MANIFEST.dinoSelectPortraits` と `ASSET_MANIFEST.dinoSelectHero` に保存パスを追加する。
5. `src/ui/dino_select_screen.js` の `DINOS` に表示情報を追加する。
6. 4体以上になる場合は既存のページング表示で確認する。

## MVP-106 Shared Dinosaur Image Policy
- Triceratops and tyrannosaurus now use refreshed front-facing `*_hero.png` images in `public/assets/dinos/dino_select/`.
- The hero image is the master shared asset for dino select detail, home favorite display, codex card overlay, and future result UI.
- The dino select `*_portrait.png` files are derived from the shared hero with explicit transparent safe margins so card display does not look clipped.
- Velociraptor card portrait also uses the front-facing detail hero as source so all three base dinosaurs share the same forward-facing selection-card language.
- Hero and portrait sprites must be displayed with aspect-preserving contain scaling; avoid independent width/height stretching that makes front-facing art look squashed.
- Do not bake shadows, labels, or UI frames into hero/portrait images. Those remain code-side UI responsibilities.
- Play sprite sheets are separate from hero/portrait art and live in `public/assets/dinos/*_sheet.png`.

## MVP-124b Front Image Refresh
- Triceratops and tyrannosaurus front hero / portrait art was regenerated to better match the velociraptor hero tone: frontal threat pose, strong eyes, readable facial features, and dark sci-fi mutation markings.
- The refreshed card portraits preserve the full silhouette with transparent margins rather than tight face-only crops, so card and HUD placement can use contain scaling without cutting the face.
- Future evolved dinosaur front images should follow the same rule: generate one high-quality hero master, then derive card/HUD portraits by transparent-margin resizing.
