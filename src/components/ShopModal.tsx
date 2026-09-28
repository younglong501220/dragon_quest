import React from 'react';
import { X, ShoppingBag, Coins, ShieldCheck, Sword, Sparkles, Feather } from 'lucide-react';
import { HeroState, ShopItem } from '../types/game';
import { SHOP_ITEMS } from '../data/gameData';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  hero: HeroState;
  onBuyItem: (item: ShopItem) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  hero,
  onBuyItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="dq-frame max-w-lg w-full p-4 sm:p-6 bg-black text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-700 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-amber-400">
              拉達托姆鎮 · 道具與武器屋
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded border border-stone-700 hover:border-stone-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shopkeeper Speech */}
        <div className="p-2.5 bg-stone-900 border border-stone-800 rounded mb-3 text-xs sm:text-sm text-stone-300">
          老闆：「歡迎光臨！這是前往南方討伐魔物必備的防具與乾糧，請隨意挑選！」
          <div className="mt-1 flex items-center gap-1.5 font-bold text-amber-300">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>目前持金：{hero.gold} G</span>
          </div>
        </div>

        {/* Item List */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          {SHOP_ITEMS.map((item) => {
            const canAfford = hero.gold >= item.cost;
            const alreadyHasWeapon = item.type === 'weapon' && (hero.hasLotoSword || hero.equippedWeapon.includes('銅劍'));
            const alreadyHasArmor = item.type === 'armor' && (hero.hasLotoArmor || hero.equippedArmor.includes('鐵鎧甲'));
            const disabled = !canAfford || alreadyHasWeapon || alreadyHasArmor;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 bg-stone-900 border border-stone-700 hover:border-stone-500 rounded text-xs sm:text-sm transition-colors"
              >
                <div className="flex-1 mr-3">
                  <div className="flex items-center gap-2 font-bold text-stone-100">
                    {item.type === 'weapon' && <Sword className="w-4 h-4 text-amber-400" />}
                    {item.type === 'armor' && <ShieldCheck className="w-4 h-4 text-blue-400" />}
                    {item.id === 'herb' && <Sparkles className="w-4 h-4 text-emerald-400" />}
                    {item.id === 'wing' && <Feather className="w-4 h-4 text-sky-400" />}
                    <span>{item.name}</span>
                    <span className="text-yellow-400 font-mono">({item.cost} G)</span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">{item.description}</div>
                </div>

                <button
                  disabled={disabled}
                  onClick={() => onBuyItem(item)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 disabled:opacity-40 disabled:bg-stone-800 text-white rounded font-bold text-xs border border-amber-400 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {alreadyHasWeapon || alreadyHasArmor ? '已擁有' : '購買'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 border-2 border-stone-600 rounded text-stone-200 font-bold text-xs sm:text-sm cursor-pointer"
          >
            離開商店
          </button>
        </div>
      </div>
    </div>
  );
};
