import React, { useState } from 'react';
import { WorkoutSession, LevelInfo } from '../types';
import {
  Calendar,
  Clock,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Trash2,
  Trophy,
  Flame,
  Award,
  Play,
} from 'lucide-react';

interface HistoryViewProps {
  sessions: WorkoutSession[];
  levelsMap: Record<string, LevelInfo>;
  onDeleteSession: (sessionId: string) => Promise<void>;
  onStartNewWorkout: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  sessions,
  levelsMap,
  onDeleteSession,
  onStartNewWorkout,
}) => {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(
    sessions[0]?.id || null
  );

  const toggleExpand = (id: string) => {
    setExpandedSessionId((prev) => (prev === id ? null : id));
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Bento */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h1 className="text-xl font-black text-[#F0F0F0] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            Histórico de Treinos
          </h1>
          <p className="text-xs text-[#888]">
            Registro detalhado e sincronizado de todas as suas sessões executadas.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-[#121212] border border-[#262626] rounded-full text-[#aaa] font-mono">
          {sessions.length} {sessions.length === 1 ? 'sessão' : 'sessões'}
        </span>
      </div>

      {/* Empty State */}
      {sessions.length === 0 ? (
        <div className="bg-[#121212] border border-dashed border-[#262626] rounded-[32px] p-8 text-center my-6">
          <div className="w-14 h-14 rounded-2xl bg-[#181818] border border-[#222] text-[#666] flex items-center justify-center mx-auto mb-3">
            <Dumbbell className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-[#F0F0F0]">Nenhum treino registrado ainda</h3>
          <p className="text-xs text-[#888] max-w-sm mx-auto mt-1 mb-5">
            Ao concluir seus treinos na grade, o histórico das repetições e tempos será salvo aqui.
          </p>
          <button
            id="start-first-workout-btn"
            onClick={onStartNewWorkout}
            className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Ir para a Grade e Treinar
          </button>
        </div>
      ) : (
        /* Sessions Bento List */
        <div className="space-y-3">
          {sessions.map((session) => {
            const isExpanded = expandedSessionId === session.id;
            const level = levelsMap[session.levelId];

            // Calculate total reps and completed sets
            let totalReps = 0;
            let totalHoldSecs = 0;
            let completedSets = 0;
            session.exercises.forEach((ex) => {
              ex.sets.forEach((s) => {
                if (s.completed) {
                  completedSets++;
                  if (s.actualRepetitions !== null) totalReps += s.actualRepetitions;
                  if (s.actualDuration !== null) totalHoldSecs += s.actualDuration;
                }
              });
            });

            return (
              <div
                key={session.id}
                id={`session-card-${session.id}`}
                className="bg-[#121212] border border-[#222] rounded-[28px] overflow-hidden transition-all shadow-sm hover:border-[#2a2a2a]"
              >
                {/* Session Card Header */}
                <div
                  onClick={() => toggleExpand(session.id)}
                  className="p-4 cursor-pointer hover:bg-[#161616] flex items-center justify-between gap-3 select-none transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#181818] flex items-center justify-center text-indigo-400 font-bold border border-[#262626] shrink-0">
                      <Trophy className="w-5 h-5 text-indigo-400" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-[#F0F0F0]">{session.workoutName}</h3>
                        {level && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {level.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#888] mt-1 font-mono">
                        <span>{formatDate(session.startedAt)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#666]" />
                          {formatDuration(session.durationSeconds)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-[#F0F0F0] block font-mono">
                        {completedSets} séries
                      </span>
                      <span className="text-[10px] text-[#888] font-mono">
                        {totalReps > 0 ? `${totalReps} reps` : `${totalHoldSecs}s hold`}
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label="Expandir detalhes"
                      className="p-1.5 text-[#888] hover:text-[#F0F0F0] rounded-full hover:bg-[#202020] transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Session Details */}
                {isExpanded && (
                  <div className="p-4 pt-2 border-t border-[#222] bg-[#0d0d0d] space-y-3 animate-fadeIn">
                    <div className="text-xs font-bold text-[#888] mb-1 flex items-center justify-between">
                      <span>Desempenho Real Registrado por Série</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Tem certeza que deseja excluir este registro do histórico?')) {
                            onDeleteSession(session.id);
                          }
                        }}
                        className="text-[#666] hover:text-rose-400 flex items-center gap-1 text-[11px] font-medium p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Excluir Sessão
                      </button>
                    </div>

                    <div className="space-y-2">
                      {session.exercises.map((ex, exIdx) => (
                        <div
                          key={ex.id || exIdx}
                          className="bg-[#141414] border border-[#222] rounded-2xl p-3.5"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs text-[#F0F0F0]">
                              {exIdx + 1}. {ex.exerciseName}
                            </span>
                            <span className="text-[10px] font-semibold text-[#888] uppercase tracking-wider">
                              {ex.type === 'TIME' ? 'Isometria' : 'Repetições'}
                            </span>
                          </div>

                          {/* Sets progression chips */}
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                            {ex.sets.map((set) => {
                              const performed =
                                set.actualRepetitions !== null
                                  ? `${set.actualRepetitions}r`
                                  : set.actualDuration !== null
                                  ? `${set.actualDuration}s`
                                  : set.completed
                                  ? '✓'
                                  : '-';

                              return (
                                <div
                                  key={set.id}
                                  className={`p-2 rounded-xl text-center border text-xs ${
                                    set.completed
                                      ? 'bg-[#1a1a1a] border-[#2a2a2a] text-[#F0F0F0]'
                                      : 'bg-[#121212] border-[#1f1f1f] text-[#555]'
                                  }`}
                                >
                                  <span className="text-[10px] block text-[#888] font-bold">
                                    S{set.setNumber}
                                  </span>
                                  <span className="font-black text-indigo-400 font-mono">{performed}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

