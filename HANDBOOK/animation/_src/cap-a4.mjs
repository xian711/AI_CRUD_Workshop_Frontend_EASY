// 補拍：終端機選單（顯示預設快捷鍵）
import { launch, workbench, shot, sleep } from './vsc-lib.mjs'
const { app } = await launch({ dropKeys: ['ctrl+alt+shift+f7'] })
const p = await workbench(app)
await p.locator('.menubar-menu-button', { hasText: '終端機' }).click(); await sleep(900)
console.log(await p.$$eval('.monaco-menu .action-item', els => els.slice(0, 3).map(e => e.textContent.trim())))
await shot(p, 'vs02-menu-terminal', { menuTerm: ['.menubar-menu-button', { hasText: '終端機' }], newTerm: ['.monaco-menu .action-item', { hasText: '新增終端' }] })
await p.keyboard.press('Escape')
await app.close()
