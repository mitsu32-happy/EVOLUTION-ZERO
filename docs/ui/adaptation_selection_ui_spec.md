# Adaptation Selection UI Spec

## 参照
- `references/ui/dna_research_ui_v2.png`
- `references/ui/pause_ui_v1.png`
- `references/hud/hud_concept_v1.png`

## 役割
- レベルアップ時の選択は「DNA適応候補」として表示する。
- 進化候補は「分岐候補」として表示し、一本道の段階進化には見せない。
- プレイ中の一時ビルド選択であり、恒久レベル制には見せない。

## 禁止表現
- `Lv`
- `レベル不足`
- `進化段階`
- 一本の進化階段に見える表現

## 表示ルール
- レベルアップカードは最大3枚、スマホ縦1画面に収める。
- カード内は左アイコン、中央に名称/種別/説明、右上に `新規解析` または `強化 n→m` を表示する。
- 説明文は2行以内に収め、長文は短くする。
- 再解析ボタンはカード下に配置し、使用不可時は薄く表示する。
- 画面全体は `DNA適応候補` として扱い、見出しは `解析候補を選択` など研究施設端末の文脈に寄せる。
- 背景暗幕はプレイ中であることが分かる程度に残し、選択UIを主役にする。

## 分岐候補
- 分岐候補は最大3枚。
- `分岐候補検出` と表示し、選択後この出撃中の戦い方が変わることだけを伝える。
- 候補名、変異名、短い説明を枠内に配置する。

## UIアセット
- `assets/ui/selection/selection_panel.png`
- `assets/ui/selection/selection_background_panel.png`
- `assets/ui/selection/selection_header_panel.png`
- `assets/ui/selection/selection_footer_panel.png`
- `assets/ui/selection/choice_card_frame.png`
- `assets/ui/selection/choice_card_selected.png`
- `assets/ui/selection/choice_card_locked.png`
- `assets/ui/selection/adaptation_card_speed_panel.png`
- `assets/ui/selection/adaptation_card_hunting_panel.png`
- `assets/ui/selection/adaptation_card_attack_panel.png`
- `assets/ui/selection/reroll_button.png`
- `assets/ui/selection/reroll_button_idle.png`
- `assets/ui/selection/reroll_button_disabled.png`
- `assets/ui/selection/reroll_button_pressed.png`
- `assets/ui/selection/badge_new.png`
- `assets/ui/selection/badge_upgrade.png`
- `assets/ui/selection/badge_owned.png`
- `assets/ui/selection/badge_locked.png`
- `assets/ui/selection/evolution_choice_panel.png`
- `assets/ui/selection/evolution_choice_card.png`
- `assets/ui/selection/dna_analysis_glow.png`

## MVP-099 周辺UIルール
- MVP-098で採用したタグ別カードアセットは再生成しない。
- タグ別カードアセットにはアイコンや状態表示を焼き込まない。
- 適応アイコンは `assets/ui/hud/adapt_icons/` の専用アイコンをコード側で重ねる。
- `NEW` / `強化` / `取得済み` / `LOCKED` 相当の状態は、テキストなしバッジにコード側テキストを重ねる。
- 再解析ボタンは idle / disabled / pressed の差分を持つが、文字と残り回数はコード側で描画する。
- 背景パネル、ヘッダーパネル、フッターパネルはいずれも外枠中心の装飾とし、内部に細かい文字枠を作らない。

## MVP-100 v2アセットルール
- 周辺UIは `selection_*_v2.png` を優先し、MVP-098採用済みタグ別カードは維持する。
- v2背景パネルは画面全体のまとまりを作る主アセットとして扱い、旧Graphicsパネルはfallback専用にする。
- ヘッダーは `DNA適応候補` と解析段階表示が自然に収まる安全領域を持つ。
- `selection_subtitle_panel_v2.png` と `analysis_warning_chip.png` は説明/ヒントの背面として使い、本文はコード側で描画する。
- 状態バッジはv2を優先し、`新規解析` / `強化 n→m` / `取得済み` はコード側テキストを重ねる。
- 生成元は `docs/mockups/mvp100/selection_asset_sheet_v2_raw.png` に保存する。

## MVP-101 上部ヘッダー配置
- `selection_header_panel_v2.png` は上部の主装飾として明確に表示する。
- `dna_analysis_header_icon.png` はヘッダー左側の解析エンブレムとして配置する。
- `DNA適応候補` はヘッダー中央の安全領域に置き、外枠やアイコンに重ねない。
- `適応反応 n→m` は `反応 n→m` に短縮し、ヘッダー右側の小型ステータスチップとして表示する。
- `解析候補を選択` は `selection_subtitle_panel_v2.png` の中に配置する。
- `DNA適応は安定解析中です` 系の説明は `安定解析中` など短い状態文へ変換し、`analysis_warning_chip.png` 上に表示する。
- 長い説明文を上部に縦積みしない。ヘッダー、サブヘッダー、状態チップに役割を分ける。
- v2背景パネルは左右に余白を残しすぎず、3カードとフッターをまとめる画面全体の受け皿として扱う。

## MVP-101 簡素化パス
- ユーザー確認後、v2周辺UIはフレームの重なりが強いと判断し、v3のシンプルな周辺アセットへ切り替える。
- 採用済み適応カードと `analysis_warning_chip.png` は維持する。
- `selection_background_panel_v3.png` は画面全体の受け皿として使う。内部に追加フレームを重ねすぎない。
- `selection_header_panel_v3.png` は最小限の上部ヘッダーとして使う。
- `selection_footer_panel_v2.png` は使用しない。リロールボタン自体が枠を持つため二重フレームにしない。
- `dna_analysis_header_icon.png` と反応チップ背景は現行レイアウトでは表示しない。ヘッダー内のコード描画テキストだけで情報を整理する。
- `selection_subtitle_strip_v3.png` は必要時の予備アセットとし、現行では常時使用しない。
- 表示要素は「ヘッダー」「安定解析中チップ」「3カード」「リロール」に絞る。
- 背景パネルは左右ほぼ画面いっぱいに表示し、パネル外枠から内側へ約24px以上を実配置安全領域とする。
- ヘッダーテキストは `selection_header_panel_v3.png` の内側安全領域へ上下中央寄せで収める。下端の外枠に文字を乗せない。
- 再解析ボタンは緑基調の `reroll_button_green_*` を優先し、使用不可/押下状態も同系色で統一する。

## fallback
- アセット未読込時は既存Graphics描画で継続する。
- 選択処理、再解析回数、分岐候補検出ロジックは変更しない。

## MVP-109 タグなしカード / 適応技カード方針

- 追加技は `adaptationSkill` として扱い、必ず `speed` / `hunting` / `attack` など1つの適応タグを持つ。
- ステータスアップ、攻撃頻度、回収範囲、DNA獲得補正、EXP吸収補助はタグなし強化として扱う。
- タグなし強化は `tag: null` とし、スキル枠にも適応タグ数にも進化条件にも含めない。
- タグなし強化カードは `adaptation_card_none_panel.png` / `adaptation_card_none_panel_selected.png` を使う。
- タグなしカードは灰色基調で、汎用強化と分かるよう `icon_adapt_none.png` をコード側で重ねる。
- タグ付きカードは既存の `adaptation_card_speed_panel.png` / `adaptation_card_hunting_panel.png` / `adaptation_card_attack_panel.png` を維持する。
- タグアイコンは `public/assets/ui/adaptations/icon_adapt_*.png` を使用し、カード画像内には焼き込まない。
- タグなしカードの表示文は「基礎強化」「回収補助」など短くし、進化分岐が進んだように見せない。
- 研究未解放の適応技は通常候補から除外し、将来ロック表示を行う場合は `未解析` / `研究で解放` とする。

## MVP-110 適応技候補接続

- 初期解放の `残影爪` / `追尾牙` / `衝撃咆哮` はレベルアップ候補に出す。
- 研究解放の `加速刃群` / `捕食マーキング` / `火炎吐息` は、対応研究が未解放なら候補に出さない。
- 適応技カードでは専用スキルアイコンを優先表示し、未読込時のみタグアイコンへfallbackする。
- タグなし基礎強化は `adaptation_card_none_panel.png` を使い、タグ名は `タグなし / 基礎強化` と表示する。
- タグなし基礎強化はHUDスキルスロットに入れない。
- 適応技のみHUDスキルスロットへ表示する。
- 強化済み候補は `強化 n→m`、新規候補は `新規解析`、最大到達は `解析済み` とする。

## MVP-111 適応技発動方針

- 適応技は選択後、通常技とは別クールダウンで定期自動発動する。
- 研究解放技3種は、研究未解放なら候補に出さない方針を維持する。
- デバッグ確認では `?debugResearchUnlock=1` で研究解放候補を一時表示できる。
- `?debugAdaptationSkills=1` では全6技を取得済みとして実戦確認できるが、HUDは仕様通り3スロット表示を維持する。
- タグなし基礎強化は引き続き適応タグ数、進化条件、HUDスキルスロットに影響しない。

## MVP-112 強化内容表示

- 選択カードの状態表示は `新規解析` / `強化 n→m` / `解析済み` とする。
- `Lv` 表記は禁止。
- 適応技カードには短い強化プレビューを表示する。
  - 例: `次: 追尾数+1`
  - 例: `次: 範囲 / 持続強化`
  - 例: `次: 炎の幅 / 射程強化`
- プレビューはカード内に収めるため、長文説明ではなく短い効果語にする。
- HUDスキルスロットでは `強1` などの短縮表記で強化段階を示す。

## MVP-114 Tagless Card And Candidate Rules

- タグなし強化カードは `adaptation_card_none_panel_v2.png` / `adaptation_card_none_panel_selected_v2.png` を優先する。
- v2タグなしカードは灰銀基調だが、選択不可に見えないよう白/シアン系の発光を入れる。
- ロックカードとは別の見た目にし、基礎強化として押せるカードに見せる。
- タグなし強化は個別アイコンを使う:
  - `icon_boost_hp.png`
  - `icon_boost_move_speed.png`
  - `icon_boost_attack_rate.png`
  - `icon_boost_attack_range.png`
  - `icon_boost_pickup_range.png`
  - `icon_boost_dna_gain.png`
  - `icon_boost_exp_sense.png`
- 候補抽選は、タグなし強化・所持済み適応技・初期適応技・研究解放済み適応技を混ぜる。
- 研究未解放技は候補へ出さない。
- 可能な場合は少なくとも1枚は適応技を含め、タグなし強化だけの3択になりにくくする。
## MVP-114 Addendum: Expanded Initial Skill Candidates

- Level-up adaptation candidates now include six initial adaptation skills:
  - speed: `afterimage_claw`, `gale_blade`
  - hunting: `homing_fang`, `sense_spike`
  - attack: `shock_roar_wave`, `burst_fang`
- Research-gated skills remain hidden until their research item is completed.
- Tagless boost cards continue to use the gray/silver selectable card and per-boost icons.
- New skill cards use dedicated icons:
  - `icon_gale_blade.png`
  - `icon_sense_spike.png`
  - `icon_burst_fang.png`

## MVP-115b Card Safe Area

- レベルアップカードは右上の状態バッジと本文が競合しないよう、上段テキスト幅を短くする。
- 名称、分類、説明、強化内容はカード内安全領域に収め、長い文言は短縮表示する。
- 追加された適応技も `アイコン + 名称 + 説明 + 強化内容 + 状態バッジ` の構成を維持する。

## MVP-116 Skill Copy Updates

- 挙動変更した適応技はカード説明と強化内容も更新する。
- `疾風刃`: 左右/斜めへ高速刃を放つ軌道型として説明する。
- `感知棘`: 周囲に索敵棘を設置する罠型として説明する。
- `爆裂牙`: 遅延爆発する設置型として説明する。
