# 課堂範圍決策 — 中心裝備物資（講師版答案）

> 學員完成三題拍板並說出理由後才發放；勿放進學員工作區。
> 課堂版 PRD 見 [PRD-中心裝備物資.md](../step3_new_module/PRD-中心裝備物資.md)（已濃縮為 12 欄，留三個決策點）。
> 本文件＝三題的**參考答案**＋solution-app 的實作規格。

## 三個決策點與裁決

| # | 問題 | 選項 | 裁決 | 理由 |
|---|------|------|------|------|
| D1 | 原系統品項沒有刪除功能，補嗎？ | (a) 照原系統不做 (b) 補硬刪除＋確認彈窗 (c) 軟刪除（狀態改報廢） | **(b) 硬刪除＋確認彈窗** | CRUD 教學要有 D；範本現成 AppConfirmModal 直接用。正式環境建議 (c)，已記入 SDD 待辦 |
| D2 | 匯出在原系統是 TODO 空實作，做不做？ | (a) 不做 (b) CSV 匯出 (c) Excel 匯出 | **(b) CSV 匯出** | 範本現成 `templateCsv` 工具，成本趨近零 |
| D3 | 品項編碼規則？ | (a) 照原系統全套（機關前綴＋同碼累加數量） (b) 簡化為「類別-項目-流水」，允許多筆 | **(b) 簡化版** | 累加數量是特殊業務行為，會讓「新增」語意變複雜 |

> 教學重點不是答案本身，而是**每一題都是在「真實系統」和「兩小時課堂」之間做取捨，做取捨的人是學員，不是 AI**。

## 課堂版欄位規格（12 欄）

| 中文 label | 程式欄位名 | 型別 | 必填 | 元件 | 驗證／規則 |
|-----------|-----------|------|:---:|------|-----------|
| 分類 | `categoryKey` | string | ✔ | 下拉 | 10 大分類（PRD 第 3 節） |
| 項目 | `name` | string | ✔ | 下拉（依分類連動） | 先選分類才可選；「其他」分類改文字輸入 |
| 品項編碼 | `code` | string | 系統 | 唯讀 | `{類別2碼}-{項目3碼}-{流水3碼}`，如 `IT-LAP-001` |
| 數量 | `qty` | number | ✔ | 數字輸入 | ≥ 0 |
| 單位 | `unit` | string | ✔ | 文字 | 不可空白，如：台、件 |
| 規格說明 | `spec1` | string | ✔ | 多行文字 | 不可空白 |
| 保管人 | `keeper` | string | ✕ | 文字 | — |
| 保管人電話 | `keeperPhone` | string | ✕ | 文字 | 有填才驗：台灣手機/市話格式 |
| 存放地點 | `locationName` | string | ✕ | 文字 | — |
| 狀態 | `status` | enum | ✔ | 下拉 | 正常／維修中／已報廢，預設「正常」 |
| 採購日期 | `purchaseDate` | date | ✕ | 日期 | 不可晚於今天 |
| 備註 | `specNote` | string | ✕ | 多行文字 | — |

## 列表功能（全部沿用範本現成機制）

| 功能 | 規格 | 靠範本哪個零件 |
|------|------|--------------|
| 關鍵字搜尋 | 比對「項目名稱＋編碼」，不分大小寫 | `useTemplateListPage` 的 filter 模式 |
| 分類／狀態篩選 | 下拉單選（含「全部」） | 同上 |
| 排序 | 點表頭切換升降冪，預設「分類→項目」升冪 | `useTableSort`＋`AppSortHeader` |
| 分頁 | 每頁 10/20/50，預設 20 | `AppPagination`＋`AppTableFooter` |
| 網址同步 | 篩選、頁碼寫進 URL，重新整理不丟 | `useTemplateListPage` |
| CSV 匯出 | 匯出全量（非當頁），含 BOM | `templateCsv` |
| 刪除確認 | 彈窗二次確認 | `AppConfirmModal` |
| 狀態標籤 | 正常=綠、維修中=黃、已報廢=紅 | 仿 `TemplateStatusBadge` 複製改名 |

## Mock 資料

- 24 筆種子，涵蓋全部 10 分類、三種狀態都出現；品名取自 PRD 第 3 節真實項目清單。
- 接後端時，mock 欄位名就是 API 介面（不再改名）。

## 改名對照（複製範本八檔心法）

| 範本檔 | 新模組檔 | 處置 |
|--------|---------|------|
| `pages/template/crud/index.vue` | `pages/equipment/crud/index.vue` | 複製改名 |
| `pages/template/crud/[id].vue` | `pages/equipment/crud/[id].vue` | 複製改名 |
| `composables/useTemplateMembers.ts` | `composables/useEquipmentItems.ts` | 複製改名 |
| `components/template/TemplateFormField.vue` | `components/equipment/EquipmentFormField.vue` | 複製改名 |
| `components/template/TemplateStatusBadge.vue` | `components/equipment/EquipmentStatusBadge.vue` | 複製改名 |
| `composables/useTemplateListPage.ts` | —（直接共用） | 不動 |
| `utils/templateValidation.ts` | —（直接共用） | 不動 |
| `utils/templateCsv.ts` | —（直接共用） | 不動 |

**判斷準則**：跟實體長相有關的→複製改名；通用機制→直接共用。

## 範圍外（本課不做）

後端串接（mock 即 interface）、權限、借用／歸還、維保效期提醒、照片與手冊上傳、匯入 Excel、常用地點管理、級聯地址、同編碼累加數量。
