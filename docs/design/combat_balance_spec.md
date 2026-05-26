# Combat Balance Spec

## MVP-161 Playfeel Polish

### Adaptation Skills

- Adaptation skills should feel useful before the player reaches a full build.
- MVP-161 increases base damage and slightly lowers cooldowns across the current adaptation skill set.
- The intent is stronger mob clearing and clearer feedback without replacing ultimate skills.
- Boss damage remains indirectly constrained because adaptation skills still use their existing target limits, area limits, cooldowns, and boss/encounter pacing.

### Pickup Feedback

- EXP and HP pickups show short floating feedback text near the pickup location.
- HP recovery uses green burst feedback.
- Pickup text is considered part of the combat-number layer and follows the Options `繝繝｡繝ｼ繧ｸ` setting.
- Mass pickup feedback should remain short-lived and should not block player or enemy readability.

### Warning Guides

- Boss hazards and stage gimmicks use translucent warning guides before active damage begins.
- Warning phase has no damage; active phase applies the real hitbox.
- Guides must match the same line, circle, or multi-hitbox shape used by the active damage check.
- Options `隴ｦ蜻翫ぎ繧､繝荏 can hide the guide layer.
- Options `隕冶ｪ肴ｧ` increases guide alpha for readability.

### Boss Pattern Readability

- Boss hazard attacks use a short recovery gate after spawning a hazard.
- Normal bosses generally allow one active hazard pattern at a time.
- ZERO final bosses may allow limited overlap, but should avoid unavoidable stacked attacks.
- Summons and hazards should not grant ZERO rewards until the final boss is defeated.

### Stage Gimmick Pressure

- Gimmicks are accents. Enemy movement, enemy density, and boss patterns remain the main game pressure.
- NORMAL/HARD gimmick cadence should leave clear movement routes.
- EXPERT/ZERO may be stricter, but warnings must remain readable and simultaneous gimmicks should be capped.

## Post-RC Balance Adjustment: Normal Attack Down / Adaptation Up

- Normal attacks were too dominant, so base normal attacks were reduced:
  - Raptor Claw: damage `12 -> 9`, cooldown `0.50 -> 0.58`.
  - Horn Impact: damage `16 -> 13`, cooldown `0.75 -> 0.86`, range `82 -> 78`, maxTargets `3 -> 2`.
  - Bite Shock: damage `26 -> 20`, cooldown `0.92 -> 1.05`, range `112 -> 104`, angle `102 -> 96`, maxTargets `3 -> 2`.
- Dino-specific normal-attack bonuses were also reduced:
  - Velociraptor: attackIntervalMultiplier `0.90 -> 0.96`.
  - Triceratops: attackDamageBonus `3 -> 1`, attackRangeBonus `10 -> 6`, attackIntervalMultiplier `1.00 -> 1.04`.
  - Tyrannosaurus: attackDamageBonus `14 -> 8`, attackRangeBonus `24 -> 16`, attackIntervalMultiplier `1.05 -> 1.12`.
- Normal attacks after evolution were reduced while keeping their route identity:
  - Speed multi-hit: `0.62 -> 0.54`.
  - Hunting multi-target: `0.86 -> 0.72`.
  - Attack heavy: `1.00 -> 0.78`.
- Adaptation skills were broadly strengthened so leveling them feels more meaningful:
  - Base cooldowns were shortened and base damage/search range were increased across the skill set.
  - Level-based recast reduction in `updateAdaptationSkills` was strengthened from `3.5%` to `5.5%` per level after level 1.
  - Afterimage Claw, Gale Blade, Homing Fang, Sense Spike, Burst Fang, Shock Roar Wave, Flame Breath, Predator Marking, and Accelerated Blades now gain range, target count, projectile count, trap count, or area coverage more clearly as level increases.
- Intent:
  - Early play should still be readable, but normal attacks alone should not erase the need for adaptation skill growth.
  - In ZERO, the player should feel a stronger need for adaptation levels and research upgrades instead of clearing mainly through normal attack DPS.

## Post-RC Balance Adjustment: Level-Up Normal Attack Scaling

- Level-up choices no longer offer normal attack frequency or normal attack range upgrades.
- Removed from the active level-up pool:
  - `attack_speed_up`
  - `attack_range_up`
- New baseline non-adaptation attack upgrade:
  - `attack_power_up`
  - Raises normal attack damage and adaptation skill damage together.
- Legacy `attack_speed_up` and `attack_range_up` runtime IDs are treated as no-op safeguards so old transient states cannot keep the balance-breaking speed/range scaling.
- Intended non-adaptation level-up roles are now:
  - max HP
  - movement speed
  - attack power
  - pickup range
- Adaptation skills remain the main source of range, target count, projectile count, and frequency growth.

## Post-RC Fix: Evolution Normal Attack Effects / Heal Pickup

- Evolution branch data keeps a dedicated `normalAttackEffectKey` for all 12 public evolution routes.
- `GameState.selectEvolution()` now carries that key into `selectedEvolution`, so `CombatSystem.applyEvolution()` can load the dedicated evolution normal-attack texture instead of falling back to the base dino attack effect.
- Debug evolution starts also include the same key to keep QA URLs representative.
- HP recovery pickups heal a fixed percentage of max HP: `18%`, rounded to a whole number with a minimum of `14`.
- Heal popup text is rounded to an integer (`HP +n`) so fractional HP values from damage modifiers do not create long labels.

## MVP-A01: スピノサウルス戦闘バランス

- スピノサウルスは中距離制圧型として、HPやや高め、移動やや遅め、攻撃範囲長め、攻撃速度やや遅めに設定。
- 通常技 `spinosaurusWaterSlash` は前方扇形の水刃。小ノックバックと複数対象ヒットで雑魚整理に寄せる。
- 必殺は speed: タイダルラッシュ、hunting: メイルストローム、attack: ハイドロブレイク、zero: アビサルタイド。
- ZERO必殺は将来ルート用の受け口。現行ruins ZERO報酬としては付与しない。

## MVP-A04 視認性補正

- Options `視認性補正` はゲームバランスを変えず、視覚的な読みやすさだけを補助する。
- `やや明るい` / `明るい` は背景レイヤーalphaと薄いシアン系リフトで暗さを緩和し、ビネットを弱める。昼のような全面明色化や背景アートの再生成は行わない。
- プレイヤー、敵、ボスには控えめな輪郭補助を描く。攻撃判定、接触判定、速度、ダメージ、spawnには影響しない。
- warning guide / boss hazard はalphaを少し上げるが、避けゲーの難度を落としすぎない範囲に留める。
- swamp、volcano、ruins、ZEROでは、背景の雰囲気よりもプレイヤー位置、敵接近、pickup、危険床の識別を優先してQAする。

## MVP-A05 実プレイ修正

- ヴェナトロス / レクスヴォルグの通常攻撃effectは右向き基準のソース画像に補正し、runtime回転時に攻撃方向と一致させる。
- スピノサウルス通常攻撃は `spinosaurus_water_attack_se` を使い、水刃の短い水流SEとして鳴らす。攻撃間隔やダメージは変更しない。
- グランボルグのmove行は中間フレームの縦位置を抑え、重量級の歩行に寄せる。idle / attack / death行は変更しない。
- ボス撃破CLEARは即リザルトではなく、短い衝撃波/フラッシュを挟んでから既存CLEAR処理へ入る。ZERO finalは少し長く強い演出にするが、報酬/保存ロジックは既存の結果処理に任せる。
