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
chapter('Step 1', '看差別', C.coral)

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
  r.bw = bwin(['br10-noh', 'br12-noh-added', 'br14-wh-empty-submit', 'br15-wh-phone-blocked', 'br16-wh-landline-ok'], 'no-harness.html'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'blood', '左：一打開就選好「A」', { col: C.red, below: true, size: 30 })
  r.a2 = hl(r, r.B[1], 'phoneCell', '322-1234 忘了區碼：也收進去', { col: C.red, below: true, size: 28 })
  r.b1 = hl(r, r.B[2], 'bloodErr', '右：什麼都不填 → 姓名、電話、血型都擋下來', { col: OR, below: true, size: 30, pad: 6 })
  r.b2 = hl(r, r.B[2], 'nameErr', '', { col: OR })
  r.c1 = hl(r, r.B[3], 'phoneErr', '322-1234 → 擋：市話要加區碼', { col: OR, below: true, size: 28 })
  r.d1 = hl(r, r.B[4], 'row', '(02) 1234-5678 → 收：市話也是電話', { col: C.green, above: true, size: 28 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); zoom(r.B[0], 'blood', { pad: 160, max: 1.8 }); only(r, r.a1); later(4200, () => { unzoom(r.B[0]); swap(r.B, r.B[1]); only(r, r.a2) }) },
  r => { burl(r.bw, 'with-harness.html'); swap(r.B, r.B[2]); only(r, r.b1, r.b2) },
  r => { swap(r.B, r.B[3]); zoom(r.B[3], 'phoneErr', { pad: 140, max: 1.8 }); only(r, r.c1) },
  r => { unzoom(r.B[3]); swap(r.B, r.B[4]); only(r, r.d1) },
])

sc3(10, () => {
  const r = {}; hd(10, 'step1 ・ 規矩寫在哪')
  r.bw = bwin(['br14-wh-empty-submit'], 'with-harness.html'); r.B = r.bw.S
  r.e1 = hl(r, r.B[0], 'bloodErr', '請選擇血型：不是 AI 剛好做對，是規矩寫的', { col: C.gold, below: true, size: 28 })
  r.rule = box(L, 70, 140, 1460, 200, '下拉選單新增時一律空白，顯示「請選擇」\n不准預設帶第一個；規格寫了預設值和理由才可以帶', { size: 36, fill: C.card, stroke: C.gold, color: C.ink, weight: 900 })
  r.where = ['step1 的 PROMPT.md 版本 B【表單互動】', '範本 CLAUDE.md「程式規則」第 11 條', 'CODE-RULES、design-system-summary'].map((t, i) => card(70 + i * 495, 380, 475, 150, ['寫在 ①', '寫在 ②', '寫在 ③'][i], [t], C.teal, { size: 26, ts: 30 }))
  r.md = scr('v5-claude-md-rule11', fitF('v5-claude-md-rule11', { x: 220, y: 130, w: 1160, h: 650 }))
  r.m1 = hl(r, r.md, [380, 100, 690, 92], 'CLAUDE.md 第 11 條：選項欄位不准預設帶第一個', { col: C.gold, below: true, size: 17 })
  r.why = box(L, 70, 590, 1460, 160, '理由：帶了預設值，使用者沒改就送出\n存進去的就是錯的資料，而且當場不會報錯', { size: 34, fill: '#3a1f1f', stroke: C.red, color: C.ink, weight: 900 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); zoom(r.B[0], 'bloodErr', { pad: 150, max: 1.8 }); later(300, () => only(r, r.e1)) },
  r => { only(r); hide(r.bw.g); show(r.rule); glow(r.rule) },
  r => { hide(r.rule); stagger(r.where, 400); later(2600, () => { hide(r.where); show(r.md); zoom(r.md, [380, 100, 690, 92], { pad: 70, max: 1.7 }); later(400, () => only(r, r.m1)) }) },
  r => { only(r); hide(r.md); show(r.why); glow(r.why) },
])

sc3(11, () => {
  const r = {}; hd(11, 'step1 ・ 檢查點')
  r.q = box(L, 70, 180, 1460, 220, '差的不是好不好看\n是「這個決定是誰做的」', { size: 54, fill: C.card, stroke: C.gold, color: C.ink, weight: 900 })
  r.two = [['附了規矩', '顏色、驗證都查得到出處', C.teal], ['沒給規矩', '全是 AI 當場自己決定', C.coral]].map(([h, s, col], i) => card(120 + i * 690, 460, 670, 180, h, [s], col, { size: 32, ts: 40 }))
  return r
}, [
  r => { show(r.q); glow(r.q) },
  r => { stagger(r.two, 500) },
])

// ════════════════════════════ Step 2 ════════════════════════════
chapter('Step 2', '玩範本', C.teal)

sc3(12, () => {
  const r = {}; hd(12, 'step2')
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

sc3(13, () => {
  const r = {}; hd(13, 'step2')
  r.bw = bwin(['br30-list', 'br31-new-empty', 'br31b-new-errors', 'br31c-new-errors-lower', 'br32-new-filled', 'br33-saved'], 'localhost:3100/template/crud'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'add', '① 點「新增人員」', { col: OR, below: true, right: true, size: 28 })
  r.b1 = hl(r, r.B[1], 'gender', '性別：空白「請選擇」', { col: C.gold, below: true, size: 26 })
  r.b2 = hl(r, r.B[1], 'idType', '證件類別也是', { col: C.gold, below: true, size: 26 })
  r.b3 = hl(r, r.B[3], 'status', '只有狀態先帶「在職」：規格寫了理由', { col: C.green, below: true, right: true, size: 24 })
  r.c1 = hl(r, r.B[2], 'genderErr', '沒選就儲存 → 紅字', { col: C.red, below: true, size: 26 })
  r.c2 = hl(r, r.B[2], 'idTypeErr', '', { col: C.red })
  r.c3 = hl(r, r.B[3], 'groupErr', '編組、職務也擋：Step 1 那條規矩', { col: C.red, above: true, size: 26 })
  r.c4 = hl(r, r.B[3], 'positionErr', '', { col: C.red })
  r.d1 = hl(r, r.B[4], 'phone', '電話：手機或市話都可以（例 089-123456）', { col: OR, below: true, size: 24 })
  r.d2 = hl(r, r.B[4], 'save', '② 按「儲存」', { col: OR, below: true, right: true, size: 26 })
  r.e1 = hl(r, r.B[5], 'toast', '「已新增人員」', { col: C.green, above: true, right: true, size: 28 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.a1)) },
  r => { burl(r.bw, 'localhost:3100/template/crud/new'); swap(r.B, r.B[1]); only(r, r.b1, r.b2); later(4500, () => { swap(r.B, r.B[3]); only(r, r.b3) }) },
  r => { swap(r.B, r.B[2]); only(r, r.c1, r.c2); later(3200, () => { swap(r.B, r.B[3]); only(r, r.c3, r.c4) }) },
  r => { swap(r.B, r.B[4]); only(r, r.d1); later(3000, () => only(r, r.d2)); later(5200, () => { burl(r.bw, 'localhost:3100/template/crud'); swap(r.B, r.B[5]); only(r, r.e1) }) },
])

sc3(14, () => {
  const r = {}; hd(14, 'step2')
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

sc3(15, () => {
  const r = {}; hd(15, 'step2')
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

sc3(16, () => {
  const r = {}; hd(16, 'step2 ・ 檢查點')
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

sc3(17, () => {
  const r = {}; hd(17, 'step2')
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

sc3(18, () => {
  const r = {}; hd(18, 'step2')
  const [a, b] = vsh(r, ['vs21-harness-files', 'v5-claude-md-rule11'])
  r.a1 = hl(r, a, 'claude', '這四份 md ＝ 規矩（harness）', { lx: 560, col: C.gold, size: 30 })
  r.a2 = hl(r, a, 'rules', '', { col: C.gold })
  r.a3 = hl(r, a, 'ds', '', { col: C.gold })
  r.a4 = hl(r, a, 'guide', '', { col: C.gold })
  r.who = box(L, 120, 650, 1360, 120, '這四份＝harness：給 AI 讀的規矩\n你不用逐條讀懂，但要知道放在這裡', { size: 32, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 800 })
  r.b1 = hl(r, b, [380, 100, 690, 92], '第 11 條：選項欄位不准預設帶第一個', { col: C.teal, below: true, size: 26 })
  r.go = tip('Step 3 複製範本時，四份一起帶走：新模組直接繼承同一套規矩', { y: 806, size: 28, col: C.green })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1, r.a2, r.a3, r.a4)) },
  r => { show(r.who); glow(r.who) },
  r => { hide(r.who); to(r, r.S[1]); only(r, r.b1) },
  r => { only(r); to(r, r.S[0]); show(r.go); glow(r.go) },
])

sc3(19, () => {
  const r = {}; hd(19, 'step2')
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
// 檔案總管截圖（1400×1010 原始像素）的放置區
const EXA = { x: 270, y: 112, w: 1060, h: 770 }
function exs(r, names) { r.S = names.map(n => scr(n, fitF(n, EXA))); return r.S }

sc3(20, () => {
  const r = {}; hd(20, 'step3 ・ 用檔案總管複製範本')
  const [m] = vsh(r, ['v5-vs-reveal-menu'])
  r.m1 = hl(r, m, 'row', '① 對 sample-app 按右鍵', { col: C.gold, lx: 560, size: 26 })
  r.m2 = hl(r, m, 'reveal', '②「在檔案總管中顯示」', { col: OR, right: true, size: 28 })
  r.E = ['v5-ex1-reveal', 'v5-ex2-all', 'v5-ex3-deselect'].map(n => scr(n, fitF(n, EXA)))
  r.e1 = hl(r, r.E[0], 'item', 'sample-app 已選好：按兩下進去', { col: C.gold, below: true, size: 26 })
  r.e2 = hl(r, r.E[1], [545, 335, 810, 560], 'Ctrl+A 全選', { col: C.teal, above: true, size: 28 })
  r.e3 = hl(r, r.E[2], 'nm', '按住 Ctrl 點掉：node_modules', { col: C.red, below: true, size: 26 })
  r.e4 = hl(r, r.E[2], 'nuxt', '.nuxt（有 .output 也點掉）', { col: C.red, above: true, size: 26 })
  r.e5 = hl(r, r.E[2], [30, 950, 360, 44], '剩下的 Ctrl+C 複製', { col: C.green, above: true, size: 28 })
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.m1)); later(2600, () => only(r, r.m2)) },
  r => { only(r); hide(r.S[0]); show(r.E[0]); later(300, () => only(r, r.e1)); later(3800, () => { to({ S: r.E }, r.E[1]); only(r, r.e2) }) },
  r => { to({ S: r.E }, r.E[2]); only(r, r.e3, r.e4) },
  r => { only(r, r.e5) },
])

sc3(21, () => {
  const r = {}; hd(21, 'step3 ・ 用檔案總管複製範本')
  r.E = ['v5-ex3-deselect', 'v5-ex4-newfolder', 'v5-ex5-pasted', 'v5-ex6-three', 'v5-ex7-done'].map(n => scr(n, fitF(n, EXA)))
  r.a1 = hl(r, r.E[0], [232, 100, 52, 54], '↑ 按三次：回到教材資料夾', { col: OR, below: true, size: 28 })
  r.b1 = hl(r, r.E[1], 'item', 'Ctrl+Shift+N 新增資料夾：my-equipment-app', { col: OR, below: true, size: 26 })
  r.c1 = hl(r, r.E[2], [545, 335, 810, 560], '點進去 Ctrl+V 貼上', { col: C.green, above: true, size: 28 })
  r.d1 = hl(r, r.E[3], 'prd', '按住 Ctrl 選三份：PRD', { col: C.gold, below: true, size: 24 })
  r.d2 = hl(r, r.E[3], 'tech', '技術約定', { col: C.gold, right: true, size: 24 })
  r.d3 = hl(r, r.E[3], 'tpl', '最小樣板', { col: C.gold, right: true, size: 24 })
  r.e1 = hl(r, r.E[4], 'prd', '貼進 my-equipment-app：三份都在', { col: C.green, above: true, size: 26 })
  r.k = tip('會用終端機的：手冊 Step 3 ⓪ 有一段指令可以貼，效果一樣', { y: 806, size: 28, col: C.teal })
  return r
}, [
  r => { show(r.E[0]); later(300, () => only(r, r.a1)) },
  r => { to({ S: r.E }, r.E[1]); only(r, r.b1); later(3600, () => { to({ S: r.E }, r.E[2]); only(r, r.c1) }) },
  r => { to({ S: r.E }, r.E[3]); only(r, r.d1, r.d2, r.d3); later(4200, () => { to({ S: r.E }, r.E[4]); only(r, r.e1) }) },
  r => { only(r); show(r.k); glow(r.k) },
])

sc3(22, () => {
  const r = {}; hd(22, 'step3')
  const [a, b, c] = vsh(r, ['v5-vs-myapp-explorer', 'v5-vs-install-typed', 'v5-vs-install-done'])
  r.open = tip('「檔案」→「開啟資料夾」→ step3_new_module\\my-equipment-app（視窗會重開）', { y: 806, size: 28, col: C.gold })
  r.a1 = hl(r, a, 'claude', '四份規矩', { lx: 560, col: C.green, size: 26 })
  r.a2 = hl(r, a, 'tech', '帶進來的文件', { lx: 560, col: C.gold, size: 26 })
  r.b1 = hl(r, b, [330, 300, 700, 260], '開終端機：pnpm install', { col: C.gold, above: true, size: 28 })
  r.c1 = hl(r, c, 'done', 'Done：套件裝好了', { col: C.green, above: true, size: 28 })
  return r
}, [
  r => { show([r.S[0], r.open]) },
  r => { hide(r.open); only(r, r.a1, r.a2) },
  r => { to(r, r.S[1]); only(r, r.b1); later(3000, () => { to(r, r.S[2]); only(r, r.c1) }) },
])

sc3(23, () => {
  const r = {}; hd(23, 'step3 ・ 白話 PRD')
  const [a, b, c, d] = vsh(r, ['v5-prd-who', 'v5-prd-fields', 'v5-prd-needs', 'v5-tech-top'])
  r.a1 = hl(r, a, 'who', '裝備管理員用自己的話寫的', { col: C.gold, below: true, size: 28 })
  r.a2 = hl(r, a, 'li2', '一定有沒寫清楚的地方：AI 會找出來問你', { col: OR, below: true, size: 26 })
  r.b1 = hl(r, b, 'table', '第 3 節：12 項資料', { col: C.violet, above: true, size: 26 })
  r.b2 = hl(r, b, 'code', '品項編碼：只寫「系統自己編」', { col: OR, below: true, size: 26 })
  r.c1 = hl(r, c, 'out', '「每季交清冊」：沒說格式', { col: OR, below: true, size: 26 })
  r.d1 = hl(r, d, 'who', '技術約定：資訊單位給 AI 的，你不用讀', { col: C.teal, below: true, size: 26 })
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.a1)) },
  r => { only(r, r.a2) },
  r => { to(r, r.S[1]); only(r, r.b1); later(2500, () => only(r, r.b2)) },
  r => { to(r, r.S[2]); only(r, r.c1); later(4500, () => { to(r, r.S[3]); only(r, r.d1) }) },
])

sc3(24, () => {
  const r = {}; hd(24, 'step3')
  const [a, b, c] = vsh(r, ['v5-cc00-statusbar', 'v5-cc02-model-menu', 'v5-cc03-prompt-pasted'])
  r.a1 = hl(r, a, 'cc', '右下角「Claude Code」', { col: C.gold, above: true, right: true, size: 28 })
  r.b1 = hl(r, b, 'opus', 'Opus 5.5', { col: C.gold, below: true, size: 28 })
  r.b2 = hl(r, b, [360, 438, 660, 28], 'effort 拉到 High', { col: C.gold, above: true, size: 28 })
  r.c1 = hl(r, c, [930, 519, 62, 30], '核准模式：Auto', { col: C.green, above: true, right: true, size: 28 })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1)) },
  r => { to(r, r.S[1]); only(r, r.b1); later(3000, () => only(r, r.b2)) },
  r => { to(r, r.S[2]); zoom(r.S[2], [930, 519, 62, 30], { pad: 200, max: 1.5 }); only(r, r.c1) },
])

sc3(25, () => {
  const r = {}; hd(25, 'step3')
  r.bw = bwin(['hb5-step3-start'], HB + '#step3'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], 'pre', '手冊「②」起手 prompt：四行，反白複製', { col: OR, below: true, size: 26 })
  const [b, c] = vsh(r, ['v5-cc03-prompt-pasted', 'v5-cc04-reading'])
  r.b1 = hl(r, b, [353, 432, 679, 38], '第三行：PRD 沒寫清楚的，用選擇題逐題問我', { col: OR, above: true, size: 26 })
  r.b2 = hl(r, b, 'send', '送出', { col: C.green, below: true, right: true, size: 26 })
  r.c1 = hl(r, c, [340, 180, 700, 330], '先讀規矩、PRD、技術約定：不寫程式', { col: C.green, below: true, size: 26 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.h1)) },
  r => { only(r); hide(r.bw.g); show(r.S[0]); later(300, () => only(r, r.b1)) },
  r => { only(r, r.b2); later(1800, () => { to(r, r.S[1]); only(r, r.c1) }) },
])

sc3(26, () => {
  const r = {}; hd(26, 'step3 ・ AI 找缺口出題')
  const [a, b, c, d] = vsh(r, ['v5-cc06-q-first', 'v5-cc07a-q2', 'v5-cc07a-q1-ans', 'v5-cc07a-q4'])
  r.a1 = hl(r, a, [361, 228, 203, 18], '四題：編碼、號碼重用、改分類、刪除', { col: C.gold, below: true, size: 26 })
  r.a2 = hl(r, a, [361, 294, 647, 59], '標「建議」＋一句理由', { col: C.green, below: true, size: 26 })
  r.b1 = hl(r, b, [361, 260, 640, 30], 'PRD 沒寫的：它自己找出來', { col: OR, below: true, size: 26 })
  r.a3 = hl(r, a, [361, 294, 647, 59], '它建議 IT-01-003；我們要 PW-GEN-001', { col: C.red, below: true, size: 26 })
  r.c1 = hl(r, c, 'other', '建議不是你要的：選 Other，自己打', { col: OR, above: true, size: 26 })
  r.d1 = hl(r, d, 'submit', '其他照拍板表；答完按 Submit answers', { col: C.green, above: true, size: 26 })
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.a1)) },
  r => { zoom(r.S[0], [361, 294, 647, 59], { pad: 120, max: 1.6 }); only(r, r.a2); later(3500, () => { unzoom(r.S[0]); to(r, r.S[1]); only(r, r.b1) }) },
  r => { to(r, r.S[0]); only(r, r.a3) },
  r => { to(r, r.S[2]); zoom(r.S[2], 'other', { pad: 120, max: 1.6 }); only(r, r.c1) },
  r => { unzoom(r.S[2]); to(r, r.S[3]); only(r, r.d1) },
])

sc3(27, () => {
  const r = {}; hd(27, 'step3 ・ 它還會問')
  const [a, b, c] = vsh(r, ['v5-cc07b-q2', 'v5-cc07c-q1', 'v5-cc07c-q3'])
  r.a1 = hl(r, a, [361, 316, 606, 18], '狀態要不要先帶「正常」？', { col: OR, below: true, size: 26 })
  r.a2 = hl(r, a, [667, 316, 300, 18], '它引用公司規矩：要帶值必須拍板', { col: C.gold, below: true, right: true, size: 24 })
  r.a3 = hl(r, a, [361, 343, 662, 43], '選：先帶「正常」', { col: C.green, below: true, size: 26 })
  r.b1 = hl(r, b, [361, 264, 211, 17], '保管人電話收哪些格式？', { col: OR, below: true, size: 26 })
  r.b2 = hl(r, b, [361, 433, 647, 28], '選項裡有「拆成手機、市話兩欄」', { col: C.gold, above: true, size: 26 })
  r.b3 = hl(r, b, [361, 290, 647, 43], '選：一欄，手機、市話都收', { col: C.green, below: true, size: 26 })
  r.c1 = hl(r, c, 'rec', '匯出：CSV、篩選後的全部', { col: C.green, below: true, size: 26 })
  r.n = tip('交文件前一共 13 題：都是 PRD 沒寫清楚、它自己找出來的', { y: 806, size: 28, col: C.teal })
  return r
}, [
  r => { show(r.S[0]); zoom(r.S[0], [361, 316, 606, 70], { pad: 80, max: 1.6 }); later(300, () => only(r, r.a1)); later(2800, () => only(r, r.a2)) },
  r => { unzoom(r.S[0]); only(r, r.a3) },
  r => { to(r, r.S[1]); only(r, r.b1); later(2500, () => only(r, r.b2)) },
  r => { only(r, r.b3); later(3500, () => { to(r, r.S[2]); only(r, r.c1); show(r.n) }) },
])

sc3(28, () => {
  const r = {}; hd(28, 'step3 ・ 卡住時')
  r.warn = box(L, 70, 140, 1460, 130, 'AI 沒問選擇題，直接開始建檔案、寫程式？\n不要讓它跑：先按停止', { size: 36, fill: '#3a1f1f', stroke: C.red, color: C.ink, weight: 900 })
  r.bw = bwin(['hb5-step3-rescue'], HB + '#step3'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], 'pre', '救援 prompt：先停，先把 PRD 沒寫清楚的用選擇題問我', { col: OR, below: true, size: 26 })
  return r
}, [
  r => { show(r.warn); glow(r.warn) },
  r => { hide(r.warn); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.h1)) },
])

sc3(29, () => {
  const r = {}; hd(29, 'step3 ・ 先看文件')
  const [a, b, c, d] = vsh(r, ['v5-cc12-docs-q', 'v5-srs-decisions', 'v5-srs-decisions2', 'v5-srs-scope'])
  r.a1 = hl(r, a, [53, 287, 257, 22], '交了 4 個檔：程式一行都還沒寫', { lx: 560, col: C.green, size: 26 })
  r.a2 = hl(r, a, [53, 331, 257, 22], '', { col: C.green }); r.a3 = hl(r, a, [53, 485, 257, 22], '', { col: C.green })
  r.b1 = hl(r, b, 'table', '第 1 段：一題一列', { col: C.violet, above: true, size: 26 })
  r.b2 = hl(r, b, 'why', '理由：你寫的？還是 AI 建議的？', { col: C.gold, below: true, size: 24 })
  r.c1 = hl(r, c, 'q6', '第 6 題：狀態預設「正常」', { col: C.gold, below: true, size: 26 })
  r.d1 = hl(r, d, 'h', '第 2、3 段：做在哪、這一版不做什麼', { col: C.violet, below: true, size: 26 })
  r.must = tip('這三段你一定要核', { y: 806, size: 32, col: C.gold })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1, r.a2, r.a3)) },
  r => { to(r, r.S[1]); only(r, r.b1) },
  r => { only(r, r.b2); later(3200, () => { to(r, r.S[2]); only(r, r.c1) }) },
  r => { to(r, r.S[3]); only(r, r.d1); show(r.must) },
])

sc3(30, () => {
  const r = {}; hd(30, 'step3 ・ 設計文件')
  const [a, b, c] = vsh(r, ['v5-design-files', 'v5-design-defaults', 'v5-design-evidence'])
  r.a1 = hl(r, a, 'copy', '5 個照範本複製改名', { col: C.violet, below: true, size: 26 })
  r.a2 = hl(r, a, 'share', '直接共用', { col: C.gold, above: true, size: 26 })
  r.b1 = hl(r, b, 'table', '只有狀態帶「正常」；分類、項目空白', { col: C.gold, below: true, size: 26 })
  r.c1 = hl(r, c, 'table', '遵守規矩的證據：寫完程式才填', { col: C.green, above: true, size: 26 })
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.a1)); later(3000, () => only(r, r.a2)) },
  r => { to(r, r.S[1]); only(r, r.b1) },
  r => { to(r, r.S[2]); only(r, r.c1) },
])

// 圖的標題截圖很扁（1300×287）：瀏覽器外框照原比例縮放，不要拉長
function bwHead(name, url) { const m = META[name]; const h = Math.round(1360 * m.h / m.w) + 64; return bwin([name], url, { x: 120, y: 200, w: 1360, h, bar: 64 }) }
// 圖：上面一張「標題＋怎麼看」、下面一張圖本身
function diagScene(n, k, url, parts) {
  return () => {
    const r = {}; hd(n, 'step3 ・ 看圖')
    r.bw = bwHead('v5-diagn-' + k + '-head', url); r.B = r.bw.S
    r.svg = scr('v5-diag-' + k + '-svg', fitF('v5-diag-' + k + '-svg', { x: 70, y: 116, w: 1460, h: 680 }))
    r.H = []
    for (const [key, box_, label, o] of parts) r[key] = hl(r, r.svg, box_, label, o)
    return r
  }
}
sc3(31, diagScene(31, 1, 'DIAGRAMS-中心裝備物資.html#uc', [
  ['p1', [8, 448, 184, 184], '管理人員', { col: C.gold, right: true, size: 26 }],
  ['p2', [296, 40, 412, 1036], '8 件事', { col: OR, right: true, size: 28 }],
  ['p3', [864, 182, 368, 586], '灰框：系統順便做的', { col: C.teal, below: true, size: 26 }],
]), [
  r => { show(r.bw.g); show(r.B[0]) },
  r => { hide(r.bw.g); show(r.svg); later(300, () => only(r, r.p1)) },
  r => { only(r, r.p2) },
  r => { only(r, r.p3) },
])

sc3(32, diagScene(32, 2, 'DIAGRAMS-中心裝備物資.html#arch', [
  ['p1', [474, 5, 1104, 134], '上排：兩個畫面', { col: C.gold, below: true, size: 26 }],
  ['p2', [751, 213, 1094, 128], '橘色 5 個：照範本複製改名', { col: OR, below: true, right: true, size: 26 }],
  ['p3', [245, 213, 474, 128], '綠色 3 個：直接共用，一行都不改', { col: C.green, below: true, size: 26 }],
  ['p4', [5, 458, 1546, 219], '藍框：專案原本的共用零件', { col: C.teal, above: true, size: 26 }],
]), [
  r => { show(r.bw.g); show(r.B[0]); later(2500, () => { hide(r.bw.g); show(r.svg); only(r, r.p1) }) },
  r => { only(r, r.p2, r.p3) },
  r => { only(r, r.p4) },
  r => { only(r) },
])

sc3(33, diagScene(33, 3, 'DIAGRAMS-中心裝備物資.html#class', [
  ['p1', [339, 337, 682, 614], '一筆裝備：12 項資料', { col: OR, right: true, size: 26 }],
  ['p2', [339, 442, 682, 70], '分類、項目：新增時空白', { col: C.gold, right: true, size: 24 }],
  ['p3', [339, 813, 682, 35], '狀態：先帶「正常」', { col: C.green, right: true, size: 24 }],
  ['p4', [7, 1039, 1276, 367], '固定選項：10 分類、3 種狀態、編碼規則', { col: C.teal, above: true, size: 26 }],
  ['p5', [265, 7, 770, 244], '幫手：檢查規則、匯出', { col: C.violet, below: true, size: 26 }],
]), [
  r => { show(r.bw.g); show(r.B[0]); later(2200, () => { hide(r.bw.g); show(r.svg); only(r, r.p1) }) },
  r => { only(r, r.p2, r.p3) },
  r => { only(r, r.p4) },
  r => { only(r, r.p5) },
])

sc3(34, diagScene(34, 4, 'DIAGRAMS-中心裝備物資.html#seq-create', [
  ['p1', [0, 0, 1936, 82], '最上面一排：角色', { col: C.gold, below: true, size: 26 }],
  ['p2', [475, 591, 690, 222], '問清冊下一個號碼 → 馬上顯示 PW-GEN-003', { col: OR, right: true, size: 24 }],
  ['p3', [143, 977, 1653, 385], '淡紅：檢查沒過，紅字留在原頁', { col: C.red, above: true, size: 26 }],
  ['p4', [459, 1373, 1337, 644], '淡綠：全部通過，存進清冊', { col: C.green, above: true, size: 26 }],
]), [
  r => { show(r.bw.g); show(r.B[0]); later(2600, () => { hide(r.bw.g); show(r.svg); only(r, r.p1) }) },
  r => { zoom(r.svg, [127, 95, 1100, 720], { pad: 20, max: 2 }); only(r, r.p2) },
  r => { zoom(r.svg, [143, 977, 1653, 385], { pad: 20, max: 2 }); only(r, r.p3) },
  r => { zoom(r.svg, [459, 1373, 1337, 644], { pad: 20, max: 2 }); only(r, r.p4) },
])

sc3(35, diagScene(35, 5, 'DIAGRAMS-中心裝備物資.html#state', [
  ['p1', [72, 248, 60, 52], '清冊', { col: C.gold, below: true, size: 26 }],
  ['p2', [886, 316, 646, 96], '編輯：分類、項目、編碼鎖住', { col: OR, above: true, right: true, size: 26 }],
]), [
  r => { show(r.bw.g); show(r.B[0]); later(2600, () => { hide(r.bw.g); show(r.svg); only(r, r.p1) }) },
  r => { only(r, r.p2) },
  r => { only(r); const t = tip('五張圖看完：不讀一行程式，就知道它打算怎麼做', { y: 806, size: 30, col: C.green }); show(t); glow(t) },
])

sc3(36, () => {
  const r = {}; hd(36, 'step3 ・ 看圖抓到落差')
  r.bw = bwHead('v5-diagn-1-head', 'DIAGRAMS-中心裝備物資.html#uc'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], [50, 80, 590, 24], '說明寫「7 件事」', { col: C.red, below: true, size: 28 })
  const [a, b] = vsh(r, ['v5-cc13-diagfix-ask', 'v5-cc13-diagfix-done'])
  r.a1 = hl(r, a, 'input', '一次講一件：看到什麼、期望什麼', { col: OR, above: true, size: 26 })
  r.b1 = hl(r, b, [340, 330, 700, 130], '改好了，還說原因：加了刪除、忘了改數字', { col: C.green, below: true, size: 26 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.h1)) },
  r => { only(r); hide(r.bw.g); show(r.S[0]); later(300, () => only(r, r.a1)); later(4000, () => { to(r, r.S[1]); only(r, r.b1) }) },
  r => { only(r); const t = tip('看圖就抓得到錯，不用讀程式；看不懂的圖，叫它重畫', { y: 806, size: 30, col: C.gold }); show(t); glow(t) },
])

sc3(37, () => {
  const r = {}; hd(37, 'step3 ・ 開工')
  const [a, b, c, d, e] = vsh(r, ['v5-cc14-q1', 'v5-cc15-model-menu', 'v5-cc15-go-typed', 'v5-cc16-build-start', 'v5-cc18-q1'])
  r.a1 = hl(r, a, 'rec', '還有題目：先答完', { col: C.green, below: true, size: 26 })
  r.b1 = hl(r, b, 'sonnet', '開工前：換 Sonnet 5.5', { col: C.gold, below: true, size: 28 })
  r.c1 = hl(r, c, 'input', '打「開工」→ 送出', { col: C.green, above: true, size: 28 })
  r.tea = box(L, 1080, 64, 400, 46, '實拍：約 8 分鐘，去倒杯茶', { size: 26, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.e1 = hl(r, e, 'rec', '選「我自己開網頁驗收」', { col: C.green, below: true, size: 26 })
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.a1)); later(3300, () => { to(r, r.S[1]); only(r, r.b1) }) },
  r => { to(r, r.S[2]); only(r, r.c1); later(3600, () => { to(r, r.S[3]); only(r); show(r.tea) }) },
  r => { to(r, r.S[4]); only(r, r.e1) },
])

sc3(38, () => {
  const r = {}; hd(38, 'step3 ・ 驗收')
  const [a] = vsh(r, ['v5-vs-dev3101'])
  r.a1 = hl(r, a, 'local', 'pnpm dev --port 3101 → 開它給的網址', { col: C.gold, below: true, size: 26 })
  r.bw = bwin(['v5-ea01-list', 'v5-ea04-item-open', 'v5-ea05-code', 'v5-ea06-validation', 'v5-ea07-delete'], 'localhost:3101/equipment/crud'); r.B = r.bw.S
  r.b1 = hl(r, r.B[0], 'count', '共 24 筆', { col: C.green, below: true, size: 28 })
  r.c1 = hl(r, r.B[1], 'list', '先選分類，項目才出現', { col: OR, below: true, size: 26 })
  r.c2 = hl(r, r.B[2], 'code', '品項編碼那格：馬上有號碼', { col: OR, below: true, size: 26 })
  r.d1 = hl(r, r.B[3], 'toast', '空表單儲存：四格紅字＋提示，不跳走', { col: C.red, above: true, right: true, size: 26 })
  r.e1 = hl(r, r.B[4], 'dialog', '刪除要先確認', { col: C.red, below: true, size: 28 })
  r.mob = scr('v5-ea08-mobile', fitF('v5-ea08-mobile', { x: 560, y: 120, w: 480, h: 700 }))
  r.prd = tip('視窗拉窄：表格變卡片　·　最後拿 PRD 第 3 節 12 項一項一項對', { y: 830, size: 28, col: C.gold })
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.a1)) },
  r => { only(r); hide(r.S[0]); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.b1)); later(2600, () => { burl(r.bw, 'localhost:3101/equipment/crud/new'); swap(r.B, r.B[1]); only(r, r.c1) }); later(5200, () => { swap(r.B, r.B[2]); only(r, r.c2) }) },
  r => { swap(r.B, r.B[3]); only(r, r.d1) },
  r => { burl(r.bw, 'localhost:3101/equipment/crud'); swap(r.B, r.B[4]); only(r, r.e1); later(2500, () => { only(r); hide(r.bw.g); show([r.mob, r.prd]) }) },
])

sc3(39, () => {
  const r = {}; hd(39, 'step3 ・ 小落差附畫面')
  r.bw = bwin(['v5-gap-before-wrap', 'v5-gap-after-wrap'], 'localhost:3101/equipment/crud'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'keeper', '陳建／豪：被拆成兩行', { col: C.red, below: true, size: 26 })
  r.a2 = hl(r, r.B[0], 'date', '日期也斷行', { col: C.red, above: true, right: true, size: 24 })
  r.a3 = hl(r, r.B[0], 'status2', '', { col: C.red })
  const [b, c] = vsh(r, ['v5-cc19-gap1-ask', 'v5-cc19-gap1-done'])
  r.k = keys(560, 300, ['Win', 'Shift', 'S'], { size: 40 })
  r.kt = tip('截圖：Win+Shift+S 框起來 → 輸入框 Ctrl+V', { y: 806, size: 30, col: C.teal })
  r.b1 = hl(r, b, 'img', '圖貼上了', { col: C.green, below: true, size: 26 })
  r.b2 = hl(r, b, 'input', '再打一句：看到什麼、期望什麼', { col: OR, above: true, size: 26 })
  r.c1 = hl(r, c, [340, 560, 700, 160], '改了哪個檔、可能的後果', { col: C.green, above: true, size: 26 })
  r.d1 = hl(r, r.B[1], 'keeper', '修改後：一行顯示', { col: C.green, below: true, size: 26 })
  r.d2 = hl(r, r.B[1], 'date', '', { col: C.green })
  r.bf = box(L, 70, 116, 230, 46, '修改前', { size: 26, fill: '#3a1f1f', stroke: C.red, color: C.ink, weight: 900 })
  r.af = box(L, 70, 116, 230, 46, '修改後', { size: 26, fill: '#16301f', stroke: C.green, color: C.ink, weight: 900 })
  return r
}, [
  r => { show([r.bw.g, r.bf]); show(r.B[0]); zoom(r.B[0], [1060, 380, 420, 200], { pad: 40, max: 1.8 }); later(300, () => only(r, r.a1, r.a2, r.a3)) },
  r => { only(r); unzoom(r.B[0]); hide([r.bw.g, r.bf]); show([r.k, r.kt]) },
  r => { hide([r.k, r.kt]); show(r.S[0]); later(300, () => only(r, r.b1)); later(2600, () => only(r, r.b2)); later(5200, () => { to(r, r.S[1]); only(r, r.c1) }) },
  r => { only(r); hide(r.S); show([r.bw.g, r.af]); swap(r.B, r.B[1]); zoom(r.B[1], [1060, 380, 420, 200], { pad: 40, max: 1.8 }); later(300, () => only(r, r.d1, r.d2)) },
])

sc3(40, () => {
  const r = {}; hd(40, 'step3 ・ 一次講一件')
  r.bw = bwin(['v5-gap2-before-dash', 'v5-gap2-after-dash'], 'localhost:3101/equipment/crud'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'keeperEmpty', '保管人空白：長橫', { col: C.gold, above: true, size: 24 })
  r.a2 = hl(r, r.B[0], 'dateEmpty', '採購日期空白：短橫', { col: C.red, below: true, right: true, size: 24 })
  const [b, c] = vsh(r, ['v5-cc20-gap2-ask', 'v5-cc20-gap2-done'])
  r.c1 = hl(r, c, [340, 190, 700, 90], '找到原因：等寬字型把長橫畫短了', { col: C.green, below: true, size: 26 })
  r.d1 = hl(r, r.B[1], 'dateEmpty', '修改後：兩格一樣長', { col: C.green, below: true, right: true, size: 24 })
  r.d2 = hl(r, r.B[1], 'keeperEmpty', '', { col: C.green })
  r.bf = box(L, 70, 116, 230, 46, '修改前', { size: 26, fill: '#3a1f1f', stroke: C.red, color: C.ink, weight: 900 })
  r.af = box(L, 70, 116, 230, 46, '修改後', { size: 26, fill: '#16301f', stroke: C.green, color: C.ink, weight: 900 })
  r.pass = tip('全部沒問題：打「驗收通過」送出　·　講兩次還不好：換個說法重講', { y: 806, size: 28, col: C.green })
  return r
}, [
  r => { show([r.bw.g, r.bf]); show(r.B[0]); zoom(r.B[0], 'row', { pad: 30, max: 1.6 }); later(300, () => only(r, r.a1, r.a2)) },
  r => { only(r); unzoom(r.B[0]); hide([r.bw.g, r.bf]); show(r.S[0]); later(2600, () => { to(r, r.S[1]); only(r, r.c1) }); later(6000, () => { only(r); hide(r.S); show([r.bw.g, r.af]); swap(r.B, r.B[1]); zoom(r.B[1], 'row', { pad: 30, max: 1.6 }); later(300, () => only(r, r.d1, r.d2)) }) },
  r => { only(r); show(r.pass); glow(r.pass) },
])

sc3(41, () => {
  const r = {}; hd(41, 'step3 ・ 檢查點')
  const items = ['AI 找缺口出題、你拍板', '交 4 個檔', '每張圖看懂', '你說「開工」才寫', '小落差附畫面']
  r.c = items.map((t, i) => box(L, 70 + i * 296, 150, 276, 140, '☑ ' + t, { size: 26, fill: C.card, stroke: C.green, color: C.ink, weight: 900 }))
  r.five = card(70, 320, 1460, 130, '網頁五件事', ['列表　·　連動下拉　·　新增編碼　·　刪除確認　·　手機卡片'], C.teal, { size: 30, ts: 34 })
  r.err = card(70, 480, 1460, 170, '一開頁就 500：useColorMode is not defined', ['跟 Claude Code 說：請停掉網頁伺服器、刪掉 .nuxt 和 .output 再重開　·　別的錯誤：整段訊息貼給它'], C.coral, { size: 28, ts: 32 })
  r.next = box(L, 70, 680, 1460, 110, '小修的來回很花時間 → 下一步：交給 AI 自己跑', { size: 34, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { stagger(r.c.slice(0, 2), 300, e => { show(e); glow(e) }) },
  r => { stagger(r.c.slice(2), 300, e => { show(e); glow(e) }); later(1500, () => show(r.five)) },
  r => { show(r.err); glow(r.err) },
  r => { show(r.next); glow(r.next) },
])

// ════════════════════════════ Step 4 ════════════════════════════
chapter('Step 4', 'LOOP＋對抗審查', C.violet)
// 第五版（2026-10-11）重拍：LOOP 報告的修改前後對照、裁決題附畫面
const REP = 'my-equipment-app/loop/LOOP-REPORT.html'
const BEF = '#3a1f1f', AFT = '#16301f'

sc3(42, () => {
  const r = {}; hd(42, 'step4')
  const [a, b] = vsh(r, ['vs10-explorer', 'v5-cc30-new-chat'])
  r.a1 = hl(r, a, 'tree', '開回教材根目錄：step0～step6 都看得到', { col: C.gold, lx: 380, size: 28 })
  r.b0 = hl(r, b, [1033, 73, 22, 22], '右上角加號：開新對話', { col: C.gold, below: true, right: true, size: 26 })
  r.b1 = hl(r, b, [418, 524, 98, 20], 'Sonnet 5.5', { col: C.gold, above: true, size: 26 })
  r.b2 = hl(r, b, [940, 522, 55, 24], 'Auto', { col: C.green, above: true, right: true, size: 26 })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1)) },
  r => { to(r, r.S[1]); only(r, r.b0); later(2600, () => only(r, r.b1, r.b2)) },
])

sc3(43, () => {
  const r = {}; hd(43, 'step4')
  r.bw = bwin(['hb5-step4-loop'], HB + '#step4'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], 'pre', '手冊 Step 4 的 LOOP prompt：四行', { col: OR, below: true, size: 26 })
  r.l1 = hl(r, r.B[0], [89, 110, 822, 30], '第一行：照 LOOP-規矩.md 做', { col: OR, below: true, size: 26 })
  r.rule = card(120, 160, 1360, 300, 'step4_loop_e2e/LOOP-規矩.md（給 AI 讀）', ['修好的每一條：附「修改前」「修改後」兩張圖', '要你裁決的題目：附當下的畫面'], C.violet, { size: 32, ts: 32, lh: 70 })
  r.rule2 = card(120, 490, 1360, 250, '也都寫在規矩檔裡', ['鐵律：修兩次沒好就停、不准改測試　·　3100 被占就自己換', '要交：LOOP-LOG、LOOP-REPORT、測試報告、文件同步'], C.mut, { size: 28, ts: 30, lh: 60 })
  const [b] = vsh(r, ['v5-cc30-loop-pasted'])
  r.b1 = hl(r, b, 'send', '送出：接下來不用插手', { col: C.green, above: true, right: true, size: 28 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.h1)) },
  r => { only(r, r.l1) },
  r => { only(r); hide(r.bw.g); show(r.rule); glow(r.rule) },
  r => { show(r.rule2); later(3600, () => { hide([r.rule, r.rule2]); show(r.S[0]); later(300, () => only(r, r.b1)) }) },
])

sc3(44, () => {
  const r = {}; hd(44, 'step4')
  const [a] = vsh(r, ['v5-loop-log'])
  r.a1 = hl(r, a, [128, 174, 775, 24], '3100 被占 → 自己改用 3101，沒動別人的程式', { col: C.green, below: true, size: 26 })
  r.a2 = hl(r, a, [128, 328, 262, 24], '第 1 輪：7 passed，全綠', { col: C.green, below: true, size: 26 })
  r.red = tip('有紅也正常：先判斷原因 → 再修 → 再跑', { y: 806, size: 30, col: C.gold })
  r.bw = bwin(['v5-rep-rounds'], REP); r.B = r.bw.S
  r.c1 = hl(r, r.B[0], [86, 78, 1068, 482], '每一輪一列：結果、紅了哪幾條、改了哪個檔', { col: OR, above: true, size: 26 })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1)) },
  r => { only(r, r.a2); later(2600, () => { show(r.red); glow(r.red) }) },
  r => { only(r); hide([r.red, r.S[0]]); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.c1)) },
])

sc3(45, () => {
  const r = {}; hd(45, 'step4')
  const [a, b] = vsh(r, ['v5-cc31-t0300', 'v5-cc31-t0540'])
  r.a0 = hl(r, a, [477, 524, 64, 21], '1 agent：子代理在跑（Opus 5.5）', { col: C.gold, above: true, size: 26 })
  r.a1 = hl(r, a, [365, 205, 665, 117], '寫截圖腳本：逐頁截圖、實際點按鈕（只看，不改 App）', { col: C.teal, below: true, size: 26 })
  r.b1 = hl(r, b, [365, 290, 665, 117], '寫審查清單：挑到的錯一條一條列', { col: C.teal, below: true, size: 26 })
  r.bw = bwin(['v5-rep-review'], REP + '#review'); r.B = r.bw.S
  r.c1 = hl(r, r.B[0], [86, 88, 1066, 58], '挑到 12 條：App 7 條、測試 5 條', { col: OR, below: true, size: 28 })
  r.tea = box(L, 1080, 64, 400, 46, '實拍：從貼上到報告約半小時', { size: 26, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a0)) },
  r => { only(r, r.a1) },
  r => { to(r, r.S[1]); only(r, r.b1); later(3200, () => { only(r); hide(r.S); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.c1)) }) },
  r => { show(r.tea); glow(r.tea) },
])

// 報告裡的「修改前／修改後」：先框兩張，再放大修改前、再放大修改後
function fixPair(r, g, tipText, o = {}) {
  const bf = hl(r, g, o.bf || 'before', '修改前', { col: C.red, above: true, size: 26 })
  const af = hl(r, g, o.af || 'after', '修改後', { col: C.green, above: true, size: 26 })
  const t = tip(tipText, { y: 116, size: 30, col: C.gold })  // 放大時畫面下緣有重點（頁碼），字卡放上面蓋住網址列
  return { bf, af, t }
}
function fixShow(r, g, p, o = {}) {
  only(r, p.bf, p.af); show(p.t); glow(p.t)
  later(o.t1 ?? 2400, () => { only(r); zoom(g, o.zb || 'before', { pad: 12, max: 2 }) })
  later(o.t2 ?? 5600, () => zoom(g, o.za || 'after', { pad: 12, max: 2 }))
}

sc3(46, () => {
  const r = {}; hd(46, 'step4 ・ 修改前後')
  r.bw = bwin(['v5-rep-fix1', 'v5-rep-fix2', 'v5-rep-fix3'], REP + '#fixed'); r.B = r.bw.S
  r.p1 = fixPair(r, r.B[0], '審查 1　修改前：停在第 2 頁　→　修改後：回到第 1 頁')
  r.p2 = fixPair(r, r.B[1], '審查 2　修改前：多出兩筆　→　修改後：只多一筆')
  r.p3 = fixPair(r, r.B[2], '審查 3　修改前：平板排在筆電前　→　修改後：照 PRD 清單順序')
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.p1.bf, r.p1.af)) },
  r => { fixShow(r, r.B[0], r.p1) },
  r => { unzoom(r.B[0]); hide(r.p1.t); swap(r.B, r.B[1]); fixShow(r, r.B[1], r.p2) },
  r => { unzoom(r.B[1]); hide(r.p2.t); swap(r.B, r.B[2]); fixShow(r, r.B[2], r.p3) },
])

sc3(47, () => {
  const r = {}; hd(47, 'step4 ・ 裁決附畫面')
  const [a, b] = vsh(r, ['v5-cc35-loop-done', 'v5-cc37-q2-ans'])
  r.a1 = hl(r, a, [355, 225, 675, 240], '要動全站共用的檔：停下來出選擇題', { col: C.gold, above: true, size: 26 })
  r.a2 = hl(r, a, [361, 301, 663, 43], '選建議的：改 app.vue', { col: C.green, below: true, size: 26 })
  r.bw = bwin(['v5-rep-decide', 'v5-rep-q1', 'v5-rep-q3'], REP + '#decide'); r.B = r.bw.S
  r.d1 = hl(r, r.B[0], [86, 86, 645, 28], '每一題都附當下的畫面', { col: OR, above: true, right: true, size: 26 })
  r.d2 = hl(r, r.B[0], [108, 290, 560, 350], '', { col: OR })
  r.dt = tip('選擇題框裡放不了圖 → 先看報告的圖，再回答', { y: 806, size: 30, col: C.teal })
  r.q1a = hl(r, r.B[1], [745, 68, 392, 62], '只剩 IT：後面的字不見', { col: C.red, below: true, right: true, size: 26 })
  r.q1b = hl(r, r.B[1], [216, 226, 140, 30], '', { col: C.red })
  r.q3a = hl(r, r.B[2], [128, 258, 490, 88], '手機寬度：三顆字都斷成兩行', { col: C.red, below: true, size: 26 })
  r.b1 = hl(r, b, [361, 301, 663, 43], '建議：三條都修，但會動到共用元件', { col: C.gold, above: true, size: 26 })
  r.b2 = hl(r, b, [364, 350, 245, 38], '我選：只修手機選單斷行（影響最小）', { col: C.green, below: true, size: 26 })
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.a1)) },
  r => { only(r); hide(r.S[0]); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.d1, r.d2)); later(2600, () => { show(r.dt); glow(r.dt) }) },
  r => { hide(r.dt); swap(r.B, r.B[1]); only(r, r.q1a, r.q1b); later(4600, () => { only(r); hide(r.bw.g); show(r.S[0]); later(300, () => only(r, r.a2)) }) },
  r => { only(r); hide(r.S[0]); show(r.bw.g); swap(r.B, r.B[2]); later(300, () => only(r, r.q3a)); later(3600, () => { only(r); hide(r.bw.g); show(r.S[1]); later(300, () => only(r, r.b1)); later(3300, () => only(r, r.b2)) }) },
])

sc3(48, () => {
  const r = {}; hd(48, 'step4 ・ 修改前後')
  r.bw = bwin(['v5-rep-fix4', 'v5-rep-fix5', 'v5-rep-rounds', 'v5-rep-open'], REP + '#fixed'); r.B = r.bw.S
  r.p4 = fixPair(r, r.B[0], 'Q1　修改前：框裡只剩 IT　→　修改後：完整的 IT-LAP')
  r.p5 = fixPair(r, r.B[1], 'Q3　修改前：三顆字斷成兩行　→　修改後：各一行', { bf: [107, 184, 506, 450], af: [627, 184, 506, 450] })
  r.r3 = hl(r, r.B[2], [86, 480, 1068, 80], '第 3 輪：還是 7 passed', { col: C.green, above: true, size: 28 })
  r.op = hl(r, r.B[3], [86, 10, 1068, 262], '你說先不修的：記在報告，不偷偷改', { col: C.gold, below: true, size: 28 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); fixShow(r, r.B[0], r.p4) },
  r => { unzoom(r.B[0]); hide(r.p4.t); swap(r.B, r.B[1]); fixShow(r, r.B[1], r.p5, { zb: [100, 270, 1040, 110], za: [100, 270, 1040, 110], t2: 99999 }) },
  r => { unzoom(r.B[1]); hide(r.p5.t); only(r); swap(r.B, r.B[2]); later(300, () => only(r, r.r3)); later(3000, () => { swap(r.B, r.B[3]); only(r, r.op) }) },
])

sc3(49, () => {
  const r = {}; hd(49, 'step4 ・ 卡住時')
  r.a = card(70, 150, 715, 300, 'E1～E7 有幾條紅', ['正常：這就是 LOOP 的用途', '別插手，讓它自己修'], C.green, { size: 30, ts: 38, lh: 60 })
  r.b = card(815, 150, 715, 300, '腳本根本沒跑起來', ['瀏覽器下載失敗、連不上 App…', '環境問題：開新對話，貼手冊的環境求救 prompt'], C.coral, { size: 30, ts: 38, lh: 60 })
  r.c = box(L, 70, 490, 1460, 150, '它自己停下來：同一個問題修兩次還沒好\n這是規矩，代表該你介入了', { size: 34, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { show(r.a); glow(r.a) },
  r => { show(r.b); glow(r.b) },
  r => { show(r.c); glow(r.c) },
])

sc3(50, () => {
  const r = {}; hd(50, 'step4 ・ 驗收')
  r.bw = bwin(['v5-rep-top', 'v5-rep-open', 'v5-rep2-q5'], REP); r.B = r.bw.S
  r.k = cmdCard(120, 680, 1360, ['start step3_new_module\\my-equipment-app\\loop\\LOOP-REPORT.html'], '教材根目錄的終端機：用瀏覽器打開報告', { size: 26 })
  r.a1 = hl(r, r.B[0], [86, 136, 1068, 112], '結論在最前面', { col: OR, below: true, size: 28 })
  r.b1 = hl(r, r.B[1], [86, 300, 1068, 39], '測試的假綠：只列出來，不准改', { col: C.gold, below: true, right: true, size: 26 })
  r.c1 = hl(r, r.B[2], [108, 98, 640, 30], 'Q5：7 條都沒點過排序標題', { col: C.red, below: true, right: true, size: 26 })
  r.c2 = hl(r, r.B[2], [108, 180, 560, 351], '', { col: C.red })
  r.c3 = hl(r, r.B[2], [528, 12, 112, 34], '講測試', { col: C.gold, below: true, size: 26 })
  r.hand = tip('寫著「講測試」的題目 → 舉手找講師（補測試要重算基準）', { y: 806, size: 30, col: C.gold })
  return r
}, [
  r => { show([r.bw.g, r.k]); show(r.B[0]); later(300, () => only(r, r.a1)) },
  r => { hide(r.k); glow(r.a1) },
  r => { swap(r.B, r.B[1]); only(r, r.b1); later(3200, () => { swap(r.B, r.B[2]); only(r, r.c1, r.c2) }) },
  r => { only(r, r.c3); show(r.hand); glow(r.hand) },
])

sc3(51, () => {
  const r = {}; hd(51, 'step4 ・ 驗收')
  r.bw = bwin(['v5-pw-report'], 'step4_loop_e2e/e2e/playwright-report/index.html'); r.B = r.bw.S
  r.p1 = hl(r, r.B[0], 'pass', '7 條都是綠的', { col: C.green, below: true, size: 28 })
  r.k = cmdCard(120, 680, 1360, ['start step4_loop_e2e\\e2e\\playwright-report\\index.html'], '教材根目錄的終端機：用瀏覽器打開測試報告', { size: 26 })
  const [a, b, c] = vsh(r, ['v5-loop-log2', 'v5-srs-loopmark', 'v5-cc38-final'])
  r.a1 = hl(r, a, [100, 85, 940, 105], 'LOOP-LOG.md：你的裁決也記在流水帳', { col: C.teal, below: true, size: 26 })
  r.b1 = hl(r, b, [488, 250, 505, 76], '「step4 LOOP 後」：程式改了，文件跟著改', { col: C.green, below: true, right: true, size: 26 })
  r.c1 = hl(r, c, [478, 287, 220, 20], '照這個網址，自己再點一遍', { col: C.gold, below: true, size: 28 })
  return r
}, [
  r => { show([r.bw.g, r.k]); show(r.B[0]); later(300, () => only(r, r.p1)) },
  r => { only(r); hide([r.bw.g, r.k]); show(r.S[0]); later(300, () => only(r, r.a1)) },
  r => { to(r, r.S[1]); only(r, r.b1) },
  r => { to(r, r.S[2]); only(r, r.c1) },
])

sc3(52, () => {
  const r = {}; hd(52, 'step4 ・ 檢查點')
  const items = ['7 條全綠（或報告寫清楚停在哪）', '子代理挑過錯', '修好的每一條：有修改前、修改後的圖', '裁決題：看過畫面才回答', '報告、測試報告、流水紀錄都在；文件標「step4 LOOP 後」', '自己點過一遍']
  r.c = items.map((t, i) => box(L, 70, 140 + i * 78, 1460, 66, '☑ ' + t, { size: 28, fill: C.card, stroke: C.green, color: C.ink, weight: 800 }))
  r.iron = [['鐵律 1', '同一問題修兩次沒好就停', C.red], ['鐵律 2', '不准改測試、不准放寬標準', C.red]].map(([h, s, col], i) => card(70 + i * 745, 630, 715, 150, h, [s], col, { size: 30, ts: 36 }))
  return r
}, [
  r => { stagger(r.c.slice(0, 1), 100, e => { show(e); glow(e) }) },
  r => { stagger(r.c.slice(1, 4), 300, e => { show(e); glow(e) }) },
  r => { stagger(r.c.slice(4), 300, e => { show(e); glow(e) }) },
  r => { stagger(r.iron, 500) },
])

// ════════════════════════════ Step 5 ════════════════════════════
chapter('Step 5', '收尾', C.green)

sc3(53, () => {
  const r = {}; hd(53, 'step5')
  r.n = flowRow(170, [['白話\nPRD', C.teal], ['起手\nprompt', C.gold], ['AI 出題\n你拍板', C.gold], ['看文件\n和圖', C.violet], ['說\n開工', C.pink], ['LOOP\nprompt', C.violet], ['驗收\n報告', C.green]], { w: 190, gap: 18 })
  r.spec = tip('PRD 用白話寫，像寫給同事的需求', { y: 330, size: 30, col: C.teal })
  r.test = tip('新模組也要先備好自動測試，LOOP 才有標準可以對', { y: 330, size: 30, col: C.coral })
  r.tea = box(L, 70, 430, 1460, 140, 'LOOP 跑的時候，你可以去喝茶\n回來看報告、自己點一遍', { size: 38, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.two = [['頭', '講清楚要什麼、拍板', C.gold], ['尾', '驗收', C.green]].map(([h, s, col], i) => card(120 + i * 690, 610, 670, 160, h, [s], col, { size: 32, ts: 40 }))
  return r
}, [
  r => { stagger(r.n.slice(0, 1), 300); later(500, () => show(r.spec)) },
  r => { stagger(r.n.slice(1, 5), 300) },
  r => { hide(r.spec); show(r.test); glow(r.test); stagger(r.n.slice(5), 300); later(2600, () => { show(r.tea); glow(r.tea) }) },
  r => { stagger(r.two, 500) },
])

sc3(54, () => {
  const r = {}; hd(54, 'step5')
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
