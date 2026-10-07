// ── 場景檔第七部分：對抗審查、Step 5 總結 ──
scene('備案：再請別家 AI 審一次', () => {
  const r = {}; mhead('step4 ⑦', '想更放心：再請別家 AI 審一次')
  r.p1 = card(70, 140, 700, 230, '子代理＝同一家 AI 的分身', ['一個指令就做完，很方便', '但想法可能跟自己很像'], C.gold, { size: 30, ts: 36 })
  r.p2 = card(830, 140, 700, 230, '備案：找別家 AI（例如 Codex）', ['工具不能開子代理時', '或想要第二意見時'], C.teal, { size: 30, ts: 36 })
  r.prompt = codeCard(70, 400, 1460, ['請盡力挑 step4_loop_e2e/e2e 這套 E2E 測試，和 step3_new_module/my-equipment-app 的毛病，不要誇獎。', '測試專找：假綠（斷言太鬆、選錯元素）、一改版就壞的 selector（例如靠 nth）、測試互相影響。', 'App 專找：測試沒抓到、但不符合 PRD-中心裝備物資.md 的問題。', '每條附理由，能重現就附步驟；只回報，不改檔；找不到也說明你怎麼確認的。'], { title: '手冊 step4 的備案 prompt：貼給別家 AI', size: 24, col: C.violet })
  r.loop = box(L, 70, 730, 1460, 140, 'App 的問題 → 交回原本的 AI 修 → 再跑 E2E → 再審\n測試本身的問題 → 不叫 AI 改，停下來交給講師裁決', { size: 30, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  ['子代理是同一家 AI 的分身。一個指令就做完，很方便，但想法可能跟自己很像。', r => show(r.p1)],
  ['想更放心，或你用的工具不能開子代理，就開別家的 AI，例如 Codex，貼手冊這段短 prompt。', r => { show([r.p2, r.prompt]) }],
  ['它會挑兩邊：測試的假綠、一改版就壞的寫法、測試互相影響；還有測試沒抓到、不符合 PRD 的 App 問題。', r => glow(r.prompt)],
  ['挑到的問題，一樣分兩種。App 的問題，交回原本的 AI 修，再跑、再審。測試本身的問題，不要叫 AI 改，交給講師裁決。', r => { show(r.loop); glow(r.loop) }],
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
  ['中間的複製改名、寫欄位、修到全綠、互相挑錯，交給 AI。規矩和範本放好，AI 自己就有 know-how，不用你一步一步教。', r => glow(r.v)],
  ['回公司三步：先把四份規矩帶進你的專案，改成你們公司的規則。', r => { hide(r.v); show(r.steps[0]) }],
  ['再把最成熟的頁面整理成範本；之後的新需求，都照這套流程走。', r => { show(r.steps[1]); later(900, () => show(r.steps[2])) }],
  ['課後驗收題在 step6_survey：一個人做一個課程回饋問卷，並發布上線。', r => show(r.s6)],
])

scene('記住四句話', () => {
  const r = {}; mhead('總結', '記住四句話')
  const L4 = [['範本給骨架', '複製改名就有列表、表單、驗證、匯出', C.teal], ['harness 給規矩', '四份規矩跟著專案走，AI 每次照做', C.gold], ['AI 出勞力', '寫程式、修到全綠、互相挑錯，交給它', C.coral], ['最後由你驗收', '燈亮不等於做對', C.green]]
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
