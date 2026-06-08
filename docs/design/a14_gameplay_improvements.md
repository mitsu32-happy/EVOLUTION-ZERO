# MVP-A14 Gameplay Improvements

## Scope

MVP-A14 focuses on play feel, late-game pressure, boss battle tension, and boss defeat satisfaction.

Out of scope:

- New dinosaurs
- Buddy dinosaurs
- Co-evolution
- PWA changes
- Large UI redesigns

## Bug Fixes

### Level-up Reroll Gamepad Selection

- The level-up UI now includes the reroll button in its gamepad focus targets.
- D-pad / left stick navigation can move from adaptation/stat/reward cards down to reroll.
- Button 0 confirms the focused reroll button.
- Disabled reroll remains visible but does not consume a reroll.

### Loading Screen Restore

- `ScreenManager.showHome()` again waits for the home asset group through the formal `LoadingUi`.
- Title to home transition now shows the existing loading screen while home assets are prepared.
- The home screen is displayed after home UI assets are ready, reducing visible fallback art during transition.

## Difficulty Tuning

### NORMAL

- NORMAL tuning is intentionally kept unchanged.
- Early-game readability and爽快感 remain the priority.

### HARD / EXPERT

- Boss appearance is delayed on HARD and EXPERT to give the player more growth time.
- Enemy cap and late elapsed-time pressure are increased.
- Boss damage multiplier is increased.
- Boss hazard attacks gain slightly larger radius/line size through existing attack scaling.
- EXPERT bosses can overlap two warning hazards, but still use warning -> windup -> attack.

### ENDLESS

- Boss interval is slightly longer to support growth before boss pressure.
- Mid, late, and overtime enemy pressure are increased.
- Soft enemy cap is increased so indefinite survival is less likely.

### ZERO

- ZERO boss timing is later in normal runs, giving more preparation time.
- ZERO mid and late enemy spawn pressure is stronger.
- ZERO enemy cap and final pressure are increased.
- ZERO second/final bosses have stronger damage scaling and more frequent hazard pressure.
- ZERO final can overlap more hazards, but warning telegraphs are still preserved.

## Recovery Adjustment

- Heal pickups are partially restored after A11 reductions.
- Drop chance and heal amount are slightly increased.
- This offsets the stronger late enemy and boss pressure without making early NORMAL easier.

## Boss Defeat Presentation

- Boss defeat no longer jumps immediately to the result screen.
- Standard boss clear uses about 2.25 seconds of defeat presentation.
- ZERO final uses about 3.1 seconds of stronger finish presentation.
- During the sequence, gameplay input is cleared and the scene updates only visuals/HUD/camera lightly.
- Generated effect-only raster assets are used as the main visual layer:
  - `public/assets/effects/boss/boss_death_explosion_a14.png`
  - `public/assets/effects/boss/boss_death_shockwave_a14.png`
  - `public/assets/effects/boss/zero_boss_death_core_a14.png`
- The assets intentionally contain no boss body so the same finish effects can be reused for all bosses.
- Existing boss defeat SE, flash, screen shake, and light runtime particles remain as supporting effects.

## QA Targets

- Level-up reroll gamepad focus
- Title -> home loading screen
- NORMAL standard run
- HARD standard run
- EXPERT standard run
- ZERO run
- Standard boss defeat
- ZERO final boss defeat
