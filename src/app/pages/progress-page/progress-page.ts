import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppStore } from '../../store/app-store';

@Component({
  selector: 'app-progress-page',
  imports: [CommonModule],
  templateUrl: './progress-page.html',
  styleUrl: './progress-page.scss',
})
export class ProgressPage {
  protected readonly store = inject(AppStore);
  private readonly router = inject(Router);

  protected readonly progress = computed(() => {
    let totalRepetitions = 0;
    let totalHoldSeconds = 0;
    let totalMinutes = 0;
    let trackedSessions = 0;

    const personalRecords: Array<{
      exerciseId: string;
      exerciseName: string;
      muscleGroup: string;
      value: string;
      sessionsCount: number;
    }> = [];

    const prMap = new Map<string, {
      name: string;
      muscleGroup: string;
      maxReps: number;
      maxDuration: number;
      sessionsCount: number;
    }>();
    const timelineMap = new Map<
      string,
      Array<{ date: string; setsReps: string; totalVolume: number }>
    >();

    const sessions = [...this.store.sessions()].reverse();
    const completedWorkouts = sessions.filter((session) => session.status === 'COMPLETED').length;
    const partialWorkouts = sessions.filter((session) => session.status === 'CANCELLED').length;

    for (const session of sessions) {
      let sessionHasVolume = false;
      totalMinutes += Math.floor(session.durationSeconds / 60);
      for (const exercise of session.exercises) {
        const definition = this.store.exercisesMap()[exercise.exerciseId];
        const existing = prMap.get(exercise.exerciseId) ?? {
          name: exercise.exerciseName,
          muscleGroup: definition?.muscleGroup ?? 'Calistenia',
          maxReps: 0,
          maxDuration: 0,
          sessionsCount: 0,
        };

        const values: number[] = [];
        const setStrings: string[] = [];

        for (const set of exercise.sets) {
          if (!set.completed) {
            continue;
          }
          sessionHasVolume = true;
          if (set.actualRepetitions !== null) {
            totalRepetitions += set.actualRepetitions;
            existing.maxReps = Math.max(existing.maxReps, set.actualRepetitions);
            values.push(set.actualRepetitions);
            setStrings.push(`${set.actualRepetitions}`);
          } else if (set.actualDuration !== null) {
            totalHoldSeconds += set.actualDuration;
            existing.maxDuration = Math.max(existing.maxDuration, set.actualDuration);
            values.push(set.actualDuration);
            setStrings.push(`${set.actualDuration}s`);
          }
        }

        prMap.set(exercise.exerciseId, existing);

        if (setStrings.length > 0) {
          existing.sessionsCount += 1;
          const timeline = timelineMap.get(exercise.exerciseId) ?? [];
          timeline.push({
            date: new Date(session.startedAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
            }),
            setsReps: setStrings.join(' → '),
            totalVolume: values.reduce((sum, value) => sum + value, 0),
          });
          timelineMap.set(exercise.exerciseId, timeline);
        }
      }

      if (sessionHasVolume) {
        trackedSessions += 1;
      }
    }

    for (const [exerciseId, record] of prMap.entries()) {
      personalRecords.push({
        exerciseId,
        exerciseName: record.name,
        muscleGroup: record.muscleGroup,
        value: record.maxReps > 0 ? `${record.maxReps} reps` : `${record.maxDuration}s`,
        sessionsCount: record.sessionsCount,
      });
    }

    const timeline = Array.from(timelineMap.entries()).map(([exerciseId, items]) => ({
      exerciseId,
      exerciseName: prMap.get(exerciseId)?.name ?? 'Exercício',
      items,
    }));

    return {
      totalRepetitions,
      totalHoldSeconds,
      totalMinutes,
      totalWorkouts: completedWorkouts,
      partialWorkouts,
      trackedSessions,
      personalRecords,
      timeline,
    };
  });

  protected goToCoach(): void {
    void this.router.navigate(['/app/coach']);
  }
}
