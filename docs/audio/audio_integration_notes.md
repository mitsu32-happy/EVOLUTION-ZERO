# EVOLUTION ZERO Audio Integration Notes

MVP-035 adds a small audio catalog so real SE/BGM can be dropped in without touching gameplay code.

## Source of Truth

- Runtime catalog: `src/audio/audio_catalog.js`
- Playback manager: `src/audio/audio_manager.js`
- Asset list for production sourcing: `docs/audio/audio_asset_list.md`

## Replacement Rule

Place files at the paths defined in `AUDIO_PATHS`. Missing files only cause a one-time `console.warn`; gameplay continues.

## Categories

- `ui`: button and menu sounds
- `se`: combat and pickup sounds
- `evolution`: evolution warning and awakening
- `ultimate`: evolution-specific ultimate sounds
- `boss`: boss warning and defeat
- `bgm`: title, battle, and boss music

## Tuning

Cooldowns and simultaneous instance caps live in `audio_catalog.js`. Keep attack and hit sounds conservative because many enemies can be active at once.
