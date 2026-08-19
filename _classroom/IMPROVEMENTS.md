# 教材優化紀錄（IMPROVEMENTS）

> 依 `_classroom/FEEDBACK_LOG.md` 的回饋，對源教材做的修改。**變更一律保守**：只補說明、修錯誤數字、修不可用的指令，
> **沒有改任何 App 程式碼、沒有改任何 E2E 測試、沒有改參考解**。
> 每一項都寫清楚：改了哪個檔、改了什麼、為什麼、對應哪一條回饋。
> 修改前基準：`master @ 484d2a5`。

## 一覽

| # | 檔案 | 類型 | 對應回饋 |
|:-:|---|---|---|
| 1 | `step0_course_intro/preflight.ps1` | 修 bug | QA step0 |
| 2 | `HANDBOOK/HANDBOOK.html` step0 | 修不精確 | QA step0 |
| 3 | `HANDBOOK/HANDBOOK.html` step1 | 修錯誤數字 | 講師實測＋QA step1 |
| 4 | `HANDBOOK/HANDBOOK.html` step1 | 修錯誤敘述 | PM step1 |
| 5 | `HANDBOOK/HANDBOOK.html` step2 ④ | 修自相矛盾 | PM step2 |
| 6 | `HANDBOOK/HANDBOOK.html` step3 ⓪ | 修不可用指令 | PM step3（實際失敗）＋QA step2 |
| 7 | `HANDBOOK/HANDBOOK.html` step4 | 補關鍵說明＋兩條鐵律 | PM step4＋QA step4 |
| 8 | `HANDBOOK/HANDBOOK.html` step4 | 修不可用指令 | PM step4＋QA step4（兩人實測） |
| 9 | `HANDBOOK/HANDBOOK.html` step4 | 補新檢查點 | 講師觀察（架構退化） |
| 10 | `HANDBOOK/HANDBOOK.html` 完課檢核表／評量表 | 同步 | 同 8、9 |
| 11 | `step3_new_module/PRD-中心裝備物資.md` | 補規格說明 | PM step4＋QA step4 |
| 12 | `step2_speedrun_kit/2.1_sample_app/README.md` | 補判準 | PM step2＋QA step2 |
| 13 | `.../sample-app/CODE-RULES-ui-本專案.md` | 修誤導 | PM step3 |
| 14 | `step6_survey/README.md` | 修定位錯誤 | PM step6＋QA step6 |
| 15 | `step6_survey/README.md` | 修不安全指令 | PM step6 |
| 16 | `step6_survey/README.md` | 修陷阱題 | PM step6 |
| 17 | `step6_survey/README.md` | 修語氣過肯定 | PM step6＋QA step6 |
| 18 | `step6_survey/README.md` | 補安全步驟 | PM step6＋QA step6 |
| 19 | `step6_survey/README.md` | 修過度承諾 | PM step6＋QA step6 |
| 20 | `README.md`（根目錄） | 補白話定義 | PM step0 |

---

## 1. `step0_course_intro/preflight.ps1` — 補 UTF-8 輸出編碼

- **改了什麼**：檔案開頭加兩行 `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8` 與 `$OutputEncoding = [System.Text.Encoding]::UTF8`。
- **為什麼**：QA 在預設 Windows PowerShell（CP950）跑這支腳本，**整份中文變亂碼**（`emˬdƳqLAiH}ҡI`），第一眼分不出成功還是失敗。開課第一個動作就看到亂碼，第一印象極差。
- **佐證**：我實測過，`preflight.ps1` 一行編碼設定都沒有；而同一份教材的 `step4_loop_e2e/run-e2e.ps1` 第 20 行就有這一行。**同教材兩支腳本標準不一致，屬確定缺陷。**
- **對應回饋**：step0 → student_gemini (a)1、(c)1。
- **改後驗證**：重跑 `preflight.ps1`，10 項全 PASS、中文正常、判定行不變。

## 2. `HANDBOOK/HANDBOOK.html` step0 — 10 項檢查名稱改成與腳本逐字一致

- **改了什麼**：「這一步要做到」與「你應該看到」兩處，把 10 個簡稱換成腳本實際印出的名稱（`Node.js >= 20`、`pnpm 已安裝`、`git 已安裝`、`port 3100 未被占用`、`磁碟剩餘空間 >= 2GB`、`ExecutionPolicy 可執行腳本`、`工作區可寫入`、`npm registry 連線`、`Playwright Chromium 已快取`、`AI Agent CLI`），並在 Playwright 那項加白話註解（step4 自動化瀏覽器測試要用的瀏覽器核心，沒快取會自動下載，所以只算 WARN）。
- **為什麼**：QA 做逐項勾稽時發現 10 項只有 2 項名稱完全一致，無法一對一比對。PM 則反映術語沒解釋、「只能相信綠燈」。
- **對應回饋**：step0 → QA (b)、(c)2、(c)3；PM (a)3。

## 3. `HANDBOOK/HANDBOOK.html` step1 — 修「4 個裸色碼」與「11 個色碼」兩個錯誤數字

- **改了什麼**：
  - 「漏了 4 個裸色碼在外面」→「`:root` 之外還散著 **5 處裸色碼**，共 3 個不重複色值：`#fff`、`#fbf7f2`、`#fde8e6`」。
  - 「全檔 11 個色碼一個不多一個不少」→「全檔用滿 **11 個不重複色值**（`:root` 共 12 行宣告，其中 `on-primary` 與 `surface` 都是 `#FFFFFF`），`:root` 之外 **0 處**硬編碼」。
- **為什麼**：**「4」這個數字兩種算法都對不上**——實際是 5 處出現、3 個不重複色值（我實測 `no-harness.html` 行 71／94／116／123／136）。而 `with-harness.html` 的 `:root` 是 12 行宣告、11 個不重複值，原文的「一個不多一個不少」沒交代計數口徑。
- **附註**：QA 把「4 個裸色碼」這條標成「成立」，但它自己貼的證據就是 5 處——**這正好說明教材為什麼需要對抗審查**，也是我把對抗審查從選配改成建議必做的原因（見第 7 項）。
- **對應回饋**：step1 → 講師觀察 1、2；QA (a) 第 6 條。

## 4. `HANDBOOK/HANDBOOK.html` step1 — 修「功能一模一樣」

- **改了什麼**：兩處敘述改為「核心功能相同，但欄位選項與驗證規則其實已經不一樣了（血型幾個選項、電話收不收 `(02) 1234-5678`），**而這正是『這個決定是誰做的』的結果**」。
- **為什麼**：PM 指出「功能一模一樣」這句話**否定了 step1 自己想證明的事**——業務規則不同就是功能不同。原句會直接削弱這一步的說服力。
- **對應回饋**：step1 → PM (a)3、(b) 不好第 3 條；講師觀察 3。

## 5. `HANDBOOK/HANDBOOK.html` step2 ④ — 修「4 份，你不用讀」的自相矛盾

- **改了什麼**：標題改成「4 份，**不用逐條讀懂**」；下方新增一段引言，把分工講清楚——人至少掃 `CLAUDE.md`（48 行）、開新模組前要讀「使用說明」（那份本來就是寫給人看的）、另外兩份由 AI 改碼時查、人做 code review 時對照。同段補上滷包比喻的**邊界**：比喻只管「放哪、要不要帶走」，**不負責回答「規矩內容對不對」**；業務規則寫錯，AI 會照著做，錯得更快更整齊，所以規矩要有人負責、有版本、有人審。
- **為什麼**：手冊寫「你不用讀」，`step2_speedrun_kit/README.md` 卻寫「使用說明是**人主讀**」「CLAUDE.md 人也該掃一遍」。PM：「到底要不要讀？這兩種說法會讓 PM 直接全部跳過。」比喻的邊界也是 PM 主動點出的三個誤導之一。
- **對應回饋**：step2 → PM (a)3、(b)、(d)3。

## 6. `HANDBOOK/HANDBOOK.html` step3 ⓪ — 複製指令改成排除快取與相依

- **改了什麼**：
  - Windows：`Copy-Item -Recurse ...` → `robocopy $src $dst /E /XD node_modules .nuxt .output | Out-Null`
  - macOS／Linux：`cp -R ...` → `rsync -a --exclude node_modules --exclude .nuxt --exclude .output ...`
  - 兩段都加註解說明為什麼要排除；下方新增 500 急救引言（`useColorMode is not defined` → 刪**你的工作專案**的 `.nuxt`／`.output`，並明確警告不要刪到範本正本）。
- **為什麼**：這條指令在試教中**一次踩到兩個坑**：
  1. **PM 那邊直接複製失敗**——step2 裝完套件後來源有超深的 `node_modules` 路徑，Windows 複製到一半噴紅字。PM：「我只知道畫面一直噴紅字。」
  2. **QA 那邊若不先清快取就 500**——舊 `.nuxt` 被複製過去，症狀正是 `useColorMode is not defined`。這個症狀與解法教材只寫在 **step6 README**（課後題），**陷阱卻在 step3 引爆**。QA 估非工程師會卡 30～45 分鐘，PM 估 10～20 分鐘且「會先把錯怪到新模組」。
- **改後驗證**：實跑過 robocopy 版本——複製出 794 個檔，`package.json` 與 `CLAUDE.md` 都在，`node_modules`／`.nuxt` 都沒被帶過去。
- **對應回饋**：step3 → PM (a)1、(a)2、(e)1、(e)2；step2 → QA (b)。

## 7. `HANDBOOK/HANDBOOK.html` step4 — 誠實說明這 7 條測試的來歷，並加兩條鐵律

- **改了什麼**：
  - 在「這 7 條測試就是可執行的驗收規格」後面新增一段引言，把測試斷言分成兩種：**(1) PRD 真的有寫的功能**（紅了就修 App）、**(2) PRD 沒寫、只是參考解剛好長那樣的細節**（placeholder 文字、toast 用字、`PW-GEN-003`、種子剛好 2 台發電機、`#categoryKey-error` 這種 id）。並明講：兩種都可以修 App 讓它變綠（測試一個字沒動，不算作弊），但**要知道自己在修哪一種、要寫進報告**；跟 step3 的 D3 拍板衝突時，**停下來把衝突寫進報告也算正確完成——不會有 `7 passed`，但你交出了比綠燈更有價值的東西**。
  - LOOP prompt 加兩條鐵律：**每次修改要指出它對應 PRD 哪一條或哪個拍板**，找不到出處的照樣可以改但要標成「規格外調整」；**不准為了過測把「直接共用」的零件拆掉自己重寫**，共用件用不動時停下來回報。
  - 「LOOP 卡住怎麼辦」表格新增一列處置：「AI 回報這一條在驗 PRD 沒寫的東西」→ 你決定 (A) 改 App 對齊測試（要標成規格外調整）或 (B) 讓它紅著、把衝突寫進報告，**選 (B) 也算完成這一步**。
  - 對抗審查從「進階（選配）」改成「**強烈建議做，別當選配**」，並列出試教挖到的三個假綠。
- **為什麼**：這是本次試教最重的發現。`equipment.spec.ts` **檔頭第 4 行自己就寫著「目標站點：solution-app」**，手冊卻稱它為所有學員模組的驗收規格。結果：
  - PM 判 c 類、停在 **3 passed / 4 failed**，沒作弊、沒鬼打牆，但交不出綠燈。
  - QA 判 c 類但照改，跑 8 輪到 **7 passed**，測試一個字沒動，卻把符合 PRD 的實作改成參考解的樣子（QA 自己命名為 **Overfitting to Tests**）。
  - 兩條原鐵律**沒有涵蓋這個岔路**。PM 主動補的第三條，就是我寫進去的那條。
  - QA 的對抗審查另外找出教材自己沒發現的三個假綠：E1 不驗第一頁是不是只有 20 筆、E4 六個必填只驗了一個、E6 的「回歸測試」只看有沒有一張表格。
- **對應回饋**：step4 → PM (c)、(e)3、(e)6、(g)c；QA (a)、(c)；講師觀察 1、3、5。

## 8. `HANDBOOK/HANDBOOK.html` step4 — `git diff e2e/` 加非 git 副本的退路

- **改了什麼**：驗收表「測試沒被動過」那格補上：拿到資料夾／zip 副本時這條會印 `Not a git repository`，**那不是你做錯了**；改用 `Get-FileHash e2e\tests\equipment.spec.ts`（Windows）／`shasum -a 256 e2e/tests/equipment.spec.ts`（Mac）跟講師發的原始雜湊對一次。完課檢核表與評量表的對應文字同步修正。
- **為什麼**：兩位學生**都實測到這條指令不可用**。教材正本是 git repo，但學員拿到的是資料夾副本。PM：「我原本會把一大串英文當成自己做錯了。」QA：「如果教材依賴 `git diff` 防作弊，這個防線會瞬間失效。」
- **對應回饋**：step4 → PM (b)、(e)5；QA (d)、(j)1。

## 9. `HANDBOOK/HANDBOOK.html` step4 — 新增「共用件還在用嗎」檢查點

- **改了什麼**：step4 驗收表新增一列，要求在 `my-equipment-app` 檢查列表頁**仍然有引用 `useTemplateListPage`**（給了 Windows 與 Mac 兩種指令）；完課檢核表同步新增一條。
- **為什麼**：**這是三道現有檢查全部放行、卻真的發生了的架構退化。** QA 為了讓 E2E 全綠，把 `pages/equipment/crud/index.vue` 裡的 `useTemplateListPage` 拿掉，改自己用 ref/computed 重寫一套篩選＋分頁＋URL 同步。
  - 共用檔本身沒被改（我 `diff` 過，與範本完全相同）→ 現有抽查**過關**
  - 測試沒被動 → **過關**
  - 7 條全綠 → **過關**
  - 但 step2／step3 教的「直接共用、禁複製、禁自己再寫一套」已經被放棄，**沒有任何檢查點抓得到**。
- **對應回饋**：step4 → 講師觀察 2。

## 10. `HANDBOOK/HANDBOOK.html` 完課檢核表與評量表 — 同步第 8、9 項

- **改了什麼**：檢核表第 10 條改成「抽查測試沒被動（`git diff e2e/`；不是 git 副本就改用檔案雜湊比對）」，並新增一條「抽查共用件還在用」；評量表面向 6 的合格證據同步改成「附測試未被修改的抽查結果（`git diff e2e/` 為空，或檔案雜湊與原始相同）」。
- **為什麼**：檢核表與評量表是學員最後對照的東西，跟正文不同步就會失效。

## 11. `step3_new_module/PRD-中心裝備物資.md` — D3 補基準格式，第 6 節前補「與 step4 E2E 的落差」說明

- **改了什麼**：
  - D3 那格補上：**若選「簡化」，本課基準格式是 `{類別2碼}-{項目3碼}-{流水3碼}`（例 `PW-GEN-003`）**，step4 的 E2E 就是照這個寫的；你仍然可以拍板成別的格式（例如 `PW-003`），那也是合理的決定，只是 step4 的 E3 會紅在這一條，**把它記成「規格不一致」寫進 LOOP 報告，比硬改成一樣更有價值**。
  - 第 6 節前新增引言：這份 PRD 只寫「功能要做到什麼」，沒規定 UI 的用字與 DOM 細節（按鈕文案、toast 文字、搜尋框 placeholder、錯誤訊息的 HTML id、種子裡各品項各幾筆）；step4 的 7 條是拿參考解探過畫面才寫的，部分斷言就落在這些細節上；看到紅燈第一件事是分辨兩種紅。
- **為什麼**：**兩位學生的編碼格式都跟 E2E 對不上，而且他們沒做錯任何事。** PM 做成 `IT-004`、QA 做成 `IT-0025`；PRD 從頭到尾沒定義「簡化」是什麼格式，`equipment.spec.ts:80` 卻硬斷言 `PW-GEN-003`。教材在 step3 特意留 D3 給學員拍板，又在 step4 用一行斷言推翻它。
- **為什麼用「補說明」而不是「改測試」**：改測試會動到教材已實跑驗證全綠的基準，一改就要重新全套驗證；而且紅燈本身是 step4 的教學素材。這樣改**保住了決策練習，又拿掉了那個沒說出口的陷阱**。
- **對應回饋**：step3 → 講師觀察 2；step4 → PM (c)、(e)3；QA (a)、(j)3。

## 12. `step2_speedrun_kit/2.1_sample_app/README.md` — 8 核心檔補第二條判準與 QA 讀法

- **改了什麼**：
  - 判準從一條變兩條。第 2 條：「內容看起來通用，但需要**模組故障隔離**或**命名空間隔離**的小元件 → 還是複製」，並直接點名 `TemplateFormField.vue`、`TemplateStatusBadge.vue` 就是這條的例子，附一句「只看第 1 條的話，這兩個一定會判成共用」。
  - 表格下方新增：同一張表兩種角色兩種讀法——PM／開發用它檢查有沒有複製錯、有沒有偷改共用件；**QA 用它劃回歸測試的爆炸半徑**（動那 5 個複製檔，只重測該模組；動那 3 個共用檔與所有 `App*.vue`，所有用到範本的模組都要重測）。
- **為什麼**：PM 說「若只給『實體長相 vs 通用機制』那一句，我一定會把欄位元件猜成共用」。QA 則自己把這張表用成回歸測試範圍表，而且用得非常好——那個讀法值得寫進教材。
- **對應回饋**：step2 → PM (a)2、(d)2；QA (c)；講師觀察 4。

## 13. `.../sample-app/CODE-RULES-ui-本專案.md` — 講清楚「禁止 px」不包含 Tailwind 的 `px-3`

- **改了什麼**：「**禁止**硬編碼 hex/px」後面補括號說明：禁的是**寫死在 CSS 裡的數值**（`color: #C8232C`、`margin: 12px`）；Tailwind 的 `px-3`、`gap-md`、`p-lg` 是 token 化的工具類別，**可以用**——名字裡有 px 兩個字不代表它是硬編碼。
- **為什麼**：PM 以為連 `px-3` 都不准，但範本到處都是。「一個是固定像素值、一個是既有間距工具名稱；對 PM 來說字面完全衝突。」非工程師無法自行判斷這是不是紅燈。
- **對應回饋**：step3 → PM (a)3、(e)3。

## 14. `step6_survey/README.md` — 講清楚 localStorage 版本的真實邊界

- **改了什麼**：「你要做出什麼」下方新增警語：這一版沒有後端，回覆存在填答者自己那台裝置；**同事用他的手機打開你的網址填完，你在自己電腦的 `/survey/admin` 一筆也看不到**；它適合的是單機 demo、會場共用的那一台平板／筆電；要真的收全班回饋，還缺後端集中儲存、管理頁登入、個資告知與保存期限。另外在驗收清單新增第 11 項：**用無痕視窗送出一筆，再回原視窗看 admin，應該看不到**——親眼看過一次就不會把它當成正式問卷。
- **為什麼**：**兩位學生獨立抓到同一條——這一題的產品目標其實沒達成。** README 承諾「真的網址、傳給同事看」「admin 看全部回覆」，PRD 卻規定資料存在填答者自己的瀏覽器。PM 說這「比 GitHub 指令更致命」，QA 把它列為 localStorage 四大風險之首（資料孤島）。
- **對應回饋**：step6 → PM (d)、(g)1、(g)8；QA (h)1；講師觀察 2。

## 15. `step6_survey/README.md` — 複製指令改成排除，不要叫人刪來源

- **改了什麼**：Windows 改 `robocopy ... /E /XD node_modules .nuxt .output`、Mac 改 `rsync --exclude`；把「複製前先刪掉來源的 `node_modules` 會快很多」改成「**不要去刪來源 `sample-app` 底下的東西**——那是全班共用的範本正本，上面的指令已經在複製時排除掉了」。
- **為什麼**：PM 指出原寫法會改到共用範本正本；而且「會快很多」低估了嚴重性——step3 的實測是**不排除可能直接複製失敗**。
- **對應回饋**：step6 → PM (f) 不好第 3 條、(g)3；step3 → PM (a)1。

## 16. `step6_survey/README.md` — 第 10 項色碼搜尋改成兩條指令

- **改了什麼**：驗收點文字改成「搜尋 `#` 開頭的色碼（見下方說明）」，並新增一段引言給**兩條**指令：第 1 條看全專案色碼集中在哪幾個檔（預期只有 token 正本、規則文件、SVG，它們本來就該有色碼），第 2 條只掃新增檔（預期無輸出，那才是驗收）。並註明「`Select-String` 找不到東西時不會印任何字，這是正常的，不是指令壞掉」。
- **為什麼**：PM 實跑掃到 **351 行**（集中在 `design-token.css`、`comp-tokens.css`、`CLAUDE.md`、`design-system-summary.md`、`bg.svg` 這 5 個既有檔）。PM 原話：「若講師只叫 PM 看搜尋有沒有輸出，**我一定會把 351 行當成作業失敗**。」
- **對應回饋**：step6 → PM (b)、(g)4。

## 17. `step6_survey/README.md` — 坑 ③ 從「會爆」改成「可能爆」，並要求以瀏覽器為準

- **改了什麼**：標題補上 `pnpm build` 也可能觸發、把「變成 500」改成「**可能**變成 500」，並補上試教實況（兩台機器一台在 build 後中招、一台在 generate 後沒事）與判斷原則：**看瀏覽器，不要看終端機——終端機可能全綠、頁面照樣 500**。
- **為什麼**：PM 是「build 後第一次 dev 才 500，generate 後反而正常」；QA 是「不 500 但一堆快取告警」。原文的確定語氣不準確，但**兩人都證實解法有效**，所以改語氣、不刪內容。
- **對應回饋**：step6 → PM (c)、(f) 不好第 5 條、(g)5；QA (e)。

## 18. `step6_survey/README.md` — 發布前補 4 項安全檢查與撤回方式

- **改了什麼**：「再推上 GitHub」之前新增四步：① 確認在對的資料夾（`.output/public`，不是專案根目錄）；② 確認裡面沒有不該公開的東西（真實姓名、電話、公司內網網址、帳密、內部文件）；③ 確認隱藏檔 `.nojekyll` 有被帶上（`Get-ChildItem -Force`）；④ **先知道怎麼撤回**（Settings → Pages → Source 選 None 可立刻下架；Settings 最下面 Delete this repository 可整個刪掉）——**先知道怎麼關，再按上線**。發布步驟末尾另加警語：**GitHub Pages 免費方案只支援 public repo，你推上去的每個檔案任何人都看得到。**
- **為什麼**：兩位學生的紙上檢查都指向同一件事——**這是對外公開的動作，教材卻只寫了 UI 四步**。PM 列了 6 個危險（含「沒有回復／撤站說明」），QA 特別點出「GitHub Pages 免費版強制 public → 個資洩漏風險，教材完全未提及」。
- **對應回饋**：step6 → PM (e)1／2／3／5、(g)6；QA (g)。

## 19. `step6_survey/README.md` — API 接縫從「保證」改成「接縫位置＋待定清單」

- **改了什麼**：「呼叫端一行都不用改」改成「幾乎不用改」，並補一段：**一行 TODO 是「接縫位置」，還不是「API 契約」**；換真後端之前至少要跟後端談定 request／response 欄位長相、錯誤格式、要不要登入、送出失敗怎麼重試、重送怎麼去重、`id` 與 `submittedAt` 由誰產生。談定了，前後端才敢平行開工。
- **為什麼**：這句是銜接下一門後端課的賣點，但目前寫得像保證。PM：「一行 TODO 只是接縫位置，不是契約……我不接受教材說換一行就保證呼叫端完全不用改。」
- **對應回饋**：step6 → PM (f) 不好第 2 條、(g)7、(i)b。

## 20. `README.md`（根目錄）— 補 harness 白話定義與 HANDBOOK 開啟方式

- **改了什麼**：第一句下方新增 harness 的白話定義（專案規則＋設計系統＋標準範本，滷包比喻），並明講「本課不要求你會寫 harness，只要求你會用」；資料夾表格的 `HANDBOOK/` 那格補「**請用瀏覽器打開**——它是為瀏覽器排版的，在終端機直接讀原始碼會很痛苦」。
- **為什麼**：PM 反映「第一句就出現 harness，全篇沒有中文白話定義」。而「HTML 在終端機讀不動」是兩位學生在 step0／step1／step2 **連續抱怨三次**的問題——真實學員用瀏覽器不會痛，但這門課自己教「把事情交給 AI Agent」，就該預期有人會叫 AI 讀手冊。
- **對應回饋**：step0 → PM (a)1、(a)5、(c)1；step1／step2 → 兩人皆提。

---

## 改完之後我驗了什麼

| 驗證 | 結果 |
|---|---|
| `preflight.ps1` 重跑 | 10 項全 PASS、中文正常、判定行不變 |
| `HANDBOOK.html` 標籤配對 | 用 HTML parser 掃過：0 個未閉合、0 個錯配 |
| `HANDBOOK.html` 新內容渲染 | 純文字抽取後逐段確認，新段落都在正確位置、表格欄數對齊（3 欄表新增列也是 3 欄） |
| 新的 Windows 複製指令 | 實跑 `robocopy /E /XD`：794 檔、`package.json` 與 `CLAUDE.md` 在、`node_modules`／`.nuxt` 沒被帶走 |
| 有沒有動到不該動的東西 | `git status` 確認：**沒有任何 App 程式碼、E2E 測試、參考解被修改** |

---

## 刻意「不改」的項目與理由

保守原則：以下有回饋、但我判斷**不該由這一輪動手**，留給教材維護者決定。

| 建議 | 提出者 | 為什麼這次不改 |
|---|---|---|
| 重寫 `equipment.spec.ts` 的 selector（去掉 `td.nth(1).locator('div').last()`、toast 改模糊比對、E2 改動態筆數、E3 改正則比對編碼） | QA step4、PM step4 | **建議本身是對的**，但這會動到「已實跑驗證全綠」的基準測試，一改就要重新全套驗證，超出「保守」範圍。已在第 7、11 項用「說明」把陷阱拆掉，測試留給下一次改版統一處理。 |
| 補強 E4（六個必填全驗）、E6（真的做回歸而不只看有沒有表格） | QA step4 對抗審查 | 同上——這是**新增斷言**，會讓現行參考解與兩位學生的模組全部要重跑。屬於下一版教材的工作，不是回饋修補。 |
| `nuxt.config.ts` 的 3100 與 `playwright.config.ts` 的 baseURL 改成讀環境變數 | QA step2 | 會改到範本 App 與測試設定。單機教學情境下寫死 3100 是刻意的（`run-e2e.ps1` 還靠它確認受測 App 身分）。已記入 COURSE_REPORT 的「下一版建議」。 |
| 修 `plugins/force-light-mode.client.ts` | QA step2（初判） | **追問後證實不是程式缺陷**，是舊 `.nuxt` 快取被複製過去造成的偽缺陷（我在講師機用乾淨環境跑同一頁：HTTP 200、畫面正常）。真正的修法是第 6、15 項的複製指令。**不動程式碼是正確處置。** |
| `package.json` 預裝 `vue-tsc`、加 `gh-pages` 一鍵發布、`templateCsv.ts` 加公式注入防護 | PM step3、QA step6 | 都是**新增相依或改共用工具**，違反 `CLAUDE.md` 的「不准擅自加套件」與「共用檔禁亂改」。要做應該先改 harness 規則再做。已記入 COURSE_REPORT 的「下一版建議」。 |
| `2.2_design_system/DESIGN_SYSTEM.html` 與 `step1/demo/` 補純文字摘要／`DIFF_SUMMARY.md` | 兩位皆提 | 是新增檔案而非修補，且要重新設計內容深度。已記入 COURSE_REPORT 的「下一版建議」。 |
| PRD 補電話正則、排序 tie-breaker、數量上限等邊界規格 | QA step3 | 補了會讓課堂版 PRD 變厚，與「濃縮成一堂課做得完」的設計意圖衝突。建議改成獨立的「正式上線前要補的規格」附錄，已記入 COURSE_REPORT。 |
| SRS／SDD 的最小樣板 | PM step3 | 需要教材作者決定要求到什麼程度（PM 交了、QA 沒交，而手冊 ④ 只說「順序合理就回開工」，等於把 T7 的存廢交給運氣）。已記入 COURSE_REPORT。 |
