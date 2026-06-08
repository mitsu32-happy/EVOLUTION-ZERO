import { Assets, Container, Graphics, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import { ASSET_KEYS } from '../data/asset_manifest.js';
import { playPressFeedback } from './ui_feedback.js';
import { drawButtonFrame, drawPanel, UI_COLORS } from './ui_theme.js';

const ASSET_PATHS = {
  panelV2: 'assets/ui/common/confirm_dialog_panel_v2.png',
  yesV2: 'assets/ui/common/confirm_button_yes_v2.png',
  noV2: 'assets/ui/common/confirm_button_no_v2.png',
  warningChipV2: 'assets/ui/common/confirm_warning_chip_v2.png',
  costBadgeV2: 'assets/ui/common/confirm_cost_badge_v2.png',
  panel: 'assets/ui/common/confirm_dialog_panel.png',
  yes: 'assets/ui/common/confirm_button_yes.png',
  no: 'assets/ui/common/confirm_button_no.png',
};

const DIALOG = { x: 22, y: 272, width: 346, height: 242 };
const TITLE_CHIP = { width: 218, height: 36, y: DIALOG.y + 24 };
const DETAIL_BADGE = { width: 250, height: 48, y: DIALOG.y + 114 };
const BUTTON = { width: 132, height: 40, y: DIALOG.y + 170 };

export class ConfirmDialog {
  constructor({ width, height, assetLoader = null } = {}) {
    this.width = width;
    this.height = height;
    this.assetLoader = assetLoader;
    this.textures = new Map();
    this.onConfirm = null;
    this.onCancel = null;
    this.gamepadFocusType = 'yes';

    this.view = new Container();
    this.view.visible = false;
    this.view.zIndex = 9999;
    this.backdrop = new Graphics();
    this.panelFallback = new Graphics();
    this.panelSprite = new Sprite(Texture.EMPTY);
    this.titleChipSprite = new Sprite(Texture.EMPTY);
    this.titleChipFallback = new Graphics();
    this.detailBadgeSprite = new Sprite(Texture.EMPTY);
    this.detailBadgeFallback = new Graphics();
    this.titleText = this.createText('', 18, '#ffffff', 280);
    this.messageText = this.createText('', 12, '#cbe0da', 280);
    this.detailText = this.createText('', 12, '#ffd36b', 280);
    this.yesButton = this.createButton('はい', 'yes');
    this.noButton = this.createButton('いいえ', 'no');

    this.backdrop
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x000000, alpha: 0.58 });
    this.backdrop.eventMode = 'static';
    this.backdrop.hitArea = new Rectangle(0, 0, this.width, this.height);

    this.panelSprite.position.set(DIALOG.x, DIALOG.y);
    this.panelSprite.width = DIALOG.width;
    this.panelSprite.height = DIALOG.height;
    this.titleChipSprite.position.set((this.width - TITLE_CHIP.width) / 2, TITLE_CHIP.y);
    this.titleChipSprite.width = TITLE_CHIP.width;
    this.titleChipSprite.height = TITLE_CHIP.height;
    this.detailBadgeSprite.position.set((this.width - DETAIL_BADGE.width) / 2, DETAIL_BADGE.y);
    this.detailBadgeSprite.width = DETAIL_BADGE.width;
    this.detailBadgeSprite.height = DETAIL_BADGE.height;
    this.titleText.anchor.set(0.5, 0);
    this.titleText.position.set(this.width / 2, TITLE_CHIP.y + 8);
    this.messageText.anchor.set(0.5, 0);
    this.messageText.position.set(this.width / 2, DIALOG.y + 72);
    this.messageText.style.lineHeight = 18;
    this.detailText.anchor.set(0.5, 0);
    this.detailText.position.set(this.width / 2, DETAIL_BADGE.y + 9);
    this.detailText.style.fontSize = 11;
    this.detailText.style.lineHeight = 15;
    this.yesButton.view.position.set(54, BUTTON.y);
    this.noButton.view.position.set(204, BUTTON.y);

    this.view.addChild(
      this.backdrop,
      this.panelSprite,
      this.panelFallback,
      this.titleChipSprite,
      this.titleChipFallback,
      this.detailBadgeSprite,
      this.detailBadgeFallback,
      this.titleText,
      this.messageText,
      this.detailText,
      this.yesButton.view,
      this.noButton.view,
    );
    this.drawFallback();
    this.loadAssets();
  }

  show({
    title = '確認',
    message = '',
    detail = '',
    confirmLabel = 'はい',
    cancelLabel = 'いいえ',
    onConfirm = null,
    onCancel = null,
  } = {}) {
    this.titleText.text = title;
    this.messageText.text = message;
    this.detailText.text = detail;
    this.yesButton.label.text = confirmLabel;
    this.noButton.label.text = cancelLabel;
    this.onConfirm = onConfirm;
    this.onCancel = onCancel;
    this.gamepadFocusType = 'yes';
    this.updateGamepadFocus();
    this.view.visible = true;
  }

  hide() {
    this.view.visible = false;
    this.onConfirm = null;
    this.onCancel = null;
  }

  createButton(label, type) {
    const button = {
      type,
      view: new Container(),
      sprite: new Sprite(Texture.EMPTY),
      fallback: new Graphics(),
      label: this.createText(label, 15, '#ffffff', BUTTON.width - 16),
    };

    button.view.eventMode = 'static';
    button.view.cursor = 'pointer';
    button.view.hitArea = new Rectangle(0, 0, BUTTON.width, BUTTON.height);
    button.sprite.width = BUTTON.width;
    button.sprite.height = BUTTON.height;
    button.label.anchor.set(0.5);
    button.label.position.set(BUTTON.width / 2, BUTTON.height / 2 + 1);
    button.view.on('pointertap', () => this.handleButton(type, button.view));
    button.view.addChild(button.sprite, button.fallback, button.label);

    return button;
  }

  handleButton(type, target) {
    playPressFeedback(target, {
      width: BUTTON.width,
      height: BUTTON.height,
      scale: 0.97,
      alpha: 0.84,
      duration: 90,
    });

    if (type === 'yes') {
      const callback = this.onConfirm;
      this.hide();
      callback?.();
      return;
    }

    const callback = this.onCancel;
    this.hide();
    callback?.();
  }

  handleGamepadAction(actions = {}) {
    if (!this.view.visible) {
      return false;
    }

    if (actions.leftPressed || actions.rightPressed || actions.upPressed || actions.downPressed) {
      this.gamepadFocusType = this.gamepadFocusType === 'yes' ? 'no' : 'yes';
      this.updateGamepadFocus();
      return true;
    }

    if (actions.confirmPressed) {
      const button = this.gamepadFocusType === 'yes' ? this.yesButton : this.noButton;
      this.handleButton(button.type, button.view);
      return true;
    }

    if (actions.cancelPressed || actions.pausePressed) {
      this.handleButton('no', this.noButton.view);
      return true;
    }

    return false;
  }

  updateGamepadFocus() {
    if (!this.yesButton || !this.noButton) {
      return;
    }

    [this.yesButton, this.noButton].forEach((button) => {
      const focused = button.type === this.gamepadFocusType;
      button.view.alpha = focused ? 1 : 0.78;
      button.view.scale.set(focused ? 1.02 : 1);
    });
  }

  async loadAssets() {
    await Promise.all(Object.entries(ASSET_PATHS).map(async ([name, path]) => {
      const key = {
        panelV2: ASSET_KEYS.commonUi?.confirmDialogPanelV2,
        yesV2: ASSET_KEYS.commonUi?.confirmButtonYesV2,
        noV2: ASSET_KEYS.commonUi?.confirmButtonNoV2,
        warningChipV2: ASSET_KEYS.commonUi?.confirmWarningChipV2,
        costBadgeV2: ASSET_KEYS.commonUi?.confirmCostBadgeV2,
        panel: ASSET_KEYS.commonUi?.confirmDialogPanel,
        yes: ASSET_KEYS.commonUi?.confirmButtonYes,
        no: ASSET_KEYS.commonUi?.confirmButtonNo,
      }[name] ?? null;
      const texture = await this.loadTexture(key, path);

      if (texture) {
        this.textures.set(name, texture);
      }
    }));
    this.applyTextures();
  }

  async loadTexture(key, path) {
    const loaded = key ? await this.assetLoader?.load(key) : null;

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
    const panel = this.textures.get('panelV2') ?? this.textures.get('panel');
    this.panelSprite.texture = panel ?? Texture.EMPTY;
    this.panelSprite.visible = !!panel;
    this.panelFallback.visible = !panel;

    this.applySupplementTexture(this.titleChipSprite, this.titleChipFallback, this.textures.get('warningChipV2'));
    this.applySupplementTexture(this.detailBadgeSprite, this.detailBadgeFallback, this.textures.get('costBadgeV2'));
    this.applyButtonTexture(this.yesButton, this.textures.get('yesV2') ?? this.textures.get('yes'));
    this.applyButtonTexture(this.noButton, this.textures.get('noV2') ?? this.textures.get('no'));
  }

  applyButtonTexture(button, texture) {
    button.sprite.texture = texture ?? Texture.EMPTY;
    button.sprite.visible = !!texture;
    button.fallback.visible = !texture;
  }

  applySupplementTexture(sprite, fallback, texture) {
    sprite.texture = texture ?? Texture.EMPTY;
    sprite.visible = !!texture;
    fallback.visible = !texture;
  }

  drawFallback() {
    drawPanel(this.panelFallback, DIALOG.x, DIALOG.y, DIALOG.width, DIALOG.height, {
      accent: UI_COLORS.dna,
      alpha: 0.92,
      strokeAlpha: 0.74,
      radius: 12,
    });
    drawButtonFrame(this.titleChipFallback, TITLE_CHIP.width, TITLE_CHIP.height, {
      accent: UI_COLORS.danger,
      radius: 8,
    });
    this.titleChipFallback.position.set((this.width - TITLE_CHIP.width) / 2, TITLE_CHIP.y);
    drawButtonFrame(this.detailBadgeFallback, DETAIL_BADGE.width, DETAIL_BADGE.height, {
      accent: UI_COLORS.gold,
      radius: 8,
    });
    this.detailBadgeFallback.position.set((this.width - DETAIL_BADGE.width) / 2, DETAIL_BADGE.y);
    drawButtonFrame(this.yesButton.fallback, BUTTON.width, BUTTON.height, {
      accent: UI_COLORS.dna,
      glow: true,
      radius: 8,
    });
    drawButtonFrame(this.noButton.fallback, BUTTON.width, BUTTON.height, {
      accent: UI_COLORS.gold,
      radius: 8,
    });
  }

  createText(text, size, fill, wordWrapWidth = 260) {
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
