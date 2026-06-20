# PF03 Adaptation Effect Performance QA

## Scope

PF03 used the PF02 counters to check whether adaptation-skill effects fall back to simple Graphics or get skipped under short high-load runs.

This pass did not change adaptation skill balance, difficulty, load-shedding thresholds, effect visuals, assets, version, or update news.

Branch:

- `feature/adaptation-effect-performance-v1`

## High-Load QA

All checks used:

- `debugPerformance=1`
- `debugMaxSpawn=1`
- `debugAdaptationSkills=1`
- `debugAdaptationAllLevel=3`
- `debugInvincible=1`

| Scenario | Companion | Result |
| --- | --- | --- |
| ZERO volcano expert | `exp_chaser` Lv5 | No stop screen, console error/warn 0 |
| ZERO volcano expert | none | No stop screen, console error/warn 0 |
| ENDLESS jungle expert | `exp_chaser` Lv5 | No stop screen, console error/warn 0 |
| ENDLESS jungle expert | none | No stop screen, console error/warn 0 |

## PF02 Counter Results

Observed `debugPerformance` overlay:

- `adaptFx tex ... / gfx 0 / skip 0 / miss 0`
- `adaptTop -`

Across the short PF03 browser checks:

- `graphicsFallbackCount`: 0 observed
- `skippedEffectCount`: 0 observed
- `missingTextureCount`: 0 observed
- `loadSheddingSkippedCount`: 0 observed
- Texture-based effects stayed visible during the sampled high-load windows.

## Cause Assessment

No runtime evidence of adaptation effect fallback or skip was reproduced in the PF03 short high-load checks.

The PF01 risk list remains structurally valid because these skills can create multiple visuals or delayed triggers:

- `sense_spike`
- `burst_fang`
- `gale_blade`
- `accelerated_blades`
- `flame_breath`

However, PF02 counters did not identify an active offender in this pass.

## Code Changes

No Part A code changes were made.

Reason:

- Missing texture count stayed at 0.
- Graphics fallback count stayed at 0.
- Skip count stayed at 0.
- Changing visuals or load shedding without a reproduced offender would risk unnecessary quality or balance changes.

## Remaining Risk

The QA window was intentionally short. Longer ZERO / ENDLESS soak runs may still reveal a top offender when:

- enemy count stays high for several minutes,
- damage text and critical text overlap heavily,
- delayed mine/trap effects accumulate,
- Companion effects overlap with adaptation effects.

## PF04 Recommendation

If fallback/skip reappears, run a longer soak and prioritize by:

1. `missingTextureCount`
2. `graphicsFallbackCount`
3. `loadSheddingSkippedCount`
4. `newEffectCreateCount` with low `pooledEffectReuseCount`

Only then replace the identified fallback path with low-cost texture effects or shorter-duration texture effects.
