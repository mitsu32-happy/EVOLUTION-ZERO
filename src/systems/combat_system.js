import { Graphics, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import { CollisionSystem } from './collision_system.js';
import { getNormalAttackById, getNormalAttackForDino, NORMAL_ATTACK_HIT_SHAPES } from '../data/normal_attacks.js';
import { getAdaptationSynergyEffects } from '../data/adaptation_synergy.js';

export class CombatSystem {
  constructor({ assetLoader = null } = {}) {
    this.assetLoader = assetLoader;
    this.attackTimer = 0;
    this.attackPattern = 'normal';
    this.attackInterval = 0.56;
    this.attackRange = 118;
    this.targetAcquireRange = 128;
    this.damage = 18;
    this.knockback = 0;
    this.effectColor = 0xff5138;
    this.effectGlowColor = 0xfff0b0;
    this.effectWeight = 1;
    this.lastImpactShake = 0;
    this.effects = [];
    this.damageNumbers = [];
    this.damageNumbersEnabled = true;
    this.simpleEffects = false;
    this.statusOnHit = {};
    this.normalAttackDefinition = null;
    this.normalAttackEffectTexture = null;
    this.normalAttackEffectKey = null;
    this.evolutionNormalAttackEffectTexture = null;
    this.evolutionNormalAttackEffectKey = null;
    this.evolutionNormalAttackEffectId = null;
    this.adaptationDamageMultiplier = 1;
    this.adaptationSynergy = {
      speed: 0,
      hunting: 0,
      attack: 0,
    };
    this.adaptationSynergyEffects = getAdaptationSynergyEffects(this.adaptationSynergy);
    this.adaptationSkillStates = new Map();
    this.projectiles = [];
  }

  setAdaptationSynergy(synergy = {}) {
    this.adaptationSynergy = {
      speed: synergy.speed ?? 0,
      hunting: synergy.hunting ?? 0,
      attack: synergy.attack ?? 0,
    };
    this.adaptationSynergyEffects = getAdaptationSynergyEffects(this.adaptationSynergy);
  }

  applyUpgrade(upgradeId, level) {
    if (upgradeId === 'attack_speed_up' || upgradeId === 'attack_range_up') {
      return;
    }

    if (upgradeId === 'attack_power_up' || upgradeId === 'predator_instinct') {
      this.damage += 3 + level;
      this.adaptationDamageMultiplier += 0.09 + level * 0.02;
      return;
    }

    if (upgradeId === 'poison_bite') {
      this.statusOnHit.poison = { duration: 2.2 + level * 0.25, power: 1 + level * 0.18 };
    }

    if (upgradeId === 'bleed_claw') {
      this.statusOnHit.bleed = { duration: 1.8 + level * 0.22, power: 1 + level * 0.22 };
    }

    if (upgradeId === 'shock_roar') {
      this.statusOnHit.slow = { duration: 1.1 + level * 0.16, power: 1 };
    }

  }

  applyEvolution(evolution) {
    if (!evolution) {
      return;
    }

    this.attackPattern = evolution.tag;
    this.evolutionNormalAttackEffectId = evolution.id ?? null;
    this.loadEvolutionNormalAttackEffect(evolution.normalAttackEffectKey ?? null, this.evolutionNormalAttackEffectId);

    if (evolution.tag === 'speed') {
      this.attackInterval = Math.max(0.15, this.attackInterval * 0.54);
      this.attackRange = Math.max(104, this.attackRange - 6);
      this.targetAcquireRange = Math.max(this.targetAcquireRange + 28, this.attackRange + 18);
      this.damage = Math.round(this.damage * 1.16);
      this.effectColor = 0x35d7ff;
      this.effectGlowColor = 0xb8fbff;
      this.effectWeight = 0.82;
    }

    if (evolution.tag === 'hunting') {
      this.attackRange += 108;
      this.targetAcquireRange = Math.max(this.targetAcquireRange + 168, this.attackRange + 112);
      this.damage = Math.round(this.damage * 1.24);
      this.effectColor = 0xffc94d;
      this.effectGlowColor = 0xffefb0;
      this.effectWeight = 1.18;
      this.knockback = Math.max(this.knockback, 30);
    }

    if (evolution.tag === 'attack') {
      this.attackInterval = Math.min(0.72, this.attackInterval * 1.12);
      this.damage = Math.round(this.damage * 2.28);
      this.attackRange += 42;
      this.targetAcquireRange = Math.max(this.targetAcquireRange + 42, this.attackRange + 38);
      this.knockback = 76;
      this.effectColor = 0xff4d38;
      this.effectGlowColor = 0xffd1a0;
      this.effectWeight = 1.58;
    }

    if (evolution.tag === 'zero') {
      this.attackInterval = Math.max(0.18, this.attackInterval * 0.48);
      this.damage = Math.round(this.damage * 3.05);
      this.attackRange += 126;
      this.targetAcquireRange = Math.max(this.targetAcquireRange + 220, this.attackRange + 160);
      this.knockback = 112;
      this.effectColor = 0xb94dff;
      this.effectGlowColor = 0x82f7ff;
      this.effectWeight = 2.1;
      this.adaptationDamageMultiplier += 0.22;
    }
  }

  reset() {
    this.attackTimer = 0;
    this.attackPattern = 'normal';
    this.attackInterval = 0.56;
    this.attackRange = 118;
    this.targetAcquireRange = 128;
    this.damage = 18;
    this.knockback = 0;
    this.effectColor = 0xff5138;
    this.effectGlowColor = 0xfff0b0;
    this.effectWeight = 1;
    this.lastImpactShake = 0;
    this.statusOnHit = {};
    this.normalAttackDefinition = null;
    this.normalAttackEffectTexture = null;
    this.normalAttackEffectKey = null;
    this.evolutionNormalAttackEffectTexture = null;
    this.evolutionNormalAttackEffectKey = null;
    this.evolutionNormalAttackEffectId = null;
    this.adaptationDamageMultiplier = 1;
    this.setAdaptationSynergy();
    this.adaptationSkillStates.clear();
    this.currentEnemies = null;
    this.effects.forEach((effect) => effect.view.destroy());
    this.effects = [];
    this.projectiles.forEach((projectile) => projectile.view.destroy());
    this.projectiles = [];
    this.damageNumbers.forEach((number) => number.view.destroy());
    this.damageNumbers = [];
  }

  applyDinoConfig(config) {
    if (!config) {
      return;
    }

    this.normalAttackDefinition = getNormalAttackById(config.normalAttackId)
      ?? getNormalAttackForDino(config.id)
      ?? null;

    if (this.normalAttackDefinition) {
      this.damage = this.normalAttackDefinition.damage;
      this.attackInterval = this.normalAttackDefinition.cooldown;
      this.attackRange = this.normalAttackDefinition.range;
      this.targetAcquireRange = this.attackRange + 34;
      this.knockback = this.normalAttackDefinition.knockback;
      this.loadNormalAttackEffect(this.normalAttackDefinition);
    }

    this.damage += config.attackDamageBonus ?? 0;
    this.attackRange += config.attackRangeBonus ?? 0;
    this.attackInterval *= config.attackIntervalMultiplier ?? 1;
    this.targetAcquireRange += config.targetAcquireRangeBonus ?? 0;
    this.targetAcquireRange = Math.max(this.targetAcquireRange, this.attackRange + 18);
  }

  loadNormalAttackEffect(attack) {
    this.normalAttackEffectTexture = null;
    this.normalAttackEffectKey = attack?.effectKey ?? null;

    if (!this.assetLoader || !this.normalAttackEffectKey) {
      return;
    }

    const expectedKey = this.normalAttackEffectKey;
    this.assetLoader.load(expectedKey).then((texture) => {
      if (this.normalAttackEffectKey !== expectedKey) {
        return;
      }

      const item = this.assetLoader.getItem?.(expectedKey);
      this.normalAttackEffectTexture = this.getRenderableEffectTexture(texture, item?.meta);
    });
  }

  loadEvolutionNormalAttackEffect(effectKey, effectId = null) {
    this.evolutionNormalAttackEffectTexture = null;
    this.evolutionNormalAttackEffectKey = effectKey ?? null;
    this.evolutionNormalAttackEffectId = effectId ?? null;

    if (!this.assetLoader || !this.evolutionNormalAttackEffectKey) {
      return;
    }

    const expectedKey = this.evolutionNormalAttackEffectKey;
    const expectedId = this.evolutionNormalAttackEffectId;
    this.assetLoader.load(expectedKey).then((texture) => {
      if (this.evolutionNormalAttackEffectKey !== expectedKey || this.evolutionNormalAttackEffectId !== expectedId) {
        return;
      }

      const item = this.assetLoader.getItem?.(expectedKey);
      this.evolutionNormalAttackEffectTexture = this.getRenderableEffectTexture(texture, item?.meta);
    });
  }

  applyAdaptationSkill(skill, level = 1) {
    if (!skill || skill.type !== 'adaptationSkill' || !skill.runtimeImplemented) {
      return;
    }

    const existing = this.adaptationSkillStates.get(skill.id);
    const state = existing ?? {
      id: skill.id,
      skill,
      level: 0,
      timer: Math.min(0.65, skill.cooldown ?? 2),
      texture: null,
      effectKey: skill.effectKey ?? null,
      fallbackEffectKey: skill.fallbackEffectKey ?? null,
      triggerEffectKey: skill.triggerEffectKey ?? null,
      explosionEffectKey: skill.explosionEffectKey ?? null,
      extraTextures: {},
    };

    state.skill = skill;
    state.level = Math.max(state.level, level);
    state.effectKey = skill.effectKey ?? state.effectKey ?? null;
    state.fallbackEffectKey = skill.fallbackEffectKey ?? null;
    state.triggerEffectKey = skill.triggerEffectKey ?? null;
    state.explosionEffectKey = skill.explosionEffectKey ?? null;
    state.extraTextures = state.extraTextures ?? {};
    this.adaptationSkillStates.set(skill.id, state);
    this.loadAdaptationSkillEffect(state);
  }

  loadAdaptationSkillEffect(state) {
    state.texture = null;
    state.extraTextures = {};

    if (!this.assetLoader) {
      return;
    }

    this.loadEffectTexture(state, 'texture', state.effectKey);
    this.loadEffectTexture(state, 'fallback', state.fallbackEffectKey);
    this.loadEffectTexture(state, 'trigger', state.triggerEffectKey);
    this.loadEffectTexture(state, 'explosion', state.explosionEffectKey);
  }

  loadEffectTexture(state, target, effectKey) {
    if (!effectKey) {
      return;
    }

    const expectedKey = effectKey;
    this.assetLoader.load(expectedKey).then((texture) => {
      if (target === 'texture') {
        if (state.effectKey === expectedKey) {
          const item = this.assetLoader.getItem?.(expectedKey);
          state.texture = this.getRenderableEffectTexture(texture, item?.meta);
        }
        return;
      }

      if (state[`${target}EffectKey`] === expectedKey || state.fallbackEffectKey === expectedKey) {
        const item = this.assetLoader.getItem?.(expectedKey);
        state.extraTextures[target] = this.getRenderableEffectTexture(texture, item?.meta);
      }
    }).catch(() => {
      // Missing optional art should never break play; Graphics fallback remains available.
    });
  }

  getRenderableEffectTexture(texture, meta = null) {
    if (!meta?.spriteSheet || !texture?.source) {
      return texture;
    }

    const sheet = meta.sheet ?? {};
    const columns = sheet.columns ?? 4;
    const rows = sheet.rows ?? 4;
    const frameWidth = sheet.frameWidth ?? Math.floor((texture.width ?? 0) / columns);
    const frameHeight = sheet.frameHeight ?? Math.floor((texture.height ?? 0) / rows);

    if (frameWidth <= 0 || frameHeight <= 0) {
      return texture;
    }

    return new Texture({
      source: texture.source,
      frame: new Rectangle(0, 0, frameWidth, frameHeight),
    });
  }

  getAdaptationTexture(state, variant = 'main') {
    if (variant !== 'main' && state.extraTextures?.[variant]) {
      return state.extraTextures[variant];
    }

    return state.texture ?? state.extraTextures?.fallback ?? null;
  }

  applyResearchBonuses(bonuses = {}) {
    this.damage += bonuses.attackDamageBonus ?? 0;
    this.attackInterval = Math.max(0.22, this.attackInterval * (bonuses.attackIntervalMultiplier ?? 1));
  }

  applyHitStatuses(target) {
    Object.entries(this.statusOnHit).forEach(([type, effect]) => {
      target.applyStatus?.(type, effect.duration, effect.power);
    });
  }

  update(delta, player, enemies, effectLayer) {
    this.currentEnemies = enemies;
    this.attackTimer -= delta;
    this.lastImpactShake = 0;
    this.updateEffects(delta);
    this.updateProjectiles(delta);
    const adaptationResult = this.updateAdaptationSkills(delta, player, enemies, effectLayer);

    if (this.attackTimer > 0) {
      return adaptationResult;
    }

    const target = this.findNearestTarget(player, enemies);

    if (!target) {
      return adaptationResult;
    }

    this.attackTimer = this.attackInterval;
    this.facePlayerToTarget(player, target);

    if (this.attackPattern === 'speed') {
      return this.mergeCombatResults(this.performSpeedAttack(player, target, effectLayer), adaptationResult);
    }

    if (this.attackPattern === 'hunting') {
      return this.mergeCombatResults(this.performHuntingAttack(player, enemies, effectLayer), adaptationResult);
    }

    if (this.attackPattern === 'attack') {
      return this.mergeCombatResults(this.performHeavyAttack(player, target, effectLayer), adaptationResult);
    }

    return this.mergeCombatResults(this.performNormalAttack(player, target, enemies, effectLayer), adaptationResult);
  }

  mergeCombatResults(primary, secondary) {
    if (!primary) {
      return secondary ?? null;
    }

    if (!secondary) {
      return primary;
    }

    return {
      pattern: primary.pattern,
      targets: [...(primary.targets ?? []), ...(secondary.targets ?? [])],
      shake: Math.max(primary.shake ?? 0, secondary.shake ?? 0),
    };
  }

  updateAdaptationSkills(delta, player, enemies, effectLayer) {
    if (this.adaptationSkillStates.size === 0) {
      return null;
    }

    const results = [];
    this.adaptationSkillStates.forEach((state) => {
      state.timer -= delta;

      if (state.timer > 0) {
        return;
      }

      const result = this.performAdaptationSkill(state, player, enemies, effectLayer);

      if (result?.casted || result?.targets?.length > 0) {
        results.push(result);
        state.timer = Math.max(
          0.18,
          (state.skill.cooldown ?? 3)
            * (1 - Math.max(0, state.level - 1) * 0.075)
            * this.getAdaptationCooldownMultiplier(),
        );
      } else {
        state.timer = 0.6;
      }
    });

    if (results.length === 0) {
      return null;
    }

    return results.reduce((merged, result) => this.mergeCombatResults(result, merged), null);
  }

  getAdaptationCooldownMultiplier() {
    return this.adaptationSynergyEffects?.cooldownMultiplier ?? 1;
  }

  getAdaptationRangeMultiplier() {
    return this.adaptationSynergyEffects?.rangeMultiplier ?? 1;
  }

  performAdaptationSkill(state, player, enemies, effectLayer) {
    if (state.id === 'afterimage_claw') {
      return this.performAfterimageClaw(state, player, enemies, effectLayer);
    }

    if (state.id === 'gale_blade') {
      return this.performGaleBlade(state, player, enemies, effectLayer);
    }

    if (state.id === 'homing_fang') {
      return this.performHomingFang(state, player, enemies, effectLayer);
    }

    if (state.id === 'sense_spike') {
      return this.performSenseSpike(state, player, enemies, effectLayer);
    }

    if (state.id === 'shock_roar_wave') {
      return this.performShockRoarWave(state, player, enemies, effectLayer);
    }

    if (state.id === 'burst_fang') {
      return this.performBurstFang(state, player, enemies, effectLayer);
    }

    if (state.id === 'accelerated_blades') {
      return this.performAcceleratedBlades(state, player, enemies, effectLayer);
    }

    if (state.id === 'predator_marking') {
      return this.performPredatorMarking(state, player, enemies, effectLayer);
    }

    if (state.id === 'flame_breath') {
      return this.performFlameBreath(state, player, enemies, effectLayer);
    }

    return null;
  }

  performAfterimageClaw(state, player, enemies, effectLayer) {
    const facing = this.getPlayerForwardFacing(player);
    const visualTarget = this.createFacingTarget(player, facing, 150);
    const level = state.level ?? 1;
    const rangeMultiplier = this.getAdaptationRangeMultiplier();
    const slashCount = level >= 5 ? 5 : level >= 3 ? 4 : level >= 2 ? 2 : 1;
    const attack = {
      attackType: NORMAL_ATTACK_HIT_SHAPES.ARC,
      range: (132 + level * 18) * rangeMultiplier,
      angle: level >= 4 ? 112 : 88,
      maxTargets: 3 + slashCount + Math.floor(level / 2),
      originOffset: { x: 22, y: 0 },
    };
    const targets = this.findNormalAttackTargets(player, enemies, attack, facing, null);
    const damage = this.getAdaptationDamage(state, slashCount > 1 ? 0.86 : 1.04);

    targets.forEach((enemy, index) => {
      enemy.takeDamage(damage, { from: player.position, strength: 10 });
      this.spawnDamageNumber(effectLayer, enemy, damage, 0xb8fbff, (index - 0.5) * 10);
    });

    for (let index = 0; index < slashCount; index += 1) {
      this.spawnAdaptationSpriteEffect(state, player, visualTarget, effectLayer, {
        facing,
        distanceRatio: 0.44 + index * 0.08,
        width: (132 + level * 9) * rangeMultiplier,
        height: (96 + level * 4) * rangeMultiplier,
        duration: 0.2 + index * 0.035,
        sideOffset: (index - (slashCount - 1) / 2) * 24,
        color: 0x35d7ff,
      });
    }

    return { pattern: state.id, targets, shake: 0, casted: true };
  }

  performGaleBlade(state, player, enemies, effectLayer) {
    const facing = this.getPlayerForwardFacing(player);
    const level = state.level ?? 1;
    const rangeMultiplier = this.getAdaptationRangeMultiplier();
    const bladeCount = level >= 5 ? 6 : level >= 3 ? 5 : level >= 2 ? 3 : 2;
    const directions = this.getSpreadDirections(facing, bladeCount, Math.PI * 0.74);
    const hitSet = new Set();
    const targets = [];
    const damage = this.getAdaptationDamage(state, bladeCount > 1 ? 0.9 : 1.05);

    directions.forEach((direction, bladeIndex) => {
      const attack = {
        attackType: NORMAL_ATTACK_HIT_SHAPES.RECTANGLE,
        range: ((state.skill.range ?? 190) + level * 16) * rangeMultiplier,
        width: (46 + level * 8) * rangeMultiplier,
        maxTargets: 2 + Math.floor(level / 2),
        originOffset: { x: 16, y: 0 },
      };
      const laneTargets = this.findNormalAttackTargets(player, enemies, attack, direction, null);

      laneTargets.forEach((enemy) => {
        if (hitSet.has(enemy)) {
          return;
        }

        hitSet.add(enemy);
        targets.push(enemy);
        enemy.takeDamage(damage, { from: player.position, strength: 8 + level });
        this.spawnDamageNumber(effectLayer, enemy, damage, 0xb8fbff, (bladeIndex - 1) * 8);
      });

      const visualTarget = this.createFacingTarget(player, direction, 172 + bladeIndex * 6);
      this.spawnAdaptationSpriteEffect(state, player, visualTarget, effectLayer, {
        facing: direction,
        distanceRatio: 0.5,
        width: (138 + level * 10) * rangeMultiplier,
        height: (70 + level * 4) * rangeMultiplier,
        duration: 0.18 + bladeIndex * 0.025,
        color: 0x52e4ff,
      });
    });

    return { pattern: state.id, targets, shake: targets.length > 0 ? 0.2 : 0, casted: true };
  }

  performHomingFang(state, player, enemies, effectLayer) {
    const level = state.level ?? 1;
    const rangeMultiplier = this.getAdaptationRangeMultiplier();
    const limit = level >= 5 ? 5 : level >= 3 ? 4 : level >= 2 ? 2 : 1;
    const targets = this.findTargetsInRange(player, enemies, ((state.skill.searchRange ?? 390) + level * 22) * rangeMultiplier, limit);

    if (targets.length === 0) {
      return null;
    }

    const currentFangs = this.projectiles.filter((projectile) => projectile.style === state.id).length;
    const openSlots = Math.max(0, 5 - currentFangs);
    const launchTargets = targets.slice(0, openSlots);

    if (launchTargets.length === 0) {
      return null;
    }

    targets.forEach((enemy, index) => {
      if (!launchTargets.includes(enemy)) {
        return;
      }

      this.spawnHomingFangProjectile(state, player, enemy, effectLayer, index);
    });

    return { pattern: state.id, targets: launchTargets, shake: 0 };
  }

  performSenseSpike(state, player, enemies, effectLayer) {
    const level = state.level ?? 1;
    const rangeMultiplier = this.getAdaptationRangeMultiplier();
    const trapCount = level >= 5 ? 10 : level >= 3 ? 7 : 4;
    const trapRadius = (56 + level * 9) * rangeMultiplier;
    const ringRadius = (112 + level * 15) * rangeMultiplier;

    for (let index = 0; index < trapCount; index += 1) {
      const angle = (Math.PI * 2 * index) / trapCount + this.effects.length * 0.17;
      this.spawnSenseSpikeTrap(state, effectLayer, {
        x: player.position.x + Math.cos(angle) * ringRadius,
        y: player.position.y + Math.sin(angle) * ringRadius,
        radius: trapRadius,
        duration: 1.25 + level * 0.1,
        delay: index * 0.03,
      });
    }

    return { pattern: state.id, targets: [], shake: 0, casted: true };
  }

  performShockRoarWave(state, player, enemies, effectLayer) {
    const facing = this.getPlayerForwardFacing(player);
    const visualTarget = this.createFacingTarget(player, facing, 190);
    const level = state.level ?? 1;
    const rangeMultiplier = this.getAdaptationRangeMultiplier();
    const attack = {
      attackType: NORMAL_ATTACK_HIT_SHAPES.CONE,
      range: (186 + level * 23) * rangeMultiplier,
      angle: 78 + level * 7,
      maxTargets: 6 + Math.min(6, Math.floor(level * 0.9)),
      originOffset: { x: 26, y: 0 },
    };
    const targets = this.findNormalAttackTargets(player, enemies, attack, facing, null);
    const damage = this.getAdaptationDamage(state, 1.16);

    targets.forEach((enemy, index) => {
      enemy.takeDamage(damage, { from: player.position, strength: 24 + level * 2 });
      this.spawnDamageNumber(effectLayer, enemy, damage, 0xff9a62, (index - 1) * 10);
    });

    this.spawnAdaptationSpriteEffect(state, player, visualTarget, effectLayer, {
      facing,
      distanceRatio: 0.54,
      width: (156 + level * 12) * rangeMultiplier,
      height: (110 + level * 7) * rangeMultiplier,
      duration: 0.3,
      color: 0xff6a3a,
    });

    return { pattern: state.id, targets, shake: targets.length > 0 ? 1.4 : 0, casted: true };
  }

  performBurstFang(state, player, enemies, effectLayer) {
    const facing = this.getPlayerForwardFacing(player);
    const level = state.level ?? 1;
    const rangeMultiplier = this.getAdaptationRangeMultiplier();
    const mineCount = level >= 5 ? 6 : level >= 3 ? 4 : 2;

    for (let index = 0; index < mineCount; index += 1) {
      const side = index - (mineCount - 1) / 2;
      const distance = 104 + index * 38;
      this.spawnDelayedBurstProjectile(state, player, effectLayer, {
        x: player.position.x + facing.x * distance + -facing.y * side * 46,
        y: player.position.y + facing.y * distance + facing.x * side * 46,
        delay: 0.58 + index * 0.08,
        radius: (70 + level * 11) * rangeMultiplier,
      });
    }

    return { pattern: state.id, targets: [], shake: 0, casted: true };
  }

  performAcceleratedBlades(state, player, enemies, effectLayer) {
    const level = state.level ?? 1;
    const rangeMultiplier = this.getAdaptationRangeMultiplier();
    const radius = ((state.skill.range ?? 158) + level * 22) * rangeMultiplier;
    const limit = 6 + Math.min(6, level);
    const targets = this.findTargetsInRange(player, enemies, radius, limit);

    const damage = this.getAdaptationDamage(state, 0.88);
    targets.forEach((enemy, index) => {
      enemy.takeDamage(damage, { from: player.position, strength: 8 + level });
      this.spawnDamageNumber(effectLayer, enemy, damage, 0x9effff, (index - (targets.length - 1) / 2) * 8);
    });

    this.spawnAdaptationAreaEffect(state, player, effectLayer, {
      width: (206 + level * 12) * rangeMultiplier,
      height: (206 + level * 12) * rangeMultiplier,
      duration: 0.5 + level * 0.07,
      color: 0x52e4ff,
      rotation: this.effects.length * 0.7,
    });

    return { pattern: state.id, targets, shake: targets.length > 0 ? 0.4 : 0, casted: true };
  }

  performPredatorMarking(state, player, enemies, effectLayer) {
    const level = state.level ?? 1;
    const rangeMultiplier = this.getAdaptationRangeMultiplier();
    const limit = level >= 5 ? 5 : level >= 3 ? 4 : level >= 2 ? 2 : 1;
    const targets = this.findTargetsInRange(player, enemies, ((state.skill.searchRange ?? 390) + level * 18) * rangeMultiplier, limit);

    if (targets.length === 0) {
      return null;
    }

    const damage = this.getAdaptationDamage(state, 1.18);
    targets.forEach((enemy, index) => {
      enemy.takeDamage(damage, { from: player.position, strength: 12 });
      this.spawnDamageNumber(effectLayer, enemy, damage, 0xffd36b, index * 8);
      this.spawnAdaptationSpriteEffect(state, player, enemy, effectLayer, {
        width: (126 + level * 5) * rangeMultiplier,
        height: (126 + level * 5) * rangeMultiplier,
        duration: 0.34,
        color: 0xffc94d,
      });
    });

    return { pattern: state.id, targets, shake: 0.2 };
  }

  performFlameBreath(state, player, enemies, effectLayer) {
    const facing = this.getPlayerForwardFacing(player);
    const visualTarget = this.createFacingTarget(player, facing, 220);
    const level = state.level ?? 1;
    const rangeMultiplier = this.getAdaptationRangeMultiplier();
    const attack = {
      attackType: NORMAL_ATTACK_HIT_SHAPES.CONE,
      range: ((state.skill.range ?? 255) + level * 24) * rangeMultiplier,
      angle: 64 + level * 6,
      maxTargets: 7 + Math.min(6, level),
      originOffset: { x: 36, y: 0 },
    };
    const targets = this.findNormalAttackTargets(player, enemies, attack, facing, null);
    const damage = this.getAdaptationDamage(state, 0.88);

    targets.forEach((enemy, index) => {
      enemy.takeDamage(damage, { from: player.position, strength: 18 + level * 2 });
      this.spawnDamageNumber(effectLayer, enemy, damage, 0xffa05a, (index - 1) * 9);
    });

    this.spawnAdaptationSpriteEffect(state, player, visualTarget, effectLayer, {
      facing,
      distanceRatio: 0.5,
      width: (230 + level * 20) * rangeMultiplier,
      height: (138 + level * 12) * rangeMultiplier,
      duration: 0.44 + level * 0.055,
      color: 0xff6f42,
    });

    return { pattern: state.id, targets, shake: targets.length > 0 ? 1.1 : 0, casted: true };
  }

  getAdaptationDamage(state, multiplier = 1) {
    const base = state.skill.damage ?? 12;
    const level = state.level ?? 1;
    const scaling = state.skill.scaling?.damage ?? 0.12;
    const synergy = this.adaptationSynergyEffects ?? {};
    const damage = base
      * multiplier
      * (1 + (level - 1) * (scaling + 0.035))
      * this.adaptationDamageMultiplier
      * (synergy.damageMultiplier ?? 1);
    const critRate = synergy.critRate ?? 0;
    const critMultiplier = critRate > 0 && Math.random() < critRate
      ? synergy.critDamageMultiplier ?? 1.5
      : 1;

    return Math.max(1, Math.round(damage * critMultiplier));
  }

  performNormalAttack(player, target, enemies, effectLayer) {
    const attack = this.normalAttackDefinition;

    if (!attack) {
      target.takeDamage(this.damage, {
        from: player.position,
        strength: this.knockback,
      });
      this.spawnDamageNumber(effectLayer, target, this.damage, this.effectGlowColor);
      this.applyHitStatuses(target);
      this.spawnSlashEffect(player, target, effectLayer, {
        style: 'normal',
        duration: 0.22,
        scale: 1,
      });

      return { pattern: 'normal', targets: [target], shake: 0 };
    }

    const facing = this.getAttackFacing(player, target);
    const hitTargets = this.findNormalAttackTargets(player, enemies, attack, facing, target);
    const damage = Math.max(1, Math.round(this.damage));
    const knockback = this.knockback;

    hitTargets.forEach((enemy, index) => {
      enemy.takeDamage(damage, {
        from: player.position,
        strength: knockback,
      });
      this.spawnDamageNumber(effectLayer, enemy, damage, this.getNormalAttackColor(attack), (index - (hitTargets.length - 1) / 2) * 12);
      this.applyHitStatuses(enemy);
    });

    this.spawnNormalAttackEffect(player, target, effectLayer, attack, facing);

    return {
      pattern: attack.id,
      targets: hitTargets,
      shake: attack.attackType === NORMAL_ATTACK_HIT_SHAPES.RECTANGLE ? 1.2 : attack.attackType === NORMAL_ATTACK_HIT_SHAPES.CONE ? 2.2 : 0,
    };
  }

  performSpeedAttack(player, target, effectLayer) {
    const hitDamage = Math.max(1, Math.round(this.damage * 0.58));
    const hits = [
      { delay: 0, side: -1 },
      { delay: 0.045, side: 1 },
      { delay: 0.085, side: -0.35 },
    ];

    hits.forEach((hit) => {
      target.takeDamage(hitDamage, {
        from: player.position,
        strength: 7,
      });
      this.spawnDamageNumber(effectLayer, target, hitDamage, this.effectGlowColor, hit.side * 12);
      this.applyHitStatuses(target);
      this.spawnSlashEffect(player, target, effectLayer, {
        style: 'speed',
        duration: 0.16,
        scale: 0.82,
        side: hit.side,
        age: -hit.delay,
        texture: this.evolutionNormalAttackEffectTexture,
        size: this.getEvolutionNormalAttackEffectSize('speed'),
      });
    });

    return { pattern: 'speed', targets: [target], shake: 0 };
  }

  performHuntingAttack(player, enemies, effectLayer) {
    const targets = this.findTargetsInRange(player, enemies, this.targetAcquireRange, 5);
    const hitTargets = targets.length > 0 ? targets : [];

    hitTargets.forEach((enemy) => {
      enemy.takeDamage(Math.max(1, Math.round(this.damage * 0.78)), {
        from: player.position,
        strength: this.knockback,
      });
      this.spawnDamageNumber(effectLayer, enemy, Math.max(1, Math.round(this.damage * 0.78)), this.effectGlowColor);
      this.applyHitStatuses(enemy);
    });

    const visualTarget = hitTargets[0] ?? this.findNearestTarget(player, enemies);
    if (visualTarget) {
      this.facePlayerToTarget(player, visualTarget);
      this.spawnSlashEffect(player, visualTarget, effectLayer, {
        style: 'hunting',
        duration: 0.28,
        scale: 1.45,
        texture: this.evolutionNormalAttackEffectTexture,
        size: this.getEvolutionNormalAttackEffectSize('hunting'),
      });
    }

    return { pattern: 'hunting', targets: hitTargets, shake: 0 };
  }

  performHeavyAttack(player, target, effectLayer) {
    const damage = Math.max(1, Math.round(this.damage * 0.86));
    target.takeDamage(damage, {
      from: player.position,
      strength: this.knockback,
    });
    this.spawnDamageNumber(effectLayer, target, damage, this.effectGlowColor);
    this.applyHitStatuses(target);
    this.spawnSlashEffect(player, target, effectLayer, {
      style: 'attack',
      duration: 0.34,
      scale: 1.22,
      texture: this.evolutionNormalAttackEffectTexture,
      size: this.getEvolutionNormalAttackEffectSize('attack'),
    });
    this.lastImpactShake = 4.2;

    return { pattern: 'attack', targets: [target], shake: this.lastImpactShake };
  }

  findNearestTarget(player, enemies) {
    let nearest = null;
    let nearestDistance = this.targetAcquireRange * this.targetAcquireRange;

    enemies.forEach((enemy) => {
      if (enemy.isDead) {
        return;
      }

      const distance = CollisionSystem.distanceSquared(player.position, enemy.position);

      if (distance < nearestDistance) {
        nearest = enemy;
        nearestDistance = distance;
      }
    });

    return nearest;
  }

  findNearestTargetInRange(player, enemies, range) {
    let nearest = null;
    let nearestDistance = range * range;

    enemies.forEach((enemy) => {
      if (enemy.isDead) {
        return;
      }

      const distance = CollisionSystem.distanceSquared(player.position, enemy.position);

      if (distance < nearestDistance) {
        nearest = enemy;
        nearestDistance = distance;
      }
    });

    return nearest;
  }

  findTargetsInRange(player, enemies, range, limit) {
    return enemies
      .filter((enemy) => !enemy.isDead)
      .map((enemy) => ({
        enemy,
        distance: CollisionSystem.distanceSquared(player.position, enemy.position),
      }))
      .filter((entry) => entry.distance <= range * range)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
      .map((entry) => entry.enemy);
  }

  findNormalAttackTargets(player, enemies, attack, facing, preferredTarget = null) {
    const origin = this.getAttackOrigin(player, attack, facing);
    const maxTargets = attack.maxTargets ?? 1;
    const entries = enemies
      .filter((enemy) => !enemy.isDead)
      .map((enemy) => ({
        enemy,
        score: this.getNormalAttackHitScore(enemy, origin, facing, attack),
      }))
      .filter((entry) => entry.score !== null)
      .sort((a, b) => a.score - b.score);

    if (preferredTarget && !preferredTarget.isDead && !entries.some((entry) => entry.enemy === preferredTarget)) {
      const fallbackScore = CollisionSystem.distanceSquared(player.position, preferredTarget.position);

      if (fallbackScore <= (attack.range + 12) * (attack.range + 12)) {
        entries.unshift({ enemy: preferredTarget, score: fallbackScore });
      }
    }

    return entries.slice(0, maxTargets).map((entry) => entry.enemy);
  }

  getNormalAttackHitScore(enemy, origin, facing, attack) {
    const dx = enemy.position.x - origin.x;
    const dy = enemy.position.y - origin.y;
    const radius = enemy.radius ?? 0;
    const range = attack.range + radius;
    const distance = Math.hypot(dx, dy);

    if (distance > range) {
      return null;
    }

    const forward = dx * facing.x + dy * facing.y;
    const side = dx * -facing.y + dy * facing.x;

    if (attack.attackType === NORMAL_ATTACK_HIT_SHAPES.RECTANGLE) {
      const width = (attack.width ?? 56) / 2 + radius;

      if (forward < -radius || forward > range || Math.abs(side) > width) {
        return null;
      }

      return forward * forward + Math.abs(side) * 12;
    }

    if (attack.attackType === NORMAL_ATTACK_HIT_SHAPES.ARC || attack.attackType === NORMAL_ATTACK_HIT_SHAPES.CONE) {
      const angle = ((attack.angle ?? 70) * Math.PI) / 180;
      const cosLimit = Math.cos(angle / 2);
      const normalizedForward = distance <= 0.001 ? 1 : forward / distance;

      if (normalizedForward < cosLimit) {
        return null;
      }

      return distance * distance + Math.abs(side) * 8;
    }

    if (attack.attackType === NORMAL_ATTACK_HIT_SHAPES.CIRCLE) {
      return distance * distance;
    }

    return null;
  }

  getAttackFacing(player, target) {
    const dx = target.position.x - player.position.x;
    const dy = target.position.y - player.position.y;
    const distance = Math.max(Math.hypot(dx, dy), 1);

    return {
      x: dx / distance,
      y: dy / distance,
    };
  }

  getPlayerForwardFacing(player) {
    const velocity = player?.targetVelocity ?? player?.velocity ?? { x: 0, y: 0 };
    const velocityDistance = Math.hypot(velocity.x ?? 0, velocity.y ?? 0);

    if (velocityDistance > 0.001) {
      return {
        x: velocity.x / velocityDistance,
        y: velocity.y / velocityDistance,
      };
    }

    const facing = player?.facing ?? { x: 1, y: 0 };
    const distance = Math.hypot(facing.x ?? 0, facing.y ?? 0);

    if (distance > 0.001) {
      return {
        x: facing.x / distance,
        y: facing.y / distance,
      };
    }

    return { x: 1, y: 0 };
  }

  createFacingTarget(player, facing, distance = 150) {
    return {
      position: {
        x: player.position.x + facing.x * distance,
        y: player.position.y + facing.y * distance,
      },
    };
  }

  getSpreadDirections(facing, count, spreadRadians) {
    const baseAngle = Math.atan2(facing.y, facing.x);
    const middle = (count - 1) / 2;

    return Array.from({ length: count }, (_, index) => {
      const offset = count <= 1 ? 0 : (index - middle) * (spreadRadians / Math.max(1, count - 1));
      const angle = baseAngle + offset;

      return {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
    });
  }

  getAttackOrigin(player, attack, facing) {
    const offset = attack.originOffset ?? { x: 0, y: 0 };

    return {
      x: player.position.x + facing.x * (offset.x ?? 0) + -facing.y * (offset.y ?? 0),
      y: player.position.y + facing.y * (offset.x ?? 0) + facing.x * (offset.y ?? 0),
    };
  }

  facePlayerToTarget(player, target) {
    const dx = target.position.x - player.position.x;
    const dy = target.position.y - player.position.y;
    const distance = Math.max(Math.hypot(dx, dy), 1);

    player.facing.x += (dx / distance - player.facing.x) * 0.68;
    player.facing.y += (dy / distance - player.facing.y) * 0.68;
  }

  spawnSlashEffect(player, target, effectLayer, options = {}) {
    const duration = options.duration ?? 0.22;
    const scale = options.scale ?? 1;
    const texture = options.texture ?? null;
    const size = options.size ?? { width: 128, height: 94 };
    const effect = {
      age: options.age ?? 0,
      duration: this.simpleEffects ? Math.min(duration, 0.16) : duration,
      style: options.style ?? this.attackPattern,
      scale: this.simpleEffects ? scale * 0.78 : scale,
      side: options.side ?? 0,
      sprite: Boolean(texture),
      baseWidth: size.width,
      baseHeight: size.height,
      view: texture ? new Sprite(texture) : new Graphics(),
    };
    const x = player.position.x + (target.position.x - player.position.x) * 0.62;
    const y = player.position.y + (target.position.y - player.position.y) * 0.62;
    const angle = Math.atan2(target.position.y - player.position.y, target.position.x - player.position.x);

    if (texture) {
      effect.view.anchor.set(0.5);
      effect.view.width = size.width;
      effect.view.height = size.height;
      effect.view.alpha = 0;
    }

    effect.view.position.set(x, y + effect.side * 8);
    effect.view.rotation = angle;
    effectLayer.addChild(effect.view);
    this.effects.push(effect);
  }

  spawnNormalAttackEffect(player, target, effectLayer, attack, facing) {
    const texture = this.evolutionNormalAttackEffectTexture
      ?? (this.normalAttackEffectKey === attack.effectKey ? this.normalAttackEffectTexture : null);
    const origin = this.getAttackOrigin(player, attack, facing);
    const distance = attack.range * (attack.effectOffset ?? 0.55);
    const x = origin.x + facing.x * distance;
    const y = origin.y + facing.y * distance;
    const angle = Math.atan2(facing.y, facing.x);
    const duration = attack.effectDuration ?? 0.22;
    const size = this.evolutionNormalAttackEffectTexture
      ? this.getEvolutionNormalAttackEffectSize(this.attackPattern)
      : (attack.effectSize ?? { width: 112, height: 92 });

    if (texture) {
      const sprite = new Sprite(texture);
      const effect = {
        age: 0,
        duration: this.simpleEffects ? Math.min(duration, 0.18) : duration,
        style: attack.id,
        scale: this.simpleEffects ? 0.78 : 1,
        side: 0,
        sprite: true,
        baseWidth: size.width,
        baseHeight: size.height,
        view: sprite,
      };

      sprite.anchor.set(0.5);
      sprite.position.set(x, y);
      sprite.rotation = angle;
      sprite.width = size.width;
      sprite.height = size.height;
      sprite.alpha = 0;
      effectLayer.addChild(sprite);
      this.effects.push(effect);
      return;
    }

    const visualTarget = {
      position: {
        x: origin.x + facing.x * attack.range,
        y: origin.y + facing.y * attack.range,
      },
    };

    this.spawnSlashEffect(player, visualTarget, effectLayer, {
      style: attack.id,
      duration,
      scale: attack.attackType === NORMAL_ATTACK_HIT_SHAPES.CONE ? 1.35 : attack.attackType === NORMAL_ATTACK_HIT_SHAPES.RECTANGLE ? 1.18 : 0.95,
    });
  }

  spawnAdaptationSpriteEffect(state, player, target, effectLayer, options = {}) {
    const facing = options.facing ?? this.getAttackFacing(player, target);
    const distanceRatio = options.distanceRatio ?? 0.55;
    const sideOffset = options.sideOffset ?? 0;
    const x = player.position.x + (target.position.x - player.position.x) * distanceRatio + -facing.y * sideOffset;
    const y = player.position.y + (target.position.y - player.position.y) * distanceRatio + facing.x * sideOffset;
    const angle = Math.atan2(facing.y, facing.x);
    const duration = options.duration ?? 0.24;

    const texture = options.texture ?? this.getAdaptationTexture(state);
    if (texture) {
      const sprite = new Sprite(texture);
      const effect = {
        age: 0,
        duration: this.simpleEffects ? Math.min(duration, 0.18) : duration,
        style: state.id,
        scale: this.simpleEffects ? 0.78 : 1,
        side: 0,
        sprite: true,
        baseWidth: options.width ?? 128,
        baseHeight: options.height ?? 90,
        view: sprite,
      };

      sprite.anchor.set(0.5);
      sprite.position.set(x, y);
      sprite.rotation = angle;
      sprite.width = effect.baseWidth;
      sprite.height = effect.baseHeight;
      sprite.alpha = 0;
      effectLayer.addChild(sprite);
      this.effects.push(effect);
      return;
    }

    const visualTarget = {
      position: {
        x: player.position.x + facing.x * 110,
        y: player.position.y + facing.y * 110,
      },
    };

    const previousColor = this.effectColor;
    const previousGlow = this.effectGlowColor;
    this.effectColor = options.color ?? previousColor;
    this.effectGlowColor = options.color ?? previousGlow;
    this.spawnSlashEffect(player, visualTarget, effectLayer, {
      style: state.id,
      duration,
      scale: state.id === 'shock_roar_wave' ? 1.35 : 1,
    });
    this.effectColor = previousColor;
    this.effectGlowColor = previousGlow;
  }

  spawnHomingFangProjectile(state, player, target, effectLayer, index = 0) {
    const level = state.level ?? 1;
    const angle = Math.atan2(target.position.y - player.position.y, target.position.x - player.position.x);
    const side = index - 0.5;
    const startX = player.position.x + Math.cos(angle) * 22 + Math.cos(angle + Math.PI / 2) * side * 22;
    const startY = player.position.y + Math.sin(angle) * 22 + Math.sin(angle + Math.PI / 2) * side * 22;
    const damage = this.getAdaptationDamage(state, 1);
    const texture = state.texture ?? null;
    const view = texture ? new Sprite(texture) : new Graphics();

    if (texture) {
      view.anchor.set(0.5);
      view.width = 58 + level * 4;
      view.height = 38 + level * 3;
      view.alpha = 0.88;
    }

    view.position.set(startX, startY);
    view.rotation = angle;
    effectLayer.addChild(view);
    this.projectiles.push({
      style: state.id,
      state,
      target,
      effectLayer,
      view,
      texture: Boolean(texture),
      age: 0,
      duration: 1.15 + level * 0.05,
      speed: 145 + level * 16,
      damage,
      color: 0xffd36b,
      hitRadius: (18 + level * 2) * this.getAdaptationRangeMultiplier(),
    });
  }

  spawnDelayedBurstProjectile(state, player, effectLayer, options = {}) {
    const level = state.level ?? 1;
    const texture = this.getAdaptationTexture(state);
    const view = texture ? new Sprite(texture) : new Graphics();

    if (texture) {
      view.anchor.set(0.5);
      view.width = 42 + level * 4;
      view.height = 42 + level * 4;
      view.alpha = 0.72;
    }

    view.position.set(options.x, options.y);
    effectLayer.addChild(view);
    this.projectiles.push({
      kind: 'delayedBurst',
      style: state.id,
      state,
      effectLayer,
      view,
      texture: Boolean(texture),
      explosionTexture: this.getAdaptationTexture(state, 'explosion'),
      baseWidth: texture ? view.width : 0,
      baseHeight: texture ? view.height : 0,
      age: 0,
      duration: options.delay ?? 0.42,
      radius: options.radius ?? 58,
      damage: this.getAdaptationDamage(state, 1.08),
      color: 0xff8a4a,
      knockback: 20 + level * 2,
    });
  }

  spawnSenseSpikeTrap(state, effectLayer, options = {}) {
    const level = state.level ?? 1;
    const texture = this.getAdaptationTexture(state);
    const view = texture ? new Sprite(texture) : new Graphics();

    if (texture) {
      view.anchor.set(0.5);
      view.width = options.radius * 1.82;
      view.height = options.radius * 1.82;
      view.alpha = 0.74;
    }

    view.position.set(options.x, options.y);
    effectLayer.addChild(view);
    this.projectiles.push({
      kind: 'senseSpikeTrap',
      style: state.id,
      state,
      effectLayer,
      view,
      texture: Boolean(texture),
      triggerTexture: this.getAdaptationTexture(state, 'trigger'),
      baseWidth: texture ? view.width : 0,
      baseHeight: texture ? view.height : 0,
      age: -(options.delay ?? 0),
      duration: options.duration ?? 1.35,
      radius: options.radius ?? 54,
      damage: this.getAdaptationDamage(state, 0.92),
      color: 0xffc94d,
      knockback: 11 + level,
      maxTargets: 2,
    });
  }

  updateProjectiles(delta) {
    if (this.projectiles.length === 0) {
      return;
    }

    this.projectiles = this.projectiles.filter((projectile) => {
      projectile.age += delta;

      if (projectile.kind === 'senseSpikeTrap') {
        if (projectile.age < 0) {
          projectile.view.alpha = 0;
          return true;
        }

        const progress = Math.min(1, projectile.age / projectile.duration);
        if (projectile.texture) {
          const pulse = 0.9 + Math.sin(progress * Math.PI * 3) * 0.08;
          projectile.view.alpha = 0.48 + (1 - progress) * 0.3;
          projectile.view.width = projectile.baseWidth * pulse;
          projectile.view.height = projectile.baseHeight * pulse;
        } else {
          projectile.view
            .clear()
            .circle(0, 0, projectile.radius)
            .stroke({ color: projectile.color, width: 2, alpha: 0.34 + (1 - progress) * 0.18 })
            .circle(0, 0, projectile.radius * 0.34)
            .stroke({ color: 0xffdf8a, width: 1.5, alpha: 0.24 + (1 - progress) * 0.18 });
        }

        const hitTargets = this.findEnemiesInCircle(projectile.view.position, projectile.radius, projectile.maxTargets);
        if (hitTargets.length === 0 && projectile.age < projectile.duration) {
          return true;
        }

        const targets = hitTargets.length > 0
          ? this.damageSpecificEnemies(projectile.effectLayer, hitTargets, projectile.view.position, projectile.damage, {
            color: projectile.color,
            knockback: projectile.knockback,
          })
          : [];
        this.spawnAdaptationAreaEffect(projectile.state, { position: projectile.view.position }, projectile.effectLayer, {
          texture: projectile.triggerTexture,
          width: projectile.radius * 2.1,
          height: projectile.radius * 2.1,
          duration: 0.24,
          color: projectile.color,
        });
        projectile.view.destroy();
        this.lastImpactShake = Math.max(this.lastImpactShake, targets.length > 0 ? 0.45 : 0);
        return false;
      }

      if (projectile.kind === 'delayedBurst') {
        const progress = Math.min(1, projectile.age / projectile.duration);
        if (projectile.texture) {
          const pulse = 0.84 + Math.sin(progress * Math.PI) * 0.18;
          projectile.view.alpha = 0.62 + progress * 0.24;
          projectile.view.width = projectile.baseWidth * pulse;
          projectile.view.height = projectile.baseHeight * pulse;
          projectile.view.rotation += delta * (0.8 + progress * 1.2);
        } else {
          projectile.view
            .clear()
            .circle(0, 0, projectile.radius * (0.45 + progress * 0.42))
            .stroke({ color: projectile.color, width: 2, alpha: 0.28 + progress * 0.28 })
            .circle(0, 0, 5 + progress * 9)
            .fill({ color: projectile.color, alpha: 0.16 + progress * 0.16 });
        }

        const contactTargets = this.findEnemiesInCircle(projectile.view.position, projectile.radius * 0.72, 1);
        if (projectile.age < projectile.duration && contactTargets.length === 0) {
          return true;
        }

        const hitTargets = this.damageEnemiesInCircle(projectile.effectLayer, projectile.view.position, projectile.radius, projectile.damage, {
          color: projectile.color,
          knockback: projectile.knockback,
          maxTargets: 6,
        });
        this.spawnAdaptationAreaEffect(projectile.state, { position: projectile.view.position }, projectile.effectLayer, {
          texture: projectile.explosionTexture,
          width: projectile.radius * 2.4,
          height: projectile.radius * 2.4,
          duration: 0.24,
          color: projectile.color,
        });
        projectile.view.destroy();
        this.lastImpactShake = Math.max(this.lastImpactShake, hitTargets.length > 0 ? 1.1 : 0);
        return false;
      }

      if (projectile.age >= projectile.duration || projectile.target?.isDead) {
        projectile.view.destroy();
        return false;
      }

      const dx = projectile.target.position.x - projectile.view.position.x;
      const dy = projectile.target.position.y - projectile.view.position.y;
      const distance = Math.max(Math.hypot(dx, dy), 0.001);
      const move = Math.min(distance, projectile.speed * delta);
      const nx = dx / distance;
      const ny = dy / distance;

      projectile.view.position.x += nx * move;
      projectile.view.position.y += ny * move;
      projectile.view.rotation = Math.atan2(ny, nx);

      if (!projectile.texture) {
        const fade = Math.max(0.2, 1 - projectile.age / projectile.duration);
        projectile.view
          .clear()
          .moveTo(-18, -7)
          .lineTo(20, 0)
          .lineTo(-18, 7)
          .stroke({ color: projectile.color, width: 3, alpha: 0.78 * fade })
          .circle(-12, 0, 4)
          .fill({ color: projectile.color, alpha: 0.34 * fade });
      }

      if (distance <= projectile.hitRadius + (projectile.target.radius ?? 0)) {
        projectile.target.takeDamage(projectile.damage, {
          from: projectile.view.position,
          strength: 12 + (projectile.state.level ?? 1),
        });
        this.spawnDamageNumber(projectile.effectLayer, projectile.target, projectile.damage, projectile.color);
        this.spawnAdaptationSpriteEffect(projectile.state, {
          position: {
            x: projectile.view.position.x - nx * 20,
            y: projectile.view.position.y - ny * 20,
          },
        }, projectile.target, projectile.effectLayer, {
          facing: { x: nx, y: ny },
          distanceRatio: 0.88,
          width: 74,
          height: 52,
          duration: 0.16,
          color: projectile.color,
        });
        projectile.view.destroy();
        return false;
      }

      return true;
    });
  }

  damageEnemiesInCircle(effectLayer, center, radius, damage, options = {}) {
    const targets = [];
    const enemies = this.currentEnemies ?? [];
    const maxTargets = options.maxTargets ?? 99;

    enemies.forEach((enemy) => {
      if (enemy.isDead || targets.length >= maxTargets) {
        return;
      }

      const dx = enemy.position.x - center.x;
      const dy = enemy.position.y - center.y;
      const hitRadius = radius + (enemy.radius ?? 0);

      if (dx * dx + dy * dy > hitRadius * hitRadius) {
        return;
      }

      targets.push(enemy);
      enemy.takeDamage(damage, { from: center, strength: options.knockback ?? 10 });
      this.spawnDamageNumber(effectLayer, enemy, damage, options.color ?? 0xffd36b, (targets.length - 2) * 8);
    });

    return targets;
  }

  findEnemiesInCircle(center, radius, maxTargets = 99) {
    const targets = [];
    const enemies = this.currentEnemies ?? [];

    enemies.forEach((enemy) => {
      if (enemy.isDead || targets.length >= maxTargets) {
        return;
      }

      const dx = enemy.position.x - center.x;
      const dy = enemy.position.y - center.y;
      const hitRadius = radius + (enemy.radius ?? 0);

      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        targets.push(enemy);
      }
    });

    return targets;
  }

  damageSpecificEnemies(effectLayer, enemies, origin, damage, options = {}) {
    const targets = [];

    enemies.forEach((enemy, index) => {
      if (enemy.isDead) {
        return;
      }

      targets.push(enemy);
      enemy.takeDamage(damage, { from: origin, strength: options.knockback ?? 10 });
      this.spawnDamageNumber(effectLayer, enemy, damage, options.color ?? 0xffd36b, (index - (enemies.length - 1) / 2) * 8);
    });

    return targets;
  }

  spawnAdaptationAreaEffect(state, player, effectLayer, options = {}) {
    const duration = options.duration ?? 0.36;
    const texture = options.texture ?? this.getAdaptationTexture(state);

    if (texture) {
      const sprite = new Sprite(texture);
      const effect = {
        age: 0,
        duration: this.simpleEffects ? Math.min(duration, 0.2) : duration,
        style: state.id,
        scale: this.simpleEffects ? 0.72 : 1,
        side: 0,
        sprite: true,
        baseWidth: options.width ?? 160,
        baseHeight: options.height ?? 160,
        view: sprite,
      };

      sprite.anchor.set(0.5);
      sprite.position.set(player.position.x, player.position.y);
      sprite.rotation = options.rotation ?? 0;
      sprite.width = effect.baseWidth;
      sprite.height = effect.baseHeight;
      sprite.alpha = 0;
      effectLayer.addChild(sprite);
      this.effects.push(effect);
      return;
    }

    const effect = {
      age: 0,
      duration: this.simpleEffects ? Math.min(duration, 0.2) : duration,
      style: state.id,
      scale: this.simpleEffects ? 0.72 : 1,
      side: 0,
      area: true,
      color: options.color ?? 0x52e4ff,
      baseWidth: options.width ?? 160,
      baseHeight: options.height ?? 160,
      view: new Graphics(),
    };

    effect.view.position.set(player.position.x, player.position.y);
    effectLayer.addChild(effect.view);
    this.effects.push(effect);
  }

  updateEffects(delta) {
    this.updateDamageNumbers(delta);
    this.effects = this.effects.filter((effect) => {
      effect.age += delta;
      if (effect.age < 0) {
        effect.view.alpha = 0;
        return true;
      }

      effect.view.alpha = 1;
      const progress = effect.age / effect.duration;

      if (progress >= 1) {
        effect.view.destroy();
        return false;
      }

      if (effect.sprite) {
        const fade = 1 - progress;
        const pop = 0.82 + Math.sin(Math.min(progress, 1) * Math.PI) * 0.2;
        effect.view.alpha = Math.min(0.82, fade * 1.12);
        effect.view.width = effect.baseWidth * effect.scale * pop;
        effect.view.height = effect.baseHeight * effect.scale * pop;
        return true;
      }

      if (effect.area) {
        effect.view.clear();
        const fade = 1 - progress;
        const radiusX = (effect.baseWidth / 2) * (0.82 + progress * 0.24);
        const radiusY = (effect.baseHeight / 2) * (0.82 + progress * 0.24);
        effect.view
          .ellipse(0, 0, radiusX, radiusY)
          .stroke({ color: effect.color, width: 3 * fade, alpha: 0.5 * fade })
          .ellipse(0, 0, radiusX * 0.62, radiusY * 0.62)
          .stroke({ color: 0xb8fbff, width: 1.5, alpha: 0.36 * fade });
        return true;
      }

      this.drawEffect(effect, progress);

      return true;
    });
  }

  spawnDamageNumber(effectLayer, target, amount, color = 0xfff0b0, offsetX = 0) {
    if (!this.damageNumbersEnabled) {
      return;
    }

    const text = new Text({
      text: `${amount}`,
      style: {
        fill: `#${color.toString(16).padStart(6, '0')}`,
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: target.isBoss ? 18 : 13,
        fontWeight: '800',
        stroke: { color: '#140708', width: 3 },
        letterSpacing: 0,
      },
    });
    const number = {
      age: 0,
      duration: 0.42,
      view: text,
      startY: target.position.y - (target.isBoss ? 72 : 42),
      driftX: offsetX + (Math.random() - 0.5) * 10,
    };

    text.anchor.set(0.5);
    text.position.set(target.position.x + number.driftX, number.startY);
    effectLayer.addChild(text);
    this.damageNumbers.push(number);
  }

  updateDamageNumbers(delta) {
    this.damageNumbers = this.damageNumbers.filter((number) => {
      number.age += delta;
      const progress = number.age / number.duration;

      if (progress >= 1) {
        number.view.destroy();
        return false;
      }

      number.view.y = number.startY - progress * 28;
      number.view.alpha = 1 - progress;
      number.view.scale.set(1 + progress * 0.18);
      return true;
    });
  }

  drawEffect(effect, progress) {
    const fade = 1 - progress;
    const scale = effect.scale;

    effect.view.clear();

    if (this.simpleEffects) {
      effect.view
        .moveTo(-22 * scale, -7 * scale)
        .quadraticCurveTo(2 * scale, -18 * scale, 28 * scale, -3 * scale)
        .stroke({ color: this.effectColor, width: 2 * this.effectWeight, alpha: 0.58 * fade });
      return;
    }

    if (effect.style === 'raptorClaw') {
      effect.view
        .moveTo(-30 * scale, -8 * scale)
        .quadraticCurveTo(0, -22 * scale, 42 * scale, -4 * scale)
        .stroke({ color: 0xb8fbff, width: 3.2 * fade, alpha: 0.82 * fade })
        .moveTo(-24 * scale, 7 * scale)
        .quadraticCurveTo(4 * scale, 18 * scale, 34 * scale, 4 * scale)
        .stroke({ color: 0x35d7ff, width: 2.1, alpha: 0.74 * fade });
      return;
    }

    if (effect.style === 'triceratopsHornImpact') {
      effect.view
        .moveTo(-48 * scale, 0)
        .lineTo(46 * scale, 0)
        .stroke({ color: 0xffd46a, width: 5 * fade, alpha: 0.7 * fade })
        .ellipse(28 * scale, 0, 28 * scale * progress, 18 * scale * progress)
        .stroke({ color: 0x8fffe1, width: 3 * fade, alpha: 0.48 * fade })
        .circle(8 * scale, -12 * scale, 4 * fade)
        .fill({ color: 0xffd46a, alpha: 0.38 * fade });
      return;
    }

    if (effect.style === 'trexBiteShock') {
      effect.view
        .moveTo(-26 * scale, -15 * scale)
        .quadraticCurveTo(4 * scale, -35 * scale, 42 * scale, -8 * scale)
        .stroke({ color: 0xffc47a, width: 5.5 * fade, alpha: 0.74 * fade })
        .moveTo(-20 * scale, 14 * scale)
        .quadraticCurveTo(6 * scale, 26 * scale, 36 * scale, 6 * scale)
        .stroke({ color: 0xff4d38, width: 3.2, alpha: 0.76 * fade })
        .circle(8 * scale, 0, 34 * scale * progress)
        .stroke({ color: 0xff6a3a, width: 2 * fade, alpha: 0.34 * fade });
      return;
    }

    if (effect.style === 'speed') {
      effect.view
        .moveTo(-30 * scale, -7 * scale)
        .quadraticCurveTo(2 * scale, -23 * scale, 42 * scale, -4 * scale)
        .stroke({ color: this.effectGlowColor, width: 2.4 * fade, alpha: 0.78 * fade })
        .moveTo(-22 * scale, 8 * scale)
        .quadraticCurveTo(4 * scale, 17 * scale, 34 * scale, 4 * scale)
        .stroke({ color: this.effectColor, width: 1.7, alpha: 0.72 * fade })
        .moveTo(-42 * scale, 0)
        .lineTo(-62 * scale, 4 * scale)
        .stroke({ color: this.effectColor, width: 1.2, alpha: 0.35 * fade });
      return;
    }

    if (effect.style === 'hunting') {
      effect.view
        .arc(0, 0, 55 * scale, -1.9, 0.55)
        .stroke({ color: this.effectGlowColor, width: 4.6 * this.effectWeight * fade, alpha: 0.72 * fade })
        .arc(0, 0, 39 * scale, -1.65, 0.35)
        .stroke({ color: this.effectColor, width: 2.1 * this.effectWeight, alpha: 0.62 * fade })
        .circle(36 * scale, -18 * scale, 3.2 * fade)
        .fill({ color: this.effectGlowColor, alpha: 0.52 * fade });
      return;
    }

    if (effect.style === 'attack') {
      effect.view
        .moveTo(-34 * scale, -13 * scale)
        .quadraticCurveTo(5 * scale, -34 * scale, 46 * scale, -6 * scale)
        .stroke({ color: this.effectGlowColor, width: 6.4 * this.effectWeight * fade, alpha: 0.78 * fade })
        .moveTo(-26 * scale, 10 * scale)
        .quadraticCurveTo(6 * scale, 26 * scale, 38 * scale, 6 * scale)
        .stroke({ color: this.effectColor, width: 3.5 * this.effectWeight, alpha: 0.78 * fade })
        .circle(10 * scale, 0, 28 * scale * progress)
        .stroke({ color: this.effectColor, width: 2.2 * fade, alpha: 0.34 * fade });
      return;
    }

    effect.view
      .moveTo(-24, -10)
      .quadraticCurveTo(4, -25, 35, -5)
      .moveTo(-16, 8)
      .quadraticCurveTo(8, 19, 28, 7)
      .stroke({
        color: this.effectGlowColor,
        width: 4 * this.effectWeight * fade,
        alpha: 0.82 * fade,
      })
      .stroke({
        color: this.effectColor,
        width: 2.1 * this.effectWeight,
        alpha: 0.72 * fade,
      });
  }

  getNormalAttackColor(attack) {
    if (attack.id === 'raptorClaw') {
      return 0xb8fbff;
    }

    if (attack.id === 'triceratopsHornImpact') {
      return 0xffd46a;
    }

    if (attack.id === 'trexBiteShock') {
      return 0xff9a62;
    }

    return this.effectGlowColor;
  }

  getEvolutionNormalAttackEffectSize(pattern = this.attackPattern) {
    const id = this.evolutionNormalAttackEffectId ?? '';

    if (id.includes('triceratops_zero')) {
      return { width: 178, height: 126 };
    }

    if (id.includes('triceratops_speed')) {
      return { width: 176, height: 112 };
    }

    if (id.includes('triceratops')) {
      return { width: 158, height: 124 };
    }

    if (id.includes('tyrannosaurus_zero')) {
      return { width: 172, height: 132 };
    }

    if (id.includes('tyrannosaurus')) {
      return { width: pattern === 'speed' ? 150 : 164, height: 124 };
    }

    if (id.includes('velociraptor_zero')) {
      return { width: 148, height: 112 };
    }

    if (id.includes('velociraptor')) {
      return { width: pattern === 'attack' ? 138 : 126, height: 96 };
    }

    if (pattern === 'zero') {
      return { width: 154, height: 118 };
    }

    if (pattern === 'attack') {
      return { width: 150, height: 118 };
    }

    if (pattern === 'hunting') {
      return { width: 146, height: 114 };
    }

    return { width: 128, height: 96 };
  }
}
