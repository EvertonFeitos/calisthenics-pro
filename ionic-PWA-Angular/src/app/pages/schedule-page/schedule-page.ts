import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import {
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ExerciseMediaViewer } from '../../components/exercise-media-viewer/exercise-media-viewer';
import { LevelSelector } from '../../components/level-selector/level-selector';
import { AppStore } from '../../store/app-store';
import {
  Exercise,
  ExerciseType,
  MuscleCategory,
  Workout,
  WorkoutExercise,
  WorkoutScheduleDay,
} from '../../types';

@Component({
  selector: 'app-schedule-page',
  imports: [CommonModule, ReactiveFormsModule, IonModal, LevelSelector, ExerciseMediaViewer],
  templateUrl: './schedule-page.html',
  styleUrl: './schedule-page.scss',
})
export class SchedulePage {
  protected readonly store = inject(AppStore);
  private readonly router = inject(Router);
  private readonly fb = inject(UntypedFormBuilder);

  protected readonly selectedWorkoutForDetail = signal<Workout | null>(null);
  protected readonly editingWorkout = signal<Workout | null>(null);
  protected readonly isScheduleEditorOpen = signal(false);
  protected readonly editingExercise = signal<Exercise | null>(null);
  protected readonly isCreatingExercise = signal(false);

  protected readonly workoutsMap = this.store.workoutsMap;
  protected readonly exercisesMap = this.store.exercisesMap;
  protected readonly currentLevel = this.store.currentLevelInfo;
  protected readonly availableWorkouts = this.store.availableWorkoutsForCurrentLevel;

  protected readonly workoutForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    estimatedMinutes: [30, [Validators.required, Validators.min(5), Validators.max(180)]],
    exercises: this.fb.array([]),
  });

  protected readonly scheduleForm = this.fb.group({
    days: this.fb.array([]),
  });

  protected readonly exerciseForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    type: ['REPETITIONS' as ExerciseType, Validators.required],
    category: ['push' as MuscleCategory, Validators.required],
    muscleGroup: ['Peitoral, Triceps, Deltoides', Validators.required],
    instruction: [''],
    tipsText: [''],
    videoUrl: [''],
    imageUrl: [''],
    levelId: [this.store.currentLevelId()],
  });

  protected readonly availableExercises = computed(() => this.store.exercises());

  protected get workoutItems(): UntypedFormArray {
    return this.workoutForm.get('exercises') as UntypedFormArray;
  }

  protected get scheduleDays(): UntypedFormArray {
    return this.scheduleForm.get('days') as UntypedFormArray;
  }

  protected handleSelectLevel(levelId: string): void {
    void this.store.selectLevel(levelId as never);
  }

  protected openWorkoutDetail(workout: Workout): void {
    this.selectedWorkoutForDetail.set(workout);
  }

  protected closeWorkoutDetail(): void {
    this.selectedWorkoutForDetail.set(null);
  }

  protected startWorkout(workout: Workout): void {
    this.selectedWorkoutForDetail.set(null);
    void this.router.navigate(['/workout', workout.id]);
  }

  protected openWorkoutEditor(workout: Workout): void {
    this.editingWorkout.set(workout);
    this.workoutForm.patchValue({
      name: workout.name,
      description: workout.description,
      estimatedMinutes: workout.estimatedMinutes,
    });
    this.workoutItems.clear();
    workout.exercises
      .slice()
      .sort((a, b) => a.order - b.order)
      .forEach((item) => this.workoutItems.push(this.buildWorkoutItemGroup(item)));
  }

  protected closeWorkoutEditor(): void {
    this.editingWorkout.set(null);
    this.workoutForm.reset({
      name: '',
      description: '',
      estimatedMinutes: 30,
    });
    this.workoutItems.clear();
  }

  protected openCreateExercise(): void {
    this.isCreatingExercise.set(true);
    this.editingExercise.set(null);
    this.exerciseForm.reset({
      name: '',
      description: '',
      type: 'REPETITIONS',
      category: 'push',
      muscleGroup: 'Peitoral, Triceps, Deltoides',
      instruction: '',
      tipsText: '',
      videoUrl: '',
      imageUrl: '',
      levelId: this.store.currentLevelId(),
    });
  }

  protected openEditExercise(exercise: Exercise): void {
    this.editingExercise.set(exercise);
    this.isCreatingExercise.set(false);
    this.exerciseForm.reset({
      name: exercise.name,
      description: exercise.description,
      type: exercise.type,
      category: exercise.category,
      muscleGroup: exercise.muscleGroup,
      instruction: exercise.instruction,
      tipsText: (exercise.tips ?? []).join('\n'),
      videoUrl: exercise.videoUrl ?? '',
      imageUrl: exercise.imageUrl ?? '',
      levelId: exercise.levelId ?? this.store.currentLevelId(),
    });
  }

  protected closeExerciseEditor(): void {
    this.editingExercise.set(null);
    this.isCreatingExercise.set(false);
  }

  protected addExerciseToWorkout(): void {
    const firstExercise = this.availableExercises()[0];
    if (!firstExercise) {
      return;
    }
    this.workoutItems.push(this.buildWorkoutItemGroup(undefined, firstExercise.id));
  }

  protected removeWorkoutItem(index: number): void {
    if (this.workoutItems.length <= 1) {
      return;
    }
    this.workoutItems.removeAt(index);
  }

  protected moveWorkoutItem(index: number, direction: 'up' | 'down'): void {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= this.workoutItems.length) {
      return;
    }
    const current = this.workoutItems.at(index);
    const target = this.workoutItems.at(targetIndex);
    this.workoutItems.setControl(index, target);
    this.workoutItems.setControl(targetIndex, current);
  }

  protected workoutItemIsTimeBased(index: number): boolean {
    const exerciseId = this.workoutItems.at(index)?.get('exerciseId')?.value;
    return this.exercisesMap()[exerciseId]?.type === 'TIME';
  }

  protected async saveWorkout(): Promise<void> {
    const editingWorkout = this.editingWorkout();
    if (!editingWorkout || this.workoutForm.invalid) {
      this.workoutForm.markAllAsTouched();
      return;
    }

    const rows = this.workoutItems.getRawValue() as Array<Record<string, unknown>>;
    const exercises: WorkoutExercise[] = rows.map((row, index) => {
      const exerciseId = String(row['exerciseId']);
      const isTimeBased = this.exercisesMap()[exerciseId]?.type === 'TIME';
      return {
        id: String(row['id'] || `we_${editingWorkout.id}_${Date.now()}_${index + 1}`),
        workoutId: editingWorkout.id,
        exerciseId,
        order: index + 1,
        sets: Number(row['sets'] || 3),
        targetRepetitions: isTimeBased ? undefined : Number(row['targetRepetitions'] || 0),
        targetDuration: isTimeBased ? Number(row['targetDuration'] || 0) : undefined,
        restDuration: Number(row['restDuration'] || 120),
      };
    });

    await this.store.saveWorkout({
      ...editingWorkout,
      name: String(this.workoutForm.value.name || editingWorkout.name),
      description: String(this.workoutForm.value.description || ''),
      estimatedMinutes: Number(this.workoutForm.value.estimatedMinutes || 30),
      exercises,
    });

    this.closeWorkoutEditor();
  }

  protected async saveExercise(): Promise<void> {
    if (this.exerciseForm.invalid) {
      this.exerciseForm.markAllAsTouched();
      return;
    }

    const current = this.editingExercise();
    const value = this.exerciseForm.getRawValue();
    const exercise: Exercise = {
      id: current?.id ?? `ex_custom_${Date.now()}`,
      name: String(value.name || ''),
      description: String(value.description || ''),
      type: value.type as ExerciseType,
      category: value.category as MuscleCategory,
      muscleGroup: String(value.muscleGroup || ''),
      instruction: String(value.instruction || ''),
      tips: String(value.tipsText || '')
        .split('\n')
        .map((tip) => tip.trim())
        .filter(Boolean),
      videoUrl: String(value.videoUrl || '') || undefined,
      imageUrl: String(value.imageUrl || '') || undefined,
      levelId: value.levelId as never,
    };

    await this.store.saveExercise(exercise);

    if (!current && this.editingWorkout()) {
      const lastGroup = this.workoutItems.at(this.workoutItems.length - 1) as UntypedFormGroup | null;
      if (lastGroup && !lastGroup.get('exerciseId')?.value) {
        lastGroup.patchValue({ exerciseId: exercise.id });
      }
    }

    this.closeExerciseEditor();
  }

  protected async deleteExercise(): Promise<void> {
    const current = this.editingExercise();
    if (!current) {
      return;
    }

    if (window.confirm(`Deseja realmente excluir o exercício "${current.name}"?`)) {
      await this.store.deleteExercise(current.id);
      this.workoutItems.controls.forEach((control) => {
        if (control.get('exerciseId')?.value === current.id) {
          const fallback = this.availableExercises().find((exercise) => exercise.id !== current.id);
          control.patchValue({
            exerciseId: fallback?.id ?? '',
          });
        }
      });
      this.closeExerciseEditor();
    }
  }

  protected openScheduleEditor(): void {
    this.isScheduleEditorOpen.set(true);
    this.scheduleDays.clear();
    this.store.schedule()
      .slice()
      .sort((a, b) => a.order - b.order)
      .forEach((day) => this.scheduleDays.push(this.buildScheduleDayGroup(day)));
  }

  protected closeScheduleEditor(): void {
    this.isScheduleEditorOpen.set(false);
    this.scheduleDays.clear();
  }

  protected addScheduleDay(): void {
    const nextDayNumber = this.scheduleDays.length + 1;
    const firstWorkout = this.availableWorkouts()[0];
    this.scheduleDays.push(
      this.buildScheduleDayGroup({
        id: `sch_custom_${this.currentLevel().id}_${Date.now()}_${nextDayNumber}`,
        levelId: this.currentLevel().id,
        dayNumber: nextDayNumber,
        dayOfWeek: `Dia ${nextDayNumber}`,
        workoutId: firstWorkout?.id ?? null,
        isRestDay: !firstWorkout,
        order: nextDayNumber,
        notes: '',
      })
    );
  }

  protected removeScheduleDay(index: number): void {
    if (this.scheduleDays.length <= 1) {
      return;
    }
    this.scheduleDays.removeAt(index);
  }

  protected toggleRestDay(index: number): void {
    const group = this.scheduleDays.at(index) as UntypedFormGroup;
    const isRestDay = !!group.get('isRestDay')?.value;
    const firstWorkout = this.availableWorkouts()[0];
    group.patchValue({
      isRestDay: !isRestDay,
      workoutId: isRestDay ? firstWorkout?.id ?? null : null,
    });
  }

  protected async saveSchedule(): Promise<void> {
    const raw = this.scheduleDays.getRawValue() as Array<Record<string, unknown>>;
    const days: WorkoutScheduleDay[] = raw.map((row, index) => ({
      id: String(row['id']),
      levelId: this.currentLevel().id,
      dayNumber: index + 1,
      dayOfWeek: String(row['dayOfWeek'] || `Dia ${index + 1}`),
      workoutId: row['isRestDay'] ? null : (row['workoutId'] as string | null),
      isRestDay: !!row['isRestDay'],
      order: index + 1,
      notes: String(row['notes'] || ''),
    }));
    await this.store.saveSchedule(days);
    this.closeScheduleEditor();
  }

  protected async resetSchedule(): Promise<void> {
    await this.store.resetSchedule();
    this.openScheduleEditor();
  }

  protected getExerciseName(exerciseId: string): string {
    return this.exercisesMap()[exerciseId]?.name ?? 'Exercício';
  }

  protected getExerciseById(exerciseId: string): Exercise | null {
    return this.exercisesMap()[exerciseId] ?? null;
  }

  private buildWorkoutItemGroup(item?: WorkoutExercise, fallbackExerciseId?: string): UntypedFormGroup {
    const exerciseId = item?.exerciseId ?? fallbackExerciseId ?? this.availableExercises()[0]?.id ?? '';
    const isTimeBased = this.exercisesMap()[exerciseId]?.type === 'TIME';
    return this.fb.group({
      id: [item?.id ?? `we_custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`],
      exerciseId: [exerciseId, Validators.required],
      sets: [item?.sets ?? 3, [Validators.required, Validators.min(1), Validators.max(20)]],
      targetRepetitions: [isTimeBased ? undefined : item?.targetRepetitions ?? 8],
      targetDuration: [isTimeBased ? item?.targetDuration ?? 15 : undefined],
      restDuration: [item?.restDuration ?? 120, Validators.required],
    });
  }

  private buildScheduleDayGroup(day: WorkoutScheduleDay): UntypedFormGroup {
    return this.fb.group({
      id: [day.id],
      dayNumber: [day.dayNumber],
      dayOfWeek: [day.dayOfWeek ?? `Dia ${day.dayNumber}`],
      workoutId: [day.workoutId],
      isRestDay: [day.isRestDay],
      notes: [day.notes ?? ''],
    });
  }
}
