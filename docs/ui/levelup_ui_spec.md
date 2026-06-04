# Level Up / Evolution Presentation UI Spec

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
