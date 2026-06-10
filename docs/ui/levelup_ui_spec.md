# Level Up / Evolution Presentation UI Spec

## MVP-A13 Level-up Tutorial and Card Text

- First level-up can show a short tutorial that explains card categories and evolution-condition adaptations.
- Card categories are displayed in-card:
  - `種別: 適応技`
  - `種別: 能力強化`
  - `種別: 報酬`
- Adaptation skill cards show power, range, cooldown, and `進化条件に影響`.
- Stat upgrade cards show a short effect line such as HP or attack increase.
- Fallback reward cards show immediate reward values such as DNA or HP recovery.
- The card copy prioritizes quick mobile readability over lore terms.

## MVP-A10 Evolution Unlock Presentation

- Evolution unlock presentation now prefers A10 generated assets:
  - `public/assets/ui/evolution/evolution_unlock_panel_a10.png`
  - `public/assets/ui/evolution/evolution_unlock_frame_a10.png`
  - `public/assets/ui/evolution/evolution_unlock_glow_a10.png`
- The evolution destination portrait is displayed in the generated portrait frame whenever a branch portrait exists.
- The runtime supports branch-specific portraits for velociraptor, triceratops, tyrannosaurus, and spinosaurus speed/hunting/attack/zero routes.
- Text remains runtime-rendered so the evolution name and type/message stay localized and legible.
- Existing evolution panel assets remain fallback or historical assets only.

## MVP-A10b Branch Reaction Notice

- The level-up branch reaction chip now prefers generated A10b assets:
  - `public/assets/ui/selection/evolution_reaction_panel_a10b.png`
  - `public/assets/ui/selection/evolution_reaction_glow_a10b.png`
  - `public/assets/ui/selection/evolution_reaction_chip_a10b.png`
- The `分岐反応あり` text remains runtime-rendered over the generated panel.
- The old `analysis_warning_chip.png` remains a historical/fallback asset only.

## MVP-A10c Level-up Readability and Stat Cards

- The branch reaction text (`分岐反応あり` / strong reaction / search state) prioritizes readability over glow: lighter text, heavier weight, and dark drop shadow over the A10b reaction panel.
- Tagless stat upgrade cards now prefer generated A10c assets by stat type:
  - `levelup_stat_card_hp_a10c.png` / `levelup_stat_icon_hp_a10c.png`
  - `levelup_stat_card_attack_a10c.png` / `levelup_stat_icon_attack_a10c.png`
  - `levelup_stat_card_speed_a10c.png` / `levelup_stat_icon_speed_a10c.png`
  - `levelup_stat_card_rate_a10c.png` / `levelup_stat_icon_rate_a10c.png`
  - `levelup_stat_card_pickup_a10c.png` / `levelup_stat_icon_pickup_a10c.png`
  - `levelup_stat_card_common_a10c.png` as fallback.
- Player-facing stat wording is simplified: HP増加, 攻撃力増加, 移動速度増加, 回収範囲増加; descriptions are short and direct.
- Text remains code-rendered; the generated assets contain no letters.
## MVP-A10d Stat Card Icon Policy

- A10c stat card art already contains embedded left-side icons.
- Normal tagless stat upgrade cards no longer overlay separate code-side stat icons, preventing double icons and icon drift.
- Separate `levelup_stat_icon_*_a10c.png` assets remain available for future/backup use but are not used on the normal stat card route.
- Stat cards display a clear `STATUS / 能力強化` label and shift text right to avoid the embedded icon area.
- Fallback reward cards and adaptation skill cards keep their separate icon overlays because their card art does not include embedded stat icons.
## MVP-A10d.1 Stat Card Tone

- Stat upgrade cards now prefer A10d.1 teal/green variants based on the HP card tone:
  - `levelup_stat_card_common_a10d1.png`
  - `levelup_stat_card_hp_a10d1.png`
  - `levelup_stat_card_attack_a10d1.png`
  - `levelup_stat_card_speed_a10d1.png`
  - `levelup_stat_card_rate_a10d1.png`
  - `levelup_stat_card_pickup_a10d1.png`
- The embedded icon policy is unchanged; normal stat cards do not receive a separate code-side icon overlay.
- The goal is to make stat upgrades read as one STATUS family and separate them from adaptation skill cards by hue/tone.

## MVP-A13b Level-up Tutorial QA

- Level-up tutorial can be forced in development builds with `debugTutorial=levelup`, `debugForceLevelup=1`, or `debugLevelupTutorial=1`.
- The overlay spotlights the card area and then the adaptation-card area.
- Card copy continues to distinguish `種別: 適応技`, `種別: 能力強化`, and `種別: 報酬`.
- Adaptation cards show power, range, cooldown, and whether the card affects evolution conditions.

## MVP-A13c First Level-up Ordering

- On the first Level Up tutorial route, an available adaptation skill card is moved to the top slot.
- The ordering assist applies only to the first tutorial Level Up / debug-forced Level Up route.
- Later Level Up rolls return to normal candidate ordering.
- The tutorial copy now explains adaptation skills, stat upgrades, evolution conditions, power/range, and recast timing.

## MVP-A15 Adaptation Synergy Card Copy

- Adaptation skill cards show the same-type synergy progress in the type line, such as `高速タイプ 1/2`.
- The bottom hint line explains the next threshold, such as `あと1つで高速シナジーⅠ`.
- At 2 same-type pickups the card switches to tier II guidance; at 3 pickups it shows the tier II active state.
- Power/range/recast text remains visible so synergy guidance does not replace the immediate skill comparison.

## MVP-A15.4 能力強化カード

- 能力強化カードの基礎値を上方修正し、1回選んだ時の伸びを分かりやすくした。
- `適応強化理論` 研究済みの場合は、カード基礎値に倍率を掛けた最終値を表示する。
- 表示値と実際の効果は `getStatUpgradeTheoryValue` を共通参照し、カード表示だけが強く見える状態を避ける。
- 対象:
  - `HP増加`: HP増加量を表示
  - `攻撃力増加`: 攻撃力増加量と適応技ダメージ補正を表示
  - `移動速度増加`: 移動速度増加量を表示
  - `回収範囲増加`: 回収範囲増加率を表示
- 研究補正がある場合は `研究補正 x1.1` などの倍率表示を添える。
