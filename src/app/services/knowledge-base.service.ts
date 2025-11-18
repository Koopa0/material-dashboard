/**
 * RAG 知識庫服務
 *
 * 使用 Angular v20 Signals 實現響應式狀態管理
 * 此服務管理所有知識庫相關的資料和操作
 *
 * Angular v20 最佳實踐：
 * 1. 使用 inject() 函數進行依賴注入
 * 2. 使用 signal() 管理狀態
 * 3. 使用 computed() 衍生狀態
 * 4. 使用 effect() 處理副作用
 */

import { Injectable, signal, computed, effect, inject } from '@angular/core';
import {
  Document,
  DocumentStatus,
  TechnologyCategory,
  CreateDocumentRequest,
  UpdateDocumentRequest,
} from '../models/document.model';
import { Embedding, SimilarityResult, Point2D } from '../models/embedding.model';
import {
  QueryRecord,
  QueryType,
  SearchRequest,
  SearchResult,
  PopularQuery,
} from '../models/query.model';
import {
  KnowledgeBaseStats,
  CategoryStats,
  QueryStatistics,
} from '../models/statistics.model';
import {
  generateMockDocuments,
  generateMockEmbeddings,
  generate2DPoints,
  generateMockQueryRecords,
  generateKnowledgeBaseStats,
  generateCategoryStats,
  generateQueryStatistics,
  generatePopularQueries,
} from '../data/mock-data.generator';

/**
 * 知識庫服務
 * 提供所有RAG系統功能的核心服務
 */
@Injectable({
  providedIn: 'root', // 全域單例服務
})
export class KnowledgeBaseService {
  // ==================== 狀態管理 (使用 Signals) ====================

  /**
   * 所有文檔列表 (可寫信號)
   * 使用 signal() 創建可變狀態
   */
  private documentsSignal = signal<Document[]>([]);

  /**
   * 文檔列表 (唯讀)
   * 使用 asReadonly() 防止外部直接修改
   */
  readonly documents = this.documentsSignal.asReadonly();

  /**
   * 向量嵌入資料
   */
  private embeddingsSignal = signal<Embedding[]>([]);
  readonly embeddings = this.embeddingsSignal.asReadonly();

  /**
   * 2D 視覺化點位資料
   */
  private points2DSignal = signal<Point2D[]>([]);
  readonly points2D = this.points2DSignal.asReadonly();

  /**
   * 查詢歷史記錄
   */
  private queryRecordsSignal = signal<QueryRecord[]>([]);
  readonly queryRecords = this.queryRecordsSignal.asReadonly();

  /**
   * 目前選中的文檔
   */
  selectedDocument = signal<Document | null>(null);

  /**
   * 搜尋關鍵字
   */
  searchQuery = signal<string>('');

  /**
   * 篩選分類
   */
  selectedCategories = signal<TechnologyCategory[]>([]);

  /**
   * 載入狀態
   */
  isLoading = signal<boolean>(false);

  // ==================== 衍生狀態 (使用 Computed) ====================

  /**
   * 篩選後的文檔列表
   * 使用 computed() 創建衍生狀態，當依賴變更時自動重新計算
   */
  filteredDocuments = computed(() => {
    let docs = this.documents();
    const query = this.searchQuery().toLowerCase();
    const categories = this.selectedCategories();

    // 按分類篩選
    if (categories.length > 0) {
      docs = docs.filter((doc) => categories.includes(doc.category));
    }

    // 按關鍵字搜尋
    if (query) {
      docs = docs.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.content.toLowerCase().includes(query) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return docs;
  });

  /**
   * 知識庫統計資料
   */
  stats = computed<KnowledgeBaseStats>(() => {
    return generateKnowledgeBaseStats(this.documents());
  });

  /**
   * 分類統計資料
   */
  categoryStats = computed<CategoryStats[]>(() => {
    return generateCategoryStats(this.documents());
  });

  /**
   * 查詢統計資料
   */
  queryStats = computed<QueryStatistics>(() => {
    return generateQueryStatistics(this.queryRecords());
  });

  /**
   * 熱門查詢列表
   */
  popularQueries = computed<PopularQuery[]>(() => {
    return generatePopularQueries();
  });

  /**
   * 各分類文檔數量
   */
  categoryDocumentCounts = computed(() => {
    const docs = this.documents();
    const counts: Record<string, number> = {};

    Object.values(TechnologyCategory).forEach((category) => {
      counts[category] = docs.filter((doc) => doc.category === category).length;
    });

    return counts;
  });

  // ==================== 建構函式 ====================

  constructor() {
    // 初始化資料
    this.initializeData();

    // 使用 effect() 處理副作用
    // 當文檔變更時，自動儲存到 localStorage
    effect(() => {
      const docs = this.documents();
      if (docs.length > 0) {
        this.saveToLocalStorage('documents', docs);
      }
    });
  }

  // ==================== 初始化方法 ====================

  /**
   * 初始化模擬資料
   */
  private initializeData(): void {
    // 從 localStorage 載入或生成新資料
    const savedDocs = this.loadFromLocalStorage<Document[]>('documents');

    // 檢查是否有舊資料格式（含 author 欄位）
    const hasOldFormat = savedDocs && savedDocs.length > 0 &&
                        (savedDocs[0] as any).author !== undefined;

    if (savedDocs && savedDocs.length > 0 && !hasOldFormat) {
      this.documentsSignal.set(savedDocs);
    } else {
      // 生成模擬資料（舊資料格式時重新生成）
      const mockDocs = generateMockDocuments(300);
      this.documentsSignal.set(mockDocs);

      if (hasOldFormat) {
        console.log('偵測到舊資料格式，已重新生成文檔資料');
      }
    }

    // 生成向量嵌入
    const mockEmbeddings = generateMockEmbeddings(this.documents());
    this.embeddingsSignal.set(mockEmbeddings);

    // 生成 2D 視覺化點位
    const mock2DPoints = generate2DPoints(this.documents());
    this.points2DSignal.set(mock2DPoints);

    // 生成查詢記錄
    const mockQueries = generateMockQueryRecords(100);
    this.queryRecordsSignal.set(mockQueries);
  }

  // ==================== 文檔操作方法 ====================

  /**
   * 建立新文檔
   */
  createDocument(request: CreateDocumentRequest): Document {
    const newDoc: Document = {
      id: this.generateId(),
      title: request.title,
      content: request.content,
      summary: request.content.substring(0, 100) + '...',
      category: request.category,
      tags: request.tags,
      embeddingId: this.generateId(),
      status: DocumentStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      source: request.source,
      sourceUrl: request.sourceUrl,
      viewCount: 0,
      size: request.content.length,
      language: request.language || 'zh-TW',
    };

    // 使用 update() 更新 signal
    this.documentsSignal.update((docs) => [...docs, newDoc]);

    return newDoc;
  }

  /**
   * 更新文檔
   */
  updateDocument(request: UpdateDocumentRequest): void {
    this.documentsSignal.update((docs) =>
      docs.map((doc) =>
        doc.id === request.id
          ? {
              ...doc,
              ...request,
              updatedAt: new Date(),
            }
          : doc
      )
    );
  }

  /**
   * 刪除文檔
   */
  deleteDocument(id: string): void {
    this.documentsSignal.update((docs) => docs.filter((doc) => doc.id !== id));
  }

  /**
   * 根據 ID 取得文檔
   */
  getDocumentById(id: string): Document | undefined {
    return this.documents().find((doc) => doc.id === id);
  }

  /**
   * 增加文檔檢視次數
   */
  incrementViewCount(id: string): void {
    this.documentsSignal.update((docs) =>
      docs.map((doc) =>
        doc.id === id
          ? { ...doc, viewCount: doc.viewCount + 1 }
          : doc
      )
    );
  }

  // ==================== 搜尋方法 ====================

  /**
   * 執行搜尋
   * 模擬語意搜尋功能
   */
  search(request: SearchRequest): SearchResult {
    const startTime = Date.now();

    let results = this.documents();

    // 按分類篩選
    if (request.categories && request.categories.length > 0) {
      results = results.filter((doc) =>
        request.categories!.includes(doc.category)
      );
    }

    // 按標籤篩選
    if (request.tags && request.tags.length > 0) {
      results = results.filter((doc) =>
        request.tags!.some((tag) => doc.tags.includes(tag))
      );
    }

    // 關鍵字搜尋
    const query = request.query.toLowerCase();
    if (query) {
      results = results.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.content.toLowerCase().includes(query) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(query))
      );

      // 計算相關性分數（簡化版）
      results = results.map((doc) => ({
        ...doc,
        relevanceScore: this.calculateRelevance(doc, query),
      }));

      // 按相關性排序
      if (request.sortBy === 'relevance' || !request.sortBy) {
        results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      }
    }

    // 按其他方式排序
    if (request.sortBy === 'date') {
      results.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      );
    } else if (request.sortBy === 'views') {
      results.sort((a, b) => b.viewCount - a.viewCount);
    }

    // 分頁
    const page = request.page || 1;
    const pageSize = request.pageSize || 20;
    const startIndex = (page - 1) * pageSize;
    const paginatedResults = results.slice(startIndex, startIndex + pageSize);

    const latency = Date.now() - startTime;

    // 記錄查詢
    this.recordQuery({
      query: request.query,
      type: request.type,
      resultCount: results.length,
      latency,
    });

    return {
      documents: paginatedResults,
      total: results.length,
      latency,
      suggestions: results.length === 0 ? this.generateSuggestions(query) : undefined,
    };
  }

  /**
   * 計算相關性分數（簡化版）
   */
  private calculateRelevance(doc: Document, query: string): number {
    let score = 0;

    // 標題完全匹配
    if (doc.title.toLowerCase() === query) {
      score += 100;
    }
    // 標題包含
    else if (doc.title.toLowerCase().includes(query)) {
      score += 50;
    }

    // 標籤匹配
    doc.tags.forEach((tag) => {
      if (tag.toLowerCase() === query) score += 30;
      else if (tag.toLowerCase().includes(query)) score += 15;
    });

    // 內容包含
    if (doc.content.toLowerCase().includes(query)) {
      score += 10;
    }

    return score;
  }

  /**
   * 生成搜尋建議
   */
  private generateSuggestions(query: string): string[] {
    return [
      '嘗試使用不同的關鍵字',
      '檢查拼寫是否正確',
      '使用更廣泛的搜尋詞',
    ];
  }

  /**
   * 記錄查詢
   */
  private recordQuery(params: {
    query: string;
    type: QueryType;
    resultCount: number;
    latency: number;
  }): void {
    const queryRecord: QueryRecord = {
      id: this.generateId(),
      query: params.query,
      type: params.type,
      timestamp: new Date(),
      resultCount: params.resultCount,
      latency: params.latency,
      hasResults: params.resultCount > 0,
    };

    this.queryRecordsSignal.update((records) => [queryRecord, ...records]);
  }

  // ==================== 向量搜尋方法 ====================

  /**
   * 模擬向量相似度搜尋
   */
  vectorSearch(query: string, limit: number = 10): SimilarityResult[] {
    // 在真實應用中，這裡會呼叫向量資料庫 API
    // 這裡我們模擬返回隨機相似度結果
    const docs = this.documents();
    const results = docs.slice(0, limit).map((doc) => ({
      documentId: doc.id,
      similarity: Math.random() * 0.5 + 0.5, // 0.5-1.0 之間
    }));

    return results.sort((a, b) => b.similarity - a.similarity);
  }

  // ==================== 工具方法 ====================

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 儲存到 localStorage
   */
  private saveToLocalStorage<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  /**
   * 從 localStorage 載入
   */
  private loadFromLocalStorage<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  /**
   * 重置所有資料
   */
  resetData(): void {
    const mockDocs = generateMockDocuments(300);
    this.documentsSignal.set(mockDocs);

    const mockEmbeddings = generateMockEmbeddings(mockDocs);
    this.embeddingsSignal.set(mockEmbeddings);

    const mock2DPoints = generate2DPoints(mockDocs);
    this.points2DSignal.set(mock2DPoints);

    const mockQueries = generateMockQueryRecords(100);
    this.queryRecordsSignal.set(mockQueries);

    localStorage.clear();
  }
}
