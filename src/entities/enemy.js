import { Container, Graphics, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import { ASSET_KEYS, ENTITY_VISUAL_RULES } from '../data/asset_manifest.js';
import { getEnemyDisplayProfile } from '../data/enemy_display.js';

function isDebugOutgoingDamageDisabled() {
  if (typeof window === 'undefined') {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  return params.get('debugNoPlayerDamage') === '1'
    || (params.get('debugMaxSpawn') === '1' && window.__EVOLUTION_ZERO_STRESS_KILL_ENABLED__ !== true);
}

function getDebugOutgoingDamage(amount, maxHp) {
  if (typeof window !== 'undefined' && window.__EVOLUTION_ZERO_STRESS_KILL_ENABLED__ === true) {
    return Math.max(amount, maxHp);
  }

  return amount;
}

const ENEMY_TYPES = {
  swarm: {
    radius: 14,
    speed: 66,
    maxHp: 22,
    damage: 12,
    expReward: 1,
    scoreReward: 60,
    knockbackResistance: 0.92,
    scale: 0.78,
    bodyColor: 0x38502b,
    headColor: 0x4f6f38,
    accentColor: 0xa9ff55,
    eyeColor: 0xe6ff91,
  },
  fast: {
    radius: 16,
    speed: 122,
    maxHp: 28,
    damage: 15,
    expReward: 2,
    scoreReward: 260,
    knockbackResistance: 0.78,
    scale: 0.86,
    bodyColor: 0x203a42,
    headColor: 0x2e5360,
    accentColor: 0x35d7ff,
    eyeColor: 0xb8fbff,
  },
  tank: {
    radius: 28,
    speed: 48,
    maxHp: 92,
    damage: 22,
    expReward: 4,
    scoreReward: 340,
    knockbackResistance: 0.42,
    scale: 1.22,
    bodyColor: 0x4a3b2b,
    headColor: 0x5b4c37,
    accentColor: 0xffb247,
    eyeColor: 0xffe0a3,
  },
  volcanoHeavy: {
    radius: 25,
    speed: 54,
    maxHp: 78,
    damage: 18,
    expReward: 4,
    scoreReward: 280,
    knockbackResistance: 0.48,
    scale: 1.04,
    bodyColor: 0x3a211a,
    headColor: 0x5b2f20,
    accentColor: 0xff7a2e,
    eyeColor: 0xffd36b,
  },
  volcanoBomber: {
    radius: 19,
    speed: 58,
    maxHp: 36,
    damage: 14,
    expReward: 3,
    scoreReward: 320,
    knockbackResistance: 0.7,
    scale: 0.94,
    bodyColor: 0x341711,
    headColor: 0x5e2618,
    accentColor: 0xff4d38,
    eyeColor: 0xffd36b,
    explosionDamage: 16,
    explosionRadius: 82,
  },
  volcanoFast: {
    radius: 16,
    speed: 132,
    maxHp: 30,
    damage: 16,
    expReward: 2,
    scoreReward: 280,
    knockbackResistance: 0.76,
    scale: 0.88,
    bodyColor: 0x2b1712,
    headColor: 0x4b2419,
    accentColor: 0xffb247,
    eyeColor: 0xfff0a3,
  },
  swampPoison: {
    radius: 18,
    speed: 62,
    maxHp: 34,
    damage: 13,
    expReward: 2,
    scoreReward: 240,
    knockbackResistance: 0.72,
    scale: 0.9,
    bodyColor: 0x243d2d,
    headColor: 0x36573b,
    accentColor: 0x9eff63,
    eyeColor: 0xd7ff84,
    poisonPoolDamage: 4,
    poisonPoolRadius: 54,
    poisonPoolDuration: 1.8,
    poisonSlowMultiplier: 0.55,
  },
  swampSlow: {
    radius: 24,
    speed: 42,
    maxHp: 76,
    damage: 14,
    expReward: 4,
    scoreReward: 300,
    knockbackResistance: 0.5,
    scale: 1.06,
    bodyColor: 0x263728,
    headColor: 0x3f5434,
    accentColor: 0x74ff7a,
    eyeColor: 0xcaff8b,
    contactSlowMultiplier: 0.62,
  },
  swampToxicBomber: {
    radius: 20,
    speed: 56,
    maxHp: 40,
    damage: 13,
    expReward: 3,
    scoreReward: 340,
    knockbackResistance: 0.68,
    scale: 0.96,
    bodyColor: 0x2e1f34,
    headColor: 0x493256,
    accentColor: 0xb6ff35,
    eyeColor: 0xf1ff85,
    explosionDamage: 10,
    explosionRadius: 76,
    poisonPoolDamage: 5,
    poisonPoolRadius: 64,
    poisonPoolDuration: 2.35,
    poisonSlowMultiplier: 0.42,
  },
  ruinsShooter: {
    radius: 18,
    speed: 58,
    maxHp: 36,
    damage: 12,
    expReward: 2,
    scoreReward: 270,
    knockbackResistance: 0.74,
    scale: 0.9,
    bodyColor: 0x22283d,
    headColor: 0x354260,
    accentColor: 0x7bd8ff,
    eyeColor: 0xe8fbff,
    projectileDamage: 8,
    projectileSpeed: 220,
    projectileRange: 360,
    projectileCooldown: 3.4,
  },
  ruinsElectro: {
    radius: 24,
    speed: 45,
    maxHp: 84,
    damage: 15,
    expReward: 4,
    scoreReward: 350,
    knockbackResistance: 0.52,
    scale: 1.06,
    bodyColor: 0x24243c,
    headColor: 0x3d4264,
    accentColor: 0xa46cff,
    eyeColor: 0xf2f0ff,
    electroDamage: 7,
    electroRadius: 86,
    electroCooldown: 5.6,
    electroSlowMultiplier: 0.74,
  },
  ruinsSummoner: {
    radius: 20,
    speed: 50,
    maxHp: 54,
    damage: 13,
    expReward: 3,
    scoreReward: 380,
    knockbackResistance: 0.66,
    scale: 0.96,
    bodyColor: 0x20263b,
    headColor: 0x33405f,
    accentColor: 0xffd36b,
    eyeColor: 0xe9fbff,
    summonCooldown: 7.8,
    summonCount: 1,
    summonEnemyType: 'ruinsShooter',
  },
};

function getEnemyStrengthDisplay(enemyLevel = 1) {
  const level = Math.max(1, Math.min(12, Math.round(enemyLevel)));
  const colors = {
    1: 0xa9ff55,
    2: 0x35d7ff,
    3: 0xffc94d,
    4: 0xff6f4d,
    5: 0xff5a6f,
    6: 0xff38b8,
    7: 0xd86cff,
    8: 0xb9f8ff,
    9: 0xffffff,
    10: 0xffffff,
    11: 0xffffff,
    12: 0xffffff,
  };

  return {
    label: `Lv${level}`,
    color: colors[level] ?? colors[12],
  };
}

export class Enemy {
  constructor({
    x,
    y,
    enemyType = 'swarm',
    assetLoader = null,
    assetKey = null,
    hpMultiplier = 1,
    damageMultiplier = 1,
    speedMultiplier = 1,
    expMultiplier = 1,
    scoreMultiplier = 1,
    enemyLevel = 1,
  }) {
    const type = ENEMY_TYPES[enemyType] ?? ENEMY_TYPES.swarm;

    this.view = new Container();
    this.shadow = new Graphics();
    this.body = new Graphics();
    this.assetSprite = new Sprite();
    this.marker = new Graphics();
    this.typeLabelBg = new Graphics();
    this.displayProfile = getEnemyDisplayProfile(enemyType);
    this.typeLabel = new Text({
      text: '',
      style: {
        fill: '#f4f7f5',
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0,
      },
    });
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.enemyType = enemyType;
    this.radius = type.radius;
    this.enemyLevel = Math.max(1, Math.min(12, Math.round(enemyLevel)));
    this.speed = Math.round(type.speed * speedMultiplier);
    this.maxHp = Math.max(1, Math.round(type.maxHp * hpMultiplier));
    this.hp = this.maxHp;
    this.damage = Math.max(1, Math.round(type.damage * damageMultiplier));
    this.expReward = Math.max(1, Math.round(type.expReward * expMultiplier));
    this.strengthDisplay = getEnemyStrengthDisplay(this.enemyLevel);
    this.displayLabel = this.strengthDisplay.label;
    this.labelColor = this.strengthDisplay.color;
    this.scoreReward = Math.max(1, Math.round(type.scoreReward * scoreMultiplier));
    this.knockbackResistance = type.knockbackResistance;
    this.visualScale = type.scale;
    this.bodyColor = type.bodyColor;
    this.headColor = type.headColor;
    this.accentColor = type.accentColor;
    this.eyeColor = type.eyeColor;
    this.explosionDamage = type.explosionDamage ? Math.max(1, Math.round(type.explosionDamage * damageMultiplier)) : 0;
    this.explosionRadius = type.explosionRadius ?? 0;
    this.poisonPoolDamage = type.poisonPoolDamage ? Math.max(1, Math.round(type.poisonPoolDamage * damageMultiplier)) : 0;
    this.poisonPoolRadius = type.poisonPoolRadius ?? 0;
    this.poisonPoolDuration = type.poisonPoolDuration ?? 0;
    this.poisonSlowMultiplier = type.poisonSlowMultiplier ?? 1;
    this.contactSlowMultiplier = type.contactSlowMultiplier ?? 1;
    this.projectileDamage = type.projectileDamage ? Math.max(1, Math.round(type.projectileDamage * damageMultiplier)) : 0;
    this.projectileSpeed = type.projectileSpeed ?? 0;
    this.projectileRange = type.projectileRange ?? 0;
    this.projectileCooldown = type.projectileCooldown ?? 0;
    this.projectileTimer = this.projectileCooldown > 0 ? Math.random() * this.projectileCooldown : 0;
    this.electroDamage = type.electroDamage ? Math.max(1, Math.round(type.electroDamage * damageMultiplier)) : 0;
    this.electroRadius = type.electroRadius ?? 0;
    this.electroCooldown = type.electroCooldown ?? 0;
    this.electroSlowMultiplier = type.electroSlowMultiplier ?? 1;
    this.electroTimer = this.electroCooldown > 0 ? Math.random() * this.electroCooldown : 0;
    this.summonCooldown = type.summonCooldown ?? 0;
    this.summonCount = type.summonCount ?? 0;
    this.summonEnemyType = type.summonEnemyType ?? 'swarm';
    this.summonTimer = this.summonCooldown > 0 ? Math.random() * this.summonCooldown : 0;
    this.isDead = false;
    this.didDropExp = false;
    this.hitFlashTime = 0;
    this.hitImpact = 0;
    this.lastDamagedAt = 0;
    this.deathTime = 0;
    this.statusEffects = {};
    this.walkTime = Math.random() * Math.PI * 2;
    this.assetLoader = assetLoader;
    this.assetKey = assetKey ?? ASSET_KEYS.enemies[enemyType];
    this.assetRequestId = 0;
    this.sheetMeta = null;
    this.sheetAnimations = {};
    this.animationName = 'idle';
    this.animationFrameIndex = 0;
    this.animationTimer = 0;
    this.animationLocked = false;
    this.visualRule = ENTITY_VISUAL_RULES.enemies[enemyType] ?? ENTITY_VISUAL_RULES.enemies.swarm;

    this.typeLabel.anchor.set(0.5);
    this.typeLabel.position.set(0, this.visualRule.labelY);
    this.assetSprite.anchor.set(this.visualRule.anchor.x, this.visualRule.anchor.y);
    this.assetSprite.visible = false;
    this.view.addChild(this.shadow, this.marker, this.assetSprite, this.body, this.typeLabelBg, this.typeLabel);
    this.view.position.set(x, y);
    this.loadAsset();
    this.draw();
  }

  update(delta, player, options = {}) {
    const updateVisuals = options.updateVisuals !== false;

    if (this.isDead) {
      this.deathTime += delta;
      this.position.x += this.velocity.x * delta * 0.28;
      this.position.y += this.velocity.y * delta * 0.28;
      this.velocity.x *= 0.9;
      this.velocity.y *= 0.9;
      this.view.alpha = Math.max(0, 1 - this.deathTime * 5);
      const direction = this.view.scale.x < 0 ? -1 : 1;
      const pop = Math.max(0, 1 - this.deathTime * 8) * 0.18;
      const squash = Math.min(this.deathTime * 2.5, 0.32);

      this.view.position.set(this.position.x, this.position.y);
      this.view.rotation += direction * delta * 1.2;
      this.view.scale.set(direction * this.visualScale * (1 + pop), this.visualScale * (1 - squash));
      this.setAnimation('death');
      this.updateAnimation(delta);
      this.keepLabelReadable();
      return;
    }

    const dx = player.position.x - this.position.x;
    const dy = player.position.y - this.position.y;
    const distance = Math.max(Math.hypot(dx, dy), 1);
    this.updateStatusEffects(delta);
    const slowMultiplier = this.statusEffects.slow ? 0.62 : 1;
    const targetX = (dx / distance) * this.speed * slowMultiplier;
    const targetY = (dy / distance) * this.speed * slowMultiplier;
    const steer = 1 - Math.pow(0.01, Math.min(delta, 0.05));

    this.velocity.x += (targetX - this.velocity.x) * steer;
    this.velocity.y += (targetY - this.velocity.y) * steer;
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.walkTime += delta * 8;
    this.hitFlashTime = Math.max(0, this.hitFlashTime - delta);
    this.hitImpact = Math.max(0, this.hitImpact - delta * 3.5);

    this.view.position.set(this.position.x, this.position.y);

    if (!updateVisuals) {
      return;
    }

    this.view.rotation = this.velocity.x * 0.0018;
    const hitScale = 1 + this.hitImpact * 0.05;
    this.view.scale.set(
      (this.velocity.x < 0 ? -1 : 1) * this.visualScale * hitScale,
      this.visualScale * (1 + this.hitImpact * 0.03),
    );
    this.setAnimation(Math.hypot(this.velocity.x, this.velocity.y) > 4 ? 'move' : 'idle');
    this.updateAnimation(delta);
    this.keepLabelReadable();
    this.draw();
  }

  keepLabelReadable() {
    this.typeLabel.scale.x = this.view.scale.x < 0 ? -1 : 1;
  }

  loadAsset() {
    if (!this.assetLoader || !this.assetKey) {
      return;
    }

    const requestId = this.assetRequestId + 1;
    this.assetRequestId = requestId;

    this.assetLoader.load(this.assetKey).then((texture) => {
      if (!texture || requestId !== this.assetRequestId) {
        this.loadFallbackAsset(requestId);
        return;
      }

      const item = this.assetLoader.getItem?.(this.assetKey);
      const meta = item?.meta ?? {};

      if (meta.spriteSheet) {
        this.sheetMeta = meta;
        this.sheetAnimations = this.createSheetAnimations(texture, meta);

        if (this.sheetAnimations.idle) {
          this.setAnimation('idle', false, true);
          this.assetSprite.visible = true;
          this.body.visible = false;
          return;
        }
      }

      this.assetSprite.texture = texture;
      this.assetSprite.width = this.visualRule.spriteWidth;
      this.assetSprite.height = this.visualRule.spriteHeight;
      this.assetSprite.visible = true;
      this.body.visible = false;
    });
  }

  loadFallbackAsset(requestId) {
    const fallbackKey = this.assetLoader?.getItem?.(this.assetKey)?.meta?.fallbackKey;

    if (!fallbackKey) {
      return;
    }

    this.assetLoader.load(fallbackKey).then((texture) => {
      if (!texture || requestId !== this.assetRequestId) {
        return;
      }

      this.sheetMeta = null;
      this.sheetAnimations = {};
      this.assetSprite.texture = texture;
      this.assetSprite.width = this.visualRule.spriteWidth;
      this.assetSprite.height = this.visualRule.spriteHeight;
      this.assetSprite.visible = true;
      this.body.visible = false;
    });
  }

  createSheetAnimations(texture, meta) {
    const sheet = meta.sheet;
    const animations = meta.animations;

    if (!sheet || !animations) {
      return {};
    }

    const frameWidth = sheet.frameWidth ?? Math.floor((texture.width ?? 0) / (sheet.columns ?? 1));
    const frameHeight = sheet.frameHeight ?? Math.floor((texture.height ?? 0) / (sheet.rows ?? 1));

    return Object.fromEntries(Object.entries(animations).map(([name, config]) => {
      const textures = config.frames.map((column) => new Texture({
        source: texture.source,
        frame: new Rectangle(
          column * frameWidth,
          config.row * frameHeight,
          frameWidth,
          frameHeight,
        ),
      }));

      return [name, {
        textures,
        fps: config.fps ?? 6,
        loop: config.loop !== false,
      }];
    }));
  }

  setAnimation(animationName, locked = false, restart = false) {
    const animation = this.sheetAnimations[animationName];

    if (!animation || (this.animationLocked && !restart)) {
      return;
    }

    if (this.animationName !== animationName || restart) {
      this.animationFrameIndex = 0;
      this.animationTimer = 0;
    }

    this.animationName = animationName;
    this.animationLocked = locked;
    this.applyAnimationFrame();
  }

  updateAnimation(delta) {
    const animation = this.sheetAnimations[this.animationName];

    if (!animation) {
      return;
    }

    const frameDuration = 1 / Math.max(1, animation.fps);
    this.animationTimer += delta;

    while (this.animationTimer >= frameDuration) {
      this.animationTimer -= frameDuration;
      this.animationFrameIndex += 1;

      if (this.animationFrameIndex >= animation.textures.length) {
        if (animation.loop) {
          this.animationFrameIndex = 0;
        } else {
          this.animationFrameIndex = animation.textures.length - 1;
          this.animationLocked = false;
          break;
        }
      }
    }

    this.applyAnimationFrame();
  }

  applyAnimationFrame() {
    const animation = this.sheetAnimations[this.animationName];
    const texture = animation?.textures?.[this.animationFrameIndex];

    if (!texture) {
      return;
    }

    const sheet = this.sheetMeta?.sheet ?? {};

    this.assetSprite.texture = texture;
    this.assetSprite.width = sheet.displayWidth ?? this.visualRule.spriteWidth;
    this.assetSprite.height = sheet.displayHeight ?? this.visualRule.spriteHeight;
    this.assetSprite.visible = true;
    this.body.visible = false;
  }

  getCollider() {
    return {
      x: this.position.x,
      y: this.position.y,
      radius: this.radius,
    };
  }

  takeDamage(amount, impact = null) {
    if (this.isDead) {
      return false;
    }

    if (isDebugOutgoingDamageDisabled()) {
      return false;
    }

    const appliedAmount = getDebugOutgoingDamage(amount, this.maxHp);

    this.hp = Math.max(0, this.hp - appliedAmount);
    this.hitFlashTime = impact?.strength > 30 ? 0.18 : 0.13;
    this.hitImpact = Math.min(1, Math.max(this.hitImpact, appliedAmount / 32));
    this.lastDamagedAt = typeof performance !== 'undefined' ? performance.now() : Date.now();

    if (impact?.strength > 0) {
      const dx = this.position.x - impact.from.x;
      const dy = this.position.y - impact.from.y;
      const distance = Math.max(Math.hypot(dx, dy), 1);
      const resistedStrength = impact.strength * this.knockbackResistance;
      const pushX = (dx / distance) * resistedStrength;
      const pushY = (dy / distance) * resistedStrength;

      this.position.x += pushX;
      this.position.y += pushY;
      this.velocity.x += pushX * 5.5;
      this.velocity.y += pushY * 5.5;
      this.view.position.set(this.position.x, this.position.y);
    }

    if (this.hp === 0) {
      this.isDead = true;
      this.hitFlashTime = 0.2;
      this.setAnimation('death', false, true);
    }

    return true;
  }

  setSupplementalVisualsVisible(visible) {
    const nextVisible = visible !== false;

    this.marker.visible = nextVisible;
    this.typeLabel.visible = nextVisible && this.displayLabel.length > 0;
    this.typeLabelBg.visible = nextVisible && this.displayLabel.length > 0;
  }

  setMarkerVisible(visible) {
    this.marker.visible = visible !== false;
  }

  setLabelVisible(visible) {
    const nextVisible = visible !== false && this.displayLabel.length > 0;

    this.typeLabel.visible = nextVisible;
    this.typeLabelBg.visible = nextVisible;
  }

  applyStatus(type, duration = 2.4, power = 1) {
    if (this.isDead) {
      return;
    }

    this.statusEffects[type] = {
      duration: Math.max(this.statusEffects[type]?.duration ?? 0, duration),
      power,
      tickTimer: this.statusEffects[type]?.tickTimer ?? 0,
    };
  }

  updateStatusEffects(delta) {
    Object.entries(this.statusEffects).forEach(([type, effect]) => {
      effect.duration -= delta;
      effect.tickTimer -= delta;

      if ((type === 'poison' || type === 'bleed') && effect.tickTimer <= 0) {
        effect.tickTimer = type === 'poison' ? 0.55 : 0.38;
        if (isDebugOutgoingDamageDisabled()) {
          return;
        }
        const damage = type === 'poison' ? 3 * effect.power : 4 * effect.power;

        this.hp = Math.max(0, this.hp - damage);
        this.hitFlashTime = Math.max(this.hitFlashTime, 0.08);

        if (this.hp === 0) {
          this.isDead = true;
          this.hitFlashTime = 0.2;
        }
      }

      if (effect.duration <= 0) {
        delete this.statusEffects[type];
      }
    });
  }

  draw() {
    const bob = Math.sin(this.walkTime) * 1.8;
    const step = Math.sin(this.walkTime * 1.7) * 3;

    this.shadow
      .clear()
      .ellipse(
        this.visualRule.shadow.x,
        this.visualRule.shadow.y,
        this.visualRule.shadow.width,
      this.visualRule.shadow.height,
      )
      .fill({ color: 0x000000, alpha: this.visualRule.shadow.alpha });
    this.marker
      .clear()
      .circle(0, 2, this.radius + this.visualRule.ringPadding)
      .stroke({
        color: this.displayProfile.ringColor,
        width: this.displayProfile.ringWidth,
        alpha: this.displayProfile.ringAlpha,
      })
      .moveTo(-this.radius - 10, 2)
      .lineTo(-this.radius - 2, 2)
      .moveTo(this.radius + 2, 2)
      .lineTo(this.radius + 10, 2)
      .stroke({ color: this.displayProfile.ringColor, width: 1.2, alpha: this.displayProfile.markerAlpha });

    this.typeLabel.text = this.displayLabel;
    this.typeLabel.style.fill = `#${this.labelColor.toString(16).padStart(6, '0')}`;
    this.typeLabel.visible = this.displayLabel.length > 0;
    this.typeLabelBg
      .clear();

    if (this.displayLabel.length > 0) {
      const labelWidth = 42;
      const labelY = this.visualRule.labelY - 7;

      this.typeLabelBg
        .roundRect(-labelWidth / 2, labelY, labelWidth, 15, 5)
        .fill({ color: 0x030708, alpha: 0.72 })
        .stroke({ color: this.displayProfile.ringColor, width: 1, alpha: 0.76 });
    }

    const bodyColor = this.hitFlashTime > 0 ? 0xd66a45 : this.bodyColor;
    const headColor = this.hitFlashTime > 0 ? 0xff8760 : this.headColor;
    const flashAlpha = this.hitFlashTime > 0 ? 0.62 : 0;

    if (this.enemyType === 'tank' || this.enemyType === 'volcanoHeavy') {
      this.drawTankEnemy(bob, step, bodyColor, headColor, flashAlpha);
      return;
    }

    if (this.enemyType === 'fast' || this.enemyType === 'volcanoFast') {
      this.drawFastEnemy(bob, step, bodyColor, headColor, flashAlpha);
      return;
    }

    this.drawSwarmEnemy(bob, step, bodyColor, headColor, flashAlpha);
  }

  drawSwarmEnemy(bob, step, bodyColor, headColor, flashAlpha) {
    this.body
      .clear()
      .moveTo(-14, 10)
      .lineTo(-15 + step, 27)
      .moveTo(5, 9)
      .lineTo(5 - step, 27)
      .stroke({ color: 0x221614, width: 4, cap: 'round' })
      .poly([-28, 11, -53, 18, -29, 3])
      .fill({ color: 0x1d2719 })
      .ellipse(-5, bob, 30, 13)
      .fill({ color: bodyColor })
      .poly([19, bob - 6, 39, bob - 18, 52, bob - 13, 35, bob + 1])
      .fill({ color: headColor })
      .circle(42, bob - 14, 2)
      .fill({ color: this.eyeColor })
      .ellipse(-1, bob, 34, 16)
      .stroke({ color: 0xffe6a3, width: 2, alpha: flashAlpha })
      .moveTo(-18, bob - 9)
      .lineTo(18, bob - 13)
      .stroke({ color: this.hitFlashTime > 0 ? 0xffd36b : this.accentColor, width: 1.5, alpha: 0.58 });
  }

  drawFastEnemy(bob, step, bodyColor, headColor, flashAlpha) {
    this.body
      .clear()
      .moveTo(-16, 10)
      .lineTo(-20 + step * 1.2, 30)
      .moveTo(7, 8)
      .lineTo(4 - step * 1.2, 30)
      .stroke({ color: 0x142528, width: 3.5, cap: 'round' })
      .poly([-25, 8, -62, 9, -27, 1])
      .fill({ color: 0x132126 })
      .ellipse(-8, bob, 34, 9)
      .fill({ color: bodyColor })
      .poly([20, bob - 5, 48, bob - 18, 61, bob - 12, 34, bob + 2])
      .fill({ color: headColor })
      .circle(49, bob - 14, 2)
      .fill({ color: this.eyeColor })
      .ellipse(-2, bob, 38, 12)
      .stroke({ color: 0xb8fbff, width: 2, alpha: flashAlpha })
      .moveTo(-36, bob - 8)
      .lineTo(14, bob - 14)
      .stroke({ color: this.hitFlashTime > 0 ? 0xffd36b : this.accentColor, width: 1.4, alpha: 0.72 })
      .moveTo(-50, bob - 1)
      .lineTo(-72, bob + 2)
      .stroke({ color: this.accentColor, width: 1.2, alpha: 0.32 });
  }

  drawTankEnemy(bob, step, bodyColor, headColor, flashAlpha) {
    this.body
      .clear()
      .moveTo(-22, 13)
      .lineTo(-25 + step * 0.35, 31)
      .moveTo(5, 14)
      .lineTo(3 - step * 0.35, 32)
      .moveTo(25, 12)
      .lineTo(22 + step * 0.25, 30)
      .stroke({ color: 0x2a221a, width: 7, cap: 'round' })
      .poly([-42, 10, -74, 19, -43, 0])
      .fill({ color: 0x2e261d })
      .ellipse(-8, bob + 1, 45, 22)
      .fill({ color: bodyColor })
      .poly([-35, bob - 17, -22, bob - 31, -8, bob - 17])
      .fill({ color: 0x2a2118 })
      .poly([-9, bob - 20, 7, bob - 36, 22, bob - 18])
      .fill({ color: 0x30261a })
      .poly([27, bob - 8, 53, bob - 16, 70, bob - 7, 45, bob + 6])
      .fill({ color: headColor })
      .circle(55, bob - 10, 2.3)
      .fill({ color: this.eyeColor })
      .ellipse(-5, bob + 1, 49, 25)
      .stroke({ color: 0xffe6a3, width: 2.4, alpha: flashAlpha })
      .moveTo(-28, bob - 7)
      .lineTo(30, bob - 11)
      .stroke({ color: this.hitFlashTime > 0 ? 0xffd36b : this.accentColor, width: 2, alpha: 0.5 });
  }
}
