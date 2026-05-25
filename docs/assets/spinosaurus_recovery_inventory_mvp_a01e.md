# Spinosaurus Recovery Inventory MVP-A01e

Created: 2026-05-25
Scope: recovery investigation only after Codex crash. No delete, overwrite, git add, commit, manifest edit, build, or runtime substitution was performed.

## Summary

- Git status spinosaurus entries: 46 untracked files.
- A01c source candidates: 5 ignored raw generated PNGs under `docs/assets/generated_raw/mvp_a01c_spinosaurus_quality/`.
- A01d produced runtime assets: 35 untracked public PNGs listed in `docs/assets/spinosaurus_a01d_report.json`.
- JSON reports checked: parse OK for A01b, addition, A01c, and A01d reports.
- PNG/JPEG mismatch recorded: `docs/assets/spinosaurus_a01d_ingame_compare.png` has JPEG signature despite `.png` extension.
- Chroma key readiness: no checked spinosaurus file contains sampled `#ff00ff` chroma background.

## Recovery Reading

- A01c was the adopted visual direction: 5 source candidate images were marked `adopt_candidate_for_production_extraction`.
- A01d sliced/extracted runtime transparent PNGs from A01c candidates and preserved manifest paths, but did not generate new chroma-key source sheets.
- The current public assets are implementation candidates because they are transparent runtime PNGs already placed on manifest-compatible paths.
- The current public assets are not final adoption candidates for this recovery task because their source was not `#ff00ff` chroma-key isolated and dark/black source material can erase body, sail, water, or glow details during cleanup.
- The next generation pass should create magenta-background source sheets, then remove chroma key and re-slice.

## Classification Counts

| Classification | Count | Meaning |
| --- | ---: | --- |
| keep_candidate | 12 | Keep as evidence/reference: reports, contact sheets, comparisons, raw A01c source candidates. |
| discard_candidate | 1 | Do not use as final source; may later fix/rename only after approval. |
| regenerate_candidate | 5 | Source concepts to regenerate with `#ff00ff` chroma background. |
| implemented_candidate | 35 | Runtime public assets produced by A01d and currently usable only as temporary implementation evidence. |
| pending_review | 0 | No spinosaurus file remained unclassified. |

## Keep Candidates

| Path | Type | Size KB | Format | Git | Adoption | Problem | Next action |
| --- | --- | ---: | --- | --- | --- | --- | --- |
| docs/assets/spinosaurus_a01b_contact.png | contact sheet | 204.5 | PNG 960x570 | untracked | evidence only | older/procedural contact; opaque dark-heavy image | keep for comparison, do not use as final source |
| docs/assets/spinosaurus_a01b_report.json | report | 60.1 | JSON | untracked | evidence only | earlier pass, not A01e source | keep for audit trail |
| docs/assets/spinosaurus_addition_contact.png | contact sheet | 239.0 | PNG 900x912 | untracked | evidence only | older procedural/addition contact | keep for comparison |
| docs/assets/spinosaurus_addition_report.json | report | 38.7 | JSON | untracked | evidence only | earlier procedural/addition report | keep for audit trail |
| docs/assets/spinosaurus_a01c_contact.png | contact sheet | 1066.4 | PNG 894x1434 | untracked | adopted direction evidence | opaque, not chroma-key source | keep as A01c reference |
| docs/assets/spinosaurus_a01c_current_contact.png | contact sheet | 429.0 | PNG 960x1330 | untracked | comparison evidence | opaque dark-heavy current comparison | keep for before/after |
| docs/assets/spinosaurus_a01c_report.json | report | 23.6 | JSON | untracked | key recovery record | says use A01c candidates only for extraction/QA | keep as source-of-truth |
| docs/assets/spinosaurus_quality_compare_mvp_a01c.png | comparison | 601.9 | PNG 836x902 | untracked | comparison evidence | opaque comparison image | keep for review |
| docs/assets/spinosaurus_a01d_contact.png | contact sheet | 511.6 | PNG 940x1152 | untracked | A01d extraction evidence | opaque contact; derived from non-chroma source | keep for review |
| docs/assets/spinosaurus_a01d_report.json | report | 14.8 | JSON | untracked | key recovery record | confirms A01d extraction, not new generation | keep as source-of-truth |
| docs/assets/generated_raw/mvp_a01c_spinosaurus_quality/spinosaurus_base_candidate.png | raw source candidate | 2359.3 | PNG 1536x1024 | ignored | visual reference | opaque, no sampled `#ff00ff`; not chroma-key ready | use as design reference only |
| docs/assets/generated_raw/mvp_a01c_spinosaurus_quality/spinosaurus_speed_candidate.png | raw source candidate | 2515.3 | PNG 1536x1024 | ignored | visual reference | opaque, no sampled `#ff00ff`; not chroma-key ready | use as design reference only |
| docs/assets/generated_raw/mvp_a01c_spinosaurus_quality/spinosaurus_hunting_candidate.png | raw source candidate | 2752.3 | PNG 1536x1024 | ignored | visual reference | opaque, no sampled `#ff00ff`; not chroma-key ready | use as design reference only |
| docs/assets/generated_raw/mvp_a01c_spinosaurus_quality/spinosaurus_attack_candidate.png | raw source candidate | 2955.1 | PNG 1536x1024 | ignored | visual reference | opaque, no sampled `#ff00ff`; not chroma-key ready | use as design reference only |
| docs/assets/generated_raw/mvp_a01c_spinosaurus_quality/spinosaurus_zero_candidate.png | raw source candidate | 2810.0 | PNG 1536x1024 | ignored | visual reference | opaque, no sampled `#ff00ff`; not chroma-key ready | use as design reference only |

## Discard / Fix Candidate

| Path | Type | Size KB | Format | Git | Adoption | Problem | Next action |
| --- | --- | ---: | --- | --- | --- | --- | --- |
| docs/assets/spinosaurus_a01d_ingame_compare.png | QA comparison | 69.8 | JPEG data with `.png` name | untracked | evidence only | extension/content mismatch | record as fix candidate; do not change yet |

## Regenerate Candidates

Regenerate these five source concepts first. The current files are useful as visual references, but not as final sources because they are opaque and not chroma-key prepared.

| Concept | Current reference | Required source |
| --- | --- | --- |
| base | docs/assets/generated_raw/mvp_a01c_spinosaurus_quality/spinosaurus_base_candidate.png | `#ff00ff` background sheet; no near-magenta body colors |
| speed | docs/assets/generated_raw/mvp_a01c_spinosaurus_quality/spinosaurus_speed_candidate.png | `#ff00ff` background sheet; preserve body, sail, water, glow |
| hunting | docs/assets/generated_raw/mvp_a01c_spinosaurus_quality/spinosaurus_hunting_candidate.png | `#ff00ff` background sheet; preserve body, sail, water, glow |
| attack | docs/assets/generated_raw/mvp_a01c_spinosaurus_quality/spinosaurus_attack_candidate.png | `#ff00ff` background sheet; preserve body, sail, water, glow |
| zero | docs/assets/generated_raw/mvp_a01c_spinosaurus_quality/spinosaurus_zero_candidate.png | `#ff00ff` background sheet; preserve body, sail, water, glow |

## Implemented Candidates

These 35 public assets were produced by A01d and are currently classified as implementation evidence, not final accepted assets.

| Path | Type | Size KB | Format | Git | Adoption | Problem | Next action |
| --- | --- | ---: | --- | --- | --- | --- | --- |
| public/assets/dinos/dino_select/spinosaurus_hero.png | hero | 572.0 | PNG 1024x768 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/dinos/portraits/spinosaurus.png | portrait | 184.9 | PNG 512x512 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/dinos/spinosaurus_sheet.png | sheet | 267.4 | PNG 1024x1024 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/dinos/spinosaurus.png | sprite | 251.5 | PNG 512x512 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/effects/attacks/spinosaurus_attack_water_slash_sheet.png | attack effect sheet | 462.7 | PNG 1024x1024 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/effects/attacks/spinosaurus_attack_splash_hit_sheet.png | attack effect sheet | 333.7 | PNG 1024x1024 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/dinos/evolutions/heroes/spinosaurus_speed_hero.png | speed hero | 786.2 | PNG 1024x768 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/dinos/evolutions/portraits/spinosaurus_speed_portrait.png | speed portrait | 191.0 | PNG 512x512 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/dinos/evolutions/sheets/spinosaurus_speed_sheet.png | speed sheet | 320.2 | PNG 1024x1024 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/dinos/evolutions/spinosaurus_speed.png | speed sprite | 280.3 | PNG 512x512 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/ui/hud/special_icons/special_speed_spinosaurus.png | speed special icon | 66.7 | PNG 256x256 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/effects/specials/special_spinosaurus_speed_tidal_rush_sheet.png | speed special effect sheet | 594.1 | PNG 1024x1024 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/effects/specials/special_spinosaurus_tidal_rush_sheet.png | speed special alias sheet | 594.1 | PNG 1024x1024 | untracked | implemented_candidate | duplicate/alias style path | decide after new sheet generation |
| public/assets/dinos/evolutions/heroes/spinosaurus_hunting_hero.png | hunting hero | 848.5 | PNG 1024x768 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/dinos/evolutions/portraits/spinosaurus_hunting_portrait.png | hunting portrait | 133.0 | PNG 512x512 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/dinos/evolutions/sheets/spinosaurus_hunting_sheet.png | hunting sheet | 275.4 | PNG 1024x1024 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/dinos/evolutions/spinosaurus_hunting.png | hunting sprite | 354.9 | PNG 512x512 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/ui/hud/special_icons/special_hunting_spinosaurus.png | hunting special icon | 34.9 | PNG 256x256 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/effects/specials/special_spinosaurus_hunting_maelstrom_sheet.png | hunting special effect sheet | 382.3 | PNG 1024x1024 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/effects/specials/special_spinosaurus_maelstrom_sheet.png | hunting special alias sheet | 382.3 | PNG 1024x1024 | untracked | implemented_candidate | duplicate/alias style path | decide after new sheet generation |
| public/assets/dinos/evolutions/heroes/spinosaurus_attack_hero.png | attack hero | 742.0 | PNG 1024x768 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/dinos/evolutions/portraits/spinosaurus_attack_portrait.png | attack portrait | 129.6 | PNG 512x512 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/dinos/evolutions/sheets/spinosaurus_attack_sheet.png | attack sheet | 148.3 | PNG 1024x1024 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/dinos/evolutions/spinosaurus_attack.png | attack sprite | 321.0 | PNG 512x512 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/ui/hud/special_icons/special_attack_spinosaurus.png | attack special icon | 117.0 | PNG 256x256 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/effects/specials/special_spinosaurus_attack_hydro_break_sheet.png | attack special effect sheet | 261.9 | PNG 1024x1024 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/effects/specials/special_spinosaurus_hydro_break_sheet.png | attack special alias sheet | 261.9 | PNG 1024x1024 | untracked | implemented_candidate | duplicate/alias style path | decide after new sheet generation |
| public/assets/dinos/evolutions/heroes/spinosaurus_zero_hero.png | zero hero | 1006.0 | PNG 1024x768 | untracked | implemented_candidate | darker zero variant; derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/dinos/evolutions/portraits/spinosaurus_zero_portrait.png | zero portrait | 182.2 | PNG 512x512 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/dinos/evolutions/sheets/spinosaurus_zero_sheet.png | zero sheet | 243.2 | PNG 1024x1024 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/dinos/evolutions/spinosaurus_zero.png | zero sprite | 361.4 | PNG 512x512 | untracked | implemented_candidate | darker zero variant; derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/ui/hud/special_icons/special_zero_spinosaurus.png | zero special icon | 90.2 | PNG 256x256 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/effects/specials/special_zero_spinosaurus_core_sheet.png | zero special effect sheet | 970.7 | PNG 1024x1024 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/effects/specials/special_zero_spinosaurus_tide_sheet.png | zero special effect sheet | 870.7 | PNG 1024x1024 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |
| public/assets/effects/specials/special_zero_spinosaurus_burst_sheet.png | zero special effect sheet | 1006.8 | PNG 1024x1024 | untracked | implemented_candidate | derived from non-chroma source | replace after chroma-key regeneration |

## Next Regeneration Policy

1. Reject black/dark-background source sheets for final use.
2. Reject any source sheet that was not generated for chroma-key removal.
3. Regenerate base, speed, hunting, attack, and zero sheets on exact `#ff00ff` background.
4. Do not use near-`#ff00ff` colors on the dinosaur body, sail, water trails, or glow.
5. After chroma removal, QA must confirm body, sail, water flow, and glow remain visible.
6. Only after user approval should regenerated sheets be sliced into runtime PNGs and connected to manifest-compatible paths.
