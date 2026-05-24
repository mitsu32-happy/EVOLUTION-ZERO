import { Container } from 'pixi.js';
import { AudioManager } from '../audio/audio_manager.js';
import { GameState } from './game_state.js';
import { IntroOverlay } from '../intro/intro_overlay.js';
import { SaveManager } from '../save/save_manager.js';
import { PlayScene } from '../scenes/play_scene.js';
import { AssetLoader } from '../utils/asset_loader.js';
import { AssetPreviewScreen } from '../ui/asset_preview_screen.js';
import { CodexScreen } from '../ui/codex_screen.js';
import { DinoSelectScreen } from '../ui/dino_select_screen.js';
import { HomeScreen } from '../ui/home_screen.js';
import { OptionsScreen } from '../ui/options_screen.js';
import { ResearchScreen } from '../ui/research_screen.js';
import { StageSelectScreen } from '../ui/stage_select_screen.js';
import { TitleScreen } from '../ui/title_screen.js';
import {
  ENDLESS_TITLES,
  STAGE_CLEAR_TITLES,
  ZERO_TITLES,
  getTitleFrameForTitle,
} from '../data/reward_titles.js';

function getDebugResearchPt() {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = Number(new URLSearchParams(window.location.search).get('debugResearchPt'));

  return Number.isFinite(value) && value > 0 ? Math.floor(value) : null;
}

function getDebugParams() {
  if (typeof window === 'undefined') {
    return new URLSearchParams();
  }

  return new URLSearchParams(window.location.search);
}

const DEBUG_STAGE_IDS = new Set(['jungle', 'volcano', 'swamp', 'ruins']);
const DEBUG_DIFFICULTY_IDS = new Set(['normal', 'hard', 'expert']);

export class ScreenManager {
  constructor({ canvas, width, height }) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.view = new Container();
    this.currentScreen = 'title';
    this.optionsReturnScreen = 'home';
    this.pendingTitleCue = false;
    this.titleCuePlayedForVisit = false;
    this.audioManager = new AudioManager();
    this.saveManager = new SaveManager();
    this.applyDebugResearchPt();
    this.applyDebugStageProgress();
    this.applyDebugTitleRewards();
    this.applyDebugDailyMissions();
    this.assetLoader = new AssetLoader();
    this.audioManager.applySettings(this.saveManager.getAudioSettings());
    this.introOverlay = new IntroOverlay({
      audioManager: this.audioManager,
      saveManager: this.saveManager,
      onComplete: () => this.showTitle(),
    });
    this.audioManager.preload([
      'ui_select',
      'ui_decide',
      'ui_cancel',
      'title_bgm',
      'home_bgm',
      'jungle_bgm',
      'zero_bgm',
      'normal_boss_bgm',
      'result_clear_jingle',
      'result_zero_clear_jingle',
    ]);
    this.gameState = new GameState();
    this.saveManager.applyToGameState(this.gameState);
    this.applyDebugRunSelection();

    this.titleScreen = new TitleScreen({
      width,
      height,
      assetLoader: this.assetLoader,
      onStart: () => this.showHome(),
      onIntro: () => this.playIntroFromTitle(),
      onUiFeedback: (id = 'ui_confirm') => this.playOptionalUi(id),
    });
    this.homeScreen = new HomeScreen({
      width,
      height,
      gameState: this.gameState,
      saveData: this.saveManager.getData(),
      saveManager: this.saveManager,
      assetLoader: this.assetLoader,
      onDeploy: () => this.withUiClick(() => this.showStageSelect()),
      onResearch: () => this.withUiClick(() => this.showResearch()),
      onCodex: () => this.withUiClick(() => this.showCodex()),
      onOptions: () => this.withUiClick(() => this.showOptions('home')),
      onUiFeedback: (id = 'ui_click') => this.playOptionalUi(id),
    });
    this.researchScreen = new ResearchScreen({
      width,
      height,
      saveManager: this.saveManager,
      assetLoader: this.assetLoader,
      onHome: () => this.withUiClick(() => this.showHome()),
      onResearch: () => this.withUiClick(() => this.showResearch()),
      onCodex: () => this.withUiClick(() => this.showCodex()),
      onOptions: () => this.withUiClick(() => this.showOptions('home')),
    });
    this.codexScreen = new CodexScreen({
      width,
      height,
      saveManager: this.saveManager,
      onHome: () => this.withUiClick(() => this.showHome()),
      onResearch: () => this.withUiClick(() => this.showResearch()),
      onCodex: () => this.withUiClick(() => this.showCodex()),
      onOptions: () => this.withUiClick(() => this.showOptions('home')),
    });
    this.optionsScreen = new OptionsScreen({
      width,
      height,
      saveManager: this.saveManager,
      audioManager: this.audioManager,
      onBack: () => this.withUiClick(() => this.returnFromOptions()),
      onHome: () => this.withUiClick(() => this.showHome()),
      onResearch: () => this.withUiClick(() => this.showResearch()),
      onCodex: () => this.withUiClick(() => this.showCodex()),
      onAssetPreview: () => this.withUiClick(() => this.showAssetPreview()),
    });
    this.assetPreviewScreen = new AssetPreviewScreen({
      width,
      height,
      assetLoader: this.assetLoader,
      onBack: () => this.withUiClick(() => this.show('options')),
    });
    this.stageSelectScreen = new StageSelectScreen({
      width,
      height,
      gameState: this.gameState,
      saveData: this.saveManager.getData(),
      assetLoader: this.assetLoader,
      onBack: () => this.withUiClick(() => this.showHome()),
      onContinue: () => this.withUiClick(() => this.showDinoSelect()),
    });
    this.dinoSelectScreen = new DinoSelectScreen({
      width,
      height,
      gameState: this.gameState,
      saveData: this.saveManager.getData(),
      assetLoader: this.assetLoader,
      onBack: () => this.withUiClick(() => this.showStageSelect()),
      onStart: () => this.withUiClick(() => this.showPlay()),
    });
    this.playScene = new PlayScene({
      canvas,
      width,
      height,
      gameState: this.gameState,
      saveManager: this.saveManager,
      audioManager: this.audioManager,
      assetLoader: this.assetLoader,
      onHome: () => this.showHome(),
      onTitle: () => this.showTitle(),
      onOptions: () => this.showOptions('play'),
    });

    this.screens = {
      title: this.titleScreen,
      home: this.homeScreen,
      research: this.researchScreen,
      codex: this.codexScreen,
      options: this.optionsScreen,
      assetPreview: this.assetPreviewScreen,
      stageSelect: this.stageSelectScreen,
      dinoSelect: this.dinoSelectScreen,
      play: this.playScene,
    };

    this.view.addChild(
      this.titleScreen.view,
      this.homeScreen.view,
      this.researchScreen.view,
      this.codexScreen.view,
      this.optionsScreen.view,
      this.assetPreviewScreen.view,
      this.stageSelectScreen.view,
      this.dinoSelectScreen.view,
      this.playScene.view,
    );
    this.installTitleShortcuts();
    this.installTitleCueUnlock();
    if (this.introOverlay.shouldShowOnBoot()) {
      this.showIntroGate();
    } else {
      this.show('title');
    }
  }

  update(delta) {
    if (this.currentScreen === 'play') {
      this.playScene.update(delta);
    }
  }

  show(screenName) {
    if (!this.introOverlay.root.hidden) {
      this.introOverlay.stopMedia();
    }
    this.introOverlay.root.hidden = true;
    if (screenName !== 'title') {
      this.titleCuePlayedForVisit = false;
      this.pendingTitleCue = false;
    }
    Object.entries(this.screens).forEach(([name, screen]) => {
      if (name === screenName) {
        screen.show?.();
        screen.view.visible = true;
      } else {
        screen.hide?.();
        screen.view.visible = false;
      }
    });
    this.currentScreen = screenName;
    this.updateBgmForScreen(screenName);
    if (screenName === 'title') {
      this.queueTitleCue();
    }
  }

  showHome() {
    this.gameState = this.playScene.gameState;
    this.saveManager.load();
    this.applyDebugResearchPt();
    this.applyDebugTitleRewards();
    this.applyDebugDailyMissions();
    this.audioManager.applySettings(this.saveManager.getAudioSettings());
    this.saveManager.applyToGameState(this.gameState);
    this.applyDebugRunSelection();
    this.homeScreen.setSaveData(this.saveManager.getData(), this.gameState);
    this.show('home');
  }

  showTitle() {
    this.show('title');
  }

  showIntroGate() {
    Object.values(this.screens).forEach((screen) => {
      screen.hide?.();
      screen.view.visible = false;
    });
    this.currentScreen = 'intro';
    this.audioManager.stopBgm();
    this.introOverlay.showInitialGate();
  }

  playIntroFromTitle() {
    Object.values(this.screens).forEach((screen) => {
      screen.hide?.();
      screen.view.visible = false;
    });
    this.currentScreen = 'intro';
    this.audioManager.stopBgm();
    this.introOverlay.playFromTitle();
  }

  installTitleShortcuts() {
    [
      [this.homeScreen, ['logoSprite', 'logoFallback']],
      [this.stageSelectScreen, ['title']],
      [this.dinoSelectScreen, ['title']],
      [this.codexScreen, ['title']],
      [this.researchScreen, ['title']],
      [this.optionsScreen, ['title', 'titleEn']],
      [this.assetPreviewScreen, ['title', 'titleEn']],
    ].forEach(([screen, targetNames]) => this.bindTitleShortcut(screen, targetNames));
  }

  installTitleCueUnlock() {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('pointerdown', () => {
      if (this.currentScreen !== 'title' || !this.pendingTitleCue) {
        return;
      }

      this.audioManager.unlockAudio();
      this.playTitleCueNow();
    }, { passive: true });
  }

  queueTitleCue() {
    if (this.titleCuePlayedForVisit) {
      return;
    }

    this.pendingTitleCue = true;

    window.setTimeout(() => {
      if (this.currentScreen !== 'title' || !this.pendingTitleCue) {
        return;
      }

      if (!this.audioManager.isUnlocked) {
        return;
      }

      this.playTitleCueNow();
    }, 160);
  }

  playTitleCueNow() {
    if (this.titleCuePlayedForVisit || !this.pendingTitleCue) {
      return;
    }

    this.pendingTitleCue = false;
    this.titleCuePlayedForVisit = true;
    this.audioManager.playOptional('zero_warning', {
      volume: 0.5,
      cooldown: 0,
      durationHintMs: 1100,
      fadeOutMs: 180,
      maxInstances: 1,
    });
  }

  bindTitleShortcut(screen, targetNames) {
    targetNames.forEach((targetName) => {
      const target = screen?.[targetName];

      if (!target || target.__titleShortcutInstalled) {
        return;
      }

      target.eventMode = 'static';
      target.cursor = 'pointer';
      target.on('pointertap', (event) => {
        event?.stopPropagation?.();
        this.withUiClick(() => this.showTitle());
      });
      target.__titleShortcutInstalled = true;
    });
  }

  showStageSelect() {
    this.saveManager.load();
    this.applyDebugResearchPt();
    this.applyDebugStageProgress();
    this.applyDebugRunSelection();
    this.syncSelectionScreens();
    this.stageSelectScreen.setSaveData?.(this.saveManager.getData());
    this.show('stageSelect');
  }

  showResearch() {
    this.saveManager.load();
    this.applyDebugResearchPt();
    this.saveManager.recordDailyProgress('openResearch', 1);
    this.researchScreen.saveManager = this.saveManager;
    this.show('research');
  }

  showCodex() {
    this.saveManager.load();
    this.saveManager.recordDailyProgress('openCodex', 1);
    this.codexScreen.saveManager = this.saveManager;
    this.show('codex');
  }

  showOptions(returnScreen = this.currentScreen) {
    this.optionsReturnScreen = returnScreen;
    this.saveManager.load();
    this.audioManager.applySettings(this.saveManager.getAudioSettings());
    this.optionsScreen.saveManager = this.saveManager;
    this.optionsScreen.audioManager = this.audioManager;
    this.optionsScreen.setReturnScreen?.(returnScreen);
    this.show('options');
  }

  showAssetPreview() {
    this.show('assetPreview');
  }

  returnFromOptions() {
    if (this.optionsReturnScreen === 'play') {
      this.playScene.applyOptionsSettings?.(this.saveManager.getOptionsSettings());
      this.show('play');
      return;
    }

    this.showHome();
  }

  showDinoSelect() {
    this.saveManager.load();
    this.applyDebugResearchPt();
    this.applyDebugRunSelection();
    this.syncSelectionScreens();
    this.dinoSelectScreen.setSaveData?.(this.saveManager.getData());
    this.show('dinoSelect');
  }

  applyDebugResearchPt() {
    const value = getDebugResearchPt();

    if (value === null) {
      return;
    }

    this.saveManager.data.researchPt = Math.max(this.saveManager.data.researchPt ?? 0, value);
  }

  applyDebugStageProgress() {
    const params = getDebugParams();

    if (!params.toString()) {
      return;
    }

    const now = new Date().toISOString();
    let changed = false;

    if (params.get('debugStageProgressReset') === '1') {
      this.saveManager.data.stageProgress = this.saveManager.normalizeStageProgress({});
      changed = true;
    }

    if (params.get('debugUnlockDifficulties') === '1') {
      const progress = this.saveManager.normalizeStageProgress(this.saveManager.data.stageProgress);
      Object.values(progress).forEach((stage) => {
        ['normal', 'hard', 'expert'].forEach((difficultyId) => {
          stage[difficultyId].cleared = true;
          stage[difficultyId].firstClearedAt = stage[difficultyId].firstClearedAt ?? now;
        });
      });
      this.saveManager.data.stageProgress = progress;
      changed = true;
    }

    const debugClear = params.get('debugStageClear');
    if (debugClear) {
      const stageId = params.get('debugStage') ?? this.saveManager.data.lastSelectedStage ?? 'jungle';
      const progress = this.saveManager.normalizeStageProgress(this.saveManager.data.stageProgress);
      const entry = progress[stageId]?.[debugClear];

      if (entry && debugClear !== 'endless') {
        entry.cleared = true;
        entry.firstClearedAt = entry.firstClearedAt ?? now;
        this.saveManager.data.stageProgress = progress;
        changed = true;
      }
    }

    if (changed) {
      this.saveManager.save();
    }
  }

  applyDebugRunSelection() {
    const params = getDebugParams();
    const stageId = params.get('debugStage');
    const difficultyId = params.get('debugDifficulty');

    if (DEBUG_STAGE_IDS.has(stageId)) {
      this.gameState.selectedStage = stageId;
    }

    if (DEBUG_DIFFICULTY_IDS.has(difficultyId)) {
      this.gameState.selectedDifficulty = difficultyId;
      this.gameState.selectedMode = 'standard';
      return;
    }

    if (difficultyId === 'endless') {
      this.gameState.selectedDifficulty = 'normal';
      this.gameState.selectedMode = 'endless';
      return;
    }

    if (difficultyId === 'zero') {
      this.gameState.selectedDifficulty = 'expert';
      this.gameState.selectedMode = 'zero';
    }
  }

  applyDebugTitleRewards() {
    const params = getDebugParams();

    if (params.get('debugUnlockAllTitles') !== '1' && params.get('debugTitleReward') !== '1') {
      if (params.get('debugResetEquippedTitle') === '1') {
        this.saveManager.data.equippedTitleId = null;
        this.saveManager.data.equippedTitleFrameId = null;
        this.saveManager.save();
      }
      return;
    }

    const now = new Date().toISOString();
    if (params.get('debugResetEquippedTitle') === '1') {
      this.saveManager.data.equippedTitleId = null;
      this.saveManager.data.equippedTitleFrameId = null;
    }
    const titles = params.get('debugUnlockAllTitles') === '1'
      ? [...STAGE_CLEAR_TITLES, ...ENDLESS_TITLES, ...ZERO_TITLES]
      : STAGE_CLEAR_TITLES.slice(0, 1);

    this.saveManager.data.ownedTitles = this.saveManager.normalizeOwnedEntries(this.saveManager.data.ownedTitles);
    this.saveManager.data.ownedTitleFrames = this.saveManager.normalizeOwnedEntries(this.saveManager.data.ownedTitleFrames);
    titles.forEach((title) => {
      const source = `debug_${title.id}`;
      this.saveManager.data.ownedTitles[title.id] = {
        owned: true,
        unlockedAt: this.saveManager.data.ownedTitles[title.id]?.unlockedAt ?? now,
        source: this.saveManager.data.ownedTitles[title.id]?.source ?? source,
      };
      const frame = getTitleFrameForTitle(title);
      if (frame) {
        this.saveManager.data.ownedTitleFrames[frame.id] = {
          owned: true,
          unlockedAt: this.saveManager.data.ownedTitleFrames[frame.id]?.unlockedAt ?? now,
          source: this.saveManager.data.ownedTitleFrames[frame.id]?.source ?? source,
        };
      }
    });

    const defaultTitle = params.get('debugUnlockAllTitles') === '1'
      ? [...titles].sort((a, b) => (b.displayOrder ?? 0) - (a.displayOrder ?? 0))[0]
      : titles[0];

    if (!this.saveManager.data.equippedTitleId && defaultTitle) {
      this.saveManager.data.equippedTitleId = defaultTitle.id;
    }

    if (!this.saveManager.data.equippedTitleFrameId && defaultTitle) {
      this.saveManager.data.equippedTitleFrameId = getTitleFrameForTitle(defaultTitle)?.id ?? null;
    }

    this.saveManager.save();
  }

  applyDebugDailyMissions() {
    const params = getDebugParams();
    let changed = false;

    const debugDate = params.get('debugDailyDate');
    if (debugDate && /^\d{4}-\d{2}-\d{2}$/.test(debugDate)) {
      this.saveManager.forceDailyMissionsDate(debugDate);
      changed = true;
    }

    if (params.get('debugDailyReset') === '1') {
      this.saveManager.forceDailyMissionsDate();
      changed = true;
    }

    if (params.get('debugDailyComplete') === '1') {
      this.saveManager.completeDailyMissionsForDebug();
      changed = true;
    }

    if (!changed) {
      this.saveManager.ensureDailyMissionsCurrent();
    }
  }

  showPlay() {
    this.applyDebugRunSelection();
    this.saveManager.recordDailyProgress('runStarted', 1);
    if (this.gameState.selectedMode === 'standard') {
      this.saveManager.recordDailyProgress('normalStagePlayed', 1);
    }
    this.playScene.restart();
    this.playScene.applyOptionsSettings?.(this.saveManager.getOptionsSettings());
    this.gameState = this.playScene.gameState;
    this.syncSelectionScreens();
    this.show('play');
  }

  syncSelectionScreens() {
    this.stageSelectScreen.gameState = this.gameState;
    this.stageSelectScreen.setSaveData?.(this.saveManager.getData());
    this.dinoSelectScreen.gameState = this.gameState;
    this.homeScreen.gameState = this.gameState;
  }

  withUiClick(callback) {
    this.audioManager.unlockAudio();
    this.audioManager.playOptional('ui_click');
    callback();
  }

  playOptionalUi(id = 'ui_click') {
    this.audioManager.unlockAudio();
    this.audioManager.playOptional(id);
  }

  updateBgmForScreen(screenName) {
    if (screenName === 'play') {
      const stageBgm = {
        jungle: 'jungle_bgm',
        volcano: 'volcano_bgm',
        swamp: 'swamp_bgm',
        ruins: 'ruins_bgm',
      };
      const bgmId = this.gameState.selectedMode === 'zero'
        ? 'zero_bgm'
        : this.gameState.selectedMode === 'endless'
          ? 'endless_bgm'
          : stageBgm[this.gameState.selectedStage] ?? 'normal_stage_bgm';
      this.audioManager.playBgm(bgmId, { unlock: false, loop: true });
      return;
    }

    if (screenName === 'title') {
      this.audioManager.playBgm('title_bgm', { unlock: false, loop: true });
      return;
    }

    if (screenName === 'home') {
      this.audioManager.playBgm('home_bgm', { unlock: false, loop: true });
      return;
    }

    if (screenName !== 'stageSelect' && screenName !== 'dinoSelect') {
      return;
    }

    this.audioManager.playBgm('home_bgm', { unlock: false, loop: true });
  }
}
