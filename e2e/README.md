# E2E 測試文檔

使用 Playwright 建立的端到端測試套件，涵蓋應用程式的關鍵使用者流程。

## 📁 測試文件

```
e2e/
├── theme-toggle.spec.ts       # 主題切換功能測試
├── document-search.spec.ts    # 文檔搜尋功能測試
├── notebook-management.spec.ts # Notebook 管理功能測試
└── ai-chat.spec.ts            # AI 聊天功能測試
```

---

## 🧪 測試範圍

### 1. **主題切換測試** (`theme-toggle.spec.ts`)

測試項目：
- ✅ 顯示主題切換按鈕
- ✅ 切換到深色主題
- ✅ 切換回淺色主題
- ✅ localStorage 持久化
- ✅ 重新載入保持主題
- ✅ 深色/淺色背景顏色驗證
- ✅ Gemini 配色方案

### 2. **文檔搜尋測試** (`document-search.spec.ts`)

測試項目：
- ✅ 顯示搜尋欄位
- ✅ 輸入搜尋文字
- ✅ 顯示搜尋結果
- ✅ 清除搜尋
- ✅ 關鍵字高亮顯示
- ✅ 點擊結果導航
- ✅ 空搜尋處理
- ✅ 無結果空狀態
- ✅ 搜尋效能驗證
- ✅ 中文搜尋支援

### 3. **Notebook 管理測試** (`notebook-management.spec.ts`)

測試項目：
- ✅ 顯示 Notebooks 選單
- ✅ 展開子選單
- ✅ 顯示預設 Notebooks
- ✅ 點擊查看詳情
- ✅ 顯示文檔列表
- ✅ 開啟建立對話框
- ✅ 輸入 Notebook 名稱
- ✅ 將文檔加入 Notebook
- ✅ 顯示文檔數量
- ✅ 空狀態處理

### 4. **AI 聊天測試** (`ai-chat.spec.ts`)

測試項目：
- ✅ 顯示 AI 聊天按鈕
- ✅ 開啟聊天介面
- ✅ 顯示輸入框
- ✅ 輸入問題
- ✅ 發送訊息
- ✅ 接收 AI 回應
- ✅ 顯示聊天歷史
- ✅ 清除歷史
- ✅ 引用標記（Citations）
- ✅ 關閉聊天介面
- ✅ Demo 模式提示

---

## 🚀 運行測試

### 前置條件

```bash
# 安裝依賴
npm install

# 安裝 Playwright 瀏覽器
npx playwright install
```

### 運行所有測試

```bash
# 執行所有 E2E 測試（Headless 模式）
npm run test:e2e

# 使用 UI 模式（推薦，可視化執行）
npm run test:e2e:ui

# 顯示瀏覽器視窗（Headed 模式）
npm run test:e2e:headed

# 只在 Chromium 執行
npm run test:e2e:chromium
```

### 查看測試報告

```bash
# 開啟 HTML 報告
npm run test:e2e:report
```

---

## 🎯 測試策略

### 瀏覽器支援

測試在以下瀏覽器執行：
- ✅ Chromium (Desktop)
- ✅ Firefox (Desktop)
- ✅ WebKit/Safari (Desktop)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

### 重試機制

- **本地開發**: 失敗不重試
- **CI 環境**: 失敗自動重試 2 次

### 超時設定

- **測試超時**: 30 秒
- **期望超時**: 5 秒
- **開發伺服器啟動**: 120 秒

---

## 📝 撰寫新測試

### 測試文件模板

```typescript
import { test, expect } from '@playwright/test';

test.describe('功能名稱', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('應該做某件事', async ({ page }) => {
    // 1. 操作
    const button = page.locator('button');
    await button.click();

    // 2. 驗證
    await expect(button).toBeVisible();
  });
});
```

### 最佳實踐

1. **使用語意化選擇器**
   ```typescript
   // ✅ 好的
   page.locator('button[aria-label="關閉"]')
   page.locator('text=登入')

   // ❌ 避免
   page.locator('.btn-123')
   ```

2. **等待適當時機**
   ```typescript
   // 等待網路閒置
   await page.waitForLoadState('networkidle');

   // 等待元素可見
   await expect(element).toBeVisible();
   ```

3. **獨立的測試**
   - 每個測試應該獨立運行
   - 使用 `beforeEach` 重置狀態
   - 不依賴其他測試的結果

---

## 🐛 除錯技巧

### 使用 UI 模式

```bash
npm run test:e2e:ui
```

UI 模式提供：
- ⏯️ 逐步執行測試
- 📸 即時截圖
- 🔍 DOM 檢查器
- ⏱️ 時間軸回放

### 顯示瀏覽器

```bash
npm run test:e2e:headed
```

### 使用 Playwright Inspector

```bash
npx playwright test --debug
```

### 查看追蹤記錄

失敗的測試會自動保存：
- 📸 截圖
- 🎬 影片
- 📊 追蹤記錄

---

## 🔧 配置

測試配置位於 `playwright.config.ts`：

```typescript
{
  testDir: './e2e',              // 測試目錄
  timeout: 30000,                // 測試超時
  retries: 0,                    // 本地不重試
  workers: undefined,            // 並行數量
  reporter: ['html', 'list'],    // 報告格式
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  }
}
```

---

## 📊 測試統計

```
測試文件：4 個
測試案例：~40 個
瀏覽器：5 種
覆蓋功能：主題、搜尋、Notebook、AI
```

---

## 🚨 常見問題

### Q: 測試失敗怎麼辦？

1. 檢查應用程式是否正在運行（`npm start`）
2. 查看測試報告（`npm run test:e2e:report`）
3. 使用 UI 模式除錯（`npm run test:e2e:ui`）

### Q: 測試太慢？

```bash
# 只在 Chromium 執行（最快）
npm run test:e2e:chromium

# 增加並行 worker 數量（編輯 playwright.config.ts）
workers: 4
```

### Q: 元素找不到？

- 增加等待時間：`await page.waitForTimeout(500)`
- 檢查選擇器是否正確
- 確認元素在 DOM 中存在

---

## 📚 資源

- [Playwright 官方文檔](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
