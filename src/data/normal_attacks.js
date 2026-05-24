export const NORMAL_ATTACK_HIT_SHAPES = {
  ARC: 'arc',
  CONE: 'cone',
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
};

export const NORMAL_ATTACKS = {
  raptorClaw: {
    id: 'raptorClaw',
    name: 'Raptor Claw',
    ownerDinoId: 'velociraptor',
    attackType: NORMAL_ATTACK_HIT_SHAPES.ARC,
    damage: 9,
    cooldown: 0.58,
    range: 76,
    angle: 70,
    width: null,
    originOffset: { x: 26, y: 0 },
    maxTargets: 2,
    knockback: 14,
    hitTiming: 0.11,
    facing: 'target',
    effectKey: 'normalAttackEffects.raptorClawSlash',
    iconKey: 'normalAttackIcons.raptorClaw',
    effectDuration: 0.18,
    effectSize: { width: 118, height: 82 },
    effectOffset: 0.58,
    description: 'Fast, short-range claw slash for the speed-focused base attack.',
  },
  triceratopsHornImpact: {
    id: 'triceratopsHornImpact',
    name: 'Horn Impact',
    ownerDinoId: 'triceratops',
    attackType: NORMAL_ATTACK_HIT_SHAPES.RECTANGLE,
    damage: 13,
    cooldown: 0.86,
    range: 78,
    angle: null,
    width: 62,
    originOffset: { x: 32, y: 0 },
    maxTargets: 2,
    knockback: 34,
    hitTiming: 0.18,
    facing: 'target',
    effectKey: 'normalAttackEffects.triceratopsHornImpact',
    iconKey: 'normalAttackIcons.triceratopsHorn',
    effectDuration: 0.24,
    effectSize: { width: 132, height: 96 },
    effectOffset: 0.5,
    description: 'Forward horn impact that controls groups with stronger knockback.',
  },
  trexBiteShock: {
    id: 'trexBiteShock',
    name: 'Bite Shock',
    ownerDinoId: 'tyrannosaurus',
    attackType: NORMAL_ATTACK_HIT_SHAPES.CONE,
    damage: 20,
    cooldown: 1.05,
    range: 104,
    angle: 96,
    width: null,
    originOffset: { x: 42, y: 0 },
    maxTargets: 2,
    knockback: 26,
    hitTiming: 0.22,
    facing: 'target',
    effectKey: 'normalAttackEffects.trexBiteShock',
    iconKey: 'normalAttackIcons.trexBite',
    effectDuration: 0.28,
    effectSize: { width: 154, height: 144 },
    effectOffset: 0.56,
    description: 'Heavy forward bite and shock attack with a wider trigger-matched cone.',
  },
};

export function getNormalAttackById(id) {
  return NORMAL_ATTACKS[id] ?? null;
}

export function getNormalAttackForDino(dinoId) {
  return Object.values(NORMAL_ATTACKS).find((attack) => attack.ownerDinoId === dinoId) ?? null;
}
