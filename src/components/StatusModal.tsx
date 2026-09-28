import React from 'react';
import { X, Shield, Sword, Heart, Zap, Coins, Sparkles, Feather, Compass } from 'lucide-react';
import { HeroState } from '../types/game';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  hero: HeroState;
  onUseHerb: () => void;
  onUseWing: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  hero,
  onUseHerb,
  onUseWing,
}) => {
  if (!isOpen) return null;

  const nextLvExp = hero.lv * 15;
  const expRemaining = Math.max(0, nextLvExp - hero.exp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="dq-frame max-w-lg w-full p-4 sm:p-6 bg-black text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-base sm:text-lg">
              勇者之書 · 能力與行囊
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded border border-stone-700 hover:border-stone-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Attributes Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs sm:text-sm">
          <div className="p-3 bg-stone-900 border border-stone-700 rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-stone-400">等級 (Level):</span>
              <span className="font-bold text-amber-400 text-sm">Lv.{hero.lv}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-red-500" /> HP:
              </span>
              <span className="font-mono font-bold text-stone-100">
                {hero.hp} / {hero.maxHp}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-sky-400" /> MP:
              </span>
              <span className="font-mono font-bold text-stone-100">
                {hero.mp} / {hero.maxMp}
              </span>
            </div>
          </div>

          <div className="p-3 bg-stone-900 border border-stone-700 rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-stone-400 flex items-center gap-1">
                <Sword className="w-3.5 h-3.5 text-amber-400" /> 攻擊力 (ATK):
              </span>
              <span className="font-mono font-bold text-amber-300">{hero.atk}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-400" /> 防禦力 (DEF):
              </span>
              <span className="font-mono font-bold text-blue-300">{hero.def}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-yellow-400" /> 金幣 (Gold):
              </span>
              <span className="font-mono font-bold text-yellow-300">{hero.gold} G</span>
            </div>
          </div>
        </div>

        {/* Experience & Level Progress */}
        <div className="p-3 bg-stone-900 border border-stone-700 rounded mb-4 text-xs sm:text-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-stone-400">目前累積經驗值 (EXP):</span>
            <span className="font-mono text-stone-200">{hero.exp}</span>
          </div>
          <div className="flex justify-between items-center text-stone-400 text-[11px]">
            <span>距離升至 Lv.{hero.lv + 1} 尚需：</span>
            <span className="text-amber-400 font-mono font-bold">{expRemaining} EXP</span>
          </div>
        </div>

        {/* Equipment & Relics */}
        <div className="p-3 bg-stone-900 border border-stone-700 rounded mb-4 text-xs sm:text-sm space-y-2">
          <div className="font-bold text-amber-300 text-xs border-b border-stone-800 pb-1 mb-2">
            當前裝備與傳奇神器
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-400">武器：</span>
            <span className={`font-semibold ${hero.hasLotoSword ? 'text-amber-300 flex items-center gap-1' : 'text-stone-200'}`}>
              {hero.hasLotoSword ? '✨ 羅德之劍 (Erdrick Sword +15)' : hero.equippedWeapon}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-400">防具：</span>
            <span className="text-stone-200 font-semibold">{hero.equippedArmor}</span>
          </div>
        </div>

        {/* Consumables Inventory */}
        <div className="p-3 bg-stone-900 border border-stone-700 rounded mb-4">
          <div className="font-bold text-amber-300 text-xs border-b border-stone-800 pb-1 mb-2">
            冒險行囊道具
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-stone-800/80 rounded border border-stone-700">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>藥草 × {hero.herbs}</span>
              </div>
              <button
                disabled={hero.herbs <= 0 || hero.hp >= hero.maxHp}
                onClick={onUseHerb}
                className="px-2 py-1 bg-stone-700 hover:bg-emerald-700 disabled:opacity-30 rounded text-[11px] font-bold cursor-pointer transition-colors"
              >
                使用
              </button>
            </div>

            <div className="flex items-center justify-between p-2 bg-stone-800/80 rounded border border-stone-700">
              <div className="flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-sky-400" />
                <span>奇美拉之翼 × {hero.wings}</span>
              </div>
              <button
                disabled={hero.wings <= 0}
                onClick={onUseWing}
                className="px-2 py-1 bg-stone-700 hover:bg-sky-700 disabled:opacity-30 rounded text-[11px] font-bold cursor-pointer transition-colors"
              >
                返城
              </button>
            </div>
          </div>
        </div>

        {/* Adventure stats */}
        <div className="flex justify-between text-[11px] text-stone-400 px-1">
          <span>👣 累計步數：{hero.stepsCount} 步</span>
          <span>⚔️ 討伐魔物數：{hero.monstersSlain} 隻</span>
        </div>

        {/* Close Button */}
        <div className="mt-4 pt-3 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 border-2 border-stone-600 rounded text-stone-200 font-bold text-xs sm:text-sm cursor-pointer"
          >
            返回冒險
          </button>
        </div>
      </div>
    </div>
  );
};
