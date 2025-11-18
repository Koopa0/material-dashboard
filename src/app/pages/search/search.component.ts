/**
 * Search 搜尋頁面元件
 *
 * 提供語意搜尋和關鍵字搜尋功能
 * 展示 Angular v20 Signals 與響應式表單的整合
 */
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';
import { Document, TechnologyCategory } from '../../models';
import { QueryType } from '../../models/query.model';

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
  private knowledgeBase = inject(KnowledgeBaseService);

  /** 搜尋查詢文字 */
  searchQuery = signal<string>('');

  /** 搜尋結果 */
  searchResults = signal<Document[]>([]);

  /** 是否正在搜尋 */
  isSearching = signal<boolean>(false);

  /** 搜尋延遲時間（毫秒） */
  searchLatency = signal<number>(0);

  /**
   * 執行搜尋
   */
  onSearch(): void {
    const query = this.searchQuery();
    if (!query.trim()) return;

    this.isSearching.set(true);

    // 模擬網路延遲
    setTimeout(() => {
      const result = this.knowledgeBase.search({
        query,
        type: QueryType.SEMANTIC,
        sortBy: 'relevance',
      });

      this.searchResults.set(result.documents);
      this.searchLatency.set(result.latency);
      this.isSearching.set(false);
    }, 300);
  }

  /**
   * 清除搜尋
   */
  onClear(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.searchLatency.set(0);
  }

  /**
   * 查看文檔詳情
   */
  viewDocument(doc: Document): void {
    this.knowledgeBase.selectedDocument.set(doc);
    this.knowledgeBase.incrementViewCount(doc.id);
  }
}
