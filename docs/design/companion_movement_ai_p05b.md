# MVP-P05b Companion Movement AI

## Purpose

P05b improves in-play companion movement after the P04j sprite polish.

Goals:

- companions move freely around the player instead of staying in a fixed offset
- companions approach role-specific targets when useful
- companions flip horizontally when moving left
- companion movement radius grows with companion level

This pass does not change save data, damage, healing, pickup value, EXP value, or
companion upgrade costs.

## Constants

Runtime constants are defined in `src/scenes/play_scene.js`.

| Constant | Value | Purpose |
| --- | ---: | --- |
| `COMPANION_BASE_FOLLOW_RADIUS` | `82` | Level 1 movement radius around the player. |
| `COMPANION_RADIUS_PER_LEVEL` | `30` | Added radius per companion level. |
| `COMPANION_MAX_FOLLOW_RADIUS` | `230` | Hard movement radius cap. |
| `COMPANION_MIN_DISTANCE_FROM_PLAYER` | `48` | Keeps the companion from sitting on top of the player. |
| `COMPANION_SCREEN_MARGIN` | `42` | Keeps the companion inside the visible play area. |
| `COMPANION_FACING_DEAD_ZONE` | `5.5` | Prevents jittery left/right flipping on tiny movement. |

## Radius Formula

```text
rawRadius = baseFollowRadius + (level - 1) * radiusPerLevel
visibleLimit = min(maxFollowRadius, visibleWidth / 2 - screenMargin, visibleHeight / 2 - screenMargin)
movementRadius = clamp(rawRadius, minDistanceFromPlayer, visibleLimit)
```

This means:

- Level 1 stays close to the player.
- Mid levels can reach nearby threats and pickups more naturally.
- High levels can range farther, but never past the visible screen clamp or the hard max.

## Screen Clamp

Every desired movement point is clamped in two steps:

1. Clamp to the level-based radius around the player.
2. Clamp to the visible camera rectangle with `screenMargin`.
3. Clamp to the level-based radius again.

This prevents high-level companions from leaving the screen or getting dragged
outside the allowed radius by camera edge cases.

## Wander Movement

When no target is useful, the companion uses a soft orbit/wander target:

- the path is centered on the player
- orbit radius is a fraction of the current movement radius
- ranged and EXP companions float slightly higher
- heal and defense companions stay closer to the player
- compy pack moves faster around the orbit

## Role Targeting

Targeting affects only the companion movement target. Existing action values and
cooldowns remain unchanged.

| Type | Movement target |
| --- | --- |
| `attack` | Nearest enemy inside a search radius. |
| `area` | Nearest enemy, allowing it to move toward clustered threats. |
| `ranged` | A firing position between player and enemy, without hugging the target. |
| `swarm` | Lowest HP nearby enemy. |
| `boss` | Boss first, then nearest enemy fallback. |
| `synergy` | Nearby enemy group anchor. |
| `heal` | Player-adjacent position. |
| `defense` | Player-front guard position. |
| `pickup` | Nearby non-egg pickup. |
| `exp` | Nearby EXP pickup. |

If a target is outside the companion's current movement radius, the companion
moves only as far as its level allows. Higher levels therefore feel more capable
without changing the underlying effect values.

## Return Behavior

When an action finishes, the companion gets a short return window:

- `companionReturnTimer = 0.55`
- target chasing is paused during the return window
- the companion resumes wander/orbit before selecting another target

This prevents companions from visually sticking to enemies after an attack.

## Facing

Companion sprite sheets are right-facing.

Runtime facing rule:

- moving right: normal direction
- moving left: horizontal flip
- tiny x movement under `COMPANION_FACING_DEAD_ZONE` keeps the previous facing
- active action target can temporarily override facing toward the target

P04f fixed-size texture rendering remains intact:

- frame texture changes still reapply fixed width/height
- anchor remains fixed
- only `scale.x` sign changes for facing

## Debug

`debugCompanion=1` now shows:

- active radius as `r###`
- current facing as `face1` or `face-1`
- position, state, cooldowns, texture size, display size, scale, and anchor

`debugCompanionLevel=5` can be combined with `debugCompanionId` to verify
high-level movement reach without changing the saved companion level.

## Remaining Work

- Device QA should judge whether target chasing feels natural in dense combat.
- If companions feel too eager to chase enemies, add type-specific target
  eagerness timers without changing effect strength.
- Future UI could mention that higher companion levels improve movement reach.
