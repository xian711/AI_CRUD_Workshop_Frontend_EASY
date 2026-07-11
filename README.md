# AI CRUD 工作坊 — Frontend EASY 版

> 一句話：**範本給骨架、harness 給規矩、AI 出勞力**——2 小時學會用「CRUD 標準範本＋AI harness」把新模組從三天壓到一小時內完工。

## 快速開始（學員）

```powershell
# 1. 前置檢查（Node、pnpm、git、port 3100、磁碟）
cd step0_course_intro
.\preflight.ps1

# 2. 全數 PASS 後，打開 START_HERE.md 開始上課
```

照 `step0 → step1 → step2 → step3 → step4 → step5` 順序走，每個資料夾都有 README 帶路，**不要跳步**。
想看圖文版完整流程：[HANDBOOK/HANDBOOK.md](HANDBOOK/HANDBOOK.md)（或用瀏覽器開 `HANDBOOK/HANDBOOK.html`）。

## 課程地圖

| 資料夾 | 內容 | 時間 |
|--------|------|:---:|
| [step0_course_intro/](step0_course_intro/) | 課程說明、前置檢查、大綱與預期效益 | 10 分 |
| [step1_why_harness/](step1_why_harness/) | 為什麼要 harness：同一句需求，有／沒有 harness 的產出對比 demo | 15 分 |
| [step2_speedrun_kit/](step2_speedrun_kit/) | 快速完工秘笈：玩範本 → SRS/SDD → harness 三件套 → Design System → 範本程式 | 35 分 |
| [step3_new_module/](step3_new_module/) | 複製範本開發新模組：真實 PRD → AI 釐清選擇題 → 任務清單 → 生成 → 驗收 | 40 分 |
| [step4_loop_e2e/](step4_loop_e2e/) | 加速技：LOOP 工程＋E2E 視覺審查＋雙 AI 對抗審查 | 15 分 |
| [step5_wrapup/](step5_wrapup/) | 課程總結、回去公司怎麼用 | 5 分 |
| [HANDBOOK/](HANDBOOK/) | step-by-step 圖文學習手冊（16 張實拍截圖） | 課後自學 |

## 兩個可以跑的專案

| 專案 | 位置 | 怎麼跑 |
|------|------|--------|
| 範本正本（人員 CRUD） | `step2_speedrun_kit/2.5_sample_app/sample-app/` | `pnpm install` → `pnpm dev` → http://localhost:3100/template/crud |
| 參考解（含裝備物資模組） | `step3_new_module/solution-app/` | 同上 → http://localhost:3100/equipment/crud |

兩個都用 port 3100，**一次只跑一個**。E2E 驗證：`step4_loop_e2e/run-e2e.ps1`（需 solution-app 跑著）。

## 這門課的題目是真的

step3 的 PRD 是從**災防協作平台的真實頁面**（中心裝備物資，26 個欄位）逆向整理的，包含「原系統沒有刪除功能」這種真實缺口——所以你會學到最重要的一課：**先用選擇題釐清範圍，再動工**。

## 與 Live 版的關係

本 EASY 版是 `AI_CRUD_Workshop_Frontend_Live` 的簡化教學版：拿掉雙 Track 對照實驗、TDD 紅綠燈、QA mutation 等進階治理，聚焦「harness＋範本＝快速完工」一條主線。上完 EASY 版想深入，再去 Live 版。

---
教材由 Claude（Fable 5）多代理協作產出、Codex（GPT-5.6）對抗審查、E2E 實跑驗證全綠後發佈。建置紀錄見 [BUILD_LOG.md](BUILD_LOG.md)。
