# SDD — 中心裝備物資（課堂版 v1.0）

> 設計規格。實作方式＝複製 CRUD 標準範本八檔中的五檔改名，三個通用檔直接共用。

## 1. 檔案清單

### 新增五檔（複製範本改名）

| 新檔 | 複製來源 | 說明 |
|------|---------|------|
| `pages/equipment/crud/index.vue` | `pages/template/crud/index.vue` | 列表頁：篩選＋排序＋分頁＋URL 同步＋匯出＋刪除確認 |
| `pages/equipment/crud/[id].vue` | `pages/template/crud/[id].vue` | 明細頁：檢視／編輯／新增三合一＋欄位級驗證＋編碼預覽 |
| `composables/useEquipmentItems.ts` | `composables/useTemplateMembers.ts` | 資料層：型別＋分類/項目查表＋24 筆種子＋async CRUD＋編碼產生 |
| `components/equipment/EquipmentFormField.vue` | `TemplateFormField.vue` | 表單欄位容器（label＋必填星號＋錯誤紅字＋聚焦錨點） |
| `components/equipment/EquipmentStatusBadge.vue` | `TemplateStatusBadge.vue` | 狀態徽章（查表配色） |

### 直接共用（不複製、不改）

`composables/useTemplateListPage.ts`、`composables/useTableSort.ts`、`utils/templateValidation.ts`、`utils/templateCsv.ts`、所有 `components/App*.vue`。

### 既有檔異動一處

| 檔 | 異動 |
|----|------|
| `layouts/template.vue` | `navLinks` 新增「裝備物資 → /equipment/crud」入口一項（範本人員 CRUD 兩項不動） |

## 2. 資料模型

```ts
export type EquipmentStatus = 'normal' | 'maintenance' | 'scrapped'

export interface EquipmentItem {
  id: string            // 'E-001'（系統流水）
  code: string          // 'IT-LAP-001'（系統依分類+項目產生）
  categoryKey: string   // 分類 value（見 EQUIPMENT_CATEGORIES）
  name: string          // 項目
  qty: number
  unit: string
  spec1: string         // 規格說明
  keeper: string
  keeperPhone: string
  locationName: string  // 存放地點（單一文字欄）
  status: EquipmentStatus
  purchaseDate: string  // YYYY-MM-DD，可空
  specNote: string      // 備註
}

export type EquipmentItemInput = Omit<EquipmentItem, 'id' | 'code'>
```

查表：`EQUIPMENT_CATEGORIES`（value／code／label／items）、`ITEM_CODE_MAP`（項目名→3 碼）、`EQUIPMENT_STATUS_META`（狀態→中文）。

## 3. 品項編碼產生演算法（BR-EQ-01）

```
輸入：categoryKey、name
1. cat2  = EQUIPMENT_CATEGORIES 內該 value 的 code（查無→'OT'）
2. item3 = ITEM_CODE_MAP[name]（查無或「其他」分類→'OTH'）
3. prefix = `${cat2}-${item3}-`
4. maxSeq = store 內 code 以 prefix 開頭者，取尾 3 碼數字最大值（無則 0）
5. code   = prefix + zeroPad(maxSeq + 1, 3)
```

- 頁面即時預覽：`codePreview` 為 computed，讀 store 反應性；分類或項目為空回空字串。
- 編輯時：分類＋項目未變則保留原 `code`；變更則於新前綴取下一流水（避免重複佔號）。
- 課堂簡化：允許同分類＋項目建立多筆，每筆流水號遞增、編碼仍唯一，不做同碼累加數量。

## 4. 關鍵設計決策

| # | 決策 | 理由 |
|---|------|------|
| D1 | **mock 欄位＝未來 API interface**：`EquipmentItem` 12 欄一次定稿，接後端時欄位名不再改 | 針對介面而非實作寫程式；`useEquipmentItems` 內每個 CRUD 旁留 `// 後端接軌：… [SD 待定]` 接縫，改 `useFetch` 即可，頁面零改動 |
| D2 | 分類／狀態排序用 accessor 取「定義順序／數值」，非中文 `localeCompare` | 分類要照 `EQUIPMENT_CATEGORIES` 語意順序、數量要照數值大小 |
| D3 | 分類→項目連動；「其他」分類切文字輸入 | 標準項目走下拉可控；其他類無標準品名，需自由輸入。切換分類時以「現值是否屬新分類」判斷是否清空（時序無關，不會誤清載入值） |
| D4 | 保管人電話用頁面層本地 `KEEPER_PHONE_PATTERN`，不改共用驗證引擎 | 引擎保持無狀態純函式；手機／市話規則屬本實體特有，於 `rulesFor` 帶入 |
| D5 | 數量（≥0）與採購日期（不晚於今天）於引擎外另行檢查 | 兩者非「required／pattern／maxLength」可表達，且不得改共用 `templateValidation.ts` |

## 5. 待辦（正式環境）

- 後端 API contract 由 SD 定案後，把 `useEquipmentItems` 內部 mock 換 `useFetch`（端點 `/api/equipment/items`）。
- 刪除改軟刪除（狀態報廢）之取捨（SCOPE D1 正式環境建議）。
- 機關前綴、權限（`useAuth`）。
