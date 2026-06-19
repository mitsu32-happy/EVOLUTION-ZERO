# ND09h Codex Browser New Dino QA Debug Mode

## Purpose

ND09g後の新6体と進化先を、Codex内ブラウザで短時間に目視確認できるよう、既存の統合QAデバッグモードを確認した。

この作業では新しい本番機能は追加していない。既存の `debugNewDinoQa=1` がND09h要件を満たすことを確認し、確認用URLと手順を記録する。

## Unified QA URL

Codex内ブラウザで開く基本URL:

```text
http://localhost:5180/EVOLUTION-ZERO/?debugIntroSeen=1&debugNewDinoQa=1&qaND09hUnified=1
```

`debugNewDinoQa=1` は以下をまとめて有効化するQA専用モードとして扱う。

- 全プレイヤー恐竜のQAセッション解放
- 新6体のdino select確認
- 適応スキル1つ取得後の通常進化候補高速到達
- PlayScene中のEXP獲得100倍化
- 図鑑の新6体/進化先/ZERO進化確認
- ZERO進化の図鑑確認補助

このモードはURLパラメータによる一時的な判定であり、通常セーブへ保存しない。

## Available Debug Parameters

| Parameter | Purpose | Save impact |
|---|---|---|
| `debugNewDinoQa=1` | ND09h/ND10向け統合QAモード。全恐竜QA解放、fast evolution、codex unlock、ZERO codex unlock相当。 | なし |
| `debugUnlockAllDinos=1` | dino select / home / codex で全恐竜をQA解放扱いにする個別フラグ。 | なし |
| `debugFastEvolution=1` | 適応スキル取得時に通常進化3候補の条件へ即到達させる個別フラグ。 | なし |
| `debugUnlockCodex=1` | 図鑑で新6体と進化先を確認可能にする個別フラグ。 | なし |
| `debugUnlockZeroEvolutions=1` | 図鑑上でZERO進化を確認可能にする個別フラグ。 | なし |
| `debugForceEvolution={branchId}` | PlaySceneで特定進化先を直接適用する。例: `ankylosaurus_zero`。 | なし |

## EXP 100x QA Boost

`debugNewDinoQa=1` の時のみ、`GameState.addExp()` で受け取ったEXPを100倍にして加算する。

目的:

- 通常研究・長時間レベル上げなしで進化選択まで到達する
- 新6体base / speed / hunting / attack の目視QAを短時間で回す
- ND10での進化先確認作業を軽くする

制限:

- `debugNewDinoQa=1` 以外では倍率をかけない
- セーブデータに倍率フラグは保存しない
- ZERO進化の通常解放条件は変更しない

## Direct PlayScene URLs

base確認:

```text
http://localhost:5180/EVOLUTION-ZERO/?debugIntroSeen=1&debugNewDinoQa=1&debugAutoPlay=1&debugInvincible=1&debugDino=ornithomimus&debugStage=jungle&debugDifficulty=normal
```

ZERO進化直接確認:

```text
http://localhost:5180/EVOLUTION-ZERO/?debugIntroSeen=1&debugNewDinoQa=1&debugAutoPlay=1&debugInvincible=1&debugDino=ornithomimus&debugForceEvolution=ornithomimus_zero&debugStage=jungle&debugDifficulty=normal
```

通常進化先直接確認:

```text
http://localhost:5180/EVOLUTION-ZERO/?debugIntroSeen=1&debugNewDinoQa=1&debugAutoPlay=1&debugInvincible=1&debugDino=parasaurolophus&debugForceEvolution=parasaurolophus_speed&debugStage=jungle&debugDifficulty=normal
```

## Fast Evolution Verification

`debugNewDinoQa=1` は `debugFastEvolution=1` 相当として `GameState.acquireSkill()` 内で作用する。

検証結果:

- `playerLevel = 5`
- tagged skill `afterimage_claw` を1つ取得
- `adaptationProgress` が `speed/hunting/attack = 3` へ補正
- `canNormalEvolve = true`
- normal evolution candidates: `speed`, `hunting`, `attack`

これにより、通常の研究・長時間レベル上げなしで進化候補UIを確認できる。

## Codex Browser QA Result

Codex内ブラウザで以下を確認した。

- unified QA URL opened successfully
- title: `EVOLUTION ZERO`
- runtime console warn/error: 0
- 新6体base PlayScene起動: 6/6 warn/error 0
- 新6体ZERO direct route起動: 6/6 warn/error 0

確認したbase / ZERO route:

- `ankylosaurus`
- `parasaurolophus`
- `stegosaurus`
- `pteranodon`
- `compsognathus`
- `ornithomimus`

## User QA Steps

1. `debugNewDinoQa=1` の基本URLを開く。
2. dino selectで既存4体 + 新6体がlockedではなく選択できることを確認する。
3. 任意の新恐竜でPlaySceneを開始する。
4. 適応スキルを1つ取得し、通常進化候補 `speed/hunting/attack` が短時間で確認できることを見る。
5. ZERO進化は `debugForceEvolution={dinoId}_zero` で直接確認する。

## Notes

- ZERO進化は通常導線では無条件解放しない。
- Companion synergyの `enabled` 状態は変更しない。
- Version / update news は変更しない。
