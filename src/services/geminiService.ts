import { AIAnalysisResult, LevelId, UserGoals, Workout, WorkoutScheduleDay, WorkoutSession } from '../types';

export interface AIAnalysisRequest {
  history: WorkoutSession[];
  currentLevel: LevelId;
  goals: UserGoals;
  schedule: WorkoutScheduleDay[];
  currentWorkouts: Workout[];
  userNotes?: string;
}

export async function requestAIAnalysis(payload: AIAnalysisRequest): Promise<AIAnalysisResult> {
  const response = await fetch('/api/gemini/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Falha na requisição ao servidor.' }));
    throw new Error(errorData.error || `Erro ${response.status}: Falha ao analisar treinos.`);
  }

  const data = await response.json();
  if (!data.success || !data.data) {
    throw new Error(data.error || 'Não foi possível obter a sugestão da IA.');
  }

  return {
    id: `ai_${Date.now()}`,
    createdAt: new Date().toISOString(),
    summary: data.data.summary,
    keyInsights: data.data.keyInsights || [],
    suggestedAdjustments: data.data.suggestedAdjustments || [],
    recommendedFocus: data.data.recommendedFocus || '',
    motivationalTip: data.data.motivationalTip || '',
  };
}
