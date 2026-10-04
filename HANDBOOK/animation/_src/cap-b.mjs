// 瀏覽器實拍：手冊、step1 兩版示範、Design System、範本 App（五個檢查點＋加分兩件）
// 執行：node cap-b.mjs（只拍某幾段：ONLY=hb,s1 node cap-b.mjs）。App 段需要 http://localhost:3100 在跑。
import fs from 'node:fs'
const { chromium } = await import('file:///D:/AIWORK/pw-shots-tmp/node_modules/playwright/index.mjs')
const W = 'D:/AIWORK/pw-shots-tmp/crud-anim-2026-10-04', RAW = W + '/raw', LAB = 'D:/AI_CRUD_Workshop_Frontend_EASY'
const META = RAW + '/meta.json'
const meta = fs.existsSync(META) ? JSON.parse(fs.readFileSync(META, 'utf8')) : {}
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null
const want = k => !ONLY || ONLY.includes(k)
const VP = { width: Number(process.env.VW || 1000), height: Math.round(Number(process.env.VW || 1000) * 706 / 1360) }
const sleep = ms => new Promise(r => setTimeout(r, ms))
const fileUrl = p => 'file:///' + p.replace(/\\/g, '/')

const b = await chromium.launch()
const ctx = await b.newContext({ viewport: VP, deviceScaleFactor: 1.9, acceptDownloads: true, locale: 'zh-TW' })
const p = await ctx.newPage(); p.setDefaultTimeout(15000)
async function bx(pg, sel, opt = {}) {
  if (sel == null) return null
  if (Array.isArray(sel) && typeof sel[0] === 'number') return sel
  let loc = typeof sel === 'string' ? pg.locator(sel) : sel
  if (opt.hasText) loc = loc.filter({ hasText: opt.hasText })
  loc = loc.nth(opt.nth ?? 0)
  const r = await loc.boundingBox({ timeout: 2000 }).catch(() => null)
  return r ? [r.x, r.y, r.width, r.height].map(Math.round) : null
}
async function shot(name, boxes = {}, pg = p) {
  const out = {}
  for (const [k, v] of Object.entries(boxes)) out[k] = Array.isArray(v) && typeof v[0] !== 'number' ? await bx(pg, v[0], v[1]) : await bx(pg, v)
  await pg.screenshot({ path: `${RAW}/${name}.png` })
  const vp = pg.viewportSize()
  meta[name] = { w: vp.width, h: vp.height, url: pg.url(), boxes: out }
  fs.writeFileSync(META, JSON.stringify(meta, null, 1))
  const miss = Object.entries(out).filter(([, v]) => !v).map(([k]) => k)
  console.log('[shot]', name, miss.length ? `（找不到：${miss.join(', ')}）` : '')
}

try {
  // ── 手冊 HANDBOOK.html ──
  if (want('hb')) {
    await p.goto(fileUrl(LAB + '/HANDBOOK/HANDBOOK.html')); await sleep(1200)
    await shot('br01-handbook-top', { nav: 'header.topnav nav', hero: '.hero-card', step0: ['header.topnav nav a', { hasText: 'Step 0' }], outline: '.outline table' })
    await p.locator('#step0').evaluate(e => e.scrollIntoView({ block: 'start' })); await sleep(800)
    await shot('br02-handbook-step0', { head: '#step0 .step-head', goal: '#step0 .goal', nav: 'header.topnav nav' })
    await p.locator('#step3 .goal').evaluate(e => { e.scrollIntoView({ block: 'start' }); window.scrollBy(0, -140) }); await sleep(800)
    await shot('br03-handbook-step3', { goal: '#step3 .goal', nav: 'header.topnav nav' })
    // step3 起手 prompt 的程式碼區塊
    const pre = p.locator('#step3 pre').nth(2)
    await pre.evaluate(e => { e.scrollIntoView({ block: 'start' }); window.scrollBy(0, -120) }); await sleep(800)
    await shot('br04-handbook-prompt', { pre })
  }
  // ── step1：同一句需求的兩版 ──
  if (want('s1')) {
    await p.goto(fileUrl(LAB + '/step1_why_harness/demo/no-harness.html')); await sleep(1000)
    await shot('br10-noh', { h1: 'h1', form: 'form', blood: '#blood', phone: '#phone', add: '.btn-add', table: 'table' })
    await p.fill('#name', '王小明'); await p.fill('#phone', '(02) 1234-5678'); await sleep(300)
    await shot('br11-noh-filled', { blood: '#blood', phone: '#phone', add: '.btn-add' })
    await p.click('.btn-add'); await sleep(800)
    await shot('br12-noh-added', { table: 'table', row: 'table tbody tr', blood: '#blood' })
    await p.goto(fileUrl(LAB + '/step1_why_harness/demo/with-harness.html')); await sleep(1000)
    await shot('br13-wh', { h1: 'h1', form: 'form', blood: '#blood-type-select', phone: '#phone-input', add: '#submit-btn', stars: '.required-mark' })
    await p.click('#submit-btn'); await sleep(800)
    await shot('br14-wh-empty-submit', { blood: '#blood-type-select', bloodErr: '#blood-type-error', nameErr: '#name-error', phoneErr: '#phone-error', add: '#submit-btn' })
    await p.fill('#name-input', '王小明'); await p.fill('#phone-input', '(02) 1234-5678'); await p.click('#submit-btn'); await sleep(800)
    await shot('br15-wh-phone-blocked', { phone: '#phone-input', phoneErr: '#phone-error', bloodErr: '#blood-type-error' })
  }
  // ── Design System ──
  if (want('ds')) {
    await p.goto(fileUrl(LAB + '/step2_speedrun_kit/2.2_design_system/DESIGN_SYSTEM.html')); await sleep(1500)
    await shot('br20-design-system', { h1: 'h1', body: 'body' })
    console.log('ds headings', await p.$$eval('h2', els => els.map(e => e.textContent.trim()).slice(0, 12)))
  }
  // ── 範本 App：五個檢查點 ──
  if (want('app')) {
    const base = 'http://localhost:3100'
    await p.goto(base + '/template/crud', { waitUntil: 'networkidle' }); await sleep(1500)
    const btn = t => p.getByRole('button', { name: t })
    await shot('br30-list', { title: 'h1', add: btn('新增人員'), filters: '.space-y-1 >> nth=0', q: 'input[placeholder="姓名／電話／Email"]', count: ['p', { hasText: /^共 \d+ 筆$/ }], exp: btn('匯出 CSV'), table: 'table', trash: 'button[aria-label="刪除"]' })
    // ① 新增
    await btn('新增人員').first().click(); await p.waitForURL('**/template/crud/new'); await sleep(1200)
    await shot('br31-new-empty', { title: 'h1', save: btn('儲存'), stars: '.text-error, .text-red-500' })
    await p.getByPlaceholder('請輸入姓名').fill('王小美')
    await p.locator('input[type="date"]').first().fill('1992-05-20')
    await p.getByPlaceholder('例：A123456789').fill('A223456789')
    await p.getByPlaceholder('09xxxxxxxx').fill('0912345678')
    await p.locator('button:has-text("縣市")').first().click(); await sleep(300); await p.getByRole('option', { name: '臺東縣' }).first().click(); await sleep(400)
    await p.locator('button:has-text("鄉鎮市區")').first().click(); await sleep(300); await p.getByRole('option', { name: '臺東市' }).first().click(); await sleep(300)
    await p.getByPlaceholder('門牌 / 段巷弄號（例：439號 B1）').fill('中華路100號')
    await p.locator('button:has-text("請選擇編組")').first().click(); await sleep(300); await p.getByRole('option', { name: '指揮組' }).first().click(); await sleep(400)
    await shot('br32-new-filled', { save: btn('儲存'), name: 'input[placeholder="請輸入姓名"]' })
    await btn('儲存').first().click(); await p.waitForURL(u => !u.href.endsWith('/new')); await sleep(700)
    await shot('br33-saved', { toast: '[role="status"], .z-50 [role="alert"], ol li', edit: btn('編輯'), name: ['text=王小美'] })
    // ② 編輯
    await btn('編輯').first().click(); await sleep(1200)
    await p.getByPlaceholder('補充說明（選填）').fill('第二個檢查點：改一下備註')
    await shot('br34-edit', { note: 'textarea[placeholder="補充說明（選填）"]', save: btn('儲存') })
    // 加分一：清空必填 → 紅字
    await p.getByPlaceholder('請輸入姓名').fill(''); await btn('儲存').first().click(); await sleep(900)
    await shot('br35-validation', { name: 'input[placeholder="請輸入姓名"]', err: ['text=請輸入姓名'], save: btn('儲存') })
    await p.getByPlaceholder('請輸入姓名').fill('王小美'); await btn('儲存').first().click(); await sleep(1200)
    await shot('br36-edited', { note: ['text=第二個檢查點'], edit: btn('編輯') })
    // ③ 刪除二次確認
    await p.goto(base + '/template/crud', { waitUntil: 'networkidle' }); await sleep(1200)
    await p.locator('button[aria-label="刪除"]').nth(1).click(); await sleep(900)
    const dlgPanel = p.getByText('此動作無法復原').locator('xpath=ancestor::div[contains(@class,"rounded")][1]')
    await shot('br37-delete-confirm', { dialog: dlgPanel, title: p.getByText('刪除人員', { exact: true }).last(), msg: p.getByText('此動作無法復原'), ok: p.getByRole('button', { name: '刪除', exact: true }).last(), cancel: p.getByRole('button', { name: '取消', exact: true }).last() })
    await p.getByRole('button', { name: '刪除', exact: true }).last().click(); await sleep(700)
    await shot('br38-deleted', { toast: 'ol li, [role="status"]', count: ['p', { hasText: /^共 \d+ 筆$/ }] })
    // ④ 篩選＋網址
    await p.getByPlaceholder('姓名／電話／Email').fill('陳'); await sleep(900)
    await shot('br39-filter-q', { q: 'input[placeholder="姓名／電話／Email"]', count: ['p', { hasText: /^共 \d+ 筆$/ }], table: 'table' })
    const statusBtn = p.locator('.space-y-1').filter({ hasText: '狀態' }).locator('button').first()
    await statusBtn.click(); await sleep(400)
    const opts = await p.getByRole('option').allTextContents(); console.log('status options', opts)
    await p.getByRole('option').filter({ hasText: '在職' }).first().click().catch(() => {}); await sleep(900)
    const filtered = p.url(); console.log('filtered url', filtered)
    await shot('br40-filter-status', { q: 'input[placeholder="姓名／電話／Email"]', status: statusBtn, count: ['p', { hasText: /^共 \d+ 筆$/ }], table: 'table' })
    const p2 = await ctx.newPage(); await p2.goto(filtered, { waitUntil: 'networkidle' }); await sleep(1500)
    await shot('br41-newtab', { q: 'input[placeholder="姓名／電話／Email"]', count: ['p', { hasText: /^共 \d+ 筆$/ }] }, p2)
    meta['br41-newtab'].url = filtered; fs.writeFileSync(META, JSON.stringify(meta, null, 1))
    await p2.close()
    // ⑤ 匯出 CSV
    const dl = p.waitForEvent('download')
    await btn('匯出 CSV').first().click()
    const d = await dl; const csvPath = RAW + '/export.csv'; await d.saveAs(csvPath); await sleep(500)
    await shot('br42-export', { exp: btn('匯出 CSV'), toast: 'ol li, [role="status"]' })
    const csv = fs.readFileSync(csvPath, 'utf8'); console.log('csv', d.suggestedFilename(), csv.split('\n').length - 1, 'rows; BOM', csv.charCodeAt(0) === 0xfeff)
    // 加分二：手機寬度 → 卡片
    const m = await ctx.newPage(); await m.setViewportSize({ width: 390, height: 780 })
    await m.goto(base + '/template/crud', { waitUntil: 'networkidle' }); await sleep(1500)
    await shot('br43-mobile', { first: 'article, .rounded-lg >> nth=3' }, m)
    await m.close()
  }
} catch (e) {
  console.log('ERROR', e.stack)
  await p.screenshot({ path: RAW + '/_error-b.png' }).catch(() => {})
} finally { await b.close() }
