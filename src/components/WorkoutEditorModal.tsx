import React, { useState } from 'react';
import { Workout, WorkoutExercise, Exercise, LevelId } from '../types';
import { X, Save, Plus, Trash2, Dumbbell, Clock, ArrowUpDown, ChevronUp, ChevronDown, Film, Image as ImageIcon } from 'lucide-react';

interface WorkoutEditorModalProps {
  workout: Workout;
  allExercises: Exercise[];
  exercisesMap: Record<string, Exercise>;
  levelName: string;
  onClose: () => void;
  onSaveWorkout: (updatedWorkout: Workout) => Promise<void>;
  onOpenNewExerciseModal: () => void;
  onEditExercise: (exercise: Exercise) => void;
}

export const WorkoutEditorModal: React.FC<WorkoutEditorModalProps> = ({
  workout,
  allExercises,
  exercisesMap,
  levelName,
  onClose,
  onSaveWorkout,
  onOpenNewExerciseModal,
  onEditExercise,
}) => {
  const [name, setName] = useState(workout.name);
  const [description, setDescription] = useState(workout.description);
  const [estimatedMinutes, setEstimatedMinutes] = useState(workout.estimatedMinutes);
  const [items, setItems] = useState<WorkoutExercise[]>(JSON.parse(JSON.stringify(workout.exercises)));
  const [isSaving, setIsSaving] = useState(false);
  const [selectedExerciseToAdd, setSelectedExerciseToAdd] = useState<string>(allExercises[0]?.id || '');

  // Add new exercise row to workout
  const handleAddExerciseToWorkout = () => {
    if (!selectedExerciseToAdd) return;
    const ex = exercisesMap[selectedExerciseToAdd] || allExercises.find((e) => e.id === selectedExerciseToAdd);
    const isTime = ex?.type === 'TIME';

    const newItem: WorkoutExercise = {
      id: `we_edit_${Date.now()}_${items.length + 1}`,
      workoutId: workout.id,
      exerciseId: selectedExerciseToAdd,
      order: items.length + 1,
      sets: 4,
      targetRepetitions: isTime ? undefined : 10,
      targetDuration: isTime ? 15 : undefined,
      restDuration: 120,
    };

    setItems([...items, newItem]);
  };

  // Remove exercise row
  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    const filtered = items.filter((_, i) => i !== index).map((item, i) => ({
      ...item,
      order: i + 1,
    }));
    setItems(filtered);
  };

  // Move exercise up/down
  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    const reordered = updated.map((it, i) => ({ ...it, order: i + 1 }));
    setItems(reordered);
  };

  // Change exercise assigned in row
  const handleChangeExerciseInRow = (index: number, newExerciseId: string) => {
    const updated = [...items];
    const item = updated[index];
    const ex = exercisesMap[newExerciseId] || allExercises.find((e) => e.id === newExerciseId);
    item.exerciseId = newExerciseId;

    if (ex?.type === 'TIME') {
      item.targetDuration = item.targetDuration || 15;
      item.targetRepetitions = undefined;
    } else {
      item.targetRepetitions = item.targetRepetitions || 10;
      item.targetDuration = undefined;
    }
    setItems(updated);
  };

  // Update item field
  const handleUpdateField = (index: number, field: keyof WorkoutExercise, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  // Submit save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedWorkout: Workout = {
        ...workout,
        name: name.trim() || workout.name,
        description: description.trim(),
        estimatedMinutes: Math.max(10, Number(estimatedMinutes) || 30),
        exercises: items,
      };
      await onSaveWorkout(updatedWorkout);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        id="workout-editor-modal"
        className="bg-[#121212] border border-[#262626] rounded-[32px] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-scaleUp"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#222] flex items-center justify-between bg-[#141414]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Editar Treino • {levelName}
              </span>
            </div>
            <h2 className="text-lg font-black text-[#F0F0F0]">{workout.name}</h2>
            <p className="text-xs text-[#888]">Ajuste a lista de exercícios, séries, repetições e descansos.</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#888] hover:text-[#F0F0F0] hover:bg-[#1f1f1f] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Workout Metadata Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#161616] p-4 rounded-2xl border border-[#262626]">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-[#ccc] block">Título do Treino</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#F0F0F0] font-bold outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#ccc] block">Duração Estimada (min)</label>
              <input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                min={5}
                max={120}
                className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#F0F0F0] font-bold outline-none"
              />
            </div>
            <div className="sm:col-span-3 space-y-1">
              <label className="text-[11px] font-bold text-[#ccc] block">Descrição / Foco</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição curta do objetivo do treino..."
                className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#F0F0F0] font-medium outline-none placeholder:text-[#555]"
              />
            </div>
          </div>

          {/* Exercises In Workout Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4" />
                Exercícios do Treino ({items.length})
              </h3>
              <button
                type="button"
                onClick={onOpenNewExerciseModal}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 underline underline-offset-4"
              >
                <Plus className="w-3.5 h-3.5" />
                Criar Novo Exercício
              </button>
            </div>

            {/* List of Workout Exercises */}
            <div className="space-y-3">
              {items.map((item, idx) => {
                const ex = exercisesMap[item.exerciseId] || allExercises.find((e) => e.id === item.exerciseId);
                const isTime = ex?.type === 'TIME';

                return (
                  <div
                    key={item.id || idx}
                    className="bg-[#161616] border border-[#262626] rounded-2xl p-3.5 space-y-3 transition-all hover:border-[#333]"
                  >
                    {/* Top Row: Index, Exercise select, Media indicator, Reorder & Remove */}
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#222] text-[#888] text-xs font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      {/* Exercise dropdown selection */}
                      <select
                        value={item.exerciseId}
                        onChange={(e) => handleChangeExerciseInRow(idx, e.target.value)}
                        className="flex-1 bg-[#121212] border border-[#2a2a2a] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#F0F0F0] font-bold outline-none truncate"
                      >
                        {allExercises.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.name} ({e.type === 'TIME' ? 'Isometria' : 'Reps'})
                          </option>
                        ))}
                      </select>

                      {/* Edit single exercise button */}
                      {ex && (
                        <button
                          type="button"
                          onClick={() => onEditExercise(ex)}
                          className="p-2 rounded-xl bg-[#1f1f1f] text-[#888] hover:text-indigo-300 hover:bg-[#262626] text-xs transition-colors shrink-0"
                          title="Editar detalhes, vídeo ou imagem deste exercício"
                        >
                          {ex.videoUrl ? (
                            <Film className="w-3.5 h-3.5 text-indigo-400" />
                          ) : ex.imageUrl ? (
                            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Dumbbell className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}

                      {/* Reorder buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveItem(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg bg-[#1a1a1a] text-[#888] hover:text-[#fff] disabled:opacity-30"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveItem(idx, 'down')}
                          disabled={idx === items.length - 1}
                          className="p-1.5 rounded-lg bg-[#1a1a1a] text-[#888] hover:text-[#fff] disabled:opacity-30"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove from workout */}
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-[#222] transition-colors"
                          title="Remover deste treino"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Bottom Row: Sets, Reps/Time, Rest duration */}
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#202020]">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#888] block">Séries</label>
                        <input
                          type="number"
                          value={item.sets}
                          onChange={(e) => handleUpdateField(idx, 'sets', Math.max(1, Number(e.target.value)))}
                          min={1}
                          max={20}
                          className="w-full bg-[#121212] border border-[#262626] rounded-xl px-2.5 py-1.5 text-xs text-[#F0F0F0] font-bold text-center"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#888] block">
                          {isTime ? 'Tempo (segundos)' : 'Repetições'}
                        </label>
                        <input
                          type="number"
                          value={isTime ? item.targetDuration || 15 : item.targetRepetitions || 10}
                          onChange={(e) =>
                            handleUpdateField(
                              idx,
                              isTime ? 'targetDuration' : 'targetRepetitions',
                              Math.max(1, Number(e.target.value))
                            )
                          }
                          min={1}
                          max={300}
                          className="w-full bg-[#121212] border border-[#262626] rounded-xl px-2.5 py-1.5 text-xs text-[#F0F0F0] font-bold text-center"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#888] block">Descanso (seg)</label>
                        <select
                          value={item.restDuration || 120}
                          onChange={(e) => handleUpdateField(idx, 'restDuration', Number(e.target.value))}
                          className="w-full bg-[#121212] border border-[#262626] rounded-xl px-2 py-1.5 text-xs text-[#F0F0F0] font-bold text-center"
                        >
                          <option value="30">30s</option>
                          <option value="60">60s (1 min)</option>
                          <option value="90">90s (1m30)</option>
                          <option value="120">120s (2 min)</option>
                          <option value="180">180s (3 min)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Add Exercise Bar */}
            <div className="p-3 bg-[#161616] border border-dashed border-[#333] rounded-2xl flex items-center gap-2">
              <select
                value={selectedExerciseToAdd}
                onChange={(e) => setSelectedExerciseToAdd(e.target.value)}
                className="flex-1 bg-[#121212] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-[#F0F0F0] font-semibold outline-none"
              >
                {allExercises.map((e) => (
                  <option key={e.id} value={e.id}>
                    + {e.name} ({e.type === 'TIME' ? 'Isometria' : 'Reps'})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddExerciseToWorkout}
                className="py-2 px-3.5 rounded-xl bg-[#222] hover:bg-indigo-600 text-[#F0F0F0] text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar ao Treino</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#222] bg-[#141414] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="py-2.5 px-4 rounded-xl border border-[#2a2a2a] text-[#ccc] hover:bg-[#202020] text-xs font-bold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar Alterações do Treino'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
