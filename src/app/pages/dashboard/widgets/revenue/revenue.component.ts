import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-revenue',
  imports: [MatIcon],
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.scss',
  // Angular v20 性能優化：使用 OnPush 變更檢測策略
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevenueComponent {}
