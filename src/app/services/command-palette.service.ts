import { Injectable, signal } from '@angular/core';

/**
 * 命令面板服務
 * 管理命令面板的開關狀態和全局快捷鍵
 */
@Injectable({
  providedIn: 'root',
})
export class CommandPaletteService {
  /** 命令面板是否開啟 */
  isOpen = signal<boolean>(false);

  constructor() {
    this.setupGlobalShortcuts();
  }

  /** 設置全局快捷鍵 */
  private setupGlobalShortcuts(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      // Cmd/Ctrl + K 開啟命令面板
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        this.toggle();
      }
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
