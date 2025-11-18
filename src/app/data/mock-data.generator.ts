/**
 * RAG 知識庫 - 模擬資料生成器
 *
 * 此檔案產生各種模擬資料，用於展示系統功能
 * 包含 Golang、Rust、Flutter、Angular、AI、Gemini、System Design、PostgreSQL 等技術文檔
 */

import {
  Document,
  DocumentStatus,
  TechnologyCategory,
  DocumentSource,
} from '../models/document.model';
import { Embedding, Point2D } from '../models/embedding.model';
import { QueryRecord, QueryType, PopularQuery } from '../models/query.model';
import {
  KnowledgeBaseStats,
  CategoryStats,
  TimeSeriesDataPoint,
  QueryStatistics,
} from '../models/statistics.model';

/**
 * 技術文檔範本資料
 * 每個分類包含多個文檔主題
 */
const documentTemplates: Record<
  TechnologyCategory,
  Array<{ title: string; tags: string[]; content: string }>
> = {
  [TechnologyCategory.GOLANG]: [
    {
      title: 'Go 語言基礎：變數與資料型別',
      tags: ['基礎', '變數', '型別'],
      content:
        'Go 是一個靜態型別的編程語言。本文介紹 Go 的基本資料型別，包括 int、string、bool 等，以及如何宣告和使用變數...',
    },
    {
      title: 'Goroutines 與並發程式設計',
      tags: ['並發', 'goroutine', '進階'],
      content:
        'Goroutines 是 Go 語言最強大的特性之一。本文深入探討如何使用 goroutines 實作高效的並發程式...',
    },
    {
      title: 'Go Channels：並發通訊機制',
      tags: ['channel', '並發', '通訊'],
      content:
        'Channels 提供了 goroutines 之間安全的通訊方式。學習如何使用 buffered 和 unbuffered channels...',
    },
    {
      title: 'Go Interface 介面設計原則',
      tags: ['介面', '設計模式', 'OOP'],
      content:
        'Go 的介面是隱式實作的，這使得程式碼更加靈活。本文介紹介面設計的最佳實踐...',
    },
    {
      title: 'Go Error 錯誤處理機制',
      tags: ['錯誤處理', '最佳實踐'],
      content:
        'Go 使用明確的錯誤值而非例外處理。學習如何優雅地處理錯誤...',
    },
  ],
  [TechnologyCategory.RUST]: [
    {
      title: 'Rust 所有權系統詳解',
      tags: ['所有權', '記憶體安全', '基礎'],
      content:
        'Rust 的所有權系統是其最核心的特性，確保記憶體安全而不需要垃圾回收器。本文深入解釋所有權、借用和生命週期...',
    },
    {
      title: 'Rust 生命週期標註完整指南',
      tags: ['生命週期', '進階', '借用檢查器'],
      content:
        '生命週期是 Rust 編譯器理解引用有效性的方式。學習如何正確使用生命週期標註...',
    },
    {
      title: 'Rust Trait：多型與抽象',
      tags: ['trait', '多型', '泛型'],
      content:
        'Trait 類似於其他語言的介面，但功能更強大。了解如何使用 trait 實現程式碼抽象...',
    },
    {
      title: 'Async/Await 異步程式設計',
      tags: ['async', '異步', '並發'],
      content:
        'Rust 的 async/await 語法提供了高效的異步程式設計模型。本文介紹如何使用 Tokio 框架...',
    },
  ],
  [TechnologyCategory.FLUTTER]: [
    {
      title: 'Flutter Widget 生命週期',
      tags: ['widget', '生命週期', '基礎'],
      content:
        'Flutter 中一切皆為 Widget。理解 StatelessWidget 和 StatefulWidget 的生命週期對開發至關重要...',
    },
    {
      title: 'Flutter State 狀態管理：Provider 實戰',
      tags: ['狀態管理', 'provider', '架構'],
      content:
        'Provider 是 Flutter 官方推薦的狀態管理方案。學習如何使用 Provider 建立可維護的應用程式...',
    },
    {
      title: 'Flutter 效能優化技巧',
      tags: ['效能', '優化', '最佳實踐'],
      content:
        '提升 Flutter 應用效能的實用技巧，包括 const constructor、RepaintBoundary 等...',
    },
    {
      title: 'Flutter 路由與導航管理',
      tags: ['路由', '導航', 'navigation'],
      content:
        '深入了解 Flutter 的導航系統，包括 Navigator 1.0 和 Navigator 2.0 的使用...',
    },
  ],
  [TechnologyCategory.ANGULAR]: [
    {
      title: 'Angular Signals：響應式狀態管理新方案',
      tags: ['signals', 'v16', '響應式'],
      content:
        'Angular Signals 是 v16 引入的革命性功能，提供了更簡潔的響應式狀態管理方式...',
    },
    {
      title: 'Angular Standalone Components 完全指南',
      tags: ['standalone', 'v15', '模組'],
      content:
        'Standalone Components 讓你無需 NgModule 即可建立元件，簡化了應用程式結構...',
    },
    {
      title: 'Angular v20 新功能詳解',
      tags: ['v20', '新功能', '更新'],
      content:
        'Angular v20 帶來了許多改進，包括更好的效能、新的 API 和開發體驗提升...',
    },
    {
      title: 'RxJS Operators 實戰應用',
      tags: ['rxjs', 'operators', '響應式編程'],
      content:
        '掌握 RxJS operators 是 Angular 開發的關鍵。本文介紹常用 operators 的實際應用...',
    },
    {
      title: 'Angular CDK：強大的元件開發工具包',
      tags: ['cdk', 'material', '元件'],
      content:
        'Angular CDK 提供了建立高品質元件所需的行為和互動模式，包括 Drag&Drop、Virtual Scroll 等...',
    },
  ],
  [TechnologyCategory.AI]: [
    {
      title: 'Transformer 架構深度解析',
      tags: ['transformer', 'NLP', '深度學習'],
      content:
        'Transformer 徹底改變了 NLP 領域。理解其自注意力機制和位置編碼的工作原理...',
    },
    {
      title: 'RAG（檢索增強生成）系統設計',
      tags: ['RAG', 'LLM', '應用'],
      content:
        'RAG 結合檢索系統和生成模型，提供更準確的回答。學習如何建構 RAG 系統...',
    },
    {
      title: 'Prompt Engineering 最佳實踐',
      tags: ['prompt', 'LLM', '技巧'],
      content:
        '撰寫有效的 prompt 是使用 LLM 的關鍵。本文分享 prompt engineering 的策略和技巧...',
    },
    {
      title: '向量資料庫選型指南',
      tags: ['向量資料庫', 'embedding', 'RAG'],
      content:
        '比較 Pinecone、Weaviate、Milvus 等向量資料庫的特性和使用場景...',
    },
  ],
  [TechnologyCategory.GEMINI]: [
    {
      title: 'Gemini API 快速入門',
      tags: ['API', '基礎', '入門'],
      content:
        'Google Gemini 是強大的多模態 AI 模型。本文介紹如何使用 Gemini API 進行文字生成和分析...',
    },
    {
      title: 'Gemini 1.5 Pro：長上下文處理',
      tags: ['1.5 pro', '長上下文', '功能'],
      content:
        'Gemini 1.5 Pro 支援高達 100 萬 tokens 的上下文窗口，適合處理長文檔...',
    },
    {
      title: 'Gemini Flash：高速推理模型',
      tags: ['flash', '效能', 'API'],
      content:
        'Gemini Flash 專為低延遲場景設計，提供快速的推理速度...',
    },
    {
      title: 'Gemini Embedding API 使用指南',
      tags: ['embedding', '向量化', 'RAG'],
      content:
        '使用 Gemini Embedding API 將文字轉換為向量，用於語意搜尋和相似度比對...',
    },
  ],
  [TechnologyCategory.SYSTEM_DESIGN]: [
    {
      title: '微服務架構設計原則',
      tags: ['微服務', '架構', '分散式'],
      content:
        '微服務將應用程式拆分為小型獨立服務。學習微服務的設計原則和最佳實踐...',
    },
    {
      title: 'CAP 定理與分散式系統',
      tags: ['CAP', '分散式', '理論'],
      content:
        'CAP 定理描述了分散式系統的三個關鍵特性：一致性、可用性、分區容錯性...',
    },
    {
      title: 'API 閘道設計模式',
      tags: ['API Gateway', '架構', '微服務'],
      content:
        'API 閘道作為系統入口，處理路由、認證、限流等功能...',
    },
    {
      title: '快取策略完整指南',
      tags: ['快取', '效能', 'Redis'],
      content:
        '深入探討各種快取策略：Cache-Aside、Write-Through、Write-Behind 等...',
    },
    {
      title: '負載平衡演算法比較',
      tags: ['負載平衡', '演算法', '高可用'],
      content:
        '比較 Round Robin、Least Connections、IP Hash 等負載平衡演算法...',
    },
  ],
  [TechnologyCategory.POSTGRES]: [
    {
      title: 'PostgreSQL 索引優化技巧',
      tags: ['索引', '效能', '優化'],
      content:
        'B-tree、Hash、GiST、GIN 等索引類型的選擇和使用時機...',
    },
    {
      title: 'PostgreSQL 查詢效能分析',
      tags: ['EXPLAIN', '效能', '查詢計劃'],
      content:
        '使用 EXPLAIN ANALYZE 分析查詢計劃，找出效能瓶頸...',
    },
    {
      title: 'PostgreSQL JSON 資料類型應用',
      tags: ['JSON', 'JSONB', 'NoSQL'],
      content:
        'PostgreSQL 的 JSONB 類型讓關聯式資料庫也能處理半結構化資料...',
    },
    {
      title: 'PostgreSQL 向量擴展 pgvector',
      tags: ['pgvector', '向量搜尋', 'AI'],
      content:
        'pgvector 擴展讓 PostgreSQL 支援向量儲存和相似度搜尋，適合 AI 應用...',
    },
  ],
};

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 生成隨機日期
 */
function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

/**
 * 根據技術分類取得文檔來源資訊
 */
function getDocumentSource(category: TechnologyCategory, title: string): {
  source: DocumentSource;
  sourceUrl?: string;
} {
  const sourceMap: Record<TechnologyCategory, Array<{
    source: DocumentSource;
    urlTemplate: string;
  }>> = {
    [TechnologyCategory.GOLANG]: [
      { source: DocumentSource.GITHUB, urlTemplate: 'https://github.com/golang/go/wiki' },
      { source: DocumentSource.WEB_ARTICLE, urlTemplate: 'https://go.dev/blog' },
    ],
    [TechnologyCategory.RUST]: [
      { source: DocumentSource.GITHUB, urlTemplate: 'https://github.com/rust-lang/book' },
      { source: DocumentSource.WEB_ARTICLE, urlTemplate: 'https://blog.rust-lang.org' },
    ],
    [TechnologyCategory.FLUTTER]: [
      { source: DocumentSource.GITHUB, urlTemplate: 'https://github.com/flutter/flutter/wiki' },
      { source: DocumentSource.WEB_ARTICLE, urlTemplate: 'https://flutter.dev/docs' },
    ],
    [TechnologyCategory.ANGULAR]: [
      { source: DocumentSource.GITHUB, urlTemplate: 'https://github.com/angular/angular' },
      { source: DocumentSource.WEB_ARTICLE, urlTemplate: 'https://angular.dev/overview' },
    ],
    [TechnologyCategory.AI]: [
      { source: DocumentSource.WEB_ARTICLE, urlTemplate: 'https://arxiv.org/abs' },
      { source: DocumentSource.NOTION, urlTemplate: 'https://notion.so/ai-research' },
    ],
    [TechnologyCategory.GEMINI]: [
      { source: DocumentSource.GOOGLE_DOCS, urlTemplate: 'https://ai.google.dev/gemini-api/docs' },
      { source: DocumentSource.WEB_ARTICLE, urlTemplate: 'https://deepmind.google/technologies/gemini' },
    ],
    [TechnologyCategory.SYSTEM_DESIGN]: [
      { source: DocumentSource.NOTION, urlTemplate: 'https://notion.so/system-design' },
      { source: DocumentSource.WEB_ARTICLE, urlTemplate: 'https://systemdesign.one' },
    ],
    [TechnologyCategory.POSTGRES]: [
      { source: DocumentSource.GITHUB, urlTemplate: 'https://github.com/postgres/postgres' },
      { source: DocumentSource.WEB_ARTICLE, urlTemplate: 'https://postgresql.org/docs' },
    ],
  };

  const sources = sourceMap[category];
  const selected = sources[Math.floor(Math.random() * sources.length)];

  return {
    source: selected.source,
    sourceUrl: `${selected.urlTemplate}/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}`,
  };
}

/**
 * 生成模擬文檔資料
 */
export function generateMockDocuments(count: number = 300): Document[] {
  const documents: Document[] = [];
  const categories = Object.values(TechnologyCategory);

  let currentCount = 0;
  while (currentCount < count) {
    for (const category of categories) {
      const templates = documentTemplates[category];
      if (!templates) continue;

      for (const template of templates) {
        if (currentCount >= count) break;

        const createdAt = randomDate(
          new Date(2024, 0, 1),
          new Date()
        );
        const updatedAt = randomDate(createdAt, new Date());

        // 取得文檔來源資訊
        const { source, sourceUrl } = getDocumentSource(category, template.title);

        documents.push({
          id: generateId(),
          title: template.title,
          content: template.content,
          summary: template.content.substring(0, 100) + '...',
          category,
          tags: template.tags,
          embeddingId: generateId(),
          status: DocumentStatus.ACTIVE,
          createdAt,
          updatedAt,
          source,
          sourceUrl,
          viewCount: Math.floor(Math.random() * 1000),
          size: template.content.length,
          language: Math.random() > 0.7 ? 'en' : 'zh-TW',
        });

        currentCount++;
      }
    }
  }

  return documents.slice(0, count);
}

/**
 * 生成模擬向量嵌入資料
 */
export function generateMockEmbeddings(documents: Document[]): Embedding[] {
  return documents.map((doc) => ({
    id: doc.embeddingId || generateId(),
    documentId: doc.id,
    vector: Array.from({ length: 768 }, () => Math.random()),
    model: 'gemini-embedding-001',
    createdAt: doc.createdAt,
    dimensions: 768,
  }));
}

/**
 * 生成 2D 視覺化點位（使用 t-SNE 模擬）
 */
export function generate2DPoints(documents: Document[]): Point2D[] {
  const categoryOffsets: Record<TechnologyCategory, { x: number; y: number }> =
    {
      [TechnologyCategory.GOLANG]: { x: -50, y: -50 },
      [TechnologyCategory.RUST]: { x: 50, y: -50 },
      [TechnologyCategory.FLUTTER]: { x: -50, y: 50 },
      [TechnologyCategory.ANGULAR]: { x: 50, y: 50 },
      [TechnologyCategory.AI]: { x: 0, y: -70 },
      [TechnologyCategory.GEMINI]: { x: 0, y: 70 },
      [TechnologyCategory.SYSTEM_DESIGN]: { x: -70, y: 0 },
      [TechnologyCategory.POSTGRES]: { x: 70, y: 0 },
    };

  return documents.map((doc) => {
    const offset = categoryOffsets[doc.category];
    return {
      x: offset.x + (Math.random() - 0.5) * 40,
      y: offset.y + (Math.random() - 0.5) * 40,
      documentId: doc.id,
      category: doc.category,
      title: doc.title,
    };
  });
}

/**
 * 生成模擬查詢記錄
 */
export function generateMockQueryRecords(count: number = 100): QueryRecord[] {
  const queries = [
    'Golang 並發',
    'Rust 所有權',
    'Flutter 狀態管理',
    'Angular Signals',
    'Transformer 架構',
    'Gemini API',
    '微服務設計',
    'PostgreSQL 優化',
    '如何使用 Channel',
    'RAG 系統實作',
  ];

  return Array.from({ length: count }, () => ({
    id: generateId(),
    query: queries[Math.floor(Math.random() * queries.length)],
    type:
      Math.random() > 0.5 ? QueryType.SEMANTIC : QueryType.KEYWORD,
    timestamp: randomDate(new Date(2024, 0, 1), new Date()),
    resultCount: Math.floor(Math.random() * 20),
    latency: Math.floor(Math.random() * 500) + 50,
    hasResults: Math.random() > 0.1,
  }));
}

/**
 * 生成知識庫統計資料
 */
export function generateKnowledgeBaseStats(
  documents: Document[]
): KnowledgeBaseStats {
  const today = new Date();
  const todayDocs = documents.filter(
    (doc) =>
      doc.createdAt.toDateString() === today.toDateString()
  );
  const thisWeekViews = documents.reduce(
    (sum, doc) => sum + Math.floor(doc.viewCount * 0.3),
    0
  );

  return {
    totalDocuments: documents.length,
    documentsAddedToday: todayDocs.length,
    totalStorage: documents.reduce((sum, doc) => sum + doc.size, 0),
    totalViews: documents.reduce((sum, doc) => sum + doc.viewCount, 0),
    viewsThisWeek: thisWeekViews,
    totalQueries: 1247,
    queriesToday: 89,
    avgQueryLatency: 127,
    lastUpdated: new Date(),
  };
}

/**
 * 生成分類統計資料
 */
export function generateCategoryStats(documents: Document[]): CategoryStats[] {
  const categories = Object.values(TechnologyCategory);
  const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#FF6384',
    '#C9CBCF',
  ];

  return categories.map((category, index) => {
    const categoryDocs = documents.filter((doc) => doc.category === category);
    return {
      category,
      documentCount: categoryDocs.length,
      percentage: (categoryDocs.length / documents.length) * 100,
      avgViews:
        categoryDocs.reduce((sum, doc) => sum + doc.viewCount, 0) /
          categoryDocs.length || 0,
      color: colors[index],
    };
  });
}

/**
 * 生成時間序列資料（過去 7 天）
 */
export function generateTimeSeriesData(): TimeSeriesDataPoint[] {
  const data: TimeSeriesDataPoint[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date,
      value: Math.floor(Math.random() * 100) + 50,
    });
  }

  return data;
}

/**
 * 生成查詢統計資料
 */
export function generateQueryStatistics(
  queries: QueryRecord[]
): QueryStatistics {
  const successful = queries.filter((q) => q.hasResults).length;
  const latencies = queries.map((q) => q.latency);

  return {
    total: queries.length,
    successful,
    failed: queries.length - successful,
    successRate: (successful / queries.length) * 100,
    avgLatency: latencies.reduce((a, b) => a + b, 0) / latencies.length,
    maxLatency: Math.max(...latencies),
    minLatency: Math.min(...latencies),
    trend: generateTimeSeriesData(),
  };
}

/**
 * 生成熱門查詢
 */
export function generatePopularQueries(): PopularQuery[] {
  return [
    { query: 'Angular Signals 使用教學', count: 156, lastSearched: new Date() },
    { query: 'Rust 所有權詳解', count: 134, lastSearched: new Date() },
    { query: 'Gemini API 整合', count: 98, lastSearched: new Date() },
    {
      query: 'PostgreSQL 效能優化',
      count: 87,
      lastSearched: new Date(),
    },
    { query: 'Flutter 狀態管理比較', count: 76, lastSearched: new Date() },
  ];
}
