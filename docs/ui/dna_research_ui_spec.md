# EVOLUTION ZERO DNA Research UI Spec

## Reference

- Primary reference: `references/ui/dna_research_ui_v2.png`
- Related specs:
  - `docs/design/research_system_spec.md`
  - `docs/ui/home_ui_spec.md`
  - `docs/ui/dino_select_ui_spec.md`

`docs/ui/07_dna_research_ui.md` is an older memo. This file is the current DNA research UI direction.

## Role

DNA研究画面は、永続進行の中心となる研究施設ハブ。プレイ中成長ではなく、DNAと研究Ptを使って解放・解析・変換の見通しを示す画面として扱う。

## Layout

- スマホ縦1画面を優先する。
- 下部ナビを維持する。
- 背景はDNA研究施設の実背景アセットを使用する。
- 上部は `dna_core_panel.png` に DNA / 研究Pt のみを表示する。
- 5カテゴリはタブで切り替える。
- 中央に選択カテゴリの概要パネルを表示する。
- 下部に研究カードを3件まで表示する。
- 解析変換カテゴリでは DNA -> 研究Pt の変換候補を表示する。

## Asset Rules

- UIアセットに文字、数値、ロゴを焼き込まない。
- パネルやカードは外枠中心のデザインとし、内部細分枠を作りすぎない。
- 研究カード3種は `analysis_convert_panel.png` と同じ見え幅を基準にする。
- 外枠装飾が太いため、テキスト・数値・アイコンは左右に安全余白を取った内側領域へ配置する。
- fallback Graphics を維持し、素材未読込でも起動可能にする。

## Used Assets

Assets are stored under `public/assets/ui/research/`.

- `research_background.png`
- `dna_core_panel.png`
- `research_category_tab.png`
- `research_category_tab_selected.png`
- `research_card_frame.png`
- `research_card_locked.png`
- `research_card_completed.png`
- `research_cost_badge.png`
- `analysis_convert_panel.png`

Dedicated icons are stored under `public/assets/ui/research/icons/`.

- `icon_dna_resource.png`
- `icon_research_pt.png`
- `icon_body_enhancement.png`
- `icon_adaptation_ability.png`
- `icon_special_mutation.png`
- `icon_unknown_domain.png`
- `icon_analysis_conversion.png`
- `icon_dna_gain.png`
- `icon_initial_durability.png`
- `icon_attack_foundation.png`
- `icon_slash_wave.png`
- `icon_poison_spore.png`
- `icon_bone_spike.png`
- `icon_evolution_branch.png`
- `icon_unknown_dino_scan.png`
- `icon_stage_scan.png`

## Categories

- 身体強化: DNA消費。基礎性能を研究施設側で安定化する恒久強化枠。
- 適応能力: DNA + 研究Pt消費想定。スキル技を解放し、プレイ中候補へ追加する枠。
- 特殊変異: DNA + 研究Pt消費想定。分岐進化候補を増やす解析枠。
- 未知領域: 研究Pt消費想定。恐竜、ステージ、進化環境の解析枠。
- 解析変換: DNAを高レートで研究Ptへ変換する補助枠。

## Research Cards

表示内容:

- 研究名
- 説明
- 効果概要
- 強化段階または解放ヒント
- 必要素材または状態
- 専用アイコン

配置ルール:

- 左に専用アイコン領域を置く。
- 中央にテキスト領域を置く。
- 右に小型の素材/状態バッジを置く。
- 外枠装飾に被らないよう、左右と下に安全余白を確保する。
- 長い説明は短縮し、枠内の読みやすさを優先する。
- `Lv` 表記は禁止。`強化段階` は使用可。
- MVP-086以降、身体強化カードは `研究可能`、`DNA不足`、`完了` が一目で分かる素材/状態バッジを表示する。

状態:

- 未研究: 通常カード、必要素材を表示。
- 研究済み: 完了カード、`研究済` 表示。
- 条件未達/ロック中: ロックカード、解放ヒントまたは `ロック` 表示。

## Analysis Conversion

- DNA 500 -> Pt 10
- DNA 1000 -> Pt 25
- DNA 3000 -> Pt 90

MVP-085では見た目と導線のみ。実変換処理はMVP-090以降で接続する。

## MVP-086 Body Enhancement UI

身体強化のみ実データへ接続する。

表示対象:

- DNA回収効率: リザルトDNA獲得補正。
- 初期耐久強化: 出撃開始時の最大HP補正。
- 移動安定化: 出撃中の移動速度補正。

表示ルール:

- 現在の `強化段階 n / max` を表示する。
- 次段階の効果を `次: DNA +15%`、`次: HP +8`、`次: 速度 +8` のように表示する。
- DNAが足りる場合は `DNA 18` のように必要量を表示する。
- DNA不足時は `DNA不足` を表示する。
- 最大段階では `完了` を表示する。
- 研究成功時は軽い押下フィードバックと通知文を表示する。
- DNA不足時は警告通知を表示し、セーブは変更しない。
- 購入可能な身体強化カードを押した場合、即時購入せず共通確認ダイアログを表示する。
- 確認ダイアログは `はい` で購入確定、`いいえ` でキャンセルする。
- 確認ダイアログ表示中は背面の研究カードや下部ナビを操作させない。

共通確認UIアセット:

- `public/assets/ui/common/confirm_dialog_panel_v2.png`
- `public/assets/ui/common/confirm_button_yes_v2.png`
- `public/assets/ui/common/confirm_button_no_v2.png`
- `public/assets/ui/common/confirm_warning_chip_v2.png`
- `public/assets/ui/common/confirm_cost_badge_v2.png`
- `public/assets/ui/common/confirm_dialog_panel.png`
- `public/assets/ui/common/confirm_button_yes.png`
- `public/assets/ui/common/confirm_button_no.png`

MVP-105以降はv2を最優先表示とし、v2未読込時に旧アセット、最後にGraphicsへfallbackする。
タイトル、確認文、消費DNA、強化段階、はい/いいえは画像に焼き込まずコード側で描画する。
消費DNAと強化段階は `confirm_cost_badge_v2.png` の安全領域内へ2行程度で収める。

未接続:

- 適応能力、特殊変異、未知領域、解析変換はMVP-086では購入不可のまま。

## Fallback

- 背景未読込時は既存Graphics背景を表示する。
- パネル、タブ、カード未読込時はGraphics fallbackを表示する。
- 専用アイコン未読込時は簡易Graphicsアイコンを表示する。
- 実素材がない状態でもbuild、起動、ホームから研究画面への導線を維持する。

## Forbidden

- 研究効果の本格実装。
- 解析変換の実処理。
- セーブ形式の破壊的変更。
- 恐竜Lv表記。
- 段階進化や一本道進化に見える表現。
- 外部ライブラリ追加。
- 音声素材追加。

## Future MVP Plan

- MVP-086: 身体強化の実データ接続。
- MVP-087: 適応能力スキル解放とスキル候補接続。
- MVP-088: 特殊変異と進化候補接続。
- MVP-089: 未知領域と恐竜/ステージ解放。
- MVP-090: 解析変換UIと変換処理。

## MVP-115 表示更新

- 身体強化カテゴリはページ送りではなく、縦スクロール型の一覧として表示する。表示領域は下部ナビと通知テキストに被らない範囲へ限定する。
- 解析変換カテゴリは正式機能として扱い、「余剰DNAを研究Ptへ変換する」と説明する。
- 解析変換カードは `DNA 500 -> 研究Pt 10`、`DNA 1000 -> 研究Pt 25`、`DNA 3000 -> 研究Pt 90` の3候補を表示する。
- 解析変換は共通確認ダイアログを表示し、`はい` でDNA消費と研究Pt加算、`いいえ` でキャンセルする。
- DNA不足時は変換不可状態を表示し、保存値を変更しない。
- 開発用アセット確認導線はデバッグURL時のみ設定画面に表示する。通常URLではユーザー向け設定だけを表示する。

## MVP-087 Play Settings And Pickup Range

- プレイ中のポーズから開く設定画面では、通常設定タブ用の下部ナビを表示しない。
- プレイ中設定の戻るボタンはポーズ画面へ戻る専用導線とする。
- ホームから開く通常設定では、従来通り下部ナビと開発用アセット確認を表示する。
- 身体強化カードは4件表示できるようにし、`回収範囲強化` を身体強化カテゴリ内に表示する。
- `回収範囲強化` は `強化段階 0/5` 形式で表示し、必要DNA、DNA不足、完了表示、確認ダイアログを既存身体強化と同じ扱いにする。
- 効果表示は `次: 範囲 +8%` のように短くし、カード内で読めることを優先する。
- 実プレイではpickup吸引開始範囲へ反映する。最大段階でも画面全域吸引にはしない。

## MVP-114 Adaptation Unlock Card Rules

- 適応能力カテゴリの研究解放カードは「強化」ではなく「技の解放」として表示する。
- カード名は `<技名> 解放` を基本にする。
- 説明文は技の挙動だけにし、`適応技解放: ...` のような重複表現は避ける。
- 強化段階表示は出さない。解放済みなら `解放済み`、購入可能なら `研究可` を表示する。
- 適応タグは `高速適応` / `狩猟適応` / `攻撃適応` のチップで別表示する。
- コストはDNAアイコン + 数値、研究Ptアイコン + 数値で表示する。
- `D120/P18` のような短縮文字だけのコスト表記は使わない。
- DNA / 研究Pt アイコンが未読込の場合は既存テキスト表示またはGraphics fallbackを維持する。
## MVP-114 Addendum: Research Card Clarity

- Adaptation ability cards show unlock research, not upgrade stages.
- Adaptation ability cards use skill-specific icons before falling back to tag icons.
- Japanese tag chips remain:
  - 高速適応
  - 狩猟適応
  - 攻撃適応
- Costs are shown as DNA icon + value and researchPt icon + value. `D/P` text abbreviations are not used for adaptation unlock cards.
- Body enhancement cards show current stage, next effect, and DNA-only cost.
- Body enhancement may paginate in four-card pages when more than four items exist.
