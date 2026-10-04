// ============================================================
// AI CRUD 工作坊 EASY 版：手把手教學動畫（場景檔）
// 畫面來源：2026-10-04 在 Windows 11 實拍。VS Code 1.140（繁體中文介面）＋ Claude Code 擴充 2.1.289、
//           Chrome（Playwright）。練習副本 D:\AI_CRUD_Workshop_Frontend_EASY（從 GitHub 真的 git clone 下來）。
// 大字版終端機裡的每一行，都是同一次實拍時終端機印出來的真實文字（太長的地方用「…」省略）。
// 2026-10-04 第二版：依學員（Antigravity／Claude Opus 5.5 扮演零程式經驗承辦）回饋修改。
// ============================================================
window.__spoken = [
  [/Ctrl\+`/g, 'Control 加反引號'], [/Ctrl\+Shift\+V/g, 'Control 加 Shift 加 V'], [/Ctrl/g, 'Control'],
  [/\.\\preflight\.ps1/g, '點、反斜線、preflight 點 P S 1'], [/cd \.\./g, 'C D 空一格、兩個點'],
  [/run-e2e\.ps1/g, 'run E 2 E 點 P S 1'], [/\.html/g, ' 點 HTML'], [/\.md\b/g, ' 點 M D'],
  [/pnpm/g, 'P N P M'], [/npm/g, 'N P M'], [/E2E/g, 'E 2 E'], [/CRUD/g, 'C R U D'], [/CSV/g, 'C S V'], [/PRD/g, 'P R D'],
  [/SRS/g, 'S R S'], [/SDD/g, 'S D D'], [/LOOP/g, 'loop'], [/VS Code/g, 'V S Code'], [/README/g, 'read me'],
  [/D:\\/g, 'D 槽'], [/C:\\/g, 'C 槽'], [/IT-006/g, 'I T 零零六'], [/E3/g, 'E 3'], [/E4/g, 'E 4'],
  [/step(\d)/g, 'step $1'], [/\[PASS\]/g, 'PASS'], [/\[WARN\]/g, 'WARN'], [/\[FAIL\]/g, 'FAIL'], [/D([1-3])/g, 'D $1'], [/T([1-8])\b/g, 'T $1'],
  [/localhost:3100/g, 'localhost 3100'], [/3100/g, '三一零零'], [/\+/g, ' 加 '], [/cd /g, 'C D '],
]
const OR = '#ff6a00'                         // 淺色網頁上的標註色
const LAB = 'D:\\AI_CRUD_Workshop_Frontend_EASY'
const SAMPLE = LAB + '\\step2_speedrun_kit\\2.1_sample_app\\sample-app'
const MYAPP = LAB + '\\step3_new_module\\my-equipment-app'
const FV = FR                                 // VS Code 截圖：整張
function vsh(r, names, F = FV) { return shots(r, names, F) }
const REAL = '這是你螢幕上實際會看到的樣子（字比較小是正常的）'
function realNote() { return tip(REAL, { y: 820, h: 60, size: 24, col: C.teal }) }
// 迷你鍵盤：標出 Ctrl 和反引號
function miniKeys(x, y) {
  const g = grp(L); R(g, x, y, 560, 250, { fill: '#0b1520', stroke: C.line, sw: 3, rx: 16 })
  const key = (kx, ky, w, t, hot) => { R(g, kx, ky, w, 62, { fill: hot ? C.gold : '#e9edf1', stroke: hot ? '#fff' : '#9aa5b1', sw: hot ? 4 : 2, rx: 8 }); T(g, kx + w / 2, ky + 42, t, { size: 26, anchor: 'middle', weight: 900, fill: '#1d2733' }) }
  key(x + 20, y + 20, 90, 'Esc'); key(x + 125, y + 20, 70, 'F1'); key(x + 210, y + 20, 70, 'F2')
  key(x + 20, y + 95, 90, '` ~', true); key(x + 125, y + 95, 70, '1 !'); key(x + 210, y + 95, 70, '2 @'); key(x + 295, y + 95, 70, '3 #')
  key(x + 20, y + 170, 110, 'Ctrl', true); key(x + 145, y + 170, 80, 'Win'); key(x + 240, y + 170, 80, 'Alt')
  T(g, x + 400, y + 140, '同時按', { size: 26, weight: 800, fill: C.gold }); T(g, x + 400, y + 178, '這兩顆', { size: 26, weight: 800, fill: C.gold })
  return g
}

// ════════════════════════════ 開場 ════════════════════════════
chapter('開場', '這堂課在做什麼', C.teal)

scene('三樣東西各管一件事', () => {
  const r = {}
  T(L, 800, 128, 'AI CRUD 工作坊 · EASY 版', { size: 64, anchor: 'middle', weight: 900 })
  T(L, 800, 190, '用「範本＋規矩＋AI」長出一個新的資料管理頁面', { size: 34, anchor: 'middle', fill: C.mut })
  const items = [['範本', '配方', '照著做，骨架不用從頭寫', C.teal], ['harness（規矩）', '滷包', 'AI 每次都照你們的規矩做', C.gold], ['AI', '幫你顧火的廚師', '改欄位、寫程式這種勞力', C.coral]]
  r.c = items.map(([a, b, c, col], i) => { const g = grp(L); const x = 70 + i * 495; R(g, x, 250, 465, 330, { fill: C.card, stroke: col, sw: 5 })
    T(g, x + 232, 330, a, { size: 46, anchor: 'middle', weight: 900, fill: col }); T(g, x + 232, 410, '＝ ' + b, { size: 40, anchor: 'middle', weight: 800 })
    T(g, x + 232, 500, c, { size: 27, anchor: 'middle', fill: C.mut }); return g })
  r.crud = box(L, 70, 620, 1460, 90, 'CRUD ＝ 新增（Create）・查詢（Read）・修改（Update）・刪除（Delete）', { size: 32, fill: '#0b1520', stroke: C.line, color: C.ink })
  r.rule = box(L, 70, 740, 1460, 100, '你的工作：講清楚要什麼 → 讓 AI 照規矩做 → 最後由你驗收', { size: 40, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  ['這堂課要用 AI，長出一個新的資料管理頁面。', r => { show(r.crud) }],
  ['CRUD 就是新增、查詢、修改、刪除，四個最基本的資料操作。', r => glow(r.crud)],
  ['三樣東西各管一件事：範本是配方，給你現成的骨架。', r => { show(r.c[0]); glow(r.c[0]) }],
  ['harness 是滷包，就是交給 AI 的一套規矩。你不用懂裡面寫什麼，只要知道它放在哪；step2 會帶你去看。', r => { show(r.c[1]); glow(r.c[1]) }],
  ['AI 是幫你顧火的廚師，負責改欄位、寫程式這種勞力。', r => { show(r.c[2]); glow(r.c[2]) }],
  ['所以你的工作只有三件：講清楚要什麼、讓 AI 照規矩做、最後親自驗收。', r => { show(r.rule); glow(r.rule) }],
])

scene('三個視窗、六個步驟', () => {
  const r = {}; mhead('先認識工具', '整堂課只用三個視窗')
  const w3 = [['VS Code', '看檔案、開終端機、找 AI', C.teal], ['終端機', '打一行字、按 Enter，電腦回你結果', C.gold], ['瀏覽器', '看做出來的網頁', C.coral]]
  r.w = w3.map(([a, b, col], i) => { const g = grp(L); const x = 70 + i * 495; R(g, x, 135, 465, 200, { fill: C.card, stroke: col, sw: 5 })
    T(g, x + 232, 215, a, { size: 48, anchor: 'middle', weight: 900, fill: col }); T(g, x + 232, 285, b, { size: 27, anchor: 'middle' }); return g })
  r.term = box(L, 70, 355, 1460, 70, '終端機就像對講機：打一行、按 Enter、等它回完，再打下一行', { size: 30, fill: '#2a2410', stroke: C.gold, color: C.gold })
  const st = [['step0', '準備環境', 1], ['step1', '看差別', 1], ['step2', '玩範本', 1], ['step3', '叫 AI 做新模組', 1], ['step4', '讓 AI 修到全綠', 1], ['step5', '總結', 0], ['step6', '課後作業', 2]]
  r.s = st.map(([a, b, f], i) => { const g = grp(L); const x = 60 + i * 212; const hot = i === 3; R(g, x, 455, 198, 150, { fill: hot ? '#3a1d2e' : C.card2, stroke: hot ? C.pink : f === 0 ? C.mut : C.line, sw: 4, dash: f === 0 ? '10 8' : null })
    T(g, x + 99, 510, a, { size: 32, anchor: 'middle', weight: 900, fill: hot ? C.pink : f === 2 ? C.green : C.gold }); T(g, x + 99, 560, b, { size: 23, anchor: 'middle', weight: 800 }); return g })
  r.fold = T(L, 800, 645, '虛線的 step5 只在手冊裡，沒有資料夾；step6 是上完課的作業', { size: 26, anchor: 'middle', fill: C.mut }); r.fold.classList.add('hid')
  r.green = box(L, 70, 670, 1460, 70, '全綠＝自動檢查全部通過（都打勾）', { size: 30, fill: '#173a2a', stroke: C.green, color: C.green, weight: 800 })
  r.up = grp(L); T(r.up, 800, 790, '▲ 動畫上方：Step 按鈕可以直接跳章節', { size: 30, anchor: 'middle', weight: 900, fill: C.teal })
  T(r.up, 800, 850, '▼ 動畫下方：「◀ 上一句」沒聽懂就再聽一次', { size: 30, anchor: 'middle', weight: 900, fill: C.teal })
  return r
}, [
  ['整堂課只用三個視窗：VS Code、終端機、還有瀏覽器。', r => stagger(r.w, 400)],
  ['終端機就像對講機：你打一行字、按 Enter，電腦回你一段話。等它回完，再打下一行。', r => { glow(r.w[1]); show(r.term) }],
  ['課程分成六步：從準備環境，一路做到讓 AI 自己修到全綠。', r => stagger(r.s.slice(0, 6), 250)],
  ['全綠的意思是：自動檢查全部通過。', r => { show(r.green); glow(r.green) }],
  ['教材裡有 step0 到 step4 的資料夾；step5 是總結，只在手冊裡；step6 是上完課的作業。', r => { show([r.s[6], r.fold]); glow(r.s[5]) }],
  ['重頭戲是 step3：讓 AI 照規矩，做出一個新模組。', r => glow(r.s[3])],
  ['這支動畫上方有 Step 按鈕可以跳章節；下方有「上一句」，沒聽懂就按它再聽一次。', r => show(r.up)],
])

// ════════════════════════════ Step 0 ════════════════════════════
chapter('Step 0', '準備環境', C.gold)

scene('打開 VS Code 的終端機', () => {
  const r = {}; mhead('step0 ①', '在 VS Code 裡打開終端機')
  const [a, b, c] = vsh(r, ['vs01-empty', 'vs02-menu-terminal', 'vs03-terminal'])
  r.m = hl(r, a, 'menuTerm', '終端機（英文：Terminal）', { below: true, size: 24 })
  r.n = hl(r, b, 'newTerm', '新增終端（英文：New Terminal）', { right: true, below: true, pad: 3, size: 24 })
  r.p = hl(r, c, 'panel', '終端機就在下面', { inside: true, pad: 2 })
  r.pr = hl(r, c, 'prompt', 'PS 開頭：可以打字了', { col: C.green, below: true })
  r.k = miniKeys(960, 540); hide(r.k)
  cursor(r)
  return r
}, [
  ['先打開 VS Code。上方選單找到「終端機」；英文介面叫 Terminal。', r => { show(r.S[0]); zoom(r.S[0], 'menuTerm', { pad: 160, max: 2.2 }); later(600, () => only(r, r.m)) }],
  ['點下去，選「新增終端」；英文是 New Terminal。', r => { unzoom(r.S[0]); to(r, r.S[1]); zoom(r.S[1], 'newTerm', { pad: 120, max: 2.2 }); only(r, r.n) }],
  ['畫面下方會多出一塊黑色區域，這就是終端機。', r => { unzoom(r.S[1]); to(r, r.S[2]); only(r, r.p) }],
  ['看到 PS 開頭、後面有一個閃動的方塊，就可以打字了。', r => { zoom(r.S[2], 'prompt', { pad: 120, max: 2.2 }); only(r, r.pr) }],
  ['以後也可以按快捷鍵 Ctrl+`。反引號在鍵盤左上角、Esc 的正下方。', r => { unzoom(r.S[2]); only(r); show(r.k); glow(r.k) }],
])

scene('下載教材：git clone', () => {
  const r = {}; mhead('step0 ②', '把整包教材下載到你的電腦')
  r.t = term({ y: 128, h: 560, size: 27, path: 'C:\\Users\\你的帳號', note: '放大給你看' })
  r.url = codeCard(80, 700, 1440, ['git clone https://github.com/xian711/AI_CRUD_Workshop_Frontend_EASY.git'], { title: '教材網址（手冊 Step 0 也有，可以直接複製）', size: 28, col: C.gold })
  r.cdtip = tip('cd ＝ 切換到某個資料夾，像在檔案總管點進去一樣', { y: 716, size: 30, col: C.teal })
  r.tip = tip('git clone ＝ 把網路上的整包教材，完整複製一份到你的電腦', { y: 716, size: 30 })
  r.nogit = tip('出現「無法辨識 git」的紅字＝還沒裝 git：到 git-scm.com 下載安裝，再重開 VS Code', { y: 716, size: 26, col: C.coral })
  const [v] = vsh(r, ['vs06-clone-done'])
  r.v1 = hl(r, v, 'done', 'done：下載完成', { col: C.green, below: true })
  r.real = realNote()
  return r
}, [
  ['第一步，切到要放教材的地方。cd 的意思是「切換到某個資料夾」，像在檔案總管點進去一樣。', r => { show([r.t.g, r.cdtip]); r.t.prompt() }],
  ['例如放 D 槽，就輸入 cd D:\\，按 Enter。電腦只有 C 槽的話，就輸入 cd C:\\。', r => { r.t.clear(); r.t.cmd('cd D:\\') }],
  ['第二步，輸入 git clone，空一格，再貼上教材網址，按 Enter。網址在手冊 Step 0，可以直接複製。', r => { hide(r.cdtip); show(r.url); r.t.cmd('git clone https://github.com/xian711/AI_CRUD_Workshop_Frontend_EASY.git', { path: 'D:\\', cps: 26 }) }],
  ['git clone 的意思，是把網路上的整包教材，完整複製一份到你的電腦。', r => { hide(r.url); show(r.tip); r.t.out(["Cloning into 'AI_CRUD_Workshop_Frontend_EASY'...", 'remote: Enumerating objects: 1518, done.', 'remote: Counting objects: 100% (1518/1518), done.', 'remote: Compressing objects: 100% (1244/1244), done.', 'remote: Total 1518 (delta 319), reused 1439 (delta 241), pack-reused 0 (from 0)', 'Receiving objects: 100% (1518/1518), 5.87 MiB | 17.42 MiB/s, done.'], { gap: 380 }) }],
  ['看到 Updating files … done，下一行又出現 PS D:\\>，就下載好了。D 槽會多一個 AI_CRUD_Workshop_Frontend_EASY 資料夾。', r => { hide(r.tip); const L2 = r.t.out(['Resolving deltas: 100% (319/319), done.', 'Updating files: 100% (1705/1705), done.'], { gap: 300 }); r.t.prompt('D:\\'); later(900, () => { const m = r.t.mark(L2[1], '下載完成', C.green); show(m); glow(m) }) }],
  ['如果出現「無法辨識 git」的紅字，代表還沒裝 git。到 git-scm.com 下載安裝，再重開 VS Code。', r => { show(r.nogit) }],
  ['這是你螢幕上實際會看到的樣子，字比較小是正常的。', r => { hide([r.t.g, r.nogit]); show([r.S[0], r.real]); later(700, () => only(r, r.v1)) }],
])

scene('用 VS Code 打開教材資料夾', () => {
  const r = {}; mhead('step0 ③', '用 VS Code 打開教材資料夾')
  r.S = [scr('vs07-menu-file', FV), scr('vs08-open-folder-dialog', fitF('vs08-open-folder-dialog', { x: 120, y: 116, w: 1360, h: 765 })), scr('vs09-trust', FV), scr('vs10-explorer', FV)]
  const [a, d0, c, d] = r.S
  r.a1 = hl(r, a, 'openFolder', '開啟資料夾…', { right: true, below: true, pad: 3 })
  r.b0 = hl(r, d0, [10, 560, 280, 270], '本機 → DATA (D:)', { col: OR, size: 28, right: false, lx: 140, pad: 4 })
  r.b1 = hl(r, d0, 'address', '上方路徑：D:\\AI_CRUD_Workshop_Frontend_EASY', { col: OR, below: true, size: 28 })
  r.b2 = hl(r, d0, 'ok', '選取資料夾', { col: OR, size: 32 })
  r.c1 = hl(r, c, 'yes', '是，我信任作者', { col: C.green, below: true, size: 30 })
  r.c2 = hl(r, c, [325, 360, 420, 22], '這個勾選框不用勾', { col: C.gold, above: true, size: 24 })
  r.d1 = hl(r, d, 'tree', '左邊：檔案總管', { right: true, pad: 2 })
  r.d2 = hl(r, d, [53, 113, 257, 132], 'step0～4：每一步的材料　step6：課後作業', { lx: 560, below: true, size: 26 })
  r.d3 = hl(r, d, 'handbook', 'HANDBOOK：學習手冊', { lx: 560 })
  cursor(r)
  return r
}, [
  ['接著用 VS Code 打開剛下載的資料夾。點上方選單「檔案」，選「開啟資料夾」。', r => { show(r.S[0]); only(r, r.a1); clickAt(r, r.S[0], 'openFolder', { fx: 0.25 }) }],
  ['在跳出的視窗，左邊點「本機」，再點 D 槽；D 槽可能叫「DATA (D:)」。按兩下 AI_CRUD_Workshop_Frontend_EASY 進去。', r => { to(r, r.S[1]); hide(r.cur); only(r, r.b0) }],
  ['看到上方路徑是這個資料夾，就按右下角的「選取資料夾」。', r => { only(r, r.b1, r.b2); clickAt(r, r.S[1], 'ok') }],
  ['VS Code 會問你：是否信任這個資料夾的作者？教材是你剛下載的，按「是，我信任作者」。下面的勾選框不用勾。', r => { to(r, r.S[2]); hide(r.cur); zoom(r.S[2], 'dialog', { pad: 30, max: 1.8 }); only(r, r.c1, r.c2) }],
  ['左邊是檔案總管。step0 到 step4 是每一步的材料，step6 是課後作業；step5 是總結，只在手冊裡。', r => { unzoom(r.S[2]); to(r, r.S[3]); only(r, r.d1, r.d2) }],
  ['HANDBOOK 資料夾裡是學習手冊，整堂課照著它走。', r => only(r, r.d3)],
])

scene('前置檢查：preflight', () => {
  const r = {}; mhead('step0 ④', '跑前置檢查，確認電腦準備好了')
  r.t = term({ y: 128, h: 572, size: 25, note: '放大給你看' })
  const [v] = vsh(r, ['vs13-preflight-pass'])
  r.v1 = hl(r, v, 'summary', '可以開課！', { col: C.green, below: true })
  r.card = tip('比喻：出門前的檢查清單——護照、機票、錢包，一項一項打勾，全部打勾才出門', { y: 720, size: 28 })
  r.names = tip('這些名字不用懂，只看每一行開頭是不是綠色的 [PASS]', { y: 806, size: 30, col: C.green })
  r.warn = grp(L); R(r.warn, 80, 712, 1440, 168, { fill: '#1b1a10', stroke: C.gold, sw: 3, rx: 14 })
  T(r.warn, 110, 750, '範例（乾淨的電腦最常見）：', { size: 24, weight: 800, fill: C.gold })
  const wt = T(r.warn, 110, 800, '[WARN] Playwright Chromium 已快取 — 未找到 Chromium 快取；step4 首跑會自動下載', { size: 26, weight: 700, fill: TC.warn }); wt.style.fontFamily = MONO
  T(r.warn, 110, 852, '黃色 [WARN]＝提醒，可以開課　·　紅色 [FAIL]＝一定要處理', { size: 28, weight: 900, fill: C.ink })
  r.real = realNote()
  r.ep = codeCard(80, 712, 1440, ['Set-ExecutionPolicy -Scope CurrentUser RemoteSigned'], { title: '出現「已停用指令碼執行」或「未經數位簽署」的紅字：先打這一行，再重跑 .\\preflight.ps1', size: 30, col: C.coral })
  return r
}, [
  ['再開一次終端機。這次它會直接停在教材資料夾裡。', r => { show(r.t.g); r.t.prompt() }],
  ['先輸入 cd step0_course_intro，按 Enter。', r => { r.t.clear(); r.t.cmd('cd step0_course_intro') }],
  ['再輸入 .\\preflight.ps1，按 Enter。最前面的點和反斜線不能漏。', r => { r.t.cmd('.\\preflight.ps1', { path: LAB + '\\step0_course_intro' }) }],
  ['如果一按 Enter 就出現「已停用指令碼執行」或「未經數位簽署」的紅字，是電腦不准跑腳本。先打畫面下方這一行，再重跑一次；公司電腦改不了，就找 IT 或講師。', r => { show(r.ep) }],
  ['這支腳本像出門前的檢查清單，會一項一項檢查 10 件事。', r => { hide(r.ep); show(r.card);
    r.t.out(['===== AI CRUD 工作坊 EASY 版 — 前置檢查 =====', '[PASS] Node.js >= 20 — 偵測到 v24.13.0', '[PASS] pnpm 已安裝 — 偵測到 pnpm 10.33.0', '[PASS] git 已安裝 — 偵測到 git version 2.54.0.windows.1',
      '[PASS] port 3100 未被占用 — port 3100 目前空閒（範本專案 sample-app 會用這個埠）', '[PASS] 磁碟剩餘空間 >= 2GB — D: 剩餘約 1238.56 GB', '[PASS] ExecutionPolicy 可執行腳本 — 生效原則為 RemoteSigned（CurrentUser=RemoteSigned／LocalMachine=AllSigned）', '[PASS] 工作區可寫入 — 工作坊根目錄可建立／刪除暫存檔',
      '[PASS] npm registry 連線 — 可連上 registry.npmjs.org', '[PASS] Playwright Chromium 已快取 — 已找到 8 個 chromium 快取目錄（step4 E2E 可直接跑）', '[PASS] AI Agent CLI — 偵測到：claude、codex'], { gap: 330 }) }],
  ['這些名字不用懂，只要看每一行開頭，是不是綠色的 [PASS]。', r => { hide(r.card); show(r.names) }],
  ['最後一行寫「前置檢查全數通過，可以開課！」，就過關了。', r => { const L2 = r.t.out(['', '前置檢查全數通過，可以開課！'], { gap: 200, color: TC.ok }); later(500, () => { const m = r.t.mark(L2[1], '過關', C.green); show(m); glow(m) }) }],
  ['黃色的 [WARN] 是提醒，也可以開課。乾淨的電腦最常看到的是這一行。只有紅色的 [FAIL] 一定要處理。', r => { hide(r.names); show(r.warn) }],
  ['這是你螢幕上實際會看到的樣子。', r => { hide([r.t.g, r.warn]); show([r.S[0], r.real]); later(700, () => only(r, r.v1)) }],
])

scene('看到紅燈 [FAIL] 怎麼辦', () => {
  const r = {}; mhead('step0 ⑤', '看到紅燈不用慌，照三步走')
  r.t = term({ x: 60, y: 128, w: 920, h: 500, size: 23, note: '真實紅燈' })
  const L1 = ['[PASS] git 已安裝 — 偵測到 git version 2.54.0.windows.1', '[FAIL] port 3100 未被占用 — port 3100 已被占用', '       修復提示：請關閉占用 3100 的程式，或執行「Get-Process -Id (Get-NetTCPConnection -LocalPort 3100).OwningProcess」找出並結束該程序', '…', '有 1 項檢查未通過，請依上方修復提示處理後重新執行 preflight.ps1。']
  r.lines = r.t.out(L1, { gap: 0 })
  r.park = grp(L); R(r.park, 1010, 140, 530, 230, { fill: C.card, stroke: C.teal, sw: 4 }); T(r.park, 1040, 190, '比喻：連接埠＝停車格', { size: 30, weight: 900, fill: C.teal })
  T(r.park, 1040, 245, '範本網站要停 3100 號格', { size: 27 }); T(r.park, 1040, 290, '被別台車先停了，', { size: 27 }); T(r.park, 1040, 335, '就停不進去 → 紅燈', { size: 27, weight: 800, fill: C.red })
  r.steps = [['照「修復提示」做一次', C.teal], ['關掉終端機、開一個新的再跑', C.gold], ['還是紅，整段輸出貼給 AI', C.coral]].map(([t, col], i) => { const g = grp(L); const y = 395 + i * 80; R(g, 1010, y, 530, 68, { fill: C.card, stroke: col, sw: 4 }); mk('circle', { cx: 1048, cy: y + 34, r: 22, fill: col }, g); T(g, 1048, y + 44, String(i + 1), { size: 28, anchor: 'middle', weight: 900, fill: C.bg }); T(g, 1082, y + 44, t, { size: 25, weight: 800 }); return g })
  r.prompt = codeCard(60, 650, 1480, ['這是工作坊環境前置檢查（step0_course_intro\\preflight.ps1）的完整輸出，我用 Windows 11。', '請說明每個 [FAIL] 的原因、給我可複製的修復指令，修完帶我重跑一次；不要改工作坊裡的任何檔案。'], { title: 'prompt＝你要對 AI 說的話。手冊 Step 0「看到 [FAIL] 紅燈怎麼辦」裡現成的這段，連同整份輸出一起貼', size: 22, col: C.coral })
  return r
}, [
  ['如果看到紅色的 [FAIL]，先別慌。這是一次真實的紅燈：3100 這個連接埠被別的程式占用了。', r => { show(r.t.g); later(500, () => { const m = r.t.mark(r.lines[1], 'FAIL', C.red); show(m); glow(m) }) }],
  ['連接埠像停車格：範本網站要停 3100 號格，被別台車先停了，就停不進去。', r => show(r.park)],
  ['第一步，照它下面的「修復提示」做一次。', r => { hide(r.park); show(r.steps[0]); later(400, () => { const m = r.t.mark(r.lines[2], '修復提示', C.gold); show(m) }) }],
  ['第二步，關掉終端機，開一個新的再跑。照提示裝了新程式的話，要新開的終端機才找得到它。', r => show(r.steps[1])],
  ['第三步，還是紅，就請 AI 幫忙。prompt 就是你要對 AI 說的話，手冊 Step 0 有一段現成的。', r => { show([r.steps[2], r.prompt]) }],
  ['把這段 prompt 和整份輸出，連同 [PASS] 的行，一起貼給你會用的 AI，請它帶你修。', r => glow(r.prompt)],
])

scene('打開學習手冊', () => {
  const r = {}; mhead('step0 ⑥', '用瀏覽器打開學習手冊 HANDBOOK')
  r.t = term({ y: 128, h: 380, size: 27, note: '放大給你看', path: LAB + '\\step0_course_intro' })
  const [v] = vsh(r, ['vs14-start-handbook'])
  r.v1 = hl(r, v, 'cmd', 'start 加檔名：用瀏覽器打開', { above: true })
  r.bw = bwin(['br01-handbook-top', 'br02-handbook-step0'], 'file:///D:/AI_CRUD_Workshop_Frontend_EASY/HANDBOOK/HANDBOOK.html'); r.B = r.bw.S
  r.b1 = hl(r, r.B[0], 'nav', 'Step 0～5：點了直接跳', { col: OR, below: true, size: 30 })
  r.b2 = hl(r, r.B[1], 'goal', '「這一步要做到」：先看這裡', { col: OR, below: true, size: 30 })
  r.up = tip('cd ..＝回到上一層資料夾（cd 空一格，再兩個點）', { y: 540, size: 32, col: C.teal })
  return r
}, [
  ['準備好之後，打開學習手冊。剛才在 step0_course_intro 裡，先輸入 cd ..，按 Enter，回到上一層的教材資料夾。', r => { show([r.t.g, r.up]); r.t.prompt(); later(400, () => { r.t.clear(); r.t.cmd('cd ..', { path: LAB + '\\step0_course_intro' }); later(1800, () => r.t.prompt(LAB)) }) }],
  ['再輸入 start HANDBOOK\\HANDBOOK.html，按 Enter。start 加檔名，會用你預設的瀏覽器打開它。', r => { hide(r.up); r.t.clear(); r.t.cmd('start HANDBOOK\\HANDBOOK.html', { path: LAB, cps: 24 }) }],
  ['這是你螢幕上實際會看到的樣子。', r => { hide(r.t.g); show(r.S[0]); later(600, () => only(r, r.v1)) }],
  ['瀏覽器會打開手冊。上方有 Step 0 到 Step 5 的按鈕，點了就跳到那一步。', r => { hide(r.S[0]); only(r); show(r.bw.g); show(r.B[0]); later(400, () => only(r, r.b1)) }],
  ['每一步開頭都有「這一步要做到」，先看這裡，就知道這一步的目標。', r => { swap(r.B, r.B[1]); only(r, r.b2) }],
])

// ════════════════════════════ Step 1 ════════════════════════════
chapter('Step 1', '為什麼要給 AI 規矩', C.coral)

scene('同一句需求，兩個產出', () => {
  const r = {}; mhead('step1 ①', '同一句需求，只差有沒有附規矩')
  const A1 = { x: 40, y: 150, w: 750, h: 470, bar: 56 }, A2 = { x: 810, y: 150, w: 750, h: 470, bar: 56 }
  r.b1 = bwin(['br10-noh'], 'no-harness.html', A1); r.b2 = bwin(['br13-wh'], 'with-harness.html', A2)
  show(r.b1.S[0]); show(r.b2.S[0])
  r.l1 = T(L, 415, 660, '沒給規矩', { size: 40, anchor: 'middle', weight: 900, fill: C.coral }); r.l1.classList.add('hid')
  r.l2 = T(L, 1185, 660, '有給規矩（harness）', { size: 40, anchor: 'middle', weight: 900, fill: C.teal }); r.l2.classList.add('hid')
  r.c1 = hl(r, r.b1.S[0], 'add', '橘色：AI 自己挑的', { col: OR, below: true, size: 26 })
  r.c2 = hl(r, r.b2.S[0], 'add', '品牌紅：規則指定的', { col: OR, below: true, size: 26 })
  const [v] = vsh(r, ['vs15-start-demo'])
  r.v1 = hl(r, v, 'cmd', 'start step1_why_harness\\demo\\no-harness.html', { above: true, size: 24 })
  r.tip = tip('差別不在美醜，在「這個決定是誰做的」', { y: 720, size: 36 })
  r.with = tip('把 no-harness 換成 with-harness 再打一次，就能打開另一個', { y: 806, size: 28, col: C.teal })
  return r
}, [
  ['step1 用同一句需求，請 AI 各做一次：一次沒給規矩，一次附上規矩。這就是兩次的成品。', r => { show([r.b1.g, r.b2.g, r.l1, r.l2]) }],
  ['兩個成品放在 step1_why_harness 的 demo 資料夾。在終端機輸入 start 加檔名打開。', r => { hide([r.b1.g, r.b2.g, r.l1, r.l2]); show(r.S[0]); later(500, () => only(r, r.v1)) }],
  ['把 no-harness 換成 with-harness，再打一次，就能打開另一個。', r => show(r.with)],
  ['兩版都很好看，新增和刪除也都能用。', r => { hide([r.S[0], r.with]); only(r); show([r.b1.g, r.b2.g, r.l1, r.l2]) }],
  ['差別在顏色從哪來：左邊的橘色是 AI 自己挑的；右邊的品牌紅，是規則指定的。', r => { zoom(r.b1.S[0], 'add', { pad: 90, max: 2.4 }); zoom(r.b2.S[0], 'add', { pad: 90, max: 2.4 }); only(r, r.c1, r.c2) }],
  ['所以差別不在美醜，在「這個決定是誰做的」。', r => { unzoom(r.b1.S[0]); unzoom(r.b2.S[0]); only(r); show(r.tip); glow(r.tip) }],
])

scene('錯不起的欄位：血型', () => {
  const r = {}; mhead('step1 ②', '最該記住的一列：血型')
  r.bw = bwin(['br10-noh', 'br12-noh-added', 'br14-wh-empty-submit', 'br15-wh-phone-blocked'], 'no-harness.html'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'blood', '一打開就選好「A」', { col: C.red, below: true, size: 30 })
  r.a2 = hl(r, r.B[1], 'row', '(02) 市話也收、血型存成 A', { col: C.red, below: true, size: 30 })
  r.b1 = hl(r, r.B[2], 'bloodErr', '沒選血型 → 擋下來', { col: OR, below: true, size: 30, pad: 6 })
  r.b2 = hl(r, r.B[3], 'phoneErr', '只收 09 開頭 10 碼', { col: OR, below: true, size: 30, pad: 6 })
  r.bag = tip('哪些欄位錯不起、要怎麼檢查——這些就是要放進滷包的規矩', { y: 806, size: 30, col: C.gold })
  return r
}, [
  ['最該記住的是血型。沒給規矩那版，一打開就替你選好「A」，而且完全不檢查。', r => { show(r.bw.g); show(r.B[0]); zoom(r.B[0], 'blood', { pad: 160, max: 1.8 }); only(r, r.a1) }],
  ['志工沒改到就按新增，存進去的就是錯的血型。要等到真的要輸血，才會發現。', r => { unzoom(r.B[0]); swap(r.B, r.B[1]); only(r, r.a2) }],
  ['有給規矩那版，預設是「請選擇血型」，沒選就擋下來。', r => { burl(r.bw, 'with-harness.html'); swap(r.B, r.B[2]); only(r, r.b1) }],
  ['電話也一樣：規矩寫了只收 09 開頭 10 碼，(02) 市話就會被擋。', r => { swap(r.B, r.B[3]); only(r, r.b2) }],
  ['AI 不是不會寫驗證，是沒人告訴它哪些欄位錯不起。這些錯不起的事，就是要放進滷包的規矩。', r => { only(r); show(r.bag) }],
])

// ════════════════════════════ Step 2 ════════════════════════════
chapter('Step 2', '玩範本、認識規矩', C.teal)

scene('安裝並啟動範本', () => {
  const r = {}; mhead('step2 ①', '安裝並啟動範本：pnpm install → pnpm dev')
  r.t = term({ y: 128, h: 600, size: 24, note: '放大給你看' })
  const [a] = vsh(r, ['vs17-pnpm-dev'])
  r.v1 = hl(r, a, 'url', 'http://localhost:3100/', { col: C.green, below: true })
  r.v2 = hl(r, a, 'url', '按住 Ctrl 再點這個網址', { col: C.gold, below: true, size: 30, pad: 8 })
  r.slash = tip('路徑裡的斜線，用 / 或 \\ 都可以，PowerShell 兩種都認得', { y: 750, size: 28, col: C.teal })
  r.pkg = tip('套件＝範本要用到的零件，第一次要先下載', { y: 750, size: 30, col: C.teal })
  r.shop = tip('pnpm dev 像打開店門：店開著，瀏覽器才進得來。這個終端機不要關', { y: 750, size: 28 })
  r.lh = tip('localhost＝你自己這台電腦，只有你看得到', { y: 806, size: 30, col: C.teal })
  r.err = tip('第一次打開是 500、寫著 useColorMode is not defined：在這個終端機按 Ctrl+C 停掉，再打一次 pnpm dev', { y: 806, size: 24, col: C.coral })
  return r
}, [
  ['step2 先把範本跑起來。確認終端機開頭是 PS D:\\AI_CRUD_Workshop_Frontend_EASY>，再輸入 cd step2_speedrun_kit/2.1_sample_app/sample-app。', r => { show(r.t.g); r.t.cmd('cd step2_speedrun_kit/2.1_sample_app/sample-app', { cps: 30 }) }],
  ['路徑裡的斜線，用 / 或 \\ 都可以，PowerShell 兩種都認得。', r => show(r.slash)],
  ['再輸入 pnpm install。套件就是範本要用到的零件，第一次要先下載，大約要等一兩分鐘。', r => { hide(r.slash); show(r.pkg); r.t.cmd('pnpm install', { path: SAMPLE }); later(1600, () => r.t.out(['Lockfile is up to date, resolution step is skipped', 'Packages: +726', '   ╭─────────────────────────────────────────╮', '   │   Update available! 10.33.0 → 12.9.1.   │', '   │    To update, run: pnpm add -g pnpm     │', '   ╰─────────────────────────────────────────╯'], { gap: 300 })) }],
  ['中間如果出現「Update available」的框框，是 pnpm 有新版本，不用理它。最後出現 Done，就裝好了。', r => { hide(r.pkg); later(200, () => { const up = r.t.lines.find(t => t.textContent.includes('Update available')); if (up) show(r.t.mark(up, '不用理它', C.teal)) });
    const L2 = r.t.out(['Progress: resolved 726, reused 726, downloaded 0, added 726, done', '…', 'Done in 8.7s using pnpm v10.33.0'], { gap: 350, delay: 900 }); later(2200, () => { const m = r.t.mark(L2[2], '裝好了', C.green); show(m) }) }],
  ['接著輸入 pnpm dev，啟動網頁伺服器。', r => { r.t.clear(); r.t.cmd('pnpm dev', { path: SAMPLE }); later(1500, () => r.t.out(['> crud-standard-template@1.0.0 dev', '> nuxt dev', '●  Nuxt 3.21.1 (with Nitro 2.13.4, Vite 7.3.1 and Vue 3.5.30)', '  ➜ Local:    http://localhost:3100/', '  ➜ Network:  use --host to expose', '✔ Vite client built in 95ms'], { gap: 350 })) }],
  ['pnpm dev 像打開店門：店開著，瀏覽器才進得來。所以這個終端機要一直開著，不要關。', r => { show(r.shop) }],
  ['看到 localhost:3100 這一行，就是網址。localhost 指的就是你自己這台電腦。', r => { hide([r.t.g, r.shop]); show([r.S[0], r.lh]); later(600, () => only(r, r.v1)) }],
  ['滑鼠移到網址上，按住 Ctrl 再點，瀏覽器就會打開範本。', r => { hide(r.lh); zoom(r.S[0], 'url', { pad: 140, max: 2 }); only(r, r.v2) }],
  ['第一次打開如果是 500、寫著 useColorMode is not defined，先在這個終端機按 Ctrl+C 停掉，再打一次 pnpm dev。', r => { unzoom(r.S[0]); only(r); show(r.err) }],
])
// ── 場景檔第二部分：Step 2（五個檢查點～Design System）、Step 3（指揮官～準備工作區）──
function stepNote(t) { const g = box(L, 1180, 64, 300, 46, t, { size: 24, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900, hidden: false }); return g }

scene('五個檢查點（上）：新增、編輯、刪除', () => {
  const r = {}; mhead('step2 ②', '當使用者玩一輪：新增、編輯、刪除')
  stepNote('檢查點 1～3／5')
  const N = ['br30-list', 'br31-new-empty', 'br32-new-filled', 'br33-saved', 'br34-edit', 'br37-delete-confirm']
  r.bw = bwin(N, 'localhost:3100/template/crud'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'q', '篩選', { col: OR, size: 28 })
  r.a2 = hl(r, r.B[0], [273, 379, 918, 260], '表格', { col: OR, size: 28, inside: true })
  r.a3 = hl(r, r.B[0], 'add', '新增人員', { col: OR, size: 28, below: true, right: true })
  r.sample = card(880, 330, 600, 330, '範例假資料（照格式填就好）', ['姓名：王小美', '生日：1992-05-20', '證號：A223456789', '電話：0912345678', '地址：臺東縣臺東市中華路100號'], C.teal, { size: 26, ts: 28, lh: 44 })
  r.b1 = hl(r, r.B[2], 'save', '填好按「儲存」', { col: OR, size: 30, below: true, right: true })
  r.c1 = hl(r, r.B[3], 'toast', '已新增人員', { col: C.green, size: 30, right: true })
  r.c2 = hl(r, r.B[3], [273, 371, 918, 49], '新增的王小美', { col: C.green, size: 28 })
  r.c3 = hl(r, r.B[3], [1119, 381, 28, 28], '鉛筆＝編輯', { col: OR, size: 28, pad: 8, right: true })
  r.d1 = hl(r, r.B[4], 'note', '改一下備註', { col: OR, size: 30 })
  r.d2 = hl(r, r.B[4], 'save', '再按「儲存」', { col: OR, size: 30, below: true, right: true })
  r.e0 = hl(r, r.B[0], [1151, 474, 28, 28], '垃圾桶＝刪除', { col: C.red, size: 28, pad: 8, right: true })
  r.e1 = hl(r, r.B[5], 'title', '標題：刪除人員', { col: C.red, size: 30, right: true })
  r.e2 = hl(r, r.B[5], 'ok', '按「刪除」才會真的刪', { col: C.red, size: 30, below: true, right: true })
  return r
}, [
  ['這就是範本：人員管理。上面是篩選，中間是表格，右上角是「新增人員」。', r => { show(r.bw.g); show(r.B[0]); only(r, r.a1, r.a2, r.a3) }],
  ['檢查點一：按「新增人員」，把有紅色星號的必填欄位填好。這是假資料，照格式填就好。', r => { burl(r.bw, 'localhost:3100/template/crud/new', true); swap(r.B, r.B[1]); only(r); show(r.sample) }],
  ['填好之後，按右上角的「儲存」。', r => { hide(r.sample); swap(r.B, r.B[2]); zoom(r.B[2], 'save', { pad: 120, max: 1.7 }); only(r, r.b1) }],
  ['右下角跳出「已新增人員」，列表就多了王小美這一筆。', r => { unzoom(r.B[2]); burl(r.bw, 'localhost:3100/template/crud'); swap(r.B, r.B[3]); only(r, r.c1, r.c2) }],
  ['檢查點二：在王小美這一列的右邊，按鉛筆圖示「編輯」。', r => { zoom(r.B[3], [1080, 371, 110, 49], { pad: 80, max: 2 }); only(r, r.c3) }],
  ['改一下資料，再按「儲存」。', r => { unzoom(r.B[3]); burl(r.bw, 'localhost:3100/template/crud/…?mode=edit'); swap(r.B, r.B[4]); only(r, r.d1, r.d2) }],
  ['檢查點三：按某一列右邊的垃圾桶。刪哪一筆都可以，這只是測試資料。', r => { burl(r.bw, 'localhost:3100/template/crud'); swap(r.B, r.B[0]); zoom(r.B[0], [1080, 460, 110, 56], { pad: 80, max: 2 }); only(r, r.e0) }],
  ['會先跳出確認視窗。標題寫「刪除人員」，按「刪除」才會真的刪。', r => { unzoom(r.B[0]); swap(r.B, r.B[5]); zoom(r.B[5], 'dialog', { pad: 60, max: 1.6 }); only(r, r.e1, r.e2) }],
])

scene('五個檢查點（下）：篩選、網址、匯出', () => {
  const r = {}; mhead('step2 ③', '篩選、網址、匯出，再加兩個加分題')
  stepNote('檢查點 4～5／5')
  const N = ['br39-filter-q', 'br40-filter-status', 'br41-newtab', 'br42b-export-all', 'br35-validation']
  r.bw = bwin(N, 'localhost:3100/template/crud'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'q', '打「陳」', { col: OR, size: 30, below: true })
  r.a2 = hl(r, r.B[0], 'count', '馬上只剩 1 筆', { col: OR, size: 30, below: true })
  r.b1 = hl(r, r.B[1], 'status', '狀態：在職', { col: OR, size: 30, below: true })
  r.urlBox = grp(L); R(r.urlBox, 284, 120, 1170, 50, { fill: 'none', stroke: OR, sw: 5, rx: 22 }); r.H = r.H || []; r.H.push(r.urlBox)
  r.keys = grp(L); [['點網址列', 0], ['Ctrl+C', 1], ['Ctrl+T 開新分頁', 2], ['Ctrl+V', 3], ['Enter', 4]].forEach(([t, i]) => { box(r.keys, 150 + i * 266, 640, 246, 70, t, { size: 26, fill: '#0b1520', stroke: C.gold, color: C.gold, weight: 900, hidden: false }); if (i < 4) T(r.keys, 150 + i * 266 + 256, 686, '›', { size: 34, fill: C.mut }) })
  r.tab2 = grp(L); R(r.tab2, 1250, 118, 210, 46, { fill: '#ffffff', stroke: C.green, sw: 4, rx: 12 }); T(r.tab2, 1355, 150, '新分頁', { size: 24, anchor: 'middle', weight: 900, fill: '#1a7f37' })
  r.c1 = hl(r, r.B[2], 'q', '新分頁：條件還在', { col: C.green, size: 30, below: true })
  r.clr = hl(r, r.B[3], [966, 196, 90, 46], '先按「清除」', { col: OR, size: 28, below: true })
  r.d1 = hl(r, r.B[3], 'exp', '匯出 CSV', { col: OR, size: 30, below: true, right: true })
  r.d2 = hl(r, r.B[3], 'count', '共 24 筆', { col: OR, size: 30, below: true })
  r.d3 = hl(r, r.B[3], 'toast', '已匯出 24 筆：全部，不只這一頁', { col: C.green, size: 28, right: true, pad: 30 })
  r.dl = tip('匯出的檔案會存到你的「下載」資料夾，可以用 Excel 打開', { y: 806, size: 28, col: C.teal })
  r.e1 = hl(r, r.B[4], 'err', '清空必填 → 紅字', { col: C.red, size: 30, below: true })
  const mF = fitF('br43-mobile', { x: 1000, y: 140, w: 470, h: 730 })
  r.mob = grp(L); R(r.mob, mF.x - 16, mF.y - 16, mF.w + 32, mF.h + 32, { fill: '#0b0f14', stroke: '#5b6670', sw: 4, rx: 34 }); const ms = scrIn('br43-mobile', mF, r.mob); show(ms)
  r.mobT = box(L, 120, 260, 820, 300, '加分二：把瀏覽器視窗的右邊框\n往左拖，拖到很窄\n表格會變成一張一張卡片', { size: 38, fill: C.card, stroke: C.teal, color: C.ink, weight: 800 })
  return r
}, [
  ['檢查點四：關鍵字打「陳」，表格馬上只剩一筆。', r => { show(r.bw.g); show(r.B[0]); zoom(r.B[0], [248, 180, 700, 160], { pad: 30, max: 1.6 }); only(r, r.a1, r.a2) }],
  ['再把狀態選「在職」，條件會寫進網址。', r => { unzoom(r.B[0]); burl(r.bw, 'localhost:3100/template/crud?q=陳&status=在職', true); swap(r.B, r.B[1]); only(r, r.b1, r.urlBox) }],
  ['點一下網址列，按 Ctrl+C 複製；按 Ctrl+T 開新分頁，按 Ctrl+V 貼上，再按 Enter。', r => { only(r, r.urlBox); show(r.keys) }],
  ['新分頁打開，篩選條件還在。', r => { hide(r.keys); swap(r.B, r.B[2]); show(r.tab2); only(r, r.c1) }],
  ['檢查點五：先按「清除」把條件拿掉，再按「匯出 CSV」。', r => { hide(r.tab2); burl(r.bw, 'localhost:3100/template/crud'); swap(r.B, r.B[3]); only(r, r.clr, r.d1) }],
  ['表格一頁只顯示一部分，匯出的卻是全部，這裡是 24 筆。檔案會存到「下載」資料夾。', r => { only(r, r.d2, r.d3); show(r.dl) }],
  ['加分一：編輯時把姓名清空，再按儲存，欄位下方會出現紅字。', r => { hide(r.dl); burl(r.bw, 'localhost:3100/template/crud/…?mode=edit'); swap(r.B, r.B[4]); zoom(r.B[4], 'name', { pad: 90, max: 1.8 }); only(r, r.e1) }],
  ['加分二：把瀏覽器視窗的右邊框往左拖，拖到很窄，表格會變成一張一張卡片。', r => { unzoom(r.B[4]); only(r); hide(r.bw.g); show([r.mob, r.mobT]) }],
])

scene('範本的 8 個核心檔', () => {
  const r = {}; mhead('step2 ④', '看懂範本：8 個核心檔')
  const [a, b] = vsh(r, ['vs19-readme-raw', 'vs20-readme-preview'])
  r.a0 = hl(r, a, [53, 157, 257, 44], '點小箭頭展開', { lx: 560, col: C.gold })
  r.a1 = hl(r, a, 'file', '2.1_sample_app 裡的 README.md', { lx: 560 })
  r.b1 = hl(r, b, 'h2', '往下捲到「8 個核心檔」', { below: true })
  const rows = [['列表頁 index.vue', 1], ['明細頁 [id].vue', 1], ['資料層 useTemplateMembers', 1], ['欄位元件 TemplateFormField', 1], ['狀態標籤 TemplateStatusBadge', 1], ['列表狀態工廠 useTemplateListPage', 0], ['驗證引擎 templateValidation', 0], ['CSV 匯出 templateCsv', 0]]
  r.tbl = grp(L); R(r.tbl, 70, 120, 1460, 660, { fill: C.card, stroke: C.line, sw: 3 })
  T(r.tbl, 800, 168, '跟「這個資料長什麼樣子」有關 → 複製改名；通用的機制 → 直接共用', { size: 30, anchor: 'middle', weight: 900, fill: C.gold })
  r.rowG = rows.map(([n, copy], i) => { const g = grp(r.tbl, false); const y = 195 + i * 70; R(g, 90, y, 1420, 60, { fill: copy ? '#173a3c' : '#3a2a14', rx: 10 })
    T(g, 120, y + 41, (i + 1) + '. ' + n, { size: 30, weight: 800 }); T(g, 1250, y + 41, copy ? '複製改名' : '直接共用', { size: 32, weight: 900, fill: copy ? C.teal : C.gold }); return g })
  r.names = tip('表格裡的名字不用懂，只看右邊：綠的複製改名，橘的直接共用、不要動', { y: 800, size: 28, col: C.teal })
  r.cmp = box(L, 70, 790, 1460, 90, '比喻：開分店——招牌、菜單要換（複製改名）；收銀機、冷氣照用（直接共用）', { size: 31, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 800 })
  return r
}, [
  ['接著看範本長什麼樣子。在左邊檔案總管，點 step2_speedrun_kit 前面的小箭頭展開，再展開 2.1_sample_app。', r => { show(r.S[0]); later(500, () => only(r, r.a0)) }],
  ['點裡面的 README.md。左邊有好幾個 README，要點 2.1_sample_app 裡的這一個。', r => only(r, r.a1)],
  ['先點一下文件內容，再按 Ctrl+Shift+V，會換成排版好的預覽。往下捲，找到「8 個核心檔」。', r => { to(r, r.S[1]); only(r, r.b1) }],
  ['判斷只有一句：跟這個資料長什麼樣子有關的，複製改名；通用的機制，直接共用。', r => { hide(r.S[1]); only(r); show(r.tbl) }],
  ['表格裡的名字不用懂，看右邊就好：前 5 個複製改名，後 3 個直接共用、不要動。', r => { show(r.names); stagger(r.rowG.slice(0, 5), 200, glow); later(1200, () => stagger(r.rowG.slice(5), 250, glow)) }],
  ['就像開分店：招牌和菜單要換，收銀機和冷氣照用。共用的東西一改，每家分店都受影響。', r => { hide(r.names); show(r.cmp); glow(r.cmp) }],
])

scene('滷包放在哪：給 AI 的四份規矩', () => {
  const r = {}; mhead('step2 ⑤', '滷包放在哪：給 AI 的四份規矩')
  const [a, b] = vsh(r, ['vs21-harness-files', 'vs22b-claude-md-wide'])
  r.a1 = hl(r, a, 'sampleApp', 'sample-app 最上層', { lx: 560 })
  r.a2 = hl(r, a, 'guide', '① 使用說明', { lx: 560, col: C.gold })
  r.a3 = hl(r, a, [53, 419, 257, 66], '② CLAUDE.md　③ CODE-RULES　④ design-system-summary', { lx: 560, col: C.gold, size: 24 })
  r.a4 = hl(r, a, 'agents', 'AGENTS.md：給其他 AI 的便條，只寫「去讀 CLAUDE.md」', { lx: 560, col: C.mut, size: 22 })
  r.b1 = hl(r, b, [52, 60, 1012, 40], 'CLAUDE.md：專案憲法，整份只有 48 行', { below: true })
  r.c = [['不用逐條讀懂', '那是寫給 AI 讀的', C.teal], ['掃過 CLAUDE.md', '48 行、30 秒看完', C.gold], ['滷包跟著鍋子走', 'step3 複製時一起帶走', C.coral]].map(([h, s, col], i) => card(80 + i * 490, 640, 460, 140, h, [s], col, { size: 28, ts: 34 }))
  r.warn = tip('規矩寫錯，AI 會照著錯，而且錯得又快又整齊。規矩要有人負責、有人審', { y: 800, size: 28, col: C.coral })
  return r
}, [
  ['sample-app 資料夾的最上層，有四份給 AI 的規矩：使用說明、CLAUDE.md、CODE-RULES、design-system-summary。', r => { show(r.S[0]); later(500, () => only(r, r.a1, r.a2, r.a3)) }],
  ['旁邊的 AGENTS.md 是給其他 AI 的入口便條，內容只寫「去讀 CLAUDE.md」，不用管它。', r => only(r, r.a4)],
  ['你不用逐條讀懂，那是寫給 AI 讀的。人只要掃過 CLAUDE.md：整份只有 48 行，30 秒看完。', r => { to(r, r.S[1]); only(r, r.b1); later(300, () => show(r.c[0])); later(900, () => show(r.c[1])) }],
  ['滷包跟著鍋子走：step3 複製整個 sample-app 時，這四份會一起帶過去。', r => show(r.c[2])],
  ['但要記得：規矩寫錯，AI 會照著錯，而且錯得又快又整齊。規矩的內容要有人負責、有人審。', r => show(r.warn)],
])

scene('Design System：顏色不寫死', () => {
  const r = {}; mhead('step2 ⑥', 'Design System：顏色和間距都用代號')
  const [b] = vsh(r, ['vs24-start-ds'])
  r.a1 = hl(r, b, 'plus', '＋ 再開一個終端機', { below: true, right: true })
  r.a2 = hl(r, b, 'tabs', '右邊列出所有終端機', { right: true, size: 26 })
  r.b1 = hl(r, b, 'cmd', 'start 加 DESIGN_SYSTEM.html', { below: true })
  r.bw = bwin(['br20-design-system'], 'DESIGN_SYSTEM.html'); r.B = r.bw.S
  r.c1 = hl(r, r.B[0], [268, 100, 690, 160], '顏色、字級、間距集中管理', { col: OR, size: 30, below: true })
  r.jargon = tip('網頁裡的術語不用懂，記住下面這句就好', { y: 806, size: 30, col: C.teal })
  r.paint = box(L, 120, 640, 1360, 150, '比喻：油漆色號\n說「品牌紅」，不說「#C8232C」。要換色，只改色號表一處', { size: 34, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 800 })
  return r
}, [
  ['pnpm dev 那個終端機要一直開著。要再打指令，就按終端機右上角的「＋」，開第二個。', r => { show(r.S[0]); later(500, () => only(r, r.a1, r.a2)) }],
  ['在新的終端機輸入 start step2_speedrun_kit\\2.2_design_system\\DESIGN_SYSTEM.html。', r => only(r, r.b1)],
  ['這就是 Design System：顏色、字級、間距都集中在這裡管理。網頁裡的術語不用懂。', r => { hide(r.S[0]); only(r); show(r.bw.g); show(r.B[0]); show(r.jargon); later(400, () => only(r, r.c1)) }],
  ['記住一句：顏色和間距一律用代號，叫 token，不要直接寫死。', r => { hide(r.jargon); only(r); show(r.paint); glow(r.paint) }],
  ['就像油漆色號：說「品牌紅」，不說色碼。要換顏色，只改色號表一個地方，全站一起換。', r => glow(r.paint)],
])

// ════════════════════════════ Step 3 ════════════════════════════
chapter('Step 3', '叫 AI 做新模組', C.pink)

scene('你是指揮官：先讀 PRD', () => {
  const r = {}; mhead('step3 ①', '重頭戲：你不寫程式，你是指揮官')
  r.mod = box(L, 70, 300, 1460, 220, '新模組：中心裝備物資\n網址會是 /equipment/crud', { size: 54, fill: '#3a1d2e', stroke: C.pink, color: C.ink, weight: 900 })
  const pF = fitF('hb-step3-paradigm', { x: 70, y: 130, w: 1460, h: 600 })
  r.p = scr('hb-step3-paradigm', pF); r.S = [r.p]
  r.cap = tip('以前：自己動手做　→　現在：指揮 AI 做（提需求、做決定、驗收）', { y: 760, size: 32 })
  const [a, b] = ['vs29-prd-fields', 'vs30-prd-decisions'].map(n => { const g = scr(n, FV); r.S.push(g); return g })
  r.a1 = hl(r, a, 'h2', '課堂版：12 欄', { below: true })
  r.b1 = hl(r, b, [105, 105, 892, 330], 'D1 刪除・D2 匯出・D3 編碼', { inside: true })
  r.where = tip('PRD 在 step3_new_module 資料夾：點兩下 PRD-中心裝備物資.md，再按 Ctrl+Shift+V', { y: 820, h: 60, size: 24, col: C.teal })
  return r
}, [
  ['step3 是重頭戲：用同一套範本和規矩，長出新模組「中心裝備物資」。', r => { show(r.mod); glow(r.mod) }],
  ['這一步你不寫程式：以前自己動手做，現在指揮 AI 做。提需求、做決定、驗收成果，是你的事。', r => { hide(r.mod); show([r.p, r.cap]) }],
  ['題目寫在 PRD，也就是需求文件，放在 step3_new_module 資料夾裡。點兩下打開，再按 Ctrl+Shift+V 看排版。', r => { hide(r.cap); to(r, r.S[1]); show(r.where); only(r, r.a1) }],
  ['原系統有 26 欄，已經濃縮成一堂課做得完的 12 欄。', r => only(r, r.a1)],
  ['PRD 第 5 節刻意留了三個決定給你：刪除要不要補、匯出要不要做、編碼規則要不要簡化。', r => { to(r, r.S[2]); only(r, r.b1) }],
])

scene('準備工作區：複製範本', () => {
  const r = {}; mhead('step3 ②', '先把範本複製一份，當成你的工作專案')
  r.bw = bwin(['br06-handbook-copyblock'], 'HANDBOOK.html#step3'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], 'pre', '整段選起來，按 Ctrl+C', { col: OR, size: 30, below: true })
  r.S = [scr('vs25-pasted', FV), scr('vs26-step3-prep', FV), scr('vs08-open-folder-dialog', fitF('vs08-open-folder-dialog', { x: 120, y: 116, w: 1360, h: 765 })), scr('vs27-myapp-explorer', FV)]
  const [a, b, d0, c] = r.S
  r.a0 = hl(r, a, [73, 71, 640, 19], '開頭要是 PS D:\\AI_CRUD_Workshop_Frontend_EASY>', { below: true, size: 26 })
  r.a2 = hl(r, a, 'robocopy', '會自動跳過三個暫存資料夾', { below: true })
  r.a3 = hl(r, a, 'install', '最後 pnpm install', { below: true })
  r.b1 = hl(r, b, 'done', 'Done：裝好了', { col: C.green, above: true })
  r.b2 = hl(r, b, 'prompt', '已經在 my-equipment-app 裡', { col: C.green, above: true, right: true })
  r.f1 = hl(r, d0, 'step3_new_module', '點兩下 step3_new_module', { col: OR, size: 30, below: true })
  r.f2 = tip('再點兩下裡面的 my-equipment-app，按「選取資料夾」', { y: 806, size: 30, col: OR })
  r.c1 = hl(r, c, [53, 333, 257, 22], '使用說明', { lx: 560, col: C.gold })
  r.c2 = hl(r, c, [53, 421, 257, 66], 'CLAUDE.md・CODE-RULES・design-system-summary', { lx: 560, col: C.gold, size: 24 })
  r.enter = tip('貼上後每行前面會出現 >>，這時再按一次 Enter 才會開始跑', { y: 806, size: 28, col: C.teal })
  r.close = tip('換資料夾時，原本的終端機（含 pnpm dev）會關掉，沒關係；上一層信任過，不會再問', { y: 806, size: 24, col: C.teal })
  return r
}, [
  ['先把範本複製一份，當成你自己的工作專案 my-equipment-app。', r => { show(r.bw.g); show(r.B[0]) }],
  ['打開手冊 step3 的「⓪ 準備工作區」，用滑鼠把 Windows 那段指令整段選起來，按 Ctrl+C。', r => only(r, r.h1)],
  ['回到 VS Code，用第二個終端機。確認開頭是 PS D:\\AI_CRUD_Workshop_Frontend_EASY>，按 Ctrl+V 貼上。', r => { hide(r.bw.g); only(r); show(r.S[0]); later(500, () => only(r, r.a0)) }],
  ['貼上之後，每一行前面會出現兩個大於符號。這時再按一次 Enter，才會開始跑。', r => { show(r.enter) }],
  ['這段指令會自動跳過三個暫存資料夾，你不用做任何事。最後會切進 my-equipment-app，跑 pnpm install。', r => { hide(r.enter); only(r, r.a2, r.a3) }],
  ['看到 Done，就好了。', r => { to(r, r.S[1]); only(r, r.b1, r.b2) }],
  ['接著用「檔案」→「開啟資料夾」，在教材資料夾裡點兩下 step3_new_module。', r => { to(r, r.S[2]); only(r, r.f1) }],
  ['再點兩下裡面的 my-equipment-app，按「選取資料夾」。', r => { show(r.f2) }],
  ['換資料夾時，原本的終端機會關掉，pnpm dev 也會停，沒關係。上一層已經信任過，不會再問。', r => { hide(r.f2); to(r, r.S[3]); show(r.close); only(r) }],
  ['四份規矩已經跟著過來了。PRD 也在裡面，往下捲就看得到。', r => { hide(r.close); only(r, r.c1, r.c2) }],
])
// ── 場景檔第三部分：Step 3（安裝 Claude Code、貼起手 prompt、選擇題）──
scene('第一次用：安裝 Claude Code', () => {
  const r = {}; mhead('step3 ③', '第一次用：先安裝 Claude Code 擴充')
  const [a, b, c] = vsh(r, ['cc-i1-activity', 'cc-i2-search', 'cc-i3-detail', 'cc00-statusbar'].slice(0, 3))
  r.S.push(scr('cc00-statusbar', FV))
  r.a1 = hl(r, a, 'ext', '延伸模組', { right: false, lx: 230, size: 30, pad: 6 })
  r.b1 = hl(r, b, 'search', '輸入 Claude Code', { lx: 560, size: 30 })
  r.b2 = hl(r, b, 'first', '', { col: C.green })
  r.b3 = hl(r, b, 'fake1', '', { col: C.red })
  r.b4 = hl(r, b, 'fake2', '', { col: C.red })
  r.pick = tip('綠框才對：發行者 Anthropic、有藍色勾勾　｜　紅框：名字很像的別家，不要選', { y: 806, size: 28, col: C.green })
  r.c1 = hl(r, c, 'publisher', 'Anthropic ✓ anthropic.com', { col: C.green, below: true, size: 26 })
  r.c2 = hl(r, c, 'install', '安裝', { col: C.coral, below: true, size: 32, pad: 6 })
  r.c3 = hl(r, c, 'plan', '要用 Pro、Max、Team、Enterprise 方案或用量計費', { col: C.gold, above: true, size: 24 })
  r.d1 = hl(r, r.S[3], 'status', '裝好後：✻ Claude Code', { col: C.coral, above: true, right: true, size: 28, pad: 6 })
  r.acct = tip('第一次打開會請你登入：帳號請依講師或公司的說明準備', { y: 806, size: 28, col: C.teal })
  cursor(r)
  return r
}, [
  ['第一次用 Claude Code，要先安裝它的 VS Code 擴充。點左邊的「延伸模組」圖示。', r => { show(r.S[0]); only(r, r.a1); clickAt(r, r.S[0], 'ext') }],
  ['在搜尋框輸入 Claude Code。', r => { to(r, r.S[1]); hide(r.cur); only(r, r.b1) }],
  ['名字很像的有好幾個。要選發行者是 Anthropic、旁邊有藍色勾勾的那一個。', r => { zoom(r.S[1], [53, 100, 256, 230], { pad: 20, max: 1.8 }); only(r, r.b2, r.b3, r.b4); show(r.pick) }],
  ['點進去，按「安裝」。', r => { hide(r.pick); unzoom(r.S[1]); to(r, r.S[2]); only(r, r.c1, r.c2) }],
  ['說明頁有寫：要用 Claude 的付費方案登入。第一次打開會請你登入，帳號請依講師或公司的說明準備。', r => { only(r, r.c3); show(r.acct) }],
  ['安裝好之後，右下角的狀態列會出現「✻ Claude Code」。', r => { hide(r.acct); to(r, r.S[3]); zoom(r.S[3], 'status', { pad: 120, max: 2 }); only(r, r.d1) }],
])

scene('打開 Claude Code，貼上起手 prompt', () => {
  const r = {}; mhead('step3 ④', '打開 Claude Code，貼上起手 prompt')
  const [a, b, c] = vsh(r, ['cc00-statusbar', 'cc01-empty', 'cc02-prompt-pasted'])
  r.a1 = hl(r, a, 'status', '✻ Claude Code', { col: C.coral, above: true, right: true, size: 30, pad: 6 })
  r.b1 = hl(r, b, [350, 470, 684, 84], '輸入框：在這裡跟 AI 說話', { above: true, size: 30 })
  r.b2 = hl(r, b, 'mode', 'Auto：權限模式，先用預設', { below: true, right: true, size: 26, pad: 4 })
  r.bw = bwin(['br07-handbook-startprompt'], 'HANDBOOK.html#step3'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], 'pre', '整段選起來，按 Ctrl+C', { col: OR, size: 30, below: true })
  r.c1 = hl(r, c, 'input', '按 Ctrl+V 貼上', { above: true, size: 30 })
  r.c2 = hl(r, c, 'send', '送出', { col: C.coral, below: true, right: true, size: 30, pad: 6 })
  r.four = tip('prompt 點名的四份＝三份規矩（CLAUDE.md、CODE-RULES、使用說明）＋ PRD', { y: 806, size: 26, col: C.teal })
  r.any = tip('你們單位如果用別的 AI 工具，做法也一樣：貼 prompt、回答選擇題', { y: 806, size: 28, col: C.teal })
  cursor(r)
  return r
}, [
  ['打開 Claude Code：點右下角狀態列的「✻ Claude Code」。', r => { show(r.S[0]); only(r, r.a1); clickAt(r, r.S[0], 'status') }],
  ['會開出一個對話分頁。下面的輸入框，就是跟 AI 說話的地方。', r => { to(r, r.S[1]); hide(r.cur); only(r, r.b1) }],
  ['右下的 Auto 是權限模式：大部分動作它會自己判斷能不能直接做。先用預設，不要動。', r => only(r, r.b2)],
  ['到手冊 step3 的「② 貼起手 prompt」，把整段選起來，按 Ctrl+C。', r => { hide(r.S[1]); only(r); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.h1)) }],
  ['回到 VS Code，點一下輸入框，按 Ctrl+V 貼上。', r => { hide(r.bw.g); only(r); show(r.S[2]); later(300, () => only(r, r.c1)) }],
  ['這段 prompt 會先叫 AI 讀四份文件：三份規矩加上 PRD。讀完先用選擇題問你三個決定，最後才開工。', r => { zoom(r.S[2], 'input', { pad: 30, max: 1.5 }); only(r, r.c1); show(r.four) }],
  ['確認沒問題，按右下角的送出鈕。', r => { hide(r.four); unzoom(r.S[2]); only(r, r.c2); clickAt(r, r.S[2], 'send') }],
  ['你們單位如果用別的 AI 工具，做法也一樣：貼 prompt、回答選擇題。', r => { hide(r.cur); only(r); show(r.any) }],
])

scene('AI 先出選擇題，你拍板', () => {
  const r = {}; mhead('step3 ⑤', 'AI 不先寫程式，先出選擇題問你')
  const [a, b, c, d] = vsh(r, ['cc03-reading', 'cc04-question', 'cc05-d2', 'cc06-d3'])
  r.a1 = hl(r, a, [360, 285, 612, 92], '好幾行 Read：AI 在讀檔', { below: true, size: 30 })
  r.a2 = hl(r, a, [1001, 521, 26, 26], '要叫它停：按這個方塊', { col: C.coral, above: true, right: true, size: 26, pad: 6 })
  r.b1 = hl(r, b, [355, 222, 172, 28], '三題：D1・D2・D3', { below: true, size: 28 })
  r.b2 = hl(r, b, [358, 292, 652, 64], 'D1：補上刪除（建議）', { col: C.green, below: true, size: 28 })
  r.c1 = hl(r, c, [358, 326, 666, 62], 'D2：做 CSV 匯出（建議）', { col: C.green, below: true, size: 28 })
  r.d1 = hl(r, d, [358, 316, 652, 62], 'D3：選「簡化」那一個', { col: C.green, below: true, size: 28 })
  r.d2 = hl(r, d, [358, 482, 668, 32], 'Submit answers：送出', { col: C.coral, above: true, size: 28 })
  r.diff = tip('照手冊的課堂拍板選：D1 補刪除、D2 做匯出、D3 簡化版。不要只認「建議」', { y: 806, size: 28, col: C.teal })
  r.you = tip('三題不用背。重點是：做取捨的人是你，不是 AI', { y: 806, size: 32 })
  r.rescue = codeCard(70, 600, 1460, ['停，先不要寫程式、不要建任何檔案。', '請先針對 PRD 第 5 節的三個待決策點，用選擇題逐題問我（每題 2-4 個選項＋你的建議）。', '我拍板後你再列任務清單，等我確認才開工。'], { title: 'AI 沒問就寫程式：先按停止方塊，再貼手冊的救援 prompt', size: 26, col: C.coral })
  cursor(r)
  return r
}, [
  ['AI 先讀規矩和 PRD。看到好幾行 Read 開頭，就是它在讀檔。', r => { show(r.S[0]); zoom(r.S[0], [360, 285, 612, 92], { pad: 30, max: 1.6 }); later(500, () => only(r, r.a1)) }],
  ['AI 在跑的時候，輸入框右邊會變成一個方塊。要叫它停，就按這個方塊。', r => { unzoom(r.S[0]); only(r, r.a2) }],
  ['讀完，它不寫程式，先出選擇題。三題放在三個分頁：D1 刪除、D2 匯出、D3 編碼。', r => { to(r, r.S[1]); zoom(r.S[1], [340, 210, 700, 330], { pad: 10, max: 1.5 }); only(r, r.b1) }],
  ['每題都標了「建議」，還附一句理由。D1 刪除：課堂上選「補上刪除」。選好，會自動跳到下一題。', r => { only(r, r.b2); clickAt(r, r.S[1], [358, 292, 652, 64], { fx: 0.05 }) }],
  ['D2 匯出：選「做 CSV 匯出」。', r => { unzoom(r.S[1]); to(r, r.S[2]); zoom(r.S[2], [340, 250, 700, 300], { pad: 10, max: 1.5 }); only(r, r.c1); clickAt(r, r.S[2], [358, 326, 666, 62], { fx: 0.05 }) }],
  ['D3 編碼：選「簡化」版，就是不加機關前綴、同一個編碼不累加數量。三題都選好，按「Submit answers」送出。', r => { unzoom(r.S[2]); to(r, r.S[3]); only(r, r.d1, r.d2); later(1500, () => clickAt(r, r.S[3], [358, 482, 668, 32], { fx: 0.2 })) }],
  ['你的畫面文字可能不一樣，AI 的「建議」也可能不同。照手冊的課堂拍板選：補刪除、做匯出、簡化版編碼。', r => { hide(r.cur); only(r); show(r.diff) }],
  ['三題不用背。重點是：在真實系統和課堂之間做取捨的人，是你，不是 AI。', r => { hide(r.diff); show(r.you) }],
  ['如果 AI 沒問就直接寫程式，先按停止方塊，再貼手冊的救援 prompt，叫它先問你。', r => { hide(r.you); show(r.rescue) }],
])
// ── 場景檔第四部分：Step 3（開工～驗收；驗收畫面是這次 Claude Code 實際做出來的 my-equipment-app）──
scene('確認任務清單，說「開工」', () => {
  const r = {}; mhead('step3 ⑥', '確認任務清單，再說「開工」')
  const [a, b, c, d] = vsh(r, ['cc09a-tasklist', 'cc09b-start-question', 'cc11-progress', 'cc12-done'])
  r.a1 = hl(r, a, [365, 330, 668, 230], '8 個任務，每個都寫了怎麼驗收', { above: true, size: 30, lx: 470 })
  r.b1 = hl(r, b, [358, 343, 666, 50], '開工（建議）', { col: C.green, below: true, size: 30 })
  r.b2 = hl(r, b, 'submit', 'Submit answers', { col: C.coral, above: true, size: 28 })
  r.doc = tip('清單每次會有點不同；手冊要的 SRS、SDD 兩份文件沒列進去，就補一句請它加上', { y: 806, size: 26, col: C.teal })
  r.c1 = hl(r, c, [330, 150, 720, 330], 'AI 一個一個做，自己寫小程式檢查', { above: true, size: 30, lx: 420 })
  r.d1 = hl(r, d, [360, 345, 672, 88], '總結：8 個任務完成', { col: C.green, above: true, size: 30, lx: 420 })
  r.d2 = hl(r, d, [360, 366, 672, 42], '側邊選單沒改：直接打網址', { col: C.gold, below: true, size: 26 })
  r.time = box(L, 1080, 64, 400, 46, '這次實拍：約 29 分鐘', { size: 24, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.nav = tip('它也提醒：側邊選單沒加裝備物資，要直接打網址 localhost:3100/equipment/crud', { y: 806, size: 26, col: C.teal })
  return r
}, [
  ['三題拍板之後，AI 列出 8 個任務，每個都寫了怎麼驗收。', r => { show(r.S[0]); later(500, () => only(r, r.a1)) }],
  ['最後它問：可以開工嗎？清單順序合理，就點「開工」，再按「Submit answers」。', r => { to(r, r.S[1]); only(r, r.b1, r.b2) }],
  ['清單每次會有點不同。手冊要的 SRS、SDD 兩份文件，如果沒列進去，就補一句請它加上。', r => { only(r); show(r.doc) }],
  ['接著 AI 一個一個任務做，自己寫小程式檢查，每做完一個回報一行。這次實拍花了大約 29 分鐘。', r => { hide(r.doc); to(r, r.S[2]); only(r, r.c1); show(r.time) }],
  ['做完它會交一份總結。這次它說：8 個任務都完成，自動檢查 76 項過了 75 項，沒過的那一項是它的檢查程式誤判。', r => { to(r, r.S[3]); only(r, r.d1) }],
  ['它還提醒：側邊選單沒有加上裝備物資，要直接打網址進去。', r => { only(r, r.d2); show(r.nav) }],
])

scene('驗收：列表、連動下拉、編碼', () => {
  const r = {}; mhead('step3 ⑦', '驗收：打開 /equipment/crud，對照 PRD')
  r.bw = bwin(['ea01-list', 'ea03-cat-open', 'ea04-item-open', 'ea05-code'], 'localhost:3100/equipment/crud'); r.B = r.bw.S
  r.src = box(L, 980, 64, 500, 46, '畫面：這次 AI 實際做出來的', { size: 24, fill: '#3a1d2e', stroke: C.pink, color: C.ink, weight: 900 })
  r.a1 = hl(r, r.B[0], 'count', '共 24 筆', { col: OR, size: 30, below: true })
  r.a2 = hl(r, r.B[0], [990, 430, 70, 170], '狀態：綠＝正常、紅＝已報廢', { col: OR, size: 26, below: true, right: true })
  r.a3 = hl(r, r.B[0], [460, 452, 70, 20], '品項編碼', { col: OR, size: 26, below: true, pad: 6 })
  r.b1 = hl(r, r.B[1], 'list', '先選分類', { col: OR, size: 30, right: true })
  r.c1 = hl(r, r.B[2], 'list', '項目只出現這個分類的', { col: OR, size: 30, right: true })
  r.d1 = hl(r, r.B[3], [268, 175, 180, 45], '編碼馬上算出來：IT-006', { col: C.green, size: 30, below: true })
  r.prd = tip('對照 PRD 第 2 節的 12 欄：名稱、必不必填、用什麼元件、怎麼驗證', { y: 806, size: 28, col: C.teal })
  r.diff = tip('你的 AI 做出來會有一點不同，以 PRD 為準', { y: 806, size: 30, col: C.teal })
  r.dev = grp(L); R(r.dev, 160, 250, 1280, 330, { fill: C.card, stroke: C.gold, sw: 4 })
  T(r.dev, 800, 320, '先確認網頁伺服器有在跑', { size: 40, weight: 900, anchor: 'middle', fill: C.gold })
  T(r.dev, 800, 385, '換資料夾時，原本的 pnpm dev 已經關掉了', { size: 30, anchor: 'middle' })
  T(r.dev, 800, 440, '這次 AI 做完已經幫忙開好；瀏覽器打不開的話：', { size: 30, anchor: 'middle' })
  const dc = T(r.dev, 800, 520, '在 my-equipment-app 的終端機輸入 pnpm dev', { size: 34, weight: 800, anchor: 'middle', fill: C.green }); dc.style.fontFamily = MONO
  return r
}, [
  ['驗收前，先確認網頁伺服器有在跑。這次 AI 做完已經幫忙開好；如果瀏覽器打不開，就在 my-equipment-app 的終端機輸入 pnpm dev。', r => { show(r.dev) }],
  ['驗收：在瀏覽器打開 localhost:3100/equipment/crud。這是這次 AI 實際做出來的頁面。', r => { hide(r.dev); show(r.bw.g); show(r.B[0]); show(r.diff) }],
  ['拿 PRD 第 2 節的 12 欄逐項對照：名稱、必不必填、用什麼元件、怎麼驗證。', r => { hide(r.diff); show(r.prd) }],
  ['列表有 24 筆種子資料，每一筆都有品項編碼，狀態用綠色、紅色標出來。', r => { hide(r.prd); zoom(r.B[0], [248, 280, 940, 360], { pad: 10, max: 1.4 }); only(r, r.a1, r.a2, r.a3) }],
  ['新增時，要先選分類。', r => { unzoom(r.B[0]); burl(r.bw, 'localhost:3100/equipment/crud/new', true); swap(r.B, r.B[1]); only(r, r.b1) }],
  ['選好分類，項目才能選，而且只出現這個分類的項目。', r => { swap(r.B, r.B[2]); only(r, r.c1) }],
  ['分類和項目都選好，品項編碼就馬上算出來，這次是 IT-006。', r => { swap(r.B, r.B[3]); zoom(r.B[3], [248, 160, 700, 280], { pad: 10, max: 1.6 }); only(r, r.d1) }],
])

scene('驗收：驗證、刪除、手機＋修正心法', () => {
  const r = {}; mhead('step3 ⑧', '驗收：驗證、刪除、手機，有落差就請 AI 修')
  r.bw = bwin(['ea06-validation', 'ea07-delete'], 'localhost:3100/equipment/crud/new'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], [273, 330, 920, 380], '空表單儲存 → 欄位紅字', { col: C.red, size: 30, above: true })
  r.a2 = hl(r, r.B[0], 'toast', '請修正 5 個欄位', { col: C.red, size: 26, above: true, right: true, pad: 24 })
  r.b1 = hl(r, r.B[1], [748, 369, 88, 40], '刪除品項：按下才會真的刪', { col: C.red, size: 28, below: true, right: true })
  const mF = fitF('ea08-mobile', { x: 1000, y: 140, w: 470, h: 730 })
  r.mob = grp(L); R(r.mob, mF.x - 16, mF.y - 16, mF.w + 32, mF.h + 32, { fill: '#0b0f14', stroke: '#5b6670', sw: 4, rx: 34 }); show(scrIn('ea08-mobile', mF, r.mob))
  r.mobT = box(L, 120, 300, 820, 200, '縮到手機寬度\n表格變成卡片', { size: 44, fill: C.card, stroke: C.teal, color: C.ink, weight: 800 })
  r.rules = [['一次只修一件事', '一則訊息只提一個問題', C.teal], ['講清楚「看到什麼 vs 期望什麼」', '例：看到 2026/7/1，期望 2026-07-01', C.gold], ['修兩次不好，就換個說法', '別在同一串一直盧', C.coral]].map(([h, s, col], i) => card(120, 150 + i * 220, 1360, 190, h, [s], col, { size: 32, ts: 40, lh: 52 }))
  return r
}, [
  ['什麼都不填，直接按儲存。必填欄位要出現紅字，右下角提示「請修正 5 個欄位」。', r => { show(r.bw.g); show(r.B[0]); only(r, r.a1, r.a2) }],
  ['按垃圾桶，要先跳出確認視窗。這次 AI 把按鈕寫成「刪除品項」，按下才會真的刪。', r => { burl(r.bw, 'localhost:3100/equipment/crud'); swap(r.B, r.B[1]); zoom(r.B[1], [380, 211, 480, 222], { pad: 60, max: 1.6 }); only(r, r.b1) }],
  ['把視窗縮到手機寬度，表格要變成卡片。', r => { unzoom(r.B[1]); only(r); hide(r.bw.g); show([r.mob, r.mobT]) }],
  ['有落差就請 AI 修。心法一：一次只修一件事。', r => { hide([r.mob, r.mobT]); show(r.rules[0]) }],
  ['心法二：講清楚「看到什麼、期望什麼」。例如：看到 2026/7/1，期望顯示成 2026-07-01。', r => show(r.rules[1])],
  ['心法三：修兩次還不好，就換個說法重講，別在同一串一直盧。', r => show(r.rules[2])],
])
// ── 場景檔第五部分：Step 4（LOOP）、Step 5（總結）──
chapter('Step 4', '讓 AI 自己修到全綠', C.violet)

scene('LOOP 是什麼：自動閱卷機', () => {
  const r = {}; mhead('step4 ①', 'LOOP：讓 AI 自己「改 → 驗 → 再改」')
  const g = grp(L); r.flow = g
  const nodes = [['AI 改程式', 230, C.teal], ['跑 7 條 E2E 測試', 620, C.gold], ['全綠？', 1010, C.green]]
  nodes.forEach(([t, x, col]) => { R(g, x - 160, 190, 320, 110, { fill: C.card, stroke: col, sw: 4 }); T(g, x, 258, t, { size: 34, anchor: 'middle', weight: 900, fill: col }) })
  T(g, 425, 255, '→', { size: 48, anchor: 'middle', fill: C.mut }); T(g, 815, 255, '→', { size: 48, anchor: 'middle', fill: C.mut })
  R(g, 1240, 190, 300, 110, { fill: '#173a2a', stroke: C.green, sw: 4 }); T(g, 1390, 245, '是 → 交報告', { size: 30, anchor: 'middle', weight: 900, fill: C.green }); T(g, 1390, 282, '你來驗收', { size: 26, anchor: 'middle' }); T(g, 1180, 255, '→', { size: 48, anchor: 'middle', fill: C.mut })
  mk('path', { d: 'M1010,300 v70 H230 v-70', fill: 'none', stroke: C.red, 'stroke-width': 5, 'marker-end': 'url(#ah-red)' }, g)
  T(g, 620, 400, '否（有紅燈）：AI 自己判斷原因、修好、再跑', { size: 30, anchor: 'middle', weight: 800, fill: C.red })
  r.exam = box(L, 70, 450, 1460, 110, '比喻：AI 自己寫考卷、交給自動閱卷機、看分數再改，直到 7 題全對', { size: 34, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.e2e = box(L, 70, 580, 1460, 90, '閱卷機＝ 7 條 E2E 測試：程式自己開瀏覽器，照使用者的順序點一遍，再判定對不對', { size: 29, fill: C.card, stroke: C.line, color: C.ink })
  r.rules = [['鐵律一：不准偷改答案卷', '不准改測試、不准放寬標準', C.red], ['鐵律二：同一題錯兩次就舉手', '停下來回報，換人判斷', C.coral]].map(([h, s, col], i) => card(70 + i * 740, 690, 720, 180, h, [s], col, { size: 30, ts: 36 }))
  return r
}, [
  ['step4 要讓 AI 自己跑「改程式、跑測試、再改」，這個循環叫 LOOP。', r => { show(r.flow) }],
  ['比喻：AI 自己寫考卷，交給自動閱卷機，看分數再改，直到全對。', r => { show(r.exam); glow(r.exam) }],
  ['閱卷機就是 7 條 E2E 測試：程式自己開一個瀏覽器，照使用者的順序點一遍，再判定對不對。', r => show(r.e2e)],
  ['沒有 LOOP，人要一直手動點、回報哪裡壞；有了 LOOP，人只看最後的結果。', r => glow(r.flow)],
  ['兩條鐵律。第一，不准偷改答案卷：不准改測試，也不准放寬標準。', r => show(r.rules[0])],
  ['第二，同一題錯兩次就舉手：停下來回報，換人判斷，不要無限撞牆。', r => show(r.rules[1])],
])
// ── 場景檔第六部分：Step 4 實拍（LOOP 第 1 輪紅 → 修 → 第 2 輪全綠）、兩項抽查 ──
const RED = s => [[s, TC.err, 700]], GRN = s => [[s, TC.ok, 700]]

scene('貼上 LOOP prompt，等它修到全綠', () => {
  const r = {}; mhead('step4 ②', '貼上 LOOP prompt，讓 AI 自己跑')
  const [a] = vsh(r, ['cc19-root-explorer'])
  r.a1 = hl(r, a, 'tree', '回到教材根目錄', { right: true, size: 30, pad: 2 })
  r.bw = bwin(['br08-handbook-loopprompt'], 'HANDBOOK.html#step4'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], 'pre', '手冊 step4 的 LOOP prompt：整段複製', { col: OR, size: 28, below: true })
  const [, b, c, d] = ['x', 'cc20-loop-pasted', 'cc23-loop-red', 'cc25-loop-report'].map((n, i) => { if (!i) return null; const g = scr(n, FV); r.S.push(g); return g })
  r.b1 = hl(r, b, 'input', '新對話：貼上、送出', { above: true, size: 30 })
  r.c1 = hl(r, c, [355, 385, 680, 80], 'AI 自己跑第一輪測試', { above: true, size: 30 })
  r.d1 = hl(r, d, [340, 215, 700, 265], '自己判斷原因、改 1 個檔', { col: C.gold, above: true, size: 30 })
  r.t = term({ y: 128, h: 600, size: 22, title: '測試結果（AI 跑的，實拍文字）', note: '第 1 輪' })
  r.hands = tip('之後你不用插手：AI 會自己確認網頁有在跑，再跑測試', { y: 806, size: 28, col: C.teal })
  return r
}, [
  ['LOOP 要在教材根目錄做。用「檔案」→「開啟資料夾」，回到 AI_CRUD_Workshop_Frontend_EASY。', r => { show(r.S[0]); later(500, () => only(r, r.a1)) }],
  ['開一個新的 Claude Code 對話，把手冊 step4 的 LOOP prompt 整段複製過來。', r => { hide(r.S[0]); only(r); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.h1)) }],
  ['貼上，送出。', r => { hide(r.bw.g); only(r); show(r.S[1]); later(300, () => only(r, r.b1)) }],
  ['之後你不用插手。AI 會自己確認網頁有在跑，再跑測試。', r => { to(r, r.S[2]); only(r, r.c1); show(r.hands) }],
  ['這次第一輪：5 條綠、2 條紅，紅的是 E3 和 E4。', r => { hide([r.S[2], r.hands]); only(r); show(r.t.g)
    r.t.out(['Running 7 tests using 1 worker', '…', RED('  2 failed'), RED('    E3 新增品項：連動下拉、編碼即時產生且不重複、儲存後筆數 +1'), RED('    E4 表單驗證：五個必填逐欄驗錯 ＋ 狀態進不了空值，錯誤不離頁'), GRN('  5 passed (17.0s)'), '', RED('E2E FAIL：測試程序 exit code = 1。')], { gap: 350 }) }],
  ['AI 自己判斷原因：表單少了唯讀的「品項編碼」欄位，數量的預設值應該是 0。它改了 1 個檔。', r => { hide(r.t.g); show(r.S[3]); later(400, () => only(r, r.d1)) }],
])

scene('第二輪全綠：看懂報告', () => {
  const r = {}; mhead('step4 ③', '第二輪 7 條全綠，報告要看三件事')
  r.t = term({ y: 128, h: 600, size: 21, title: '測試結果（AI 跑的，實拍文字）', note: '第 2 輪' })
  const [a, b, c] = vsh(r, ['cc25b-loop-conclusion', 'cc24-loop-green', 'cc26-loop-rules'])
  r.a1 = hl(r, a, [340, 200, 700, 120], '結論：2 輪、改 1 個檔', { col: C.green, above: true, size: 30 })
  r.b1 = hl(r, b, [360, 420, 680, 46], '規格外調整：PRD 沒寫的改動要標出來', { col: C.gold, above: true, size: 28 })
  r.c1 = hl(r, c, [380, 186, 640, 80], '鐵律檢查：測試沒動、共用件沒拆', { col: C.green, below: true, size: 28 })
  r.you = tip('「數量預設 0」PRD 沒寫，AI 標成規格外調整——要不要補進 PRD，由你決定', { y: 806, size: 26, col: C.gold })
  r.min = box(L, 1080, 64, 400, 46, '這次實拍：約 3 分鐘', { size: 24, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  ['第二輪就 7 條全綠：7 passed。這次從貼上 prompt 到全綠，大約 3 分鐘。', r => { show([r.t.g, r.min])
    const L2 = r.t.out(['Running 7 tests using 1 worker', GRN('  ok 1 › E1 列表載入：種子 24 筆、桌機表格、第一頁恰好 20 列'), GRN('  ok 2 › E2 關鍵字篩選：用編碼與品名都能縮小、不分大小寫'), GRN('  ok 3 › E3 新增品項：連動下拉、編碼即時產生且不重複'), GRN('  ok 4 › E4 表單驗證：五個必填逐欄驗錯'), GRN('  ok 5 › E5 刪除確認：取消不變、確認後 -1'), GRN('  ok 6 › E6 範本不回歸：人員範本列表可用'), GRN('  ok 7 › E7 編輯品項：改數量與存放地點，儲存後新值生效'), '', GRN('  7 passed (7.3s)'), GRN('E2E 全綠：7 條 passed / 0 條 failed / 0 條 skipped。')], { gap: 260 })
    later(3200, () => { const m = r.t.mark(L2[9], '全綠', C.green); show(m); glow(m) }) }],
  ['報告第一件：每一輪紅了什麼、原因是什麼、改了哪個檔。', r => { hide([r.t.g, r.min]); show(r.S[0]); later(400, () => only(r, r.a1)) }],
  ['第二件：找不到 PRD 出處的改動，要標成「規格外調整」。這次的「數量預設 0」就是。', r => { to(r, r.S[1]); only(r, r.b1) }],
  ['這種地方要你裁決：要不要把它補進 PRD，由你決定，不是 AI。', r => show(r.you)],
  ['第三件：鐵律檢查。測試沒被動過、共用零件沒被拆掉、沒有同一題修兩次。', r => { hide(r.you); to(r, r.S[2]); only(r, r.c1) }],
])

scene('驗收報告：兩項抽查', () => {
  const r = {}; mhead('step4 ④', '別只看報告：自己做兩項抽查')
  r.t = term({ y: 128, h: 640, size: 25, note: '放大給你看（實拍文字）' })
  const [a, b] = vsh(r, ['vs31-git-diff', 'vs32-select-string'])
  r.a1 = hl(r, a, 'cmd', 'git diff e2e/', { below: true, size: 28 })
  r.a2 = hl(r, a, 'prompt', '什麼都沒印：初步沒問題', { col: C.green, below: true, size: 28 })
  r.b1 = hl(r, b, 'hit', '193 行：載入共用零件', { col: C.green, below: true, size: 28 })
  r.zip = grp(L); R(r.zip, 80, 776, 1440, 110, { fill: C.card, stroke: C.teal, sw: 3, rx: 14 })
  T(r.zip, 110, 818, 'git diff 只看得到「還沒交給 git」的修改；AI 下過 git add 或 git commit 就看不出來', { size: 26, weight: 800, fill: C.teal })
  T(r.zip, 110, 862, '要百分之百確定：用 Get-FileHash 跟講師發的雜湊比對（zip 副本也用這招）', { size: 26, weight: 800, fill: C.ink })
  r.ln = tip('行號是這次實拍的位置，你的會不一樣；重點是找不找得到', { y: 790, size: 28, col: C.teal })
  r.why = tip('報告是 AI 寫的；燈亮不等於做對，抽查要你自己來', { y: 790, size: 30 })
  return r
}, [
  ['拿到報告，自己再做兩項抽查。報告是 AI 寫的，燈亮不等於做對。', r => { show([r.t.g, r.why]); r.t.prompt() }],
  ['第一，在 step4_loop_e2e 資料夾跑 git diff e2e/。', r => { hide(r.why); r.t.clear(); r.t.cmd('cd step4_loop_e2e'); later(1800, () => r.t.cmd('git diff e2e/', { path: LAB + '\\step4_loop_e2e' })) }],
  ['什麼都沒印出來，直接回到提示字元，是初步沒問題。git diff 只看得到還沒交給 git 的修改；要百分之百確定，就跟講師發的雜湊比對。', r => { show(r.zip); const p2 = r.t.prompt(LAB + '\\step4_loop_e2e'); later(500, () => { const m = r.t.mark(p2, '沒有輸出：初步沒問題', C.green); show(m) }) }],
  ['第二，到 my-equipment-app，用 Select-String 搜尋 useTemplateListPage。', r => { hide(r.zip); r.t.clear(); r.t.cmd('cd ..\\step3_new_module\\my-equipment-app', { path: LAB + '\\step4_loop_e2e' }); later(2600, () => r.t.cmd('Select-String -Path pages\\equipment\\crud\\index.vue -Pattern "useTemplateListPage"', { path: MYAPP, cps: 30 })) }],
  ['找得到是好現象：193 行載入共用零件，214 行呼叫它。如果一行都找不到，就請 AI 說明：共用零件是不是被拆掉、自己另寫了一套。', r => { show(r.ln); const L2 = r.t.out(['', 'pages\\equipment\\crud\\index.vue:5:  衍生資料一律 computed（NFR-T-05），列表狀態委由共用的 useTemplateListPage 工廠管理。', 'pages\\equipment\\crud\\index.vue:193:import { useTemplateListPage } from \'~/composables/useTemplateListPage\'', 'pages\\equipment\\crud\\index.vue:204:/** 與 useTemplateListPage 管理的頁碼 query key 一致；排序變更時要一併拿掉，讓頁面回到第 1 頁 */', 'pages\\equipment\\crud\\index.vue:214:const { filters, page, pageSize, resetFilters, buildReturnQuery } = useTemplateListPage({'], { gap: 300 }); later(1500, () => { show(r.t.mark(L2[2], '載入', C.green)); later(900, () => show(r.t.mark(L2[4], '真的呼叫', C.green))) }) }],
  ['這是同一次的真實畫面。', r => { hide([r.t.g, r.ln]); show(r.S[1]); later(500, () => only(r, r.b1)) }],
])
// ── 場景檔第七部分：對抗審查、Step 5 總結 ──
scene('對抗審查：找第二個 AI 挑錯', () => {
  const r = {}; mhead('step4 ⑤', '對抗審查：寫程式的 AI 不審自己')
  r.p1 = card(70, 140, 700, 230, '比喻：自己改自己的考卷', ['分數一定偏高', '要請另一位老師來挑錯'], C.gold, { size: 30, ts: 36 })
  r.p2 = card(830, 140, 700, 230, '做法', ['開第二個 AI（例如 Codex）', '貼手冊的對抗審查 prompt'], C.teal, { size: 30, ts: 36 })
  r.prompt = codeCard(70, 400, 1460, ['你的任務是「盡力推翻」step4_loop_e2e/e2e 這套 E2E 測試，不是誇獎它。專找三種問題：', '假綠（斷言太鬆、選到隱藏節點、等到的是別的元素）、猜的 selector（靠 nth 這種一改版就碎的寫法）、', '測試互相污染（前一條的資料影響後一條）。', '逐條給可被推翻的具體理由，能重現就附步驟；找不到問題也要說明你怎麼確認的。'], { title: '手冊 step4 的對抗審查 prompt', size: 25, col: C.violet })
  r.loop = box(L, 70, 730, 1460, 140, 'App 的問題 → 交回原本的 AI 修 → 再跑 E2E → 再審\n測試本身的問題 → 不叫 AI 改，停下來交給講師裁決', { size: 30, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  ['最後一關：寫程式的 AI，不適合審自己的作業。就像自己改自己的考卷，分數一定偏高。', r => show(r.p1)],
  ['所以開第二個 AI，例如 Codex，貼上手冊的對抗審查 prompt。', r => { show([r.p2, r.prompt]) }],
  ['它會專找三種問題：標準太鬆的假綠、一改版就壞的寫法、還有測試之間互相影響。', r => glow(r.prompt)],
  ['它找出的問題分兩種。App 的問題，交回原本的 AI 修，再跑、再審。測試本身的問題，不要叫 AI 改，停下來交給講師裁決。', r => { show(r.loop); glow(r.loop) }],
])

chapter('Step 5', '總結', C.green)

scene('你的心力花在頭和尾', () => {
  const r = {}; mhead('step5 ①', '你的心力，花在頭和尾')
  const vF = fitF('hb-step5-value', { x: 70, y: 125, w: 1460, h: 600 })
  r.v = scr('hb-step5-value', vF); r.S = [r.v]
  r.steps = [['把四份規矩帶進你的專案', ['改成你們公司的', '色票、命名、禁止事項']], ['把最成熟的頁面整理成範本', ['分出「複製區」', '和「共用區」']], ['新需求照這套流程走', ['PRD → 選擇題', '→ 生成 → LOOP 驗證']]].map(([h, s], i) => card(70 + i * 495, 150, 465, 230, (i + 1) + '. ' + h, s, [C.teal, C.gold, C.coral][i], { size: 32, ts: 30, lh: 50 }))
  r.s6 = tip('課後驗收題：step6_survey，一個人做一個課程回饋問卷，並發布上線', { y: 420, size: 30, col: C.green })
  return r
}, [
  ['最後總結。你的心力，該花在兩端。', r => show(r.v)],
  ['頭，是講清楚要什麼：三個決定由你拍板。尾，是驗收：燈亮不等於做對。', r => glow(r.v)],
  ['中間的複製改名、寫欄位、修到全綠，交給 AI。', r => glow(r.v)],
  ['回公司三步：先把四份規矩帶進你的專案，改成你們公司的規則。', r => { hide(r.v); show(r.steps[0]) }],
  ['再把最成熟的頁面整理成範本；之後的新需求，都照這套流程走。', r => { show(r.steps[1]); later(900, () => show(r.steps[2])) }],
  ['課後驗收題在 step6_survey：一個人做一個課程回饋問卷，並發布上線。', r => show(r.s6)],
])

scene('記住四句話', () => {
  const r = {}; mhead('總結', '記住四句話')
  const L4 = [['範本給骨架', '複製改名就有列表、表單、驗證、匯出', C.teal], ['harness 給規矩', '四份規矩跟著專案走，AI 每次照做', C.gold], ['AI 出勞力', '寫程式、修到全綠，交給它', C.coral], ['最後由你驗收', '燈亮不等於做對', C.green]]
  r.rows = L4.map(([a, b, col], i) => { const g = grp(L); const y = 150 + i * 175; R(g, 70, y, 1460, 150, { fill: C.card, stroke: col, sw: 5 })
    mk('circle', { cx: 150, cy: y + 75, r: 46, fill: col }, g); T(g, 150, y + 92, String(i + 1), { size: 46, anchor: 'middle', weight: 900, fill: C.bg })
    T(g, 230, y + 92, a, { size: 52, weight: 900 }); T(g, 760, y + 90, b, { size: 32, fill: C.mut }); return g })
  return r
}, [
  ['第一，範本給骨架。', r => show(r.rows[0])],
  ['第二，harness 給規矩。', r => show(r.rows[1])],
  ['第三，AI 出勞力。', r => show(r.rows[2])],
  ['第四，最後一定由你驗收。燈亮，不等於做對。', r => { show(r.rows[3]); glow(r.rows[3]) }],
])
