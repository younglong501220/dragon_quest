import { Monster, Spell, ShopItem } from '../types/game';

export const MAP_W = 15;
export const MAP_H = 10;
export const TILE_SIZE = 32;

/**
 * 0: 草地 (Grass)
 * 1: 樹林 (Forest - Higher encounter rate)
 * 2: 高山 (Mountain - Impassable)
 * 3: 拉達托姆城 (Tantegel / Radatome Castle - King heals & saves)
 * 4: 龍王城 (Charlock Castle - Dragonlord Boss)
 * 5: 羅德之洞窟 (Cave of Erdrick / Loto - Erdrick's Sword)
 * 6: 毒沼 (Poison Marsh - 2 HP damage per step)
 * 7: 道具鎮 (Radatome Town - Shop & Inn)
 * 8: 水域 (Water - Impassable)
 */
export const DEFAULT_MAP: number[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 7, 0, 1, 1, 0, 0, 0, 2, 2, 0, 5, 0, 2],
  [2, 0, 0, 1, 1, 0, 0, 2, 0, 0, 2, 0, 0, 0, 2],
  [2, 0, 1, 1, 0, 0, 2, 2, 2, 0, 0, 0, 1, 0, 2],
  [2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 1, 1, 1, 0, 2],
  [2, 2, 0, 0, 2, 2, 6, 6, 6, 1, 1, 0, 0, 0, 2],
  [2, 0, 0, 0, 0, 0, 6, 2, 2, 0, 0, 0, 2, 2, 2],
  [2, 0, 1, 1, 0, 0, 6, 2, 4, 2, 0, 0, 0, 0, 2],
  [2, 0, 0, 1, 1, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
];

export const INITIAL_HERO = {
  x: 1,
  y: 1,
  direction: 'down' as const,
  lv: 1,
  hp: 24,
  maxHp: 24,
  mp: 6,
  maxMp: 6,
  atk: 10,
  def: 6,
  gold: 10,
  exp: 0,
  herbs: 2,
  wings: 1,
  fairyWaters: 0,
  hasLotoSword: false,
  hasLotoArmor: false,
  equippedWeapon: '竹槍 (Bamboo Pole)',
  equippedArmor: '布衣 (Clothes)',
  stepsCount: 0,
  monstersSlain: 0,
};

export const MONSTERS: Monster[] = [
  {
    id: 'slime',
    name: 'Slime',
    nameZh: '史萊姆 (Slime)',
    hp: 8,
    maxHp: 8,
    atk: 7,
    def: 2,
    exp: 3,
    gold: 4,
    color: '#38bdf8',
    sprite: 'slime',
    description: '圓滾滾帶有笑臉的水滴狀魔物，亞雷夫加爾德最經典的新手怪物。',
  },
  {
    id: 'red_slime',
    name: 'Red Slime',
    nameZh: '史萊姆貝斯 (Red Slime)',
    hp: 14,
    maxHp: 14,
    atk: 10,
    def: 4,
    exp: 6,
    gold: 8,
    color: '#ef4444',
    sprite: 'red_slime',
    description: '比普通史萊姆更強悍好戰的紅色變種。',
  },
  {
    id: 'skel',
    name: 'Skeleton',
    nameZh: '骷髏兵 (Skeleton)',
    hp: 22,
    maxHp: 22,
    atk: 15,
    def: 6,
    exp: 15,
    gold: 18,
    color: '#e2e8f0',
    sprite: 'skel',
    description: '手持殘破長劍的死者骨骸，受龍王邪氣操縱游蕩於原野。',
  },
  {
    id: 'knight',
    name: 'Knight',
    nameZh: '重裝死騎 (Dark Knight)',
    hp: 36,
    maxHp: 36,
    atk: 20,
    def: 11,
    exp: 28,
    gold: 36,
    color: '#64748b',
    sprite: 'knight',
    description: '披戴沉重板甲的墮落騎士，防禦力驚人。',
  },
  {
    id: 'dragon',
    name: 'Dragon',
    nameZh: '翡翠巨龍 (Dragon)',
    hp: 58,
    maxHp: 58,
    atk: 26,
    def: 14,
    exp: 58,
    gold: 70,
    color: '#22c55e',
    sprite: 'dragon',
    fireBreathChance: 0.35,
    description: '守護魔王要塞邊境的巨龍，能吐出炙熱烈焰！',
  },
  {
    id: 'boss',
    name: 'Dragonlord',
    nameZh: '龍王 (Dragonlord)',
    hp: 135,
    maxHp: 135,
    atk: 34,
    def: 18,
    exp: 999,
    gold: 999,
    color: '#a855f7',
    sprite: 'boss',
    spellChance: 0.4,
    fireBreathChance: 0.35,
    description: '奪走光之玉的萬惡魔王，居於南方的漆黑城堡。',
  },
];

export const SPELLS: Spell[] = [
  {
    id: 'hoimi',
    name: 'Heal',
    nameZh: '荷伊米 (Heal)',
    mpCost: 3,
    requiredLv: 1,
    type: 'heal',
    power: 26,
    description: '消耗 3 MP，借用神聖之光回復約 25~32 點 HP。',
  },
  {
    id: 'gira',
    name: 'Hurt',
    nameZh: '吉拉 (Fire)',
    mpCost: 4,
    requiredLv: 2,
    type: 'attack',
    power: 18,
    description: '消耗 4 MP，召喚一團烈火灼燒敵方，造成約 16~24 點傷害。',
  },
  {
    id: 'rula',
    name: 'Return',
    nameZh: '盧拉 (Return)',
    mpCost: 6,
    requiredLv: 4,
    type: 'utility',
    power: 0,
    description: '消耗 6 MP，瞬間穿越空間返回拉達托姆城王座前。',
  },
  {
    id: 'behoimi',
    name: 'Healmore',
    nameZh: '貝霍伊米 (Healmore)',
    mpCost: 8,
    requiredLv: 6,
    type: 'heal',
    power: 80,
    description: '消耗 8 MP，強效高級神聖咒文，大幅回復 75~90 點 HP。',
  },
  {
    id: 'begirama',
    name: 'Hurtmore',
    nameZh: '貝基拉瑪 (Flame)',
    mpCost: 10,
    requiredLv: 8,
    type: 'attack',
    power: 55,
    description: '消耗 10 MP，最強炎系咒文，引發轟天烈焰造成 50~65 點毀滅傷害！',
  },
];

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'herb',
    name: '藥草 (Medicinal Herb)',
    cost: 12,
    description: '隨身攜帶的野草，使用可回復約 22 點 HP。',
    type: 'item',
  },
  {
    id: 'wing',
    name: '奇美拉之翼 (Chimaera Wing)',
    cost: 24,
    description: '神奇的魔鳥之翼，在野外使用可立刻飛回拉達托姆城。',
    type: 'item',
  },
  {
    id: 'fairy_water',
    name: '聖水 (Holy Water)',
    cost: 35,
    description: '灑在身上能在短時間內驅散弱小魔物。',
    type: 'item',
  },
  {
    id: 'copper_sword',
    name: '銅劍 (Copper Sword)',
    cost: 160,
    description: '精煉銅鑄成的鋒利短劍，攻擊力提升 +8。',
    type: 'weapon',
    atkBonus: 8,
  },
  {
    id: 'iron_armor',
    name: '鐵鎧甲 (Iron Armor)',
    cost: 280,
    description: '以堅實鐵片打磨串聯的護胸鎧甲，防禦力提升 +9。',
    type: 'armor',
    defBonus: 9,
  },
];
