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
    publicPlayerDinoName: 'アンキロサウルス',
    enabled: true,
    synergyId: 'ankylo_regen_armor',
    name: '再生装甲',
    shortLabel: '回復効果上昇',
    effectType: 'healing',
    value: 0.1,
    uiText: 'アンキロサウルスと組むと、回復支援が強化',
  }),
  para_juvenile: Object.freeze({
    companionId: 'para_juvenile',
    playerDinoId: 'parasaurolophus',
    playerDinoName: 'パラサウロロフス',
    publicPlayerDinoName: 'パラサウロロフス',
    enabled: true,
    synergyId: 'para_echo_scavenger',
    name: '共鳴探索',
    shortLabel: '回収範囲上昇',
    effectType: 'pickupRange',
    value: 0.1,
    uiText: 'パラサウロロフスと組むと、回収補助範囲が広がる',
  }),
  stego_calf: Object.freeze({
    companionId: 'stego_calf',
    playerDinoId: 'stegosaurus',
    playerDinoName: 'ステゴサウルス',
    publicPlayerDinoName: 'ステゴサウルス',
    enabled: true,
    synergyId: 'stego_plate_shock',
    name: '背板衝波',
    shortLabel: '範囲支援強化',
    effectType: 'areaDamage',
    value: 0.1,
    uiText: 'ステゴサウルスと組むと、範囲支援ダメージが強化',
  }),
  ptera_chick: Object.freeze({
    companionId: 'ptera_chick',
    playerDinoId: 'pteranodon',
    playerDinoName: 'プテラノドン',
    publicPlayerDinoName: 'プテラノドン',
    enabled: true,
    synergyId: 'pteranodon_wing_cover',
    name: '翼影支援',
    shortLabel: '遠距離支援強化',
    effectType: 'rangedSupport',
    value: 0.1,
    uiText: 'プテラノドンと組むと、空中支援ダメージが強化',
  }),
  compy_pack: Object.freeze({
    companionId: 'compy_pack',
    playerDinoId: 'compsognathus',
    playerDinoName: 'コンプソグナトゥス',
    publicPlayerDinoName: 'コンプソグナトゥス',
    enabled: true,
    synergyId: 'compy_pack_hunt',
    name: '群れの狩り',
    shortLabel: '雑魚処理強化',
    effectType: 'lowHpPursuit',
    value: 0.12,
    uiText: 'コンプソグナトゥスと組むと、弱った敵への追撃が強化',
  }),
  exp_chaser: Object.freeze({
    companionId: 'exp_chaser',
    playerDinoId: 'ornithomimus',
    playerDinoName: 'オルニトミムス',
    publicPlayerDinoName: 'オルニトミムス',
    enabled: true,
    synergyId: 'ornithomimus_exp_runner',
    name: '走査成長',
    shortLabel: 'EXP補助強化',
    effectType: 'expGain',
    value: 0.06,
    uiText: 'オルニトミムスと組むと、EXP補助が強化',
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
