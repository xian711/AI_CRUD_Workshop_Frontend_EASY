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

---
---

# v2 改版紀錄

> 依 `COURSE_REPORT.md` 第八節（8.1 必做 3 項 ＋ 8.2 值得做 5 項）與總管補充 2 項實作。
> 基準：`master @ 1c57456`（v1 的「試教實錄與 20 項教材優化」）。
> **E2E 改完已實跑驗證：`run-e2e.ps1` 對 solution-app → 7 passed / 0 failed / 0 skipped、exit 0。**
>
> ⚠️ **這一段是 v2 初版的紀錄。Codex 驗收判 FAIL，四個阻擋問題已回修——
> 請接著看文件最後的「v2 修正紀錄（Codex 驗收 FAIL 後的回修）」，那裡才是現況。**
> 特別注意兩處已被推翻的敘述：v2-2 的「編碼格式合理」與「toast 模糊比對」斷言已全部移除（F3）；
> v2-5 的「防竄改」口徑已改為「意外修改偵測」（F4）。

## v2 一覽

| # | 對應 | 檔案 | 類型 |
|:-:|---|---|---|
| v2-1 | 8.1-1 (A輔) | `step3_new_module/PRD-中心裝備物資.md` | 補規格（種子 fixture ＋ testid 掛載點） |
| v2-2 | 8.1-1 (B主) | `step4_loop_e2e/e2e/tests/equipment.spec.ts` | 重寫 selector 與斷言 |
| v2-3 | 8.1-1（D 條允許） | `solution-app/pages/equipment/crud/index.vue` | 加 4 個 `data-testid` |
| v2-4 | 8.1-2 | 同 v2-2 | 補 E1／E4／E6 三個假綠 |
| v2-5 | 8.1-3 | `run-e2e.ps1`／`run-e2e.sh`／`tests.sha256`／`instructor/update-e2e-hash.*` | 測試檔 SHA-256 防竄改 |
| v2-6 | 8.2-4 | `nuxt.config.ts` ×2、`playwright.config.ts`、`run-e2e.*` | 埠改讀環境變數 |
| v2-7 | 8.2-5 | `step1_why_harness/demo/DIFF_SUMMARY.md`、`2.2_design_system/TOKENS_SUMMARY.md` | 新增純文字摘要 |
| v2-8 | 8.2-6 | `step3_new_module/SRS-SDD-最小樣板.md` | 新增最小樣板 |
| v2-9 | 8.2-7 | `step6_survey/run-survey-e2e.*`、`step6_survey/e2e/` | 新增一鍵驗收 |
| v2-10 | 8.2-8 | `step6_survey/deploy-gh-pages.*` | 新增一鍵發布（預設演練，不推） |
| v2-11 | 總管補充 9 | `HANDBOOK/HANDBOOK.html` step4 | 補兩個試教實錄案例 |
| v2-12 | 總管補充 10（＝8.3-15） | `HANDBOOK/HANDBOOK.html` step4 | 補「立場決定審查品質」 |
| v2-13 | 配套 | `HANDBOOK.html`、`step6_survey/README.md` | 把新檔案接進動線 |

---

## v2-1　PRD 補「種子資料約定」與「E2E 掛載點」（8.1-1 A輔）

**改了什麼**：`PRD-中心裝備物資.md` 新增 **2.1 節**，兩張表：

- **2.1.1 種子資料（fixture）五條約定**：24 筆、10 分類全涵蓋、三種狀態都出現、至少一個品名重複 2 筆以上、編碼不重複。並附參考解的實際分佈（ICT 5／POWER 3／OFFICE 3／PPE 3／…，「筆記型電腦」與「發電機」各 2 筆），但明講**不必逐字相同**。
- **2.1.2 四個 `data-testid` 掛載點**：`equipment-keyword`／`equipment-total`／`equipment-row`／`equipment-code`，各自寫明「為什麼這個非用 testid 不可」，並註明沒掛也有語意退路。

同時改了兩處舊文字：

- **D3 那格**：拿掉 v1 加的「本課基準格式是 `PW-GEN-003`」，改成「**格式由你定**，只要能即時算出來、且不重複」。因為 v2 的 E3 已經不驗格式了，繼續寫基準格式等於又把答案塞回去。
- **第 6 節前的引言**：改成「PRD 規定功能與資料＋2.1 節的約定，**UI 用字你自己決定**，E2E v2 已改模糊比對」。

**為什麼**：試教時兩位學員都做出符合 PRD 的模組卻被 E2E 判紅，根因是**規格藏在測試裡**。這一節把它搬到明面上。

**對應回饋**：step3 講師觀察 2；step4 PM (c)、(e)2／(e)3；QA (a)、(j)3。

## v2-2　E2E 全面改寫：語意化 selector、動態筆數、模糊比對（8.1-1 B主）

**改了什麼**（`equipment.spec.ts`，+207 −90 行）：

| 原本（v1） | 現在（v2） |
|---|---|
| `getByPlaceholder('項目名稱／編碼')` | `[data-testid="equipment-keyword"] input`，`.or()` 退回「頁面第一個 textbox」 |
| `getByText('共 24 筆', { exact: true })` | 讀 `[data-testid="equipment-total"]`，退路 `/共\s*\d+\s*筆/`，**解析出數字當基準** |
| `td.nth(1).locator('div').last()` | `[data-testid="equipment-code"]`，退路才是「該格最後一行」 |
| `getByRole('button', { name: '新增品項' })` | `{ name: /新增/ }` |
| `getByText('已新增品項')` | `getByText(/已新增｜新增成功/)`（正則模糊比對） |
| `dialog.getByText('刪除品項')` | `expect(dialog).toContainText(/刪除/)` |
| `getByText('已儲存變更')` | `getByText(/已儲存｜儲存成功/)` |
| `toHaveValue('PW-GEN-003')` | 只驗「非空、無空白、≥3 字、`/^[A-Za-z0-9][A-Za-z0-9._-]*$/`」**＋搜尋該編碼恰好 1 筆（證明不重複）** |
| E2 寫死 24→2→24 | **先讀總筆數當基準**；用第一列編碼搜 → 恰 1 筆；轉小寫再搜 → 仍 1 筆（驗不分大小寫）；用品名搜 → `1 ≤ 命中 < 總數`；清除 → 回到基準 |
| E7 `new RegExp('77\s')` | 讀整列文字，`toContain('77')` ＋ `toContain(地點)`，**不綁欄位在第幾格** |
| E7 `toHaveURL(/\?.*mode=edit/)` | 只要求「進到這一筆的表單頁」，不綁 `?mode=edit` 這種路由實作 |

檔頭註解也重寫了，把 v2 的三條原則寫死在裡面（語意優先／數字動態／真沒語意才用 testid，而且 testid 要寫進 PRD）。

**為什麼**：QA 的對抗審查與 PM 的逐條盤點列出 9～11 條「測試在驗 PRD 沒寫的東西」。v2 把它們一條一條拆掉。

**驗證**：對 solution-app 實跑 **7 passed**。

## v2-3　solution-app 加 4 個 `data-testid`（動用 D 條的唯一一次）

**改了什麼**：`pages/equipment/crud/index.vue` 加 4 個屬性，共 4 行、無邏輯變動：

| 屬性 | 掛在哪 |
|---|---|
| `data-testid="equipment-keyword"` | 關鍵字輸入框外框 |
| `data-testid="equipment-total"` | 顯示「共 N 筆」的元素 |
| `data-testid="equipment-row"` | 表格資料列 `<tr>` |
| `data-testid="equipment-code"` | 列內的品項編碼 |

**為什麼**：這 4 個位置真的沒有語意可用（頁面有多個輸入框、「共 N 筆」是自訂文案、手機卡片與表格列並存、編碼跟品名同一格）。

**為什麼不算走回頭路**：因為它們**同步寫進 PRD 2.1.2**，變成講明的約定；而且測試對每一個都留了語意退路，沒掛也不會直接死當。

**這是 V2_MISSION D 條允許的唯一一次 App 變更，範圍就這 4 行。** 其餘 App 程式碼、參考解邏輯、範本一律沒動。

## v2-4　補掉三個假綠（8.1-2）

| 條目 | v1 的漏洞（QA 對抗審查抓到的） | v2 怎麼補 |
|---|---|---|
| **E1** | 只驗「共 24 筆」與有 table——**分頁整個失效、24 筆全倒進表格也會綠** | 加 `expect(rows).toHaveCount(min(總筆數, 20))`，明確驗「第一頁恰好一頁份」 |
| **E4** | PRD 有 6 個必填，**只斷言了分類 1 個**——其餘漏寫驗證照樣綠 | 逐欄斷言 `categoryKey`／`name`／`unit`／`spec1` 四個欄位各自容器內都有非空錯誤訊息；另兩個必填（`qty`、`status`）因為有合法預設值不會觸發紅字，**改成明確驗預設值**（`qty` 為 0、`status` 顯示「正常」），不再默認 |
| **E6** | 「回歸測試」只看 `/template/crud` 有沒有一張表和「共 N 筆」——**人員表單整個壞死也會綠** | 加「**真的點進第一列的檢視頁**」：斷言 URL 進到 `/template/crud/<id>`，且檢視頁渲染出該列的內容 |

## v2-5　run-e2e 內建測試檔 SHA-256 防竄改（8.1-3）

**新增與改動**：

| 檔案 | 做什麼 |
|---|---|
| `step4_loop_e2e/tests.sha256` | 基準清單，保護 `e2e/tests/equipment.spec.ts` 與 `e2e/playwright.config.ts` |
| `run-e2e.ps1`／`run-e2e.sh` | **步驟 0**：跑測試前先比對雜湊，不符就拒絕執行並印出「哪個檔被改了」 |
| `instructor/update-e2e-hash.ps1`／`.sh` | 講師正當改測試後，用來重算基準 |

**幾個刻意的設計**：

1. **連 `playwright.config.ts` 一起保護**。改 `retries`、加 `grep`、動 `testIgnore` 一樣能讓燈變綠，只保護測試本體擋不住。
2. **雜湊前先去掉 CR**，所以 CRLF／LF 差異不影響——Windows 與 macOS 算出同一個值（已實測兩邊一致）。
3. **重算腳本放在 `instructor/`，不放在 `step4_loop_e2e/` 旁邊。** 它是解鎖用的鑰匙，不該跟學員每天要跑的腳本擺在一起。
4. **完全不依賴 git。** 這正是試教時 `git diff e2e/` 失效的原因（學員拿到的是資料夾副本，兩位都實測到 `Not a git repository`）。

**驗證**：故意在測試檔尾端加一行 → `run-e2e.ps1` 印出「FAIL：E2E 測試檔與基準不符，拒絕執行 ／ e2e/tests/equipment.spec.ts（內容被改過）」並停在步驟 0；還原後雜湊回到基準值。

**對應回饋**：step4 PM (b)、(e)5；QA (d)、(j)1。

## v2-6　埠改讀環境變數（8.2-4）

**改了什麼**：

| 檔案 | 改法 |
|---|---|
| `2.1_sample_app/sample-app/nuxt.config.ts` | `port: Number(process.env.PORT) \|\| 3100` |
| `solution-app/nuxt.config.ts` | 同上 |
| `e2e/playwright.config.ts` | `BASE_URL` 整段覆寫，或只給 `PORT`；預設 `http://localhost:3100` |
| `run-e2e.ps1`／`run-e2e.sh` | 讀同一組變數；站點檢查與錯誤訊息全部改用 `$BaseUrl`，不再寫死 3100 |

**預設值一個都沒變**，教材通篇寫的 3100 照樣成立。

**驗證**：`PORT=3277` 跑 run-e2e → 它去檢查 `http://localhost:3277`（證明有讀到）；`PORT=3277 pnpm dev` 啟動 sample-app → 實際起在 3277 且 `/template/crud` 回 200。

**對應回饋**：step2 QA (f)；試教時兩位共用一台機器必須錯開埠，就是這個問題的現場版。

## v2-7　兩份純文字摘要（8.2-5）

| 新檔 | 內容 |
|---|---|
| `step1_why_harness/demo/DIFF_SUMMARY.md` | 三列對照（顏色從哪來／業務規則從哪來／多出來的東西）逐項列出實際數字與行為、規模對照、**10 條可直接寫成測試案例的 QA 驗收特徵清單**，最後明講「這份沒辦法告訴你哪一版好看」 |
| `2.2_design_system/TOKENS_SUMMARY.md` | 三句話版本、token 三層、顏色／間距／圓角／字級四張表、**「token 檔裡的 `#C8232C` 為什麼不算硬編碼」**、以及「這一節你只要帶走什麼」三問 |

**為什麼**：「HTML 在終端機讀不動」是兩位學員在 step0／step1／step2 **連續抱怨三次**的問題，各自估教學效果掉 70～80%。

兩份都在開頭寫明「**取代不了看畫面**」，避免變成偷懶的藉口。

**對應回饋**：step1 QA (c)3、(e)3；step2 PM (a) 第 8 條、QA (b)。

## v2-8　SRS／SDD 最小樣板（8.2-6）

**新檔** `step3_new_module/SRS-SDD-最小樣板.md`：先用白話解釋 SRS／SDD 對不寫程式的人是什麼、PM 只要親自核哪幾段；再把最低門檻定死成 **SRS 四段**（已拍板決策／需求追溯／範圍外／待定與風險）與 **SDD 四段**（檔案責任／資料模型／關鍵決策實作／harness 證據）。

「檔案責任」那一段特別要求寫「共用件**有沒有真的在用**」——這是 step4 架構退化那一條的預防。

**為什麼**：手冊只說「AI 會交出 SRS／SDD」，沒說要看什麼。試教時 PM 交了、QA 沒交，而**任務清單是 AI 自己列的、沒有檢查點**，等於把 T7 的存廢交給運氣。

**對應回饋**：step3 PM (a)4、(e)5；講師觀察 6。

## v2-9　step6 一鍵驗收（8.2-7）

**新增**：`step6_survey/run-survey-e2e.ps1`／`.sh` ＋ `step6_survey/e2e/`（獨立 Playwright 專案，9 條 S1~S9）。

跑 README「③ 驗收」那張清單：S1 必填驗證與聚焦、S2 正常送出、S3 防連點、S4 持久化、S5 管理頁看得到、S6 空狀態、S7 CSV（檔名含日期＋BOM＋中文）、S8 二次確認且確認鈕寫明動作、S9 手機 390 無橫向捲軸且能送出。

**S10（硬編碼色碼）由腳本自己做靜態掃描**，而且只掃「你新增的檔」、不掃 token 正本——就是 v1 第 16 項那個「351 行」陷阱的自動化版本。**第 11 項（無痕視窗）刻意不自動化**，那一項的重點就是要人親眼看到。

**最難的地方是「問卷是學員自己設計的」**，所以整份用通用寫法：

- 表單自動填寫：掃文字框／多行文字／radio／原生 select，再把「點開才有選項」的按鈕逐顆試（Nuxt UI 的 `USelectMenu` 渲染出來只是普通 `<button>`，沒有 `role=combobox`）。
- 筆數：掃 `localStorage` 每一把 key，取「能 parse 成 JSON 陣列」中最長的那個——不管學員把 key 取成什麼名字。
- 文字：一律模糊比對（成功／已送出／感謝）。

**驗證**：拿**試教時學員實際做出來的問卷 App** 當受測目標（用 `PORT=3200` 起，順便再驗一次 v2-6），`run-survey-e2e.ps1` 跑出 **9 passed ＋ S10 通過（掃了 4 個新增檔、0 處硬編碼），總結「驗收全過」**。

過程中修掉兩個真實問題：SPA 還沒渲染完就 `count()`／`innerText()`（`count()` 不會自動等待）、以及下拉不是 `role=combobox` 而是普通按鈕。**這兩個坑正好證明「沒實跑過的驗收腳本不能發」。**

## v2-10　step6 一鍵發布（8.2-8，只寫腳本、不實際發布）

**新增**：`step6_survey/deploy-gh-pages.ps1`／`.sh`。

**預設是演練模式（dry run），什麼都不推。** 流程：① 確認在對的資料夾（有 `nuxt.config.ts` 與 `pages/survey`）② 設 `NUXT_APP_BASE_URL=/<RepoName>/` 建置，並檢查 `index.html` 的資源真的帶上前綴、`.nojekyll` 在（不在就自動補）③ **敏感資料掃描**（帳密／金鑰欄位、台灣手機號、身分證字號、內網位址），掃到就擋下來，要 `-IgnoreSecretScan` 才放行 ④ 印出「來源、目標 repo、目標分支、發布後網址、檔案數」就停。

加 `-Push` ＋ `-RepoUrl` 才會在 `.output/public` 建拋棄式 repo 推上去，並在結尾印出 Pages 設定與**下架／刪 repo 的方法**。

**我沒有執行過任何推送動作，也沒有建立任何 GitHub repo**——腳本只做到語法檢查與程式碼審閱。

**為什麼要做成演練優先**：兩位學員的紙上檢查列出 6+3 個「一步做錯就公開出去」的地雷，其中「沒有撤回說明」與「Pages 免費版強制 public」是教材完全沒提的。

**對應回饋**：step6 PM (e)1～6、(g)6；QA (g)。

## v2-11　HANDBOOK step4 補兩個試教實錄案例（總管補充 9）

**改了什麼**：step4「你應該看到」那張表後面，新增「📓 試教實錄：兩個真的發生過的狀況」兩個框（學員匿名寫 A／B）：

- **案例 A｜兩位學員都守規矩，卻走出完全相反的結局。** 學員 A 停損回報（3 passed / 4 failed，交不出綠燈）；學員 B 照改跑 8 輪全綠，測試一字未動，但把符合 PRD 的實作改成參考解的樣子（overfitting to tests）。**兩人都沒違反那兩條鐵律**——所以補了第三條（每次修改要指出對應 PRD 哪一條或哪個拍板，找不到出處的標成「規格外調整」）。附上學員 A 那句「不作弊、也沒鬼打牆，AI 仍可能因為測試藏了需求，而把一個符合 PRD 的設計改壞」。
- **案例 B｜三道檢查全部放行，架構還是退化了。** 學員 B 把 `useTemplateListPage` 拆掉自己重寫；共用檔雜湊相同 → 過、測試沒被動 → 過、7 條全綠 → 過，**心法卻已破功**。這就是驗收表為什麼多了「共用件還在用嗎」那一列。

> 註：第三條鐵律與「共用件還在用嗎」檢查點本身在 v1（第 7、9 項）就加進 LOOP prompt 與驗收表了；v2 補的是**它們為什麼存在的實錄**。

## v2-12　HANDBOOK step4 補「立場決定審查品質」（總管補充 10 ＝ 8.3-15）

**改了什麼**：對抗審查那段的 prompt 後面新增一則引言，附上同一個 AI 的兩次實證：step1 要它「逐條勾稽」→ 它把「漏了 4 個裸色碼」標成「成立」，**但自己貼的證據寫的是 5 處**（順著教材走）；step4 要它「**盡力推翻**」→ 同一個 AI 挖出三個教材作者自己都沒發現的假綠。

結論一句話：**「幫我檢查一下」得到的是附和，「盡力推翻它」得到的才是審查——立場要寫死在 prompt 裡，不能靠 AI 自己選。**

## v2-13　把新檔案接進動線（配套）

沒有入口的檔案等於不存在，所以在四個地方加了指路：

| 位置 | 加了什麼 |
|---|---|
| HANDBOOK step1「你應該看到」 | 打不開瀏覽器就看 `DIFF_SUMMARY.md`，並註明取代不了看畫面 |
| HANDBOOK step2 ⑤ | 開不了瀏覽器就看 `TOKENS_SUMMARY.md`，順帶點出「token 檔裡有 hex 為什麼不算硬編碼」 |
| HANDBOOK step3 ④ | T7 不要用「有兩個檔就打勾」驗收，打開 `SRS-SDD-最小樣板.md` 對四段 |
| `step6_survey/README.md` ③④ | 一鍵驗收腳本（含換埠寫法）、一鍵發布腳本（強調預設演練、推之前先讀那四點手動檢查） |

---

## v2 驗證總表

| 驗證項目 | 結果 |
|---|---|
| **step4 E2E 對 solution-app 實跑** | **7 passed / 0 failed / 0 skipped，「E2E 全綠」，exit 0** |
| 雜湊防竄改（正向） | 未竄改時印「PASS：測試檔與基準相符」，照常往下跑 |
| 雜湊防竄改（負向） | 偷加一行 → 停在步驟 0，印出被改的檔名，拒絕執行 |
| 雜湊跨平台一致 | PowerShell 版與 `sha256sum` 版對同兩個檔算出完全相同的值 |
| `PORT` 覆寫（測試端） | `PORT=3277` → run-e2e 去檢查 `http://localhost:3277` |
| `PORT` 覆寫（App 端） | `PORT=3277 pnpm dev` → sample-app 起在 3277，`/template/crud` 回 200 |
| step6 一鍵驗收實跑 | 對學員實作的問卷 App：**9 passed ＋ S10 通過 →「驗收全過」** |
| 所有 `.ps1` 語法 | 5 支全部通過 `PSParser::Tokenize` |
| 所有 `.sh` 語法 | 4 支全部通過 `bash -n` |
| `preflight.ps1` 實跑 | 10 項全 PASS、中文正常 |
| `HANDBOOK.html` 標籤配對 | 0 個未閉合、0 個錯配 |
| 有沒有動到不該動的 | 只有 solution-app 的 4 行 `data-testid`（D 條明文允許）。範本 App 邏輯、參考解邏輯、其他頁面一律沒動 |

## v2 仍然沒做的（留給下一版）

| 項目 | 為什麼還是不做 |
|---|---|
| 真的發布到 GitHub Pages | 需要真人帳號授權。腳本寫好了、演練驗過了，但**推送這一步必須由帳號持有人自己按**。 |
| `templateCsv.ts` 加 CSV 公式注入防護 | 動的是「直接共用」的共用工具，會影響所有模組與既有測試，超出這一輪範圍。QA 的建議已記在 COURSE_REPORT 8.3-12。 |
| `package.json` 預裝 `vue-tsc`、`gh-pages` 套件 | 違反 `CLAUDE.md` 的「不准擅自加套件」。`gh-pages` 的功能已改用純腳本達成（v2-10），不必加相依。 |
| PRD 補電話分機／排序 tie-breaker／數量上限等邊界規格 | 會讓課堂版 PRD 變厚，與「一堂課做得完」衝突。建議另開「正式上線前要補的規格」附錄，見 COURSE_REPORT 8.3-12。 |

---

## v2 修正紀錄（Codex 驗收 FAIL 後的回修）

> Codex 對 `484d2a5..b674380` 的驗收判定 **FAIL**，報告在
> `D:\AIWORK\_AICLASS\_LAB\CODEX\workshop\_replies\v2_review.md`。
> 四個阻擋問題（F1～F4）＋一個路徑不一致，全部照修。
> **回修後重跑：`run-e2e.ps1` 與 `run-e2e.sh` 都是 7 passed / 0 failed / 0 skipped、exit 0。**

Codex 判 PASS 的兩項維持不動：E6「真的點進人員檢視頁」、`data-testid` 的最小幅度。

### F1　E1 的「第一頁 20 列」是假綠 → 改成驗死 24 筆 ＋ 恰好 20 列

- **問題**：v2 寫的是 `total > 0` ＋ `toHaveCount(Math.min(total, 20))`。
  Codex 的反例很準：**種子若因回歸只剩 10 筆、第一頁也顯示 10 列，兩個斷言都會過**——分頁根本沒驗到。
- **修法**（`equipment.spec.ts` E1）：
  - `expect(total).toBe(24)`（PRD 2.1.1 已把種子約定寫死成 24 筆，直接驗死）
  - `expect(total).toBeGreaterThan(20)`（講明「種子必須多於一頁，分頁才驗得到」）
  - `expect(rows).toHaveCount(20)`（**恰好** 20，不再用 `min()`）
  - 測試名稱改成「種子 24 筆、桌機表格、第一頁恰好 20 列」
- **實測佐證**：`[data-testid="equipment-row"]` 與 `table tbody tr` 都數到 **20**，總筆數文字是「共 24 筆」——
  兩個斷言都是精確相等，10 筆或 24 列都過不了。

### F2　`toHaveValue(/^0*$/)` 連空字串都放行 → 改精確比對，並補「逐欄弄成不合法」

- **問題**：`/^0*$/` 的 `*` 是「零個以上」，**空字串也符合**。等於「數量預設值壞成空白」會被放行；
  而 qty 又只靠這一條守門，實際上沒被驗到。
- **修法**（`equipment.spec.ts` E4，測試名稱改為「PRD 六個必填欄位逐欄把關，錯誤不離頁」）：
  1. `toHaveValue('0')` 精確比對，並在註解裡寫明原本那個寫法為什麼是假綠。
  2. 新增第 (2) 段「把每個必填欄位弄成不合法再存一次」：
     - 單位／規格說明：**填了再清空** → 各自要出現錯誤（證明是「會重新驗」，不是只有初始狀態才報錯）
     - 數量：**清空** → 要被擋；**填 `-1`** → 要被擋（PRD 第 2 節「必填、≥ 0」）
     - 狀態：是下拉且有預設值，UI 上清不掉 → 用「預設值合法性」把關（`toContainText(/正常/)`）
     - 分類／項目：新表單本來就是空的，第 (1) 段的空表單提交已經驗過
  3. qty 的錯誤訊息加驗 `toHaveText(/數量/)`——只驗「有紅字」的話，萬一那個 `<p>` 是別的東西渲染的就白驗了。
- **負向測試（證明不是空驗）**：把參考解 `save()` 裡的 qty 檢查整段拿掉後重跑，
  E4 **確實在第 243 行 `數量必填，清空應被擋下` 掛掉**。復原後恢復綠燈。
- **一個我做錯又改回來的插曲，誠實記錄**：一開始我只看 `rulesFor()`，沒看到 `save()` 裡另外寫的 qty 檢查，
  誤判「參考解沒驗 qty」，於是在 `rulesFor()` 加了一組 `qty` 規則。
  後來探 DOM 才發現 `[id].vue:377-382` 早就有「非數字 → 請輸入數量／< 0 → 數量不可小於 0」，
  而且旁邊還寫了註解說明「非純字串規則，於引擎外另行檢查」。**我加的是重複邏輯，已經 `git checkout` 還原。**
  → 最終結果：**這一輪沒有動任何 App 邏輯**，`step3_new_module/solution-app` 只保留 v2 那 4 行 `data-testid`。

### F3　移除越界斷言：編碼格式、三處成功 toast

- **問題**：
  1. 編碼還在驗「≥ 3 字、無空白、只允許 ASCII 英數與 `._-`」。但 PRD D3 明說格式由學員拍板，
     只承諾「即時產生」與「不重複」——合法的 `裝備-1` 會被判紅。
  2. E3／E5／E7 都要求成功 toast 存在且文字落在特定正則內。PRD 只規定**驗證失敗**要有 toast，
     新增／刪除／編輯成功只要求資料生效；PRD 還明說 UI 用字由學員決定。
- **修法**：
  | 位置 | 拿掉什麼 | 改用什麼當證據 |
  |---|---|---|
  | E3 編碼 | 長度、空白、字元集三條斷言 | 只留「不為空」（PRD D3 的「即時產生」）＋ 存檔後用編碼搜尋恰好 1 筆（PRD D3 的「不重複」） |
  | E3 成功 | `getByText(/已新增｜新增成功/)` | URL 回列表（PRD 6-6）＋ 總筆數 +1 ＋ 用編碼查得回那一筆 |
  | E5 成功 | `getByText(/已刪除/)` | 總筆數 -1 ＋ 該編碼從表格消失（PRD 6-8 只要求「二次確認才生效」） |
  | E7 成功 | `getByText(/已儲存｜儲存成功/)` | URL 回列表 ＋ 用編碼查回那一筆、列文字含新數量與新地點 |
- 檔頭的「v2 三條原則」改寫成四條，把「**只驗 PRD 承諾過的事**」獨立成一條並舉例。

### F4　manifest 驗證改 fail-closed，並改口稱「意外修改偵測」

- **問題**：舊寫法對空白行、註解、格式錯誤的行一律 `continue`，最後只看 `$tamper` 有沒有內容。
  **把 manifest 清成空檔或只留註解，會直接印出 PASS。** bash 版同樣。
- **修法**（`run-e2e.ps1` 與 `run-e2e.sh` 同步）：
  - 受保護清單寫成腳本內常數 `ProtectedFiles = { e2e/tests/equipment.spec.ts, e2e/playwright.config.ts }`。
  - 每一行非註解內容都必須符合 `^[0-9a-fA-F]{64}\s+<路徑>$`，**不合就 FAIL**（不再默默跳過）。
  - **重複路徑** → FAIL。**不在受保護清單內的路徑** → FAIL。**缺少任一必要路徑** → FAIL（空檔就是缺兩項）。
  - 檔案不存在 → FAIL；雜湊不符 → FAIL。
- **負向測試（PowerShell 與 bash 各跑一輪，8 種情境）**：

  | 情境 | ps1 | sh |
  |---|:---:|:---:|
  | 空檔 | exit 1 | exit 1 |
  | 只留註解 | exit 1 | exit 1 |
  | 格式壞掉（非 hex） | exit 1 | exit 1 |
  | hash 長度不足 | exit 1 | — |
  | 重複列出 | exit 1 | exit 1 |
  | 多出項目 | exit 1 | exit 1 |
  | 少一項 | exit 1 | exit 1 |
  | 測試檔內容被改 | exit 1 | exit 1 |
  | 正常 | PASS，往下跑 | PASS，7 passed |

- **改口徑**：Codex 說得對——腳本、測試、基準都在同一份學員可寫的副本裡，
  重算工具搬到 `instructor/` 只是「不順手」，**不是權限邊界**。所以文件一律改稱**「意外修改偵測」**，
  並在 `run-e2e.*`、`instructor/update-e2e-hash.*`、`tests.sha256` 表頭三處都寫明：
  - 它確認的是「你手上的測試，跟講師發出去的是同一份」；
  - 擋得住「改了測試忘了同步基準」與多數順手放寬斷言；
  - **擋不住「有寫入權限又刻意連基準一起重算」的人**；
  - 要真的防蓄意作弊，可信基準與評測器必須放在學員改不到的地方（講師端／CI）。

### 附帶修正　runner 錯誤訊息一律印絕對路徑

- **問題**：`run-e2e.ps1` 的說明寫「在 step4_loop_e2e 執行」，但 HANDBOOK 是從 repo 根目錄叫它；
  於是 `..\instructor\...` 與 `instructor\...` 兩種相對路徑，總有一個是錯的。
- **修法**：兩支腳本都從**腳本自身位置**推導絕對路徑再印：
  - 重算基準的指令：`powershell -ExecutionPolicy Bypass -File "<絕對路徑>\instructor\update-e2e-hash.ps1"`
  - 啟動受測 App 的指令：`cd "<絕對路徑>\step3_new_module\my-equipment-app" ; pnpm dev`，
    並補一句「還沒做 step3 的話，改用參考解 solution-app」。
  - 不管你從哪個目錄執行，印出來的路徑都貼得動。

### 連帶同步的教材文字

v2 的測試行為變了，HANDBOOK 幾處敘述就變成過時，一併更新：

| 位置 | 改了什麼 |
|---|---|
| step4「先把話講清楚」引言 | 原本教學員「(2) 類斷言紅了不是你的錯」。現在那些斷言已經全部拿掉，改成說明「這 7 條只驗 PRD 承諾過的事」「UI 用字由你決定」，並明講**再遇到 (2) 類就是教材缺陷、請回報** |
| 七條測試對照表 | E1 改「種子 24 筆＋第一頁恰好 20 列」；E2 改「編碼／大小寫／品名／清除」；E3 拿掉 `PW-GEN-003`、改「即時算出且不重複（格式不限）」；E4 改「逐欄確認六個必填」；E6 改「點得進人員檢視頁」 |

### 這一輪的最終驗證

| 項目 | 結果 |
|---|---|
| `run-e2e.ps1` 對 solution-app | **7 passed / 0 failed / 0 skipped，exit 0** |
| `run-e2e.sh` 對 solution-app | **7 passed / 0 failed / 0 skipped** |
| manifest fail-closed 負向測試 | ps1 8 種情境、sh 7 種情境，全部正確拒絕 |
| E4 負向測試 | 拿掉參考解的 qty 檢查 → E4 如預期失敗；復原後恢復綠燈 |
| E1 斷言真實性 | 實測 row 數 20、總筆數「共 24 筆」，兩條都是精確相等 |
| 雜湊跨平台一致 | PowerShell 版與 `sha256sum` 版算出相同值 |
| `.ps1` / `.sh` 語法 | 全部通過 |
| `HANDBOOK.html` 標籤配對 | 0 未閉合、0 錯配 |
| App 程式碼 | **這一輪 0 變更**（誤加的 qty 規則已還原；只保留 v2 的 4 行 `data-testid`） |
