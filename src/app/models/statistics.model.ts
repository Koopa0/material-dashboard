/**
 * RAG 知識庫 - 統計數據模型
 *
 * 此檔案定義了Dashboard統計數據的資料結構
 * 用於顯示知識庫的各種統計資訊
 */

import { TechnologyCategory } from './document.model';

/**
 * 知識庫總覽統計
 */
export interface KnowledgeBaseStats {
  /** 總文檔數 */
  totalDocuments: number;

  /** 今日新增文檔數 */
  documentsAddedToday: number;

  /** 總儲存空間（字元數） */
  totalStorage: number;

  /** 總檢視次數 */
  totalViews: number;

  /** 本週檢視次數 */
  viewsThisWeek: number;

  /** 總查詢次數 */
  totalQueries: number;

  /** 今日查詢次數 */
  queriesToday: number;

  /** 平均查詢延遲（毫秒） */
  avgQueryLatency: number;

  /** 最後更新時間 */
  lastUpdated: Date;
}

/**
 * 分類統計介面
 */
export interface CategoryStats {
  /** 技術分類 */
  category: TechnologyCategory;

  /** 文檔數量 */
  documentCount: number;

  /** 百分比 */
  percentage: number;

  /** 平均檢視次數 */
  avgViews: number;

  /** 顏色（用於圖表） */
  color?: string;
}

/**
 * 時間序列數據點
 * 用於趨勢圖表
 */
export interface TimeSeriesDataPoint {
  /** 日期 */
  date: Date;

  /** 數值 */
  value: number;

  /** 標籤（可選） */
  label?: string;
}

/**
 * 查詢統計
 */
export interface QueryStatistics {
  /** 總查詢數 */
  total: number;

  /** 成功查詢數（有結果） */
  successful: number;

  /** 失敗查詢數（無結果） */
  failed: number;

  /** 成功率 */
  successRate: number;

  /** 平均延遲（毫秒） */
  avgLatency: number;

  /** 最大延遲（毫秒） */
  maxLatency: number;

  /** 最小延遲（毫秒） */
  minLatency: number;

  /** 查詢趨勢（過去 7 天） */
  trend: TimeSeriesDataPoint[];
}

/**
 * 儲存空間統計
 */
export interface StorageStats {
  /** 已使用空間（字元數） */
  used: number;

  /** 總容量（字元數） */
  total: number;

  /** 使用百分比 */
  percentage: number;

  /** 各分類使用量 */
  byCategory: {
    category: TechnologyCategory;
    size: number;
  }[];
}

/**
 * Dashboard 小工具資料介面
 * 用於 Dashboard 卡片顯示
 */
export interface DashboardWidget {
  /** 標題 */
  title: string;

  /** 主要數值 */
  value: number | string;

  /** 單位 */
  unit?: string;

  /** 變化百分比 */
  change?: number;

  /** 變化方向 */
  trend?: 'up' | 'down' | 'stable';

  /** 圖示名稱（Material Icon） */
  icon: string;

  /** 圖示顏色 */
  iconColor: string;
}
