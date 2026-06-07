# Tutorial UI Spec

## MVP-A13 Tutorial System

Purpose:

- Help first-time players understand Home, sortie flow, basic play, and level-up choices before they drop out.
- Keep tutorials short, skippable, and available again from Options.

Shared tutorial modal:

- Uses a common Pixi overlay in `src/ui/tutorial_ui.js`.
- Shows title, short body text, target label, page counter, Back, Next/Done, and Skip.
- Outside tap does not close the modal, to avoid accidental dismissal.
- Skip and Done both mark the current tutorial as completed.
- Highlight frames can point to the relevant UI area when useful.

Tutorial groups:

- `home`: Home structure, sortie button, daily goals, research/codex/title/news/options roles.
- `sortie`: stage selection, difficulty/ZERO/ENDLESS meaning, and dinosaur selection flow.
- `play`: movement, EXP, level-up, adaptation, evolution, ultimate, warning guides, boss/ZERO basics.
- `levelup`: card type differences and evolution-condition adaptation guidance.

Save behavior:

- Save data stores `tutorialFlags`.
- Existing saves normalize safely when the field is missing.
- Options includes a `チュートリアルを再表示` action for later review.

Readability rules:

- One page should contain only one idea.
- Body copy should be 1-3 short lines.
- Runtime text is used; no text is baked into image assets.
- The play tutorial pauses gameplay without showing the normal pause menu until Done or Skip.

## MVP-A13b Highlight Tutorial

Purpose:

- Explain the actual visible UI by spotlighting the relevant area instead of showing only a centered dialog.
- Keep the tutorial visually aligned with the EVOLUTION ZERO news/options UI.

Highlight behavior:

- Each page can define a `targetId`.
- `ScreenManager.getTutorialTargetBounds()` resolves `targetId` to an internal Pixi rectangle for Home, Stage Select, Dino Select, and Play.
- `PlayScene.showLevelUpTutorialIfNeeded()` resolves Level Up card targets locally while the Level Up UI is open.
- The overlay darkens the screen with a spotlight hole around the target and draws cyan/gold highlight frames.
- If a target is missing, the tutorial falls back to the centered panel.
- The tooltip panel uses automatic top/bottom placement and clamps inside the screen safe area.

Reused UI assets:

- Panel: `assets/ui/tutorial_text_panel_simple_a13b2.png`
- Buttons: `assets/ui/options/option_button_frame_v3.png`
- Step chip: `assets/ui/home/news_badge_update_a07d.png`

QA/debug routes:

- Options `チュートリアルを再表示` resets tutorial flags and opens the Home tutorial.
- URL debug routes are development-only QA routes. Production builds ignore these params.
- `?debugTutorial=home`
- `?debugTutorial=sortie`
- `?debugTutorial=play`
- `?debugTutorial=levelup`
- `?debugTutorial=all`
- `?resetTutorial=1`
- `?debugTutorialReset=1`
- `?debugForceLevelup=1`
- `?debugLevelupTutorial=1`

## MVP-A13b.1 Readability and Blocking Polish

- The tutorial overlay blocks all background UI while visible.
- Only tutorial controls (Back / Next / Done / Skip) receive pointer input.
- Highlight padding is increased so the frame surrounds the target without feeling cramped.
- The public `対象: ...` label is removed; target names remain internal only.
- Copy updates:
  - Research: `DNAや研究Ptがたまったら、新しい恐竜や強化を解放できます。`
  - Codex: `恐竜や進化先の情報を確認できます。`
  - Stage: `ステージによって敵やギミックが変わります。`
  - Difficulty: `ENDLESSは限界まで挑戦するモード、ZEROは最高難易度のモードです。`
  - Dino detail: `恐竜ごとに戦い方が違います。特徴を見て選びましょう。`
- Home bottom navigation tutorial order is Home -> Research -> Codex -> Options.

## MVP-A13b.2 Final Position and Panel Polish

- Tutorial text panel now uses `assets/ui/tutorial_text_panel_simple_a13b2.png`.
- The panel has only an outer frame, dark readable interior, and no right-top ornament competing with text.
- Tooltip auto placement checks the padded highlight rect and prefers non-overlap positions.
- Title and news highlight bounds were manually corrected for the Home layout.
- Difficulty copy uses explicit three-line wrapping:
  - `難易度が高いほど敵が強くなります。`
  - `ENDLESSは限界まで挑戦するモード、`
  - `ZEROは最高難易度のモードです。`
- Dino detail tutorial places the tooltip below the highlighted detail panel when possible.

## MVP-A13b.3 Title Highlight and Release Prep

- The Home title tutorial target now resolves through `HomeScreen.getTutorialBounds('home.title')`.
- The bounds are derived from the actual equipped title display / title text area instead of nearby hero art.
- Debug tutorial URL parameters remain in code for development QA but are ignored in production builds.
- Public update news and title VERSION are updated before main push.
