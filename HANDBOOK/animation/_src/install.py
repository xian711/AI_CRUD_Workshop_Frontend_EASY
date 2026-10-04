# 把做好的動畫裝進課程 repo：HANDBOOK/animation/（index.html＋images＋_src）
# 用法：python install.py [repo 根目錄]
import os, re, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = sys.argv[1] if len(sys.argv) > 1 else r'D:\AIWORK\_AICLASS\AI_CRUD_Workshop_Frontend_EASY'
DST = os.path.join(REPO, 'HANDBOOK', 'animation')
OUT = os.path.join(HERE, 'out')

# 只放場景真的用到的截圖
src = open(os.path.join(HERE, 'scenes-all.js'), encoding='utf-8').read()
imgs = [f[:-4] for f in os.listdir(os.path.join(OUT, 'images')) if f.endswith('.jpg')]
used = sorted(n for n in imgs if re.search(r"['\"]" + re.escape(n) + r"['\"]", src))

if os.path.exists(DST):
    shutil.rmtree(DST)
os.makedirs(os.path.join(DST, 'images'))
os.makedirs(os.path.join(DST, '_src'))
shutil.copy(os.path.join(OUT, 'anim.html'), os.path.join(DST, 'index.html'))
for n in used:
    shutil.copy(os.path.join(OUT, 'images', n + '.jpg'), os.path.join(DST, 'images', n + '.jpg'))

# 原始檔：場景、繪圖工具、播放器、組裝與截圖腳本（不含實拍原圖 raw/，也不含本機專用的腳本）
SRC_FILES = ['scenes.js', 'scenes-b.js', 'scenes-c.js', 'scenes-d.js', 'scenes-e.js', 'scenes-f.js', 'scenes-g.js', 'scenes-all.js',
             'helpers.js', 'helpers-crud.js', 'engine-crud.html', 'after.html',
             'mk.sh', 'prep.py', 'build.py', 'check.mjs', 'sheet.py', 'export-index.mjs', 't-pause.mjs', 'install.py',
             'vsc-lib.mjs', 'driver.mjs', 'send.mjs', 'waitidle.sh', 'dlg.ps1', 'ocr-find.ps1',
             'cap-a1.mjs', 'cap-a2.mjs', 'cap-a3.mjs', 'cap-a4.mjs', 'cap-a5.mjs', 'cap-b.mjs', 'cap-b2.mjs', 'cap-b3.mjs', 'cap-b4.mjs', 'cap-c1.mjs', 'cap-c4.mjs', 'waitidle2.sh', 'c-busy2.json',
             'handbook-blocks.json']
for f in SRC_FILES:
    p = os.path.join(HERE, f)
    if os.path.exists(p):
        shutil.copy(p, os.path.join(DST, '_src', f))
shutil.copy(os.path.join(OUT, 'meta.json'), os.path.join(DST, '_src', 'meta.json'))
shutil.copy(os.path.join(HERE, 'raw', 'meta-extra.json'), os.path.join(DST, '_src', 'meta-extra.json'))
shutil.copy(os.path.join(HERE, 'SRC-README.md'), os.path.join(DST, '_src', 'README.md'))

# 安全檢查：帳號名稱不能出現在要放進 repo 的文字檔裡
user = os.environ.get('USERNAME', '')
bad = []
for root, _, files in os.walk(DST):
    for f in files:
        if f.endswith(('.jpg', '.png')):
            continue
        t = open(os.path.join(root, f), encoding='utf-8', errors='ignore').read()
        for m in re.finditer(r'(?i)users[\\/]+' + re.escape(user), t):
            bad.append((f, m.group(0)))
size = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(DST) for f in fs)
print('installed', DST, 'images', len(used), 'size %.1f MB' % (size / 1e6))
print('personal-path hits:', bad or 'none')
