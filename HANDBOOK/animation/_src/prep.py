"""把 raw/ 的實拍 PNG 轉成動畫用的 JPG（寬最多 1920，保留放大時的清晰度），並遮掉個資。
用法：python prep.py <輸出資料夾>   → <輸出>/images/*.jpg ＋ <輸出>/meta.json
"""
import json, os, sys, glob
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, 'raw')
out = sys.argv[1]
os.makedirs(os.path.join(out, 'images'), exist_ok=True)
meta = json.load(open(os.path.join(RAW, 'meta.json'), encoding='utf-8'))
extra = os.path.join(RAW, 'meta-extra.json')
if os.path.exists(extra):
    meta.update(json.load(open(extra, encoding='utf-8')))
SKIP = ('_', 'x', 'cc11-build-t')

# 個資處理：{檔名: [('crop', 左, 上, 右, 下) | ('fill', x0, y0, x1, y1, 顏色)]}（原始像素）
FIX = {
    'vs08-open-folder-dialog': [('fill', 14, 205, 300, 412, (255, 255, 255)), ('crop', 14, 0, None, None)],
    # Claude Code 的 Bash 指令露出 Windows 帳號（C:/Users/帳號/…）：蓋掉帳號，改寫成 user
    'cc11-progress': [('retext', 866, 648, 911, 669, 'user', (18, 19, 20), (191, 191, 191))],
    'cc12-done': [('retext', 876, 383, 924, 404, 'user', (18, 19, 20), (191, 191, 191))],
}
used = []
for f in sorted(glob.glob(os.path.join(RAW, '*.png'))):
    name = os.path.splitext(os.path.basename(f))[0]
    if name.startswith(SKIP) or name not in meta:
        continue
    im = Image.open(f).convert('RGB')
    for op in FIX.get(name, []):
        if op[0] == 'fill':
            ImageDraw.Draw(im).rectangle(op[1:5], fill=op[5])
        elif op[0] == 'retext':
            # ('retext', x0, y0, x1, y1, 新文字, 底色, 字色)：蓋掉一段字，再用等寬字型寫上新文字
            from PIL import ImageFont
            d = ImageDraw.Draw(im); d.rectangle(op[1:5], fill=op[6])
            d.text((op[1] + 2, op[2] + 1), op[5], font=ImageFont.truetype('consola.ttf', 19), fill=op[7])
        elif op[0] == 'crop':
            l, t, r, b = op[1], op[2], op[3] or im.size[0], op[4] or im.size[1]
            # meta 的座標是 CSS px；對話框的 meta 本來就是原始像素，一起位移
            m = meta[name]; sx = m['w'] / im.size[0]
            m['boxes'] = {k: ([v[0] - l * sx, v[1] - t * sx, v[2], v[3]] if v else v) for k, v in m['boxes'].items()}
            m['w'] = (r - l) * sx; m['h'] = (b - t) * sx
            im = im.crop((l, t, r, b))
    if im.size[0] > 1920:
        im = im.resize((1920, round(im.size[1] * 1920 / im.size[0])), Image.LANCZOS)
    im.save(os.path.join(out, 'images', name + '.jpg'), quality=82, optimize=True)
    used.append(name)
# 手冊裡的圖解（沿用講師做好的投影片圖）
HB = 'D:/AI_CRUD_Workshop_Frontend_EASY/HANDBOOK/images'
for src, name in [('step3_paradigm.jpg', 'hb-step3-paradigm'), ('step5_value_curve.jpg', 'hb-step5-value'), ('overview_metaphor.jpg', 'hb-overview')]:
    im = Image.open(os.path.join(HB, src)).convert('RGB')
    if im.size[0] > 1920:
        im = im.resize((1920, round(im.size[1] * 1920 / im.size[0])), Image.LANCZOS)
    im.save(os.path.join(out, 'images', name + '.jpg'), quality=84, optimize=True)
    meta[name] = {'w': im.size[0], 'h': im.size[1], 'boxes': {}}; used.append(name)
json.dump({k: meta[k] for k in used}, open(os.path.join(out, 'meta.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
tot = sum(os.path.getsize(os.path.join(out, 'images', n + '.jpg')) for n in used)
print(f'{len(used)} images, {tot // 1024} KB')
