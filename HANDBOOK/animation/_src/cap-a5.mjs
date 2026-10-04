// 補拍：安裝 Claude Code 擴充（全新設定，沒裝過 Claude Code）
import { launch, workbench, shot, sleep, W } from './vsc-lib.mjs'
const opt = { userDir: W + '/vsc-user2', extDir: W + '/vsc-ext2', settings: { 'chat.disableAIFeatures': true } }
let { app } = await launch(opt); await sleep(2000); await app.close()   // 第一次啟動先建立中文介面快取
;({ app } = await launch(opt))
const p = await workbench(app); await sleep(1500)
console.log('menubar', await p.$$eval('.menubar-menu-button', els => els.map(e => e.textContent.trim()).slice(0, 3)))
const ext = p.locator('.part.activitybar .action-item a[aria-label*="延伸模組"]')
await shot(p, 'cc-i1-activity', { ext: '.part.activitybar .action-item a[aria-label*="延伸模組"]' })
await ext.click(); await sleep(1500)
await p.keyboard.type('Claude Code', { delay: 40 }); await sleep(6000)
const first = p.locator('.extensions-viewlet .monaco-list-row').first()
console.log('results', await p.$$eval('.extensions-viewlet .monaco-list-row', els => els.slice(0, 4).map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 90))))
await shot(p, 'cc-i2-search', { search: '.extensions-viewlet .suggest-input-container, .extensions-viewlet .monaco-inputbox', first: first,
  install: p.locator('.extensions-viewlet .monaco-list-row').first().locator('.extension-action', { hasText: '安裝' }).first() })
await first.click(); await sleep(5000)
await shot(p, 'cc-i3-detail', { title: '.extension-editor .name', publisher: '.extension-editor .publisher', install: p.locator('.extension-editor .extension-action', { hasText: '安裝' }).first() })
await app.close()
