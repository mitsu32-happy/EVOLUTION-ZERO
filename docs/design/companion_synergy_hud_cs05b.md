# Companion Synergy HUD CS05b

## Purpose

CS05b adds an in-play HUD indicator for active Companion Synergy. The goal is to make an active player dino + companion pairing recognizable during combat without changing synergy effects, save data, or balance values.

## Display Content

When an enabled synergy is active, the PlayScene HUD shows:

```text
共存: {synergyName}
{shortLabel}
```

Examples:

- `共存: 王牙共鳴` / `ボス特化`
- `共存: 連爪追撃` / `連撃`
- `共存: 水流連携` / `水弾支援`
- `共存: 装甲共鳴` / `防御補助`

The HUD uses the existing synergy data already resolved by PlayScene (`activeCompanionSynergy`), so it does not add per-frame lookup cost.

## Visibility Rules

The Companion Synergy HUD is visible only when all of the following are true:

- An enabled Companion Synergy is active.
- A companion is set.
- The run is not paused.
- The run is not on result / game over.
- Level-up card UI is not active.
- Evolution BRANCH / ready UI is not active.
- Evolution feedback is not active.
- Gamepad / adaptation synergy notice is not active.
- ZERO phase notice is not active.

It is hidden for:

- Non-synergy pairings.
- Disabled future synergy definitions.
- No companion.
- UI-heavy moments where it could overlap or distract.

## Placement

Default placement:

- Left side below the top HUD area.
- `x = 16`
- `y = 126` when no adaptation synergy HUD is visible.
- `y = 160` when the adaptation synergy HUD is visible.

Branch-avoidance placement:

- When an evolution branch is selected, the HUD moves to the upper-right side.
- `x = screen width - panel width - 18`
- `y = 168`

This keeps it away from:

- Boss HP bar.
- Main HUD meters.
- Adaptation Synergy HUD.
- ZERO phase notice.
- Level-up / evolution UI.

## Visual Style

- Small dark sci-fi panel.
- Cyan border with subtle amber inner line.
- No flashing or pulsing.
- Text is compact and readable on mobile width.
- Uses Graphics and Text only; no new image assets.

## QA Results

Initial CS05b QA should confirm:

- Active synergy pairing shows the HUD.
- Non-synergy pairing hides the HUD.
- No companion hides the HUD.
- Level-up / evolution / ZERO notices hide the HUD.
- Smartphone-width viewport remains readable.
- Runtime console error/warn remains 0.

## Remaining Work

- Run visual QA on actual mobile device before main release.
- If the panel feels crowded during long ZERO play, consider moving it into a future shared status-chip row.
