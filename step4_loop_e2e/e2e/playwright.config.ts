import { defineConfig, devices } from '@playwright/test'

// 裝備物資模組 E2E 設定（EASY 版｜獨立專案，與受測 App 隔離）
// 前置：受測 App 需已在 baseURL 執行（pnpm dev）。
//        run-e2e 腳本會先確認站點活著才呼叫本設定，避免對死站點跑測試。
//
// 埠不再寫死：BASE_URL 可整段覆寫（例如 http://localhost:3200），
//            也可只給 PORT（例如 3200）由本檔組出 http://localhost:3200。
//            兩個都沒給就用預設的 http://localhost:3100，跟教材寫的一致。
const PORT = process.env.PORT || '3100'
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  // list：印在終端機，run-e2e 靠它數 passed，不能拿掉。
  // html：測試報告寫到 e2e/playwright-report/index.html，用瀏覽器開；open: 'never' 不自動跳視窗。
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
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
