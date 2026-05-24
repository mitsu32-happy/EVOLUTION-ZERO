# Save Data Spec v0.1

## Core Philosophy
セーブはゲームデータではなく、プレイヤーの進化研究記録。

## Do Not Save
1プレイ中の状態は基本セーブしない。
- 現在HP
- 現在敵
- 現在EXP
- 現在位置

## Save
- 永続DNA
- 解放済スキル
- 解放済恐竜
- 発見済進化
- 図鑑情報
- 永続強化
- 実績
- プレイ統計

## Recommended Storage
- LocalStorage
- JSONエクスポート / インポート

## Save Version
必ず保存。

```json
{
  "save_version": "0.1.0"
}
```

## Example
```json
{
  "save_version": "0.1.0",
  "dna": 1200,
  "skills_unlocked": ["bleed_slash", "thunder_dash"],
  "dinosaurs_unlocked": ["raptor", "trex"],
  "evolution_discovered": {
    "thunder_raptor": true,
    "inferno_trex": false
  },
  "upgrades": {
    "dna_gain": 2,
    "reroll": 1,
    "exp_gain": 3
  },
  "stats": {
    "total_kills": 0,
    "total_runs": 0,
    "max_survival_time": 0
  }
}
```

## Autosave Timing
- リザルト
- 研究完了
- 解放時
- オプション変更時

## Important
長期アップデート前提のため、古いセーブ互換を意識する。
