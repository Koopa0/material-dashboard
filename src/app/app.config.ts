/**
 * Angular v20 應用程式配置
 *
 * 包含：
 * - HTTP 客戶端（使用 Fetch API）
 * - Zone.js 優化
 * - Router 配置（啟用 View Transitions）
 * - 客戶端 Hydration
 * - 動畫支援
 * - 全局錯誤處理
 */
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection, ErrorHandler } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { GlobalErrorHandler } from './services/global-error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    /**
     * 啟用 View Transitions API
     * 提供流暢的頁面切換動畫（Gemini 風格）
     */
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true,  // 跳過首次載入的轉場
      })
    ),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    /**
     * 全局錯誤處理器（Angular v20 最佳實踐）
     * 捕獲並記錄所有未處理的錯誤
     */
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ]
};
