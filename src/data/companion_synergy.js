export const COMPANION_SYNERGIES = Object.freeze({
  rex_hatchling: Object.freeze({
    companionId: 'rex_hatchling',
    playerDinoId: 'tyrannosaurus',
    playerDinoName: 'ティラノサウルス',
    publicPlayerDinoName: 'ティラノサウルス',
    enabled: true,
    synergyId: 'tyranno_rex_boss_hunter',
    name: '王牙共鳴',
    shortLabel: 'ボス特化',
    effectType: 'bossDamage',
    value: 0.12,
    uiText: 'ティラノサウルスと組むと、ボスへのダメージが少し上昇',
  }),
  raptorling: Object.freeze({
    companionId: 'raptorling',
    playerDinoId: 'velociraptor',
    playerDinoName: 'ヴェロキラプトル',
    publicPlayerDinoName: 'ヴェロキラプトル',
    enabled: true,
    synergyId: 'raptor_double_claw',
    name: '連爪追撃',
    shortLabel: '連撃',
    effectType: 'critRate',
    value: 0.06,
    uiText: 'ヴェロキラプトルと組むと、クリティカル率が少し上昇',
  }),
  spino_pup: Object.freeze({
    companionId: 'spino_pup',
    playerDinoId: 'spinosaurus',
    playerDinoName: 'スピノサウルス',
    publicPlayerDinoName: 'スピノサウルス',
    enabled: true,
    synergyId: 'spino_tide_support',
    name: '水流連携',
    shortLabel: '水弾支援',
    effectType: 'companionSkillDamage',
    value: 0.12,
    uiText: 'スピノサウルスと組むと、水弾支援が少し強化',
  }),
  tricera_calf: Object.freeze({
    companionId: 'tricera_calf',
    playerDinoId: 'triceratops',
    playerDinoName: 'トリケラトプス',
    publicPlayerDinoName: 'トリケラトプス',
    enabled: true,
    synergyId: 'tricera_guard_resonance',
    name: '装甲共鳴',
    shortLabel: '防御補助',
    effectType: 'damageTaken',
    value: -0.1,
    uiText: 'トリケラトプスと組むと、受けるダメージを少し軽減',
  }),
  medic_saur: Object.freeze({
    companionId: 'medic_saur',
    playerDinoId: 'ankylosaurus',
    playerDinoName: 'アンキロサウルス',
    publicPlayerDinoName: '未発見の恐竜',
    enabled: false,
    future: true,
    synergyId: 'ankylo_regen_armor',
    name: '再生装甲',
    shortLabel: '回復耐久',
    effectType: 'healing',
    value: 0.1,
    uiText: '未発見の恐竜と組むと、回復支援が強化予定',
  }),
  para_juvenile: Object.freeze({
    companionId: 'para_juvenile',
    playerDinoId: 'parasaurolophus',
    playerDinoName: 'パラサウロロフス',
    publicPlayerDinoName: '未発見の恐竜',
    enabled: false,
    future: true,
    synergyId: 'para_echo_scavenger',
    name: '共鳴探索',
    shortLabel: '回収補助',
    effectType: 'pickupRange',
    value: 0.1,
    uiText: '未発見の恐竜と組むと、回収補助が強化予定',
  }),
  stego_calf: Object.freeze({
    companionId: 'stego_calf',
    playerDinoId: 'stegosaurus',
    playerDinoName: 'ステゴサウルス',
    publicPlayerDinoName: '未発見の恐竜',
    enabled: false,
    future: true,
    synergyId: 'stego_plate_shock',
    name: '背板衝波',
    shortLabel: '範囲攻撃',
    effectType: 'areaDamage',
    value: 0.08,
    uiText: '未発見の恐竜と組むと、範囲攻撃が強化予定',
  }),
  ptera_chick: Object.freeze({
    companionId: 'ptera_chick',
    playerDinoId: 'pteranodon',
    playerDinoName: 'プテラノドン',
    publicPlayerDinoName: '未発見の恐竜',
    enabled: false,
    future: true,
    synergyId: 'pteranodon_wing_cover',
    name: '翼影支援',
    shortLabel: '空中支援',
    effectType: 'rangedSupport',
    value: 0.1,
    uiText: '未発見の恐竜と組むと、空中支援が強化予定',
  }),
  compy_pack: Object.freeze({
    companionId: 'compy_pack',
    playerDinoId: 'compsognathus',
    playerDinoName: 'コンプソグナトゥス',
    publicPlayerDinoName: '未発見の恐竜',
    enabled: false,
    future: true,
    synergyId: 'compy_pack_hunt',
    name: '群れの狩り',
    shortLabel: '雑魚処理',
    effectType: 'lowHpPursuit',
    value: 0.15,
    uiText: '未発見の恐竜と組むと、弱った敵への追撃が強化予定',
  }),
  exp_chaser: Object.freeze({
    companionId: 'exp_chaser',
    playerDinoId: 'ornithomimus',
    playerDinoName: 'オルニトミムス',
    publicPlayerDinoName: '未発見の恐竜',
    enabled: false,
    future: true,
    synergyId: 'ornithomimus_exp_runner',
    name: '走査成長',
    shortLabel: 'EXP補助',
    effectType: 'expGain',
    value: 0.06,
    uiText: '未発見の恐竜と組むと、EXP補助が強化予定',
  }),
});

export const COMPANION_SYNERGY_LIST = Object.freeze(Object.values(COMPANION_SYNERGIES));

export function getCompanionSynergyForCompanion(companionId) {
  if (!companionId || typeof companionId !== 'string') {
    return null;
  }

  return COMPANION_SYNERGIES[companionId] ?? null;
}

export function getCompanionSynergy({ dinoId, companionId, includeDisabled = true } = {}) {
  if (!dinoId || !companionId) {
    return null;
  }

  const synergy = getCompanionSynergyForCompanion(companionId);
  if (!synergy || synergy.playerDinoId !== dinoId) {
    return null;
  }

  if (!includeDisabled && !synergy.enabled) {
    return null;
  }

  return synergy;
}

export function isCompanionSynergyActive({ dinoId, companionId } = {}) {
  return Boolean(getCompanionSynergy({ dinoId, companionId, includeDisabled: false }));
}
