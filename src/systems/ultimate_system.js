import { Graphics, Rectangle, Sprite, Texture } from 'pixi.js';
import { ASSET_KEYS } from '../data/asset_manifest.js';
import { CollisionSystem } from './collision_system.js';

const ULTIMATES = {
  speed: {
    name: '高速爪撃',
    duration: 1.35,
    color: 0x35d7ff,
    glow: 0xb8fbff,
    radius: 220,
    tickInterval: 0.16,
    damage: 20,
    knockback: 26,
    maxTargets: 5,
    bossDamageMultiplier: 0.45,
    shake: 2.6,
  },
  hunting: {
    name: '追尾狩猟',
    duration: 1.55,
    color: 0xffc94d,
    glow: 0xffefb0,
    radius: 340,
    damage: 24,
    knockback: 38,
    maxTargets: 7,
    bossDamageMultiplier: 0.55,
    shake: 3.2,
  },
  attack: {
    name: '衝撃咆哮',
    duration: 1.42,
    color: 0xff4d38,
    glow: 0xffc1a0,
    range: 330,
    width: -0.06,
    damage: 76,
    knockback: 128,
    bossDamageMultiplier: 0.42,
    shake: 5.2,
  },
  triceratops_speed: {
    name: 'ホーンラッシュ',
    behavior: 'charge',
    duration: 1.25,
    color: 0x35d7ff,
    glow: 0xc6fbff,
    range: 360,
    width: 96,
    damage: 46,
    knockback: 126,
    maxTargets: 10,
    bossDamageMultiplier: 0.38,
    shake: 4.2,
    effectTexture: 'triceratopsSpeed',
  },
  triceratops_hunting: {
    name: 'バスティオンホーン',
    behavior: 'bastion',
    duration: 1.7,
    color: 0xffc94d,
    glow: 0xffefb0,
    radius: 250,
    tickInterval: 0.32,
    damage: 26,
    knockback: 72,
    maxTargets: 13,
    bossDamageMultiplier: 0.5,
    shake: 3.4,
    effectTexture: 'triceratopsHunting',
  },
  triceratops_attack: {
    name: 'クエイクラム',
    behavior: 'quake',
    duration: 1.55,
    color: 0xff5b35,
    glow: 0xffc1a0,
    radius: 330,
    damage: 82,
    knockback: 156,
    maxTargets: 18,
    bossDamageMultiplier: 0.4,
    shake: 5.6,
    effectTexture: 'triceratopsAttack',
  },
  tyrannosaurus_speed: {
    name: 'プレデターダッシュ',
    behavior: 'pounce',
    duration: 1.2,
    color: 0x35d7ff,
    glow: 0xb8fbff,
    range: 330,
    width: 82,
    damage: 58,
    knockback: 104,
    maxTargets: 8,
    bossDamageMultiplier: 0.42,
    shake: 4.4,
    effectTexture: 'tyrannosaurusSpeed',
  },
  tyrannosaurus_hunting: {
    name: 'テラーハント',
    behavior: 'terrorHunt',
    duration: 1.65,
    color: 0xffc94d,
    glow: 0xffefb0,
    radius: 380,
    damage: 30,
    knockback: 48,
    maxTargets: 8,
    bossDamageMultiplier: 0.52,
    shake: 3.7,
    effectTexture: 'tyrannosaurusHunting',
  },
  tyrannosaurus_attack: {
    name: 'デヴァウアバースト',
    behavior: 'devour',
    duration: 1.48,
    color: 0xff4d38,
    glow: 0xffc1a0,
    radius: 310,
    damage: 94,
    knockback: 170,
    maxTargets: 16,
    bossDamageMultiplier: 0.38,
    shake: 6.0,
    effectTexture: 'tyrannosaurusAttack',
  },
  tyrannosaurus_zero: {
    name: 'オメガバースト',
    behavior: 'omegaBurst',
    duration: 1.72,
    color: 0xb94dff,
    glow: 0xf4e7ff,
    radius: 390,
    beamRange: 480,
    damage: 126,
    beamDamage: 64,
    knockback: 204,
    maxTargets: 24,
    bossDamageMultiplier: 0.48,
    shake: 6.6,
    effectTexture: 'tyrannosaurusZero',
  },
  velociraptor_zero: {
    name: 'アビスラッシュ',
    behavior: 'abyssSlash',
    duration: 1.58,
    color: 0x8f39ff,
    glow: 0xe8fbff,
    radius: 326,
    dashRange: 400,
    damage: 84,
    finisherDamage: 102,
    knockback: 132,
    maxTargets: 18,
    bossDamageMultiplier: 0.5,
    shake: 5.8,
    effectTexture: 'velociraptorZero',
  },
  triceratops_zero: {
    name: '\u30a4\u30b0\u30cb\u30b9\u30c1\u30e3\u30fc\u30b8',
    behavior: 'ignisCharge',
    duration: 1.68,
    color: 0xff6f35,
    glow: 0xf8e8ff,
    range: 450,
    width: 136,
    radius: 350,
    damage: 100,
    impactDamage: 120,
    knockback: 196,
    maxTargets: 22,
    bossDamageMultiplier: 0.48,
    shake: 6.2,
    effectTexture: 'triceratopsZero',
  },
  spinosaurus_speed: {
    name: 'タイダルラッシュ',
    behavior: 'charge',
    duration: 1.3,
    color: 0x2fdfff,
    glow: 0xd8fbff,
    range: 340,
    width: 108,
    damage: 42,
    knockback: 96,
    maxTargets: 12,
    bossDamageMultiplier: 0.4,
    shake: 3.8,
    effectTexture: 'spinosaurusSpeed',
  },
  spinosaurus_hunting: {
    name: 'メイルストローム',
    behavior: 'bastion',
    duration: 1.85,
    color: 0x3bd8ff,
    glow: 0xe0fbff,
    radius: 270,
    tickInterval: 0.28,
    damage: 28,
    knockback: 58,
    maxTargets: 16,
    bossDamageMultiplier: 0.48,
    shake: 3.8,
    effectTexture: 'spinosaurusHunting',
  },
  spinosaurus_attack: {
    name: 'ハイドロブレイク',
    duration: 1.55,
    color: 0x38bfff,
    glow: 0xf0fdff,
    range: 390,
    width: 0.12,
    damage: 84,
    knockback: 140,
    bossDamageMultiplier: 0.42,
    shake: 5.2,
    effectTexture: 'spinosaurusAttack',
  },
  spinosaurus_zero: {
    name: 'アビサルタイド',
    behavior: 'omegaBurst',
    duration: 1.8,
    color: 0x276dff,
    glow: 0xe7fbff,
    radius: 420,
    beamRange: 470,
    damage: 120,
    beamDamage: 60,
    knockback: 190,
    maxTargets: 26,
    bossDamageMultiplier: 0.5,
    shake: 6.2,
    effectTexture: 'spinosaurusZero',
    coreStyle: 'spinoCore',
    burstStyle: 'spinoTide',
    beamStyle: 'spinoBurst',
  },
};

const ND06_NEW_DINO_ULTIMATES = [
  ['ankylosaurus_speed', '装甲ローリング', 'speed'],
  ['ankylosaurus_hunting', '振動索敵', 'hunting'],
  ['ankylosaurus_attack', 'クレータークラブ', 'attack'],
  ['ankylosaurus_zero', 'ゼロバンカー', 'zero'],
  ['parasaurolophus_speed', 'パルスステップ', 'speed'],
  ['parasaurolophus_hunting', 'エコースキャン', 'hunting'],
  ['parasaurolophus_attack', 'ハーモニックバースト', 'attack'],
  ['parasaurolophus_zero', 'ゼロレゾナンス', 'zero'],
  ['stegosaurus_speed', 'レールチャージ', 'speed'],
  ['stegosaurus_hunting', 'プレートセンサー', 'hunting'],
  ['stegosaurus_attack', 'プレートクエイク', 'attack'],
  ['stegosaurus_zero', 'ゼロプレートウェーブ', 'zero'],
  ['pteranodon_speed', 'レイザーウィング', 'speed'],
  ['pteranodon_hunting', 'スカイマーカー', 'hunting'],
  ['pteranodon_attack', 'ゲイルランス', 'attack'],
  ['pteranodon_zero', 'ゼロスカイリフト', 'zero'],
  ['compsognathus_speed', 'ラッシュパック', 'speed'],
  ['compsognathus_hunting', 'パックマーク', 'hunting'],
  ['compsognathus_attack', 'フレンジースウォーム', 'attack'],
  ['compsognathus_zero', 'ゼロスウォーム', 'zero'],
  ['ornithomimus_speed', 'ハイパーラン', 'speed'],
  ['ornithomimus_hunting', 'ルートスキャン', 'hunting'],
  ['ornithomimus_attack', 'スプリントブレイク', 'attack'],
  ['ornithomimus_zero', 'ゼロアクセル', 'zero'],
];

function toCamelBranchKey(id = '') {
  return id.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

ND06_NEW_DINO_ULTIMATES.forEach(([id, name, tag]) => {
  const base = tag === 'zero' ? ULTIMATES.spinosaurus_zero : ULTIMATES[tag];
  ULTIMATES[id] = {
    ...base,
    name,
    effectTexture: `${toCamelBranchKey(id)}Ultimate`,
  };
});

const MAX_ULTIMATE_EFFECTS = 42;
const MAX_ULTIMATE_GRAPHICS_POOL = 36;
const MAX_ULTIMATE_SPRITE_POOL = 28;

export class UltimateSystem {
  constructor({ width, height, assetLoader = null }) {
    this.width = width;
    this.height = height;
    this.assetLoader = assetLoader;
    this.overlay = new Graphics();
    this.effects = [];
    this.graphicsPool = [];
    this.spritePool = [];
    this.performancePressureLevel = 0;
    this.effectTextures = {
      speed: null,
      hunting: null,
      attack: null,
      triceratopsSpeed: null,
      triceratopsHunting: null,
      triceratopsAttack: null,
      tyrannosaurusSpeed: null,
      tyrannosaurusHunting: null,
      tyrannosaurusAttack: null,
      tyrannosaurusZero: null,
      velociraptorZero: null,
      triceratopsZero: null,
      spinosaurusSpeed: null,
      spinosaurusHunting: null,
      spinosaurusAttack: null,
      spinosaurusZero: null,
    };
    this.effectAnimations = {
      omegaCore: null,
      omegaBurst: null,
      omegaBeam: null,
      abyssCore: null,
      abyssSlash: null,
      abyssDash: null,
      ignisCore: null,
      ignisCharge: null,
      ignisImpact: null,
      spinoCore: null,
      spinoTide: null,
      spinoBurst: null,
    };
    this.isActive = false;
    this.elapsed = 0;
    this.duration = 0;
    this.type = 'speed';
    this.key = 'speed';
    this.config = ULTIMATES.speed;
    this.tickTimer = 0;
    this.pulseIndex = 0;
    this.loadEffectTextures();
  }

  loadEffectTextures() {
    if (!this.assetLoader) {
      return;
    }

    const keys = {
      speed: ASSET_KEYS.specialEffects.speedSlash,
      hunting: ASSET_KEYS.specialEffects.huntingSwarm,
      attack: ASSET_KEYS.specialEffects.attackBurst,
      triceratopsSpeed: ASSET_KEYS.specialEffects.triceratopsSpeedCharge,
      triceratopsHunting: ASSET_KEYS.specialEffects.triceratopsHuntingBastion,
      triceratopsAttack: ASSET_KEYS.specialEffects.triceratopsAttackQuake,
      tyrannosaurusSpeed: ASSET_KEYS.specialEffects.tyrannosaurusSpeedPounce,
      tyrannosaurusHunting: ASSET_KEYS.specialEffects.tyrannosaurusHuntingTerror,
      tyrannosaurusAttack: ASSET_KEYS.specialEffects.tyrannosaurusAttackDevour,
      tyrannosaurusZero: ASSET_KEYS.specialEffects.tyrannosaurusZeroOmega,
      velociraptorZero: null,
      triceratopsZero: null,
      spinosaurusSpeed: ASSET_KEYS.specialEffects.spinosaurusSpeedTidalRushSheet,
      spinosaurusHunting: ASSET_KEYS.specialEffects.spinosaurusHuntingMaelstromSheet,
      spinosaurusAttack: ASSET_KEYS.specialEffects.spinosaurusAttackHydroBreakSheet,
      spinosaurusZero: ASSET_KEYS.specialEffects.spinosaurusZeroTideSheet,
    };
    Object.entries(ASSET_KEYS.specialEffects ?? {}).forEach(([id, key]) => {
      if (id.endsWith('Ultimate')) {
        keys[id] = key;
      }
    });
    const sheetKeys = {
      omegaCore: ASSET_KEYS.specialEffects.tyrannosaurusZeroOmegaCoreSheet,
      omegaBurst: ASSET_KEYS.specialEffects.tyrannosaurusZeroOmegaBurstSheet,
      omegaBeam: ASSET_KEYS.specialEffects.tyrannosaurusZeroOmegaBeamSheet,
      abyssCore: ASSET_KEYS.specialEffects.velociraptorZeroCoreSheet,
      abyssSlash: ASSET_KEYS.specialEffects.velociraptorZeroSlashSheet,
      abyssDash: ASSET_KEYS.specialEffects.velociraptorZeroDashSheet,
      ignisCore: ASSET_KEYS.specialEffects.triceratopsZeroCoreSheet,
      ignisCharge: ASSET_KEYS.specialEffects.triceratopsZeroChargeSheet,
      ignisImpact: ASSET_KEYS.specialEffects.triceratopsZeroImpactSheet,
      spinoCore: ASSET_KEYS.specialEffects.spinosaurusZeroCoreSheet,
      spinoTide: ASSET_KEYS.specialEffects.spinosaurusZeroTideSheet,
      spinoBurst: ASSET_KEYS.specialEffects.spinosaurusZeroBurstSheet,
    };

    Object.entries(keys).forEach(([type, key]) => {
      if (!key) {
        return;
      }

      this.assetLoader.load(key).then((texture) => {
        if (texture) {
          const item = this.assetLoader.getItem?.(key);
          this.effectTextures[type] = item?.meta?.spriteSheet
            ? this.createSheetFirstFrameTexture(texture, item.meta)
            : texture;
        }
      });
    });

    Object.entries(sheetKeys).forEach(([style, key]) => {
      if (!key) {
        return;
      }

      this.assetLoader.load(key).then((texture) => {
        const item = this.assetLoader.getItem?.(key);
        const animation = this.createSheetAnimation(texture, item?.meta, style);

        if (animation) {
          this.effectAnimations[style] = animation;
        }
      });
    });
  }

  createSheetAnimation(texture, meta, style) {
    const sheet = meta?.sheet;
    const columns = sheet?.columns ?? 4;
    const rows = sheet?.rows ?? 4;
    const frameWidth = sheet?.frameWidth ?? Math.floor((texture?.width ?? 0) / columns);
    const frameHeight = sheet?.frameHeight ?? Math.floor((texture?.height ?? 0) / rows);

    if (!texture?.source || columns <= 0 || rows <= 0 || frameWidth <= 0 || frameHeight <= 0) {
      return null;
    }

    const textures = [];

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        textures.push(new Texture({
          source: texture.source,
          frame: new Rectangle(column * frameWidth, row * frameHeight, frameWidth, frameHeight),
        }));
      }
    }

    return {
      textures,
      fps: style === 'omegaBeam' ? 20 : 18,
    };
  }

  createSheetFirstFrameTexture(texture, meta) {
    const sheet = meta?.sheet;
    const columns = sheet?.columns ?? 4;
    const frameWidth = sheet?.frameWidth ?? Math.floor((texture?.width ?? 0) / columns);
    const frameHeight = sheet?.frameHeight ?? Math.floor((texture?.height ?? 0) / (sheet?.rows ?? 4));

    if (!texture?.source || frameWidth <= 0 || frameHeight <= 0) {
      return texture;
    }

    return new Texture({
      source: texture.source,
      frame: new Rectangle(0, 0, frameWidth, frameHeight),
    });
  }

  activate(evolution) {
    if (this.isActive || !evolution) {
      return null;
    }

    this.type = evolution.tag;
    this.key = evolution.id ?? `${evolution.dinoId ?? 'velociraptor'}_${evolution.tag}`;
    this.config = ULTIMATES[this.key] ?? ULTIMATES[this.type] ?? ULTIMATES.speed;
    this.elapsed = 0;
    this.duration = this.config.duration;
    this.tickTimer = 0;
    this.pulseIndex = 0;
    this.isActive = true;

    return {
      name: this.config.name,
      duration: this.duration,
      shake: this.config.shake,
    };
  }

  reset() {
    this.isActive = false;
    this.elapsed = 0;
    this.tickTimer = 0;
    this.pulseIndex = 0;
    this.key = 'speed';
    this.overlay.clear();
    this.effects.forEach((effect) => this.releaseEffectView(effect?.view));
    this.effects = [];
  }

  setPerformancePressure(level = 0) {
    this.performancePressureLevel = Math.max(0, Math.min(2, Math.round(level)));
    if (this.performancePressureLevel >= 2) {
      this.trimEffects(Math.floor(MAX_ULTIMATE_EFFECTS * 0.64));
    }
  }

  getPerformanceStats() {
    return {
      ultimateEffects: this.effects.length,
      ultimateGraphicsPoolFree: this.graphicsPool.length,
      ultimateSpritePoolFree: this.spritePool.length,
      caps: {
        ultimateEffects: MAX_ULTIMATE_EFFECTS,
        ultimateGraphicsPool: MAX_ULTIMATE_GRAPHICS_POOL,
        ultimateSpritePool: MAX_ULTIMATE_SPRITE_POOL,
      },
    };
  }

  update(delta, player, enemies, effectLayer) {
    this.updateEffects(delta);

    if (!this.isActive) {
      this.overlay.clear();
      return null;
    }

    this.elapsed = Math.min(this.duration, this.elapsed + delta);
    const progress = this.elapsed / this.duration;
    const result = this.applyUltimateDamage(delta, player, enemies, effectLayer, progress);

    this.drawOverlay(progress);

    if (this.elapsed >= this.duration) {
      this.isActive = false;
      this.overlay.clear();
    }

    return result;
  }

  applyUltimateDamage(delta, player, enemies, effectLayer, progress) {
    if (this.config.behavior === 'charge') {
      return this.updateTriceratopsChargeUltimate(player, enemies, effectLayer, progress);
    }

    if (this.config.behavior === 'bastion') {
      return this.updateTriceratopsBastionUltimate(delta, player, enemies, effectLayer, progress);
    }

    if (this.config.behavior === 'quake') {
      return this.updateTriceratopsQuakeUltimate(player, enemies, effectLayer, progress);
    }

    if (this.config.behavior === 'pounce') {
      return this.updateTyrannosaurusPounceUltimate(player, enemies, effectLayer, progress);
    }

    if (this.config.behavior === 'terrorHunt') {
      return this.updateTyrannosaurusTerrorUltimate(player, enemies, effectLayer, progress);
    }

    if (this.config.behavior === 'devour') {
      return this.updateTyrannosaurusDevourUltimate(player, enemies, effectLayer, progress);
    }

    if (this.config.behavior === 'omegaBurst') {
      return this.updateOmegaBurstUltimate(player, enemies, effectLayer, progress);
    }

    if (this.config.behavior === 'abyssSlash') {
      return this.updateAbyssSlashUltimate(player, enemies, effectLayer, progress);
    }

    if (this.config.behavior === 'ignisCharge') {
      return this.updateIgnisChargeUltimate(player, enemies, effectLayer, progress);
    }

    if (this.type === 'speed') {
      return this.updateSpeedUltimate(delta, player, enemies, effectLayer);
    }

    if (this.type === 'hunting') {
      return this.updateHuntingUltimate(player, enemies, effectLayer, progress);
    }

    if (this.type === 'attack') {
      return this.updateAttackUltimate(player, enemies, effectLayer, progress);
    }

    return null;
  }

  getDamageForTarget(target, baseDamage) {
    const multiplier = target?.isBoss ? (this.config.bossDamageMultiplier ?? 1) : 1;

    return Math.max(1, Math.round(baseDamage * multiplier));
  }

  getKnockbackForTarget(target, baseKnockback) {
    return target?.isBoss ? Math.round(baseKnockback * 0.72) : baseKnockback;
  }

  updateSpeedUltimate(delta, player, enemies, effectLayer) {
    this.tickTimer -= delta;

    if (this.tickTimer > 0) {
      return null;
    }

    this.tickTimer = this.config.tickInterval;
    const targets = this.findTargetsInRange(player, enemies, this.config.radius, this.config.maxTargets);

    targets.forEach((enemy, index) => {
      enemy.takeDamage(this.getDamageForTarget(enemy, this.config.damage), {
        from: player.position,
        strength: this.getKnockbackForTarget(enemy, this.config.knockback),
      });
      this.spawnSlashEffect(effectLayer, player.position, enemy.position, {
        style: 'speed',
        side: index % 2 === 0 ? -1 : 1,
      });
    });

    return targets.length > 0 ? { shake: this.config.shake * 0.34 } : null;
  }

  updateHuntingUltimate(player, enemies, effectLayer, progress) {
    const pulseMarks = [0.12, 0.36, 0.62, 0.86];

    if (this.pulseIndex >= pulseMarks.length || progress < pulseMarks[this.pulseIndex]) {
      return null;
    }

    this.pulseIndex += 1;
    const targets = this.findTargetsInRange(player, enemies, this.config.radius, this.config.maxTargets);

    targets.forEach((enemy, index) => {
      enemy.takeDamage(this.getDamageForTarget(enemy, this.config.damage), {
        from: player.position,
        strength: this.getKnockbackForTarget(enemy, this.config.knockback),
      });
      this.spawnHuntingEffect(effectLayer, player.position, enemy.position, {
        index,
      });
    });

    return targets.length > 0 ? { shake: this.config.shake * 0.58 } : { shake: this.config.shake * 0.32 };
  }

  updateAttackUltimate(player, enemies, effectLayer, progress) {
    const pulseMarks = [0.2, 0.46, 0.72];

    if (this.pulseIndex >= pulseMarks.length || progress < pulseMarks[this.pulseIndex]) {
      return null;
    }

    this.pulseIndex += 1;
    const targets = this.findTargetsInCone(player, enemies, this.config.range, this.config.width);
    const damageScales = [1, 0.52, 0.34];
    const damage = Math.round(this.config.damage * (damageScales[this.pulseIndex - 1] ?? 0.34));
    const knockback = this.pulseIndex === 1 ? this.config.knockback : Math.round(this.config.knockback * 0.72);

    targets.forEach((enemy) => {
      enemy.takeDamage(this.getDamageForTarget(enemy, damage), {
        from: player.position,
        strength: this.getKnockbackForTarget(enemy, knockback),
      });
    });
    this.spawnShockEffect(effectLayer, player.position, player.facing, this.config.range);

    return { shake: this.config.shake * (this.pulseIndex === 1 ? 1 : 0.58) };
  }

  updateTriceratopsChargeUltimate(player, enemies, effectLayer, progress) {
    const pulseMarks = [0.08, 0.24, 0.42, 0.62];

    if (this.pulseIndex >= pulseMarks.length || progress < pulseMarks[this.pulseIndex]) {
      return null;
    }

    this.pulseIndex += 1;
    const targets = this.findTargetsInChargeLane(player, enemies, this.config.range, this.config.width, this.config.maxTargets);
    const damageScales = [1, 0.74, 0.58, 0.42];
    const damage = Math.round(this.config.damage * (damageScales[this.pulseIndex - 1] ?? 0.42));
    const knockback = Math.round(this.config.knockback * (this.pulseIndex === 1 ? 1 : 0.72));

    targets.forEach((enemy) => {
      enemy.takeDamage(this.getDamageForTarget(enemy, damage), {
        from: player.position,
        strength: this.getKnockbackForTarget(enemy, knockback),
      });
    });
    this.spawnChargeEffect(effectLayer, player.position, player.facing, this.config.range);

    return targets.length > 0 ? { shake: this.config.shake * 0.72 } : { shake: this.config.shake * 0.34 };
  }

  updateTriceratopsBastionUltimate(delta, player, enemies, effectLayer) {
    this.tickTimer -= delta;

    if (this.tickTimer > 0) {
      return null;
    }

    this.tickTimer = this.config.tickInterval;
    const targets = this.findTargetsInRange(player, enemies, this.config.radius, this.config.maxTargets);

    targets.forEach((enemy, index) => {
      enemy.takeDamage(this.getDamageForTarget(enemy, this.config.damage), {
        from: player.position,
        strength: this.getKnockbackForTarget(enemy, this.config.knockback),
      });
      if (index < 5) {
        this.spawnBastionEffect(effectLayer, player.position, enemy.position, this.config.radius);
      }
    });

    if (this.pulseIndex === 0) {
      this.pulseIndex = 1;
      this.spawnBastionField(effectLayer, player.position, this.config.radius);
    }

    return targets.length > 0 ? { shake: this.config.shake * 0.44 } : null;
  }

  updateTriceratopsQuakeUltimate(player, enemies, effectLayer, progress) {
    const pulseMarks = [0.16, 0.42, 0.7];

    if (this.pulseIndex >= pulseMarks.length || progress < pulseMarks[this.pulseIndex]) {
      return null;
    }

    this.pulseIndex += 1;
    const radius = this.config.radius * (0.74 + this.pulseIndex * 0.12);
    const targets = this.findTargetsInRange(player, enemies, radius, this.config.maxTargets);
    const damageScales = [1, 0.62, 0.38];
    const damage = Math.round(this.config.damage * (damageScales[this.pulseIndex - 1] ?? 0.38));
    const knockback = Math.round(this.config.knockback * (this.pulseIndex === 1 ? 1 : 0.66));

    targets.forEach((enemy) => {
      enemy.takeDamage(this.getDamageForTarget(enemy, damage), {
        from: player.position,
        strength: this.getKnockbackForTarget(enemy, knockback),
      });
    });
    this.spawnQuakeEffect(effectLayer, player.position, radius);

    return { shake: this.config.shake * (this.pulseIndex === 1 ? 1 : 0.56) };
  }

  updateTyrannosaurusPounceUltimate(player, enemies, effectLayer, progress) {
    const pulseMarks = [0.1, 0.28, 0.5];

    if (this.pulseIndex >= pulseMarks.length || progress < pulseMarks[this.pulseIndex]) {
      return null;
    }

    this.pulseIndex += 1;
    const targets = this.findTargetsInChargeLane(player, enemies, this.config.range, this.config.width, this.config.maxTargets);
    const damageScales = [1, 0.78, 0.56];
    const damage = Math.round(this.config.damage * (damageScales[this.pulseIndex - 1] ?? 0.56));

    targets.forEach((enemy) => {
      enemy.takeDamage(this.getDamageForTarget(enemy, damage), {
        from: player.position,
        strength: this.getKnockbackForTarget(enemy, this.config.knockback),
      });
    });
    this.spawnChargeEffect(effectLayer, player.position, player.facing, this.config.range);

    return targets.length > 0 ? { shake: this.config.shake * 0.76 } : { shake: this.config.shake * 0.35 };
  }

  updateTyrannosaurusTerrorUltimate(player, enemies, effectLayer, progress) {
    const pulseMarks = [0.12, 0.34, 0.58, 0.82];

    if (this.pulseIndex >= pulseMarks.length || progress < pulseMarks[this.pulseIndex]) {
      return null;
    }

    this.pulseIndex += 1;
    const targets = this.findTargetsInRange(player, enemies, this.config.radius, this.config.maxTargets);

    targets.forEach((enemy, index) => {
      enemy.takeDamage(this.getDamageForTarget(enemy, this.config.damage), {
        from: player.position,
        strength: this.getKnockbackForTarget(enemy, this.config.knockback),
      });
      this.spawnHuntingEffect(effectLayer, player.position, enemy.position, { index });
    });

    return targets.length > 0 ? { shake: this.config.shake * 0.56 } : { shake: this.config.shake * 0.25 };
  }

  updateTyrannosaurusDevourUltimate(player, enemies, effectLayer, progress) {
    const pulseMarks = [0.18, 0.5, 0.78];

    if (this.pulseIndex >= pulseMarks.length || progress < pulseMarks[this.pulseIndex]) {
      return null;
    }

    this.pulseIndex += 1;
    const radius = this.config.radius * (0.72 + this.pulseIndex * 0.14);
    const targets = this.findTargetsInRange(player, enemies, radius, this.config.maxTargets);
    const damageScales = [1, 0.58, 0.32];
    const damage = Math.round(this.config.damage * (damageScales[this.pulseIndex - 1] ?? 0.32));

    targets.forEach((enemy) => {
      enemy.takeDamage(this.getDamageForTarget(enemy, damage), {
        from: player.position,
        strength: this.getKnockbackForTarget(enemy, this.config.knockback),
      });
    });
    this.spawnQuakeEffect(effectLayer, player.position, radius);

    return { shake: this.config.shake * (this.pulseIndex === 1 ? 1 : 0.54) };
  }

  updateOmegaBurstUltimate(player, enemies, effectLayer, progress) {
    const pulseMarks = [0.12, 0.34, 0.58, 0.82];

    if (this.pulseIndex >= pulseMarks.length || progress < pulseMarks[this.pulseIndex]) {
      return null;
    }

    this.pulseIndex += 1;

    if (this.pulseIndex === 1) {
      const radius = this.config.radius * 0.62;
      const targets = this.findTargetsInRange(player, enemies, radius, this.config.maxTargets);
      const damage = Math.round(this.config.damage * 0.48);

      targets.forEach((enemy) => {
        enemy.takeDamage(this.getDamageForTarget(enemy, damage), {
          from: player.position,
          strength: this.getKnockbackForTarget(enemy, Math.round(this.config.knockback * 0.45)),
        });
      });
      this.spawnOmegaEffect(effectLayer, player.position, radius, this.config.coreStyle ?? 'omegaCore');
      return { shake: this.config.shake * 0.42 };
    }

    if (this.pulseIndex === 2) {
      const radius = this.config.radius;
      const targets = this.findTargetsInRange(player, enemies, radius, this.config.maxTargets);

      targets.forEach((enemy) => {
        enemy.takeDamage(this.getDamageForTarget(enemy, this.config.damage), {
          from: player.position,
          strength: this.getKnockbackForTarget(enemy, this.config.knockback),
        });
      });
      this.spawnOmegaEffect(effectLayer, player.position, radius, this.config.burstStyle ?? 'omegaBurst');
      return { shake: this.config.shake };
    }

    const beamAngles = this.pulseIndex === 3
      ? [-0.34, 0.34]
      : [0, Math.PI * 0.72, -Math.PI * 0.72];
    const beamDamage = Math.round(this.config.beamDamage * (this.pulseIndex === 3 ? 1 : 0.78));
    const hit = new Set();

    beamAngles.forEach((offset) => {
      const facingLength = Math.max(Math.hypot(player.facing.x, player.facing.y), 1);
      const base = Math.atan2(player.facing.y / facingLength, player.facing.x / facingLength);
      const angle = base + offset;
      const facing = { x: Math.cos(angle), y: Math.sin(angle) };
      const targets = this.findTargetsInBeam(player, enemies, facing, this.config.beamRange, 62, 8);

      targets.forEach((enemy) => {
        if (hit.has(enemy)) {
          return;
        }

        hit.add(enemy);
        enemy.takeDamage(this.getDamageForTarget(enemy, beamDamage), {
          from: player.position,
          strength: this.getKnockbackForTarget(enemy, Math.round(this.config.knockback * 0.72)),
        });
      });
      this.spawnOmegaBeamEffect(effectLayer, player.position, facing, this.config.beamRange, this.config.beamStyle ?? 'omegaBeam');
    });

    return { shake: this.config.shake * 0.58 };
  }

  updateAbyssSlashUltimate(player, enemies, effectLayer, progress) {
    const pulseMarks = [0.1, 0.28, 0.48, 0.72, 0.9];

    if (this.pulseIndex >= pulseMarks.length || progress < pulseMarks[this.pulseIndex]) {
      return null;
    }

    this.pulseIndex += 1;

    if (this.pulseIndex === 1) {
      const radius = this.config.radius * 0.58;
      const targets = this.findTargetsInRange(player, enemies, radius, 8);
      const damage = Math.round(this.config.damage * 0.42);

      targets.forEach((enemy) => {
        enemy.takeDamage(this.getDamageForTarget(enemy, damage), {
          from: player.position,
          strength: this.getKnockbackForTarget(enemy, Math.round(this.config.knockback * 0.36)),
        });
      });
      this.spawnAbyssEffect(effectLayer, player.position, radius, 'abyssCore');
      return { shake: this.config.shake * 0.28 };
    }

    if (this.pulseIndex <= 4) {
      const targets = this.findTargetsInRange(player, enemies, this.config.dashRange, 4);
      const angleOffset = [-0.34, 0.24, -0.12][this.pulseIndex - 2] ?? 0;
      const facingLength = Math.max(Math.hypot(player.facing.x, player.facing.y), 1);
      const base = Math.atan2(player.facing.y / facingLength, player.facing.x / facingLength);
      const facing = { x: Math.cos(base + angleOffset), y: Math.sin(base + angleOffset) };

      targets.forEach((enemy, index) => {
        enemy.takeDamage(this.getDamageForTarget(enemy, this.config.damage), {
          from: player.position,
          strength: this.getKnockbackForTarget(enemy, Math.round(this.config.knockback * (0.72 - index * 0.08))),
        });
        this.spawnAbyssDashEffect(effectLayer, player.position, enemy.position, facing);
      });

      if (targets.length === 0) {
        this.spawnAbyssDashEffect(effectLayer, player.position, {
          x: player.position.x + facing.x * this.config.dashRange * 0.62,
          y: player.position.y + facing.y * this.config.dashRange * 0.62,
        }, facing);
      }

      return { shake: this.config.shake * 0.46 };
    }

    const targets = this.findTargetsInRange(player, enemies, this.config.radius, this.config.maxTargets);
    targets.forEach((enemy) => {
      enemy.takeDamage(this.getDamageForTarget(enemy, this.config.finisherDamage), {
        from: player.position,
        strength: this.getKnockbackForTarget(enemy, this.config.knockback),
      });
    });
    this.spawnAbyssEffect(effectLayer, player.position, this.config.radius, 'abyssSlash');
    return { shake: this.config.shake * 0.86 };
  }

  updateIgnisChargeUltimate(player, enemies, effectLayer, progress) {
    const pulseMarks = [0.1, 0.32, 0.62, 0.86];

    if (this.pulseIndex >= pulseMarks.length || progress < pulseMarks[this.pulseIndex]) {
      return null;
    }

    this.pulseIndex += 1;

    if (this.pulseIndex === 1) {
      const radius = this.config.radius * 0.58;
      const targets = this.findTargetsInRange(player, enemies, radius, 10);
      const damage = Math.round(this.config.damage * 0.46);

      targets.forEach((enemy) => {
        enemy.takeDamage(this.getDamageForTarget(enemy, damage), {
          from: player.position,
          strength: this.getKnockbackForTarget(enemy, Math.round(this.config.knockback * 0.36)),
        });
      });
      this.spawnIgnisEffect(effectLayer, player.position, radius, 'ignisCore');
      return { shake: this.config.shake * 0.36 };
    }

    if (this.pulseIndex <= 3) {
      const facingLength = Math.max(Math.hypot(player.facing.x, player.facing.y), 1);
      const base = Math.atan2(player.facing.y / facingLength, player.facing.x / facingLength);
      const angleOffset = this.pulseIndex === 2 ? -0.08 : 0.1;
      const facing = { x: Math.cos(base + angleOffset), y: Math.sin(base + angleOffset) };
      const targets = this.findTargetsInChargeLane(player, enemies, this.config.range, this.config.width, this.config.maxTargets);
      const damage = Math.round(this.config.damage * (this.pulseIndex === 2 ? 0.82 : 0.94));

      targets.forEach((enemy) => {
        enemy.takeDamage(this.getDamageForTarget(enemy, damage), {
          from: player.position,
          strength: this.getKnockbackForTarget(enemy, this.config.knockback),
        });
      });
      this.spawnIgnisChargeEffect(effectLayer, player.position, facing, this.config.range);
      return { shake: this.config.shake * 0.62 };
    }

    const targets = this.findTargetsInRange(player, enemies, this.config.radius, this.config.maxTargets);
    targets.forEach((enemy) => {
      enemy.takeDamage(this.getDamageForTarget(enemy, this.config.impactDamage), {
        from: player.position,
        strength: this.getKnockbackForTarget(enemy, Math.round(this.config.knockback * 1.12)),
      });
    });
    this.spawnIgnisEffect(effectLayer, player.position, this.config.radius, 'ignisImpact');
    return { shake: this.config.shake };
  }

  findTargetsInRange(player, enemies, radius, limit) {
    return enemies
      .filter((enemy) => !enemy.isDead)
      .map((enemy) => ({
        enemy,
        distance: CollisionSystem.distanceSquared(player.position, enemy.position),
      }))
      .filter((entry) => entry.distance <= radius * radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
      .map((entry) => entry.enemy);
  }

  findTargetsInChargeLane(player, enemies, range, width, limit = 12) {
    const facingLength = Math.max(Math.hypot(player.facing.x, player.facing.y), 1);
    const facingX = player.facing.x / facingLength;
    const facingY = player.facing.y / facingLength;
    const halfWidth = width / 2;

    return enemies
      .filter((enemy) => !enemy.isDead)
      .map((enemy) => {
        const dx = enemy.position.x - player.position.x;
        const dy = enemy.position.y - player.position.y;
        const forward = dx * facingX + dy * facingY;
        const side = Math.abs(dx * -facingY + dy * facingX);
        return { enemy, forward, side };
      })
      .filter((entry) => entry.forward > -28 && entry.forward < range && entry.side <= halfWidth)
      .sort((a, b) => a.forward - b.forward)
      .slice(0, limit)
      .map((entry) => entry.enemy);
  }

  findTargetsInCone(player, enemies, range, minDot) {
    const facingLength = Math.max(Math.hypot(player.facing.x, player.facing.y), 1);
    const facingX = player.facing.x / facingLength;
    const facingY = player.facing.y / facingLength;

    return enemies.filter((enemy) => {
      if (enemy.isDead) {
        return false;
      }

      const dx = enemy.position.x - player.position.x;
      const dy = enemy.position.y - player.position.y;
      const distance = Math.max(Math.hypot(dx, dy), 1);

      if (distance > range) {
        return false;
      }

      const dot = (dx / distance) * facingX + (dy / distance) * facingY;
      return dot > minDot;
    });
  }

  findTargetsInBeam(player, enemies, facing, range, width, limit = 8) {
    const halfWidth = width / 2;

    return enemies
      .filter((enemy) => !enemy.isDead)
      .map((enemy) => {
        const dx = enemy.position.x - player.position.x;
        const dy = enemy.position.y - player.position.y;
        const forward = dx * facing.x + dy * facing.y;
        const side = Math.abs(dx * -facing.y + dy * facing.x);
        return { enemy, forward, side };
      })
      .filter((entry) => entry.forward > -20 && entry.forward < range && entry.side <= halfWidth)
      .sort((a, b) => a.forward - b.forward)
      .slice(0, limit)
      .map((entry) => entry.enemy);
  }

  spawnSlashEffect(effectLayer, from, to, options = {}) {
    const effect = this.createEffect('slash', 0.24, from, {
      ...options,
      to,
    });

    this.addEffect(effect, effectLayer);
  }

  spawnRingEffect(effectLayer, position, radius) {
    const effect = this.createEffect('ring', 0.38, position, { radius });

    this.addEffect(effect, effectLayer);
  }

  spawnHuntingEffect(effectLayer, from, to, options = {}) {
    const effect = this.createEffect('hunting', 0.38, from, {
      ...options,
      to,
    });

    this.addEffect(effect, effectLayer);
  }

  spawnShockEffect(effectLayer, position, facing, range) {
    const effect = this.createEffect('shock', 0.46, position, { facing: { ...facing }, range });

    this.addEffect(effect, effectLayer);
  }

  spawnChargeEffect(effectLayer, position, facing, range) {
    const effect = this.createEffect('charge', 0.42, position, { facing: { ...facing }, range });

    this.addEffect(effect, effectLayer);
  }

  spawnBastionField(effectLayer, position, radius) {
    const effect = this.createEffect('bastionField', 0.72, position, { radius });

    this.addEffect(effect, effectLayer);
  }

  spawnBastionEffect(effectLayer, from, to, radius) {
    const effect = this.createEffect('bastion', 0.34, from, { to, radius });

    this.addEffect(effect, effectLayer);
  }

  spawnQuakeEffect(effectLayer, position, radius) {
    const effect = this.createEffect('quake', 0.56, position, { radius });

    this.addEffect(effect, effectLayer);
  }

  spawnOmegaEffect(effectLayer, position, radius, style = 'omegaBurst') {
    const effect = this.createEffect(style, style === 'omegaCore' ? 0.46 : 0.62, position, { radius });

    this.addEffect(effect, effectLayer);
  }

  spawnOmegaBeamEffect(effectLayer, position, facing, range, style = 'omegaBeam') {
    const effect = this.createEffect(style, 0.46, position, { facing: { ...facing }, range });

    this.addEffect(effect, effectLayer);
  }

  spawnAbyssEffect(effectLayer, position, radius, style = 'abyssSlash') {
    const effect = this.createEffect(style, style === 'abyssCore' ? 0.38 : 0.52, position, { radius });

    this.addEffect(effect, effectLayer);
  }

  spawnAbyssDashEffect(effectLayer, from, to, facing) {
    const effect = this.createEffect('abyssDash', 0.34, from, { to, facing: { ...facing } });

    this.addEffect(effect, effectLayer);
  }

  spawnIgnisEffect(effectLayer, position, radius, style = 'ignisImpact') {
    const effect = this.createEffect(style, style === 'ignisCore' ? 0.42 : 0.62, position, { radius });

    this.addEffect(effect, effectLayer);
  }

  spawnIgnisChargeEffect(effectLayer, position, facing, range) {
    const effect = this.createEffect('ignisCharge', 0.44, position, { facing: { ...facing }, range });

    this.addEffect(effect, effectLayer);
  }

  addEffect(effect, effectLayer) {
    if (!effect?.view || !effectLayer) {
      return;
    }

    if (this.performancePressureLevel >= 2
      && this.effects.length >= Math.floor(MAX_ULTIMATE_EFFECTS * 0.62)
      && effect.style !== 'omegaCore'
      && effect.style !== 'ignisCore'
      && effect.style !== 'spinoCore') {
      this.releaseEffectView(effect.view);
      return;
    }

    this.trimEffects(MAX_ULTIMATE_EFFECTS - 1);
    effectLayer.addChild(effect.view);
    this.effects.push(effect);
  }

  trimEffects(maxCount) {
    while (this.effects.length > maxCount) {
      const effect = this.effects.shift();
      this.releaseEffectView(effect?.view);
    }
  }

  acquireEffectView(texture) {
    const view = texture
      ? (this.spritePool.pop() ?? new Sprite(texture))
      : (this.graphicsPool.pop() ?? new Graphics());

    if (texture) {
      view.texture = texture;
      view.anchor?.set?.(0.5);
    } else {
      view.clear?.();
    }

    view.visible = true;
    view.alpha = 1;
    view.rotation = 0;
    view.scale.set(1);
    view.tint = 0xffffff;
    return view;
  }

  releaseEffectView(view) {
    if (!view || view.destroyed) {
      return;
    }

    view.removeFromParent?.();
    view.visible = false;
    view.alpha = 1;
    view.rotation = 0;
    view.scale.set(1);

    if (view instanceof Sprite) {
      view.texture = Texture.EMPTY;
      if (this.spritePool.length < MAX_ULTIMATE_SPRITE_POOL) {
        this.spritePool.push(view);
        return;
      }
      view.destroy();
      return;
    }

    view.clear?.();
    if (this.graphicsPool.length < MAX_ULTIMATE_GRAPHICS_POOL) {
      this.graphicsPool.push(view);
      return;
    }

    view.destroy();
  }

  createEffect(style, duration, position, options) {
    const animation = this.getEffectAnimation(style);
    const texture = animation?.textures?.[0] ?? this.getEffectTexture(style);
    const view = this.acquireEffectView(texture);

    const effect = {
      style,
      duration,
      age: 0,
      options,
      view,
      hasTexture: Boolean(texture),
      animation,
      origin: { x: position.x, y: position.y },
    };

    effect.view.position.set(position.x, position.y);
    return effect;
  }

  getEffectTexture(style) {
    if (this.config.effectTexture && this.effectTextures[this.config.effectTexture]) {
      return this.effectTextures[this.config.effectTexture];
    }

    if (style === 'slash') {
      return this.effectTextures.speed;
    }

    if (style === 'hunting' || style === 'ring') {
      return this.effectTextures.hunting;
    }

    if (style === 'shock') {
      return this.effectTextures.attack;
    }

    return null;
  }

  getEffectAnimation(style) {
    if (style === 'omegaCore' || style === 'omegaBurst' || style === 'omegaBeam'
      || style === 'abyssCore' || style === 'abyssSlash' || style === 'abyssDash'
      || style === 'ignisCore' || style === 'ignisCharge' || style === 'ignisImpact'
      || style === 'spinoCore' || style === 'spinoTide' || style === 'spinoBurst') {
      return this.effectAnimations[style] ?? null;
    }

    return null;
  }

  updateEffects(delta) {
    this.effects = this.effects.filter((effect) => {
      if (!effect?.view || effect.view.destroyed || !Number.isFinite(effect.age) || !Number.isFinite(effect.duration)) {
        this.releaseEffectView(effect?.view);
        return false;
      }

      effect.age += delta;
      const progress = effect.age / effect.duration;

      if (progress >= 1) {
        this.releaseEffectView(effect.view);
        return false;
      }

      this.drawEffect(effect, progress);
      return true;
    });
  }

  drawEffect(effect, progress) {
    const fade = 1 - progress;

    if (effect.hasTexture) {
      this.drawTexturedEffect(effect, progress, fade);
      return;
    }

    effect.view.clear();

    if (effect.style === 'slash') {
      const to = effect.options.to;
      const angle = Math.atan2(to.y - effect.view.position.y, to.x - effect.view.position.x);
      const side = effect.options.side ?? 1;

      effect.view.rotation = angle;
      effect.view
        .moveTo(-42, -12 * side)
        .quadraticCurveTo(8, -42 * side, 78, -4 * side)
        .stroke({ color: this.config.glow, width: 5 * fade, alpha: 0.72 * fade })
        .moveTo(-32, 9 * side)
        .quadraticCurveTo(10, 32 * side, 64, 8 * side)
        .stroke({ color: this.config.color, width: 2.2, alpha: 0.82 * fade });
      return;
    }

    if (effect.style === 'hunting') {
      const to = effect.options.to;
      const angle = Math.atan2(to.y - effect.view.position.y, to.x - effect.view.position.x);
      const length = Math.max(60, Math.hypot(to.x - effect.view.position.x, to.y - effect.view.position.y));

      effect.view.rotation = angle;
      effect.view
        .moveTo(0, 0)
        .lineTo(length * (0.55 + progress * 0.42), 0)
        .stroke({ color: this.config.glow, width: 5 * fade, alpha: 0.5 * fade })
        .moveTo(24, -10)
        .lineTo(length * 0.78, 0)
        .lineTo(24, 10)
        .stroke({ color: this.config.color, width: 2.5, alpha: 0.7 * fade });
      return;
    }

    if (effect.style === 'ring') {
      const radius = effect.options.radius * (0.42 + progress * 0.58);

      effect.view
        .circle(0, 0, radius)
        .stroke({ color: this.config.glow, width: 5 * fade, alpha: 0.48 * fade })
        .circle(0, 0, radius * 0.68)
        .stroke({ color: this.config.color, width: 2.4, alpha: 0.38 * fade });
      return;
    }

    if (effect.style === 'charge') {
      const facing = effect.options.facing;
      const range = effect.options.range;
      const angle = Math.atan2(facing.y, facing.x);

      effect.view.rotation = angle;
      effect.view
        .moveTo(0, -18)
        .lineTo(range * (0.5 + progress * 0.42), -34 * fade)
        .lineTo(range * (0.72 + progress * 0.22), 0)
        .lineTo(range * (0.5 + progress * 0.42), 34 * fade)
        .lineTo(0, 18)
        .stroke({ color: this.config.glow, width: 6 * fade, alpha: 0.62 * fade })
        .fill({ color: this.config.color, alpha: 0.12 * fade });
      return;
    }

    if (effect.style === 'bastion' || effect.style === 'bastionField' || effect.style === 'quake'
      || effect.style === 'omegaCore' || effect.style === 'omegaBurst'
      || effect.style === 'abyssCore' || effect.style === 'abyssSlash'
      || effect.style === 'ignisCore' || effect.style === 'ignisImpact'
      || effect.style === 'spinoCore' || effect.style === 'spinoTide' || effect.style === 'spinoBurst') {
      const radius = (effect.options.radius ?? this.config.radius ?? 260) * (0.48 + progress * 0.58);

      effect.view
        .circle(0, 0, radius)
        .stroke({ color: this.config.glow, width: effect.style === 'omegaBurst' || effect.style === 'abyssSlash' ? 9 * fade : effect.style === 'quake' ? 7 * fade : 4 * fade, alpha: 0.54 * fade })
        .circle(0, 0, radius * 0.66)
        .stroke({ color: this.config.color, width: 2.4, alpha: 0.42 * fade });

      if (effect.style === 'omegaBurst' || effect.style === 'abyssSlash' || effect.style === 'spinoTide') {
        effect.view
          .circle(0, 0, radius * 0.36)
          .fill({ color: 0xffffff, alpha: 0.08 * fade })
          .stroke({ color: 0xff345f, width: 2.2, alpha: 0.28 * fade });
      }
      return;
    }

    if (effect.style === 'abyssDash') {
      const to = effect.options.to;
      const angle = Math.atan2(to.y - effect.view.position.y, to.x - effect.view.position.x);
      const length = Math.max(70, Math.hypot(to.x - effect.view.position.x, to.y - effect.view.position.y));

      effect.view.rotation = angle;
      effect.view
        .moveTo(0, -14)
        .lineTo(length * (0.6 + progress * 0.28), -26 * fade)
        .lineTo(length * (0.82 + progress * 0.12), 0)
        .lineTo(length * (0.6 + progress * 0.28), 26 * fade)
        .lineTo(0, 14)
        .stroke({ color: this.config.glow, width: 5 * fade, alpha: 0.58 * fade })
        .fill({ color: this.config.color, alpha: 0.14 * fade });
      return;
    }

    if (effect.style === 'omegaBeam' || effect.style === 'spinoBurst') {
      const facing = effect.options.facing;
      const range = effect.options.range ?? this.config.beamRange ?? 420;
      const angle = Math.atan2(facing.y, facing.x);

      effect.view.rotation = angle;
      effect.view
        .moveTo(0, -16)
        .lineTo(range * (0.58 + progress * 0.36), -30 * fade)
        .lineTo(range * (0.72 + progress * 0.22), 0)
        .lineTo(range * (0.58 + progress * 0.36), 30 * fade)
        .lineTo(0, 16)
        .fill({ color: this.config.color, alpha: 0.12 * fade })
        .stroke({ color: this.config.glow, width: 5.5 * fade, alpha: 0.52 * fade })
        .moveTo(26, 0)
        .lineTo(range * (0.84 + progress * 0.12), 0)
        .stroke({ color: 0xffffff, width: 2.2, alpha: 0.78 * fade });
      return;
    }

    const facing = effect.options.facing;
    const range = effect.options.range;
    const angle = Math.atan2(facing.y, facing.x);

    effect.view.rotation = angle;
    effect.view
      .moveTo(0, -38)
      .lineTo(range * (0.48 + progress * 0.48), -96 * fade)
      .lineTo(range * (0.6 + progress * 0.38), 0)
      .lineTo(range * (0.48 + progress * 0.48), 96 * fade)
      .lineTo(0, 38)
      .stroke({ color: this.config.glow, width: 5 * fade, alpha: 0.56 * fade })
      .fill({ color: this.config.color, alpha: 0.1 * fade });
  }

  drawTexturedEffect(effect, progress, fade) {
    if (effect.animation?.textures?.length > 0) {
      const frameIndex = Math.min(
        effect.animation.textures.length - 1,
        Math.floor(progress * effect.animation.textures.length),
      );
      effect.view.texture = effect.animation.textures[frameIndex] ?? effect.view.texture;
    }

    effect.view.alpha = Math.max(0, Math.min(1, fade * 0.9));

    if (effect.style === 'slash') {
      const to = effect.options.to;
      const angle = Math.atan2(to.y - effect.view.position.y, to.x - effect.view.position.x);
      const side = effect.options.side ?? 1;

      effect.view.rotation = angle + side * 0.1;
      effect.view.alpha = Math.max(0, Math.min(1, fade * 0.86));
      effect.view.scale.set(0.17 + progress * 0.08, 0.15 + progress * 0.07);
      return;
    }

    if (effect.style === 'hunting') {
      const to = effect.options.to;
      const t = Math.min(1, progress * 1.25);
      const startX = effect.origin.x;
      const startY = effect.origin.y;
      const x = startX + (to.x - startX) * t;
      const y = startY + (to.y - startY) * t;
      const angle = Math.atan2(to.y - startY, to.x - startX);

      effect.view.position.set(x, y);
      effect.view.rotation = angle + Math.sin(progress * Math.PI) * 0.18;
      effect.view.alpha = Math.max(0, Math.min(1, fade * 0.82));
      effect.view.scale.set(0.13 + progress * 0.08);
      return;
    }

    if (effect.style === 'ring') {
      const radius = effect.options.radius ?? 300;
      const scale = (radius / 768) * (0.72 + progress * 0.34);
      effect.view.rotation += 0.02;
      effect.view.scale.set(scale);
      return;
    }

    if (effect.style === 'charge') {
      const facing = effect.options.facing;
      const range = effect.options.range ?? 360;
      const angle = Math.atan2(facing.y, facing.x);
      const scale = (range / 768) * (0.9 + progress * 0.28);

      effect.view.rotation = angle;
      effect.view.alpha = Math.max(0, Math.min(1, fade * 0.82));
      effect.view.scale.set(scale * 1.18, scale * 0.78);
      return;
    }

    if (effect.style === 'bastion' || effect.style === 'bastionField') {
      const radius = effect.options.radius ?? 250;
      const scale = (radius / 768) * (0.88 + progress * 0.28);

      effect.view.rotation += effect.style === 'bastionField' ? 0.018 : -0.02;
      effect.view.alpha = Math.max(0, Math.min(1, fade * 0.72));
      effect.view.scale.set(scale);
      return;
    }

    if (effect.style === 'quake' || effect.style === 'omegaCore' || effect.style === 'omegaBurst'
      || effect.style === 'abyssCore' || effect.style === 'abyssSlash'
      || effect.style === 'ignisCore' || effect.style === 'ignisImpact'
      || effect.style === 'spinoCore' || effect.style === 'spinoTide') {
      const radius = effect.options.radius ?? 330;
      const isCore = effect.style === 'omegaCore' || effect.style === 'abyssCore' || effect.style === 'spinoCore';
      const scale = (radius / 768) * (isCore ? 0.62 + progress * 0.2 : 0.74 + progress * 0.36);

      effect.view.rotation += effect.style === 'omegaBurst' || effect.style === 'abyssSlash' || effect.style === 'spinoTide' ? 0.028 : 0.012;
      effect.view.alpha = Math.max(0, Math.min(1, fade * (effect.style === 'omegaBurst' || effect.style === 'abyssSlash' || effect.style === 'spinoTide' ? 0.9 : 0.84)));
      effect.view.scale.set(scale);
      return;
    }

    if (effect.style === 'abyssDash') {
      const to = effect.options.to;
      const t = Math.min(1, progress * 1.18);
      const startX = effect.origin.x;
      const startY = effect.origin.y;
      const angle = Math.atan2(to.y - startY, to.x - startX);

      effect.view.position.set(
        startX + (to.x - startX) * t,
        startY + (to.y - startY) * t,
      );
      effect.view.rotation = angle;
      effect.view.alpha = Math.max(0, Math.min(1, fade * 0.82));
      effect.view.scale.set(0.18 + progress * 0.1, 0.13 + progress * 0.06);
      return;
    }

    if (effect.style === 'omegaBeam' || effect.style === 'spinoBurst') {
      const facing = effect.options.facing;
      const range = effect.options.range ?? this.config.beamRange ?? 420;
      const angle = Math.atan2(facing.y, facing.x);
      const scale = (range / 768) * (0.66 + progress * 0.28);

      effect.view.rotation = angle;
      effect.view.alpha = Math.max(0, Math.min(1, fade * 0.82));
      effect.view.scale.set(scale * 1.22, scale * 0.58);
      return;
    }

    const facing = effect.options.facing;
    const range = effect.options.range ?? 360;
    const angle = Math.atan2(facing.y, facing.x);
    const scale = (range / 768) * (0.72 + progress * 0.32);

    effect.view.rotation = angle;
    effect.view.alpha = Math.max(0, Math.min(1, fade * 0.76));
    effect.view.scale.set(scale * 1.16, scale * 0.94);
  }

  drawOverlay(progress) {
    const pulse = 0.5 + Math.sin(this.elapsed * 28) * 0.5;

    this.overlay
      .clear()
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x010305, alpha: 0.12 + pulse * 0.04 })
      .rect(0, 0, this.width, this.height)
      .fill({ color: this.config.color, alpha: 0.04 + pulse * 0.05 })
      .circle(this.width / 2, this.height / 2, 120 + progress * 120)
      .stroke({ color: this.config.glow, width: 2.4, alpha: 0.16 * (1 - progress) })
      .circle(this.width / 2, this.height / 2, 70 + pulse * 16)
      .stroke({ color: this.config.color, width: 1.6, alpha: 0.18 + pulse * 0.08 })
      .circle(this.width - 74, this.height - 96, 76 + progress * 38)
      .stroke({ color: this.config.glow, width: 4 * (1 - progress) + 1, alpha: 0.34 * (1 - progress) });
  }
}
