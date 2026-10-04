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
