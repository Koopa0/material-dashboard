/**
 * Notebook 筆記本模型
 *
 * 用於組織和分組文檔的容器
 * 靈感來自 NotebookLM 的 Notebooks 概念
 */

/** Notebook 顏色主題 */
export enum NotebookColor {
  BLUE = 'blue',
  GREEN = 'green',
  PURPLE = 'purple',
  ORANGE = 'orange',
  RED = 'red',
  PINK = 'pink',
  TEAL = 'teal',
  YELLOW = 'yellow',
}

/** Notebook 圖示 */
export enum NotebookIcon {
  BOOK = 'auto_stories',
  FOLDER = 'folder',
  STAR = 'star',
  BOOKMARK = 'bookmark',
  LABEL = 'label',
  WORK = 'work',
  SCHOOL = 'school',
  CODE = 'code',
  SCIENCE = 'science',
  LIGHTBULB = 'lightbulb',
}

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

  /** 顏色標記 */
  color: NotebookColor;

  /** 圖示名稱（Material Icons） */
  icon: NotebookIcon;

  /** 文檔 ID 列表 */
  documentIds: string[];

  /** 是否為預設筆記本 */
  isDefault?: boolean;

  /** 建立時間 */
  createdAt: Date;

  /** 最後更新時間 */
  updatedAt: Date;
}

/** 顏色主題對應的 CSS 值 */
export const NotebookColorMap: Record<NotebookColor, string> = {
  [NotebookColor.BLUE]: '#2196F3',
  [NotebookColor.GREEN]: '#4CAF50',
  [NotebookColor.PURPLE]: '#9C27B0',
  [NotebookColor.ORANGE]: '#FF9800',
  [NotebookColor.RED]: '#F44336',
  [NotebookColor.PINK]: '#E91E63',
  [NotebookColor.TEAL]: '#009688',
  [NotebookColor.YELLOW]: '#FFC107',
};

/** 圖示顯示名稱 */
export const NotebookIconLabel: Record<NotebookIcon, string> = {
  [NotebookIcon.BOOK]: '書本',
  [NotebookIcon.FOLDER]: '資料夾',
  [NotebookIcon.STAR]: '星星',
  [NotebookIcon.BOOKMARK]: '書籤',
  [NotebookIcon.LABEL]: '標籤',
  [NotebookIcon.WORK]: '工作',
  [NotebookIcon.SCHOOL]: '學習',
  [NotebookIcon.CODE]: '程式碼',
  [NotebookIcon.SCIENCE]: '科學',
  [NotebookIcon.LIGHTBULB]: '想法',
};

/**
 * 建立 Notebook 的參數
 */
export interface CreateNotebookParams {
  name: string;
  description?: string;
  color?: NotebookColor;
  icon?: NotebookIcon;
}

/**
 * 更新 Notebook 的參數
 */
export interface UpdateNotebookParams {
  name?: string;
  description?: string;
  color?: NotebookColor;
  icon?: NotebookIcon;
}
