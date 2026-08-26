import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseMediaViewer } from '../../components/exercise-media-viewer/exercise-media-viewer';
import { ActiveWorkoutSession, TimerMode } from '../../services/active-workout-session';
import { soundService } from '../../services/soundService';
import { AppStore } from '../../store/app-store';
import { Workout } from '../../types';

@Component({
  selector: 'app-active-workout-page',
  imports: [CommonModule, ExerciseMediaViewer],
  templateUrl: './active-workout-page.html',
  styleUrl: './active-workout-page.scss',
})
export class ActiveWorkoutPage {
  protected readonly store = inject(AppStore);
  protected readonly session = inject(ActiveWorkoutSession);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly workout = signal<Workout | null>(null);
  protected readonly showExitConfirm = signal(false);
  protected readonly showMediaModal = signal(false);
  private readonly workoutId = signal(this.route.snapshot.paramMap.get('workoutId'));
  private readonly initializedWorkoutId = signal<string | null>(null);
  private hasRedirectedMissingWorkout = false;

  protected readonly currentWorkoutExercise = this.session.currentWorkoutExercise;
  protected readonly currentExerciseData = this.session.currentExerciseData;
  protected readonly isTimeBased = this.session.isTimeBased;
  protected readonly progressPercent = this.session.progressPercent;
  protected readonly nextActionLabel = this.session.nextActionLabel;
  protected readonly totalSetsInWorkout = this.session.totalSetsInWorkout;
  protected readonly completedSetsCount = this.session.completedSetsCount;
  protected readonly canSavePartial = computed(() => this.completedSetsCount() > 0);

  protected readonly restPresetValues = [30, 60, 90, 120, 180];
  protected readonly inputPresetValues = [0, 3, 5, 8, 10, 12, 15];

  protected readonly canShowWorkout = computed(
    () => !this.store.isLoading() && !!this.workout() && !!this.currentWorkoutExercise()
  );

  constructor() {
    effect(() => {
      const workoutId = this.workoutId();
      if (!workoutId || this.store.isLoading()) {
        return;
      }

      const workout = this.store.getWorkoutById(workoutId);
      if (!workout) {
        if (!this.hasRedirectedMissingWorkout) {
          this.hasRedirectedMissingWorkout = true;
          void this.router.navigate(['/app/schedule']);
        }
        return;
      }

      if (this.initializedWorkoutId() === workout.id) {
        this.workout.set(workout);
        return;
      }

      this.workout.set(workout);
      this.initializedWorkoutId.set(workout.id);
      this.session.initialize(
        workout,
        this.store.currentLevelId(),
        this.store.exercisesMap(),
        this.store.userSettings().defaultRestDuration
      );
    });
  }

  ngOnDestroy(): void {
    this.session.destroy();
  }

  protected formatTime(seconds: number): string {
    return this.session.formatTime(seconds);
  }

  protected toggleTimerMode(): void {
    const nextMode: TimerMode =
      this.session.timerMode() === 'REST_ONLY' ? 'AUTO_WORK_REST' : 'REST_ONLY';
    this.session.setTimerMode(nextMode);
  }

  protected async togglePause(): Promise<void> {
    await soundService.unlock();
    this.session.togglePause();
  }

  protected toggleSkipInput(): void {
    this.session.toggleSkipInput();
  }

  protected incrementInput(delta: number): void {
    this.session.incrementInput(delta);
  }

  protected setInputPreset(value: number): void {
    this.session.setInputValue(value);
  }

  protected adjustRest(delta: number): void {
    this.session.adjustRest(delta);
  }

  protected setExactRest(seconds: number): void {
    this.session.setExactRest(seconds);
  }

  protected async skipRest(): Promise<void> {
    await soundService.unlock();
    this.session.skipRest();
  }

  protected async completeSet(): Promise<void> {
    await soundService.unlock();
    const workoutSession = this.session.completeSet();
    if (!workoutSession) {
      return;
    }

    await this.store.saveWorkoutSession(workoutSession);
    this.session.destroy();
    void this.router.navigate(['/summary', workoutSession.id]);
  }

  protected async finishWorkoutEarly(): Promise<void> {
    if (!this.canSavePartial()) {
      return;
    }

    const workoutSession = this.session.finishWorkoutEarly();
    if (!workoutSession) {
      return;
    }

    await this.store.saveWorkoutSession(workoutSession);
    this.showExitConfirm.set(false);
    this.session.destroy();
    void this.router.navigate(['/summary', workoutSession.id]);
  }

  protected async confirmCancelWorkout(): Promise<void> {
    this.showExitConfirm.set(false);
    this.session.destroy();
    void this.router.navigate(['/app/schedule']);
  }
}
