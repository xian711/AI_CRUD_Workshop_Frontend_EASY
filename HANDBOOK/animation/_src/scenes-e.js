// ── 場景檔第五部分：Step 4（LOOP）、Step 5（總結）──
chapter('Step 4', '讓 AI 自己修到全綠', C.violet)

scene('別再一問一答：AI 不是要你帶的新人', () => {
  const r = {}; mhead('step4 ①', '別再一問一答：AI 不是要你帶的新人')
  r.old = card(70, 140, 700, 330, '一問一答＝主管手把手帶新人', ['你問一句，它做一步', '每一步都要交代、要盯', '主管的時間全耗在教'], C.coral, { size: 32, ts: 36, lh: 56 })
  r.neu = card(830, 140, 700, 330, '規矩＋樣本＋LOOP＝有 SOP 的團隊', ['harness＝公司規定', '範本＝示範樣本', 'E2E 測試＝驗收標準'], C.green, { size: 32, ts: 34, lh: 56 })
  const g = grp(L); r.flow = g
  const steps = [['你下一個指令', C.gold], ['AI 做＋自己驗', C.teal], ['子代理挑錯', C.violet], ['你只看報告', C.green]]
  steps.forEach(([t, col], i) => { const x = 70 + i * 375; R(g, x, 560, 330, 110, { fill: C.card, stroke: col, sw: 4 }); T(g, x + 165, 628, t, { size: 34, anchor: 'middle', weight: 900, fill: col }); if (i) T(g, x - 22, 628, '→', { size: 44, anchor: 'middle', fill: C.mut }) })
  T(g, 800, 730, '子代理＝AI 自己叫出來的分身，專門做一件事；這裡專門挑錯', { size: 28, anchor: 'middle', fill: C.mut })
  r.save = box(L, 70, 770, 1460, 90, '省下的，是你一來一回交代、教學的時間', { size: 34, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  return r
}, [
  ['很多人用 AI 還在一問一答：你問一句，它做一步。', r => show(r.old)],
  ['這就像主管手把手帶新人，每一步都要交代、要盯，時間全耗在教。', r => glow(r.old)],
  ['換個做法：規矩寫在 harness，示範樣本就是範本，驗收標準就是 E2E 測試。', r => show(r.neu)],
  ['這些放好了，AI 自己就有 know-how，會照公司規定走。', r => glow(r.neu)],
  ['你只下一個指令：AI 自己做、自己驗，再叫一個分身挑錯，最後交報告給你。', r => { show(r.flow); glow(r.flow) }],
  ['子代理，就是 AI 自己叫出來的分身，專門做一件事。省下的，是你一來一回交代、教學的時間。', r => { show(r.save); glow(r.save) }],
])

scene('LOOP 是什麼：自動閱卷機', () => {
  const r = {}; mhead('step4 ②', 'LOOP：讓 AI 自己「改 → 驗 → 再改」')
  const g = grp(L); r.flow = g
  const nodes = [['AI 改程式', 230, C.teal], ['跑 7 條 E2E 測試', 620, C.gold], ['全綠？', 1010, C.green]]
  nodes.forEach(([t, x, col]) => { R(g, x - 160, 190, 320, 110, { fill: C.card, stroke: col, sw: 4 }); T(g, x, 258, t, { size: 34, anchor: 'middle', weight: 900, fill: col }) })
  T(g, 425, 255, '→', { size: 48, anchor: 'middle', fill: C.mut }); T(g, 815, 255, '→', { size: 48, anchor: 'middle', fill: C.mut })
  R(g, 1240, 190, 300, 110, { fill: '#173a2a', stroke: C.green, sw: 4 }); T(g, 1390, 245, '是 → 子代理挑錯', { size: 30, anchor: 'middle', weight: 900, fill: C.green }); T(g, 1390, 282, '再交報告給你', { size: 26, anchor: 'middle' }); T(g, 1180, 255, '→', { size: 48, anchor: 'middle', fill: C.mut })
  mk('path', { d: 'M1010,300 v70 H230 v-70', fill: 'none', stroke: C.red, 'stroke-width': 5, 'marker-end': 'url(#ah-red)' }, g)
  T(g, 620, 400, '否（有紅燈）：AI 自己判斷原因、修好、再跑', { size: 30, anchor: 'middle', weight: 800, fill: C.red })
  r.exam = box(L, 70, 450, 1460, 110, '比喻：AI 自己寫考卷、交給自動閱卷機、看分數再改，直到 7 題全對', { size: 34, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })
  r.e2e = box(L, 70, 580, 1460, 90, '閱卷機＝ 7 條 E2E 測試：程式自己開瀏覽器，照使用者的順序點一遍，再判定對不對', { size: 29, fill: C.card, stroke: C.line, color: C.ink })
  r.rules = [['鐵律一：不准偷改答案卷', '不准改測試、不准放寬標準', C.red], ['鐵律二：同一題錯兩次就舉手', '停下來回報，換人判斷', C.coral]].map(([h, s, col], i) => card(70 + i * 740, 690, 720, 180, h, [s], col, { size: 30, ts: 36 }))
  return r
}, [
  ['step4 要讓 AI 自己跑「改程式、跑測試、再改」，這個循環叫 LOOP。', r => { show(r.flow) }],
  ['比喻：AI 自己寫考卷，交給自動閱卷機，看分數再改，直到全對。', r => { show(r.exam); glow(r.exam) }],
  ['閱卷機就是 7 條 E2E 測試：程式自己開一個瀏覽器，照使用者的順序點一遍，再判定對不對。', r => show(r.e2e)],
  ['全綠之後，AI 還會叫一個子代理來挑錯。沒有 LOOP，人要一直手動點、回報哪裡壞；有了 LOOP，人只看最後的結果。', r => glow(r.flow)],
  ['兩條鐵律。第一，不准偷改答案卷：不准改測試，也不准放寬標準。', r => show(r.rules[0])],
  ['第二，同一題錯兩次就舉手：停下來回報，換人判斷，不要無限撞牆。', r => show(r.rules[1])],
])
