# MVP-160 Audio Credits

Confirmation date: 2026-05-24

MVP-160 replaces the MVP-158 placeholder-only mix with higher-quality locally stored free assets. BGM was selected from DOVA-SYNDROME and SE from 効果音ラボ after checking the official license / terms pages. External CDN or direct-link runtime playback is not used; all adopted files are copied under `public/assets/audio/`.

## License Summary

### DOVA-SYNDROME BGM / Jingle

- Site: DOVA-SYNDROME
- License URL: https://dova-s.jp/contents/license
- Terms URL: https://dova-s.jp/contents/terms
- Commercial use: allowed under the site license / terms.
- Credit: not required by the site license, but composer/site credit is appreciated.
- Modification: normal use in a game is allowed; creating musical derivative works such as remixes / arrangements is prohibited by the license.
- Key restrictions recorded for release: do not direct-link source audio, do not redistribute or sell the raw music files, do not use the music as the primary content of an audio-player product, and follow individual composer conditions where present.

### 効果音ラボ SE

- Site: 効果音ラボ
- Terms URL: https://soundeffect-lab.info/agreement/
- Commercial use: allowed.
- Credit: not required.
- Modification: allowed for use in works; modified files may not be redistributed as素材.
- Key restrictions recorded for release: no direct-linking, no raw素材 redistribution, no Content ID / trademark style exclusive registration that restricts other users, no AI-training data use.

## Adopted BGM / Jingles

| Game key | Local file | Source material | Author | Source URL | Usage | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `title_bgm` / `title_home_bgm` | `public/assets/audio/bgm/title_home_full.mp3` | Notice | Kyaai | https://dova-s.jp/bgm/detail/2189 | Title / fallback home | Story-like opening cue; used at low volume. |
| `home_bgm` / `ruins_bgm` | `public/assets/audio/bgm/home_cyber_room.mp3` | サイバールーム | sakunoken | https://dova-s.jp/bgm/detail/7053 | Home / ruins ambience | Cyber/ambient tone, also fits ruins. |
| `jungle_bgm` / `volcano_bgm` / `swamp_bgm` / `endless_bgm` | `public/assets/audio/bgm/stage_cyber_function.mp3` | サイバーファンクション | 今川彰人オーケストラ | https://dova-s.jp/bgm/detail/13870 | Normal stages / ENDLESS | Loopable cybernetic battle track. |
| `zero_bgm` / `zero_final_boss_bgm` | `public/assets/audio/bgm/zero_cyber_battle.mp3` | サイバーバトル | shimtone | https://dova-s.jp/bgm/detail/7629 | ZERO / final boss | Heavy near-future combat track. |
| `normal_boss_bgm` / `zero_second_boss_bgm` / `boss_bgm` | `public/assets/audio/bgm/boss_midbattle.mp3` | ラスボスというほどではない中ボスぐらいの戦闘 | シンシンワダ | https://dova-s.jp/bgm/detail/2182 | Normal boss / ZERO second boss | Cinematic mid-boss battle cue. |
| `result_clear_jingle` / `result_bgm` | `public/assets/audio/bgm/clear_jingle.mp3` | ステージクリア | チョコミント | https://dova-s.jp/bgm/detail/5710 | CLEAR result | Short rock victory jingle. |
| `result_zero_clear_jingle` | `public/assets/audio/bgm/zero_clear_jingle.mp3` | G0 D0WN | Addpico | https://dova-s.jp/bgm/detail/11328 | ZERO CLEAR result | Intense jingle reserved for ZERO result. |
| `result_gameover_jingle` | `public/assets/audio/bgm/result_jingle.ogg` | Kenney Music Jingles | Kenney | https://kenney.nl/assets/music-jingles | GAME OVER fallback | MVP-158 CC0 fallback kept for short low-risk gameover cue. |

## Adopted SE

| Game key | Local file | Source file | Source page | Usage |
| --- | --- | --- | --- | --- |
| `ui_select` / `ui_click` | `public/assets/audio/ui/ui_select_full.mp3` | `cursor1.mp3` | https://soundeffect-lab.info/sound/button/ | Cursor / select |
| `ui_decide` / `ui_confirm` | `public/assets/audio/ui/ui_decide_full.mp3` | `decision22.mp3` | https://soundeffect-lab.info/sound/button/ | Decide / confirm |
| `ui_cancel` | `public/assets/audio/ui/ui_cancel_full.mp3` | `cancel3.mp3` | https://soundeffect-lab.info/sound/button/ | Cancel / back |
| `ui_error` | `public/assets/audio/ui/ui_error_full.mp3` | `beep4.mp3` | https://soundeffect-lab.info/sound/button/ | Error / locked action |
| `ui_tab` | `public/assets/audio/ui/ui_tab_full.mp3` | `menu2.mp3` | https://soundeffect-lab.info/sound/button/ | Tab / option chip |
| `ui_reward` / `title_reward` / `frame_reward` / `zero_route_unlock` | `public/assets/audio/ui/ui_reward_full.mp3` | `success1.mp3` | https://soundeffect-lab.info/sound/button/ | Reward / unlock |
| `levelup` | `public/assets/audio/se/levelup_full.mp3` | `levelup1.mp3` | https://soundeffect-lab.info/sound/anime/ | Level up |
| `pickup_exp` / `pickup_heal` / `pickup_magnet` | `public/assets/audio/se/pickup_full.mp3` | `gauge-recovery2.mp3` | https://soundeffect-lab.info/sound/button/ | Pickup |
| `attack` / `enemy_hit` / `boss_damage` | `public/assets/audio/se/enemy_hit_full.mp3` | `sword-slash5.mp3` | https://soundeffect-lab.info/sound/battle/ | Hit / slash feedback |
| `enemy_defeat` | `public/assets/audio/se/enemy_defeat_full.mp3` | `text-impact2.mp3` | https://soundeffect-lab.info/sound/anime/ | Enemy defeat |
| `player_damage` / `hit` | `public/assets/audio/se/player_damage_full.mp3` | `sword-slash6.mp3` | https://soundeffect-lab.info/sound/battle/ | Player damage |
| `boss_warning` / `zero_boss_warning` | `public/assets/audio/boss/boss_warning_full.mp3` | `warning2.mp3` | https://soundeffect-lab.info/sound/button/ | Boss warning |
| `zero_warning` / `zero_phase_warning` / `zero_final_protocol` | `public/assets/audio/boss/zero_warning_full.mp3` | `emergency-alert1.mp3` | https://soundeffect-lab.info/sound/anime/ | ZERO warning |
| `boss_defeat` / `gameover` | `public/assets/audio/boss/boss_defeat_full.mp3` | `metal-logo3.mp3` | https://soundeffect-lab.info/sound/anime/ | Boss defeat / gameover |
| `special_abyss_slash` | `public/assets/audio/ultimate/abyss_slash_full.mp3` | `large-sword-slash1.mp3` | https://soundeffect-lab.info/sound/battle/ | アビスラッシュ |
| `special_ignis_charge` | `public/assets/audio/ultimate/ignis_charge_full.mp3` | `armor-dash-2.mp3` | https://soundeffect-lab.info/sound/battle/ | イグニスチャージ |
| `special_omega_burst` | `public/assets/audio/ultimate/omega_burst_full.mp3` | `doon1.mp3` | https://soundeffect-lab.info/sound/anime/ | オメガバースト |

## Mix / Runtime Notes

- Initial mix remains conservative: master 0.8, BGM 0.45, SE 0.65, UI 0.55.
- Per-file `volume` values are set in `src/audio/audio_catalog.js` to keep pickup / hit spam under control.
- Boss BGM now persists while a boss is active instead of using only an 8-second temporary cue.
- ZERO second boss and final boss use distinct BGM IDs.
- Result jingle selection is now CLEAR / GAME OVER / ZERO CLEAR aware.
- Mobile audio unlock remains tied to first user interaction through `AudioManager.unlockAudio()` and existing screen pointer/tap flows.

## Deferred To Later Audio Polish

- True stage-unique BGM for all four normal stages if a stronger per-biome soundtrack is selected.
- Dedicated gameover jingle replacement from a non-placeholder source.
- Environmental ambience.
- More granular enemy-family and boss-attack SE.
- Real-device loudness pass on iOS Safari and Android Chrome speakers.

## MVP-160b SE Polish Additions

Confirmation date: 2026-05-24

MVP-160b keeps the high-quality DOVA-SYNDROME / 効果音ラボ direction and avoids returning to placeholder CC0-only sound. The main runtime change is short-tail playback control: `durationHintMs`, `fadeOutMs`, `interruptGroup`, and `stopPrevious` are used in `src/audio/audio_catalog.js` / `src/audio/audio_manager.js` so attack and ultimate SE react to the motion instead of lingering over the next action.

| Game key | Local file | Source file | Source page | Usage |
| --- | --- | --- | --- | --- |
| `raptor_attack_se` | `public/assets/audio/se/raptor_claw_full.mp3` | `knife-slash-1.mp3` | https://soundeffect-lab.info/sound/battle/ | Velociraptor claw / fast slash normal attack |
| `triceratops_attack_se` | `public/assets/audio/se/triceratops_impact_full.mp3` | `best-step-into1.mp3` | https://soundeffect-lab.info/sound/battle/ | Triceratops heavy impact / horn normal attack |
| `tyrannosaurus_bite_se` | `public/assets/audio/se/tyrannosaurus_bite_full.mp3` | `knife-stab-2.mp3` | https://soundeffect-lab.info/sound/battle/ | Tyrannosaurus bite / heavy jaw impact |

License conditions are the same 効果音ラボ terms recorded above: commercial use allowed, credit not required, no direct-link runtime use, no raw素材 redistribution, and no Content ID / exclusive registration that restricts other users.

### MVP-160b Mix Notes

- Normal attacks now choose SE by dinosaur / normal attack pattern: raptor claw, triceratops impact, and tyrannosaurus bite.
- `enemy_hit`, pickup, defeat, player damage, and ZERO / normal ultimate SE now have shorter runtime tails and conservative volumes.
- ZERO ultimate SE share the `ultimate` interrupt group, so repeated/debug activations stop the previous long tail instead of stacking.
- The tyrannosaurus `trexBiteShock` timing now uses `tyrannosaurus_bite_se`, tuned to a short low-impact cue.
