/**
 * 選單項目元件
 *
 * 顯示單一導航選單項目
 * 使用 Angular v20 input signals
 */
import { Component, input } from '@angular/core';
import { MenuItem } from '../../models/menu-item.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-menu-item',
  imports: [MatIcon, MatListModule, RouterLinkActive, RouterLink],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
})
export class MenuItemComponent {
  /**
   * 選單項目資料（必要）
   * 使用 input.required() 確保父元件必須傳入資料
   */
  item = input.required<MenuItem>();

  /**
   * 側邊欄收合狀態
   */
  collapseDrawer = input(false);
}
