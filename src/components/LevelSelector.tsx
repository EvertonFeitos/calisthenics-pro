import React from 'react';
import { LevelId, LevelInfo } from '../types';
import { CheckCircle2, Award, Zap } from 'lucide-react';

interface LevelSelectorProps {
  levels: LevelInfo[];
  currentLevelId: LevelId;
  onSelectLevel: (id: LevelId) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  levels,
  currentLevelId,
  onSelectLevel,
}) => {
  return (
    <div className="bg-[#121212] rounded-[28px] border border-[#222] p-5 mb-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#888] text-[10px] uppercase tracking-[0.2em] font-bold">Nível de Treinamento</span>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
          </div>
          <h2 className="text-base font-bold text-[#F0F0F0] mt-0.5">
            Progressão de Força & Calistenia
          </h2>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#181818] border border-[#262626] text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full">
          <Zap className="w-3.5 h-3.5" />
          Acesso Total Livre
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {levels.map((level) => {
          const isSelected = level.id === currentLevelId;
          return (
            <button
              key={level.id}
              id={`level-btn-${level.id}`}
              onClick={() => onSelectLevel(level.id)}
              className={`text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between group ${
                isSelected
                  ? 'bg-gradient-to-b from-[#1e1b4b]/60 to-[#121212] border-indigo-500/80 shadow-lg shadow-indigo-500/15 ring-1 ring-indigo-500/40'
                  : 'bg-[#181818] hover:bg-[#1f1f1f] border-[#262626] text-[#888] hover:text-[#F0F0F0]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-[#222] text-[#888] group-hover:text-[#ccc]'
                    }`}
                  >
                    {level.badge}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <div className={`font-extrabold text-xs tracking-tight ${isSelected ? 'text-[#F0F0F0]' : 'text-[#bbb]'}`}>
                  {level.name}
                </div>
              </div>
              <p className="text-[10px] text-[#777] line-clamp-2 mt-2 leading-tight">
                {level.idealFor}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

