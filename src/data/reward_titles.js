export const TITLE_FRAME_DEFINITIONS = {
  normal_clear_frame: {
    id: 'normal_clear_frame',
    name: '解析フレーム',
    rarity: 'normal',
    color: 0x35d7ff,
    description: 'NORMAL初回クリアで得られる標準称号フレーム。',
  },
  hard_clear_frame: {
    id: 'hard_clear_frame',
    name: '危険域フレーム',
    rarity: 'rare',
    color: 0xffc739,
    description: 'HARD初回クリアで得られる上位称号フレーム。',
  },
  expert_clear_frame: {
    id: 'expert_clear_frame',
    name: '異常域フレーム',
    rarity: 'epic',
    color: 0xff3848,
    description: 'EXPERT初回クリアで得られる高難度称号フレーム。',
  },
  zero_deluxe_frame: {
    id: 'zero_deluxe_frame',
    name: 'ZEROフレーム',
    rarity: 'zero',
    color: 0xfff0b4,
    description: 'ZERO初回クリア用の豪華称号フレーム。後続MVPで本格使用。',
  },
  jungle_zero_frame: {
    id: 'jungle_zero_frame',
    name: '密林ZEROフレーム',
    rarity: 'zero',
    color: 0xb94dff,
    description: 'jungle ZERO突破で得られる密林捕食者系のZERO称号フレーム。',
  },
  swamp_zero_frame: {
    id: 'swamp_zero_frame',
    name: '沼地ZEROフレーム',
    rarity: 'zero',
    color: 0xfff0b4,
    description: 'swamp ZERO突破で得られる終焉変異系のZERO称号フレーム。',
  },
  volcano_zero_frame: {
    id: 'volcano_zero_frame',
    name: '\u30a4\u30b0\u30cb\u30b9\u30d5\u30ec\u30fc\u30e0',
    rarity: 'zero',
    color: 0xff6f35,
    description: 'volcano ZERO\u3092\u7a81\u7834\u3057\u305f\u8a3c\u3068\u306a\u308b\u706b\u5c71ZERO\u79f0\u53f7\u30d5\u30ec\u30fc\u30e0\u3002',
  },
};

export const STAGE_CLEAR_TITLES = [
  {
    id: 'jungle_normal_clear',
    name: '密林踏破者',
    description: '密林地帯のNORMAL環境を初めて突破した証。',
    stageId: 'jungle',
    difficultyId: 'normal',
    rarity: 'normal',
    frameType: 'normal_clear_frame',
    unlockCondition: 'jungle normal first clear',
    displayOrder: 100,
  },
  {
    id: 'jungle_hard_clear',
    name: '捕食圏生還者',
    description: '密林地帯のHARD環境を生還した証。',
    stageId: 'jungle',
    difficultyId: 'hard',
    rarity: 'rare',
    frameType: 'hard_clear_frame',
    unlockCondition: 'jungle hard first clear',
    displayOrder: 110,
  },
  {
    id: 'jungle_expert_clear',
    name: '翠域解析員',
    description: '密林地帯のEXPERT環境を解析した証。',
    stageId: 'jungle',
    difficultyId: 'expert',
    rarity: 'epic',
    frameType: 'expert_clear_frame',
    unlockCondition: 'jungle expert first clear',
    displayOrder: 120,
  },
  {
    id: 'volcano_normal_clear',
    name: '火山生還者',
    description: '火山地帯のNORMAL環境を初めて突破した証。',
    stageId: 'volcano',
    difficultyId: 'normal',
    rarity: 'normal',
    frameType: 'normal_clear_frame',
    unlockCondition: 'volcano normal first clear',
    displayOrder: 200,
  },
  {
    id: 'volcano_hard_clear',
    name: '溶岩圏突破者',
    description: '火山地帯のHARD環境を突破した証。',
    stageId: 'volcano',
    difficultyId: 'hard',
    rarity: 'rare',
    frameType: 'hard_clear_frame',
    unlockCondition: 'volcano hard first clear',
    displayOrder: 210,
  },
  {
    id: 'volcano_expert_clear',
    name: '灼熱変異観測者',
    description: '火山地帯のEXPERT変異圧を観測した証。',
    stageId: 'volcano',
    difficultyId: 'expert',
    rarity: 'epic',
    frameType: 'expert_clear_frame',
    unlockCondition: 'volcano expert first clear',
    displayOrder: 220,
  },
  {
    id: 'swamp_normal_clear',
    name: '沼地解析員',
    description: '沼地地帯のNORMAL環境を初めて解析した証。',
    stageId: 'swamp',
    difficultyId: 'normal',
    rarity: 'normal',
    frameType: 'normal_clear_frame',
    unlockCondition: 'swamp normal first clear',
    displayOrder: 300,
  },
  {
    id: 'swamp_hard_clear',
    name: '毒性圏踏破者',
    description: '沼地地帯のHARD毒性圏を踏破した証。',
    stageId: 'swamp',
    difficultyId: 'hard',
    rarity: 'rare',
    frameType: 'hard_clear_frame',
    unlockCondition: 'swamp hard first clear',
    displayOrder: 310,
  },
  {
    id: 'swamp_expert_clear',
    name: '瘴気生還者',
    description: '沼地地帯のEXPERT環境から生還した証。',
    stageId: 'swamp',
    difficultyId: 'expert',
    rarity: 'epic',
    frameType: 'expert_clear_frame',
    unlockCondition: 'swamp expert first clear',
    displayOrder: 320,
  },
  {
    id: 'ruins_normal_clear',
    name: '遺跡調査者',
    description: '遺跡地帯のNORMAL区画を初めて調査した証。',
    stageId: 'ruins',
    difficultyId: 'normal',
    rarity: 'normal',
    frameType: 'normal_clear_frame',
    unlockCondition: 'ruins normal first clear',
    displayOrder: 400,
  },
  {
    id: 'ruins_hard_clear',
    name: '旧施設突破者',
    description: '遺跡地帯のHARD旧施設区画を突破した証。',
    stageId: 'ruins',
    difficultyId: 'hard',
    rarity: 'rare',
    frameType: 'hard_clear_frame',
    unlockCondition: 'ruins hard first clear',
    displayOrder: 410,
  },
  {
    id: 'ruins_expert_clear',
    name: '異常記録者',
    description: '遺跡地帯のEXPERT異常記録を回収した証。',
    stageId: 'ruins',
    difficultyId: 'expert',
    rarity: 'epic',
    frameType: 'expert_clear_frame',
    unlockCondition: 'ruins expert first clear',
    displayOrder: 420,
  },
];

export const ENDLESS_TITLES = [
  {
    id: 'endless_survivor_5m',
    name: 'エンドレス生還者',
    description: 'ENDLESSで5分以上生存した証。',
    rarity: 'normal',
    frameType: 'normal_clear_frame',
    unlockCondition: 'endless survival 5 minutes',
    thresholdSeconds: 300,
    displayOrder: 900,
  },
  {
    id: 'endless_survivor_10m',
    name: '深層生存者',
    description: 'ENDLESSで10分以上生存した証。',
    rarity: 'rare',
    frameType: 'hard_clear_frame',
    unlockCondition: 'endless survival 10 minutes',
    thresholdSeconds: 600,
    displayOrder: 910,
  },
  {
    id: 'endless_hunter_300',
    name: '終わらぬ狩人',
    description: 'ENDLESSで300体以上撃破した証。',
    rarity: 'rare',
    frameType: 'hard_clear_frame',
    unlockCondition: 'endless 300 defeats',
    thresholdDefeats: 300,
    displayOrder: 920,
  },
];

export const ZERO_TITLES = [
  {
    id: 'zero_first_clear',
    name: '終焉到達者',
    description: 'ZEROを初めて突破し、死線の先にある進化ルートを発見した証。',
    rarity: 'zero',
    frameType: 'zero_deluxe_frame',
    unlockCondition: 'zero first clear',
    displayOrder: 1000,
  },
  {
    id: 'jungle_zero_clear',
    name: '密林死線踏破者',
    description: 'jungle ZEROを突破し、ヴェロキラプトル系ZERO進化ルートを発見した証。',
    stageId: 'jungle',
    difficultyId: 'zero',
    rarity: 'zero',
    frameType: 'jungle_zero_frame',
    unlockCondition: 'jungle zero first clear',
    displayOrder: 1010,
  },
  {
    id: 'swamp_zero_clear',
    name: '終焉到達者',
    description: 'swamp ZEROを突破し、ティラノサウルス系ZERO進化ルートを発見した証。',
    stageId: 'swamp',
    difficultyId: 'zero',
    rarity: 'zero',
    frameType: 'swamp_zero_frame',
    unlockCondition: 'swamp zero first clear',
    displayOrder: 1030,
  },
  {
    id: 'volcano_zero_clear',
    name: '\u30a4\u30b0\u30cb\u30b9\u8e0f\u7834\u8005',
    description: 'volcano ZERO\u3092\u7a81\u7834\u3057\u3001\u30c8\u30ea\u30b1\u30e9\u30c8\u30d7\u30b9\u7cfbZERO\u9032\u5316\u30eb\u30fc\u30c8\u3092\u767a\u898b\u3057\u305f\u8a3c\u3002',
    stageId: 'volcano',
    difficultyId: 'zero',
    rarity: 'zero',
    frameType: 'volcano_zero_frame',
    unlockCondition: 'volcano zero first clear',
    displayOrder: 1020,
  },
];

export function getEndlessTitleRewardsForRun(gameState) {
  if (gameState?.selectedMode !== 'endless') {
    return [];
  }

  const elapsedTime = gameState.elapsedTime ?? 0;
  const defeatedCount = gameState.defeatedCount ?? 0;

  return ENDLESS_TITLES.filter((title) => (
    (title.thresholdSeconds && elapsedTime >= title.thresholdSeconds)
    || (title.thresholdDefeats && defeatedCount >= title.thresholdDefeats)
  ));
}

export function getZeroTitleRewardsForRun(gameState) {
  if (gameState?.selectedMode !== 'zero' || gameState?.runResult?.type !== 'zeroClear') {
    return [];
  }

  const stageId = gameState.selectedStage ?? null;
  return ZERO_TITLES.filter((title) => title.stageId === stageId);
}

export function getTitleRewardForStageClear(stageId, difficultyId) {
  return STAGE_CLEAR_TITLES.find((title) => title.stageId === stageId && title.difficultyId === difficultyId) ?? null;
}

export function getTitleById(titleId) {
  return STAGE_CLEAR_TITLES.find((title) => title.id === titleId)
    ?? ENDLESS_TITLES.find((title) => title.id === titleId)
    ?? ZERO_TITLES.find((title) => title.id === titleId)
    ?? null;
}

export function getTitleFrameById(frameId) {
  return TITLE_FRAME_DEFINITIONS[frameId] ?? null;
}

export function getTitleFrameForTitle(title) {
  return title?.frameType ? getTitleFrameById(title.frameType) : null;
}
