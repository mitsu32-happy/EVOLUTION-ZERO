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
