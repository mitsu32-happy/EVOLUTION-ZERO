# EVOLUTION ZERO Research System Spec

## Purpose

DNA研究は EVOLUTION ZERO の永続進行の中心。プレイ中のスキル、適応タグ、進化状態は1プレイ限定のビルドとして扱い、永続進行は研究施設での解析・解放・身体強化として扱う。

## Core Rules

- 恐竜の恒久Lv制は禁止。
- `Lv不足`、`レベルが足りません` などの表現は禁止。
- 段階進化や一本道進化に見える表現は禁止。
- 身体強化は恐竜個体の育成ではなく、研究施設による基礎性能の安定化として扱う。
- 表示には `強化段階`、`解析待ち`、`条件未達`、`研究済み`、`解析完了` を使う。

## Resources

### DNA

出撃結果から得る主要な研究素材。主に身体強化に使う。適応能力や特殊変異の一部にも使えるが、基本は繰り返しプレイで集まる素材として扱う。

### 研究Pt

希少な解析リソース。適応能力、特殊変異、未知領域、新規コンテンツ解放に使う。主な入手元はデイリー、達成報酬、高難度報酬を想定する。DNAからの変換は補助手段で、高レートにする。

## Research Categories

### 身体強化

ヴァンサバ系のパワーアップ枠。DNAを消費し、出撃開始時の基礎性能へ控えめに反映する。

MVP-086で実接続済み:

- `dna_gain_up`: DNA獲得補正。1段階ごとにリザルトDNA +15%。
- `initial_hp_up`: 初期耐久強化。1段階ごとに最大HP +8。
- `move_speed_up`: 移動安定化。1段階ごとに移動速度 +8。

互換維持:

- `initial_attack_up`: 旧データ互換用。表示対象からは外すが、既存セーブに値がある場合は攻撃補正として読み続ける。

### 適応能力

スキル技解放枠。DNA + 研究Ptを想定。解放するとプレイ中のレベルアップ候補やスキル候補に出現する。MVP-086では実処理しない。

### 特殊変異

分岐進化ルートの解放枠。DNA + 研究Ptを想定。適応タグの組み合わせによる進化候補を増やす。MVP-086では実処理しない。

### 未知領域

新規恐竜、新規ステージ、新しい進化環境の解析枠。研究Ptを想定。MVP-086では実処理しない。

### 解析変換

DNAを研究Ptへ変換する補助枠。

想定レート:

- DNA 500 -> 研究Pt 10
- DNA 1000 -> 研究Pt 25
- DNA 3000 -> 研究Pt 90

MVP-086では実変換処理を行わない。

## Save Format

研究状態は既存の `researchLevels` オブジェクトで保存する。

```json
{
  "researchLevels": {
    "dna_gain_up": 0,
    "initial_hp_up": 0,
    "move_speed_up": 0,
    "initial_attack_up": 0
  }
}
```

互換方針:

- セーブバージョンは変更しない。
- 既存セーブに研究状態がない場合は0で補完する。
- 既存キーは破壊しない。
- 新規キーは optional/default 補完で扱う。

## Runtime Effects

MVP-086の反映対象:

- 最大HP: `PlayScene.applyRunModifiers()` でプレイヤー最大HPへ加算。
- 移動速度: `PlayScene.applyRunModifiers()` でPlayerの移動速度へ加算。
- DNA獲得補正: `SaveManager.calculateRunDna()` でリザルトDNA倍率へ反映。

数値は控えめにし、1プレイ内のスキル成長や進化効果を壊さない。

## Future MVP Plan

- MVP-087: 適応能力スキル解放とスキル候補接続。
- MVP-088: 特殊変異と進化候補接続。
- MVP-089: 未知領域と恐竜/ステージ解放。
- MVP-090: 解析変換UIと変換処理。

## MVP-087 Addendum

- プレイ中から開く設定画面は通常の設定タブとは別扱いにする。
- プレイ中設定では下部ナビと開発用アセット確認導線を非表示にし、戻る操作は必ずポーズ状態のプレイ画面へ戻す。
- 通常のホーム起点設定では下部ナビを従来通り表示する。
- 身体強化に `pickup_range_up` を追加する。
- `pickup_range_up` は保存先 `researchLevels.pickup_range_up`、既存セーブに存在しない場合は0で補完する。
- 1段階ごとにpickup吸引開始範囲を+8%する。最大5段階で+40%。
- 実プレイ反映先は `PlayScene` の `pickupModifiers.magnetRadiusMultiplier`。EXP結晶など `Pickup.update()` を通る回収物に反映する。
- `exp_sense` や狩猟系進化の回収補正は、研究による基礎倍率を下回らないよう加算して扱う。
- 表記は「回収範囲強化」「強化段階」を使用し、`Lv` 表記は使わない。

## MVP-109 Addendum: Adaptation Skill Unlocks

- `適応能力` は追加技である adaptation skill の解放枠として扱う。
- adaptation skill は1つにつき1つの適応タグを持つ。
- 初期対象タグは `speed` / `hunting` / `attack`。
- 各タグには初期解放技1つ、研究解放技1つを用意する。
- 研究解放技の予定:
  - `research_unlock_accelerated_blades`: speed / 加速刃群
  - `research_unlock_predator_marking`: hunting / 捕食マーキング
  - `research_unlock_flame_breath`: attack / 火炎吐息
- ステータスアップ、回収範囲、DNA獲得補正などは `tag: null` のタグなし強化として扱う。
- タグなし強化はスキル枠に入れず、適応タグ数や進化条件にも影響させない。
- 研究解放技は既存セーブにキーがない場合は未解放として補完し、セーブ形式を破壊しない。
- 詳細仕様は `docs/design/adaptation_skill_spec.md` を正本とする。

## MVP-110 Addendum: Research Gate Behavior

- `research_unlock_accelerated_blades` / `research_unlock_predator_marking` / `research_unlock_flame_breath` を適応能力カテゴリに追加した。
- MVP-110時点では研究購入処理の本接続は行わず、候補制御用のゲートとして扱う。
- 保存値 `researchLevels[researchId] > 0` の場合だけ、対応する研究解放適応技をレベルアップ候補へ出す。
- 保存値が存在しない既存セーブでは0扱いになり、研究解放技は候補に出ない。
- 初期解放技3種は研究不要で候補に出る。
- この追加は optional/default 補完のみで、セーブバージョン変更は行わない。

## MVP-111 Addendum: Research-Unlocked Runtime Skills

- 研究解放技3種も実プレイへ接続した。
  - `research_unlock_accelerated_blades`: `加速刃群`
  - `research_unlock_predator_marking`: `捕食マーキング`
  - `research_unlock_flame_breath`: `火炎吐息`
- 通常候補では引き続き `researchLevels[researchId] > 0` の時だけ出現する。
- `?debugResearchUnlock=1` は確認専用で、保存値を書き換えずに3研究を一時解放扱いにする。
- 研究購入の本接続は今後のDNA研究MVPで行う。

## MVP-112 Addendum: Adaptation Skill Purchase

- 適応能力カテゴリの研究解放技3種を正式購入対象にした。
- 購入対象:
  - `加速刃群解析`: DNA 120 / 研究Pt 18
  - `捕食マーキング解析`: DNA 130 / 研究Pt 20
  - `火炎吐息解析`: DNA 150 / 研究Pt 24
- 購入時は共通確認ダイアログを表示し、DNAと研究Ptを同時に消費する。
- 研究済みになると `researchLevels[researchId] > 0` となり、レベルアップ候補へ出現可能になる。
- 未研究状態では候補に出ない。
- 既存セーブは optional/default 補完で継続し、セーブバージョン変更は行わない。

## MVP-113 Addendum: Research Point Flow

- 研究Ptの主な入手導線を追加した。
- デイリーミッション:
  - 1回出撃: 研究Pt +4
  - EXP収集: 研究Pt +4
  - 敵撃破: 研究Pt +5
  - 3件合計は13Pt程度に抑え、研究解放技を即座に全取得できないようにする。
- リザルト報酬:
  - ボス撃破1体につき研究Pt +5
  - HARD: 研究Pt +3
  - EXPERT: 研究Pt +5
  - 3分以上生存: 研究Pt +1
- 研究Ptは既存の `researchPt` を使用し、保存形式の破壊的変更は行わない。
- `?debugResearchPt=100` などの確認用フラグで、一時的に画面上の研究Ptを増やして研究購入を検証できる。保存には書き込まない。

## MVP-114 Addendum: Research Unlock Tempo

- 研究Ptは新規コンテンツ解放用の希少リソースとして扱う。
- デイリー3件合計は13Pt程度を維持し、最初の適応技解放だけが狙えるテンポにする。
- 適応能力の研究解放コスト:
  - `research_unlock_accelerated_blades`: DNA 110 / 研究Pt 13。
  - `research_unlock_predator_marking`: DNA 145 / 研究Pt 22。
  - `research_unlock_flame_breath`: DNA 180 / 研究Pt 30。
- 2つ目以降は段階的に重くし、全技がすぐ解放されないようにする。
- 通常プレイのリザルト報酬では研究Ptを配布しない。
- 研究Ptの主な入手源はデイリーミッションと解析変換とする。
- 将来の特殊報酬で研究Ptを扱う場合も、称号やZERO初回報酬など明確な特別枠に限定する。
- 適応能力研究カードは一回限りの「解放研究」として表示する。
  - カード名は `<技名> 解放`。
  - 説明文は技の挙動だけを書く。
  - 強化段階は表示しない。
  - `高速適応` / `狩猟適応` / `攻撃適応` などの日本語タグチップを別表示する。
  - コストはDNAアイコン + 数値、研究Ptアイコン + 数値で表示し、`D/P`短縮表記は使わない。
## MVP-114 Addendum: Body Enhancement Expansion

- Body enhancement remains DNA-only and must not look like dinosaur level growth.
- New body enhancement items:
  - `attack_output_up`: increases base damage for normal/adaptation attacks by 4% per stage.
  - `attack_interval_up`: shortens normal attack interval by 3% per stage.
  - `damage_guard_up`: reduces incoming damage by 3% per stage.
  - `exp_efficiency_up`: increases EXP gain by 5% per stage.
- Existing body enhancement DNA costs were raised so stage 1 is approachable and later stages become longer-term goals.
- Research cards may paginate when a category contains more items than fit in the four-card mobile layout.
- Adaptation ability unlock cards must use skill-specific icons where available:
  - `accelerated_blades`: `icon_accel_blades.png`
  - `predator_marking`: `icon_predator_mark.png`
  - `flame_breath`: `icon_flame_breath.png`
- Adaptation unlock research uses DNA + researchPt. Body enhancement never uses researchPt.

## MVP-115 Addendum: Analysis Conversion and Body List

- Body enhancement now uses a vertical list/scroll interaction instead of page controls. The card viewport must stay clear of the bottom navigation and confirmation dialog.
- Analysis conversion is a real research action, not a placeholder. The description is `余剰DNAを研究Ptへ変換する`.
- Conversion rates are `DNA 500 -> 研究Pt 10`, `DNA 1000 -> 研究Pt 25`, and `DNA 3000 -> 研究Pt 90`.
- Conversion uses the shared confirmation dialog, consumes DNA, adds to the existing `researchPt` field, saves immediately, and refreshes visible DNA / researchPt values.
- Conversion remains a high-rate helper path. It should not replace dailies as the main researchPt flow, and normal result rewards must not grant researchPt.

## MVP-118b Addendum: ResearchPt Reward Sources

- Normal play result screens do not grant researchPt from boss defeats, difficulty, survival time, or score.
- Daily missions and DNA analysis conversion are the current implemented researchPt sources.
- Future special reward hooks may add researchPt only when the reward source is explicitly labeled as special content, not as a default run reward.

## MVP-119 Addendum: ZERO Is Not Research-Unlocked

- ZERO is unlocked by difficulty progression, not by DNA research.
- The intended unlock chain is NORMAL clear -> HARD, HARD clear -> EXPERT, EXPERT clear -> ENDLESS and ZERO.
- Research may show ZERO environment prediction / analysis as flavor or support information, but that research must not unlock the ZERO difficulty.
- Unknown Domain research remains for new dinosaurs, stages, and environmental analysis; it must not be used as the gate for ZERO entry.
- ZERO clear rewards may reveal new evolution routes, but those routes are rewards for clearing the difficulty, not purchases in the research tree.
## MVP-160c Daily And ResearchPt Cleanup

- ResearchPt remains outside normal result rewards.
- Current implemented ResearchPt sources are daily missions and DNA analysis conversion.
- Daily mission rewards may grant small ResearchPt amounts because they are explicit daily rewards.
- Runtime UI must use the canonical label `研究Pt`; mojibake labels are release-blocking text defects.
- The top Research resource row now displays `研究Pt` correctly.

## MVP-A01: スピノサウルス研究解放

- 未知領域カテゴリに `spinosaurus_unlock` を追加。
- コストは研究Pt 220。DNAは消費しない。
- 購入成功時に `unlockedDinos.spinosaurus` を保存し、恐竜選択/ホームへ反映する。
- 研究Ptはデイリーと変換で入手する方針を維持する。

## MVP-A01b: Spinosaurus Research Unlock Fix

- `spinosaurus_unlock` is a Research Pt-only unlock: DNA 0 / Research Pt 220.
- Research cards and confirmation dialogs must show `必要: 研究Pt 220` and `解放: スピノサウルス解放`.

## MVP-A07 Spinosaurus Cost

- Spinosaurus research unlock cost is relaxed from ResearchPt 420 to ResearchPt 220 for the first post-release unlock target.
- Research Pt shortage must display `Pt不足`, not `DNA不足`.
- If an older save has `researchLevels.spinosaurus_unlock >= 1` but lacks `unlockedDinos.spinosaurus`, loading normalizes it as unlocked.


## MVP-A01d ????????

- ????????????Pt 420?????A01b????????
- A01d????????????????unlockedDinos.spinosaurus???????????????????

## MVP-A15.2 Adaptation Research

- Added Adaptation Analysis I-V in the Adaptation Ability category.
- Each completed Adaptation Analysis tier adds +5% adaptation-skill damage; the final tier total is +25%.
- Added Adaptation Enhancement Theory I-III in the Adaptation Ability category.
- Enhancement Theory raises stat upgrade card values for HP increase, attack power increase, move speed increase, and pickup range increase.
- These research bonuses apply only to adaptation skills or level-up stat cards as described; normal attacks and ultimate attacks are not affected by Adaptation Analysis.
- New research IDs are included in default research levels so existing saves receive safe default values.

## MVP-A15.2 Research Category Correction

- Adaptation Analysis I-V and Adaptation Enhancement Theory I-III are permanent upgrade research, so they live in Body Enhancement rather than Adaptation Ability unlocks.
- These cards use the same DNA-only cost presentation as other Body Enhancement cards.
- Runtime effect labels are intentionally short, such as `適応技 +15%` and `能力強化 +2`, to avoid text clipping in the card effect row.

## MVP-A15.2 Research Card Consolidation

- Adaptation Analysis is consolidated into one Body Enhancement card with max level 5.
- Adaptation Enhancement Theory is consolidated into one Body Enhancement card with max level 3.
- Both use the same `強化段階 current / max` presentation as other body upgrades.

## MVP-A15.4 適応強化理論

- `適応強化理論` は身体強化リストに置く能力強化カード支援研究として扱う。
- 効果は固定値加算ではなく、能力強化カードの基礎値に対する乗算補正に変更した。
- 研究段階ごとの倍率は以下:
  - I: 基礎値 x1.1
  - II: 基礎値 x1.2
  - III: 基礎値 x1.3
- 対象カードは `HP増加`、`攻撃力増加`、`移動速度増加`、`回収範囲増加`。
- 既存セーブの研究段階は維持し、同じ研究IDのレベルから倍率を再計算する。
- 研究画面の効果表示は `能力強化 +10%/段階` とし、次段階表示もパーセント表記で統一する。
# MVP-P01 お供恐竜孵化

- 身体強化カテゴリに卵孵化カードを追加する。
- 卵所持中のみ表示し、DNA 90 / 研究Pt 12 を消費して孵化を開始する。
- 孵化時間は3時間で、完了後は未所持のお供恐竜からランダム取得する。
- 既存セーブに `companion` がない場合は保存正規化で補完する。
- QA用に `debugCompanionInstantHatch=1` で即時孵化できる。
