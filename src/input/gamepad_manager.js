const DEFAULT_DEAD_ZONE = 0.2;
const MENU_REPEAT_DELAY = 0.28;
const MENU_REPEAT_INTERVAL = 0.12;

const BUTTON_MAP = {
  confirm: [0],
  cancel: [1, 8],
  special: [0],
  pause: [9, 8, 11, 16],
  previous: [4, 6],
  next: [5, 7],
};

const DPAD = {
  up: 12,
  down: 13,
  left: 14,
  right: 15,
};

function getDebugGamepadEnabled() {
  if (typeof window === 'undefined') {
    return false;
  }

  return new URLSearchParams(window.location.search).get('debugGamepad') === '1';
}

function safeButtons(gamepad) {
  return Array.from(gamepad?.buttons ?? []).map((button) => ({
    pressed: Boolean(button?.pressed),
    value: Number(button?.value ?? 0),
  }));
}

function normalizeAxis(value) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? Math.max(-1, Math.min(1, number)) : 0;
}

export class GamepadManager {
  constructor({ deadZone = DEFAULT_DEAD_ZONE, onConnectionChange = null } = {}) {
    this.deadZone = deadZone;
    this.onConnectionChange = onConnectionChange;
    this.index = null;
    this.connected = false;
    this.gamepadName = '';
    this.lastButtons = [];
    this.buttons = [];
    this.axes = [0, 0, 0, 0];
    this.neutralAxes = null;
    this.moveX = 0;
    this.moveY = 0;
    this.movePower = 0;
    this.rightX = 0;
    this.rightY = 0;
    this.rightStickSource = '-';
    this.lastDelta = 1 / 60;
    this.actions = {};
    this.debugEnabled = getDebugGamepadEnabled();
    this.repeatState = {};
    this.lastActionSummary = '';
    this.connectedHandler = (event) => this.handleConnection(event?.gamepad, true);
    this.disconnectedHandler = (event) => this.handleConnection(event?.gamepad, false);
    this.install();
  }

  install() {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('gamepadconnected', this.connectedHandler);
    window.addEventListener('gamepaddisconnected', this.disconnectedHandler);
    this.refreshConnectedGamepad();
  }

  destroy() {
    if (typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('gamepadconnected', this.connectedHandler);
    window.removeEventListener('gamepaddisconnected', this.disconnectedHandler);
  }

  update(delta = 0) {
    this.lastDelta = Number.isFinite(delta) && delta > 0 ? delta : 1 / 60;
    const gamepad = this.getActiveGamepad();
    this.lastButtons = this.buttons;
    this.actions = {};

    if (!gamepad) {
      this.connected = false;
      this.buttons = [];
      this.axes = [0, 0, 0, 0];
      this.moveX = 0;
      this.moveY = 0;
      this.movePower = 0;
      this.rightX = 0;
      this.rightY = 0;
      this.lastActionSummary = '';
      return this.actions;
    }

    this.connected = true;
    this.gamepadName = gamepad.id ?? 'Gamepad';
    this.buttons = safeButtons(gamepad);
    this.axes = Array.from(gamepad.axes ?? []).map(normalizeAxis);
    this.captureNeutralAxes();
    this.updateMove();
    this.updateRightStick();
    this.updateButtonActions();
    this.updateDirectionalActions(delta);
    this.lastActionSummary = Object.entries(this.actions)
      .filter(([, active]) => active)
      .map(([key]) => key)
      .join(', ');

    return this.actions;
  }

  updateMove() {
    const rawX = normalizeAxis(this.axes[0]);
    const rawY = normalizeAxis(this.axes[1]);
    const magnitude = Math.min(1, Math.hypot(rawX, rawY));

    if (magnitude <= this.deadZone) {
      this.moveX = 0;
      this.moveY = 0;
      this.movePower = 0;
      return;
    }

    this.moveX = rawX / magnitude;
    this.moveY = rawY / magnitude;
    this.movePower = Math.min(1, (magnitude - this.deadZone) / (1 - this.deadZone));
  }

  updateRightStick() {
    const neutral = this.neutralAxes ?? [];
    const candidates = [
      { xIndex: 2, yIndex: 3 },
      { xIndex: 3, yIndex: 4 },
      { xIndex: 4, yIndex: 5 },
      { xIndex: 2, yIndex: 5 },
    ].map(({ xIndex, yIndex }) => ({
      x: normalizeAxis(this.axes[xIndex]),
      y: normalizeAxis(this.axes[yIndex]),
      xIndex,
      yIndex,
      neutralX: normalizeAxis(neutral[xIndex]),
      neutralY: normalizeAxis(neutral[yIndex]),
    })).filter(({ neutralX, neutralY }) => (
      Math.abs(neutralX) < 0.35 && Math.abs(neutralY) < 0.35
    ));
    const selected = candidates.find(({ x, y }) => (
      Math.hypot(x, y) > this.deadZone
    )) ?? candidates[0];
    const rawX = selected?.x ?? 0;
    const rawY = selected?.y ?? 0;
    this.rightX = Math.abs(rawX) > this.deadZone ? rawX : 0;
    this.rightY = Math.abs(rawY) > this.deadZone ? rawY : 0;
    this.rightStickSource = selected ? `${selected.xIndex}/${selected.yIndex}` : '-';
  }

  captureNeutralAxes() {
    if (this.neutralAxes || !this.axes.length) {
      return;
    }

    this.neutralAxes = this.axes.slice();
  }

  updateButtonActions() {
    Object.entries(BUTTON_MAP).forEach(([action, indices]) => {
      this.actions[action] = indices.some((index) => this.isButtonPressed(index));
      this.actions[`${action}Pressed`] = indices.some((index) => this.isButtonPressed(index) && !this.wasButtonPressed(index));
    });
  }

  updateDirectionalActions(delta) {
    const directional = {
      up: this.isButtonPressed(DPAD.up) || normalizeAxis(this.axes[1]) < -0.58,
      down: this.isButtonPressed(DPAD.down) || normalizeAxis(this.axes[1]) > 0.58,
      left: this.isButtonPressed(DPAD.left) || normalizeAxis(this.axes[0]) < -0.58,
      right: this.isButtonPressed(DPAD.right) || normalizeAxis(this.axes[0]) > 0.58,
    };

    Object.entries(directional).forEach(([action, active]) => {
      this.actions[action] = active;
      this.actions[`${action}Pressed`] = this.consumeRepeat(action, active, delta);
    });
  }

  consumeRepeat(action, active, delta) {
    const state = this.repeatState[action] ?? { active: false, timer: 0 };

    if (!active) {
      this.repeatState[action] = { active: false, timer: 0 };
      return false;
    }

    if (!state.active) {
      this.repeatState[action] = { active: true, timer: MENU_REPEAT_DELAY };
      return true;
    }

    const nextTimer = state.timer - delta;
    if (nextTimer <= 0) {
      this.repeatState[action] = { active: true, timer: MENU_REPEAT_INTERVAL };
      return true;
    }

    this.repeatState[action] = { active: true, timer: nextTimer };
    return false;
  }

  isButtonPressed(index) {
    return Boolean(this.buttons?.[index]?.pressed);
  }

  wasButtonPressed(index) {
    return Boolean(this.lastButtons?.[index]?.pressed);
  }

  handleConnection(gamepad, connected) {
    if (!gamepad) {
      return;
    }

    if (connected) {
      this.index = gamepad.index;
      this.connected = true;
      this.gamepadName = gamepad.id ?? 'Gamepad';
      this.onConnectionChange?.({ connected: true, gamepad });
      return;
    }

    if (this.index === gamepad.index) {
      this.index = null;
      this.connected = false;
      this.gamepadName = '';
      this.buttons = [];
      this.axes = [0, 0, 0, 0];
      this.neutralAxes = null;
      this.moveX = 0;
      this.moveY = 0;
      this.movePower = 0;
      this.rightX = 0;
      this.rightY = 0;
      this.onConnectionChange?.({ connected: false, gamepad });
    }
  }

  refreshConnectedGamepad() {
    const active = this.getGamepads().find((gamepad) => gamepad?.connected);
    if (!active) {
      return null;
    }

    this.index = active.index;
    this.connected = true;
    this.gamepadName = active.id ?? 'Gamepad';
    return active;
  }

  getActiveGamepad() {
    const gamepads = this.getGamepads();
    let gamepad = this.index !== null ? gamepads[this.index] : null;

    if (!gamepad?.connected) {
      gamepad = this.refreshConnectedGamepad();
    }

    return gamepad?.connected ? gamepad : null;
  }

  getGamepads() {
    if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') {
      return [];
    }

    return Array.from(navigator.getGamepads()).filter(Boolean);
  }

  getPressedButtonIndices() {
    return this.buttons
      .map((button, index) => (button.pressed ? index : null))
      .filter((index) => index !== null);
  }

  getDebugSnapshot() {
    return {
      connected: this.connected,
      name: this.gamepadName,
      pressedButtons: this.getPressedButtonIndices(),
      axes: this.axes.slice(0, 4).map((axis) => Number(axis.toFixed(2))),
      right: [this.rightX, this.rightY].map((axis) => Number(axis.toFixed(2))),
      rightSource: this.rightStickSource,
      actions: this.lastActionSummary,
      pauseDetected: Boolean(this.actions.pausePressed),
    };
  }
}
