# AI CRUD 工作坊 — Frontend EASY 版

> 一句話：**範本給骨架、harness 給規矩、AI 出勞力**——用「CRUD 標準範本＋AI harness」長出一個新模組。
>
> **harness 是什麼？** 就是你交給 AI 的一套規矩：專案規則＋設計系統＋標準範本。
> 把它想成滷茶葉蛋的滷包——你不必知道裡面有幾味藥材，但你要知道**它放在哪、換鍋子時要不要一起帶走**。
> 本課不要求你會寫 harness，只要求你會用。

## 怎麼開始（三步）

1. 把教材整包抓下來：

   ```
   git clone https://github.com/xian711/AI_CRUD_Workshop_Frontend_EASY.git
   ```

2. 跑前置檢查：進 `step0_course_intro`，Windows 跑 `.\preflight.ps1`，macOS／Linux 跑 `bash preflight.sh`。
3. 全數 PASS 後，用瀏覽器打開 **`HANDBOOK/HANDBOOK.html`**——整堂課只看這一份，從 step0 走到 step5。

## 資料夾一覽

| 資料夾 | 是什麼 |
|--------|--------|
| `HANDBOOK/` | **學員唯一要讀的手冊**（HTML，含 16 張實拍截圖與所有可複製的 prompt）。**請用瀏覽器打開**——它是為瀏覽器排版的，在終端機直接讀原始碼會很痛苦 |
| `step0`～`step4` 各資料夾 | 上課的工作材料（前置檢查、A/B demo、範本、PRD、E2E 腳本）——HANDBOOK 會指示何時用哪個。step5 是課程總結，沒有工作材料，全在 HANDBOOK 裡 |
| `step6_survey/` | **課後驗收題**：一個人做一個課程回饋問卷並發布上線。題目、PRD、起手 prompt、發布步驟都在它的 `README.md`；`solution/` 是參考解，卡住再開 |

教材由 Claude（Fable 5）多代理協作產出、Codex（GPT-5.6）對抗審查、E2E 實跑驗證全綠後發佈。
