# 2.2 Harness — 給 AI 的規矩

> harness 就是「給 AI 的規矩」。範本給骨架、AI 出勞力，harness 負責讓 AI 出的勞力守規矩。
> 這四件湊齊，AI 每次改碼都會自動對照，不會亂換套件、不會硬編碼顏色、不會發明元件。

## 前端 harness 四件（實檔在範本專案裡）

**這四份的實檔都在 `../2.1_sample_app/sample-app/` 專案根目錄**，複製範本開新模組時會一起帶著走。
本資料夾刻意**不放副本**——同名兩份會讓你改到不生效的那一個；要修規矩，直接改下表的實檔。

| 實檔（在 `2.1_sample_app/sample-app/`） | 是什麼 | 什麼時候用 | 給誰看 |
|---|---|---|---|
| `CLAUDE.md` | 專案憲法：這個 sample-app 的鐵律精華（技術棧鎖定、檔案地圖、程式規則精華、開發流程） | AI 每次對話**自動讀**（見下方相容表），不用你貼 | AI 主讀；人也該掃一遍知道底線 |
| `CODE-RULES-ui-本專案.md` | 前端程式規則細則：逐項規範（樣式／驗證／URL 同步／CSV／行數預算…）＋範本檔案對照表 | AI 改前端碼前對照；`CLAUDE.md` 講不完的細節在這 | AI 改碼時查；人做 code review 時對照 |
| `design-system-summary.md` | Design System 摘要：token 三層（COMP→SYS→REF）、顏色／間距別名一覽 | 要動視覺（顏色、間距、元件樣式）時對照，一律走 token | AI 改樣式時查；人審視覺一致性 |
| `使用說明-複製範本開發新模組.md` | 操作手冊：怎麼把範本複製成一個新 CRUD 模組（哪些複製、哪些共用、檢查點） | 開新模組動手前先讀一遍 | 人主讀；AI 也可依此走流程 |

## 樣板 ↔ 本專案：同一套東西的兩個狀態

課後附錄的參考包（`aspnet-api-ai-harness-v5/`）是**空白樣板**——`SPEC.md` 是空的、`design-system-summary.md` 整頁 `TODO`、`CODE-RULES-ui.md` 填的是別的專案（Vite/Pinia/axios）的預設值。
範本專案裡那幾份則是**同一份文件填好之後的樣子**。兩邊**互相對應，但刻意不相同**——這正是 harness 的用法：**樣板給你欄位，你填成自己專案的規矩**。

| harness 樣板（`aspnet-api-ai-harness-v5/`） | 本專案填好的版本 | 關係 |
|---|---|---|
| `CLAUDE.md`（六條鐵律＋路由表） | `../2.1_sample_app/sample-app/CLAUDE.md` | 填好：換成這個專案的技術棧、檔案地圖、鐵律 |
| `harness/CODE-RULES-ui.md`（預設 **Vite + Pinia + axios**） | `../2.1_sample_app/sample-app/CODE-RULES-ui-本專案.md`（**Nuxt 3 + Nuxt UI + composables**） | **取代**：技術棧不同，本專案這份整份覆蓋樣板預設 |
| `modules/crud-ui/design-system-summary.md`（token 前綴全是 `TODO`） | `../2.1_sample_app/sample-app/design-system-summary.md` | 填好：換成真的 `--ui-ref-*`／`--ui-sys-*`／`--ui-comp-*` 三層 |
| `modules/crud-ui/design-token-rules.md`（檢查碼 R001–R004） | `../2.3_design_system/tokens/*.css`（token 實檔）＋ 上面 summary 的檢查段 | 規則 → 實檔 |
| `modules/crud-ui/CRUD-UI.md`（表單／表格慣例） | `../2.1_sample_app/sample-app/pages/template/crud/` | 慣例 → 實際寫出來的程式 |
| `harness/SPEC.md`（空白規格樣板） | `../2.1_sample_app/SPEC-範例-人員CRUD.md` | 填好：教學用「填好的考卷」 |
| `harness/TASKS.md`（`Feature: TODO`） | `../../step3_new_module/docs/TASKS.md`（參考解） | 填好：step3 由 AI 依 SPEC 展開 |
| `harness/LOOP.md`＋`modules/verify/VERIFY.md`（迴圈與驗證分級） | `../../step4_loop_e2e/`（7 條 E2E 紅綠燈） | 抽象規則 → 本課可執行的驗證 |

> **為什麼不做成完全一樣？** 因為樣板要能給任何專案用，本專案版要能立刻生效。
> 硬把樣板的 Vite/Pinia/axios 規則套進 Nuxt 範本，AI 會照著寫出跑不起來的程式。
> 你回公司要做的，就是拿左欄的空白樣板，照右欄的方式填成你們自己的那一份。

> 參考包是**從上游同步進來的完整副本**，教材不改它的內容——要改規矩請改右欄（範本專案根目錄）那幾份。

## 課後附錄：後端 harness 參考包

| 資料夾 | 是什麼 | 什麼時候用 |
|---|---|---|
| `aspnet-api-ai-harness-v5/` | 完整 harness 參考包 **v5.16**（SDD loop、鐵律、驗證分級、各 command；核心規則不綁技術棧，.NET／Vue 細節集中在 `CODE-RULES-*`）。近版新增：模型分級提醒、審查申辯通道、LESSONS 事件表 E1–E5、收尾冗餘註解掃描、SessionStart 規則提要 hook、續作紀律 | **本課前端不用**；回公司開發時照這套，讀它的 `CLAUDE.md`，走 `/api-loop`、`/crud-loop`。內附 `.claude/settings.json` 的 hook——第一次在該資料夾啟動 Claude Code 會詢問是否信任，同意後每次開場自動重灌規則提要（防長對話規則衰減） |

## 怎麼運作

1. AI 一開對話就載入 `CLAUDE.md`（專案憲法），知道能改哪些檔、鎖哪些套件。
2. 真的要改前端程式時，才去對照 `CODE-RULES-ui-本專案.md` 的細則。
3. 顏色／間距等視覺規範，對照 `design-system-summary.md` 與 `../2.3_design_system/` 的 token 實檔。
4. 動手複製新模組時，照 `使用說明-複製範本開發新模組.md` 的流程走。

## 不同 AI Agent 怎麼載入規則

不是每個 Agent 都會自動讀 `CLAUDE.md`。關鍵在於：**HANDBOOK 的 step3 起手 prompt 已明確要求「先依序讀完這四份文件再動作」**，所以無論你用哪個 Agent，都能把規則載進去——**任何 Agent 都通用**。

| AI Agent | 會自動讀哪個規則檔 | 本課怎麼確保它讀到 |
|---|---|---|
| Claude Code | 自動讀專案根目錄 `CLAUDE.md` | 開箱即讀；起手 prompt 再補指名四件，雙保險 |
| Codex CLI | 自動讀專案根目錄 `AGENTS.md`（本範本已附，內容指向 `CLAUDE.md`） | 開箱即讀 `AGENTS.md` → 轉讀 `CLAUDE.md`；起手 prompt 再補 |
| Cursor／其他 IDE 內建 Agent | **不會**自動讀 `CLAUDE.md` | 靠起手 prompt 明確要求「先讀以下檔案」——HANDBOOK 的 prompt 已這樣寫 |

> 精神：規矩集中在少數幾個檔，Agent 自動載入或由起手 prompt 顯式指名載入，人不必每次口頭交代。這就是 harness 省 token、又能守規矩的關鍵。
