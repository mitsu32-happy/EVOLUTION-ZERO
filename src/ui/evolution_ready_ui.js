import { Assets, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { drawPanel, UI_COLORS, toCssColor } from './ui_theme.js';

const EVOLUTION_COPY = {
  speed: {
    name: 'スピード型',
    evolutionName: '高速進化',
    readyText: '移動速度と手数を伸ばす進化。',
  },
  hunting: {
    name: '制圧型',
    evolutionName: '狩猟進化',
    readyText: '範囲制圧と継続火力を伸ばす進化。',
  },
  attack: {
    name: '火力型',
    evolutionName: '攻撃進化',
    readyText: '一撃火力と突破力を伸ばす進化。',
  },
  zero: {
    name: 'ZERO進化',
    evolutionName: 'ZERO進化',
    readyText: '高リスク高出力の特別進化。',
  },
};

const EVOLUTION_CARD_ASSET = 'assets/ui/selection/evolution_card_panel_a10.png';
const EVOLUTION_CARD_SELECTED_ASSET = 'assets/ui/selection/evolution_card_selected_a10.png';
const EVOLUTION_CARD_PORTRAIT_FRAME_ASSET = 'assets/ui/selection/evolution_card_portrait_frame_a10.png';
const EVOLUTION_CARD_TYPE_CHIP_ASSET = 'assets/ui/selection/evolution_card_type_chip_a10.png';
const EVOLUTION_CARD_SELECT_BUTTON_ASSET = 'assets/ui/selection/evolution_card_button_select_a10.png';
const EVOLUTION_SELECT_BACKGROUND_ASSET = 'assets/ui/selection/evolution_select_background_a10b.png';
const EVOLUTION_SELECT_OVERLAY_ASSET = 'assets/ui/selection/evolution_select_overlay_a10b.png';
const CANDIDATE_PORTRAIT_BOUNDS = { width: 70, height: 70 };

function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

function compactText(text = '', maxLength = 34) {
  const normalized = String(text).replace(/\s+/g, '');
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 3)}...` : normalized;
}

function getCandidateCopy(candidate) {
  const fallback = EVOLUTION_COPY[candidate.tag] ?? {};

  return {
    name: candidate.typeLabel ?? candidate.name ?? fallback.name ?? '進化候補',
    evolutionName: candidate.evolutionName ?? fallback.evolutionName ?? candidate.name ?? '進化候補',
    readyText: candidate.readyText ?? candidate.description ?? fallback.readyText ?? '戦い方が変化します。',
  };
}

export class EvolutionReadyUi {
  constructor({ width, height, onSelect }) {
    this.width = width;
    this.height = height;
    this.onSelect = onSelect;
    this.view = new Container();
    this.backdrop = new Graphics();
    this.backgroundSprite = new Sprite(Texture.EMPTY);
    this.panel = new Graphics();
    this.overlaySprite = new Sprite(Texture.EMPTY);
    this.title = this.createText('分岐進化', 29, '#ffd36b', 280);
    this.subtitle = this.createText('進化先を選択', 13, '#e7fff6', 300);
    this.notice = this.createText('カードをタップして進化', 11, '#96d7bd', 282);
    this.cards = [];
    this.candidates = [];
    this.candidateImages = new Map();
    this.cardTexture = null;
    this.selectedCardTexture = null;
    this.portraitFrameTexture = null;
    this.typeChipTexture = null;
    this.selectButtonTexture = null;
    this.backgroundTexture = null;
    this.overlayTexture = null;

    this.view.visible = false;
    this.view.eventMode = 'static';
    this.view.addChild(this.backdrop, this.backgroundSprite, this.panel, this.overlaySprite, this.title, this.subtitle, this.notice);
    this.createCards();
    this.drawStatic();
    this.loadCardAsset();
  }

  show(candidates) {
    this.candidates = candidates.slice(0, 3);
    this.view.visible = true;
    this.loadCandidateImages(this.candidates);
    this.renderCandidates();
  }

  hide() {
    this.view.visible = false;
  }

  createCards() {
    for (let index = 0; index < 3; index += 1) {
      const card = {
        view: new Container(),
        bg: new Graphics(),
        frame: new Sprite(Texture.EMPTY),
        portraitFrame: new Sprite(Texture.EMPTY),
        typeChip: new Sprite(Texture.EMPTY),
        selectButton: new Sprite(Texture.EMPTY),
        marker: new Graphics(),
        image: new Sprite(Texture.EMPTY),
        name: this.createText('', 18, '#ffffff', 220),
        mutation: this.createText('', 12, '#ffd36b', 220),
        text: this.createText('', 10.5, '#dcece6', 170),
      };

      card.view.position.set(28, 282 + index * 112);
      card.view.eventMode = 'static';
      card.view.cursor = 'pointer';
      card.view.on('pointertap', () => {
        const candidate = this.candidates[index];

        if (candidate) {
          this.onSelect(candidate);
        }
      });
      card.image.anchor.set(0.5);
      card.image.position.set(57, 52);
      card.view.addChild(
        card.bg,
        card.frame,
        card.marker,
        card.typeChip,
        card.portraitFrame,
        card.image,
        card.selectButton,
        card.name,
        card.mutation,
        card.text,
      );
      this.cards.push(card);
      this.view.addChild(card.view);
    }
  }

  renderCandidates() {
    this.cards.forEach((card, index) => {
      const candidate = this.candidates[index];

      if (!candidate) {
        card.view.visible = false;
        return;
      }

      const copy = getCandidateCopy(candidate);
      const imageKey = this.getCandidateImageKey(candidate);
      const imageTexture = this.candidateImages.get(imageKey) ?? null;
      const color = candidate.color ?? UI_COLORS.dna;
      card.view.visible = true;

      card.bg.clear();
      const frameTexture = candidate.tag === 'zero'
        ? this.selectedCardTexture ?? this.cardTexture
        : this.cardTexture;
      card.frame.texture = frameTexture ?? Texture.EMPTY;
      card.frame.visible = Boolean(frameTexture);
      if (frameTexture) {
        card.frame.position.set(-5, -5);
        card.frame.width = this.width - 42;
        card.frame.height = 112;
      } else {
        card.bg
          .roundRect(0, 0, this.width - 54, 104, 12)
          .fill({ color: 0x06121a, alpha: 0.92 })
          .stroke({ color, width: 2, alpha: 0.82 });
      }

      card.marker.clear();
      card.typeChip.texture = this.typeChipTexture ?? Texture.EMPTY;
      card.typeChip.visible = Boolean(this.typeChipTexture);
      if (this.typeChipTexture) {
        card.typeChip.position.set(108, 39);
        card.typeChip.width = 104;
        card.typeChip.height = 25;
        card.typeChip.alpha = 0.62;
      }

      card.selectButton.texture = this.selectButtonTexture ?? Texture.EMPTY;
      card.selectButton.visible = Boolean(this.selectButtonTexture);
      if (this.selectButtonTexture) {
        card.selectButton.position.set(this.width - 124, 70);
        card.selectButton.width = 70;
        card.selectButton.height = 25;
        card.selectButton.alpha = 0.64;
      }

      card.image.texture = imageTexture ?? Texture.EMPTY;
      card.image.visible = !!imageTexture;
      if (imageTexture) {
        const scale = Math.min(
          CANDIDATE_PORTRAIT_BOUNDS.width / imageTexture.width,
          CANDIDATE_PORTRAIT_BOUNDS.height / imageTexture.height,
        );
        card.image.width = imageTexture.width * scale;
        card.image.height = imageTexture.height * scale;
        if (this.portraitFrameTexture) {
          card.portraitFrame.texture = this.portraitFrameTexture;
          card.portraitFrame.position.set(12, 8);
          card.portraitFrame.width = 90;
          card.portraitFrame.height = 90;
          card.portraitFrame.alpha = 0.95;
          card.portraitFrame.visible = true;
        } else {
          card.marker
            .circle(57, 52, 36)
            .fill({ color, alpha: 0.12 })
            .stroke({ color, width: 1.5, alpha: 0.78 });
          card.portraitFrame.visible = false;
        }
      } else {
        card.portraitFrame.visible = false;
        card.marker
          .circle(57, 52, 28)
          .fill({ color, alpha: 0.14 })
          .stroke({ color, width: 2, alpha: 0.9 });
      }

      card.name.text = compactText(copy.evolutionName, 14);
      card.mutation.text = compactText(copy.name, 14);
      card.text.text = compactText(copy.readyText, 30);
      card.name.style.fill = toCssColor(color);
      card.name.style.fontSize = 17;
      card.name.style.wordWrapWidth = 156;
      card.mutation.style.fontSize = 11;
      card.mutation.style.wordWrapWidth = 150;
      card.text.style.fontSize = 9.8;
      card.text.style.lineHeight = 12;
      card.text.style.wordWrapWidth = 172;
      card.name.position.set(112, 13);
      card.mutation.position.set(112, 42);
      card.text.position.set(112, 67);
    });
  }

  loadCandidateImages(candidates) {
    candidates.forEach((candidate) => {
      const imagePath = candidate.portraitPath ?? candidate.heroPath ?? candidate.image ?? null;
      const key = this.getCandidateImageKey(candidate);

      if (!imagePath || this.candidateImages.has(key)) {
        return;
      }

      Assets.load(assetUrl(imagePath))
        .then((texture) => {
          if (texture) {
            this.candidateImages.set(key, texture);
            if (this.view.visible) {
              this.renderCandidates();
            }
          }
        })
        .catch(() => {});
    });
  }

  getCandidateImageKey(candidate) {
    return candidate.id ?? `${candidate.dinoId ?? 'unknown'}:${candidate.tag ?? 'candidate'}`;
  }

  loadCardAsset() {
    Assets.load(assetUrl(EVOLUTION_CARD_ASSET))
      .then((texture) => {
        this.cardTexture = texture ?? null;
        if (this.view.visible) {
          this.renderCandidates();
        }
      })
      .catch(() => {});
    Assets.load(assetUrl(EVOLUTION_CARD_SELECTED_ASSET))
      .then((texture) => {
        this.selectedCardTexture = texture ?? null;
        if (this.view.visible) {
          this.renderCandidates();
        }
      })
      .catch(() => {});
    Assets.load(assetUrl(EVOLUTION_CARD_PORTRAIT_FRAME_ASSET))
      .then((texture) => {
        this.portraitFrameTexture = texture ?? null;
        if (this.view.visible) {
          this.renderCandidates();
        }
      })
      .catch(() => {});
    Assets.load(assetUrl(EVOLUTION_CARD_TYPE_CHIP_ASSET))
      .then((texture) => {
        this.typeChipTexture = texture ?? null;
        if (this.view.visible) {
          this.renderCandidates();
        }
      })
      .catch(() => {});
    Assets.load(assetUrl(EVOLUTION_CARD_SELECT_BUTTON_ASSET))
      .then((texture) => {
        this.selectButtonTexture = texture ?? null;
        if (this.view.visible) {
          this.renderCandidates();
        }
      })
      .catch(() => {});
    Assets.load(assetUrl(EVOLUTION_SELECT_BACKGROUND_ASSET))
      .then((texture) => {
        this.backgroundTexture = texture ?? null;
        this.drawStatic();
      })
      .catch(() => {});
    Assets.load(assetUrl(EVOLUTION_SELECT_OVERLAY_ASSET))
      .then((texture) => {
        this.overlayTexture = texture ?? null;
        this.drawStatic();
      })
      .catch(() => {});
  }

  drawStatic() {
    this.panel.clear();
    this.backgroundSprite.visible = false;
    this.overlaySprite.visible = false;

    this.backdrop
      .clear()
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x000000, alpha: 0.72 });

    if (this.backgroundTexture) {
      this.backgroundSprite.texture = this.backgroundTexture;
      this.backgroundSprite.position.set(24, 176);
      this.backgroundSprite.width = this.width - 48;
      this.backgroundSprite.height = 500;
      this.backgroundSprite.alpha = 0.94;
      this.backgroundSprite.visible = true;
    } else {
      drawPanel(this.panel, 22, 176, this.width - 44, 500, {
        accent: UI_COLORS.gold,
        alpha: 0.84,
        radius: 12,
        strokeAlpha: 0.52,
      });
      this.panel
        .circle(this.width / 2, 238, 32)
        .fill({ color: UI_COLORS.dna, alpha: 0.08 })
        .stroke({ color: UI_COLORS.gold, width: 1.4, alpha: 0.45 });
    }

    if (this.overlayTexture) {
      this.overlaySprite.texture = this.overlayTexture;
      this.overlaySprite.position.set(22, 174);
      this.overlaySprite.width = this.width - 44;
      this.overlaySprite.height = 504;
      this.overlaySprite.alpha = 0.82;
      this.overlaySprite.visible = true;
    }

    this.title.anchor.set(0.5);
    this.title.position.set(this.width / 2, 220);
    this.subtitle.anchor.set(0.5);
    this.subtitle.position.set(this.width / 2, 254);
    this.notice.anchor.set(0.5);
    this.notice.position.set(this.width / 2, 638);
  }

  createText(text, size, fill, wordWrapWidth = 220) {
    return new Text({
      text,
      style: {
        fill,
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: size,
        fontWeight: '700',
        letterSpacing: 0,
        wordWrap: true,
        wordWrapWidth,
      },
    });
  }
}
