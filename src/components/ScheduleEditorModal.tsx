import React, { useState } from 'react';
import { WorkoutScheduleDay, Workout, LevelId } from '../types';
import { X, Plus, Trash2, RotateCcw, Check, Coffee, Dumbbell } from 'lucide-react';

interface ScheduleEditorModalProps {
  levelId: LevelId;
  levelName: string;
  schedule: WorkoutScheduleDay[];
  availableWorkouts: Workout[];
  onClose: () => void;
  onSaveSchedule: (newSchedule: WorkoutScheduleDay[]) => Promise<void>;
  onResetDefault: () => Promise<void>;
}

export const ScheduleEditorModal: React.FC<ScheduleEditorModalProps> = ({
  levelId,
  levelName,
  schedule,
  availableWorkouts,
  onClose,
  onSaveSchedule,
  onResetDefault,
}) => {
  const [days, setDays] = useState<WorkoutScheduleDay[]>(JSON.parse(JSON.stringify(schedule)));
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleRest = (index: number) => {
    const updated = [...days];
    const item = updated[index];
    item.isRestDay = !item.isRestDay;
    if (item.isRestDay) {
      item.workoutId = null;
    } else {
      item.workoutId = availableWorkouts[0]?.id || null;
    }
    setDays(updated);
  };

  const handleWorkoutChange = (index: number, workoutId: string) => {
    const updated = [...days];
    updated[index].workoutId = workoutId;
    updated[index].isRestDay = false;
    setDays(updated);
  };

  const handleAddDay = () => {
    const nextDayNumber = days.length + 1;
    const newDay: WorkoutScheduleDay = {
      id: `sch_${levelId}_${Date.now()}`,
      levelId,
      dayNumber: nextDayNumber,
      workoutId: availableWorkouts[0]?.id || null,
      isRestDay: false,
      order: nextDayNumber,
    };
    setDays([...days, newDay]);
  };

  const handleRemoveDay = (index: number) => {
    if (days.length <= 1) return;
    const filtered = days.filter((_, i) => i !== index).map((d, i) => ({
      ...d,
      dayNumber: i + 1,
      order: i + 1,
    }));
    setDays(filtered);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveSchedule(days);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div
        id="schedule-editor-modal"
        className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-scaleUp"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-stone-100">Personalizar Grade de Treinos</h3>
            <p className="text-xs text-stone-400">Nível {levelName} — Ajuste os dias e descansos</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Days List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {days.map((day, idx) => (
            <div
              key={day.id || idx}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                day.isRestDay
                  ? 'bg-stone-800/40 border-stone-800/80'
                  : 'bg-stone-800/80 border-stone-700/80'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-[70px]">
                <span className="w-8 h-8 rounded-xl bg-stone-700 font-extrabold text-xs text-stone-200 flex items-center justify-center">
                  D{day.dayNumber}
                </span>
              </div>

              {/* Workout Selection or Rest Indicator */}
              <div className="flex-1">
                {day.isRestDay ? (
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold py-1.5 px-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <Coffee className="w-4 h-4" />
                    <span>Dia de Descanso / Recuperação</span>
                  </div>
                ) : (
                  <select
                    value={day.workoutId || ''}
                    onChange={(e) => handleWorkoutChange(idx, e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 text-stone-100 text-xs font-semibold p-2 rounded-xl focus:ring-2 focus:ring-amber-500"
                  >
                    {availableWorkouts.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleRest(idx)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
                    day.isRestDay
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-stone-700/60 text-stone-400 border-stone-700 hover:text-stone-200'
                  }`}
                  title={day.isRestDay ? 'Mudar para treino' : 'Mudar para descanso'}
                >
                  <Coffee className="w-4 h-4" />
                </button>

                {days.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDay(idx)}
                    className="p-2 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                    title="Excluir este dia"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add Day Button */}
          <button
            id="add-schedule-day-btn"
            type="button"
            onClick={handleAddDay}
            className="w-full py-3 rounded-2xl border border-dashed border-stone-700 hover:border-amber-500 text-stone-400 hover:text-amber-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Novo Dia na Grade
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900/95 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={async () => {
              await onResetDefault();
              onClose();
            }}
            className="text-xs font-semibold text-stone-400 hover:text-amber-400 flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar Padrão
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-stone-700 text-stone-300 text-xs font-semibold hover:bg-stone-800"
            >
              Cancelar
            </button>
            <button
              id="save-schedule-btn"
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Check className="w-4 h-4" />
              {isSaving ? 'Salvando...' : 'Salvar Grade'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
