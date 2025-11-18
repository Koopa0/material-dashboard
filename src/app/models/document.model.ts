/**
 * RAG 知識庫 - 文檔模型
 *
 * 此檔案定義了知識庫中文檔的資料結構
 * 用於表示技術文檔、教學文章等內容
 */

/**
 * 技術分類枚舉
 * 定義支援的技術類型
 */
export enum TechnologyCategory {
  GOLANG = 'Golang',
  RUST = 'Rust',
  FLUTTER = 'Flutter',
  ANGULAR = 'Angular',
  AI = 'AI',
  GEMINI = 'Gemini',
  SYSTEM_DESIGN = 'System Design',
  POSTGRES = 'PostgreSQL',
}

/**
 * 文檔狀態枚舉
 * 表示文檔在知識庫中的狀態
 */
export enum DocumentStatus {
  ACTIVE = 'active',       // 啟用中
  ARCHIVED = 'archived',   // 已封存
  DRAFT = 'draft',         // 草稿
  PROCESSING = 'processing' // 處理中（向量化）
}

/**
 * 文檔來源枚舉
 * 定義文檔可能的來源
 */
export enum DocumentSource {
  NOTION = 'Notion',
  GOOGLE_DOCS = 'Google Docs',
  GITHUB = 'GitHub',
  OBSIDIAN = 'Obsidian',
  WEB_ARTICLE = 'Web Article',
  MARKDOWN = 'Markdown File',
  PDF = 'PDF',
  MANUAL = 'Manual Input',
}

/**
 * 來源元資料介面
 * 儲存特定來源的額外資訊
 */
export interface SourceMetadata {
  /** GitHub repo 名稱 (GitHub 專用) */
  repoName?: string;

  /** GitHub 檔案路徑 (GitHub 專用) */
  filePath?: string;

  /** Notion page ID (Notion 專用) */
  notionPageId?: string;

  /** Notion database ID (Notion 專用) */
  notionDatabaseId?: string;

  /** Google Docs document ID (Google Docs 專用) */
  googleDocsId?: string;

  /** 最後同步時間 */
  lastSynced?: Date;

  /** 同步狀態 */
  syncStatus?: 'synced' | 'pending' | 'failed';

  /** 原始 URL */
  originalUrl?: string;
}

/**
 * 文檔介面
 * 代表知識庫中的一份技術文檔
 */
export interface Document {
  /** 文檔唯一識別碼 */
  id: string;

  /** 文檔標題 */
  title: string;

  /** 文檔內容 */
  content: string;

  /** 文檔摘要 */
  summary: string;

  /** 技術分類 */
  category: TechnologyCategory;

  /** 標籤列表 */
  tags: string[];

  /** 向量嵌入 ID（關聯到 Embedding） */
  embeddingId?: string;

  /** 文檔狀態 */
  status: DocumentStatus;

  /** 建立時間 */
  createdAt: Date;

  /** 最後更新時間 */
  updatedAt: Date;

  /** 文檔來源 */
  source: DocumentSource;

  /** 來源 URL */
  sourceUrl?: string;

  /** 來源元資料 */
  sourceMetadata?: SourceMetadata;

  /** 檢視次數 */
  viewCount: number;

  /** 相關性分數（搜尋時使用） */
  relevanceScore?: number;

  /** 文檔大小（字元數） */
  size: number;

  /** 語言 */
  language: 'zh-TW' | 'en' | 'ja';
}

/**
 * 文檔建立請求介面
 * 用於建立新文檔時的資料傳遞
 */
export interface CreateDocumentRequest {
  title: string;
  content: string;
  category: TechnologyCategory;
  tags: string[];
  source: DocumentSource;
  sourceUrl?: string;
  language?: 'zh-TW' | 'en' | 'ja';
}

/**
 * 文檔更新請求介面
 * 用於更新現有文檔
 */
export interface UpdateDocumentRequest {
  id: string;
  title?: string;
  content?: string;
  category?: TechnologyCategory;
  tags?: string[];
  status?: DocumentStatus;
}
