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
