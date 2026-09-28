import React from 'react';
import { Volume2, VolumeX, Music, Tv, BookOpen, User, Save, RotateCcw } from 'lucide-react';
import { GameState } from '../types/game';

interface HeaderNavProps {
  gameState: GameState;
  onOpenGuide: () => void;
  onOpenStats: () => void;
  onSaveGame: () => void;
  onResetGame: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
  isBgmMuted: boolean;
  onToggleBgm: () => void;
  isCrtEnabled: boolean;
  onToggleCrt: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenGuide,
  onOpenStats,
  onSaveGame,
  onResetGame,
  isSoundMuted,
  onToggleSound,
  isBgmMuted,
  onToggleBgm,
  isCrtEnabled,
  onToggleCrt,
}) => {
  return (
    <header className="w-full max-w-4xl flex items-center justify-between px-3 sm:px-6 py-3 border-b border-stone-800 bg-black/80 backdrop-blur-sm z-30">
      {/* Zone 1: Single text wordmark */}
      <div className="flex items-center gap-2">
        <span className="text-amber-400 font-bold tracking-wider text-base sm:text-lg select-none">
          DRAGON QUEST I
        </span>
        <span className="text-stone-400 text-xs hidden sm:inline">
          復刻致敬版
        </span>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-stone-300">
        <button
          onClick={onOpenStats}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
          title="勇者狀態與裝備"
        >
          <User className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden xs:inline">勇者狀態</span>
        </button>

        <button
          onClick={onOpenGuide}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
          title="冒險指南與攻略"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xs:inline">攻略指南</span>
        </button>

        <button
          onClick={onSaveGame}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded hover:bg-stone-800 hover:text-emerald-400 transition-colors cursor-pointer"
          title="保存冒險之書"
        >
          <Save className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">記錄存檔</span>
        </button>
      </nav>

      {/* Zone 3: Control Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onToggleCrt}
          className={`p-1.5 sm:px-2 sm:py-1.5 rounded text-xs flex items-center gap-1 border transition-colors cursor-pointer ${
            isCrtEnabled
              ? 'bg-amber-950/60 border-amber-600 text-amber-300'
              : 'border-stone-700 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
          title="復古 CRT 掃描線濾鏡"
        >
          <Tv className="w-3.5 h-3.5" />
          <span className="hidden md:inline">CRT</span>
        </button>

        <button
          onClick={onToggleBgm}
          className={`p-1.5 rounded border transition-colors cursor-pointer ${
            !isBgmMuted
              ? 'bg-sky-950/60 border-sky-600 text-sky-300'
              : 'border-stone-700 text-stone-500 hover:text-stone-300 hover:bg-stone-800'
          }`}
          title={isBgmMuted ? '開啟 8-bit 背景音樂' : '靜音背景音樂'}
        >
          <Music className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onToggleSound}
          className={`p-1.5 rounded border transition-colors cursor-pointer ${
            !isSoundMuted
              ? 'bg-stone-800 border-stone-600 text-stone-200'
              : 'border-stone-800 text-stone-500'
          }`}
          title={isSoundMuted ? '開啟音效' : '靜音音效'}
        >
          {isSoundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onResetGame}
          className="p-1.5 text-stone-500 hover:text-red-400 hover:bg-stone-800 rounded transition-colors cursor-pointer ml-1"
          title="重新開始冒險"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
