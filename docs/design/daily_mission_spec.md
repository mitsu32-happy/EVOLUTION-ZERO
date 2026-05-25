# Daily Mission Spec

## MVP-A02 Home Tab Rules

- Daily missions live in the Home `デイリー` tab instead of sharing the screen with records and unlock status.
- Home shows exactly three daily rows.
- Each row shows label, progress/completed/claimed state, and ResearchPt-only reward.
- Home uses short reward text such as `Pt +4`; detailed reward wording can remain in dialogs or docs.
- Claiming a daily mission must add ResearchPt only. DNA must not increase from daily claims.
- Claimed state must persist through reload via `dailyMissionClaims` and mission `claimed: true`.
- The tab panel must fit narrow iPhone Safari viewports without horizontal scrolling.

## MVP-160c Baseline

- Daily missions are a lightweight daily return loop for pre-release RC.
- The save field is:

```js
dailyMissions: {
  dateKey: "YYYY-MM-DD",
  missions: [
    { id, progress, target, completed, claimed }
  ]
}
```

- `dateKey` is generated as a JST date key. With no server clock, the device clock is used and interpreted as Asia/Tokyo reset timing.
- At JST 00:00, the active table is regenerated from the mission pool.
- The same day keeps the same three mission ids, progress, completed flags, and claimed flags.
- Mission rewards are claimed per mission and cannot be claimed again after `claimed: true`.

## Mission Pool

- `run_started`: 1 sortie, reward `研究Pt +3`.
- `enemy_defeated_30`: defeat 30 enemies, reward `研究Pt +4`.
- `exp_collected_20`: collect 20 EXP crystals, reward `研究Pt +4`.
- `level_up_3`: level up 3 times, reward `研究Pt +5`.
- `survive_180`: survive 180 total seconds, reward `研究Pt +4`.
- `heal_pickup_1`: collect 1 HP recovery pickup, reward `研究Pt +4`.
- `special_used_1`: use 1 special, reward `研究Pt +4`.
- `open_research_1`: open Research, reward `研究Pt +3`.
- `open_codex_1`: open Codex, reward `研究Pt +3`.
- `normal_stage_play_1`: play 1 normal stage run, reward `研究Pt +4`.

## Scope Rules

- Daily missions must not require ZERO clear, EXPERT clear, a specific stage clear, a specific dinosaur, or a specific evolution.
- Daily rewards are ResearchPt-only from MVP-160d onward. DNA remains a play/run reward resource.
- Older same-day mission state is safe because rewards are resolved from the current mission table at claim time.
- Debug helpers:
  - `debugDailyReset=1`
  - `debugDailyComplete=1`
  - `debugDailyDate=YYYY-MM-DD`
