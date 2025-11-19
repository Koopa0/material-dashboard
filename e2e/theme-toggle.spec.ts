/**
 * E2E 測試 - 主題切換功能
 *
 * 測試範圍：
 * - 深淺主題切換
 * - 主題持久化（localStorage）
 * - UI 視覺變化驗證
 * - Gemini 配色方案
 */

import { test, expect } from '@playwright/test';

test.describe('主題切換功能', () => {
  test.beforeEach(async ({ page }) => {
    // 導航到首頁
    await page.goto('/');

    // 等待頁面完全載入
    await page.waitForLoadState('networkidle');
  });

  test('應該顯示主題切換按鈕', async ({ page }) => {
    // 尋找主題切換按鈕（通常是 moon 或 sun icon）
    const themeToggle = page.locator('button[aria-label*="theme"], button:has(mat-icon:has-text("dark_mode")), button:has(mat-icon:has-text("light_mode"))').first();

    await expect(themeToggle).toBeVisible();
  });

  test('應該能夠切換到深色主題', async ({ page }) => {
    // 取得 body 元素
    const body = page.locator('body');

    // 檢查初始主題（預設應該是淺色）
    const initialClass = await body.getAttribute('class');

    // 點擊主題切換按鈕
    const themeToggle = page.locator('button[aria-label*="theme"], button:has(mat-icon:has-text("dark_mode")), button:has(mat-icon:has-text("light_mode"))').first();
    await themeToggle.click();

    // 等待主題變更
    await page.waitForTimeout(300);

    // 驗證 body class 已變更
    const newClass = await body.getAttribute('class');
    expect(newClass).not.toBe(initialClass);

    // 驗證 dark-theme class 已加入或 light-theme class 已移除
    const hasDarkTheme = await body.evaluate((el) =>
      el.classList.contains('dark-theme')
    );
    const hasLightTheme = await body.evaluate((el) =>
      el.classList.contains('light-theme')
    );

    expect(hasDarkTheme || !hasLightTheme).toBeTruthy();
  });

  test('應該能夠從深色切換回淺色主題', async ({ page }) => {
    const body = page.locator('body');
    const themeToggle = page.locator('button[aria-label*="theme"], button:has(mat-icon:has-text("dark_mode")), button:has(mat-icon:has-text("light_mode"))').first();

    // 切換到深色
    await themeToggle.click();
    await page.waitForTimeout(300);

    // 再切換回淺色
    await themeToggle.click();
    await page.waitForTimeout(300);

    // 驗證回到淺色主題
    const hasLightTheme = await body.evaluate((el) =>
      el.classList.contains('light-theme')
    );

    expect(hasLightTheme).toBeTruthy();
  });

  test('主題選擇應該持久化到 localStorage', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="theme"], button:has(mat-icon:has-text("dark_mode")), button:has(mat-icon:has-text("light_mode"))').first();

    // 切換主題
    await themeToggle.click();
    await page.waitForTimeout(300);

    // 檢查 localStorage
    const savedTheme = await page.evaluate(() => {
      return localStorage.getItem('theme');
    });

    expect(savedTheme).toBeTruthy();
    expect(['light', 'dark']).toContain(savedTheme);
  });

  test('重新載入頁面應該保持主題設定', async ({ page }) => {
    const body = page.locator('body');
    const themeToggle = page.locator('button[aria-label*="theme"], button:has(mat-icon:has-text("dark_mode")), button:has(mat-icon:has-text("light_mode"))').first();

    // 切換到深色主題
    await themeToggle.click();
    await page.waitForTimeout(300);

    // 取得當前 class
    const themeBeforeReload = await body.getAttribute('class');

    // 重新載入頁面
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 驗證主題保持不變
    const themeAfterReload = await body.getAttribute('class');
    expect(themeAfterReload).toBe(themeBeforeReload);
  });

  test('深色主題應該有正確的背景顏色', async ({ page }) => {
    const body = page.locator('body');
    const themeToggle = page.locator('button[aria-label*="theme"], button:has(mat-icon:has-text("dark_mode")), button:has(mat-icon:has-text("light_mode"))').first();

    // 切換到深色主題
    await themeToggle.click();
    await page.waitForTimeout(300);

    // 檢查背景顏色（應該是深色）
    const bgColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // 驗證是深色（RGB 值應該較低）
    // 例如：rgb(0, 0, 0) 或 rgb(26, 26, 26)
    expect(bgColor).toMatch(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

    // 提取 RGB 值並驗證
    const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const [_, r, g, b] = match.map(Number);
      // 深色主題的平均 RGB 值應該小於 50
      const avg = (r + g + b) / 3;
      expect(avg).toBeLessThan(50);
    }
  });

  test('淺色主題應該有正確的背景顏色', async ({ page }) => {
    const body = page.locator('body');

    // 確保在淺色主題
    const hasLightTheme = await body.evaluate((el) =>
      el.classList.contains('light-theme')
    );

    if (!hasLightTheme) {
      const themeToggle = page.locator('button[aria-label*="theme"], button:has(mat-icon:has-text("dark_mode")), button:has(mat-icon:has-text("light_mode"))').first();
      await themeToggle.click();
      await page.waitForTimeout(300);
    }

    // 檢查背景顏色（應該是淺色）
    const bgColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // 驗證是淺色（RGB 值應該較高）
    const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const [_, r, g, b] = match.map(Number);
      // 淺色主題的平均 RGB 值應該大於 200
      const avg = (r + g + b) / 3;
      expect(avg).toBeGreaterThan(200);
    }
  });
});
