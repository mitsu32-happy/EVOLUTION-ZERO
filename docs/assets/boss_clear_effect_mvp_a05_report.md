# MVP-A05 Boss Clear Effect Report

## Scope

- Normal boss defeat clear path.
- ZERO final boss defeat clear path.
- ENDLESS/non-final boss defeat remains a short reward/SE path and does not force CLEAR.

## Runtime Behavior

- Boss defeat still grants score/EXP and plays `boss_defeat`.
- For normal stage clear, `queueBossClearSequence()` delays `completeStageByBossClear()` by about 0.48s.
- For ZERO final clear, the same sequence delays `completeZeroRun()` by about 0.72s and uses stronger cyan-white flash/ring values.
- The effect is drawn on `bossDefeatFxLayer` above the play world and below persistent UI, so it reads as a short clear impact without covering result UI.

## Visual Notes

- Center: defeated boss world position converted to screen position.
- Elements: warm/cyan flash, expanding shock ring, inner burst.
- The sequence is intentionally short to preserve mobile pacing.
- Existing result sound and BGM selection remain owned by `updateResultUi()`.

## QA Targets

- `?debugStage=jungle&debugBossFast=1&debugWeakBoss=1`
- `?debugStage=volcano&debugMode=zero&debugZeroFinalBoss=1&debugWeakBoss=1&debugUnlockDifficulties=1`

## Result

- CLEAR / ZERO CLEAR routing remains unchanged after the short defeat effect delay.
- Game over and ENDLESS boss defeat are not mixed into the clear sequence.
- Runtime QA: normal `debugWeakBoss` route reached CLEAR/result with no local runtime error/warn; ZERO route booted in ZERO MODE with no local runtime error/warn.
