/**
 * Command Palette 快速命令面板
 *
 * Ctrl+K / Cmd+K 開啟快速命令面板
 * 支援模糊搜尋文檔、快速操作、鍵盤導航
 */
import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';
import { NotebookService } from '../../services/notebook.service';
import { Document } from '../../models/document.model';

interface CommandItem {
  type: 'document' | 'action' | 'notebook';
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  action: () => void;
}

@Component({
  selector: 'app-command-palette',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.scss',
})
export class CommandPaletteComponent {
  private dialogRef = inject(MatDialogRef<CommandPaletteComponent>);
  private router = inject(Router);
  private knowledgeBase = inject(KnowledgeBaseService);
  private notebookService = inject(NotebookService);

  /** 搜尋輸入 */
  searchQuery = signal('');

  /** 選中的項目索引 */
  selectedIndex = signal(0);

  /** 所有可用的命令項目 */
  private allItems = computed(() => {
    const items: CommandItem[] = [];

    // 快速操作
    items.push(
      {
        type: 'action',
        id: 'new-document',
        title: '新增文檔',
        icon: 'add',
        action: () => {
          this.close();
          this.router.navigate(['/documents']);
        },
      },
      {
        type: 'action',
        id: 'new-notebook',
        title: '建立 Notebook',
        icon: 'create_new_folder',
        action: () => {
          this.close();
          // TODO: 開啟建立 Notebook 對話框
        },
      },
      {
        type: 'action',
        id: 'toggle-theme',
        title: '切換深淺模式',
        icon: 'brightness_6',
        action: () => {
          // TODO: 切換主題
          this.close();
        },
      }
    );

    // Notebooks
    this.notebookService.notebooks().forEach((notebook) => {
      items.push({
        type: 'notebook',
        id: notebook.id,
        title: notebook.name,
        subtitle: `${notebook.documentIds.length} 個文檔`,
        icon: notebook.icon || 'folder',
        action: () => {
          this.notebookService.selectNotebook(notebook.id);
          this.close();
          this.router.navigate(['/documents']);
        },
      });
    });

    // 文檔
    this.knowledgeBase.documents().forEach((doc) => {
      items.push({
        type: 'document',
        id: doc.id,
        title: doc.title,
        subtitle: doc.category,
        icon: 'description',
        action: () => {
          this.close();
          // TODO: 開啟文檔詳情
        },
      });
    });

    return items;
  });

  /** 過濾後的項目 */
  filteredItems = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.allItems().slice(0, 10);

    return this.allItems()
      .filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.subtitle?.toLowerCase().includes(query)
      )
      .slice(0, 10);
  });

  /**
   * 鍵盤事件處理
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    const items = this.filteredItems();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex.update((i) => Math.min(i + 1, items.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex.update((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        const selected = items[this.selectedIndex()];
        if (selected) selected.action();
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
    }
  }

  /**
   * 選擇項目
   */
  selectItem(index: number): void {
    const items = this.filteredItems();
    if (items[index]) {
      items[index].action();
    }
  }

  /**
   * 關閉面板
   */
  close(): void {
    this.dialogRef.close();
  }
}
