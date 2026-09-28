import React from 'react';

interface RetroDpadProps {
  onMove: (dx: number, dy: number) => void;
  onInteract: () => void;
  disabled?: boolean;
}

export const RetroDpad: React.FC<RetroDpadProps> = ({ onMove, onInteract, disabled = false }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-2 select-none">
      <div className="grid grid-cols-3 gap-1.5 w-48 h-48 p-2 bg-stone-900 border-2 border-stone-700 rounded-2xl shadow-inner">
        {/* Row 1 */}
        <div />
        <button
          type="button"
          disabled={disabled}
          onClick={() => onMove(0, -1)}
          className="bg-stone-800 hover:bg-stone-700 active:bg-amber-600 disabled:opacity-40 text-stone-200 border-2 border-stone-600 rounded-lg flex items-center justify-center font-bold text-xl transition-transform active:scale-95 shadow cursor-pointer"
          aria-label="向上移動"
        >
          ▲
        </button>
        <div />

        {/* Row 2 */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onMove(-1, 0)}
          className="bg-stone-800 hover:bg-stone-700 active:bg-amber-600 disabled:opacity-40 text-stone-200 border-2 border-stone-600 rounded-lg flex items-center justify-center font-bold text-xl transition-transform active:scale-95 shadow cursor-pointer"
          aria-label="向左移動"
        >
          ◀
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={onInteract}
          className="bg-amber-600 hover:bg-amber-500 active:bg-amber-700 disabled:opacity-40 text-white border-2 border-amber-400 rounded-full flex flex-col items-center justify-center font-bold text-xs shadow-md transition-transform active:scale-90 cursor-pointer"
          aria-label="調查或對話"
        >
          <span>A</span>
          <span className="text-[9px] opacity-80">對話</span>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onMove(1, 0)}
          className="bg-stone-800 hover:bg-stone-700 active:bg-amber-600 disabled:opacity-40 text-stone-200 border-2 border-stone-600 rounded-lg flex items-center justify-center font-bold text-xl transition-transform active:scale-95 shadow cursor-pointer"
          aria-label="向右移動"
        >
          ▶
        </button>

        {/* Row 3 */}
        <div />
        <button
          type="button"
          disabled={disabled}
          onClick={() => onMove(0, 1)}
          className="bg-stone-800 hover:bg-stone-700 active:bg-amber-600 disabled:opacity-40 text-stone-200 border-2 border-stone-600 rounded-lg flex items-center justify-center font-bold text-xl transition-transform active:scale-95 shadow cursor-pointer"
          aria-label="向下移動"
        >
          ▼
        </button>
        <div />
      </div>

      <p className="text-[11px] text-stone-400 text-center mt-2">
        鍵盤：[W/A/S/D] 或 [方向鍵] 移動，[Enter/空白鍵] 調查/對話
      </p>
    </div>
  );
};
