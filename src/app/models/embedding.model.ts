/**
 * RAG 知識庫 - 向量嵌入模型
 *
 * 此檔案定義了向量嵌入（Embedding）的資料結構
 * 用於語意搜尋和相似度比對
 */

/**
 * 向量嵌入介面
 * 代表文檔的向量化表示
 */
export interface Embedding {
  /** 嵌入唯一識別碼 */
  id: string;

  /** 關聯的文檔 ID */
  documentId: string;

  /** 向量資料（1536 維度，用於 Gemini Embedding API） */
  vector: number[];

  /** 向量模型名稱 */
  model: string;

  /** 建立時間 */
  createdAt: Date;

  /** 向量維度 */
  dimensions: number;
}

/**
 * 向量相似度結果介面
 * 用於搜尋結果的相似度排序
 */
export interface SimilarityResult {
  /** 文檔 ID */
  documentId: string;

  /** 相似度分數（0-1 之間，越接近 1 越相似） */
  similarity: number;

  /** 距離值（可選，某些演算法使用） */
  distance?: number;
}

/**
 * 向量搜尋請求介面
 */
export interface VectorSearchRequest {
  /** 查詢文字 */
  query: string;

  /** 返回結果數量 */
  limit: number;

  /** 最小相似度閾值 */
  threshold?: number;

  /** 篩選分類 */
  categories?: string[];
}

/**
 * 二維座標點介面
 * 用於視覺化顯示向量分布
 */
export interface Point2D {
  x: number;
  y: number;
  documentId: string;
  category: string;
  title: string;
}
