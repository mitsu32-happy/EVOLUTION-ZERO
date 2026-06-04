# MVP-A11b Spinosaurus Icon Artifact Audit

## Scope

- Dino select top cards.
- Play HUD upper-left base dinosaur icon.
- BRANCH evolution card portrait.
- Codex top selector.
- Home hero display.

## Findings

- The spinosaurus hero images were not the primary source of the visible top-edge artifact in small icon contexts.
- The base and evolved spinosaurus portrait PNGs contained detached alpha components above the main dinosaur body.
- Dino select top cards and play HUD base/BRANCH icons use portrait textures, so the detached top fragments became visible when those portraits were scaled into small frames.
- The play HUD upper-left portrait already resolves from `selectedDino`, so it keeps the run's base dinosaur after evolution. This behavior must remain.
- BRANCH portrait rendering used a fixed `52x52` square size in a `62x62` icon frame, which made large silhouettes such as spinosaurus fins and triceratops horns feel too large inside the card.
- Codex selector uses contain-style fitting. No sprite-sheet frame source was found there, but the cleaned portrait policy should be reused for future small icon contexts.

## Fix Summary

- Cleaned detached top alpha components from these portrait sources:
  - `public/assets/dinos/portraits/spinosaurus.png`
  - `public/assets/dinos/evolutions/portraits/spinosaurus_speed_portrait.png`
  - `public/assets/dinos/evolutions/portraits/spinosaurus_hunting_portrait.png`
  - `public/assets/dinos/evolutions/portraits/spinosaurus_attack_portrait.png`
  - `public/assets/dinos/evolutions/portraits/spinosaurus_zero_portrait.png`
- Updated manifest notes for the cleaned spinosaurus portrait assets.
- Changed play HUD portrait rendering to aspect-preserving small-frame fitting.
- Reduced BRANCH card portrait bounds and kept it aspect-preserving so evolved portraits remain inside the generated icon frame.

## QA Targets

- Spinosaurus dino select top card: no detached top artifact.
- Play HUD upper-left spinosaurus icon: no detached top artifact and remains base spinosaurus after evolution.
- BRANCH card: evolved portrait visible, not fallback, not clipped by the icon frame.
- Other dinosaurs: base HUD icon and BRANCH portrait remain visible.

## Artifacts

- Contact sheet: `docs/assets/a11b_spino_icon_artifact_contact.png`
- Report JSON: `docs/assets/a11b_spino_icon_artifact_report.json`
