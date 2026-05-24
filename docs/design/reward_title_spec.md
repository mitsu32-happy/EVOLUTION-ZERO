# EVOLUTION ZERO Reward And Title Spec

## Purpose

This document defines first-clear rewards, title rewards, title frames, ZERO rewards, and where those rewards appear.

Rewards should support long-term motivation without turning the game into a permanent dinosaur level system.

## Reward Types

| Reward | Role | Main Source | Notes |
| --- | --- | --- | --- |
| DNA | Body enhancement and research resource | Runs, boss rewards, difficulty bonuses | Primary repeatable play reward |
| ResearchPt | Rare unlock resource | Daily missions, analysis conversion, future special rewards | Not a normal result payout |
| Title | Cosmetic achievement | First clears, ZERO clears, special goals | Displayable on home |
| Title frame | Cosmetic title styling | Harder clears, ZERO clears | Normal and deluxe variants |
| New evolution route | Long-term discovery | ZERO clear / special first clear | Reveals hidden codex branches |
| First-clear reward | One-time stage/difficulty reward | Stage clear | Container for title/frame/route |

## First-Clear Rewards

First-clear rewards happen once per stage and difficulty.

Examples:

- NORMAL first clear: stage title.
- HARD first clear: upgraded title frame or extra DNA bonus.
- EXPERT first clear: rare title frame and ENDLESS/ZERO unlock.
- ZERO first clear: deluxe title and new evolution route discovery.

If no first-clear reward occurs, result UI should hide the first-clear reward section.

## Title Display

Titles are cosmetic and should not imply character levels.

Home display direction:

- Show equipped title above or near the favorite dinosaur hero.
- Use subtle title frame behind the title text.
- Normal titles use restrained cyan/amber frames.
- ZERO titles use deluxe black/gold/red frames.

Result display direction:

- Show new title rewards inside the first-clear reward area.
- Use `NEW` label in code-rendered text.
- Keep the title name short; compact long names.

## Example Titles

Stage first-clear examples:

- 密林踏破者
- 火山生還者
- 沼地解析員
- 遺跡調査者

Difficulty examples:

- HARD踏破
- EXPERT生還
- 変異制圧者

ZERO examples:

- ZERO SURVIVOR
- 死線踏破者
- 終端進化観測者

## ZERO Reward Evolution Routes

ZERO rewards can discover a new evolution route.

Rules:

- Discovery is persistent.
- Discovery reveals codex branch identity and future run eligibility.
- It is not a DNA research purchase.
- It should be shown as "新規進化ルート発見" or "新規進化先発見", not "ZERO解析".

Result UI display:

- Section title: 初回クリア報酬 or ZERO初回報酬.
- Item: 新規進化ルート: ??? 発見, or the discovered route name if revealed.
- Optional subtitle: 進化は、死線の先にある.

## ResearchPt Policy

ResearchPt sources:

- Daily missions.
- DNA -> ResearchPt analysis conversion.
- Future explicitly special rewards.

ResearchPt must not be a normal play result payout for:

- Boss defeat.
- Difficulty.
- Survival time.
- Score.

This keeps ResearchPt valuable for adaptation skill unlocks and future content gates.

## Save Data Direction

Future save fields should be optional/default:

```js
{
  titles: {
    unlocked: [],
    equipped: null
  },
  titleFrames: {
    unlocked: [],
    equipped: null
  },
  stageClears: {
    [stageId]: {
      normal: true,
      hard: false,
      expert: false,
      zero: false
    }
  },
  discoveredEvolutionRoutes: {
    [dinoId]: ['speed', 'hunting', 'attack', 'zero']
  }
}
```

Missing fields must be treated as empty arrays/objects.

## UI Integration

Home:

- Equipped title appears near the favorite dinosaur hero.
- Title frame should not cover the dinosaur face.

Codex:

- Discovered evolution routes become visible.
- Undiscovered ZERO routes stay `???`.

Result:

- First-clear rewards show titles, frames, and evolution route discoveries.
- ZERO route discovery replaces the old ambiguous `ZERO解析` idea.

## Next MVP Candidates

- MVP-132: define save-compatible title/frame data helpers.
- MVP-133: first-clear reward calculation and basic home/result title display implemented.
- MVP-134: implement title selection UI and dedicated title-frame assets.
- MVP-135: implement ZERO route discovery result display.

## MVP-131 Stage Reward Contract

First-clear rewards are one-time rewards tied to stage and difficulty.

Recommended reward ladder per stage:

| Clear | Reward Direction | Notes |
| --- | --- | --- |
| NORMAL first clear | stage title | small but visible home cosmetic |
| HARD first clear | title frame or upgraded title variant | should feel better than NORMAL but not deluxe |
| EXPERT first clear | rare title frame and ENDLESS/ZERO unlock | communicates mastery |
| ZERO first clear | deluxe title, deluxe frame, new evolution route discovery | major endpoint reward |

Stage title examples:

- Jungle: `密林踏破者`, `捕食圏生還者`, `翠域解析員`
- Volcano: `火山生還者`, `溶岩圏突破者`, `灼熱変異観測者`
- Swamp: `沼地解析員`, `毒性圏踏破者`, `瘴気生還者`
- Ruins: `遺跡調査者`, `旧施設突破者`, `異常記録者`

ZERO title examples:

- `ZERO SURVIVOR`
- `死線踏破者`
- `終端進化観測者`

Display rules:

- Result screen shows first-clear rewards in one compact reward section.
- Home may show equipped title slightly above the favorite dinosaur hero.
- Title frames are cosmetic and must not imply permanent dinosaur level.
- ZERO route rewards should be labeled as `新規進化ルート発見` or `新規進化先発見`.

## MVP-132 First-Clear Hook

The save layer now returns a first-clear hook from `recordRun`:

- `stageResult.stageId`
- `stageResult.difficultyId`
- `stageResult.isFirstClear`
- `unlockedDifficulties`
- `firstClearRewardPending`

## MVP-133 First-Clear Title Rewards

MVP-133 connects first-clear reward hooks to persistent title rewards.

Save fields:

```js
ownedTitles: {
  [titleId]: {
    owned: true,
    unlockedAt: "ISO-8601",
    source: "<stage>_<difficulty>_first_clear"
  }
},
ownedTitleFrames: {
  [frameId]: {
    owned: true,
    unlockedAt: "ISO-8601",
    source: "<stage>_<difficulty>_first_clear"
  }
},
equippedTitleId: "jungle_normal_clear",
equippedTitleFrameId: "normal_clear_frame"
```

Rules:

- NORMAL / HARD / EXPERT first clear grants one stage title.
- NORMAL grants `normal_clear_frame`, HARD grants `hard_clear_frame`, and EXPERT grants `expert_clear_frame`.
- ENDLESS does not grant a title in MVP-133.
- ZERO reward entries and deluxe frames remain future-facing structure.
- A title is granted only once. Second and later clears do not reissue the same title.
- The first obtained title is auto-equipped only if no title is already equipped. Existing equipment is not overwritten.
- `ownedTitles` and `ownedTitleFrames` accept missing or old boolean entries and normalize them safely.
- Implemented title count is 4 stages x 3 clear difficulties = 12 first-clear titles.
## MVP-143 ENDLESS title rewards

- ENDLESS titles are record rewards, not stage CLEAR rewards.
- Current minimal title set:
  - `endless_survivor_5m`: survive 5 minutes in ENDLESS.
  - `endless_survivor_10m`: survive 10 minutes in ENDLESS.
  - `endless_hunter_300`: defeat 300 enemies in ENDLESS.
- ENDLESS titles reuse existing title-frame save structures.
- First acquisition is saved in `ownedTitles`; existing equipped title is not replaced unless no title is equipped.

## MVP-144 ZERO rewards

- ZERO clear rewards use the same ownership structures as stage and ENDLESS titles:
  - `ownedTitles`
  - `ownedTitleFrames`
  - `equippedTitleId`
  - `equippedTitleFrameId`
- Minimal ZERO title:
  - `zero_first_clear`: `終焉到達者`
- ZERO title rewards use the `zero_deluxe_frame` frame type.
- ZERO route discovery uses `unlockedZeroRoutes`; stage-specific route mapping is finalized in later MVPs.
- ZERO route entries are a future-facing receptacle. MVP-144 does not add full ZERO evolution assets or playable ZERO branches.

## MVP-145 ZERO reward presentation

- ZERO clear still grants the minimal ZERO title `zero_first_clear` and the `zero_deluxe_frame` receptacle introduced in MVP-144.
- Result display now prioritizes ZERO-specific reward rows:
  - ZERO title
  - ZERO frame
  - new evolution route discovery
- `unlockedZeroRoutes` remains a receptacle only. MVP-145 does not add playable ZERO evolution branches.
- Normal run results must continue excluding ResearchPt.

## MVP-146 ZERO reward QA

- ZERO clear reward storage remains unchanged:
  - `ownedTitles`
  - `ownedTitleFrames`
  - `unlockedZeroRoutes`
  - `stageProgress.<stage>.zero`
- Result display now distinguishes repeated ZERO clears from missing rewards:
  - newly granted ZERO title/frame still shows the reward name.
  - already-owned ZERO title/frame shows `取得済み`.
  - already-unlocked ZERO route shows `解析済み`.
- This avoids the repeated-clear result reading as if ZERO rewards failed to trigger.
- Reward duplication rule is unchanged: second and later ZERO clears do not re-grant the same title, frame, or route key.

## MVP-147 ZERO reward save QA

- ZERO reward storage rules were kept unchanged while pacing was adjusted.
- `stageProgress.<stage>.zero` remains the authority for clear state, best score, and best time.
- ZERO title/frame/route rewards are still granted only on first ownership.
- Repeated ZERO clear result display should continue showing `取得済み` / `解析済み` for already-owned ZERO reward items.
- No additional ZERO reward evolution branches are implemented in MVP-147.
## MVP-151c ZERO Route Reward Stage Scope

- ZERO title and frame rewards remain global ZERO first-clear rewards.
- ZERO evolution route rewards are stage-scoped:
  - jungle: implemented `velociraptor_zero` / `アビスラプス`.
  - volcano: planned `triceratops_zero`, not yet production-implemented.
  - swamp: implemented `tyrannosaurus_zero` / `オメガレクス`.
  - ruins: post-release additional content after the fourth dinosaur is implemented.
- Runtime route unlock currently grants new routes for `jungle_zero_clear` and `swamp_zero_clear`.
- Re-clearing ZERO does not duplicate an already unlocked route.

## MVP-152 Stage-Specific ZERO Rewards

- ZERO title/frame rewards are stage-scoped for pre-release content.
- Implemented ZERO route rewards:
  - jungle ZERO clear -> `velociraptor_zero` / `アビスラプス`.
  - swamp ZERO clear -> `tyrannosaurus_zero` / Omega Rex.
- Planned:
  - volcano ZERO clear -> `triceratops_zero`, implemented in a later MVP.
  - ruins ZERO clear -> post-release additional content. No pre-release ZERO evolution route is granted.
- New stage-specific title/frame receptacles:
  - jungle ZERO title: `jungle_zero_clear`.
  - jungle ZERO frame: `jungle_zero_frame`.
  - swamp ZERO title: `swamp_zero_clear`.
  - swamp ZERO frame: `swamp_zero_frame`.
- Legacy global ZERO title data may remain for compatibility, but active ZERO title reward lookup should use the cleared stage ID.
- Reward duplication rule is unchanged: titles, frames, and zero routes are granted only once.

## MVP-152c ZERO Reward QA Notes

- Stage-specific ZERO title/frame lookup remains authoritative.
- Jungle and swamp ZERO route rewards were rechecked against the final-boss routing:
  - jungle: `jungle_zero_clear` title/frame plus `velociraptor_zero`.
  - swamp: `swamp_zero_clear` title/frame plus `tyrannosaurus_zero`.
- Volcano ZERO titles/frames stay planned and are not production-scoped in this MVP.
- Ruins ZERO title/frame and route rewards remain post-release; normal pre-release selection must keep ruins ZERO locked.

## MVP-152d ZERO Phase 2 Reward Rule

- Dedicated jungle/swamp ZERO second bosses are encounter milestones only.
- They do not grant titles, frames, or `unlockedZeroRoutes`.
- Reward grant timing remains final-boss only:
  - jungle final ZERO clear: `jungle_zero_clear`, `jungle_zero_frame`, `velociraptor_zero`.
  - swamp final ZERO clear: `swamp_zero_clear`, `swamp_zero_frame`, `tyrannosaurus_zero`.
- Duplicate prevention remains unchanged; repeated clears do not re-grant owned titles, frames, or route keys.
- Volcano title/frame and `triceratops_zero` are still planned for the later volcano ZERO reward MVP.

## MVP-153 Volcano ZERO Rewards

- Volcano ZERO first clear grants `volcano_zero_clear` and the `volcano_zero_frame` frame.
- Volcano ZERO first clear also unlocks `triceratops_zero` / `イグニケラ` through `unlockedZeroRoutes.triceratops_zero`.
- Reward assignment is now:
  - jungle ZERO -> `velociraptor_zero` / `アビスラプス`.
  - volcano ZERO -> `triceratops_zero` / `イグニケラ`.
  - swamp ZERO -> `tyrannosaurus_zero` / `オメガレクス`.
  - ruins ZERO -> post-release / no route reward.
- As with other ZERO rewards, phase 2 boss defeat does not grant route/title/frame rewards; only final ZERO clear does.

### MVP-154 ZERO 3-route cross QA
- Scope: pre-release ZERO routes are jungle -> `velociraptor_zero` / アビスラプス, volcano -> `triceratops_zero` / イグニケラ, and swamp -> `tyrannosaurus_zero` / オメガレクス.
- QA confirmed route reward mapping through `SaveManager.grantZeroRewards`: jungle grants `jungle_zero_clear` + `jungle_zero_frame` + `velociraptor_zero`; volcano grants `volcano_zero_clear` + `volcano_zero_frame` + `triceratops_zero`; swamp grants `swamp_zero_clear` + `swamp_zero_frame` + `tyrannosaurus_zero`; ruins grants no ZERO route reward.
- Duplicate reward QA confirmed the second volcano ZERO clear does not re-grant the route, title, or frame.
- ZERO upper evolution QA confirmed all three routes require route unlock, matching lineage, Lv8+, speed/hunting/attack Lv3+, and do not become eligible again after `hasZeroEvolved` is set.
- Existing `hasEvolved` normal evolution state does not block ZERO upper evolution eligibility.
- ZERO candidate UI copy was normalized to readable Japanese for route解析済み / 全適応Lv3+ / Lv8+.
- Browser smoke QA covered jungle, volcano, swamp ZERO starts; direct ZERO evolutions and their specials; stage select locking; and ruins ZERO lock.
- Final polish candidates: full manual ZERO CLEAR pacing per route, boss HP tuning without `debugWeakBoss`, and longer performance soak.

### MVP-155 ZERO pre-release balance QA
- Scope: normal-strength ZERO QA for jungle / volcano / swamp without `debugWeakBoss`; ruins ZERO remains post-release locked.
- Early-run QA found jungle stable, volcano level-up tempo acceptable, and swamp pressure slightly high in the first 20 seconds.
- Balance adjustments:
  - ZERO boss spawn times: `[95, 190, 285]` -> `[90, 180, 270]` seconds to reduce run fatigue while keeping three distinct phases.
  - ZERO phase gap: `42` -> `36` seconds to avoid overly long downtime between boss phases.
  - ZERO enemy HP scale: `1.34` -> `1.30`.
  - ZERO enemy damage scale: `1.18` -> `1.12`.
  - ZERO spawn rate scale: `1.24` -> `1.20`.
  - ZERO secondary boss HP/damage: `1.42 / 1.12` -> `1.34 / 1.10`.
  - ZERO final boss HP/damage: `1.95 / 1.24` -> `1.82 / 1.20`.
  - ZERO EXP multiplier: `1.18` -> `1.24` to make Lv8+ and all-adaptation Lv3+ upper-evolution conditions more reachable before the final phase.
- ZERO reward QA reconfirmed jungle -> `velociraptor_zero`, volcano -> `triceratops_zero`, swamp -> `tyrannosaurus_zero`, and ruins -> no route/title/frame reward.
- ZERO duplicate reward QA remains unchanged: second clears do not re-grant route, title, or frame rewards.
- Browser QA after tuning confirmed route starts and fast phase checks with no runtime console error/warn.
- Final polish candidates: full no-debug manual clear attempts, exact boss time-to-kill measurements per dino/evolution, and touch-control survivability tuning.

### MVP-156 Release Precheck
- ZERO reward mapping verified through save logic:
  - jungle ZERO: `velociraptor_zero`, `jungle_zero_clear`, `jungle_zero_frame`
  - volcano ZERO: `triceratops_zero`, `volcano_zero_clear`, `volcano_zero_frame`
  - swamp ZERO: `tyrannosaurus_zero`, `swamp_zero_clear`, `swamp_zero_frame`
  - ruins ZERO: no public ZERO route/title/frame reward
- Duplicate clear handling remains correct: second clears return no newly granted ZERO route, title, or frame.
- Result and home display should continue treating title/frame rewards as first-clear rewards only.
## MVP-160c Home Title Display Rule

- Home title UI must only show owned titles and owned title frames.
- `equippedTitleId` is treated as a preference, not proof of ownership.
- If the equipped title is unavailable, Home may fall back to the highest-order owned title.
- If the equipped frame is unavailable, Home may use the owned frame linked from the title definition.
- If neither title nor frame is available, Home shows a calm `称号なし` state.
- `debugUnlockAllTitles=1` unlocks normal first-clear, ENDLESS, and ZERO title/frame rewards for QA without changing the production reward grant rules.

## MVP-160d Title Selection

- Home title display is now the entry point for title selection.
- The selection UI has separate title and frame tabs and only lists owned entries.
- Equipping is saved to `equippedTitleId` and `equippedTitleFrameId`.
- SaveManager rejects unowned or unknown title/frame ids.
- ZERO title/frame rows should remain visually distinct from normal first-clear and ENDLESS rewards.
- Reward grant logic is unchanged; the UI only changes equipped cosmetics.

## MVP-160e Title Frame Assets

- 称号フレームは以下の専用PNGを使う。
  - normal: `title_frame_normal.png`
  - hard: `title_frame_hard.png`
  - expert: `title_frame_expert.png`
  - jungle ZERO: `title_frame_zero_jungle.png`
  - volcano ZERO: `title_frame_zero_volcano.png`
  - swamp ZERO: `title_frame_zero_swamp.png`
- `equippedTitleFrameId` は所有済みフレームのみ有効。
- 装備中称号に紐づくフレームが所有済みなら、称号装備時にそのフレームも自動適用してよい。
- 報酬付与条件は変更しない。UIは所有済み報酬の表示/装備だけを扱う。

## MVP-160f Equip Flow

- 所有済み称号/フレームだけが装備対象。
- `SaveManager.setEquippedTitle` / `setEquippedTitleFrame` は不明IDと未所有IDを拒否する。
- 称号装備時に、その称号に紐づくフレームが所有済みなら自動で `equippedTitleFrameId` も更新する。
- UIはSaveManagerの成功結果のみをHomeへ反映する。
## MVP-160f Title Frame Asset QA

- `zero_deluxe_frame` has a dedicated generic ZERO asset and must not reuse a stage-specific ZERO frame.
- `jungle_zero_frame`, `volcano_zero_frame`, and `swamp_zero_frame` each use a separate stage-themed PNG.
- Jungle and swamp ZERO frames were regenerated because their earlier green/purple silhouettes were too similar:
  - jungle ZERO: canopy predator / vine / claw motif.
  - swamp ZERO: toxic miasma / slime / poison bubble motif.
- Current frame comparison evidence:
  - `docs/assets/title_frames_mvp160f_contact.png`
  - `docs/assets/title_frame_check_mvp160f_report.json`
