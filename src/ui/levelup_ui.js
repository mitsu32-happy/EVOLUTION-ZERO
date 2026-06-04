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

const FALLBACK_LEVELUP_OPTIONS = [
  {
    id: 'fallback_dna_reward',
    type: 'fallbackReward',
    rewardType: 'dna',
    color: UI_COLORS.dna,
    displayName: 'DNA獲得',
    name: 'DNA獲得',
    displayDescription: '追加DNAを獲得して戦闘を続ける。',
    description: '追加DNAを獲得して戦闘を続ける。',
    adaptationTags: [],
    countsAsAdaptation: false,
    maxLevel: 1,
    levelUpText: 'DNA +18',
    upgradeSummary: 'DNA +18',
  },
  {
    id: 'fallback_heal_reward',
    type: 'fallbackReward',
    rewardType: 'heal',
    color: UI_COLORS.green,
    displayName: 'HP回復',
    name: 'HP回復',
    displayDescription: 'HPを回復して戦線を立て直す。',
    description: 'HPを回復して戦線を立て直す。',
    adaptationTags: [],
    countsAsAdaptation: false,
    maxLevel: 1,
    levelUpText: 'HP +25%',
    upgradeSummary: 'HP +25%',
  },
  {
    id: 'fallback_score_reward',
    type: 'fallbackReward',
    rewardType: 'score',
    color: UI_COLORS.gold,
    displayName: 'スコア加算',
    name: 'スコア加算',
    displayDescription: 'スコアを獲得して次の戦闘へ戻る。',
    description: 'スコアを獲得して次の戦闘へ戻る。',
    adaptationTags: [],
    countsAsAdaptation: false,
    maxLevel: 1,
    levelUpText: 'SCORE +250',
    upgradeSummary: 'SCORE +250',
  },
];

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
  fallbackRewardCardA07b: 'assets/ui/selection/fallback_reward_card_a07b.png',
  fallbackRewardCardDnaA07c: 'assets/ui/selection/fallback_card_dna_a07c.png',
  fallbackRewardCardHealA07c: 'assets/ui/selection/fallback_card_heal_a07c.png',
  fallbackRewardCardScoreA07c: 'assets/ui/selection/fallback_card_score_a07c.png',
  warningChip: 'assets/ui/selection/evolution_reaction_panel_a10b.png',
  warningGlow: 'assets/ui/selection/evolution_reaction_glow_a10b.png',
  warningAccentChip: 'assets/ui/selection/evolution_reaction_chip_a10b.png',
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
  statCardCommonA10d1: 'assets/ui/selection/levelup_stat_card_common_a10d1.png',
  statCardHpA10d1: 'assets/ui/selection/levelup_stat_card_hp_a10d1.png',
  statCardAttackA10d1: 'assets/ui/selection/levelup_stat_card_attack_a10d1.png',
  statCardSpeedA10d1: 'assets/ui/selection/levelup_stat_card_speed_a10d1.png',
  statCardRateA10d1: 'assets/ui/selection/levelup_stat_card_rate_a10d1.png',
  statCardPickupA10d1: 'assets/ui/selection/levelup_stat_card_pickup_a10d1.png',
  cardNone: 'assets/ui/selection/adaptation_card_none_panel.png',
  cardNoneSelected: 'assets/ui/selection/adaptation_card_none_panel_selected.png',
  statIconHpA10c: 'assets/ui/selection/levelup_stat_icon_hp_a10c.png',
  statIconAttackA10c: 'assets/ui/selection/levelup_stat_icon_attack_a10c.png',
  statIconSpeedA10c: 'assets/ui/selection/levelup_stat_icon_speed_a10c.png',
  statIconRateA10c: 'assets/ui/selection/levelup_stat_icon_rate_a10c.png',
  statIconPickupA10c: 'assets/ui/selection/levelup_stat_icon_pickup_a10c.png',
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
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 3)}...` : normalized;
}

const SKILL_COPY = {
  attack_power_up: {
    name: '攻撃力増加',
    type: '火力',
    description: '攻撃の威力が上がる。',
  },
  move_speed_up: {
    name: '移動速度増加',
    type: '移動',
    description: '移動が速くなる。',
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
    name: 'HP増加',
    type: '耐久',
    description: '最大HPが増える。',
  },
  exp_sense: {
    name: '回収範囲増加',
    type: '回収',
    description: 'EXPを拾いやすくなる。',
  },
  predator_instinct: {
    name: '捕食本能',
    type: '狩猟補助',
    description: '通常技と適応技の威力を少し高める。',
  },
  shock_roar: {
    name: '電磁咆哮',
    type: '制圧適応',
    description: '攻撃時、範囲を短く制圧する。',
  },
};

function getSkillCopy(skill) {
  const override = SKILL_COPY[skill.id];
  if (override) {
    return override;
  }

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
  return '選択可能な適応を表示中です';
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
    this.warningGlowSprite = new Sprite(Texture.EMPTY);
    this.warningChipSprite = new Sprite(Texture.EMPTY);
    this.warningAccentSprite = new Sprite(Texture.EMPTY);
    this.responseChipSprite = new Sprite(Texture.EMPTY);
    this.headerIconSprite = new Sprite(Texture.EMPTY);
    this.title = this.createText('レベルアップ！', 22, '#ffd36b', 250);
    this.subtitle = this.createText('新しい適応を選択', 12, '#e7fff6', 210);
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
    this.title.text = 'レベルアップ！';
    this.subtitle.text = '新しい適応を選択';

    this.view.visible = false;
    this.view.eventMode = 'static';
    this.panelSprite.visible = false;
    this.headerSprite.visible = false;
    this.subtitleSprite.visible = false;
    this.footerSprite.visible = false;
    this.warningGlowSprite.visible = false;
    this.overlaySprite.visible = false;
    this.warningChipSprite.visible = false;
    this.warningAccentSprite.visible = false;
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
      this.warningGlowSprite,
      this.warningChipSprite,
      this.warningAccentSprite,
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
    this.levelText.text = `レベル ${fromLevel} → ${toLevel}`;
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

    FALLBACK_LEVELUP_OPTIONS.forEach((option) => {
      if (selected.length < 3 && !selected.some((item) => item.id === option.id)) {
        selected.push(option);
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
      const isFallbackReward = option.type === 'fallbackReward';
      const isStatUpgrade = isTagless && !isFallbackReward;
      const currentLevel = isFallbackReward ? 0 : this.gameState?.getSkillLevel(option.id) ?? 0;
      const nextLevel = Math.min(currentLevel + 1, option.maxLevel);
      const copy = getSkillCopy(option);
      const badgeState = isFallbackReward ? 'new' : currentLevel >= option.maxLevel ? 'owned' : currentLevel > 0 ? 'upgrade' : 'new';
      const frameTexture = isFallbackReward
        ? this.getFallbackRewardCardTexture(option) ?? this.assetTextures.fallbackRewardCardA07b ?? this.getCardFrameTexture(primaryTag, true, badgeState)
        : this.getCardFrameTexture(primaryTag, isTagless, badgeState, option);
      const iconTexture = isStatUpgrade ? null : this.getOptionIconTexture(option, primaryTag);
      const badgeTexture = this.getBadgeTexture(badgeState);
      const safeLevelText = isFallbackReward ? '補助' : badgeState === 'owned' ? '解析済み' : badgeState === 'upgrade' ? `強化 ${currentLevel}->${nextLevel}` : '新規解析';
      const safePreviewText = isFallbackReward ? option.levelUpText : currentLevel >= option.maxLevel ? '最大強化済み' : getUpgradePreview(option, currentLevel, nextLevel);

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
        card.iconSprite.position.set(isTagless ? 49 : 38, 52);
        const iconSize = isTagless ? 54 : 48;
        card.iconSprite.width = iconSize;
        card.iconSprite.height = iconSize;
        card.iconSprite.visible = true;
      } else if (!isStatUpgrade) {
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
      card.type.text = isStatUpgrade ? 'STATUS / 能力強化' : isTagless ? copy.type : getAdaptationLabel(primaryTag);
      card.description.text = compactText(copy.description, 42);
      card.tag.text = compactText(safePreviewText, 28);
      card.level.text = safeLevelText;
      card.name.style.fill = isTagless ? '#f1fbff' : toCssColor(color);
      card.tag.style.fill = toCssColor(color);

      card.name.style.fontSize = isStatUpgrade ? 15 : isTagless ? 16 : 15;
      card.name.style.wordWrapWidth = isStatUpgrade ? 150 : isTagless ? 160 : 142;
      card.type.style.fontSize = isStatUpgrade ? 9.5 : isTagless ? 11 : 10;
      card.type.style.wordWrapWidth = isStatUpgrade ? 148 : 142;
      card.description.style.fontSize = isTagless ? 10 : 9;
      card.description.style.lineHeight = isTagless ? 12 : 11;
      card.description.style.wordWrapWidth = isStatUpgrade ? 178 : 224;
      card.tag.style.fontSize = 9;
      card.tag.style.wordWrapWidth = 212;
      card.level.style.fontSize = 9;
      card.level.style.wordWrapWidth = 72;
      const textX = isStatUpgrade ? 116 : 78;
      card.name.position.set(textX, 13);
      card.type.position.set(textX, 35);
      card.description.position.set(textX, 52);
      card.tag.position.set(textX, 84);
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
    this.hintText.position.set(this.width / 2, 227);
    this.hintText.style.fill = '#fff7d2';
    this.hintText.style.fontSize = 13;
    this.hintText.style.fontWeight = '900';
    this.hintText.style.dropShadow = true;
    this.hintText.style.dropShadowColor = '#001018';
    this.hintText.style.dropShadowAlpha = 0.95;
    this.hintText.style.dropShadowBlur = 3;
    this.hintText.style.dropShadowDistance = 1;
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
      this.warningChipSprite.position.set(48, 200);
      this.warningChipSprite.width = this.width - 96;
      this.warningChipSprite.height = 58;
      this.warningChipSprite.alpha = 0.82;
      this.warningChipSprite.visible = true;
    }
    if (this.assetTextures.warningGlow) {
      this.warningGlowSprite.texture = this.assetTextures.warningGlow;
      this.warningGlowSprite.position.set(92, 239);
      this.warningGlowSprite.width = this.width - 148;
      this.warningGlowSprite.height = 12;
      this.warningGlowSprite.alpha = 0.34;
      this.warningGlowSprite.visible = true;
    }
    if (this.assetTextures.warningAccentChip) {
      this.warningAccentSprite.texture = this.assetTextures.warningAccentChip;
      this.warningAccentSprite.position.set(this.width - 99, 213);
      this.warningAccentSprite.width = 46;
      this.warningAccentSprite.height = 22;
      this.warningAccentSprite.alpha = 0.38;
      this.warningAccentSprite.visible = true;
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

    return '選択可能';
  }

  getCardFrameTexture(tag, isTagless = false, state = 'new', option = null) {
    if (isTagless) {
      const statTexture = this.getStatCardTexture(option);
      if (statTexture) {
        return statTexture;
      }

      return this.assetTextures.statCardCommonA10c ?? (state === 'upgrade' || state === 'owned'
        ? this.assetTextures.cardNoneSelectedV2 ?? this.assetTextures.cardNoneSelected ?? this.assetTextures.cardNoneV2 ?? this.assetTextures.cardNone
        : this.assetTextures.cardNoneV2 ?? this.assetTextures.cardNone);
    }

    if (tag === 'hunting') {
      return this.assetTextures.cardHunting;
    }

    if (tag === 'attack') {
      return this.assetTextures.cardAttack;
    }

    return this.assetTextures.cardSpeed;
  }

  getFallbackRewardCardTexture(option) {
    if (option?.rewardType === 'heal') {
      return this.assetTextures.fallbackRewardCardHealA07c;
    }
    if (option?.rewardType === 'score') {
      return this.assetTextures.fallbackRewardCardScoreA07c;
    }
    return this.assetTextures.fallbackRewardCardDnaA07c;
  }

  getStatCardTexture(option) {
    const map = {
      hard_skin: this.assetTextures.statCardHpA10d1,
      attack_power_up: this.assetTextures.statCardAttackA10d1,
      move_speed_up: this.assetTextures.statCardSpeedA10d1,
      attack_speed_up: this.assetTextures.statCardRateA10d1,
      exp_sense: this.assetTextures.statCardPickupA10d1,
      pickup_range_up: this.assetTextures.statCardPickupA10d1,
    };

    return map[option?.id] ?? this.assetTextures.statCardCommonA10d1;
  }

  getOptionIconTexture(option, tag) {
    const boostIconMap = {
      fallback_dna_reward: this.assetTextures.iconBoostDnaGain,
      fallback_heal_reward: this.assetTextures.iconBoostHp,
      fallback_score_reward: this.assetTextures.iconNone,
      hard_skin: this.assetTextures.statIconHpA10c ?? this.assetTextures.iconBoostHp,
      attack_power_up: this.assetTextures.statIconAttackA10c ?? this.assetTextures.iconBoostAttackRange,
      move_speed_up: this.assetTextures.statIconSpeedA10c ?? this.assetTextures.iconBoostMoveSpeed,
      attack_speed_up: this.assetTextures.statIconRateA10c ?? this.assetTextures.iconBoostAttackRate,
      attack_range_up: this.assetTextures.iconBoostAttackRange,
      pickup_range_up: this.assetTextures.statIconPickupA10c ?? this.assetTextures.iconBoostPickupRange,
      dna_gain_up: this.assetTextures.iconBoostDnaGain,
      exp_sense: this.assetTextures.statIconPickupA10c ?? this.assetTextures.iconBoostExpSense,
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
