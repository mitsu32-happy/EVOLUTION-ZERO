export const EVOLUTION_DISCOVERY_EMPTY = {};

export const EVOLUTION_BRANCHES = {
  velociraptor: [
    {
      id: 'velociraptor_speed',
      dinoId: 'velociraptor',
      tag: 'speed',
      evolutionName: 'ファルクス',
      mutationName: '高速変異',
      tagLabel: '高速適応',
      description: '細身の骨格と神経反応が高速化した分岐。連続回避と斬撃に優れる。',
      condition: '高速適応の反応値を一定以上まで高める',
      displayConditions: ['Lv5+ / 高速Lv3', 'ラプトル系統'],
      role: '速度 / 連続攻撃',
      ultimateName: '高速爪撃',
      ultimateDescription: '短時間だけ加速し、進行方向へ連続爪撃を放つ。',
      heroPath: 'assets/dinos/evolutions/heroes/velociraptor_speed_hero.png',
      portraitPath: 'assets/dinos/evolutions/portraits/velociraptor_speed_portrait.png',
      sheetPath: 'assets/dinos/evolutions/sheets/velociraptor_speed_sheet.png',
      specialIconPath: 'assets/ui/hud/special_icons/special_speed_raptor.png',
      normalAttackEffectKey: 'normalAttackEffects.velociraptorSpeedSlash',
    },
    {
      id: 'velociraptor_hunting',
      dinoId: 'velociraptor',
      tag: 'hunting',
      evolutionName: 'ノクスヴェナ',
      mutationName: '狩猟変異',
      tagLabel: '狩猟適応',
      description: '感覚器と追跡本能が強化された分岐。索敵と追尾攻撃に優れる。',
      condition: '狩猟適応の反応値を一定以上まで高める',
      displayConditions: ['Lv5+ / 狩猟Lv3', 'ラプトル系統'],
      role: '追跡 / 回収',
      ultimateName: '追尾狩猟',
      ultimateDescription: '周辺の敵を捕捉し、追尾する牙撃を連続射出する。',
      heroPath: 'assets/dinos/evolutions/heroes/velociraptor_hunting_hero.png',
      portraitPath: 'assets/dinos/evolutions/portraits/velociraptor_hunting_portrait.png',
      sheetPath: 'assets/dinos/evolutions/sheets/velociraptor_hunting_sheet.png',
      specialIconPath: 'assets/ui/hud/special_icons/special_hunting_raptor.png',
      normalAttackEffectKey: 'normalAttackEffects.velociraptorHuntingFang',
    },
    {
      id: 'velociraptor_attack',
      dinoId: 'velociraptor',
      tag: 'attack',
      evolutionName: 'ヴォルグラム',
      mutationName: '攻撃変異',
      tagLabel: '攻撃適応',
      description: '顎と前肢の破壊力が肥大化した分岐。正面制圧と大ダメージに優れる。',
      condition: '攻撃適応の反応値を一定以上まで高める',
      displayConditions: ['Lv5+ / 攻撃Lv3', 'ラプトル系統'],
      role: '破壊 / 制圧',
      ultimateName: '衝撃咆哮',
      ultimateDescription: '赤橙の衝撃波を放ち、前方の群れを押し返す。',
      heroPath: 'assets/dinos/evolutions/heroes/velociraptor_attack_hero.png',
      portraitPath: 'assets/dinos/evolutions/portraits/velociraptor_attack_portrait.png',
      sheetPath: 'assets/dinos/evolutions/sheets/velociraptor_attack_sheet.png',
      specialIconPath: 'assets/ui/hud/special_icons/special_attack_raptor.png',
      normalAttackEffectKey: 'normalAttackEffects.velociraptorAttackImpact',
    },
    {
      id: 'velociraptor_zero',
      dinoId: 'velociraptor',
      tag: 'zero',
      evolutionName: 'アビスラプス',
      mutationName: 'ZERO上位進化',
      tagLabel: 'ZERO',
      description: '密林ZERO反応から解析されたヴェロキラプトル系の上位進化。黒紫の発光コアと鋭い羽毛状スパインを持ち、死角から高速連撃を仕掛ける。',
      condition: 'ZEROルート解析済みで解放',
      displayConditions: ['Lv8+ / 高速Lv3 / 狩猟Lv3', '攻撃Lv3 / ルート解析済'],
      role: 'ZERO報酬 / 高速連撃',
      ultimateName: 'アビスラッシュ',
      ultimateDescription: 'ZEROコアを展開し、高速残像ダッシュで周囲の敵を切り裂いた後、小範囲の黒紫衝撃波を放つ。',
      heroPath: 'assets/dinos/evolutions/heroes/velociraptor_zero_hero.png',
      portraitPath: 'assets/dinos/evolutions/portraits/velociraptor_zero_portrait.png',
      sheetPath: 'assets/dinos/evolutions/sheets/velociraptor_zero_sheet.png',
      specialIconPath: 'assets/ui/hud/special_icons/special_zero_velociraptor.png',
      normalAttackEffectKey: 'normalAttackEffects.velociraptorZeroAbyssSlash',
      ultimateId: 'velociraptor_zero',
      tier: 'zero',
      unlockCondition: 'jungle ZERO clear',
      evolutionRequirements: {
        dinoId: 'velociraptor',
        playerLevel: 8,
        adaptationLevels: {
          speed: 3,
          hunting: 3,
          attack: 3,
        },
        summary: 'ヴェロキラプトル系統 / Lv8以上 / 高速Lv3以上 / 狩猟Lv3以上 / 攻撃Lv3以上 / ZEROルート解析済み',
        displayLines: [
          '対象: ヴェロキラプトル系統',
          'Lv8以上',
          '高速適応 Lv3以上',
          '狩猟適応 Lv3以上',
          '攻撃適応 Lv3以上',
          'ZEROルート解析済み',
        ],
      },
      zeroRoute: true,
      hiddenUntilDiscovered: true,
    },
  ],
  triceratops: [
    {
      id: 'triceratops_speed',
      dinoId: 'triceratops',
      tag: 'speed',
      evolutionName: 'セラヴェル',
      mutationName: '突進変異',
      tagLabel: '高速適応',
      description: '流線型の角と軽量装甲を獲得した突進特化個体。直線制圧と押し込みに優れる。',
      condition: '高速適応の反応値を一定以上まで高める',
      displayConditions: ['Lv5+ / 高速Lv3', 'トリケラ系統'],
      role: '突進 / 押し込み',
      ultimateName: 'ホーンラッシュ',
      ultimateDescription: '前方へ高速突進し、通過軌道上の敵を角で弾き飛ばす。',
      heroPath: 'assets/dinos/evolutions/heroes/triceratops_speed_hero.png',
      portraitPath: 'assets/dinos/evolutions/portraits/triceratops_speed_portrait.png',
      sheetPath: 'assets/dinos/evolutions/sheets/triceratops_speed_sheet.png',
      specialIconPath: 'assets/ui/hud/special_icons/special_speed_triceratops.png',
      normalAttackEffectKey: 'normalAttackEffects.triceratopsSpeedCharge',
    },
    {
      id: 'triceratops_hunting',
      dinoId: 'triceratops',
      tag: 'hunting',
      evolutionName: 'セラノクス',
      mutationName: '索敵変異',
      tagLabel: '狩猟適応',
      description: '角先と感覚器が発達した防衛型個体。周囲を監視し、近づく群れを迎撃する。',
      condition: '狩猟適応の反応値を一定以上まで高める',
      displayConditions: ['Lv5+ / 狩猟Lv3', 'トリケラ系統'],
      role: '索敵 / 防衛',
      ultimateName: 'バスティオンホーン',
      ultimateDescription: '角陣フィールドを展開し、周囲の敵へ反応ダメージを与える。',
      heroPath: 'assets/dinos/evolutions/heroes/triceratops_hunting_hero.png',
      portraitPath: 'assets/dinos/evolutions/portraits/triceratops_hunting_portrait.png',
      sheetPath: 'assets/dinos/evolutions/sheets/triceratops_hunting_sheet.png',
      specialIconPath: 'assets/ui/hud/special_icons/special_hunting_triceratops.png',
      normalAttackEffectKey: 'normalAttackEffects.triceratopsHuntingPulse',
    },
    {
      id: 'triceratops_attack',
      dinoId: 'triceratops',
      tag: 'attack',
      evolutionName: 'グランボルグ',
      mutationName: '破城変異',
      tagLabel: '攻撃適応',
      description: '巨大化した角とフリル装甲を持つ重火力個体。地割れ衝撃で群れを押し潰す。',
      condition: '攻撃適応の反応値を一定以上まで高める',
      displayConditions: ['Lv5+ / 攻撃Lv3', 'トリケラ系統'],
      role: '制圧 / 衝撃',
      ultimateName: 'クエイクラム',
      ultimateDescription: '地面を叩き割る広域衝撃を放ち、敵群を大きく押し返す。',
      heroPath: 'assets/dinos/evolutions/heroes/triceratops_attack_hero.png',
      portraitPath: 'assets/dinos/evolutions/portraits/triceratops_attack_portrait.png',
      sheetPath: 'assets/dinos/evolutions/sheets/triceratops_attack_sheet.png',
      specialIconPath: 'assets/ui/hud/special_icons/special_attack_triceratops.png',
      normalAttackEffectKey: 'normalAttackEffects.triceratopsAttackQuake',
    },
    {
      id: 'triceratops_zero',
      dinoId: 'triceratops',
      tag: 'zero',
      evolutionName: '\u30a4\u30b0\u30cb\u30b1\u30e9',
      mutationName: 'ZERO\u4e0a\u4f4d\u9032\u5316',
      tagLabel: 'ZERO',
      description: 'volcano ZERO\u306e\u81e8\u754c\u53cd\u5fdc\u304b\u3089\u89e3\u6790\u3055\u308c\u305f\u30c8\u30ea\u30b1\u30e9\u30c8\u30d7\u30b9\u7cfb\u306e\u4e0a\u4f4d\u9032\u5316\u3002\u9ed2\u7d2b\u306eZERO\u30b3\u30a2\u3068\u6eb6\u5ca9\u88c5\u7532\u3092\u5bbf\u3057\u3001\u89d2\u7a81\u9032\u3067\u6226\u57df\u3092\u5236\u5727\u3059\u308b\u3002',
      condition: 'ZERO\u30eb\u30fc\u30c8\u89e3\u6790\u6e08\u307f\u3067\u89e3\u653e',
      displayConditions: ['Lv8+ / \u9ad8\u901fLv3 / \u72e9\u731fLv3', '\u653b\u6483Lv3 / \u30eb\u30fc\u30c8\u89e3\u6790\u6e08'],
      role: 'ZERO\u5831\u916c / \u91cd\u7a81\u9032\u5236\u5727',
      ultimateName: '\u30a4\u30b0\u30cb\u30b9\u30c1\u30e3\u30fc\u30b8',
      ultimateDescription: 'ZERO\u30b3\u30a2\u3092\u767a\u706b\u3055\u305b\u3066\u524d\u65b9\u3078\u91cd\u7a81\u9032\u3057\u3001\u8ecc\u9053\u4e0a\u306e\u6575\u3092\u8f62\u304d\u629c\u3051\u305f\u5f8c\u306b\u706b\u5c71\u885d\u6483\u6ce2\u3092\u653e\u3064\u3002',
      heroPath: 'assets/dinos/evolutions/heroes/triceratops_zero_hero.png',
      portraitPath: 'assets/dinos/evolutions/portraits/triceratops_zero_portrait.png',
      sheetPath: 'assets/dinos/evolutions/sheets/triceratops_zero_sheet.png',
      specialIconPath: 'assets/ui/hud/special_icons/special_zero_triceratops.png',
      normalAttackEffectKey: 'normalAttackEffects.triceratopsZeroIgnisCharge',
      ultimateId: 'triceratops_zero',
      tier: 'zero',
      unlockCondition: 'volcano ZERO clear',
      evolutionRequirements: {
        dinoId: 'triceratops',
        playerLevel: 8,
        adaptationLevels: {
          speed: 3,
          hunting: 3,
          attack: 3,
        },
        summary: '\u30c8\u30ea\u30b1\u30e9\u30c8\u30d7\u30b9\u7cfb\u7d71 / Lv8\u4ee5\u4e0a / \u9ad8\u901fLv3\u4ee5\u4e0a / \u72e9\u731fLv3\u4ee5\u4e0a / \u653b\u6483Lv3\u4ee5\u4e0a / ZERO\u30eb\u30fc\u30c8\u89e3\u6790\u6e08\u307f',
        displayLines: [
          '\u5bfe\u8c61: \u30c8\u30ea\u30b1\u30e9\u30c8\u30d7\u30b9\u7cfb\u7d71',
          'Lv8\u4ee5\u4e0a',
          '\u9ad8\u901f\u9069\u5fdc Lv3\u4ee5\u4e0a',
          '\u72e9\u731f\u9069\u5fdc Lv3\u4ee5\u4e0a',
          '\u653b\u6483\u9069\u5fdc Lv3\u4ee5\u4e0a',
          'ZERO\u30eb\u30fc\u30c8\u89e3\u6790\u6e08\u307f',
        ],
      },
      zeroRoute: true,
      hiddenUntilDiscovered: true,
    },
  ],
  tyrannosaurus: [
    {
      id: 'tyrannosaurus_speed',
      dinoId: 'tyrannosaurus',
      tag: 'speed',
      evolutionName: 'レグナクス',
      mutationName: '瞬牙変異',
      tagLabel: '高速適応',
      description: '巨体の瞬発力を極限まで高めた捕食特化個体。鋭い突進と噛みつきで群れを断つ。',
      condition: '高速適応の反応値を一定以上まで高める',
      displayConditions: ['Lv5+ / 高速Lv3', 'ティラノ系統'],
      role: '突撃 / 瞬間火力',
      ultimateName: 'プレデターダッシュ',
      ultimateDescription: '前方へ瞬間突撃し、噛み砕く軌道上の敵へ大ダメージを与える。',
      heroPath: 'assets/dinos/evolutions/heroes/tyrannosaurus_speed_hero.png',
      portraitPath: 'assets/dinos/evolutions/portraits/tyrannosaurus_speed_portrait.png',
      sheetPath: 'assets/dinos/evolutions/sheets/tyrannosaurus_speed_sheet.png',
      specialIconPath: 'assets/ui/hud/special_icons/special_speed_tyrannosaurus.png',
      normalAttackEffectKey: 'normalAttackEffects.tyrannosaurusSpeedBite',
    },
    {
      id: 'tyrannosaurus_hunting',
      dinoId: 'tyrannosaurus',
      tag: 'hunting',
      evolutionName: 'ヴェナトロス',
      mutationName: '威圧変異',
      tagLabel: '狩猟適応',
      description: '眼と牙が発達した追跡型個体。獲物を威圧し、逃げる敵を捕捉し続ける。',
      condition: '狩猟適応の反応値を一定以上まで高める',
      displayConditions: ['Lv5+ / 狩猟Lv3', 'ティラノ系統'],
      role: '追跡 / 威圧',
      ultimateName: 'テラーハント',
      ultimateDescription: '恐怖波で複数の敵を捕捉し、追跡する牙撃を放つ。',
      heroPath: 'assets/dinos/evolutions/heroes/tyrannosaurus_hunting_hero.png',
      portraitPath: 'assets/dinos/evolutions/portraits/tyrannosaurus_hunting_portrait.png',
      sheetPath: 'assets/dinos/evolutions/sheets/tyrannosaurus_hunting_sheet.png',
      specialIconPath: 'assets/ui/hud/special_icons/special_hunting_tyrannosaurus.png',
      normalAttackEffectKey: 'normalAttackEffects.tyrannosaurusHuntingFangWave',
    },
    {
      id: 'tyrannosaurus_attack',
      dinoId: 'tyrannosaurus',
      tag: 'attack',
      evolutionName: 'レクスヴォルグ',
      mutationName: '暴君変異',
      tagLabel: '攻撃適応',
      description: '顎と筋組織が異常発達した破壊型個体。咆哮と噛砕で広域を制圧する。',
      condition: '攻撃適応の反応値を一定以上まで高める',
      displayConditions: ['Lv5+ / 攻撃Lv3', 'ティラノ系統'],
      role: '破壊 / 広域制圧',
      ultimateName: 'デヴァウアバースト',
      ultimateDescription: '赤橙の衝撃と噛砕波を放ち、周囲の敵群を吹き飛ばす。',
      heroPath: 'assets/dinos/evolutions/heroes/tyrannosaurus_attack_hero.png',
      portraitPath: 'assets/dinos/evolutions/portraits/tyrannosaurus_attack_portrait.png',
      sheetPath: 'assets/dinos/evolutions/sheets/tyrannosaurus_attack_sheet.png',
      specialIconPath: 'assets/ui/hud/special_icons/special_attack_tyrannosaurus.png',
      normalAttackEffectKey: 'normalAttackEffects.tyrannosaurusAttackBiteBurst',
    },
    {
      id: 'tyrannosaurus_zero',
      dinoId: 'tyrannosaurus',
      tag: 'zero',
      evolutionName: 'オメガレクス',
      mutationName: 'ZERO終端変異',
      tagLabel: 'ZERO',
      description: 'ZERO領域の終端反応を取り込み、黒紫の発光核を宿したティラノ系最終変異。',
      condition: 'ZEROルート解析済みで解放',
      displayConditions: ['Lv8+ / 高速Lv3 / 狩猟Lv3', '攻撃Lv3 / ルート解析済'],
      role: 'ZERO報酬 / 終端制圧',
      ultimateName: 'オメガバースト',
      ultimateDescription: 'ZEROコアを展開して黒紫の衝撃波を放ち、複数方向へ追撃ビームを走らせる。',
      heroPath: 'assets/dinos/evolutions/heroes/tyrannosaurus_zero_hero.png',
      portraitPath: 'assets/dinos/evolutions/portraits/tyrannosaurus_zero_portrait.png',
      sheetPath: 'assets/dinos/evolutions/sheets/tyrannosaurus_zero_sheet.png',
      specialIconPath: 'assets/ui/hud/special_icons/special_zero_tyrannosaurus.png',
      normalAttackEffectKey: 'normalAttackEffects.tyrannosaurusZeroOmegaBite',
      ultimateId: 'tyrannosaurus_zero',
      tier: 'zero',
      unlockCondition: 'ZEROクリア',
      evolutionRequirements: {
        dinoId: 'tyrannosaurus',
        playerLevel: 8,
        adaptationLevels: {
          speed: 3,
          hunting: 3,
          attack: 3,
        },
        summary: 'ティラノ系統 / Lv8以上 / 高速Lv3以上 / 狩猟Lv3以上 / 攻撃Lv3以上 / ZEROルート解析済み',
        displayLines: [
          '対象: ティラノ系統',
          'Lv8以上',
          '高速適応 Lv3以上',
          '狩猟適応 Lv3以上',
          '攻撃適応 Lv3以上',
          'ZEROルート解析済み',
        ],
      },
      zeroRoute: true,
      hiddenUntilDiscovered: true,
    },
  ],
};

export function getEvolutionBranchId(dinoId = 'velociraptor', tag = 'speed') {
  return `${dinoId}_${tag}`;
}

export function getEvolutionBranch(dinoId = 'velociraptor', tag = 'speed') {
  return getEvolutionBranchesForDino(dinoId).find((branch) => branch.tag === tag) ?? null;
}

export function getEvolutionBranchById(id) {
  return getAllEvolutionBranches().find((branch) => branch.id === id) ?? null;
}

export function getEvolutionBranchesForDino(dinoId = 'velociraptor') {
  return EVOLUTION_BRANCHES[dinoId] ?? [];
}

export function getAllEvolutionBranches() {
  return Object.values(EVOLUTION_BRANCHES).flat();
}

export function normalizeDiscoveredEvolutions(value) {
  if (Array.isArray(value)) {
    return value.reduce((result, entry) => {
      if (!entry?.tag) {
        return result;
      }
      const dinoId = entry.dinoId ?? 'velociraptor';
      const id = entry.id ?? getEvolutionBranchId(dinoId, entry.tag);
      const branch = getEvolutionBranchById(id) ?? getEvolutionBranch(dinoId, entry.tag);
      result[id] = {
        discovered: true,
        id,
        dinoId,
        tag: entry.tag,
        evolutionName: branch?.evolutionName ?? entry.evolutionName ?? entry.tag,
        mutationName: branch?.mutationName ?? entry.mutationName ?? entry.tag,
        discoveredAt: entry.discoveredAt ?? null,
      };
      return result;
    }, {});
  }

  if (!value || typeof value !== 'object') {
    return { ...EVOLUTION_DISCOVERY_EMPTY };
  }

  return Object.entries(value).reduce((result, [key, entry]) => {
    const branch = getEvolutionBranchById(key);
    const normalized = entry === true
      ? { discovered: true }
      : typeof entry === 'object' && entry !== null
        ? entry
        : null;

    if (!normalized?.discovered) {
      return result;
    }

    const id = normalized.id ?? key;
    const dinoId = normalized.dinoId ?? branch?.dinoId ?? 'velociraptor';
    const tag = normalized.tag ?? branch?.tag ?? key.split('_').pop();

    result[id] = {
      discovered: true,
      id,
      dinoId,
      tag,
      evolutionName: branch?.evolutionName ?? normalized.evolutionName ?? tag,
      mutationName: branch?.mutationName ?? normalized.mutationName ?? tag,
      discoveredAt: normalized.discoveredAt ?? null,
    };
    return result;
  }, {});
}

export function isEvolutionDiscovered(discoveredEvolutions, dinoIdOrId, tag = null) {
  const normalized = normalizeDiscoveredEvolutions(discoveredEvolutions);
  const id = tag ? getEvolutionBranchId(dinoIdOrId, tag) : dinoIdOrId;

  return Boolean(normalized[id]?.discovered);
}

export function getDiscoveredEvolutionEntries(discoveredEvolutions) {
  return Object.values(normalizeDiscoveredEvolutions(discoveredEvolutions));
}

export function getDiscoveredEvolutionCount(discoveredEvolutions, dinoId = null) {
  return getDiscoveredEvolutionEntries(discoveredEvolutions)
    .filter((entry) => !dinoId || entry.dinoId === dinoId)
    .length;
}

export function createEvolutionDiscovery(evolution, fallbackDinoId = 'velociraptor') {
  if (!evolution?.tag) {
    return null;
  }

  const dinoId = evolution.dinoId ?? evolution.ownerDinoId ?? fallbackDinoId;
  const branch = getEvolutionBranch(dinoId, evolution.tag);
  const id = evolution.id ?? branch?.id ?? getEvolutionBranchId(dinoId, evolution.tag);

  return {
    discovered: true,
    id,
    dinoId,
    tag: evolution.tag,
    evolutionName: branch?.evolutionName ?? evolution.evolutionName ?? evolution.tag,
    mutationName: branch?.mutationName ?? evolution.mutationName ?? evolution.tag,
    discoveredAt: new Date().toISOString(),
  };
}
