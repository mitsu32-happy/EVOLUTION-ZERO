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

## MVP-P05 行動AI・実効果

P05では、10種類のお供恐竜について「選んだ違いがプレイ中に分かる」ことを優先し、以下の実効果へ整理しました。お供は主火力ではなく、短い補助・軽い攻撃・回収支援として働きます。

| ID | 役割 | Lv1効果 | 強化で伸びる内容 |
| --- | --- | --- | --- |
| `raptorling` | 近接攻撃 | 近い敵1体へ10ダメージ、1.75秒間隔 | ダメージ、射程、攻撃間隔 |
| `spino_pup` | 範囲攻撃 | 中距離の敵3体へ8ダメージ、3.25秒間隔 | ダメージ、射程、攻撃間隔、Lv4で対象+1 |
| `medic_saur` | 回復 | HP86%以下で5回復、10.5秒間隔 | 回復量、発動間隔 |
| `ptera_chick` | 遠距離支援 | 離れた敵へ7ダメージ、2.45秒間隔 | ダメージ、射程、攻撃間隔 |
| `tricera_calf` | 防御補助 | 0.42秒の小バリア、12.8秒間隔 | バリア時間、発動間隔 |
| `para_juvenile` | 回収補助 | 半径150のpickupを引き寄せ、吸引速度を補助 | 回収半径、吸引速度 |
| `stego_calf` | 周囲攻撃 | 周囲の敵4体へ7ダメージ、4.25秒間隔 | ダメージ、射程、攻撃間隔、Lv5で対象+1 |
| `rex_hatchling` | ボス特化 | ボス優先13ダメージ、ボスには1.7倍 | ダメージ、射程、攻撃間隔、ボス倍率 |
| `compy_pack` | 雑魚処理 | 低HP敵2体へ5ダメージ、1.42秒間隔 | ダメージ、射程、攻撃間隔、Lv4で対象+1 |
| `exp_chaser` | EXP補助 | EXP獲得+4.5%、EXP pickupを軽く引き寄せ | EXP倍率、回収半径、吸引速度 |

攻撃・回復・回収・防御・EXP補助はいずれもP04の `effectAssetKey` を行動時に使用します。effectは短寿命Sprite poolで管理し、同時表示数は `MAX_COMPANION_EFFECTS` 以内に抑えます。

## MVP-P06 卵・孵化・選択・強化UI

P06では、卵入手から孵化、ホームでのセット、DNA強化までの導線を本番投入に近い形へ整理しました。

状態遷移:

1. プレイ中に卵pickupを入手する。
2. リザルトで「卵入手 / 研究で孵化できます」を表示する。
3. 研究画面の身体強化カテゴリに孵化カードを表示する。
4. DNA 90 / 研究Pt 12を消費して孵化を開始する。
5. 孵化中は残り時間を表示し、オフライン経過も `hatchCompleteAt` で判定する。
6. 完了後は受け取りボタンから未所持のお供恐竜をランダム取得する。
7. 全所持済みの場合は代替報酬としてDNA +120を付与する。
8. ホームのお供モーダルでセット/強化する。

P06でのUI改善:

- 研究画面の孵化カードに卵icon、必要DNA、必要研究Pt、孵化時間、残り時間、受け取り状態を表示。
- 孵化完了時に `hatch_effect_p01.png` を短時間表示し、取得したお供恐竜の名前、タイプ、効果、ホーム案内を確認ダイアログで表示。
- ホームのお供選択モーダルは10種類すべてを表示し、未所持/所持済み/セット中を区別。
- 選択中のお供は現在効果、次Lv効果、必要DNAを表示。
- DNA不足時は強化ボタンを暗く表示し、押した場合は不足通知を出す。

追加debug導線:

- `debugCompanionHatchReady=1`: 受け取り可能な孵化状態を作る。
- `debugCompanionAllOwned=1`: 全お供所持状態を作る。

## MVP-P07 総合QA / main統合準備

P07ではmain統合前の総合確認として、10種類すべての `debugCompanionId` 起動、お供なし通常プレイ、ZERO/ENDLESS短時間の `debugPerformance=1` 確認、卵所持/孵化完了/全所持代替報酬の研究画面確認を実施しました。

確認結果:
- 10種類すべてでPlayScene起動、sprite/fallback/debug label経路、行動更新経路がruntime error/warn 0件。
- お供なしでもPlayScene起動に問題なし。
- ZEROお供あり、ENDLESSお供なしの短時間debugPerformance smokeでruntime error/warn 0件。
- `normalizeCompanionState(undefined)` により旧セーブ相当の補完を確認。
- 不正selectedId、不正ownedIds、不正levelは正規化で安全化されることを確認。
- main統合前チェックリストは `docs/design/companion_main_merge_checklist_p07.md` に分離。

main統合前に残す確認:
- debugなしの新規セーブ自然導線で卵取得から孵化、セット、再起動後保存までを最終確認する。
- 実プレイヤー相当の既存セーブがあれば、companion領域なしからホーム/研究/出撃が壊れないことを確認する。
- ZERO/ENDLESSを攻撃型と補助型のお供で長めにソークする。

## MVP-P07b final QA note

P07bでは、main統合可否を「最低限動くか」ではなく「本リリース品質に達しているか」で判定しました。

結論:
- 現時点ではmain統合不可。
- save互換、通常UIからPlayScene開始、卵/孵化/セット/強化の基盤は概ね機能しています。
- ただし、companion本体が静止sprite中心で、攻撃/回復/補助の視覚フィードバックがまだ商品レベルには足りません。
- ZERO/ENDLESSの3-5分ソークも、Game Overやレベルアップ選択停止により完全な長時間確認としては未完了です。

P07bで修正した軽微問題:
- `src/data/companion_dinos.js` のユーザー表示名、タイプ名、説明、効果サマリーの文字化け/表記崩れを修正しました。

詳細:
- `docs/design/companion_main_merge_final_qa_p07b.md`
- `docs/design/companion_animation_gap_p07b.md`
## MVP-P04b runtime animation pass

P04b adds release-oriented runtime presentation improvements without changing companion save data, hatch flow, selection flow, or major AI balance.

- PlayScene now assigns each companion a small animation profile.
- Companions have visible idle bob, follow tilt, facing, squash/stretch, and action lunge/pulse behavior.
- `raptorling`, `rex_hatchling`, and `compy_pack` emphasize fast or heavy attack motion.
- `medic_saur`, `tricera_calf`, `para_juvenile`, and `exp_chaser` emphasize support pulses, guard aura, sonar rings, and EXP trace rings.
- `spino_pup`, `ptera_chick`, and `stego_calf` emphasize ranged, water, air, and shockwave-style feedback.
- P04 production sprite/effect PNGs remain the source assets.
- Companion action effects remain capped by `MAX_COMPANION_EFFECTS` and pooled.

See `docs/design/companion_animation_p04b.md` for the detailed animation matrix and follow-up QA requirements.

## MVP-P04c animation assets

P04c adds generated animation sheets for all 10 companions.

- Sprite sheets: `public/assets/companions/{id}_sprite_sheet_p04c.png`
- Effect sheets: `public/assets/companions/{id}_effect_sheet_p04c.png`
- Each sprite sheet has 3 state rows: `idle`, `move`, `action`.
- Each effect sheet has an `active` row.
- Existing companion asset keys are reused, so save data and companion definitions do not change.
- PlayScene switches companion sprite frames by state and keeps P04b procedural motion as secondary polish.

Detailed mapping: `docs/design/companion_animation_assets_p04c.md`.
