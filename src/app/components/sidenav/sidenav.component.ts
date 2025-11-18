/**
 * 側邊欄導航元件
 *
 * 提供應用程式的主要導航介面
 * 使用 Angular v20 Signals 管理選單項目狀態
 */
import { Component, input, signal } from '@angular/core';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MenuItem } from '../../models/menu-item.model';
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
  /**
   * 側邊欄收合狀態（由父元件傳入）
   * 使用 input() signal 接收資料
   */
  collapseDrawer = input<boolean>(false);

  /**
   * 選單項目列表
   * RAG 知識庫管理系統的主要導航項目
   */
  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard',
    },
    {
      icon: 'description',
      label: 'Documents',
      route: 'documents',
    },
    {
      icon: 'search',
      label: 'Search',
      route: 'search',
    },
    {
      icon: 'analytics',
      label: 'Analytics',
      route: 'analytics',
    },
    {
      icon: 'settings',
      label: 'Settings',
      route: 'settings',
    },
  ]);
}
