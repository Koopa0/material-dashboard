/**
 * 側邊欄導航元件
 *
 * 提供應用程式的主要導航介面
 * 使用 Angular v20 Signals 管理選單項目狀態
 */
import { Component, input, signal, inject, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MenuItem } from '../../models/menu-item.model';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { MatIconModule } from '@angular/material/icon';
import { SidenavHeaderComponent } from './sidenav-header/sidenav-header.component';
import { NotebookService } from '../../services/notebook.service';
import { NotebookDialogComponent } from '../notebook-dialog/notebook-dialog.component';
import { Notebook, NotebookColorMap } from '../../models/notebook.model';

@Component({
  selector: 'app-sidenav',
  imports: [
    MatNavList,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    MenuItemComponent,
    SidenavHeaderComponent,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  notebookService = inject(NotebookService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  /** 顏色映射 */
  notebookColorMap = NotebookColorMap;

  /**
   * 側邊欄收合狀態（由父元件傳入）
   * 使用 input() signal 接收資料
   */
  collapseDrawer = input<boolean>(false);

  /**
   * 選單項目列表
   * RAG 知識庫管理系統的主要導航項目
   * 使用 computed 動態生成 Notebooks 子項目
   */
  menuItems = computed<MenuItem[]>(() => {
    const notebookSubItems = this.notebookService.notebooks().map((notebook) => ({
      icon: notebook.icon,
      label: notebook.name,
      route: `/notebooks/${notebook.id}`,
      badge: this.getNotebookColor(notebook),
    }));

    return [
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
        icon: 'auto_stories',
        label: 'Notebooks',
        subItems: notebookSubItems,
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
    ];
  });

  /** 取得 Notebook 顏色 */
  getNotebookColor(notebook: Notebook): string {
    return this.notebookColorMap[notebook.color];
  }

  /** 新增 Notebook */
  createNotebook(): void {
    this.dialog.open(NotebookDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { mode: 'create' },
    });
  }

  /** 編輯 Notebook */
  editNotebook(notebook: Notebook, event: Event): void {
    event.stopPropagation();
    this.dialog.open(NotebookDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { mode: 'edit', notebook },
    });
  }

  /** 刪除 Notebook */
  deleteNotebook(notebook: Notebook, event: Event): void {
    event.stopPropagation();
    if (confirm(`確定要刪除「${notebook.name}」嗎？`)) {
      this.notebookService.deleteNotebook(notebook.id);
    }
  }

  /** 查看 Notebook */
  viewNotebook(notebook: Notebook): void {
    this.notebookService.selectNotebook(notebook.id);
    this.router.navigate(['/notebooks', notebook.id]);
  }
}
