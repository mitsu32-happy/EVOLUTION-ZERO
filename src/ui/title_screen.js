import { Assets, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { ASSET_KEYS } from '../data/asset_manifest.js';
import { APP_VERSION_LABEL } from '../data/app_version.js';
import { playPressFeedback } from './ui_feedback.js';
import { drawButtonFrame, drawScreenBackground, UI_COLORS } from './ui_theme.js';

const TITLE_ASSET_PATHS = {
  background: 'assets/ui/title/title_background.png',
  logo: 'assets/ui/home/evolution_zero_logo.png',
  warningPanel: 'assets/ui/title/warning_panel.png',
  startIdle: 'assets/ui/title/start_button_idle.png',
  startGlow: 'assets/ui/title/start_button_glow.png',
  startPressed: 'assets/ui/title/start_button_pressed.png',
};

const LOGO_RECT = { x: 35, y: 336, width: 320, height: 160 };
const START_RECT = { x: 36, y: 604, width: 318, height: 96 };
const INTRO_RECT = { x: 126, y: 712, width: 138, height: 38 };
const WARNING_RECT = { x: 16, y: 26, width: 180, height: 72 };
const SUBTITLE_Y = 530;
const VERSION_Y = 802;
const UPDATE_RECT = { x: 94, y: 760, width: 202, height: 30 };

function isDebugMode() {
  if (typeof window === 'undefined') {
    return false;
  }

  const params = new URLSearchParams(window.location.search);

  return [...params.keys()].some((key) => key.startsWith('debug')) || params.get('debugMode') === '1';
}

export class TitleScreen {
  constructor({ width, height, assetLoader = null, onStart, onIntro, onUiFeedback, onApplyUpdate }) {
    this.width = width;
    this.height = height;
    this.assetLoader = assetLoader;
    this.onStart = onStart;
    this.onIntro = onIntro;
    this.onUiFeedback = onUiFeedback;
    this.onApplyUpdate = onApplyUpdate;
    this.textures = new Map();
    this.starting = false;
    this.glowTimer = null;
    this.assetsReady = false;

    this.view = new Container();
    this.background = new Graphics();
    this.backgroundSprite = new Sprite(Texture.EMPTY);
    this.vignette = new Graphics();
    this.warningPanel = new Sprite(Texture.EMPTY);
    this.warningFallback = new Graphics();
    this.warningTitle = this.createText('WARNING', 19, '#ff4f45', 150);
    this.warningBody = this.createText('RESEARCH FACILITY\nSECTOR 7  /  LEVEL RED', 10, '#ff7a66', 150);
    this.debugBadgeBg = new Graphics();
    this.debugBadgeText = this.createText('DEBUG MODE', 13, '#ffe4a8', 150);
    this.logoSprite = new Sprite(Texture.EMPTY);
    this.logoFallback = this.createText('EVOLUTION\nZERO', 56, '#f4f7f5', 330);
    this.subtitle = this.createText('進化は、死線の先にある。', 15, '#ff5a4f', 300);
    this.version = this.createText(`EVOLUTION ZERO PROTOCOL INITIATED\n${APP_VERSION_LABEL}`, 10, '#c94b43', 310);
    this.updateButton = this.createUpdateButton();
    this.startButton = this.createStartButton();
    this.introButton = this.createIntroButton();
    this.loadingOverlay = this.createLoadingOverlay();

    this.view.addChild(
      this.background,
      this.backgroundSprite,
      this.vignette,
      this.warningFallback,
      this.warningPanel,
      this.warningTitle,
      this.warningBody,
      this.debugBadgeBg,
      this.debugBadgeText,
      this.logoSprite,
      this.logoFallback,
      this.subtitle,
      this.startButton.view,
      this.introButton.view,
      this.updateButton.view,
      this.version,
      this.loadingOverlay.view,
    );

    this.startButton.view.on('pointerdown', () => this.setStartPressed(true));
    this.startButton.view.on('pointerup', () => this.setStartPressed(false));
    this.startButton.view.on('pointerupoutside', () => this.setStartPressed(false));
    this.startButton.view.on('pointertap', () => this.handleStartTap());
    this.introButton.view.on('pointertap', () => this.handleIntroTap());

    this.drawStatic();
    this.loadAssets();
  }

  show() {
    this.view.visible = true;
    this.renderPwaUpdate();
    this.updateDebugBadge();
    this.startGlowLoop();
  }

  setPwaUpdateInfo(updateInfo = null) {
    this.pwaUpdateInfo = updateInfo;
    this.renderPwaUpdate();
  }

  hide() {
    this.view.visible = false;
    this.stopGlowLoop();
    this.setStartPressed(false);
  }

  drawStatic() {
    drawScreenBackground(this.background, this.width, this.height, UI_COLORS.danger);
    this.vignette
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x030607, alpha: 0.2 })
      .rect(0, 0, this.width, 168)
      .fill({ color: 0x010303, alpha: 0.18 })
      .rect(0, this.height - 218, this.width, 218)
      .fill({ color: 0x050706, alpha: 0.22 });

    this.warningFallback
      .roundRect(WARNING_RECT.x, WARNING_RECT.y, WARNING_RECT.width, WARNING_RECT.height, 8)
      .fill({ color: 0x240306, alpha: 0.38 })
      .stroke({ color: UI_COLORS.danger, width: 1, alpha: 0.55 })
      .rect(WARNING_RECT.x + 12, WARNING_RECT.y + 52, 96, 4)
      .fill({ color: UI_COLORS.danger, alpha: 0.5 });
    this.warningTitle.anchor.set(0, 0);
    this.warningTitle.position.set(WARNING_RECT.x + 44, WARNING_RECT.y + 12);
    this.warningBody.anchor.set(0, 0);
    this.warningBody.position.set(WARNING_RECT.x + 44, WARNING_RECT.y + 34);
    this.warningBody.style.lineHeight = 12;
    this.debugBadgeText.anchor.set(0.5);
    this.debugBadgeText.position.set(this.width - 84, 43);
    this.updateDebugBadge();

    this.logoFallback.anchor.set(0.5);
    this.logoFallback.position.set(this.width / 2, LOGO_RECT.y + LOGO_RECT.height / 2);
    this.logoFallback.style.lineHeight = 54;
    this.subtitle.anchor.set(0.5);
    this.subtitle.position.set(this.width / 2, SUBTITLE_Y);
    this.version.anchor.set(0.5);
    this.version.position.set(this.width / 2, VERSION_Y);
    this.version.style.lineHeight = 15;

    this.startButton.view.position.set(START_RECT.x, START_RECT.y);
    this.introButton.view.position.set(INTRO_RECT.x, INTRO_RECT.y);
    this.updateButton.view.position.set(UPDATE_RECT.x, UPDATE_RECT.y);
    this.renderFallbackStart();
    this.renderIntroButton();
    this.renderPwaUpdate();
    this.applyTextures();
    this.renderLoadingOverlay();
  }

  async loadAssets() {
    const requests = [
      ['background', ASSET_KEYS.titleUi?.titleBackground, TITLE_ASSET_PATHS.background],
      ['logo', ASSET_KEYS.homeUi?.evolutionZeroLogo, TITLE_ASSET_PATHS.logo],
      ['warningPanel', ASSET_KEYS.titleUi?.warningPanel, TITLE_ASSET_PATHS.warningPanel],
      ['startIdle', ASSET_KEYS.titleUi?.startButtonIdle, TITLE_ASSET_PATHS.startIdle],
      ['startGlow', ASSET_KEYS.titleUi?.startButtonGlow, TITLE_ASSET_PATHS.startGlow],
      ['startPressed', ASSET_KEYS.titleUi?.startButtonPressed, TITLE_ASSET_PATHS.startPressed],
    ];

    const loaded = await Promise.all(requests.map(async ([name, key, path]) => {
      const texture = await this.loadTexture(key, path);

      return { name, texture };
    }));

    loaded.forEach(({ name, texture }) => {
      if (texture) {
        this.textures.set(name, texture);
      }
    });
    this.assetsReady = true;
    this.applyTextures();
    this.renderLoadingOverlay();
  }

  async loadTexture(key, path) {
    let loaded = null;

    try {
      loaded = key ? await this.assetLoader?.load(key) : null;
    } catch {
      loaded = null;
    }

    if (loaded || !path) {
      return loaded;
    }

    try {
      return await Assets.load(`${import.meta.env.BASE_URL}${path}`);
    } catch {
      return null;
    }
  }

  applyTextures() {
    this.applySprite(this.backgroundSprite, this.textures.get('background'), {
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    });

    this.applySprite(this.logoSprite, this.textures.get('logo'), LOGO_RECT, 0.97);
    this.logoFallback.visible = !this.logoSprite.visible;
    this.applySprite(this.warningPanel, this.textures.get('warningPanel'), WARNING_RECT, 0.9);
    this.warningFallback.visible = !this.warningPanel.visible;

    this.applySprite(this.startButton.idle, this.textures.get('startIdle'), {
      x: 0,
      y: 0,
      width: START_RECT.width,
      height: START_RECT.height,
    });
    this.applySprite(this.startButton.glow, this.textures.get('startGlow'), {
      x: 0,
      y: 0,
      width: START_RECT.width,
      height: START_RECT.height,
    });
    this.applySprite(this.startButton.pressed, this.textures.get('startPressed'), {
      x: 0,
      y: 0,
      width: START_RECT.width,
      height: START_RECT.height,
    });

    const hasStartAssets = this.hasStartButtonAssets();
    this.startButton.fallbackBg.visible = !hasStartAssets;
    this.startButton.fallbackText.visible = !hasStartAssets;
    this.startButton.idle.visible = hasStartAssets && !this.starting;
    this.startButton.glow.visible = hasStartAssets && !this.starting;
    this.startButton.pressed.visible = hasStartAssets && this.starting;
  }

  createLoadingOverlay() {
    const view = new Container();
    const bg = new Graphics();
    const text = this.createText('LOADING...', 16, '#d7fff2', 220);
    const sub = this.createText('ASSETS INITIALIZING', 9, '#7cf7d4', 220);

    text.anchor.set(0.5);
    text.position.set(this.width / 2, this.height / 2 - 8);
    sub.anchor.set(0.5);
    sub.position.set(this.width / 2, this.height / 2 + 22);
    view.addChild(bg, text, sub);

    return { view, bg, text, sub };
  }

  renderLoadingOverlay() {
    if (!this.loadingOverlay?.view) {
      return;
    }

    this.loadingOverlay.bg
      .clear()
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x020406, alpha: 0.96 })
      .rect(72, this.height / 2 + 42, this.width - 144, 2)
      .fill({ color: UI_COLORS.dna, alpha: 0.58 });
    this.loadingOverlay.view.visible = !this.assetsReady;
    this.startButton.view.eventMode = this.assetsReady ? 'static' : 'none';
    this.introButton.view.eventMode = this.assetsReady ? 'static' : 'none';
  }

  updateDebugBadge() {
    const visible = isDebugMode();

    this.debugBadgeBg.visible = visible;
    this.debugBadgeText.visible = visible;
    this.debugBadgeBg.clear();

    if (!visible) {
      return;
    }

    this.debugBadgeBg
      .roundRect(this.width - 154, 24, 132, 36, 8)
      .fill({ color: 0x2a0904, alpha: 0.78 })
      .stroke({ color: 0xffc739, width: 1.5, alpha: 0.78 })
      .rect(this.width - 142, 53, 108, 3)
      .fill({ color: 0xffc739, alpha: 0.62 });
  }

  applySprite(sprite, texture, rect, alpha = 1) {
    sprite.texture = texture ?? Texture.EMPTY;
    sprite.visible = !!texture;
    sprite.position.set(rect.x, rect.y);
    sprite.width = rect.width;
    sprite.height = rect.height;
    sprite.alpha = alpha;
  }

  createStartButton() {
    const view = new Container();
    const fallbackBg = new Graphics();
    const fallbackText = this.createText('START', 45, '#fff3ef', 260);
    const idle = new Sprite(Texture.EMPTY);
    const glow = new Sprite(Texture.EMPTY);
    const pressed = new Sprite(Texture.EMPTY);

    fallbackText.anchor.set(0.5);
    fallbackText.position.set(START_RECT.width / 2, START_RECT.height / 2 - 2);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.addChild(idle, glow, pressed, fallbackBg, fallbackText);

    return { view, idle, glow, pressed, fallbackBg, fallbackText };
  }

  renderFallbackStart() {
    this.startButton.fallbackBg.clear();
    drawButtonFrame(this.startButton.fallbackBg, START_RECT.width, START_RECT.height, {
      accent: UI_COLORS.danger,
      selected: true,
      glow: true,
      radius: 10,
    });
  }

  createIntroButton() {
    const view = new Container();
    const bg = new Graphics();
    const text = this.createText('INTRO', 15, '#d7fff2', INTRO_RECT.width - 20);

    text.anchor.set(0.5);
    text.position.set(INTRO_RECT.width / 2, INTRO_RECT.height / 2);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.addChild(bg, text);

    return { view, bg, text };
  }

  createUpdateButton() {
    const view = new Container();
    const bg = new Graphics();
    const text = this.createText('UPDATE DETECTED', 10, '#fff0b4', UPDATE_RECT.width - 18);
    const sub = this.createText('自動更新中...', 9, '#d7fff2', UPDATE_RECT.width - 18);

    text.anchor.set(0.5);
    text.position.set(UPDATE_RECT.width / 2, 8);
    sub.anchor.set(0.5);
    sub.position.set(UPDATE_RECT.width / 2, 21);
    view.eventMode = 'none';
    view.cursor = 'default';
    view.visible = false;
    view.addChild(bg, text, sub);

    return { view, bg, text, sub };
  }

  renderIntroButton() {
    drawButtonFrame(this.introButton.bg, INTRO_RECT.width, INTRO_RECT.height, {
      accent: UI_COLORS.dna,
      selected: false,
      glow: true,
      radius: 8,
    });
  }

  renderPwaUpdate() {
    if (!this.updateButton) {
      return;
    }

    const available = Boolean(this.pwaUpdateInfo?.available);
    this.updateButton.view.visible = available;
    this.version.text = available
      ? `EVOLUTION ZERO PROTOCOL INITIATED\n${APP_VERSION_LABEL} / UPDATING`
      : `EVOLUTION ZERO PROTOCOL INITIATED\n${APP_VERSION_LABEL}`;

    this.updateButton.bg
      .clear()
      .roundRect(0, 0, UPDATE_RECT.width, UPDATE_RECT.height, 8)
      .fill({ color: 0x250608, alpha: 0.86 })
      .stroke({ color: UI_COLORS.gold, width: 1.4, alpha: 0.9 })
      .rect(12, UPDATE_RECT.height - 5, UPDATE_RECT.width - 24, 2)
      .fill({ color: UI_COLORS.dna, alpha: 0.68 });
  }

  setStartPressed(isPressed) {
    if (!this.startButton?.view) {
      return;
    }

    const hasStartAssets = this.hasStartButtonAssets();
    this.startButton.pressed.visible = hasStartAssets && isPressed;
    this.startButton.idle.visible = hasStartAssets && !isPressed;
    this.startButton.glow.visible = hasStartAssets && !isPressed;
  }

  handleStartTap() {
    if (this.starting) {
      return;
    }

    this.starting = true;
    this.onUiFeedback?.('ui_confirm');
    playPressFeedback(this.startButton.view, {
      width: START_RECT.width,
      height: START_RECT.height,
      scale: 0.975,
      alpha: 0.88,
      duration: 110,
    });
    this.setStartPressed(true);

    setTimeout(() => {
      Promise.resolve(this.onStart?.()).finally(() => {
        this.starting = false;
        this.setStartPressed(false);
      });
    }, 120);
  }

  handleIntroTap() {
    playPressFeedback(this.introButton.view, {
      width: INTRO_RECT.width,
      height: INTRO_RECT.height,
      scale: 0.97,
      alpha: 0.88,
      duration: 90,
    });
    this.onIntro?.();
  }

  hasStartButtonAssets() {
    return Boolean(this.textures.get('startIdle'));
  }

  startGlowLoop() {
    this.stopGlowLoop();
    this.glowTimer = setInterval(() => {
      const glow = this.startButton?.glow;

      if (!glow?.visible || this.starting) {
        return;
      }

      const pulse = (Math.sin(performance.now() / 360) + 1) / 2;
      glow.alpha = 0.18 + pulse * 0.32;
    }, 60);
  }

  stopGlowLoop() {
    if (this.glowTimer) {
      clearInterval(this.glowTimer);
      this.glowTimer = null;
    }
  }

  createText(text, size, fill, wordWrapWidth = 280) {
    return new Text({
      text,
      style: {
        fill,
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: size,
        fontWeight: '700',
        letterSpacing: 0,
        align: 'center',
        wordWrap: true,
        wordWrapWidth,
      },
    });
  }
}
