import { Assets, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';

const PHASES = {
  warning: { start: 0, end: 0.22, label: 'WARNING' },
  dna: { start: 0.22, end: 0.52, label: 'DNA RUNAWAY' },
  mutation: { start: 0.52, end: 0.78, label: 'MUTATION' },
  awakening: { start: 0.78, end: 1, label: 'AWAKENING' },
};

const TYPE_CONFIGS = {
  speed: {
    name: 'SPEED EVOLUTION',
    primary: 0x35d7ff,
    secondary: 0xa7fbff,
    danger: 0xff3848,
    message: 'NEURAL SPEED OVERDRIVE',
  },
  hunting: {
    name: 'HUNTING EVOLUTION',
    primary: 0xffc94d,
    secondary: 0xffefb0,
    danger: 0xff5a3c,
    message: 'PREDATOR INSTINCT EXPANSION',
  },
  attack: {
    name: 'ATTACK EVOLUTION',
    primary: 0xff4d38,
    secondary: 0xffb28a,
    danger: 0xff1e2f,
    message: 'FANG STRIKE MUTATION',
  },
};

const PORTRAIT_PATHS = {
  speed: 'assets/dinos/evolutions/portraits/velociraptor_speed_portrait.png',
  hunting: 'assets/dinos/evolutions/portraits/velociraptor_hunting_portrait.png',
  attack: 'assets/dinos/evolutions/portraits/velociraptor_attack_portrait.png',
};

const UI_ASSET_PATHS = {
  panel: 'assets/ui/evolution/evolution_panel.png',
  namePlate: 'assets/ui/evolution/evolution_name_plate.png',
  portraitFrame: 'assets/ui/evolution/evolution_portrait_frame.png',
  dnaRing: 'assets/ui/evolution/evolution_dna_ring.png',
  codexUpdateChip: 'assets/ui/evolution/codex_update_chip.png',
  newEvolutionChip: 'assets/ui/evolution/new_evolution_chip.png',
  flashSpeed: 'assets/ui/evolution/evolution_flash_speed.png',
  flashHunting: 'assets/ui/evolution/evolution_flash_hunting.png',
  flashAttack: 'assets/ui/evolution/evolution_flash_attack.png',
};

function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export class EvolutionSequence {
  constructor({ width, height }) {
    this.width = width;
    this.height = height;
    this.duration = 1.42;
    this.elapsed = 0;
    this.progress = 0;
    this.evolution = null;
    this.isNewDiscovery = false;
    this.config = TYPE_CONFIGS.speed;
    this.view = new Container();
    this.backdrop = new Graphics();
    this.noise = new Graphics();
    this.rings = new Graphics();
    this.dna = new Graphics();
    this.afterImages = new Graphics();
    this.shock = new Graphics();
    this.flashSprite = new Sprite(Texture.EMPTY);
    this.panelSprite = new Sprite(Texture.EMPTY);
    this.namePlateSprite = new Sprite(Texture.EMPTY);
    this.portraitFrameSprite = new Sprite(Texture.EMPTY);
    this.dnaRingSprite = new Sprite(Texture.EMPTY);
    this.codexChipSprite = new Sprite(Texture.EMPTY);
    this.panel = new Graphics();
    this.portraitSprite = new Sprite(Texture.EMPTY);
    this.codexChip = new Graphics();
    this.title = this.createText('WARNING', 28, '#ff3848');
    this.phaseText = this.createText('', 13, '#ffd36b');
    this.nameText = this.createText('', 22, '#ffffff');
    this.subText = this.createText('', 11, '#e7fff6');
    this.codexText = this.createText('', 12, '#d7fff2');
    this.portraitTextures = {};
    this.uiTextures = {};
    this.particleSeeds = Array.from({ length: 34 }, (_, index) => index * 17.37 + 3.14);

    this.view.visible = false;
    [
      this.flashSprite,
      this.panelSprite,
      this.namePlateSprite,
      this.portraitFrameSprite,
      this.dnaRingSprite,
      this.codexChipSprite,
      this.portraitSprite,
    ].forEach((sprite) => {
      sprite.anchor.set(0.5);
      sprite.visible = false;
    });
    this.portraitSprite.anchor.set(0.5);
    this.view.addChild(
      this.backdrop,
      this.flashSprite,
      this.noise,
      this.rings,
      this.dna,
      this.afterImages,
      this.shock,
      this.panelSprite,
      this.namePlateSprite,
      this.dnaRingSprite,
      this.panel,
      this.portraitSprite,
      this.portraitFrameSprite,
      this.codexChipSprite,
      this.codexChip,
      this.title,
      this.phaseText,
      this.nameText,
      this.subText,
      this.codexText,
    );
    this.loadPortraits();
    this.loadUiAssets();
  }

  show(evolution, options = {}) {
    this.evolution = evolution;
    this.config = TYPE_CONFIGS[evolution?.tag] ?? TYPE_CONFIGS.speed;
    this.isNewDiscovery = options.isNewDiscovery === true;
    this.elapsed = 0;
    this.progress = 0;
    this.view.visible = true;
    this.title.text = '!! EVOLUTION ALERT !!';
    this.nameText.text = evolution?.evolutionName ?? this.config.name;
    this.subText.text = this.config.message;
    this.codexText.text = this.isNewDiscovery ? '\u56f3\u9451\u30c7\u30fc\u30bf\u66f4\u65b0 / \u65b0\u898f\u9032\u5316\u767a\u898b' : '';
    this.applyPortraitTexture();
    this.draw({ x: this.width / 2, y: this.height / 2 });
  }

  hide() {
    this.view.visible = false;
    this.backdrop.clear();
    this.noise.clear();
    this.rings.clear();
    this.dna.clear();
    this.afterImages.clear();
    this.shock.clear();
    this.panel.clear();
    this.codexChip.clear();
    [
      this.flashSprite,
      this.panelSprite,
      this.namePlateSprite,
      this.portraitFrameSprite,
      this.dnaRingSprite,
      this.codexChipSprite,
    ].forEach((sprite) => {
      sprite.visible = false;
    });
    this.portraitSprite.visible = false;
    this.codexText.text = '';
  }

  update(delta, focusPoint) {
    if (!this.view.visible) {
      return false;
    }

    this.elapsed = Math.min(this.duration, this.elapsed + delta);
    this.progress = this.elapsed / this.duration;
    this.draw(focusPoint);

    if (this.elapsed >= this.duration) {
      this.hide();
      return false;
    }

    return true;
  }

  draw(focusPoint) {
    const focus = {
      x: Math.max(52, Math.min(this.width - 52, focusPoint.x)),
      y: Math.max(128, Math.min(this.height - 130, focusPoint.y)),
    };
    const phase = this.getPhase();
    const phaseProgress = this.getPhaseProgress(phase);
    const pulse = 0.5 + Math.sin(this.elapsed * 18) * 0.5;
    const jitter = phase === 'warning' ? Math.sin(this.elapsed * 80) * 2.8 : 0;

    this.drawBackdrop(phase, pulse);
    this.drawNoise(phase, pulse);
    this.drawRings(focus, phase, phaseProgress, pulse);
    this.drawDna(focus, phase, phaseProgress, pulse);
    this.drawAfterImages(focus, phase, phaseProgress);
    this.drawShock(focus, phase, phaseProgress);
    this.drawPanel(focus, phase, phaseProgress, pulse);
    this.drawTexts(focus, phase, jitter);
  }

  drawBackdrop(phase, pulse) {
    const dangerAlpha = phase === 'warning' ? 0.12 + pulse * 0.14 : 0.04;
    const darkAlpha = phase === 'awakening' ? 0.46 : 0.62;

    this.backdrop
      .clear()
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x010305, alpha: darkAlpha })
      .rect(0, 0, this.width, this.height)
      .fill({ color: phase === 'warning' ? this.config.danger : this.config.primary, alpha: dangerAlpha });
  }

  drawNoise(phase, pulse) {
    this.noise.clear();

    if (phase === 'warning') {
      for (let index = 0; index < 16; index += 1) {
        const y = 88 + index * 42 + Math.sin(this.elapsed * 18 + index) * 7;
        this.noise
          .moveTo(24, y)
          .lineTo(this.width - 24, y + Math.sin(index) * 9)
          .stroke({ color: index % 2 === 0 ? this.config.danger : 0xffd36b, width: 1, alpha: (0.08 + pulse * 0.16) });
      }
    }

    if (phase === 'dna' || phase === 'mutation') {
      this.particleSeeds.forEach((seed, index) => {
        const angle = seed + this.elapsed * (phase === 'mutation' ? 4.8 : 2.4);
        const radius = 42 + (index % 6) * 19;
        const x = this.width / 2 + Math.cos(angle) * radius;
        const y = this.height / 2 + Math.sin(angle * 1.3) * (radius * 1.55);

        this.noise
          .circle(x, y, 1.4 + (index % 3) * 0.7)
          .fill({ color: index % 2 === 0 ? this.config.primary : this.config.secondary, alpha: 0.34 + pulse * 0.26 });
      });
    }
  }

  drawRings(focus, phase, phaseProgress, pulse) {
    this.rings.clear();

    const baseRadius = 40 + pulse * 12;
    this.rings
      .ellipse(focus.x, focus.y + 20, baseRadius + 36, 18 + pulse * 7)
      .stroke({ color: this.config.primary, width: 2.2, alpha: 0.46 + pulse * 0.22 })
      .ellipse(focus.x, focus.y + 20, baseRadius + 12, 9 + pulse * 4)
      .stroke({ color: this.config.secondary, width: 1.4, alpha: 0.36 });

    if (phase === 'dna' || phase === 'mutation') {
      const radius = 56 + phaseProgress * 46;
      this.rings
        .circle(focus.x, focus.y, radius)
        .stroke({ color: this.config.primary, width: 2.4, alpha: 0.38 * (1 - phaseProgress) })
        .circle(focus.x, focus.y, radius * 0.58)
        .stroke({ color: this.config.secondary, width: 1.2, alpha: 0.34 });
    }
  }

  drawDna(focus, phase, phaseProgress, pulse) {
    this.dna.clear();

    if (phase === 'warning') {
      this.dna
        .roundRect(34, 126, this.width - 68, 92, 8)
        .fill({ color: 0x120507, alpha: 0.7 })
        .stroke({ color: this.config.danger, width: 1.6, alpha: 0.78 });
      return;
    }

    const height = phase === 'awakening' ? 128 : 192;
    const top = focus.y - height / 2;
    const strandWidth = phase === 'mutation' ? 54 : 38;

    for (let step = 0; step <= 18; step += 1) {
      const t = step / 18;
      const y = top + t * height;
      const wave = Math.sin(t * Math.PI * 4 + this.elapsed * 7);
      const x1 = focus.x - wave * strandWidth;
      const x2 = focus.x + wave * strandWidth;
      const alpha = 0.22 + pulse * 0.32;

      this.dna
        .circle(x1, y, 2.2 + pulse * 1.4)
        .fill({ color: this.config.primary, alpha })
        .circle(x2, y, 2.2 + pulse * 1.4)
        .fill({ color: this.config.secondary, alpha })
        .moveTo(x1, y)
        .lineTo(x2, y)
        .stroke({ color: this.config.primary, width: 1, alpha: 0.18 + pulse * 0.2 });
    }

    this.dna
      .moveTo(focus.x - strandWidth, top)
      .quadraticCurveTo(focus.x + strandWidth, focus.y, focus.x - strandWidth, top + height)
      .stroke({ color: this.config.primary, width: 2, alpha: 0.42 + pulse * 0.2 })
      .moveTo(focus.x + strandWidth, top)
      .quadraticCurveTo(focus.x - strandWidth, focus.y, focus.x + strandWidth, top + height)
      .stroke({ color: this.config.secondary, width: 2, alpha: 0.34 + pulse * 0.2 });
  }

  drawAfterImages(focus, phase, phaseProgress) {
    this.afterImages.clear();

    if (phase !== 'mutation' && phase !== 'awakening') {
      return;
    }

    const count = this.evolution?.tag === 'speed' ? 5 : 3;
    const stretch = this.evolution?.tag === 'attack' ? 12 : 24;

    for (let index = 0; index < count; index += 1) {
      const offset = (index - (count - 1) / 2) * stretch;
      const alpha = (0.24 - index * 0.025) * (phase === 'awakening' ? 1 - phaseProgress : 1);

      this.afterImages
        .ellipse(focus.x + offset, focus.y + 6, 48 + phaseProgress * 18, 18 + phaseProgress * 6)
        .fill({ color: this.config.primary, alpha })
        .ellipse(focus.x + offset + 22, focus.y - 4, 28, 10)
        .fill({ color: this.config.secondary, alpha: alpha * 0.8 });
    }
  }

  drawShock(focus, phase, phaseProgress) {
    this.shock.clear();

    if (phase !== 'awakening') {
      return;
    }

    const radius = 42 + phaseProgress * 220;
    const alpha = Math.max(0, 0.58 * (1 - phaseProgress));

    this.shock
      .circle(focus.x, focus.y, radius)
      .stroke({ color: this.config.secondary, width: 6 * (1 - phaseProgress) + 1, alpha })
      .circle(focus.x, focus.y, radius * 0.62)
      .stroke({ color: this.config.primary, width: 2.4, alpha: alpha * 0.9 });
  }

  drawPanel(focus, phase, phaseProgress, pulse) {
    this.panel.clear();
    this.codexChip.clear();
    this.flashSprite.visible = false;
    this.panelSprite.visible = false;
    this.namePlateSprite.visible = false;
    this.portraitFrameSprite.visible = false;
    this.dnaRingSprite.visible = false;
    this.codexChipSprite.visible = false;
    this.portraitSprite.visible = false;

    if (phase === 'warning') {
      this.portraitSprite.visible = false;
      return;
    }

    const alpha = phase === 'awakening'
      ? 0.78 + pulse * 0.12
      : 0.54 + phaseProgress * 0.28;
    const panelWidth = Math.min(this.width - 64, 316);
    const panelHeight = this.isNewDiscovery ? 154 : 132;
    const x = this.width / 2 - panelWidth / 2;
    const y = Math.max(190, focus.y - 156);
    const centerX = x + panelWidth / 2;
    const centerY = y + panelHeight / 2;
    const hasPortrait = Boolean(this.portraitSprite.texture && this.portraitSprite.texture !== Texture.EMPTY);

    const flashTexture = this.getFlashTexture();
    if (flashTexture) {
      const flashAlpha = phase === 'awakening'
        ? 0.66 * (1 - phaseProgress * 0.28)
        : 0.34 + phaseProgress * 0.28;
      this.flashSprite.texture = flashTexture;
      this.flashSprite.position.set(this.width / 2, centerY + 2);
      this.flashSprite.width = Math.min(this.width - 20, 372);
      this.flashSprite.height = 118;
      this.flashSprite.alpha = flashAlpha;
      this.flashSprite.visible = true;
    }

    if (this.uiTextures.panel) {
      this.panelSprite.texture = this.uiTextures.panel;
      this.panelSprite.position.set(centerX, centerY);
      this.panelSprite.width = panelWidth;
      this.panelSprite.height = panelHeight;
      this.panelSprite.alpha = 0.9;
      this.panelSprite.visible = true;
    } else {
      this.panel
        .roundRect(x, y, panelWidth, panelHeight, 12)
        .fill({ color: 0x02080b, alpha: 0.62 })
        .stroke({ color: this.config.primary, width: 2, alpha })
        .roundRect(x + 8, y + 8, panelWidth - 16, panelHeight - 16, 8)
        .stroke({ color: this.config.secondary, width: 1, alpha: alpha * 0.36 });
    }

    if (this.uiTextures.namePlate) {
      this.namePlateSprite.texture = this.uiTextures.namePlate;
      this.namePlateSprite.position.set(hasPortrait ? centerX + 44 : centerX, y + 58);
      this.namePlateSprite.width = hasPortrait ? 186 : 246;
      this.namePlateSprite.height = 42;
      this.namePlateSprite.alpha = 0.94;
      this.namePlateSprite.visible = true;
    }

    if (this.uiTextures.dnaRing) {
      this.dnaRingSprite.texture = this.uiTextures.dnaRing;
      this.dnaRingSprite.position.set(x + 58, y + 66);
      this.dnaRingSprite.width = 88;
      this.dnaRingSprite.height = 88;
      this.dnaRingSprite.alpha = 0.8 + pulse * 0.12;
      this.dnaRingSprite.visible = hasPortrait;
    }

    if (hasPortrait) {
      this.portraitSprite.position.set(x + 58, y + 66);
      this.portraitSprite.width = 74;
      this.portraitSprite.height = 74;
      this.portraitSprite.alpha = 0.92;
      this.portraitSprite.visible = true;
      if (this.uiTextures.portraitFrame) {
        this.portraitFrameSprite.texture = this.uiTextures.portraitFrame;
        this.portraitFrameSprite.position.set(x + 58, y + 66);
        this.portraitFrameSprite.width = 92;
        this.portraitFrameSprite.height = 92;
        this.portraitFrameSprite.alpha = 0.94;
        this.portraitFrameSprite.visible = true;
      }
    }

    if (this.isNewDiscovery) {
      if (this.uiTextures.codexUpdateChip ?? this.uiTextures.newEvolutionChip) {
        this.codexChipSprite.texture = this.uiTextures.codexUpdateChip ?? this.uiTextures.newEvolutionChip;
        this.codexChipSprite.position.set(centerX, y + panelHeight - 24);
        this.codexChipSprite.width = panelWidth - 44;
        this.codexChipSprite.height = 32;
        this.codexChipSprite.alpha = 0.94;
        this.codexChipSprite.visible = true;
      } else {
        this.codexChip
          .roundRect(x + 18, y + panelHeight - 36, panelWidth - 36, 24, 7)
          .fill({ color: 0x071517, alpha: 0.78 })
          .stroke({ color: 0xffd36b, width: 1.2, alpha: 0.72 });
      }
    }
  }

  drawTexts(focus, phase, jitter) {
    const currentPhase = PHASES[phase];

    this.phaseText.text = currentPhase.label;
    this.title.style.fill = phase === 'warning' ? '#ff3848' : this.toHex(this.config.primary);
    this.nameText.style.fill = this.toHex(this.config.secondary);

    this.title.anchor.set(0.5);
    this.phaseText.anchor.set(0.5);
    this.nameText.anchor.set(0.5);
    this.subText.anchor.set(0.5);
    this.codexText.anchor.set(0.5);

    this.title.position.set(this.width / 2 + jitter, 112);
    this.phaseText.position.set(this.width / 2, 148);
    const panelTop = Math.max(190, focus.y - 156);
    const textX = this.portraitSprite.visible ? this.width / 2 + 42 : this.width / 2;
    this.nameText.position.set(textX, panelTop + 52);
    this.subText.position.set(textX, panelTop + 80);
    this.codexText.position.set(this.width / 2, panelTop + (this.isNewDiscovery ? 132 : 112));

    this.nameText.alpha = phase === 'mutation' || phase === 'awakening' ? 1 : 0.48;
    this.subText.alpha = phase === 'warning' ? 0.82 : 0.7;
    this.codexText.alpha = this.isNewDiscovery && phase !== 'warning' ? 0.86 : 0;
  }

  getPhase() {
    if (this.progress < PHASES.warning.end) {
      return 'warning';
    }

    if (this.progress < PHASES.dna.end) {
      return 'dna';
    }

    if (this.progress < PHASES.mutation.end) {
      return 'mutation';
    }

    return 'awakening';
  }

  getPhaseProgress(phase) {
    const range = PHASES[phase];
    return Math.max(0, Math.min(1, (this.progress - range.start) / (range.end - range.start)));
  }

  createText(text, size, fill) {
    return new Text({
      text,
      style: {
        fill,
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: size,
        fontWeight: '700',
        letterSpacing: 0,
        align: 'center',
        wordWrap: true,
        wordWrapWidth: this.width - 56,
      },
    });
  }

  toHex(color) {
    return `#${color.toString(16).padStart(6, '0')}`;
  }

  loadPortraits() {
    Object.entries(PORTRAIT_PATHS).forEach(([tag, path]) => {
      Assets.load(assetUrl(path)).then((texture) => {
        this.portraitTextures[tag] = texture;
        if (this.evolution?.tag === tag) {
          this.applyPortraitTexture();
        }
      }).catch(() => {});
    });
  }

  loadUiAssets() {
    Object.entries(UI_ASSET_PATHS).forEach(([key, path]) => {
      Assets.load(assetUrl(path)).then((texture) => {
        this.uiTextures[key] = texture;
      }).catch(() => {});
    });
  }

  getFlashTexture() {
    if (this.evolution?.tag === 'hunting') {
      return this.uiTextures.flashHunting ?? null;
    }

    if (this.evolution?.tag === 'attack') {
      return this.uiTextures.flashAttack ?? null;
    }

    return this.uiTextures.flashSpeed ?? null;
  }

  applyPortraitTexture() {
    const texture = this.portraitTextures[this.evolution?.tag];

    if (!texture) {
      this.portraitSprite.texture = Texture.EMPTY;
      this.portraitSprite.visible = false;
      return;
    }

    this.portraitSprite.texture = texture;
  }
}
