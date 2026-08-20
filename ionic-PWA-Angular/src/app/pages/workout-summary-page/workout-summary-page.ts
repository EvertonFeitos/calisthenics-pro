import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStore } from '../../store/app-store';

@Component({
  selector: 'app-workout-summary-page',
  imports: [CommonModule],
  templateUrl: './workout-summary-page.html',
  styleUrl: './workout-summary-page.scss',
})
export class WorkoutSummaryPage {
  protected readonly store = inject(AppStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly sessionId = signal(this.route.snapshot.paramMap.get('sessionId'));
  protected readonly celebrationMarks = [
    { left: 10, top: 12, delay: '0ms', scale: 0.9 },
    { left: 22, top: 6, delay: '120ms', scale: 0.7 },
    { left: 76, top: 10, delay: '220ms', scale: 0.95 },
    { left: 88, top: 18, delay: '340ms', scale: 0.8 },
    { left: 15, top: 78, delay: '160ms', scale: 0.75 },
    { left: 84, top: 74, delay: '280ms', scale: 0.9 },
  ];

  protected readonly session = computed(() => {
    const sessionId = this.sessionId();
    if (!sessionId) {
      return null;
    }
    return this.store.getSessionById(sessionId);
  });

  protected readonly levelInfo = computed(() => {
    const session = this.session();
    if (!session) {
      return this.store.currentLevelInfo();
    }
    return this.store.levelsMap()[session.levelId] ?? this.store.currentLevelInfo();
  });

  protected readonly totals = computed(() => {
    const session = this.session();
    let totalRepsDone = 0;
    let totalHoldSecondsDone = 0;
    let totalCompletedSets = 0;
    let totalTargetSets = 0;

    if (!session) {
      return {
        totalRepsDone,
        totalHoldSecondsDone,
        totalCompletedSets,
        totalTargetSets,
      };
    }

    for (const exercise of session.exercises) {
      for (const set of exercise.sets) {
        totalTargetSets += 1;
        if (!set.completed) {
          continue;
        }
        totalCompletedSets += 1;
        if (set.actualRepetitions !== null) {
          totalRepsDone += set.actualRepetitions;
        }
        if (set.actualDuration !== null) {
          totalHoldSecondsDone += set.actualDuration;
        }
      }
    }

    return {
      totalRepsDone,
      totalHoldSecondsDone,
      totalCompletedSets,
      totalTargetSets,
    };
  });

  protected formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}s`;
  }

  protected formatExerciseBreakdown(
    sets: Array<{ completed: boolean; actualRepetitions: number | null; actualDuration: number | null }>
  ): string {
    const value = sets
      .filter((set) => set.completed)
      .map((set) =>
        set.actualRepetitions !== null
          ? `${set.actualRepetitions}r`
          : set.actualDuration !== null
            ? `${set.actualDuration}s`
            : '✓'
      )
      .join(' → ');
    return value || 'Concluído';
  }

  protected getCompletedSetCount(
    sets: Array<{ completed: boolean; actualRepetitions: number | null; actualDuration: number | null }>
  ): number {
    return sets.filter((set) => set.completed).length;
  }

  protected goToHistory(): void {
    this.store.setLastSummarySessionId(null);
    void this.router.navigate(['/app/history']);
  }

  protected goToSchedule(): void {
    this.store.setLastSummarySessionId(null);
    void this.router.navigate(['/app/schedule']);
  }
}
