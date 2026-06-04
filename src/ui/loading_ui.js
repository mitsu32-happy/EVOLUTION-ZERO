import { Container, Graphics, Text } from 'pixi.js';
import { UI_COLORS } from './ui_theme.js';

const TIPS = [
  '適応Lvを上げると進化候補が出現します',
  'ZEROルートは高難度クリアで解析されます',
  'デイリーは毎日0時に更新されます',
  '研究Ptはデイリーと解析で集められます',
];

export class LoadingUi {
  constructor({ width, height }) {
    this.width = width;
    this.height = height;
    this.progress = 0;
    this.tipIndex = 0;

    this.view = new Container();
    this.backdrop = new Graphics();
    this.panel = new Graphics();
    this.barBg = new Graphics();
    this.barFill = new Graphics();
    this.title = this.createText('ロード中', 18, '#f4fffb', 300);
    this.detail = this.createText('資源読み込み中', 11, '#9fc5c0', 300);
    this.tip = this.createText(TIPS[0], 10, '#ffd36b', 300);

    this.view.visible = false;
    this.view.addChild(this.backdrop, this.panel, this.barBg, this.barFill, this.title, this.detail, this.tip);
    this.draw();
  }

  show({ title = 'ロード中', detail = '資源読み込み中', progress = 0 } = {}) {
    this.title.text = title;
    this.detail.text = detail;
    this.tip.text = TIPS[this.tipIndex % TIPS.length];
    this.tipIndex += 1;
    this.progress = Math.max(0, Math.min(1, progress));
    this.view.visible = true;
    this.draw();
  }

  update({ detail = null, progress = null } = {}) {
    if (detail !== null) {
      this.detail.text = detail;
    }
    if (progress !== null) {
      this.progress = Math.max(0, Math.min(1, progress));
    }
    this.draw();
  }

  hide() {
    this.view.visible = false;
  }

  draw() {
    const panelX = 30;
    const panelY = Math.round(this.height * 0.39);
    const panelW = this.width - 60;
    const panelH = 128;
    const barX = panelX + 28;
    const barY = panelY + 76;
    const barW = panelW - 56;
    const fillW = Math.max(8, Math.round(barW * this.progress));

    this.backdrop
      .clear()
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x010506, alpha: 0.72 });
    this.panel
      .clear()
      .roundRect(panelX, panelY, panelW, panelH, 10)
      .fill({ color: 0x071014, alpha: 0.96 })
      .stroke({ color: UI_COLORS.dna, width: 1.6, alpha: 0.72 })
      .roundRect(panelX + 8, panelY + 8, panelW - 16, panelH - 16, 8)
      .stroke({ color: 0xffc739, width: 1, alpha: 0.22 });
    this.barBg
      .clear()
      .roundRect(barX, barY, barW, 12, 6)
      .fill({ color: 0x03090b, alpha: 1 })
      .stroke({ color: UI_COLORS.line, width: 1, alpha: 0.7 });
    this.barFill
      .clear()
      .roundRect(barX, barY, fillW, 12, 6)
      .fill({ color: UI_COLORS.dna, alpha: 0.76 })
      .stroke({ color: 0xffc739, width: 1, alpha: 0.32 });

    this.title.anchor.set(0.5, 0);
    this.title.position.set(this.width / 2, panelY + 22);
    this.detail.anchor.set(0.5, 0);
    this.detail.position.set(this.width / 2, panelY + 52);
    this.tip.anchor.set(0.5, 0);
    this.tip.position.set(this.width / 2, panelY + 98);
  }

  createText(text, fontSize, fill, wordWrapWidth) {
    return new Text({
      text,
      style: {
        fontFamily: '"Zen Kaku Gothic New", "Noto Sans JP", sans-serif',
        fontSize,
        fontWeight: '700',
        fill,
        align: 'center',
        wordWrap: true,
        wordWrapWidth,
        lineHeight: Math.round(fontSize * 1.35),
      },
    });
  }
}
