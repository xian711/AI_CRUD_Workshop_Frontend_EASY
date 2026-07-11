import { defineConfig, devices } from '@playwright/test'

// 裝備物資模組 E2E 設定（EASY 版｜獨立專案，與 solution-app 隔離）
// 前置：solution-app 需已在 http://localhost:3100 執行（pnpm dev）。
//        run-e2e.ps1 會先確認 3100 活著才呼叫本設定，避免對死站點跑測試。
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'off',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],
})
