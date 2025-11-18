/**
 * Citation 引用模型
 *
 * 用於 AI 回答的來源引用系統
 * 靈感來自 NotebookLM 的 source-grounded responses
 */

/**
 * 引用來源介面
 */
export interface Citation {
  /** 引用編號（顯示用） */
  index: number;

  /** 來源文檔 ID */
  documentId: string;

  /** 來源文檔標題 */
  documentTitle: string;

  /** 引用的原文片段 */
  snippet: string;

  /** 在文檔中的起始位置（字符索引） */
  startPosition?: number;

  /** 在文檔中的結束位置（字符索引） */
  endPosition?: number;

  /** 相關性分數（0-1） */
  relevanceScore: number;

  /** 文檔分類 */
  category?: string;

  /** 文檔標籤 */
  tags?: string[];
}

/**
 * 帶引用的 AI 回答
 */
export interface AIResponseWithCitations {
  /** 回答文字（包含引用標記 [1], [2] 等） */
  text: string;

  /** 引用來源列表 */
  citations: Citation[];

  /** 是否為錯誤回應 */
  isError?: boolean;

  /** 回應延遲（毫秒） */
  latency?: number;
}
