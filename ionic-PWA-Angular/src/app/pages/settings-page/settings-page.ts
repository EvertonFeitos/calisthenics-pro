import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { soundService } from '../../services/soundService';
import { AppStore } from '../../store/app-store';

@Component({
  selector: 'app-settings-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage {
  protected readonly store = inject(AppStore);
  private readonly fb = inject(UntypedFormBuilder);

  protected readonly settingsForm = this.fb.group({
    defaultRestDuration: [this.store.userSettings().defaultRestDuration],
    soundEnabled: [this.store.userSettings().soundEnabled],
    autoStartRestTimer: [this.store.userSettings().autoStartRestTimer],
    vibrationEnabled: [this.store.userSettings().vibrationEnabled],
  });

  protected readonly restDurations = [
    { label: '30s', value: 30 },
    { label: '60s (1 min)', value: 60 },
    { label: '90s (1m30)', value: 90 },
    { label: '120s (2 min - Padrão)', value: 120 },
    { label: '180s (3 min)', value: 180 },
  ];

  protected readonly appInfo = [
    { label: 'Versão', value: '1.0.0 (Bento Engine)' },
    { label: 'Arquitetura', value: 'SPA, Client-First, Offline-First' },
    { label: 'Armazenamento', value: 'LocalStorage nativo isolado' },
    { label: 'Modelo IA', value: 'Stub local sem Gemini nesta versão' },
  ];

  protected async selectRestDuration(value: number): Promise<void> {
    const next = { ...this.store.userSettings(), defaultRestDuration: value };
    this.settingsForm.patchValue(next, { emitEvent: false });
    await this.store.updateSettings(next);
  }

  protected async toggleSetting(key: 'soundEnabled' | 'autoStartRestTimer' | 'vibrationEnabled'): Promise<void> {
    const next = { ...this.store.userSettings(), [key]: !this.store.userSettings()[key] };
    this.settingsForm.patchValue(next, { emitEvent: false });
    await this.store.updateSettings(next);
  }

  protected testSound(): void {
    soundService.playWorkoutComplete();
  }

  protected async resetSchedule(): Promise<void> {
    if (window.confirm(`Deseja restaurar a grade de treinos padrão do nível ${this.store.currentLevelInfo().name}?`)) {
      await this.store.resetSchedule();
      alert('Grade restaurada com sucesso!');
    }
  }

  protected async clearAllData(): Promise<void> {
    if (
      window.confirm(
        'ATENÇÃO: Deseja apagar todos os dados locais do aplicativo (histórico, progresso, ajustes)? Esta ação é irreversível.'
      )
    ) {
      await this.store.clearAllData();
      window.location.reload();
    }
  }

  protected async clearHistory(): Promise<void> {
    if (window.confirm('Deseja apagar apenas o histórico de treinos, mantendo exercícios, grade e configurações?')) {
      await this.store.clearWorkoutHistory();
    }
  }
}
