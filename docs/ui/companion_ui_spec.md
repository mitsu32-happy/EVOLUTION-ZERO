# お供恐竜UI仕様 P01-P02

## ホーム

- ホーム中央付近に小型の「お供」パネルを表示します。
- セット中はお供恐竜名とLvを表示します。
- 卵所持中は「卵あり」、孵化中は「孵化中」と表示します。
- 未所持/未セット時は「お供なし」と表示します。
- P02から、セット中のお供恐竜ごとの個別アイコンを表示します。

## お供恐竜選択モーダル

- ホームのお供パネルをタップ/クリックすると開きます。
- 所持済みのお供恐竜、Lv、効果概要、選択状態を表示します。
- DNAによる強化ボタンを表示します。
- 範囲外クリックで閉じます。
- P02では各行のアイコンも個別アセットを使います。

## 研究画面

- 卵所持中または孵化中に、身体強化カテゴリへ孵化カードを表示します。
- 表示内容:
  - 卵を孵化
  - 必要DNA / 必要研究Pt
  - 孵化中の残り時間
  - 孵化完了時の受け取り導線
- 卵所持時の初回説明:
  - 「卵はDNAと研究Ptを使って孵化できます。」

## リザルト

- プレイ中に卵を入手した場合、報酬行に卵入手を表示します。
- 卵を取れなかった場合は表示しません。

## プレイ中

- セット中のお供恐竜をプレイヤー周囲に小さく表示します。
- P02では10種類それぞれの小型スプライトを使用します。
- お供なし、卵所持、孵化中ではプレイ中表示は出ません。
- お供表示の座標/スケール更新は安全化し、表示オブジェクト異常でゲームループを止めないようにします。

## チュートリアル

- 卵取得時: 「卵を入手しました。研究画面で孵化できます。」
- 研究画面で卵所持時: 「卵はDNAと研究Ptを使って孵化できます。」
- お供恐竜取得後: 「ホーム画面でお供恐竜をセットできます。」
- お供セット後: 「お供恐竜はプレイ中に一緒に行動します。」

## P02確認ポイント

- ホームのお供アイコンが個別表示になる。
- お供選択モーダルの行アイコンが個別表示になる。
- 10種類それぞれに `icon` / `sprite` / `effect` のPNGがある。
- プレイ中にセット中のお供恐竜の小型スプライトが追従する。
- タイプごとに最小限の行動差がある。

## P02.1 プレイ中表示確認

- お供恐竜は `depthLayer` 上に表示し、背景より上、HUDより下に置きます。
- `companionView` はruntime cleanupのactive viewとして保持します。
- sprite読み込み前はfallback表示を出し、透明/空spriteだけにならないようにします。
- 追従位置はプレイヤー右下寄りを基準にし、画面中央で視認しやすくします。
- debug表示:
  - `debugCompanion=1`: お供ID、sprite/fallback状態、座標をラベル表示
  - `debugCompanionId=rex_hatchling`: 指定お供を直接表示確認
  - `debugSelectCompanion=raptorling`: 指定お供を所持/セットして確認
  - `debugUnlockCompanions=1`: 10種類を開発確認用に所持
- 確認画像: `docs/assets/p02_1_companion_ingame_qa.png`

## MVP-P04 UI接続

- ホームのお供パネルとお供選択モーダルは、P04用の本番iconを表示します。
- お供選択モーダルは5件ずつのページングに対応しました。
  - `前` / `次` ボタンでページ切替。
  - gamepad/仮想マウス操作では左右またはLB/RB相当でページ切替。
- 強化UIは選択中のお供に対して従来通り表示します。
- PlaySceneではP04 spriteを読み込み、読み込み中だけfallbackを表示します。
- 行動時effectはP04 effect PNGを使います。
- 今回は大規模UI改修は行わず、P06でスクロール/詳細表示/強化差分表示を本番化します。

## MVP-P05 UI説明更新

P05では `src/data/companion_dinos.js` の説明文と効果サマリーを実挙動に合わせて整理しました。

- お供タイプ名を日本語で再整理しました。
- お供選択/強化UIの効果表示は `getCompanionEffectSummary()` から取得し、Lvごとの実効果と一致します。
- 表示例: `HP +5 / 10.5秒`、`回収半径 150 / 吸引x1.18`、`ボス 13 x1.7`。
- P05では大規模UI改修は行わず、既存のホームパネル・選択モーダル・強化UIの文言整合を優先しました。

P06以降のUI課題:

- 強化後差分の見せ方をより分かりやすくする。
- 回復/防御/回収など補助型の発動条件を詳細表示できるようにする。
- コントローラー/仮想マウスでの選択快適性を確認する。

## MVP-P06 卵・孵化・強化UI仕上げ

- リザルトの卵報酬行は「研究で孵化できます」と表示し、次に行く場所が分かるようにしました。
- 研究画面の身体強化カテゴリに表示される孵化カードは、卵icon、必要DNA、必要研究Pt、孵化時間、残り時間、受け取り状態を短文で表示します。
- 孵化完了時は、取得したお供恐竜の名前、タイプ、Lv1効果、「ホームでセットできます」を確認ダイアログで表示します。
- ホームのお供モーダルは所持済みだけでなく10種類すべてを表示し、未所持は暗め表示にしました。
- セット中のお供は「現在効果」「次Lv効果」「必要DNA」を表示します。
- 強化後はすぐに表示を更新し、最大LvではMAX表示にします。
- DNA不足時は強化ボタンを暗くし、押した場合は不足通知を出します。

チュートリアル文言は既存の以下を維持します。

- 卵取得時: 「卵を入手しました。研究画面で孵化できます。」
- 研究画面で卵所持時: 「卵はDNAと研究Ptを使って孵化できます。」
- 孵化完了時: 「お供恐竜を入手しました。ホームでセットできます。」相当の取得結果表示
- 初回セット時: セット完了通知と既存tutorial flag `companionSet`

## MVP-P07 UI/UX確認

P07では以下のUI状態を確認しました。

- ホームのお供モーダル: 10種類一覧、所持/未所持、セット中、現在/次Lv効果、必要DNA、DNA不足表示を確認。
- 研究画面: 卵所持、孵化中、孵化完了受け取り、全所持済み代替報酬の表示を確認。
- リザルト: 卵入手時に研究画面へ向かう意味が分かる文言を維持。
- プレイ中: `debugCompanion=1` で10種類の表示/行動デバッグ情報を確認。

残課題:
- スマホ実機幅での長文見切れ確認。
- コントローラー/仮想マウスでモーダルを閉じる操作の最終確認。
- 静止spriteのため、アニメーション品質はP04b以降の改善候補。

## MVP-P07b UI release-quality note

P07bのスマホ幅確認では、ホームのお供モーダルと研究画面の孵化カード/代替報酬ダイアログが画面内に収まることを確認しました。

ただし、本リリース品質としては以下が残ります。
- お供モーダルの文字密度が高い。
- 10種類表示は可能だが、スマホで余裕のある見え方ではない。
- 強化/セット/未所持の情報が多く、視線誘導の整理余地があります。
- コントローラー/仮想マウスの実機確認は未完了です。
## MVP-P04b play feedback note

P04b is mostly a PlayScene presentation pass.

- Home, hatch, selection, and upgrade UI structure did not receive a large redesign.
- In-play companion feedback is now more readable through runtime bob, tilt, lunge, pulse, guard, sonar, shockwave, and trail overlays.
- The UI still uses the existing companion icon/sprite/effect assets from P04.
- Smartphone UI readability should be rechecked after the animation pass, especially because stronger in-play feedback can change perceived visual density.
- Controller/virtual mouse modal close behavior remains a required release QA item before main integration.

## MVP-P05b movement feedback

P05b does not add new UI controls, but it changes the in-play behavior players
see after selecting a companion.

- Higher companion levels increase movement reach around the player.
- The current upgrade UI remains focused on effect values; movement reach is not surfaced as a separate stat yet.
- Future UI polish may add a short "行動範囲" line if player testing shows the level-based movement growth is not discoverable.
- `debugCompanion=1` shows movement radius and facing for QA only.
