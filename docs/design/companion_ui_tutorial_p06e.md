# MVP-P06e Companion UI Text, Confirmation, and Tutorial Pass

## Scope

P06e refines Companion Dino UI wording, readability, confirmation behavior,
and tutorial timing. It does not change companion save structure, gameplay AI,
damage, recovery, EXP gain, or balance values.

## Unknown Research Text

The locked companion research state no longer explains the egg unlock route.
The copy now keeps the feature mysterious:

- `まだ解析されていない研究領域です。条件を満たすと解放されます。`

This avoids spoiling that an egg is the trigger while still making the state
feel intentional rather than empty.

## Selection UI Readability

The companion selection modal now uses P06e versions of the panel and card:

- `public/assets/ui/companions/companion_select_panel_p06e.png`
- `public/assets/ui/companions/companion_select_card_p06e.png`

Changes from P06d:

- Darker, lower-noise text-safe interior.
- Decoration pushed farther to the frame edges.
- The owned companion card keeps a flatter center band for labels and
  descriptions.
- Chroma-green edge contamination was removed from the generated PNGs.

The runtime paths are connected through `asset_manifest.js` and
`home_screen.js`.

## Companion Upgrade Confirmation

Companion upgrades in the research companion tab no longer execute immediately.
Pressing upgrade opens the existing confirmation dialog with:

- Companion name.
- Upgrade item summary: movement range, effect, speed.
- Current level to next level.
- DNA cost.
- Execute / cancel buttons.

The actual save mutation is still routed through
`saveManager.upgradeCompanion(companionId)` after confirmation, preserving the
existing validation and save behavior.

## Tutorial Flow

P06e keeps the existing egg pickup tutorial and adds companion UI tutorials for
new surfaces:

| Trigger | Tutorial key | Purpose |
| --- | --- | --- |
| Egg first pickup | `companionEgg` | Existing pickup notice: research can hatch the egg. |
| Companion research unlock | `companionEggResearch` | Explains that a new research area opened. |
| First companion tab view | `companionTabViewed` | Explains owned companion and hatch subviews. |
| First home companion panel view | `companionHomeViewed` | Explains the home companion panel and selection entry. |

`companionHomeViewed` waits until the base home tutorial is complete so the
home companion prompt does not override the first home onboarding.

## Warning Guide Tutorial Removal

The warning guide tutorial is disabled. `showWarningGuideTutorialIfNeeded()`
now marks `warningGuide` complete and returns `false`, preventing surprise
warning popups during combat while preserving compatibility with old saves.

## QA Notes

- Unknown companion research state should not reveal eggs.
- Owned companion selection text should be readable on the darker P06e panel.
- Upgrade should require confirmation before spending DNA.
- Cancel should leave DNA and levels unchanged.
- Companion research and home tutorials should appear once and then respect
  saved tutorial flags.
- Warning guide tutorial should not appear in combat.

## Remaining Work

- Physical phone QA should still verify card readability across lower contrast
  screens.
- Controller focus for the confirm dialog uses the existing dialog behavior;
  deeper C02-style menu focus tuning remains outside P06e scope.
