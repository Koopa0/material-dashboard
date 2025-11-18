/**
 * 複製編譯後的檔案到 Cloudflare Pages 發布目錄
 *
 * 因為已移除 SSR 配置，只需要複製客戶端靜態檔案
 */
import fs from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(import.meta.url), "../../");
const client = resolve(root, "dist/browser");
const cloudflare = resolve(root, "dist/cloudflare");

// 檢查客戶端目錄是否存在
if (!fs.existsSync(client)) {
  console.error('錯誤：dist/browser 目錄不存在。請先執行 build。');
  process.exit(1);
}

// 如果 cloudflare 目錄存在，先刪除
if (fs.existsSync(cloudflare)) {
  fs.rmSync(cloudflare, { recursive: true });
}

// 複製客戶端檔案到 cloudflare 目錄
fs.cpSync(client, cloudflare, { recursive: true });

console.log('✓ 檔案已成功複製到 dist/cloudflare');

