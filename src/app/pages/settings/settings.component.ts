/**
 * Settings 設定頁面元件
 *
 * 提供 RAG 系統參數配置和數據管理功能
 * 展示 Angular Material 表單元件的使用
 */
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    FormsModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  // Angular v20 性能優化：使用 OnPush 變更檢測策略
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  /** 知識庫服務 */
  private knowledgeBase = inject(KnowledgeBaseService);

  /** 設定項目 */
  settings = {
    autoSave: true,
    darkMode: false,
    enableNotifications: true,
    compactView: false,
  };

  /**
   * 重置所有資料
   */
  resetAllData(): void {
    if (
      confirm(
        '確定要重置所有資料嗎？這將清除所有文檔和查詢記錄，並重新生成模擬資料。'
      )
    ) {
      this.knowledgeBase.resetData();
      alert('資料已重置！');
    }
  }

  /**
   * 匯出資料
   */
  exportData(): void {
    const data = {
      documents: this.knowledgeBase.documents(),
      queryRecords: this.knowledgeBase.queryRecords(),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rag-knowledge-base-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * 清除快取
   */
  clearCache(): void {
    if (confirm('確定要清除本地快取嗎？')) {
      localStorage.clear();
      alert('快取已清除！請重新載入頁面。');
    }
  }
}
