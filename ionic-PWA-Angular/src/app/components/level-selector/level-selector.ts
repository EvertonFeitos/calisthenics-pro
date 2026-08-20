import { Component, input, output } from '@angular/core';
import { LevelId, LevelInfo } from '../../types';

@Component({
  selector: 'app-level-selector',
  imports: [],
  templateUrl: './level-selector.html',
  styleUrl: './level-selector.scss',
})
export class LevelSelector {
  readonly levels = input.required<LevelInfo[]>();
  readonly currentLevelId = input.required<LevelId>();
  readonly selectLevel = output<LevelId>();
}
