# 2.3 Harness — 前端 harness 四件

> harness 就是「給 AI 的規矩」。範本給骨架、AI 出勞力，harness 負責讓 AI 出的勞力守規矩。
> 這四件湊齊，AI 每次改碼都會自動對照，不會亂換套件、不會硬編碼顏色、不會發明元件。

## 前端 harness 四件

這四份都**已內建在 sample-app 專案根目錄**（`2.5_sample_app/sample-app/`），複製範本開新模組時會一起帶著走。

| 檔案 | 是什麼 | 什麼時候用 | 給誰看 |
|---|---|---|---|
| `CLAUDE.md` | 專案憲法：這個 sample-app 的鐵律精華（技術棧鎖定、檔案地圖、程式規則精華、開發流程） | AI 每次對話**自動讀**（見下方相容表），不用你貼 | AI 主讀；人也該掃一遍知道底線 |
| `CODE-RULES-ui-本專案.md` | 前端程式規則細則：逐項規範（樣式／驗證／URL 同步／CSV／行數預算…）＋範本檔案對照表 | AI 改前端碼前對照；`CLAUDE.md` 講不完的細節在這 | AI 改碼時查；人做 code review 時對照 |
| `design-system-summary.md` | Design System 摘要：token 三層（COMP→SYS→REF）、顏色／間距別名一覽 | 要動視覺（顏色、間距、元件樣式）時對照，一律走 token | AI 改樣式時查；人審視覺一致性 |
| `使用說明-複製範本開發新模組.md` | 操作手冊：怎麼把範本複製成一個新 CRUD 模組（哪些複製、哪些共用、檢查點） | 開新模組動手前先讀一遍 | 人主讀；AI 也可依此走流程 |

## 課後附錄：後端 harness 參考包

| 檔案 | 是什麼 | 什麼時候用 |
|---|---|---|
| `aspnet-api-ai-harness-v5/` | 完整 harness 參考包 **v5.15**（SDD loop、鐵律、驗證分級、各 command；核心規則不綁技術棧，.NET／Vue 細節集中在 `CODE-RULES-*`）。近版新增：模型分級提醒、審查申辯通道、LESSONS 事件表 E1–E5、收尾冗餘註解掃描、SessionStart 規則提要 hook | **本課前端不用**；回公司開發時照這套，讀它的 `CLAUDE.md`，走 `/api-loop`、`/crud-loop`。內附 `.claude/settings.json` 的 hook——第一次在該資料夾啟動 Claude Code 會詢問是否信任，同意後每次開場自動重灌規則提要（防長對話規則衰減） |

## 怎麼運作

1. AI 一開對話就載入 `CLAUDE.md`（專案憲法），知道能改哪些檔、鎖哪些套件。
2. 真的要改前端程式時，才去對照 `CODE-RULES-ui-本專案.md` 的細則。
3. 顏色／間距等視覺規範，對照 `design-system-summary.md` 與 `2.4_design_system` 的 token 檔。
4. 動手複製新模組時，照 `使用說明-複製範本開發新模組.md` 的流程走。

## 不同 AI Agent 怎麼載入規則

不是每個 Agent 都會自動讀 `CLAUDE.md`。關鍵在於：**本課每個 step 的 `PROMPTS.md` 起手 prompt 都會明確要求「先讀以下檔案再動工」**，所以無論你用哪個 Agent，都能把四件規則載進去——**任何 Agent 都通用**。

| AI Agent | 會自動讀哪個規則檔 | 本課怎麼確保它讀到 |
|---|---|---|
| Claude Code | 自動讀專案根目錄 `CLAUDE.md` | 開箱即讀；起手 prompt 再補指名四件，雙保險 |
| Codex CLI | 自動讀專案根目錄 `AGENTS.md`（本範本已附，內容指向 `CLAUDE.md`） | 開箱即讀 `AGENTS.md` → 轉讀 `CLAUDE.md`；起手 prompt 再補 |
| Cursor／其他 IDE 內建 Agent | **不會**自動讀 `CLAUDE.md` | 靠起手 prompt 明確要求「先讀以下檔案」——本課 `PROMPTS.md` 已這樣寫 |

> 精神：規矩集中在少數幾個檔，Agent 自動載入或由起手 prompt 顯式指名載入，人不必每次口頭交代。這就是 harness 省 token、又能守規矩的關鍵。
