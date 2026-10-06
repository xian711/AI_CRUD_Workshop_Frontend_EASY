# LOOP 規矩（給 AI 讀）

> 用途：step4 的 LOOP prompt 會叫 AI 照這份做。這是給 AI 的規矩檔，人不用逐字讀。
> 人要看結果，就打開受測 App 的 `loop/LOOP-REPORT.html`。
>
> 名詞：
> - **受測 App**：LOOP prompt 指定的資料夾，預設是 `step3_new_module/my-equipment-app`。
> - **產出資料夾**：受測 App 底下的 `loop/`（沒有就建）。

**自己跑完，中途不要問人。** 需要人決定的事，寫進報告，列成選擇題。

---

## 1. 埠：受測 App 由你自己啟動

1. 預設埠是 3100。
2. 啟動前先檢查 3100 有沒有被占用：
   - Windows：`Get-NetTCPConnection -LocalPort 3100 -State Listen -ErrorAction SilentlyContinue`
   - macOS：`lsof -nP -iTCP:3100 -sTCP:LISTEN`
3. 3100 被占用，就往上找一個空的埠（3101、3102…）。**不要關掉別人的程式**，也不要猜占用的那個是不是受測 App。
4. 在受測 App 資料夾，用背景方式啟動（`nuxt.config.ts` 會讀環境變數 `PORT`）：
   - Windows：`$env:PORT = '3101'; pnpm dev`
   - macOS：`PORT=3101 pnpm dev`
5. 等 `http://localhost:<埠>/equipment/crud` 有回應，再跑測試。
6. 跑 run-e2e 時，設**同一個埠**。設定和執行寫在**同一行指令**（每開一個新終端機，環境變數都會重來）：
   - Windows：`$env:PORT = '3101'; powershell -ExecutionPolicy Bypass -File step4_loop_e2e/run-e2e.ps1`
   - macOS：`PORT=3101 bash step4_loop_e2e/run-e2e.sh`
7. 用了哪個埠，寫進 `LOOP-LOG.md` 和 `LOOP-REPORT.html`。
8. 跑完**不要關掉受測 App**：人要照報告上的網址自己點一遍。報告寫明網址和這個 App 的 PID（行程編號），讓人知道怎麼關。

---

## 2. 鐵律（四條）

1. 同一問題修兩次沒好，就停下回報。
2. 不准改測試、放寬斷言或跳過測試；覺得測試有問題，停下等人裁決。
3. 不准拆掉共用零件（`useTemplateListPage`、`templateValidation`、`templateCsv`、`App*.vue`）自己重寫。
4. PRD 沒寫的修改，在報告標成「規格外調整」。

補充：

- `step4_loop_e2e/` 底下的檔一律不動，包括 `tests.sha256` 和 `tools/`。不准重算測試基準。
- 測試在驗 PRD 沒寫的東西（例如 toast 文案、編碼格式）時，預設先改 App 對齊測試，標「規格外調整」，再在報告裡問人要不要留。

---

## 3. LOOP 一圈怎麼跑

1. 啟動受測 App（第 1 節）。
2. 跑 run-e2e。
3. 有紅：看終端機輸出，和 `step4_loop_e2e/e2e/test-results/` 裡的失敗截圖。判斷根因是哪一種：App 不符規格、環境問題、測試本身。
4. 修受測 App，再跑 run-e2e。
5. 每跑一次，就在 `LOOP-LOG.md` 追加一筆（第 5 節）。
6. 7 條全綠，就進對抗審查（第 4 節）。

---

## 4. 對抗審查：全綠之後

1. 開一個**子代理**（subagent）。子代理只挑錯，不誇獎。子代理用 **Opus 5.5**（見 4.1）。
2. 子代理用 Playwright **真的開瀏覽器，逐頁截圖**：
   - 列表
   - 新增
   - 編輯
   - 驗證紅字（空表單按儲存）
   - 刪除確認
   - 手機寬度（例如 390×844）
3. 截圖存到 `loop/screenshots/`，檔名用編號，例如 `01-list.png`。截圖用的腳本也放在 `loop/` 裡。Playwright 可以用 `step4_loop_e2e/e2e/node_modules` 已經裝好的那一份，但**不准把任何檔放進 `step4_loop_e2e/`**。
4. 對照 `PRD-中心裝備物資.md` 和 `design-system-summary.md`，挑兩種問題：
   - **App 的問題**：測試沒抓到、但不符合 PRD 或 design system 的地方。例如 label 文字不對、必填沒紅星、硬編碼顏色、手機卡片少了資訊。
   - **測試的假綠**：斷言太鬆、選錯元素、靠 `nth` 的 selector、測試互相影響。
5. 處理方式：
   - **App 的問題**：修完再跑 run-e2e，確認 7 條還是全綠。改到畫面的話，重拍那幾張截圖。
   - **測試的問題**：只列出來，不准改。寫進報告，列成選擇題交人裁決。

### 4.1 模型

1. 開發（修程式、跑測試）用 **Sonnet 5.5**。
2. 對抗審查的子代理用 **Opus 5.5**。審查用的模型要比開發用的模型**高一級**。
3. 理由：有規矩和範本，開發不用最強的模型，審查才值得用強的。token 夠的話，審的要比寫的強。

---

## 5. 產出：放在受測 App 的 `loop/`

| 檔 | 給誰看 | 一句話 |
|---|---|---|
| `loop/LOOP-LOG.md` | 機器、事後追查 | 每一輪的流水紀錄，不用美 |
| `loop/LOOP-REPORT.html` | 人 | 結果報告，結論在最前面，圖文並茂 |
| `loop/screenshots/` | 人 | 對抗審查的截圖 |
| `step4_loop_e2e/e2e/playwright-report/index.html` | 人 | 測試報告，run-e2e 跑完自動產生 |

### 5.1 `LOOP-LOG.md`：流水紀錄

每跑一次 run-e2e，就在檔尾追加一段。只追加，不刪舊的。格式：

```
## 第 1 輪 2026-10-06 14:03
- 指令：$env:PORT = '3101'; powershell -ExecutionPolicy Bypass -File step4_loop_e2e/run-e2e.ps1
- 結果：5 passed / 2 failed
- 紅：E3 新增品項、E4 驗證
- 根因：新增頁沒有即時顯示編碼
- 改檔：pages/equipment/crud/[id].vue
```

對抗審查也記一段：子代理挑到幾條、哪幾條修了、哪幾條交人裁決。

### 5.2 `LOOP-REPORT.html`：給人看的結果報告

單一 HTML 檔，不用網路也打得開。截圖用相對路徑（`screenshots/01-list.png`）。內容照這個順序：

1. **結論在最前面**：一句話。例如「7 條全綠，對抗審查挑到 3 條，修了 2 條，1 條要你裁決」。停在紅燈的話，寫停在哪一條、為什麼。
2. **受測網址**：`http://localhost:<埠>/equipment/crud`，加上受測 App 的 PID。
3. **每一輪**：紅了哪幾條、一句根因、改了哪個檔。一輪一列。
4. **對抗審查**：挑到什麼、怎麼處理（修了／交人裁決），配審查截圖。
5. **規格外調整**：PRD 沒寫、但為了測試改了的地方，一條一列。
6. **要人裁決的事**：列成選擇題，每題 2～4 個選項，標出建議和一句理由。
7. **文件同步**：SRS、設計文件、圖各改了哪幾段。
8. **最後附總結行**：run-e2e 的 `7 passed`、exit 0。
9. **測試報告連結**：用相對路徑。受測 App 在 `step3_new_module/my-equipment-app` 時，連結是 `../../../step4_loop_e2e/e2e/playwright-report/index.html`。

版面要求：

- 字要大：內文 18px 以上，標題更大。
- 圖文並茂：每一段審查發現，都配一張截圖。
- 白話：少用術語，非用不可就加一句解釋。

### 5.3 測試報告：`step4_loop_e2e/e2e/playwright-report/index.html`

- run-e2e 每跑一次，Playwright 就自動重寫這份報告，所以它永遠是最後一次的結果。
- 最後一次要是全綠的那次，報告才會顯示 7 條綠。
- 你不用自己產生，只要在 `LOOP-REPORT.html` 放相對連結。

### 5.4 文件同步：程式改了，文件跟著改

1. 受測 App 根目錄的三個檔要跟著程式改：`SRS-中心裝備物資.md`、`DESIGN-中心裝備物資.md`、`DIAGRAMS-中心裝備物資.html`。
2. 改動的地方標「**step4 LOOP 後**」。
3. 圖改完，用瀏覽器打開確認還出得來，沒有 mermaid 的紅字錯誤。
4. 找不到某個檔，不要自己從零補寫。在報告裡列成選擇題，問人要不要補。

---

## 6. 收尾：在對話裡回報

回報三行就好：

1. 結論一句（幾條綠、要人裁決幾件）。
2. `LOOP-REPORT.html` 的完整路徑。
3. 受測網址（含埠）。
