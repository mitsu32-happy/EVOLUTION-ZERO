export const DAILY_MISSION_COUNT = 0;

export const DAILY_MISSION_POOL = [];

export function getDailyMissionTemplate(id) {
  return null;
}

export function getJstDateKey(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

export function formatDailyReward() {
  return '-';
}

export function selectDailyMissionTemplates() {
  return [];
}

export function normalizeDailyMissionsState() {
  return { dateKey: null, missions: [] };
}
