# Z04-08 4ステージ目 ZERO main 統合・Push

## merge 結果

- 作業ブランチ: `feature/stage4-zero-v1`
- 統合先: `main`
- 統合方法: `git merge --no-ff feature/stage4-zero-v1`
- merge commit: `b15d76af867b335d4a01e02be7cf460507d099af`
- conflict: なし

## Version

- previous: `0.11.1`
- current: `0.12.0`

## Build

- previous: `adaptation-effect-performance-v1`
- current: `stage4-zero-v1`

## お知らせ内容

- title: `第4ステージZEROを追加しました`
- id: `stage4-zero-v1-2026-06-21`
- date: `2026/06/21`
- category: `大型アップデート`
- summary:
  - 第4ステージ「遺跡」に ZERO ルートを追加。
  - 新たな ZERO ボス、専用背景、警告演出を追加。
  - 遺跡 ZERO クリアで `spinosaurus_zero` を解放。
  - jungle / volcano / swamp / ruins の背景品質を改善。

## build 結果

- `node --check`: success
  - `src/data/app_version.js`
  - `src/data/update_news.js`
  - `src/data/asset_manifest.js`
  - `src/diagnostics/crash_diagnostics.js`
  - `src/save/save_manager.js`
  - `src/scenes/play_scene.js`
  - `src/systems/spawn_system.js`
  - `src/ui/stage_select_screen.js`
  - `src/ui/title_screen.js`
  - `src/main.js`
- `git diff --check`: success
- `npm.cmd run build`: success
- Vite chunk size warning: 既存警告として許容
- build failure: なし

## runtime console

- checked URL: `http://127.0.0.1:5181/EVOLUTION-ZERO/`
- checked by: Headless Edge DevTools Protocol
- checked cases:
  - title
  - jungle NORMAL
  - jungle ZERO
  - volcano NORMAL
  - volcano ZERO
  - swamp NORMAL
  - swamp ZERO
  - ruins NORMAL
  - ruins ZERO
- result:
  - canvas visible: all cases
  - crash screen: none
  - Runtime console warn/error: `0`
  - browser Log warn/error: `0`

## push 結果

- release push: success
- command: `git push origin main`
- pushed range: `4988c0f..a1db77d`
- release commit: `a1db77d719f752801e89a1e0a6d146d68e21f622`

## origin/main 反映確認

- checked after release push
- `main`: `a1db77d719f752801e89a1e0a6d146d68e21f622`
- `origin/main`: `a1db77d719f752801e89a1e0a6d146d68e21f622`
- result: matched

## 残課題

- Z04-08 時点で Stage4 ZERO の main 統合は完了予定。
- 長時間プレイ時の背景視認性と高難度 ZERO 戦の追加バランス観察は継続する。

## 次アップデート予定

1. 新規ステージ追加
2. Compsognathus miniPack
3. アチーブメント機能
4. さらなる target scan / collision 最適化

## 禁止事項確認

- 研究Pt復活なし
- デイリー復活なし
- 新6体 ZERO 進化の無条件解放なし
- 無関係な新機能追加なし
