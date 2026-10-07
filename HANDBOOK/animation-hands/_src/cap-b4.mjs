// 補拍：手冊 step3 ⓪ 的複製指令、step0 的教材網址、step3 ② 起手 prompt（給學員看「去哪裡複製」）
import fs from 'node:fs'
const { chromium } = await import('file:///D:/AIWORK/pw-shots-tmp/node_modules/playwright/index.mjs')
const W = 'D:/AIWORK/pw-shots-tmp/crud-anim-2026-10-04', RAW = W + '/raw', META = RAW + '/meta-extra.json'
const meta = fs.existsSync(META) ? JSON.parse(fs.readFileSync(META, 'utf8')) : {}
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 519 }, deviceScaleFactor: 1.9 })
await p.goto('file:///D:/AI_CRUD_Workshop_Frontend_EASY/HANDBOOK/HANDBOOK.html'); await p.waitForTimeout(1000); await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto' })
async function shotPre(name, sel, nth) {
  const pre = p.locator(sel).nth(nth)
  await pre.evaluate(e => { e.scrollIntoView({ block: 'start' }); window.scrollBy(0, -110) }); await p.waitForTimeout(600)
  const r = await pre.boundingBox()
  await p.screenshot({ path: `${RAW}/${name}.png` })
  meta[name] = { w: 1000, h: 519, boxes: { pre: [r.x, r.y, r.width, r.height].map(Math.round) } }
  console.log(name, meta[name].boxes.pre)
}
await shotPre('br05-handbook-clone', '#step0 pre', 0)
await shotPre('br06-handbook-copyblock', '#step3 pre', 0)
await shotPre('br07-handbook-startprompt', '#step3 pre', 2)
await shotPre('br08-handbook-loopprompt', '#step4 pre', 0)
fs.writeFileSync(META, JSON.stringify(meta, null, 1))
await b.close()
