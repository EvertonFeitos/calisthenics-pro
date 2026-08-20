import React from 'react';
import { LevelInfo, WorkoutScheduleDay, Workout, Exercise } from '../types';
import { Play, Eye, Edit3, Coffee, Clock, Sparkles, Layers, Dumbbell } from 'lucide-react';

interface ScheduleViewProps {
  currentLevel: LevelInfo;
  schedule: WorkoutScheduleDay[];
  workoutsMap: Record<string, Workout>;
  exercisesMap: Record<string, Exercise>;
  onSelectWorkoutForDetail: (workout: Workout) => void;
  onStartWorkout: (workout: Workout) => void;
  onOpenScheduleEditor: () => void;
  onOpenWorkoutEditor?: (workout: Workout) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  currentLevel,
  schedule,
  workoutsMap,
  exercisesMap,
  onSelectWorkoutForDetail,
  onStartWorkout,
  onOpenScheduleEditor,
  onOpenWorkoutEditor,
}) => {
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Bento Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#121212] border border-[#222] p-5 rounded-[28px] shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#888] text-[10px] uppercase tracking-[0.2em] font-bold">Grade Semanal</span>
            <span className="text-indigo-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              Nível {currentLevel.order} • {currentLevel.badge}
            </span>
          </div>
          <h1 className="text-lg font-black text-[#F0F0F0] tracking-tight">
            Rotina de Treinos — {currentLevel.name}
          </h1>
          <p className="text-xs text-[#888] mt-0.5">{currentLevel.description}</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="edit-schedule-btn"
            onClick={onOpenScheduleEditor}
            className="flex items-center gap-2 px-4 py-2 bg-[#181818] hover:bg-[#222] border border-[#262626] hover:border-indigo-500/40 rounded-full text-xs font-bold text-[#F0F0F0] hover:text-indigo-300 transition-all shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Personalizar Grade</span>
          </button>
        </div>
      </div>

      {/* Bento Grid of Days */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {schedule.map((day) => {
          const workout = day.workoutId ? workoutsMap[day.workoutId] : null;

          if (day.isRestDay || !workout) {
            return (
              <div
                key={day.id}
                id={`day-card-${day.dayNumber}`}
                className="bg-[#121212] border border-[#1e1e1e] rounded-[32px] p-5 flex flex-col justify-between opacity-80 hover:opacity-100 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#888]">
                      Dia {day.dayNumber} • {day.dayOfWeek}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1c1c1c] text-[#888] border border-[#282828] flex items-center gap-1">
                      <Coffee className="w-3 h-3 text-[#666]" />
                      Descanso
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#888] mb-1">Descanso / Recuperação</h3>
                  <p className="text-xs text-[#666] leading-relaxed">
                    {day.notes || 'Dia livre para descanso muscular e recuperação articular.'}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#1a1a1a]">
                  <span className="text-[11px] text-[#555] italic">Recuperação ativa recomendada</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={day.id}
              id={`day-card-${day.dayNumber}`}
              className="bg-[#121212] border border-[#222] hover:border-indigo-500/40 rounded-[32px] p-5 flex flex-col justify-between transition-all group shadow-sm"
            >
              <div>
                {/* Top Day Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#bbb]">
                      Dia {day.dayNumber} • {day.dayOfWeek}
                    </span>
                  </div>

                  <span className="text-xs text-[#888] flex items-center gap-1 font-mono font-medium">
                    <Clock className="w-3 h-3 text-[#777]" />
                    ~{workout.estimatedMinutes} min
                  </span>
                </div>

                {/* Workout Title & Description */}
                <h3 className="font-black text-base text-[#F0F0F0] mb-1 tracking-tight group-hover:text-indigo-300 transition-colors">
                  {workout.name}
                </h3>
                <p className="text-xs text-[#888] line-clamp-2 mb-3.5 leading-relaxed">
                  {workout.description}
                </p>

                {/* Exercise Bento Pills preview */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {workout.exercises.slice(0, 3).map((we) => {
                    const ex = exercisesMap[we.exerciseId];
                    return (
                      <span
                        key={we.id}
                        className="text-[10px] font-medium bg-[#181818] text-[#bbb] px-2.5 py-1 rounded-lg border border-[#262626]"
                      >
                        {ex?.name || 'Exercício'} ({we.sets}x{we.targetRepetitions ? `${we.targetRepetitions}r` : `${we.targetDuration}s`})
                      </span>
                    );
                  })}
                  {workout.exercises.length > 3 && (
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20">
                      +{workout.exercises.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-3 border-t border-[#222]">
                <button
                  type="button"
                  id={`detail-workout-btn-${workout.id}`}
                  onClick={() => onSelectWorkoutForDetail(workout)}
                  className="flex-1 py-2.5 px-3 rounded-full bg-[#181818] hover:bg-[#202020] border border-[#262626] text-[#ccc] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#888]" />
                  <span>Ver Detalhes</span>
                </button>
                {onOpenWorkoutEditor && (
                  <button
                    type="button"
                    onClick={() => onOpenWorkoutEditor(workout)}
                    className="p-2.5 rounded-full bg-[#181818] hover:bg-[#202020] border border-[#262626] text-[#888] hover:text-indigo-300 transition-colors"
                    title="Editar exercícios deste treino"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  id={`start-workout-btn-${workout.id}`}
                  onClick={() => onStartWorkout(workout)}
                  className="flex-1 py-2.5 px-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 border border-indigo-400/30"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Iniciar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
