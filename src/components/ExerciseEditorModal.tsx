import React, { useState } from 'react';
import { Exercise, ExerciseType, MuscleCategory, LevelId } from '../types';
import { X, Save, Film, Image as ImageIcon, Info, Dumbbell, Sparkles, AlertCircle } from 'lucide-react';
import { ExerciseMediaViewer } from './ExerciseMediaViewer';

interface ExerciseEditorModalProps {
  exercise: Exercise | null; // null if creating new
  initialLevelId?: LevelId;
  onClose: () => void;
  onSave: (exercise: Exercise) => Promise<void>;
  onDelete?: (exerciseId: string) => Promise<void>;
}

export const ExerciseEditorModal: React.FC<ExerciseEditorModalProps> = ({
  exercise,
  initialLevelId,
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = !!exercise;

  const [name, setName] = useState(exercise?.name || '');
  const [description, setDescription] = useState(exercise?.description || '');
  const [type, setType] = useState<ExerciseType>(exercise?.type || 'REPETITIONS');
  const [category, setCategory] = useState<MuscleCategory>(exercise?.category || 'push');
  const [muscleGroup, setMuscleGroup] = useState(
    exercise?.muscleGroup || 'Peitoral, Tríceps, Deltoides'
  );
  const [instruction, setInstruction] = useState(exercise?.instruction || '');
  const [tipsText, setTipsText] = useState((exercise?.tips || []).join('\n'));
  const [imageUrl, setImageUrl] = useState(exercise?.imageUrl || '');
  const [videoUrl, setVideoUrl] = useState(exercise?.videoUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [activePreview, setActivePreview] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('O nome do exercício é obrigatório.');
      return;
    }

    setIsSaving(true);
    try {
      const tipsArray = tipsText
        .split('\n')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const updatedExercise: Exercise = {
        id: exercise?.id || `ex_custom_${Date.now()}`,
        name: name.trim(),
        description: description.trim() || 'Exercício personalizado de calistenia.',
        type,
        category,
        muscleGroup: muscleGroup.trim() || 'Corpo inteiro',
        instruction: instruction.trim(),
        tips: tipsArray.length > 0 ? tipsArray : undefined,
        imageUrl: imageUrl.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
        levelId: initialLevelId,
      };

      await onSave(updatedExercise);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao salvar exercício.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!exercise || !onDelete) return;
    if (window.confirm(`Deseja realmente excluir o exercício "${exercise.name}"?`)) {
      setIsSaving(true);
      try {
        await onDelete(exercise.id);
        onClose();
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        id="exercise-editor-modal"
        className="bg-[#121212] border border-[#262626] rounded-[32px] w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-scaleUp"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#222] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#F0F0F0]">
                {isEditing ? 'Editar Exercício' : 'Novo Exercício Personalizado'}
              </h2>
              <p className="text-[11px] text-[#888]">
                {isEditing
                  ? 'Ajuste dados, instruções, imagem e link de vídeo tutorial'
                  : 'Adicione um novo movimento com mídia para guiar a execução'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#888] hover:text-[#F0F0F0] hover:bg-[#1f1f1f] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Name & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-[#ccc] block">Nome do Exercício *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Straddle Planche, Flexão Diamante..."
                required
                className="w-full bg-[#181818] border border-[#2a2a2a] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-[#F0F0F0] font-semibold outline-none transition-all placeholder:text-[#555]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#ccc] block">Métrica / Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ExerciseType)}
                className="w-full bg-[#181818] border border-[#2a2a2a] focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-[#F0F0F0] font-semibold outline-none cursor-pointer"
              >
                <option value="REPETITIONS">Repetições (Reps)</option>
                <option value="TIME">Tempo Isométrico (Segs)</option>
              </select>
            </div>
          </div>

          {/* Category & Muscle Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#ccc] block">Categoria Muscular</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MuscleCategory)}
                className="w-full bg-[#181818] border border-[#2a2a2a] focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-[#F0F0F0] font-semibold outline-none cursor-pointer"
              >
                <option value="push">Empurrar (Peito & Ombros)</option>
                <option value="pull">Puxar (Costas & Dorsal)</option>
                <option value="legs_core">Pernas & Core (Abdômen)</option>
                <option value="arms">Braços (Bíceps & Tríceps)</option>
                <option value="skills">Habilidades / Isometrias</option>
                <option value="fullbody">Corpo Inteiro</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#ccc] block">Músculos Trabalhados</label>
              <input
                type="text"
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value)}
                placeholder="Ex: Peitoral maior, Tríceps, Deltoide..."
                className="w-full bg-[#181818] border border-[#2a2a2a] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-[#F0F0F0] font-semibold outline-none transition-all placeholder:text-[#555]"
              />
            </div>
          </div>

          {/* Instruction & Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#ccc] block">Instrução de Execução</label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={2}
              placeholder="Instruções claras de postura, pegada e movimento..."
              className="w-full bg-[#181818] border border-[#2a2a2a] focus:border-indigo-500 rounded-xl p-3 text-xs text-[#F0F0F0] font-medium outline-none transition-all resize-none placeholder:text-[#555]"
            />
          </div>

          {/* Tips (line by line) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#ccc] block">Dicas Rápidas de Postura (uma por linha)</label>
            <textarea
              value={tipsText}
              onChange={(e) => setTipsText(e.target.value)}
              rows={2}
              placeholder="Cotovelos travados&#10;Protração escapular máxima&#10;Pés apontados"
              className="w-full bg-[#181818] border border-[#2a2a2a] focus:border-indigo-500 rounded-xl p-3 text-xs text-[#F0F0F0] font-medium outline-none transition-all resize-none placeholder:text-[#555]"
            />
          </div>

          {/* Media Section: Image URL & Video URL */}
          <div className="bg-[#161616] p-4 rounded-2xl border border-[#262626] space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                <Film className="w-4 h-4" />
                Mídia Tutorial (Vídeo e Imagem)
              </span>
              <span className="text-[10px] text-[#777]">YouTube, Vimeo, MP4 ou URL de Imagem</span>
            </div>

            {/* Video URL */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#ccc] flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-indigo-400" />
                <span>Link do Vídeo (YouTube, Vimeo ou .mp4)</span>
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
                className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-[#F0F0F0] font-mono outline-none transition-all placeholder:text-[#555]"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#ccc] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>URL da Imagem / Foto Ilustrativa</span>
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem-exercicio.jpg"
                className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-[#F0F0F0] font-mono outline-none transition-all placeholder:text-[#555]"
              />
            </div>

            {/* Live Media Preview if filled */}
            {(videoUrl || imageUrl) && (
              <div className="pt-2">
                <span className="text-[11px] font-bold text-[#888] block mb-2">Pré-visualização da Mídia:</span>
                <ExerciseMediaViewer
                  videoUrl={videoUrl}
                  imageUrl={imageUrl}
                  exerciseName={name || 'Exercício'}
                />
              </div>
            )}
          </div>
        </form>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#222] bg-[#141414] flex items-center justify-between gap-3">
          {isEditing && onDelete ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSaving}
              className="py-2.5 px-4 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-colors disabled:opacity-50"
            >
              Excluir
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2.5">
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
              onClick={handleSubmit}
              disabled={isSaving}
              className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Exercício'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
