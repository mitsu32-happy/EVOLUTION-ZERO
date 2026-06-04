# MVP-156 Release Remaining Tasks

Date: 2026-05-24

## A. Pre-release Required

- Run `npm.cmd run build` before every release candidate.
- Perform one final app-console pass on the built candidate.
- Run short smoke QA for jungle / volcano / swamp / ruins NORMAL starts.
- Run short smoke QA for ENDLESS on at least jungle and volcano.
- Run ZERO public route smoke QA:
  - jungle ZERO -> `velociraptor_zero`
  - volcano ZERO -> `triceratops_zero`
  - swamp ZERO -> `tyrannosaurus_zero`
- Confirm ruins ZERO remains locked and labeled as post-release content.
- Confirm ZERO route rewards are not duplicated on second clear.
- Confirm home default dinosaur display is not polluted by unlocked ZERO evolutions.
- Confirm result buttons remain inside the visible panel after dense reward displays.
- Confirm no visible sheet-as-a-whole rendering in specials, boss attacks, or gimmicks.
- Confirm no obvious chromakey residue in the most frequently seen ZERO special and boss effects.
- Perform one real-device iOS Safari pass for address-bar collapse, pinch gestures, and safe-area edges.
- Perform one real-device Android Chrome pass for drag movement, back gesture behavior, and accidental zoom.
- Confirm MVP-158 audio unlock still works from the first gameplay tap without weakening the mobile zoom guards.

## B. Post-release Planned Content

- Ruins ZERO full implementation.
- Fourth dinosaur and its route reward.
- Ruins ZERO reward title / frame / evolution route.
- Additional ZERO evolution routes beyond the three public pre-release routes.
- Codex detail panel for full descriptions, unlock conditions, and longer lore text.
- Additional stage / boss variants after public baseline stabilizes.

## C. Final Polish Targets

- Font unification across HUD, codex, result, stage select, and title.
- Mobile accidental zoom prevention real-device confirmation after MVP-157 code guards.
- `touch-action` and pointer behavior real-device confirmation for Safari / iOS.
- Safari-specific canvas and viewport QA.
- PWA install / manifest / icon QA.
- MVP-160 audio full pass: stage-specific BGM, complete SE coverage, final mix balancing, and optional Japanese-source replacement candidates.
- Final chromakey cleanup for effects with visible color residue.
- Final pass on sprite edge contact and animation readability.
- Narrow-screen result panel and codex card text fit.
- Long-run ENDLESS and ZERO soak tests for enemy / projectile / effect accumulation.
- PWA fullscreen install-mode safe-area and orientation check.
- Physical-device 10-15 minute ENDLESS/ZERO soak, since MVP-157b only performed 90-second browser-equivalent soaks.

### MVP-158 Audio Notes

- Minimal audio is implemented with locally stored Kenney CC0 assets under `public/assets/audio/`.
- License/source tracking lives in:
  - `docs/assets/audio_credits_mvp158.md`
  - `docs/assets/audio_source_list_mvp158.json`
- Implemented BGM keys:
  - `title_home_bgm`
  - `normal_stage_bgm`
  - `zero_bgm`
  - `boss_bgm`
  - `result_bgm`
- Implemented SE keys include UI decide/cancel/select, attack, hit, enemy defeat, pickup/level-up, evolution, boss warning, ZERO warning, and existing ultimate-family cues.
- Mobile audio unlock remains tied to first pointer/tap interaction; autoplay-blocked BGM attempts are treated as expected browser fallback rather than release-blocking console warnings.
- MVP-160 should replace the placeholder/minimal mix with fuller stage BGM, route-specific ZERO boss music, dedicated clear/game-over jingles, environmental ambience, and final loudness balancing.

## D. Future Expansion Candidates

- More ZERO route-specific final bosses and reward stories.
- Dedicated ZERO special upgrades for every future route.
- Title selection UI and frame selection UI.
- Detailed best-record panels by stage and difficulty.
- Accessibility options for effect intensity and warning visibility.
- Device performance presets.
- Localization-safe text layout rules before adding more languages.
## MVP-159 Aftercare / MVP-160 Candidates

- 音声フル実装: ステージ別BGM、ボス別BGM、全主要SE、ミキシング最終調整。
- 図鑑詳細パネル: 公開後に全文説明、進化条件、必殺説明をカード外で読めるようにする。
- ruins ZERO / 4体目恐竜: 公開後追加コンテンツとして維持。
- 最終クロマキー掃除: 実画面で違和感が残るアセットのみ個別再生成または後処理する。
- PWA本格対応: manifest、アイコン、スタンドアロン表示、オフライン方針を別MVPで確認する。

## MVP-160 Full Audio Pass

Date: 2026-05-24

Implemented:
- Replaced the MVP-158 placeholder-heavy mix with higher-quality local assets from DOVA-SYNDROME for BGM/jingles and 効果音ラボ for major SE.
- Source/license tracking is recorded in:
  - `docs/assets/audio_credits_mvp160.md`
  - `docs/assets/audio_source_list_mvp160.json`
- Runtime playback remains local-only under `public/assets/audio/`; no external CDN or direct-link playback is used.
- BGM coverage now includes title, home, stage, ENDLESS, ZERO, normal boss, ZERO second boss, ZERO final boss, clear result, gameover result, and ZERO clear result IDs.
- SE coverage now includes UI select/decide/cancel/error/tab/reward, pickup, level-up, combat hit/defeat/damage, boss/ZERO warning, boss defeat, and the three public ZERO specials.
- Boss BGM now persists during boss phases instead of using only a short temporary cue.
- Result jingle selection is CLEAR / GAME OVER / ZERO CLEAR aware.
- Per-audio volume multipliers were added in `src/audio/audio_catalog.js` and applied by `AudioManager` to keep hit/pickup spam controlled.
- Mobile audio unlock behavior remains tied to first user interaction and does not add new touch/gesture handlers.

Remaining audio polish:
- Real-device loudness check on iOS Safari and Android Chrome speakers.
- Optional biome-unique BGM replacements if the current shared normal-stage track feels repetitive.
- Dedicated gameover jingle replacement from a non-placeholder high-quality source.
- Environment ambience and more granular boss-attack SE remain post-RC polish.

## MVP-160b SE Polish

Date: 2026-05-24

Implemented:
- Added dinosaur-specific normal attack SE for velociraptor, triceratops, and tyrannosaurus.
- Mapped tyrannosaurus `trexBiteShock` to a short bite-like impact cue instead of the generic slash feedback.
- Added runtime SE tail controls (`durationHintMs`, `fadeOutMs`, `interruptGroup`, `stopPrevious`) so long technique and ultimate sounds do not linger over the next action.
- Tightened hit/pickup/ultimate cooldown and max-instance settings to reduce combat audio stacking.

Remaining audio polish:
- Subjective loudness and bite/impact fit should be checked again on actual phone speakers/headphones.
- If the tyrannosaurus bite still feels too blade-like after real-device QA, record or source a more organic jaw/crunch cue with the same license-record workflow.
## MVP-160c Release Notes

- Home title display has been upgraded to use owned title/frame save data and a safe `称号なし` fallback.
- Daily missions are now save-backed, generated as three daily missions using a JST date key, and can grant small DNA / ResearchPt rewards.
- Daily mission scope intentionally excludes ZERO clear, EXPERT clear, stage-specific clear, dinosaur-specific, and evolution-specific requirements.
- Research screen mojibake around `研究Pt` was corrected in runtime UI.
- Remaining RC checks: real-device daily rollover around JST midnight, narrow-screen Home daily panel readability, and title-frame visual QA after more title assets are added.

## MVP-160d Release Notes

- Title selection UI is implemented as a Home modal. Full profile/title showcase is still a future expansion, but pre-release title/frame equip is functional.
- Daily rewards are ResearchPt-only. DNA is intentionally reserved for run/progression rewards.
- RC should still verify the modal on physical narrow mobile screens and confirm title/frame rows remain tappable with many owned rewards.

## MVP-160e Title UI Follow-up

- 称号選択UIを専用PNGアセット優先へ更新。
- 装備ボタン/行タップは所有済み称号とフレームだけを保存対象にする。
- RCで確認する項目: スマホ幅での称号選択、長い称号名、ZEROフレーム、リロード後の装備維持。

## MVP-161 Remaining RC Checks

- Recheck warning-guide readability on real phones with Options `�x���K�C�h` ON/OFF.
- Recheck `�^�b�`�⏕` on iPhone SE-size screens to confirm the smaller dead zone helps without causing unintended movement.
- Run a full no-debug ZERO route after the gimmick cadence reduction to confirm the pressure still feels like endgame.
- If pickup text feels busy during magnet collection, consider batching EXP pickup messages in a later polish pass.

## MVP-162 RC Remaining Notes

- Browser console smoke and direct save/reward checks passed, but full canvas-driven RC should be repeated manually or with a more reliable visual automation path.
- Public-before-release must still include real-device checks for iOS Safari / Android Chrome touch behavior, audio unlock, intro replay, and long ENDLESS/ZERO soaks.
- If pickup popups feel noisy in actual high-density play, batch or throttle EXP popup text in a later polish pass.
- If warning guides feel too dominant, lower guide alpha before release rather than reducing hitbox readability.

## MVP-163 Release Prep Remaining Notes

- GitHub repository creation is still pending because the local environment does not have `gh`, and the GitHub connector available here can inspect repositories but does not expose repository creation.
- Intended repository owner/name: `mitsu32-happy/EVOLUTION-ZERO`.
- Intended Pages URL: `https://mitsu32-happy.github.io/EVOLUTION-ZERO/`.
- After repository creation, push the prepared local repository and enable Pages from GitHub Actions.
- Real-device RC remains required for iOS Safari / Android Chrome, especially audio unlock, intro playback, touch controls, ENDLESS soak, and ZERO 3-route play.
- Post-release additions remain: ruins ZERO, fourth dinosaur, codex detail panel, PWA polish, and further audio polish.

## MVP-163 Publish Follow-up

- Public Pages is live at `https://mitsu32-happy.github.io/EVOLUTION-ZERO/`.
- Watch the next push to confirm GitHub does not keep starting the extra Jekyll Pages build. If it does, switch repository Settings > Pages > Source to GitHub Actions explicitly.
- Real-device iOS Safari / Android Chrome RC remains the main release-blocking manual task.

## MVP-A01: 公開後追加コンテンツ候補

- 実装済み: 4体目 `spinosaurus` の研究解放、通常進化3分岐、将来ZEROルート定義。
- 未実装維持: ruins ZERO本格実装、5体目/6体目恐竜、ruins ZERO報酬付与導線。
- 後続TODO: スピノサウルス専用水流SEの追加選定、実機での4体目UI確認。

## MVP-A02 Home Density Follow-up

- Implemented Home information tabs for Daily, Record, and Unlock.
- The Home screen keeps logo, resources, equipped title/frame, selected dinosaur hero/name, sortie button, and bottom navigation always visible.
- Daily, record, and unlock summaries are no longer displayed simultaneously.
- Daily remains the default tab because it is the daily-return action.
- iPhone Safari real-device QA is still recommended for browser chrome collapse, safe-area edges, and accidental tap overlap.
- PWA/fullscreen behavior and loading optimization remain future MVPs.

## MVP-A02b Home Common Panel Follow-up

- Replaced the A02 tab-specific lower panels with a generated common Home information panel and generated selected/inactive tab frames.
- The panel height now uses more of the space above the bottom navigation while keeping an 18px safety gap on the 390x844 reference layout.
- Daily, Record, and Unlock content should remain row/text-only swaps inside the same panel surface.
- Real-device QA should recheck iPhone Safari bottom browser chrome, tab tap targets, Daily claim flow, and bottom navigation mis-tap risk.

## MVP-A03 Loading Group Follow-up

- Boot now constructs only the title path plus the global loading overlay; Home, Research, Codex, Options, StageSelect, DinoSelect, AssetPreview, and PlayScene are lazy-created.
- AssetLoader now supports grouped loading, group dedupe, loaded group tracking, and failed group key tracking.
- START loads `home`; Codex first open loads `codex`; play start loads `battle`, selected `stage:<id>`, selected `dino:<id>`, and `zero` only in ZERO mode.
- Boot audio preload is reduced to UI feedback and title BGM. PWA/service worker/persistent cache remain future work.
- QA should still include public Pages cache behavior and real-device timing because Codex browser timing APIs were limited.

## MVP-A06 PWA Initial Setup

- Added installable PWA metadata for GitHub Pages with `/EVOLUTION-ZERO/` start URL and scope.
- Added iOS standalone meta tags and apple touch icon while keeping the existing safe-area and zoom prevention viewport.
- Added a minimal service worker that avoids strong HTML/JS/asset caching; only manifest and icon files use network-first cache.
- PWA registration runs only in production and is silent on failure so game boot, audio unlock, and touch controls are not blocked.
- Real-device RC remains required for iPhone Safari Add to Home Screen, Android Chrome install prompt, standalone safe-area spacing, audio unlock, and touch controls.
## MVP-A06b PWA Verification Follow-up

- Local dev and production preview confirmed `/EVOLUTION-ZERO/` manifest, service worker, icon, and apple touch icon endpoints return 200.
- Safe-area CSS now subtracts `env(safe-area-inset-*)` from the game root dimensions for standalone display.
- Service worker remains update-safe: no full-shell, JS, HTML, image, or audio precache.
- Real-device iPhone Safari Add to Home Screen and Android Chrome install prompt remain manual RC checks before treating PWA as fully validated.
## MVP-A06d PWA Update Notice Follow-up

- Added shared app version constants and connected title VERSION text to that definition.
- Added service worker update detection for waiting workers and safe-surface SKIP_WAITING application.
- Added forced apply only on title/home without a user-facing update prompt; active play and result keep the update pending without popup/reload.
- Added `debugPwaUpdate=1` for local auto-apply verification and `debugPwaVersion=1` for version path checks.
- Real-device PWA update flow still needs confirmation after a Pages deployment where `service-worker.js` actually changes.
## MVP-A06d Update Flow Adjustment

- Update apply is now forced automatically only on Title and Home.
- Title/Home auto-apply without visible update UI; Result and active Play keep pending updates until Title or Home is visible.
- `debugPwaUpdate=1` verifies the safe-surface auto-apply path.

## MVP-A06e PWA Viewport Follow-up

- Adjusted standalone/fullscreen layout to keep the top safe-area inset while capping the bottom gutter so the playable canvas can scale larger.
- Removed the standalone 430px/844px app cap so installed PWA launches can scale the 390x844 game design larger than Safari-style browser framing.
- Real-device iPhone PWA confirmation remains required because dynamic-island and status-bar geometry can only be fully judged on device.

## MVP-A06e PWA Viewport Second Pass

- Added a 1.05 top-centered visual scale only for standalone/fullscreen PWA mode to spend the remaining bottom margin and bring the installed-app view closer to the target screenshot.
- Normal Safari/browser layout is unchanged.
## MVP-A08 Result UI Follow-up

- Result is now staged into summary and reward pages to reduce narrow-screen information density.
- Upper duplicate BEST messaging and acquired adaptation skill display are removed from the A08 result route.
- Dedicated A08 result panels/buttons/headers were generated and connected through the manifest.
- Remaining manual RC: physical-device CLEAR / GAME OVER / ENDLESS / ZERO CLEAR pass, especially dense ZERO rewards on iPhone standalone.
## MVP-A12 Management UI Readability

- Research, Codex, and Options readability pass completed.
- Future candidate: generate a shared management-card asset set only if the existing panels cannot support longer post-release content.
- Combat balance, new dinosaurs, ruins ZERO, and PWA changes were intentionally left out of A12.

## MVP-A12b Management UI Asset Refresh

- Generated and connected shared management UI assets for Research, Codex, and Options.
- Research cards, Codex lineage cards/selector, and Options rows/chips now use A12b generated panels where readability was weakest.
- The shared asset set is intentionally small and reusable; future management screens should prefer these common panels before adding new one-off frames.
- Remaining RC: physical iPhone/PWA check for Japanese text rasterization and touch comfort on Research/Codex/Options.