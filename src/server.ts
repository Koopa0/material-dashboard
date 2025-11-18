/**
 * Angular v20 伺服器進入點
 *
 * 此檔案為 Angular Universal SSR 的伺服器端進入點
 * 使用 AngularAppEngine 處理伺服器端渲染請求
 *
 * Angular v20 最佳實踐：
 * - 使用 AngularAppEngine 進行 SSR
 * - 支援 Cloudflare Workers / Pages
 * - 支援混合渲染模式
 *
 * @see https://angular.dev/guide/ssr
 */
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

/**
 * Angular 應用程式引擎實例
 *
 * AngularAppEngine 負責：
 * - 處理 SSR 請求
 * - 管理應用程式狀態
 * - 處理路由
 * - 執行預渲染（Pre-rendering）
 */
const angularApp = new AngularAppEngine();

/**
 * 請求處理器
 *
 * 此處理器由 Angular CLI 使用（dev-server 和 build 過程）
 * 也用於 Cloudflare Workers/Pages 部署
 *
 * @param req - HTTP 請求物件
 * @returns HTTP 回應物件
 */
export const reqHandler = createRequestHandler(async (req) => {
  /**
   * 使用 AngularAppEngine 處理請求
   * 如果路由存在，將執行 SSR
   * 如果路由不存在，返回 404
   */
  const res = await angularApp.handle(req);

  /**
   * 如果 Angular 無法處理請求（例如：找不到路由）
   * 返回 404 回應
   */
  return res ?? new Response('Page not found.', { status: 404 });
});

/**
 * 預設匯出用於 Cloudflare Workers
 *
 * Cloudflare Workers 需要 fetch 處理器
 * 這使得應用程式可以直接部署到 Cloudflare Pages
 */
export default { fetch: reqHandler };
