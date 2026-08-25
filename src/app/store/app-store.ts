import { Injectable, computed, signal } from '@angular/core';
import {
  AIAnalysisResult,
  Exercise,
  LevelId,
  LevelInfo,
  UserGoals,
  UserSettings,
  Workout,
  WorkoutScheduleDay,
  WorkoutSession,
} from '../types';
import { soundService } from '../services/soundService';
import { workoutRepository } from '../services/storage/repository';

@Injectable({
  providedIn: 'root',
})
export class AppStore {
  private initialized = false;
  private loadingPromise: Promise<void> | null = null;

  readonly isLoading = signal(true);
  readonly levels = signal<LevelInfo[]>([]);
  readonly currentLevelId = signal<LevelId>('basico');
  readonly workouts = signal<Workout[]>([]);
  readonly exercises = signal<Exercise[]>([]);
  readonly schedule = signal<WorkoutScheduleDay[]>([]);
  readonly sessions = signal<WorkoutSession[]>([]);
  readonly userGoals = signal<UserGoals>({
    primaryGoal: 'Dominar o peso corporal e ganhar força',
    experienceMonths: 0,
    weeklyTargetDays: 4,
    focusNotes: '',
  });
  readonly userSettings = signal<UserSettings>({
    soundEnabled: true,
    defaultRestDuration: 120,
    autoStartRestTimer: true,
    vibrationEnabled: true,
  });
  readonly aiAnalyses = signal<AIAnalysisResult[]>([]);
  readonly lastSummarySessionId = signal<string | null>(null);

  readonly levelsMap = computed<Record<string, LevelInfo>>(() =>
    this.levels().reduce<Record<string, LevelInfo>>((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {})
  );

  readonly workoutsMap = computed<Record<string, Workout>>(() =>
    this.workouts().reduce<Record<string, Workout>>((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {})
  );

  readonly exercisesMap = computed<Record<string, Exercise>>(() =>
    this.exercises().reduce<Record<string, Exercise>>((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {})
  );

  readonly currentLevelInfo = computed<LevelInfo>(() => {
    return (
      this.levels().find((level) => level.id === this.currentLevelId()) ?? {
        id: 'basico',
        name: 'Básico',
        order: 1,
        badge: 'Nível 1',
        description: 'Fundamentos corporais e base isométrica.',
        idealFor: 'Iniciantes absolutos.',
      }
    );
  });

  readonly availableWorkoutsForCurrentLevel = computed<Workout[]>(() => {
    const levelId = this.currentLevelId();
    const direct = this.workouts().filter((workout) => workout.levelId === levelId);
    return direct.length > 0 ? direct : this.workouts();
  });

  async init(): Promise<void> {
    if (this.initialized) {
      this.isLoading.set(false);
      return;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.loadInitialState();
    await this.loadingPromise;
    this.loadingPromise = null;
  }

  async selectLevel(levelId: LevelId): Promise<void> {
    this.currentLevelId.set(levelId);
    await workoutRepository.setCurrentLevel(levelId);
    const nextSchedule = await workoutRepository.getSchedule(levelId);
    this.schedule.set(nextSchedule);
  }

  async toggleSound(): Promise<void> {
    const current = this.userSettings();
    await this.updateSettings({
      ...current,
      soundEnabled: !current.soundEnabled,
    });
  }

  async updateSettings(settings: UserSettings): Promise<void> {
    this.userSettings.set(settings);
    soundService.setEnabled(settings.soundEnabled);
    await workoutRepository.saveUserSettings(settings);
  }

  async saveGoals(goals: UserGoals): Promise<void> {
    this.userGoals.set(goals);
    await workoutRepository.saveUserGoals(goals);
  }

  async saveSchedule(days: WorkoutScheduleDay[]): Promise<void> {
    this.schedule.set(days);
    await workoutRepository.saveSchedule(this.currentLevelId(), days);
  }

  async resetSchedule(): Promise<void> {
    const days = await workoutRepository.resetScheduleToDefault(this.currentLevelId());
    this.schedule.set(days);
  }

  async saveExercise(exercise: Exercise): Promise<void> {
    await workoutRepository.saveExercise(exercise);
    this.exercises.update((previous) => {
      const index = previous.findIndex((item) => item.id === exercise.id);
      if (index >= 0) {
        const next = [...previous];
        next[index] = exercise;
        return next;
      }
      return [exercise, ...previous];
    });
  }

  async deleteExercise(exerciseId: string): Promise<void> {
    await workoutRepository.deleteExercise(exerciseId);
    this.exercises.update((previous) => previous.filter((item) => item.id !== exerciseId));
  }

  async saveWorkout(workout: Workout): Promise<void> {
    await workoutRepository.saveWorkout(workout);
    this.workouts.update((previous) => {
      const index = previous.findIndex((item) => item.id === workout.id);
      if (index >= 0) {
        const next = [...previous];
        next[index] = workout;
        return next;
      }
      return [...previous, workout];
    });
  }

  async saveWorkoutSession(session: WorkoutSession): Promise<void> {
    await workoutRepository.saveWorkoutSession(session);
    this.sessions.update((previous) => [session, ...previous.filter((item) => item.id !== session.id)]);
    this.lastSummarySessionId.set(session.id);
  }

  async deleteWorkoutSession(sessionId: string): Promise<void> {
    await workoutRepository.deleteWorkoutSession(sessionId);
    this.sessions.update((previous) => previous.filter((session) => session.id !== sessionId));
  }

  async clearWorkoutHistory(): Promise<void> {
    await workoutRepository.clearWorkoutSessions();
    this.sessions.set([]);
    this.lastSummarySessionId.set(null);
  }

  async saveAIAnalysis(analysis: AIAnalysisResult): Promise<void> {
    await workoutRepository.saveAIAnalysis(analysis);
    this.aiAnalyses.update((previous) => [analysis, ...previous]);
  }

  async clearAllData(): Promise<void> {
    await workoutRepository.clearAllData();
    this.initialized = false;
    this.lastSummarySessionId.set(null);
    this.isLoading.set(true);
    await this.init();
  }

  getWorkoutById(workoutId: string): Workout | null {
    return this.workoutsMap()[workoutId] ?? null;
  }

  getSessionById(sessionId: string): WorkoutSession | null {
    return this.sessions().find((session) => session.id === sessionId) ?? null;
  }

  setLastSummarySessionId(sessionId: string | null): void {
    this.lastSummarySessionId.set(sessionId);
  }

  private async loadInitialState(): Promise<void> {
    try {
      this.isLoading.set(true);
      const [
        levels,
        currentLevelId,
        exercises,
        workouts,
        sessions,
        userGoals,
        userSettings,
        aiAnalyses,
      ] = await Promise.all([
        workoutRepository.getLevels(),
        workoutRepository.getCurrentLevel(),
        workoutRepository.getExercises(),
        workoutRepository.getWorkouts(),
        workoutRepository.getWorkoutSessions(),
        workoutRepository.getUserGoals(),
        workoutRepository.getUserSettings(),
        workoutRepository.getAIAnalyses(),
      ]);

      this.levels.set(levels);
      this.currentLevelId.set(currentLevelId);
      this.exercises.set(exercises);
      this.workouts.set(workouts);
      this.sessions.set(sessions);
      this.userGoals.set(userGoals);
      this.userSettings.set(userSettings);
      this.aiAnalyses.set(aiAnalyses);
      soundService.setEnabled(userSettings.soundEnabled);

      const schedule = await workoutRepository.getSchedule(currentLevelId);
      this.schedule.set(schedule);
      this.initialized = true;
    } catch (error) {
      console.error('Erro ao carregar dados locais do Calistenia Pro:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
