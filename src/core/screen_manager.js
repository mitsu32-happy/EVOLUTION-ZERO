import { Container, Graphics, Text } from 'pixi.js';
import { AudioManager } from '../audio/audio_manager.js';
import { GameState } from './game_state.js';
import { GamepadManager } from '../input/gamepad_manager.js';
import { IntroOverlay } from '../intro/intro_overlay.js';
import { SaveManager } from '../save/save_manager.js';
import { PlayScene } from '../scenes/play_scene.js';
import { AssetBulkCacheManager } from '../utils/asset_cache_manager.js';
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
import { ASSET_KEYS } from '../data/asset_manifest.js';
import { getCompanionById } from '../data/companion_dinos.js';
import { getEvolutionBranchesForDino } from '../data/evolution_data.js';
import { getNormalAttackById } from '../data/normal_attacks.js';
import { getDinoConfig, getStageBossConfig, getStageConfig } from '../data/run_config.js';
import { RESEARCH_PT_TO_DNA_RATE } from '../data/research.js';

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
const DEBUG_DINO_IDS = new Set([
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
]);

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
      title: 'ホーム',
      body: '出撃や研究、図鑑確認など、ゲームの拠点です。',
      target: 'ホーム',
      targetId: 'home.navHome',
      tooltipPosition: 'top',
    },
    {
      title: '研究',
      body: 'DNAがたまったら、新しい恐竜や強化を解放できます。',
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
  companionEggResearch: [
    {
      title: 'お供研究',
      body: '新しい研究領域が解放されました。\nお供タブから詳細を確認できます。',
      target: 'お供タブ',
      targetId: 'research.companionTab',
      tooltipPosition: 'bottom',
    },
  ],
  companionTabViewed: [
    {
      title: 'お供タブ',
      body: '所持お供の確認と卵の孵化を切り替えられます。\n強化にはDNAを消費します。',
      target: 'お供研究',
      targetId: 'research.companionPanel',
      tooltipPosition: 'top',
    },
  ],
  companionHomeViewed: [
    {
      title: 'お供恐竜',
      body: 'セット中のお供恐竜はここに表示されます。\nタップするとお供を切り替えられます。',
      target: 'お供',
      targetId: 'home.companion',
      tooltipPosition: 'bottom',
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
    this.applyQaCleanSave();
    this.applyDebugTutorialReset();
    this.applyDebugResearchPt();
    this.applyDebugDna();
    this.applyDebugCompanion();
    this.applyDebugStageProgress();
    this.applyDebugTitleRewards();
    this.applyDebugDailyMissions();
    this.assetLoader = new AssetLoader();
    this.assetCacheManager = new AssetBulkCacheManager();
    this.loadingTimings = this.createLoadingTimingState();
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
    this.gamepadManager = new GamepadManager({
      onConnectionChange: ({ connected }) => this.showGamepadNotice(connected ? 'コントローラー接続' : 'コントローラー切断'),
    });
    this.gamepadNoticeTimer = 0;
    this.gamepadNoticeBg = new Graphics();
    this.gamepadNoticeText = this.createGamepadText('', 13, '#e7fff6', 230);
    this.gamepadDebugBg = new Graphics();
    this.gamepadDebugText = this.createGamepadText('', 10, '#d7fff2', 260);
    this.gamepadFocusRing = new Graphics();
    this.gamepadCursor = new Graphics();
    this.gamepadCursorPosition = { x: Math.round(width / 2), y: Math.round(height / 2) };
    this.gamepadClickPulse = 0;
    this.gamepadScrollAccumulator = 0;

    this.titleScreen = new TitleScreen({
      width,
      height,
      assetLoader: this.assetLoader,
      onStart: () => this.showHome(),
      onIntro: () => this.playIntroFromTitle(),
      onUiFeedback: (id = 'ui_confirm') => this.playOptionalUi(id),
      onApplyUpdate: () => this.applyPwaUpdate(),
      onAssetCache: () => this.withUiClick(() => this.showAssetCacheOptionsFromTitle()),
    });
    this.homeScreen = null;
    this.researchScreen = null;
    this.codexScreen = null;
    this.optionsScreen = null;
    this.assetPreviewScreen = null;
    this.stageSelectScreen = null;
    this.dinoSelectScreen = null;
    this.playScene = null;
    this.lastPlaySceneCleanup = null;

    this.screens = {
      title: this.titleScreen,
    };

    this.view.addChild(
      this.titleScreen.view,
      this.loadingUi.view,
      this.tutorialUi.view,
      this.gamepadFocusRing,
      this.gamepadCursor,
      this.gamepadNoticeBg,
      this.gamepadNoticeText,
      this.gamepadDebugBg,
      this.gamepadDebugText,
    );
    this.setupGamepadOverlay();
    this.installKeyboardCancelShortcut();
    this.installTitleShortcuts();
    this.installTitleCueUnlock();
    this.installPwaUpdateListener();
    if (this.introOverlay.shouldShowOnBoot()) {
      this.showIntroGate();
    } else {
      this.show('title');
    }

    if (getDebugParams().get('debugAutoPlay') === '1') {
      window.setTimeout(() => {
        this.showPlay();
      }, 0);
    }
  }

  applyQaCleanSave() {
    if (!import.meta.env.DEV || getDebugParams().get('qaCleanSave') !== '1') {
      return;
    }

    this.saveManager.debugResetAll?.();
  }

  installKeyboardCancelShortcut() {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (this.handleKeyboardCancel()) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
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
      onResearch: (categoryId = null) => this.withUiClick(() => this.showResearch(categoryId)),
      onCodex: () => this.withUiClick(() => this.showCodex()),
      onOptions: () => this.withUiClick(() => this.showOptions('home')),
      onUiFeedback: (id = 'ui_click') => this.playOptionalUi(id),
      onApplyUpdate: () => this.applyPwaUpdate(),
      onCompanionHomeVisible: () => this.showTutorial('companionHomeViewed'),
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
      onCompanionResearchUnlocked: () => this.showTutorial('companionEggResearch'),
      onCompanionTabViewed: () => this.showTutorial('companionTabViewed'),
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
      assetCacheManager: this.assetCacheManager,
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

  async showAssetCacheOptionsFromTitle() {
    const optionsScreen = this.ensureOptionsScreen();

    optionsScreen.setReturnScreen?.('home');
    this.show('options');
    optionsScreen.showAssetCacheOverlay?.();
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
    if (this.playScene?.isDisposed) {
      this.disposePlayScene('stale-play-scene');
    }

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
      gamepadManager: this.gamepadManager,
      onHome: () => this.showHome(),
      onTitle: () => this.showTitle(),
      onOptions: () => this.showOptions('play'),
    }));

    return this.playScene;
  }

  disposePlayScene(reason = 'screen-transition') {
    if (!this.playScene) {
      return null;
    }

    const scene = this.playScene;
    this.gameState = scene.gameState ?? this.gameState;
    const cleanupStats = scene.cleanupSceneResources?.(reason) ?? null;
    this.lastPlaySceneCleanup = cleanupStats;
    scene.view?.parent?.removeChild?.(scene.view);
    delete this.screens.play;
    this.playScene = null;
    return cleanupStats;
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

  createLoadingTimingState() {
    const now = this.now();
    const bootStart = typeof window !== 'undefined'
      ? (window.__EVOLUTION_ZERO_LOADING_TIMINGS__?.appBootStart ?? now)
      : now;
    return {
      appBootStart: bootStart,
      titleVisible: null,
      homeVisible: null,
      playSceneStart: null,
      firstControllableFrame: null,
      criticalAssetsReady: null,
      appBootToTitleVisibleMs: null,
      titleToHomeVisibleMs: null,
      homeToPlaySceneStartMs: null,
      playSceneStartToFirstControllableFrameMs: null,
      playSceneStartToCriticalAssetsReadyMs: null,
    };
  }

  now() {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
  }

  recordLoadingTiming(name) {
    const now = this.now();
    this.loadingTimings[name] = now;

    if (this.loadingTimings.titleVisible !== null) {
      this.loadingTimings.appBootToTitleVisibleMs = Math.round(this.loadingTimings.titleVisible - this.loadingTimings.appBootStart);
    }
    if (this.loadingTimings.titleVisible !== null && this.loadingTimings.homeVisible !== null) {
      this.loadingTimings.titleToHomeVisibleMs = Math.round(this.loadingTimings.homeVisible - this.loadingTimings.titleVisible);
    }
    if (this.loadingTimings.homeVisible !== null && this.loadingTimings.playSceneStart !== null) {
      this.loadingTimings.homeToPlaySceneStartMs = Math.round(this.loadingTimings.playSceneStart - this.loadingTimings.homeVisible);
    }
    if (this.loadingTimings.playSceneStart !== null && this.loadingTimings.firstControllableFrame !== null) {
      this.loadingTimings.playSceneStartToFirstControllableFrameMs = Math.round(this.loadingTimings.firstControllableFrame - this.loadingTimings.playSceneStart);
    }
    if (this.loadingTimings.playSceneStart !== null && this.loadingTimings.criticalAssetsReady !== null) {
      this.loadingTimings.playSceneStartToCriticalAssetsReadyMs = Math.round(this.loadingTimings.criticalAssetsReady - this.loadingTimings.playSceneStart);
    }

    this.publishLoadingDiagnostics();
  }

  publishLoadingDiagnostics() {
    if (typeof window === 'undefined') {
      return;
    }

    const payload = {
      ...this.loadingTimings,
      assets: this.assetLoader?.getDiagnostics?.() ?? null,
      assetCache: this.assetCacheManager?.getDiagnostics?.() ?? null,
    };

    try {
      window.__EVOLUTION_ZERO_LOADING_TIMINGS__ = payload;
      document.querySelector('#app').__EVOLUTION_ZERO_LOADING_TIMINGS__ = payload;
    } catch {
      // Loading diagnostics are optional.
    }
  }

  toAssetKeySuffix(id = '') {
    return String(id).replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  collectObjectAssetKeys(value, keys = []) {
    if (!value || typeof value !== 'object') {
      return keys;
    }

    Object.entries(value).forEach(([entryKey, entryValue]) => {
      if (typeof entryValue === 'string' && (entryKey === 'assetKey' || entryKey === 'warningAssetKey' || entryKey === 'attackAssetKey' || entryKey === 'beamAssetKey' || entryKey === 'fieldAssetKey' || entryKey === 'burstAssetKey')) {
        keys.push(entryValue);
      } else if (entryValue && typeof entryValue === 'object') {
        this.collectObjectAssetKeys(entryValue, keys);
      }
    });

    return keys;
  }

  getSelectedCompanionForCriticalAssets() {
    const saveData = this.saveManager?.getData?.();
    const companionId = this.gameState?.selectedCompanionId
      ?? saveData?.companion?.selectedId
      ?? null;

    return companionId ? getCompanionById(companionId) : null;
  }

  getSelectedRunCriticalAssetKeys() {
    const dinoId = this.gameState.selectedDino ?? 'velociraptor';
    const stageId = this.gameState.selectedStage ?? 'jungle';
    const difficultyId = this.gameState.selectedDifficulty ?? 'normal';
    const dinoConfig = getDinoConfig(dinoId);
    const normalAttack = getNormalAttackById(dinoConfig.normalAttackId);
    const stageConfig = getStageConfig(stageId);
    const bossConfig = getStageBossConfig(stageId, difficultyId);
    const companion = this.getSelectedCompanionForCriticalAssets();
    const enemyTypes = new Set(['swarm', 'fast', 'tank']);

    Object.keys(stageConfig.enemyWeights ?? {}).forEach((enemyType) => enemyTypes.add(enemyType));
    Object.keys(stageConfig.difficultyEnemyWeights?.[difficultyId] ?? {}).forEach((enemyType) => enemyTypes.add(enemyType));

    const keys = [
      ASSET_KEYS.player?.[dinoId],
      ASSET_KEYS.playerSheets?.[dinoId],
      normalAttack?.effectKey,
      normalAttack?.iconKey,
      companion?.assetKey,
      companion?.effectAssetKey,
      companion?.iconAssetKey,
      ...[...enemyTypes].map((enemyType) => ASSET_KEYS.enemies?.[enemyType]),
      bossConfig?.assetKey,
      ...Object.values(bossConfig?.effectKeys ?? {}),
      ...this.collectObjectAssetKeys(bossConfig?.attacks ?? {}),
    ];

    getEvolutionBranchesForDino(dinoId).forEach((branch) => {
      keys.push(
        ASSET_KEYS.evolutionSheets?.[this.toAssetKeySuffix(branch.id)],
        branch.normalAttackEffectKey,
      );
    });

    if (dinoId === 'compsognathus') {
      keys.push(normalAttack?.effectKey);
    }

    return [...new Set(keys.filter(Boolean))];
  }

  update(delta) {
    const safeDelta = Math.max(0, Math.min(delta, 1 / 20));
    const actions = this.gamepadManager.update(safeDelta);
    this.handleGamepadActions(actions);
    this.updateGamepadOverlay(safeDelta);

    if (this.currentScreen === 'play' && this.playScene) {
      try {
        this.playScene.update(safeDelta);
      } catch (error) {
        this.playScene.gameState.isPaused = true;
        this.gameState = this.playScene.gameState;
        try {
          window.__EVOLUTION_ZERO_LAST_RUNTIME_ERROR__ = {
            message: error?.message ?? String(error),
            stack: error?.stack ?? null,
            timestamp: Date.now(),
          };
        } catch {
          // Debug crash state is optional.
        }
        console.error('[EVOLUTION ZERO] play update failed', error);
      }
    }
  }

  handleGamepadActions(actions) {
    if (!this.gamepadManager.connected) {
      return;
    }

    if (this.tutorialUi.view?.visible) {
      this.tutorialUi.handleGamepadAction?.(actions);
      return;
    }

    if (this.currentScreen === 'play' && this.playScene) {
      this.playScene.handleGamepadActions?.(actions, this.gamepadManager);
      return;
    }

    if (this.handleGamepadVirtualMouse(actions, this.gamepadManager)) {
      return;
    }

    if (actions.cancelPressed) {
      this.handleDefaultGamepadCancel();
    }
  }

  handleKeyboardCancel() {
    if (this.tutorialUi.view?.visible) {
      return this.tutorialUi.handleGamepadAction?.({ cancelPressed: true }) ?? false;
    }

    if (this.currentScreen === 'play' && this.playScene) {
      this.playScene.handleGamepadActions?.({ cancelPressed: true }, this.gamepadManager);
      return true;
    }

    const screen = this.screens[this.currentScreen];
    if (screen?.handleGamepadAction?.({ cancelPressed: true, pausePressed: true }, this.gamepadManager)) {
      return true;
    }

    this.handleDefaultGamepadCancel();
    return true;
  }

  handleGamepadVirtualMouse(actions, gamepadManager) {
    if (actions.cancelPressed) {
      return false;
    }

    const cursor = this.gamepadCursorPosition;
    const dpadX = actions.right ? 1 : actions.left ? -1 : 0;
    const dpadY = actions.down ? 1 : actions.up ? -1 : 0;
    const moveX = gamepadManager.moveX || dpadX;
    const moveY = gamepadManager.moveY || dpadY;
    const delta = Math.max(1 / 120, Math.min(1 / 20, gamepadManager.lastDelta ?? 1 / 60));
    const speed = 520;

    if (moveX || moveY) {
      const dpadPower = dpadX || dpadY ? 0.75 : 0;
      const power = Math.max(gamepadManager.movePower || 0, dpadPower, 0.45);
      cursor.x = Math.max(8, Math.min(this.width - 8, cursor.x + moveX * speed * delta * power));
      cursor.y = Math.max(8, Math.min(this.height - 8, cursor.y + moveY * speed * delta * power));
    }

    this.handleGamepadVirtualScroll(gamepadManager);

    if (actions.confirmPressed) {
      this.dispatchGamepadPointerClick(cursor.x, cursor.y);
      this.gamepadClickPulse = 0.16;
      return true;
    }

    return Boolean(moveX || moveY || Math.abs(gamepadManager.rightY ?? 0) > 0.25);
  }

  handleGamepadVirtualScroll(gamepadManager) {
    const rightY = Number(gamepadManager.rightY ?? 0);
    if (Math.abs(rightY) <= 0.25) {
      this.gamepadScrollAccumulator = 0;
      return;
    }

    const screen = this.screens[this.currentScreen];
    if (screen?.handleGamepadScroll?.(rightY, gamepadManager)) {
      return;
    }

    this.gamepadScrollAccumulator += rightY * 24;
    if (Math.abs(this.gamepadScrollAccumulator) < 8) {
      return;
    }

    const amount = this.gamepadScrollAccumulator;
    this.gamepadScrollAccumulator = 0;
    this.dispatchGamepadWheel(this.gamepadCursorPosition.x, this.gamepadCursorPosition.y, amount);
  }

  dispatchGamepadPointerClick(x, y) {
    const point = this.toCanvasClientPoint(x, y);
    if (!point || typeof PointerEvent === 'undefined') {
      return;
    }

    const common = {
      bubbles: true,
      cancelable: true,
      composed: true,
      pointerId: 77,
      pointerType: 'mouse',
      isPrimary: true,
      button: 0,
      buttons: 1,
      clientX: point.x,
      clientY: point.y,
    };

    this.canvas.dispatchEvent(new PointerEvent('pointerdown', common));
    this.canvas.dispatchEvent(new PointerEvent('pointerup', { ...common, buttons: 0 }));
  }

  dispatchGamepadWheel(x, y, deltaY) {
    const point = this.toCanvasClientPoint(x, y);
    if (!point || typeof WheelEvent === 'undefined') {
      return;
    }

    this.canvas.dispatchEvent(new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      clientX: point.x,
      clientY: point.y,
      deltaY,
      deltaMode: 0,
    }));
  }

  toCanvasClientPoint(x, y) {
    const rect = this.canvas?.getBoundingClientRect?.();
    if (!rect || rect.width <= 0 || rect.height <= 0) {
      return null;
    }

    return {
      x: rect.left + (x / this.width) * rect.width,
      y: rect.top + (y / this.height) * rect.height,
    };
  }

  handleDefaultGamepadCancel() {
    if (this.currentScreen === 'title' || this.currentScreen === 'home') {
      return;
    }

    if (this.currentScreen === 'options') {
      this.withUiClick(() => this.returnFromOptions());
      return;
    }

    if (this.currentScreen === 'stageSelect') {
      this.withUiClick(() => this.showHome());
      return;
    }

    if (this.currentScreen === 'dinoSelect') {
      this.withUiClick(() => this.showStageSelect());
      return;
    }

    this.withUiClick(() => this.showHome());
  }

  setupGamepadOverlay() {
    this.gamepadNoticeText.anchor.set(0.5);
    this.gamepadFocusRing.eventMode = 'none';
    this.gamepadFocusRing.interactiveChildren = false;
    this.gamepadCursor.eventMode = 'none';
    this.gamepadCursor.interactiveChildren = false;
    this.gamepadNoticeBg.eventMode = 'none';
    this.gamepadNoticeText.eventMode = 'none';
    this.gamepadDebugBg.eventMode = 'none';
    this.gamepadDebugText.eventMode = 'none';
    this.gamepadNoticeBg.interactiveChildren = false;
    this.gamepadNoticeText.interactiveChildren = false;
    this.gamepadDebugBg.interactiveChildren = false;
    this.gamepadDebugText.interactiveChildren = false;
    this.gamepadDebugText.position.set(16, 46);
    this.gamepadNoticeBg.visible = false;
    this.gamepadNoticeText.visible = false;
    this.gamepadDebugBg.visible = false;
    this.gamepadDebugText.visible = false;
  }

  showGamepadNotice(message) {
    this.gamepadNoticeTimer = 2.6;
    this.gamepadNoticeText.text = message;
    this.gamepadNoticeBg.visible = true;
    this.gamepadNoticeText.visible = true;
    this.drawGamepadNotice(1);
  }

  updateGamepadOverlay(delta) {
    this.updateGamepadNotice(delta);
    this.updateGamepadDebug();
    this.updateGamepadFocusRing();
    this.updateGamepadCursor(delta);
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

  updateGamepadDebug() {
    if (!this.gamepadManager.debugEnabled) {
      this.gamepadDebugBg.visible = false;
      this.gamepadDebugText.visible = false;
      return;
    }

    const snapshot = this.gamepadManager.getDebugSnapshot();
    this.gamepadDebugText.text = [
      `Gamepad: ${snapshot.connected ? 'detected' : 'none'}`,
      snapshot.name ? `Name: ${snapshot.name}` : '',
      `Buttons: ${snapshot.pressedButtons.join(', ') || '-'}`,
      `Axes: ${snapshot.axes.join(', ')}`,
      `Right: ${snapshot.right?.join(', ') ?? '-'} (${snapshot.rightSource ?? '-'})`,
      `Action: ${snapshot.actions || '-'}`,
      `Pause: ${snapshot.pauseDetected ? 'YES' : 'no'}`,
    ].filter(Boolean).join('\n');
    this.gamepadDebugBg
      .clear()
      .roundRect(10, 34, 286, 104, 8)
      .fill({ color: 0x02080c, alpha: 0.76 })
      .stroke({ color: 0x35d7ff, width: 1, alpha: 0.45 });
    this.gamepadDebugBg.visible = true;
    this.gamepadDebugText.visible = true;
  }

  updateGamepadFocusRing() {
    this.gamepadFocusRing.clear();
  }

  updateGamepadCursor(delta) {
    this.gamepadCursor.clear();
    if (!this.gamepadManager.connected || this.currentScreen === 'play') {
      return;
    }

    this.gamepadClickPulse = Math.max(0, this.gamepadClickPulse - delta);
    const { x, y } = this.gamepadCursorPosition;
    const pulse = this.gamepadClickPulse > 0 ? 1.5 : 1;
    this.gamepadCursor
      .circle(x, y, 10 * pulse)
      .fill({ color: 0x061116, alpha: 0.62 })
      .stroke({ color: 0xffd36b, width: 2.4, alpha: 0.95 })
      .circle(x, y, 3.8 * pulse)
      .fill({ color: 0x35d7ff, alpha: 0.92 })
      .moveTo(x - 15, y)
      .lineTo(x + 15, y)
      .moveTo(x, y - 15)
      .lineTo(x, y + 15)
      .stroke({ color: 0xbfffee, width: 1.2, alpha: 0.64 });
  }

  createGamepadText(text, size, fill, wordWrapWidth = 260) {
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
        dropShadow: true,
        dropShadowColor: '#02080c',
        dropShadowBlur: 3,
      },
    });
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
    this.resetGamepadCursorForScreen(screenName);
    this.syncPwaUpdateNotice();
    this.updateBgmForScreen(screenName);
    if (screenName === 'title') {
      if (this.loadingTimings.titleVisible === null) {
        this.recordLoadingTiming('titleVisible');
      }
      this.queueTitleCue();
    } else if (screenName === 'home') {
      this.recordLoadingTiming('homeVisible');
    } else if (screenName === 'play') {
      this.recordLoadingTiming('firstControllableFrame');
    }
  }

  getCrashDiagnosticsContext(reason = 'manual') {
    const playContext = this.playScene?.getCrashDiagnosticsContext?.(reason) ?? {};

    return {
      currentScreen: this.currentScreen,
      screen: this.currentScreen,
      lastPlaySceneCleanup: this.lastPlaySceneCleanup,
      assetCache: this.assetCacheManager?.getDiagnostics?.() ?? null,
      ...playContext,
    };
  }

  resetGamepadCursorForScreen(screenName) {
    const presets = {
      title: { x: this.width / 2, y: 652 },
      home: { x: this.width / 2, y: 458 },
      stageSelect: { x: this.width / 2, y: 626 },
      dinoSelect: { x: this.width / 2, y: 724 },
      result: { x: this.width / 2, y: 690 },
      options: { x: this.width / 2, y: 402 },
      research: { x: this.width / 2, y: 390 },
      codex: { x: this.width / 2, y: 168 },
    };
    const target = presets[screenName] ?? { x: this.width / 2, y: this.height / 2 };
    this.gamepadCursorPosition.x = Math.max(8, Math.min(this.width - 8, Math.round(target.x)));
    this.gamepadCursorPosition.y = Math.max(8, Math.min(this.height - 8, Math.round(target.y)));
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
      this.playScene.setCompanionTutorialSuppressed?.(true);
    }

    const finish = (tutorialId) => {
      if (shouldPausePlay && this.playScene?.gameState) {
        this.playScene.isTutorialPaused = false;
        this.playScene.setCompanionTutorialSuppressed?.(false);
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
        'home.navHome': { x: 24, y: bottomNavY, width: 78, height: 72, radius: 12 },
        'home.research': { x: 112, y: bottomNavY, width: 78, height: 72, radius: 12 },
        'home.codex': { x: 198, y: bottomNavY, width: 78, height: 72, radius: 12 },
        'home.title': { x: Math.round(width / 2 - 88), y: 158, width: 176, height: 28, radius: 8 },
        'home.news': { x: 244, y: 20, width: 128, height: 42, radius: 12 },
        'home.banner': { x: 18, y: 536, width: 354, height: 126, radius: 14 },
        'home.companion': { x: 18, y: 92, width: 168, height: 58, radius: 12 },
        'home.options': { x: 286, y: bottomNavY, width: 78, height: 72, radius: 12 },
      },
      research: {
        'research.companionTab': { x: Math.round(width / 2 - 34), y: 218, width: 68, height: 58, radius: 10 },
        'research.companionPanel': { x: 18, y: 394, width: 354, height: 292, radius: 14 },
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
      this.disposePlayScene('show-home');
    }
    this.saveManager.load();
    this.applyDebugResearchPt();
    this.applyDebugTitleRewards();
    this.applyDebugDailyMissions();
    this.audioManager.applySettings(this.saveManager.getAudioSettings());
    this.saveManager.applyToGameState(this.gameState);
    this.applyDebugRunSelection();
    await this.loadAssetGroups(['home'], 'ホームUI読み込み中', 'ロード中');
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

  async showResearch(initialCategory = null) {
    this.saveManager.load();
    this.applyDebugResearchPt();
    this.saveManager.recordDailyProgress('openResearch', 1);
    await this.loadAssetGroups(['research'], '研究UI読み込み中');
    this.ensureResearchScreen();
    this.researchScreen.saveManager = this.saveManager;
    this.researchScreen.setInitialCategory?.(initialCategory);
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

    this.saveManager.data.ownedDna = Math.max(
      this.saveManager.data.ownedDna ?? 0,
      value * RESEARCH_PT_TO_DNA_RATE,
    );
    this.saveManager.data.researchPt = 0;
  }

  applyDebugDna() {
    if (!import.meta.env.DEV) {
      return;
    }

    const value = Number(getDebugParams().get('debugDna'));
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }

    this.saveManager.data.ownedDna = Math.max(this.saveManager.data.ownedDna ?? 0, Math.floor(value));
  }

  applyDebugCompanion() {
    if (!import.meta.env.DEV) {
      return;
    }

    const params = getDebugParams();
    if (params.get('debugCompanionClear') === '1') {
      this.saveManager.debugResetCompanion?.();
    }

    if (params.get('debugCompanionEgg') === '1' || params.get('debugCompanionGrantEgg') === '1') {
      this.saveManager.grantCompanionEgg?.('debug');
    }

    if (params.get('debugCompanionIncubating') === '1') {
      this.saveManager.grantCompanionEgg?.('debug');
      this.saveManager.startCompanionEggIncubation?.({ instant: false });
    }

    if (params.get('debugCompanionHatchReady') === '1') {
      this.saveManager.grantCompanionEgg?.('debug');
      this.saveManager.startCompanionEggIncubation?.({ instant: true });
    }

    if (params.get('debugUnlockCompanions') === '1' || params.get('debugCompanionAllOwned') === '1') {
      this.saveManager.debugUnlockCompanions?.();
    }

    const companionId = params.get('debugSelectCompanion')
      ?? params.get('debugCompanionId')
      ?? params.get('debugCompanionOwned');
    if (companionId) {
      if (params.has('debugSelectCompanion') || params.has('debugCompanionId')) {
        this.saveManager.debugSelectCompanion?.(companionId);
        return;
      }

      this.saveManager.debugGrantCompanion?.(companionId);
    }
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
    const dinoId = params.get('debugDino');

    if (DEBUG_STAGE_IDS.has(stageId)) {
      this.gameState.selectedStage = stageId;
    }

    if (DEBUG_DINO_IDS.has(dinoId)) {
      this.gameState.selectedDino = dinoId;
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
    this.recordLoadingTiming('playSceneStart');
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
    const criticalPreloadTask = this.assetLoader.preloadCritical(
      this.getSelectedRunCriticalAssetKeys(),
      { label: 'play:selected-run' },
    );
    await this.loadAssetGroups(playGroups, 'プレイ資源読み込み中', 'ロード中');
    await criticalPreloadTask;
    this.recordLoadingTiming('criticalAssetsReady');
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
