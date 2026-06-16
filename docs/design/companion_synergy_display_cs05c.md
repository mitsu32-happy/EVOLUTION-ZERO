# Companion Synergy Display CS05c

## Purpose

CS05c reorganizes Companion Synergy display after CS05b play verification found that the persistent in-play HUD could overlap the boss HP bar.

## Adopted Approach

Adopted: remove the persistent in-play HUD.

Rejected for now: start-of-run notification.

Reason: the feature is easiest to understand before sortie, and the combat screen is already crowded. A short notification may be reconsidered later, but it is not needed for this pass.

## Play Screen

- Companion Synergy effects continue to work.
- No persistent Companion Synergy HUD is shown.
- No additional start notice is shown.
- This fully avoids overlap with boss HP, adaptation synergy, ZERO notices, branch UI, tutorials, and result UI.

## Home Companion Panel

The compact home companion panel no longer shows `発動中`.

Reason:

- The home dino is not always the final sortie dino.
- Showing active synergy on home can imply a final combat state before sortie selection.

The panel now stays limited to basic companion information and the change affordance.

## Companion Selection Modal

Owned companion cards show synergy information in a clearer pre-sortie format:

```text
共存シナジー: {相性恐竜}
効果: {shortLabel} / {発動中|未発動}
```

Disabled future synergies show only:

```text
相性: 未発見の恐竜
```

Future-update wording and unreleased dino names remain hidden in normal UI.

## Research Companion List

The research companion list uses the same information in compact form:

```text
共存:{相性恐竜} 効果:{shortLabel} / {発動中|未発動}
```

Disabled future synergies remain:

```text
相性:未発見の恐竜
```

## QA Notes

- Play screen: persistent Companion Synergy HUD removed.
- Home panel: no misleading active label.
- Companion selection: synergy partner and effect are readable before sortie.
- Research list: compact synergy partner and effect are visible.
- Disabled future synergies do not expose future dino names or future-update wording.
