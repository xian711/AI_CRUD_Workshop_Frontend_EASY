# AI CRUD Workshop Frontend EASY－教師／學生雙角色審查報告

審查日期：2026-07-12  
審查範圍：`AI_CRUD_Workshop_Frontend_EASY/` 全課程教材、範本、參考解、建置流程與 E2E

## 1. 執行摘要

**結論：有條件可試教，尚不建議直接正式開課。**

課程的技術底座是可用的：前置檢查通過、兩個 Nuxt 專案都能正式建置、參考解在桌機與手機寬度可操作、7 條 E2E 全綠。課程主線「範本 → harness → 需求裁切 → AI 生成 → 驗收」也比一般只教 prompt 的課完整。

目前最大問題不是 App 跑不起來，而是教學承諾與學員活動沒有完全對齊：

1. 120 分鐘尚未經真人 dry run，現有工作量很可能超時。
2. Step 3 預先把 SCOPE 答案交給 AI，削弱需求釐清練習。
3. Step 4 從全綠測試開始，學員沒有真正經歷「紅 → 修 → 綠」LOOP。
4. 前置檢查沒有涵蓋 AI Agent、帳號／額度、網路、Chromium 與 ExecutionPolicy 等真正會擋課的條件。
5. 教材對 harness 的「三件套／四件」定義、AI 自動讀取規則與 3000／3100 port 說明不一致。

問題分級：**P0 0 項、P1 8 項、P2 8 項**。完成本報告 G0 後可進行小規模試教；至少取得兩梯次數據，再宣稱可穩定於 120 分鐘完成。

## 2. 審查方法與實跑證據

### 2.1 兩個角色

- 老師角色：檢查學習目標、先備知識、節奏、可教性、示範風險、評量與教材一致性。
- 學生角色：依 README／HANDBOOK 從環境檢查、安裝、建置、啟動、桌機／手機操作到 E2E 實際走一輪。

### 2.2 實際結果

| 驗證 | 結果 | 證據摘要 |
|---|---|---|
| `step0_course_intro/preflight.ps1` | PASS | Node 24.13.0、pnpm 10.33.0、git 2.54.0、3100 空閒、磁碟足夠，exit 0 |
| sample-app `pnpm install --frozen-lockfile` | PASS | 726 packages，安裝及 `nuxt prepare` 成功 |
| sample-app `pnpm build` | PASS | Nuxt 3.21.1 / Vite 7.3.1，Build complete |
| solution-app `pnpm install --frozen-lockfile` | PASS | lockfile 一致，postinstall 成功 |
| solution-app `pnpm build` | PASS with warning | Build complete；出現重複自動匯入 `todayString` 警告 |
| `run-e2e.ps1` | PASS | 7 passed / 0 failed / 0 skipped，exit 0，約 9.3 秒 |
| 真實瀏覽器桌機 1280 寬 | PASS | `/equipment/crud` 顯示 24 筆、篩選、CSV、排序、分頁與 CRUD 操作；console 0 error |
| 真實瀏覽器手機 390×844 | PASS | 桌面表格正確切成資訊等價卡片，CRUD 操作仍存在 |
| Markdown 本地連結 | PASS | 掃描未發現失效的相對連結 |

建置的非阻斷警告：

- `/images/header/bg.svg` 在 build time 未解析，會保留到 runtime。
- Node 24 顯示相依套件 `DEP0155` deprecation warning。
- solution-app 的 `todayString` 同時由 `useEquipmentItems.ts` 與 `useTemplateMembers.ts` export，Nuxt 忽略前者的自動匯入。

## 3. 老師角色審查

### 3.1 值得保留

- 三個學習目標有清楚遞進：辨識 harness、用 AI 生成模組、執行 LOOP。
- PRD → 六題 SCOPE 裁切非常適合教「先決策、再生成」。
- 範本與參考解皆可獨立執行，且 package version 有 pin，降低現場更新風險。
- E2E 已涵蓋 Create／Read／Update／Delete、validation 與 template regression。
- runner 對 test 數量、skipped、flaky 與 exit code 採 fail-closed，能避免假綠。
- 停損規則「同一問題修兩次仍失敗就停」具實務價值。

### 3.2 教師判定

目前可作為內部小班試教教材，但講師必須準備 checkpoint、離線依賴與時間盒。若直接讓每位第一次接觸的學員從空白複製、與不固定的 AI Agent 對話並完成 8–10 個任務，120 分鐘的可預測性不足。

## 4. 學生角色旅程

| Step | 學生實際體驗 | 結果／摩擦 |
|---|---|---|
| 0 前置檢查 | 指令短、錯誤提示明確 | 本機順利；但未檢查 AI Agent、網路、瀏覽器與 Chromium |
| 1 harness 對比 | 兩個 HTML 可直接開、差異容易看懂 | 容易理解，但屬策展成品，不是可重現 A/B 實驗 |
| 2 範本操作 | 安裝、啟動與 CRUD 都可完成 | 技術上成功；子項標示合計 40 分鐘，總表卻只排 35 分鐘 |
| 2 完整複製說明 | 開頭說教材用 3100 | 後文仍多處使用 3000／3001、`cd frontend` 與 bash 指令，Windows 學員容易照抄失敗 |
| 3 準備工作區 | PowerShell Copy-Item 流程合理 | 第二次安裝與 AI 初始化會吃時間；SCOPE 同時複製等於先提供答案 |
| 3 AI 釐清／生成 | Prompt 結構清楚，有救援與收工 prompt | Agent 種類、讀規則方式、額度與生成時間未標準化，結果不可預測 |
| 3 驗收 | 參考解 CRUD 可實際使用，桌機／手機皆正常 | build 有 `todayString` 重複匯入警告；人工驗收缺提交證據格式 |
| 4 E2E | 腳本一鍵跑，7 條全綠 | 學員只看到綠，沒有 LOOP 的「發現紅、判因、修正、再綠」核心經驗 |
| 5 收尾 | 回公司導入的方向清楚 | 沒有正式 rubric、個人產出與後續練習題 |

## 5. P1－開課前應修正

### P1-1　120 分鐘尚未被真人驗證

證據：`README.md:20-27` 配時合計 120 分；`BUILD_LOG.md:43` 明載尚未做真人 120 分鐘 dry run。Step 2 子項在 `step2_speedrun_kit/README.md:8-14` 合計 40 分，總表卻排 35 分。Step 3 的 40 分鐘還包含複製、安裝、讀多份文件、六題釐清、生成 8–10 個任務及人工驗收。

改善：

- 找至少 3 位符合目標輪廓的學員 dry run，記錄每段 P50／P90。
- 安裝依賴、登入 Agent 與下載 Chromium 移至課前。
- 120 分鐘版提供 `checkpoint-after-clarify` 與 `checkpoint-ready-for-e2e`。
- 若不提供 checkpoint，將課程改為 150–180 分鐘。

### P1-2　前置檢查漏掉真正會阻斷上課的依賴

證據：`preflight.ps1:29-98` 只檢查 Node、pnpm、git、port 與磁碟；但 Step 3 要求可讀寫檔案的 Agent 模式，Step 4 首跑可能下載 Chromium，`BUILD_LOG.md:40` 也已承認離線教室需預跑。

改善：新增檢查 AI Agent CLI／IDE 可用性、登入／額度、工作區寫入、npm registry、pnpm store、Chromium executable、ExecutionPolicy；提供離線 cache 或統一教室映像。

### P1-3　Step 3 釐清練習被答案污染

證據：`step3_new_module/README.md:15-25` 要求把 PRD 與 SCOPE 都複製進學員專案；`PROMPTS.md:18-32` 又要求 AI 先讀 SCOPE 再出選擇題。`PROMPTS.md:39` 才以講師註記說真正體驗時不要提供 SCOPE。

改善：

- `student-start/` 只放 PRD，不放 SCOPE。
- 學員完成六題並交出理由後，才由講師解鎖 `instructor-key/SCOPE...md`。
- 參考解與答案移出學員預設搜尋路徑。

### P1-4　把 prompt 遵循誤稱為 harness 生效

Prompt 已直接要求 AI 用選擇題提問，不能用「AI 有提問」證明 harness 有效。

改善：教材文字改為「workflow 指令被遵守」。harness 效果改用固定需求 A/B 實跑，量測硬編碼、命名、驗證、危險操作與 token 違規數。

### P1-5　Harness 定義與 Agent 相容性不一致

證據：`2.3_harness/README.md:6-12` 的三件套包含後端 harness；`step3_new_module/README.md:25` 的四件則是 CLAUDE、CODE-RULES、design summary、使用說明。教材也宣稱 AI 每次自動讀 `CLAUDE.md`，但不同 Agent 的規則入口不同。

改善：

- 統一為「Frontend harness 四件」；後端包移課後附錄。
- 增加 Claude／Codex／Cursor／其他 IDE Agent 相容表。
- 對 Codex 提供 `AGENTS.md`，或所有 Agent 都由起手 prompt 顯式要求讀指定檔。

### P1-6　LOOP 學習目標與活動不對齊

證據：`START_HERE.md:17` 要求學員設計並執行一輪 LOOP；實際 Step 4 只跑已寫好且初始全綠的 7 條測試。

改善：提供可還原的刻意失敗 lab，例如錯 selector 或真的 App bug。學員必須留下紅燈、根因判斷、修正 diff、綠燈四項證據，並自行新增第 8 條測試。

### P1-7　「E2E 視覺審查」名稱高於實際覆蓋

目前 `screenshot: only-on-failure` 是失敗診斷，不是視覺回歸；測試 project 只有桌機。CSV、排序、分頁、完整 URL 同步、手機與 a11y 也未被 7 條測試涵蓋。

改善二選一：

- 誠實改名為「E2E 功能驗證＋失敗截圖診斷」；或
- 加入 `toHaveScreenshot` baseline、390px mobile project、CSV、URL／排序與最小 a11y 檢查。

### P1-8　操作手冊 port 與 shell 自相矛盾

證據：`2.1_play_template/使用說明-複製範本開發新模組.md:4-5` 說工作坊使用 3100，但 `:21-28` 仍寫 `cd frontend`、3000／3001；同檔又被複製到 sample-app 與 solution-app。其 bash 的 `cp`／`mkdir -p` 也不適合直接交給以 PowerShell 開場的 Windows 學員。

改善：建立獨立 Windows 教材版，全程從工作坊根目錄使用 PowerShell 與 3100；加入文件 CI，禁止 student docs 出現 `localhost:3000`、`cd frontend`。

## 6. P2－品質與維護改善

1. **缺少正式 rubric**：HANDBOOK 只有自勾表，不能證明學習目標達成。
2. **Step 1 不可重現**：兩份靜態 HTML 是策展好的結果，應補固定 model／date／prompt／輸出及違規計分表。
3. **收工 grep 過度寬鬆**：`PROMPTS.md:126-134` 要清除所有 Template／template/crud／人員，但參考解合理保留共用 API、來源註解與 regression route；應提供 allowlist。
4. **文件漂移**：`step4_loop_e2e/e2e/package.json:5` 仍寫 6 條，實際是 7 條；TASKS 的行數也已過期。
5. **效益宣稱缺數據**：「三天壓到一小時」「半小時長出骨架」應先標為課程目標或案例結果，再附環境與樣本數。
6. **先備知識低估**：課程稱不要求 Vue／Nuxt，但學員實際需要終端機、npm 生態、Vue SFC、selector、token 與 SRS／SDD 基本閱讀能力。
7. **參考解有重複 auto-import**：`useEquipmentItems.ts:149` 與 `useTemplateMembers.ts:114` 都 export `todayString`，Nuxt 會忽略其中一個。應移到共用 utility 或改成模組私有名稱並顯式 import。
8. **缺教師手冊與故障分流**：應補時間提示、每段投影內容、常見錯誤、何時發 checkpoint、網路／Agent／port／Playwright 故障處置。

## 7. 建議的 120 分鐘可教版本

前提：依賴與 Chromium 已於課前安裝，學員 workspace 與 Agent 已驗證。

| 時間 | 活動 | 可觀察產出 |
|---:|---|---|
| 0–8 | 目標、規則、preflight | preflight 截圖／exit 0 |
| 8–20 | Step 1 固定需求 A/B | 每組指出至少 5 個規則差異 |
| 20–38 | 操作人員 CRUD 範本 | C／R／U／D／Filter／CSV checklist |
| 38–50 | Harness 四件與複製／共用邊界 | 能口頭說明 5 複製＋3 共用 |
| 50–68 | 只讀 PRD、完成六題裁切 | 六題答案＋每題一句理由 |
| 68–78 | AI 產生任務清單，人工審核 | 8–10 項可驗收任務 |
| 78–95 | 載入課前 checkpoint 或 AI 完成核心差異 | 可啟動 equipment module |
| 95–107 | 人工驗收桌機＋手機 | 驗收紀錄與一個缺陷 prompt |
| 107–117 | 刻意失敗 LOOP：紅→判因→修→綠 | 紅／綠輸出＋修正理由 |
| 117–120 | Exit ticket | 一句帶回公司的導入做法 |

若要讓每位學員真的等待 AI 從空白生成完整 8–10 任務，建議改為 150–180 分鐘。

## 8. 建議評量量表（100 分）

| 面向 | 分數 | 合格證據 |
|---|---:|---|
| 環境與範本操作 | 10 | preflight、啟動與基本 CRUD |
| Harness A/B 解釋 | 15 | 至少指出 5 個規則與結果的因果 |
| 需求裁切 | 20 | 六題決策及合理理由 |
| 任務／SRS／實作可追溯 | 15 | 任務可驗收，範圍無偷加漏做 |
| CRUD 與響應式人工驗收 | 25 | C／R／U／D、validation、filter、手機 |
| LOOP 證據與根因判讀 | 15 | 真實紅→修→綠，能分 test bug／app bug |

建議 70 分及格，且「需求裁切」「CRUD 驗收」「LOOP」三項不得為零。

## 9. 改善優先順序與做法

### G0－試教前必做

- 修正 3000／3100、Windows／bash 指令矛盾。
- 拆分 student-start 與 instructor answer／solution。
- preflight 納入 Agent、網路、Chromium、權限與 ExecutionPolicy。
- 建立真正紅→綠的 LOOP lab。
- 完成至少 3 位目標學員的完整 dry run。

### G1－強烈建議

- 統一 Frontend harness 定義與 Agent 相容表。
- 加入正式 rubric、學員提交格式與教師手冊。
- 修正 `todayString` 重複 auto-import。
- Step 1 加入可重現 A/B 與違規計分表。

### G2－持續品質

- 加 mobile、CSV、URL／sort 測試，或降低「視覺審查」宣稱。
- 加 docs lint：連結、port、測試數量、檔案行數與關鍵宣稱同步。
- 收集兩梯 P50／P90、完成率、求助次數與 exit ticket，再更新時程與效益宣稱。

## 10. 最終開課決策

- **現在**：可供內部講師帶領的小班試教；不建議無人協助的正式班或完全自學班。
- **完成 G0 後**：可進行 6–10 人試教。
- **取得兩梯數據並完成 G1 後**：再評估對外正式開課及「120 分鐘」「半小時產出」宣稱。

整體而言，這套教材已經有好的可執行產品與正確的方法論骨架；下一步最需要的不是增加更多內容，而是把學員路徑、評量證據、Agent 差異與課堂時間變成可重現、可量測的教學系統。
