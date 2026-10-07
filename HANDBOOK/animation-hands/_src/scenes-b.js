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
