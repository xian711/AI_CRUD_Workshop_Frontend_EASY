// 第五版（cap-eq5）：檔名 v5-ea*；另拍小落差畫面 v5-gap*
// 第四版實拍：新 App 的驗收畫面（列表、連動下拉、編碼、驗證、刪除、手機）；BASE=http://localhost:3200 node cap-eq.mjs
// 座標寫進 meta-extra.json（避免跟 VS Code 遙控器同時寫 meta.json）；檔名沿用 ea01～ea08，舊圖已備份在 raw-v3bak/
import fs from 'node:fs'
const { chromium } = await import('file:///D:/AIWORK/pw-shots-tmp/node_modules/playwright/index.mjs')
const W = 'D:/AIWORK/pw-shots-tmp/crud-anim-2026-10-04', RAW = W + '/raw', META = RAW + '/meta-extra.json'
const meta = fs.existsSync(META) ? JSON.parse(fs.readFileSync(META, 'utf8')) : {}
const base = process.env.BASE || 'http://localhost:3101'
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
  // ── 小落差：欄位太窄被拆成兩行、空白符號長短不一 ──
  if (process.env.GAP) {
    await p.goto(base + '/equipment/crud', { waitUntil: 'networkidle' }); await sleep(1500)
    const cell = (r, c) => p.locator('table tbody tr').nth(r).locator('td').nth(c)
    await shot(process.env.GAP + '-wrap', { keeper: cell(0, 5), date: cell(0, 6), keeper2: cell(1, 5), status2: cell(1, 3), loc4: cell(3, 4) })
    await shot(process.env.GAP + '-dash', { keeperEmpty: cell(3, 5), dateEmpty: cell(3, 6), row: p.locator('table tbody tr').nth(3) })
  }
} catch (e) { console.log('ERROR', e.stack); await p.screenshot({ path: RAW + '/_error-eq.png' }).catch(() => {}) }
finally { await b.close() }
