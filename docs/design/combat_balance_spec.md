# Combat Balance Spec

## MVP-161 Playfeel Polish

### Adaptation Skills

- Adaptation skills should feel useful before the player reaches a full build.
- MVP-161 increases base damage and slightly lowers cooldowns across the current adaptation skill set.
- The intent is stronger mob clearing and clearer feedback without replacing ultimate skills.
- Boss damage remains indirectly constrained because adaptation skills still use their existing target limits, area limits, cooldowns, and boss/encounter pacing.

### Pickup Feedback

- EXP and HP pickups show short floating feedback text near the pickup location.
- HP recovery uses green burst feedback.
- Pickup text is considered part of the combat-number layer and follows the Options `ダメージ` setting.
- Mass pickup feedback should remain short-lived and should not block player or enemy readability.

### Warning Guides

- Boss hazards and stage gimmicks use translucent warning guides before active damage begins.
- Warning phase has no damage; active phase applies the real hitbox.
- Guides must match the same line, circle, or multi-hitbox shape used by the active damage check.
- Options `警告ガイド` can hide the guide layer.
- Options `視認性` increases guide alpha for readability.

### Boss Pattern Readability

- Boss hazard attacks use a short recovery gate after spawning a hazard.
- Normal bosses generally allow one active hazard pattern at a time.
- ZERO final bosses may allow limited overlap, but should avoid unavoidable stacked attacks.
- Summons and hazards should not grant ZERO rewards until the final boss is defeated.

### Stage Gimmick Pressure

- Gimmicks are accents. Enemy movement, enemy density, and boss patterns remain the main game pressure.
- NORMAL/HARD gimmick cadence should leave clear movement routes.
- EXPERT/ZERO may be stricter, but warnings must remain readable and simultaneous gimmicks should be capped.
