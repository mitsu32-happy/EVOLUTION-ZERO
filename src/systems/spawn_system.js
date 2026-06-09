import { Enemy } from '../entities/enemy.js';
import { ENDLESS_SCALING_CONFIG, ZERO_SCALING_CONFIG, getDifficultyConfig, getStageConfig } from '../data/run_config.js';

function hasDebugFlag(name) {
  if (typeof window === 'undefined') {
    return false;
  }

  return new URLSearchParams(window.location.search).has(name);
}

function getDebugParam(name) {
  if (typeof window === 'undefined') {
    return null;
  }

  return new URLSearchParams(window.location.search).get(name);
}

export class SpawnSystem {
  constructor({ stageBounds, viewWidth, viewHeight, assetLoader = null }) {
    this.stageBounds = stageBounds;
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.assetLoader = assetLoader;
    this.spawnTimer = 0;
    this.spawnInterval = 2.55;
    this.maxEnemies = 32;
  }

  reset() {
    this.spawnTimer = 0;
  }

  update(delta, gameState, camera, player, enemies, onSpawn) {
    const difficulty = getDifficultyConfig(gameState.selectedDifficulty);
    const modeScale = this.getModeScaling(gameState);
    const modeBonus = ['endless', 'zero'].includes(gameState.selectedMode) ? modeScale.maxEnemyBonus : 0;
    const elapsedPressureBonus = this.getElapsedEnemyPressureBonus(gameState);
    const lateCapBonus = this.getLateEnemyCapBonus(gameState);
    const phaseLimits = this.getProgressionPhaseLimits(gameState);
    const maxEnemies = Math.min(
      phaseLimits.enemyCountCap,
      gameState.selectedMode === 'endless'
        ? ENDLESS_SCALING_CONFIG.softEnemyCap
        : gameState.selectedMode === 'zero'
          ? ZERO_SCALING_CONFIG.softEnemyCap
          : this.maxEnemies + difficulty.maxEnemyBonus + modeBonus + lateCapBonus,
      10 + difficulty.maxEnemyBonus + modeBonus + elapsedPressureBonus + lateCapBonus,
    );

    if (enemies.length >= maxEnemies) {
      return;
    }

    this.spawnTimer -= delta;

    if (this.spawnTimer > 0) {
      return;
    }

    const level = this.getEnemyLevel(gameState);
    const levelScale = this.getEnemyLevelScale(level);
    this.spawnTimer = Math.max(
      this.getMinimumSpawnInterval(gameState),
      (this.spawnInterval - gameState.elapsedTime * 0.026) * difficulty.spawnIntervalMultiplier / modeScale.spawnRate,
    );
    onSpawn(new Enemy({
      ...this.getSpawnPoint(camera, player),
      enemyType: this.pickEnemyType(gameState),
      assetLoader: this.assetLoader,
      hpMultiplier: modeScale.hp * (difficulty.enemyHpMultiplier ?? 1) * levelScale.hp,
      damageMultiplier: modeScale.damage * (difficulty.enemyDamageMultiplier ?? 1) * levelScale.damage,
      speedMultiplier: levelScale.speed,
      enemyLevel: level,
      expMultiplier: modeScale.exp,
      scoreMultiplier: modeScale.score,
    }));
  }

  getElapsedEnemyPressureBonus(gameState) {
    const elapsed = gameState.elapsedTime ?? 0;
    const isEndgameMode = ['endless', 'zero'].includes(gameState.selectedMode);
    const limits = this.getProgressionPhaseLimits(gameState);
    let bonus = 0;

    if (isEndgameMode) {
      const zeroBonus = gameState.selectedMode === 'zero'
        ? Math.floor(Math.max(0, elapsed - 120) / 3.5) + Math.floor(Math.max(0, elapsed - 220) / 2.6) + Math.floor(Math.max(0, elapsed - 320) / 2.1)
        : 0;
      const endlessBonus = gameState.selectedMode === 'endless'
        ? Math.floor(Math.max(0, elapsed - 240) / 4.5) + Math.floor(Math.max(0, elapsed - 480) / 2.8) + Math.floor(Math.max(0, elapsed - 720) / 2.2)
        : 0;

      bonus = Math.floor(elapsed / 5.5) + Math.floor(Math.max(0, elapsed - 120) / 4.2) + Math.floor(Math.max(0, elapsed - 240) / 3.1) + zeroBonus + endlessBonus;
      return Math.min(limits.elapsedPressureCap, bonus);
    }

    const difficulty = gameState?.selectedDifficulty ?? 'normal';
    const base = Math.floor(elapsed / 14) + Math.floor(Math.max(0, elapsed - 80) / 10) + Math.floor(Math.max(0, elapsed - 140) / 6);

    if (difficulty === 'expert') {
      bonus = base + Math.floor(Math.max(0, elapsed - 75) / 5) + Math.floor(Math.max(0, elapsed - 135) / 3.4) + Math.floor(Math.max(0, elapsed - 210) / 2.8);
      return Math.min(limits.elapsedPressureCap, bonus);
    }

    if (difficulty === 'hard') {
      bonus = base + Math.floor(Math.max(0, elapsed - 90) / 7) + Math.floor(Math.max(0, elapsed - 155) / 5.2);
      return Math.min(limits.elapsedPressureCap, bonus);
    }

    return Math.min(limits.elapsedPressureCap, base);
  }

  getLateEnemyCapBonus(gameState) {
    const elapsed = gameState?.elapsedTime ?? 0;
    const limits = this.getProgressionPhaseLimits(gameState);
    let bonus = 0;

    if (gameState?.selectedMode === 'zero') {
      bonus = Math.floor(Math.max(0, elapsed - 90) / 4) + Math.floor(Math.max(0, elapsed - 210) / 2.8);
      return Math.min(limits.lateCapBonusCap, bonus);
    }

    if (gameState?.selectedMode === 'endless') {
      bonus = Math.floor(Math.max(0, elapsed - 180) / 5) + Math.floor(Math.max(0, elapsed - 420) / 3.1) + Math.floor(Math.max(0, elapsed - 720) / 2.4);
      return Math.min(limits.lateCapBonusCap, bonus);
    }

    if (gameState?.selectedDifficulty === 'expert') {
      bonus = Math.floor(Math.max(0, elapsed - 95) / 6) + Math.floor(Math.max(0, elapsed - 170) / 4.2);
      return Math.min(limits.lateCapBonusCap, bonus);
    }

    if (gameState?.selectedDifficulty === 'hard') {
      bonus = Math.floor(Math.max(0, elapsed - 115) / 8) + Math.floor(Math.max(0, elapsed - 190) / 6.5);
      return Math.min(limits.lateCapBonusCap, bonus);
    }

    return 0;
  }

  getEnemyLevel(gameState) {
    const elapsed = gameState?.elapsedTime ?? 0;
    const difficulty = gameState?.selectedDifficulty ?? 'normal';

    let level = 1;

    if (elapsed >= 65) level += 1;
    if (elapsed >= 125) level += 1;
    if (elapsed >= 190) level += 1;

    if (difficulty === 'hard') {
      if (elapsed >= 105) level += 1;
      if (elapsed >= 175) level += 1;
      if (elapsed >= 245) level += 1;
    } else if (difficulty === 'expert') {
      if (elapsed >= 85) level += 1;
      if (elapsed >= 135) level += 1;
      if (elapsed >= 190) level += 1;
      if (elapsed >= 250) level += 1;
    }

    if (gameState?.selectedMode === 'zero') {
      level += 2;
      if (elapsed >= 105) level += 1;
      if (elapsed >= 170) level += 1;
      if (elapsed >= 235) level += 1;
      if (elapsed >= 315) level += 2;
    } else if (gameState?.selectedMode === 'endless') {
      if (elapsed >= 180) level += 1;
      if (elapsed >= 300) level += 1;
      if (elapsed >= 450) level += 1;
      if (elapsed >= 600) level += 2;
      if (elapsed >= 780) level += 2;
    }

    return Math.max(1, Math.min(12, this.getProgressionPhaseLimits(gameState).enemyLevelCap, level));
  }

  getEnemyLevelScale(level = 1) {
    const bonusLevel = Math.max(0, level - 1);
    const lateBonus = Math.max(0, level - 5);
    const earlyDamageBase = level <= 3 ? 0.9 : 1;

    return {
      hp: 1 + bonusLevel * 0.13 + lateBonus * 0.055,
      damage: earlyDamageBase + bonusLevel * 0.085 + lateBonus * 0.075,
      speed: 1 + Math.min(0.52, bonusLevel * 0.035 + lateBonus * 0.018),
    };
  }

  getModeScaling(gameState) {
    if (gameState?.selectedMode === 'zero') {
      const elapsed = gameState.elapsedTime ?? 0;
      const limits = this.getProgressionPhaseLimits(gameState);
      const midPressure = Math.min(0.48, Math.max(0, elapsed - 95) / 310);
      const latePressure = Math.min(1.15, Math.max(0, elapsed - 170) / 230);
      const finalPressure = Math.min(0.78, Math.max(0, elapsed - 265) / 170);
      const pressure = Math.min(limits.modePressureCap, midPressure + latePressure + finalPressure);

      return {
        hp: ZERO_SCALING_CONFIG.enemyHp + pressure * 1.12,
        damage: ZERO_SCALING_CONFIG.enemyDamage + pressure * 0.96,
        spawnRate: ZERO_SCALING_CONFIG.spawnRate + pressure * 1.95,
        maxEnemyBonus: ZERO_SCALING_CONFIG.maxEnemyBonus + Math.floor(pressure * 42),
        eliteBonus: ZERO_SCALING_CONFIG.eliteBonus + pressure * 0.22,
        exp: 1.06,
        score: 1.35,
      };
    }

    return this.getEndlessScaling(gameState);
  }

  getEndlessScaling(gameState) {
    if (gameState?.selectedMode !== 'endless') {
      const difficulty = getDifficultyConfig(gameState?.selectedDifficulty);
      const elapsed = (gameState?.elapsedTime ?? 0) + (difficulty.timeAdvance ?? 0);
      const limits = this.getProgressionPhaseLimits(gameState);
      const latePressure = Math.min(0.72, Math.max(0, elapsed - 105) / 260);
      const finalPressure = Math.min(0.58, Math.max(0, elapsed - 190) / 240);
      const difficultyPressure = gameState?.selectedDifficulty === 'expert'
        ? 2.35
        : gameState?.selectedDifficulty === 'hard'
          ? 1.72
          : 0.48;
      const pressure = Math.min(limits.modePressureCap, (latePressure + finalPressure) * difficultyPressure);

      return {
        hp: 0.9 + pressure * 0.34,
        damage: 0.82 + pressure * 0.78,
        spawnRate: 1 + pressure * 0.78,
        maxEnemyBonus: Math.floor(pressure * 22),
        eliteBonus: pressure * 0.05,
        exp: 1,
        score: 1,
      };
    }

    const elapsed = gameState.elapsedTime ?? 0;
    let phase = ENDLESS_SCALING_CONFIG.phases[0];
    const unlockedPhaseIndex = Math.min(
      ENDLESS_SCALING_CONFIG.phases.length - 1,
      Math.max(0, gameState?.defeatedBosses ?? 0),
    );

    ENDLESS_SCALING_CONFIG.phases.forEach((entry, index) => {
      if (index <= unlockedPhaseIndex && elapsed >= entry.time) {
        phase = entry;
      }
    });

    const overtime = Math.max(0, elapsed - 600);
    const longRunBonus = unlockedPhaseIndex >= 3 ? Math.min(2.15, overtime / 420) : 0;

    return {
      hp: phase.hp + longRunBonus * 1.15,
      damage: phase.damage + longRunBonus * 0.95,
      spawnRate: phase.spawnRate + longRunBonus * 1.85,
      maxEnemyBonus: phase.maxEnemyBonus + Math.floor(longRunBonus * 44),
      eliteBonus: phase.eliteBonus + longRunBonus * 0.05,
      exp: 0.98 + Math.min(0.12, elapsed / 1400),
      score: 1 + Math.min(0.5, elapsed / 720),
    };
  }

  getMinimumSpawnInterval(gameState) {
    const elapsed = gameState?.elapsedTime ?? 0;
    const limits = this.getProgressionPhaseLimits(gameState);
    let interval = 0.58;

    if (gameState?.selectedMode === 'zero') {
      if (elapsed >= 320) {
        interval = 0.26;
        return Math.max(interval, limits.minimumSpawnInterval);
      }

      if (elapsed >= 250) {
        interval = 0.32;
        return Math.max(interval, limits.minimumSpawnInterval);
      }

      if (elapsed >= 165) {
        interval = 0.38;
        return Math.max(interval, limits.minimumSpawnInterval);
      }
    }

    if (gameState?.selectedMode === 'endless') {
      if (elapsed >= 720) {
        interval = 0.24;
        return Math.max(interval, limits.minimumSpawnInterval);
      }

      if (elapsed >= 600) {
        interval = 0.3;
        return Math.max(interval, limits.minimumSpawnInterval);
      }

      if (elapsed >= 360) {
        interval = 0.36;
        return Math.max(interval, limits.minimumSpawnInterval);
      }
    }

    if (gameState?.selectedDifficulty === 'expert' && elapsed >= 180) {
      interval = 0.34;
      return Math.max(interval, limits.minimumSpawnInterval);
    }

    if (gameState?.selectedDifficulty === 'hard' && elapsed >= 200) {
      interval = 0.42;
      return Math.max(interval, limits.minimumSpawnInterval);
    }

    return Math.max(interval, limits.minimumSpawnInterval);
  }

  getProgressionPhase(gameState) {
    if (gameState?.selectedMode === 'zero') {
      return Math.max(0, Math.min(2, gameState.zeroBossesDefeated ?? gameState.defeatedBosses ?? 0));
    }

    if (gameState?.selectedMode === 'endless') {
      return Math.max(0, Math.min(3, gameState.defeatedBosses ?? 0));
    }

    return Math.max(0, Math.min(1, gameState?.defeatedBosses ?? 0));
  }

  getProgressionPhaseLimits(gameState) {
    const phase = this.getProgressionPhase(gameState);
    const difficulty = gameState?.selectedDifficulty ?? 'normal';

    if (gameState?.selectedMode === 'zero') {
      return [
        { enemyLevelCap: 6, enemyCountCap: 104, elapsedPressureCap: 42, lateCapBonusCap: 24, modePressureCap: 0.72, minimumSpawnInterval: 0.42 },
        { enemyLevelCap: 9, enemyCountCap: 154, elapsedPressureCap: 70, lateCapBonusCap: 48, modePressureCap: 1.35, minimumSpawnInterval: 0.34 },
        { enemyLevelCap: 12, enemyCountCap: 220, elapsedPressureCap: 112, lateCapBonusCap: 80, modePressureCap: 2.41, minimumSpawnInterval: 0.26 },
      ][phase];
    }

    if (gameState?.selectedMode === 'endless') {
      return [
        { enemyLevelCap: 5, enemyCountCap: 112, elapsedPressureCap: 46, lateCapBonusCap: 20, modePressureCap: 0.7, minimumSpawnInterval: 0.44 },
        { enemyLevelCap: 7, enemyCountCap: 150, elapsedPressureCap: 72, lateCapBonusCap: 42, modePressureCap: 1.25, minimumSpawnInterval: 0.36 },
        { enemyLevelCap: 10, enemyCountCap: 190, elapsedPressureCap: 108, lateCapBonusCap: 72, modePressureCap: 1.9, minimumSpawnInterval: 0.3 },
        { enemyLevelCap: 12, enemyCountCap: 230, elapsedPressureCap: 150, lateCapBonusCap: 110, modePressureCap: 2.7, minimumSpawnInterval: 0.24 },
      ][phase];
    }

    if (difficulty === 'expert') {
      return phase >= 1
        ? { enemyLevelCap: 9, enemyCountCap: 150, elapsedPressureCap: 58, lateCapBonusCap: 38, modePressureCap: 2.0, minimumSpawnInterval: 0.34 }
        : { enemyLevelCap: 6, enemyCountCap: 112, elapsedPressureCap: 34, lateCapBonusCap: 18, modePressureCap: 1.05, minimumSpawnInterval: 0.42 };
    }

    if (difficulty === 'hard') {
      return phase >= 1
        ? { enemyLevelCap: 8, enemyCountCap: 130, elapsedPressureCap: 44, lateCapBonusCap: 28, modePressureCap: 1.45, minimumSpawnInterval: 0.42 }
        : { enemyLevelCap: 5, enemyCountCap: 96, elapsedPressureCap: 26, lateCapBonusCap: 12, modePressureCap: 0.82, minimumSpawnInterval: 0.5 };
    }

    return phase >= 1
      ? { enemyLevelCap: 6, enemyCountCap: 104, elapsedPressureCap: 28, lateCapBonusCap: 10, modePressureCap: 0.65, minimumSpawnInterval: 0.5 }
      : { enemyLevelCap: 4, enemyCountCap: 78, elapsedPressureCap: 18, lateCapBonusCap: 0, modePressureCap: 0.38, minimumSpawnInterval: 0.58 };
  }

  pickEnemyType(gameState) {
    const weights = this.getEnemyWeights(gameState);
    const total = weights.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * total;

    for (const entry of weights) {
      roll -= entry.weight;

      if (roll <= 0) {
        return entry.type;
      }
    }

    return 'swarm';
  }

  getEnemyWeights(gameState) {
    const elapsedTime = typeof gameState === 'number'
      ? gameState
      : gameState.elapsedTime + getDifficultyConfig(gameState.selectedDifficulty).timeAdvance;
    const stageConfig = typeof gameState === 'number'
      ? {}
      : getStageConfig(gameState.selectedStage);
    const stageWeights = typeof gameState === 'number'
      ? {}
      : stageConfig.enemyWeights;
    const stageDifficultyWeights = typeof gameState === 'number'
      ? {}
      : stageConfig.difficultyEnemyWeights?.[gameState.selectedDifficulty] ?? {};
    const difficultyWeights = typeof gameState === 'number'
      ? {}
      : getDifficultyConfig(gameState.selectedDifficulty).enemyWeights;
    const applyWeights = (weights) => this.applyWeightModifiers(weights, stageWeights, difficultyWeights, stageDifficultyWeights);
    const stageId = typeof gameState === 'number' ? null : gameState.selectedStage;

    const debugEnemySet = getDebugParam('debugEnemySet');

    if (stageId === 'volcano' && (debugEnemySet === 'volcano' || hasDebugFlag('debugSpawnVolcanoEnemies'))) {
      return [
        { type: 'volcanoHeavy', weight: 0.42 },
        { type: 'volcanoBomber', weight: 0.34 },
        { type: 'volcanoFast', weight: 0.24 },
      ];
    }

    if (stageId === 'volcano') {
      return this.getVolcanoEnemyWeights(elapsedTime, applyWeights);
    }

    if (stageId === 'swamp' && (debugEnemySet === 'swamp' || hasDebugFlag('debugSpawnSwampEnemies'))) {
      return [
        { type: 'swampPoison', weight: 0.46 },
        { type: 'swampSlow', weight: 0.24 },
        { type: 'swampToxicBomber', weight: 0.3 },
      ];
    }

    if (stageId === 'swamp') {
      return this.getSwampEnemyWeights(elapsedTime, applyWeights);
    }

    if (stageId === 'ruins' && (debugEnemySet === 'ruins' || hasDebugFlag('debugSpawnRuinsEnemies'))) {
      return [
        { type: 'ruinsShooter', weight: 0.46 },
        { type: 'ruinsElectro', weight: 0.28 },
        { type: 'ruinsSummoner', weight: 0.26 },
      ];
    }

    if (stageId === 'ruins') {
      return this.getRuinsEnemyWeights(elapsedTime, applyWeights);
    }

    if (elapsedTime < 25) {
      return applyWeights([
        { type: 'swarm', weight: 1 },
      ]);
    }

    if (elapsedTime < 55) {
      return applyWeights([
        { type: 'swarm', weight: 0.76 },
        { type: 'fast', weight: 0.24 },
      ]);
    }

    if (elapsedTime < 95) {
      return applyWeights([
        { type: 'swarm', weight: 0.62 },
        { type: 'fast', weight: 0.25 },
        { type: 'tank', weight: 0.13 },
      ]);
    }

    return applyWeights([
      { type: 'swarm', weight: 0.52 },
      { type: 'fast', weight: 0.28 },
      { type: 'tank', weight: 0.2 },
    ]);
  }

  getVolcanoEnemyWeights(elapsedTime, applyWeights) {
    if (elapsedTime < 25) {
      return applyWeights([
        { type: 'swarm', weight: 0.54 },
        { type: 'volcanoHeavy', weight: 0.34 },
        { type: 'volcanoBomber', weight: 0.12 },
      ]);
    }

    if (elapsedTime < 55) {
      return applyWeights([
        { type: 'swarm', weight: 0.38 },
        { type: 'fast', weight: 0.1 },
        { type: 'volcanoHeavy', weight: 0.3 },
        { type: 'volcanoBomber', weight: 0.16 },
        { type: 'volcanoFast', weight: 0.06 },
      ]);
    }

    if (elapsedTime < 95) {
      return applyWeights([
        { type: 'swarm', weight: 0.28 },
        { type: 'fast', weight: 0.1 },
        { type: 'tank', weight: 0.08 },
        { type: 'volcanoHeavy', weight: 0.28 },
        { type: 'volcanoBomber', weight: 0.18 },
        { type: 'volcanoFast', weight: 0.08 },
      ]);
    }

    return applyWeights([
      { type: 'swarm', weight: 0.22 },
      { type: 'fast', weight: 0.1 },
      { type: 'tank', weight: 0.1 },
      { type: 'volcanoHeavy', weight: 0.26 },
      { type: 'volcanoBomber', weight: 0.22 },
      { type: 'volcanoFast', weight: 0.1 },
    ]);
  }

  getSwampEnemyWeights(elapsedTime, applyWeights) {
    if (elapsedTime < 25) {
      return applyWeights([
        { type: 'swarm', weight: 0.34 },
        { type: 'swampPoison', weight: 0.54 },
        { type: 'swampSlow', weight: 0.12 },
      ]);
    }

    if (elapsedTime < 55) {
      return applyWeights([
        { type: 'swarm', weight: 0.26 },
        { type: 'tank', weight: 0.08 },
        { type: 'swampPoison', weight: 0.46 },
        { type: 'swampSlow', weight: 0.14 },
        { type: 'swampToxicBomber', weight: 0.06 },
      ]);
    }

    if (elapsedTime < 95) {
      return applyWeights([
        { type: 'swarm', weight: 0.2 },
        { type: 'tank', weight: 0.12 },
        { type: 'swampPoison', weight: 0.4 },
        { type: 'swampSlow', weight: 0.16 },
        { type: 'swampToxicBomber', weight: 0.12 },
      ]);
    }

    return applyWeights([
      { type: 'swarm', weight: 0.16 },
      { type: 'tank', weight: 0.14 },
      { type: 'swampPoison', weight: 0.36 },
      { type: 'swampSlow', weight: 0.16 },
      { type: 'swampToxicBomber', weight: 0.18 },
    ]);
  }

  getRuinsEnemyWeights(elapsedTime, applyWeights) {
    if (elapsedTime < 25) {
      return applyWeights([
        { type: 'swarm', weight: 0.26 },
        { type: 'ruinsShooter', weight: 0.58 },
        { type: 'ruinsElectro', weight: 0.16 },
      ]);
    }

    if (elapsedTime < 55) {
      return applyWeights([
        { type: 'swarm', weight: 0.18 },
        { type: 'fast', weight: 0.06 },
        { type: 'ruinsShooter', weight: 0.5 },
        { type: 'ruinsElectro', weight: 0.18 },
        { type: 'ruinsSummoner', weight: 0.08 },
      ]);
    }

    if (elapsedTime < 95) {
      return applyWeights([
        { type: 'swarm', weight: 0.14 },
        { type: 'tank', weight: 0.08 },
        { type: 'ruinsShooter', weight: 0.42 },
        { type: 'ruinsElectro', weight: 0.22 },
        { type: 'ruinsSummoner', weight: 0.14 },
      ]);
    }

    return applyWeights([
      { type: 'swarm', weight: 0.1 },
      { type: 'fast', weight: 0.06 },
      { type: 'tank', weight: 0.1 },
      { type: 'ruinsShooter', weight: 0.36 },
      { type: 'ruinsElectro', weight: 0.24 },
      { type: 'ruinsSummoner', weight: 0.14 },
    ]);
  }

  applyWeightModifiers(weights, ...modifierSets) {
    const weightFor = (type) => modifierSets.reduce((sum, modifiers) => sum + (modifiers?.[type] ?? 0), 0);
    const adjusted = weights.map((entry) => ({
      ...entry,
      weight: Math.max(0.04, entry.weight + weightFor(entry.type)),
    }));
    const knownTypes = new Set(weights.map((entry) => entry.type));
    const extraTypes = new Set(modifierSets.flatMap((modifiers) => Object.keys(modifiers ?? {})));

    extraTypes.forEach((type) => {
      if (knownTypes.has(type)) {
        return;
      }

      const weight = weightFor(type);

      if (weight >= 0.03) {
        adjusted.push({ type, weight });
      }
    });

    return adjusted;
  }

  getSpawnPoint(camera, player) {
    const margin = 170;
    const side = Math.floor(Math.random() * 4);
    const visibleWidth = camera.visibleWidth ?? this.viewWidth;
    const visibleHeight = camera.visibleHeight ?? this.viewHeight;
    let x = camera.x + Math.random() * visibleWidth;
    let y = camera.y + Math.random() * visibleHeight;

    if (side === 0) {
      y = camera.y - margin;
    } else if (side === 1) {
      x = camera.x + visibleWidth + margin;
    } else if (side === 2) {
      y = camera.y + visibleHeight + margin;
    } else {
      x = camera.x - margin;
    }

    x = this.clamp(x, this.stageBounds.left, this.stageBounds.right);
    y = this.clamp(y, this.stageBounds.top, this.stageBounds.bottom);

    if (Math.hypot(x - player.position.x, y - player.position.y) < 380) {
      x = this.clamp(player.position.x + (x < player.position.x ? -500 : 500), this.stageBounds.left, this.stageBounds.right);
      y = this.clamp(player.position.y + (y < player.position.y ? -420 : 420), this.stageBounds.top, this.stageBounds.bottom);
    }

    return { x, y };
  }

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
}
