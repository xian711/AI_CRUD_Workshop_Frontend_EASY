# Step 3｜複製範本開發新模組

> **這一步你不寫程式，你當的是「提需求、做決策、驗成果」的人。**

用前兩步玩過的範本＋harness，長出一個全新模組：**中心裝備物資**。
你要做的只有三件事：**準備工作區（3.0）→ 貼 prompt 拍板三個決策點（3.1）→ 打開瀏覽器驗收（3.2）**。寫程式的粗活是 AI 的事。

---

## 3.0 準備工作區

把範本複製成你自己的工作專案，並確認 AI Agent 的工作目錄就是專案根目錄。

**Windows（PowerShell）**

```powershell
# 在工作坊根目錄執行
Copy-Item -Recurse step2_speedrun_kit\2.5_sample_app\sample-app step3_new_module\my-equipment-app
Copy-Item step3_new_module\PRD-中心裝備物資.md step3_new_module\my-equipment-app\
cd step3_new_module\my-equipment-app
pnpm install
# 在「這個資料夾」開 AI Agent
```

**macOS／Linux（終端機）**

```bash
# 在工作坊根目錄執行
cp -R step2_speedrun_kit/2.5_sample_app/sample-app step3_new_module/my-equipment-app
cp step3_new_module/PRD-中心裝備物資.md step3_new_module/my-equipment-app/
cd step3_new_module/my-equipment-app
pnpm install
# 在「這個資料夾」開 AI Agent
```

> `sample-app` 根目錄自帶 harness 四件（`CLAUDE.md`、`CODE-RULES-ui-本專案.md`、`design-system-summary.md`、`使用說明-複製範本開發新模組.md`）。複製走範本，harness 就跟著走。
> 複製前可先刪來源的 `node_modules` 會快很多，複製完再 `pnpm install`。

---

## 3.1 貼 prompt，拍板三個決策點

先花 5 分鐘讀 [`PRD-中心裝備物資.md`](PRD-中心裝備物資.md)——它已經是濃縮好的課堂版（12 欄），
但**刻意留了三個決策點**（刪除補不補、匯出做不做、編碼規則簡不簡化），拍板的人是你，不是 AI。

然後貼 [`PROMPTS.md`](PROMPTS.md) 的【起手 prompt】（用 Agent 模式，AI 要能自己讀檔改檔）。流程一句話：

**貼 prompt → AI 用選擇題問你三題 → 你拍板 → AI 列任務清單 → 你說「開工」→ AI 逐項做完並回報。**

三題的參考裁決（講師版 [`SCOPE-課堂範圍決策.md`](../instructor/SCOPE-課堂範圍決策.md) 於你拍板後發放，先別偷看）：

| # | AI 會問 | 課堂拍板 |
|---|---|---|
| D1 | 原系統沒有刪除功能，補嗎？ | **補硬刪除＋確認彈窗**（CRUD 要有 D；範本有現成 AppConfirmModal） |
| D2 | 匯出是 TODO，做不做？ | **做 CSV 匯出**（範本現成工具，成本趨近零） |
| D3 | 編碼規則？ | **簡化版** `{類別2碼}-{項目3碼}-{流水3碼}`（不含機關前綴、不做同碼累加） |

> **兩個提醒**：①如果 AI 沒問就直接寫程式，貼 PROMPTS.md 的【救援 prompt】打斷它。
> ②別把「AI 有先問選擇題」當成 harness 的效果——那是 prompt 指令；harness 的效果在**程式碼品質**（色碼走 token、命名一致、驗證到位），對比 step1 的 A/B 才看得到。

---

## 3.2 驗收與修正

AI 做完後，開 <http://localhost:3100/equipment/crud> 逐項對照：

| 驗收點 | 期望 |
|---|---|
| 列表 | 桌機表格、每頁 20 筆、「分類→項目」升冪、顯示總筆數 |
| 連動下拉 | 先選分類，項目才可選，只出現該分類的項目 |
| 關鍵字搜尋 | 打品名或編碼片段能過濾（不分大小寫） |
| 新增 | 選定分類＋項目後標題即時顯示編碼；必填未填會紅字＋聚焦＋toast |
| 編輯 | 預帶原值，儲存生效、取消不變 |
| 刪除 | 垃圾桶 → 二次確認彈窗 → 才刪 |
| 狀態標籤 | 正常＝綠、維修中＝黃、已報廢＝紅 |
| CSV 匯出 | 全量（非當頁）、含 BOM 中文不亂碼 |

**修正心法三條**：①一次只修一個問題；②描述「看到什麼 vs 期望什麼」（「我看到 2026/7/1，期望 2026-07-01」）；③兩次修不好就換個說法重新描述。現成句型見 [`PROMPTS.md`](PROMPTS.md)。

---

## 產出物：程式碼 8 檔對照（本步驟的核心心法）

| 範本檔 | 新模組檔 | 處置 |
|---|---|---|
| `pages/template/crud/index.vue` | `pages/equipment/crud/index.vue` | 複製改名 |
| `pages/template/crud/[id].vue` | `pages/equipment/crud/[id].vue` | 複製改名 |
| `composables/useTemplateMembers.ts` | `composables/useEquipmentItems.ts` | 複製改名 |
| `components/template/TemplateFormField.vue` | `components/equipment/EquipmentFormField.vue` | 複製改名 |
| `components/template/TemplateStatusBadge.vue` | `components/equipment/EquipmentStatusBadge.vue` | 複製改名 |
| `composables/useTemplateListPage.ts` | —（直接共用） | 不動 |
| `utils/templateValidation.ts` | —（直接共用） | 不動 |
| `utils/templateCsv.ts` | —（直接共用） | 不動 |

**判斷準則：跟實體長相有關的→複製改名；通用機制→直接共用。**

另外 AI 會交出 SRS／SDD（對照你的拍板有沒有漏）和 24 筆 mock 種子（**欄位名就是未來接後端的介面**，驗收時順手看命名合不合理）。參考解的文件在 [`docs/`](docs/)。

---

## 卡住怎麼辦？

`solution-app/` 是參考解。**先自己做，真的卡兩次以上再看**——直接抄答案學不到「怎麼提需求、怎麼驗收」。

## 截圖參考

![裝備物資列表頁](../HANDBOOK/images/step3_equipment_list.png)

![AI 提出的釐清選擇題](../HANDBOOK/images/step3_clarify.png)

![刪除二次確認彈窗](../HANDBOOK/images/step3_delete_confirm.png)
