import { Injectable } from '@angular/core';
import {
  AIAnalysisResult,
  LevelId,
  UserGoals,
  Workout,
  WorkoutScheduleDay,
  WorkoutSession,
} from '../types';

export interface AIAnalysisRequest {
  history: WorkoutSession[];
  currentLevel: LevelId;
  goals: UserGoals;
  schedule: WorkoutScheduleDay[];
  currentWorkouts: Workout[];
  userNotes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AiCoach {
  async requestAnalysis(_payload: AIAnalysisRequest): Promise<AIAnalysisResult> {
    throw new Error(
      'A análise com IA não está disponível nesta versão Ionic Angular PWA. O layout e o histórico local continuam funcionando normalmente.'
    );
  }
}
