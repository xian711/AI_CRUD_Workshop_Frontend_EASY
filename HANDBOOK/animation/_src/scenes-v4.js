// ============================================================
// AI CRUD 工作坊 EASY 版：手把手教學動畫 第四版（SDD＝規格驅動開發；文件＝SRS＋設計文件＋圖；LOOP 交紀錄、報告、測試報告）
// 講稿：tts-audition/script_v4.py → window.__script；配音 → window.__audio
// 兩人分段：小芸（Sulafat）講方法和觀念，阿哲（Sadaltager）講實拍示範。指令只放在畫面字卡。
// 畫面：2026-10-04～07 在 Windows 11 實拍（VS Code 繁中介面＋Claude Code、PowerShell、Chrome）。Step 3 文件用 Opus 5.5、寫程式用 Sonnet 5.5。
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
  r => { hide(r.pre); stagger(r.three, 350) },
  r => { hide(r.three); show([r.S[0], r.k1]); later(500, () => only(r, r.a1)) },
  r => { hide(r.k1); to(r, r.S[1]); only(r, r.b1) },
  r => { to(r, r.S[2]); show(r.k3); only(r, r.c1) },
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
  r.bw = bwin(['br10-noh', 'br12-noh-added', 'br14-wh-empty-submit'], 'no-harness.html'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'blood', '一打開就選好「A」', { col: C.red, below: true, size: 30 })
  r.a2 = hl(r, r.B[1], 'row', '血型存成 A，完全不檢查', { col: C.red, below: true, size: 30 })
  r.b1 = hl(r, r.B[2], 'bloodErr', '沒選血型 → 擋下來', { col: OR, below: true, size: 30, pad: 6 })
  r.bag = tip('哪些欄位錯不起、要怎麼檢查——這些就是要放進滷包的規矩', { y: 806, size: 30, col: C.gold })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); zoom(r.B[0], 'blood', { pad: 160, max: 1.8 }); only(r, r.a1) },
  r => { unzoom(r.B[0]); swap(r.B, r.B[1]); only(r, r.a2) },
  r => { burl(r.bw, 'with-harness.html'); swap(r.B, r.B[2]); only(r, r.b1) },
  r => { only(r); show(r.bag); glow(r.bag) },
])

// ════════════════════════════ Step 2 ════════════════════════════
chapter('Step 2', 'harness：給 AI 的規矩', C.teal)

sc3(7, () => {
  const r = {}; hd(7, 'step2')
  const [a] = vsh(r, ['vs17-pnpm-dev'])
  r.a1 = hl(r, a, 'url', 'http://localhost:3100/', { col: C.green, below: true })
  r.k = cmdCard(120, 660, 1360, ['cd step2_speedrun_kit/2.1_sample_app/sample-app', 'pnpm install', 'pnpm dev'], '在教材資料夾的終端機（pnpm dev 這個視窗要一直開著）', { size: 24 })
  r.bw = bwin(['br30-list', 'br37-delete-confirm', 'br42b-export-all'], 'localhost:3100/template/crud'); r.B = r.bw.S
  r.b1 = hl(r, r.B[0], 'table', '人員管理：新增、編輯、刪除、篩選、匯出', { col: OR, size: 28, above: true })
  r.b2 = hl(r, r.B[1], 'dialog', '刪除前先確認', { col: C.red, size: 28, below: true })
  r.b3 = hl(r, r.B[2], 'toast', '匯出全部 24 筆，不是只有這一頁', { col: OR, size: 26, above: true, right: true, pad: 18 })
  r.ans = tip('範本＝AI 做新模組時，要照著抄的標準答案', { y: 806, size: 32, col: C.gold })
  return r
}, [
  r => { show([r.S[0], r.k]); later(500, () => only(r, r.a1)) },
  r => { hide([r.S[0], r.k]); only(r); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.b1)) },
  r => { swap(r.B, r.B[1]); only(r, r.b2); later(3200, () => { swap(r.B, r.B[2]); only(r, r.b3) }) },
  r => { show(r.ans); glow(r.ans) },
])

sc3(8, () => {
  const r = {}; hd(8, 'step2')
  const [a, b] = vsh(r, ['vs21-harness-files', 'vs22b-claude-md-wide'])
  r.a1 = hl(r, a, 'sampleApp', 'sample-app 最上層', { lx: 560 })
  r.a2 = hl(r, a, [53, 331, 257, 22], '使用說明', { lx: 560, col: C.gold })
  r.a3 = hl(r, a, [53, 419, 257, 66], 'CLAUDE.md・CODE-RULES・design-system-summary', { lx: 560, col: C.gold, size: 24 })
  r.b1 = hl(r, b, [52, 60, 1012, 40], 'CLAUDE.md：總綱（技術、檔案地圖、10 條程式規則）', { below: true, size: 28 })
  r.c1 = hl(r, a, [53, 441, 257, 44], 'CODE-RULES：細則　·　design-system-summary：顏色和間距', { lx: 560, col: C.teal, size: 24, below: true })
  r.c2 = null
  r.c3 = hl(r, a, 'guide', '使用說明：怎麼複製範本開新模組', { lx: 560, col: C.teal })
  r.who = [['寫給 AI 讀', '你不用逐條讀懂', C.teal], ['人負責確認', '規矩寫得對不對', C.gold]].map(([h, s, col], i) => card(120 + i * 690, 640, 670, 150, h, [s], col, { size: 30, ts: 36 }))
  r.warn = tip('規矩寫錯，AI 會照著錯，而且錯得又快又整齊', { y: 806, size: 32, col: C.coral })
  return r
}, [
  r => { show(r.S[0]); later(500, () => only(r, r.a1, r.a2, r.a3)) },
  r => { to(r, r.S[1]); only(r, r.b1) },
  r => { to(r, r.S[0]); only(r, r.c1, r.c3) },
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

sc3(11, () => {
  const r = {}; hd(11, 'step3')
  r.head = box(L, 70, 140, 1460, 110, 'SDD＝規格驅動開發：先文件，再程式', { size: 44, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.nodes = flowRow(290, [['PRD\n寫需求', C.teal], ['選擇題\n你拍板', C.gold], ['SRS\n答應什麼', C.violet], ['設計文件\n＋圖', C.violet], ['任務\n清單', C.pink], ['程式\nAI 寫', C.coral]], { w: 220, gap: 25 })
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
  const r = {}; hd(12, 'step3')
  const [a, b] = vsh(r, ['vs29-prd-fields', 'vs30-prd-decisions'])
  r.a1 = hl(r, a, 'h2', '第 2 節：濃縮成 12 欄，一頁看完', { below: true })
  r.b1 = hl(r, b, 'h2', '第 5 節：三個決定留給你', { col: C.gold, below: true })
  r.you = tip('刪除補不補・匯出做不做・編碼簡不簡化——由你拍板，不是 AI', { y: 806, size: 30, col: C.gold })
  return r
}, [
  r => { show(r.S[0]); later(500, () => only(r, r.a1)) },
  r => { to(r, r.S[1]); only(r, r.b1) },
  r => { show(r.you); glow(r.you) },
])

sc3(13, () => {
  const r = {}; hd(13, 'step3')
  const [a, b, c] = vsh(r, ['vs26-step3-prep', 'cc02-prompt-pasted', 'cc03-reading'])
  r.a1 = hl(r, a, 'done', 'Done：範本複製好、套件裝好', { col: C.green, above: true })
  r.a2 = hl(r, a, 'prompt', '已經在 my-equipment-app 裡', { col: C.green, below: true, right: true })
  r.b1 = hl(r, b, 'input', '起手 prompt：只有 4 行，第一行就說走 SDD', { above: true, size: 28 })
  r.b2 = hl(r, b, 'model', 'Opus 5.5 High：想得深', { col: C.gold, below: true, right: true, size: 26 })
  r.c1 = hl(r, c, [350, 325, 645, 92], '好幾行 Read：AI 在讀規矩和 PRD', { below: true, size: 28 })
  r.cp = tip('複製指令在手冊 step3「⓪ 準備工作區」，整段貼上', { y: 806, size: 28, col: C.teal })
  return r
}, [
  r => { show([r.S[0], r.cp]); later(500, () => only(r, r.a1, r.a2)) },
  r => { hide(r.cp); to(r, r.S[1]); only(r, r.b1) },
  r => { zoom(r.S[1], 'model', { pad: 120, max: 2.2 }); only(r, r.b2) },
  r => { unzoom(r.S[1]); to(r, r.S[2]); zoom(r.S[2], [350, 325, 645, 92], { pad: 30, max: 1.6 }); later(500, () => only(r, r.c1)) },
])

sc3(14, () => {
  const r = {}; hd(14, 'step3')
  const [a, b, c, d] = vsh(r, ['cc05-d2', 'cc06-d3', 'cc09b-q2-serial', 'cc09b-q4-id'])
  r.a1 = hl(r, a, 'rec', '每題都有「建議」＋一句理由', { col: C.green, below: true, size: 28 })
  r.b1 = hl(r, b, 'rec', 'D3：簡化版編碼，例 PW-GEN-003', { col: C.green, below: true, size: 26 })
  r.pick = tip('課堂拍板：D1 補刪除・D2 做匯出・D3 簡化版編碼', { y: 806, size: 30, col: C.teal })
  r.c1 = hl(r, c, [358, 252, 232, 28], 'PRD 沒寫清楚的：流水號、編輯、電話、點列', { col: C.gold, below: true, size: 26 })
  r.d1 = hl(r, d, 'q', '連主鍵要不要加，都停下來問', { col: C.gold, above: true, size: 26 })
  r.cnt = box(L, 1080, 64, 400, 46, '這次多問了 7 題，都是選擇題', { size: 22, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.rule = codeCard(70, 640, 1460, ['只在卡住、非問不可時才問人，用選擇題（2–4 選項、標建議）；不發明元件與商業規則。'], { title: 'CLAUDE.md 寫的規矩（harness）', size: 30, col: C.gold })
  return r
}, [
  r => { show(r.S[0]); zoom(r.S[0], 'rec', { pad: 120, max: 1.6 }); later(400, () => only(r, r.a1)) },
  r => { unzoom(r.S[0]); to(r, r.S[1]); only(r, r.b1); show(r.pick) },
  r => { hide(r.pick); to(r, r.S[2]); only(r, r.c1); show(r.cnt); later(3800, () => { to(r, r.S[3]); only(r, r.d1) }) },
  r => { only(r); hide(r.cnt); show(r.rule); glow(r.rule) },
])

sc3(15, () => {
  const r = {}; hd(15, 'step3')
  const [a, b] = vsh(r, ['cc09a-docs4', 'cc09a-tasklist'])
  r.a1 = hl(r, a, 'head', '先交 4 個檔：SRS、設計文件、圖、任務清單', { col: C.green, below: true, size: 26 })
  r.a2 = hl(r, b, 'head', '14 個任務，程式一行都還沒寫', { col: C.green, below: true, size: 26 })
  r.chk = box(L, 120, 300, 1360, 260, '先別急著說開工\n打開 SRS 核三段、看一眼圖，確認了才開工', { size: 44, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1)); later(4200, () => { to(r, r.S[1]); only(r, r.a2) }) },
  r => { only(r); hide(r.S); show(r.chk); glow(r.chk) },
])

sc3(16, () => {
  const r = {}; hd(16, 'step3 ・ SRS')
  const [a, b, c, d] = vsh(r, ['v4-srs-decisions', 'v4-srs-q', 'v4-srs-trace', 'v4-srs-scope'])
  r.a1 = hl(r, a, 'table', 'D1～D3：裁決、理由、誰拍板', { col: C.violet, above: true, size: 28 })
  r.a2 = hl(r, b, 'table', '追加的 7 題也一題一列記下來', { col: C.gold, above: true, size: 28 })
  r.b1 = hl(r, c, 'table', '需求追溯：12 欄各做在哪', { col: C.violet, above: true, size: 28 })
  r.b2 = hl(r, c, 'where', '做在哪個檔', { col: C.gold, below: true, size: 26 })
  r.d1 = hl(r, d, 'h', '範圍外：這一版不做什麼', { col: C.violet, below: true, size: 28 })
  r.d2 = hl(r, d, 'table', '', { col: C.violet })
  r.pm = [['1. 已拍板決策', '答應了哪些取捨'], ['2. 需求追溯', '每個需求做在哪'], ['3. 範圍外', '這一版不做什麼']].map(([h, s], i) => card(70 + i * 495, 300, 465, 220, '★ ' + h, [s], C.gold, { size: 30, ts: 34 }))
  r.pmt = box(L, 70, 600, 1460, 120, 'PM 必核的三段：不用看程式，看這三段就知道它答應了什麼', { size: 34, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.a1)); later(4200, () => { to(r, r.S[1]); only(r, r.a2) }) },
  r => { to(r, r.S[2]); only(r, r.b1, r.b2) },
  r => { to(r, r.S[3]); only(r, r.d1, r.d2) },
  r => { only(r); hide(r.S[3]); stagger(r.pm, 350); later(1200, () => show(r.pmt)) },
])

sc3(17, () => {
  const r = {}; hd(17, 'step3 ・ 設計文件＋圖')
  const [a, b] = vsh(r, ['v4-design-files', 'v4-design-evidence'])
  r.a1 = hl(r, a, 'h', '檔案責任：5 個複製改名、3 個共用', { col: C.violet, below: true, size: 28 })
  r.a2 = hl(r, a, 'shared', '直接共用、未修改：還寫了有沒有真的在用', { col: C.gold, above: true, size: 26 })
  r.c1 = hl(r, b, 'h', '遵守 harness 的證據', { col: C.green, below: true, size: 30 })
  r.c2 = hl(r, b, 'hex', '寫死的色碼：0 筆', { col: C.green, right: true, size: 26 })
  r.c3 = hl(r, b, 'log', 'console.log：0 筆', { col: C.green, right: true, below: true, size: 26 })
  r.bw = bwin(['v4-diag-uc', 'v4-diag-files-wide', 'v4-diag-class-wide', 'v4-diag-seq-create-wide'], 'DIAGRAMS-中心裝備物資.html'); r.B = r.bw.S
  r.u1 = hl(r, r.B[0], 'svg', '① 用例圖：誰能做哪些事', { col: OR, size: 26, above: true })
  r.f0 = hl(r, r.B[1], 'h', '② 檔案架構圖：哪些複製改名、哪些直接共用', { col: OR, size: 26, below: true })
  r.k1 = hl(r, r.B[2], 'h', '③ 資料模型：一筆品項長什麼樣', { col: OR, size: 26, below: true })
  r.q1 = hl(r, r.B[3], 'h', '④ 新增品項：選分類 → 選項目 → 編碼算出來 → 儲存', { col: OR, size: 24, below: true })
  r.cp = scr('v4-diag-copy5', fitF('v4-diag-copy5', { x: 70, y: 140, w: 1460, h: 400 }))
  r.cpT = tip('紅：5 個檔從範本複製改名（跟「裝備物資長什麼樣」有關）', { y: 556, size: 28, col: C.red })
  r.sh = scr('v4-diag-shared3', fitF('v4-diag-shared3', { x: 70, y: 640, w: 1460, h: 150 }))
  r.shT = tip('藍：3 個檔直接共用、一行都不改（通用機制）', { y: 806, size: 28, col: '#4da3ff' })
  r.ev = tip('AI 不是說「我有照規矩」，是拿出證據和圖給你看', { y: 806, size: 32, col: C.gold })
  return r
}, [
  r => { show(r.S[0]); later(300, () => only(r, r.a1)); later(2200, () => { zoom(r.S[0], 'shared', { pad: 120, max: 1.7 }); only(r, r.a2) }) },
  r => { unzoom(r.S[0]); to(r, r.S[1]); only(r, r.c1); later(2600, () => only(r, r.c2, r.c3)) },
  r => { only(r); hide(r.S); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.u1)); later(3800, () => { swap(r.B, r.B[1]); only(r, r.f0) }) },
  r => { only(r); hide(r.bw.g); show([r.cp, r.cpT]); later(1800, () => show([r.sh, r.shT])); later(4000, () => { hide([r.cp, r.cpT, r.sh, r.shT]); show(r.bw.g); swap(r.B, r.B[2]); only(r, r.k1) }); later(6200, () => { swap(r.B, r.B[3]); only(r, r.q1) }) },
  r => { later(3000, () => { only(r); hide(r.bw.g); show(r.ev); glow(r.ev) }) },
])

sc3(18, () => {
  const r = {}; hd(18, 'step3')
  const [c, d, e, f] = vsh(r, ['cc09e-model-menu', 'cc09f-go-typed', 'cc11v4-t0300', 'cc12-done'])
  r.c1 = hl(r, c, 'sonnet', '寫程式改用 Sonnet 5.5', { col: C.gold, below: true, size: 28 })
  r.d1 = hl(r, d, 'model', 'Sonnet 5.5 High', { col: C.gold, above: true, size: 26 })
  r.d2 = hl(r, d, 'input', '說「開工」', { col: C.green, above: true, right: true, size: 26 })
  r.e1 = hl(r, e, [350, 230, 680, 200], 'AI 一個一個做，自己跑檢查', { above: true, size: 28 })
  r.f1 = hl(r, f, 'sum', '五行總結：做了什麼、哪些檔、花多久', { col: C.green, above: true, size: 26 })
  r.time = box(L, 1080, 64, 400, 46, '這次實拍：約 17 分鐘', { size: 24, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.cheap = tip('有規矩和範本，寫程式不用最貴的模型', { y: 806, size: 30, col: C.gold })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.c1)); show(r.cheap); later(4000, () => { to(r, r.S[1]); only(r, r.d1, r.d2) }) },
  r => { hide(r.cheap); to(r, r.S[2]); only(r, r.e1); show(r.time) },
  r => { to(r, r.S[3]); only(r, r.f1) },
])

sc3(19, () => {
  const r = {}; hd(19, 'step3')
  r.bw = bwin(['ea01-list', 'ea04-item-open', 'ea05-code', 'ea06-validation', 'ea07-delete'], 'localhost:3101/equipment/crud'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'count', '共 24 筆', { col: OR, size: 30, below: true })
  r.b1 = hl(r, r.B[1], 'list', '只出現這個分類的項目', { col: OR, size: 28, right: true })
  r.c1 = hl(r, r.B[2], [268, 170, 205, 32], '編碼馬上算出來：IT-NBK-003', { col: C.green, size: 30, below: true })
  r.d1 = hl(r, r.B[3], 'toast', '空表單按儲存：請修正 4 個欄位', { col: C.red, size: 26, above: true, right: true, pad: 18 })
  r.e1 = hl(r, r.B[4], 'ok', '按「刪除」才會真的刪', { col: C.red, size: 26, below: true, right: true })
  const mF = fitF('ea08-mobile', { x: 1000, y: 140, w: 470, h: 730 })
  r.mob = grp(L); R(r.mob, mF.x - 16, mF.y - 16, mF.w + 32, mF.h + 32, { fill: '#0b0f14', stroke: '#5b6670', sw: 4, rx: 34 }); show(scrIn('ea08-mobile', mF, r.mob))
  r.mobT = box(L, 120, 360, 820, 160, '縮到手機寬度\n表格變成卡片', { size: 44, fill: C.card, stroke: C.teal, color: C.ink, weight: 800 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); zoom(r.B[0], [248, 280, 940, 360], { pad: 10, max: 1.4 }); later(400, () => only(r, r.a1)) },
  r => { unzoom(r.B[0]); burl(r.bw, 'localhost:3101/equipment/crud/new'); swap(r.B, r.B[1]); only(r, r.b1); later(3600, () => { swap(r.B, r.B[2]); only(r, r.c1) }) },
  r => { swap(r.B, r.B[3]); only(r, r.d1); later(3000, () => { burl(r.bw, 'localhost:3101/equipment/crud'); swap(r.B, r.B[4]); only(r, r.e1) }); later(6200, () => { only(r); hide(r.bw.g); show([r.mob, r.mobT]) }) },
])

sc3(20, () => {
  const r = {}; hd(20, 'step3')
  const [a, b, c, d] = vsh(r, ['cc13-fix1-ask', 'cc13-fix1-done', 'cc14-fix2-ask', 'cc14-fix2-done'])
  r.a1 = hl(r, a, 'msg', '第 1 件：看到什麼、期望什麼，一次講一件', { col: C.gold, below: true, size: 26 })
  r.b1 = hl(r, b, 'done', 'AI 改好，我再去看一次', { col: C.green, above: true, size: 26 })
  r.c1 = hl(r, c, 'msg', '第 2 件：再講一次、再改一次', { col: C.gold, below: true, size: 26 })
  r.d1 = hl(r, d, 'done', '改好了', { col: C.green, above: true, size: 26 })
  r.pain = box(L, 120, 300, 1360, 260, '問題不大，但你得一直坐在電腦前面陪它\n看 → 講 → 等 → 再看 → 再講……', { size: 44, fill: '#3a2a14', stroke: C.coral, color: C.coral, weight: 900 })
  r.next = tip('這段來回，就是 Step 4 要交給 AI 分身的事', { y: 806, size: 32, col: C.gold })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1)) },
  r => { to(r, r.S[1]); only(r, r.b1); later(3000, () => { to(r, r.S[2]); only(r, r.c1) }); later(5600, () => { to(r, r.S[3]); only(r, r.d1) }) },
  r => { only(r); hide(r.S); show(r.pain); glow(r.pain) },
  r => { show(r.next); glow(r.next) },
])

// ════════════════════════════ Step 4 ════════════════════════════
chapter('Step 4', 'LOOP＋對抗審查', C.violet)

sc3(21, () => {
  const r = {}; hd(21, 'step4')
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

sc3(22, () => {
  const r = {}; hd(22, 'step4')
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
  return r
}, [
  r => { show(r.flow); glow(r.flow) },
  r => { show(r.e2e); glow(r.e2e) },
  r => stagger(r.rules, 500),
  r => { hide(r.rules); show(r.file); glow(r.file); stagger(r.outs, 350) },
])

sc3(23, () => {
  const r = {}; hd(23, 'step4')
  const [a, b, c] = vsh(r, ['cc20-loop-pasted', 'cc21v4-port', 'cc23v4-red'])
  r.a1 = hl(r, a, 'input', 'LOOP prompt：4 行，第一行就說照規矩檔做', { col: C.violet, above: true, size: 26 })
  r.a2 = hl(r, a, 'model', 'Sonnet 5.5：寫程式用便宜的', { col: C.gold, below: true, size: 24 })
  r.b1 = hl(r, b, 'port', '3100 被占，AI 自己換成 3101 把網頁開起來', { col: C.gold, below: true, size: 26 })
  r.c1 = hl(r, c, 'red', '第 1 輪：5 綠 2 紅（E3、E7）', { col: C.red, below: true, size: 28 })
  r.c2 = hl(r, c, 'why', '先找根因（Root cause），再動手', { col: C.gold, above: true, size: 26 })
  r.hands = tip('送出之後就不用管了：AI 自己開網頁、跑測試、判斷原因', { y: 806, size: 28, col: C.teal })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1, r.a2)) },
  r => { to(r, r.S[1]); only(r, r.b1); show(r.hands) },
  r => { hide(r.hands); to(r, r.S[2]); only(r, r.c1); later(3200, () => only(r, r.c2)) },
])

sc3(24, () => {
  const r = {}; hd(24, 'step4')
  r.t = term({ y: 128, h: 600, size: 21, title: '測試結果（AI 跑的，實拍文字，省略檔名）', note: '第 2 輪' })
  const [a, b] = vsh(r, ['cc23v4-agent', 'cc23v4-shots'])
  r.a1 = hl(r, a, 'agent', 'Agent：另一個 AI 來審查（Opus 5.5，比寫程式高一級）', { col: C.violet, above: true, size: 26 })
  r.a2 = hl(r, a, 'task', '交代它：只挑錯、不誇獎；用 Playwright（自動開瀏覽器截圖的工具）逐頁看', { col: C.violet, below: true, size: 24 })
  r.b1 = hl(r, b, 'pill', '1 agent：審查的 AI 正在工作（在讀它拍的截圖）', { col: C.violet, above: true, size: 26, pad: 6 })
  r.min = box(L, 1080, 64, 400, 46, '這次實拍：約 24 分鐘', { size: 24, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { show(r.t.g)
    const L2 = r.t.out(['Running 7 tests using 1 worker', GRN('  ok 1 › E1 列表載入'), GRN('  ok 2 › E2 關鍵字篩選'), GRN('  ok 3 › E3 新增品項'), GRN('  ok 4 › E4 表單驗證'), GRN('  ok 5 › E5 刪除確認'), GRN('  ok 6 › E6 範本不回歸'), GRN('  ok 7 › E7 編輯品項'), '', GRN('  7 passed')], { gap: 180 })
    later(2000, () => { const m = r.t.mark(L2[9], '全綠', C.green); show(m); glow(m) }) },
  r => { hide(r.t.g); show(r.S[0]); later(400, () => only(r, r.a1, r.a2)) },
  r => { to(r, r.S[1]); only(r, r.b1); show(r.min) },
])

sc3(25, () => {
  const r = {}; hd(25, 'step4')
  const [a, b] = vsh(r, ['cc25v4-fixed', 'cc25v4-tests'])
  r.a1 = hl(r, a, 'focus', '打字搜尋會掉焦點、吃字', { col: C.coral, above: true, size: 26 })
  r.a3 = hl(r, a, 'page', '第 2 頁點排序，沒回第 1 頁', { col: C.coral, below: true, size: 26 })
  r.a2 = hl(r, a, 'fixed', 'AI 自己修好再跑，還是全綠', { col: C.green, below: true, size: 26 })
  r.b1 = hl(r, b, 'list', '12 條測試問題：只列出來，一個都沒改', { col: C.violet, below: true, size: 26 })
  r.exam = box(L, 120, 300, 1360, 260, '比喻：自己改自己的考卷\n分數一定偏高，所以另開一個更強的 AI 來挑錯', { size: 46, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { show(r.S[0]); zoom(r.S[0], [120, 310, 920, 100], { pad: 30, max: 1.5 }); later(400, () => only(r, r.a1, r.a3)); later(5200, () => only(r, r.a2)) },
  r => { unzoom(r.S[0]); to(r, r.S[1]); only(r, r.b1) },
  r => { only(r); hide(r.S[1]); show(r.exam); glow(r.exam) },
])

sc3(26, () => {
  const r = {}; hd(26, 'step4 ・ 四樣產出')
  const [a] = vsh(r, ['v4-loop-log'])
  r.a1 = hl(r, a, 'tab', 'LOOP-LOG.md：每一輪做了什麼，給機器看的流水帳', { col: C.mut, below: true, size: 26 })
  r.bw = bwin(['v4-loop-report-top', 'v4-loop-report-shots', 'v4-pw-report', 'v4-loop-report-decide'], 'my-equipment-app/loop/LOOP-REPORT.html'); r.B = r.bw.S
  r.b1 = hl(r, r.B[0], 'sum', '一打開就是結論', { col: OR, size: 28, below: true })
  r.b2 = hl(r, r.B[1], 'shot', '審查 AI 的截圖就在報告裡', { col: OR, size: 26, above: true })
  r.c1 = hl(r, r.B[2], 'pass', 'Playwright 測試報告：7 條，每一條點得開', { col: C.green, size: 26, below: true })
  r.d1 = hl(r, r.B[3], 'q1', '要你裁決的，列成選擇題', { col: OR, size: 26, below: true })
  r.only = tip('看報告：結論、截圖、裁決題；看完再自己點一遍，綠燈不等於做對', { y: 806, size: 30, col: C.gold })
  return r
}, [
  r => { show(r.S[0]); later(400, () => only(r, r.a1)) },
  r => { only(r); hide(r.S[0]); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.b1)); later(4200, () => { swap(r.B, r.B[1]); only(r, r.b2) }) },
  r => { burl(r.bw, 'step4_loop_e2e/e2e/playwright-report/index.html'); swap(r.B, r.B[2]); only(r, r.c1) },
  r => { burl(r.bw, 'my-equipment-app/loop/LOOP-REPORT.html'); swap(r.B, r.B[3]); only(r, r.d1); later(2000, () => { show(r.only); glow(r.only) }) },
])

sc3(27, () => {
  const r = {}; hd(27, 'step4 ・ 文件同步')
  r.q = box(L, 120, 330, 1360, 200, '程式改了，文件有沒有跟著改？', { size: 56, fill: C.card, stroke: C.violet, color: C.ink, weight: 900 })
  const [b, c] = vsh(r, ['v4-srs-after', 'v4-design-after'])
  r.bw = bwin(['v4-loop-report-sync'], 'my-equipment-app/loop/LOOP-REPORT.html'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'h', '報告第 ⑦ 段：文件同步', { col: OR, size: 26, below: true })
  r.b1 = hl(r, b, 'mark', 'SRS：標上「step4 LOOP 後」', { col: C.gold, below: true, size: 28 })
  r.c1 = hl(r, c, 'mark', '設計文件也標上', { col: C.gold, below: true, size: 28 })
  r.dish = box(L, 120, 330, 1360, 220, '菜改了，菜單跟著改\n下一個人接手，看文件就知道現在的程式長什麼樣子', { size: 40, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { show(r.q); glow(r.q) },
  r => { hide(r.q); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.a1)); later(3600, () => { hide(r.bw.g); only(r); show(r.S[0]); later(300, () => only(r, r.b1)) }); later(7000, () => { to(r, r.S[1]); only(r, r.c1) }) },
  r => { only(r); hide(r.S); show(r.dish); glow(r.dish) },
])

sc3(28, () => {
  const r = {}; hd(28, 'step4 ・ 下次怎麼做')
  r.nodes = flowRow(200, [['你寫規格', C.teal], ['AI 選擇題\n釐清', C.gold], ['SRS・設計\n文件・圖', C.violet], ['你核過', C.gold], ['LOOP 實作\n另一個 AI 審查', C.coral], ['看報告\n拍板驗收', C.green]], { w: 225, gap: 20, h: 130 })
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

sc3(29, () => {
  const r = {}; hd(29, 'step5')
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

sc3(30, () => {
  const r = {}; hd(30, '總結')
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
