import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppStore } from '../../store/app-store';

@Component({
  selector: 'app-history-page',
  imports: [CommonModule],
  templateUrl: './history-page.html',
  styleUrl: './history-page.scss',
})
export class HistoryPage {
  protected readonly store = inject(AppStore);
  private readonly router = inject(Router);
  protected readonly expandedSessionId = signal<string | null>(null);

  constructor() {
    effect(() => {
      const firstId = this.store.sessions()[0]?.id ?? null;
      if (!this.expandedSessionId() && firstId) {
        this.expandedSessionId.set(firstId);
      }
    });
  }

  protected toggleExpand(sessionId: string): void {
    this.expandedSessionId.update((current) => (current === sessionId ? null : sessionId));
  }

  protected formatDate(isoString: string): string {
    try {
      return new Date(isoString).toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  }

  protected formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}s`;
  }

  protected getCompletedSetsCount(sessionId: string): number {
    const session = this.store.getSessionById(sessionId);
    if (!session) {
      return 0;
    }

    return session.exercises.reduce(
      (total, exercise) => total + exercise.sets.filter((set) => set.completed).length,
      0
    );
  }

  protected getVolumeLabel(sessionId: string): string {
    const session = this.store.getSessionById(sessionId);
    if (!session) {
      return '0 reps';
    }

    let totalReps = 0;
    let totalHoldSeconds = 0;

    for (const exercise of session.exercises) {
      for (const set of exercise.sets) {
        if (!set.completed) {
          continue;
        }
        if (set.actualRepetitions !== null) {
          totalReps += set.actualRepetitions;
        }
        if (set.actualDuration !== null) {
          totalHoldSeconds += set.actualDuration;
        }
      }
    }

    return totalReps > 0 ? `${totalReps} reps` : `${totalHoldSeconds}s hold`;
  }

  protected async deleteSession(sessionId: string): Promise<void> {
    if (window.confirm('Tem certeza que deseja excluir este registro do histórico?')) {
      await this.store.deleteWorkoutSession(sessionId);
    }
  }

  protected goToSchedule(): void {
    void this.router.navigate(['/app/schedule']);
  }

  protected goToExercises(): void {
    void this.router.navigate(['/app/exercises']);
  }
}
