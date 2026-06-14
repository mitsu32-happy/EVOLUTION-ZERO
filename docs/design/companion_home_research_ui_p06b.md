# MVP-P06b Companion Home / Research UI

> P06c note: the P06b layout remains the baseline, but the bitmap UI frames and
> companion research focus handling were polished in
> `docs/design/companion_ui_polish_p06c.md`.

## Scope

P06b moves Companion Dino management toward release UI quality without changing
combat AI, hatch balance, or save fundamentals.

- Home only exposes the companion entry when at least one companion is owned.
- Home companion selection shows owned companions only.
- Companion upgrading moves out of the home selection modal.
- Research replaces the unused mutation category with a companion research tab.
- The companion tab is hidden as `???` until the first egg is discovered.
- The companion tab has two internal views: owned companions and egg hatch.

## Home Entry

The compact home companion panel now sits under the top-left title logo area.
It no longer overlaps the main dinosaur hero.

- Position: `x=18, y=92, w=168, h=58`
- Visible only when `companion.ownedIds.length > 0`
- Uses `home_companion_frame_p06b.png`
- Shows selected companion icon, name, and level
- Falls back to the first owned companion for display if `selectedId` is null

## Companion Selection Modal

The home modal is now a selection-only surface.

- Owned companions only are rendered.
- Unowned companions are not shown in normal UI.
- Upgrade controls are hidden here.
- Rows use the P06b selection card/button frames.
- Each row shows icon, level, short role description, and select state.

Debug ownership helpers remain QA-only and should not be treated as normal
player ownership UI.

## Research Companion Tab

The former mutation category slot is now the companion research slot.

Before egg discovery:

- Tab label: `???`
- Icon: `icon_companion_unknown_p06b.png`
- Content: locked/unknown research domain message

After egg discovery, incubation, hatch, or ownership:

- Tab label: `お供`
- Icon: `icon_companion_research_p06b.png`
- Content switches between `所持お供` and `卵孵化`

Unlock state is driven by `companion.eggDiscovered`, egg state, `lastHatchedId`,
or owned companion count.

## Egg Hatch View

The hatch view uses a central incubation device asset and a dedicated hatch
button frame.

Displayed fields:

- Egg state
- Remaining time when incubating
- Required DNA: `90`
- Required research Pt: `12`
- Hatch duration: `3 hours`
- Claim state when incubation is complete

Only one egg is incubated at a time, preserving the P01-P06 save flow.

## Owned Companion Upgrade View

Owned companions are listed in research and can be upgraded there.

P06b keeps the existing single companion level save model:

- `levels[id]` remains the only upgrade level.
- The UI presents this level as growth across movement range, effect, and speed.
- The actual upgrade action still calls `SaveManager.upgradeCompanion(id)`.
- Combat values are not rebalanced in P06b.

This avoids a save-breaking split into three separate upgrade tracks while
matching the requested research-side upgrade flow.

## Generated UI Assets

- `public/assets/ui/companions/home_companion_frame_p06b.png`
- `public/assets/ui/companions/companion_select_panel_p06b.png`
- `public/assets/ui/companions/companion_select_card_p06b.png`
- `public/assets/ui/companions/companion_select_button_p06b.png`
- `public/assets/ui/companions/companion_owned_panel_p06b.png`
- `public/assets/ui/companions/companion_upgrade_card_p06b.png`
- `public/assets/ui/companions/companion_upgrade_button_p06b.png`
- `public/assets/ui/companions/companion_hatch_device_p06b.png`
- `public/assets/ui/companions/companion_hatch_button_p06b.png`
- `public/assets/ui/research/icons/icon_companion_research_p06b.png`
- `public/assets/ui/research/icons/icon_companion_unknown_p06b.png`

All text is rendered by UI code, not baked into the images.

## Save Compatibility

`eggDiscovered` was added to companion state normalization. It is derived as
true when older saves already have an egg, incubation, a hatched companion, or
owned companions.

Old saves without `companion` still normalize to the default companion state.

## Remaining Work

- Full controller focus support for the new research companion subviews.
- Final phone-width QA for all localized text lengths.
- Future save migration if separate movement/effect/speed upgrade tracks become
  real independent progression.

## P06c Polish Follow-up

P06c replaces the P06b UI bitmaps with regenerated `*_p06c.png` assets and adds
minimum controller/virtual-mouse routing for the companion research subview:

- left/right switches `所持お供` and `卵孵化`
- up/down moves between available actions
- confirm activates hatch, upgrade, or page controls

The P06b `*_p06b.png` files remain in the repository as historical references,
but active manifest entries now point to P06c assets.
