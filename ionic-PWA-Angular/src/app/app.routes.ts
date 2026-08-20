import { Routes } from '@angular/router';
import { ActiveWorkoutPage } from './pages/active-workout-page/active-workout-page';
import { AppShell } from './pages/app-shell/app-shell';
import { CoachPage } from './pages/coach-page/coach-page';
import { ExercisesPage } from './pages/exercises-page/exercises-page';
import { HistoryPage } from './pages/history-page/history-page';
import { ProgressPage } from './pages/progress-page/progress-page';
import { SchedulePage } from './pages/schedule-page/schedule-page';
import { SettingsPage } from './pages/settings-page/settings-page';
import { WorkoutSummaryPage } from './pages/workout-summary-page/workout-summary-page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app/schedule',
  },
  {
    path: 'app',
    component: AppShell,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'schedule',
      },
      {
        path: 'schedule',
        component: SchedulePage,
      },
      {
        path: 'exercises',
        component: ExercisesPage,
      },
      {
        path: 'history',
        component: HistoryPage,
      },
      {
        path: 'progress',
        component: ProgressPage,
      },
      {
        path: 'coach',
        component: CoachPage,
      },
      {
        path: 'settings',
        component: SettingsPage,
      },
    ],
  },
  {
    path: 'workout/:workoutId',
    component: ActiveWorkoutPage,
  },
  {
    path: 'summary/:sessionId',
    component: WorkoutSummaryPage,
  },
  {
    path: '**',
    redirectTo: 'app/schedule',
  },
];
