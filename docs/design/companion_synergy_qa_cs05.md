# Companion Synergy QA CS05

## Summary

CS05 validates the Companion Synergy V1 implementation on `feature/companion-synergy-v1`.

- Scope: QA and balance review only.
- Implementation changes: none.
- Save changes: none.
- Main merge / push: not performed.
- Final judgment: main統合可.

## QA Environment

- Local app: `http://localhost:5178/EVOLUTION-ZERO/`
- Browser automation: Microsoft Edge via Playwright-compatible runtime.
- Audio was muted in QA localStorage to avoid headless browser autoplay warnings.
- Debug flags were used only to force dino / companion combinations and shorten setup time.

## Data And Effect Checks

Node-level checks confirmed:

- 10 synergy definitions exist.
- 4 synergies are `enabled: true`.
- 6 future synergies are `enabled: false`.
- Disabled future synergies do not become active even when their reserved player dino ID is supplied.
- Non-matching enabled pairs return inactive.

### Enabled Pair Results

| Player dino | Companion | Synergy ID | Effect | Value | Result |
| --- | --- | --- | --- | ---: | --- |
| `tyrannosaurus` | `rex_hatchling` | `tyranno_rex_boss_hunter` | Boss damage | +12% | PASS |
| `velociraptor` | `raptorling` | `raptor_double_claw` | Critical rate | +6% | PASS |
| `spinosaurus` | `spino_pup` | `spino_tide_support` | Companion skill damage | +12% | PASS |
| `triceratops` | `tricera_calf` | `tricera_guard_resonance` | Damage taken | -10% | PASS |

## Combat Behavior Checks

### Tyrannosaurus x rex_hatchling

- Boss target: `100` base damage became `112`.
- Non-boss target: `100` base damage stayed `100`.
- Balance: B /適正.
- Notes: Boss-only +12% is visible but not large enough to replace build quality or upgrades.

### Velociraptor x raptorling

- Critical synergy adds +6% critical chance.
- Forced random QA confirmed the critical path can trigger and non-critical path remains available.
- Balance: B / 適正.
- Notes: +6% is noticeable over time but does not create critical spam by itself.

### Spinosaurus x spino_pup

- Synergy is connected to `companionSkillDamage`.
- `spino_pup` support attack applies `1 + companionSkillDamage`, resulting in +12% support damage.
- Balance: B / 適正.
- Notes: No projectile count increase; safer for performance than adding new bullets.

### Triceratops x tricera_calf

- Synergy is connected to `damageTaken`.
- Player damage multiplier is multiplied by `0.90`.
- Balance: B / 適正.
- Notes: Reduction is modest and still respects existing invincible/debug handling and clamp behavior.

## Non-Synergy Checks

Checked representative non-matching pairs:

| Player dino | Companion | Expected | Result |
| --- | --- | --- | --- |
| `tyrannosaurus` | `spino_pup` | inactive | PASS |
| `tyrannosaurus` | `raptorling` | inactive | PASS |
| `velociraptor` | `tricera_calf` | inactive | PASS |
| `spinosaurus` | `rex_hatchling` | inactive | PASS |

Non-synergy combinations remain playable. The feature does not make non-matching pairs invalid; it only adds a small optimization reward for matching pairs.

## UI Checks

Checked surfaces:

- Home companion panel.
- Companion selection modal.
- Research companion owned panel.

Results:

- Active enabled synergies show `発動中`.
- Enabled but non-matching pairs show `未発動`.
- Disabled future synergies show only `相性: 未発見の恐竜`.
- Normal UI does not expose future dino names.
- Normal UI does not show `将来解放予定` / `将来のアップデートで解放予定`.
- Smartphone-width viewport did not show blocking text overflow in the checked surfaces.

## Save And State Checks

- Synergy state is derived from current `selectedDinoId` and selected companion ID.
- No new save field is required.
- Changing selected companion changes the derived UI state.
- Changing player dino changes the derived UI state.
- Restart / reload does not need to persist a separate synergy flag.

## High Difficulty Checks

Short runtime checks were performed with canvas creation, debug performance enabled, and muted audio:

| Case | Result |
| --- | --- |
| ZERO `tyrannosaurus` x `rex_hatchling` | PASS |
| ZERO `spinosaurus` x `spino_pup` | PASS |
| ZERO `triceratops` x `tricera_calf` | PASS |
| ENDLESS `spinosaurus` x `spino_pup` | PASS |
| ENDLESS non-synergy `spinosaurus` x `rex_hatchling` | PASS |

No crash screen, no page error, no runtime console error/warn, and no request failures were observed after muting audio for headless QA.

## Balance Evaluation

| Synergy | Rating | Reason |
| --- | --- | --- |
| Tyrannosaurus x rex_hatchling | B | Boss-only +12% is useful but not universal. |
| Velociraptor x raptorling | B | +6% crit rate adds identity without forcing crit-only builds. |
| Spinosaurus x spino_pup | B | +12% companion support damage is visible and does not add extra entities. |
| Triceratops x tricera_calf | B | -10% damage taken supports tank identity without making ZERO trivial. |

Recommended adjustment: none for CS05. Revisit values only after longer live balance data.

## Residual Risks

- CS05 used short high-difficulty runs, not full-length ZERO clears for every pair.
- UI text is acceptable in checked surfaces, but final mobile release QA should still include direct visual review on an actual device.
- Future disabled synergies remain design-only and should stay inactive until their player dinos exist.

## Main Integration Judgment

main統合可.

理由:

- Enabled 4組の効果経路が確認済み。
- 非シナジー構成も成立。
- UI表示は発動中 / 未発動 / 未発見の恐竜で整理済み。
- Save構造変更なし。
- 短時間ZERO / ENDLESSでシナジー起因のクラッシュや性能悪化なし。
- Build and syntax checks passed.
