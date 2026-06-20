# PF04b adaptation effect performance release

## Merge content

Branch `feature/adaptation-effect-performance-v1` was merged into `main` with `--no-ff`.

Included work:

- PF01 adaptation effect performance investigation.
- PF02 fallback / skip / missing texture counters.
- PF03 high-load QA and new six dino companion synergy activation.
- PF04 iPhone whiteout / heat mitigation, whiteout dump additions, codex text fix, and normal attack trigger review.
- PF04b normal attack motion guard and enemy visual budget.

## Version

- Previous: `0.11.0`
- New: `0.11.1`
- Build: `adaptation-effect-performance-v1`

## Update news

Title:

```text
パフォーマンス改善を行いました
```

Summary:

- High-load processing was reviewed to improve stability when many enemies appear.
- Overlapped/offscreen enemy rendering is reduced while internal enemy behavior remains active.
- Fixed normal attacks being treated as triggered when no valid hit target exists.
- Added adaptation effect debug information.

## High-load measures

- Damage / critical text pressure under thermal or load pressure.
- Visible/offscreen enemy counts in performance and whiteout dumps.
- Enemy visual budget with overlap culling, offscreen render culling, and offscreen animation throttling.
- Adaptation effects remain texture-first; simple Graphics fallback was not used as the mitigation.

## Normal attack fix

Dino-specific normal attacks now validate hit-shape candidates before cooldown consumption. If there is no hit candidate, cooldown, attack animation, SE, effect, and damage do not fire.

## Merge result

- Merge: successful.
- Conflict: none.

## Push result

To be recorded after `origin/main` push.

## Remaining issues

- iPhone 15 field confirmation remains useful because the whiteout report does not show the crash/stop screen.
- Compsognathus miniPack remains design-only.
- Deeper target-scan / collision-pass optimization is a future PF task.

## Next update plan

1. 4th stage ZERO implementation.
2. New stage addition.
3. Compsognathus miniPack.
4. Achievement feature.
