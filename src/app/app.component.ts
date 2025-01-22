import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [
    MatIcon,
    MatSidenavModule,
    RouterOutlet,
    MatButtonModule,
    SidenavComponent,
    MatToolbar,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'material-dashboard';

  collapseDrawer = signal<boolean>(false);

  sidenavWidth = computed(() => (this.collapseDrawer() ? '64px' : '256px'));
}
