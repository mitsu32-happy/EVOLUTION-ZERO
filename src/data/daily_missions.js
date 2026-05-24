export const DAILY_MISSION_COUNT = 3;

export const DAILY_MISSION_POOL = [
  {
    id: 'run_started',
    event: 'runStarted',
    label: '1回出撃する',
    shortLabel: '1回出撃',
    target: 1,
    reward: { researchPt: 3 },
  },
  {
    id: 'enemy_defeated_30',
    event: 'enemyDefeated',
    label: '敵を30体倒す',
    shortLabel: '敵30体撃破',
    target: 30,
    reward: { researchPt: 4 },
  },
  {
    id: 'exp_collected_20',
    event: 'expCollected',
    label: 'EXPクリスタルを20個拾う',
    shortLabel: 'EXP20個回収',
    target: 20,
    reward: { researchPt: 4 },
  },
  {
    id: 'level_up_3',
    event: 'levelUp',
    label: 'レベルアップを3回行う',
    shortLabel: 'LvUP 3回',
    target: 3,
    reward: { researchPt: 5 },
  },
  {
    id: 'survive_180',
    event: 'survivedSeconds',
    label: '合計3分生存する',
    shortLabel: '3分生存',
    target: 180,
    reward: { researchPt: 4 },
  },
  {
    id: 'heal_pickup_1',
    event: 'pickupHeal',
    label: 'HP回復を1個拾う',
    shortLabel: 'HP回復1個',
    target: 1,
    reward: { researchPt: 4 },
  },
  {
    id: 'special_used_1',
    event: 'specialUsed',
    label: '必殺技を1回使う',
    shortLabel: '必殺1回',
    target: 1,
    reward: { researchPt: 4 },
  },
  {
    id: 'open_research_1',
    event: 'openResearch',
    label: '研究画面を開く',
    shortLabel: '研究を開く',
    target: 1,
    reward: { researchPt: 3 },
  },
  {
    id: 'open_codex_1',
    event: 'openCodex',
    label: '図鑑を開く',
    shortLabel: '図鑑を開く',
    target: 1,
    reward: { researchPt: 3 },
  },
  {
    id: 'normal_stage_play_1',
    event: 'normalStagePlayed',
    label: '通常ステージを1回プレイ',
    shortLabel: '通常1回',
    target: 1,
    reward: { researchPt: 4 },
  },
];

export function getJstDateKey(date = new Date()) {
  const source = date instanceof Date ? date : new Date(date);
  const jst = new Date(source.getTime() + 9 * 60 * 60 * 1000);

  return jst.toISOString().slice(0, 10);
}

export function getDailyMissionTemplate(id) {
  return DAILY_MISSION_POOL.find((mission) => mission.id === id) ?? null;
}

export function createDailyMissionState(template) {
  return {
    id: template.id,
    progress: 0,
    target: template.target,
    completed: false,
    claimed: false,
  };
}

export function formatDailyReward(reward = {}) {
  return reward.researchPt ? `研究Pt +${reward.researchPt}` : '-';
}

export function selectDailyMissionTemplates(dateKey, count = DAILY_MISSION_COUNT) {
  const pool = [...DAILY_MISSION_POOL];
  const seedBase = hashString(String(dateKey || getJstDateKey()));

  return pool
    .map((mission, index) => ({
      mission,
      weight: hashString(`${seedBase}:${mission.id}:${index}`),
    }))
    .sort((a, b) => a.weight - b.weight)
    .slice(0, count)
    .map((entry) => entry.mission);
}

export function normalizeDailyMissionsState(value, dateKey = getJstDateKey()) {
  const source = typeof value === 'object' && value !== null ? value : {};
  const existingMissions = Array.isArray(source.missions) ? source.missions : [];

  if (source.dateKey === dateKey && existingMissions.length > 0) {
    const normalized = existingMissions
      .map((mission) => normalizeDailyMissionEntry(mission))
      .filter(Boolean)
      .slice(0, DAILY_MISSION_COUNT);

    if (normalized.length === DAILY_MISSION_COUNT) {
      return { dateKey, missions: normalized };
    }
  }

  return {
    dateKey,
    missions: selectDailyMissionTemplates(dateKey).map(createDailyMissionState),
  };
}

export function normalizeDailyMissionEntry(value) {
  const template = getDailyMissionTemplate(value?.id);

  if (!template) {
    return null;
  }

  const progress = Math.max(0, Math.min(template.target, Math.floor(Number(value?.progress) || 0)));

  return {
    id: template.id,
    progress,
    target: template.target,
    completed: Boolean(value?.completed) || progress >= template.target,
    claimed: Boolean(value?.claimed),
  };
}

function hashString(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}
