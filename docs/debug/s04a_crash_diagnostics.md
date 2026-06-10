# MVP-S04a Crash Diagnostics

## Purpose

S04a adds a DOM-based crash diagnostics screen so iPhone/PWA users can report
failures even when WebGL renders a white screen.

## Covered Failures

- Runtime error
- Unhandled promise rejection
- WebGL context lost
- Ticker exception
- Ticker stall heartbeat
- Boot failure

## Stored Report

The latest report is saved to `EVOLUTION_ZERO_CRASH_REPORT` in localStorage when
storage is available. The same report is exposed as `window.__EVOLUTION_ZERO_CRASH_REPORT__`
for desktop debugging.

## Screen Contents

- Version and build
- Current screen/stage/mode/difficulty
- Elapsed time
- Enemy/projectile/hazard/warning/effect/damage/critical/pickup counts
- Container children total
- Load shedding level
- WebGL context lost flag
- Runtime error message
- Stack trace first lines
- Timestamp

## QA Route

- `?debugCrash=runtime` triggers an artificial runtime error after boot.
- Expected result: the screen shows `ゲームが停止しました`, the copy button copies
  an `EVOLUTION ZERO Crash Report`, and the reload button restarts the app.

## HOTFIX-S04a.1

- Saved `EVOLUTION_ZERO_CRASH_REPORT` entries are retained for reporting but are
  never shown automatically on the next boot.
- The crash screen is positioned against the game canvas rectangle and scrolls
  internally so it stays inside the visible game area on mobile/PWA displays.
