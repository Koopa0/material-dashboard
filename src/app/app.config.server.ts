/**
 * Angular v20 伺服器端配置
 *
 * 此檔案定義了 Angular 應用程式的伺服器端渲染 (SSR) 配置
 * Angular v20 最佳實踐：使用 provideServerRendering() 啟用 SSR
 *
 * @see https://angular.dev/guide/ssr
 */
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

/**
 * 伺服器端配置物件
 *
 * 提供伺服器端渲染所需的服務
 * Angular v20 支援混合渲染（Hybrid Rendering）：
 * - SSR: 伺服器端渲染
 * - SSG: 靜態網站生成（Pre-rendering）
 * - CSR: 客戶端渲染
 */
const serverConfig: ApplicationConfig = {
  providers: [
    /**
     * 啟用伺服器端渲染
     * 這將啟用 Angular Universal 的所有功能
     */
    provideServerRendering(),
  ],
};

/**
 * 匯出合併後的應用程式配置
 *
 * 將客戶端配置與伺服器端配置合併
 * mergeApplicationConfig 確保配置正確合併，不會覆蓋重要設定
 */
export const config = mergeApplicationConfig(appConfig, serverConfig);
