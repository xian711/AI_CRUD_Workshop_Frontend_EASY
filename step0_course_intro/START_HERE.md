# START HERE — AI CRUD 工作坊 EASY 版

## 這門課是什麼

一門 **2 小時**的實作工作坊，教你怎麼用「範本 + harness + AI」長出一個全新的 CRUD 模組。**課程目標：讓新 CRUD 模組的骨架在一小時內長出來**（依 AI Agent 與網路情況而異；實測時間數據將隨試教梯次更新）。

全程動手做，不是聽簡報。你會實際跑一個 Nuxt 3 範本專案、用 AI harness 生出一個全新模組（防救災裝備物資管理），並學會用 LOOP 工程讓 AI 自己「改 → 驗 → 再改」。

## 這門課給誰上

會寫程式，但**還沒用過 AI harness 開發**的工程師。不要求會 Vue／Nuxt，但看得懂前端程式碼會比較順。不需要任何 AI 提示詞撰寫經驗——課程會示範怎麼下指令。

**先備知識白話版**——你需要：

- 會用終端機打指令（Windows 用 PowerShell；macOS／Linux 用內建終端機的 bash／zsh）。
- 跑過 `npm`／`pnpm` 這類套件指令。
- 看得懂 TypeScript 元件程式碼的大意（不用會寫，看懂在做什麼即可）。

你**不需要**：Vue／Nuxt 經驗、提示詞（prompt）撰寫經驗。

## 支援平台：Windows 與 macOS（Linux 亦可）

這門課 **Windows 與 macOS 都能上**。教材附的每支腳本都有兩個版本，檢查項目、判定標準與 exit code 完全一致：

| 用途 | Windows | macOS／Linux |
|---|---|---|
| 前置檢查 | `step0_course_intro\preflight.ps1` | `step0_course_intro/preflight.sh` |
| E2E 一鍵跑 | `step4_loop_e2e\run-e2e.ps1` | `step4_loop_e2e/run-e2e.sh` |
| 注入練習 bug | `lab-red-to-green\inject-bug.ps1` | `lab-red-to-green/inject-bug.sh` |
| 還原練習 bug | `lab-red-to-green\restore.ps1` | `lab-red-to-green/restore.sh` |
| 講師 checkpoint | `instructor\apply-solution-checkpoint.ps1` | `instructor/apply-solution-checkpoint.sh` |

**macOS／Linux 一律用 `bash 腳本名.sh` 的方式執行**（例如 `bash preflight.sh`），這樣就不必先 `chmod +x`。
`pnpm install`／`pnpm dev`／port 3100 這些跟平台無關，兩邊完全一樣。文件中的指令若分成兩塊，照你自己的平台那一塊做即可。

## 上完你能做到什麼

1. **看得出「有 harness」和「沒 harness」的產出差在哪**，並知道差異從何而來（規則、範本、系統文件）。
2. **能複製一份 CRUD 範本，用 AI 生成一個新模組**的 SRS/SDD／前端程式／假資料，並看懂 AI 主動提出的「需求釐清選擇題」該怎麼回答。
3. **能設計並執行一輪 LOOP 驗證**（讓 AI 自己跑「改 → 驗 → 再改」），並知道怎麼用 E2E 視覺審查與雙 AI 對抗審查抓出 AI 自己看不出來的問題。

## 課程大綱

總時間 **120 分鐘**。

| Step | 內容 | 時間 |
|------|------|:---:|
| step0 | 課程說明、前置檢查 | 10 分 |
| step1 | 為什麼要 harness（有/沒有 harness 的產出對比 demo） | 15 分 |
| step2 | CRUD 快速完工秘笈（先玩範本 → 系統文件 → harness 四件 → Design System → 範本程式） | 40 分 |
| step3 | 複製範本開發新模組（PRD → AI 生成 SRS/SDD/程式/假資料 → 反覆修正） | 35 分 |
| step4 | 加速技：LOOP 工程（改→驗→再改）＋ E2E 視覺審查＋雙 AI 對抗審查 | 15 分 |
| step5 | 課程總結、回去怎麼用 | 5 分 |

## 進行方式

- 每個 step 都有自己的資料夾，資料夾裡有一份 `README.md`（或對應的說明文件）帶你走完那一步。
- **請照順序 step0 → step1 → step2 → step3 → step4 → step5 走，不要跳步**——後面的 step 會用到前面 step 產出的範本與觀念。
- step2 內又分 2.1～2.5 五個子步驟，同樣照順序做。

## 課前準備（前一天做）

以下四件事會吃掉不少等待時間，**課堂時間不含這些等待**，請在上課前一天先做完：

1. 跑前置檢查腳本（Windows `preflight.ps1`／macOS 與 Linux `preflight.sh`，見下一節），把 `[FAIL]` 項目全部處理掉。
2. 兩個專案先各跑一次 `pnpm install`：`step2_speedrun_kit/2.5_sample_app/sample-app/` 與 `step3_new_module/solution-app/`。
3. `step4_loop_e2e/run-e2e.ps1`（macOS／Linux 用 `run-e2e.sh`）先跑一次（首跑會下載 Chromium 約 150MB；離線教室務必課前先跑）。
4. 確認你的 AI Agent（Claude Code／Codex／Cursor 等）**已登入且有額度**——這項 preflight 無法自動檢查，要自己確認。

## 開始之前：先跑前置檢查

本資料夾內的前置檢查腳本會跑 10 項檢查，確認你的機器準備好了（Node.js、pnpm、git、port 3100、磁碟空間、可執行腳本的環境、工作區可寫入、npm 連線、Playwright Chromium 快取、AI Agent CLI）。開課前請先執行：

**Windows（PowerShell）**

```powershell
cd step0_course_intro
.\preflight.ps1
```

**macOS／Linux（終端機）**

```bash
cd step0_course_intro
bash preflight.sh
```

看到「前置檢查全數通過，可以開課！」再進入 step1。若有 `[FAIL]` 項目，照腳本印出的修復提示處理後重跑一次。

> 兩個版本只有第 6 項不同：Windows 檢查 `ExecutionPolicy` 有沒有擋住腳本；macOS／Linux 改檢查 `curl` 是否可用（step4 的 `run-e2e.sh` 靠它確認 App 有沒有起來）。其餘 9 項完全相同。
>
> macOS 常見的 `[FAIL]` 修法：`brew install node pnpm`（Node／pnpm）、`xcode-select --install`（git）、
> `lsof -nP -iTCP:3100 -sTCP:LISTEN` 找出占用 3100 的 PID 再 `kill <PID>`。
