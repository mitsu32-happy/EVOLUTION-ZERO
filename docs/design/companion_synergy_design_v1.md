# Companion Synergy Design V1 (CS01)

## 1. 目的

Companion Dino の次アップデートとして「共存シナジー」を追加するための設計をまとめる。

共存シナジーは、プレイヤー恐竜とお供恐竜の特定組み合わせで発生する小さな相性効果である。共進化のように新しい進化先や大量アセットを追加するものではなく、既存のプレイヤー恐竜選択とお供育成の意味を低コストで強めることを目的とする。

狙い:

- お供恐竜を選ぶ理由を増やす。
- プレイヤー恐竜ごとの個性を補強する。
- 最適化の楽しみを作る。
- 非シナジー構成やお供なし構成も成立させる。
- UIで明示し、隠し要素にしない。

## 2. 基本仕様

### 発動条件

- お供恐竜ごとに、相性の良いプレイヤー恐竜を1体設定する。
- 出撃時の `selectedDino` と `selectedCompanionId` が対応している場合のみ発動する。
- 効果はプレイ中だけ有効。
- セーブデータに「発動済み」などの永続状態は持たない。

### 表示方針

- お供選択画面で明示する。
- 所持お供一覧や研究画面の詳細にも、将来的に同じ表示を出せる形にする。
- 表示例:
  - `相性: ティラノサウルス`
  - `共存シナジー: ボスへのダメージが少し上昇`
- 隠し要素にはしない。

### 実装済み/未実装プレイヤー恐竜の扱い

現在実装済みプレイヤー恐竜:

| 表示名 | ID | 定義箇所 |
| --- | --- | --- |
| ヴェロキラプトル | `velociraptor` | `src/data/run_config.js` `DINO_CONFIGS` |
| トリケラトプス | `triceratops` | `src/data/run_config.js` `DINO_CONFIGS` |
| ティラノサウルス | `tyrannosaurus` | `src/data/run_config.js` `DINO_CONFIGS` |
| スピノサウルス | `spinosaurus` | `src/data/run_config.js` `DINO_CONFIGS` |

未実装プレイヤー恐竜のシナジーは、データ上は予約として設計する。ただし UI で未実装恐竜名を出すかどうかは、ネタバレ/期待管理のリスクがあるため CS02 で最終判断する。

推奨:

- 内部データ: 未実装恐竜名と仮IDを持つ。
- 通常UI: `相性: 未発見の恐竜` と表示する。
- 開発/debug UIまたは設計docs: 正式候補名を表示する。

## 3. シナジー一覧

| お供ID | 相性プレイヤー恐竜 | プレイヤーID案 | 実装状況 | シナジー名案 | 効果案 | 推奨効果量 | UI表示文言案 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `rex_hatchling` | ティラノサウルス | `tyrannosaurus` | 第1弾有効 | 親牙共鳴 | ボスへのプレイヤー与ダメージ上昇 | ボス与ダメ +12% | 相性: ティラノサウルス / 共存シナジー: ボスへのダメージが少し上昇 |
| `raptorling` | ヴェロキラプトル | `velociraptor` | 第1弾有効 | 連爪追撃 | クリティカル率上昇 | クリティカル率 +6% | 相性: ヴェロキラプトル / 共存シナジー: クリティカル率が少し上昇 |
| `spino_pup` | スピノサウルス | `spinosaurus` | 第1弾有効 | 水流連携 | 水/遠距離系の支援攻撃強化 | お供水弾ダメージ +12% または追加水弾を低頻度発生 | 相性: スピノサウルス / 共存シナジー: 水弾支援が強化 |
| `tricera_calf` | トリケラトプス | `triceratops` | 第1弾有効 | 装甲共鳴 | 被ダメージ軽減 | 被ダメージ -10% | 相性: トリケラトプス / 共存シナジー: 受けるダメージを少し軽減 |
| `medic_saur` | アンキロサウルス | `ankylosaurus` | 将来予約 | 再生装甲 | 被弾時小回復、回復効果上昇 | 回復効果 +10%、低頻度小回復 | 相性: 未発見の恐竜 / 将来のアップデートで解放予定 |
| `para_juvenile` | パラサウロロフス | `parasaurolophus` | 将来予約 | 共鳴探索 | EXP/pickup回収範囲上昇 | 回収範囲 +10% | 相性: 未発見の恐竜 / 将来のアップデートで解放予定 |
| `stego_calf` | ステゴサウルス | `stegosaurus` | 将来予約 | 背板衝波 | 周囲範囲攻撃強化 | 範囲攻撃半径 +8%、低頻度小衝撃波 | 相性: 未発見の恐竜 / 将来のアップデートで解放予定 |
| `ptera_chick` | プテラノドン | `pteranodon` | 将来予約 | 翼影支援 | 回避/遠距離支援強化 | 遠距離支援弾 +10%、または低確率回避補助 | 相性: 未発見の恐竜 / 将来のアップデートで解放予定 |
| `compy_pack` | コンプソグナトゥス | `compsognathus` | 将来予約 | 群れの狩り | 低HP敵への追撃 | 低HP敵へのお供ダメージ +15% | 相性: 未発見の恐竜 / 将来のアップデートで解放予定 |
| `exp_chaser` | オルニトミムス | `ornithomimus` | 将来予約 | 走査成長 | EXP獲得量/回収速度上昇 | EXP獲得 +6% または吸引速度 +12% | 相性: 未発見の恐竜 / 将来のアップデートで解放予定 |

## 4. 第1弾実装対象

CS02以降で最初に有効化する対象は、実装済みプレイヤー恐竜4体と対応する4組に限定する。

### 4.1 ティラノサウルス x rex_hatchling

- 方向性: ボス特化、重い一撃、親子感。
- 推奨効果: ボスへのプレイヤー与ダメージ +12%。
- 実装候補:
  - `CombatSystem.performNormalAttack()` または `damageSpecificEnemies()` / `damageEnemiesInCircle()` のダメージ適用時、対象が boss なら倍率をかける。
  - 通常攻撃だけでなく適応技にも乗せるかは CS02 で決める。
- 注意:
  - ZEROボスが短くなりすぎないよう +15% を上限目安にする。

### 4.2 ヴェロキラプトル x raptorling

- 方向性: 連撃、クリティカル、追撃。
- 推奨効果: クリティカル率 +6%。
- 実装候補:
  - `CombatSystem.getAdaptationDamageResult()` には既に `critRate` と `critDamageMultiplier` の概念がある。
  - 通常攻撃側は現状クリティカルを共通化していないため、CS02でプレイヤー共通 crit helper を作るか、適応技限定にするかを決める。
- 注意:
  - クリティカル表示の負荷が増えすぎないよう、既存の damage text / critical text 上限管理を維持する。

### 4.3 スピノサウルス x spino_pup

- 方向性: 遠距離支援、水弾、追加弾。
- 推奨効果: お供水弾ダメージ +12%、または低頻度の追加水弾。
- 実装候補:
  - `PlayScene.updateCompanionSupportAttack()` で `spino_pup` の behavior を補正する。
  - 新規 projectile を増やす場合は高負荷対策上、発射頻度と上限を厳格にする。
- 注意:
  - projectile/effect増加はS01-S04系の安定化と衝突しやすい。最初は既存攻撃の倍率強化が安全。

### 4.4 トリケラトプス x tricera_calf

- 方向性: 防御、突進、耐久。
- 推奨効果: 被ダメージ -10%。
- 実装候補:
  - `GameState.damagePlayer(amount)` の前段で `playerDamageMultiplier` に補正を入れる。
  - または PlayScene 初期化時に `gameState.playerDamageMultiplier` へ synergy multiplier を合成する。
- 注意:
  - トリケラトプス本体にも既に `damageTakenMultiplier` があるため、乗算しすぎに注意する。

## 5. 将来追加予定恐竜リスト

| 将来プレイヤー恐竜 | 推奨ID案 | 対応お供 | 役割 |
| --- | --- | --- | --- |
| アンキロサウルス | `ankylosaurus` | `medic_saur` | 回復、耐久、防御再生 |
| パラサウロロフス | `parasaurolophus` | `para_juvenile` | 探索、回収、音波、EXP補助 |
| ステゴサウルス | `stegosaurus` | `stego_calf` | 範囲攻撃、背板、衝撃波 |
| プテラノドン | `pteranodon` | `ptera_chick` | 空中支援、回避、遠距離 |
| コンプソグナトゥス | `compsognathus` | `compy_pack` | 群れ、雑魚処理、低HP追撃 |
| オルニトミムス | `ornithomimus` | `exp_chaser` | 高速移動、EXP回収、成長加速 |

## 6. UI表示案

### お供選択画面

現状の主な表示箇所:

- `src/ui/home_screen.js` `renderCompanionModal()`
- 行詳細: `row.detail.text`
- 選択中詳細: `this.companionModal.selectedDetail.text`

追加案:

```text
相性: ティラノサウルス
共存シナジー: ボスへのダメージが少し上昇
```

カード内に収まらない場合は、カード右側ではなく選択中詳細欄に出す。

### 研究画面のお供タブ

現状の主な表示箇所:

- `src/ui/research_screen.js` `renderCompanionOwnedPanel()`
- 行詳細: `row.detail.text`
- 成長行: `row.growth.text`

追加案:

```text
相性: ヴェロキラプトル / クリティカル率上昇
```

研究画面では強化情報が主役なので、シナジー表示は短くする。

### 未実装恐竜名の表示判断

選択肢:

1. 通常UIにも未実装名を出す。
   - 長所: 将来性が明確。
   - 短所: ネタバレ感が強い。
2. 通常UIでは `未発見の恐竜` と出す。
   - 長所: ネタバレを抑えられる。
   - 短所: 何を待てばよいか分かりづらい。

推奨は 2。実装済みの4組だけ具体名を表示し、未実装6組は `未発見の恐竜` と表示する。

## 7. セーブ構造

原則として新規セーブ項目は不要。

理由:

- シナジーは `selectedDino` と `selectedCompanionId` の組み合わせで毎回判定できる。
- 解放/未解放の永続状態を持たないため、旧セーブ互換リスクが低い。
- 将来プレイヤー恐竜が追加された時も、データ定義だけで判定できる。

必要になりうるケース:

- シナジー初回発見演出を1回だけ表示したい場合。
- 図鑑や実績にシナジー発見履歴を残したい場合。

CS01時点では不要。CS02でも保存なしで実装する方針を推奨する。

## 8. バランス方針

- 効果は控えめにする。
- お供なし、非シナジー構成、好きなお供構成が成立すること。
- シナジーは必須ではなく「少し得をする相性」に留める。
- ZERO攻略を特定構成一択にしない。
- 効果量の初期上限目安:
  - 与ダメージ系: +10%から+12%、最大でも+15%。
  - クリティカル率: +5%から+8%。
  - 被ダメージ軽減: -8%から-10%、最大でも-12%。
  - EXP系: +5%から+8%。
  - 範囲/吸引/速度系: +8%から+12%。
- projectile/effect追加系は負荷リスクがあるため、まずは既存行動への倍率補正を優先する。

## 9. 実装ステップ案

### CS02: データ構造

- `src/data/companion_synergy.js` を作成。
- `getCompanionSynergy({ dinoId, companionId })` を用意。
- 第1弾4組だけ `enabled: true`。
- 将来6組は `enabled: false` または `future: true`。
- セーブ変更なし。

### CS03: プレイ中効果

- PlayScene開始時に active synergy を判定。
- `CombatSystem` や `GameState` に必要最小限の runtime multiplier を渡す。
- 第1弾4組だけ効果を有効化。
- performance/debugPerformanceに必要なら `companionSynergyId` を表示。

### CS04: UI表示

- お供選択画面と研究画面に短い相性表示を追加。
- 未実装6組は `未発見の恐竜` 表示にする。
- スマホ幅でテキストがはみ出ないことを確認。

### CS05: QA / Balance

- 実装済み4組と非シナジー構成を比較。
- ZERO / ENDLESS で短時間確認。
- ダメージ/回復/EXPの増え方が過剰でないことを確認。
- runtime console error/warn 0件。

## 10. リスク

| リスク | 内容 | 対策 |
| --- | --- | --- |
| 選択の自由が減る | 相性が強すぎると固定構成になる | 効果量を控えめにし、非シナジー構成も成立させる |
| ZEROの難易度が壊れる | ボス特化や防御が強すぎる | 第1弾は+10%前後に抑え、QAでZERO確認 |
| 未実装恐竜のネタバレ | UIに将来恐竜名を出すと期待/ネタバレが強い | 通常UIでは `未発見の恐竜` 表示を推奨 |
| 将来性が伝わらない | 未実装名を隠すと何が増えるか分かりにくい | お知らせや開発ノートで段階的に公開する |
| 実装箇所が分散する | ダメージ/被ダメ/EXP/お供AIにまたがる | CS02でデータ層を一本化し、各システムは小さなhookだけ持つ |
| パフォーマンス悪化 | 追加弾や追撃がeffect/projectileを増やす | 初期実装は倍率補正優先。追加エフェクトは既存pool/上限管理に乗せる |

## 調査メモ

### 既存ID

- プレイヤー恐竜ID: `velociraptor`, `triceratops`, `tyrannosaurus`, `spinosaurus`
- お供恐竜ID: `raptorling`, `spino_pup`, `medic_saur`, `ptera_chick`, `tricera_calf`, `para_juvenile`, `stego_calf`, `rex_hatchling`, `compy_pack`, `exp_chaser`

### 既存コード上の主な接続候補

- プレイヤー恐竜定義: `src/data/run_config.js` `DINO_CONFIGS`
- お供恐竜定義: `src/data/companion_dinos.js` `COMPANION_DINOS`
- 通常攻撃/適応技ダメージ: `src/systems/combat_system.js`
- 適応技クリティカル: `CombatSystem.getAdaptationDamageResult()`
- プレイヤー被ダメージ: `src/core/game_state.js` `damagePlayer(amount)`
- EXP加算: `src/core/game_state.js` `addExp(amount)`
- pickup回収: `src/scenes/play_scene.js` pickup collection path around EXP pickup handling
- お供攻撃/補助: `src/scenes/play_scene.js` `updateCompanionSupportAttack()` / `updateCompanionUtility()`
- お供選択UI: `src/ui/home_screen.js` `renderCompanionModal()`
- 研究画面お供UI: `src/ui/research_screen.js` `renderCompanionOwnedPanel()`
