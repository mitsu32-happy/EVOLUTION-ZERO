# Result UI Spec

## Reference

- Primary reference: `references/ui/result_ui_v1.png`
- Related references: `references/ui/home_ui_v3.png`, `references/ui/pause_ui_v1.png`, `references/ui/dna_research_ui_v2.png`, `docs/mockups/mvp095/play_hud_mock_v5_image2_adopted.png`

## Role

- The result screen is the run analysis surface after play ends.
- It must support current rewards and future reward types without becoming crowded.
- It is not a title, home, or research screen. The visual tone should feel like a survival data report from the research facility.

## Result States

- `CLEAR`: explicit stage-clear result. Boss defeated clear should call the run-result clear path with reason `boss`.
- `GAME OVER`: HP reaches zero, or the player manually ends the sortie from pause.
- `RESULT`: normal run summary / endless summary.
- `ZERO RESULT`: reserved for future ZERO mode clear and special rewards.

Runtime state should prefer `gameState.runResult.type` over incidental counters:

- `gameover`: failure / sortie ended.
- `clear`: stage clear. `reason: 'boss'` displays the boss-clear copy.
- `zeroClear`: ZERO clear / special result.

`defeatedBosses` remains a backward-compatible display hint, but future stage logic should set `runResult` explicitly so ENDLESS boss kills and stage-clear boss kills can diverge.

MVP-119 result state contract:

- Boss defeated as stage objective: `runResult.type = 'clear'`, `runResult.reason = 'boss'`, header `CLEAR`.
- HP0 or pause sortie end: `runResult.type = 'gameover'`, header `GAME OVER`.
- ZERO final boss defeated: `runResult.type = 'zeroClear'`, header `ZERO RESULT`.
- ENDLESS boss kills are stats only and should not automatically produce `CLEAR`.

## Display Information

Always show:

- Survival time
- Defeated count
- Score
- Selected dinosaur
- Selected evolution, or `未進化`
- Reached strengthening stage / run growth
- Acquired adaptation skills, up to three skill slots, with the same skill icons used by the HUD

Reward area:

- DNA gained
- First-clear reward status
- Title reward
- New evolution route discovery

Future reward area:

- If first-clear, ZERO, title, or evolution discovery rewards are present, show a compact `初回クリア報酬` section.
- If no first-clear style reward occurred, hide that section and move the best-record panel upward.

Untriggered future rewards should display as inactive / low-emphasis placeholders or remain hidden depending on available space.

ResearchPt is not a normal play result reward. Its main sources are daily missions and analysis conversion; future special rewards may opt in explicitly.

## Asset List

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

## Text Safety

- Generated assets are text-free. All labels and values are drawn in code.
- Use generous inner margins; do not place text on decorative borders.
- Large values should be formatted with separators and kept in short columns.
- Long title names must be compacted with ellipsis.
- Long dinosaur names should use short result labels such as `ラプトル`, `トリケラ`, or `ティラノ`.
- Button text must stay centered inside the button safe area.

## Fallback

- If result assets fail to load, `ResultUi` falls back to Graphics panels and buttons.
- Existing retry/home callbacks must remain available under fallback.
- Missing future reward data must not block result display.

## Future Hooks

`ResultUi` accepts optional result data through `saveInfo`:

- `rewardTitles`
- `firstClearRewards`
- `zeroRewards`
- `newEvolutionRoute`

Future result data should also accept:

- `discoveredEvolutionRoutes`
- `titleFrames`
- `stageClearDifficulty`
- `zeroClearRewards`

These are placeholders for future MVPs and must not require a save format break.

## MVP-118b Layout Revision

- `result_background` is a low-alpha atmosphere layer, while `result_panel` is the only primary outer panel.
- Internal panels are limited to statistics, rewards, acquired skills, optional first-clear rewards, and best records.
- `ZERO解析` is removed as an ambiguous result label. ZERO rewards should be expressed as title rewards or new evolution route discovery.
- Result rewards do not grant or display ResearchPt during normal play.

## MVP-118b Follow-up Alignment Rules

- The result main panel reuses the same generated pause panel asset as the pause screen, at the same rect: `x=10`, `y=72`, `width=screenWidth-20`, `height=screenHeight-86`.
- Do not align Result to the pause fallback Graphics rect. The shared generated pause panel is the outer frame; content panels are independently centered within its safe area.
- Result content uses a 24px horizontal safe inset from that outer panel. Header, stat, reward, skill, future-reward, and best-record panels are horizontally centered inside this safe area.
- Each internal panel keeps its own text away from decorative borders. Labels and values should sit at least 14px from the panel top/bottom and at least 18px from the left/right frame.
- Acquired adaptation skills render with the same skill-specific icons used by the HUD. Icons are cached and the skill row is refreshed when asynchronous icon loading completes. The simple line glyph is fallback only.
- Do not apply scale-based intro motion directly to generated Sprite panels after setting `width` / `height`; doing so overrides PixiJS scale and makes the source PNG render near native size. Generated panel Sprites should keep explicit width/height and use alpha-only or container-level motion if needed.
- Text and icon groups are laid out from each panel's safe rectangle center. Stat rows use a 3-column x 2-row centered grid, rewards use a 4-column centered grid, acquired skills use a centered 3-slot row, and best records use a centered 2-column grid.
- Result panel/button PNGs can contain asymmetric transparent padding. Layout must align the visible alpha bounds of each asset, not the full PNG rectangle, before placing centered text groups.
- The stat panel uses a taller safe rect than the other compact panels so the upper label/value row and lower label/value row do not overlap. When changing section Y values, move reward / skill / best-record panels as a group and keep button positions derived from the screen center rather than fixed left offsets.

## MVP-120 Evolution Portrait Hook

- Result UI can display an evolution portrait when `gameState.selectedEvolution.tag` is `speed`, `hunting`, or `attack`.
- Portraits are loaded from `public/assets/dinos/evolutions/portraits/` and should remain secondary to result text and reward panels.
- ZERO unknown rewards should use result reward route text/chips until the actual branch hero is discovered.

## MVP-121 Result Evolution Discovery Display

- Result save info includes `evolutionDiscovery` and `newEvolutionRoute` when the run records a first-time branch discovery.
- Result header record text may show `NEW EVOLUTION` alongside score/time records.
- Evolution portrait display continues to use `gameState.selectedEvolution.tag`, while discovery persistence uses branch id.

## MVP-122 First Discovery Result Rule

- Result UI continues to receive `newEvolutionRoute` when a branch is first discovered.
- Because MVP-122 records discovery at evolution selection time, PlayScene preserves that first-discovery result and forwards it to ResultUi at run end.
- Result NEW display is only for the first discovery of a branch. Reaching an already discovered branch does not repeat the NEW route reward.

## MVP-123 Evolution Presentation Result Rule

- MVP-123 changes only the in-run presentation art. Result discovery data remains the MVP-121 / MVP-122 flow.
- `newEvolutionRoute` should still be forwarded to result only for the first discovery.
- The presentation's `codex_update_chip.png` / `new_evolution_chip.png` are not result reward assets. Result should keep using its own reward panels and chips.
- If the player reaches an already discovered branch, result may show the selected evolution but must not repeat the NEW evolution reward.
## MVP-127/128 Evolution Result Display

- Result evolution portrait lookup now prefers exact branch id for all implemented normal branches.
- Supported normal branch ids:
  - `velociraptor_speed`, `velociraptor_hunting`, `velociraptor_attack`
  - `triceratops_speed`, `triceratops_hunting`, `triceratops_attack`
  - `tyrannosaurus_speed`, `tyrannosaurus_hunting`, `tyrannosaurus_attack`
- Result display must keep using `NEW` / new evolution discovery state from `discoveredEvolutions`.
- Missing branch-specific portrait assets fall back to the existing tag or base result visuals.
- ZERO reward display remains reserved for a future MVP and should not be shown for normal branch results.

## MVP-129 Result Evolution Art QA

- Result evolution portraits should use the exact branch portrait when a run ends after evolution.
- MVP-129 refreshed triceratops and tyrannosaurus branch portraits so result display should show a distinct evolved form instead of a base dinosaur color variant.
- Result should keep all text and reward panels independent from these art replacements; missing portraits fall back to existing branch/base visuals.

## MVP-130 Result Evolution Display Rule

- Result evolution names should use the current branch display name from master data, even if an old save entry contains a previous name.
- `tyrannosaurus_attack` / `レクスヴォルグ` portrait was refreshed from the new unclipped hero master. Result should keep aspect-preserving contain placement.

## MVP-130b Result Evolution Names

- Result evolution names are display-only and should come from current branch master data.
- Internal discovery ids are stable; if an older save includes an old branch name, normalize it to the current display name before showing result/new-evolution copy.
- Current result-safe names: `ファルクス`, `ノクスヴェナ`, `ヴォルグラム`, `セラヴェル`, `セラノクス`, `グランボルグ`, `レグナクス`, `ヴェナトロス`, `レクスヴォルグ`.

## MVP-131 Stage Clear Result Rules

- NORMAL / HARD / EXPERT boss defeat should show `CLEAR`.
- HP0 and pause sortie end should show `GAME OVER`.
- ENDLESS should show `RESULT` or survival-focused result copy; a single boss defeat does not clear ENDLESS.
- ZERO final boss defeat should show `ZERO CLEAR` or `ZERO RESULT`.
- Result data should use `runResult.type` as the authority:
  - `clear`
  - `gameover`
  - `endlessResult`
  - `zeroClear`
- First-clear rewards should appear only when the save/reward layer reports them.
- ZERO rewards should be shown as title/frame/new evolution route rewards. Do not reintroduce a vague `ZERO解析` item.
- ResearchPt should not be displayed as a normal run result payout.

## MVP-132 Stage Progress Result Hooks

Result UI receives stage-clear metadata through `saveInfo.stageResult`.

Display rules:

- `stageResult.isFirstClear` may show `初回クリア`.
- `saveInfo.unlockedDifficulties` may show `難易度解放` with `HARD`, `EXPERT`, `ENDLESS`, or `ZERO`.
- These are reward hooks only; title/frame grant logic is still deferred.
- Normal play still does not show ResearchPt reward.
- `runResult.type` remains the authority for header copy: `clear`, `gameover`, `zeroClear`, and future ENDLESS result types.

## MVP-133 Title Reward Result Display

Result UI now receives first-clear title rewards from `saveInfo`.

Inputs:

- `saveInfo.rewardTitles`
- `saveInfo.titleFrames`
- `saveInfo.firstClearRewards`

Display rules:

- The reward summary panel may show the awarded title name.
- The first-clear detail panel should combine title name and frame type into one compact row when space is limited.
- The display should read as `称号獲得`, not as a normal DNA or ResearchPt payout.
- ResearchPt remains excluded from normal run result rewards.
- Second and later clears do not show a repeated title reward because the save layer only grants first-clear rewards once.
- ZERO title/frame reward rows are future-facing and should reuse the same structure when ZERO rewards are implemented.

## MVP-136 Title Reward Text Safety

The first-clear detail panel is laid out as compact rows instead of three equal columns.

Rules:

- Row labels are left aligned inside the panel safe area.
- Row values are right aligned inside the same safe area.
- Title name and title frame are split into separate rows when both are present.
- Long difficulty unlock text is compacted before display.
- The layout must tolerate simultaneous `FIRST CLEAR`, difficulty unlock, title reward, title frame, and new evolution data without text crossing the panel border.

## MVP-141 Result QA Notes

- Four standard stage CLEAR routes were checked with weak-boss debug helpers:
  - jungle
  - volcano
  - swamp
  - ruins
- Result showed CLEAR, survival time, kills, score, DNA reward, acquired adaptation skill, best score/time, and retry/home buttons without major panel overflow in the checked routes.
- In the checked save state, first-clear/title rewards were already mostly owned, so the full first-clear stack was not repeated. The MVP-136 compact-row rule remains the active safety rule for first-clear, title, frame, difficulty unlock, and new evolution combinations.
- Normal run rewards must continue excluding ResearchPt. ResearchPt belongs to daily missions, analysis conversion, or future special rewards.
- `debugBossFast=1` result checks are route QA only. Standard boss timing is longer and should be tuned for adaptation-growth pacing separately from result UI layout.
## MVP-143 ENDLESS result

- ENDLESS results use `ENDLESS RESULT`, not `CLEAR`.
- The result emphasizes survival time, best time, best score, defeated count, reached evolution, selected dinosaur, and acquired adaptation skills.
- Normal play still does not grant ResearchPt through result rewards.
- ENDLESS title rewards can appear in the existing reward/title section when survival or defeat thresholds are reached.
# MVP-143 ENDLESS result

- ENDLESS runs use `ENDLESS RESULT` instead of CLEAR.
- ENDLESS result prioritizes:
  - survival time
  - best time
  - best score
  - defeated count
  - reached evolution
  - acquired adaptation skills
  - title rewards when earned
- ENDLESS does not show normal first-clear rewards unless a future special reward explicitly opts in.
- Research Pt remains excluded from normal play rewards.

# MVP-143b ENDLESS status display notes

- Current ENDLESS result uses the existing result layout and header text path.
- Future polish may add a dedicated ENDLESS header asset and late-run rank/record chips.

# MVP-144 ZERO Result

- ZERO final boss defeat displays `ZERO CLEAR`.
- ZERO failed or abandoned runs still use the normal GAME OVER/result flow.
- ZERO result should expose these reward receptacles:
  - ZERO title
  - ZERO title frame
  - new ZERO evolution route
- MVP-144 uses the existing result panel layout and future reward rows. Dedicated ZERO result header art is deferred.
- Normal play still does not grant Research Pt from the result screen.

## MVP-145 ZERO Result Presentation

- ZERO clear uses a dedicated `result_header_zero_clear.png` header asset when available.
- ZERO result keeps the established safe-area layout so normal CLEAR and GAME OVER remain unchanged.
- ZERO reward rows prioritize:
  - `ZERO称号`
  - `ZEROフレーム`
  - `新規進化ルート`
- Generated ZERO UI receptacle assets:
  - `zero_result_panel.png`
  - `zero_reward_frame.png`
  - `zero_evolution_route_chip.png`
- Text remains code-rendered; generated images must not include baked text.
- Fallback: if ZERO result assets fail to load, the existing result header/panels are used.

## MVP-146 ZERO Result QA

- ZERO result reward cells use ZERO-specific labels:
  - `ZERO称号`
  - `ZEROフレーム`
  - `進化ルート`
- Repeated ZERO clears show already-owned rewards as `取得済み` / `解析済み` instead of `未発生`.
- This keeps the reward panel readable for both first-clear and repeat-clear QA.
- Normal CLEAR, GAME OVER, and ENDLESS RESULT keep their existing reward labels and layout.
- Runtime QA confirmed the ZERO CLEAR header, main stat panel, ZERO reward panel, skill panel, best-score panel, and retry/home buttons remain inside the shared result safe area.

## MVP-147 ZERO Result Recheck

- ZERO pacing changes do not require layout changes.
- ZERO CLEAR result remains the same reward receptacle:
  - ZERO title
  - ZERO frame
  - ZERO route discovery or analyzed state
- Repeated-clear labels remain readable with `取得済み` and `解析済み`.
- Normal CLEAR / GAME OVER / ENDLESS RESULT must remain unaffected by ZERO pacing values.

## MVP-149 ZERO Route Result Detail

- ZERO CLEAR can now name the first concrete route, `tyrannosaurus_zero` / `オメガレクス`, through `saveInfo.newEvolutionRoute.routeName`.
- First clear shows the route as a new evolution route discovery.
- Repeated clears keep the analyzed-state messaging and must not duplicate the route reward.
- Result display remains a receptacle; the dedicated ZERO ultimate is still a later MVP.

## MVP-150 Omega Rex Result QA

- ZERO CLEAR route reward should display `オメガレクス` when the route is newly found.
- ZERO title, ZERO frame, and route reward must remain in the reward safe area together.
- Normal CLEAR, GAME OVER, and ENDLESS RESULT must not show Omega Rex route text unless a ZERO route reward is present.

## MVP-151c ZERO Route Result Scope

- Result receives `newEvolutionRoute` only when the cleared stage has an implemented ZERO route reward.
- Current implemented route reward:
  - swamp ZERO clear -> `tyrannosaurus_zero` / `オメガレクス`.
- jungle ZERO clear can imply the `velociraptor_zero` route reward; volcano ZERO clear should not imply a route reward until `triceratops_zero` is production-ready.
- ruins ZERO clear should not show a new evolution route before the fourth-dinosaur route is added after release.
- ZERO title/frame rows can still appear independently of route rewards.

## MVP-152 ZERO Route Result Updates

- jungle ZERO clear can show `新規進化ルート発見: アビスラプス` through `newEvolutionRoute`.
- Repeated jungle ZERO clears should show the route as already analyzed rather than granting it again.
- swamp ZERO clear continues to show the Omega Rex route reward when newly found.
- volcano ZERO clear does not show a route reward until `triceratops_zero` is implemented.
- ruins ZERO is not a normal pre-release selectable route and must not show a ZERO evolution route reward.
- Stage-specific ZERO title/frame rows should remain readable alongside route discovery rows.

## MVP-152c ZERO Result Reward Scope

- Dedicated jungle/swamp ZERO final bosses do not change result reward ownership.
- Jungle ZERO CLEAR should still show the `velociraptor_zero` route when newly unlocked.
- Swamp ZERO CLEAR should still show the `tyrannosaurus_zero` route when newly unlocked.
- Volcano ZERO must not show a route reward until the planned `triceratops_zero` route is implemented.
- Ruins ZERO is not a normal pre-release selectable mode and must not show a ZERO route reward in the public route.

## MVP-153 Volcano ZERO Result Rule

- Volcano ZERO CLEAR can now show `新規進化ルート発見: イグニケラ` when `triceratops_zero` is newly unlocked.
- Second and later clears should display the analyzed route without duplicating title/frame/route rewards.
- Jungle and swamp route display behavior is unchanged; ruins still shows no production ZERO route reward.

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
- Result QA scope covered CLEAR / ENDLESS / ZERO route smoke paths and reward mapping checks.
- ZERO result must show the correct newly discovered route only for the stage that was cleared.
- Second and later ZERO clears should show analyzed/owned state without duplicating route, title, or frame rewards.
- Remaining release risk is dense reward display on narrow screens; final mobile QA should recheck button and panel bounds.

### MVP-157 Mobile Result Polish Notes
- Result UI remains within the fixed app viewport; the page must not scroll during result display.
- Narrow-screen result QA remains a real-device checklist item for dense ZERO rewards and long title/frame names.
- No result layout code was changed in MVP-157; this pass only strengthened page-level mobile input and zoom guards.

### MVP-157b Mobile RC Check
- Result layout code remained unchanged.
- Browser-equivalent soaks did not surface result or console failures, but true ENDLESS/ZERO result transition after a 10-15 minute physical-device run remains a release-candidate checklist item.
- Dense ZERO reward rows should be rechecked on physical iPhone SE-size screens before public release.
## MVP-159 Final Polish

- RESULT画面のタイトル表示はタップでタイトル画面へ戻れるショートカットにする。既存の「ホームへ」導線は維持する。
- CLEAR / ENDLESS RESULT / ZERO CLEAR の報酬欄は、称号・フレーム・新規進化ルート表示がボタン領域を押し出さないように安全領域を維持する。
- ZERO称号/フレームは通常称号よりアクセントを強めるが、報酬テキストや操作ボタンと重ねない。
- フォントは同梱フォントに統一し、重要な報酬名やボタン文言が `...` で省略されないことを優先する。

## MVP-A01: リザルト/HUD表示

- スピノサウルスと各進化の表示名/ポートレートをリザルトとHUDへ接続。
- 到達進化名、専用必殺名、専用アイコン表示を既存3体と同じ扱いにする。


## MVP-A01d ?????????

- ????????????????????A01d?portrait/hero???????????
- ruins ZERO?????????????????spinosaurus_zero??????????????
