import { Component, signal, computed, inject, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';
import { ThemeService } from '../../services/theme.service';
import { CommandPaletteService } from '../../services/command-palette.service';
import { Document } from '../../models/document.model';

/** 命令類型 */
export enum CommandType {
  NAVIGATION = 'navigation',
  DOCUMENT = 'document',
  ACTION = 'action',
  RECENT = 'recent',
}

/** 命令項目 */
export interface CommandItem {
  id: string;
  type: CommandType;
  label: string;
  icon: string;
  description?: string;
  action: () => void;
  keywords?: string[];
  document?: Document;
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.scss',
  // Angular v20 性能優化：使用 OnPush 變更檢測策略
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteComponent {
  private router = inject(Router);
  private knowledgeBase = inject(KnowledgeBaseService);
  private themeService = inject(ThemeService);
  private commandPaletteService = inject(CommandPaletteService);

  /** 是否顯示命令面板 */
  isOpen = this.commandPaletteService.isOpen;

  /** 搜尋查詢 */
  searchQuery = signal<string>('');

  /** 選中的索引 */
  selectedIndex = signal<number>(0);

  /** 所有可用命令 */
  private allCommands = computed<CommandItem[]>(() => {
    const commands: CommandItem[] = [];

    // 導航命令
    commands.push(
      {
        id: 'nav-dashboard',
        type: CommandType.NAVIGATION,
        label: '前往 Dashboard',
        icon: 'dashboard',
        description: '查看知識庫總覽和統計',
        keywords: ['dashboard', '儀表板', '總覽', '首頁'],
        action: () => this.navigate('/'),
      },
      {
        id: 'nav-documents',
        type: CommandType.NAVIGATION,
        label: '前往文檔管理',
        icon: 'description',
        description: '瀏覽和管理所有文檔',
        keywords: ['documents', '文檔', '管理', 'docs'],
        action: () => this.navigate('/documents'),
      },
      {
        id: 'nav-search',
        type: CommandType.NAVIGATION,
        label: '前往搜尋頁面',
        icon: 'search',
        description: '搜尋知識庫中的文檔',
        keywords: ['search', '搜尋', '查詢', 'find'],
        action: () => this.navigate('/search'),
      },
      {
        id: 'nav-settings',
        type: CommandType.NAVIGATION,
        label: '前往設定',
        icon: 'settings',
        description: '調整應用程式設定',
        keywords: ['settings', '設定', '配置', 'config'],
        action: () => this.navigate('/settings'),
      }
    );

    // 操作命令
    commands.push(
      {
        id: 'action-toggle-theme',
        type: CommandType.ACTION,
        label: '切換深淺色主題',
        icon: 'brightness_6',
        description: '在明亮和深色主題間切換',
        keywords: ['theme', '主題', 'dark', 'light', '深色', '淺色'],
        action: () => this.themeService.toggleTheme(),
      },
      {
        id: 'action-new-document',
        type: CommandType.ACTION,
        label: '新增文檔',
        icon: 'add',
        description: '創建新的文檔',
        keywords: ['new', 'create', '新增', '創建', '文檔'],
        action: () => {
          // TODO: 實現新增文檔功能
          console.log('新增文檔');
        },
      }
    );

    // 最近查看的文檔
    const recentDocs = this.knowledgeBase.recentDocuments();
    recentDocs.forEach((doc) => {
      commands.push({
        id: `recent-${doc.id}`,
        type: CommandType.RECENT,
        label: doc.title,
        icon: 'schedule',
        description: `${doc.category} • 最後查看: ${this.formatDate(doc.lastViewedAt)}`,
        keywords: [doc.title, doc.category, ...doc.tags],
        document: doc,
        action: () => this.openDocument(doc),
      });
    });

    // 所有文檔（限制數量）
    const allDocs = this.knowledgeBase.documents().slice(0, 50);
    allDocs.forEach((doc) => {
      // 避免重複添加最近文檔
      if (!recentDocs.find((rd) => rd.id === doc.id)) {
        commands.push({
          id: `doc-${doc.id}`,
          type: CommandType.DOCUMENT,
          label: doc.title,
          icon: 'description',
          description: `${doc.category} • ${doc.viewCount} 次查看`,
          keywords: [doc.title, doc.category, ...doc.tags],
          document: doc,
          action: () => this.openDocument(doc),
        });
      }
    });

    return commands;
  });

  /** 過濾後的命令列表 */
  filteredCommands = computed<CommandItem[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();

    if (!query) {
      // 無查詢時顯示常用命令和最近文檔
      return this.allCommands().filter(
        (cmd) =>
          cmd.type === CommandType.NAVIGATION ||
          cmd.type === CommandType.ACTION ||
          cmd.type === CommandType.RECENT
      );
    }

    // 模糊搜尋
    return this.allCommands()
      .map((cmd) => ({
        command: cmd,
        score: this.calculateMatchScore(cmd, query),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((item) => item.command);
  });

  constructor() {
    // 重置選中索引當過濾結果變化時
    effect(() => {
      this.filteredCommands();
      this.selectedIndex.set(0);
    });

    // 監聽開啟狀態並自動聚焦
    effect(() => {
      if (this.isOpen()) {
        this.searchQuery.set('');
        this.selectedIndex.set(0);

        // 聚焦搜尋輸入框
        setTimeout(() => {
          const input = document.querySelector(
            '.command-palette-input'
          ) as HTMLInputElement;
          input?.focus();
        }, 100);
      }
    });
  }

  /** 計算匹配分數 */
  private calculateMatchScore(command: CommandItem, query: string): number {
    let score = 0;

    // 標籤完全匹配
    if (command.label.toLowerCase() === query) {
      score += 100;
    }

    // 標籤包含查詢
    if (command.label.toLowerCase().includes(query)) {
      score += 50;
    }

    // 標籤開頭匹配
    if (command.label.toLowerCase().startsWith(query)) {
      score += 30;
    }

    // 關鍵字匹配
    if (command.keywords) {
      for (const keyword of command.keywords) {
        if (keyword.toLowerCase().includes(query)) {
          score += 20;
        }
      }
    }

    // 描述匹配
    if (command.description?.toLowerCase().includes(query)) {
      score += 10;
    }

    return score;
  }

  /** 開啟命令面板 */
  open(): void {
    this.commandPaletteService.open();
  }

  /** 關閉命令面板 */
  close(): void {
    this.commandPaletteService.close();
  }

  /** 處理鍵盤事件 */
  onKeyDown(event: KeyboardEvent): void {
    const commands = this.filteredCommands();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex.update((i) => Math.min(i + 1, commands.length - 1));
        this.scrollToSelected();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex.update((i) => Math.max(i - 1, 0));
        this.scrollToSelected();
        break;

      case 'Enter':
        event.preventDefault();
        const selected = commands[this.selectedIndex()];
        if (selected) {
          this.executeCommand(selected);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.close();
        break;
    }
  }

  /** 滾動到選中項目 */
  private scrollToSelected(): void {
    setTimeout(() => {
      const selectedElement = document.querySelector(
        '.command-item.selected'
      ) as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }, 10);
  }

  /** 執行命令 */
  executeCommand(command: CommandItem): void {
    command.action();
    this.close();
  }

  /** 點擊背景關閉 */
  onBackdropClick(): void {
    this.close();
  }

  /** 導航到頁面 */
  private navigate(path: string): void {
    this.router.navigate([path]);
  }

  /** 開啟文檔 */
  private openDocument(doc: Document): void {
    this.knowledgeBase.recordView(doc.id);
    this.router.navigate(['/documents', doc.id]);
  }

  /** 格式化日期 */
  private formatDate(date?: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return '剛剛';
    if (diffMins < 60) return `${diffMins} 分鐘前`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} 小時前`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} 天前`;

    return d.toLocaleDateString('zh-TW');
  }

  /** 取得命令類型圖示顏色 */
  getTypeColor(type: CommandType): string {
    switch (type) {
      case CommandType.NAVIGATION:
        return 'var(--color-primary)';
      case CommandType.ACTION:
        return 'var(--color-accent)';
      case CommandType.RECENT:
        return 'var(--color-warning)';
      case CommandType.DOCUMENT:
        return 'var(--color-text-secondary)';
      default:
        return 'var(--color-text-secondary)';
    }
  }
}
