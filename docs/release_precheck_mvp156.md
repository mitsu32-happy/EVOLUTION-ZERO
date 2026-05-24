# MVP-156 Release Precheck

Date: 2026-05-24

## Scope

MVP-156 is a pre-release stability pass. The goal is to verify existing public-scope systems, document remaining risks, and avoid new feature expansion.

Covered areas:
- Normal stages: jungle / volcano / swamp / ruins
- Difficulties: NORMAL / HARD / EXPERT smoke coverage
- ENDLESS: jungle / volcano smoke coverage
- ZERO public routes: jungle / volcano / swamp
- Ruins ZERO: locked / post-release scope
- UI: codex / home / HUD / result / stage select
- Save and rewards: stageProgress / zero routes / titles / title frames / best records

## Browser QA Summary

Runtime browser smoke QA was run through the in-app browser against the following URL groups:
- `?debugStage=jungle&debugDifficulty=normal`
- `?debugStage=volcano&debugDifficulty=hard`
- `?debugStage=swamp&debugDifficulty=expert`
- `?debugStage=ruins&debugDifficulty=normal`
- `?debugStage=jungle&debugMode=endless&debugEndlessFast=1`
- `?debugStage=volcano&debugMode=endless&debugEndlessFast=1`
- `?debugStage=jungle&debugMode=zero&debugZeroFast=1&debugUnlockDifficulties=1`
- `?debugStage=volcano&debugMode=zero&debugZeroFast=1&debugUnlockDifficulties=1`
- `?debugStage=swamp&debugMode=zero&debugZeroFast=1&debugUnlockDifficulties=1`
- `?debugStage=ruins&debugMode=zero&debugUnlockDifficulties=1`
- `?debugDino=velociraptor&debugEvolution=zero&debugSpecialReady=1&debugUnlockZeroRoute=velociraptor_zero`
- `?debugDino=triceratops&debugEvolution=zero&debugSpecialReady=1&debugUnlockZeroRoute=triceratops_zero`
- `?debugDino=tyrannosaurus&debugEvolution=zero&debugSpecialReady=1&debugUnlockZeroRoute=tyrannosaurus_zero`

Result:
- All checked routes loaded without app runtime console errors or warnings.
- Normal stage smoke checks reached playable flow without blocking startup failures.
- ENDLESS smoke checks loaded the mode and did not emit runtime console errors.
- ZERO public routes loaded in fast QA mode without runtime console errors.
- Ruins ZERO remains a locked / non-reward public route.
- ZERO evolution debug routes loaded without app runtime console errors.

Note: Codex runtime telemetry emitted an external Statsig network message during automation. It was not an application tab console error and did not appear in the in-app browser `dev.logs` result.

## Save QA

Code-level reward checks confirmed:
- Jungle ZERO grants `velociraptor_zero`, `jungle_zero_clear`, and `jungle_zero_frame`.
- Volcano ZERO grants `triceratops_zero`, `volcano_zero_clear`, and `volcano_zero_frame`.
- Swamp ZERO grants `tyrannosaurus_zero`, `swamp_zero_clear`, and `swamp_zero_frame`.
- Ruins ZERO grants no ZERO route, title, or frame in the public route.
- Duplicate ZERO clears do not re-grant the route, title, or frame.
- ZERO upper evolutions require route unlock, matching lineage, Lv8+, and speed / hunting / attack Lv3+.
- After ZERO upper evolution, `hasZeroEvolved` prevents repeat ZERO evolution.

## Performance QA

Current safeguards verified by implementation review:
- ENDLESS soft enemy cap: `76`.
- ZERO soft enemy cap: `68`.
- Spawn scaling uses mode-aware caps.
- PlayScene includes projectile and effect cleanup paths.
- ZERO / ENDLESS browser smoke did not show runtime console errors.

Remaining performance risk:
- This pass was smoke-oriented. It does not replace a long soak test on mobile Safari or low-end Android.
- Final release should still include at least one 10-15 minute ENDLESS / ZERO soak on target devices.

## UI QA Summary

Codex / home / result / stage select focus points:
- ZERO route mapping remains consistent: jungle -> Abyss Raptor route, volcano -> Ignicera route, swamp -> Omega Rex route.
- Ruins ZERO remains post-release scope.
- ZERO evolution debug routes do not block HUD/special startup.
- Result reward duplication is guarded in save logic.

Residual UI risks:
- Long Japanese strings should still receive final device QA after font and mobile polish.
- Result panels have had prior overflow fixes, but dense reward combinations should be rechecked on narrow screens.
- Codex detail panel is intentionally deferred.

## Build

Final build for MVP-156 must be run after documentation updates.

## MVP-157 Mobile Polish QA

Date: 2026-05-24

Mobile-oriented safeguards added:
- Viewport now includes `maximum-scale=1.0` and `user-scalable=no` for pre-release mobile play.
- `html`, `body`, `#app`, and `canvas` explicitly use `touch-action: none`, `user-select: none`, touch callout suppression, hidden overflow, and overscroll suppression.
- Startup installs guarded handlers for iOS-style `gesturestart` / `gesturechange` / `gestureend`, `dblclick`, `contextmenu`, multi-touch `touchstart`, and `touchmove`.

Browser QA:
- In-app browser metrics confirmed the active viewport meta, `touch-action: none`, `overflow: hidden`, and `visualViewport.scale = 1`.
- Normal play smoke QA included drag movement and ultimate-button tap checks.
- ENDLESS volcano and ZERO swamp were run as shortened browser soak checks with no app runtime console error/warn.
- Ruins ZERO lock route was rechecked with no app runtime console error/warn.

Remaining device-specific risk:
- Real iOS Safari and Android Chrome should still receive final hands-on QA because browser automation cannot fully reproduce address-bar collapse, OS gesture edges, and real touch latency.
- PWA fullscreen safe-area behavior remains a final-polish verification item, not a blocker introduced by MVP-157.

## MVP-157b Mobile RC Check

Date: 2026-05-24

Purpose:
- Recheck that the MVP-157 mobile zoom/touch guards do not break play feel before audio implementation.
- Treat this as an RC-style browser-based mobile-equivalent pass because physical iPhone / Android devices are not directly available from the Codex environment.

Confirmed in browser:
- Viewport meta remains `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover`.
- `visualViewport.scale` stayed at `1`.
- `body` and `canvas` both resolved to `touch-action: none`.
- Fixed app viewport measured approximately 401 x 844 in the in-app browser, with no page scroll path exposed.
- Normal play route accepted drag movement and special-button tap after the mobile guards.
- ENDLESS jungle was kept running for a 90-second browser soak with no app runtime console error/warn.
- ZERO volcano was kept running for a 90-second browser soak with no app runtime console error/warn.

Not physically verified:
- iPhone Safari double-tap / pinch behavior on real hardware.
- Android Chrome back gesture and OS edge gesture behavior.
- PWA standalone fullscreen safe-area behavior.
- True 10-15 minute physical-device ENDLESS/ZERO soak.

Audio-before-release note:
- MVP-158 audio work should keep the current first-pointer audio unlock behavior and avoid adding handlers that re-enable page scroll, browser zoom, or passive touchmove conflicts.

## MVP-158 Minimal Audio Check

Date: 2026-05-24

Implemented:
- Local CC0 audio files are stored under `public/assets/audio/`.
- BGM keys cover title/home, normal/ENDLESS battle, ZERO battle, temporary boss cue, and result jingle.
- SE keys cover UI select/confirm/cancel, attack, enemy hit, enemy defeat, player damage, pickup/level-up, evolution warning/burst, boss/ZERO warning, boss defeat, and existing ultimate families.
- Source and license evidence is recorded in `docs/assets/audio_credits_mvp158.md` and `docs/assets/audio_source_list_mvp158.json`.

Browser QA:
- Title -> home -> stage select -> dino select -> play route accepted first tap/pointer audio unlock with no app runtime console error/warn.
- ZERO swamp play route started with audio assets present and no app runtime console error/warn.
- Expected pre-interaction autoplay rejection is treated as browser fallback and does not emit release-blocking warnings.

Remaining audio risks:
- Real iOS Safari and Android Chrome should still receive an audible-device pass because automation can confirm startup/log health but cannot judge speaker loudness or subjective mix.
- MVP-160 should implement the full audio pass: per-stage BGM, fuller clear/game-over cues, more granular combat SE, route-specific ZERO boss music, ambience, and final loudness balancing.
## MVP-159 Final Polish Check

- タイトルロゴ/画面タイトルタップでタイトルへ戻る導線を、ホーム、ステージ選択、恐竜選択、図鑑、研究、設定、アセット確認、リザルトに追加する。
- プレイ中HUDは誤操作防止のためタイトルショートカット対象外。
- ホーム称号/称号フレームは、未装備・通常称号・ZERO称号の表示をそれぞれ確認する。
- フォントはローカル同梱の Zen Kaku Gothic New / Oxanium へ統一する。
- MVP-157/158の誤拡大防止、touch-action、audio unlock、BGM/SE二重再生防止を維持する。

## MVP-160 Full Audio Check

Date: 2026-05-24

Implemented:
- DOVA-SYNDROME BGM/jingles and 効果音ラボ SE were downloaded into `public/assets/audio/` after official license / terms checks.
- Audio source and license evidence is recorded in `docs/assets/audio_credits_mvp160.md` and `docs/assets/audio_source_list_mvp160.json`.
- Stage, ENDLESS, ZERO, boss, ZERO second boss, ZERO final boss, and result jingle IDs are connected through `AudioManager` / `ScreenManager` / `PlayScene`.
- The remaining mojibake text detected in `src/scenes/play_scene.js` was corrected to `進化反応を検出`.

QA notes:
- JavaScript syntax check passed after audio integration.
- Full build must be used as the release gate for this MVP.
- Physical-device subjective mix / loudness still needs a real speaker check; browser automation cannot judge final audio balance.
## MVP-160d RC Addendum

- Home title selection UI was added before RC.
- Daily mission rewards are now ResearchPt-only. DNA must not increase from daily claims.
- RC checks should include:
  - Home title modal open/close.
  - Title equip and frame equip.
  - Reload persistence for `equippedTitleId` and `equippedTitleFrameId`.
  - Daily claim ResearchPt increase and DNA unchanged.
  - Audio unlock / BGM / SE smoke after modal interactions.

## MVP-162 RC Check

Date: 2026-05-24

Scope:
- RC smoke check after MVP-161 playfeel tuning.
- Checked build, JS syntax, browser boot console, save/reward logic, daily reward logic, options persistence, and ZERO reward mapping.

Results:
- `npm.cmd run build` succeeded. Existing Vite chunk-size warning remains non-blocking.
- `node --check` passed for the main touched runtime files: PlayScene, SaveManager, OptionsScreen, HomeScreen, TitleSelectUi, UltimateSystem.
- Browser boot smoke on debug URLs produced no app runtime console error/warn.
- Options persistence confirmed for warning guide OFF, touch assist ON, and damage-number/pickup-popup OFF.
- Daily missions generate three entries, claims grant ResearchPt, and DNA is not granted by daily rewards.
- ZERO route reward mapping confirmed:
  - jungle -> `velociraptor_zero`, `jungle_zero_clear`, `jungle_zero_frame`
  - volcano -> `triceratops_zero`, `volcano_zero_clear`, `volcano_zero_frame`
  - swamp -> `tyrannosaurus_zero`, `swamp_zero_clear`, `swamp_zero_frame`
  - ruins -> no public ZERO route/title/frame reward
- Title/frame equip save and reload persistence were checked with owned title/frame data.

Limitations:
- Full canvas-click route automation was unreliable in the in-app browser during this pass, so full manual-style CLEAR/ENDLESS/ZERO completion was not automated here.
- Real-device mobile RC remains required for final judgement of touch feel, warning-guide readability, audio loudness, and long-run performance.

Public-prep remaining items:
- Full manual no-debug runs for normal 4 stages, ENDLESS, and ZERO 3 routes.
- Real phone check for `�x���K�C�h` ON/OFF and `�^�b�`�⏕` ON/OFF.
- Confirm pickup popup density during magnet / high-EXP moments.
- Confirm boss hazard recovery still leaves ZERO final bosses sufficiently tense.

## MVP-163 Release Prep

Date: 2026-05-24

Scope:
- Public release preparation for GitHub Pages.
- Local build, publish-safety checks, repository setup preparation, and Pages workflow preparation.

Results:
- `npm.cmd run build` succeeded locally before GitHub preparation.
- Vite `base` is already `/EVOLUTION-ZERO/`, which matches the intended GitHub Pages path.
- Added a GitHub Pages Actions workflow that builds with `npm ci` and deploys `dist`.
- Added `public/.nojekyll` so Pages does not process the deployed artifact with Jekyll.
- GitHub account available through the installed GitHub connector: `mitsu32-happy`.
- Repository check for `mitsu32-happy/EVOLUTION-ZERO` returned not found, so a new repository still needs to be created before the first push.

Security / publish-safety:
- `tmp/` contains browser profile/cache files and must not be published.
- `.gitignore` now excludes `tmp/`, `node_modules/`, `dist/`, and log/local files.
- A secret-pattern scan excluding `tmp`, `node_modules`, `dist`, binary assets, and package lock found no obvious API keys or tokens.
- No single publish-target file over 50 MB was found.

Manual RC status:
- Full iOS Safari / Android Chrome / PC Edge manual completion was not possible from this environment.
- GitHub Pages public URL cannot be verified until the GitHub repository exists and Pages deployment completes.

Pending before public announcement:
- Create `mitsu32-happy/EVOLUTION-ZERO` as a public GitHub repository.
- Push the local initial commit to `main`.
- Enable GitHub Pages using GitHub Actions as the source.
- Confirm `https://mitsu32-happy.github.io/EVOLUTION-ZERO/` loads without asset 404s or runtime console error/warn.
- Perform real-device checks on iOS Safari and Android Chrome.

MVP-163 local Git status:
- Local git repository initialized on `main`.
- Initial commit created: `fce60de` (`Initial public release prep`).
- Remote prepared: `https://github.com/mitsu32-happy/EVOLUTION-ZERO.git`.
- Push is blocked until the GitHub repository is created on the web UI.

MVP-163 local browser smoke:
- Local debug URL `?debugIntroSeen=1&v=mvp163-local-smoke` loaded with title `EVOLUTION ZERO`.
- Runtime console warn/error: 0 app logs.
