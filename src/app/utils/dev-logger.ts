import { isDevMode } from '@angular/core';

/**
 * 開發環境專用日誌工具（Angular v20 最佳實踐）
 *
 * 功能：
 * - 只在開發模式下輸出日誌
 * - 生產環境自動靜默
 * - 支援所有 console 方法（log, error, warn, info, debug）
 * - 保持原始 console API 的使用方式
 *
 * @example
 * ```typescript
 * import { devLog } from '@/utils/dev-logger';
 *
 * // 只在開發環境輸出
 * devLog.log('調試訊息');
 * devLog.error('錯誤訊息');
 * devLog.warn('警告訊息');
 * ```
 */
export const devLog = {
  /**
   * 開發環境日誌（一般訊息）
   *
   * @param args 日誌參數
   */
  log: (...args: unknown[]): void => {
    if (isDevMode()) {
      console.log(...args);
    }
  },

  /**
   * 開發環境日誌（錯誤訊息）
   *
   * @param args 日誌參數
   */
  error: (...args: unknown[]): void => {
    if (isDevMode()) {
      console.error(...args);
    }
  },

  /**
   * 開發環境日誌（警告訊息）
   *
   * @param args 日誌參數
   */
  warn: (...args: unknown[]): void => {
    if (isDevMode()) {
      console.warn(...args);
    }
  },

  /**
   * 開發環境日誌（資訊訊息）
   *
   * @param args 日誌參數
   */
  info: (...args: unknown[]): void => {
    if (isDevMode()) {
      console.info(...args);
    }
  },

  /**
   * 開發環境日誌（除錯訊息）
   *
   * @param args 日誌參數
   */
  debug: (...args: unknown[]): void => {
    if (isDevMode()) {
      console.debug(...args);
    }
  },

  /**
   * 開發環境群組日誌（開始）
   *
   * @param label 群組標籤
   */
  group: (label?: string): void => {
    if (isDevMode()) {
      console.group(label);
    }
  },

  /**
   * 開發環境群組日誌（結束）
   */
  groupEnd: (): void => {
    if (isDevMode()) {
      console.groupEnd();
    }
  },
};
