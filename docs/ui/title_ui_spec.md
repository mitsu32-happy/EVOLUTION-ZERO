# EVOLUTION ZERO Title UI Spec

## Reference

- Primary reference: `references/ui/title_ui_v2.png`
- Related UI series:
  - `references/ui/home_ui_v3.png`
  - `references/ui/stage_select_ui_v2.png`
  - `references/ui/dino_select_ui_v3.png`

## Role

The title screen is the first immersion screen and the START route into the game.
It should communicate danger, research-facility tension, jungle survival, and abnormal evolution without becoming a menu hub.

## Display Elements

- Full-screen title background.
- Top-left warning HUD.
- EVOLUTION ZERO logo.
- Short subtitle.
- START button.
- Bottom protocol/version display.

The START button is the only primary operation on the title screen.

## Forbidden Elements

- Announcement or news panel.
- MVP number.
- Long guide text.
- Multiple menu buttons.
- Home-screen status information.
- Stage, difficulty, DNA, research Pt, records, missions, or unlock status.

Announcements should be added to the home screen in a future MVP, not to the title screen.

## Assets

Assets are stored under `public/assets/ui/title/`.

- `title_background.png`
  - Dark rainy jungle and research facility scene.
  - Predator presence, red warning lights, DNA glow.
  - No text and no logo baked into the image.
- `warning_panel.png`
  - Top-left warning HUD frame.
  - No text baked into the image.
  - Code draws `WARNING`, facility sector, and level text over the frame.
- `start_button_idle.png`
  - START-only idle state.
- `start_button_glow.png`
  - START-only glowing state for subtle pulsing.
- `start_button_pressed.png`
  - START-only pressed state.

The EVOLUTION ZERO logo is reused from `public/assets/ui/home/evolution_zero_logo.png`.

## Subtitle And Version

- Subtitle is code-rendered so text can be revised without regenerating assets.
- Current subtitle: `進化は、死線の先にある。`
- Bottom version display is allowed as a small protocol line.
- Current version display: `VERSION 0.0.1`
- These elements should support the mock's atmosphere without turning the title into a menu or information screen.

## START Button

- The button should be large enough for one-handed mobile tapping.
- It may contain the text `START` in the image.
- It should have a subtle glow pulse while idle.
- On press, it should use a short 0.08-0.15 second scale or alpha feedback.
- Optional UI SE may be called through `ui_confirm`.
- Missing sound files must not emit console warnings or errors.

## Fallback

- If `title_background.png` is unavailable, the screen uses the existing Graphics-based dark background.
- If the EVOLUTION ZERO logo is unavailable, code-drawn fallback text is shown.
- If START button assets are unavailable, a Graphics-based START button is shown.
- Asset loading failure must not block startup or title to home navigation.

## Layout

- Mobile portrait first.
- Keep the logo and START button separated.
- Do not cover the START button with other UI.
- Keep subtitle text between the logo and START button with enough air on both sides.
- Keep version text small near the bottom edge.
- Leave enough image area visible to preserve the rainy facility and predator atmosphere.
