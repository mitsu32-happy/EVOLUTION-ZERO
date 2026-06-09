export const ADAPTATION_SYNERGY_TAGS = ['speed', 'hunting', 'attack'];

export const ADAPTATION_SYNERGY_LABELS = {
  speed: '高速',
  hunting: '狩猟',
  attack: '攻撃',
};

export const ADAPTATION_SYNERGY_TIERS = {
  speed: {
    1: {
      cooldownMultiplier: 0.9,
      moveSpeedMultiplier: 1,
      summary: '攻撃速度 +10%',
    },
    2: {
      cooldownMultiplier: 0.75,
      moveSpeedMultiplier: 1.1,
      summary: '攻撃速度 +25% / 移動速度 +10%',
    },
  },
  hunting: {
    1: {
      critRate: 0.1,
      critDamageMultiplier: 1.5,
      summary: 'クリティカル率 +10%',
    },
    2: {
      critRate: 0.2,
      critDamageMultiplier: 1.8,
      summary: 'クリティカル率 +20% / クリティカルダメージ +30%',
    },
  },
  attack: {
    1: {
      rangeMultiplier: 1.1,
      damageMultiplier: 1,
      summary: '範囲 +10%',
    },
    2: {
      rangeMultiplier: 1.2,
      damageMultiplier: 1.15,
      summary: '範囲 +20% / ダメージ +15%',
    },
  },
};

export function getAdaptationSynergyTier(count = 0) {
  if (count >= 3) {
    return 2;
  }

  if (count >= 2) {
    return 1;
  }

  return 0;
}

export function getAdaptationSynergyLabel(tag) {
  return ADAPTATION_SYNERGY_LABELS[tag] ?? tag;
}

export function getAdaptationSynergyTierLabel(tier) {
  return tier >= 2 ? 'Ⅱ' : 'Ⅰ';
}

export function getAdaptationSynergyNoticeText(tag, tier) {
  return `${getAdaptationSynergyLabel(tag)}適応シナジー${getAdaptationSynergyTierLabel(tier)} 発動！`;
}

export function getAdaptationSynergyHudText(synergy = {}) {
  return ADAPTATION_SYNERGY_TAGS
    .map((tag) => {
      const tier = synergy[tag] ?? 0;
      return tier > 0 ? `${getAdaptationSynergyLabel(tag)}${getAdaptationSynergyTierLabel(tier)}` : null;
    })
    .filter(Boolean)
    .join('  ');
}

export function getAdaptationSynergyCardProgress(tag, count = 0) {
  const label = getAdaptationSynergyLabel(tag);

  if (count >= 3) {
    return {
      typeText: `${label}タイプ 3/3`,
      hintText: `${label}シナジーⅡ 発動中`,
    };
  }

  if (count >= 2) {
    return {
      typeText: `${label}タイプ 2/3`,
      hintText: `あと1つで${label}シナジーⅡ`,
    };
  }

  return {
    typeText: `${label}タイプ ${count}/2`,
    hintText: `あと${2 - count}つで${label}シナジーⅠ`,
  };
}

export function getAdaptationSynergyEffects(synergy = {}) {
  const speedTier = synergy.speed ?? 0;
  const huntingTier = synergy.hunting ?? 0;
  const attackTier = synergy.attack ?? 0;

  return {
    cooldownMultiplier: ADAPTATION_SYNERGY_TIERS.speed[speedTier]?.cooldownMultiplier ?? 1,
    moveSpeedMultiplier: ADAPTATION_SYNERGY_TIERS.speed[speedTier]?.moveSpeedMultiplier ?? 1,
    critRate: ADAPTATION_SYNERGY_TIERS.hunting[huntingTier]?.critRate ?? 0,
    critDamageMultiplier: ADAPTATION_SYNERGY_TIERS.hunting[huntingTier]?.critDamageMultiplier ?? 1,
    rangeMultiplier: ADAPTATION_SYNERGY_TIERS.attack[attackTier]?.rangeMultiplier ?? 1,
    damageMultiplier: ADAPTATION_SYNERGY_TIERS.attack[attackTier]?.damageMultiplier ?? 1,
  };
}
