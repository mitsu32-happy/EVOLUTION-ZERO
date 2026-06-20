import { ASSET_KEYS } from './asset_manifest.js';

export const COMPANION_HATCH_CONFIG = {
  dnaCost: 150,
  researchPtCost: 0,
  durationMs: 3 * 60 * 60 * 1000,
  debugDurationMs: 3000,
};

export const COMPANION_TUTORIAL_FLAGS = {
  eggPickup: 'companionEggPickup',
  eggResearch: 'companionEggResearch',
  obtained: 'companionObtained',
  set: 'companionSet',
};

export const COMPANION_UPGRADE_TYPES = {
  range: {
    id: 'range',
    label: '移動範囲',
    shortLabel: '範囲',
    description: 'お供が行動できる範囲が広がる',
    costMultiplier: 1,
  },
  effect: {
    id: 'effect',
    label: '効果',
    shortLabel: '効果',
    description: '攻撃・回復・補助効果が上がる',
    costMultiplier: 1.12,
  },
  speed: {
    id: 'speed',
    label: '速度',
    shortLabel: '速度',
    description: '移動速度と行動のキレが上がる',
    costMultiplier: 0.95,
  },
};

export const COMPANION_UPGRADE_TYPE_IDS = Object.keys(COMPANION_UPGRADE_TYPES);

export const COMPANION_TYPES = {
  attack: { label: '近接攻撃型', accent: 0xff776b },
  area: { label: '範囲攻撃型', accent: 0xffb04d },
  ranged: { label: '遠距離支援型', accent: 0x35d7ff },
  heal: { label: '回復型', accent: 0x65e878 },
  pickup: { label: '回収型', accent: 0x35d7ff },
  defense: { label: '防御補助型', accent: 0x9ec8ff },
  exp: { label: 'EXP補助型', accent: 0xd9b4ff },
  boss: { label: 'ボス特化型', accent: 0xfff0b4 },
  swarm: { label: '雑魚処理型', accent: 0xff9f38 },
  synergy: { label: 'シナジー補助型', accent: 0xc8fbff },
};

const companionAssets = {
  raptorling: ['raptorlingSprite', 'raptorlingIcon', 'raptorlingEffect'],
  spino_pup: ['spinoPupSprite', 'spinoPupIcon', 'spinoPupEffect'],
  medic_saur: ['medicSaurSprite', 'medicSaurIcon', 'medicSaurEffect'],
  ptera_chick: ['pteraChickSprite', 'pteraChickIcon', 'pteraChickEffect'],
  tricera_calf: ['triceraCalfSprite', 'triceraCalfIcon', 'triceraCalfEffect'],
  para_juvenile: ['paraJuvenileSprite', 'paraJuvenileIcon', 'paraJuvenileEffect'],
  stego_calf: ['stegoCalfSprite', 'stegoCalfIcon', 'stegoCalfEffect'],
  rex_hatchling: ['rexHatchlingSprite', 'rexHatchlingIcon', 'rexHatchlingEffect'],
  compy_pack: ['compyPackSprite', 'compyPackIcon', 'compyPackEffect'],
  exp_chaser: ['expChaserSprite', 'expChaserIcon', 'expChaserEffect'],
};

function withAssets(id, values) {
  const [sprite, icon, effect] = companionAssets[id];

  return {
    ...values,
    assetKey: ASSET_KEYS.companions?.[sprite] ?? `companions.${sprite}`,
    iconAssetKey: ASSET_KEYS.companions?.[icon] ?? `companions.${icon}`,
    effectAssetKey: ASSET_KEYS.companions?.[effect] ?? `companions.${effect}`,
  };
}

export const COMPANION_DINOS = [
  withAssets('raptorling', {
    id: 'raptorling',
    displayName: 'ラプトリング',
    species: 'ヴェロキラプトル幼体',
    type: 'attack',
    description: '近い敵を素早く切り裂く、雑魚処理向けのお供です。',
    skill: 'クイッククロー',
    rarity: 'common',
    level: 1,
    maxLevel: 5,
    behavior: { damage: 10, damageGrowth: 3, interval: 1.75, intervalGrowth: 0.12, range: 180, rangeGrowth: 5, targets: 1 },
  }),
  withAssets('spino_pup', {
    id: 'spino_pup',
    displayName: 'スピノパップ',
    species: 'スピノサウルス幼体',
    type: 'area',
    description: '水刃で複数の敵を巻き込み、中距離を制圧します。',
    skill: 'ミニスプラッシュ',
    rarity: 'rare',
    level: 1,
    maxLevel: 5,
    behavior: { damage: 8, damageGrowth: 2.5, interval: 3.25, intervalGrowth: 0.16, range: 210, rangeGrowth: 8, targets: 3, targetsAtLevel: { 4: 4 } },
  }),
  withAssets('medic_saur', {
    id: 'medic_saur',
    displayName: 'メディサウル',
    species: '小型草食竜',
    type: 'heal',
    description: 'HPが減った時、一定間隔で少し回復します。',
    skill: 'リカバリーパルス',
    rarity: 'rare',
    level: 1,
    maxLevel: 5,
    behavior: { heal: 5, healGrowth: 2, interval: 10.5, intervalGrowth: 0.45, threshold: 0.86 },
  }),
  withAssets('ptera_chick', {
    id: 'ptera_chick',
    displayName: 'プテラチック',
    species: 'プテラノドン幼鳥',
    type: 'ranged',
    description: '少し遠い敵へ小弾を飛ばし、接近前に牽制します。',
    skill: 'スカウトピック',
    rarity: 'common',
    level: 1,
    maxLevel: 5,
    behavior: { damage: 7, damageGrowth: 2, interval: 2.45, intervalGrowth: 0.11, range: 285, rangeGrowth: 10, minRange: 105, targets: 1 },
  }),
  withAssets('tricera_calf', {
    id: 'tricera_calf',
    displayName: 'トリケラカーフ',
    species: 'トリケラトプス幼体',
    type: 'defense',
    description: '短時間の小バリアで、被弾リスクを軽減します。',
    skill: 'ガードホーン',
    rarity: 'common',
    level: 1,
    maxLevel: 5,
    behavior: { interval: 12.8, intervalGrowth: 0.55, guardDuration: 0.42, durationGrowth: 0.06 },
  }),
  withAssets('para_juvenile', {
    id: 'para_juvenile',
    displayName: 'パラジュブナイル',
    species: 'パラサウロロフス幼体',
    type: 'pickup',
    description: '近くのEXPやアイテムを引き寄せ、回収を助けます。',
    skill: 'ランニングコール',
    rarity: 'common',
    level: 1,
    maxLevel: 5,
    behavior: { pickupRadius: 150, radiusGrowth: 18, pullMultiplier: 1.18, pullGrowth: 0.08 },
  }),
  withAssets('stego_calf', {
    id: 'stego_calf',
    displayName: 'ステゴカーフ',
    species: 'ステゴサウルス幼体',
    type: 'synergy',
    description: '周囲の敵へ小さなDNA衝撃を放つ、接近戦向けのお供です。',
    skill: 'シナジープレート',
    rarity: 'rare',
    level: 1,
    maxLevel: 5,
    behavior: { damage: 7, damageGrowth: 2, interval: 4.25, intervalGrowth: 0.18, range: 150, rangeGrowth: 8, targets: 4, targetsAtLevel: { 5: 5 } },
  }),
  withAssets('rex_hatchling', {
    id: 'rex_hatchling',
    displayName: 'レックスハッチ',
    species: 'ティラノサウルス幼体',
    type: 'boss',
    description: 'ボスを優先して重い一撃を入れる、ボス特化のお供です。',
    skill: 'ボスバイト',
    rarity: 'epic',
    level: 1,
    maxLevel: 5,
    behavior: { damage: 13, damageGrowth: 4, interval: 3.35, intervalGrowth: 0.15, range: 275, rangeGrowth: 8, bossBonus: 1.7, bossBonusGrowth: 0.05, targets: 1 },
  }),
  withAssets('compy_pack', {
    id: 'compy_pack',
    displayName: 'コンピー隊',
    species: 'コンプソグナトゥス群れ',
    type: 'swarm',
    description: '弱った敵を優先して、小さな連続攻撃で削ります。',
    skill: 'パックラッシュ',
    rarity: 'common',
    level: 1,
    maxLevel: 5,
    behavior: { damage: 5, damageGrowth: 1.6, interval: 1.42, intervalGrowth: 0.08, range: 215, rangeGrowth: 6, targets: 2, targetsAtLevel: { 4: 3 } },
  }),
  withAssets('exp_chaser', {
    id: 'exp_chaser',
    displayName: 'エクスピー',
    species: '小型解析竜',
    type: 'exp',
    description: 'EXP獲得量を少し高め、成長テンポを支援します。',
    skill: 'グロウセンサー',
    rarity: 'rare',
    level: 1,
    maxLevel: 5,
    behavior: { expMultiplier: 1.045, expGrowth: 0.008, pickupRadius: 95, radiusGrowth: 8, pullMultiplier: 1.08, pullGrowth: 0.04 },
  }),
];

export const COMPANION_BY_ID = COMPANION_DINOS.reduce((result, companion) => {
  result[companion.id] = companion;
  return result;
}, {});

export function getCompanionById(id) {
  return COMPANION_BY_ID[id] ?? null;
}

export function createDefaultCompanionState() {
  return {
    ownedIds: [],
    selectedId: null,
    levels: {},
    upgradeLevels: {},
    eggPending: false,
    eggDiscovered: false,
    eggIncubating: false,
    hatchStartedAt: null,
    hatchCompleteAt: null,
    lastHatchedId: null,
    tutorialFlags: {
      eggPickup: false,
      eggResearch: false,
      obtained: false,
      set: false,
    },
  };
}

export function normalizeCompanionUpgradeLevels(value = {}, fallbackLevel = 1, maxLevel = 5) {
  const source = typeof value === 'object' && value !== null ? value : {};
  const fallback = Math.max(1, Math.min(maxLevel, Math.floor(Number.isFinite(Number(fallbackLevel)) ? Number(fallbackLevel) : 1)));

  return COMPANION_UPGRADE_TYPE_IDS.reduce((result, typeId) => {
    const raw = Number(source[typeId] ?? fallback);
    result[typeId] = Math.max(1, Math.min(maxLevel, Math.floor(Number.isFinite(raw) ? raw : fallback)));
    return result;
  }, {});
}

export function getCompanionTotalLevel(upgradeLevels = {}, fallbackLevel = 1) {
  const levels = normalizeCompanionUpgradeLevels(upgradeLevels, fallbackLevel);
  return Math.max(...COMPANION_UPGRADE_TYPE_IDS.map((typeId) => levels[typeId] ?? 1));
}

export function normalizeCompanionState(value = {}) {
  const defaults = createDefaultCompanionState();
  const source = typeof value === 'object' && value !== null ? value : {};
  const validIds = new Set(COMPANION_DINOS.map((companion) => companion.id));
  const ownedIds = Array.isArray(source.ownedIds)
    ? [...new Set(source.ownedIds.filter((id) => validIds.has(id)))]
    : [];
  const levels = ownedIds.reduce((result, id) => {
    const companion = getCompanionById(id);
    const valueLevel = Number(source.levels?.[id] ?? 1);
    const upgradeLevels = normalizeCompanionUpgradeLevels(source.upgradeLevels?.[id], valueLevel, companion?.maxLevel ?? 5);
    result[id] = getCompanionTotalLevel(upgradeLevels, valueLevel);
    return result;
  }, {});
  const upgradeLevels = ownedIds.reduce((result, id) => {
    const companion = getCompanionById(id);
    result[id] = normalizeCompanionUpgradeLevels(source.upgradeLevels?.[id], source.levels?.[id] ?? 1, companion?.maxLevel ?? 5);
    return result;
  }, {});
  const selectedId = ownedIds.includes(source.selectedId) ? source.selectedId : null;
  const tutorialFlags = Object.keys(defaults.tutorialFlags).reduce((result, key) => {
    result[key] = Boolean(source.tutorialFlags?.[key]);
    return result;
  }, {});

  return {
    ownedIds,
    selectedId,
    levels,
    upgradeLevels,
    eggPending: Boolean(source.eggPending),
    eggDiscovered: Boolean(source.eggDiscovered || source.eggPending || source.eggIncubating || ownedIds.length > 0 || source.lastHatchedId),
    eggIncubating: Boolean(source.eggIncubating),
    hatchStartedAt: typeof source.hatchStartedAt === 'string' ? source.hatchStartedAt : null,
    hatchCompleteAt: typeof source.hatchCompleteAt === 'string' ? source.hatchCompleteAt : null,
    lastHatchedId: validIds.has(source.lastHatchedId) ? source.lastHatchedId : null,
    tutorialFlags,
  };
}

export function cloneCompanionState(value = {}) {
  const normalized = normalizeCompanionState(value);

  return {
    ...normalized,
    ownedIds: [...normalized.ownedIds],
    levels: { ...normalized.levels },
    upgradeLevels: Object.fromEntries(Object.entries(normalized.upgradeLevels ?? {}).map(([id, levels]) => [id, { ...levels }])),
    tutorialFlags: { ...normalized.tutorialFlags },
  };
}

export function getUnownedCompanionIds(state = {}) {
  const normalized = normalizeCompanionState(state);
  const owned = new Set(normalized.ownedIds);
  return COMPANION_DINOS.map((companion) => companion.id).filter((id) => !owned.has(id));
}

export function pickRandomUnownedCompanion(state = {}, rng = Math.random) {
  const unowned = getUnownedCompanionIds(state);

  if (unowned.length <= 0) {
    return null;
  }

  const index = Math.max(0, Math.min(unowned.length - 1, Math.floor(rng() * unowned.length)));
  return getCompanionById(unowned[index]);
}

export function getCompanionUpgradeCost(companionId, level = 1, upgradeType = 'effect') {
  const companion = getCompanionById(companionId);

  if (!companion || level >= companion.maxLevel) {
    return null;
  }

  const rarityMultiplier = companion.rarity === 'epic' ? 1.45 : companion.rarity === 'rare' ? 1.2 : 1;
  const typeMultiplier = COMPANION_UPGRADE_TYPES[upgradeType]?.costMultiplier ?? 1;
  return Math.round((46 + level * 34) * rarityMultiplier * typeMultiplier);
}

export function getCompanionUpgradeLevelsFromState(state = {}, companionId) {
  const companion = getCompanionById(companionId);
  if (!companion) {
    return normalizeCompanionUpgradeLevels();
  }
  return normalizeCompanionUpgradeLevels(state.upgradeLevels?.[companionId], state.levels?.[companionId] ?? 1, companion.maxLevel);
}

export function getCompanionScaledBehavior(companionId, level = 1) {
  const companion = getCompanionById(companionId);

  if (!companion) {
    return null;
  }

  const levels = typeof level === 'object' && level !== null
    ? normalizeCompanionUpgradeLevels(level, 1, companion.maxLevel)
    : normalizeCompanionUpgradeLevels(null, level, companion.maxLevel);
  const effectRank = (levels.effect ?? 1) - 1;
  const rangeRank = (levels.range ?? 1) - 1;
  const speedRank = (levels.speed ?? 1) - 1;
  const behavior = companion.behavior ?? {};
  const targetsAtLevel = behavior.targetsAtLevel ?? {};
  const targetLevel = Math.max(levels.effect ?? 1, levels.range ?? 1);
  const levelTargetBonus = Object.entries(targetsAtLevel).reduce((result, [requiredLevel, value]) => (
    targetLevel >= Number(requiredLevel) ? Math.max(result, Number(value)) : result
  ), behavior.targets ?? 1);

  return {
    ...behavior,
    upgradeLevels: levels,
    damage: Math.round((behavior.damage ?? 0) + (behavior.damageGrowth ?? 0) * effectRank),
    heal: Math.round((behavior.heal ?? 0) + (behavior.healGrowth ?? 0) * effectRank),
    interval: Math.max(0.85, (behavior.interval ?? 2.4) - (behavior.intervalGrowth ?? 0) * speedRank),
    range: Math.round((behavior.range ?? behavior.pickupRadius ?? 180) + (behavior.rangeGrowth ?? behavior.radiusGrowth ?? 0) * rangeRank),
    pickupRadius: Math.round((behavior.pickupRadius ?? behavior.range ?? 130) + (behavior.radiusGrowth ?? behavior.rangeGrowth ?? 0) * rangeRank),
    pullMultiplier: Number(((behavior.pullMultiplier ?? 1) + (behavior.pullGrowth ?? 0) * effectRank).toFixed(2)),
    guardDuration: Number(((behavior.guardDuration ?? 0) + (behavior.durationGrowth ?? 0) * effectRank).toFixed(2)),
    expMultiplier: Number(((behavior.expMultiplier ?? 1) + (behavior.expGrowth ?? 0) * effectRank).toFixed(3)),
    bossBonus: Number(((behavior.bossBonus ?? 1) + (behavior.bossBonusGrowth ?? 0) * effectRank).toFixed(2)),
    targets: Math.max(1, Math.floor(levelTargetBonus)),
  };
}

export function getCompanionEffectSummary(companionId, level = 1) {
  const companion = getCompanionById(companionId);
  const levels = typeof level === 'object' && level !== null
    ? normalizeCompanionUpgradeLevels(level, 1, companion?.maxLevel ?? 5)
    : normalizeCompanionUpgradeLevels(null, level, companion?.maxLevel ?? 5);
  const displayLevel = getCompanionTotalLevel(levels, 1);
  const scaled = getCompanionScaledBehavior(companionId, levels);

  if (!companion || !scaled) {
    return '効果未設定';
  }

  if (companion.type === 'attack') {
    return `近接 ${scaled.damage} / ${scaled.interval.toFixed(1)}秒`;
  }

  if (companion.type === 'area') {
    return `範囲 ${scaled.damage} x${scaled.targets}`;
  }

  if (companion.type === 'ranged') {
    return `遠距離 ${scaled.damage} / 射程${scaled.range}`;
  }

  if (companion.type === 'heal') {
    return `HP +${scaled.heal} / ${scaled.interval.toFixed(1)}秒`;
  }

  if (companion.type === 'pickup') {
    return `回収半径 ${scaled.pickupRadius} / 吸引x${scaled.pullMultiplier}`;
  }

  if (companion.type === 'defense') {
    return `バリア ${scaled.guardDuration.toFixed(2)}秒`;
  }

  if (companion.type === 'boss') {
    return `ボス ${scaled.damage} x${scaled.bossBonus}`;
  }

  if (companion.type === 'swarm') {
    return `弱敵 ${scaled.damage} x${scaled.targets}`;
  }

  if (companion.type === 'synergy') {
    return `周囲 ${scaled.damage} x${scaled.targets}`;
  }

  if (companion.type === 'exp') {
    const expBonus = Number(((scaled.expMultiplier - 1) * 100).toFixed(1));
    return `EXP +${expBonus}% / 回収半径${scaled.pickupRadius}`;
  }

  return `${COMPANION_TYPES[companion.type]?.label ?? '補助'} Lv${displayLevel}`;
}
