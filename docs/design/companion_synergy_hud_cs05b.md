# Companion Synergy HUD CS05b / CS05c

## CS05b Result

CS05b added a small in-play HUD indicator for active Companion Synergy.
Mobile play verification found that the panel could overlap or visually compete with the boss HP bar and the already dense combat HUD.

## CS05c Decision

CS05c removes the always-visible in-play Companion Synergy HUD.

Reason:

- Boss HP and combat notifications have higher priority during play.
- The combat screen already has adaptation synergy, ZERO notices, branch UI, tutorials, and result flows.
- Companion Synergy is a pre-sortie pairing decision, so it is clearer to show the information in companion selection and research screens.

## Current In-Play Rule

- Active Companion Synergy effects still apply during play.
- The PlayScene no longer renders a persistent Companion Synergy HUD panel.
- Non-synergy pairings, disabled future synergies, and no-companion states remain visually silent during play.
- No new animation, notification, save data, or balance changes were introduced.

## Pre-Sortie Display Rule

Companion Synergy should be explained in:

- Home companion selection modal.
- Research screen companion owned list.

Enabled synergy wording:

```text
共存シナジー: ヴェロキラプトル
効果: クリティカル率上昇 / 発動中
```

Disabled future synergy wording:

```text
相性: 未発見の恐竜
```

## HUD Collision Policy

Companion Synergy must not overlap or compete with:

- Boss HP bar.
- Adaptation Synergy HUD.
- ZERO phase notices.
- Level-up and evolution branch UI.
- Tutorial overlays.
- Result UI.

If an in-play indication is reconsidered later, it should be a short start-of-run notice with strict suppression rules rather than a persistent panel.
