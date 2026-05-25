# MVP-A03 After Loading Report

- Created: 2026-05-25T14:38:37.233Z
- Boot group: 6 manifest assets / 4.79 MB
- Previous constructor eager-load risk, Home: 56 files / 19.95 MB
- Previous constructor eager-load risk, Codex: 104 files / 29.16 MB
- Previous audio preload risk: 48 files / 21.49 MB

## Implemented Loading Groups
- boot: 6 assets / 4.79 MB
- home: 77 assets / 24.69 MB
- stageSelect: 39 assets / 10.26 MB
- dinoSelect: 41 assets / 8.12 MB
- research: 48 assets / 8.16 MB
- options: 53 assets / 7.26 MB
- codex: 92 assets / 28.13 MB
- battle: 215 assets / 50.35 MB
- zero: 94 assets / 49.28 MB
- stage:jungle: 27 assets / 16.88 MB
- stage:volcano: 36 assets / 18.07 MB
- stage:swamp: 34 assets / 30.27 MB
- stage:ruins: 23 assets / 20.20 MB
- dino:velociraptor: 34 assets / 14.88 MB
- dino:triceratops: 33 assets / 10.63 MB
- dino:tyrannosaurus: 33 assets / 13.15 MB
- dino:spinosaurus: 28 assets / 16.61 MB

## Behavior
- Boot constructs only TitleScreen and the global LoadingUi.
- START loads `home`, then creates HomeScreen.
- Stage select loads `stageSelect`; dino select loads `dinoSelect`.
- Play start loads `battle`, selected `stage:<id>`, selected `dino:<id>`, and `zero` only for ZERO mode.
- Codex loads `codex` only on first open and then uses AssetLoader cache.
- AssetLoader deduplicates group and item requests and records group failures.

## QA Screenshots
- docs/assets/loading_a03_title.png
- docs/assets/loading_a03_home.png
- docs/assets/loading_a03_codex.png
- docs/assets/loading_a03_stage_select.png
- docs/assets/loading_a03_dino_select.png
- docs/assets/loading_a03_play.png

## Runtime Console Note

- The old intro audio AbortError warning string was removed from `src/` and `dist/`.
- Codex browser log API still showed one retained older warning entry, but route QA did not show Home/Stage/Dino/Play rendering errors.
