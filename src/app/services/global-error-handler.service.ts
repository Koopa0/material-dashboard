import { ErrorHandler, Injectable, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

/**
 * 全局錯誤處理器（Angular v20 最佳實踐）
 *
 * 功能：
 * - 捕獲所有未處理的應用程式錯誤
 * - 記錄錯誤到控制台（開發模式）
 * - 可擴展為發送到錯誤追蹤服務（如 Sentry）
 * - 提供用戶友好的錯誤訊息
 * - SSR 安全
 *
 * @example
 * ```typescript
 * // 在 app.config.ts 中配置
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     { provide: ErrorHandler, useClass: GlobalErrorHandler },
 *   ],
 * };
 * ```
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private platformId = inject(PLATFORM_ID);

  /**
   * 處理錯誤
   *
   * @param error 發生的錯誤
   */
  handleError(error: Error | unknown): void {
    // 只在瀏覽器環境中處理
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // 解析錯誤訊息
    const errorMessage = this.getErrorMessage(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    // 記錄到控制台（開發模式）
    if (this.isDevelopment()) {
      console.group('🚨 全局錯誤處理器');
      console.error('錯誤訊息:', errorMessage);
      if (errorStack) {
        console.error('堆疊追蹤:', errorStack);
      }
      console.error('完整錯誤物件:', error);
      console.groupEnd();
    } else {
      // 生產模式：只記錄簡單訊息
      console.error('應用程式錯誤:', errorMessage);
    }

    // TODO: 在生產環境中，可以將錯誤發送到錯誤追蹤服務
    // this.sendToErrorTrackingService(error);

    // TODO: 顯示用戶友好的錯誤訊息（使用 MatSnackBar）
    // this.showUserFriendlyMessage();
  }

  /**
   * 提取錯誤訊息
   *
   * @param error 錯誤物件
   * @returns 錯誤訊息字串
   */
  private getErrorMessage(error: Error | unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }

    return '發生未知錯誤';
  }

  /**
   * 檢查是否為開發環境
   *
   * @returns 是否為開發環境
   */
  private isDevelopment(): boolean {
    // Angular 會在建置時替換 isDevMode
    return !this.isProduction();
  }

  /**
   * 檢查是否為生產環境
   *
   * @returns 是否為生產環境
   */
  private isProduction(): boolean {
    // 可以從環境變數或建置配置中讀取
    return typeof window !== 'undefined' &&
           (window as any).__PRODUCTION__ === true;
  }

  /**
   * 發送錯誤到追蹤服務（預留擴展）
   *
   * @param error 錯誤物件
   */
  private sendToErrorTrackingService(error: Error | unknown): void {
    // 可以整合 Sentry、LogRocket 等服務
    // Example:
    // Sentry.captureException(error);
  }

  /**
   * 顯示用戶友好的錯誤訊息（預留擴展）
   */
  private showUserFriendlyMessage(): void {
    // 可以使用 MatSnackBar 顯示訊息
    // Example:
    // this.snackBar.open(
    //   '抱歉，發生了一個錯誤。我們正在處理中。',
    //   '關閉',
    //   { duration: 5000 }
    // );
  }
}
