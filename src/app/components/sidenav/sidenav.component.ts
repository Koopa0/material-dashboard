import { Component, input, signal } from '@angular/core';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MenuItem } from '../../models/menu-item';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { MatIconModule } from '@angular/material/icon';
import { SidenavHeaderComponent } from './sidenav-header/sidenav-header.component';

@Component({
  selector: 'app-sidenav',
  imports: [
    MatNavList,
    MatListModule,
    MatIconModule,
    MenuItemComponent,
    SidenavHeaderComponent,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  collapseDrawer = input<boolean>(false);

  menuItems = signal<MenuItem[]>([
    {
      name: 'Dashboard',
      icon: 'dashboard',
      route: 'dashboard',
    },
    {
      name: 'Content',
      icon: 'video_library',
      route: 'content',
    },
    {
      name: 'Analytics',
      icon: 'analytics',
      route: 'analytics',
    },
    {
      name: 'Comments',
      icon: 'comments',
      route: 'comments',
    },
  ]);
}
