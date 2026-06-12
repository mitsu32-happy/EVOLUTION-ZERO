# MVP-P07b Companion Dino Final QA

## QA Environment

- Branch: `feature/companion-dino-p01`
- Main merge: not performed
- Main push: not performed
- Local URL: `http://localhost:5176/EVOLUTION-ZERO/`
- Date: 2026-06-12

## Judgment Standard

P07b uses a release-quality bar, not a minimum-working-feature bar.

Main integration is allowed only when companion dinos feel like a finished product feature:

- Normal player flow is stable.
- Existing saves remain compatible.
- ZERO / ENDLESS stability is reliable.
- Mobile UI feels natural.
- Controller / virtual mouse does not create blocking states.
- The 10 companions communicate different roles through visuals, effects, and behavior.
- Animation and feedback are not placeholder quality.

## Summary Judgment

Main integration judgment: **not ready for main release**.

Reason:

- Core save, hatch, set, and play-scene wiring is functioning.
- No runtime error/warn was observed in the checked routes.
- However, companion dinos still rely on static sprite presentation and short helper effects.
- The 10 companions differ by data, icon, sprite, and behavior, but the in-play animation/feedback is not yet product-level enough to remove the unfinished impression.
- Long ZERO / ENDLESS soak could not be completed as a clean 3-5 minute automated run because the run either ended quickly or stopped on level-up selection. This is not a crash, but it leaves stability confidence below release level.

## Debug-Free Natural Flow

Confirmed:

- Title and intro were entered by normal click.
- Home opened without console error/warn.
- First-run tutorial appeared and could be advanced/skipped.
- Sortie route opened normally.
- Stage select opened normally.
- Dino select opened normally.
- PlayScene started from normal UI click with no companion selected.
- No runtime error/warn was observed.

Not fully completed in P07b:

- A fully debug-free egg pickup -> result -> research hatch -> set -> restart persistence pass was not completed through natural probability/timing.
- The natural egg drop is probability and first-egg-pity based, so a repeatable release test still needs a longer hands-on run or a test harness that does not alter companion state directly.

Result:

- Normal UI route is stable to PlayScene.
- Full natural egg lifecycle remains a required release QA item.

## Existing Save Compatibility

Method:

- Used an old-save-like structure without `companion`.
- Loaded it through `SaveManager`.
- Confirmed companion defaults are added without overwriting existing DNA/research/tutorial data.
- Granted egg, started instant incubation, completed hatch, selected companion, and upgraded companion in the same save object.

Result:

- `companion` missing state is normalized safely.
- Existing DNA/research values were preserved.
- Invalid companion selection and levels are sanitized by `normalizeCompanionState`.
- No save-breaking issue was found in code-level compatibility checks.

## ZERO / ENDLESS Soak

ZERO:

- Route: `debugPerformance=1`, `debugAutoPlay=1`, `debugCompanionId=rex_hatchling`, ZERO volcano expert.
- Result: no console error/warn, no whiteout observed.
- The run reached Game Over at 00:13, so it did not become a valid 3-5 minute high-density soak.

ENDLESS:

- Route: `debugPerformance=1`, `debugAutoPlay=1`, `debugInvincible=1`, `debugCompanionId=exp_chaser`, ENDLESS jungle expert.
- Result: no console error/warn, no whiteout observed.
- The run stopped repeatedly at level-up selection, so it did not become a clean unattended 3-5 minute soak.

Conclusion:

- No crash was observed.
- High-density long-run stability is still not fully proven for release.
- Before main integration, add or use a QA route that can auto-select level-up cards during soak, or perform a manual 3-5 minute run for ZERO and ENDLESS.

## Mobile Width QA

Viewport:

- 390 x 844 portrait.

Confirmed:

- Home companion modal opens.
- 10-companion list is usable with paging.
- Research hatch card fits in the screen.
- Hatch duplicate reward dialog fits in the screen.
- No runtime error/warn.

Quality notes:

- The companion modal is readable, but text density is high.
- The hatch card is usable, but vertical spacing is tight around the bottom navigation.
- For release quality, the modal should receive an additional mobile polish pass before main integration.

## Controller / Virtual Mouse QA

Confirmed:

- No blocking state was seen from pointer/virtual mouse style interaction in the checked home/research modal flows.

Not confirmed:

- Real controller operation was not verified in P07b.
- Full virtual mouse/controller interaction across companion modal, research hatch card, hatch dialog, and upgrade button remains a required release QA item.

## Animation / Product Quality

See `docs/design/companion_animation_gap_p07b.md`.

Result:

- Current animation state is not release quality.
- Static sprite follow plus effect-only feedback is acceptable for feature-branch validation, but not enough for main release as a product-level companion system.

## Issues Found

| Issue | Severity | Action |
| --- | --- | --- |
| Companion display names / labels had visible encoding artifacts in UI-facing data | High | Fixed in `src/data/companion_dinos.js`. |
| Full natural egg lifecycle not completed without debug assistance | Medium | Documented as required release QA. |
| ZERO/ENDLESS 3-5 minute soak not completed cleanly | Medium | Documented as required release QA. |
| Mobile modal is dense | Medium | Documented as release polish need. |
| Companion animation remains static/placeholder-like | High | Main integration blocker for release-quality bar. |

## Fixes Made In P07b

- Repaired companion display names, type labels, descriptions, skill names, and effect summaries in `src/data/companion_dinos.js`.
- No behavior numbers or save schema were changed.

## Required Before Main Integration

1. Implement P04b animation/feedback pass:
   - idle/follow motion
   - attack/heal/support tell
   - clearer effect timing
   - lightweight animation sheet or equivalent in-play motion
2. Add or perform a true 3-5 minute ZERO and ENDLESS soak with companion enabled.
3. Complete debug-free egg lifecycle QA:
   - egg pickup
   - result/home indication
   - research hatch
   - obtain
   - set
   - restart persistence
   - play with selected companion
4. Mobile UI polish:
   - reduce density
   - improve readable spacing
   - confirm touch targets
5. Controller / virtual mouse confirmation:
   - modal close
   - set
   - upgrade
   - hatch card
   - hatch dialog

## P08 Entry Conditions

P08 should start after P04b-level animation and feedback improvements are scoped.

Recommended P08 focus:

- Product-quality companion animation and feedback.
- Long soak automation support for level-up selection.
- Final mobile/controller polish.
- Release-candidate QA pass.
