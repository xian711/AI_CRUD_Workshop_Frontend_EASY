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
