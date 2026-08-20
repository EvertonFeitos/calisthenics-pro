import React, { useState } from 'react';
import {
  AIAnalysisResult,
  UserGoals,
  LevelInfo,
  WorkoutScheduleDay,
  Workout,
  WorkoutSession,
} from '../types';
import { requestAIAnalysis } from '../services/geminiService';
import {
  Sparkles,
  Bot,
  ShieldCheck,
  Target,
  Flame,
  Check,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  Award,
  Sliders,
} from 'lucide-react';

interface AICoachViewProps {
  currentLevel: LevelInfo;
  userGoals: UserGoals;
  onSaveGoals: (goals: UserGoals) => Promise<void>;
  sessions: WorkoutSession[];
  schedule: WorkoutScheduleDay[];
  workouts: Workout[];
  pastAnalyses: AIAnalysisResult[];
  onSaveNewAnalysis: (analysis: AIAnalysisResult) => Promise<void>;
}

export const AICoachView: React.FC<AICoachViewProps> = ({
  currentLevel,
  userGoals,
  onSaveGoals,
  sessions,
  schedule,
  workouts,
  pastAnalyses,
  onSaveNewAnalysis,
}) => {
  const [goals, setGoals] = useState<UserGoals>(userGoals);
  const [isEditingGoals, setIsEditingGoals] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeAnalysis, setActiveAnalysis] = useState<AIAnalysisResult | null>(
    pastAnalyses[0] || null
  );

  const handleSaveGoalsForm = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveGoals(goals);
    setIsEditingGoals(false);
  };

  const handleRequestAnalysis = async () => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const result = await requestAIAnalysis({
        history: sessions,
        currentLevel: currentLevel.id,
        goals,
        schedule,
        currentWorkouts: workouts,
        userNotes: goals.focusNotes,
      });

      await onSaveNewAnalysis(result);
      setActiveAnalysis(result);
    } catch (err: any) {
      console.error('Falha na análise Gemini:', err);
      setErrorMessage(
        err?.message ||
          'Não foi possível conectar ao serviço de IA. Verifique se o servidor está ativo.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Bento Banner */}
      <div className="bg-[#121212] border border-[#222] p-5 sm:p-6 rounded-[32px] relative overflow-hidden shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-indigo-400/40">
              <Sparkles className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Treinador IA
                </span>
                <span className="text-xs text-[#888] font-semibold">
                  Powered by Gemini 2.5
                </span>
              </div>
              <h1 className="text-xl font-black text-[#F0F0F0] mt-1 tracking-tight">
                Análise Inteligente de Treino
              </h1>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#aaa] mt-3 leading-relaxed">
          O Gemini analisa seu histórico real de repetições, metas, nível atual e objetivos para
          fornecer insights de progressão, descanso e volume personalizados.
        </p>

        {/* Mandatory Transparency & Safety Notice */}
        <div className="mt-4 p-3 rounded-2xl bg-[#161616] border border-[#262626] flex items-start gap-2.5 text-[11px] text-[#888]">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#ccc]">Princípio da IA:</strong> As análises são
            recomendações consultivas. A IA não altera automaticamente sua rotina ou histórico. Você
            tem total controle sobre o que deseja aplicar.
          </span>
        </div>
      </div>

      {/* User Goals Bento Card */}
      <div className="bg-[#121212] border border-[#222] rounded-[32px] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm text-[#F0F0F0] flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            Seus Objetivos e Preferências
          </h3>
          <button
            type="button"
            onClick={() => setIsEditingGoals(!isEditingGoals)}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {isEditingGoals ? 'Cancelar' : 'Editar Objetivos'}
          </button>
        </div>

        {isEditingGoals ? (
          <form onSubmit={handleSaveGoalsForm} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#ccc] mb-1">
                Objetivo Principal
              </label>
              <input
                type="text"
                value={goals.primaryGoal}
                onChange={(e) => setGoals({ ...goals, primaryGoal: e.target.value })}
                className="w-full bg-[#181818] border border-[#2a2a2a] rounded-2xl p-3 text-xs text-[#F0F0F0] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Ex: Primeira barra fixa, hipertrofia, resistência..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#ccc] mb-1">
                  Dias Semanais Alvo
                </label>
                <select
                  value={goals.weeklyTargetDays}
                  onChange={(e) =>
                    setGoals({ ...goals, weeklyTargetDays: Number(e.target.value) })
                  }
                  className="w-full bg-[#181818] border border-[#2a2a2a] rounded-2xl p-3 text-xs text-[#F0F0F0] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value={3}>3 dias por semana</option>
                  <option value={4}>4 dias por semana</option>
                  <option value={5}>5 dias por semana</option>
                  <option value={6}>6 dias por semana</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#ccc] mb-1">
                  Meses de Prática
                </label>
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={goals.experienceMonths}
                  onChange={(e) =>
                    setGoals({ ...goals, experienceMonths: Number(e.target.value) })
                  }
                  className="w-full bg-[#181818] border border-[#2a2a2a] rounded-2xl p-3 text-xs text-[#F0F0F0] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#ccc] mb-1">
                Observações ou Dificuldades Pessoais
              </label>
              <textarea
                value={goals.focusNotes}
                onChange={(e) => setGoals({ ...goals, focusNotes: e.target.value })}
                rows={2}
                className="w-full bg-[#181818] border border-[#2a2a2a] rounded-2xl p-3 text-xs text-[#F0F0F0] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Ex: Sinto fadiga rápida nos ombros na flexão..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all"
            >
              Salvar Objetivos
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-[#181818] p-3.5 rounded-2xl border border-[#262626]">
              <span className="text-[10px] text-[#888] block font-bold uppercase tracking-wider">Objetivo</span>
              <p className="font-bold text-[#F0F0F0] mt-0.5">{goals.primaryGoal}</p>
            </div>
            <div className="bg-[#181818] p-3.5 rounded-2xl border border-[#262626]">
              <span className="text-[10px] text-[#888] block font-bold uppercase tracking-wider">Frequência</span>
              <p className="font-bold text-[#F0F0F0] mt-0.5">{goals.weeklyTargetDays}x por semana</p>
            </div>
            <div className="bg-[#181818] p-3.5 rounded-2xl border border-[#262626]">
              <span className="text-[10px] text-[#888] block font-bold uppercase tracking-wider">Nível & Histórico</span>
              <p className="font-bold text-[#F0F0F0] mt-0.5">
                {currentLevel.name} ({sessions.length} treinos)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action to trigger analysis */}
      <div className="text-center">
        <button
          id="request-ai-analysis-btn"
          type="button"
          disabled={isAnalyzing}
          onClick={handleRequestAnalysis}
          className="w-full py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 active:scale-98 transition-all disabled:opacity-50 border border-indigo-400/30"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>O Gemini está analisando seus treinos...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-white" />
              <span>
                {activeAnalysis ? 'Atualizar Análise com Gemini' : 'Solicitar Análise de Treinamento com IA'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Active Analysis Results Display */}
      {activeAnalysis && (
        <div className="bg-[#121212] border border-[#222] rounded-[32px] p-5 sm:p-6 space-y-5 shadow-xl animate-fadeIn">
          {/* Analysis Header */}
          <div className="flex items-center justify-between border-b border-[#222] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-extrabold text-sm text-[#F0F0F0]">
                Relatório de Análise Personalizada
              </h3>
            </div>
            <span className="text-[10px] text-[#888] font-mono">
              {new Date(activeAnalysis.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Summary */}
          <div>
            <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              Diagnóstico do Treinador
            </h4>
            <p className="text-xs text-[#ddd] leading-relaxed bg-[#181818] p-4 rounded-2xl border border-[#262626]">
              {activeAnalysis.summary}
            </p>
          </div>

          {/* Key Insights */}
          {activeAnalysis.keyInsights && activeAnalysis.keyInsights.length > 0 && (
            <div>
              <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                Pontos de Destaque & Atenção
              </h4>
              <ul className="space-y-1.5">
                {activeAnalysis.keyInsights.map((insight, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-[#ccc] bg-[#181818] p-3 rounded-2xl border border-[#262626] flex items-start gap-2.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested Adjustments */}
          {activeAnalysis.suggestedAdjustments &&
            activeAnalysis.suggestedAdjustments.length > 0 && (
              <div>
                <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-2 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  Sugestões Práticas de Ajustes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeAnalysis.suggestedAdjustments.map((sug, idx) => (
                    <div
                      key={idx}
                      className="bg-[#181818] border border-[#262626] p-3.5 rounded-2xl space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-xs text-[#F0F0F0]">{sug.title}</h5>
                        <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                          {sug.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#888] leading-relaxed">
                        {sug.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Recommended Focus & Motivational Tip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#222]">
            <div className="bg-[#181818] border border-[#262626] rounded-2xl p-3.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block mb-1">
                Foco para as Próximas 2 Semanas
              </span>
              <p className="text-xs font-medium text-[#ccc]">
                {activeAnalysis.recommendedFocus}
              </p>
            </div>

            <div className="bg-[#181818] border border-[#262626] rounded-2xl p-3.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 block mb-1 flex items-center gap-1">
                <Flame className="w-3 h-3 text-purple-400" />
                Dica de Consistência
              </span>
              <p className="text-xs italic text-[#ccc]">"{activeAnalysis.motivationalTip}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

