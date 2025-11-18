/**
 * 複製客戶端檔案到 Cloudflare Pages 發布目錄（CSR 模式）
 *
 * Angular v20 + Cloudflare Pages 部署腳本（僅客戶端渲染）
 *
 * 此腳本處理：
 * - 複製客戶端檔案（browser）到 Cloudflare Pages 目錄
 * - 不包含 SSR 功能（因 Cloudflare Workers 對 Node.js SSR 支援有限）
 *
 * 注意：
 * Angular v20 的 SSR 使用 Node.js API（如 createRequire）
 * 這些 API 在 Cloudflare Workers 環境中尚未完全支援
 * 因此 Cloudflare 部署使用純客戶端渲染（CSR）模式
 *
 * @see https://angular.dev/guide/ssr
 * @see https://developers.cloudflare.com/pages/
 */
import fs from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ==================== 路徑定義 ====================

const root = resolve(fileURLToPath(import.meta.url), "../../");
const client = resolve(root, "dist/browser");
const cloudflare = resolve(root, "dist/cloudflare");

// ==================== 錯誤檢查 ====================

/**
 * 檢查客戶端目錄是否存在
 */
if (!fs.existsSync(client)) {
  console.error('❌ 錯誤：dist/browser 目錄不存在。');
  console.error('   請先執行: npm run build');
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

console.log('📦 開始複製檔案（CSR 模式）...');

/**
 * 複製客戶端檔案到 cloudflare 目錄
 * 這些是靜態資產（HTML, CSS, JS等）
 */
console.log('   → 複製客戶端檔案...');
fs.cpSync(client, cloudflare, { recursive: true });

// ==================== 完成 ====================

console.log('\n✅ Cloudflare Pages 部署檔案已準備完成（CSR 模式）！');
console.log('\n📂 輸出目錄結構：');
console.log('   dist/cloudflare/  - 客戶端靜態檔案');
console.log('\n📝 部署模式：');
console.log('   - 客戶端渲染（CSR）');
console.log('   - 所有頁面在瀏覽器中動態渲染');
console.log('   - 適合 Cloudflare Pages 靜態託管');
console.log('\n🚀 下一步：');
console.log('   - 本地預覽: npm run preview:cloudflare');
console.log('   - 部署: npm run deploy');
console.log('   - 手動部署: wrangler pages deploy dist/cloudflare\n');
