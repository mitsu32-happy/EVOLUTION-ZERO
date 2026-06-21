# PF04 Compsognathus mini-pack design

## Goal

Compsognathus should feel like a small pack: the controlled dinosaur is joined by two smaller Compsognathus-like sub actors that visually fight alongside the player.

## PF04 decision

PF04 does not implement mini-pack gameplay. This is intentionally deferred because the same workstream is reducing endgame iPhone heat and whiteout risk. Adding two active actors with scans, attacks, and animations needs a dedicated performance budget.

PF04b keeps this as a known deferred item. The performance branch now has enemy visual culling and offscreen update throttling work in flight, so adding mini-pack actors before measuring that impact would blur QA results.

## Recommended design

- Create a PlayScene-local `miniPack` actor list only when the selected dino is `compsognathus` or a Compsognathus evolution.
- Do not reuse the save structure. The pack is derived from the selected dino/evolution and requires no saved state.
- Use the current player/evolution sprite sheet at reduced display size instead of companion species data.
- Keep the two mini actors visual-first:
  - low attack damage
  - low attack frequency
  - short target range
  - shared target cache refreshed at a low rate
  - no pickup scan
- Follow the player using offsets similar to companion movement but without occupying the companion slot.
- On evolution, refresh the mini actor texture from the active evolution sprite key.

## Performance guardrails

- One shared target scan every 0.35-0.5 seconds.
- Disable decorative mini hit popups under performance pressure.
- Do not spawn independent damage text for every mini hit in high-load scenes.
- Cap mini effects at 2 active effects.

## Balance proposal

- Each mini actor damage: 12-18% of player normal attack damage.
- Attack interval: 1.4-1.8 seconds.
- Max targets: 1 per actor.
- No direct synergy multiplier until a later balance pass.

## PF05 proposal

Implement a visual prototype behind `debugCompsognathusMiniPack=1`, profile target scans/effects, then decide whether to ship it as a real Compsognathus trait.

## PF05 debug prototype notes

- Implement in `src/scenes/play_scene.js` only as PlayScene-local temporary combat actors.
- Enable only when `debugCompsognathusMiniPack=1` and the selected dino or selected evolution dinoId is `compsognathus`.
- Keep the actors out of companion roster, companion synergy, save data, and asset manifest.
- Use the active Compsognathus player/evolution sheet at reduced size; refresh the miniPack texture after `player.setSheetKey` during evolution.
- Use one shared target cache at a 0.45 second refresh interval and actor-local 1.6 second attack timers.
- Apply low direct damage without companion synergy, adaptation, boss bonus, or critical handling.
- Expose debug stats as `miniPack.active`, `miniPack.count`, `miniPack.scans`, `miniPack.hits`, and `miniPack.effects` in runtime debug stats.

## PF06 formal enablement notes

- Enable miniPack by default for Compsognathus in normal play.
- Keep the activation derived from `selectedDino` or `selectedEvolution.dinoId`; do not require `debugCompsognathusMiniPack=1`.
- Keep non-Compsognathus dinosaurs disabled even when running debug URLs.
- Keep PF05 boundaries: no save data, companion roster, companion synergy, or asset manifest connection.
