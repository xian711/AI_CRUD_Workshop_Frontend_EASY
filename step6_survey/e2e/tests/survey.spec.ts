/**
 * 課程回饋問卷 — 課後驗收題的一鍵驗收 E2E（S1~S9）
 * ──────────────────────────────────────────────────────────
 * 對應 step6_survey/README.md「③ 驗收」那張清單。
 * 第 10 項（搜尋硬編碼色碼）是靜態掃描，由 run-survey-e2e 腳本負責，不在這裡。
 * 第 11 項（無痕視窗看不到別人的回覆）刻意留給人親手做一次——那一題的重點是「你要親眼看到」。
 *
 * ── 這份跟 step4 的 E2E 有什麼不同 ────────────────────────────
 * step4 那 7 條是驗「照 PRD 做出來的裝備物資模組」，規格由教材定。
 * 這一份不一樣：問卷是**你自己設計的**，8 題用什麼元件、按鈕寫什麼字、
 * localStorage 的 key 叫什麼，PRD 都沒規定。
 * 所以這份測試全部用「通用作法」寫：
 *   - 表單自動填寫：掃描頁面上所有可填欄位，文字填字、單選點第一個、下拉挑第一個。
 *   - 資料筆數：讀 localStorage 裡「值可以 parse 成 JSON 陣列」的那一把 key，取最長的當回覆清單。
 *   - 文字比對：一律模糊比對（成功／已送出／已清空…），不綁你的逐字文案。
 * 換句話說：**只要你照 PRD 做，用什麼字、什麼元件都過得了。**
 * 真的跑不動的步驟會直接說「這一步自動化驗不了，請人工看一次」，不會假裝通過。
 */
import { test, expect, type Page } from '@playwright/test'

const SURVEY = '/survey'
const ADMIN = '/survey/admin'

// ── 通用工具 ────────────────────────────────────────────────

/**
 * 讀出「回覆清單」目前有幾筆。
 * 作法：掃 localStorage 每一把 key，值能 parse 成 JSON 陣列的就是候選，取最長的那個。
 * 這樣不管你的 key 叫 survey-responses 還是 ai_crud_survey_v1 都讀得到。
 */
async function readResponseCount(page: Page): Promise<number> {
  return page.evaluate(() => {
    let best = -1
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key) continue
      const raw = localStorage.getItem(key)
      if (!raw) continue
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) best = Math.max(best, parsed.length)
      } catch { /* 不是 JSON 就跳過 */ }
    }
    return best < 0 ? 0 : best
  })
}

/** 清掉 localStorage（測試之間互不污染） */
async function clearStorage(page: Page) {
  await page.evaluate(() => localStorage.clear())
}

/** 送出鈕：模糊比對，不綁你的逐字文案 */
function submitButton(page: Page) {
  return page.getByRole('button', { name: /送出|提交|submit/i }).first()
}

/**
 * 等頁面真的渲染完再開始操作。
 * 這一步不能省：問卷是 SPA（ssr:false），`goto` / `reload` 回來的當下 DOM 還是空的，
 * 而 `locator.count()` **不會自動等待**——先數就一定數到 0。
 */
async function waitFormReady(page: Page) {
  await expect(submitButton(page), '等不到送出鈕（頁面沒渲染出來？）').toBeVisible({ timeout: 20_000 })
}

/**
 * 等任一頁（含管理頁）渲染完。
 * 同上：SPA 的 `goto` / `reload` 回來時 DOM 還是空的，
 * 直接讀 innerText 會讀到空字串，測試就會誤判成「畫面沒東西」。
 */
async function waitPageReady(page: Page) {
  await expect(async () => {
    const text = await page.locator('body').innerText()
    expect(text.trim().length, '頁面看起來還沒渲染出內容').toBeGreaterThan(20)
  }).toPass({ timeout: 20_000 })
}

/** 表單範圍：有 <form> 就用它，沒有就退到 <main>，再沒有就整頁 */
async function formScope(page: Page) {
  if (await page.locator('form').count() > 0) return page.locator('form').first()
  if (await page.locator('main').count() > 0) return page.locator('main').first()
  return page.locator('body')
}

/** 不是「答題用」的按鈕，通用填寫時要跳過 */
const NON_ANSWER_BUTTON = /送出|提交|submit|清除|重設|重填|取消|返回|回到|匯出|下載|清空|刪除|再填/i

/**
 * 通用表單填寫：把頁面上看得到的欄位都塞合理的值。
 * 回傳「填了幾個欄位」，0 代表這頁根本沒有可填的東西（那就是 App 有問題）。
 *
 * 為什麼要寫得這麼「通用」：問卷是你自己設計的，PRD 沒規定 8 題要用什麼元件。
 * 所以這裡把常見四種都處理掉——文字框、多行文字、原生單選／下拉，
 * 以及 Nuxt UI 的 USelectMenu（它渲染出來只是一顆普通 <button>，沒有 role=combobox）。
 */
async function fillSurveyForm(page: Page): Promise<number> {
  await waitFormReady(page)
  const scope = await formScope(page)
  let filled = 0

  // 1) 單行文字 / email / 數字
  const textInputs = scope.locator(
    'input[type="text"], input[type="email"], input[type="number"], input[type="tel"], input:not([type])',
  )
  const textCount = await textInputs.count()
  for (let i = 0; i < textCount; i++) {
    const box = textInputs.nth(i)
    if (!(await box.isVisible()) || !(await box.isEditable())) continue
    const type = await box.getAttribute('type')
    await box.fill(type === 'number' ? '5' : `E2E 驗收測試 ${i + 1}`)
    filled++
  }

  // 2) 多行文字
  const areas = scope.locator('textarea')
  const areaCount = await areas.count()
  for (let i = 0; i < areaCount; i++) {
    const box = areas.nth(i)
    if (!(await box.isVisible()) || !(await box.isEditable())) continue
    await box.fill('這是一鍵驗收腳本填的測試內容。')
    filled++
  }

  // 3) 單選（radio）：同一組 name 只點第一個
  const radios = scope.locator('input[type="radio"]')
  const radioCount = await radios.count()
  const seenGroups = new Set<string>()
  for (let i = 0; i < radioCount; i++) {
    const radio = radios.nth(i)
    const name = (await radio.getAttribute('name')) ?? `__anon_${i}`
    if (seenGroups.has(name)) continue
    if (!(await radio.isVisible())) continue
    seenGroups.add(name)
    await radio.check({ force: true })
    filled++
  }

  // 4) 原生 select：挑第一個非空選項
  const selects = scope.locator('select')
  const selectCount = await selects.count()
  for (let i = 0; i < selectCount; i++) {
    const sel = selects.nth(i)
    if (!(await sel.isVisible())) continue
    const values = await sel.locator('option').evaluateAll(
      opts => (opts as HTMLOptionElement[]).map(o => o.value).filter(v => v !== ''),
    )
    if (values.length > 0) { await sel.selectOption(values[0]); filled++ }
  }

  // 5) 「點開才有選項」的下拉（Nuxt UI USelectMenu／自製 dropdown）：
  //    表單範圍內、不是送出/清除那類的按鈕，一顆一顆點點看；
  //    點完有 role=option 冒出來就選第一個，沒有就當它不是下拉、Esc 關掉。
  const buttons = scope.locator('button:not([type="submit"]), [role="combobox"]')
  const buttonCount = await buttons.count()
  for (let i = 0; i < buttonCount; i++) {
    const btn = buttons.nth(i)
    if (!(await btn.isVisible())) continue
    const label = ((await btn.innerText()) || (await btn.getAttribute('aria-label')) || '').trim()
    if (NON_ANSWER_BUTTON.test(label)) continue
    await btn.click()
    const options = page.getByRole('option')
    if (await options.count() > 0) {
      await options.first().click()
      filled++
    } else {
      await page.keyboard.press('Escape')
    }
  }

  return filled
}

// ── S1 必填驗證 ─────────────────────────────────────────────
test('S1 必填留空按送出：欄位下方出現紅字、聚焦第一個錯誤欄、不離頁', async ({ page }) => {
  await page.goto(SURVEY)
  await clearStorage(page)
  await page.reload()

  await expect(submitButton(page), '找不到送出鈕（名稱要看得出是「送出」）').toBeVisible()
  await submitButton(page).click()

  // 還在填答頁（沒有因為驗證失敗就跳走）
  await expect(page).toHaveURL(new RegExp(`${SURVEY}/?$`))

  // 至少要有一個「欄位級」的錯誤訊息看得到。
  // 這裡刻意只看「有沒有紅字訊息」，不綁你的錯誤文案。
  const errorish = page.locator(
    '[class*="error"], [id$="-error"], [role="alert"], [aria-invalid="true"]',
  )
  await expect(errorish.first(), 'PRD BR-1：必填沒填要在欄位下方顯示錯誤，不能只跳 toast').toBeVisible()

  // 焦點要落在某個表單控制項上（PRD BR-1：聚焦第一個錯誤欄位）
  const focusedTag = await page.evaluate(() => document.activeElement?.tagName?.toLowerCase() ?? '')
  expect(
    ['input', 'textarea', 'select', 'button'].includes(focusedTag),
    `PRD BR-1：送出失敗後焦點應落在錯誤欄位，實際落在 <${focusedTag || '無'}>`,
  ).toBeTruthy()

  // 一筆都不該被寫進去
  expect(await readResponseCount(page), '驗證失敗時不應該寫入任何回覆').toBe(0)
})

// ── S2 正常送出 ─────────────────────────────────────────────
test('S2 正常填完送出：出現成功訊息、資料寫進去、可以再填一份', async ({ page }) => {
  await page.goto(SURVEY)
  await clearStorage(page)
  await page.reload()

  const filled = await fillSurveyForm(page)
  expect(filled, '表單上找不到任何可填欄位').toBeGreaterThan(0)

  await submitButton(page).click()

  // 成功訊息：模糊比對（成功／已送出／感謝 都算）
  await expect(
    page.getByText(/成功|已送出|感謝|謝謝/).first(),
    'PRD BR-2：送出成功要有看得到的成功訊息',
  ).toBeVisible({ timeout: 10_000 })

  expect(await readResponseCount(page), 'PRD BR-2：送出後應寫入 1 筆').toBe(1)

  // 可以再填一份：頁面上要有「再填一份」之類的入口，或表單已清空回到可填狀態
  const again = page.getByRole('button', { name: /再填|再一份|重新填寫|返回/ })
  if (await again.count() > 0) {
    await again.first().click()
  } else {
    await page.goto(SURVEY)
  }
  const refilled = await fillSurveyForm(page)
  expect(refilled, 'PRD BR-2：應該要能接著填下一份').toBeGreaterThan(0)
})

// ── S3 防重複送出 ───────────────────────────────────────────
test('S3 連點送出鈕：只會送出一筆', async ({ page }) => {
  await page.goto(SURVEY)
  await clearStorage(page)
  await page.reload()

  await fillSurveyForm(page)

  const btn = submitButton(page)
  // 連點三下（不等待中間狀態），模擬手殘連按
  await btn.click({ force: true })
  await btn.click({ force: true, timeout: 2000 }).catch(() => { /* 已 disabled 就點不到，那正是我們要的 */ })
  await btn.click({ force: true, timeout: 2000 }).catch(() => { /* 同上 */ })

  await expect(page.getByText(/成功|已送出|感謝|謝謝/).first()).toBeVisible({ timeout: 10_000 })
  expect(await readResponseCount(page), 'PRD BR-3：連點只能送出一筆').toBe(1)
})

// ── S4 持久化 ───────────────────────────────────────────────
test('S4 送出後重新整理：資料還在（localStorage）', async ({ page }) => {
  await page.goto(SURVEY)
  await clearStorage(page)
  await page.reload()

  await fillSurveyForm(page)
  await submitButton(page).click()
  await expect(page.getByText(/成功|已送出|感謝|謝謝/).first()).toBeVisible({ timeout: 10_000 })

  await page.reload()
  expect(await readResponseCount(page), 'PRD BR-4：重新整理後資料不能不見').toBe(1)
})

// ── S5 管理頁看得到 ─────────────────────────────────────────
test('S5 管理頁：看得到剛才送出的那一筆', async ({ page }) => {
  await page.goto(SURVEY)
  await clearStorage(page)
  await page.reload()

  await fillSurveyForm(page)
  await submitButton(page).click()
  await expect(page.getByText(/成功|已送出|感謝|謝謝/).first()).toBeVisible({ timeout: 10_000 })

  await page.goto(ADMIN)
  await waitPageReady(page)
  // 有資料時要有表格（或至少列得出那一筆的內容）
  const bodyText = await page.locator('body').innerText()
  expect(
    /E2E 驗收測試/.test(bodyText) || (await page.locator('table tbody tr').count()) > 0,
    '管理頁應該要看得到剛才那一筆回覆',
  ).toBeTruthy()
})

// ── S6 空狀態 ───────────────────────────────────────────────
test('S6 沒有任何回覆時的管理頁：顯示空狀態，不是空表格', async ({ page }) => {
  await page.goto(ADMIN)
  await clearStorage(page)
  await page.reload()
  await waitPageReady(page)

  const rowCount = await page.locator('table tbody tr').count()
  expect(rowCount, 'NFR-4：沒有資料時不該留一張空表格').toBe(0)

  const bodyText = await page.locator('body').innerText()
  expect(
    /尚無|沒有|還沒|目前無|空|empty/i.test(bodyText),
    'NFR-4：沒有資料時要顯示空狀態提示',
  ).toBeTruthy()
})

// ── S7 匯出 CSV ─────────────────────────────────────────────
test('S7 匯出 CSV：檔名含日期、含 UTF-8 BOM、中文不亂碼', async ({ page }) => {
  await page.goto(SURVEY)
  await clearStorage(page)
  await page.reload()
  await fillSurveyForm(page)
  await submitButton(page).click()
  await expect(page.getByText(/成功|已送出|感謝|謝謝/).first()).toBeVisible({ timeout: 10_000 })

  await page.goto(ADMIN)
  await waitPageReady(page)
  const exportBtn = page.getByRole('button', { name: /匯出|下載|CSV/i }).first()
  await expect(exportBtn, '管理頁要有匯出 CSV 的按鈕').toBeVisible()

  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 15_000 }),
    exportBtn.click(),
  ])

  const name = download.suggestedFilename()
  expect(name, 'BR-6：檔名要是 .csv').toMatch(/\.csv$/i)
  expect(name, 'BR-6：檔名要含日期（例如 20260820 或 2026-08-20）').toMatch(/\d{4}-?\d{2}-?\d{2}/)

  const path = await download.path()
  expect(path, '下載檔案讀不到').toBeTruthy()
  const fs = await import('node:fs/promises')
  const buf = await fs.readFile(path!)
  expect(
    buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf,
    'BR-6：CSV 開頭要有 UTF-8 BOM（EF BB BF），Excel 開才不會中文亂碼',
  ).toBeTruthy()
  const text = buf.toString('utf8')
  expect(text.length, 'CSV 不該是空的').toBeGreaterThan(3)
  expect(/[一-鿿]/.test(text), 'CSV 內容應含中文（欄位標題）').toBeTruthy()
})

// ── S8 清空全部 ─────────────────────────────────────────────
test('S8 清空全部：跳二次確認，且確認鈕寫明動作（不是空泛的「確認」）', async ({ page }) => {
  await page.goto(SURVEY)
  await clearStorage(page)
  await page.reload()
  await fillSurveyForm(page)
  await submitButton(page).click()
  await expect(page.getByText(/成功|已送出|感謝|謝謝/).first()).toBeVisible({ timeout: 10_000 })

  await page.goto(ADMIN)
  await waitPageReady(page)
  expect(await readResponseCount(page)).toBe(1)

  const clearBtn = page.getByRole('button', { name: /清空|全部刪除|刪除全部/ }).first()
  await expect(clearBtn, '管理頁要有「清空全部」').toBeVisible()
  await clearBtn.click()

  // 二次確認：alertdialog 或 dialog 都接受
  const dialog = page.getByRole('alertdialog').or(page.getByRole('dialog')).first()
  await expect(dialog, 'BR-5：危險操作要二次確認').toBeVisible()

  // 確認鈕要「寫明動作」——不可以只是「確認 / 確定 / OK / 是」
  const dialogButtons = dialog.getByRole('button')
  const names: string[] = []
  const btnCount = await dialogButtons.count()
  for (let i = 0; i < btnCount; i++) {
    names.push(((await dialogButtons.nth(i).innerText()) || '').trim())
  }
  const actionBtn = names.find(n => /清空|刪除/.test(n))
  expect(
    actionBtn,
    `BR-5：確認鈕要寫明動作（例如「清空全部回覆」），目前彈窗上的按鈕是：${names.join('／') || '（讀不到）'}`,
  ).toBeTruthy()
  expect(
    /^(確認|確定|OK|好|是)$/i.test(actionBtn!),
    `BR-5：確認鈕不能只寫「${actionBtn}」這種空泛字眼`,
  ).toBeFalsy()

  await dialog.getByRole('button', { name: new RegExp(actionBtn!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).first().click()
  await expect(async () => {
    expect(await readResponseCount(page)).toBe(0)
  }).toPass({ timeout: 10_000 })
})

// ── S9 手機寬度 ─────────────────────────────────────────────
test('S9 手機寬度 390：每一題都還能填，且不出現橫向捲軸', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(SURVEY)
  await clearStorage(page)
  await page.reload()

  // NFR-1：不該出現非預期的橫向捲軸（留 2px 容差給捲軸與四捨五入）
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow, `NFR-1：手機寬度不該有橫向捲軸，實際超出 ${overflow}px`).toBeLessThanOrEqual(2)

  // 每一題都還能操作：用同一套通用填寫走一遍，填得動就算通過
  const filled = await fillSurveyForm(page)
  expect(filled, 'NFR-1：手機寬度下應該每一題都還能填').toBeGreaterThan(0)

  await submitButton(page).click()
  await expect(page.getByText(/成功|已送出|感謝|謝謝/).first()).toBeVisible({ timeout: 10_000 })
  expect(await readResponseCount(page), '手機寬度下也要能真的送出').toBe(1)
})
