# 第五版：選擇題逐題拍照＋作答（產生 driver 指令）
# 用法：python mk-v5-q.py 前綴 題1標籤 動作1 [題2標籤 動作2 ...] > 指令檔
#   動作：rec＝選標「建議」的；opt:文字＝選含這段文字的選項；other:文字＝選 Other 並輸入；skip＝只拍不答
#   最後一定按 Submit answers
import json, sys
if sys.argv[1].endswith('.json'):
    spec = json.load(open(sys.argv[1], encoding='utf-8')); P = spec['prefix']; pairs = spec['pairs']
else:
    P = sys.argv[1]
    pairs = list(zip(sys.argv[2::2], sys.argv[3::2]))
W = {'frame': True, 'purpose': 'webviewPanel'}
cmds = []
CLICK_TAB = "(t=>{const e=[...document.querySelectorAll('button,[role=tab],div,span')].filter(x=>x.getBoundingClientRect().width&&x.childElementCount===0&&x.textContent.trim()===t)[0]; if(!e) return 'no tab '+t; e.click(); return 'tab '+t})(%s)"
PICK = "(t=>{const r=[...document.querySelectorAll('[role=radio],[role=checkbox]')].filter(e=>e.getBoundingClientRect().width&&e.innerText.includes(t)); const e=r[r.length-1]; if(!e) return 'none '+t; e.click(); return 'clicked '+e.innerText.slice(0,40)})(%s)"
FOCUS_OTHER = "(()=>{const e=[...document.querySelectorAll('[contenteditable]')].filter(x=>x.getBoundingClientRect().height>0)[0]; if(!e) return 'no other field'; e.scrollIntoView({block:'center'}); e.focus(); const r=document.createRange(); r.selectNodeContents(e); const s=getSelection(); s.removeAllRanges(); s.addRange(r); return 'focused'})()"
for i, (tab, act) in enumerate(pairs, 1):
    cmds += [{'a': 'feval', **{k: v for k, v in W.items() if k != 'frame'}, 'js': CLICK_TAB % json.dumps(tab)}, {'a': 'wait', 'ms': 1200}]
    cmds += [{'a': 'shot', 'name': f'{P}-q{i}', 'boxes': {
        'tab': {**W, 'text': tab, 'exact': True},
        'rec': {**W, 'sel': '[role=radio]', 'hasText': '(建議)', 'last': True},
        'other': {**W, 'sel': '[role=radio]', 'hasText': 'Other', 'last': True},
        'submit': {**W, 'text': 'Submit answers', 'exact': False, 'last': True}}}]
    if act == 'skip':
        continue
    if act == 'rec':
        cmds += [{'a': 'feval', 'purpose': 'webviewPanel', 'js': PICK % json.dumps('(建議)')}]
    elif act.startswith('opt:'):
        cmds += [{'a': 'feval', 'purpose': 'webviewPanel', 'js': PICK % json.dumps(act[4:])}]
    elif act.startswith('other:'):
        cmds += [{'a': 'feval', 'purpose': 'webviewPanel', 'js': PICK % json.dumps('Other')}, {'a': 'wait', 'ms': 900},
                 {'a': 'feval', 'purpose': 'webviewPanel', 'js': FOCUS_OTHER}, {'a': 'wait', 'ms': 400},
                 {'a': 'paste', 'text': act[6:]}, {'a': 'wait', 'ms': 900}]
    cmds += [{'a': 'wait', 'ms': 1500}, {'a': 'shot', 'name': f'{P}-q{i}-ans'}]
cmds += [{'a': 'shot', 'name': f'{P}-all-answered'}]
open('q-ans.json', 'w', encoding='utf-8').write(json.dumps(cmds, ensure_ascii=False))
print(len(cmds), 'cmds')
