# MVP-P07 Companion Dino Main Merge Checklist

## Branch

- Working branch: `feature/companion-dino-p01`
- Main merge status: not merged
- Main push status: not pushed

## Confirmed In P07

| Area | Result | Notes |
| --- | --- | --- |
| Normal play without companion | PASS | `debugCompanionClear=1` route starts PlayScene with no runtime error/warn. |
| Normal play with companion | PASS | All 10 `debugCompanionId` routes start PlayScene and show companion debug state without runtime error/warn. |
| ZERO with companion | PASS | Short `debugPerformance=1` smoke with `rex_hatchling` had no runtime error/warn. |
| ENDLESS without companion | PASS | Short `debugPerformance=1` smoke had no runtime error/warn. |
| Home companion modal | PASS | 10 companion list, owned/selected/locked states, upgrade summary, and DNA shortage display open without runtime error/warn. |
| Egg pending state | PASS | Research hatch card appears in body enhancement category and shows egg state/cost. |
| Hatch ready state | PASS | Claim route opens result dialog and hatch effect without runtime error/warn. |
| All-owned duplicate reward | PASS | Hatch claim returns alternate DNA reward and dialog without runtime error/warn. |
| Old save compatibility | PASS | `normalizeCompanionState(undefined)` returns safe default state. |
| Invalid selectedId / level | PASS | Invalid IDs are removed, invalid selection resets to null, levels clamp to max. |
| 10 companion definitions | PASS | 10 unique IDs and level scaling data are present. |

## 10 Companion Smoke Matrix

| ID | Icon/UI | Play Sprite | Effect/Action | Status |
| --- | --- | --- | --- | --- |
| `raptorling` | Confirmed via modal/debug route | Confirmed via `debugCompanionId` | Single-target attack route smoke | PASS |
| `spino_pup` | Confirmed via modal/debug route | Confirmed via `debugCompanionId` | Area attack route smoke | PASS |
| `medic_saur` | Confirmed via modal/debug route | Confirmed via `debugCompanionId` | Heal support route smoke | PASS |
| `ptera_chick` | Confirmed via modal/debug route | Confirmed via `debugCompanionId` | Ranged attack route smoke | PASS |
| `tricera_calf` | Confirmed via modal/debug route | Confirmed via `debugCompanionId` | Defense support route smoke | PASS |
| `para_juvenile` | Confirmed via modal/debug route | Confirmed via `debugCompanionId` | Pickup assist route smoke | PASS |
| `stego_calf` | Confirmed via modal/debug route | Confirmed via `debugCompanionId` | Synergy/area route smoke | PASS |
| `rex_hatchling` | Confirmed via modal/debug route | Confirmed via `debugCompanionId` | Boss-priority attack route smoke | PASS |
| `compy_pack` | Confirmed via modal/debug route | Confirmed via `debugCompanionId` | Swarm attack route smoke | PASS |
| `exp_chaser` | Confirmed via modal/debug route | Confirmed via `debugCompanionId` | EXP support route smoke | PASS |

## Required Before Main Merge

- Run one manual fresh-save path without debug flags if time allows: title, home, sortie, egg pickup, result, research hatch, home set, play.
- Run one existing-save path from a real player save if available.
- Run a longer ZERO/ENDLESS soak with at least one attack companion and one utility companion.
- Confirm smartphone viewport readability for companion modal and research hatch card.
- Confirm controller/virtual mouse can close companion modal and avoid blocking home flow.
- Decide release version bump at merge time.
- Add user-facing update news at merge time.

## Known Residual Risks

- Full natural egg drop relies on probability, so debug-assisted QA is still the fastest repeatable path.
- P04 sprites are static PNGs; animation sheet polish is intentionally deferred.
- Companion actions are tuned to be support-level, but long ZERO balance should be checked again after merge candidate build.
- Some existing companion documentation files contain older encoding artifacts; user-facing runtime strings should be checked visually before release.

## Main Merge Judgment

Current judgment: merge candidate after one final manual fresh-save pass and longer high-density soak.

The feature branch is close to main integration quality. No blocker was found in P07 smoke QA, build, or save normalization checks.

## Version Policy For Merge

- Feature branch does not update `src/data/app_version.js`.
- On main integration, use a minor or patch bump depending on release scope.
- Suggested version direction: minor bump if companion dinos are released as a new feature.

## Update News Draft

Title: お供恐竜を追加しました

Body:

・プレイ中に一緒に行動するお供恐竜を追加しました。

・卵を入手し、研究画面で孵化できるようになりました。

・入手したお供恐竜はホームでセットできます。

・DNAを使ってお供恐竜を強化できます。
