# MVP-P04b Companion Dino Animation Pass

## Scope

P04b improves the in-play presentation of the existing 10 companion dinos on `feature/companion-dino-p01`.

This pass does not change save data, companion unlock rules, AI target rules, hatch rules, or major balance numbers. It uses the P04 production companion PNG assets and adds lightweight runtime animation and action feedback in `PlayScene`.

## Implemented Animation System

- Added per-companion animation profiles in `src/scenes/play_scene.js`.
- Added idle bob, follow tilt, squash/stretch, direction facing, and action lunge/pulse state.
- Added companion trail and action aura layers inside `companionView`.
- Added action triggers from companion attack, heal, defense, pickup, and EXP support logic.
- Continued using the capped companion effect sprite pool.
- Kept `MAX_COMPANION_EFFECTS = 24`; no unbounded particles or new projectile systems were added.

## Companion Differences

| Companion | Runtime Motion | Action Feedback |
| --- | --- | --- |
| `raptorling` | Fast bob, sharper tilt, red motion trails | Quick lunge and slash-shaped aura on single-target hit |
| `spino_pup` | Heavier swim-like bob | Blue shot tell and water-colored burst on multi-target attack |
| `medic_saur` | Gentle low bob | Green heal pulse around the companion/player when healing fires |
| `ptera_chick` | High hover bob and larger tilt | Air-shot tell with pale-blue strike line |
| `tricera_calf` | Heavy grounded movement | Shield-shaped guard aura when defense support fires |
| `para_juvenile` | Medium bob with blue scan feel | Sonar rings when pickup assist attracts items |
| `stego_calf` | Grounded bob | Low ellipse shockwave when area/synergy attack fires |
| `rex_hatchling` | Heavier scale and recoil | Larger bite/lunge tell for boss-priority hits |
| `compy_pack` | Small fast bob | Multiple orange dash streaks for swarm attacks |
| `exp_chaser` | Floating scan-like bob | Purple EXP trace rings when EXP support activates |

## Used Assets

P04b uses the existing P04 production assets:

- `public/assets/companions/{id}_sprite_p04.png`
- `public/assets/companions/{id}_effect_p04.png`

No new raster assets were generated in this pass. The production sprites are animated procedurally through transform, facing, bob, lunge, squash/stretch, and role-specific overlay effects.

## Performance Notes

- Companion effects still use `companionEffects` and `companionEffectPool`.
- The new trail/aura graphics are persistent children of `companionView`; they are redrawn each frame and are not spawned repeatedly.
- High-load behavior still blocks new companion effect sprites when `performanceLoadSheddingLevel >= 2`.
- Stale cleanup remains safe because `companionView` is already part of the active runtime view set.
- The pass does not add companion projectiles or extra damage text beyond the existing P05 behavior.

## QA Notes

Confirmed locally:

- `node --check src/scenes/play_scene.js`
- `debugCompanionId=raptorling` PlayScene startup with no console error/warn

Required follow-up QA:

- Visual confirmation for all 10 companions without debug labels.
- Smartphone-width combat readability for heal, defense, pickup, EXP, and swarm actions.
- ZERO/ENDLESS 3-5 minute soak with at least one attack companion and one utility companion.
- Re-check whether P04b closes the P07b release-quality animation gap enough for main integration.

## Remaining Work

P04b substantially reduces the static-sprite impression, but full product polish may still require:

- true sprite-sheet or skeletal animation for walk/fly/idle cycles
- role-specific timed poses authored into art assets
- stronger pack readability for `compy_pack`
- projectile-like readable travel feedback for `spino_pup` and `ptera_chick`
- final mobile visual QA before main integration

## P04c Follow-Up

P04c implements the next step of this plan:

- 10 generated companion sprite sheets with `idle` / `move` / `action` rows.
- 10 generated companion effect sheets with animated `active` frames.
- `asset_manifest.js` now points the existing companion sprite/effect keys to the P04c sheets.
- `PlayScene` cuts frame textures from the loaded sheets and switches state by idle/move/action.

See `docs/design/companion_animation_assets_p04c.md` for the asset list and mapping.
