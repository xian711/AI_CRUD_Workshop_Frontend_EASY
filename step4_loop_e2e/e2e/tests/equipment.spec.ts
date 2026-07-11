/**
 * 中心裝備物資 CRUD — EASY 版精簡 E2E（7 條，一條一個觀念）
 * ──────────────────────────────────────────────────────────
 * 目標站點：solution-app 的 mock 模式（http://localhost:3100/equipment/crud）。
 * 資料層為記憶體 mock：每次 page reload 重置為 24 筆種子（E-001…E-024），
 *   故每個 test 各自 goto 後計數穩定、測試間互不污染（E3 新增的資料 reload 後自然消失）。
 *
 * selector 依據：實跑 probe 抓過真實 DOM 才寫，非憑空猜測——
 *   - 篩選/表單下拉是 Nuxt UI USelectMenu（headless combobox）：點觸發鈕開清單、選項用 role=option 定位。
 *   - 刪除確認是 AppConfirmModal：role=alertdialog、確認鈕文字「刪除」、取消鈕「取消」。
 */
import { test, expect, type Page, type Locator } from '@playwright/test'

const LIST = '/equipment/crud'

/** 工具列的「共 N 筆」文字（filteredRows.length） */
function totalCount(page: Page, n: number): Locator {
  return page.getByText(`共 ${n} 筆`, { exact: true })
}

/** USelectMenu（headless combobox）：點觸發鈕 → 點 role=option 選項 */
async function pickOption(page: Page, field: Locator, optionName: string) {
  await field.locator('button').first().click()
  await page.getByRole('option', { name: optionName, exact: true }).click()
}

/** 表格第一列（桌機 table），供刪除／編輯等以「第一列」為對象的測試共用 */
function firstRow(page: Page): Locator {
  return page.locator('table tbody tr').first()
}

/** 讀第一列「項目」欄的品項編碼（該欄第二個 div＝font-mono 編碼） */
async function firstRowCode(page: Page): Promise<string> {
  return (await firstRow(page).locator('td').nth(1).locator('div').last().innerText()).trim()
}

// ── E1 列表載入 ─────────────────────────────────────────────
// 觀念：Read（讀取／列表）。進頁看得到表格與正確總筆數。
test('E1 列表載入：/equipment/crud 顯示表格與「共 24 筆」', async ({ page }) => {
  await page.goto(LIST)
  await expect(totalCount(page, 24)).toBeVisible()
  const table = page.locator('table')
  await expect(table).toBeVisible()
  // 種子第一分類為發電機所屬的資通訊/供電，任取一個穩定種子名驗證有資料
  await expect(table.getByText('筆記型電腦').first()).toBeVisible()
})

// ── E2 關鍵字篩選 ───────────────────────────────────────────
// 觀念：Filter（關鍵字過濾，含名稱／編碼）。輸入縮小、清除還原。
test('E2 關鍵字篩選：輸入「發電機」縮小、清除後還原', async ({ page }) => {
  await page.goto(LIST)
  await expect(totalCount(page, 24)).toBeVisible()

  await page.getByPlaceholder('項目名稱／編碼').fill('發電機')
  await expect(totalCount(page, 2)).toBeVisible() // 種子有 2 台發電機
  await expect(page.locator('table').getByText('發電機').first()).toBeVisible()

  // 用編碼搜尋：關鍵字同時比對「名稱＋編碼」，前綴 PW-GEN 命中兩台發電機
  await page.getByPlaceholder('項目名稱／編碼').fill('PW-GEN')
  await expect(totalCount(page, 2)).toBeVisible()
  await expect(page.locator('table').getByText('發電機').first()).toBeVisible()
  await expect(page.locator('table').getByText('PW-GEN-001', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: '清除' }).click()
  await expect(totalCount(page, 24)).toBeVisible()
})

// ── E3 新增品項 ─────────────────────────────────────────────
// 觀念：Create（新增，含分類→項目連動、編碼自動預覽）。
test('E3 新增品項：發電機建立成功並回列表（共 25 筆）', async ({ page }) => {
  await page.goto(LIST)
  await page.getByRole('button', { name: '新增品項' }).click()
  await expect(page).toHaveURL(/\/equipment\/crud\/new/)

  // 分類 → 項目（連動）
  await pickOption(page, page.locator('[data-field="categoryKey"]'), '供電及照明設備')
  await pickOption(page, page.locator('[data-field="name"]'), '發電機')

  // 編碼自動預覽（系統依「分類＋項目」推算：PW-GEN 前綴接下一流水）
  await expect(page.locator('[data-field="code"] input')).toHaveValue('PW-GEN-003')

  // 必填其餘欄位
  await page.locator('[data-field="qty"] input').fill('5')
  await page.locator('[data-field="unit"] input').fill('台')
  await page.locator('[data-field="spec1"] textarea').fill('汽油發電機 3kW 測試資料')

  await page.getByRole('button', { name: '儲存' }).click()

  // 回列表、toast、筆數 +1
  await expect(page).toHaveURL(/\/equipment\/crud(\?|$)/)
  await expect(page.getByText('已新增品項')).toBeVisible()
  await expect(totalCount(page, 25)).toBeVisible()

  // 用新編碼搜得到剛建立的那一筆
  await page.getByPlaceholder('項目名稱／編碼').fill('PW-GEN-003')
  await expect(totalCount(page, 1)).toBeVisible()
  await expect(page.locator('table').getByText('發電機').first()).toBeVisible()
})

// ── E4 表單驗證 ─────────────────────────────────────────────
// 觀念：Validation（欄位級驗證，錯誤不離頁）。
test('E4 表單驗證：直接儲存出現「請選擇分類」且停在表單頁', async ({ page }) => {
  await page.goto(`${LIST}/new`)
  await page.getByRole('button', { name: '儲存' }).click()
  // 欄位級錯誤：分類必填
  await expect(page.locator('#categoryKey-error')).toHaveText('請選擇分類')
  // toast「請修正 N 個欄位」，且仍停在新增頁（未離頁）
  await expect(page.getByText(/請修正 \d+ 個欄位/)).toBeVisible()
  await expect(page).toHaveURL(/\/equipment\/crud\/new/)
})

// ── E5 刪除確認 ─────────────────────────────────────────────
// 觀念：Delete（二次確認：取消不動、確認才刪）。
test('E5 刪除確認：取消不變、確認後 -1 且該編碼從表格消失', async ({ page }) => {
  await page.goto(LIST)
  await expect(totalCount(page, 24)).toBeVisible()

  // 先記下第一列的品項編碼，稍後據以斷言「這一筆真的被刪掉了」
  const code = await firstRowCode(page)
  await expect(page.locator('table').getByText(code, { exact: true })).toBeVisible()

  // 桌機表格第一列的刪除鈕（scope 到 table，避免命中手機卡片同名鈕）
  await firstRow(page).locator('button[aria-label="刪除"]').click()
  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('刪除品項')).toBeVisible()

  // 取消 → 筆數不變、編碼仍在
  await dialog.getByRole('button', { name: '取消', exact: true }).click()
  await expect(dialog).toBeHidden()
  await expect(totalCount(page, 24)).toBeVisible()
  await expect(page.locator('table').getByText(code, { exact: true })).toBeVisible()

  // 再刪一次 → 按「刪除」→ 筆數 -1，且該編碼不再出現於表格
  await firstRow(page).locator('button[aria-label="刪除"]').click()
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: '刪除', exact: true }).click()
  await expect(page.getByText(/已刪除/)).toBeVisible()
  await expect(totalCount(page, 23)).toBeVisible()
  await expect(page.locator('table').getByText(code, { exact: true })).toHaveCount(0)
})

// ── E6 範本不回歸 ───────────────────────────────────────────
// 觀念：Regression（新模組不能改壞被複製的人員 CRUD 範本）。
test('E6 範本不回歸：/template/crud 正常載入含表格', async ({ page }) => {
  await page.goto('/template/crud')
  await expect(page.locator('table')).toBeVisible()
  await expect(page.getByText(/共 \d+ 筆/).first()).toBeVisible()
})

// ── E7 編輯品項 ─────────────────────────────────────────────
// 觀念：Update（編輯既有品項：改數量＋存放地點，儲存後回列表可查得新值）。
test('E7 編輯品項：改第一列數量與存放地點，儲存後新值生效', async ({ page }) => {
  const NEW_QTY = '77'
  const NEW_LOCATION = 'E7 測試存放區'

  await page.goto(LIST)
  await expect(totalCount(page, 24)).toBeVisible()

  // 記下第一列編碼（僅改數量／地點，不動分類與項目 → 編碼會保留，稍後據以查回這一筆）
  const code = await firstRowCode(page)

  // 第一列進編輯（?mode=edit）
  await firstRow(page).locator('button[aria-label="編輯"]').click()
  await expect(page).toHaveURL(/\/equipment\/crud\/[^/]+\?.*mode=edit/)

  // 改數量與存放地點
  await page.locator('[data-field="qty"] input').fill(NEW_QTY)
  await page.locator('[data-field="locationName"] input').fill(NEW_LOCATION)

  // 儲存 → 回列表、toast
  await page.getByRole('button', { name: '儲存' }).click()
  await expect(page).toHaveURL(/\/equipment\/crud(\?|$)/)
  await expect(page.getByText('已儲存變更')).toBeVisible()

  // 用編碼查回這一筆，斷言新值已生效
  await page.getByPlaceholder('項目名稱／編碼').fill(code)
  await expect(totalCount(page, 1)).toBeVisible()
  const hit = firstRow(page)
  await expect(hit.getByText(code, { exact: true })).toBeVisible()
  await expect(hit.getByText(new RegExp(`${NEW_QTY}\\s`))).toBeVisible()
  await expect(hit.getByText(NEW_LOCATION)).toBeVisible()
})
