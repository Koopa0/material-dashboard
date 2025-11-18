/**
 * 複製編譯後的檔案到 Cloudflare Pages 發布目錄
 *
 * Angular v20 SSR + Cloudflare Pages 部署腳本
 *
 * 此腳本處理：
 * - 複製客戶端檔案（browser）
 * - 複製伺服器端檔案（server）
 * - 準備 Cloudflare Workers 所需的結構
 *
 * @see https://angular.dev/guide/ssr
 * @see https://developers.cloudflare.com/pages/
 */
import fs from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ==================== 路徑定義 ====================

const root = resolve(fileURLToPath(import.meta.url), "../../");
const client = resolve(root, "dist/browser");
const server = resolve(root, "dist/server");
const cloudflare = resolve(root, "dist/cloudflare");
const worker = resolve(cloudflare, "_worker.js");

// ==================== 錯誤檢查 ====================

/**
 * 檢查客戶端目錄是否存在
 */
if (!fs.existsSync(client)) {
  console.error('❌ 錯誤：dist/browser 目錄不存在。');
  console.error('   請先執行: npm run build');
  process.exit(1);
}

/**
 * 檢查伺服器端目錄是否存在
 * SSR 模式下必須存在
 */
if (!fs.existsSync(server)) {
  console.error('❌ 錯誤：dist/server 目錄不存在。');
  console.error('   請確認 angular.json 中已啟用 SSR 配置');
  process.exit(1);
}

// ==================== 清理舊檔案 ====================

/**
 * 如果 cloudflare 目錄存在，先刪除
 * 確保每次都是乾淨的建置
 */
if (fs.existsSync(cloudflare)) {
  console.log('🧹 清理舊的 dist/cloudflare 目錄...');
  fs.rmSync(cloudflare, { recursive: true });
}

// ==================== 複製檔案 ====================

console.log('📦 開始複製檔案...');

/**
 * 1. 複製客戶端檔案到 cloudflare 目錄
 * 這些是靜態資產（HTML, CSS, JS等）
 */
console.log('   → 複製客戶端檔案...');
fs.cpSync(client, cloudflare, { recursive: true });

/**
 * 2. 複製伺服器端檔案到 _worker.js 目錄
 * Cloudflare Workers 會從這裡載入 SSR 程式碼
 */
console.log('   → 複製伺服器端檔案...');
fs.cpSync(server, worker, { recursive: true });

/**
 * 3. 重新命名伺服器進入點
 * Cloudflare Workers 需要 index.js 作為進入點
 */
console.log('   → 設定 Cloudflare Workers 進入點...');
const serverEntry = join(worker, "server.mjs");
const workerEntry = join(worker, "index.js");

if (fs.existsSync(serverEntry)) {
  fs.renameSync(serverEntry, workerEntry);
}

// ==================== 完成 ====================

console.log('\n✅ Cloudflare Pages 部署檔案已準備完成！');
console.log('\n📂 輸出目錄結構：');
console.log('   dist/cloudflare/          - 客戶端靜態檔案');
console.log('   dist/cloudflare/_worker.js/   - SSR Workers 程式碼');
console.log('\n🚀 下一步：');
console.log('   - 本地測試: npm run serve:ssr');
console.log('   - 部署: npm run deploy');
console.log('   - 使用 Wrangler: wrangler pages dev dist/cloudflare\n');
