# Z04-01 Stage 4 ZERO Plan

## Scope

Z04-01 is investigation and design only. It does not implement the 4th stage ZERO route, change save data, unlock ZERO evolutions, add assets, update version, or update news.

Target branch:

- `feature/stage4-zero-v1`

## Existing ZERO Structure

### Stage and difficulty flow

- Stage IDs are defined in `src/data/run_config.js` as `jungle`, `volcano`, `swamp`, and `ruins`.
- Stage selection UI defines the same four stages in `src/ui/stage_select_screen.js`.
- ZERO deploy mode uses `selectedMode = 'zero'` and `selectedDifficulty = 'expert'`.
- ZERO is unlocked per stage after EXPERT clear.
- `ruins` ZERO is currently blocked in both UI and save logic:
  - `StageSelectScreen.getDeployLockState()` returns locked for `ruins` ZERO unless `debugAllowRuinsZero=1`.
  - `SaveManager.isDifficultyUnlocked(stageId, 'zero')` returns false for `ruins`.
  - `PlayScene.applyRuinsZeroPreReleaseLock()` forces `ruins` ZERO runs back to standard EXPERT unless debug unlocked.

### ZERO scaling

ZERO pacing and pressure are shared through `ZERO_SCALING_CONFIG` in `src/data/run_config.js`.

Current structure:

- Three ZERO boss timings: first, second, final.
- Higher enemy HP, enemy damage, spawn rate, enemy cap, elite rate.
- Boss phase multipliers for first, secondary, and final bosses.

Design note:

- Stage 4 ZERO should reuse this shared ZERO structure initially.
- Stage-specific difficulty should come from boss, hazard, spawn mix, and reward routing instead of creating a separate mode.

### ZERO boss structure

ZERO boss routing is mainly in `PlayScene.getZeroBossConfig()`.

Current behavior:

- Phase 1 uses the selected stage boss scaled by ZERO rules.
- Phase 2 has dedicated second bosses for `jungle`, `swamp`, and `volcano`.
- Phase 3 has dedicated final bosses for `jungle`, `swamp`, and `volcano`.
- Any other stage currently falls back to `zero_eclipse_protocol`, using `zeroEclipseProtocol` assets and `ruinsSummoner` summons.

Implication for stage 4:

- `ruins` already has a safe fallback final ZERO boss path, but it is generic.
- Z04 should add explicit `ruins_zero_second_boss` and `ruins_zero_final_boss` definitions rather than relying on the generic fallback.

### ZERO reward structure

ZERO rewards are granted in `SaveManager.grantZeroRewards()`.

Current stage route mapping:

| Stage | ZERO route reward |
| --- | --- |
| `jungle` | `velociraptor_zero` |
| `volcano` | `triceratops_zero` |
| `swamp` | `tyrannosaurus_zero` |
| `ruins` | none |

Current title/frame rewards:

- `reward_titles.js` defines stage-specific ZERO titles for `jungle`, `volcano`, and `swamp`.
- `ruins` has normal / hard / expert clear titles but no ZERO title or ZERO frame.
- `asset_manifest.js` defines title frame assets for `jungle_zero_frame`, `volcano_zero_frame`, and `swamp_zero_frame`, but no `ruins_zero_frame`.

## Existing 4th Stage Structure

The 4th stage is `ruins`.

### Theme

- Label: `遺跡地帯`
- Stage select zone: `RUINS ZONE`
- Concept: collapsed research facility / old facility ruins.
- Color direction: dark violet / blue, electromagnetic, old facility, high-tech ruin.

### Enemy mix

Configured in `STAGE_CONFIGS.ruins`:

- `ruinsShooter`
- `ruinsElectro`
- `ruinsSummoner`
- standard enemy support from swarm / fast / tank weights

The existing 4th stage already leans toward ranged pressure, electromagnetic hazards, and summons.

### Stage gimmicks

Configured in `STAGE_GIMMICK_CONFIGS.ruins`:

- Electro pulse
- Laser beam
- Warning guide support
- Slow multiplier
- Line-based hazard parameters

Implementation support is in `PlayScene.getNextStageGimmickDefinition()`, which already has `ruins` variants.

### Normal ruins boss

Configured in `STAGE_BOSS_CONFIGS.ruins`:

- ID: `ruins_ark_revenant`
- Name: `アーク・レヴナント`
- Asset: `bosses.ruinsBoss`
- Attacks:
  - melee
  - electroPulse
  - laserBeam
  - summon

This boss can serve as the base for ZERO phase 1, but phase 2 and phase 3 should become dedicated ZERO variants.

## Stage 4 ZERO Concept

Working name:

```text
ZERO深層遺跡
```

Concept:

```text
ZERO汚染が旧研究施設の深部リアクターに到達し、遺跡地帯全体が臨界反応を起こしている。
```

Visual direction:

- Preserve the ruins / old facility identity.
- Add ZERO corruption through black, cyan, red-purple, fractured light, and unstable reactor patterns.
- Avoid making the screen too bright or too noisy.
- Warning guide visibility must remain high.
- The route should feel more clinical and electromagnetic than volcano / swamp ZERO.

Gameplay direction:

- Endgame pressure, but not a raw enemy-count spike.
- Use fewer but clearer hazards:
  - telegraphed beams
  - expanding reactor pulses
  - controlled summon windows
- Keep screen readability and mobile performance stable.
- Use current high-load safeguards as a design constraint.

## ZERO Boss Proposal

### Phase 1

Use `ruins_ark_revenant` scaled by existing ZERO rules.

Purpose:

- Familiar opening.
- Lets the player read ruins-style electro / laser patterns before ZERO-specific escalation.

### Phase 2 boss

Proposed ID:

```text
ruins_zero_second_boss
```

Proposed name:

```text
アーク・レイス
```

Role:

- Mid-route electromagnetic pursuer.
- Pressure through beams and limited summons.

Attack set:

- Narrow ZERO laser with clear warning.
- Reactor field that slows briefly but uses low active count.
- Controlled summons using `ruinsShooter` / `ruinsElectro`, not large swarms.

Asset needs:

- Boss hero/sprite/portrait or boss PNG equivalent.
- Warning sheet.
- Attack sheet.

### Phase 3 final boss

Proposed ID:

```text
ruins_zero_final_boss
```

Proposed name:

```text
エクリプス・アーク
```

Role:

- Final stage 4 ZERO endpoint.
- Reactor-core boss using gravity/electro/laser motifs.

Attack set:

- Eclipse beam: long line warning, moderate active duration.
- Core pulse: circular warning around player area, one active pulse.
- Gravity lock field: short slow field, reduced count, readable alpha.
- Summon gate: low-count `ruinsSummoner` or `ruinsElectro`, capped to avoid high-load spikes.

Performance constraints:

- No multi-layer full-screen flash residue.
- No repeated large Graphics creation.
- Reuse texture sheets and warning guide paths.
- Keep active hazards near existing ZERO phase caps.

## Enemy And Gimmick Proposal

Stage 4 ZERO should not simply raise enemy count.

Recommended adjustments:

- Use ruins enemy family with ZERO pressure weights:
  - more `ruinsElectro`
  - controlled `ruinsSummoner`
  - fewer tiny swarm enemies than jungle
- Add stage-specific ZERO hazard variants:
  - `ruinsZeroReactorPulseSheet`
  - `ruinsZeroLaserWarningSheet`
  - `ruinsZeroLaserBeamSheet`
  - `ruinsZeroSummonGateSheet`
- Keep warning durations readable:
  - line hazards: around 1.0-1.2s warning
  - pulse hazards: around 1.1-1.3s warning
- Prefer one or two clear hazards over simultaneous clutter.

## ZERO Reward Policy

Recommended approach:

```text
案B: 4ステージ目ZEROクリアでZERO進化研究カードを解放する
```

Rationale:

- New six dinos created many ZERO evolutions.
- Unlocking all of them instantly would flatten the reward curve.
- Research connection gives DNA a meaningful late-game sink.
- It avoids sudden save-state unlock complexity and lets players choose which ZERO route to analyze first.

## New ZERO Evolution Connection Plan

Candidates to connect through stage 4 ZERO research unlock:

| Evolution ID | Current state | Proposed Z04 handling |
| --- | --- | --- |
| `spinosaurus_zero` | Data/assets exist, unlock condition says `ruins ZERO clear` | First direct research-unlock candidate after ruins ZERO clear |
| `ankylosaurus_zero` | Pending ZERO branch with assets connected | Research card unlocked after ruins ZERO clear |
| `parasaurolophus_zero` | Pending ZERO branch with assets connected | Research card unlocked after ruins ZERO clear |
| `stegosaurus_zero` | Pending ZERO branch with assets connected | Research card unlocked after ruins ZERO clear |
| `pteranodon_zero` | Pending ZERO branch with assets connected | Research card unlocked after ruins ZERO clear |
| `compsognathus_zero` | Pending ZERO branch with assets connected | Research card unlocked after ruins ZERO clear |
| `ornithomimus_zero` | Pending ZERO branch with assets connected | Research card unlocked after ruins ZERO clear |

Recommended unlock model:

1. `ruins` ZERO clear grants:
   - `ruins_zero_clear` title
   - `ruins_zero_frame`
   - a persistent flag such as `stageProgress.ruins.zero.cleared`
2. Research screen reads that clear state and reveals ZERO evolution analysis cards.
3. Each ZERO evolution research card costs DNA and unlocks one `unlockedZeroRoutes.<evolutionId>`.
4. ZERO evolution eligibility still requires:
   - matching dino lineage
   - player level 8+
   - speed / hunting / attack Lv3+
   - route unlocked through research

Do not directly unlock all seven routes from clear alone.

## Research Screen Connection Proposal

Add a new set of unknown-domain research items in a later Z04 step:

- `spinosaurus_zero_route_analysis`
- `ankylosaurus_zero_route_analysis`
- `parasaurolophus_zero_route_analysis`
- `stegosaurus_zero_route_analysis`
- `pteranodon_zero_route_analysis`
- `compsognathus_zero_route_analysis`
- `ornithomimus_zero_route_analysis`

Visibility condition:

- Hidden until `stageProgress.ruins.zero.cleared === true`.
- Debug override can be added for QA only.

Cost direction:

- Use DNA only.
- Costs should be late-game meaningful but not punishing.
- Initial proposal:
  - `spinosaurus_zero`: 1800 DNA
  - defensive / support new dinos: 1500-1700 DNA
  - high mobility / swarm routes: 1500-1700 DNA

Save effect:

- Set `unlockedZeroRoutes[evolutionId] = { unlocked: true, source: 'ruins_zero_research', unlockedAt }`.
- Also set `discoveredEvolutions[evolutionId]` for codex/result consistency.

## Required Asset List

### Stage / environment

- `ruins_zero_background`
- `ruins_zero_thumbnail`
- ZERO stage select detail panel or existing panel tint update
- ZERO route notice panel if current generic panel is not enough

### Boss

- `ruinsZeroSecondBoss`
- `ruinsZeroSecondBossPortrait`
- `ruinsZeroFinalBoss`
- `ruinsZeroFinalBossPortrait`

### Boss effects

- `ruinsZeroSecondWarningSheet`
- `ruinsZeroSecondAttackSheet`
- `ruinsZeroFinalWarningSheet`
- `ruinsZeroFinalAttackSheet`
- `ruinsZeroSummonGateSheet`

### Stage gimmicks

- `ruinsZeroReactorPulseSheet`
- `ruinsZeroLaserWarningSheet`
- `ruinsZeroLaserBeamSheet`

### Rewards / UI

- `ruins_zero_frame`
- ZERO title frame icon/preview if title select needs a dedicated frame asset
- Research card icons for ZERO route analysis, ideally one reusable ZERO route analysis icon plus route-specific portrait usage

## Files To Touch In Later Steps

Likely implementation files:

- `src/data/run_config.js`
- `src/ui/stage_select_screen.js`
- `src/scenes/play_scene.js`
- `src/save/save_manager.js`
- `src/data/reward_titles.js`
- `src/data/research.js`
- `src/ui/research_screen.js`
- `src/data/evolution_data.js`
- `src/ui/codex_screen.js`
- `src/ui/result_ui.js`
- `src/data/asset_manifest.js`
- `public/assets/stages/`
- `public/assets/bosses/`
- `public/assets/effects/boss/`
- `public/assets/ui/title_frames/`
- `docs/design/`

## Implementation Steps

### Z04-01

Design and investigation.

### Z04-02

Stage definition and route unlock groundwork.

- Remove production `ruins` ZERO lock only when the route is ready.
- Keep debug unlocks available.
- Add reward identifiers and title/frame definitions.

### Z04-03

ZERO background, stage UI, boss, and effect assets.

- Generate dedicated ruins ZERO stage background.
- Generate dedicated phase 2 and final boss assets.
- Generate warning/attack sheets.
- Create contact sheets and edge reports.

### Z04-04

ZERO boss, enemies, and gimmicks.

- Add `ruins` phase 2 / phase 3 explicit configs.
- Add ruins ZERO hazard variants.
- Tune hazard count around readability and iPhone performance.

### Z04-05

ZERO evolution research unlock connection.

- Add research items.
- Add save manager helper for research unlocking ZERO routes.
- Connect result/codex/research display.
- Keep direct clear rewards limited to title/frame/research unlock.

### Z04-06

QA and balance.

- Full route smoke.
- Debug fast route.
- New ZERO route research unlock.
- 7 ZERO evolution unlock research items.
- iPhone high-load soak.

### Z04-07

Main integration prep.

- Version/build/news update.
- Release docs.
- main merge/push only after approval.

## QA Policy

### Route QA

- `ruins` NORMAL/HARD/EXPERT still work.
- `ruins` ZERO stays locked before EXPERT clear.
- `ruins` ZERO unlocks after EXPERT clear.
- `debugAllowRuinsZero=1` continues to work for QA.
- ZERO start / phase / final notices display correctly.

### Boss QA

- Phase 1 uses scaled ruins boss.
- Phase 2 uses dedicated ruins ZERO second boss.
- Phase 3 uses dedicated ruins ZERO final boss.
- Warning guides are visible.
- No fullscreen white residue.
- No fallback boss asset unless intentionally in debug.

### Reward QA

- First ruins ZERO clear grants `ruins_zero_clear` and `ruins_zero_frame`.
- First ruins ZERO clear reveals ZERO route research cards.
- Duplicate ruins ZERO clear does not duplicate title/frame/research unlock state.
- ZERO route research unlocks the selected route only.
- `spinosaurus_zero` and new six ZERO evolutions are not unlocked unconditionally.

### Evolution QA

- ZERO evolution candidate appears only after route research unlock and Lv/adaptation requirements.
- All seven target ZERO evolutions can be unlocked through research in debug QA.
- Codex hidden/known state updates correctly.

### Performance QA

- ZERO ruins short run.
- ZERO ruins final boss debug route.
- ENDLESS regression.
- Companion on/off representative checks.
- iPhone/Safari or iPhone PWA soak recommended.
- Runtime console error/warn 0.
- Whiteout dump does not show growing fullscreen graphics, orphan filters, or context loss.

## Risks

- Adding seven ZERO routes as direct clear rewards would over-reward a single clear.
- Dedicated boss/effect assets can increase memory pressure if sheets are oversized.
- Ruins ZERO beam/pulse hazards can obscure player/projectiles if alpha and warning duration are not tuned.
- Existing `ruins` ZERO debug lock paths can conflict with production unlock if only one side is updated.
- Research card visibility must avoid showing future cards before `ruins` ZERO clear.
- `unlockedZeroRoutes` and `discoveredEvolutions` must stay synchronized for codex/result/evolution UI.
- ZERO route research should not revive researchPt or daily systems.

## Z04-02 Recommendation

Next step should implement only low-risk data plumbing:

1. Add `ruins_zero_clear` title and `ruins_zero_frame` definitions.
2. Add `ruins` to ZERO route reward handling as a research-unlock trigger, not direct route unlock.
3. Add production-safe unlock flag for ruins ZERO route.
4. Keep stage/boss visuals unchanged until Z04-03 assets are ready.
5. Add docs and debug checks before gameplay tuning.
