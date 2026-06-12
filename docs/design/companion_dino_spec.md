# お供恐竜システム仕様 P01-P02

## 目的

お供恐竜は、プレイヤーの周囲を追従し、攻撃・回復・回収などを少し支援する小型恐竜です。
P01では卵取得から孵化、所持、セット、プレイ中追従までの基盤を作り、P02では10種類の個別アセットと最小行動差別化を追加しました。

## 保存領域

既存セーブに `companion` がない場合は、起動時に既定値を補完します。

- `ownedIds`: 所持済みのお供恐竜ID
- `selectedId`: セット中のお供恐竜ID
- `levels`: お供恐竜ごとのLv
- `eggPending`: 未孵化の卵を所持
- `eggIncubating`: 孵化中
- `hatchStartedAt`: 孵化開始ISO時刻
- `hatchCompleteAt`: 孵化完了ISO時刻
- `lastHatchedId`: 直近孵化したお供恐竜ID
- `tutorialFlags`: お供恐竜関連チュートリアルの表示済み状態

## お供恐竜データ

10種類を前提に `src/data/companion_dinos.js` で定義します。

| ID | 表示名 | タイプ | P02行動 |
| --- | --- | --- | --- |
| `raptorling` | ラプトル幼体 | 攻撃型 | 近い敵へ単体攻撃 |
| `spino_pup` | スピノ幼体 | 範囲攻撃型 | 周囲の複数敵へ小範囲攻撃 |
| `medic_saur` | メディサウルス | 回復型 | 一定間隔で少量回復 |
| `ptera_chick` | プテラ幼鳥 | 回収型 | 近くのEXP/アイテムを引き寄せ |
| `tricera_calf` | トリケラ仔竜 | 防御補助型 | 短い防御補助 |
| `para_juvenile` | パラサウロ幼体 | 速度補助型 | ラン開始時に移動速度を微増 |
| `stego_calf` | ステゴ仔竜 | シナジー補助型 | 近い敵へ控えめな補助攻撃 |
| `rex_hatchling` | レックス幼体 | ボス特化型 | ボス優先の単体攻撃 |
| `compy_pack` | コンピー隊 | 雑魚処理型 | 低HP敵を優先して攻撃 |
| `exp_chaser` | エクスピー | EXP補助型 | EXP取得量を微増 |

## 卵ドロップ

- 1プレイ最大1個まで。
- 卵所持中/孵化中は追加ドロップしません。
- 初回は少し入手しやすくします。
- 取得時に `eggPending` を保存し、リザルトにも卵入手を表示します。
- QA用に `debugCompanionEggDrop=1` / `debugCompanionEgg=1` を利用できます。

## 孵化

- 研究画面の身体強化カテゴリに卵孵化カードを表示します。
- コストは DNA 90 / 研究Pt 12。
- 孵化時間は3時間。現在時刻との差分で完了判定するため、PWA/offline後も復帰できます。
- 完了時は未所持のお供恐竜からランダム取得します。
- 全所持済みの場合は代替DNA報酬になります。
- QA用に即時孵化/孵化中状態を作るデバッグ導線を用意します。

## 強化

- お供恐竜ごとにLv1-5を保存します。
- DNAを消費して強化します。
- Lvに応じて攻撃、回復、回収、補助量が控えめに上昇します。

## プレイ中挙動

- セット中のお供恐竜はプレイヤー周辺をゆるく追従します。
- プレイヤーや敵に完全に重なり続けないよう、円軌道に近い追従位置を使います。
- P02ではタイプごとの最小AI差別化を追加します。
- お供なし、卵所持、孵化中でもPlaySceneは正常に生成されます。

## P02アセット

- 10種類それぞれに `icon` / `sprite` / `effect` PNGを追加しました。
- 透明背景の小型スプライトで、EVOLUTION ZEROの暗色SFトーンに合わせています。
- 実行時の簡易Graphicsだけで完了扱いにせず、manifestからPNGを参照します。
- 確認用コンタクト: `docs/assets/p02_companion_asset_contact.png`

## P02以降の課題

- 10種類すべての行動AIを本実装レベルへ拡張。
- ホームのお供一覧が10種類以上でも快適に選べるスクロール/ページング。
- 孵化演出、レアリティ演出、強化UIの本格化。
- バランス調整と専用SE追加。

## P02.1 プレイ中表示修正

- P02直後は、重い戦闘向けのstale child cleanupが `companionView` をactive viewとして扱っていなかったため、PlayScene生成後にお供containerがdepthLayerから削除されていました。
- `collectActiveRuntimeViews()` に `companionView` を追加し、cleanup対象から除外しました。
- asset読み込み前は空spriteで隠れないよう、spriteを非表示にしてfallbackを表示するようにしました。
- 表示位置をプレイヤー右下寄りへ調整し、glowとサイズを少し強めました。
- `debugCompanion=1` でプレイ中にお供ID、sprite/fallback状態、座標を表示できます。
- `debugCompanionId=<id>` / `debugSelectCompanion=<id>` で、保存状態に依存せず指定お供をプレイ中に確認できます。
- QA画像: `docs/assets/p02_1_companion_ingame_qa.png`

## MVP-P04 本番アセット接続

- 10種類のお供恐竜それぞれに、P04用の `icon` / `sprite` / `effect` PNGを追加しました。
- ファイル名は `public/assets/companions/{id}_{icon|sprite|effect}_p04.png` です。
- `asset_manifest` はP04ファイルを参照します。P02ファイルは比較/rollback用に残しています。
- PlaySceneではお供の攻撃/補助行動時に `effectAssetKey` の短寿命Spriteを表示します。
- companion effectは `MAX_COMPANION_EFFECTS` の上限とpoolを持ち、高密度戦闘で増え続けないようにしています。
- debugPerformanceには `companionEffects` と `companionEffectPoolFree` を追加しました。
- お供選択モーダルは5件ずつのページングに対応し、10種類所持時も全iconを確認できます。
- 品質確認用contact: `docs/assets/p04_companion_asset_contact.png`
- 生成レポート: `docs/assets/p04_companion_asset_report.json`
