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
  const t = tip(tipText, { y: 806, size: 30, col: C.gold })
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
  r.d1 = hl(r, r.B[0], [86, 86, 645, 28], '每一題都附當下的畫面', { col: OR, below: true, right: true, size: 26 })
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
  r.tea = box(L, 70, 430, 1460, 140, 'LOOP 跑的時候，你可以去喝茶\n回來看報告、自己點一遍', { size: 38, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.two = [['頭', '講清楚要什麼、拍板', C.gold], ['尾', '驗收', C.green]].map(([h, s, col], i) => card(120 + i * 690, 610, 670, 160, h, [s], col, { size: 32, ts: 40 }))
  return r
}, [
  r => { stagger(r.n.slice(0, 1), 300); later(500, () => show(r.spec)) },
  r => { stagger(r.n.slice(1, 5), 300) },
  r => { stagger(r.n.slice(5), 300); later(600, () => { show(r.tea); glow(r.tea) }) },
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
