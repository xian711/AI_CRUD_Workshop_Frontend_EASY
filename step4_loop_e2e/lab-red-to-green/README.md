# 動手練習｜紅 → 判因 → 修 → 綠（LOOP 的完整一圈）

看到 7 條全綠只證明「現在沒壞」。這個練習讓你**親手把測試弄紅、判斷原因、再修回綠**——
這一整圈，才是 LOOP 工程真正要學會的東西。

我們準備了一個**可一鍵注入、可一鍵還原**的刻意 bug，你不會弄壞任何東西。

---

> **平台對照**：以下每個步驟都給兩套指令。Windows 用 `.ps1`、macOS／Linux 用同名 `.sh`
> （`inject-bug.sh`／`restore.sh`／`run-e2e.sh`），行為、備份位置與 exit code 完全一致。

---

## 這個 bug 是什麼

`inject-bug.ps1`（macOS／Linux 是 `inject-bug.sh`）會把明細頁 `[id].vue` 裡「**分類（categoryKey）必填**」的驗證規則拿掉。

- 改之前：新增品項時什麼都不填就按「儲存」，會看到欄位錯誤「請選擇分類」。
- 改之後：那個「請選擇分類」錯誤**不再出現**——App 的驗證行為被改壞了。
- 後果：E2E 的 **E4（表單驗證）** 這一條會**變紅**（它就是在驗這個錯誤有沒有出現）。

這是一個**真實的 App bug**（不是把測試選擇器打錯），所以判因時要能認出「是 App 壞了，不是測試壞了」。

---

## 開始前

確認 solution-app dev server 開著（另一個視窗，別關）：

**Windows（PowerShell）**

```powershell
cd ..\..\step3_new_module\solution-app
pnpm dev          # http://localhost:3100
```

**macOS／Linux（終端機）**

```bash
cd ../../step3_new_module/solution-app
pnpm dev          # http://localhost:3100
```

以下指令都在**本資料夾**（`step4_loop_e2e/lab-red-to-green/`）或它的上一層 `step4_loop_e2e/` 執行。

---

## 練習流程（六步）

### ① 先跑基準，確認 7/7 綠

```powershell
# Windows（PowerShell）
cd ..
powershell -ExecutionPolicy Bypass -File .\run-e2e.ps1
```

```bash
# macOS／Linux（終端機）
cd ..
bash run-e2e.sh
```

看到「E2E 全綠：7 條 passed」再往下。這是你的**基準線**——待會出問題才知道是這一步引入的。

### ② 注入 bug

```powershell
# Windows（PowerShell）
cd lab-red-to-green
powershell -ExecutionPolicy Bypass -File .\inject-bug.ps1
```

```bash
# macOS／Linux（終端機）
cd lab-red-to-green
bash inject-bug.sh
```

它會先把原檔備份到 `.lab-backup/`，再拿掉那條必填規則。

### ③ 再跑一次 E2E，看到 E4 紅

```powershell
# Windows（PowerShell）
cd ..
powershell -ExecutionPolicy Bypass -File .\run-e2e.ps1
```

```bash
# macOS／Linux（終端機）
cd ..
bash run-e2e.sh
```

這次會 **FAIL**，E4 那條紅。**把紅色輸出留下來**（這是證據一）。
失敗訊息大意是：等不到 `#categoryKey-error` 出現「請選擇分類」。（Playwright 也會在 `e2e/test-results/` 下存一張失敗當下的截圖。）

### ④ 先判因（別急著修！）

問自己一句話：**這是 App 的 bug，還是測試的 bug？**

判斷依據：
- 看**失敗訊息**：測試在等「請選擇分類」這個欄位錯誤出現，但它沒出現。
- 看**截圖**：表單還在、可以按儲存，但該有的紅字錯誤沒跳出來。
- 結論：**是 App 行為變了**（驗證規則被拿掉），不是測試選錯元素、也不是斷言寫太嚴。

把你的判斷寫成**一句話根因**（這是證據二）。例如：
> 「App 的分類欄位必填驗證被移除，所以空表單送出時不再產生『請選擇分類』錯誤，E4 因此等不到該訊息而紅。」

### ⑤ 修（二選一）

- **基本**：跑還原腳本，一鍵修回。

  ```powershell
  # Windows（PowerShell）
  cd lab-red-to-green
  powershell -ExecutionPolicy Bypass -File .\restore.ps1
  ```

  ```bash
  # macOS／Linux（終端機）
  cd lab-red-to-green
  bash restore.sh
  ```

- **進階**：自己動手把驗證規則加回去。打開
  `../../step3_new_module/solution-app/pages/equipment/crud/[id].vue`，
  找到 `rulesFor()` 裡的 `categoryKey`，把它改回：

  ```ts
  categoryKey: [{ required: true, message: '請選擇分類' }],
  ```

  （改完別忘了本資料夾還留著 `.lab-backup/`，可自行刪掉或之後跑還原腳本清掉。）

把你**用哪種方式修的**寫下來（這是證據三）。

### ⑥ 再跑 E2E，回到 7/7 綠

```powershell
# Windows（PowerShell）
cd ..
powershell -ExecutionPolicy Bypass -File .\run-e2e.ps1
```

```bash
# macOS／Linux（終端機）
cd ..
bash run-e2e.sh
```

看到「E2E 全綠：7 條 passed」就完成一圈了。**把綠色輸出留下來**（這是證據四）。

---

## 要交的四項證據

| # | 證據 | 內容 |
|---|------|------|
| 1 | 紅輸出 | 注入後 E4 失敗的那段輸出（含失敗那一行） |
| 2 | 根因一句話 | 你判斷「這是 App bug 還是測試 bug」的結論 |
| 3 | 修正方式 | 你用 restore 還原，或自己把規則加回去 |
| 4 | 綠輸出 | 修完再跑、7 條全綠的那段輸出 |

---

## 兩次停損提醒

LOOP 很會「為了讓燈變綠」而鬼打牆，愈修愈亂。給自己一條規矩：

> **同一個問題連續修兩次還沒好，就停下來，回去看根因判斷是不是錯了。**

在這個練習裡，如果你走「進階」自己改、改兩次還是紅，別再瞎試——直接跑還原腳本（`restore.ps1`／`restore.sh`）回到乾淨狀態，
重看一次第 ④ 步，多半是規則字串貼錯或改錯地方。

---

## 進階選配：自己加第 8 條測試

真正的 LOOP 高手不只會修紅，還會**補上原本沒驗到的洞**。

試著在 `../e2e/tests/equipment.spec.ts` 加第 8 條測試，驗**「單位」欄位的必填**：
在新增頁只留「單位」空著、其餘填好，按儲存，斷言出現「請輸入單位」錯誤且停在表單頁。

提示：照 E4 的寫法改——`rulesFor()` 裡 `unit` 的錯誤訊息是「請輸入單位」。
加完把腳本裡的預期條數改成 `8`（Windows 改 `run-e2e.ps1` 的 `$Expected = 7`；macOS／Linux 改 `run-e2e.sh` 的 `EXPECTED=7`），
再跑一次，確認 8 條全綠。
（這步是選配；若你改了測試數，記得練習結束後自行決定要不要留。）

---

## 練習後請確認乾淨

收工前，solution-app 這個檔要回到原狀（除了課程本身的 R1/R2 修正）：

```powershell
# Windows（PowerShell）
git -C ..\..\step3_new_module\solution-app status --short "pages/equipment/crud/[id].vue"
```

```bash
# macOS／Linux（終端機）：路徑含中括號，記得加引號避免被 shell 當萬用字元
git -C ../../step3_new_module/solution-app status --short 'pages/equipment/crud/[id].vue'
```

沒有輸出＝乾淨。若還有 diff，跑一次還原腳本（`restore.ps1`／`restore.sh`）或 `git checkout` 即可。
