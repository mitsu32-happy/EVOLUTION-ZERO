# EVOLUTION ZERO Stage Select UI Spec

## MVP-119 Difficulty Unlock Rules

- `NORMAL / HARD / EXPERT / ENDLESS / ZERO` remain the selectable difficulty/mode line.
- ZERO stays visually locked until EXPERT is cleared for the relevant stage.
- ZERO is not unlocked by DNA research. Lock copy should refer to difficulty clear, not research purchase.
- NORMAL / HARD / EXPERT clear condition is boss defeat.
- ENDLESS does not clear on a single boss defeat; boss defeats are run stats.
- ZERO clear requires normal boss, second boss, and final boss defeat.
- Stage select should be ready to show first-clear rewards, title rewards, and ZERO new evolution route discovery hints in later MVPs.
- ZERO reward wording should use `新規進化ルート発見` / `ZERO初回報酬`, not `ZERO解析`.

## MVP-131 Stage And Boss Display Rules

- Stage select should treat each stage as an evolution environment with its own enemy pool and stage boss.
- Difficulty locks are stage-local:
  - NORMAL clear unlocks HARD.
  - HARD clear unlocks EXPERT.
  - EXPERT clear unlocks ENDLESS and ZERO.
- ZERO lock copy must mention EXPERT clear, not DNA research.
- NORMAL / HARD / EXPERT descriptions should clearly imply boss defeat as the clear target.
- ENDLESS description should imply survival score attack, not boss clear.
- ZERO description should imply a multi-boss route: normal boss, second boss, final boss.
- Future boss preview copy should remain short and not crowd the existing stage detail panel.
- First-clear reward hints may be shown later, but should be compact:
  - `初回称号`
  - `称号フレーム`
  - `ZERO初回報酬`
  - `新規進化ルート`

## 目的

この仕様書は、MVP-071後に確定したステージ選択画面を正本UIとして記録する。
今後ステージを追加する場合も、現在の画面密度、アセット構成、文字量、スマホ縦の可読性を維持する。

## 参照モック

- `references/ui/stage_select_ui_v2.png`
- 関連参照:
  - `references/ui/home_ui_v3.png`
  - `references/ui/dino_select_ui_v3.png`
  - `references/ui/dna_research_ui_v2.png`
  - `references/hud/hud_concept_v1.png`

## UIトーン

- ダークSF / 研究施設感を基準にする。
- 暗色UI、赤警告、DNA発光、シアンの補助光、アンバーの選択強調を使う。
- パネルは半透明・硬質・重めに見せる。
- スマホ縦1画面で読めることを最優先にする。
- ポップ、可愛い、漫画調、汎用ファンタジーUIには寄せない。

## 画面構成

上から順に以下の構造を維持する。

1. 戻るボタン
2. 画面タイトル
3. ステージカード列
4. 選択中ステージ詳細パネル
5. 出撃タイプ選択
6. 難易度 / モード説明欄
7. 恐竜選択へ進むボタン

## ステージカード構造

1カード内に表示する情報:

- サムネイル
- ステージ名
- 英字環境ラベル
- 選択中の場合のみ危険度バッジ

カード表示ルール:

- サムネイルはカード枠内に収める。
- サムネイルは戦闘背景とは別の専用画像を使う。
- 文字は画像に焼き込まず、PixiJS Textで表示する。
- 選択中カードは発光枠と危険度バッジで強調する。
- 非選択カードは暗くしすぎず、ステージ差が分かる程度に残す。

現在のステージカード列は4枚表示を基準にしている。
5ステージ以上になった場合は、カードを小さくせず、4枚単位のカード送りUIで表示する。
現在の4ステージ構成ではページングUIを非表示にする。

## ステージ詳細パネル構造

詳細パネルに表示する情報:

- 大きめサムネイル
- ステージ名
- 英字環境ラベル
- 危険度
- 2行以内の説明
- 出やすい適応
- 推奨恐竜タイプ

テキスト長制限:

- ステージ名: 8文字程度まで推奨
- 英字環境ラベル: 16文字程度まで
- 危険度: 6文字程度まで
- 説明: 2行以内、1行18文字前後を推奨
- 出やすい適応: 2タグまで推奨
- 推奨恐竜タイプ: 12文字程度まで

説明文が長くなる場合は、世界観説明をサムネイルや別画面に逃がし、この画面では戦闘判断に必要な短文にする。

## サムネイル仕様

保存先:

- `public/assets/maps/thumbnails/`

命名例:

- `jungle_thumb.png`
- `volcano_thumb.png`
- `swamp_thumb.png`
- `ruins_thumb.png`
- `forest_reactor_thumb.png`

画像仕様:

- PNG
- 16:9横長推奨
- 1024x576または768x432推奨
- 文字なし
- ロゴなし
- UIなし
- キャラクターを大きく入れない
- 中央は文字を載せても読めるよう情報量を抑える
- 外周に環境要素を寄せる
- 戦闘背景より少し明るく、ステージ差が分かる彩度にする

## 戦闘背景仕様

保存先:

- `public/assets/maps/backgrounds/`

命名例:

- `jungle_battlefield_tile.png`
- `volcanic_battlefield_tile.png`
- `swamp_battlefield_tile.png`
- `ruins_battlefield_tile.png`
- `forest_reactor_battlefield_tile.png`

戦闘背景はサムネイルより視認性優先にする。
プレイヤー、敵、EXP、HUDが埋もれる場合は、背景側の彩度とコントラストを下げる。

## 出撃タイプ仕様

表示は以下を同列に扱う。

- `NORMAL`
- `HARD`
- `EXPERT`
- `ENDLESS`
- `ZERO`

表示ルール:

- `通常` という表示は使わない。
- `ZERO` はロック表示を維持する。
- ボタン内の文字は短くする。
- 詳細な説明はボタン下の説明欄へ表示する。

内部状態:

- 通常出撃: `selectedMode: standard`
- 難易度: `selectedDifficulty: normal | hard | expert`
- ENDLESS: `selectedMode: endless`
- ZERO: `selectedMode: zero`

## 難易度 / モード説明欄

表示する内容:

- 選択中の出撃タイプ名
- 短い説明
- DNA報酬倍率
- 敵密度

表示ルール:

- 右側のメタ情報は枠内に収める。
- `DNA報酬 x1.0` のように短く表示する。
- 敵密度は `基準`、`+少量`、`+高め`、`+継続`、`LOCK` など短い語にする。
- この倍率表示はプレイヤー向けの案内であり、将来報酬計算を拡張する際は実計算と同期させる。

## ボタン仕様

### 戻るボタン

- 専用アセット: `public/assets/ui/stage_select/back_button_frame.png`
- 画像には文字や矢印を焼き込まない。
- 矢印はPixiJS Textで表示する。
- 読み込み失敗時はGraphics fallbackを使う。

### 恐竜選択へ進むボタン

- 専用アセット: `public/assets/ui/stage_select/continue_button_frame.png`
- 画像には文字を焼き込まない。
- 文言はPixiJS Textで表示する。
- 読み込み失敗時はGraphics fallbackを使う。

## ステージ選択UIアセット一覧

保存先:

- `public/assets/ui/stage_select/`

使用中アセット:

- `card_frame.png`
- `card_frame_selected.png`
- `card_frame_locked.png`
- `badge_danger.png`
- `badge_adaptation.png`
- `deploy_type_button.png`
- `deploy_type_button_selected.png`
- `deploy_type_button_locked.png`
- `detail_panel.png`
- `back_button_frame.png`
- `continue_button_frame.png`
- `screen_backdrop.png`

画像に日本語、英字、数字、ロゴを焼き込まない。
UI文言はすべてコード側で描画する。

## カード送り / ページング仕様

MVP-074時点では、ステージが5件以上になった場合にだけページングUIを表示する。

- 1ページの表示数: 4ステージ
- 左右矢印: コード側の共通ボタン描画を使用
- ページドット: コード側のGraphics描画を使用
- 現在4ステージ以下の場合: 非表示
- ページ移動時: 移動先ページの先頭ステージを選択状態にする
- 選択中ステージが別ページにある場合: そのページを自動表示する

新規UI画像は必須にしない。
将来専用ページングアセットを追加する場合も、未読込時は現在のGraphics描画へ戻す。

## Fallback方針

アセットが読み込めない場合も画面遷移を止めない。

- UIフレーム未読込: Graphics描画へ戻す
- サムネイル未読込: 色面の簡易fallbackを表示
- 背景未読込: 標準の画面背景を表示

新規ステージ追加時も、未配置アセットで起動不能にしない。

## 新規ステージ追加手順

1. `src/ui/stage_select_screen.js` の `STAGES` に表示情報を追加する。
2. `src/data/run_config.js` の `STAGE_CONFIGS` に戦闘用設定を追加する。
3. `src/data/asset_manifest.js` の `ASSET_KEYS.stageThumbnails` と `ASSET_MANIFEST.stageThumbnails` にサムネイルキーを追加する。
4. `src/data/asset_manifest.js` の `ASSET_KEYS.stageBackgrounds` と `ASSET_MANIFEST.stageBackgrounds` に戦闘背景キーを追加する。
5. `public/assets/maps/thumbnails/` にサムネイルを配置する。
6. `public/assets/maps/backgrounds/` に戦闘背景タイルを配置する。
7. 開発用アセット確認画面で loaded / fallback を確認する。
8. タイトル → ホーム → ステージ選択 → 恐竜選択 → プレイ開始を確認する。

## STAGES追加項目

`StageSelectScreen` 側の表示データには以下を持たせる。

```js
{
  id: 'forest_reactor',
  name: '炉心森林',
  zone: 'REACTOR FOREST',
  sub: '短い環境説明',
  detail: '2行以内の詳細説明。',
  adaptation: '高速適応 / 攻撃適応',
  recommended: 'ラプトル系',
  color: 0x35d7ff,
  risk: '危険',
}
```

注意:

- `id` は小文字スネークケース。
- `name` は短くする。
- `zone` は英字で短くする。
- `detail` は2行以内。
- `adaptation` は2タグ程度。
- `risk` は短い語にする。

## run_config追加項目

`STAGE_CONFIGS` 側には戦闘用の最低限の設定を追加する。

```js
forest_reactor: {
  id: 'forest_reactor',
  label: '炉心森林',
  tint: 0x35d7ff,
  skyColor: 0x071015,
  tileColors: [0x101b16, 0x17281d, 0x223a25],
  strokeColor: 0x2c4432,
  plantColors: [0x2f6b35, 0x4d8d3d],
  ambientAlpha: 0.14,
  enemyWeights: { swarm: 0.04, fast: 0.03, tank: 0.02 },
}
```

注意:

- ここでは戦闘ロジックを大きく変えない。
- ステージ固有ギミックを追加する場合は別MVPで扱う。

## asset_manifest追加項目

```js
stageThumbnails: {
  forestReactor: 'stageThumbnails.forestReactor',
}

stageBackgrounds: {
  forestReactor: 'stageBackgrounds.forestReactor',
}
```

```js
stageThumbnails: {
  forestReactor: {
    path: 'assets/maps/thumbnails/forest_reactor_thumb.png',
    thumbnail: true,
  },
}

stageBackgrounds: {
  forestReactor: {
    path: 'assets/maps/backgrounds/forest_reactor_battlefield_tile.png',
    tile: true,
  },
}
```

命名規則:

- keyはcamelCaseでもよいが、stage idとの対応を明確にする。
- ファイル名はsnake_case。
- サムネイルは `_thumb.png`。
- 戦闘背景は `_battlefield_tile.png`。

## 保守性メモ

現在のステージカード列は4枚表示を基準に最適化されている。
5ステージ以上に増やす場合も、カードを無理に縮小しない。
MVP-074で4枚単位のカード送り、ページドット、左右矢印の基盤を実装済み。

出撃タイプは5種固定を基準にしている。
新しいモードを増やす場合は、ボタン列ではなくモード選択UI自体を再設計する。

## MVP-132 Difficulty Lock Display

ステージ選択の難易度ボタンは `stageProgress` を参照してロック状態を決める。

- NORMAL: 初期解放。
- HARD: 同ステージNORMALクリアで解放。
- EXPERT: 同ステージHARDクリアで解放。
- ENDLESS / ZERO: 同ステージEXPERTクリアで解放。

ロック文言:

- `HARDはNORMALクリアで解放`
- `EXPERTはHARDクリアで解放`
- `ENDLESSはEXPERTクリアで解放`
- `ZEROはEXPERTクリアで解放`

未解放ボタンは押せないが、ボタン高さや列幅は維持する。選択中の難易度が別ステージで未解放になった場合はNORMALへ戻す。

## MVP-133 Title Reward Relationship

- Stage select still only controls stage and difficulty selection.
- First-clear title rewards are granted after a successful result, not directly from the stage select screen.
- Difficulty locks use `stageProgress`; title ownership uses `ownedTitles`.
- Do not make title ownership a requirement for selecting a stage or difficulty.
- Future UI may show first-clear reward previews, but MVP-133 keeps the selector focused on locks and clear state.
## MVP-143 ENDLESS selection

- ENDLESS remains unlocked by clearing EXPERT on the same stage.
- Debug confirmation can bypass normal UI selection with `debugMode=endless`.
- ENDLESS uses the selected stage identity, enemies, gimmicks, and boss, but never marks the run as CLEAR when a boss is defeated.

## MVP-144 ZERO selection

- ZERO remains locked until EXPERT is cleared on the same stage.
- ZERO is selected as a distinct mode, not as a research unlock.
- Debug confirmation can bypass normal UI selection with:
  - `debugMode=zero`
  - `debugZeroFast=1`
  - `debugZeroBoss=1`
  - `debugZeroFinalBoss=1`
  - `debugUnlockDifficulties=1`
- `debugDifficulty` can be combined with ZERO for QA, but normal stage select routes ZERO through the EXPERT unlock requirement.

## MVP-152 Ruins ZERO Pre-Release Lock

- `ruins` ZERO is locked for pre-release normal selection.
- Lock reason: post-release additional content / fourth dinosaur reward route not implemented.
- `debugUnlockDifficulties=1` may unlock normal progression checks, but it should not make ruins ZERO appear as a normal pre-release choice.
- Explicit internal QA override: `debugAllowRuinsZero=1`.
- Other stages keep the existing ZERO unlock rule:
  - jungle: ZERO route reward implemented for `velociraptor_zero`.
  - volcano: ZERO playable, route reward planned.
  - swamp: ZERO route reward implemented for `tyrannosaurus_zero`.

## MVP-153 Stage Select ZERO Scope

- Public-prep ZERO reward stages are jungle, volcano, and swamp.
- Volcano ZERO is production-ready for `triceratops_zero` rewards after EXPERT unlock.
- Ruins ZERO remains post-release and should stay locked in the normal stage selector unless a dedicated QA flag explicitly allows it.

### MVP-153 stage select copy follow-up
- ZERO deploy summary now treats jungle / volcano / swamp as pre-release playable ZERO targets after EXPERT unlock.
- ruins ZERO remains locked in normal flow with the reason `ruins ZEROは公開後追加予定`; QA can still use the explicit debug-only allowance when needed.

### MVP-154 ZERO 3-route cross QA
- Scope: pre-release ZERO routes are jungle -> `velociraptor_zero` / アビスラプス, volcano -> `triceratops_zero` / イグニケラ, and swamp -> `tyrannosaurus_zero` / オメガレクス.
- QA confirmed route reward mapping through `SaveManager.grantZeroRewards`: jungle grants `jungle_zero_clear` + `jungle_zero_frame` + `velociraptor_zero`; volcano grants `volcano_zero_clear` + `volcano_zero_frame` + `triceratops_zero`; swamp grants `swamp_zero_clear` + `swamp_zero_frame` + `tyrannosaurus_zero`; ruins grants no ZERO route reward.
- Duplicate reward QA confirmed the second volcano ZERO clear does not re-grant the route, title, or frame.
- ZERO upper evolution QA confirmed all three routes require route unlock, matching lineage, Lv8+, speed/hunting/attack Lv3+, and do not become eligible again after `hasZeroEvolved` is set.
- Existing `hasEvolved` normal evolution state does not block ZERO upper evolution eligibility.
- ZERO candidate UI copy was normalized to readable Japanese for route解析済み / 全適応Lv3+ / Lv8+.
- Browser smoke QA covered jungle, volcano, swamp ZERO starts; direct ZERO evolutions and their specials; stage select locking; and ruins ZERO lock.
- Final polish candidates: full manual ZERO CLEAR pacing per route, boss HP tuning without `debugWeakBoss`, and longer performance soak.

### MVP-156 Release Precheck
- Public ZERO selection scope is jungle / volcano / swamp.
- Ruins ZERO remains locked as post-release content and should not unlock through `debugUnlockDifficulties` in normal QA.
- `debugAllowRuinsZero=1` is the explicit QA-only override for ruins ZERO.
- Stage select final QA should verify lock text remains readable on mobile.

## MVP-A07 Stage Select Copy

- The subtitle is `ステージと難易度を選択`.
- `出撃タイプ` is renamed to `難易度`.
- Recommended dino text is removed so players can choose any unlocked dino freely.
- Stage detail text focuses on hazards and play expectations instead of development or internal tuning wording.
- ENDLESS and ZERO summaries use release-facing descriptions.
## MVP-159 Final Polish

- ステージ選択タイトルはタップでタイトル画面へ戻るショートカットとして扱う。
- 通常導線、ZERO 3ルート、ruins ZERO LOCK表示は維持する。
- 狭幅画面ではLOCK理由、難易度名、ステージ名が横にはみ出さないことを優先する。
- UIフォントは同梱フォントスタックへ統一する。
