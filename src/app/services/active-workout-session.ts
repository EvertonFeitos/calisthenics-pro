import { Injectable, computed, signal } from '@angular/core';
import {
  Exercise,
  ExerciseSession,
  LevelId,
  SetSession,
  Workout,
  WorkoutSession,
} from '../types';
import { hapticService } from './hapticService';
import { soundService } from './soundService';

export type WorkoutPhase = 'WORKING' | 'RESTING' | 'PAUSED';
export type TimerMode = 'REST_ONLY' | 'AUTO_WORK_REST';

@Injectable({
  providedIn: 'root',
})
export class ActiveWorkoutSession {
  readonly workout = signal<Workout | null>(null);
  readonly currentLevelId = signal<LevelId>('basico');
  readonly exercisesMap = signal<Record<string, Exercise>>({});
  readonly defaultRestDuration = signal(120);
  readonly startedAt = signal(new Date().toISOString());
  readonly currentExerciseIndex = signal(0);
  readonly currentSetIndex = signal(0);
  readonly timerMode = signal<TimerMode>('REST_ONLY');
  readonly phase = signal<WorkoutPhase>('WORKING');
  readonly previousPhase = signal<WorkoutPhase>('WORKING');
  readonly sessionExercises = signal<ExerciseSession[]>([]);
  readonly inputVal = signal(0);
  readonly skipInputVal = signal(false);
  readonly restDuration = signal(120);
  readonly timeLeft = signal(0);
  readonly workStopwatch = signal(0);
  readonly totalWorkoutDuration = signal(0);

  private timerRef: ReturnType<typeof setInterval> | null = null;
  private totalTimerRef: ReturnType<typeof setInterval> | null = null;

  readonly currentWorkoutExercise = computed(() => {
    const workout = this.workout();
    if (!workout) {
      return null;
    }
    return workout.exercises[this.currentExerciseIndex()] ?? null;
  });

  readonly currentExerciseData = computed(() => {
    const current = this.currentWorkoutExercise();
    if (!current) {
      return null;
    }
    return this.exercisesMap()[current.exerciseId] ?? null;
  });

  readonly isTimeBased = computed(() => this.currentExerciseData()?.type === 'TIME');

  readonly totalSetsInWorkout = computed(() => {
    const workout = this.workout();
    return workout ? workout.exercises.reduce((sum, exercise) => sum + exercise.sets, 0) : 0;
  });

  readonly completedSetsCount = computed(() =>
    this.sessionExercises().reduce(
      (sum, exercise) => sum + exercise.sets.filter((set) => set.completed).length,
      0
    )
  );

  readonly progressPercent = computed(() => {
    const total = this.totalSetsInWorkout();
    return total > 0 ? Math.min(100, Math.round((this.completedSetsCount() / total) * 100)) : 0;
  });

  readonly nextActionLabel = computed(() => {
    const workout = this.workout();
    const currentExercise = this.currentWorkoutExercise();
    if (!workout || !currentExercise) {
      return 'Finalização do treino';
    }
    if (this.currentSetIndex() + 1 < currentExercise.sets) {
      const currentName = this.currentExerciseData()?.name ?? 'Exercício';
      return `Série ${this.currentSetIndex() + 2} de ${currentExercise.sets} (${currentName})`;
    }
    const nextExercise = workout.exercises[this.currentExerciseIndex() + 1];
    if (nextExercise) {
      return this.exercisesMap()[nextExercise.exerciseId]?.name ?? 'Próximo exercício';
    }
    return 'Finalização do treino';
  });

  initialize(
    workout: Workout,
    currentLevelId: LevelId,
    exercisesMap: Record<string, Exercise>,
    defaultRestDuration: number
  ): void {
    this.reset();

    this.workout.set(workout);
    this.currentLevelId.set(currentLevelId);
    this.exercisesMap.set(exercisesMap);
    this.defaultRestDuration.set(defaultRestDuration);
    this.startedAt.set(new Date().toISOString());
    this.phase.set('WORKING');
    this.previousPhase.set('WORKING');
    this.timerMode.set('REST_ONLY');

    const sessionExercises = workout.exercises.map((item, index) => {
      const exercise = exercisesMap[item.exerciseId];
      const sets: SetSession[] = Array.from({ length: item.sets }, (_, setIndex) => ({
        id: `set_${item.id}_${setIndex + 1}`,
        setNumber: setIndex + 1,
        targetRepetitions: item.targetRepetitions,
        actualRepetitions: null,
        targetDuration: item.targetDuration,
        actualDuration: null,
        completed: false,
      }));

      return {
        id: `es_${workout.id}_${item.id}`,
        exerciseId: item.exerciseId,
        exerciseName: exercise?.name ?? 'Exercício',
        type: exercise?.type ?? 'REPETITIONS',
        order: index + 1,
        sets,
      };
    });

    this.sessionExercises.set(sessionExercises);
    this.syncCurrentExerciseDefaults();
    this.startTotalTimer();
    this.runPhaseTimer();
  }

  destroy(): void {
    this.reset();
  }

  setTimerMode(mode: TimerMode): void {
    this.timerMode.set(mode);
    if (mode === 'AUTO_WORK_REST' && this.isTimeBased() && this.phase() === 'WORKING') {
      const target = this.currentWorkoutExercise()?.targetDuration ?? this.inputVal();
      this.timeLeft.set(target);
      this.runPhaseTimer();
      return;
    }
    if (mode === 'REST_ONLY' && this.phase() === 'WORKING') {
      this.timeLeft.set(0);
      this.runPhaseTimer();
    }
  }

  togglePause(): void {
    if (this.phase() === 'PAUSED') {
      this.phase.set(this.previousPhase());
    } else {
      this.previousPhase.set(this.phase());
      this.phase.set('PAUSED');
    }
    this.runPhaseTimer();
  }

  setInputValue(value: number): void {
    this.inputVal.set(Math.max(0, value));
  }

  incrementInput(delta: number): void {
    this.inputVal.update((value) => Math.max(0, value + delta));
  }

  toggleSkipInput(): void {
    this.skipInputVal.update((value) => !value);
  }

  adjustRest(deltaSeconds: number): void {
    this.timeLeft.update((value) => Math.max(5, value + deltaSeconds));
  }

  setExactRest(seconds: number): void {
    this.restDuration.set(seconds);
    this.timeLeft.set(seconds);
  }

  skipRest(): void {
    this.clearPhaseTimer();
    this.advanceToNextSetAfterRest();
  }

  completeSet(customValue?: number): WorkoutSession | null {
    const workout = this.workout();
    const currentWorkoutExercise = this.currentWorkoutExercise();
    if (!workout || !currentWorkoutExercise) {
      return null;
    }

    soundService.playSetComplete();
    hapticService.vibrate([30, 20, 30]);

    const actualRepetitions = !this.isTimeBased()
      ? this.skipInputVal()
        ? null
        : customValue ?? this.inputVal()
      : null;

    const actualDuration = this.isTimeBased()
      ? this.skipInputVal()
        ? null
        : this.timerMode() === 'AUTO_WORK_REST'
          ? currentWorkoutExercise.targetDuration ?? 15
          : this.workStopwatch() > 0
            ? this.workStopwatch()
            : this.inputVal()
      : null;

    const updatedExercises = [...this.sessionExercises()];
    const currentExercise = updatedExercises[this.currentExerciseIndex()];
    if (currentExercise?.sets[this.currentSetIndex()]) {
      currentExercise.sets[this.currentSetIndex()] = {
        ...currentExercise.sets[this.currentSetIndex()],
        actualRepetitions,
        actualDuration,
        completed: true,
        completedAt: new Date().toISOString(),
      };
      this.sessionExercises.set(updatedExercises);
    }

    const isLastExercise = this.currentExerciseIndex() === workout.exercises.length - 1;
    const isLastSet = this.currentSetIndex() === currentWorkoutExercise.sets - 1;

    if (isLastExercise && isLastSet) {
      return this.finishWorkout();
    }

    this.phase.set('RESTING');
    this.timeLeft.set(this.restDuration());
    this.runPhaseTimer();
    return null;
  }

  formatTime(seconds: number): string {
    const safeSeconds = Math.max(0, seconds);
    const minutes = Math.floor(safeSeconds / 60);
    const remainder = safeSeconds % 60;
    return `${minutes}:${remainder < 10 ? '0' : ''}${remainder}`;
  }

  finishWorkoutEarly(): WorkoutSession | null {
    if (!this.workout()) {
      return null;
    }

    return this.buildWorkoutSession(
      'CANCELLED',
      'Sessão encerrada antes da conclusão de todas as séries.'
    );
  }

  private finishWorkout(): WorkoutSession {
    soundService.playWorkoutComplete();
    hapticService.vibrate([60, 40, 60, 40, 90]);
    return this.buildWorkoutSession('COMPLETED');
  }

  private advanceToNextSetAfterRest(): void {
    const workout = this.workout();
    const currentExercise = this.currentWorkoutExercise();
    if (!workout || !currentExercise) {
      return;
    }

    if (this.currentSetIndex() + 1 < currentExercise.sets) {
      this.currentSetIndex.update((value) => value + 1);
      this.phase.set('WORKING');
      this.workStopwatch.set(0);
      this.syncCurrentExerciseDefaults();
      this.runPhaseTimer();
      return;
    }

    if (this.currentExerciseIndex() + 1 < workout.exercises.length) {
      this.currentExerciseIndex.update((value) => value + 1);
      this.currentSetIndex.set(0);
      this.phase.set('WORKING');
      this.workStopwatch.set(0);
      this.syncCurrentExerciseDefaults();
      this.runPhaseTimer();
      return;
    }
  }

  private syncCurrentExerciseDefaults(): void {
    const exercise = this.currentWorkoutExercise();
    if (!exercise) {
      return;
    }

    const target = this.isTimeBased()
      ? exercise.targetDuration ?? 15
      : exercise.targetRepetitions ?? 8;

    this.restDuration.set(exercise.restDuration || this.defaultRestDuration() || 120);
    this.inputVal.set(target);
    this.skipInputVal.set(false);
    this.timeLeft.set(this.timerMode() === 'AUTO_WORK_REST' && this.isTimeBased() ? target : 0);
  }

  private startTotalTimer(): void {
    this.clearTotalTimer();
    this.totalTimerRef = setInterval(() => {
      this.totalWorkoutDuration.update((value) => value + 1);
    }, 1000);
  }

  private runPhaseTimer(): void {
    this.clearPhaseTimer();

    if (this.phase() === 'PAUSED') {
      return;
    }

    if (this.phase() === 'RESTING') {
      this.timerRef = setInterval(() => {
        const next = this.timeLeft() - 1;
        if (next < 0) {
          return;
        }
        this.timeLeft.set(next);
        if (next <= 3 && next >= 1) {
          soundService.playCountdownTick(next === 1 ? 800 : 600);
        }
        if (next === 0) {
          this.clearPhaseTimer();
          soundService.playRestFinished();
          hapticService.vibrate([20, 20, 20]);
          this.advanceToNextSetAfterRest();
        }
      }, 1000);
      return;
    }

    if (this.phase() === 'WORKING') {
      if (this.timerMode() === 'AUTO_WORK_REST' && this.isTimeBased()) {
        if (this.timeLeft() <= 0) {
          this.timeLeft.set(this.currentWorkoutExercise()?.targetDuration ?? this.inputVal());
        }
        this.timerRef = setInterval(() => {
          const next = this.timeLeft() - 1;
          if (next < 0) {
            return;
          }
          this.timeLeft.set(next);
          if (next <= 3 && next >= 1) {
            soundService.playCountdownTick(next === 1 ? 800 : 600);
          }
          if (next === 0) {
            this.clearPhaseTimer();
            this.completeSet(this.inputVal());
          }
        }, 1000);
        return;
      }

      this.timerRef = setInterval(() => {
        this.workStopwatch.update((value) => value + 1);
      }, 1000);
    }
  }

  private reset(): void {
    this.clearAllTimers();
    this.workout.set(null);
    this.currentLevelId.set('basico');
    this.exercisesMap.set({});
    this.startedAt.set(new Date().toISOString());
    this.currentExerciseIndex.set(0);
    this.currentSetIndex.set(0);
    this.timerMode.set('REST_ONLY');
    this.phase.set('WORKING');
    this.previousPhase.set('WORKING');
    this.sessionExercises.set([]);
    this.inputVal.set(0);
    this.skipInputVal.set(false);
    this.restDuration.set(120);
    this.timeLeft.set(0);
    this.workStopwatch.set(0);
    this.totalWorkoutDuration.set(0);
  }

  private clearAllTimers(): void {
    this.clearPhaseTimer();
    this.clearTotalTimer();
  }

  private clearPhaseTimer(): void {
    if (this.timerRef) {
      clearInterval(this.timerRef);
      this.timerRef = null;
    }
  }

  private clearTotalTimer(): void {
    if (this.totalTimerRef) {
      clearInterval(this.totalTimerRef);
      this.totalTimerRef = null;
    }
  }

  private buildWorkoutSession(
    status: WorkoutSession['status'],
    notes?: string
  ): WorkoutSession {
    this.clearAllTimers();

    return {
      id: `session_${Date.now()}`,
      workoutId: this.workout()!.id,
      levelId: this.currentLevelId(),
      workoutName: this.workout()!.name,
      startedAt: this.startedAt(),
      finishedAt: new Date().toISOString(),
      durationSeconds: this.totalWorkoutDuration(),
      status,
      exercises: this.sessionExercises(),
      notes,
    };
  }
}
