import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';
import { Header } from '../../components/header/header';
import { AppStore } from '../../store/app-store';
import { LevelId, NavTab } from '../../types';

@Component({
  selector: 'app-app-shell',
  imports: [CommonModule, RouterOutlet, Header, BottomNav],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  protected readonly store = inject(AppStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly currentTab = signal<NavTab>('schedule');

  constructor() {
    this.syncCurrentTab(this.router.url);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => this.syncCurrentTab(event.urlAfterRedirects));
  }

  protected handleSelectLevel(levelId: LevelId): void {
    void this.store.selectLevel(levelId);
  }

  protected handleToggleSound(): void {
    void this.store.toggleSound();
  }

  private syncCurrentTab(url: string): void {
    const segments = url.split('/').filter(Boolean);
    const maybeTab = segments[1] as NavTab | undefined;

    if (maybeTab === 'exercises') {
      this.currentTab.set('history');
      return;
    }

    if (maybeTab === 'coach') {
      this.currentTab.set('progress');
      return;
    }

    if (
      maybeTab === 'schedule' ||
      maybeTab === 'history' ||
      maybeTab === 'progress' ||
      maybeTab === 'settings'
    ) {
      this.currentTab.set(maybeTab);
    }
  }
}
