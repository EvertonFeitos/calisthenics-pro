import React from 'react';
import { UserSettings, LevelInfo } from '../types';
import {
  Settings,
  Volume2,
  VolumeX,
  RotateCcw,
  Trash2,
  Shield,
  Layers,
  Sparkles,
  Info,
  Clock,
  Database,
  Smartphone,
} from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => Promise<void>;
  currentLevel: LevelInfo;
  onResetCurrentSchedule: () => Promise<void>;
  onClearAllData: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  currentLevel,
  onResetCurrentSchedule,
  onClearAllData,
}) => {
  const restDurations = [
    { label: '30s', value: 30 },
    { label: '60s (1 min)', value: 60 },
    { label: '90s (1m30)', value: 90 },
    { label: '120s (2 min - Padrão)', value: 120 },
    { label: '180s (3 min)', value: 180 },
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-[#F0F0F0] flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          Configurações & Preferências
        </h1>
        <p className="text-xs text-[#888]">
          Personalize timer de descanso, alertas sonoros e gerenciamento de dados locais.
        </p>
      </div>

      {/* Timer & Rest Defaults Bento Card */}
      <div className="bg-[#121212] border border-[#222] rounded-[32px] p-5 shadow-sm space-y-3.5">
        <h3 className="font-extrabold text-sm text-[#F0F0F0] flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          Tempo de Descanso Padrão Entre Séries
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {restDurations.map((item) => {
            const isSelected = settings.defaultRestDuration === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  onUpdateSettings({ ...settings, defaultRestDuration: item.value })
                }
                className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300 ring-1 ring-indigo-500/30'
                    : 'bg-[#181818] border-[#262626] text-[#ccc] hover:bg-[#202020]'
                }`}
              >
                <span>{item.label}</span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sound and Feedback Bento Card */}
      <div className="bg-[#121212] border border-[#222] rounded-[32px] p-5 shadow-sm space-y-3.5">
        <h3 className="font-extrabold text-sm text-[#F0F0F0] flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-indigo-400" />
          Áudio & Sinais do Timer
        </h3>

        <div className="flex items-center justify-between bg-[#181818] p-4 rounded-2xl border border-[#262626]">
          <div>
            <span className="font-bold text-xs text-[#F0F0F0] block">Sons do Timer</span>
            <span className="text-[11px] text-[#888]">
              Beeps regressivos (3, 2, 1) e sinal sonoro ao concluir descanso
            </span>
          </div>

          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              settings.soundEnabled ? 'bg-indigo-600 justify-end' : 'bg-[#2a2a2a] justify-start'
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md" />
          </button>
        </div>
      </div>

      {/* Schedule & Database Maintenance Bento Card */}
      <div className="bg-[#121212] border border-[#222] rounded-[32px] p-5 shadow-sm space-y-3">
        <h3 className="font-extrabold text-sm text-[#F0F0F0] flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-400" />
          Manutenção da Grade e Dados
        </h3>

        <div className="space-y-2">
          <button
            type="button"
            onClick={async () => {
              if (
                window.confirm(
                  `Deseja restaurar a grade de treinos padrão do nível ${currentLevel.name}?`
                )
              ) {
                await onResetCurrentSchedule();
                alert('Grade restaurada com sucesso!');
              }
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#181818] hover:bg-[#202020] border border-[#262626] text-[#F0F0F0] text-xs font-bold flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-indigo-400" />
              <span>Restaurar Grade Padrão do Nível {currentLevel.name}</span>
            </div>
            <span className="text-[10px] text-[#888]">Padrão sugerido</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              if (
                window.confirm(
                  'ATENÇÃO: Deseja apagar todos os dados locais do aplicativo (histórico, progresso, ajustes)? Esta ação é irreversível.'
                )
              ) {
                await onClearAllData();
                window.location.reload();
              }
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-bold flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Limpar Todos os Dados e Histórico</span>
            </div>
            <span className="text-[10px] text-rose-400/80">Redefinir app</span>
          </button>
        </div>
      </div>

      {/* Architecture & PWA Offline Information */}
      <div className="bg-[#121212] border border-[#222] rounded-[32px] p-5 text-xs text-[#888] space-y-2">
        <div className="flex items-center gap-2 font-bold text-[#F0F0F0]">
          <Layers className="w-4 h-4 text-indigo-400" />
          Arquitetura Desacoplada & PWA
        </div>
        <p className="leading-relaxed">
          Este aplicativo armazena todos os seus treinos e registros localmente no seu dispositivo,
          sem exigir login ou conexão de rede para treinar e registrar repetições. A camada de
          persistência utiliza um padrão de repositório abstrato, pronto para sincronização com
          Supabase no futuro.
        </p>
      </div>
    </div>
  );
};

