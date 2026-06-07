# Tutorial Design Spec

## MVP-A13 Tutorial Flow

Design goals:

- Prevent first-time players from getting lost before reaching the core action.
- Explain just enough to start playing.
- Avoid battle balance or progression changes.

Flow:

1. First Home visit shows the Home tutorial.
2. First stage-select visit shows the sortie tutorial.
3. First dino-select visit shows the dino selection tutorial.
4. First play start shows the play tutorial and pauses gameplay without showing the normal pause menu.
5. First level-up shows a focused card-selection tutorial.
6. Options can reset tutorial flags and force the Home tutorial to show again.

Completion:

- Each tutorial group is tracked independently.
- Done and Skip both save the group as completed.
- Missing flags in older saves default to incomplete without breaking the save.

Level-up card language:

- Adaptation skill cards identify themselves as `種別: 適応技`.
- Stat cards identify themselves as `種別: 能力強化`.
- Fallback cards identify themselves as `種別: 報酬`.
- Adaptation cards show power, range, cooldown, and `進化条件に影響`.
- Stat/reward cards show short effect text and avoid long world-building copy.

## MVP-A13b Highlight Flow

Goal:

- Teach by pointing at the real UI the player is looking at.
- Avoid long explanatory pages at boot.
- Keep first-time learning short, skippable, and repeatable in QA.

Tutorial targets:

- Home: sortie button, daily area, research/unlock, codex, title, news, options.
- Stage Select: stage cards, difficulty selector, continue button.
- Dino Select: dino cards, selected dino detail, sortie start button.
- Play: movement area, HUD, level-up hint area, ultimate button, warning guide.
- Level Up: card set and adaptation-card/evolution-condition area.

Debug and reset policy:

- URL debug routes are development-only QA routes. Production builds ignore these params.
- `debugTutorial=<id>` forces the matching tutorial even if already completed.
- `debugTutorial=all` and `resetTutorial=1` reset tutorial flags for QA.
- Level Up can be forced with `debugTutorial=levelup`, `debugForceLevelup=1`, or `debugLevelupTutorial=1`.
- Options re-display resets flags and starts the Home tutorial again.

UI asset policy:

- A13b reuses existing dedicated news/options assets instead of adding new raster files.
- Graphics are retained only for spotlight masks, highlight strokes, and fallback drawing.
- Text remains runtime-rendered for localization and readability.

## MVP-A13b.1 Micro Polish

- Tutorial display owns the full-screen pointer hit area while visible, preventing accidental taps on highlighted controls.
- Highlight padding is larger than the raw target rect and clamps within the screen.
- Public target labels are removed to keep copy simple.
- Home bottom navigation explanation order is Home, Research, Codex, Options.
- Stage and dino-select copy is shorter and avoids extra strategic detail during first-run guidance.

## MVP-A13b.2 Final Micro Polish

- Tutorial text panel was replaced with a simple outer-frame-only panel to keep text away from decorative corners.
- Tooltip placement now compares the padded target rect against top/bottom candidates and avoids overlap when possible.
- Home title/news bounds are hand-tuned because those UI elements sit over layered hero/news art.
- Difficulty text uses explicit line breaks so ENDLESS and ZERO are read as separate modes.

## MVP-A13b.3 Release Handling

- Title highlight no longer uses a hand-tuned hero-area rect; it asks the Home screen for the equipped title display bounds.
- Tutorial QA URL parameters are development-only and do not activate in production builds.
- The public news entry only mentions player-facing tutorial improvements, not debug routes.

## MVP-A13c Contextual Timing

- The initial Play tutorial no longer explains UI that is not yet visible.
- Level Up, Ultimate READY, and warning-guide concepts are taught at their first real appearance.
- Level Up receives a first-run card ordering hint so an adaptation skill card appears first when available.
- Event tutorials pause play through the shared tutorial overlay and mark their own save flags on complete/skip.
