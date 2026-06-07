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
import { LoadingUi } from '../ui/loading_ui.js';
import { OptionsScreen } from '../ui/options_screen.js';
import { ResearchScreen } from '../ui/research_screen.js';
import { StageSelectScreen } from '../ui/stage_select_screen.js';
import { TitleScreen } from '../ui/title_screen.js';
import { TutorialUi } from '../ui/tutorial_ui.js';
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

function isTutorialDebugEnabled() {
  return Boolean(import.meta.env.DEV);
}

const DEBUG_STAGE_IDS = new Set(['jungle', 'volcano', 'swamp', 'ruins']);
const DEBUG_DIFFICULTY_IDS = new Set(['normal', 'hard', 'expert']);

const TUTORIAL_PAGES = {
  home: [
    {
      title: '出撃',
      body: 'ここからステージへ出撃します。\nまずはNORMALで操作に慣れましょう。',
      target: '出撃ボタン',
      targetId: 'home.deploy',
      tooltipPosition: 'top',
    },
    {
      title: 'デイリー',
      body: '毎日更新される目標です。\n達成すると研究Ptを獲得できます。',
      target: 'デイリー',
      targetId: 'home.daily',
      tooltipPosition: 'top',
    },
    {
      title: 'ホーム',
      body: '出撃やデイリー確認など、ゲームの拠点です。',
      target: 'ホーム',
      targetId: 'home.navHome',
      tooltipPosition: 'top',
    },
    {
      title: '研究',
      body: 'DNAや研究Ptがたまったら、新しい恐竜や強化を解放できます。',
      target: '研究 / 解放',
      targetId: 'home.research',
      tooltipPosition: 'top',
    },
    {
      title: '図鑑',
      body: '恐竜や進化先の情報を確認できます。',
      target: '図鑑',
      targetId: 'home.codex',
      tooltipPosition: 'top',
    },
    {
      title: '設定',
      body: '音量や操作、表示の設定を変更できます。',
      target: '設定',
      targetId: 'home.options',
      tooltipPosition: 'top',
    },
    {
      title: '称号',
      body: '称号やフレームを変更できます。\n獲得した実績をホームに表示できます。',
      target: '称号',
      targetId: 'home.title',
      tooltipPosition: 'bottom',
    },
    {
      title: 'お知らせ',
      body: 'アップデート内容を確認できます。\n追加や修正の内容はここにまとまります。',
      target: 'お知らせ',
      targetId: 'home.news',
      tooltipPosition: 'bottom',
    },
  ],
  sortie: [
    {
      title: 'ステージを選ぶ',
      body: 'ステージによって敵やギミックが変わります。',
      target: 'ステージカード',
      targetId: 'stage.cards',
      tooltipPosition: 'bottom',
    },
    {
      title: '難易度を選ぶ',
      body: '難易度が高いほど敵が強くなります。\nENDLESSは限界まで挑戦するモード、\nZEROは最高難易度のモードです。',
      target: '難易度',
      targetId: 'stage.difficulty',
      tooltipPosition: 'top',
    },
    {
      title: '恐竜選択へ',
      body: '条件を選んだら恐竜選択へ進みます。\n選んだ恐竜で戦い方が変わります。',
      target: '恐竜選択へ進む',
      targetId: 'stage.continue',
      tooltipPosition: 'top',
    },
  ],
  dinoSelect: [
    {
      title: '恐竜を選ぶ',
      body: '恐竜ごとに移動速度、耐久、攻撃が違います。\n最初は扱いやすい恐竜を選びましょう。',
      target: '恐竜カード',
      targetId: 'dino.cards',
      tooltipPosition: 'bottom',
    },
    {
      title: '特徴を確認',
      body: '恐竜ごとに戦い方が違います。\n特徴を見て選びましょう。',
      target: '詳細カード',
      targetId: 'dino.detail',
      tooltipPosition: 'bottom',
    },
    {
      title: '出撃開始',
      body: '準備ができたら出撃開始です。\nステージ中は敵を倒して成長していきます。',
      target: '出撃開始',
      targetId: 'dino.start',
      tooltipPosition: 'top',
    },
  ],
  play: [
    {
      title: '基本操作',
      body: '画面をドラッグして恐竜を動かします。\n敵を倒して結晶を集めるとレベルアップします。',
      target: 'プレイ画面',
      targetId: 'play.move',
      tooltipPosition: 'top',
    },
    {
      title: 'HPとEXP',
      body: '上部でHP、EXP、レベルを確認できます。\nHPがなくなるとゲームオーバーです。',
      target: 'HUD',
      targetId: 'play.hud',
      tooltipPosition: 'bottom',
    },
    {
      title: '適応と進化',
      body: 'レベルアップ時に技や能力を選びます。\n適応Lvは進化条件にも関係します。',
      target: 'レベルアップ',
      targetId: 'play.levelupHint',
      tooltipPosition: 'top',
    },
    {
      title: '必殺技',
      body: 'ゲージがたまると必殺技を使えます。\n危ない時や敵が多い時に使いましょう。',
      target: '必殺ボタン',
      targetId: 'play.ultimate',
      tooltipPosition: 'top',
    },
    {
      title: '警告ガイド',
      body: '警告ガイドが出たら危険範囲です。\n攻撃が来る前に離れましょう。',
      target: '警告表示',
      targetId: 'play.warning',
      tooltipPosition: 'bottom',
    },
  ],
  levelup: [
    {
      title: 'カードの種類',
      body: '適応技は攻撃スキルです。\n能力強化は基礎ステータス、報酬はその場の補助です。',
      target: 'カード種別',
      highlight: { x: 28, y: 292, width: 334, height: 342 },
    },
    {
      title: '進化条件',
      body: '高速・狩猟・攻撃などの適応Lvは進化条件に影響します。\n狙う進化に合わせて選びましょう。',
      target: '適応Lv',
      highlight: { x: 28, y: 292, width: 334, height: 112 },
    },
  ],
};

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
    this.applyDebugTutorialReset();
    this.applyDebugResearchPt();
    this.applyDebugStageProgress();
    this.applyDebugTitleRewards();
    this.applyDebugDailyMissions();
    this.assetLoader = new AssetLoader();
    this.audioManager.applySettings(this.saveManager.getAudioSettings());
    this.audioManager.installPageLifecycleHandlers();
    this.introOverlay = new IntroOverlay({
      audioManager: this.audioManager,
      saveManager: this.saveManager,
      onComplete: () => this.showTitle({ forceCue: true }),
    });
    this.audioManager.preload([
      'ui_select',
      'ui_decide',
      'ui_cancel',
      'ui_click',
      'ui_confirm',
      'title_bgm',
    ]);
    this.gameState = new GameState();
    this.saveManager.applyToGameState(this.gameState);
    this.applyDebugRunSelection();
    this.loadingUi = new LoadingUi({ width, height });
    this.tutorialUi = new TutorialUi({ width, height });

    this.titleScreen = new TitleScreen({
      width,
      height,
      assetLoader: this.assetLoader,
      onStart: () => this.showHome(),
      onIntro: () => this.playIntroFromTitle(),
      onUiFeedback: (id = 'ui_confirm') => this.playOptionalUi(id),
      onApplyUpdate: () => this.applyPwaUpdate(),
    });
    this.homeScreen = null;
    this.researchScreen = null;
    this.codexScreen = null;
    this.optionsScreen = null;
    this.assetPreviewScreen = null;
    this.stageSelectScreen = null;
    this.dinoSelectScreen = null;
    this.playScene = null;

    this.screens = {
      title: this.titleScreen,
    };

    this.view.addChild(
      this.titleScreen.view,
      this.loadingUi.view,
      this.tutorialUi.view,
    );
    this.installTitleShortcuts();
    this.installTitleCueUnlock();
    this.installPwaUpdateListener();
    if (this.introOverlay.shouldShowOnBoot()) {
      this.showIntroGate();
    } else {
      this.show('title');
    }
  }

  registerScreen(name, screen) {
    if (!screen || this.screens[name]) {
      return screen;
    }

    this.screens[name] = screen;
    screen.view.visible = false;
    const loadingIndex = this.view.getChildIndex(this.loadingUi.view);
    this.view.addChildAt(screen.view, Math.max(0, loadingIndex));
    this.installScreenTitleShortcuts(name, screen);
    return screen;
  }

  ensureHomeScreen() {
    if (this.homeScreen) {
      return this.homeScreen;
    }

    this.homeScreen = this.registerScreen('home', new HomeScreen({
      width: this.width,
      height: this.height,
      gameState: this.gameState,
      saveData: this.saveManager.getData(),
      saveManager: this.saveManager,
      assetLoader: this.assetLoader,
      onDeploy: () => this.withUiClick(() => this.showStageSelect()),
      onResearch: () => this.withUiClick(() => this.showResearch()),
      onCodex: () => this.withUiClick(() => this.showCodex()),
      onOptions: () => this.withUiClick(() => this.showOptions('home')),
      onUiFeedback: (id = 'ui_click') => this.playOptionalUi(id),
      onApplyUpdate: () => this.applyPwaUpdate(),
    }));

    this.homeScreen.setPwaUpdateInfo?.(this.getVisiblePwaUpdateInfo('home'));

    return this.homeScreen;
  }

  ensureResearchScreen() {
    if (this.researchScreen) {
      return this.researchScreen;
    }

    this.researchScreen = this.registerScreen('research', new ResearchScreen({
      width: this.width,
      height: this.height,
      saveManager: this.saveManager,
      assetLoader: this.assetLoader,
      onHome: () => this.withUiClick(() => this.showHome()),
      onResearch: () => this.withUiClick(() => this.showResearch()),
      onCodex: () => this.withUiClick(() => this.showCodex()),
      onOptions: () => this.withUiClick(() => this.showOptions('home')),
    }));

    return this.researchScreen;
  }

  ensureCodexScreen() {
    if (this.codexScreen) {
      return this.codexScreen;
    }

    this.codexScreen = this.registerScreen('codex', new CodexScreen({
      width: this.width,
      height: this.height,
      saveManager: this.saveManager,
      onHome: () => this.withUiClick(() => this.showHome()),
      onResearch: () => this.withUiClick(() => this.showResearch()),
      onCodex: () => this.withUiClick(() => this.showCodex()),
      onOptions: () => this.withUiClick(() => this.showOptions('home')),
    }));

    return this.codexScreen;
  }

  ensureOptionsScreen() {
    if (this.optionsScreen) {
      return this.optionsScreen;
    }

    this.optionsScreen = this.registerScreen('options', new OptionsScreen({
      width: this.width,
      height: this.height,
      saveManager: this.saveManager,
      audioManager: this.audioManager,
      onBack: () => this.withUiClick(() => this.returnFromOptions()),
      onHome: () => this.withUiClick(() => this.showHome()),
      onResearch: () => this.withUiClick(() => this.showResearch()),
      onCodex: () => this.withUiClick(() => this.showCodex()),
      onAssetPreview: () => this.withUiClick(() => this.showAssetPreview()),
      onShowTutorial: () => this.withUiClick(() => {
        this.saveManager.resetTutorialFlags();
        this.showHome().then(() => this.showTutorial('home', { force: true }));
      }),
      onResetTutorial: () => this.withUiClick(() => {
        this.saveManager.resetTutorialFlags();
        this.showHome().then(() => this.showTutorial('home', { force: true }));
      }),
    }));

    return this.optionsScreen;
  }

  ensureAssetPreviewScreen() {
    if (this.assetPreviewScreen) {
      return this.assetPreviewScreen;
    }

    this.assetPreviewScreen = this.registerScreen('assetPreview', new AssetPreviewScreen({
      width: this.width,
      height: this.height,
      assetLoader: this.assetLoader,
      onBack: () => this.withUiClick(() => this.show('options')),
    }));

    return this.assetPreviewScreen;
  }

  ensureStageSelectScreen() {
    if (this.stageSelectScreen) {
      return this.stageSelectScreen;
    }

    this.stageSelectScreen = this.registerScreen('stageSelect', new StageSelectScreen({
      width: this.width,
      height: this.height,
      gameState: this.gameState,
      saveData: this.saveManager.getData(),
      assetLoader: this.assetLoader,
      onBack: () => this.withUiClick(() => this.showHome()),
      onContinue: () => this.withUiClick(() => this.showDinoSelect()),
    }));

    return this.stageSelectScreen;
  }

  ensureDinoSelectScreen() {
    if (this.dinoSelectScreen) {
      return this.dinoSelectScreen;
    }

    this.dinoSelectScreen = this.registerScreen('dinoSelect', new DinoSelectScreen({
      width: this.width,
      height: this.height,
      gameState: this.gameState,
      saveData: this.saveManager.getData(),
      assetLoader: this.assetLoader,
      onBack: () => this.withUiClick(() => this.showStageSelect()),
      onStart: () => this.withUiClick(() => this.showPlay()),
    }));

    return this.dinoSelectScreen;
  }

  ensurePlayScene() {
    if (this.playScene) {
      return this.playScene;
    }

    this.playScene = this.registerScreen('play', new PlayScene({
      canvas: this.canvas,
      width: this.width,
      height: this.height,
      gameState: this.gameState,
      saveManager: this.saveManager,
      audioManager: this.audioManager,
      assetLoader: this.assetLoader,
      tutorialUi: this.tutorialUi,
      onHome: () => this.showHome(),
      onTitle: () => this.showTitle(),
      onOptions: () => this.showOptions('play'),
    }));

    return this.playScene;
  }

  async loadAssetGroups(groupIds, label, title = 'ロード中') {
    const groups = (Array.isArray(groupIds) ? groupIds : [groupIds]).filter(Boolean);
    const alreadyLoaded = groups.every((groupId) => this.assetLoader.loadedGroups.has(groupId));

    if (alreadyLoaded) {
      return [];
    }

    this.loadingUi.show({ title, detail: label, progress: 0.04 });
    try {
      return await this.assetLoader.loadGroups(groups, {
        onProgress: ({ groupId, loaded, total }) => {
          this.loadingUi.update({
            detail: `${label} / ${groupId}`,
            progress: total > 0 ? loaded / total : 1,
          });
        },
      });
    } finally {
      this.loadingUi.hide();
    }
  }

  update(delta) {
    if (this.currentScreen === 'play' && this.playScene) {
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
    this.syncPwaUpdateNotice();
    this.updateBgmForScreen(screenName);
    if (screenName === 'title') {
      this.queueTitleCue();
    }
  }

  showTutorial(id, { force = false } = {}) {
    const debugTutorial = isTutorialDebugEnabled() ? getDebugParams().get('debugTutorial') : null;
    const isDebugForced = debugTutorial === id || debugTutorial === 'all';

    if (!force && !isDebugForced && this.saveManager.isTutorialComplete(id)) {
      return;
    }

    const pages = TUTORIAL_PAGES[id];
    if (!pages) {
      return;
    }

    const shouldPausePlay = id === 'play' && this.currentScreen === 'play' && this.playScene?.gameState;
    if (shouldPausePlay) {
      this.playScene.isTutorialPaused = true;
    }

    const finish = (tutorialId) => {
      if (shouldPausePlay && this.playScene?.gameState) {
        this.playScene.isTutorialPaused = false;
      }
      this.saveManager.markTutorialComplete(tutorialId);
    };

    this.tutorialUi.show({
      id,
      pages,
      onComplete: finish,
      onSkip: finish,
      getTargetBounds: (targetId, page) => this.getTutorialTargetBounds(id, targetId, page),
    });
  }

  getTutorialTargetBounds(id, targetId) {
    const width = this.width;
    const height = this.height;
    const bottomNavY = Math.max(702, height - 94);
    const screenBounds = this.screens[this.currentScreen]?.getTutorialBounds?.(targetId);

    if (screenBounds) {
      return screenBounds;
    }

    const bounds = {
      home: {
        'home.deploy': { x: 38, y: 418, width: 314, height: 76, radius: 14 },
        'home.daily': { x: 38, y: 520, width: 314, height: 180, radius: 14 },
        'home.navHome': { x: 24, y: bottomNavY, width: 78, height: 72, radius: 12 },
        'home.research': { x: 112, y: bottomNavY, width: 78, height: 72, radius: 12 },
        'home.codex': { x: 198, y: bottomNavY, width: 78, height: 72, radius: 12 },
        'home.title': { x: Math.round(width / 2 - 88), y: 158, width: 176, height: 28, radius: 8 },
        'home.news': { x: 226, y: 114, width: 130, height: 44, radius: 12 },
        'home.options': { x: 286, y: bottomNavY, width: 78, height: 72, radius: 12 },
      },
      sortie: {
        'stage.cards': { x: 22, y: 116, width: width - 44, height: 145, radius: 14 },
        'stage.difficulty': { x: 24, y: 558, width: width - 48, height: 92, radius: 12 },
        'stage.continue': { x: 36, y: Math.max(728, height - 112), width: width - 72, height: 72, radius: 12 },
      },
      dinoSelect: {
        'dino.cards': { x: 28, y: 116, width: width - 56, height: 132, radius: 14 },
        'dino.detail': { x: 28, y: 278, width: width - 56, height: 342, radius: 14 },
        'dino.start': { x: 34, y: Math.max(720, height - 108), width: width - 68, height: 76, radius: 12 },
      },
      play: {
        'play.hud': { x: 8, y: 14, width: width - 16, height: 104, radius: 12 },
        'play.move': { x: 44, y: 190, width: width - 88, height: 330, radius: 16 },
        'play.levelupHint': { x: 28, y: 292, width: width - 56, height: 342, radius: 14 },
        'play.ultimate': { x: width - 116, y: Math.max(670, height - 154), width: 94, height: 94, radius: 18 },
        'play.warning': { x: 42, y: 126, width: width - 84, height: 128, radius: 12 },
      },
      levelup: {
        'levelup.cards': { x: 28, y: 292, width: width - 56, height: 342, radius: 14 },
        'levelup.adaptation': { x: 28, y: 292, width: width - 56, height: 112, radius: 14 },
      },
    };

    return bounds[id]?.[targetId] ?? null;
  }

  async showHome() {
    if (this.playScene) {
      this.gameState = this.playScene.gameState;
    }
    this.saveManager.load();
    this.applyDebugResearchPt();
    this.applyDebugTitleRewards();
    this.applyDebugDailyMissions();
    this.audioManager.applySettings(this.saveManager.getAudioSettings());
    this.saveManager.applyToGameState(this.gameState);
    this.applyDebugRunSelection();
    await this.loadAssetGroups(['home'], 'ホーム資源読み込み中');
    this.ensureHomeScreen();
    this.homeScreen.setSaveData(this.saveManager.getData(), this.gameState);
    this.show('home');
    this.showTutorial('home');
  }

  showTitle({ forceCue = false } = {}) {
    if (forceCue) {
      this.titleCuePlayedForVisit = false;
      this.pendingTitleCue = false;
    }

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
    this.titleCuePlayedForVisit = false;
    this.pendingTitleCue = false;
    Object.values(this.screens).forEach((screen) => {
      screen.hide?.();
      screen.view.visible = false;
    });
    this.currentScreen = 'intro';
    this.audioManager.stopBgm();
    this.introOverlay.playFromTitle();
  }

  installTitleShortcuts() {
    Object.entries(this.screens).forEach(([name, screen]) => this.installScreenTitleShortcuts(name, screen));
  }

  installScreenTitleShortcuts(name, screen) {
    const targetMap = {
      home: ['logoSprite', 'logoFallback'],
      stageSelect: ['title'],
      dinoSelect: ['title'],
      codex: ['title'],
      research: ['title'],
      options: ['title', 'titleEn'],
      assetPreview: ['title', 'titleEn'],
    };

    this.bindTitleShortcut(screen, targetMap[name] ?? []);
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

  installPwaUpdateListener() {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('evolution-zero:pwa-update', (event) => {
      this.pwaUpdateInfo = {
        available: Boolean(event.detail?.available),
        currentVersion: event.detail?.currentVersion ?? null,
        build: event.detail?.build ?? null,
        debug: Boolean(event.detail?.debug),
      };
      this.syncPwaUpdateNotice();
      this.queuePwaAutoApply();
    });
  }

  getVisiblePwaUpdateInfo(surfaceName = this.currentScreen) {
    if (!this.pwaUpdateInfo?.available) {
      return null;
    }

    if (surfaceName !== 'title' && surfaceName !== 'home') {
      return null;
    }

    return this.pwaUpdateInfo;
  }

  syncPwaUpdateNotice() {
    const updateInfo = this.getVisiblePwaUpdateInfo(this.currentScreen);
    this.titleScreen?.setPwaUpdateInfo?.(this.currentScreen === 'title' ? updateInfo : null);
    this.homeScreen?.setPwaUpdateInfo?.(this.currentScreen === 'home' ? updateInfo : null);
    this.queuePwaAutoApply();
  }

  applyPwaUpdate() {
    if (!this.pwaUpdateInfo?.available || typeof window === 'undefined') {
      return;
    }

    window.dispatchEvent(new CustomEvent('evolution-zero:pwa-apply-update'));
  }

  queuePwaAutoApply() {
    if (!this.getVisiblePwaUpdateInfo(this.currentScreen) || this.pwaUpdateApplying) {
      return;
    }

    this.pwaUpdateApplying = true;
    window.setTimeout(() => {
      if (!this.getVisiblePwaUpdateInfo(this.currentScreen)) {
        this.pwaUpdateApplying = false;
        return;
      }

      this.applyPwaUpdate();
    }, 700);
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
      volume: 0.29,
      cooldown: 0,
      durationHintMs: 1800,
      fadeOutMs: 260,
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

  async showStageSelect() {
    this.saveManager.load();
    this.applyDebugResearchPt();
    this.applyDebugStageProgress();
    this.applyDebugRunSelection();
    await this.loadAssetGroups(['stageSelect'], 'ステージ一覧読み込み中', 'ロード中');
    this.ensureStageSelectScreen();
    this.syncSelectionScreens();
    this.stageSelectScreen.setSaveData?.(this.saveManager.getData());
    this.show('stageSelect');
    this.showTutorial('sortie');
  }

  async showResearch() {
    this.saveManager.load();
    this.applyDebugResearchPt();
    this.saveManager.recordDailyProgress('openResearch', 1);
    await this.loadAssetGroups(['research'], '研究UI読み込み中');
    this.ensureResearchScreen();
    this.researchScreen.saveManager = this.saveManager;
    this.show('research');
  }

  async showCodex() {
    this.saveManager.load();
    this.saveManager.recordDailyProgress('openCodex', 1);
    await this.loadAssetGroups(['codex'], '図鑑データ照合中', '進化データ照合中...');
    this.ensureCodexScreen();
    this.codexScreen.saveManager = this.saveManager;
    this.show('codex');
  }

  async showOptions(returnScreen = this.currentScreen) {
    this.optionsReturnScreen = returnScreen;
    this.saveManager.load();
    this.audioManager.applySettings(this.saveManager.getAudioSettings());
    await this.loadAssetGroups(['options'], '設定UI読み込み中');
    this.ensureOptionsScreen();
    this.optionsScreen.saveManager = this.saveManager;
    this.optionsScreen.audioManager = this.audioManager;
    this.optionsScreen.setReturnScreen?.(returnScreen);
    this.show('options');
  }

  async showAssetPreview() {
    await this.loadAssetGroups(['options'], 'アセット確認UI読み込み中');
    this.ensureAssetPreviewScreen();
    this.show('assetPreview');
  }

  async returnFromOptions() {
    if (this.optionsReturnScreen === 'play') {
      this.playScene.applyOptionsSettings?.(this.saveManager.getOptionsSettings());
      this.show('play');
      return;
    }

    await this.showHome();
  }

  async showDinoSelect() {
    this.saveManager.load();
    this.applyDebugResearchPt();
    this.applyDebugRunSelection();
    await this.loadAssetGroups(['dinoSelect'], '恐竜データ読み込み中', '進化データ照合中...');
    this.ensureStageSelectScreen();
    this.ensureDinoSelectScreen();
    this.syncSelectionScreens();
    this.dinoSelectScreen.setSaveData?.(this.saveManager.getData());
    this.show('dinoSelect');
    this.showTutorial('dinoSelect');
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

  async showPlay() {
    this.applyDebugRunSelection();
    this.saveManager.recordDailyProgress('runStarted', 1);
    if (this.gameState.selectedMode === 'standard') {
      this.saveManager.recordDailyProgress('normalStagePlayed', 1);
    }
    const playGroups = [
      'battle',
      `stage:${this.gameState.selectedStage ?? 'jungle'}`,
      `dino:${this.gameState.selectedDino ?? 'velociraptor'}`,
      this.gameState.selectedMode === 'zero' ? 'zero' : null,
    ].filter(Boolean);
    await this.loadAssetGroups(playGroups, 'プレイ資源読み込み中', 'ロード中');
    this.audioManager.preload([
      'home_bgm',
      'jungle_bgm',
      'volcano_bgm',
      'swamp_bgm',
      'ruins_bgm',
      'endless_bgm',
      'zero_bgm',
      'normal_boss_bgm',
      'boss_warning',
      'zero_boss_warning',
      'zero_warning',
    ]);
    this.ensurePlayScene();
    this.playScene.restart();
    this.playScene.applyOptionsSettings?.(this.saveManager.getOptionsSettings());
    this.gameState = this.playScene.gameState;
    this.syncSelectionScreens();
    this.show('play');
    this.showTutorial('play');
  }

  applyDebugTutorialReset() {
    const params = getDebugParams();
    if (!isTutorialDebugEnabled()) {
      return;
    }

    if (
      params.get('debugTutorialReset') === '1'
      || params.get('resetTutorial') === '1'
      || params.get('debugTutorial') === 'all'
    ) {
      this.saveManager.resetTutorialFlags();
    }
  }

  syncSelectionScreens() {
    if (this.stageSelectScreen) {
      this.stageSelectScreen.gameState = this.gameState;
      this.stageSelectScreen.setSaveData?.(this.saveManager.getData());
    }
    if (this.dinoSelectScreen) {
      this.dinoSelectScreen.gameState = this.gameState;
    }
    if (this.homeScreen) {
      this.homeScreen.gameState = this.gameState;
    }
  }

  withUiClick(callback) {
    this.audioManager.unlockAudio();
    this.audioManager.playOptional('ui_click');
    return callback?.();
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
