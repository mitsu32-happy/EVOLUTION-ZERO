# MVP-P03 お供恐竜アセット生成計画

## 方針

- 簡易Graphicsで本番完了扱いにしない。
- 文字入り画像は作らず、文字はコード側Textで表示する。
- プレイ中は小さくても味方と分かる輪郭、影、glowを優先する。
- 10種類すべてでicon、sprite、effectをそろえ、manifest keyを維持する。

## お供恐竜10種類の本番アセット

| id | 現状ファイル | 仮/本番判定 | 必要アセット | 優先度 | 推奨サイズ | 透明PNG | manifest key | 使用画面 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `raptorling` | `raptorling_icon_p02.png`, `raptorling_sprite_p02.png`, `raptorling_effect_p02.png` | 仮 | icon, small sheet, claw effect | 高 | icon 128x128, sheet 4x4 384x384 | 必須 | `raptorlingIcon/Sprite/Effect` | ホーム、モーダル、プレイ |
| `spino_pup` | `spino_pup_*_p02.png` | 仮 | icon, small sheet, water area effect | 高 | icon 128x128, sheet 4x4 384x384 | 必須 | `spinoPupIcon/Sprite/Effect` | ホーム、モーダル、プレイ |
| `medic_saur` | `medic_saur_*_p02.png` | 仮 | icon, small sheet, heal pulse | 高 | icon 128x128, sheet 4x4 384x384 | 必須 | `medicSaurIcon/Sprite/Effect` | ホーム、モーダル、プレイ |
| `ptera_chick` | `ptera_chick_*_p02.png` | 仮 | icon, hovering sheet, pickup trail | 高 | icon 128x128, sheet 4x4 384x384 | 必須 | `pteraChickIcon/Sprite/Effect` | ホーム、モーダル、プレイ |
| `tricera_calf` | `tricera_calf_*_p02.png` | 仮 | icon, small sheet, guard flash | 高 | icon 128x128, sheet 4x4 384x384 | 必須 | `triceraCalfIcon/Sprite/Effect` | ホーム、モーダル、プレイ |
| `para_juvenile` | `para_juvenile_*_p02.png` | 仮 | icon, running sheet, speed streak | 中 | icon 128x128, sheet 4x4 384x384 | 必須 | `paraJuvenileIcon/Sprite/Effect` | ホーム、モーダル、プレイ |
| `stego_calf` | `stego_calf_*_p02.png` | 仮 | icon, small sheet, synergy spark | 中 | icon 128x128, sheet 4x4 384x384 | 必須 | `stegoCalfIcon/Sprite/Effect` | ホーム、モーダル、プレイ |
| `rex_hatchling` | `rex_hatchling_*_p02.png` | 仮 | icon, bite sheet, boss hit effect | 高 | icon 128x128, sheet 4x4 384x384 | 必須 | `rexHatchlingIcon/Sprite/Effect` | ホーム、モーダル、プレイ |
| `compy_pack` | `compy_pack_*_p02.png` | 仮 | icon, pack sheet, swarm slash | 中 | icon 128x128, sheet 4x4 384x384 | 必須 | `compyPackIcon/Sprite/Effect` | ホーム、モーダル、プレイ |
| `exp_chaser` | `exp_chaser_*_p02.png` | 仮 | icon, scanner sheet, EXP pulse | 中 | icon 128x128, sheet 4x4 384x384 | 必須 | `expChaserIcon/Sprite/Effect` | ホーム、モーダル、プレイ |

## 共通アセット

| アセット | 現状ファイル | 必要性 | 仮/本番判定 | 優先度 | 推奨サイズ | 透明PNG | 使用画面 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 卵アイコン | `companion_egg_p01.png` | 卵ドロップ、ホーム、研究、リザルト | 仮 | 高 | 128x128 | 必須 | プレイ、研究、リザルト |
| 卵ドロップ演出 | なし | 取得時の視認性 | 未実装 | 高 | 256x256 effect sheet | 必須 | プレイ |
| 卵取得通知 | 既存通知流用 | 取得時の達成感 | 仮 | 中 | UI panel/chip | 任意 | プレイ |
| 孵化中カード | 研究カード流用 | 孵化導線の明確化 | 仮 | 高 | 9-slice panel | 任意 | 研究 |
| 孵化完了演出 | `hatch_effect_p01.png` | 取得時の見せ場 | 仮 | 高 | 512x512 effect | 必須 | 研究 |
| お供選択UI | home modal Graphics | 10種類一覧 | 仮 | 高 | panel/row/chip | 任意 | ホーム |
| お供強化UI | home modal Graphics | DNA強化 | 仮 | 高 | button/row/chip | 任意 | ホーム |
| セット中表示 | home panel Graphics | ホームでの状態表示 | 仮 | 中 | small panel | 任意 | ホーム |
| プレイ中glow/影 | Graphics | 視認補助 | 仮 | 中 | glow ring | 必須ならPNG | プレイ |
| チュートリアル用アイコン | なし | 説明の分かりやすさ | 未実装 | 低 | 96x96 | 必須 | チュートリアル |

## クロマキー/透過

- お供sprite、effect、eggは透明PNG必須。
- 生成時に背景が残る場合はクロマキー処理または透明化処理を行う。
- 小型spriteは輪郭が欠けやすいため、余白を広めに取る。

## P04推奨

P04では10種類のiconとsprite sheetを先に本番化する。effectはP05のAI実装と同時に差し替えると、実挙動に合わせて無駄なく作れる。

## MVP-P04 実施結果

- 10種類すべてに本番用 `icon` / `sprite` / `effect` を追加した。
- 既存P02ファイルは残し、P04ファイルは `public/assets/companions/{id}_{kind}_p04.png` として追加した。
- `src/data/asset_manifest.js` はP04ファイルを参照するように更新した。
- 生成元は3枚のcontact sheetで、個別PNGはクロマキー除去後に切り出した。
- 品質確認用contact: `docs/assets/p04_companion_asset_contact.png`
- 生成レポート: `docs/assets/p04_companion_asset_report.json`

## P04で残した課題

- spriteは静止画。歩行/飛行アニメーションsheet化はP04b以降。
- effectはPlaySceneで短寿命Spriteとして接続済みだが、type別の細かい発火タイミングやSEはP05で調整する。
- お供選択モーダルは5件ずつのページングに対応した。より本格的なスクロールUIはP06で検討する。
