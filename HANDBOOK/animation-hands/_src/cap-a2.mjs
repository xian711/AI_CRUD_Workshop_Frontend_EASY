// 拍攝 A2：信任作者 → 檔案總管 → preflight 紅燈／綠燈 → 開手冊 → step2 安裝啟動範本 → README／規矩檔 → step3 複製範本
// 需要：D:\AI_CRUD_Workshop_Frontend_EASY（A1 下載的練習副本）。會暫停 3100 正式站（stop-3100.ps1），結束時不自動重開（之後還要拍瀏覽器）。
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
import { launch, workbench, shot, sleep, termRows, rowBox, waitPrompt, waitTerm, typeTerm, maskTerm, K, termText, saveText, clipRead, clipWrite, W, meta, box } from './vsc-lib.mjs'
const LAB = 'D:/AI_CRUD_Workshop_Frontend_EASY'
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null
const want = k => !ONLY || ONLY.includes(k)
const blocks = JSON.parse(fs.readFileSync(W + '/handbook-blocks.json', 'utf8'))
const psFile = (f, ...a) => { try { return execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', W + '/' + f, ...a], { encoding: 'utf8' }) } catch (e) { return 'ERR ' + (e.stdout || '') + (e.stderr || e.message) } }
const row = n => `.explorer-folders-view .monaco-list-row[aria-label="${n}"]`

const { app } = await launch({ folder: LAB, settings: { 'security.workspace.trust.startupPrompt': 'always' } })
let p = await workbench(app)
const clip0 = await clipRead(app)
const focusTerm = async () => { await p.locator('.part.panel .xterm').first().click(); await sleep(300) }
async function newTerminal() { await p.keyboard.press(K.newTerm); await sleep(3500); await focusTerm() }
async function maxPanel() { const isMax = await p.locator('.part.panel .action-label[aria-label*="還原面板"]').count(); if (!isMax) { await p.keyboard.press(K.maxPanel); await sleep(1200) } }
try {
  // 信任作者
  await p.waitForSelector('.monaco-dialog-box', { timeout: 30000 }).catch(() => console.log('no trust dialog'))
  await sleep(1500)
  await shot(p, 'vs09-trust', { dialog: '.monaco-dialog-box', yes: ['.monaco-dialog-box .monaco-button', { hasText: '是' }], no: ['.monaco-dialog-box .monaco-button', { hasText: '否' }] })
  await p.locator('.monaco-dialog-box .monaco-button', { hasText: '是' }).first().click().catch(e => console.log('trust click', e.message))
  await sleep(3500)
  await shot(p, 'vs10-explorer', {
    explorer: '.part.sidebar', tree: '.explorer-folders-view', root: [`.explorer-folders-view .monaco-list-row`, { nth: 0 }],
    handbook: row('HANDBOOK'), step0: row('step0_course_intro'), step1: row('step1_why_harness'), step2: row('step2_speedrun_kit'),
    step3: row('step3_new_module'), step4: row('step4_loop_e2e'), step6: row('step6_survey'), readme: row('README.md'),
  })
  console.log('rows', await p.$$eval('.explorer-folders-view .monaco-list-row', els => els.map(e => e.getAttribute('aria-label') + '@' + e.getAttribute('aria-level')).join(' ')))

  // 開終端機（Ctrl+`），停在教材根目錄
  await p.keyboard.press('Control+Backquote'); await sleep(3500)
  await focusTerm()
  await shot(p, 'vs11-terminal-root', { panel: '.part.panel', prompt: await rowBox(p, /^PS D:\\AI_CRUD/) })
  await maxPanel()

  // preflight：3100 被占用 → 紅燈（真實）
  await typeTerm(p, 'cd step0_course_intro'); await waitPrompt(p)
  await typeTerm(p, '.\\preflight.ps1'); await waitPrompt(p, 120000)
  await shot(p, 'vs12-preflight-fail', {
    panel: '.part.panel', cmd: await rowBox(p, /preflight\.ps1/), title: await rowBox(p, /前置檢查 =====/),
    fail: await rowBox(p, /\[FAIL\]/), hint: await rowBox(p, /修復|請關閉/), summary: await rowBox(p, /未通過|全數通過/, { last: true }),
  })
  saveText('t-preflight-fail', await termText(app, p))

  // 暫停 3100 正式站 → 關掉終端機重開 → 綠燈
  console.log(psFile('stop-3100.ps1'))
  await p.keyboard.press(K.killTerm); await sleep(2000)
  await newTerminal(); await maxPanel()
  await typeTerm(p, 'cd step0_course_intro'); await waitPrompt(p)
  await typeTerm(p, '.\\preflight.ps1'); await waitPrompt(p, 120000)
  await shot(p, 'vs13-preflight-pass', {
    panel: '.part.panel', cmd: await rowBox(p, /preflight\.ps1/), title: await rowBox(p, /前置檢查 =====/),
    first: await rowBox(p, /\[(PASS|WARN)\]/), last: await rowBox(p, /\[(PASS|WARN)\]/, { last: true }),
    warn: await rowBox(p, /\[WARN\]/), summary: await rowBox(p, /全數通過|未通過/, { last: true }),
  })
  saveText('t-preflight-pass', await termText(app, p))

  // 開手冊、step1 兩個網頁：只打字不按 Enter（避免真的開你的瀏覽器）
  await typeTerm(p, 'cd ..'); await waitPrompt(p)
  await p.keyboard.press(K.termClear); await sleep(600)
  await typeTerm(p, 'start HANDBOOK\\HANDBOOK.html', { enter: false })
  await sleep(500)
  await shot(p, 'vs14-start-handbook', { panel: '.part.panel', cmd: await rowBox(p, /start HANDBOOK/) })
  await p.keyboard.press('Escape'); await sleep(400)
  await typeTerm(p, 'start step1_why_harness\\demo\\no-harness.html', { enter: false })
  await sleep(500)
  await shot(p, 'vs15-start-demo', { panel: '.part.panel', cmd: await rowBox(p, /start step1/) })
  await p.keyboard.press('Escape'); await sleep(400)

  // step2：安裝並啟動範本（照手冊原文）
  await p.keyboard.press(K.termClear); await sleep(600)
  await typeTerm(p, 'cd step2_speedrun_kit/2.1_sample_app/sample-app'); await waitPrompt(p)
  await typeTerm(p, 'pnpm install'); await waitPrompt(p, 600000)
  await shot(p, 'vs16-pnpm-install', {
    panel: '.part.panel', cd: await rowBox(p, /cd step2/), cmd: await rowBox(p, /pnpm install/),
    done: await rowBox(p, /Done in/, { last: true }), prompt: await rowBox(p, /^PS .*sample-app>\s*$/, { last: true }),
  })
  saveText('t-pnpm-install', await termText(app, p))
  await p.keyboard.press(K.termClear); await sleep(600)
  await typeTerm(p, 'pnpm dev')
  await waitTerm(p, /Local:.*3100/, 240000); await sleep(4000)
  await shot(p, 'vs17-pnpm-dev', { panel: '.part.panel', cmd: await rowBox(p, /pnpm dev/), local: await rowBox(p, /Local:/), url: await p.evaluate(() => {
    const rows = [...document.querySelectorAll('.xterm-rows')].find(e => e.offsetParent); if (!rows) return null
    for (const r of rows.children) { const t = r.textContent; const i = t.indexOf('http://localhost:3100'); if (i >= 0) {
      // 找到網址那段文字的位置
      const walker = document.createTreeWalker(r, NodeFilter.SHOW_TEXT); let n, off = 0
      while ((n = walker.nextNode())) { const L = n.textContent.length; if (off + L > i) { const rg = document.createRange(); rg.setStart(n, i - off); const end = Math.min(L, i - off + 'http://localhost:3100/'.length); rg.setEnd(n, end); const b = rg.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map(Math.round) } off += L }
    } } return null }) })
  saveText('t-pnpm-dev', await termText(app, p))
  // 滑鼠移到網址上，會出現「Ctrl + 按一下」提示
  const u = meta['vs17-pnpm-dev'].boxes.url
  if (u) { await p.mouse.move(u[0] + u[2] / 2, u[1] + u[3] / 2); await sleep(2500)
    await shot(p, 'vs18-link-hover', { url: u, hover: '.monaco-hover, .workbench-hover' }) }
  await p.mouse.move(5, 300)

  // 還原面板，回到編輯區：開 README 看「8 個核心檔」
  await p.keyboard.press(K.maxPanel); await sleep(1000)
  await p.keyboard.press(K.focusExplorer); await sleep(800)
  await p.locator(row('step2_speedrun_kit')).click(); await sleep(800)
  await p.locator(row('2.1_sample_app')).click(); await sleep(800)
  await p.locator(`${row('README.md')}[aria-level="4"]`).click(); await sleep(2000)
  await shot(p, 'vs19-readme-raw', { tab: ['.tabs-container .tab', { hasText: 'README.md' }], editor: '.part.editor', file: `${row('README.md')}[aria-level="4"]` })
  await p.keyboard.press('Control+Shift+V'); await sleep(3500)
  const fr = p.frameLocator('iframe.webview.ready').frameLocator('iframe#active-frame')
  const h = fr.locator('h2', { hasText: '8 個核心檔' })
  await h.scrollIntoViewIfNeeded().catch(e => console.log('scroll', e.message)); await sleep(1500)
  await fr.locator('body').evaluate(() => window.scrollBy(0, -10)).catch(() => {})
  await sleep(800)
  await shot(p, 'vs20-readme-preview', { tab: ['.tabs-container .tab', { hasText: '預覽' }], h2: h, table: fr.locator('table').first(), editor: '.part.editor' })

  // sample-app 根目錄：給 AI 的四份規矩
  await p.keyboard.press(K.closeEditors); await sleep(800)
  await p.locator(`${row('sample-app')}`).click(); await sleep(1200)
  await p.locator(row('使用說明-複製範本開發新模組.md')).scrollIntoViewIfNeeded().catch(() => {})
  await p.evaluate(() => { const l = document.querySelector('.explorer-folders-view .monaco-scrollable-element'); }).catch(() => {})
  await sleep(800)
  await shot(p, 'vs21-harness-files', {
    tree: '.explorer-folders-view', sampleApp: row('sample-app'), claude: row('CLAUDE.md'), rules: row('CODE-RULES-ui-本專案.md'),
    ds: row('design-system-summary.md'), guide: row('使用說明-複製範本開發新模組.md'), agents: row('AGENTS.md'), pkg: row('package.json'),
  })
  await p.locator(row('CLAUDE.md')).click(); await sleep(2500)
  await shot(p, 'vs22-claude-md', { tab: ['.tabs-container .tab', { hasText: 'CLAUDE.md' }], editor: '.part.editor', file: row('CLAUDE.md') })

  // 再開一個終端機：Design System 網頁
  await p.keyboard.press(K.focusTerm); await sleep(1500)
  await shot(p, 'vs23-plus', { panel: '.part.panel', plus: '.part.panel .action-label[aria-label*="新增終端"]', running: await rowBox(p, /Local:/) })
  await p.locator('.part.panel .action-label[aria-label*="新增終端"]').first().click(); await sleep(3500)
  await focusTerm()
  await typeTerm(p, 'start step2_speedrun_kit\\2.2_design_system\\DESIGN_SYSTEM.html', { enter: false }); await sleep(500)
  await shot(p, 'vs24-start-ds', { panel: '.part.panel', cmd: await rowBox(p, /start step2/), tabs: '.part.panel .tabs-list, .part.panel .terminal-tabs-entry' })
  await p.keyboard.press('Escape'); await sleep(400)

  // step3 ⓪：貼上手冊的複製指令（多行貼上）
  await maxPanel()
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
  await p.screenshot({ path: W + '/raw/_error-a2.png' }).catch(() => {})
} finally {
  await clipWrite(app, clip0).catch(() => {})
  await app.close().catch(() => {})
}
