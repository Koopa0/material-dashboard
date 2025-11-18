/**
 * RAG 知識庫 - 查詢模型
 *
 * 此檔案定義了搜尋查詢相關的資料結構
 * 用於記錄和分析使用者搜尋行為
 */

import { Document } from './document.model';

/**
 * 查詢類型枚舉
 */
export enum QueryType {
  SEMANTIC = 'semantic',     // 語意搜尋
  KEYWORD = 'keyword',       // 關鍵字搜尋
  HYBRID = 'hybrid',         // 混合搜尋
}

/**
 * 查詢記錄介面
 * 儲存使用者的搜尋歷史
 */
export interface QueryRecord {
  /** 查詢唯一識別碼 */
  id: string;

  /** 查詢文字 */
  query: string;

  /** 查詢類型 */
  type: QueryType;

  /** 查詢時間 */
  timestamp: Date;

  /** 返回結果數量 */
  resultCount: number;

  /** 查詢延遲（毫秒） */
  latency: number;

  /** 是否找到相關結果 */
  hasResults: boolean;

  /** 使用者選擇的結果 ID */
  selectedDocumentId?: string;
}

/**
 * 搜尋結果介面
 */
export interface SearchResult {
  /** 相關文檔列表 */
  documents: Document[];

  /** 總結果數 */
  total: number;

  /** 查詢延遲（毫秒） */
  latency: number;

  /** 查詢建議（如果沒有結果） */
  suggestions?: string[];
}

/**
 * 搜尋請求介面
 */
export interface SearchRequest {
  /** 搜尋查詢文字 */
  query: string;

  /** 搜尋類型 */
  type: QueryType;

  /** 分類篩選 */
  categories?: string[];

  /** 標籤篩選 */
  tags?: string[];

  /** 分頁：頁碼 */
  page?: number;

  /** 分頁：每頁數量 */
  pageSize?: number;

  /** 排序方式 */
  sortBy?: 'relevance' | 'date' | 'views';
}

/**
 * 熱門查詢介面
 * 用於分析熱門搜尋詞
 */
export interface PopularQuery {
  /** 查詢文字 */
  query: string;

  /** 搜尋次數 */
  count: number;

  /** 最後搜尋時間 */
  lastSearched: Date;
}
