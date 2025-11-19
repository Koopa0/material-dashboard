/**
 * Notebooks 列表管理頁面
 *
 * 提供 Notebook 的管理功能：創建、編輯、刪除、搜尋、篩選
 * 使用卡片網格展示所有 Notebooks
 *
 * Angular v20 最佳實踐：
 * - Standalone Component
 * - Signal-based reactivity
 * - OnPush 變更檢測策略
 */
import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { NotebookService } from '../../services/notebook.service';
import { NotebookDialogComponent } from '../../components/notebook-dialog/notebook-dialog.component';
import { Notebook, NotebookColorMap } from '../../models/notebook.model';

@Component({
  selector: 'app-notebooks',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    FormsModule,
  ],
  templateUrl: './notebooks.html',
  styleUrl: './notebooks.scss',
  // Angular v20 性能優化：使用 OnPush 變更檢測策略
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotebooksComponent {
  /** Notebook 服務 */
  notebookService = inject(NotebookService);

  /** 對話框服務 */
  private dialog = inject(MatDialog);

  /** 路由器 */
  private router = inject(Router);

  /** 顏色映射 */
  notebookColorMap = NotebookColorMap;

  /** 搜尋關鍵字（Signal） */
  searchQuery = this.notebookService.searchQuery;

  /** 所有 Notebooks */
  notebooks = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      return this.notebookService.notebooks();
    }
    return this.notebookService.notebooks().filter((nb) =>
      nb.name.toLowerCase().includes(query) ||
      nb.description.toLowerCase().includes(query)
    );
  });

  /**
   * 取得 Notebook 顏色
   */
  getNotebookColor(notebook: Notebook): string {
    return this.notebookColorMap[notebook.color];
  }

  /**
   * 新增 Notebook
   */
  createNotebook(): void {
    this.dialog.open(NotebookDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { mode: 'create' },
    });
  }

  /**
   * 編輯 Notebook
   */
  editNotebook(notebook: Notebook, event: Event): void {
    event.stopPropagation();
    this.dialog.open(NotebookDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { mode: 'edit', notebook },
    });
  }

  /**
   * 刪除 Notebook
   */
  deleteNotebook(notebook: Notebook, event: Event): void {
    event.stopPropagation();
    if (notebook.isDefault) {
      alert('預設 Notebook 無法刪除');
      return;
    }
    if (confirm(`確定要刪除「${notebook.name}」嗎？`)) {
      this.notebookService.deleteNotebook(notebook.id);
    }
  }

  /**
   * 查看 Notebook 詳情
   */
  viewNotebook(notebook: Notebook): void {
    this.notebookService.selectNotebook(notebook.id);
    this.router.navigate(['/notebooks', notebook.id]);
  }

  /**
   * 搜尋變更
   */
  onSearchChange(query: string): void {
    this.notebookService.searchQuery.set(query);
  }

  /**
   * 取得 Notebook 中的文檔數量
   */
  getDocumentCount(notebook: Notebook): number {
    return notebook.documentIds.length;
  }

  /**
   * 格式化日期
   */
  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days} 天前`;
    if (days < 30) return `${Math.floor(days / 7)} 週前`;
    if (days < 365) return `${Math.floor(days / 30)} 個月前`;
    return `${Math.floor(days / 365)} 年前`;
  }
}
