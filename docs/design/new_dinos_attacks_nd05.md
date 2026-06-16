# ND05 New Playable Dinosaurs Normal Attacks

Date: 2026-06-17
Branch: `feature/new-dinos-six-v1`

## Scope

ND05 adds dedicated normal attack visuals and finalizes the base normal attack definitions for the six new playable dinosaurs:

- `ankylosaurus`
- `parasaurolophus`
- `stegosaurus`
- `pteranodon`
- `compsognathus`
- `ornithomimus`

This pass does not add evolution branch attacks, ZERO evolution attacks, unlock routes, save changes, version updates, news, or main integration.

## Generated Assets

| Dinosaur ID | Effect asset | Icon asset |
| --- | --- | --- |
| `ankylosaurus` | `public/assets/effects/attacks/ankylosaurus_tail_club.png` | `public/assets/ui/skills/icon_ankylosaurus_tail_club.png` |
| `parasaurolophus` | `public/assets/effects/attacks/parasaurolophus_sonic_pulse.png` | `public/assets/ui/skills/icon_parasaurolophus_sonic_pulse.png` |
| `stegosaurus` | `public/assets/effects/attacks/stegosaurus_plate_quake.png` | `public/assets/ui/skills/icon_stegosaurus_plate_quake.png` |
| `pteranodon` | `public/assets/effects/attacks/pteranodon_wind_lance.png` | `public/assets/ui/skills/icon_pteranodon_wind_lance.png` |
| `compsognathus` | `public/assets/effects/attacks/compsognathus_pack_bite.png` | `public/assets/ui/skills/icon_compsognathus_pack_bite.png` |
| `ornithomimus` | `public/assets/effects/attacks/ornithomimus_sprint_kick.png` | `public/assets/ui/skills/icon_ornithomimus_sprint_kick.png` |

QA artifacts:

- `docs/assets/nd05_new_dinos_attack_effect_contact.png`
- `docs/assets/nd05_new_dinos_attack_effect_report.json`

The effect report records source path, output paths, bounding box, missing assets, edge issues, and minimum output margin.

## Normal Attack Specifications

| Dinosaur ID | Attack ID | Shape | Role | Dedicated effect |
| --- | --- | --- | --- | --- |
| `ankylosaurus` | `ankylosaurusTailClub` | circle | close heavy control / knockback | tail-club shock burst |
| `parasaurolophus` | `parasaurolophusSonicPulse` | cone | mid-range sonic support | crest resonance fan |
| `stegosaurus` | `stegosaurusPlateQuake` | circle | short-range area control | plate-energy quake ripple |
| `pteranodon` | `pteranodonWindLance` | rectangle | narrow long-range pressure | wing-driven wind lance |
| `compsognathus` | `compsognathusPackBite` | arc | low-damage high-frequency cleanup | compact bite/slash streaks |
| `ornithomimus` | `ornithomimusSprintKick` | rectangle | fast forward strike | sprint-kick dash impact |

## Balance Policy

The ND02 base values were kept deliberately modest. ND05 focuses on replacing borrowed effects rather than raising power:

- no existing dinosaur attack was changed
- no damage spike was added
- no unlock state was changed
- no save structure was changed
- new attacks remain role-focused rather than strictly stronger than existing options

Risk notes:

- `ankylosaurus` has high knockback but short range and slower cooldown.
- `parasaurolophus` has group reach but low damage.
- `stegosaurus` can hit more targets nearby but has a slower cadence.
- `pteranodon` has long reach but a narrow rectangle.
- `compsognathus` has fast cadence but low per-hit damage.
- `ornithomimus` has quick forward pressure but limited width.

## Manifest Connection

Added `ASSET_KEYS.normalAttackEffects`:

- `ankylosaurusTailClub`
- `parasaurolophusSonicPulse`
- `stegosaurusPlateQuake`
- `pteranodonWindLance`
- `compsognathusPackBite`
- `ornithomimusSprintKick`

Added `ASSET_KEYS.normalAttackIcons`:

- `ankylosaurusTailClub`
- `parasaurolophusSonicPulse`
- `stegosaurusPlateQuake`
- `pteranodonWindLance`
- `compsognathusPackBite`
- `ornithomimusSprintKick`

Updated `src/data/normal_attacks.js` so the six ND02 fallback definitions now point to dedicated ND05 assets.

## Effect QA Summary

| Dinosaur ID | Missing frame / asset | Edge issue | Minimum margin |
| --- | ---: | ---: | ---: |
| `ankylosaurus` | 0 | 0 | 42px |
| `parasaurolophus` | 0 | 0 | 42px |
| `stegosaurus` | 0 | 0 | 42px |
| `pteranodon` | 0 | 0 | 42px |
| `compsognathus` | 0 | 0 | 42px |
| `ornithomimus` | 0 | 0 | 42px |

## ND06 Handoff

ND06 should generate and connect:

- speed / hunting / attack branch hero assets
- speed / hunting / attack branch portraits
- speed / hunting / attack branch gameplay sprite sheets
- ZERO branch hero / portrait / gameplay sprite sheets
- branch-specific attack or special effect assets where needed

ND06 should not assume these ND05 base normal effects are sufficient for evolved forms.

## QA Result

Static checks:

- `node --check src/data/asset_manifest.js`
- `node --check src/data/normal_attacks.js`
- `node --check src/systems/combat_system.js`
- `git diff --check`
- `npm.cmd run build`

Asset resolution check:

- all six `normalAttackEffects.*` keys resolve in `ASSET_MANIFEST.normalAttackEffects`
- all six effect files exist under `public/assets/effects/attacks/`
- all six `normalAttackIcons.*` keys resolve in `ASSET_MANIFEST.normalAttackIcons`
- all six icon files exist under `public/assets/ui/skills/`

Browser PlayScene checks used `debugDino={id}` with `debugAutoPlay=1`, `debugNoPickupCollect=1`, and `debugInvincible=1`:

- `ankylosaurus`: PlayScene boot OK, runtime error/warn 0
- `parasaurolophus`: PlayScene boot OK, runtime error/warn 0
- `stegosaurus`: PlayScene boot OK, runtime error/warn 0
- `pteranodon`: PlayScene boot OK, runtime error/warn 0
- `compsognathus`: PlayScene boot OK, runtime error/warn 0
- `ornithomimus`: PlayScene boot OK, runtime error/warn 0

Notes:

- A browser-control environment Statsig network message appeared once during automation. It was not present in the app tab console logs and is not counted as an EVOLUTION ZERO runtime warning.
- Screenshot capture timed out once during visual QA, but follow-up page state and app console checks remained healthy.

Build result:

- build succeeded
- existing Vite chunk-size warning remains
