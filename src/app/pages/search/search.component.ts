/**
 * Search 搜尋頁面元件
 *
 * Sprint 3 優化：
 * - 預載入所有文檔（使用 KnowledgeBase 服務）
 * - 即時過濾（使用 computed signal）
 * - 搜尋結果高亮
 * - 效能優化
 */
import { Component, inject, signal, computed, effect, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';
import { Document } from '../../models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  // Angular v20 性能優化：使用 OnPush 變更檢測策略
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  /** 知識庫服務 */
  knowledgeBase = inject(KnowledgeBaseService);

  /** 路由器 */
  private router = inject(Router);

  /** DOM Sanitizer - 用於安全地處理 HTML */
  private sanitizer = inject(DomSanitizer);

  /** 搜尋查詢文字 */
  searchQuery = signal<string>('');

  /** 搜尋延遲時間（毫秒） */
  searchLatency = signal<number>(0);

  constructor() {
    // 監聽搜尋查詢變化並計算搜尋延遲
    effect(() => {
      const query = this.searchQuery();

      // 在 effect 中計算搜尋延遲（而非在 computed 中）
      if (query.trim()) {
        const startTime = performance.now();
        // 觸發 searchResults computed 重新計算
        const results = this.searchResults();
        const endTime = performance.now();
        this.searchLatency.set(Math.round(endTime - startTime));
      } else {
        this.searchLatency.set(0);
      }
    });
  }

  ngOnInit(): void {
    // Search 組件初始化完成
  }

  /**
   * 即時搜尋結果（使用 computed signal）
   * 當 searchQuery 或 documents 變更時自動重新計算
   */
  searchResults = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();

    // 空查詢返回空結果
    if (!query) {
      return [];
    }

    const allDocs = this.knowledgeBase.documents();

    // 過濾並計算相關性分數
    const results = allDocs
      .map((doc) => ({
        ...doc,
        relevanceScore: this.calculateRelevance(doc, query),
      }))
      .filter((doc) => doc.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 50); // 限制最多 50 個結果

    return results;
  });

  /** 是否顯示結果 */
  showResults = computed(() => {
    return this.searchQuery().trim().length > 0;
  });

  /**
   * 計算文檔與查詢的相關性分數
   */
  private calculateRelevance(doc: Document, query: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();

    // 標題完全匹配（權重最高）
    if (doc.title.toLowerCase() === queryLower) {
      score += 100;
    }
    // 標題包含查詢（權重高）
    else if (doc.title.toLowerCase().includes(queryLower)) {
      score += 50;
      // 標題開頭匹配加分
      if (doc.title.toLowerCase().startsWith(queryLower)) {
        score += 25;
      }
    }

    // 標籤完全匹配（權重中）
    doc.tags.forEach((tag) => {
      if (tag.toLowerCase() === queryLower) {
        score += 30;
      } else if (tag.toLowerCase().includes(queryLower)) {
        score += 15;
      }
    });

    // 分類匹配
    if (doc.category.toLowerCase().includes(queryLower)) {
      score += 20;
    }

    // 內容包含（權重低）
    if (doc.content.toLowerCase().includes(queryLower)) {
      score += 10;
      // 內容中多次出現加分
      const occurrences = (doc.content.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
      score += Math.min(occurrences * 2, 20); // 最多額外加 20 分
    }

    // 摘要包含
    if (doc.summary && doc.summary.toLowerCase().includes(queryLower)) {
      score += 5;
    }

    return score;
  }

  /**
   * 清除搜尋
   */
  onClear(): void {
    this.searchQuery.set('');
  }

  /**
   * 查看文檔詳情
   */
  viewDocument(doc: Document): void {
    this.knowledgeBase.selectedDocument.set(doc);
    this.knowledgeBase.recordView(doc.id);
    this.router.navigate(['/documents', doc.id]);
  }

  /**
   * 高亮搜尋關鍵字（防 XSS 和 ReDoS）
   *
   * Angular v20 最佳實踐：
   * 1. 先轉義 HTML 特殊字符（防 XSS）
   * 2. 轉義正則表達式特殊字符（防 ReDoS）
   * 3. 使用 DomSanitizer 進行最終消毒
   */
  highlightText(text: string, query: string): SafeHtml {
    if (!query.trim()) {
      // 即使是純文字也要轉義
      return this.escapeHtml(text);
    }

    // 1. 先轉義 HTML（防止 XSS）
    const escapedText = this.escapeHtml(text);

    // 2. 轉義正則表達式特殊字符（防止 ReDoS）
    const escapedQuery = this.escapeRegex(query);

    // 3. 進行高亮替換
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const highlighted = escapedText.replace(regex, '<mark class="highlight">$1</mark>');

    // 4. 使用 DomSanitizer 進行消毒（Angular 20 推薦）
    return this.sanitizer.sanitize(1, highlighted) || '';
  }

  /**
   * 轉義 HTML 特殊字符
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 轉義正則表達式特殊字符
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
