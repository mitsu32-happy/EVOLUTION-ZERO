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
    const maxEnemies = Math.min(
      gameState.selectedMode === 'endless'
        ? ENDLESS_SCALING_CONFIG.softEnemyCap
        : gameState.selectedMode === 'zero'
          ? ZERO_SCALING_CONFIG.softEnemyCap
          : this.maxEnemies + difficulty.maxEnemyBonus + modeBonus,
      10 + difficulty.maxEnemyBonus + modeBonus + Math.floor(gameState.elapsedTime / (['endless', 'zero'].includes(gameState.selectedMode) ? 8 : 11)),
    );

    if (enemies.length >= maxEnemies) {
      return;
    }

    this.spawnTimer -= delta;

    if (this.spawnTimer > 0) {
      return;
    }

    this.spawnTimer = Math.max(
      0.58,
      (this.spawnInterval - gameState.elapsedTime * 0.017) * difficulty.spawnIntervalMultiplier / modeScale.spawnRate,
    );
    onSpawn(new Enemy({
      ...this.getSpawnPoint(camera, player),
      enemyType: this.pickEnemyType(gameState),
      assetLoader: this.assetLoader,
      hpMultiplier: modeScale.hp,
      damageMultiplier: modeScale.damage,
      expMultiplier: modeScale.exp,
      scoreMultiplier: modeScale.score,
    }));
  }

  getModeScaling(gameState) {
    if (gameState?.selectedMode === 'zero') {
      const elapsed = gameState.elapsedTime ?? 0;
      const midPressure = Math.min(0.28, Math.max(0, elapsed - 105) / 430);
      const latePressure = Math.min(0.34, Math.max(0, elapsed - 205) / 520);
      const pressure = midPressure + latePressure;

      return {
        hp: ZERO_SCALING_CONFIG.enemyHp + pressure,
        damage: ZERO_SCALING_CONFIG.enemyDamage + pressure * 0.34,
        spawnRate: ZERO_SCALING_CONFIG.spawnRate + pressure * 0.68,
        maxEnemyBonus: ZERO_SCALING_CONFIG.maxEnemyBonus + Math.floor(pressure * 10),
        eliteBonus: ZERO_SCALING_CONFIG.eliteBonus + pressure * 0.1,
        exp: 1.24,
        score: 1.35,
      };
    }

    return this.getEndlessScaling(gameState);
  }

  getEndlessScaling(gameState) {
    if (gameState?.selectedMode !== 'endless') {
      return { hp: 0.9, damage: 0.82, spawnRate: 1, maxEnemyBonus: 0, eliteBonus: 0, exp: 1, score: 1 };
    }

    const elapsed = gameState.elapsedTime ?? 0;
    let phase = ENDLESS_SCALING_CONFIG.phases[0];

    ENDLESS_SCALING_CONFIG.phases.forEach((entry) => {
      if (elapsed >= entry.time) {
        phase = entry;
      }
    });

    const overtime = Math.max(0, elapsed - 600);
    const longRunBonus = Math.min(0.45, overtime / 900);

    return {
      hp: phase.hp + longRunBonus,
      damage: phase.damage + longRunBonus * 0.34,
      spawnRate: phase.spawnRate + longRunBonus * 0.55,
      maxEnemyBonus: phase.maxEnemyBonus,
      eliteBonus: phase.eliteBonus,
      exp: 1 + Math.min(0.28, elapsed / 900),
      score: 1 + Math.min(0.5, elapsed / 720),
    };
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
