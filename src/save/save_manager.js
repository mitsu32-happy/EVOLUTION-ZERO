import {
  ANALYSIS_CONVERSION_RATES,
  getBodyResearchBonuses,
  getResearchCostDetail,
  getResearchItem,
  RESEARCH_CATEGORY_IDS,
  RESEARCH_LEVEL_DEFAULTS,
} from '../data/research.js';
import {
  createEvolutionDiscovery,
  getEvolutionBranchById,
  normalizeDiscoveredEvolutions,
} from '../data/evolution_data.js';
import {
  getEndlessTitleRewardsForRun,
  getTitleById,
  getTitleFrameById,
  getTitleFrameForTitle,
  getTitleRewardForStageClear,
  getZeroTitleRewardsForRun,
} from '../data/reward_titles.js';
import {
  formatDailyReward,
  getDailyMissionTemplate,
  getJstDateKey,
  normalizeDailyMissionsState,
} from '../data/daily_missions.js';
import {
  COMPANION_HATCH_CONFIG,
  cloneCompanionState,
  createDefaultCompanionState,
  getCompanionById,
  getCompanionUpgradeCost,
  normalizeCompanionState,
  pickRandomUnownedCompanion,
} from '../data/companion_dinos.js';

const SAVE_KEY = 'evolution_zero_save_v1';
const SAVE_VERSION = 1;
const STAGE_IDS = ['jungle', 'volcano', 'swamp', 'ruins'];
const STAGE_PROGRESS_KEYS = ['normal', 'hard', 'expert', 'endless', 'zero'];
const NEXT_DIFFICULTY_UNLOCKS = {
  normal: ['hard'],
  hard: ['expert'],
  expert: ['endless', 'zero'],
};
const ZERO_ROUTE_REWARD_BY_STAGE = {
  jungle: 'velociraptor_zero',
  volcano: 'triceratops_zero',
  swamp: 'tyrannosaurus_zero',
};

const DEFAULT_SAVE = {
  save_version: SAVE_VERSION,
  lastSelectedStage: 'jungle',
  lastSelectedDifficulty: 'normal',
  lastSelectedDino: 'velociraptor',
  lastSelectedMode: 'standard',
  bestSurvivalTime: 0,
  bestScore: 0,
  totalRuns: 0,
  totalDefeated: 0,
  totalExpGained: 0,
  researchPt: 0,
  ownedDna: 0,
  totalDnaEarned: 0,
  lastRunDnaEarned: 0,
  researchLevels: { ...RESEARCH_LEVEL_DEFAULTS },
  discoveredEvolutions: {},
  unlockedZeroRoutes: {},
  unlockedDinos: {},
  stageProgress: {},
  ownedTitles: {},
  ownedTitleFrames: {},
  equippedTitleId: null,
  equippedTitleFrameId: null,
  currentHomeDino: 'velociraptor',
  currentHomeEvolutionId: null,
  dailyMissions: { dateKey: null, missions: [] },
  dailyMissionClaims: {},
  companion: createDefaultCompanionState(),
  tutorialFlags: {
    home: false,
    sortie: false,
    dinoSelect: false,
    play: false,
    levelup: false,
    evolution: false,
    ultimate: false,
    warningGuide: false,
    companionEggPickup: false,
    companionEggResearch: false,
    companionObtained: false,
    companionSet: false,
  },
  audioSettings: {
    masterVolume: 0.8,
    bgmVolume: 0.45,
    seVolume: 0.65,
    uiVolume: 0.55,
    muted: false,
  },
  gameplaySettings: {
    effects: {
      screenShake: true,
      flash: true,
      damageNumbers: true,
      simpleEffects: false,
    },
    controls: {
      virtualStick: true,
      touchAssist: false,
      controlGuide: true,
    },
    display: {
      highVisibility: false,
      visibilityAssist: 'standard',
      backgroundDim: true,
      hudSize: 'standard',
    },
  },
};

export class SaveManager {
  constructor(storage = null) {
    this.storage = storage ?? this.getStorage();
    this.data = { ...DEFAULT_SAVE };
    this.load();
  }

  getStorage() {
    try {
      return globalThis.localStorage ?? null;
    } catch {
      return null;
    }
  }

  load() {
    if (!this.storage) {
      return this.getData();
    }

    try {
      const raw = this.storage.getItem(SAVE_KEY);

      if (!raw) {
        return this.getData();
      }

      const parsed = JSON.parse(raw);
      this.data = this.normalize(parsed);
    } catch {
      this.data = { ...DEFAULT_SAVE };
    }

    return this.getData();
  }

  save() {
    if (!this.storage) {
      return this.getData();
    }

    try {
      this.storage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch {
      // LocalStorage can be unavailable in restricted browser modes.
    }

    return this.getData();
  }

  getData() {
    this.ensureDailyMissionsCurrent();

    return {
      ...this.data,
      researchLevels: { ...this.data.researchLevels },
      dailyMissions: this.cloneDailyMissions(this.data.dailyMissions),
      dailyMissionClaims: { ...(this.data.dailyMissionClaims ?? {}) },
      companion: cloneCompanionState(this.data.companion),
      tutorialFlags: this.cloneTutorialFlags(this.data.tutorialFlags),
      audioSettings: { ...this.data.audioSettings },
      gameplaySettings: this.cloneGameplaySettings(this.data.gameplaySettings),
      discoveredEvolutions: normalizeDiscoveredEvolutions(this.data.discoveredEvolutions),
      unlockedZeroRoutes: { ...(this.data.unlockedZeroRoutes ?? {}) },
      unlockedDinos: { ...(this.data.unlockedDinos ?? {}) },
      stageProgress: this.cloneStageProgress(this.data.stageProgress),
      ownedTitles: this.cloneOwnedEntries(this.data.ownedTitles),
      ownedTitleFrames: this.cloneOwnedEntries(this.data.ownedTitleFrames),
      equippedTitleId: this.data.equippedTitleId ?? null,
      equippedTitleFrameId: this.data.equippedTitleFrameId ?? null,
    };
  }

  getStageProgress() {
    return this.cloneStageProgress(this.data.stageProgress);
  }

  isDifficultyUnlocked(stageId, difficultyId) {
    const progress = this.normalizeStageProgress(this.data.stageProgress);
    const stage = progress[stageId] ?? progress.jungle;

    if (difficultyId === 'normal') {
      return true;
    }

    if (difficultyId === 'hard') {
      return Boolean(stage?.normal?.cleared);
    }

    if (difficultyId === 'expert') {
      return Boolean(stage?.hard?.cleared);
    }

    if (difficultyId === 'zero' && stageId === 'ruins') {
      return false;
    }

    if (difficultyId === 'endless' || difficultyId === 'zero') {
      return Boolean(stage?.expert?.cleared);
    }

    return false;
  }

  getAudioSettings() {
    return { ...this.data.audioSettings };
  }

  getOptionsSettings() {
    return this.cloneGameplaySettings(this.data.gameplaySettings);
  }

  getTutorialFlags() {
    return this.cloneTutorialFlags(this.data.tutorialFlags);
  }

  isTutorialComplete(id) {
    return Boolean(this.normalizeTutorialFlags(this.data.tutorialFlags)[id]);
  }

  markTutorialComplete(id) {
    if (!id) {
      return this.getData();
    }

    this.data.tutorialFlags = {
      ...this.normalizeTutorialFlags(this.data.tutorialFlags),
      [id]: true,
    };

    return this.save();
  }

  resetTutorialFlags() {
    this.data.tutorialFlags = this.normalizeTutorialFlags({});
    return this.save();
  }

  updateAudioSettings(settings) {
    this.data.audioSettings = {
      ...DEFAULT_SAVE.audioSettings,
      ...this.data.audioSettings,
      ...settings,
      masterVolume: this.toClampedVolume(settings.masterVolume ?? this.data.audioSettings.masterVolume),
      bgmVolume: this.toClampedVolume(settings.bgmVolume ?? this.data.audioSettings.bgmVolume),
      seVolume: this.toClampedVolume(settings.seVolume ?? this.data.audioSettings.seVolume),
      uiVolume: this.toClampedVolume(settings.uiVolume ?? this.data.audioSettings.uiVolume),
      muted: Boolean(settings.muted ?? this.data.audioSettings.muted),
    };

    return this.save();
  }

  updateOptionsSettings(settings = {}) {
    this.data.gameplaySettings = this.normalizeGameplaySettings({
      ...this.data.gameplaySettings,
      ...settings,
      effects: {
        ...(this.data.gameplaySettings?.effects ?? {}),
        ...(settings.effects ?? {}),
      },
      controls: {
        ...(this.data.gameplaySettings?.controls ?? {}),
        ...(settings.controls ?? {}),
      },
      display: {
        ...(this.data.gameplaySettings?.display ?? {}),
        ...(settings.display ?? {}),
      },
    });

    return this.save();
  }

  setHomeDino(dinoId) {
    this.data.currentHomeDino = dinoId ?? DEFAULT_SAVE.currentHomeDino;
    this.data.currentHomeEvolutionId = null;

    return this.save();
  }

  setHomeEvolution(evolutionId) {
    const discovered = normalizeDiscoveredEvolutions(this.data.discoveredEvolutions);
    const entry = discovered[evolutionId];

    if (!entry) {
      return this.getData();
    }

    this.data.currentHomeDino = entry.dinoId ?? DEFAULT_SAVE.currentHomeDino;
    this.data.currentHomeEvolutionId = evolutionId;

    return this.save();
  }

  getDailyMissions() {
    this.ensureDailyMissionsCurrent();
    return this.cloneDailyMissions(this.data.dailyMissions);
  }

  ensureDailyMissionsCurrent(date = new Date()) {
    const dateKey = typeof date === 'string' ? date : getJstDateKey(date);
    this.data.dailyMissions = normalizeDailyMissionsState(this.data.dailyMissions, dateKey);
    return this.data.dailyMissions;
  }

  forceDailyMissionsDate(dateKey = getJstDateKey()) {
    this.data.dailyMissions = normalizeDailyMissionsState(null, dateKey);
    return this.save();
  }

  completeDailyMissionsForDebug() {
    this.ensureDailyMissionsCurrent();
    this.data.dailyMissions.missions = this.data.dailyMissions.missions.map((mission) => ({
      ...mission,
      progress: mission.target,
      completed: true,
    }));
    return this.save();
  }

  recordDailyProgress(event, amount = 1) {
    if (!event || amount <= 0) {
      return this.getData();
    }

    this.ensureDailyMissionsCurrent();
    let changed = false;
    this.data.dailyMissions.missions = this.data.dailyMissions.missions.map((mission) => {
      const template = getDailyMissionTemplate(mission.id);

      if (!template || template.event !== event || mission.claimed) {
        return mission;
      }

      const nextProgress = Math.min(template.target, Math.max(0, Math.floor((mission.progress ?? 0) + amount)));
      const nextCompleted = nextProgress >= template.target;

      if (nextProgress === mission.progress && nextCompleted === mission.completed) {
        return mission;
      }

      changed = true;
      return {
        ...mission,
        target: template.target,
        progress: nextProgress,
        completed: nextCompleted,
      };
    });

    return changed ? this.save() : this.getData();
  }

  claimDailyMission(missionId) {
    this.ensureDailyMissionsCurrent();
    const mission = this.data.dailyMissions.missions.find((entry) => entry.id === missionId);
    const template = getDailyMissionTemplate(missionId);

    if (!mission || !template || mission.claimed || !mission.completed) {
      return false;
    }

    mission.claimed = true;
    this.data.dailyMissionClaims = {
      ...(this.data.dailyMissionClaims ?? {}),
      [`${this.data.dailyMissions.dateKey}:${missionId}`]: true,
    };
    this.data.ownedDna = Math.max(0, this.toNumber(this.data.ownedDna));
    this.data.researchPt = Math.max(0, this.toNumber(this.data.researchPt));
    this.data.researchPt += Math.max(0, Math.floor(template.reward?.researchPt ?? 0));

    this.save();
    return {
      missionId,
      reward: template.reward,
      rewardText: formatDailyReward(template.reward),
    };
  }

  addResearchPt(amount = 0) {
    const reward = Math.max(0, Math.floor(amount));

    if (reward <= 0) {
      return this.getData();
    }

    this.data.researchPt = Math.max(0, this.toNumber(this.data.researchPt));
    this.data.researchPt += reward;
    return this.save();
  }

  getCompanionState() {
    this.data.companion = normalizeCompanionState(this.data.companion);
    return cloneCompanionState(this.data.companion);
  }

  grantCompanionEgg(source = 'run') {
    this.data.companion = normalizeCompanionState(this.data.companion);
    const companion = this.data.companion;

    if (companion.eggPending || companion.eggIncubating) {
      return { success: false, reason: 'already_has_egg', data: this.getData() };
    }

    companion.eggPending = true;
    companion.lastEggSource = source;
    this.data.companion = companion;
    return { success: true, data: this.save() };
  }

  startCompanionEggIncubation({ instant = false } = {}) {
    this.data.companion = normalizeCompanionState(this.data.companion);
    const companion = this.data.companion;

    if (!companion.eggPending || companion.eggIncubating) {
      return { success: false, reason: 'no_pending_egg', data: this.getData() };
    }

    const dnaCost = COMPANION_HATCH_CONFIG.dnaCost;
    const researchPtCost = COMPANION_HATCH_CONFIG.researchPtCost;
    if ((this.data.ownedDna ?? 0) < dnaCost || (this.data.researchPt ?? 0) < researchPtCost) {
      return { success: false, reason: 'insufficient', data: this.getData() };
    }

    const now = Date.now();
    this.data.ownedDna = Math.max(0, this.toNumber(this.data.ownedDna) - dnaCost);
    this.data.researchPt = Math.max(0, this.toNumber(this.data.researchPt) - researchPtCost);
    companion.eggPending = false;
    companion.eggIncubating = true;
    companion.hatchStartedAt = new Date(now).toISOString();
    companion.hatchCompleteAt = new Date(now + (instant ? 0 : COMPANION_HATCH_CONFIG.durationMs)).toISOString();
    this.data.companion = companion;
    return { success: true, data: this.save() };
  }

  completeCompanionEggIncubation({ force = false } = {}) {
    this.data.companion = normalizeCompanionState(this.data.companion);
    const companion = this.data.companion;

    if (!companion.eggIncubating) {
      return { success: false, reason: 'not_incubating', data: this.getData() };
    }

    const completeAt = Date.parse(companion.hatchCompleteAt ?? '');
    if (!force && Number.isFinite(completeAt) && Date.now() < completeAt) {
      return { success: false, reason: 'not_ready', data: this.getData() };
    }

    const hatched = pickRandomUnownedCompanion(companion);
    companion.eggIncubating = false;
    companion.hatchStartedAt = null;
    companion.hatchCompleteAt = null;

    if (!hatched) {
      companion.lastHatchedId = null;
      this.data.ownedDna = Math.max(0, this.toNumber(this.data.ownedDna) + 120);
      this.data.companion = companion;
      return { success: true, duplicateReward: { dna: 120 }, data: this.save() };
    }

    companion.ownedIds = [...new Set([...(companion.ownedIds ?? []), hatched.id])];
    companion.levels = {
      ...(companion.levels ?? {}),
      [hatched.id]: companion.levels?.[hatched.id] ?? 1,
    };
    companion.selectedId = companion.selectedId ?? hatched.id;
    companion.lastHatchedId = hatched.id;
    this.data.companion = companion;

    return { success: true, companion: hatched, data: this.save() };
  }

  setSelectedCompanion(companionId = null) {
    this.data.companion = normalizeCompanionState(this.data.companion);
    const companion = this.data.companion;

    if (companionId === null) {
      companion.selectedId = null;
      this.data.companion = companion;
      return { success: true, data: this.save() };
    }

    if (!companion.ownedIds.includes(companionId) || !getCompanionById(companionId)) {
      return { success: false, reason: 'not_owned', data: this.getData() };
    }

    companion.selectedId = companionId;
    this.data.companion = companion;
    return { success: true, data: this.save() };
  }

  upgradeCompanion(companionId) {
    this.data.companion = normalizeCompanionState(this.data.companion);
    const companion = this.data.companion;
    const config = getCompanionById(companionId);

    if (!config || !companion.ownedIds.includes(companionId)) {
      return { success: false, reason: 'not_owned', data: this.getData() };
    }

    const level = Math.max(1, companion.levels?.[companionId] ?? 1);
    const cost = getCompanionUpgradeCost(companionId, level);
    if (!cost) {
      return { success: false, reason: 'max', data: this.getData() };
    }

    if ((this.data.ownedDna ?? 0) < cost) {
      return { success: false, reason: 'insufficient', data: this.getData() };
    }

    this.data.ownedDna = Math.max(0, this.toNumber(this.data.ownedDna) - cost);
    companion.levels = {
      ...(companion.levels ?? {}),
      [companionId]: Math.min(config.maxLevel, level + 1),
    };
    this.data.companion = companion;
    return { success: true, data: this.save() };
  }

  debugGrantCompanion(companionId) {
    const config = getCompanionById(companionId);
    if (!config) {
      return { success: false, data: this.getData() };
    }

    this.data.companion = normalizeCompanionState(this.data.companion);
    const companion = this.data.companion;
    companion.ownedIds = [...new Set([...(companion.ownedIds ?? []), config.id])];
    companion.levels = {
      ...(companion.levels ?? {}),
      [config.id]: companion.levels?.[config.id] ?? 1,
    };
    companion.selectedId = companion.selectedId ?? config.id;
    this.data.companion = companion;
    return { success: true, data: this.save() };
  }

  setEquippedTitle(titleId) {
    this.data.ownedTitles = this.normalizeOwnedEntries(this.data.ownedTitles);
    const title = getTitleById(titleId);

    if (!title || !this.data.ownedTitles[title.id]?.owned) {
      return { success: false, data: this.getData() };
    }

    this.data.equippedTitleId = title.id;
    const linkedFrame = getTitleFrameForTitle(title);
    this.data.ownedTitleFrames = this.normalizeOwnedEntries(this.data.ownedTitleFrames);

    if (linkedFrame && this.data.ownedTitleFrames[linkedFrame.id]?.owned) {
      this.data.equippedTitleFrameId = linkedFrame.id;
    }

    return { success: true, data: this.save() };
  }

  setEquippedTitleFrame(frameId) {
    this.data.ownedTitleFrames = this.normalizeOwnedEntries(this.data.ownedTitleFrames);
    const frame = getTitleFrameById(frameId);

    if (!frame || !this.data.ownedTitleFrames[frame.id]?.owned) {
      return { success: false, data: this.getData() };
    }

    this.data.equippedTitleFrameId = frame.id;
    return { success: true, data: this.save() };
  }

  convertDnaToResearchPt(rateId) {
    const rate = ANALYSIS_CONVERSION_RATES.find((entry) => entry.id === rateId);

    if (!rate || this.toNumber(this.data.ownedDna) < rate.dnaCost) {
      return false;
    }

    this.data.ownedDna = Math.max(0, this.toNumber(this.data.ownedDna) - rate.dnaCost);
    this.data.researchPt = Math.max(0, this.toNumber(this.data.researchPt)) + rate.researchPtGain;
    this.save();
    return true;
  }

  getResearchLevel(researchId) {
    return this.data.researchLevels?.[researchId] ?? 0;
  }

  buyResearch(researchId) {
    const item = getResearchItem(researchId);
    const level = this.getResearchLevel(researchId);
    const costDetail = getResearchCostDetail(item, level);
    const purchasableCategory = item?.category === RESEARCH_CATEGORY_IDS.bodyEnhancement
      || item?.category === RESEARCH_CATEGORY_IDS.adaptationAbility
      || (item?.category === RESEARCH_CATEGORY_IDS.unknownDomain && item?.unlockDinoId);

    if (!item || !purchasableCategory || !costDetail) {
      return false;
    }

    if (this.data.ownedDna < costDetail.dna || (this.data.researchPt ?? 0) < costDetail.researchPt) {
      return false;
    }

    this.data.ownedDna -= costDetail.dna;
    this.data.researchPt = Math.max(0, (this.data.researchPt ?? 0) - costDetail.researchPt);
    this.data.researchLevels[researchId] = level + 1;
    if (item.unlockDinoId) {
      this.unlockDinoInMemory(item.unlockDinoId, 'research');
    }
    this.save();
    return true;
  }

  unlockDinoInMemory(dinoId, source = 'unknown') {
    if (!dinoId) {
      return;
    }

    this.data.unlockedDinos = this.normalizeUnlockedDinos(this.data.unlockedDinos);
    this.data.unlockedDinos[dinoId] = {
      unlocked: true,
      source,
      unlockedAt: this.data.unlockedDinos[dinoId]?.unlockedAt ?? new Date().toISOString(),
    };
  }

  unlockDino(dinoId, source = 'manual') {
    this.unlockDinoInMemory(dinoId, source);
    return this.save();
  }

  isDinoUnlocked(dinoId) {
    if (!dinoId || ['velociraptor', 'triceratops', 'tyrannosaurus'].includes(dinoId)) {
      return true;
    }

    const normalized = this.normalizeUnlockedDinos(this.data.unlockedDinos);
    return Boolean(normalized[dinoId]?.unlocked);
  }

  recordDiscoveredEvolution(evolution, fallbackDinoId = this.data.lastSelectedDino) {
    const discovery = createEvolutionDiscovery(evolution, fallbackDinoId);

    if (!discovery) {
      return { isNew: false, discovery: null };
    }

    this.data.discoveredEvolutions = normalizeDiscoveredEvolutions(this.data.discoveredEvolutions);

    if (this.data.discoveredEvolutions[discovery.id]?.discovered) {
      return { isNew: false, discovery: this.data.discoveredEvolutions[discovery.id] };
    }

    this.data.discoveredEvolutions[discovery.id] = discovery;
    this.save();
    return { isNew: true, discovery };
  }

  applyToGameState(gameState) {
    gameState.selectedStage = this.data.lastSelectedStage;
    gameState.selectedDifficulty = this.data.lastSelectedDifficulty;
    gameState.selectedDino = this.data.lastSelectedDino;
    gameState.selectedMode = this.data.lastSelectedMode;
    gameState.researchLevels = { ...(this.data.researchLevels ?? {}) };
    gameState.companion = cloneCompanionState(this.data.companion);
    gameState.selectedCompanionId = gameState.companion.selectedId ?? null;
  }

  saveSelections(gameState) {
    this.data.lastSelectedStage = gameState.selectedStage ?? DEFAULT_SAVE.lastSelectedStage;
    this.data.lastSelectedDifficulty = gameState.selectedDifficulty ?? DEFAULT_SAVE.lastSelectedDifficulty;
    this.data.lastSelectedDino = gameState.selectedDino ?? DEFAULT_SAVE.lastSelectedDino;
    this.data.lastSelectedMode = gameState.selectedMode ?? DEFAULT_SAVE.lastSelectedMode;

    return this.save();
  }

  recordRun(gameState) {
    this.saveSelections(gameState);

    const previousBestScore = this.data.bestScore;
    const previousBestSurvivalTime = this.data.bestSurvivalTime;
    const score = Math.max(0, Math.floor(gameState.score));
    const survivalTime = Math.max(0, gameState.elapsedTime);
    const defeated = Math.max(0, Math.floor(gameState.defeatedCount));
    const expGained = Math.max(0, Math.floor(gameState.totalExpGained));
    const dnaEarned = this.calculateRunDna(gameState);
    const researchPtEarned = 0;
    const stageResult = this.recordStageProgress(gameState, score, survivalTime);
    const firstClearReward = this.grantFirstClearReward(stageResult);
    const endlessReward = this.grantEndlessRewards(gameState, stageResult);
    const zeroReward = this.grantZeroRewards(gameState, stageResult);

    this.data.totalRuns += 1;
    this.data.totalDefeated += defeated;
    this.data.totalExpGained += expGained;
    this.data.ownedDna += dnaEarned;
    this.data.researchPt = Math.max(0, this.toNumber(this.data.researchPt));
    this.data.totalDnaEarned += dnaEarned;
    this.data.lastRunDnaEarned = dnaEarned;
    this.recordDailyProgress('survivedSeconds', Math.floor(survivalTime));
    const evolutionDiscovery = this.recordDiscoveredEvolution(gameState.selectedEvolution, gameState.selectedDino);
    this.data.bestScore = Math.max(this.data.bestScore, score);
    this.data.bestSurvivalTime = Math.max(this.data.bestSurvivalTime, survivalTime);
    this.save();

    return {
      isNewBestScore: score > previousBestScore,
      isNewBestSurvivalTime: survivalTime > previousBestSurvivalTime,
      bestScore: this.data.bestScore,
      bestSurvivalTime: this.data.bestSurvivalTime,
      totalRuns: this.data.totalRuns,
      dnaEarned,
      researchPtEarned,
      companionEggReward: gameState.companionEggCollected
        ? { type: 'companionEgg', label: 'お供恐竜の卵' }
        : null,
      evolutionDiscovery,
      newEvolutionRoute: zeroReward.newEvolutionRoute ?? (evolutionDiscovery?.isNew ? evolutionDiscovery.discovery : null),
      stageResult,
      firstClearRewardPending: Boolean(stageResult?.isFirstClear),
      unlockedDifficulties: stageResult?.unlockedDifficulties ?? [],
      firstClearRewards: firstClearReward.firstClearRewards,
      rewardTitles: [...firstClearReward.rewardTitles, ...endlessReward.rewardTitles, ...zeroReward.rewardTitles],
      titleFrames: [...firstClearReward.titleFrames, ...endlessReward.titleFrames, ...zeroReward.titleFrames],
      zeroRewards: zeroReward.zeroRewards,
    };
  }

  grantZeroRewards(gameState, stageResult) {
    if (gameState?.selectedMode !== 'zero' || stageResult?.runType !== 'zeroClear') {
      return { rewardTitles: [], titleFrames: [], zeroRewards: [], newEvolutionRoute: null };
    }

    const unlockedAt = new Date().toISOString();
    const stageId = stageResult?.stageId ?? gameState.selectedStage ?? DEFAULT_SAVE.lastSelectedStage;
    const routeId = ZERO_ROUTE_REWARD_BY_STAGE[stageId] ?? null;
    const routeBranch = routeId ? getEvolutionBranchById(routeId) : null;
    const dinoId = routeBranch?.dinoId ?? null;
    this.data.unlockedZeroRoutes = this.normalizeZeroRoutes(this.data.unlockedZeroRoutes);
    this.data.ownedTitles = this.normalizeOwnedEntries(this.data.ownedTitles);
    this.data.ownedTitleFrames = this.normalizeOwnedEntries(this.data.ownedTitleFrames);
    this.data.discoveredEvolutions = normalizeDiscoveredEvolutions(this.data.discoveredEvolutions);

    const newEvolutionRoute = !routeId || !routeBranch || this.data.unlockedZeroRoutes[routeId]?.unlocked
      ? null
      : {
          id: routeId,
          dinoId,
          routeName: routeBranch.evolutionName ?? 'オメガレクス',
          source: `${stageId}_zero_clear`,
          unlockedAt,
        };

    if (newEvolutionRoute) {
      this.data.unlockedZeroRoutes[routeId] = {
        unlocked: true,
        unlockedAt,
        source: newEvolutionRoute.source,
      };
      this.data.discoveredEvolutions[routeId] = {
        discovered: true,
        id: routeId,
        dinoId,
        tag: 'zero',
        evolutionName: routeBranch?.evolutionName ?? 'オメガレクス',
        mutationName: routeBranch?.mutationName ?? 'ZERO終端変異',
        discoveredAt: unlockedAt,
      };
    }

    const rewardTitles = [];
    const titleFrames = [];
    const zeroRewards = [];

    getZeroTitleRewardsForRun(gameState).forEach((title) => {
      const titleFrame = getTitleFrameForTitle(title);
      const source = `${stageId}_zero_clear`;

      if (!this.data.ownedTitles[title.id]?.owned) {
        this.data.ownedTitles[title.id] = {
          owned: true,
          unlockedAt,
          source,
        };
        rewardTitles.push(title);
        zeroRewards.push({ type: 'title', titleId: title.id, frameId: titleFrame?.id ?? null });
      }

      if (titleFrame && !this.data.ownedTitleFrames[titleFrame.id]?.owned) {
        this.data.ownedTitleFrames[titleFrame.id] = {
          owned: true,
          unlockedAt,
          source,
        };
        titleFrames.push(titleFrame);
        zeroRewards.push({ type: 'titleFrame', frameId: titleFrame.id });
      }

      if (!this.data.equippedTitleId) {
        this.data.equippedTitleId = title.id;
      }

      if (!this.data.equippedTitleFrameId && titleFrame) {
        this.data.equippedTitleFrameId = titleFrame.id;
      }
    });

    if (newEvolutionRoute) {
      zeroRewards.push({ type: 'zeroRoute', routeId });
    }

    return { rewardTitles, titleFrames, zeroRewards, newEvolutionRoute };
  }

  grantEndlessRewards(gameState, stageResult) {
    const titles = getEndlessTitleRewardsForRun(gameState);

    if (titles.length === 0) {
      return { rewardTitles: [], titleFrames: [] };
    }

    const unlockedAt = new Date().toISOString();
    const stageId = stageResult?.stageId ?? gameState.selectedStage ?? DEFAULT_SAVE.lastSelectedStage;
    this.data.ownedTitles = this.normalizeOwnedEntries(this.data.ownedTitles);
    this.data.ownedTitleFrames = this.normalizeOwnedEntries(this.data.ownedTitleFrames);

    const rewardTitles = [];
    const titleFrames = [];

    titles.forEach((title) => {
      const titleFrame = getTitleFrameForTitle(title);
      const source = `${stageId}_endless_record`;

      if (!this.data.ownedTitles[title.id]?.owned) {
        this.data.ownedTitles[title.id] = {
          owned: true,
          unlockedAt,
          source,
        };
        rewardTitles.push(title);
      }

      if (titleFrame && !this.data.ownedTitleFrames[titleFrame.id]?.owned) {
        this.data.ownedTitleFrames[titleFrame.id] = {
          owned: true,
          unlockedAt,
          source,
        };
        titleFrames.push(titleFrame);
      }

      if (!this.data.equippedTitleId) {
        this.data.equippedTitleId = title.id;
      }

      if (!this.data.equippedTitleFrameId && titleFrame) {
        this.data.equippedTitleFrameId = titleFrame.id;
      }
    });

    return { rewardTitles, titleFrames };
  }

  grantFirstClearReward(stageResult) {
    if (!stageResult?.isFirstClear || !['normal', 'hard', 'expert'].includes(stageResult.difficultyId)) {
      return { firstClearRewards: [], rewardTitles: [], titleFrames: [] };
    }

    const title = getTitleRewardForStageClear(stageResult.stageId, stageResult.difficultyId);

    if (!title) {
      return { firstClearRewards: [], rewardTitles: [], titleFrames: [] };
    }

    const unlockedAt = new Date().toISOString();
    const source = `${stageResult.stageId}_${stageResult.difficultyId}_first_clear`;
    const titleFrame = getTitleFrameForTitle(title);
    this.data.ownedTitles = this.normalizeOwnedEntries(this.data.ownedTitles);
    this.data.ownedTitleFrames = this.normalizeOwnedEntries(this.data.ownedTitleFrames);

    if (!this.data.ownedTitles[title.id]?.owned) {
      this.data.ownedTitles[title.id] = {
        owned: true,
        unlockedAt,
        source,
      };
    }

    if (titleFrame && !this.data.ownedTitleFrames[titleFrame.id]?.owned) {
      this.data.ownedTitleFrames[titleFrame.id] = {
        owned: true,
        unlockedAt,
        source,
      };
    }

    if (!this.data.equippedTitleId) {
      this.data.equippedTitleId = title.id;
    }

    if (!this.data.equippedTitleFrameId && titleFrame) {
      this.data.equippedTitleFrameId = titleFrame.id;
    }

    return {
      firstClearRewards: [{
        type: 'title',
        titleId: title.id,
        frameId: titleFrame?.id ?? null,
        stageId: stageResult.stageId,
        difficultyId: stageResult.difficultyId,
      }],
      rewardTitles: [title],
      titleFrames: titleFrame ? [titleFrame] : [],
    };
  }

  recordStageProgress(gameState, score, survivalTime) {
    this.data.stageProgress = this.normalizeStageProgress(this.data.stageProgress);
    const stageId = STAGE_IDS.includes(gameState.selectedStage) ? gameState.selectedStage : DEFAULT_SAVE.lastSelectedStage;
    const difficultyId = this.getRunProgressKey(gameState);
    const stage = this.data.stageProgress[stageId];
    const entry = stage[difficultyId];
    const wasCleared = Boolean(entry.cleared);
    const runType = gameState.runResult?.type ?? 'gameover';
    const shouldClear = this.shouldMarkRunCleared(gameState, difficultyId, runType);

    entry.bestScore = Math.max(this.toNumber(entry.bestScore), score);
    entry.bestTime = Math.max(this.toNumber(entry.bestTime), survivalTime);
    entry.lastPlayedAt = new Date().toISOString();

    if (shouldClear) {
      entry.cleared = true;
      entry.firstClearedAt = entry.firstClearedAt ?? entry.lastPlayedAt;
      entry.bestClearTime = entry.bestClearTime
        ? Math.min(this.toNumber(entry.bestClearTime), survivalTime)
        : survivalTime;
    }

    const isFirstClear = shouldClear && !wasCleared;
    const unlockedDifficulties = isFirstClear ? (NEXT_DIFFICULTY_UNLOCKS[difficultyId] ?? []) : [];

    return {
      stageId,
      difficultyId,
      cleared: Boolean(entry.cleared),
      isFirstClear,
      unlockedDifficulties,
      runType,
    };
  }

  getRunProgressKey(gameState) {
    if (gameState.selectedMode === 'endless') {
      return 'endless';
    }

    if (gameState.selectedMode === 'zero') {
      return 'zero';
    }

    const difficulty = gameState.selectedDifficulty ?? DEFAULT_SAVE.lastSelectedDifficulty;
    return ['normal', 'hard', 'expert'].includes(difficulty) ? difficulty : 'normal';
  }

  shouldMarkRunCleared(gameState, difficultyId, runType) {
    if (difficultyId === 'endless') {
      return false;
    }

    if (difficultyId === 'zero') {
      return runType === 'zeroClear';
    }

    return runType === 'clear';
  }

  calculateRunDna(gameState) {
    const base = Math.floor((gameState.totalExpGained ?? 0) * 0.8)
      + Math.floor((gameState.defeatedCount ?? 0) * 0.25)
      + (gameState.defeatedBosses ?? 0) * 18
      + Math.max(0, Math.floor(gameState.bonusDna ?? 0));
    const multiplier = getBodyResearchBonuses(this.data.researchLevels).dnaMultiplier;

    return Math.max(1, Math.floor(base * multiplier));
  }

  normalize(value) {
    const normalized = {
      ...DEFAULT_SAVE,
      ...value,
      save_version: SAVE_VERSION,
      bestSurvivalTime: this.toNumber(value?.bestSurvivalTime),
      bestScore: this.toNumber(value?.bestScore),
      totalRuns: this.toNumber(value?.totalRuns),
      totalDefeated: this.toNumber(value?.totalDefeated),
      totalExpGained: this.toNumber(value?.totalExpGained),
      researchPt: Number.isFinite(value?.researchPt)
        ? this.toNumber(value.researchPt)
        : Math.floor(this.toNumber(value?.totalExpGained) * 0.12),
      lastSelectedMode: value?.lastSelectedMode ?? DEFAULT_SAVE.lastSelectedMode,
      ownedDna: this.toNumber(value?.ownedDna),
      totalDnaEarned: this.toNumber(value?.totalDnaEarned),
      lastRunDnaEarned: this.toNumber(value?.lastRunDnaEarned),
      researchLevels: {
        ...RESEARCH_LEVEL_DEFAULTS,
        ...(value?.researchLevels ?? {}),
      },
      discoveredEvolutions: normalizeDiscoveredEvolutions(value?.discoveredEvolutions),
      unlockedZeroRoutes: this.normalizeZeroRoutes(value?.unlockedZeroRoutes),
      unlockedDinos: this.normalizeUnlockedDinos(value?.unlockedDinos),
      stageProgress: this.normalizeStageProgress(value?.stageProgress),
      ownedTitles: this.normalizeOwnedEntries(value?.ownedTitles),
      ownedTitleFrames: this.normalizeOwnedEntries(value?.ownedTitleFrames),
      equippedTitleId: typeof value?.equippedTitleId === 'string' ? value.equippedTitleId : null,
      equippedTitleFrameId: typeof value?.equippedTitleFrameId === 'string' ? value.equippedTitleFrameId : null,
      currentHomeDino: typeof value?.currentHomeDino === 'string'
        ? value.currentHomeDino
        : DEFAULT_SAVE.currentHomeDino,
      currentHomeEvolutionId: typeof value?.currentHomeEvolutionId === 'string'
        ? value.currentHomeEvolutionId
        : DEFAULT_SAVE.currentHomeEvolutionId,
      dailyMissions: normalizeDailyMissionsState(value?.dailyMissions),
      dailyMissionClaims: typeof value?.dailyMissionClaims === 'object' && value.dailyMissionClaims !== null
        ? { ...value.dailyMissionClaims }
        : {},
      companion: normalizeCompanionState(value?.companion),
      tutorialFlags: this.normalizeTutorialFlags(value?.tutorialFlags),
      audioSettings: {
        ...DEFAULT_SAVE.audioSettings,
        ...(value?.audioSettings ?? {}),
        masterVolume: this.toClampedVolume(value?.audioSettings?.masterVolume ?? DEFAULT_SAVE.audioSettings.masterVolume),
        bgmVolume: this.toClampedVolume(value?.audioSettings?.bgmVolume ?? DEFAULT_SAVE.audioSettings.bgmVolume),
        seVolume: this.toClampedVolume(value?.audioSettings?.seVolume ?? DEFAULT_SAVE.audioSettings.seVolume),
        uiVolume: this.toClampedVolume(value?.audioSettings?.uiVolume ?? DEFAULT_SAVE.audioSettings.uiVolume),
        muted: Boolean(value?.audioSettings?.muted ?? DEFAULT_SAVE.audioSettings.muted),
      },
      gameplaySettings: this.normalizeGameplaySettings(value?.gameplaySettings),
    };

    if ((normalized.researchLevels?.spinosaurus_unlock ?? 0) > 0) {
      normalized.unlockedDinos.spinosaurus = {
        unlocked: true,
        source: normalized.unlockedDinos.spinosaurus?.source ?? 'research',
        unlockedAt: normalized.unlockedDinos.spinosaurus?.unlockedAt ?? null,
      };
    }

    return normalized;
  }

  cloneGameplaySettings(settings) {
    const normalized = this.normalizeGameplaySettings(settings);

    return {
      effects: { ...normalized.effects },
      controls: { ...normalized.controls },
      display: { ...normalized.display },
    };
  }

  cloneTutorialFlags(flags) {
    return { ...this.normalizeTutorialFlags(flags) };
  }

  normalizeTutorialFlags(flags = {}) {
    const source = typeof flags === 'object' && flags !== null ? flags : {};
    return Object.keys(DEFAULT_SAVE.tutorialFlags).reduce((result, key) => {
      result[key] = Boolean(source[key]);
      return result;
    }, {});
  }

  normalizeGameplaySettings(settings = {}) {
    const defaults = DEFAULT_SAVE.gameplaySettings;
    const hudSize = ['small', 'standard', 'large'].includes(settings?.display?.hudSize)
      ? settings.display.hudSize
      : defaults.display.hudSize;
    const visibilityAssist = ['standard', 'bright', 'high'].includes(settings?.display?.visibilityAssist)
      ? settings.display.visibilityAssist
      : settings?.display?.highVisibility === true
        ? 'bright'
        : defaults.display.visibilityAssist;

    return {
      effects: {
        screenShake: Boolean(settings?.effects?.screenShake ?? defaults.effects.screenShake),
        flash: Boolean(settings?.effects?.flash ?? defaults.effects.flash),
        damageNumbers: Boolean(settings?.effects?.damageNumbers ?? defaults.effects.damageNumbers),
        simpleEffects: Boolean(settings?.effects?.simpleEffects ?? defaults.effects.simpleEffects),
      },
      controls: {
        virtualStick: Boolean(settings?.controls?.virtualStick ?? defaults.controls.virtualStick),
        touchAssist: Boolean(settings?.controls?.touchAssist ?? defaults.controls.touchAssist),
        controlGuide: Boolean(settings?.controls?.controlGuide ?? defaults.controls.controlGuide),
      },
      display: {
        highVisibility: Boolean(settings?.display?.highVisibility ?? defaults.display.highVisibility),
        visibilityAssist,
        backgroundDim: Boolean(settings?.display?.backgroundDim ?? defaults.display.backgroundDim),
        hudSize,
      },
    };
  }

  normalizeUnlockedDinos(value) {
    if (Array.isArray(value)) {
      return value.reduce((result, id) => {
        if (typeof id === 'string') {
          result[id] = { unlocked: true, source: 'legacy', unlockedAt: null };
        }
        return result;
      }, {});
    }

    if (!value || typeof value !== 'object') {
      return {};
    }

    return Object.entries(value).reduce((result, [id, entry]) => {
      if (entry === true) {
        result[id] = { unlocked: true, source: 'legacy', unlockedAt: null };
      } else if (entry && typeof entry === 'object' && entry.unlocked) {
        result[id] = {
          unlocked: true,
          source: typeof entry.source === 'string' ? entry.source : 'unknown',
          unlockedAt: typeof entry.unlockedAt === 'string' ? entry.unlockedAt : null,
        };
      }
      return result;
    }, {});
  }

  normalizeStageProgress(value = {}) {
    const source = typeof value === 'object' && value !== null ? value : {};

    return STAGE_IDS.reduce((progress, stageId) => {
      const stageSource = typeof source[stageId] === 'object' && source[stageId] !== null ? source[stageId] : {};
      progress[stageId] = STAGE_PROGRESS_KEYS.reduce((stageProgress, difficultyId) => {
        const entry = typeof stageSource[difficultyId] === 'object' && stageSource[difficultyId] !== null
          ? stageSource[difficultyId]
          : {};
        stageProgress[difficultyId] = {
          cleared: difficultyId === 'endless' ? false : Boolean(entry.cleared),
          firstClearedAt: typeof entry.firstClearedAt === 'string' ? entry.firstClearedAt : null,
          bestTime: this.toNumber(entry.bestTime),
          bestClearTime: this.toNumber(entry.bestClearTime),
          bestScore: this.toNumber(entry.bestScore),
          lastPlayedAt: typeof entry.lastPlayedAt === 'string' ? entry.lastPlayedAt : null,
        };
        return stageProgress;
      }, {});
      return progress;
    }, {});
  }

  cloneDailyMissions(value = this.data.dailyMissions) {
    const normalized = normalizeDailyMissionsState(value, value?.dateKey ?? getJstDateKey());

    return {
      dateKey: normalized.dateKey,
      missions: normalized.missions.map((mission) => ({ ...mission })),
    };
  }

  cloneStageProgress(stageProgress = {}) {
    const normalized = this.normalizeStageProgress(stageProgress);

    return Object.fromEntries(
      Object.entries(normalized).map(([stageId, progress]) => [
        stageId,
        Object.fromEntries(
          Object.entries(progress).map(([difficultyId, entry]) => [difficultyId, { ...entry }]),
        ),
      ]),
    );
  }

  normalizeOwnedEntries(value = {}) {
    const source = typeof value === 'object' && value !== null ? value : {};

    return Object.entries(source).reduce((entries, [id, entry]) => {
      if (!id) {
        return entries;
      }

      if (entry === true) {
        entries[id] = { owned: true, unlockedAt: null, source: null };
        return entries;
      }

      if (typeof entry === 'object' && entry !== null && entry.owned !== false) {
        entries[id] = {
          owned: true,
          unlockedAt: typeof entry.unlockedAt === 'string' ? entry.unlockedAt : null,
          source: typeof entry.source === 'string' ? entry.source : null,
        };
      }

      return entries;
    }, {});
  }

  normalizeZeroRoutes(value = {}) {
    const source = typeof value === 'object' && value !== null ? value : {};

    return Object.entries(source).reduce((routes, [routeId, entry]) => {
      if (!routeId) {
        return routes;
      }

      if (entry === true) {
        routes[routeId] = { unlocked: true, unlockedAt: null, source: null };
        return routes;
      }

      if (typeof entry === 'object' && entry !== null) {
        routes[routeId] = {
          unlocked: Boolean(entry.unlocked ?? entry.discovered ?? true),
          unlockedAt: typeof entry.unlockedAt === 'string' ? entry.unlockedAt : null,
          source: typeof entry.source === 'string' ? entry.source : null,
        };
      }

      return routes;
    }, {});
  }

  cloneOwnedEntries(entries = {}) {
    return Object.fromEntries(
      Object.entries(this.normalizeOwnedEntries(entries)).map(([id, entry]) => [id, { ...entry }]),
    );
  }

  toNumber(value) {
    return Number.isFinite(value) ? value : 0;
  }

  toClampedVolume(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return 0;
    }

    return Math.max(0, Math.min(1, number));
  }
}
