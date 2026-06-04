# MVP-A10d.3 HUD overlap audit

Date: 2026-06-04

## Scope

- BRANCH HUD card
- Boss HP bar
- Normal boss notice
- ZERO PHASE notice
- FINAL PROTOCOL notice

No new assets were generated for this pass.

## Current overlap risks

- BRANCH occupies the upper-left play area after evolution.
- The boss HP bar normally uses the upper play HUD area and can visually compete with BRANCH on narrow mobile layouts.
- Boss / ZERO notices are high-priority center/top overlays and must stay readable when the boss HP bar would otherwise be active.

## HUD priority

1. FINAL PROTOCOL
2. ZERO PHASE notice
3. Normal boss notice
4. BRANCH
5. Boss HP bar

## Implemented layout rule

- During normal boss notice, ZERO PHASE notice, or FINAL PROTOCOL notice, the boss HP bar is suppressed.
- After the notice timer ends, the boss HP bar is shown again if an active boss exists.
- While a branch evolution is active, the boss HP bar is shifted downward so it does not sit directly on top of the BRANCH card.

## QA artifacts

- `docs/assets/a10d3_normal_boss_notice_no_hpbar_qa.png`
- `docs/assets/a10d3_normal_boss_hpbar_restored_qa.png`
- `docs/assets/a10d3_zero_final_notice_no_hpbar_qa.png`
- `docs/assets/a10d3_zero_final_hpbar_restored_qa.png`

## QA notes

- Normal boss route confirmed the HP bar returns after notice and is offset below BRANCH.
- ZERO final retry with `debugWeakBoss=1` reached ZERO CLEAR with runtime logs clean; the FINAL notice moment was too brief to capture cleanly in this pass.
- The same suppress rule is shared by normal boss notice and ZERO notice timers, so FINAL / ZERO notice should suppress the HP bar through the same code path.

## Runtime logs

- Browser console errors/warnings observed during A10d.3 QA: 0
