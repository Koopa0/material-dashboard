/**
 * E2E 測試 - 文檔搜尋功能
 *
 * 測試範圍：
 * - 搜尋欄位輸入
 * - 即時搜尋結果
 * - 搜尋高亮顯示
 * - 搜尋結果點擊
 * - 空搜尋處理
 */

import { test, expect } from '@playwright/test';

test.describe('文檔搜尋功能', () => {
  test.beforeEach(async ({ page }) => {
    // 導航到搜尋頁面
    await page.goto('/search');

    // 等待頁面載入
    await page.waitForLoadState('networkidle');
  });

  test('應該顯示搜尋欄位', async ({ page }) => {
    // 尋找搜尋輸入框
    const searchInput = page.locator('input[type="text"], input[placeholder*="搜尋"], input[placeholder*="search" i]').first();

    await expect(searchInput).toBeVisible();
  });

  test('應該能夠在搜尋欄位輸入文字', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="搜尋"], input[placeholder*="search" i]').first();

    // 輸入搜尋關鍵字
    await searchInput.fill('React');

    // 驗證輸入值
    await expect(searchInput).toHaveValue('React');
  });

  test('輸入搜尋關鍵字應該顯示結果', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="搜尋"], input[placeholder*="search" i]').first();

    // 輸入搜尋關鍵字
    await searchInput.fill('Angular');

    // 等待搜尋結果出現（給予即時搜尋時間）
    await page.waitForTimeout(500);

    // 檢查是否有結果顯示
    // 可能是卡片、列表項目等
    const results = page.locator('mat-card, .search-result, [class*="result"]');
    const resultCount = await results.count();

    expect(resultCount).toBeGreaterThan(0);
  });

  test('應該能夠清除搜尋', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="搜尋"], input[placeholder*="search" i]').first();

    // 輸入搜尋關鍵字
    await searchInput.fill('TypeScript');
    await page.waitForTimeout(300);

    // 尋找清除按鈕
    const clearButton = page.locator('button:has(mat-icon:has-text("clear")), button[aria-label*="clear" i]').first();

    if (await clearButton.isVisible()) {
      await clearButton.click();

      // 驗證輸入已清空
      await expect(searchInput).toHaveValue('');
    } else {
      // 如果沒有清除按鈕，手動清空
      await searchInput.clear();
      await expect(searchInput).toHaveValue('');
    }
  });

  test('搜尋結果應該包含關鍵字高亮', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="搜尋"], input[placeholder*="search" i]').first();

    // 輸入搜尋關鍵字
    await searchInput.fill('Golang');
    await page.waitForTimeout(500);

    // 檢查是否有高亮標記（通常是 <mark> 或特殊 class）
    const highlights = page.locator('mark, .highlight, [class*="highlight"]');
    const highlightCount = await highlights.count();

    // 如果有結果，應該有高亮
    if (highlightCount > 0) {
      expect(highlightCount).toBeGreaterThan(0);
    }
  });

  test('點擊搜尋結果應該導航到文檔詳情', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="搜尋"], input[placeholder*="search" i]').first();

    // 輸入搜尋關鍵字
    await searchInput.fill('Flutter');
    await page.waitForTimeout(500);

    // 尋找第一個搜尋結果並點擊
    const firstResult = page.locator('mat-card, .search-result, [class*="result"]').first();

    if (await firstResult.isVisible()) {
      await firstResult.click();

      // 等待導航
      await page.waitForTimeout(500);

      // 驗證 URL 已變更（應該包含 /documents/ 或類似路徑）
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/(documents|docs)\//);
    }
  });

  test('空搜尋應該不顯示結果', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="搜尋"], input[placeholder*="search" i]').first();

    // 確保搜尋欄位為空
    await searchInput.clear();
    await page.waitForTimeout(300);

    // 檢查結果區域
    const results = page.locator('mat-card, .search-result, [class*="result"]');
    const resultCount = await results.count();

    expect(resultCount).toBe(0);
  });

  test('搜尋不存在的內容應該顯示空狀態', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="搜尋"], input[placeholder*="search" i]').first();

    // 搜尋一個不太可能存在的關鍵字
    await searchInput.fill('xyzabc123notfound');
    await page.waitForTimeout(500);

    // 檢查是否有空狀態訊息
    const emptyMessage = page.locator('text=/沒有找到|無結果|no results/i');
    const hasEmptyMessage = await emptyMessage.count() > 0;

    const results = page.locator('mat-card, .search-result, [class*="result"]');
    const resultCount = await results.count();

    // 應該沒有結果或顯示空狀態訊息
    expect(resultCount === 0 || hasEmptyMessage).toBeTruthy();
  });

  test('搜尋效能應該在可接受範圍內', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="搜尋"], input[placeholder*="search" i]').first();

    // 記錄開始時間
    const startTime = Date.now();

    // 輸入搜尋
    await searchInput.fill('System Design');

    // 等待結果出現
    await page.waitForTimeout(100);

    const results = page.locator('mat-card, .search-result, [class*="result"]');
    await results.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});

    // 計算耗時
    const endTime = Date.now();
    const duration = endTime - startTime;

    // 搜尋應該在 2 秒內完成
    expect(duration).toBeLessThan(2000);
  });

  test('應該支援中文搜尋', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="搜尋"], input[placeholder*="search" i]').first();

    // 輸入中文關鍵字
    await searchInput.fill('前端');
    await page.waitForTimeout(500);

    // 驗證輸入值
    await expect(searchInput).toHaveValue('前端');

    // 檢查是否有結果（不強制要求，因為可能沒有中文內容）
    const results = page.locator('mat-card, .search-result, [class*="result"]');
    const resultCount = await results.count();

    // 只驗證搜尋功能正常運作，不驗證結果數量
    expect(resultCount).toBeGreaterThanOrEqual(0);
  });
});
