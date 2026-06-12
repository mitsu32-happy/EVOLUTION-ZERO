# MVP-P03 お供恐竜 behavior gap

## 現状

P02時点で10タイプの最小AI差別化は入っている。攻撃系は敵にdamageを与え、回復/防御は一定間隔で補助し、速度/EXPはパッシブ補正として適用される。

## タイプ別ギャップ

| タイプ | 現状 | 本番相当か | 残作業 |
| --- | --- | --- | --- |
| 攻撃型 | 近い敵を単体攻撃 | 仮 | 専用斬撃effect、SE、damage上限、命中演出 |
| 範囲攻撃型 | 範囲内の複数敵にdamage | 仮 | 範囲表示、effect pool、対象数/頻度調整 |
| 回復型 | 一定間隔でHP回復 | 仮 | 回復effect、過剰回復の上限、UI説明との一致 |
| 回収型 | 近くのpickupにtargetedを付ける | 要改善 | `pull`値が実挙動に反映されていない。引き寄せ速度の実装/説明整理 |
| 防御補助型 | invincibleTimeを短時間伸ばす | 仮 | ガード発動表示、連続発動制限、被ダメ軽減方式の検討 |
| 速度補助型 | player.moveSpeedを増やす | 仮 | 保存/再入場時の二重適用防止QA、上限設定 |
| EXP補助型 | expGainMultiplierを増やす | 仮 | 成長速度の暴走確認、カード/研究との相互作用確認 |
| ボス特化型 | ボス優先でdamage倍率 | 仮 | ボス戦時間短縮の影響確認、boss tag取得の安定化 |
| 雑魚処理型 | 低HP敵を優先 | 仮 | 低HP判定の調整、kill時負荷、damage text間引き |
| シナジー補助型 | 小さな補助攻撃 | 要改善 | A15の適応シナジーに直接関わる補助効果は未実装。現在は攻撃寄り |

## 実効果確認が必要な項目

- `ptera_chick` の `pull` はデータ定義にあるが、実装はtargeted付与中心。
- `effectAssetKey` は全員分あるが、PlaySceneの攻撃/補助effectとしては十分に使われていない。
- `stego_calf` はシナジー補助型だが、現状は補助攻撃に近い。
- passive型の速度/EXPは、プレイ再初期化時に二重適用されないか回帰確認が必要。
- companion damageが高密度戦闘でdamage textを増やすため、表示間引きルールが必要。

## P05での実装単位

1. effectAssetKeyを実際の行動effectに接続。
2. companion attack/effectをPoolまたは既存上限管理へ接続。
3. 回収型の引き寄せ挙動を明確化。
4. シナジー補助型の効果をA15シナジー仕様に合わせて再設計。
5. 各タイプのlevel scalingをテーブル化。
6. debugCompanionでタイプ別挙動を強制発火できるQA導線を追加。
