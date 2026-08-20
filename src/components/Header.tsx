import React from 'react';
import { Volume2, VolumeX, Flame, Zap, Sparkles } from 'lucide-react';
import { LevelInfo, LevelId } from '../types';

interface HeaderProps {
  currentLevelInfo: LevelInfo;
  levels: LevelInfo[];
  onSelectLevel: (levelId: LevelId) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  completedWorkoutsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevelInfo,
  levels,
  onSelectLevel,
  soundEnabled,
  onToggleSound,
  completedWorkoutsCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#080808]/90 backdrop-blur-xl border-b border-[#222] text-[#F0F0F0] px-4 py-3.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* App Brand with Bento Box Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
            <div className="w-4 h-4 border-2 border-white rounded-[4px] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-[#F0F0F0]">CALISTENIA</span>
              <span className="text-indigo-400 font-light text-sm tracking-widest underline underline-offset-4 decoration-1">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[#888] font-medium tracking-wide">Bento Workout Engine</p>
          </div>
        </div>

        {/* Level Switcher & Action buttons */}
        <div className="flex items-center gap-2.5">
          {/* Level Selector Dropdown Pill */}
          <div className="relative">
            <select
              id="level-selector-dropdown"
              value={currentLevelInfo.id}
              onChange={(e) => onSelectLevel(e.target.value as LevelId)}
              className="appearance-none bg-[#161616] hover:bg-[#1f1f1f] border border-[#262626] hover:border-indigo-500/40 text-indigo-300 text-xs font-semibold py-2 pl-3.5 pr-8 rounded-full cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
            >
              {levels.map((lvl) => (
                <option key={lvl.id} value={lvl.id} className="bg-[#121212] text-[#F0F0F0]">
                  {lvl.name} ({lvl.badge})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#888]">
              <svg className="fill-current h-3 w-3" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Sound Toggle Bento Button */}
          <button
            id="toggle-sound-btn"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Silenciar som' : 'Ativar som'}
            className={`p-2 rounded-full border transition-all ${
              soundEnabled
                ? 'bg-[#161616] border-indigo-500/40 text-indigo-400 hover:bg-[#202020] shadow-[0_0_10px_rgba(99,102,241,0.15)]'
                : 'bg-[#121212] border-[#262626] text-[#666] hover:text-[#aaa]'
            }`}
            title={soundEnabled ? 'Sons ativados' : 'Sons desativados'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Bento Status Node with Emerald Indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-[#161616] border border-[#262626] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#F0F0F0]">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <span className="tabular-nums font-bold text-xs">{completedWorkoutsCount}</span>
            <span className="text-[#888] text-[11px] font-normal">{completedWorkoutsCount === 1 ? 'treino' : 'treinos'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

