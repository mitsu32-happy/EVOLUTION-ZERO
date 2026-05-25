# Loading UI Spec

## MVP-A03 Loading Groups

- Purpose: reduce time to first title display by avoiding non-title screen construction and non-boot asset loading during initial boot.
- Boot behavior:
  - Construct `TitleScreen`, `IntroOverlay`, `AudioManager`, `SaveManager`, `GameState`, `AssetLoader`, and the global `LoadingUi`.
  - Do not construct Home, Research, Codex, Options, StageSelect, DinoSelect, AssetPreview, or PlayScene at boot.
  - Boot audio preload is limited to UI feedback and `title_bgm`.
- Asset groups:
  - `boot`: title background, warning panel, start button frames, title/home logo.
  - `home`: Home UI, bottom nav/common UI, title frames, Home hero display assets.
  - `stageSelect`: stage selector UI and thumbnails.
  - `dinoSelect`: dinosaur selector UI, portraits, and hero cards.
  - `dino:<id>`: selected dinosaur family assets.
  - `stage:<id>`: selected stage assets.
  - `battle`: HUD, pause, player, pickup, hit, normal attack, adaptation, evolution, and special effect assets.
  - `zero`: ZERO-specific UI and assets.
  - `codex`: Codex UI and large dinosaur/evolution images.
  - `research` / `options`: screen-specific UI groups.
- Loading UI:
  - Shows only for required route transitions such as START to Home, Codex first open, Stage/Dino selection, and Play start.
  - Uses DNA analysis themed copy, a progress bar, current group label, and one short tip.
  - The overlay is non-interactive visually and prevents a blank screen while required assets resolve.
- Cache behavior:
  - `AssetLoader` caches item loads.
  - Group loads are deduplicated through `groupPending`.
  - Completed groups are tracked in `loadedGroups`.
  - Failed group keys are stored in `failedGroups` while existing Graphics fallbacks remain available.
- GitHub Pages:
  - All manifest asset loads continue to resolve through `import.meta.env.BASE_URL`, preserving `/EVOLUTION-ZERO/`.
  - No service worker or persistent cache is introduced in MVP-A03.
