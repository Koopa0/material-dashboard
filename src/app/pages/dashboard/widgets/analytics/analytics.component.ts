import { Component, ElementRef, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-analytics',
  imports: [MatButton],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
  // Angular v20 性能優化：使用 OnPush 變更檢測策略
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent {
  chart = viewChild.required<ElementRef<HTMLCanvasElement>>('chart');

  ngOnInit() {
    new Chart(this.chart().nativeElement, {
      type: 'line',
      data: {
        labels: ['Aug','Sep','Oct','Nov','Dec','Jan'],
        datasets: [
          {
            label: 'Views',
            data: [100,102,105,110,115,120],
            borderColor: 'rgb(255,99,132)',
            backgroundColor: 'rgb(255,99,132,0.5)',
            fill: 'start',
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        elements: {
          line: {
            tension: 0.4,
          },
        },
      },
    });
  }
}
