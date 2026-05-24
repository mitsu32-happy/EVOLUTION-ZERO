# Codex Operation Rules v0.1

## Core Principle
Codexは「全部作るAI」ではなく、「仕様通り実装するAI」として使う。

## Workflow
1. ChatGPTで仕様作成
2. ChatGPTで参照画像作成
3. referencesへ保存
4. Codexに小タスクで実装依頼
5. 実装後スクショ確認
6. ChatGPTでレビュー
7. 修正指示をCodexへ渡す

## Task Rules
### Small Tasks Only
一度に大きく作らせない。

### Specify Files
対象ファイル・対象フォルダを明記する。

### Ban Unrelated Changes
無関係ファイルの変更は禁止。

### Completion Criteria
完成条件を明記する。

### Require Report
変更ファイル一覧、差分、確認方法を出させる。

## Must Use References
UIや演出実装では、references内の画像を必ず参照させる。

## Important Prohibitions
- 仕様の勝手な変更
- セーブ構造の無断変更
- assets削除
- 無関係リファクタ
- UI世界観の独断変更
- 既存機能の破壊

## Codex Output Required
- 変更ファイル一覧
- 変更理由
- 動作確認手順
- 残課題
