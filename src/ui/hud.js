import { Assets, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';

const HUD_ASSETS = {
  topPanel: 'assets/ui/hud/hud_top_panel.png',
  hpBarFrame: 'assets/ui/hud/hp_bar_frame.png',
  expBarFrame: 'assets/ui/hud/exp_bar_frame.png',
  bossBarFrame: 'assets/ui/hud/boss_bar_frame.png',
  dnaCounterChip: 'assets/ui/hud/dna_counter_chip.png',
  skillSlotFrame: 'assets/ui/hud/skill_slot_frame.png',
  skillSlotEmpty: 'assets/ui/hud/skill_slot_empty.png',
  skillSlotActive: 'assets/ui/hud/skill_slot_active.png',
  specialButtonFrame: 'assets/ui/hud/special_button_frame.png',
  specialButtonReady: 'assets/ui/hud/special_button_ready.png',
  specialButtonDisabled: 'assets/ui/hud/special_button_disabled.png',
  pauseButton: 'assets/ui/hud/pause_button_frame.png',
  evolutionNotice: 'assets/ui/hud/branch_panel_a10b.png',
  branchIconFrame: 'assets/ui/hud/branch_icon_frame_a10b.png',
  branchGlow: 'assets/ui/hud/branch_glow_a10b.png',
  dnaIcon: 'assets/ui/home/icon_dna_red.png',
  portraitVelociraptor: 'assets/dinos/portraits/velociraptor.png',
  portraitTriceratops: 'assets/dinos/portraits/triceratops.png',
  portraitTyrannosaurus: 'assets/dinos/portraits/tyrannosaurus.png',
  portraitSpinosaurus: 'assets/dinos/portraits/spinosaurus.png',
  portraitSpeed: 'assets/dinos/evolutions/portraits/velociraptor_speed_portrait.png',
  portraitHunting: 'assets/dinos/evolutions/portraits/velociraptor_hunting_portrait.png',
  portraitAttack: 'assets/dinos/evolutions/portraits/velociraptor_attack_portrait.png',
  portraitVelociraptorZero: 'assets/dinos/evolutions/portraits/velociraptor_zero_portrait.png',
  portraitTriceratopsSpeed: 'assets/dinos/evolutions/portraits/triceratops_speed_portrait.png',
  portraitTriceratopsHunting: 'assets/dinos/evolutions/portraits/triceratops_hunting_portrait.png',
  portraitTriceratopsAttack: 'assets/dinos/evolutions/portraits/triceratops_attack_portrait.png',
  portraitTriceratopsZero: 'assets/dinos/evolutions/portraits/triceratops_zero_portrait.png',
  portraitTyrannosaurusSpeed: 'assets/dinos/evolutions/portraits/tyrannosaurus_speed_portrait.png',
  portraitTyrannosaurusHunting: 'assets/dinos/evolutions/portraits/tyrannosaurus_hunting_portrait.png',
  portraitTyrannosaurusAttack: 'assets/dinos/evolutions/portraits/tyrannosaurus_attack_portrait.png',
  portraitTyrannosaurusZero: 'assets/dinos/evolutions/portraits/tyrannosaurus_zero_portrait.png',
  portraitSpinosaurusSpeed: 'assets/dinos/evolutions/portraits/spinosaurus_speed_portrait.png',
  portraitSpinosaurusHunting: 'assets/dinos/evolutions/portraits/spinosaurus_hunting_portrait.png',
  portraitSpinosaurusAttack: 'assets/dinos/evolutions/portraits/spinosaurus_attack_portrait.png',
  portraitSpinosaurusZero: 'assets/dinos/evolutions/portraits/spinosaurus_zero_portrait.png',
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
  specialSpeed: 'assets/ui/hud/special_icons/special_speed_raptor.png',
  specialHunting: 'assets/ui/hud/special_icons/special_hunting_raptor.png',
  specialAttack: 'assets/ui/hud/special_icons/special_attack_raptor.png',
  specialVelociraptorZero: 'assets/ui/hud/special_icons/special_zero_velociraptor.png',
  specialTriceratopsSpeed: 'assets/ui/hud/special_icons/special_speed_triceratops.png',
  specialTriceratopsHunting: 'assets/ui/hud/special_icons/special_hunting_triceratops.png',
  specialTriceratopsAttack: 'assets/ui/hud/special_icons/special_attack_triceratops.png',
  specialTriceratopsZero: 'assets/ui/hud/special_icons/special_zero_triceratops.png',
  specialTyrannosaurusSpeed: 'assets/ui/hud/special_icons/special_speed_tyrannosaurus.png',
  specialTyrannosaurusHunting: 'assets/ui/hud/special_icons/special_hunting_tyrannosaurus.png',
  specialTyrannosaurusAttack: 'assets/ui/hud/special_icons/special_attack_tyrannosaurus.png',
  specialTyrannosaurusZero: 'assets/ui/hud/special_icons/special_zero_tyrannosaurus.png',
  specialSpinosaurusSpeed: 'assets/ui/hud/special_icons/special_speed_spinosaurus.png',
  specialSpinosaurusHunting: 'assets/ui/hud/special_icons/special_hunting_spinosaurus.png',
  specialSpinosaurusAttack: 'assets/ui/hud/special_icons/special_attack_spinosaurus.png',
  specialSpinosaurusZero: 'assets/ui/hud/special_icons/special_zero_spinosaurus.png',
};

const SKILL_DISPLAY = {
  attack_power_up: { label: 'ATK', color: 0xffc739, mark: 'slash', icon: 'Attack' },
  attack_speed_up: { label: 'SPD', color: 0x35d7ff, mark: 'speed', icon: 'Speed' },
  attack_range_up: { label: 'CLAW', color: 0xff4d38, mark: 'slash', icon: 'Attack' },
  move_speed_up: { label: 'RUN', color: 0x35d7ff, mark: 'speed', icon: 'Speed' },
  poison_bite: { label: 'VENOM', color: 0x7dff70, mark: 'venom', icon: 'Toxic' },
  bleed_claw: { label: 'CLAW', color: 0xff4d38, mark: 'slash', icon: 'Attack' },
  hard_skin: { label: 'HIDE', color: 0xffc739, mark: 'shield', icon: 'Defense' },
  exp_sense: { label: 'SENSE', color: 0xae73ff, mark: 'sense', icon: 'Crystal' },
  predator_instinct: { label: 'HUNT', color: 0xffc739, mark: 'sense', icon: 'Hunting' },
  shock_roar: { label: 'ROAR', color: 0xff4d38, mark: 'roar', icon: 'Attack' },
  afterimage_claw: { label: '残影', color: 0x35d7ff, mark: 'slash', asset: 'skillAfterimageClaw' },
  gale_blade: { label: '疾風', color: 0x35d7ff, mark: 'speed', asset: 'skillGaleBlade' },
  homing_fang: { label: '追尾牙', color: 0xffc739, mark: 'sense', asset: 'skillHomingFang' },
  sense_spike: { label: '感知棘', color: 0xffc739, mark: 'sense', asset: 'skillSenseSpike' },
  shock_roar_wave: { label: '咆哮', color: 0xff4d38, mark: 'roar', asset: 'skillShockRoar' },
  burst_fang: { label: '爆牙', color: 0xff4d38, mark: 'roar', asset: 'skillBurstFang' },
  accelerated_blades: { label: '刃群', color: 0x35d7ff, mark: 'speed', asset: 'skillAccelBlades' },
  predator_marking: { label: '捕食', color: 0xffc739, mark: 'sense', asset: 'skillPredatorMark' },
  flame_breath: { label: '火炎', color: 0xff4d38, mark: 'roar', asset: 'skillFlameBreath' },
};

const SPECIAL_LABELS = {
  speed: 'Swift Claw',
  hunting: 'Hunt Trace',
  attack: 'Shock Roar',
  triceratops_speed: 'Horn Rush',
  triceratops_hunting: 'Bastion',
  triceratops_attack: 'Quake Ram',
  tyrannosaurus_speed: 'Pounce',
  tyrannosaurus_hunting: 'Terror Hunt',
  tyrannosaurus_attack: 'Devour',
  tyrannosaurus_zero: 'Omega',
  velociraptor_zero: 'Abyss',
  triceratops_zero: 'Ignis',
  spinosaurus_speed: 'Tidal',
  spinosaurus_hunting: 'Maelstrom',
  spinosaurus_attack: 'Hydro',
  spinosaurus_zero: 'Abyssal',
};

const NEW_DINO_HUD_KEYS = {
  ankylosaurus: 'Ankylosaurus',
  parasaurolophus: 'Parasaurolophus',
  stegosaurus: 'Stegosaurus',
  pteranodon: 'Pteranodon',
  compsognathus: 'Compsognathus',
  ornithomimus: 'Ornithomimus',
};
const EVOLUTION_HUD_SUFFIX = {
  speed: 'Speed',
  hunting: 'Hunting',
  attack: 'Attack',
  zero: 'Zero',
};
const NEW_DINO_SPECIAL_LABELS = {
  ankylosaurus: { speed: 'Roll', hunting: 'Sensor', attack: 'Crater', zero: 'Bunker' },
  parasaurolophus: { speed: 'Echo', hunting: 'Pulse', attack: 'Sonic', zero: 'Resonance' },
  stegosaurus: { speed: 'Plate', hunting: 'Sensor', attack: 'Quake', zero: 'Reactor' },
  pteranodon: { speed: 'Glide', hunting: 'Dive', attack: 'Gale', zero: 'Voidwing' },
  compsognathus: { speed: 'Dash', hunting: 'Pack', attack: 'Swarm', zero: 'Resonant' },
  ornithomimus: { speed: 'Sprint', hunting: 'Trace', attack: 'Impact', zero: 'Overdrive' },
};

Object.entries(NEW_DINO_HUD_KEYS).forEach(([dinoId, dinoKey]) => {
  HUD_ASSETS[`portrait${dinoKey}`] = `assets/dinos/portraits/${dinoId}.png`;
  Object.entries(EVOLUTION_HUD_SUFFIX).forEach(([tag, suffix]) => {
    HUD_ASSETS[`portrait${dinoKey}${suffix}`] = `assets/dinos/evolutions/portraits/${dinoId}_${tag}_portrait.png`;
    HUD_ASSETS[`special${dinoKey}${suffix}`] = `assets/ui/hud/special_icons/special_${tag}_${dinoId}.png`;
    SPECIAL_LABELS[`${dinoId}_${tag}`] = NEW_DINO_SPECIAL_LABELS[dinoId]?.[tag] ?? 'Special';
  });
});

const TOP_HUD = {
  y: 6,
  height: 96,
  portrait: { x: 50, y: 54, width: 50, height: 50 },
  status: { x: 99, y: 31, width: 164, height: 49, cx: 181 },
  info: { x: 275, y: 26, width: 101, height: 59, cx: 326 },
};

const HUD_BAR = {
  width: 114,
  height: 16,
  x: TOP_HUD.status.x + (TOP_HUD.status.width - 114) / 2,
  hpY: 36,
  expY: 58,
  fillInsetX: 8,
  fillInsetY: 6,
  fillWidth: 98,
  fillHeight: 4,
};

const BOSS_BAR = {
  x: 44,
  y: 178,
  frameHeight: 33,
  safeInsetX: 20,
  safeInsetY: 11,
  safeHeight: 10,
};

function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

function cssColor(color) {
  return `#${color.toString(16).padStart(6, '0')}`;
}

function getNewDinoHudKey(dinoId) {
  return NEW_DINO_HUD_KEYS[dinoId] ?? null;
}

function getNewDinoHudTextureKey(prefix, dinoId, tag = null) {
  const dinoKey = getNewDinoHudKey(dinoId);
  if (!dinoKey) {
    return null;
  }

  if (!tag) {
    return `${prefix}${dinoKey}`;
  }

  const suffix = EVOLUTION_HUD_SUFFIX[tag];
  return suffix ? `${prefix}${dinoKey}${suffix}` : null;
}

export class Hud {
  constructor({ width, height }) {
    this.width = width;
    this.height = height;
    this.view = new Container();
    this.assetTextures = {};

    this.backdrop = new Graphics();
    this.topPanelSprite = new Sprite(Texture.EMPTY);
    this.hpFrameSprite = new Sprite(Texture.EMPTY);
    this.expFrameSprite = new Sprite(Texture.EMPTY);
    this.bossFrameSprite = new Sprite(Texture.EMPTY);
    this.dnaIconSprite = new Sprite(Texture.EMPTY);
    this.portraitSprite = new Sprite(Texture.EMPTY);
    this.portraitFrameSprite = new Sprite(Texture.EMPTY);
    this.portraitFrame = new Graphics();
    this.portraitFallback = new Graphics();
    this.pauseButton = new Container();
    this.pauseButtonSprite = new Sprite(Texture.EMPTY);
    this.pauseButtonBg = new Graphics();
    this.pauseButtonIcon = new Graphics();
    this.branchPanel = new Container();
    this.branchGlowSprite = new Sprite(Texture.EMPTY);
    this.branchSprite = new Sprite(Texture.EMPTY);
    this.branchPortraitSprite = new Sprite(Texture.EMPTY);
    this.branchIconFrameSprite = new Sprite(Texture.EMPTY);
    this.branchFallback = new Graphics();
    this.branchIcon = new Graphics();
    this.branchTitle = this.createText(11, '#ffd36b');
    this.branchName = this.createText(11, '#e7fff6');
    this.hpBarBack = new Graphics();
    this.hpBarFill = new Graphics();
    this.expBarBack = new Graphics();
    this.expBarFill = new Graphics();
    this.hpLabel = this.createText(10, '#ff4d38');
    this.expLabel = this.createText(10, '#35d7ff');
    this.hpText = this.createText(8);
    this.expText = this.createText(8);
    this.dnaText = this.createText(10);
    this.timeText = this.createText(17);
    this.killsText = this.createText(11);
    this.scoreText = this.createText(10, '#ffd36b');
    this.infoPanel = new Graphics();
    this.dangerBg = new Graphics();
    this.dangerText = this.createText(12, '#ff6b62');
    this.bossBarBack = new Graphics();
    this.bossBarFill = new Graphics();
    this.bossNameText = this.createText(12, '#ffd36b');
    this.skillSlots = [];
    this.ultimateButton = new Container();
    this.ultimateButtonSprite = new Sprite(Texture.EMPTY);
    this.ultimateIconSprite = new Sprite(Texture.EMPTY);
    this.ultimateButtonBg = new Graphics();
    this.ultimateGaugeFill = new Graphics();
    this.ultimateText = this.createText(10, '#ffd36b');
    this.ultimateName = this.createText(10, '#e7fff6');
    this.lastScore = 0;
    this.scorePulse = 0;

    this.prepareSprites();
    this.view.addChild(
      this.backdrop,
      this.topPanelSprite,
      this.portraitSprite,
      this.portraitFallback,
      this.portraitFrame,
      this.portraitFrameSprite,
      this.hpFrameSprite,
      this.expFrameSprite,
      this.bossFrameSprite,
      this.infoPanel,
      this.hpBarBack,
      this.hpBarFill,
      this.expBarBack,
      this.expBarFill,
      this.hpLabel,
      this.expLabel,
      this.hpText,
      this.expText,
      this.dnaIconSprite,
      this.dnaText,
      this.timeText,
      this.killsText,
      this.scoreText,
      this.branchPanel,
      this.dangerBg,
      this.dangerText,
      this.bossBarBack,
      this.bossBarFill,
      this.bossNameText,
      this.pauseButton,
    );

    this.createSkillSlots();
    this.view.addChild(...this.skillSlots.map((slot) => slot.view), this.ultimateButton);

    this.pauseButton.addChild(this.pauseButtonSprite, this.pauseButtonBg, this.pauseButtonIcon);
    this.pauseButton.eventMode = 'static';
    this.pauseButton.cursor = 'pointer';
    this.pauseButton.position.set(width - 34, 114);

    this.branchPanel.addChild(
      this.branchGlowSprite,
      this.branchSprite,
      this.branchIconFrameSprite,
      this.branchFallback,
      this.branchIcon,
      this.branchPortraitSprite,
      this.branchTitle,
      this.branchName,
    );

    this.ultimateButton.addChild(
      this.ultimateButtonSprite,
      this.ultimateButtonBg,
      this.ultimateGaugeFill,
      this.ultimateIconSprite,
      this.ultimateText,
      this.ultimateName,
    );
    this.ultimateButton.position.set(width - 66, height - 116);

    this.drawStatic();
    this.loadAssets();
  }

  prepareSprites() {
    [
      this.topPanelSprite,
      this.hpFrameSprite,
      this.expFrameSprite,
      this.bossFrameSprite,
      this.dnaIconSprite,
      this.pauseButtonSprite,
      this.branchGlowSprite,
      this.branchSprite,
      this.branchPortraitSprite,
      this.branchIconFrameSprite,
      this.ultimateButtonSprite,
      this.ultimateIconSprite,
      this.portraitSprite,
      this.portraitFrameSprite,
    ].forEach((sprite) => {
      sprite.visible = false;
    });
    this.pauseButtonSprite.anchor.set(0.5);
    this.ultimateButtonSprite.anchor.set(0.5);
    this.ultimateIconSprite.anchor.set(0.5);
    this.dnaIconSprite.anchor.set(0.5);
    this.portraitSprite.anchor.set(0.5);
    this.portraitFrameSprite.anchor.set(0.5);
    this.branchPortraitSprite.anchor.set(0.5);
  }

  createSkillSlots() {
    for (let index = 0; index < 3; index += 1) {
      const view = new Container();
      const frame = new Sprite(Texture.EMPTY);
      const iconSprite = new Sprite(Texture.EMPTY);
      const bg = new Graphics();
      const icon = new Graphics();
      const label = this.createText(9);
      const level = this.createText(9, '#e7fff6');

      frame.anchor.set(0.5);
      iconSprite.anchor.set(0.5);
      label.anchor.set(0.5, 0);
      level.anchor.set(0.5);
      iconSprite.visible = false;
      view.addChild(frame, bg, iconSprite, icon, label, level);
      view.position.set(142 + index * 48, this.height - 54);
      this.skillSlots.push({ view, frame, iconSprite, bg, icon, label, level });
    }
  }

  async loadAssets() {
    await Promise.all(Object.entries(HUD_ASSETS).map(async ([key, path]) => {
      try {
        this.assetTextures[key] = await Assets.load(assetUrl(path));
      } catch {
        this.assetTextures[key] = null;
      }
    }));
    this.applyAssetTextures();
  }

  applyAssetTextures() {
    if (this.assetTextures.topPanel) {
      this.topPanelSprite.texture = this.assetTextures.topPanel;
      this.topPanelSprite.position.set(0, TOP_HUD.y);
      this.topPanelSprite.width = this.width;
      this.topPanelSprite.height = TOP_HUD.height;
      this.topPanelSprite.alpha = 0.95;
      this.topPanelSprite.visible = true;
      this.backdrop.clear();
    }

    if (this.assetTextures.hpBarFrame) {
      this.hpFrameSprite.texture = this.assetTextures.hpBarFrame;
      this.hpFrameSprite.position.set(HUD_BAR.x, HUD_BAR.hpY);
      this.hpFrameSprite.width = HUD_BAR.width;
      this.hpFrameSprite.height = HUD_BAR.height;
      this.hpFrameSprite.alpha = 0.94;
      this.hpFrameSprite.visible = true;
    }

    if (this.assetTextures.expBarFrame) {
      this.expFrameSprite.texture = this.assetTextures.expBarFrame;
      this.expFrameSprite.position.set(HUD_BAR.x, HUD_BAR.expY);
      this.expFrameSprite.width = HUD_BAR.width;
      this.expFrameSprite.height = HUD_BAR.height;
      this.expFrameSprite.alpha = 0.94;
      this.expFrameSprite.visible = true;
    }

    if (this.assetTextures.dnaIcon) {
      this.dnaIconSprite.texture = this.assetTextures.dnaIcon;
      this.dnaIconSprite.position.set(TOP_HUD.status.cx - 32, 77);
      this.dnaIconSprite.width = 13;
      this.dnaIconSprite.height = 13;
      this.dnaIconSprite.visible = true;
    }

    if (this.assetTextures.pauseButton) {
      this.pauseButtonSprite.texture = this.assetTextures.pauseButton;
      this.pauseButtonSprite.width = 58;
      this.pauseButtonSprite.height = 58;
      this.pauseButtonSprite.visible = true;
      this.pauseButtonBg.visible = false;
    }

    if (this.assetTextures.evolutionNotice) {
      this.branchSprite.texture = this.assetTextures.evolutionNotice;
      this.branchSprite.width = 260;
      this.branchSprite.height = 72;
      this.branchSprite.visible = true;
      this.branchFallback.visible = false;
    }
    if (this.assetTextures.branchGlow) {
      this.branchGlowSprite.texture = this.assetTextures.branchGlow;
      this.branchGlowSprite.position.set(62, 61);
      this.branchGlowSprite.width = 174;
      this.branchGlowSprite.height = 14;
      this.branchGlowSprite.alpha = 0.55;
      this.branchGlowSprite.visible = true;
    }
    if (this.assetTextures.branchIconFrame) {
      this.branchIconFrameSprite.texture = this.assetTextures.branchIconFrame;
      this.branchIconFrameSprite.position.set(9, 8);
      this.branchIconFrameSprite.width = 62;
      this.branchIconFrameSprite.height = 62;
      this.branchIconFrameSprite.alpha = 0.94;
      this.branchIconFrameSprite.visible = true;
    }

    this.skillSlots.forEach((slot) => {
      slot.frame.visible = true;
    });
  }

  update(gameState, boss = null, options = {}) {
    const minutes = Math.floor(gameState.elapsedTime / 60);
    const seconds = Math.floor(gameState.elapsedTime % 60);
    const time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const expProgress = Math.max(0, Math.min(gameState.expProgress, 1));
    const hpProgress = Math.max(0, Math.min(gameState.playerHp / gameState.playerMaxHp, 1));
    const ultimateProgress = Math.max(0, Math.min(gameState.ultimateGauge / 100, 1));
    const dnaEstimate = Math.max(0, Math.floor((gameState.totalExpGained ?? 0) * 0.35 + (gameState.defeatedBosses ?? 0) * 8));

    if (gameState.score > this.lastScore) {
      this.scorePulse = 1;
    } else {
      this.scorePulse = Math.max(0, this.scorePulse - 0.08);
    }

    this.lastScore = gameState.score;
    this.hpText.text = `${Math.ceil(gameState.playerHp)} / ${gameState.playerMaxHp}`;
    this.expText.text = `${Math.round(expProgress * 100)}%`;
    this.dnaText.text = `DNA  +${dnaEstimate}`;
    this.timeText.text = time;
    this.killsText.text = `KILLS ${this.formatCompactNumber(gameState.defeatedCount)}`;
    this.scoreText.text = `SCORE ${this.formatCompactNumber(gameState.score)}`;
    this.scoreText.scale.set(1 + this.scorePulse * 0.06);

    this.updateBars(hpProgress, expProgress);
    this.updatePortrait(gameState);
    this.updateDanger(hpProgress);
    this.updateBranchNotice(gameState);
    this.updateSkillSlots(gameState.ownedSkills);
    this.updateUltimate(gameState, ultimateProgress);
    this.drawBossBar(options.suppressBossBar ? null : boss, options);
  }

  updateBars(hpProgress, expProgress) {
    const fillX = HUD_BAR.x + HUD_BAR.fillInsetX;
    const hpFillY = HUD_BAR.hpY + HUD_BAR.fillInsetY;
    const expFillY = HUD_BAR.expY + HUD_BAR.fillInsetY;

    this.hpBarFill
      .clear()
      .roundRect(fillX, hpFillY, HUD_BAR.fillWidth * hpProgress, HUD_BAR.fillHeight, 2)
      .fill({ color: hpProgress > 0.35 ? 0xff3848 : 0xffb02e, alpha: 0.96 });

    this.expBarFill
      .clear()
      .roundRect(fillX, expFillY, HUD_BAR.fillWidth * expProgress, HUD_BAR.fillHeight, 2)
      .fill({ color: 0x32d7ff, alpha: 0.94 });
  }

  updatePortrait(gameState) {
    const texture = this.getBasePortraitTexture(gameState);
    const color = this.getPortraitColor(null);

    this.portraitFrame.clear();

    if (texture) {
      const fit = this.getBasePortraitFit(gameState);
      this.fitHudPortraitSprite(this.portraitSprite, texture, {
        centerX: TOP_HUD.portrait.x + fit.offsetX,
        centerY: TOP_HUD.portrait.y + fit.offsetY,
        maxWidth: fit.maxWidth,
        maxHeight: fit.maxHeight,
      });
      this.portraitFallback.clear();
      return;
    }

    this.portraitSprite.visible = false;
    this.drawPortraitFallback(color);
  }

  updateDanger(hpProgress) {
    this.dangerBg.clear();
    this.dangerText.text = '';

    if (hpProgress > 0.28) {
      return;
    }

    this.dangerBg
      .roundRect(this.width / 2 - 70, 144, 140, 24, 7)
      .fill({ color: 0x170405, alpha: 0.84 })
      .stroke({ color: 0xff3848, width: 1.4, alpha: 0.84 });
    this.dangerText.text = 'DANGER: LOW HP';
    this.dangerText.anchor.set(0.5);
    this.dangerText.position.set(this.width / 2, 156);
  }

  updateBranchNotice(gameState) {
    const selectedEvolution = gameState?.selectedEvolution ?? null;
    const hasEvolution = Boolean(selectedEvolution);
    this.branchPanel.visible = hasEvolution;

    if (!hasEvolution) {
      this.branchPortraitSprite.visible = false;
      this.branchIconFrameSprite.visible = false;
      return;
    }

    const portraitTexture = this.getEvolutionPortraitTexture(gameState);
    this.branchTitle.text = 'BRANCH';
    this.branchName.text = selectedEvolution.evolutionName ?? selectedEvolution.tag ?? '';
    this.branchPanel.position.set(10, TOP_HUD.y + TOP_HUD.height + 8);
    this.branchPanel.alpha = 0.98;
    this.branchTitle.position.set(86, 12);
    this.branchName.position.set(86, 36);
    this.branchTitle.style.fontSize = 11.5;
    this.branchName.style.fontSize = 11;
    this.branchName.style.wordWrapWidth = 154;

    this.branchIcon.clear();
    if (portraitTexture) {
      const fit = this.getBranchPortraitFit(gameState);
      this.fitHudPortraitSprite(this.branchPortraitSprite, portraitTexture, {
        centerX: 40 + fit.offsetX,
        centerY: 39 + fit.offsetY,
        maxWidth: fit.maxWidth,
        maxHeight: fit.maxHeight,
      });
      this.branchIconFrameSprite.visible = Boolean(this.assetTextures.branchIconFrame);
      return;
    }

    this.branchPortraitSprite.visible = false;
    this.branchIconFrameSprite.visible = false;
    this.branchIcon
      .circle(40, 39, 22)
      .stroke({ color: 0xffc739, width: 2, alpha: 0.86 })
      .moveTo(30, 49)
      .lineTo(50, 29)
      .stroke({ color: 0xffc739, width: 3, alpha: 0.9 });
  }

  fitHudPortraitSprite(sprite, texture, { centerX, centerY, maxWidth, maxHeight, alpha = 1 }) {
    const sourceWidth = texture?.width || maxWidth;
    const sourceHeight = texture?.height || maxHeight;
    const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);
    sprite.texture = texture;
    sprite.position.set(centerX, centerY);
    sprite.width = sourceWidth * scale;
    sprite.height = sourceHeight * scale;
    sprite.alpha = alpha;
    sprite.visible = true;
  }

  getBasePortraitFit(gameState) {
    const dinoId = gameState?.selectedDino ?? 'velociraptor';
    if (dinoId === 'spinosaurus') {
      return { maxWidth: 44, maxHeight: 44, offsetX: 0, offsetY: 2 };
    }

    if (dinoId === 'triceratops') {
      return { maxWidth: 46, maxHeight: 44, offsetX: 0, offsetY: 1 };
    }

    return { maxWidth: TOP_HUD.portrait.width, maxHeight: TOP_HUD.portrait.height, offsetX: 0, offsetY: 0 };
  }

  getBranchPortraitFit(gameState) {
    const dinoId = gameState?.selectedEvolution?.dinoId ?? gameState?.selectedDino ?? 'velociraptor';
    if (dinoId === 'spinosaurus') {
      return { maxWidth: 43, maxHeight: 43, offsetX: 0, offsetY: 1 };
    }

    if (dinoId === 'triceratops') {
      return { maxWidth: 43, maxHeight: 41, offsetX: 0, offsetY: 1 };
    }

    if (dinoId === 'tyrannosaurus') {
      return { maxWidth: 44, maxHeight: 44, offsetX: 0, offsetY: 1 };
    }

    return { maxWidth: 45, maxHeight: 45, offsetX: 0, offsetY: 0 };
  }

  updateSkillSlots(ownedSkills = []) {
    this.skillSlots.forEach((slot, index) => {
      const skill = ownedSkills[index];
      const meta = skill ? (SKILL_DISPLAY[skill.id] ?? { label: 'SKILL', color: 0x35d7ff, mark: 'sense' }) : null;
      const texture = skill
        ? (this.assetTextures.skillSlotActive ?? this.assetTextures.skillSlotFrame)
        : this.assetTextures.skillSlotEmpty;

      if (texture) {
        slot.frame.texture = texture;
        slot.frame.width = 56;
        slot.frame.height = 56;
        slot.bg.clear();
      } else {
        this.drawSkillSlotFallback(slot.bg, Boolean(skill), meta?.color ?? 0x35d7ff);
      }

      slot.icon.clear();
      slot.iconSprite.visible = false;

      if (skill) {
        const iconTexture = meta.asset ? this.assetTextures[meta.asset] : this.getAdaptIconTexture(meta.icon);

        if (iconTexture) {
          slot.iconSprite.texture = iconTexture;
          slot.iconSprite.width = 34;
          slot.iconSprite.height = 34;
          slot.iconSprite.position.set(0, -3);
          slot.iconSprite.visible = true;
        } else {
          this.drawSkillIcon(slot.icon, meta);
        }

        slot.label.text = meta.label;
        slot.label.style.fill = cssColor(meta.color);
        slot.level.text = `強${skill.level}`;
        slot.level.visible = true;
      } else {
        slot.label.text = 'EMPTY';
        slot.label.style.fill = '#6e7c78';
        slot.level.visible = false;
      }

      slot.label.position.set(0, 28);
      slot.level.position.set(18, 8);
      slot.view.alpha = skill ? 1 : 0.5;
    });
  }

  updateUltimate(gameState, progress) {
    const selectedEvolution = gameState.selectedEvolution;
    const hasEvolution = Boolean(selectedEvolution);

    this.ultimateButton.visible = hasEvolution;
    this.ultimateButton.eventMode = hasEvolution ? 'static' : 'none';
    this.ultimateButton.cursor = hasEvolution ? 'pointer' : 'default';

    if (!hasEvolution) {
      return;
    }

    const canUse = gameState.ultimateReady;
    const pulse = canUse ? 0.5 + Math.sin(Date.now() * 0.012) * 0.5 : 0;
    const frameTexture = canUse
      ? this.assetTextures.specialButtonReady
      : this.assetTextures.specialButtonFrame ?? this.assetTextures.specialButtonDisabled;

    if (frameTexture) {
      this.ultimateButtonSprite.texture = frameTexture;
      this.ultimateButtonSprite.width = 132 + pulse * 6;
      this.ultimateButtonSprite.height = 132 + pulse * 6;
      this.ultimateButtonSprite.alpha = 0.96;
      this.ultimateButtonSprite.visible = true;
      this.ultimateButtonBg.clear();
    } else {
      this.ultimateButtonSprite.visible = false;
      this.drawUltimateFallback(canUse, pulse);
    }

    const iconTexture = this.getSpecialIconTexture(selectedEvolution);
    if (iconTexture) {
      this.ultimateIconSprite.texture = iconTexture;
      this.ultimateIconSprite.width = 64;
      this.ultimateIconSprite.height = 64;
      this.ultimateIconSprite.visible = true;
      this.ultimateIconSprite.alpha = canUse ? 1 : 0.68;
    } else {
      this.ultimateIconSprite.visible = false;
    }

    this.ultimateGaugeFill
      .clear()
      .arc(0, 0, 56, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress)
      .stroke({ color: canUse ? 0xffc739 : 0x35d7ff, width: 4, alpha: canUse ? 0.92 : 0.6 });

    this.ultimateText.text = canUse ? 'SPECIAL READY' : `SPECIAL ${Math.round(progress * 100)}%`;
    this.ultimateText.anchor.set(0.5);
    this.ultimateText.position.set(0, -74);
    this.ultimateText.style.fill = canUse ? '#ffd36b' : '#7cf7d4';
    this.ultimateName.text = SPECIAL_LABELS[selectedEvolution.id] ?? SPECIAL_LABELS[selectedEvolution.tag] ?? 'Special';
    this.ultimateName.anchor.set(0.5);
    this.ultimateName.position.set(0, 72);
    this.ultimateName.alpha = 0.88;
  }

  getSpecialIconTexture(selectedEvolution) {
    const tag = typeof selectedEvolution === 'string' ? selectedEvolution : selectedEvolution?.tag;
    const dinoId = typeof selectedEvolution === 'string'
      ? null
      : selectedEvolution?.dinoId;

    if (dinoId === 'triceratops') {
      if (tag === 'zero') {
        return this.assetTextures.specialTriceratopsZero ?? this.assetTextures.specialTriceratopsAttack ?? this.assetTextures.specialAttack;
      }

      if (tag === 'hunting') {
        return this.assetTextures.specialTriceratopsHunting ?? this.assetTextures.specialHunting;
      }

      if (tag === 'attack') {
        return this.assetTextures.specialTriceratopsAttack ?? this.assetTextures.specialAttack;
      }

      return this.assetTextures.specialTriceratopsSpeed ?? this.assetTextures.specialSpeed;
    }

    if (dinoId === 'tyrannosaurus') {
      if (tag === 'zero') {
        return this.assetTextures.specialTyrannosaurusZero ?? this.assetTextures.specialTyrannosaurusAttack ?? this.assetTextures.specialAttack;
      }

      if (tag === 'hunting') {
        return this.assetTextures.specialTyrannosaurusHunting ?? this.assetTextures.specialHunting;
      }

      if (tag === 'attack') {
        return this.assetTextures.specialTyrannosaurusAttack ?? this.assetTextures.specialAttack;
      }

      return this.assetTextures.specialTyrannosaurusSpeed ?? this.assetTextures.specialSpeed;
    }

    if (dinoId === 'spinosaurus') {
      if (tag === 'zero') {
        return this.assetTextures.specialSpinosaurusZero ?? this.assetTextures.specialSpinosaurusAttack ?? this.assetTextures.specialAttack;
      }

      if (tag === 'hunting') {
        return this.assetTextures.specialSpinosaurusHunting ?? this.assetTextures.specialHunting;
      }

      if (tag === 'attack') {
        return this.assetTextures.specialSpinosaurusAttack ?? this.assetTextures.specialAttack;
      }

      return this.assetTextures.specialSpinosaurusSpeed ?? this.assetTextures.specialSpeed;
    }

    const newDinoSpecialKey = getNewDinoHudTextureKey('special', dinoId, tag);
    if (newDinoSpecialKey && this.assetTextures[newDinoSpecialKey]) {
      return this.assetTextures[newDinoSpecialKey];
    }

    if (dinoId === 'velociraptor' && tag === 'zero') {
      return this.assetTextures.specialVelociraptorZero ?? this.assetTextures.specialAttack;
    }

    if (tag === 'hunting') {
      return this.assetTextures.specialHunting;
    }

    if (tag === 'attack') {
      return this.assetTextures.specialAttack;
    }

    return this.assetTextures.specialSpeed;
  }

  getAdaptIconTexture(icon) {
    if (!icon) {
      return null;
    }

    return this.assetTextures[`adapt${icon}`] ?? null;
  }

  getBasePortraitTexture(gameState) {
    const dinoId = gameState?.selectedDino ?? 'velociraptor';

    if (dinoId === 'triceratops') {
      return this.assetTextures.portraitTriceratops;
    }

    if (dinoId === 'tyrannosaurus') {
      return this.assetTextures.portraitTyrannosaurus;
    }

    if (dinoId === 'spinosaurus') {
      return this.assetTextures.portraitSpinosaurus;
    }

    const newDinoPortraitKey = getNewDinoHudTextureKey('portrait', dinoId);
    if (newDinoPortraitKey && this.assetTextures[newDinoPortraitKey]) {
      return this.assetTextures[newDinoPortraitKey];
    }

    return this.assetTextures.portraitVelociraptor;
  }

  getEvolutionPortraitTexture(gameState) {
    const tag = gameState.selectedEvolution?.tag;
    const evolvedDinoId = gameState.selectedEvolution?.dinoId ?? gameState.selectedDino;

    if (tag && evolvedDinoId === 'triceratops') {
      if (tag === 'zero') {
        return this.assetTextures.portraitTriceratopsZero ?? this.assetTextures.portraitTriceratopsAttack ?? this.assetTextures.portraitTriceratops;
      }

      if (tag === 'speed') {
        return this.assetTextures.portraitTriceratopsSpeed ?? this.assetTextures.portraitTriceratops;
      }

      if (tag === 'hunting') {
        return this.assetTextures.portraitTriceratopsHunting ?? this.assetTextures.portraitTriceratops;
      }

      if (tag === 'attack') {
        return this.assetTextures.portraitTriceratopsAttack ?? this.assetTextures.portraitTriceratops;
      }
    }

    if (tag && evolvedDinoId === 'tyrannosaurus') {
      if (tag === 'zero') {
        return this.assetTextures.portraitTyrannosaurusZero ?? this.assetTextures.portraitTyrannosaurusAttack ?? this.assetTextures.portraitTyrannosaurus;
      }

      if (tag === 'speed') {
        return this.assetTextures.portraitTyrannosaurusSpeed ?? this.assetTextures.portraitTyrannosaurus;
      }

      if (tag === 'hunting') {
        return this.assetTextures.portraitTyrannosaurusHunting ?? this.assetTextures.portraitTyrannosaurus;
      }

      if (tag === 'attack') {
        return this.assetTextures.portraitTyrannosaurusAttack ?? this.assetTextures.portraitTyrannosaurus;
      }
    }

    if (tag && evolvedDinoId === 'spinosaurus') {
      if (tag === 'zero') {
        return this.assetTextures.portraitSpinosaurusZero ?? this.assetTextures.portraitSpinosaurusAttack ?? this.assetTextures.portraitSpinosaurus;
      }

      if (tag === 'speed') {
        return this.assetTextures.portraitSpinosaurusSpeed ?? this.assetTextures.portraitSpinosaurus;
      }

      if (tag === 'hunting') {
        return this.assetTextures.portraitSpinosaurusHunting ?? this.assetTextures.portraitSpinosaurus;
      }

      if (tag === 'attack') {
        return this.assetTextures.portraitSpinosaurusAttack ?? this.assetTextures.portraitSpinosaurus;
      }
    }

    const newDinoPortraitKey = getNewDinoHudTextureKey('portrait', evolvedDinoId, tag);
    if (newDinoPortraitKey && this.assetTextures[newDinoPortraitKey]) {
      return this.assetTextures[newDinoPortraitKey];
    }

    if (tag) {
      if (tag === 'zero' && evolvedDinoId === 'velociraptor') {
        return this.assetTextures.portraitVelociraptorZero ?? this.assetTextures.portraitAttack ?? this.assetTextures.portraitVelociraptor;
      }

      if (tag === 'speed') {
        return this.assetTextures.portraitSpeed;
      }

      if (tag === 'hunting') {
        return this.assetTextures.portraitHunting;
      }

      if (tag === 'attack') {
        return this.assetTextures.portraitAttack;
      }
    }

    return null;
  }

  getPortraitColor(tag) {
    if (tag === 'attack') {
      return 0xff4d38;
    }

    if (tag === 'hunting') {
      return 0xffc739;
    }

    return 0x35d7ff;
  }

  formatCompactNumber(value) {
    const number = Math.max(0, Math.floor(value ?? 0));

    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    }

    if (number >= 10000) {
      return `${Math.floor(number / 1000)}K`;
    }

    return `${number}`;
  }

  drawStatic() {
    this.backdrop
      .clear()
      .roundRect(6, TOP_HUD.y, this.width - 12, TOP_HUD.height - 10, 8)
      .fill({ color: 0x040f13, alpha: 0.66 })
      .stroke({ color: 0x35d7ff, width: 1.2, alpha: 0.28 });

    this.infoPanel
      .clear()
      .roundRect(TOP_HUD.info.x, TOP_HUD.info.y, TOP_HUD.info.width, TOP_HUD.info.height, 7)
      .fill({ color: 0x040f13, alpha: 0.46 });

    this.hpBarBack
      .clear()
      .roundRect(HUD_BAR.x + HUD_BAR.fillInsetX, HUD_BAR.hpY + HUD_BAR.fillInsetY, HUD_BAR.fillWidth, HUD_BAR.fillHeight, 2)
      .fill({ color: 0x22080b, alpha: 0.88 })
      .stroke({ color: 0xff5765, width: 1, alpha: 0.3 });

    this.expBarBack
      .clear()
      .roundRect(HUD_BAR.x + HUD_BAR.fillInsetX, HUD_BAR.expY + HUD_BAR.fillInsetY, HUD_BAR.fillWidth, HUD_BAR.fillHeight, 2)
      .fill({ color: 0x06171d, alpha: 0.88 })
      .stroke({ color: 0x64e7ff, width: 1, alpha: 0.3 });

    this.drawPortraitBadge();
    this.drawPauseFallback();

    this.hpLabel.text = 'HP';
    this.hpLabel.anchor.set(0, 0.5);
    this.hpLabel.position.set(TOP_HUD.status.x + 8, HUD_BAR.hpY + HUD_BAR.height / 2);
    this.expLabel.text = 'EXP';
    this.expLabel.anchor.set(0, 0.5);
    this.expLabel.position.set(TOP_HUD.status.x + 8, HUD_BAR.expY + HUD_BAR.height / 2);
    this.hpText.anchor.set(0.5);
    this.expText.anchor.set(0.5);
    this.hpText.position.set(TOP_HUD.status.cx, HUD_BAR.hpY + HUD_BAR.height / 2);
    this.expText.position.set(TOP_HUD.status.cx, HUD_BAR.expY + HUD_BAR.height / 2);
    this.dnaText.anchor.set(0.5, 0.5);
    this.dnaText.position.set(TOP_HUD.status.cx + 8, 77);
    this.timeText.anchor.set(0.5, 0.5);
    this.killsText.anchor.set(0.5, 0.5);
    this.scoreText.anchor.set(0.5, 0.5);
    this.timeText.position.set(TOP_HUD.info.cx, 38);
    this.killsText.position.set(TOP_HUD.info.cx, 56);
    this.scoreText.position.set(TOP_HUD.info.cx, 73);

    this.ultimateButton.visible = false;
  }

  drawPortraitBadge() {
    this.portraitFrame.clear();

    this.drawPortraitFallback(0xffc739);
  }

  drawPortraitFallback(color = 0xffc739) {
    this.portraitFallback
      .clear()
      .roundRect(TOP_HUD.portrait.x - 25, TOP_HUD.portrait.y - 29, 50, 58, 9)
      .fill({ color: 0xfff0c8, alpha: 0.68 })
      .stroke({ color, width: 1, alpha: 0.32 })
      .poly([
        TOP_HUD.portrait.x - 10,
        TOP_HUD.portrait.y + 12,
        TOP_HUD.portrait.x - 6,
        TOP_HUD.portrait.y - 14,
        TOP_HUD.portrait.x + 18,
        TOP_HUD.portrait.y - 8,
        TOP_HUD.portrait.x + 17,
        TOP_HUD.portrait.y + 8,
        TOP_HUD.portrait.x + 6,
        TOP_HUD.portrait.y,
      ])
      .fill({ color: 0x343a3c, alpha: 0.9 });
  }

  drawPauseFallback() {
    this.pauseButtonBg
      .clear()
      .roundRect(-23, -23, 46, 46, 8)
      .fill({ color: 0x041216, alpha: 0.78 })
      .stroke({ color: 0x35d7ff, width: 1.5, alpha: 0.72 });

    this.pauseButtonIcon
      .clear()
      .roundRect(-8, -10, 5, 20, 1)
      .fill({ color: 0xe7fff6, alpha: 0.92 })
      .roundRect(4, -10, 5, 20, 1)
      .fill({ color: 0xe7fff6, alpha: 0.92 });
  }

  drawSkillSlotFallback(graphics, active, color) {
    graphics
      .clear()
      .roundRect(-22, -22, 44, 44, 8)
      .fill({ color: 0x041216, alpha: active ? 0.8 : 0.42 })
      .stroke({ color, width: 1.5, alpha: active ? 0.74 : 0.24 });
  }

  drawSkillIcon(graphics, meta) {
    const color = meta.color;
    graphics
      .circle(0, -3, 16)
      .fill({ color: 0x000000, alpha: 0.22 })
      .stroke({ color, width: 1.4, alpha: 0.88 });

    if (meta.mark === 'slash') {
      graphics
        .moveTo(-9, 7)
        .lineTo(8, -11)
        .moveTo(-2, 9)
        .lineTo(12, -5)
        .stroke({ color, width: 3, alpha: 0.94 });
      return;
    }

    if (meta.mark === 'venom') {
      graphics
        .circle(-5, -4, 6)
        .fill({ color, alpha: 0.86 })
        .circle(5, -3, 8)
        .fill({ color, alpha: 0.78 });
      return;
    }

    if (meta.mark === 'shield') {
      graphics
        .poly([0, -15, 13, -8, 10, 11, -10, 11, -13, -8])
        .fill({ color, alpha: 0.86 });
      return;
    }

    graphics
      .arc(0, -2, 11, 0.4, 5.6)
      .stroke({ color, width: 3, alpha: 0.92 });
  }

  drawUltimateFallback(canUse, pulse) {
    const color = canUse ? 0xffc739 : 0x35d7ff;
    this.ultimateButtonBg
      .clear()
      .circle(0, 0, 62 + pulse * 3)
      .fill({ color: 0x120708, alpha: 0.84 })
      .stroke({ color, width: canUse ? 4 : 2, alpha: canUse ? 0.94 : 0.58 })
      .circle(0, 0, 44)
      .stroke({ color, width: 1.5, alpha: 0.58 });
  }

  createText(size, fill = '#e7fff6') {
    return new Text({
      text: '',
      style: {
        fill,
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: size,
        fontWeight: '700',
        letterSpacing: 0,
      },
    });
  }

  drawBossBar(boss, options = {}) {
    this.bossBarBack.clear();
    this.bossBarFill.clear();
    this.bossNameText.text = '';

    if (!boss || boss.isDead) {
      this.bossFrameSprite.visible = false;
      return;
    }

    const barWidth = this.width - 88;
    const progress = Math.max(0, Math.min(boss.hp / boss.maxHp, 1));
    const x = BOSS_BAR.x;
    const y = options.offsetBossBarForBranch ? BOSS_BAR.y + 38 : BOSS_BAR.y;
    const frameWidth = barWidth + 12;
    const frameX = x - 6;
    const frameY = y - 8;

    if (this.assetTextures.bossBarFrame) {
      this.bossFrameSprite.texture = this.assetTextures.bossBarFrame;
      this.bossFrameSprite.position.set(frameX, frameY);
      this.bossFrameSprite.width = frameWidth;
      this.bossFrameSprite.height = BOSS_BAR.frameHeight;
      this.bossFrameSprite.visible = true;
      this.bossFrameSprite.alpha = 0.96;
    } else {
      this.bossFrameSprite.visible = false;
    }

    const safeX = this.assetTextures.bossBarFrame ? frameX + BOSS_BAR.safeInsetX : x + 12;
    const safeY = this.assetTextures.bossBarFrame ? frameY + BOSS_BAR.safeInsetY : y + 6;
    const safeWidth = this.assetTextures.bossBarFrame ? frameWidth - BOSS_BAR.safeInsetX * 2 : barWidth - 24;
    const safeHeight = this.assetTextures.bossBarFrame ? BOSS_BAR.safeHeight : 6;

    this.bossBarBack
      .roundRect(safeX, safeY, safeWidth, safeHeight, 3)
      .fill({ color: 0x160506, alpha: 0.92 })
      .stroke({ color: 0xff3848, width: this.assetTextures.bossBarFrame ? 0.5 : 1.8, alpha: this.assetTextures.bossBarFrame ? 0.25 : 0.78 });

    this.bossBarFill
      .roundRect(safeX + 3, safeY + 3, (safeWidth - 6) * progress, Math.max(3, safeHeight - 6), 2)
      .fill({ color: progress > 0.35 ? 0xff3848 : 0xffb02e, alpha: 0.96 });

    this.bossNameText.text = `${boss.displayLabel ?? 'APEX'} ${boss.name}`;
    this.bossNameText.anchor.set(0.5);
    this.bossNameText.position.set(this.width / 2, y - 16);
    this.bossNameText.alpha = 0.94;
  }
}
