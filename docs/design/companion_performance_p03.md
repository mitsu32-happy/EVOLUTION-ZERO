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

## MVP-P05 パフォーマンス確認方針

P05では、お供行動の実効果追加に伴い、以下の負荷制御を維持・追加しました。

- お供effectはP04の `MAX_COMPANION_EFFECTS = 24` とSprite poolを継続使用します。
- 高負荷時 (`performanceLoadSheddingLevel >= 2`) はお供effectを新規表示しません。
- 回収補助は1フレームあたりのpickup処理数を通常48件、高負荷時24件までに制限します。
- EXP補助はEXP pickupのみを対象にし、全pickupを常時処理しないようにしています。
- debugCompanion表示に攻撃/補助cooldown、lastAction、lastTarget、active effect数を追加しました。
- debugPerformanceでは既存の `companionEffects` / `companionEffectPoolFree` で増加傾向を確認します。

P06以降の課題:

- 専用projectileを導入する場合はS01-S03のprojectile上限管理へ接続する。
- お供攻撃のdamage popup間引き条件を、高密度戦闘でさらに調整する。

## MVP-P07 performance confirmation

P07では `debugPerformance=1` を使い、ZEROお供あり、ENDLESSお供なしの短時間smokeを実施しました。

確認結果:
- runtime console error/warn 0件。
- companion effectはP04/P05の `MAX_COMPANION_EFFECTS` とpool管理を維持。
- `performanceLoadSheddingLevel >= 2` の場合、companion effectの新規表示を抑制する既存方針を維持。
- `companionView` はactive runtime viewとしてstale cleanupから保護される。

main統合前の推奨:
- ZERO/ENDLESSで3-5分以上のソーク確認。
- 攻撃型、回復型、回収型、EXP型をそれぞれ1回ずつ高密度戦闘で確認。
- debugPerformanceの `companionEffects` / `companionEffectPoolFree` が増え続けないことを再確認。

## MVP-P07b performance release-quality note

P07bではZERO/ENDLESSの短時間確認でruntime error/warnやwhiteoutは確認されませんでした。

ただし、3-5分の完全な高密度ソークは未完了です。
- ZEROは自動操作で早期Game Overしました。
- ENDLESSはレベルアップ選択で停止しました。

main統合前には、レベルアップ自動選択または手動操作で3-5分以上のZERO/ENDLESS確認が必要です。
## MVP-P04b performance note

P04b adds runtime animation without adding new spawned object classes.

- `companionTrail` and `companionActionAura` are persistent `Graphics` children under `companionView`.
- They are redrawn in place and are not pushed into spawn arrays.
- Existing companion effect sprites still use `companionEffects` and `companionEffectPool`.
- `MAX_COMPANION_EFFECTS` remains unchanged.
- High-load suppression through `performanceLoadSheddingLevel >= 2` remains unchanged.
- No companion projectile system was added.

Follow-up performance QA:

- Confirm `companionEffects` does not grow during ZERO/ENDLESS.
- Confirm trail/aura redraw does not produce container child growth.
- Confirm all 10 companion animation profiles remain visible under load without causing whiteout/freeze.

## MVP-P04c sheet performance note

P04c adds sprite/effect sheets, but does not add new runtime entity lists.

- Companion sprite frames are Pixi sub-textures cut from the loaded P04c sheet.
- Companion effect frames are Pixi sub-textures cut from the loaded P04c effect sheet.
- Effect animation still lives inside the existing short-lived `companionEffects` lifecycle.
- Existing `MAX_COMPANION_EFFECTS` and high-load suppression remain unchanged.
- Release QA should confirm repeated action effects do not cause `companionEffects` or container children to grow.
