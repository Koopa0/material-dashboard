import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-watch-time',
  imports: [MatIcon],
  templateUrl: './watch-time.component.html',
  styleUrl: './watch-time.component.scss',
  // Angular v20 性能優化：使用 OnPush 變更檢測策略
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchTimeComponent {}
