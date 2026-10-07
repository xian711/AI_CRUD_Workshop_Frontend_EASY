# 第四版補拍 C8：SRS、設計文件、TASKS 的 Markdown 預覽，一段一張；預覽裡把 git 帳號換成「你的帳號」（只改畫面，不改檔案）
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
# 側邊欄收起來，預覽才夠寬（點一下檔案總管圖示會收合側邊欄）
cmds += [{'a': 'click', 'sel': ".part.activitybar .action-item a[aria-label*='檔案總管']"}, {'a': 'wait', 'ms': 800}]
cmds += open_doc('SRS-中心')
cmds += [{'a': 'shot', 'name': 'v4-srs-open', 'boxes': {'h1': B('h1'), 'tab': '.tabs-container .tab.active'}}]
cmds += go('1. 已拍板決策') + [{'a': 'shot', 'name': 'v4-srs-decisions', 'boxes': {
    'h': B('h2:has-text("已拍板決策")'), 'h3': B('h3:has-text("1.1")'), 'table': B('h3:has-text("1.1") ~ table'),
    'who': B('h3:has-text("1.1") ~ table th:last-child')}}]
cmds += go('1.2 釐清問答') + [{'a': 'shot', 'name': 'v4-srs-q', 'boxes': {
    'h': B('h3:has-text("1.2")'), 'table': B('h3:has-text("1.2") ~ table'), 'q7': B('tr', hasText='單筆主鍵')}}]
cmds += go('2.1 PRD 第 2 節') + [{'a': 'shot', 'name': 'v4-srs-trace', 'boxes': {
    'h2': B('h2:has-text("需求追溯")'), 'h': B('h3:has-text("2.1")'), 'table': B('h3:has-text("2.1") ~ table'), 'where': B('h3:has-text("2.1") ~ table th:nth-child(3)'),
    'done': B('h3:has-text("2.1") ~ table th:nth-child(2)')}}]
cmds += go('2.3 PRD 第 6 節') + [{'a': 'shot', 'name': 'v4-srs-accept', 'boxes': {
    'h': B('h3:has-text("2.3")'), 'table': B('h3:has-text("2.3") ~ table')}}]
cmds += go('3. 範圍外') + [{'a': 'shot', 'name': 'v4-srs-scope', 'boxes': {'h': B('h2:has-text("範圍外")'), 'table': B('h2:has-text("範圍外") ~ table'), 'h3': B('h3:has-text("3.2")')}}]
cmds += go('4. 待定與風險') + [{'a': 'shot', 'name': 'v4-srs-risk', 'boxes': {'h': B('h2:has-text("待定與風險")'), 'table': B('h2:has-text("待定與風險") ~ table')}}]
cmds += open_doc('DESIGN-中心')
cmds += [{'a': 'shot', 'name': 'v4-design-open', 'boxes': {'h1': B('h1'), 'tab': '.tabs-container .tab.active', 'quote': B('blockquote')}}]
cmds += go('1. 檔案責任') + [{'a': 'shot', 'name': 'v4-design-files', 'boxes': {'h': B('h2:has-text("檔案責任")'), 'table': B('h3:has-text("1.1") ~ table'),
    'shared': B('tr', hasText='useTemplateListPage.ts'), 'used': B('h3:has-text("1.1") ~ table th:last-child')}}]
cmds += go('2.4 品項編碼') + [{'a': 'shot', 'name': 'v4-design-code', 'boxes': {'h': B('h3:has-text("2.4")'), 'list': B('h3:has-text("2.4") ~ ol')}}]
cmds += go('4. 遵守 harness 的證據') + [{'a': 'shot', 'name': 'v4-design-evidence', 'boxes': {'h': B('h2:has-text("遵守 harness")'), 'table': B('h2:has-text("遵守 harness") ~ table'),
    'hex': B('tr', hasText='禁止硬編碼色碼'), 'log': B('tr', hasText='禁止 `console.log`'), 'shared': B('tr', hasText='三個共用檔未修改'), 'lines': B('tr', hasText='單檔行數'), 'result': B('h2:has-text("遵守 harness") ~ table th:last-child')}}]
cmds += open_doc('TASKS')
cmds += [{'a': 'shot', 'name': 'v4-tasks', 'boxes': {'h1': B('h1'), 'table': B('table'), 't0': B('tr', hasText='T0'), 't13': B('tr', hasText='T13'), 'status': B('table th:last-child')}}]
json.dump(cmds, open('c8.json', 'w', encoding='utf-8'), ensure_ascii=False)
print(len(cmds))
