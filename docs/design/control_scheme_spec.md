# Control Scheme Spec

## MVP-C01 Gamepad Gameplay Support

Scope:

- Gamepad support is active only during PlayScene gameplay.
- Title, Home, Research, Codex, Options, and other menu screens remain touch/pointer driven.
- Existing touch drag movement and touch ultimate button behavior are unchanged.

Standard Gamepad API:

- Uses `navigator.getGamepads()`.
- Uses `gamepadconnected` and `gamepaddisconnected` events for short in-game notices.
- No external controller library is required.

Buttons:

- Left stick: analog 360-degree movement.
- Dead zone: `0.2`.
- Button `0`: ultimate / special attack.
  - Xbox: A.
  - PlayStation: Cross.
  - Switch Pro: primary south/east face button depending on browser mapping.
- Button `9`: pause / resume.
  - START / Menu / Options style button depending on controller.

Touch coexistence:

- Touch input remains available while a gamepad is connected.
- When the left stick is outside the dead zone, gamepad movement overwrites the shared movement vector.
- When the stick returns to neutral, touch input can continue normally.

Supported test targets:

- PC + Xbox controller.
- PC + PS5 controller.
- PC + Switch Pro controller.
- iPhone Safari / PWA + Bluetooth controller.
- Android Chrome / PWA + Bluetooth controller.

QA:

- Verify Gamepad API recognition.
- Verify left stick movement.
- Verify button `0` ultimate.
- Verify button `9` pause/resume.
- Verify connect/disconnect notice.
- Verify touch drag still works with no gamepad and while a gamepad is connected.

## MVP-C02 Full Gamepad Menu Support

Scope:

- Gamepad support now extends beyond gameplay into the main menu flow.
- Touch and pointer controls remain available on every screen.
- No external controller library is used; the standard Gamepad API remains the only dependency.

Shared actions:

- Left stick: analog movement during play; menu cursor movement outside play.
- D-pad: menu cursor movement.
- Button 0: confirm / ultimate during play.
- Button 1: cancel / back.
- Button 8, 9, 11, or 16: pause / resume candidate buttons. Xbox controller testing showed Start/Menu can appear as button 11 in this browser.
- LB/RB: previous / next tab or page where supported.
- LT/RT: previous / next auxiliary input where supported.

Pause fix:

- C01 only checked the legacy play-scene pause path for button 9. C02 routes pause through the shared gamepad action manager and accepts both button 9 and button 8.
- `debugGamepad=1` shows connected gamepad name, pressed button indices, axes, mapped actions, and pause detection.

Virtual cursor:

- Outside gameplay, the controller drives a code-rendered virtual mouse cursor.
- Left stick or D-pad moves the cursor.
- Button 0 taps/clicks the cursor position, reusing the existing pointer UI.
- Right stick sends wheel input at the cursor position for scrollable panels such as Research.
- Title starts the cursor on START, and Home starts the cursor on Sortie for quick access.
- The cursor and debug overlay are non-interactive, so touch and mouse input are not blocked.
- Title, Home, Stage Select, Dino Select, Options, Research, Codex, Result, News, Title Select, and other pointer-driven menus can be operated through the same virtual cursor.

Gameplay:

- Left stick movement and touch movement coexist.
- Button 0 still triggers ultimate/special when gameplay allows it.
- Level-up adaptation choices and evolution candidates can be selected with D-pad/stick plus Button 0.
