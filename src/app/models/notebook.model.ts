/**
 * Notebook 筆記本模型
 *
 * 用於組織和分組文檔的容器
 * 靈感來自 NotebookLM 的 Notebooks 概念
 */

/**
 * Notebook 介面
 */
export interface Notebook {
  /** 唯一識別碼 */
  id: string;

  /** 筆記本名稱 */
  name: string;

  /** 描述 */
  description?: string;

  /** 顏色標記（十六進制） */
  color?: string;

  /** 圖示名稱（Material Icons） */
  icon?: string;

  /** 文檔 ID 列表 */
  documentIds: string[];

  /** 是否為預設筆記本 */
  isDefault?: boolean;

  /** 建立時間 */
  createdAt: Date;

  /** 最後更新時間 */
  updatedAt: Date;
}

/**
 * 建立 Notebook 的參數
 */
export interface CreateNotebookParams {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

/**
 * 更新 Notebook 的參數
 */
export interface UpdateNotebookParams {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}
