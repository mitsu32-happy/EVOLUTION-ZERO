import { ADAPTATION_SKILLS, ADAPTATION_TAG_IDS } from './adaptation_skills.js';

export const SKILL_MAX_LEVEL = 5;

export const ADAPTATION_LABELS = {
  speed: '高速適応',
  hunting: '狩猟適応',
  attack: '攻撃適応',
};

export const EVOLUTION_DETECTION_THRESHOLD = 3;

export const EVOLUTION_CANDIDATES = {
  speed: {
    tag: 'speed',
    name: '高速変異反応',
    evolutionName: 'ファルクス',
    message: '高速変異反応を検出',
    readyText: '高速適応が臨界まで活性化している...',
    color: 0x35d7ff,
  },
  hunting: {
    tag: 'hunting',
    name: '狩猟本能変異',
    evolutionName: 'ノクスヴェナ',
    message: '狩猟本能変異を検出',
    readyText: '狩猟本能が変異を始めている...',
    color: 0xffd36b,
  },
  attack: {
    tag: 'attack',
    name: '攻撃適応変異',
    evolutionName: 'ヴォルグラム',
    message: '攻撃適応変異を検出',
    readyText: '攻撃DNAが異常反応を示している...',
    color: 0xff4d38,
  },
};

export const TAGLESS_UPGRADE_SKILLS = [
  {
    id: 'attack_power_up',
    name: '攻撃出力強化',
    maxLevel: SKILL_MAX_LEVEL,
    adaptationTags: [],
    tag: null,
    type: '基礎強化',
    color: 0x9aa5a8,
    description: '通常技と適応技の基礎ダメージを高める。',
    levelUpText: '攻撃力が上昇',
    usesSkillSlot: false,
    countsAsAdaptation: false,
    iconKey: 'adaptationIcons.none',
  },
  {
    id: 'move_speed_up',
    name: '移動安定化',
    maxLevel: SKILL_MAX_LEVEL,
    adaptationTags: [],
    tag: null,
    type: '基礎強化',
    color: 0x9aa5a8,
    description: '移動速度を少し高める。',
    levelUpText: '移動性能が上昇',
    usesSkillSlot: false,
    countsAsAdaptation: false,
    iconKey: 'adaptationIcons.none',
  },
  {
    id: 'hard_skin',
    name: '初期耐久強化',
    maxLevel: SKILL_MAX_LEVEL,
    adaptationTags: [],
    tag: null,
    type: '基礎強化',
    color: 0x9aa5a8,
    description: '最大HPを増やし、生存性を高める。',
    levelUpText: '最大HPが上昇',
    usesSkillSlot: false,
    countsAsAdaptation: false,
    iconKey: 'adaptationIcons.none',
  },
  {
    id: 'exp_sense',
    name: '回収感度強化',
    maxLevel: SKILL_MAX_LEVEL,
    adaptationTags: [],
    tag: null,
    type: '基礎強化',
    color: 0x9aa5a8,
    description: 'EXP結晶の吸引範囲を広げる。',
    levelUpText: '回収範囲が上昇',
    usesSkillSlot: false,
    countsAsAdaptation: false,
    iconKey: 'adaptationIcons.none',
  },
];

export const SKILLS = [
  ...TAGLESS_UPGRADE_SKILLS,
  ...ADAPTATION_SKILLS.map((skill) => ({
    ...skill,
    maxLevel: skill.maxLevel ?? SKILL_MAX_LEVEL,
    adaptationTags: skill.tag ? [skill.tag] : [],
    color: skill.tag === ADAPTATION_TAG_IDS.hunting
      ? 0xffd36b
      : skill.tag === ADAPTATION_TAG_IDS.attack
        ? 0xff4d38
        : 0x35d7ff,
    usesSkillSlot: true,
    countsAsAdaptation: true,
  })),
];

export function getSkillById(id) {
  return SKILLS.find((skill) => skill.id === id);
}

export function getAdaptationLabel(tag) {
  return ADAPTATION_LABELS[tag] ?? tag;
}

export function getEvolutionCandidate(tag) {
  return EVOLUTION_CANDIDATES[tag] ?? null;
}

export function getEvolutionHint(adaptationProgress) {
  const speed = adaptationProgress.speed ?? 0;
  const hunting = adaptationProgress.hunting ?? 0;
  const attack = adaptationProgress.attack ?? 0;

  if (speed >= 4) {
    return '高速適応が活性化している...';
  }

  if (hunting >= 3) {
    return '狩猟本能が変異を始めている...';
  }

  if (attack >= 3) {
    return '攻撃適応が牙と咆哮に集中している...';
  }

  if (speed + hunting + attack >= 3) {
    return 'DNAが新しい方向を探っている...';
  }

  return 'DNA適応はまだ安定している';
}
