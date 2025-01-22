import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-sidenav-header',
  imports: [],
  templateUrl: './sidenav-header.component.html',
  styleUrl: './sidenav-header.component.scss',
})
export class SidenavHeaderComponent {
  collapseDrawer = input(false);

  profilePicSize = computed(() => (this.collapseDrawer() ? '32' : '100'));
}
