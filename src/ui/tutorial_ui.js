import { Assets, Container, Graphics, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import { drawButtonFrame, drawPanel, UI_COLORS } from './ui_theme.js';

const PANEL = { width: 320, height: 252 };
const CENTER_PANEL = { x: 30, y: 210, width: 330, height: 300 };
const BUTTON = { width: 88, height: 36 };
const SAFE = 14;
const HIGHLIGHT_PADDING = 18;

const TUTORIAL_ASSETS = {
  panel: 'assets/ui/tutorial_text_panel_simple_a13b2.png',
  button: 'assets/ui/options/option_button_frame_v3.png',
  stepChip: 'assets/ui/home/news_badge_update_a07d.png',
};

function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeRect(rect) {
  if (!rect) return null;
  const x = Number(rect.x);
  const y = Number(rect.y);
  const width = Number(rect.width);
  const height = Number(rect.height);

  if (![x, y, width, height].every(Number.isFinite) || width <= 0 || height <= 0) {
    return null;
  }

  return {
    x,
    y,
    width,
    height,
    radius: rect.radius ?? 10,
  };
}

export class TutorialUi {
  constructor({ width, height }) {
    this.width = width;
    this.height = height;
    this.pages = [];
    this.index = 0;
    this.tutorialId = null;
    this.onComplete = null;
    this.onSkip = null;
    this.getTargetBounds = null;
    this.assetTextures = {};
    this.assetsReady = false;

    this.view = new Container();
    this.view.hitArea = new Rectangle(0, 0, width, height);
    this.dim = new Graphics();
    this.panelFallback = new Graphics();
    this.panelSprite = new Sprite(Texture.EMPTY);
    this.highlight = new Graphics();
    this.pointer = new Graphics();
    this.stepChip = new Sprite(Texture.EMPTY);
    this.title = this.createText('', 21, '#ffffff', 264);
    this.body = this.createText('', 12, '#e7fff6', 260);
    this.targetLabel = this.createText('', 10.5, '#ffd36b', 228);
    this.counter = this.createText('', 10, '#101923', 78);
    this.backButton = this.createButton('戻る');
    this.nextButton = this.createButton('次へ');
    this.skipButton = this.createButton('スキップ');

    this.view.visible = false;
    this.view.eventMode = 'static';
    this.view.on('pointertap', (event) => {
      event?.stopPropagation?.();
    });
    this.dim.eventMode = 'static';
    this.dim.on('pointertap', (event) => {
      event?.stopPropagation?.();
    });
    this.view.addChild(
      this.dim,
      this.highlight,
      this.pointer,
      this.panelFallback,
      this.panelSprite,
      this.stepChip,
      this.title,
      this.body,
      this.targetLabel,
      this.counter,
      this.backButton.view,
      this.nextButton.view,
      this.skipButton.view,
    );

    this.backButton.view.on('pointertap', (event) => {
      event?.stopPropagation?.();
      this.goBack();
    });
    this.nextButton.view.on('pointertap', (event) => {
      event?.stopPropagation?.();
      this.goNext();
    });
    this.skipButton.view.on('pointertap', (event) => {
      event?.stopPropagation?.();
      this.skip();
    });

    this.loadAssets();
    this.render();
  }

  async loadAssets() {
    try {
      const entries = await Promise.all(Object.entries(TUTORIAL_ASSETS).map(async ([key, path]) => {
        const texture = await Assets.load(assetUrl(path));
        return [key, texture];
      }));
      this.assetTextures = Object.fromEntries(entries);
      this.assetsReady = true;
      this.render();
    } catch {
      this.assetsReady = false;
      this.render();
    }
  }

  show({ id, pages, onComplete, onSkip, getTargetBounds = null }) {
    if (!Array.isArray(pages) || pages.length <= 0) {
      return;
    }

    this.tutorialId = id;
    this.pages = pages;
    this.index = 0;
    this.onComplete = onComplete;
    this.onSkip = onSkip;
    this.getTargetBounds = getTargetBounds;
    this.view.visible = true;
    this.render();
  }

  hide() {
    this.view.visible = false;
    this.getTargetBounds = null;
  }

  goBack() {
    if (this.index <= 0) {
      return;
    }

    this.index -= 1;
    this.render();
  }

  goNext() {
    if (this.index >= this.pages.length - 1) {
      this.complete();
      return;
    }

    this.index += 1;
    this.render();
  }

  skip() {
    const id = this.tutorialId;
    this.hide();
    this.onSkip?.(id);
  }

  complete() {
    const id = this.tutorialId;
    this.hide();
    this.onComplete?.(id);
  }

  render() {
    const page = this.pages[this.index] ?? {};
    const targetRect = this.resolveTargetRect(page);
    const panelRect = this.layoutPanel(targetRect, page.tooltipPosition ?? 'auto');
    const isLast = this.index >= this.pages.length - 1;

    this.title.text = page.title ?? '';
    this.body.text = page.body ?? '';
    this.targetLabel.text = '';
    this.targetLabel.visible = false;
    this.counter.text = `${this.index + 1}/${Math.max(1, this.pages.length)}`;
    this.backButton.view.visible = this.index > 0;
    this.nextButton.label.text = isLast ? '完了' : '次へ';

    this.drawOverlay(targetRect);
    this.drawPanelAt(panelRect);
    this.drawHighlight(targetRect);
    this.drawPointer(targetRect, panelRect);

    this.title.anchor.set(0.5, 0);
    this.title.position.set(panelRect.x + panelRect.width / 2, panelRect.y + 32);
    this.body.position.set(panelRect.x + 34, panelRect.y + 84);
    this.body.style.wordWrapWidth = panelRect.width - 68;
    this.targetLabel.position.set(panelRect.x + 28, panelRect.y + panelRect.height - 92);
    this.targetLabel.style.wordWrapWidth = panelRect.width - 56;

    this.stepChip.texture = this.assetTextures.stepChip ?? Texture.EMPTY;
    this.stepChip.visible = Boolean(this.assetTextures.stepChip);
    this.stepChip.anchor.set(0.5);
    this.stepChip.position.set(panelRect.x + panelRect.width - 48, panelRect.y + 38);
    this.stepChip.width = 72;
    this.stepChip.height = 28;

    this.counter.anchor.set(0.5);
    this.counter.position.set(panelRect.x + panelRect.width - 48, panelRect.y + 38);

    this.backButton.view.position.set(panelRect.x + 34, panelRect.y + panelRect.height - 52);
    this.skipButton.view.position.set(panelRect.x + 122, panelRect.y + panelRect.height - 52);
    this.nextButton.view.position.set(panelRect.x + panelRect.width - 122, panelRect.y + panelRect.height - 52);
    this.updateButtonTexture(this.backButton);
    this.updateButtonTexture(this.skipButton);
    this.updateButtonTexture(this.nextButton);
  }

  resolveTargetRect(page) {
    const fromProvider = this.getTargetBounds?.(page.targetId, page);
    return normalizeRect(fromProvider) ?? normalizeRect(page.highlight ?? page.targetBounds);
  }

  layoutPanel(targetRect, preferredPosition) {
    if (!targetRect) {
      return CENTER_PANEL;
    }

    const width = PANEL.width;
    const height = PANEL.height;
    const target = this.getPaddedRect(targetRect);
    const panelX = clamp(target.x + target.width / 2 - width / 2, SAFE, this.width - width - SAFE);

    const canBottom = target.y + target.height + height + 20 <= this.height - SAFE;
    const canTop = target.y - height - 20 >= SAFE;
    const position = preferredPosition === 'top' || preferredPosition === 'bottom'
      ? preferredPosition
      : target.y < this.height * 0.48 ? 'bottom' : 'top';

    let panelY;
    if (position === 'bottom' && canBottom) {
      panelY = target.y + target.height + 18;
    } else if (position === 'top' && canTop) {
      panelY = target.y - height - 18;
    } else if (canBottom) {
      panelY = target.y + target.height + 18;
    } else if (canTop) {
      panelY = target.y - height - 18;
    } else {
      const topCandidate = SAFE;
      const bottomCandidate = this.height - height - SAFE;
      const topOverlap = this.getOverlapArea({ x: panelX, y: topCandidate, width, height }, target);
      const bottomOverlap = this.getOverlapArea({ x: panelX, y: bottomCandidate, width, height }, target);
      panelY = topOverlap <= bottomOverlap ? topCandidate : bottomCandidate;
    }

    return { x: panelX, y: panelY, width, height };
  }

  getOverlapArea(a, b) {
    const left = Math.max(a.x, b.x);
    const top = Math.max(a.y, b.y);
    const right = Math.min(a.x + a.width, b.x + b.width);
    const bottom = Math.min(a.y + a.height, b.y + b.height);
    return Math.max(0, right - left) * Math.max(0, bottom - top);
  }

  drawOverlay(targetRect) {
    this.dim.clear();

    if (!targetRect) {
      this.dim.rect(0, 0, this.width, this.height).fill({ color: 0x000000, alpha: 0.7 });
      return;
    }

    const padded = this.getPaddedRect(targetRect);
    const x = padded.x;
    const y = padded.y;
    const right = padded.x + padded.width;
    const bottom = padded.y + padded.height;
    const color = 0x000000;
    const alpha = 0.66;

    this.dim.rect(0, 0, this.width, y).fill({ color, alpha });
    this.dim.rect(0, bottom, this.width, this.height - bottom).fill({ color, alpha });
    this.dim.rect(0, y, x, bottom - y).fill({ color, alpha });
    this.dim.rect(right, y, this.width - right, bottom - y).fill({ color, alpha });
    this.dim.roundRect(x, y, right - x, bottom - y, targetRect.radius ?? 12)
      .stroke({ color: UI_COLORS.dna, width: 1, alpha: 0.28 });
  }

  drawPanelAt(rect) {
    this.panelFallback.clear();
    drawPanel(this.panelFallback, rect.x, rect.y, rect.width, rect.height, {
      accent: UI_COLORS.dna,
      alpha: 0.9,
      radius: 10,
      strokeAlpha: 0.62,
    });

    this.panelSprite.texture = this.assetTextures.panel ?? Texture.EMPTY;
    this.panelSprite.visible = Boolean(this.assetTextures.panel);
    this.panelSprite.position.set(rect.x, rect.y);
    this.panelSprite.width = rect.width;
    this.panelSprite.height = rect.height;
    this.panelFallback.visible = !this.panelSprite.visible;
  }

  drawHighlight(rect) {
    this.highlight.clear();

    if (!rect) {
      return;
    }

    const padded = this.getPaddedRect(rect);
    this.highlight
      .roundRect(padded.x, padded.y, padded.width, padded.height, rect.radius ?? 12)
      .stroke({ color: UI_COLORS.gold, width: 3, alpha: 0.96 })
      .roundRect(padded.x - 5, padded.y - 5, padded.width + 10, padded.height + 10, rect.radius ?? 16)
      .stroke({ color: UI_COLORS.dna, width: 2, alpha: 0.55 })
      .roundRect(padded.x - 10, padded.y - 10, padded.width + 20, padded.height + 20, rect.radius ?? 18)
      .stroke({ color: 0x8e6cff, width: 1, alpha: 0.36 });
  }

  getPaddedRect(rect) {
    const pad = HIGHLIGHT_PADDING;
    const x = clamp(rect.x - pad, 0, this.width);
    const y = clamp(rect.y - pad, 0, this.height);
    const right = clamp(rect.x + rect.width + pad, 0, this.width);
    const bottom = clamp(rect.y + rect.height + pad, 0, this.height);

    return {
      x,
      y,
      width: Math.max(0, right - x),
      height: Math.max(0, bottom - y),
      radius: rect.radius ?? 12,
    };
  }

  drawPointer(targetRect, panelRect) {
    this.pointer.clear();
    if (!targetRect) {
      return;
    }

    const startX = clamp(targetRect.x + targetRect.width / 2, SAFE, this.width - SAFE);
    const startY = targetRect.y + targetRect.height / 2;
    const endX = clamp(panelRect.x + panelRect.width / 2, SAFE, this.width - SAFE);
    const endY = startY < panelRect.y ? panelRect.y + 10 : panelRect.y + panelRect.height - 10;

    this.pointer
      .moveTo(startX, startY)
      .lineTo(endX, endY)
      .stroke({ color: UI_COLORS.dna, width: 2, alpha: 0.42 });
  }

  createButton(label) {
    const view = new Container();
    const sprite = new Sprite(Texture.EMPTY);
    const bg = new Graphics();
    const text = this.createText(label, 12, '#e7fff6', BUTTON.width - 10);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    drawButtonFrame(bg, BUTTON.width, BUTTON.height, {
      accent: UI_COLORS.dna,
      selected: true,
      glow: false,
    });
    text.anchor.set(0.5);
    text.position.set(BUTTON.width / 2, BUTTON.height / 2 - 1);
    view.addChild(bg, sprite, text);
    return { view, bg, sprite, label: text };
  }

  updateButtonTexture(button) {
    button.sprite.texture = this.assetTextures.button ?? Texture.EMPTY;
    button.sprite.visible = Boolean(this.assetTextures.button);
    button.sprite.width = BUTTON.width;
    button.sprite.height = BUTTON.height;
    button.bg.visible = !button.sprite.visible;
  }

  createText(text, fontSize, fill, wordWrapWidth) {
    return new Text({
      text,
      style: {
        fill,
        fontFamily: 'Zen Kaku Gothic New, Noto Sans JP, sans-serif',
        fontSize,
        fontWeight: '700',
        letterSpacing: 0,
        lineHeight: Math.round(fontSize * 1.45),
        wordWrap: true,
        wordWrapWidth,
        breakWords: true,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowAlpha: 0.58,
        dropShadowBlur: 2,
        dropShadowDistance: 1,
      },
    });
  }
}
