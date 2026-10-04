// ── 場景檔第七部分：對抗審查、Step 5 總結 ──
scene('對抗審查：找第二個 AI 挑錯', () => {
  const r = {}; mhead('step4 ⑤', '對抗審查：寫程式的 AI 不審自己')
  r.p1 = card(70, 140, 700, 230, '比喻：自己改自己的考卷', ['分數一定偏高', '要請另一位老師來挑錯'], C.gold, { size: 30, ts: 36 })
  r.p2 = card(830, 140, 700, 230, '做法', ['開第二個 AI（例如 Codex）', '貼手冊的對抗審查 prompt'], C.teal, { size: 30, ts: 36 })
  r.prompt = codeCard(70, 400, 1460, ['你的任務是「盡力推翻」step4_loop_e2e/e2e 這套 E2E 測試，不是誇獎它。專找三種問題：', '假綠（斷言太鬆、選到隱藏節點、等到的是別的元素）、猜的 selector（靠 nth 這種一改版就碎的寫法）、', '測試互相污染（前一條的資料影響後一條）。', '逐條給可被推翻的具體理由，能重現就附步驟；找不到問題也要說明你怎麼確認的。'], { title: '手冊 step4 的對抗審查 prompt', size: 25, col: C.violet })
  r.loop = box(L, 70, 730, 1460, 140, 'App 的問題 → 交回原本的 AI 修 → 再跑 E2E → 再審\n測試本身的問題 → 不叫 AI 改，停下來交給講師裁決', { size: 30, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  ['最後一關：寫程式的 AI，不適合審自己的作業。就像自己改自己的考卷，分數一定偏高。', r => show(r.p1)],
  ['所以開第二個 AI，例如 Codex，貼上手冊的對抗審查 prompt。', r => { show([r.p2, r.prompt]) }],
  ['它會專找三種問題：標準太鬆的假綠、一改版就壞的寫法、還有測試之間互相影響。', r => glow(r.prompt)],
  ['它找出的問題分兩種。App 的問題，交回原本的 AI 修，再跑、再審。測試本身的問題，不要叫 AI 改，停下來交給講師裁決。', r => { show(r.loop); glow(r.loop) }],
])

chapter('Step 5', '總結', C.green)

scene('你的心力花在頭和尾', () => {
  const r = {}; mhead('step5 ①', '你的心力，花在頭和尾')
  const vF = fitF('hb-step5-value', { x: 70, y: 125, w: 1460, h: 600 })
  r.v = scr('hb-step5-value', vF); r.S = [r.v]
  r.steps = [['把四份規矩帶進你的專案', ['改成你們公司的', '色票、命名、禁止事項']], ['把最成熟的頁面整理成範本', ['分出「複製區」', '和「共用區」']], ['新需求照這套流程走', ['PRD → 選擇題', '→ 生成 → LOOP 驗證']]].map(([h, s], i) => card(70 + i * 495, 150, 465, 230, (i + 1) + '. ' + h, s, [C.teal, C.gold, C.coral][i], { size: 32, ts: 30, lh: 50 }))
  r.s6 = tip('課後驗收題：step6_survey，一個人做一個課程回饋問卷，並發布上線', { y: 420, size: 30, col: C.green })
  return r
}, [
  ['最後總結。你的心力，該花在兩端。', r => show(r.v)],
  ['頭，是講清楚要什麼：三個決定由你拍板。尾，是驗收：燈亮不等於做對。', r => glow(r.v)],
  ['中間的複製改名、寫欄位、修到全綠，交給 AI。', r => glow(r.v)],
  ['回公司三步：先把四份規矩帶進你的專案，改成你們公司的規則。', r => { hide(r.v); show(r.steps[0]) }],
  ['再把最成熟的頁面整理成範本；之後的新需求，都照這套流程走。', r => { show(r.steps[1]); later(900, () => show(r.steps[2])) }],
  ['課後驗收題在 step6_survey：一個人做一個課程回饋問卷，並發布上線。', r => show(r.s6)],
])

scene('記住四句話', () => {
  const r = {}; mhead('總結', '記住四句話')
  const L4 = [['範本給骨架', '複製改名就有列表、表單、驗證、匯出', C.teal], ['harness 給規矩', '四份規矩跟著專案走，AI 每次照做', C.gold], ['AI 出勞力', '寫程式、修到全綠，交給它', C.coral], ['最後由你驗收', '燈亮不等於做對', C.green]]
  r.rows = L4.map(([a, b, col], i) => { const g = grp(L); const y = 150 + i * 175; R(g, 70, y, 1460, 150, { fill: C.card, stroke: col, sw: 5 })
    mk('circle', { cx: 150, cy: y + 75, r: 46, fill: col }, g); T(g, 150, y + 92, String(i + 1), { size: 46, anchor: 'middle', weight: 900, fill: C.bg })
    T(g, 230, y + 92, a, { size: 52, weight: 900 }); T(g, 760, y + 90, b, { size: 32, fill: C.mut }); return g })
  return r
}, [
  ['第一，範本給骨架。', r => show(r.rows[0])],
  ['第二，harness 給規矩。', r => show(r.rows[1])],
  ['第三，AI 出勞力。', r => show(r.rows[2])],
  ['第四，最後一定由你驗收。燈亮，不等於做對。', r => { show(r.rows[3]); glow(r.rows[3]) }],
])
