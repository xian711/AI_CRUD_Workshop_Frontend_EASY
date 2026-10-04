// ── 場景檔第三部分：Step 3（安裝 Claude Code、貼起手 prompt、選擇題）──
scene('第一次用：安裝 Claude Code', () => {
  const r = {}; mhead('step3 ③', '第一次用：先安裝 Claude Code 擴充')
  const [a, b, c] = vsh(r, ['cc-i1-activity', 'cc-i2-search', 'cc-i3-detail', 'cc00-statusbar'].slice(0, 3))
  r.S.push(scr('cc00-statusbar', FV))
  r.a1 = hl(r, a, 'ext', '延伸模組', { right: false, lx: 230, size: 30, pad: 6 })
  r.b1 = hl(r, b, 'search', '輸入 Claude Code', { lx: 560, size: 30 })
  r.b2 = hl(r, b, 'first', '', { col: C.green })
  r.b3 = hl(r, b, 'fake1', '', { col: C.red })
  r.b4 = hl(r, b, 'fake2', '', { col: C.red })
  r.pick = tip('綠框才對：發行者 Anthropic、有藍色勾勾　｜　紅框：名字很像的別家，不要選', { y: 806, size: 28, col: C.green })
  r.c1 = hl(r, c, 'publisher', 'Anthropic ✓ anthropic.com', { col: C.green, below: true, size: 26 })
  r.c2 = hl(r, c, 'install', '安裝', { col: C.coral, below: true, size: 32, pad: 6 })
  r.c3 = hl(r, c, 'plan', '要用 Pro、Max、Team、Enterprise 方案或用量計費', { col: C.gold, above: true, size: 24 })
  r.d1 = hl(r, r.S[3], 'status', '裝好後：✻ Claude Code', { col: C.coral, above: true, right: true, size: 28, pad: 6 })
  r.acct = tip('第一次打開會請你登入：帳號請依講師或公司的說明準備', { y: 806, size: 28, col: C.teal })
  cursor(r)
  return r
}, [
  ['第一次用 Claude Code，要先安裝它的 VS Code 擴充。點左邊的「延伸模組」圖示。', r => { show(r.S[0]); only(r, r.a1); clickAt(r, r.S[0], 'ext') }],
  ['在搜尋框輸入 Claude Code。', r => { to(r, r.S[1]); hide(r.cur); only(r, r.b1) }],
  ['名字很像的有好幾個。要選發行者是 Anthropic、旁邊有藍色勾勾的那一個。', r => { zoom(r.S[1], [53, 100, 256, 230], { pad: 20, max: 1.8 }); only(r, r.b2, r.b3, r.b4); show(r.pick) }],
  ['點進去，按「安裝」。', r => { hide(r.pick); unzoom(r.S[1]); to(r, r.S[2]); only(r, r.c1, r.c2) }],
  ['說明頁有寫：要用 Claude 的付費方案登入。第一次打開會請你登入，帳號請依講師或公司的說明準備。', r => { only(r, r.c3); show(r.acct) }],
  ['安裝好之後，右下角的狀態列會出現「✻ Claude Code」。', r => { hide(r.acct); to(r, r.S[3]); zoom(r.S[3], 'status', { pad: 120, max: 2 }); only(r, r.d1) }],
])

scene('打開 Claude Code，貼上起手 prompt', () => {
  const r = {}; mhead('step3 ④', '打開 Claude Code，貼上起手 prompt')
  const [a, b, c] = vsh(r, ['cc00-statusbar', 'cc01-empty', 'cc02-prompt-pasted'])
  r.a1 = hl(r, a, 'status', '✻ Claude Code', { col: C.coral, above: true, right: true, size: 30, pad: 6 })
  r.b1 = hl(r, b, [350, 470, 684, 84], '輸入框：在這裡跟 AI 說話', { above: true, size: 30 })
  r.b2 = hl(r, b, 'mode', 'Auto：權限模式，先用預設', { below: true, right: true, size: 26, pad: 4 })
  r.bw = bwin(['br07-handbook-startprompt'], 'HANDBOOK.html#step3'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], 'pre', '整段選起來，按 Ctrl+C', { col: OR, size: 30, below: true })
  r.c1 = hl(r, c, 'input', '按 Ctrl+V 貼上', { above: true, size: 30 })
  r.c2 = hl(r, c, 'send', '送出', { col: C.coral, below: true, right: true, size: 30, pad: 6 })
  r.four = tip('prompt 點名的四份＝三份規矩（CLAUDE.md、CODE-RULES、使用說明）＋ PRD', { y: 806, size: 26, col: C.teal })
  r.any = tip('你們單位如果用別的 AI 工具，做法也一樣：貼 prompt、回答選擇題', { y: 806, size: 28, col: C.teal })
  cursor(r)
  return r
}, [
  ['打開 Claude Code：點右下角狀態列的「✻ Claude Code」。', r => { show(r.S[0]); only(r, r.a1); clickAt(r, r.S[0], 'status') }],
  ['會開出一個對話分頁。下面的輸入框，就是跟 AI 說話的地方。', r => { to(r, r.S[1]); hide(r.cur); only(r, r.b1) }],
  ['右下的 Auto 是權限模式：大部分動作它會自己判斷能不能直接做。先用預設，不要動。', r => only(r, r.b2)],
  ['到手冊 step3 的「② 貼起手 prompt」，把整段選起來，按 Ctrl+C。', r => { hide(r.S[1]); only(r); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.h1)) }],
  ['回到 VS Code，點一下輸入框，按 Ctrl+V 貼上。', r => { hide(r.bw.g); only(r); show(r.S[2]); later(300, () => only(r, r.c1)) }],
  ['這段 prompt 會先叫 AI 讀四份文件：三份規矩加上 PRD。讀完先用選擇題問你三個決定，最後才開工。', r => { zoom(r.S[2], 'input', { pad: 30, max: 1.5 }); only(r, r.c1); show(r.four) }],
  ['確認沒問題，按右下角的送出鈕。', r => { hide(r.four); unzoom(r.S[2]); only(r, r.c2); clickAt(r, r.S[2], 'send') }],
  ['你們單位如果用別的 AI 工具，做法也一樣：貼 prompt、回答選擇題。', r => { hide(r.cur); only(r); show(r.any) }],
])

scene('AI 先出選擇題，你拍板', () => {
  const r = {}; mhead('step3 ⑤', 'AI 不先寫程式，先出選擇題問你')
  const [a, b, c, d] = vsh(r, ['cc03-reading', 'cc04-question', 'cc05-d2', 'cc06-d3'])
  r.a1 = hl(r, a, [360, 285, 612, 92], '好幾行 Read：AI 在讀檔', { below: true, size: 30 })
  r.a2 = hl(r, a, [1001, 521, 26, 26], '要叫它停：按這個方塊', { col: C.coral, above: true, right: true, size: 26, pad: 6 })
  r.b1 = hl(r, b, [355, 222, 172, 28], '三題：D1・D2・D3', { below: true, size: 28 })
  r.b2 = hl(r, b, [358, 292, 652, 64], 'D1：補上刪除（建議）', { col: C.green, below: true, size: 28 })
  r.c1 = hl(r, c, [358, 326, 666, 62], 'D2：做 CSV 匯出（建議）', { col: C.green, below: true, size: 28 })
  r.d1 = hl(r, d, [358, 316, 652, 62], 'D3：選「簡化」那一個', { col: C.green, below: true, size: 28 })
  r.d2 = hl(r, d, [358, 482, 668, 32], 'Submit answers：送出', { col: C.coral, above: true, size: 28 })
  r.diff = tip('照手冊的課堂拍板選：D1 補刪除、D2 做匯出、D3 簡化版。不要只認「建議」', { y: 806, size: 28, col: C.teal })
  r.you = tip('三題不用背。重點是：做取捨的人是你，不是 AI', { y: 806, size: 32 })
  r.rescue = codeCard(70, 600, 1460, ['停，先不要寫程式、不要建任何檔案。', '請先針對 PRD 第 5 節的三個待決策點，用選擇題逐題問我（每題 2-4 個選項＋你的建議）。', '我拍板後你再列任務清單，等我確認才開工。'], { title: 'AI 沒問就寫程式：先按停止方塊，再貼手冊的救援 prompt', size: 26, col: C.coral })
  cursor(r)
  return r
}, [
  ['AI 先讀規矩和 PRD。看到好幾行 Read 開頭，就是它在讀檔。', r => { show(r.S[0]); zoom(r.S[0], [360, 285, 612, 92], { pad: 30, max: 1.6 }); later(500, () => only(r, r.a1)) }],
  ['AI 在跑的時候，輸入框右邊會變成一個方塊。要叫它停，就按這個方塊。', r => { unzoom(r.S[0]); only(r, r.a2) }],
  ['讀完，它不寫程式，先出選擇題。三題放在三個分頁：D1 刪除、D2 匯出、D3 編碼。', r => { to(r, r.S[1]); zoom(r.S[1], [340, 210, 700, 330], { pad: 10, max: 1.5 }); only(r, r.b1) }],
  ['每題都標了「建議」，還附一句理由。D1 刪除：課堂上選「補上刪除」。選好，會自動跳到下一題。', r => { only(r, r.b2); clickAt(r, r.S[1], [358, 292, 652, 64], { fx: 0.05 }) }],
  ['D2 匯出：選「做 CSV 匯出」。', r => { unzoom(r.S[1]); to(r, r.S[2]); zoom(r.S[2], [340, 250, 700, 300], { pad: 10, max: 1.5 }); only(r, r.c1); clickAt(r, r.S[2], [358, 326, 666, 62], { fx: 0.05 }) }],
  ['D3 編碼：選「簡化」版，就是不加機關前綴、同一個編碼不累加數量。三題都選好，按「Submit answers」送出。', r => { unzoom(r.S[2]); to(r, r.S[3]); only(r, r.d1, r.d2); later(1500, () => clickAt(r, r.S[3], [358, 482, 668, 32], { fx: 0.2 })) }],
  ['你的畫面文字可能不一樣，AI 的「建議」也可能不同。照手冊的課堂拍板選：補刪除、做匯出、簡化版編碼。', r => { hide(r.cur); only(r); show(r.diff) }],
  ['三題不用背。重點是：在真實系統和課堂之間做取捨的人，是你，不是 AI。', r => { hide(r.diff); show(r.you) }],
  ['如果 AI 沒問就直接寫程式，先按停止方塊，再貼手冊的救援 prompt，叫它先問你。', r => { hide(r.you); show(r.rescue) }],
])
