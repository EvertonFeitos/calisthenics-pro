import React from 'react';
import { Workout, Exercise } from '../types';
import { X, Play, Clock, Dumbbell, Info, Edit3, Film, Image as ImageIcon } from 'lucide-react';
import { ExerciseMediaViewer } from './ExerciseMediaViewer';

interface WorkoutDetailModalProps {
  workout: Workout | null;
  exercisesMap: Record<string, Exercise>;
  onClose: () => void;
  onStartWorkout: (workout: Workout) => void;
  onEditWorkout?: (workout: Workout) => void;
  onEditExercise?: (exercise: Exercise) => void;
}

export const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({
  workout,
  exercisesMap,
  onClose,
  onStartWorkout,
  onEditWorkout,
  onEditExercise,
}) => {
  if (!workout) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        id="workout-detail-modal"
        className="bg-[#121212] border border-[#262626] rounded-[32px] w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-scaleUp"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#222] flex items-start justify-between bg-[#141414]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {workout.category === 'push'
                  ? 'Peito & Ombros (Push)'
                  : workout.category === 'pull'
                  ? 'Costas & Lombar (Pull)'
                  : workout.category === 'arms'
                  ? 'Bíceps & Tríceps (Arms)'
                  : workout.category === 'legs_core'
                  ? 'Pernas & Core (Legs)'
                  : 'Geral'}
              </span>
              <span className="text-xs text-[#888] flex items-center gap-1 font-medium font-mono">
                <Clock className="w-3.5 h-3.5 text-[#666]" />
                ~{workout.estimatedMinutes} min
              </span>
            </div>
            <h2 className="text-xl font-black text-[#F0F0F0]">{workout.name}</h2>
            <p className="text-xs text-[#888] mt-1 line-clamp-2">{workout.description}</p>
          </div>

          <div className="flex items-center gap-1">
            {onEditWorkout && (
              <button
                type="button"
                onClick={() => onEditWorkout(workout)}
                className="p-2 text-[#888] hover:text-indigo-300 hover:bg-[#1f1f1f] rounded-full transition-colors"
                title="Editar este treino e exercícios"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button
              id="close-workout-detail-btn"
              onClick={onClose}
              className="p-2 text-[#888] hover:text-[#F0F0F0] hover:bg-[#1f1f1f] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Exercises List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          <div className="flex items-center justify-between text-xs text-[#888] font-semibold px-1">
            <span>Sequência de Exercícios ({workout.exercises.length})</span>
            {onEditWorkout && (
              <button
                type="button"
                onClick={() => onEditWorkout(workout)}
                className="text-indigo-400 hover:text-indigo-300 text-[11px] font-bold flex items-center gap-1 underline underline-offset-4"
              >
                <Edit3 className="w-3 h-3" />
                Editar Lista de Exercícios
              </button>
            )}
          </div>

          {workout.exercises.map((item, index) => {
            const ex = exercisesMap[item.exerciseId];
            const hasMedia = ex && (!!ex.videoUrl || !!ex.imageUrl);

            return (
              <div
                key={item.id}
                className="bg-[#161616] border border-[#262626] rounded-2xl p-4 hover:border-[#333] transition-colors space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-[#202020] text-[#ccc] text-xs font-black flex items-center justify-center shrink-0 border border-[#2a2a2a]">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[#F0F0F0] text-sm">{ex ? ex.name : 'Exercício'}</h4>
                        {ex && onEditExercise && (
                          <button
                            type="button"
                            onClick={() => onEditExercise(ex)}
                            className="text-[#666] hover:text-indigo-400 p-0.5 transition-colors"
                            title="Editar vídeo, foto e detalhes deste exercício"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-indigo-400/80 font-medium">{ex?.muscleGroup || 'Corpo inteiro'}</p>
                    </div>
                  </div>

                  {/* Target configuration badge */}
                  <div className="text-right shrink-0">
                    <span className="inline-block bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-black px-2.5 py-1 rounded-xl">
                      {item.sets} séries ×{' '}
                      {item.targetRepetitions
                        ? `${item.targetRepetitions} reps`
                        : `${item.targetDuration} seg`}
                    </span>
                  </div>
                </div>

                {/* Instruction Snippet */}
                {ex?.instruction && (
                  <p className="text-[11px] text-[#aaa] bg-[#121212] rounded-xl p-2.5 border border-[#222] flex items-start gap-2 leading-relaxed">
                    <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{ex.instruction}</span>
                  </p>
                )}

                {/* Media preview (video or image) if available */}
                {hasMedia && (
                  <div className="pt-1">
                    <ExerciseMediaViewer
                      videoUrl={ex.videoUrl}
                      imageUrl={ex.imageUrl}
                      exerciseName={ex.name}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer / Action Button */}
        <div className="p-4 border-t border-[#222] bg-[#141414] flex items-center gap-3">
          <button
            id="modal-cancel-btn"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-full border border-[#2a2a2a] text-[#ccc] hover:bg-[#202020] text-xs font-bold transition-colors"
          >
            Voltar
          </button>
          <button
            id="modal-start-workout-btn"
            onClick={() => {
              onClose();
              onStartWorkout(workout);
            }}
            className="flex-[2] py-3 px-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 border border-indigo-400/30"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>INICIAR TREINO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
