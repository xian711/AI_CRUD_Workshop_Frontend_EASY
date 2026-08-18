# 2.1 Sample App — CRUD 標準範本正本

> 這是一個可獨立跑的最小 Nuxt 3 專案：**人員管理 CRUD 範例**（列表／檢視／編輯／新增）。
> 它就是「範本正本」——複製改名即成你的新模組。

## 怎麼跑

```bash
cd sample-app
pnpm install      # 安裝依賴（順帶產生型別）
pnpm dev          # 啟動 dev server
```

開 <http://localhost:3100>（自動導向 `/template/crud`）。預設 mock 模式，記憶體種子 24 筆，離線可跑、免後端。
（接 .NET 後端的 API 模式見 `sample-app/SETUP.md`。）

## 8 個核心檔（複製改名 vs 直接共用）

決策準則：**與「這個實體長什麼樣子」有關 → 複製改名；通用機制 → 直接共用。**

| # | 檔案 | 角色 | 動作 |
|---|---|---|:---:|
| 1 | `pages/template/crud/index.vue` | 列表頁（篩選／排序／分頁／URL 同步／匯出／刪除確認） | 複製改名 |
| 2 | `pages/template/crud/[id].vue` | 明細頁（檢視／編輯／新增三合一） | 複製改名 |
| 3 | `composables/useTemplateMembers.ts` | 資料層（型別＋種子＋非同步 CRUD 單例） | 複製改名 |
| 4 | `components/template/TemplateFormField.vue` | 欄位元件（label＋紅星＋錯誤紅字） | 複製改名 |
| 5 | `components/template/TemplateStatusBadge.vue` | 狀態 badge（狀態列舉是實體特有） | 複製改名 |
| 6 | `composables/useTemplateListPage.ts` | 列表狀態工廠（篩選＋分頁＋URL 同步，吃泛型） | 直接共用 |
| 7 | `utils/templateValidation.ts` | 純函式驗證引擎（與實體無關） | 直接共用 |
| 8 | `utils/templateCsv.ts` | 純函式 CSV 匯出（與實體無關） | 直接共用 |

> 補充共用檔：`composables/useTableSort.ts`（排序）、`utils/taiwanAddress.ts`（縣市鄉鎮）、所有 `components/App*.vue`（Pagination／ConfirmModal／SortHeader／TableFooter／SafeTeleport／AddressPicker…）皆直接共用，不複製。
> 兩個 `Template*` 元件內容其實通用，仍刻意複製隔離命名空間——代價是多兩個小檔（各 < 45 行），換來「A 模組改壞不連累 B 模組」。

## 進階閱讀（都在同資料夾，想查才翻，不必逐字讀）

| 文件 | 是什麼 | 什麼時候查 |
|---|---|---|
| `SPEC-範例-人員CRUD.md` | **需求規格**：目的與定位、示範實體、Use Cases、功能需求 FR-T／業務規則 BR-T／非功能需求 NFR-T、範圍外、驗收清單（已併入原本獨立的 SRS，規格只需看這一份） | 想知道「為什麼這樣設計」、「驗收標準是什麼」 |
| `SDD-CRUD標準範本-v1.1.md` | **設計文件**：檔案結構與行數預算、資料層／列表工廠／驗證引擎／CSV 的實作規格、Clean Code 對照表 | 想知道「這個檔為什麼這樣寫」 |
| `DIAGRAMS.html` | **7 張 UML 圖**（循序／狀態／ER…） | 想快速看架構全貌——用**瀏覽器打開** |

> harness 四件（`CLAUDE.md`、`CODE-RULES-ui-本專案.md`、`design-system-summary.md`、`使用說明-複製範本開發新模組.md`）就在 `sample-app/` 專案根目錄，複製範本時一起帶著走；它們是什麼、怎麼運作見 `../2.2_harness/README.md`。

> 種子資料為虛構測試資料（24 筆），非真實個資。改接後端只需把 `useTemplateMembers.ts` 內部實作換成 `useFetch`，頁面一行都不用動。
