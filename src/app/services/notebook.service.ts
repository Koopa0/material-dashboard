/**
 * Notebook 服務
 *
 * 管理 Notebooks 的 CRUD 操作
 * 使用 Signals 進行響應式狀態管理
 */

import { Injectable, signal, computed } from '@angular/core';
import { Notebook, CreateNotebookParams, UpdateNotebookParams } from '../models/notebook.model';

@Injectable({
  providedIn: 'root',
})
export class NotebookService {
  /**
   * 所有筆記本列表 Signal
   */
  private notebooksSignal = signal<Notebook[]>(this.getInitialNotebooks());

  /**
   * 當前選中的筆記本 ID
   */
  private selectedNotebookIdSignal = signal<string | null>(null);

  /**
   * 唯讀筆記本列表
   */
  readonly notebooks = this.notebooksSignal.asReadonly();

  /**
   * 當前選中的筆記本
   */
  readonly selectedNotebook = computed(() => {
    const id = this.selectedNotebookIdSignal();
    if (!id) return null;
    return this.notebooksSignal().find((nb) => nb.id === id) || null;
  });

  /**
   * 當前選中的筆記本 ID
   */
  readonly selectedNotebookId = this.selectedNotebookIdSignal.asReadonly();

  constructor() {
    // 初始化時選擇第一個筆記本
    const notebooks = this.notebooksSignal();
    if (notebooks.length > 0) {
      this.selectedNotebookIdSignal.set(notebooks[0].id);
    }
  }

  /**
   * 初始化預設筆記本
   */
  private getInitialNotebooks(): Notebook[] {
    // 嘗試從 localStorage 讀取
    const stored = localStorage.getItem('notebooks');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((nb: any) => ({
          ...nb,
          createdAt: new Date(nb.createdAt),
          updatedAt: new Date(nb.updatedAt),
        }));
      } catch (error) {
        console.error('Failed to parse notebooks from localStorage:', error);
      }
    }

    // 建立預設筆記本
    const now = new Date();
    return [
      {
        id: this.generateId(),
        name: '工作專案',
        description: '工作相關的技術文檔和筆記',
        color: '#3b82f6',
        icon: 'work',
        documentIds: [],
        isDefault: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: this.generateId(),
        name: '學習筆記',
        description: '個人學習和研究的技術資料',
        color: '#8b5cf6',
        icon: 'school',
        documentIds: [],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: this.generateId(),
        name: '技術研究',
        description: '深入研究的技術主題和實驗',
        color: '#ec4899',
        icon: 'science',
        documentIds: [],
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  /**
   * 儲存筆記本到 localStorage
   */
  private saveToStorage(): void {
    try {
      const notebooks = this.notebooksSignal();
      localStorage.setItem('notebooks', JSON.stringify(notebooks));
    } catch (error) {
      console.error('Failed to save notebooks to localStorage:', error);
    }
  }

  /**
   * 建立新筆記本
   */
  createNotebook(params: CreateNotebookParams): Notebook {
    const now = new Date();
    const newNotebook: Notebook = {
      id: this.generateId(),
      name: params.name,
      description: params.description,
      color: params.color || '#3b82f6',
      icon: params.icon || 'folder',
      documentIds: [],
      createdAt: now,
      updatedAt: now,
    };

    this.notebooksSignal.update((notebooks) => [...notebooks, newNotebook]);
    this.saveToStorage();

    return newNotebook;
  }

  /**
   * 更新筆記本
   */
  updateNotebook(id: string, params: UpdateNotebookParams): Notebook | null {
    let updatedNotebook: Notebook | null = null;

    this.notebooksSignal.update((notebooks) =>
      notebooks.map((nb) => {
        if (nb.id === id) {
          updatedNotebook = {
            ...nb,
            ...params,
            updatedAt: new Date(),
          };
          return updatedNotebook;
        }
        return nb;
      })
    );

    if (updatedNotebook) {
      this.saveToStorage();
    }

    return updatedNotebook;
  }

  /**
   * 刪除筆記本
   */
  deleteNotebook(id: string): boolean {
    const notebook = this.notebooksSignal().find((nb) => nb.id === id);
    if (!notebook) return false;

    // 不允許刪除預設筆記本
    if (notebook.isDefault) {
      console.warn('Cannot delete default notebook');
      return false;
    }

    this.notebooksSignal.update((notebooks) => notebooks.filter((nb) => nb.id !== id));

    // 如果刪除的是當前選中的筆記本，選擇第一個
    if (this.selectedNotebookIdSignal() === id) {
      const remaining = this.notebooksSignal();
      this.selectedNotebookIdSignal.set(remaining.length > 0 ? remaining[0].id : null);
    }

    this.saveToStorage();
    return true;
  }

  /**
   * 選擇筆記本
   */
  selectNotebook(id: string | null): void {
    this.selectedNotebookIdSignal.set(id);
  }

  /**
   * 將文檔加入筆記本
   */
  addDocumentToNotebook(notebookId: string, documentId: string): boolean {
    let success = false;

    this.notebooksSignal.update((notebooks) =>
      notebooks.map((nb) => {
        if (nb.id === notebookId && !nb.documentIds.includes(documentId)) {
          success = true;
          return {
            ...nb,
            documentIds: [...nb.documentIds, documentId],
            updatedAt: new Date(),
          };
        }
        return nb;
      })
    );

    if (success) {
      this.saveToStorage();
    }

    return success;
  }

  /**
   * 從筆記本移除文檔
   */
  removeDocumentFromNotebook(notebookId: string, documentId: string): boolean {
    let success = false;

    this.notebooksSignal.update((notebooks) =>
      notebooks.map((nb) => {
        if (nb.id === notebookId && nb.documentIds.includes(documentId)) {
          success = true;
          return {
            ...nb,
            documentIds: nb.documentIds.filter((id) => id !== documentId),
            updatedAt: new Date(),
          };
        }
        return nb;
      })
    );

    if (success) {
      this.saveToStorage();
    }

    return success;
  }

  /**
   * 取得筆記本的文檔數量
   */
  getDocumentCount(notebookId: string): number {
    const notebook = this.notebooksSignal().find((nb) => nb.id === notebookId);
    return notebook ? notebook.documentIds.length : 0;
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `nb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
