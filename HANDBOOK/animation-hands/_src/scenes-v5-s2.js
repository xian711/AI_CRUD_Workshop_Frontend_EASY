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
