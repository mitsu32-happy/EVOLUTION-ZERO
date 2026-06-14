# Companion Dino P08 Main Merge Report

Date: 2026-06-14
Branch: main
Source branch: feature/companion-dino-p01

## Summary

Companion Dino was merged into main as the 0.10.0 feature release candidate.
This merge brings the egg, hatching, companion selection, companion upgrade,
in-game companion display, movement AI, skill effects, save migration, UI assets,
and QA documentation accumulated through P01-P07f.

## Merge Result

- origin/main was fetched before merge.
- local main was already up to date with origin/main.
- `feature/companion-dino-p01` was merged into main with `--no-ff`.
- Conflict count: 0
- Push status: not pushed. Push requires user approval after this report.

## Major Integrated Areas

- Companion data definition for 10 companion dinosaurs.
- Save migration and compatibility for existing saves without companion data.
- Egg acquisition, hatching, hatch completion, and result display.
- Home companion display, companion selection, set/unset flow.
- Research companion tab, hatch screen, owned companion upgrade screen.
- Three independent upgrade categories: range, effect, speed.
- In-game companion follow/orbit/pursuit movement, facing flip, action state, and skill effects.
- Performance protections for companion targeting, effects, and high-load scenes.
- Debug/QA helpers used during the feature branch verification.
- Production companion sprites, effect sheets, icons, and UI assets.

## Version

- Previous: 0.9.13
- New: 0.10.0
- Build label: companion-dino-p08

## Update News

Title: お供恐竜を追加しました

Body:

- プレイ中に一緒に行動するお供恐竜を追加しました。
- 卵を入手し、研究画面で孵化できるようになりました。
- 入手したお供恐竜はホームでセットできます。
- DNAを使ってお供恐竜を強化できます。
- 10種類のお供恐竜を追加しました。

## Post-Merge QA

Completed checks after version/news update:

- Home: selected companion panel displayed in the upper-left home frame.
- Tutorial: companion home tutorial highlight was verified against the moved panel.
- Research: companion tab opened and companion research tutorial displayed.
- Play: debug autoplay route reached PlayScene with a selected companion and no stop screen.
- Runtime console: 0 error / 0 warn in checked home, research, and play routes.
- Static checks: `node --check`, `git diff --check`, `npm.cmd run build`.

## Post-Merge Fixes

- Fixed `HomeScreen.getTutorialBounds('home.companion')` to use the same
  `COMPANION_HOME_PANEL` bounds as the actual home companion panel.
- This removes the stale highlight position left over from the earlier
  companion button placement.

## Remaining Notes

- Physical controller full QA is still outside the Companion Dino release blocker scope.
- Push to origin/main has intentionally not been performed in P08.
- `npm.cmd run build` still reports the existing Vite chunk-size warning for the main bundle.
