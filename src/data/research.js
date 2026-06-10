import { ADAPTATION_RESEARCH_IDS } from './adaptation_skills.js';

export const RESEARCH_CATEGORY_IDS = {
  bodyEnhancement: 'body_enhancement',
  adaptationAbility: 'adaptation_ability',
  specialMutation: 'special_mutation',
  unknownDomain: 'unknown_domain',
  analysisConversion: 'analysis_conversion',
};

export const RESEARCH_CATEGORIES = [
  {
    id: RESEARCH_CATEGORY_IDS.bodyEnhancement,
    name: '身体強化',
    shortName: '身体',
    iconName: 'bodyEnhancement',
    material: 'DNA',
    role: '研究施設側で基礎性能を安定化する恒久強化枠',
    unlockTarget: '最大HP、移動速度、攻撃頻度、回収範囲、DNA獲得補正',
  },
  {
    id: RESEARCH_CATEGORY_IDS.adaptationAbility,
    name: '適応能力',
    shortName: '適応',
    iconName: 'adaptationAbility',
    material: 'DNA + 研究Pt',
    role: 'スキル技を解析し、プレイ中の候補へ追加する枠',
    unlockTarget: '裂爪衝撃波、毒胞子散布、骨片スパイクなど',
  },
  {
    id: RESEARCH_CATEGORY_IDS.specialMutation,
    name: '特殊変異',
    shortName: '変異',
    iconName: 'specialMutation',
    material: 'DNA + 研究Pt',
    role: '適応タグの組み合わせから分岐進化の候補を増やす枠',
    unlockTarget: '未知進化の解析、特殊な進化ルート解放',
  },
  {
    id: RESEARCH_CATEGORY_IDS.unknownDomain,
    name: '未知領域',
    shortName: '未知',
    iconName: 'unknownDomain',
    material: '研究Pt',
    role: '新規恐竜、ステージ、進化環境を解析する拡張枠',
    unlockTarget: '未確認個体、未調査ステージ、新環境条件',
  },
  {
    id: RESEARCH_CATEGORY_IDS.analysisConversion,
    name: '解析変換',
    shortName: '変換',
    iconName: 'analysisConversion',
    material: 'DNA',
    role: '余剰DNAを高レートで研究Ptへ変換する補助枠',
    unlockTarget: 'DNA 500 -> 研究Pt 10 などの変換メニュー',
  },
];

export const ANALYSIS_CONVERSION_RATES = [
  { id: 'convert_500', dnaCost: 500, researchPtGain: 10 },
  { id: 'convert_1000', dnaCost: 1000, researchPtGain: 25 },
  { id: 'convert_3000', dnaCost: 3000, researchPtGain: 90 },
];

export const BODY_RESEARCH_IDS = {
  dnaGain: 'dna_gain_up',
  maxHp: 'initial_hp_up',
  moveSpeed: 'move_speed_up',
  pickupRange: 'pickup_range_up',
  attackFoundation: 'initial_attack_up',
  attackOutput: 'attack_output_up',
  attackInterval: 'attack_interval_up',
  damageGuard: 'damage_guard_up',
  expEfficiency: 'exp_efficiency_up',
};

export const ADAPTATION_ANALYSIS_RESEARCH_ID = 'adaptation_analysis';
export const ADAPTATION_THEORY_RESEARCH_ID = 'adaptation_theory';

export const RESEARCH_ITEMS = [
  {
    id: BODY_RESEARCH_IDS.dnaGain,
    category: RESEARCH_CATEGORY_IDS.bodyEnhancement,
    name: 'DNA回収効率',
    description: '獲得DNAが増えます。',
    effectLabel: 'DNA獲得 +15%',
    effectType: 'dnaMultiplier',
    effectPerLevel: 0.15,
    effectUnit: '%',
    material: 'DNA',
    iconName: 'dnaGain',
    status: 'available',
    maxLevel: 5,
    baseCost: 55,
    costStep: 115,
  },
  {
    id: BODY_RESEARCH_IDS.maxHp,
    category: RESEARCH_CATEGORY_IDS.bodyEnhancement,
    name: '初期耐久強化',
    description: '最大HPが増えます。',
    effectLabel: '初期HP +8',
    effectType: 'maxHp',
    effectPerLevel: 8,
    effectUnit: 'HP',
    material: 'DNA',
    iconName: 'initialDurability',
    status: 'available',
    maxLevel: 5,
    baseCost: 45,
    costStep: 95,
  },
  {
    id: BODY_RESEARCH_IDS.moveSpeed,
    category: RESEARCH_CATEGORY_IDS.bodyEnhancement,
    name: '移動安定化',
    description: '移動速度が上がります。',
    effectLabel: '移動速度 +8',
    effectType: 'moveSpeed',
    effectPerLevel: 8,
    effectUnit: '速度',
    material: 'DNA',
    iconName: 'attackFoundation',
    status: 'available',
    maxLevel: 5,
    baseCost: 50,
    costStep: 105,
  },
  {
    id: BODY_RESEARCH_IDS.pickupRange,
    category: RESEARCH_CATEGORY_IDS.bodyEnhancement,
    name: '回収範囲強化',
    description: 'アイテムを拾いやすくなります。',
    effectLabel: '回収範囲 +8%',
    effectType: 'pickupRange',
    effectPerLevel: 0.08,
    effectUnit: '%',
    material: 'DNA',
    iconName: 'bodyEnhancement',
    status: 'available',
    maxLevel: 5,
    baseCost: 50,
    costStep: 100,
  },
  {
    id: BODY_RESEARCH_IDS.attackOutput,
    category: RESEARCH_CATEGORY_IDS.bodyEnhancement,
    name: '攻撃出力強化',
    description: '攻撃力が上がります。',
    effectLabel: '攻撃出力 +4%',
    effectType: 'attackOutput',
    effectPerLevel: 0.04,
    effectUnit: '%',
    material: 'DNA',
    iconName: 'attackFoundation',
    status: 'available',
    maxLevel: 5,
    baseCost: 60,
    costStep: 120,
  },
  {
    id: BODY_RESEARCH_IDS.attackInterval,
    category: RESEARCH_CATEGORY_IDS.bodyEnhancement,
    name: '攻撃間隔短縮',
    description: '攻撃間隔が短くなります。',
    effectLabel: '通常技間隔 -3%',
    effectType: 'attackInterval',
    effectPerLevel: 0.03,
    effectUnit: '%',
    material: 'DNA',
    iconName: 'attackFoundation',
    status: 'available',
    maxLevel: 5,
    baseCost: 70,
    costStep: 135,
  },
  {
    id: BODY_RESEARCH_IDS.damageGuard,
    category: RESEARCH_CATEGORY_IDS.bodyEnhancement,
    name: '防御組織強化',
    description: '受けるダメージを減らします。',
    effectLabel: '被ダメージ -3%',
    effectType: 'damageGuard',
    effectPerLevel: 0.03,
    effectUnit: '%',
    material: 'DNA',
    iconName: 'initialDurability',
    status: 'available',
    maxLevel: 5,
    baseCost: 65,
    costStep: 130,
  },
  {
    id: BODY_RESEARCH_IDS.expEfficiency,
    category: RESEARCH_CATEGORY_IDS.bodyEnhancement,
    name: 'EXP解析効率',
    description: '経験値を得やすくなります。',
    effectLabel: 'EXP解析 +5%',
    effectType: 'expEfficiency',
    effectPerLevel: 0.05,
    effectUnit: '%',
    material: 'DNA',
    iconName: 'bodyEnhancement',
    status: 'available',
    maxLevel: 5,
    baseCost: 55,
    costStep: 110,
  },
  {
    id: ADAPTATION_ANALYSIS_RESEARCH_ID,
    category: RESEARCH_CATEGORY_IDS.bodyEnhancement,
    name: '適応解析',
    description: '適応技のダメージが上がります。',
    effectLabel: '適応技 +5%/段階',
    effectType: 'adaptationSkillDamage',
    effectPerLevel: 0.05,
    material: 'DNA',
    iconName: 'adaptationAbility',
    status: 'available',
    maxLevel: 5,
    baseCost: 90,
    costStep: 80,
  },
  {
    id: ADAPTATION_THEORY_RESEARCH_ID,
    category: RESEARCH_CATEGORY_IDS.bodyEnhancement,
    name: '適応強化理論',
    description: '能力強化カードの効果が上がります。',
    effectLabel: '能力強化 +10%/段階',
    effectType: 'statUpgradeTheory',
    effectPerLevel: 0.1,
    material: 'DNA',
    iconName: 'bodyEnhancement',
    status: 'available',
    maxLevel: 3,
    baseCost: 120,
    costStep: 120,
  },
  {
    id: 'slash_wave_unlock',
    category: RESEARCH_CATEGORY_IDS.adaptationAbility,
    name: '裂爪衝撃波',
    description: '新しい適応技を解放します。',
    effectLabel: 'スキル技解放',
    material: 'DNA + 研究Pt',
    iconName: 'slashWave',
    status: 'locked',
    unlockHint: '今後解放予定',
  },
  {
    id: 'poison_spore_unlock',
    category: RESEARCH_CATEGORY_IDS.adaptationAbility,
    name: '毒胞子散布',
    description: '新しい範囲技を解放します。',
    effectLabel: '候補へ出現',
    material: 'DNA + 研究Pt',
    iconName: 'poisonSpore',
    status: 'locked',
    unlockHint: '今後解放予定',
  },
  {
    id: 'bone_spike_unlock',
    category: RESEARCH_CATEGORY_IDS.adaptationAbility,
    name: '骨片スパイク',
    description: '新しい射出技を解放します。',
    effectLabel: '専用アイコン対象',
    material: 'DNA + 研究Pt',
    iconName: 'boneSpike',
    status: 'locked',
    unlockHint: '今後解放予定',
  },
  {
    id: ADAPTATION_RESEARCH_IDS.acceleratedBlades,
    category: RESEARCH_CATEGORY_IDS.adaptationAbility,
    name: '加速刃群 解放',
    description: '周囲を攻撃する適応技です。',
    effectLabel: '高速適応',
    adaptationTag: 'speed',
    adaptationTagLabel: '高速適応',
    material: 'DNA + 研究Pt',
    adaptationSkillId: 'accelerated_blades',
    iconName: 'skillAccelBlades',
    status: 'available',
    maxLevel: 1,
    baseCost: 110,
    costStep: 0,
    researchPtCost: 13,
    unlockHint: '研究後に候補へ追加',
  },
  {
    id: ADAPTATION_RESEARCH_IDS.predatorMarking,
    category: RESEARCH_CATEGORY_IDS.adaptationAbility,
    name: '捕食マーキング 解放',
    description: '近い敵に追加ダメージを与えます。',
    effectLabel: '狩猟適応',
    adaptationTag: 'hunting',
    adaptationTagLabel: '狩猟適応',
    material: 'DNA + 研究Pt',
    adaptationSkillId: 'predator_marking',
    iconName: 'skillPredatorMark',
    status: 'available',
    maxLevel: 1,
    baseCost: 145,
    costStep: 0,
    researchPtCost: 22,
    unlockHint: '研究後に候補へ追加',
  },
  {
    id: ADAPTATION_RESEARCH_IDS.flameBreath,
    category: RESEARCH_CATEGORY_IDS.adaptationAbility,
    name: '火炎吐息 解放',
    description: '前方をまとめて攻撃します。',
    effectLabel: '攻撃適応',
    adaptationTag: 'attack',
    adaptationTagLabel: '攻撃適応',
    material: 'DNA + 研究Pt',
    adaptationSkillId: 'flame_breath',
    iconName: 'skillFlameBreath',
    status: 'available',
    maxLevel: 1,
    baseCost: 180,
    costStep: 0,
    researchPtCost: 30,
    unlockHint: '研究後に候補へ追加',
  },
  {
    id: 'feral_branch_analysis',
    category: RESEARCH_CATEGORY_IDS.specialMutation,
    name: '野性分岐解析',
    description: '新しい進化候補を解放します。',
    effectLabel: '進化ルート解放',
    material: 'DNA + 研究Pt',
    iconName: 'evolutionBranch',
    status: 'locked',
    unlockHint: '今後解放予定',
  },
  {
    id: 'crystal_branch_analysis',
    category: RESEARCH_CATEGORY_IDS.specialMutation,
    name: '結晶変異解析',
    description: '特殊な進化候補を解放します。',
    effectLabel: '未知進化解析',
    material: 'DNA + 研究Pt',
    iconName: 'specialMutation',
    status: 'locked',
    unlockHint: '今後解放予定',
  },
  {
    id: 'predator_route_scan',
    category: RESEARCH_CATEGORY_IDS.specialMutation,
    name: '捕食特化ルート',
    description: '狩猟系の進化候補を解放します。',
    effectLabel: '分岐候補追加',
    material: 'DNA + 研究Pt',
    iconName: 'evolutionBranch',
    status: 'locked',
    unlockHint: '条件を満たすと表示',
  },
  {
    id: 'unknown_dino_scan',
    category: RESEARCH_CATEGORY_IDS.unknownDomain,
    name: '未確認恐竜解析',
    description: '新しい恐竜を解放します。',
    effectLabel: '恐竜解析',
    material: '研究Pt',
    iconName: 'unknownDinoScan',
    status: 'locked',
    unlockHint: '今後解放予定',
  },
  {
    id: 'spinosaurus_unlock',
    category: RESEARCH_CATEGORY_IDS.unknownDomain,
    name: 'スピノサウルス解析',
    description: 'スピノサウルスを解放します。',
    effectLabel: 'スピノサウルス解放',
    material: '研究Pt',
    iconName: 'unknownDinoScan',
    status: 'available',
    maxLevel: 1,
    baseCost: 0,
    costStep: 0,
    researchPtCost: 220,
    unlockDinoId: 'spinosaurus',
    unlockHint: '研究Pt 220で解放',
  },
  {
    id: 'deep_stage_scan',
    category: RESEARCH_CATEGORY_IDS.unknownDomain,
    name: '深層ステージ調査',
    description: '新しいステージを解放します。',
    effectLabel: 'ステージ解析',
    material: '研究Pt',
    iconName: 'stageScan',
    status: 'locked',
    unlockHint: '今後解放予定',
  },
  {
    id: 'zero_environment_scan',
    category: RESEARCH_CATEGORY_IDS.unknownDomain,
    name: 'ZERO環境予測',
    description: 'ZERO環境のヒントを表示します。',
    effectLabel: '環境反応予測',
    material: '研究Pt',
    iconName: 'unknownDomain',
    status: 'locked',
    unlockHint: 'ZEROはEXPERTクリアで解放',
  },
];

export const RESEARCH_LEVEL_DEFAULTS = Object.fromEntries(
  RESEARCH_ITEMS
    .filter((item) => item.status === 'available')
    .map((item) => [item.id, 0]),
);

RESEARCH_LEVEL_DEFAULTS[BODY_RESEARCH_IDS.attackFoundation] = 0;

export function getResearchItem(id) {
  return RESEARCH_ITEMS.find((item) => item.id === id) ?? null;
}

export function getResearchItemsByCategory(categoryId) {
  if (categoryId === RESEARCH_CATEGORY_IDS.adaptationAbility) {
    return RESEARCH_ITEMS.filter((item) => item.category === categoryId && (
      item.adaptationSkillId
      || item.effectType === 'adaptationSkillDamage'
      || item.effectType === 'statUpgradeTheory'
    ));
  }

  return RESEARCH_ITEMS.filter((item) => item.category === categoryId);
}

export function getResearchCost(item, level) {
  return getResearchCostDetail(item, level)?.dna ?? null;
}

export function getResearchCostDetail(item, level) {
  if (!item || item.status === 'locked' || level >= item.maxLevel) {
    return null;
  }

  return {
    dna: (item.baseCost ?? item.dnaCost ?? 0) + (item.costStep ?? 0) * level,
    researchPt: item.researchPtCost ?? 0,
  };
}

export function getResearchEffectValue(item, level) {
  if (!item?.effectPerLevel) {
    return 0;
  }

  return item.effectPerLevel * Math.max(0, level);
}

export function getResearchNextEffectLabel(item, level) {
  if (!item?.effectPerLevel) {
    return item?.effectLabel ?? '';
  }

  const nextLevel = Math.min((item.maxLevel ?? level + 1), level + 1);
  const nextValue = getResearchEffectValue(item, nextLevel);

  if (item.effectType === 'dnaMultiplier') {
    return `次: DNA +${Math.round(nextValue * 100)}%`;
  }

  if (item.effectType === 'maxHp') {
    return `次: HP +${nextValue}`;
  }

  if (item.effectType === 'moveSpeed') {
    return `次: 速度 +${nextValue}`;
  }

  if (item.effectType === 'pickupRange') {
    return `次: 範囲 +${Math.round(nextValue * 100)}%`;
  }

  if (item.effectType === 'attackOutput') {
    return `次: 攻撃出力 +${Math.round(nextValue * 100)}%`;
  }

  if (item.effectType === 'attackInterval') {
    return `次: 通常技間隔 -${Math.round(nextValue * 100)}%`;
  }

  if (item.effectType === 'damageGuard') {
    return `次: 被ダメージ -${Math.round(nextValue * 100)}%`;
  }

  if (item.effectType === 'expEfficiency') {
    return `次: EXP解析 +${Math.round(nextValue * 100)}%`;
  }

  if (item.effectType === 'adaptationSkillDamage') {
    return `次: 適応技 +${Math.round(nextValue * 100)}%`;
  }

  if (item.effectType === 'statUpgradeTheory') {
    return `次: 能力強化 +${Math.round(nextValue * 100)}%`;
  }

  return item.effectLabel;
}

export function getBodyResearchBonuses(researchLevels = {}) {
  const dnaGainLevel = researchLevels[BODY_RESEARCH_IDS.dnaGain] ?? 0;
  const hpLevel = researchLevels[BODY_RESEARCH_IDS.maxHp] ?? 0;
  const moveSpeedLevel = researchLevels[BODY_RESEARCH_IDS.moveSpeed] ?? 0;
  const pickupRangeLevel = researchLevels[BODY_RESEARCH_IDS.pickupRange] ?? 0;
  const legacyAttackLevel = researchLevels[BODY_RESEARCH_IDS.attackFoundation] ?? 0;
  const attackOutputLevel = researchLevels[BODY_RESEARCH_IDS.attackOutput] ?? 0;
  const attackIntervalLevel = researchLevels[BODY_RESEARCH_IDS.attackInterval] ?? 0;
  const damageGuardLevel = researchLevels[BODY_RESEARCH_IDS.damageGuard] ?? 0;
  const expEfficiencyLevel = researchLevels[BODY_RESEARCH_IDS.expEfficiency] ?? 0;

  return {
    maxHpBonus: hpLevel * 8,
    moveSpeedBonus: moveSpeedLevel * 8,
    pickupMagnetMultiplier: 1 + pickupRangeLevel * 0.08,
    dnaMultiplier: 1 + dnaGainLevel * 0.15,
    legacyAttackDamageBonus: legacyAttackLevel * 2,
    attackDamageMultiplier: 1 + attackOutputLevel * 0.04,
    attackIntervalMultiplier: Math.max(0.82, 1 - attackIntervalLevel * 0.03),
    damageTakenMultiplier: Math.max(0.82, 1 - damageGuardLevel * 0.03),
    expMultiplier: 1 + expEfficiencyLevel * 0.05,
  };
}

export function getAdaptationResearchBonuses(researchLevels = {}) {
  const adaptationAnalysisLevel = Math.max(0, Math.min(5, researchLevels[ADAPTATION_ANALYSIS_RESEARCH_ID] ?? 0));
  const statUpgradeTheoryLevel = Math.max(0, Math.min(3, researchLevels[ADAPTATION_THEORY_RESEARCH_ID] ?? 0));

  return {
    adaptationAnalysisLevel,
    statUpgradeTheoryLevel,
    adaptationSkillDamageMultiplier: 1 + adaptationAnalysisLevel * 0.05,
  };
}

function roundPercentBonus(value) {
  return Math.round(value * 100) / 100;
}

export function getStatUpgradeTheoryValue(skillId, level = 1, researchLevels = {}) {
  const theoryLevel = getAdaptationResearchBonuses(researchLevels).statUpgradeTheoryLevel;
  const theoryMultiplier = 1 + theoryLevel * 0.1;

  if (skillId === 'hard_skin') {
    const baseHpGain = 24 + level * 5;
    const hpGain = Math.round(baseHpGain * theoryMultiplier);
    return {
      theoryLevel,
      theoryMultiplier,
      baseHpGain,
      hpGain,
      label: `HP +${hpGain}`,
    };
  }

  if (skillId === 'attack_power_up' || skillId === 'predator_instinct') {
    const baseAttackGain = 5 + level * 2;
    const baseAdaptationDamageBonus = 0.1 + level * 0.025;
    const attackGain = Math.round(baseAttackGain * theoryMultiplier);
    const adaptationDamageBonus = roundPercentBonus(baseAdaptationDamageBonus * theoryMultiplier);
    return {
      theoryLevel,
      theoryMultiplier,
      baseAttackGain,
      attackGain,
      baseAdaptationDamageBonus,
      adaptationDamageBonus,
      label: `攻撃力 +${attackGain} / 適応技 +${Math.round(adaptationDamageBonus * 100)}%`,
    };
  }

  if (skillId === 'move_speed_up') {
    const baseMoveSpeedGain = 28 + level * 6;
    const moveSpeedGain = Math.round(baseMoveSpeedGain * theoryMultiplier);
    const extraMoveSpeedGain = moveSpeedGain - baseMoveSpeedGain;
    return {
      theoryLevel,
      theoryMultiplier,
      baseMoveSpeedGain,
      extraMoveSpeedGain,
      moveSpeedGain,
      label: `移動速度 +${moveSpeedGain}`,
    };
  }

  if (skillId === 'exp_sense') {
    const baseMagnetBonus = 0.15 + Math.max(0, level - 1) * 0.13;
    const basePullBonus = 0.1 + Math.max(0, level - 1) * 0.09;
    const magnetBonus = roundPercentBonus(baseMagnetBonus * theoryMultiplier);
    const pullBonus = roundPercentBonus(basePullBonus * theoryMultiplier);
    return {
      theoryLevel,
      theoryMultiplier,
      baseMagnetBonus,
      magnetBonus,
      basePullBonus,
      pullBonus,
      label: `回収範囲 +${Math.round(magnetBonus * 100)}%`,
    };
  }

  return {
    theoryLevel,
    theoryMultiplier,
    label: null,
  };
}
