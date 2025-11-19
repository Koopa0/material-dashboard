import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-views',
  imports: [MatIcon],
  templateUrl: './views.component.html',
  styleUrl: './views.component.scss',
  // Angular v20 性能優化：使用 OnPush 變更檢測策略
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewsComponent {}
