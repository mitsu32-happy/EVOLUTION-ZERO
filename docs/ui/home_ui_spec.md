# EVOLUTION ZERO Home UI Spec

## MVP-A02 Home Information Tabs

Purpose: reduce Home density for iPhone Safari and other narrow mobile browsers while keeping sortie as the primary action.

Always visible:

- EVOLUTION ZERO logo
- DNA / ResearchPt resource panel
- equipped title / frame
- selected dinosaur hero
- dinosaur name and short role line
- sortie button
- bottom navigation

Tabbed Home info panel:

- Default tab: `デイリー`
- Other tabs: `記録`, `解放`
- Only one tab body is visible at a time.
- Tabs are tap targets, not horizontal scrolling.
- The tab strip is designed to fit three buttons on 390px-class screens.

`デイリー` tab:

- Shows three missions.
- Shows progress or completed/claimed state.
- Shows ResearchPt-only rewards as short `Pt +N` labels.
- Claim buttons stay inside the panel and remain large enough for touch.

`記録` tab:

- Moves score, survival time, sortie count, and kill count out of the always-visible area.
- Uses a two-column layout for scanability.

`解放` tab:

- Moves dinosaur, evolution, skill, and ZERO route counts out of the always-visible area.
- Dinosaur count uses the current playable roster, including research-unlocked spinosaurus.
- ZERO route count allows undiscovered future routes without crowding Home.

Spacing rules:

- Sortie button keeps a clear gap above the tab strip.
- The info panel is below the sortie button and above bottom navigation.
- Text should remain readable with Safari top/bottom browser UI visible.
- Future fifth/sixth dinosaurs should not add new always-visible Home panels; use the tab body or a later details screen.

Out of scope for MVP-A02:

- PWA/fullscreen install behavior.
- Loading optimization.
- New dinosaurs or new stages.
- Large new asset generation.

## 目的

ホーム画面は、EVOLUTION ZERO の永続進行ハブとして扱う。プレイ中情報は表示せず、出撃、所持リソース、解放状況、記録、デイリーミッション、ホーム表示恐竜、下部ナビをスマホ縦1画面に収める。

## 最重要参照

- `references/ui/home_ui_v3.png`
- `references/ui/stage_select_ui_v2.png`
- `references/ui/dino_select_ui_v3.png`

## 表示する情報

- EVOLUTION ZERO ロゴ
- DNA / 研究Pt
- ホーム表示恐竜と簡易切替
- 出撃ボタン
- 恐竜 / 進化 / スキルの解放状況
- スコア / 生存 / 出撃 / 撃破の記録
- デイリーミッション3行
- 下部ナビ

## 表示しない情報

- 右上リソース内の最高スコア
- 現在ステージ
- 難易度
- 出撃条件
- プレイ中スキル
- 現在進化
- 適応値詳細
- DNA研究の詳細進行項目
- `Lv` / レベル表記
- 恒久レベル制や一本道進化に見える表現

## MVP-080 パネル方針

MVP-080 では、ホーム画面の実表示サイズに合わせて `resource_panel.png` / `unlock_status_panel.png` / `record_panel.png` / `daily_mission_panel.png` を再生成した。

標準方針:

- パネルはホーム専用比率に合わせる。
- 内部に細かい項目枠を作らない。
- パネル全体の外枠を中心に装飾する。
- 内側はテキストを自由に置ける広い暗色・半透明領域にする。
- 文字、数値、ラベルは画像へ焼き込まず、コード側で描画する。
- 装飾は外周中心に寄せ、読みやすさを優先する。

## MVP-081 微調整基準

MVP-081 では MVP-080 の構成とアセット方針を維持し、縦方向の余白だけを調整する。

重要な配置基準:

- パネル画像の外寸ではなく、外枠を除いた内側コンテンツ領域を基準に配置する。
- テキスト、数値、アイコン、ボタンは外枠や光彩に重ねない。
- 各パネルはコード側で `*_CONTENT` 相当の内側余白を持ち、その内側へ表示要素を置く。

ホームhero:

- hero は上部リソースに干渉しない範囲でやや上寄せにする。
- 下部パネルとの距離を確保するため、恐竜heroの中心Yは従来より約10px上を基準にする。
- hero表示サイズは大きく変えない。

パネル縦余白:

- `unlock_status_panel.png` / `record_panel.png` / `daily_mission_panel.png` は横幅を維持し、表示高さだけを少し広げる。
- 文字サイズを小さくするより、表示領域を広げる方向を優先する。
- 外枠中心デザインを維持し、内部細分枠は追加しない。
- 配置計算ではパネル外寸ぎりぎりを使わず、外枠分の余白を除いた範囲を使う。
- 上側余白を維持しつつ、最下段の文字・数値・ボタンは下外枠から10px以上離すことを目安にする。
- 解放パネルと記録パネルは、外枠の下側装飾が強いため、最下段をデイリーよりも少し上へ寄せる。
- `解放` / `記録` の見出しと1行目の間は広げすぎず、見出し直下にまとまって見える距離にする。

デイリー3行表示:

- 3行表示を維持する。
- 行間は約29pxを基準にし、進捗、報酬、`受取` ボタンがパネル外周へ乗らない余白を確保する。
- `受取` / `達成済み` はパネル内に完全に収める。

下部ナビ:

- 枠+アイコン一体型アセットを維持する。
- アイコン位置はアセット中央のまま変更しない。
- ラベルのみ少し上へ寄せ、下端への窮屈さを避ける。
- タップ領域は `84 x 86` を維持する。

## 上部リソース

使用アセット:

- `public/assets/ui/home/resource_panel.png`
- `public/assets/ui/home/icon_dna_red.png`
- `public/assets/ui/home/icon_research_beaker_blue.png`

表示項目:

- DNA
- 研究Pt

ルール:

- 最高スコアは右上リソースに出さない。
- 最高スコアは記録パネル側へ集約する。
- DNA は赤いDNAアイコン、研究Pt は青いビーカーアイコンを使う。
- ロゴと重ならない右上領域へ配置する。
- アイコン、ラベル、数値は `resource_panel.png` の内側に収める。

## ホーム表示恐竜

使用アセット:

- `public/assets/ui/home/home_dino_selector.png`
- `public/assets/ui/home/home_dino_switch_left.png`
- `public/assets/ui/home/home_dino_switch_right.png`
- `public/assets/dinos/dino_select/*_hero.png`

仕様:

- `currentHomeDino` を優先し、`favoriteDinoId` / `homeDinoId` を将来互換の受け口として扱う。
- 初期表示はヴェロキラプトル。
- 解放済み恐竜のみ切替対象にする。
- 未解放恐竜はホーム表示対象にしない。
- MVP-079 以降、左右切替ボタンでヴェロキラプトル / トリケラトプス / ティラノサウルスを切替できる。
- アセット未読込時も fallback シルエットを表示する。

## 解放状況

使用アセット:

- `public/assets/ui/home/unlock_status_panel.png`

表示:

- 恐竜
- 進化
- スキル

ルール:

- 3項目をコンパクトに表示する。
- パネル内にはコード側で小アイコン、ラベル、数値を描画する。
- 分岐進化 + 適応タグ方式と矛盾しないよう、段階進化に見える文言は使わない。

## 記録パネル

使用アセット:

- `public/assets/ui/home/record_panel.png`

表示:

- スコア
- 生存
- 出撃
- 撃破

ルール:

- 最高スコアはこのパネルで扱う。
- 2列 x 2行を基本に、外枠や光彩と文字が重ならないように配置する。
- スマホ縦で読めるサイズを優先する。

## デイリーミッション

使用アセット:

- `public/assets/ui/home/daily_mission_panel.png`

仕様:

- 3行表示を維持する。
- 各行はミッション名、進捗、報酬、受け取り状態を表示する。
- 達成時は `受取` ボタンを表示する。
- 受け取り後は `達成済み` 状態にし、再受け取りは不可にする。
- MVP-080 では正式な日次リセットや報酬運用より、配置精度と見た目を優先する。

## 出撃ボタン

使用アセット:

- `public/assets/ui/home/sortie_button_frame.png`

ルール:

- ホーム内で最も押しやすい主要CTAとして維持する。
- 文言は `出撃` を主にする。
- ステージ名、難易度、出撃条件はホームに表示しない。

## 下部ナビ

使用アセット:

- `public/assets/ui/common/bottom_nav_background.png`
- `public/assets/ui/common/nav_home_idle.png`
- `public/assets/ui/common/nav_home_selected.png`
- `public/assets/ui/common/nav_research_idle.png`
- `public/assets/ui/common/nav_research_selected.png`
- `public/assets/ui/common/nav_codex_idle.png`
- `public/assets/ui/common/nav_codex_selected.png`
- `public/assets/ui/common/nav_settings_idle.png`
- `public/assets/ui/common/nav_settings_selected.png`

標準方針:

- MVP-080 以降、下部ナビは枠とアイコンを一体化したタブ別アセットを標準にする。
- アイコンは画像内で中央に固定する。
- selected は発光、縁取り、明度差で明確にする。
- ラベルはコード側で描画して重ねる。
- タップ領域は `84 x 86` を維持する。
- 旧 `nav_button_*` と `nav_*_icon.png` は fallback 互換として残す。

## 操作フィードバック

MVP-082 ではホーム画面の主要操作に短い押下フィードバックを付ける。

対象:

- 出撃ボタン
- デイリー受取ボタン
- 下部ナビ
- ホーム恐竜切替ボタン

ルール:

- 反応時間は約0.08〜0.15秒に収める。
- 縮小、アルファ変化、軽い明滅の範囲に留める。
- 派手な粒子、画面揺れ、大きなレイアウト移動は使わない。
- selected / disabled / claimed 状態は押下反応より優先する。
- デイリー受取済みは押せない状態にし、低アルファとグレー系文字で表現する。
- SEは `ui_click` / `ui_confirm` の呼び出し口だけ用意する。音声素材が未配置でも警告を出さない optional 再生として扱う。

## MVP-113 デイリー研究Pt

- デイリーミッションは研究Ptの少量獲得導線として扱う。
- 報酬量は控えめにし、1日3件合計で10〜15Pt程度を目安にする。
- 現在値:
  - 1回出撃: +4Pt
  - EXP収集: +4Pt
  - 敵撃破: +5Pt
- 受取後は `dailyMissionClaims` に保存し、ホーム上部の研究Pt表示へ即時反映する。
- 研究PtはDNA研究の適応能力解放に使うため、配りすぎない。

## Fallback

アセット未読込でも起動不能にしない。

- 背景未読込: Graphics背景
- ロゴ未読込: PixiJS Text
- 恐竜hero未読込: Graphicsシルエット
- パネル未読込: Graphicsパネル
- リソースアイコン未読込: Graphics小アイコン
- 出撃ボタン未読込: Graphicsボタン
- 恐竜切替未読込: Graphicsボタン + 透明タップ領域
- 下部ナビ一体型アセット未読込: 旧フレーム + 旧アイコン、または Graphicsナビ
## MVP-119 Title And Evolution Display Hooks

- Home may eventually show the equipped title near the favorite dinosaur hero.
- Title display is cosmetic and must not imply dinosaur level or permanent evolution stage.
- Normal title frames and ZERO deluxe title frames should be separate assets.
- Favorite dinosaur display should be able to accept a discovered evolution hero in addition to the base dinosaur hero.
- Undiscovered ZERO evolution heroes must not be selectable for home display.
- Evolution hero images should come from the shared master assets used by codex and future result screens:
  - `public/assets/dinos/evolutions/heroes/<dino>_<branch>_hero.png`
  - `public/assets/dinos/evolutions/portraits/<dino>_<branch>_portrait.png`

## MVP-120 Evolution Hero Preview

- Home favorite display can preview a discovered velociraptor evolution hero via `?debugEvolution=speed|hunting|attack` while the normal favorite dinosaur structure remains unchanged.
- Generated evolution heroes are shared master assets and should later be selectable only after their branch is discovered.
- ZERO unknown routes are not valid home favorite display targets.

## MVP-121 Home Evolution Favorite Hook

- Home display can cycle through base dinosaurs plus discovered non-ZERO evolution branches.
- `currentHomeEvolutionId` stores the selected discovered evolution branch. Selecting a base dinosaur clears it.
- Undiscovered and ZERO-unknown branches are not valid home favorite targets.
- Debug `?debugEvolution=speed|hunting|attack` remains a preview route and does not write save data.
## MVP-127/128 Home Evolution Display

- Home favorite display may use discovered evolution hero images for all three base dinosaurs.
- The selected evolution is stored by stable branch id, not by display name.
- Undiscovered branches must not appear as selectable home favorite targets.
- If an evolution hero is missing, the home screen falls back to the base dinosaur hero.
- The same shared hero source is used by codex, result, and future reward screens.

## MVP-129 Home Evolution Art QA

- Home favorite evolution previews must use the same dedicated branch hero masters as codex/result.
- MVP-129 refreshed triceratops and tyrannosaurus branch heroes so favorite display should no longer read as a base dinosaur tint.
- Missing branch heroes still fall back to the base dinosaur hero; undiscovered branches remain unavailable for normal selection.

## MVP-130 Home Evolution Name Rule

- Home favorite evolution selection must show the evolution dinosaur display name, not the adaptation tag label.
- Do not show `高速適応`, `狩猟適応`, `攻撃適応`, `speed`, `hunting`, or `attack` as the selected evolution name.
- If the full evolution name does not fit, shorten from the display name only; do not fall back to the tag label.

## MVP-130b Home Selection Order

- Home favorite targets are ordered by lineage, not by display name or save insertion order.
- Display order:
  - ヴェロキラプトル -> speed branch -> hunting branch -> attack branch
  - トリケラトプス -> speed branch -> hunting branch -> attack branch
  - ティラノサウルス -> speed branch -> hunting branch -> attack branch
- Normal home selection shows only base dinosaurs and discovered normal branches. ZERO / undiscovered branches stay hidden from the normal home selector.
- Display names are read from the current evolution master data so old saves do not keep outdated branch names.

## MVP-131 Title Reward Home Display

- Home should support an equipped title above or near the favorite dinosaur hero in a future MVP.
- Title text must be cosmetic only and must not imply dinosaur level or permanent character rank.
- Normal first-clear titles use restrained cyan/amber frames.
- ZERO titles use deluxe black/gold/red frames.
- Title frames must not cover the dinosaur face, home resource panel, sortie button, or bottom nav.
- Missing title/frame data should hide the title UI rather than showing placeholder copy.

## MVP-133 Equipped Title Display

- Home reads `equippedTitleId` and `equippedTitleFrameId` from save data.
- If an equipped title exists, the title is shown in a compact frame slightly above the favorite dinosaur hero.
- If no equipped title exists, the title frame and text are hidden.
- Title display is cosmetic only; it does not affect dinosaur stats, level, research, or evolution discovery.
- MVP-133 does not add a title selection UI. The first obtained title is auto-equipped only when there is no existing equipped title.
- Frame color is derived from the title frame definition:
  - `normal_clear_frame`: cyan
  - `hard_clear_frame`: amber
  - `expert_clear_frame`: red
  - `zero_deluxe_frame`: reserved for future ZERO rewards

## MVP-149 ZERO Evolution Home Candidate

- Home favorite candidates may include discovered ZERO routes after the matching `unlockedZeroRoutes` entry exists.
- `tyrannosaurus_zero` is shown as `オメガレクス` after ZERO clear or with `debugUnlockZeroRoute=tyrannosaurus_zero`.
- Undiscovered ZERO routes are not shown in the normal home candidate list.
- Home ordering remains lineage-first; ZERO routes are appended after speed / hunting / attack for that lineage when visible.

## MVP-150 Omega Rex Home QA

- The rebuilt Omega Rex hero is used in home favorite display when the ZERO route is selected.
- Debug-only route candidates can be cycled without writing a fake permanent discovery to save data.
- Normal locked players should not see Omega Rex in the home candidate list before ZERO route unlock.

## MVP-151c ZERO Route Home Scope

- Home may show `tyrannosaurus_zero` / `オメガレクス` only after `unlockedZeroRoutes.tyrannosaurus_zero` exists or via the explicit debug route flag.
- Omega Rex is the swamp ZERO reward route.
- The jungle ZERO route is now a home candidate after unlock; the planned volcano ZERO route is not a home candidate until its dedicated production assets and route data are implemented.
- ruins has no pre-release home candidate for a ZERO reward route.

## MVP-152 Velociraptor ZERO Home Candidate

- Home may show `velociraptor_zero` / `アビスラプス` only after `unlockedZeroRoutes.velociraptor_zero` exists or through the explicit debug route flag.
- It appears in the velociraptor lineage after speed / hunting / attack when visible.
- The favorite hero uses `velociraptor_zero_hero.png`.
- Locked players must not see `アビスラプス` in the normal home candidate list.
- Swamp reward Omega Rex remains visible only after `tyrannosaurus_zero` unlock.
- Ruins has no pre-release ZERO home candidate.

## MVP-152c Home Dinosaur Texture Priority

- The home hero texture must use the base dinosaur art unless a concrete `currentHomeEvolutionId` / selected candidate is active.
- URL flags such as `debugEvolution=zero` must not override the default home hero by themselves.
- `debugUnlockZeroRoute=<routeId>` may add a ZERO route to the candidate cycle for QA, but it must not change the initial base dinosaur display until that candidate is explicitly selected.
- This prevents normal Velociraptor from being displayed as Abyss Raptor on the home screen.

## MVP-153 Volcano ZERO Home Rule

- Home may include `triceratops_zero` / `イグニケラ` only after `unlockedZeroRoutes.triceratops_zero` exists or through explicit debug route unlock.
- Base triceratops display must not be polluted by ZERO route debug flags unless the ZERO evolution entry is selected as a home candidate.

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
- Home release QA must keep normal dinosaur display separate from unlocked ZERO evolution candidates.
- ZERO evolutions should appear only as explicit favorite/display candidates after their route is unlocked.
- Equipped title and frame display remains tied to owned title/frame save data.
- Final mobile QA should verify hero cropping and title/frame placement on narrow screens.
## MVP-159 Final Polish

- タイトルロゴはホーム画面からタイトル画面へ戻るショートカットとして扱う。プレイ中HUDは誤操作防止のため対象外。
- ホーム称号は恐竜hero上部に小型パネルで表示する。未装備時は控えめに「称号なし」を表示し、通常称号とZERO称号はフレーム色・線幅・装飾密度で差を出す。
- ZERO称号フレームは金/紫/赤橙などステージ固有アクセントを使い、hero画像を隠さない透明度で表示する。
- 長い称号名はパネル幅内に収まるように縮小し、スマホ幅でもhero・出撃ボタン・下部ナビと重ならないことを確認する。
- UIフォントは同梱した `Zen Kaku Gothic New` を日本語UIの基準、`Oxanium` を英数字/HUD寄りの補助として使う。
## MVP-160c Home Title And Daily Polish

- Home title display validates `equippedTitleId` and `equippedTitleFrameId` against owned title/frame save data before showing them.
- If the equipped title is missing or no longer owned, Home falls back to the highest-order owned title. If no title is owned, it shows a restrained `称号なし` panel.
- Title frames are derived from the equipped frame first, then the title's frame definition. Missing frame assets continue to use the Graphics fallback.
- ZERO titles use a larger black/gold accented frame while normal titles remain compact cyan/amber/red frames.
- Home daily missions now read the save-backed `dailyMissions` table instead of fixed total-run counters.
- Daily rows show three selected missions, progress, reward, `達成`, `受取`, and `受取済み` states inside the existing daily panel.
- Debug helper `debugUnlockAllTitles=1` unlocks normal, ENDLESS, and ZERO titles/frames for Home QA.

## MVP-160d Title Selection And ResearchPt Daily

- Tapping the Home title display opens the title selection modal.
- Owned titles and owned frames can be equipped independently.
- The modal uses paged lists to stay within smartphone portrait layout.
- Equipped changes update the Home title frame immediately and persist after reload.
- Daily rewards are displayed as `Pt +N` in the compact Home panel and resolve to ResearchPt only.
- DNA is no longer granted by daily mission claims.

## MVP-160e Title UI Asset Polish

- 称号選択UIは `public/assets/ui/titles/` の専用PNGを優先表示する。
- パネル、タブ、スロット、装備ボタン、閉じる/ページ送りボタンは専用アセット化した。
- Home称号フレームも専用PNGを優先し、未読込時のみ従来のGraphics fallbackを使う。
- 装備変更は `SaveManager.setEquippedTitle` / `setEquippedTitleFrame` を通し、所有済みチェック後に保存する。
- ZERO称号/フレームは通常称号より発光と色差を強め、jungle/volcano/swampで識別できるようにする。

## MVP-160f Home Reflection Fix

- 称号選択UIから保存成功した場合、Homeは `setSaveData` を呼び、`equippedTitleId` / `equippedTitleFrameId` を即反映する。
- Home称号表示は専用PNGフレームを優先し、テクスチャ未読込時のみGraphics fallbackを使う。
- 称号選択UI側ではカードタップと装備保存が分離されているため、誤タップによる即装備を避ける。
## MVP-160f Title Frame Reuse Correction

- Home title frame lookup no longer reuses the jungle ZERO frame for `zero_deluxe_frame`.
- Generic ZERO title display now uses `title_frame_zero_deluxe.png`.
- Stage-specific ZERO frames remain separate: jungle, volcano, and swamp each keep their own frame PNG.
- Home must continue to validate `equippedTitleFrameId` against owned frame data before displaying it.

## MVP-A01: ホーム表示

- ホーム候補にスピノサウルスを追加。ただし研究解放済み、または `debugUnlockDino=spinosaurus` の場合のみ表示。
- ZERO進化は通常表示を汚染しない既存ルールを維持。


## MVP-A01d ????????

- ??????????????A01d?hero??????
- ZERO????????????????????????????

## MVP-A02b Home Common Info Panel

- Home lower information tabs use one shared generated panel asset instead of separate Daily / Record / Unlock panel backgrounds.
- Runtime assets:
  - `public/assets/ui/home/home_info_panel_common.png`
  - `public/assets/ui/home/home_info_panel_common_active_glow.png`
  - `public/assets/ui/home/home_info_tab_selected.png`
  - `public/assets/ui/home/home_info_tab_inactive.png`
- The tab background stays visually consistent; only the tab content switches.
- The common panel is placed at `x=18, y=536, w=354, h=196` on the 390px mobile layout.
- Bottom navigation starts around `y=750`; the panel ends around `y=732`, leaving an 18px tap-safety gap.
- Daily remains the default tab and keeps three mission rows with ResearchPt-only rewards.
- Record and Unlock tabs use the same panel with larger values and wider row spacing for narrow iPhone Safari readability.

## MVP-A07 Home Readability

- Dino name now sits on a light translucent plate so long names remain readable over dark hero art.
- Home dino selector hint no longer shows short dino nicknames; it uses `表示恐竜を切り替え`.
- Daily tab has a small `一括受取` action. It claims all completed, unclaimed daily missions and keeps ResearchPt-only rewards.
- Home keeps a compact notice line for update notes without adding another large panel.
- Dino type copy is shortened to simple roles such as `スピード型`, `防御型`, `火力型`, and `中距離型`.
## MVP-A07b News Menu

- Home now has a small `お知らせ` entry button near the upper information area.
- The entry opens a dedicated news modal with a generated SF panel, generated list cards, and a generated detail panel.
- News content is defined in `src/data/update_news.js` with `date`, `category`, `title`, `body`, and `isImportant`.
- The compact Home notice line may still show the latest title, but long update notes belong in the modal detail view.
- The modal must stay readable on 390px mobile width and must close without affecting the Daily / Record / Unlock tabs.

## MVP-A07c Generated News UI Assets

- News UI now uses illustrated A07c assets generated from `docs/assets/a07c_ui_asset_source_sheet.png` instead of the simpler A07b PNG set.
- Runtime preferred assets include `news_button_a07c.png`, `news_panel_list_a07c.png`, `news_panel_detail_a07c.png`, list item variants, close/back buttons, and update/normal badges.
- The old compact bottom news line is removed from default Home display; the dedicated news button is the primary entry.
- News detail body uses a narrower wrapped text area and a masked scroll area for long update text.
## MVP-A07d News UI Simplification

- The Home news entry now uses `news_button_a07d.png`, a higher-contrast compact button that stays secondary to the sortie button.
- News list and detail views share `news_panel_outer_a07d.png` so the UI reads as one consistent menu instead of multiple nested panels.
- News list rows use `news_list_item_a07d.png` with date, title, and category rendered in code. Normal items no longer need a separate badge asset.
- Detail text uses a wider word-wrap area and a taller masked scroll region to reduce right-edge clipping and improve long-body readability.
- Close/back controls use icon-first A07d button images; text labels are fallback-only when the images are missing.

## MVP-A07e News UI Final Adjustment

- Close/back buttons are placed inside the shared news panel with enough padding from the outer frame.
- The dark modal overlay closes the news UI when tapped outside the panel.
- The panel itself captures taps, so list cards, detail text, and scroll gestures do not accidentally close the modal.
- The Home news entry label is larger, centered, and given a subtle shadow for readability over the dark home background.

## MVP-A07e.1 News UI Final Micro Adjustment

- The Home news entry label was enlarged again and vertically centered inside `news_button_a07d.png`.
- The detail view no longer shows the close button; users return to the list with the back button or close the modal by tapping outside the frame.
- The detail back button was moved further inside the shared panel so it does not touch the outer frame ornament.

## MVP-A07e.2 News UI Final Micro Adjustment

- The close button is hidden in both news list and news detail views.
- News modal close behavior is unified to tapping outside the panel.
- The Home news entry label keeps the A07e.1 size and is moved slightly downward for visual vertical centering.

## MVP-A10 Sortie Panel Asset Replacement

- The Home sortie area now prefers A10 generated assets: `sortie_button_frame_a10.png`, `sortie_button_left_icon_a10.png`, and `sortie_button_glow_a10.png`.
- The old Graphics triangle remains fallback only when the A10 left icon is unavailable.
- Runtime text stays code-rendered so `出撃` and `ステージ選択へ` remain crisp on mobile/PWA displays.
- QA artifact: `docs/assets/a10_ui_contact.png`.
