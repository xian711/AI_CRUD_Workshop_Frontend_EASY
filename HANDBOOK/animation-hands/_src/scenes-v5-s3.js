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
  r.n = tip('四批一共 14 題：都是 PRD 沒寫清楚、它自己找出來的', { y: 806, size: 28, col: C.teal })
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
  r.b1 = hl(r, b, 'table', '第 1 段：14 題一題一列', { col: C.violet, above: true, size: 26 })
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

// 圖：上面一張「標題＋怎麼看」、下面一張圖本身
function diagScene(n, k, url, parts) {
  return () => {
    const r = {}; hd(n, 'step3 ・ 看圖')
    r.bw = bwin(['v5-diagn-' + k + '-head'], url); r.B = r.bw.S
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
  ['p2', [751, 213, 1094, 128], '橘色 5 個：照範本複製改名', { col: OR, below: true, size: 26 }],
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
  r.bw = bwin(['v5-diagn-1-head'], 'DIAGRAMS-中心裝備物資.html#uc'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], [50, 40, 400, 18], '說明寫「7 件事」', { col: C.red, below: true, size: 28 })
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
  r.err = card(70, 480, 1460, 170, '一開頁就 500：useColorMode is not defined', ['不用自己動手，跟 Claude Code 說：網頁 500，請停掉網頁伺服器、刪掉 .nuxt 和 .output 再重開'], C.coral, { size: 28, ts: 32 })
  r.next = box(L, 70, 680, 1460, 110, '小修的來回很花時間 → 下一步：交給 AI 自己跑', { size: 34, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  r => { stagger(r.c.slice(0, 2), 300, e => { show(e); glow(e) }) },
  r => { stagger(r.c.slice(2), 300, e => { show(e); glow(e) }); later(1500, () => show(r.five)) },
  r => { show(r.err); glow(r.err) },
  r => { show(r.next); glow(r.next) },
])
