# ND09g 新6体進化先 Sprite Motion Baseline 横展開

## 目的

ND09fで確立したアンキロサウルス系の修正方式を、残り5体のbase sprite sheetと20進化先sprite sheetへ水平展開した。

対象:

- parasaurolophus base / speed / hunting / attack / zero
- stegosaurus base / speed / hunting / attack / zero
- pteranodon base / speed / hunting / attack / zero
- compsognathus base / speed / hunting / attack / zero
- ornithomimus base / speed / hunting / attack / zero

## ND09f方式の適用内容

- 地上型は各フレームのvisual bottomを固定baselineへ揃えた。
- pteranodonは飛行型のため、足元ではなく体幹centerYを飛行基準線へ揃えた。
- non-action行では最大alpha componentのみを採用し、隣接セル由来の小片混入を排除した。
- action行は攻撃エフェクトや副次パーツを残すため、一定面積以上のsecondary componentを維持した。
- 512px進化先セルは安全余白を維持し、セル境界から32px以上を目安に配置した。

## 5体ごとの修正内容

### parasaurolophus

- baseはfootLine 330で再配置。
- 進化先はfootLine 440で統一。
- トサカが上端に寄りすぎないよう、縦方向のtarget heightを抑えた。
- action行は音波・トサカ発光ポーズを維持した。

### stegosaurus

- baseはfootLine 330で再配置。
- 進化先はfootLine 440で統一。
- 背板の上端余白を確保しつつ、進化先が小さく見えないよう横幅を拡大した。
- action行は背板発光・踏み込みポーズを維持した。

### pteranodon

- baseはcenterLine 192、進化先はcenterLine 256で再配置。
- 翼端の上下左右余白を優先し、足元baselineではなく体幹の揺れを抑える方式にした。
- move行は羽ばたき/滑空、action行は翼振り下ろし/風刃ポーズを維持した。

### compsognathus

- baseはfootLine 312で再配置。
- 進化先はfootLine 430で統一。
- 小さすぎて視認性が落ちないよう、進化先のtarget sizeとruntime display sizeをやや大きめにした。
- action行は噛みつき/飛びかかりポーズを維持した。

### ornithomimus

- baseはfootLine 336で再配置。
- 進化先はfootLine 440で統一。
- 脚の下端見切れを避けつつ、疾走姿勢が読めるサイズへ調整した。
- action行は疾走キック/脚部攻撃ポーズを維持した。

## 表示サイズ

進化先のruntime表示サイズを明示した。

| dino | speed | hunting | attack | zero |
|---|---:|---:|---:|---:|
| parasaurolophus | 164x126 | 166x128 | 172x132 | 174x134 |
| stegosaurus | 178x132 | 180x134 | 188x140 | 190x142 |
| pteranodon | 166x124 | 168x126 | 172x128 | 174x130 |
| compsognathus | 138x106 | 142x108 | 146x112 | 150x114 |
| ornithomimus | 160x132 | 164x134 | 170x140 | 172x142 |

## Animation Key整合

ND09fで、ND06新恐竜進化先sheet全体のanimation keyをruntime参照名へ合わせた。

- idle: row 0
- run: row 1
- attack: row 2
- death: row 3

ND09gではこの整合状態を維持し、残り5体のrow 1 / row 2がruntimeで利用される前提のsprite配置へ揃えた。

## Baseline確認結果

`docs/assets/nd09g_remaining_dinos_motion_report.json` のafter結果:

- 地上型: base/進化先すべてrow bottomRange 0
- pteranodon: base/進化先すべてrow centerRange 0.0-1.0
- edgeIssues: 0
- minMargin: 34px以上

## 目視QA

作成したcontact sheetで以下を確認した。

- セル境界を跨ぐ他セル混入なし
- 上下左右の見切れなし
- pteranodonの翼端がセル外へ出ていない
- stegosaurusの背板、parasaurolophusのトサカが上端に接触していない
- compsognathusは小さすぎず、進化先でも視認できる
- ornithomimusの脚下端が見切れていない
- action行は各恐竜の攻撃ポーズとして判別可能

## QA成果物

- `docs/assets/nd09g_remaining_dinos_motion_contact.png`
- `docs/assets/nd09g_remaining_dinos_before_after_contact.png`
- `docs/assets/nd09g_remaining_dinos_motion_report.json`

## 残課題

- 今回はND09f方式の水平展開であり、進化先デザインそのものの再生成は行っていない。
- 20進化先のPlayScene目視はdebugForceEvolution導線で短時間確認した。ND10では全分岐の実プレイ導線を再確認する。
