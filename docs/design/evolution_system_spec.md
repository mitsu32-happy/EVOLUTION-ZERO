# EVOLUTION ZERO Evolution System Spec

## Purpose

This document fixes the pre-implementation rules for branch evolution, ultimate skills, ZERO reward routes, and cross-screen usage before the next implementation MVPs.

Evolution in EVOLUTION ZERO is not a permanent dinosaur level and not a straight staged evolution tree. It is a one-run branch reached through the player's temporary adaptation build.

## Core Rules

- Evolution is a one-run arrival point.
- Evolution branches are tied to adaptation tags and the current run build.
- Evolution is not unlocked by permanent dinosaur level.
- Evolution candidates are shown as branch discoveries, not as a single linear path.
- Ultimate skills are hidden before evolution and become available only after choosing an evolution branch.
- ZERO reward branches are discovered through ZERO clear rewards, not through DNA research.

## Evolution Conditions

Baseline condition for normal branches:

- Reach the run's evolution-ready timing.
- Accumulate the branch's primary adaptation tag enough times.
- Prefer at least one owned adaptation skill matching that branch.
- Optional stage affinity may increase hint strength, but should not hard-lock early MVP branches.

Recommended MVP condition:

- `primaryTagCount >= 3`
- player has at least one adaptation skill with that tag
- player reaches the existing evolution candidate timing

ZERO branches:

- Hidden until the matching ZERO reward route is discovered.
- Require ZERO route discovery in persistent data.
- During a run, require the normal branch's primary tag plus a secondary stress condition such as boss defeat, long survival, or ZERO stage pressure.

Forbidden wording:

- Lv
- evolution level
- permanent dinosaur level
- stage 1 / stage 2 / final evolution as a straight line

## Dinosaur Branch Plan

### Velociraptor

| Branch | Tag | Evolution Name | Visual Concept | Condition | Performance Change | Ultimate |
| --- | --- | --- | --- | --- | --- | --- |
| Speed | speed | ファルクス | Lean body, cyan afterimages, sharpened claws, high-speed posture | speed adaptation focus, one speed skill owned | faster movement, shorter normal attack rhythm, lower durability | 迅影連爪: rapid multi-slash through nearby enemies |
| Hunting | hunting | ノクスヴェナ | Amber eye glow, tracking spines, predatory stance | hunting adaptation focus, one hunting skill owned | better target acquisition, pickup/mark synergy, balanced damage | 追跡狩猟: marks targets and launches homing strikes |
| Attack | attack | ヴォルグラム | Red-orange jaw and claw mutation, aggressive forward pose | attack adaptation focus, one attack skill owned | stronger frontal damage, wider claw shock, slower recovery | 衝撃咆哮: frontal shock roar with knockback |
| ZERO | zero | 死線ラプトル | Black/cyan abnormal predator, fractured DNA glow, scars from ZERO pressure | ZERO raptor route discovered, high adaptation pressure in ZERO mode | burst mobility and risky high output, reduced safety margin | 死線疾走: invulnerable dash slashes followed by a rupture wave |

Codex copy direction:

- Speed: "高速適応で筋繊維が再配列され、残像を伴う連続狩猟へ特化した分岐。"
- Hunting: "捕食本能と索敵反応が増幅し、獲物を逃さない追跡型へ変異した分岐。"
- Attack: "咆哮と牙の衝撃が肥大化し、前方制圧を得意とする分岐。"
- ZERO: "死線環境でのみ観測される異常分岐。生存限界を超えた速度を得る。"

### Triceratops

| Branch | Tag | Evolution Name | Visual Concept | Condition | Performance Change | Ultimate |
| --- | --- | --- | --- | --- | --- | --- |
| Speed | speed | 突進トリケラ | Streamlined horns, cyan kinetic rails, charging silhouette | speed adaptation focus, one speed skill owned | faster charge movement, short burst reposition, moderate defense | 加速角突: straight-line horn rush with impact trail |
| Hunting | hunting | 追跡トリケラ | Amber sensory frill, ground-vibration detector, sturdy hunter | hunting adaptation focus, one hunting skill owned | trap/mark resistance, wider pickup and enemy detection | 地脈捕捉: pulses through ground and damages marked enemies |
| Attack | attack | 破城トリケラ | Massive armored frill, red impact cracks, low heavy stance | attack adaptation focus, one attack skill owned | high knockback, wide horn shock, slower speed | 角衝震砕: huge frontal quake and armor-breaking impact |
| ZERO | zero | 要塞トリケラ | Bone-plated fortress body, black-gold ZERO scars, red warning glow | ZERO triceratops route discovered, ZERO pressure condition | extreme control and survival, slowest movement | 絶界角陣: deploys a defensive shock field that crushes nearby enemies |

Codex copy direction:

- Speed: "重量を保ったまま突進筋が異常発達し、瞬間的な制圧力を得た分岐。"
- Hunting: "フリル器官が索敵端末のように変質し、地表振動から獲物を読む分岐。"
- Attack: "角と骨格が破城槌のように肥大化し、群れを押し返す分岐。"
- ZERO: "ZERO環境で観測される要塞型分岐。生存と制圧を極端に高める。"

### Tyrannosaurus

| Branch | Tag | Evolution Name | Visual Concept | Condition | Performance Change | Ultimate |
| --- | --- | --- | --- | --- | --- | --- |
| Speed | speed | 斬速ティラノ | Long-leg acceleration, cyan jaw streaks, agile predator | speed adaptation focus, one speed skill owned | heavy body with improved turn response, faster bite rhythm | 加速噛砕: high-speed bite chain toward the facing direction |
| Hunting | hunting | 捕食ティラノ | Amber predator eyes, sensory jaw plates, pursuit posture | hunting adaptation focus, one hunting skill owned | stronger elite/boss tracking, better single-target pressure | 頂点捕食: locks onto a target and delivers repeated fang strikes |
| Attack | attack | 暴君ティラノ | Red-orange throat glow, enlarged jaw, shockwave roar | attack adaptation focus, one attack skill owned | highest damage, broad shock attacks, longest recovery | 暴君咆哮: massive roar cone with fire/shock afterburst |
| ZERO | zero | 絶滅王ティラノ | Black-red apex mutation, fractured bone crown, catastrophic jaw | ZERO tyrannosaurus route discovered, ZERO pressure condition | destructive boss-killer, risky cooldown windows | 絶滅噛砕: large delayed bite rupture that devastates bosses |

Codex copy direction:

- Speed: "巨体を支える腱が高速化し、重い噛みつきを連続化した分岐。"
- Hunting: "捕食器官が鋭敏化し、単体の強敵を逃さない頂点捕食型分岐。"
- Attack: "咽頭と顎が異常発達し、咆哮と噛砕で周囲を破壊する分岐。"
- ZERO: "ZEROの死線でのみ記録される終末捕食者。撃破報酬として発見される。"

## Ultimate Skill Rules

Ultimate skills:

- Are manually activated.
- Are hidden before evolution.
- Use the selected evolution branch to choose icon and effect.
- Consume the ultimate gauge.
- Must not replace normal attacks or adaptation skills.
- Should be strong enough to feel like evolution, but limited by cooldown/gauge.

Recommended shared baseline:

- Gauge: 100
- Duration: 1.2 to 2.0 seconds
- Use one strong hit or a short burst, not a long screen-clearing loop.
- Boss damage should be meaningful but not instantly end high-difficulty bosses.

## Ultimate Asset Direction

Each evolution branch needs:

- `special_<dino>_<branch>.png` icon, text-free, transparent.
- Short effect texture or sprite sequence.
- Optional HUD portrait derived from the branch hero.

The icon should read at 64px and use branch colors:

- speed: cyan / blue-white
- hunting: amber / gold
- attack: red-orange
- ZERO: black, white, red warning, rare gold accents

## Evolution Image Direction

Branch hero images are the source master.

Recommended paths:

- `public/assets/dinos/evolutions/heroes/<dino>_<branch>_hero.png`
- `public/assets/dinos/evolutions/portraits/<dino>_<branch>_portrait.png`

Rules:

- Front-facing to slightly left-facing.
- Camera-facing, threatening pose.
- Face, eyes, teeth, horns, claws, and unique mutation should read clearly.
- Transparent PNG preferred.
- Reuse hero images for codex, home favorite display, dino detail, result, and future reward screens.
- Derive portraits by crop / padding / tone adjustment. Avoid generating unrelated one-off portraits unless needed.

## ZERO Reward Evolution Routes

ZERO reward routes are persistent discoveries.

Rules:

- ZERO clear can reveal one new special route for the selected dinosaur or stage family.
- Before discovery, codex shows `???`, `未解析`, and a ZERO hint.
- After discovery, codex shows name, silhouette/hero, condition hint, and ZERO reward badge.
- Discovery unlocks visibility and future run eligibility. It is not a DNA research purchase.

Recommended first ZERO route order:

1. Selected dinosaur's ZERO branch.
2. Stage-specific rare route.
3. Later cross-tag hybrid route.

ZERO routes should support the title subtitle:

- "進化は、死線の先にある"

## Codex Integration

Codex should show each dinosaur as:

- Origin card
- Three normal branch cards: speed / hunting / attack
- One ZERO branch card, hidden as `???` until discovered

Cards must not look like a vertical stage ladder. Use branch markers, side lines, or a radial/list hybrid to show all branches originate from the base dinosaur.

## Home Integration

Home favorite dinosaur display should eventually accept:

- base dinosaur hero
- discovered evolution hero
- ZERO evolution hero after discovery

Default remains base dinosaur until the player chooses otherwise. Undiscovered ZERO routes must not be selectable for home display.

## Result Integration

Result screen should support:

- selected evolution branch
- newly discovered evolution route
- ZERO reward route discovery
- title reward and title frame

Stage clear by boss defeat should be `CLEAR`.
HP0 or sortie end should be `GAME OVER`.
ZERO clear should be `ZERO RESULT`.

## Next MVP Candidates

- MVP-120: generate and register hero/portrait assets for the nine normal evolution branches.
- MVP-121: implement branch-specific evolution data per dinosaur and codex discovery state.
- MVP-122: implement branch-specific ultimate data and effects.
- Future MVP: implement ZERO reward route discovery and result/codex/home unlock display.

## MVP-120 Velociraptor Asset Connection

- Velociraptor speed / hunting / attack branches now have generated shared hero images under `public/assets/dinos/evolutions/heroes/`.
- Matching portrait crops live under `public/assets/dinos/evolutions/portraits/` and are used for HUD and result-style small displays.
- Raptor-specific special icons live under `public/assets/ui/hud/special_icons/` and should be preferred over generic speed / hunting / attack special icons for velociraptor evolutions.
- ZERO branch remains undiscovered in this MVP and uses `public/assets/dinos/evolutions/zero_unknown_silhouette.png`.
- This MVP does not add evolution sprite sheets, branch performance changes, or real ultimate effects. Those remain future implementation work.

## MVP-121 Evolution Discovery Persistence

- `discoveredEvolutions` is normalized to an object keyed by branch id such as `velociraptor_speed`.
- Old array saves are read and converted with `velociraptor` as the fallback dinosaur id for legacy tag-only entries.
- A branch is recorded as discovered when a run ends with `gameState.selectedEvolution` present. Game over and sortie end still preserve the discovery.
- Each discovery entry stores `id`, `dinoId`, `tag`, `evolutionName`, `mutationName`, and `discoveredAt`.
- ZERO branches use the same key scheme, for example `velociraptor_zero`, but remain hidden/unknown until a future ZERO clear reward writes that key.

## MVP-122 Evolution Arrival Presentation

- Evolution selection now starts a short run-time presentation immediately after the branch is selected.
- The presentation lasts about 1.4 seconds and uses a dark DNA overlay, branch color, evolution name, evolution portrait, and a compact codex update chip.
- Branch colors remain speed cyan, hunting amber, and attack red-orange.
- First-time branch discovery is saved at evolution selection time so game over, sortie end, and retry still preserve discovery.
- Result recording keeps the first discovery as `newEvolutionRoute` even though the branch was already saved during the run.
- Debug checks:
  - `?debugForceEvolution=speed|hunting|attack` applies the evolution, records discovery, and plays the presentation.
  - `?debugEvolution=speed|hunting|attack&debugEvolutionDemo=1` applies the debug evolution and plays the presentation without using it as a normal progression route.
- Full evolution sprite sheets, ultimate activation behavior, and ZERO route implementation remain future work.

## MVP-123 Evolution Presentation Asset Pass

- The evolution arrival presentation now prefers dedicated UI assets under `public/assets/ui/evolution/` before using Pixi Graphics fallback.
- The presentation frame uses:
  - `evolution_panel.png`
  - `evolution_name_plate.png`
  - `evolution_portrait_frame.png`
  - `evolution_dna_ring.png`
- Tag-colored flash layers are branch-specific:
  - speed: `evolution_flash_speed.png`
  - hunting: `evolution_flash_hunting.png`
  - attack: `evolution_flash_attack.png`
- First-time discovery uses `codex_update_chip.png` and `new_evolution_chip.png` as text-free chip backgrounds. Text remains code-rendered.
- The total presentation length remains short, about 1.4 seconds, to preserve battle tempo.
- Missing assets must not block evolution. If any dedicated asset fails, the existing dark overlay, DNA lines, panel, and chip Graphics fallback remains active.
- This pass does not add evolution sprite sheets, ultimate activation behavior, or ZERO branch implementation.

## MVP-124 Velociraptor Evolution Sprite Sheets

- Velociraptor speed / hunting / attack branches now have 4x4 evolution sprite sheets under `public/assets/dinos/evolutions/sheets/`.
- Generated raw sheets are archived under `docs/assets/generated_raw/` and postprocess reports are saved as:
  - `docs/assets/velociraptor_speed_sheet_mvp124_report.json`
  - `docs/assets/velociraptor_hunting_sheet_mvp124_report.json`
  - `docs/assets/velociraptor_attack_sheet_mvp124_report.json`
- Runtime sheet selection happens after evolution selection by branch tag:
  - speed -> `evolutionSheets.velociraptorSpeed`
  - hunting -> `evolutionSheets.velociraptorHunting`
  - attack -> `evolutionSheets.velociraptorAttack`
- If an evolution sheet fails to load, the player falls back to the base velociraptor sprite sheet and play continues.
- The current pass only changes the visible player sheet. Ultimate behavior and branch-specific evolution combat kits remain future work.
- Display names were tightened without changing internal ids:
  - `velociraptor_speed` -> `ファルクス`
  - `velociraptor_hunting` -> `ノクスヴェナ`
  - `velociraptor_attack` -> `ヴォルグラム`

## MVP-124b Front Hero / Portrait Refresh

- Base triceratops and tyrannosaurus hero / portrait assets were regenerated to match the front-facing velociraptor detail art direction.
- Velociraptor speed / hunting / attack evolution hero and portrait assets were also refreshed from front-facing generated masters.
- These hero images remain the shared master source for dino select detail, home favorite display, codex cards, result display, and HUD portrait crops.
- Keep contain-style placement for these assets. Do not stretch width and height independently, and do not bake frames or shadows into the source art.

## MVP-125 Velociraptor Branch Specials

- Velociraptor branch display names remain fully katakana while internal ids stay stable:
  - `velociraptor_speed`: `ファルクス`
  - `velociraptor_hunting`: `ノクスヴェナ`
  - `velociraptor_attack`: `ヴォルグラム`
- Manual specials are unlocked only after a branch evolution is selected. Unevolved runs must not show the special button.
- Special readiness uses the existing `ultimateGauge` / `ultimateReady` flow. Activating a special resets the gauge to 0 and starts cooldown.
- Implemented branch specials:
  - speed: `高速爪撃`, short multi-hit slashes around nearby enemies with cyan generated slash effects.
  - hunting: `追尾狩猟`, multiple amber pursuit strikes against nearby targets with generated hunting swarm effects.
  - attack: `衝撃咆哮`, a high-damage forward shock burst with red-orange generated impact effects and strong knockback.
- `?debugForceEvolution=speed|hunting|attack` remains the primary verification route and starts with the special ready for short checks.
- Missing special effect assets fall back to the existing Pixi Graphics slash / ring / shock effects, and play must continue.

## MVP-126 Velociraptor Special Balance Baseline

- Velociraptor branch specials define the first standard for manual post-evolution skills.
- The special button remains hidden before evolution and appears only after `selectedEvolution` exists.
- Activating a special consumes the whole gauge and sets `ultimateGauge` back to 0.
- Gauge gain is intentionally moderate:
  - swarm defeat: +4
  - fast defeat: +7
  - tank defeat: +12
  - boss defeat keeps the larger existing bonus
  - evolved runs also gain a small passive trickle so a long run can still reach a special without constant kills
- `?debugSpecialReady=1` and `?debugUltimateBalance=1` force a ready gauge for short verification only.

Branch roles:

- `velociraptor_speed` / `ファルクス`: medium-area rapid multi-slash. Strong momentary mob clear, medium boss damage through a low boss multiplier.
- `velociraptor_hunting` / `ノクスヴェナ`: multiple amber pursuit pulses. Easiest to connect with distant enemies, lower per-hit damage, hunting-style target acquisition.
- `velociraptor_attack` / `ヴォルグラム`: wide roar burst with heavy knockback. Best crowd control and largest visual impact, but boss damage is strongly reduced.

Boss balance:

- Specials may be satisfying against bosses, but should not delete high-difficulty bosses.
- Each branch can define `bossDamageMultiplier`; MVP-126 uses lower multipliers for speed/attack and a moderate multiplier for hunting.
- Knockback against bosses is also softened so boss positioning does not become unstable.

Effect timing:

- Speed uses repeated short slash ticks.
- Hunting uses several pursuit pulses across the duration.
- Attack uses a main shock plus weaker aftershocks.
- Effects should stay readable over the battlefield and avoid fully covering HUD, EXP, or enemy silhouettes.

## MVP-127 Triceratops Evolution Branches

MVP-127 extends the velociraptor evolution implementation pattern to the triceratops lineage.

Final display names:

- `triceratops_speed`: `セラヴェル`
- `triceratops_hunting`: `セラノクス`
- `triceratops_attack`: `グランボルグ`

Runtime assets:

- Heroes: `public/assets/dinos/evolutions/heroes/triceratops_<branch>_hero.png`
- Portraits: `public/assets/dinos/evolutions/portraits/triceratops_<branch>_portrait.png`
- Sprite sheets: `public/assets/dinos/evolutions/sheets/triceratops_<branch>_sheet.png`
- Special icons: `public/assets/ui/hud/special_icons/special_<branch>_triceratops.png`
- Special effects: `public/assets/effects/specials/special_triceratops_<branch_role>.png`

Special behavior:

- Speed / `ホーンラッシュ`: forward charge lane. Strong against dense normal enemies, boss damage reduced.
- Hunting / `バスティオンホーン`: defensive horn field. Periodic area retaliation around the player.
- Attack / `クエイクラム`: wide quake pulse. Heavy knockback and crowd control, boss damage reduced.

Debug checks:

- `?debugDino=triceratops&debugForceEvolution=speed&debugSpecialReady=1`
- `?debugDino=triceratops&debugForceEvolution=hunting&debugSpecialReady=1`
- `?debugDino=triceratops&debugForceEvolution=attack&debugSpecialReady=1`

## MVP-128 Tyrannosaurus Evolution Branches

MVP-128 extends the same evolution implementation pattern to the tyrannosaurus lineage.

Final display names:

- `tyrannosaurus_speed`: `レグナクス`
- `tyrannosaurus_hunting`: `ヴェナトロス`
- `tyrannosaurus_attack`: `レクスヴォルグ`

Runtime assets:

- Heroes: `public/assets/dinos/evolutions/heroes/tyrannosaurus_<branch>_hero.png`
- Portraits: `public/assets/dinos/evolutions/portraits/tyrannosaurus_<branch>_portrait.png`
- Sprite sheets: `public/assets/dinos/evolutions/sheets/tyrannosaurus_<branch>_sheet.png`
- Special icons: `public/assets/ui/hud/special_icons/special_<branch>_tyrannosaurus.png`
- Special effects: `public/assets/effects/specials/special_tyrannosaurus_<branch_role>.png`

Special behavior:

- Speed / `プレデターダッシュ`: predator pounce lane. Burst damage along the facing direction.
- Hunting / `テラーハント`: pursuit terror pulses. Hunting-style target acquisition with restrained boss damage.
- Attack / `デヴァウアバースト`: devour shock burst. Strongest crowd-control burst, boss damage reduced.

Debug checks:

- `?debugDino=tyrannosaurus&debugForceEvolution=speed&debugSpecialReady=1`
- `?debugDino=tyrannosaurus&debugForceEvolution=hunting&debugSpecialReady=1`
- `?debugDino=tyrannosaurus&debugForceEvolution=attack&debugSpecialReady=1`

Implementation rule:

- All branch ids remain stable for save compatibility.
- Display names may be adjusted, but `discoveredEvolutions` keys must stay `<dinoId>_<tag>`.
- If branch-specific sheets, portraits, or special effects fail to load, the runtime must fall back to base dinosaur visuals or generic branch effects without hiding the player.

## MVP-129 Dedicated Evolution Asset Rule

MVP-129 adds a visual identity QA pass for all normal evolution branches.

- Dedicated evolution art is required for each branch. A branch is not considered final if it is only the base dinosaur with hue/tint changes.
- Hero and portrait QA focuses on front-facing identity: evolved head shape, eyes, jaw/horns/frill, armor, posture, and branch glow must visibly differ.
- Sprite sheet QA focuses on playable silhouette: the side-view body shape must differ enough to read during movement at mobile size.
- Special icon QA focuses on branch-specific ultimate meaning, not generic color-coded dinosaur faces.
- Special effect QA focuses on the actual ultimate behavior: speed charge/slash, hunting pursuit/defense, attack quake/devour, etc.

MVP-129 replacements:

- Triceratops and tyrannosaurus hero/portrait masters were regenerated from branch-specific contact sheets.
- Tyrannosaurus speed/hunting/attack sprite sheets were regenerated and postprocessed because the previous sheets were too close to color variants.
- Triceratops and tyrannosaurus special icons/effects were regenerated as dino-specific assets.

The velociraptor branch ids and display names remain unchanged. `discoveredEvolutions` continues to use stable ids, so replacing art assets does not affect save compatibility.

## MVP-130 Evolution Display Name Rule

- Evolution branch ids remain stable (`<dinoId>_<tag>`) for save compatibility.
- Display names may be renamed freely as UI-facing text. Runtime normalization should prefer the current branch master data over old saved `evolutionName` strings so existing saves adopt the newest display names.
- MVP-130b display names:
  - Velociraptor: `ファルクス`, `ノクスヴェナ`, `ヴォルグラム`
  - Triceratops: `セラヴェル`, `セラノクス`, `グランボルグ`
  - Tyrannosaurus: `レグナクス`, `ヴェナトロス`, `レクスヴォルグ`
- Names should be short, readable in HUD/codex/result/home, and should feel like memorable evolved species names without exposing internal tag labels such as `speed` or `高速適応`.
- MVP-130 refreshed `tyrannosaurus_attack` hero/portrait because the previous generated master looked visually clipped on the left side.

## MVP-130b Evolution Naming And Home Order

- Branch ids and save keys stay unchanged. Only `evolutionName` / display text may change.
- Avoid repeated suffix templates such as `<branch word>ラプス`, `<branch word>ケラ`, or `<branch word>レクス` for every branch. Names should read as individual evolved species while staying fully katakana.
- Home favorite selection order is lineage-first and branch-order stable:
  - Velociraptor base -> speed -> hunting -> attack
  - Triceratops base -> speed -> hunting -> attack
  - Tyrannosaurus base -> speed -> hunting -> attack
- ZERO branches are not included in normal home selection until a future ZERO discovery route explicitly enables them.

## MVP-144 ZERO route receptacle

- ZERO clear can unlock a future evolution route key in `unlockedZeroRoutes`.
- MVP-144 stores route discovery only; it does not generate or connect dedicated ZERO evolution art.
- Route key convention: `<dinoId>_zero`.
- The ZERO route is unlocked by ZERO difficulty clear, not by research.
- The first implementation uses the route receptacle for result/reward messaging and future codex/home integration.

## MVP-145 ZERO route result display

- ZERO clear result can display `新規進化ルート` discovery when `unlockedZeroRoutes` receives a route key.
- Route keys stay future-facing and use the existing `<dinoId>_zero` convention.
- MVP-145 does not generate or connect ZERO evolution hero, portrait, sprite sheet, or ultimate assets.
- ZERO route display is a reward notification only until a later MVP implements the actual branches.
## MVP-146 ZERO route QA

- ZERO route unlock remains a receptacle, not a playable branch.
- On first ZERO clear, `unlockedZeroRoutes.<dinoId>_zero` can be created by the save layer and the result can show the route as discovered.
- On repeated ZERO clears, the result should show the route as already analyzed instead of implying that no ZERO route exists.
- No ZERO evolution art, skills, or home/codex branch cards are added in MVP-146.

## MVP-147 ZERO route status

- ZERO route discovery remains future-facing while ZERO mode pacing is tuned.
- Pacing changes must not alter `unlockedZeroRoutes` keys or discovery semantics.
- Full ZERO evolution branches are still deferred to a later MVP.

## MVP-149 First ZERO reward evolution

- The first concrete ZERO reward route is `tyrannosaurus_zero`, assigned to swamp ZERO clear.
- Display name: `オメガレクス`.
- Unlock source: swamp ZERO clear writes `unlockedZeroRoutes.tyrannosaurus_zero` and mirrors the route into `discoveredEvolutions` for codex/home/result display.
- ZERO route display is gated:
  - before unlock: `???` / unparsed ZERO route.
  - after unlock: hero, portrait, name, description, and route metadata are visible.
- The route is not added to normal speed/hunting/attack evolution candidate flow.
- MVP-149 connects hero, portrait, sprite sheet, HUD special icon, codex/home/result display, and save discovery state.
- Ultimate behavior is temporary: `tyrannosaurus_zero` uses a ZERO-flavored attack-style ultimate placeholder. A dedicated ZERO ultimate remains a future MVP item.

## MVP-150 Omega Rex rebuild

- `tyrannosaurus_zero` / `オメガレクス` is rebuilt as a fully dedicated ZERO reward evolution.
- Existing tyrannosaurus attack art must not be used as a recolor source for the final assets.
- Rebuilt assets:
  - hero
  - portrait
  - 4x4 evolution sprite sheet
  - ZERO special icon
  - ZERO ultimate effect sheet and static runtime effect textures
- Sprite sheet acceptance rules:
  - 4x4 / 1024px / 256px cells
  - no frame edge issues
  - no adjacent-cell contamination
  - no lower-right alpha fade
  - move, attack, and death rows must read differently from idle.
- Dedicated ultimate: `オメガバースト`.
  - phase 1: ZERO core expands around the player.
  - phase 2: black-violet radial burst damages nearby enemies.
  - phase 3/4: follow-up eclipse beams fire in multiple directions.
  - Boss damage uses a multiplier so it is meaningful without deleting bosses instantly.
## MVP-151 ZERO Upper Evolution Rule

- `tyrannosaurus_zero` is an upper-tier ZERO evolution. ZERO clear only unlocks the route; in-run evolution requires tyrannosaurus lineage, player level 8+, and speed / hunting / attack adaptation progress each at 3+. `hasEvolved` and `hasZeroEvolved` are separate so Omega Rex can appear after a normal branch evolution, but no further evolution appears after Omega Rex. Debug helpers include `debugUnlockZeroRoute=tyrannosaurus_zero`, `debugZeroEvolution=tyrannosaurus_zero`, `debugAdaptationAllLevel=3`, and `debugDino=tyrannosaurus&debugEvolution=zero`.

## MVP-151b Omega Rex Condition Wording

- Codex wording separates route unlock from in-run evolution requirements.
- Unlock source: ZERO clear unlocks / analyzes the `tyrannosaurus_zero` route.
- Evolution requirements: tyrannosaurus lineage, player level 8+, speed adaptation level 3+, hunting adaptation level 3+, attack adaptation level 3+, and the ZERO route already analyzed.
- `ZERO CLEAR` must not be displayed as the evolution condition on the card. Use `ZEROルート解析済み` / `ルート解析済` for the route-state requirement.
- A codex detail panel for full condition text remains a future TODO; MVP-151b keeps the current card UI and uses compact concrete lines.

## MVP-151d Codex Evolution Condition Display

- `evolution_data.js` owns short card-facing requirement text through `displayConditions`.
- Normal branches display concrete requirements:
  - speed: player level 5+ and speed adaptation level 3+.
  - hunting: player level 5+ and hunting adaptation level 3+.
  - attack: player level 5+ and attack adaptation level 3+.
  - the second condition line identifies the lineage: raptor, triceratops, or tyrannosaurus.
- ZERO upper branches use the same card layout. Omega Rex displays player level 8+, speed/hunting/attack adaptation level 3+, and route analyzed.
- Codex cards prioritize "how to evolve" over role/trait text. Role text can be omitted on compact cards and later restored in a post-release detail panel.
- This is a display cleanup only; the existing normal and ZERO evolution condition logic remains unchanged.

## MVP-151e Production Implementation Rule

- Production-ready evolutions must use dedicated assets and behavior, not simple recolors or light edits of existing branches.
- New evolution routes and bosses require dedicated hero/portrait art, 4x4 sprite sheets, HUD/result/codex connection, and route-specific effects before being called complete.
- New ultimates require dedicated icons, dedicated effect assets, and behavior that is meaningfully distinct from existing ultimates.
- Prototype reuse is acceptable only when explicitly marked as temporary in the spec and asset plan.
- Every adopted 4x4 sheet must pass clipping, adjacent-cell contamination, alpha/chromakey, and motion-readability checks.
- Fallbacks must remain intact so missing dedicated assets never block play.

## MVP-151c ZERO Reward Route Scope

- Pre-release ZERO reward route scope is limited to the first three normal stages:
  - jungle ZERO clear: implemented `velociraptor_zero` / `アビスラプス`.
  - volcano ZERO clear: planned `triceratops_zero` route, not yet production-implemented.
  - swamp ZERO clear: implemented `tyrannosaurus_zero` / `オメガレクス`.
- `tyrannosaurus_zero` is assigned to the swamp ZERO reward. New saves should unlock it from `swamp_zero_clear` only.
- ruins ZERO remains playable and may grant ZERO titles/frames, but its ZERO evolution route is post-release content until the fourth dinosaur exists.
- Do not add or reveal a ruins ZERO route before the fourth dinosaur is implemented.
- Next production route order should be `triceratops_zero` for volcano, while keeping `velociraptor_zero` as the jungle route and `tyrannosaurus_zero` as the swamp route.

## MVP-152 Velociraptor ZERO Route

- `velociraptor_zero` is promoted from planned content to the jungle ZERO clear production reward route.
- Display name: `アビスラプス`.
- Route unlock source: jungle ZERO clear. This is route analysis/unlock, not the in-run evolution condition.
- In-run ZERO upper evolution requirements:
  - selected lineage: velociraptor.
  - player level 8+.
  - speed adaptation level 3+.
  - hunting adaptation level 3+.
  - attack adaptation level 3+.
  - `unlockedZeroRoutes.velociraptor_zero` is true.
- `velociraptor_zero` follows the same upper-evolution rule as `tyrannosaurus_zero`: a normal branch can already be reached, but ZERO evolution remains available until `hasZeroEvolved` / zero-tier evolution is reached.
- Compact codex condition text:
  - `Lv8+ / 高速Lv3 / 狩猟Lv3`
  - `攻撃Lv3 / ルート解析済`
- Dedicated ultimate: `アビスラッシュ`.
  - ZERO core pulse.
  - high-speed afterimage dash slashes.
  - final short-range shockwave.
  - boss damage is reduced by multiplier so it is strong but not a boss skip.
- Pre-release ZERO reward route map:
  - jungle -> `velociraptor_zero` / `アビスラプス`.
  - volcano -> planned `triceratops_zero`.
  - swamp -> `tyrannosaurus_zero` / Omega Rex.
  - ruins -> post-release route after the fourth dinosaur exists.

## MVP-152b Abyss Raptor Asset Quality Pass

- The `velociraptor_zero` hero and portrait are preserved.
- The runtime sprite sheet was rebuilt from a dedicated 4x4 generated sprite-sheet source instead of hero-derived safe placement.
- Motion requirements for `velociraptor_zero_sheet.png`:
  - move row must read as a high-speed run, not only vertical bobbing.
  - attack row must read as dash claw slashes.
  - death row must read as collapse / ZERO glow fade.
- Dedicated special icon and ultimate effect sheets were regenerated for `アビスラッシュ`:
  - `special_zero_velociraptor.png`
  - `special_zero_raptor_core_sheet.png`
  - `special_zero_raptor_slash_sheet.png`
  - `special_zero_raptor_dash_sheet.png`
- Hero-derived or simple recolor assets are not considered production-complete for ZERO reward routes.

## MVP-152c ZERO Reward Boss Alignment

- Route reward ownership remains stage-scoped:
  - jungle ZERO -> `velociraptor_zero`.
  - swamp ZERO -> `tyrannosaurus_zero`.
  - volcano ZERO -> planned `triceratops_zero`, not implemented in this MVP.
  - ruins ZERO -> post-release content after the fourth dinosaur exists.
- Jungle and swamp now have dedicated ZERO final bosses so the route reward is not presented as a generic Eclipse Protocol clear.
- The second ZERO boss is still an enhanced stage-boss bridge for jungle/swamp and should be revisited if final polish requires full dedicated phase-2 assets.
- No new `triceratops_zero` data or assets are added in MVP-152c.

## MVP-152d ZERO Second Boss Reward Gate

- Jungle and swamp now use dedicated ZERO second bosses before their route final bosses.
- Route ownership remains unchanged:
  - jungle ZERO final clear grants `velociraptor_zero`.
  - swamp ZERO final clear grants `tyrannosaurus_zero`.
  - volcano `triceratops_zero` remains planned.
  - ruins remains post-release content.
- The second boss is not a reward checkpoint. Defeating phase 2 only advances the run to the route final boss.
- ZERO route unlocks, ZERO titles, and ZERO frames are awarded only after the final ZERO boss clear path completes.
- This preserves the upper-evolution rule for `velociraptor_zero` and `tyrannosaurus_zero`; no new ZERO evolution data is added in MVP-152d.

## MVP-153 Volcano ZERO Reward Route

- Volcano ZERO clear is now the production reward source for `triceratops_zero` / `イグニケラ`.
- `triceratops_zero` follows the same upper-evolution rule as `velociraptor_zero` and `tyrannosaurus_zero`: ZERO clear unlocks the route, while in-run evolution requires triceratops lineage, player level 8+, and speed / hunting / attack adaptation progress each at 3+.
- Display conditions remain compact for codex cards: `Lv8+ / 高速Lv3 / 狩猟Lv3` and `攻撃Lv3 / ルート解析済`.
- Volcano ZERO now maps to `triceratops_zero`; jungle remains `velociraptor_zero`, swamp remains `tyrannosaurus_zero`, and ruins remains post-release / locked.
- The dedicated ultimate is `イグニスチャージ`: ZERO core startup, heavy forward charge lane damage, then a volcanic impact finisher with boss damage scaling.

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
- Public ZERO route scope remains three routes: jungle -> `velociraptor_zero`, volcano -> `triceratops_zero`, swamp -> `tyrannosaurus_zero`.
- Ruins ZERO remains post-release content and does not grant a ZERO route in the public flow.
- ZERO upper evolution QA reconfirmed route unlock, matching lineage, Lv8+, and speed / hunting / attack Lv3+ are required.
- `hasZeroEvolved` remains the repeat-prevention flag after a ZERO upper evolution is selected.
- Direct debug starts for the three ZERO evolutions loaded with no runtime app console errors.
- Codex detail panel remains deferred; current card text must continue prioritizing concise unlock and evolution conditions.
