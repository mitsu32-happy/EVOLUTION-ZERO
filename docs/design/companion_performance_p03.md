# MVP-P03 お供恐竜 performance audit

## S01-S03安定化との関係

お供恐竜は高密度戦闘に追加される常駐entityであり、今後の攻撃/補助effectが増えるとS01-S03で対策したホワイトアウト問題に影響する可能性がある。P02.1では`companionView`がstale cleanupに誤って削除される問題を修正済み。

## 現状

- `companionView`は`depthLayer`に追加され、active runtime viewとして保持される。
- お供本体は1体のみ表示される。
- 攻撃系お供は既存のenemy damage処理とpickup popupを使う。
- 回復/防御もpickup popupやburstを使う。
- お供専用projectile/effect poolは未実装。
- debugPerformanceにcompanion専用countはまだない。

## 負荷リスク

| 対象 | リスク | 対応方針 |
| --- | --- | --- |
| companion damage popup | 攻撃頻度が増えるとdamage textが増える | S01-S03のdamage text pool/間引きに接続 |
| companion effect | effectAssetKeyを本実装するとsmall effectが増える | companion effect poolまたは既存effect capに接続 |
| companion projectile | 将来projectile化すると弾数が増える | projectile capにcompanion sourceを含める |
| pickup補助 | 回収型がpickupを大量targeted化する | 1フレーム処理数を制限 |
| passive補正 | speed/EXPが二重適用されるとバランス破綻 | PlayScene再生成時のQAを追加 |
| stale cleanup | 新しいcompanion childがcleanupされる可能性 | active viewsに追加、または専用container管理 |

## debugPerformance追加候補

- `companionActive`: お供が表示中か。
- `companionId`: 現在のお供ID。
- `companionEffectCount`: お供由来effect数。
- `companionProjectileCount`: お供由来projectile数。
- `companionPopupCount`: お供由来popup数。
- `companionInvalidCleanupCount`: 不正お供表示のcleanup数。

## 本番前必須

1. effectAssetKeyを使う前にpoolまたはcap設計を決める。
2. 高密度ZERO終盤で、攻撃型/範囲型/雑魚処理型の表示負荷を確認。
3. 回復/防御/回収型も、popupやpickup target処理が増えすぎないか確認。
4. debugPerformanceにcompanion関連数値を追加。
5. お供本体はstale cleanupで消えないことを回帰テストに入れる。

## P03結論

現状の1体追従表示だけなら負荷は小さい。ただし、P05以降にeffect/projectileを本実装する際は、S01-S03の負荷制御に接続しないと高密度戦闘で再発リスクがある。
