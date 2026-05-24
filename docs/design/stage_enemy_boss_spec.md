# EVOLUTION ZERO Stage Enemy And Boss Spec

## Purpose

MVP-131 fixes the enemy, boss, and stage identity direction before the next implementation phase.

This document is a design contract only. It does not require enemy or boss asset generation yet.

## Core Rules

- Stages are evolution environments, not only background skins.
- NORMAL / HARD / EXPERT clear by defeating the stage boss.
- ENDLESS is a score and survival mode; it continues until HP reaches 0 or the player exits.
- ZERO is an endgame route with normal boss, second boss, and final boss.
- Special enemy attacks should appear gradually. Low difficulty should teach movement and contact danger first.
- ZERO is unlocked by difficulty progression, not by DNA research.

## Enemy Type Catalog

| Type | Role | Low Difficulty | High Difficulty / ZERO |
| --- | --- | --- | --- |
| swarm | Number pressure | Main baseline enemy | Larger packs, mixed with support threats |
| fast | Chaser | Simple pursuit | Flanking and burst speed variants |
| tank | Durable blocker | Slow pressure | Area denial body, elite guard role |
| shooter | Ranged pressure | Rare or absent | Adds projectile lanes and positioning pressure |
| bomber | Contact / death burst | Absent or rare | Forces spacing and target priority |
| poison | Damage zone / DoT | Stage hint only | Persistent poison fields and slow zones |
| charger | Telegraph rush | Rare late HARD | Clear windup, punishes straight-line retreat |
| elite | Stronger variant | Occasional | Common pressure layer |
| mutant | Special individual | Rare | Patterned abilities and higher rewards |
| apex | Major threat | Boss-adjacent / warning target | ZERO and late EXPERT pressure |

## Stage Enemy Direction

### Jungle

Role: first survival environment, speed and hunting pressure.

Enemy direction:

- Common: small swarm predators that teach kiting.
- Fast: lean raptor-like stalkers that close distance.
- Tank: armored herbivore juveniles used as moving blockers.
- High difficulty additions: ambush fast enemies, limited projectile thorns, elite pack leaders.

Special attacks:

- NORMAL: contact only, fast enemies late in the run.
- HARD: short ambush dash with visible windup.
- EXPERT: thorn spit or temporary root snare from elite variants.
- ZERO: ambush chains mixed with boss summons.

Stage boss: Canopy Devourer

- Giant jungle predator.
- Patterns: leap rush, summon swarm, poison bite or vine-like ground hazard.
- Boss fantasy: being hunted in a dark jungle corridor.

### Volcano

Role: attack pressure, area denial, heavy bodies.

Enemy direction:

- Common: ash swarm enemies with moderate durability.
- Fast: ember runners that move in short bursts.
- Tank: basalt-plated mutants.
- High difficulty additions: lava spit shooters, delayed explosive bombers, quake chargers.

Special attacks:

- NORMAL: heavier contact damage, slower enemies.
- HARD: small lava puddles with short duration.
- EXPERT: delayed eruption markers and bomber death bursts.
- ZERO: layered lava zones with boss quake patterns.

Stage boss: Magma Breaker

- Large lava-mutated ancient organism.
- Patterns: frontal flame, ground crack, delayed eruption circles.
- Boss fantasy: holding ground while the arena heats up.

### Swamp

Role: poison, slow, endurance pressure.

Enemy direction:

- Common: wetland swarm organisms with low speed.
- Fast: leaping amphibian-like predators.
- Tank: bloated toxic bodies.
- High difficulty additions: poison cloud enemies, slow-zone emitters, toxic bombers.

Special attacks:

- NORMAL: slightly slower but more durable enemies.
- HARD: short poison clouds.
- EXPERT: persistent toxic puddles and slow fields.
- ZERO: poison layering that requires repositioning and pickup discipline.

Stage boss: Mire Plague

- Toxic swamp mutation.
- Patterns: poison floor, gas pulse, summon bloated minions.
- Boss fantasy: survival under contamination pressure.

### Ruins

Role: research facility anomaly, mixed enemy patterns, late-stage complexity.

Enemy direction:

- Common: escaped lab organisms.
- Fast: unstable test subjects with erratic movement.
- Tank: armored containment failures.
- High difficulty additions: electromagnetic shooters, laser sweep units, summon nodes.

Special attacks:

- NORMAL: mixed contact enemies with slightly higher baseline pressure.
- HARD: slow projectiles and simple laser tells.
- EXPERT: alternating projectile lanes, summon beacons, electromagnetic pulses.
- ZERO: full anomaly stack with boss mechanics and facility hazards.

Stage boss: Archive Chimera

- Old research facility abnormal organism.
- Patterns: electromagnetic pulse, laser sweep, summon containment nodes.
- Boss fantasy: the facility itself feels alive and hostile.

## Difficulty Scaling Direction

| Difficulty | Enemy HP | Damage | Speed | Density | Variants | Boss |
| --- | --- | --- | --- | --- | --- | --- |
| NORMAL | 1.0x | 1.0x | 1.0x | Standard | swarm / fast / tank | Base boss kit |
| HARD | 1.35x | 1.2x | 1.08x | +15% | adds limited special enemy | More HP, faster pattern |
| EXPERT | 1.8x | 1.45x | 1.15x | +35% | elite / mutant more common | Adds second pattern layer |
| ENDLESS | Scaling over time | Scaling over time | Scaling over time | Scaling over time | expanding pool | repeating bosses |
| ZERO | High baseline | High baseline | High baseline | high but readable | full pool | normal boss + second boss + final boss |

Numbers are initial targets and should be tuned after playtesting.

## ZERO Boss Structure

ZERO is the endgame version of a stage.

Flow:

1. Normal stage boss appears first.
2. Second boss appears after first boss defeat or a strict time gate.
3. Final boss appears after second boss defeat.
4. Final boss defeat triggers ZERO clear.

Second boss role:

- Tests a different axis than the normal boss.
- Example: if the normal boss is melee pressure, second boss uses ranged or field control.

Final boss role:

- Symbolic endpoint for the stage and the game theme.
- Should combine stage identity with abnormal evolution.
- Must be difficult, but readable. Avoid unavoidable damage.

ZERO reward:

- First ZERO clear may discover a new evolution route.
- ZERO route discovery is saved and shown in codex/result.
- ZERO route is not purchased in DNA research.

## Boss Implementation Guardrails

- Boss HP bars must use the existing boss HUD safe-area rules.
- Boss warnings should never overlap evolution notices.
- Boss patterns require readable telegraphs before damage.
- Low difficulty bosses should use fewer patterns with longer tells.
- Bosses may have minions, but minion density must not hide EXP, player, or HUD.
- Boss damage should be dangerous but avoid one-shot deaths outside clearly telegraphed attacks.

## Asset Planning

Future enemy and boss assets should be generated in small batches:

1. One common enemy per stage.
2. One elite/mutant per stage.
3. One boss per stage.
4. ZERO second/final boss set after standard bosses are playable.

Use `#ff00ff` or transparent backgrounds, no text, no logos, and preserve fallback Graphics behavior.

## Next Implementation Candidates

- MVP-135: stage gimmick runtime prototype for volcano/swamp/ruins.
- MVP-136: jungle enemy variants and jungle boss prototype.
- MVP-137: ZERO multi-boss prototype.

## MVP-134 Stage Gimmicks And Drop Items

Stage gimmick direction:

| Stage | Gimmick | Low Difficulty | HARD / EXPERT / ZERO Direction |
| --- | --- | --- | --- |
| jungle | none / weak ambience | no damaging gimmick | keep as baseline readability stage |
| volcano | lava burst, fire floor, ground crack | rare small hazard zones | larger hazard radius, more frequent eruption tells |
| swamp | toxic pool, poison mist, slow zone | small slow pools | poison ticks, larger mist, more slow overlap |
| ruins | electro pulse, laser warning, obstacle field | readable warning lines | pulse fields, laser sweeps, facility hazard combos |

Gimmick assets generated in MVP-134:

- `public/assets/effects/stage_gimmicks/volcano_lava_burst.png`
- `public/assets/effects/stage_gimmicks/volcano_fire_floor.png`
- `public/assets/effects/stage_gimmicks/swamp_poison_mist.png`
- `public/assets/effects/stage_gimmicks/swamp_toxic_pool.png`
- `public/assets/effects/stage_gimmicks/ruins_electro_pulse.png`
- `public/assets/effects/stage_gimmicks/ruins_laser_warning.png`

Drop item direction:

- HP recovery meat / bio-tissue is the first connected item.
- It heals immediately on pickup and uses normal pickup magnet behavior.

## MVP-135 Runtime Gimmick Prototype

Stage gimmicks now use a shared runtime flow:

1. Warning telegraph appears at the hazard position.
2. A short warning duration gives the player time to move.
3. The generated stage-specific effect becomes active.
4. Player-only damage and optional slow/knockback are applied while inside the active area.
5. The hazard expires and is removed.
6. The stage cooldown starts before the next spawn.

Stage behavior:

- `jungle`: no damaging gimmick. It remains the baseline learning stage.
- `volcano`: alternates lava burst circles and short fire-floor zones.
- `swamp`: alternates toxic pools and poison mist. Both can apply light slow and damage ticks.
- `ruins`: alternates electromagnetic pulse circles and laser warning lanes. Active hits may add mild knockback.

Runtime safety rules:

- Damage must always be telegraphed before it becomes active.
- Gimmicks affect only the player in MVP-135.
- Enemies, bosses, EXP, and HUD should not be hidden by full-screen effects.
- Generated PNGs are preferred, with Graphics warning/fallback rendering if assets are not available.

Debug helpers:

- `debugStage=volcano|swamp|ruins` starts a run on that stage.
- `debugGimmicks=1` enables the prototype path for quick checking.
- `debugGimmickFast=1` shortens the first spawn and cooldown for visual QA.

## MVP-138 Volcano Enemy And Boss Runtime

Volcano is the first escalation stage after jungle. It keeps the same readable CLEAR route, but adds fire-stage enemies and a lava boss pattern. Normal enemies are animated sprite sheets, not static PNGs.

Volcano enemy mix:

- `volcanoHeavy`: basalt-armored heavy enemy. It is slower and tougher than swarm and teaches the player to route around durable threats.
- `volcanoBomber`: molten-core bomber. It has a small defeat burst, so players should avoid standing on top of it at the moment of kill.
- `volcanoFast`: ember runner. It applies chase pressure without adding a projectile or unavoidable hit.
- Existing `swarm`, `fast`, and `tank` can still appear as filler, but volcano-specific enemies should carry the stage identity.

Difficulty intent:

- NORMAL: swarm plus `volcanoHeavy`; bomber is rare and readable.
- HARD: bomber and tank weights increase.
- EXPERT: bomber and fast pressure increase, with volcano gimmicks creating movement decisions.

Volcano boss:

- ID: `volcano_ignis_drake`.
- Display name: `イグニス・ドレイク`.
- Runtime visuals: animated 4x4 sprite sheet with static PNG fallback.
- Attack pattern: close-range slam, telegraphed lava burst, and fire-floor zones on HARD/EXPERT.
- CLEAR rule: defeating the boss on NORMAL/HARD/EXPERT uses the same stageProgress, result, and title reward path as jungle.

Safety rules:

- Lava burst and fire floor must have a warning phase before damage.
- Fire floor can linger, but should not cover the screen or hide EXP/HUD.
- Bomber death burst is small and low damage; it is stage flavor, not unavoidable punishment.
- Drop chance should stay low and rise slightly only when player HP is missing.
- Magnet core and DNA cluster are generated as future assets but are not connected in MVP-134.

Drop item assets:

- `public/assets/items/item_meat_heal.png`
- `public/assets/items/item_magnet_core.png`
- `public/assets/items/item_dna_cluster.png`

EXP crystal assets:

- `public/assets/pickups/exp_crystal_small.png`
- `public/assets/pickups/exp_crystal_medium.png`
- `public/assets/pickups/exp_crystal_large.png`

Runtime scope:

- MVP-134 connects EXP crystal display and HP recovery pickup only.
- Stage gimmick effects are registered for future runtime use; current Graphics fallback zones remain safe.
- Any hazard damage must remain readable and must not cover EXP/player/HUD visibility.

## MVP-136 Jungle Enemy And Boss Prototype

Jungle remains the baseline combat stage. It should teach movement, pickup, normal attacks, adaptation skills, and the first boss clear without stage hazards.

Enemy mix:

- `swarm`: main NORMAL enemy. Small, readable, and used to teach basic crowd pressure.
- `fast`: introduced after the opening wave and weighted more on HARD/EXPERT. It creates chase pressure but has no special attack in this pass.
- `tank`: introduced later and weighted more on HARD/EXPERT. It is a durable target, not a special-attacker.

Difficulty intent:

- NORMAL: swarm-heavy, lower pressure, jungle boss has longer charge warning.
- HARD: fast/tank weights increase through existing difficulty modifiers; boss HP and charge pressure rise.
- EXPERT: fast/tank pressure and elite-looking enemies become more common through time-advance and difficulty modifiers; no unavoidable special attacks are added.

Jungle boss prototype:

- ID: `jungle_canopy_devourer`.
- Role: dense forest predator and first clear boss.
- Runtime behavior: chases the player, then uses a telegraphed charge when close enough.
- Telegraph rule: charge must show a visible red/amber lane before movement starts.
- Clear rule: boss defeat marks NORMAL/HARD/EXPERT as `CLEAR` through the existing stage progress/result flow.
- Asset rule: MVP-136 reuses the current boss asset/fallback. Dedicated `jungle_boss.png`, `jungle_boss_warning.png`, and `jungle_boss_attack_effect.png` are future polish candidates.

## MVP-137 Jungle Boss Dedicated Pass

`jungle_canopy_devourer` now uses dedicated generated assets and an animated 4x4 sprite sheet. The static boss PNG remains the fallback when the sheet fails to load.

Generated boss assets:

- `public/assets/enemies/bosses/jungle_canopy_devourer_sheet.png`
- `public/assets/enemies/bosses/jungle_canopy_devourer.png`
- `public/assets/enemies/bosses/jungle_canopy_devourer_portrait.png`

Generated boss effect assets:

- `public/assets/effects/boss/jungle_boss_charge_warning.png`
- `public/assets/effects/boss/jungle_boss_charge_slash.png`
- `public/assets/effects/boss/jungle_boss_roar_wave.png`
- `public/assets/effects/boss/jungle_boss_summon_spore.png`
- `public/assets/effects/boss/jungle_boss_charge_warning_sheet.png`
- `public/assets/effects/boss/jungle_boss_charge_slash_sheet.png`
- `public/assets/effects/boss/jungle_boss_roar_wave_sheet.png`
- `public/assets/effects/boss/jungle_boss_summon_spore_sheet.png`

Attack pattern:

- NORMAL: telegraphed charge plus close-range roar/claw attack.
- HARD: NORMAL pattern plus a small swarm summon.
- EXPERT: faster charge timing plus a slightly larger summon count.

Rules:

- All damage attacks must keep a warning phase before damage begins.
- Close-range roar/claw is a player-only circular hit check.
- Summon creates only a few `swarm` enemies and respects a runtime enemy cap.
- Boss animation uses `idle`, `move`, `attack`, and `death` rows. Attack animations are short and must not block play recovery.
- Boss attack effects prefer illustration-generated clean 4x4 sheets and fall back to static PNGs; Graphics telegraphs are reserved only as last-resort no-asset fallback.
- All boss effect assets must be centered with internal margin and no chroma background or unrelated generated fragments.
- If boss sheet/effect assets fail to load, Graphics telegraphs and the static fallback boss remain available.

## MVP-138b Volcano Runtime Fixes

Volcano must visibly use stage-specific enemies and animated hazard effects. The stage identity should be apparent even during the opening wave.

Volcano enemy display rules:

- `volcanoHeavy`, `volcanoBomber`, and `volcanoFast` use their own animated sprite sheets.
- Volcano spawn weights use a dedicated stage mix instead of relying only on generic enemy types plus small modifiers.
- `debugEnemySet=volcano` or `debugSpawnVolcanoEnemies=1` forces volcano-specific enemies for visual QA.
- Jungle must keep its existing enemy mix and must not receive volcano enemies.

Volcano gimmick animation rules:

- `volcano_lava_burst_sheet.png` and `volcano_fire_floor_sheet.png` are 4x4 animated sheets.
- Static `volcano_lava_burst.png` and `volcano_fire_floor.png` remain cleaned fallback frames.
- Warning is handled by the hazard animation itself at low alpha. The old visible hitbox guide rings are not shown in normal play.
- If an animated sheet is unavailable, the static PNG should still fade in during windup; Graphics fallback is last resort only.
- Volcano stage `fireFloor` uses a 4x4 small-flame cluster. It must not use one large circular hitbox.
- Each of the 16 small flames owns an independent circular hitbox. The visual warning is the 4x4 flame sheet fading/popping in with no damage until the active window.
- The active sheet uses a pop-in animation so the flames swell into view before looping. Damage is applied only after the windup completes.

## MVP-138d Volcano Boss Attack Effect Polish

Ignis Drake boss attacks use recentered static fallbacks plus animated 4x4 sheets. The boss hazard pipeline prefers sheet animation and falls back to static PNG, then to Graphics-only telegraphs.

Volcano boss effect assets:

- `public/assets/effects/boss/volcano_boss_lava_warning.png`
- `public/assets/effects/boss/volcano_boss_lava_warning_sheet.png`
- `public/assets/effects/boss/volcano_boss_lava_burst.png`
- `public/assets/effects/boss/volcano_boss_lava_burst_sheet.png`
- `public/assets/effects/boss/volcano_boss_fire_floor.png`
- `public/assets/effects/boss/volcano_boss_fire_floor_sheet.png`
- `public/assets/effects/boss/volcano_boss_slam_wave.png`
- `public/assets/effects/boss/volcano_boss_slam_wave_sheet.png`

Runtime rules:

- Boss lava warnings show during windup as low-alpha animated/generated effects; visible guide rings are hidden.
- Lava burst and fire floor sheets animate during windup at warning alpha, then continue at active alpha during the damage window.
- Slam wave sheet is used by the boss close-range attack sprite and should stay centered on the boss radius.
- Static PNGs are recentered into 512px frames to prevent edge clipping; sheets use 512px frames with internal margins.
- Damage radius remains driven by boss config for burst-style attacks. Fire-floor damage uses the individual small-flame hitboxes rather than the whole displayed canvas.
- Fire floor uses a 3x3 small-flame cluster. It must not draw or damage as one large circle; each small flame owns an independent circular hitbox.
- Fire floor warning is the 9-flame sheet fading/popping in. The old large warning area and small guide rings are intentionally hidden so the player reads the actual illustrated flames.
- The fire floor sheet uses a short pop-in animation where the 9 flames swell into view, then loop as small active hazards.
- Volcano boss effects are illustration-generated atlas cutouts. Runtime sheets are assembled from those illustrated sources so the active visuals do not look like simple placeholder Graphics.

## MVP-138e Telegraph Visibility Revision

Stage and boss hazards now avoid visible guide circles in normal play. Windup readability comes from the same generated illustration assets that will become active hazards:

- Windup: generated sheet/static effect is visible at low alpha and no damage is applied.
- Active: the same effect reaches full gameplay alpha and damage begins.
- Fire-floor style hazards use per-flame hitboxes; empty transparent canvas/padding is not a damage area.
- Burst/release-style attacks should animate as an emission from the ground or the boss-facing hazard origin rather than as a flat static stamp.
- If image assets fail, Graphics fallback may still draw a simple readable telegraph so the game remains playable, but it should not be the normal presentation.
- Boss-owned attacks follow the same rule: melee, summon, and charge windups should use their generated effect sprites at low alpha. The old circular or rectangular guide shapes are fallback-only when generated assets are unavailable.
- Boss attack ranges are tuned slightly wider than the earliest prototype so the generated effects and actual damage area feel aligned. Jungle and volcano melee/slam radii use a readable medium range, volcano lava burst radii are broader, and boss fire-floor small-flame hitboxes are larger than stage small flames while still avoiding one large invisible circle.

Debug URLs:

- `?debugStage=volcano&debugDifficulty=normal&debugBossFast=1&debugWeakBoss=1`
- `?debugStage=volcano&debugDifficulty=hard&debugBossFast=1&debugWeakBoss=1&debugGimmicks=1`
- `?debugStage=volcano&debugDifficulty=expert&debugBossFast=1&debugWeakBoss=1&debugGimmicks=1`
- `?debugStage=jungle&debugBossFast=1&debugWeakBoss=1`
## MVP-139 Swamp Enemy and Boss Prototype

- `swamp` now follows the jungle/volcano runtime pattern with stage-specific animated enemies, a dedicated boss, difficulty tuning, and boss-defeat CLEAR routing.
- Swamp enemy roles:
  - `swampPoison`: poison mutant that leaves a short-lived toxic pool on defeat.
  - `swampSlow`: heavier restrainer with contact slow pressure.
  - `swampToxicBomber`: toxic burst enemy with a small explosion and lingering toxic pool on defeat.
- Swamp boss:
  - ID: `swamp_miasma_tyrant`
  - Display name: `ミアズマ・タイラント`
  - Theme: large toxic swamp mutation with poison mist, toxic pools, and poison summon pressure.
- Boss attacks:
  - `poisonMist`: animated mist zone with warning fade, continuous damage, and light slow.
  - `toxicPool`: lingering poison pool with warning fade, continuous damage, and slow.
  - `summon`: HARD and EXPERT summon swamp-specific enemies.
- Difficulty rule:
  - NORMAL: poison enemies and readable poison zones.
  - HARD: toxic bomber and summon pressure begin.
  - EXPERT: more toxic bomber, tank mix, larger/denser poison pressure.
- Debug URLs:
  - `?debugStage=swamp&debugDifficulty=normal&debugGimmicks=1&debugGimmickFast=1&debugEnemySet=swamp`
  - `?debugStage=swamp&debugDifficulty=normal&debugBossFast=1&debugWeakBoss=1`
- Jungle and volcano boss routes remain unchanged.

## MVP-140 Ruins Enemy and Boss Prototype

- `ruins` now follows the jungle/volcano/swamp runtime pattern with stage-specific animated enemies, a dedicated boss, difficulty tuning, and boss-defeat CLEAR routing.
- Ruins enemy roles:
  - `ruinsShooter`: old-lab ranged mutant that fires slow electromagnetic shots at mid range.
  - `ruinsElectro`: heavier pulse organism with a short-range electric burst and light slow.
  - `ruinsSummoner`: command/sensor organism that calls a small ruins shooter reinforcement.
- Ruins boss:
  - ID: `ruins_ark_revenant`
  - Display name: `アーク・レヴナント`
  - Theme: old research facility anomaly with biological armor, metal fragments, blue-purple electromagnetic glow.
- Boss attacks:
  - `electroPulse`: animated circular electromagnetic pulse with warning fade, damage, knockback, and light slow.
  - `laserBeam`: animated straight-line laser hazard. The line locks to the spawn origin and does not follow the boss after release.
  - `summon`: HARD and EXPERT summon ruins-specific enemies.
- Difficulty rule:
  - NORMAL: shooter pressure plus readable pulse/laser boss patterns.
  - HARD: electro and summon pressure begin.
  - EXPERT: more lasers/pulses and summoner pressure, still with warning fade before damage.
- Debug URLs:
  - `?debugStage=ruins&debugDifficulty=normal&debugGimmicks=1&debugGimmickFast=1&debugEnemySet=ruins`
  - `?debugStage=ruins&debugDifficulty=normal&debugBossFast=1&debugWeakBoss=1`
- Jungle, volcano, and swamp routes remain unchanged.

## MVP-140b Effect Sheet Display Rule

- Boss and stage effect assets ending in `_sheet.png` must never be displayed as one full atlas image.
- Manifest metadata is flattened so both stage gimmicks and boss effects expose `spriteSheet`, `sheet`, and `animations` at the same level.
- `4x4` sheets are split into 16 frame textures. `3x3` sheets should be split into 9 frame textures if added later.
- Static PNGs are fallback only; Graphics telegraphs remain last resort.
- Multi-object hazards should prefer smaller natural hitboxes over one invisible large circle:
  - fire floors: scattered flame hitboxes,
  - toxic pools: clustered pool hitboxes,
  - laser beams: line/rectangle hit area,
  - electro pulses: visible pulse area with warning fade and active damage only after windup.
- Fire/toxic cluster hitboxes use slight deterministic offsets and size variation to avoid a rigid grid appearance while keeping the warning/active positions stable.

## MVP-140c Visual QA Adjustments

- Swamp and ruins stage gimmicks now use animated sheet entries where possible instead of staying on static PNGs:
  - `stageGimmicks.swampPoisonMistSheet`
  - `stageGimmicks.swampToxicPoolSheet`
  - `stageGimmicks.ruinsElectroPulseSheet`
  - `stageGimmicks.ruinsLaserBeamSheet`
- These entries currently reuse the cleaned boss-effect sheets as stage-sized animated effects, with the original stage PNGs kept as static fallback.
- Boss melee, summon, and charge windup sprites were softened so they read as low-alpha warning animation rather than hard gameplay guide rings.
- Browser QA covered ruins gimmick/boss, volcano boss/gimmick, swamp boss/gimmick, and jungle boss routes. No atlas-as-one-image rendering or runtime console errors were observed during the QA pass.
- Remaining polish: enemy/APEX rings can still look like large circular guides when large enemies are partially offscreen; that is a separate enemy-label/ring presentation issue, not a sheet split failure.

## MVP-140d Ruins Asset Quality Pass

- Ruins enemies were regenerated as illustrated biomechanical research-facility mutants:
  - `ruinsShooter`: thin ranged electromagnetic creature with a cannon-like glowing organ.
  - `ruinsElectro`: heavier pulse carrier with a visible electric core.
  - `ruinsSummoner`: anomaly/summon type with lab fragments and a blue-purple core.
- `アーク・レヴナント` was regenerated as a larger biomechanical boss with floating fragments, lab armor, and stronger blue-purple electromagnetic identity.
- Ruins boss effects were regenerated and kept as frame-split sheets:
  - electro pulse,
  - laser warning,
  - laser beam,
  - summon field.
- Ruins stage gimmicks now have dedicated stage copies for electro pulse, laser warning, and laser beam sheets, while preserving static PNG fallback.
- QA rule remains unchanged: warning frames have no damage, active frames carry the configured line/circle/cluster hit area, and `_sheet.png` files must never render as one atlas image.

## MVP-141 Four Stage Pre-ZERO QA

Browser QA covered the four standard stages before ZERO implementation:

- `jungle`: dedicated jungle enemy/boss route starts, Canopy Devourer appears, and boss defeat reaches CLEAR.
- `volcano`: volcano-specific enemies, animated gimmicks, Ignis Drake, and boss-defeat CLEAR route remain connected.
- `swamp`: swamp-specific enemies, toxic effects, swamp boss, and boss-defeat CLEAR route remain connected.
- `ruins`: ruins-specific enemies, electro/laser gimmicks, Ark Revenant, and boss-defeat CLEAR route remain connected.

Difficulty smoke checks:

- NORMAL / HARD / EXPERT startup routes were checked for all four stages with debug stage and weak-boss helpers.
- No runtime console error/warn entries were observed in the checked routes.
- Difficulty settings are structurally separated by stage. HARD and EXPERT add more pressure through enemy weights, boss timing, and gimmick settings, but no immediate startup breakage was found.

Gimmick QA notes:

- Warning visuals remain low-alpha generated effects and should not apply damage.
- Active windows carry the configured circle, line, or clustered small-object hitboxes.
- No `_sheet.png` atlas was observed rendering as a full 4x4 sheet during the QA pass.
- APEX/enemy rings can still visually resemble guide rings when large actors are partly offscreen; keep this as final presentation polish rather than a hitbox bug.

Boss timing note:

- `debugBossFast=1` is intentionally fast at about 8 seconds for CLEAR-route QA.
- Normal boss timing remains about 60 seconds. A no-`debugBossFast` check reached about 24 seconds without a boss spawn, leaving room for EXP, adaptation skill, and evolution growth before the boss phase.

Pre-ZERO remaining polish:

- Review chromakey and cell-edge candidates in `docs/assets/chromakey_cleanup_candidates_mvp141.md`.
- Consider a final pass on APEX ring readability so it does not look like an attack-range guide.
- Continue tuning boss spawn timing through playtests; 60 seconds is the current baseline, but stage-specific targets can be introduced later if needed.

## MVP-142 Chromakey Cleanup QA

- MVP-141 chromakey candidates were visually triaged before cleanup. The candidate list contains false positives such as UI neon frames, intentional cyan fringes, and purple electromagnetic/poison glow.
- Cleanup was limited to gameplay sprites where chromakey remnants can appear as visible garbage during animation:
  - swamp enemies and swamp boss assets,
  - ruins enemies and ruins boss assets.
- Effect sheets were not destructively cleaned in this pass when their magenta-like pixels are part of the intended stage identity.
- Sprite cleanup preserves sheet dimensions and cell layout. Cell-edge cleanup should remove only weak debris and chromakey-colored contamination, not opaque body pixels.
- Before/after contact sheets and a JSON report are stored under `docs/assets/`.
- Runtime smoke QA after cleanup covered jungle, volcano, swamp, and ruins normal debug routes with no console errors or warnings observed.

Future asset production rule:

- Prefer transparent or clean chromakey backgrounds with generous per-cell padding.
- Avoid placing body parts on sprite sheet cell borders.
- Keep intentional neon glow distinguishable from chromakey colors by using lower saturation or non-pure magenta/cyan where possible.
- Regenerate rather than over-clean when chromakey color is embedded inside the subject or another frame's body parts are visible.

## MVP-142b Effect Candidate Review

- Boss and stage effect sheets with purple/cyan detections were reviewed visually instead of color-cleaned automatically.
- Most ruins/swamp purple/cyan candidates remain intentional effect color: electromagnetic pulse, laser, poison mist, toxic pool, summon field, or warning glow.
- Color cleanup is not safe for these effects because it can remove the readable gameplay shape itself.
- The correct fix for effect issues is individual regeneration or canvas-safe re-layout when there is visible clipping, unrelated fragments, or a hitbox/visual mismatch.
- `burst_fang_mine.png` and `burst_fang_explosion.png` were treated separately from boss/stage effects because they are adaptation skill effects and had visible edge pressure. Both were regenerated and centered inside their existing canvas sizes.

## MVP-142b High-Ratio Effect and Boss Portrait Pass

- Residual-color candidates were re-ranked by the ratio of near-magenta pixels to visible pixels. This highlighted ruins laser warning/beam effects and swamp poison warning/summon/mist effects.
- These high-ratio gameplay effects were regenerated individually with cleaner palettes and safer padding instead of color-threshold cleanup.
- Ruins laser warning/beam replacements use restrained violet/blue-white glow and avoid pure chromakey magenta while keeping the readable warning/active distinction.
- Swamp poison warning, summon spore, and poison mist replacements use toxic green/yellow-green as the primary visual language, with muted violet accents only where needed.
- `swamp_boss_portrait.png` and `ruins_boss_portrait.png` were regenerated to improve boss archive/result readability.
- `swamp_boss_sheet.png` was not fully regenerated, but each 4x4 cell was safely relaid out with more horizontal and vertical padding to reduce animation clipping.
- Runtime keys and fallback keys remain unchanged.
## MVP-142c boss sheet cell safety

- Swamp and ruins boss sheets are rebuilt from single clean side-view boss cutouts.
- Direct generated 4x4 boss sheets are not preferred for final boss animation when visible parts cross cell boundaries.
- Each runtime boss sheet cell should preserve internal padding and avoid touching the 256x256 cell edge.
- The tradeoff is subtler animation, but it prevents clipped tails, floating parts, and neighboring-cell contamination.
# MVP-143b swamp / ruins boss animation completion

- `swamp_boss_sheet.png` and `ruins_boss_sheet.png` use a cell-safe differential animation approach.
- Each 4x4 sheet keeps the same semantic rows:
  - Row 1: idle breathing / light pulse
  - Row 2: move bob / lateral motion
  - Row 3: attack lunge / emission
  - Row 4: death collapse / fade
- The boss subject must stay inside each 256x256 cell with safe padding. `frameEdgeIssues: 0` is required in the generated report.
- Full 4x4 direct generation is not preferred for these bosses unless each frame is separately validated, because earlier output had cell overflow and visible clipping.
- Swamp boss animation direction:
  - heavy breathing
  - poison mist leakage
  - spore / slime pulse
  - slow collapse with toxic particles
- Ruins boss animation direction:
  - electromagnetic pulse
  - floating part movement
  - laser / electro attack emission
  - collapse with light decay
# MVP-143c bulk 4x4 boss sheet rule

- Swamp and ruins bosses now prefer a full 4x4 bulk-generated sheet when the generated sheet passes QA.
- Bulk generation is allowed only when postprocess confirms:
  - each cell contains one complete boss
  - no body part crosses cell boundaries
  - no adjacent-cell contamination remains
  - `frameEdgeIssues` is 0
  - bottom-right / death frames do not become unintentionally transparent
  - all rows keep visible animation differences
- The postprocess may scale and re-center each generated cell inside the 256x256 safe area, but it must not collapse the sheet into the older static-placement look.
- If a bulk sheet fails bbox or alpha checks, discard it and regenerate rather than forcing alpha correction.

# MVP-143c add QA: boss move row

- Swamp boss Row 2 was inspected as a ground movement row. The adopted sheet shows body, head, leg, and tail position differences, so it reads as heavy walking rather than a pure vertical bob.
- Small detached artifacts in the swamp move row were removed as likely adjacent-cell contamination.
- Ruins boss Row 2 was inspected as a hovering movement row. Walking feet are not required; floating parts, glow cores, and mechanical body pose changes are the primary motion cues.
- Boss runtime animation selection remains:
  - moving boss velocity greater than threshold: `move`
  - low movement: `idle`
  - attack states: `attack`
  - defeat: `death`
