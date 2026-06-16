import { Assets, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { createBottomNav } from './bottom_nav.js';
import { drawButtonFrame, drawPanel, drawScreenBackground, UI_COLORS, UI_LAYOUT, toCssColor } from './ui_theme.js';
import {
  getEvolutionBranch,
  isEvolutionDiscovered,
  normalizeDiscoveredEvolutions,
} from '../data/evolution_data.js';

const TAG_META = {
  speed: { label: '高速適応', color: 0x35d7ff },
  hunting: { label: '狩猟適応', color: 0xffd36b },
  attack: { label: '攻撃適応', color: 0xff4d38 },
  defense: { label: '防御適応', color: 0x41d9b5 },
  toxic: { label: '毒性適応', color: 0xa9ff55 },
  crystal: { label: '結晶適応', color: 0xae73ff },
  zero: { label: 'ZERO上位進化', color: 0xb94dff },
};

const CODEX_DINOS = [
  {
    id: 'velociraptor',
    name: 'ヴェロキラプトル',
    shortName: 'ラプトル',
    lineage: 'ヴェロキラプトル系統',
    type: '高速捕食型',
    trait: '軽量高速個体',
    image: 'assets/dinos/dino_select/velociraptor_hero.png',
    origin: {
      name: '原種ラプトル',
      desc: '俊敏な基礎個体。複数の戦闘分岐を確認済み。',
      stats: '体力 中 / 攻撃 中 / 速度 高',
    },
    branches: [
      {
        id: 'speed',
        name: 'ファルクス',
        tag: 'speed',
        image: 'assets/dinos/evolutions/heroes/velociraptor_speed_hero.png',
        codexImage: 'assets/dinos/evolutions/heroes/velociraptor_speed_hero.png',
        fallbackImage: 'assets/dinos/dino_select/velociraptor_hero.png',
        desc: '高速移動と連続斬撃に特化した分岐。',
        condition: 'Lv5+ / 高速Lv3',
        stats: '速度 高 / 回収 中',
      },
      {
        id: 'hunting',
        name: 'ノクスウェル',
        tag: 'hunting',
        image: 'assets/dinos/evolutions/heroes/velociraptor_hunting_hero.png',
        codexImage: 'assets/dinos/evolutions/heroes/velociraptor_hunting_hero.png',
        fallbackImage: 'assets/dinos/dino_select/velociraptor_hero.png',
        desc: '索敵と追跡で獲物を逃がさない分岐。',
        condition: 'Lv5+ / 狩猟Lv3',
        stats: '攻撃 中 / 回収 高',
      },
      {
        id: 'attack',
        name: 'ウォルグラム',
        tag: 'attack',
        image: 'assets/dinos/evolutions/heroes/velociraptor_attack_hero.png',
        codexImage: 'assets/dinos/evolutions/heroes/velociraptor_attack_hero.png',
        fallbackImage: 'assets/dinos/dino_select/velociraptor_hero.png',
        desc: '爪撃と咆哮で正面突破する分岐。',
        condition: 'Lv5+ / 攻撃Lv3',
        stats: '攻撃 高 / 体力 中',
      },
    ],
  },
  {
    id: 'triceratops',
    name: 'トリケラトプス',
    shortName: 'トリケラ',
    lineage: 'トリケラトプス系統',
    type: '重装防衛型',
    trait: '重装大型個体',
    image: 'assets/dinos/dino_select/triceratops_hero.png',
    origin: {
      name: '原種トリケラ',
      desc: '装甲と突進を軸にした基礎個体。',
      stats: '体力 高 / 攻撃 中 / 速度 低',
    },
    branches: [
      { id: 'trike-defense', name: '???', tag: 'defense', desc: '装甲反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
      { id: 'trike-toxic', name: '???', tag: 'toxic', desc: '毒性と角質の反応候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
      { id: 'trike-crystal', name: '???', tag: 'crystal', desc: '結晶化した防衛反応候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
    ],
  },
  {
    id: 'tyrannosaurus',
    name: 'ティラノサウルス',
    shortName: 'ティラノ',
    lineage: 'ティラノサウルス系統',
    type: '高火力捕食型',
    trait: '高火力大型個体',
    image: 'assets/dinos/dino_select/tyrannosaurus_hero.png',
    origin: {
      name: '原種ティラノ',
      desc: '高い攻撃性を持つ基礎個体。',
      stats: '体力 中 / 攻撃 高 / 速度 中',
    },
    branches: [
      { id: 'tyranno-attack', name: '???', tag: 'attack', desc: '咆哮と噛砕反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
      { id: 'tyranno-hunting', name: '???', tag: 'hunting', desc: '追跡と捕食本能の反応候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
      { id: 'tyranno-crystal', name: '???', tag: 'crystal', desc: '未知結晶の変異反応候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
    ],
  },
  {
    id: 'spinosaurus',
    name: 'スピノサウルス',
    shortName: 'スピノ',
    lineage: 'スピノサウルス系統',
    type: '中距離制圧型',
    trait: '水流制圧個体',
    image: 'assets/dinos/dino_select/spinosaurus_hero.png',
    origin: {
      name: '原種スピノ',
      desc: '背ビレの水流反応で中距離を制圧する追加個体。',
      stats: '体力 中 / 攻撃 中 / 制圧 高',
    },
    branches: [
      {
        id: 'speed',
        name: 'ストリームスピノ',
        tag: 'speed',
        image: 'assets/dinos/evolutions/heroes/spinosaurus_speed_hero.png',
        codexImage: 'assets/dinos/evolutions/heroes/spinosaurus_speed_hero.png',
        fallbackImage: 'assets/dinos/dino_select/spinosaurus_hero.png',
        desc: '水刃を細かく刻む高速水流分岐。',
        condition: 'Lv5+ / 高速Lv3',
        stats: '連射 高 / 制圧 中',
      },
      {
        id: 'hunting',
        name: 'アビススピノ',
        tag: 'hunting',
        image: 'assets/dinos/evolutions/heroes/spinosaurus_hunting_hero.png',
        codexImage: 'assets/dinos/evolutions/heroes/spinosaurus_hunting_hero.png',
        fallbackImage: 'assets/dinos/dino_select/spinosaurus_hero.png',
        desc: '渦潮で敵をまとめる深流狩猟分岐。',
        condition: 'Lv5+ / 狩猟Lv3',
        stats: '吸引 高 / 継続 中',
      },
      {
        id: 'attack',
        name: 'デススピノ',
        tag: 'attack',
        image: 'assets/dinos/evolutions/heroes/spinosaurus_attack_hero.png',
        codexImage: 'assets/dinos/evolutions/heroes/spinosaurus_attack_hero.png',
        fallbackImage: 'assets/dinos/dino_select/spinosaurus_hero.png',
        desc: '高圧水流で前方を貫く破壊分岐。',
        condition: 'Lv5+ / 攻撃Lv3',
        stats: '貫通 高 / 速度 低',
      },
    ],
  },
  {
    id: 'ankylosaurus',
    name: 'アンキロサウルス',
    shortName: 'アンキロ',
    lineage: 'アンキロサウルス系統',
    type: '重装防衛型',
    trait: '装甲大型個体',
    image: 'assets/dinos/dino_select/ankylosaurus_hero.png',
    locked: true,
    origin: {
      name: '原種アンキロ',
      desc: '装甲と尾棍で近距離を押し返す追加候補個体。',
      stats: '体力 高 / 攻撃 中 / 速度 低',
    },
    branches: [
      { id: 'ankylosaurus_speed', name: '???', tag: 'speed', desc: '高速装甲反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
      { id: 'ankylosaurus_hunting', name: '???', tag: 'hunting', desc: '振動索敵反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
      { id: 'ankylosaurus_attack', name: '???', tag: 'attack', desc: '尾棍重撃反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
    ],
  },
  {
    id: 'parasaurolophus',
    name: 'パラサウロロフス',
    shortName: 'パラサ',
    lineage: 'パラサウロロフス系統',
    type: '音波支援型',
    trait: '共鳴探索個体',
    image: 'assets/dinos/dino_select/parasaurolophus_hero.png',
    locked: true,
    origin: {
      name: '原種パラサ',
      desc: '頭部トサカの共鳴で敵と資源を捉える追加候補個体。',
      stats: '体力 中 / 支援 高 / 速度 中',
    },
    branches: [
      { id: 'parasaurolophus_speed', name: '???', tag: 'speed', desc: '高速音波反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
      { id: 'parasaurolophus_hunting', name: '???', tag: 'hunting', desc: '反響探索反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
      { id: 'parasaurolophus_attack', name: '???', tag: 'attack', desc: '破壊音波反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
    ],
  },
  {
    id: 'stegosaurus',
    name: 'ステゴサウルス',
    shortName: 'ステゴ',
    lineage: 'ステゴサウルス系統',
    type: '範囲制圧型',
    trait: '背板衝波個体',
    image: 'assets/dinos/dino_select/stegosaurus_hero.png',
    locked: true,
    origin: {
      name: '原種ステゴ',
      desc: '背板エネルギーで群れを押さえる追加候補個体。',
      stats: '体力 高 / 範囲 高 / 速度 低',
    },
    branches: [
      { id: 'stegosaurus_speed', name: '???', tag: 'speed', desc: '高速背板反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
      { id: 'stegosaurus_hunting', name: '???', tag: 'hunting', desc: '背板索敵反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
      { id: 'stegosaurus_attack', name: '???', tag: 'attack', desc: '地面衝撃反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
    ],
  },
  {
    id: 'pteranodon',
    name: 'プテラノドン',
    shortName: 'プテラ',
    lineage: 'プテラノドン系統',
    type: '空中支援型',
    trait: '翼膜支援個体',
    image: 'assets/dinos/dino_select/pteranodon_hero.png',
    locked: true,
    origin: {
      name: '原種プテラ',
      desc: '翼膜の風刃で遠距離から牽制する追加候補個体。',
      stats: '体力 低 / 支援 中 / 速度 高',
    },
    branches: [
      { id: 'pteranodon_speed', name: '???', tag: 'speed', desc: '高速翼膜反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
      { id: 'pteranodon_hunting', name: '???', tag: 'hunting', desc: '空中追跡反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
      { id: 'pteranodon_attack', name: '???', tag: 'attack', desc: '風槍反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
    ],
  },
  {
    id: 'compsognathus',
    name: 'コンプソグナトゥス',
    shortName: 'コンピー',
    lineage: 'コンプソグナトゥス系統',
    type: '群れ連撃型',
    trait: '小型群れ個体',
    image: 'assets/dinos/dino_select/compsognathus_hero.png',
    locked: true,
    origin: {
      name: '原種コンピー',
      desc: '小型群れで弱った敵を削る追加候補個体。',
      stats: '体力 低 / 手数 高 / 速度 高',
    },
    branches: [
      { id: 'compsognathus_speed', name: '???', tag: 'speed', desc: '高速群れ反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
      { id: 'compsognathus_hunting', name: '???', tag: 'hunting', desc: '群れ追跡反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
      { id: 'compsognathus_attack', name: '???', tag: 'attack', desc: '連撃群れ反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
    ],
  },
  {
    id: 'ornithomimus',
    name: 'オルニトミムス',
    shortName: 'オルニ',
    lineage: 'オルニトミムス系統',
    type: '高速成長型',
    trait: '走査成長個体',
    image: 'assets/dinos/dino_select/ornithomimus_hero.png',
    locked: true,
    origin: {
      name: '原種オルニ',
      desc: '長い脚で走り抜け、回収テンポを支える追加候補個体。',
      stats: '体力 中 / 回収 中 / 速度 高',
    },
    branches: [
      { id: 'ornithomimus_speed', name: '???', tag: 'speed', desc: '高速走行反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
      { id: 'ornithomimus_hunting', name: '???', tag: 'hunting', desc: '資源走査反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
      { id: 'ornithomimus_attack', name: '???', tag: 'attack', desc: '走行衝撃反応の分岐候補。', condition: '発見条件: 未解析', stats: '未解析', locked: true },
    ],
  },
];

const CODEX_BRANCH_OVERRIDES = {
  triceratops: [
    {
      id: 'speed',
      name: 'セラヴェル',
      tag: 'speed',
      image: 'assets/dinos/evolutions/heroes/triceratops_speed_hero.png',
      codexImage: 'assets/dinos/evolutions/heroes/triceratops_speed_hero.png',
      fallbackImage: 'assets/dinos/dino_select/triceratops_hero.png',
      desc: '流線型の角で直線制圧する突進分岐。',
      condition: 'Lv5+ / 高速Lv3',
      stats: '突進 高 / 防御 中',
    },
    {
      id: 'hunting',
      name: 'セラノクス',
      tag: 'hunting',
      image: 'assets/dinos/evolutions/heroes/triceratops_hunting_hero.png',
      codexImage: 'assets/dinos/evolutions/heroes/triceratops_hunting_hero.png',
      fallbackImage: 'assets/dinos/dino_select/triceratops_hero.png',
      desc: '索敵角膜で周囲を守る防衛分岐。',
      condition: 'Lv5+ / 狩猟Lv3',
      stats: '索敵 高 / 制圧 中',
    },
    {
      id: 'attack',
      name: 'グランボルグ',
      tag: 'attack',
      image: 'assets/dinos/evolutions/heroes/triceratops_attack_hero.png',
      codexImage: 'assets/dinos/evolutions/heroes/triceratops_attack_hero.png',
      fallbackImage: 'assets/dinos/dino_select/triceratops_hero.png',
      desc: '巨大角と地割れ衝撃で群れを押し潰す分岐。',
      condition: 'Lv5+ / 攻撃Lv3',
      stats: '制圧 高 / 速度 低',
    },
  ],
  tyrannosaurus: [
    {
      id: 'speed',
      name: 'レグナクス',
      tag: 'speed',
      image: 'assets/dinos/evolutions/heroes/tyrannosaurus_speed_hero.png',
      codexImage: 'assets/dinos/evolutions/heroes/tyrannosaurus_speed_hero.png',
      fallbackImage: 'assets/dinos/dino_select/tyrannosaurus_hero.png',
      desc: '巨体の爆発力で獲物を捕まえる突進分岐。',
      condition: 'Lv5+ / 高速Lv3',
      stats: '爆発 高 / 火力 中',
    },
    {
      id: 'hunting',
      name: 'ヴェナトロス',
      tag: 'hunting',
      image: 'assets/dinos/evolutions/heroes/tyrannosaurus_hunting_hero.png',
      codexImage: 'assets/dinos/evolutions/heroes/tyrannosaurus_hunting_hero.png',
      fallbackImage: 'assets/dinos/dino_select/tyrannosaurus_hero.png',
      desc: '追跡波と牙で逃げる敵を捕捉する分岐。',
      condition: 'Lv5+ / 狩猟Lv3',
      stats: '追跡 高 / 制圧 中',
    },
    {
      id: 'attack',
      name: 'レクスウォルグ',
      tag: 'attack',
      image: 'assets/dinos/evolutions/heroes/tyrannosaurus_attack_hero.png',
      codexImage: 'assets/dinos/evolutions/heroes/tyrannosaurus_attack_hero.png',
      fallbackImage: 'assets/dinos/dino_select/tyrannosaurus_hero.png',
      desc: '咆哮と噛砕波で広範囲を破壊する分岐。',
      condition: 'Lv5+ / 攻撃Lv3',
      stats: '破壊 高 / 速度 中',
    },
  ],
};

CODEX_DINOS.forEach((dino) => {
  if (CODEX_BRANCH_OVERRIDES[dino.id]) {
    dino.branches = CODEX_BRANCH_OVERRIDES[dino.id];
  }
});

const CODEX_DISPLAY_FIXES = {
  velociraptor: {
    name: 'ヴェロキラプトル',
    shortName: 'ラプトル',
    lineage: 'ヴェロキラプトル系統',
    type: '高速捕食型',
    trait: '軽量高速個体',
    origin: {
      name: '原種ラプトル',
      desc: '俊敏な基礎個体。複数の戦闘分岐を確認済み。',
      stats: '体力 中 / 攻撃 中 / 速度 高',
    },
    branches: {
      speed: { name: 'ファルクス', desc: '高速移動と連続斬撃に特化した分岐。', condition: 'Lv5+ / 高速Lv3', stats: '速度 高 / 回収 中' },
      hunting: { name: 'ノクスウェル', desc: '索敵と追跡で獲物を逃がさない分岐。', condition: 'Lv5+ / 狩猟Lv3', stats: '攻撃 中 / 回収 高' },
      attack: { name: 'ウォルグラム', desc: '爪撃と咆哮で正面突破する分岐。', condition: 'Lv5+ / 攻撃Lv3', stats: '攻撃 高 / 体力 中' },
    },
  },
  triceratops: {
    name: 'トリケラトプス',
    shortName: 'トリケラ',
    lineage: 'トリケラトプス系統',
    type: '重装防衛型',
    trait: '重装大型個体',
    origin: {
      name: '原種トリケラ',
      desc: '装甲と突進を軸にした基礎個体。',
      stats: '体力 高 / 攻撃 中 / 速度 低',
    },
    branches: {
      speed: { name: 'セラヴェル', desc: '流線型の角で直線制圧する突進分岐。', condition: 'Lv5+ / 高速Lv3', stats: '突進 高 / 防御 中' },
      hunting: { name: 'セラノクス', desc: '索敵角膜で周囲を守る防衛分岐。', condition: 'Lv5+ / 狩猟Lv3', stats: '索敵 高 / 制圧 中' },
      attack: { name: 'グランボルグ', desc: '巨大角と地割れ衝撃で群れを押し潰す分岐。', condition: 'Lv5+ / 攻撃Lv3', stats: '制圧 高 / 速度 低' },
    },
  },
  tyrannosaurus: {
    name: 'ティラノサウルス',
    shortName: 'ティラノ',
    lineage: 'ティラノサウルス系統',
    type: '高火力捕食型',
    trait: '高火力大型個体',
    origin: {
      name: '原種ティラノ',
      desc: '高い攻撃性を持つ基礎個体。',
      stats: '体力 中 / 攻撃 高 / 速度 中',
    },
    branches: {
      speed: { name: 'レグナクス', desc: '巨体の爆発力で獲物を捕まえる突進分岐。', condition: 'Lv5+ / 高速Lv3', stats: '爆発 高 / 火力 中' },
      hunting: { name: 'ヴェナトロス', desc: '追跡波と牙で逃げる敵を捕捉する分岐。', condition: 'Lv5+ / 狩猟Lv3', stats: '追跡 高 / 制圧 中' },
      attack: { name: 'レクスウォルグ', desc: '咆哮と噛砕波で広範囲を破壊する分岐。', condition: 'Lv5+ / 攻撃Lv3', stats: '破壊 高 / 速度 中' },
    },
  },
};

CODEX_DINOS.forEach((dino) => {
  const fix = CODEX_DISPLAY_FIXES[dino.id];
  if (!fix) return;
  Object.assign(dino, {
    name: fix.name,
    shortName: fix.shortName,
    lineage: fix.lineage,
    type: fix.type,
    trait: fix.trait,
    origin: fix.origin,
  });
  dino.branches.forEach((branch) => {
    const branchFix = fix.branches[branch.tag];
    if (branchFix) {
      Object.assign(branch, branchFix);
    }
  });
});

const ZERO_ROUTE_BRANCH = {
  id: 'zero',
  name: 'ZERO進化',
  tag: 'zero',
  image: 'assets/dinos/evolutions/zero_unknown_silhouette.png',
  codexImage: 'assets/dinos/evolutions/zero_unknown_silhouette.png',
  desc: 'ZEROルートは未解析です。',
  condition: 'ZERO CLEAR報酬で解析',
  stats: '未解析',
  zeroRoute: true,
  locked: true,
};

const CODEX_ASSETS = {
  backgroundV2: 'assets/ui/codex/codex_background_v2.png',
  archivePanelV2: 'assets/ui/codex/archive_panel_v2.png',
  selectedDinoPanelV3: 'assets/ui/codex/codex_selected_dino_panel_v3.png',
  dinoSelectorCardV3: 'assets/ui/codex/codex_selector_chip_a12b.png',
  branchCardKnownV3: 'assets/ui/codex/codex_card_known_a12b.png',
  branchCardUnknownV3: 'assets/ui/codex/codex_card_locked_a12b.png',
  branchCardZeroA12b: 'assets/ui/codex/codex_card_zero_a12b.png',
  originCardV3: 'assets/ui/codex/codex_card_known_a12b.png',
  portraitFrame: 'assets/ui/codex/codex_portrait_frame.png',
  unknownSilhouette: 'assets/ui/codex/codex_unknown_dino_silhouette.png',
  background: 'assets/ui/codex/codex_background.png',
  lineageCard: 'assets/ui/codex/lineage_card.png',
  velociraptorHero: 'assets/dinos/dino_select/velociraptor_hero.png',
  triceratopsHero: 'assets/dinos/dino_select/triceratops_hero.png',
  tyrannosaurusHero: 'assets/dinos/dino_select/tyrannosaurus_hero.png',
  spinosaurusHero: 'assets/dinos/dino_select/spinosaurus_hero.png',
  evolutionSpeed: 'assets/dinos/portraits/portrait_speed.png',
  evolutionHunting: 'assets/dinos/portraits/portrait_hunting.png',
  evolutionAttack: 'assets/dinos/portraits/portrait_attack.png',
  evolutionSpeedHero: 'assets/dinos/evolutions/heroes/velociraptor_speed_hero.png',
  evolutionHuntingHero: 'assets/dinos/evolutions/heroes/velociraptor_hunting_hero.png',
  evolutionAttackHero: 'assets/dinos/evolutions/heroes/velociraptor_attack_hero.png',
  velociraptorZeroHero: 'assets/dinos/evolutions/heroes/velociraptor_zero_hero.png',
  triceratopsSpeedHero: 'assets/dinos/evolutions/heroes/triceratops_speed_hero.png',
  triceratopsHuntingHero: 'assets/dinos/evolutions/heroes/triceratops_hunting_hero.png',
  triceratopsAttackHero: 'assets/dinos/evolutions/heroes/triceratops_attack_hero.png',
  triceratopsZeroHero: 'assets/dinos/evolutions/heroes/triceratops_zero_hero.png',
  tyrannosaurusSpeedHero: 'assets/dinos/evolutions/heroes/tyrannosaurus_speed_hero.png',
  tyrannosaurusHuntingHero: 'assets/dinos/evolutions/heroes/tyrannosaurus_hunting_hero.png',
  tyrannosaurusAttackHero: 'assets/dinos/evolutions/heroes/tyrannosaurus_attack_hero.png',
  tyrannosaurusZeroHero: 'assets/dinos/evolutions/heroes/tyrannosaurus_zero_hero.png',
  spinosaurusSpeedHero: 'assets/dinos/evolutions/heroes/spinosaurus_speed_hero.png',
  spinosaurusHuntingHero: 'assets/dinos/evolutions/heroes/spinosaurus_hunting_hero.png',
  spinosaurusAttackHero: 'assets/dinos/evolutions/heroes/spinosaurus_attack_hero.png',
  spinosaurusZeroHero: 'assets/dinos/evolutions/heroes/spinosaurus_zero_hero.png',
  zeroUnknownSilhouette: 'assets/dinos/evolutions/zero_unknown_silhouette.png',
  evolutionSpeedCodex: 'assets/dinos/evolutions/velociraptor_speed_codex.png',
  evolutionHuntingCodex: 'assets/dinos/evolutions/velociraptor_hunting_codex.png',
  evolutionAttackCodex: 'assets/dinos/evolutions/velociraptor_attack_codex.png',
};

const SELECTED_PANEL = {
  x: 18,
  y: 142,
  width: 354,
  height: 88,
  image: { x: 38, y: 154, width: 76, height: 60 },
  textX: 132,
};

const SELECTOR = {
  x: 18,
  y: 82,
  viewportWidth: 354,
  gap: 118,
  width: 110,
  height: 56,
  image: { x: 10, y: 6, width: 80, height: 30 },
};

const CARD = {
  x: 34,
  width: 322,
  height: 96,
  originY: 236,
  branchYs: [336, 430, 524, 618],
  image: { x: 24, y: 17, width: 50, height: 56 },
  textX: 92,
  textY: 10,
  textWidth: 214,
};

function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

function clampText(value, maxLength) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

export class CodexScreen {
  constructor({ width, height, saveManager, onHome, onResearch, onCodex, onOptions }) {
    this.width = width;
    this.height = height;
    this.saveManager = saveManager;
    this.onHome = onHome;
    this.onResearch = onResearch;
    this.onCodex = onCodex;
    this.onOptions = onOptions;
    this.view = new Container();
    this.selectedDinoId = CODEX_DINOS[0].id;
    this.gamepadFocusIndex = 0;
    this.assetTextures = {};

    this.background = new Graphics();
    this.backgroundSprite = new Sprite(Texture.EMPTY);
    this.fallbackPanel = new Graphics();
    this.branchLines = new Graphics();
    this.selectedPanelSprite = new Sprite(Texture.EMPTY);
    this.selectedImage = new Sprite(Texture.EMPTY);
    this.selectedImageFrame = new Sprite(Texture.EMPTY);
    this.selectedImageFallback = new Graphics();
    this.title = this.createText('分岐進化図鑑', 27, '#f4f7f5', 260);
    this.subtitle = this.createText('恐竜ごとの適応分岐を記録', 11, '#7cf7d4', 300);
    this.lineageText = this.createText('', 15, '#ffd36b', 190);
    this.typeText = this.createText('', 11, '#e7fff6', 190);
    this.foundText = this.createText('', 11, '#7cf7d4', 165);
    this.unresolvedText = this.createText('', 10, '#9fb7b0', 165);
    this.noteText = this.createText('進化カードは条件を優先表示。ZERO上位進化はルート解析後に表示されます。', 10, '#cbe0da', 330);

    this.dinoSelectors = [];
    this.dinoSelectorViewport = new Container();
    this.dinoSelectorContent = new Container();
    this.dinoSelectorMask = new Graphics();
    this.dinoSelectorHit = new Graphics();
    this.dinoSelectorScrollX = 0;
    this.dinoSelectorDrag = null;
    this.lastSelectorDragTime = 0;
    this.originCard = this.createBranchCard(true);
    this.branchCards = [0, 1, 2, 3].map(() => this.createBranchCard(false));
    this.bottomNav = createBottomNav({
      width: this.width,
      height: this.height,
      active: 'codex',
      onNavigate: (id) => this.handleNav(id),
    });

    [this.backgroundSprite, this.selectedPanelSprite, this.selectedImage, this.selectedImageFrame].forEach((sprite) => {
      sprite.visible = false;
    });
    this.selectedImage.anchor.set(0.5);
    this.selectedImageFrame.anchor.set(0.5);

    this.dinoSelectorViewport.position.set(SELECTOR.x, SELECTOR.y);
    this.dinoSelectorHit
      .rect(0, 0, SELECTOR.viewportWidth, SELECTOR.height)
      .fill({ color: 0x000000, alpha: 0.001 });
    this.dinoSelectorViewport.addChild(this.dinoSelectorHit, this.dinoSelectorContent);
    this.dinoSelectorViewport.mask = this.dinoSelectorMask;
    this.wireDinoSelectorScroll();

    this.noteText.visible = false;

    this.view.addChild(
      this.background,
      this.backgroundSprite,
      this.fallbackPanel,
      this.title,
      this.subtitle,
      this.dinoSelectorViewport,
      this.dinoSelectorMask,
    );
    this.createDinoSelectors();
    this.view.addChild(
      this.selectedPanelSprite,
      this.selectedImageFallback,
      this.selectedImage,
      this.selectedImageFrame,
      this.lineageText,
      this.typeText,
      this.foundText,
      this.unresolvedText,
      this.branchLines,
      this.originCard.view,
      ...this.branchCards.map((card) => card.view),
      this.noteText,
      this.bottomNav.view,
    );

    this.drawStatic();
    this.render();
    this.loadAssets();
  }

  async loadAssets() {
    await Promise.all(Object.entries(CODEX_ASSETS).map(async ([key, path]) => {
      try {
        this.assetTextures[key] = await Assets.load(assetUrl(path));
      } catch {
        this.assetTextures[key] = null;
      }
    }));
    this.applyAssetTextures();
    this.render();
  }

  applyAssetTextures() {
    const backgroundTexture = this.assetTextures.backgroundV2 ?? this.assetTextures.background;
    if (backgroundTexture) {
      this.backgroundSprite.texture = backgroundTexture;
      this.backgroundSprite.position.set(0, 0);
      this.backgroundSprite.width = this.width;
      this.backgroundSprite.height = this.height;
      this.backgroundSprite.alpha = 0.94;
      this.backgroundSprite.visible = true;
      this.background.clear();
    }
  }

  handleNav(id) {
    if (id === 'home') {
      this.onHome?.();
      return;
    }
    if (id === 'research') {
      this.onResearch?.();
      return;
    }
    if (id === 'options') {
      this.onOptions?.();
    }
  }

  show() {
    this.render();
    this.view.visible = true;
  }

  hide() {
    this.view.visible = false;
  }

  handleGamepadAction(actions = {}) {
    if (actions.cancelPressed) {
      this.onHome?.();
      return true;
    }

    if (actions.previousPressed || actions.nextPressed || actions.leftPressed || actions.rightPressed) {
      const delta = (actions.nextPressed || actions.rightPressed) ? 1 : -1;
      this.moveDinoFocus(delta);
      return true;
    }

    if (actions.confirmPressed) {
      this.render();
      return true;
    }

    return false;
  }

  moveDinoFocus(delta) {
    const currentIndex = CODEX_DINOS.findIndex((dino) => dino.id === this.selectedDinoId);
    const nextIndex = (currentIndex + delta + CODEX_DINOS.length) % CODEX_DINOS.length;
    this.gamepadFocusIndex = nextIndex;
    this.selectedDinoId = CODEX_DINOS[nextIndex].id;
    this.ensureSelectorVisible(nextIndex);
    this.render();
  }

  ensureSelectorVisible(index) {
    const itemX = index * SELECTOR.gap;
    const left = itemX + this.dinoSelectorScrollX;
    const right = left + SELECTOR.width;
    if (left < 0) {
      this.setDinoSelectorScroll(-itemX);
      return;
    }
    if (right > SELECTOR.viewportWidth) {
      this.setDinoSelectorScroll(SELECTOR.viewportWidth - itemX - SELECTOR.width);
    }
  }

  getGamepadFocusBounds() {
    if (!this.view.visible) {
      return null;
    }

    const index = CODEX_DINOS.findIndex((dino) => dino.id === this.selectedDinoId);
    if (index < 0) {
      return null;
    }

    return {
      x: SELECTOR.x + index * SELECTOR.gap + this.dinoSelectorScrollX,
      y: SELECTOR.y,
      width: SELECTOR.width,
      height: SELECTOR.height,
    };
  }

  createDinoSelectors() {
    CODEX_DINOS.forEach((dino, index) => {
      const selector = {
        dino,
        view: new Container(),
        frame: new Sprite(Texture.EMPTY),
        image: new Sprite(Texture.EMPTY),
        fallback: new Graphics(),
        selectedStroke: new Graphics(),
        name: this.createText('', 9, '#e7fff6', 82),
      };
      selector.view.position.set(index * SELECTOR.gap, 0);
      selector.view.eventMode = 'static';
      selector.view.cursor = 'pointer';
      selector.view.on('pointertap', () => {
        if (Date.now() - this.lastSelectorDragTime < 160) {
          return;
        }
        this.selectedDinoId = dino.id;
        this.render();
      });
      selector.frame.visible = false;
      selector.image.visible = false;
      selector.image.anchor.set(0.5);
      selector.name.anchor.set(0.5, 0);
      selector.name.position.set(SELECTOR.width / 2, 38);
      selector.view.addChild(selector.frame, selector.fallback, selector.image, selector.selectedStroke, selector.name);
      this.dinoSelectors.push(selector);
      this.dinoSelectorContent.addChild(selector.view);
    });
  }

  wireDinoSelectorScroll() {
    this.dinoSelectorViewport.eventMode = 'static';
    this.dinoSelectorViewport.cursor = 'grab';
    this.dinoSelectorViewport.on('pointerdown', (event) => {
      this.dinoSelectorDrag = {
        pointerId: event.pointerId,
        startX: event.global.x,
        startScrollX: this.dinoSelectorScrollX,
        moved: false,
      };
      this.dinoSelectorViewport.cursor = 'grabbing';
    });
    this.dinoSelectorViewport.on('pointermove', (event) => {
      if (!this.dinoSelectorDrag) {
        return;
      }
      const deltaX = event.global.x - this.dinoSelectorDrag.startX;
      if (Math.abs(deltaX) > 4) {
        this.dinoSelectorDrag.moved = true;
      }
      this.setDinoSelectorScroll(this.dinoSelectorDrag.startScrollX + deltaX);
    });
    const endDrag = () => {
      if (this.dinoSelectorDrag?.moved) {
        this.lastSelectorDragTime = Date.now();
      }
      this.dinoSelectorDrag = null;
      this.dinoSelectorViewport.cursor = 'grab';
    };
    this.dinoSelectorViewport.on('pointerup', endDrag);
    this.dinoSelectorViewport.on('pointerupoutside', endDrag);
    this.dinoSelectorViewport.on('pointercancel', endDrag);
  }

  setDinoSelectorScroll(value) {
    const contentWidth = (CODEX_DINOS.length - 1) * SELECTOR.gap + SELECTOR.width;
    const minX = Math.min(0, SELECTOR.viewportWidth - contentWidth);
    this.dinoSelectorScrollX = Math.max(minX, Math.min(0, value));
    this.dinoSelectorContent.position.x = this.dinoSelectorScrollX;
  }

  createBranchCard(isOrigin) {
    const card = {
      isOrigin,
      view: new Container(),
      frame: new Sprite(Texture.EMPTY),
      imageFrame: new Sprite(Texture.EMPTY),
      image: new Sprite(Texture.EMPTY),
      fallback: new Graphics(),
      imageFallback: new Graphics(),
      name: this.createText('', isOrigin ? 14 : 13, '#ffffff', CARD.textWidth),
      tag: this.createText('', 10, '#7cf7d4', CARD.textWidth),
      desc: this.createText('', 8, '#cbe0da', CARD.textWidth),
      condition: this.createText('', 8, '#ffd36b', CARD.textWidth),
      stats: this.createText('', 7, '#e7fff6', CARD.textWidth),
    };
    card.frame.visible = false;
    card.imageFrame.visible = false;
    card.image.visible = false;
    card.image.anchor.set(0.5);
    card.imageFrame.anchor.set(0.5);
    card.view.addChild(
      card.frame,
      card.fallback,
      card.imageFallback,
      card.image,
      card.imageFrame,
      card.name,
      card.tag,
      card.desc,
      card.condition,
      card.stats,
    );
    return card;
  }

  render() {
    const data = this.saveManager.getData();
    const discovered = normalizeDiscoveredEvolutions(data.discoveredEvolutions);
    const dino = CODEX_DINOS.find((entry) => entry.id === this.selectedDinoId) ?? CODEX_DINOS[0];
    const dinoUnlocked = this.isDinoUnlocked(dino, data);
    const branches = this.getDisplayBranches(dino);
    const foundBranches = dinoUnlocked ? branches.filter((branch) => this.isBranchFound(dino, branch, discovered)) : [];
    const unknownCount = branches.length - foundBranches.length;

    this.lineageText.text = dinoUnlocked ? dino.lineage : `${dino.name} / 未解放`;
    this.typeText.text = dinoUnlocked ? `${dino.type} / ${dino.trait}` : '研究で解放すると詳細を表示';
    this.foundText.text = `発見済み ${foundBranches.length} / ${branches.length}`;
    this.unresolvedText.text = `未解析 ${unknownCount}`;

    this.renderDinoSelectors(dino, data);
    this.renderSelectedDinoPanel(dino, foundBranches.length, unknownCount, dinoUnlocked);
    this.renderBranchLines();
    this.renderOriginCard(dino, dinoUnlocked);
    this.branchCards.forEach((card, index) => {
      this.renderBranchCard(card, dino, branches[index], discovered, index, dinoUnlocked);
    });
  }

  renderDinoSelectors(selectedDino, data) {
    this.dinoSelectors.forEach((selector) => {
      const selected = selector.dino.id === selectedDino.id;
      const unlocked = this.isDinoUnlocked(selector.dino, data);
      const texture = this.assetTextures.dinoSelectorCardV3;
      selector.name.text = selector.dino.shortName;
      selector.name.style.fill = unlocked ? selected ? '#ffffff' : '#9fb7b0' : '#8da49e';
      selector.selectedStroke.clear();
      if (texture) {
        selector.frame.texture = texture;
        selector.frame.position.set(0, 0);
        selector.frame.width = SELECTOR.width;
        selector.frame.height = SELECTOR.height;
        selector.frame.alpha = selected ? 1 : 0.58;
        selector.frame.visible = true;
        selector.fallback.clear();
      } else {
        selector.frame.visible = false;
        drawButtonFrame(selector.fallback, SELECTOR.width, SELECTOR.height, {
          accent: selected ? UI_COLORS.gold : UI_COLORS.dna,
          selected,
          glow: selected,
        });
      }
      if (selected) {
        selector.selectedStroke
          .roundRect(4, 4, SELECTOR.width - 8, SELECTOR.height - 8, 10)
          .stroke({ color: UI_COLORS.gold, width: 1.5, alpha: 0.78 });
      }
      const selectorTexture = unlocked ? this.getTextureForPath(selector.dino.image) : this.assetTextures.unknownSilhouette;
      this.applyImage(selector.image, selectorTexture, SELECTOR.image.x, SELECTOR.image.y, SELECTOR.image.width, SELECTOR.image.height, unlocked ? selected ? 1 : 0.62 : 0.7);
    });
  }

  renderSelectedDinoPanel(dino, foundCount, unknownCount, unlocked = true) {
    const texture = this.assetTextures.selectedDinoPanelV3 ?? this.assetTextures.archivePanelV2;
    if (texture) {
      this.selectedPanelSprite.texture = texture;
      this.selectedPanelSprite.position.set(SELECTED_PANEL.x, SELECTED_PANEL.y);
      this.selectedPanelSprite.width = SELECTED_PANEL.width;
      this.selectedPanelSprite.height = SELECTED_PANEL.height;
      this.selectedPanelSprite.alpha = 0.96;
      this.selectedPanelSprite.visible = true;
      this.fallbackPanel.clear();
    } else {
      this.selectedPanelSprite.visible = false;
      drawPanel(this.fallbackPanel, SELECTED_PANEL.x, SELECTED_PANEL.y, SELECTED_PANEL.width, SELECTED_PANEL.height, {
        accent: UI_COLORS.dna,
        alpha: 0.86,
        radius: 12,
      });
    }
    this.selectedImageFallback.clear();
    const imageTexture = unlocked ? this.getTextureForPath(dino.image) : this.assetTextures.unknownSilhouette;
    this.applyImage(this.selectedImage, imageTexture, SELECTED_PANEL.image.x, SELECTED_PANEL.image.y, SELECTED_PANEL.image.width, SELECTED_PANEL.image.height, unlocked ? 0.96 : 0.78);
    if (!imageTexture) {
      this.selectedImage.visible = false;
      this.selectedImageFallback
        .roundRect(SELECTED_PANEL.image.x, SELECTED_PANEL.image.y, SELECTED_PANEL.image.width, SELECTED_PANEL.image.height, 12)
        .fill({ color: 0x0b2026, alpha: 0.82 })
        .stroke({ color: UI_COLORS.dna, width: 1.6, alpha: 0.68 });
    }
    this.selectedImageFrame.visible = false;
    this.lineageText.position.set(SELECTED_PANEL.textX, 158);
    this.typeText.position.set(SELECTED_PANEL.textX, 181);
    this.foundText.position.set(SELECTED_PANEL.textX, 204);
    this.unresolvedText.position.set(266, 204);
    this.foundText.style.fill = foundCount > 0 ? '#ffd36b' : '#7cf7d4';
    this.unresolvedText.style.fill = unknownCount > 0 ? '#ff8f75' : '#9fb7b0';
  }

  renderBranchLines() {
    this.branchLines.clear();
    const lineX = 26;
    const lastBranchY = CARD.branchYs[CARD.branchYs.length - 1] ?? CARD.branchYs[0];
    this.branchLines
      .moveTo(lineX, 286)
      .lineTo(lineX, lastBranchY + CARD.height - 18)
      .stroke({ color: UI_COLORS.dna, width: 1.4, alpha: 0.32 });
    CARD.branchYs.map((y) => y + CARD.height / 2).forEach((y) => {
      this.branchLines
        .moveTo(lineX, y)
        .lineTo(CARD.x - 2, y)
        .stroke({ color: UI_COLORS.gold, width: 1.5, alpha: 0.48 })
        .circle(lineX, y, 4)
        .fill({ color: UI_COLORS.gold, alpha: 0.64 });
    });
  }

  renderOriginCard(dino, unlocked = true) {
    const card = this.originCard;
    card.view.position.set(CARD.x, CARD.originY);
    const texture = this.assetTextures.originCardV3 ?? this.assetTextures.lineageCard;
    this.renderFrame(card, texture, UI_COLORS.dna, unlocked);
    this.renderCardImage(card, unlocked ? this.getTextureForPath(dino.image) : this.assetTextures.unknownSilhouette, !unlocked);
    card.name.text = unlocked ? dino.origin.name : dino.name;
    card.tag.text = unlocked ? '原種 / 基礎系統' : '未解放';
    card.desc.text = unlocked ? clampText(dino.origin.desc, 20) : '研究で解放すると詳細を表示。';
    card.condition.text = unlocked ? clampText(dino.origin.stats, 18) : '解放条件: 研究';
    card.stats.text = '';
    this.positionCardTexts(card);
    card.name.style.fill = '#ffffff';
    card.tag.style.fill = '#7cf7d4';
    card.condition.style.fill = '#ffd36b';
  }

  renderBranchCard(card, dino, branch, discovered, index, dinoUnlocked = true) {
    if (!branch) {
      card.view.visible = false;
      return;
    }

    card.view.visible = true;
    const found = dinoUnlocked && this.isBranchFound(dino, branch, discovered);
    const meta = TAG_META[branch.tag] ?? TAG_META.speed;
    card.view.position.set(CARD.x, CARD.branchYs[index]);
    const unknownTextureFrame = branch.zeroRoute
      ? (this.assetTextures.branchCardZeroA12b ?? this.assetTextures.branchCardUnknownV3)
      : this.assetTextures.branchCardUnknownV3;
    const texture = found
      ? (this.assetTextures.branchCardKnownV3 ?? this.assetTextures.lineageCard)
      : (unknownTextureFrame ?? this.assetTextures.lineageCard);
    this.renderFrame(card, texture, meta.color, found);
    const cardTexture = this.getFirstTextureForPaths([
      branch.codexImage,
      branch.fallbackImage,
      branch.image,
      dino.image,
    ]);
    const unknownTexture = branch.zeroRoute
      ? (this.assetTextures.zeroUnknownSilhouette ?? this.assetTextures.unknownSilhouette)
      : this.assetTextures.unknownSilhouette;
    this.renderCardImage(card, found ? cardTexture : unknownTexture, !found);
    card.name.text = found ? branch.name : branch.zeroRoute ? 'ZERO進化' : branch.name !== '???' ? branch.name : '未解析分岐';
    card.tag.text = found ? this.getBranchCardTag(branch, meta) : branch.zeroRoute ? 'ZERO / 未解析' : `${meta.label} / 未解析`;
    card.desc.text = found ? this.getBranchCardDescription(branch) : branch.zeroRoute ? 'ZERO CLEARで解析されます。' : '条件達成で詳細を表示。';
    card.condition.text = found ? this.getBranchCardCondition(branch) : branch.zeroRoute ? '条件: ZEROルート報酬' : '条件: 進化分岐を発見';
    card.stats.text = found ? this.getBranchCardStats(branch) : '状態: 未解析';
    this.positionCardTexts(card);
    card.name.style.fill = found ? toCssColor(meta.color) : '#8da49e';
    card.tag.style.fill = found ? '#e7fff6' : '#768580';
    const conditionColor = this.getBranchConditionColor(branch);
    card.desc.style.fill = found ? conditionColor : '#889792';
    card.condition.style.fill = found ? conditionColor : '#ff8f75';
    card.stats.style.fill = found ? conditionColor : '#9fb7b0';
  }

  renderFrame(card, texture, accent, active) {
    card.fallback.clear();
    if (texture) {
      card.frame.texture = texture;
      card.frame.position.set(0, 0);
      card.frame.width = CARD.width;
      card.frame.height = CARD.height;
      card.frame.alpha = active ? 0.98 : 0.74;
      card.frame.visible = true;
      return;
    }
    card.frame.visible = false;
    drawButtonFrame(card.fallback, CARD.width, CARD.height, {
      accent,
      selected: active,
      glow: active,
    });
  }

  renderCardImage(card, texture, dimmed) {
    card.imageFallback.clear();
    this.applyImage(card.image, texture, CARD.image.x, CARD.image.y, CARD.image.width, CARD.image.height, dimmed ? 0.56 : 0.96, 'contain');
    card.imageFrame.visible = false;
    if (!texture) {
      card.image.visible = false;
      card.imageFallback
        .roundRect(CARD.image.x, CARD.image.y, CARD.image.width, CARD.image.height, 10)
        .fill({ color: 0x0a171c, alpha: 0.8 })
        .stroke({ color: UI_COLORS.dna, width: 1.2, alpha: 0.45 });
    }
  }

  positionCardTexts(card) {
    [card.name, card.tag, card.desc, card.condition, card.stats].forEach((text) => {
      text.style.wordWrapWidth = CARD.textWidth;
    });
    card.name.position.set(CARD.textX, CARD.textY);
    card.tag.position.set(CARD.textX, CARD.textY + 18);
    card.desc.position.set(CARD.textX, CARD.textY + 34);
    card.condition.position.set(CARD.textX, CARD.textY + 50);
    card.stats.position.set(CARD.textX, CARD.textY + 64);
  }

  getBranchCardDescription(branch) {
    const conditions = this.getBranchDisplayConditions(branch);
    if (conditions[0]) {
      return conditions[0];
    }
    return clampText(branch.desc, 21);
  }

  getBranchCardCondition(branch) {
    const conditions = this.getBranchDisplayConditions(branch);
    if (conditions[1]) {
      return conditions[1];
    }
    return `条件: ${clampText(branch.condition, 10)}`;
  }

  getBranchCardStats(branch) {
    const conditions = this.getBranchDisplayConditions(branch);
    if (conditions[2]) {
      return conditions[2];
    }
    if (conditions.length > 0) {
      return '';
    }
    return `特徴: ${clampText(branch.stats, 9)}`;
  }

  getBranchCardTag(branch, meta) {
    return branch.zeroRoute ? 'ZERO上位進化' : (branch.mutationName ?? meta.label);
  }

  getBranchConditionColor(branch) {
    const hasConditionLines = this.getBranchDisplayConditions(branch).length > 0;
    if (!hasConditionLines) {
      return '#cbe0da';
    }
    return branch.zeroRoute ? '#dcb7ff' : '#ffd36b';
  }

  getBranchDisplayConditions(branch) {
    return Array.isArray(branch.displayConditions) ? branch.displayConditions.filter(Boolean) : [];
  }

  drawStatic() {
    drawScreenBackground(this.background, this.width, this.height, UI_COLORS.dna);
    this.dinoSelectorMask
      .clear()
      .rect(SELECTOR.x, SELECTOR.y, SELECTOR.viewportWidth, SELECTOR.height)
      .fill({ color: 0xffffff, alpha: 1 });
    this.title.anchor.set(0.5);
    this.title.position.set(this.width / 2, 34);
    this.subtitle.anchor.set(0.5);
    this.subtitle.position.set(this.width / 2, 62);
    this.noteText.anchor.set(0.5);
    this.noteText.position.set(this.width / 2, this.height - UI_LAYOUT.bottomNavHeight - 18);
  }

  createText(text, size, fill, wordWrapWidth = 260) {
    return new Text({
      text,
      style: {
        fill,
        fontFamily: 'Zen Kaku Gothic New, Oxanium, Noto Sans JP, sans-serif',
        fontSize: size,
        fontWeight: '700',
        letterSpacing: 0,
        align: 'left',
        wordWrap: true,
        wordWrapWidth,
        breakWords: true,
      },
    });
  }

  applyImage(sprite, texture, x, y, width, height, alpha = 1, fit = 'contain') {
    if (!texture) {
      sprite.visible = false;
      return;
    }
    sprite.texture = texture;
    const sourceWidth = texture.width || width;
    const sourceHeight = texture.height || height;
    const scale = fit === 'cover'
      ? Math.max(width / sourceWidth, height / sourceHeight)
      : Math.min(width / sourceWidth, height / sourceHeight);
    sprite.width = sourceWidth * scale;
    sprite.height = sourceHeight * scale;
    sprite.position.set(x + width / 2, y + height / 2);
    sprite.alpha = alpha;
    sprite.visible = true;
  }

  getTextureForPath(path) {
    const entry = Object.entries(CODEX_ASSETS).find(([, assetPath]) => assetPath === path);
    return entry ? this.assetTextures[entry[0]] : null;
  }

  getFirstTextureForPaths(paths) {
    for (const path of paths) {
      if (!path) {
        continue;
      }
      const texture = this.getTextureForPath(path);
      if (texture) {
        return texture;
      }
    }
    return null;
  }

  getDisplayBranches(dino) {
    const branches = dino.branches.map((branch) => this.getHydratedBranch(dino, branch));
    if (branches.some((branch) => branch.id === ZERO_ROUTE_BRANCH.id)) {
      return branches;
    }

    return [...branches, this.getZeroRouteBranch(dino)];
  }

  getHydratedBranch(dino, branch) {
    if (branch.locked || branch.zeroRoute) {
      return branch;
    }

    const dataBranch = getEvolutionBranch(dino.id, branch.tag ?? branch.id);
    if (!dataBranch) {
      return branch;
    }

    return {
      ...branch,
      id: dataBranch.tag,
      name: dataBranch.evolutionName,
      tag: dataBranch.tag,
      image: dataBranch.heroPath ?? branch.image,
      codexImage: dataBranch.heroPath ?? branch.codexImage,
      fallbackImage: branch.fallbackImage ?? dino.image,
      desc: dataBranch.description ?? branch.desc,
      condition: dataBranch.condition ?? branch.condition,
      stats: dataBranch.role ?? branch.stats,
      mutationName: dataBranch.mutationName,
      displayConditions: dataBranch.displayConditions ?? branch.displayConditions,
    };
  }

  getZeroRouteBranch(dino) {
    const branch = getEvolutionBranch(dino.id, 'zero');

    if (!branch || branch.evolutionName === '???') {
      return ZERO_ROUTE_BRANCH;
    }

    return {
      id: 'zero',
      name: branch.evolutionName,
      tag: 'zero',
      image: branch.heroPath,
      codexImage: branch.heroPath,
      fallbackImage: dino.image,
      desc: branch.description,
      condition: branch.condition,
      stats: branch.role,
      mutationName: branch.mutationName,
      displayConditions: branch.displayConditions,
      zeroRoute: true,
      locked: true,
    };
  }

  isDinoUnlocked(dino, data = this.saveManager.getData()) {
    if (!dino) {
      return false;
    }

    if (!dino.locked && dino.id !== 'spinosaurus') {
      return true;
    }

    const debug = new URLSearchParams(window.location.search);
    return data?.unlockedDinos?.[dino.id]?.unlocked
      || debug.get('debugUnlockDino') === dino.id
      || debug.get('debugUnlockAllDinos') === '1';
  }

  isBranchFound(dino, branch, discovered) {
    const debug = new URLSearchParams(window.location.search);

    if (debug.get('debugDiscoverAllEvolutions') === '1') {
      return true;
    }

    if (branch.zeroRoute) {
      return isEvolutionDiscovered(discovered, dino.id, 'zero')
        || debug.get('debugUnlockZeroRoute') === `${dino.id}_zero`;
    }

    if (branch.locked) {
      return false;
    }

    const debugEvolution = debug.get('debugEvolution') ?? debug.get('debugEvolutionUnlock') ?? debug.get('debugForceEvolution');
    const debugDino = debug.get('debugDino');
    const debugDinoMatches = !debugDino || debugDino === dino.id;

    return isEvolutionDiscovered(discovered, dino.id, branch.tag)
      || (debugDinoMatches && debugEvolution === branch.tag);
  }
}
