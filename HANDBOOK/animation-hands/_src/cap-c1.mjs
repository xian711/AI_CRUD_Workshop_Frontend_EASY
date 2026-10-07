// 第二版重拍 C1：手冊精簡後的截圖（上方動畫連結、Step 3 複製指令、起手 prompt、LOOP prompt、Step 4 用眼睛驗收的表）
import fs from 'node:fs'
const { chromium } = await import('file:///D:/AIWORK/pw-shots-tmp/node_modules/playwright/index.mjs')
const W = 'D:/AIWORK/pw-shots-tmp/crud-anim-2026-10-04', RAW = W + '/raw', META = RAW + '/meta-extra.json'
const meta = fs.existsSync(META) ? JSON.parse(fs.readFileSync(META, 'utf8')) : {}
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 519 }, deviceScaleFactor: 1.9, locale: 'zh-TW' })
await p.goto('file:///D:/AI_CRUD_Workshop_Frontend_EASY/HANDBOOK/HANDBOOK.html'); await p.waitForTimeout(1200)
await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto' })
const box = async sel => { const r = await p.locator(sel).first().boundingBox(); return r ? [r.x, r.y, r.width, r.height].map(Math.round) : null }
async function save(name, boxes) { await p.screenshot({ path: `${RAW}/${name}.png` }); meta[name] = { w: 1000, h: 519, boxes }; console.log(name, JSON.stringify(boxes)) }
async function shotPre(name, sel, nth) {
  const pre = p.locator(sel).nth(nth)
  await pre.evaluate(e => { e.scrollIntoView({ block: 'start' }); window.scrollBy(0, -110) }); await p.waitForTimeout(600)
  const r = await pre.boundingBox(); await save(name, { pre: [r.x, r.y, r.width, r.height].map(Math.round) })
}
// 手冊最上方（多了動畫連結）
await save('br01-handbook-top', { nav: await box('header.topnav nav'), hero: await box('.hero-card'), step0: await box('header.topnav nav a:has-text("Step 0")'), anim: await box('a.anim-link') })
await shotPre('br06-handbook-copyblock', '#step3 pre', 0)
await shotPre('br07-handbook-startprompt', '#step3 pre', 2)
await shotPre('br08-handbook-loopprompt', '#step4 pre', 0)
// Step 4「你應該看到」那張表（改成用眼睛驗收）
const t = p.locator('#step4 table').filter({ hasText: '畫面真的能用' })
await t.evaluate(e => { e.scrollIntoView({ block: 'start' }); window.scrollBy(0, -70) }); await p.waitForTimeout(600)
const tr = n => t.locator('tbody tr').nth(n).boundingBox().then(r => [r.x, r.y, r.width, r.height].map(Math.round))
await save('br09-handbook-check', { table: await t.boundingBox().then(r => [r.x, r.y, r.width, r.height].map(Math.round)), review: await tr(2), click: await tr(3), green: await tr(4) })
fs.writeFileSync(META, JSON.stringify(meta, null, 1))
await b.close()
