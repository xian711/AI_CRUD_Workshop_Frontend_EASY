// 第四版實拍：新 App 的驗收畫面（列表、連動下拉、編碼、驗證、刪除、手機）；BASE=http://localhost:3200 node cap-eq.mjs
// 座標寫進 meta-extra.json（避免跟 VS Code 遙控器同時寫 meta.json）；檔名沿用 ea01～ea08，舊圖已備份在 raw-v3bak/
import fs from 'node:fs'
const { chromium } = await import('file:///D:/AIWORK/pw-shots-tmp/node_modules/playwright/index.mjs')
const W = 'D:/AIWORK/pw-shots-tmp/crud-anim-2026-10-04', RAW = W + '/raw', META = RAW + '/meta-extra.json'
const meta = fs.existsSync(META) ? JSON.parse(fs.readFileSync(META, 'utf8')) : {}
const base = process.env.BASE || 'http://localhost:3200'
const VP = { width: 1240, height: Math.round(1240 * 706 / 1360) }
const sleep = ms => new Promise(r => setTimeout(r, ms))
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: VP, deviceScaleFactor: 1.9, acceptDownloads: true, locale: 'zh-TW' })
const p = await ctx.newPage(); p.setDefaultTimeout(15000)
async function bx(pg, sel) {
  if (sel == null) return null
  if (Array.isArray(sel) && typeof sel[0] === 'number') return sel
  const loc = typeof sel === 'string' ? pg.locator(sel).first() : sel
  const r = await loc.boundingBox({ timeout: 2000 }).catch(() => null)
  return r ? [r.x, r.y, r.width, r.height].map(Math.round) : null
}
async function shot(name, boxes = {}, pg = p) {
  const out = {}; for (const [k, v] of Object.entries(boxes)) out[k] = await bx(pg, v)
  await pg.screenshot({ path: `${RAW}/${name}.png` }); const vp = pg.viewportSize()
  meta[name] = { w: vp.width, h: vp.height, url: pg.url(), boxes: out }; fs.writeFileSync(META, JSON.stringify(meta, null, 1))
  const miss = Object.entries(out).filter(([, v]) => !v).map(([k]) => k); console.log('[shot]', name, miss.length ? `（找不到：${miss.join(', ')}）` : '')
}
const btn = t => p.getByRole('button', { name: t })
try {
  await p.goto(base + '/equipment/crud', { waitUntil: 'networkidle' }); await sleep(1500)
  await shot('ea01-list', { title: 'h1', add: btn('新增品項').first(), count: '[data-testid="equipment-total"]', table: 'table', status: 'table tbody tr td .inline-flex, table tbody tr td span[class*="badge"]', code: '[data-testid="equipment-code"]', exp: btn('匯出 CSV').first() })
  await btn('新增品項').first().click(); await p.waitForURL('**/equipment/crud/new'); await sleep(1200)
  await shot('ea02-new-empty', { cat: '[data-field="categoryKey"]', name: '[data-field="name"]', code: '[data-field="code"]', save: btn('儲存').first() })
  await p.locator('[data-field="categoryKey"] button').first().click(); await sleep(500)
  const cats = await p.getByRole('option').allTextContents(); console.log('categories', cats.slice(0, 12))
  await shot('ea03-cat-open', { cat: '[data-field="categoryKey"]', list: '[role="listbox"]' })
  await p.getByRole('option').filter({ hasText: '資通訊設備' }).first().click(); await sleep(600)
  await p.locator('[data-field="name"] button').first().click(); await sleep(500)
  const items = await p.getByRole('option').allTextContents(); console.log('items', items.slice(0, 12))
  await shot('ea04-item-open', { cat: '[data-field="categoryKey"]', name: '[data-field="name"]', list: '[role="listbox"]' })
  await p.getByRole('option').filter({ hasText: '筆記型電腦' }).first().click(); await sleep(800)
  await shot('ea05-code', { cat: '[data-field="categoryKey"]', name: '[data-field="name"]', code: '[data-field="code"]', title: 'h1' })
  await p.goto(base + '/equipment/crud/new', { waitUntil: 'networkidle' }); await sleep(1200)
  await btn('儲存').first().click(); await sleep(1000)
  await shot('ea06-validation', { cat: '[data-field="categoryKey"]', qty: '[data-field="qty"]', unit: '[data-field="unit"]', spec: '[data-field="spec1"]', toast: p.getByText(/請修正/).first(), save: btn('儲存').first() })
  await p.goto(base + '/equipment/crud', { waitUntil: 'networkidle' }); await sleep(1200)
  await p.locator('button[aria-label="刪除"]').first().click(); await sleep(900)
  const dlgPanel = p.getByText('此動作無法復原').locator('xpath=ancestor::div[contains(@class,"rounded")][1]')
  await shot('ea07-delete', { dialog: dlgPanel, title: p.getByText('刪除品項', { exact: true }).last(), ok: p.getByRole('button', { name: '刪除', exact: true }).last(), cancel: p.getByRole('button', { name: '取消', exact: true }).last() })
  await p.getByRole('button', { name: '取消', exact: true }).last().click(); await sleep(500)
  const m = await ctx.newPage(); await m.setViewportSize({ width: 390, height: 780 })
  await m.goto(base + '/equipment/crud', { waitUntil: 'networkidle' }); await sleep(1500)
  await shot('ea08-mobile', {}, m); await m.close()
} catch (e) { console.log('ERROR', e.stack); await p.screenshot({ path: RAW + '/_error-eq.png' }).catch(() => {}) }
finally { await b.close() }
