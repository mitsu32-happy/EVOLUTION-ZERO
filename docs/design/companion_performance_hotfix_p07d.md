# MVP-P07d Companion Dino performance hotfix

Date: 2026-06-14
Branch: `feature/companion-dino-p01`

## Purpose

P07c kept Companion Dino out of `main` because a ZERO high-load soak reached the crash diagnostics screen with:

`Game loop stalled for 2535ms`

P07d investigates whether the issue is caused by Companion Dino load, object growth, cleanup leaks, or an overly sensitive debug performance stall guard.

No `main` merge or push was performed.

## Reproduction Baseline

P07c failure route:

`debugIntroSeen=1&debugAutoPlay=1&debugPerformance=1&debugInvincible=1&debugMaxSpawn=1&debugNoPickupCollect=1&debugCompanionId=rex_hatchling&debugCompanionLevel=5&debugDino=spinosaurus&debugUnlockDino=spinosaurus&debugUnlockZeroRoute=spinosaurus_zero&debugStage=volcano&debugMode=zero&debugDifficulty=expert`

P07c diagnostics:

- Elapsed: `144.02`
- enemyCount: `104`
- projectileCount: `0`
- hazardCount: `0`
- effectCount: `1`
- damageTextCount: `5`
- pickupCount: `0`
- containerChildrenTotal: `127`
- loadSheddingLevel: `0`
- WebGL context lost: `no`
- Error: `Game loop stalled for 2535ms`

The object counts were low. This pointed away from an effect/projectile/pickup leak and toward either a transient long frame or a debug stall guard that was too eager to show the crash screen.

## Investigation Results

### ENDLESS with Companion

Route:

`debugIntroSeen=1&debugAutoPlay=1&debugPerformance=1&debugInvincible=1&debugMaxSpawn=1&debugNoPickupCollect=1&debugCompanionId=exp_chaser&debugCompanionLevel=5&debugDino=velociraptor&debugStage=jungle&debugMode=endless&debugDifficulty=expert`

Observed before hotfix:

- Survived beyond `t=555.77`
- enemyCount around `112`
- containerChildrenTotal around `132`
- loadSheddingLevel `0`
- app console error/warn `0`
- crash diagnostics screen not shown

Observed after hotfix:

- 100s route pass
- app console error/warn `0`
- crash diagnostics screen not shown
- body performance summary included `compFx=0 compScan=0/0`

### ZERO without Companion

Route:

`debugIntroSeen=1&debugAutoPlay=1&debugPerformance=1&debugInvincible=1&debugMaxSpawn=1&debugNoPickupCollect=1&debugCompanionClear=1&debugDino=spinosaurus&debugUnlockDino=spinosaurus&debugUnlockZeroRoute=spinosaurus_zero&debugStage=volcano&debugMode=zero&debugDifficulty=expert`

Observed:

- 100s route pass
- enemyCount reached `104`
- containerChildrenTotal stayed around `119-126`
- loadSheddingLevel `0`
- app console error/warn `0`
- crash diagnostics screen not shown

### ZERO with Companion

Route:

`debugIntroSeen=1&debugAutoPlay=1&debugPerformance=1&debugInvincible=1&debugMaxSpawn=1&debugNoPickupCollect=1&debugCompanionId=rex_hatchling&debugCompanionLevel=5&debugDino=spinosaurus&debugUnlockDino=spinosaurus&debugUnlockZeroRoute=spinosaurus_zero&debugStage=volcano&debugMode=zero&debugDifficulty=expert`

Observed after first stabilization pass:

- Survived beyond `t=214.29`
- enemyCount `104`
- containerChildrenTotal `121-129`
- loadSheddingLevel `0`
- app console error/warn `0`
- crash diagnostics screen not shown

Observed after final target-cache fix:

- Survived to `t=226.87`
- enemyCount `104`
- pickupCount `0`
- containerChildrenTotal `123`
- `compFx=0`
- loadSheddingLevel `0`
- context lost `0`
- app console error/warn `0`
- crash diagnostics screen not shown

### ZERO without debugMaxSpawn

Route:

`debugIntroSeen=1&debugAutoPlay=1&debugPerformance=1&debugInvincible=1&debugCompanionId=rex_hatchling&debugCompanionLevel=5&debugDino=spinosaurus&debugUnlockDino=spinosaurus&debugUnlockZeroRoute=spinosaurus_zero&debugStage=volcano&debugMode=zero&debugDifficulty=expert`

Observed:

- Short route pass
- app console error/warn `0`
- crash diagnostics screen not shown
- The run entered normal progression/level-up pacing, so it is not a replacement for high-pressure soak.

## Cause

Two issues were identified:

1. Debug performance ticker stall detection showed the crash diagnostics screen on a single `>2500ms` heartbeat gap.

   The P07c crash snapshot showed no object growth, no WebGL context loss, and low runtime object counts. A single 2535ms delay can happen during tool/browser scheduling or a transient long frame, but it was treated as fatal immediately.

2. Companion target acquisition did extra work under pressure.

   `getCompanionDesiredTarget()` called target acquisition every frame. The previous implementation built temporary arrays and sorted them. `rex_hatchling` also used a boss-priority search; when no boss was present it could fallback to a non-boss enemy, but the cache validation rejected that non-boss fallback, causing repeated rescans.

## Fixes

### Ticker stall guard hardening

Added constants:

- `TICKER_STALL_WARN_MS = 2500`
- `TICKER_STALL_FATAL_MS = 6500`
- `TICKER_STALL_FATAL_CONSECUTIVE = 2`

Behavior:

- A single `>2500ms` heartbeat gap still records diagnostics and saves a snapshot.
- The crash diagnostics screen is shown only if the stall is severe (`>=6500ms`) or repeated consecutively.
- Suspect count resets when heartbeat returns below half the warning threshold.

This keeps crash diagnostics for real stalls while avoiding false-positive white-stop screens from one short scheduling hiccup.

### Companion target-search caching

Added cache intervals:

- `COMPANION_TARGET_REFRESH_INTERVAL = 0.18`
- `COMPANION_PICKUP_TARGET_REFRESH_INTERVAL = 0.28`

Behavior:

- Enemy/pickup target selection is cached for a short interval.
- Load shedding lengthens the refresh interval slightly.
- Cached targets are reused while still valid.
- Boss-type companions can cache non-boss fallback targets when no boss exists.

### Companion target-search allocation reduction

Replaced `filter -> map -> sort` acquisition with single-pass best-target selection.

This avoids temporary arrays and sort cost when enemy/pickup counts are high.

### Debug performance expansion

Added companion fields to performance snapshots and debug overlay/body summary:

- active companion id
- `companionEffects`
- companion effect pool free count
- enemy target scan count
- pickup scan count
- last enemy/pickup scan size
- companion effect spawn/suppression counts

The body summary now includes:

- `compFx`
- `compScan`

## Companion Object Growth Check

Across P07d runs:

- `compFx` stayed at `0-1`.
- `containerChildrenTotal` stayed around `120-135` in high-load routes.
- `loadSheddingLevel` stayed `0`.
- No app console error/warn was recorded.
- No WebGL context lost was observed.

No Companion effect/projectile/pickup growth leak was found.

## Remaining Risks

- Tool calls are capped around 120 seconds, so long soaks were performed in chunks and recovered after timeouts.
- Full no-debug release flow QA still remains from P07c.
- Physical controller QA and dedicated smartphone viewport QA still remain from P07c.
- The ticker stall guard now avoids a one-off false fatal, but a true repeated/severe stall will still show diagnostics.

## Temporary Main Integration Judgment

`main統合は条件付きで再検討可能`

The P07c ZERO blocker was addressed enough to pass the high-load route beyond the previous failure point, but final `main` readiness still depends on completing the remaining P07c non-performance QA items:

1. Natural no-debug egg/hatch/set/upgrade/restart flow.
2. Existing-save compatibility with a production-like save.
3. Smartphone viewport QA.
4. Controller / virtual mouse QA.
5. Final build and runtime console checks after all fixes.
