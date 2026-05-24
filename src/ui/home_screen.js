import { Assets, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { ASSET_KEYS } from '../data/asset_manifest.js';
import {
  getDiscoveredEvolutionCount as getSavedEvolutionCount,
  getDiscoveredEvolutionEntries,
  getEvolutionBranchById,
} from '../data/evolution_data.js';
import { getDinoConfig } from '../data/run_config.js';
import { getTitleById, getTitleFrameById } from '../data/reward_titles.js';
import { DAILY_MISSION_COUNT, formatDailyReward, getDailyMissionTemplate } from '../data/daily_missions.js';
import { createBottomNav } from './bottom_nav.js';
import { TitleSelectUi } from './title_select_ui.js';
import { playPressFeedback } from './ui_feedback.js';
import { drawScreenBackground, UI_COLORS, toCssColor } from './ui_theme.js';

const HOME_ASSET_PATHS = {
  homeBackground: 'assets/ui/home/home_background.png',
  evolutionZeroLogo: 'assets/ui/home/evolution_zero_logo.png',
  resourcePanel: 'assets/ui/home/resource_panel.png',
  unlockStatusPanel: 'assets/ui/home/unlock_status_panel.png',
  recordPanel: 'assets/ui/home/record_panel.png',
  dailyMissionPanel: 'assets/ui/home/daily_mission_panel.png',
  iconDnaRed: 'assets/ui/home/icon_dna_red.png',
  iconResearchBeakerBlue: 'assets/ui/home/icon_research_beaker_blue.png',
  homeDinoSwitchLeft: 'assets/ui/home/home_dino_switch_left.png',
  homeDinoSwitchRight: 'assets/ui/home/home_dino_switch_right.png',
  homeDinoSelector: 'assets/ui/home/home_dino_selector.png',
  sortieButtonFrame: 'assets/ui/home/sortie_button_frame.png',
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
  },
  evolutionHero: {
    speed: 'assets/dinos/evolutions/heroes/velociraptor_speed_hero.png',
    hunting: 'assets/dinos/evolutions/heroes/velociraptor_hunting_hero.png',
    attack: 'assets/dinos/evolutions/heroes/velociraptor_attack_hero.png',
  },
};

const HOME_DINO_IDS = ['velociraptor', 'triceratops', 'tyrannosaurus'];
const HOME_BRANCH_ORDER = ['speed', 'hunting', 'attack', 'zero'];

const HOME_DINO_PROFILES = {
  velociraptor: {
    label: 'ヴェロキラプトル',
    shortLabel: 'ラプトル',
    line: '機動型 / 索敵と連撃に適性',
    width: 292,
    height: 206,
    y: 280,
  },
  triceratops: {
    label: 'トリケラトプス',
    shortLabel: 'トリケラ',
    line: '重装型 / 生存と押し返しに適性',
    width: 278,
    height: 198,
    y: 282,
  },
  tyrannosaurus: {
    label: 'ティラノサウルス',
    shortLabel: 'ティラノ',
    line: '強襲型 / 高威力の制圧に適性',
    width: 300,
    height: 212,
    y: 278,
  },
};

const DEFAULT_UNLOCKED_HOME_DINOS = HOME_DINO_IDS;

const RESOURCE_ITEMS = [
  { id: 'dna', label: 'DNA', color: UI_COLORS.danger, iconName: 'iconDnaRed', iconX: 181, textX: 220 },
  { id: 'researchPt', label: '研究Pt', color: UI_COLORS.dna, iconName: 'iconResearchBeakerBlue', iconX: 282, textX: 326 },
];

const UNLOCK_STATUS_ITEMS = [
  { id: 'dinos', label: '恐竜', color: UI_COLORS.dna },
  { id: 'evolutions', label: '進化', color: UI_COLORS.gold },
  { id: 'skills', label: 'スキル', color: UI_COLORS.green },
];

const RECORD_ITEMS = [
  { id: 'bestScore', label: 'スコア', color: UI_COLORS.dna },
  { id: 'bestSurvivalTime', label: '生存', color: UI_COLORS.green },
  { id: 'totalRuns', label: '出撃', color: UI_COLORS.gold },
  { id: 'bestKills', label: '撃破', color: UI_COLORS.danger },
];

const HERO = { x: 0, y: 92, width: 390, height: 342 };
const RESOURCE_PANEL = { x: 150, y: 16, width: 220, height: 68 };
const DEPLOY = { x: 38, y: 430, width: 314, height: 66 };
const UNLOCK_PANEL = { x: 18, y: 502, width: 150, height: 108 };
const RECORD_PANEL = { x: 176, y: 502, width: 196, height: 108 };
const DAILY_PANEL = { x: 18, y: 614, width: 354, height: 130 };
const SELECTOR = { leftX: 86, pillX: 126, rightX: 270, y: 385 };

const UNLOCK_CONTENT = {
  titleX: UNLOCK_PANEL.x + 26,
  titleY: UNLOCK_PANEL.y + 18,
  iconX: UNLOCK_PANEL.x + 26,
  labelX: UNLOCK_PANEL.x + 50,
  valueX: UNLOCK_PANEL.x + UNLOCK_PANEL.width - 22,
  rowStartY: UNLOCK_PANEL.y + 38,
  rowGap: 18,
};

const RECORD_CONTENT = {
  titleX: RECORD_PANEL.x + 24,
  titleY: RECORD_PANEL.y + 18,
  iconX: RECORD_PANEL.x + 22,
  labelX: RECORD_PANEL.x + 34,
  colGap: 82,
  rowStartY: RECORD_PANEL.y + 37,
  rowGap: 24,
};

const DAILY_CONTENT = {
  titleX: DAILY_PANEL.x + 28,
  titleY: DAILY_PANEL.y + 18,
  iconX: DAILY_PANEL.x + 26,
  labelX: DAILY_PANEL.x + 48,
  statusX: DAILY_PANEL.x + 220,
  rewardX: DAILY_PANEL.x + 266,
  buttonX: DAILY_PANEL.x + DAILY_PANEL.width - 70,
  rowStartY: DAILY_PANEL.y + 33,
  rowGap: 29,
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
    this.textures = new Map();

    this.view = new Container();
    this.background = new Graphics();
    this.homeBackground = new Sprite(Texture.EMPTY);
    this.logoSprite = new Sprite(Texture.EMPTY);
    this.logoFallback = this.createText('EVOLUTION\nZERO', 20, '#f4f7f5', 132);
    this.resourcePanel = new Sprite(Texture.EMPTY);
    this.unlockPanel = new Sprite(Texture.EMPTY);
    this.recordPanel = new Sprite(Texture.EMPTY);
    this.dailyPanel = new Sprite(Texture.EMPTY);
    this.heroDino = new Sprite(Texture.EMPTY);
    this.heroFallback = new Graphics();
    this.titleFrameSprite = new Sprite(Texture.EMPTY);
    this.titleFrame = new Graphics();
    this.panelGraphics = new Graphics();
    this.iconGraphics = new Graphics();
    this.deployFrame = new Sprite(Texture.EMPTY);
    this.selectorPlate = new Sprite(Texture.EMPTY);
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
    this.unlockTitle = this.createText('解放', 11, '#7cf7d4', 90);
    this.recordTitle = this.createText('記録', 11, '#7cf7d4', 90);
    this.dailyTitle = this.createText('デイリー', 11, '#7cf7d4', 120);
    this.unlockRows = UNLOCK_STATUS_ITEMS.map((item) => ({
      item,
      label: this.createText(item.label, 10, '#d7fff2', 54),
      value: this.createText('', 10, '#fff0b4', 44),
    }));
    this.recordRows = RECORD_ITEMS.map((item) => ({
      item,
      label: this.createText(item.label, 8, '#cbe0da', 46),
      value: this.createText('', 9, '#ffffff', 58),
    }));
    this.dailyRows = Array.from({ length: DAILY_MISSION_COUNT }, () => {
      const button = this.createDailyButton();

      return {
        mission: null,
        label: this.createText('', 9, '#e7fff6', 112),
        status: this.createText('', 8, '#fff0b4', 68),
        reward: this.createText('', 8, '#7cf7d4', 56),
        button,
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
      this.unlockPanel,
      this.recordPanel,
      this.dailyPanel,
      this.resourcePanel,
      this.deployFrame,
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
      ...this.dailyRows.flatMap((entry) => [entry.label, entry.status, entry.reward, entry.button.view]),
      this.noticeText,
      this.bottomNav.view,
      this.titleSelectUi.view,
    );

    this.drawStatic();
    this.deployFrame.eventMode = 'static';
    this.deployFrame.cursor = 'pointer';
    this.deployFrame.on('pointertap', () => this.handleDeployTap());
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
    this.loadAssets();
    this.setSaveData(this.saveData, this.gameState);
  }

  show() {
    this.setSaveData(this.saveManager?.getData?.() ?? this.saveData, this.gameState);
    this.bottomNav.setActive('home');
    this.view.visible = true;
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
      dinos: '3 / ?',
      evolutions: `${this.getDiscoveredEvolutionCount(data)} / ?`,
      skills: '? / ?',
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
    this.homeDinoHint.text = homeTarget.branch?.evolutionName ?? profile.shortLabel;
    this.unlockRows.forEach(({ item, value }) => {
      value.text = unlockValues[item.id] ?? '? / ?';
    });
    this.recordRows.forEach(({ item, value }) => {
      value.text = recordValues[item.id] ?? '-';
    });
    const dailyMissions = this.saveManager?.getDailyMissions?.() ?? data.dailyMissions ?? { missions: [] };
    this.dailyRows.forEach((row, index) => {
      const mission = dailyMissions.missions?.[index] ?? null;
      const template = getDailyMissionTemplate(mission?.id);
      const { status, reward, button } = row;
      row.mission = mission;

      if (!mission || !template) {
        row.label.text = 'デイリー準備中';
        status.text = '-';
        reward.text = '-';
        button.view.visible = false;
        return;
      }

      const progress = Math.min(template.target, Math.max(0, Math.floor(mission.progress ?? 0)));
      const complete = Boolean(mission.completed) || progress >= template.target;
      const claimed = Boolean(mission.claimed);

      row.label.text = template.shortLabel ?? template.label;
      status.text = complete ? (claimed ? '受取済み' : '達成') : `${this.formatNumber(progress)}/${this.formatNumber(template.target)}`;
      status.style.fill = complete ? '#65e878' : '#fff0b4';
      reward.text = formatDailyReward(template.reward).replace('研究Pt ', 'Pt ');
      button.view.visible = complete;
      button.view.eventMode = complete && !claimed ? 'static' : 'none';
      button.view.cursor = complete && !claimed ? 'pointer' : 'default';
      button.view.alpha = claimed ? 0.62 : 1;
      button.text.text = claimed ? '済' : '受取';
      button.text.style.fill = claimed ? '#8da49e' : '#071015';
      this.drawDailyButton(button.bg, claimed);
    });

    this.applyTextures(homeDinoId, homeTarget.evolutionId);
    this.updateEquippedTitle(data);
    this.drawDynamic(dino);
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
    const unlocked = Array.isArray(data.unlockedDinos)
      ? data.unlockedDinos.filter((id) => HOME_DINO_IDS.includes(id))
      : DEFAULT_UNLOCKED_HOME_DINOS;

    return unlocked.length > 0 ? unlocked : ['velociraptor'];
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
      ['unlockStatusPanel', ASSET_KEYS.homeUi?.unlockStatusPanel, HOME_ASSET_PATHS.unlockStatusPanel],
      ['recordPanel', ASSET_KEYS.homeUi?.recordPanel, HOME_ASSET_PATHS.recordPanel],
      ['dailyMissionPanel', ASSET_KEYS.homeUi?.dailyMissionPanel, HOME_ASSET_PATHS.dailyMissionPanel],
      ['iconDnaRed', ASSET_KEYS.homeUi?.iconDnaRed, HOME_ASSET_PATHS.iconDnaRed],
      ['iconResearchBeakerBlue', ASSET_KEYS.homeUi?.iconResearchBeakerBlue, HOME_ASSET_PATHS.iconResearchBeakerBlue],
      ['homeDinoSwitchLeft', ASSET_KEYS.homeUi?.homeDinoSwitchLeft, HOME_ASSET_PATHS.homeDinoSwitchLeft],
      ['homeDinoSwitchRight', ASSET_KEYS.homeUi?.homeDinoSwitchRight, HOME_ASSET_PATHS.homeDinoSwitchRight],
      ['homeDinoSelector', ASSET_KEYS.homeUi?.homeDinoSelector, HOME_ASSET_PATHS.homeDinoSelector],
      ['sortieButtonFrame', ASSET_KEYS.homeUi?.sortieButtonFrame, HOME_ASSET_PATHS.sortieButtonFrame],
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
    this.applySprite(this.unlockPanel, this.textures.get('unlockStatusPanel'), UNLOCK_PANEL, 0.9);
    this.applySprite(this.recordPanel, this.textures.get('recordPanel'), RECORD_PANEL, 0.9);
    this.applySprite(this.dailyPanel, this.textures.get('dailyMissionPanel'), DAILY_PANEL, 0.9);
    this.applySprite(this.deployFrame, this.textures.get('sortieButtonFrame'), DEPLOY, 0.86);
    this.resourceIcons.forEach(({ item, sprite }) => {
      this.applySprite(sprite, this.textures.get(item.iconName), { x: item.iconX - 10, y: 43, width: 20, height: 20 }, 0.95);
    });
    this.applySprite(this.selectorPlate, this.textures.get('homeDinoSelector'), { x: SELECTOR.pillX, y: SELECTOR.y, width: 138, height: 28 }, 0.9);
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
      this.noticeText.text = 'ホームを表示中';
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

    this.deployTitle.anchor.set(0.5);
    this.deployTitle.position.set(this.width / 2 + 16, DEPLOY.y + 25);
    this.deploySub.anchor.set(0.5);
    this.deploySub.position.set(this.width / 2 + 16, DEPLOY.y + 48);

    this.unlockTitle.position.set(UNLOCK_CONTENT.titleX, UNLOCK_CONTENT.titleY);
    this.unlockRows.forEach(({ label, value }, index) => {
      const y = UNLOCK_CONTENT.rowStartY + index * UNLOCK_CONTENT.rowGap;

      label.position.set(UNLOCK_CONTENT.labelX, y);
      value.anchor.set(1, 0);
      value.position.set(UNLOCK_CONTENT.valueX, y);
    });

    this.recordTitle.position.set(RECORD_CONTENT.titleX, RECORD_CONTENT.titleY);
    this.recordRows.forEach(({ label, value }, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = RECORD_CONTENT.labelX + col * RECORD_CONTENT.colGap;
      const y = RECORD_CONTENT.rowStartY + row * RECORD_CONTENT.rowGap;

      label.position.set(x, y);
      value.position.set(x, y + 12);
    });

    this.dailyTitle.position.set(DAILY_CONTENT.titleX, DAILY_CONTENT.titleY);
    this.dailyRows.forEach(({ label, status, reward, button }, index) => {
      const y = DAILY_CONTENT.rowStartY + index * DAILY_CONTENT.rowGap;

      label.position.set(DAILY_CONTENT.labelX, y);
      status.anchor.set(1, 0);
      status.position.set(DAILY_CONTENT.statusX, y);
      reward.anchor.set(1, 0);
      reward.position.set(DAILY_CONTENT.rewardX, y);
      button.view.position.set(DAILY_CONTENT.buttonX, y - 4);
    });

    this.noticeText.anchor.set(0.5, 0);
    this.noticeText.position.set(this.width / 2, 746);
  }

  drawDynamic(dino) {
    this.panelGraphics.clear();
    this.iconGraphics.clear();
    this.heroFallback.clear();
    this.switchFallback.clear();

    this.panelGraphics
      .rect(HERO.x, HERO.y, HERO.width, HERO.height)
      .fill({ color: 0x000000, alpha: this.homeBackground.visible ? 0.1 : 0 })
      .ellipse(this.width / 2, 408, 120, 18)
      .fill({ color: 0x000000, alpha: 0.32 })
      .ellipse(this.width / 2, 407, 78, 7)
      .fill({ color: dino.accentColor, alpha: 0.08 });

    if (!this.resourcePanel.visible) {
      this.drawPanel(this.panelGraphics, RESOURCE_PANEL.x, RESOURCE_PANEL.y, RESOURCE_PANEL.width, RESOURCE_PANEL.height, UI_COLORS.dna, 0.82);
    }
    if (!this.unlockPanel.visible) {
      this.drawPanel(this.panelGraphics, UNLOCK_PANEL.x, UNLOCK_PANEL.y, UNLOCK_PANEL.width, UNLOCK_PANEL.height, UI_COLORS.dna, 0.78);
    }
    if (!this.recordPanel.visible) {
      this.drawPanel(this.panelGraphics, RECORD_PANEL.x, RECORD_PANEL.y, RECORD_PANEL.width, RECORD_PANEL.height, UI_COLORS.green, 0.78);
    }
    if (!this.dailyPanel.visible) {
      this.drawPanel(this.panelGraphics, DAILY_PANEL.x, DAILY_PANEL.y, DAILY_PANEL.width, DAILY_PANEL.height, UI_COLORS.gold, 0.78);
    }
    if (!this.deployFrame.visible) {
      this.drawPanel(this.panelGraphics, DEPLOY.x, DEPLOY.y, DEPLOY.width, DEPLOY.height, UI_COLORS.gold, 0.92);
    }
    if (!this.selectorPlate.visible) {
      this.drawPanel(this.switchFallback, SELECTOR.pillX, SELECTOR.y, 138, 28, UI_COLORS.dna, 0.74);
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

    UNLOCK_STATUS_ITEMS.forEach((item, index) => {
      const y = UNLOCK_CONTENT.rowStartY + index * UNLOCK_CONTENT.rowGap + 5;

      this.iconGraphics
        .circle(UNLOCK_CONTENT.iconX, y, 5)
        .fill({ color: item.color, alpha: 0.2 })
        .stroke({ color: item.color, width: 1.2, alpha: 0.72 });
    });

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

    this.dailyRows.forEach((row, index) => {
      const complete = row.status.text === '達成' || row.status.text === '達成済み';
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

    this.iconGraphics
      .circle(82, DEPLOY.y + 33, 21)
      .fill({ color: 0x211504, alpha: 0.82 })
      .stroke({ color: UI_COLORS.gold, width: 1.8, alpha: 0.86 })
      .poly([75, DEPLOY.y + 43, 88, DEPLOY.y + 25, 98, DEPLOY.y + 43])
      .fill({ color: UI_COLORS.gold, alpha: 0.84 });
  }

  createDailyButton() {
    const view = new Container();
    const bg = new Graphics();
    const text = this.createText('受取', 8, '#071015', 38);

    text.anchor.set(0.5);
    text.position.set(22, 11);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.on('pointertap', () => {
      playPressFeedback(view, { width: 44, height: 22, scale: 0.94, alpha: 0.78, duration: 110 });
      this.playUiFeedback('ui_confirm');
      const row = this.dailyRows.find((entry) => entry.button.view === view);
      setTimeout(() => this.claimDailyMission(row), 80);
    });
    view.addChild(bg, text);
    this.drawDailyButton(bg, false);

    return { view, bg, text };
  }

  drawDailyButton(graphics, claimed) {
    graphics
      .clear()
      .roundRect(0, 0, 44, 22, 6)
      .fill({ color: claimed ? 0x182225 : UI_COLORS.gold, alpha: claimed ? 0.82 : 0.92 })
      .stroke({ color: claimed ? UI_COLORS.line : UI_COLORS.gold, width: 1, alpha: 0.78 });
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
