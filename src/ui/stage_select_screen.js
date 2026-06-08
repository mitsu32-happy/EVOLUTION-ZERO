import { Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { ASSET_KEYS } from '../data/asset_manifest.js';
import {
  drawBackButtonFrame,
  drawButtonFrame,
  drawPanel,
  drawScreenBackground,
  UI_COLORS,
  toCssColor,
} from './ui_theme.js';

const STAGES = [
  {
    id: 'jungle',
    name: '密林地帯',
    zone: 'JUNGLE ZONE',
    sub: '群れが潜む基礎環境',
    detail: '濃い密林を進む基本ステージ。\n群れと高速個体への対応を覚える。',
    adaptation: '敵数は標準。移動と攻撃の基本を確認しやすい。',
    color: 0x65e878,
    risk: '標準',
  },
  {
    id: 'volcano',
    name: '火山地帯',
    zone: 'VOLCANIC ZONE',
    sub: '熱と攻撃性が高い危険環境',
    detail: '黒い岩場と溶岩光が残る危険地帯。\n爆発・火炎床と硬い敵に注意。',
    adaptation: '火炎床と硬い敵が増える。位置取りが重要。',
    color: 0xff5a3c,
    risk: '危険',
  },
  {
    id: 'swamp',
    name: '沼地地帯',
    zone: 'SWAMP ZONE',
    sub: '足を奪う毒沼と毒性の気流',
    detail: '毒霧と毒沼が広がる湿地。\n移動経路を見極めながら戦う。',
    adaptation: '毒沼で逃げ場が狭い。囲まれない判断が重要。',
    color: 0xae73ff,
    risk: '不安定',
  },
  {
    id: 'ruins',
    name: '遺跡地帯',
    zone: 'RUINS ZONE',
    sub: '旧施設の残骸が眠る未調査区画',
    detail: '崩れた研究施設跡を進む高難度区画。\n電磁攻撃と遠距離射撃に注意。',
    adaptation: '遠距離攻撃が多い。危険表示を見て避ける。',
    color: 0x9ca8ff,
    risk: '未解析',
  },
];

const DEPLOY_TYPES = [
  {
    id: 'normal',
    label: 'NORMAL',
    mode: 'standard',
    difficulty: 'normal',
    color: 0x31d7ff,
    locked: false,
    summary: '基本の難易度。敵を倒しながらステージに慣れよう。',
    density: '標準',
    dnaMultiplier: 'x1.0',
  },
  {
    id: 'hard',
    label: 'HARD',
    mode: 'standard',
    difficulty: 'hard',
    color: 0xffc739,
    locked: false,
    summary: '敵の数と強さが上がる。強化を選びながら押し切ろう。',
    density: '+少し',
    dnaMultiplier: 'x1.3',
  },
  {
    id: 'expert',
    label: 'EXPERT',
    mode: 'standard',
    difficulty: 'expert',
    color: 0xae73ff,
    locked: false,
    summary: '強敵と物量がさらに増える。育成済みの恐竜向け。',
    density: '+高め',
    dnaMultiplier: 'x1.7',
  },
  {
    id: 'endless',
    label: 'ENDLESS',
    mode: 'endless',
    difficulty: 'normal',
    color: 0x65e878,
    locked: false,
    summary: '倒れるまで続く記録挑戦。生存時間と撃破数を伸ばそう。',
    density: '+継続',
    dnaMultiplier: 'x1.5',
  },
  {
    id: 'zero',
    label: 'ZERO',
    mode: 'zero',
    difficulty: 'expert',
    color: 0xff3848,
    locked: true,
    summary: 'EXPERTクリア後の超高難度。ZERO進化と報酬を狙う挑戦。',
    density: 'ZERO',
    dnaMultiplier: '-',
  },
];

const CARD = { width: 82, height: 144, y: 112 };
const DETAIL = { x: 22, y: 264, width: 346, height: 250 };
const PREVIEW = { x: 38, y: 286, width: 314, height: 96 };
const DEPLOY_Y = 546;
const DEPLOY_DESC = { x: 24, y: 596, width: 342, height: 98 };
const STAGE_PAGE_SIZE = 4;

export class StageSelectScreen {
  constructor({ width, height, gameState, saveData = null, assetLoader = null, onBack, onContinue }) {
    this.width = width;
    this.height = height;
    this.gameState = gameState;
    this.saveData = saveData;
    this.assetLoader = assetLoader;
    this.onBack = onBack;
    this.onContinue = onContinue;
    this.selectedStage = gameState.selectedStage ?? 'jungle';
    this.selectedDifficulty = gameState.selectedDifficulty ?? 'normal';
    this.selectedMode = gameState.selectedMode ?? 'standard';
    this.stagePage = 0;
    this.thumbnailTextures = new Map();
    this.uiTextures = new Map();
    this.gamepadFocusArea = 'stage';

    this.view = new Container();
    this.background = new Graphics();
    this.screenBackdrop = new Sprite(Texture.EMPTY);
    this.title = this.createText('ステージ選択', 31, '#f4f7f5', 260);
    this.subtitle = this.createText('ステージと難易度を選択', 12, '#ff8f7d', 310);
    this.backButton = this.createSmallButton('‹');
    this.stageCards = [];
    this.deployButtons = [];
    this.pageControls = this.createPageControls();

    this.detailFallback = new Graphics();
    this.detailPanelSprite = new Sprite(Texture.EMPTY);
    this.detailPreviewFallback = new Graphics();
    this.detailPreview = new Sprite(Texture.EMPTY);
    this.detailPreviewMask = new Graphics();
    this.detailPreviewShade = new Graphics();
    this.detailTitle = this.createText('', 24, '#ffffff', 210);
    this.detailZone = this.createText('', 10, '#9bb4ae', 150);
    this.detailRisk = this.createText('', 10, '#fff0b4', 100);
    this.detailBody = this.createText('', 10, '#d7fff2', 300);
    this.detailAdaptation = this.createText('', 10, '#ffd36b', 300);
    this.detailRecommend = this.createText('', 10, '#7cf7d4', 300);
    this.deployTitle = this.createText('難易度', 13, '#8da49e', 220);
    this.deployDescBg = new Graphics();
    this.deployDescTitle = this.createText('', 15, '#ffffff', 150);
    this.deployDescBody = this.createText('', 11, '#d7fff2', 208);
    this.deployDescMeta = this.createText('', 9, '#fff0b4', 92);
    this.continueButton = this.createLargeButton('恐竜選択へ進む', '選択した条件で出撃準備');

    this.view.addChild(
      this.background,
      this.screenBackdrop,
      this.backButton.view,
      this.title,
      this.subtitle,
      this.detailFallback,
      this.detailPanelSprite,
      this.detailPreviewFallback,
      this.detailPreview,
      this.detailPreviewMask,
      this.detailPreviewShade,
      this.detailTitle,
      this.detailZone,
      this.detailRisk,
      this.detailBody,
      this.detailAdaptation,
      this.detailRecommend,
      this.deployTitle,
      this.deployDescBg,
      this.deployDescTitle,
      this.deployDescBody,
      this.deployDescMeta,
    );

    this.createStageCards();
    this.createDeployButtons();
    this.view.addChild(this.pageControls.view);
    this.view.addChild(this.continueButton.view);

    this.backButton.view.on('pointertap', () => this.onBack());
    this.pageControls.prev.view.on('pointertap', () => this.changeStagePage(-1));
    this.pageControls.next.view.on('pointertap', () => this.changeStagePage(1));
    this.continueButton.view.on('pointertap', () => {
      this.gameState.selectedStage = this.selectedStage;
      this.gameState.selectedDifficulty = this.selectedDifficulty;
      this.gameState.selectedMode = this.selectedMode;
      this.onContinue();
    });

    this.drawStatic();
    this.loadUiAssets();
    this.loadStageThumbnails();
    this.renderSelection();
  }

  show() {
    this.selectedStage = this.gameState.selectedStage ?? this.selectedStage;
    this.selectedDifficulty = this.gameState.selectedDifficulty ?? this.selectedDifficulty;
    this.selectedMode = this.gameState.selectedMode ?? this.selectedMode;
    this.ensureDeploySelectionUnlocked();
    this.ensureStagePageForSelection();
    this.renderSelection();
    this.view.visible = true;
  }

  setSaveData(saveData = null) {
    this.saveData = saveData;
    this.ensureDeploySelectionUnlocked();
    this.renderSelection();
  }

  hide() {
    this.view.visible = false;
  }

  loadUiAssets() {
    if (!this.assetLoader) {
      return;
    }

    Object.entries(ASSET_KEYS.stageSelectUi ?? {}).forEach(([name, key]) => {
      this.assetLoader.load(key).then((texture) => {
        if (texture) {
          this.uiTextures.set(name, texture);
          this.renderSelection();
        }
      });
    });
  }

  loadStageThumbnails() {
    if (!this.assetLoader) {
      return;
    }

    STAGES.forEach((stage) => {
      const key = ASSET_KEYS.stageThumbnails?.[stage.id];

      if (!key) {
        return;
      }

      this.assetLoader.load(key).then((texture) => {
        if (texture) {
          this.thumbnailTextures.set(stage.id, texture);
        } else {
          this.thumbnailTextures.delete(stage.id);
        }

        this.renderSelection();
      });
    });
  }

  createStageCards() {
    STAGES.forEach((stage, index) => {
      const card = {
        stage,
        view: new Container(),
        fallbackFrame: new Graphics(),
        frameSprite: new Sprite(Texture.EMPTY),
        thumbnail: new Sprite(Texture.EMPTY),
        thumbnailMask: new Graphics(),
        fallbackThumb: new Graphics(),
        shade: new Graphics(),
        name: this.createText(stage.name, 13, '#ffffff', 72),
        zone: this.createText(stage.zone, 8, '#a8c7c0', 72),
        badgeBg: new Graphics(),
        badgeSprite: new Sprite(Texture.EMPTY),
        badge: this.createText(stage.risk, 9, '#ffffff', 62),
      };

      card.view.position.set(22 + index * 86, CARD.y);
      card.view.eventMode = 'static';
      card.view.cursor = 'pointer';
      card.view.on('pointertap', () => {
        this.selectedStage = stage.id;
        this.ensureStagePageForSelection();
        this.renderSelection();
      });
      card.thumbnail.position.set(6, 8);
      card.thumbnail.width = 70;
      card.thumbnail.height = 74;
      card.thumbnail.mask = card.thumbnailMask;
      card.name.position.set(8, 94);
      card.zone.position.set(8, 119);
      card.badge.anchor.set(0.5);
      card.badge.position.set(56, 23);
      card.badgeSprite.position.set(26, 10);
      card.badgeSprite.width = 52;
      card.badgeSprite.height = 22;
      card.view.addChild(
        card.fallbackFrame,
        card.frameSprite,
        card.thumbnail,
        card.thumbnailMask,
        card.fallbackThumb,
        card.shade,
        card.name,
        card.zone,
        card.badgeBg,
        card.badgeSprite,
        card.badge,
      );
      this.stageCards.push(card);
      this.view.addChild(card.view);
    });
  }

  createDeployButtons() {
    const width = 64;
    const gap = 6;
    const startX = Math.round((this.width - (width * DEPLOY_TYPES.length + gap * (DEPLOY_TYPES.length - 1))) / 2);

    DEPLOY_TYPES.forEach((type, index) => {
      const button = {
        type,
        view: new Container(),
        fallbackBg: new Graphics(),
        sprite: new Sprite(Texture.EMPTY),
        label: this.createText(type.label, type.id === 'endless' ? 9 : 10, '#ffffff', width),
        lock: this.createText(type.locked ? 'LOCK' : '', 7, '#8da49e', width),
      };

      button.view.position.set(startX + index * (width + gap), DEPLOY_Y);
      button.view.eventMode = 'static';
      button.view.cursor = 'pointer';
      button.view.on('pointertap', () => {
        if (this.getDeployLockState(type).locked) {
          return;
        }

        this.selectedMode = type.mode;
        this.selectedDifficulty = type.difficulty;
        this.renderSelection();
      });
      button.label.anchor.set(0.5);
      button.label.position.set(width / 2, 19);
      button.lock.anchor.set(0.5);
      button.lock.position.set(width / 2, 34);
      button.view.addChild(button.fallbackBg, button.sprite, button.label, button.lock);
      this.deployButtons.push(button);
      this.view.addChild(button.view);
    });
  }

  handleGamepadAction(actions) {
    if (!this.view.visible) {
      return false;
    }

    if (actions.cancelPressed) {
      this.onBack?.();
      return true;
    }

    if (actions.nextPressed) {
      this.changeStagePage(1);
      return true;
    }

    if (actions.previousPressed) {
      this.changeStagePage(-1);
      return true;
    }

    if (actions.downPressed) {
      this.gamepadFocusArea = this.gamepadFocusArea === 'stage' ? 'difficulty' : 'continue';
      return true;
    }

    if (actions.upPressed) {
      this.gamepadFocusArea = this.gamepadFocusArea === 'continue' ? 'difficulty' : 'stage';
      return true;
    }

    if (actions.leftPressed || actions.rightPressed) {
      const delta = actions.rightPressed ? 1 : -1;
      if (this.gamepadFocusArea === 'stage') {
        this.moveStageSelection(delta);
      } else if (this.gamepadFocusArea === 'difficulty') {
        this.moveDifficultySelection(delta);
      }
      return true;
    }

    if (actions.confirmPressed) {
      if (this.gamepadFocusArea === 'continue') {
        this.gameState.selectedStage = this.selectedStage;
        this.gameState.selectedDifficulty = this.selectedDifficulty;
        this.gameState.selectedMode = this.selectedMode;
        this.onContinue?.();
      }
      return true;
    }

    return false;
  }

  moveStageSelection(delta) {
    const currentIndex = Math.max(0, STAGES.findIndex((stage) => stage.id === this.selectedStage));
    const nextIndex = Math.max(0, Math.min(STAGES.length - 1, currentIndex + delta));
    this.selectedStage = STAGES[nextIndex].id;
    this.ensureStagePageForSelection();
    this.renderSelection();
  }

  moveDifficultySelection(delta) {
    const selectable = DEPLOY_TYPES.filter((type) => !this.getDeployLockState(type).locked);
    const selectedId = this.getSelectedDeployType().id;
    const currentIndex = Math.max(0, selectable.findIndex((type) => type.id === selectedId));
    const nextIndex = Math.max(0, Math.min(selectable.length - 1, currentIndex + delta));
    const next = selectable[nextIndex];
    this.selectedMode = next.mode;
    this.selectedDifficulty = next.difficulty;
    this.renderSelection();
  }

  getGamepadFocusBounds() {
    if (this.gamepadFocusArea === 'difficulty') {
      return { x: 24, y: DEPLOY_Y - 8, width: this.width - 48, height: 50, radius: 12 };
    }

    if (this.gamepadFocusArea === 'continue') {
      return { x: 36, y: Math.max(728, this.height - 112), width: this.width - 72, height: 72, radius: 12 };
    }

    const index = Math.max(0, STAGES.findIndex((stage) => stage.id === this.selectedStage));
    const slot = index % STAGE_PAGE_SIZE;
    return { x: 22 + slot * 86, y: CARD.y, width: CARD.width, height: CARD.height, radius: 12 };
  }
  renderSelection() {
    const selectedStage = STAGES.find((stage) => stage.id === this.selectedStage) ?? STAGES[0];
    const texture = this.thumbnailTextures.get(selectedStage.id) ?? null;

    this.ensureDeploySelectionUnlocked();
    this.ensureStagePageForSelection();
    this.applyUiAssetTextures();
    this.detailTitle.text = selectedStage.name;
    this.detailTitle.style.fill = toCssColor(selectedStage.color);
    this.detailZone.text = selectedStage.zone;
    this.detailRisk.text = `危険度 ${selectedStage.risk}`;
    this.detailBody.text = selectedStage.detail;
    this.detailAdaptation.text = selectedStage.adaptation;
    this.detailRecommend.text = '';

    this.drawDetailPanel(selectedStage, texture);
    this.renderStageCards(selectedStage.id);
    this.renderPageControls();
    this.renderDeployButtons();
    this.renderDeployDescription();
  }

  drawDetailPanel(stage, texture) {
    const panelTexture = this.uiTextures.get('detailPanel') ?? null;

    this.detailPanelSprite.texture = panelTexture ?? Texture.EMPTY;
    this.detailPanelSprite.visible = !!panelTexture;
    this.detailPanelSprite.position.set(DETAIL.x, DETAIL.y);
    this.detailPanelSprite.width = DETAIL.width;
    this.detailPanelSprite.height = DETAIL.height;

    if (panelTexture) {
      this.detailFallback.clear();
    } else {
      drawPanel(this.detailFallback, DETAIL.x, DETAIL.y, DETAIL.width, DETAIL.height, {
        accent: stage.color,
        alpha: 0.88,
        strokeAlpha: 0.42,
      });
    }

    this.detailPreviewMask
      .clear()
      .roundRect(PREVIEW.x, PREVIEW.y, PREVIEW.width, PREVIEW.height, 8)
      .fill({ color: 0xffffff, alpha: 1 });

    this.detailPreview.texture = texture ?? Texture.EMPTY;
    this.detailPreview.visible = !!texture;
    this.detailPreview.alpha = 0.9;
    this.detailPreview.width = PREVIEW.width;
    this.detailPreview.height = PREVIEW.height;
    this.detailPreview.position.set(PREVIEW.x, PREVIEW.y);
    this.detailPreview.mask = this.detailPreviewMask;

    this.detailPreviewFallback.clear();
    if (!texture) {
      this.detailPreviewFallback
        .roundRect(PREVIEW.x, PREVIEW.y, PREVIEW.width, PREVIEW.height, 8)
        .fill({ color: stage.color, alpha: 0.18 })
        .poly([PREVIEW.x, PREVIEW.y + PREVIEW.height, PREVIEW.x + 98, PREVIEW.y + 32, PREVIEW.x + 172, PREVIEW.y + PREVIEW.height])
        .fill({ color: 0x040809, alpha: 0.48 })
        .poly([PREVIEW.x + 124, PREVIEW.y + PREVIEW.height, PREVIEW.x + 254, PREVIEW.y + 18, PREVIEW.x + PREVIEW.width, PREVIEW.y + PREVIEW.height])
        .fill({ color: 0x040809, alpha: 0.38 });
    }

    this.detailPreviewShade
      .clear()
      .roundRect(PREVIEW.x, PREVIEW.y, PREVIEW.width, PREVIEW.height, 8)
      .fill({ color: 0x000000, alpha: 0.26 })
      .rect(PREVIEW.x, PREVIEW.y + 63, PREVIEW.width, 33)
      .fill({ color: 0x000000, alpha: 0.44 })
      .rect(DETAIL.x + 18, DETAIL.y + 132, DETAIL.width - 36, 1)
      .fill({ color: stage.color, alpha: 0.34 });
  }

  renderStageCards(selectedStageId) {
    this.stageCards.forEach((card) => {
      const index = STAGES.findIndex((stage) => stage.id === card.stage.id);
      const page = Math.floor(index / STAGE_PAGE_SIZE);
      const slot = index % STAGE_PAGE_SIZE;
      const visible = page === this.stagePage;
      const selected = card.stage.id === selectedStageId;
      const texture = this.thumbnailTextures.get(card.stage.id) ?? null;
      const frameTexture = this.uiTextures.get(selected ? 'cardFrameSelected' : 'cardFrame') ?? null;
      const badgeTexture = this.uiTextures.get('badgeDanger') ?? null;

      card.view.visible = visible;
      card.view.position.set(22 + slot * 86, CARD.y);

      card.frameSprite.texture = frameTexture ?? Texture.EMPTY;
      card.frameSprite.visible = !!frameTexture;
      card.frameSprite.width = CARD.width;
      card.frameSprite.height = CARD.height;

      if (frameTexture) {
        card.fallbackFrame.clear();
      } else {
        card.fallbackFrame
          .clear()
          .roundRect(0, 0, CARD.width, CARD.height, 8)
          .fill({ color: 0x071012, alpha: selected ? 0.96 : 0.82 })
          .stroke({ color: selected ? card.stage.color : 0x335059, width: selected ? 2.5 : 1, alpha: selected ? 0.95 : 0.42 });
      }

      card.thumbnail.texture = texture ?? Texture.EMPTY;
      card.thumbnail.visible = !!texture;
      card.thumbnail.alpha = texture ? selected ? 0.9 : 0.74 : 0;
      card.thumbnailMask
        .clear()
        .roundRect(6, 8, 70, 74, 6)
        .fill({ color: 0xffffff, alpha: 1 });

      card.fallbackThumb.clear();
      if (!texture) {
        this.drawStageCardFallback(card, selected);
      }

      card.shade
        .clear()
        .roundRect(6, 8, 70, 74, 6)
        .fill({ color: 0x000000, alpha: selected ? 0.14 : 0.3 })
        .rect(6, 60, 70, 22)
        .fill({ color: 0x000000, alpha: 0.44 })
        .roundRect(0, 86, CARD.width, 58, 8)
        .fill({ color: 0x030707, alpha: 0.74 });

      card.badgeSprite.texture = badgeTexture ?? Texture.EMPTY;
      card.badgeSprite.visible = selected && !!badgeTexture;
      card.badgeBg.clear();
      if (selected && !badgeTexture) {
        card.badgeBg
          .roundRect(26, 10, 52, 22, 6)
          .fill({ color: 0x26090a, alpha: 0.82 })
          .stroke({ color: 0xff4d38, width: 1, alpha: 0.6 });
      }

      card.name.style.fill = selected ? toCssColor(card.stage.color) : '#ffffff';
      card.zone.style.fill = selected ? '#fff0b4' : '#a8c7c0';
      card.badge.visible = selected;
      card.badge.style.fill = '#fff0b4';
    });
  }

  renderPageControls() {
    const pageCount = this.getStagePageCount();
    const needsPaging = pageCount > 1;

    this.pageControls.view.visible = needsPaging;

    if (!needsPaging) {
      return;
    }

    this.pageControls.prev.view.alpha = this.stagePage > 0 ? 1 : 0.34;
    this.pageControls.prev.view.eventMode = this.stagePage > 0 ? 'static' : 'none';
    this.pageControls.next.view.alpha = this.stagePage < pageCount - 1 ? 1 : 0.34;
    this.pageControls.next.view.eventMode = this.stagePage < pageCount - 1 ? 'static' : 'none';

    this.pageControls.dots.clear();
    const dotStartX = Math.round(this.width / 2 - (pageCount - 1) * 8);
    for (let i = 0; i < pageCount; i += 1) {
      const active = i === this.stagePage;
      this.pageControls.dots
        .circle(dotStartX + i * 16, 0, active ? 4.4 : 3)
        .fill({ color: active ? 0x31d7ff : 0x7b8d8a, alpha: active ? 0.95 : 0.48 });
    }
  }

  changeStagePage(delta) {
    const pageCount = this.getStagePageCount();
    const nextPage = Math.max(0, Math.min(pageCount - 1, this.stagePage + delta));

    if (nextPage === this.stagePage) {
      return;
    }

    this.stagePage = nextPage;
    const pageFirstStage = STAGES[this.stagePage * STAGE_PAGE_SIZE];
    if (pageFirstStage) {
      this.selectedStage = pageFirstStage.id;
    }
    this.renderSelection();
  }

  ensureStagePageForSelection() {
    const selectedIndex = Math.max(0, STAGES.findIndex((stage) => stage.id === this.selectedStage));
    this.stagePage = Math.max(0, Math.min(this.getStagePageCount() - 1, Math.floor(selectedIndex / STAGE_PAGE_SIZE)));
  }

  getStagePageCount() {
    return Math.max(1, Math.ceil(STAGES.length / STAGE_PAGE_SIZE));
  }

  renderDeployButtons() {
    const selectedId = this.getSelectedDeployTypeId();

    this.deployButtons.forEach((button) => {
      const selected = button.type.id === selectedId;
      const lockState = this.getDeployLockState(button.type);
      const spriteKey = lockState.locked
        ? 'deployTypeButtonLocked'
        : selected
          ? 'deployTypeButtonSelected'
          : 'deployTypeButton';
      const texture = this.uiTextures.get(spriteKey) ?? null;

      button.sprite.texture = texture ?? Texture.EMPTY;
      button.sprite.visible = !!texture;
      button.sprite.width = 64;
      button.sprite.height = 44;

      if (texture) {
        button.fallbackBg.clear();
      } else {
        drawButtonFrame(button.fallbackBg, 64, 44, {
          accent: button.type.color,
          selected,
          glow: selected,
          disabled: lockState.locked,
          radius: 8,
        });
      }

      button.view.cursor = lockState.locked ? 'default' : 'pointer';
      button.label.style.fill = lockState.locked ? '#65716e' : selected ? toCssColor(button.type.color) : '#ffffff';
      button.lock.text = lockState.locked ? 'LOCK' : '';
      button.lock.style.fill = lockState.locked ? '#a16d6d' : '#8da49e';
    });
  }

  renderDeployDescription() {
    const deployType = this.getSelectedDeployType();
    const lockState = this.getDeployLockState(deployType);
    const accent = deployType.color;

    this.deployDescBg
      .clear()
      .roundRect(DEPLOY_DESC.x, DEPLOY_DESC.y, DEPLOY_DESC.width, DEPLOY_DESC.height, 10)
      .fill({ color: 0x050b0d, alpha: 0.86 })
      .stroke({ color: accent, width: 1.2, alpha: 0.48 })
      .rect(DEPLOY_DESC.x + 14, DEPLOY_DESC.y + 39, DEPLOY_DESC.width - 28, 1)
      .fill({ color: accent, alpha: 0.22 });

    this.deployDescTitle.text = deployType.label;
    this.deployDescTitle.style.fill = toCssColor(accent);
    this.deployDescBody.text = lockState.locked ? lockState.reason : deployType.summary;
    this.deployDescMeta.text = lockState.locked
      ? 'LOCKED'
      : `DNA報酬 ${deployType.dnaMultiplier}\n敵密度 ${deployType.density}`;
  }

  getSelectedDeployType() {
    return DEPLOY_TYPES.find((type) => type.id === this.getSelectedDeployTypeId()) ?? DEPLOY_TYPES[0];
  }

  getSelectedDeployTypeId() {
    if (this.selectedMode === 'endless') {
      return 'endless';
    }

    if (this.selectedMode === 'zero') {
      return 'zero';
    }

    return this.selectedDifficulty ?? 'normal';
  }

  ensureDeploySelectionUnlocked() {
    const current = this.getSelectedDeployType();

    if (!this.getDeployLockState(current).locked) {
      return;
    }

    this.selectedMode = 'standard';
    this.selectedDifficulty = 'normal';
  }

  getDeployLockState(type) {
    const progress = this.saveData?.stageProgress?.[this.selectedStage] ?? {};

    if (type.id === 'normal') {
      return { locked: false, reason: '' };
    }

    if (type.id === 'hard') {
      return {
        locked: !progress.normal?.cleared,
        reason: 'HARDはNORMALクリアで解放',
      };
    }

    if (type.id === 'expert') {
      return {
        locked: !progress.hard?.cleared,
        reason: 'EXPERTはHARDクリアで解放',
      };
    }

    if (type.id === 'endless') {
      return {
        locked: !progress.expert?.cleared,
        reason: 'ENDLESSはEXPERTクリアで解放',
      };
    }

    if (type.id === 'zero') {
      const allowRuinsZeroDebug = new URLSearchParams(window.location.search).get('debugAllowRuinsZero') === '1';

      if (this.selectedStage === 'ruins' && !allowRuinsZeroDebug) {
        return {
          locked: true,
          reason: 'ruins ZEROは今後追加予定',
        };
      }

      return {
        locked: !progress.expert?.cleared,
        reason: 'ZEROはEXPERTクリアで解放',
      };
    }

    return { locked: Boolean(type.locked), reason: '未解放' };
  }

  drawStageCardFallback(card, selected) {
    card.fallbackThumb
      .rect(6, 8, 70, 74)
      .fill({ color: card.stage.color, alpha: selected ? 0.28 : 0.16 })
      .poly([6, 82, 30, 44, 48, 82])
      .fill({ color: 0x050809, alpha: 0.52 })
      .poly([30, 82, 66, 34, 76, 82])
      .fill({ color: 0x050809, alpha: 0.42 });
  }

  drawStatic() {
    drawScreenBackground(this.background, this.width, this.height, UI_COLORS.danger);
    this.screenBackdrop.position.set(13, 88);
    this.screenBackdrop.width = this.width - 26;
    this.screenBackdrop.height = this.height - 188;
    this.screenBackdrop.alpha = 0.5;
    this.backButton.view.position.set(22, 28);
    this.title.anchor.set(0.5);
    this.title.position.set(this.width / 2, 42);
    this.subtitle.anchor.set(0.5);
    this.subtitle.position.set(this.width / 2, 76);

    this.detailTitle.position.set(44, 392);
    this.detailZone.position.set(45, 420);
    this.detailRisk.anchor.set(1, 0);
    this.detailRisk.position.set(this.width - 46, 420);
    this.detailBody.position.set(42, 442);
    this.detailBody.style.lineHeight = 14;
    this.detailAdaptation.position.set(42, 476);
    this.detailAdaptation.style.lineHeight = 14;
    this.detailRecommend.position.set(42, 491);
    this.detailRecommend.style.lineHeight = 14;
    this.deployTitle.anchor.set(0.5);
    this.deployTitle.position.set(this.width / 2, 528);
    this.deployDescTitle.position.set(42, 612);
    this.deployDescBody.position.set(42, 640);
    this.deployDescMeta.anchor.set(1, 0);
    this.deployDescMeta.position.set(this.width - 52, 609);
    this.deployDescMeta.style.align = 'right';
    this.deployDescMeta.style.lineHeight = 13;
    this.pageControls.view.position.set(0, 252);
    this.pageControls.prev.view.position.set(24, -26);
    this.pageControls.next.view.position.set(this.width - 56, -26);
    this.pageControls.dots.position.set(0, 0);
    this.continueButton.view.position.set(24, this.height - 92);
  }

  createSmallButton(label) {
    const view = new Container();
    const bg = new Graphics();
    const sprite = new Sprite(Texture.EMPTY);
    const text = this.createText(label, 28, '#e7fff6');

    drawBackButtonFrame(bg);
    sprite.width = 52;
    sprite.height = 52;
    text.anchor.set(0.5);
    text.position.set(26, 23);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.addChild(bg, sprite, text);

    return { view, bg, sprite, text };
  }

  createPageControls() {
    const view = new Container();
    const prev = this.createSmallButton('‹');
    const next = this.createSmallButton('›');
    const dots = new Graphics();

    prev.view.scale.set(0.62);
    next.view.scale.set(0.62);
    view.visible = false;
    view.addChild(prev.view, next.view, dots);

    return { view, prev, next, dots };
  }

  createLargeButton(label, subLabel) {
    const view = new Container();
    const bg = new Graphics();
    const sprite = new Sprite(Texture.EMPTY);
    const text = this.createText(label, 21, '#fff0b4', 250);
    const sub = this.createText(subLabel, 11, '#ffd36b', 250);

    drawButtonFrame(bg, this.width - 48, 70, {
      variant: 'primary',
      selected: true,
      glow: true,
    });
    sprite.width = this.width - 48;
    sprite.height = 70;
    text.anchor.set(0.5);
    text.position.set((this.width - 48) / 2, 25);
    sub.anchor.set(0.5);
    sub.position.set((this.width - 48) / 2, 49);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.addChild(bg, sprite, text, sub);

    return { view, bg, sprite, text, sub };
  }

  createText(text, size, fill, wordWrapWidth = 250) {
    return new Text({
      text,
      style: {
        fill,
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: size,
        fontWeight: '700',
        letterSpacing: 0,
        align: 'left',
        wordWrap: true,
        wordWrapWidth,
        lineHeight: size + 4,
      },
    });
  }

  applyUiAssetTextures() {
    const backTexture = this.uiTextures.get('backButtonFrame') ?? null;
    const continueTexture = this.uiTextures.get('continueButtonFrame') ?? null;
    const backdropTexture = this.uiTextures.get('screenBackdrop') ?? null;

    this.backButton.sprite.texture = backTexture ?? Texture.EMPTY;
    this.backButton.sprite.visible = !!backTexture;
    if (backTexture) {
      this.backButton.bg.clear();
    }

    this.continueButton.sprite.texture = continueTexture ?? Texture.EMPTY;
    this.continueButton.sprite.visible = !!continueTexture;
    if (continueTexture) {
      this.continueButton.bg.clear();
    }

    this.screenBackdrop.texture = backdropTexture ?? Texture.EMPTY;
    this.screenBackdrop.visible = !!backdropTexture;
  }
}
