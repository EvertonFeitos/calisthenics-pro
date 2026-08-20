import React, { useState, useMemo } from 'react';
import { Exercise, LevelId, LevelInfo, MuscleCategory } from '../types';
import {
  Dumbbell,
  Plus,
  Search,
  Film,
  Image as ImageIcon,
  Edit3,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { ExerciseMediaViewer } from './ExerciseMediaViewer';

interface ExercisesDirectoryViewProps {
  exercises: Exercise[];
  levels: LevelInfo[];
  currentLevelId: LevelId;
  onOpenCreateExercise: () => void;
  onOpenEditExercise: (exercise: Exercise) => void;
}

export const ExercisesDirectoryView: React.FC<ExercisesDirectoryViewProps> = ({
  exercises,
  levels,
  currentLevelId,
  onOpenCreateExercise,
  onOpenEditExercise,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedExerciseForPreview, setSelectedExerciseForPreview] = useState<Exercise | null>(null);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch =
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ex.instruction && ex.instruction.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || ex.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [exercises, searchQuery, selectedCategory]);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'push', label: 'Empurrar (Push)' },
    { id: 'pull', label: 'Puxar (Pull)' },
    { id: 'legs_core', label: 'Pernas & Core' },
    { id: 'arms', label: 'Braços (Arms)' },
    { id: 'skills', label: 'Skills & Isometrias' },
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Bento Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#121212] border border-[#222] p-5 rounded-[28px] shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#888] text-[10px] uppercase tracking-[0.2em] font-bold">Biblioteca de Movimentos</span>
            <span className="text-indigo-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              {exercises.length} cadastrados
            </span>
          </div>
          <h1 className="text-lg font-black text-[#F0F0F0] tracking-tight">
            Exercícios & Execuções Corretas
          </h1>
          <p className="text-xs text-[#888] mt-0.5">
            Veja vídeos tutoriais, ilustrações, postura adequada e personalize ou adicione novos exercícios.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateExercise}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all active:scale-95 border border-indigo-400/30"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Exercício</span>
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-[#777] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, músculo ou técnica (ex: Planche, Flexão, Barra)..."
            className="w-full bg-[#121212] border border-[#222] focus:border-indigo-500/50 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#F0F0F0] placeholder:text-[#666] outline-none transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-[#141414] text-[#888] border-[#242424] hover:text-[#ccc] hover:bg-[#1a1a1a]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Exercises */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredExercises.map((ex) => {
          const hasMedia = !!ex.videoUrl || !!ex.imageUrl;
          return (
            <div
              key={ex.id}
              className="bg-[#121212] hover:bg-[#151515] border border-[#222] hover:border-indigo-500/40 rounded-[28px] p-4 flex flex-col justify-between transition-all group shadow-sm"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {ex.category === 'push'
                      ? 'Empurrar (Push)'
                      : ex.category === 'pull'
                      ? 'Puxar (Pull)'
                      : ex.category === 'arms'
                      ? 'Braços (Arms)'
                      : ex.category === 'legs_core'
                      ? 'Pernas & Core'
                      : 'Especial'}
                  </span>

                  <div className="flex items-center gap-1">
                    {ex.videoUrl && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                        <Film className="w-3 h-3 text-indigo-400" />
                        Vídeo
                      </span>
                    )}
                    {ex.imageUrl && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                        <ImageIcon className="w-3 h-3 text-emerald-400" />
                        Foto
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-[#888] bg-[#1a1a1a] px-2 py-0.5 rounded-md border border-[#262626]">
                      {ex.type === 'TIME' ? 'Isometria' : 'Repetições'}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-black text-[#F0F0F0] group-hover:text-indigo-300 transition-colors">
                  {ex.name}
                </h3>
                <p className="text-[11px] text-indigo-400/80 font-medium mb-2">
                  {ex.muscleGroup}
                </p>

                {/* Description / Instructions */}
                {ex.instruction && (
                  <p className="text-xs text-[#888] line-clamp-2 mb-3 leading-relaxed">
                    {ex.instruction}
                  </p>
                )}

                {/* Embedded Media Preview if exists */}
                {hasMedia && (
                  <div className="mb-3">
                    <ExerciseMediaViewer
                      imageUrl={ex.imageUrl}
                      videoUrl={ex.videoUrl}
                      exerciseName={ex.name}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons: Edit & View Full Details */}
              <div className="pt-2 border-t border-[#202020] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onOpenEditExercise(ex)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181818] hover:bg-[#222] text-[#ccc] hover:text-indigo-300 text-xs font-bold border border-[#262626] transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar / Mídia</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExercises.length === 0 && (
        <div className="bg-[#121212] border border-[#222] rounded-[32px] p-8 text-center">
          <Dumbbell className="w-8 h-8 text-[#555] mx-auto mb-2" />
          <h4 className="text-sm font-bold text-[#ccc]">Nenhum exercício encontrado</h4>
          <p className="text-xs text-[#777] mt-1">Tente buscar por outro termo ou cadastre um novo exercício.</p>
        </div>
      )}
    </div>
  );
};
