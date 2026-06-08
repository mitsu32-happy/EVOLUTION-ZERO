import { Assets, Container, Graphics, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import { GameState } from '../core/game_state.js';
import { ASSET_KEYS } from '../data/asset_manifest.js';
import { ADAPTATION_RESEARCH_IDS, ADAPTATION_SKILLS } from '../data/adaptation_skills.js';
import { getBodyResearchBonuses } from '../data/research.js';
import { ENDLESS_SCALING_CONFIG, ZERO_SCALING_CONFIG, getDifficultyConfig, getDinoConfig, getStageBossConfig, getStageConfig, getStageGimmickConfig } from '../data/run_config.js';
import { getEvolutionCandidate, getSkillById } from '../data/skills.js';
import { EvolutionSequence } from '../effects/evolution_sequence.js';
import { getEvolutionBranch, getEvolutionBranchId } from '../data/evolution_data.js';
import { Boss } from '../entities/boss.js';
import { Enemy } from '../entities/enemy.js';
import { Pickup } from '../entities/pickup.js';
import { Player } from '../entities/player.js';
import { CombatSystem } from '../systems/combat_system.js';
import { CollisionSystem } from '../systems/collision_system.js';
import { SpawnSystem } from '../systems/spawn_system.js';
import { UltimateSystem } from '../systems/ultimate_system.js';
import { EvolutionReadyUi } from '../ui/evolution_ready_ui.js';
import { Hud } from '../ui/hud.js';
import { LevelUpUi } from '../ui/levelup_ui.js';
import { PauseUi } from '../ui/pause_ui.js';
import { ResultUi } from '../ui/result_ui.js';

const CAMERA_FOCUS_Y = 456;
const WORLD_ZOOM = 0.88;
const TILE_WIDTH = 96;
const TILE_HEIGHT = 56;
const HUD_INPUT_HEIGHT = 150;
const GAMEPAD_DEAD_ZONE = 0.2;
const DEBUG_EVOLUTION_TAGS = new Set(['speed', 'hunting', 'attack', 'zero']);
const DEBUG_DINO_IDS = new Set(['velociraptor', 'triceratops', 'tyrannosaurus', 'spinosaurus']);
const DEBUG_STAGE_IDS = new Set(['jungle', 'volcano', 'swamp', 'ruins']);
const DEBUG_EVOLUTION_SKILLS = {
  speed: ['afterimage_claw'],
  hunting: ['homing_fang'],
  attack: ['shock_roar_wave'],
  zero: ['afterimage_claw', 'homing_fang', 'shock_roar_wave'],
};
const STAGE_BOUNDS = {
  left: -1500,
  right: 1500,
  top: -1800,
  bottom: 1800,
};
const VISIBILITY_ASSIST_CONFIG = {
  standard: {
    backgroundAlpha: 0.94,
    backgroundLiftAlpha: 0,
    vignetteMultiplier: 1,
    hazardAlphaBoost: 1,
    playerOutlineAlpha: 0,
    enemyOutlineAlpha: 0,
    bossOutlineAlpha: 0,
  },
  bright: {
    backgroundAlpha: 0.98,
    backgroundLiftAlpha: 0.045,
    vignetteMultiplier: 0.82,
    hazardAlphaBoost: 1.12,
    playerOutlineAlpha: 0.24,
    enemyOutlineAlpha: 0.1,
    bossOutlineAlpha: 0.13,
  },
  high: {
    backgroundAlpha: 1,
    backgroundLiftAlpha: 0.08,
    vignetteMultiplier: 0.68,
    hazardAlphaBoost: 1.24,
    playerOutlineAlpha: 0.38,
    enemyOutlineAlpha: 0.16,
    bossOutlineAlpha: 0.2,
  },
};

function uiAssetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

function getDebugEvolutionTag() {
  if (typeof window === 'undefined') {
    return null;
  }

  const tag = new URLSearchParams(window.location.search).get('debugEvolution');

  if (!DEBUG_EVOLUTION_TAGS.has(tag)) {
    return null;
  }

  return tag;
}

function getDebugForceEvolutionTag() {
  if (typeof window === 'undefined') {
    return null;
  }

  const tag = new URLSearchParams(window.location.search).get('debugForceEvolution');

  if (!DEBUG_EVOLUTION_TAGS.has(tag)) {
    return null;
  }

  return tag;
}

function shouldDebugForceLevelupTutorial() {
  if (typeof window === 'undefined') {
    return false;
  }

  // Development-only QA route. Production builds ignore tutorial debug params.
  if (!import.meta.env.DEV) {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  return params.get('debugForceLevelup') === '1'
    || params.get('debugLevelupTutorial') === '1'
    || params.get('debugTutorial') === 'levelup'
    || params.get('debugTutorial') === 'all';
}

function getDebugEvolutionReadyTag() {
  if (typeof window === 'undefined') {
    return null;
  }

  const tag = new URLSearchParams(window.location.search).get('debugEvolutionReady');

  if (!DEBUG_EVOLUTION_TAGS.has(tag)) {
    return null;
  }

  return tag;
}

function getDebugDinoId() {
  if (typeof window === 'undefined') {
    return null;
  }

  const dinoId = new URLSearchParams(window.location.search).get('debugDino');

  if (!DEBUG_DINO_IDS.has(dinoId)) {
    return null;
  }

  return dinoId;
}

function getDebugStageId() {
  if (typeof window === 'undefined') {
    return null;
  }

  const stageId = new URLSearchParams(window.location.search).get('debugStage');

  if (!DEBUG_STAGE_IDS.has(stageId)) {
    return null;
  }

  return stageId;
}

function getDebugDifficultyId() {
  if (typeof window === 'undefined') {
    return null;
  }

  const difficultyId = new URLSearchParams(window.location.search).get('debugDifficulty');

  if (!['normal', 'hard', 'expert'].includes(difficultyId)) {
    return null;
  }

  return difficultyId;
}

function getDebugMode() {
  if (typeof window === 'undefined') {
    return null;
  }

  const mode = new URLSearchParams(window.location.search).get('debugMode');

  return ['standard', 'endless', 'zero'].includes(mode) ? mode : null;
}

function isDebugGimmicksEnabled() {
  return typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debugGimmicks') === '1';
}

function isDebugGimmickFast() {
  return typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debugGimmickFast') === '1';
}

function getDebugFlag(name) {
  if (typeof window === 'undefined') {
    return false;
  }

  return new URLSearchParams(window.location.search).get(name) === '1';
}

function getDebugSkillLevel() {
  if (typeof window === 'undefined') {
    return 1;
  }

  const value = Number(new URLSearchParams(window.location.search).get('debugSkillLevel'));

  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.min(5, Math.floor(value)));
}

function getDebugAdaptationAllLevel() {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = Number(new URLSearchParams(window.location.search).get('debugAdaptationAllLevel'));

  if (!Number.isFinite(value)) {
    return null;
  }

  return Math.max(0, Math.min(5, Math.floor(value)));
}

function getDebugUnlockZeroRoute() {
  if (typeof window === 'undefined') {
    return null;
  }

  const params = new URLSearchParams(window.location.search);

  return params.get('debugUnlockZeroRoute')
    ?? params.get('debugZeroEvolution')
    ?? null;
}

export class PlayScene {
  constructor({
    canvas,
    width,
    height,
    gameState = new GameState(),
    saveManager = null,
    audioManager = null,
    assetLoader = null,
    tutorialUi = null,
    gamepadManager = null,
    onHome = null,
    onTitle = null,
    onOptions = null,
  }) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.onHome = onHome;
    this.onTitle = onTitle;
    this.onOptions = onOptions;
    this.audioManager = audioManager;
    this.saveManager = saveManager;
    this.optionsSettings = this.saveManager?.getOptionsSettings?.() ?? null;
    this.assetLoader = assetLoader;
    this.tutorialUi = tutorialUi;
    this.gamepadManager = gamepadManager;
    this.isActive = true;
    this.isTutorialPaused = false;
    this.pendingUltimateTutorialAfterEvolution = false;
    this.view = new Container();
    this.world = new Container();
    this.backgroundLayer = new Container();
    this.visibilityBackgroundLift = new Graphics();
    this.mapLayer = new Graphics();
    this.gimmickLayer = new Container();
    this.gimmickWarningGraphics = new Graphics();
    this.visibilityGuideLayer = new Graphics();
    this.depthLayer = new Container();
    this.effectLayer = new Container();
    this.uiLayer = new Container();
    this.vignette = new Graphics();
    this.damageFlash = new Graphics();
    this.bossDefeatFxLayer = new Graphics();
    this.bossDefeatAssetLayer = new Container();
    this.bossDeathExplosionSprite = new Sprite(Texture.EMPTY);
    this.bossDeathShockwaveSprite = new Sprite(Texture.EMPTY);
    this.zeroBossDeathCoreSprite = new Sprite(Texture.EMPTY);
    this.bossDeathTextures = new Map();
    this.levelUpUi = new LevelUpUi({
      width,
      height,
      onSelect: (option) => this.selectLevelUpOption(option),
      onReroll: () => this.audioManager?.play('ui_click'),
    });
    this.evolutionReadyUi = new EvolutionReadyUi({
      width,
      height,
      onSelect: (candidate) => this.selectEvolutionCandidate(candidate),
    });
    this.evolutionSequence = new EvolutionSequence({ width, height });
    this.evolutionWarningLayer = new Container();
    this.evolutionWarningBg = new Graphics();
    this.evolutionWarningTitle = new Text({
      text: '',
      style: {
        fill: '#ffd36b',
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0,
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 252,
        dropShadow: true,
        dropShadowColor: '#090102',
        dropShadowBlur: 3,
      },
    });
    this.bossWarningLayer = new Container();
    this.bossWarningBg = new Graphics();
    this.bossWarningArrow = new Graphics();
    this.bossWarningPanelSprite = new Sprite(Texture.EMPTY);
    this.bossWarningChipSprite = new Sprite(Texture.EMPTY);
    this.bossWarningTextures = new Map();
    this.bossWarningText = new Text({
      text: '',
      style: {
        fill: '#ff3848',
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0,
      },
    });
    this.zeroPhaseLayer = new Container();
    this.zeroPhaseDim = new Graphics();
    this.zeroPhaseFallbackPanel = new Graphics();
    this.zeroPhasePanelSprite = new Sprite(Texture.EMPTY);
    this.zeroPhaseChipSprite = new Sprite(Texture.EMPTY);
    this.zeroPhaseNoiseSprite = new Sprite(Texture.EMPTY);
    this.zeroPhaseCoreSprite = new Sprite(Texture.EMPTY);
    this.zeroPhaseTitle = new Text({
      text: '',
      style: {
        fill: '#ffffff',
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: 0,
        align: 'center',
      },
    });
    this.zeroPhaseSubtitle = new Text({
      text: '',
      style: {
        fill: '#d7fbff',
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0,
        align: 'center',
        dropShadow: true,
        dropShadowColor: '#020006',
        dropShadowBlur: 4,
      },
    });
    this.zeroPhaseTimer = 0;
    this.zeroPhaseDuration = 0;
    this.zeroPhaseVariant = 'phase';
    this.zeroPhaseShownKeys = new Set();
    this.zeroPhaseQueue = [];
    this.zeroPhaseTextures = new Map();
    this.zeroPhaseNoiseTextures = null;
    this.zeroPhaseCoreTextures = null;
    this.zeroPhaseNoiseFrame = 0;
    this.zeroPhaseCoreFrame = 0;
    this.zeroPhaseNoiseTimer = 0;
    this.zeroPhaseCoreTimer = 0;
    this.zeroPhaseNoiseFps = 16;
    this.zeroPhaseCoreFps = 14;
    this.evolutionWarningText = new Text({
      text: '',
      style: {
        fill: '#e7fff6',
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0,
      },
    });
    this.resultUi = new ResultUi({
      width,
      height,
      assetLoader,
      onRetry: () => {
        this.audioManager?.play('ui_click');
        this.restart();
      },
      onHome: () => {
        this.audioManager?.play('ui_click');
        this.returnHome();
      },
      onTitle: () => {
        this.audioManager?.play('ui_cancel');
        this.returnTitleFromPause();
      },
    });
    this.pauseUi = new PauseUi({
      width,
      height,
      onResume: () => {
        this.audioManager?.play('ui_click');
        this.resumePause();
      },
      onSettings: () => {
        this.audioManager?.play('ui_click');
        this.openOptionsFromPause();
      },
      onEndRun: () => {
        this.audioManager?.play('ui_confirm');
        this.endRunFromPause();
      },
      onTitle: () => {
        this.audioManager?.play('ui_cancel');
        this.returnTitleFromPause();
      },
    });
    this.gameState = gameState;
    this.applyDebugDinoIfRequested();
    this.applyDebugStageIfRequested();
    this.applyDebugDifficultyIfRequested();
    this.stageConfig = getStageConfig(this.gameState.selectedStage);
    this.difficultyConfig = getDifficultyConfig(this.gameState.selectedDifficulty);
    this.dinoConfig = getDinoConfig(this.gameState.selectedDino);
    this.player = new Player({
      assetLoader: this.assetLoader,
      assetKey: this.getPlayerAssetKey(),
      sheetKey: this.getPlayerSheetKey(),
    });
    this.hud = new Hud({ width, height });
    this.spawnSystem = new SpawnSystem({
      stageBounds: STAGE_BOUNDS,
      viewWidth: width,
      viewHeight: height,
      assetLoader: this.assetLoader,
    });
    this.combatSystem = new CombatSystem({ assetLoader: this.assetLoader });
    this.ultimateSystem = new UltimateSystem({ width, height, assetLoader: this.assetLoader });
    this.researchPickupModifiers = {
      magnetRadiusMultiplier: 1,
      pullMultiplier: 1,
    };
    this.pickupModifiers = {
      ...this.researchPickupModifiers,
    };
    this.applyRunModifiers();
    this.syncZeroEvolutionUnlocks();
    this.applyDebugResearchUnlockIfRequested();
    this.applyDebugAdaptationSkillsIfRequested();
    this.applyDebugAdaptationAllLevelIfRequested();
    this.applyDebugEvolutionIfRequested();
    this.applyDebugSpecialReadyIfRequested();
    this.pickups = this.createPickups();
    this.enemies = [];
    this.enemyProjectiles = [];
    this.bosses = [];
    this.nextBossTime = this.getInitialBossTime();
    this.bossSpawnInterval = this.getBossSpawnInterval();
    this.resetZeroBossProgress();
    this.bossWarningTimer = 0;
    this.bossWarningDuration = 0;
    this.stageGimmicks = [];
    this.stageGimmickConfig = null;
    this.stageGimmickTimer = 0;
    this.stageGimmickIndex = 0;
    this.pendingLevelUps = [];
    this.levelUpFreezeTimer = 0;
    this.isLevelUpUiOpen = false;
    this.evolutionWarningTimer = 0;
    this.evolutionWarningLayer.visible = false;
    this.evolutionWarningTimer = 0;
    this.evolutionReadyTimer = 0;
    this.isEvolutionReadyUiOpen = false;
    this.evolutionFeedbackTimer = 0;
    this.evolutionAwakenShakePlayed = false;
    this.evolutionDiscoveryResult = null;
    this.resultSaveInfo = null;
    this.resultSoundPlayed = false;
    this.bossClearSequence = null;
    this.pickupBursts = [];
    this.pickupPopups = [];
    this.damageFlashTimer = 0;
    this.damageFlash.clear();
    this.screenShakeTimer = 0;
    this.screenShakeIntensity = 0;

    this.camera = {
      x: 0,
      y: 0,
      visibleWidth: width / WORLD_ZOOM,
      visibleHeight: height / WORLD_ZOOM,
    };
    this.input = {
      active: false,
      source: null,
      pointerId: null,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      x: 0,
      y: 0,
      power: 0,
    };
    this.gamepadInput = {
      index: null,
      connected: false,
      lastUltimatePressed: false,
      lastPausePressed: false,
    };
    this.gamepadNoticeTimer = 0;
    this.gamepadNoticeBg = new Graphics();
    this.gamepadNoticeText = new Text({
      text: '',
      style: {
        fill: '#e7fff6',
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0,
        align: 'center',
        dropShadow: true,
        dropShadowColor: '#02080c',
        dropShadowBlur: 3,
      },
    });
    this.handleGamepadConnected = (event) => this.handleGamepadConnection(event?.gamepad, true);
    this.handleGamepadDisconnected = (event) => this.handleGamepadConnection(event?.gamepad, false);
    this.lastTileKey = '';
    this.stageBackgroundTexture = null;
    this.stageBackgroundKey = null;
    this.stageBackgroundStatus = 'fallback';
    this.depthLayer.sortableChildren = true;

    this.view.addChild(
      this.world,
      this.vignette,
      this.damageFlash,
      this.bossDefeatFxLayer,
      this.bossDefeatAssetLayer,
      this.uiLayer,
      this.resultUi.view,
      this.pauseUi.view,
      this.bossWarningLayer,
      this.zeroPhaseLayer,
      this.evolutionWarningLayer,
      this.evolutionReadyUi.view,
      this.evolutionSequence.view,
      this.levelUpUi.view,
    );
    this.world.addChild(
      this.backgroundLayer,
      this.visibilityBackgroundLift,
      this.mapLayer,
      this.gimmickLayer,
      this.visibilityGuideLayer,
      this.depthLayer,
      this.effectLayer,
    );
    this.gimmickLayer.addChild(this.gimmickWarningGraphics);
    this.world.scale.set(WORLD_ZOOM);
    this.loadStageBackground();
    this.pickups.forEach((pickup) => this.depthLayer.addChild(pickup.view));
    this.depthLayer.addChild(this.player.view);

    this.uiLayer.addChild(this.ultimateSystem.overlay);
    this.createJoystick();
    this.createTinyBuildLabel();
    this.createVignette();
    this.createStageGimmicks();
    this.createBossWarningLayer();
    this.createZeroPhaseLayer();
    this.createBossDeathEffectLayer();
    this.createEvolutionWarningLayer();
    this.uiLayer.addChild(this.hud.view);
    this.createGamepadNotice();
    this.bindInput();
    this.updateCamera(1);
    this.updateMap(true);
    this.applyDebugEvolutionReadyIfRequested();
    this.hud.update(this.gameState, this.getActiveBoss(), this.getHudLayoutOptions());
    this.triggerZeroStartNotice();
    this.playDebugEvolutionDemoIfRequested();
  }

  show() {
    this.isActive = true;
    this.view.visible = true;
  }

  hide() {
    this.isActive = false;
    this.clearInput();
    this.view.visible = false;
  }

  update(delta) {
    this.levelUpUi.update?.(delta);
    this.pauseUi.update?.(delta);
    this.resultUi.update?.(delta);
    this.updateGamepadInput(delta);
    this.updateGamepadNotice(delta);
    this.updateBossClearSequence(delta);
    this.updateZeroPhaseNotice(delta);
    this.ensureRunBgm();

    if (this.bossClearSequence) {
      this.player.setMoveInput({ x: 0, y: 0, power: 0 });
      this.player.updateVisuals(delta * 0.28);
      this.updatePickupBursts(delta);
      this.updateDamageFlash(delta);
      this.updateBossWarning(delta);
      this.updateCamera(delta * 0.28);
      this.updateMap(false);
      this.updateJoystick();
      this.hud.update(this.gameState, this.getActiveBoss(), this.getHudLayoutOptions());
      return;
    }

    if (this.isLevelUpSequenceActive()) {
      this.updateLevelUpSequence(delta);
      this.updateEvolutionWarning(delta);
      this.updateBossWarning(delta);
      this.hud.update(this.gameState, this.getActiveBoss(), this.getHudLayoutOptions());
      return;
    }

    if (this.isEvolutionReadySequenceActive()) {
      this.updateEvolutionReadySequence(delta);
      this.updateEvolutionWarning(delta);
      this.updateBossWarning(delta);
      this.hud.update(this.gameState, this.getActiveBoss(), this.getHudLayoutOptions());
      return;
    }

    if (this.evolutionFeedbackTimer > 0) {
      this.updateEvolutionFeedback(delta);
      this.updateEvolutionWarning(delta);
      this.updateBossWarning(delta);
      this.hud.update(this.gameState, this.getActiveBoss(), this.getHudLayoutOptions());
      return;
    }

    this.gameState.update(delta);

    if (!this.gameState.isPaused && !this.isTutorialPaused && !this.gameState.isGameOver) {
      this.updateUltimateCharge(delta);
      this.player.setMoveInput(this.input);
      this.player.update(delta);
      this.applyPlayerStatusMovement();
      this.player.clampToBounds(STAGE_BOUNDS);
      this.applyStageGimmicks(delta);
      this.updatePickups(delta);
      this.updateEnemies(delta);
      this.updateEnemyProjectiles(delta);
      this.updateBosses(delta);
      const combatResult = this.combatSystem.update(delta, this.player, this.getAttackTargets(), this.effectLayer);

      if (combatResult?.targets?.length > 0) {
        this.player.playAction('attack');
        this.playNormalAttackAudio(combatResult);
      }

      if (combatResult?.shake > 0) {
        this.triggerScreenShake(combatResult.shake);
      }

      const ultimateResult = this.ultimateSystem.update(delta, this.player, this.getAttackTargets(), this.effectLayer);

      if (ultimateResult?.shake > 0) {
        this.player.playAction('attack');
        this.triggerScreenShake(ultimateResult.shake);
      }

      this.cleanupDefeatedEnemies();
      this.cleanupDefeatedBosses();
    } else {
      this.player.setMoveInput({ x: 0, y: 0, power: 0 });
      if (this.gameState.isGameOver) {
        this.player.playAction('death');
      }
      this.player.updateVisuals(delta);
      this.input.x = 0;
      this.input.y = 0;
      this.input.power = 0;
      this.ultimateSystem.update(0, this.player, this.getAttackTargets(), this.effectLayer);
    }

    this.updatePlayerDamageState();
    this.updateVisibilityGuideLayer();
    this.updatePickupBursts(delta);
    this.updateDamageFlash(delta);
    this.updateBossWarning(delta);
    this.updateZeroPhaseNotice(0);
    this.updateCamera(delta);
    this.updateMap(false);
    this.updateJoystick();
    this.hud.update(this.gameState, this.getActiveBoss(), this.getHudLayoutOptions());
    this.updatePauseUi();
    this.updateResultUi();
    this.updateEvolutionWarning(delta);
    this.queueEvolutionReadyIfNeeded();
  }

  getHudLayoutOptions() {
    return {
      suppressBossBar: this.isHudNoticeActive(),
      offsetBossBarForBranch: Boolean(this.gameState.selectedEvolution),
    };
  }

  isHudNoticeActive() {
    return this.bossWarningTimer > 0
      || (
        this.gameState.selectedMode === 'zero'
        && this.zeroPhaseTimer > 0
        && this.zeroPhaseLayer.visible
      );
  }

  ensureRunBgm() {
    if (!this.isActive || this.gameState.isGameOver) {
      return;
    }

    const boss = this.getActiveBoss();
    const expectedBgmId = boss ? this.getBossBgmId(boss) : this.getBaseBgmId();

    this.audioManager?.ensureBgmPlaying?.(expectedBgmId);
  }

  updatePauseUi() {
    if (this.gameState.isPaused && !this.gameState.isGameOver) {
      this.pauseUi.show(this.gameState);
      return;
    }

    if (!this.gameState.isGameOver) {
      this.pauseUi.hide();
    }
  }

  refreshRunConfig() {
    this.applyDebugStageIfRequested();
    this.applyDebugModeIfRequested();
    this.applyDebugDifficultyIfRequested();
    this.applyRuinsZeroPreReleaseLock();
    this.stageConfig = getStageConfig(this.gameState.selectedStage);
    this.difficultyConfig = getDifficultyConfig(this.gameState.selectedDifficulty);
    this.dinoConfig = getDinoConfig(this.gameState.selectedDino);
    this.applyOptionsSettings();
    this.publishDebugRunState();
  }

  publishDebugRunState() {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const hasDebugParam = [...params.keys()].some((key) => key.startsWith('debug'));

    if (!hasDebugParam) {
      return;
    }

    try {
      window.__EVOLUTION_ZERO_RUN_DEBUG__ = {
        stage: this.gameState.selectedStage,
        difficulty: this.gameState.selectedDifficulty,
        mode: this.gameState.selectedMode,
        dino: this.gameState.selectedDino,
        stageLabel: this.stageConfig?.label ?? null,
        difficultyLabel: this.difficultyConfig?.label ?? null,
        gimmickEnabled: this.stageGimmickConfig?.enabled ?? null,
        timestamp: Date.now(),
      };
    } catch {
      // Debug inspection state is optional; never let it interrupt gameplay.
    }
    try {
      document.querySelector('#app').__EVOLUTION_ZERO_RUN_DEBUG__ = {
        stage: this.gameState.selectedStage,
        difficulty: this.gameState.selectedDifficulty,
        mode: this.gameState.selectedMode,
        dino: this.gameState.selectedDino,
        stageLabel: this.stageConfig?.label ?? null,
        difficultyLabel: this.difficultyConfig?.label ?? null,
        gimmickEnabled: this.stageGimmickConfig?.enabled ?? null,
        timestamp: Date.now(),
      };
    } catch {
      // Optional debug inspection state only.
    }
  }

  applyOptionsSettings(settings) {
    const nextSettings = settings ?? this.saveManager?.getOptionsSettings?.();
    this.optionsSettings = nextSettings ?? this.optionsSettings ?? {};
    const effects = this.optionsSettings.effects ?? {};
    const controls = this.optionsSettings.controls ?? {};
    const display = this.optionsSettings.display ?? {};

    if (this.combatSystem) {
      this.combatSystem.damageNumbersEnabled = effects.damageNumbers !== false;
      this.combatSystem.simpleEffects = effects.simpleEffects === true;
    }

    if (this.joystick?.container) {
      this.joystick.container.visible = controls.virtualStick !== false;
    }

    if (this.effectLayer) {
      this.effectLayer.alpha = effects.simpleEffects === true ? 0.84 : 1;
    }

    if (this.gimmickWarningGraphics) {
      this.gimmickWarningGraphics.visible = controls.controlGuide !== false;
    }

    if (this.vignette) {
      const visibilityConfig = this.getVisibilityAssistConfig();
      const baseVignetteAlpha = display.backgroundDim === false ? 0.48 : 1;
      this.vignette.alpha = baseVignetteAlpha * visibilityConfig.vignetteMultiplier;
    }

    this.applyVisibilityAssistVisuals();

    if (this.hud?.view) {
      const hudScale = display.hudSize === 'small' ? 0.96 : display.hudSize === 'large' ? 1.02 : 1;
      this.hud.view.scale.set(hudScale);
      this.hud.view.position.set((this.width - this.width * hudScale) / 2, 0);
    }
  }

  applyRunModifiers() {
    this.refreshRunConfig();
    const research = this.saveManager?.getData().researchLevels ?? {};
    const bodyResearch = getBodyResearchBonuses(research);

    this.gameState.researchLevels = { ...research };
    this.gameState.playerMaxHp = this.dinoConfig.maxHp + bodyResearch.maxHpBonus;
    this.gameState.playerHp = this.gameState.playerMaxHp;
    this.gameState.playerDamageMultiplier = (this.dinoConfig.damageTakenMultiplier ?? 1) * (bodyResearch.damageTakenMultiplier ?? 1);
    this.gameState.expGainMultiplier = bodyResearch.expMultiplier ?? 1;
    this.player.applyDinoConfig(this.dinoConfig);
    this.player.moveSpeed += bodyResearch.moveSpeedBonus;
    this.researchPickupModifiers = {
      magnetRadiusMultiplier: bodyResearch.pickupMagnetMultiplier ?? 1,
      pullMultiplier: 1,
    };
    this.resetPickupModifiersToResearch();
    this.combatSystem.applyDinoConfig(this.dinoConfig);
    this.combatSystem.applyResearchBonuses({
      attackDamageBonus: bodyResearch.legacyAttackDamageBonus,
      attackIntervalMultiplier: bodyResearch.attackIntervalMultiplier,
    });
    this.combatSystem.damage = Math.max(1, Math.round(this.combatSystem.damage * (bodyResearch.attackDamageMultiplier ?? 1)));
  }

  applyDebugResearchUnlockIfRequested() {
    if (!getDebugFlag('debugResearchUnlock') && !getDebugFlag('debugAdaptationSkills')) {
      return;
    }

    this.gameState.researchLevels = {
      ...(this.gameState.researchLevels ?? {}),
      [ADAPTATION_RESEARCH_IDS.acceleratedBlades]: 1,
      [ADAPTATION_RESEARCH_IDS.predatorMarking]: 1,
      [ADAPTATION_RESEARCH_IDS.flameBreath]: 1,
    };
    this.gameState.isDebugResearchUnlock = true;
  }

  applyDebugAdaptationSkillsIfRequested() {
    if (!getDebugFlag('debugAdaptationSkills')) {
      return;
    }

    ADAPTATION_SKILLS.forEach((skill) => {
      const level = getDebugSkillLevel();
      const existing = this.gameState.skills[skill.id];

      this.gameState.skills[skill.id] = {
        id: skill.id,
        name: skill.name,
        type: skill.type,
        tag: skill.tag ?? null,
        level: Math.max(existing?.level ?? 0, level),
        maxLevel: skill.maxLevel,
        adaptationTags: skill.tag ? [skill.tag] : [],
        usesSkillSlot: true,
        countsAsAdaptation: true,
        iconKey: skill.iconKey ?? null,
      };
      this.combatSystem.applyAdaptationSkill?.(skill, level);
    });

    this.gameState.isDebugAdaptationSkills = true;
  }

  applyDebugAdaptationAllLevelIfRequested() {
    const level = getDebugAdaptationAllLevel();

    if (level === null) {
      return;
    }

    ['speed', 'hunting', 'attack'].forEach((tag) => {
      this.gameState.adaptationProgress[tag] = Math.max(this.gameState.adaptationProgress[tag] ?? 0, level);
    });
    this.gameState.playerLevel = Math.max(this.gameState.playerLevel, level >= 3 ? 8 : this.gameState.playerLevel);
    this.gameState.detectZeroEvolutionCandidate();
  }

  syncZeroEvolutionUnlocks() {
    const saveRoutes = this.saveManager?.getData?.().unlockedZeroRoutes ?? {};
    const debugRoute = getDebugUnlockZeroRoute();
    const routes = { ...saveRoutes };

    if (debugRoute) {
      routes[debugRoute] = {
        ...(typeof routes[debugRoute] === 'object' ? routes[debugRoute] : {}),
        unlocked: true,
        debug: true,
      };
    }

    this.gameState.setUnlockedZeroRoutes?.(routes);
  }

  applyDebugDinoIfRequested() {
    const dinoId = getDebugDinoId();

    if (!dinoId) {
      return;
    }

    this.gameState.selectedDino = dinoId;
  }

  applyDebugStageIfRequested() {
    const stageId = getDebugStageId();

    if (!stageId) {
      return;
    }

    this.gameState.selectedStage = stageId;
  }

  applyDebugDifficultyIfRequested() {
    const difficultyId = getDebugDifficultyId();

    if (!difficultyId) {
      return;
    }

    this.gameState.selectedDifficulty = difficultyId;
    if (!['endless', 'zero'].includes(this.gameState.selectedMode)) {
      this.gameState.selectedMode = 'standard';
    }
  }

  applyDebugModeIfRequested() {
    const mode = getDebugMode();

    if (!mode) {
      return;
    }

    this.gameState.selectedMode = mode;

    if (mode === 'endless') {
      this.gameState.selectedDifficulty = 'normal';
    }

    if (mode === 'zero' && !getDebugDifficultyId()) {
      this.gameState.selectedDifficulty = 'expert';
    }
  }

  applyRuinsZeroPreReleaseLock() {
    if (this.gameState.selectedStage !== 'ruins' || this.gameState.selectedMode !== 'zero') {
      return;
    }

    const allowRuinsZeroDebug = new URLSearchParams(window.location.search).get('debugAllowRuinsZero') === '1';

    if (allowRuinsZeroDebug) {
      return;
    }

    this.gameState.selectedMode = 'standard';
    this.gameState.selectedDifficulty = 'expert';
  }

  applyDebugEvolutionIfRequested() {
    const tag = getDebugEvolutionTag() ?? getDebugForceEvolutionTag();

    if (!tag) {
      return;
    }

    if (tag === 'zero') {
      this.applyDebugZeroEvolution();
      return;
    }

    const candidate = getEvolutionCandidate(tag);

    if (!candidate) {
      return;
    }

    this.seedDebugSkills(tag);
    this.gameState.playerLevel = Math.max(this.gameState.playerLevel, 5);
    this.gameState.evolutionCandidateDetected = true;
    this.gameState.evolutionCandidates[tag] = {
      ...candidate,
      detectedAt: this.gameState.elapsedTime,
      progress: 3,
    };

    const branch = getEvolutionBranch(this.gameState.selectedDino, candidate.tag);
    const selectedEvolution = {
      id: branch?.id ?? getEvolutionBranchId(this.gameState.selectedDino, candidate.tag),
      dinoId: this.gameState.selectedDino,
      tag: candidate.tag,
      mutationName: branch?.mutationName ?? candidate.name,
      evolutionName: branch?.evolutionName ?? candidate.evolutionName,
      normalAttackEffectKey: branch?.normalAttackEffectKey ?? null,
      ultimateId: branch?.ultimateId ?? null,
      selectedAtLevel: this.gameState.playerLevel,
      selectedAtTime: this.gameState.elapsedTime,
    };

    this.gameState.selectedEvolution = selectedEvolution;
    this.gameState.hasEvolved = true;
    this.gameState.isDebugEvolutionHud = true;
    this.applySelectedEvolution(selectedEvolution);
    this.gameState.ultimateGauge = 100;
    this.gameState.ultimateReady = true;

    if (getDebugForceEvolutionTag() === 'zero') {
      this.applyDebugZeroEvolution();
    }
  }

  applyDebugZeroEvolution() {
    this.syncZeroEvolutionUnlocks();
    this.seedDebugSkills('zero');
    this.applyDebugAdaptationAllLevelIfRequested();
    ['speed', 'hunting', 'attack'].forEach((adaptationTag) => {
      this.gameState.adaptationProgress[adaptationTag] = Math.max(this.gameState.adaptationProgress[adaptationTag] ?? 0, 3);
    });
    this.gameState.playerLevel = Math.max(this.gameState.playerLevel, 8);
    this.gameState.detectZeroEvolutionCandidate();
    const selectedEvolution = this.gameState.selectEvolution('zero');

    if (!selectedEvolution) {
      return null;
    }

    this.gameState.isDebugEvolutionHud = true;
    this.applySelectedEvolution(selectedEvolution);
    this.gameState.ultimateGauge = 100;
    this.gameState.ultimateReady = true;
    return selectedEvolution;
  }

  applyDebugEvolutionReadyIfRequested() {
    const tag = getDebugEvolutionReadyTag();

    if (!tag || this.gameState.selectedEvolution) {
      return;
    }

    if (tag === 'zero') {
      this.syncZeroEvolutionUnlocks();
      this.seedDebugSkills(tag);
      ['speed', 'hunting', 'attack'].forEach((adaptationTag) => {
        this.gameState.adaptationProgress[adaptationTag] = Math.max(this.gameState.adaptationProgress[adaptationTag] ?? 0, 3);
      });
      this.gameState.playerLevel = Math.max(this.gameState.playerLevel, 8);
      this.gameState.detectZeroEvolutionCandidate();
    } else {
      const candidate = getEvolutionCandidate(tag);

      if (!candidate) {
        return;
      }

      this.seedDebugSkills(tag);
      this.gameState.playerLevel = Math.max(this.gameState.playerLevel, 5);
      this.gameState.evolutionCandidateDetected = true;
      this.gameState.evolutionCandidates[tag] = {
        ...candidate,
        detectedAt: this.gameState.elapsedTime,
        progress: 3,
      };
    }

    this.evolutionReadyTimer = 0;
    this.isEvolutionReadyUiOpen = false;
  }

  applyDebugSpecialReadyIfRequested() {
    if (
      !(getDebugFlag('debugSpecialReady') || getDebugFlag('debugUltimateBalance'))
      || !this.gameState.selectedEvolution
    ) {
      return;
    }

    this.gameState.ultimateGauge = 100;
    this.gameState.ultimateReady = true;
  }

  playDebugEvolutionDemoIfRequested() {
    if (!this.gameState.selectedEvolution) {
      return;
    }

    const forceTag = getDebugForceEvolutionTag();
    const shouldPlayDemo = getDebugFlag('debugEvolutionDemo') || Boolean(forceTag);

    if (!shouldPlayDemo || this.didPlayDebugEvolutionDemo) {
      return;
    }

    this.didPlayDebugEvolutionDemo = true;
    const discoveryResult = forceTag
      ? this.recordEvolutionDiscovery(this.gameState.selectedEvolution)
      : { isNew: false, discovery: null };

    this.startEvolutionPresentation(this.gameState.selectedEvolution, discoveryResult);
  }

  seedDebugSkills(tag) {
    const ids = DEBUG_EVOLUTION_SKILLS[tag] ?? [];
    const debugLevel = getDebugSkillLevel();

    ids.forEach((id) => {
      const skill = getSkillById(id);

      if (!skill || this.gameState.skills[id]) {
        return;
      }

      this.gameState.skills[id] = {
        id: skill.id,
        name: skill.name,
        type: skill.type,
        tag: skill.tag ?? null,
        level: debugLevel,
        maxLevel: skill.maxLevel,
        adaptationTags: [...skill.adaptationTags],
        usesSkillSlot: skill.usesSkillSlot !== false,
        countsAsAdaptation: skill.countsAsAdaptation !== false,
        iconKey: skill.iconKey ?? null,
      };
      this.combatSystem.applyAdaptationSkill?.(skill, debugLevel);
    });
  }

  resetPickupModifiersToResearch() {
    this.pickupModifiers = {
      magnetRadiusMultiplier: this.researchPickupModifiers?.magnetRadiusMultiplier ?? 1,
      pullMultiplier: this.researchPickupModifiers?.pullMultiplier ?? 1,
    };
  }

  isLevelUpSequenceActive() {
    return this.levelUpFreezeTimer > 0 || this.isLevelUpUiOpen || this.pendingLevelUps.length > 0;
  }

  updateLevelUpSequence(delta) {
    this.clearInput();
    this.updateJoystick();

    if (this.levelUpFreezeTimer > 0) {
      this.levelUpFreezeTimer = Math.max(0, this.levelUpFreezeTimer - delta);
      return;
    }

    if (!this.isLevelUpUiOpen && this.pendingLevelUps.length > 0) {
      const next = this.pendingLevelUps[0];
      this.isLevelUpUiOpen = true;
      this.audioManager?.play('levelup');
      this.levelUpUi.show({
        fromLevel: next.from,
        toLevel: next.to,
        rerolls: 1,
        gameState: this.gameState,
        preferAdaptationFirst: this.shouldPrioritizeFirstLevelUpAdaptation(),
      });
      this.showLevelUpTutorialIfNeeded();
    }
  }

  shouldPrioritizeFirstLevelUpAdaptation() {
    return shouldDebugForceLevelupTutorial()
      || !this.saveManager?.isTutorialComplete?.('levelup');
  }

  showLevelUpTutorialIfNeeded() {
    const forceTutorial = shouldDebugForceLevelupTutorial();
    if (!this.tutorialUi || (!forceTutorial && this.saveManager?.isTutorialComplete?.('levelup'))) {
      return;
    }

    this.tutorialUi.show({
      id: 'levelup',
      pages: [
        {
          title: 'レベルアップ',
          body: '適応技は戦闘で使うスキルです。\n威力・範囲・再発動を見て選びましょう。',
          target: 'カード選択',
          targetId: 'levelup.cards',
          tooltipPosition: 'top',
        },
        {
          title: '適応と進化',
          body: '能力強化はHPや攻撃力を伸ばします。\n適応Lvは進化条件にも関係します。',
          target: '適応技カード',
          targetId: 'levelup.adaptation',
          tooltipPosition: 'bottom',
        },
      ],
      getTargetBounds: (targetId) => {
        const width = this.width;
        const bounds = {
          'levelup.cards': { x: 28, y: 292, width: width - 56, height: 342, radius: 14 },
          'levelup.adaptation': { x: 28, y: 292, width: width - 56, height: 112, radius: 14 },
        };
        return bounds[targetId] ?? null;
      },
      onComplete: (id) => this.saveManager?.markTutorialComplete?.(id),
      onSkip: (id) => this.saveManager?.markTutorialComplete?.(id),
    });
  }

  showPlayEventTutorialIfNeeded(id, pages, { force = false } = {}) {
    if (
      !this.tutorialUi
      || this.tutorialUi.view?.visible
      || (!force && this.saveManager?.isTutorialComplete?.(id))
    ) {
      return false;
    }

    this.isTutorialPaused = true;
    const finish = (tutorialId) => {
      this.isTutorialPaused = false;
      this.saveManager?.markTutorialComplete?.(tutorialId);
    };

    this.tutorialUi.show({
      id,
      pages,
      getTargetBounds: (targetId) => {
        const bounds = {
          'play.ultimate': { x: this.width - 116, y: Math.max(670, this.height - 154), width: 94, height: 94, radius: 18 },
          'play.warning': { x: 42, y: 126, width: this.width - 84, height: 128, radius: 12 },
        };
        return bounds[targetId] ?? null;
      },
      onComplete: finish,
      onSkip: finish,
    });

    return true;
  }

  showUltimateTutorialIfNeeded({ force = false } = {}) {
    return this.showPlayEventTutorialIfNeeded('ultimate', [
      {
        title: '必殺技',
        body: '必殺技が使用可能です。\nボタンを押すと強力な攻撃を発動できます。',
        target: '必殺ボタン',
        targetId: 'play.ultimate',
        tooltipPosition: 'top',
      },
    ], { force });
  }

  showWarningGuideTutorialIfNeeded({ force = false } = {}) {
    return this.showPlayEventTutorialIfNeeded('warningGuide', [
      {
        title: '警告ガイド',
        body: '赤い範囲は危険です。\n敵やギミックの攻撃範囲なので、表示されたら離れましょう。',
        target: '警告表示',
        targetId: 'play.warning',
        tooltipPosition: 'bottom',
      },
    ], { force });
  }

  isEvolutionReadySequenceActive() {
    return this.evolutionReadyTimer > 0
      || this.isEvolutionReadyUiOpen
      || (
        this.gameState.canEvolve
        && !this.gameState.isPaused
        && !this.gameState.isGameOver
      );
  }

  updateEvolutionReadySequence(delta) {
    this.clearInput();
    this.updateJoystick();

    if (this.evolutionReadyTimer > 0) {
      this.evolutionReadyTimer = Math.max(0, this.evolutionReadyTimer - delta);
      return;
    }

    this.syncZeroEvolutionUnlocks();
    this.gameState.detectZeroEvolutionCandidate();

    if (!this.isEvolutionReadyUiOpen && this.gameState.canEvolve) {
      this.isEvolutionReadyUiOpen = true;
      const candidates = this.gameState.getEvolutionCandidateList().map((candidate) => {
        const branch = getEvolutionBranch(this.gameState.selectedDino, candidate.tag);

        return {
          ...candidate,
          id: branch?.id ?? getEvolutionBranchId(this.gameState.selectedDino, candidate.tag),
          dinoId: this.gameState.selectedDino,
          mutationName: branch?.mutationName ?? candidate.name,
          evolutionName: branch?.evolutionName ?? candidate.evolutionName,
          heroPath: branch?.heroPath ?? candidate.heroPath ?? candidate.image ?? null,
          portraitPath: branch?.portraitPath ?? candidate.portraitPath ?? null,
        };
      });
      this.evolutionReadyUi.show(candidates);
    }
  }

  queueEvolutionReadyIfNeeded() {
    if (this.gameState.isGameOver || this.gameState.isPaused) {
      return;
    }

    this.syncZeroEvolutionUnlocks();
    this.gameState.detectZeroEvolutionCandidate();

    if (this.gameState.canEvolve && !this.isEvolutionReadyUiOpen && this.evolutionReadyTimer <= 0) {
      this.evolutionReadyTimer = 0.55;
    }
  }

  bindInput() {
    if (typeof window !== 'undefined') {
      window.addEventListener('gamepadconnected', this.handleGamepadConnected);
      window.addEventListener('gamepaddisconnected', this.handleGamepadDisconnected);
      this.refreshConnectedGamepad();
    }

    this.canvas.addEventListener('pointerdown', (event) => {
      if (!this.isActive) {
        return;
      }

      this.audioManager?.unlockAudio();

      const point = this.toDesignPoint(event);

      if (point.y < HUD_INPUT_HEIGHT || this.isPointInUltimateButton(point)) {
        return;
      }

      if (this.gameState.isPaused || this.gameState.isGameOver) {
        return;
      }

      this.input.active = true;
      this.input.source = 'touch';
      this.input.pointerId = event.pointerId;
      this.input.startX = point.x;
      this.input.startY = point.y;
      this.input.currentX = point.x;
      this.input.currentY = point.y;
      this.canvas.setPointerCapture(event.pointerId);
      this.updateInputVector();
    });

    this.canvas.addEventListener('pointermove', (event) => {
      if (!this.isActive) {
        return;
      }

      if (!this.input.active || event.pointerId !== this.input.pointerId) {
        return;
      }

      const point = this.toDesignPoint(event);
      this.input.currentX = point.x;
      this.input.currentY = point.y;
      this.updateInputVector();
    });

    const clearInput = (event) => {
      if (!this.isActive) {
        return;
      }

      if (event.pointerId !== this.input.pointerId) {
        return;
      }

      this.input.active = false;
      this.input.source = null;
      this.input.pointerId = null;
      this.input.x = 0;
      this.input.y = 0;
      this.input.power = 0;
    };

    this.canvas.addEventListener('pointerup', clearInput);
    this.canvas.addEventListener('pointercancel', clearInput);

    this.hud.pauseButton.on('pointertap', () => {
      this.audioManager?.play('ui_click');
      this.clearInput();
      this.togglePause();
    });
    this.hud.ultimateButton.on('pointertap', () => {
      this.activateUltimate();
    });

  }

  clearInput() {
    this.input.active = false;
    this.input.source = null;
    this.input.pointerId = null;
    this.input.x = 0;
    this.input.y = 0;
    this.input.power = 0;
  }

  togglePause() {
    if (this.gameState.isGameOver) {
      return;
    }

    this.gameState.togglePause();

    if (this.gameState.isPaused) {
      this.pauseUi.show(this.gameState);
      return;
    }

    this.pauseUi.hide();
  }

  resumePause() {
    if (this.gameState.isGameOver) {
      return;
    }

    this.gameState.isPaused = false;
    this.pauseUi.hide();
    this.clearInput();
  }

  endRunFromPause() {
    if (this.gameState.isGameOver) {
      return;
    }

    this.clearInput();
    this.pauseUi.hide();
    this.gameState.isPaused = false;
    this.gameState.playerHp = 0;
    this.gameState.markRunAbandoned?.();
    this.updateResultUi();
  }

  completeStageByBossClear() {
    if (this.gameState.isGameOver) {
      return;
    }

    this.clearInput();
    this.pauseUi.hide();
    this.gameState.markStageClear?.('boss');
    this.updateResultUi();
  }

  returnTitleFromPause() {
    this.clearInput();
    this.pauseUi.hide();
    this.gameState.isPaused = false;
    this.saveManager?.saveSelections(this.gameState);

    if (this.onTitle) {
      this.onTitle();
      return;
    }

    this.returnHome();
  }

  openOptionsFromPause() {
    this.clearInput();
    this.gameState.isPaused = true;

    if (this.onOptions) {
      this.onOptions();
      return;
    }

    this.pauseUi.handleSettings();
  }

  toDesignPoint(event) {
    const rect = this.canvas.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * this.width,
      y: ((event.clientY - rect.top) / rect.height) * this.height,
    };
  }

  updateInputVector() {
    const dx = this.input.currentX - this.input.startX;
    const dy = this.input.currentY - this.input.startY;
    const distance = Math.hypot(dx, dy);
    const assistEnabled = this.optionsSettings?.controls?.touchAssist === true;
    const deadZone = assistEnabled ? 5 : 8;
    const maxDistance = assistEnabled ? 68 : 76;

    if (distance < deadZone) {
      this.input.x = 0;
      this.input.y = 0;
      this.input.power = 0;
      return;
    }

    const power = Math.min((distance - deadZone) / (maxDistance - deadZone), 1);
    this.input.x = dx / distance;
    this.input.y = dy / distance;
    this.input.power = power;
    this.input.source = 'touch';
  }

  createGamepadNotice() {
    this.gamepadNoticeBg.visible = false;
    this.gamepadNoticeText.visible = false;
    this.gamepadNoticeText.anchor.set(0.5);
    this.gamepadNoticeBg.eventMode = 'none';
    this.gamepadNoticeText.eventMode = 'none';
    this.uiLayer.addChild(this.gamepadNoticeBg, this.gamepadNoticeText);
  }

  showGamepadNotice(message) {
    this.gamepadNoticeTimer = 2.6;
    this.gamepadNoticeText.text = message;
    this.gamepadNoticeBg.visible = true;
    this.gamepadNoticeText.visible = true;
    this.drawGamepadNotice(1);
  }

  updateGamepadNotice(delta) {
    if (this.gamepadNoticeTimer <= 0) {
      this.gamepadNoticeBg.visible = false;
      this.gamepadNoticeText.visible = false;
      return;
    }

    this.gamepadNoticeTimer = Math.max(0, this.gamepadNoticeTimer - delta);
    const alpha = Math.min(1, this.gamepadNoticeTimer / 0.35, 0.7 + this.gamepadNoticeTimer * 0.25);
    this.drawGamepadNotice(alpha);
  }

  drawGamepadNotice(alpha = 1) {
    const width = 190;
    const height = 34;
    const x = (this.width - width) / 2;
    const y = 110;

    this.gamepadNoticeBg
      .clear()
      .roundRect(x, y, width, height, 10)
      .fill({ color: 0x03121a, alpha: 0.78 * alpha })
      .stroke({ color: 0x35d7ff, width: 1.3, alpha: 0.72 * alpha })
      .roundRect(x + 5, y + 5, width - 10, height - 10, 7)
      .stroke({ color: 0x8ff3ff, width: 0.7, alpha: 0.32 * alpha });
    this.gamepadNoticeText.position.set(this.width / 2, y + height / 2);
    this.gamepadNoticeText.alpha = alpha;
  }

  handleGamepadConnection(gamepad, connected) {
    if (!gamepad) {
      return;
    }

    if (connected) {
      this.gamepadInput.index = gamepad.index;
      this.gamepadInput.connected = true;
      this.gamepadInput.lastUltimatePressed = false;
      this.gamepadInput.lastPausePressed = false;
      this.showGamepadNotice('コントローラー接続');
      return;
    }

    if (this.gamepadInput.index === gamepad.index) {
      this.gamepadInput.index = null;
      this.gamepadInput.connected = false;
      this.gamepadInput.lastUltimatePressed = false;
      this.gamepadInput.lastPausePressed = false;
      if (this.input.source === 'gamepad') {
        this.clearInput();
      }
      this.showGamepadNotice('コントローラー切断');
    }
  }

  refreshConnectedGamepad() {
    const gamepads = this.getGamepads();
    const active = gamepads.find((gamepad) => gamepad?.connected);

    if (!active) {
      return null;
    }

    if (this.gamepadInput.index !== active.index || !this.gamepadInput.connected) {
      this.gamepadInput.index = active.index;
      this.gamepadInput.connected = true;
    }

    return active;
  }

  getActiveGamepad() {
    const gamepads = this.getGamepads();
    let gamepad = this.gamepadInput.index !== null ? gamepads[this.gamepadInput.index] : null;

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

  handleGamepadActions(actions) {
    if (!this.isActive || !this.gamepadManager?.connected) {
      return false;
    }

    if (this.gameState.isPaused) {
      if (actions.pausePressed || actions.cancelPressed) {
        this.audioManager?.play('ui_click');
        this.resumePause();
        return true;
      }
      if (this.pauseUi.handleGamepadAction?.(actions)) {
        return true;
      }
      return false;
    }

    if (this.gameState.isGameOver && this.resultUi.handleGamepadAction?.(actions)) {
      return true;
    }

    if (this.isLevelUpSequenceActive() && this.levelUpUi.handleGamepadAction?.(actions)) {
      return true;
    }

    if (this.isEvolutionReadySequenceActive() && this.evolutionReadyUi.handleGamepadAction?.(actions)) {
      return true;
    }

    if (actions.pausePressed && !this.isLevelUpSequenceActive() && !this.isEvolutionReadySequenceActive()) {
      this.audioManager?.play('ui_click');
      this.clearInput();
      this.togglePause();
      return true;
    }

    if (actions.specialPressed && !this.gameState.isPaused) {
      this.activateUltimate();
      return true;
    }

    return false;
  }
  updateGamepadInput() {
    if (!this.isActive) {
      return;
    }

    if (!this.gamepadManager) {
      this.updateLegacyGamepadInput();
      return;
    }

    if (!this.gamepadManager.connected) {
      if (this.input.source === 'gamepad') {
        this.clearInput();
      }
      return;
    }

    if (
      this.gameState.isPaused
      || this.gameState.isGameOver
      || this.isTutorialPaused
      || this.isLevelUpSequenceActive()
      || this.isEvolutionReadySequenceActive()
      || this.evolutionFeedbackTimer > 0
    ) {
      if (this.input.source === 'gamepad') {
        this.clearInput();
      }
      return;
    }

    if (this.gamepadManager.movePower <= 0) {
      if (this.input.source === 'gamepad') {
        this.clearInput();
      }
      return;
    }

    this.input.active = true;
    this.input.source = 'gamepad';
    this.input.pointerId = null;
    this.input.x = this.gamepadManager.moveX;
    this.input.y = this.gamepadManager.moveY;
    this.input.power = this.gamepadManager.movePower;
  }

  updateLegacyGamepadInput() {
    if (!this.isActive) {
      return;
    }

    const gamepad = this.getActiveGamepad();

    if (!gamepad) {
      if (this.input.source === 'gamepad') {
        this.clearInput();
      }
      return;
    }

    const pausePressed = Boolean(gamepad.buttons?.[9]?.pressed || gamepad.buttons?.[8]?.pressed);
    const ultimatePressed = Boolean(gamepad.buttons?.[0]?.pressed);

    if (pausePressed && !this.gamepadInput.lastPausePressed && !this.isLevelUpSequenceActive() && !this.isEvolutionReadySequenceActive()) {
      this.audioManager?.play('ui_click');
      this.clearInput();
      this.togglePause();
    }

    if (ultimatePressed && !this.gamepadInput.lastUltimatePressed && !this.gameState.isPaused) {
      this.activateUltimate();
    }

    this.gamepadInput.lastPausePressed = pausePressed;
    this.gamepadInput.lastUltimatePressed = ultimatePressed;

    if (
      this.gameState.isPaused
      || this.gameState.isGameOver
      || this.isTutorialPaused
      || this.isLevelUpSequenceActive()
      || this.isEvolutionReadySequenceActive()
      || this.evolutionFeedbackTimer > 0
    ) {
      if (this.input.source === 'gamepad') {
        this.clearInput();
      }
      return;
    }

    const rawX = Number(gamepad.axes?.[0] ?? 0);
    const rawY = Number(gamepad.axes?.[1] ?? 0);
    const magnitude = Math.min(1, Math.hypot(rawX, rawY));

    if (magnitude <= GAMEPAD_DEAD_ZONE) {
      if (this.input.source === 'gamepad') {
        this.clearInput();
      }
      return;
    }

    const power = Math.min(1, (magnitude - GAMEPAD_DEAD_ZONE) / (1 - GAMEPAD_DEAD_ZONE));
    this.input.active = true;
    this.input.source = 'gamepad';
    this.input.pointerId = null;
    this.input.x = rawX / magnitude;
    this.input.y = rawY / magnitude;
    this.input.power = power;
  }

  isPointInUltimateButton(point) {
    if (!this.gameState.selectedEvolution) {
      return false;
    }

    const dx = point.x - (this.width - 66);
    const dy = point.y - (this.height - 116);

    return Math.hypot(dx, dy) <= 74;
  }

  activateUltimate() {
    if (
      this.gameState.isPaused
      || this.gameState.isGameOver
      || !this.gameState.selectedEvolution
      || this.ultimateSystem.isActive
    ) {
      return;
    }

    if (!this.gameState.consumeUltimate()) {
      return;
    }

    this.clearInput();
    const result = this.ultimateSystem.activate(this.gameState.selectedEvolution);
    this.audioManager?.play(this.getUltimateAudioId(this.gameState.selectedEvolution));
    this.saveManager?.recordDailyProgress?.('specialUsed', 1);
    this.gameState.invincibleTime = Math.max(this.gameState.invincibleTime, (result?.duration ?? 1.4) + 0.35);
    this.player.playAction('attack');
    this.player.triggerEvolutionPulse((result?.duration ?? 1.4) + 0.45);
    this.triggerScreenShake(result?.shake ?? 3);
  }

  getUltimateAudioId(evolution) {
    const zeroUltimateByEvolution = {
      velociraptor_zero: 'special_abyss_slash',
      triceratops_zero: 'special_ignis_charge',
      tyrannosaurus_zero: 'special_omega_burst',
      spinosaurus_zero: 'ultimate_zero',
    };

    if (zeroUltimateByEvolution[evolution?.id]) {
      return zeroUltimateByEvolution[evolution.id];
    }

    const normalUltimateByTag = {
      speed: 'normal_special_speed',
      hunting: 'normal_special_hunting',
      attack: 'normal_special_attack',
      zero: 'ultimate_zero',
    };

    return normalUltimateByTag[evolution?.tag] ?? 'special';
  }

  getNormalAttackAudioId(combatResult = null) {
    const pattern = combatResult?.pattern;

    if (pattern === 'trexBiteShock') {
      return 'tyrannosaurus_bite_se';
    }

    if (pattern === 'triceratopsHornImpact') {
      return 'triceratops_attack_se';
    }

    if (pattern === 'raptorClaw') {
      return 'raptor_attack_se';
    }

    if (pattern === 'spinosaurusWaterSlash') {
      return 'spinosaurus_water_attack_se';
    }

    const dinoId = this.gameState.selectedDinoId ?? this.gameState.selectedDino?.id ?? this.gameState.selectedDino;

    if (dinoId === 'tyrannosaurus') {
      return 'tyrannosaurus_bite_se';
    }

    if (dinoId === 'triceratops') {
      return 'triceratops_attack_se';
    }

    if (dinoId === 'velociraptor') {
      return 'raptor_attack_se';
    }

    if (dinoId === 'spinosaurus') {
      return 'spinosaurus_water_attack_se';
    }

    return 'attack';
  }

  playNormalAttackAudio(combatResult = null) {
    if (!this.audioManager) {
      return;
    }

    const now = typeof performance !== 'undefined' ? performance.now() / 1000 : Date.now() / 1000;
    const attackId = this.getNormalAttackAudioId(combatResult);

    if (now - (this.lastNormalAttackSoundAt ?? -999) >= 0.1) {
      this.lastNormalAttackSoundAt = now;
      this.audioManager.play(attackId, {
        cooldown: 0.02,
        maxInstances: 2,
      });
    }

    if (now - (this.lastEnemyHitSoundAt ?? -999) >= 0.16) {
      this.lastEnemyHitSoundAt = now;
      this.audioManager.play('enemy_hit', {
        cooldown: 0.04,
        maxInstances: 2,
        volume: 0.65,
      });
    }
  }

  updateCamera(delta) {
    this.camera.visibleWidth = this.width / WORLD_ZOOM;
    this.camera.visibleHeight = this.height / WORLD_ZOOM;
    const targetX = this.clamp(
      this.player.position.x - this.camera.visibleWidth / 2,
      STAGE_BOUNDS.left,
      STAGE_BOUNDS.right - this.camera.visibleWidth,
    );
    const targetY = this.clamp(
      this.player.position.y - CAMERA_FOCUS_Y / WORLD_ZOOM,
      STAGE_BOUNDS.top,
      STAGE_BOUNDS.bottom - this.camera.visibleHeight,
    );
    const follow = 1 - Math.pow(0.0018, Math.min(delta, 0.05));

    this.camera.x += (targetX - this.camera.x) * follow;
    this.camera.y += (targetY - this.camera.y) * follow;

    if (this.screenShakeTimer > 0) {
      this.screenShakeTimer = Math.max(0, this.screenShakeTimer - delta);
      const shake = this.screenShakeIntensity * (this.screenShakeTimer / 0.16);
      this.world.position.set(
        -this.camera.x * WORLD_ZOOM + (Math.random() - 0.5) * shake,
        -this.camera.y * WORLD_ZOOM + (Math.random() - 0.5) * shake,
      );
      return;
    }

    this.world.position.set(-this.camera.x * WORLD_ZOOM, -this.camera.y * WORLD_ZOOM);
  }

  triggerScreenShake(intensity) {
    if (this.optionsSettings?.effects?.screenShake === false) {
      return;
    }

    this.screenShakeTimer = 0.16;
    this.screenShakeIntensity = Math.max(this.screenShakeIntensity, intensity);
  }

  updatePickups(delta) {
    const playerCollider = this.player.getCollider();

    this.pickups.forEach((pickup) => {
      pickup.update(delta, this.player, this.pickupModifiers);

      if (!pickup.isCollected && CollisionSystem.circlesOverlap(playerCollider, pickup.getCollider())) {
        pickup.collect();
        if (pickup.type === 'heal') {
          const healed = this.gameState.healPlayer(pickup.healAmount || this.getHealPickupAmount());
          if (healed > 0) {
            const displayedHeal = Math.max(1, Math.round(healed));
            this.audioManager?.play('pickup_heal');
            this.saveManager?.recordDailyProgress?.('pickupHeal', 1);
            this.spawnPickupBurst(pickup.position.x, pickup.position.y, 2, 'heal');
            this.spawnPickupPopup(pickup.position.x, pickup.position.y - 24, `HP +${displayedHeal}`, 0x65e878);
          }
        } else {
          this.audioManager?.play('pickup_exp');
          this.saveManager?.recordDailyProgress?.('expCollected', 1);
          this.spawnPickupBurst(pickup.position.x, pickup.position.y, pickup.value);
          const expValue = Math.max(1, Math.round(pickup.value * (this.gameState.expGainMultiplier ?? 1)));
          this.spawnPickupPopup(pickup.position.x, pickup.position.y - 22, `EXP +${expValue}`, pickup.value >= 3 ? 0xffd36b : 0x7cf7ff);
          this.queueLevelUps(this.gameState.addExp(expValue));
        }
      }

      pickup.view.zIndex = pickup.position.y;
    });

    this.player.view.zIndex = this.player.position.y + 1;
  }

  updateEnemies(delta) {
    this.spawnSystem.update(
      delta,
      this.gameState,
      this.camera,
      this.player,
      this.enemies,
      (enemy) => {
        this.enemies.push(enemy);
        this.depthLayer.addChild(enemy.view);
      },
    );

    const playerCollider = this.player.getCollider();

    this.enemies.forEach((enemy) => {
      enemy.update(delta, this.player);
      this.updateRuinsEnemyAbility(delta, enemy);
      enemy.view.zIndex = enemy.position.y;

      if (!enemy.isDead && CollisionSystem.circlesOverlap(playerCollider, enemy.getCollider())) {
        if (enemy.contactSlowMultiplier && enemy.contactSlowMultiplier < 1) {
          const slow = Math.pow(enemy.contactSlowMultiplier, delta);
          this.player.velocity.x *= slow;
          this.player.velocity.y *= slow;
        }

        if (this.gameState.damagePlayer(enemy.damage)) {
          this.audioManager?.play('hit');
          this.triggerDamageFlash(enemy.damage);
        }
      }
    });
  }

  updateRuinsEnemyAbility(delta, enemy) {
    if (enemy.isDead) {
      return;
    }

    if (enemy.projectileCooldown > 0) {
      enemy.projectileTimer -= delta;
      const distance = Math.hypot(this.player.position.x - enemy.position.x, this.player.position.y - enemy.position.y);

      if (enemy.projectileTimer <= 0 && distance <= enemy.projectileRange) {
        this.spawnEnemyProjectile(enemy);
        enemy.setAnimation?.('attack', true, true);
        enemy.projectileTimer = enemy.projectileCooldown;
      }
    }

    if (enemy.electroCooldown > 0) {
      enemy.electroTimer -= delta;
      const distance = Math.hypot(this.player.position.x - enemy.position.x, this.player.position.y - enemy.position.y);

      if (enemy.electroTimer <= 0 && distance <= enemy.electroRadius * 1.25) {
        this.spawnEnemyElectroPulse(enemy);
        enemy.setAnimation?.('attack', true, true);
        enemy.electroTimer = enemy.electroCooldown;
      }
    }

    if (enemy.summonCooldown > 0) {
      enemy.summonTimer -= delta;

      if (enemy.summonTimer <= 0 && this.enemies.length < 58) {
        this.spawnEnemySummons(enemy);
        enemy.setAnimation?.('attack', true, true);
        enemy.summonTimer = enemy.summonCooldown;
      }
    }
  }

  spawnEnemyProjectile(enemy) {
    const dx = this.player.position.x - enemy.position.x;
    const dy = this.player.position.y - enemy.position.y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const speed = enemy.projectileSpeed || 220;
    const view = new Graphics();

    view
      .circle(0, 0, 8)
      .fill({ color: 0xdff8ff, alpha: 0.9 })
      .circle(0, 0, 16)
      .stroke({ color: 0x7bd8ff, width: 2, alpha: 0.72 })
      .moveTo(-18, 0)
      .lineTo(18, 0)
      .stroke({ color: 0xa46cff, width: 2, alpha: 0.7 });
    view.rotation = Math.atan2(dy, dx);
    view.position.set(enemy.position.x, enemy.position.y - 8);
    this.effectLayer.addChild(view);
    this.enemyProjectiles.push({
      type: 'ruinsShot',
      x: enemy.position.x,
      y: enemy.position.y - 8,
      vx: (dx / distance) * speed,
      vy: (dy / distance) * speed,
      radius: 12,
      damage: enemy.projectileDamage || 8,
      ttl: 2.2,
      view,
    });
  }

  spawnEnemyElectroPulse(enemy) {
    const view = new Graphics();
    const radius = enemy.electroRadius || 84;

    view
      .circle(0, 0, radius * 0.68)
      .fill({ color: 0x7bd8ff, alpha: 0.08 })
      .circle(0, 0, radius)
      .stroke({ color: 0xa46cff, width: 3, alpha: 0.6 })
      .circle(0, 0, radius * 0.44)
      .stroke({ color: 0xe8fbff, width: 2, alpha: 0.48 });
    view.position.set(enemy.position.x, enemy.position.y);
    this.effectLayer.addChild(view);
    this.enemyProjectiles.push({
      type: 'ruinsElectroPulse',
      x: enemy.position.x,
      y: enemy.position.y,
      vx: 0,
      vy: 0,
      radius,
      damage: enemy.electroDamage || 7,
      slowMultiplier: enemy.electroSlowMultiplier || 0.74,
      ttl: 0.56,
      age: 0,
      didHit: false,
      view,
    });
  }

  spawnEnemySummons(enemy) {
    const count = Math.min(2, Math.max(1, enemy.summonCount || 1));

    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count + Math.random() * 0.55;
      const distance = 54 + Math.random() * 34;
      const summon = new Enemy({
        x: this.clamp(enemy.position.x + Math.cos(angle) * distance, STAGE_BOUNDS.left, STAGE_BOUNDS.right),
        y: this.clamp(enemy.position.y + Math.sin(angle) * distance, STAGE_BOUNDS.top, STAGE_BOUNDS.bottom),
        enemyType: enemy.summonEnemyType || 'ruinsShooter',
        assetLoader: this.assetLoader,
      });

      this.enemies.push(summon);
      this.depthLayer.addChild(summon.view);
    }
  }

  updateEnemyProjectiles(delta) {
    this.enemyProjectiles = this.enemyProjectiles.filter((projectile) => {
      projectile.ttl -= delta;
      projectile.age = (projectile.age ?? 0) + delta;
      projectile.x += projectile.vx * delta;
      projectile.y += projectile.vy * delta;

      if (projectile.view) {
        projectile.view.position.set(projectile.x, projectile.y);
        projectile.view.alpha = Math.max(0, Math.min(1, projectile.ttl * 2));
        if (projectile.type === 'ruinsElectroPulse') {
          const scale = 0.72 + Math.sin(Math.min(1, projectile.age / 0.56) * Math.PI) * 0.28;
          projectile.view.scale.set(scale);
        }
      }

      const hitDistance = Math.hypot(this.player.position.x - projectile.x, this.player.position.y - projectile.y);
      const canHit = !projectile.didHit && hitDistance <= projectile.radius + (this.player.radius ?? 18);

      if (canHit) {
        if (projectile.slowMultiplier) {
          this.player.velocity.x *= projectile.slowMultiplier;
          this.player.velocity.y *= projectile.slowMultiplier;
        }

        if (this.gameState.damagePlayer(projectile.damage)) {
          this.audioManager?.play('hit');
          this.triggerDamageFlash(projectile.damage);
        }

        projectile.didHit = true;

        if (projectile.type !== 'ruinsElectroPulse') {
          projectile.ttl = 0;
        }
      }

      if (projectile.ttl <= 0) {
        projectile.view?.destroy();
        return false;
      }

      return true;
    });
  }

  updateBosses(delta) {
    this.spawnBossIfNeeded();
    const playerCollider = this.player.getCollider();

    this.bosses.forEach((boss) => {
      boss.update(delta, this.player);
      boss.view.zIndex = boss.position.y + 12;

      const summonCount = boss.consumeSummonRequest?.() ?? 0;
      if (summonCount > 0) {
        this.spawnBossSummons(boss, summonCount);
      }

      const meleeDamage = boss.consumeMeleeHit?.(playerCollider) ?? 0;
      if (meleeDamage > 0 && this.gameState.damagePlayer(meleeDamage)) {
        this.audioManager?.play('hit');
        this.triggerDamageFlash(meleeDamage);
      }

      this.updateBossHazardAttacks(delta, boss);

      if (!boss.isDead && CollisionSystem.circlesOverlap(playerCollider, boss.getCollider())) {
        if (this.gameState.damagePlayer(boss.damage)) {
          this.audioManager?.play('hit');
          this.triggerDamageFlash(boss.damage);
        }
      }
    });
  }

  updateBossHazardAttacks(delta, boss) {
    const attacks = boss.config?.attacks ?? {};

    if (boss.isDead || !attacks) {
      return;
    }

    boss.bossHazardTimers ??= {};
    boss.bossHazardRecoveryTimer = Math.max(0, (boss.bossHazardRecoveryTimer ?? 0) - delta);

    if (boss.bossHazardRecoveryTimer > 0) {
      return;
    }

    const activeBossHazardCount = this.stageGimmicks.filter((gimmick) => (
      gimmick.type?.startsWith?.('boss_')
      && gimmick.age < (gimmick.warningDuration + gimmick.activeDuration)
    )).length;
    const overlapLimit = this.gameState.selectedMode === 'zero'
      ? ((boss.zeroPhase ?? 1) >= 3 ? 3 : 2)
      : this.gameState.selectedDifficulty === 'expert' ? 2 : 1;

    if (activeBossHazardCount >= overlapLimit) {
      return;
    }

    const attackKeys = ['lavaBurst', 'fireFloor', 'poisonMist', 'toxicPool', 'electroPulse', 'laserBeam', 'eclipseBeam', 'gravityField', 'coreBurst'];

    for (const attackKey of attackKeys) {
      const config = attacks[attackKey];

      if (!config?.enabled) {
        continue;
      }

      boss.bossHazardTimers[attackKey] ??= Math.max(1.8, (config.cooldown ?? 8) * 0.58);
      boss.bossHazardTimers[attackKey] -= delta;

      if (boss.bossHazardTimers[attackKey] > 0) {
        continue;
      }

      const countLimit = this.gameState.selectedMode === 'zero'
        ? ((boss.zeroPhase ?? 1) >= 3 ? 4 : 3)
        : this.gameState.selectedDifficulty === 'expert' ? 3 : 2;
      const count = Math.min(countLimit, Math.max(1, config.count ?? 1));

      for (let index = 0; index < count; index += 1) {
        this.spawnBossHazard(boss, attackKey, config, index);
      }

      const cooldownPressure = this.gameState.selectedMode === 'zero'
        ? ((boss.zeroPhase ?? 1) >= 3 ? 0.78 : 0.86)
        : this.gameState.selectedDifficulty === 'expert' ? 0.9 : 1;
      boss.bossHazardTimers[attackKey] = (config.cooldown ?? 8) * cooldownPressure;
      boss.bossHazardRecoveryTimer = this.gameState.selectedMode === 'zero'
        ? ((boss.zeroPhase ?? 1) >= 3 ? 0.38 : 0.46)
        : this.gameState.selectedDifficulty === 'expert' ? 0.58 : 0.75;
      break;
    }
  }

  spawnBossHazard(boss, attackKey, config, offsetIndex = 0) {
    const radius = config.radius ?? 92;
    const position = this.getBossHazardPosition(boss, radius, offsetIndex);
    const isFireFloor = attackKey === 'fireFloor';
    const isToxicPool = attackKey === 'toxicPool';
    const isLaser = attackKey === 'laserBeam' || attackKey === 'eclipseBeam';
    const isPoolHazard = isFireFloor || isToxicPool;
    const width = config.width ?? (isLaser ? (config.lineLength ?? 460) : radius * (isPoolHazard ? 2.55 : 2.35));
    const height = config.height ?? (isLaser ? (config.lineWidth ?? 48) * 1.9 : radius * (isPoolHazard ? 1.42 : 2.35));
    const angleToPlayer = Math.atan2(this.player.position.y - position.y, this.player.position.x - position.x);
    const defaultColor = isLaser || attackKey === 'electroPulse'
      ? 0x7bd8ff
      : attackKey === 'gravityField'
        ? 0xa46cff
        : attackKey === 'coreBurst'
          ? 0xff3848
          : isToxicPool
            ? 0xb6ff35
            : attackKey === 'poisonMist'
              ? 0x9eff63
              : isFireFloor
                ? 0xff8a2f
                : 0xff5a38;
    const defaultAlpha = isLaser
      ? 0.72
      : attackKey === 'gravityField'
        ? 0.62
        : attackKey === 'electroPulse'
          ? 0.74
          : isToxicPool
            ? 0.72
            : attackKey === 'poisonMist'
              ? 0.58
              : isFireFloor
                ? 0.76
                : 0.84;
    const gimmick = {
      type: `boss_${attackKey}`,
      shape: isLaser ? 'line' : 'circle',
      color: config.color ?? defaultColor,
      assetKey: config.assetKey,
      x: position.x,
      y: position.y,
      age: 0,
      warningDuration: config.windup ?? 1.1,
      activeDuration: config.active ?? (isFireFloor ? 2.2 : 0.82),
      damage: config.damage ?? Math.max(8, Math.round(boss.damage * 0.56)),
      radius,
      width,
      height,
      lineLength: config.lineLength,
      lineWidth: config.lineWidth,
      rotation: isLaser ? angleToPlayer : 0,
      hitboxes: isFireFloor || isToxicPool
        ? this.createFireFloorHitboxes(width, height, radius, isToxicPool ? { columns: 3, rows: 2 } : undefined)
        : null,
      slowMultiplier: config.slowMultiplier,
      alpha: config.alpha ?? defaultAlpha,
      view: new Container(),
      warningSprite: new Sprite(Texture.EMPTY),
      sprite: new Sprite(Texture.EMPTY),
      assetLoaded: false,
      warningAssetLoaded: false,
      warningAnimationTimer: 0,
      warningAnimationFrame: 0,
      warningAnimationFps: 12,
      warningAnimationTextures: null,
      animationTimer: 0,
      animationFrame: 0,
      animationFps: 12,
      animationTextures: null,
    };

    gimmick.warningSprite.anchor.set(0.5);
    gimmick.warningSprite.alpha = 0.58;
    gimmick.warningSprite.width = isLaser ? width : radius * 2.15;
    gimmick.warningSprite.height = isLaser ? height : radius * 2.15;
    gimmick.warningSprite.visible = false;
    gimmick.sprite.anchor.set(0.5);
    gimmick.sprite.alpha = gimmick.alpha;
    gimmick.sprite.visible = false;
    gimmick.view.position.set(gimmick.x, gimmick.y);
    gimmick.view.rotation = gimmick.rotation ?? 0;
    gimmick.view.addChild(gimmick.warningSprite);
    gimmick.view.addChild(gimmick.sprite);
    this.gimmickLayer.addChild(gimmick.view);

    this.loadStageGimmickAsset(gimmick, gimmick.assetKey, gimmick);

    if (!isFireFloor) {
      this.loadBossHazardWarningAsset(gimmick, config.warningAssetKey);
    }

    this.stageGimmicks.push(gimmick);
  }

  createFireFloorHitboxes(width, height, baseRadius, { columns = 3, rows = 3 } = {}) {
    const safeColumns = Math.max(1, columns);
    const safeRows = Math.max(1, rows);
    const xSpan = width * (safeColumns >= 4 ? 0.68 : 0.62);
    const ySpan = height * (safeRows >= 4 ? 0.58 : 0.48);
    const xStep = safeColumns > 1 ? xSpan / (safeColumns - 1) : 0;
    const yStep = safeRows > 1 ? ySpan / (safeRows - 1) : 0;
    const hitRadiusScale = safeColumns >= 4 || safeRows >= 4 ? 0.17 : 0.28;
    const maxRadius = safeColumns >= 4 || safeRows >= 4 ? 23 : 36;
    const hitRadius = Math.max(13, Math.min(maxRadius, baseRadius * hitRadiusScale));

    return Array.from({ length: safeRows }, (_, row) => (
      Array.from({ length: safeColumns }, (_, column) => {
        const index = row * safeColumns + column;
        const normalizedX = safeColumns > 1 ? (column / (safeColumns - 1)) - 0.5 : 0;
        const normalizedY = safeRows > 1 ? (row / (safeRows - 1)) - 0.5 : 0;
        const ellipseTaper = 1 - Math.min(0.32, Math.abs(normalizedY) * 0.24 + Math.abs(normalizedX) * 0.12);
        const jitterX = Math.sin(index * 2.17) * xStep * 0.13;
        const jitterY = Math.cos(index * 1.73) * yStep * 0.16;

        return {
          x: ((column - (safeColumns - 1) / 2) * xStep * ellipseTaper) + jitterX,
          y: ((row - (safeRows - 1) / 2) * yStep) + jitterY,
          radius: hitRadius * (0.88 + ((index % 3) * 0.07)),
        };
      })
    )).flat();
  }

  loadBossHazardWarningAsset(gimmick, assetKey) {
    if (!assetKey) {
      return;
    }

    this.assetLoader?.load(assetKey).then((texture) => {
      if (!texture || !gimmick.view || gimmick.view.destroyed) {
        const fallbackKey = this.assetLoader?.getItem?.(assetKey)?.meta?.fallbackKey;

        if (!texture && fallbackKey) {
          this.loadBossHazardWarningAsset(gimmick, fallbackKey);
        }

        return;
      }

      const item = this.assetLoader?.getItem?.(assetKey);
      const animation = this.createGimmickAnimation(texture, item?.meta);

      gimmick.warningAssetLoaded = true;
      gimmick.warningAnimationTextures = null;

      if (animation) {
        gimmick.warningAnimationTextures = animation.textures;
        gimmick.warningAnimationFps = animation.fps;
        gimmick.warningAnimationFrame = 0;
        gimmick.warningAnimationTimer = 0;
        gimmick.warningSprite.texture = animation.textures[0] ?? texture;
      } else {
        gimmick.warningSprite.texture = texture;
      }
    }).catch(() => {});
  }

  getBossHazardPosition(boss, radius, offsetIndex = 0) {
    const targetAngle = Math.atan2(
      this.player.position.y - boss.position.y,
      this.player.position.x - boss.position.x,
    );
    const spread = (offsetIndex - 0.5) * 0.55;
    const distance = 80 + Math.random() * 150;
    const angle = targetAngle + spread + (Math.random() - 0.5) * 0.35;
    const x = this.player.position.x + Math.cos(angle) * distance;
    const y = this.player.position.y + Math.sin(angle) * distance;
    const margin = Math.max(70, radius);

    return {
      x: this.clamp(x, STAGE_BOUNDS.left + margin, STAGE_BOUNDS.right - margin),
      y: this.clamp(y, STAGE_BOUNDS.top + margin, STAGE_BOUNDS.bottom - margin),
    };
  }

  resetZeroBossProgress() {
    this.zeroBossesDefeated = 0;
    this.zeroNextBossPhase = this.getInitialZeroBossPhase();
    this.zeroNextBossTime = this.getZeroBossTime(this.zeroNextBossPhase);
  }

  getInitialZeroBossPhase() {
    if (getDebugFlag('debugZeroFinalBoss')) {
      return 3;
    }

    if (getDebugFlag('debugZeroBoss')) {
      return 2;
    }

    return 1;
  }

  getZeroBossTime(phase) {
    const index = Math.max(0, Math.min(2, phase - 1));

    if (getDebugFlag('debugZeroFinalBoss') || getDebugFlag('debugZeroBoss')) {
      return 8;
    }

    if (getDebugFlag('debugZeroFast') || getDebugFlag('debugZeroBoss') || getDebugFlag('debugZeroFinalBoss')) {
      return ZERO_SCALING_CONFIG.debugBossTimes[index] ?? 8;
    }

    return ZERO_SCALING_CONFIG.bossTimes[index] ?? 110;
  }

  getZeroPhaseGap() {
    return getDebugFlag('debugZeroFast') || getDebugFlag('debugZeroBoss') || getDebugFlag('debugZeroFinalBoss')
      ? ZERO_SCALING_CONFIG.debugPhaseGap
      : ZERO_SCALING_CONFIG.phaseGap;
  }

  spawnBossIfNeeded() {
    if (this.gameState.selectedMode === 'zero') {
      this.spawnZeroBossIfNeeded();
      return;
    }

    if (this.gameState.elapsedTime < this.nextBossTime || this.getActiveBoss()) {
      return;
    }

    const bossConfig = this.getBossConfig();
    const boss = new Boss({
      ...this.getBossSpawnPoint(),
      assetLoader: this.assetLoader,
      assetKey: bossConfig.assetKey ?? ASSET_KEYS.bosses.mutantPredator,
      config: bossConfig,
    });
    this.bosses.push(boss);
    this.depthLayer.addChild(boss.view);
    this.nextBossTime += this.bossSpawnInterval;
    this.triggerBossWarning(boss);
  }

  spawnZeroBossIfNeeded() {
    if (this.zeroNextBossPhase > 3 || this.getActiveBoss() || this.gameState.elapsedTime < this.zeroNextBossTime) {
      return;
    }

    const bossConfig = this.getZeroBossConfig(this.zeroNextBossPhase);
    const boss = new Boss({
      ...this.getBossSpawnPoint(),
      assetLoader: this.assetLoader,
      assetKey: bossConfig.assetKey ?? ASSET_KEYS.bosses.ruinsBoss,
      config: bossConfig,
    });
    boss.zeroPhase = this.zeroNextBossPhase;
    this.bosses.push(boss);
    this.depthLayer.addChild(boss.view);
    this.zeroNextBossPhase += 1;
    this.triggerZeroBossPhaseWarning(boss);
    this.triggerBossWarning(boss);
  }

  spawnBossSummons(boss, count) {
    const spawnCount = Math.min(Math.max(0, count), 4);

    for (let index = 0; index < spawnCount; index += 1) {
      if (this.enemies.length >= 72) {
        return;
      }

      const angle = (Math.PI * 2 * index) / Math.max(1, spawnCount) + Math.random() * 0.45;
      const distance = 72 + Math.random() * 54;
      const enemy = new Enemy({
        x: this.clamp(boss.position.x + Math.cos(angle) * distance, STAGE_BOUNDS.left, STAGE_BOUNDS.right),
        y: this.clamp(boss.position.y + Math.sin(angle) * distance, STAGE_BOUNDS.top, STAGE_BOUNDS.bottom),
        enemyType: boss.config?.attacks?.summon?.enemyType ?? 'swarm',
        assetLoader: this.assetLoader,
      });

      this.enemies.push(enemy);
      this.depthLayer.addChild(enemy.view);
    }
  }

  getBossSpawnPoint() {
    const margin = 230;
    const side = Math.floor(Math.random() * 4);
    let x = this.camera.x + this.camera.visibleWidth / 2;
    let y = this.camera.y + this.camera.visibleHeight / 2;

    if (side === 0) {
      x = this.camera.x + Math.random() * this.camera.visibleWidth;
      y = this.camera.y - margin;
    } else if (side === 1) {
      x = this.camera.x + this.camera.visibleWidth + margin;
      y = this.camera.y + Math.random() * this.camera.visibleHeight;
    } else if (side === 2) {
      x = this.camera.x + Math.random() * this.camera.visibleWidth;
      y = this.camera.y + this.camera.visibleHeight + margin;
    } else {
      x = this.camera.x - margin;
      y = this.camera.y + Math.random() * this.camera.visibleHeight;
    }

    return {
      x: this.clamp(x, STAGE_BOUNDS.left, STAGE_BOUNDS.right),
      y: this.clamp(y, STAGE_BOUNDS.top, STAGE_BOUNDS.bottom),
    };
  }

  getInitialBossTime() {
    if (getDebugFlag('debugBossFast')) {
      return 8;
    }

    if (this.gameState.selectedMode === 'endless') {
      return ENDLESS_SCALING_CONFIG.bossInterval;
    }

    if (this.gameState.selectedDifficulty === 'expert') {
      return 86;
    }

    if (this.gameState.selectedDifficulty === 'hard') {
      return 74;
    }

    return 60;
  }

  getBossSpawnInterval() {
    if (this.gameState.selectedMode !== 'endless') {
      if (this.gameState.selectedDifficulty === 'expert') {
        return 122;
      }

      if (this.gameState.selectedDifficulty === 'hard') {
        return 106;
      }

      return 90;
    }

    if (getDebugFlag('debugEndlessFast') || getDebugFlag('debugEndlessScaling')) {
      return ENDLESS_SCALING_CONFIG.debugBossInterval;
    }

    return ENDLESS_SCALING_CONFIG.bossInterval;
  }

  getEndlessBossScale() {
    if (this.gameState.selectedMode !== 'endless') {
      return { hp: 1, damage: 1, score: 1, exp: 1 };
    }

    const elapsed = this.gameState.elapsedTime ?? 0;
    let phase = ENDLESS_SCALING_CONFIG.phases[0];

    ENDLESS_SCALING_CONFIG.phases.forEach((entry) => {
      if (elapsed >= entry.time) {
        phase = entry;
      }
    });

    const overtime = Math.max(0, elapsed - 600);
    const longRunBonus = Math.min(1.05, overtime / 620);

    return {
      hp: phase.hp + longRunBonus,
      damage: phase.damage + longRunBonus * 0.7,
      score: 1 + Math.min(0.55, elapsed / 700),
      exp: 1 + Math.min(0.25, elapsed / 900),
    };
  }

  getZeroBossScale(phase = 1) {
    if (this.gameState.selectedMode !== 'zero') {
      return { hp: 1, damage: 1, score: 1, exp: 1 };
    }

    if (phase >= 3) {
      return ZERO_SCALING_CONFIG.boss.final;
    }

    if (phase === 2) {
      return ZERO_SCALING_CONFIG.boss.secondary;
    }

    return ZERO_SCALING_CONFIG.boss.first;
  }

  cloneBossConfig(config) {
    return JSON.parse(JSON.stringify(config ?? {}));
  }

  scaleBossConfig(config, scale) {
    return {
      ...config,
      maxHp: Math.max(1, Math.round((config.maxHp ?? 720) * (scale.hp ?? 1))),
      damage: Math.max(1, Math.round((config.damage ?? 24) * (scale.damage ?? 1))),
      scoreReward: Math.max(1, Math.round((config.scoreReward ?? 2400) * (scale.score ?? 1))),
      expReward: Math.max(1, Math.round((config.expReward ?? 18) * (scale.exp ?? 1))),
      attacks: this.scaleBossAttackConfig(config.attacks, scale.damage ?? 1),
    };
  }

  scaleBossAttackConfig(attacks, damageScale = 1) {
    if (!attacks || damageScale === 1) {
      return attacks;
    }

    return Object.fromEntries(Object.entries(attacks).map(([key, attack]) => {
      if (!attack || typeof attack !== 'object') {
        return [key, attack];
      }

      return [key, {
        ...attack,
        damage: typeof attack.damage === 'number'
          ? Math.max(1, Math.round(attack.damage * damageScale))
          : attack.damage,
        damageMultiplier: typeof attack.damageMultiplier === 'number'
          ? Number((attack.damageMultiplier * (1 + (damageScale - 1) * 0.55)).toFixed(3))
          : attack.damageMultiplier,
        cooldown: typeof attack.cooldown === 'number'
          ? Number((attack.cooldown * Math.max(0.72, 1 - (damageScale - 1) * 0.12)).toFixed(2))
          : attack.cooldown,
        radius: typeof attack.radius === 'number'
          ? Math.round(attack.radius * (1 + (damageScale - 1) * 0.14))
          : attack.radius,
        lineLength: typeof attack.lineLength === 'number'
          ? Math.round(attack.lineLength * (1 + (damageScale - 1) * 0.08))
          : attack.lineLength,
        lineWidth: typeof attack.lineWidth === 'number'
          ? Math.round(attack.lineWidth * (1 + (damageScale - 1) * 0.12))
          : attack.lineWidth,
      }];
    }));
  }

  getZeroBossConfig(phase = 1) {
    const difficulty = this.gameState.selectedDifficulty === 'normal' ? 'expert' : this.gameState.selectedDifficulty;
    const base = this.cloneBossConfig(getStageBossConfig(this.gameState.selectedStage, difficulty));
    const scale = this.getZeroBossScale(phase);

    if (phase >= 3) {
      const stageId = this.gameState.selectedStage;
      const finalBase = this.cloneBossConfig(getStageBossConfig('ruins', 'expert'));
      const stageFinals = {
        jungle: {
          id: 'jungle_zero_final_boss',
          name: 'アビス・カノピー',
          assetKey: ASSET_KEYS.bosses.jungleZeroFinalBoss,
          summonEnemyType: 'swarm',
          beamColor: 0x8ffcff,
          fieldColor: 0x5c2aff,
          burstColor: 0xd7f8ff,
          attackAssetKey: ASSET_KEYS.bossEffects.jungleZeroFinalAttackSheet,
        },
        swamp: {
          id: 'swamp_zero_final_boss',
          name: 'ミアズマ・オメガ',
          assetKey: ASSET_KEYS.bosses.swampZeroFinalBoss,
          summonEnemyType: 'swampPoison',
          beamColor: 0xb8ff62,
          fieldColor: 0x8f4dff,
          burstColor: 0xc7ff5d,
          attackAssetKey: ASSET_KEYS.bossEffects.swampZeroFinalAttackSheet,
        },
        volcano: {
          id: 'volcano_zero_final_boss',
          name: '\u30f4\u30a9\u30eb\u30b1\u30fc\u30ce\u30fb\u30aa\u30e1\u30ac',
          assetKey: ASSET_KEYS.bosses.volcanoZeroFinalBoss,
          summonEnemyType: 'volcanoHeavy',
          beamColor: 0xffb36a,
          fieldColor: 0x7d2dff,
          burstColor: 0xff5935,
          warningAssetKey: ASSET_KEYS.bossEffects.volcanoZeroFinalWarningSheet,
          attackAssetKey: ASSET_KEYS.bossEffects.volcanoZeroFinalAttackSheet,
        },
      };
      const stageFinal = stageFinals[stageId] ?? {
        id: 'zero_eclipse_protocol',
        name: 'エクリプス・プロトコル',
        assetKey: ASSET_KEYS.bosses.zeroEclipseProtocol,
        summonEnemyType: 'ruinsSummoner',
        beamColor: 0xe8fbff,
        fieldColor: 0xa46cff,
        burstColor: 0xff3848,
        attackAssetKey: ASSET_KEYS.bossEffects.zeroCoreBurstSheet,
      };
      const finalConfig = this.scaleBossConfig({
        ...finalBase,
        id: stageFinal.id,
        name: stageFinal.name,
        assetKey: stageFinal.assetKey,
        speed: Math.max(34, Math.round((finalBase.speed ?? 38) * 0.96)),
        radius: Math.max(66, finalBase.radius ?? 62),
        attacks: {
          melee: { ...(finalBase.attacks?.melee ?? {}), cooldown: 5.2, windup: 0.82, duration: 0.48, radius: 158, damageMultiplier: 0.9 },
          eclipseBeam: {
            enabled: true,
            cooldown: 8.8,
            windup: 1.2,
            active: 0.62,
            radius: 108,
            damage: 24,
            count: 1,
            lineLength: 560,
            lineWidth: 52,
            color: stageFinal.beamColor,
            alpha: 0.68,
            assetKey: stageFinal.attackAssetKey,
            warningAssetKey: stageFinal.warningAssetKey ?? ASSET_KEYS.bossEffects.zeroEclipseWarningSheet,
          },
          gravityField: {
            enabled: true,
            cooldown: 10.6,
            windup: 1.25,
            active: 1.8,
            radius: 138,
            damage: 7,
            count: 1,
            slowMultiplier: 0.48,
            color: stageFinal.fieldColor,
            alpha: 0.58,
            assetKey: stageFinal.attackAssetKey,
            warningAssetKey: stageFinal.warningAssetKey ?? ASSET_KEYS.bossEffects.zeroEclipseWarningSheet,
          },
          coreBurst: {
            enabled: true,
            cooldown: 12.4,
            windup: 1.35,
            active: 0.82,
            radius: 162,
            damage: 29,
            count: 1,
            color: stageFinal.burstColor,
            alpha: 0.74,
            assetKey: stageFinal.attackAssetKey,
            warningAssetKey: stageFinal.warningAssetKey ?? ASSET_KEYS.bossEffects.zeroEclipseWarningSheet,
          },
          summon: { ...(finalBase.attacks?.summon ?? {}), enabled: true, cooldown: 14.5, windup: 1.1, count: 3, enemyType: stageFinal.summonEnemyType },
        },
        effectKeys: {
          roarWave: stageFinal.attackAssetKey,
          summonSpore: ASSET_KEYS.bossEffects.zeroSummonGateSheet,
        },
      }, scale);

      finalConfig.name = stageFinal.name;
      return this.applyDebugBossConfig(finalConfig);
    }

    if (phase === 2) {
      const selectedStageId = this.gameState.selectedStage;
      const baseBossId = base.id ?? '';
      const inferredStageId = baseBossId.includes('jungle')
        ? 'jungle'
        : baseBossId.includes('swamp')
          ? 'swamp'
          : selectedStageId;
      const stageSecondBosses = {
        jungle: {
          id: 'jungle_zero_second_boss',
          name: '\u30ab\u30ce\u30d4\u30fc\u30fb\u30ec\u30a4\u30b9',
          assetKey: ASSET_KEYS.bosses.jungleZeroSecondBoss,
          warningAssetKey: ASSET_KEYS.bossEffects.jungleZeroSecondWarningSheet,
          attackAssetKey: ASSET_KEYS.bossEffects.jungleZeroSecondAttackSheet,
          summonEnemyType: 'swarm',
          beamColor: 0x9bfbff,
          fieldColor: 0x5b26cf,
          burstColor: 0xcdfdff,
          speedMultiplier: 1.14,
          hpMultiplier: 1.18,
          radius: 58,
        },
        swamp: {
          id: 'swamp_zero_second_boss',
          name: '\u30f4\u30a7\u30ce\u30e0\u30fb\u30ec\u30a4\u30b9',
          assetKey: ASSET_KEYS.bosses.swampZeroSecondBoss,
          warningAssetKey: ASSET_KEYS.bossEffects.swampZeroSecondWarningSheet,
          attackAssetKey: ASSET_KEYS.bossEffects.swampZeroSecondAttackSheet,
          summonEnemyType: 'swampPoison',
          beamColor: 0xb6ff68,
          fieldColor: 0x7d42d8,
          burstColor: 0xd5ff65,
          speedMultiplier: 0.98,
          hpMultiplier: 1.22,
          radius: 62,
        },
        volcano: {
          id: 'volcano_zero_second_boss',
          name: '\u30f4\u30a9\u30eb\u30ab\u30f3\u30fb\u30d6\u30eb\u30fc\u30c8',
          assetKey: ASSET_KEYS.bosses.volcanoZeroSecondBoss,
          warningAssetKey: ASSET_KEYS.bossEffects.volcanoZeroSecondWarningSheet,
          attackAssetKey: ASSET_KEYS.bossEffects.volcanoZeroSecondAttackSheet,
          summonEnemyType: 'volcanoBomber',
          beamColor: 0xffb06a,
          fieldColor: 0x7a30e8,
          burstColor: 0xff5f32,
          speedMultiplier: 0.96,
          hpMultiplier: 1.24,
          radius: 64,
        },
      };
      const stageId = stageSecondBosses[selectedStageId] ? selectedStageId : inferredStageId;
      const secondBoss = stageSecondBosses[stageId];

      if (secondBoss) {
        const secondConfig = this.scaleBossConfig({
          ...base,
          id: secondBoss.id,
          name: secondBoss.name,
          assetKey: secondBoss.assetKey,
          maxHp: Math.round((base.maxHp ?? 720) * secondBoss.hpMultiplier),
          speed: Math.max(34, Math.round((base.speed ?? 40) * secondBoss.speedMultiplier)),
          radius: Math.max(secondBoss.radius, base.radius ?? secondBoss.radius),
          attacks: {
            ...(base.attacks ?? {}),
            melee: {
              ...(base.attacks?.melee ?? {}),
              cooldown: 5.5,
              windup: 0.72,
              duration: 0.42,
              radius: stageId === 'jungle' ? 132 : 142,
              damageMultiplier: stageId === 'jungle' ? 0.76 : 0.82,
            },
            eclipseBeam: {
              enabled: true,
              cooldown: stageId === 'jungle' ? 7.8 : 8.6,
              windup: 1.05,
              active: 0.54,
              radius: 88,
              damage: stageId === 'jungle' ? 17 : 18,
              count: 1,
              lineLength: stageId === 'jungle' ? 470 : 430,
              lineWidth: stageId === 'jungle' ? 44 : 50,
              color: secondBoss.beamColor,
              alpha: 0.64,
              assetKey: secondBoss.attackAssetKey,
              warningAssetKey: secondBoss.warningAssetKey,
            },
            gravityField: {
              enabled: true,
              cooldown: stageId === 'jungle' ? 11.6 : 10.2,
              windup: 1.0,
              active: stageId === 'jungle' ? 1.25 : 1.75,
              radius: stageId === 'jungle' ? 112 : 124,
              damage: stageId === 'jungle' ? 4 : 5,
              count: 1,
              slowMultiplier: stageId === 'jungle' ? 0.72 : 0.56,
              color: secondBoss.fieldColor,
              alpha: 0.54,
              assetKey: secondBoss.attackAssetKey,
              warningAssetKey: secondBoss.warningAssetKey,
            },
            coreBurst: {
              enabled: true,
              cooldown: stageId === 'jungle' ? 12.4 : 13.2,
              windup: 1.08,
              active: 0.62,
              radius: stageId === 'jungle' ? 134 : 146,
              damage: stageId === 'jungle' ? 19 : 21,
              count: 1,
              color: secondBoss.burstColor,
              alpha: 0.7,
              assetKey: secondBoss.attackAssetKey,
              warningAssetKey: secondBoss.warningAssetKey,
            },
            summon: {
              ...(base.attacks?.summon ?? {}),
              enabled: true,
              cooldown: stageId === 'jungle' ? 17.5 : 16.5,
              windup: 1.0,
              count: stageId === 'jungle' ? 2 : 1,
              enemyType: secondBoss.summonEnemyType,
            },
          },
          effectKeys: {
            ...(base.effectKeys ?? {}),
            roarWave: secondBoss.attackAssetKey,
            summonSpore: secondBoss.warningAssetKey,
          },
        }, scale);

        return this.applyDebugBossConfig(secondConfig);
      }
    }

    const phaseConfig = this.scaleBossConfig({
      ...base,
      id: phase === 2 ? `${base.id ?? 'stage_boss'}_zero_secondary` : `${base.id ?? 'stage_boss'}_zero_first`,
      name: phase === 2 ? `${base.name ?? 'ZERO BOSS'}・ZERO変異` : base.name,
      speed: phase === 2 ? Math.round((base.speed ?? 40) * 1.08) : base.speed,
      attacks: {
        ...(base.attacks ?? {}),
        summon: {
          ...(base.attacks?.summon ?? {}),
          enabled: phase === 2 || base.attacks?.summon?.enabled === true,
          count: Math.max(base.attacks?.summon?.count ?? 0, phase === 2 ? 2 : 0),
        },
      },
    }, scale);

    return this.applyDebugBossConfig(phaseConfig);
  }

  applyDebugBossConfig(config) {
    if (!getDebugFlag('debugWeakBoss')) {
      return config;
    }

    return {
      ...config,
      maxHp: 90,
      damage: Math.max(1, Math.round((config.damage ?? 24) * 0.35)),
      scoreReward: Math.max(400, Math.round((config.scoreReward ?? 2400) * 0.25)),
      expReward: Math.max(6, Math.round((config.expReward ?? 18) * 0.4)),
    };
  }

  getBossConfig() {
    const config = getStageBossConfig(this.gameState.selectedStage, this.gameState.selectedDifficulty);
    const endlessScale = this.getEndlessBossScale();
    const difficultyScale = {
      hp: 1,
      damage: this.difficultyConfig?.bossDamageMultiplier ?? 1,
      score: 1,
      exp: 1,
    };
    const runScale = this.gameState.selectedMode === 'endless'
      ? {
          hp: endlessScale.hp,
          damage: endlessScale.damage * difficultyScale.damage,
          score: endlessScale.score,
          exp: endlessScale.exp,
        }
      : difficultyScale;
    const scaledConfig = this.scaleBossConfig(config, runScale);

    return this.applyDebugBossConfig(scaledConfig);
  }

  getActiveBoss() {
    return this.bosses.find((boss) => !boss.isDead) ?? null;
  }

  getAttackTargets() {
    return [...this.enemies, ...this.bosses].filter((target) => !target.isDead);
  }

  cleanupDefeatedEnemies() {
    this.enemies.forEach((enemy) => {
      if (enemy.isDead && !enemy.didDropExp) {
        enemy.didDropExp = true;
        this.gameState.recordEnemyDefeat(enemy.scoreReward);
        this.audioManager?.play('enemy_defeat');
        this.saveManager?.recordDailyProgress?.('enemyDefeated', 1);
        this.gameState.addUltimate(this.getUltimateGainForEnemy(enemy));
        this.applyEnemyDefeatEffect(enemy);
        this.dropExpPickup(enemy.position.x, enemy.position.y, enemy.expReward);
        this.maybeDropHealPickup(enemy);
      }
    });

    this.enemies = this.enemies.filter((enemy) => {
      if (!enemy.isDead || enemy.deathTime < 0.24) {
        return true;
      }

      enemy.view.destroy();
      return false;
    });
  }

  applyEnemyDefeatEffect(enemy) {
    if (enemy.poisonPoolDamage && enemy.poisonPoolRadius) {
      this.spawnPoisonPool(enemy.position.x, enemy.position.y, {
        radius: enemy.poisonPoolRadius,
        damage: enemy.poisonPoolDamage,
        active: enemy.poisonPoolDuration,
        slowMultiplier: enemy.poisonSlowMultiplier,
      });
    }

    if (!enemy.explosionDamage || !enemy.explosionRadius) {
      return;
    }

    this.spawnPickupBurst(enemy.position.x, enemy.position.y, 5, 'lava');
    const dx = this.player.position.x - enemy.position.x;
    const dy = this.player.position.y - enemy.position.y;
    const distance = Math.max(1, Math.hypot(dx, dy));

    if (distance > enemy.explosionRadius) {
      return;
    }

    if (this.gameState.damagePlayer(enemy.explosionDamage)) {
      this.audioManager?.play('hit');
      this.triggerDamageFlash(enemy.explosionDamage);
      const push = 110 * (1 - distance / enemy.explosionRadius);
      this.player.velocity.x += (dx / distance) * push;
      this.player.velocity.y += (dy / distance) * push;
    }
  }

  spawnPoisonPool(x, y, { radius = 56, damage = 4, active = 2, slowMultiplier = 0.48 } = {}) {
    const gimmick = {
      type: 'enemy_toxicPool',
      shape: 'circle',
      color: 0xb6ff35,
      assetKey: ASSET_KEYS.stageGimmicks.swampToxicPool,
      x,
      y,
      age: 0,
      warningDuration: 0,
      activeDuration: active,
      damage,
      radius,
      width: radius * 2.3,
      height: radius * 1.68,
      hitboxes: this.createFireFloorHitboxes(radius * 2.3, radius * 1.68, radius, { columns: 3, rows: 2 }),
      slowMultiplier,
      alpha: 0.62,
      view: new Container(),
      sprite: new Sprite(Texture.EMPTY),
      assetLoaded: false,
      animationTimer: 0,
      animationFrame: 0,
      animationFps: 10,
      animationTextures: null,
    };

    gimmick.sprite.anchor.set(0.5);
    gimmick.sprite.alpha = gimmick.alpha;
    gimmick.sprite.visible = false;
    gimmick.view.position.set(gimmick.x, gimmick.y);
    gimmick.view.addChild(gimmick.sprite);
    this.gimmickLayer.addChild(gimmick.view);
    this.loadStageGimmickAsset(gimmick, gimmick.assetKey, gimmick);
    this.stageGimmicks.push(gimmick);
  }

  cleanupDefeatedBosses() {
    this.bosses.forEach((boss) => {
      if (boss.isDead && !boss.didDropExp) {
        boss.didDropExp = true;
        this.gameState.recordBossDefeat(boss.scoreReward);
        this.audioManager?.play('boss_defeat');
        this.dropBossRewards(boss);
        this.triggerScreenShake(5.6);
        if (this.gameState.selectedMode === 'zero') {
          this.handleZeroBossDefeat(boss);
          return;
        }
        if (this.shouldCompleteRunOnBossDefeat()) {
          this.queueBossClearSequence(boss, { zeroFinal: false });
        } else {
          this.audioManager?.playBgm(this.getBaseBgmId(), { unlock: false, loop: true });
        }
      }
    });

    this.bosses = this.bosses.filter((boss) => {
      if (!boss.isDead || boss.deathTime < 0.7) {
        return true;
      }

      boss.view.destroy();
      return false;
    });
  }

  handleZeroBossDefeat(boss) {
    this.zeroBossesDefeated = Math.max(this.zeroBossesDefeated ?? 0, boss.zeroPhase ?? 1);

    if ((boss.zeroPhase ?? 1) >= 3) {
      this.queueBossClearSequence(boss, { zeroFinal: true });
      return;
    }

    this.audioManager?.playBgm('zero_bgm', { unlock: false, loop: true });
    this.zeroNextBossTime = Math.max(
      this.gameState.elapsedTime + this.getZeroPhaseGap(),
      this.getZeroBossTime(this.zeroNextBossPhase),
    );
  }

  completeZeroRun() {
    if (this.gameState.isGameOver) {
      return;
    }

    this.clearInput();
    this.pauseUi.hide();
    this.gameState.markZeroClear?.();
    this.updateResultUi();
  }

  queueBossClearSequence(boss, { zeroFinal = false } = {}) {
    if (this.bossClearSequence || this.gameState.isGameOver) {
      return;
    }

    this.loadBossDeathEffectAssets();
    this.hideBossDeathSprites();
    this.clearInput();
    this.bossClearSequence = {
      age: 0,
      duration: zeroFinal ? 3.1 : 2.25,
      bossX: boss.position.x,
      bossY: boss.position.y,
      radius: Math.max(88, (boss.radius ?? 54) * (zeroFinal ? 2.8 : 2.05)),
      zeroFinal,
      completed: false,
      burstPulse: 0,
    };
    this.damageFlashTimer = Math.max(this.damageFlashTimer, zeroFinal ? 0.42 : 0.28);
    this.triggerScreenShake(zeroFinal ? 11.4 : 7.2);
  }

  updateBossClearSequence(delta) {
    if (!this.bossClearSequence) {
      if (this.bossDefeatFxLayer) {
        this.bossDefeatFxLayer.clear();
      }
      this.hideBossDeathSprites();
      return;
    }

    const sequence = this.bossClearSequence;
    sequence.age += delta;
    const progress = Math.min(1, sequence.age / sequence.duration);
    const fade = 1 - progress;
    const pulse = Math.sin(progress * Math.PI * (sequence.zeroFinal ? 7 : 5));
    const corePulse = 0.72 + Math.max(0, pulse) * 0.34;
    const screenPoint = this.worldToScreenPoint(sequence.bossX, sequence.bossY);
    const radius = sequence.radius * (0.55 + progress * (sequence.zeroFinal ? 1.45 : 1.05));
    const flashAlpha = (sequence.zeroFinal ? 0.32 : 0.22) * fade;
    const fragmentCount = sequence.zeroFinal ? 9 : 6;

    const explosionTexture = this.bossDeathTextures.get('explosion');
    const shockwaveTexture = this.bossDeathTextures.get('shockwave');
    const zeroCoreTexture = this.bossDeathTextures.get('zeroCore');
    const shockwaveScale = this.getBossDeathTextureScale(shockwaveTexture, radius * (1.15 + progress * 1.05));
    const explosionPulse = 0.82 + Math.sin(progress * Math.PI) * 0.28;
    const explosionScale = this.getBossDeathTextureScale(explosionTexture, radius * (sequence.zeroFinal ? 1.46 : 1.32) * explosionPulse);
    const coreScale = this.getBossDeathTextureScale(zeroCoreTexture, radius * 0.92 * corePulse);

    this.applyBossDeathSprite(this.bossDeathShockwaveSprite, shockwaveTexture, screenPoint, {
      scale: shockwaveScale,
      alpha: (sequence.zeroFinal ? 0.88 : 0.76) * fade,
      rotation: progress * (sequence.zeroFinal ? 0.28 : 0.18),
    });
    this.applyBossDeathSprite(this.bossDeathExplosionSprite, explosionTexture, screenPoint, {
      scale: explosionScale,
      alpha: Math.min(1, (sequence.zeroFinal ? 0.9 : 0.82) * Math.min(1, fade + 0.24)),
      rotation: -progress * 0.18,
    });
    this.applyBossDeathSprite(this.zeroBossDeathCoreSprite, sequence.zeroFinal ? zeroCoreTexture : null, screenPoint, {
      scale: coreScale,
      alpha: sequence.zeroFinal ? 0.86 * fade : 0,
      rotation: progress * 0.42,
    });

    this.bossDefeatFxLayer.clear()
      .rect(0, 0, this.width, this.height)
      .fill({ color: sequence.zeroFinal ? 0xb9f8ff : 0xfff0b0, alpha: flashAlpha });

    for (let index = 0; index < fragmentCount; index += 1) {
      const angle = (Math.PI * 2 * index) / fragmentCount + progress * (sequence.zeroFinal ? 1.6 : 0.9);
      const distance = radius * (0.18 + progress * (sequence.zeroFinal ? 0.72 : 0.54));
      const x = screenPoint.x + Math.cos(angle) * distance;
      const y = screenPoint.y + Math.sin(angle) * distance;
      const size = Math.max(2, (sequence.zeroFinal ? 8 : 6) * fade);

      this.bossDefeatFxLayer
        .circle(x, y, size)
        .fill({ color: sequence.zeroFinal ? 0xd7fbff : 0xffd36b, alpha: 0.62 * fade });
    }

    this.bossDefeatFxLayer
      .circle(screenPoint.x, screenPoint.y, radius)
      .stroke({ color: sequence.zeroFinal ? 0x9df6ff : 0xffd36b, width: sequence.zeroFinal ? 9 : 6, alpha: 0.9 * fade })
      .circle(screenPoint.x, screenPoint.y, radius * 0.58)
      .stroke({ color: 0xffffff, width: sequence.zeroFinal ? 4.4 : 3.1, alpha: 0.72 * fade })
      .circle(screenPoint.x, screenPoint.y, Math.max(22, radius * 0.22 * corePulse))
      .fill({ color: sequence.zeroFinal ? 0x143d54 : 0x4c1f0a, alpha: 0.36 * fade })
      .circle(screenPoint.x, screenPoint.y, Math.max(10, radius * 0.09 * corePulse))
      .fill({ color: sequence.zeroFinal ? 0xe8fbff : 0xfff0b0, alpha: 0.56 * fade });

    if (progress >= 1 && !sequence.completed) {
      sequence.completed = true;
      this.bossDefeatFxLayer.clear();
      this.hideBossDeathSprites();
      this.bossClearSequence = null;
      if (sequence.zeroFinal) {
        this.completeZeroRun();
      } else {
        this.completeStageByBossClear();
      }
    }
  }

  dropBossRewards(boss) {
    const offsets = [
      { x: 0, y: 0, value: boss.expReward },
      { x: -34, y: -14, value: 6 },
      { x: 38, y: 10, value: 6 },
      { x: 8, y: 36, value: 4 },
    ];

    offsets.forEach((drop) => {
      this.dropExpPickup(boss.position.x + drop.x, boss.position.y + drop.y, drop.value);
    });
  }

  shouldCompleteRunOnBossDefeat() {
    if (this.gameState.isGameOver || this.gameState.selectedMode !== 'standard') {
      return false;
    }

    return ['normal', 'hard', 'expert'].includes(this.gameState.selectedDifficulty ?? 'normal');
  }

  createStageGimmicks() {
    this.stageGimmicks.forEach((gimmick) => gimmick.view?.destroy({ children: true }));
    this.stageGimmicks = [];
    this.gimmickWarningGraphics.clear();
    this.stageGimmickConfig = this.getRunStageGimmickConfig();
    this.stageGimmickIndex = 0;
    this.publishDebugRunState();

    if (!this.stageGimmickConfig?.enabled && !isDebugGimmicksEnabled()) {
      this.stageGimmickTimer = Number.POSITIVE_INFINITY;
      return;
    }

    const interval = this.getStageGimmickInterval();
    this.stageGimmickTimer = isDebugGimmickFast() ? 1.2 : Math.max(4, interval * 0.45);
  }

  getRunStageGimmickConfig() {
    const config = getStageGimmickConfig(this.gameState.selectedStage, this.gameState.selectedDifficulty);

    if (this.gameState.selectedMode !== 'zero' || !config?.enabled) {
      return config;
    }

    return {
      ...config,
      interval: Math.max(12, (config.interval ?? 16) * 0.86),
      warning: Math.max(0.95, (config.warning ?? 1.1) * 0.92),
      active: (config.active ?? 1) * 1.02,
      damage: Math.max(1, Math.round((config.damage ?? 8) * 1.08)),
      radius: Math.round((config.radius ?? 100) * 1.02),
      count: Math.max(1, config.count ?? 1),
    };
  }

  applyStageGimmicks(delta) {
    this.updateStageGimmicks(delta);
  }

  updateStageGimmicks(delta) {
    if (!this.stageGimmickConfig?.enabled && !isDebugGimmicksEnabled()) {
      return;
    }

    this.stageGimmickTimer -= delta;

    if (this.stageGimmickTimer <= 0) {
      const count = isDebugGimmickFast() ? Math.max(1, this.stageGimmickConfig?.count ?? 1) : this.stageGimmickConfig?.count ?? 1;

      for (let index = 0; index < count; index += 1) {
        this.spawnStageGimmick(index);
      }

      this.stageGimmickTimer = this.getStageGimmickInterval();
    }

    this.stageGimmicks = this.stageGimmicks.filter((gimmick) => {
      gimmick.age += delta;
      const activeStart = gimmick.warningDuration;
      const activeEnd = gimmick.warningDuration + gimmick.activeDuration;
      const isWarning = gimmick.age < activeStart;
      const isActive = gimmick.age >= activeStart && gimmick.age < activeEnd;
      const warningProgress = Math.min(1, gimmick.age / Math.max(0.1, gimmick.warningDuration));

      if (isWarning) {
        this.updateStageGimmickAnimation(gimmick, delta, {
          sprite: gimmick.warningSprite,
          texturesKey: 'warningAnimationTextures',
          timerKey: 'warningAnimationTimer',
          frameKey: 'warningAnimationFrame',
          fpsKey: 'warningAnimationFps',
        });

        if (!gimmick.warningAssetLoaded && gimmick.assetLoaded) {
          this.updateStageGimmickAnimation(gimmick, delta);
        }
      }

      if (isActive) {
        this.updateStageGimmickAnimation(gimmick, delta);
      }

      if (gimmick.warningSprite) {
        const hazardBoost = this.getVisibilityAssistConfig().hazardAlphaBoost;
        gimmick.warningSprite.visible = isWarning && gimmick.warningAssetLoaded;
        gimmick.warningSprite.alpha = Math.min(0.78, (0.22 + warningProgress * 0.36) * hazardBoost);
      }
      gimmick.sprite.visible = (isActive || (isWarning && !gimmick.warningAssetLoaded)) && gimmick.assetLoaded;
      if (isWarning && (gimmick.warningSprite?.visible || gimmick.sprite.visible)) {
        this.showWarningGuideTutorialIfNeeded();
      }
      const hazardBoost = this.getVisibilityAssistConfig().hazardAlphaBoost;
      gimmick.sprite.alpha = isActive
        ? Math.min(0.95, (gimmick.alpha ?? 0.82) * (1 + (hazardBoost - 1) * 0.32))
        : Math.min(0.62, (0.14 + warningProgress * 0.3) * hazardBoost);
      gimmick.view.visible = gimmick.age < activeEnd;

      if (isActive) {
        this.applyStageGimmickEffect(gimmick, delta);
      }

      if (gimmick.age >= activeEnd) {
        gimmick.view.destroy({ children: true });
        return false;
      }

      return true;
    });

    this.renderStageGimmickWarnings();
  }

  getStageGimmickInterval() {
    const base = this.stageGimmickConfig?.interval ?? 999;

    if (isDebugGimmickFast()) {
      return Math.min(4, Math.max(2.2, base * 0.18));
    }

    return base;
  }

  spawnStageGimmick(offsetIndex = 0) {
    const definition = this.getNextStageGimmickDefinition(offsetIndex);

    if (!definition) {
      return;
    }

    const position = this.getStageGimmickPosition(definition.radius);
    const radius = definition.radius ?? this.stageGimmickConfig.radius;
    const width = definition.width ?? radius * 2.2;
    const height = definition.height ?? radius * 2.2;
    const gimmick = {
      ...definition,
      ...position,
      age: 0,
      warningDuration: this.stageGimmickConfig.warning,
      activeDuration: definition.active ?? this.stageGimmickConfig.active,
      damage: definition.damage ?? this.stageGimmickConfig.damage,
      radius,
      width,
      height,
      hitboxes: definition.hitboxGrid ? this.createFireFloorHitboxes(width, height, radius, definition.hitboxGrid) : null,
      view: new Container(),
      sprite: new Sprite(Texture.EMPTY),
      assetLoaded: false,
      animationTimer: 0,
      animationFrame: 0,
      animationFps: 12,
      animationTextures: null,
    };

    gimmick.sprite.anchor.set(0.5);
    gimmick.sprite.alpha = definition.alpha ?? 0.82;
    gimmick.sprite.visible = false;
    gimmick.view.position.set(gimmick.x, gimmick.y);
    gimmick.view.rotation = gimmick.rotation ?? 0;
    gimmick.view.addChild(gimmick.sprite);
    this.gimmickLayer.addChild(gimmick.view);

    this.loadStageGimmickAsset(gimmick, definition.assetKey, definition);

    this.stageGimmicks.push(gimmick);
  }

  loadStageGimmickAsset(gimmick, assetKey, definition) {
    this.assetLoader?.load(assetKey).then((texture) => {
      if (!texture || !gimmick.view || gimmick.view.destroyed) {
        const fallbackKey = this.assetLoader?.getItem?.(assetKey)?.meta?.fallbackKey;

        if (!texture && fallbackKey) {
          this.loadStageGimmickAsset(gimmick, fallbackKey, definition);
        }

        return;
      }

      this.applyStageGimmickTexture(gimmick, texture, assetKey);
      gimmick.sprite.width = gimmick.width ?? definition.width ?? gimmick.radius * 2.2;
      gimmick.sprite.height = gimmick.height ?? definition.height ?? gimmick.radius * 2.2;
      gimmick.sprite.visible = gimmick.age >= gimmick.warningDuration;
    });
  }

  applyStageGimmickTexture(gimmick, texture, assetKey) {
    const item = this.assetLoader?.getItem?.(assetKey);
    const animation = this.createGimmickAnimation(texture, item?.meta);

    gimmick.assetLoaded = true;
    gimmick.animationTextures = null;

    if (!animation) {
      gimmick.sprite.texture = texture;
      return;
    }

    gimmick.animationFps = animation.fps;
    gimmick.animationTextures = animation.textures;
    gimmick.animationFrame = 0;
    gimmick.animationTimer = 0;
    gimmick.sprite.texture = gimmick.animationTextures[0] ?? texture;
  }

  createGimmickAnimation(texture, meta = {}) {
    const item = { meta };
    const sheet = item?.meta?.sheet;
    const columns = sheet?.columns ?? 0;
    const rows = sheet?.rows ?? 0;
    const frameWidth = sheet?.frameWidth ?? 0;
    const frameHeight = sheet?.frameHeight ?? 0;
    const textureWidth = texture.width ?? texture.source?.width ?? 0;
    const textureHeight = texture.height ?? texture.source?.height ?? 0;
    const canAnimate = item?.meta?.spriteSheet === true
      && columns > 0
      && rows > 0
      && frameWidth > 0
      && frameHeight > 0
      && textureWidth >= columns * frameWidth
      && textureHeight >= rows * frameHeight;

    if (!canAnimate) {
      return null;
    }

    const frameCount = Math.min(columns * rows, item?.meta?.animations?.active?.frames ?? columns * rows);
    const textures = Array.from({ length: frameCount }, (_, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);

      return new Texture({
        source: texture.source,
        frame: new Rectangle(
          column * frameWidth,
          row * frameHeight,
          frameWidth,
          frameHeight,
        ),
      });
    });

    return {
      textures,
      fps: item?.meta?.animations?.active?.fps ?? 12,
    };
  }

  updateStageGimmickAnimation(
    gimmick,
    delta,
    {
      sprite = gimmick.sprite,
      texturesKey = 'animationTextures',
      timerKey = 'animationTimer',
      frameKey = 'animationFrame',
      fpsKey = 'animationFps',
    } = {},
  ) {
    const textures = gimmick[texturesKey];

    if (!textures?.length) {
      return;
    }

    gimmick[timerKey] += delta;
    const frameInterval = 1 / Math.max(1, gimmick[fpsKey] ?? 12);

    while (gimmick[timerKey] >= frameInterval) {
      gimmick[timerKey] -= frameInterval;
      gimmick[frameKey] = (gimmick[frameKey] + 1) % textures.length;
      sprite.texture = textures[gimmick[frameKey]];
    }
  }

  getNextStageGimmickDefinition(offsetIndex = 0) {
    const stageId = this.gameState.selectedStage;
    const config = this.stageGimmickConfig ?? {};
    const radius = config.radius ?? 90;

    if (stageId === 'volcano') {
      const variants = [
        {
          type: 'lavaBurst',
          shape: 'circle',
          color: 0xff5a38,
          assetKey: ASSET_KEYS.stageGimmicks.volcanoLavaBurstSheet,
          radius,
          damage: config.damage,
          width: radius * 2.35,
          height: radius * 2.35,
        },
        {
          type: 'fireFloor',
          shape: 'circle',
          color: 0xff8a2f,
          assetKey: ASSET_KEYS.stageGimmicks.volcanoFireFloorSheet,
          radius: radius * 1.08,
          damage: Math.max(4, Math.round(config.damage * 0.72)),
          active: config.active + 0.65,
          width: radius * 2.6,
          height: radius * 2.08,
          hitboxGrid: { columns: 4, rows: 4 },
        },
      ];

      return variants[(this.stageGimmickIndex++ + offsetIndex) % variants.length];
    }

    if (stageId === 'swamp') {
      const variants = [
        {
          type: 'toxicPool',
          shape: 'circle',
          color: 0xb6ff35,
          assetKey: ASSET_KEYS.stageGimmicks.swampToxicPoolSheet,
          radius,
          damage: config.damage,
          slowMultiplier: config.slowMultiplier,
          active: config.active + 0.4,
          width: radius * 2.36,
          height: radius * 1.72,
          hitboxGrid: { columns: 3, rows: 2 },
          alpha: 0.78,
        },
        {
          type: 'poisonMist',
          shape: 'circle',
          color: 0x45ffbb,
          assetKey: ASSET_KEYS.stageGimmicks.swampPoisonMistSheet,
          radius: radius * 1.12,
          damage: Math.max(3, Math.round(config.damage * 0.7)),
          slowMultiplier: config.slowMultiplier,
          active: config.active,
          width: radius * 2.62,
          height: radius * 2.0,
          alpha: 0.58,
        },
      ];

      return variants[(this.stageGimmickIndex++ + offsetIndex) % variants.length];
    }

    if (stageId === 'ruins') {
      const variants = [
        {
          type: 'electroPulse',
          shape: 'circle',
          color: 0x7bd8ff,
          assetKey: ASSET_KEYS.stageGimmicks.ruinsElectroPulseSheet,
          radius,
          damage: config.damage,
          slowMultiplier: config.slowMultiplier,
          width: radius * 2.28,
          height: radius * 2.28,
          alpha: 0.72,
        },
        {
          type: 'laser',
          shape: 'line',
          color: 0xff3848,
          assetKey: ASSET_KEYS.stageGimmicks.ruinsLaserBeamSheet,
          radius,
          damage: Math.round(config.damage * 1.15),
          lineLength: config.lineLength ?? 420,
          lineWidth: config.lineWidth ?? 48,
          width: config.lineLength ?? 420,
          height: (config.lineWidth ?? 48) * 1.9,
          rotation: Math.random() * Math.PI,
          active: Math.max(0.55, config.active * 0.72),
          alpha: 0.86,
        },
      ];

      return variants[(this.stageGimmickIndex++ + offsetIndex) % variants.length];
    }

    return null;
  }

  getStageGimmickPosition(radius = 90) {
    const margin = radius + 48;
    const minX = this.camera.x + margin;
    const maxX = this.camera.x + this.camera.visibleWidth - margin;
    const minY = this.camera.y + margin;
    const maxY = this.camera.y + this.camera.visibleHeight - margin;
    let x = this.player.position.x;
    let y = this.player.position.y;

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 170 + Math.random() * 280;

      x = this.clamp(this.player.position.x + Math.cos(angle) * distance, minX, maxX);
      y = this.clamp(this.player.position.y + Math.sin(angle) * distance, minY, maxY);

      if (Math.hypot(x - this.player.position.x, y - this.player.position.y) > radius * 1.2) {
        break;
      }
    }

    return {
      x: this.clamp(x, STAGE_BOUNDS.left + margin, STAGE_BOUNDS.right - margin),
      y: this.clamp(y, STAGE_BOUNDS.top + margin, STAGE_BOUNDS.bottom - margin),
    };
  }

  renderStageGimmickWarnings() {
    const graphics = this.gimmickWarningGraphics;
    graphics.clear();

    if (this.optionsSettings?.controls?.controlGuide === false) {
      return;
    }

    const simpleEffects = this.optionsSettings?.effects?.simpleEffects === true;
    const visibilityConfig = this.getVisibilityAssistConfig();
    const baseAlpha = (simpleEffects ? 0.42 : 0.58) * visibilityConfig.hazardAlphaBoost;

    this.stageGimmicks.forEach((gimmick) => {
      const activeStart = gimmick.warningDuration;
      const activeEnd = gimmick.warningDuration + gimmick.activeDuration;

      if (gimmick.age >= activeEnd) {
        return;
      }

      const isWarning = gimmick.age < activeStart;
      const warningProgress = Math.min(1, gimmick.age / Math.max(0.1, gimmick.warningDuration));

      if (!isWarning && gimmick.assetLoaded) {
        return;
      }

      const alpha = isWarning ? baseAlpha * (0.45 + warningProgress * 0.55) : baseAlpha * 0.28;

      if (gimmick.hitboxes?.length) {
        this.drawGimmickHitboxWarnings(graphics, gimmick, { isWarning, warningProgress, alpha });
        return;
      }

      if (gimmick.shape === 'line') {
        this.drawGimmickLine(graphics, gimmick, {
          fillAlpha: isWarning ? 0.07 + warningProgress * 0.07 : 0.04,
          strokeAlpha: alpha,
          strokeWidth: isWarning ? 2.2 : 1.2,
        });
        return;
      }

      const radius = gimmick.radius * (isWarning ? 0.78 + warningProgress * 0.22 : 1);
      graphics
        .circle(gimmick.x, gimmick.y, radius)
        .fill({ color: gimmick.color, alpha: isWarning ? 0.06 + warningProgress * 0.06 : 0.035 })
        .circle(gimmick.x, gimmick.y, gimmick.radius)
        .stroke({ color: gimmick.color, width: isWarning ? 2.2 : 1.2, alpha });
    });
  }

  drawGimmickHitboxWarnings(graphics, gimmick, { isWarning, warningProgress, alpha }) {
    gimmick.hitboxes.forEach((hitbox) => {
      const x = gimmick.x + hitbox.x;
      const y = gimmick.y + hitbox.y;
      const radius = hitbox.radius * (isWarning ? 0.82 + warningProgress * 0.18 : 1);

      graphics
        .circle(x, y, radius)
        .fill({ color: gimmick.color, alpha: isWarning ? 0.06 : 0.045 })
        .circle(x, y, hitbox.radius)
        .stroke({ color: gimmick.color, width: isWarning ? 2 : 1.2, alpha: isWarning ? alpha : 0.18 });

      if (!isWarning && !gimmick.assetLoaded) {
        graphics
          .circle(x, y, hitbox.radius * 0.62)
          .fill({ color: gimmick.color, alpha: 0.1 });
      }
    });
  }

  drawGimmickLine(graphics, gimmick, style) {
    const length = gimmick.lineLength ?? 420;
    const width = gimmick.lineWidth ?? 48;
    const cos = Math.cos(gimmick.rotation ?? 0);
    const sin = Math.sin(gimmick.rotation ?? 0);
    const hx = (length / 2) * cos;
    const hy = (length / 2) * sin;
    const wx = (width / 2) * -sin;
    const wy = (width / 2) * cos;
    const points = [
      gimmick.x - hx - wx, gimmick.y - hy - wy,
      gimmick.x + hx - wx, gimmick.y + hy - wy,
      gimmick.x + hx + wx, gimmick.y + hy + wy,
      gimmick.x - hx + wx, gimmick.y - hy + wy,
    ];

    graphics
      .poly(points)
      .fill({ color: gimmick.color, alpha: style.fillAlpha })
      .stroke({ color: gimmick.color, width: style.strokeWidth, alpha: style.strokeAlpha });
  }

  applyStageGimmickEffect(gimmick, delta) {
    if (!this.isPlayerInsideGimmick(gimmick)) {
      return;
    }

    if (gimmick.slowMultiplier) {
      const slow = Math.pow(gimmick.slowMultiplier, delta);
      this.player.velocity.x *= slow;
      this.player.velocity.y *= slow;
    }

    if (gimmick.damage > 0 && this.gameState.damagePlayer(gimmick.damage)) {
      this.audioManager?.play('hit');
      this.triggerDamageFlash(gimmick.damage);
      if (gimmick.type === 'electroPulse' || gimmick.type === 'laser') {
        const pushX = this.player.position.x - gimmick.x;
        const pushY = this.player.position.y - gimmick.y;
        const distance = Math.max(1, Math.hypot(pushX, pushY));
        this.player.velocity.x += (pushX / distance) * 120;
        this.player.velocity.y += (pushY / distance) * 120;
      }
    }
  }

  isPlayerInsideGimmick(gimmick) {
    if (gimmick.hitboxes?.length) {
      return gimmick.hitboxes.some((hitbox) => {
        const distance = Math.hypot(
          this.player.position.x - (gimmick.x + hitbox.x),
          this.player.position.y - (gimmick.y + hitbox.y),
        );

        return distance <= hitbox.radius;
      });
    }

    if (gimmick.shape === 'line') {
      const halfLength = (gimmick.lineLength ?? 420) / 2;
      const halfWidth = (gimmick.lineWidth ?? 48) / 2;
      const dx = this.player.position.x - gimmick.x;
      const dy = this.player.position.y - gimmick.y;
      const cos = Math.cos(-(gimmick.rotation ?? 0));
      const sin = Math.sin(-(gimmick.rotation ?? 0));
      const localX = dx * cos - dy * sin;
      const localY = dx * sin + dy * cos;

      return Math.abs(localX) <= halfLength && Math.abs(localY) <= halfWidth;
    }

    const distance = Math.hypot(this.player.position.x - gimmick.x, this.player.position.y - gimmick.y);

    return distance <= gimmick.radius;
  }

  applyPlayerStatusMovement() {
    const slow = this.gameState.getPlayerSlowMultiplier();

    if (slow >= 1) {
      return;
    }

    this.player.velocity.x *= slow;
    this.player.velocity.y *= slow;
  }

  dropExpPickup(x, y, value = 1) {
    const pickup = new Pickup({
      x,
      y,
      value,
      assetLoader: this.assetLoader,
    });

    this.pickups.push(pickup);
    this.depthLayer.addChild(pickup.view);
  }

  dropHealPickup(x, y, healAmount = null) {
    const pickup = new Pickup({
      x,
      y,
      type: 'heal',
      healAmount: Math.max(1, Math.round(healAmount ?? this.getHealPickupAmount())),
      assetLoader: this.assetLoader,
    });

    this.pickups.push(pickup);
    this.depthLayer.addChild(pickup.view);
  }

  maybeDropHealPickup(enemy) {
    if (this.gameState.playerHp >= this.gameState.playerMaxHp * 0.92) {
      return;
    }

    const missingRatio = 1 - (this.gameState.playerHp / Math.max(1, this.gameState.playerMaxHp));
    const chance = Math.min(0.16, 0.045 + missingRatio * 0.105);

    if (Math.random() > chance) {
      return;
    }

    this.dropHealPickup(enemy.position.x + 16, enemy.position.y - 10, this.getHealPickupAmount());
  }

  getHealPickupAmount() {
    const difficultyMultiplier = this.gameState.selectedDifficulty === 'expert'
      ? 0.94
      : this.gameState.selectedDifficulty === 'hard'
        ? 0.98
        : 1;
    const modeMultiplier = this.gameState.selectedMode === 'zero'
      ? 0.92
      : this.gameState.selectedMode === 'endless' && this.gameState.elapsedTime >= 360
        ? 0.94
        : 1;

    return Math.max(14, Math.round(this.gameState.playerMaxHp * 0.22 * difficultyMultiplier * modeMultiplier));
  }

  spawnPickupBurst(x, y, value = 1, type = 'exp') {
    const burst = {
      age: 0,
      duration: 0.32,
      value,
      type,
      view: new Graphics(),
    };

    burst.view.position.set(x, y);
    this.effectLayer.addChild(burst.view);
    this.pickupBursts.push(burst);
  }

  spawnPickupPopup(x, y, label, color = 0xd7fff2) {
    if (this.optionsSettings?.effects?.damageNumbers === false) {
      return;
    }

    const text = new Text({
      text: label,
      style: {
        fill: `#${color.toString(16).padStart(6, '0')}`,
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: 12,
        fontWeight: '800',
        stroke: { color: '#020607', width: 3 },
        letterSpacing: 0,
      },
    });

    text.anchor.set(0.5);
    text.position.set(x, y);
    this.effectLayer.addChild(text);
    this.pickupPopups.push({
      age: 0,
      duration: this.optionsSettings?.effects?.simpleEffects === true ? 0.5 : 0.68,
      view: text,
      startY: y,
    });
  }

  updatePickupBursts(delta) {
    this.pickupBursts = this.pickupBursts.filter((burst) => {
      burst.age += delta;
      const progress = burst.age / burst.duration;

      if (progress >= 1) {
        burst.view.destroy();
        return false;
      }

      const color = burst.type === 'heal'
        ? 0x65e878
        : burst.type === 'lava'
          ? 0xff5a38
          : burst.value >= 4 ? 0xffc94d : burst.value >= 2 ? 0x35d7ff : 0x8d4dff;
      const radius = 10 + progress * (18 + burst.value * 3);

      burst.view
        .clear()
        .circle(0, 0, radius)
        .stroke({ color, width: 2 * (1 - progress), alpha: 0.7 * (1 - progress) })
        .circle(0, 0, 4 + burst.value)
        .fill({ color, alpha: 0.32 * (1 - progress) });

      return true;
    });

    this.pickupPopups = this.pickupPopups.filter((popup) => {
      popup.age += delta;
      const progress = popup.age / popup.duration;

      if (progress >= 1) {
        popup.view.destroy();
        return false;
      }

      popup.view.y = popup.startY - progress * 24;
      popup.view.alpha = 1 - progress;
      popup.view.scale.set(1 + progress * 0.08);
      return true;
    });
  }

  triggerDamageFlash(amount) {
    if (this.optionsSettings?.effects?.flash === false) {
      return;
    }

    this.damageFlashTimer = Math.max(this.damageFlashTimer, amount >= 25 ? 0.22 : 0.14);
  }

  updateDamageFlash(delta) {
    if (this.damageFlashTimer <= 0) {
      this.damageFlash.clear();
      return;
    }

    this.damageFlashTimer = Math.max(0, this.damageFlashTimer - delta);
    const alpha = Math.min(0.28, this.damageFlashTimer * 0.9);

    this.damageFlash
      .clear()
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0xff2038, alpha: alpha * 0.34 })
      .rect(0, 0, this.width, 96)
      .fill({ color: 0xff2038, alpha })
      .rect(0, this.height - 120, this.width, 120)
      .fill({ color: 0xff2038, alpha: alpha * 0.7 });
  }

  getUltimateGainForEnemy(enemy) {
    if (enemy.enemyType === 'tank' || enemy.enemyType === 'volcanoHeavy' || enemy.enemyType === 'swampSlow' || enemy.enemyType === 'ruinsElectro') {
      return 12;
    }

    if (
      enemy.enemyType === 'fast'
      || enemy.enemyType === 'volcanoFast'
      || enemy.enemyType === 'volcanoBomber'
      || enemy.enemyType === 'swampToxicBomber'
      || enemy.enemyType === 'ruinsShooter'
      || enemy.enemyType === 'ruinsSummoner'
    ) {
      return 7;
    }

    return 4;
  }

  updateUltimateCharge(delta) {
    if (
      !this.gameState.selectedEvolution
      || this.ultimateSystem.isActive
    ) {
      return;
    }

    if (this.gameState.ultimateReady) {
      return;
    }

    this.gameState.addUltimate(delta * 0.32);
  }

  queueLevelUps(levelsGained) {
    if (levelsGained <= 0) {
      return;
    }

    const startLevel = this.gameState.playerLevel - levelsGained;

    for (let index = 0; index < levelsGained; index += 1) {
      this.pendingLevelUps.push({
        from: startLevel + index,
        to: startLevel + index + 1,
      });
    }

    this.saveManager?.recordDailyProgress?.('levelUp', levelsGained);

    if (!this.isLevelUpUiOpen && this.levelUpFreezeTimer <= 0) {
      this.levelUpFreezeTimer = 0.45;
    }
  }

  selectLevelUpOption(option) {
    if (option?.type === 'fallbackReward') {
      this.applyLevelUpFallbackReward(option);
      this.finishLevelUpSelection();
      return;
    }

    const acquiredSkill = this.gameState.acquireSkill(option.id);

    if (!acquiredSkill) {
      return;
    }

    this.player.applyUpgrade(option.id, acquiredSkill.level);
    this.combatSystem.applyUpgrade(option.id, acquiredSkill.level);
    this.combatSystem.applyAdaptationSkill?.(option, acquiredSkill.level);
    this.applyUtilitySkill(option.id, acquiredSkill.level);
    this.gameState.consumeEvolutionDetections().forEach((candidate) => {
      this.triggerEvolutionWarning(candidate);
    });
    this.finishLevelUpSelection();
  }

  finishLevelUpSelection() {
    this.pendingLevelUps.shift();
    this.isLevelUpUiOpen = false;
    this.levelUpUi.hide();
    this.evolutionReadyTimer = 0;
    this.isEvolutionReadyUiOpen = false;
    this.evolutionReadyUi.hide();

    if (this.pendingLevelUps.length > 0) {
      this.levelUpFreezeTimer = 0.2;
    } else {
      this.queueEvolutionReadyIfNeeded();
    }
  }

  applyLevelUpFallbackReward(option) {
    if (option.rewardType === 'heal') {
      const healAmount = Math.max(12, Math.floor(this.gameState.playerMaxHp * 0.25));
      this.gameState.playerHp = Math.min(this.gameState.playerMaxHp, this.gameState.playerHp + healAmount);
      return;
    }

    if (option.rewardType === 'score') {
      this.gameState.score += 250;
      return;
    }

    this.gameState.bonusDna = (this.gameState.bonusDna ?? 0) + 18;
  }

  applyUtilitySkill(skillId, level) {
    if (skillId === 'hard_skin') {
      const hpGain = 12 + level * 3;

      this.gameState.playerMaxHp += hpGain;
      this.gameState.playerHp = Math.min(this.gameState.playerMaxHp, this.gameState.playerHp + hpGain);
    }

    if (skillId === 'exp_sense') {
      const baseMagnet = this.researchPickupModifiers?.magnetRadiusMultiplier ?? 1;
      const basePull = this.researchPickupModifiers?.pullMultiplier ?? 1;

      this.pickupModifiers = {
        magnetRadiusMultiplier: Math.max(this.pickupModifiers.magnetRadiusMultiplier, baseMagnet + level * 0.12),
        pullMultiplier: Math.max(this.pickupModifiers.pullMultiplier, basePull + level * 0.08),
      };
    }
  }

  selectEvolutionCandidate(candidate) {
    const selectedEvolution = this.gameState.selectEvolution(candidate.tag);

    if (!selectedEvolution) {
      return;
    }

    this.applySelectedEvolution(selectedEvolution);
    const discoveryResult = this.recordEvolutionDiscovery(selectedEvolution);
    this.isEvolutionReadyUiOpen = false;
    this.evolutionReadyTimer = 0;
    this.evolutionAwakenShakePlayed = false;
    this.evolutionReadyUi.hide();
    this.startEvolutionPresentation(selectedEvolution, discoveryResult);
  }

  recordEvolutionDiscovery(selectedEvolution) {
    if (!selectedEvolution || !this.saveManager?.recordDiscoveredEvolution) {
      return { isNew: false, discovery: null };
    }

    const result = this.saveManager.recordDiscoveredEvolution(selectedEvolution, this.gameState.selectedDino);

    if (result?.isNew) {
      this.evolutionDiscoveryResult = result;
    }

    return result ?? { isNew: false, discovery: null };
  }

  startEvolutionPresentation(selectedEvolution, discoveryResult = { isNew: false, discovery: null }) {
    this.evolutionFeedbackTimer = this.evolutionSequence.duration;
    this.pendingUltimateTutorialAfterEvolution = true;
    this.evolutionSequence.show(selectedEvolution, {
      isNewDiscovery: discoveryResult?.isNew === true,
      discovery: discoveryResult?.discovery ?? null,
    });
    this.audioManager?.play('evolution');
    this.triggerScreenShake(this.getEvolutionShakeIntensity(selectedEvolution.tag) * 0.45);
  }

  applySelectedEvolution(selectedEvolution) {
    this.player.applyEvolution(selectedEvolution);
    const evolutionSheetKey = this.getEvolutionSheetKey(selectedEvolution);

    if (evolutionSheetKey) {
      this.player.setSheetKey(evolutionSheetKey, { force: selectedEvolution.tag === 'zero' });
    }

    this.combatSystem.applyEvolution(selectedEvolution);

    if (selectedEvolution.tag === 'hunting') {
      const baseMagnet = this.researchPickupModifiers?.magnetRadiusMultiplier ?? 1;
      const basePull = this.researchPickupModifiers?.pullMultiplier ?? 1;

      this.pickupModifiers = {
        magnetRadiusMultiplier: baseMagnet + 0.32,
        pullMultiplier: basePull + 0.24,
      };
    } else {
      this.resetPickupModifiersToResearch();
    }

    this.player.triggerEvolutionPulse(this.evolutionSequence.duration + 2.4);
  }

  updateEvolutionFeedback(delta) {
    this.clearInput();
    this.updateJoystick();
    this.player.setMoveInput({ x: 0, y: 0, power: 0 });
    this.player.updateEvolutionVisuals(delta);
    this.updatePlayerDamageState();
    this.updateCamera(delta);
    this.updateMap(false);
    this.evolutionSequence.update(delta, this.getPlayerScreenPosition());

    if (!this.evolutionAwakenShakePlayed && this.evolutionSequence.progress >= 0.78) {
      this.evolutionAwakenShakePlayed = true;
      this.audioManager?.play('evolution', { volume: 0.72 });
      this.triggerScreenShake(this.getEvolutionShakeIntensity(this.gameState.selectedEvolution?.tag));
    }

    this.evolutionFeedbackTimer = Math.max(0, this.evolutionFeedbackTimer - delta);

    if (this.evolutionFeedbackTimer <= 0) {
      this.evolutionSequence.hide();
      this.player.triggerEvolutionPulse(2.2);
      if (this.pendingUltimateTutorialAfterEvolution) {
        this.pendingUltimateTutorialAfterEvolution = false;
        this.showUltimateTutorialIfNeeded();
      }
    }
  }

  getPlayerScreenPosition() {
    return {
      x: (this.player.position.x - this.camera.x) * WORLD_ZOOM,
      y: (this.player.position.y - this.camera.y) * WORLD_ZOOM,
    };
  }

  worldToScreenPoint(x, y) {
    return {
      x: (x - this.camera.x) * WORLD_ZOOM,
      y: (y - this.camera.y) * WORLD_ZOOM,
    };
  }

  getEvolutionShakeIntensity(tag) {
    if (tag === 'attack') {
      return 6.2;
    }

    if (tag === 'hunting') {
      return 4.2;
    }

    return 3.4;
  }

  updatePlayerDamageState() {
    if (this.ultimateSystem.isActive) {
      this.player.view.alpha = 1;
      return;
    }

    if (this.gameState.invincibleTime <= 0) {
      this.player.view.alpha = 1;
      return;
    }

    this.player.view.alpha = Math.sin(this.gameState.invincibleTime * 36) > 0 ? 0.45 : 1;
  }

  async loadStageBackground() {
    const stageId = this.gameState.selectedStage ?? 'jungle';
    const key = ASSET_KEYS.stageBackgrounds?.[stageId] ?? ASSET_KEYS.stageBackgrounds?.jungle;

    if (!this.assetLoader || !key) {
      this.stageBackgroundStatus = 'fallback';
      return;
    }

    if (this.stageBackgroundKey !== key) {
      this.stageBackgroundKey = key;
      this.stageBackgroundTexture = null;
      this.stageBackgroundStatus = 'loading';
      this.backgroundLayer.removeChildren().forEach((child) => child.destroy());
      this.lastTileKey = '';
      this.updateMap(true);
    }

    const texture = await this.assetLoader.load(key);

    if (!this.isActive) {
      return;
    }

    if (this.stageBackgroundKey !== key) {
      return;
    }

    if (!texture) {
      this.stageBackgroundStatus = 'fallback';
      this.lastTileKey = '';
      this.updateMap(true);
      return;
    }

    this.stageBackgroundStatus = 'loaded';
    this.stageBackgroundTexture = texture;
    this.rebuildStageBackground();
    this.lastTileKey = '';
    this.updateMap(true);
  }

  rebuildStageBackground() {
    this.backgroundLayer.removeChildren().forEach((child) => child.destroy());

    if (!this.stageBackgroundTexture) {
      return;
    }

    const tileSize = 1024;
    const padding = tileSize;
    const startX = STAGE_BOUNDS.left - padding;
    const endX = STAGE_BOUNDS.right + padding;
    const startY = STAGE_BOUNDS.top - padding;
    const endY = STAGE_BOUNDS.bottom + padding;

    this.backgroundLayer.alpha = this.getVisibilityAssistConfig().backgroundAlpha;

    for (let y = startY; y <= endY; y += tileSize) {
      for (let x = startX; x <= endX; x += tileSize) {
        const tile = new Sprite(this.stageBackgroundTexture);
        tile.x = x;
        tile.y = y;
        tile.width = tileSize;
        tile.height = tileSize;
        this.backgroundLayer.addChild(tile);
      }
    }
  }

  updateMap(force) {
    this.refreshRunConfig();
    const hasStageBackground = this.stageBackgroundStatus === 'loaded' && this.stageBackgroundTexture;
    const originX = Math.floor((this.camera.x - 220) / TILE_WIDTH);
    const originY = Math.floor((this.camera.y - 220) / TILE_HEIGHT);
    const key = `${originX}:${originY}:${hasStageBackground ? 'bg' : 'fallback'}`;

    if (!force && key === this.lastTileKey) {
      return;
    }

    this.lastTileKey = key;
    this.mapLayer.clear();
    this.mapLayer
      .rect(
        this.camera.x - 280,
        this.camera.y - 280,
        this.camera.visibleWidth + 560,
        this.camera.visibleHeight + 560,
      )
      .fill({
        color: hasStageBackground ? 0x020706 : this.stageConfig.tileColors[0],
        alpha: hasStageBackground ? 0.08 : 0.54,
      });

    if (hasStageBackground) {
      return;
    }

    const rows = Math.ceil(this.camera.visibleHeight / TILE_HEIGHT) + 8;
    const columns = Math.ceil(this.camera.visibleWidth / TILE_WIDTH) + 8;

    for (let row = originY; row < originY + rows; row += 1) {
      for (let column = originX; column < originX + columns; column += 1) {
        this.drawTile(column, row);
      }
    }
  }

  drawTile(column, row) {
    const x = column * TILE_WIDTH + (row % 2) * (TILE_WIDTH / 2);
    const y = row * TILE_HEIGHT;
    const seed = this.noise(column, row);
    const color = seed > 0.72
      ? this.stageConfig.tileColors[2]
      : seed > 0.38
        ? this.stageConfig.tileColors[1]
        : this.stageConfig.tileColors[0];

    this.mapLayer
      .poly([
        x,
        y + TILE_HEIGHT / 2,
        x + TILE_WIDTH / 2,
        y,
        x + TILE_WIDTH,
        y + TILE_HEIGHT / 2,
        x + TILE_WIDTH / 2,
        y + TILE_HEIGHT,
      ])
      .fill({ color, alpha: 0.74 })
      .stroke({ color: this.stageConfig.strokeColor, width: 1, alpha: 0.24 });

    if (seed > 0.55) {
      const plantX = x + 20 + seed * 48;
      const plantY = y + 22 + this.noise(row, column) * 24;

      this.mapLayer
        .ellipse(plantX, plantY, 18 + seed * 16, 6 + seed * 5)
        .fill({ color: 0x0a120e, alpha: 0.34 })
        .ellipse(plantX - 5, plantY - 8, 9, 22)
        .fill({ color: this.stageConfig.plantColors[0], alpha: 0.7 })
        .ellipse(plantX + 8, plantY - 11, 8, 18)
        .fill({ color: this.stageConfig.plantColors[1], alpha: 0.64 });
    }

    if (seed < 0.18) {
      this.mapLayer
        .circle(x + 40, y + 34, 2.5)
        .fill({ color: 0xff8a30, alpha: 0.55 })
        .circle(x + 47, y + 30, 1.6)
        .fill({ color: 0xd8ff7d, alpha: 0.38 });
    }
  }

  createBossDeathEffectLayer() {
    this.bossDefeatAssetLayer.eventMode = 'none';
    [
      this.bossDeathShockwaveSprite,
      this.bossDeathExplosionSprite,
      this.zeroBossDeathCoreSprite,
    ].forEach((sprite) => {
      sprite.anchor.set(0.5);
      sprite.visible = false;
      sprite.alpha = 0;
      sprite.eventMode = 'none';
      this.bossDefeatAssetLayer.addChild(sprite);
    });

    this.loadBossDeathEffectAssets();
  }

  loadBossDeathEffectAssets() {
    [
      ['explosion', ASSET_KEYS.bossEffects?.bossDeathExplosionA14],
      ['shockwave', ASSET_KEYS.bossEffects?.bossDeathShockwaveA14],
      ['zeroCore', ASSET_KEYS.bossEffects?.zeroBossDeathCoreA14],
    ].forEach(([name, key]) => {
      if (!key || this.bossDeathTextures.has(name)) {
        return;
      }

      this.assetLoader?.load(key).then((texture) => {
        if (texture && !texture.destroyed) {
          this.bossDeathTextures.set(name, texture);
        }
      }).catch(() => {});
    });
  }

  getBossDeathTextureScale(texture, targetSize) {
    if (!texture || texture === Texture.EMPTY) {
      return 1;
    }

    const maxDimension = Math.max(1, texture.width ?? 1, texture.height ?? 1);
    return Math.max(0.08, targetSize / maxDimension);
  }

  applyBossDeathSprite(sprite, texture, position, { scale = 1, alpha = 1, rotation = 0 } = {}) {
    if (!sprite) {
      return;
    }

    if (!texture || texture === Texture.EMPTY || alpha <= 0) {
      sprite.visible = false;
      sprite.alpha = 0;
      return;
    }

    sprite.texture = texture;
    sprite.position.set(position.x, position.y);
    sprite.scale.set(scale);
    sprite.rotation = rotation;
    sprite.alpha = Math.max(0, Math.min(1, alpha));
    sprite.visible = true;
  }

  hideBossDeathSprites() {
    [
      this.bossDeathShockwaveSprite,
      this.bossDeathExplosionSprite,
      this.zeroBossDeathCoreSprite,
    ].forEach((sprite) => {
      if (sprite) {
        sprite.visible = false;
        sprite.alpha = 0;
      }
    });
  }

  createJoystick() {
    this.joystick = {
      container: null,
      base: new Graphics(),
      knob: new Graphics(),
      arrow: new Graphics(),
      baseSprite: new Sprite(Texture.EMPTY),
      knobSprite: new Sprite(Texture.EMPTY),
    };

    this.joystick.base
      .circle(0, 0, 45)
      .fill({ color: 0x000000, alpha: 0.18 })
      .stroke({ color: 0xb9cfc8, width: 2, alpha: 0.25 })
      .circle(0, 0, 25)
      .stroke({ color: 0xffcc3c, width: 1, alpha: 0.36 });

    this.joystick.knob
      .circle(0, 0, 17)
      .fill({ color: 0xf0e1c4, alpha: 0.22 })
      .stroke({ color: 0xffffff, width: 1.5, alpha: 0.34 });

    this.joystick.arrow
      .moveTo(0, -56)
      .lineTo(0, 56)
      .moveTo(-56, 0)
      .lineTo(56, 0)
      .stroke({ color: 0xaaff55, width: 1.5, alpha: 0.18 });

    this.joystick.baseSprite.anchor.set(0.5);
    this.joystick.knobSprite.anchor.set(0.5);
    this.joystick.baseSprite.visible = false;
    this.joystick.knobSprite.visible = false;

    this.loadJoystickAssets();

    const stick = new Container();
    this.joystick.container = stick;
    stick.position.set(74, this.height - 96);
    stick.addChild(
      this.joystick.arrow,
      this.joystick.base,
      this.joystick.baseSprite,
      this.joystick.knob,
      this.joystick.knobSprite,
    );
    this.uiLayer.addChild(stick);
    this.applyOptionsSettings();
  }

  async loadJoystickAssets() {
    try {
      const [baseTexture, knobTexture] = await Promise.all([
        Assets.load(uiAssetUrl('assets/ui/hud/virtual_stick_base.png')),
        Assets.load(uiAssetUrl('assets/ui/hud/virtual_stick_knob.png')),
      ]);

      if (!this.joystick) {
        return;
      }

      this.joystick.baseSprite.texture = baseTexture;
      this.joystick.baseSprite.width = 118;
      this.joystick.baseSprite.height = 118;
      this.joystick.baseSprite.alpha = 0.8;
      this.joystick.baseSprite.visible = true;
      this.joystick.base.visible = false;

      this.joystick.knobSprite.texture = knobTexture;
      this.joystick.knobSprite.width = 48;
      this.joystick.knobSprite.height = 48;
      this.joystick.knobSprite.visible = true;
      this.joystick.knob.visible = false;
    } catch {
      // Fallback Graphics remains active.
    }
  }

  createEvolutionWarningLayer() {
    this.evolutionWarningLayer.visible = false;
    this.evolutionWarningLayer.alpha = 0;
    this.evolutionWarningLayer.position.set(this.width / 2, 132);

    this.evolutionWarningBg
      .roundRect(-132, -30, 264, 60, 10)
      .fill({ color: 0x070a0b, alpha: 0.9 })
      .stroke({ color: 0xffd36b, width: 1.7, alpha: 0.86 });

    this.evolutionWarningTitle.anchor.set(0.5);
    this.evolutionWarningTitle.position.set(0, -9);

    this.evolutionWarningText.anchor.set(0.5);
    this.evolutionWarningText.position.set(0, 14);

    this.evolutionWarningLayer.addChild(
      this.evolutionWarningBg,
      this.evolutionWarningTitle,
      this.evolutionWarningText,
    );
  }

  createBossWarningLayer() {
    this.bossWarningLayer.visible = false;
    this.bossWarningLayer.alpha = 0;
    this.bossWarningLayer.position.set(this.width / 2, 164);

    this.bossWarningPanelSprite.anchor.set(0.5);
    this.bossWarningPanelSprite.visible = false;
    this.bossWarningChipSprite.anchor.set(0.5);
    this.bossWarningChipSprite.visible = false;

    this.bossWarningBg
      .roundRect(-164, -36, 328, 72, 10)
      .fill({ color: 0x170405, alpha: 0.92 })
      .stroke({ color: 0xff3848, width: 2, alpha: 0.9 });

    this.bossWarningArrow
      .poly([-10, -15, 23, 0, -10, 15, -3, 0])
      .fill({ color: 0xffd36b, alpha: 0.95 })
      .stroke({ color: 0xff3848, width: 1.5, alpha: 0.9 });
    this.bossWarningArrow.position.set(-132, 2);

    this.bossWarningText.anchor.set(0.5);
    this.bossWarningText.position.set(18, 2);

    this.bossWarningLayer.addChild(
      this.bossWarningBg,
      this.bossWarningPanelSprite,
      this.bossWarningChipSprite,
      this.bossWarningArrow,
      this.bossWarningText,
    );
    this.loadBossWarningAssets();
  }

  loadBossWarningAssets() {
    [
      ['panel', ASSET_KEYS.hudUi?.bossWarningPanel],
      ['chip', ASSET_KEYS.hudUi?.bossAppearAlertChip],
    ].forEach(([name, key]) => {
      if (!key) {
        return;
      }

      this.assetLoader?.load(key).then((texture) => {
        if (texture) {
          this.bossWarningTextures.set(name, texture);
          this.layoutBossWarningAssets();
        }
      }).catch(() => {});
    });
  }

  layoutBossWarningAssets() {
    const panelTexture = this.bossWarningTextures.get('panel') ?? null;
    const chipTexture = this.bossWarningTextures.get('chip') ?? null;

    this.bossWarningPanelSprite.texture = panelTexture ?? Texture.EMPTY;
    this.bossWarningPanelSprite.visible = Boolean(panelTexture);
    if (panelTexture) {
      this.bossWarningPanelSprite.width = 342;
      this.bossWarningPanelSprite.height = 84;
      this.bossWarningBg.clear();
    }

    this.bossWarningChipSprite.texture = chipTexture ?? Texture.EMPTY;
    this.bossWarningChipSprite.visible = Boolean(chipTexture);
    if (chipTexture) {
      this.bossWarningChipSprite.width = 104;
      this.bossWarningChipSprite.height = 29;
      this.bossWarningChipSprite.position.set(-106, -36);
    }
  }

  triggerBossWarning(boss) {
    const shouldShowTextWarning = this.gameState.selectedMode !== 'zero';
    if (shouldShowTextWarning) {
      this.bossWarningText.text = `${boss.displayLabel ?? 'APEX'}接近: ${boss.name}`;
      this.bossWarningArrow.rotation = Math.atan2(
        boss.position.y - this.player.position.y,
        boss.position.x - this.player.position.x,
      );
      this.bossWarningDuration = 1.95;
      this.bossWarningTimer = this.bossWarningDuration;
      this.bossWarningLayer.visible = true;
      this.bossWarningLayer.alpha = 0;
    } else {
      this.bossWarningTimer = 0;
      this.bossWarningLayer.visible = false;
      this.bossWarningLayer.alpha = 0;
    }
    this.audioManager?.play(this.getBossWarningAudioId(boss));
    this.audioManager?.playBgm(this.getBossBgmId(boss), { unlock: false, loop: true });
    this.triggerScreenShake(3.2);
  }

  getBaseBgmId() {
    if (this.gameState.selectedMode === 'zero') {
      return 'zero_bgm';
    }

    if (this.gameState.selectedMode === 'endless') {
      return 'endless_bgm';
    }

    const stageBgm = {
      jungle: 'jungle_bgm',
      volcano: 'volcano_bgm',
      swamp: 'swamp_bgm',
      ruins: 'ruins_bgm',
    };

    return stageBgm[this.gameState.selectedStage] ?? 'normal_stage_bgm';
  }

  getBossBgmId(boss) {
    if (this.gameState.selectedMode !== 'zero') {
      return 'normal_boss_bgm';
    }

    const phase = boss?.zeroPhase ?? 1;

    if (phase >= 3) {
      return 'zero_final_boss_bgm';
    }

    if (phase === 2) {
      return 'zero_second_boss_bgm';
    }

    return 'normal_boss_bgm';
  }

  getBossWarningAudioId(boss) {
    if (this.gameState.selectedMode !== 'zero') {
      return 'boss_warning';
    }

    const phase = boss?.zeroPhase ?? 1;

    if (phase >= 3) {
      return 'zero_final_protocol';
    }

    return phase === 2 ? 'zero_boss_warning' : 'boss_warning';
  }

  updateBossWarning(delta) {
    if (this.bossWarningTimer <= 0) {
      this.bossWarningLayer.visible = false;
      return;
    }

    this.bossWarningTimer = Math.max(0, this.bossWarningTimer - delta);
    const age = Math.max(0, (this.bossWarningDuration || 1.95) - this.bossWarningTimer);
    const fadeIn = Math.min(1, age / 0.14);
    const fadeOut = Math.min(1, this.bossWarningTimer / 0.28);
    const pulse = 1 + Math.sin(age * 18) * 0.018;

    this.bossWarningLayer.scale.set(pulse);
    this.bossWarningLayer.alpha = Math.min(fadeIn, fadeOut);
  }

  createZeroPhaseLayer() {
    this.zeroPhaseLayer.visible = false;
    this.zeroPhaseLayer.alpha = 0;

    this.zeroPhaseDim
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x030007, alpha: 0.34 });

    [
      this.zeroPhasePanelSprite,
      this.zeroPhaseChipSprite,
      this.zeroPhaseNoiseSprite,
      this.zeroPhaseCoreSprite,
    ].forEach((sprite) => {
      sprite.anchor.set(0.5);
      sprite.visible = false;
    });

    this.zeroPhaseNoiseSprite.alpha = 0.34;
    this.zeroPhaseCoreSprite.alpha = 0.75;
    this.zeroPhaseTitle.anchor.set(0.5);
    this.zeroPhaseSubtitle.anchor.set(0.5);
    this.zeroPhaseTitle.style.wordWrap = true;
    this.zeroPhaseTitle.style.wordWrapWidth = Math.min(330, this.width - 48);
    this.zeroPhaseSubtitle.style.wordWrap = true;
    this.zeroPhaseSubtitle.style.wordWrapWidth = Math.min(324, this.width - 54);

    this.zeroPhaseLayer.addChild(
      this.zeroPhaseDim,
      this.zeroPhaseFallbackPanel,
      this.zeroPhasePanelSprite,
      this.zeroPhaseChipSprite,
      this.zeroPhaseNoiseSprite,
      this.zeroPhaseCoreSprite,
      this.zeroPhaseTitle,
      this.zeroPhaseSubtitle,
    );

    this.loadZeroPhaseAssets();
  }

  loadZeroPhaseAssets() {
    const textureKeys = [
      ['phasePanel', ASSET_KEYS.zeroUi?.phasePanel],
      ['warningPanel', ASSET_KEYS.zeroUi?.warningPanel],
      ['finalWarningPanel', ASSET_KEYS.zeroUi?.finalWarningPanel],
      ['a07bPhasePanel', ASSET_KEYS.hudUi?.zeroPhaseNoticePanel],
      ['a07bWarningPanel', ASSET_KEYS.hudUi?.zeroPhaseNoticePanel],
      ['a07bFinalPanel', ASSET_KEYS.hudUi?.zeroFinalNoticePanel],
      ['phaseChip', ASSET_KEYS.zeroUi?.phaseChip],
    ];

    textureKeys.forEach(([name, key]) => {
      if (!key) {
        return;
      }

      this.assetLoader?.load(key).then((texture) => {
        if (texture) {
          this.zeroPhaseTextures.set(name, texture);
          if (this.zeroPhaseLayer.visible || this.zeroPhaseTimer > 0) {
            this.layoutZeroPhaseNotice();
          }
        }
      }).catch(() => {});
    });

    [
      ['protocolNoiseSheet', ASSET_KEYS.zeroUi?.protocolNoiseSheet, 'zeroPhaseNoiseTextures', 'zeroPhaseNoiseFps'],
      ['coreActivationSheet', ASSET_KEYS.zeroUi?.coreActivationSheet, 'zeroPhaseCoreTextures', 'zeroPhaseCoreFps'],
    ].forEach(([name, key, texturesField, fpsField]) => {
      if (!key) {
        return;
      }

      this.assetLoader?.load(key).then((texture) => {
        const item = this.assetLoader?.getItem?.(key);
        const animation = texture ? this.createGimmickAnimation(texture, item?.meta) : null;

        if (animation) {
          this[texturesField] = animation.textures;
          this[fpsField] = animation.fps;
        } else if (texture) {
          this.zeroPhaseTextures.set(name, texture);
        }
      }).catch(() => {});
    });
  }

  triggerZeroStartNotice() {
    if (this.gameState.selectedMode !== 'zero') {
      return;
    }

    this.showZeroPhaseNotice({
      key: 'zero-start',
      title: 'ZERO MODE',
      subtitle: '死線到達プロトコル開始',
      variant: 'phase',
      duration: 1.9,
    });
  }

  triggerZeroBossPhaseWarning(boss) {
    if (this.gameState.selectedMode !== 'zero') {
      return;
    }

    const phase = boss?.zeroPhase ?? 1;
    const isFinal = phase >= 3;
    const notice = isFinal
      ? {
          key: 'zero-final-boss',
          title: 'FINAL PROTOCOL',
          subtitle: `${boss?.name ?? 'エクリプス・プロトコル'} 起動`,
          variant: 'final',
          duration: 2.62,
        }
      : phase === 2
        ? {
            key: 'zero-phase-2-boss',
            title: 'PHASE 2',
            subtitle: 'ZERO変異反応',
            variant: 'warning',
            duration: 2.12,
          }
        : {
            key: 'zero-phase-1-boss',
            title: 'PHASE 1',
            subtitle: '異常個体接近',
            variant: 'warning',
            duration: 2.02,
          };

    this.showZeroPhaseNotice(notice);

    if (isFinal) {
      this.triggerScreenShake(3.8);
    }
  }

  showZeroPhaseNotice({
    key,
    title,
    subtitle,
    variant = 'phase',
    duration = 2,
  }) {
    if (this.gameState.selectedMode !== 'zero') {
      return;
    }

    if (key && this.zeroPhaseShownKeys.has(key)) {
      return;
    }

    if (key) {
      this.zeroPhaseShownKeys.add(key);
    }

    const notice = { key, title, subtitle, variant, duration };

    if (this.zeroPhaseTimer > 0 || this.isZeroPhaseNoticeBlocked()) {
      this.zeroPhaseQueue.push(notice);
      return;
    }

    this.startZeroPhaseNotice(notice);
  }

  startZeroPhaseNotice({
    title,
    subtitle,
    variant = 'phase',
    duration = 2,
  }) {
    this.zeroPhaseVariant = variant;
    this.zeroPhaseDuration = duration;
    this.zeroPhaseTimer = duration;
    this.zeroPhaseTitle.text = title;
    this.zeroPhaseSubtitle.text = subtitle;
    this.zeroPhaseNoiseFrame = 0;
    this.zeroPhaseCoreFrame = 0;
    this.zeroPhaseNoiseTimer = 0;
    this.zeroPhaseCoreTimer = 0;

    this.layoutZeroPhaseNotice();
    this.zeroPhaseLayer.visible = true;
    this.zeroPhaseLayer.alpha = 1;
    this.audioManager?.play(variant === 'phase' ? 'zero_phase_warning' : variant === 'final' ? 'zero_final_protocol' : 'zero_boss_warning');
  }

  isZeroPhaseNoticeBlocked() {
    return this.gameState.selectedMode !== 'zero'
      || this.gameState.isGameOver
      || this.gameState.isPaused
      || this.isLevelUpUiOpen
      || this.levelUpFreezeTimer > 0
      || this.pendingLevelUps.length > 0
      || this.isEvolutionReadyUiOpen
      || this.evolutionReadyTimer > 0
      || this.evolutionFeedbackTimer > 0
      || this.resultUi.view.visible;
  }

  layoutZeroPhaseNotice() {
    const isFinal = this.zeroPhaseVariant === 'final';
    const isWarning = this.zeroPhaseVariant === 'warning';
    const y = isFinal ? Math.max(188, this.height * 0.335) : 158;
    const panelWidth = Math.min(this.width - 28, isFinal ? 366 : 344);
    const panelHeight = isFinal ? 116 : isWarning ? 104 : 90;
    const panelKey = isFinal
      ? (this.zeroPhaseTextures.has('a07bFinalPanel') ? 'a07bFinalPanel' : 'finalWarningPanel')
      : isWarning
        ? (this.zeroPhaseTextures.has('a07bWarningPanel') ? 'a07bWarningPanel' : 'warningPanel')
        : (this.zeroPhaseTextures.has('a07bPhasePanel') ? 'a07bPhasePanel' : 'phasePanel');
    const panelTexture = this.zeroPhaseTextures.get(panelKey);
    const chipTexture = this.zeroPhaseTextures.get('phaseChip');

    this.zeroPhaseDim.visible = isFinal;
    this.zeroPhaseDim.clear()
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x030007, alpha: isFinal ? 0.24 : 0.18 });
    this.zeroPhasePanelSprite.visible = Boolean(panelTexture);
    this.zeroPhaseFallbackPanel.visible = !panelTexture;
    this.zeroPhasePanelSprite.texture = panelTexture ?? Texture.EMPTY;
    this.zeroPhasePanelSprite.position.set(this.width / 2, y);

    if (panelTexture) {
      const scale = Math.min(panelWidth / panelTexture.width, panelHeight / panelTexture.height);
      this.zeroPhasePanelSprite.scale.set(scale);
    }

    this.zeroPhaseFallbackPanel.clear()
      .roundRect(
        this.width / 2 - panelWidth / 2,
        y - panelHeight / 2,
        panelWidth,
        panelHeight,
        12,
      )
      .fill({ color: isFinal ? 0x0a020c : 0x04070d, alpha: 0.9 })
      .stroke({ color: isFinal ? 0xff2e58 : 0xbf4dff, width: 2, alpha: 0.9 });

    this.zeroPhaseChipSprite.visible = Boolean(chipTexture) && !isFinal;
    this.zeroPhaseChipSprite.texture = chipTexture ?? Texture.EMPTY;
    this.zeroPhaseChipSprite.position.set(this.width / 2, y - panelHeight / 2 - 8);

    if (chipTexture) {
      this.zeroPhaseChipSprite.scale.set(Math.min(0.86, panelWidth / chipTexture.width * 0.7));
    }

    this.zeroPhaseTitle.position.set(this.width / 2, y - (isFinal ? 20 : 15));
    this.zeroPhaseTitle.style.fontSize = isFinal ? 23 : 20;
    this.zeroPhaseTitle.style.fill = isFinal ? '#fff2f6' : '#ffffff';
    this.zeroPhaseTitle.style.dropShadow = true;
    this.zeroPhaseTitle.style.dropShadowColor = '#020006';
    this.zeroPhaseTitle.style.dropShadowBlur = isFinal ? 5 : 4;
    this.zeroPhaseSubtitle.position.set(this.width / 2, y + (isFinal ? 24 : 20));
    this.zeroPhaseSubtitle.style.fill = isFinal ? '#ffd8e4' : '#d7fbff';

    this.zeroPhaseNoiseSprite.visible = isWarning || isFinal;
    this.zeroPhaseNoiseSprite.position.set(this.width / 2, y);
    this.zeroPhaseNoiseSprite.alpha = isFinal ? 0.26 : 0.18;
    this.zeroPhaseNoiseSprite.scale.set(isFinal ? 1.14 : 0.88);

    this.zeroPhaseCoreSprite.visible = isFinal;
    this.zeroPhaseCoreSprite.position.set(this.width / 2, y + 2);
    this.zeroPhaseCoreSprite.alpha = 0.62;
    this.zeroPhaseCoreSprite.scale.set(0.68);
  }

  updateZeroPhaseNotice(delta) {
    if (this.gameState.selectedMode !== 'zero') {
      this.zeroPhaseLayer.visible = false;
      return;
    }

    if (this.isZeroPhaseNoticeBlocked()) {
      this.zeroPhaseLayer.visible = false;
      return;
    }

    if (this.zeroPhaseTimer <= 0) {
      const nextNotice = this.zeroPhaseQueue.shift();

      if (nextNotice) {
        this.startZeroPhaseNotice(nextNotice);
        return;
      }

      this.zeroPhaseLayer.visible = false;
      return;
    }

    this.zeroPhaseLayer.visible = true;
    this.zeroPhaseTimer = Math.max(0, this.zeroPhaseTimer - delta);
    this.updateZeroPhaseAnimation(delta);

    const age = this.zeroPhaseDuration - this.zeroPhaseTimer;
    const fadeIn = Math.min(1, age / 0.18);
    const fadeOut = Math.min(1, this.zeroPhaseTimer / 0.28);
    const pulse = this.zeroPhaseVariant === 'final'
      ? 1 + Math.sin(age * 22) * 0.018
      : 1 + Math.sin(age * 18) * 0.012;

    this.zeroPhaseLayer.alpha = Math.min(fadeIn, fadeOut);
    this.zeroPhaseLayer.scale.set(pulse);
    this.zeroPhaseLayer.pivot.set(this.width / 2, this.height / 2);
    this.zeroPhaseLayer.position.set(this.width / 2, this.height / 2);
  }

  updateZeroPhaseAnimation(delta) {
    if (this.zeroPhaseNoiseTextures?.length > 0) {
      this.zeroPhaseNoiseTimer += delta;
      const frameTime = 1 / Math.max(1, this.zeroPhaseNoiseFps);

      while (this.zeroPhaseNoiseTimer >= frameTime) {
        this.zeroPhaseNoiseTimer -= frameTime;
        this.zeroPhaseNoiseFrame = (this.zeroPhaseNoiseFrame + 1) % this.zeroPhaseNoiseTextures.length;
      }

      this.zeroPhaseNoiseSprite.texture = this.zeroPhaseNoiseTextures[this.zeroPhaseNoiseFrame] ?? Texture.EMPTY;
    }

    if (this.zeroPhaseCoreTextures?.length > 0) {
      this.zeroPhaseCoreTimer += delta;
      const frameTime = 1 / Math.max(1, this.zeroPhaseCoreFps);

      while (this.zeroPhaseCoreTimer >= frameTime) {
        this.zeroPhaseCoreTimer -= frameTime;
        this.zeroPhaseCoreFrame = (this.zeroPhaseCoreFrame + 1) % this.zeroPhaseCoreTextures.length;
      }

      this.zeroPhaseCoreSprite.texture = this.zeroPhaseCoreTextures[this.zeroPhaseCoreFrame] ?? Texture.EMPTY;
    }
  }

  triggerEvolutionWarning(candidate) {
    this.evolutionWarningTitle.text = '進化反応を検出';
    this.evolutionWarningText.text = candidate.message;
    this.evolutionWarningTimer = 1.45;
    this.evolutionWarningLayer.visible = true;
    this.evolutionWarningLayer.alpha = 1;
    this.audioManager?.play('evolution_ready');
  }

  updateEvolutionWarning(delta) {
    if (this.evolutionWarningTimer <= 0) {
      this.evolutionWarningLayer.visible = false;
      return;
    }

    this.evolutionWarningTimer = Math.max(0, this.evolutionWarningTimer - delta);
    this.evolutionWarningLayer.alpha = Math.min(1, this.evolutionWarningTimer / 0.18);
  }

  updateResultUi() {
    if (this.gameState.isGameOver) {
      if (!this.resultSaveInfo) {
        this.resultSaveInfo = this.saveManager?.recordRun(this.gameState) ?? null;
        if (this.evolutionDiscoveryResult?.isNew && this.resultSaveInfo) {
          this.resultSaveInfo = {
            ...this.resultSaveInfo,
            evolutionDiscovery: this.evolutionDiscoveryResult,
            newEvolutionRoute: this.evolutionDiscoveryResult.discovery,
          };
        }
      }

      if (!this.resultSoundPlayed) {
        this.resultSoundPlayed = true;
        const isZeroClear = this.gameState.selectedMode === 'zero' && this.gameState.isStageClear;
        const isClear = this.gameState.isStageClear;
        this.audioManager?.play(isZeroClear ? 'zero_clear' : isClear ? 'clear' : 'gameover');
        this.audioManager?.playBgm(
          isZeroClear ? 'result_zero_clear_jingle' : isClear ? 'result_clear_jingle' : 'result_gameover_jingle',
          { unlock: false, loop: false },
        );
      }

      this.resultUi.show(this.gameState, this.resultSaveInfo);
      return;
    }

    this.resultUi.hide();
  }

  restart() {
    this.saveManager?.saveSelections(this.gameState);
    const selectedStage = this.gameState.selectedStage;
    const selectedDifficulty = this.gameState.selectedDifficulty;
    const selectedDino = getDebugDinoId() ?? this.gameState.selectedDino;
    const selectedMode = this.gameState.selectedMode;

    this.clearInput();
    this.gameState = new GameState();
    this.gameState.selectedStage = selectedStage;
    this.gameState.selectedDifficulty = selectedDifficulty;
    this.gameState.selectedDino = selectedDino;
    this.gameState.selectedMode = selectedMode;
    this.applyDebugStageIfRequested();
    this.applyDebugDifficultyIfRequested();
    this.refreshRunConfig();
    this.loadStageBackground();
    this.spawnSystem.reset();
    this.nextBossTime = this.getInitialBossTime();
    this.bossSpawnInterval = this.getBossSpawnInterval();
    this.resetZeroBossProgress();
    this.zeroPhaseTimer = 0;
    this.zeroPhaseDuration = 0;
    this.zeroPhaseShownKeys.clear();
    this.zeroPhaseQueue = [];
    this.zeroPhaseLayer.visible = false;
    this.bossWarningTimer = 0;
    this.bossWarningLayer.visible = false;
    this.pendingLevelUps = [];
    this.levelUpFreezeTimer = 0;
    this.isLevelUpUiOpen = false;
    this.levelUpUi.hide();
    this.pauseUi.hide();
    this.resultUi.hide();
    this.evolutionReadyTimer = 0;
    this.evolutionFeedbackTimer = 0;
    this.evolutionAwakenShakePlayed = false;
    this.isEvolutionReadyUiOpen = false;
    this.evolutionReadyUi.hide();
    this.evolutionSequence.hide();
    this.evolutionDiscoveryResult = null;
    this.resultSaveInfo = null;
    this.resultSoundPlayed = false;
    this.bossClearSequence = null;
    this.bossDefeatFxLayer?.clear();
    this.hideBossDeathSprites();
    this.pickupModifiers = {
      magnetRadiusMultiplier: 1,
      pullMultiplier: 1,
    };
    this.screenShakeTimer = 0;
    this.screenShakeIntensity = 0;
    this.player.position.x = 0;
    this.player.position.y = 0;
    this.player.velocity.x = 0;
    this.player.velocity.y = 0;
    this.player.targetVelocity.x = 0;
    this.player.targetVelocity.y = 0;
    this.player.view.alpha = 1;
    this.player.resetStats();
    this.player.setAssetKeys({
      assetKey: this.getPlayerAssetKey(),
      sheetKey: this.getPlayerSheetKey(),
    });
    this.combatSystem.reset();
    this.ultimateSystem.reset();
    this.applyRunModifiers();
    this.syncZeroEvolutionUnlocks();
    this.applyDebugResearchUnlockIfRequested();
    this.applyDebugAdaptationSkillsIfRequested();
    this.applyDebugAdaptationAllLevelIfRequested();
    this.applyDebugEvolutionIfRequested();
    this.applyDebugSpecialReadyIfRequested();
    this.applyDebugEvolutionReadyIfRequested();
    this.didPlayDebugEvolutionDemo = false;
    this.playDebugEvolutionDemoIfRequested();
    this.applyDebugForceLevelupIfRequested();

    this.enemies.forEach((enemy) => enemy.view.destroy());
    this.enemies = [];
    this.enemyProjectiles.forEach((projectile) => projectile.view?.destroy());
    this.enemyProjectiles = [];
    this.bosses.forEach((boss) => boss.view.destroy());
    this.bosses = [];
    this.pickupBursts.forEach((burst) => burst.view?.destroy());
    this.pickupBursts = [];
    this.pickupPopups.forEach((popup) => popup.view?.destroy());
    this.pickupPopups = [];

    this.pickups.forEach((pickup) => pickup.view.destroy());
    this.pickups = this.createPickups();
    this.pickups.forEach((pickup) => this.depthLayer.addChild(pickup.view));

    this.depthLayer.addChild(this.player.view);
    this.camera.x = 0;
    this.camera.y = 0;
    this.createVignette();
    this.createStageGimmicks();
    this.updateCamera(1);
    this.updateMap(true);
    this.hud.update(this.gameState, this.getActiveBoss(), this.getHudLayoutOptions());
    this.triggerZeroStartNotice();
    this.updateResultUi();
    this.updateRunInfoLabel();
  }

  applyDebugForceLevelupIfRequested() {
    if (!shouldDebugForceLevelupTutorial()) {
      return;
    }

    const levelsGained = this.gameState.addExp(this.gameState.expToNextLevel);
    this.queueLevelUps(Math.max(1, levelsGained));
    this.levelUpFreezeTimer = 0.05;
  }

  returnHome() {
    this.saveManager?.saveSelections(this.gameState);

    if (this.onHome) {
      this.onHome();
      return;
    }

    this.restart();
  }

  createPickups() {
    return [];
  }

  getPlayerAssetKey() {
    return ASSET_KEYS.player[this.gameState.selectedDino] ?? ASSET_KEYS.player.velociraptor;
  }

  getPlayerSheetKey() {
    return ASSET_KEYS.playerSheets?.[this.gameState.selectedDino] ?? null;
  }

  getEvolutionSheetKey(selectedEvolution = null) {
    const dinoId = selectedEvolution?.dinoId ?? this.gameState.selectedDino;
    const tag = selectedEvolution?.tag ?? this.gameState.selectedEvolution?.tag;

    if (dinoId === 'triceratops') {
      if (tag === 'zero') {
        return ASSET_KEYS.evolutionSheets?.triceratopsZero ?? ASSET_KEYS.evolutionSheets?.triceratopsAttack ?? null;
      }

      if (tag === 'speed') {
        return ASSET_KEYS.evolutionSheets?.triceratopsSpeed ?? null;
      }

      if (tag === 'hunting') {
        return ASSET_KEYS.evolutionSheets?.triceratopsHunting ?? null;
      }

      if (tag === 'attack') {
        return ASSET_KEYS.evolutionSheets?.triceratopsAttack ?? null;
      }

      return null;
    }

    if (dinoId === 'tyrannosaurus') {
      if (tag === 'zero') {
        return ASSET_KEYS.evolutionSheets?.tyrannosaurusZero ?? ASSET_KEYS.evolutionSheets?.tyrannosaurusAttack ?? null;
      }

      if (tag === 'speed') {
        return ASSET_KEYS.evolutionSheets?.tyrannosaurusSpeed ?? null;
      }

      if (tag === 'hunting') {
        return ASSET_KEYS.evolutionSheets?.tyrannosaurusHunting ?? null;
      }

      if (tag === 'attack') {
        return ASSET_KEYS.evolutionSheets?.tyrannosaurusAttack ?? null;
      }

      return null;
    }

    if (dinoId === 'spinosaurus') {
      if (tag === 'zero') {
        return ASSET_KEYS.evolutionSheets?.spinosaurusZero ?? ASSET_KEYS.evolutionSheets?.spinosaurusAttack ?? null;
      }

      if (tag === 'speed') {
        return ASSET_KEYS.evolutionSheets?.spinosaurusSpeed ?? null;
      }

      if (tag === 'hunting') {
        return ASSET_KEYS.evolutionSheets?.spinosaurusHunting ?? null;
      }

      if (tag === 'attack') {
        return ASSET_KEYS.evolutionSheets?.spinosaurusAttack ?? null;
      }

      return null;
    }

    if (dinoId !== 'velociraptor') {
      return null;
    }

    if (tag === 'zero') {
      return ASSET_KEYS.evolutionSheets?.velociraptorZero ?? ASSET_KEYS.evolutionSheets?.velociraptorAttack ?? null;
    }

    if (tag === 'speed') {
      return ASSET_KEYS.evolutionSheets?.velociraptorSpeed ?? null;
    }

    if (tag === 'hunting') {
      return ASSET_KEYS.evolutionSheets?.velociraptorHunting ?? null;
    }

    if (tag === 'attack') {
      return ASSET_KEYS.evolutionSheets?.velociraptorAttack ?? null;
    }

    return null;
  }

  updateJoystick() {
    const radius = 31;
    const visiblePower = this.input.active ? Math.max(this.input.power, 0.16) : 0;
    const controls = this.optionsSettings?.controls ?? {};

    this.joystick.knob.position.set(
      this.input.x * radius * visiblePower,
      this.input.y * radius * visiblePower,
    );
    this.joystick.knobSprite.position.set(
      this.input.x * radius * visiblePower,
      this.input.y * radius * visiblePower,
    );
    this.joystick.knob.alpha = this.input.active ? 0.95 : 0.62;
    this.joystick.knobSprite.alpha = this.input.active ? 0.96 : 0.68;
    this.joystick.arrow.visible = controls.controlGuide !== false;
    this.joystick.arrow.alpha = controls.touchAssist === true
      ? (this.input.active ? 0.58 : 0.28)
      : (this.input.active ? 0.38 : 0.08);
  }

  createTinyBuildLabel() {
    const label = new Text({
      text: '蜃ｺ謦・擅莉ｶ',
      style: {
        fill: '#96d7bd',
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: 12,
        letterSpacing: 0,
      },
    });

    label.position.set(18, 108);
    label.alpha = 0;
    this.uiLayer.addChild(label);

    this.runInfoLabel = new Text({
      text: '',
      style: {
        fill: '#ffd36b',
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: 10,
        letterSpacing: 0,
      },
    });
    this.runInfoLabel.position.set(18, 124);
    this.runInfoLabel.alpha = 0;
    this.uiLayer.addChild(this.runInfoLabel);
    this.updateRunInfoLabel();
  }

  updateRunInfoLabel() {
    if (!this.runInfoLabel) {
      return;
    }

    this.refreshRunConfig();
    const modeLabel = this.gameState.selectedMode === 'endless'
      ? 'ENDLESS'
      : this.gameState.selectedMode === 'zero'
        ? 'ZERO'
        : 'NORMAL';
    this.runInfoLabel.text = `${this.stageConfig.label} / ${this.difficultyConfig.label} / ${this.dinoConfig.label} / ${modeLabel}`;
  }

  createVignette() {
    this.refreshRunConfig();
    this.vignette
      .clear()
      .rect(0, 0, this.width, this.height)
      .fill({ color: this.stageConfig.skyColor, alpha: this.stageConfig.ambientAlpha })
      .rect(0, 0, this.width, 70)
      .fill({ color: 0x000000, alpha: 0.08 })
      .rect(0, this.height - 104, this.width, 104)
      .fill({ color: 0x000000, alpha: 0.08 });

    this.view.hitArea = new Rectangle(0, 0, this.width, this.height);
  }

  getVisibilityAssistConfig() {
    const level = this.optionsSettings?.display?.visibilityAssist ?? 'standard';

    return VISIBILITY_ASSIST_CONFIG[level] ?? VISIBILITY_ASSIST_CONFIG.standard;
  }

  applyVisibilityAssistVisuals() {
    const config = this.getVisibilityAssistConfig();

    if (this.backgroundLayer) {
      this.backgroundLayer.alpha = config.backgroundAlpha;
    }

    this.drawVisibilityBackgroundLift(config);
    this.updateVisibilityGuideLayer();
  }

  drawVisibilityBackgroundLift(config = this.getVisibilityAssistConfig()) {
    if (!this.visibilityBackgroundLift) {
      return;
    }

    this.visibilityBackgroundLift.clear();

    if (config.backgroundLiftAlpha <= 0) {
      this.visibilityBackgroundLift.visible = false;
      return;
    }

    const padding = 1200;
    const x = STAGE_BOUNDS.left - padding;
    const y = STAGE_BOUNDS.top - padding;
    const width = STAGE_BOUNDS.right - STAGE_BOUNDS.left + padding * 2;
    const height = STAGE_BOUNDS.bottom - STAGE_BOUNDS.top + padding * 2;
    this.visibilityBackgroundLift.visible = true;
    this.visibilityBackgroundLift
      .rect(x, y, width, height)
      .fill({ color: 0x78d7ff, alpha: config.backgroundLiftAlpha })
      .rect(x, y, width, height)
      .fill({ color: 0xffffff, alpha: config.backgroundLiftAlpha * 0.18 });
  }

  updateVisibilityGuideLayer() {
    if (!this.visibilityGuideLayer) {
      return;
    }

    const config = this.getVisibilityAssistConfig();
    this.visibilityGuideLayer.clear();

    if (config.playerOutlineAlpha <= 0 || !this.player?.position) {
      this.visibilityGuideLayer.visible = false;
      return;
    }

    this.visibilityGuideLayer.visible = true;
    const pulse = 0.92 + Math.sin(this.gameState.elapsedTime * 5.2) * 0.08;
    const playerRadius = (this.player.radius ?? 24) + 8;
    this.visibilityGuideLayer
      .circle(this.player.position.x, this.player.position.y + 2, playerRadius)
      .stroke({ color: 0x9df6ff, width: 3.2, alpha: config.playerOutlineAlpha * pulse })
      .circle(this.player.position.x, this.player.position.y + 2, playerRadius + 8)
      .stroke({ color: 0xffffff, width: 1.2, alpha: config.playerOutlineAlpha * 0.42 });

    (this.enemies ?? []).forEach((enemy) => {
      if (enemy.isDead) {
        return;
      }

      const radius = Math.max(16, enemy.radius ?? 18) + 5;
      this.visibilityGuideLayer
        .circle(enemy.position.x, enemy.position.y + 2, radius)
        .stroke({ color: 0xffd36b, width: 1.6, alpha: config.enemyOutlineAlpha });
    });

    (this.bosses ?? []).forEach((boss) => {
      if (boss.isDead) {
        return;
      }

      const radius = Math.max(52, boss.radius ?? 54) + 10;
      this.visibilityGuideLayer
        .circle(boss.position.x, boss.position.y + 5, radius)
        .stroke({ color: 0xff6b62, width: 2, alpha: config.bossOutlineAlpha });
    });
  }

  noise(x, y) {
    const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return value - Math.floor(value);
  }

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  formatTime(elapsedTime) {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = Math.floor(elapsedTime % 60);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}
