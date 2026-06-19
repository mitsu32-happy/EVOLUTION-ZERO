# ND09i 新6体 進化UIアイコン・必殺技アイコン・スプリントインパクト修正

## 目的

ND09g/ND09hの目視確認で見つかった、新6体の進化演出アイコン誤表示、進化先必殺技アイコンの専用性不足、ornithomimus系スプリントインパクトの見切れ/混入リスクを修正する。

## 問題と原因

### 進化演出アイコン誤表示

`src/effects/evolution_sequence.js` の進化演出は、旧4体中心の静的portrait preloadと `speed` / `hunting` / `attack` / `zero` tag fallbackを使っていた。新6体の進化先portraitが未ロードの場合、同じtagの既存恐竜portraitへ落ちる可能性があり、進化演出で他恐竜が表示されていた。

### 必殺技アイコン専用性不足

新6体 x 4進化のHUD必殺技アイコンは存在していたが、進化先ごとの専用イラスト生成ではなく、既存の進化portrait/effectをUIアイコン化した構成に近かった。そのため、ND09iでは必殺技アイコン自体を別途イラスト生成したシートから切り出して差し替える。

### スプリントインパクト余白不足

ornithomimus系のbranch attack / ultimate effectは上下余白が薄いものがあり、実機表示やcontact sheetで見切れ/他セル混入に見えるリスクがあった。

## 修正内容

### 進化演出portrait参照

`selectedEvolution.portraitPath` を進化演出開始時に動的ロードし、`id` / `tag` fallbackより優先して表示するように変更した。これにより、新6体の進化先は各進化先専用portraitを表示する。

### 24進化先の必殺技アイコン再生成

以下の24個を、6体ごとの2x2専用イラスト生成シートから切り出して再生成した。各シートは speed / hunting / attack / zero の4分岐を含み、恐竜種の特徴と必殺技の方向性が分かるようにした。

- ankylosaurus_speed / ankylosaurus_hunting / ankylosaurus_attack / ankylosaurus_zero
- parasaurolophus_speed / parasaurolophus_hunting / parasaurolophus_attack / parasaurolophus_zero
- stegosaurus_speed / stegosaurus_hunting / stegosaurus_attack / stegosaurus_zero
- pteranodon_speed / pteranodon_hunting / pteranodon_attack / pteranodon_zero
- compsognathus_speed / compsognathus_hunting / compsognathus_attack / compsognathus_zero
- ornithomimus_speed / ornithomimus_hunting / ornithomimus_attack / ornithomimus_zero

speedはシアンの高速演出、huntingは黄金の索敵/追跡演出、attackは赤橙の衝撃演出、zeroは紫/青緑のZERO異常進化演出として生成した。ZERO進化分も他分岐と同じく専用イラスト生成版を使用する。

生成元シート:

- `docs/assets/nd09i_generated_icon_sources/ankylosaurus_ultimate_icon_sheet.png`
- `docs/assets/nd09i_generated_icon_sources/parasaurolophus_ultimate_icon_sheet.png`
- `docs/assets/nd09i_generated_icon_sources/stegosaurus_ultimate_icon_sheet.png`
- `docs/assets/nd09i_generated_icon_sources/pteranodon_ultimate_icon_sheet.png`
- `docs/assets/nd09i_generated_icon_sources/compsognathus_ultimate_icon_sheet.png`
- `docs/assets/nd09i_generated_icon_sources/ornithomimus_ultimate_icon_sheet.png`

## 必殺技エフェクト確認

24分岐の必殺技エフェクトは、ND09bで専用VFX生成済みの `public/assets/effects/specials/new_dinos/special_{dino}_{branch}_ultimate.png` を継続使用する。`docs/assets/nd09b_new_dinos_evolution_effect_contact.png` で以下を確認した。

- speed / hunting / attack / zero でVFX形状と色調が分かれている。
- ZERO進化分も紫/青緑の専用ZERO VFXとして存在する。
- 新6体すべてに ultimate effect asset が存在する。
- ND09iではornithomimus系の余白不足リスクがあるultimate effectのみ、見切れ/混入対策として再配置した。

### スプリントインパクト修正

以下のornithomimus系effectを再配置し、透明余白を増やした。

- `public/assets/effects/attacks/ornithomimus_sprint_kick.png`
- `public/assets/effects/attacks/evolutions/ornithomimus_speed_attack.png`
- `public/assets/effects/attacks/evolutions/ornithomimus_hunting_attack.png`
- `public/assets/effects/attacks/evolutions/ornithomimus_attack_attack.png`
- `public/assets/effects/attacks/evolutions/ornithomimus_zero_attack.png`
- `public/assets/effects/specials/new_dinos/special_ornithomimus_speed_ultimate.png`
- `public/assets/effects/specials/new_dinos/special_ornithomimus_hunting_ultimate.png`
- `public/assets/effects/specials/new_dinos/special_ornithomimus_attack_ultimate.png`
- `public/assets/effects/specials/new_dinos/special_ornithomimus_zero_ultimate.png`

report上の最小余白は通常sprint kickが49px、branch/ultimate系が34px以上。

## QA成果物

- `docs/assets/nd09i_evolution_icon_contact.png`
- `docs/assets/nd09i_ultimate_icon_contact.png`
- `docs/assets/nd09i_sprint_impact_contact.png`
- `docs/assets/nd09i_asset_report.json`

## QA結果

- 進化演出portraitは `portraitPath` 優先参照へ修正済み。
- 24進化先の必殺技アイコンは専用イラスト生成シート由来の再生成版へ差し替え済み。
- 24進化先の必殺技エフェクトはND09b専用VFX生成版の存在とcontactを確認済み。ZERO分も含む。
- ornithomimus系スプリントインパクトはcontact sheet上でセル端から離れ、見切れ/混入リスクを低減済み。
- runtime QAはND09i確認URLで代表進化先を起動して確認する。

## 残課題

進化演出の実際の選択シーケンス全パターン目視はND10の総合QAで継続確認する。今回の修正は、誤fallbackを防ぐ参照修正と、専用アイコン/余白不足effectの差し替えに限定する。
