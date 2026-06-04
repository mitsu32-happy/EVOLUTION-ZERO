import { Container, Graphics, Rectangle, Sprite, Texture } from 'pixi.js';
import { ENTITY_VISUAL_RULES } from '../data/asset_manifest.js';

export class Player {
  constructor({ assetLoader = null, assetKey = null, sheetKey = null } = {}) {
    this.view = new Container();
    this.placeholder = new Container();
    this.assetSprite = new Sprite();
    this.shadow = new Graphics();
    this.evolutionAura = new Graphics();
    this.body = new Graphics();
    this.legs = new Graphics();
    this.accent = new Graphics();

    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.targetVelocity = { x: 0, y: 0 };
    this.facing = { x: 0.55, y: -0.35 };
    this.state = 'idle';
    this.walkTime = 0;
    this.radius = 24;
    this.moveSpeed = 230;
    this.turnResponsiveness = 0.22;
    this.accelerationBase = 0.002;
    this.evolutionTag = null;
    this.accentColor = 0xff3f2e;
    this.accentGlowColor = 0xff8b2e;
    this.evolutionPulseTimer = 0;
    this.assetLoader = assetLoader;
    this.assetKey = null;
    this.sheetKey = null;
    this.assetRequestId = 0;
    this.sheetRequestId = 0;
    this.sheetMeta = null;
    this.sheetAnimations = {};
    this.animationName = 'idle';
    this.animationFrameIndex = 0;
    this.animationTimer = 0;
    this.animationLocked = false;
    this.visualRule = ENTITY_VISUAL_RULES.player;

    this.placeholder.addChild(this.legs, this.body, this.accent);
    this.assetSprite.anchor.set(this.visualRule.anchor.x, this.visualRule.anchor.y);
    this.assetSprite.visible = false;
    this.view.addChild(this.evolutionAura, this.shadow, this.placeholder, this.assetSprite);
    this.setAssetKey(assetKey);
    this.setSheetKey(sheetKey);
    this.draw();
  }

  getCollider() {
    return {
      x: this.position.x,
      y: this.position.y,
      radius: this.radius,
    };
  }

  clampToBounds(bounds) {
    const clampedX = Math.max(bounds.left, Math.min(bounds.right, this.position.x));
    const clampedY = Math.max(bounds.top, Math.min(bounds.bottom, this.position.y));

    if (clampedX !== this.position.x) {
      this.velocity.x = 0;
    }

    if (clampedY !== this.position.y) {
      this.velocity.y = 0;
    }

    this.position.x = clampedX;
    this.position.y = clampedY;
    this.view.position.set(this.position.x, this.position.y);
  }

  setMoveInput(input) {
    this.targetVelocity.x = input.x * this.moveSpeed * input.power;
    this.targetVelocity.y = input.y * this.moveSpeed * input.power;
    this.state = input.power > 0.12 ? 'move' : 'idle';

    if (this.state === 'move') {
      this.facing.x += (input.x - this.facing.x) * this.turnResponsiveness;
      this.facing.y += (input.y - this.facing.y) * this.turnResponsiveness;
    }
  }

  playAction(animationName) {
    if (!this.sheetAnimations[animationName]) {
      return;
    }

    this.setAnimation(animationName, animationName !== 'idle' && animationName !== 'run');
  }

  applyUpgrade(upgradeId, level) {
    if (upgradeId === 'move_speed_up') {
      this.moveSpeed += 22 + level * 4;
    }
  }

  resetStats() {
    this.moveSpeed = 230;
    this.turnResponsiveness = 0.22;
    this.accelerationBase = 0.002;
    this.evolutionTag = null;
    this.accentColor = 0xff3f2e;
    this.accentGlowColor = 0xff8b2e;
    this.evolutionPulseTimer = 0;
  }

  setAssetKey(assetKey) {
    if (!assetKey || assetKey === this.assetKey) {
      return;
    }

    this.assetKey = assetKey;
    this.assetSprite.visible = false;
    this.placeholder.visible = true;
    this.loadAsset();
  }

  setSheetKey(sheetKey) {
    if (!sheetKey || sheetKey === this.sheetKey) {
      return;
    }

    this.sheetKey = sheetKey;
    this.sheetMeta = null;
    this.sheetAnimations = {};
    this.animationName = 'idle';
    this.animationFrameIndex = 0;
    this.animationTimer = 0;
    this.animationLocked = false;
    this.assetSprite.visible = false;
    this.placeholder.visible = true;
    this.loadSheet();
  }

  setAssetKeys({ assetKey = null, sheetKey = null } = {}) {
    this.setAssetKey(assetKey);
    this.setSheetKey(sheetKey);
  }

  loadAsset() {
    if (!this.assetLoader || !this.assetKey) {
      return;
    }

    const requestId = this.assetRequestId + 1;
    this.assetRequestId = requestId;

    this.assetLoader.load(this.assetKey).then((texture) => {
      if (!texture || requestId !== this.assetRequestId) {
        return;
      }

      if (Object.keys(this.sheetAnimations).length > 0) {
        return;
      }

      this.assetSprite.texture = texture;
      this.assetSprite.width = this.visualRule.spriteWidth;
      this.assetSprite.height = this.visualRule.spriteHeight;
      this.assetSprite.visible = true;
      this.placeholder.visible = false;
    });
  }

  loadSheet() {
    if (!this.assetLoader || !this.sheetKey) {
      return;
    }

    const requestId = this.sheetRequestId + 1;
    this.sheetRequestId = requestId;

    this.assetLoader.load(this.sheetKey).then((texture) => {
      if (!texture || requestId !== this.sheetRequestId) {
        if (!texture && requestId === this.sheetRequestId) {
          this.loadFallbackSheet(requestId);
        }
        return;
      }

      const item = this.assetLoader.getItem?.(this.sheetKey);
      this.sheetMeta = item?.meta ?? {};
      this.sheetAnimations = this.createSheetAnimations(texture, this.sheetMeta);

      if (this.sheetAnimations.idle) {
        this.setAnimation('idle', false, true);
        this.placeholder.visible = false;
        this.assetSprite.visible = true;
      }
    });
  }

  loadFallbackSheet(requestId) {
    const fallbackKey = this.assetLoader?.getItem?.(this.sheetKey)?.meta?.fallbackKey;

    if (!fallbackKey) {
      return;
    }

    this.assetLoader.load(fallbackKey).then((texture) => {
      if (!texture || requestId !== this.sheetRequestId) {
        return;
      }

      const item = this.assetLoader.getItem?.(fallbackKey);
      this.sheetMeta = item?.meta ?? {};
      this.sheetAnimations = this.createSheetAnimations(texture, this.sheetMeta);

      if (this.sheetAnimations.idle) {
        this.setAnimation('idle', false, true);
        this.placeholder.visible = false;
        this.assetSprite.visible = true;
      }
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

    if (!animation) {
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
    if (!this.sheetAnimations[this.animationName]) {
      return;
    }

    if (!this.animationLocked) {
      this.setAnimation(this.state === 'move' ? 'run' : 'idle');
    }

    const animation = this.sheetAnimations[this.animationName];
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
          this.setAnimation(this.state === 'move' ? 'run' : 'idle', false, true);
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
    this.placeholder.visible = false;
  }

  applyDinoConfig(config) {
    if (!config) {
      return;
    }

    this.moveSpeed += config.moveSpeedBonus ?? 0;
    this.turnResponsiveness += config.turnResponsivenessBonus ?? 0;
    this.accelerationBase = config.accelerationBase ?? this.accelerationBase;

    if (config.accentColor) {
      this.accentColor = config.accentColor;
      this.accentGlowColor = config.accentColor;
    }
  }

  applyEvolution(evolution) {
    if (!evolution) {
      return;
    }

    this.evolutionTag = evolution.tag;
    this.evolutionPulseTimer = 0.72;

    if (evolution.tag === 'speed') {
      this.moveSpeed += 82;
      this.turnResponsiveness = 0.42;
      this.accelerationBase = 0.0004;
      this.accentColor = 0x35d7ff;
      this.accentGlowColor = 0x81f0ff;
    }

    if (evolution.tag === 'hunting') {
      this.moveSpeed += 34;
      this.turnResponsiveness = 0.32;
      this.accentColor = 0xffc94d;
      this.accentGlowColor = 0xffe28a;
    }

    if (evolution.tag === 'attack') {
      this.moveSpeed += 18;
      this.turnResponsiveness = 0.24;
      this.accentColor = 0xff4d38;
      this.accentGlowColor = 0xff8a62;
    }

    if (evolution.tag === 'zero') {
      this.moveSpeed += 66;
      this.turnResponsiveness = 0.38;
      this.accentColor = 0xb94dff;
      this.accentGlowColor = 0x82f7ff;
    }
  }

  triggerEvolutionPulse(duration = 0.72) {
    this.evolutionPulseTimer = Math.max(this.evolutionPulseTimer, duration);
  }

  updateEvolutionVisuals(delta) {
    this.walkTime += delta * 4;
    this.updateAnimation(delta);
    this.evolutionPulseTimer = Math.max(0, this.evolutionPulseTimer - delta);
    this.view.position.set(this.position.x, this.position.y);
    this.draw();
  }

  updateVisuals(delta) {
    this.walkTime += delta * 2.5;
    this.updateAnimation(delta);
    this.evolutionPulseTimer = Math.max(0, this.evolutionPulseTimer - delta);
    this.view.position.set(this.position.x, this.position.y);
    this.draw();
  }

  update(delta) {
    const safeDelta = Math.min(delta, 1 / 30);
    const acceleration = 1 - Math.pow(this.accelerationBase, safeDelta);

    this.velocity.x += (this.targetVelocity.x - this.velocity.x) * acceleration;
    this.velocity.y += (this.targetVelocity.y - this.velocity.y) * acceleration;

    this.position.x += this.velocity.x * safeDelta;
    this.position.y += this.velocity.y * safeDelta;
    this.walkTime += safeDelta * (this.state === 'move' ? 9 : 2.5);
    this.updateAnimation(safeDelta);
    this.evolutionPulseTimer = Math.max(0, this.evolutionPulseTimer - safeDelta);

    this.view.position.set(this.position.x, this.position.y);
    this.view.rotation = this.facing.x * 0.1;
    this.view.scale.set(this.facing.x < 0 ? -1 : 1, 1);
    this.draw();
  }

  draw() {
    const bob = Math.sin(this.walkTime) * (this.state === 'move' ? 2.2 : 0.7);
    const step = Math.sin(this.walkTime * 1.8) * (this.state === 'move' ? 4 : 1.2);
    const pulse = this.evolutionPulseTimer > 0
      ? 0.45 + Math.sin(this.evolutionPulseTimer * 34) * 0.18
      : 0;

    this.evolutionAura.clear();

    if (this.evolutionTag) {
      const idleGlow = this.state === 'move' ? 0.16 : 0.09;
      this.evolutionAura
        .ellipse(0, 8, 58 + pulse * 16, 24 + pulse * 8)
        .fill({ color: this.accentGlowColor, alpha: idleGlow + pulse * 0.18 })
        .ellipse(0, 9, 34 + pulse * 10, 12 + pulse * 5)
        .fill({ color: this.accentGlowColor, alpha: 0.08 + pulse * 0.12 });
    }

    this.shadow
      .clear()
      .ellipse(
        this.visualRule.shadow.x,
        this.visualRule.shadow.y,
        this.visualRule.shadow.width,
        this.visualRule.shadow.height,
      )
      .fill({ color: 0x000000, alpha: this.visualRule.shadow.alpha });

    this.legs.clear();
    this.drawLeg(-12, step);
    this.drawLeg(8, -step);
    this.drawLeg(21, step * 0.6);

    this.body
      .clear()
      .poly([-54, 14, -88, 24, -58, 4])
      .fill({ color: 0x111718 })
      .ellipse(-15, bob, 44, 19)
      .fill({ color: 0x1d2826 })
      .ellipse(0, bob - 5, 39, 17)
      .fill({ color: 0x263734 })
      .poly([27, bob - 8, 55, bob - 24, 70, bob - 18, 49, bob + 2])
      .fill({ color: 0x22312f })
      .poly([62, bob - 25, 83, bob - 27, 91, bob - 19, 72, bob - 15])
      .fill({ color: 0x2d403c })
      .circle(78, bob - 22, 2.4)
      .fill({ color: 0xd7ffbf })
      .poly([85, bob - 20, 96, bob - 17, 85, bob - 14])
      .fill({ color: 0x111718 });

    this.accent
      .clear()
      .moveTo(-33, bob - 12)
      .lineTo(10, bob - 19)
      .lineTo(43, bob - 12)
      .stroke({ color: this.accentColor, width: this.evolutionTag ? 2.8 : 2, alpha: this.state === 'move' ? 0.95 : 0.6 })
      .circle(-20, bob - 2, 3)
      .fill({ color: this.accentGlowColor, alpha: this.state === 'move' ? 0.9 : 0.48 });
  }

  drawLeg(x, offset) {
    this.legs
      .moveTo(x, 12)
      .lineTo(x + offset, 34)
      .lineTo(x + offset + 13, 37)
      .stroke({ color: 0x17201e, width: 6, cap: 'round', join: 'round' })
      .moveTo(x + 7, 9)
      .lineTo(x + offset * 0.5 + 12, 28)
      .stroke({ color: 0x31443f, width: 4, cap: 'round', join: 'round' });
  }

}
