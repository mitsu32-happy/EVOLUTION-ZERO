# MVP-A10d Stat Card Icon Audit

## Scope
- A10c stat upgrade cards and icons.
- Evolution candidate card portrait rendering.
- BRANCH HUD portrait rendering.

## Findings
- A10c stat card PNGs already include large embedded stat icons on the left side.
- `levelup_ui.js` also overlaid separate `levelup_stat_icon_*_a10c.png` icons on tagless stat cards, causing possible double icons and position drift.
- The safer route is Policy A: use embedded icons in the generated stat card art for normal level-up stat cards, and stop code-side stat icon overlays on those cards.
- Separate `levelup_stat_icon_*_a10c.png` assets are retained for future/backup use and manifest traceability.
- Evolution candidate objects did not always pass `heroPath`/`portraitPath` into `EvolutionReadyUi`, so candidate portraits could fail to appear.
- BRANCH HUD already had evolution portrait resolution for all playable dino branches; A10d keeps the portrait route and documents it as required.

## Adopted Policy
- Stat upgrade cards: embedded icon only. No additional code-side icon overlay in normal tagless stat card route.
- Fallback reward cards and adaptation skill cards: keep separate icon overlays because those card backgrounds do not contain embedded stat icons.
- Evolution selection: prefer branch `portraitPath`, then `heroPath`, then candidate image fallback.
- BRANCH HUD: use the existing portrait resolver and show fallback graphics only if portrait texture is unavailable.
