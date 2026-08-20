import {
  LevelId,
  LevelInfo,
  Exercise,
  Workout,
  WorkoutScheduleDay,
  WorkoutSession,
  UserGoals,
  UserSettings,
  AIAnalysisResult,
} from '../../types';
import {
  DEFAULT_LEVELS,
  DEFAULT_EXERCISES,
  DEFAULT_WORKOUTS,
  DEFAULT_SCHEDULES,
} from './defaultData';

export interface IWorkoutRepository {
  getLevels(): Promise<LevelInfo[]>;
  getCurrentLevel(): Promise<LevelId>;
  setCurrentLevel(levelId: LevelId): Promise<void>;
  getWorkouts(levelId?: LevelId): Promise<Workout[]>;
  getWorkoutById(workoutId: string): Promise<Workout | null>;
  saveWorkout(workout: Workout): Promise<void>;
  getSchedule(levelId: LevelId): Promise<WorkoutScheduleDay[]>;
  saveSchedule(levelId: LevelId, days: WorkoutScheduleDay[]): Promise<void>;
  resetScheduleToDefault(levelId: LevelId): Promise<WorkoutScheduleDay[]>;
  getExercises(): Promise<Exercise[]>;
  getExerciseById(id: string): Promise<Exercise | null>;
  saveExercise(exercise: Exercise): Promise<void>;
  deleteExercise(id: string): Promise<void>;
  getWorkoutSessions(): Promise<WorkoutSession[]>;
  getWorkoutSessionById(id: string): Promise<WorkoutSession | null>;
  saveWorkoutSession(session: WorkoutSession): Promise<void>;
  deleteWorkoutSession(sessionId: string): Promise<void>;
  clearWorkoutSessions(): Promise<void>;
  getUserGoals(): Promise<UserGoals>;
  saveUserGoals(goals: UserGoals): Promise<void>;
  getUserSettings(): Promise<UserSettings>;
  saveUserSettings(settings: UserSettings): Promise<void>;
  getAIAnalyses(): Promise<AIAnalysisResult[]>;
  saveAIAnalysis(analysis: AIAnalysisResult): Promise<void>;
  clearAllData(): Promise<void>;
}

const STORAGE_KEYS = {
  SCHEMA_VERSION: 'calistenia_schema_version_v6',
  CURRENT_LEVEL: 'calistenia_current_level',
  WORKOUTS: 'calistenia_workouts',
  SCHEDULES: 'calistenia_schedules',
  EXERCISES: 'calistenia_exercises',
  SESSIONS: 'calistenia_sessions',
  GOALS: 'calistenia_goals',
  SETTINGS: 'calistenia_settings',
  AI_ANALYSES: 'calistenia_ai_analyses',
};

export class LocalStorageWorkoutRepository implements IWorkoutRepository {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Erro ao ler localStorage key ${key}:`, e);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Erro ao salvar localStorage key ${key}:`, e);
    }
  }

  private ensureSchemaUpdated(): void {
    const currentVersion = this.getItem<string>(STORAGE_KEYS.SCHEMA_VERSION, '');
    if (currentVersion !== '6.0') {
      // Refresh default workouts, exercises, and schedules to reflect Barz Club official guidelines (Iniciante, Pré-Intermediário, Intermediário & Pré-Avançado)
      this.setItem(STORAGE_KEYS.EXERCISES, DEFAULT_EXERCISES);
      this.setItem(STORAGE_KEYS.WORKOUTS, DEFAULT_WORKOUTS);
      this.setItem(STORAGE_KEYS.SCHEDULES, DEFAULT_SCHEDULES);
      this.setItem(STORAGE_KEYS.SCHEMA_VERSION, '6.0');
    }
  }

  async getLevels(): Promise<LevelInfo[]> {
    return DEFAULT_LEVELS;
  }

  async getCurrentLevel(): Promise<LevelId> {
    this.ensureSchemaUpdated();
    return this.getItem<LevelId>(STORAGE_KEYS.CURRENT_LEVEL, 'iniciante');
  }

  async setCurrentLevel(levelId: LevelId): Promise<void> {
    this.setItem(STORAGE_KEYS.CURRENT_LEVEL, levelId);
  }

  async getExercises(): Promise<Exercise[]> {
    this.ensureSchemaUpdated();
    const saved = this.getItem<Exercise[]>(STORAGE_KEYS.EXERCISES, []);
    if (!saved || saved.length === 0) {
      this.setItem(STORAGE_KEYS.EXERCISES, DEFAULT_EXERCISES);
      return DEFAULT_EXERCISES;
    }
    // Merge any missing default exercises
    const existingIds = new Set(saved.map((e) => e.id));
    const missing = DEFAULT_EXERCISES.filter((e) => !existingIds.has(e.id));
    if (missing.length > 0) {
      const merged = [...saved, ...missing];
      this.setItem(STORAGE_KEYS.EXERCISES, merged);
      return merged;
    }
    return saved;
  }

  async getExerciseById(id: string): Promise<Exercise | null> {
    const exercises = await this.getExercises();
    return exercises.find((ex) => ex.id === id) || null;
  }

  async saveExercise(exercise: Exercise): Promise<void> {
    const exercises = await this.getExercises();
    const index = exercises.findIndex((e) => e.id === exercise.id);
    if (index >= 0) {
      exercises[index] = exercise;
    } else {
      exercises.push(exercise);
    }
    this.setItem(STORAGE_KEYS.EXERCISES, exercises);
  }

  async deleteExercise(id: string): Promise<void> {
    const exercises = await this.getExercises();
    const filtered = exercises.filter((e) => e.id !== id);
    this.setItem(STORAGE_KEYS.EXERCISES, filtered);
  }

  async getWorkouts(levelId?: LevelId): Promise<Workout[]> {
    this.ensureSchemaUpdated();
    let workouts = this.getItem<Workout[]>(STORAGE_KEYS.WORKOUTS, []);
    if (!workouts || workouts.length === 0) {
      workouts = DEFAULT_WORKOUTS;
      this.setItem(STORAGE_KEYS.WORKOUTS, DEFAULT_WORKOUTS);
    }
    if (levelId) {
      return workouts.filter((w) => w.levelId === levelId);
    }
    return workouts;
  }

  async getWorkoutById(workoutId: string): Promise<Workout | null> {
    const workouts = await this.getWorkouts();
    return workouts.find((w) => w.id === workoutId) || null;
  }

  async saveWorkout(workout: Workout): Promise<void> {
    const workouts = await this.getWorkouts();
    const index = workouts.findIndex((w) => w.id === workout.id);
    if (index >= 0) {
      workouts[index] = workout;
    } else {
      workouts.push(workout);
    }
    this.setItem(STORAGE_KEYS.WORKOUTS, workouts);
  }

  async getSchedule(levelId: LevelId): Promise<WorkoutScheduleDay[]> {
    const allSchedules = this.getItem<Record<string, WorkoutScheduleDay[]>>(
      STORAGE_KEYS.SCHEDULES,
      DEFAULT_SCHEDULES
    );
    if (allSchedules[levelId] && allSchedules[levelId].length > 0) {
      return allSchedules[levelId];
    }
    const defaultForLevel = DEFAULT_SCHEDULES[levelId] || [];
    allSchedules[levelId] = defaultForLevel;
    this.setItem(STORAGE_KEYS.SCHEDULES, allSchedules);
    return defaultForLevel;
  }

  async saveSchedule(levelId: LevelId, days: WorkoutScheduleDay[]): Promise<void> {
    const allSchedules = this.getItem<Record<string, WorkoutScheduleDay[]>>(
      STORAGE_KEYS.SCHEDULES,
      DEFAULT_SCHEDULES
    );
    allSchedules[levelId] = days;
    this.setItem(STORAGE_KEYS.SCHEDULES, allSchedules);
  }

  async resetScheduleToDefault(levelId: LevelId): Promise<WorkoutScheduleDay[]> {
    const defaultForLevel = DEFAULT_SCHEDULES[levelId] || [];
    const allSchedules = this.getItem<Record<string, WorkoutScheduleDay[]>>(
      STORAGE_KEYS.SCHEDULES,
      DEFAULT_SCHEDULES
    );
    allSchedules[levelId] = defaultForLevel;
    this.setItem(STORAGE_KEYS.SCHEDULES, allSchedules);
    return defaultForLevel;
  }

  async getWorkoutSessions(): Promise<WorkoutSession[]> {
    return this.getItem<WorkoutSession[]>(STORAGE_KEYS.SESSIONS, []);
  }

  async getWorkoutSessionById(id: string): Promise<WorkoutSession | null> {
    const sessions = await this.getWorkoutSessions();
    return sessions.find((s) => s.id === id) || null;
  }

  async saveWorkoutSession(session: WorkoutSession): Promise<void> {
    const sessions = await this.getWorkoutSessions();
    const index = sessions.findIndex((s) => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.unshift(session); // Put newest first
    }
    this.setItem(STORAGE_KEYS.SESSIONS, sessions);
  }

  async deleteWorkoutSession(sessionId: string): Promise<void> {
    const sessions = await this.getWorkoutSessions();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    this.setItem(STORAGE_KEYS.SESSIONS, filtered);
  }

  async clearWorkoutSessions(): Promise<void> {
    this.setItem(STORAGE_KEYS.SESSIONS, []);
  }

  async getUserGoals(): Promise<UserGoals> {
    return this.getItem<UserGoals>(STORAGE_KEYS.GOALS, {
      primaryGoal: 'Dominar o peso corporal e ganhar força',
      experienceMonths: 0,
      weeklyTargetDays: 4,
      focusNotes: 'Construir consistência e executar cada repetição com boa postura.',
    });
  }

  async saveUserGoals(goals: UserGoals): Promise<void> {
    this.setItem(STORAGE_KEYS.GOALS, goals);
  }

  async getUserSettings(): Promise<UserSettings> {
    return this.getItem<UserSettings>(STORAGE_KEYS.SETTINGS, {
      soundEnabled: true,
      defaultRestDuration: 120, // 2 minutes
      autoStartRestTimer: true,
      vibrationEnabled: true,
    });
  }

  async saveUserSettings(settings: UserSettings): Promise<void> {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  async getAIAnalyses(): Promise<AIAnalysisResult[]> {
    return this.getItem<AIAnalysisResult[]>(STORAGE_KEYS.AI_ANALYSES, []);
  }

  async saveAIAnalysis(analysis: AIAnalysisResult): Promise<void> {
    const list = await this.getAIAnalyses();
    list.unshift(analysis);
    this.setItem(STORAGE_KEYS.AI_ANALYSES, list);
  }

  async clearAllData(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.SCHEMA_VERSION);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_LEVEL);
    localStorage.removeItem(STORAGE_KEYS.WORKOUTS);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
    localStorage.removeItem(STORAGE_KEYS.EXERCISES);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.AI_ANALYSES);
  }
}

export const workoutRepository: IWorkoutRepository = new LocalStorageWorkoutRepository();
