# ND10pre Home / Research UI Fix

## Scope

Branch: `feature/new-dinos-six-v1`

This pass fixes user-visible issues found before ND10 final QA. It does not merge to `main`, update Version, update news, restore Daily, restore Research Pt, unlock ZERO evolutions by default, or enable reserved Companion synergies.

## Locked Dino Silhouette

The new six locked dino cards now use their existing hero/portrait textures as the source for locked presentation instead of falling back to the simple geometry silhouette.

Implementation:

- `DinoSelectScreen.getLockedDinoTexture()` returns the dino hero texture for research-locked dinos.
- Locked hero/card sprites are tinted dark teal and lowered in alpha.
- Spinosaurus keeps its existing locked silhouette asset.
- Unlock hints were normalized to `DNA xxxxで解放`.

QA artifact:

- `docs/assets/nd10pre_locked_silhouette_contact.png`

## Unknown Research Card Cost

Unknown-domain unlock cards now use the same DNA-only cost treatment as other research cards.

Implementation:

- Cost display uses DNA icon + numeric DNA value for unknown, adaptation, and body cards.
- Research Pt cost text remains hidden.
- Study status stays inside the button area.

QA artifact:

- `docs/assets/nd10pre_dna_layout_contact.png`

## DNA Layout

Single-currency resource display was re-centered after Research Pt removal.

Implementation:

- Research screen DNA header moved toward the center of the core panel.
- Home resource icon/text group moved to the center of the resource panel.
- Empty Research Pt area is no longer shown.

## Home Lower Area

Daily / Record / Unlock panels remain removed. A non-interactive future event area was added so the lower half does not feel empty.

Implementation:

- The area is drawn as a restrained research-facility panel.
- Text: `イベント準備区画`
- Body copy indicates that the lower deck is reserved for future event display.
- It is not clickable and does not add a new feature.

## Home Background

The home background was regenerated as production illustration.

Generation prompt summary:

- Dark sci-fi dinosaur evolution research facility.
- Bio-capsules, DNA analysis columns, metallic catwalks, cyan/teal glow.
- Portrait mobile background with readable low-noise UI-safe areas.
- No text, logo, buttons, or foreground characters.

Final asset:

- `public/assets/ui/home/home_background.png`

QA artifact:

- `docs/assets/nd10pre_home_background_contact.png`

## Unknown Tab Cards

The unknown tab had only three visible cards because non-body categories were capped at three items. Unknown-domain research now uses the existing scrollable card list.

Expected clean-save unknown cards:

- `spinosaurus_unlock`
- `ankylosaurus_unlock`
- `parasaurolophus_unlock`
- `stegosaurus_unlock`
- `pteranodon_unlock`
- `compsognathus_unlock`
- `ornithomimus_unlock`

The new six unlock cards are all purchasable through the same DNA-only research flow.

QA artifact:

- `docs/assets/nd10pre_research_unknown_cards_contact.png`

## QA Results

- Unknown tab data check: 7 cards total, new six 6/6 present.
- New six research purchase check: 6/6 returned success.
- Research Pt visible text in active Home / Research / Dino Select user-facing strings was not restored.
- Build and runtime checks are recorded in the task completion report.

## Remaining Notes

- The lower home panel is intentionally temporary and should be replaced by a real event display in a later milestone.
- The current locked silhouette is runtime-tinted from hero art. If art direction wants a bespoke silhouette file per dino later, those can be generated without changing save data.


## ND10pre Home Banner / Segmented Background Follow-up

- Home top-right DNA display was removed.
- News button was moved to the top-right header area.
- Home background was split into three connected generated areas: top, hero/sortie, and bottom.
- The lower event placeholder was replaced with a generated new-six-dino banner.
- The banner opens Research > Unknown Domain so the six new dino unlock cards are directly visible.
- Unknown-domain dino cards no longer duplicate DNA cost text inside the description area; DNA cost is shown by the right-side DNA icon/value.
- Home tutorial bounds were updated for the new news button position and banner area.
