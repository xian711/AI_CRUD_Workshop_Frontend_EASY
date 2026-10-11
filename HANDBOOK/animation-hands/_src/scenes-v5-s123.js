// ════════════════════════════ Step 1 ════════════════════════════
chapter('Step 1', '看差別', C.coral)

sc3(8, () => {
  const r = {}; hd(8, 'step1')
  const [a] = vsh(r, ['vs15-start-demo'])
  r.a1 = hl(r, a, 'cmd', 'start：用瀏覽器打開', { col: C.gold, above: true, size: 28 })
  r.k = cmdCard(120, 650, 1360, ['cd ..', 'start step1_why_harness\\demo\\no-harness.html', 'start step1_why_harness\\demo\\with-harness.html'], '一行貼一次、按 Enter（macOS 把 start 換成 open）', { size: 28 })
  const A1 = { x: 40, y: 150, w: 750, h: 470, bar: 56 }, A2 = { x: 810, y: 150, w: 750, h: 470, bar: 56 }
  r.b1 = bwin(['br10-noh'], 'no-harness.html', A1); r.b2 = bwin(['br13-wh'], 'with-harness.html', A2)
  show(r.b1.S[0]); show(r.b2.S[0])
  r.l1 = T(L, 415, 670, '沒給規矩', { size: 40, anchor: 'middle', weight: 900, fill: C.coral }); r.l1.classList.add('hid')
  r.l2 = T(L, 1185, 670, '附了規矩', { size: 40, anchor: 'middle', weight: 900, fill: C.teal }); r.l2.classList.add('hid')
  r.c1 = hl(r, r.b1.S[0], 'add', '主色橘：AI 自己挑的', { col: OR, below: true, size: 26 })
  r.c2 = hl(r, r.b2.S[0], 'add', '品牌紅：規矩指定的', { col: OR, below: true, size: 26 })
  return r
}, [
  r => { show([r.S[0], r.k]); later(500, () => only(r, r.a1)) },
  r => { only(r); hide([r.S[0], r.k]); show([r.b1.g, r.b2.g, r.l1, r.l2]) },
  r => { zoom(r.b1.S[0], 'add', { pad: 90, max: 2.4 }); zoom(r.b2.S[0], 'add', { pad: 90, max: 2.4 }); only(r, r.c1, r.c2) },
])

sc3(9, () => {
  const r = {}; hd(9, 'step1')
  r.bw = bwin(['br10-noh', 'br12-noh-added', 'br14-wh-empty-submit', 'br15-wh-phone-blocked', 'br16-wh-landline-ok'], 'no-harness.html'); r.B = r.bw.S
  r.a1 = hl(r, r.B[0], 'blood', '左：一打開就選好「A」', { col: C.red, below: true, size: 30 })
  r.a2 = hl(r, r.B[1], 'phoneCell', '322-1234 忘了區碼：也收進去', { col: C.red, below: true, size: 28 })
  r.b1 = hl(r, r.B[2], 'bloodErr', '右：什麼都不填 → 姓名、電話、血型都擋下來', { col: OR, below: true, size: 30, pad: 6 })
  r.b2 = hl(r, r.B[2], 'nameErr', '', { col: OR })
  r.c1 = hl(r, r.B[3], 'phoneErr', '322-1234 → 擋：市話要加區碼', { col: OR, below: true, size: 28 })
  r.d1 = hl(r, r.B[4], 'row', '(02) 1234-5678 → 收：市話也是電話', { col: C.green, above: true, size: 28 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); zoom(r.B[0], 'blood', { pad: 160, max: 1.8 }); only(r, r.a1); later(4200, () => { unzoom(r.B[0]); swap(r.B, r.B[1]); only(r, r.a2) }) },
  r => { burl(r.bw, 'with-harness.html'); swap(r.B, r.B[2]); only(r, r.b1, r.b2) },
  r => { swap(r.B, r.B[3]); zoom(r.B[3], 'phoneErr', { pad: 140, max: 1.8 }); only(r, r.c1) },
  r => { unzoom(r.B[3]); swap(r.B, r.B[4]); only(r, r.d1) },
])

sc3(10, () => {
  const r = {}; hd(10, 'step1 ・ 規矩寫在哪')
  r.bw = bwin(['br14-wh-empty-submit'], 'with-harness.html'); r.B = r.bw.S
  r.e1 = hl(r, r.B[0], 'bloodErr', '請選擇血型：不是 AI 剛好做對，是規矩寫的', { col: C.gold, below: true, size: 28 })
  r.rule = box(L, 70, 140, 1460, 200, '下拉選單新增時一律空白，顯示「請選擇」\n不准預設帶第一個；規格寫了預設值和理由才可以帶', { size: 36, fill: C.card, stroke: C.gold, color: C.ink, weight: 900 })
  r.where = ['step1 的 PROMPT.md 版本 B【表單互動】', '範本 CLAUDE.md「程式規則」第 11 條', 'CODE-RULES、design-system-summary'].map((t, i) => card(70 + i * 495, 380, 475, 150, ['寫在 ①', '寫在 ②', '寫在 ③'][i], [t], C.teal, { size: 26, ts: 30 }))
  r.md = scr('v5-claude-md-rule11', fitF('v5-claude-md-rule11', { x: 220, y: 130, w: 1160, h: 650 }))
  r.m1 = hl(r, r.md, [380, 100, 690, 92], 'CLAUDE.md 第 11 條：選項欄位不准預設帶第一個', { col: C.gold, below: true, size: 26 })
  r.why = box(L, 70, 590, 1460, 160, '理由：帶了預設值，使用者沒改就送出\n存進去的就是錯的資料，而且當場不會報錯', { size: 34, fill: '#3a1f1f', stroke: C.red, color: C.ink, weight: 900 })
  return r
}, [
  r => { show(r.bw.g); show(r.B[0]); zoom(r.B[0], 'bloodErr', { pad: 150, max: 1.8 }); later(300, () => only(r, r.e1)) },
  r => { only(r); hide(r.bw.g); show(r.rule); glow(r.rule) },
  r => { hide(r.rule); stagger(r.where, 400); later(2600, () => { hide(r.where); show(r.md); later(400, () => only(r, r.m1)) }) },
  r => { only(r); hide(r.md); show(r.why); glow(r.why) },
])

sc3(11, () => {
  const r = {}; hd(11, 'step1 ・ 檢查點')
  r.q = box(L, 70, 180, 1460, 220, '差的不是好不好看\n是「這個決定是誰做的」', { size: 54, fill: C.card, stroke: C.gold, color: C.ink, weight: 900 })
  r.two = [['附了規矩', '顏色、驗證都查得到出處', C.teal], ['沒給規矩', '全是 AI 當場自己決定', C.coral]].map(([h, s, col], i) => card(120 + i * 690, 460, 670, 180, h, [s], col, { size: 32, ts: 40 }))
  return r
}, [
  r => { show(r.q); glow(r.q) },
  r => { stagger(r.two, 500) },
])
