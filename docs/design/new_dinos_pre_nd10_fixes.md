# ND10前 新恐竜追加確認・修正

## 目的

ND10最終QA前に、ユーザー目視で指摘された以下4点を確認・修正した。

- Sprint Impact攻撃モーションの混入に見える表示
- 未解放新恐竜の選択カード表示
- 新6体の研究解放カード接続
- 進化演出時の進化先アイコン誤表示

## Sprint Impact混入

対象:

- `ornithomimusSprintKick`
- `ornithomimus_attack` branch attack effect
- `ornithomimus_attack` ultimate effect
- `ornithomimus_attack_sheet.png` action row

確認結果:

- 通常攻撃effect、branch attack effect、ultimate effectに小さな孤立alpha片があった。
- `ornithomimus_attack_sheet.png` のaction行に、恐竜本体から分離したインパクト弧があり、実機では他セル混入のように見えやすかった。

修正:

- `tools/nd10_pre_fixes.py` でSprint Impact関連effectの孤立小片を除去。
- `ornithomimus_attack_sheet.png` action rowから分離弧を除去し、sprite sheetは恐竜本体の攻撃姿勢へ寄せた。
- インパクト表現は専用effect asset側で表示する方針とした。

成果物:

- `docs/assets/nd10_pre_sprint_impact_contact.png`

## 未解放シルエット表示

原因:

- 新6体は `previewWhenLocked: true` により、ロック中でもhero/portraitを表示できる状態だった。
- スピノサウルスと同じ「未解放シルエット」表示になっていなかった。

修正:

- `DinoSelectScreen.getLockedDinoTexture()` からロック中hero previewの優先を外した。
- ロック中の新6体は既存のfallback silhouette描画へ統一。
- 解放後は通常どおりhero/portraitを表示する。

成果物:

- `docs/assets/nd10_pre_dino_select_locked_contact.png`

## 研究解放カード

確認した研究ID:

- `ankylosaurus_unlock`
- `parasaurolophus_unlock`
- `stegosaurus_unlock`
- `pteranodon_unlock`
- `compsognathus_unlock`
- `ornithomimus_unlock`

確認結果:

- `src/data/research.js` に6/6カード定義あり。
- `src/save/save_manager.js` の `RESEARCH_DINO_UNLOCKS` に6/6マッピングあり。
- 購入後は `unlockedDinos` に補完され、既存セーブにも研究Lvから復元される。

成果物:

- `docs/assets/nd10_pre_research_unlock_contact.png`

## 進化演出アイコン誤表示

原因:

- 分岐選択UIは `portraitPath` を付与していたが、選択後の `GameState.selectEvolution()` が `selectedEvolution` に `heroPath` / `portraitPath` / `specialIconPath` を保持していなかった。
- そのため `EvolutionSequence` がタグ汎用portraitへfallbackし、他恐竜アイコンに見えるケースがあった。

修正:

- `GameState.selectEvolution()` の `selectedEvolution` に、branchの `heroPath` / `portraitPath` / `specialIconPath` を保持。
- debug forced evolution側の `selectedEvolution` にも同じpathを保持。
- 進化演出は選択した進化先の専用portraitを優先する。

成果物:

- `docs/assets/nd10_pre_evolution_cinematic_icon_contact.png`

## QA成果物

- `docs/assets/nd10_pre_sprint_impact_contact.png`
- `docs/assets/nd10_pre_dino_select_locked_contact.png`
- `docs/assets/nd10_pre_research_unlock_contact.png`
- `docs/assets/nd10_pre_evolution_cinematic_icon_contact.png`
- `docs/assets/nd10_pre_asset_report.json`

## 残課題

- ND10では実機で6体 x 3通常進化の進化演出アイコンを最終目視確認する。
- ZERO進化は通常導線では解放しないため、debugForceEvolutionで代表確認する。
