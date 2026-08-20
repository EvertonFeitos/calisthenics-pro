import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WorkoutSession, LevelInfo } from '../types';
import {
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  Dumbbell,
  ArrowRight,
  Sparkles,
  Calendar,
  Share2,
} from 'lucide-react';

interface PostWorkoutSummaryProps {
  session: WorkoutSession;
  levelInfo: LevelInfo;
  onGoToHistory: () => void;
  onGoToSchedule: () => void;
}

export const PostWorkoutSummary: React.FC<PostWorkoutSummaryProps> = ({
  session,
  levelInfo,
  onGoToHistory,
  onGoToSchedule,
}) => {
  useEffect(() => {
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#10b981', '#38bdf8'],
      });
    } catch (e) {}
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  // Calculate totals
  let totalRepsDone = 0;
  let totalHoldSecondsDone = 0;
  let totalCompletedSets = 0;
  let totalTargetSets = 0;

  session.exercises.forEach((ex) => {
    ex.sets.forEach((set) => {
      totalTargetSets++;
      if (set.completed) {
        totalCompletedSets++;
        if (set.actualRepetitions !== null) {
          totalRepsDone += set.actualRepetitions;
        }
        if (set.actualDuration !== null) {
          totalHoldSecondsDone += set.actualDuration;
        }
      }
    });
  });

  return (
    <div className="max-w-xl mx-auto space-y-4 animate-fadeIn p-2 pb-10">
      {/* Top Victory Bento Card */}
      <div className="bg-[#121212] border border-[#222] rounded-[32px] p-6 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <Trophy className="w-32 h-32 text-indigo-400" />
        </div>

        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-xl shadow-indigo-600/30 border border-indigo-400/40">
          <Trophy className="w-8 h-8 fill-white" />
        </div>

        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          Treino Concluído com Sucesso
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-[#F0F0F0] mt-2 tracking-tight">
          {session.workoutName}
        </h1>
        <p className="text-xs text-[#888] mt-1">
          Nível {levelInfo.name} ({levelInfo.badge}) — Registro sincronizado com sucesso no histórico.
        </p>

        {/* Core Highlight Bento Metrics */}
        <div className="grid grid-cols-3 gap-2.5 mt-6">
          <div className="bg-[#181818] border border-[#262626] rounded-2xl p-3.5 text-center">
            <Clock className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
            <span className="text-[10px] text-[#888] block font-semibold uppercase tracking-wider">Duração</span>
            <span className="text-sm font-black text-[#F0F0F0] font-mono">
              {formatDuration(session.durationSeconds)}
            </span>
          </div>

          <div className="bg-[#181818] border border-[#262626] rounded-2xl p-3.5 text-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] text-[#888] block font-semibold uppercase tracking-wider">Séries</span>
            <span className="text-sm font-black text-[#F0F0F0] font-mono">
              {totalCompletedSets}/{totalTargetSets}
            </span>
          </div>

          <div className="bg-[#181818] border border-[#262626] rounded-2xl p-3.5 text-center">
            <Flame className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
            <span className="text-[10px] text-[#888] block font-semibold uppercase tracking-wider">Volume</span>
            <span className="text-sm font-black text-[#F0F0F0] font-mono">
              {totalRepsDone > 0 ? `${totalRepsDone} reps` : `${totalHoldSecondsDone}s hold`}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown per Exercise */}
      <div className="bg-[#121212] border border-[#222] rounded-[32px] p-5 shadow-sm">
        <h3 className="font-extrabold text-sm text-[#F0F0F0] mb-3 flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-indigo-400" />
          Desempenho por Exercício
        </h3>

        <div className="space-y-2.5">
          {session.exercises.map((ex) => {
            const completedSets = ex.sets.filter((s) => s.completed);
            const repsList = completedSets
              .map((s) => (s.actualRepetitions !== null ? `${s.actualRepetitions}r` : s.actualDuration !== null ? `${s.actualDuration}s` : '✓'))
              .join(' → ');

            return (
              <div
                key={ex.id}
                className="bg-[#181818] border border-[#262626] rounded-2xl p-3.5 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-[#F0F0F0] text-xs">{ex.exerciseName}</h4>
                  <div className="text-[11px] text-[#888] mt-0.5 font-mono">
                    {repsList || 'Concluído'}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                    {completedSets.length}/{ex.sets.length} séries
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
        <button
          id="summary-history-btn"
          type="button"
          onClick={onGoToHistory}
          className="flex-1 py-3.5 px-4 rounded-full bg-[#181818] hover:bg-[#222] border border-[#262626] text-[#F0F0F0] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Calendar className="w-4 h-4 text-indigo-400" />
          Ver Histórico Completo
        </button>

        <button
          id="summary-schedule-btn"
          type="button"
          onClick={onGoToSchedule}
          className="flex-1 py-3.5 px-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 border border-indigo-400/30"
        >
          <span>Voltar para a Grade</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

