// ── 場景檔第六部分：Step 4 實拍（第二版：一個 LOOP prompt → 修到全綠 → 子代理對抗審查 → 交報告 → 用眼睛驗收）──
const RED = s => [[s, TC.err, 700]], GRN = s => [[s, TC.ok, 700]]

scene('只貼一個 LOOP prompt，之後 AI 自己跑', () => {
  const r = {}; mhead('step4 ③', '只貼一個 prompt，之後 AI 自己跑')
  const [a] = vsh(r, ['cc19-root-explorer'])
  r.a1 = hl(r, a, 'tree', '回到教材根目錄', { right: true, size: 30, pad: 2 })
  r.bw = bwin(['br08-handbook-loopprompt'], 'HANDBOOK.html#step4'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], 'pre', '手冊 step4 的 LOOP prompt：整段複製', { col: OR, size: 28, below: true })
  const b = scr('cc20-loop-pasted', FV); r.S.push(b)
  r.b1 = hl(r, b, 'input', '新對話：貼上、送出', { above: true, size: 30 })
  r.b2 = hl(r, b, [365, 360, 640, 42], '這一行：全綠後開子代理對抗審查', { col: C.violet, above: true, size: 26 })
  r.t = term({ y: 128, h: 600, size: 21, title: '測試結果（AI 跑的，實拍文字，省略檔名）', note: '第 1 輪' })
  const c = scr('cc23v2-red', FV); r.S.push(c)
  r.c1 = hl(r, c, [371, 227, 658, 39], '第 1 輪：E3、E4 紅', { col: C.red, below: true, size: 28 })
  r.c2 = hl(r, c, [371, 410, 658, 40], '自己判斷原因：先查 PRD 有沒有寫', { col: C.gold, above: true, size: 28 })
  r.hands = tip('之後你不用插手：AI 自己確認網頁有在跑，再跑測試', { y: 806, size: 28, col: C.teal })
  return r
}, [
  ['LOOP 要在教材根目錄做。用「檔案」→「開啟資料夾」，回到 AI_CRUD_Workshop_Frontend_EASY。', r => { show(r.S[0]); later(500, () => only(r, r.a1)) }],
  ['開一個新的 Claude Code 對話，把手冊 step4 的 LOOP prompt 整段複製過來。', r => { hide(r.S[0]); only(r); show(r.bw.g); show(r.B[0]); later(300, () => only(r, r.h1)) }],
  ['貼上，送出。', r => { hide(r.bw.g); only(r); show(r.S[1]); later(300, () => only(r, r.b1)) }],
  ['prompt 裡有一行很重要：全綠之後，開一個子代理做對抗審查。這一行，就是把挑錯也交給 AI。', r => { zoom(r.S[1], [353, 340, 679, 80], { pad: 20, max: 1.6 }); only(r, r.b2) }],
  ['之後你不用插手。AI 會自己確認網頁有在跑，再跑測試。', r => { unzoom(r.S[1]); hide(r.S[1]); only(r); show([r.t.g, r.hands]) }],
  ['第一輪：5 條綠、2 條紅，紅的是 E3 和 E4。', r => { hide(r.hands)
    r.t.out(['Running 7 tests using 1 worker', GRN('  ok 1 › E1 列表載入：種子 24 筆、桌機表格、第一頁恰好 20 列'), GRN('  ok 2 › E2 關鍵字篩選：用編碼與品名都能縮小、不分大小寫、清除後還原'), RED('  x  3 › E3 新增品項：連動下拉、編碼即時產生且不重複、儲存後筆數 +1'), RED('  x  4 › E4 表單驗證：五個必填逐欄驗錯 ＋ 狀態進不了空值，錯誤不離頁'), GRN('  ok 5 › E5 刪除確認：取消不變、確認後 -1 且該編碼從表格消失'), GRN('  ok 6 › E6 範本不回歸：人員範本列表可用，且點得進檢視頁看到資料'), GRN('  ok 7 › E7 編輯品項：改第一列數量與存放地點，儲存後新值生效'), RED('  2 failed'), GRN('  5 passed (17.4s)'), '', RED('E2E FAIL：測試程序 exit code = 1。')], { gap: 260 }) }],
  ['AI 自己判斷原因：先去查 PRD 有沒有寫，再看參考解怎麼做，最後改了 1 個檔。', r => { hide(r.t.g); show(r.S[2]); later(400, () => only(r, r.c1, r.c2)) }],
])

scene('第二輪全綠，再叫子代理挑錯', () => {
  const r = {}; mhead('step4 ④', '第二輪全綠，AI 再叫分身來挑錯')
  r.t = term({ y: 128, h: 600, size: 21, title: '測試結果（AI 跑的，實拍文字，省略檔名）', note: '第 2 輪' })
  const [a, b] = vsh(r, ['cc23v2-agent', 'cc23v2-agent-now'])
  r.a1 = hl(r, a, [371, 228, 658, 39], '第 2 輪 7 條全綠', { col: C.green, below: true, size: 28 })
  r.a2 = hl(r, a, [364, 290, 262, 26], 'Agent：AI 自己叫出子代理', { col: C.violet, above: true, size: 28 })
  r.a3 = hl(r, a, [371, 322, 658, 75], '交代它：專挑假綠、和測試沒抓到的 App 問題', { col: C.violet, below: true, size: 26 })
  r.b1 = hl(r, b, [478, 524, 62, 20], '1 agent：分身正在挑錯', { col: C.violet, above: true, size: 28, pad: 6 })
  r.min = box(L, 1080, 64, 400, 46, '這次實拍：約 24 分鐘', { size: 24, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.hands = tip('從貼上 prompt 到交報告，你都不用插手', { y: 806, size: 30, col: C.teal })
  return r
}, [
  ['第二輪，7 條全綠：7 passed。', r => { show(r.t.g)
    const L2 = r.t.out(['Running 7 tests using 1 worker', GRN('  ok 1 › E1 列表載入：種子 24 筆、桌機表格、第一頁恰好 20 列'), GRN('  ok 2 › E2 關鍵字篩選：用編碼與品名都能縮小、不分大小寫、清除後還原'), GRN('  ok 3 › E3 新增品項：連動下拉、編碼即時產生且不重複、儲存後筆數 +1'), GRN('  ok 4 › E4 表單驗證：五個必填逐欄驗錯 ＋ 狀態進不了空值，錯誤不離頁'), GRN('  ok 5 › E5 刪除確認：取消不變、確認後 -1 且該編碼從表格消失'), GRN('  ok 6 › E6 範本不回歸：人員範本列表可用，且點得進檢視頁看到資料'), GRN('  ok 7 › E7 編輯品項：改第一列數量與存放地點，儲存後新值生效'), '', GRN('  7 passed (7.0s)'), GRN('E2E 全綠：7 條 passed / 0 條 failed / 0 條 skipped。')], { gap: 220 })
    later(2600, () => { const m = r.t.mark(L2[10], '全綠', C.green); show(m); glow(m) }) }],
  ['接著，AI 照 prompt 自己叫出一個子代理，也就是它的分身，專門來挑錯。', r => { hide(r.t.g); show(r.S[0]); later(400, () => only(r, r.a1)); later(1800, () => only(r, r.a2)) }],
  ['它交代分身：專挑測試的假綠，還有測試沒抓到的 App 問題。分身只回報，不改檔。', r => only(r, r.a2, r.a3)],
  ['下面出現「1 agent」，就是分身正在工作。這次從貼上到交報告，大約 24 分鐘，你都不用插手。', r => { to(r, r.S[1]); only(r, r.b1); show([r.min, r.hands]) }],
])

scene('看報告：分身挑到的問題怎麼處理', () => {
  const r = {}; mhead('step4 ⑤', '看報告：分身挑到的，AI 分兩種處理')
  const [a, b, c, d] = vsh(r, ['cc25v2-conclusion', 'cc25v2-fixed', 'cc25v2-tests', 'cc26v2-question'])
  r.a1 = hl(r, a, [366, 268, 662, 46], '結論：App 問題修了 5 個，測試的問題一條都沒改', { col: C.green, below: true, size: 24 })
  r.a2 = hl(r, a, [371, 373, 658, 122], '每輪紀錄：紅了什麼、根因、改了哪個檔', { col: C.gold, above: true, size: 26 })
  r.b1 = hl(r, b, [371, 336, 658, 42], 'B1：打字時游標被搶走——測試沒抓到，分身抓到了', { col: C.coral, above: true, size: 24 })
  r.b2 = hl(r, b, [943, 423, 85, 66], '規格外調整：PRD 沒寫的要標出來', { col: C.gold, above: true, right: true, size: 24 })
  r.c1 = hl(r, c, [371, 228, 658, 29], '測試本身的問題：一條都沒改，列給你裁決', { col: C.violet, below: true, size: 26 })
  r.d1 = hl(r, d, [361, 265, 640, 24], '要你拍板的，AI 用選擇題問你', { col: C.gold, above: true, size: 26 })
  r.d2 = hl(r, d, [361, 294, 648, 60], '例：數量預設 0，要不要補進 PRD', { col: C.green, below: true, size: 26 })
  r.you = tip('你只做三件事：看報告、做裁決、自己在瀏覽器點一遍', { y: 806, size: 30 })
  r.prdfix = tip('實拍之後，課程已拍板：PRD 第 2 節補上「數量預設 0」', { y: 806, size: 28, col: C.teal })
  r.rt = term({ y: 128, h: 560, size: 26, title: '報告的「每輪紀錄」（實拍文字）', shell: 'Claude Code' }); r.rt.hideCursor()
  return r
}, [
  ['報告一開頭就是結論：7 條全綠，連跑兩次都綠。分身挑到的 App 問題修了 5 個，測試的問題一條都沒改。', r => { show(r.S[0]); later(400, () => only(r, r.a1)) }],
  ['每一輪紅了什麼、原因是什麼、改了哪個檔，都列成一張表。第 3 輪是分身挑完錯、AI 修好之後，又跑了兩次都綠。', r => { only(r); hide(r.S[0]); show(r.rt.g)
    r.rt.out([[['第 1 輪｜紅了：E3、E4', TC.err, 800]], '  根因：E3 表單裡沒有「品項編碼」欄位，只有標題文字。E4 數量預設是空白，測試要 0', '  改了：[id].vue', '', [['第 2 輪｜紅了：無（7 passed）', TC.ok, 800]], '', [['第 3 輪（審查修完）｜紅了：無（7 passed，重跑一次也綠）', TC.ok, 800]], '  改了：index.vue、[id].vue、useEquipmentItems.ts、SRS、SDD'], { gap: 300 }) }],
  ['分身挑到的 App 問題，AI 自己修好再跑。最嚴重的一個：在關鍵字框打字，停一下游標就被搶走，後面打的字全掉。這個 7 條測試都沒抓到。', r => { hide(r.rt.g); to(r, r.S[1]); only(r, r.b1) }],
  ['PRD 沒寫、AI 自己加的改動，例如這次的數量預設 0，照 prompt 可以先改，但一定要標成「規格外調整」，最後交給你決定要不要留。', r => only(r, r.b2)],
  ['測試本身的問題，AI 一條都沒改，全部列給你裁決。這就是鐵律：不准偷改答案卷。', r => { to(r, r.S[2]); only(r, r.c1) }],
  ['需要你拍板的，AI 最後用選擇題問你。例如：數量預設 0，要不要補進 PRD。這一題課程已經拍板，現在的 PRD 已經補上了。', r => { to(r, r.S[3]); only(r, r.d1, r.d2); show(r.prdfix) }],
  ['所以你只做三件事：看報告、做裁決、自己在瀏覽器點一遍。', r => { only(r); hide(r.prdfix); show(r.you); glow(r.you) }],
])

scene('驗收不用打指令：照表用眼睛核', () => {
  const r = {}; mhead('step4 ⑥', '驗收不用打指令：照表用眼睛核')
  r.bw = bwin(['br09-handbook-check', 'ea01-list'], 'HANDBOOK.html#step4'); r.B = r.bw.S
  r.h1 = hl(r, r.B[0], 'table', '', { col: OR })
  r.hcap = tip('手冊 step4「你應該看到」這張表', { y: 806, size: 30, col: OR })
  r.h2 = hl(r, r.B[0], 'review', '對抗審查有做', { col: C.violet, size: 28, above: true })
  r.h3 = hl(r, r.B[0], 'click', '畫面真的能用：自己點一遍', { col: OR, size: 28, above: true })
  r.h4 = hl(r, r.B[0], 'green', '7 passed＝測試檔跟基準一致', { col: C.green, size: 28, above: true })
  r.e1 = tip('列表、新增、編輯、刪除各點一次；報告寫的改動多看一眼', { y: 806, size: 28, col: C.teal })
  return r
}, [
  ['最後驗收，不用打任何指令。照手冊這張表，用眼睛核。', r => { show(r.bw.g); show(r.B[0]); show(r.hcap); later(300, () => only(r, r.h1)) }],
  ['對抗審查有做：報告要寫分身挑到什麼。App 的問題修了沒，測試的問題有沒有列給你。', r => { hide(r.hcap); only(r, r.h2) }],
  ['畫面真的能用：打開 localhost:3100/equipment/crud，自己點一遍。', r => only(r, r.h3)],
  ['列表、新增、編輯、刪除，各點一次。報告寫的那幾個改動，多看一眼。', r => { only(r); burl(r.bw, 'localhost:3100/equipment/crud', true); swap(r.B, r.B[1]); show(r.e1) }],
  ['最後要有 7 passed。測試腳本開跑前，會先比對測試檔和基準，對不上就拒跑。所以 7 passed 代表測試檔跟基準一致。AI 如果連基準一起重算，還是騙得過，所以報告也要看。', r => { hide(r.e1); burl(r.bw, 'HANDBOOK.html#step4'); swap(r.B, r.B[0]); only(r, r.h4) }],
])
