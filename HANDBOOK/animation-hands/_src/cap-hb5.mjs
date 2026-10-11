// 手把手版：從「現在的」前端手冊拍指令框（舊版 br05～br08 是更早的 prompt）
import fs from 'node:fs'
const { chromium } = await import('file:///D:/AIWORK/pw-shots-tmp/node_modules/playwright/index.mjs')
const W = 'D:/AIWORK/pw-shots-tmp/crud-anim-2026-10-04', RAW = W + '/raw', META = RAW + '/meta-extra.json'
const meta = fs.existsSync(META) ? JSON.parse(fs.readFileSync(META, 'utf8')) : {}
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 519 }, deviceScaleFactor: 1.9, locale: 'zh-TW' })
await p.goto('file:///D:/AIWORK/_AICLASS/AI_CRUD_Workshop_Frontend_EASY/HANDBOOK/HANDBOOK.html'); await p.waitForTimeout(1200)
await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto' })
const rnd = r => r ? [r.x, r.y, r.width, r.height].map(Math.round) : null
async function shotPre(name, sel, text, up = 110) {
  // 用框裡的字找指令框（手冊改版後小標題編號會變，不靠第幾個）
  const pre = p.locator(sel, { hasText: text }).first()
  await pre.evaluate((e, u) => { e.scrollIntoView({ block: 'start' }); window.scrollBy(0, -u) }, up); await p.waitForTimeout(600)
  const r = rnd(await pre.boundingBox())
  await p.screenshot({ path: `${RAW}/${name}.png` }); meta[name] = { w: 1000, h: 519, boxes: { pre: r, line1: r && [r[0], r[1], r[2], 36] } }; console.log(name, JSON.stringify(r))
}
await shotPre('hb5-step0-help', '#step0 pre', 'preflight.ps1 的完整輸出')
await shotPre('hb5-step3-start', '#step3 pre', '用 CRUD 範本做新模組')
await shotPre('hb5-step3-rescue', '#step3 pre', '停，先不要寫程式')
await shotPre('hb5-step4-loop', '#step4 pre', '你是 LOOP 工程師')
// 手冊最下面的完課檢核表
const chk = p.locator('h2', { hasText: '完課檢核表' }).first()
await chk.evaluate(e => { e.scrollIntoView({ block: 'start' }); window.scrollBy(0, -90) }); await p.waitForTimeout(600)
const lst = p.locator('h2:has-text("完課檢核表") ~ *').first()
await p.screenshot({ path: `${RAW}/hb5-checklist.png` }); meta['hb5-checklist'] = { w: 1000, h: 519, boxes: { h: rnd(await chk.boundingBox()), list: rnd(await lst.boundingBox().catch(() => null)) } }
console.log('hb5-checklist', JSON.stringify(meta['hb5-checklist'].boxes))
fs.writeFileSync(META, JSON.stringify(meta, null, 1))
await b.close()
