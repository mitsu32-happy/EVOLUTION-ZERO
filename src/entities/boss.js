import { Container, Graphics, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import { ASSET_KEYS, ENTITY_VISUAL_RULES } from '../data/asset_manifest.js';
import { getEnemyDisplayProfile } from '../data/enemy_display.js';

export class Boss {
  constructor({ x, y, assetLoader = null, assetKey = ASSET_KEYS.bosses.mutantPredator, config = null }) {
    this.view = new Container();
    this.shadow = new Graphics();
    this.marker = new Graphics();
    this.attackWarning = new Graphics();
    this.body = new Graphics();
    this.assetSprite = new Sprite();
    this.labelBg = new Graphics();
    this.enemyType = 'boss';
    this.displayProfile = getEnemyDisplayProfile(this.enemyType);
    this.displayLabel = this.displayProfile.displayLabel;
    this.label = new Text({
      text: this.displayLabel,
      style: {
        fill: '#ff3848',
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0,
      },
    });
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.config = config ?? {};
    this.bossId = config?.id ?? 'mutant_predator';
    this.name = config?.name ?? 'BOSS';
    this.radius = config?.radius ?? 54;
    this.speed = config?.speed ?? 42;
    this.baseSpeed = this.speed;
    this.maxHp = config?.maxHp ?? 720;
    this.hp = this.maxHp;
    this.damage = config?.damage ?? 30;
    this.expReward = config?.expReward ?? 18;
    this.scoreReward = config?.scoreReward ?? 2600;
    this.attackConfig = config?.attack ?? null;
    this.attackSet = {
      charge: config?.attack ?? null,
      melee: config?.attacks?.melee ?? null,
      summon: config?.attacks?.summon ?? null,
    };
    this.effectKeys = config?.effectKeys ?? {};
    this.effectTextures = {};
    this.effectAnimations = {};
    this.effectAnimationState = {};
    this.effectSprites = {
      chargeWarning: new Sprite(Texture.EMPTY),
      chargeSlash: new Sprite(Texture.EMPTY),
      roarWave: new Sprite(Texture.EMPTY),
      summonSpore: new Sprite(Texture.EMPTY),
    };
    this.attackTimer = (this.attackConfig?.cooldown ?? 7) * 0.55;
    this.meleeTimer = (this.attackSet.melee?.cooldown ?? 8) * 0.7;
    this.summonTimer = (this.attackSet.summon?.cooldown ?? 18) * 0.8;
    this.attackState = null;
    this.pendingSummonCount = 0;
    this.meleeHitConsumed = false;
    this.knockbackResistance = 0.24;
    this.isBoss = true;
    this.isDead = false;
    this.didDropExp = false;
    this.hitFlashTime = 0;
    this.hitImpact = 0;
    this.deathTime = 0;
    this.statusEffects = {};
    this.walkTime = Math.random() * Math.PI * 2;
    this.assetLoader = assetLoader;
    this.assetKey = assetKey;
    this.assetRequestId = 0;
    this.sheetMeta = null;
    this.sheetAnimations = {};
    this.animationName = 'idle';
    this.animationFrameIndex = 0;
    this.animationTimer = 0;
    this.animationLocked = false;
    this.visualRule = ENTITY_VISUAL_RULES.bosses.mutantPredator;

    this.label.anchor.set(0.5);
    this.label.position.set(0, this.visualRule.labelY);
    this.assetSprite.anchor.set(this.visualRule.anchor.x, this.visualRule.anchor.y);
    this.assetSprite.visible = false;
    Object.values(this.effectSprites).forEach((sprite) => {
      sprite.anchor.set(0.5);
      sprite.visible = false;
      sprite.alpha = 0.86;
    });
    this.view.addChild(
      this.shadow,
      this.marker,
      this.attackWarning,
      this.effectSprites.chargeWarning,
      this.effectSprites.chargeSlash,
      this.effectSprites.roarWave,
      this.effectSprites.summonSpore,
      this.assetSprite,
      this.body,
      this.labelBg,
      this.label,
    );
    this.view.position.set(x, y);
    this.loadAsset();
    this.loadEffectAssets();
    this.draw();
  }

  update(delta, player) {
    if (this.isDead) {
      this.deathTime += delta;
      this.position.x += this.velocity.x * delta * 0.16;
      this.position.y += this.velocity.y * delta * 0.16;
      this.velocity.x *= 0.9;
      this.velocity.y *= 0.9;
      this.view.alpha = Math.max(0, 1 - this.deathTime * 3);
      const pop = Math.max(0, 1 - this.deathTime * 4) * 0.26;
      const squash = Math.min(this.deathTime * 1.8, 0.36);

      this.view.position.set(this.position.x, this.position.y);
      this.view.rotation += delta * 0.7;
      this.view.scale.set(1 + pop, 1 - squash);
      this.setAnimation('death');
      this.updateAnimation(delta);
      this.keepLabelReadable();
      this.draw();
      return;
    }

    const dx = player.position.x - this.position.x;
    const dy = player.position.y - this.position.y;
    const distance = Math.max(Math.hypot(dx, dy), 1);
    this.updateStatusEffects(delta);
    this.updateAttackState(delta, dx, dy, distance);
    const slowMultiplier = this.statusEffects.slow ? 0.72 : 1;
    const movement = this.getMovementVector(dx, dy, distance, slowMultiplier);
    const targetX = movement.x;
    const targetY = movement.y;
    const steer = 1 - Math.pow(0.015, Math.min(delta, 0.05));

    this.velocity.x += (targetX - this.velocity.x) * steer;
    this.velocity.y += (targetY - this.velocity.y) * steer;
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.walkTime += delta * 4.5;
    this.hitFlashTime = Math.max(0, this.hitFlashTime - delta);
    this.hitImpact = Math.max(0, this.hitImpact - delta * 2.8);

    this.view.position.set(this.position.x, this.position.y);
    this.view.rotation = this.velocity.x * 0.0009;
    const hitScale = 1 + this.hitImpact * 0.045;
    this.view.scale.set(this.velocity.x < 0 ? -hitScale : hitScale, 1 + this.hitImpact * 0.025);
    this.setAnimation(Math.hypot(this.velocity.x, this.velocity.y) > 3 ? 'move' : 'idle');
    this.updateAnimation(delta);
    this.keepLabelReadable();
    this.draw();
    this.updateEffectAnimations(delta);
  }

  keepLabelReadable() {
    this.label.scale.x = this.view.scale.x < 0 ? -1 : 1;
    this.attackWarning.scale.x = this.view.scale.x < 0 ? -1 : 1;
  }

  updateAttackState(delta, dx, dy, distance) {
    if (this.attackState) {
      this.attackState.timer -= delta;

      if (this.attackState.phase === 'windup' && this.attackState.timer <= 0) {
        if (this.attackState.type === 'charge') {
          const duration = this.attackState.config.duration ?? 0.5;

          this.attackState.phase = 'charge';
          this.attackState.timer = duration;
          this.attackState.total = duration;
          this.setAnimation('attack', true, true);
          return;
        }

        if (this.attackState.type === 'melee') {
          const duration = this.attackState.config.duration ?? 0.36;

          this.attackState.phase = 'active';
          this.attackState.timer = duration;
          this.attackState.total = duration;
          this.meleeHitConsumed = false;
          this.setAnimation('attack', true, true);
          return;
        }

        if (this.attackState.type === 'summon') {
          this.pendingSummonCount += Math.max(0, this.attackState.config.count ?? 0);
          this.summonTimer = this.attackState.config.cooldown ?? 18;
          this.setAnimation('attack', true, true);
          this.attackState = null;
          return;
        }
      } else if ((this.attackState.phase === 'charge' || this.attackState.phase === 'active') && this.attackState.timer <= 0) {
        if (this.attackState.type === 'charge') {
          this.attackTimer = this.attackState.config.cooldown ?? 7;
        } else if (this.attackState.type === 'melee') {
          this.meleeTimer = this.attackState.config.cooldown ?? 8;
        }
        this.attackState = null;
      }
      return;
    }

    this.attackTimer -= delta;
    this.meleeTimer -= delta;
    this.summonTimer -= delta;

    const meleeConfig = this.attackSet.melee;
    if (meleeConfig && this.meleeTimer <= 0 && distance <= (meleeConfig.radius ?? 94) + this.radius) {
      const windup = meleeConfig.windup ?? 1;
      this.attackState = {
        type: 'melee',
        phase: 'windup',
        timer: windup,
        total: windup,
        config: meleeConfig,
        dirX: dx / Math.max(1, distance),
        dirY: dy / Math.max(1, distance),
        originX: this.position.x,
        originY: this.position.y,
      };
      this.setAnimation('attack', true, true);
      return;
    }

    const summonConfig = this.attackSet.summon;
    if (summonConfig?.enabled && this.summonTimer <= 0) {
      const windup = summonConfig.windup ?? 1.15;
      this.attackState = {
        type: 'summon',
        phase: 'windup',
        timer: windup,
        total: windup,
        config: summonConfig,
        dirX: dx / Math.max(1, distance),
        dirY: dy / Math.max(1, distance),
        originX: this.position.x,
        originY: this.position.y,
      };
      this.setAnimation('attack', true, true);
      return;
    }

    const chargeConfig = this.attackSet.charge;
    if (!chargeConfig || chargeConfig.type !== 'charge' || this.attackTimer > 0 || distance > (chargeConfig.range ?? 190)) {
      return;
    }

    const length = Math.max(1, distance);
    const windup = chargeConfig.windup ?? 1;

    this.attackState = {
      type: 'charge',
      phase: 'windup',
      timer: windup,
      total: windup,
      config: chargeConfig,
      dirX: dx / length,
      dirY: dy / length,
      originX: this.position.x,
      originY: this.position.y,
    };
    this.setAnimation('attack', true, true);
  }

  getMovementVector(dx, dy, distance, slowMultiplier) {
    if (this.attackState?.phase === 'windup') {
      return { x: 0, y: 0 };
    }

    if (this.attackState?.phase === 'charge') {
      const multiplier = this.attackState.config?.speedMultiplier ?? 2.6;
      return {
        x: this.attackState.dirX * this.baseSpeed * multiplier * slowMultiplier,
        y: this.attackState.dirY * this.baseSpeed * multiplier * slowMultiplier,
      };
    }

    return {
      x: (dx / distance) * this.speed * slowMultiplier,
      y: (dy / distance) * this.speed * slowMultiplier,
    };
  }

  consumeMeleeHit(playerCollider) {
    if (
      this.isDead
      || this.meleeHitConsumed
      || this.attackState?.type !== 'melee'
      || this.attackState.phase !== 'active'
    ) {
      return 0;
    }

    const radius = this.attackState.config?.radius ?? 96;
    const originX = this.attackState.originX ?? this.position.x;
    const originY = this.attackState.originY ?? this.position.y;
    const distance = Math.hypot(playerCollider.x - originX, playerCollider.y - originY);

    if (distance > radius + (playerCollider.radius ?? 0)) {
      return 0;
    }

    this.meleeHitConsumed = true;
    return Math.max(1, Math.round(this.damage * (this.attackState.config?.damageMultiplier ?? 0.78)));
  }

  consumeSummonRequest() {
    if (this.pendingSummonCount <= 0) {
      return 0;
    }

    const count = this.pendingSummonCount;
    this.pendingSummonCount = 0;
    return count;
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

  loadEffectAssets() {
    if (!this.assetLoader) {
      return;
    }

    Object.entries(this.effectKeys).forEach(([name, key]) => {
      const sprite = this.effectSprites[name];

      if (!sprite || !key) {
        return;
      }

      this.assetLoader.load(key).then((texture) => {
        if (!texture) {
          return;
        }

        const item = this.assetLoader.getItem?.(key);
        const animation = this.createEffectAnimation(texture, item?.meta);

        if (animation) {
          this.effectAnimations[name] = animation;
          this.effectAnimationState[name] = { frame: 0, timer: 0 };
          sprite.texture = animation.textures[0] ?? texture;
        } else {
          this.effectTextures[name] = texture;
          sprite.texture = texture;
        }
      }).catch(() => {});
    });
  }

  createEffectAnimation(texture, meta = {}) {
    const sheet = meta?.sheet;
    const active = meta?.animations?.active;

    if (!meta?.spriteSheet || !sheet) {
      return null;
    }

    const columns = sheet.columns ?? 0;
    const rows = sheet.rows ?? 0;
    const frameWidth = sheet.frameWidth ?? 0;
    const frameHeight = sheet.frameHeight ?? 0;
    const textureWidth = texture.width ?? texture.source?.width ?? 0;
    const textureHeight = texture.height ?? texture.source?.height ?? 0;

    if (
      columns <= 0
      || rows <= 0
      || frameWidth <= 0
      || frameHeight <= 0
      || textureWidth < columns * frameWidth
      || textureHeight < rows * frameHeight
    ) {
      return null;
    }

    const frameCount = Math.min(columns * rows, active?.frames ?? columns * rows);
    const textures = Array.from({ length: frameCount }, (_, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);

      return new Texture({
        source: texture.source,
        frame: new Rectangle(
          column * frameWidth,
          row * frameHeight,
          frameWidth,
          frameHeight,
        ),
      });
    });

    return {
      textures,
      fps: active?.fps ?? 12,
    };
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

  updateEffectAnimations(delta) {
    Object.entries(this.effectAnimations).forEach(([name, animation]) => {
      const sprite = this.effectSprites[name];

      if (!sprite?.visible || !animation?.textures?.length) {
        return;
      }

      const state = this.effectAnimationState[name] ?? { frame: 0, timer: 0 };
      const interval = 1 / Math.max(1, animation.fps ?? 12);

      state.timer += delta;

      while (state.timer >= interval) {
        state.timer -= interval;
        state.frame = (state.frame + 1) % animation.textures.length;
      }

      sprite.texture = animation.textures[state.frame];
      this.effectAnimationState[name] = state;
    });
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

    this.hp = Math.max(0, this.hp - amount);
    this.hitFlashTime = impact?.strength > 40 ? 0.22 : 0.15;
    this.hitImpact = Math.min(1.2, Math.max(this.hitImpact, amount / 95));

    if (impact?.strength > 0) {
      const dx = this.position.x - impact.from.x;
      const dy = this.position.y - impact.from.y;
      const distance = Math.max(Math.hypot(dx, dy), 1);
      const resistedStrength = impact.strength * this.knockbackResistance;
      const pushX = (dx / distance) * resistedStrength;
      const pushY = (dy / distance) * resistedStrength;

      this.position.x += pushX;
      this.position.y += pushY;
      this.velocity.x += pushX * 3.2;
      this.velocity.y += pushY * 3.2;
      this.view.position.set(this.position.x, this.position.y);
    }

    if (this.hp === 0) {
      this.isDead = true;
      this.hitFlashTime = 0.36;
      this.setAnimation('death', false, true);
    }

    return true;
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
        effect.tickTimer = type === 'poison' ? 0.6 : 0.42;
        const damage = type === 'poison' ? 2.4 * effect.power : 3.2 * effect.power;

        this.hp = Math.max(0, this.hp - damage);
        this.hitFlashTime = Math.max(this.hitFlashTime, 0.08);

        if (this.hp === 0) {
          this.isDead = true;
          this.hitFlashTime = 0.36;
        }
      }

      if (effect.duration <= 0) {
        delete this.statusEffects[type];
      }
    });
  }

  draw() {
    const bob = Math.sin(this.walkTime) * 2.4;
    const step = Math.sin(this.walkTime * 1.3) * 3.5;
    const bodyColor = this.hitFlashTime > 0 ? 0xff7a4f : 0x473028;
    const shellColor = this.hitFlashTime > 0 ? 0xffc06b : 0x221915;
    const flashAlpha = this.hitFlashTime > 0 ? 0.78 : 0.28;

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
      .circle(0, 5, this.radius + this.visualRule.ringPadding)
      .stroke({
        color: this.displayProfile.ringColor,
        width: this.displayProfile.ringWidth,
        alpha: this.displayProfile.ringAlpha,
      })
      .circle(0, 5, this.radius + this.visualRule.outerRingPadding + Math.sin(this.walkTime * 1.8) * 4)
      .stroke({ color: this.displayProfile.outerRingColor, width: 1.6, alpha: 0.46 });

    this.drawAttackWarning();

    this.label.text = this.displayLabel;
    this.label.style.fill = `#${this.displayProfile.labelColor.toString(16).padStart(6, '0')}`;
    this.labelBg
      .clear()
      .roundRect(-34, this.visualRule.labelY - 9, 68, 18, 6)
      .fill({ color: 0x060304, alpha: 0.78 })
      .stroke({ color: this.displayProfile.ringColor, width: 1.2, alpha: 0.86 });

    this.body
      .clear()
      .moveTo(-42, 26)
      .lineTo(-48 + step, 58)
      .moveTo(-10, 26)
      .lineTo(-12 - step * 0.6, 61)
      .moveTo(30, 22)
      .lineTo(34 + step * 0.45, 56)
      .stroke({ color: 0x1a1210, width: 11, cap: 'round' })
      .poly([-78, 16, -132, 31, -82, -5])
      .fill({ color: 0x170f0f })
      .ellipse(-18, bob + 3, 78, 37)
      .fill({ color: bodyColor })
      .ellipse(-20, bob - 4, 64, 27)
      .fill({ color: shellColor, alpha: 0.72 })
      .poly([-64, bob - 26, -49, bob - 52, -31, bob - 25])
      .fill({ color: 0x160d0c })
      .poly([-22, bob - 32, -4, bob - 62, 14, bob - 28])
      .fill({ color: 0x1c100e })
      .poly([40, bob - 13, 84, bob - 28, 112, bob - 10, 70, bob + 15])
      .fill({ color: 0x5a3d32 })
      .circle(88, bob - 15, 4)
      .fill({ color: 0xffe0a3 })
      .poly([104, bob - 8, 128, bob - 2, 104, bob + 6])
      .fill({ color: 0xffd36b, alpha: 0.7 })
      .ellipse(-18, bob + 3, 84, 41)
      .stroke({ color: 0xff4d38, width: 3, alpha: flashAlpha })
      .moveTo(-56, bob - 8)
      .lineTo(38, bob - 21)
      .stroke({ color: 0xff3848, width: 3.4, alpha: 0.68 });
  }

  drawAttackWarning() {
    this.attackWarning.clear();
    Object.values(this.effectSprites).forEach((sprite) => {
      sprite.visible = false;
    });

    if (!this.attackState) {
      return;
    }

    const dirX = this.attackState.dirX ?? 1;
    const dirY = this.attackState.dirY ?? 0;
    const angle = Math.atan2(dirY, dirX);
    const localOrigin = this.getAttackEffectLocalOrigin();
    const progress = 1 - Math.max(0, this.attackState.timer) / Math.max(0.01, this.attackState.total ?? 1);
    if (this.attackState.type === 'melee') {
      const radius = this.attackState.config?.radius ?? 96;
      const alpha = this.attackState.phase === 'windup'
        ? 0.22 + progress * 0.34
        : 0.28;
      const sprite = this.effectSprites.roarWave;

      this.attackWarning.rotation = 0;
      if (sprite.texture !== Texture.EMPTY) {
        sprite.visible = true;
        sprite.position.set(localOrigin.x, localOrigin.y + 5);
        sprite.rotation = 0;
        sprite.width = radius * 2.25;
        sprite.height = radius * 2.25;
        sprite.alpha = this.attackState.phase === 'windup' ? 0.12 + progress * 0.24 : 0.58;
      } else {
        this.attackWarning
          .circle(localOrigin.x, localOrigin.y + 5, radius)
          .fill({ color: 0xffd36b, alpha: alpha * 0.2 })
          .circle(localOrigin.x, localOrigin.y + 5, radius)
          .stroke({ color: 0xffd36b, width: 1.5, alpha: 0.36 });
      }
      return;
    }

    if (this.attackState.type === 'summon') {
      const radius = 78 + progress * 22;
      const sprite = this.effectSprites.summonSpore;

      this.attackWarning.rotation = 0;
      if (sprite.texture !== Texture.EMPTY) {
        sprite.visible = true;
        sprite.position.set(localOrigin.x, localOrigin.y + 5);
        sprite.rotation = 0;
        sprite.width = radius * 1.7;
        sprite.height = radius * 1.45;
        sprite.alpha = this.attackState.phase === 'windup' ? 0.12 + progress * 0.25 : 0.62;
      } else {
        this.attackWarning
          .circle(localOrigin.x, localOrigin.y + 5, 20 + progress * 18)
          .fill({ color: 0xffd36b, alpha: 0.08 + progress * 0.14 })
          .circle(localOrigin.x, localOrigin.y + 5, radius)
          .stroke({ color: 0xa9ff55, width: 1.4, alpha: 0.34 });
      }
      return;
    }

    const length = this.attackState.phase === 'windup' ? 170 : 116;
    const width = this.attackState.phase === 'windup' ? 38 : 54;
    const alpha = this.attackState.phase === 'windup' ? 0.24 + progress * 0.38 : 0.24;

    const sprite = this.attackState.phase === 'windup'
      ? this.effectSprites.chargeWarning
      : this.effectSprites.chargeSlash;
    if (sprite.texture !== Texture.EMPTY) {
      sprite.visible = true;
      sprite.position.set(localOrigin.x + Math.cos(angle) * (18 + length / 2), localOrigin.y + Math.sin(angle) * (18 + length / 2));
      sprite.rotation = angle;
      sprite.width = length;
      sprite.height = width * (this.attackState.phase === 'windup' ? 1.7 : 2.2);
      sprite.alpha = this.attackState.phase === 'windup' ? 0.1 + progress * 0.3 : 0.62;
    } else {
      this.attackWarning.rotation = angle;
      this.attackWarning
        .roundRect(localOrigin.x + 18, localOrigin.y - width / 2, length, width, 12)
        .fill({ color: this.attackState.phase === 'windup' ? 0xff3848 : 0xffd36b, alpha: alpha * 0.65 })
        .roundRect(localOrigin.x + 18, localOrigin.y - width / 2, length, width, 12)
        .stroke({ color: 0xffd36b, width: 1.6, alpha: this.attackState.phase === 'windup' ? 0.34 : 0.46 });
    }
  }

  getAttackEffectLocalOrigin() {
    if (!this.attackState) {
      return { x: 0, y: 0 };
    }

    const scaleX = Math.abs(this.view.scale.x) > 0.001 ? this.view.scale.x : 1;
    const scaleY = Math.abs(this.view.scale.y) > 0.001 ? this.view.scale.y : 1;

    return {
      x: ((this.attackState.originX ?? this.position.x) - this.position.x) / scaleX,
      y: ((this.attackState.originY ?? this.position.y) - this.position.y) / scaleY,
    };
  }
}
