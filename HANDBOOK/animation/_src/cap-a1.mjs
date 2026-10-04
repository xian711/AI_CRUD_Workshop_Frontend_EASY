// 拍攝 A1：空的 VS Code → 開終端機 → cd D:\ → git clone → 檔案→開啟資料夾 → 信任作者 → 檔案總管
import fs from 'node:fs'
import os from 'node:os'
import { execFileSync } from 'node:child_process'
import { launch, workbench, shot, sleep, termRows, rowBox, waitPrompt, typeTerm, maskTerm, K, termText, saveText, clipRead, clipWrite, W, meta } from './vsc-lib.mjs'
const LAB = 'D:/AI_CRUD_Workshop_Frontend_EASY'
if (fs.existsSync(LAB)) { console.log('LAB already exists; stage1 needs a fresh clone'); process.exit(1) }
const dlg = (...args) => { try { return execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', W + '/dlg.ps1', ...args], { encoding: 'utf8' }) } catch (e) { return 'ERR ' + (e.stdout || '') + (e.stderr || e.message) } }

const { app } = await launch({ settings: { 'files.dialog.defaultPath': 'D:\\AI_CRUD_Workshop_Frontend_EASY' } })
let p = await workbench(app)
const clip0 = await clipRead(app)
const ME = 'Users\\' + os.userInfo().username
const mask = () => maskTerm(p, ME, 'Users\\你的帳號')
try {
  await shot(p, 'vs01-empty', {
    menuTerm: ['.menubar-menu-button', { hasText: '終端機' }], menuFile: ['.menubar-menu-button', { hasText: '檔案' }],
    activity: '.part.activitybar',
  })
  await p.locator('.menubar-menu-button', { hasText: '終端機' }).click(); await sleep(900)
  await shot(p, 'vs02-menu-terminal', {
    menuTerm: ['.menubar-menu-button', { hasText: '終端機' }], newTerm: ['.monaco-menu .action-item', { hasText: '新增終端' }],
  })
  await p.locator('.monaco-menu .action-label', { hasText: '新增終端' }).first().click()
  await sleep(4000)
  await mask()
  await shot(p, 'vs03-terminal', {
    panel: '.part.panel', tabTerm: ['.part.panel .composite-bar .action-item', { hasText: '終端機' }],
    prompt: await rowBox(p, /^PS /), max: '.part.panel .action-label[aria-label*="最大化"]',
  })
  // 面板放到最大，終端機才看得到完整輸出
  await p.locator('.xterm').first().click(); await sleep(300)
  await p.keyboard.press(K.maxPanel); await sleep(1200)
  await mask()
  await shot(p, 'vs03b-terminal-max', { panel: '.part.panel', prompt: await rowBox(p, /^PS /) })
  // cd D:\
  await p.locator('.xterm').first().click(); await sleep(300)
  await typeTerm(p, 'cd D:\\'); await waitPrompt(p)
  await mask()
  await shot(p, 'vs04-cd-d', { panel: '.part.panel', cmd: await rowBox(p, /cd D:\\/), prompt: await rowBox(p, /^PS D:\\>\s*$/, { last: true }) })
  // git clone（真的從 GitHub 下載）
  await typeTerm(p, 'git clone https://github.com/xian711/AI_CRUD_Workshop_Frontend_EASY.git', { enter: false, delay: 18 })
  await sleep(500); await mask()
  await shot(p, 'vs05-clone-typed', { panel: '.part.panel', cmd: await rowBox(p, /git clone/) })
  await p.keyboard.press('Enter')
  await waitPrompt(p, 300000)
  await mask()
  await shot(p, 'vs06-clone-done', {
    panel: '.part.panel', cmd: await rowBox(p, /git clone/), cloning: await rowBox(p, /Cloning into/),
    done: await rowBox(p, /Updating files.*done/, { last: true }), prompt: await rowBox(p, /^PS D:\\>\s*$/, { last: true }),
  })
  saveText('t-clone', (await termText(app, p)).split(ME).join('Users\\你的帳號'))

  // 讓練習副本跟本機最新版一致（GitHub 上少最後兩個 commit）；這一步不在畫面裡
  console.log(execFileSync('git', ['-C', LAB, 'pull', '--ff-only', 'd:/AIWORK/_AICLASS/AI_CRUD_Workshop_Frontend_EASY', 'master'], { encoding: 'utf8' }).trim().split('\n').slice(-1).join(''))

  // 檔案 → 開啟資料夾
  await p.locator('.menubar-menu-button', { hasText: '檔案' }).click(); await sleep(900)
  await shot(p, 'vs07-menu-file', { menuFile: ['.menubar-menu-button', { hasText: '檔案' }], openFolder: ['.monaco-menu .action-item', { hasText: '開啟資料夾' }] })
  await p.locator('.monaco-menu .action-label', { hasText: '開啟資料夾' }).first().click()
  await sleep(3000)
  const info = dlg('-Out', W + '/raw/vs08-open-folder-dialog.png', '-W', '1700', '-H', '1000')
  console.log(info)
  // 對話框截圖的標註框（對話框像素）
  const m = { w: 1700, h: 1000, boxes: {} }
  for (const line of info.split(/\r?\n/)) {
    const s = /^size (\d+),(\d+)/.exec(line); if (s) { m.w = +s[1]; m.h = +s[2] }
    const e = /^el \[[^\]]+\] '(.+)' (-?\d+),(-?\d+),(\d+),(\d+)/.exec(line)
    if (e) { const k = /選取資料夾/.test(e[1]) ? 'ok' : /取消/.test(e[1]) ? 'cancel' : /位址/.test(e[1]) ? 'address' : e[1]; m.boxes[k] = [+e[2], +e[3], +e[4], +e[5]] }
  }
  meta['vs08-open-folder-dialog'] = m
  fs.writeFileSync(W + '/raw/meta.json', JSON.stringify(meta, null, 1))
  console.log(dlg('-Ok'))
  await sleep(6000)
  p = await workbench(app)
  await p.waitForSelector('.monaco-dialog-box', { timeout: 30000 }).catch(() => console.log('no trust dialog'))
  await sleep(1500)
  await shot(p, 'vs09-trust', {
    dialog: '.monaco-dialog-box', yes: ['.monaco-dialog-box .monaco-button', { hasText: '是' }],
    no: ['.monaco-dialog-box .monaco-button', { hasText: '否' }],
  })
  await p.locator('.monaco-dialog-box .monaco-button', { hasText: '是' }).first().click()
  await sleep(4000)
  const row = n => `.explorer-folders-view .monaco-list-row[aria-label="${n}"]`
  await shot(p, 'vs10-explorer', {
    explorer: '.part.sidebar', root: ['.explorer-folders-view .monaco-list-row', { nth: 0 }],
    handbook: row('HANDBOOK'), step0: row('step0_course_intro'), step1: row('step1_why_harness'), step2: row('step2_speedrun_kit'),
    step3: row('step3_new_module'), step4: row('step4_loop_e2e'), step6: row('step6_survey'), readme: row('README.md'),
  })
  console.log('explorer rows', await p.$$eval('.explorer-folders-view .monaco-list-row', els => els.map(e => e.getAttribute('aria-label') + '@' + e.getAttribute('aria-level'))))
} catch (e) {
  console.log('ERROR', e.stack)
  await p.screenshot({ path: 'raw/_error-a1.png' }).catch(() => {})
} finally {
  await clipWrite(app, clip0).catch(() => {})
  await app.close().catch(() => {})
}
