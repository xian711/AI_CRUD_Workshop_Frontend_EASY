# EVIDENCE — step4 E2E 建置實錄（真實 LOOP 紀錄）

> 這份是**建這門課時真實的 LOOP 過程**，不是事後補寫的漂亮話。
> 教學重點：寫 E2E 的正確順序是「先探 DOM、再寫 selector、跑到綠」，
> 而不是憑印象猜 selector、跑一堆紅再回頭救。

環境：solution-app dev server 已在 `http://localhost:3100` 常駐；Playwright chromium 已裝在本機。
資料層是記憶體 mock，**每次 page reload 重置為 24 筆種子**——所以每條測試各自 `goto` 後筆數穩定、互不污染（E3 新增的第 25 筆，reload 後自然消失）。

---

## LOOP 全貌（一句話）

| 輪 | 動作 | 結果 | 修了什麼 |
|----|------|------|----------|
| 0 | 讀原始碼（index.vue / [id].vue / composable / AppConfirmModal） | — | 掌握種子 24 筆、分類/項目連動、編碼規則、確認框結構 |
| 1 | probe 腳本抓列表 + 分類下拉 DOM | 綠（印出真實 DOM） | 確認下拉是 headless combobox、選項 `role=option` |
| 2 | probe 腳本抓 E3 全流程 + E4 錯誤 + E5 確認框 | 綠（印出真實值） | 確認編碼預覽＝`PW-GEN-003`、錯誤 id＝`#categoryKey-error`、確認框 `role=alertdialog` |
| 3 | 正式寫 6 條 `equipment.spec.ts` 跑全套 | **6 綠 / 0 紅** | 因為 selector 全是 probe 抓來的，不是猜的，第一次跑就全綠 |
| 4 | 套 `run-e2e.ps1` 端到端再跑一次 | **6 綠 / 0 紅，exit 0** | 驗證埠檢查、npm ci 跳過、總結解析都對 |

**結論**：紅字沒有出現在「正式測試」階段，而是被「probe 先探路」擋在前面。這正是要教的紀律——
**探路的成本，遠低於用死站點瞎猜 selector 反覆跑紅的成本。**

---

## 逐輪細節

### 輪 0 — 讀原始碼（不動手寫 selector）

先把要驗的東西的「事實」抓出來，才知道測試該斷言什麼：

- **種子筆數**：`useEquipmentItems.ts` 的 `SEED` 陣列數過＝ **24 筆**（E-001…E-024）→ 列表「共 24 筆」。
- **分類→項目連動**：分類 `供電及照明設備`(POWER) 的標準項目含 `發電機`；選了分類項目下拉才 enable。
- **編碼規則**：`nextEquipmentCode(POWER, 發電機)` ＝ 前綴 `PW-GEN-` 接下一流水；種子已有 `PW-GEN-001/002` → 新的是 **`PW-GEN-003`**。
- **確認框**：`AppConfirmModal` 是 `role="alertdialog"`，標題 `刪除品項`、確認鈕文字 `刪除`、取消鈕 `取消`。
- **錯誤訊息**：`EquipmentFormField` 把錯誤渲染成 `id="{name}-error"` → 分類必填錯誤在 `#categoryKey-error`，文字 `請選擇分類`。

### 輪 1／2 — probe 腳本抓真實 DOM（**動手前先看，不猜**）

寫一支拋棄式 `probe.spec.ts`，把關鍵 DOM 與互動結果直接 `console.log` 出來：

抓到的關鍵事實（節錄自 probe 輸出）：

```
=== 分類下拉：click 後 role=option 數量 === 10
=== 選項文字 === ['資通訊設備','供電及照明設備','儲物設備', ... ,'其他']
=== 項目下拉（選了供電後）=== ['發電機','行動太陽能電板組','儲能設備(主)','儲能設備(輔)','塔燈']
=== 編碼預覽 input value === PW-GEN-003
=== 空表單直接儲存 → url === http://localhost:3100/equipment/crud/new   （沒離頁）
=== #categoryKey-error === 請選擇分類
=== 刪除確認框 role=alertdialog visible === true（標題 刪除品項 / 取消 / 刪除 都在）
```

> **這一步擋掉的坑**：Nuxt UI 的 `USelectMenu` 是 headless combobox，觸發鈕是 `<div role=button>` 外包一顆原生 `<button>`，`searchable` 還會多一個 `input[role=combobox]`。
> 若憑印象用 `nth()` 位置索引點按鈕，很容易點到內層 button 或搜尋框而點不開清單，然後 `fill`/`click` 逾時。
> 因為先 probe 過，正式測試一律用「`[data-field="xxx"]` scope → 點第一顆 button → 用 `role=option` 選字」，穩定命中。

### 輪 3 — 正式 6 條測試（一次全綠）

刪掉 probe，寫進 `tests/equipment.spec.ts`（6 條，一條一個 CRUD 觀念）。第一次跑全套：

```
Running 6 tests using 1 worker
  6 passed (7.5s)
```

### 輪 4 — 套 run-e2e.ps1 端到端

```
=== 裝備物資 E2E（EASY 版｜6 條）===
檢查 http://localhost:3100 ...
PASS：solution-app 在 3100 埠、確認為本 App。
node_modules 已存在，跳過 npm ci。
Running Playwright（chromium）...

  ok 1 › E1 列表載入：/equipment/crud 顯示表格與「共 24 筆」 (820ms)
  ok 2 › E2 關鍵字篩選：輸入「發電機」縮小、清除後還原 (957ms)
  ok 3 › E3 新增品項：發電機建立成功並回列表（共 25 筆） (1.5s)
  ok 4 › E4 表單驗證：直接儲存出現「請選擇分類」且停在表單頁 (737ms)
  ok 5 › E5 刪除確認：取消不變、確認後 -1 (1.9s)
  ok 6 › E6 範本不回歸：/template/crud 正常載入含表格 (911ms)

  6 passed (7.4s)

E2E 全綠：6 條 passed / 0 條 failed。
EXITCODE=0
```

---

## 最終狀態

- **6 條全綠 / 0 紅**，`run-e2e.ps1` exit code = 0。
- 沒有為了過測試而改任何 solution-app 或 Live 資料夾的程式（紀律：修測試、不修 App）。
- **app 疑似 bug**：無。這一輪沒抓到需要回報的 App 問題。

## 測試資料常態化（重要觀念）

E3 新增了第 25 筆（`PW-GEN-003`），但因為資料層是**記憶體 mock**、
`ensureSeeded()` 在每次整頁載入時重置為 24 筆種子，
所以 E5、E6 各自 `goto` 進頁時又是乾淨的 24 筆——測試間不會互相污染，不需要手動清資料。
（真的接了後端資料庫後，這件事要改用「測試前後清資料 / 交易回滾 / 獨立測試庫」處理，不能靠 reload。）

---

## 對抗審查後補強（R1）

第二個 AI 用「盡力推翻」立場審完，逐條把可被灌水／過鬆的地方收緊，測試數由 6→7：

- **E2 補編碼斷言**：原本只驗名稱「發電機」縮到 2 筆；補上「用編碼 `PW-GEN` 搜也命中 2 筆且含 `PW-GEN-001`」，真正驗到「關鍵字比對名稱＋編碼」這條規則。
- **E5 改精準斷言**：刪除前先記下第一列品項編碼，確認後除了「筆數 -1」再斷言「該編碼在表格內 `toHaveCount(0)`」——不再只看總數、能抓到「刪錯筆」。
- **新增 E7 編輯品項（Update）**：第一列進 `?mode=edit` → 改數量＝77、存放地點＝「E7 測試存放區」→ 儲存 → 回列表用該筆編碼查回 → 斷言新數量與新地點都生效（編碼因分類/項目未動而保留，故查得回）。
- **runner 收緊**：期望條數 6→7，判定改「passed 恰好等於 7 且無 failed/skipped/flaky」（解析 `skipped`/`flaky` 字樣，出現即紅，杜絕「略過也算過」的假綠）；`npm ci` 跳過條件收緊為「node_modules 存在**且** `node_modules\.bin\playwright.cmd` 存在」才跳過；並在安裝後加 `npx playwright install chromium`（冪等；exit 非 0 即紅）。
- **參考解補防重複送出**：`equipment/crud/[id].vue` 的 `save()` 加 `isSubmitting` 旗標（開頭 guard `if (isSubmitting.value) return`＋`try/finally` 收尾復位），儲存鈕加 `:loading` / `:disabled`，連點只會入庫一次。E7 實跑編輯流程未發現參考解其他 bug。

最終全綠輸出摘要：

```
=== 裝備物資 E2E（EASY 版｜7 條）===
PASS：solution-app 在 3100 埠、確認為本 App。
node_modules 與 playwright 皆就緒，跳過 npm ci。
確保 Playwright chromium 已安裝...
Running 7 tests using 1 worker
  ok 1 › E1 列表載入 (855ms)
  ok 2 › E2 關鍵字篩選（名稱＋編碼） (1.0s)
  ok 3 › E3 新增品項 (1.4s)
  ok 4 › E4 表單驗證 (740ms)
  ok 5 › E5 刪除確認（編碼從表格消失） (1.9s)
  ok 6 › E6 範本不回歸 (817ms)
  ok 7 › E7 編輯品項（改數量＋地點，回查生效） (1.3s)
  7 passed (8.8s)
E2E 全綠：7 條 passed / 0 條 failed / 0 條 skipped。
EXITCODE=0
```
