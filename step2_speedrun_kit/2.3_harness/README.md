# 2.3 Harness — AI 的規矩三件套

> harness 就是「給 AI 的規矩」。範本給骨架、AI 出勞力，harness 負責讓 AI 出的勞力守規矩。
> 這三件套湊齊，AI 每次改碼都會自動對照，不會亂換套件、不會硬編碼顏色、不會發明元件。

## 三件套一覽

| 檔案 | 是什麼 | 什麼時候用 | 給誰看 |
|---|---|---|---|
| `CLAUDE.md` | 專案憲法：這個 sample-app 的鐵律精華（技術棧鎖定、檔案地圖、程式規則精華、開發流程） | AI 每次對話**自動讀**，不用你貼 | AI 主讀；人也該掃一遍知道底線 |
| `CODE-RULES-ui-本專案.md` | 前端程式規則細則：逐項規範（樣式／驗證／URL 同步／CSV／行數預算…）＋範本檔案對照表 | AI 改前端碼前對照；`CLAUDE.md` 講不完的細節在這 | AI 改碼時查；人做 code review 時對照 |
| `aspnet-api-ai-harness-v5/` | 後端 API 的完整 harness 參考包（SDD loop、鐵律、驗證分級、各 command） | **本課前端不用**；回公司做 .NET 後端時照這套 | 後端工程師與 AI |

## 怎麼運作

1. AI 一開對話就自動讀 `CLAUDE.md`（專案憲法），知道能改哪些檔、鎖哪些套件。
2. 真的要改前端程式時，才去對照 `CODE-RULES-ui-本專案.md` 的細則。
3. 顏色／間距等視覺規範，指向 `2.4_design_system` 的 design-system-summary 與 token 檔。
4. 做後端時換一套：讀 `aspnet-api-ai-harness-v5/CLAUDE.md`，走它的 `/api-loop`、`/crud-loop`。

> 精神：規矩集中在少數幾個檔，AI 自動載入，人不必每次口頭交代。這就是 harness 省 token、又能守規矩的關鍵。
