export type LevelId = 'basico' | 'iniciante' | 'pre_intermediario' | 'intermediario' | 'pre_avancado';
export type NavTab = 'schedule' | 'exercises' | 'history' | 'progress' | 'coach' | 'settings';

export interface LevelInfo {
  id: LevelId;
  name: string;
  order: number;
  badge: string;
  description: string;
  idealFor: string;
}

export type ExerciseType = 'REPETITIONS' | 'TIME';
export type MuscleCategory = 'push' | 'pull' | 'legs_core' | 'arms' | 'fullbody' | 'skills';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  type: ExerciseType;
  category: MuscleCategory;
  muscleGroup: string;
  instruction: string;
  tips?: string[];
  imageUrl?: string;
  videoUrl?: string; // YouTube, direct mp4, or Vimeo link
  videoEmbedUrl?: string;
  levelId?: LevelId; // optional level filter tag
}

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  order: number;
  sets: number;
  targetRepetitions?: number; // e.g. 5, 8, 10
  targetDuration?: number; // e.g. 10s, 15s
  restDuration: number; // default 120s (2 minutes)
}

export interface Workout {
  id: string;
  levelId: LevelId;
  name: string;
  description: string;
  category: MuscleCategory;
  estimatedMinutes: number;
  exercises: WorkoutExercise[];
}

export interface WorkoutScheduleDay {
  id: string;
  levelId: LevelId;
  dayNumber: number; // 1, 2, 3...
  dayOfWeek?: string;
  workoutId: string | null; // null if rest day
  isRestDay: boolean;
  order: number;
  notes?: string;
}

export interface SetSession {
  id: string;
  setNumber: number;
  targetRepetitions?: number;
  actualRepetitions: number | null; // null when user opts not to register
  targetDuration?: number;
  actualDuration: number | null;
  completed: boolean;
  completedAt?: string;
}

export interface ExerciseSession {
  id: string;
  exerciseId: string;
  exerciseName: string;
  type: ExerciseType;
  order: number;
  sets: SetSession[];
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  levelId: LevelId;
  workoutName: string;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  status: 'COMPLETED' | 'CANCELLED';
  exercises: ExerciseSession[];
  notes?: string;
}

export interface UserGoals {
  primaryGoal: string;
  experienceMonths: number;
  weeklyTargetDays: number;
  focusNotes: string;
}

export interface UserSettings {
  soundEnabled: boolean;
  defaultRestDuration: number;
  autoStartRestTimer: boolean;
  vibrationEnabled: boolean;
}

export interface AIAnalysisSuggestion {
  title: string;
  description: string;
  category: string;
}

export interface AIAnalysisResult {
  id: string;
  createdAt: string;
  summary: string;
  keyInsights: string[];
  suggestedAdjustments: AIAnalysisSuggestion[];
  recommendedFocus: string;
  motivationalTip: string;
}
