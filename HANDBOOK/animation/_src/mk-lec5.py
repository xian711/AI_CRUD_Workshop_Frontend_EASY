# 講課版第五版：scenes-v4.js 的開頭＋第 1～4 段，接上 scenes-v5-lec-body.js（//@V4 n m ＝搬第四版第 n 段、改成第 m 段）
import re
v4 = open('scenes-v4.js', encoding='utf-8').read()
body = open('scenes-v5-lec-body.js', encoding='utf-8').read()

def block(n):
    i = v4.index(f'sc3({n}, () => {{')
    j = v4.index('\n])', i) + 3
    return v4[i:j]

def renum(txt, n, m):
    return txt.replace(f'sc3({n}, ', f'sc3({m}, ', 1).replace(f'hd({n}, ', f'hd({m}, ', 1)

def sub(mo):
    n, m = int(mo.group(1)), int(mo.group(2))
    b = renum(block(n), n, m)
    if n == 22:   # LOOP 規矩：多一段「修改前後、裁決附畫面」
        NL = chr(92) + 'n'   # JS 字串裡的換行記號
        txt = NL.join(['規矩檔還寫了兩件事', '修好的每一條：附修改前、修改後的圖', '要你裁決的題目：附當下的畫面'])
        b = b.replace("  return r\n}, [", "  r.two = box(L, 70, 520, 1460, 220, '" + txt + "', { size: 38, fill: '#2a2410', stroke: C.gold, color: C.gold, weight: 900 })\n  return r\n}, [", 1)
        b = b.replace("stagger(r.outs, 350) },\n])", "stagger(r.outs, 350) },\n  r => { hide([r.file, ...r.outs]); show(r.two); glow(r.two) },\n])", 1)
        assert 'r.two' in b and 'show(r.two)' in b
    return b

head = v4[:v4.index("// ════════════════════════════ Step 1")]
head = head.replace('手把手教學動畫 第四版', '講課版教學動畫 第五版（2026-10-11：白話 PRD＋AI 找缺口、五張中文圖、LOOP 修改前後、裁決附畫面）', 1)
head = head.replace('script_v4.py', 'script_v5.py', 1).replace('2026-10-04～07 在 Windows 11 實拍', '2026-10-04～11 在 Windows 11 實拍', 1)
out = head + re.sub(r'^//@V4 (\d+) (\d+)$', sub, body, flags=re.M)
open('scenes-v5.js', 'w', encoding='utf-8').write(out)
print('scenes', len(re.findall(r'^sc3\(', out, flags=re.M)))
