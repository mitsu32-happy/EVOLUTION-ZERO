# MVP-P05c Companion Movement Smoothing

## Purpose

P05c smooths target pursuit movement added in P05b.

P05b used target-position interpolation, which could make companions appear to
snap or rush suddenly when a target was acquired. P05c changes movement to a
velocity-based model with acceleration, deceleration, arrival radius, and
role-specific speed profiles.

No save data, damage, healing, EXP, pickup values, or sprite sheet references
are changed.

## Movement Model

Each active companion now keeps a runtime velocity vector:

```text
velocity = { x, y }
```

Every frame:

1. Choose the desired target from P05b role targeting.
2. Measure distance from the current companion position.
3. Convert that target into a desired velocity.
4. Blend current velocity toward desired velocity using acceleration or deceleration.
5. Move by `velocity * delta`.
6. Clamp to the level-based player radius and visible screen.

This avoids the visual snap caused by directly lerping position toward a newly
acquired target.

## Tuning Constants

Global defaults:

| Constant | Value | Purpose |
| --- | ---: | --- |
| `COMPANION_DEFAULT_ARRIVAL_RADIUS` | `24` | Default stop distance near a target. |
| `COMPANION_DEFAULT_SLOW_RADIUS` | `96` | Default distance where slowing begins. |

The P05b constants remain active:

- `COMPANION_BASE_FOLLOW_RADIUS`
- `COMPANION_RADIUS_PER_LEVEL`
- `COMPANION_MAX_FOLLOW_RADIUS`
- `COMPANION_MIN_DISTANCE_FROM_PLAYER`
- `COMPANION_SCREEN_MARGIN`
- `COMPANION_FACING_DEAD_ZONE`

## Per-Companion Speed Profiles

| Companion | Feel | Max speed | Pursuit speed |
| --- | --- | ---: | ---: |
| `raptorling` | Fast small attacker | `224` | `246` |
| `spino_pup` | Heavy water attacker | `174` | `196` |
| `medic_saur` | Gentle support | `168` | `178` |
| `ptera_chick` | Smooth flying support | `218` | `236` |
| `tricera_calf` | Heavy guard | `154` | `172` |
| `para_juvenile` | Medium pickup helper | `178` | `194` |
| `stego_calf` | Heavy area support | `158` | `176` |
| `rex_hatchling` | Heavy but forceful boss attacker | `176` | `204` |
| `compy_pack` | Fast swarm | `236` | `258` |
| `exp_chaser` | Smooth floating EXP helper | `206` | `226` |

Level adds a small movement speed multiplier:

```text
speedMultiplier = 1 + (level - 1) * 0.025
```

This supports growth feel without changing effect strength.

## State Switching

Animation state now follows movement more deliberately:

- `idle`: low speed and near target
- `move`: pursuit, return, wander, or any meaningful movement
- `action`: only during the stronger action phase

This prevents the companion from sliding across the field while already showing
only action frames. It also keeps target pursuit and return motion visibly in
the `move` row.

## Target Arrival

Companions do not try to overlap the exact target point forever.

- Arrival radius stops acceleration near the target.
- Slow radius reduces speed as the companion approaches.
- Movement clamp still prevents leaving the player-level radius or visible screen.
- After an action completes, `companionReturnTimer` sends the companion back to
  wander/orbit before it selects another target.

## Facing

Facing continues to use the P05b rule, but now prefers the final displayed
movement after radius and screen clamping:

- positive displayed X movement: right-facing
- negative displayed X movement: flipped left
- tiny displayed movement falls back to velocity
- tiny velocity under the dead zone keeps previous facing
- active action target may temporarily override facing toward the target only
  when the companion is not visibly being pulled by follow-radius correction

P04f fixed-size rendering remains unchanged. Only the sign of `scale.x` changes.

When the player moves and the companion is pulled back inside its allowed
radius, the clamp correction is reflected back into the companion velocity for
that frame. This prevents the companion from keeping a stale left-facing
velocity while visibly being carried to the right by the follow radius.

## Debug

`debugCompanion=1` now includes:

- movement state
- target type
- speed
- distance to target
- movement radius
- facing

Example:

```text
pursuit/enemy sp142 d74
cd 0.8/0.0 fx 1 r202 face-1
```

## Remaining Work

- Real-device tuning may still be needed for how eager companions are to pursue.
- If heavy companions feel too slow after device QA, adjust `pursuitSpeed`
  before changing combat values.
- If fast companions feel too jumpy, lower acceleration rather than lowering
  max speed.
