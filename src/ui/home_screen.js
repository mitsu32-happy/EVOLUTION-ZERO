import { Assets, Container, Graphics, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import { ASSET_KEYS } from '../data/asset_manifest.js';
import {
  getDiscoveredEvolutionCount as getSavedEvolutionCount,
  getDiscoveredEvolutionEntries,
  getAllEvolutionBranches,
  getEvolutionBranchById,
} from '../data/evolution_data.js';
import { getDinoConfig } from '../data/run_config.js';
import { getTitleById, getTitleFrameById } from '../data/reward_titles.js';
import { DAILY_MISSION_COUNT, formatDailyReward, getDailyMissionTemplate } from '../data/daily_missions.js';
import { UPDATE_NEWS } from '../data/update_news.js';
import {
  COMPANION_DINOS,
  COMPANION_TYPES,
  getCompanionById,
  getCompanionEffectSummary,
  getCompanionUpgradeLevelsFromState,
} from '../data/companion_dinos.js';
import {
  getCompanionSynergyForCompanion,
  isCompanionSynergyActive,
} from '../data/companion_synergy.js';
import { createBottomNav } from './bottom_nav.js';
import { TitleSelectUi } from './title_select_ui.js';
import { playPressFeedback } from './ui_feedback.js';
import { drawScreenBackground, UI_COLORS, toCssColor } from './ui_theme.js';

const HOME_ASSET_PATHS = {
  homeBackground: 'assets/ui/home/home_background.png',
  evolutionZeroLogo: 'assets/ui/home/evolution_zero_logo.png',
  resourcePanel: 'assets/ui/home/resource_panel.png',
  homeInfoPanelCommon: 'assets/ui/home/home_info_panel_common.png',
  homeInfoPanelGlow: 'assets/ui/home/home_info_panel_common_active_glow.png',
  homeInfoTabSelected: 'assets/ui/home/home_info_tab_selected.png',
  homeInfoTabInactive: 'assets/ui/home/home_info_tab_inactive.png',
  iconDnaRed: 'assets/ui/home/icon_dna_red.png',
  iconResearchBeakerBlue: 'assets/ui/home/icon_research_beaker_blue.png',
  homeDinoSwitchLeft: 'assets/ui/home/home_dino_switch_left.png',
  homeDinoSwitchRight: 'assets/ui/home/home_dino_switch_right.png',
  homeDinoSelector: 'assets/ui/home/home_dino_selector.png',
  sortieButtonFrame: 'assets/ui/home/sortie_button_frame_a10.png',
  sortieButtonLeftIcon: 'assets/ui/home/sortie_button_left_icon_a10.png',
  sortieButtonGlow: 'assets/ui/home/sortie_button_glow_a10.png',
  newsEntryButton: 'assets/ui/home/news_button_a07d.png',
  newsPanel: 'assets/ui/home/news_panel_outer_a07d.png',
  newsListCard: 'assets/ui/home/news_list_item_a07d.png',
  newsListCardUnread: 'assets/ui/home/news_list_item_a07d.png',
  newsDetailPanel: 'assets/ui/home/news_panel_outer_a07d.png',
  newsButtonClose: 'assets/ui/home/news_button_close_a07d.png',
  newsButtonBack: 'assets/ui/home/news_button_back_a07d.png',
  newsBadgeUpdate: 'assets/ui/home/news_badge_update_a07d.png',
  newsBadgeNormal: 'assets/ui/home/news_badge_update_a07d.png',
  companionHomeFrame: 'assets/ui/companions/home_companion_frame_p06d.png',
  companionSelectPanel: 'assets/ui/companions/companion_select_panel_p06e.png',
  companionSelectCard: 'assets/ui/companions/companion_select_card_p06e.png',
  companionSelectButton: 'assets/ui/companions/companion_select_button_p06d.png',
  titleFrames: {
    normal_clear_frame: 'assets/ui/titles/title_frame_normal.png',
    hard_clear_frame: 'assets/ui/titles/title_frame_hard.png',
    expert_clear_frame: 'assets/ui/titles/title_frame_expert.png',
    zero_deluxe_frame: 'assets/ui/titles/title_frame_zero_deluxe.png',
    jungle_zero_frame: 'assets/ui/titles/title_frame_zero_jungle.png',
    volcano_zero_frame: 'assets/ui/titles/title_frame_zero_volcano.png',
    swamp_zero_frame: 'assets/ui/titles/title_frame_zero_swamp.png',
  },
  dinoHero: {
    velociraptor: 'assets/dinos/dino_select/velociraptor_hero.png',
    triceratops: 'assets/dinos/dino_select/triceratops_hero.png',
    tyrannosaurus: 'assets/dinos/dino_select/tyrannosaurus_hero.png',
    spinosaurus: 'assets/dinos/dino_select/spinosaurus_hero.png',
    ankylosaurus: 'assets/dinos/dino_select/ankylosaurus_hero.png',
    parasaurolophus: 'assets/dinos/dino_select/parasaurolophus_hero.png',
    stegosaurus: 'assets/dinos/dino_select/stegosaurus_hero.png',
    pteranodon: 'assets/dinos/dino_select/pteranodon_hero.png',
    compsognathus: 'assets/dinos/dino_select/compsognathus_hero.png',
    ornithomimus: 'assets/dinos/dino_select/ornithomimus_hero.png',
  },
  evolutionHero: {
    speed: 'assets/dinos/evolutions/heroes/velociraptor_speed_hero.png',
    hunting: 'assets/dinos/evolutions/heroes/velociraptor_hunting_hero.png',
    attack: 'assets/dinos/evolutions/heroes/velociraptor_attack_hero.png',
  },
};

const HOME_DINO_IDS = [
  'velociraptor',
  'triceratops',
  'tyrannosaurus',
  'spinosaurus',
  'ankylosaurus',
  'parasaurolophus',
  'stegosaurus',
  'pteranodon',
  'compsognathus',
  'ornithomimus',
];
const DEFAULT_HOME_DINO_IDS = ['velociraptor', 'triceratops', 'tyrannosaurus'];
const HOME_BRANCH_ORDER = ['speed', 'hunting', 'attack', 'zero'];

const HOME_DINO_PROFILES = {
  velociraptor: {
    label: 'ヴェロキラプトル',
    line: 'スピード型',
    width: 292,
    height: 206,
    y: 280,
  },
  triceratops: {
    label: 'トリケラトプス',
    line: '防御型',
    width: 278,
    height: 198,
    y: 282,
  },
  tyrannosaurus: {
    label: 'ティラノサウルス',
    line: '火力型',
    width: 300,
    height: 212,
    y: 278,
  },
  spinosaurus: {
    label: 'スピノサウルス',
    line: '中距離型',
    width: 300,
    height: 214,
    y: 280,
  },
  ankylosaurus: {
    label: 'アンキロサウルス',
    line: '防衛型',
    width: 296,
    height: 210,
    y: 282,
  },
  parasaurolophus: {
    label: 'パラサウロロフス',
    line: '音波支援型',
    width: 288,
    height: 208,
    y: 280,
  },
  stegosaurus: {
    label: 'ステゴサウルス',
    line: '範囲制圧型',
    width: 298,
    height: 212,
    y: 280,
  },
  pteranodon: {
    label: 'プテラノドン',
    line: '空中支援型',
    width: 314,
    height: 218,
    y: 276,
  },
  compsognathus: {
    label: 'コンプソグナトゥス',
    line: '群れ連撃型',
    width: 294,
    height: 208,
    y: 282,
  },
  ornithomimus: {
    label: 'オルニトミムス',
    line: '高速成長型',
    width: 292,
    height: 212,
    y: 280,
  },
};

const DEFAULT_UNLOCKED_HOME_DINOS = DEFAULT_HOME_DINO_IDS;

const RESOURCE_ITEMS = [
  { id: 'dna', label: 'DNA', color: UI_COLORS.danger, iconName: 'iconDnaRed', iconX: 181, textX: 220 },
  { id: 'researchPt', label: '研究Pt', color: UI_COLORS.dna, iconName: 'iconResearchBeakerBlue', iconX: 282, textX: 326 },
];

const UNLOCK_STATUS_ITEMS = [
  { id: 'dinos', label: '恐竜', color: UI_COLORS.dna },
  { id: 'evolutions', label: '進化', color: UI_COLORS.gold },
  { id: 'skills', label: 'スキル', color: UI_COLORS.green },
  { id: 'zeroRoutes', label: 'ZERO', color: 0x7aa8ff },
];

const RECORD_ITEMS = [
  { id: 'bestScore', label: 'スコア', color: UI_COLORS.dna },
  { id: 'bestSurvivalTime', label: '生存', color: UI_COLORS.green },
  { id: 'totalRuns', label: '出撃', color: UI_COLORS.gold },
  { id: 'bestKills', label: '撃破', color: UI_COLORS.danger },
];

const HERO = { x: 0, y: 92, width: 390, height: 342 };
const RESOURCE_PANEL = { x: 150, y: 16, width: 220, height: 68 };
const DEPLOY = { x: 38, y: 424, width: 314, height: 66 };
const HOME_INFO_TABS = [
  { id: 'daily', label: 'デイリー', color: UI_COLORS.gold },
  { id: 'record', label: '記録', color: UI_COLORS.green },
  { id: 'unlock', label: '解放', color: UI_COLORS.dna },
];
const INFO_TAB = { x: 18, y: 502, width: 110, height: 36, gap: 12 };
const INFO_PANEL = { x: 18, y: 536, width: 354, height: 196 };
const UNLOCK_PANEL = INFO_PANEL;
const RECORD_PANEL = INFO_PANEL;
const DAILY_PANEL = INFO_PANEL;
const SELECTOR = { leftX: 86, pillX: 126, rightX: 270, y: 385 };
const COMPANION_HOME_PANEL = { x: 18, y: 92, width: 168, height: 66 };

const COMPANION_UI_DESCRIPTIONS = {
  raptorling: '近くの敵を素早く自動攻撃',
  spino_pup: '水弾で複数の敵を支援攻撃',
  medic_saur: 'HPが減ると自動回復',
  ptera_chick: '遠距離から小弾で牽制',
  tricera_calf: '被ダメージを短く軽減',
  para_juvenile: 'EXPやアイテム回収を補助',
  stego_calf: '周囲の敵へ小範囲攻撃',
  rex_hatchling: 'ボスへの攻撃を補助',
  compy_pack: '弱った敵を素早く処理',
  exp_chaser: 'EXP回収と成長を補助',
};

function getCompanionSynergyStatusText(synergy, active) {
  if (!synergy) {
    return '共存シナジーなし';
  }

  if (!synergy.enabled) {
    return '';
  }

  return active ? '発動中' : '未発動';
}

function getCompanionSynergySummary(companionId, dinoId) {
  const synergy = getCompanionSynergyForCompanion(companionId);
  if (!synergy) {
    return {
      active: false,
      partner: '-',
      name: '共存シナジーなし',
      detail: '相性情報はありません',
      status: '未発動',
    };
  }

  const active = isCompanionSynergyActive({ dinoId, companionId });
  return {
    active,
    enabled: synergy.enabled,
    partner: synergy.publicPlayerDinoName ?? '未発見の恐竜',
    name: synergy.enabled ? synergy.name : '',
    detail: synergy.enabled ? synergy.shortLabel : '',
    status: getCompanionSynergyStatusText(synergy, active),
  };
}

function formatCompanionSynergyLine(synergy) {
  if (!synergy) {
    return '相性: -';
  }

  return synergy.enabled
    ? `共存シナジー: ${synergy.partner}`
    : `相性: ${synergy.partner}`;
}

function formatCompanionSynergyDetail(synergy) {
  if (!synergy?.enabled) {
    return '';
  }

  return `効果: ${synergy.detail} / ${synergy.status}`;
}

const UNLOCK_CONTENT = {
  titleX: INFO_PANEL.x + 26,
  titleY: INFO_PANEL.y + 16,
  iconX: INFO_PANEL.x + 28,
  labelX: INFO_PANEL.x + 54,
  valueX: INFO_PANEL.x + INFO_PANEL.width - 30,
  rowStartY: INFO_PANEL.y + 54,
  rowGap: 34,
};

const RECORD_CONTENT = {
  titleX: INFO_PANEL.x + 26,
  titleY: INFO_PANEL.y + 18,
  iconX: INFO_PANEL.x + 30,
  labelX: INFO_PANEL.x + 46,
  colGap: 150,
  rowStartY: INFO_PANEL.y + 56,
  rowGap: 60,
};

const DAILY_CONTENT = {
  titleX: INFO_PANEL.x + 26,
  titleY: INFO_PANEL.y + 18,
  iconX: INFO_PANEL.x + 28,
  labelX: INFO_PANEL.x + 50,
  statusX: INFO_PANEL.x + 224,
  rewardX: INFO_PANEL.x + 286,
  buttonX: INFO_PANEL.x + INFO_PANEL.width - 58,
  rowStartY: INFO_PANEL.y + 52,
  rowGap: 45,
};

export class HomeScreen {
  constructor({
    width,
    height,
    gameState,
    saveData,
    saveManager = null,
    assetLoader = null,
    onDeploy,
    onResearch,
    onCodex,
    onOptions,
    onUiFeedback,
    onApplyUpdate,
    onCompanionHomeVisible,
  }) {
    this.width = width;
    this.height = height;
    this.gameState = gameState;
    this.saveData = saveData;
    this.saveManager = saveManager;
    this.assetLoader = assetLoader;
    this.onDeploy = onDeploy;
    this.onResearch = onResearch;
    this.onCodex = onCodex;
    this.onOptions = onOptions;
    this.onUiFeedback = onUiFeedback;
    this.onApplyUpdate = onApplyUpdate;
    this.onCompanionHomeVisible = onCompanionHomeVisible;
    this.companionHomeTutorialShownForVisit = false;
    this.textures = new Map();
    this.activeHomeInfoTab = 'daily';
    this.gamepadFocusItems = ['deploy', 'title', 'companion', 'news', 'daily', 'record', 'unlock', 'home', 'research', 'codex', 'options'];
    this.gamepadFocusIndex = 0;
    this.newsGamepadIndex = 0;
    this.companionModalPage = 0;

    this.view = new Container();
    this.background = new Graphics();
    this.homeBackground = new Sprite(Texture.EMPTY);
    this.logoSprite = new Sprite(Texture.EMPTY);
    this.logoFallback = this.createText('EVOLUTION\nZERO', 20, '#f4f7f5', 132);
    this.resourcePanel = new Sprite(Texture.EMPTY);
    this.infoPanel = new Sprite(Texture.EMPTY);
    this.infoPanelGlow = new Sprite(Texture.EMPTY);
    this.heroDino = new Sprite(Texture.EMPTY);
    this.heroFallback = new Graphics();
    this.titleFrameSprite = new Sprite(Texture.EMPTY);
    this.titleFrame = new Graphics();
    this.panelGraphics = new Graphics();
    this.iconGraphics = new Graphics();
    this.deployGlow = new Sprite(Texture.EMPTY);
    this.deployFrame = new Sprite(Texture.EMPTY);
    this.deployLeftIcon = new Sprite(Texture.EMPTY);
    this.selectorPlate = new Sprite(Texture.EMPTY);
    this.newsEntryFrame = new Sprite(Texture.EMPTY);
    this.newsEntryFallback = new Graphics();
    this.newsEntryText = this.createText('お知らせ', 14, '#f2fffb', 122);
    this.newsModal = this.createNewsModal();
    this.companionPanelFrame = new Sprite(Texture.EMPTY);
    this.companionPanel = new Graphics();
    this.companionIcon = new Sprite(Texture.EMPTY);
    this.companionTitle = this.createText('お供', 10, '#7cf7d4', 70);
    this.companionName = this.createText('お供なし', 11, '#fff0b4', 98);
    this.companionSynergyLine = this.createText('', 8.5, '#7cf7d4', 98);
    this.companionModal = this.createCompanionModal();
    this.switchLeft = new Sprite(Texture.EMPTY);
    this.switchRight = new Sprite(Texture.EMPTY);
    this.switchFallback = new Graphics();
    this.switchLeftHit = new Graphics();
    this.switchRightHit = new Graphics();
    this.resourceIcons = RESOURCE_ITEMS.map((item) => ({
      item,
      sprite: new Sprite(Texture.EMPTY),
    }));

    this.resourceTexts = RESOURCE_ITEMS.map((item) => ({
      item,
      label: this.createText(item.label, 8, '#9db2ad', 62),
      value: this.createText('', 12, '#ffffff', 70),
    }));
    this.dinoName = this.createText('', 21, '#ffffff', 280);
    this.dinoLine = this.createText('', 10, '#d7fff2', 280);
    this.equippedTitleText = this.createText('', 12, '#fff0b4', 180);
    this.homeDinoHint = this.createText('', 9, '#8da49e', 116);
    this.deployTitle = this.createText('出撃', 25, '#fff0b4', 160);
    this.deploySub = this.createText('ステージ選択へ', 10, '#ffd36b', 150);
    this.unlockTitle = this.createText('解放', 12, '#7cf7d4', 90);
    this.recordTitle = this.createText('記録', 12, '#7cf7d4', 90);
    this.dailyTitle = this.createText('デイリー', 12, '#7cf7d4', 120);
    this.dailyClaimAllButton = this.createDailyClaimAllButton();
    this.infoTabButtons = HOME_INFO_TABS.map((item) => this.createHomeInfoTabButton(item));
    this.unlockRows = UNLOCK_STATUS_ITEMS.map((item) => ({
      item,
      label: this.createText(item.label, 11, '#d7fff2', 58),
      value: this.createText('', 12, '#fff0b4', 52),
    }));
    this.recordRows = RECORD_ITEMS.map((item) => ({
      item,
      label: this.createText(item.label, 9.5, '#cbe0da', 50),
      value: this.createText('', 13, '#ffffff', 66),
    }));
    this.dailyRows = Array.from({ length: DAILY_MISSION_COUNT }, () => {
      const button = this.createDailyButton();

      return {
        mission: null,
        label: this.createText('', 10.5, '#e7fff6', 156),
        status: this.createText('', 9.5, '#fff0b4', 72),
        reward: this.createText('', 9.5, '#7cf7d4', 58),
        button,
        canShowButton: false,
      };
    });
    this.noticeText = this.createText('', 10, '#ffd36b', 300);
    this.titleSelectUi = new TitleSelectUi({
      width: this.width,
      height: this.height,
      saveManager: this.saveManager,
      onChanged: (data) => {
        this.saveData = data;
        this.setSaveData(data, this.gameState);
      },
      onUiFeedback: (id = 'ui_click') => this.playUiFeedback(id),
    });
    this.bottomNav = createBottomNav({
      width: this.width,
      height: this.height,
      active: 'home',
      assetLoader: this.assetLoader,
      onNavigate: (id) => this.handleNav(id),
    });

    this.view.addChild(
      this.background,
      this.homeBackground,
      this.panelGraphics,
      this.heroFallback,
      this.heroDino,
      this.titleFrameSprite,
      this.titleFrame,
      this.infoPanel,
      this.infoPanelGlow,
      ...this.infoTabButtons.map((entry) => entry.view),
      this.resourcePanel,
      this.deployGlow,
      this.deployFrame,
      this.deployLeftIcon,
      this.selectorPlate,
      this.switchFallback,
      this.switchLeft,
      this.switchRight,
      this.switchLeftHit,
      this.switchRightHit,
      this.iconGraphics,
      ...this.resourceIcons.map((entry) => entry.sprite),
      this.logoSprite,
      this.logoFallback,
      this.newsEntryFallback,
      this.newsEntryFrame,
      this.newsEntryText,
      this.companionPanelFrame,
      this.companionPanel,
      this.companionIcon,
      this.companionTitle,
      this.companionName,
      this.companionSynergyLine,
      ...this.resourceTexts.flatMap((entry) => [entry.label, entry.value]),
      this.dinoName,
      this.dinoLine,
      this.equippedTitleText,
      this.homeDinoHint,
      this.deployTitle,
      this.deploySub,
      this.unlockTitle,
      ...this.unlockRows.flatMap((entry) => [entry.label, entry.value]),
      this.recordTitle,
      ...this.recordRows.flatMap((entry) => [entry.label, entry.value]),
      this.dailyTitle,
      this.dailyClaimAllButton.view,
      ...this.dailyRows.flatMap((entry) => [entry.label, entry.status, entry.reward, entry.button.view]),
      this.noticeText,
      this.bottomNav.view,
      this.titleSelectUi.view,
      this.newsModal.view,
      this.companionModal.view,
    );

    this.drawStatic();
    this.deployFrame.eventMode = 'static';
    this.deployFrame.cursor = 'pointer';
    this.deployFrame.on('pointertap', () => this.handleDeployTap());
    this.newsEntryFrame.eventMode = 'static';
    this.newsEntryFrame.cursor = 'pointer';
    this.newsEntryFrame.on('pointertap', () => this.openNewsModal());
    this.newsEntryFallback.eventMode = 'static';
    this.newsEntryFallback.cursor = 'pointer';
    this.newsEntryFallback.on('pointertap', () => this.openNewsModal());
    this.switchLeft.eventMode = 'static';
    this.switchLeft.cursor = 'pointer';
    this.switchLeft.on('pointertap', () => this.handleDinoSwitchTap(-1));
    this.switchRight.eventMode = 'static';
    this.switchRight.cursor = 'pointer';
    this.switchRight.on('pointertap', () => this.handleDinoSwitchTap(1));
    this.switchLeftHit.eventMode = 'static';
    this.switchLeftHit.cursor = 'pointer';
    this.switchLeftHit.on('pointertap', () => this.handleDinoSwitchTap(-1));
    this.switchRightHit.eventMode = 'static';
    this.switchRightHit.cursor = 'pointer';
    this.switchRightHit.on('pointertap', () => this.handleDinoSwitchTap(1));
    this.titleFrame.eventMode = 'static';
    this.titleFrame.cursor = 'pointer';
    this.titleFrame.on('pointertap', () => this.openTitleSelect());
    this.titleFrameSprite.eventMode = 'static';
    this.titleFrameSprite.cursor = 'pointer';
    this.titleFrameSprite.on('pointertap', () => this.openTitleSelect());
    this.equippedTitleText.eventMode = 'static';
    this.equippedTitleText.cursor = 'pointer';
    this.equippedTitleText.on('pointertap', () => this.openTitleSelect());
    this.companionPanel.eventMode = 'static';
    this.companionPanel.cursor = 'pointer';
    this.companionPanel.on('pointertap', () => this.openCompanionModal());
    this.loadAssets();
    this.setSaveData(this.saveData, this.gameState);
  }

  show() {
    this.setSaveData(this.saveManager?.getData?.() ?? this.saveData, this.gameState);
    this.bottomNav.setActive('home');
    this.view.visible = true;
  }

  handleGamepadAction(actions) {
    if (!this.view.visible) {
      return false;
    }

    if (this.titleSelectUi?.view?.visible) {
      return this.titleSelectUi.handleGamepadAction?.(actions) ?? false;
    }

    if (this.newsModal?.view?.visible) {
      return this.handleNewsGamepadAction(actions);
    }

    if (this.companionModal?.view?.visible) {
      return this.handleCompanionGamepadAction(actions);
    }

    if (actions.cancelPressed) {
      return false;
    }

    if (actions.nextPressed || actions.previousPressed) {
      const current = this.getFocusedHomeItem();
      if (['daily', 'record', 'unlock'].includes(current)) {
        const tabs = ['daily', 'record', 'unlock'];
        const index = tabs.indexOf(current);
        const next = tabs[Math.max(0, Math.min(tabs.length - 1, index + (actions.nextPressed ? 1 : -1)))];
        this.focusHomeItem(next);
        this.handleHomeInfoTabTap(next);
        return true;
      }
    }

    if (actions.downPressed || actions.upPressed || actions.leftPressed || actions.rightPressed) {
      this.moveGamepadFocus(actions);
      return true;
    }

    if (actions.confirmPressed) {
      this.activateGamepadFocusItem();
      return true;
    }

    return false;
  }

  getFocusedHomeItem() {
    const items = this.gamepadFocusItems ?? ['deploy'];
    const index = Number.isInteger(this.gamepadFocusIndex) ? this.gamepadFocusIndex : 0;
    return items[index] ?? 'deploy';
  }

  focusHomeItem(id) {
    const index = (this.gamepadFocusItems ?? []).indexOf(id);
    if (index >= 0) {
      this.gamepadFocusIndex = index;
    }
  }

  moveGamepadFocus(actions) {
    const current = this.getFocusedHomeItem();
    const rows = {
      top: ['title', 'companion', 'news'],
      info: ['daily', 'record', 'unlock'],
      nav: ['home', 'research', 'codex', 'options'],
    };

    if (actions.leftPressed || actions.rightPressed) {
      const row = Object.values(rows).find((items) => items.includes(current));
      if (row) {
        const index = row.indexOf(current);
        const delta = actions.rightPressed ? 1 : -1;
        this.focusHomeItem(row[Math.max(0, Math.min(row.length - 1, index + delta))]);
        return;
      }

      if (current === 'deploy') {
        this.focusHomeItem(actions.rightPressed ? 'companion' : 'title');
      }
      return;
    }

    if (actions.downPressed) {
      const downMap = {
        title: 'deploy',
        companion: 'deploy',
        news: 'deploy',
        deploy: 'daily',
        daily: 'home',
        record: 'research',
        unlock: 'codex',
        home: 'home',
        research: 'research',
        codex: 'codex',
        options: 'options',
      };
      this.focusHomeItem(downMap[current] ?? 'deploy');
      return;
    }

    if (actions.upPressed) {
      const upMap = {
        title: 'title',
        companion: 'companion',
        news: 'news',
        deploy: 'title',
        daily: 'deploy',
        record: 'deploy',
        unlock: 'deploy',
        home: 'daily',
        research: 'record',
        codex: 'unlock',
        options: 'unlock',
      };
      this.focusHomeItem(upMap[current] ?? 'deploy');
    }
  }

  activateGamepadFocusItem() {
    const id = this.getFocusedHomeItem();
    if (id === 'deploy') {
      this.handleDeployTap();
    } else if (id === 'title') {
      this.openTitleSelect();
    } else if (id === 'companion') {
      this.openCompanionModal();
    } else if (id === 'news') {
      this.openNewsModal();
    } else if (['daily', 'record', 'unlock'].includes(id)) {
      this.handleHomeInfoTabTap(id);
    } else if (id === 'research') {
      this.onResearch?.();
    } else if (id === 'codex') {
      this.onCodex?.();
    } else if (id === 'options') {
      this.onOptions?.();
    }
  }

  handleNewsGamepadAction(actions) {
    if (actions.cancelPressed || actions.pausePressed) {
      if (this.newsModal.mode === 'detail') {
        this.showNewsList();
      } else {
        this.closeNewsModal();
      }
      return true;
    }

    if (this.newsModal.mode !== 'detail' && (actions.downPressed || actions.upPressed)) {
      const items = this.newsModal.listCards.filter((card) => card.view.visible);
      const delta = actions.downPressed ? 1 : -1;
      this.newsGamepadIndex = Math.max(0, Math.min(items.length - 1, this.newsGamepadIndex + delta));
      return true;
    }

    if (actions.confirmPressed) {
      if (this.newsModal.mode === 'detail') {
        this.showNewsList();
      } else {
        const items = this.newsModal.listCards.filter((card) => card.view.visible);
        const card = items[this.newsGamepadIndex] ?? items[0];
        if (card?.item) {
          this.showNewsDetail(card.item);
        }
      }
      return true;
    }

    return true;
  }

  getGamepadFocusBounds() {
    if (this.titleSelectUi?.view?.visible || this.newsModal?.view?.visible || this.companionModal?.view?.visible) {
      return null;
    }

    const bottomNavY = Math.max(702, this.height - 94);
    const item = this.getFocusedHomeItem();
    const bounds = {
      deploy: { x: 38, y: 418, width: 314, height: 76, radius: 14 },
      daily: { x: 38, y: 520, width: 98, height: 44, radius: 12 },
      record: { x: 146, y: 520, width: 98, height: 44, radius: 12 },
      unlock: { x: 254, y: 520, width: 98, height: 44, radius: 12 },
      title: { x: Math.round(this.width / 2 - 88), y: 158, width: 176, height: 28, radius: 8 },
      companion: { ...COMPANION_HOME_PANEL, radius: 12 },
      news: { x: 226, y: 114, width: 130, height: 44, radius: 12 },
      home: { x: 24, y: bottomNavY, width: 78, height: 72, radius: 12 },
      research: { x: 112, y: bottomNavY, width: 78, height: 72, radius: 12 },
      codex: { x: 198, y: bottomNavY, width: 78, height: 72, radius: 12 },
      options: { x: 286, y: bottomNavY, width: 78, height: 72, radius: 12 },
    };
    return bounds[item] ?? bounds.deploy;
  }
  setPwaUpdateInfo(updateInfo = null) {
    this.pwaUpdateInfo = updateInfo;
  }

  hide() {
    this.view.visible = false;
  }

  setSaveData(saveData, gameState = this.gameState) {
    this.saveData = saveData ?? this.saveData;
    this.gameState = gameState ?? this.gameState;

    const data = this.saveData ?? {};
    const fallbackResearchPt = Math.floor((data.totalExpGained ?? 0) * 0.12);
    const researchPt = data.researchPt ?? fallbackResearchPt;
    const homeTarget = this.getHomeDisplayTarget(data);
    const homeDinoId = homeTarget.dinoId;
    const dino = getDinoConfig(homeDinoId);
    const profile = HOME_DINO_PROFILES[homeDinoId] ?? HOME_DINO_PROFILES.velociraptor;
    const resourceValues = {
      dna: data.ownedDna ?? 0,
      researchPt,
    };
    const unlockValues = {
      dinos: `${this.getUnlockedDinoCount(data)} / ${HOME_DINO_IDS.length}`,
      evolutions: `${this.getDiscoveredEvolutionCount(data)} / ${this.getTotalEvolutionCount(data)}`,
      skills: '? / ?',
      zeroRoutes: `${this.getUnlockedZeroRouteCount(data)} / ${this.getTotalZeroRouteCount(data)}`,
    };
    const recordValues = {
      bestScore: this.formatNumber(data.bestScore ?? 0),
      bestSurvivalTime: this.formatTime(data.bestSurvivalTime ?? 0),
      totalRuns: `${this.formatNumber(data.totalRuns ?? 0)}回`,
      bestKills: `${this.formatNumber(data.totalDefeated ?? 0)}体`,
    };

    this.resourceTexts.forEach(({ item, value }) => {
      value.text = this.formatNumber(resourceValues[item.id] ?? 0);
    });
    this.dinoName.text = homeTarget.branch?.evolutionName ?? profile.label;
    this.dinoName.style.fill = toCssColor(dino.accentColor);
    this.dinoLine.text = homeTarget.branch?.role ?? profile.line;
    this.homeDinoHint.text = '表示恐竜を切り替え';
    this.unlockRows.forEach(({ item, value }) => {
      value.text = unlockValues[item.id] ?? '? / ?';
    });
    this.recordRows.forEach(({ item, value }) => {
      value.text = recordValues[item.id] ?? '-';
    });
    const dailyMissions = this.saveManager?.getDailyMissions?.() ?? data.dailyMissions ?? { missions: [] };
    let claimableDailyCount = 0;
    this.dailyRows.forEach((row, index) => {
      const mission = dailyMissions.missions?.[index] ?? null;
      const template = getDailyMissionTemplate(mission?.id);
      const { status, reward, button } = row;
      row.mission = mission;

      if (!mission || !template) {
        row.label.text = 'デイリー準備中';
        status.text = '-';
        reward.text = '-';
        row.canShowButton = false;
        button.view.visible = false;
        return;
      }

      const progress = Math.min(template.target, Math.max(0, Math.floor(mission.progress ?? 0)));
      const complete = Boolean(mission.completed) || progress >= template.target;
      const claimed = Boolean(mission.claimed);
      if (complete && !claimed) {
        claimableDailyCount += 1;
      }

      row.label.text = template.shortLabel ?? template.label;
      status.text = complete ? (claimed ? '受取済み' : '達成') : `${this.formatNumber(progress)}/${this.formatNumber(template.target)}`;
      status.style.fill = complete ? '#65e878' : '#fff0b4';
      reward.text = formatDailyReward(template.reward).replace('研究Pt ', 'Pt ');
      row.canShowButton = complete;
      button.view.visible = this.activeHomeInfoTab === 'daily' && complete;
      button.view.eventMode = complete && !claimed ? 'static' : 'none';
      button.view.cursor = complete && !claimed ? 'pointer' : 'default';
      button.view.alpha = claimed ? 0.62 : 1;
      button.text.text = claimed ? '済' : '受取';
      button.text.style.fill = claimed ? '#8da49e' : '#071015';
      this.drawDailyButton(button.bg, claimed);
    });
    this.dailyClaimAllButton.view.visible = this.activeHomeInfoTab === 'daily';
    this.dailyClaimAllButton.view.eventMode = claimableDailyCount > 0 ? 'static' : 'none';
    this.dailyClaimAllButton.view.cursor = claimableDailyCount > 0 ? 'pointer' : 'default';
    this.dailyClaimAllButton.view.alpha = claimableDailyCount > 0 ? 1 : 0.58;
    this.dailyClaimAllButton.text.text = claimableDailyCount > 0 ? '一括受取' : '受取なし';
    this.drawDailyClaimAllButton(this.dailyClaimAllButton.bg, claimableDailyCount <= 0);
    this.applyTextures(homeDinoId, homeTarget.evolutionId);
    this.updateHomeInfoTabVisibility();
    this.updateEquippedTitle(data);
    this.updateCompanionPanel(data);
    this.drawDynamic(dino);
  }

  updateCompanionPanel(data) {
    const companionState = data.companion ?? {};
    const ownedIds = Array.isArray(companionState.ownedIds) ? companionState.ownedIds : [];
    const hasOwnedCompanion = ownedIds.length > 0;

    this.companionPanelFrame.visible = hasOwnedCompanion;
    this.companionPanel.visible = hasOwnedCompanion;
    this.companionIcon.visible = hasOwnedCompanion;
    this.companionTitle.visible = hasOwnedCompanion;
    this.companionName.visible = hasOwnedCompanion;
    this.companionSynergyLine.visible = hasOwnedCompanion;
    this.companionPanel.eventMode = hasOwnedCompanion ? 'static' : 'none';
    this.companionPanel.cursor = hasOwnedCompanion ? 'pointer' : 'default';

    if (!hasOwnedCompanion) {
      this.companionPanel.clear();
      return;
    }

    const companion = getCompanionById(companionState.selectedId);
    const iconTexture = companion
      ? (this.textures.get(`companionIcon:${companion.id}`) ?? this.textures.get('companionIcon'))
      : this.textures.get('companionIcon');
    const { x, y, width, height } = COMPANION_HOME_PANEL;
    const accent = companion ? (COMPANION_TYPES[companion.type]?.accent ?? 0x7cf7d4) : 0x7cf7d4;
    const frameTexture = this.textures.get('companionHomeFrame');

    this.companionPanelFrame.texture = frameTexture ?? Texture.EMPTY;
    this.companionPanelFrame.position.set(x, y);
    this.companionPanelFrame.width = width;
    this.companionPanelFrame.height = height;
    this.companionPanelFrame.alpha = frameTexture ? 0.96 : 0;

    this.companionPanel
      .clear()
      .roundRect(x, y, width, height, 12)
      .fill({ color: 0x020708, alpha: frameTexture ? 0.12 : 0.66 })
      .stroke({ color: accent, width: 1.2, alpha: frameTexture ? 0.2 : 0.78 });
    this.companionIcon.texture = iconTexture ?? Texture.EMPTY;
    this.companionIcon.visible = Boolean(this.companionIcon.texture && this.companionIcon.texture !== Texture.EMPTY);
    this.companionIcon.anchor.set(0.5);
    this.companionIcon.position.set(x + 31, y + 30);
    this.companionIcon.width = 38;
    this.companionIcon.height = 38;
    this.companionTitle.text = 'お供';
    this.companionTitle.anchor.set(0, 0.5);
    this.companionTitle.position.set(x + 58, y + 20);
    this.companionName.text = companion ? `${companion.displayName} Lv${companionState.levels?.[companion.id] ?? 1}` : '未セット';
    this.companionName.anchor.set(0, 0.5);
    this.companionName.position.set(x + 58, y + 35);
    this.companionName.style.fill = '#fff0b4';
    this.companionSynergyLine.text = companion ? 'タップで変更' : '';
    this.companionSynergyLine.anchor.set(0, 0.5);
    this.companionSynergyLine.position.set(x + 58, y + 51);
    this.companionSynergyLine.style.fill = '#8da49e';

    const shouldShowCompanionHomeTutorial = Boolean(companionState.lastHatchedId)
      && !this.companionHomeTutorialShownForVisit
      && !this.saveManager?.isTutorialComplete?.('companionHomeViewed');

    if (shouldShowCompanionHomeTutorial) {
      if (!this.saveManager?.isTutorialComplete?.('home')) {
        return;
      }
      this.companionHomeTutorialShownForVisit = true;
      queueMicrotask(() => this.onCompanionHomeVisible?.());
    }
  }

  updateEquippedTitle(data) {
    const ownedTitles = data.ownedTitles ?? {};
    const ownedFrames = data.ownedTitleFrames ?? {};
    const equippedTitle = getTitleById(data.equippedTitleId);
    const title = equippedTitle && ownedTitles[equippedTitle.id]?.owned
      ? equippedTitle
      : this.getFallbackOwnedTitle(ownedTitles);
    const preferredFrame = getTitleFrameById(data.equippedTitleFrameId);
    const derivedFrame = title?.frameType ? getTitleFrameById(title.frameType) : null;
    const frame = preferredFrame && ownedFrames[preferredFrame.id]?.owned
      ? preferredFrame
      : derivedFrame && ownedFrames[derivedFrame.id]?.owned
        ? derivedFrame
        : null;

    if (!title) {
      const x = Math.round(this.width / 2 - 88);
      const y = 158;
      const width = 176;
      const height = 28;

      this.titleFrameSprite.visible = false;
      this.titleFrame
        .clear()
        .roundRect(x, y, width, height, 8)
        .fill({ color: 0x020708, alpha: 0.46 })
        .stroke({ color: 0x23434a, width: 1, alpha: 0.56 });
      this.equippedTitleText.text = '称号なし';
      this.equippedTitleText.anchor.set(0.5);
      this.equippedTitleText.position.set(x + width / 2, y + height / 2);
      this.equippedTitleText.scale.set(1);
      this.equippedTitleText.style.fill = '#8da49e';
      this.equippedTitleText.style.fontSize = 11;
      this.equippedTitleText.visible = true;
      return;
    }

    const accent = frame?.color ?? 0x35d7ff;
    const isZero = frame?.rarity === 'zero' || title.rarity === 'zero';
    const x = Math.round(this.width / 2 - (isZero ? 116 : 104));
    const y = isZero ? 150 : 154;
    const width = isZero ? 232 : 208;
    const height = isZero ? 38 : 34;
    const frameTexture = frame?.id ? this.textures.get(`titleFrame:${frame.id}`) : null;

    this.titleFrameSprite.texture = frameTexture ?? Texture.EMPTY;
    this.titleFrameSprite.visible = !!frameTexture;
    this.titleFrameSprite.position.set(x, y);
    this.titleFrameSprite.width = width;
    this.titleFrameSprite.height = height;

    this.titleFrame.clear();

    if (frameTexture) {
      this.titleFrame
        .roundRect(x, y, width, height, 9)
        .fill({ color: 0x000000, alpha: 0.001 });
    } else {
      this.titleFrame
        .roundRect(x, y, width, height, 9)
        .fill({ color: isZero ? 0x120617 : 0x020708, alpha: isZero ? 0.78 : 0.68 })
        .stroke({ color: accent, width: isZero ? 2.2 : 1.4, alpha: isZero ? 0.92 : 0.74 })
        .roundRect(x + 5, y + 5, width - 10, height - 10, 7)
        .stroke({ color: isZero ? 0xfff0b4 : 0x6cf7ff, width: 0.8, alpha: isZero ? 0.42 : 0.24 })
        .rect(x + 18, y + height - 6, width - 36, 1)
        .fill({ color: accent, alpha: isZero ? 0.52 : 0.34 })
        .rect(x + 18, y + 5, width - 36, 1)
        .fill({ color: accent, alpha: isZero ? 0.36 : 0.2 });

      if (isZero) {
        this.titleFrame
          .circle(x + 16, y + height / 2, 3.5)
          .fill({ color: 0xfff0b4, alpha: 0.78 })
          .circle(x + width - 16, y + height / 2, 3.5)
          .fill({ color: 0xfff0b4, alpha: 0.78 });
      }
    }

    this.equippedTitleText.text = title.name;
    this.equippedTitleText.anchor.set(0.5);
    this.equippedTitleText.position.set(x + width / 2, y + height / 2);
    this.equippedTitleText.scale.set(1);
    this.equippedTitleText.style.fontSize = isZero ? 13 : 12;
    this.equippedTitleText.style.fill = isZero ? '#fff4c8' : '#fff0b4';
    const textWidth = this.equippedTitleText.getLocalBounds().width || 1;
    const maxTextWidth = width - (isZero ? 44 : 30);

    if (textWidth > maxTextWidth) {
      this.equippedTitleText.scale.set(Math.max(0.78, maxTextWidth / textWidth));
    }

    this.equippedTitleText.visible = true;
  }

  getTutorialBounds(targetId) {
    if (targetId === 'home.companion') {
      return {
        ...COMPANION_HOME_PANEL,
        radius: 12,
      };
    }

    if (targetId !== 'home.title') {
      return null;
    }

    const fallback = {
      x: Math.round(this.width / 2 - 88),
      y: 158,
      width: 176,
      height: 28,
      radius: 8,
    };
    const bounds = this.equippedTitleText?.visible
      ? this.equippedTitleText.getBounds()
      : null;

    if (!bounds || bounds.width <= 0 || bounds.height <= 0) {
      return fallback;
    }

    const left = Math.min(bounds.x - 26, fallback.x);
    const top = Math.min(bounds.y - 8, fallback.y);
    const right = Math.max(bounds.x + bounds.width + 26, fallback.x + fallback.width);
    const bottom = Math.max(bounds.y + bounds.height + 8, fallback.y + fallback.height);

    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
      radius: 8,
    };
  }

  getFallbackOwnedTitle(ownedTitles = {}) {
    return Object.keys(ownedTitles)
      .filter((id) => ownedTitles[id]?.owned)
      .map((id) => getTitleById(id))
      .filter(Boolean)
      .sort((a, b) => (b.displayOrder ?? 0) - (a.displayOrder ?? 0))[0] ?? null;
  }

  getHomeDinoId(data) {
    return this.getHomeDisplayTarget(data).dinoId;
  }

  getHomeDisplayTarget(data) {
    const availableIds = this.getAvailableHomeDinoIds(data);
    const evolutionId = data.currentHomeEvolutionId;
    const branch = evolutionId ? getEvolutionBranchById(evolutionId) : null;

    if (branch && this.isHomeEvolutionAvailable(data, evolutionId) && availableIds.includes(branch.dinoId)) {
      return { id: `evolution:${evolutionId}`, dinoId: branch.dinoId, evolutionId, branch };
    }

    const candidate = data.currentHomeDino ?? data.favoriteDinoId ?? data.homeDinoId ?? 'velociraptor';
    const dinoId = availableIds.includes(candidate) ? candidate : availableIds[0];

    return { id: `dino:${dinoId}`, dinoId, evolutionId: null, branch: null };
  }

  getAvailableHomeDinoIds(data) {
    const unlocked = [...DEFAULT_UNLOCKED_HOME_DINOS];
    const unlockedDinos = data.unlockedDinos ?? {};
    HOME_DINO_IDS.forEach((id) => {
      if (unlocked.includes(id)) {
        return;
      }

      if (unlockedDinos[id]?.unlocked || this.isDebugDinoUnlocked(id)) {
        unlocked.push(id);
      }
    });

    return unlocked.length > 0 ? unlocked : ['velociraptor'];
  }

  isDebugDinoUnlocked(dinoId) {
    if (typeof window === 'undefined') {
      return false;
    }

    const params = new URLSearchParams(window.location.search);
    return params.get('debugUnlockDino') === dinoId
      || params.get('debugUnlockAllDinos') === '1'
      || params.get('debugNewDinoQa') === '1';
  }

  getAvailableHomeTargets(data) {
    const availableDinoIds = this.getAvailableHomeDinoIds(data);
    const debugRoute = new URLSearchParams(window.location.search).get('debugUnlockZeroRoute');
    const discoveredNormalBranches = getDiscoveredEvolutionEntries(data.discoveredEvolutions)
      .map((entry) => ({ entry, branch: getEvolutionBranchById(entry.id) }))
      .filter(({ entry, branch }) => (
        branch
        && entry.dinoId
        && (entry.tag !== 'zero' || data.unlockedZeroRoutes?.[entry.id]?.unlocked || debugRoute === entry.id)
        && availableDinoIds.includes(entry.dinoId)
      ));
    const debugBranch = debugRoute ? getEvolutionBranchById(debugRoute) : null;

    if (
      debugBranch
      && debugBranch.tag === 'zero'
      && availableDinoIds.includes(debugBranch.dinoId)
      && !discoveredNormalBranches.some(({ entry }) => entry.id === debugBranch.id)
    ) {
      discoveredNormalBranches.push({
        entry: {
          discovered: true,
          id: debugBranch.id,
          dinoId: debugBranch.dinoId,
          tag: debugBranch.tag,
        },
        branch: debugBranch,
      });
    }

    return availableDinoIds.flatMap((dinoId) => {
      const baseTarget = {
        id: `dino:${dinoId}`,
        dinoId,
        evolutionId: null,
      };
      const branchTargets = HOME_BRANCH_ORDER
        .map((tag) => discoveredNormalBranches.find(({ entry }) => entry.dinoId === dinoId && entry.tag === tag))
        .filter(Boolean)
        .map(({ entry }) => ({
          id: `evolution:${entry.id}`,
          dinoId: entry.dinoId,
          evolutionId: entry.id,
        }));

      return [baseTarget, ...branchTargets];
    });
  }

  isHomeEvolutionAvailable(data, evolutionId) {
    const debugRoute = new URLSearchParams(window.location.search).get('debugUnlockZeroRoute');

    if (debugRoute === evolutionId) {
      return true;
    }

    return getDiscoveredEvolutionEntries(data.discoveredEvolutions).some((entry) => entry.id === evolutionId);
  }

  getDiscoveredEvolutionCount(data) {
    return getSavedEvolutionCount(data.discoveredEvolutions);
  }

  getTotalEvolutionCount(data) {
    const unlockedDinos = new Set(this.getAvailableHomeDinoIds(data));

    return getAllEvolutionBranches().filter((branch) => unlockedDinos.has(branch.dinoId)).length;
  }

  getUnlockedDinoCount(data) {
    return this.getAvailableHomeDinoIds(data).length;
  }

  getTotalZeroRouteCount(data) {
    const unlockedDinos = new Set(this.getAvailableHomeDinoIds(data));

    return getAllEvolutionBranches().filter((branch) => branch.tag === 'zero' && unlockedDinos.has(branch.dinoId)).length;
  }

  getUnlockedZeroRouteCount(data) {
    const routes = data.unlockedZeroRoutes ?? {};
    const unlockedDinos = new Set(this.getAvailableHomeDinoIds(data));

    return getAllEvolutionBranches()
      .filter((branch) => branch.tag === 'zero' && unlockedDinos.has(branch.dinoId))
      .filter((branch) => routes[branch.id]?.unlocked).length;
  }

  cycleHomeDino(direction) {
    const current = this.getHomeDisplayTarget(this.saveData ?? {});
    const targets = this.getAvailableHomeTargets(this.saveData ?? {});
    const index = Math.max(0, targets.findIndex((target) => target.id === current.id));
    const next = targets[(index + direction + targets.length) % targets.length];

    const debugRoute = new URLSearchParams(window.location.search).get('debugUnlockZeroRoute');

    if (next.evolutionId && next.evolutionId === debugRoute) {
      this.saveData = { ...(this.saveData ?? {}), currentHomeDino: next.dinoId, currentHomeEvolutionId: next.evolutionId };
    } else if (next.evolutionId && this.saveManager?.setHomeEvolution) {
      this.saveData = this.saveManager.setHomeEvolution(next.evolutionId);
    } else if (this.saveManager?.setHomeDino) {
      this.saveData = this.saveManager.setHomeDino(next.dinoId);
    } else {
      this.saveData = { ...(this.saveData ?? {}), currentHomeDino: next.dinoId, currentHomeEvolutionId: next.evolutionId };
    }
    this.setSaveData(this.saveData, this.gameState);
  }

  handleDeployTap() {
    playPressFeedback(this.deployFrame, {
      width: DEPLOY.width,
      height: DEPLOY.height,
      scale: 0.985,
      alpha: 0.72,
      duration: 110,
    });
    this.deployTitle.alpha = 0.82;
    this.deploySub.alpha = 0.82;
    setTimeout(() => {
      this.deployTitle.alpha = 1;
      this.deploySub.alpha = 1;
      this.onDeploy?.();
    }, 80);
  }

  handleDinoSwitchTap(direction) {
    const target = direction < 0 ? this.switchLeft : this.switchRight;

    if (target.visible) {
      playPressFeedback(target, { width: 34, height: 34, scale: 0.92, alpha: 0.76, duration: 100 });
    } else {
      playPressFeedback(this.switchFallback, { width: 34, height: 34, scale: 0.96, alpha: 0.78, duration: 100 });
    }

    this.playUiFeedback('ui_click');
    this.cycleHomeDino(direction);
  }

  claimDailyMission(row) {
    const mission = row?.mission;

    if (!mission) {
      return;
    }

    const result = this.saveManager?.claimDailyMission?.(mission.id) ?? false;

    if (result) {
      this.saveData = this.saveManager.getData();
      this.noticeText.text = result.rewardText;
    } else {
      this.noticeText.text = '受け取り済み';
    }
    this.setSaveData(this.saveData, this.gameState);
  }

  claimAllDailyMissions() {
    const claimableRows = this.dailyRows.filter((row) => {
      const mission = row?.mission;
      return mission && !mission.claimed && row.status.text === '達成';
    });

    if (claimableRows.length <= 0) {
      this.noticeText.text = '受け取れるデイリーはありません';
      return;
    }

    let claimedCount = 0;
    claimableRows.forEach((row) => {
      const result = this.saveManager?.claimDailyMission?.(row.mission.id) ?? false;
      if (result) {
        claimedCount += 1;
      }
    });

    this.saveData = this.saveManager?.getData?.() ?? this.saveData;
    this.noticeText.text = claimedCount > 0 ? `デイリー ${claimedCount}件を受け取りました` : '受け取り済み';
    this.setSaveData(this.saveData, this.gameState);
  }

  openTitleSelect() {
    this.playUiFeedback('ui_select');
    this.titleSelectUi.show(this.saveManager?.getData?.() ?? this.saveData);
  }

  playUiFeedback(id = 'ui_click') {
    this.onUiFeedback?.(id);
  }

  loadAssets() {
    const requests = [
      ['homeBackground', ASSET_KEYS.homeUi?.homeBackground, HOME_ASSET_PATHS.homeBackground],
      ['evolutionZeroLogo', ASSET_KEYS.homeUi?.evolutionZeroLogo, HOME_ASSET_PATHS.evolutionZeroLogo],
      ['resourcePanel', ASSET_KEYS.homeUi?.resourcePanel, HOME_ASSET_PATHS.resourcePanel],
      ['homeInfoPanelCommon', ASSET_KEYS.homeUi?.homeInfoPanelCommon, HOME_ASSET_PATHS.homeInfoPanelCommon],
      ['homeInfoPanelGlow', ASSET_KEYS.homeUi?.homeInfoPanelGlow, HOME_ASSET_PATHS.homeInfoPanelGlow],
      ['homeInfoTabSelected', ASSET_KEYS.homeUi?.homeInfoTabSelected, HOME_ASSET_PATHS.homeInfoTabSelected],
      ['homeInfoTabInactive', ASSET_KEYS.homeUi?.homeInfoTabInactive, HOME_ASSET_PATHS.homeInfoTabInactive],
      ['iconDnaRed', ASSET_KEYS.homeUi?.iconDnaRed, HOME_ASSET_PATHS.iconDnaRed],
      ['iconResearchBeakerBlue', ASSET_KEYS.homeUi?.iconResearchBeakerBlue, HOME_ASSET_PATHS.iconResearchBeakerBlue],
      ['homeDinoSwitchLeft', ASSET_KEYS.homeUi?.homeDinoSwitchLeft, HOME_ASSET_PATHS.homeDinoSwitchLeft],
      ['homeDinoSwitchRight', ASSET_KEYS.homeUi?.homeDinoSwitchRight, HOME_ASSET_PATHS.homeDinoSwitchRight],
      ['homeDinoSelector', ASSET_KEYS.homeUi?.homeDinoSelector, HOME_ASSET_PATHS.homeDinoSelector],
      ['sortieButtonFrame', ASSET_KEYS.homeUi?.sortieButtonFrame, HOME_ASSET_PATHS.sortieButtonFrame],
      ['sortieButtonLeftIcon', ASSET_KEYS.homeUi?.sortieButtonLeftIcon, HOME_ASSET_PATHS.sortieButtonLeftIcon],
      ['sortieButtonGlow', ASSET_KEYS.homeUi?.sortieButtonGlow, HOME_ASSET_PATHS.sortieButtonGlow],
      ['newsEntryButton', ASSET_KEYS.homeUi?.newsEntryButton, HOME_ASSET_PATHS.newsEntryButton],
      ['newsPanel', ASSET_KEYS.homeUi?.newsPanel, HOME_ASSET_PATHS.newsPanel],
      ['newsListCard', ASSET_KEYS.homeUi?.newsListCard, HOME_ASSET_PATHS.newsListCard],
      ['newsListCardUnread', ASSET_KEYS.homeUi?.newsListCardUnread, HOME_ASSET_PATHS.newsListCardUnread],
      ['newsDetailPanel', ASSET_KEYS.homeUi?.newsDetailPanel, HOME_ASSET_PATHS.newsDetailPanel],
      ['newsButtonClose', ASSET_KEYS.homeUi?.newsButtonClose, HOME_ASSET_PATHS.newsButtonClose],
      ['newsButtonBack', ASSET_KEYS.homeUi?.newsButtonBack, HOME_ASSET_PATHS.newsButtonBack],
      ['newsBadgeUpdate', ASSET_KEYS.homeUi?.newsBadgeUpdate, HOME_ASSET_PATHS.newsBadgeUpdate],
      ['newsBadgeNormal', ASSET_KEYS.homeUi?.newsBadgeNormal, HOME_ASSET_PATHS.newsBadgeNormal],
      ['companionHomeFrame', ASSET_KEYS.companionUi?.homeFrame, HOME_ASSET_PATHS.companionHomeFrame],
      ['companionSelectPanel', ASSET_KEYS.companionUi?.selectPanel, HOME_ASSET_PATHS.companionSelectPanel],
      ['companionSelectCard', ASSET_KEYS.companionUi?.selectCard, HOME_ASSET_PATHS.companionSelectCard],
      ['companionSelectButton', ASSET_KEYS.companionUi?.selectButton, HOME_ASSET_PATHS.companionSelectButton],
      ['companionIcon', ASSET_KEYS.companions?.raptorlingIcon, null],
      ...COMPANION_DINOS.map((companion) => [
        `companionIcon:${companion.id}`,
        companion.iconAssetKey,
        null,
      ]),
      ['companionEgg', ASSET_KEYS.companions?.eggIcon, null],
      ...Object.entries(HOME_ASSET_PATHS.titleFrames).map(([id, path]) => [
        `titleFrame:${id}`,
        ASSET_KEYS.titleFrames?.[id],
        path,
      ]),
      ...Object.entries(ASSET_KEYS.dinoSelectHero ?? {}).map(([id, key]) => [
        `dino:${id}`,
        key,
        HOME_ASSET_PATHS.dinoHero[id],
      ]),
      ...Object.entries(ASSET_KEYS.evolutionHeroes ?? {})
        .filter(([id]) => id !== 'zeroUnknownSilhouette')
        .map(([id, key]) => [
          `evolution:${key.split('.').pop()}`,
          key,
          null,
        ]),
    ];

    requests.forEach(([name, key, path]) => {
      this.loadTexture(key, path).then((texture) => {
        if (texture) {
          this.textures.set(name, texture);
          this.setSaveData(this.saveData, this.gameState);
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

  applyTextures(dinoId, evolutionId = null) {
    this.applySprite(this.homeBackground, this.textures.get('homeBackground'), HERO, 0.92);
    this.applySprite(this.logoSprite, this.textures.get('evolutionZeroLogo'), { x: 12, y: 13, width: 138, height: 68 }, 0.96);
    this.logoFallback.visible = !this.logoSprite.visible;
    this.applySprite(this.resourcePanel, this.textures.get('resourcePanel'), RESOURCE_PANEL, 0.92);
    this.applySprite(this.infoPanel, this.textures.get('homeInfoPanelCommon'), INFO_PANEL, 0.94);
    this.applySprite(this.infoPanelGlow, this.textures.get('homeInfoPanelGlow'), {
      x: INFO_PANEL.x + 34,
      y: INFO_PANEL.y + INFO_PANEL.height - 22,
      width: INFO_PANEL.width - 68,
      height: 14,
    }, 0.5);
    this.infoPanelGlow.visible = false;
    this.infoTabButtons.forEach(({ selectedSprite, inactiveSprite }) => {
      this.applySprite(selectedSprite, this.textures.get('homeInfoTabSelected'), { x: 0, y: 0, width: INFO_TAB.width, height: INFO_TAB.height }, 0.96);
      this.applySprite(inactiveSprite, this.textures.get('homeInfoTabInactive'), { x: 0, y: 0, width: INFO_TAB.width, height: INFO_TAB.height }, 0.88);
    });
    this.applySprite(this.deployGlow, this.textures.get('sortieButtonGlow'), {
      x: DEPLOY.x + 64,
      y: DEPLOY.y + 48,
      width: DEPLOY.width - 90,
      height: 14,
    }, 0.66);
    this.applySprite(this.deployFrame, this.textures.get('sortieButtonFrame'), DEPLOY, 0.92);
    this.applySprite(this.deployLeftIcon, this.textures.get('sortieButtonLeftIcon'), {
      x: DEPLOY.x + 14,
      y: DEPLOY.y + 8,
      width: 50,
      height: 50,
    }, 0.96);
    this.resourceIcons.forEach(({ item, sprite }) => {
      this.applySprite(sprite, this.textures.get(item.iconName), { x: item.iconX - 10, y: 43, width: 20, height: 20 }, 0.95);
    });
    this.applySprite(this.selectorPlate, this.textures.get('homeDinoSelector'), { x: SELECTOR.pillX, y: SELECTOR.y, width: 138, height: 28 }, 0.9);
    this.applySprite(this.newsEntryFrame, this.textures.get('newsEntryButton'), { x: 204, y: 94, width: 172, height: 44 }, 0.96);
    this.newsEntryFallback.visible = !this.newsEntryFrame.visible;
    this.applySprite(this.switchLeft, this.textures.get('homeDinoSwitchLeft'), { x: SELECTOR.leftX, y: SELECTOR.y - 2, width: 34, height: 34 }, 0.9);
    this.applySprite(this.switchRight, this.textures.get('homeDinoSwitchRight'), { x: SELECTOR.rightX, y: SELECTOR.y - 2, width: 34, height: 34 }, 0.9);

    const branch = evolutionId ? getEvolutionBranchById(evolutionId) : null;
    const evolutionKey = branch
      ? `${branch.dinoId}${branch.tag[0]?.toUpperCase()}${branch.tag.slice(1)}`
      : null;
    const evolutionTexture = evolutionKey ? this.textures.get(`evolution:${evolutionKey}`) : null;
    const dinoTexture = evolutionTexture ?? this.textures.get(`dino:${dinoId}`) ?? null;
    const profile = HOME_DINO_PROFILES[dinoId] ?? HOME_DINO_PROFILES.velociraptor;

    this.heroDino.texture = dinoTexture ?? Texture.EMPTY;
    this.heroDino.visible = !!dinoTexture;
    if (dinoTexture) {
      this.heroDino.anchor.set(0.5);
      this.heroDino.position.set(this.width / 2, profile.y);
      this.fitSpriteContain(this.heroDino, profile.width, profile.height);
    }
  }

  fitSpriteContain(sprite, maxWidth, maxHeight) {
    const sourceWidth = sprite.texture?.width || maxWidth;
    const sourceHeight = sprite.texture?.height || maxHeight;
    const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);
    sprite.width = sourceWidth * scale;
    sprite.height = sourceHeight * scale;
  }

  applySprite(sprite, texture, rect, alpha = 1) {
    sprite.texture = texture ?? Texture.EMPTY;
    sprite.visible = !!texture;
    sprite.position.set(rect.x, rect.y);
    sprite.width = rect.width;
    sprite.height = rect.height;
    sprite.alpha = alpha;
  }

  handleNav(id) {
    if (id === 'home') {
      this.noticeText.text = '';
      return;
    }

    if (id === 'research') {
      this.onResearch?.();
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

  drawStatic() {
    drawScreenBackground(this.background, this.width, this.height, UI_COLORS.dna);
    this.drawSwitchHitAreas();

    this.logoFallback.position.set(22, 24);
    this.logoFallback.style.lineHeight = 20;
    this.resourceTexts.forEach(({ item, label, value }) => {
      label.anchor.set(0.5, 0);
      value.anchor.set(0.5, 0);
      label.position.set(item.textX, 31);
      value.position.set(item.textX, 48);
      value.style.fill = item.id === 'dna' ? '#fff0b4' : item.id === 'researchPt' ? '#d7fff2' : '#ffffff';
    });

    this.dinoName.anchor.set(0.5, 0);
    this.dinoName.position.set(this.width / 2, 344);
    this.dinoLine.anchor.set(0.5, 0);
    this.dinoLine.style.align = 'center';
    this.dinoLine.position.set(this.width / 2, 370);
    this.homeDinoHint.anchor.set(0.5, 0);
    this.homeDinoHint.style.align = 'center';
    this.homeDinoHint.position.set(this.width / 2, SELECTOR.y + 8);
    this.newsEntryText.style.dropShadow = true;
    this.newsEntryText.style.dropShadowColor = '#001014';
    this.newsEntryText.style.dropShadowBlur = 3;
    this.newsEntryText.anchor.set(0.5);
    this.newsEntryText.position.set(284, 120);

    this.deployTitle.anchor.set(0.5);
    this.deployTitle.position.set(this.width / 2 + 16, DEPLOY.y + 25);
    this.deploySub.anchor.set(0.5);
    this.deploySub.position.set(this.width / 2 + 16, DEPLOY.y + 48);

    this.infoTabButtons.forEach(({ view, text }, index) => {
      view.position.set(INFO_TAB.x + index * (INFO_TAB.width + INFO_TAB.gap), INFO_TAB.y);
      text.anchor.set(0.5);
      text.position.set(INFO_TAB.width / 2, INFO_TAB.height / 2 + 1);
    });

    this.unlockTitle.position.set(UNLOCK_CONTENT.titleX, UNLOCK_CONTENT.titleY);
    this.unlockRows.forEach(({ label, value }, index) => {
      const y = UNLOCK_CONTENT.rowStartY + index * UNLOCK_CONTENT.rowGap;

      label.position.set(UNLOCK_CONTENT.labelX, y);
      label.style.fontSize = 11;
      value.anchor.set(1, 0);
      value.position.set(UNLOCK_CONTENT.valueX, y);
      value.style.fontSize = 12;
    });

    this.recordTitle.position.set(RECORD_CONTENT.titleX, RECORD_CONTENT.titleY);
    this.recordRows.forEach(({ label, value }, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = RECORD_CONTENT.labelX + col * RECORD_CONTENT.colGap;
      const y = RECORD_CONTENT.rowStartY + row * RECORD_CONTENT.rowGap;

      label.position.set(x, y);
      label.style.fontSize = 9.5;
      value.position.set(x, y + 16);
      value.style.fontSize = 13;
    });

    this.dailyTitle.position.set(DAILY_CONTENT.titleX, DAILY_CONTENT.titleY);
    this.dailyClaimAllButton.view.position.set(INFO_PANEL.x + INFO_PANEL.width - 92, INFO_PANEL.y + 12);
    this.dailyRows.forEach(({ label, status, reward, button }, index) => {
      const y = DAILY_CONTENT.rowStartY + index * DAILY_CONTENT.rowGap;

      label.position.set(DAILY_CONTENT.labelX, y);
      label.style.fontSize = 10.5;
      label.style.lineHeight = 13;
      label.style.wordWrapWidth = 156;
      status.anchor.set(1, 0);
      status.position.set(DAILY_CONTENT.statusX, y);
      status.style.fontSize = 9.5;
      reward.anchor.set(1, 0);
      reward.position.set(DAILY_CONTENT.rewardX, y);
      reward.style.fontSize = 9.5;
      button.view.position.set(DAILY_CONTENT.buttonX, y - 7);
    });

    this.noticeText.anchor.set(0.5, 0);
    this.noticeText.position.set(this.width / 2, 734);
  }

  drawDynamic(dino) {
    this.panelGraphics.clear();
    this.iconGraphics.clear();
    this.heroFallback.clear();
    this.switchFallback.clear();
    this.drawHomeInfoTabs();

    this.panelGraphics
      .rect(HERO.x, HERO.y, HERO.width, HERO.height)
      .fill({ color: 0x000000, alpha: this.homeBackground.visible ? 0.1 : 0 })
      .roundRect(54, 336, 282, 56, 14)
      .fill({ color: 0xf3ffff, alpha: 0.14 })
      .stroke({ color: 0xffffff, width: 1.1, alpha: 0.24 })
      .ellipse(this.width / 2, 408, 120, 18)
      .fill({ color: 0x000000, alpha: 0.32 })
      .ellipse(this.width / 2, 407, 78, 7)
      .fill({ color: dino.accentColor, alpha: 0.08 });

    if (!this.resourcePanel.visible) {
      this.drawPanel(this.panelGraphics, RESOURCE_PANEL.x, RESOURCE_PANEL.y, RESOURCE_PANEL.width, RESOURCE_PANEL.height, UI_COLORS.dna, 0.82);
    }
    if (!this.infoPanel.visible) {
      this.drawPanel(this.panelGraphics, INFO_PANEL.x, INFO_PANEL.y, INFO_PANEL.width, INFO_PANEL.height, UI_COLORS.dna, 0.82);
    }
    if (!this.deployFrame.visible) {
      this.drawPanel(this.panelGraphics, DEPLOY.x, DEPLOY.y, DEPLOY.width, DEPLOY.height, UI_COLORS.gold, 0.92);
    }
    if (!this.selectorPlate.visible) {
      this.drawPanel(this.switchFallback, SELECTOR.pillX, SELECTOR.y, 138, 28, UI_COLORS.dna, 0.74);
    }
    if (!this.newsEntryFrame.visible) {
      this.newsEntryFallback
        .clear()
        .roundRect(204, 94, 172, 44, 9)
        .fill({ color: 0x061012, alpha: 0.82 })
        .stroke({ color: UI_COLORS.dna, width: 1.1, alpha: 0.66 });
    }
    if (!this.switchLeft.visible) {
      this.drawSwitchFallback(this.switchFallback, SELECTOR.leftX, SELECTOR.y - 2, -1);
    }
    if (!this.switchRight.visible) {
      this.drawSwitchFallback(this.switchFallback, SELECTOR.rightX, SELECTOR.y - 2, 1);
    }

    this.drawIcons();

    if (!this.heroDino.visible) {
      this.drawDinoFallback(dino, this.heroFallback, this.width / 2, 280, 1.12);
    }
  }

  drawIcons() {
    RESOURCE_ITEMS.forEach((item, index) => {
      if (this.resourceIcons[index]?.sprite.visible) {
        return;
      }
      this.iconGraphics
        .circle(item.iconX, 54, 4.5)
        .fill({ color: item.color, alpha: 0.24 })
        .stroke({ color: item.color, width: 1.2, alpha: 0.75 });
    });

    if (this.activeHomeInfoTab === 'unlock') {
      UNLOCK_STATUS_ITEMS.forEach((item, index) => {
      const y = UNLOCK_CONTENT.rowStartY + index * UNLOCK_CONTENT.rowGap + 5;

      this.iconGraphics
        .circle(UNLOCK_CONTENT.iconX, y, 5)
        .fill({ color: item.color, alpha: 0.2 })
        .stroke({ color: item.color, width: 1.2, alpha: 0.72 });
      });
    }

    if (this.activeHomeInfoTab === 'record') {
      RECORD_ITEMS.forEach((item, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = RECORD_CONTENT.iconX + col * RECORD_CONTENT.colGap;
      const y = RECORD_CONTENT.rowStartY + 8 + row * RECORD_CONTENT.rowGap;

      this.iconGraphics
        .circle(x, y, 4)
        .fill({ color: item.color, alpha: 0.18 })
        .stroke({ color: item.color, width: 1, alpha: 0.62 });
      });
    }

    if (this.activeHomeInfoTab === 'daily') {
      this.dailyRows.forEach((row, index) => {
      const complete = row.status.text === '達成' || row.status.text === '受取済み';
      const y = DAILY_CONTENT.rowStartY + 5 + index * DAILY_CONTENT.rowGap;

      this.iconGraphics
        .circle(DAILY_CONTENT.iconX, y, 5)
        .fill({ color: complete ? UI_COLORS.green : 0x172226, alpha: 0.9 })
        .stroke({ color: complete ? UI_COLORS.green : UI_COLORS.gold, width: 1.2, alpha: 0.72 });
      if (complete) {
        this.iconGraphics
          .moveTo(DAILY_CONTENT.iconX - 3, y)
          .lineTo(DAILY_CONTENT.iconX, y + 3)
          .lineTo(DAILY_CONTENT.iconX + 5, y - 4)
          .stroke({ color: 0x071015, width: 1.8, alpha: 0.95 });
      }
      });
    }

    if (!this.deployLeftIcon.visible) {
      this.iconGraphics
        .circle(82, DEPLOY.y + 33, 21)
        .fill({ color: 0x211504, alpha: 0.82 })
        .stroke({ color: UI_COLORS.gold, width: 1.8, alpha: 0.86 })
        .poly([75, DEPLOY.y + 43, 88, DEPLOY.y + 25, 98, DEPLOY.y + 43])
        .fill({ color: UI_COLORS.gold, alpha: 0.84 });
    }
  }

  createNewsModal() {
    const view = new Container();
    const dim = new Graphics();
    const panelFallback = new Graphics();
    const panelSprite = new Sprite(Texture.EMPTY);
    const detailSprite = new Sprite(Texture.EMPTY);
    const closeSprite = new Sprite(Texture.EMPTY);
    const backSprite = new Sprite(Texture.EMPTY);
    const detailBodyMask = new Graphics();
    const detailBodyHit = new Graphics();
    const title = this.createText('お知らせ', 22, '#f4f7f5', 220);
    const subtitle = this.createText('アップデート情報', 10, '#7cf7d4', 210);
    const close = this.createText('閉じる', 12, '#ffd36b', 80);
    const back = this.createText('一覧へ', 12, '#7cf7d4', 80);
    const cards = UPDATE_NEWS.slice(0, 5).map((item) => ({
      item,
      view: new Container(),
      bg: new Sprite(Texture.EMPTY),
      fallback: new Graphics(),
      badge: new Sprite(Texture.EMPTY),
      date: this.createText(item.date, 9, '#8da49e', 90),
      title: this.createText(item.title, 13, '#ffffff', 198),
      category: this.createText(item.category, 9, item.isImportant ? '#ffd36b' : '#7cf7d4', 72),
    }));
    const detailTitle = this.createText('', 16, '#ffffff', 266);
    const detailDate = this.createText('', 10, '#8da49e', 160);
    const detailBody = this.createText('', 12, '#d7fff2', 268);

    view.visible = false;
    view.eventMode = 'static';
    view.sortableChildren = true;
    dim.rect(0, 0, this.width, this.height).fill({ color: 0x000000, alpha: 0.68 });
    dim.eventMode = 'static';
    dim.cursor = 'default';
    dim.on('pointertap', () => this.closeNewsModal());
    panelFallback.eventMode = 'static';
    panelFallback.cursor = 'default';
    panelFallback.on('pointertap', () => {});
    panelSprite.position.set(18, 86);
    panelSprite.width = 354;
    panelSprite.height = 610;
    panelSprite.eventMode = 'static';
    panelSprite.cursor = 'default';
    panelSprite.on('pointertap', () => {});
    panelSprite.visible = false;
    detailSprite.position.set(34, 252);
    detailSprite.width = 322;
    detailSprite.height = 390;
    detailSprite.visible = false;
    closeSprite.anchor.set(0.5);
    closeSprite.position.set(326, 154);
    closeSprite.width = 42;
    closeSprite.height = 34;
    closeSprite.eventMode = 'static';
    closeSprite.cursor = 'pointer';
    closeSprite.on('pointertap', () => this.closeNewsModal());
    backSprite.anchor.set(0.5);
    backSprite.position.set(86, 154);
    backSprite.width = 42;
    backSprite.height = 34;
    backSprite.eventMode = 'static';
    backSprite.cursor = 'pointer';
    backSprite.on('pointertap', () => this.showNewsList());
    title.anchor.set(0.5, 0);
    title.position.set(this.width / 2, 118);
    subtitle.anchor.set(0.5, 0);
    subtitle.position.set(this.width / 2, 150);
    close.anchor.set(0.5, 0);
    close.position.set(326, 162);
    close.eventMode = 'static';
    close.cursor = 'pointer';
    close.on('pointertap', () => this.closeNewsModal());
    back.anchor.set(0.5, 0);
    back.position.set(86, 162);
    back.eventMode = 'static';
    back.cursor = 'pointer';
    back.on('pointertap', () => this.showNewsList());
    cards.forEach((card, index) => {
      const y = 192 + index * 78;
      card.view.position.set(34, y);
      card.view.eventMode = 'static';
      card.view.cursor = 'pointer';
      card.view.on('pointertap', () => this.showNewsDetail(card.item));
      card.bg.width = 322;
      card.bg.height = 72;
      card.date.position.set(18, 13);
      card.title.position.set(18, 31);
      card.title.style.lineHeight = 16;
      card.badge.position.set(218, 8);
      card.badge.width = 92;
      card.badge.height = 30;
      card.category.anchor.set(1, 0);
      card.category.position.set(294, 13);
      card.view.addChild(card.fallback, card.bg, card.badge, card.date, card.title, card.category);
    });
    detailTitle.position.set(50, 182);
    detailDate.position.set(52, 214);
    detailBody.position.set(50, 272);
    detailBody.style.lineHeight = 19;
    detailBody.style.breakWords = true;
    detailBody.mask = detailBodyMask;
    detailBodyMask.rect(48, 268, 292, 326).fill({ color: 0xffffff, alpha: 1 });
    detailBodyHit.rect(46, 264, 296, 334).fill({ color: 0x000000, alpha: 0.001 });
    detailBodyHit.eventMode = 'static';
    detailBodyHit.cursor = 'grab';
    detailBodyHit.visible = false;
    detailBodyHit.on('pointerdown', (event) => {
      this.newsDetailDrag = {
        startY: event.global.y,
        startScrollY: this.newsDetailScrollY ?? 0,
      };
    });
    detailBodyHit.on('pointermove', (event) => {
      if (!this.newsDetailDrag) {
        return;
      }
      this.updateNewsDetailScroll(this.newsDetailDrag.startScrollY + this.newsDetailDrag.startY - event.global.y);
    });
    detailBodyHit.on('pointerup', () => {
      this.newsDetailDrag = null;
    });
    detailBodyHit.on('pointerupoutside', () => {
      this.newsDetailDrag = null;
    });
    view.addChild(
      dim,
      panelFallback,
      panelSprite,
      closeSprite,
      backSprite,
      title,
      subtitle,
      close,
      back,
      ...cards.map((card) => card.view),
      detailSprite,
      detailTitle,
      detailDate,
      detailBodyMask,
      detailBody,
      detailBodyHit,
    );

    return {
      view,
      dim,
      panelFallback,
      panelSprite,
      detailSprite,
      closeSprite,
      backSprite,
      detailBodyMask,
      detailBodyHit,
      title,
      subtitle,
      close,
      back,
      cards,
      detailTitle,
      detailDate,
      detailBody,
      mode: 'list',
    };
  }

  createCompanionModal() {
    const modal = {
      view: new Container(),
      overlay: new Graphics(),
      panelFrame: new Sprite(Texture.EMPTY),
      panel: new Graphics(),
      title: this.createText('お供恐竜', 18, '#fff0b4', 260),
      body: this.createText('', 11, '#d7fff2', 286),
      selectedDetail: this.createText('', 9.5, '#cbe0da', 286),
      rows: [],
      pageText: this.createText('', 10, '#c8fbff', 84),
      closeText: this.createText('範囲外で閉じる', 9, '#8da49e', 160),
      clearButton: {
        view: new Container(),
        bg: new Graphics(),
        text: this.createText('セット解除', 11, '#e7fff6', 86),
      },
    };

    modal.view.visible = false;
    modal.overlay
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x000000, alpha: 0.55 });
    modal.overlay.eventMode = 'static';
    modal.overlay.on('pointertap', () => this.closeCompanionModal());
    modal.panel.position.set(34, 206);
    modal.panel.eventMode = 'static';
    modal.panel.on('pointertap', () => {});
    modal.title.anchor.set(0.5, 0);
    modal.title.position.set(this.width / 2, 222);
    modal.body.position.set(56, 252);
    modal.body.style.lineHeight = 15;
    modal.selectedDetail.position.set(56, 278);
    modal.selectedDetail.style.lineHeight = 13;
    modal.closeText.anchor.set(0.5);
    modal.closeText.position.set(this.width / 2, 624);
    modal.pageText.anchor.set(0.5);
    modal.pageText.position.set(this.width / 2, 566);
    modal.panelFrame.position.set(34, 206);
    modal.clearButton.view.position.set(252, 572);
    modal.clearButton.view.hitArea = new Rectangle(0, 0, 96, 32);
    modal.clearButton.view.eventMode = 'static';
    modal.clearButton.view.cursor = 'pointer';
    modal.clearButton.view.on('pointertap', () => this.clearSelectedCompanion());
    modal.clearButton.text.anchor.set(0.5);
    modal.clearButton.text.position.set(48, 16);
    modal.clearButton.view.addChild(modal.clearButton.bg, modal.clearButton.text);
    modal.view.addChild(modal.overlay, modal.panelFrame, modal.panel, modal.title, modal.body, modal.selectedDetail, modal.closeText, modal.pageText, modal.clearButton.view);

    for (let index = 0; index < 4; index += 1) {
      const row = {
        view: new Container(),
        frame: new Sprite(Texture.EMPTY),
        bg: new Graphics(),
        icon: new Sprite(Texture.EMPTY),
        name: this.createText('', 12, '#ffffff', 140),
        detail: this.createText('', 8.5, '#cbe0da', 168),
        synergy: this.createText('', 8.2, '#7cf7d4', 168),
        actionFrame: new Sprite(Texture.EMPTY),
        action: this.createText('', 10, '#071015', 62),
        companionId: null,
      };
      row.view.position.set(52, 322 + index * 58);
      row.view.eventMode = 'static';
      row.view.cursor = 'pointer';
      row.view.on('pointertap', () => this.handleCompanionRow(row));
      row.icon.anchor.set(0.5);
      row.icon.position.set(20, 24);
      row.icon.width = 34;
      row.icon.height = 34;
      row.name.position.set(44, 8);
      row.detail.position.set(44, 25);
      row.synergy.position.set(44, 40);
      row.action.anchor.set(0.5);
      row.action.position.set(246, 29);
      row.actionFrame.position.set(216, 14);
      row.actionFrame.width = 60;
      row.actionFrame.height = 30;
      row.view.addChild(row.frame, row.bg, row.icon, row.name, row.detail, row.synergy, row.actionFrame, row.action);
      modal.rows.push(row);
      modal.view.addChild(row.view);
    }

    modal.upgradeButton = {
      view: new Container(),
      bg: new Graphics(),
      text: this.createText('強化', 12, '#071015', 64),
    };
    modal.upgradeButton.view.position.set(224, 572);
    modal.upgradeButton.text.anchor.set(0.5);
    modal.upgradeButton.text.position.set(42, 18);
    modal.upgradeButton.view.eventMode = 'static';
    modal.upgradeButton.view.cursor = 'pointer';
    modal.upgradeButton.view.on('pointertap', () => this.upgradeSelectedCompanion());
    modal.upgradeButton.view.addChild(modal.upgradeButton.bg, modal.upgradeButton.text);
    modal.upgradeButton.view.visible = false;
    modal.upgradeButton.view.eventMode = 'none';
    modal.view.addChild(modal.upgradeButton.view);

    modal.prevButton = this.createCompanionPageButton('前', 52, 572, () => this.changeCompanionModalPage(-1));
    modal.nextButton = this.createCompanionPageButton('次', 128, 572, () => this.changeCompanionModalPage(1));
    modal.view.addChild(modal.prevButton.view, modal.nextButton.view);

    return modal;
  }

  createCompanionPageButton(label, x, y, onTap) {
    const button = {
      view: new Container(),
      bg: new Graphics(),
      text: this.createText(label, 11, '#e7fff6', 42),
    };
    button.view.position.set(x, y);
    button.view.eventMode = 'static';
    button.view.cursor = 'pointer';
    button.view.on('pointertap', onTap);
    button.text.anchor.set(0.5);
    button.text.position.set(28, 16);
    button.view.addChild(button.bg, button.text);
    return button;
  }

  openCompanionModal() {
    const owned = this.saveManager?.getCompanionState?.().ownedIds ?? [];
    if (owned.length <= 0) {
      return;
    }
    this.playUiFeedback('ui_select');
    this.companionModalPage = 0;
    this.companionModal.view.visible = true;
    this.renderCompanionModal();
  }

  closeCompanionModal() {
    this.companionModal.view.visible = false;
  }

  renderCompanionModal() {
    const data = this.saveManager?.getData?.() ?? this.saveData ?? {};
    const state = data.companion ?? {};
    const ownedIds = new Set(state.ownedIds ?? []);
    const ownedCompanions = COMPANION_DINOS.filter((companion) => ownedIds.has(companion.id));
    const selected = getCompanionById(state.selectedId);
    const dinoId = this.getHomeDinoId(data);
    const selectedSynergy = selected ? getCompanionSynergySummary(selected.id, dinoId) : null;
    const fallbackIconTexture = this.textures.get('companionIcon') ?? Texture.EMPTY;
    const pageSize = this.companionModal.rows.length;
    const maxPage = Math.max(0, Math.ceil(ownedCompanions.length / pageSize) - 1);
    this.companionModalPage = Math.max(0, Math.min(maxPage, this.companionModalPage));
    const pageStart = this.companionModalPage * pageSize;
    const visibleCompanions = ownedCompanions.slice(pageStart, pageStart + pageSize);
    const panelTexture = this.textures.get('companionSelectPanel');

    this.companionModal.panelFrame.texture = panelTexture ?? Texture.EMPTY;
    this.companionModal.panelFrame.visible = !!panelTexture;
    this.companionModal.panelFrame.width = this.width - 68;
    this.companionModal.panelFrame.height = 430;
    this.companionModal.panelFrame.alpha = 0.96;
    this.companionModal.panel
      .clear()
      .roundRect(0, 0, this.width - 68, 430, 14)
      .fill({ color: 0x021114, alpha: panelTexture ? 0.16 : 0.92 })
      .stroke({ color: 0x35d7ff, width: 1.8, alpha: panelTexture ? 0.16 : 0.74 })
      .roundRect(8, 8, this.width - 84, 414, 11)
      .stroke({ color: 0xffd36b, width: 0.8, alpha: panelTexture ? 0.08 : 0.28 });
    this.companionModal.body.text = ownedCompanions.length > 0
      ? `セット中: ${selected?.displayName ?? 'お供なし'}`
      : '所持しているお供恐竜はありません。';
    this.companionModal.selectedDetail.text = selected
      ? `${COMPANION_TYPES[selected.type]?.label ?? '補助'} / ${COMPANION_UI_DESCRIPTIONS[selected.id] ?? selected.description}\n${formatCompanionSynergyLine(selectedSynergy)}${selectedSynergy?.enabled ? `\n${formatCompanionSynergyDetail(selectedSynergy)}` : ''}`
      : ownedCompanions.length > 0
        ? 'お供を選択すると、次の出撃から一緒に行動します。'
        : '卵を孵化すると、ここでセットできます。';
    this.companionModal.rows.forEach((row, index) => {
      const companion = visibleCompanions[index] ?? null;
      const level = companion ? state.levels?.[companion.id] ?? 1 : 1;
      const isSelected = companion?.id === state.selectedId;
      const accent = companion ? COMPANION_TYPES[companion.type]?.accent ?? 0x7cf7d4 : 0x23434a;
      const synergy = companion ? getCompanionSynergySummary(companion.id, dinoId) : null;

      row.view.visible = !!companion;
      if (!companion) {
        return;
      }
      row.companionId = companion.id;
      const iconTexture = this.textures.get(`companionIcon:${companion.id}`) ?? fallbackIconTexture;
      const cardTexture = this.textures.get('companionSelectCard');
      row.frame.texture = cardTexture ?? Texture.EMPTY;
      row.frame.visible = !!cardTexture;
      row.frame.width = 286;
      row.frame.height = 56;
      row.frame.alpha = isSelected ? 1 : 0.82;
      row.bg
        .clear()
        .roundRect(0, 0, 286, 56, 10)
        .fill({ color: isSelected ? 0x08272f : 0x031216, alpha: cardTexture ? 0.1 : 0.86 })
        .stroke({ color: accent, width: isSelected ? 1.8 : 1, alpha: isSelected ? 0.86 : cardTexture ? 0.18 : 0.44 });
      row.icon.texture = iconTexture;
      row.icon.visible = iconTexture !== Texture.EMPTY;
      row.icon.alpha = 1;
      row.name.text = `${companion.displayName} Lv${level}`;
      row.name.style.fill = '#ffffff';
      row.detail.text = formatCompanionSynergyLine(synergy);
      row.detail.style.fill = '#cbe0da';
      row.synergy.text = formatCompanionSynergyDetail(synergy);
      row.synergy.style.fill = synergy.active ? '#7cf7d4' : '#ffd36b';
      row.actionFrame.texture = this.textures.get('companionSelectButton') ?? Texture.EMPTY;
      row.actionFrame.visible = row.actionFrame.texture !== Texture.EMPTY;
      row.actionFrame.alpha = isSelected ? 1 : 0.8;
      row.action.text = isSelected ? 'セット中' : '選択';
      row.action.style.fontSize = isSelected ? 8.5 : 10;
      row.action.style.fill = '#e7fff6';
      row.action.style.stroke = { color: 0x031216, width: 2 };
    });
    this.companionModal.pageText.text = ownedCompanions.length > pageSize ? `${this.companionModalPage + 1}/${maxPage + 1}` : '';
    this.drawCompanionPageButton(this.companionModal.prevButton, this.companionModalPage > 0);
    this.drawCompanionPageButton(this.companionModal.nextButton, this.companionModalPage < maxPage);
    const clearVisible = ownedCompanions.length > 0 && Boolean(state.selectedId);
    this.companionModal.clearButton.view.visible = clearVisible;
    this.companionModal.clearButton.view.eventMode = clearVisible ? 'static' : 'none';
    this.companionModal.clearButton.bg
      .clear()
      .roundRect(0, 0, 96, 32, 9)
      .fill({ color: 0x08272f, alpha: 0.9 })
      .stroke({ color: 0xffd36b, width: 1, alpha: 0.58 });
    this.companionModal.upgradeButton.view.visible = false;
  }

  drawCompanionPageButton(button, enabled) {
    if (!button) {
      return;
    }

    button.view.visible = enabled;
    button.bg
      .clear()
      .roundRect(0, 0, 56, 32, 9)
      .fill({ color: enabled ? 0x08272f : 0x123035, alpha: enabled ? 0.9 : 0.32 })
      .stroke({ color: 0x35d7ff, width: 1, alpha: enabled ? 0.64 : 0.18 });
    button.text.style.fill = enabled ? '#e7fff6' : '#8da49e';
  }

  changeCompanionModalPage(delta) {
    const state = this.saveManager?.getData?.()?.companion ?? this.saveData?.companion ?? {};
    const owned = state.ownedIds ?? [];
    const pageSize = this.companionModal.rows.length;
    const maxPage = Math.max(0, Math.ceil(owned.length / pageSize) - 1);
    const nextPage = Math.max(0, Math.min(maxPage, this.companionModalPage + delta));

    if (nextPage === this.companionModalPage) {
      return;
    }

    this.companionModalPage = nextPage;
    this.playUiFeedback('ui_select');
    this.renderCompanionModal();
  }

  handleCompanionRow(row) {
    if (!row.companionId) {
      return;
    }

    const companionState = this.saveManager?.getCompanionState?.() ?? {};
    if (!companionState.ownedIds?.includes(row.companionId)) {
      this.noticeText.text = '未所持のお供です。卵から入手できます';
      return;
    }

    const result = this.saveManager?.setSelectedCompanion?.(row.companionId);
    if (result?.success) {
      this.saveManager.markTutorialComplete?.('companionSet');
      this.saveData = result.data;
      this.noticeText.text = 'お供恐竜をセットしました';
      this.setSaveData(result.data, this.gameState);
      this.renderCompanionModal();
    }
  }

  clearSelectedCompanion() {
    const result = this.saveManager?.setSelectedCompanion?.(null);
    if (result?.success) {
      this.saveData = result.data;
      this.noticeText.text = 'お供を外しました';
      this.setSaveData(result.data, this.gameState);
      this.renderCompanionModal();
    }
  }

  upgradeSelectedCompanion() {
    const selectedId = this.saveManager?.getCompanionState?.().selectedId;
    if (!selectedId) {
      return;
    }

    const result = this.saveManager.upgradeCompanion(selectedId);
    this.saveData = result.data;
    this.noticeText.text = result.success ? 'お供恐竜を強化しました' : result.reason === 'insufficient' ? 'DNAが不足しています' : '強化できません';
    this.setSaveData(result.data, this.gameState);
    this.renderCompanionModal();
  }

  handleCompanionGamepadAction(actions) {
    if (actions.cancelPressed || actions.pausePressed) {
      this.closeCompanionModal();
      return true;
    }

    if (actions.leftPressed || actions.previousPressed) {
      this.changeCompanionModalPage(-1);
      return true;
    }

    if (actions.rightPressed || actions.nextPressed) {
      this.changeCompanionModalPage(1);
      return true;
    }

    return true;
  }

  openNewsModal() {
    this.playUiFeedback('ui_select');
    this.newsModal.view.visible = true;
    this.showNewsList();
  }

  closeNewsModal() {
    this.playUiFeedback('ui_click');
    this.newsModal.view.visible = false;
  }

  showNewsList() {
    const modal = this.newsModal;
    modal.mode = 'list';
    modal.subtitle.text = 'アップデート情報';
    modal.back.visible = false;
    modal.backSprite.visible = false;
    modal.detailBodyHit.visible = false;
    modal.detailSprite.visible = false;
    modal.detailTitle.visible = false;
    modal.detailDate.visible = false;
    modal.detailBody.visible = false;
    modal.cards.forEach((card) => {
      const texture = this.textures.get(card.item.isImportant ? 'newsListCardUnread' : 'newsListCard') ?? this.textures.get('newsListCard');
      const badgeTexture = card.item.isImportant ? this.textures.get('newsBadgeUpdate') : null;
      card.bg.texture = texture ?? Texture.EMPTY;
      card.bg.visible = !!texture;
      card.badge.texture = badgeTexture ?? Texture.EMPTY;
      card.badge.visible = !!badgeTexture;
      card.fallback.clear();
      if (!texture) {
        card.fallback.roundRect(0, 0, 322, 72, 10).fill({ color: 0x061012, alpha: 0.9 }).stroke({ color: UI_COLORS.dna, width: 1, alpha: 0.58 });
      }
      card.view.visible = true;
    });
    this.drawNewsPanel();
  }

  showNewsDetail(item) {
    const modal = this.newsModal;
    modal.mode = 'detail';
    modal.subtitle.text = item.category;
    modal.back.visible = true;
    modal.backSprite.visible = true;
    modal.detailBodyHit.visible = true;
    modal.cards.forEach((card) => {
      card.view.visible = false;
    });
    modal.detailTitle.text = item.title;
    modal.detailDate.text = item.date;
    modal.detailBody.text = item.body.join('\n\n');
    this.newsDetailScrollY = 0;
    modal.detailTitle.visible = true;
    modal.detailDate.visible = true;
    modal.detailBody.visible = true;
    modal.detailSprite.visible = false;
    this.updateNewsDetailScroll(0);
    this.drawNewsPanel();
  }

  updateNewsDetailScroll(scrollY = 0) {
    const modal = this.newsModal;
    if (!modal) {
      return;
    }
    const maxScroll = Math.max(0, Math.ceil((modal.detailBody.height || 0) - 318));
    this.newsDetailScrollY = Math.max(0, Math.min(maxScroll, scrollY));
    modal.detailBody.position.set(50, 272 - this.newsDetailScrollY);
  }

  drawNewsPanel() {
    const modal = this.newsModal;
    const texture = this.textures.get(modal.mode === 'detail' ? 'newsDetailPanel' : 'newsPanel');
    modal.panelSprite.texture = texture ?? Texture.EMPTY;
    modal.panelSprite.visible = !!texture;
    modal.closeSprite.texture = this.textures.get('newsButtonClose') ?? Texture.EMPTY;
    modal.closeSprite.visible = false;
    modal.backSprite.texture = this.textures.get('newsButtonBack') ?? Texture.EMPTY;
    modal.backSprite.visible = modal.mode === 'detail' && !!modal.backSprite.texture && modal.backSprite.texture !== Texture.EMPTY;
    modal.close.visible = false;
    modal.back.visible = modal.mode === 'detail' && !modal.backSprite.visible;
    modal.panelFallback.clear();
    if (!texture) {
      modal.panelFallback.roundRect(18, 86, 354, 610, 18).fill({ color: 0x061012, alpha: 0.96 }).stroke({ color: UI_COLORS.dna, width: 1.4, alpha: 0.78 });
    }
  }

  createHomeInfoTabButton(item) {
    const view = new Container();
    const bg = new Graphics();
    const selectedSprite = new Sprite(Texture.EMPTY);
    const inactiveSprite = new Sprite(Texture.EMPTY);
    const text = this.createText(item.label, 11, '#d7fff2', INFO_TAB.width - 12);

    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.on('pointertap', () => this.handleHomeInfoTabTap(item.id, view));
    view.addChild(bg, inactiveSprite, selectedSprite, text);

    return { item, view, bg, selectedSprite, inactiveSprite, text };
  }

  handleHomeInfoTabTap(tabId, view) {
    if (this.activeHomeInfoTab === tabId) {
      return;
    }

    playPressFeedback(view, { width: INFO_TAB.width, height: INFO_TAB.height, scale: 0.96, alpha: 0.78, duration: 100 });
    this.playUiFeedback('ui_click');
    this.activeHomeInfoTab = tabId;
    this.updateHomeInfoTabVisibility();
    this.drawDynamic(getDinoConfig(this.getHomeDisplayTarget(this.saveData ?? {}).dinoId));
  }

  updateHomeInfoTabVisibility() {
    const active = this.activeHomeInfoTab;
    const showDaily = active === 'daily';
    const showRecord = active === 'record';
    const showUnlock = active === 'unlock';

    this.infoPanel.visible = this.hasTexture(this.infoPanel);
    this.infoPanelGlow.visible = false;
    this.dailyTitle.visible = showDaily;
    this.dailyClaimAllButton.view.visible = showDaily;
    this.recordTitle.visible = showRecord;
    this.unlockTitle.visible = showUnlock;
    this.dailyRows.forEach((row) => {
      row.label.visible = showDaily;
      row.status.visible = showDaily;
      row.reward.visible = showDaily;
      row.button.view.visible = showDaily && row.canShowButton;
    });
    this.recordRows.forEach(({ label, value }) => {
      label.visible = showRecord;
      value.visible = showRecord;
    });
    this.unlockRows.forEach(({ label, value }) => {
      label.visible = showUnlock;
      value.visible = showUnlock;
    });
  }

  drawHomeInfoTabs() {
    this.infoTabButtons.forEach(({ item, bg, selectedSprite, inactiveSprite, text }) => {
      const selected = item.id === this.activeHomeInfoTab;
      const hasSelectedTexture = this.hasTexture(selectedSprite);
      const hasInactiveTexture = this.hasTexture(inactiveSprite);

      selectedSprite.visible = selected && hasSelectedTexture;
      inactiveSprite.visible = !selected && hasInactiveTexture;
      bg.clear()
        .roundRect(0, 0, INFO_TAB.width, INFO_TAB.height, 8)
        .fill({ color: selected ? 0x0a2428 : 0x071214, alpha: selected ? 0.96 : 0.78 })
        .stroke({ color: selected ? item.color : UI_COLORS.line, width: selected ? 1.7 : 1.1, alpha: selected ? 0.86 : 0.48 });
      bg.visible = selected ? !hasSelectedTexture : !hasInactiveTexture;
      text.style.fill = selected ? '#ffffff' : '#9fb9b3';
      text.style.fontSize = selected ? 11 : 10.5;
    });
  }

  createDailyButton() {
    const view = new Container();
    const bg = new Graphics();
    const text = this.createText('受取', 9, '#071015', 44);

    text.anchor.set(0.5);
    text.position.set(26, 13);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.on('pointertap', () => {
      playPressFeedback(view, { width: 52, height: 26, scale: 0.94, alpha: 0.78, duration: 110 });
      this.playUiFeedback('ui_confirm');
      const row = this.dailyRows.find((entry) => entry.button.view === view);
      setTimeout(() => this.claimDailyMission(row), 80);
    });
    view.addChild(bg, text);
    this.drawDailyButton(bg, false);

    return { view, bg, text };
  }

  createDailyClaimAllButton() {
    const view = new Container();
    const bg = new Graphics();
    const text = this.createText('一括受取', 8.5, '#071015', 58);

    text.anchor.set(0.5);
    text.position.set(34, 12);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.on('pointertap', () => {
      playPressFeedback(view, { width: 68, height: 24, scale: 0.95, alpha: 0.78, duration: 110 });
      this.playUiFeedback('ui_confirm');
      setTimeout(() => this.claimAllDailyMissions(), 80);
    });
    view.addChild(bg, text);
    this.drawDailyClaimAllButton(bg, false);

    return { view, bg, text };
  }

  drawDailyClaimAllButton(graphics, disabled) {
    graphics
      .clear()
      .roundRect(0, 0, 68, 24, 7)
      .fill({ color: disabled ? 0x182225 : UI_COLORS.gold, alpha: disabled ? 0.78 : 0.92 })
      .stroke({ color: disabled ? UI_COLORS.line : UI_COLORS.gold, width: 1, alpha: 0.78 });
  }

  drawDailyButton(graphics, claimed) {
    graphics
      .clear()
      .roundRect(0, 0, 52, 26, 7)
      .fill({ color: claimed ? 0x182225 : UI_COLORS.gold, alpha: claimed ? 0.82 : 0.92 })
      .stroke({ color: claimed ? UI_COLORS.line : UI_COLORS.gold, width: 1, alpha: 0.78 });
  }

  hasTexture(sprite) {
    return Boolean(sprite.texture && sprite.texture !== Texture.EMPTY);
  }

  drawSwitchFallback(graphics, x, y, direction) {
    graphics
      .roundRect(x, y, 34, 34, 8)
      .fill({ color: 0x061012, alpha: 0.8 })
      .stroke({ color: UI_COLORS.dna, width: 1.2, alpha: 0.58 });

    if (direction < 0) {
      graphics.poly([x + 21, y + 10, x + 12, y + 17, x + 21, y + 24]);
    } else {
      graphics.poly([x + 13, y + 10, x + 22, y + 17, x + 13, y + 24]);
    }
    graphics.fill({ color: UI_COLORS.dna, alpha: 0.92 });
  }

  drawSwitchHitAreas() {
    this.drawSwitchHitArea(this.switchLeftHit, SELECTOR.leftX - 5, SELECTOR.y - 7);
    this.drawSwitchHitArea(this.switchRightHit, SELECTOR.rightX - 5, SELECTOR.y - 7);
  }

  drawSwitchHitArea(graphics, x, y) {
    graphics
      .clear()
      .roundRect(x, y, 44, 44, 10)
      .fill({ color: 0x000000, alpha: 0.001 });
  }

  drawPanel(graphics, x, y, width, height, accent, alpha) {
    graphics
      .roundRect(x, y, width, height, 8)
      .fill({ color: 0x061012, alpha })
      .stroke({ color: accent, width: 1.2, alpha: 0.34 });
  }

  drawDinoFallback(dino, graphics, x, y, scale = 1) {
    graphics
      .ellipse(x, y + 48 * scale, 82 * scale, 17 * scale)
      .fill({ color: 0x000000, alpha: 0.28 })
      .ellipse(x - 4 * scale, y, 70 * scale, 25 * scale)
      .fill({ color: 0x1d2b30, alpha: 0.92 })
      .poly([
        x + 42 * scale, y - 10 * scale,
        x + 116 * scale, y - 43 * scale,
        x + 132 * scale, y - 28 * scale,
        x + 60 * scale, y + 14 * scale,
      ])
      .fill({ color: 0x293b41, alpha: 0.92 })
      .poly([
        x - 58 * scale, y + 8 * scale,
        x - 128 * scale, y + 30 * scale,
        x - 60 * scale, y - 12 * scale,
      ])
      .fill({ color: 0x111a1d, alpha: 0.9 })
      .circle(x + 108 * scale, y - 31 * scale, 4 * scale)
      .fill({ color: dino.accentColor, alpha: 0.9 })
      .moveTo(x - 22 * scale, y + 20 * scale)
      .lineTo(x - 42 * scale, y + 66 * scale)
      .moveTo(x + 18 * scale, y + 22 * scale)
      .lineTo(x + 0 * scale, y + 70 * scale)
      .moveTo(x + 48 * scale, y + 13 * scale)
      .lineTo(x + 78 * scale, y + 60 * scale)
      .stroke({ color: dino.accentColor, width: 4 * scale, alpha: 0.58 });
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
        lineHeight: size + 3,
      },
    });
  }

  formatTime(elapsedTime) {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = Math.floor(elapsedTime % 60);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  formatNumber(value) {
    return Math.floor(value).toLocaleString('ja-JP');
  }
}
