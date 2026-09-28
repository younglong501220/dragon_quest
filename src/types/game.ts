export type GameState = 
  | 'TITLE'
  | 'MAP'
  | 'BATTLE'
  | 'SPELL_MENU'
  | 'ITEM_MENU'
  | 'SHOP'
  | 'STATS'
  | 'GUIDE'
  | 'GAMEOVER'
  | 'VICTORY';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface HeroState {
  x: number;
  y: number;
  direction: Direction;
  lv: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  atk: number;
  def: number;
  gold: number;
  exp: number;
  herbs: number;
  wings: number;
  fairyWaters: number;
  hasLotoSword: boolean;
  hasLotoArmor: boolean;
  equippedWeapon: string;
  equippedArmor: string;
  stepsCount: number;
  monstersSlain: number;
}

export interface Monster {
  id: string;
  name: string;
  nameZh: string;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  exp: number;
  gold: number;
  color: string;
  sprite: 'slime' | 'red_slime' | 'skel' | 'knight' | 'dragon' | 'boss' | 'boss_true';
  spellChance?: number;
  fireBreathChance?: number;
  description?: string;
}

export interface Spell {
  id: string;
  name: string;
  nameZh: string;
  mpCost: number;
  requiredLv: number;
  type: 'heal' | 'attack' | 'utility';
  power: number;
  description: string;
}

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  description: string;
  type: 'item' | 'weapon' | 'armor';
  atkBonus?: number;
  defBonus?: number;
}
