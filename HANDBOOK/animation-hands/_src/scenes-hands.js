// ============================================================
// AI CRUD 工作坊 EASY 版：手把手教學動畫（跟著做版）
// 講稿：tts-audition/script_hands.py → window.__script；配音 → window.__audio（預錄 mp3）
// 跟講課版分工：這一版只講「點哪裡、貼哪一段、看到什麼就對了」。阿哲＝操作示範；小芸＝檢查點與卡住時。
// 畫面沿用 2026-10-04～07 的 Windows 11 實拍（VS Code 繁中＋Claude Code、PowerShell、Chrome）；手冊指令框於 2026-10-07 重拍（hb5-*）。
// ============================================================
const OR = '#ff6a00'
const FV = FR
function vsh(r, names, F = FV) { return shots(r, names, F) }
const REPO = 'D:\\AI_CRUD_Workshop_Frontend_EASY'
const HB = 'HANDBOOK.html'
window.__roles = { '小芸': '檢查點・卡住時', '阿哲': '跟著做' }

// ════════════════════════════ 開場 ════════════════════════════
chapter('開場', '跟著做', C.teal)

sc3(1, () => {
  const r = {}; hd(1, '開場')
  r.c = [['講課版', '講觀念：為什麼這樣做', C.mut], ['手把手版（這一支）', '點哪裡、貼哪一段、看到什麼就對了', C.gold]].map(([h, s, col], i) => card(70 + i * 745, 150, 715, 220, h, [s], col, { size: 32, ts: 42 }))
  r.two = card(70, 400, 1460, 200, '開兩個視窗', ['左：這支動畫　·　右：VS Code', '看完一段 → 暫停 → 自己做一次 → 下一段'], C.teal, { size: 34, ts: 40, lh: 60 })
  r.hb = box(L, 70, 630, 1460, 110, 'prompt 在手冊、指令在動畫下面的速查：反白 → Ctrl+C 複製', { size: 34, fill: '#1c2f4a', stroke: C.violet, color: C.ink, weight: 900 })
  r.chk = tip('每段最後有檢查點：一樣就往下；不一樣，看「卡住時」', { y: 770, size: 32, col: C.green })
  return r
}, [
  r => { stagger(r.c, 500) },
  r => { show(r.two); glow(r.two) },
  r => { show(r.hb); glow(r.hb) },
  r => { show(r.chk); glow(r.chk) },
])

sc3(2, () => {
  const r = {}; hd(2, '開場')
  r.n = flowRow(170, [['Step 0\n準備', C.mut], ['Step 1\n看差別', C.coral], ['Step 2\n玩範本', C.teal], ['Step 3\n做新模組', C.pink], ['Step 4\nLOOP', C.violet], ['Step 5\n收尾', C.green]], { w: 220, gap: 25 })
  r.s01 = card(70, 340, 1460, 110, 'Step 0、1', ['抓教材、跑前置檢查　·　看有規矩、沒規矩的兩個網頁'], C.coral, { size: 30, ts: 32 })
  r.s2 = card(70, 470, 1460, 110, 'Step 2', ['範本跑起來、當使用者玩一輪　·　認識四份規矩（harness）'], C.teal, { size: 30, ts: 32 })
  r.s3 = card(70, 600, 1460, 110, 'Step 3　重頭戲', ['只給 PRD → AI 問選擇題、交文件 → 你說「開工」它才寫程式'], C.pink, { size: 30, ts: 32 })
  r.s4 = card(70, 730, 1460, 110, 'Step 4、5', ['貼一個 prompt：AI 自己測、自己修、另一個 AI 挑錯　·　收尾'], C.violet, { size: 30, ts: 32 })
  return r
}, [
  r => { stagger(r.n.slice(0, 2), 300); later(700, () => show(r.s01)) },
  r => { stagger(r.n.slice(2, 3), 300); later(400, () => show(r.s2)) },
  r => { stagger(r.n.slice(3, 4), 300); later(400, () => { show(r.s3); glow(r.s3) }) },
  r => { stagger(r.n.slice(4), 300); later(600, () => show(r.s4)) },
])

// ════════════════════════════ Step 0 ════════════════════════════
chapter('Step 0', '準備環境', C.gold)

sc3(3, () => {
  const r = {}; hd(3, 'step0')
  const [a, b, c] = vsh(r, ['vs01-empty', 'vs02-menu-terminal', 'vs03-terminal'])
  r.a1 = hl(r, a, 'menuTerm', '① 點「終端機」', { col: C.gold, below: true, size: 30 })
  r.b1 = hl(r, b, 'newTerm', '② 點「新增終端」', { col: C.gold, below: true, size: 30 })
  r.c1 = hl(r, c, 'prompt', '出現 PS 開頭：在等你打指令', { col: C.green, below: true, size: 28 })
  r.c2 = hl(r, c, 'max', '太小就最大化', { col: C.gold, below: true, right: true, size: 26 })
  return r
}, [
  r => { show(r.S[0]); later(500, () => only(r, r.a1)); later(3000, () => { to(r, r.S[1]); only(r, r.b1) }) },
  r => { to(r, r.S[2]); only(r, r.c1) },
  r => { only(r, r.c2) },
])

sc3(4, () => {
  const r = {}; hd(4, 'step0')
  const [a, b, c] = vsh(r, ['vs04-cd-d', 'vs05-clone-typed', 'vs06-clone-done'])
  r.k = cmdCard(120, 650, 1360, ['cd D:\\', 'git clone https://github.com/xian711/AI_CRUD_Workshop_Frontend_EASY.git'], '一行貼一次、按 Enter（沒有 D 槽就用 C:\\）', { size: 28 })
  r.a1 = hl(r, a, 'prompt', '開頭變成 D:\\', { col: C.green, below: true, size: 28 })
  r.b1 = hl(r, b, 'cmd', 'git clone：把教材從 GitHub 抓下來', { col: C.gold, below: true, size: 28 })
  r.c1 = hl(r, c, 'done', 'done：下載完成', { col: C.green, below: true, size: 30 })
  return r
}, [
  r => { show([r.S[0], r.k]); later(500, () => only(r, r.a1)) },
  r => { to(r, r.S[1]); only(r, r.b1) },
  r => { hide(r.k); to(r, r.S[2]); only(r, r.c1) },
])

sc3(5, () => {
  const r = {}; hd(5, 'step0')
  const [a, , c, d] = vsh(r, ['vs07-menu-file', 'vs07-menu-file', 'vs09-trust', 'vs10-explorer'])
  r.a1 = hl(r, a, 'openFolder', '「檔案」→「開啟資料夾」', { col: C.gold, below: true, size: 30 })
  r.dlg = scr('vs08-open-folder-dialog', fitF('vs08-open-folder-dialog', { x: 120, y: 120, w: 1360, h: 640 }))
  r.dlgT = tip('點 AI_CRUD_Workshop_Frontend_EASY → 按「選取資料夾」', { y: 790, size: 30, col: C.gold })
  r.c1 = hl(r, c, 'yes', '教材：選「是，我信任作者」', { col: C.green, below: true, size: 28 })
  r.d1 = hl(r, d, 'tree', 'step0～step6 都在：打開對了', { col: C.green, lx: 380, size: 28 })
  return r
}, [
  r => { show(r.S[0]); later(500, () => only(r, r.a1)) },
  r => { only(r); hide(r.S[0]); show([r.dlg, r.dlgT]) },
  r => { hide([r.dlg, r.dlgT]); to(r, r.S[2]); only(r, r.c1) },
  r => { to(r, r.S[3]); only(r, r.d1) },
])

sc3(6, () => {
  const r = {}; hd(6, 'step0')
  const [a, b] = vsh(r, ['vs11-terminal-root', 'vs13-preflight-pass'])
  r.a1 = hl(r, a, 'prompt', '開頭是教材資料夾：位置對了', { col: C.green, below: true, size: 28 })
  r.k = cmdCard(120, 650, 1360, ['cd step0_course_intro', '.\\preflight.ps1'], '在教材資料夾的終端機', { size: 30 })
  r.b1 = hl(r, b, 'first', 'PASS＝通過', { col: C.green, right: true, size: 26 })
  r.b2 = tip('WARN＝提醒，不擋你；只有 FAIL 一定要處理', { y: 806, size: 30, col: C.gold })
  r.b3 = hl(r, b, 'summary', '「可以開課」：過關', { col: C.green, above: true, size: 30 })
  return r
}, [
  r => { show(r.S[0]); later(500, () => only(r, r.a1)) },
  r => { show(r.k); glow(r.k) },
  r => { hide(r.k); to(r, r.S[1]); only(r, r.b1); show(r.b2) },
  r => { hide(r.b2); only(r, r.b3) },
])

sc3(7, () => {
  const r = {}; hd(7, 'step0 ・ 卡住時')
  r.three = [['1　照修復提示做', '腳本印在 FAIL 下一行'], ['2　關掉終端機重開', '再跑一次 preflight'], ['3　還是紅：貼給 AI', '整段輸出，連 PASS 一起']].map(([h, s], i) => card(70 + i * 495, 140, 465, 200, h, [s], [C.gold, C.teal, C.coral][i], { size: 28, ts: 34 }))
  r.fake = tip('剛裝好的工具，舊視窗抓不到：這是最常見的假紅燈', { y: 380, size: 30, col: C.teal })
  r.bw = bwin(['hb5-step0-help'], HB + '#step0'); r.B = r.bw.S
  r.p1 = hl(r, r.B[0], 'pre', '手冊 Step 0 的求救 prompt：整段複製', { col: OR, below: true, size: 26 })
  r.ep = cmdCard(120, 640, 1360, ['Set-ExecutionPolicy -Scope CurrentUser RemoteSigned'], '出現「已停用指令碼執行」：先打這一行，問你要不要變更就打 Y、Enter，再重跑', { size: 30, col: C.coral })
  return r
}, [
  r => { stagger(r.three, 400) },
  r => { glow(r.three[1]); show(r.fake); glow(r.fake) },
  r => { hide([r.fake, ...r.three]); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.p1)) },
  r => { only(r); hide(r.bw.g); show(r.ep); glow(r.ep) },
])

// ════════════════════════════ Step 1 ════════════════════════════
chapter('Step 1', '看兩個網頁', C.coral)

sc3(8, () => {
  const r = {}; hd(8, 'step1')
  const [a] = vsh(r, ['vs15-start-demo'])
  r.a1 = hl(r, a, 'cmd', 'start：用瀏覽器打開', { col: C.gold, above: true, size: 28 })
  r.k = cmdCard(120, 650, 1360, ['cd ..', 'start step1_why_harness\\demo\\no-harness.html', 'start step1_why_harness\\demo\\with-harness.html'], '一行貼一次、按 Enter（macOS 把 start 換成 open）', { size: 28 })
  const A1 = { x: 40, y: 150, w: 750, h: 470, bar: 56 }, A2 = { x: 810, y: 150, w: 750, h: 470, bar: 56 }
  r.b1 = bwin(['br10-noh'], 'no-harness.html', A1); r.b2 = bwin(['br13-wh'], 'with-harness.html', A2)
  show(r.b1.S[0]); show(r.b2.S[0])
  r.l1 = T(L, 415, 670, '沒給規矩', { size: 40, anchor: 'middle', weight: 900, fill: C.coral }); r.l1.classList.add('hid')
  r.l2 = T(L, 1185, 670, '附了規矩', { size: 40, anchor: 'middle', weight: 900, fill: C.teal }); r.l2.classList.add('hid')
  r.c1 = hl(r, r.b1.S[0], 'add', '主色橘：AI 自己挑的', { col: OR, below: true, size: 26 })
  r.c2 = hl(r, r.b2.S[0], 'add', '品牌紅：規矩指定的', { col: OR, below: true, size: 26 })
  return r
}, [
  r => { show([r.S[0], r.k]); later(500, () => only(r, r.a1)) },
  r => { only(r); hide([r.S[0], r.k]); show([r.b1.g, r.b2.g, r.l1, r.l2]) },
  r => { zoom(r.b1.S[0], 'add', { pad: 90, max: 2.4 }); zoom(r.b2.S[0], 'add', { pad: 90, max: 2.4 }); only(r, r.c1, r.c2) },
])

sc3(9, () => {
  const r = {}; hd(9, 'step1')
  r.bw = bwin(['br10-noh', 'br14-wh-empty-submit', 'br15-wh-phone-blocked'], 'no-harness.html'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'blood', '左：一打開就選好「A」', { col: C.red, below: true, size: 30 })
  r.b1 = hl(r, r.B[1], 'bloodErr', '右：什麼都不填 → 姓名、電話、血型都擋下來', { col: OR, below: true, size: 30, pad: 6 })
  r.b2 = hl(r, r.B[1], 'nameErr', '', { col: OR })
  r.c1 = hl(r, r.B[2], 'phoneErr', '(02) 1234-5678 → 被擋：只收 09 開頭', { col: OR, below: true, size: 28 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); zoom(r.B[0], 'blood', { pad: 160, max: 1.8 }); only(r, r.a1) },
  r => { unzoom(r.B[0]); burl(r.bw, 'with-harness.html'); swap(r.B, r.B[1]); only(r, r.b1, r.b2) },
  r => { swap(r.B, r.B[2]); only(r, r.c1) },
])

sc3(10, () => {
  const r = {}; hd(10, 'step1 ・ 檢查點')
  r.q = box(L, 70, 180, 1460, 220, '差的不是好不好看\n是「這個決定是誰做的」', { size: 54, fill: C.card, stroke: C.gold, color: C.ink, weight: 900 })
  r.two = [['附了規矩', '顏色、驗證都查得到出處', C.teal], ['沒給規矩', '全是 AI 當場自己決定', C.coral]].map(([h, s, col], i) => card(120 + i * 690, 460, 670, 180, h, [s], col, { size: 32, ts: 40 }))
  return r
}, [
  r => { show(r.q); glow(r.q) },
  r => { stagger(r.two, 500) },
])

// ════════════════════════════ Step 2 ════════════════════════════
chapter('Step 2', '玩範本', C.teal)

sc3(11, () => {
  const r = {}; hd(11, 'step2')
  const [a, b, c] = vsh(r, ['vs16-pnpm-install', 'vs17-pnpm-dev', 'vs18-link-hover'])
  r.k = cmdCard(120, 640, 1360, ['cd step2_speedrun_kit/2.1_sample_app/sample-app', 'pnpm install', 'pnpm dev'], '一行貼一次、按 Enter；等 Done 再貼 pnpm dev', { size: 28 })
  r.a1 = hl(r, a, 'done', 'Done：套件裝好了', { col: C.green, above: true, size: 28 })
  r.b1 = hl(r, b, 'local', 'Local 網址：這個終端機要一直開著', { col: C.gold, below: true, size: 28 })
  r.c1 = hl(r, b, 'url', '按住 Ctrl，點 Local 後面的藍色網址', { col: C.green, below: true, size: 28 })
  r.port = tip('3100 被占用也沒關係：它會自己換一個埠，照它印的網址開', { y: 806, size: 28, col: C.teal })
  return r
}, [
  r => { show([r.S[0], r.k]) },
  r => { hide(r.k); only(r, r.a1) },
  r => { to(r, r.S[1]); only(r, r.b1) },
  r => { only(r, r.c1); show(r.port) },
])

sc3(12, () => {
  const r = {}; hd(12, 'step2')
  r.bw = bwin(['br30-list', 'br31-new-empty', 'br33-saved'], 'localhost:3100/template/crud'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'add', '① 點「新增人員」', { col: OR, below: true, right: true, size: 28 })
  r.b1 = hl(r, r.B[1], [150, 120, 1060, 240], '新增表單：label 在上、必填有紅星', { col: OR, below: true, size: 28 })
  r.b2 = hl(r, r.B[1], 'save', '② 紅星每格都填 → 按「儲存」', { col: OR, below: true, right: true, size: 26 })
  r.c1 = hl(r, r.B[2], 'toast', '「已新增人員」', { col: C.green, above: true, right: true, size: 28 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.a1)) },
  r => { burl(r.bw, 'localhost:3100/template/crud/new'); swap(r.B, r.B[1]); only(r, r.b1); later(3500, () => only(r, r.b2)) },
  r => { burl(r.bw, 'localhost:3100/template/crud'); swap(r.B, r.B[2]); only(r, r.c1) },
])

sc3(13, () => {
  const r = {}; hd(13, 'step2')
  r.bw = bwin(['br34-edit', 'br35-validation', 'br37-delete-confirm'], 'localhost:3100/template/crud'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'note', '點鉛筆圖示進編輯 → 改一下備註', { col: OR, above: true, size: 28 })
  r.a2 = hl(r, r.B[0], 'save', '儲存', { col: OR, below: true, right: true, size: 26 })
  r.b1 = hl(r, r.B[1], 'err', '清空姓名 → 紅字，不讓你存', { col: C.red, below: true, size: 28 })
  r.c1 = hl(r, r.B[2], 'ok', '「刪除人員」確認框 → 按紅色「刪除」才刪', { col: C.red, below: true, size: 28 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.a1, r.a2)) },
  r => { swap(r.B, r.B[1]); only(r, r.b1) },
  r => { swap(r.B, r.B[2]); only(r, r.c1) },
])

sc3(14, () => {
  const r = {}; hd(14, 'step2')
  r.bw = bwin(['br40-filter-status', 'br41-newtab', 'br42b-export-all'], 'localhost:3100/template/crud?q=陳&status=在職'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'q', '關鍵字「陳」', { col: OR, below: true, size: 26 })
  r.a2 = hl(r, r.B[0], 'status', '狀態「在職」', { col: OR, below: true, size: 26 })
  r.a3 = hl(r, r.B[0], 'count', '馬上只剩符合的', { col: C.green, below: true, size: 26 })
  r.b1 = hl(r, r.B[1], 'q', '網址貼到新分頁：條件原樣還原', { col: C.green, below: true, size: 26 })
  r.c1 = hl(r, r.B[2], 'toast', '匯出：符合條件的全部，不是只有這頁', { col: C.green, above: true, right: true, size: 24 })
  r.mob = scr('br43-mobile', fitF('br43-mobile', { x: 560, y: 120, w: 480, h: 700 }))
  r.mobT = tip('縮到手機寬度：表格變卡片', { y: 830, size: 28, col: C.teal })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.a1, r.a2)); later(2500, () => only(r, r.a3)) },
  r => { swap(r.B, r.B[1]); only(r, r.b1) },
  r => { burl(r.bw, 'localhost:3100/template/crud'); swap(r.B, r.B[2]); only(r, r.c1) },
  r => { only(r); hide(r.bw.g); show([r.mob, r.mobT]) },
])

sc3(15, () => {
  const r = {}; hd(15, 'step2 ・ 檢查點')
  const items = ['新增', '編輯', '刪除前先確認', '篩選後新分頁還原', '匯出全量']
  r.c = items.map((t, i) => box(L, 70 + i * 296, 160, 276, 140, '☑ ' + t, { size: 30, fill: C.card, stroke: C.green, color: C.ink, weight: 900 }))
  r.dev = card(70, 340, 1460, 170, '網頁打不開', ['多半是 pnpm dev 那個終端機被關了：再進 sample-app 資料夾，重跑 pnpm dev'], C.coral, { size: 30, ts: 36 })
  r.red = card(70, 540, 1460, 170, 'pnpm 噴一大串紅字', ['從你打的指令那行開始整段複製，貼給 AI（手冊 Step 2 有現成 prompt）'], C.coral, { size: 30, ts: 36 })
  return r
}, [
  r => { stagger(r.c, 300, e => { show(e); glow(e) }) },
  r => { show(r.dev); glow(r.dev) },
  r => { show(r.red); glow(r.red) },
])

sc3(16, () => {
  const r = {}; hd(16, 'step2')
  const [a, b, c] = vsh(r, ['vs19-readme-raw', 'vs20-readme-preview', 'vs20b-readme-table'])
  r.a1 = hl(r, a, 'file', '2.1_sample_app/README.md', { col: C.gold, lx: 380, size: 26 })
  r.b1 = hl(r, b, 'h2', '預覽：「8 個核心檔」', { col: C.gold, below: true, size: 28 })
  r.c1 = hl(r, c, 'r1', '跟實體長相有關 → 複製改名', { col: C.teal, below: true, size: 26 })
  r.c2 = hl(r, c, 'r6', '通用機制 → 直接共用', { col: C.gold, below: true, size: 26 })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1)) },
  r => { to(r, r.S[1]); only(r, r.b1) },
  r => { to(r, r.S[2]); only(r, r.c1); later(3000, () => only(r, r.c2)) },
])

sc3(17, () => {
  const r = {}; hd(17, 'step2')
  const [a, b] = vsh(r, ['vs21-harness-files', 'vs22b-claude-md-wide'])
  r.a1 = hl(r, a, 'claude', '這四份 md ＝ 規矩（harness）', { lx: 560, col: C.gold, size: 30 })
  r.a2 = hl(r, a, 'rules', '', { col: C.gold })
  r.a3 = hl(r, a, 'ds', '', { col: C.gold })
  r.a4 = hl(r, a, 'guide', '', { col: C.gold })
  r.who = box(L, 120, 650, 1360, 120, '這四份＝harness：給 AI 讀的規矩\n你不用逐條讀懂，但要知道放在這裡', { size: 32, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 800 })
  r.b1 = hl(r, b, 'editor', '四十幾行：鎖定技術棧、禁止寫死顏色…', { col: C.teal, below: true, size: 26 })
  r.go = tip('Step 3 複製範本時，四份一起帶走：新模組直接繼承同一套規矩', { y: 806, size: 28, col: C.green })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1, r.a2, r.a3, r.a4)) },
  r => { show(r.who); glow(r.who) },
  r => { hide(r.who); to(r, r.S[1]); only(r, r.b1) },
  r => { only(r); to(r, r.S[0]); show(r.go); glow(r.go) },
])

sc3(18, () => {
  const r = {}; hd(18, 'step2')
  const [a, b] = vsh(r, ['vs23-plus', 'vs24-start-ds'])
  r.a1 = hl(r, a, 'plus', '加號：開第二個終端機', { col: C.gold, below: true, right: true, size: 28 })
  r.k = cmdCard(120, 660, 1360, ['start step2_speedrun_kit\\2.2_design_system\\DESIGN_SYSTEM.html'], '第二個終端機（教材根目錄）', { size: 28 })
  r.b1 = hl(r, b, 'cmd', '打開 Design System', { col: C.gold, above: true, size: 26 })
  r.bw = bwin(['br20-design-system'], 'DESIGN_SYSTEM.html'); r.B = r.bw.S
  r.c1 = hl(r, r.B[0], [268, 100, 690, 160], '每個顏色都有名字（token）：只准寫名字，不准寫死', { col: OR, size: 28, below: true })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1)) },
  r => { to(r, r.S[1]); show(r.k); only(r, r.b1) },
  r => { only(r); hide([r.S[1], r.k]); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.c1)) },
])

// ════════════════════════════ Step 3 ════════════════════════════
chapter('Step 3', '做新模組', C.pink)

sc3(19, () => {
  const r = {}; hd(19, 'step3')
  const [a] = vsh(r, ['vs11-terminal-root'])
  r.a1 = hl(r, a, 'prompt', '新的終端機：開頭是教材根目錄', { col: C.green, below: true, size: 28 })
  r.bw = bwin(['hb5-step3-copy'], HB + '#step3'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], 'pre', '手冊「⓪ 準備工作區」：黑底框反白 → Ctrl+C', { col: OR, below: true, size: 26 })
  const [, b, c] = vsh(r, ['vs11-terminal-root', 'vs25-pasted', 'vs26-step3-prep'])
  r.b1 = hl(r, b, 'install', '出現 >> 時再按一次 Enter', { col: C.gold, below: true, size: 28 })
  r.c1 = hl(r, c, 'done', 'Done：複製好、套件裝好', { col: C.green, above: true, size: 28 })
  r.c2 = hl(r, c, 'prompt', '已經在 my-equipment-app 裡', { col: C.green, below: true, right: true, size: 26 })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1)) },
  r => { only(r); hide(r.S[0]); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.h1)) },
  r => { only(r); hide(r.bw.g); show(r.S[1]); later(300, () => only(r, r.b1)) },
  r => { to(r, r.S[2]); only(r, r.c1, r.c2) },
])

sc3(20, () => {
  const r = {}; hd(20, 'step3')
  const [a, b, c, d] = vsh(r, ['vs27-myapp-explorer', 'vs28-prd-top', 'vs29-prd-fields', 'vs30-prd-decisions'])
  r.open = tip('「檔案」→「開啟資料夾」→ my-equipment-app（視窗會重開，終端機會關掉）', { y: 806, size: 28, col: C.gold })
  r.a1 = hl(r, a, 'claude', '四份規矩跟著來了', { lx: 560, col: C.green, size: 26 })
  r.a2 = hl(r, a, 'rules', '', { col: C.green }); r.a3 = hl(r, a, 'ds', '', { col: C.green }); r.a4 = hl(r, a, 'guide', '', { col: C.green })
  r.b1 = hl(r, b, 'h1', 'PRD＝需求說明書（也叫 SPEC）', { col: C.gold, below: true, size: 28 })
  r.c1 = hl(r, c, 'h2', '第 2 節：12 個欄位', { col: C.gold, below: true, size: 28 })
  r.d1 = hl(r, d, 'h2', '第 5 節：三個決定留給你', { col: C.gold, below: true, size: 28 })
  return r
}, [
  r => { show([r.S[0], r.open]) },
  r => { hide(r.open); only(r, r.a1, r.a2, r.a3, r.a4) },
  r => { to(r, r.S[1]); only(r, r.b1) },
  r => { to(r, r.S[2]); only(r, r.c1); later(3500, () => { to(r, r.S[3]); only(r, r.d1) }) },
])

sc3(21, () => {
  const r = {}; hd(21, 'step3')
  const [a, b] = vsh(r, ['cc00-statusbar', 'cc01-empty'])
  r.a1 = hl(r, a, 'status', '右下角「Claude Code」', { col: C.gold, above: true, right: true, size: 28 })
  r.b1 = hl(r, b, 'model', '選 Opus 5.5；effort 拉到 High', { col: C.gold, above: true, size: 28 })
  r.b2 = hl(r, b, [930, 519, 62, 30], '核准模式：Auto', { col: C.green, above: true, right: true, size: 28 })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1)) },
  r => { to(r, r.S[1]); zoom(r.S[1], 'model', { pad: 200, max: 1.5 }); only(r, r.b1) },
  r => { zoom(r.S[1], [930, 519, 62, 30], { pad: 200, max: 1.5 }); only(r, r.b2) },
])

sc3(22, () => {
  const r = {}; hd(22, 'step3')
  r.bw = bwin(['hb5-step3-start'], HB + '#step3'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], 'pre', '手冊「②」起手 prompt：四行，反白複製', { col: OR, below: true, size: 26 })
  const [b, c] = vsh(r, ['cc02-prompt-pasted', 'cc03-reading'])
  r.b1 = hl(r, b, 'input', '貼進輸入框 → 送出', { above: true, size: 28 })
  r.c1 = hl(r, c, [350, 325, 645, 92], '一串讀檔：它在讀規矩和 PRD', { below: true, size: 28 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.h1)) },
  r => { only(r); hide(r.bw.g); show(r.S[0]); later(300, () => only(r, r.b1)) },
  r => { to(r, r.S[1]); zoom(r.S[1], [350, 325, 645, 92], { pad: 30, max: 1.6 }); later(400, () => only(r, r.c1)) },
])

sc3(23, () => {
  const r = {}; hd(23, 'step3')
  const [a, b, c, d] = vsh(r, ['cc05-d2', 'cc06-d3', 'cc09b-q2-serial', 'cc09b-q4-id'])
  r.a1 = hl(r, a, 'rec', '「建議」＋一句理由', { col: C.green, below: true, size: 28 })
  r.pick = tip('課堂拍板：D1 補刪除＋確認彈窗　·　D2 做 CSV 匯出　·　D3 選標「建議」的', { y: 806, size: 28, col: C.teal })
  r.b1 = hl(r, b, 'rec', '點選項就好', { col: C.green, below: true, size: 28 })
  r.c1 = hl(r, c, 'tabs', 'PRD 沒寫清楚的：它多問幾題', { col: C.gold, below: true, size: 26 })
  r.c2 = hl(r, c, 'rec', '看不懂就選「建議」', { col: C.green, below: true, size: 26 })
  r.d1 = hl(r, d, 'submit', '一批答完：Submit answers', { col: OR, above: true, size: 28 })
  return r
}, [
  r => { show(r.S[0]); zoom(r.S[0], 'rec', { pad: 120, max: 1.6 }); later(400, () => only(r, r.a1)) },
  r => { unzoom(r.S[0]); to(r, r.S[1]); only(r, r.b1); show(r.pick) },
  r => { hide(r.pick); to(r, r.S[2]); only(r, r.c1); later(3000, () => only(r, r.c2)) },
  r => { to(r, r.S[3]); only(r, r.d1) },
])

sc3(24, () => {
  const r = {}; hd(24, 'step3 ・ 卡住時')
  r.warn = box(L, 70, 140, 1460, 130, 'AI 沒問選擇題，直接開始建檔案、寫程式？\n不要讓它跑：先按停止', { size: 36, fill: '#3a1f1f', stroke: C.red, color: C.ink, weight: 900 })
  r.bw = bwin(['hb5-step3-rescue'], HB + '#step3'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], 'pre', '救援 prompt：先停，先用選擇題問我', { col: OR, below: true, size: 26 })
  return r
}, [
  r => { show(r.warn); glow(r.warn) },
  r => { hide(r.warn); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.h1)) },
])

sc3(25, () => {
  const r = {}; hd(25, 'step3')
  const [a, b, c, d] = vsh(r, ['cc09a-docs4', 'v4-srs-decisions', 'v4-srs-trace', 'v4-srs-scope'])
  r.a1 = hl(r, a, 'head', '先交 4 個檔：程式一行都還沒寫', { col: C.green, below: true, size: 28 })
  r.b1 = hl(r, b, 'table', '第 1 段：已拍板決策', { col: C.violet, above: true, size: 28 })
  r.b2 = hl(r, b, 'who', '誰拍板', { col: C.gold, below: true, right: true, size: 26 })
  r.c1 = hl(r, c, 'table', '第 2 段：12 欄各做在哪', { col: C.violet, above: true, size: 28 })
  r.d1 = hl(r, d, 'h', '第 3 段：這一版不做什麼', { col: C.violet, below: true, size: 28 })
  r.must = tip('這三段你一定要核', { y: 806, size: 32, col: C.gold })
  r.chrome = tip('問要不要開 Chrome：選 No，跟它說圖你自己看', { y: 806, size: 30, col: C.teal })
  return r
}, [
  r => { show([r.S[0], r.chrome]); later(400, () => only(r, r.a1)) },
  r => { hide(r.chrome); to(r, r.S[1]); only(r, r.b1, r.b2) },
  r => { to(r, r.S[2]); only(r, r.c1); later(3500, () => { to(r, r.S[3]); only(r, r.d1); show(r.must) }) },
])

sc3(26, () => {
  const r = {}; hd(26, 'step3')
  const [a, b] = vsh(r, ['v4-design-files', 'v4-design-evidence'])
  r.a1 = hl(r, a, 'h', '第 1 段：5 個複製改名、3 個直接共用', { col: C.violet, below: true, size: 28 })
  r.a2 = hl(r, a, 'shared', '', { col: C.gold })
  r.b1 = hl(r, b, 'hex', '做完後填：寫死的色碼 0 筆', { col: C.green, right: true, size: 26 })
  r.b2 = hl(r, b, 'log', 'console.log：0 筆', { col: C.green, right: true, below: true, size: 26 })
  r.bw = bwin(['v4-diag-uc', 'v4-diag-files-wide'], 'DIAGRAMS-中心裝備物資.html'); r.B = r.bw.S
  r.d1 = hl(r, r.B[0], 'svg', '① 用例：誰能做哪些事', { col: OR, size: 26, above: true })
  r.d2 = hl(r, r.B[1], 'h', '② 檔案架構：哪些複製改名、哪些共用', { col: OR, size: 26, below: true })
  r.redo = tip('看圖就懂它打算怎麼做；看不懂就叫它重畫，不用讀程式', { y: 806, size: 28, col: C.gold })
  r.dk = cmdCard(120, 660, 1360, ['start DIAGRAMS-中心裝備物資.html'], '在 my-equipment-app 的終端機：用瀏覽器打開圖', { size: 30 })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1, r.a2)) },
  r => { to(r, r.S[1]); only(r, r.b1, r.b2) },
  r => { only(r); hide(r.S); show([r.bw.g, r.dk]); show(r.B[0]); later(300, () => only(r, r.d1)); later(4000, () => { hide(r.dk); swap(r.B, r.B[1]); only(r, r.d2) }) },
  r => { show(r.redo); glow(r.redo) },
])

sc3(27, () => {
  const r = {}; hd(27, 'step3')
  const [a, b, c, d, e] = vsh(r, ['cc09a-tasklist', 'cc09e-model-menu', 'cc09f-go-typed', 'cc11v4-t0300', 'cc12-done'])
  r.a1 = hl(r, a, 'head', '任務清單：順序看過了', { col: C.green, below: true, size: 26 })
  r.b1 = hl(r, b, 'sonnet', '開工前：換 Sonnet 5.5', { col: C.gold, below: true, size: 28 })
  r.c1 = hl(r, c, 'input', '還有題目就先答完 → 打「開工」→ 送出', { col: C.green, above: true, right: true, size: 28 })
  r.d1 = hl(r, d, [350, 230, 680, 200], '一項一項做，每項回報一行', { above: true, size: 28 })
  r.tea = box(L, 1080, 64, 400, 46, '實拍：約 17 分鐘，去倒杯茶', { size: 26, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.e1 = hl(r, e, 'sum', '驗收完，再請它五行總結', { col: C.green, above: true, size: 26 })
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.a1)); later(2500, () => { to(r, r.S[1]); only(r, r.b1) }) },
  r => { to(r, r.S[2]); only(r, r.c1) },
  r => { to(r, r.S[3]); only(r, r.d1); show(r.tea) },
  r => { to(r, r.S[4]); only(r, r.e1) },
])

sc3(28, () => {
  const r = {}; hd(28, 'step3 ・ 驗收')
  r.bw = bwin(['ea01-list', 'ea04-item-open', 'ea05-code', 'ea06-validation', 'ea07-delete'], 'localhost:3101/equipment/crud'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'count', '共 24 筆', { col: C.green, below: true, size: 28 })
  r.a2 = hl(r, r.B[0], 'status', '狀態：綠／黃／紅', { col: C.green, below: true, right: true, size: 26 })
  r.b1 = hl(r, r.B[1], 'list', '先選分類，項目才出現', { col: OR, below: true, size: 26 })
  r.b2 = hl(r, r.B[2], 'title', '標題馬上顯示編碼', { col: OR, below: true, size: 26 })
  r.c1 = hl(r, r.B[3], 'toast', '空表單儲存：紅字＋提示，不跳走', { col: C.red, above: true, right: true, size: 26 })
  r.d1 = hl(r, r.B[4], 'dialog', '刪除要先確認', { col: C.red, below: true, size: 28 })
  r.mob = scr('ea08-mobile', fitF('ea08-mobile', { x: 560, y: 120, w: 480, h: 700 }))
  r.prd = tip('視窗拉窄：表格變卡片　·　最後拿 PRD 第 2 節 12 欄一欄一欄對', { y: 830, size: 28, col: C.gold })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.a1, r.a2)) },
  r => { burl(r.bw, 'localhost:3101/equipment/crud/new'); swap(r.B, r.B[1]); only(r, r.b1); later(3500, () => { swap(r.B, r.B[2]); only(r, r.b2) }) },
  r => { swap(r.B, r.B[3]); only(r, r.c1) },
  r => { burl(r.bw, 'localhost:3101/equipment/crud'); swap(r.B, r.B[4]); only(r, r.d1); later(2500, () => { only(r); hide(r.bw.g); show([r.mob, r.prd]) }) },
])

sc3(29, () => {
  const r = {}; hd(29, 'step3')
  const [a, b, c, d] = vsh(r, ['cc13-fix1-ask', 'cc13-fix1-done', 'cc14-fix2-ask', 'cc14-fix2-done'])
  r.a1 = hl(r, a, 'msg', '看到短橫，期望三欄一致都用長橫', { col: C.gold, above: true, size: 26 })
  r.how = tip('一次講一件：看到什麼 → 期望什麼', { y: 806, size: 32, col: C.teal })
  r.b1 = hl(r, b, 'done', '改好會說改了哪個檔', { col: C.green, below: true, size: 26 })
  r.c1 = hl(r, c, 'msg', '對了再講下一件', { col: C.gold, above: true, size: 26 })
  r.d1 = hl(r, d, 'done', '', { col: C.green })
  r.twice = tip('同一件事講兩次還不好：換個說法重講', { y: 806, size: 30, col: C.coral })
  r.pass = tip('全部沒問題：打「驗收通過」送出', { y: 806, size: 30, col: C.green })
  return r
}, [
  r => { show([r.S[0], r.how]); later(300, () => only(r, r.a1)) },
  r => { hide(r.how); to(r, r.S[1]); only(r, r.b1) },
  r => { to(r, r.S[2]); only(r, r.c1); later(3000, () => { to(r, r.S[3]); only(r, r.d1); show(r.pass) }) },
  r => { hide(r.pass); show(r.twice); glow(r.twice) },
])

sc3(30, () => {
  const r = {}; hd(30, 'step3 ・ 檢查點')
  const items = ['AI 先問、你拍板', '交 4 個檔', '你說「開工」才寫', '網頁五件事', '小修講清楚']
  r.c = items.map((t, i) => box(L, 70 + i * 296, 150, 276, 140, '☑ ' + t, { size: 28, fill: C.card, stroke: C.green, color: C.ink, weight: 900 }))
  r.five = card(70, 320, 1460, 130, '網頁五件事', ['列表　·　連動下拉　·　新增編碼　·　刪除確認　·　手機卡片'], C.teal, { size: 30, ts: 34 })
  r.err = card(70, 480, 1460, 170, '一開頁就 500：useColorMode is not defined', ['不用自己動手，跟 Claude Code 說：網頁 500，請停掉網頁伺服器、刪掉 .nuxt 和 .output 再重開'], C.coral, { size: 28, ts: 32 })
  r.next = box(L, 70, 680, 1460, 110, '小修的來回很花時間 → 下一步：交給 AI 自己跑', { size: 34, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { stagger(r.c, 300, e => { show(e); glow(e) }) },
  r => { show(r.five) },
  r => { show(r.err); glow(r.err) },
  r => { show(r.next); glow(r.next) },
])

// ════════════════════════════ Step 4 ════════════════════════════
chapter('Step 4', 'LOOP＋對抗審查', C.violet)

sc3(31, () => {
  const r = {}; hd(31, 'step4')
  const [a, b] = vsh(r, ['vs10-explorer', 'cc20-loop-pasted'])
  r.a1 = hl(r, a, 'tree', '開回教材根目錄：step0～step6 都看得到', { col: C.gold, lx: 380, size: 28 })
  r.b1 = hl(r, b, 'model', '右上角加號開新對話：Sonnet 5.5、Auto', { col: C.gold, above: true, size: 26 })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1)) },
  r => { to(r, r.S[1]); only(r, r.b1) },
])

sc3(32, () => {
  const r = {}; hd(32, 'step4')
  r.bw = bwin(['hb5-step4-loop'], HB + '#step4'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], 'pre', '手冊 Step 4 的 LOOP prompt：四行', { col: OR, below: true, size: 26 })
  r.l1 = hl(r, r.B[0], [89, 110, 822, 30], '第一行：照 LOOP-規矩.md 做', { col: OR, below: true, size: 26 })
  r.rule = card(120, 200, 1360, 400, 'step4_loop_e2e/LOOP-規矩.md（給 AI 讀）', ['鐵律：修兩次沒好就停、不准改測試', '埠：3100 被占就自己換', '審查：子代理用 Playwright 開瀏覽器截圖', '要交：LOOP-LOG、LOOP-REPORT、測試報告、文件同步'], C.violet, { size: 30, ts: 32, lh: 64 })
  const [b] = vsh(r, ['cc20-loop-pasted'])
  r.b1 = hl(r, b, 'send', '送出：接下來不用插手', { col: C.green, above: true, right: true, size: 28 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.h1)) },
  r => { only(r, r.l1) },
  r => { only(r); hide(r.bw.g); show(r.rule); glow(r.rule) },
  r => { hide(r.rule); show(r.S[0]); later(300, () => only(r, r.b1)) },
])

sc3(33, () => {
  const r = {}; hd(33, 'step4')
  const [a, b] = vsh(r, ['cc21v4-port', 'cc23v4-red'])
  r.a1 = hl(r, a, 'port', '3100 被占 → 自己換 3101，不關別人的程式', { col: C.green, below: true, size: 26 })
  r.b1 = hl(r, b, 'red', '第 1 輪有紅：正常', { col: C.red, below: true, size: 28 })
  r.b2 = hl(r, b, 'why', '先判因，再動手修', { col: C.gold, below: true, size: 28 })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1)) },
  r => { to(r, r.S[1]); only(r, r.b1) },
  r => { only(r, r.b2) },
])

sc3(34, () => {
  const r = {}; hd(34, 'step4')
  const [a, b, c] = vsh(r, ['cc23v4-agent', 'cc23v4-shots', 'cc25v4-fixed'])
  r.a1 = hl(r, a, 'agent', '子代理：AI 再開的分身，專門挑錯（Opus 5.5）', { col: C.gold, below: true, size: 26 })
  r.b1 = hl(r, b, 'pill', 'Playwright 開瀏覽器，一頁一頁截圖', { col: C.teal, below: true, size: 26 })
  r.c1 = hl(r, c, 'fixed', 'App 的問題：修完再跑', { col: C.green, below: true, size: 26 })
  r.c2 = hl(r, c, 'issue', '測試的問題：只列給你', { col: C.gold, above: true, size: 26 })
  r.tea = box(L, 1080, 64, 400, 46, '實拍：從貼上到報告約 24 分鐘', { size: 26, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1)) },
  r => { to(r, r.S[1]); only(r, r.b1) },
  r => { to(r, r.S[2]); only(r, r.c1); later(3000, () => only(r, r.c2)) },
  r => { show(r.tea); glow(r.tea) },
])

sc3(35, () => {
  const r = {}; hd(35, 'step4 ・ 卡住時')
  r.a = card(70, 150, 715, 300, 'E1～E7 有幾條紅', ['正常：這就是 LOOP 的用途', '別插手，讓它自己修'], C.green, { size: 30, ts: 38, lh: 60 })
  r.b = card(815, 150, 715, 300, '腳本根本沒跑起來', ['瀏覽器下載失敗、連不上 App…', '環境問題：開新對話，貼手冊的環境求救 prompt'], C.coral, { size: 30, ts: 38, lh: 60 })
  r.c = box(L, 70, 490, 1460, 150, '它自己停下來：同一個問題修兩次還沒好\n這是規矩，代表該你介入了', { size: 34, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { show(r.a); glow(r.a) },
  r => { show(r.b); glow(r.b) },
  r => { show(r.c); glow(r.c) },
])

sc3(36, () => {
  const r = {}; hd(36, 'step4 ・ 驗收')
  r.bw = bwin(['v4-loop-report-top', 'v4-loop-report-shots', 'v4-loop-report-decide'], 'my-equipment-app/loop/LOOP-REPORT.html'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'sum', '結論在最前面', { col: OR, below: true, size: 28 })
  r.b1 = hl(r, r.B[1], 'shot', '子代理的截圖', { col: OR, above: true, size: 28 })
  r.c1 = hl(r, r.B[2], 'h', '要你裁決的：在同一個對話打「Q1 選 1、Q2 選 1…」', { col: OR, below: true, size: 26 })
  r.k = cmdCard(120, 680, 1360, ['start step3_new_module\\my-equipment-app\\loop\\LOOP-REPORT.html'], '教材根目錄的終端機：用瀏覽器打開報告', { size: 26 })
  return r
}, [
  r => { show([r.bw.g, r.k]); show(r.B[0]); later(300, () => only(r, r.a1)) },
  r => { hide(r.k); swap(r.B, r.B[1]); only(r, r.b1) },
  r => { swap(r.B, r.B[2]); only(r, r.c1) },
])

sc3(37, () => {
  const r = {}; hd(37, 'step4 ・ 驗收')
  r.bw = bwin(['v4-pw-report'], 'step4_loop_e2e/e2e/playwright-report/index.html'); r.B = r.bw.S
  r.p1 = hl(r, r.B[0], 'pass', '7 條都是綠的', { col: C.green, below: true, size: 28 })
  r.k = cmdCard(120, 680, 1360, ['start step4_loop_e2e\\e2e\\playwright-report\\index.html'], '教材根目錄的終端機：用瀏覽器打開測試報告', { size: 26 })
  const [a, b, c] = vsh(r, ['v4-loop-log', 'v4-srs-after', 'cc25v4-conclusion'])
  r.a1 = hl(r, a, 'body', 'LOOP-LOG.md：流水帳，有紅燈時才翻', { col: C.teal, below: true, size: 26 })
  r.b1 = hl(r, b, 'mark', '「step4 LOOP 後」：程式改了，文件跟著改', { col: C.green, below: true, size: 26 })
  r.c1 = hl(r, c, 'url', '照報告的網址，自己再點一遍', { col: C.gold, below: true, size: 28 })
  return r
}, [
  r => { show([r.bw.g, r.k]); show(r.B[0]); later(300, () => only(r, r.p1)) },
  r => { only(r); hide([r.bw.g, r.k]); show(r.S[0]); later(300, () => only(r, r.a1)) },
  r => { to(r, r.S[1]); only(r, r.b1) },
  r => { to(r, r.S[2]); only(r, r.c1) },
])

sc3(38, () => {
  const r = {}; hd(38, 'step4 ・ 檢查點')
  const items = ['7 條全綠（或報告寫清楚停在哪）', '子代理挑過錯', '報告、測試報告、流水紀錄', '文件標「step4 LOOP 後」', '自己點過一遍']
  r.c = items.map((t, i) => box(L, 70, 140 + i * 92, 1460, 78, '☑ ' + t, { size: 30, fill: C.card, stroke: C.green, color: C.ink, weight: 800 }))
  r.iron = [['鐵律 1', '同一問題修兩次沒好就停', C.red], ['鐵律 2', '不准改測試、不准放寬標準', C.red]].map(([h, s, col], i) => card(70 + i * 745, 620, 715, 160, h, [s], col, { size: 30, ts: 36 }))
  return r
}, [
  r => { stagger(r.c.slice(0, 1), 100, e => { show(e); glow(e) }) },
  r => { stagger(r.c.slice(1), 300, e => { show(e); glow(e) }) },
  r => { stagger(r.iron, 500) },
])

// ════════════════════════════ Step 5 ════════════════════════════
chapter('Step 5', '收尾', C.green)

sc3(39, () => {
  const r = {}; hd(39, 'step5')
  r.n = flowRow(170, [['寫一頁\nSPEC', C.teal], ['起手\nprompt', C.gold], ['選擇題\n拍板', C.gold], ['看文件\n和圖', C.violet], ['說\n開工', C.pink], ['LOOP\nprompt', C.violet], ['驗收\n報告', C.green]], { w: 190, gap: 18 })
  r.spec = tip('SPEC＝PRD，可以很簡陋', { y: 330, size: 30, col: C.teal })
  r.tea = box(L, 70, 430, 1460, 140, 'LOOP 跑的時候，你可以去喝茶\n回來看報告、自己點一遍', { size: 38, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.two = [['頭', '講清楚要什麼、拍板', C.gold], ['尾', '驗收', C.green]].map(([h, s, col], i) => card(120 + i * 690, 610, 670, 160, h, [s], col, { size: 32, ts: 40 }))
  return r
}, [
  r => { stagger(r.n.slice(0, 1), 300); later(500, () => show(r.spec)) },
  r => { stagger(r.n.slice(1, 5), 300) },
  r => { stagger(r.n.slice(5), 300); later(600, () => { show(r.tea); glow(r.tea) }) },
  r => { stagger(r.two, 500) },
])

sc3(40, () => {
  const r = {}; hd(40, 'step5')
  r.three = [['1　帶走四份規矩', '改成公司的規則'], ['2　整理範本', '挑最成熟的頁面'], ['3　新需求都走', '同一條路']].map(([h, s], i) => card(70 + i * 495, 140, 465, 200, h, [s], [C.teal, C.gold, C.violet][i], { size: 28, ts: 34 }))
  r.bw = bwin(['hb5-checklist'], HB + '#done'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], 'h', '手冊最下面：完課檢核表，全部打勾', { col: OR, below: true, size: 26 })
  r.be = box(L, 70, 380, 1460, 160, '下一門：後端課\n同一套方法，把裝備物資接上真的資料庫', { size: 36, fill: '#1c2f4a', stroke: C.violet, color: C.ink, weight: 900 })
  return r
}, [
  r => { stagger(r.three, 400) },
  r => { hide(r.three); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.h1)) },
  r => { only(r); hide(r.bw.g); show(r.be); glow(r.be) },
])
