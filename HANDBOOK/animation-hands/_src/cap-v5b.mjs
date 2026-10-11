// 第五版重拍（2026-10-11）：step1 電話（市話收、忘了區碼擋）、step2 範本新增表單（選項欄位空白「請選擇」）
// 執行：BASE=http://localhost:3110 node cap-v5b.mjs（只拍某幾段：ONLY=s1,app）
// 檔名沿用 br1x／br3x，舊圖在 HANDBOOK/animation-hands/images 有發布版可以找回
import fs from 'node:fs'
const { chromium } = await import('file:///D:/AIWORK/pw-shots-tmp/node_modules/playwright/index.mjs')
const W = 'D:/AIWORK/pw-shots-tmp/crud-anim-2026-10-04', RAW = W + '/raw', LAB = 'D:/AI_CRUD_Workshop_Frontend_EASY'
const META = RAW + '/meta.json'
const meta = fs.existsSync(META) ? JSON.parse(fs.readFileSync(META, 'utf8')) : {}
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null
const want = k => !ONLY || ONLY.includes(k)
const VP = { width: 1000, height: Math.round(1000 * 706 / 1360) }
const sleep = ms => new Promise(r => setTimeout(r, ms))
const fileUrl = p => 'file:///' + p.replace(/\\/g, '/')
const base = process.env.BASE || 'http://localhost:3110'

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
const field = f => `[data-field="${f}"]`

try {
  // ── step1：電話。沒規矩版連「忘了區碼」都收；有規矩版收市話、擋忘了區碼 ──
  if (want('s1')) {
    await p.goto(fileUrl(LAB + '/step1_why_harness/demo/no-harness.html')); await sleep(1000)
    await p.fill('#name', '王小明'); await p.fill('#phone', '322-1234'); await sleep(300)
    await shot('br11-noh-filled', { blood: '#blood', phone: '#phone', add: '.btn-add' })
    await p.click('.btn-add'); await sleep(800)
    await shot('br12-noh-added', { table: 'table', row: 'table tbody tr', blood: '#blood', phoneCell: ['table tbody tr td', { hasText: '322-1234' }] })
    await p.goto(fileUrl(LAB + '/step1_why_harness/demo/with-harness.html')); await p.evaluate(() => localStorage.clear()); await p.reload(); await sleep(1000)
    await shot('br13-wh', { h1: 'h1', form: 'form', blood: '#blood-type-select', phone: '#phone-input', add: '#submit-btn', stars: '.required-mark' })
    await p.click('#submit-btn'); await sleep(800)
    await shot('br14-wh-empty-submit', { blood: '#blood-type-select', bloodErr: '#blood-type-error', nameErr: '#name-error', phoneErr: '#phone-error', add: '#submit-btn' })
    // 忘了區碼 → 擋
    await p.fill('#name-input', '王小明'); await p.selectOption('#blood-type-select', 'O'); await p.fill('#phone-input', '322-1234'); await p.click('#submit-btn'); await sleep(800)
    await shot('br15-wh-phone-blocked', { phone: '#phone-input', phoneErr: '#phone-error', blood: '#blood-type-select' })
    // 市話 → 收
    await p.fill('#phone-input', '(02) 1234-5678'); await p.click('#submit-btn'); await sleep(1000)
    await shot('br16-wh-landline-ok', { phone: '#phone-input', table: 'table', row: ['table tbody tr', { hasText: '(02) 1234-5678' }] })
    console.log('wh phone error after landline:', JSON.stringify(await p.locator('#phone-error').innerText()))
  }
  // ── 範本 App：新增表單的選項欄位一開始空白 ──
  if (want('app')) {
    await p.goto(base + '/template/crud', { waitUntil: 'networkidle' }); await sleep(1500)
    const btn = t => p.getByRole('button', { name: t })
    await shot('br30-list', { title: 'h1', add: btn('新增人員'), q: 'input[placeholder="姓名／電話／Email"]', count: ['p', { hasText: /^共 \d+ 筆$/ }], exp: btn('匯出 CSV'), table: 'table', trash: 'button[aria-label="刪除"]' })
    await btn('新增人員').first().click(); await p.waitForURL(u => u.pathname.endsWith('/template/crud/new')); await sleep(1200)
    await shot('br31-new-empty', { title: 'h1', save: btn('儲存'), gender: field('gender'), idType: field('idType'), phone: field('phone'), name: field('name') })
    // 沒選就儲存 → 選項欄位跳紅字
    await btn('儲存').first().click(); await sleep(900)
    await p.locator(field('name')).evaluate(e => e.scrollIntoView({ block: 'center' })); await sleep(400)
    await shot('br31b-new-errors', { gender: field('gender'), idType: field('idType'), genderErr: `${field('gender')} p`, idTypeErr: `${field('idType')} p`, save: btn('儲存') })
    await p.locator(field('groupName')).evaluate(e => e.scrollIntoView({ block: 'center' })); await sleep(500)
    await shot('br31c-new-errors-lower', { group: field('groupName'), position: field('positionCode'), status: field('status'), groupErr: `${field('groupName')} p`, positionErr: `${field('positionCode')} p` })
    await p.evaluate(() => window.scrollTo(0, 0)); await sleep(300)
    // 填好：性別自己選、電話用市話
    await p.getByPlaceholder('請輸入姓名').fill('王小美')
    await p.locator(`${field('gender')} button`).first().click(); await sleep(300); await p.getByRole('option', { name: '女', exact: true }).click(); await sleep(300)
    await p.locator('input[type="date"]').first().fill('1992-05-20')
    await p.locator(`${field('idType')} button`).first().click(); await sleep(300); await p.getByRole('option', { name: '身分證', exact: true }).click(); await sleep(300)
    await p.getByPlaceholder('例：A123456789').fill('A223456789')
    await p.locator(`${field('phone')} input`).fill('089-123456')
    await p.locator('button:has-text("縣市")').first().click(); await sleep(300); await p.getByRole('option', { name: '臺東縣' }).first().click(); await sleep(400)
    await p.locator('button:has-text("鄉鎮市區")').first().click(); await sleep(300); await p.getByRole('option', { name: '臺東市' }).first().click(); await sleep(300)
    await p.getByPlaceholder('門牌 / 段巷弄號（例：439號 B1）').fill('中華路100號')
    await p.locator(`${field('groupName')} button`).first().click(); await sleep(300); await p.getByRole('option', { name: '指揮組' }).first().click(); await sleep(300)
    await p.locator(`${field('positionCode')} button`).first().click(); await sleep(300); await p.getByRole('option', { name: '組員' }).first().click(); await sleep(300)
    await p.locator(field('phone')).evaluate(e => e.scrollIntoView({ block: 'center' })); await sleep(500)
    await shot('br32-new-filled', { save: btn('儲存'), gender: field('gender'), idType: field('idType'), phone: field('phone') })
    await btn('儲存').first().click(); await p.waitForURL(u => !u.href.includes('/new')); await sleep(700)
    await shot('br33-saved', { toast: '[role="status"], .z-50 [role="alert"], ol li', edit: btn('編輯'), name: ['text=王小美'] })
    const err = await p.locator('[data-field] p').allInnerTexts().catch(() => []); if (err.length) console.log('form errors?', err)
    // 編輯、清空姓名、刪除確認：畫面跟舊版一樣，照拍保持一致
    await btn('編輯').first().click(); await sleep(1200)
    await p.getByPlaceholder('補充說明（選填）').fill('第二個檢查點：改一下備註')
    await shot('br34-edit', { note: 'textarea[placeholder="補充說明（選填）"]', save: btn('儲存') })
    await p.getByPlaceholder('請輸入姓名').fill(''); await btn('儲存').first().click(); await sleep(900)
    await shot('br35-validation', { name: 'input[placeholder="請輸入姓名"]', err: ['text=請輸入姓名'], save: btn('儲存') })
    await p.getByPlaceholder('請輸入姓名').fill('王小美'); await btn('儲存').first().click(); await sleep(1200)
    await p.goto(base + '/template/crud', { waitUntil: 'networkidle' }); await sleep(1200)
    await p.locator('button[aria-label="刪除"]').nth(1).click(); await sleep(900)
    const dlgPanel = p.getByText('此動作無法復原').locator('xpath=ancestor::div[contains(@class,"rounded")][1]')
    await shot('br37-delete-confirm', { dialog: dlgPanel, title: p.getByText('刪除人員', { exact: true }).last(), msg: p.getByText('此動作無法復原'), ok: p.getByRole('button', { name: '刪除', exact: true }).last(), cancel: p.getByRole('button', { name: '取消', exact: true }).last() })
  }
} catch (e) {
  console.log('ERROR', e.stack)
  await p.screenshot({ path: RAW + '/_error-v5b.png' }).catch(() => {})
} finally { await b.close() }
