import { Container, Graphics, Text } from 'pixi.js';
import { drawButtonFrame, drawPanel, UI_COLORS, toCssColor } from './ui_theme.js';

const EVOLUTION_COPY = {
  speed: {
    name: '高速適応変異',
    evolutionName: 'ファルクス',
    readyText: '移動と回避に特化した分岐候補です。',
  },
  hunting: {
    name: '狩猟本能変異',
    evolutionName: 'ノクスウェル',
    readyText: '索敵と群れ制圧に特化した分岐候補です。',
  },
  attack: {
    name: '攻撃適応変異',
    evolutionName: 'ウォルグラム',
    readyText: '爪撃と破壊力に特化した分岐候補です。',
  },
};

function getCandidateCopy(candidate) {
  const fallback = EVOLUTION_COPY[candidate.tag] ?? {};

  return {
    name: candidate.name ?? fallback.name,
    evolutionName: candidate.evolutionName ?? fallback.evolutionName,
    readyText: candidate.readyText ?? fallback.readyText,
  };
}

export class EvolutionReadyUi {
  constructor({ width, height, onSelect }) {
    this.width = width;
    this.height = height;
    this.onSelect = onSelect;
    this.view = new Container();
    this.backdrop = new Graphics();
    this.panel = new Graphics();
    this.title = this.createText('分岐進化候補', 29, '#ffd36b', 280);
    this.subtitle = this.createText('解析された変異候補を1つ選択', 13, '#e7fff6', 300);
    this.notice = this.createText('選択後、この出撃中の戦い方が変化します', 11, '#96d7bd', 282);
    this.cards = [];
    this.candidates = [];

    this.view.visible = false;
    this.view.eventMode = 'static';
    this.view.addChild(this.backdrop, this.panel, this.title, this.subtitle, this.notice);
    this.createCards();
    this.drawStatic();
  }

  show(candidates) {
    this.candidates = candidates.slice(0, 3);
    this.view.visible = true;
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
        marker: new Graphics(),
        name: this.createText('', 18, '#ffffff', 220),
        mutation: this.createText('', 12, '#ffd36b', 220),
        text: this.createText('', 11, '#dcece6', 232),
      };

      card.view.position.set(30, 286 + index * 106);
      card.view.eventMode = 'static';
      card.view.cursor = 'pointer';
      card.view.on('pointertap', () => {
        const candidate = this.candidates[index];

        if (candidate) {
          this.onSelect(candidate);
        }
      });
      card.view.addChild(card.bg, card.marker, card.name, card.mutation, card.text);
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
      card.view.visible = true;
      drawButtonFrame(card.bg, this.width - 60, 96, {
        accent: candidate.color,
        selected: true,
        glow: true,
      });

      card.marker
        .clear()
        .circle(40, 48, 24)
        .fill({ color: candidate.color, alpha: 0.14 })
        .stroke({ color: candidate.color, width: 2, alpha: 0.9 })
        .moveTo(26, 48)
        .lineTo(54, 34)
        .moveTo(32, 60)
        .lineTo(60, 46)
        .stroke({ color: candidate.color, width: 3, alpha: 0.84 });

      card.name.text = copy.evolutionName;
      card.mutation.text = copy.name;
      card.text.text = copy.readyText;
      card.name.style.fill = toCssColor(candidate.color);
      card.name.position.set(80, 15);
      card.mutation.position.set(80, 41);
      card.text.position.set(80, 61);
    });
  }

  drawStatic() {
    this.backdrop
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x000000, alpha: 0.72 });

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
