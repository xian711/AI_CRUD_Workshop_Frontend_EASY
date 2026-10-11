# 第五版：白話 PRD 與技術約定的 Markdown 預覽，一段一張（產生 driver 指令檔 q-v5-prd.json）
import json
FR = 'vscode-webview'
GO = """(t => { const h = [...document.querySelectorAll('h1,h2,h3')].find(e => e.textContent.trim().startsWith(t));
  if (!h) return 'none'; window.scrollTo(0, h.getBoundingClientRect().top + window.scrollY - %d); return h.textContent.trim().slice(0, 30) })(%s)"""
F = 'Control+Alt+Shift+'


def go(text, up=12):
    return [{'a': 'feval', 'frameRe': FR, 'js': GO % (up, json.dumps(text))}, {'a': 'wait', 'ms': 700}]


def B(sel, **k):
    return {'frameRe': FR, 'sel': sel, **k}


def open_doc(name):
    return [{'a': 'key', 'key': F + 'F8'}, {'a': 'wait', 'ms': 900},
            {'a': 'key', 'key': 'Control+p'}, {'a': 'wait', 'ms': 800}, {'a': 'type', 'text': name, 'delay': 40}, {'a': 'wait', 'ms': 1200},
            {'a': 'key', 'key': 'Enter'}, {'a': 'wait', 'ms': 1800}, {'a': 'key', 'key': F + 'F6'}, {'a': 'wait', 'ms': 3000}]


cmds = [{'a': 'click', 'sel': ".part.activitybar .action-item a[aria-label*='檔案總管']"}, {'a': 'wait', 'ms': 800}]
cmds += open_doc('PRD-')
cmds += [{'a': 'shot', 'name': 'v5-prd-who', 'boxes': {'h1': B('h1'), 'who': B('blockquote'), 'li2': B('blockquote li', nth=1), 'li3': B('blockquote li', nth=2)}}]
cmds += go('3. 每一樣東西') + [{'a': 'shot', 'name': 'v5-prd-fields', 'boxes': {
    'h': B('h2:has-text("3. 每一樣東西")'), 'table': B('h2:has-text("3. 每一樣東西") ~ table'),
    'code': B('tr', hasText='品項編碼'), 'phone': B('tr', hasText='保管人電話'), 'status': B('tr', hasText='正常、維修中'), 'qty': B('tr', hasText='目前有幾個')}}]
cmds += go('4. 分類和項目') + [{'a': 'shot', 'name': 'v5-prd-cats', 'boxes': {
    'h': B('h2:has-text("4. 分類和項目")'), 'table': B('h2:has-text("4. 分類和項目") ~ table'), 'pw': B('tr', hasText='供電及照明設備')}}]
cmds += go('5. 要能做什麼') + [{'a': 'shot', 'name': 'v5-prd-needs', 'boxes': {
    'h': B('h2:has-text("5. 要能做什麼")'), 'list': B('h2:has-text("5. 要能做什麼") ~ ol'), 'add': B('li', hasText='新增'), 'out': B('li', hasText='交清冊')}}]
cmds += go('6. 這一版不做') + [{'a': 'shot', 'name': 'v5-prd-scope', 'boxes': {
    'h6': B('h2:has-text("6. 這一版不做")'), 'h7': B('h2:has-text("7. 怎樣算做好")'), 'list7': B('h2:has-text("7. 怎樣算做好") ~ ol')}}]
cmds += open_doc('技術約定-')
cmds += [{'a': 'shot', 'name': 'v5-tech-top', 'boxes': {'h1': B('h1'), 'who': B('blockquote'), 'strong': B('blockquote strong')}}]
cmds += go('2. 欄位英文名') + [{'a': 'shot', 'name': 'v5-tech-fields', 'boxes': {
    'h': B('h2:has-text("2. 欄位英文名")'), 'table': B('h2:has-text("2. 欄位英文名") ~ table'), 'note': B('h2:has-text("2. 欄位英文名") ~ p strong')}}]
cmds += [{'a': 'key', 'key': F + 'F8'}, {'a': 'wait', 'ms': 600},
         {'a': 'click', 'sel': ".part.activitybar .action-item a[aria-label*='檔案總管']"}, {'a': 'wait', 'ms': 800}]
json.dump(cmds, open('q-v5-prd.json', 'w', encoding='utf-8'), ensure_ascii=False)
print(len(cmds), 'cmds')
