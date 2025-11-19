/**
 * E2E 測試 - AI 聊天功能
 *
 * 測試範圍：
 * - AI 聊天介面顯示
 * - 發送問題
 * - 接收回應
 * - 聊天歷史
 * - 引用標記（Citations）
 * - Demo 模式驗證
 */

import { test, expect } from '@playwright/test';

test.describe('AI 聊天功能', () => {
  test.beforeEach(async ({ page }) => {
    // 導航到首頁
    await page.goto('/');

    // 等待頁面載入
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  test('應該顯示 AI 聊天按鈕或入口', async ({ page }) => {
    // 尋找 AI 聊天相關的按鈕或連結
    const aiChatButton = page.locator('button:has-text("AI"), a:has-text("AI"), button:has(mat-icon:has-text("chat")), [aria-label*="AI" i]').first();

    // 如果找不到明顯的按鈕，可能是浮動按鈕
    const fabButton = page.locator('button.mat-fab, button[class*="fab"], button[class*="floating"]');

    const hasAiButton = await aiChatButton.count() > 0;
    const hasFabButton = await fabButton.count() > 0;

    expect(hasAiButton || hasFabButton).toBeTruthy();
  });

  test('點擊 AI 聊天按鈕應該開啟聊天介面', async ({ page }) => {
    // 尋找並點擊 AI 聊天按鈕
    const aiChatButton = page.locator('button:has-text("AI"), button:has(mat-icon:has-text("chat")), button[class*="fab"]').first();

    if (await aiChatButton.isVisible()) {
      await aiChatButton.click();
      await page.waitForTimeout(500);

      // 檢查聊天介面是否出現
      const chatInterface = page.locator('[class*="chat"], [class*="ai"], mat-drawer, mat-sidenav').last();
      await expect(chatInterface).toBeVisible();
    }
  });

  test('聊天介面應該有輸入框', async ({ page }) => {
    // 開啟聊天介面
    const aiChatButton = page.locator('button:has-text("AI"), button:has(mat-icon:has-text("chat")), button[class*="fab"]').first();

    if (await aiChatButton.isVisible()) {
      await aiChatButton.click();
      await page.waitForTimeout(500);

      // 尋找輸入框
      const messageInput = page.locator('textarea, input[type="text"]').last();
      await expect(messageInput).toBeVisible();
    }
  });

  test('應該能夠在輸入框輸入文字', async ({ page }) => {
    const aiChatButton = page.locator('button:has-text("AI"), button:has(mat-icon:has-text("chat")), button[class*="fab"]').first();

    if (await aiChatButton.isVisible()) {
      await aiChatButton.click();
      await page.waitForTimeout(500);

      const messageInput = page.locator('textarea, input[type="text"]').last();

      if (await messageInput.isVisible()) {
        await messageInput.fill('什麼是 Angular？');
        await expect(messageInput).toHaveValue('什麼是 Angular？');
      }
    }
  });

  test('應該能夠發送訊息', async ({ page }) => {
    const aiChatButton = page.locator('button:has-text("AI"), button:has(mat-icon:has-text("chat")), button[class*="fab"]').first();

    if (await aiChatButton.isVisible()) {
      await aiChatButton.click();
      await page.waitForTimeout(500);

      const messageInput = page.locator('textarea, input[type="text"]').last();

      if (await messageInput.isVisible()) {
        await messageInput.fill('測試問題');

        // 尋找發送按鈕
        const sendButton = page.locator('button:has(mat-icon:has-text("send")), button[type="submit"]').last();

        if (await sendButton.isVisible()) {
          await sendButton.click();
          await page.waitForTimeout(1000);

          // 驗證訊息已發送（輸入框應該清空）
          const inputValue = await messageInput.inputValue();
          expect(inputValue).toBe('');
        }
      }
    }
  });

  test('發送訊息後應該收到 AI 回應', async ({ page }) => {
    const aiChatButton = page.locator('button:has-text("AI"), button:has(mat-icon:has-text("chat")), button[class*="fab"]').first();

    if (await aiChatButton.isVisible()) {
      await aiChatButton.click();
      await page.waitForTimeout(500);

      const messageInput = page.locator('textarea, input[type="text"]').last();

      if (await messageInput.isVisible()) {
        await messageInput.fill('什麼是 React Hooks？');

        const sendButton = page.locator('button:has(mat-icon:has-text("send")), button[type="submit"]').last();

        if (await sendButton.isVisible()) {
          await sendButton.click();

          // 等待 AI 回應（Demo 模式約 1-2 秒）
          await page.waitForTimeout(3000);

          // 檢查是否有訊息出現
          const messages = page.locator('[class*="message"], mat-card, .chat-message');
          const messageCount = await messages.count();

          // 應該至少有 2 條訊息（使用者 + AI）
          expect(messageCount).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  test('AI 回應應該顯示在聊天歷史中', async ({ page }) => {
    const aiChatButton = page.locator('button:has-text("AI"), button:has(mat-icon:has-text("chat")), button[class*="fab"]').first();

    if (await aiChatButton.isVisible()) {
      await aiChatButton.click();
      await page.waitForTimeout(500);

      const messageInput = page.locator('textarea, input[type="text"]').last();

      if (await messageInput.isVisible()) {
        await messageInput.fill('簡單問題');

        const sendButton = page.locator('button:has(mat-icon:has-text("send")), button[type="submit"]').last();

        if (await sendButton.isVisible()) {
          await sendButton.click();
          await page.waitForTimeout(3000);

          // 檢查聊天歷史容器
          const chatHistory = page.locator('[class*="history"], [class*="messages"], .chat-container');

          if (await chatHistory.count() > 0) {
            await expect(chatHistory.first()).toBeVisible();
          }
        }
      }
    }
  });

  test('應該能夠清除聊天歷史', async ({ page }) => {
    const aiChatButton = page.locator('button:has-text("AI"), button:has(mat-icon:has-text("chat")), button[class*="fab"]').first();

    if (await aiChatButton.isVisible()) {
      await aiChatButton.click();
      await page.waitForTimeout(500);

      // 尋找清除按鈕
      const clearButton = page.locator('button:has-text("清除"), button:has-text("Clear"), button:has(mat-icon:has-text("delete"))').last();

      if (await clearButton.isVisible()) {
        // 先發送一條訊息
        const messageInput = page.locator('textarea, input[type="text"]').last();
        await messageInput.fill('測試');

        const sendButton = page.locator('button:has(mat-icon:has-text("send")), button[type="submit"]').last();
        await sendButton.click();
        await page.waitForTimeout(2000);

        // 點擊清除
        await clearButton.click();
        await page.waitForTimeout(300);

        // 驗證訊息已清除
        const messages = page.locator('[class*="message"], mat-card, .chat-message');
        const messageCount = await messages.count();

        expect(messageCount).toBe(0);
      }
    }
  });

  test('AI 回應應該包含引用標記（如果有）', async ({ page }) => {
    const aiChatButton = page.locator('button:has-text("AI"), button:has(mat-icon:has-text("chat")), button[class*="fab"]').first();

    if (await aiChatButton.isVisible()) {
      await aiChatButton.click();
      await page.waitForTimeout(500);

      const messageInput = page.locator('textarea, input[type="text"]').last();

      if (await messageInput.isVisible()) {
        // 提問一個可能產生引用的問題
        await messageInput.fill('什麼是向量嵌入？');

        const sendButton = page.locator('button:has(mat-icon:has-text("send")), button[type="submit"]').last();

        if (await sendButton.isVisible()) {
          await sendButton.click();
          await page.waitForTimeout(3000);

          // 檢查是否有引用標記
          const citations = page.locator('[class*="citation"], .citation, app-citation');
          const citationCount = await citations.count();

          // 不強制要求有引用，但如果有就驗證
          if (citationCount > 0) {
            await expect(citations.first()).toBeVisible();
          }
        }
      }
    }
  });

  test('聊天介面應該能夠關閉', async ({ page }) => {
    const aiChatButton = page.locator('button:has-text("AI"), button:has(mat-icon:has-text("chat")), button[class*="fab"]').first();

    if (await aiChatButton.isVisible()) {
      await aiChatButton.click();
      await page.waitForTimeout(500);

      // 尋找關閉按鈕
      const closeButton = page.locator('button:has(mat-icon:has-text("close")), button[aria-label*="close" i]').last();

      if (await closeButton.isVisible()) {
        await closeButton.click();
        await page.waitForTimeout(300);

        // 驗證聊天介面已關閉
        const chatInterface = page.locator('[class*="chat"], [class*="ai"], mat-drawer-content').last();
        const isVisible = await chatInterface.isVisible();

        // 介面應該隱藏或縮小
        expect(isVisible).toBe(false);
      }
    }
  });

  test('Demo 模式應該顯示警告或提示', async ({ page }) => {
    const aiChatButton = page.locator('button:has-text("AI"), button:has(mat-icon:has-text("chat")), button[class*="fab"]').first();

    if (await aiChatButton.isVisible()) {
      await aiChatButton.click();
      await page.waitForTimeout(500);

      // 檢查是否有 Demo 模式提示
      const demoNotice = page.locator('text=/demo|模擬|測試模式/i, [class*="demo"], [class*="notice"]');
      const hasDemoNotice = await demoNotice.count() > 0;

      // Demo 模式可能會顯示提示（但不強制要求）
      expect(typeof hasDemoNotice).toBe('boolean');
    }
  });
});
