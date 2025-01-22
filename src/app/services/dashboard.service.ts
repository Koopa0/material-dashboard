import { computed, effect, Injectable, signal } from '@angular/core';
import { Widget } from '../models/dashboard';
import { SubscribersComponent } from '../pages/dashboard/widgets/subscribers/subscribers.component';
import { ViewsComponent } from '../pages/dashboard/widgets/views/views.component';
import { WatchTimeComponent } from '../pages/dashboard/widgets/watch-time/watch-time.component';
import { RevenueComponent } from '../pages/dashboard/widgets/revenue/revenue.component';
import { AnalyticsComponent } from '../pages/dashboard/widgets/analytics/analytics.component';

@Injectable()
export class DashboardService {
  widgets = signal<Widget[]>([
    {
      id: 1,
      name: 'Subscribers',
      content: SubscribersComponent,
      backgroundColor: '#003d5c',
      color: 'whitesmoke',
    },
    {
      id: 2,
      name: 'Views',
      content: ViewsComponent,
      backgroundColor: '#003d5c',
      color: 'whitesmoke',
    },
    {
      id: 3,
      name: 'Watch Time',
      content: WatchTimeComponent,
      backgroundColor: '#003d5c',
      color: 'whitesmoke',
    },
    {
      id: 4,
      name: 'Revenue',
      content: RevenueComponent,
      backgroundColor: '#003d5c',
      color: 'whitesmoke',
    },
    {
      id: 5,
      name: 'Analytics',
      rows: 2,
      columns: 2,
      content: AnalyticsComponent,
    },
  ]);

  addedWidgets = signal<Widget[]>([]);

  widgetsToAdd = computed(() => {
    const addedIds = this.addedWidgets().map((widget) => widget.id);
    return this.widgets().filter((widget) => !addedIds.includes(widget.id));
  });

  fetchWidgets() {
    const widgetsAsLocalStorage = localStorage.getItem('widgets');
    if (widgetsAsLocalStorage) {
      const widgets = JSON.parse(widgetsAsLocalStorage) as Widget[];
      widgets.forEach((widget) => {
        const content = this.widgets().find((w) => w.id === widget.id)?.content;
        if (content) {
          widget.content = content;
        }
      });

      this.addedWidgets.set(widgets);
    }
  }

  addWidget(widget: Widget) {
    this.addedWidgets.set([...this.addedWidgets(), { ...widget }]);
  }

  updateWidget(id: number, widget: Partial<Widget>) {
    const index = this.addedWidgets().findIndex((widget) => widget.id === id);
    if (index !== -1) {
      const newWidgets = [...this.addedWidgets()];
      newWidgets[index] = { ...newWidgets[index], ...widget };
      this.addedWidgets.set(newWidgets);
    }
  }

  moveWidgetToRight(id: number) {
    const index = this.addedWidgets().findIndex((widget) => widget.id === id);
    if (index === this.addedWidgets().length - 1) return;
    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index + 1]] = [
      { ...newWidgets[index + 1] },
      { ...newWidgets[index] },
    ];
    this.addedWidgets.set(newWidgets);
  }

  moveWidgetToLeft(id: number) {
    const index = this.addedWidgets().findIndex((widget) => widget.id === id);
    if (index === 0) return;
    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index - 1]] = [
      { ...newWidgets[index - 1] },
      { ...newWidgets[index] },
    ];
    this.addedWidgets.set(newWidgets);
  }

  removeWidget(id: number) {
    this.addedWidgets.set(
      this.addedWidgets().filter((widget) => widget.id !== id),
    );
  }

  constructor() {
    this.fetchWidgets();
  }

  saveWidgets = effect(() => {
    const widgetsWithoutContent: Partial<Widget>[] = this.addedWidgets().map(
      (widget) => ({ ...widget }),
    );
    widgetsWithoutContent.forEach((widget) => delete widget.content);
    localStorage.setItem('widgets', JSON.stringify(widgetsWithoutContent));
  });
}
