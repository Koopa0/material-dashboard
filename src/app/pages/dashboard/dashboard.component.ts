/**
 * Dashboard 總覽頁面元件
 *
 * 顯示知識庫的統計資訊和快速概覽
 * 展示 Angular v20 Signals 與 computed 的響應式數據流
 */
import { Component, inject, computed, OnInit, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  // Angular v20 性能優化：使用 OnPush 變更檢測策略
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  /** 知識庫服務 */
  knowledgeBase = inject(KnowledgeBaseService);

  /** 路由器 */
  private router = inject(Router);

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

  ngOnInit(): void {
    // Dashboard 初始化完成
  }

  /**
   * 查看文檔
   */
  viewDocument(doc: Document): void {
    this.knowledgeBase.recordView(doc.id);
    this.knowledgeBase.selectedDocument.set(doc);
    this.router.navigate(['/documents', doc.id]);
  }
}
