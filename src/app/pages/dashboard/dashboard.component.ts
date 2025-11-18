/**
 * Dashboard 總覽頁面元件
 *
 * 顯示知識庫的統計資訊和快速概覽
 * 展示 Angular v20 Signals 與 computed 的響應式數據流
 */
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';
import { Document } from '../../models/document.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  /** 知識庫服務 */
  knowledgeBase = inject(KnowledgeBaseService);

  /** 統計資料 */
  stats = computed(() => this.knowledgeBase.stats());

  /** 分類統計 */
  categoryStats = computed(() => this.knowledgeBase.categoryStats());

  /** 查詢統計 */
  queryStats = computed(() => this.knowledgeBase.queryStats());

  /** 釘選的文檔 */
  pinnedDocuments = computed(() => this.knowledgeBase.pinnedDocuments());

  /** 最近查看的文檔 */
  recentDocuments = computed(() => this.knowledgeBase.recentDocuments());

  /**
   * 查看文檔
   */
  viewDocument(doc: Document): void {
    this.knowledgeBase.recordView(doc.id);
    this.knowledgeBase.selectedDocument.set(doc);
    console.log('Viewing document:', doc);
    // TODO: 開啟文檔詳情面板
  }
}
