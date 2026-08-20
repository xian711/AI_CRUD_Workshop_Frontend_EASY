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
 * v2 改成四條原則：
 *   1. 能用語意就用語意：按鈕用 role + 可及名稱，不綁 placeholder 與逐字文案。
 *   2. 只驗 PRD 承諾過的事。PRD 沒寫的一律不驗——
 *      編碼的「格式」不驗（PRD D3 說格式由學員拍板，只承諾即時產生＋不重複）；
 *      新增／刪除／編輯的「成功提示」不驗（PRD 只規定驗證失敗要有 toast），
 *      改用 URL、總筆數、資料內容這三種「結果」當證據。
 *   3. 數字看 PRD 有沒有定：PRD 2.1.1 定死種子 24 筆、第 4 節定死每頁 20 筆，
 *      這兩個就驗死（不驗死等於放過「分頁失效」這種假綠）；
 *      其餘筆數變化一律動態讀基準再比對，不寫死。
 *   4. 真的沒有語意可用時，才用 data-testid——而且那幾個掛載點寫進 PRD 第 2.1 節，
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
/** PRD 2.1.1 節：種子資料約定為 24 筆（>20，才驗得到分頁） */
const SEED_TOTAL = 24

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
test('E1 列表載入：種子 24 筆、桌機表格、第一頁恰好 20 列', async ({ page }) => {
  await page.goto(LIST)

  // PRD 2.1.1：種子恰為 24 筆。
  // 為什麼要驗死 24 而不是「> 0」：只驗 > 0 的話，種子被改成 10 筆、第一頁也剛好 10 列，
  // 「min(總筆數, 20)」那種寫法會照樣亮綠——分頁根本沒被驗到。
  const total = await readTotal(page)
  expect(total, 'PRD 2.1.1：種子資料約定為 24 筆').toBe(SEED_TOTAL)
  expect(total, '種子筆數必須多於一頁，分頁才驗得到').toBeGreaterThan(PAGE_SIZE)

  await expect(page.locator('table')).toBeVisible()

  // PRD 4 節：預設每頁 20 筆。第一頁的列數必須「恰好」20——
  // 分頁若整個失效（24 筆一次全倒進表格），這一條就會紅。
  await expect(rows(page), 'PRD 4 節：預設每頁 20 筆，第一頁應恰好 20 列').toHaveCount(PAGE_SIZE)

  // 每一列都要有品項編碼（代表資料真的渲染出來，不是空殼表格）
  expect(await firstRowCode(page), '第一列讀不到品項編碼').not.toBe('')
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
test('E3 新增品項：連動下拉、編碼即時產生且不重複、儲存後筆數 +1', async ({ page }) => {
  await page.goto(LIST)
  const before = await readTotal(page)

  await page.getByRole('button', { name: /新增/ }).click()
  await expect(page).toHaveURL(/\/equipment\/crud\/new/)

  // 分類 → 項目（連動）。這兩個名稱來自 PRD 第 3 節的分類與標準項目表，屬於規格。
  await pickOption(page, page.locator('[data-field="categoryKey"]'), '供電及照明設備')
  await pickOption(page, page.locator('[data-field="name"]'), '發電機')

  // 編碼：PRD 第 5 節 D3 只承諾兩件事——「選定分類＋項目後即時算得出來」與「同一份清冊不重複」。
  // 格式（幾碼、要不要項目碼、用不用連字號、是不是 ASCII）由學員拍板，這裡一個字都不驗。
  // 連「長度 ≥ 3」「只能英數」都不驗——那會讓合法的「裝備-1」被判紅。
  const codeInput = page.locator('[data-field="code"] input')
  await expect(codeInput, 'PRD D3：選定分類＋項目後應即時算出編碼').not.toHaveValue('')
  const newCode = (await codeInput.inputValue()).trim()
  expect(newCode, 'PRD D3：編碼不可為空白').not.toBe('')

  // 必填其餘欄位
  await page.locator('[data-field="qty"] input').fill('5')
  await page.locator('[data-field="unit"] input').fill('台')
  await page.locator('[data-field="spec1"] textarea').fill('汽油發電機 3kW 測試資料')

  await page.getByRole('button', { name: /儲存/ }).click()

  // 用「結果」驗成功，不驗成功提示的文字。
  // PRD 只規定「驗證失敗」要有 toast（第 4 節）；新增成功要不要跳 toast、跳什麼字，PRD 沒承諾。
  // 所以這裡只看三件 PRD 真的要求的事：回到列表（第 6 節第 6 條）、筆數 +1、查得回那一筆。
  await expect(page).toHaveURL(/\/equipment\/crud(\?|$)/)
  await expectTotal(page, before + 1)

  // 「不重複」：用新編碼搜尋應恰好 1 筆——若跟既有資料撞號，這裡會是 2 筆
  await keywordInput(page).fill(newCode)
  await expectTotal(page, 1)
  await expect(firstRow(page)).toContainText(newCode)
})

// ── E4 表單驗證 ─────────────────────────────────────────────
// 觀念：Validation（欄位級驗證，錯誤不離頁）。
test('E4 表單驗證：PRD 六個必填欄位逐欄把關，錯誤不離頁', async ({ page }) => {
  const save = () => page.getByRole('button', { name: /儲存/ }).click()
  const qtyInput = page.locator('[data-field="qty"] input')

  await page.goto(`${LIST}/new`)

  // ── (0) 兩個「有預設值」的必填欄位，預設值本身必須合法 ───────────────
  // PRD 第 2 節：數量必填、≥ 0；狀態必填、預設「正常」。
  // 注意：這裡用 toHaveValue('0') 精確比對。
  // 曾經寫成 /^0*$/ 是個假綠——`*` 是「零個以上」，空字串也會通過，
  // 等於「數量預設值壞成空白」這種缺陷會被放行。
  await expect(qtyInput, 'PRD 2 節：數量預設值應為 0').toHaveValue('0')
  await expect(page.locator('[data-field="status"]'), 'PRD 2 節：狀態預設「正常」').toContainText(/正常/)

  // ── (1) 空表單直接儲存 → 沒有預設值的四個必填欄位各自報錯 ─────────────
  await save()
  for (const field of ['categoryKey', 'name', 'unit', 'spec1']) {
    await expect(fieldError(page, field), `必填欄位 ${field} 應顯示欄位級錯誤`).toBeVisible()
    await expect(fieldError(page, field)).not.toHaveText('')
  }
  // 分類的訊息要看得出是在講「分類」這件事（模糊比對，不綁逐字）
  await expect(fieldError(page, 'categoryKey')).toHaveText(/分類/)
  await expect(page.getByText(/請修正\s*\d+\s*個欄位/), 'PRD 4 節：驗證失敗要有 toast').toBeVisible()
  await expect(page, 'PRD 4 節：驗證失敗不離頁').toHaveURL(/\/equipment\/crud\/new/)

  // ── (2) 把每一個必填欄位「弄成不合法」再存一次，逐欄確認真的有守門 ──────
  // 為什麼要做這一段：只靠 (1) 的空表單，證明的是「初始狀態會報錯」，
  // 不能證明「使用者清掉之後也會被擋」，更完全驗不到有預設值的 qty。

  // 單位／規格說明：填了再清空
  await page.locator('[data-field="unit"] input').fill('台')
  await page.locator('[data-field="spec1"] textarea').fill('測試規格說明')
  await expect(fieldError(page, 'unit')).toHaveCount(0)
  await expect(fieldError(page, 'spec1')).toHaveCount(0)
  await page.locator('[data-field="unit"] input').fill('')
  await page.locator('[data-field="spec1"] textarea').fill('')
  await save()
  await expect(fieldError(page, 'unit'), '單位清空後應被擋下').toBeVisible()
  await expect(fieldError(page, 'spec1'), '規格說明清空後應被擋下').toBeVisible()

  // 數量：清空 → 必填要擋。
  // 斷言錯誤訊息「看得出是在講數量」，而不是只看有沒有紅字——
  // 只驗 toBeVisible 的話，萬一那個 <p> 是別的東西渲染出來的，這條就白驗了。
  await qtyInput.fill('')
  await save()
  await expect(fieldError(page, 'qty'), 'PRD 2 節：數量必填，清空應被擋下').toBeVisible()
  await expect(fieldError(page, 'qty')).toHaveText(/數量/)

  // 數量：負數 → 「≥ 0」要擋
  await qtyInput.fill('-1')
  await save()
  await expect(fieldError(page, 'qty'), 'PRD 2 節：數量 ≥ 0，負數應被擋下').toBeVisible()
  await expect(fieldError(page, 'qty')).toHaveText(/數量/)

  // 全程都沒有離開新增頁
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
  // 一樣用「結果」驗成功：PRD 第 6 節第 8 條只要求「經二次確認才生效」，
  // 沒有承諾刪除成功要跳 toast、更沒有規定文案。所以只驗筆數 -1、那筆真的不見了。
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

  // 回列表（PRD 第 4 節「編輯」：儲存寫回並返回列表）。
  // 一樣不驗成功提示的文字——PRD 沒承諾編輯成功要跳 toast，用資料生效當證據就夠了。
  await expect(page).toHaveURL(/\/equipment\/crud(\?|$)/)

  // 用編碼查回這一筆，斷言新值已生效（讀整列文字，不綁欄位在第幾格）
  await keywordInput(page).fill(code)
  await expectTotal(page, 1)
  const hitText = (await firstRow(page).innerText()).replace(/\s+/g, ' ')
  expect(hitText).toContain(code)
  expect(hitText, `列文字應包含新數量 ${NEW_QTY}`).toContain(NEW_QTY)
  expect(hitText, `列文字應包含新存放地點 ${NEW_LOCATION}`).toContain(NEW_LOCATION)
})
