import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavTab } from '../../types';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.scss',
})
export class BottomNav {
  readonly currentTab = input.required<NavTab>();

  protected readonly navItems: Array<{ id: NavTab; label: string; icon: string }> = [
    { id: 'schedule', label: 'Grade', icon: 'calendar' },
    { id: 'history', label: 'Histórico', icon: 'history' },
    { id: 'progress', label: 'Progresso', icon: 'trendingUp' },
    { id: 'settings', label: 'Ajustes', icon: 'settings' },
  ];
}
