/**
 * Dashboard 總覽頁面元件
 *
 * 顯示知識庫的統計資訊和快速概覽
 * 展示 Angular v20 Signals 與 computed 的響應式數據流
 */
import { Component, inject, computed, OnInit, effect } from '@angular/core';
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
  pinnedDocuments = computed(() => {
    const pinned = this.knowledgeBase.pinnedDocuments();
    console.log('📌 Dashboard pinnedDocuments:', pinned.length, pinned);
    return pinned;
  });

  /** 最近查看的文檔 */
  recentDocuments = computed(() => {
    const recent = this.knowledgeBase.recentDocuments();
    console.log('🕒 Dashboard recentDocuments:', recent.length, recent);
    return recent;
  });

  constructor() {
    // 監聽資料變化
    effect(() => {
      const allDocs = this.knowledgeBase.documents();
      console.log('📚 Dashboard - 總文檔數:', allDocs.length);
      console.log('📌 Dashboard - 釘選文檔數:', this.pinnedDocuments().length);
      console.log('🕒 Dashboard - 最近查看數:', this.recentDocuments().length);
    });
  }

  ngOnInit(): void {
    console.log('🎯 Dashboard 初始化');
    console.log('📚 總文檔數:', this.knowledgeBase.documents().length);
    console.log('📌 釘選文檔:', this.pinnedDocuments());
    console.log('🕒 最近查看:', this.recentDocuments());
  }

  /**
   * 查看文檔
   */
  viewDocument(doc: Document): void {
    console.log('👁️ 點擊查看文檔:', doc.title);
    this.knowledgeBase.recordView(doc.id);
    this.knowledgeBase.selectedDocument.set(doc);
    this.router.navigate(['/documents', doc.id]);
  }
}
