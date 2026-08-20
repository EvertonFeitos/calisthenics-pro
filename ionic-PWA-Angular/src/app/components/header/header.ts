import { Component, input, output } from '@angular/core';
import { LevelId, LevelInfo } from '../../types';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly currentLevelInfo = input.required<LevelInfo>();
  readonly levels = input.required<LevelInfo[]>();
  readonly soundEnabled = input.required<boolean>();
  readonly completedWorkoutsCount = input(0);
  readonly selectLevel = output<LevelId>();
  readonly toggleSound = output<void>();

  protected onSelectLevel(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as LevelId;
    this.selectLevel.emit(value);
  }
}
