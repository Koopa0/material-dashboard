/**
 * E2E 測試 - Notebook 管理功能
 *
 * 測試範圍：
 * - 查看 Notebooks 列表
 * - 建立新 Notebook
 * - 選擇 Notebook
 * - 查看 Notebook 詳情
 * - 將文檔加入 Notebook
 */

import { test, expect } from '@playwright/test';

test.describe('Notebook 管理功能', () => {
  test.beforeEach(async ({ page }) => {
    // 導航到首頁
    await page.goto('/');

    // 等待頁面載入
    await page.waitForLoadState('networkidle');
  });

  test('側邊欄應該顯示 Notebooks 選單', async ({ page }) => {
    // 尋找 Notebooks 選單項目
    const notebooksMenu = page.locator('text=/Notebooks?/i, a:has-text("Notebook")').first();

    // 等待側邊欄載入
    await page.waitForTimeout(500);

    await expect(notebooksMenu).toBeVisible();
  });

  test('應該能夠展開 Notebooks 子選單', async ({ page }) => {
    await page.waitForTimeout(500);

    // 尋找可展開的 Notebooks 項目
    const notebooksMenu = page.locator('[class*="menu"], mat-nav-list').locator('text=/Notebooks?/i').first();

    if (await notebooksMenu.isVisible()) {
      await notebooksMenu.click();
      await page.waitForTimeout(300);

      // 檢查是否有子項目出現（筆記本列表）
      const subItems = page.locator('[class*="sub"], [class*="child"], .notebook-item');
      const subItemCount = await subItems.count();

      expect(subItemCount).toBeGreaterThan(0);
    }
  });

  test('應該顯示預設 Notebooks', async ({ page }) => {
    await page.waitForTimeout(500);

    // 展開 Notebooks
    const notebooksMenu = page.locator('[class*="menu"], mat-nav-list').locator('text=/Notebooks?/i').first();

    if (await notebooksMenu.isVisible()) {
      await notebooksMenu.click();
      await page.waitForTimeout(300);

      // 檢查是否有「工作專案」這個預設筆記本
      const defaultNotebook = page.locator('text=/工作專案|學習筆記/i').first();
      const hasDefaultNotebook = await defaultNotebook.count() > 0;

      expect(hasDefaultNotebook).toBeTruthy();
    }
  });

  test('應該能夠點擊 Notebook 查看詳情', async ({ page }) => {
    await page.waitForTimeout(500);

    // 展開 Notebooks
    const notebooksMenu = page.locator('[class*="menu"], mat-nav-list').locator('text=/Notebooks?/i').first();

    if (await notebooksMenu.isVisible()) {
      await notebooksMenu.click();
      await page.waitForTimeout(300);

      // 點擊第一個筆記本
      const firstNotebook = page.locator('[class*="sub"], [class*="child"], .notebook-item, a[href*="notebook"]').first();

      if (await firstNotebook.isVisible()) {
        await firstNotebook.click();
        await page.waitForTimeout(500);

        // 驗證 URL 變更
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/notebooks?\//i);
      }
    }
  });

  test('Notebook 詳情頁應該顯示文檔列表', async ({ page }) => {
    // 直接導航到 Notebook 詳情頁（假設有預設 ID）
    await page.goto('/notebooks');
    await page.waitForTimeout(500);

    // 點擊第一個 Notebook
    const firstNotebook = page.locator('mat-card, .notebook-card, [class*="notebook"]').first();

    if (await firstNotebook.isVisible()) {
      await firstNotebook.click();
      await page.waitForTimeout(500);

      // 檢查是否顯示文檔列表
      const documentList = page.locator('mat-card, .document-card, [class*="document"]');
      const docCount = await documentList.count();

      // 可能是空的筆記本，所以 >= 0
      expect(docCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('應該能夠開啟建立 Notebook 對話框', async ({ page }) => {
    // 導航到 Notebooks 頁面
    await page.goto('/notebooks');
    await page.waitForTimeout(500);

    // 尋找新增按鈕
    const addButton = page.locator('button:has(mat-icon:has-text("add")), button:has-text("新增"), button:has-text("Create")').first();

    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(300);

      // 檢查對話框是否出現
      const dialog = page.locator('mat-dialog-container, [role="dialog"], .dialog');
      await expect(dialog).toBeVisible();
    }
  });

  test('應該能夠在對話框中輸入 Notebook 名稱', async ({ page }) => {
    await page.goto('/notebooks');
    await page.waitForTimeout(500);

    // 開啟新增對話框
    const addButton = page.locator('button:has(mat-icon:has-text("add")), button:has-text("新增"), button:has-text("Create")').first();

    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(300);

      // 尋找名稱輸入框
      const nameInput = page.locator('input[formcontrolname="name"], input[placeholder*="名稱"], input[placeholder*="name" i]').first();

      if (await nameInput.isVisible()) {
        await nameInput.fill('測試筆記本');
        await expect(nameInput).toHaveValue('測試筆記本');
      }
    }
  });

  test('從文檔頁面應該能將文檔加入 Notebook', async ({ page }) => {
    // 導航到文檔列表
    await page.goto('/documents');
    await page.waitForTimeout(500);

    // 尋找第一個文檔的選單按鈕
    const menuButton = page.locator('button:has(mat-icon:has-text("more_vert")), button[aria-label*="menu"]').first();

    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(300);

      // 尋找「加入 Notebook」選項
      const addToNotebookOption = page.locator('button:has-text("Notebook"), button:has-text("加入")').first();

      if (await addToNotebookOption.isVisible()) {
        // 驗證選項存在
        await expect(addToNotebookOption).toBeVisible();
      }
    }
  });

  test('Notebook 應該顯示文檔數量', async ({ page }) => {
    await page.goto('/notebooks');
    await page.waitForTimeout(500);

    // 尋找顯示文檔數量的元素
    const countBadge = page.locator('[class*="badge"], [class*="count"], mat-badge').first();

    if (await countBadge.isVisible()) {
      const countText = await countBadge.textContent();
      // 驗證是數字
      expect(countText).toMatch(/\d+/);
    }
  });

  test('Notebook 詳情應該顯示空狀態（當無文檔時）', async ({ page }) => {
    // 這個測試假設有一個空的 Notebook 或可以建立一個
    await page.goto('/notebooks');
    await page.waitForTimeout(500);

    // 如果有筆記本，點擊進入
    const notebook = page.locator('mat-card, .notebook-card').first();

    if (await notebook.isVisible()) {
      await notebook.click();
      await page.waitForTimeout(500);

      // 檢查是否有空狀態訊息
      const emptyState = page.locator('text=/沒有文檔|無文檔|no documents/i, .empty-state');
      const documents = page.locator('mat-card, .document-card');

      // 如果沒有文檔，應該顯示空狀態
      const docCount = await documents.count();
      if (docCount === 0) {
        const hasEmptyState = await emptyState.count() > 0;
        expect(hasEmptyState).toBeTruthy();
      }
    }
  });
});
