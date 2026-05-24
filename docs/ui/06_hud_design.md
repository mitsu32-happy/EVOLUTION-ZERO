# HUD Design v0.1

## Reference
- references/hud/hud_concept_v1.png

## Core Principle
HUDは情報を全部見せるものではなく、戦闘の気持ちよさを邪魔しない最低限の情報装置。

## Screen
- スマホ縦画面
- 1画面完結
- スクロールなし
- 見下ろし型2.5Dプレイ画面

## Touch Controls
- HUD等の操作不可領域を除き、画面内どこでもドラッグで移動操作可能
- スティック表示位置は固定でもよい
- 表示上は「ここにスティックが表示されている」だけで、「左下限定操作」と誤解されないようにする

## Recommended HUD Layout
### Top Left
HPバー。骨格ライン、琥珀発光、DNA流動で表現。

### Top Right
時間、撃破数。FPSは設定ON時のみ。

### Bottom Center
EXPバー。レベルアップ直前に軽い発光。

### Bottom Right
必殺ボタン。大きめ、チャージ状態が分かる、押したくなる見た目。

### Skill Icons
右側縦並び。スキルアイコン、Lv、状態変化を表示。

### Evolution Analysis
進化ゲージではなく「適応解析UI」。  
例: 高速適応、流血適応、狩猟適応などを匂わせる。

## Enemy HP
- 雑魚敵: HP非表示
- エリート以上: HP表示
- ボス: 専用HP表示

## Drop Visibility
色で瞬時認識:
- 緑: 経験値
- 赤: 肉/回復
- 金: DNA
- 紫: 特殊進化素材

## Visual Direction
SFモニターではなく、生体HUD。骨、琥珀、DNA、傷、発光血管。
