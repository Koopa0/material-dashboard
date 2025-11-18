/**
 * 主題服務
 *
 * 管理應用程式的深淺主題切換
 * 使用 Gemini 風格的配色方案與漸層色彩
 *
 * Angular v20 最佳實踐：
 * - 使用 Signals 管理主題狀態
 * - 使用 effect() 處理副作用（DOM 操作）
 * - 使用 localStorage 持久化主題選擇
 *
 * Gemini 配色方案：
 * - 淺色主題：白色背景 + 漸層紫藍色強調
 * - 深色主題：True-black (#000000) + 霓虹色強調
 * - 漸層色彩：紫色 → 粉色 → 藍色
 */
import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * 主題類型
 */
export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  /**
   * 平台 ID（用於檢查是否為瀏覽器環境）
   */
  private platformId = inject(PLATFORM_ID);

  /**
   * 當前主題 Signal
   * 預設為淺色主題，或從 localStorage 讀取
   */
  private currentThemeSignal = signal<Theme>(this.getInitialTheme());

  /**
   * 唯讀主題 Signal（對外暴露）
   */
  readonly theme = this.currentThemeSignal.asReadonly();

  /**
   * 是否為深色主題
   */
  readonly isDark = () => this.theme() === 'dark';

  /**
   * 建構函數
   * 初始化主題並設置 effect 監聽主題變化
   */
  constructor() {
    // 使用 effect 監聽主題變化並更新 DOM
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const theme = this.theme();
        this.applyTheme(theme);
        this.saveTheme(theme);
      }
    });

    // 初始化時應用主題
    if (isPlatformBrowser(this.platformId)) {
      this.applyTheme(this.theme());
    }
  }

  /**
   * 取得初始主題
   * 優先從 localStorage 讀取，否則使用系統偏好，最後預設為淺色
   */
  private getInitialTheme(): Theme {
    if (!isPlatformBrowser(this.platformId)) {
      return 'light';
    }

    // 1. 嘗試從 localStorage 讀取
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    // 2. 檢查系統偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // 3. 預設為淺色
    return 'light';
  }

  /**
   * 切換主題
   * 在淺色與深色之間切換
   */
  toggleTheme(): void {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.currentThemeSignal.set(newTheme);
  }

  /**
   * 設定特定主題
   * @param theme - 要設定的主題
   */
  setTheme(theme: Theme): void {
    this.currentThemeSignal.set(theme);
  }

  /**
   * 應用主題到 DOM
   * 更新 document.body 的 class 和 data-theme 屬性
   *
   * @param theme - 要應用的主題
   */
  private applyTheme(theme: Theme): void {
    const body = document.body;

    // 移除所有主題 class
    body.classList.remove('light-theme', 'dark-theme');

    // 加入新主題 class
    body.classList.add(`${theme}-theme`);

    // 設定 data-theme 屬性（用於 CSS 變數）
    body.setAttribute('data-theme', theme);

    // 更新 meta theme-color（移動端瀏覽器狀態列顏色）
    this.updateMetaThemeColor(theme);
  }

  /**
   * 更新 meta theme-color
   * 讓移動端瀏覽器的狀態列顏色與主題一致
   *
   * @param theme - 當前主題
   */
  private updateMetaThemeColor(theme: Theme): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const color = theme === 'dark' ? '#000000' : '#ffffff';
      metaThemeColor.setAttribute('content', color);
    }
  }

  /**
   * 儲存主題到 localStorage
   * @param theme - 要儲存的主題
   */
  private saveTheme(theme: Theme): void {
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  /**
   * 取得主題對應的顏色
   * 用於圖表等需要動態顏色的場景
   */
  getThemeColors() {
    const theme = this.theme();
    return {
      // 主要顏色
      primary: theme === 'dark' ? '#a78bfa' : '#8b5cf6',  // Gemini 紫色
      secondary: theme === 'dark' ? '#f472b6' : '#ec4899', // Gemini 粉色
      tertiary: theme === 'dark' ? '#60a5fa' : '#3b82f6',  // Gemini 藍色

      // 背景顏色
      background: theme === 'dark' ? '#000000' : '#ffffff',
      surface: theme === 'dark' ? '#1a1a1a' : '#f8fafc',

      // 文字顏色
      onBackground: theme === 'dark' ? '#ffffff' : '#1e293b',
      onSurface: theme === 'dark' ? '#e2e8f0' : '#334155',

      // 邊框顏色
      border: theme === 'dark' ? '#2d2d2d' : '#e2e8f0',

      // 漸層色彩（Gemini 經典漸層）
      gradient: theme === 'dark'
        ? 'linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #60a5fa 100%)'
        : 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #3b82f6 100%)',
    };
  }
}
