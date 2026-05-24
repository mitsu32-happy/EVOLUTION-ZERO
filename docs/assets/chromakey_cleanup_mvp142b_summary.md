# MVP-142b Chromakey / Effect Quality Reinspection

## Regenerated Assets

- `public/assets/effects/adaptation_skills/burst_fang_mine.png`
  - Reason: visible edge pressure and detached extra component. Regenerated rather than color-cleaned.
- `public/assets/effects/adaptation_skills/burst_fang_explosion.png`
  - Reason: clipping risk at the canvas edge. Regenerated with full blast centered in the existing canvas.

## Reviewed But Not Regenerated

- Ruins purple/cyan electro and laser effects: retained because the detected colors are the intended electromagnetic/laser glow.
- Swamp poison effects: retained because the magenta/green-purple pixels define the poison mist/pool body.
- Volcano/jungle boss effects: retained because repeated warm effect cells are intentional animation frames.

## Artifacts

- `docs/assets/chromakey_cleanup_before_mvp142b_contact.png`
- `docs/assets/chromakey_cleanup_after_mvp142b_contact.png`
- `docs/assets/chromakey_regenerated_assets_mvp142b_contact.png`
- `docs/assets/chromakey_cleanup_mvp142b_report.json`
- `docs/assets/backup/mvp142b_effect_review/`
- `docs/assets/generated_raw/mvp142b_effect_regen/`

## Rule

Boss/stage effects should not be cleaned by purple/cyan color alone. If an effect looks clipped, mixed with unrelated fragments, or mismatched to its hit area, regenerate that individual asset instead.
