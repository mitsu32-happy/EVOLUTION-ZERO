import { Assets, Container, Graphics, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import { ASSET_KEYS } from '../data/asset_manifest.js';
import {
  ANALYSIS_CONVERSION_RATES,
  getResearchCostDetail,
  getResearchNextEffectLabel,
  getResearchItemsByCategory,
  RESEARCH_CATEGORIES,
  RESEARCH_CATEGORY_IDS,
} from '../data/research.js';
import { createBottomNav } from './bottom_nav.js';
import { ConfirmDialog } from './confirm_dialog.js';
import { playPressFeedback } from './ui_feedback.js';
import { drawButtonFrame, drawPanel, drawScreenBackground, UI_COLORS } from './ui_theme.js';
import {
  COMPANION_HATCH_CONFIG,
  getCompanionById,
} from '../data/companion_dinos.js';

const RESEARCH_ASSET_PATHS = {
  researchBackground: 'assets/ui/research/research_background.png',
  dnaCorePanel: 'assets/ui/research/dna_core_panel.png',
  categoryTab: 'assets/ui/research/research_category_tab.png',
  categoryTabSelected: 'assets/ui/research/research_category_tab_selected.png',
  cardFrame: 'assets/ui/research/research_card_ready_a12b.png',
  cardLocked: 'assets/ui/research/research_card_locked_a12b.png',
  cardCompleted: 'assets/ui/research/research_card_done_a12b.png',
  costBadge: 'assets/ui/research/research_button_study_a12b.png',
  analysisConvertPanel: 'assets/ui/research/analysis_convert_panel.png',
};

const RESEARCH_ICON_PATHS = {
  dnaResource: 'assets/ui/research/icons/icon_dna_resource.png',
  researchPt: 'assets/ui/research/icons/icon_research_pt.png',
  bodyEnhancement: 'assets/ui/research/icons/icon_body_enhancement.png',
  adaptationAbility: 'assets/ui/research/icons/icon_adaptation_ability.png',
  specialMutation: 'assets/ui/research/icons/icon_special_mutation.png',
  unknownDomain: 'assets/ui/research/icons/icon_unknown_domain.png',
  analysisConversion: 'assets/ui/research/icons/icon_analysis_conversion.png',
  dnaGain: 'assets/ui/research/icons/icon_dna_gain.png',
  initialDurability: 'assets/ui/research/icons/icon_initial_durability.png',
  attackFoundation: 'assets/ui/research/icons/icon_attack_foundation.png',
  slashWave: 'assets/ui/research/icons/icon_slash_wave.png',
  poisonSpore: 'assets/ui/research/icons/icon_poison_spore.png',
  boneSpike: 'assets/ui/research/icons/icon_bone_spike.png',
  evolutionBranch: 'assets/ui/research/icons/icon_evolution_branch.png',
  unknownDinoScan: 'assets/ui/research/icons/icon_unknown_dino_scan.png',
  stageScan: 'assets/ui/research/icons/icon_stage_scan.png',
  skillAccelBlades: 'assets/ui/skills/icon_accel_blades.png',
  skillPredatorMark: 'assets/ui/skills/icon_predator_mark.png',
  skillFlameBreath: 'assets/ui/skills/icon_flame_breath.png',
};

const CORE_PANEL = { x: 8, y: 102, width: 374, height: 88 };
const CATEGORY_Y = 218;
const CATEGORY_TAB = { width: 68, height: 58, gap: 3 };
const SUMMARY_PANEL = { x: 20, y: 286, width: 350, height: 62 };
const CARD = { y: 350, height: 82, gap: 5 };
const CARD_POOL_SIZE = 18;
const BODY_SCROLL_VIEW = { top: 350, bottom: 700 };
const NOTICE_Y = 728;

const CARD_LAYOUT = {
  x: 8,
  width: 374,
  iconX: 42,
  iconY: 23,
  iconSize: 36,
  textX: 94,
  textWidth: 150,
  badgeX: 258,
  badgeY: 47,
  badgeWidth: 92,
  badgeHeight: 26,
  progressX: 94,
  nameLimit: 15,
  descLimit: 20,
  effectLimit: 12,
  stepLimit: 16,
};

const CATEGORY_COLORS = {
  [RESEARCH_CATEGORY_IDS.bodyEnhancement]: UI_COLORS.dna,
  [RESEARCH_CATEGORY_IDS.adaptationAbility]: UI_COLORS.gold,
  [RESEARCH_CATEGORY_IDS.specialMutation]: 0xff6b62,
  [RESEARCH_CATEGORY_IDS.unknownDomain]: 0x91a3b8,
  [RESEARCH_CATEGORY_IDS.analysisConversion]: 0xffb13b,
};

export class ResearchScreen {
  constructor({ width, height, saveManager, assetLoader = null, onHome, onResearch, onCodex, onOptions }) {
    this.width = width;
    this.height = height;
    this.saveManager = saveManager;
    this.assetLoader = assetLoader;
    this.onHome = onHome;
    this.onResearch = onResearch;
    this.onCodex = onCodex;
    this.onOptions = onOptions;
    this.selectedCategory = RESEARCH_CATEGORY_IDS.bodyEnhancement;
    this.textures = new Map();

    this.view = new Container();
    this.background = new Graphics();
    this.backgroundSprite = new Sprite(Texture.EMPTY);
    this.overlay = new Graphics();
    this.corePanel = new Sprite(Texture.EMPTY);
    this.title = this.createText('DNA研究室', 30, '#f4f7f5', 260);
    this.subtitle = this.createText('進化の可能性を解析する', 12, '#7cf7d4', 320);
    this.dnaIcon = new Sprite(Texture.EMPTY);
    this.researchPtIcon = new Sprite(Texture.EMPTY);
    this.dnaText = this.createText('', 21, '#fff0b4', 120);
    this.researchPtText = this.createText('', 21, '#d7f2ff', 120);
    this.categoryTitle = this.createText('', 14, '#7cf7d4', 160);
    this.categoryNote = this.createText('', 10, '#cbe0da', 184);
    this.categoryTitle.visible = false;
    this.categoryNote.visible = false;
    this.summaryBg = new Graphics();
    this.summaryTitle = this.createText('', 17, '#ffffff', 180);
    this.summaryBody = this.createText('', 10, '#cbe0da', 292);
    this.scrollHintText = this.createText('', 10, '#7cf7d4', 140);
    this.bodyScrollTrack = new Graphics();
    this.bodyScrollThumb = new Graphics();
    this.noticeText = this.createText('', 12, '#ffd36b', 320);
    this.bottomNav = createBottomNav({
      width: this.width,
      height: this.height,
      active: 'research',
      assetLoader: this.assetLoader,
      onNavigate: (id) => this.handleNav(id),
    });
    this.confirmDialog = new ConfirmDialog({
      width: this.width,
      height: this.height,
      assetLoader: this.assetLoader,
    });
    this.categoryButtons = [];
    this.cards = [];
    this.bodyScrollOffset = 0;
    this.bodyScrollDrag = null;
    this.gamepadFocusArea = 'card';
    this.gamepadFocusIndex = 0;
    this.gamepadScrollAccumulator = 0;

    this.view.eventMode = 'static';
    this.view.hitArea = new Rectangle(0, 0, width, height);
    this.view.on('wheel', (event) => this.handleBodyScrollWheel(event));
    this.view.on('pointerdown', (event) => this.startBodyScroll(event));
    this.view.on('pointermove', (event) => this.updateBodyScrollDrag(event));
    this.view.on('pointerup', () => this.endBodyScrollDrag());
    this.view.on('pointerupoutside', () => this.endBodyScrollDrag());

    this.view.addChild(
      this.background,
      this.backgroundSprite,
      this.overlay,
      this.corePanel,
      this.title,
      this.subtitle,
      this.dnaIcon,
      this.researchPtIcon,
      this.dnaText,
      this.researchPtText,
      this.categoryTitle,
      this.categoryNote,
      this.summaryBg,
      this.summaryTitle,
      this.summaryBody,
      this.scrollHintText,
      this.bodyScrollTrack,
      this.bodyScrollThumb,
      this.noticeText,
      this.bottomNav.view,
    );

    this.createCategoryButtons();
    this.createCards();
    this.view.addChild(this.confirmDialog.view);
    this.drawStatic();
    this.loadAssets();
    this.render();
  }

  show() {
    this.bottomNav.setActive?.('research');
    this.render();
    this.view.visible = true;
  }

  hide() {
    this.view.visible = false;
  }

  loadAssets() {
    Object.entries(RESEARCH_ASSET_PATHS).forEach(([name, path]) => {
      const key = ASSET_KEYS.researchUi?.[name] ?? null;
      this.loadTexture(key, path).then((texture) => {
        if (texture) {
          this.textures.set(name, texture);
          this.applyTextures();
          this.render();
        }
      });
    });

    Object.entries(RESEARCH_ICON_PATHS).forEach(([name, path]) => {
      const key = ASSET_KEYS.researchIcons?.[name] ?? null;
      this.loadTexture(key, path).then((texture) => {
        if (texture) {
          this.textures.set(`icon:${name}`, texture);
          this.applyTextures();
          this.render();
        }
      });
    });
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

  createCategoryButtons() {
    const totalWidth = RESEARCH_CATEGORIES.length * CATEGORY_TAB.width + (RESEARCH_CATEGORIES.length - 1) * CATEGORY_TAB.gap;
    const startX = Math.round((this.width - totalWidth) / 2);

    RESEARCH_CATEGORIES.forEach((category, index) => {
      const button = {
        category,
        view: new Container(),
        fallback: new Graphics(),
        sprite: new Sprite(Texture.EMPTY),
        iconSprite: new Sprite(Texture.EMPTY),
        iconFallback: new Graphics(),
        label: this.createText(category.shortName, 12, '#d7fff2', CATEGORY_TAB.width - 8),
      };

      button.view.position.set(startX + index * (CATEGORY_TAB.width + CATEGORY_TAB.gap), CATEGORY_Y);
      button.view.hitArea = new Rectangle(0, 0, CATEGORY_TAB.width, CATEGORY_TAB.height);
      button.iconSprite.position.set(22, 6);
      button.iconSprite.width = 24;
      button.iconSprite.height = 24;
      button.label.anchor.set(0.5);
      button.label.position.set(CATEGORY_TAB.width / 2, 43);
      button.view.eventMode = 'static';
      button.view.cursor = 'pointer';
      button.view.on('pointertap', () => {
        playPressFeedback(button.view, {
          width: CATEGORY_TAB.width,
          height: CATEGORY_TAB.height,
          scale: 0.98,
          alpha: 0.86,
          duration: 95,
        });
        this.selectedCategory = category.id;
        this.bodyScrollOffset = 0;
        this.noticeText.text = '';
        this.render();
      });
      button.view.addChild(button.sprite, button.fallback, button.iconSprite, button.iconFallback, button.label);
      this.categoryButtons.push(button);
      this.view.addChild(button.view);
    });
  }

  createCards() {
    for (let index = 0; index < CARD_POOL_SIZE; index += 1) {
      const card = {
        view: new Container(),
        fallback: new Graphics(),
        frame: new Sprite(Texture.EMPTY),
        costBadge: new Sprite(Texture.EMPTY),
        iconSprite: new Sprite(Texture.EMPTY),
        iconFallback: new Graphics(),
        progress: new Graphics(),
        name: this.createText('', 14, '#ffffff', CARD_LAYOUT.textWidth),
        desc: this.createText('', 9, '#cbe0da', CARD_LAYOUT.textWidth),
        effect: this.createText('', 10, '#7cf7d4', CARD_LAYOUT.textWidth),
        step: this.createText('', 10, '#ffd36b', CARD_LAYOUT.textWidth),
        tagChip: new Graphics(),
        tagText: this.createText('', 9, '#d7fff2', 86),
        costDnaIcon: new Sprite(Texture.EMPTY),
        costPtIcon: new Sprite(Texture.EMPTY),
        costDnaText: this.createText('', 9, '#fff0b4', 42),
        costPtText: this.createText('', 9, '#d7f2ff', 42),
        status: this.createText('', 12, '#e7fff6', CARD_LAYOUT.badgeWidth - 8),
        button: new Container(),
        buttonBg: new Graphics(),
      };

      card.view.position.set(CARD_LAYOUT.x, CARD.y + index * (CARD.height + CARD.gap));
      card.view.eventMode = 'static';
      card.view.cursor = 'pointer';
      card.view.on('pointertap', () => this.handleCardAction(card));
      card.button.eventMode = 'none';
      card.button.addChild(card.buttonBg);
      card.view.addChild(
        card.frame,
        card.fallback,
        card.iconSprite,
        card.iconFallback,
        card.progress,
        card.name,
        card.desc,
        card.effect,
        card.step,
        card.tagChip,
        card.tagText,
        card.costDnaIcon,
        card.costPtIcon,
        card.costDnaText,
        card.costPtText,
        card.costBadge,
        card.status,
        card.button,
      );
      this.cards.push(card);
      this.view.addChild(card.view);
    }
  }

  createPageControls() {
    const makeButton = (label, x, onTap) => {
      const button = {
        view: new Container(),
        bg: new Graphics(),
        label: this.createText(label, 16, '#d7fff2', 34),
      };

      button.view.position.set(x, 324);
      button.view.hitArea = new Rectangle(0, 0, 34, 22);
      button.view.eventMode = 'static';
      button.view.cursor = 'pointer';
      button.label.anchor.set(0.5);
      button.label.position.set(17, 11);
      button.view.on('pointertap', () => {
        playPressFeedback(button.view, { width: 34, height: 22, scale: 0.96, alpha: 0.78, duration: 90 });
        onTap();
      });
      button.view.addChild(button.bg, button.label);
      this.view.addChild(button.view);
      return button;
    };

    this.pagePrev = makeButton('<', 274, () => {
      this.cardPage = Math.max(0, this.cardPage - 1);
      this.render();
    });
    this.pageNext = makeButton('>', 346, () => {
      this.cardPage += 1;
      this.render();
    });
    this.pageText = this.createText('', 11, '#cbe0da', 42);
    this.pageText.anchor.set(0.5);
    this.pageText.position.set(331, 336);
    this.view.addChild(this.pageText);
  }

  handleCardAction(card) {
    const item = card.item;

    if (card.isConversion) {
      this.handleConversionAction(card);
      return;
    }

    if (card.isCompanionHatch) {
      this.handleCompanionHatchAction(card);
      return;
    }

    if (!item || !this.isPurchasableResearch(item) || card.isMax) {
      this.noticeText.text = '本格接続は次フェーズで実装予定です';
      return;
    }

    if (!card.canBuy) {
      playPressFeedback(card.view, {
        width: card.layout?.width ?? CARD_LAYOUT.width,
        height: CARD.height,
        scale: 0.96,
        alpha: 0.72,
        duration: 120,
      });
      const level = this.saveManager.getResearchLevel?.(item.id) ?? 0;
      const cost = getResearchCostDetail(item, level);
      this.noticeText.text = `${this.getInsufficientLabel(cost, this.saveManager.getData())}です`;
      return;
    }

    playPressFeedback(card.view, {
      width: card.layout?.width ?? CARD_LAYOUT.width,
      height: CARD.height,
      scale: 0.97,
      alpha: 0.84,
      duration: 95,
    });
    this.showResearchConfirm(item);
  }

  showResearchConfirm(item) {
    const level = this.saveManager.getResearchLevel?.(item.id) ?? 0;
    const cost = getResearchCostDetail(item, level);

    if (cost === null) {
      this.noticeText.text = '研究上限です';
      return;
    }

    const isDinoUnlock = !!item.unlockDinoId;
    this.confirmDialog.show({
      title: '研究確認',
      message: `${item.name}\nこの研究を実行しますか？`,
      detail: isDinoUnlock
        ? `必要: ${this.formatCost(cost)}\n解放: ${item.effectLabel ?? item.name}`
        : `${this.formatCost(cost)} を消費\n強化段階 ${level} -> ${level + 1}`,
      confirmLabel: 'はい',
      cancelLabel: 'いいえ',
      onConfirm: () => this.purchaseResearch(item),
      onCancel: () => {
        this.noticeText.text = '研究をキャンセルしました';
      },
    });
  }

  purchaseResearch(item) {
    const success = this.saveManager.buyResearch(item.id);
    const level = this.saveManager.getResearchLevel?.(item.id) ?? 0;
    const cost = getResearchCostDetail(item, level);
    this.noticeText.text = success
      ? (item.unlockDinoId ? `${item.effectLabel ?? item.name}しました` : `${item.name} の研究を進めました`)
      : `${this.getInsufficientLabel(cost, this.saveManager.getData())}、または研究上限です`;
    this.render();
  }

  handleConversionAction(card) {
    const rate = card.conversionRate;

    if (!rate) {
      return;
    }

    if (!card.canBuy) {
      playPressFeedback(card.view, {
        width: card.layout?.width ?? CARD_LAYOUT.width,
        height: CARD.height,
        scale: 0.96,
        alpha: 0.72,
        duration: 120,
      });
      this.noticeText.text = 'DNAが不足しています';
      return;
    }

    playPressFeedback(card.view, {
      width: card.layout?.width ?? CARD_LAYOUT.width,
      height: CARD.height,
      scale: 0.97,
      alpha: 0.84,
      duration: 95,
    });
    this.showConversionConfirm(rate);
  }

  showConversionConfirm(rate) {
    this.confirmDialog.show({
      title: '解析変換',
      message: '余剰DNAを研究Ptへ変換しますか？',
      detail: `DNA ${rate.dnaCost} を消費\n研究Pt ${rate.researchPtGain} を取得`,
      confirmLabel: 'はい',
      cancelLabel: 'いいえ',
      onConfirm: () => this.executeConversion(rate),
      onCancel: () => {
        this.noticeText.text = '解析変換をキャンセルしました';
      },
    });
  }

  executeConversion(rate) {
    const success = this.saveManager.convertDnaToResearchPt?.(rate.id);
    this.noticeText.text = success
      ? `DNA ${rate.dnaCost} を研究Pt ${rate.researchPtGain} へ変換しました`
      : 'DNAが不足しています';
    this.render();
  }

  isPurchasableResearch(item) {
    return item?.category === RESEARCH_CATEGORY_IDS.bodyEnhancement
      || item?.category === RESEARCH_CATEGORY_IDS.adaptationAbility
      || (item?.category === RESEARCH_CATEGORY_IDS.unknownDomain && item?.unlockDinoId);
  }

  handleNav(id) {
    if (id === 'home') {
      this.onHome?.();
      return;
    }

    if (id === 'research') {
      this.noticeText.text = 'DNA研究を表示中です';
      return;
    }

    if (id === 'codex') {
      this.onCodex?.();
      return;
    }

    if (id === 'options') {
      this.onOptions?.();
    }
  }

  handleGamepadAction(actions = {}, gamepadManager = null) {
    if (this.confirmDialog.view.visible) {
      return this.confirmDialog.handleGamepadAction?.(actions) ?? false;
    }

    if (this.handleGamepadScrollInput(gamepadManager)) {
      return true;
    }

    if (actions.cancelPressed) {
      this.onHome?.();
      return true;
    }

    if (actions.previousPressed || actions.nextPressed) {
      this.moveCategory(actions.nextPressed ? 1 : -1);
      return true;
    }

    if (actions.leftPressed || actions.rightPressed) {
      if (this.gamepadFocusArea === 'category') {
        this.moveCategory(actions.rightPressed ? 1 : -1);
        return true;
      }
      this.gamepadFocusArea = 'category';
      return true;
    }

    if (actions.upPressed || actions.downPressed) {
      if (this.gamepadFocusArea === 'category') {
        this.gamepadFocusArea = 'card';
        this.gamepadFocusIndex = 0;
        return true;
      }
      this.moveCardFocus(actions.downPressed ? 1 : -1);
      return true;
    }

    if (actions.confirmPressed) {
      if (this.gamepadFocusArea === 'category') {
        this.gamepadFocusArea = 'card';
        this.gamepadFocusIndex = 0;
        return true;
      }
      const card = this.getVisibleGamepadCards()[this.gamepadFocusIndex];
      if (card) {
        this.handleCardAction(card);
      }
      return true;
    }

    return false;
  }

  moveCategory(delta) {
    const currentIndex = RESEARCH_CATEGORIES.findIndex((category) => category.id === this.selectedCategory);
    const nextIndex = (currentIndex + delta + RESEARCH_CATEGORIES.length) % RESEARCH_CATEGORIES.length;
    this.selectedCategory = RESEARCH_CATEGORIES[nextIndex].id;
    this.bodyScrollOffset = 0;
    this.gamepadFocusArea = 'card';
    this.gamepadFocusIndex = 0;
    this.noticeText.text = '';
    this.render();
  }

  handleCompanionHatchAction(card) {
    const item = card.item;

    if (item.action === 'wait') {
      this.noticeText.text = '孵化完了まで少し待ちましょう';
      return;
    }

    if (!card.canBuy) {
      this.noticeText.text = 'DNAまたは研究Ptが不足しています';
      return;
    }

    if (item.action === 'claim') {
      this.confirmDialog.show({
        title: '孵化完了',
        message: '卵からお供恐竜を受け取りますか？',
        detail: '未所持のお供恐竜からランダムで加入します。',
        confirmLabel: '受け取る',
        cancelLabel: 'あとで',
        onConfirm: () => {
          const result = this.saveManager.completeCompanionEggIncubation({ force: true });
          const name = result.companion?.displayName ?? (result.duplicateReward ? 'DNA報酬' : 'お供恐竜');
          this.noticeText.text = result.success ? `${name}を獲得しました` : '受け取りできませんでした';
          this.saveManager.markTutorialComplete?.('companionObtained');
          this.render();
        },
      });
      return;
    }

    this.confirmDialog.show({
      title: '卵を孵化',
      message: 'DNAと研究Ptを使って卵を孵化しますか？',
      detail: `必要DNA ${COMPANION_HATCH_CONFIG.dnaCost}\n必要研究Pt ${COMPANION_HATCH_CONFIG.researchPtCost}`,
      confirmLabel: '孵化',
      cancelLabel: 'やめる',
      onConfirm: () => {
        const instant = this.getDebugFlag('debugCompanionInstantHatch') || this.getDebugFlag('debugCompanionHatchNow');
        const result = this.saveManager.startCompanionEggIncubation({ instant });
        if (instant && result.success) {
          const hatch = this.saveManager.completeCompanionEggIncubation({ force: true });
          this.noticeText.text = hatch.companion ? `${hatch.companion.displayName}を獲得しました` : '孵化が完了しました';
        } else {
          this.noticeText.text = result.success ? '孵化を開始しました' : '孵化できませんでした';
        }
        this.saveManager.markTutorialComplete?.('companionEggResearch');
        this.render();
      },
    });
  }

  getDebugFlag(name) {
    if (typeof window === 'undefined' || !import.meta.env.DEV) {
      return false;
    }

    return new URLSearchParams(window.location.search).get(name) === '1';
  }

  moveCardFocus(delta) {
    const cards = this.getVisibleGamepadCards();
    if (!cards.length) {
      this.gamepadFocusIndex = 0;
      return;
    }

    const nextIndex = Math.max(0, Math.min(cards.length - 1, this.gamepadFocusIndex + delta));
    if (nextIndex === this.gamepadFocusIndex && this.scrollBodyByRows(delta)) {
      const nextCards = this.getVisibleGamepadCards();
      this.gamepadFocusIndex = delta > 0 ? Math.max(0, nextCards.length - 1) : 0;
      return;
    }

    this.gamepadFocusIndex = nextIndex;
    const card = cards[nextIndex];
    if (card?.item?.category === RESEARCH_CATEGORY_IDS.bodyEnhancement) {
      this.ensureCardVisible(card);
    }
  }

  handleGamepadScrollInput(gamepadManager = null) {
    if (this.selectedCategory !== RESEARCH_CATEGORY_IDS.bodyEnhancement) {
      return false;
    }

    const rightY = Number(gamepadManager?.rightY ?? 0);
    if (Math.abs(rightY) <= 0.25) {
      return false;
    }

    const before = this.bodyScrollOffset;
    this.setBodyScrollOffset(this.bodyScrollOffset + rightY * (CARD.height + CARD.gap) * 0.35);
    return this.bodyScrollOffset !== before;
  }

  handleGamepadScroll(rightY = 0) {
    if (this.selectedCategory !== RESEARCH_CATEGORY_IDS.bodyEnhancement) {
      return false;
    }

    if (Math.abs(rightY) <= 0.25) {
      this.gamepadScrollAccumulator = 0;
      return false;
    }

    this.gamepadScrollAccumulator += rightY;
    if (Math.abs(this.gamepadScrollAccumulator) < 0.55) {
      return true;
    }

    const direction = this.gamepadScrollAccumulator > 0 ? 1 : -1;
    this.gamepadScrollAccumulator = 0;
    return this.scrollBodyByRows(direction);
  }

  scrollBodyByRows(deltaRows) {
    if (this.selectedCategory !== RESEARCH_CATEGORY_IDS.bodyEnhancement) {
      return false;
    }

    const before = this.bodyScrollOffset;
    this.setBodyScrollOffset(this.bodyScrollOffset + deltaRows * (CARD.height + CARD.gap));
    return this.bodyScrollOffset !== before;
  }

  ensureCardVisible(card) {
    const y = card.view.position.y;
    if (y < BODY_SCROLL_VIEW.top) {
      this.setBodyScrollOffset(this.bodyScrollOffset - (BODY_SCROLL_VIEW.top - y));
      return;
    }
    const bottom = y + CARD.height;
    if (bottom > BODY_SCROLL_VIEW.bottom) {
      this.setBodyScrollOffset(this.bodyScrollOffset + (bottom - BODY_SCROLL_VIEW.bottom));
    }
  }

  getVisibleGamepadCards() {
    return this.cards.filter((card) => card.view.visible && (card.item || card.isConversion));
  }

  getGamepadFocusBounds() {
    if (!this.view.visible || this.confirmDialog.view.visible) {
      return null;
    }

    if (this.gamepadFocusArea === 'category') {
      const categoryIndex = RESEARCH_CATEGORIES.findIndex((category) => category.id === this.selectedCategory);
      const button = this.categoryButtons[categoryIndex];
      if (!button) return null;
      return {
        x: button.view.position.x,
        y: button.view.position.y,
        width: CATEGORY_TAB.width,
        height: CATEGORY_TAB.height,
      };
    }

    const card = this.getVisibleGamepadCards()[this.gamepadFocusIndex];
    if (!card) {
      return null;
    }
    return {
      x: card.view.position.x,
      y: card.view.position.y,
      width: card.layout?.width ?? CARD_LAYOUT.width,
      height: CARD.height,
    };
  }

  drawStatic() {
    drawScreenBackground(this.background, this.width, this.height, UI_COLORS.green);
    this.overlay
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x020607, alpha: 0.18 })
      .rect(0, 0, this.width, 94)
      .fill({ color: 0x010404, alpha: 0.28 })
      .rect(0, 650, this.width, 118)
      .fill({ color: 0x020706, alpha: 0.34 });

    this.title.anchor.set(0.5);
    this.title.position.set(this.width / 2, 34);
    this.subtitle.anchor.set(0.5);
    this.subtitle.position.set(this.width / 2, 66);
    this.dnaIcon.position.set(50, 132);
    this.dnaIcon.width = 24;
    this.dnaIcon.height = 24;
    this.researchPtIcon.position.set(218, 132);
    this.researchPtIcon.width = 24;
    this.researchPtIcon.height = 24;
    this.dnaText.position.set(80, 134);
    this.researchPtText.position.set(248, 134);
    this.summaryTitle.position.set(SUMMARY_PANEL.x + 16, SUMMARY_PANEL.y + 10);
    this.summaryBody.position.set(SUMMARY_PANEL.x + 16, SUMMARY_PANEL.y + 34);
    this.noticeText.anchor.set(0.5);
    this.noticeText.position.set(this.width / 2, NOTICE_Y);
  }

  applyTextures() {
    this.applySprite(this.backgroundSprite, this.textures.get('researchBackground'), {
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    }, 0.82);
    this.applySprite(this.corePanel, this.textures.get('dnaCorePanel'), CORE_PANEL, 0.88);
    this.applySprite(this.dnaIcon, this.textures.get('icon:dnaResource'), { x: 50, y: 132, width: 24, height: 24 });
    this.applySprite(this.researchPtIcon, this.textures.get('icon:researchPt'), { x: 218, y: 132, width: 24, height: 24 });
  }

  render() {
    const data = this.saveManager.getData();
    const researchPt = data.researchPt ?? Math.floor((data.totalExpGained ?? 0) * 0.12);
    const selected = RESEARCH_CATEGORIES.find((category) => category.id === this.selectedCategory) ?? RESEARCH_CATEGORIES[0];

    this.dnaText.text = `DNA ${this.formatNumber(data.ownedDna ?? 0)}`;
    this.researchPtText.text = `研究Pt ${this.formatNumber(researchPt)}`;
    this.categoryTitle.text = selected.name;
    this.categoryNote.text = selected.material;
    this.summaryTitle.text = selected.name;
    this.summaryBody.text = this.truncate(selected.role, 34);
    this.scrollHintText.text = '';
    this.renderBodyScrollBar(selected.id === RESEARCH_CATEGORY_IDS.bodyEnhancement);

    this.drawSummary(selected);
    this.renderCategoryButtons();
    this.renderCards(selected, data);
  }

  renderCategoryButtons() {
    this.categoryButtons.forEach((button) => {
      const selected = button.category.id === this.selectedCategory;
      const color = CATEGORY_COLORS[button.category.id] ?? UI_COLORS.dna;
      const texture = selected ? this.textures.get('categoryTabSelected') : this.textures.get('categoryTab');
      const iconTexture = this.textures.get(`icon:${button.category.iconName}`) ?? null;

      button.sprite.texture = texture ?? Texture.EMPTY;
      button.sprite.visible = !!texture;
      button.sprite.width = CATEGORY_TAB.width;
      button.sprite.height = CATEGORY_TAB.height;
      button.iconSprite.texture = iconTexture ?? Texture.EMPTY;
      button.iconSprite.visible = !!iconTexture;
      button.iconFallback.visible = !iconTexture;
      button.iconFallback.clear();
      if (!iconTexture) {
        this.drawCategoryIcon(button.iconFallback, button.category.id, color, selected);
      }
      button.fallback.clear();
      if (!texture) {
        drawButtonFrame(button.fallback, CATEGORY_TAB.width, CATEGORY_TAB.height, {
          accent: color,
          selected,
          glow: selected,
          radius: 8,
        });
      }
      button.label.style.fill = selected ? '#ffffff' : '#cbe0da';
    });
  }

  renderCards(selected, data) {
    if (selected.id === RESEARCH_CATEGORY_IDS.analysisConversion) {
      this.renderConversionCards();
      return;
    }

    const allItems = getResearchItemsByCategory(selected.id);
    const isBodyCategory = selected.id === RESEARCH_CATEGORY_IDS.bodyEnhancement;
    const hatchEntry = isBodyCategory ? this.getCompanionHatchEntry(data) : null;
    const bodyItems = hatchEntry ? [hatchEntry, ...allItems] : allItems;
    const items = isBodyCategory ? bodyItems : allItems.slice(0, 3);
    const maxScroll = this.getBodyMaxScroll(bodyItems.length);

    this.bodyScrollOffset = isBodyCategory ? Math.min(this.bodyScrollOffset, maxScroll) : 0;
    this.renderBodyScrollBar(isBodyCategory);
    this.cards.forEach((card, index) => {
      const item = items[index];

      card.view.visible = !!item;
      if (!item) {
        return;
      }

      const y = isBodyCategory
        ? CARD.y + index * (CARD.height + CARD.gap) - this.bodyScrollOffset
        : CARD.y + index * (CARD.height + CARD.gap);
      const withinViewport = !isBodyCategory || (y >= BODY_SCROLL_VIEW.top && y + CARD.height <= BODY_SCROLL_VIEW.bottom);

      card.view.position.set(CARD_LAYOUT.x, y);
      card.view.visible = withinViewport;
      if (!withinViewport) {
        return;
      }

      if (item.isCompanionHatch) {
        this.renderCompanionHatchCard(card, item, data);
        return;
      }

      const level = data.researchLevels?.[item.id] ?? 0;
      const cost = getResearchCostDetail(item, level);
      const isMax = item.maxLevel ? level >= item.maxLevel : false;
      const isLocked = item.status === 'locked';
      const canBuy = !isLocked
        && !isMax
        && this.isPurchasableResearch(item)
        && cost !== null
        && (data.ownedDna ?? 0) >= cost.dna
        && (data.researchPt ?? 0) >= cost.researchPt;
      const frameKey = isMax ? 'cardCompleted' : isLocked ? 'cardLocked' : 'cardFrame';
      const color = isMax ? UI_COLORS.green : isLocked ? UI_COLORS.danger : CATEGORY_COLORS[item.category] ?? UI_COLORS.dna;
      const layout = this.getCardLayout();
      const isAdaptationUnlock = item.category === RESEARCH_CATEGORY_IDS.adaptationAbility && !!item.adaptationSkillId;

      card.item = item;
      card.isConversion = false;
      card.isCompanionHatch = false;
      card.conversionRate = null;
      card.isMax = isMax;
      card.isLocked = isLocked;
      card.canBuy = canBuy;
      this.applyCardLayout(card, layout);
      this.drawCardFrame(card, frameKey, color, isMax || isLocked, layout);
      this.applyCardIcon(card, item.iconName, item.category, color, isLocked, layout);
      this.drawProgress(card.progress, level, item.maxLevel ?? 0, color, layout);

      if (isAdaptationUnlock) {
        this.renderAdaptationUnlockCard(card, item, cost, { isMax, isLocked, canBuy, data, layout, color });
        return;
      }

      this.hideAdaptationUnlockSupplements(card);
      card.name.text = this.truncate(item.name, layout.nameLimit);
      card.desc.text = this.truncate(item.description, layout.descLimit);
      card.effect.text = this.truncate(getResearchNextEffectLabel(item, level), layout.effectLimit);
      const isDinoUnlock = !!item.unlockDinoId;
      card.step.text = isLocked
        ? this.truncate(item.unlockHint ?? '解析待ち', layout.stepLimit)
        : isDinoUnlock
          ? this.truncate(this.formatCost(cost), layout.stepLimit)
          : this.truncate(`強化段階 ${level} / ${item.maxLevel}`, layout.stepLimit);
      const isBodyEnhancement = item.category === RESEARCH_CATEGORY_IDS.bodyEnhancement;
      const dnaIcon = this.textures.get('icon:dnaResource');
      const ptIcon = this.textures.get('icon:researchPt');
      const bodyCostY = 39;
      const bodyCostX = layout.badgeX - 6;
      card.costDnaIcon.texture = dnaIcon ?? Texture.EMPTY;
      card.costPtIcon.texture = ptIcon ?? Texture.EMPTY;
      card.costDnaIcon.visible = isBodyEnhancement && !!dnaIcon && !!cost && !isMax;
      card.costPtIcon.visible = isBodyEnhancement && !!ptIcon && !!cost && !isMax && cost.researchPt > 0;
      card.costDnaText.visible = isBodyEnhancement && !!cost && !isMax;
      card.costPtText.visible = isBodyEnhancement && !!cost && !isMax && cost.researchPt > 0;
      card.costDnaText.text = cost ? `${cost.dna}` : '';
      card.costPtText.text = cost?.researchPt ? `${cost.researchPt}` : '';
      card.costDnaIcon.position.set(bodyCostX, bodyCostY);
      card.costDnaIcon.width = 14;
      card.costDnaIcon.height = 14;
      card.costDnaText.position.set(bodyCostX + 17, bodyCostY - 1);
      card.costPtIcon.position.set(bodyCostX + 45, bodyCostY);
      card.costPtIcon.width = 14;
      card.costPtIcon.height = 14;
      card.costPtText.position.set(bodyCostX + 62, bodyCostY - 1);
      card.costDnaText.style.fontSize = 9;
      card.costPtText.style.fontSize = 9;
      card.status.text = isMax
        ? (isDinoUnlock ? '研究済み' : '完了')
        : isLocked
          ? 'LOCK'
          : canBuy
            ? (isBodyEnhancement ? '' : isDinoUnlock ? '研究する' : this.formatCostShort(cost))
            : this.getInsufficientLabel(cost, data);
      card.status.style.fill = isLocked || (!canBuy && !isMax) ? '#ffaaa2' : isMax ? '#b6ffd0' : '#e7fff6';
      if (isBodyEnhancement) {
        card.status.position.set(layout.badgeX + layout.badgeWidth / 2, 63);
        card.status.style.fontSize = 10;
        card.status.style.wordWrapWidth = layout.badgeWidth - 6;
      }
      card.costBadge.visible = !!this.textures.get('costBadge');
      card.button.visible = true;
      card.buttonBg.visible = !card.costBadge.visible;
      this.drawBadgeFallback(card.buttonBg, isLocked ? UI_COLORS.danger : color, isMax, layout);
    });
  }

  getCompanionHatchEntry(data) {
    const companion = data.companion;

    if (!companion?.eggPending && !companion?.eggIncubating) {
      return null;
    }

    const completeAt = Date.parse(companion.hatchCompleteAt ?? '');
    const isReady = companion.eggIncubating && (!Number.isFinite(completeAt) || Date.now() >= completeAt);

    return {
      id: 'companion_hatch',
      isCompanionHatch: true,
      name: isReady ? '卵の孵化完了' : companion.eggIncubating ? '卵を孵化中' : '卵を孵化',
      description: isReady
        ? '新しいお供恐竜を受け取れます。'
        : companion.eggIncubating
          ? '時間経過で孵化します。'
          : 'DNAと研究Ptでお供恐竜の卵を孵化します。',
      action: isReady ? 'claim' : companion.eggIncubating ? 'wait' : 'start',
      category: RESEARCH_CATEGORY_IDS.bodyEnhancement,
    };
  }

  renderCompanionHatchCard(card, item, data) {
    const layout = this.getCardLayout();
    const color = UI_COLORS.gold;
    const completeAt = Date.parse(data.companion?.hatchCompleteAt ?? '');
    const isReady = item.action === 'claim';
    const canStart = item.action === 'start'
      && (data.ownedDna ?? 0) >= COMPANION_HATCH_CONFIG.dnaCost
      && (data.researchPt ?? 0) >= COMPANION_HATCH_CONFIG.researchPtCost;
    const canBuy = isReady || canStart;

    card.item = item;
    card.isConversion = false;
    card.isCompanionHatch = true;
    card.isMax = false;
    card.isLocked = false;
    card.canBuy = canBuy;
    this.applyCardLayout(card, layout);
    this.drawCardFrame(card, isReady ? 'cardCompleted' : 'cardFrame', color, isReady, layout);
    this.applyCardIcon(card, 'bodyEnhancement', RESEARCH_CATEGORY_IDS.bodyEnhancement, color, false, layout);
    this.drawProgress(card.progress, isReady ? 1 : 0, 1, color, layout);
    this.hideAdaptationUnlockSupplements(card);
    card.name.text = item.name;
    card.desc.text = item.description;
    card.effect.text = isReady
      ? '未所持からランダム取得'
      : item.action === 'wait'
        ? `完了 ${Number.isFinite(completeAt) ? this.formatHatchRemain(completeAt) : 'まもなく'}`
        : 'お供恐竜を入手';
    card.step.text = item.action === 'start'
      ? `必要DNA ${COMPANION_HATCH_CONFIG.dnaCost} / Pt ${COMPANION_HATCH_CONFIG.researchPtCost}`
      : 'お供恐竜';
    card.status.text = isReady
      ? '受取'
      : item.action === 'wait'
        ? '孵化中'
        : canStart ? '孵化' : this.getInsufficientLabel({
          dna: COMPANION_HATCH_CONFIG.dnaCost,
          researchPt: COMPANION_HATCH_CONFIG.researchPtCost,
        }, data);
    card.status.style.fill = canBuy ? '#e7fff6' : '#ffaaa2';
    card.costBadge.visible = !!this.textures.get('costBadge');
    card.button.visible = true;
    card.buttonBg.visible = !card.costBadge.visible;
    this.drawBadgeFallback(card.buttonBg, color, isReady, layout);
    card.costDnaText.visible = false;
    card.costPtText.visible = false;
    card.costDnaIcon.visible = false;
    card.costPtIcon.visible = false;
  }

  formatHatchRemain(completeAt) {
    const remain = Math.max(0, Math.ceil((completeAt - Date.now()) / 1000));

    if (remain <= 0) {
      return '受取可能';
    }

    const hours = Math.floor(remain / 3600);
    const minutes = Math.floor((remain % 3600) / 60);
    if (hours > 0) {
      return `あと${hours}時間${minutes}分`;
    }

    return `あと${Math.max(1, minutes)}分`;
  }

  renderPageControls(maxPage) {
    const visible = maxPage > 0;
    [this.pagePrev, this.pageNext].forEach((button) => {
      if (!button) {
        return;
      }

      button.view.visible = visible;
      button.bg.clear();
      if (visible) {
        button.bg
          .roundRect(0, 0, 34, 22, 6)
          .fill({ color: 0x071514, alpha: 0.82 })
          .stroke({ color: UI_COLORS.dna, width: 1, alpha: 0.55 });
      }
    });
    if (this.pageText) {
      this.pageText.visible = visible;
      this.pageText.text = visible ? `${this.cardPage + 1}/${maxPage + 1}` : '';
    }
  }

  renderConversionCards() {
    const data = this.saveManager.getData();

    this.cards.forEach((card, index) => {
      const rate = ANALYSIS_CONVERSION_RATES[index];

      card.view.visible = !!rate;
      if (!rate) {
        return;
      }

      const layout = CARD_LAYOUT;
      const canBuy = (data.ownedDna ?? 0) >= rate.dnaCost;

      card.item = null;
      card.conversionRate = rate;
      card.isConversion = true;
      card.isCompanionHatch = false;
      card.isMax = false;
      card.isLocked = false;
      card.canBuy = canBuy;
      card.view.position.set(CARD_LAYOUT.x, CARD.y + index * (CARD.height + CARD.gap));
      this.applyCardLayout(card, layout);
      this.drawCardFrame(card, 'analysisConvertPanel', UI_COLORS.gold, false, layout);
      this.applyCardIcon(card, 'analysisConversion', RESEARCH_CATEGORY_IDS.analysisConversion, UI_COLORS.gold, false, layout);
      card.progress.clear();
      card.name.text = `DNA ${rate.dnaCost} → 研究Pt ${rate.researchPtGain}`;
      card.desc.text = '余剰DNAを研究Ptへ変換する';
      card.effect.text = '高レート変換';
      card.step.text = '補助解析';
      card.status.text = canBuy ? '変換' : 'DNA不足';
      card.status.style.fill = canBuy ? '#e7fff6' : '#ffaaa2';
      this.hideAdaptationUnlockSupplements(card);
      card.costBadge.visible = !!this.textures.get('costBadge');
      card.button.visible = true;
      card.buttonBg.visible = !card.costBadge.visible;
      this.drawBadgeFallback(card.buttonBg, UI_COLORS.gold, false, layout);
    });
  }

  getBodyMaxScroll(itemCount) {
    const contentHeight = itemCount * (CARD.height + CARD.gap) - CARD.gap;
    const viewportHeight = BODY_SCROLL_VIEW.bottom - BODY_SCROLL_VIEW.top;

    return Math.max(0, contentHeight - viewportHeight);
  }

  getBodyResearchRenderCount() {
    const data = this.saveManager?.getData?.() ?? {};
    const base = getResearchItemsByCategory(RESEARCH_CATEGORY_IDS.bodyEnhancement).length;
    return base + (this.getCompanionHatchEntry(data) ? 1 : 0);
  }

  isBodyScrollTarget(event) {
    if (this.selectedCategory !== RESEARCH_CATEGORY_IDS.bodyEnhancement) {
      return false;
    }

    const y = event.global?.y ?? -1;

    return y >= BODY_SCROLL_VIEW.top && y <= BODY_SCROLL_VIEW.bottom;
  }

  setBodyScrollOffset(value) {
    const maxScroll = this.getBodyMaxScroll(this.getBodyResearchRenderCount());
    const rowHeight = CARD.height + CARD.gap;
    const clamped = Math.max(0, Math.min(maxScroll, value));
    const next = Math.max(0, Math.min(maxScroll, Math.round(clamped / rowHeight) * rowHeight));

    if (next === this.bodyScrollOffset) {
      return;
    }

    this.bodyScrollOffset = next;
    this.render();
  }

  renderBodyScrollBar(isBodyCategory) {
    this.bodyScrollTrack.clear();
    this.bodyScrollThumb.clear();

    if (!isBodyCategory) {
      return;
    }

    const itemCount = this.getBodyResearchRenderCount();
    const maxScroll = this.getBodyMaxScroll(itemCount);

    if (maxScroll <= 0) {
      return;
    }

    const x = this.width - 16;
    const y = BODY_SCROLL_VIEW.top + 2;
    const height = BODY_SCROLL_VIEW.bottom - BODY_SCROLL_VIEW.top - 4;
    const thumbHeight = Math.max(42, Math.round(height * ((BODY_SCROLL_VIEW.bottom - BODY_SCROLL_VIEW.top) / (itemCount * (CARD.height + CARD.gap)))));
    const thumbTravel = Math.max(1, height - thumbHeight);
    const thumbY = y + Math.round((this.bodyScrollOffset / maxScroll) * thumbTravel);

    this.bodyScrollTrack
      .roundRect(x, y, 5, height, 3)
      .fill({ color: 0x031011, alpha: 0.72 })
      .stroke({ color: UI_COLORS.dna, width: 1, alpha: 0.22 });
    this.bodyScrollThumb
      .roundRect(x - 1, thumbY, 7, thumbHeight, 4)
      .fill({ color: UI_COLORS.dna, alpha: 0.5 })
      .stroke({ color: 0xbfffee, width: 1, alpha: 0.42 });
  }

  handleBodyScrollWheel(event) {
    if (!this.isBodyScrollTarget(event)) {
      return;
    }

    const deltaY = event.deltaY ?? event.nativeEvent?.deltaY ?? 0;
    this.setBodyScrollOffset(this.bodyScrollOffset + deltaY * 0.45);
  }

  startBodyScroll(event) {
    if (!this.isBodyScrollTarget(event)) {
      this.bodyScrollDrag = null;
      return;
    }

    this.bodyScrollDrag = {
      y: event.global?.y ?? 0,
      offset: this.bodyScrollOffset,
    };
  }

  updateBodyScrollDrag(event) {
    if (!this.bodyScrollDrag) {
      return;
    }

    const y = event.global?.y ?? this.bodyScrollDrag.y;
    this.setBodyScrollOffset(this.bodyScrollDrag.offset + (this.bodyScrollDrag.y - y));
  }

  endBodyScrollDrag() {
    this.bodyScrollDrag = null;
  }

  drawSummary(selected) {
    this.summaryBg.clear();
    drawPanel(this.summaryBg, SUMMARY_PANEL.x, SUMMARY_PANEL.y, SUMMARY_PANEL.width, SUMMARY_PANEL.height, {
      accent: CATEGORY_COLORS[selected.id] ?? UI_COLORS.dna,
      alpha: 0.66,
      strokeAlpha: 0.42,
      radius: 8,
    });
  }

  getCardLayout() {
    return CARD_LAYOUT;
  }

  applyCardLayout(card, layout) {
    card.layout = layout;
    card.view.x = layout.x;
    card.iconSprite.position.set(layout.iconX, layout.iconY);
    card.iconSprite.width = layout.iconSize;
    card.iconSprite.height = layout.iconSize;
    card.name.position.set(layout.textX, 12);
    card.desc.position.set(layout.textX, 31);
    card.effect.position.set(layout.textX, 46);
    card.step.position.set(layout.textX, 59);
    [card.name, card.desc, card.effect, card.step].forEach((text) => {
      text.style.wordWrapWidth = layout.textWidth;
    });
    card.status.anchor.set(0.5);
    card.status.position.set(layout.badgeX + layout.badgeWidth / 2, 60);
    card.status.style.wordWrapWidth = layout.badgeWidth - 8;
    card.costBadge.position.set(layout.badgeX, layout.badgeY);
    card.costBadge.width = layout.badgeWidth;
    card.costBadge.height = layout.badgeHeight;
    card.button.position.set(layout.badgeX, layout.badgeY);
    card.button.hitArea = new Rectangle(0, 0, layout.badgeWidth, layout.badgeHeight);
    card.view.hitArea = new Rectangle(0, 0, layout.width, CARD.height);
    card.tagText.position.set(layout.textX, 58);
    card.costDnaIcon.position.set(layout.badgeX - 6, 36);
    card.costDnaIcon.width = 14;
    card.costDnaIcon.height = 14;
    card.costDnaText.position.set(layout.badgeX + 12, 36);
    card.costPtIcon.position.set(layout.badgeX + 48, 36);
    card.costPtIcon.width = 14;
    card.costPtIcon.height = 14;
    card.costPtText.position.set(layout.badgeX + 66, 36);
  }

  renderAdaptationUnlockCard(card, item, cost, { isMax, isLocked, canBuy, data, layout, color }) {
    const safe = {
      textX: layout.textX,
      textWidth: 162,
      tagX: layout.badgeX - 12,
      tagY: 12,
      tagWidth: 96,
      tagHeight: 16,
      costX: layout.badgeX - 12,
      costY: 40,
      statusY: 64,
    };

    card.name.text = this.truncate(item.name, 13);
    card.desc.text = this.getAdaptationUnlockShortDescription(item);
    card.effect.text = '';
    card.step.text = '';
    card.progress.clear();
    card.costBadge.visible = false;
    card.button.visible = true;
    card.buttonBg.visible = false;
    card.name.position.set(safe.textX, 12);
    card.desc.position.set(safe.textX, 34);
    card.desc.style.wordWrapWidth = safe.textWidth;
    card.desc.style.fontSize = 8.5;

    card.tagChip.visible = true;
    card.tagChip.clear()
      .roundRect(safe.tagX - 2, safe.tagY, safe.tagWidth, safe.tagHeight, 6)
      .fill({ color: 0x061719, alpha: 0.72 })
      .stroke({ color, width: 1, alpha: 0.72 });
    card.tagText.visible = true;
    card.tagText.text = this.truncate(item.adaptationTagLabel ?? item.effectLabel ?? '適応', 10);
    card.tagText.position.set(safe.tagX + 4, safe.tagY + 2);
    card.tagText.style.fontSize = 8;
    card.tagText.style.wordWrapWidth = safe.tagWidth - 8;

    const dnaIcon = this.textures.get('icon:dnaResource');
    const ptIcon = this.textures.get('icon:researchPt');
    card.costDnaIcon.texture = dnaIcon ?? Texture.EMPTY;
    card.costDnaIcon.visible = !!dnaIcon && !!cost && !isMax;
    card.costPtIcon.texture = ptIcon ?? Texture.EMPTY;
    card.costPtIcon.visible = !!ptIcon && !!cost && !isMax;
    card.costDnaText.visible = !!cost && !isMax;
    card.costPtText.visible = !!cost && !isMax && cost.researchPt > 0;
    card.costDnaText.text = cost ? `${cost.dna}` : '';
    card.costPtText.text = cost?.researchPt ? `${cost.researchPt}` : '';
    card.costDnaIcon.position.set(safe.costX, safe.costY);
    card.costDnaText.position.set(safe.costX + 17, safe.costY - 1);
    card.costPtIcon.position.set(safe.costX + 48, safe.costY);
    card.costPtText.position.set(safe.costX + 65, safe.costY - 1);
    card.costDnaText.style.fontSize = 8;
    card.costPtText.style.fontSize = 8;

    card.status.text = isMax ? '解放済み' : isLocked ? 'ロック' : canBuy ? '研究可' : this.getInsufficientLabel(cost, data);
    card.status.style.fill = isLocked || (!canBuy && !isMax) ? '#ffaaa2' : isMax ? '#b6ffd0' : '#e7fff6';
    card.status.position.set(layout.badgeX + layout.badgeWidth / 2 - 2, safe.statusY);
    card.status.style.fontSize = 9;
    card.status.style.wordWrapWidth = layout.badgeWidth - 4;
  }

  getAdaptationUnlockShortDescription(item) {
    const descriptions = {
      accelerated_blades: '周囲に高速刃を展開する',
      predator_marking: '近い敵へ捕食マークを放つ',
      flame_breath: '前方へ火炎を吐く',
    };

    return descriptions[item.adaptationSkillId] ?? this.truncate(item.description, 20);
  }

  hideAdaptationUnlockSupplements(card) {
    card.tagChip.visible = false;
    card.tagChip.clear();
    card.tagText.visible = false;
    card.costDnaIcon.visible = false;
    card.costPtIcon.visible = false;
    card.costDnaText.visible = false;
    card.costPtText.visible = false;
    card.desc.style.fontSize = 9;
    card.tagText.style.fontSize = 9;
    card.costDnaText.style.fontSize = 9;
    card.costPtText.style.fontSize = 9;
    card.status.style.fontSize = 10;
  }

  drawCardFrame(card, frameKey, color, selected, layout) {
    const texture = this.textures.get(frameKey) ?? null;

    card.frame.texture = texture ?? Texture.EMPTY;
    card.frame.visible = !!texture;
    card.frame.width = layout.width;
    card.frame.height = CARD.height;
    card.fallback.clear();

    if (!texture) {
      drawButtonFrame(card.fallback, layout.width, CARD.height, {
        accent: color,
        selected,
        glow: selected,
        radius: 8,
      });
    }
  }

  applyCardIcon(card, iconName, categoryId, color, locked = false, layout = CARD_LAYOUT) {
    const texture = this.textures.get(`icon:${iconName}`) ?? null;

    card.iconSprite.texture = texture ?? Texture.EMPTY;
    card.iconSprite.visible = !!texture;
    card.iconFallback.visible = !texture;
    card.iconFallback.clear();

    if (!texture) {
      this.drawCardIcon(card.iconFallback, categoryId, color, locked, layout);
    }
  }

  drawCategoryIcon(graphics, categoryId, color, selected) {
    graphics
      .clear()
      .circle(CATEGORY_TAB.width / 2, 19, 13)
      .fill({ color, alpha: selected ? 0.24 : 0.12 })
      .stroke({ color, width: 2, alpha: selected ? 0.82 : 0.42 });

    if (categoryId === RESEARCH_CATEGORY_IDS.bodyEnhancement) {
      graphics.moveTo(28, 19).lineTo(40, 19).moveTo(34, 13).lineTo(34, 25);
    } else if (categoryId === RESEARCH_CATEGORY_IDS.adaptationAbility) {
      graphics.moveTo(27, 25).lineTo(40, 13).moveTo(31, 26).lineTo(43, 16);
    } else if (categoryId === RESEARCH_CATEGORY_IDS.specialMutation) {
      graphics.circle(29, 18, 3).circle(39, 17, 3).circle(34, 26, 3);
    } else if (categoryId === RESEARCH_CATEGORY_IDS.unknownDomain) {
      graphics.moveTo(34, 12).lineTo(42, 20).lineTo(34, 28).lineTo(26, 20).lineTo(34, 12);
    } else {
      graphics.moveTo(27, 19).lineTo(41, 19).moveTo(37, 15).lineTo(41, 19).lineTo(37, 23);
    }

    graphics.stroke({ color, width: 2, alpha: selected ? 0.9 : 0.55 });
  }

  drawCardIcon(graphics, categoryId, color, locked = false, layout = CARD_LAYOUT) {
    const centerX = layout.iconX + layout.iconSize / 2;
    const centerY = layout.iconY + layout.iconSize / 2;

    graphics
      .clear()
      .circle(centerX, centerY, 22)
      .fill({ color, alpha: locked ? 0.1 : 0.18 })
      .stroke({ color, width: 2, alpha: locked ? 0.38 : 0.72 })
      .circle(centerX, centerY, 8)
      .fill({ color, alpha: locked ? 0.24 : 0.48 });

    if (locked) {
      graphics
        .rect(centerX - 6, centerY, 12, 10)
        .fill({ color, alpha: 0.35 })
        .circle(centerX, centerY - 1, 7)
        .stroke({ color, width: 2, alpha: 0.55 });
    } else if (categoryId === RESEARCH_CATEGORY_IDS.bodyEnhancement) {
      graphics
        .moveTo(centerX - 9, centerY)
        .lineTo(centerX + 9, centerY)
        .moveTo(centerX, centerY - 9)
        .lineTo(centerX, centerY + 9)
        .stroke({ color: 0xffffff, width: 2, alpha: 0.58 });
    }
  }

  drawProgress(graphics, level, maxLevel, color, layout) {
    graphics.clear();

    if (!maxLevel) {
      return;
    }

    for (let i = 0; i < maxLevel; i += 1) {
      graphics
        .roundRect(layout.progressX + i * 15, 74, 10, 4, 3)
        .fill({ color: i < level ? color : 0x172226, alpha: i < level ? 0.9 : 0.78 });
    }
  }

  drawBadgeFallback(graphics, color, selected, layout) {
    graphics.clear();
    drawButtonFrame(graphics, layout.badgeWidth, layout.badgeHeight, {
      accent: color,
      selected,
      glow: selected,
      radius: 7,
    });
  }

  applySprite(sprite, texture, rect, alpha = 1) {
    sprite.texture = texture ?? Texture.EMPTY;
    sprite.visible = !!texture;
    sprite.position.set(rect.x, rect.y);
    sprite.width = rect.width;
    sprite.height = rect.height;
    sprite.alpha = alpha;
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
        align: 'left',
        wordWrap: true,
        wordWrapWidth,
      },
    });
  }

  truncate(value, maxLength) {
    const text = String(value ?? '');

    if (text.length <= maxLength) {
      return text;
    }

    return `${text.slice(0, Math.max(0, maxLength - 1))}…`;
  }

  formatNumber(value) {
    return Math.floor(value).toLocaleString('ja-JP');
  }

  formatCost(cost) {
    if (!cost) {
      return '';
    }

    if (cost.dna > 0 && cost.researchPt > 0) {
      return `DNA ${cost.dna} / 研究Pt ${cost.researchPt}`;
    }

    if (cost.researchPt > 0) {
      return `研究Pt ${cost.researchPt}`;
    }

    return `DNA ${cost.dna}`;
  }

  formatCostShort(cost) {
    if (!cost) {
      return '';
    }

    if (cost.dna > 0 && cost.researchPt > 0) {
      return `D${cost.dna}/P${cost.researchPt}`;
    }

    if (cost.researchPt > 0) {
      return `研究Pt ${cost.researchPt}`;
    }

    return `DNA ${cost.dna}`;
  }

  getInsufficientLabel(cost, data) {
    if (!cost) {
      return '上限';
    }

    const dnaShort = (data.ownedDna ?? 0) < cost.dna;
    const ptShort = (data.researchPt ?? 0) < cost.researchPt;

    if (dnaShort && ptShort) {
      return '素材不足';
    }

    return ptShort ? 'Pt不足' : 'DNA不足';
  }
}
