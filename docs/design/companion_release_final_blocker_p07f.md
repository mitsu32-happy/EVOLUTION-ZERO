# MVP-P07f Companion Dino final blocker fixes

Date: 2026-06-14
Branch: `feature/companion-dino-p01`

No `main` merge or push was performed.

## Purpose

P07f resolves the final blockers left after P07e:

1. Escape did not close the companion upgrade item modal.
2. Clean-save companion flow QA needed a safe, repeatable route.

Physical controller QA is no longer treated as a blocker for this pass.

## Escape / cancel fix

Implemented:

- `ScreenManager` now installs a keyboard cancel shortcut for `Escape`.
- The shortcut routes to the same cancel path used by existing gamepad modal handling:
  - tutorial visible: tutorial cancel
  - play screen: PlayScene cancel handling
  - current UI screen: `handleGamepadAction({ cancelPressed: true, pausePressed: true })`
  - fallback: default screen cancel/back behavior

Confirmed:

- Companion upgrade item selection modal closes with `Escape`.
- Companion upgrade confirmation modal cancels with `Escape`.
- On-screen `キャンセル` still works.
- App console error/warn: `0`.

## Tutorial highlight fix

Issue:

- The home companion tutorial highlight used an old fallback target rectangle.
- The actual home companion panel had moved to the logo area, so the highlight frame could appear offset.

Fix:

- Updated fallback tutorial bounds for `home.companion` to match the current home panel:
  - `x: 18`
  - `y: 92`
  - `width: 168`
  - `height: 58`

Confirmed:

- The home companion tutorial can now target the current top-left companion panel area.

## Clean-save QA method

Method used:

- Added DEV-only `qaCleanSave=1`.
- When present, `ScreenManager` calls `SaveManager.debugResetAll()` during boot.
- This resets only the current app save in a QA/debug route.
- It is gated by `import.meta.env.DEV`.
- No normal user-facing reset UI was added.

Why this method:

- The in-app browser evaluation surface cannot safely write page `localStorage` directly.
- Natural egg drop is intentionally random.
- A deterministic clean-save route is needed for final QA without exposing reset behavior to normal players.

QA route used:

`qaCleanSave=1&debugIntroSeen=1&debugCompanionEgg=1&debugDna=9999&debugResearchPt=9999&debugCompanionInstantHatch=1&qaP07fClean=1`

The route uses a clean save plus existing QA/debug helpers for:

- egg possession
- enough DNA / researchPt
- instant hatch timing

## Clean-save flow result

Confirmed in browser:

- Clean-save boot through `qaCleanSave=1`.
- Home first-run tutorial appeared.
- Research companion unlock tutorial appeared.
- Companion tab first-view tutorial appeared.
- Egg hatch confirmation appeared.
- Hatch consumed DNA and researchPt.
- A companion was obtained.
- Home companion tutorial appeared after hatch.
- Companion appeared in the home panel.
- Upgrade item selection opened.
- Upgrade confirmation appeared.
- Upgrade executed and the companion reached Lv2.
- Set解除 worked.
- Home panel changed to `未セット`.
- Companion modal card changed from `セット中` to `選択`.
- Reload without `qaCleanSave=1` restored the owned companion, Lv2 state, and unset state.
- App console error/warn: `0`.

Note:

- The actual in-play random egg drop pickup was not rerun as a long no-debug RNG test.
- The egg acquisition state was seeded through the QA route because the purpose of P07f was to remove the clean-save verification blocker safely and deterministically.

## Save compatibility impact

- `debugResetAll()` is a small SaveManager helper used only by the DEV-gated QA route.
- Existing normalization and migration behavior is unchanged.
- Existing user saves are not reset unless `qaCleanSave=1` is explicitly used in a development build.

## Main merge judgment

`main integration: pass`

Reason:

- P07d/P07e high-load performance blocker remains mitigated.
- Escape modal close blocker is fixed.
- Clean-save companion flow is verified through a safe QA route.
- Physical controller QA is no longer a blocker per P07f scope.

## Remaining non-blocking notes

- A final manual real-device pass can still be useful before release.
- A fully no-debug random egg pickup run remains useful as confidence QA, but it is no longer treated as a merge blocker in P07f.

