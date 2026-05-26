# MVP-A06 PWA Setup

## Goal

- Let iPhone Safari users add EVOLUTION ZERO to the Home Screen.
- Use `display: standalone` so the game can run with less Safari browser chrome.
- Keep the first PWA pass small and update-safe.

## Manifest

- File: `public/manifest.webmanifest`
- Pages scope/start URL: `/EVOLUTION-ZERO/`
- Display: `standalone`
- Orientation: `portrait`
- Theme/background: `#050814`
- Icons:
  - `public/assets/icons/icon-192.png`
  - `public/assets/icons/icon-512.png`
  - `public/assets/icons/icon-512-maskable.png`
  - `public/apple-touch-icon.png`

Icon art uses a dark ZERO core, DNA helix, cyan/red frame, and dinosaur silhouette so it remains readable at small sizes.

## iOS Meta

`index.html` includes:

- `apple-mobile-web-app-capable=yes`
- `apple-mobile-web-app-title=EVOLUTION ZERO`
- `apple-mobile-web-app-status-bar-style=black-translucent`
- `mobile-web-app-capable=yes`
- manifest link via relative `manifest.webmanifest`
- apple touch icon via relative `apple-touch-icon.png`

The existing viewport keeps `viewport-fit=cover`, `user-scalable=no`, and `maximum-scale=1.0`.

## Service Worker Policy

- File: `public/service-worker.js`
- Registered only in production builds.
- Scope: Vite `BASE_URL`, currently `/EVOLUTION-ZERO/`.
- No full asset precache.
- No HTML/JS strong cache.
- Network-first cache is limited to manifest and icon files.
- Old `evolution-zero-pwa-*` caches are deleted on activate.
- Registration failure is intentionally silent and must not block game boot.

Full offline support, version prompts, and bulk asset caching are deferred to a later MVP.

## GitHub Pages Paths

- `vite.config.js` base remains `/EVOLUTION-ZERO/`.
- Manifest is requested as `/EVOLUTION-ZERO/manifest.webmanifest`.
- Icons resolve relative to the manifest as `/EVOLUTION-ZERO/assets/icons/...`.
- Service worker is requested as `/EVOLUTION-ZERO/service-worker.js` with scope `/EVOLUTION-ZERO/`.

## Manual QA

### iOS Safari

1. Open `https://mitsu32-happy.github.io/EVOLUTION-ZERO/`.
2. Use Share > Add to Home Screen.
3. Launch from the Home Screen icon.
4. Confirm standalone-like display with reduced Safari chrome.
5. Check Home, Play, Options, Codex, Result, audio unlock, drag movement, and special button.

### Android Chrome

1. Open the Pages URL.
2. Confirm install prompt or Add to Home screen menu availability.
3. Launch installed app and check Home, Play, audio, and touch controls.

## Unverified In This Environment

- Physical iPhone Home Screen install flow.
- Physical Android install prompt behavior.
- Real-device status bar and home indicator spacing.

## MVP-A06b Verification Notes

- Local dev `/EVOLUTION-ZERO/` manifest, service worker, icon, and apple touch icon endpoints returned 200.
- Local production preview `/EVOLUTION-ZERO/` manifest, service worker, icon, and apple touch icon endpoints returned 200.
- Browser metadata check confirmed manifest/apple icon/theme-color links resolve under `/EVOLUTION-ZERO/`.
- Runtime smoke on title/home/play/result/debugWeakBoss route reported no local runtime error/warn.
- Service worker remains minimal: no HTML, JS, CSS, image, audio, or full-shell precache.
- Safe-area CSS now subtracts `env(safe-area-inset-*)` from the game root dimensions so standalone top/bottom insets do not clip the canvas.

## MVP-A06b Still Requires Real Device QA

- iPhone Safari Share > Add to Home Screen.
- iPhone standalone launch and status bar/home indicator spacing.
- Android Chrome install prompt / Add to Home screen.
- Phone-speaker audio unlock and SE/BGM playback.
- Physical touch drag, special button, bottom navigation, and double-tap/pinch suppression.

## MVP-A06c Official App Icon

- Replaced the temporary PWA icons with the provided EVOLUTION ZERO app icon artwork.
- Generated outputs:
  - `public/assets/icons/icon-192.png`
  - `public/assets/icons/icon-512.png`
  - `public/assets/icons/icon-512-maskable.png`
  - `public/apple-touch-icon.png`
- The standard and Apple icons preserve the supplied composition for iOS-style rounded icon masking.
- The maskable icon keeps the dinosaur face, DNA core, and title inside a padded central safe area for Android adaptive icon crops.
- QA artifacts:
  - `docs/assets/pwa_icon_mvp_a06c_contact.png`
  - `docs/assets/pwa_icon_mvp_a06c_report.json`
- Manifest and apple touch icon references continue to use the same stable paths, so no service worker cache policy change is required.

## MVP-A06d PWA Update Flow

- App version text is centralized in `src/data/app_version.js`.
- Title screen now renders `VERSION 0.0.1` from the shared version definition.
- `src/main.js` checks service worker updates with `registration.update()`, `updatefound`, `statechange`, and existing `registration.waiting`.
- When a new service worker reaches `waiting`, the app dispatches `evolution-zero:pwa-update`.
- Title and Home apply the update automatically without a user-facing update prompt.
- PlayScene and Result do not show update UI; the pending update is held until Title or Home is visible.
- The safe-surface auto apply dispatches `evolution-zero:pwa-apply-update`.
- The waiting service worker receives `{ type: "SKIP_WAITING" }`; `controllerchange` then reloads the page once.
- Reload loop prevention uses an in-memory flag plus a sessionStorage one-shot guard.
- `debugPwaUpdate=1` forces the auto-apply path in dev/preview for UI verification. `debugPwaVersion=1` confirms the version event path without applying an update.
- Service worker cache policy is unchanged: no full asset, HTML, JS, CSS, or audio precache.
