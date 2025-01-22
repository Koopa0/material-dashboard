import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { WidgetComponent } from '../../components/widget/widget.component';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatMenu,
  MatMenuItem,
  MatMenuModule,
  MatMenuTrigger,
} from '@angular/material/menu';
import { wrapGrid } from 'animate-css-grid';

@Component({
  selector: 'app-dashboard',
  providers: [DashboardService, MatButtonModule, MatMenuModule],
  imports: [
    WidgetComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  widgetProvider = inject(DashboardService);

  dashboard = viewChild.required<ElementRef<HTMLDivElement>>('dashboard');

  ngOnInit() {
    wrapGrid(this.dashboard().nativeElement, { duration: 300 });
  }
}
