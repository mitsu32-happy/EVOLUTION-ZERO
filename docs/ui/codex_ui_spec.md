# Codex UI Spec

## 正本参照
- `references/ui/evolution_archive_top_ui_v1.png`
- `references/ui/evolution_tree_detail_ui_v1.png`
- `references/ui/dino_select_ui_v3.png`

## 役割
- 図鑑は「恐竜ごとの分岐進化記録」として扱う。
- 段階進化や一本道進化ではなく、原種から適応タグによって分岐する解析候補として見せる。
- 恐竜選択画面で選ぶ個体とは別に、図鑑内でも対象恐竜を切り替えられる。

## MVP-103 構成
- 上部に図鑑タイトル、対象恐竜セレクター、選択中恐竜の系統パネルを置く。
- 対象恐竜は `ヴェロキラプトル / トリケラトプス / ティラノサウルス` を初期対象とする。
- 選択中恐竜に応じて、原種カードと3つの分岐カードを表示する。
- 現在実接続済みの分岐はヴェロキラプトル系統の `speed / hunting / attack`。
- 未実装恐竜の分岐は `??? / 未解析 / 発見条件: 不明 / 調査中` として表示する。

## 表示情報
- 解放済み分岐:
  - 進化名
  - 適応タグ
  - 短い説明
  - 進化条件
  - 基礎ステータス傾向
- 未解放分岐:
  - `???`
  - `未解析`
  - `発見条件: 不明`
  - `調査中`
  - 汎用未知恐竜シルエット

## 分岐表現
- スマホ縦画面ではカード一覧を維持する。
- 原種カードと分岐カードの左側に接続ラインとノードを描画し、原種から複数分岐していることを補う。
- 縦一本道の段階進化に見える表現は禁止。
- `Lv`、`進化レベル`、恒久レベル制に見える表現は禁止。

## UIアセット
- `assets/ui/codex/codex_selected_dino_panel_v3.png`
- `assets/ui/codex/codex_dino_selector_card_v3.png`
- `assets/ui/codex/codex_branch_card_known_v3.png`
- `assets/ui/codex/codex_branch_card_unknown_v3.png`
- `assets/ui/codex/codex_origin_card_v3.png`
- `assets/ui/codex/codex_portrait_frame.png`
- `assets/ui/codex/codex_unknown_dino_silhouette.png`

## アセット方針
- 分岐カードには特定恐竜のシルエットを焼き込まない。
- 恐竜画像、未知シルエット、タグ、説明文はコード側で重ねる。
- カードは外枠中心で、内部に文字を置きやすい広い安全領域を持つ。
- 画像内に文字、ロゴ、UI文言を焼き込まない。

## 画像重ね表示
- 解放済みカードは、その恐竜または進化先の画像をコード側で重ねる。
- 進化先の図鑑用画像は `assets/dinos/evolutions/<dino>_<branch>_codex.png` を優先する。
- 進化先の図鑑用画像が未配置の場合は、該当恐竜の詳細hero画像へfallbackし、近接portraitによる切れ見えを避ける。
- 未解放カードは `codex_unknown_dino_silhouette.png` を薄く表示する。
- 図鑑内の恐竜アイコンには追加フレームを重ねず、各パネル/カード本体の安全領域内に画像とテキストを配置する。
- 原種カード、進化カードともに画像は切り取りではなく全体が見える `contain` 表示を基本にする。
- 進化条件と基礎傾向は下部外枠へ乗らないよう、短縮表示と上下余白を優先する。

## 下部ナビ
- ホーム、研究、図鑑、設定の下部ナビは維持する。
- 図鑑では `codex` を selected 状態にする。

## fallback
- v3アセット未読込時は既存v2/v1アセットまたはGraphics描画で継続する。
- 恐竜画像が未読込でもカードとテキストは表示する。
- 図鑑データが未接続の分岐でも未解析カードを表示する。

## MVP-106 Shared Hero Overlay Rule
- Codex cards should reuse the same shared front-facing hero images used by dino select and home favorite display.
- Base triceratops and tyrannosaurus hero images are now available at `public/assets/dinos/dino_select/triceratops_hero.png` and `public/assets/dinos/dino_select/tyrannosaurus_hero.png`.
- Card art must be placed by code on top of generic codex cards. Do not bake species silhouettes into branch/origin card frames.
- If a future evolution hero image is missing, keep the card generic and use the unknown silhouette instead of stretching a HUD portrait.

## MVP-119 Evolution Route Rules

- Codex branch data must be dinosaur-specific, not raptor-fixed.
- Each dinosaur should expose at least speed / hunting / attack branches, plus a hidden ZERO branch.
- ZERO branch cards remain `??? / 未解析` until the corresponding ZERO reward route is discovered.
- Normal branches may be shown as known, hinted, or unknown depending on discovery state, but must not look like a vertical stage ladder.
- Branch card content order:
  - evolution name
  - adaptation tag
  - short role copy
  - evolution condition hint
  - ultimate name if discovered
- Use the shared hero master from `public/assets/dinos/evolutions/heroes/` when available.
- If a branch hero is missing, use the unknown silhouette or base hero fallback without distorting the image.
- ZERO rewards should be labeled as new evolution route discoveries, not `ZERO解析`.

## MVP-120 Velociraptor Branch Display

- Velociraptor speed / hunting / attack branch cards should use the generated shared hero assets:
  - `public/assets/dinos/evolutions/heroes/velociraptor_speed_hero.png`
  - `public/assets/dinos/evolutions/heroes/velociraptor_hunting_hero.png`
  - `public/assets/dinos/evolutions/heroes/velociraptor_attack_hero.png`
- A fourth ZERO branch slot is shown as `???` with the shared ZERO unknown silhouette until a ZERO reward route is discovered.
- Debug `?debugEvolution=speed|hunting|attack` may reveal the normal raptor branches for UI verification only.

## MVP-121 Discovery State Display

- Codex discovery checks use normalized `discoveredEvolutions` branch ids instead of tag-only arrays.
- Discovered branches show their hero, name, condition, role text, and future ultimate hook.
- Undiscovered branches show `???` and the unknown silhouette; ZERO remains fully unknown until a ZERO reward route is saved.
- Discovery counts are based on the displayed branch list for the selected dinosaur.

## MVP-124 Codex Card Text Safety

- Branch card stat copy uses the short label `特性` instead of `傾向` where space is tight.
- Evolution card text is placed inside the card safe area in this order: name / tag / short role / condition / trait.
- Long role and trait strings must be clamped before rendering so they do not touch the lower border.
- Velociraptor branch display names are `ファルクス`, `ノクスヴェナ`, and `ヴォルグラム`; internal ids remain unchanged.
- Refreshed branch hero images should be rendered with contain scaling and no additional icon frame.
## MVP-127/128 Triceratops and Tyrannosaurus Branches

- Codex dinosaur selection now supports normal speed / hunting / attack branches for all three base dinosaurs.
- Triceratops branches:
  - `セラヴェル`
  - `セラノクス`
  - `グランボルグ`
- Tyrannosaurus branches:
  - `レグナクス`
  - `ヴェナトロス`
  - `レクスヴォルグ`
- Branch cards should use generic card frames; dinosaur art is overlaid from hero assets.
- ZERO cards remain `???` / unparsed until a future ZERO reward writes the matching discovery key.
- Debug discovery checks:
  - `debugDiscoverAllEvolutions=1` shows all normal branches for visual QA.
  - `debugDino=<id>&debugForceEvolution=<tag>` can reveal one branch for the selected dinosaur during QA.

## MVP-129 Codex Evolution Art QA

- Codex branch cards should show branch-specific hero art that reads as an evolved species, not as a tinted base dinosaur.
- MVP-129 refreshed triceratops and tyrannosaurus evolution heroes. These same hero masters are shared by codex, home favorite display, and future result/reward surfaces.
- Card art must remain overlaid by code, never baked into the card frame, so missing or later-replaced heroes can fall back cleanly.
- If a hero is missing, the codex falls back to unknown silhouette or base dinosaur art without stretching.

## MVP-130 Evolution Name And Art Safety

- Codex branch names use the current `evolution_data.js` display names and stable ids.
- Existing discoveries should not freeze old display names; branch master data is authoritative for display.
- `tyrannosaurus_attack` / `レクスヴォルグ` hero and portrait were refreshed to avoid a clipped-looking left edge. Codex should continue using contain scaling and should not crop branch heroes.

## MVP-130b Codex Display Names

- Codex display names are fully katakana species names:
  - Velociraptor: `ファルクス`, `ノクスヴェナ`, `ヴォルグラム`
  - Triceratops: `セラヴェル`, `セラノクス`, `グランボルグ`
  - Tyrannosaurus: `レグナクス`, `ヴェナトロス`, `レクスヴォルグ`
- Internal ids remain unchanged and are the only keys used for `discoveredEvolutions`.

## MVP-149 ZERO Route Card

- The codex can resolve a dinosaur-specific ZERO branch from `evolution_data.js`.
- `tyrannosaurus_zero` appears as `オメガレクス` after its ZERO route is unlocked or when debug unlock is active.
- Before unlock, the ZERO branch remains an unparsed `???` card and does not reveal the route art.
- `debugUnlockZeroRoute=tyrannosaurus_zero` and `debugDiscoverAllEvolutions=1` are valid visual QA paths.
- ZERO route cards use the same contain-fit hero rendering and fallback rules as normal evolution cards.

## MVP-150 Omega Rex Codex QA

- `tyrannosaurus_zero` art was rebuilt as a dedicated ZERO reward route, not a tinted tyrannosaurus branch.
- Codex should show `オメガレクス`, the ZERO tag, route description, and the rebuilt hero after unlock.
- Locked state remains `???` until `unlockedZeroRoutes.tyrannosaurus_zero` or the debug unlock flag is active.

## MVP-151 Codex Text And ZERO Art Rule

- `tyrannosaurus_zero` codex cards must resolve `assets/dinos/evolutions/heroes/tyrannosaurus_zero_hero.png` directly. Falling back to the base tyrannosaurus hero is allowed only when the ZERO hero texture is missing.
- Card text stays concise: name, ZERO tag, short feature, concrete evolution condition, and route state.
- `ZERO CLEAR` is an unlock source, not an in-run evolution condition. Do not show `ZERO CLEAR` in the card condition line.
- For `tyrannosaurus_zero`, the current card must fit the existing three text lines without a new detail panel:
  - `対象: ティラノ系統 / Lv8+`
  - `高速Lv3 / 狩猟Lv3`
  - `攻撃Lv3 / ルート解析済`
- Full important information belongs in branch data for future detail panels: ZERO clear unlock, tyrannosaurus lineage, speed / hunting / attack each level 3+, level 8+, and upper-evolution-after-normal-branch support.
- TODO: A future codex detail panel may show full unlock and evolution condition text, but MVP-151b keeps the current card-only UI.

## MVP-151d Evolution Card Condition Standard

- Evolution cards prioritize evolution requirements over traits. If space is tight, omit trait/role text instead of shortening important requirements.
- The card text structure is:
  - line 1: evolution name
  - line 2: mutation/tag label
  - line 3: condition line 1
  - line 4: condition line 2
- Normal evolution cards read from `displayConditions` in `evolution_data.js`:
  - speed: `Lv5+ / 高速Lv3` + lineage
  - hunting: `Lv5+ / 狩猟Lv3` + lineage
  - attack: `Lv5+ / 攻撃Lv3` + lineage
- ZERO upper evolution cards use the same two-line condition shape. `tyrannosaurus_zero` displays `Lv8+ / 高速Lv3 / 狩猟Lv3` and `攻撃Lv3 / ルート解析済`.
- `ZERO CLEAR` remains excluded from evolution-condition text. It is only the route unlock source.
- A full codex detail panel remains a post-release candidate; MVP-151d does not add a new panel.

## MVP-151e Condition Color Rule

- When a card uses two lines for evolution conditions, both condition lines must use the same color.
- Normal evolution condition lines use the standard condition yellow.
- ZERO upper evolution condition lines may use a light ZERO accent, but both lines must use the same accent.
- Unknown / unparsed cards keep their muted unknown colors.

## MVP-151c ZERO Route Scope In Codex

- `tyrannosaurus_zero` / `オメガレクス` is the only production ZERO reward route currently visible after unlock.
- The Omega Rex route is assigned to swamp ZERO clear.
- `velociraptor_zero` is visible after route unlock; `triceratops_zero` remains `???` / unparsed until its production route is implemented.
- ruins has no pre-release ZERO route; keep the ZERO slot unknown / future-facing rather than revealing a fourth-dinosaur reward.

## MVP-152 Velociraptor ZERO Codex Card

- `velociraptor_zero` / `アビスラプス` is now a production ZERO route.
- Before route unlock, the velociraptor ZERO slot remains `???` / unparsed.
- After `unlockedZeroRoutes.velociraptor_zero`, the card shows:
  - dedicated hero.
  - display name `アビスラプス`.
  - mutation/tag label `ZERO上位進化`.
  - compact conditions:
    - `Lv8+ / 高速Lv3 / 狩猟Lv3`
    - `攻撃Lv3 / ルート解析済`
- The condition color rule from MVP-151e still applies: both condition lines use the same color.
- `triceratops_zero` remains planned, and ruins remains future-facing / post-release.

## MVP-153 Volcano ZERO Codex Rule

- `triceratops_zero` is a production ZERO route after volcano ZERO clear or `debugUnlockZeroRoute=triceratops_zero`.
- The card uses `triceratops_zero_hero.png` and the standard two-line ZERO condition format.
- Locked state remains `???` / unresolved until the route is analyzed.

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
- Codex release scope keeps condition text compact in cards and defers a full detail panel.
- Public ZERO route cards remain limited to velociraptor / triceratops / tyrannosaurus ZERO routes.
- Ruins ZERO reward content should remain hidden or post-release labeled until the fourth dinosaur route exists.
- Final polish should recheck text clipping after font and mobile layout passes.

### MVP-157 Mobile Codex Notes
- Codex remains card-based for pre-release; no detail panel was added.
- Page-level zoom/selection suppression prevents accidental text selection or browser zoom while swiping/tapping around the fixed app canvas.
- Final device QA should recheck long condition strings after any future font pass.

### MVP-157b Mobile RC Check
- No codex layout change was made.
- Physical narrow-screen QA remains required for long condition strings and ZERO route cards because the in-app browser pass cannot fully emulate every phone viewport and font rasterization difference.
## MVP-159 Final Polish

- 図鑑タイトルはタップでタイトル画面へ戻るショートカットとして扱う。
- 進化条件2行の色統一を維持し、通常進化/ZERO上位進化とも重要条件が省略されないことを優先する。
- 図鑑詳細パネルは公開後追加候補のまま。公開前は現行カード内で読める短い条件表示に留める。
- UIフォントは `Zen Kaku Gothic New` を基準にし、英数字混在時は `Oxanium` をフォールバックに含める。

## MVP-A01: 図鑑表示

- スピノサウルス系統を図鑑に追加。
- 原種、speed/hunting/attack、将来用ZERO枠を表示。
- ZERO枠は未解析扱いを維持し、`debugUnlockZeroRoute=spinosaurus_zero` でQA可能。

## MVP-A01b: Codex Selector Overflow Fix

- The top dinosaur selector is now a masked horizontal scroll/swipe strip.
- Only the selector strip scrolls; the whole Codex screen must not gain horizontal page scroll.
- The layout is intended to tolerate 4 dinosaurs now and 5-6 dinosaurs later.


## MVP-A01d ???????

- ???????????????A01d?????hero/portrait??????
- 4???????????????????????????5??/6??????????????????????????
## MVP-A07 Locked Dino Display

- Research-locked dinos remain selectable in the top selector, but their image is shown as an unknown silhouette until unlocked.
- Locked dino names may be visible, but detailed lineage, stats, origin, and branch cards stay limited.
- Spinosaurus follows this rule unless unlocked through research or debug unlock parameters.
