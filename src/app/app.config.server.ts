/**
 * Angular v20 伺服器端配置
 *
 * 此檔案定義了 Angular 應用程式的伺服器端渲染 (SSR) 配置
 * 在 Angular v20 中，provideServerRoutesConfig 已被移除
 */
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

/**
 * 伺服器端配置物件
 * 提供伺服器端渲染所需的服務
 */
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(), // 啟用伺服器端渲染
  ]
};

/**
 * 匯出合併後的應用程式配置
 * 將客戶端配置與伺服器端配置合併
 */
export const config = mergeApplicationConfig(appConfig, serverConfig);
