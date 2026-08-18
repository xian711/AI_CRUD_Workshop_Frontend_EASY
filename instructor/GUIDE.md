# 講師手冊 — AI CRUD Workshop Frontend（EASY）

> 這份是講師專用。學員版路徑不要放這份，也不要放 `SCOPE-課堂範圍決策.md`（答案）。

## 一、120 分鐘時間軸

前提：依賴、Chromium、Agent 登入已於**課前**完成（見第四節）。每段都要盯「可觀察產出」，沒產出就別往下走。

| 時間 | 活動 | 可觀察產出 |
|---:|---|---|
| 0–8 | 目標、規則、前置檢查（`preflight.ps1`／`preflight.sh`） | preflight 截圖／exit 0 |
| 8–20 | step1 固定需求 A/B 對比 | 每組指出至少 5 個規則差異 |
| 20–38 | 玩範本：操作人員 CRUD | C／R／U／D／Filter／CSV checklist 打勾 |
| 38–50 | harness 四件與「複製 vs 共用」邊界 | 能口頭說明 5 複製＋3 共用 |
| 50–68 | 讀課堂版 PRD，拍板三個決策點 | 三題答案＋每題一句理由 |
| 68–78 | AI 產任務清單，人工審核 | 8–10 項可驗收任務 |
| 78–95 | 載入 checkpoint 或 AI 完成核心差異 | equipment module 可啟動 |
| 95–107 | 人工驗收：桌機＋手機 | 驗收紀錄＋至少一個缺陷 prompt |
| 107–117 | LOOP：學員貼一個 prompt，AI 把學員自己的模組修到 E2E 全綠 | LOOP 報告（每輪紅／根因／修檔）＋7 條全綠 |
| 117–120 | Exit ticket | 一句帶回公司的導入做法 |

> 若要讓每位學員都等 AI 從空白生成完整 8–10 任務，改排 150–180 分鐘。

## 二、checkpoint 發放時機

- **判斷點在 78 分鐘。** 若學員的 AI 生成明顯落後（任務清單還沒開工、或生成卡住），別讓全班等——直接套參考解讓大家跟上驗收與 LOOP。
- 指令（在 `instructor/` 資料夾執行，參數指學員專案根目錄）：

```powershell
# Windows（PowerShell）
.\apply-solution-checkpoint.ps1 -Target ..\step3_new_module\my-equipment-app
```

```bash
# macOS／Linux（終端機）
bash apply-solution-checkpoint.sh --target ../step3_new_module/my-equipment-app
```

- 行為：防呆確認 Target 是 Nuxt 專案 → 覆蓋 6 個裝備模組專屬檔（原檔先備份到 `<Target>/.checkpoint-backup/`）→ 提示重啟 `pnpm dev` 後開 <http://localhost:3100/equipment/crud>。
- 套完務必請學員重啟 dev server。
- 混合班（有人 Windows、有人 Mac）：兩版腳本套的是同樣 6 個檔、同樣的備份位置，講師只要記得學員用哪個平台就發哪一行指令。

## 三、故障分流表

| 狀況 | 現場處置 |
|---|---|
| 網路斷 | 走離線路線：課前已裝依賴＋Chromium，全程不連網也能跑；生成改用 checkpoint。 |
| Agent 額度用盡 | 停止讓該生等生成，直接套 checkpoint 進到驗收／LOOP，課後再自行補生成練習。 |
| port 3100 被占 | Windows：`Get-NetTCPConnection -LocalPort 3100` 找 PID → `Stop-Process -Id <PID>`。macOS／Linux：`lsof -nP -iTCP:3100 -sTCP:LISTEN` 找 PID → `kill <PID>`。再重啟 dev。 |
| Mac 學員跑 `.sh` 報 `$'\r': command not found` | 檔案被存成 CRLF。用 `sed -i '' $'s/\\r$//' 腳本.sh` 修掉，或重新 `git clone`（repo 已用 `.gitattributes` 鎖 `*.sh` 為 LF）。 |
| Mac 學員跑 `.sh` 報 `permission denied` | 一律教他們用 `bash 腳本.sh` 執行，不需要 `chmod +x`。 |
| Playwright 首跑下載慢 | 課前先跑一次把 chromium 抓好；現場才發現就先套 checkpoint、LOOP 段補跑。 |
| pnpm install 卡住 | 用講師機開熱點，或發放預先打包的 `node_modules` 壓縮包直接解壓。 |

## 四、開課前人工檢查（自動化檢查做不到的）

前置檢查腳本（`preflight.ps1`／`preflight.sh`）只驗 Node／pnpm／git／port／磁碟等環境項。以下**逐位學員**當面確認：

- [ ] AI Agent（Claude／Codex／Cursor 等）已**登入**且可用。
- [ ] 帳號**額度足夠**跑完一輪生成（8–10 任務）。
- [ ] Agent 在**寫檔（Agent）模式**下能實際建立／修改專案檔案。
- [ ] 確認學員的作業系統，發對應版本的指令（Windows `.ps1`／macOS `.sh`）；Mac 學員請他們用 `bash 腳本.sh` 執行。

> **正式開課 Gate：至少 3 位目標輪廓學員完成完整 dry run，記錄各段實際耗時（中位數與最慢值）。** 未達標只做內部小班試教，不對外宣稱「120 分鐘」。

## 五、常見學員提問標準答覆

**「為什麼我的 AI 生成結果跟參考解不一樣？」**

> 正常，而且不代表錯。harness 約束的是**規則與骨架**（色碼走 token、命名慣例、驗證規則、複製 vs 共用的邊界），不是**逐行輸出**。只要規則沒違反、驗收點都過，命名或排版跟 solution-app 有出入完全 OK。真正要抓的是「有沒有違反 CODE-RULES、驗收點是否全過」，不是「跟參考解一不一樣」。這也正是 step1 A/B 想讓你看到的：harness 收斂的是品質與一致性，不是把每個人變成同一份 code。
