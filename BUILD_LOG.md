# BUILD_LOG — 這門課是怎麼被做出來的

> 2026-07-12 凌晨，由 Claude（Fable 5）擔任總指揮，分派 12 個子代理（Opus／Sonnet 分級）＋ Codex（GPT-5.6）對抗審查，一夜完工。
> 本紀錄本身就是 step4 教的方法論（分工、LOOP、視覺審查、對抗審查）的實跑證據。

## 建置流程（六波）

| 波次 | 工作 | 執行者 |
|:---:|------|--------|
| 1 偵察 | 摸清 Live 版全貌（判定十大複雜點）＋讀災防平台裝備物資頁原始碼 | Explore(Sonnet)＋Opus |
| 2 裁決 | PRD 逆向產出（26 欄實況）→ 課堂範圍六題裁決（12 欄＋補刪除） | Opus 產出、Fable 裁決 |
| 3 教材 | step0/1/2/3/5 教材、CLAUDE.md 專案憲法、Design System HTML、harness 對比 demo | Opus×4＋Sonnet×1 平行 |
| 4 實作 | solution-app 裝備物資模組（build 0 error）＋ step4 e2e 專案（實跑全綠） | Opus×2 |
| 5 審查 | E2E 視覺審查（16 張截圖逐張人眼級檢視）＋ Codex 全庫對抗審查（17 條）＋雙代理修正＋複驗 | Fable＋Codex＋Opus×2 |
| 6 交付 | 圖文學習手冊 MD/HTML、README、git 納管 | Opus＋Sonnet＋Fable |

## 對抗審查戰果（R1）

Codex 唯讀掃全庫，**17 條發現（P1×9、P2×8、P0×0）**，判定「需修正後開課」。
全部裁決與修法見 [step4_loop_e2e/ADVERSARIAL_REVIEW_R1.md](step4_loop_e2e/ADVERSARIAL_REVIEW_R1.md)。三個最有教學價值的：

1. **preflight.ps1 印 FAIL 卻 exit 0**——Codex 在自己機器上現場實證（它的 C 槽剛好不足）。evaluator 假綠是頭號地雷。
2. **起手 prompt 要 AI 讀的檔案，沒有任何一個工作目錄能同時讀到**——寫教材的想像與檔案實際佈局分家。修法：範本專案自包含 harness 四件＋新增「3.0 準備工作區」。
3. **宣稱驗證 CRUD 但測試沒有 U**——編輯功能壞掉也能全綠。修法：補 E7 編輯測試。

修正後複驗：**E2E 7/7 全綠（0 failed / 0 skipped）、preflight 三路徑（PASS→0／FAIL→1／WARN→0）實測正確**。

## 驗證證據

| 項目 | 結果 |
|------|------|
| solution-app `pnpm build` | 0 error |
| `/equipment/crud`＋`/template/crud` | 皆 200 |
| E2E（step4_loop_e2e/run-e2e.ps1） | 7/7 綠、exit 0（由總指揮獨立複跑確認，非只信代理回報） |
| 視覺審查 | 16 張截圖全數由總指揮親自檢視（含驗證紅字、刪除確認框、手機視口、連動下拉） |
| CODE-RULES 自檢 | equipment 模組零硬編碼 hex/px、零 console.log、行數達標（Codex 獨立確認） |

## 已知限制（誠實清單）

- E2E 首跑會下載 chromium（runner 已內建 `npx playwright install chromium`），離線教室要事先跑過一次。
- mock 資料在記憶體，重新整理即重置——這是刻意設計（教材已註明：mock 欄位＝未來接後端的 interface）。
- step3 參考解的釐清選擇題對話（step3_clarify.png）為示意重演圖，題目與裁決內容取自真實的 SCOPE 決策。
- 尚未經真人講師 120 分鐘 dry run（開課前建議做一次）。

## R2：教師／學生雙角色審查（2026-07-12，外部獨立實跑）

使用者派出的獨立審查以講師＋學員雙視角實跑全課程，出具 [COURSE_REVIEW_TEACHER_STUDENT.md](COURSE_REVIEW_TEACHER_STUDENT.md)：**P1×8、P2×8、P0×0，判「有條件可試教」**。全數採納修正（三個 agent 平行執行）：

| 主題 | 修正 |
|------|------|
| 學員路徑被答案污染（P1-3） | 新建 `instructor/`：SCOPE 答案移出學員路徑、3.0 只複製 PRD、講師答完六題才發放 |
| LOOP 沒有紅（P1-6） | 新建 `step4_loop_e2e/lab-red-to-green/`：注入真實 bug（拿掉分類必填）→ E4 紅 → 判因 → 修 → 綠，全循環實測通過 |
| preflight 蓋不住真阻斷（P1-2） | 擴成 10 項：加 ExecutionPolicy、工作區可寫、npm registry、chromium 快取、AI Agent CLI（FAIL/WARN 分級） |
| 講師配套缺席（P2-8/P1-1） | `instructor/GUIDE.md`（120 分時間軸＋故障分流）＋`apply-solution-checkpoint.ps1`（78 分鐘落後即套參考解，已實測） |
| 評量缺席（P2-1） | `step5_wrapup/RUBRIC.md`：100 分六面向、70 及格、三項不得為零＋學員提交格式 |
| 名實不符 | 「E2E 視覺審查」→「E2E 功能驗證＋失敗截圖診斷」；「三件套」統一「前端 harness 四件」；效益絕對句改目標句；prompt 遵循≠harness 生效已區分 |
| 程式（P2-7） | `todayString` 撞名改 `equipmentTodayString`，build 警告歸零 |
| 其他 | 使用說明檔頭 Windows 對照表、AGENTS.md（Codex 相容）、Agent 相容表、時數 40/35 校正、step1 A/B 違規計分表、收工 grep allowlist、文件行數/條數同步 |

修正後複驗：build 0 error 0 警告（相關項）、E2E 7/7 綠、lab 紅→綠循環完整、preflight 10 項全過 exit 0。

**尚未完成（人的行動）**：至少 3 位目標學員的 120 分鐘 dry run（正式開課 Gate，見 instructor/GUIDE.md）。時間數據取得前，「120 分鐘完課」視為目標而非承諾。

## 用量

建課輪：Claude 子代理合計約 **1.12M tokens**（偵察 62k＋PRD 133k＋教材群 364k＋實作 164k＋e2e 104k＋手冊 74k＋修正 221k）＋總指揮約 150k；Codex 約 **129k**。R2 修正輪：Claude 子代理約 **280k**＋總指揮約 40k。
