// 拍攝 A3（接 A2）：pnpm dev 在跑的狀態下 → README「8 個核心檔」→ sample-app 的四份規矩 → CLAUDE.md → 第二個終端機 → step3 複製範本
import fs from 'node:fs'
import { launch, workbench, shot, sleep, rowBox, waitPrompt, waitTerm, typeTerm, K, termText, saveText, clipRead, clipWrite, W } from './vsc-lib.mjs'
const LAB = 'D:/AI_CRUD_Workshop_Frontend_EASY'
const blocks = JSON.parse(fs.readFileSync(W + '/handbook-blocks.json', 'utf8'))
const row = n => `.explorer-folders-view .monaco-list-row[aria-label="${n}"]`
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null
const want = k => !ONLY || ONLY.includes(k)

const { app } = await launch({ folder: LAB, settings: { 'git.enabled': false } })
let p = await workbench(app)
const clip0 = await clipRead(app)
const focusTerm = async () => { await p.locator('.part.panel .xterm').first().click(); await sleep(300) }
async function maxPanel(on = true) { const isMax = await p.locator('.part.panel .action-label[aria-label*="還原面板"]').count(); if (!!isMax !== on) { await p.keyboard.press(K.maxPanel); await sleep(1200) } }
try {
  // step2 ①：安裝並啟動範本（收起左側欄，終端機比較寬）
  await p.keyboard.press('Control+B'); await sleep(800)
  await p.keyboard.press(K.newTerm); await sleep(3500); await focusTerm()
  await maxPanel(true)
  await typeTerm(p, 'cd step2_speedrun_kit/2.1_sample_app/sample-app'); await waitPrompt(p)
  await typeTerm(p, 'pnpm install'); await waitPrompt(p, 600000)
  await shot(p, 'vs16-pnpm-install', {
    panel: '.part.panel', cd: await rowBox(p, /cd step2/), cmd: await rowBox(p, /pnpm install/),
    done: await rowBox(p, /Done in/, { last: true }),
  })
  saveText('t-pnpm-install', await termText(app, p))
  await p.keyboard.press(K.termClear); await sleep(800)
  await typeTerm(p, 'pnpm dev')
  await waitTerm(p, /Local:.*3100/, 240000); await sleep(4000)
  const url = await p.evaluate(() => {
    const rows = [...document.querySelectorAll('.xterm-rows')].find(e => e.offsetParent); if (!rows) return null
    for (const r of rows.children) { const t = r.textContent; const i = t.indexOf('http://localhost:3100'); if (i < 0) continue
      const walker = document.createTreeWalker(r, NodeFilter.SHOW_TEXT); let n, off = 0
      while ((n = walker.nextNode())) { const L = n.textContent.length; if (off + L > i) { const rg = document.createRange(); rg.setStart(n, i - off); rg.setEnd(n, Math.min(L, i - off + 22)); const b = rg.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map(Math.round) } off += L }
    } return null })
  await shot(p, 'vs17-pnpm-dev', { panel: '.part.panel', cmd: await rowBox(p, /pnpm dev/), local: await rowBox(p, /Local:/), url })
  saveText('t-pnpm-dev', await termText(app, p))
  if (url) { await p.mouse.move(url[0] + url[2] / 2, url[1] + url[3] / 2); await sleep(2500)
    await shot(p, 'vs18-link-hover', { url, hover: '.monaco-hover, .workbench-hover' }) }
  await p.mouse.move(5, 300)
  await maxPanel(false)
  await p.keyboard.press('Control+B'); await sleep(800)

  // README「8 個核心檔」
  await p.keyboard.press(K.focusExplorer); await sleep(800)
  await p.locator(row('step2_speedrun_kit')).click(); await sleep(900)
  await p.locator(row('2.1_sample_app')).click(); await sleep(900)
  const readme = `${row('README.md')}[aria-level="3"]`
  await p.locator(readme).click(); await sleep(2500)
  await shot(p, 'vs19-readme-raw', { tab: ['.tabs-container .tab', { hasText: 'README.md' }], editor: '.part.editor', file: readme, tree: '.explorer-folders-view' })
  await p.keyboard.press('Control+Shift+V'); await sleep(4000)
  const fr = p.frameLocator('iframe.webview.ready').frameLocator('iframe#active-frame')
  const h = fr.locator('h2', { hasText: '8 個核心檔' })
  await h.evaluate(e => e.scrollIntoView({ block: 'start' })).catch(e => console.log('scroll', e.message)); await sleep(1500)
  await shot(p, 'vs20-readme-preview', { tab: ['.tabs-container .tab', { hasText: '預覽' }], h2: h, table: fr.locator('table').first(), editor: '.part.editor' })
  await fr.locator('table').first().evaluate(e => e.scrollIntoView({ block: 'start' })).catch(() => {}); await sleep(1200)
  await shot(p, 'vs20b-readme-table', { table: fr.locator('table').first(), editor: '.part.editor',
    r1: fr.locator('table tr').nth(1), r5: fr.locator('table tr').nth(5), r6: fr.locator('table tr').nth(6), r8: fr.locator('table tr').nth(8) })

  // sample-app 根目錄：給 AI 的四份規矩
  await p.keyboard.press(K.closeEditors); await sleep(800)
  await p.locator(`${row('sample-app')}[aria-level="3"]`).click(); await sleep(1500)
  await p.locator(row('使用說明-複製範本開發新模組.md')).first().click(); await sleep(1500)
  await p.keyboard.press(K.closeEditors); await sleep(800)
  await shot(p, 'vs21-harness-files', {
    tree: '.explorer-folders-view', sampleApp: `${row('sample-app')}[aria-level="3"]`, claude: row('CLAUDE.md'), rules: row('CODE-RULES-ui-本專案.md'),
    ds: row('design-system-summary.md'), guide: row('使用說明-複製範本開發新模組.md'), agents: row('AGENTS.md'), pkg: row('package.json'),
  })
  await p.locator(row('CLAUDE.md')).first().click(); await sleep(2500)
  await shot(p, 'vs22-claude-md', { tab: ['.tabs-container .tab', { hasText: 'CLAUDE.md' }], editor: '.part.editor', file: row('CLAUDE.md') })

  // 第二個終端機（＋）：Design System 網頁
  await p.keyboard.press(K.focusTerm); await sleep(1500)
  await shot(p, 'vs23-plus', { panel: '.part.panel', plus: '.part.panel .action-label[aria-label*="新增終端"]', running: await rowBox(p, /Local:/) })
  await p.locator('.part.panel .action-label[aria-label*="新增終端"]').first().click(); await sleep(3500)
  await focusTerm()
  await typeTerm(p, 'start step2_speedrun_kit\\2.2_design_system\\DESIGN_SYSTEM.html', { enter: false }); await sleep(500)
  await shot(p, 'vs24-start-ds', { panel: '.part.panel', cmd: await rowBox(p, /start step2/), tabs: '.part.panel .terminal-tabs-entry, .part.panel .tabs-list' })
  await p.keyboard.press('Escape'); await sleep(400)

  // step3 ⓪：貼上手冊的複製指令（多行貼上）
  await p.keyboard.press('Control+B'); await sleep(800)
  await focusTerm()
  await maxPanel(true)
  await p.keyboard.press(K.termClear); await sleep(600)
  await clipWrite(app, blocks[5])
  await p.keyboard.press('Control+V'); await sleep(2000)
  if (await p.locator('.monaco-dialog-box').count()) {
    await shot(p, 'vs25-paste-warning', { dialog: '.monaco-dialog-box', paste: ['.monaco-dialog-box .monaco-button', { hasText: '貼上' }] })
    await p.locator('.monaco-dialog-box .monaco-button', { hasText: '貼上' }).first().click(); await sleep(800)
  } else console.log('no multi-line paste warning')
  await waitPrompt(p, 600000)
  await shot(p, 'vs26-step3-prep', {
    panel: '.part.panel', robocopy: await rowBox(p, /robocopy/), copy: await rowBox(p, /Copy-Item/), cd: await rowBox(p, /cd step3/),
    install: await rowBox(p, /pnpm install/), done: await rowBox(p, /Done in/, { last: true }), prompt: await rowBox(p, /my-equipment-app>\s*$/, { last: true }),
  })
  saveText('t-step3-prep', await termText(app, p))
} catch (e) {
  console.log('ERROR', e.stack)
  await p.screenshot({ path: W + '/raw/_error-a3.png' }).catch(() => {})
} finally {
  await clipWrite(app, clip0).catch(() => {})
  await app.close().catch(() => {})
}
