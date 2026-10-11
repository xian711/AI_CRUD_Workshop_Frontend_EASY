// 第五版：DIAGRAMS 每一張圖拍三張（標題＋怎麼看、圖本身、整段），也檢查 mermaid 有沒有紅字錯誤
// 用法：node cap-diag5.mjs <html 路徑> <檔名前綴>
import fs from 'node:fs'
const { chromium } = await import('file:///D:/AIWORK/pw-shots-tmp/node_modules/playwright/index.mjs')
const W = 'D:/AIWORK/pw-shots-tmp/crud-anim-2026-10-04', RAW = W + '/raw', META = RAW + '/meta-extra.json'
const meta = fs.existsSync(META) ? JSON.parse(fs.readFileSync(META, 'utf8')) : {}
const [file, pfx] = process.argv.slice(2)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: Number(process.env.VW || 1500), height: 900 }, deviceScaleFactor: Number(process.env.DSF || 1.6), locale: 'zh-TW' })
await p.goto('file:///' + file.replace(/\\/g, '/'), { waitUntil: 'networkidle' })
await p.waitForFunction(() => [...document.querySelectorAll('pre.mermaid, .mermaid')].every(e => e.querySelector('svg') || e.getAttribute('data-processed')), null, { timeout: 30000 }).catch(() => console.log('mermaid wait timeout'))
await p.waitForTimeout(1500)
const err = await p.evaluate(() => [...document.querySelectorAll('*')].filter(e => e.childElementCount === 0 && /Syntax error|Parse error/i.test(e.textContent)).map(e => e.textContent.slice(0, 80)))
console.log('errors:', err.length ? err : 'none')
const secs = await p.locator('section').count()
for (let i = 0; i < secs; i++) {
  const s = p.locator('section').nth(i)
  const h = (await s.locator('h2').first().innerText()).trim()
  const n = i + 1
  await s.screenshot({ path: `${RAW}/${pfx}-${n}-full.png` })
  await s.locator('h2').evaluate(e => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 12)); await p.waitForTimeout(300)
  const head = await s.locator('h2').boundingBox(), how = await s.locator('.howto, .how, ul').first().boundingBox()
  const svg = s.locator('svg').first()
  await svg.screenshot({ path: `${RAW}/${pfx}-${n}-svg.png` })
  const ask = await s.locator('.ask').first().innerText().catch(() => '')
  const sb = await svg.boundingBox(), sec = await s.boundingBox()
  await s.locator('h2').evaluate(e => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 12)); await p.waitForTimeout(300)
  const head2 = await s.locator('h2').boundingBox(), how2 = await s.locator('.howto, .how, ul').first().boundingBox(), sec2 = await s.boundingBox()
  // 標題＋說明＋怎麼看 那一塊
  if (head2 && how2) await p.screenshot({ path: `${RAW}/${pfx}-${n}-head.png`, clip: { x: sec2.x, y: Math.max(0, head2.y - 8), width: sec2.width, height: Math.min(880, how2.y + how2.height - head2.y + 16) } })
  meta[`${pfx}-${n}-svg`] = { w: Math.round(sb.width), h: Math.round(sb.height), title: h, ask }
  console.log(n, h, 'svg', Math.round(sb.width), 'x', Math.round(sb.height), '| ask:', ask.slice(0, 60))
}
fs.writeFileSync(META, JSON.stringify(meta, null, 1))
await b.close()
