# Companion Minor Tuning P08

## Scope

Hotfix branch: `hotfix/companion-minor-tuning-p08`

This pass only adjusts:

- `exp_chaser` in-play visual grounding.
- Companion egg drop probability.

No save schema, companion AI value, combat balance, version, or news changes are included.

## exp_chaser Display Position

### Issue

`exp_chaser` looked too detached from its shadow in PlayScene. The sprite is intentionally a floating EXP support companion, but its body sat too high relative to the shared companion shadow/glow.

### Change

- Added an `exp_chaser` animation profile `spriteOffsetY: 10`.
- Reduced `exp_chaser` bob amount from `4.8` to `3.2` and bob speed from `6.8` to `6.2`.
- Applied `spriteOffsetY` to the companion sprite/fallback only, leaving the shadow/glow origin and P04f fixed-size texture handling intact.

### Expected Result

`exp_chaser` still reads as floating, but the body stays closer to the shadow and no longer appears accidentally detached.

## Egg Drop Formula

Egg drop remains limited to one egg per run and is skipped while the player already has a pending/incubating egg.

Per defeated enemy:

```text
chance = min(
  0.002,
  0.00025 * difficultyMultiplier * modeMultiplier * firstDiscoveryMultiplier
)
```

### Difficulty Multipliers

| Difficulty | Multiplier |
| --- | ---: |
| NORMAL | 1.00 |
| HARD | 1.25 |
| EXPERT | 1.50 |

There is no separate difficulty-based DNA reward multiplier in the current run DNA calculation. DNA research has a separate permanent multiplier, but it is not difficulty-specific. For egg drops, this hotfix adds explicit difficulty coefficients so harder routes can naturally have a better egg chance.

### Mode Multipliers

| Mode | Multiplier |
| --- | ---: |
| STANDARD | 1.00 |
| ENDLESS | 1.35 |
| ZERO | 3.00 |

### First Discovery

If no companion is owned yet, the first-discovery multiplier is `1.15`. The old 18-defeat guaranteed first-egg pity was removed because it made egg acquisition too frequent for the requested ZERO target.

## Estimated Drop Rates

Estimated chance of at least one egg after N eligible enemy defeats:

```text
runChance = 1 - (1 - perEnemyChance) ^ N
```

| Route | Per Enemy | 100 defeats | 150 defeats | 180 defeats |
| --- | ---: | ---: | ---: | ---: |
| NORMAL STANDARD | 0.0250% | 2.5% | 3.7% | 4.4% |
| HARD STANDARD | 0.0313% | 3.1% | 4.6% | 5.5% |
| EXPERT STANDARD | 0.0375% | 3.7% | 5.5% | 6.5% |
| EXPERT ENDLESS | 0.0506% | 4.9% | 7.3% | 8.7% |
| ZERO | 0.1125% | 10.6% | 15.5% | 18.3% |

ZERO therefore lands around 5-10 runs per egg for typical late-run enemy counts. First discovery in ZERO is slightly higher (`0.1294%` per enemy), which keeps the introduction from feeling completely absent without returning to guaranteed drops.

## QA Notes

Required checks:

- `exp_chaser` PlayScene smoke with normal jungle route.
- Egg drop calculation reviewed for NORMAL/HARD/EXPERT/ZERO.
- Existing egg-pending/incubating and one-egg-per-run guards preserved.
- All-owned duplicate reward behavior unchanged because pickup collection still calls the existing save path.
- `node --check`, `git diff --check`, and `npm.cmd run build`.
