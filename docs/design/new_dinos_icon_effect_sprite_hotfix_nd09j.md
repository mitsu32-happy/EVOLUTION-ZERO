# ND09j 新6体進化先アセット品質修正

## 目的

ND09i後の目視確認で見つかった以下を修正する。

- クレーターアンキロのsprite sheetがhero/portraitと異なり、ZERO寄りに見える
- ZERO以外の進化先spriteにZERO寄りの紫/青緑表現が残っている
- 必殺技アイコンに生成用の緑ガイド枠が残っている
- 必殺技エフェクトが簡易VFXに見える
- ZERO進化も同等品質で確認する

## クレーターアンキロ確認結果

正式IDは `ankylosaurus_attack`。

- evolution name: `クレーターアンキロ`
- ultimate name: `クレータークラブ`
- hero: `public/assets/dinos/evolutions/heroes/ankylosaurus_attack_hero.png`
- portrait: `public/assets/dinos/evolutions/portraits/ankylosaurus_attack_portrait.png`
- sprite sheet: `public/assets/dinos/evolutions/sheets/ankylosaurus_attack_sheet.png`

確認時点では、hero/portraitが橙のクレーター重撃型である一方、sprite sheetは紫寄りでZERO個体に見えた。ND09jでは非ZERO分岐の高彩度な紫/青緑発光を、branchごとの色へ寄せる処理を行い、クレーターアンキロはattack/crater系の橙へ補正した。

成果物:

- `docs/assets/nd09j_crater_ankylo_compare.png`

## ZERO寄りsprite調査結果

対象は新6体 x speed/hunting/attack の18進化。

確認観点:

- ZERO進化ではないのに紫/青緑の異常発光が強くないか
- 亀裂/汚染/結晶の印象がZERO進化と混同しないか
- heroとspriteの進化方向が一致して見えるか

対応:

- speed: シアンの高速系へ整理
- hunting: 金/黄の索敵・狩猟系へ整理
- attack: 橙/赤の重撃・衝撃系へ整理
- zero: 変更なし。ZEROらしさを維持

成果物:

- `docs/assets/nd09j_non_zero_sprite_audit_contact.png`

## 必殺技アイコン修正

ND09iで生成したアイコンは専用イラスト生成シート由来だったが、切り出し時に生成用の緑ガイド枠が残っていた。

ND09jでは全24点を再出力し、緑ガイド色を透明化した。検査上、緑ガイド色の残りは0件。

対象:

- 新6体 x speed/hunting/attack/zero = 24点
- ZERO進化アイコンも同一品質で処理

成果物:

- `docs/assets/nd09j_ultimate_icon_contact.png`

## 必殺技エフェクト生成内容

ND09jでは、新6体ごとに専用ultimate effectシートをイラスト生成し、speed/hunting/attack/zero の4分岐へ切り出した。

生成元:

- `docs/assets/nd09j_generated_ultimate_effect_sources/ankylosaurus_ultimate_effect_sheet.png`
- `docs/assets/nd09j_generated_ultimate_effect_sources/parasaurolophus_ultimate_effect_sheet.png`
- `docs/assets/nd09j_generated_ultimate_effect_sources/stegosaurus_ultimate_effect_sheet.png`
- `docs/assets/nd09j_generated_ultimate_effect_sources/pteranodon_ultimate_effect_sheet.png`
- `docs/assets/nd09j_generated_ultimate_effect_sources/compsognathus_ultimate_effect_sheet.png`
- `docs/assets/nd09j_generated_ultimate_effect_sources/ornithomimus_ultimate_effect_sheet.png`

出力:

- `public/assets/effects/specials/new_dinos/special_{dino}_{branch}_ultimate.png`

方針:

- speed: 高速軌跡/加速演出
- hunting: 索敵/追跡/マーキング演出
- attack: 重撃/衝撃/破壊演出
- zero: ZERO異常進化の紫/青緑演出

成果物:

- `docs/assets/nd09j_ultimate_effect_contact.png`

## ZERO進化品質確認

ZERO進化6点について、hero / sprite / ultimate icon / ultimate effect を並べて確認した。

確認結果:

- ZERO進化は紫/青緑の異常進化として他分岐と差別化されている
- ZERO進化の無条件解放は変更していない
- 共存シナジーのenabled状態は変更していない

成果物:

- `docs/assets/nd09j_zero_quality_contact.png`

## QA成果物

- `docs/assets/nd09j_crater_ankylo_compare.png`
- `docs/assets/nd09j_non_zero_sprite_audit_contact.png`
- `docs/assets/nd09j_ultimate_icon_contact.png`
- `docs/assets/nd09j_ultimate_effect_contact.png`
- `docs/assets/nd09j_zero_quality_contact.png`
- `docs/assets/nd09j_asset_report.json`

## 変更範囲

- 24進化先の必殺技アイコン
- 24進化先の必殺技エフェクト
- 非ZERO 18進化先のsprite sheet色調整理
- `tools/nd09j_fix_new_dino_assets.py`

## 残課題

クレーターアンキロのspriteはZERO寄りの色調を解消したが、heroと完全同一の造形ではない。ND10では実機上のサイズ・動作・演出を含めて最終目視確認する。
