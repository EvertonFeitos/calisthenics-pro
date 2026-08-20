import React from 'react';
import { Calendar, Dumbbell, History, TrendingUp, Sparkles, Settings } from 'lucide-react';

export type NavTab = 'schedule' | 'exercises' | 'history' | 'progress' | 'coach' | 'settings';

interface BottomNavProps {
  currentTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab }) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'schedule', label: 'Grade', icon: <Calendar className="w-4 h-4" /> },
    { id: 'exercises', label: 'Exercícios', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'history', label: 'Histórico', icon: <History className="w-4 h-4" /> },
    { id: 'progress', label: 'Progresso', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'coach', label: 'IA Coach', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'settings', label: 'Ajustes', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-30 pb-safe px-4 pointer-events-none">
      <div className="max-w-md mx-auto bg-[#121212]/95 backdrop-blur-xl border border-[#262626] shadow-2xl shadow-black/80 rounded-full px-3 py-1.5 flex items-center justify-between pointer-events-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-[#1c1c1c] text-indigo-400 font-bold border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                  : 'text-[#888] hover:text-[#F0F0F0] hover:bg-[#161616] font-medium'
              }`}
            >
              <div className={`transition-transform duration-200 ${isActive ? 'scale-110 text-indigo-400' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[9px] uppercase tracking-wider font-semibold mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
