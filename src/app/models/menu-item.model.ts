/**
 * RAG 知識庫 - 選單項目模型
 *
 * 此檔案定義了側邊欄選單項目的資料結構
 */

/**
 * 選單項目介面
 */
export interface MenuItem {
  /** 選單項目圖示（Material Icon 名稱） */
  icon: string;

  /** 選單項目標籤文字 */
  label: string;

  /** 路由路徑 */
  route?: string;

  /** 子選單項目 */
  subItems?: MenuItem[];

  /** 是否展開子選單 */
  expanded?: boolean;

  /** 是否啟用 */
  disabled?: boolean;

  /** 徽章文字（如：新功能、數量等） */
  badge?: string;

  /** 徽章顏色 */
  badgeColor?: 'primary' | 'accent' | 'warn';
}
