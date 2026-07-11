# TASKS — 中心裝備物資開發任務清單

> 教材用途：讓學員看到「AI 照 harness＋任務清單開發」的實際軌跡。一行一任務，附完成勾記與一句話結果。

| # | 任務 | 狀態 | 結果 |
|---|------|:---:|------|
| T1 | 讀 harness 文件（CLAUDE.md／CODE-RULES／複製範本使用說明／PRD／SCOPE） | ✅ | 確認六條鐵律與複製 vs 共用心法，以 SCOPE 為實作規格 |
| T2 | 讀範本既有六檔（index／[id]／composable／兩元件／三共用檔） | ✅ | 掌握列表工廠、排序、驗證引擎、CSV、Teleport 時序等接縫 |
| T3 | `pnpm install`（既有 lockfile，不加減套件） | ✅ | exit 0，未動任何相依版本 |
| T4 | 建資料層 `composables/useEquipmentItems.ts` | ✅ | 12 欄型別＋10 分類/項目查表＋ITEM_CODE_MAP＋24 筆種子＋async CRUD＋編碼產生 |
| T5 | 複製兩元件 `EquipmentFormField.vue`／`EquipmentStatusBadge.vue` | ✅ | 命名空間隔離；狀態徽章綠/黃/紅查表配色 |
| T6 | 建列表頁 `pages/equipment/crud/index.vue`（345 行） | ✅ | 關鍵字＋分類＋狀態篩選、點表頭排序、分頁 20、URL 同步、CSV 匯出、刪除確認 |
| T7 | 建明細頁 `pages/equipment/crud/[id].vue`（424 行） | ✅ | 三態頁、分類→項目連動、編碼即時預覽、欄位級驗證（含電話/數量/採購日）、聚焦錯誤欄 |
| T8 | 導覽入口：`layouts/template.vue` navLinks 加「裝備物資」 | ✅ | 範本人員 CRUD 兩項不動，僅新增一項 |
| T9 | 驗證：`pnpm build` 0 error → dev 煙霧測試兩路由 → 關 dev server | ✅ | build 0 error；/equipment/crud 與 /template/crud 皆 HTTP 200；標題已編入 bundle；關掉自起的 PID 37980 |

## 過程決策與踩坑（一行一條，進教材）

| # | 事項 | 處置 |
|---|------|------|
| C1 | 分類切換 watch 會在「載入既有品項」時把已載入的項目名誤清（Object.assign 後 watch 才觸發） | 改為「現值是否屬新分類」判斷（時序無關），載入值因本就屬該分類而不被清 |
| C2 | 保管人電話「手機或市話」規則，共用 `templateValidation.ts` 不可改 | 於明細頁定義本地 `KEEPER_PHONE_PATTERN`，透過 `rulesFor` 帶入引擎 |
| C3 | 數量 ≥0、採購日期不晚於今天：非引擎的 required/pattern/maxLength 可表達 | 於引擎外 `save()` 內另行檢查後併入 errors，維持引擎無狀態 |
| C4 | 分類／狀態篩選要顯示中文，但列表工廠僅吃純字串 filter | 下拉以中文 label 當哨兵值，過濾時比對 `categoryLabelOf`／`statusLabelOf` |
| C5 | 分類/數量排序若用預設字串比較會錯（筆劃序、字典序） | useTableSort 給 `accessors`：分類→定義順序、數量→數值 |
| C6 | id 型別：PRD 用 number，範本用字串前綴 | 沿用範本 `E-001` 字串前綴（低風險、與 getById 字串比對一致），記為 D1 待與後端對齊 |
| C7 | 後端接軌：範本原檔含雙模式 $fetch 機制 | 本模組依「使用說明 §4」採精簡 mock＋`[SD 待定]` 接縫註解（前端課離線可跑），不捏造 API contract |
| C8 | SPA（ssr:false）的靜態 HTML 不含 client 端標題 | 煙霧測試改驗「兩路由 200＋標題字串已編入 client bundle＋路由已註冊」 |

## 紀律確認

- 未動 `06_tests`／未升任何套件／未重構範本既有程式；共用三檔零改動。
- CODE-RULES 自檢：零硬編碼 hex／px（走 token 別名）、零 `console.log`、行數達標（列表 345≤420、明細 424≤550）、AppSafeTeleport 保留 hard-load 安全、「全部」哨兵非空字串、UI 全繁中。
