import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Storage 服務（Angular v20 最佳實踐）
 * 提供 SSR 安全的 localStorage 操作
 *
 * 特點：
 * - 自動檢測平台環境（Browser/Server）
 * - SSR 環境下安全地返回 null
 * - 統一的錯誤處理
 * - TypeScript 類型安全
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private platformId = inject(PLATFORM_ID);

  /**
   * 檢查是否在瀏覽器環境
   */
  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * 保存資料到 localStorage（SSR 安全）
   *
   * @param key 儲存鍵名
   * @param data 要儲存的資料
   * @returns 是否成功儲存
   */
  set<T>(key: string, data: T): boolean {
    if (!this.isBrowser) {
      return false;
    }

    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Failed to save to localStorage [${key}]:`, error);
      return false;
    }
  }

  /**
   * 從 localStorage 讀取資料（SSR 安全）
   *
   * @param key 儲存鍵名
   * @returns 解析後的資料或 null
   */
  get<T>(key: string): T | null {
    if (!this.isBrowser) {
      return null;
    }

    try {
      const serialized = localStorage.getItem(key);
      if (serialized === null) {
        return null;
      }
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error(`Failed to load from localStorage [${key}]:`, error);
      return null;
    }
  }

  /**
   * 保存字串到 localStorage（SSR 安全）
   *
   * @param key 儲存鍵名
   * @param value 字串值
   * @returns 是否成功儲存
   */
  setString(key: string, value: string): boolean {
    if (!this.isBrowser) {
      return false;
    }

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Failed to save string to localStorage [${key}]:`, error);
      return false;
    }
  }

  /**
   * 從 localStorage 讀取字串（SSR 安全）
   *
   * @param key 儲存鍵名
   * @returns 字串值或 null
   */
  getString(key: string): string | null {
    if (!this.isBrowser) {
      return null;
    }

    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to load string from localStorage [${key}]:`, error);
      return null;
    }
  }

  /**
   * 從 localStorage 刪除資料（SSR 安全）
   *
   * @param key 儲存鍵名
   * @returns 是否成功刪除
   */
  remove(key: string): boolean {
    if (!this.isBrowser) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove from localStorage [${key}]:`, error);
      return false;
    }
  }

  /**
   * 清空所有 localStorage 資料（SSR 安全）
   *
   * @returns 是否成功清空
   */
  clear(): boolean {
    if (!this.isBrowser) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }

  /**
   * 檢查 key 是否存在（SSR 安全）
   *
   * @param key 儲存鍵名
   * @returns 是否存在
   */
  has(key: string): boolean {
    if (!this.isBrowser) {
      return false;
    }

    return localStorage.getItem(key) !== null;
  }
}
