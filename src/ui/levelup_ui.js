import { Assets, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { isAdaptationSkillUnlocked } from '../data/adaptation_skills.js';
import { SKILLS } from '../data/skills.js';
import { drawButtonFrame, drawPanel, UI_COLORS, toCssColor } from './ui_theme.js';
import { resetIntroMotion, updateIntroMotion } from './ui_motion.js';

const ADAPTATION_LABELS = {
  speed: '高速適応',
  hunting: '狩猟適応',
  attack: '攻撃適応',
};

const SELECTION_ASSETS = {
  backgroundPanelV3: 'assets/ui/selection/selection_background_panel_v3.png',
  headerPanelV3: 'assets/ui/selection/selection_header_panel_v3.png',
  subtitleStripV3: 'assets/ui/selection/selection_subtitle_strip_v3.png',
  backgroundPanelV2: 'assets/ui/selection/selection_background_panel_v2.png',
  headerPanelV2: 'assets/ui/selection/selection_header_panel_v2.png',
  subtitlePanelV2: 'assets/ui/selection/selection_subtitle_panel_v2.png',
  footerPanelV2: 'assets/ui/selection/selection_footer_panel_v2.png',
  overlayGradientV2: 'assets/ui/selection/selection_overlay_gradient_v2.png',
  badgeNewV2: 'assets/ui/selection/badge_new_v2.png',
  badgeUpgradeV2: 'assets/ui/selection/badge_upgrade_v2.png',
  badgeOwnedV2: 'assets/ui/selection/badge_owned_v2.png',
  badgeLockedV2: 'assets/ui/selection/badge_locked_v2.png',
  warningChip: 'assets/ui/selection/analysis_warning_chip.png',
  headerIcon: 'assets/ui/selection/dna_analysis_header_icon.png',
  backgroundPanel: 'assets/ui/selection/selection_background_panel.png',
  headerPanel: 'assets/ui/selection/selection_header_panel.png',
  footerPanel: 'assets/ui/selection/selection_footer_panel.png',
  rerollIdle: 'assets/ui/selection/reroll_button_idle.png',
  rerollDisabled: 'assets/ui/selection/reroll_button_disabled.png',
  rerollPressed: 'assets/ui/selection/reroll_button_pressed.png',
  rerollGreenIdle: 'assets/ui/selection/reroll_button_green_idle.png',
  rerollGreenDisabled: 'assets/ui/selection/reroll_button_green_disabled.png',
  rerollGreenPressed: 'assets/ui/selection/reroll_button_green_pressed.png',
  badgeNew: 'assets/ui/selection/badge_new.png',
  badgeUpgrade: 'assets/ui/selection/badge_upgrade.png',
  badgeOwned: 'assets/ui/selection/badge_owned.png',
  badgeLocked: 'assets/ui/selection/badge_locked.png',
  cardSpeed: 'assets/ui/selection/adaptation_card_speed_panel.png',
  cardHunting: 'assets/ui/selection/adaptation_card_hunting_panel.png',
  cardAttack: 'assets/ui/selection/adaptation_card_attack_panel.png',
  cardNoneV2: 'assets/ui/selection/adaptation_card_none_panel_v2.png',
  cardNoneSelectedV2: 'assets/ui/selection/adaptation_card_none_panel_selected_v2.png',
  cardNone: 'assets/ui/selection/adaptation_card_none_panel.png',
  cardNoneSelected: 'assets/ui/selection/adaptation_card_none_panel_selected.png',
  iconSpeed: 'assets/ui/adaptations/icon_adapt_speed.png',
  iconHunting: 'assets/ui/adaptations/icon_adapt_hunting.png',
  iconAttack: 'assets/ui/adaptations/icon_adapt_attack.png',
  iconNone: 'assets/ui/adaptations/icon_adapt_none.png',
  iconDefense: 'assets/ui/hud/adapt_icons/adapt_slot_defense.png',
  iconToxic: 'assets/ui/hud/adapt_icons/adapt_slot_toxic.png',
  iconCrystal: 'assets/ui/hud/adapt_icons/adapt_slot_crystal.png',
  iconAfterimageClaw: 'assets/ui/skills/icon_afterimage_claw.png',
  iconGaleBlade: 'assets/ui/skills/icon_gale_blade.png',
  iconAccelBlades: 'assets/ui/skills/icon_accel_blades.png',
  iconTrackingFang: 'assets/ui/skills/icon_tracking_fang.png',
  iconSenseSpike: 'assets/ui/skills/icon_sense_spike.png',
  iconPredatorMark: 'assets/ui/skills/icon_predator_mark.png',
  iconShockRoar: 'assets/ui/skills/icon_shock_roar.png',
  iconBurstFang: 'assets/ui/skills/icon_burst_fang.png',
  iconFlameBreath: 'assets/ui/skills/icon_flame_breath.png',
  iconBoostHp: 'assets/ui/skills/icon_boost_hp.png',
  iconBoostMoveSpeed: 'assets/ui/skills/icon_boost_move_speed.png',
  iconBoostAttackRate: 'assets/ui/skills/icon_boost_attack_rate.png',
  iconBoostAttackRange: 'assets/ui/skills/icon_boost_attack_range.png',
  iconBoostPickupRange: 'assets/ui/skills/icon_boost_pickup_range.png',
  iconBoostDnaGain: 'assets/ui/skills/icon_boost_dna_gain.png',
  iconBoostExpSense: 'assets/ui/skills/icon_boost_exp_sense.png',
};

function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

function compactText(text = '', maxLength = 32) {
  const normalized = String(text).replace(/\s+/g, '');
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}…` : normalized;
}

const SKILL_COPY = {
  attack_speed_up: {
    name: '神経加速',
    type: '攻撃頻度',
    description: '通常攻撃の間隔を短縮する。',
  },
  attack_range_up: {
    name: '爪域拡張',
    type: '攻撃範囲',
    description: '通常攻撃の届く範囲を広げる。',
  },
  move_speed_up: {
    name: '脚力強化',
    type: '移動補助',
    description: '移動速度を少し引き上げる。',
  },
  poison_bite: {
    name: '毒牙',
    type: '継続傷害',
    description: '攻撃時、敵に毒性ダメージを与える。',
  },
  bleed_claw: {
    name: '裂傷爪',
    type: '出血損傷',
    description: '攻撃時、敵に裂傷ダメージを与える。',
  },
  hard_skin: {
    name: '硬質皮膚',
    type: '防御適応',
    description: '最大HPを少し引き上げる。',
  },
  exp_sense: {
    name: 'EXP感知',
    type: '回収補助',
    description: 'EXP結晶を引き寄せやすくする。',
  },
  predator_instinct: {
    name: '捕食本能',
    type: '狩猟補助',
    description: '索敵距離と攻撃性能を少し高める。',
  },
  shock_roar: {
    name: '電磁咆哮',
    type: '制圧適応',
    description: '攻撃時、範囲を短く制圧する。',
  },
};

function getSkillCopy(skill) {
  return {
    name: skill.displayName ?? skill.name,
    type: skill.type,
    description: skill.displayDescription ?? skill.description,
  };
}

function getAdaptationLabel(tag) {
  const labels = {
    speed: '高速適応',
    hunting: '狩猟適応',
    attack: '攻撃適応',
  };

  return labels[tag] ?? tag;
}

function getAdaptationHint(progress = {}) {
  const speed = progress.speed ?? 0;
  const hunting = progress.hunting ?? 0;
  const attack = progress.attack ?? 0;

  if (speed >= 4) return '高速適応が強く反応しています';
  if (hunting >= 3) return '狩猟適応が分岐進化へ近づいています';
  if (attack >= 3) return '攻撃適応が分岐進化へ近づいています';
  if (speed + hunting + attack >= 3) return 'DNAが新しい適応方向を探索中です';
  return 'DNA適応の安定解析中です';
}

function getUpgradePreview(skill, currentLevel, nextLevel) {
  const safePreviews = {
    afterimage_claw: nextLevel >= 4 ? '次: 斬撃数+1 / 範囲拡大' : nextLevel >= 2 ? '次: 斬撃数+1' : '次: 追加火力',
    gale_blade: nextLevel >= 3 ? '次: 刃数+1 / 速度上昇' : '次: 放出数強化',
    homing_fang: nextLevel >= 5 ? '次: 追尾数+1 / 速度上昇' : nextLevel >= 3 ? '次: 追尾数+1' : '次: 追尾速度上昇',
    sense_spike: nextLevel >= 3 ? '次: 感知棘+1' : '次: 索敵範囲拡大',
    shock_roar_wave: '次: 範囲 / 押し返し強化',
    burst_fang: nextLevel >= 3 ? '次: 爆発範囲拡大' : '次: 追加火力',
    accelerated_blades: nextLevel >= 4 ? '次: 持続 / 刃数強化' : '次: 範囲 / 持続強化',
    predator_marking: nextLevel >= 4 ? '次: 対象数+1' : nextLevel >= 2 ? '次: 対象数+1' : '次: 追加ダメージ',
    flame_breath: '次: 炎の幅 / 射程強化',
  };

  if (currentLevel <= 0) {
    return skill.upgradeSummary ? `初期: ${compactText(skill.upgradeSummary, 18)}` : skill.levelUpText ? `初期: ${compactText(skill.levelUpText, 18)}` : '初期解析を取得';
  }

  if (skill.type === 'adaptationSkill') {
    return safePreviews[skill.id] ?? '次: 追加火力 / 効果強化';
  }

  return skill.upgradeSummary ? `次: ${compactText(skill.upgradeSummary, 18)}` : skill.levelUpText ? `次: ${compactText(skill.levelUpText, 18)}` : '次: 基礎性能強化';
}

export class LevelUpUi {
  constructor({ width, height, onSelect, onReroll }) {
    this.width = width;
    this.height = height;
    this.onSelect = onSelect;
    this.onReroll = onReroll;
    this.view = new Container();
    this.backdrop = new Graphics();
    this.overlaySprite = new Sprite(Texture.EMPTY);
    this.panel = new Graphics();
    this.panelSprite = new Sprite(Texture.EMPTY);
    this.headerSprite = new Sprite(Texture.EMPTY);
    this.subtitleSprite = new Sprite(Texture.EMPTY);
    this.footerSprite = new Sprite(Texture.EMPTY);
    this.warningChipSprite = new Sprite(Texture.EMPTY);
    this.responseChipSprite = new Sprite(Texture.EMPTY);
    this.headerIconSprite = new Sprite(Texture.EMPTY);
    this.title = this.createText('DNA適応候補', 22, '#ffd36b', 250);
    this.subtitle = this.createText('解析候補を選択', 12, '#e7fff6', 210);
    this.levelText = this.createText('', 12, '#a9ff55', 240);
    this.hintText = this.createText('', 12, '#ffd36b', 300);
    this.rerollButton = new Container();
    this.rerollSprite = new Sprite(Texture.EMPTY);
    this.rerollBg = new Graphics();
    this.rerollText = this.createText('', 14, '#e7fff6', 180);
    this.cards = [];
    this.options = [];
    this.rerolls = 1;
    this.gameState = null;
    this.motionTime = 0;
    this.assetTextures = {};
    this.rerollPressed = false;
    this.title.text = 'DNA適応候補';
    this.subtitle.text = '解析候補を選択';

    this.view.visible = false;
    this.view.eventMode = 'static';
    this.panelSprite.visible = false;
    this.headerSprite.visible = false;
    this.subtitleSprite.visible = false;
    this.footerSprite.visible = false;
    this.overlaySprite.visible = false;
    this.warningChipSprite.visible = false;
    this.responseChipSprite.visible = false;
    this.headerIconSprite.visible = false;
    this.headerIconSprite.anchor.set(0.5);
    this.view.addChild(
      this.backdrop,
      this.overlaySprite,
      this.panel,
      this.panelSprite,
      this.headerSprite,
      this.subtitleSprite,
      this.footerSprite,
      this.warningChipSprite,
      this.responseChipSprite,
      this.headerIconSprite,
      this.title,
      this.subtitle,
      this.levelText,
      this.hintText,
    );
    this.createCards();
    this.createRerollButton();
    this.drawStatic();
    this.loadAssets();
  }

  async loadAssets() {
    await Promise.all(Object.entries(SELECTION_ASSETS).map(async ([key, path]) => {
      try {
        this.assetTextures[key] = await Assets.load(assetUrl(path));
      } catch {
        this.assetTextures[key] = null;
      }
    }));

    this.applyAssetLayout();

    if (this.view.visible) {
      this.renderOptions();
    }
  }

  show({ fromLevel, toLevel, rerolls, gameState }) {
    this.rerolls = rerolls;
    this.gameState = gameState;
    this.options = this.rollOptions();
    this.levelText.text = `反応 ${fromLevel} → ${toLevel}`;
    this.hintText.text = this.getStableAnalysisText(gameState.adaptationProgress);
    this.view.visible = true;
    this.motionTime = 0;
    this.applyAssetLayout();
    resetIntroMotion(this.panel, { duration: 0.2, startScale: 0.985 });
    this.renderOptions();
  }

  hide() {
    this.view.visible = false;
  }

  update(delta) {
    if (!this.view.visible) {
      return;
    }

    this.motionTime += delta;
    updateIntroMotion(this.panel, delta);
    this.rerollButton.alpha = 0.88 + Math.sin(this.motionTime * 4) * 0.06;
  }

  reroll() {
    if (this.rerolls <= 0) {
      return;
    }

    this.rerolls -= 1;
    this.options = this.rollOptions();
    this.renderOptions();
    this.onReroll?.(this.rerolls);
  }

  rollOptions() {
    if (!this.gameState) {
      return SKILLS.slice(0, 3);
    }

    const availableSkills = SKILLS.filter((skill) => isAdaptationSkillUnlocked(skill, this.gameState.researchLevels));
    const candidates = availableSkills.filter((skill) => this.gameState.canAcquireSkill(skill.id));
    const isAdaptation = (skill) => skill.type === 'adaptationSkill' && skill.usesSkillSlot !== false;
    const tagless = candidates.filter((skill) => !isAdaptation(skill));
    const ownedAdaptation = candidates.filter((skill) => isAdaptation(skill) && this.gameState.getSkillLevel(skill.id) > 0);
    const newInitialAdaptation = candidates.filter((skill) => isAdaptation(skill) && this.gameState.getSkillLevel(skill.id) === 0 && skill.unlockType !== 'research');
    const newResearchAdaptation = candidates.filter((skill) => isAdaptation(skill) && this.gameState.getSkillLevel(skill.id) === 0 && skill.unlockType === 'research');
    const adaptationCandidates = [...ownedAdaptation, ...newInitialAdaptation, ...newResearchAdaptation];
    const pool = this.shuffle([
      ...tagless,
      ...tagless,
      ...ownedAdaptation,
      ...ownedAdaptation,
      ...newInitialAdaptation,
      ...newResearchAdaptation,
    ]);
    const selected = [];

    pool.forEach((skill) => {
      if (selected.length < 3 && !selected.some((item) => item.id === skill.id)) {
        selected.push(skill);
      }
    });

    if (
      selected.length > 0
      && adaptationCandidates.length > 0
      && !selected.some((skill) => isAdaptation(skill))
    ) {
      selected[selected.length - 1] = this.shuffle(adaptationCandidates)[0];
    }

    this.shuffle(candidates).forEach((skill) => {
      if (selected.length < 3 && !selected.some((item) => item.id === skill.id)) {
        selected.push(skill);
      }
    });

    return selected;
  }

  createCards() {
    for (let index = 0; index < 3; index += 1) {
      const card = {
        view: new Container(),
        frame: new Sprite(Texture.EMPTY),
        iconSprite: new Sprite(Texture.EMPTY),
        badgeSprite: new Sprite(Texture.EMPTY),
        bg: new Graphics(),
        levelBg: new Graphics(),
        icon: new Graphics(),
        name: this.createText('', 16, '#ffffff', 190),
        type: this.createText('', 11, '#b7c9c2', 190),
        description: this.createText('', 10, '#d7e9e2', 222),
        tag: this.createText('', 10, '#ffffff', 198),
        level: this.createText('', 11, '#ffd36b', 72),
      };

      card.view.position.set(28, 292 + index * 114);
      card.frame.visible = false;
      card.iconSprite.visible = false;
      card.iconSprite.anchor.set(0.5);
      card.badgeSprite.visible = false;
      card.view.eventMode = 'static';
      card.view.cursor = 'pointer';
      card.view.on('pointertap', () => {
        const option = this.options[index];

        if (option) {
          this.onSelect(option);
        }
      });
      card.view.addChild(card.frame, card.bg, card.iconSprite, card.icon, card.name, card.type, card.description, card.tag, card.levelBg, card.badgeSprite, card.level);
      this.cards.push(card);
      this.view.addChild(card.view);
    }
  }

  createRerollButton() {
    this.rerollButton.position.set(this.width / 2, 724);
    this.rerollButton.eventMode = 'static';
    this.rerollButton.cursor = 'pointer';
    this.rerollSprite.anchor.set(0.5);
    this.rerollSprite.visible = false;
    this.rerollButton.on('pointerdown', () => {
      if (this.rerolls > 0) {
        this.rerollPressed = true;
        this.renderRerollButton();
      }
    });
    this.rerollButton.on('pointerup', () => {
      this.rerollPressed = false;
      this.renderRerollButton();
    });
    this.rerollButton.on('pointerupoutside', () => {
      this.rerollPressed = false;
      this.renderRerollButton();
    });
    this.rerollButton.on('pointertap', () => this.reroll());
    this.rerollButton.addChild(this.rerollSprite, this.rerollBg, this.rerollText);
    this.view.addChild(this.rerollButton);
  }

  renderOptions() {
    this.cards.forEach((card, index) => {
      const option = this.options[index];

      if (!option) {
        card.view.visible = false;
        return;
      }

      card.view.visible = true;
      const color = option.color;
      const tags = option.adaptationTags ?? [];
      const isTagless = tags.length === 0 || option.countsAsAdaptation === false;
      const primaryTag = tags[0] ?? 'none';
      const currentLevel = this.gameState?.getSkillLevel(option.id) ?? 0;
      const nextLevel = Math.min(currentLevel + 1, option.maxLevel);
      const copy = getSkillCopy(option);
      const badgeState = currentLevel >= option.maxLevel ? 'owned' : currentLevel > 0 ? 'upgrade' : 'new';
      const levelText = badgeState === 'owned' ? '解析済み' : badgeState === 'upgrade' ? `強化 ${currentLevel}->${nextLevel}` : '新規解析';
      const previewText = currentLevel >= option.maxLevel ? '最大強化済み' : getUpgradePreview(option, currentLevel, nextLevel);
      const frameTexture = this.getCardFrameTexture(primaryTag, isTagless, badgeState);
      const iconTexture = this.getOptionIconTexture(option, primaryTag);
      const badgeTexture = this.getBadgeTexture(badgeState);
      const safeLevelText = badgeState === 'owned' ? '解析済み' : badgeState === 'upgrade' ? `強化 ${currentLevel}->${nextLevel}` : '新規解析';
      const safePreviewText = currentLevel >= option.maxLevel ? '最大強化済み' : getUpgradePreview(option, currentLevel, nextLevel);

      if (frameTexture) {
        card.frame.texture = frameTexture;
        card.frame.position.set(-8, -6);
        card.frame.width = this.width - 40;
        card.frame.height = 116;
        card.frame.alpha = currentLevel > 0 ? 0.96 : 1;
        card.frame.visible = true;
        card.bg.clear();
        card.bg.visible = false;
      } else {
        card.frame.visible = false;
        card.bg.visible = true;
        drawButtonFrame(card.bg, this.width - 56, 104, {
          accent: color,
          selected: currentLevel > 0,
          glow: currentLevel === 0,
        });
      }

      card.icon.clear();
      card.iconSprite.visible = false;

      if (iconTexture) {
        card.iconSprite.texture = iconTexture;
        card.iconSprite.position.set(isTagless ? 48 : 38, 52);
        card.iconSprite.width = 48;
        card.iconSprite.height = 48;
        card.iconSprite.visible = true;
      } else {
        const iconX = isTagless ? 48 : 38;
        card.icon
          .circle(iconX, 52, 24)
          .fill({ color, alpha: 0.16 })
          .stroke({ color, width: 2, alpha: 0.82 })
          .moveTo(iconX - 13, 54)
          .lineTo(iconX + 13, 40)
          .moveTo(iconX - 7, 64)
          .lineTo(iconX + 19, 50)
          .stroke({ color, width: 3, alpha: 0.86 });
      }

      card.levelBg.clear();
      if (badgeTexture) {
        card.badgeSprite.texture = badgeTexture;
        card.badgeSprite.position.set(this.width - 153, 12);
        card.badgeSprite.width = 92;
        card.badgeSprite.height = 28;
        card.badgeSprite.visible = true;
        card.levelBg.visible = false;
      } else {
        card.badgeSprite.visible = false;
        card.levelBg.visible = true;
        card.levelBg
          .roundRect(this.width - 142, 13, 82, 24, 6)
          .fill({ color: currentLevel > 0 ? 0x171d20 : color, alpha: currentLevel > 0 ? 0.86 : 0.24 })
          .stroke({ color, width: 1, alpha: 0.68 });
      }

      card.name.text = compactText(copy.name, 12);
      card.type.text = isTagless ? '基礎強化' : getAdaptationLabel(primaryTag);
      card.description.text = compactText(copy.description, 42);
      card.tag.text = compactText(safePreviewText, 28);
      card.level.text = safeLevelText;
      card.name.style.fill = toCssColor(color);
      card.tag.style.fill = toCssColor(color);

      card.name.style.fontSize = 15;
      card.name.style.wordWrapWidth = 142;
      card.type.style.fontSize = 10;
      card.type.style.wordWrapWidth = 142;
      card.description.style.fontSize = 9;
      card.description.style.lineHeight = 11;
      card.description.style.wordWrapWidth = 224;
      card.tag.style.fontSize = 9;
      card.tag.style.wordWrapWidth = 212;
      card.level.style.fontSize = 9;
      card.level.style.wordWrapWidth = 72;
      card.name.position.set(78, 13);
      card.type.position.set(78, 35);
      card.description.position.set(78, 52);
      card.tag.position.set(78, 84);
      card.level.anchor.set(0.5);
      card.level.position.set(this.width - 101, 25);
    });

    this.renderRerollButton();
  }

  renderRerollButton() {
    const rerollTexture = this.getRerollTexture();

    this.rerollBg.clear();
    if (rerollTexture) {
      this.rerollSprite.texture = rerollTexture;
      this.rerollSprite.width = 188;
      this.rerollSprite.height = 52;
      this.rerollSprite.visible = true;
      this.rerollBg.visible = false;
    } else {
      this.rerollSprite.visible = false;
      this.rerollBg.visible = true;
      drawButtonFrame(this.rerollBg, 184, 46, {
        accent: UI_COLORS.gold,
        selected: this.rerolls > 0,
        glow: this.rerolls > 0,
        disabled: this.rerolls <= 0,
      });
      this.rerollBg.position.set(-92, -23);
    }

    this.rerollText.text = `再解析 (${this.rerolls}/1)`;
    this.rerollText.anchor.set(0.5);
    this.rerollText.alpha = this.rerolls > 0 ? 1 : 0.42;
  }

  drawStatic() {
    this.backdrop
      .rect(0, 0, this.width, this.height)
      .fill({ color: 0x000000, alpha: 0.72 });

    drawPanel(this.panel, 14, 108, this.width - 28, 672, {
      accent: UI_COLORS.gold,
      alpha: 0.82,
      radius: 12,
      strokeAlpha: 0.48,
    });
    this.panel
      .roundRect(28, 126, this.width - 56, 92, 10)
      .fill({ color: 0x06171d, alpha: 0.62 })
      .stroke({ color: UI_COLORS.dna, width: 1, alpha: 0.26 });

    this.title.anchor.set(0.5);
    this.title.position.set(this.width / 2, 128);
    this.levelText.anchor.set(0.5);
    this.levelText.position.set(this.width / 2, 152);
    this.subtitle.anchor.set(0.5);
    this.subtitle.position.set(this.width / 2, 171);
    this.hintText.anchor.set(0.5);
    this.hintText.position.set(this.width / 2, 229);
    this.applyAssetLayout();
  }

  applyAssetLayout() {
    this.overlaySprite.visible = false;
    this.subtitleSprite.visible = false;
    this.footerSprite.visible = false;
    this.responseChipSprite.visible = false;
    this.headerIconSprite.visible = false;

    if (false && this.assetTextures.overlayGradientV2) {
      this.overlaySprite.texture = this.assetTextures.overlayGradientV2;
      this.overlaySprite.position.set(0, 0);
      this.overlaySprite.width = this.width;
      this.overlaySprite.height = this.height;
      this.overlaySprite.visible = true;
    }

    const backgroundTexture = this.assetTextures.backgroundPanelV3 ?? this.assetTextures.backgroundPanelV2 ?? this.assetTextures.backgroundPanel;
    if (backgroundTexture) {
      this.panelSprite.texture = backgroundTexture;
      this.panelSprite.position.set(0, 12);
      this.panelSprite.width = this.width;
      this.panelSprite.height = 822;
      this.panelSprite.visible = true;
      this.panel.clear();
    }

    const headerTexture = this.assetTextures.headerPanelV3 ?? this.assetTextures.headerPanelV2 ?? this.assetTextures.headerPanel;
    if (headerTexture) {
      this.headerSprite.texture = headerTexture;
      this.headerSprite.position.set(24, 96);
      this.headerSprite.width = this.width - 48;
      this.headerSprite.height = 92;
      this.headerSprite.visible = true;
    }

    if (this.assetTextures.warningChip) {
      this.warningChipSprite.texture = this.assetTextures.warningChip;
      this.warningChipSprite.position.set(70, 214);
      this.warningChipSprite.width = this.width - 140;
      this.warningChipSprite.height = 30;
      this.warningChipSprite.alpha = 0.86;
      this.warningChipSprite.visible = true;
    }
  }

  createText(text, size, fill, wordWrapWidth = 210) {
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

  shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  getStableAnalysisText(progress = {}) {
    const hint = getAdaptationHint(progress);

    if (hint.includes('強く反応')) {
      return '強反応検出';
    }

    if (hint.includes('近づいて')) {
      return '分岐反応あり';
    }

    if (hint.includes('探索中')) {
      return '反応探索中';
    }

    return '安定解析中';
  }

  getCardFrameTexture(tag, isTagless = false, state = 'new') {
    if (isTagless) {
      return state === 'upgrade' || state === 'owned'
        ? this.assetTextures.cardNoneSelectedV2 ?? this.assetTextures.cardNoneSelected ?? this.assetTextures.cardNoneV2 ?? this.assetTextures.cardNone
        : this.assetTextures.cardNoneV2 ?? this.assetTextures.cardNone;
    }

    if (tag === 'hunting') {
      return this.assetTextures.cardHunting;
    }

    if (tag === 'attack') {
      return this.assetTextures.cardAttack;
    }

    return this.assetTextures.cardSpeed;
  }

  getOptionIconTexture(option, tag) {
    const boostIconMap = {
      hard_skin: this.assetTextures.iconBoostHp,
      move_speed_up: this.assetTextures.iconBoostMoveSpeed,
      attack_speed_up: this.assetTextures.iconBoostAttackRate,
      attack_range_up: this.assetTextures.iconBoostAttackRange,
      pickup_range_up: this.assetTextures.iconBoostPickupRange,
      dna_gain_up: this.assetTextures.iconBoostDnaGain,
      exp_sense: this.assetTextures.iconBoostExpSense,
    };
    const skillIconMap = {
      afterimage_claw: this.assetTextures.iconAfterimageClaw,
      gale_blade: this.assetTextures.iconGaleBlade,
      accelerated_blades: this.assetTextures.iconAccelBlades,
      homing_fang: this.assetTextures.iconTrackingFang,
      sense_spike: this.assetTextures.iconSenseSpike,
      predator_marking: this.assetTextures.iconPredatorMark,
      shock_roar_wave: this.assetTextures.iconShockRoar,
      burst_fang: this.assetTextures.iconBurstFang,
      flame_breath: this.assetTextures.iconFlameBreath,
    };

    if (boostIconMap[option.id]) {
      return boostIconMap[option.id];
    }

    return skillIconMap[option.id] ?? this.getAdaptIconTexture(tag);
  }

  getAdaptIconTexture(tag) {
    if (tag === 'none') {
      return this.assetTextures.iconNone;
    }

    if (tag === 'hunting') {
      return this.assetTextures.iconHunting;
    }

    if (tag === 'attack') {
      return this.assetTextures.iconAttack;
    }

    if (tag === 'defense') {
      return this.assetTextures.iconDefense;
    }

    if (tag === 'toxic') {
      return this.assetTextures.iconToxic;
    }

    if (tag === 'crystal') {
      return this.assetTextures.iconCrystal;
    }

    return this.assetTextures.iconSpeed;
  }

  getBadgeTexture(state) {
    if (state === 'upgrade') {
      return this.assetTextures.badgeUpgradeV2 ?? this.assetTextures.badgeUpgrade;
    }

    if (state === 'owned') {
      return this.assetTextures.badgeOwnedV2 ?? this.assetTextures.badgeOwned;
    }

    if (state === 'locked') {
      return this.assetTextures.badgeLockedV2 ?? this.assetTextures.badgeLocked;
    }

    return this.assetTextures.badgeNewV2 ?? this.assetTextures.badgeNew;
  }

  getRerollTexture() {
    if (this.rerolls <= 0) {
      return this.assetTextures.rerollGreenDisabled ?? this.assetTextures.rerollDisabled;
    }

    if (this.rerollPressed) {
      return this.assetTextures.rerollGreenPressed ?? this.assetTextures.rerollPressed;
    }

    return this.assetTextures.rerollGreenIdle ?? this.assetTextures.rerollIdle;
  }
}
