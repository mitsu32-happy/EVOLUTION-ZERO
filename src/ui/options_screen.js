import { Assets, Container, Graphics, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import { createBottomNav } from './bottom_nav.js';
import { drawBackButtonFrame, drawButtonFrame, drawPanel, drawScreenBackground, UI_COLORS } from './ui_theme.js';

const AUDIO_SLIDERS = [
  { key: 'masterVolume', label: 'マスター音量', sub: '全体の音量' },
  { key: 'bgmVolume', label: 'BGM音量', sub: 'タイトル / 戦闘BGM' },
  { key: 'seVolume', label: 'SE音量', sub: '攻撃 / 被弾 / 必殺' },
  { key: 'uiVolume', label: 'UI音量', sub: 'ボタン / 決定音' },
];

const SETTING_GROUPS = [
  {
    id: 'effects',
    label: '演出',
    description: '画面演出と数値表示を切り替えます',
    options: [
      { key: 'screenShake', label: '揺れ' },
      { key: 'flash', label: '発光' },
      { key: 'damageNumbers', label: 'ダメージ' },
      { key: 'simpleEffects', label: '簡易表示' },
    ],
  },
  {
    id: 'controls',
    label: '操作',
    description: '移動補助と危険範囲ガイドを調整します',
    options: [
      { key: 'virtualStick', label: 'スティック表示' },
      { key: 'touchAssist', label: 'タッチ補助' },
      { key: 'controlGuide', label: '警告ガイド' },
    ],
  },
  {
    id: 'display',
    label: '表示',
    description: '暗い背景やHUDの見やすさを調整します',
    options: [
      { key: 'visibilityAssist', label: '視認性補正', mode: 'visibilityCycle' },
      { key: 'backgroundDim', label: '背景暗転' },
      { key: 'hudSize', label: 'HUD', mode: 'cycle' },
    ],
  },
];

const HUD_SIZE_LABELS = {
  small: '小',
  standard: '標準',
  large: '大',
};

const HUD_SIZE_ORDER = ['small', 'standard', 'large'];
const VISIBILITY_ASSIST_ORDER = ['standard', 'bright', 'high'];

const OPTIONS_ASSETS = {
  backgroundV2: 'assets/ui/options/options_background_v2.png',
  panelV3: 'assets/ui/options/options_panel_v3.png',
  panelV2: 'assets/ui/options/options_panel_v2.png',
  rowPanelV3: 'assets/ui/options/options_slider_row_a12b.png',
  sectionPanelV3: 'assets/ui/options/options_section_panel_a12b.png',
  sliderFrameV3: 'assets/ui/options/slider_frame_v3.png',
  sliderKnobV3: 'assets/ui/options/slider_knob_v3.png',
  toggleOnV3: 'assets/ui/options/mute_toggle_on.png',
  toggleOffV3: 'assets/ui/options/mute_toggle_off.png',
  toggleDisabledV3: 'assets/ui/options/mute_toggle_disabled.png',
  optionButtonV3: 'assets/ui/options/option_button_frame_v3.png',
  devButtonV3: 'assets/ui/options/dev_button_frame_v3.png',
  chipCyanV3: 'assets/ui/options/option_chip_cyan_v3.png',
  chipAmberV3: 'assets/ui/options/option_chip_amber_v3.png',
  toggleChipOnA12b: 'assets/ui/options/options_toggle_on_a12b.png',
  toggleChipOffA12b: 'assets/ui/options/options_toggle_off_a12b.png',
  sliderFrameV2: 'assets/ui/options/slider_frame_v2.png',
  sliderKnobV2: 'assets/ui/options/slider_knob_v2.png',
  toggleOnV2: 'assets/ui/options/toggle_on_v2.png',
  toggleOffV2: 'assets/ui/options/toggle_off_v2.png',
  optionButtonV2: 'assets/ui/options/option_button_frame_v2.png',
  devButtonV2: 'assets/ui/options/dev_button_frame_v2.png',
  background: 'assets/ui/options/options_background.png',
  panel: 'assets/ui/options/options_panel.png',
  sliderFrame: 'assets/ui/options/slider_frame.png',
  toggleOn: 'assets/ui/options/toggle_on.png',
  toggleOff: 'assets/ui/options/toggle_off.png',
  optionButton: 'assets/ui/options/option_button_frame.png',
};

const SAFE = {
  panel: { x: 18, y: 104, width: 354, height: 622 },
  rowX: 42,
  rowWidth: 306,
  sliderHeight: 50,
  settingHeight: 68,
};

const CHIP_LAYOUTS = {
  effects: [
    { x: 102, y: 10, width: 86 },
    { x: 194, y: 10, width: 86 },
    { x: 102, y: 36, width: 86 },
    { x: 194, y: 36, width: 86 },
  ],
  controls: [
    { x: 102, y: 10, width: 86 },
    { x: 194, y: 10, width: 86 },
    { x: 148, y: 36, width: 86 },
  ],
  display: [
    { x: 102, y: 10, width: 86 },
    { x: 194, y: 10, width: 86 },
    { x: 148, y: 36, width: 86 },
  ],
};

const CHIP_HEIGHT = 22;

function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

function isDebugMode() {
  if (typeof window === 'undefined') {
    return false;
  }

  const params = new URLSearchParams(window.location.search);

  return [...params.keys()].some((key) => key.startsWith('debug')) || params.get('debugMode') === '1';
}

export class OptionsScreen {
  constructor({
    width,
    height,
    saveManager,
    audioManager,
    onBack,
    onHome,
    onResearch,
    onCodex,
    onOptions,
    onAssetPreview = null,
    onShowTutorial = null,
  }) {
    this.width = width;
    this.height = height;
    this.saveManager = saveManager;
    this.audioManager = audioManager;
    this.onBack = onBack;
    this.onHome = onHome;
    this.onResearch = onResearch;
    this.onCodex = onCodex;
    this.onOptions = onOptions;
    this.onAssetPreview = onAssetPreview;
    this.onShowTutorial = onShowTutorial;
    this.returnScreen = 'home';
    this.audioSettings = this.saveManager.getAudioSettings();
    this.gameplaySettings = this.saveManager.getOptionsSettings();
    this.assetTextures = {};

    this.view = new Container();
    this.background = new Graphics();
    this.backgroundSprite = new Sprite(Texture.EMPTY);
    this.panelFallback = new Graphics();
    this.panelSprite = new Sprite(Texture.EMPTY);
    this.title = this.createText('設定', 30, '#f4f7f5', 220);
    this.titleEn = this.createText('OPTIONS', 12, '#ff6b62', 120);
    this.subtitle = this.createText('音量・演出・操作・表示を調整', 11, '#cbe0da', 310);
    this.backButton = this.createSmallButton('←');
    this.sectionAudio = this.createText('音量設定', 12, '#7cf7d4', 100);
    this.sectionPlay = this.createText('プレイ設定', 12, '#7cf7d4', 100);
    this.infoText = this.createText('', 10, '#d7fff2', 260);
    this.noticeText = this.createText('', 11, '#ffd36b', 300);
    this.muteRow = this.createMuteRow();
    this.tutorialButton = this.createTutorialButton();
    this.assetPreviewButton = this.createDevButton();
    this.bottomNav = createBottomNav({
      width: this.width,
      height: this.height,
      active: 'options',
      onNavigate: (id) => this.handleNav(id),
    });
    this.sliders = [];
    this.settingRows = [];
    this.activeSlider = null;
    this.activeSliderPointerId = null;
    this.view.eventMode = 'static';
    this.view.hitArea = new Rectangle(0, 0, this.width, this.height);
    this.view.on('pointermove', (event) => this.updateActiveSliderInput(event));
    this.view.on('pointerup', (event) => this.endActiveSliderInput(event));
    this.view.on('pointerupoutside', (event) => this.endActiveSliderInput(event));
    this.view.on('pointercancel', (event) => this.endActiveSliderInput(event));

    this.backgroundSprite.visible = false;
    this.panelSprite.visible = false;
    this.view.addChild(
      this.background,
      this.backgroundSprite,
      this.panelFallback,
      this.panelSprite,
      this.backButton.view,
      this.title,
      this.titleEn,
      this.subtitle,
      this.infoText,
      this.sectionAudio,
      this.sectionPlay,
    );

    this.createSliders();
    this.view.addChild(this.muteRow.view);
    this.createSettingRows();
    this.view.addChild(this.tutorialButton.view, this.assetPreviewButton.view, this.noticeText, this.bottomNav.view);

    this.backButton.view.on('pointertap', () => this.onBack?.());
    this.muteRow.view.on('pointertap', (event) => this.handleMuteToggle(event));
    this.muteRow.hit.on('pointertap', (event) => this.handleMuteToggle(event));
    this.muteRow.toggle.on('pointertap', (event) => this.handleMuteToggle(event));
    this.muteRow.toggleFallback.on('pointertap', (event) => this.handleMuteToggle(event));
    this.assetPreviewButton.view.on('pointertap', () => {
      this.playUiClick();
      this.onAssetPreview?.();
    });
    this.tutorialButton.view.on('pointertap', () => {
      this.playUiClick();
      this.onShowTutorial?.();
    });

    this.drawStatic();
    this.loadAssets();
  }

  async loadAssets() {
    await Promise.all(Object.entries(OPTIONS_ASSETS).map(async ([key, path]) => {
      try {
        this.assetTextures[key] = await Assets.load(assetUrl(path));
      } catch {
        this.assetTextures[key] = null;
      }
    }));

    this.applyAssetTextures();
    this.render();
  }

  applyAssetTextures() {
    const backgroundTexture = this.assetTextures.backgroundV2 ?? this.assetTextures.background;
    if (backgroundTexture) {
      this.backgroundSprite.texture = backgroundTexture;
      this.backgroundSprite.position.set(0, 0);
      this.backgroundSprite.width = this.width;
      this.backgroundSprite.height = this.height;
      this.backgroundSprite.alpha = 0.82;
      this.backgroundSprite.visible = true;
      this.background.clear();
    }

    const panelTexture = this.assetTextures.panelV3 ?? this.assetTextures.panelV2 ?? this.assetTextures.panel;
    if (panelTexture) {
      this.panelSprite.texture = panelTexture;
      this.panelSprite.position.set(SAFE.panel.x, SAFE.panel.y);
      this.panelSprite.width = SAFE.panel.width;
      this.panelSprite.height = SAFE.panel.height;
      this.panelSprite.alpha = 0.22;
      this.panelSprite.visible = true;
      this.panelFallback.clear();
    }
  }

  show() {
    this.audioSettings = this.saveManager.getAudioSettings();
    this.gameplaySettings = this.saveManager.getOptionsSettings();
    this.audioManager.applySettings(this.audioSettings);
    this.applyNavigationMode();
    this.render();
    this.view.visible = true;
  }

  hide() {
    this.view.visible = false;
  }

  createSliders() {
    AUDIO_SLIDERS.forEach((item, index) => {
      const slider = {
        item,
        view: new Container(),
        frame: new Sprite(Texture.EMPTY),
        bg: new Graphics(),
        track: new Graphics(),
        fill: new Graphics(),
        knobSprite: new Sprite(Texture.EMPTY),
        knob: new Graphics(),
        hit: new Graphics(),
        label: this.createText(item.label, 13, '#f4f7f5', 108),
        sub: this.createText(item.sub, 8, '#91aaa4', 116),
        value: this.createText('', 11, '#ffd36b', 48),
      };

      slider.view.position.set(SAFE.rowX, 150 + index * 58);
      slider.view.eventMode = 'static';
      slider.view.cursor = 'pointer';
      slider.view.hitArea = new Rectangle(0, 0, SAFE.rowWidth, SAFE.sliderHeight);
      slider.view.on('pointerdown', (event) => this.startSliderInput(event, slider));
      slider.view.on('pointermove', (event) => this.updateSliderInput(event, slider));
      slider.view.on('pointerup', (event) => this.endSliderInput(event, slider));
      slider.view.on('pointerupoutside', (event) => this.endSliderInput(event, slider));
      slider.view.on('pointercancel', (event) => this.endSliderInput(event, slider));
      slider.label.position.set(22, 9);
      slider.sub.position.set(22, 28);
      slider.value.anchor.set(1, 0);
      slider.value.position.set(278, 9);
      slider.frame.visible = false;
      slider.knobSprite.visible = false;
      slider.knobSprite.anchor.set(0.5);
      slider.hit
        .rect(0, 0, SAFE.rowWidth, SAFE.sliderHeight)
        .fill({ color: 0xffffff, alpha: 0.001 });
      slider.hit.eventMode = 'static';
      slider.hit.cursor = 'pointer';
      slider.view.addChild(slider.frame, slider.bg, slider.track, slider.fill, slider.knobSprite, slider.knob, slider.hit, slider.label, slider.sub, slider.value);
      this.sliders.push(slider);
      this.view.addChild(slider.view);
    });
  }

  createMuteRow() {
    const row = this.createRowShell();
    row.label = this.createText('ミュート', 14, '#f4f7f5', 128);
    row.sub = this.createText('すべての音声を停止', 9, '#91aaa4', 150);
    row.toggle = new Sprite(Texture.EMPTY);
    row.toggleFallback = new Graphics();
    row.value = this.createText('', 10, '#d7fff2', 70);
    row.hit = new Graphics();

    row.view.position.set(SAFE.rowX, 382);
    row.view.eventMode = 'static';
    row.view.cursor = 'pointer';
    row.view.hitArea = new Rectangle(0, 0, SAFE.rowWidth, SAFE.sliderHeight);
    row.label.position.set(18, 9);
    row.sub.position.set(18, 30);
    row.toggle.position.set(218, 12);
    row.toggle.width = 70;
    row.toggle.height = 32;
    row.value.anchor.set(0.5);
    row.value.position.set(253, 28);
    row.hit
      .rect(0, 0, SAFE.rowWidth, SAFE.sliderHeight)
      .fill({ color: 0xffffff, alpha: 0.001 });
    row.hit.eventMode = 'static';
    row.hit.cursor = 'pointer';
    row.toggle.eventMode = 'static';
    row.toggle.cursor = 'pointer';
    row.toggleFallback.eventMode = 'static';
    row.toggleFallback.cursor = 'pointer';
    row.view.addChild(row.toggleFallback, row.label, row.sub, row.toggle, row.value, row.hit);

    return row;
  }

  createSettingRows() {
    SETTING_GROUPS.forEach((group, index) => {
      const row = this.createRowShell();
      row.group = group;
      row.label = this.createText(group.label, 14, '#f4f7f5', 64);
      row.description = this.createText(group.description ?? '', 8, '#91aaa4', 188);
      row.chips = [];
      row.view.position.set(SAFE.rowX, 458 + index * 70);
      row.label.anchor.set(0, 0.5);
      row.label.position.set(22, 22);
      row.description.position.set(22, 39);
      row.view.addChild(row.label, row.description);

      group.options.forEach((option, optionIndex) => {
        const layout = this.getChipLayout(group.id, optionIndex);
        const chip = {
          option,
          layout,
          view: new Container(),
          frame: new Sprite(Texture.EMPTY),
          bg: new Graphics(),
          text: this.createText('', 8, '#f4f7f5', layout.width - 8),
        };
        chip.view.position.set(layout.x, layout.y);
        chip.view.eventMode = 'static';
        chip.view.cursor = 'pointer';
        chip.view.hitArea = new Rectangle(0, 0, layout.width, CHIP_HEIGHT);
        chip.text.anchor.set(0.5);
        chip.text.position.set(layout.width / 2, CHIP_HEIGHT / 2);
        chip.view.on('pointertap', () => {
          this.toggleGameplayOption(group.id, option);
          this.playUiClick();
        });
        chip.view.addChild(chip.frame, chip.bg, chip.text);
        row.chips.push(chip);
        row.view.addChild(chip.view);
      });

      this.settingRows.push(row);
      this.view.addChild(row.view);
    });
  }

  createRowShell() {
    const row = {
      view: new Container(),
      frame: new Sprite(Texture.EMPTY),
      bg: new Graphics(),
    };
    row.frame.visible = false;
    row.view.addChild(row.frame, row.bg);
    return row;
  }

  createDevButton() {
    const row = this.createRowShell();
    row.label = this.createText('開発用: アセット確認', 12, '#d7fff2', 190);
    row.sub = this.createText('読み込み状態とfallbackを確認', 8, '#91aaa4', 190);

    row.view.position.set(SAFE.rowX, 674);
    row.view.eventMode = 'static';
    row.view.cursor = 'pointer';
    row.label.position.set(20, 8);
    row.sub.position.set(20, 29);
    row.view.addChild(row.label, row.sub);

    return row;
  }

  createTutorialButton() {
    const row = this.createRowShell();
    row.label = this.createText('チュートリアルを再表示', 12, '#e7fff6', 190);
    row.sub = this.createText('ホーム / 出撃 / プレイの基本を確認', 8, '#91aaa4', 210);

    row.view.position.set(SAFE.rowX, 674);
    row.view.eventMode = 'static';
    row.view.cursor = 'pointer';
    row.label.position.set(20, 8);
    row.sub.position.set(20, 29);
    row.view.addChild(row.label, row.sub);

    return row;
  }

  handleSliderInput(event, slider) {
    const local = this.getLocalPointer(event, slider.view);
    const startX = 132;
    const width = 134;
    const value = Math.max(0, Math.min(1, (local.x - startX) / width));

    this.setAudioSetting(slider.item.key, value);
  }

  startSliderInput(event, slider) {
    event?.stopPropagation?.();
    this.activeSlider = slider;
    this.activeSliderPointerId = this.getPointerId(event);
    this.handleSliderInput(event, slider);
  }

  updateSliderInput(event, slider) {
    if (this.activeSlider !== slider) {
      return;
    }

    const pointerId = this.getPointerId(event);

    if (this.activeSliderPointerId !== null && pointerId !== null && pointerId !== this.activeSliderPointerId) {
      return;
    }

    event?.stopPropagation?.();
    this.handleSliderInput(event, slider);
  }

  updateActiveSliderInput(event) {
    if (!this.activeSlider) {
      return;
    }

    this.updateSliderInput(event, this.activeSlider);
  }

  endSliderInput(event, slider) {
    if (this.activeSlider !== slider) {
      return;
    }

    const pointerId = this.getPointerId(event);

    if (this.activeSliderPointerId !== null && pointerId !== null && pointerId !== this.activeSliderPointerId) {
      return;
    }

    event?.stopPropagation?.();
    this.activeSlider = null;
    this.activeSliderPointerId = null;
  }

  endActiveSliderInput(event) {
    if (!this.activeSlider) {
      return;
    }

    this.endSliderInput(event, this.activeSlider);
  }

  getPointerId(event) {
    const pointerId = event?.pointerId ?? event?.data?.identifier ?? null;

    return pointerId === undefined ? null : pointerId;
  }

  getLocalPointer(event, target) {
    if (event?.getLocalPosition) {
      return event.getLocalPosition(target);
    }

    if (event?.global && target?.toLocal) {
      return target.toLocal(event.global);
    }

    return { x: 0, y: 0 };
  }

  handleMuteToggle(event) {
    event?.stopPropagation?.();
    this.setAudioSetting('muted', !this.audioSettings.muted);
    this.playUiClick();
  }

  setReturnScreen(returnScreen) {
    this.returnScreen = returnScreen ?? 'home';
    this.applyNavigationMode();
  }

  handleNav(id) {
    if (this.isPlaySettings()) {
      this.noticeText.text = 'プレイ中設定では下部ナビを使用できません';
      return;
    }

    if (id === 'home') {
      this.onHome?.();
      return;
    }

    if (id === 'research') {
      this.onResearch?.();
      return;
    }

    if (id === 'codex') {
      this.onCodex?.();
      return;
    }

    if (id === 'options') {
      this.noticeText.text = '設定を表示中です';
      this.onOptions?.();
    }
  }

  isPlaySettings() {
    return this.returnScreen === 'play';
  }

  applyNavigationMode() {
    const isPlaySettings = this.isPlaySettings();
    const showAssetPreview = !isPlaySettings && isDebugMode();
    const showTutorialButton = !isPlaySettings;

    this.backButton.view.visible = isPlaySettings;
    this.bottomNav.view.visible = !isPlaySettings;
    this.bottomNav.view.eventMode = isPlaySettings ? 'none' : 'auto';
    this.tutorialButton.view.visible = showTutorialButton;
    this.tutorialButton.view.eventMode = showTutorialButton ? 'static' : 'none';
    this.assetPreviewButton.view.visible = showAssetPreview;
    this.assetPreviewButton.view.eventMode = showAssetPreview ? 'static' : 'none';
  }

  setAudioSetting(key, value) {
    this.audioSettings = {
      ...this.audioSettings,
      [key]: value,
    };
    this.saveManager.updateAudioSettings(this.audioSettings);
    this.audioSettings = this.saveManager.getAudioSettings();
    this.audioManager.applySettings(this.audioSettings);
    this.render();
  }

  toggleGameplayOption(groupId, option) {
    const group = this.gameplaySettings[groupId] ?? {};
    const nextGroup = { ...group };

    if (option.mode === 'cycle') {
      const current = group[option.key] ?? 'standard';
      const nextIndex = (HUD_SIZE_ORDER.indexOf(current) + 1) % HUD_SIZE_ORDER.length;
      nextGroup[option.key] = HUD_SIZE_ORDER[nextIndex];
    } else if (option.mode === 'visibilityCycle') {
      const current = group[option.key] ?? 'standard';
      const currentIndex = VISIBILITY_ASSIST_ORDER.indexOf(current);
      const nextIndex = (currentIndex + 1) % VISIBILITY_ASSIST_ORDER.length;
      nextGroup[option.key] = VISIBILITY_ASSIST_ORDER[nextIndex];
    } else {
      nextGroup[option.key] = !group[option.key];
    }

    this.gameplaySettings = {
      ...this.gameplaySettings,
      [groupId]: nextGroup,
    };
    this.saveManager.updateOptionsSettings(this.gameplaySettings);
    this.gameplaySettings = this.saveManager.getOptionsSettings();
    this.render();
  }

  getChipLayout(groupId, index) {
    return CHIP_LAYOUTS[groupId]?.[index] ?? { x: 104 + index * 60, y: 20, width: 56 };
  }

  getChipText(groupId, option, rawValue) {
    const enabled = rawValue !== false;

    if (groupId === 'effects') {
      if (option.key === 'screenShake') {
        return enabled ? '揺れON' : '揺れOFF';
      }
      if (option.key === 'flash') {
        return enabled ? '発光ON' : '発光OFF';
      }
      if (option.key === 'damageNumbers') {
        return enabled ? '数字ON' : '数字OFF';
      }
      if (option.key === 'simpleEffects') {
        return enabled ? '簡易表示ON' : '簡易表示OFF';
      }
    }

    if (groupId === 'controls') {
      if (option.key === 'virtualStick') {
        return enabled ? 'スティックON' : 'スティックOFF';
      }
      if (option.key === 'touchAssist') {
        return enabled ? '補助ON' : '補助OFF';
      }
      if (option.key === 'controlGuide') {
        return enabled ? '警告ON' : '警告OFF';
      }
    }

    if (groupId === 'display') {
      if (option.key === 'visibilityAssist') {
        if (rawValue === 'high') {
          return '補正:明';
        }
        if (rawValue === 'bright') {
          return '補正:やや明';
        }
        return '補正:標準';
      }
      if (option.key === 'backgroundDim') {
        return enabled ? '背景暗転ON' : '背景暗転OFF';
      }
      if (option.key === 'hudSize') {
        if (rawValue === 'large') {
          return 'HUD大';
        }
        if (rawValue === 'small') {
          return 'HUD小';
        }
        return 'HUD標準';
      }
    }

    return option.label;
  }

  render() {
    this.renderSliders();
    this.renderMuteRow();
    this.renderSettingRows();
    this.renderTutorialButton();
    this.renderDevButton();
    this.noticeText.text = this.audioSettings.muted ? '全音声を停止中' : '';
  }

  renderSliders() {
    this.sliders.forEach((slider) => {
      const value = this.audioSettings[slider.item.key] ?? 0;
      const trackX = 132;
      const trackWidth = 134;

      this.renderRowFrame(slider, SAFE.rowWidth, SAFE.sliderHeight, this.assetTextures.sliderFrameV3 ?? this.assetTextures.sliderFrameV2 ?? this.assetTextures.sliderFrame);
      slider.track
        .clear()
        .roundRect(trackX, 36, trackWidth, 7, 4)
        .fill({ color: 0x172226, alpha: 0.92 });
      slider.fill
        .clear()
        .roundRect(trackX, 36, trackWidth * value, 7, 4)
        .fill({ color: 0xff4d38, alpha: 0.88 });
      slider.knob.clear();

      const knobTexture = this.assetTextures.sliderKnobV3 ?? this.assetTextures.sliderKnobV2;
      if (knobTexture) {
        slider.knobSprite.texture = knobTexture;
        slider.knobSprite.position.set(trackX + trackWidth * value, 39.5);
        slider.knobSprite.width = 20;
        slider.knobSprite.height = 20;
        slider.knobSprite.visible = true;
      } else {
        slider.knobSprite.visible = false;
        slider.knob
          .circle(trackX + trackWidth * value, 39.5, 9)
          .fill({ color: 0xff6b62, alpha: 0.95 })
          .stroke({ color: 0xffd1ca, width: 1, alpha: 0.72 });
      }

      slider.value.text = `${Math.round(value * 100)}%`;
    });
  }

  renderMuteRow() {
    this.renderRowFrame(this.muteRow, SAFE.rowWidth, SAFE.sliderHeight, this.assetTextures.rowPanelV3 ?? this.assetTextures.optionButtonV3 ?? this.assetTextures.optionButtonV2);

    const texture = this.audioSettings.muted
      ? (this.assetTextures.muteToggleOn ?? this.assetTextures.toggleOnV3 ?? this.assetTextures.toggleOnV2 ?? this.assetTextures.toggleOn)
      : (this.assetTextures.muteToggleOff ?? this.assetTextures.toggleOffV3 ?? this.assetTextures.toggleOffV2 ?? this.assetTextures.toggleOff);

      this.muteRow.toggleFallback.clear();
    if (texture) {
      this.muteRow.toggle.texture = texture;
      this.muteRow.toggle.visible = true;
    } else {
      this.muteRow.toggle.visible = false;
      drawButtonFrame(this.muteRow.toggleFallback, 70, 32, {
        accent: this.audioSettings.muted ? UI_COLORS.danger : UI_COLORS.green,
        selected: this.audioSettings.muted,
        glow: true,
      });
      this.muteRow.toggleFallback.position.set(218, 12);
    }

    this.muteRow.value.text = this.audioSettings.muted ? 'ON' : 'OFF';
    this.muteRow.value.style.fill = this.audioSettings.muted ? '#ff6b62' : '#65e878';
  }

  renderSettingRows() {
    this.settingRows.forEach((row) => {
      this.renderRowFrame(row, SAFE.rowWidth, SAFE.settingHeight, this.assetTextures.rowPanelV3 ?? this.assetTextures.optionButtonV3 ?? this.assetTextures.optionButtonV2);
      row.chips.forEach((chip) => this.renderChip(row.group.id, chip));
    });
  }

  renderChip(groupId, chip) {
    const group = this.gameplaySettings[groupId] ?? {};
    const option = chip.option;
    const isCycle = option.mode === 'cycle';
    const isVisibilityCycle = option.mode === 'visibilityCycle';
    const rawValue = group[option.key];
    const active = isVisibilityCycle ? rawValue !== 'standard' : isCycle ? rawValue !== 'small' : rawValue !== false;
    const layout = chip.layout ?? this.getChipLayout(groupId, 0);
    const chipWidth = layout.width;
    const visibilityPalette = this.getVisibilityChipPalette(rawValue);
    const fillColor = visibilityPalette?.fill ?? (active ? 0x073439 : 0x2a100e);
    const strokeColor = visibilityPalette?.stroke ?? (active ? UI_COLORS.dna : UI_COLORS.gold);
    const innerColor = visibilityPalette?.inner ?? 0x020607;
    const textColor = visibilityPalette?.text ?? (active ? '#ffffff' : '#f9d5a0');

    chip.bg.clear();
    const chipTexture = active
      ? this.assetTextures.toggleChipOnA12b
      : this.assetTextures.toggleChipOffA12b;
    if (chipTexture) {
      chip.frame.texture = chipTexture;
      chip.frame.position.set(0, 0);
      chip.frame.width = chipWidth;
      chip.frame.height = CHIP_HEIGHT;
      chip.frame.alpha = active ? 0.98 : 0.9;
      chip.frame.visible = true;
    } else {
      chip.frame.visible = false;
      chip.bg
        .roundRect(0, 0, chipWidth, CHIP_HEIGHT, 8)
        .fill({ color: fillColor, alpha: visibilityPalette?.fillAlpha ?? (active ? 0.92 : 0.86) })
        .stroke({ color: strokeColor, width: 1.4, alpha: visibilityPalette?.strokeAlpha ?? (active ? 0.86 : 0.72) })
        .roundRect(4, 5, chipWidth - 8, CHIP_HEIGHT - 10, 7)
        .fill({ color: innerColor, alpha: visibilityPalette?.innerAlpha ?? 0.58 });
    }

    chip.text.text = this.getChipText(groupId, option, rawValue);
    chip.text.position.set(chipWidth / 2, CHIP_HEIGHT / 2);
    chip.text.style.fill = textColor;
    chip.text.style.fontSize = chip.text.text.length >= 7 ? 7 : 8;
    chip.text.style.stroke = { color: '#020607', width: 2 };
    chip.text.style.wordWrapWidth = chipWidth - 6;
  }

  getVisibilityChipPalette(rawValue) {
    if (rawValue === 'high') {
      return {
        fill: 0x3b2107,
        stroke: 0xffb84d,
        inner: 0x120804,
        text: '#ffe0a0',
        fillAlpha: 0.94,
        strokeAlpha: 0.94,
        innerAlpha: 0.64,
      };
    }

    if (rawValue === 'bright') {
      return {
        fill: 0x073439,
        stroke: UI_COLORS.dna,
        inner: 0x02191d,
        text: '#dfffff',
        fillAlpha: 0.92,
        strokeAlpha: 0.9,
        innerAlpha: 0.62,
      };
    }

    if (rawValue === 'standard') {
      return {
        fill: 0x171b22,
        stroke: 0x65717a,
        inner: 0x050809,
        text: '#d1d9de',
        fillAlpha: 0.88,
        strokeAlpha: 0.76,
        innerAlpha: 0.62,
      };
    }

    return null;
  }

  renderDevButton() {
    this.renderRowFrame(this.assetPreviewButton, SAFE.rowWidth, 46, this.assetTextures.devButtonV3 ?? this.assetTextures.devButtonV2 ?? this.assetTextures.optionButtonV3);
  }

  renderTutorialButton() {
    this.renderRowFrame(this.tutorialButton, SAFE.rowWidth, 46, this.assetTextures.optionButtonV3 ?? this.assetTextures.optionButtonV2);
  }

  renderRowFrame(row, width, height, texture) {
    row.bg.clear();
    if (texture) {
      row.frame.texture = texture;
      row.frame.position.set(0, 0);
      row.frame.width = width;
      row.frame.height = height;
      row.frame.alpha = 0.52;
      row.frame.visible = true;
      return;
    }

    row.frame.visible = false;
    drawButtonFrame(row.bg, width, height, {
      accent: UI_COLORS.dna,
      glow: false,
    });
  }

  drawStatic() {
    drawScreenBackground(this.background, this.width, this.height, UI_COLORS.danger);
    drawPanel(this.panelFallback, SAFE.panel.x, SAFE.panel.y, SAFE.panel.width, SAFE.panel.height, {
      accent: UI_COLORS.danger,
      alpha: 0.82,
      radius: 14,
      strokeAlpha: 0.38,
    });

    this.backButton.view.position.set(22, 30);
    this.title.anchor.set(0.5);
    this.title.position.set(this.width / 2, 38);
    this.titleEn.anchor.set(0.5);
    this.titleEn.position.set(this.width / 2, 68);
    this.subtitle.anchor.set(0.5);
    this.subtitle.position.set(this.width / 2, 91);
    this.infoText.position.set(42, 118);
    this.sectionAudio.position.set(46, 130);
    this.sectionPlay.position.set(46, 442);
    this.noticeText.anchor.set(0.5);
    this.noticeText.position.set(this.width / 2, 738);
  }

  createSmallButton(label) {
    const view = new Container();
    const bg = new Graphics();
    const text = this.createText(label, 24, '#f4f7f5');

    drawBackButtonFrame(bg);
    text.anchor.set(0.5);
    text.position.set(26, 23);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.addChild(bg, text);

    return { view, bg, text };
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
        breakWords: true,
      },
    });
  }

  playUiClick() {
    this.audioManager?.playOptional?.('ui_click');
  }
}
