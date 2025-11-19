import { Injectable, signal, DestroyRef, inject } from '@angular/core';

/**
 * 命令面板服務（Angular v20 最佳實踐）
 * 管理命令面板的開關狀態和全局快捷鍵
 *
 * 使用 DestroyRef 自動清理事件監聽器，防止記憶體洩漏
 */
@Injectable({
  providedIn: 'root',
})
export class CommandPaletteService {
  private destroyRef = inject(DestroyRef);

  /** 命令面板是否開啟 */
  isOpen = signal<boolean>(false);

  /** 保存事件處理器引用以便清理 */
  private handleKeyDown = (event: KeyboardEvent) => {
    // Cmd/Ctrl + K 開啟命令面板
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.toggle();
    }
  };

  constructor() {
    this.setupGlobalShortcuts();
  }

  /**
   * 設置全局快捷鍵（自動清理）
   * Angular v20 最佳實踐：使用 DestroyRef 註冊清理函數
   */
  private setupGlobalShortcuts(): void {
    if (typeof window === 'undefined') return;

    // 添加事件監聽器
    window.addEventListener('keydown', this.handleKeyDown);

    // 註冊清理函數（當服務銷毀時自動調用）
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('keydown', this.handleKeyDown);
    });
  }

  /** 開啟命令面板 */
  open(): void {
    this.isOpen.set(true);
  }

  /** 關閉命令面板 */
  close(): void {
    this.isOpen.set(false);
  }

  /** 切換命令面板 */
  toggle(): void {
    this.isOpen.update((open) => !open);
  }
}
