/**
 * Search 搜尋頁面元件
 *
 * Sprint 3 優化：
 * - 預載入所有文檔（使用 KnowledgeBase 服務）
 * - 即時過濾（使用 computed signal）
 * - 搜尋結果高亮
 * - 效能優化
 */
import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
})
export class SearchComponent {
  /** 知識庫服務 */
  knowledgeBase = inject(KnowledgeBaseService);

  /** 搜尋查詢文字 */
  searchQuery = signal<string>('');

  /** 搜尋開始時間（用於計算延遲） */
  private searchStartTime = signal<number>(0);

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

    const startTime = performance.now();
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

    const endTime = performance.now();
    this.searchLatency.set(Math.round(endTime - startTime));

    return results;
  });

  /** 搜尋延遲時間（毫秒） */
  searchLatency = signal<number>(0);

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
    console.log('Viewing document from search:', doc);
  }

  /**
   * 高亮搜尋關鍵字
   */
  highlightText(text: string, query: string): string {
    if (!query.trim()) {
      return text;
    }

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="highlight">$1</mark>');
  }
}
