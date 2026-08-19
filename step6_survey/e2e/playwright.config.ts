import { defineConfig, devices } from '@playwright/test'

// 課程回饋問卷 一鍵驗收 E2E 設定（EASY 版｜獨立專案）
// 前置：你的 my-survey-app 需已啟動（pnpm dev）。
//       run-survey-e2e 腳本會先確認站點活著才呼叫本設定，避免對死站點跑測試。
//
// 埠不寫死：BASE_URL 可整段覆寫；只給 PORT 也行；都沒給就用 http://localhost:3100。
const PORT = process.env.PORT || '3100'
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
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
