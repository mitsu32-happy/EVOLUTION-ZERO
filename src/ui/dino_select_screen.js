import { Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { ASSET_KEYS } from '../data/asset_manifest.js';
import { getDiscoveredEvolutionCount } from '../data/evolution_data.js';
import {
  drawBackButtonFrame,
  drawButtonFrame,
  drawPanel,
  drawScreenBackground,
  UI_COLORS,
  toCssColor,
} from './ui_theme.js';

const DEFAULT_DINO_ID = 'velociraptor';
const DEV_LOCKED_DINO_FLAG = 'mvp075LockedDino';
const DEV_LOCKED_DINO_STORAGE_KEY = 'evolutionZero.devLockedDino';

const BASE_DINOS = [
  {
    id: 'velociraptor',
    name: 'ヴェロキラプトル',
    shortName: 'ラプトル',
    type: 'スピード型',
    style: '移動が速く、細かく避けながら連続攻撃できる。',
    branchBase: 3,
    sortieNote: '軽快な動きで戦場を切り開く',
    traits: ['移動が軽い', '攻撃テンポが速い', '小回りが利く'],
    color: 0x31d7ff,
    assetKey: ASSET_KEYS.dinoSelectPortraits.velociraptor,
    heroKey: ASSET_KEYS.dinoSelectHero.velociraptor,
    locked: false,
    unlockCondition: null,
    unlockHint: null,
  },
  {
    id: 'triceratops',
    name: 'トリケラトプス',
    shortName: 'トリケラ',
    type: '防御型',
    style: '高いHPと安定感で押し負けにくい。接近戦で粘りやすい。',
    branchBase: 1,
    sortieNote: '硬さを活かして群れを受け止める',
    traits: ['HPが高い', '被ダメージ軽減', '動きは少し重い'],
    color: 0x82f06b,
    assetKey: ASSET_KEYS.dinoSelectPortraits.triceratops,
    heroKey: ASSET_KEYS.dinoSelectHero.triceratops,
    locked: false,
    unlockCondition: null,
    unlockHint: null,
  },
  {
    id: 'tyrannosaurus',
    name: 'ティラノサウルス',
    shortName: 'ティラノ',
    type: '火力型',
    style: '重い一撃と広めの攻撃範囲で強敵を削る。火力重視の選択。',
    branchBase: 2,
    sortieNote: '重火力で危険個体を押し返す',
    traits: ['攻撃力が高い', '攻撃範囲が広い', '移動が遅い'],
    color: 0xff4d38,
    assetKey: ASSET_KEYS.dinoSelectPortraits.tyrannosaurus,
    heroKey: ASSET_KEYS.dinoSelectHero.tyrannosaurus,
    locked: false,
    unlockCondition: null,
    unlockHint: null,
  },
  {
    id: 'spinosaurus',
    name: 'スピノサウルス',
    shortName: 'スピノ',
    type: '中距離型',
    style: '水刃と渦で敵をまとめて押し返す。雑魚整理と範囲維持に優れる。',
    branchBase: 0,
    sortieNote: '水流で群れを整理する',
    traits: ['中距離が得意', '範囲維持', '移動が遅い'],
    color: 0x2fdfff,
    assetKey: ASSET_KEYS.dinoSelectPortraits.spinosaurus,
    heroKey: ASSET_KEYS.dinoSelectHero.spinosaurus,
    locked: 'research',
    unlockCondition: '研究: スピノサウルス解析',
    unlockHint: '研究Pt 220で解放',
  },
  {
    id: 'ankylosaurus',
    name: 'アンキロサウルス',
    shortName: 'アンキロ',
    type: '防衛型',
    style: '装甲と尾棍で接近した敵を押し返す。高耐久の制圧候補。',
    branchBase: 0,
    sortieNote: '装甲で戦線を支える',
    traits: ['HPが高い', '近距離制圧', '移動が重い'],
    color: 0x9bd66b,
    assetKey: ASSET_KEYS.dinoSelectPortraits.ankylosaurus,
    heroKey: ASSET_KEYS.dinoSelectHero.ankylosaurus,
    locked: 'research',
    previewWhenLocked: true,
    unlockCondition: '研究: アンキロサウルス解析',
    unlockHint: 'DNA 1400 / 研究Pt 260で解放',
  },
  {
    id: 'parasaurolophus',
    name: 'パラサウロロフス',
    shortName: 'パラサ',
    type: '音波支援型',
    style: '音波で敵と資源を捉える。支援と回収補助の候補。',
    branchBase: 0,
    sortieNote: '共鳴で戦況を読む',
    traits: ['中距離支援', '回収補助', '音波攻撃'],
    color: 0x7cf7d4,
    assetKey: ASSET_KEYS.dinoSelectPortraits.parasaurolophus,
    heroKey: ASSET_KEYS.dinoSelectHero.parasaurolophus,
    locked: 'research',
    previewWhenLocked: true,
    unlockCondition: '研究: パラサウロロフス解析',
    unlockHint: 'DNA 1200 / 研究Pt 250で解放',
  },
  {
    id: 'stegosaurus',
    name: 'ステゴサウルス',
    shortName: 'ステゴ',
    type: '範囲制圧型',
    style: '背板エネルギーで周囲を押さえる。群れ処理の候補。',
    branchBase: 0,
    sortieNote: '背板衝撃で群れを抑える',
    traits: ['範囲攻撃', '高耐久', '移動が重い'],
    color: 0xffd36b,
    assetKey: ASSET_KEYS.dinoSelectPortraits.stegosaurus,
    heroKey: ASSET_KEYS.dinoSelectHero.stegosaurus,
    locked: 'research',
    previewWhenLocked: true,
    unlockCondition: '研究: ステゴサウルス解析',
    unlockHint: 'DNA 1400 / 研究Pt 270で解放',
  },
  {
    id: 'pteranodon',
    name: 'プテラノドン',
    shortName: 'プテラ',
    type: '空中支援型',
    style: '翼で距離を取り、風刃で牽制する。遠距離支援の候補。',
    branchBase: 0,
    sortieNote: '空中から風で支援する',
    traits: ['高機動', '遠距離牽制', '耐久は低め'],
    color: 0x8fdfff,
    assetKey: ASSET_KEYS.dinoSelectPortraits.pteranodon,
    heroKey: ASSET_KEYS.dinoSelectHero.pteranodon,
    locked: 'research',
    previewWhenLocked: true,
    unlockCondition: '研究: プテラノドン解析',
    unlockHint: 'DNA 1300 / 研究Pt 260で解放',
  },
  {
    id: 'compsognathus',
    name: 'コンプソグナトゥス',
    shortName: 'コンピー',
    type: '群れ連撃型',
    style: '小型の群れで素早く削る。低HP敵の処理候補。',
    branchBase: 0,
    sortieNote: '群れで弱った敵を追う',
    traits: ['攻撃テンポが速い', '小型群れ', '耐久は低い'],
    color: 0xb8fbff,
    assetKey: ASSET_KEYS.dinoSelectPortraits.compsognathus,
    heroKey: ASSET_KEYS.dinoSelectHero.compsognathus,
    locked: 'research',
    previewWhenLocked: true,
    unlockCondition: '研究: コンプソグナトゥス解析',
    unlockHint: 'DNA 1100 / 研究Pt 240で解放',
  },
  {
    id: 'ornithomimus',
    name: 'オルニトミムス',
    shortName: 'オルニ',
    type: '高速成長型',
    style: '長い脚で走り抜け、回収と成長テンポを支える候補。',
    branchBase: 0,
    sortieNote: '高速移動で資源を拾う',
    traits: ['移動が速い', '回収補助', '軽量'],
    color: 0xae73ff,
    assetKey: ASSET_KEYS.dinoSelectPortraits.ornithomimus,
    heroKey: ASSET_KEYS.dinoSelectHero.ornithomimus,
    locked: 'research',
    previewWhenLocked: true,
    unlockCondition: '研究: オルニトミムス解析',
    unlockHint: 'DNA 1200 / 研究Pt 250で解放',
  },
];

const DEV_LOCKED_DINOS = [
  {
    id: 'mvp075_locked_probe',
    name: '解析待ち',
    shortName: '未解放',
    type: '未解析',
    style: '未知個体。DNA研究で解析を進めると出撃登録される。',
    branchBase: 0,
    sortieNote: 'ロック中',
    traits: ['解析データ不足', '???', '条件未達'],
    color: 0x7b8d8a,
    locked: true,
    unlockCondition: 'DNA研究で解放',
    unlockHint: '条件未達',
  },
];

const CARD = { width: 104, height: 132, y: 114 };
const DETAIL = { x: 20, y: 266, width: 350, height: 326 };
const STATS = { x: 22, y: 610, width: 346, height: 122 };
const DINO_PAGE_SIZE = 3;

export class DinoSelectScreen {
  constructor({ width, height, gameState, saveData, assetLoader = null, onBack, onStart }) {
    this.width = width;
    this.height = height;
    this.gameState = gameState;
    this.saveData = saveData ?? {};
    this.assetLoader = assetLoader;
    this.onBack = onBack;
    this.onStart = onStart;
    this.dinos = getDinoRoster();
    this.selectedDino = this.getSafeSelectedDinoId(gameState.selectedDino);
    this.dinoPage = 0;
    this.uiTextures = new Map();
    this.dinoTextures = new Map();
    this.heroTextures = new Map();

    this.view = new Container();
    this.background = new Graphics();
    this.screenBackdrop = new Sprite(Texture.EMPTY);
    this.detailFallback = new Graphics();
    this.detailPanel = new Sprite(Texture.EMPTY);
    this.statFallback = new Graphics();
    this.statPanel = new Sprite(Texture.EMPTY);
    this.largeDinoFallback = new Graphics();
    this.largeDinoSprite = new Sprite(Texture.EMPTY);
    this.largeDinoShade = new Graphics();

    this.title = this.createText('恐竜選択', 31, '#f4f7f5', 260);
    this.subtitle = this.createText('戦い方を選び、出撃を開始', 12, '#d7fff2', 310);
    this.detailName = this.createText('', 26, '#ffffff', 220);
    this.detailType = this.createText('', 13, '#31d7ff', 110);
    this.detailStyle = this.createText('', 11, '#d7fff2', 276);
    this.branchText = this.createText('', 12, '#7cf7d4', 120);
    this.recordsText = this.createText('', 11, '#ffffff', 156);
    this.traitTitle = this.createText('初期特徴', 14, '#7cf7d4', 140);
    this.traitTexts = [
      this.createText('', 11, '#ffffff', 94),
      this.createText('', 11, '#ffffff', 94),
      this.createText('', 11, '#ffffff', 94),
    ];
    this.cards = [];
    this.pageControls = this.createPageControls();
    this.backButton = this.createSmallButton('‹');
    this.startButton = this.createLargeButton('出撃開始', '選択した恐竜で生存を開始');

    this.view.addChild(
      this.background,
      this.screenBackdrop,
      this.title,
      this.subtitle,
      this.backButton.view,
      this.detailFallback,
      this.detailPanel,
      this.largeDinoFallback,
      this.largeDinoSprite,
      this.largeDinoShade,
      this.detailName,
      this.detailType,
      this.detailStyle,
      this.statFallback,
      this.statPanel,
      this.branchText,
      this.recordsText,
      this.traitTitle,
      ...this.traitTexts,
    );

    this.createCards();
    this.view.addChild(this.pageControls.view);
    this.view.addChild(this.startButton.view);
    this.backButton.view.on('pointertap', () => this.onBack());
    this.pageControls.prev.view.on('pointertap', () => this.changeDinoPage(-1));
    this.pageControls.next.view.on('pointertap', () => this.changeDinoPage(1));
    this.startButton.view.on('pointertap', () => {
      const dino = this.getSelectedDino();
      if (this.isDinoLocked(dino)) {
        return;
      }

      this.gameState.selectedDino = this.selectedDino;
      this.onStart();
    });

    this.drawStatic();
    this.loadUiAssets();
    this.loadDinoSprites();
    this.renderSelection();
  }

  show() {
    const preferredHomeDino = this.saveData?.currentHomeDino ?? this.saveData?.favoriteDinoId ?? this.saveData?.homeDinoId;
    this.selectedDino = this.getSafeSelectedDinoId(preferredHomeDino ?? this.gameState.selectedDino ?? this.selectedDino);
    this.ensureDinoPageForSelection();
    this.renderSelection();
    this.view.visible = true;
  }

  hide() {
    this.view.visible = false;
  }

  setSaveData(saveData) {
    this.saveData = saveData ?? this.saveData;
    this.renderSelection();
  }

  loadUiAssets() {
    if (!this.assetLoader) {
      return;
    }

    Object.entries(ASSET_KEYS.dinoSelectUi ?? {}).forEach(([name, key]) => {
      this.assetLoader.load(key).then((texture) => {
        if (texture) {
          this.uiTextures.set(name, texture);
          this.renderSelection();
        }
      });
    });
  }

  loadDinoSprites() {
    if (!this.assetLoader) {
      return;
    }

    this.dinos.forEach((dino) => {
      if (dino.assetKey) {
        this.assetLoader.load(dino.assetKey).then((texture) => {
          if (texture) {
            this.dinoTextures.set(dino.id, texture);
            this.renderSelection();
          }
        });
      }

      if (dino.heroKey) {
        this.assetLoader.load(dino.heroKey).then((texture) => {
          if (texture) {
            this.heroTextures.set(dino.id, texture);
            this.renderSelection();
          }
        });
      }
    });
  }

  createCards() {
    this.dinos.forEach((dino, index) => {
      const card = {
        dino,
        view: new Container(),
        bg: new Graphics(),
        frame: new Sprite(Texture.EMPTY),
        marker: new Graphics(),
        sprite: new Sprite(Texture.EMPTY),
        name: this.createText(dino.shortName, 12, '#ffffff', 88),
        type: this.createText(dino.type, 10, '#d7fff2', 84),
      };

      card.view.position.set(24 + index * 118, CARD.y);
      card.view.eventMode = 'static';
      card.view.cursor = 'pointer';
      card.view.on('pointertap', () => {
        this.selectedDino = dino.id;
        this.ensureDinoPageForSelection();
        this.renderSelection();
      });
      card.name.anchor.set(0.5, 0);
      card.name.position.set(52, 84);
      card.type.anchor.set(0.5, 0);
      card.type.position.set(52, 110);
      card.sprite.anchor.set(0.5);
      card.sprite.position.set(52, 43);
      card.view.addChild(card.bg, card.frame, card.marker, card.sprite, card.name, card.type);
      this.cards.push(card);
      this.view.addChild(card.view);
    });
  }

  handleGamepadAction(actions) {
    if (!this.view.visible) {
      return false;
    }

    if (actions.cancelPressed) {
      this.onBack?.();
      return true;
    }

    if (actions.nextPressed) {
      this.changeDinoPage(1);
      return true;
    }

    if (actions.previousPressed) {
      this.changeDinoPage(-1);
      return true;
    }

    if (actions.downPressed) {
      this.gamepadFocusArea = 'start';
      return true;
    }

    if (actions.upPressed) {
      this.gamepadFocusArea = 'cards';
      return true;
    }

    if (this.gamepadFocusArea === 'cards' && (actions.leftPressed || actions.rightPressed)) {
      this.moveDinoSelection(actions.rightPressed ? 1 : -1);
      return true;
    }

    if (actions.confirmPressed) {
      if (this.gamepadFocusArea === 'start') {
        const dino = this.getSelectedDino();
        if (!this.isDinoLocked(dino)) {
          this.gameState.selectedDino = this.selectedDino;
          this.onStart?.();
        }
      }
      return true;
    }

    return false;
  }

  moveDinoSelection(delta) {
    const currentIndex = Math.max(0, this.dinos.findIndex((dino) => dino.id === this.selectedDino));
    const nextIndex = Math.max(0, Math.min(this.dinos.length - 1, currentIndex + delta));
    this.selectedDino = this.dinos[nextIndex].id;
    this.ensureDinoPageForSelection();
    this.renderSelection();
  }

  getGamepadFocusBounds() {
    if (this.gamepadFocusArea === 'start') {
      return { x: 34, y: Math.max(720, this.height - 108), width: this.width - 68, height: 76, radius: 12 };
    }

    const index = Math.max(0, this.dinos.findIndex((dino) => dino.id === this.selectedDino));
    const slot = index % DINO_PAGE_SIZE;
    return { x: 24 + slot * 118, y: CARD.y, width: CARD.width, height: CARD.height, radius: 12 };
  }
  renderSelection() {
    const dino = this.getSelectedDino();
    const locked = this.isDinoLocked(dino);
    const discovered = this.getDiscoveredBranchCount(dino);
    const texture = locked ? null : this.dinoTextures.get(dino.id) ?? null;
    const lockedHeroTexture = locked ? this.getLockedDinoTexture(dino) : null;
    const heroTexture = locked ? lockedHeroTexture : this.heroTextures.get(dino.id) ?? texture;

    this.ensureDinoPageForSelection();
    this.applyUiTextures();

    this.detailName.text = dino.name;
    this.detailName.style.fill = toCssColor(dino.color);
    this.detailType.text = locked ? '研究で解放' : dino.type;
    this.detailType.style.fill = locked ? '#8da49e' : toCssColor(dino.color);
    this.detailStyle.text = locked ? 'DNA研究で出撃登録に必要なデータを解析中。' : dino.style;
    this.branchText.text = locked ? '進化: 未解析' : `進化: ${discovered} / 8`;
    this.recordsText.text = locked
      ? `解放条件\n${dino.unlockCondition ?? 'DNA研究で解放'}\n${dino.unlockHint ?? '条件未達'}`
      : `出撃回数 ${this.formatNumber(this.saveData.totalRuns ?? 0)}回\n最長生存 ${this.formatTime(this.saveData.bestSurvivalTime ?? 0)}\n最多撃破 ${this.formatNumber(this.saveData.totalDefeated ?? 0)}体`;
    this.traitTitle.text = '初期特徴';
    this.traitTexts.forEach((text, index) => {
      text.text = dino.traits[index] ?? '';
    });

    this.updateStartButton(dino);
    this.drawDetail(dino, heroTexture, locked);
    this.drawStats(dino);
    this.renderCards();
    this.renderPageControls();
  }

  applyUiTextures() {
    const backdropTexture = this.uiTextures.get('screenBackdrop') ?? null;
    const detailTexture = this.uiTextures.get('dinoDetailPanel') ?? null;
    const statTexture = this.uiTextures.get('statPanel') ?? null;
    const sortieTexture = this.uiTextures.get('sortieButtonFrame') ?? null;
    const backTexture = this.uiTextures.get('backButtonFrame') ?? null;

    this.screenBackdrop.texture = backdropTexture ?? Texture.EMPTY;
    this.screenBackdrop.visible = !!backdropTexture;
    this.detailPanel.texture = detailTexture ?? Texture.EMPTY;
    this.detailPanel.visible = !!detailTexture;
    this.statPanel.texture = statTexture ?? Texture.EMPTY;
    this.statPanel.visible = !!statTexture;
    this.startButton.sprite.texture = sortieTexture ?? Texture.EMPTY;
    this.startButton.sprite.visible = !!sortieTexture;
    if (sortieTexture) {
      this.startButton.bg.clear();
    }
    this.backButton.sprite.texture = backTexture ?? Texture.EMPTY;
    this.backButton.sprite.visible = !!backTexture;
    if (backTexture) {
      this.backButton.bg.clear();
    }
  }

  drawDetail(dino, texture, locked = false) {
    this.detailPanel.position.set(DETAIL.x, DETAIL.y);
    this.detailPanel.width = DETAIL.width;
    this.detailPanel.height = DETAIL.height;

    if (this.detailPanel.visible) {
      this.detailFallback.clear();
    } else {
      drawPanel(this.detailFallback, DETAIL.x, DETAIL.y, DETAIL.width, DETAIL.height, {
        accent: dino.color,
        alpha: 0.86,
        strokeAlpha: 0.42,
      });
    }

    this.largeDinoFallback.clear();
    this.largeDinoSprite.texture = texture ?? Texture.EMPTY;
    this.largeDinoSprite.visible = !!texture;

    if (texture) {
      this.largeDinoSprite.anchor.set(0.5);
      this.largeDinoSprite.position.set(this.width / 2, 438);
      this.fitSpriteContain(
        this.largeDinoSprite,
        dino.id === 'triceratops' ? 286 : 308,
        dino.id === 'triceratops' ? 200 : 214,
      );
    } else if (locked) {
      this.drawLockedDinoSilhouette(this.largeDinoFallback, this.width / 2, 434, 1.34, 0.92);
    } else {
      this.drawDinoFallback(dino, this.largeDinoFallback, this.width / 2, 436, 1.25);
    }

    const shadowWidth = locked ? 82 : dino.id === 'triceratops' ? 80 : 90;
    const shadowY = locked ? 532 : dino.id === 'velociraptor' ? 535 : dino.id === 'triceratops' ? 531 : 533;

    this.largeDinoShade
      .clear()
      .ellipse(this.width / 2, shadowY, shadowWidth, 10)
      .fill({ color: 0x000000, alpha: 0.18 })
      .ellipse(this.width / 2, shadowY - 1, shadowWidth * 0.62, 5)
      .fill({ color: dino.color, alpha: 0.045 });
  }

  drawStats(dino) {
    this.statPanel.position.set(STATS.x, STATS.y);
    this.statPanel.width = STATS.width;
    this.statPanel.height = STATS.height;

    if (this.statPanel.visible) {
      this.statFallback.clear();
      return;
    }

    this.statFallback
      .clear()
      .roundRect(STATS.x, STATS.y, STATS.width, STATS.height, 10)
      .fill({ color: 0x061012, alpha: 0.82 })
      .stroke({ color: dino.color, width: 1, alpha: 0.36 })
      .rect(STATS.x + 14, STATS.y + 44, STATS.width - 28, 1)
      .fill({ color: dino.color, alpha: 0.24 });
  }

  renderCards() {
    this.cards.forEach((card) => {
      const index = this.dinos.findIndex((dino) => dino.id === card.dino.id);
      const page = Math.floor(index / DINO_PAGE_SIZE);
      const slot = index % DINO_PAGE_SIZE;
      const visible = page === this.dinoPage;
      const selected = card.dino.id === this.selectedDino;
      const locked = this.isDinoLocked(card.dino);
      const texture = locked
        ? this.getLockedDinoTexture(card.dino)
        : this.dinoTextures.get(card.dino.id) ?? this.heroTextures.get(card.dino.id) ?? null;
      const frameKey = locked
        ? 'lockedDinoFrame'
        : selected
          ? 'dinoCardFrameSelected'
          : 'dinoCardFrame';
      const frameTexture = this.uiTextures.get(frameKey) ?? null;

      card.view.visible = visible;
      card.view.position.set(24 + slot * 118, CARD.y);

      card.frame.texture = frameTexture ?? Texture.EMPTY;
      card.frame.visible = !!frameTexture;
      card.frame.width = CARD.width;
      card.frame.height = CARD.height;
      card.bg.clear();

      if (!frameTexture) {
        card.bg
          .roundRect(0, 0, CARD.width, CARD.height, 8)
          .fill({ color: locked ? 0x050809 : 0x071012, alpha: selected ? 0.95 : 0.72 })
          .stroke({ color: selected ? card.dino.color : locked ? 0x5b302f : 0x335059, width: selected ? 2.4 : 1, alpha: selected ? 0.95 : 0.42 });
      }

      card.marker.clear();
      card.sprite.texture = texture ?? Texture.EMPTY;
      card.sprite.visible = !!texture;

      if (texture) {
        const imageMaxWidth = card.dino.id === 'spinosaurus' ? 78 : 88;
        const imageMaxHeight = card.dino.id === 'spinosaurus' ? 52 : 56;
        card.sprite.position.set(52, card.dino.id === 'spinosaurus' ? 45 : 43);
        this.fitSpriteContain(card.sprite, imageMaxWidth, imageMaxHeight);
      } else if (locked) {
        this.drawLockedDinoSilhouette(card.marker, 52, 40, 0.52, selected ? 0.9 : 0.64);
      } else {
        this.drawDinoFallback(card.dino, card.marker, 52, 43, 0.56, selected ? 0.9 : 0.54);
      }

      card.name.text = card.dino.shortName;
      card.type.text = locked ? 'ロック中' : card.dino.type;
      card.name.style.fill = locked ? (selected ? '#d7fff2' : '#8da49e') : selected ? toCssColor(card.dino.color) : '#ffffff';
      card.type.style.fill = locked ? '#a16d6d' : selected ? '#d7fff2' : '#8da49e';
    });
  }

  fitSpriteContain(sprite, maxWidth, maxHeight) {
    const sourceWidth = sprite.texture?.width || maxWidth;
    const sourceHeight = sprite.texture?.height || maxHeight;
    const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);
    sprite.width = sourceWidth * scale;
    sprite.height = sourceHeight * scale;
  }

  getLockedDinoTexture(dino) {
    if (dino?.previewWhenLocked) {
      return this.heroTextures.get(dino.id) ?? this.dinoTextures.get(dino.id) ?? null;
    }

    if (dino?.id === 'spinosaurus') {
      return this.uiTextures.get('spinosaurusLockedSilhouette') ?? null;
    }

    return null;
  }

  renderPageControls() {
    const pageCount = this.getDinoPageCount();
    const needsPaging = pageCount > 1;

    this.pageControls.view.visible = needsPaging;

    if (!needsPaging) {
      return;
    }

    this.pageControls.prev.view.alpha = this.dinoPage > 0 ? 1 : 0.34;
    this.pageControls.prev.view.eventMode = this.dinoPage > 0 ? 'static' : 'none';
    this.pageControls.next.view.alpha = this.dinoPage < pageCount - 1 ? 1 : 0.34;
    this.pageControls.next.view.eventMode = this.dinoPage < pageCount - 1 ? 'static' : 'none';

    this.pageControls.dots.clear();
    const dotStartX = Math.round(this.width / 2 - (pageCount - 1) * 8);
    for (let i = 0; i < pageCount; i += 1) {
      const active = i === this.dinoPage;
      this.pageControls.dots
        .circle(dotStartX + i * 16, 0, active ? 4.4 : 3)
        .fill({ color: active ? 0x31d7ff : 0x7b8d8a, alpha: active ? 0.95 : 0.48 });
    }
  }

  changeDinoPage(delta) {
    const pageCount = this.getDinoPageCount();
    const nextPage = Math.max(0, Math.min(pageCount - 1, this.dinoPage + delta));

    if (nextPage === this.dinoPage) {
      return;
    }

    this.dinoPage = nextPage;
    const pageDinos = this.dinos.slice(this.dinoPage * DINO_PAGE_SIZE, (this.dinoPage + 1) * DINO_PAGE_SIZE);
    const selectableDino = pageDinos.find((dino) => !this.isDinoLocked(dino)) ?? pageDinos[0];
    if (selectableDino) {
      this.selectedDino = selectableDino.id;
    }
    this.renderSelection();
  }

  ensureDinoPageForSelection() {
    const selectedIndex = Math.max(0, this.dinos.findIndex((dino) => dino.id === this.selectedDino));
    this.dinoPage = Math.max(0, Math.min(this.getDinoPageCount() - 1, Math.floor(selectedIndex / DINO_PAGE_SIZE)));
  }

  getDinoPageCount() {
    return Math.max(1, Math.ceil(this.dinos.length / DINO_PAGE_SIZE));
  }

  drawStatic() {
    drawScreenBackground(this.background, this.width, this.height, UI_COLORS.dna);
    this.screenBackdrop.position.set(18, 246);
    this.screenBackdrop.width = this.width - 36;
    this.screenBackdrop.height = 604;
    this.screenBackdrop.alpha = 0.22;
    this.backButton.view.position.set(22, 28);
    this.title.anchor.set(0.5);
    this.title.position.set(this.width / 2, 42);
    this.subtitle.anchor.set(0.5);
    this.subtitle.position.set(this.width / 2, 80);
    this.detailName.position.set(42, 292);
    this.detailType.anchor.set(1, 0);
    this.detailType.position.set(this.width - 42, 302);
    this.detailStyle.position.set(42, 328);
    this.detailStyle.style.lineHeight = 15;
    this.detailStyle.style.breakWords = true;
    this.branchText.position.set(44, 624);
    this.recordsText.position.set(214, 624);
    this.recordsText.style.align = 'right';
    this.traitTitle.position.set(44, 690);
    this.traitTexts.forEach((text, index) => {
      text.anchor.set(0.5, 0);
      text.position.set(86 + index * 110, 704);
      text.style.align = 'center';
    });
    this.pageControls.view.position.set(0, 252);
    this.pageControls.prev.view.position.set(24, -26);
    this.pageControls.next.view.position.set(this.width - 56, -26);
    this.pageControls.dots.position.set(0, 0);
    this.startButton.view.position.set(24, this.height - 92);
  }

  createSmallButton(label) {
    const view = new Container();
    const bg = new Graphics();
    const sprite = new Sprite(Texture.EMPTY);
    const text = this.createText(label, 28, '#e7fff6');

    drawBackButtonFrame(bg);
    sprite.width = 52;
    sprite.height = 52;
    text.anchor.set(0.5);
    text.position.set(26, 23);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.addChild(bg, sprite, text);

    return { view, bg, sprite, text };
  }

  createPageControls() {
    const view = new Container();
    const prev = this.createSmallButton('‹');
    const next = this.createSmallButton('›');
    const dots = new Graphics();

    prev.view.scale.set(0.62);
    next.view.scale.set(0.62);
    view.visible = false;
    view.addChild(prev.view, next.view, dots);

    return { view, prev, next, dots };
  }

  createLargeButton(label, subLabel) {
    const view = new Container();
    const bg = new Graphics();
    const sprite = new Sprite(Texture.EMPTY);
    const text = this.createText(label, 22, '#fff0b4', 260);
    const sub = this.createText(subLabel, 11, '#ffd36b', 260);

    drawButtonFrame(bg, this.width - 48, 70, {
      variant: 'primary',
      selected: true,
      glow: true,
    });
    sprite.width = this.width - 48;
    sprite.height = 70;
    text.anchor.set(0.5);
    text.position.set((this.width - 48) / 2, 24);
    sub.anchor.set(0.5);
    sub.position.set((this.width - 48) / 2, 49);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.addChild(bg, sprite, text, sub);

    return { view, bg, sprite, text, sub };
  }

  updateStartButton(dino) {
    const locked = this.isDinoLocked(dino);

    this.startButton.text.text = locked ? '解析待ち' : '出撃開始';
    this.startButton.sub.text = locked ? `${dino.unlockCondition ?? 'DNA研究で解放'} / 条件未達` : dino.sortieNote;
    this.startButton.text.style.fill = locked ? '#8da49e' : '#fff0b4';
    this.startButton.sub.style.fill = locked ? '#a16d6d' : '#ffd36b';
    this.startButton.view.eventMode = locked ? 'none' : 'static';
    this.startButton.view.cursor = locked ? 'default' : 'pointer';
    this.startButton.view.alpha = locked ? 0.68 : 1;

    if (!this.startButton.sprite.visible) {
      drawButtonFrame(this.startButton.bg, this.width - 48, 70, {
        variant: 'primary',
        selected: true,
        glow: true,
        disabled: locked,
      });
    }
  }

  drawDinoFallback(dino, graphics, x, y, scale = 1, alpha = 1) {
    graphics
      .ellipse(x, y + 42 * scale, 62 * scale, 15 * scale)
      .fill({ color: 0x000000, alpha: 0.28 * alpha })
      .ellipse(x - 4 * scale, y, 66 * scale, 24 * scale)
      .fill({ color: 0x1d2b30, alpha: 0.95 * alpha })
      .poly([
        x + 44 * scale, y - 10 * scale,
        x + 112 * scale, y - 44 * scale,
        x + 130 * scale, y - 30 * scale,
        x + 64 * scale, y + 12 * scale,
      ])
      .fill({ color: 0x2d454b, alpha: 0.92 * alpha })
      .poly([
        x - 56 * scale, y + 4 * scale,
        x - 126 * scale, y + 26 * scale,
        x - 58 * scale, y - 12 * scale,
      ])
      .fill({ color: 0x111a1d, alpha: 0.9 * alpha })
      .circle(x + 104 * scale, y - 32 * scale, 4 * scale)
      .fill({ color: dino.color, alpha })
      .moveTo(x - 24 * scale, y + 20 * scale)
      .lineTo(x - 44 * scale, y + 64 * scale)
      .moveTo(x + 18 * scale, y + 20 * scale)
      .lineTo(x + 2 * scale, y + 68 * scale)
      .moveTo(x + 48 * scale, y + 12 * scale)
      .lineTo(x + 80 * scale, y + 58 * scale)
      .stroke({ color: dino.color, width: 4 * scale, alpha: 0.58 * alpha });
  }

  drawLockedDinoSilhouette(graphics, x, y, scale = 1, alpha = 1) {
    graphics
      .ellipse(x, y + 43 * scale, 60 * scale, 14 * scale)
      .fill({ color: 0x000000, alpha: 0.24 * alpha })
      .ellipse(x - 6 * scale, y + 3 * scale, 62 * scale, 25 * scale)
      .fill({ color: 0x11191d, alpha: 0.9 * alpha })
      .poly([
        x + 38 * scale, y - 8 * scale,
        x + 104 * scale, y - 38 * scale,
        x + 124 * scale, y - 24 * scale,
        x + 58 * scale, y + 13 * scale,
      ])
      .fill({ color: 0x1a252a, alpha: 0.9 * alpha })
      .poly([
        x - 50 * scale, y + 8 * scale,
        x - 118 * scale, y + 28 * scale,
        x - 56 * scale, y - 11 * scale,
      ])
      .fill({ color: 0x070b0d, alpha: 0.86 * alpha })
      .circle(x + 96 * scale, y - 28 * scale, 3.4 * scale)
      .fill({ color: 0x8da49e, alpha: 0.7 * alpha })
      .roundRect(x - 15 * scale, y - 20 * scale, 30 * scale, 22 * scale, 5 * scale)
      .stroke({ color: 0x8da49e, width: 2.2 * scale, alpha: 0.46 * alpha })
      .moveTo(x - 7 * scale, y - 20 * scale)
      .quadraticCurveTo(x, y - 36 * scale, x + 7 * scale, y - 20 * scale)
      .stroke({ color: 0x8da49e, width: 2.2 * scale, alpha: 0.42 * alpha });
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
        align: 'left',
        wordWrap: true,
        wordWrapWidth,
        lineHeight: size + 4,
      },
    });
  }

  getDiscoveredBranchCount(dino) {
    if (this.isDinoLocked(dino)) {
      return 0;
    }

    const discoveredCount = getDiscoveredEvolutionCount(this.saveData.discoveredEvolutions, dino.id);

    return Math.max(dino.branchBase, Math.min(8, dino.branchBase + discoveredCount));
  }

  getSafeSelectedDinoId(dinoId) {
    const dino = this.dinos.find((entry) => entry.id === dinoId);

    if (dino && !this.isDinoLocked(dino)) {
      return dino.id;
    }

    return this.dinos.find((entry) => !this.isDinoLocked(entry))?.id ?? this.dinos[0]?.id ?? DEFAULT_DINO_ID;
  }

  getSelectedDino() {
    return this.dinos.find((entry) => entry.id === this.selectedDino) ?? this.dinos[0];
  }

  isDinoLocked(dino) {
    if (!dino || dino.locked !== 'research') {
      return dino?.locked === true;
    }

    if (isDebugDinoUnlocked(dino.id)) {
      return false;
    }

    const entry = this.saveData.unlockedDinos?.[dino.id];
    return !entry?.unlocked;
  }

  formatTime(elapsedTime) {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = Math.floor(elapsedTime % 60);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  formatNumber(value) {
    return Math.floor(value).toLocaleString('ja-JP');
  }
}

function getDinoRoster() {
  return isDevLockedDinoEnabled() ? [...BASE_DINOS, ...DEV_LOCKED_DINOS] : BASE_DINOS;
}

function isDevLockedDinoEnabled() {
  if (typeof window === 'undefined') {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get(DEV_LOCKED_DINO_FLAG) === '1') {
    return true;
  }

  try {
    return window.localStorage?.getItem(DEV_LOCKED_DINO_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function isDebugDinoUnlocked(dinoId) {
  if (typeof window === 'undefined') {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  return params.get('debugUnlockDino') === dinoId
    || params.get('debugUnlockAllDinos') === '1'
    || params.get('debugNewDinoQa') === '1';
}
