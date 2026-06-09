import {
  EVOLUTION_DETECTION_THRESHOLD,
  getEvolutionCandidate,
  getSkillById,
} from '../data/skills.js';
import { getEvolutionBranch, getEvolutionBranchId } from '../data/evolution_data.js';
import {
  ADAPTATION_SYNERGY_TAGS,
  getAdaptationSynergyTier,
} from '../data/adaptation_synergy.js';

const BASE_EXP_TO_LEVEL = 6;
const MAX_OWNED_SKILLS = 3;
const ZERO_EVOLUTION_REQUIREMENTS = {
  velociraptor_zero: {
    dinoId: 'velociraptor',
    playerLevel: 8,
    adaptationLevels: {
      speed: 3,
      hunting: 3,
      attack: 3,
    },
  },
  tyrannosaurus_zero: {
    dinoId: 'tyrannosaurus',
    playerLevel: 8,
    adaptationLevels: {
      speed: 3,
      hunting: 3,
      attack: 3,
    },
  },
  triceratops_zero: {
    dinoId: 'triceratops',
    playerLevel: 8,
    adaptationLevels: {
      speed: 3,
      hunting: 3,
      attack: 3,
    },
  },
  spinosaurus_zero: {
    dinoId: 'spinosaurus',
    playerLevel: 8,
    adaptationLevels: {
      speed: 3,
      hunting: 3,
      attack: 3,
    },
  },
};

export class GameState {
  constructor() {
    this.elapsedTime = 0;
    this.score = 0;
    this.collectedExp = 0;
    this.totalExpGained = 0;
    this.defeatedCount = 0;
    this.defeatedBosses = 0;
    this.playerLevel = 1;
    this.isPaused = false;
    this.playerMaxHp = 100;
    this.playerHp = this.playerMaxHp;
    this.playerDamageMultiplier = 1;
    this.isGameOver = false;
    this.runResult = {
      type: 'running',
      reason: null,
    };
    this.invincibleTime = 0;
    this.playerStatusEffects = {};
    this.ultimateGauge = 0;
    this.ultimateReady = false;
    this.skills = {};
    this.researchLevels = {};
    this.adaptationProgress = {
      speed: 0,
      hunting: 0,
      attack: 0,
    };
    this.adaptationSynergy = {
      speed: 0,
      hunting: 0,
      attack: 0,
    };
    this.adaptationSynergyQueue = [];
    this.evolutionCandidateDetected = false;
    this.evolutionCandidates = {};
    this.latestEvolutionCandidate = null;
    this.evolutionDetectionQueue = [];
    this.hasEvolved = false;
    this.hasZeroEvolved = false;
    this.selectedEvolution = null;
    this.unlockedZeroRoutes = {};
    this.selectedStage = 'jungle';
    this.selectedDifficulty = 'normal';
    this.selectedDino = 'velociraptor';
    this.selectedMode = 'standard';
  }

  get canEvolve() {
    return this.canNormalEvolve || this.canZeroEvolve;
  }

  get canNormalEvolve() {
    return this.playerLevel >= 5
      && this.evolutionCandidateDetected
      && !this.hasEvolved
      && !this.hasZeroEvolved
      && this.getNormalEvolutionCandidateList().length > 0;
  }

  get canZeroEvolve() {
    return !this.hasZeroEvolved
      && this.getZeroEvolutionCandidateList().length > 0;
  }

  get ownedSkills() {
    return Object.values(this.skills).filter((skill) => skill.usesSkillSlot !== false);
  }

  get ownedSkillCount() {
    return this.ownedSkills.length;
  }

  getSkillLevel(skillId) {
    return this.skills[skillId]?.level ?? 0;
  }

  canAcquireSkill(skillId) {
    const skill = getSkillById(skillId);

    if (!skill) {
      return false;
    }

    const owned = this.skills[skillId];

    if (owned) {
      return owned.level < owned.maxLevel;
    }

    if (skill.usesSkillSlot === false) {
      return true;
    }

    return this.ownedSkillCount < MAX_OWNED_SKILLS;
  }

  acquireSkill(skillId) {
    if (!this.canAcquireSkill(skillId)) {
      return null;
    }

    const skill = getSkillById(skillId);

    if (!skill) {
      return null;
    }

    if (!this.skills[skillId]) {
      this.skills[skillId] = {
        id: skill.id,
        name: skill.name,
        type: skill.type,
        tag: skill.tag ?? null,
        level: 0,
        maxLevel: skill.maxLevel,
        adaptationTags: [...skill.adaptationTags],
        usesSkillSlot: skill.usesSkillSlot !== false,
        countsAsAdaptation: skill.countsAsAdaptation !== false,
        iconKey: skill.iconKey ?? null,
      };
    }

    this.skills[skillId].level += 1;

    if (skill.countsAsAdaptation !== false) {
      skill.adaptationTags.forEach((tag) => {
        this.adaptationProgress[tag] = (this.adaptationProgress[tag] ?? 0) + 1;
      });
      this.detectAdaptationSynergies(skill.adaptationTags);
      this.detectEvolutionCandidates(skill.adaptationTags);
      this.detectZeroEvolutionCandidate();
    }

    return this.skills[skillId];
  }

  detectAdaptationSynergies(tags = ADAPTATION_SYNERGY_TAGS) {
    if (!this.adaptationSynergy) {
      this.adaptationSynergy = {
        speed: 0,
        hunting: 0,
        attack: 0,
      };
    }

    if (!this.adaptationSynergyQueue) {
      this.adaptationSynergyQueue = [];
    }

    tags.forEach((tag) => {
      if (!ADAPTATION_SYNERGY_TAGS.includes(tag)) {
        return;
      }

      const count = this.getUniqueAdaptationSkillCount(tag);
      const nextTier = getAdaptationSynergyTier(count);
      const currentTier = this.adaptationSynergy[tag] ?? 0;

      this.adaptationSynergy[tag] = nextTier;

      if (nextTier <= currentTier) {
        return;
      }

      this.adaptationSynergyQueue.push({
        tag,
        tier: nextTier,
        count,
        triggeredAt: this.elapsedTime,
      });
    });
  }

  getUniqueAdaptationSkillCount(tag) {
    const uniqueIds = new Set();

    Object.values(this.skills ?? {}).forEach((skill) => {
      if (!skill || skill.level <= 0 || skill.countsAsAdaptation === false) {
        return;
      }

      if (!skill.adaptationTags?.includes(tag)) {
        return;
      }

      uniqueIds.add(skill.id);
    });

    return uniqueIds.size;
  }

  syncAdaptationSynergies() {
    this.detectAdaptationSynergies(ADAPTATION_SYNERGY_TAGS);
  }

  consumeAdaptationSynergyDetections() {
    const detections = [...this.adaptationSynergyQueue];
    this.adaptationSynergyQueue = [];

    return detections;
  }

  detectEvolutionCandidates(tags) {
    tags.forEach((tag) => {
      const value = this.adaptationProgress[tag] ?? 0;
      const candidate = getEvolutionCandidate(tag);

      if (!candidate || value < EVOLUTION_DETECTION_THRESHOLD || this.evolutionCandidates[tag]) {
        return;
      }

      this.evolutionCandidateDetected = true;
      this.evolutionCandidates[tag] = {
        ...candidate,
        detectedAt: this.elapsedTime,
        progress: value,
      };
      this.latestEvolutionCandidate = this.evolutionCandidates[tag];
      this.evolutionDetectionQueue.push(this.evolutionCandidates[tag]);
    });
  }

  consumeEvolutionDetections() {
    const detections = [...this.evolutionDetectionQueue];
    this.evolutionDetectionQueue = [];

    return detections;
  }

  getEvolutionCandidateList() {
    const zeroCandidates = this.getZeroEvolutionCandidateList();
    const normalCandidates = this.hasEvolved ? [] : this.getNormalEvolutionCandidateList();

    return [...zeroCandidates, ...normalCandidates].slice(0, 3);
  }

  getNormalEvolutionCandidateList() {
    return Object.values(this.evolutionCandidates)
      .filter((candidate) => candidate.tag !== 'zero')
      .slice(0, 3);
  }

  getZeroEvolutionCandidateList() {
    return Object.values(this.evolutionCandidates)
      .filter((candidate) => candidate.tag === 'zero' && this.isZeroEvolutionCandidateEligible(candidate));
  }

  isZeroEvolutionCandidateEligible(candidate) {
    if (!candidate || candidate.tag !== 'zero' || this.hasZeroEvolved) {
      return false;
    }

    const requirements = ZERO_EVOLUTION_REQUIREMENTS[candidate.id];

    if (!requirements) {
      return false;
    }

    if (this.selectedDino !== requirements.dinoId) {
      return false;
    }

    if (!this.isZeroRouteUnlocked(candidate.id)) {
      return false;
    }

    if (this.playerLevel < requirements.playerLevel) {
      return false;
    }

    return Object.entries(requirements.adaptationLevels).every(([tag, level]) => (
      (this.adaptationProgress[tag] ?? 0) >= level
    ));
  }

  isZeroRouteUnlocked(routeId) {
    const route = this.unlockedZeroRoutes?.[routeId];

    return route === true || route?.unlocked === true;
  }

  setUnlockedZeroRoutes(routes = {}) {
    this.unlockedZeroRoutes = { ...(routes ?? {}) };
    this.detectZeroEvolutionCandidate();
  }

  detectZeroEvolutionCandidate() {
    if (this.hasZeroEvolved || this.evolutionCandidates.zero) {
      return;
    }

    Object.entries(ZERO_EVOLUTION_REQUIREMENTS).some(([routeId, requirements]) => {
      if (this.selectedDino !== requirements.dinoId || !this.isZeroRouteUnlocked(routeId)) {
        return false;
      }

      const branch = getEvolutionBranch(requirements.dinoId, 'zero');

      if (!branch) {
        return false;
      }

      const candidate = {
        id: routeId,
        tag: 'zero',
        type: 'zeroEvolution',
        name: branch.mutationName,
        evolutionName: branch.evolutionName,
        mutationName: branch.mutationName,
        readyText: 'ZERO\u30eb\u30fc\u30c8\u89e3\u6790\u6e08\u307f\u3002\u5168\u9069\u5fdcLv3\u4ee5\u4e0a\u3067\u4e0a\u4f4d\u9032\u5316\u3067\u304d\u307e\u3059\u3002',
        conditionSummary: 'ZERO / \u5168\u9069\u5fdcLv3+ / Lv8+',
        message: 'ZERO\u4e0a\u4f4d\u9032\u5316\u5019\u88dc\u3092\u691c\u51fa',
        color: 0xb94dff,
        detectedAt: this.elapsedTime,
        progress: Math.min(
          this.adaptationProgress.speed ?? 0,
          this.adaptationProgress.hunting ?? 0,
          this.adaptationProgress.attack ?? 0,
        ),
      };

      if (!this.isZeroEvolutionCandidateEligible(candidate)) {
        return false;
      }

      this.evolutionCandidates.zero = candidate;
      this.latestEvolutionCandidate = candidate;
      this.evolutionCandidateDetected = true;
      this.evolutionDetectionQueue.push(candidate);
      return true;
    });
  }

  selectEvolution(candidateTag) {
    const candidate = this.evolutionCandidates[candidateTag];

    if (!candidate) {
      return null;
    }

    const isZeroEvolution = candidate.tag === 'zero';
    const branch = getEvolutionBranch(this.selectedDino, candidate.tag);

    if ((isZeroEvolution && !this.isZeroEvolutionCandidateEligible(candidate))
      || (!isZeroEvolution && !this.canNormalEvolve)) {
      return null;
    }

    this.selectedEvolution = {
      id: candidate.id ?? branch?.id ?? getEvolutionBranchId(this.selectedDino, candidate.tag),
      dinoId: this.selectedDino,
      tag: candidate.tag,
      tier: isZeroEvolution ? 'zero' : 'normal',
      mutationName: branch?.mutationName ?? candidate.name,
      evolutionName: branch?.evolutionName ?? candidate.evolutionName,
      normalAttackEffectKey: branch?.normalAttackEffectKey ?? candidate.normalAttackEffectKey ?? null,
      ultimateId: branch?.ultimateId ?? candidate.ultimateId ?? null,
      selectedAtLevel: this.playerLevel,
      selectedAtTime: this.elapsedTime,
    };
    if (isZeroEvolution) {
      this.hasZeroEvolved = true;
    } else {
      this.hasEvolved = true;
    }

    return this.selectedEvolution;
  }

  get expToNextLevel() {
    const levelIndex = Math.max(0, this.playerLevel - 1);
    const midGameTax = Math.max(0, this.playerLevel - 5) * 2;
    const lateGameTax = Math.max(0, this.playerLevel - 10) * 4;
    const endgameTax = Math.max(0, this.playerLevel - 16) * 6;

    return BASE_EXP_TO_LEVEL + levelIndex * 4 + midGameTax + lateGameTax + endgameTax;
  }

  get expProgress() {
    return this.collectedExp / this.expToNextLevel;
  }

  update(delta) {
    if (this.isPaused || this.isGameOver) {
      return;
    }

    this.elapsedTime += delta;
    this.invincibleTime = Math.max(0, this.invincibleTime - delta);
    this.updatePlayerStatusEffects(delta);
  }

  addExp(amount) {
    if (this.isGameOver) {
      return 0;
    }

    let levelsGained = 0;

    this.collectedExp += amount;
    this.totalExpGained += amount;
    this.score += amount * 100;

    while (this.collectedExp >= this.expToNextLevel) {
      this.collectedExp -= this.expToNextLevel;
      this.playerLevel += 1;
      levelsGained += 1;
    }

    return levelsGained;
  }

  addScore(amount) {
    if (this.isGameOver) {
      return;
    }

    this.score += amount;
  }

  addUltimate(amount) {
    if (this.isGameOver || amount <= 0) {
      return;
    }

    this.ultimateGauge = Math.min(100, this.ultimateGauge + amount);
    this.ultimateReady = this.ultimateGauge >= 100;
  }

  consumeUltimate() {
    if (!this.ultimateReady) {
      return false;
    }

    this.ultimateGauge = 0;
    this.ultimateReady = false;
    return true;
  }

  recordEnemyDefeat(scoreReward) {
    this.defeatedCount += 1;
    this.addScore(scoreReward);
  }

  recordBossDefeat(scoreReward) {
    this.defeatedBosses += 1;
    this.addScore(scoreReward);
    this.addUltimate(30);
  }

  markRunFailed(reason = 'hp0') {
    this.runResult = {
      type: 'gameover',
      reason,
    };
    this.isGameOver = true;
    this.isPaused = false;
  }

  markRunAbandoned() {
    this.runResult = {
      type: 'gameover',
      reason: 'abandoned',
    };
    this.isGameOver = true;
    this.isPaused = false;
  }

  markStageClear(reason = 'boss') {
    this.runResult = {
      type: 'clear',
      reason,
    };
    this.isGameOver = true;
    this.isPaused = false;
  }

  markZeroClear() {
    this.runResult = {
      type: 'zeroClear',
      reason: 'zero',
    };
    this.isGameOver = true;
    this.isPaused = false;
  }

  damagePlayer(amount) {
    if (this.isGameOver || this.invincibleTime > 0) {
      return false;
    }

    this.playerHp = Math.max(0, this.playerHp - amount * this.playerDamageMultiplier);
    this.invincibleTime = 1.05;
    this.addUltimate(12);

    if (this.playerHp === 0) {
      this.markRunFailed('hp0');
    }

    return true;
  }

  healPlayer(amount) {
    if (this.isGameOver || amount <= 0 || this.playerHp >= this.playerMaxHp) {
      return 0;
    }

    const before = this.playerHp;
    this.playerHp = Math.min(this.playerMaxHp, this.playerHp + amount);

    return this.playerHp - before;
  }

  applyPlayerStatus(type, duration = 2.2, power = 1) {
    this.playerStatusEffects[type] = {
      duration: Math.max(this.playerStatusEffects[type]?.duration ?? 0, duration),
      power,
      tickTimer: this.playerStatusEffects[type]?.tickTimer ?? 0,
    };
  }

  updatePlayerStatusEffects(delta) {
    Object.entries(this.playerStatusEffects).forEach(([type, effect]) => {
      effect.duration -= delta;
      effect.tickTimer -= delta;

      if ((type === 'poison' || type === 'bleed') && effect.tickTimer <= 0 && !this.isGameOver) {
        effect.tickTimer = type === 'poison' ? 0.7 : 0.45;
        const damage = type === 'poison' ? 2 * effect.power : 2.5 * effect.power;

        this.playerHp = Math.max(0, this.playerHp - damage);

        if (this.playerHp === 0) {
          this.markRunFailed(type);
        }
      }

      if (effect.duration <= 0) {
        delete this.playerStatusEffects[type];
      }
    });
  }

  getPlayerSlowMultiplier() {
    return this.playerStatusEffects.slow ? 0.72 : 1;
  }

  togglePause() {
    if (this.isGameOver) {
      return;
    }

    this.isPaused = !this.isPaused;
  }
}
