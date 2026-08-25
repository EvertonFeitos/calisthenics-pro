import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { IonModal } from '@ionic/angular';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { ExerciseMediaViewer } from '../../components/exercise-media-viewer/exercise-media-viewer';
import { AppStore } from '../../store/app-store';
import { Exercise, ExerciseType, MuscleCategory } from '../../types';

@Component({
  selector: 'app-exercises-page',
  imports: [CommonModule, ReactiveFormsModule, IonModal, ExerciseMediaViewer],
  templateUrl: './exercises-page.html',
  styleUrl: './exercises-page.scss',
})
export class ExercisesPage {
  protected readonly store = inject(AppStore);
  private readonly fb = inject(UntypedFormBuilder);

  protected readonly searchQuery = signal('');
  protected readonly selectedCategory = signal<string>('all');
  protected readonly editingExercise = signal<Exercise | null>(null);
  protected readonly isCreatingExercise = signal(false);

  protected readonly categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'Todos' },
    { id: 'push', label: 'Empurrar (Push)' },
    { id: 'pull', label: 'Puxar (Pull)' },
    { id: 'legs_core', label: 'Pernas & Core' },
    { id: 'arms', label: 'Braços (Arms)' },
    { id: 'skills', label: 'Skills & Isometrias' },
  ];

  protected readonly filteredExercises = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.selectedCategory();
    return this.store.exercises().filter((exercise) => {
      const matchesQuery =
        query.length === 0 ||
        exercise.name.toLowerCase().includes(query) ||
        exercise.muscleGroup.toLowerCase().includes(query) ||
        (exercise.instruction ?? '').toLowerCase().includes(query);
      const matchesCategory = category === 'all' || exercise.category === category;
      return matchesQuery && matchesCategory;
    });
  });

  protected readonly exerciseForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    type: ['REPETITIONS' as ExerciseType, Validators.required],
    category: ['push' as MuscleCategory, Validators.required],
    muscleGroup: ['Peitoral, Tríceps, Deltoides', Validators.required],
    instruction: [''],
    tipsText: [''],
    videoUrl: [''],
    imageUrl: [''],
    levelId: [this.store.currentLevelId()],
  });

  protected openCreateExercise(): void {
    this.isCreatingExercise.set(true);
    this.editingExercise.set(null);
    this.exerciseForm.reset({
      name: '',
      description: '',
      type: 'REPETITIONS',
      category: 'push',
      muscleGroup: 'Peitoral, Tríceps, Deltoides',
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

  protected closeEditor(): void {
    this.editingExercise.set(null);
    this.isCreatingExercise.set(false);
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
    this.closeEditor();
  }

  protected async deleteExercise(): Promise<void> {
    const current = this.editingExercise();
    if (!current) {
      return;
    }
    if (window.confirm(`Deseja realmente excluir o exercício "${current.name}"?`)) {
      await this.store.deleteExercise(current.id);
      this.closeEditor();
    }
  }

  protected categoryLabel(category: MuscleCategory): string {
    switch (category) {
      case 'push':
        return 'Empurrar (Push)';
      case 'pull':
        return 'Puxar (Pull)';
      case 'arms':
        return 'Braços (Arms)';
      case 'legs_core':
        return 'Pernas & Core';
      case 'skills':
        return 'Skills & Isometrias';
      default:
        return 'Full Body';
    }
  }
}
