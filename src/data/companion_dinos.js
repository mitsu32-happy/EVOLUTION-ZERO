import { ASSET_KEYS } from './asset_manifest.js';

export const COMPANION_HATCH_CONFIG = {
  dnaCost: 90,
  researchPtCost: 12,
  durationMs: 3 * 60 * 60 * 1000,
  debugDurationMs: 3000,
};

export const COMPANION_TUTORIAL_FLAGS = {
  eggPickup: 'companionEggPickup',
  eggResearch: 'companionEggResearch',
  obtained: 'companionObtained',
  set: 'companionSet',
};

export const COMPANION_TYPES = {
  attack: { label: '攻撃型', accent: 0xff776b },
  area: { label: '範囲攻撃型', accent: 0xffb04d },
  heal: { label: '回復型', accent: 0x65e878 },
  pickup: { label: '回収型', accent: 0x35d7ff },
  defense: { label: '防御補助型', accent: 0x9ec8ff },
  speed: { label: '速度補助型', accent: 0x7cf7d4 },
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
    displayName: 'ラプトル幼体',
    species: 'ヴェロキラプトル幼体',
    type: 'attack',
    description: '近い敵へ小さな爪撃を放つ、扱いやすいお供です。',
    skill: 'クイッククロー',
    rarity: 'common',
    level: 1,
    maxLevel: 5,
    behavior: { damage: 9, interval: 2.25, range: 205, targets: 1 },
  }),
  withAssets('spino_pup', {
    id: 'spino_pup',
    displayName: 'スピノ幼体',
    species: 'スピノサウルス幼体',
    type: 'area',
    description: '水刃で周囲の敵をまとめて牽制します。',
    skill: 'ミニスプラッシュ',
    rarity: 'rare',
    level: 1,
    maxLevel: 5,
    behavior: { damage: 6, interval: 3.1, range: 170, targets: 4 },
  }),
  withAssets('medic_saur', {
    id: 'medic_saur',
    displayName: 'メディサウルス',
    species: '小型草食竜',
    type: 'heal',
    description: '一定間隔で少量のHPを回復します。',
    skill: 'リカバリーパルス',
    rarity: 'rare',
    level: 1,
    maxLevel: 5,
    behavior: { heal: 3, interval: 9.5 },
  }),
  withAssets('ptera_chick', {
    id: 'ptera_chick',
    displayName: 'プテラ幼鳥',
    species: 'プテラノドン幼鳥',
    type: 'pickup',
    description: '近くのEXPやアイテムを少し引き寄せます。',
    skill: 'スカウトピック',
    rarity: 'common',
    level: 1,
    maxLevel: 5,
    behavior: { pickupRadius: 135, pull: 0.038 },
  }),
  withAssets('tricera_calf', {
    id: 'tricera_calf',
    displayName: 'トリケラ仔竜',
    species: 'トリケラトプス仔竜',
    type: 'defense',
    description: '短い防御補助で被弾リスクを少し抑えます。',
    skill: 'ガードホーン',
    rarity: 'common',
    level: 1,
    maxLevel: 5,
    behavior: { interval: 12, guardDuration: 0.45 },
  }),
  withAssets('para_juvenile', {
    id: 'para_juvenile',
    displayName: 'パラサウロ幼体',
    species: 'パラサウロロフス幼体',
    type: 'speed',
    description: '移動の立ち回りを軽く支援します。',
    skill: 'ランニングコール',
    rarity: 'common',
    level: 1,
    maxLevel: 5,
    behavior: { speedMultiplier: 1.025 },
  }),
  withAssets('stego_calf', {
    id: 'stego_calf',
    displayName: 'ステゴ仔竜',
    species: 'ステゴサウルス仔竜',
    type: 'synergy',
    description: '適応の組み合わせを少し支援します。',
    skill: 'シナジープレート',
    rarity: 'rare',
    level: 1,
    maxLevel: 5,
    behavior: { damage: 5, interval: 4.8, range: 190, targets: 2 },
  }),
  withAssets('rex_hatchling', {
    id: 'rex_hatchling',
    displayName: 'レックス幼体',
    species: 'ティラノサウルス幼体',
    type: 'boss',
    description: '強敵に向けて重い一撃を狙います。',
    skill: 'ボスバイト',
    rarity: 'epic',
    level: 1,
    maxLevel: 5,
    behavior: { damage: 12, interval: 3.2, range: 260, bossBonus: 1.65, targets: 1 },
  }),
  withAssets('compy_pack', {
    id: 'compy_pack',
    displayName: 'コンピー隊',
    species: 'コンプソグナトゥス',
    type: 'swarm',
    description: '低HPの雑魚を狙って細かく削ります。',
    skill: 'パックラッシュ',
    rarity: 'common',
    level: 1,
    maxLevel: 5,
    behavior: { damage: 5, interval: 1.6, range: 215, targets: 2 },
  }),
  withAssets('exp_chaser', {
    id: 'exp_chaser',
    displayName: 'エクスピー',
    species: '小型解析竜',
    type: 'exp',
    description: 'EXP取得を少し支援します。',
    skill: 'グロウセンサー',
    rarity: 'rare',
    level: 1,
    maxLevel: 5,
    behavior: { expMultiplier: 1.04 },
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
    eggPending: false,
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
    result[id] = Math.max(1, Math.min(companion?.maxLevel ?? 5, Math.floor(Number.isFinite(valueLevel) ? valueLevel : 1)));
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
    eggPending: Boolean(source.eggPending),
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

export function getCompanionUpgradeCost(companionId, level = 1) {
  const companion = getCompanionById(companionId);

  if (!companion || level >= companion.maxLevel) {
    return null;
  }

  const rarityMultiplier = companion.rarity === 'epic' ? 1.45 : companion.rarity === 'rare' ? 1.2 : 1;
  return Math.round((46 + level * 34) * rarityMultiplier);
}

export function getCompanionEffectSummary(companionId, level = 1) {
  const companion = getCompanionById(companionId);
  const safeLevel = Math.max(1, Math.floor(level));

  if (!companion) {
    return '効果未設定';
  }

  if (companion.type === 'attack') {
    return `爪撃 ${companion.behavior.damage + safeLevel * 3} / ${Math.max(1.2, companion.behavior.interval - safeLevel * 0.18).toFixed(1)}秒`;
  }

  if (companion.type === 'area') {
    return `範囲攻撃 ${companion.behavior.damage + safeLevel * 2}`;
  }

  if (companion.type === 'heal') {
    return `回復 +${companion.behavior.heal + safeLevel}`;
  }

  if (companion.type === 'pickup') {
    return `回収補助 +${8 + safeLevel * 3}%`;
  }

  if (companion.type === 'speed') {
    return `移動補助 +${Math.round((companion.behavior.speedMultiplier - 1 + safeLevel * 0.004) * 100)}%`;
  }

  if (companion.type === 'exp') {
    return `EXP補助 +${Math.round((companion.behavior.expMultiplier - 1 + safeLevel * 0.006) * 100)}%`;
  }

  return `${COMPANION_TYPES[companion.type]?.label ?? '補助'} Lv${safeLevel}`;
}
