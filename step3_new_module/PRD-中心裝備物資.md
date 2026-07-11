# PRD — 中心裝備物資（L3-06）

> 本文件由現有原始碼逆向整理，作為教育訓練「用 CRUD 標準範本＋AI harness 重新實作」的題目規格。
> 一切以原始碼實際行為為準；標示「原始碼未見」者為建議課堂決策項。
>
> 對應原始碼：
> - 列表頁 `pages/township/equipment-center/index.vue`
> - 明細／新增／編輯頁 `pages/township/equipment-center/[id].vue`
> - 資料與邏輯集中 `composables/useEquipmentItems.ts`
> - 借用對話框 `components/EquipmentLoanFormModal.vue`
> - 分頁元件 `components/AppTableFooter.vue`

---

## 1. 模組簡介

「中心裝備物資」是防災協作平台裡，供**鄉鎮公所協作中心**管理其**中心持有**的裝備與物資庫存的頁面。

| 項目 | 說明 |
|------|------|
| 使用者 | 公所協作中心的裝備物資管理人員（保管人、經辦人） |
| 用途 | 盤點與維護裝備物資清冊：品項基本資料、規格、數量、保管人、存放地點、照片與操作手冊、維護保養與效期、跨中心借用 |
| 資料範圍 | 「中心持有」品項（相對於另一個「村里裝備物資」模組；本模組品項 `villageId` 為空） |
| 資料現況 | 目前為前端 mock 單例資料（50 筆假資料），後端 API 尚未串接，程式碼內多處 `TODO` 標註待接後端 |

---

## 2. 功能需求

### 2.1 列表（Read / List）

| 功能 | 行為 |
|------|------|
| 桌機檢視 | 表格（`UTable`），欄位固定寬度、斑馬紋、選中列高亮（左側色條） |
| 手機檢視 | 卡片式列表（`md:hidden`），顯示分類 chip、品名、編碼、規格、數量、保管人、地點、維保提醒 |
| 一般查詢 | 縣市、鄉鎮區、編碼、分類、項目、規格、常用地點、樓層／位置（詳見第 4 節） |
| 進階查詢 | 可折疊面板；含結構化地址、保管人、採購日期區間、下次保養日期區間、狀態多選、快速條件勾選；有值時自動展開，按鈕顯示生效條件數徽章 |
| 排序 | 多欄位排序（`AppSortPanel`）；點表頭切換單欄升降冪；預設依「分類→項目」升冪；分類依 `CATEGORIES` 定義順序而非中文筆劃 |
| 分頁 | `AppTableFooter`，每頁筆數選項 `[10, 20, 50, 100]`，本頁預設 **20**；顯示「第 X 至 Y 項，共 N 筆」 |
| 選取列 | 點列高亮並啟用「借用品項」按鈕；再點一次取消選取 |
| 狀態／篩選還原 | 進明細頁再返回時，透過 URL query（`cat`／`loc`／`p`）還原分類、地點、頁碼 |
| 空狀態 | 無符合條件時顯示 archive-box 圖示與「無符合條件的品項」 |

### 2.2 新增（Create）

- 入口：列表頁「新增品項」按鈕 → 路由 `/township/equipment-center/new`（`mode=create`）。
- 明細頁四欄表單（品項資訊／照片＋手冊／存放地點＋保管資訊／借用資訊＋維護保養）。
- 品項編碼即時預覽：選定「分類＋項目＋規格說明一」後自動推算（見 2.6）；編碼已存在時顯示「⚠ 此編碼已存在，新增後將累加數量」。
- 儲存規則：若最終編碼與既有品項相同，**累加數量**（`qty`、`available` 皆加）而非新增一筆。
- 儲存後返回列表（帶回原篩選 query）。

### 2.3 編輯（Update）

- 入口：列表「編輯」鉛筆鈕，或明細頁「編輯品項」→ 路由 `/township/equipment-center/{id}?mode=edit`。
- 表單預帶既有資料；保管人若能對應成員名冊則自動選取。
- 「取消」回到檢視模式；「儲存變更」寫回同一筆並返回列表。

### 2.4 刪除（Delete）

- **原始碼未見**：品項本身**沒有**刪除功能（列表與明細頁皆無刪除鈕；`upsert` 僅新增／更新，無 delete）。建議課堂決策：是否納入品項刪除、以及是否需軟刪除／狀態改為「已報廢」取代實體刪除。
- 註：常用地點（子功能）有刪除，且被品項參照時擋下（見 2.7）。

### 2.5 明細檢視（Read / Detail）

- 路由 `/township/equipment-center/{id}`（預設 view 模式）。
- 四欄並排（桌機不整頁滾動）：
  - A 品項資訊：名稱、數量／單位、借出中、可借數量、規格一／二、規格備註
  - B 照片（最多 2 張，`object-contain`）＋ 操作手冊下載
  - C 保管資訊（保管人／電話／狀態）＋ 存放地點 ＋ 歷史紀錄
  - D 借用資訊（最新借出中一筆、外借警示帶、登記歸還、借用紀錄）＋ 維護保養（含到期／逾期提醒帶與欄位 chip）
- 找不到品項時顯示「找不到此品項」與回清單按鈕。

### 2.6 品項編碼自動產生（BR-EQ-04）

- 格式：`{類別2碼}-{項目3碼}-{機關前綴3碼}{流水號3碼}`，例：`IT-LAP-111001`。
- 類別碼取自 `CATEGORIES.code`，項目碼取自 `ITEM_CODE_MAP`（找不到用 `OTH`），機關前綴目前固定 `111`（士林區，`CURRENT_ORG_CODE`）。
- 規則：同機關＋同類別＋同項目＋同規格＝同一編碼；規格不同則在「類別＋項目＋機關」範圍內流水號 001~999 遞增。

### 2.7 其他特殊功能（以原始碼為準）

| 功能 | 行為 | 備註 |
|------|------|------|
| 匯出 | 「匯出」按鈕 `doExport()` | **原始碼為 TODO 空實作**（僅註解 `DEV 匯出 Excel`），課堂決策是否實作 |
| 匯入 Excel | Modal：下載 CSV 範本（含 BOM）＋ 選檔（.xlsx/.xls/.csv） | 範本下載可運作；`confirmImport()` 解析為 **TODO 空實作** |
| 借用品項 | `EquipmentLoanFormModal`；可借數量 ≤ 0 時按鈕停用；建立後扣 `available`、加 `loaned` | 借用表單欄位見第 3.2 節 |
| 登記歸還 | 明細頁「登記歸還」／借用紀錄卡逐筆歸還；回補 `available`、扣 `loaned`、狀態轉 `returned` | |
| 借用紀錄 | Modal 列出全部借用紀錄，含逾期判斷（`active` 且過 `dueDate`） | 目前僅 id=1 有 demo 資料 |
| 維護保養／效期提醒 | 依採購日＋保固／使用年限、下次保養日期推算「即將到期(soon, 30 天內)／已逾期(expired)」，列表與明細同一邏輯 `equipmentLifecycleAlerts` | 過保固不提醒 |
| 庫存警示 | 列表數量欄顯示「外借 N」；明細顯示外借中警示帶 | |
| 狀態標籤 | 正常 / 維修中 / 已報廢，對應成功／警告／錯誤配色 | |
| 保管人選擇 | 從公所成員名冊 `useTownshipRoster` 下拉選取，帶入姓名與電話；亦可自行輸入 | |
| 常用地點管理 | 明細頁「管理」進入 storage-locations 頁；地點可新增／編輯／刪除；改名改址連動更新所有參照品項；被參照時禁止刪除 | 子功能 |
| 存為常用地點 | 填新地址後一鍵存為常用地點並自動選用 | |

---

## 3. 表單欄位規格

### 3.1 裝備品項表單（新增／編輯，`[id].vue`）

必填判定來自 `canSubmit`：分類、項目、規格說明一、單位為必填，數量需 ≥ 0。其餘皆選填。

| 中文 label | 程式欄位名 | 型別 | 必填 | 元件 | 驗證／規則 | 選項／預設 |
|-----------|-----------|------|:---:|------|-----------|-----------|
| 分類 | `categoryKey` | string | ✔ | USelectMenu | 需選一 | 9 大類＋其他（見 3.3）；預設空 |
| 項目 | `itemName` / `customName` | string | ✔ | USelectMenu／UInput | 一般分類從清單選；選「其他（自行輸入）」或分類為「其他」時改用 `customName` 文字輸入 | 依分類動態；預設空 |
| 數量 | `qty` | number | ✔ | UInput(number) | `min=0`，需 ≥ 0 | 預設 0 |
| 單位 | `unit` | string | ✔ | UInput | 不可空白 | 例：台／件；預設空 |
| 規格說明一 | `spec1` | string | ✔ | UTextarea | 不可空白 | 預設空 |
| 規格說明二 | `spec2` | string | ✕ | UTextarea | — | 預設空 |
| 規格備註 | `specNote` | string | ✕ | UTextarea | — | 預設空 |
| 照片 | `photos` | string[] | ✕ | file(image) | 最多 2 張；JPG/PNG/WEBP，單張 ≤ 5MB（提示文字，未見程式強制驗證） | 預設 [] |
| 操作手冊 | `manualFile` / `manualFileName` | string | ✕ | file(PDF/image) | 接受 `application/pdf,image/*` | 預設空 |
| 常用地點 | `locationId` | string | ✕ | USelectMenu(searchable) | 選了常用地點則下方新地址欄唯讀顯示；可清除改填新地址 | 常用地點清單；預設空 |
| 地址－縣市 | `locationCounty` | string | ✕ | AppAddressPicker | 縣市→鄉鎮→路名→門牌級聯 | 預設空 |
| 地址－鄉鎮市區 | `locationTownship` | string | ✕ | AppAddressPicker | 依縣市連動 | 預設空 |
| 地址－路名 | `locationRoad` | string | ✕ | AppAddressPicker | — | 預設空 |
| 地址－門牌詳細 | `locationDetail` | string | ✕ | AppAddressPicker | 未選常用地點時，四段組成 `locationName` 儲存 | 預設空 |
| 樓層／區域 | `locationFloor` | string | ✕ | UInput | — | 例：2F、倉庫A區 |
| 存放位置描述 | `locationSpot` | string | ✕ | UInput | — | 例：靠牆第三排架 |
| 保管人 | `keeper`（＋`selectedKeeperId`） | string | ✕ | USelectMenu(成員名冊)／UInput | 從名冊選取自動帶姓名與電話；亦可自行輸入 | 名冊在職成員；預設空 |
| 保管人電話 | `keeperPhone` | string | ✕ | UInput | 選成員後自動帶入 | 預設空 |
| 狀態 | `status` | enum | ✕ | 按鈕群組 | 三選一 | `normal`／`maintenance`／`scrapped`；**預設 `normal`** |
| 採購日期 | `purchaseDate` | string(date) | ✕ | UInput(date) | YYYY-MM-DD | 預設空 |
| 製造日期 | `manufactureDate` | string(date) | ✕ | UInput(date) | YYYY-MM-DD | 預設空 |
| 保固年限 | `warrantyYears` | number\|null | ✕ | UInput(number) | `min=0`，單位「年」 | 預設 null |
| 使用年限 | `lifespanYears` | number\|null | ✕ | UInput(number) | `min=0`，單位「年」 | 預設 null |
| 定期保養週期 | `maintenanceCycle` | number\|null | ✕ | UInput(number) | 填 0 或空白＝不需保養 | 預設 null |
| 保養週期單位 | `maintenanceCycleUnit` | enum | ✕ | USelectMenu | 年／月／週 | `year`/`month`/`week`；**預設 `month`** |
| 下次保養日期 | `nextMaintenanceDate` | string(date) | ✕ | UInput(date) | 與週期共同推算保養／效期提醒 | 預設空 |
| 品項編碼 | `code` | string | 系統 | （唯讀顯示） | 依 2.6 自動推算，不可手改 | 自動 |

系統衍生欄位（非表單輸入）：`id`、`code`、`available`（新增時＝qty）、`loaned`（新增時＝0）、`category`（由 categoryKey 帶出中文）。

### 3.2 借用品項表單（`EquipmentLoanFormModal`）

| 中文 label | 程式欄位名 | 型別 | 必填 | 驗證／規則 | 預設 |
|-----------|-----------|------|:---:|-----------|------|
| 借用單位 | `unitChoice` / `unitCustom` | string | ✔ | 下拉預設清單，或選「其他」自行輸入 | 空；下拉為本縣市 12 區協作中心 |
| 借用人 | `borrower` | string | ✔ | 不可空白 | 空 |
| 聯絡電話 | `borrowerPhone` | string | ✔ | 不可空白 | 空 |
| 借用日期 | `loanDate` | string(date) | ✔ | — | 今天 |
| 預計歸還日期 | `dueDate` | string(date) | ✔ | 不得早於借用日期（`min=loanDate`） | 借用日 +7 天 |
| 借用數量 | `qty` | number | ✔ | ≥ 1 且 ≤ 可借數量 `available` | 1 |
| 經辦人 | `handler` | string | ✔ | 不可空白 | 預設登入者（demo：李承翰） |
| 借用用途／事由 | `purpose` | string | ✔ | 不可空白 | 空 |
| 備註 | `note` | string | ✕ | — | 空 |

### 3.3 分類與項目選項（`CATEGORIES` / `ITEM_CODE_MAP`）

| 分類 value | 類別碼 | 中文 label | 標準項目 |
|-----------|:---:|-----------|---------|
| ICT | IT | 資通訊設備 | 筆記型電腦、平板電腦、WIFI分享器、行動箱 |
| POWER | PW | 供電及照明設備 | 發電機、行動太陽能電板組、儲能設備(主)、儲能設備(輔)、塔燈 |
| STORAGE | ST | 儲物設備 | 貨架角鋼、溫濕度計、除濕機 |
| OFFICE | OF | 事務用品 | 遮陽棚、摺疊桌椅組、摺疊推車、移動式白板、大型垃圾桶、DC節能扇、擴音器(大聲公)、識別證與掛繩、文書用品、電源延長線、轉接頭 |
| PPE | PP | 個人防護裝備 | 哨子、反光背心、頭燈、手電筒、頭盔、口罩、手套(拋棄式)、手套(工作手套)、雨衣、防穿刺工作鞋、避難包(EDC)、行動電源(個人用) |
| SHELTER_SUPPLY | SH | 支援避難收容設施 | 避難帳篷、折疊床墊(睡墊)、保暖毯、緊急睡袋、儲水桶 |
| EMFOOD | EF | 自用緊急物資 | 即時口糧、補充型口糧、鹽糖 |
| MEDICAL | MD | 醫療及衛生用品 | 簡易廁所組、擔架床/軟式擔架、止血帶、急救箱、盥洗用具 |
| DECON | DC | 清消及過濾設備 | 加壓式免電力緊急淨水設備、重力式緊急濾水器、免電力緊急消毒劑製造設備 |
| OTHER | OT | 其他 | （無標準項目，需自行輸入品名） |

其他列舉：
- 狀態 `ITEM_STATUS_OPTIONS`：`normal`＝正常、`maintenance`＝維修中、`scrapped`＝已報廢。
- 保養週期單位：`year`＝年、`month`＝月、`week`＝週。
- 即將到期提醒門檻 `EQUIPMENT_ALERT_LEAD_DAYS` ＝ 30 天。

---

## 4. 列表欄位與篩選條件

### 4.1 表格欄位（桌機 `itemColumns`）

| 欄位 label | key | 可排序 | 說明 |
|-----------|-----|:---:|------|
| 縣市 | county | ✔ | 由存放地點推算 |
| 鄉鎮區 | township | ✔ | 由存放地點推算 |
| 分類 | category | ✔ | 彩色 chip，依定義順序排序 |
| 項目 | name | ✔ | 品名（可點進明細）＋下方編碼 |
| 規格說明一 | spec1 | ✔ | 無則退回舊 `spec` |
| 規格說明二 | spec2 | ✔ | |
| 數量 | qty | ✔ | 含單位；外借中另標「外借 N」 |
| 保管人 | keeper | ✔ | 含電話 |
| 存放地點 | location | ✔ | 地點名稱＋樓層／位置 |
| 採購日期 | purchaseDate | ✔ | 含使用年限與維保提醒 pill |
| 操作 | actions | ✕ | 編輯鉛筆鈕 |

預設排序：分類升冪 → 項目升冪。

### 4.2 一般查詢條件

| 條件 | 程式變數 | 元件 | 比對邏輯 |
|------|---------|------|---------|
| 縣市 | `filterCounty` | 下拉(searchable) | 品項地址含此縣市 |
| 鄉鎮區 | `filterTownship` | 下拉(searchable，依縣市連動) | 品項地址含此鄉鎮 |
| 編碼 | `filterCode` | 文字 | `code` 不分大小寫包含 |
| 分類 | `filterCategory` | 下拉(searchable) | `categoryKey` 相等 |
| 項目 | `filterName` | 下拉(searchable，先選分類) | `name` 相等 |
| 規格 | `filterSpec` | 文字 | spec／spec1／spec2／specNote 任一包含 |
| 常用地點 | `filterLocation` | 下拉 | `locationId` 相等 |
| 樓層／位置 | `filterLocationText` | 文字 | locationName／Floor／Spot 任一包含 |

### 4.3 進階查詢條件

| 條件 | 程式變數 | 比對邏輯 |
|------|---------|---------|
| 結構化地址（縣市／鄉鎮／路名／門牌） | `filterAddr*` | 各段皆需被品項實際地址包含 |
| 保管人 | `filterKeeper` | `keeper` 包含 |
| 採購日期區間 | `filterPurchaseFrom/To` | 民國年月選單，換算 ISO 區間比對 |
| 下次保養日期區間 | `filterNextMaintFrom/To` | 民國年月選單，區間比對 |
| 狀態（多選） | `filterStatus` | chip 多選，命中任一 |
| 超過使用年限 | `filterOverLifespan` | 採購日＋使用年限已過今日 |
| 過保固期 | `filterOverWarranty` | 採購日＋保固年限已過今日 |
| 即將到期保養（30 天內） | `filterMaintDueSoon` | 下次保養日在 0~30 天內 |
| 借出中 | `filterHasLoaned` | `loaned > 0` |

> 註：程式另存在使用年限／製造日期／保固年數／保養週期數等更細的區間變數（`filterLifespanMin/Max`、`filterManufactureFrom/To`、`filterWarrantyMin/Max`、`filterCycleMin/Max/Unit`），已納入 `filteredItems` 過濾邏輯，但**目前進階面板 UI 未提供對應輸入元件**。是否納入本課範圍：建議課堂決策。

---

## 5. 資料模型（TypeScript）

```ts
// 裝備品項（本模組主體）
export interface EquipmentItem {
  id: number
  code: string                 // 自動產生，如 IT-LAP-111001
  categoryKey: string          // 分類 value（見 CATEGORIES）
  category: string             // 分類中文（由 categoryKey 帶出）
  name: string
  spec: string                 // @deprecated 舊版單一規格，保留相容 list 顯示
  spec1?: string
  spec2?: string
  specNote?: string
  qty: number
  available: number            // 可借 = qty - loaned
  loaned: number               // 外借中數量
  unit: string
  status: 'normal' | 'maintenance' | 'scrapped'
  keeper: string
  keeperPhone: string
  locationId: string           // 常用地點 id；空＝一次性自由地址
  locationName: string         // 地點名稱或組合後地址字串
  locationFloor: string
  locationSpot: string
  photos?: string[]            // 最多 2 張（data URL 或路徑）
  manualFile?: string          // 操作手冊
  manualFileName?: string
  villageId?: string           // 村里持有專用；中心持有為空
  villageName?: string
  // 維護保養
  purchaseDate?: string        // YYYY-MM-DD
  manufactureDate?: string
  warrantyYears?: number | null
  lifespanYears?: number | null
  maintenanceCycle?: number | null       // null/0 = 不需保養
  maintenanceCycleUnit?: MaintenanceCycleUnit
  nextMaintenanceDate?: string
}

export type MaintenanceCycleUnit = 'year' | 'month' | 'week'

// 分類定義
export interface EquipmentCategory {
  value: string
  code: string       // 2 碼類別碼
  label: string
  color: string      // CSS 樣式字串
  items: string[]    // 標準項目清單
}

// 常用地點
export interface EquipmentLocation {
  id: string
  name: string
  county: string
  township: string
  road: string
  detail: string
  address: string    // = county + township + road + detail
  itemCount: number
}

// 借用紀錄
export interface EquipmentLoanRecord {
  id: string
  unit: string           // 借用單位
  borrower: string
  borrowerPhone?: string
  loanDate: string       // YYYY-MM-DD
  dueDate: string
  returnDate?: string
  qty: number
  status: 'active' | 'returned' | 'overdue'
  purpose?: string
  handler?: string       // 核可／經辦人
  note?: string
}

// 維保／效期提醒
export type EquipmentAlertLevel = 'soon' | 'expired'
export type EquipmentAlertKey = 'warranty' | 'lifespan' | 'maintenance' | 'expiry'

export interface EquipmentLifecycleAlert {
  key: EquipmentAlertKey
  level: EquipmentAlertLevel
  label: string   // 保固／使用年限／保養／效期
  date: string    // 推算到期日 YYYY-MM-DD
  days: number    // 帶號天數距今（負＝已逾期）
  message: string
}
```

---

## 6. 驗收條件

1. 進入 `/township/equipment-center` 時，桌機顯示品項表格、預設每頁 20 筆、預設依「分類→項目」升冪排序，並正確顯示總筆數。
2. 於「分類」選「資通訊設備」後，「項目」下拉才可用且只出現該分類項目；清空分類時項目一併清空。
3. 於「編碼」輸入 `IT-LAP` 應能過濾出對應品項（不分大小寫、部分比對）。
4. 展開「進階」勾選「借出中」時，僅列出 `loaned > 0` 的品項；且進階徽章顯示生效條件數。
5. 點表頭「數量」可切換升／降冪，排序後回到第 1 頁。
6. 點「新增品項」進入新增頁，選定「分類＋項目＋規格說明一」後，標題區即時顯示自動編碼；未填齊必填（分類／項目／規格說明一／單位）時「新增品項」按鈕停用。
7. 新增一筆後返回列表能立即看到該筆（跨頁共用同一資料源）；若編碼與既有品項相同，改為累加數量而非新增列。
8. 於任一品項點「編輯」進入 `?mode=edit`，表單預帶原值，改動後按「儲存變更」返回列表且變更生效；按「取消」不變更。
9. 點品名進入明細（view）頁，四欄正確顯示品項資訊、照片／手冊、保管與地點、借用與維保；不存在的 id 顯示「找不到此品項」。
10. 對可借數量 > 0 的品項開「借用品項」，填妥必填欄位（借用數量需 1 ≤ n ≤ 可借數量、預計歸還不早於借用日期）後確認，`available` 減少、`loaned` 增加；可借數量為 0 時借用按鈕停用。
11. 明細頁「登記歸還」後，該借用轉為已歸還，`available` 回補、`loaned` 扣回。
12. 採購日期＋保固／使用年限或下次保養日期落在 30 天內（或已過期）時，列表與明細顯示對應的「即將到期／逾期」提醒標籤（過保固不提醒）。
13. 「匯入 Excel」可下載 CSV 範本（含中文標頭）；選檔後「確認匯入」關閉 Modal（實際解析為待實作，可先不驗）。

---

## 7. 範圍外（本課不做／需課堂決策）

| 項目 | 說明 |
|------|------|
| 後端 API 串接 | 本課用 mock 單例資料（`useEquipmentItems` module-level ref）；原始碼標註待改 `useFetch`／REST |
| 權限控管 | 原始碼未見任何角色／權限判斷；機關前綴固定 `111`（士林區），正式版待由 `useAuth()` 取得 |
| 品項刪除 | 原始碼未見品項刪除功能，建議課堂決策是否納入（含軟刪除／改狀態報廢的取捨） |
| 匯出 Excel | `doExport()` 為 TODO 空實作 |
| 匯入解析 | `confirmImport()` 解析 Excel→資料為 TODO 空實作（僅範本下載可用） |
| 進階細部區間篩選 | 使用年限／製造日期／保固年數／保養週期數的 min/max 篩選已有過濾邏輯但無 UI，是否補齊待決 |
| 村里持有資料 | 本模組僅「中心持有」；村里裝備為另一模組（`equipment-village`），不在本題範圍 |
| 歷史紀錄／借用紀錄來源 | 目前為假資料（`itemLogs` 固定兩筆、僅 id=1 有借用 demo），正式版待接後端 |
| 照片／檔案大小驗證 | 5MB／格式限制目前僅為提示文字，未見程式強制驗證，是否落實待決 |
| 地址結構化回填 | 編輯既有自由地址時無法自動拆回縣市／鄉鎮／路名（原始碼註記待與 DEV 確認） |

---

*文件結束。*
