import { Component, inject, input, model, ChangeDetectionStrategy } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Widget } from '../../../models/dashboard';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-options',
  imports: [MatButtonModule, MatIcon, MatButtonToggleModule],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss',
  // Angular v20 性能優化：使用 OnPush 變更檢測策略
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsComponent {
  dashboardService = inject(DashboardService);

  data = input.required<Widget>();

  showOptions = model<boolean>(false);
}
