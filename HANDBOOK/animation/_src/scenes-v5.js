// ============================================================
// AI CRUD 工作坊 EASY 版：講課版教學動畫 第五版（2026-10-11：白話 PRD＋AI 找缺口、五張中文圖、LOOP 修改前後、裁決附畫面）（SDD＝規格驅動開發；文件＝SRS＋設計文件＋圖；LOOP 交紀錄、報告、測試報告）
// 講稿：tts-audition/script_v5.py → window.__script；配音 → window.__audio
// 兩人分段：小芸（Sulafat）講方法和觀念，阿哲（Sadaltager）講實拍示範。指令只放在畫面字卡。
// 畫面：2026-10-04～11 在 Windows 11 實拍（VS Code 繁中介面＋Claude Code、PowerShell、Chrome）。Step 3 文件用 Opus 5.5、寫程式用 Sonnet 5.5。
// ============================================================
const OR = '#ff6a00'                        // 淺色網頁上的標註色
const FV = FR                                // VS Code 截圖：整張
function vsh(r, names, F = FV) { return shots(r, names, F) }
const RED = s => [[s, TC.err, 700]], GRN = s => [[s, TC.ok, 700]]
const LAB = 'D:\\AI_CRUD_Workshop_Frontend_EASY'

// ════════════════════════════ 開場 ════════════════════════════
chapter('開場', 'AI 開發四件事', C.teal)

sc3(1, () => {
  const r = {}; hd(1, '開場')
  r.hero = box(L, 70, 300, 1460, 220, '這門課不教你寫程式\n教你讓 AI 照你們公司的規矩寫程式', { size: 54, fill: C.card, stroke: C.gold, color: C.ink, weight: 900 })
  r.ov = scr('hb-overview', fitF('hb-overview', { x: 70, y: 120, w: 1460, h: 660 }))
  r.t1 = tip('harness＝滷包（給 AI 的規矩）　·　範本＝配方', { y: 800, size: 32, col: C.gold })
  r.t2 = tip('SDD＝規格驅動開發：先寫好菜單和做法再下鍋；菜改了，菜單跟著改', { y: 800, size: 30, col: C.violet })
  const items = [['harness', '公司規矩', C.gold], ['SDD', '先文件，再程式', C.violet], ['LOOP', '自己跑測試、自己修', C.teal], ['對抗審查', '另一個 AI 挑錯', C.coral]]
  r.cards = items.map(([a, b, col], i) => { const g = grp(L); const x = 70 + i * 372; R(g, x, 170, 344, 300, { fill: C.card, stroke: col, sw: 5 })
    T(g, x + 172, 300, a, { size: 46, anchor: 'middle', weight: 900, fill: col }); T(g, x + 172, 370, b, { size: 28, anchor: 'middle', fill: C.ink }); return g })
  r.ends = box(L, 70, 540, 1460, 200, '你只顧頭顧尾\n頭＝講清楚要什麼、幫 AI 拍板　·　尾＝驗收', { size: 40, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { show(r.hero); glow(r.hero) },
  r => { hide(r.hero); show([r.ov, r.t1]) },
  r => { hide(r.t1); show(r.t2); glow(r.ov) },
  r => { hide([r.ov, r.t2]); stagger(r.cards, 350) },
  r => { show(r.ends); glow(r.ends) },
])

sc3(2, () => {
  const r = {}; hd(2, '開場')
  const items = [['Step 0', '準備環境', C.mut, 0], ['Step 1', '有規矩、沒規矩差在哪', C.coral, 0], ['Step 2', '認識 harness', C.teal, 1], ['Step 3', '用 SDD 做新模組', C.pink, 1], ['Step 4', 'LOOP＋對抗審查', C.violet, 1], ['Step 5', '回公司怎麼用', C.green, 0]]
  r.c = items.map(([a, b, col, key], i) => { const g = grp(L); const x = 70 + (i % 3) * 495, y = 140 + Math.floor(i / 3) * 290
    R(g, x, y, 465, 250, { fill: key ? '#203f5a' : C.card, stroke: col, sw: key ? 6 : 3 })
    T(g, x + 30, y + 70, a, { size: 40, weight: 900, fill: col }); T(g, x + 30, y + 150, b, { size: 34, weight: 800 })
    if (key) T(g, x + 435, y + 70, '重點', { size: 26, anchor: 'end', weight: 900, fill: C.gold }); return g })
  r.tip = tip('指令都放在畫面上和手冊裡，照著貼就好；時間花在 AI 怎麼做事', { y: 730, size: 32, col: C.gold })
  return r
}, [
  r => stagger(r.c.slice(0, 2), 400),
  r => stagger(r.c.slice(2, 4), 400),
  r => stagger(r.c.slice(4), 400),
  r => { show(r.tip); glow(r.tip) },
])

// ════════════════════════════ Step 0 ════════════════════════════
chapter('Step 0', '準備環境', C.gold)

sc3(3, () => {
  const r = {}; hd(3, 'step0')
  r.three = [['1　下載教材', 'git clone'], ['2　打開資料夾', '信任作者，選「是」'], ['3　前置檢查', 'preflight 沒有 FAIL']].map(([h, s], i) => card(70 + i * 495, 200, 465, 260, h, [s], [C.teal, C.gold, C.green][i], { size: 32, ts: 40, lh: 56 }))
  const [a, b, c] = vsh(r, ['vs06-clone-done', 'vs09-trust', 'vs13-preflight-pass'])
  r.a1 = hl(r, a, 'done', '下載完成', { col: C.green, below: true })
  r.b1 = hl(r, b, 'yes', '是，我信任作者', { col: C.green, below: true })
  r.c1 = hl(r, c, 'summary', '沒有 FAIL：可以開課', { col: C.green, below: true })
  r.k1 = cmdCard(120, 650, 1360, ['cd D:\\', 'git clone https://github.com/xian711/AI_CRUD_Workshop_Frontend_EASY.git'], 'VS Code 終端機（選單「終端機」→「新增終端」）')
  r.k3 = cmdCard(120, 650, 1360, ['cd step0_course_intro', '.\\preflight.ps1'], '在教材資料夾的終端機')
  r.pre = card(120, 180, 1360, 420, '課前先裝好（手冊 Step 0 有清單）', ['VS Code　·　Git　·　Node.js　·　pnpm', 'VS Code 裡的 AI 助手：Claude Code 擴充', '沒有 D 槽，指令裡的 D 換成 C'], C.gold, { size: 34, ts: 40, lh: 70 })
  return r
}, [
  r => { show(r.pre); glow(r.pre) },
  r => { hide(r.pre); show([r.S[0], r.k1]); later(500, () => only(r, r.a1)) },
  r => { hide(r.k1); to(r, r.S[1]); only(r, r.b1) },
  r => { to(r, r.S[2]); show(r.k3); only(r, r.c1) },
  r => { only(r); hide([...r.S, r.k3]); stagger(r.three, 350) },
])

sc3(4, () => {
  const r = {}; hd(4, 'step0')
  r.t = term({ x: 60, y: 128, w: 1480, h: 330, size: 24, note: 'FAIL 與 WARN' })
  r.lines = r.t.out(['[PASS] git 已安裝 — 偵測到 git version 2.54.0.windows.1', '[FAIL] pnpm 已安裝 — 找不到 pnpm',
    '       修復提示：執行「npm install -g pnpm」，裝完關掉終端機重開再跑一次', '[WARN] port 3100 未被占用 — port 3100 已被占用（不用關別人的程式：pnpm dev 會自動換一個埠印在終端機；step4 的 AI 也會自己換埠）', '有 1 項檢查未通過，請依上方修復提示處理後重新執行 preflight.ps1。'], { gap: 0 })
  r.prompt = codeCard(60, 490, 1480, ['這是工作坊前置檢查 preflight.ps1 的完整輸出，我用 Windows 11。', '請說明每個 [FAIL] 的原因，給我可複製的修復指令；不要改工作坊的檔案。', '（把整份輸出貼在後面）'], { title: '手冊 Step 0 的求救 prompt：連同整份輸出一起貼給 AI', size: 28, col: C.coral })
  r.ep = cmdCard(60, 490, 1480, ['Set-ExecutionPolicy -Scope CurrentUser RemoteSigned'], '出現「已停用指令碼執行」：先打這一行，再重跑 .\\preflight.ps1', { size: 30, col: C.coral })
  return r
}, [
  r => { show(r.t.g); later(400, () => { const m = r.t.mark(r.lines[1], 'FAIL', C.red); show(m); glow(m) }); later(1400, () => show(r.t.mark(r.lines[2], '修復提示', C.gold))); later(4200, () => { const w = r.t.mark(r.lines[3], 'WARN：不擋你', C.gold); show(w); glow(w) }) },
  r => { show(r.prompt); glow(r.prompt) },
  r => { hide(r.prompt); show(r.ep); glow(r.ep) },
])

// ════════════════════════════ Step 1 ════════════════════════════
chapter('Step 1', '為什麼要給 AI 規矩', C.coral)

sc3(5, () => {
  const r = {}; hd(5, 'step1')
  const A1 = { x: 40, y: 150, w: 750, h: 470, bar: 56 }, A2 = { x: 810, y: 150, w: 750, h: 470, bar: 56 }
  r.b1 = bwin(['br10-noh'], 'no-harness.html', A1); r.b2 = bwin(['br13-wh'], 'with-harness.html', A2)
  show(r.b1.S[0]); show(r.b2.S[0])
  r.l1 = T(L, 415, 670, '沒給規矩', { size: 40, anchor: 'middle', weight: 900, fill: C.coral }); r.l1.classList.add('hid')
  r.l2 = T(L, 1185, 670, '有給規矩（harness）', { size: 40, anchor: 'middle', weight: 900, fill: C.teal }); r.l2.classList.add('hid')
  r.c1 = hl(r, r.b1.S[0], 'add', '橘色：AI 自己挑的', { col: OR, below: true, size: 26 })
  r.c2 = hl(r, r.b2.S[0], 'add', '品牌紅：規矩指定的', { col: OR, below: true, size: 26 })
  r.tip = tip('差別不在好不好看，在「這個決定是誰做的」', { y: 730, size: 38 })
  return r
}, [
  r => show([r.b1.g, r.b2.g, r.l1, r.l2]),
  r => { zoom(r.b1.S[0], 'add', { pad: 90, max: 2.4 }); zoom(r.b2.S[0], 'add', { pad: 90, max: 2.4 }); only(r, r.c1, r.c2) },
  r => { unzoom(r.b1.S[0]); unzoom(r.b2.S[0]); only(r); show(r.tip); glow(r.tip) },
])

sc3(6, () => {
  const r = {}; hd(6, 'step1')
  r.bw = bwin(['br10-noh', 'br12-noh-added', 'br14-wh-empty-submit', 'br15-wh-phone-blocked', 'br16-wh-landline-ok'], 'no-harness.html'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'blood', '一打開就選好「A」', { col: C.red, below: true, size: 30 })
  r.a2 = hl(r, r.B[1], 'row', '血型存成 A，完全不檢查', { col: C.red, below: true, size: 30 })
  r.b1 = hl(r, r.B[2], 'bloodErr', '沒選血型 → 擋下來', { col: OR, below: true, size: 30, pad: 6 })
  r.c1 = hl(r, r.B[3], 'phoneErr', '市話忘了區碼 → 擋', { col: OR, below: true, size: 28 })
  r.d1 = hl(r, r.B[4], 'row', '(02) 1234-5678 → 收：市話也是電話', { col: C.green, above: true, size: 28 })
  r.bag = tip('哪些欄位錯不起、要怎麼檢查——這些就是要放進滷包的規矩', { y: 806, size: 30, col: C.gold })
  r.where = ['step1 的 PROMPT.md 版本 B【表單互動】', '範本 CLAUDE.md「程式規則」第 11 條', 'CODE-RULES、design-system-summary'].map((t, i) => card(70 + i * 495, 160, 475, 150, ['寫在 ①', '寫在 ②', '寫在 ③'][i], [t], C.teal, { size: 26, ts: 30 }))
  r.md = scr('v5-claude-md-rule11', fitF('v5-claude-md-rule11', { x: 220, y: 130, w: 1160, h: 650 }))
  r.m1 = hl(r, r.md, [380, 100, 690, 92], 'CLAUDE.md 第 11 條：選項欄位不准預設帶第一個', { col: C.gold, below: true, size: 17 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); zoom(r.B[0], 'blood', { pad: 160, max: 1.8 }); only(r, r.a1) },
  r => { unzoom(r.B[0]); swap(r.B, r.B[1]); only(r, r.a2) },
  r => { burl(r.bw, 'with-harness.html'); swap(r.B, r.B[2]); only(r, r.b1); later(3600, () => { swap(r.B, r.B[3]); zoom(r.B[3], 'phoneErr', { pad: 140, max: 1.8 }); only(r, r.c1) }); later(6400, () => { unzoom(r.B[3]); swap(r.B, r.B[4]); only(r, r.d1) }) },
  r => { only(r); show(r.bag); glow(r.bag) },
  r => { hide([r.bag, r.bw.g]); stagger(r.where, 400); later(2800, () => { hide(r.where); show(r.md); zoom(r.md, [380, 100, 690, 92], { pad: 70, max: 1.7 }); later(400, () => only(r, r.m1)) }) },
])

// ════════════════════════════ Step 2 ════════════════════════════
chapter('Step 2', 'harness：給 AI 的規矩', C.teal)

sc3(7, () => {
  const r = {}; hd(7, 'step2')
  const [a] = vsh(r, ['vs17-pnpm-dev'])
  r.a1 = hl(r, a, 'url', 'http://localhost:3100/', { col: C.green, below: true })
  r.k = cmdCard(120, 660, 1360, ['cd step2_speedrun_kit/2.1_sample_app/sample-app', 'pnpm install', 'pnpm dev'], '在教材資料夾的終端機（pnpm dev 這個視窗要一直開著）', { size: 24 })
  r.bw = bwin(['br30-list', 'br37-delete-confirm', 'br42b-export-all', 'br31-new-empty', 'br31c-new-errors-lower'], 'localhost:3100/template/crud'); r.B = r.bw.S
  r.b1 = hl(r, r.B[0], 'table', '人員管理：新增、編輯、刪除、篩選、匯出', { col: OR, size: 28, above: true })
  r.b2 = hl(r, r.B[1], 'dialog', '刪除前先確認', { col: C.red, size: 28, below: true })
  r.b3 = hl(r, r.B[2], 'toast', '匯出全部 24 筆，不是只有這一頁', { col: OR, size: 26, above: true, right: true, pad: 18 })
  r.f1 = hl(r, r.B[3], 'gender', '性別：空白「請選擇」', { col: C.gold, below: true, size: 26 })
  r.f2 = hl(r, r.B[3], 'idType', '證件類別也是', { col: C.gold, below: true, size: 26 })
  r.f3 = hl(r, r.B[4], 'status', '只有狀態先帶「在職」：規格寫了理由', { col: C.green, below: true, right: true, size: 24 })
  r.ans = tip('範本＝AI 做新模組時，要照著抄的標準答案', { y: 806, size: 32, col: C.gold })
  return r
}, [
  r => { show([r.S[0], r.k]); later(500, () => only(r, r.a1)) },
  r => { hide([r.S[0], r.k]); only(r); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.b1)) },
  r => { swap(r.B, r.B[1]); only(r, r.b2); later(3200, () => { swap(r.B, r.B[2]); only(r, r.b3) }) },
  r => { burl(r.bw, 'localhost:3100/template/crud/new'); swap(r.B, r.B[3]); only(r, r.f1, r.f2); later(4200, () => { swap(r.B, r.B[4]); only(r, r.f3) }) },
  r => { show(r.ans); glow(r.ans) },
])

sc3(8, () => {
  const r = {}; hd(8, 'step2')
  const [a, b] = vsh(r, ['vs21-harness-files', 'v5-claude-md-rule11'])
  r.a1 = hl(r, a, 'sampleApp', 'sample-app 最上層', { lx: 560 })
  r.a2 = hl(r, a, [53, 331, 257, 22], '使用說明', { lx: 560, col: C.gold })
  r.a3 = hl(r, a, [53, 419, 257, 66], 'CLAUDE.md・CODE-RULES・design-system-summary', { lx: 560, col: C.gold, size: 24 })
  r.b1 = hl(r, b, [380, 100, 690, 92], 'CLAUDE.md 第 11 條：選項欄位不准預設帶第一個', { col: C.teal, below: true, size: 17 })
  r.c1 = hl(r, a, [53, 441, 257, 44], 'CODE-RULES：細則　·　design-system-summary：顏色和間距', { lx: 560, col: C.teal, size: 24, below: true })
  r.c3 = hl(r, a, 'guide', '使用說明：怎麼複製範本開新模組', { lx: 560, col: C.teal })
  r.who = [['寫給 AI 讀', '你不用逐條讀懂', C.teal], ['人負責確認', '規矩寫得對不對', C.gold]].map(([h, s, col], i) => card(120 + i * 690, 640, 670, 150, h, [s], col, { size: 30, ts: 36 }))
  r.warn = tip('規矩寫錯，AI 會照著錯，而且錯得又快又整齊', { y: 806, size: 32, col: C.coral })
  return r
}, [
  r => { show(r.S[0]); later(500, () => only(r, r.a1, r.a2, r.a3)) },
  r => { to(r, r.S[1]); zoom(r.S[1], [380, 100, 690, 92], { pad: 70, max: 1.7 }); only(r, r.b1) },
  r => { unzoom(r.S[1]); to(r, r.S[0]); only(r, r.c1, r.c3) },
  r => { only(r); stagger(r.who, 400) },
  r => { show(r.warn); glow(r.warn) },
])

sc3(9, () => {
  const r = {}; hd(9, 'step2')
  const rows = [['列表頁 index.vue', 1], ['明細頁 [id].vue', 1], ['資料層 useTemplateMembers', 1], ['欄位元件 TemplateFormField', 1], ['狀態標籤 TemplateStatusBadge', 1], ['列表狀態工廠 useTemplateListPage', 0], ['驗證引擎 templateValidation', 0], ['CSV 匯出 templateCsv', 0]]
  r.tbl = grp(L); R(r.tbl, 70, 120, 1460, 660, { fill: C.card, stroke: C.line, sw: 3 })
  T(r.tbl, 800, 168, '跟「這個資料長什麼樣子」有關 → 複製改名；通用的機制 → 直接共用', { size: 30, anchor: 'middle', weight: 900, fill: C.gold })
  r.rowG = rows.map(([n, copy], i) => { const g = grp(r.tbl, false); const y = 195 + i * 70; R(g, 90, y, 1420, 60, { fill: copy ? '#173a3c' : '#3a2a14', rx: 10 })
    T(g, 120, y + 41, (i + 1) + '. ' + n, { size: 30, weight: 800 }); T(g, 1250, y + 41, copy ? '複製改名' : '直接共用', { size: 32, weight: 900, fill: copy ? C.teal : C.gold }); return g })
  r.cmp = box(L, 70, 790, 1460, 90, '比喻：開分店——招牌、菜單要換（複製改名）；收銀機、冷氣照用（直接共用）', { size: 31, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 800 })
  r.rule = box(L, 70, 790, 1460, 90, '規矩寫明：共用檔不准動 → Step 3 的設計文件會檢查 AI 有沒有守住', { size: 31, fill: '#1c2f4a', stroke: C.violet, color: C.ink, weight: 800 })
  return r
}, [
  r => { show(r.tbl); stagger(r.rowG.slice(0, 5), 200, glow); later(1200, () => stagger(r.rowG.slice(5), 250, glow)) },
  r => { show(r.cmp); glow(r.cmp) },
  r => { hide(r.cmp); show(r.rule); stagger(r.rowG.slice(5), 250, glow) },
])
sc3(10, () => {
  const r = {}; hd(10, 'step2')
  r.bw = bwin(['br20-design-system'], 'DESIGN_SYSTEM.html'); r.B = r.bw.S
  r.c1 = hl(r, r.B[0], [268, 100, 690, 160], '顏色、字級、間距集中管理', { col: OR, size: 30, below: true })
  r.paint = box(L, 120, 640, 1360, 150, '比喻：油漆色號\n說「品牌紅」，不說「#C8232C」。要換色，只改色號表一處', { size: 34, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 800 })
  r.ev = tip('AI 有沒有照做：設計文件裡會留下證據（寫死的色碼 0 筆）', { y: 806, size: 30, col: C.violet })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); later(400, () => only(r, r.c1)) },
  r => { only(r); show(r.paint); glow(r.paint) },
  r => { show(r.ev); glow(r.ev) },
])

// ════════════════════════════ Step 3 ════════════════════════════
chapter('Step 3', 'SDD：先文件，再程式', C.pink)
const EXA = { x: 270, y: 112, w: 1060, h: 770 }

sc3(11, () => {
  const r = {}; hd(11, 'step3')
  r.head = box(L, 70, 140, 1460, 110, 'SDD＝規格驅動開發：先文件，再程式', { size: 44, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.nodes = flowRow(290, [['PRD\n白話寫需求', C.teal], ['AI 找缺口\n你拍板', C.gold], ['SRS\n答應什麼', C.violet], ['設計文件\n＋圖', C.violet], ['任務\n清單', C.pink], ['程式\nAI 寫', C.coral]], { w: 220, gap: 25 })
  r.sync = box(L, 70, 430, 1460, 70, '程式改了，文件跟著改（Step 4 會看到）', { size: 30, fill: '#1c2f4a', stroke: C.violet, color: C.ink, weight: 800 })
  r.two = [['SRS', '這一版答應了什麼', C.violet], ['設計文件＋圖', '打算怎麼做；看圖就懂', C.violet]].map(([h, s, col], i) => card(315 + i * 490, 520, 465, 150, h, [s], col, { size: 30, ts: 38 }))
  r.cost = box(L, 70, 700, 1460, 130, '寫程式很便宜，改方向很貴\n文件先對了，程式才不會做白工', { size: 36, fill: C.card, stroke: C.coral, color: C.ink, weight: 900 })
  return r
}, [
  r => { show(r.head); glow(r.head) },
  r => { stagger(r.nodes, 300); later(2000, () => show(r.sync)) },
  r => { glow([r.nodes[2], r.nodes[3]]); stagger(r.two, 350) },
  r => { show(r.cost); glow(r.cost) },
])

sc3(12, () => {
  const r = {}; hd(12, 'step3 ・ 白話 PRD')
  const [a, b, c] = vsh(r, ['v5-prd-who', 'v5-prd-fields', 'v5-tech-top'])
  r.a1 = hl(r, a, 'who', '裝備管理員用自己的話寫的：沒有英文欄位名、沒有選擇題', { col: C.gold, below: true, size: 26 })
  r.b1 = hl(r, b, 'table', '第 3 節：12 項資料', { col: C.violet, above: true, size: 26 })
  r.b2 = hl(r, b, 'code', '品項編碼：只寫「系統自己編」', { col: OR, below: true, size: 26 })
  r.gap = box(L, 120, 640, 1360, 140, '沒寫清楚的，不用你先想到\nAI 照最小樣板的「釐清規矩」自己找 → 用選擇題問你', { size: 34, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.d1 = hl(r, c, 'who', '技術約定：資訊單位給 AI 的，你不用讀', { col: C.teal, below: true, size: 26 })
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.a1)) },
  r => { to(r, r.S[1]); only(r, r.b1); later(2500, () => only(r, r.b2)) },
  r => { only(r); show(r.gap); glow(r.gap) },
  r => { hide(r.gap); to(r, r.S[2]); only(r, r.d1) },
])

sc3(13, () => {
  const r = {}; hd(13, 'step3 ・ 實拍')
  r.E = ['v5-ex2-all', 'v5-ex3-deselect', 'v5-ex6-three', 'v5-ex7-done'].map(n => scr(n, fitF(n, EXA)))
  r.e1 = hl(r, r.E[0], [545, 335, 810, 560], '檔案總管：Ctrl+A 全選', { col: C.teal, above: true, size: 28 })
  r.e2 = hl(r, r.E[1], 'nm', '點掉自動產生的：node_modules', { col: C.red, below: true, size: 26 })
  r.e3 = hl(r, r.E[1], 'nuxt', '.nuxt（有 .output 也點掉）', { col: C.red, above: true, size: 26 })
  r.f1 = hl(r, r.E[2], 'prd', '三份文件：PRD', { col: C.gold, below: true, size: 24 })
  r.f2 = hl(r, r.E[2], 'tech', '技術約定', { col: C.gold, right: true, size: 24 })
  r.f3 = hl(r, r.E[2], 'tpl', '最小樣板（裡面有釐清規矩）', { col: C.gold, right: true, size: 24 })
  r.g1 = hl(r, r.E[3], 'prd', '都放進 my-equipment-app', { col: C.green, above: true, size: 26 })
  const [m, p, d] = vsh(r, ['v5-cc02-model-menu', 'v5-cc03-prompt-pasted', 'v5-cc04-reading'])
  r.m1 = hl(r, m, 'opus', 'Opus 5.5：寫文件要想得深', { col: C.gold, below: true, size: 28 })
  r.m2 = hl(r, m, [360, 438, 660, 28], 'effort：High（想多深）', { col: C.gold, above: true, size: 28 })
  r.p1 = hl(r, p, [353, 432, 679, 38], '第三行：PRD 沒寫清楚的，用選擇題逐題問我', { col: OR, above: true, size: 26 })
  r.d1 = hl(r, d, [340, 180, 700, 330], '先讀規矩、PRD、技術約定：不寫程式', { col: C.green, below: true, size: 26 })
  return r
}, [
  r => { show(r.E[0]); later(300, () => only(r, r.e1)); later(3200, () => { to({ S: r.E }, r.E[1]); only(r, r.e2, r.e3) }) },
  r => { to({ S: r.E }, r.E[2]); only(r, r.f1, r.f2, r.f3); later(4500, () => { to({ S: r.E }, r.E[3]); only(r, r.g1) }) },
  r => { only(r); hide(r.E); show(r.S[0]); later(300, () => only(r, r.m1)); later(3200, () => only(r, r.m2)) },
  r => { to(r, r.S[1]); only(r, r.p1); later(3800, () => { to(r, r.S[2]); only(r, r.d1) }) },
])

sc3(14, () => {
  const r = {}; hd(14, 'step3 ・ 實拍')
  const [a, b, c, d, SQ] = vsh(r, ['v5-cc06-q-first', 'v5-cc07a-q1-ans', 'v5-cc07b-q2', 'v5-cc07c-q1', 'v5-cc43-q1-ans'])
  r.a0 = hl(r, a, [361, 228, 203, 18], '白話選擇題：都是 PRD 沒寫清楚的', { col: C.gold, below: true, size: 26 })
  r.a1 = hl(r, a, [361, 294, 647, 59], '標「建議」＋一句理由', { col: C.green, below: true, size: 26 })
  r.b1 = hl(r, b, 'other', '建議不是你要的：選 Other，自己打 PW-GEN-001', { col: OR, above: true, size: 26 })
  r.c1 = hl(r, c, [361, 316, 606, 18], '狀態要不要先帶「正常」？', { col: OR, below: true, size: 26 })
  r.c2 = hl(r, c, [667, 316, 300, 18], '引用公司規矩：要帶值必須拍板', { col: C.gold, below: true, right: true, size: 24 })
  r.d1 = hl(r, d, [361, 264, 211, 17], '保管人電話收哪些格式？', { col: OR, below: true, size: 26 })
  r.d2 = hl(r, d, [361, 433, 647, 28], '選項裡有「拆成手機、市話兩欄」', { col: C.gold, above: true, size: 26 })
  r.n = tip('交文件前一共 13 題：都是 PRD 沒寫、它自己找出來的缺口', { y: 806, size: 28, col: C.teal })
  r.sq1 = hl(r, SQ, [361, 267, 230, 20], 'Q15：狀態可以怎麼改？', { col: OR, below: true, size: 26 })
  r.sq2 = hl(r, SQ, [361, 294, 647, 60], '選建議的：報廢了就回不去', { col: C.green, below: true, size: 26 })
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.a0)); later(2800, () => { zoom(r.S[0], [361, 294, 647, 59], { pad: 120, max: 1.6 }); only(r, r.a1) }) },
  r => { unzoom(r.S[0]); to(r, r.S[1]); zoom(r.S[1], 'other', { pad: 120, max: 1.6 }); only(r, r.b1) },
  r => { unzoom(r.S[1]); to(r, r.S[2]); zoom(r.S[2], [361, 316, 606, 70], { pad: 80, max: 1.6 }); only(r, r.c1); later(3000, () => only(r, r.c2)) },
  r => { unzoom(r.S[2]); to(r, r.S[3]); only(r, r.d1); later(2600, () => only(r, r.d2)); later(5200, () => { show(r.n); glow(r.n) }) },
  r => { hide(r.n); to(r, r.S[4]); only(r, r.sq1); later(2800, () => { zoom(r.S[4], [361, 267, 647, 90], { pad: 60, max: 1.6 }); only(r, r.sq2) }) },
])

sc3(15, () => {
  const r = {}; hd(15, 'step3 ・ 實拍')
  const [a] = vsh(r, ['v5-cc12-docs-q'])
  r.a1 = hl(r, a, [53, 287, 257, 22], '交了 4 個檔：程式一行都還沒寫', { lx: 560, col: C.green, size: 26 })
  r.a2 = hl(r, a, [53, 331, 257, 22], '', { col: C.green }); r.a3 = hl(r, a, [53, 485, 257, 22], '', { col: C.green })
  r.chk = box(L, 120, 640, 1360, 140, '它也建議：先看文件和圖，核完再說開工\n你核過，它才寫', { size: 36, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1, r.a2, r.a3)) },
  r => { show(r.chk); glow(r.chk) },
])

sc3(16, () => {
  const r = {}; hd(16, 'step3 ・ SRS')
  const [b, c, d] = vsh(r, ['v5-srs-decisions', 'v5-srs-decisions2', 'v5-srs-scope'])
  r.b1 = hl(r, b, 'table', '第 1 段：一題一列', { col: C.violet, above: true, size: 26 })
  r.b2 = hl(r, b, 'why', '理由：你寫的？還是 AI 建議的？', { col: C.gold, below: true, size: 24 })
  r.c1 = hl(r, c, 'q6', '第 6 題：狀態預設「正常」', { col: C.gold, below: true, size: 26 })
  r.d1 = hl(r, d, 'h', '第 2、3 段：做在哪、這一版不做什麼', { col: C.violet, below: true, size: 26 })
  r.must = tip('這三段你一定要核：不用看程式，就知道它答應了什麼', { y: 806, size: 30, col: C.gold })
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.b1)) },
  r => { only(r, r.b2); later(3000, () => { to(r, r.S[1]); only(r, r.c1) }) },
  r => { to(r, r.S[2]); only(r, r.d1) },
  r => { show(r.must); glow(r.must) },
])

sc3(17, () => {
  const r = {}; hd(17, 'step3 ・ 設計文件')
  const [a, b, c] = vsh(r, ['v5-design-files', 'v5-design-defaults', 'v5-design-evidence'])
  r.a1 = hl(r, a, 'copy', '5 個照範本複製改名', { col: C.violet, below: true, size: 26 })
  r.a2 = hl(r, a, 'share', '直接共用、沒改', { col: C.gold, above: true, size: 26 })
  r.b1 = hl(r, b, 'table', '只有狀態帶「正常」；分類、項目空白', { col: C.gold, below: true, size: 26 })
  r.c1 = hl(r, c, 'table', '遵守規矩的證據：先寫怎麼驗，做完再填', { col: C.green, above: true, size: 26 })
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.a1)); later(3000, () => only(r, r.a2)) },
  r => { to(r, r.S[1]); only(r, r.b1) },
  r => { to(r, r.S[2]); only(r, r.c1) },
])

// 圖的標題截圖很扁（1300×287）：瀏覽器外框照原比例縮放，不要拉長
function bwHead(name, url) { const m = META[name]; const h = Math.round(1360 * m.h / m.w) + 64; return bwin([name], url, { x: 120, y: 200, w: 1360, h, bar: 64 }) }
sc3(18, () => {
  const r = {}; hd(18, 'step3 ・ 五張圖')
  r.bw = bwHead('v5-diagn-1-head', 'DIAGRAMS-中心裝備物資.html'); r.B = r.bw.S
  r.h0 = hl(r, r.B[0], [52, 120, 1140, 160], '每張圖上面都有「怎麼看」，下面一題「看完你要答得出來」', { col: OR, below: true, size: 26 })
  r.D = ['v5-diag-1-svg', 'v5-diag-2-svg', 'v5-diag-3-svg', 'v5-diag-4-svg', 'v5-diag6-5-svg'].map(n => scr(n, fitF(n, { x: 70, y: 116, w: 1460, h: 680 })))   // ⑤ 改成裝備狀態圖後重拍
  r.p1 = hl(r, r.D[0], [296, 40, 412, 1036], '① 使用案例圖：管理人員能做的 8 件事', { col: OR, right: true, size: 26 })
  r.p2 = hl(r, r.D[1], [751, 213, 1094, 128], '② 零件圖：橘色照範本複製', { col: OR, below: true, right: true, size: 26 })
  r.p3 = hl(r, r.D[1], [245, 213, 474, 128], '綠色直接共用', { col: C.green, below: true, size: 26 })
  r.p4 = hl(r, r.D[2], [339, 337, 682, 614], '③ 資料圖：一筆裝備記 12 項', { col: OR, right: true, size: 26 })
  r.p5 = hl(r, r.D[2], [339, 442, 682, 70], '分類、項目：新增時空白', { col: C.gold, right: true, size: 24 })
  r.p6 = hl(r, r.D[3], [143, 977, 1653, 385], '④ 流程圖：淡紅＝檢查沒過，留在原頁', { col: C.red, above: true, size: 26 })
  r.p7 = hl(r, r.D[3], [459, 1373, 1337, 644], '淡綠＝全部通過，才存', { col: C.green, above: true, size: 26 })
  r.p8 = hl(r, r.D[4], [863, 78, 150, 55], '已報廢：回不去', { col: C.red, size: 26 })
  r.p9 = hl(r, r.D[4], [225, 168, 433, 84], '正常 ↔ 維修中：可以互換', { col: C.green, below: true, size: 26 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.h0)) },
  r => { only(r); hide(r.bw.g); show(r.D[0]); later(300, () => only(r, r.p1)); later(3600, () => { to({ S: r.D }, r.D[1]); only(r, r.p2, r.p3) }) },
  r => { to({ S: r.D }, r.D[2]); only(r, r.p4, r.p5); later(4600, () => { to({ S: r.D }, r.D[3]); only(r, r.p6, r.p7) }) },
  r => { to({ S: r.D }, r.D[4]); only(r, r.p9); later(3000, () => only(r, r.p8)) },
])

// 圖 ① 的 8 個圓角框：在框的右邊依序蓋 1～8 號（v5-diag-1-svg 的座標）
const UC8 = [[700, 88], [715, 228], [748, 366], [642, 488], [622, 590], [645, 750], [637, 890], [681, 1030]]
function numBadges(g, pts, o = {}) {
  const R = o.r || 34, size = (o.size || 44) * g.k
  return pts.map(([x, y], i) => {
    const q = rb(g, [x - R, y - R, 2 * R, 2 * R]); const h = grp(g.inner)
    mk('circle', { cx: q.x + q.w / 2, cy: q.y + q.h / 2, r: q.w / 2, fill: C.gold, stroke: C.bg, 'stroke-width': 4 }, h)
    T(h, q.x + q.w / 2, q.y + q.h / 2 + size * 0.36, String(i + 1), { size, anchor: 'middle', weight: 900, fill: C.bg })
    return h
  })
}

sc3(19, () => {
  const r = {}; hd(19, 'step3 ・ 看圖抓到落差')
  r.bw = bwHead('v5-diagn-1-head', 'DIAGRAMS-中心裝備物資.html#uc'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], [50, 80, 590, 24], '說明寫：能做 7 件事', { col: C.red, below: true, size: 16 })
  r.svg = scr('v5-diag-1-svg', fitF('v5-diag-1-svg', { x: 70, y: 116, w: 1460, h: 680 }))
  r.nb = numBadges(r.svg, UC8)
  r.cnt = tip('圖上數到 8 件　·　說明寫 7 件　→　對不起來', { y: 806, size: 32, col: C.red })
  const [a, b] = vsh(r, ['v5-cc13-diagfix-ask', 'v5-cc13-diagfix-done'])
  r.a1 = hl(r, a, 'input', '一句話：看到什麼、期望什麼', { col: OR, above: true, size: 26 })
  r.b1 = hl(r, b, [340, 330, 700, 130], '一句話叫它改：改好了，還說原因', { col: C.green, below: true, size: 26 })
  r.t = tip('這就是圖的用處：看圖就抓得到錯，不用讀程式', { y: 806, size: 30, col: C.gold })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); zoom(r.B[0], [50, 70, 600, 44], { pad: 30, max: 2.2 }); later(400, () => only(r, r.h1)) },
  r => { only(r); unzoom(r.B[0]); hide(r.bw.g); show(r.svg); later(3000, () => stagger(r.nb, 1100, e => { show(e); glow(e) })); later(3000 + 1100 * 8, () => { show(r.cnt); glow(r.cnt) }) },
  r => { hide([r.svg, r.cnt]); show(r.S[0]); later(300, () => only(r, r.a1)); later(3800, () => { to(r, r.S[1]); only(r, r.b1) }) },
  r => { only(r); show(r.t); glow(r.t) },
])

sc3(20, () => {
  const r = {}; hd(20, 'step3 ・ 實拍')
  const [b, c, d, e] = vsh(r, ['v5-cc15-model-menu', 'v5-cc15-go-typed', 'v5-cc16-build-start', 'v5-cc18-q1'])
  r.b1 = hl(r, b, 'sonnet', '開工前：換 Sonnet 5.5', { col: C.gold, below: true, size: 28 })
  r.c1 = hl(r, c, 'input', '打「開工」→ 送出', { col: C.green, above: true, size: 28 })
  r.tea = box(L, 1080, 64, 400, 46, '這次實拍：約 8 分鐘', { size: 26, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.e1 = hl(r, e, 'rec', '選「我自己開網頁驗收」', { col: C.green, below: true, size: 26 })
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.b1)) },
  r => { to(r, r.S[1]); only(r, r.c1); later(3000, () => { to(r, r.S[2]); only(r); show(r.tea) }) },
  r => { to(r, r.S[3]); only(r, r.e1) },
])

sc3(21, () => {
  const r = {}; hd(21, 'step3 ・ 驗收')
  const [a] = vsh(r, ['v5-vs-dev3101'])
  r.a1 = hl(r, a, 'local', 'pnpm dev --port 3101 → 開它給的網址', { col: C.gold, below: true, size: 26 })
  r.bw = bwin(['v5-ea01-list', 'v5-ea04-item-open', 'v5-ea05-code', 'v5-ea06-validation', 'v5-ea07-delete'], 'localhost:3101/equipment/crud'); r.B = r.bw.S
  r.b1 = hl(r, r.B[0], 'count', '共 24 筆', { col: C.green, below: true, size: 28 })
  r.c1 = hl(r, r.B[1], 'list', '先選分類，項目才出現', { col: OR, below: true, size: 26 })
  r.c2 = hl(r, r.B[2], 'code', '品項編碼那格：馬上有號碼', { col: OR, below: true, size: 26 })
  r.d1 = hl(r, r.B[3], 'toast', '空表單儲存：紅字＋提示，不跳走', { col: C.red, above: true, right: true, size: 26 })
  r.e1 = hl(r, r.B[4], 'dialog', '刪除要先確認', { col: C.red, below: true, size: 28 })
  r.mob = scr('v5-ea08-mobile', fitF('v5-ea08-mobile', { x: 560, y: 120, w: 480, h: 700 }))
  r.mt = tip('縮到手機寬度：表格變卡片', { y: 830, size: 28, col: C.teal })
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.a1)) },
  r => { only(r); hide(r.S[0]); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.b1)); later(2600, () => { burl(r.bw, 'localhost:3101/equipment/crud/new'); swap(r.B, r.B[1]); only(r, r.c1) }); later(5000, () => { swap(r.B, r.B[2]); only(r, r.c2) }) },
  r => { swap(r.B, r.B[3]); only(r, r.d1); later(2600, () => { burl(r.bw, 'localhost:3101/equipment/crud'); swap(r.B, r.B[4]); only(r, r.e1) }); later(5000, () => { only(r); hide(r.bw.g); show([r.mob, r.mt]) }) },
])

sc3(22, () => {
  const r = {}; hd(22, 'step3 ・ 小落差附畫面')
  r.bw = bwin(['v5-gap-before-wrap', 'v5-gap-after-wrap', 'v5-gap2-before-dash'], 'localhost:3101/equipment/crud'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'keeper', '名字被拆成兩行', { col: C.red, below: true, size: 26 })
  r.a2 = hl(r, r.B[0], 'date', '日期也斷行', { col: C.red, above: true, right: true, size: 24 })
  r.a3 = hl(r, r.B[0], 'status2', '', { col: C.red })
  r.k = keys(560, 300, ['Win', 'Shift', 'S'], { size: 40 })
  r.kt = tip('截圖：Win+Shift+S 框起來 → 輸入框 Ctrl+V → 一句話：看到什麼、期望什麼', { y: 806, size: 28, col: C.teal })
  const [b] = vsh(r, ['v5-cc19-gap1-ask'])
  r.b1 = hl(r, b, 'img', '圖貼上了', { col: C.green, below: true, size: 26 })
  r.b2 = hl(r, b, 'input', '再打一句：看到什麼、期望什麼', { col: OR, above: true, size: 26 })
  r.d1 = hl(r, r.B[1], 'keeper', '修改後：一行顯示', { col: C.green, below: true, size: 26 })
  r.e1 = hl(r, r.B[2], 'keeperEmpty', '保管人空白：長橫', { col: C.gold, above: true, size: 24 })
  r.e2 = hl(r, r.B[2], 'dateEmpty', '日期空白：短橫', { col: C.red, below: true, right: true, size: 24 })
  r.pain = box(L, 120, 300, 1360, 220, '一次講一件・問題不大\n但你得一直坐在電腦前面陪它\n→ 這段來回，Step 4 交出去', { size: 40, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); zoom(r.B[0], [1060, 380, 420, 200], { pad: 40, max: 1.8 }); later(300, () => only(r, r.a1, r.a2, r.a3)) },
  r => { only(r); unzoom(r.B[0]); hide(r.bw.g); show([r.k, r.kt]); later(3000, () => { hide([r.k, r.kt]); show(r.S[0]); later(300, () => only(r, r.b1, r.b2)) }) },
  r => { only(r); hide(r.S[0]); show(r.bw.g); swap(r.B, r.B[1]); zoom(r.B[1], [1060, 380, 420, 200], { pad: 40, max: 1.8 }); later(300, () => only(r, r.d1)); later(3200, () => { swap(r.B, r.B[2]); zoom(r.B[2], 'row', { pad: 30, max: 1.6 }); only(r, r.e1, r.e2) }) },
  r => { only(r); hide(r.bw.g); show(r.pain); glow(r.pain) },
])

// ════════════════════════════ Step 4 ════════════════════════════
chapter('Step 4', 'LOOP＋對抗審查', C.violet)
const REP = 'my-equipment-app/loop/LOOP-REPORT.html'

// 報告裡的「修改前／修改後」：先框兩張，再放大修改前、再放大修改後（字卡放上面蓋住網址列，下緣常有重點）
function fixPair(r, g, tipText, o = {}) {
  const bf = hl(r, g, o.bf || 'before', '修改前', { col: C.red, above: true, size: 26 })
  const af = hl(r, g, o.af || 'after', '修改後', { col: C.green, above: true, size: 26 })
  const t = tip(tipText, { y: 116, size: 30, col: C.gold })
  return { bf, af, t }
}
function fixShow(r, g, p, o = {}) {
  only(r, p.bf, p.af); show(p.t); glow(p.t)
  later(o.t1 ?? 2400, () => { only(r); zoom(g, o.zb || 'before', { pad: 12, max: 2 }) })
  later(o.t2 ?? 5600, () => zoom(g, o.za || 'after', { pad: 12, max: 2 }))
}

sc3(23, () => {
  const r = {}; hd(23, 'step4')
  r.old = card(70, 140, 700, 300, '一問一答＝主管手把手帶新人', ['你問一句，它做一步', '每一步都要交代、要盯', '時間全耗在教'], C.coral, { size: 32, ts: 36, lh: 56 })
  r.neu = card(830, 140, 700, 300, '規矩＋範本＋測試', ['harness＝公司規定', '範本＝示範樣本', 'E2E 測試＝驗收標準'], C.green, { size: 32, ts: 36, lh: 56 })
  r.sub = box(L, 70, 470, 1460, 120, '找另一個 AI，取代「來回要 AI 修」的你 ＝ 對抗審查（找碴、不准誇獎）', { size: 40, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  const g = grp(L); r.flow = g
  const steps = [['你下一個指令', C.gold], ['AI 做＋自己驗', C.teal], ['另一個 AI 挑錯', C.violet], ['交報告給你', C.green]]
  steps.forEach(([t, col], i) => { const x = 70 + i * 375; R(g, x, 640, 330, 110, { fill: C.card, stroke: col, sw: 4 }); T(g, x + 165, 708, t, { size: 34, anchor: 'middle', weight: 900, fill: col }); if (i) T(g, x - 22, 708, '→', { size: 44, anchor: 'middle', fill: C.mut }) })
  return r
}, [
  r => { show(r.old); glow(r.old) },
  r => { show(r.neu); glow(r.neu) },
  r => { show(r.sub); glow(r.sub) },
  r => { show(r.flow); glow(r.flow) },
])

sc3(24, () => {
  const r = {}; hd(24, 'step4')
  const g = grp(L); r.flow = g
  const nodes = [['AI 改程式', 230, C.teal], ['跑 7 條 E2E 測試', 620, C.gold], ['全綠？', 1010, C.green]]
  nodes.forEach(([t, x, col]) => { R(g, x - 160, 160, 320, 100, { fill: C.card, stroke: col, sw: 4 }); T(g, x, 222, t, { size: 32, anchor: 'middle', weight: 900, fill: col }) })
  T(g, 425, 220, '→', { size: 48, anchor: 'middle', fill: C.mut }); T(g, 815, 220, '→', { size: 48, anchor: 'middle', fill: C.mut })
  R(g, 1240, 160, 300, 100, { fill: '#173a2a', stroke: C.green, sw: 4 }); T(g, 1390, 203, '是 → 另一個 AI 挑錯', { size: 28, anchor: 'middle', weight: 900, fill: C.green }); T(g, 1390, 240, '再交報告', { size: 24, anchor: 'middle' }); T(g, 1180, 220, '→', { size: 48, anchor: 'middle', fill: C.mut })
  mk('path', { d: 'M1010,260 v60 H230 v-60', fill: 'none', stroke: C.red, 'stroke-width': 5, 'marker-end': 'url(#ah-red)' }, g)
  T(g, 620, 350, '否（有紅燈）：AI 自己判斷原因、修好、再跑', { size: 28, anchor: 'middle', weight: 800, fill: C.red })
  r.e2e = box(L, 70, 390, 1460, 100, '閱卷機＝7 條 E2E 測試：程式自己開瀏覽器，照使用者的順序點一遍，再判定對不對', { size: 29, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.rules = [['鐵律一：不准偷改標準答案', '不准改測試、不准放寬標準', C.red], ['鐵律二：同一問題修兩次沒好就停', '停下來回報，交給人判斷', C.coral]].map(([h, s, col], i) => card(70 + i * 740, 520, 720, 160, h, [s], col, { size: 28, ts: 34 }))
  r.file = box(L, 70, 520, 440, 310, '規矩檔\nLOOP-規矩.md\n\n鐵律、埠、審查方式\n產出格式、模型', { size: 28, fill: C.card, stroke: C.violet, color: C.ink, weight: 800 })
  r.outs = [['LOOP-LOG.md', '流水紀錄（機器看）', C.mut], ['LOOP-REPORT.html', '結果報告（人看、有圖）', C.gold], ['playwright-report', '測試報告', C.green], ['SRS・DESIGN・圖', '文件同步', C.violet]].map(([h, s, col], i) => card(540 + (i % 2) * 500, 520 + Math.floor(i / 2) * 160, 480, 145, h, [s], col, { size: 24, ts: 28, lh: 40 }))
  r.two = box(L, 70, 520, 1460, 220, '規矩檔還寫了兩件事\n修好的每一條：附修改前、修改後的圖\n要你裁決的題目：附當下的畫面', { size: 38, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { show(r.flow); glow(r.flow) },
  r => { show(r.e2e); glow(r.e2e) },
  r => stagger(r.rules, 500),
  r => { hide(r.rules); show(r.file); glow(r.file); stagger(r.outs, 350) },
  r => { hide([r.file, ...r.outs]); show(r.two); glow(r.two) },
])

sc3(25, () => {
  const r = {}; hd(25, 'step4')
  const [a, b] = vsh(r, ['v5-cc30-loop-pasted', 'v5-loop-log'])
  r.a1 = hl(r, a, 'input', 'LOOP prompt：4 行，第一行就說照規矩檔做', { col: C.violet, above: true, size: 26 })
  r.a2 = hl(r, a, 'model', 'Sonnet 5.5：寫程式用便宜的', { col: C.gold, below: true, size: 24 })
  r.b1 = hl(r, b, [128, 174, 775, 24], '3100 被占 → AI 自己改用 3101，沒動別人的程式', { col: C.green, below: true, size: 26 })
  r.b2 = hl(r, b, [128, 328, 262, 24], '第 1 輪：7 passed，全綠', { col: C.green, below: true, size: 26 })
  r.hands = tip('送出之後就不用管了：AI 自己開網頁、跑測試、判斷原因', { y: 806, size: 28, col: C.teal })
  r.red = tip('有紅也不急：先看截圖、查 PRD，找到原因再動手', { y: 806, size: 28, col: C.gold })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1, r.a2)) },
  r => { to(r, r.S[1]); only(r, r.b1); show(r.hands) },
  r => { hide(r.hands); only(r, r.b2); later(2600, () => { show(r.red); glow(r.red) }) },
])

sc3(26, () => {
  const r = {}; hd(26, 'step4')
  const [a, b] = vsh(r, ['v5-cc31-t0300', 'v5-cc31-t0540'])
  r.a0 = hl(r, a, [477, 524, 64, 21], '1 agent：審查的 AI（Opus 5.5）正在工作', { col: C.violet, above: true, size: 26 })
  r.a1 = hl(r, a, [365, 205, 665, 117], '截圖腳本：Playwright 逐頁截圖、實際點按鈕（只看，不改 App）', { col: C.teal, below: true, size: 24 })
  r.b1 = hl(r, b, [365, 290, 665, 117], '審查清單：挑到的錯一條一條列', { col: C.teal, below: true, size: 26 })
  r.bw = bwin(['v5-rep-review'], REP + '#review'); r.B = r.bw.S
  r.c1 = hl(r, r.B[0], [86, 88, 1066, 58], '挑到 12 條：App 7 條、測試 5 條', { col: OR, below: true, size: 28 })
  r.min = box(L, 1080, 64, 400, 46, '這次實拍：約半小時', { size: 24, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a0)) },
  r => { only(r, r.a1); later(4200, () => { to(r, r.S[1]); only(r, r.b1) }) },
  r => { only(r); hide(r.S); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.c1)); show(r.min) },
])

sc3(27, () => {
  const r = {}; hd(27, 'step4 ・ 修改前後')
  r.bw = bwin(['v5-rep-review', 'v5-rep-fix1', 'v5-rep-fix2'], REP + '#review'); r.B = r.bw.S
  r.c1 = hl(r, r.B[0], [86, 88, 1066, 58], 'App 7 條、測試 5 條', { col: OR, below: true, size: 28 })
  r.p1 = fixPair(r, r.B[1], '修改前：停在第 2 頁　→　修改後：回到第 1 頁')
  r.p2 = fixPair(r, r.B[2], '修改前：多出兩筆　→　修改後：只多一筆')
  r.exam = box(L, 120, 300, 1360, 260, '比喻：自己改自己的考卷\n分數一定偏高，所以另開一個更強的 AI 來挑錯', { size: 46, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.c1)) },
  r => { burl(r.bw, REP + '#fixed'); swap(r.B, r.B[1]); fixShow(r, r.B[1], r.p1, { t1: 4200, t2: 7600 }) },
  r => { unzoom(r.B[1]); hide(r.p1.t); swap(r.B, r.B[2]); fixShow(r, r.B[2], r.p2, { t1: 2000, t2: 4600 }) },
  r => { unzoom(r.B[2]); hide(r.p2.t); only(r); hide(r.bw.g); show(r.exam); glow(r.exam) },
])

sc3(28, () => {
  const r = {}; hd(28, 'step4 ・ 裁決附畫面')
  const [a, b] = vsh(r, ['v5-cc35-loop-done', 'v5-cc37-q2-ans'])
  r.a1 = hl(r, a, [355, 225, 675, 240], '要動全站共用的檔：停下來出選擇題', { col: C.gold, above: true, size: 26 })
  r.bw = bwin(['v5-rep-decide', 'v5-rep-q1', 'v5-rep-q3', 'v5-rep-fix4'], REP + '#decide'); r.B = r.bw.S
  r.d1 = hl(r, r.B[0], [86, 86, 645, 28], '每一題都附當下的畫面', { col: OR, above: true, right: true, size: 26 })
  r.d2 = hl(r, r.B[0], [108, 290, 560, 350], '', { col: OR })
  r.q1a = hl(r, r.B[1], [745, 68, 392, 62], '只剩 IT：後面的字不見', { col: C.red, below: true, right: true, size: 26 })
  r.q1b = hl(r, r.B[1], [216, 226, 140, 30], '', { col: C.red })
  r.q3a = hl(r, r.B[2], [128, 258, 490, 88], '手機寬度：三顆字都斷成兩行', { col: C.red, below: true, size: 26 })
  r.b1 = hl(r, b, [361, 301, 663, 43], '建議：三條都修，但會動到共用元件', { col: C.gold, above: true, size: 26 })
  r.b2 = hl(r, b, [364, 350, 245, 38], '我選：只修手機選單斷行（影響最小）', { col: C.green, below: true, size: 26 })
  r.adv = box(L, 120, 300, 1360, 200, '建議的不一定要選\n動到共用的，想清楚影響範圍再拍板', { size: 44, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.p4 = fixPair(r, r.B[3], 'Q1　修改前：框裡只剩 IT　→　修改後：完整的 IT-LAP')
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.a1)); later(3600, () => { only(r); hide(r.S[0]); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.d1, r.d2)) }) },
  r => { swap(r.B, r.B[1]); only(r, r.q1a, r.q1b) },
  r => { swap(r.B, r.B[2]); only(r, r.q3a); later(3600, () => { only(r); hide(r.bw.g); show(r.S[1]); later(300, () => only(r, r.b1)); later(3300, () => only(r, r.b2)) }) },
  r => { only(r); hide(r.S); show(r.adv); glow(r.adv); later(4200, () => { hide(r.adv); show(r.bw.g); burl(r.bw, REP + '#fixed'); swap(r.B, r.B[3]); fixShow(r, r.B[3], r.p4, { t1: 1800, t2: 4000 }) }) },
])

sc3(29, () => {
  const r = {}; hd(29, 'step4 ・ 四樣產出')
  const [a] = vsh(r, ['v5-loop-log2'])
  r.a1 = hl(r, a, [100, 85, 940, 105], 'LOOP-LOG.md：每一輪做了什麼，你的裁決也記在裡面', { col: C.teal, below: true, size: 26 })
  r.bw = bwin(['v5-rep-top', 'v5-pw-report', 'v5-rep2-q5'], REP); r.B = r.bw.S
  r.b1 = hl(r, r.B[0], [86, 136, 1068, 112], '一打開就是結論', { col: OR, below: true, size: 28 })
  r.c1 = hl(r, r.B[1], 'pass', 'Playwright 測試報告：7 條，每一條點得開', { col: C.green, below: true, size: 26 })
  r.d1 = hl(r, r.B[2], [528, 12, 112, 34], '講測試：交給講師', { col: C.gold, below: true, size: 26 })
  r.d2 = hl(r, r.B[2], [108, 98, 640, 30], '', { col: C.red })
  r.only = tip('看完再照報告上的網址自己點一遍：綠燈不等於做對', { y: 806, size: 30, col: C.gold })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1)) },
  r => { only(r); hide(r.S[0]); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.b1)) },
  r => { burl(r.bw, 'step4_loop_e2e/e2e/playwright-report/index.html'); swap(r.B, r.B[1]); only(r, r.c1) },
  r => { burl(r.bw, REP); swap(r.B, r.B[2]); only(r, r.d1, r.d2); later(3600, () => { show(r.only); glow(r.only) }) },
])

sc3(30, () => {
  const r = {}; hd(30, 'step4 ・ 文件同步')
  r.q = box(L, 120, 330, 1360, 200, '程式改了，文件有沒有跟著改？', { size: 56, fill: C.card, stroke: C.violet, color: C.ink, weight: 900 })
  const [b, c] = vsh(r, ['v5-srs-loopmark', 'v5-design-loopmark'])
  r.bw = bwin(['v5-rep-docs'], REP); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'h', '報告第 7 節：文件同步', { col: OR, size: 26, below: true })
  r.b1 = hl(r, b, [488, 250, 505, 76], 'SRS：標上「step4 LOOP 後」', { col: C.gold, below: true, right: true, size: 28 })
  r.c1 = hl(r, c, [628, 250, 360, 68], '設計文件也標上', { col: C.gold, below: true, size: 28 })
  r.dish = box(L, 120, 330, 1360, 220, '菜改了，菜單跟著改\n下一個人接手，看文件就知道現在的程式長什麼樣子', { size: 40, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { show(r.q); glow(r.q) },
  r => { hide(r.q); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.a1)); later(3600, () => { hide(r.bw.g); only(r); show(r.S[0]); later(300, () => only(r, r.b1)) }); later(7000, () => { to(r, r.S[1]); only(r, r.c1) }) },
  r => { only(r); hide(r.S); show(r.dish); glow(r.dish) },
])

sc3(31, () => {
  const r = {}; hd(31, 'step4 ・ 下次怎麼做')
  r.nodes = flowRow(200, [['你寫\n白話 PRD', C.teal], ['AI 找缺口\n你拍板', C.gold], ['SRS・設計\n文件・圖', C.violet], ['你核過', C.gold], ['備好測試\nLOOP 測修＋審查', C.coral], ['看報告\n拍板驗收', C.green]], { w: 225, gap: 20, h: 130 })
  r.tea = box(L, 120, 400, 1360, 200, '你不用坐在電腦前面陪它\n去泡杯茶，回來看報告、拍板、驗收', { size: 44, fill: '#173a2a', stroke: C.green, color: C.green, weight: 900 })
  r.p2 = card(70, 640, 1460, 200, '備案：找別家 AI（例如 Codex）再審一次', ['工具不能開子代理時，或想要第二意見時', '貼手冊 step4 的備案 prompt'], C.teal, { size: 28, ts: 34 })
  return r
}, [
  r => stagger(r.nodes.slice(0, 2), 400),
  r => stagger(r.nodes.slice(2, 6), 350),
  r => { show(r.tea); glow(r.tea) },
  r => { show(r.p2); glow(r.p2) },
])

// ════════════════════════════ Step 5 ════════════════════════════
chapter('Step 5', '回公司怎麼用', C.green)

sc3(32, () => {
  const r = {}; hd(32, 'step5')
  r.v = scr('hb-step5-value', fitF('hb-step5-value', { x: 70, y: 125, w: 1460, h: 600 })); r.S = [r.v]
  r.steps = [['把四份規矩帶進你的專案', ['改成你們公司的', '色票、命名、禁止事項']], ['把最成熟的頁面整理成範本', ['分出「複製區」', '和「共用區」']], ['新需求都走 SDD', ['規格 → 選擇題 → 文件', '→ LOOP → 報告']]].map(([h, s], i) => card(70 + i * 495, 150, 465, 230, (i + 1) + '. ' + h, s, [C.teal, C.gold, C.coral][i], { size: 30, ts: 30, lh: 48 }))
  r.s6 = tip('課後驗收題：step6_survey，一個人做一個課程回饋問卷，並發布上線', { y: 440, size: 30, col: C.green })
  return r
}, [
  r => { show(r.v); glow(r.v) },
  r => { hide(r.v); show(r.steps[0]) },
  r => { show([r.steps[1], r.steps[2]]) },
  r => { show(r.s6); glow(r.s6) },
])
sc3(33, () => {
  const r = {}; hd(33, '總結')
  const L4 = [['範本給骨架，harness 給規矩', C.teal], ['SDD 先文件再程式，程式改了文件跟著改', C.violet], ['LOOP 讓 AI 自己驗，再請另一個 AI 挑錯', C.coral], ['最後由你拍板、由你驗收', C.green]]
  r.rows = L4.map(([a, col], i) => { const g = grp(L); const y = 150 + i * 175; R(g, 70, y, 1460, 150, { fill: C.card, stroke: col, sw: 5 })
    mk('circle', { cx: 150, cy: y + 75, r: 46, fill: col }, g); T(g, 150, y + 92, String(i + 1), { size: 46, anchor: 'middle', weight: 900, fill: C.bg })
    T(g, 230, y + 92, a, { size: 46, weight: 900 }); return g })
  return r
}, [
  r => { show(r.rows[0]); glow(r.rows[0]) },
  r => { show(r.rows[1]); glow(r.rows[1]) },
  r => { show(r.rows[2]); glow(r.rows[2]) },
  r => { show(r.rows[3]); glow(r.rows[3]) },
])
