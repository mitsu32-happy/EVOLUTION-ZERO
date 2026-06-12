# MVP-P03 お供恐竜 save/migration audit

## 現在のsave構造

`companion` には以下を保存する。

- `ownedIds`: 所持済みお供ID。
- `selectedId`: セット中のお供ID。
- `levels`: お供IDごとのLv。
- `eggPending`: 未孵化卵を所持しているか。
- `eggIncubating`: 孵化中か。
- `hatchStartedAt`: 孵化開始時刻。
- `hatchCompleteAt`: 孵化完了予定時刻。
- `lastHatchedId`: 直近で孵化したID。
- `tutorialFlags`: お供関連チュートリアル表示状態。

## 互換性の現状

- 既存セーブに`companion`がない場合はデフォルト値で補完される。
- 不正な`ownedIds`は定義済みIDだけに絞られる。
- `selectedId`は所持済みIDでない場合nullに戻る。
- `levels`は所持済みIDだけ残り、Lv1からmaxLevelまでに丸められる。
- 全所持済みで孵化完了した場合はDNA代替報酬になる。

## 本番前に確認するケース

| ケース | 期待値 | 優先度 |
| --- | --- | --- |
| 旧セーブに`companion`なし | 起動し、ホーム/出撃/研究が壊れない | 高 |
| `selectedId`が削除済みID | nullに戻り、お供なしで出撃できる | 高 |
| `ownedIds`に不正ID | 不正IDだけ除去 | 高 |
| `levels`に0/999/文字列 | Lv範囲内に正規化 | 高 |
| `eggPending`中に出撃 | 通常通りプレイ開始 | 高 |
| `eggIncubating`中に出撃 | 通常通りプレイ開始 | 高 |
| `hatchCompleteAt`が過去 | 研究画面で受け取り可能 | 高 |
| `hatchCompleteAt`が不正文字列 | 安全にready扱いまたはwait扱いを固定 | 中 |
| 全所持済みで孵化 | DNA代替報酬 | 中 |
| 端末時刻変更 | 孵化判定が破綻しない | 中 |

## migration要否

featureブランチ段階ではVERSION更新を行わないため、main統合時に次を確認する。

1. `app_version`更新時のリリースノートにお供恐竜のsave追加を明記。
2. 初回起動時に`normalizeCompanionState`が必ず走る導線を維持。
3. 将来IDを削除/変更する場合は、旧IDから新IDへの変換表を追加。

## リスク

- 表示名/説明文が文字化けしている場合、save自体は壊れないがUI品質に直結する。
- 全10種類所持時のモーダル表示が5行固定のため、save上は所持していてもUIから選べないお供が出る。
- debug導線で作った状態を通常saveに残せるため、main統合前のQAでは`debugCompanionClear=1`後の通常導線も確認する。

## MVP-P06 save / edge case確認

P06で確認対象にした状態:

- `companion` 未定義: `normalizeCompanionState()` で補完。
- 卵なし: 孵化カードは表示しない。
- 卵所持: 身体強化カテゴリに孵化開始カードを表示。
- 孵化中: `hatchCompleteAt` まで残り時間を表示。
- 孵化完了: 受け取りカードを表示。
- 全お供所持済み: `completeCompanionEggIncubation()` はDNA +120の代替報酬を返す。
- DNA不足 / 研究Pt不足: 孵化開始不可、カードと通知で不足を表示。
- selected companionが不正ID: normalize時にnullへ戻す。
- Lv最大: 強化コストnull、ホームUIではMAX表示。
- 時刻変更/オフライン経過: Date.parseできない完了時刻は受け取り可能扱い、通常は現在時刻との差分で判定。

P06追加debug:

- `debugCompanionHatchReady=1`
- `debugCompanionAllOwned=1`

## MVP-P07 save / edge case confirmation

P07ではコードレベルで以下を確認しました。

- 旧セーブ相当の `companion` 未定義は安全なdefault stateへ補完される。
- 不正な `ownedIds` は除去される。
- 不正な `selectedId` は `null` へ戻る。
- 不正なlevel値はLv1からmaxLevelの範囲へclampされる。
- 全10種類のIDはuniqueで、Lv5までのscaled behaviorとupgrade costが取得できる。

残課題:
- 実プレイヤーsaveを使った現物確認。
- 時刻変更/長時間オフライン経過後の孵化完了表示の実機確認。
