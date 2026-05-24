export const BALANCE_OVERVIEW = {
  player: {
    baseDinoRoles: [
      { id: 'velociraptor', role: 'speed', note: '移動と攻撃テンポ寄り' },
      { id: 'triceratops', role: 'defense', note: 'HPと被ダメージ軽減寄り' },
      { id: 'tyrannosaurus', role: 'attack', note: '攻撃力と範囲寄り' },
    ],
    camera: {
      worldZoom: 0.88,
      focusY: 456,
      goal: 'スマホ縦で左右の反応時間を確保する',
    },
  },
  progression: {
    skillSlots: 3,
    skillMaxStep: 5,
    evolutionCandidateLevel: 5,
    adaptationDetectionThreshold: 3,
    note: 'プレイ中成長は1プレイ限定。永続成長はDNA研究中心。',
  },
  enemies: {
    types: [
      { id: 'swarm', role: '群れ雑魚', preferredCounter: 'hunting' },
      { id: 'fast', role: '追跡圧', preferredCounter: 'speed' },
      { id: 'tank', role: '高耐久', preferredCounter: 'attack' },
    ],
    bossFirstSpawn: 60,
    bossInterval: 90,
  },
  rewards: {
    ultimateGain: {
      swarm: 6,
      fast: 10,
      tank: 16,
    },
    dnaConversion: 'EXP * 0.8 + 撃破 * 0.25 + ボス * 18 をベースに研究倍率',
  },
};

export function getBalanceSummary() {
  return {
    dinoRoles: BALANCE_OVERVIEW.player.baseDinoRoles.map((entry) => `${entry.id}:${entry.role}`),
    enemyRoles: BALANCE_OVERVIEW.enemies.types.map((entry) => `${entry.id}:${entry.role}`),
    progression: BALANCE_OVERVIEW.progression,
  };
}
