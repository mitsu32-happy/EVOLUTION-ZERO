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

const GENERIC_ICON = ASSET_KEYS.companions?.raptorlingIcon ?? 'companions.raptorlingIcon';
const GENERIC_SPRITE = ASSET_KEYS.companions?.raptorlingSprite ?? 'companions.raptorlingSprite';
const GENERIC_EFFECT = ASSET_KEYS.companions?.hatchEffect ?? 'companions.hatchEffect';

export const COMPANION_DINOS = [
  {
    id: 'raptorling',
    displayName: 'ラプトル幼体',
    species: 'ヴェロキラプトル幼体',
    type: 'attack',
    description: '近い敵へ小さな爪撃を放つお供恐竜です。',
    skill: 'クイッククロー',
    rarity: 'common',
    level: 1,
    maxLevel: 5,
    assetKey: GENERIC_SPRITE,
    iconAssetKey: GENERIC_ICON,
    effectAssetKey: GENERIC_EFFECT,
  },
  {
    id: 'spino_pup',
    displayName: 'スピノ幼体',
    species: 'スピノサウルス幼体',
    type: 'area',
    description: '水刃で周囲の敵をまとめて牽制します。',
    skill: 'ミニスプラッシュ',
    rarity: 'rare',
    level: 1,
    maxLevel: 5,
    assetKey: GENERIC_SPRITE,
    iconAssetKey: GENERIC_ICON,
    effectAssetKey: GENERIC_EFFECT,
  },
  {
    id: 'medic_saur',
    displayName: 'メディサウルス',
    species: '小型草食竜',
    type: 'heal',
    description: '一定間隔で小さな回復補助を行います。',
    skill: 'リカバリーパルス',
    rarity: 'rare',
    level: 1,
    maxLevel: 5,
    assetKey: GENERIC_SPRITE,
    iconAssetKey: GENERIC_ICON,
    effectAssetKey: GENERIC_EFFECT,
  },
  {
    id: 'ptera_chick',
    displayName: 'プテラ幼鳥',
    species: 'プテラノドン幼鳥',
    type: 'pickup',
    description: 'アイテム回収を少し助けます。',
    skill: 'スカウトピック',
    rarity: 'common',
    level: 1,
    maxLevel: 5,
    assetKey: GENERIC_SPRITE,
    iconAssetKey: GENERIC_ICON,
    effectAssetKey: GENERIC_EFFECT,
  },
  {
    id: 'tricera_calf',
    displayName: 'トリケラ仔竜',
    species: 'トリケラトプス仔竜',
    type: 'defense',
    description: '防御姿勢で被弾リスクを少し抑えます。',
    skill: 'ガードホーン',
    rarity: 'common',
    level: 1,
    maxLevel: 5,
    assetKey: GENERIC_SPRITE,
    iconAssetKey: GENERIC_ICON,
    effectAssetKey: GENERIC_EFFECT,
  },
  {
    id: 'para_juvenile',
    displayName: 'パラサウロ幼体',
    species: 'パラサウロロフス幼体',
    type: 'speed',
    description: '移動補助で立ち回りを軽くします。',
    skill: 'ランニングコール',
    rarity: 'common',
    level: 1,
    maxLevel: 5,
    assetKey: GENERIC_SPRITE,
    iconAssetKey: GENERIC_ICON,
    effectAssetKey: GENERIC_EFFECT,
  },
  {
    id: 'stego_calf',
    displayName: 'ステゴ仔竜',
    species: 'ステゴサウルス仔竜',
    type: 'synergy',
    description: '適応の組み合わせを少し支援します。',
    skill: 'シナジープレート',
    rarity: 'rare',
    level: 1,
    maxLevel: 5,
    assetKey: GENERIC_SPRITE,
    iconAssetKey: GENERIC_ICON,
    effectAssetKey: GENERIC_EFFECT,
  },
  {
    id: 'rex_hatchling',
    displayName: 'レックス幼体',
    species: 'ティラノサウルス幼体',
    type: 'boss',
    description: '強敵への攻撃を少し得意とします。',
    skill: 'ボスバイト',
    rarity: 'epic',
    level: 1,
    maxLevel: 5,
    assetKey: GENERIC_SPRITE,
    iconAssetKey: GENERIC_ICON,
    effectAssetKey: GENERIC_EFFECT,
  },
  {
    id: 'compy_pack',
    displayName: 'コンピー隊',
    species: 'コンプソグナトゥス',
    type: 'swarm',
    description: '雑魚敵を細かく削る群れのお供です。',
    skill: 'パックラッシュ',
    rarity: 'common',
    level: 1,
    maxLevel: 5,
    assetKey: GENERIC_SPRITE,
    iconAssetKey: GENERIC_ICON,
    effectAssetKey: GENERIC_EFFECT,
  },
  {
    id: 'exp_chaser',
    displayName: 'エクスピィ',
    species: '小型解析竜',
    type: 'exp',
    description: 'EXP回収と成長を少し支援します。',
    skill: 'グロウセンサー',
    rarity: 'rare',
    level: 1,
    maxLevel: 5,
    assetKey: GENERIC_SPRITE,
    iconAssetKey: GENERIC_ICON,
    effectAssetKey: GENERIC_EFFECT,
  },
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
    return `爪撃 ${8 + safeLevel * 3} / ${Math.max(1.2, 2.4 - safeLevel * 0.18).toFixed(1)}秒`;
  }

  if (companion.type === 'heal') {
    return `回復補助 +${2 + safeLevel}`;
  }

  if (companion.type === 'pickup') {
    return `回収補助 +${6 + safeLevel * 3}%`;
  }

  return `${COMPANION_TYPES[companion.type]?.label ?? '補助'} Lv${safeLevel}`;
}
