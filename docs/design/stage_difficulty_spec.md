# EVOLUTION ZERO Stage And Difficulty Spec

## MVP-A14.1 Difficulty Scaling Addendum

- NORMAL opening pressure remains the readability baseline.
- HARD and EXPERT now gain substantially more enemy density after mid game through elapsed cap pressure and shorter late spawn intervals.
- ZERO uses a higher enemy level baseline, stronger enemy cap growth, and a much larger final-phase density ramp.
- ENDLESS soft cap and late phases were raised so 5-minute and 10-minute equivalent checks do not flatten out.
- Bosses gain stronger HP/damage scaling plus wider/faster warning attacks on high difficulties.
- EXP growth is slowed after the opening so the increased enemy count does not create runaway level gain.

## Purpose

This document fixes the stage, difficulty, clear condition, unlock, reward, and boss expansion direction before stage implementation work.

Stages are evolution environments, not only background skins. Difficulty controls danger, enemy composition, clear goals, and reward pressure.

## Difficulty List

| Mode | Role | Clear Condition | Unlock |
| --- | --- | --- | --- |
| NORMAL | Base stage challenge | Defeat the stage boss | Initially available |
| HARD | More density and stronger variants | Defeat the stage boss | Clear NORMAL on that stage |
| EXPERT | High pressure, more elites/mutants | Defeat the stage boss | Clear HARD on that stage |
| ENDLESS | Survival score challenge | Ends when HP reaches 0 or player exits | Clear EXPERT on that stage |
| ZERO | Final high-difficulty challenge | Defeat normal boss, second boss, and final boss | Clear EXPERT on that stage |

ZERO is difficulty-unlocked. It is not unlocked by DNA research.

## Clear Result Rules

- NORMAL/HARD/EXPERT boss defeated: `runResult.type = 'clear'`, `reason = 'boss'`.
- HP reaches 0: `runResult.type = 'gameover'`, `reason = 'hp0'`.
- Pause -> sortie end: `runResult.type = 'gameover'`, `reason = 'abandoned'`.
- ENDLESS: result is normally `RESULT` or `GAME OVER` depending on future presentation, but does not count as stage clear.
- ZERO final boss defeated: `runResult.type = 'zeroClear'`, `reason = 'zero'`.

Runtime should not infer stage clear from `defeatedBosses` alone. `defeatedBosses` is a stat; `runResult` is the result authority.

## Stage Clear Flow

NORMAL/HARD/EXPERT:

1. Run starts.
2. Boss appears at stage timing.
3. Boss defeat triggers stage clear.
4. Result screen shows `CLEAR`.
5. First-clear rewards are evaluated.
6. Next difficulty unlock is saved.

ZERO:

1. Run starts with high-density baseline.
2. Normal boss appears.
3. Second boss appears after the first boss or timer threshold.
4. Final boss appears after the second boss.
5. Final boss defeat triggers `ZERO RESULT`.
6. ZERO rewards are evaluated, including possible new evolution route discovery.

ENDLESS:

1. Bosses continue to spawn on interval.
2. Defeating bosses gives run rewards/score/DNA as appropriate.
3. No normal stage-clear result is triggered by a single boss kill.

## Difficulty Tuning Direction

NORMAL:

- Standard enemy density.
- Mostly swarm enemies.
- Special attacks are rare or absent.
- Designed for first clear and branch learning.

HARD:

- Slightly higher density.
- More fast/tank variants.
- Boss has more HP and stronger pressure.
- First special enemy behavior may appear late in the run.

EXPERT:

- High density.
- More elite/mutant combinations.
- Stage gimmicks can become more visible.
- Boss may gain simple patterns.

ENDLESS:

- Scaling enemy density and durability.
- Bosses repeat.
- Score and survival record focus.
- No first-clear progression gate after unlock.

ZERO:

- Endgame pressure.
- Designed around body enhancement and learned adaptation builds.
- Multiple bosses.
- Unique reward layer.

## Stage Enemy Expansion

Each stage should eventually have:

- One common stage enemy variant.
- One elite/stalker variant.
- One tank/mutant variant.
- One stage boss.

Special attacks should be introduced gradually:

- NORMAL: mostly movement and contact threat.
- HARD: limited special behavior.
- EXPERT: clear special patterns.
- ZERO: layered patterns and multi-boss pressure.

Stage identity examples:

- Jungle: swarm pressure, stealthy hunters, speed/hunting affinity.
- Volcano: heavy enemies, burn hazards, attack affinity.
- Swamp: poison, slowing zones, toxic/defense future affinity.
- Ruins: mixed variants, technology/ancient mutation, crystal/thunder future affinity.

## Reward Direction

Normal run rewards:

- DNA
- Score / records
- First-clear unlocks
- Titles / title frames
- New evolution route discovery from special reward rules

ResearchPt sources:

- Daily missions
- Analysis conversion
- Future explicit special rewards only

Normal play result should not grant ResearchPt by boss, difficulty, survival time, or score.

## Unlock Direction

Per stage:

- NORMAL available first.
- NORMAL clear unlocks HARD.
- HARD clear unlocks EXPERT.
- EXPERT clear unlocks ENDLESS and ZERO.

Global shortcuts may be considered later, but early MVP should keep unlock rules understandable and stage-local.

Save compatibility:

- Store unlocks as optional/default fields.
- Missing unlock data means only normal available.
- Do not break old saves.

## Stage Select UI Notes

- ZERO should remain visibly locked until EXPERT clear.
- Lock reason should mention difficulty clear, not DNA research.
- ZERO copy should imply danger and final challenge, not shop/research unlock.
- ENDLESS should be positioned as survival challenge, not stage clear.

## Next MVP Candidates

- MVP-132: add stage clear state hooks for boss defeat and result `CLEAR` routing.
- MVP-133: save per-stage difficulty clears and update stage select locks.
- MVP-134: stage gimmick / drop item / EXP pickup asset groundwork.
- MVP-135: stage gimmick runtime prototype for volcano/swamp/ruins.
- MVP-136: ZERO multi-boss flow prototype.

## MVP-131 Fixed Difficulty Contract

The following rules are fixed for the stage implementation phase:

| Difficulty | Clear Condition | Primary Purpose | Unlock Rule |
| --- | --- | --- | --- |
| NORMAL | Defeat stage boss | first clear and stage learning | initially available |
| HARD | Defeat stage boss | denser enemies and early special pressure | NORMAL clear on the same stage |
| EXPERT | Defeat stage boss | high pressure and variant-heavy play | HARD clear on the same stage |
| ENDLESS | no boss-clear finish; HP0 or exit ends run | score / survival record | EXPERT clear on the same stage |
| ZERO | defeat normal boss, second boss, and final boss | endgame route and special reward | EXPERT clear on the same stage |

ZERO must remain difficulty-unlocked. Do not reintroduce ZERO as a DNA research purchase.

## MVP-131 Difficulty Balance Targets

Initial tuning multipliers:

| Difficulty | Enemy HP | Enemy Damage | Enemy Speed | Density | Elite / Mutant / Apex | Boss Pressure |
| --- | --- | --- | --- | --- | --- | --- |
| NORMAL | 1.0x | 1.0x | 1.0x | base | low | simple boss kit |
| HARD | 1.35x | 1.2x | 1.08x | +15% | moderate | more HP and shorter rests |
| EXPERT | 1.8x | 1.45x | 1.15x | +35% | high | adds extra pattern layer |
| ENDLESS | time-scaling | time-scaling | time-scaling | time-scaling | expanding pool | repeating / scaling bosses |
| ZERO | high baseline | high baseline | high baseline | high but readable | full pool | three-boss route |

Special attacks are gated by difficulty:

- NORMAL: swarm / fast / tank and mostly contact danger.
- HARD: limited shooter, charger, or hazard behavior late in the run.
- EXPERT: shooter, poison, charger, bomber, elite, and mutant patterns become part of the main composition.
- ZERO: layered stage hazards and multi-boss pressure, tuned around body enhancement, adaptation skills, and discovered evolution routes.

## MVP-131 Reward And Unlock Rules

- First clear rewards are evaluated only on NORMAL/HARD/EXPERT/ZERO clear.
- ENDLESS gives score/survival records but does not count as a normal stage clear.
- ZERO first clear may discover a new evolution route and award a deluxe title frame.
- ResearchPt remains outside normal play result payouts. Use daily missions, analysis conversion, and future explicit special rewards.

## MVP-132 Save-Connected Progress

`stageProgress` is the authoritative save structure for stage clears and difficulty locks.

```js
stageProgress: {
  [stageId]: {
    normal: { cleared, firstClearedAt, bestTime, bestClearTime, bestScore, lastPlayedAt },
    hard: { cleared, firstClearedAt, bestTime, bestClearTime, bestScore, lastPlayedAt },
    expert: { cleared, firstClearedAt, bestTime, bestClearTime, bestScore, lastPlayedAt },
    endless: { cleared: false, bestTime, bestScore, lastPlayedAt },
    zero: { cleared, firstClearedAt, bestTime, bestClearTime, bestScore, lastPlayedAt }
  }
}
```

Compatibility:

- Missing `stageProgress` is normalized to all stages with only NORMAL unlocked.
- ENDLESS updates best score/time but never marks `cleared`.
- NORMAL/HARD/EXPERT mark `cleared` only when `runResult.type === 'clear'`.
- ZERO is reserved for `runResult.type === 'zeroClear'`.

Unlocks:

- NORMAL is always selectable.
- HARD unlocks from the same-stage NORMAL clear.
- EXPERT unlocks from the same-stage HARD clear.
- ENDLESS and ZERO unlock from the same-stage EXPERT clear.
- ZERO remains difficulty-unlocked and must not be tied to DNA research.

Debug helpers:

- `debugStageClear=<difficulty>` marks one difficulty clear for the current or `debugStage=<stageId>` stage.
- `debugUnlockDifficulties=1` marks NORMAL/HARD/EXPERT clear for all stages.
- `debugStageProgressReset=1` resets the normalized stage progress structure.

## MVP-133 First-Clear Reward Hook

- NORMAL / HARD / EXPERT first clear now calls the title reward layer after `stageProgress` is updated.
- ENDLESS remains record-only and does not grant a title in MVP-133.
- ZERO keeps the save/reward structure but the actual deluxe ZERO title route is reserved for a later MVP.
- First-clear reward checks must use the same-stage difficulty result, so clearing `jungle.normal` cannot unlock or grant rewards for another stage.
- Stage/difficulty clear state remains the authority; title rewards are a cosmetic layer on top of `stageProgress`.

## MVP-134 Gimmick Difficulty Scaling

Stage gimmicks scale by difficulty, but jungle remains the baseline no-gimmick stage.

Recommended intensity:

- NORMAL: tutorial-safe. Gimmicks are rare, small, and mostly visual warnings before damage.
- HARD: moderate. Hazard duration and frequency increase, but safe paths remain obvious.
- EXPERT: high. Multiple hazard types may overlap, but telegraphs must remain readable.
- ENDLESS: time-scaling. Gimmick frequency can increase with survival time.
- ZERO: endgame. Stage gimmicks can combine with boss pressure, but must not create unavoidable damage.

Gimmick damage and slow effects should be tuned separately from enemy scaling. A stage gimmick should create movement decisions, not replace enemy/boss pressure.

MVP-134 connected pickups:

- EXP crystal visuals use generated pickup PNGs.
- HP recovery meat can drop at low chance when the player is missing HP.
- Magnet core and DNA cluster remain future pickup candidates.

## MVP-135 Runtime Gimmick Settings

The first runtime pass keeps stage gimmicks readable and difficulty-scaled.

| Stage | Difficulty | Interval | Warning | Active | Damage | Size / Count |
| --- | --- | --- | --- | --- | --- | --- |
| jungle | all | none | none | none | none | no gimmick |
| volcano | NORMAL | 22s | 1.5s | 1.15s | 8 | radius 86, count 1 |
| volcano | HARD | 18s | 1.3s | 1.25s | 12 | radius 102, count 1 |
| volcano | EXPERT | 14s | 1.1s | 1.35s | 16 | radius 116, count 2 |
| swamp | NORMAL | 24s | 1.45s | 2.2s | 5 | radius 90, slow 0.36 |
| swamp | HARD | 20s | 1.25s | 2.8s | 7 | radius 105, slow 0.30 |
| swamp | EXPERT | 16s | 1.1s | 3.2s | 9 | radius 120, count 2, slow 0.25 |
| ruins | NORMAL | 25s | 1.55s | 0.9s | 8 | radius 92 / laser width 42 |
| ruins | HARD | 20s | 1.25s | 1.0s | 12 | radius 105 / laser width 50 |
| ruins | EXPERT | 15s | 1.0s | 1.1s | 15 | radius 118 / laser width 56, count 2 |

`debugGimmickFast=1` shortens the interval to roughly 2.2-4 seconds for QA only. These values are provisional and should be tuned after boss and enemy stage identities are playable.

## MVP-136 Jungle Difficulty Prototype

Jungle is the first combat stage and keeps hazards disabled.

Jungle enemy scaling:

- NORMAL: swarm-first. Fast and tank enemies appear later through elapsed-time weights only.
- HARD: spawn interval and max enemy modifiers raise pressure, and fast/tank modifiers make the stage feel more aggressive.
- EXPERT: time-advance brings the later enemy mix online earlier, giving elite/tank pressure without adding special attacks.

Jungle boss scaling:

| Difficulty | HP | Damage | Speed | Charge Cooldown | Warning | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| NORMAL | 520 | 24 | 39 | 6.8s | 1.05s | First readable charge boss. |
| HARD | 720 | 28 | 43 | 5.8s | 0.95s | More frequent pressure. |
| EXPERT | 960 | 32 | 47 | 4.9s | 0.82s | Faster tells, still avoidable. |

Debug helpers:

- `debugBossFast=1` spawns the first boss at about 8 seconds.
- `debugWeakBoss=1` lowers boss HP and rewards for fast route/result checks.

## MVP-138 Volcano Difficulty Prototype

Volcano introduces animated stage-specific enemies and a dedicated boss while preserving the same boss-defeat CLEAR rule as jungle.

Volcano enemy scaling:

- NORMAL: `volcanoHeavy` is the main stage-specific pressure, with rare `volcanoBomber` appearances.
- HARD: `volcanoBomber` and tank pressure increase.
- EXPERT: `volcanoBomber`, `volcanoFast`, and tank pressure increase together with the existing volcano gimmick cadence.

Volcano boss scaling:

| Difficulty | HP | Damage | Speed | Lava Burst | Fire Floor | Notes |
| --- | ---: | ---: | ---: | --- | --- | --- |
| NORMAL | 680 | 28 | 36 | 1 zone, 7.8s cooldown, 1.25s warning | Disabled | First fire boss pass. |
| HARD | 900 | 32 | 39 | 1 zone, 6.8s cooldown, 1.15s warning | Enabled, short linger | Moderate fire pressure. |
| EXPERT | 1180 | 36 | 42 | 2 zones, 5.8s cooldown, 1.0s warning | Enabled, longer linger | Strong but still telegraphed. |

The boss name is `繧､繧ｰ繝九せ繝ｻ繝峨Ξ繧､繧ｯ`. All boss attacks must remain readable and avoid unavoidable damage. The same `debugBossFast=1` and `debugWeakBoss=1` QA helpers apply.

## MVP-137 Jungle Boss Pattern Scaling

The jungle boss now has three readable pattern layers:

| Difficulty | Charge | Melee Roar/Claw | Summon |
| --- | --- | --- | --- |
| NORMAL | Long warning, low frequency | 92px radius, 0.75x boss damage | Disabled |
| HARD | Slightly shorter warning | 100px radius, 0.78x boss damage | 2 swarm, long cooldown |
| EXPERT | Shorter but still readable warning | 108px radius, 0.82x boss damage | 3 swarm, moderate cooldown |

Summons are intended as pressure, not a second wave system. They must stay low-count and use the same EXP/drop cleanup rules as normal enemies.

## MVP-138b Volcano Enemy/Gimmick QA Rules

Volcano now has a dedicated enemy-weight progression so the stage-specific enemies appear from the opening wave:

- Opening: `volcanoHeavy` is visible early, with rare `volcanoBomber`.
- Mid wave: `volcanoBomber` and `volcanoFast` join the standard pressure.
- Late wave: volcano-specific enemies stay prominent while generic fast/tank enemies provide support.

Debug helpers:

- `debugEnemySet=volcano` forces only volcano-specific enemies.
- `debugSpawnVolcanoEnemies=1` is an equivalent explicit visual QA flag.
- `debugGimmicks=1&debugGimmickFast=1` should show animated lava burst/fire floor hazards within a few seconds.

The dedicated volcano mix applies only to the volcano stage. Jungle remains the baseline stage and must not inherit volcano enemy types.

## MVP-138c Debug Stage Selection

Debug run selection is applied after save data is restored so URL parameters cannot be overwritten by `lastSelectedStage`.

Supported QA parameters:

- `debugStage=jungle|volcano|swamp|ruins`
- `debugDifficulty=normal|hard|expert`
- `debugEnemySet=volcano`
- `debugGimmicks=1`
- `debugGimmickFast=1`
- `debugBossFast=1`
- `debugWeakBoss=1`

Example URLs:

- `?debugStage=volcano&debugDifficulty=normal&debugGimmicks=1&debugGimmickFast=1&debugEnemySet=volcano`
- `?debugStage=volcano&debugDifficulty=hard&debugBossFast=1&debugWeakBoss=1`
- `?debugStage=jungle&debugDifficulty=normal&debugBossFast=1&debugWeakBoss=1`

When `debugDifficulty` is omitted, the current saved difficulty remains in normal navigation and PlayScene falls back through the standard config fallback. `normal` should be used for deterministic volcano QA.
## MVP-139 Swamp Difficulty Runtime

- Swamp stage now has dedicated enemy weights and boss settings for NORMAL/HARD/EXPERT.
- NORMAL emphasizes `swampPoison` and small readable poison zones.
- HARD introduces `swampToxicBomber` pressure and boss summons.
- EXPERT increases toxic bomber/tank mix, poison zone count, and boss attack frequency while keeping warning fade before damage.
- `繝溘い繧ｺ繝槭・繧ｿ繧､繝ｩ繝ｳ繝・ clears NORMAL/HARD/EXPERT through the same boss-defeat CLEAR path as jungle and volcano.
- Debug:
  - `debugStage=swamp`
  - `debugEnemySet=swamp`
  - `debugBossFast=1`
  - `debugWeakBoss=1`
  - `debugGimmicks=1`
  - `debugGimmickFast=1`

## MVP-140 Ruins Difficulty Runtime

- Ruins stage now has dedicated enemy weights and boss settings for NORMAL/HARD/EXPERT.
- NORMAL emphasizes `ruinsShooter` ranged pressure with readable boss electro pulse and laser line attacks.
- HARD increases `ruinsElectro` pressure and enables small boss summons.
- EXPERT mixes `ruinsShooter`, `ruinsElectro`, `ruinsSummoner`, and tank support with denser boss pulse/laser patterns.
- `繧｢繝ｼ繧ｯ繝ｻ繝ｬ繝ｴ繝翫Φ繝・ clears NORMAL/HARD/EXPERT through the same boss-defeat CLEAR path as the earlier stages.
- Debug:
  - `debugStage=ruins`
  - `debugEnemySet=ruins`
  - `debugBossFast=1`
  - `debugWeakBoss=1`
  - `debugGimmicks=1`
  - `debugGimmickFast=1`

## MVP-140b Effect Warning and Damage Timing

- Stage gimmicks and boss hazards show low-alpha generated animation during windup.
- Windup has no damage.
- Damage starts only when the hazard reaches the active window.
- Cluster hazards use multiple small hitboxes, not one large hidden area.
- Laser hazards use a line-shaped hit area matching the displayed beam direction.
- This rule applies consistently to jungle, volcano, swamp, and ruins boss/stage effects.

## MVP-140c QA Notes

- Ruins NORMAL/EXPERT debug routes were checked in-browser with boss and gimmick flags. Ruins enemies, boss, electro/laser effects, CLEAR routing, and console state were acceptable for this pass.
- Volcano, swamp, and jungle debug routes were checked after the sheet metadata and stage-gimmick sheet reuse changes.
- Existing Vite chunk-size output remains a build warning only; runtime browser console had no error/warn entries in the checked routes.
- Stage gimmick damage remains active-only. Warning visuals are low-alpha generated effects and should not apply damage.

## MVP-141 Difficulty And Boss Timing QA

Four-stage difficulty smoke QA:

- `jungle`, `volcano`, `swamp`, and `ruins` were opened on NORMAL / HARD / EXPERT using debug stage URLs.
- Each checked route reached active gameplay without runtime console error/warn entries.
- Stage-specific enemy sets remained stage-scoped when `debugEnemySet=<stage>` was used.
- NORMAL remains the readability baseline, while HARD / EXPERT are currently configured through denser enemy weights, shorter gimmick intervals, and stronger boss settings.

Boss timing:

- `debugBossFast=1` remains QA-only and spawns the first boss at about 8 seconds.
- Normal gameplay currently uses `getInitialBossTime() = 60` seconds.
- A no-`debugBossFast` route was observed around 24 seconds with no boss spawn, confirming that the standard route leaves time for EXP pickup, adaptation selection, and evolution growth before the boss phase.
- If later playtests feel slow, tune with a stage/difficulty boss-time table rather than reducing the QA helper behavior.

Result / unlock expectations:

- NORMAL / HARD / EXPERT boss defeat should update stage progress and show CLEAR.
- First-clear and title reward panels must remain optional; result button layout should not depend on them always being visible.
- ResearchPt must remain excluded from normal run rewards.
## MVP-143 ENDLESS formal rules

- ENDLESS is a score-attack mode with no CLEAR state.
- The run continues until HP reaches 0 or the player exits from pause.
- `stageProgress.<stage>.endless.bestScore` and `bestTime` are the authoritative per-stage ENDLESS records.
- Runtime scaling starts around EXPERT-level pressure and increases by elapsed time:
  - 0-3 minutes: baseline ENDLESS pressure.
  - 3-6 minutes: higher enemy cap and spawn rate.
  - 6-10 minutes: stronger enemy HP/damage and denser pressure.
  - 10 minutes onward: heavy pressure with a soft cap to avoid runaway enemy counts.
- ENDLESS bosses reuse the selected stage boss. Standard boss defeat does not clear the run; the next boss appears on a timed cycle.
- Debug helpers:
  - `debugMode=endless`
  - `debugEndlessFast=1`
  - `debugEndlessScaling=1`
  - `debugBossFast=1`
# MVP-143 ENDLESS formal status

- ENDLESS is treated as a score-attack mode that continues until HP reaches 0 or the player exits the run.
- ENDLESS does not produce CLEAR. Result header should be `ENDLESS RESULT`.
- `stageProgress.<stage>.endless.bestScore` and `stageProgress.<stage>.endless.bestTime` are the canonical saved records.
- Time-based scaling is active:
  - 0-3 minutes: near EXPERT baseline
  - 3-6 minutes: higher density and stronger enemies
  - 6-10 minutes: higher elite/mutant pressure
  - 10+ minutes: increased late-run pressure with soft caps
- ENDLESS periodically reuses the stage boss. Boss defeat grants score/EXP but does not clear the stage.
- Debug helpers:
  - `debugMode=endless`
  - `debugEndlessFast=1`
  - `debugEndlessScaling=1`
  - `debugBossFast=1`

# MVP-143b ENDLESS verification notes

- Current implementation covers mode start, scaling config, periodic boss spawning, ENDLESS result labeling, best score/time saving, and ENDLESS title reward hooks.
- Remaining polish candidates:
  - dedicated ENDLESS result header asset
  - late-run warning UI
  - more visible on-screen scaling feedback
  - longer manual playtest for projectile/effect accumulation

# MVP-144 ZERO base implementation

- ZERO is a formal end-content mode unlocked by clearing EXPERT on the same stage.
- ZERO is separate from ENDLESS. ENDLESS is score attack; ZERO has a clear state.
- ZERO run flow:
  - normal pressure phase
  - phase 1 stage boss
  - reinforced mid phase
  - phase 2 secondary boss
  - phase 3 final boss
  - `ZERO CLEAR` result when the final boss is defeated
- The phase 2 boss reuses the selected stage boss as a stronger `zero_secondary` variant.
- The phase 3 final boss is `繧ｨ繧ｯ繝ｪ繝励せ繝ｻ繝励Ο繝医さ繝ｫ`; MVP-145 replaces the earlier ruins-boss fallback with dedicated final-boss visuals and attacks.
- ZERO enemy pressure uses `ZERO_SCALING_CONFIG`:
  - higher enemy HP/damage
  - higher spawn rate
  - higher enemy soft cap
  - stronger gimmick interval/damage/radius scaling
  - stronger boss HP/damage/score/EXP multipliers per phase
- Debug helpers:
  - `debugMode=zero`
  - `debugZeroFast=1`
  - `debugZeroBoss=1`
  - `debugZeroFinalBoss=1`
  - `debugUnlockDifficulties=1`

# MVP-145 ZERO final boss high-quality pass

- ZERO phase 3 now uses the dedicated `繧ｨ繧ｯ繝ｪ繝励せ繝ｻ繝励Ο繝医さ繝ｫ` boss asset instead of the ruins boss runtime fallback.
- The final boss keeps the MVP-144 flow: phase 1 stage boss, phase 2 strengthened stage boss, phase 3 final boss, then `ZERO CLEAR`.
- Dedicated final boss attacks:
  - `eclipseBeam`: warning line followed by an avoidable straight beam.
  - `gravityField`: warning circle followed by a low-damage slow field.
  - `coreBurst`: boss-area burst with clear telegraph and higher damage.
  - `summon`: capped ruins-type abnormal enemies, supported by ZERO summon-gate visuals.
- ZERO remains difficult but must not use unavoidable instant-kill attacks.
- Debug confirmation URLs:
  - `?debugStage=jungle&debugMode=zero&debugZeroFast=1&debugWeakBoss=1&debugUnlockDifficulties=1`
  - `?debugStage=jungle&debugMode=zero&debugZeroFinalBoss=1&debugWeakBoss=1&debugUnlockDifficulties=1`
  - `?debugStage=ruins&debugMode=zero&debugZeroFinalBoss=1&debugWeakBoss=1&debugUnlockDifficulties=1`

# MVP-146 ZERO final boss QA tuning

- Real-browser QA confirmed that `debugZeroFinalBoss=1` starts the ZERO final boss route and can reach `ZERO CLEAR`.
- The final boss remains avoidable but was tuned slightly away from oppressive overlap:
  - `eclipseBeam`: longer warning, shorter active time, slightly narrower beam, and slightly lower damage/alpha.
  - `gravityField`: longer cooldown, shorter active duration, lower damage, and weaker slow.
  - `coreBurst`: longer warning/cooldown, slightly smaller radius, and slightly lower damage/alpha.
  - `summon`: reduced from 3 to 2 enemies and slightly longer cooldown.
- Intended feel: final boss pressure should remain high, but a mobile player should be able to read warnings and reposition instead of being trapped by chained hazards.
- QA URLs used:
  - `?debugStage=jungle&debugMode=zero&debugZeroFinalBoss=1&debugWeakBoss=1&debugUnlockDifficulties=1`
  - `?debugStage=ruins&debugMode=zero&debugZeroFinalBoss=1&debugWeakBoss=1&debugUnlockDifficulties=1`
  - `?debugStage=volcano&debugMode=zero&debugZeroFast=1&debugWeakBoss=1&debugUnlockDifficulties=1`
  - `?debugStage=swamp&debugMode=zero&debugZeroFast=1&debugWeakBoss=1&debugUnlockDifficulties=1`

# MVP-147 ZERO normal-strength pacing QA

- ZERO was checked without `debugWeakBoss` for the opening pressure route:
  - `?debugStage=jungle&debugMode=zero&debugUnlockDifficulties=1`
- Observed result:
  - the run starts normally at ZERO strength.
  - opening enemy pressure is high but not immediately lethal.
  - the player still has room to collect EXP and start adaptation growth before the first boss.
- Normal ZERO boss schedule was shortened from roughly 5.5 minutes to roughly 4.75 minutes:
  - phase 1 boss: 95s
  - phase 2 boss: 190s
  - final boss: 285s
- Phase gap was reduced from 48s to 42s so the run does not feel stalled after boss defeats.
- ZERO enemy pressure was softened at the start and kept progressive:
  - lower base HP/damage/spawnRate/maxEnemyBonus/soft cap than MVP-146.
  - pressure now ramps in two steps after 120s and 240s instead of waiting until very late.
- ZERO gimmick pressure was reduced slightly:
  - longer interval
  - slightly longer warning
  - lower damage/radius growth
  - active duration increase reduced
- Boss scale was adjusted:
  - phase 1 and phase 2 HP/damage slightly reduced.
  - final boss HP/damage slightly reduced but still clearly above earlier phases.
- Debug QA helpers remain:
  - `debugMode=zero`
  - `debugZeroFast=1`
  - `debugZeroBoss=1`
  - `debugZeroFinalBoss=1`
  - `debugWeakBoss=1`
  - `debugUnlockDifficulties=1`

# MVP-148 ZERO phase warning presentation

- ZERO now has a short phase presentation layer that appears only while `selectedMode === "zero"`.
- Display timing:
  - ZERO start: `ZERO MODE` / run protocol start notice.
  - phase 1 boss: `PHASE 1` / abnormal apex approach notice.
  - phase 2 boss: `PHASE 2` / ZERO mutation response notice.
  - phase 3 boss: `FINAL PROTOCOL` / Eclipse Protocol activation notice.
- Each notice is deduplicated per run so the same phase warning cannot spam after restarts or boss checks.
- The final protocol notice adds a short dim overlay and core/noise animation, but does not add long input lock.
- NORMAL / HARD / EXPERT / ENDLESS must not show the ZERO phase layer.
- Debug confirmation URLs:
  - `?debugStage=jungle&debugMode=zero&debugZeroFast=1&debugUnlockDifficulties=1`
  - `?debugStage=ruins&debugMode=zero&debugZeroFinalBoss=1&debugUnlockDifficulties=1`

## MVP-149 ZERO notification queue

- ZERO phase notices are queued instead of drawn immediately over higher-priority UI.
- Blocking UI:
  - result / game over
  - pause
  - level-up selection
  - evolution selection
- When blocked, the active ZERO notice is hidden/paused and pending notices wait until a safe gameplay moment.
- Boss phase notices are deduplicated per run and may briefly delay the next visual warning so the notification can be read.
- Normal, HARD, EXPERT, and ENDLESS modes must not show this ZERO notification layer.

## MVP-151c ZERO Reward Route Stage Scope

- ZERO mode remains available for all four stages.
- Pre-release production ZERO evolution rewards are scoped as:
  - jungle: implemented velociraptor ZERO route, `velociraptor_zero` / `繧｢繝薙せ繝ｩ繝励せ`.
  - volcano: planned triceratops ZERO route, not yet implemented.
  - swamp: implemented tyrannosaurus ZERO route, `tyrannosaurus_zero` / `繧ｪ繝｡繧ｬ繝ｬ繧ｯ繧ｹ`.
  - ruins: no pre-release ZERO evolution route; post-release content after the fourth dinosaur exists.
- ZERO clear still updates `stageProgress.<stage>.zero` for every stage.
- Jungle and swamp ZERO clears currently write implemented `unlockedZeroRoutes` entries.

## MVP-152 ZERO Pre-Release Stage Scope

- ZERO remains the post-EXPERT endgame mode for pre-release stages, but route rewards are not equally complete on every stage.
- Stage reward scope:
  - jungle ZERO is playable and grants `velociraptor_zero`.
  - volcano ZERO remains playable for QA/pacing but its `triceratops_zero` reward route is planned for a later MVP.
  - swamp ZERO is playable and grants `tyrannosaurus_zero`.
  - ruins ZERO is locked in the normal pre-release selector because its reward route depends on the future fourth dinosaur.
- `debugUnlockDifficulties=1` must not accidentally make ruins ZERO part of the normal QA route.
- Internal QA can explicitly bypass the pre-release ruins lock with `debugAllowRuinsZero=1`.
- If `debugStage=ruins&debugMode=zero` is used without the explicit bypass, the runtime should fall back to a non-ZERO ruins run instead of granting a ruins ZERO route.

## MVP-152c Jungle / Swamp ZERO Boss Completion

- MVP-153 / volcano `triceratops_zero` is deferred until jungle and swamp ZERO are production-stable.
- ZERO final boss selection is now stage-aware:
  - jungle final boss: `jungle_zero_final_boss` / Abyss Canopy, a dedicated ZERO predator tied to `velociraptor_zero`.
  - swamp final boss: `swamp_zero_final_boss` / Miasma Omega, a dedicated toxic ZERO predator tied to `tyrannosaurus_zero`.
  - other stages keep the generic Eclipse Protocol fallback unless explicitly production-scoped later.
- Phase 2 remains an enhanced stage boss for jungle/swamp in this MVP. It is acceptable as a temporary bridge only because the dedicated final boss now carries the route reward identity.
- Pre-release ZERO scope is unchanged:
  - jungle ZERO clear grants `velociraptor_zero`.
  - swamp ZERO clear grants `tyrannosaurus_zero`.
  - volcano ZERO reward remains planned.
  - ruins ZERO remains locked in the normal selector and requires `debugAllowRuinsZero=1` for internal QA.

## MVP-152d Dedicated ZERO Phase 2 Bosses

- Jungle and swamp ZERO phase 2 are no longer temporary enhanced stage-boss variants.
- ZERO boss role split:
  - Phase 1: enhanced selected-stage boss, used as the first pressure check.
  - Phase 2: dedicated ZERO second boss, stronger than phase 1 and weaker than the route final boss.
  - Phase 3: dedicated ZERO final boss; route reward and ZERO clear are granted only after this boss is defeated.
- Jungle phase 2:
  - ID: `jungle_zero_second_boss`
  - Display name: Canopy Wraith / `繧ｫ繝弱ヴ繝ｼ繝ｻ繝ｬ繧､繧ｹ`
  - Role: shadow predator bridge into `velociraptor_zero`.
  - Attacks: shadow line charge, claw burst, ZERO trap field, small predator summon.
- Swamp phase 2:
  - ID: `swamp_zero_second_boss`
  - Display name: Venom Wraith / `繝ｴ繧ｧ繝弱Β繝ｻ繝ｬ繧､繧ｹ`
  - Role: toxic predator bridge into `tyrannosaurus_zero`.
  - Attacks: toxic line charge, poison burst, slow field, swamp poison summon.
- Volcano ZERO phase 2 remains the existing bridge implementation until the `triceratops_zero` production MVP.
- Ruins ZERO remains post-release / locked in the normal selector.

## MVP-153 Volcano ZERO Difficulty Update

- Volcano ZERO phase 2 is promoted from the bridge implementation to the dedicated `volcano_zero_second_boss` / Volcan Brut encounter.
- Volcano ZERO final phase uses the dedicated `volcano_zero_final_boss` / Volcano Omega encounter and is the only point that grants the volcano ZERO route reward.
- Phase roles for volcano ZERO:
  - Phase 1: strengthened volcano stage boss.
  - Phase 2: dedicated ZERO second boss with lava charge, field pressure, and bomber summons.
  - Final: dedicated ZERO final boss with stronger lava burst / core burst pressure and heavy volcanic summons.
- Jungle and swamp ZERO reward routes remain unchanged. Ruins ZERO remains post-release / locked in the normal selector.

### MVP-154 ZERO 3-route cross QA
- Scope: pre-release ZERO routes are jungle -> `velociraptor_zero` / 繧｢繝薙せ繝ｩ繝励せ, volcano -> `triceratops_zero` / 繧､繧ｰ繝九こ繝ｩ, and swamp -> `tyrannosaurus_zero` / 繧ｪ繝｡繧ｬ繝ｬ繧ｯ繧ｹ.
- QA confirmed route reward mapping through `SaveManager.grantZeroRewards`: jungle grants `jungle_zero_clear` + `jungle_zero_frame` + `velociraptor_zero`; volcano grants `volcano_zero_clear` + `volcano_zero_frame` + `triceratops_zero`; swamp grants `swamp_zero_clear` + `swamp_zero_frame` + `tyrannosaurus_zero`; ruins grants no ZERO route reward.
- Duplicate reward QA confirmed the second volcano ZERO clear does not re-grant the route, title, or frame.
- ZERO upper evolution QA confirmed all three routes require route unlock, matching lineage, Lv8+, speed/hunting/attack Lv3+, and do not become eligible again after `hasZeroEvolved` is set.
- Existing `hasEvolved` normal evolution state does not block ZERO upper evolution eligibility.
- ZERO candidate UI copy was normalized to readable Japanese for route隗｣譫先ｸ医∩ / 蜈ｨ驕ｩ蠢廰v3+ / Lv8+.
- Browser smoke QA covered jungle, volcano, swamp ZERO starts; direct ZERO evolutions and their specials; stage select locking; and ruins ZERO lock.
- Final polish candidates: full manual ZERO CLEAR pacing per route, boss HP tuning without `debugWeakBoss`, and longer performance soak.

### MVP-155 ZERO pre-release balance QA
- Scope: normal-strength ZERO QA for jungle / volcano / swamp without `debugWeakBoss`; ruins ZERO remains post-release locked.
- Early-run QA found jungle stable, volcano level-up tempo acceptable, and swamp pressure slightly high in the first 20 seconds.
- Balance adjustments:
  - ZERO boss spawn times: `[95, 190, 285]` -> `[90, 180, 270]` seconds to reduce run fatigue while keeping three distinct phases.
  - ZERO phase gap: `42` -> `36` seconds to avoid overly long downtime between boss phases.
  - ZERO enemy HP scale: `1.34` -> `1.30`.
  - ZERO enemy damage scale: `1.18` -> `1.12`.
  - ZERO spawn rate scale: `1.24` -> `1.20`.
  - ZERO secondary boss HP/damage: `1.42 / 1.12` -> `1.34 / 1.10`.
  - ZERO final boss HP/damage: `1.95 / 1.24` -> `1.82 / 1.20`.
  - ZERO EXP multiplier: `1.18` -> `1.24` to make Lv8+ and all-adaptation Lv3+ upper-evolution conditions more reachable before the final phase.
- ZERO reward QA reconfirmed jungle -> `velociraptor_zero`, volcano -> `triceratops_zero`, swamp -> `tyrannosaurus_zero`, and ruins -> no route/title/frame reward.
- ZERO duplicate reward QA remains unchanged: second clears do not re-grant route, title, or frame rewards.
- Browser QA after tuning confirmed route starts and fast phase checks with no runtime console error/warn.
- Final polish candidates: full no-debug manual clear attempts, exact boss time-to-kill measurements per dino/evolution, and touch-control survivability tuning.

### MVP-156 Release Precheck
- Scope: normal stage smoke QA, ENDLESS smoke QA, public ZERO route smoke QA, ruins ZERO lock confirmation, save/reward verification, and remaining task triage.
- Browser smoke QA covered normal jungle / volcano / swamp / ruins, ENDLESS jungle / volcano, ZERO jungle / volcano / swamp, ruins ZERO lock, and all three ZERO evolution debug starts.
- Runtime app console error/warn count was 0 for the checked browser routes.
- Save QA reconfirmed ZERO route mapping: jungle -> `velociraptor_zero`, volcano -> `triceratops_zero`, swamp -> `tyrannosaurus_zero`, ruins -> no public ZERO reward.
- Duplicate ZERO clear rewards remain guarded; second clears do not re-grant ZERO route, title, or frame.
- Performance review confirmed mode-aware soft caps remain in place: ENDLESS 76 enemies, ZERO 68 enemies.
- Pre-release follow-up: run longer ENDLESS/ZERO soak tests on target devices after mobile / Safari polish.

### MVP-161 Playfeel Tuning

- Stage gimmicks were retuned to act as accents rather than the main source of pressure.
  - Volcano intervals are now 28 / 23 / 19 seconds for NORMAL / HARD / EXPERT, with EXPERT limited to one active spawn per cycle.
  - Swamp intervals are now 30 / 25 / 21 seconds with shorter toxic uptime and slightly softer slow on lower difficulties.
  - Ruins intervals are now 31 / 26 / 21 seconds with shorter laser/electro active windows and narrower early laser lanes.
- ZERO stage-gimmick scaling keeps pressure higher than EXPERT, but no longer forces a second simultaneous gimmick by default.
- Boss hazard attacks now use a short recovery gate and an active hazard limit so warning -> attack -> recovery remains readable.
- Warning guide visibility is controlled by the Options `隴ｦ蜻翫ぎ繧､繝荏 chip; high-visibility mode increases warning alpha.
- Final polish should still include full manual high-difficulty runs on mobile hardware to judge whether gimmick cadence feels too sparse or still too busy.

## Post-RC Difficulty Pressure Adjustment

- NORMAL remains unchanged so jungle can still work as a tutorial-style first stage.
- HARD and EXPERT now add more pressure as time advances:
  - HARD: maxEnemyBonus `2 -> 3`, spawnIntervalMultiplier `0.92 -> 0.88`, timeAdvance `12 -> 16`.
  - EXPERT: maxEnemyBonus `4 -> 6`, spawnIntervalMultiplier `0.84 -> 0.78`, timeAdvance `24 -> 32`.
  - Fast and tank enemy weights were slightly increased to make later waves less passive.
- ZERO pressure now ramps harder after the early phase instead of making the opening immediately punishing:
  - Mid pressure starts after 105 seconds and scales up more strongly.
  - Late pressure starts after 205 seconds and adds more density/damage pressure.
  - ZERO softEnemyCap `68 -> 74`.
  - ZERO maxEnemyBonus `12 -> 13`, with additional pressure-based enemy cap growth.
  - ZERO eliteBonus `0.10 -> 0.12`, plus pressure-based elite growth.
  - ZERO boss HP/damage: first `1.12/1.04 -> 1.16/1.05`, secondary `1.34/1.10 -> 1.42/1.12`, final `1.82/1.20 -> 2.02/1.26`.
- Intent:
  - Jungle NORMAL should stay approachable for first-time players.
  - Jungle HARD, EXPERT, and ZERO should increasingly punish runs that do not invest in adaptation skills and research upgrades.
  - ZERO should feel more dangerous in the mid-to-late run without causing immediate early collapse.

## MVP-A09 Boss / ZERO Notice Timing

- Standard boss arrival remains non-blocking and does not pause the run.
- Standard boss notice target duration is 1.95s.
- ZERO start / PHASE / FINAL notices are non-blocking and must not duplicate the normal boss banner.
- ZERO timing targets:
  - ZERO MODE start: 1.90s.
  - PHASE 1: 2.02s.
  - PHASE 2: 2.12s.
  - FINAL PROTOCOL: 2.62s.
- FINAL PROTOCOL may dim the screen, but alpha should remain low enough that the player, enemies, and warning guides remain visible.
- Boss defeat slow flash/shockwave remains the transition bridge into CLEAR / ZERO CLEAR and must not be confused with game-over feedback.
## MVP-A11 Difficulty Tuning

MVP-A11 keeps NORMAL爽快感-focused and widens the pressure gap for higher difficulties.

- NORMAL remains readable and forgiving.
- HARD makes repeated contact damage meaningfully dangerous.
- EXPERT increases enemy durability, contact danger, and late density.
- ENDLESS late phases scale harder after the long-run phase.
- ZERO is intentionally heavier: enemy damage, late density, second boss pressure, final boss hazard damage, and final summons are stronger.

The tuning target is not instant death. The goal is that late mistakes matter and clears feel earned.

## MVP-A11 Late-Game Pressure Follow-Up

- ENDLESS soft cap and overtime scaling are raised to reduce infinite survival loops.
- ZERO soft cap, late spawn pressure, elite pressure, and boss damage multipliers are raised.
- Boss hazard damage now follows boss damage scaling instead of relying only on base contact damage.
- Heal pickups are slightly less generous in high-pressure contexts.
- Early NORMAL pacing remains the baseline for accessibility.
## MVP-A14 Difficulty Pressure

- NORMAL remains the baseline and is not changed by A14.
- HARD boss appearance is slightly delayed, then late enemy pressure ramps more strongly after the middle of a run.
- EXPERT boss appearance is delayed further and late pressure rises more sharply than HARD.
- ENDLESS raises late and overtime enemy caps/spawn pressure to reduce indefinite survival.
- ZERO boss phases appear later in normal runs, but ZERO mid/late pressure, boss damage, and hazard overlap are stronger.
- Boss hazards continue to use warning guide -> windup -> attack; A14 does not add unavoidable instant hits.

## MVP-A15.3 Progression-Gated Pressure

- Time still increases pressure inside the current phase, but enemy level and enemy count ceilings are unlocked by boss defeats.
- HARD/EXPERT keep stronger late pressure than NORMAL, but pre-boss caps stop elapsed time from making boss fights spiral indefinitely.
- ZERO uses three pressure phases: opening, after ZERO boss 1, and after ZERO boss 2. FINAL-phase pressure is only available after the second ZERO boss is cleared.
- ENDLESS pressure phases are tied to defeated boss count so long runs continue escalating without letting pre-boss time alone unlock the highest caps.
- ZERO second/final boss durability is slightly reduced to avoid long fights becoming tedious; attack threat is maintained.

## HOTFIX-A15.4 ZERO Damage Readability

- ZERO late trash enemy damage is softened to avoid one-hit-feeling deaths.
- The intended failure pattern is being surrounded by fast/high-level enemies, not losing most of the run to one contact.
- Enemy count, movement speed, level progression, and boss threat are unchanged.
