import React from 'react';
import { X, Sword, Shield, Flame, Sparkles, MapPin, Trophy } from 'lucide-react';

interface GameGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameGuideModal: React.FC<GameGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="dq-frame max-w-xl w-full max-h-[85vh] flex flex-col p-4 sm:p-6 bg-black text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-amber-400">
              亞雷夫加爾德冒險指南與通關秘笈
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded border border-stone-700 hover:border-stone-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-5 text-xs sm:text-sm text-stone-300 pr-1">
          {/* Section 1: Controls */}
          <div>
            <h3 className="text-amber-300 font-bold mb-2 flex items-center gap-1.5 text-sm">
              <Sword className="w-4 h-4 text-amber-400" />
              1. 基本操作
            </h3>
            <ul className="list-disc list-inside space-y-1 text-stone-300 pl-1 leading-relaxed">
              <li>
                <span className="text-white font-semibold">移動</span>：鍵盤方向鍵、
                <kbd className="px-1 py-0.5 bg-stone-800 border border-stone-600 rounded text-[11px]">W/A/S/D</kbd>
                ，或畫面下方的十字虛擬按鈕。
              </li>
              <li>
                <span className="text-white font-semibold">對話 / 休息</span>：按
                <kbd className="px-1 py-0.5 bg-stone-800 border border-stone-600 rounded text-[11px]">Enter</kbd>
                或
                <kbd className="px-1 py-0.5 bg-stone-800 border border-stone-600 rounded text-[11px]">空白鍵</kbd>
                ，在城堡國王會<strong className="text-emerald-400">免費為你補滿 HP 與 MP</strong>。
              </li>
              <li>
                <span className="text-white font-semibold">戰鬥快捷鍵</span>：戰鬥中可按數字鍵
                <kbd className="px-1 py-0.5 bg-stone-800 border border-stone-600 rounded text-[11px]">1</kbd>(攻擊)、
                <kbd className="px-1 py-0.5 bg-stone-800 border border-stone-600 rounded text-[11px]">2</kbd>(咒文)、
                <kbd className="px-1 py-0.5 bg-stone-800 border border-stone-600 rounded text-[11px]">3</kbd>(藥草)、
                <kbd className="px-1 py-0.5 bg-stone-800 border border-stone-600 rounded text-[11px]">4</kbd>(逃跑)。
              </li>
            </ul>
          </div>

          {/* Section 2: World Landmarks */}
          <div>
            <h3 className="text-amber-300 font-bold mb-2 flex items-center gap-1.5 text-sm">
              <MapPin className="w-4 h-4 text-sky-400" />
              2. 世界地圖重要地標
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 bg-stone-900 border border-stone-700 rounded">
                <div className="text-sky-400 font-bold mb-1">🏰 拉達托姆城 (Tantegel)</div>
                <div className="text-stone-400 text-[11px]">
                  勇者的啟程點。覲見羅里克國王可免費回復所有 HP/MP，並妥善記錄冒險之書。
                </div>
              </div>
              <div className="p-2.5 bg-stone-900 border border-stone-700 rounded">
                <div className="text-amber-400 font-bold mb-1">🗡️ 羅德之洞窟 (Cave of Erdrick)</div>
                <div className="text-stone-400 text-[11px]">
                  位於大陸東北方深處。勇者踏入可獲得傳奇神兵<strong className="text-amber-300">「羅德之劍」</strong>，攻擊力大幅提升 +15！
                </div>
              </div>
              <div className="p-2.5 bg-stone-900 border border-stone-700 rounded">
                <div className="text-emerald-400 font-bold mb-1">🌲 樹林與草地</div>
                <div className="text-stone-400 text-[11px]">
                  草地遇敵率 18%，深綠色樹林遇敵率 30%，是勇者前期磨練等級的最佳場所。
                </div>
              </div>
              <div className="p-2.5 bg-stone-900 border border-stone-700 rounded">
                <div className="text-purple-400 font-bold mb-1">🐉 龍王魔城 (Charlock Castle)</div>
                <div className="text-stone-400 text-[11px]">
                  位於南方深淵的終極要塞，周遭有毒沼環繞。踏入即觸發魔王「龍王」死鬥！
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Spells */}
          <div>
            <h3 className="text-amber-300 font-bold mb-2 flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              3. 經典咒文解析
            </h3>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center p-2 bg-stone-900 border border-stone-800 rounded">
                <div>
                  <span className="text-emerald-400 font-bold">荷伊米 (Hoimi / Heal)</span>
                  <span className="text-stone-400 text-[11px] ml-2">消費 3 MP</span>
                </div>
                <span className="text-stone-300 text-xs">回復約 25~32 點 HP</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-stone-900 border border-stone-800 rounded">
                <div>
                  <span className="text-red-400 font-bold">吉拉 (Gira / Hurt)</span>
                  <span className="text-stone-400 text-[11px] ml-2">消費 4 MP</span>
                </div>
                <span className="text-stone-300 text-xs">火焰魔法造成 16~24 點傷害</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-stone-900 border border-stone-800 rounded">
                <div>
                  <span className="text-sky-400 font-bold">盧拉 (Return)</span>
                  <span className="text-stone-400 text-[11px] ml-2">Lv.4 習得 / 6 MP</span>
                </div>
                <span className="text-stone-300 text-xs">穿越空間瞬間返回拉達托姆城</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-stone-900 border border-stone-800 rounded">
                <div>
                  <span className="text-emerald-300 font-bold">貝霍伊米 (Behoimi)</span>
                  <span className="text-stone-400 text-[11px] ml-2">Lv.6 習得 / 8 MP</span>
                </div>
                <span className="text-stone-300 text-xs">強效高級神聖之光回復 80 HP</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-stone-900 border border-stone-800 rounded">
                <div>
                  <span className="text-amber-400 font-bold">貝基拉瑪 (Begirama)</span>
                  <span className="text-stone-400 text-[11px] ml-2">Lv.8 習得 / 10 MP</span>
                </div>
                <span className="text-stone-300 text-xs">轟天烈焰狂轟 50~65 點極致傷害</span>
              </div>
            </div>
          </div>

          {/* Section 4: Recommended Strategy */}
          <div className="p-3 bg-amber-950/30 border border-amber-800/60 rounded">
            <h3 className="text-amber-300 font-bold mb-2 flex items-center gap-1.5 text-sm">
              <Flame className="w-4 h-4 text-amber-500" />
              4. 傳奇通關流程攻略
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-stone-200 text-xs sm:text-sm">
              <li>
                在拉達托姆城周圍森林打「史萊姆」與「骷髏兵」升到 <strong className="text-amber-300">Lv.3 ~ Lv.4</strong>，隨時回城滿血滿魔。
              </li>
              <li>
                沿著上方道路前往東北角【羅德之洞窟】取得神器<strong className="text-amber-300">「羅德之劍」</strong>。
              </li>
              <li>
                前往城旁道具鎮購買【鐵鎧甲】強化防禦，並備妥若干【藥草】。
              </li>
              <li>
                回城補滿血魔後，直搗南方【龍王城】，善用「吉拉」與「荷伊米」即可順利擊潰龍王拯救世界！
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 border-2 border-stone-600 rounded text-stone-200 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            關閉指南
          </button>
        </div>
      </div>
    </div>
  );
};
