import React, { useState } from 'react';
import { WorkoutSession, Exercise } from '../types';
import {
  TrendingUp,
  Award,
  Flame,
  Dumbbell,
  Clock,
  Calendar,
  Zap,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface ProgressViewProps {
  sessions: WorkoutSession[];
  exercisesMap: Record<string, Exercise>;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ sessions, exercisesMap }) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('all');

  // Compute aggregate metrics
  let totalRepsOverall = 0;
  let totalHoldSecondsOverall = 0;
  let totalMinutesTrained = 0;

  // Best Personal Records (PR) per exercise: exerciseId -> { maxReps, maxDuration, bestDate, exerciseName }
  const exercisePRs: Record<
    string,
    { exerciseName: string; maxReps: number; maxDuration: number; lastSessionDate: string }
  > = {};

  // Exercise history timeline: exerciseId -> Array<{ date: string; setsReps: string; avgReps: number; totalVolume: number }>
  const exerciseHistoryTimeline: Record<
    string,
    Array<{ date: string; setsReps: string; avgReps: number; totalVolume: number }>
  > = {};

  // Process oldest to newest for chronological progress
  const chronologicalSessions = [...sessions].reverse();

  chronologicalSessions.forEach((session) => {
    totalMinutesTrained += Math.floor(session.durationSeconds / 60);

    session.exercises.forEach((ex) => {
      if (!exercisePRs[ex.exerciseId]) {
        exercisePRs[ex.exerciseId] = {
          exerciseName: ex.exerciseName,
          maxReps: 0,
          maxDuration: 0,
          lastSessionDate: session.startedAt,
        };
      }
      if (!exerciseHistoryTimeline[ex.exerciseId]) {
        exerciseHistoryTimeline[ex.exerciseId] = [];
      }

      const completedSets = ex.sets.filter((s) => s.completed);
      const repsValues: number[] = [];
      const setStrings: string[] = [];

      completedSets.forEach((s) => {
        if (s.actualRepetitions !== null) {
          totalRepsOverall += s.actualRepetitions;
          repsValues.push(s.actualRepetitions);
          setStrings.push(`${s.actualRepetitions}`);
          if (s.actualRepetitions > exercisePRs[ex.exerciseId].maxReps) {
            exercisePRs[ex.exerciseId].maxReps = s.actualRepetitions;
          }
        } else if (s.actualDuration !== null) {
          totalHoldSecondsOverall += s.actualDuration;
          repsValues.push(s.actualDuration);
          setStrings.push(`${s.actualDuration}s`);
          if (s.actualDuration > exercisePRs[ex.exerciseId].maxDuration) {
            exercisePRs[ex.exerciseId].maxDuration = s.actualDuration;
          }
        }
      });

      if (setStrings.length > 0) {
        const sum = repsValues.reduce((a, b) => a + b, 0);
        const avg = repsValues.length > 0 ? Math.round((sum / repsValues.length) * 10) / 10 : 0;
        exerciseHistoryTimeline[ex.exerciseId].push({
          date: new Date(session.startedAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
          }),
          setsReps: setStrings.join(' → '),
          avgReps: avg,
          totalVolume: sum,
        });
      }
    });
  });

  const uniqueTrackedExercises = Object.keys(exerciseHistoryTimeline);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* View Header */}
      <div>
        <h1 className="text-xl font-black text-[#F0F0F0] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          Evolução & Desempenho
        </h1>
        <p className="text-xs text-[#888]">
          Métricas calculadas exclusivamente com base nas repetições efetivamente realizadas.
        </p>
      </div>

      {/* Aggregate Bento Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#121212] border border-[#222] rounded-[24px] p-4 flex flex-col justify-between hover:border-[#2a2a2a] transition-colors">
          <div className="flex items-center justify-between text-[#888] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Treinos</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-[#F0F0F0] font-mono">{sessions.length}</div>
          <span className="text-[10px] text-[#666] mt-1 font-medium">Sessões registradas</span>
        </div>

        <div className="bg-[#121212] border border-[#222] rounded-[24px] p-4 flex flex-col justify-between hover:border-[#2a2a2a] transition-colors">
          <div className="flex items-center justify-between text-[#888] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Repetições</span>
            <Flame className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400 font-mono">{totalRepsOverall}</div>
          <span className="text-[10px] text-[#666] mt-1 font-medium">Volume acumulado</span>
        </div>

        <div className="bg-[#121212] border border-[#222] rounded-[24px] p-4 flex flex-col justify-between hover:border-[#2a2a2a] transition-colors">
          <div className="flex items-center justify-between text-[#888] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Isometria</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-[#F0F0F0] font-mono">{totalHoldSecondsOverall}s</div>
          <span className="text-[10px] text-[#666] mt-1 font-medium">Tempo sob tensão</span>
        </div>

        <div className="bg-[#121212] border border-[#222] rounded-[24px] p-4 flex flex-col justify-between hover:border-[#2a2a2a] transition-colors">
          <div className="flex items-center justify-between text-[#888] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Tempo</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-[#F0F0F0] font-mono">~{totalMinutesTrained}m</div>
          <span className="text-[10px] text-[#666] mt-1 font-medium">Minutos em treino</span>
        </div>
      </div>

      {/* Personal Records (PRs) */}
      <div className="bg-[#121212] border border-[#222] rounded-[32px] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm text-[#F0F0F0] flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            Recordes Pessoais (Melhor Série Realizada)
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#888]">Pico de força</span>
        </div>

        {Object.keys(exercisePRs).length === 0 ? (
          <p className="text-xs text-[#888] text-center py-4">
            Nenhum exercício com repetições registradas ainda. Conclua seu primeiro treino para desbloquear seus recordes!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(exercisePRs).map(([exId, pr]) => (
              <div
                key={exId}
                className="bg-[#181818] border border-[#262626] rounded-2xl p-3.5 flex items-center justify-between hover:border-[#333] transition-colors"
              >
                <div>
                  <h4 className="font-bold text-[#F0F0F0] text-xs">{pr.exerciseName}</h4>
                  <span className="text-[10px] text-[#888]">
                    {exercisesMap[exId]?.muscleGroup || 'Calistenia'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full font-mono">
                    {pr.maxReps > 0 ? `${pr.maxReps} reps` : `${pr.maxDuration}s`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progression Over Time by Exercise */}
      <div className="bg-[#121212] border border-[#222] rounded-[32px] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm text-[#F0F0F0] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Evolução Série a Série ao Longo do Tempo
          </h3>
        </div>

        {uniqueTrackedExercises.length === 0 ? (
          <p className="text-xs text-[#888] text-center py-4">
            Registre suas repetições durante os treinos para acompanhar o histórico de evolução aqui.
          </p>
        ) : (
          <div className="space-y-3">
            {uniqueTrackedExercises.map((exId) => {
              const records = exerciseHistoryTimeline[exId];
              const exName = exercisePRs[exId]?.exerciseName || 'Exercício';
              return (
                <div
                  key={exId}
                  className="bg-[#161616] border border-[#262626] rounded-2xl p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#F0F0F0]">{exName}</span>
                    <span className="text-[10px] text-[#888] font-mono">
                      {records.length} {records.length === 1 ? 'sessão' : 'sessões'}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {records.map((rec, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-center justify-between text-xs bg-[#101010] px-3 py-2 rounded-xl border border-[#202020]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#888] w-12 font-mono">
                            {rec.date}
                          </span>
                          <span className="font-black text-indigo-400 font-mono">
                            {rec.setsReps}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#888] font-medium font-mono">
                          Vol: {rec.totalVolume}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

