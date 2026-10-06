# 第三版補拍 C7：SRS、SDD 的 Markdown 預覽，一段一張；預覽裡把 git 帳號換成「你的帳號」（只改畫面，不改檔案）
import json
FR = 'vscode-webview'
MASK = """(() => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n, k = 0;
  while ((n = w.nextNode())) { if (/CJ-?\\s*831/.test(n.nodeValue)) { n.nodeValue = n.nodeValue.replace(/CJ-?\\s*831/g, '你的帳號'); k++; } } return k })()"""
GO = """(t => { const h = [...document.querySelectorAll('h1,h2,h3')].find(e => e.textContent.trim().startsWith(t));
  if (!h) return 'none'; window.scrollTo(0, h.getBoundingClientRect().top + window.scrollY - %d); return h.textContent.trim().slice(0, 30) })(%s)"""
F = 'Control+Alt+Shift+'


def go(text, up=12):
    return [{'a': 'feval', 'frameRe': FR, 'js': GO % (up, json.dumps(text))}, {'a': 'wait', 'ms': 700}]


def B(sel, **k):  # 預覽裡的元件外框
    return {'frameRe': FR, 'sel': sel, **k}


def open_doc(name):
    return [{'a': 'key', 'key': F + 'F8'}, {'a': 'wait', 'ms': 900},
            {'a': 'key', 'key': 'Control+p'}, {'a': 'wait', 'ms': 800}, {'a': 'type', 'text': name, 'delay': 40}, {'a': 'wait', 'ms': 1200},
            {'a': 'key', 'key': 'Enter'}, {'a': 'wait', 'ms': 1800}, {'a': 'key', 'key': F + 'F6'}, {'a': 'wait', 'ms': 3000},
            {'a': 'feval', 'frameRe': FR, 'js': MASK}, {'a': 'wait', 'ms': 300}]


cmds = []
# 側邊欄收起來，預覽才夠寬
cmds += [{'a': 'click', 'sel': ".part.activitybar .action-item a[aria-label*='檔案總管']"}, {'a': 'wait', 'ms': 800}]
cmds += open_doc('SRS-')
cmds += go('1. 已拍板決策') + [{'a': 'shot', 'name': 'v3-srs-decisions', 'boxes': {
    'h': B('h2:has-text("已拍板決策")'), 'table': B('h2:has-text("已拍板決策") ~ table'), 'note': B('h2:has-text("已拍板決策") ~ blockquote'),
    'who': B('h2:has-text("已拍板決策") ~ table th:last-child')}}]
cmds += go('2.1 PRD 第 2 節') + [{'a': 'shot', 'name': 'v3-srs-trace', 'boxes': {
    'h2': B('h2:has-text("需求追溯")'), 'h': B('h3:has-text("2.1")'), 'table': B('h3:has-text("2.1") ~ table'), 'where': B('h3:has-text("2.1") ~ table th:nth-child(3)')}}]
cmds += go('2.3 PRD 第 6 節') + [{'a': 'shot', 'name': 'v3-srs-accept', 'boxes': {
    'h': B('h3:has-text("2.3")'), 'note': B('h3:has-text("2.3") ~ blockquote'), 'table': B('h3:has-text("2.3") ~ table')}}]
cmds += go('3. 範圍外') + [{'a': 'shot', 'name': 'v3-srs-scope', 'boxes': {'h': B('h2:has-text("範圍外")'), 'table': B('h2:has-text("範圍外") ~ table')}}]
cmds += go('4. 待定與風險') + [{'a': 'shot', 'name': 'v3-srs-risk', 'boxes': {'h': B('h2:has-text("待定與風險")'),
    'qty': B('li', hasText='數量新增時預設 0'), 'date': B('li', hasText='採購日期只打一半')}}]
cmds += open_doc('SDD-')
cmds += go('1. 檔案責任') + [{'a': 'shot', 'name': 'v3-sdd-files', 'boxes': {'h': B('h2:has-text("檔案責任")'), 'table': B('h2:has-text("檔案責任") ~ table'),
    'shared': B('tr', hasText='useTemplateListPage.ts'), 'used': B('h2:has-text("檔案責任") ~ table th:last-child')}}]
cmds += go('2.4 品項編碼規則') + [{'a': 'shot', 'name': 'v3-sdd-code', 'boxes': {'h': B('h3:has-text("2.4")'), 'h2': B('h2:has-text("資料模型")')}}]
cmds += go('4. 遵守 harness 的證據') + [{'a': 'shot', 'name': 'v3-sdd-evidence', 'boxes': {'h': B('h2:has-text("遵守 harness")'), 'table': B('h2:has-text("遵守 harness") ~ table'),
    'hex': B('tr', hasText='禁止硬編碼色碼'), 'log': B('tr', hasText='禁止 `console.log`'), 'shared': B('tr', hasText='共用檔未修改'), 'lines': B('tr', hasText='單檔行數')}}]
cmds += [{'a': 'feval', 'frameRe': FR, 'js': "(() => { const t = [...document.querySelectorAll('tr')].find(r => r.textContent.includes('單檔行數')); if (!t) return 'none'; window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY - 160); return 'ok' })()"},
         {'a': 'wait', 'ms': 700}, {'a': 'shot', 'name': 'v3-sdd-loopnote', 'boxes': {'lines': B('tr', hasText='單檔行數'), 'shared': B('tr', hasText='共用檔未修改')}}]
json.dump(cmds, open('c7b.json', 'w', encoding='utf-8'), ensure_ascii=False)
print(len(cmds))
