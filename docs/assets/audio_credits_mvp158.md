# MVP-158 Audio Credits

Confirmation date: 2026-05-24

MVP-158 uses a small CC0 Kenney audio set so the game is no longer silent while keeping licensing simple before the later full audio pass. Candidate Japanese sites, including 効果音ラボ and DOVA-SYNDROME, were reviewed as future candidates, but were not adopted in this MVP to avoid mixing license terms during the first audio implementation.

## Adopted License Summary

- Site: Kenney
- Author: Kenney / Kenney Vleugels
- License: Creative Commons CC0 1.0 Universal
- License URL: https://creativecommons.org/publicdomain/zero/1.0/
- Commercial use: allowed
- Credit: not required, but appreciated by the author
- Modification: allowed under CC0
- Key restrictions recorded for release: do not represent the audio as original EVOLUTION ZERO recordings, and keep this source list with the project because third-party asset provenance is required for release QA.

## Adopted Assets

| Game key | File | Usage | Source pack | Source URL | Author | Credit required | Commercial allowed | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ui_click` | `public/assets/audio/ui/ui_select.ogg` | UI selection / click | Interface Sounds | https://kenney.nl/assets/interface-sounds | Kenney | No | Yes | Source file: `select_001.ogg` |
| `ui_cancel` | `public/assets/audio/ui/ui_cancel.ogg` | UI cancel / back | Interface Sounds | https://kenney.nl/assets/interface-sounds | Kenney | No | Yes | Source file: `back_001.ogg` |
| `ui_confirm` | `public/assets/audio/ui/ui_confirm.ogg` | UI confirm / result stinger support | Interface Sounds | https://kenney.nl/assets/interface-sounds | Kenney | No | Yes | Source file: `confirmation_001.ogg` |
| `attack` | `public/assets/audio/se/attack_slash.ogg` | Player attack | Impact Sounds | https://kenney.nl/assets/impact-sounds | Kenney | No | Yes | Source file: `impactWood_light_000.ogg` |
| `enemy_hit` | `public/assets/audio/se/enemy_hit.ogg` | Enemy hit | Impact Sounds | https://kenney.nl/assets/impact-sounds | Kenney | No | Yes | Source file: `impactSoft_medium_000.ogg` |
| `enemy_defeat` | `public/assets/audio/se/enemy_defeat.ogg` | Enemy defeat | Impact Sounds | https://kenney.nl/assets/impact-sounds | Kenney | No | Yes | Source file: `impactSoft_heavy_000.ogg` |
| `hit` | `public/assets/audio/se/player_damage.ogg` | Player damage | Impact Sounds | https://kenney.nl/assets/impact-sounds | Kenney | No | Yes | Source file: `impactSoft_medium_001.ogg` |
| `pickup_exp` / `levelup` | `public/assets/audio/se/pickup_exp.ogg` | EXP / pickup / light level-up cue | Digital Audio | https://kenney.nl/assets/digital-audio | Kenney | No | Yes | Source file: `powerUp2.ogg` |
| `evolution_warning` | `public/assets/audio/evolution/evolution_warning.ogg` | Evolution warning | Digital Audio | https://kenney.nl/assets/digital-audio | Kenney | No | Yes | Source file: `powerUp6.ogg` |
| `evolution` | `public/assets/audio/evolution/evolution_burst.ogg` | Evolution activation | Digital Audio | https://kenney.nl/assets/digital-audio | Kenney | No | Yes | Source file: `powerUp3.ogg` |
| `ultimate_speed` | `public/assets/audio/ultimate/ultimate_speed.ogg` | Speed / raptor special | Sci-fi Sounds | https://kenney.nl/assets/sci-fi-sounds | Kenney | No | Yes | Source file: `laserSmall_000.ogg` |
| `ultimate_hunting` | `public/assets/audio/ultimate/ultimate_hunting.ogg` | Hunting special | Sci-fi Sounds | https://kenney.nl/assets/sci-fi-sounds | Kenney | No | Yes | Source file: `forceField_000.ogg` |
| `ultimate_attack` / `ultimate_zero` | `public/assets/audio/ultimate/ultimate_attack.ogg` | Attack / ZERO special fallback | Sci-fi Sounds | https://kenney.nl/assets/sci-fi-sounds | Kenney | No | Yes | Source file: `explosionCrunch_000.ogg` |
| `boss_warning` / `zero_warning` | `public/assets/audio/boss/boss_warning.ogg` | Boss and ZERO phase warning | Digital Audio | https://kenney.nl/assets/digital-audio | Kenney | No | Yes | Source file: `lowDown.ogg` |
| `boss_defeat` | `public/assets/audio/boss/boss_defeat.ogg` | Boss defeat | Sci-fi Sounds | https://kenney.nl/assets/sci-fi-sounds | Kenney | No | Yes | Source file: `explosionCrunch_001.ogg` |
| `title_home_bgm` | `public/assets/audio/bgm/title_home.ogg` | Title / home BGM | Music Jingles | https://kenney.nl/assets/music-jingles | Kenney | No | Yes | Source file: `jingles_STEEL00.ogg` |
| `normal_stage_bgm` | `public/assets/audio/bgm/normal_stage.ogg` | Normal / ENDLESS battle BGM | Music Jingles | https://kenney.nl/assets/music-jingles | Kenney | No | Yes | Source file: `jingles_NES00.ogg` |
| `zero_bgm` | `public/assets/audio/bgm/zero.ogg` | ZERO battle BGM | Music Jingles | https://kenney.nl/assets/music-jingles | Kenney | No | Yes | Source file: `jingles_HIT15.ogg` |
| `boss_bgm` | `public/assets/audio/bgm/boss.ogg` | Boss warning temporary BGM | Music Jingles | https://kenney.nl/assets/music-jingles | Kenney | No | Yes | Source file: `jingles_STEEL07.ogg` |
| `result_bgm` | `public/assets/audio/bgm/result_jingle.ogg` | Result jingle | Music Jingles | https://kenney.nl/assets/music-jingles | Kenney | No | Yes | Source file: `jingles_PIZZI00.ogg` |

## Candidate Sites Not Adopted In MVP-158

- 効果音ラボ: retained as an SE candidate for later direct per-effect selection. Not adopted in MVP-158 so the first audio pass uses one CC0 license family.
- DOVA-SYNDROME: retained as a BGM candidate for MVP-160 full audio. Not adopted in MVP-158 because this MVP only needs short minimal BGM loops / jingles and simple license tracking.

