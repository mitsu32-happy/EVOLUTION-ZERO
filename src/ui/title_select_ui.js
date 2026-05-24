import { Assets, Container, Graphics, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import {
  ENDLESS_TITLES,
  STAGE_CLEAR_TITLES,
  TITLE_FRAME_DEFINITIONS,
  ZERO_TITLES,
} from '../data/reward_titles.js';
import { UI_COLORS } from './ui_theme.js';

const TITLE_PAGE_SIZE = 6;
const FRAME_PAGE_SIZE = 5;

// Card art is normalized so its alpha-visible bounds match these dimensions.
// Keep text/button layout inside this painted area, not the source-sheet crop.
const CARD = {
  x: 42,
  y: 202,
  width: 306,
  height: 58,
  gap: 8,
  paddingX: 18,
  paddingY: 9,
  buttonWidth: 58,
  buttonHeight: 24,
  textButtonGap: 12,
};

const TITLE_UI_PATHS = {
  panel: 'assets/ui/titles/title_select_panel.png',
  tabSelected: 'assets/ui/titles/title_select_tab_selected.png',
  tabInactive: 'assets/ui/titles/title_select_tab_inactive.png',
  slot: 'assets/ui/titles/title_select_slot.png',
  slotSelected: 'assets/ui/titles/title_select_slot_selected.png',
  buttonEquip: 'assets/ui/titles/title_select_button_equip.png',
  buttonClose: 'assets/ui/titles/title_select_button_close.png',
};

function getRowTextWidth() {
  return CARD.width - CARD.paddingX * 2 - CARD.buttonWidth - CARD.textButtonGap;
}

export class TitleSelectUi {
  constructor({
    width,
    height,
    saveManager,
    onClose,
    onChanged,
    onUiFeedback,
  }) {
    this.width = width;
    this.height = height;
    this.saveManager = saveManager;
    this.onClose = onClose;
    this.onChanged = onChanged;
    this.onUiFeedback = onUiFeedback;
    this.activeTab = 'titles';
    this.page = 0;
    this.saveData = null;
    this.selectedTitleId = null;
    this.selectedFrameId = null;
    this.lastEquipAt = 0;
    this.lastEquipKey = '';
    this.textures = new Map();

    this.view = new Container();
    this.view.visible = false;
    this.view.eventMode = 'passive';
    this.backdrop = new Graphics();
    this.panel = new Graphics();
    this.panelSprite = new Sprite(Texture.EMPTY);
    this.title = this.createText('称号設定', 20, '#fff0b4', 220);
    this.closeButton = this.createButton('閉じる', 274, 112, 76, 30, () => this.close());
    this.titleTab = this.createButton('称号', 42, 156, 138, 32, () => this.switchTab('titles'));
    this.frameTab = this.createButton('フレーム', 190, 156, 158, 32, () => this.switchTab('frames'));
    this.prevButton = this.createButton('前へ', 78, 648, 78, 30, () => this.changePage(-1));
    this.nextButton = this.createButton('次へ', 232, 648, 78, 30, () => this.changePage(1));
    this.pageText = this.createText('', 11, '#d7fff2', 80);
    this.hintText = this.createText('カードまたは装備ボタンで反映します', 10, '#8da49e', 280);
    this.feedbackText = this.createText('', 10, '#ffd36b', 260);
    this.rows = Array.from({ length: TITLE_PAGE_SIZE }, (_, index) => this.createRow(index));

    this.backdrop.eventMode = 'static';
    this.backdrop.hitArea = new Rectangle(0, 0, this.width, this.height);
    this.backdrop.cursor = 'default';
    this.backdrop.on('pointertap', (event) => event?.stopPropagation?.());
    this.backdrop.on('pointerup', (event) => event?.stopPropagation?.());

    this.title.anchor.set(0.5, 0);
    this.title.position.set(this.width / 2, 116);
    this.pageText.anchor.set(0.5, 0);
    this.pageText.position.set(this.width / 2, 654);
    this.hintText.anchor.set(0.5, 0);
    this.hintText.position.set(this.width / 2, 684);
    this.feedbackText.anchor.set(0.5, 0);
    this.feedbackText.position.set(this.width / 2, 704);

    this.view.addChild(
      this.backdrop,
      this.panel,
      this.panelSprite,
      this.title,
      this.closeButton.view,
      this.titleTab.view,
      this.frameTab.view,
      ...this.rows.map((row) => row.view),
      this.prevButton.view,
      this.nextButton.view,
      this.pageText,
      this.hintText,
      this.feedbackText,
    );
    this.drawBase();
    this.loadAssets();
  }

  async loadAssets() {
    await Promise.all(Object.entries(TITLE_UI_PATHS).map(async ([name, path]) => {
      try {
        const texture = await Assets.load(`${import.meta.env.BASE_URL}${path}`);
        this.textures.set(name, texture);
      } catch {
        this.textures.set(name, null);
      }
    }));
    this.drawBase();
    this.render();
  }

  show(saveData = this.saveManager?.getData?.()) {
    this.saveData = saveData;
    this.selectedTitleId = this.getCurrentTitleId(saveData);
    this.selectedFrameId = this.getCurrentFrameId(saveData);
    this.page = 0;
    this.feedbackText.text = '';
    this.view.visible = true;
    this.render();
  }

  hide() {
    this.view.visible = false;
  }

  close() {
    this.hide();
    this.onClose?.();
  }

  switchTab(tab) {
    if (this.activeTab === tab) {
      return;
    }

    this.activeTab = tab;
    this.page = 0;
    this.feedbackText.text = '';
    this.playFeedback('ui_tab');
    this.render();
  }

  changePage(direction) {
    const items = this.getItems();
    const pageSize = this.getPageSize();
    const pageMax = Math.max(0, Math.ceil(items.length / pageSize) - 1);

    this.page = Math.max(0, Math.min(pageMax, this.page + direction));
    this.playFeedback('ui_select');
    this.render();
  }

  select(item) {
    if (!item) {
      return;
    }

    if (this.activeTab === 'titles') {
      this.selectedTitleId = item.id;
    } else {
      this.selectedFrameId = item.id;
    }
    this.feedbackText.text = '';
    this.playFeedback('ui_select');
    this.render();
  }

  triggerEquip(item, event = null) {
    event?.stopPropagation?.();

    if (!item) {
      return;
    }

    const now = Date.now();
    const key = `${this.activeTab}:${item.id}`;
    if (this.lastEquipKey === key && now - this.lastEquipAt < 160) {
      return;
    }
    this.lastEquipKey = key;
    this.lastEquipAt = now;

    if (this.activeTab === 'titles') {
      this.selectedTitleId = item.id;
    } else {
      this.selectedFrameId = item.id;
    }
    this.equip(item);
  }

  equip(item = null) {
    const targetId = item?.id ?? (this.activeTab === 'titles' ? this.selectedTitleId : this.selectedFrameId);
    const result = this.activeTab === 'titles'
      ? this.saveManager?.setEquippedTitle?.(targetId)
      : this.saveManager?.setEquippedTitleFrame?.(targetId);

    if (!result?.success) {
      this.feedbackText.text = '未取得のため装備できません';
      this.playFeedback('ui_error');
      this.render();
      return;
    }

    this.saveData = result.data;
    this.selectedTitleId = this.getCurrentTitleId(this.saveData);
    this.selectedFrameId = this.getCurrentFrameId(this.saveData);
    this.feedbackText.text = '装備を更新しました';
    this.playFeedback('ui_confirm');
    this.onChanged?.(this.saveData);
    this.render();
  }

  render() {
    const items = this.getItems();
    const pageSize = this.getPageSize();
    const pageMax = Math.max(0, Math.ceil(items.length / pageSize) - 1);

    this.page = Math.max(0, Math.min(pageMax, this.page));
    this.drawTab(this.titleTab, this.activeTab === 'titles');
    this.drawTab(this.frameTab, this.activeTab === 'frames');
    this.drawActionButton(this.closeButton);
    this.drawActionButton(this.prevButton);
    this.drawActionButton(this.nextButton);
    this.pageText.text = `${this.page + 1} / ${pageMax + 1}`;
    this.prevButton.view.visible = pageMax > 0;
    this.nextButton.view.visible = pageMax > 0;

    const pageItems = items.slice(this.page * pageSize, this.page * pageSize + pageSize);
    this.rows.forEach((row, index) => {
      const item = pageItems[index] ?? null;
      row.view.visible = !!item;
      row.item = item;
      row.view.item = item;

      if (item) {
        this.drawRow(row, item);
      }
    });
  }

  getItems() {
    const data = this.saveData ?? this.saveManager?.getData?.() ?? {};

    if (this.activeTab === 'frames') {
      const ownedFrames = data.ownedTitleFrames ?? {};

      return Object.values(TITLE_FRAME_DEFINITIONS)
        .filter((frame) => ownedFrames[frame.id]?.owned)
        .sort((a, b) => this.getFrameOrder(b) - this.getFrameOrder(a));
    }

    const ownedTitles = data.ownedTitles ?? {};

    return [...STAGE_CLEAR_TITLES, ...ENDLESS_TITLES, ...ZERO_TITLES]
      .filter((title) => ownedTitles[title.id]?.owned)
      .sort((a, b) => (b.displayOrder ?? 0) - (a.displayOrder ?? 0));
  }

  getPageSize() {
    return this.activeTab === 'frames' ? FRAME_PAGE_SIZE : TITLE_PAGE_SIZE;
  }

  getFrameOrder(frame) {
    const order = { zero: 1000, epic: 700, rare: 500, normal: 300 };
    return order[frame.rarity] ?? 0;
  }

  getCurrentTitleId(data = this.saveData) {
    const ownedTitles = data?.ownedTitles ?? {};
    return ownedTitles[data?.equippedTitleId]?.owned ? data.equippedTitleId : null;
  }

  getCurrentFrameId(data = this.saveData) {
    const ownedFrames = data?.ownedTitleFrames ?? {};
    return ownedFrames[data?.equippedTitleFrameId]?.owned ? data.equippedTitleFrameId : null;
  }

  drawBase() {
    this.backdrop
      .clear()
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x000000, alpha: 0.58 });

    const panelTexture = this.textures.get('panel');
    this.panelSprite.texture = panelTexture ?? Texture.EMPTY;
    this.panelSprite.visible = !!panelTexture;
    this.panelSprite.position.set(24, 92);
    this.panelSprite.width = this.width - 48;
    this.panelSprite.height = 632;

    this.panel.clear();

    if (!panelTexture) {
      this.panel
        .roundRect(24, 92, this.width - 48, 632, 12)
        .fill({ color: 0x031012, alpha: 0.96 })
        .stroke({ color: 0x35d7ff, width: 1.4, alpha: 0.58 });
    }
  }

  drawTab(button, active) {
    const texture = this.textures.get(active ? 'tabSelected' : 'tabInactive');
    button.sprite.texture = texture ?? Texture.EMPTY;
    button.sprite.visible = !!texture;
    button.sprite.width = button.width;
    button.sprite.height = button.height;
    button.bg.clear();

    if (!texture) {
      button.bg
        .roundRect(0, 0, button.width, button.height, 8)
        .fill({ color: active ? 0x173136 : 0x071518, alpha: 0.96 })
        .stroke({ color: active ? UI_COLORS.gold : UI_COLORS.dna, width: 1.1, alpha: active ? 0.82 : 0.42 });
    }
    button.text.style.fill = active ? '#fff0b4' : '#d7fff2';
  }

  drawActionButton(button) {
    const texture = this.textures.get('buttonClose');
    button.sprite.texture = texture ?? Texture.EMPTY;
    button.sprite.visible = !!texture;
    button.sprite.width = button.width;
    button.sprite.height = button.height;
    button.bg.clear();

    if (!texture) {
      button.bg
        .roundRect(0, 0, button.width, button.height, 8)
        .fill({ color: 0x071518, alpha: 0.92 })
        .stroke({ color: UI_COLORS.dna, width: 1, alpha: 0.56 });
    }
  }

  drawRow(row, item) {
    const isFrame = this.activeTab === 'frames';
    const equipped = isFrame
      ? this.getCurrentFrameId(this.saveData) === item.id
      : this.getCurrentTitleId(this.saveData) === item.id;
    const selected = isFrame ? this.selectedFrameId === item.id : this.selectedTitleId === item.id;
    const isZero = item.rarity === 'zero';
    const accent = isFrame
      ? item.color
      : isZero
        ? 0xfff0b4
        : item.rarity === 'epic'
          ? 0xff3848
          : item.rarity === 'rare'
            ? 0xffc739
            : 0x35d7ff;

    const slotTexture = this.textures.get(selected || equipped || isZero ? 'slotSelected' : 'slot');
    row.slotSprite.texture = slotTexture ?? Texture.EMPTY;
    row.slotSprite.visible = !!slotTexture;
    row.slotSprite.width = CARD.width;
    row.slotSprite.height = CARD.height;
    row.bg.clear();

    if (!slotTexture) {
      row.bg
        .roundRect(0, 0, CARD.width, CARD.height, 8)
        .fill({ color: isZero ? 0x16051c : 0x071518, alpha: selected ? 0.98 : 0.88 })
        .stroke({ color: accent, width: selected ? 2 : 1, alpha: selected ? 0.92 : 0.52 });
    }

    const textWidth = getRowTextWidth();
    row.name.text = item.name;
    row.name.style.fill = isZero ? '#fff4c8' : '#ffffff';
    row.name.style.fontSize = item.name.length > 10 ? 12 : 13;
    row.name.style.wordWrap = false;
    row.name.style.wordWrapWidth = textWidth;
    row.meta.text = isFrame
      ? `${this.getRarityLabel(item.rarity)}フレーム`
      : `${this.getRarityLabel(item.rarity)} / ${this.getTitleScope(item)}`;
    row.meta.style.wordWrap = false;
    row.meta.style.wordWrapWidth = textWidth;
    this.fitText(row.name, textWidth, item.name.length > 10 ? 12 : 13, 10);
    this.fitText(row.meta, textWidth, 9, 8);
    row.badge.text = equipped ? '装備中' : '装備';
    row.badge.style.fill = equipped ? '#65e878' : '#fff0b4';

    const buttonTexture = this.textures.get('buttonEquip');
    row.badgeSprite.texture = buttonTexture ?? Texture.EMPTY;
    row.badgeSprite.visible = !!buttonTexture;
    row.badgeSprite.width = CARD.buttonWidth;
    row.badgeSprite.height = CARD.buttonHeight;
    row.badgeBg.clear();

    if (!buttonTexture) {
      row.badgeBg
        .roundRect(0, 0, CARD.buttonWidth, CARD.buttonHeight, 7)
        .fill({ color: equipped ? 0x123a24 : UI_COLORS.gold, alpha: 0.92 })
        .stroke({ color: equipped ? UI_COLORS.green : UI_COLORS.gold, width: 1, alpha: 0.74 });
    }

    row.buttonHit.clear()
      .roundRect(0, 0, CARD.buttonWidth + 4, CARD.buttonHeight + 4, 8)
      .fill({ color: 0x000000, alpha: 0.001 });
  }

  getRarityLabel(rarity) {
    return {
      zero: 'ZERO',
      epic: 'EXPERT',
      rare: 'HARD',
      normal: 'NORMAL',
    }[rarity] ?? '称号';
  }

  getTitleScope(title) {
    if (title.rarity === 'zero') {
      return `${this.getStageLabel(title.stageId)} ZERO`;
    }

    if (title.stageId) {
      return `${this.getStageLabel(title.stageId)} ${String(title.difficultyId ?? '').toUpperCase()}`;
    }

    if (title.thresholdSeconds) {
      return `${Math.floor(title.thresholdSeconds / 60)}分生存`;
    }

    if (title.killCount) {
      return `${title.killCount}撃破`;
    }

    return '達成報酬';
  }

  getStageLabel(stageId) {
    return {
      jungle: '密林',
      volcano: '火山',
      swamp: '沼地',
      ruins: '遺跡',
    }[stageId] ?? '共通';
  }

  createRow(index = 0) {
    const view = new Container();
    const bg = new Graphics();
    const slotSprite = new Sprite(Texture.EMPTY);
    const badgeBg = new Graphics();
    const badgeSprite = new Sprite(Texture.EMPTY);
    const buttonHit = new Graphics();
    const cardHit = new Graphics();
    const textWidth = getRowTextWidth();
    const name = this.createText('', 13, '#ffffff', textWidth);
    const meta = this.createText('', 9, '#9db2ad', textWidth);
    const badge = this.createText('装備', 9, '#071015', CARD.buttonWidth);
    const buttonX = CARD.width - CARD.paddingX - CARD.buttonWidth;
    const buttonY = Math.round((CARD.height - CARD.buttonHeight) / 2);

    view.addChild(bg, slotSprite, name, meta, badgeBg, badgeSprite, buttonHit, badge, cardHit);
    [name, meta, badgeBg, badgeSprite, badge, slotSprite, bg].forEach((child) => {
      child.eventMode = 'none';
    });
    name.position.set(CARD.paddingX, CARD.paddingY);
    meta.position.set(CARD.paddingX, CARD.paddingY + 22);
    badgeBg.position.set(buttonX, buttonY);
    badgeSprite.position.copyFrom(badgeBg.position);
    buttonHit.position.set(buttonX - 2, buttonY - 2);
    badge.anchor.set(0.5);
    badge.position.set(buttonX + CARD.buttonWidth / 2, buttonY + CARD.buttonHeight / 2);
    view.position.set(CARD.x, CARD.y + index * (CARD.height + CARD.gap));
    view.eventMode = 'passive';
    view.cursor = 'pointer';
    cardHit
      .rect(0, 0, CARD.width, CARD.height)
      .fill({ color: 0x000000, alpha: 0.001 });
    cardHit.eventMode = 'static';
    cardHit.cursor = 'pointer';
    cardHit.hitArea = new Rectangle(0, 0, CARD.width, CARD.height);
    cardHit.on('pointertap', (event) => this.triggerEquip(view.item, event));
    cardHit.on('pointerup', (event) => this.triggerEquip(view.item, event));
    buttonHit.eventMode = 'static';
    buttonHit.cursor = 'pointer';
    buttonHit.hitArea = new Rectangle(0, 0, CARD.buttonWidth + 4, CARD.buttonHeight + 4);
    buttonHit.on('pointertap', (event) => this.triggerEquip(view.item, event));
    buttonHit.on('pointerup', (event) => this.triggerEquip(view.item, event));

    return {
      view,
      bg,
      slotSprite,
      name,
      meta,
      badgeBg,
      badgeSprite,
      buttonHit,
      cardHit,
      badge,
      item: null,
    };
  }

  createButton(label, x, y, width, height, onTap) {
    const view = new Container();
    const bg = new Graphics();
    const sprite = new Sprite(Texture.EMPTY);
    const text = this.createText(label, 10, '#d7fff2', width - 12);

    view.position.set(x, y);
    view.hitArea = new Rectangle(0, 0, width, height);
    text.anchor.set(0.5);
    text.position.set(width / 2, height / 2);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.on('pointertap', () => onTap?.());
    view.on('pointerup', () => onTap?.());
    view.addChild(bg, sprite, text);
    bg.roundRect(0, 0, width, height, 8)
      .fill({ color: 0x071518, alpha: 0.92 })
      .stroke({ color: UI_COLORS.dna, width: 1, alpha: 0.56 });

    return { view, bg, sprite, text, width, height };
  }

  createText(text, size, fill, wordWrapWidth) {
    return new Text({
      text,
      style: {
        fontFamily: 'Zen Kaku Gothic New, Noto Sans JP, sans-serif',
        fontSize: size,
        fill,
        fontWeight: '700',
        wordWrap: true,
        wordWrapWidth,
        breakWords: true,
        lineHeight: Math.round(size * 1.25),
      },
    });
  }

  playFeedback(id) {
    this.onUiFeedback?.(id);
  }

  fitText(text, maxWidth, baseSize, minSize) {
    text.style.fontSize = baseSize;
    text.scale.set(1);
    const boundsWidth = text.getLocalBounds().width || 1;

    if (boundsWidth <= maxWidth) {
      return;
    }

    text.scale.set(Math.max(minSize / baseSize, maxWidth / boundsWidth));
  }
}
