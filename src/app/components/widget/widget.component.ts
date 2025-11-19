import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { Widget } from '../../models/dashboard';
import { NgComponentOutlet } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OptionsComponent } from './options/options.component';

@Component({
  selector: 'app-widget',
  imports: [MatIcon, MatButtonModule, NgComponentOutlet, OptionsComponent],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.scss',
  host: {
    '[style.grid-area]':
      '"span " + (data().rows ?? 1) + "/ span " + (data().columns ?? 1)',
    class: 'block rounded-2xl',
  },
  // Angular v20 性能優化：使用 OnPush 變更檢測策略
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetComponent {
  data = input.required<Widget>();

  showOptions = signal<boolean>(false);
}
