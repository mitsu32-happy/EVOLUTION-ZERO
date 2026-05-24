import { Container, Graphics, Text } from 'pixi.js';
import { ASSET_KEYS, ENTITY_VISUAL_RULES } from '../data/asset_manifest.js';
import { getEnemyDisplayProfile } from '../data/enemy_display.js';
import { Boss } from '../entities/boss.js';
import { Enemy } from '../entities/enemy.js';
import { Pickup } from '../entities/pickup.js';
import { Player } from '../entities/player.js';
import { drawBackButtonFrame, drawButtonFrame, drawPanel, drawScreenBackground, UI_COLORS } from './ui_theme.js';

function enemyPreviewLabel(enemyType) {
  const profile = getEnemyDisplayProfile(enemyType);
  const displayLabel = profile.displayLabel || profile.threatClass;

  return `type: ${enemyType} / label: ${displayLabel}`;
}

const PREVIEW_ITEMS = [
  { group: 'SHEET', label: 'ヴェロキラプトル sheet', key: ASSET_KEYS.playerSheets.velociraptor, rule: { spriteWidth: 1024, spriteHeight: 1024 }, kind: 'playerSheet', dinoKey: ASSET_KEYS.player.velociraptor, sheetKey: ASSET_KEYS.playerSheets.velociraptor },
  { group: 'PLAYER', label: 'ヴェロキラプトル', key: ASSET_KEYS.player.velociraptor, rule: ENTITY_VISUAL_RULES.player, kind: 'player', dinoKey: ASSET_KEYS.player.velociraptor },
  { group: 'PLAYER', label: 'トリケラトプス', key: ASSET_KEYS.player.triceratops, rule: ENTITY_VISUAL_RULES.player, kind: 'player', dinoKey: ASSET_KEYS.player.triceratops },
  { group: 'PLAYER', label: 'ティラノサウルス', key: ASSET_KEYS.player.tyrannosaurus, rule: ENTITY_VISUAL_RULES.player, kind: 'player', dinoKey: ASSET_KEYS.player.tyrannosaurus },
  { group: 'ENEMY', label: enemyPreviewLabel('swarm'), key: ASSET_KEYS.enemies.swarm, rule: ENTITY_VISUAL_RULES.enemies.swarm, kind: 'enemy', enemyType: 'swarm' },
  { group: 'ENEMY', label: enemyPreviewLabel('fast'), key: ASSET_KEYS.enemies.fast, rule: ENTITY_VISUAL_RULES.enemies.fast, kind: 'enemy', enemyType: 'fast', mirrored: true },
  { group: 'ENEMY', label: enemyPreviewLabel('tank'), key: ASSET_KEYS.enemies.tank, rule: ENTITY_VISUAL_RULES.enemies.tank, kind: 'enemy', enemyType: 'tank', mirrored: true },
  { group: 'APEX', label: enemyPreviewLabel('boss'), key: ASSET_KEYS.bosses.mutantPredator, rule: ENTITY_VISUAL_RULES.bosses.mutantPredator, kind: 'boss', mirrored: true },
  { group: 'EXP', label: 'EXP small', key: ASSET_KEYS.pickups.expSmall, rule: ENTITY_VISUAL_RULES.pickups.expSmall, kind: 'pickup', value: 1 },
  { group: 'EXP', label: 'EXP medium', key: ASSET_KEYS.pickups.expMedium, rule: ENTITY_VISUAL_RULES.pickups.expMedium, kind: 'pickup', value: 2 },
  { group: 'EXP', label: 'EXP large', key: ASSET_KEYS.pickups.expLarge, rule: ENTITY_VISUAL_RULES.pickups.expLarge, kind: 'pickup', value: 4 },
  { group: 'EXP', label: 'EXP boss', key: ASSET_KEYS.pickups.expBoss, rule: ENTITY_VISUAL_RULES.pickups.expBoss, kind: 'pickup', value: 18 },
];

export class AssetPreviewScreen {
  constructor({ width, height, assetLoader, onBack }) {
    this.width = width;
    this.height = height;
    this.assetLoader = assetLoader;
    this.onBack = onBack;
    this.view = new Container();
    this.background = new Graphics();
    this.panel = new Graphics();
    this.backButton = this.createBackButton();
    this.title = this.createText('アセット確認', 28, '#f4f7f5', 240);
    this.titleEn = this.createText('DEV PREVIEW', 12, '#35d7ff', 160);
    this.note = this.createText('画像未配置ならfallback表示。影・リング・ラベル位置を確認します。', 10, '#91aaa4', 326);
    this.summaryBg = new Graphics();
    this.summaryText = this.createText('loaded 0 / dummy 0 / fallback 0 / missing 0', 10, '#f4f7f5', 300);
    this.missingText = this.createText('不足: 確認中', 9, '#ffd36b', 300);
    this.rows = [];
    this.reloadButton = this.createReloadButton();
    this.lastCheckedText = this.createText('最終確認 --:--:--', 9, '#91aaa4', 140);
    this.isReloading = false;

    this.view.addChild(
      this.background,
      this.panel,
      this.backButton.view,
      this.reloadButton.view,
      this.title,
      this.titleEn,
      this.note,
      this.summaryBg,
      this.summaryText,
      this.missingText,
      this.lastCheckedText,
    );
    this.backButton.view.on('pointertap', () => this.onBack?.());
    this.reloadButton.view.on('pointertap', () => this.refreshStatuses({ force: true }));
    this.createRows();
    this.drawStatic();
  }

  show() {
    this.view.visible = true;
    this.refreshStatuses();
  }

  hide() {
    this.view.visible = false;
  }

  createRows() {
    PREVIEW_ITEMS.forEach((item, index) => {
      const row = {
        item,
        view: new Container(),
        bg: new Graphics(),
        preview: new Container(),
        group: this.createText(item.group, 8, '#35d7ff', 60),
        label: this.createText(item.label, 11, '#f4f7f5', 140),
        key: this.createText(item.key, 8, '#91aaa4', 150),
        path: this.createText(this.getPathForItem(item), 7, '#6f8580', 166),
        expected: this.createText(`expected ${item.rule.spriteWidth}x${item.rule.spriteHeight}`, 8, '#ffd36b', 94),
        actual: this.createText('actual --', 8, '#91aaa4', 94),
        verdict: this.createText('PNG透過推奨', 8, '#91aaa4', 94),
        status: this.createText('', 9, '#65e878', 82),
      };

      row.view.position.set(18, 166 + index * 54);
      row.preview.position.set(42, 28);
      row.group.position.set(86, 7);
      row.label.position.set(86, 17);
      row.key.position.set(86, 32);
      row.path.position.set(86, 44);
      row.expected.anchor.set(1, 0);
      row.expected.position.set(this.width - 92, 7);
      row.actual.anchor.set(1, 0);
      row.actual.position.set(this.width - 92, 21);
      row.verdict.anchor.set(1, 0);
      row.verdict.position.set(this.width - 92, 33);
      row.status.anchor.set(1, 0);
      row.status.position.set(this.width - 92, 43);
      row.preview.addChild(this.createEntityView(item));
      row.view.addChild(
        row.bg,
        row.preview,
        row.group,
        row.label,
        row.key,
        row.path,
        row.expected,
        row.actual,
        row.verdict,
        row.status,
      );
      this.rows.push(row);
      this.view.addChild(row.view);
    });
  }

  createEntityView(item) {
    if (item.kind === 'player' || item.kind === 'playerSheet') {
      const entity = new Player({
        assetLoader: this.assetLoader,
        assetKey: item.dinoKey,
        sheetKey: item.sheetKey ?? null,
      });

      entity.view.scale.set(item.kind === 'playerSheet' ? 0.38 : 0.46);
      entity.view.position.set(0, 2);
      return entity.view;
    }

    if (item.kind === 'enemy') {
      const entity = new Enemy({
        x: 0,
        y: 0,
        enemyType: item.enemyType,
        assetLoader: this.assetLoader,
      });
      const direction = item.mirrored ? -1 : 1;
      const previewScale = item.enemyType === 'tank' ? 0.38 : item.enemyType === 'fast' ? 0.64 : 0.7;

      entity.view.scale.set(direction * entity.visualScale * previewScale, entity.visualScale * previewScale);
      entity.keepLabelReadable();
      return entity.view;
    }

    if (item.kind === 'boss') {
      const entity = new Boss({
        x: 0,
        y: 0,
        assetLoader: this.assetLoader,
      });

      entity.view.position.set(10, 0);
      entity.view.scale.set(item.mirrored ? -0.25 : 0.25, 0.25);
      entity.keepLabelReadable();
      return entity.view;
    }

    const entity = new Pickup({
      x: 0,
      y: 0,
      value: item.value,
      assetLoader: this.assetLoader,
    });

    entity.view.scale.set(Math.min(0.72, 35 / item.rule.spriteHeight));
    return entity.view;
  }

  refreshStatuses({ force = false } = {}) {
    this.isReloading = force;
    this.render();

    const keys = this.rows.map((row) => row.item.key);
    const loadTask = force
      ? this.assetLoader.reloadMany(keys)
      : Promise.all(keys.map((key) => this.assetLoader.load(key)));

    loadTask.then(() => {
      this.rebuildPreviews();
      this.lastCheckedText.text = `最終確認 ${this.formatTime(new Date())}`;
      this.isReloading = false;
      this.render();
    });
  }

  rebuildPreviews() {
    this.rows.forEach((row) => {
      const removed = row.preview.removeChildren();

      removed.forEach((child) => {
        child.destroy({ children: true });
      });

      row.preview.addChild(this.createEntityView(row.item));
    });
  }

  render() {
    const summary = {
      loaded: 0,
      dummy: 0,
      fallback: 0,
      missing: 0,
      checking: 0,
      fallbackLabels: [],
    };

    this.rows.forEach((row) => {
      const status = this.assetLoader.getStatus(row.item.key);
      const isLoaded = status.loaded;
      const isMissing = status.missing || !status.item;
      const isPending = status.pending || this.isReloading;
      const statusText = isLoaded
        ? status.dummy ? 'dummy OK' : status.spriteSheet ? 'sheet loaded' : status.placeholderProduction ? 'provisional' : 'loaded'
        : isPending ? 'checking'
          : isMissing ? 'fallback' : 'missing';
      const statusColor = isLoaded ? '#65e878' : isMissing ? '#ffd36b' : '#35d7ff';
      const sizeVerdict = this.getSizeVerdict(row.item, status);

      if (isLoaded && status.dummy) {
        summary.dummy += 1;
      } else if (isLoaded) {
        summary.loaded += 1;
      } else if (isPending) {
        summary.checking += 1;
      } else if (isMissing) {
        summary.fallback += 1;
        summary.fallbackLabels.push(row.item.label);
      } else {
        summary.missing += 1;
        summary.fallbackLabels.push(row.item.label);
      }

      drawButtonFrame(row.bg, this.width - 36, 52, {
        accent: isLoaded ? UI_COLORS.green : UI_COLORS.dna,
        glow: false,
        selected: false,
      });
      row.actual.text = status.actualWidth && status.actualHeight
        ? `actual ${status.actualWidth}x${status.actualHeight}`
        : 'actual --';
      row.actual.style.fill = isLoaded ? '#f4f7f5' : '#91aaa4';
      row.verdict.text = sizeVerdict.text;
      row.verdict.style.fill = sizeVerdict.color;
      row.status.text = status.spriteSheet && status.animations
        ? `${statusText} / anim ${Object.keys(status.animations).length}`
        : statusText;
      row.status.style.fill = statusColor;
    });

    drawButtonFrame(this.summaryBg, this.width - 36, 50, {
      accent: summary.fallback > 0 || summary.missing > 0 ? UI_COLORS.gold : UI_COLORS.green,
      glow: false,
      selected: false,
    });
    this.summaryText.text = `loaded ${summary.loaded} / dummy ${summary.dummy} / fallback ${summary.fallback} / missing ${summary.missing}`;
    this.missingText.text = summary.fallbackLabels.length > 0
      ? `不足: ${this.formatCompactList(summary.fallbackLabels)}`
      : '不足: なし / 透過PNG・余白8-14%推奨';
    this.missingText.style.fill = summary.fallbackLabels.length > 0 ? '#ffd36b' : '#65e878';

    drawButtonFrame(this.reloadButton.bg, 92, 34, {
      accent: this.isReloading ? UI_COLORS.gold : UI_COLORS.dna,
      glow: this.isReloading,
      selected: this.isReloading,
    });
    this.reloadButton.text.text = this.isReloading ? '確認中' : '再読込';
  }

  drawStatic() {
    drawScreenBackground(this.background, this.width, this.height, UI_COLORS.dna);
    drawPanel(this.panel, 12, 96, this.width - 24, this.height - 118, {
      accent: UI_COLORS.dna,
      alpha: 0.72,
      strokeAlpha: 0.28,
    });
    this.backButton.view.position.set(22, 30);
    this.reloadButton.view.position.set(this.width - 118, 34);
    this.title.anchor.set(0.5);
    this.title.position.set(this.width / 2, 42);
    this.titleEn.anchor.set(0.5);
    this.titleEn.position.set(this.width / 2, 70);
    this.note.anchor.set(0.5);
    this.note.position.set(this.width / 2, 88);
    this.summaryBg.position.set(18, 108);
    this.summaryText.position.set(36, 116);
    this.missingText.position.set(36, 134);
    this.lastCheckedText.anchor.set(1, 0);
    this.lastCheckedText.position.set(this.width - 24, 150);
  }

  getPathForItem(item) {
    const manifestItem = this.assetLoader.getItem(item.key);

    return manifestItem?.path ?? 'path 未設定';
  }

  getSizeVerdict(item, status) {
    if (!status.loaded || !status.actualWidth || !status.actualHeight) {
      return {
        text: 'PNG透過推奨',
        color: '#91aaa4',
      };
    }

    const expectedWidth = item.rule.spriteWidth;
    const expectedHeight = item.rule.spriteHeight;
    const tooSmall = status.actualWidth < expectedWidth || status.actualHeight < expectedHeight;
    const tooLarge = status.actualWidth > 1024 || status.actualHeight > 1024;

    if (tooSmall) {
      return {
        text: 'too small',
        color: '#ff6b62',
      };
    }

    if (tooLarge) {
      return {
        text: 'too large',
        color: '#ffd36b',
      };
    }

    return {
      text: 'size OK',
      color: '#65e878',
    };
  }

  formatCompactList(labels) {
    const compact = labels.slice(0, 4).join(' / ');
    const remaining = labels.length - 4;

    return remaining > 0 ? `${compact} +${remaining}` : compact;
  }

  createBackButton() {
    const view = new Container();
    const bg = new Graphics();
    const text = this.createText('←', 24, '#f4f7f5');

    drawBackButtonFrame(bg);
    text.anchor.set(0.5);
    text.position.set(26, 23);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.addChild(bg, text);

    return { view, bg, text };
  }

  createReloadButton() {
    const view = new Container();
    const bg = new Graphics();
    const text = this.createText('再読込', 12, '#f4f7f5', 76);

    text.anchor.set(0.5);
    text.position.set(46, 17);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.addChild(bg, text);

    return { view, bg, text };
  }

  formatTime(date) {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  createText(text, size, fill, wordWrapWidth = 260) {
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
