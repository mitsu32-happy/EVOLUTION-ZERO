# Asset Pipeline v0.1

## Core Principle
単体品質より、量産可能な高品質を優先する。

## References vs Assets
- references: 実装参考資料
- assets: ゲーム実装用素材

## Recommended Folders
```text
references/
├ hud/
├ ui/
├ effects/
├ dinos/
├ stages/
└ logos/

assets/
├ dinos/
├ enemies/
├ bosses/
├ ui/
├ effects/
├ maps/
├ audio/
├ icons/
└ fonts/
```

## Dinosaur Assets
2.5D斜め見下ろし固定。  
角度は約45度を基準に統一する。

## Dinosaur Structure
進化差分を作りやすくするため、部位思想を持つ。
- body
- head
- tail
- claw
- effect

## Sprite States
- idle
- move
- attack
- evolution
- death
- ultimate

## UI Assets
共通フレーム化:
- panel_base
- button_base
- warning_base
- dna_frame

## Effects
加算発光前提。  
敵が見えなくならないことを最優先。

## Map Assets
タイル化推奨。
- ground
- rock
- bone
- plant
- fog
- damage_area

## Naming
小文字 + snake_case。

Good:
- raptor_idle_v1.png
- thunder_raptor_move_v1.png
- hud_concept_v1.png

Bad:
- final_final_v2.png
