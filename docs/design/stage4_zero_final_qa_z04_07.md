# Z04-07 Stage4 ZERO 最終 QA

## 対象ブランチ

- `feature/stage4-zero-v1`

## 対象範囲

- Z04-01: 4ステージ目 ZERO 設計
- Z04-02: ruins ZERO ルート追加
- Z04-03: ruins ZERO 背景・演出アセット
- Z04-04: ruins ZERO ボス実装
- Z04-05: ZERO 報酬接続
- Z04-06a: 停止画面修正・ruins 背景修正
- Z04-06b: jungle / volcano / swamp 背景再生成

## 確認した禁止事項

- main merge なし
- push なし
- Version 更新なし
- お知らせ更新なし

確認時点:

- `APP_VERSION`: `0.11.1`
- `APP_BUILD`: `adaptation-effect-performance-v1`

## 静的チェック

対象 JS:

- `src/data/asset_manifest.js`
- `src/diagnostics/crash_diagnostics.js`
- `src/save/save_manager.js`
- `src/scenes/play_scene.js`
- `src/systems/spawn_system.js`
- `src/ui/stage_select_screen.js`

結果:

- `node --check`: all pass

## Build

実行:

- `npm.cmd run build`

結果:

- success
- Vite の既存 chunk size warning あり
- build failure なし

## Runtime QA

起動:

- `npm.cmd run dev -- --host 127.0.0.1 --port 5180`
- port `5180` 使用中のため Vite が `http://127.0.0.1:5181/EVOLUTION-ZERO/` へ自動フォールバック

検証方法:

- Headless Edge DevTools Protocol
- QA 保存設定として `audioSettings.muted = true` を注入
- `debugIntroSeen=1`
- `debugAutoPlay=1`
- `debugInvincible=1`
- `debugDino=velociraptor`

確認パターン:

- jungle NORMAL
- jungle HARD
- jungle EXPERT
- jungle ZERO
- volcano NORMAL
- volcano HARD
- volcano EXPERT
- volcano ZERO
- swamp NORMAL
- swamp HARD
- swamp EXPERT
- swamp ZERO

結果:

- 全 12 パターンで `canvasCount = 1`
- 全 12 パターンでクラッシュ画面なし
- 全 12 パターンで Runtime console warn/error `0`
- 全 12 パターンで browser Log warn/error `0`

## 背景 QA

生成背景:

- `public/assets/maps/backgrounds/jungle_battlefield_tile.png`
- `public/assets/maps/backgrounds/volcanic_battlefield_tile.png`
- `public/assets/maps/backgrounds/swamp_battlefield_tile.png`

確認:

- 3ファイルとも `1024x1024`
- 2x2 tiled preview で目立つ継ぎ目なし
- warning / 敵 / 弾 / UI を阻害しにくい暗さと彩度に収まっている
- NORMAL / HARD / EXPERT / ZERO は同一ステージ内で共通背景
- ZERO 感は既存 overlay / warning / boss effect 側で表現

関連成果物:

- `docs/assets/z04_06b_stage_background_contact.png`
- `docs/assets/z04_06b_all_stage_difficulties_contact.png`
- `docs/assets/z04_06b_background_asset_report.json`
- `docs/assets/z04_06b_browser_qa_results.json`

## main 統合前メモ

- `feature/stage4-zero-v1` は main `4988c0f6d1c4a095a54f31cd87ecb16357fe06b2` から Stage4 ZERO 一式の差分を持つ。
- main 統合前にユーザー確認後、Version 更新とお知らせ更新を別途実施する。
- 現時点では main merge / push は未実施。
