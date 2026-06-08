import { Assets, Container, Graphics, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import { getSkillById } from '../data/skills.js';
import { drawButtonFrame, drawPanel, UI_COLORS } from './ui_theme.js';
import { resetIntroMotion, updateIntroMotion } from './ui_motion.js';

const BUTTONS = [
  { label: '再開', subLabel: '出撃へ戻る', color: 0xffc739, action: 'resume', asset: 'resumeButton', icon: 'resumeIcon', y: 232, height: 82 },
  { label: '設定', subLabel: 'プレイ中設定を開く', color: 0x35d7ff, action: 'settings', asset: 'optionsButton', icon: 'optionsIcon', y: 322, height: 58 },
  { label: '出撃終了', subLabel: 'リザルトへ移動', color: 0xff4d38, action: 'endRun', asset: 'endRunButton', icon: 'endRunIcon', y: 388, height: 58 },
  { label: 'タイトルへ戻る', subLabel: 'タイトル画面へ移動', color: 0x53635f, action: 'title', asset: 'titleButton', icon: 'titleIcon', y: 454, height: 58 },
];

const PAUSE_ASSETS = {
  resumeButtonV4: 'assets/ui/pause/pause_button_resume_v4.png',
  optionsButtonV4: 'assets/ui/pause/pause_button_options_v4.png',
  endRunButtonV4: 'assets/ui/pause/pause_button_end_run_v4.png',
  titleButtonV4: 'assets/ui/pause/pause_button_title_v4.png',
  statusPanelV4: 'assets/ui/pause/pause_status_panel_v4.png',
  adaptationPanelV4: 'assets/ui/pause/pause_adaptation_panel_v4.png',
  adaptationSlot: 'assets/ui/pause/pause_adaptation_slot.png',
  adaptationSlotEmpty: 'assets/ui/pause/pause_adaptation_slot_empty.png',
  resumeIcon: 'assets/ui/pause/pause_icon_resume.png',
  optionsIcon: 'assets/ui/pause/pause_icon_options.png',
  endRunIcon: 'assets/ui/pause/pause_icon_end_run.png',
  titleIcon: 'assets/ui/pause/pause_icon_title.png',
  adaptSpeed: 'assets/ui/hud/adapt_icons/adapt_slot_speed.png',
  adaptHunting: 'assets/ui/hud/adapt_icons/adapt_slot_hunting.png',
  adaptAttack: 'assets/ui/hud/adapt_icons/adapt_slot_attack.png',
  adaptDefense: 'assets/ui/hud/adapt_icons/adapt_slot_defense.png',
  adaptToxic: 'assets/ui/hud/adapt_icons/adapt_slot_toxic.png',
  adaptCrystal: 'assets/ui/hud/adapt_icons/adapt_slot_crystal.png',
  skillAfterimageClaw: 'assets/ui/skills/icon_afterimage_claw.png',
  skillGaleBlade: 'assets/ui/skills/icon_gale_blade.png',
  skillHomingFang: 'assets/ui/skills/icon_tracking_fang.png',
  skillSenseSpike: 'assets/ui/skills/icon_sense_spike.png',
  skillShockRoar: 'assets/ui/skills/icon_shock_roar.png',
  skillBurstFang: 'assets/ui/skills/icon_burst_fang.png',
  skillAccelBlades: 'assets/ui/skills/icon_accel_blades.png',
  skillPredatorMark: 'assets/ui/skills/icon_predator_mark.png',
  skillFlameBreath: 'assets/ui/skills/icon_flame_breath.png',
  panelV3: 'assets/ui/pause/pause_panel_v3.png',
  statusPanelV3: 'assets/ui/pause/pause_status_panel_v3.png',
  resumeButtonV3: 'assets/ui/pause/pause_button_resume_v3.png',
  optionsButtonV3: 'assets/ui/pause/pause_button_options_v3.png',
  endRunButtonV3: 'assets/ui/pause/pause_button_end_run_v3.png',
  titleButtonV3: 'assets/ui/pause/pause_button_title_v3.png',
  warningChipV3: 'assets/ui/pause/pause_warning_chip_v3.png',
  panelV2: 'assets/ui/pause/pause_panel_v2.png',
  statusPanelV2: 'assets/ui/pause/pause_status_panel_v2.png',
  resumeButtonV2: 'assets/ui/pause/pause_button_resume_v2.png',
  optionsButtonV2: 'assets/ui/pause/pause_button_options_v2.png',
  endRunButtonV2: 'assets/ui/pause/pause_button_end_run_v2.png',
  titleButtonV2: 'assets/ui/pause/pause_button_title_v2.png',
  warningChipV2: 'assets/ui/pause/pause_warning_chip_v2.png',
  panel: 'assets/ui/pause/pause_panel.png',
  statusPanel: 'assets/ui/pause/pause_status_panel.png',
  resumeButton: 'assets/ui/pause/pause_button_resume.png',
  optionsButton: 'assets/ui/pause/pause_button_options.png',
  endRunButton: 'assets/ui/pause/pause_button_end_run.png',
  titleButton: 'assets/ui/pause/pause_button_title.png',
};

const ADAPTATION_LABELS = {
  speed: '高速',
  hunting: '狩猟',
  attack: '攻撃',
  defense: '防御',
  toxic: '毒性',
  crystal: '結晶',
};

const SKILL_DISPLAY = {
  afterimage_claw: { label: '残影爪', asset: 'skillAfterimageClaw', tag: 'speed' },
  gale_blade: { label: '疾風刃', asset: 'skillGaleBlade', tag: 'speed' },
  homing_fang: { label: '追尾牙', asset: 'skillHomingFang', tag: 'hunting' },
  sense_spike: { label: '感知棘', asset: 'skillSenseSpike', tag: 'hunting' },
  shock_roar_wave: { label: '咆哮波', asset: 'skillShockRoar', tag: 'attack' },
  burst_fang: { label: '爆裂牙', asset: 'skillBurstFang', tag: 'attack' },
  accelerated_blades: { label: '刃群', asset: 'skillAccelBlades', tag: 'speed' },
  predator_marking: { label: '捕食印', asset: 'skillPredatorMark', tag: 'hunting' },
  flame_breath: { label: '火炎', asset: 'skillFlameBreath', tag: 'attack' },
};

function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export class PauseUi {
  constructor({ width, height, onResume, onSettings, onEndRun, onTitle }) {
    this.width = width;
    this.height = height;
    this.onResume = onResume;
    this.onSettings = onSettings;
    this.onEndRun = onEndRun;
    this.onTitle = onTitle;
    this.view = new Container();
    this.backdrop = new Graphics();
    this.panel = new Graphics();
    this.panelSprite = new Sprite(Texture.EMPTY);
    this.statPanelSprite = new Sprite(Texture.EMPTY);
    this.skillPanelSprite = new Sprite(Texture.EMPTY);
    this.warningChipSprite = new Sprite(Texture.EMPTY);
    this.title = this.createText('一時停止', 38, '#f4f7f5', 300);
    this.subtitle = this.createText('RUN PAUSED', 14, '#ff6b62', 260);
    this.noticeText = this.createText('', 12, '#ffd36b', 300);
    this.statTitle = this.createText('現在の状況', 15, '#ff6b62', 280);
    this.skillTitle = this.createText('現在の適応状況', 13, '#ff6b62', 280);
    this.statTexts = [];
    this.adaptationSlots = [];
    this.buttons = [];
    this.skillPopup = this.createSkillPopup();
    this.notice = '';
    this.wasVisible = false;
    this.gamepadFocusIndex = 0;
    this.assetTextures = {};

    this.view.visible = false;
    this.view.eventMode = 'static';
    this.view.hitArea = new Rectangle(0, 0, width, height);
    this.panelSprite.visible = false;
    this.statPanelSprite.visible = false;
    this.skillPanelSprite.visible = false;
    this.warningChipSprite.visible = false;
    this.view.addChild(
      this.backdrop,
      this.panel,
      this.panelSprite,
      this.statPanelSprite,
      this.skillPanelSprite,
      this.warningChipSprite,
      this.title,
      this.subtitle,
      this.noticeText,
      this.statTitle,
      this.skillTitle,
    );

    BUTTONS.forEach((config, index) => {
      const button = this.createButton(config.label, config.subLabel, config.color, config.height);
      button.asset = config.asset;
      button.iconAsset = config.icon;
      button.view.position.set(39, config.y);
      button.view.on('pointertap', () => this.handleButton(config.action));
      this.buttons.push(button);
      this.view.addChild(button.view);
    });

    for (let index = 0; index < 4; index += 1) {
      const label = this.createText('', 10, '#91aaa4', 132);
      const value = this.createText('', 15, '#ffffff', 132);

      this.statTexts.push({ label, value });
      this.view.addChild(label, value);
    }

    for (let index = 0; index < 3; index += 1) {
      const slot = {
        view: new Container(),
        frame: new Sprite(Texture.EMPTY),
        icon: new Sprite(Texture.EMPTY),
        label: this.createText('', 10, '#d7fff2', 72),
        skillInfo: null,
      };
      slot.frame.visible = false;
      slot.icon.visible = false;
      slot.frame.anchor.set(0.5);
      slot.icon.anchor.set(0.5);
      slot.label.anchor.set(0.5);
      slot.view.eventMode = 'static';
      slot.view.cursor = 'pointer';
      slot.view.hitArea = new Rectangle(-34, -36, 68, 78);
      slot.view.on('pointertap', () => this.showSkillPopup(slot.skillInfo));
      slot.view.addChild(slot.frame, slot.icon, slot.label);
      this.adaptationSlots.push(slot);
      this.view.addChild(slot.view);
    }

    this.view.addChild(this.skillPopup.view);

    this.drawStatic();
    this.loadAssets();
  }

  async loadAssets() {
    await Promise.all(Object.entries(PAUSE_ASSETS).map(async ([key, path]) => {
      try {
        this.assetTextures[key] = await Assets.load(assetUrl(path));
      } catch {
        this.assetTextures[key] = null;
      }
    }));

    this.applyAssetTextures();
  }

  applyAssetTextures() {
    const panelTexture = this.assetTextures.panelV3 ?? this.assetTextures.panelV2 ?? this.assetTextures.panel;
    if (panelTexture) {
      this.panelSprite.texture = panelTexture;
      this.panelSprite.position.set(10, 72);
      this.panelSprite.width = this.width - 20;
      this.panelSprite.height = this.height - 86;
      this.panelSprite.alpha = 0.94;
      this.panelSprite.visible = true;
      this.panel.clear();
    }

    const statusTexture = this.assetTextures.statusPanelV4 ?? this.assetTextures.statusPanelV3 ?? this.assetTextures.statusPanelV2 ?? this.assetTextures.statusPanel;
    if (statusTexture) {
      this.statPanelSprite.texture = statusTexture;
      this.statPanelSprite.position.set(32, 550);
      this.statPanelSprite.width = this.width - 64;
      this.statPanelSprite.height = 118;
      this.statPanelSprite.alpha = 0.96;
      this.statPanelSprite.visible = true;

      this.skillPanelSprite.texture = this.assetTextures.adaptationPanelV4 ?? statusTexture;
      this.skillPanelSprite.position.set(32, 694);
      this.skillPanelSprite.width = this.width - 64;
      this.skillPanelSprite.height = 110;
      this.skillPanelSprite.alpha = 0.92;
      this.skillPanelSprite.visible = true;
    }

    this.buttons.forEach((button) => {
      const texture = this.assetTextures[`${button.asset}V4`]
        ?? this.assetTextures[`${button.asset}V3`]
        ?? this.assetTextures[`${button.asset}V2`]
        ?? this.assetTextures[button.asset];

      if (!texture) {
        return;
      }

      button.sprite.texture = texture;
      button.sprite.width = this.width - 78;
      button.sprite.height = button.height;
      button.sprite.visible = true;
      button.bg.clear();
      button.icon.clear();

      const iconTexture = this.assetTextures[button.iconAsset] ?? null;
      if (iconTexture) {
        button.iconSprite.texture = iconTexture;
        button.iconSprite.position.set(36, button.height / 2);
        button.iconSprite.width = button.height === 82 ? 42 : 34;
        button.iconSprite.height = button.height === 82 ? 42 : 34;
        button.iconSprite.visible = true;
      } else {
        button.iconSprite.visible = false;
      }
    });

    if (this.assetTextures.warningChipV3 ?? this.assetTextures.warningChipV2) {
      this.warningChipSprite.texture = this.assetTextures.warningChipV3 ?? this.assetTextures.warningChipV2;
      this.warningChipSprite.anchor.set(0.5);
      this.warningChipSprite.position.set(this.width / 2, 164);
      this.warningChipSprite.width = 164;
      this.warningChipSprite.height = 30;
      this.warningChipSprite.alpha = 0.82;
      this.warningChipSprite.visible = true;
    }
  }

  show(gameState) {
    if (!this.wasVisible) {
      resetIntroMotion(this.panel, { duration: 0.18, startScale: 0.985 });
    }

    this.wasVisible = true;
    this.view.visible = true;
    this.render(gameState);
    this.updateGamepadFocus();
  }

  hide() {
    this.view.visible = false;
    this.wasVisible = false;
    this.gamepadFocusIndex = 0;
    this.notice = '';
    this.noticeText.text = '';
    this.hideSkillPopup();
  }

  update(delta) {
    if (!this.view.visible) {
      return;
    }

    updateIntroMotion(this.panel, delta);
  }

  handleGamepadAction(actions) {
    if (!this.view.visible) {
      return false;
    }

    if (actions.downPressed || actions.rightPressed) {
      this.gamepadFocusIndex = Math.min(this.buttons.length - 1, this.gamepadFocusIndex + 1);
      this.updateGamepadFocus();
      return true;
    }

    if (actions.upPressed || actions.leftPressed) {
      this.gamepadFocusIndex = Math.max(0, this.gamepadFocusIndex - 1);
      this.updateGamepadFocus();
      return true;
    }

    if (actions.confirmPressed) {
      const config = BUTTONS[this.gamepadFocusIndex];
      if (config) {
        this.handleButton(config.action);
      }
      return true;
    }

    return false;
  }

  updateGamepadFocus() {
    this.buttons.forEach((button, index) => {
      const selected = index === this.gamepadFocusIndex;
      button.view.alpha = selected ? 1 : 0.86;
      button.view.scale.set(selected ? 1.015 : 1);
    });
  }
  handleButton(action) {
    if (action === 'resume') {
      this.onResume?.();
      return;
    }

    if (action === 'settings') {
      this.notice = '設定を開きます';
      this.onSettings?.();
      return;
    }

    if (action === 'endRun') {
      this.onEndRun?.();
      return;
    }

    if (action === 'title') {
      this.onTitle?.();
    }
  }

  render(gameState) {
    const dnaEstimate = Math.max(0, Math.floor((gameState.totalExpGained ?? 0) * 0.35 + (gameState.defeatedBosses ?? 0) * 8));
    const evolutionName = gameState.selectedEvolution?.evolutionName ?? '未解析';
    const stats = [
      ['生存時間', this.formatTime(gameState.elapsedTime)],
      ['撃破数', `${gameState.defeatedCount}`],
      ['DNA/EXP', `${dnaEstimate} / ${gameState.totalExpGained}`],
      ['分岐', evolutionName],
    ];

    this.statTexts.forEach((entry, index) => {
      const stat = stats[index];
      const column = index % 2;
      const row = Math.floor(index / 2);
      const x = 56 + column * 164;
      const y = 576 + row * 39;

      entry.label.text = stat[0];
      entry.value.text = stat[1];
      entry.label.position.set(x, y);
      entry.value.position.set(x, y + 16);
    });

    const adaptations = this.getPauseAdaptations(gameState).slice(0, 3);

    this.adaptationSlots.forEach((slot, index) => {
      const adaptation = adaptations[index] ?? null;
      const x = 92 + index * 103;
      const y = 746;
      const frameTexture = adaptation
        ? this.assetTextures.adaptationSlot
        : this.assetTextures.adaptationSlotEmpty ?? this.assetTextures.adaptationSlot;
      const iconTexture = adaptation ? this.getSkillIconTexture(adaptation) : null;

      slot.skillInfo = adaptation;
      slot.view.position.set(x, y);
      slot.view.cursor = adaptation ? 'pointer' : 'default';
      if (frameTexture) {
        slot.frame.texture = frameTexture;
        slot.frame.position.set(0, -5);
        slot.frame.width = 56;
        slot.frame.height = 52;
        slot.frame.alpha = adaptation ? 0.94 : 0.42;
        slot.frame.visible = true;
      } else {
        slot.frame.visible = false;
      }

      if (iconTexture) {
        slot.icon.texture = iconTexture;
        slot.icon.position.set(0, -7);
        slot.icon.width = 30;
        slot.icon.height = 30;
        slot.icon.alpha = 0.95;
        slot.icon.visible = true;
      } else {
        slot.icon.visible = false;
      }

      slot.label.text = adaptation ? adaptation.label : '空き';
      slot.label.alpha = adaptation ? 0.92 : 0.4;
      slot.label.position.set(0, 31);
    });

    this.noticeText.text = this.notice;
  }

  drawStatic() {
    this.backdrop
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x010305, alpha: 0.64 })
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x120203, alpha: 0.16 });

    drawPanel(this.panel, 22, 92, this.width - 44, this.height - 124, {
      accent: UI_COLORS.danger,
      alpha: 0.9,
      radius: 14,
      strokeAlpha: 0.5,
    });
    this.panel
      .roundRect(42, 584, this.width - 84, 108, 8)
      .fill({ color: 0x081316, alpha: 0.78 })
      .stroke({ color: 0xff4d38, width: 1, alpha: 0.3 })
      .roundRect(42, 724, this.width - 84, 82, 8)
      .fill({ color: 0x081316, alpha: 0.78 })
      .stroke({ color: 0xff4d38, width: 1, alpha: 0.24 });

    this.title.anchor.set(0.5);
    this.title.position.set(this.width / 2, 126);
    this.subtitle.anchor.set(0.5);
    this.subtitle.position.set(this.width / 2, 164);
    this.noticeText.anchor.set(0.5);
    this.noticeText.position.set(this.width / 2, 206);
    this.statTitle.position.set(56, 532);
    this.skillTitle.text = '現在の適応状況';
    this.skillTitle.position.set(56, 676);
  }

  createButton(label, subLabel, color, height = 62) {
    const view = new Container();
    const sprite = new Sprite(Texture.EMPTY);
    const iconSprite = new Sprite(Texture.EMPTY);
    const bg = new Graphics();
    const icon = new Graphics();
    const text = this.createText(label, 21, '#f4f7f5', 210);
    const sub = this.createText(subLabel, 11, '#b8c9c4', 210);

    sprite.visible = false;
    drawButtonFrame(bg, this.width - 78, height, {
      accent: color,
      selected: color === 0xffc739,
      glow: color === 0xffc739,
    });
    icon
      .circle(34, height / 2, 18)
      .fill({ color, alpha: 0.26 })
      .stroke({ color, width: 2, alpha: 0.8 });
    iconSprite.visible = false;
    iconSprite.anchor.set(0.5);
    text.position.set(88, height === 82 ? 17 : 10);
    sub.position.set(88, height === 82 ? 47 : 36);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.addChild(sprite, bg, iconSprite, icon, text, sub);

    return { view, sprite, iconSprite, bg, icon, text, sub, height };
  }

  createSkillPopup() {
    const view = new Container();
    const backdrop = new Graphics();
    const panel = new Graphics();
    const iconFrame = new Graphics();
    const icon = new Sprite(Texture.EMPTY);
    const title = this.createText('', 18, '#f7fff8', 240);
    const tag = this.createText('', 11, '#7cf7d4', 240);
    const description = this.createText('', 12, '#d7e9e2', 242);
    const upgrade = this.createText('', 11, '#ffd36b', 242);
    const close = this.createText('タップで閉じる', 10, '#91aaa4', 160);

    view.visible = false;
    view.eventMode = 'static';
    view.hitArea = new Rectangle(0, 0, this.width, this.height);
    view.on('pointertap', () => this.hideSkillPopup());
    backdrop.rect(0, 0, this.width, this.height).fill({ color: 0x000000, alpha: 0.18 });
    panel
      .roundRect(42, 316, this.width - 84, 184, 10)
      .fill({ color: 0x061013, alpha: 0.94 })
      .stroke({ color: 0x35d7ff, width: 1.5, alpha: 0.72 })
      .roundRect(50, 324, this.width - 100, 168, 8)
      .stroke({ color: 0xffd36b, width: 1, alpha: 0.2 });
    iconFrame
      .circle(84, 368, 30)
      .fill({ color: 0x0b1b1f, alpha: 0.78 })
      .stroke({ color: 0x7cf7d4, width: 1.5, alpha: 0.72 });
    icon.anchor.set(0.5);
    icon.position.set(84, 368);
    icon.width = 42;
    icon.height = 42;
    title.position.set(124, 340);
    tag.position.set(124, 365);
    description.position.set(66, 412);
    upgrade.position.set(66, 456);
    close.anchor.set(0.5);
    close.position.set(this.width / 2, 482);
    view.addChild(backdrop, panel, iconFrame, icon, title, tag, description, upgrade, close);

    return { view, icon, title, tag, description, upgrade };
  }

  showSkillPopup(skillInfo) {
    if (!skillInfo) {
      return;
    }

    const skill = getSkillById(skillInfo.id) ?? {};
    const tagLabel = ADAPTATION_LABELS[skillInfo.tag] ?? '適応';
    const level = Math.max(1, Math.floor(skillInfo.level ?? 1));
    const iconTexture = this.getSkillIconTexture(skillInfo);

    if (iconTexture) {
      this.skillPopup.icon.texture = iconTexture;
      this.skillPopup.icon.visible = true;
    } else {
      this.skillPopup.icon.visible = false;
    }

    this.skillPopup.title.text = skillInfo.name ?? skill.displayName ?? skill.name ?? '適応技';
    this.skillPopup.tag.text = `${tagLabel}適応 / 強化 ${level}`;
    this.skillPopup.description.text = skill.displayDescription ?? skill.description ?? '取得済みの適応技です。';
    this.skillPopup.upgrade.text = skill.upgradeSummary ? `強化効果: ${skill.upgradeSummary}` : skill.levelUpText ? `強化効果: ${skill.levelUpText}` : '強化効果: 威力や範囲が上昇';
    this.skillPopup.view.visible = true;
  }

  hideSkillPopup() {
    if (this.skillPopup?.view) {
      this.skillPopup.view.visible = false;
    }
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

  getPauseAdaptations(gameState) {
    return (gameState.ownedSkills ?? [])
      .filter((skill) => skill?.usesSkillSlot !== false && (skill.type === 'adaptationSkill' || skill.adaptationTags?.length))
      .slice(0, 3)
      .map((skill) => {
        const meta = SKILL_DISPLAY[skill.id] ?? null;
        const tag = skill.tag ?? skill.adaptationTags?.[0] ?? meta?.tag ?? null;
        const level = Math.max(1, Math.floor(skill.level ?? 1));

        return {
          id: skill.id,
          tag,
          asset: meta?.asset ?? null,
          name: meta?.label ?? skill.name ?? ADAPTATION_LABELS[tag] ?? '適応技',
          level,
          label: `${meta?.label ?? skill.name ?? ADAPTATION_LABELS[tag] ?? '適応'} 強${level}`,
        };
      });
  }

  getSkillIconTexture(adaptation) {
    if (adaptation?.asset && this.assetTextures[adaptation.asset]) {
      return this.assetTextures[adaptation.asset];
    }

    return this.getAdaptationIconTexture(adaptation?.tag);
  }

  getAdaptationIconTexture(tag) {
    const key = {
      speed: 'adaptSpeed',
      hunting: 'adaptHunting',
      attack: 'adaptAttack',
      defense: 'adaptDefense',
      toxic: 'adaptToxic',
      crystal: 'adaptCrystal',
    }[tag];

    return key ? this.assetTextures[key] : null;
  }

  formatTime(elapsedTime) {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = Math.floor(elapsedTime % 60);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}
