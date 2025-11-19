import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 測試配置
 *
 * 測試範圍：
 * - 主題切換
 * - 文檔搜尋
 * - Notebook 管理
 * - AI 問答功能
 */
export default defineConfig({
  testDir: './e2e',

  /* 測試執行超時時間 */
  timeout: 30 * 1000,

  /* 每個測試的預期執行時間 */
  expect: {
    timeout: 5000
  },

  /* 失敗時重試次數 */
  retries: process.env.CI ? 2 : 0,

  /* 並行執行的 worker 數量 */
  workers: process.env.CI ? 1 : undefined,

  /* 測試報告器 */
  reporter: [
    ['html'],
    ['list']
  ],

  /* 全局設定 */
  use: {
    /* 基礎 URL */
    baseURL: 'http://localhost:4200',

    /* 收集追蹤資訊（失敗時） */
    trace: 'on-first-retry',

    /* 截圖設定 */
    screenshot: 'only-on-failure',

    /* 影片錄製 */
    video: 'retain-on-failure',
  },

  /* 測試專案配置 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* 行動裝置測試 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* 啟動開發伺服器 */
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
