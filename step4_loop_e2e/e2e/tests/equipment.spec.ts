/**
 * 中心裝備物資 CRUD — EASY 版精簡 E2E（7 條，一條一個觀念）
 * ──────────────────────────────────────────────────────────
 * 受測站點：http://localhost:3100/equipment/crud（可用 BASE_URL 環境變數覆寫）。
 * 資料層為記憶體 mock：每次 page reload 重置為種子資料，
 *   故每個 test 各自 goto 後計數穩定、測試間互不污染（E3 新增的資料 reload 後自然消失）。
 *
 * ── v2 的寫法原則（為什麼這樣寫，看這裡）─────────────────────
 * v1 的這套測試是拿參考解 solution-app 探過 DOM 才寫的，結果把「參考解剛好長那樣」
 * 的細節（toast 逐字用字、品項編碼的確切格式、種子裡剛好幾台發電機、表格第 2 欄的
 * div 位置）都寫死成斷言。學員照 PRD 做出功能正確的模組，照樣會被判紅。
 * v2 改成三條原則：
 *   1. 能用語意就用語意：按鈕用 role + 可及名稱、文字用「模糊比對」而不是逐字。
 *   2. 數字一律動態讀：先讀畫面上的總筆數當基準，再驗「有沒有依規則變動」，
 *      不寫死 24／2／25 這些只有參考解才對的數字。
 *   3. 真的沒有語意可用時，才用 data-testid——而且那幾個掛載點寫進 PRD 第 2.1 節，
 *      是「講明的約定」，不是藏在測試裡的暗號。沒有掛載點時本檔一律有語意退路。
 *
 * data-testid 掛載點（PRD 2.1 節有列，沒掛也能跑，只是定位比較脆）：
 *   equipment-keyword ─ 關鍵字搜尋框的外框
 *   equipment-total   ─ 顯示總筆數的元素
 *   equipment-row     ─ 桌機表格的資料列
 *   equipment-code    ─ 資料列裡的品項編碼
 */
import { test, expect, type Page, type Locator } from '@playwright/test'

const LIST = '/equipment/crud'
const TEMPLATE_LIST = '/template/crud'
/** PRD 4 節：預設每頁 20 筆 */
const PAGE_SIZE = 20

// ── 定位工具：語意優先，data-testid 為輔 ─────────────────────

/** 總筆數元素：優先 data-testid，退回「共 N 筆」文字 */
function totalBox(page: Page): Locator {
  return page.locator('[data-testid="equipment-total"]').or(page.getByText(/共\s*\d+\s*筆/)).first()
}

/** 讀出目前的總筆數（動態基準，不寫死 24） */
async function readTotal(page: Page): Promise<number> {
  await expect(totalBox(page)).toBeVisible()
  const text = (await totalBox(page).innerText()).trim()
  const m = text.match(/(\d+)/)
  expect(m, `總筆數元素讀不到數字，實際文字為「${text}」`).not.toBeNull()
  return Number(m![1])
}

/** 等總筆數變成 n（避免 race：用 toPass 輪詢，不用固定等待） */
async function expectTotal(page: Page, n: number) {
  await expect(async () => {
    expect(await readTotal(page)).toBe(n)
  }).toPass({ timeout: 10_000 })
}

/** 關鍵字搜尋框：優先 data-testid，退回頁面第一個 textbox */
function keywordInput(page: Page): Locator {
  return page
    .locator('[data-testid="equipment-keyword"] input')
    .or(page.getByRole('textbox').first())
    .first()
}

/** 桌機表格的資料列（手機卡片是 div，不會被選到） */
function rows(page: Page): Locator {
  return page.locator('[data-testid="equipment-row"]').or(page.locator('table tbody tr'))
}

function firstRow(page: Page): Locator {
  return rows(page).first()
}

/** 讀第一列的品項編碼：優先 data-testid，退回「項目」欄的最後一行文字 */
async function firstRowCode(page: Page): Promise<string> {
  const tagged = firstRow(page).locator('[data-testid="equipment-code"]')
  if (await tagged.count() > 0) return (await tagged.first().innerText()).trim()
  // 語意退路：編碼與品名同格，取該格最後一行
  const cell = firstRow(page).locator('td').nth(1)
  // 注意：innerText 在 tr／td 上是用 tab 或換行分隔，兩種都要切
  const lines = (await cell.innerText()).trim().split(/[\n\t]+/).map(s => s.trim()).filter(Boolean)
  return lines[lines.length - 1]
}

/** USelectMenu（headless combobox）：點觸發鈕 → 點 role=option 選項 */
async function pickOption(page: Page, field: Locator, optionName: string) {
  await field.locator('button').first().click()
  await page.getByRole('option', { name: optionName, exact: true }).click()
}

/** 欄位級錯誤：讀 data-field 容器內的錯誤訊息（data-field 由範本的 FormField 元件提供） */
function fieldError(page: Page, name: string): Locator {
  return page.locator(`[data-field="${name}"] p`).last()
}

// ── E1 列表載入 ─────────────────────────────────────────────
// 觀念：Read（讀取／列表）。進頁看得到表格、總筆數，且「第一頁恰好 20 列」。
test('E1 列表載入：顯示表格與總筆數，第一頁恰好一頁份的列數', async ({ page }) => {
  await page.goto(LIST)

  const total = await readTotal(page)
  expect(total, '列表應該要有種子資料').toBeGreaterThan(0)

  await expect(page.locator('table')).toBeVisible()

  // v2 補假綠：分頁若整個失效（一次把全部資料倒進表格），v1 的 E1 照樣會綠。
  // 這裡明確驗「第一頁的列數＝min(總筆數, 每頁 20)」。
  const expectedRows = Math.min(total, PAGE_SIZE)
  await expect(rows(page)).toHaveCount(expectedRows)

  // 每一列都要有品項編碼（代表資料真的渲染出來，不是空殼表格）
  await expect(await firstRowCode(page)).not.toBe('')
})

// ── E2 關鍵字篩選 ───────────────────────────────────────────
// 觀念：Filter（關鍵字過濾，含名稱／編碼、不分大小寫）。輸入縮小、清除還原。
test('E2 關鍵字篩選：用編碼與品名都能縮小、不分大小寫、清除後還原', async ({ page }) => {
  await page.goto(LIST)

  // v2 動態筆數：先讀基準，不寫死 24
  const total = await readTotal(page)
  const code = await firstRowCode(page)
  const name = (await firstRow(page).innerText()).split(/[\n\t]+/).map(s => s.trim()).filter(Boolean)[1] ?? ''

  // 1) 用編碼搜尋 → 編碼唯一，應恰好剩 1 筆
  await keywordInput(page).fill(code)
  await expectTotal(page, 1)
  await expect(firstRow(page)).toContainText(code)

  // 2) 不分大小寫：同一個編碼轉小寫，結果要一樣（PRD 4 節）
  await keywordInput(page).fill(code.toLowerCase())
  await expectTotal(page, 1)

  // 3) 用品名搜尋 → 應該有縮小（1 ≤ 命中 < 總數），且命中的列真的含這個品名
  if (name) {
    await keywordInput(page).fill(name)
    const hit = await readTotal(page)
    expect(hit, `用品名「${name}」搜尋應至少命中 1 筆`).toBeGreaterThanOrEqual(1)
    expect(hit, `用品名「${name}」搜尋應該要比全部少`).toBeLessThan(total)
    await expect(firstRow(page)).toContainText(name)
  }

  // 4) 清除 → 還原成原本的總筆數
  await page.getByRole('button', { name: /清除/ }).click()
  await expectTotal(page, total)
})

// ── E3 新增品項 ─────────────────────────────────────────────
// 觀念：Create（新增，含分類→項目連動、編碼自動預覽）。
test('E3 新增品項：連動下拉、自動編碼合規且不重複、儲存後筆數 +1', async ({ page }) => {
  await page.goto(LIST)
  const before = await readTotal(page)

  await page.getByRole('button', { name: /新增/ }).click()
  await expect(page).toHaveURL(/\/equipment\/crud\/new/)

  // 分類 → 項目（連動）。這兩個名稱來自 PRD 第 3 節的分類與標準項目表，屬於規格。
  await pickOption(page, page.locator('[data-field="categoryKey"]'), '供電及照明設備')
  await pickOption(page, page.locator('[data-field="name"]'), '發電機')

  // v2 不再寫死 PW-GEN-003：只驗「編碼有自動產生、格式合理、而且不重複」。
  // 學員在 step3 的 D3 拍板成什麼格式都可以，這條都過得了。
  const codeInput = page.locator('[data-field="code"] input')
  await expect(codeInput).not.toHaveValue('')
  const newCode = (await codeInput.inputValue()).trim()
  expect(newCode, '自動編碼不應含空白').not.toMatch(/\s/)
  expect(newCode.length, '自動編碼至少要 3 個字').toBeGreaterThanOrEqual(3)
  expect(newCode, '自動編碼只允許英數與 - _ .').toMatch(/^[A-Za-z0-9][A-Za-z0-9._-]*$/)

  // 必填其餘欄位
  await page.locator('[data-field="qty"] input').fill('5')
  await page.locator('[data-field="unit"] input').fill('台')
  await page.locator('[data-field="spec1"] textarea').fill('汽油發電機 3kW 測試資料')

  await page.getByRole('button', { name: /儲存/ }).click()

  // 回列表、成功提示（模糊比對，不綁逐字文案）、筆數 +1
  await expect(page).toHaveURL(/\/equipment\/crud(\?|$)/)
  await expect(page.getByText(/已新增|新增成功/).first()).toBeVisible()
  await expectTotal(page, before + 1)

  // 「不重複」：用新編碼搜尋應恰好 1 筆——若跟既有資料撞號，這裡會是 2 筆
  await keywordInput(page).fill(newCode)
  await expectTotal(page, 1)
  await expect(firstRow(page)).toContainText(newCode)
})

// ── E4 表單驗證 ─────────────────────────────────────────────
// 觀念：Validation（欄位級驗證，錯誤不離頁）。
test('E4 表單驗證：空表單儲存，PRD 六個必填欄位全數把關且停在表單頁', async ({ page }) => {
  await page.goto(`${LIST}/new`)

  // v2 補假綠前先確認兩個「有預設值」的必填欄位（PRD 第 2 節：數量必填 ≥ 0、狀態預設「正常」）。
  // 它們不會在空表單觸發紅字，是因為預設值本身就是合法值——這一點要驗出來，不能默認。
  await expect(page.locator('[data-field="qty"] input')).toHaveValue(/^0*$/)
  await expect(page.locator('[data-field="status"]')).toContainText(/正常/)

  await page.getByRole('button', { name: /儲存/ }).click()

  // v1 只驗了「分類」一個欄位——其餘 3 個必填漏寫驗證也照樣全綠。
  // v2 逐欄斷言：每個必填欄位自己的容器裡都要出現非空的錯誤訊息。
  for (const field of ['categoryKey', 'name', 'unit', 'spec1']) {
    await expect(fieldError(page, field), `必填欄位 ${field} 應顯示欄位級錯誤`).toBeVisible()
    await expect(fieldError(page, field)).not.toHaveText('')
  }
  // 分類的訊息要看得出是「請選分類」這件事（模糊比對，不綁逐字）
  await expect(fieldError(page, 'categoryKey')).toHaveText(/分類/)

  // toast「請修正 N 個欄位」，且仍停在新增頁（未離頁）
  await expect(page.getByText(/請修正\s*\d+\s*個欄位/)).toBeVisible()
  await expect(page).toHaveURL(/\/equipment\/crud\/new/)
})

// ── E5 刪除確認 ─────────────────────────────────────────────
// 觀念：Delete（二次確認：取消不動、確認才刪）。
test('E5 刪除確認：取消不變、確認後 -1 且該編碼從表格消失', async ({ page }) => {
  await page.goto(LIST)
  const total = await readTotal(page)

  // 先記下第一列的品項編碼，稍後據以斷言「這一筆真的被刪掉了」
  const code = await firstRowCode(page)
  await expect(page.locator('table')).toContainText(code)

  // 桌機表格第一列的刪除鈕（scope 到表格列，避免命中手機卡片同名鈕）
  await firstRow(page).getByRole('button', { name: /刪除/ }).click()
  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toBeVisible()
  // 確認框要「寫明動作」（PRD 第 6 節第 8 條）——模糊比對，不綁「刪除品項」四個字
  await expect(dialog).toContainText(/刪除/)

  // 取消 → 筆數不變、編碼仍在
  await dialog.getByRole('button', { name: /取消/ }).click()
  await expect(dialog).toBeHidden()
  await expectTotal(page, total)
  await expect(page.locator('table')).toContainText(code)

  // 再刪一次 → 按確認 → 筆數 -1，且該編碼不再出現於表格
  await firstRow(page).getByRole('button', { name: /刪除/ }).click()
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: /^刪除/ }).click()
  await expect(page.getByText(/已刪除/).first()).toBeVisible()
  await expectTotal(page, total - 1)
  await expect(page.locator('table').getByText(code, { exact: true })).toHaveCount(0)
})

// ── E6 範本不回歸 ───────────────────────────────────────────
// 觀念：Regression（新模組不能改壞被複製的人員 CRUD 範本）。
test('E6 範本不回歸：人員範本列表可用，且點得進檢視頁看到資料', async ({ page }) => {
  await page.goto(TEMPLATE_LIST)

  // v1 只看「有一張 table＋共 N 筆」——人員表單整個壞死也照樣綠。
  // v2 加上「真的點進去一筆」，讓回歸測試驗到路由與資料層。
  await expect(page.locator('table')).toBeVisible()
  const total = await readTotal(page)
  expect(total, '人員範本應該還有種子資料').toBeGreaterThan(0)

  const templateRow = page.locator('table tbody tr').first()
  const rowText = (await templateRow.innerText()).trim()
  expect(rowText, '人員範本第一列不該是空的').not.toBe('')

  await templateRow.getByRole('button', { name: /檢視/ }).click()
  await expect(page).toHaveURL(/\/template\/crud\/[^/?]+/)

  // 檢視頁要真的把那一筆的內容渲染出來（不是白頁、不是錯誤頁）
  const firstCell = rowText.split(/[\n\t]+/).map(s => s.trim()).filter(Boolean)[0]
  await expect(page.getByText(firstCell, { exact: false }).first()).toBeVisible()
})

// ── E7 編輯品項 ─────────────────────────────────────────────
// 觀念：Update（編輯既有品項：改數量＋存放地點，儲存後回列表可查得新值）。
test('E7 編輯品項：改第一列數量與存放地點，儲存後新值生效', async ({ page }) => {
  const NEW_QTY = '77'
  const NEW_LOCATION = 'E7 測試存放區'

  await page.goto(LIST)
  await readTotal(page)

  // 記下第一列編碼（僅改數量／地點，不動分類與項目 → 編碼會保留，稍後據以查回這一筆）
  const code = await firstRowCode(page)

  await firstRow(page).getByRole('button', { name: /編輯/ }).click()
  // 只要求「進到這一筆的表單頁」，不綁 ?mode=edit 這種路由實作細節
  await expect(page).toHaveURL(/\/equipment\/crud\/(?!new)[^/]+/)
  await expect(page.locator('[data-field="qty"] input')).toBeVisible()

  await page.locator('[data-field="qty"] input').fill(NEW_QTY)
  await page.locator('[data-field="locationName"] input').fill(NEW_LOCATION)

  await page.getByRole('button', { name: /儲存/ }).click()

  // 回列表、成功提示（模糊比對）
  await expect(page).toHaveURL(/\/equipment\/crud(\?|$)/)
  await expect(page.getByText(/已儲存|儲存成功/).first()).toBeVisible()

  // 用編碼查回這一筆，斷言新值已生效（讀整列文字，不綁欄位在第幾格）
  await keywordInput(page).fill(code)
  await expectTotal(page, 1)
  const hitText = (await firstRow(page).innerText()).replace(/\s+/g, ' ')
  expect(hitText).toContain(code)
  expect(hitText, `列文字應包含新數量 ${NEW_QTY}`).toContain(NEW_QTY)
  expect(hitText, `列文字應包含新存放地點 ${NEW_LOCATION}`).toContain(NEW_LOCATION)
})
