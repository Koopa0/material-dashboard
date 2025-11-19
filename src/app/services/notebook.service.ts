/**
 * Notebook 服務
 *
 * 管理 Notebooks 的 CRUD 操作，提供完整的筆記本管理功能
 * 使用 Angular v20 Signals 進行響應式狀態管理
 *
 * 功能：
 * - 建立、更新、刪除筆記本
 * - 管理筆記本中的文檔關聯
 * - 選擇當前活動的筆記本
 * - 持久化到 localStorage
 * - 支援預設筆記本保護（不可刪除）
 *
 * @example
 * ```typescript
 * // 建立新筆記本
 * const notebook = notebookService.createNotebook({
 *   name: '前端開發',
 *   description: 'React 和 Angular 相關文檔',
 *   color: NotebookColor.PURPLE,
 *   icon: NotebookIcon.CODE
 * });
 *
 * // 加入文檔到筆記本
 * notebookService.addDocumentToNotebook(notebook.id, 'doc-123');
 *
 * // 查詢筆記本列表（響應式）
 * effect(() => {
 *   const notebooks = notebookService.notebooks();
 *   console.log(`共有 ${notebooks.length} 個筆記本`);
 * });
 * ```
 */

import { Injectable, signal, computed } from '@angular/core';
import {
  Notebook,
  CreateNotebookParams,
  UpdateNotebookParams,
  NotebookColor,
  NotebookIcon,
} from '../models/notebook.model';

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
   * 搜尋關鍵字 Signal
   */
  searchQuery = signal<string>('');

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
   * 初始化預設筆記本（類型安全）
   * Angular v20 最佳實踐：避免使用 any
   */
  private getInitialNotebooks(): Notebook[] {
    // 嘗試從 localStorage 讀取
    const stored = localStorage.getItem('notebooks');
    if (stored) {
      try {
        // 定義序列化後的 Notebook 結構
        interface SerializedNotebook extends Omit<Notebook, 'createdAt' | 'updatedAt'> {
          createdAt: string;
          updatedAt: string;
        }

        const parsed: SerializedNotebook[] = JSON.parse(stored);
        return parsed.map((nb) => ({
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
        color: NotebookColor.BLUE,
        icon: NotebookIcon.WORK,
        documentIds: [],
        isDefault: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: this.generateId(),
        name: '學習筆記',
        description: '個人學習和研究的技術資料',
        color: NotebookColor.PURPLE,
        icon: NotebookIcon.SCHOOL,
        documentIds: [],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: this.generateId(),
        name: '技術研究',
        description: '深入研究的技術主題和實驗',
        color: NotebookColor.PINK,
        icon: NotebookIcon.SCIENCE,
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
   *
   * @param params - 建立筆記本的參數
   * @param params.name - 筆記本名稱
   * @param params.description - 筆記本描述（選填）
   * @param params.color - 筆記本顏色（選填，預設為藍色）
   * @param params.icon - 筆記本圖示（選填，預設為資料夾）
   * @returns 新建立的筆記本物件
   *
   * @example
   * ```typescript
   * const notebook = notebookService.createNotebook({
   *   name: '前端開發',
   *   description: 'React 和 Angular 相關文檔',
   *   color: NotebookColor.PURPLE,
   *   icon: NotebookIcon.CODE
   * });
   * ```
   */
  createNotebook(params: CreateNotebookParams): Notebook {
    const now = new Date();
    const newNotebook: Notebook = {
      id: this.generateId(),
      name: params.name,
      description: params.description,
      color: params.color || NotebookColor.BLUE,
      icon: params.icon || NotebookIcon.FOLDER,
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
   *
   * @param id - 筆記本 ID
   * @param params - 要更新的欄位
   * @param params.name - 新名稱（選填）
   * @param params.description - 新描述（選填）
   * @param params.color - 新顏色（選填）
   * @param params.icon - 新圖示（選填）
   * @returns 更新後的筆記本物件，如果找不到則返回 null
   *
   * @example
   * ```typescript
   * const updated = notebookService.updateNotebook('nb-123', {
   *   name: '前端進階開發',
   *   color: NotebookColor.GREEN
   * });
   * ```
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
   *
   * 注意：不允許刪除預設筆記本（isDefault = true）
   *
   * @param id - 筆記本 ID
   * @returns 是否成功刪除（如果是預設筆記本或找不到則返回 false）
   *
   * @example
   * ```typescript
   * const success = notebookService.deleteNotebook('nb-123');
   * if (!success) {
   *   console.log('無法刪除預設筆記本或筆記本不存在');
   * }
   * ```
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
   *
   * 更新當前選中的筆記本，供 UI 顯示使用
   *
   * @param id - 筆記本 ID，傳入 null 表示取消選擇
   *
   * @example
   * ```typescript
   * // 選擇筆記本
   * notebookService.selectNotebook('nb-123');
   *
   * // 取消選擇
   * notebookService.selectNotebook(null);
   * ```
   */
  selectNotebook(id: string | null): void {
    this.selectedNotebookIdSignal.set(id);
  }

  /**
   * 將文檔加入筆記本
   *
   * 如果文檔已存在於筆記本中，則不會重複加入
   *
   * @param notebookId - 筆記本 ID
   * @param documentId - 文檔 ID
   * @returns 是否成功加入（如果文檔已存在或筆記本不存在則返回 false）
   *
   * @example
   * ```typescript
   * const success = notebookService.addDocumentToNotebook('nb-123', 'doc-456');
   * if (success) {
   *   console.log('文檔已加入筆記本');
   * }
   * ```
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
   *
   * @param notebookId - 筆記本 ID
   * @param documentId - 文檔 ID
   * @returns 是否成功移除（如果文檔不存在或筆記本不存在則返回 false）
   *
   * @example
   * ```typescript
   * const success = notebookService.removeDocumentFromNotebook('nb-123', 'doc-456');
   * if (success) {
   *   console.log('文檔已從筆記本移除');
   * }
   * ```
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
   *
   * @param notebookId - 筆記本 ID
   * @returns 文檔數量，如果筆記本不存在則返回 0
   *
   * @example
   * ```typescript
   * const count = notebookService.getDocumentCount('nb-123');
   * console.log(`筆記本包含 ${count} 個文檔`);
   * ```
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
