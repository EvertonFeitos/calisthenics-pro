import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { AiCoach } from '../../services/ai-coach';
import { AppStore } from '../../store/app-store';
import { AIAnalysisResult } from '../../types';

@Component({
  selector: 'app-coach-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coach-page.html',
  styleUrl: './coach-page.scss',
})
export class CoachPage {
  protected readonly store = inject(AppStore);
  private readonly fb = inject(UntypedFormBuilder);
  private readonly aiCoach = inject(AiCoach);

  protected readonly isEditingGoals = signal(false);
  protected readonly isAnalyzing = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly activeAnalysis = signal<AIAnalysisResult | null>(null);

  protected readonly goalsForm = this.fb.group({
    primaryGoal: [this.store.userGoals().primaryGoal, Validators.required],
    weeklyTargetDays: [this.store.userGoals().weeklyTargetDays, Validators.required],
    experienceMonths: [this.store.userGoals().experienceMonths, Validators.required],
    focusNotes: [this.store.userGoals().focusNotes],
  });

  protected readonly analyses = computed(() => this.store.aiAnalyses());
  protected readonly analysisLoadingMessages = [
    'Avaliando volume semanal...',
    'Calculando taxa de recuperação...',
    'Conferindo consistência entre sessões...',
  ];

  constructor() {
    effect(() => {
      const analyses = this.store.aiAnalyses();
      if (!this.activeAnalysis() && analyses.length > 0) {
        this.activeAnalysis.set(analyses[0]);
      }
    });
  }

  protected toggleGoalsEdit(): void {
    if (this.isEditingGoals()) {
      this.cancelGoalsEdit();
      return;
    }
    this.isEditingGoals.set(true);
    this.goalsForm.reset({
      primaryGoal: this.store.userGoals().primaryGoal,
      weeklyTargetDays: this.store.userGoals().weeklyTargetDays,
      experienceMonths: this.store.userGoals().experienceMonths,
      focusNotes: this.store.userGoals().focusNotes,
    });
  }

  protected cancelGoalsEdit(): void {
    this.isEditingGoals.set(false);
    this.goalsForm.reset({
      primaryGoal: this.store.userGoals().primaryGoal,
      weeklyTargetDays: this.store.userGoals().weeklyTargetDays,
      experienceMonths: this.store.userGoals().experienceMonths,
      focusNotes: this.store.userGoals().focusNotes,
    });
  }

  protected async saveGoals(): Promise<void> {
    if (this.goalsForm.invalid) {
      this.goalsForm.markAllAsTouched();
      return;
    }

    await this.store.saveGoals({
      primaryGoal: String(this.goalsForm.value.primaryGoal || ''),
      weeklyTargetDays: Number(this.goalsForm.value.weeklyTargetDays || 4),
      experienceMonths: Number(this.goalsForm.value.experienceMonths || 0),
      focusNotes: String(this.goalsForm.value.focusNotes || ''),
    });
    this.isEditingGoals.set(false);
  }

  protected async requestAnalysis(): Promise<void> {
    this.isAnalyzing.set(true);
    this.errorMessage.set(null);
    try {
      const analysis = await this.aiCoach.requestAnalysis({
        history: this.store.sessions(),
        currentLevel: this.store.currentLevelId(),
        goals: this.store.userGoals(),
        schedule: this.store.schedule(),
        currentWorkouts: this.store.availableWorkoutsForCurrentLevel(),
        userNotes: this.store.userGoals().focusNotes,
      });
      await this.store.saveAIAnalysis(analysis);
      this.activeAnalysis.set(analysis);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Falha ao processar análise.');
      this.activeAnalysis.set(this.store.aiAnalyses()[0] ?? null);
    } finally {
      this.isAnalyzing.set(false);
    }
  }

  protected selectAnalysis(analysis: AIAnalysisResult): void {
    this.activeAnalysis.set(analysis);
  }

  protected formatAnalysisDate(isoString: string): string {
    try {
      return new Date(isoString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  }
}
