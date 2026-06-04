import { Assets, Container, Graphics, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import { ASSET_KEYS } from '../data/asset_manifest.js';
import { getAdaptationLabel } from '../data/skills.js';
import { drawButtonFrame, drawPanel, UI_COLORS } from './ui_theme.js';
import { resetIntroMotion, updateIntroMotion, pulseAlpha } from './ui_motion.js';

const DINO_LABELS = {
  velociraptor: 'ヴェロキラプトル',
  triceratops: 'トリケラトプス',
  tyrannosaurus: 'ティラノサウルス',
  spinosaurus: 'スピノサウルス',
};

const DINO_RESULT_LABELS = {
  velociraptor: 'ラプトル',
  triceratops: 'トリケラ',
  tyrannosaurus: 'ティラノ',
  spinosaurus: 'スピノ',
};

const MODE_LABELS = {
  endless: 'ENDLESS',
  zero: 'ZERO',
  standard: 'NORMAL',
};

const SKILL_LABELS = {
  afterimage_claw: '残影爪',
  gale_blade: '疾風刃',
  accelerated_blades: '加速刃群',
  homing_fang: '追尾牙',
  sense_spike: '感知棘',
  predator_marking: '捕食マーキング',
  shock_roar_wave: '衝撃咆哮',
  burst_fang: '爆牙',
  flame_breath: '火炎息',
};

const RESULT_SKILL_ICON_PATHS = {
  afterimage_claw: 'assets/ui/skills/icon_afterimage_claw.png',
  gale_blade: 'assets/ui/skills/icon_gale_blade.png',
  accelerated_blades: 'assets/ui/skills/icon_accel_blades.png',
  homing_fang: 'assets/ui/skills/icon_tracking_fang.png',
  sense_spike: 'assets/ui/skills/icon_sense_spike.png',
  predator_marking: 'assets/ui/skills/icon_predator_mark.png',
  shock_roar_wave: 'assets/ui/skills/icon_shock_roar.png',
  burst_fang: 'assets/ui/skills/icon_burst_fang.png',
  flame_breath: 'assets/ui/skills/icon_flame_breath.png',
};

const RESULT_EVOLUTION_PORTRAIT_PATHS = {
  speed: 'assets/dinos/evolutions/portraits/velociraptor_speed_portrait.png',
  hunting: 'assets/dinos/evolutions/portraits/velociraptor_hunting_portrait.png',
  attack: 'assets/dinos/evolutions/portraits/velociraptor_attack_portrait.png',
  velociraptor_speed: 'assets/dinos/evolutions/portraits/velociraptor_speed_portrait.png',
  velociraptor_hunting: 'assets/dinos/evolutions/portraits/velociraptor_hunting_portrait.png',
  velociraptor_attack: 'assets/dinos/evolutions/portraits/velociraptor_attack_portrait.png',
  triceratops_speed: 'assets/dinos/evolutions/portraits/triceratops_speed_portrait.png',
  triceratops_hunting: 'assets/dinos/evolutions/portraits/triceratops_hunting_portrait.png',
  triceratops_attack: 'assets/dinos/evolutions/portraits/triceratops_attack_portrait.png',
  tyrannosaurus_speed: 'assets/dinos/evolutions/portraits/tyrannosaurus_speed_portrait.png',
  tyrannosaurus_hunting: 'assets/dinos/evolutions/portraits/tyrannosaurus_hunting_portrait.png',
  tyrannosaurus_attack: 'assets/dinos/evolutions/portraits/tyrannosaurus_attack_portrait.png',
  tyrannosaurus_zero: 'assets/dinos/evolutions/portraits/tyrannosaurus_zero_portrait.png',
  spinosaurus_speed: 'assets/dinos/evolutions/portraits/spinosaurus_speed_portrait.png',
  spinosaurus_hunting: 'assets/dinos/evolutions/portraits/spinosaurus_hunting_portrait.png',
  spinosaurus_attack: 'assets/dinos/evolutions/portraits/spinosaurus_attack_portrait.png',
  spinosaurus_zero: 'assets/dinos/evolutions/portraits/spinosaurus_zero_portrait.png',
};

const RESULT_PANEL = {
  x: 10,
  y: 72,
  bottomInset: 14,
  insetX: 36,
  insetY: 28,
};

const RESULT_TEXT_SAFE = {
  panelTop: 100,
  cardTop: 24,
  cardLeft: 26,
  cardBottom: 22,
};

const RESULT_SECTION_LAYOUT = {
  header: { y: 96, height: 92 },
  summary: { y: 190, height: 118 },
  reward: { y: 314, height: 156 },
  skills: { y: 472, height: 0 },
  future: { y: 486, height: 112 },
  progress: { y: 556, height: 98 },
  progressWithFuture: { y: 636, height: 76 },
  retryY: 674,
  homeY: 740,
  retryWithFutureY: 714,
  homeWithFutureY: 772,
};

const RESULT_SKILL_COLORS = {
  afterimage_claw: 0x35d7ff,
  gale_blade: 0x35d7ff,
  accelerated_blades: 0x35d7ff,
  homing_fang: 0xffc739,
  sense_spike: 0xffc739,
  predator_marking: 0xffc739,
  shock_roar_wave: 0xff4d38,
  burst_fang: 0xff4d38,
  flame_breath: 0xff4d38,
};

const RESULT_ASSET_VISUAL_BOUNDS = {
  scorePanel: { width: 586, height: 205, left: 5, top: 0, right: 563, bottom: 202 },
  rewardPanel: { width: 586, height: 240, left: 5, top: 3, right: 564, bottom: 240 },
  headerClear: { width: 570, height: 149, left: 5, top: 0, right: 537, bottom: 149 },
  headerGameover: { width: 570, height: 152, left: 5, top: 3, right: 537, bottom: 152 },
  headerZeroClear: { width: 420, height: 92, left: 0, top: 0, right: 420, bottom: 92 },
  retryButton: { width: 556, height: 130, left: 3, top: 0, right: 501, bottom: 121 },
  homeButton: { width: 542, height: 124, left: 2, top: 0, right: 459, bottom: 121 },
};

const RESULT_A08_LAYOUT = {
  header: { x: 45, y: 100, width: 300, height: 58 },
  headerZero: { x: 35, y: 96, width: 320, height: 62 },
  panel: { x: 27, y: 172, width: 336, height: 455 },
  statStartY: 246,
  statGapY: 56,
  rewardStartY: 244,
  rewardGapY: 50,
  buttonX: 73,
  nextY: 652,
  retryY: 650,
  homeY: 714,
  buttonWidth: 244,
  buttonHeight: 54,
};

export class ResultUi {
  constructor({ width, height, assetLoader = null, onRetry, onHome, onTitle = null }) {
    this.width = width;
    this.height = height;
    this.assetLoader = assetLoader;
    this.onRetry = onRetry;
    this.onHome = onHome;
    this.onTitle = onTitle;
    this.view = new Container();
    this.backdrop = new Graphics();
    this.fallbackPanel = new Graphics();
    this.backgroundSprite = new Sprite(Texture.EMPTY);
    this.panelSprite = new Sprite(Texture.EMPTY);
    this.headerSprite = new Sprite(Texture.EMPTY);
    this.evolutionPortraitSprite = new Sprite(Texture.EMPTY);
    this.summaryPanel = new Sprite(Texture.EMPTY);
    this.rewardPanel = new Sprite(Texture.EMPTY);
    this.skillsPanel = new Sprite(Texture.EMPTY);
    this.futurePanel = new Sprite(Texture.EMPTY);
    this.progressPanel = new Sprite(Texture.EMPTY);
    this.textures = new Map();
    this.skillIconTextures = new Map();
    this.evolutionPortraitTextures = new Map();
    this.loadingSkillIcons = new Set();
    this.latestSkillRenderData = [];
    this.latestGameState = null;
    this.hasFutureRewards = false;
    this.currentResultKind = 'result';
    this.resultPage = 'summary';
    this.lastResultKey = '';
    this.summaryRows = [];
    this.rewardRows = [];

    this.title = this.createText('RESULT', 30, '#f4f7f5', 238);
    this.subtitle = this.createText('生存データを解析しました', 12, '#7cf7d4', 286);
    this.recordText = this.createText('', 12, '#ffd36b', 292);
    this.dinoText = this.createText('', 14, '#ffffff', 156);
    this.evolutionText = this.createText('', 14, '#ffd36b', 152);
    this.skillText = this.createText('', 11, '#d7fff2', 284);
    this.rewardNotice = this.createText('', 11, '#8defff', 284);
    this.statTexts = [];
    this.rewardTexts = [];
    this.futureTexts = [];
    this.progressTexts = [];
    this.skillEntries = [];

    this.retryButton = this.createButton('もう一度出撃する', 'retry', 0xffc739, '#fff0b4');
    this.homeButton = this.createButton('ホームへ', 'home', 0x35d7ff, '#d7fff2');
    this.nextButton = this.createButton('次へ', 'next', 0x35d7ff, '#d7fff2');
    this.wasVisible = false;
    this.motionTime = 0;

    this.view.visible = false;
    this.view.eventMode = 'static';
    this.view.hitArea = new Rectangle(0, 0, width, height);
    this.view.addChild(
      this.backdrop,
      this.backgroundSprite,
      this.panelSprite,
      this.fallbackPanel,
      this.headerSprite,
      this.evolutionPortraitSprite,
      this.title,
      this.subtitle,
      this.recordText,
      this.summaryPanel,
      this.rewardPanel,
      this.skillsPanel,
      this.futurePanel,
      this.progressPanel,
      this.dinoText,
      this.evolutionText,
      this.skillText,
      this.rewardNotice,
    );

    for (let index = 0; index < 6; index += 1) {
      const label = this.createText('', 10, '#86b8ac', 92);
      const value = this.createText('', 15, '#ffffff', 96);
      this.statTexts.push({ label, value });
      this.view.addChild(label, value);
    }

    for (let index = 0; index < 4; index += 1) {
      const label = this.createText('', 10, '#95c7bd', 70);
      const value = this.createText('', 15, '#fff4c8', 76);
      this.rewardTexts.push({ label, value });
      this.view.addChild(label, value);
    }

    this.rewardRowFrames = Array.from({ length: 7 }, () => {
      const sprite = new Sprite(Texture.EMPTY);
      sprite.visible = false;
      this.view.addChild(sprite);
      return sprite;
    });

    for (let index = 0; index < 3; index += 1) {
      const view = new Container();
      const frame = new Graphics();
      const icon = new Sprite(Texture.EMPTY);
      const fallbackIcon = new Graphics();
      const label = this.createText('', 10, '#e7fff6', 70);
      const level = this.createText('', 10, '#ffd36b', 40);

      icon.anchor.set(0.5);
      label.anchor.set(0.5, 0);
      level.anchor.set(0.5);
      view.addChild(frame, fallbackIcon, icon, label, level);
      this.skillEntries.push({ view, frame, icon, fallbackIcon, label, level });
      this.view.addChild(view);
    }

    for (let index = 0; index < 3; index += 1) {
      const title = this.createText('', 10, '#8defff', 110);
      const value = this.createText('', 12, '#ffffff', 184);
      this.futureTexts.push({ title, value });
      this.view.addChild(title, value);
    }

    for (let index = 0; index < 2; index += 1) {
      const label = this.createText('', 10, '#86b8ac', 122);
      const value = this.createText('', 15, '#ffffff', 122);
      this.progressTexts.push({ label, value });
      this.view.addChild(label, value);
    }

    this.nextButton.view.on('pointertap', () => this.showRewardPage());
    this.retryButton.view.on('pointertap', () => this.onRetry());
    this.homeButton.view.on('pointertap', () => this.onHome());
    this.view.on('pointertap', () => {
      if (this.resultPage === 'summary') {
        this.showRewardPage();
      }
    });
    this.title.eventMode = 'static';
    this.title.cursor = 'pointer';
    this.title.on('pointertap', (event) => {
      event?.stopPropagation?.();
      this.onTitle?.();
    });
    this.evolutionPortraitSprite.anchor.set(0.5);
    this.evolutionPortraitSprite.visible = false;
    this.view.addChild(this.nextButton.view, this.retryButton.view, this.homeButton.view);
    this.loadAssets();
    this.drawStatic();
  }

  loadAssets() {
    if (!this.assetLoader) {
      return;
    }

    Object.entries(ASSET_KEYS.resultUi ?? {}).forEach(([name, key]) => {
      this.assetLoader.load(key).then((texture) => {
        this.textures.set(name, texture);
        this.applyTextures();
      }).catch(() => {});
    });

    [
      ['sharedPausePanelV3', ASSET_KEYS.pauseUi?.pausePanelV3],
      ['sharedPausePanelV2', ASSET_KEYS.pauseUi?.pausePanelV2],
      ['sharedPausePanel', ASSET_KEYS.pauseUi?.pausePanel],
    ].forEach(([name, key]) => {
      if (!key) {
        return;
      }

      this.assetLoader.load(key).then((texture) => {
        this.textures.set(name, texture);
        this.applyTextures();
      }).catch(() => {});
    });

    Object.entries(RESULT_SKILL_ICON_PATHS).forEach(([id, path]) => {
      Assets.load(`${import.meta.env.BASE_URL}${path}`).then((texture) => {
        this.skillIconTextures.set(id, texture);
        this.refreshSkillIcons();
      }).catch(() => {});
    });

    Object.entries(RESULT_EVOLUTION_PORTRAIT_PATHS).forEach(([tag, path]) => {
      Assets.load(`${import.meta.env.BASE_URL}${path}`).then((texture) => {
        this.evolutionPortraitTextures.set(tag, texture);
        this.updateEvolutionPortrait(this.latestGameState);
      }).catch(() => {});
    });
  }

  show(gameState, saveInfo = null) {
    const resultKey = `${gameState?.runResult?.type ?? 'result'}:${gameState?.score ?? 0}:${Math.floor(gameState?.elapsedTime ?? 0)}:${saveInfo?.bestScore ?? 0}:${saveInfo?.bestSurvivalTime ?? 0}`;
    if (!this.wasVisible) {
      if (this.panelSprite.visible) {
        this.panelSprite.__introMotion = null;
        this.panelSprite.alpha = 0.94;
      } else {
        resetIntroMotion(this.fallbackPanel, { duration: 0.24, startScale: 0.98 });
      }
      this.motionTime = 0;
      this.resultPage = 'summary';
      this.lastResultKey = resultKey;
    } else if (resultKey !== this.lastResultKey) {
      this.resultPage = 'summary';
      this.lastResultKey = resultKey;
    }

    this.wasVisible = true;
    this.view.visible = true;
    this.render(gameState, saveInfo);
  }

  hide() {
    this.view.visible = false;
    this.wasVisible = false;
  }

  update(delta) {
    if (!this.view.visible) {
      return;
    }

    this.motionTime += delta;
    if (!this.panelSprite.visible) {
      updateIntroMotion(this.fallbackPanel, delta);
    }

    if (this.recordText.text.startsWith('NEW!')) {
      pulseAlpha(this.recordText, this.motionTime, 0.72, 1);
    }
  }

  render(gameState, saveInfo = null) {
    this.latestGameState = gameState;
    const resultType = this.getResultType(gameState);
    this.currentResultKind = resultType.kind;
    this.applyHeader(resultType);

    const dnaEarned = saveInfo?.dnaEarned ?? 0;
    const rewardTitles = saveInfo?.rewardTitles ?? [];
    const titleFrames = saveInfo?.titleFrames ?? [];
    const firstClearRewards = saveInfo?.firstClearRewards ?? [];
    const zeroRewards = saveInfo?.zeroRewards ?? [];
    const skills = (gameState.ownedSkills ?? [])
      .filter((skill) => skill?.type === 'adaptationSkill' && skill.usesSkillSlot !== false)
      .slice(0, 3)
      .map((skill) => ({
        skill,
        name: this.getSkillName(skill),
        level: gameState.getSkillLevel?.(skill.id) ?? skill.level ?? 1,
      }));
    const evolutionName = gameState.selectedEvolution?.evolutionName ?? '未進化';
    const dinoName = DINO_LABELS[gameState.selectedDino] ?? '解析個体';
    const dinoResultName = DINO_RESULT_LABELS[gameState.selectedDino] ?? dinoName;
    const modeName = MODE_LABELS[gameState.selectedMode] ?? 'NORMAL';
    const isZeroClear = resultType.kind === 'zeroClear';
    const stats = [
      ['生存時間', this.formatTime(gameState.elapsedTime)],
      ['撃破数', `${gameState.defeatedCount}`],
      ['スコア', this.formatNumber(gameState.score)],
      ['最高スコア', `${this.formatNumber(saveInfo?.bestScore ?? gameState.score)}${saveInfo?.isNewBestScore ? ' NEW!' : ''}`],
      ['最高生存', `${this.formatTime(saveInfo?.bestSurvivalTime ?? gameState.elapsedTime)}${saveInfo?.isNewBestSurvivalTime ? ' NEW!' : ''}`],
    ];
    const tags = Object.entries(gameState.adaptationProgress ?? {})
      .filter(([, value]) => value > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    this.title.text = resultType.title;
    this.title.style.fill = resultType.titleColor;
    this.subtitle.text = resultType.subtitle;
    this.dinoText.text = `${dinoName} / ${modeName}`;
    this.evolutionText.text = `進化: ${evolutionName}`;
    this.skillText.text = '';
    this.skillText.visible = false;

    this.recordText.text = 'TAP / 次へ';
    this.recordText.alpha = 0.86;
    this.recordText.scale.set(1);
    this.recordText.style.fill = '#ffd36b';

    this.statTexts.forEach((entry, index) => {
      const stat = stats[index];
      entry.label.text = stat?.[0] ?? '';
      entry.value.text = stat?.[1] ?? '';
      entry.value.style.fill = stat?.[1]?.includes('NEW!') ? '#ffd36b' : '#ffffff';
    });

    const rewards = this.createRewardRows({
      dnaEarned,
      rewardTitles,
      titleFrames,
      firstClearRewards,
      zeroRewards,
      newEvolutionRoute: saveInfo?.newEvolutionRoute,
      stageResult: saveInfo?.stageResult,
      resultKind: resultType.kind,
    });

    this.rewardTexts.forEach((entry, index) => {
      const reward = rewards[index];
      entry.label.text = reward?.[0] ?? '';
      entry.value.text = reward?.[1] ?? '';
      entry.value.alpha = reward && ['未発見', '未獲得', '未発生', '0'].includes(reward[1]) ? 0.62 : 1;
    });

    const future = [];
    this.hasFutureRewards = false;

    this.futureTexts.forEach((entry, index) => {
      const item = future[index];
      entry.title.text = item?.[0] ?? '';
      entry.value.text = item?.[1] ?? '';
      entry.value.alpha = item ? 1 : 0;
    });
    this.futurePanel.visible = false;

    const progress = [
      ['BEST SCORE', this.formatNumber(saveInfo?.bestScore ?? gameState.score)],
      ['BEST TIME', this.formatTime(saveInfo?.bestSurvivalTime ?? gameState.elapsedTime)],
    ];

    this.progressTexts.forEach((entry, index) => {
      entry.label.text = progress[index][0];
      entry.value.text = progress[index][1];
    });

    this.rewardNotice.text = resultType.kind === 'zeroClear' ? 'ZERO報酬' : '獲得報酬';
    this.renderSkillEntries([]);
    this.updateEvolutionPortrait(gameState);
    this.summaryRows = stats;
    this.rewardRows = rewards;
    this.renderResultPage();
  }

  drawStatic() {
    const panelWidth = this.width - RESULT_PANEL.x * 2;
    const panelHeight = this.height - RESULT_PANEL.y - RESULT_PANEL.bottomInset;
    const contentX = RESULT_PANEL.x + RESULT_PANEL.insetX;

    this.backdrop
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x010506, alpha: 0.84 });

    drawPanel(this.fallbackPanel, RESULT_PANEL.x, RESULT_PANEL.y, panelWidth, panelHeight, {
      accent: UI_COLORS.dna,
      alpha: 0.93,
      radius: 12,
    });

    this.applyTextures();
    this.title.position.set(contentX + 22, RESULT_TEXT_SAFE.panelTop + 8);
    this.subtitle.position.set(contentX + 24, RESULT_TEXT_SAFE.panelTop + 44);
    this.recordText.position.set(contentX + 24, RESULT_TEXT_SAFE.panelTop + 62);
    this.dinoText.position.set(48, 150);
    this.evolutionText.position.set(48, 170);
    this.dinoText.visible = false;
    this.evolutionText.visible = false;
    this.rewardNotice.position.set(contentX + RESULT_TEXT_SAFE.cardLeft, 340);
    this.skillText.position.set(contentX + RESULT_TEXT_SAFE.cardLeft, 464);
    this.skillText.visible = false;

    this.layoutHeaderTexts();
    this.layoutStatTexts();
    this.layoutRewardTexts();
    this.layoutFutureTexts();
    this.layoutProgressTexts();

    this.layoutButtons();
  }

  applyTextures() {
    const panelWidth = this.width - RESULT_PANEL.x * 2;
    const panelHeight = this.height - RESULT_PANEL.y - RESULT_PANEL.bottomInset;
    const sections = this.getSectionRects();

    this.applySprite(this.backgroundSprite, this.textures.get('background'), { x: 0, y: 0, width: this.width, height: this.height }, 0.08);
    const sharedPanel = this.textures.get('sharedPausePanelV3') ?? this.textures.get('sharedPausePanelV2') ?? this.textures.get('sharedPausePanel') ?? this.textures.get('panel');
    this.applySprite(this.panelSprite, sharedPanel, { x: RESULT_PANEL.x, y: RESULT_PANEL.y, width: panelWidth, height: panelHeight }, 0.94);
    this.applyVisualSprite(this.summaryPanel, this.textures.get('scorePanel'), sections.summary, 1, RESULT_ASSET_VISUAL_BOUNDS.scorePanel);
    this.applyVisualSprite(this.rewardPanel, this.textures.get('rewardPanel'), sections.reward, 1, RESULT_ASSET_VISUAL_BOUNDS.rewardPanel);
    this.skillsPanel.visible = false;
    this.applyVisualSprite(this.futurePanel, this.textures.get('rewardPanel'), sections.future, 0.82, RESULT_ASSET_VISUAL_BOUNDS.rewardPanel);
    this.applyVisualSprite(this.progressPanel, this.textures.get('scorePanel'), sections.progress, 0.86, RESULT_ASSET_VISUAL_BOUNDS.scorePanel);
    this.applyButtonSprite(this.retryButton, this.textures.get('retryButton'), this.getButtonSize('retry'));
    this.applyButtonSprite(this.homeButton, this.textures.get('homeButton'), this.getButtonSize('home'));
    this.fallbackPanel.visible = !this.textures.get('panel');
    this.layoutDynamicSections();
    if (this.view.visible) {
      this.renderResultPage();
    }
  }

  applyHeader(resultType) {
    const texture = resultType.kind === 'gameover'
      ? this.textures.get('headerGameover')
      : resultType.kind === 'zeroClear'
        ? this.textures.get('headerZeroClear') ?? this.textures.get('headerClear')
        : this.textures.get('headerClear');
    const bounds = resultType.kind === 'gameover'
      ? RESULT_ASSET_VISUAL_BOUNDS.headerGameover
      : resultType.kind === 'zeroClear' && this.textures.get('headerZeroClear')
        ? RESULT_ASSET_VISUAL_BOUNDS.headerZeroClear
        : RESULT_ASSET_VISUAL_BOUNDS.headerClear;
    this.applyVisualSprite(this.headerSprite, texture, this.getSectionRects().header, 1, bounds);
    this.layoutHeaderTexts();
  }

  applySprite(sprite, texture, rect, alpha = 1) {
    sprite.texture = texture ?? Texture.EMPTY;
    sprite.visible = !!texture;
    sprite.position.set(rect.x, rect.y);
    sprite.width = rect.width;
    sprite.height = rect.height;
    sprite.alpha = alpha;
  }

  applyVisualSprite(sprite, texture, rect, alpha = 1, bounds = null) {
    sprite.texture = texture ?? Texture.EMPTY;
    sprite.visible = !!texture;
    sprite.alpha = alpha;

    if (!texture || !bounds) {
      this.applySprite(sprite, texture, rect, alpha);
      return;
    }

    const visibleWidth = Math.max(1, bounds.right - bounds.left);
    const visibleHeight = Math.max(1, bounds.bottom - bounds.top);
    const scaleX = rect.width / visibleWidth;
    const scaleY = rect.height / visibleHeight;

    sprite.position.set(
      rect.x - bounds.left * scaleX,
      rect.y - bounds.top * scaleY,
    );
    sprite.width = bounds.width * scaleX;
    sprite.height = bounds.height * scaleY;
  }

  applyButtonSprite(button, texture, size) {
    if (texture && texture.width <= 320 && texture.height <= 120) {
      this.applySprite(button.sprite, texture, { x: 0, y: 0, width: size.width, height: size.height }, 1);
      button.bg.visible = false;
      button.text.position.set(size.width / 2, size.height / 2);
      button.view.hitArea = new Rectangle(0, 0, size.width, size.height);
      return;
    }

    const bounds = button.kind === 'retry'
      ? RESULT_ASSET_VISUAL_BOUNDS.retryButton
      : RESULT_ASSET_VISUAL_BOUNDS.homeButton;

    this.applyVisualSprite(button.sprite, texture, { x: 0, y: 0, width: size.width, height: size.height }, 1, bounds);
    button.bg.visible = !texture;
    button.bg.clear();
    drawButtonFrame(button.bg, size.width, size.height, {
      accent: button.color,
      selected: button.kind === 'retry',
      glow: button.kind === 'retry',
    });
    button.text.position.set(size.width / 2, size.height / 2);
    button.view.hitArea = new Rectangle(0, 0, size.width, size.height);
  }

  getSectionRects() {
    const panelWidth = this.width - RESULT_PANEL.x * 2;
    const contentX = RESULT_PANEL.x + RESULT_PANEL.insetX;
    const contentWidth = panelWidth - RESULT_PANEL.insetX * 2;
    const headerX = RESULT_PANEL.x + RESULT_PANEL.insetX;
    const headerWidth = this.width - headerX * 2;

    return {
      header: {
        x: headerX,
        y: RESULT_SECTION_LAYOUT.header.y,
        width: headerWidth,
        height: RESULT_SECTION_LAYOUT.header.height,
      },
      summary: {
        x: contentX,
        y: RESULT_SECTION_LAYOUT.summary.y,
        width: contentWidth,
        height: RESULT_SECTION_LAYOUT.summary.height,
      },
      reward: {
        x: contentX,
        y: RESULT_SECTION_LAYOUT.reward.y,
        width: contentWidth,
        height: RESULT_SECTION_LAYOUT.reward.height,
      },
      skills: {
        x: contentX,
        y: RESULT_SECTION_LAYOUT.skills.y,
        width: contentWidth,
        height: RESULT_SECTION_LAYOUT.skills.height,
      },
      future: {
        x: contentX,
        y: RESULT_SECTION_LAYOUT.future.y,
        width: contentWidth,
        height: RESULT_SECTION_LAYOUT.future.height,
      },
      progress: {
        x: contentX,
        y: RESULT_SECTION_LAYOUT.progress.y,
        width: contentWidth,
        height: RESULT_SECTION_LAYOUT.progress.height,
      },
      progressWithFuture: {
        x: contentX,
        y: RESULT_SECTION_LAYOUT.progressWithFuture.y,
        width: contentWidth,
        height: RESULT_SECTION_LAYOUT.progressWithFuture.height,
      },
    };
  }

  getSafeRect(rect, insetX = RESULT_TEXT_SAFE.cardLeft, insetY = RESULT_TEXT_SAFE.cardTop, bottomInset = RESULT_TEXT_SAFE.cardBottom) {
    return {
      x: rect.x + insetX,
      y: rect.y + insetY,
      width: rect.width - insetX * 2,
      height: rect.height - insetY - bottomInset,
    };
  }

  layoutHeaderTexts() {
    const safe = this.getSafeRect(this.getSectionRects().header, 30, 18, 14);
    const centerX = safe.x + safe.width / 2;
    const centerY = safe.y + safe.height / 2;

    this.title.anchor.set(0.5);
    this.subtitle.anchor.set(0.5);
    this.recordText.anchor.set(0.5);
    this.title.position.set(centerX, centerY - 16);
    this.subtitle.position.set(centerX, centerY + 13);
    this.recordText.position.set(centerX, centerY + 32);
    this.updateEvolutionPortrait(this.latestGameState);
  }

  updateEvolutionPortrait(gameState) {
    const selectedEvolution = gameState?.selectedEvolution;
    const tag = selectedEvolution?.tag;
    const key = selectedEvolution?.id ?? (selectedEvolution?.dinoId && tag ? `${selectedEvolution.dinoId}_${tag}` : tag);
    const texture = key
      ? this.evolutionPortraitTextures.get(key) ?? this.evolutionPortraitTextures.get(tag)
      : null;

    if (!texture) {
      this.evolutionPortraitSprite.visible = false;
      return;
    }

    const safe = this.getSafeRect(this.getSectionRects().header, 30, 18, 14);
    const size = Math.min(54, safe.height - 8);

    this.evolutionPortraitSprite.texture = texture;
    this.evolutionPortraitSprite.width = size;
    this.evolutionPortraitSprite.height = size;
    this.evolutionPortraitSprite.position.set(safe.x + safe.width - size / 2 - 10, safe.y + safe.height / 2 + 1);
    this.evolutionPortraitSprite.alpha = 0.92;
    this.evolutionPortraitSprite.visible = true;
  }

  layoutStatTexts() {
    const safe = this.getSafeRect(this.getSectionRects().summary, 28, 18, 18);
    const colWidth = safe.width / 3;
    const rowHeight = safe.height / 2;
    this.statTexts.forEach((entry, index) => {
      const column = index % 3;
      const row = Math.floor(index / 3);
      const x = safe.x + colWidth * (column + 0.5);
      const y = safe.y + rowHeight * (row + 0.5);
      entry.label.anchor.set(0.5);
      entry.value.anchor.set(0.5);
      entry.label.position.set(x, y - 12);
      entry.value.position.set(x, y + 13);
    });
  }

  layoutRewardTexts() {
    const safe = this.getSafeRect(this.getSectionRects().reward, 22, 18, 18);
    const colWidth = safe.width / 4;
    const centerX = safe.x + safe.width / 2;
    const titleY = safe.y + 8;

    this.rewardNotice.anchor.set(0.5);
    this.rewardNotice.position.set(centerX, titleY);
    this.rewardTexts.forEach((entry, index) => {
      const x = safe.x + colWidth * (index + 0.5);
      const y = safe.y + safe.height / 2 + 10;
      entry.label.anchor.set(0.5);
      entry.value.anchor.set(0.5);
      entry.label.position.set(x, y - 12);
      entry.value.position.set(x, y + 14);
    });
  }

  layoutFutureTexts() {
    const safe = this.getSafeRect(this.getSectionRects().future, 28, 18, 16);
    const rowHeight = safe.height / 3;
    this.futureTexts.forEach((entry, index) => {
      const y = safe.y + rowHeight * (index + 0.5);
      entry.title.anchor.set(0, 0.5);
      entry.value.anchor.set(1, 0.5);
      entry.title.position.set(safe.x, y);
      entry.value.position.set(safe.x + safe.width, y);
    });
  }

  layoutProgressTexts() {
    const rect = this.hasFutureRewards ? this.getSectionRects().progressWithFuture : this.getSectionRects().progress;
    const safe = this.getSafeRect(rect, 26, 18, 16);
    const colWidth = safe.width / 2;
    this.progressTexts.forEach((entry, index) => {
      const x = safe.x + colWidth * (index + 0.5);
      const y = safe.y + safe.height / 2;
      entry.label.anchor.set(0.5);
      entry.value.anchor.set(0.5);
      entry.label.position.set(x, y - 12);
      entry.value.position.set(x, y + 14);
    });
  }

  layoutDynamicSections() {
    const rects = this.getSectionRects();
    const progressRect = this.hasFutureRewards ? rects.progressWithFuture : rects.progress;

    this.futurePanel.visible = this.hasFutureRewards && this.futurePanel.texture !== Texture.EMPTY;
    this.progressPanel.visible = false;
    this.skillsPanel.visible = false;
    this.progressTexts.forEach((entry) => {
      entry.label.visible = false;
      entry.value.visible = false;
    });
    this.skillEntries.forEach((entry) => {
      entry.view.visible = false;
    });
    this.applyButtonSprite(this.retryButton, this.textures.get('retryButton'), this.getButtonSize('retry'));
    this.applyButtonSprite(this.homeButton, this.textures.get('homeButton'), this.getButtonSize('home'));
    this.layoutProgressTexts();
    this.layoutButtons();
  }

  layoutButtons() {
    const retrySize = this.getButtonSize('retry');
    const homeSize = this.getButtonSize('home');
    const centerX = this.width / 2;

    this.retryButton.view.position.set(
      centerX - retrySize.width / 2,
      this.hasFutureRewards ? RESULT_SECTION_LAYOUT.retryWithFutureY : RESULT_SECTION_LAYOUT.retryY,
    );
    this.homeButton.view.position.set(
      centerX - homeSize.width / 2,
      this.hasFutureRewards ? RESULT_SECTION_LAYOUT.homeWithFutureY : RESULT_SECTION_LAYOUT.homeY,
    );
  }

  getButtonSize(kind) {
    const compact = this.hasFutureRewards;
    if (kind === 'retry') {
      return {
        width: this.width - (compact ? 78 : 68),
        height: compact ? 54 : 58,
      };
    }

    return {
      width: this.width - (compact ? 132 : 120),
      height: compact ? 44 : 48,
    };
  }

  renderSkillEntries(skills) {
    this.latestSkillRenderData = skills;
    const safe = this.getSafeRect(this.getSectionRects().skills, 28, 20, 18);
    const centerX = safe.x + safe.width / 2;
    const titleY = safe.y + 10;
    const slotY = safe.y + 58;
    const slotGap = 88;
    const startX = centerX - slotGap;

    this.skillText.anchor.set(0.5);
    this.skillText.position.set(centerX, titleY);
    this.skillEntries.forEach((entry, index) => {
      const data = skills[index];
      entry.view.position.set(startX + index * slotGap, slotY);
      entry.view.visible = Boolean(data);

      if (!data) {
        return;
      }

      entry.frame
        .clear()
        .circle(0, 0, 22)
        .fill({ color: 0x02080b, alpha: 0.82 })
        .circle(0, 0, 23)
        .stroke({ color: 0x35d7ff, width: 1.8, alpha: 0.82 });

      entry.label.text = this.compact(data.name, 5);
      entry.level.text = `強${data.level}`;
      entry.label.position.set(0, 24);
      entry.level.position.set(22, -13);
      entry.icon.visible = false;
      this.drawSkillFallback(entry.fallbackIcon, data.skill.id);

      const texture = this.getSkillIconTexture(data.skill);
      if (texture) {
        entry.icon.texture = texture;
        entry.icon.width = 40;
        entry.icon.height = 40;
        entry.icon.position.set(0, -1);
        entry.icon.alpha = 1;
        entry.icon.visible = true;
        entry.fallbackIcon.alpha = 0.18;
      } else {
        entry.fallbackIcon.alpha = 1;
      }
    });
  }

  drawSkillFallback(graphics, skillId) {
    const color = RESULT_SKILL_COLORS[skillId] ?? 0x35d7ff;

    graphics
      .clear()
      .circle(0, -1, 13)
      .fill({ color, alpha: 0.18 })
      .moveTo(-11, 8)
      .lineTo(11, -8)
      .moveTo(-5, 10)
      .lineTo(15, -2)
      .stroke({ color, width: 3, alpha: 0.72 });
  }

  getSkillIconTexture(skill) {
    if (!skill) {
      return null;
    }

    if (this.skillIconTextures.has(skill.id)) {
      return this.skillIconTextures.get(skill.id);
    }

    if (skill.iconKey && this.skillIconTextures.has(skill.iconKey)) {
      return this.skillIconTextures.get(skill.iconKey);
    }

    if (!this.loadingSkillIcons.has(skill.id)) {
      this.loadingSkillIcons.add(skill.id);
      const iconPath = RESULT_SKILL_ICON_PATHS[skill.id];
      const request = skill.iconKey && this.assetLoader
        ? this.assetLoader.load(skill.iconKey)
        : Assets.load(`${import.meta.env.BASE_URL}${iconPath}`);

      request.then((texture) => {
        this.skillIconTextures.set(skill.id, texture);
        this.refreshSkillIcons();
      }).catch(() => {
        this.skillIconTextures.set(skill.id, null);
      }).finally(() => {
        this.loadingSkillIcons.delete(skill.id);
      });
    }

    return null;
  }

  refreshSkillIcons() {
    if (!this.view.visible || this.latestSkillRenderData.length === 0) {
      return;
    }

    this.renderSkillEntries(this.latestSkillRenderData);
  }

  showRewardPage() {
    if (!this.view.visible || this.resultPage === 'reward') {
      return;
    }

    this.resultPage = 'reward';
    this.renderResultPage();
  }

  renderResultPage() {
    const showSummary = this.resultPage !== 'reward';
    const resultType = { kind: this.currentResultKind };

    this.summaryPanel.visible = showSummary;
    this.rewardPanel.visible = !showSummary;
    this.headerSprite.visible = this.headerSprite.texture !== Texture.EMPTY;
    this.title.visible = true;
    this.subtitle.visible = true;
    this.recordText.visible = showSummary;
    this.rewardNotice.visible = !showSummary;
    this.nextButton.view.visible = showSummary;
    this.retryButton.view.visible = !showSummary;
    this.homeButton.view.visible = !showSummary;
    this.futurePanel.visible = false;
    this.progressPanel.visible = false;
    this.skillsPanel.visible = false;
    this.skillText.visible = false;
    this.dinoText.visible = false;
    this.evolutionText.visible = false;
    this.evolutionPortraitSprite.visible = false;

    this.applyA08PanelTextures();
    this.layoutA08Header(resultType);
    if (showSummary) {
      this.layoutA08Summary();
    } else {
      this.layoutA08Rewards();
    }
    this.layoutA08Buttons();
  }

  applyA08PanelTextures() {
    this.applySprite(
      this.summaryPanel,
      this.textures.get('scorePanel'),
      RESULT_A08_LAYOUT.panel,
      1,
    );
    this.applySprite(
      this.rewardPanel,
      this.textures.get('rewardPanel'),
      RESULT_A08_LAYOUT.panel,
      1,
    );
    this.summaryPanel.visible = this.resultPage !== 'reward' && this.summaryPanel.texture !== Texture.EMPTY;
    this.rewardPanel.visible = this.resultPage === 'reward' && this.rewardPanel.texture !== Texture.EMPTY;
  }

  layoutA08Header(resultType = { kind: 'result' }) {
    const isZero = resultType.kind === 'zeroClear';
    const rect = isZero ? RESULT_A08_LAYOUT.headerZero : RESULT_A08_LAYOUT.header;
    const texture = resultType.kind === 'gameover'
      ? this.textures.get('headerGameover')
      : resultType.kind === 'zeroClear'
        ? this.textures.get('headerZeroClear') ?? this.textures.get('headerClear')
        : resultType.kind === 'endless'
          ? this.textures.get('headerEndless') ?? this.textures.get('headerClear')
          : this.textures.get('headerClear');

    this.applySprite(this.headerSprite, texture, rect, 1);
    this.title.anchor.set(0.5);
    this.subtitle.anchor.set(0.5);
    this.recordText.anchor.set(0.5);
    this.title.position.set(this.width / 2, rect.y + rect.height / 2 - 2);
    this.subtitle.position.set(this.width / 2, rect.y + rect.height + 6);
    this.recordText.position.set(this.width / 2, RESULT_A08_LAYOUT.nextY - 22);
  }

  layoutA08Summary() {
    const leftX = RESULT_A08_LAYOUT.panel.x + 48;
    const rightX = RESULT_A08_LAYOUT.panel.x + RESULT_A08_LAYOUT.panel.width - 48;
    this.statTexts.forEach((entry, index) => {
      const row = this.summaryRows[index];
      const y = RESULT_A08_LAYOUT.statStartY + index * RESULT_A08_LAYOUT.statGapY;
      entry.label.text = row?.[0] ?? '';
      entry.value.text = row?.[1] ?? '';
      entry.label.visible = Boolean(row);
      entry.value.visible = Boolean(row);
      entry.label.anchor.set(0, 0.5);
      entry.value.anchor.set(1, 0.5);
      entry.label.position.set(leftX, y);
      entry.value.position.set(rightX, y);
    });

    this.rewardTexts.forEach((entry) => {
      entry.label.visible = false;
      entry.value.visible = false;
    });
    this.futureTexts.forEach((entry) => {
      entry.title.visible = false;
      entry.value.visible = false;
    });
    this.progressTexts.forEach((entry) => {
      entry.label.visible = false;
      entry.value.visible = false;
    });
    this.rewardRowFrames.forEach((sprite) => {
      sprite.visible = false;
    });
    this.statTexts.forEach((entry) => {
      this.view.addChild(entry.label, entry.value);
    });
    this.view.addChild(this.recordText, this.nextButton.view);
  }

  layoutA08Rewards() {
    const rows = this.rewardRows.length > 0
      ? this.rewardRows
      : [['報酬', '獲得報酬なし']];
    const rowEntries = [
      ...this.rewardTexts.map((entry) => ({ label: entry.label, value: entry.value })),
      ...this.futureTexts.map((entry) => ({ label: entry.title, value: entry.value })),
    ];
    const leftX = RESULT_A08_LAYOUT.panel.x + 52;
    const rightX = RESULT_A08_LAYOUT.panel.x + RESULT_A08_LAYOUT.panel.width - 46;

    this.statTexts.forEach((entry) => {
      entry.label.visible = false;
      entry.value.visible = false;
    });
    this.rewardNotice.anchor.set(0.5);
    this.rewardNotice.position.set(this.width / 2, 212);
    this.rewardNotice.style.fill = this.currentResultKind === 'zeroClear' ? '#ffd36b' : '#8defff';

    rowEntries.forEach((entry, index) => {
      const row = rows[index];
      const y = RESULT_A08_LAYOUT.rewardStartY + index * RESULT_A08_LAYOUT.rewardGapY;
      entry.label.text = row?.[0] ?? '';
      entry.value.text = row?.[1] ?? '';
      entry.label.visible = Boolean(row);
      entry.value.visible = Boolean(row);
      entry.label.anchor.set(0, 0.5);
      entry.value.anchor.set(1, 0.5);
      entry.label.position.set(leftX, y);
      entry.value.position.set(rightX, y);
      entry.value.style.fill = row?.[2] === 'muted' ? '#8da49e' : '#fff4c8';
      entry.value.style.wordWrapWidth = 150;
    });
    this.progressTexts.forEach((entry) => {
      entry.label.visible = false;
      entry.value.visible = false;
    });
    this.rewardRowFrames.forEach((sprite, index) => {
      const row = rows[index];
      sprite.texture = this.textures.get('rewardRow') ?? Texture.EMPTY;
      sprite.visible = Boolean(row && sprite.texture !== Texture.EMPTY);
      sprite.position.set(RESULT_A08_LAYOUT.panel.x + 22, RESULT_A08_LAYOUT.rewardStartY - 24 + index * RESULT_A08_LAYOUT.rewardGapY);
      sprite.width = 292;
      sprite.height = 48;
      sprite.alpha = row?.[2] === 'zero' ? 1 : 0.82;
    });
    rowEntries.forEach((entry) => {
      this.view.addChild(entry.label, entry.value);
    });
    this.view.addChild(this.rewardNotice, this.retryButton.view, this.homeButton.view);
  }

  layoutA08Buttons() {
    const buttonRect = {
      x: RESULT_A08_LAYOUT.buttonX,
      y: this.resultPage === 'reward' ? RESULT_A08_LAYOUT.retryY : RESULT_A08_LAYOUT.nextY,
      width: RESULT_A08_LAYOUT.buttonWidth,
      height: RESULT_A08_LAYOUT.buttonHeight,
    };

    this.nextButton.view.position.set(buttonRect.x, RESULT_A08_LAYOUT.nextY);
    this.retryButton.view.position.set(RESULT_A08_LAYOUT.buttonX, RESULT_A08_LAYOUT.retryY);
    this.homeButton.view.position.set(RESULT_A08_LAYOUT.buttonX, RESULT_A08_LAYOUT.homeY);
    const size = { width: RESULT_A08_LAYOUT.buttonWidth, height: RESULT_A08_LAYOUT.buttonHeight };
    this.applyButtonSprite(this.nextButton, this.textures.get('nextButton'), size);
    this.applyButtonSprite(this.retryButton, this.textures.get('retryButton'), size);
    this.applyButtonSprite(this.homeButton, this.textures.get('homeButton'), size);
  }

  createRewardRows({ dnaEarned = 0, rewardTitles = [], titleFrames = [], firstClearRewards = [], zeroRewards = [], newEvolutionRoute = null, stageResult = null, resultKind = 'result' }) {
    const rows = [];

    rows.push(['獲得DNA', dnaEarned > 0 ? `+${this.formatNumber(dnaEarned)}` : '0', dnaEarned > 0 ? 'normal' : 'muted']);

    if (resultKind === 'zeroClear') {
      rows.push(['獲得称号', rewardTitles[0]?.name ?? rewardTitles[0] ?? '取得済み', rewardTitles.length > 0 ? 'zero' : 'muted']);
      rows.push(['獲得フレーム', titleFrames[0]?.name ?? titleFrames[0] ?? '取得済み', titleFrames.length > 0 ? 'zero' : 'muted']);
      rows.push(['獲得進化先', newEvolutionRoute?.routeName ?? newEvolutionRoute?.name ?? '解析済み', newEvolutionRoute ? 'zero' : 'muted']);
      return rows.slice(0, 7);
    }

    if (stageResult?.isFirstClear || firstClearRewards.length > 0) {
      rows.push(['初回クリア報酬', firstClearRewards.length > 0 ? `${firstClearRewards.length}件` : this.getDifficultyLabel(stageResult?.difficultyId), 'normal']);
    } else {
      rows.push(['初回クリア報酬', '取得済み', 'muted']);
    }

    rows.push(['獲得称号', rewardTitles[0]?.name ?? rewardTitles[0] ?? 'なし', rewardTitles.length > 0 ? 'normal' : 'muted']);

    if (newEvolutionRoute) {
      rows.push(['獲得進化先', newEvolutionRoute.routeName ?? newEvolutionRoute.name ?? '発見', 'normal']);
    }

    if (rows.every(([, value]) => ['0', 'なし', '取得済み'].includes(String(value)))) {
      rows.push(['報酬', '獲得報酬なし', 'muted']);
    }

    return rows.slice(0, 7);
  }

  createFirstClearRows({ rewardTitles, titleFrames = [], firstClearRewards, zeroRewards, newEvolutionRoute, stageResult, unlockedDifficulties = [] }) {
    const rows = [];

    if (zeroRewards.length > 0 || newEvolutionRoute) {
      if (rewardTitles.length > 0) {
        rows.push(['ZERO称号', this.compact(rewardTitles[0]?.name ?? rewardTitles[0], 12)]);
      }

      if (titleFrames.length > 0) {
        rows.push(['ZEROフレーム', this.compact(titleFrames[0]?.name ?? titleFrames[0], 12)]);
      }

      if (newEvolutionRoute) {
        rows.push(['新規進化ルート', this.compact(newEvolutionRoute.routeName ?? newEvolutionRoute.id ?? '発見', 12)]);
      }

      if (rows.length === 0 && zeroRewards.length > 0) {
        rows.push(['ZERO初回', `${zeroRewards.length}件`]);
      }

      return rows.slice(0, 3);
    }

    if (stageResult?.isFirstClear) {
      rows.push(['初回クリア', this.getDifficultyLabel(stageResult.difficultyId)]);
    }

    if (unlockedDifficulties.length > 0) {
      rows.push(['難易度解放', this.compact(unlockedDifficulties.map((id) => this.getDifficultyLabel(id)).join('/'), 14)]);
    }

    if (rewardTitles.length > 0) {
      rows.push(['称号獲得', this.compact(rewardTitles[0]?.name ?? rewardTitles[0], 12)]);
    }

    if (newEvolutionRoute) {
      rows.push(['新規進化ルート', this.compact(newEvolutionRoute.routeName ?? newEvolutionRoute.id ?? '発見', 12)]);
    }

    if (titleFrames.length > 0) {
      rows.push(['称号フレーム', this.compact(titleFrames[0]?.name ?? titleFrames[0], 12)]);
    }

    if (firstClearRewards.length > 0) {
      rows.push(['初回報酬', `${firstClearRewards.length}件`]);
    }

    if (zeroRewards.length > 0) {
      rows.push(['ZERO初回', `${zeroRewards.length}件`]);
    }

    return rows.slice(0, 3);
  }

  createRecordText(saveInfo) {
    if (!saveInfo) {
      return '';
    }

    const records = [];

    if (saveInfo.newEvolutionRoute) {
      records.push('進化');
    }

    if (saveInfo.stageResult?.isFirstClear) {
      records.push('初回クリア');
    }

    if (saveInfo.isNewBestScore) {
      records.push('スコア');
    }

    if (saveInfo.isNewBestSurvivalTime) {
      records.push('生存時間');
    }

    if (records.length > 0) {
      return `NEW! ${records.join(' / ')}`;
    }

    return `BEST ${this.formatNumber(saveInfo.bestScore)} / ${this.formatTime(saveInfo.bestSurvivalTime)}`;
  }

  createButton(label, kind, color, fill) {
    const view = new Container();
    const sprite = new Sprite(Texture.EMPTY);
    const bg = new Graphics();
    const text = this.createText(label, kind === 'retry' ? 18 : 16, fill, 230);
    const width = kind === 'retry' ? this.width - 68 : this.width - 120;
    const height = kind === 'retry' ? 58 : 48;

    drawButtonFrame(bg, width, height, {
      accent: color,
      selected: kind === 'retry',
      glow: kind === 'retry',
    });
    text.anchor.set(0.5);
    text.position.set(width / 2, height / 2);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.addChild(sprite, bg, text);

    view.hitArea = new Rectangle(0, 0, width, height);

    return { view, sprite, bg, text, kind, color };
  }

  getResultType(gameState) {
    const runResult = gameState.runResult ?? {};

    if (gameState.selectedMode === 'endless') {
      return {
        kind: 'endless',
        title: 'ENDLESS RESULT',
        subtitle: '長時間生存データを解析しました',
        titleColor: '#65e878',
      };
    }

    if (runResult.type === 'zeroClear') {
      return { kind: 'zeroClear', title: 'ZERO CLEAR', subtitle: '終局突破データを解析しました', titleColor: '#ffd36b' };
    }

    if (runResult.type === 'clear') {
      const subtitle = runResult.reason === 'boss'
        ? 'ボス撃破データを解析しました'
        : 'ステージ突破データを解析しました';
      return { kind: 'clear', title: 'CLEAR', subtitle, titleColor: '#e7fff6' };
    }

    if (runResult.type === 'gameover' || (gameState.playerHp ?? 1) <= 0) {
      return { kind: 'gameover', title: 'GAME OVER', subtitle: '生存データを回収しました', titleColor: '#ff6f6f' };
    }

    if (gameState.defeatedBosses > 0) {
      return { kind: 'clear', title: 'CLEAR', subtitle: 'ボス撃破データを解析しました', titleColor: '#e7fff6' };
    }

    return { kind: 'result', title: gameState.selectedMode === 'endless' ? 'RESULT' : 'RESULT', subtitle: '生存データを解析しました', titleColor: '#f4f7f5' };
  }

  getSkillName(skill) {
    return this.compact(skill.displayName ?? SKILL_LABELS[skill.id] ?? skill.name ?? '適応技', 8);
  }

  getDifficultyLabel(difficultyId) {
    const labels = {
      normal: 'NORMAL',
      hard: 'HARD',
      expert: 'EXPERT',
      endless: 'ENDLESS',
      zero: 'ZERO',
    };

    return labels[difficultyId] ?? String(difficultyId ?? '').toUpperCase();
  }

  compact(value, maxLength) {
    const text = String(value ?? '');
    return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
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
        wordWrap: true,
        wordWrapWidth,
        lineHeight: Math.round(size * 1.25),
        stroke: { color: '#031014', width: size >= 15 ? 2 : 1 },
      },
    });
  }

  formatTime(elapsedTime) {
    const minutes = Math.floor((elapsedTime ?? 0) / 60);
    const seconds = Math.floor((elapsedTime ?? 0) % 60);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  formatNumber(value) {
    return `${Math.max(0, Math.floor(value ?? 0)).toLocaleString('ja-JP')}`;
  }
}
