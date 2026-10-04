// 從做好的動畫網頁匯出「段落索引」：每段的標題、每一句字幕、動畫下方的速查文字。
// 問答網站用它當知識庫，並把答案連到「第幾段第幾句」。
// 執行：node export-index.mjs <動畫 html> <輸出 json> [動畫代號] [標題]
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
const PW = process.env.PW ?? 'file:///D:/AIWORK/pw-shots-tmp/node_modules/playwright/index.mjs'
const { chromium } = await import(PW)
const [file, out, id = 'anim', title] = process.argv.slice(2)
if (!file || !out) { console.log('usage: node export-index.mjs <html> <out.json> [id] [title]'); process.exit(1) }
const b = await chromium.launch()
const p = await b.newPage()
await p.goto(pathToFileURL(file).href)
await p.waitForFunction(() => Array.isArray(window.__animIndex))
const data = await p.evaluate(() => ({
  title: document.title,
  h1: document.querySelector('header.top h1')?.textContent?.trim() ?? '',
  subtitle: document.querySelector('header.top p')?.textContent?.trim() ?? '',
  scenes: window.__animIndex,
  quickref: document.querySelector('section.after')?.innerText?.trim() ?? '',
}))
data.id = id
if (title) data.title = title
fs.writeFileSync(out, JSON.stringify(data, null, 1), 'utf8')
console.log(`exported ${data.scenes.length} scenes, ${data.scenes.reduce((a, s) => a + s.steps.length, 0)} steps → ${out}`)
await b.close()
