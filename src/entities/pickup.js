import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { ASSET_KEYS, ENTITY_VISUAL_RULES } from '../data/asset_manifest.js';
import { CollisionSystem } from '../systems/collision_system.js';

export class Pickup {
  constructor({ x, y, value = 1, type = 'exp', healAmount = 0, assetLoader = null, assetKey = null }) {
    this.view = new Container();
    this.crystal = new Graphics();
    this.glow = new Graphics();
    this.assetSprite = new Sprite();
    this.valueLabel = new Text({
      text: value >= 4 ? 'BIG' : value >= 2 ? 'EXP+' : '',
      style: {
        fill: value >= 4 ? '#fff0b0' : '#c8fbff',
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: 8,
        fontWeight: '700',
        letterSpacing: 0,
        stroke: { color: '#030708', width: 2 },
      },
    });
    this.position = { x, y };
    this.type = type;
    this.value = value;
    this.healAmount = healAmount;
    this.sizeScale = type === 'heal' ? 1.08 : Math.min(1.58, 0.78 + value * 0.16);
    this.radius = type === 'heal' ? 18 : 11 + value * 3;
    this.magnetRadius = 132;
    this.pullSpeed = 280;
    this.targeted = false;
    this.isCollected = false;
    this.floatTime = Math.random() * Math.PI * 2;
    this.assetLoader = assetLoader;
    this.assetKey = assetKey ?? this.getAssetKey();
    this.assetRequestId = 0;
    this.visualRule = this.getVisualRule();

    this.valueLabel.anchor.set(0.5);
    this.valueLabel.position.set(0, this.visualRule.labelY);
    this.assetSprite.anchor.set(this.visualRule.anchor.x, this.visualRule.anchor.y);
    this.assetSprite.visible = false;
    this.view.addChild(this.glow, this.assetSprite, this.crystal, this.valueLabel);
    this.view.position.set(x, y);
    this.loadAsset();
    this.draw();
  }

  update(delta, player, modifiers = {}) {
    if (this.isCollected) {
      return;
    }

    this.floatTime += delta * 3;
    const magnetRadius = this.magnetRadius * (modifiers.magnetRadiusMultiplier ?? 1);

    const distanceSquared = CollisionSystem.distanceSquared(
      { x: this.position.x, y: this.position.y },
      { x: player.position.x, y: player.position.y },
    );

    if (distanceSquared < magnetRadius * magnetRadius) {
      this.targeted = true;
    }

    if (this.targeted) {
      const dx = player.position.x - this.position.x;
      const dy = player.position.y - this.position.y;
      const distance = Math.max(Math.hypot(dx, dy), 1);
      const pull = this.pullSpeed * (modifiers.pullMultiplier ?? 1);

      this.position.x += (dx / distance) * pull * delta;
      this.position.y += (dy / distance) * pull * delta;
    }

    this.view.position.set(this.position.x, this.position.y + Math.sin(this.floatTime) * 4);
    this.view.alpha = 0.9 + Math.sin(this.floatTime * 1.8) * 0.1;
    this.valueLabel.visible = this.type === 'exp' && this.value >= 2;

    if (this.type === 'heal') {
      const pulse = 1 + Math.sin(this.floatTime * 2.4) * 0.08;
      this.glow.scale.set(pulse);
      this.glow.alpha = 0.88 + Math.sin(this.floatTime * 2.1) * 0.12;
    }
  }

  collect() {
    this.isCollected = true;
    this.targeted = false;
    this.view.visible = false;
  }

  setValue(value) {
    if (this.type !== 'exp') {
      return;
    }

    this.value = Math.max(1, Math.round(value));
    this.sizeScale = Math.min(1.58, 0.78 + this.value * 0.16);
    this.radius = 11 + this.value * 3;
    this.assetKey = this.getAssetKeyForValue(this.value);
    this.visualRule = this.getVisualRuleForValue(this.value);
    this.valueLabel.text = this.value >= 4 ? 'BIG' : this.value >= 2 ? 'EXP+' : '';
    this.valueLabel.position.set(0, this.visualRule.labelY);
    this.assetSprite.anchor.set(this.visualRule.anchor.x, this.visualRule.anchor.y);
    this.glow.clear();
    this.crystal.clear();
    this.draw();
    this.loadAsset();
  }

  getCollider() {
    return {
      x: this.position.x,
      y: this.position.y,
      radius: this.radius,
    };
  }

  getAssetKeyForValue(value) {
    if (value >= 12) {
      return ASSET_KEYS.pickups.expBoss;
    }

    if (value >= 4) {
      return ASSET_KEYS.pickups.expLarge;
    }

    if (value >= 2) {
      return ASSET_KEYS.pickups.expMedium;
    }

    return ASSET_KEYS.pickups.expSmall;
  }

  getAssetKey() {
    if (this.type === 'heal') {
      return ASSET_KEYS.items?.meatHeal ?? null;
    }

    return this.getAssetKeyForValue(this.value);
  }

  getVisualRuleForValue(value) {
    if (value >= 12) {
      return ENTITY_VISUAL_RULES.pickups.expBoss;
    }

    if (value >= 4) {
      return ENTITY_VISUAL_RULES.pickups.expLarge;
    }

    if (value >= 2) {
      return ENTITY_VISUAL_RULES.pickups.expMedium;
    }

    return ENTITY_VISUAL_RULES.pickups.expSmall;
  }

  getVisualRule() {
    if (this.type === 'heal') {
      return ENTITY_VISUAL_RULES.pickups.heal;
    }

    return this.getVisualRuleForValue(this.value);
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

      this.assetSprite.texture = texture;
      this.assetSprite.width = this.visualRule.spriteWidth;
      this.assetSprite.height = this.visualRule.spriteHeight;
      this.assetSprite.visible = true;
      this.crystal.visible = false;
    });
  }

  draw() {
    if (this.type === 'heal') {
      this.glow
        .circle(0, 4, this.visualRule.glowRadius)
        .fill({ color: 0x65e878, alpha: 0.22 })
        .circle(0, 4, this.visualRule.glowRadius * 0.58)
        .fill({ color: 0xffffff, alpha: 0.22 })
        .circle(0, 4, this.visualRule.glowRadius * 1.28)
        .stroke({ color: 0x65e878, width: 2.2, alpha: 0.58 })
        .circle(0, 4, this.visualRule.glowRadius * 1.62)
        .stroke({ color: 0xd8ffe6, width: 1.2, alpha: 0.34 });
      this.crystal
        .roundRect(-15, -10, 30, 22, 8)
        .fill({ color: 0x7a1c18, alpha: 0.9 })
        .stroke({ color: 0xffd36b, width: 1.6, alpha: 0.62 })
        .circle(-6, -1, 3)
        .fill({ color: 0xff6456, alpha: 0.75 })
        .circle(7, 2, 4)
        .fill({ color: 0x320707, alpha: 0.68 });
      return;
    }

    const glowColor = this.value >= 4 ? 0xffc94d : this.value >= 2 ? 0x35d7ff : 0x8d4dff;
    const crystalColor = this.value >= 4 ? 0xff9f38 : this.value >= 2 ? 0x36b8ff : 0x7f39ff;
    const highlightColor = this.value >= 4 ? 0xfff0b0 : this.value >= 2 ? 0xc8fbff : 0xd9b4ff;
    const s = this.sizeScale;

    this.glow
      .circle(0, 6, this.visualRule.glowRadius)
      .fill({ color: glowColor, alpha: 0.18 + this.value * 0.02 })
      .circle(0, 6, this.visualRule.glowRadius * 0.5)
      .fill({ color: glowColor, alpha: 0.32 + this.value * 0.026 })
      .circle(0, 6, this.visualRule.glowRadius * 1.34)
      .stroke({ color: glowColor, width: this.value >= 4 ? 2.4 : 1.4, alpha: this.value >= 2 ? 0.52 : 0.24 });
    this.glow.scale.set(s);

    this.crystal
      .poly([0, -18, 12, -3, 4, 15, -8, 14, -13, -4])
      .fill({ color: crystalColor, alpha: 0.92 })
      .stroke({ color: 0x030708, width: this.value >= 4 ? 3.2 : 2.4, alpha: 0.56 })
      .stroke({ color: highlightColor, width: this.value >= 4 ? 2 : 1.5, alpha: 0.86 })
      .poly([0, -18, 4, 15, -3, 3])
      .fill({ color: highlightColor, alpha: 0.26 });
    this.crystal.scale.set(s);
  }
}
