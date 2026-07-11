# 課堂範圍決策 — 中心裝備物資（簡化版）

> **講師版答案**：學員完成六題釐清並說出理由後才發放；勿放進學員工作區。

> 真實需求見 [PRD-中心裝備物資.md](../step3_new_module/PRD-中心裝備物資.md)（26 個欄位＋借用歸還＋維保提醒）。
> 2 小時工作坊做不完全部，所以要「先釐清、再動工」——這正是 step3.2 教的第一件事。
> 本文件＝釐清選擇題的**參考答案**，也是 solution-app 實作的依據。

## 為什麼要先釐清？

PRD 是從真實程式碼逆向整理的，它忠實記錄了現況——包含「品項沒有刪除功能」這種缺口。
直接叫 AI「照 PRD 做」會得到一個做不完、也不適合教學的東西。
**先問對問題，範圍才會小而完整。**

## 釐清選擇題與裁決（六題）

| # | 問題 | 選項 | 裁決 | 理由 |
|---|------|------|------|------|
| Q1 | 欄位做多少？ | (a) 全部 26 欄 (b) 核心 12 欄 (c) 只做 5 欄 | **(b) 核心 12 欄** | (a) 做不完；(c) 學不到連動下拉與日期欄位 |
| Q2 | PRD 裡品項沒有刪除功能，怎麼辦？ | (a) 照 PRD 不做 (b) 補上硬刪除＋確認彈窗 (c) 軟刪除（狀態改報廢） | **(b) 硬刪除＋確認彈窗** | CRUD 教學要有 D；範本現成 AppConfirmModal 直接用。正式環境建議 (c)，已記入 SDD 待辦 |
| Q3 | 借用／歸還、維保提醒、照片、匯入 Excel？ | (a) 全做 (b) 全部範圍外 | **(b) 全部範圍外** | 都不是 CRUD 骨架，屬第二階段 |
| Q4 | 匯出功能？ | (a) 不做 (b) CSV 匯出 (c) Excel 匯出 | **(b) CSV 匯出** | 範本現成 `templateCsv` 工具，成本趨近零；PRD 的 Excel 匯出本來就是 TODO 空實作 |
| Q5 | 品項編碼規則？ | (a) 照 PRD 全套（含機關前綴、同碼累加數量） (b) 簡化為「類別碼-項目碼-流水號」，重複允許多筆 | **(b) 簡化版** | 累加數量是特殊業務行為，會讓「新增」語意變複雜 |
| Q6 | 存放地點？ | (a) 常用地點＋四段級聯地址 (b) 單一文字欄位 | **(b) 單一文字欄位** | 級聯地址是範本進階題，課堂先求完整走完 CRUD |

## 課堂版欄位規格（12 欄）

| 中文 label | 程式欄位名 | 型別 | 必填 | 元件 | 驗證／規則 |
|-----------|-----------|------|:---:|------|-----------|
| 分類 | `categoryKey` | string | ✔ | 下拉 | 10 大分類（沿用 PRD 3.3 節） |
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
| 分類篩選 | 下拉單選（含「全部」） | 同上 |
| 狀態篩選 | 下拉單選（含「全部」） | 同上 |
| 排序 | 點表頭切換升降冪，預設「分類→項目」升冪 | `useTableSort`＋`AppSortHeader` |
| 分頁 | 每頁 10/20/50，預設 20 | `AppPagination`＋`AppTableFooter` |
| 網址同步 | 篩選、頁碼寫進 URL，重新整理不丟 | `useTemplateListPage` |
| CSV 匯出 | 匯出全量（非當頁），含 BOM | `templateCsv` |
| 刪除確認 | 彈窗二次確認 | `AppConfirmModal` |
| 狀態標籤 | 正常=綠、維修中=黃、已報廢=紅 | 仿 `TemplateStatusBadge` 複製改名 |

## Mock 資料

- 24 筆種子資料（與範本人員 CRUD 同量級），涵蓋全部 10 個分類、三種狀態都要出現。
- 品名與分類取材自 PRD 3.3 節的真實項目清單（發電機、避難帳篷、急救箱……）。
- 之後接後端時，這份 mock 的欄位就是與 API 介接的 interface（欄位名不再改）。

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
