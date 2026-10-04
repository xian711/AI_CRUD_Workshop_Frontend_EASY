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
