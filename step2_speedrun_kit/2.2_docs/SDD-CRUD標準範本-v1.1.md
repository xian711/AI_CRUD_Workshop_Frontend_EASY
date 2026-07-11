# SDD — CRUD 標準範本（Template CRUD）v1.1

| 項目 | 內容 |
|------|------|
| 文件版本 | v1.1（依 SD Reviewer 對抗式審查修訂，修訂紀錄見第 12 章） |
| 日期 | 2026-07-10 |
| 依據 | `doc/crud-template/SRS-CRUD標準範本-v1.0.md` |
| 範圍 | 前端 + UIUX（Nuxt 3 + Nuxt UI v2 + Design Token 三層架構） |

---

## 1. 檔案結構與行數預算

所有新檔案以 `Template`/`template` 命名空間隔離，**不修改任何既有檔案**。

```
frontend/
├─ pages/template/crud/
│   ├─ index.vue                        # 列表頁（≤ 420 行）
│   └─ [id].vue                         # 檢視/編輯/新增 三合一（≤ 550 行）
├─ components/template/
│   ├─ TemplateFormField.vue            # label + slot + 欄位級錯誤訊息（≤ 50 行）
│   └─ TemplateStatusBadge.vue          # 狀態 badge（≤ 30 行）
├─ composables/
│   ├─ useTemplateMembers.ts            # 資料層：型別+種子+CRUD API（≤ 300 行）
│   └─ useTemplateListPage.ts           # 通用列表狀態：篩選+分頁+URL 同步（≤ 170 行）
└─ utils/
    ├─ templateValidation.ts            # 純函式驗證引擎（≤ 100 行）
    └─ templateCsv.ts                   # CSV 匯出 util（≤ 50 行）
```

> 對照組：roster 同等功能散落於 TownshipHrRosterPanel.vue（2,255 行）+ member/[id].vue（1,134 行）+ useTownshipRoster.ts（529 行）。
> 本範本總行數目標 **≤ 1,700 行**。
> 若 `[id].vue` 實作中確實超出預算，允許抽出 `TemplateMemberForm.vue` 區塊元件（多一檔換單檔可讀性），並於過程紀錄註明。

**匯入慣例（審查修訂）**：`utils/` 下的函式比照專案現況**顯式 import**（`import { exportCsv } from '~/utils/templateCsv'`），不依賴 auto-import；composables 與 components 走 Nuxt auto-import。實作前先 grep 確認 `useTemplateMembers`、`useTemplateListPage`、`exportCsv`、`validateFields` 等名稱無衝突（審查已確認目前無占用）。`components/template/TemplateXxx.vue` 依 Nuxt 前綴去重規則，使用名即 `<TemplateXxx>`（先例：`components/plan/PlanXxx.vue`）。

---

## 2. 資料層 `useTemplateMembers.ts`

### 2.1 型別與常數

```ts
export type TemplateMemberStatus = '在職' | '停用'
export type TemplateIdType = '身分證' | '居留證' | '護照'
export type TemplatePositionCode = 'director' | 'deputy' | 'leader' | 'member'

export interface TemplateMember {
  id: string                      // 'M-001'
  name: string
  gender: '男' | '女'
  birthDate: string               // YYYY-MM-DD
  idType: TemplateIdType
  nationalId: string
  phone: string
  email: string
  residenceCounty: string
  residenceTownship: string
  residenceAddress: string
  groupName: string
  positionCode: TemplatePositionCode
  qualifications: string[]
  status: TemplateMemberStatus
  note: string
  updatedAt: string               // YYYY-MM-DD，系統寫入
}

/** 職務中繼資料：顯示名 + 排序權重（BR-T-05：positionTitle 由此導出） */
export const TEMPLATE_POSITION_META: Record<TemplatePositionCode, { title: string; weight: number }> = {
  director: { title: '主任',   weight: 1 },
  deputy:   { title: '副主任', weight: 2 },
  leader:   { title: '組長',   weight: 3 },
  member:   { title: '組員',   weight: 4 },
}

export const TEMPLATE_GROUP_OPTIONS = ['協作中心', '指揮組', '搶救組', '後勤組', '醫護組', '疏散引導組']
export const TEMPLATE_QUALIFICATION_OPTIONS = ['防災士', 'TCERT', '急救證照', '無線電執照']
```

導出函式 `positionTitleOf(code): string`、`positionWeightOf(code): number`。

### 2.2 種子資料

- `SEED: TemplateMember[]`，**24 筆字面量**（可讀、可維護，刻意不用 hash 產生器）。
- 分佈要求：涵蓋全部 6 編組、4 職務（主任/副主任各 1，隸屬協作中心）、至少 3 筆「停用」、至少 8 筆含 1~3 個資格、縣市集中於台東縣（3~4 個鄉鎮市）加 1~2 筆花蓮縣。
- updatedAt 分佈於 2026-05 ~ 2026-07，供排序示範。
- 一律為虛構測試資料，檔頭註解標明（Harness 誠實原則：mock 必須明確標示）。

### 2.3 CRUD API（後端就緒契約）

```ts
export function useTemplateMembers() {
  return { records, getById, create, update, remove }
}
```

| 函式 | 簽章 | 行為 |
|------|------|------|
| records | `Readonly<Ref<TemplateMember[]>>` | 響應式清單（列表頁 computed 過濾用） |
| getById | `(id: string) => Promise<TemplateMember \| undefined>` | 回傳**深拷貝**，防表單直接改動 store |
| create | `(input: TemplateMemberInput) => Promise<TemplateMember>` | 產生流水 id（`M-` + zero-pad 遞增）、寫入 updatedAt |
| update | `(id, input) => Promise<TemplateMember>` | 覆寫並更新 updatedAt；找不到 id 時 throw |
| remove | `(id: string) => Promise<void>` | 自陣列移除 |

- `TemplateMemberInput = Omit<TemplateMember, 'id' | 'updatedAt'>`。
- 內部：module-level `ref` 單例 + `ensureSeeded()`（一次性深拷貝 SEED），比照 `useTownshipExtOrgs.ts` 現行模式。
- **接縫註解**：每個函式標注未來替換為 `useFetch('/api/template/members'...)` 的對應端點（RESTful：GET/POST/PUT/DELETE），呼叫端完全不變。
- updatedAt 抽為 `todayString()` 函式（export，供 CSV 檔名共用）；一律以**本地時區**組 YYYY-MM-DD（見勘誤 #3）。

---

## 3. 通用列表狀態 `useTemplateListPage.ts`

roster / ext-orgs / equipment 各自重複實作「篩選 + 分頁 + URL 同步 + 返回還原」約 200 行 ×3。本 composable 將其抽為工廠（Refactoring: Extract Function / Form Template Method）：

```ts
export interface TemplateListPageOptions<F extends Record<string, string>> {
  defaultFilters: F
  /** 進階區的 filter key（FR-T-102 徽章只計這些欄位的非預設數） */
  advancedKeys?: (keyof F & string)[]
  defaultPageSize?: number        // 預設 10
  syncDebounceMs?: number         // 預設 300
}

export function useTemplateListPage<F extends Record<string, string>>(
  opts: TemplateListPageOptions<F>,
) {
  return {
    filters,             // reactive<F>，初始值 = URL query ?? defaults
    page, pageSize,      // Ref<number>
    showAdvanced,        // Ref<boolean>
    resetFilters,        // () => void：還原 defaults + page=1
    advancedActiveCount, // ComputedRef<number>：advancedKeys 中非預設值的數量（徽章用）
    buildReturnQuery,    // () => string：目前狀態序列化（供明細頁 return）
  }
}
```

規格：

1. **範圍限定（審查修訂）**：本工廠僅支援**純字串型 filter**（含 `'全部'` 哨兵）。檔頭 JSDoc 明確標注：「布林/多值 filter 請於複製後自行擴充」，避免洩漏抽象誤導使用者。
2. **初始化**：建構時讀取 `route.query`，只接受 defaultFilters 既有 key；`page`/`size` 讀 query 同名參數。
3. **寫回 URL**：watch filters/page/pageSize，debounce 300ms 後 `router.replace`，**僅寫入非預設值**（FR-T-601）；使用具名常數 `SYNC_DEBOUNCE_MS`。
4. **filters 變更 → page 重設為 1**（pageSize 變更亦同）；注意勿讓「還原 URL 初始化」誤觸 reset。
5. **buildReturnQuery**：序列化目前非預設狀態為 query string（不含 `return` 自身），比照 ext-orgs 以 `URLSearchParams` 產生；**值不另行編碼**（vue-router 會自動 encode query 值，勿雙重編碼）。
6. **分頁切片由頁面自行完成**（審查修訂）：`pagedRows = computed(() => sorted.slice((page-1)*size, page*size))`，composable 不提供 paginate helper——保持工廠職責單一、簽章直觀。
7. 排序狀態**不納入**本 composable（由 `useTableSort` 管理）。URL 僅記錄**使用者主動點擊表頭後的單欄排序**（`sort=key:dir`）；預設的兩條排序規則（職務→姓名）屬預設狀態，**不寫入 URL**（審查修訂：`setSingle` 點擊後必為單欄，與單一 sort 參數語意一致）。glue code 約 10 行在頁面層完成。

---

## 4. 驗證引擎 `utils/templateValidation.ts`

純函式、無 UI 依賴（Clean Code：業務規則與呈現分離）：

```ts
export type FieldRule = { required?: boolean; pattern?: RegExp; maxLength?: number; message: string }
export type FieldRules<T> = Partial<Record<keyof T & string, FieldRule[]>>

export function validateFields<T extends Record<string, unknown>>(
  form: T, rules: FieldRules<T>,
): Record<string, string>   // { 欄位名: 第一條未通過訊息 }，全過 = {}
```

- 空值且非 required → 跳過 pattern 檢查（BR-T-01 Email 行為）。
- 常數 regex 集中 export：`PHONE_PATTERN = /^09\d{8}$/`、`TW_ID_PATTERN = /^[A-Z][12]\d{8}$/`、`EMAIL_PATTERN`。
- 相依規則（BR-T-02 證號依 idType）在頁面層以函式產生 rules（`rulesFor(form)`），引擎本身保持無狀態。

---

## 5. CSV util `utils/templateCsv.ts`

```ts
export interface CsvColumn<T> { label: string; value: (row: T) => string | number }
export function exportCsv<T>(filename: string, columns: CsvColumn<T>[], rows: T[]): void
```

- 值含 `,` `"` 換行時以 RFC 4180 規則跳脫（含 `\r\n` 列尾；roster 現況為無條件全包引號＋`\n` 列尾，且檔名用 `toISOString()` 有 UTC 換日問題——本 util 一併修正）。
- 前置 BOM（`﻿`）；以 Blob + 隱藏 `<a>` 觸發下載後釋放 URL。

---

## 6. 列表頁 `pages/template/crud/index.vue`

### 6.1 頁面宣告

```ts
definePageMeta({ layout: 'township', pageTitle: 'CRUD 標準範本 — 人員管理' })
```

（審查已驗證：非 `/township` 前綴路徑在 township layout 下走 fallback 分支，用 `route.meta.pageTitle` 顯示麵包屑，不會 throw；sidebar 不高亮屬可接受。）

### 6.2 區塊結構（template 依序）

1. **篩選卡**（`CardOutlined`）：
   - 第一列：關鍵字 `UInput`（placeholder「姓名／電話／Email」）、編組 `USelectMenu`、狀態 `USelectMenu`、「進階」toggle 鈕（含 advancedActiveCount 徽章）、「清除」鈕（查詢在前清除在後）。
   - 進階列（`v-show="showAdvanced"`）：資格 `USelectMenu`（單選）、居住縣市/鄉鎮區相依下拉（**審查修訂**，比照 ext-orgs 既有模式）：
     ```ts
     import { COUNTY_NAMES, loadTownships } from '~/utils/taiwanAddress'
     const countyOptions = ['全部', ...COUNTY_NAMES]
     const townshipOptions = ref<string[]>(['全部'])
     watch(() => filters.county, async (c) => {
       filters.township = '全部'
       townshipOptions.value = c === '全部' ? ['全部'] : ['全部', ...(await loadTownships(c)).map(t => t.name)]
     })
     ```
   - **「全部」哨兵（審查修訂）**：所有下拉的 options 以 `['全部', ...實值]` 純字串陣列表達，defaultFilters 對應值即 `'全部'`（關鍵字 q 預設 `''`）。過濾判斷 `value !== '全部'` 才生效。此為專案既有慣例，勿用空字串 option。
2. **工具列**：左側結果筆數文字；右側「匯出 CSV」`UButton`（secondary）。
3. **桌機表格**（`hidden md:block`，語意 `<table>`）：
   - 欄：姓名、編組、職務、資格（badge，>3 顯示 +N）、電話、狀態（`TemplateStatusBadge`）、更新日期、操作。
   - 可排序欄用 `AppSortHeader` + `useTableSort`（columns：name/groupName/positionCode/status/updatedAt；positionCode 用 accessor 回傳 weight（數值比較）；updatedAt 字串比較即可）。
   - 預設排序 `defaultRules: [{ key: 'positionCode', dir: 'asc' }, { key: 'name', dir: 'asc' }]`（FR-T-202）。
   - 列點擊 → 檢視；操作欄：檢視/編輯/刪除 icon 鈕（`aria-label` 必備，`@click.stop`）。
   - 斑馬紋 + hover 高亮，以 SYS token 別名 class（`bg-surface-variant` 等）。
4. **手機卡片**（`md:hidden`）：每筆一張卡（姓名+職務 badge+編組+電話+狀態+**資格 badge 列+更新日期**——NFR-T-01 要求與桌機表格資訊等價，實作勘誤補列），卡片 `@click` 檢視；卡右上**檢視/編輯/刪除**鈕**必加 `@click.stop`**（審查修訂，防事件冒泡誤觸檢視；檢視鈕同時提供鍵盤觸達入口，NFR-T-02）。
5. **空狀態**：`UIcon i-heroicons-magnifying-glass` + 「查無符合條件的資料」+「清除篩選」ghost 鈕。
6. **表尾**：`AppTableFooter`，**一律 canonical props**（`:current-page` `:total-items` `:page-size`），事件 `@update:current-page` `@update:page-size`。
7. **刪除確認**：`AppConfirmModal`（variant danger、title「刪除人員」、message 含姓名）。**注意（審查修訂）**：`confirm` 事件不會自動關閉 modal，`confirmDelete()` 完成後須自行把 `v-model` 設回 `false`。
8. **Teleport `#breadcrumb-actions`**：「新增人員」primary solid md 鈕。

### 6.3 script 邏輯

- `useTemplateListPage({ defaultFilters: { q: '', group: '全部', status: '全部', qual: '全部', county: '全部', township: '全部' }, advancedKeys: ['qual', 'county', 'township'] })`。
- `filteredRows = computed(...)`：純函式 `matchesFilters(member, filters)` 抽出於 script 內（每個條件一個 early return，可讀性優先）。
- `sortedRows = computed(() => sortRows(filteredRows.value))`、`pagedRows = computed(() => 切片)`。
- sort 規則 ↔ URL `sort=key:dir` 雙向 glue（約 10 行，僅使用者點擊後的單欄排序寫入 URL）。
- 導覽：`goCreate/goView/goEdit` 均帶 `return: buildReturnQuery()`。
- 刪除：`requestDelete(row)` 開 modal → `confirmDelete()` 呼叫 `remove` → 關 modal → toast → 若當頁空退一頁（FR-T-402，比照 ext-orgs `if (page > totalPages) page = totalPages`）。
- 匯出：`exportCsv('人員清單-YYYYMMDD.csv', columns, sortedRows.value)`（FR-T-501 全量非當頁）。
- toast 用 Nuxt UI `useToast()`，成功 `color: 'green'`、錯誤 `color: 'red'`（比照專案現況）。

---

## 7. 明細頁 `pages/template/crud/[id].vue`

### 7.1 模式判定

```ts
type PageMode = 'view' | 'edit' | 'create'
const mode = computed<PageMode>(() =>
  route.params.id === 'new' ? 'create' : route.query.mode === 'edit' ? 'edit' : 'view')
```

（先例：`equipment-center/[id].vue` 同構做法，含 notFound 處理。）

- **動態頁標題（審查修訂）**：使用 township layout 提供的 `useState<string | null>('township-page-title-override')`，依 mode 設「檢視人員／編輯人員／新增人員」，`onUnmounted` 還原 `null`。
- 進入 edit/create 時把資料深拷貝進 `form = reactive<TemplateMemberInput>(...)`；view 直接用唯讀資料。
- 找不到 id：顯示「查無資料」空狀態 + 返回鈕（不得白屏）。

### 7.2 版面

- 檢視模式：`CardOutlined` 內以區塊分組（基本資料/聯絡資訊/編組職務/其他），`ViewField` grid（`grid-cols-1 md:grid-cols-3`）。陣列欄位顯示 badge 列；note 全寬。
- 表單模式：同分組，改用 `TemplateFormField`（label + required 星號 + 錯誤紅字）包輸入元件：
  - 文字欄 `UInput`；長文字 `UTextarea`。
  - **enum 欄一律 `USelectMenu`**（審查修訂：含性別——專案生產頁無 URadioGroup 先例，遵循「最成熟做法」原則）。
  - 日期 `AppDatePicker`（v-model 為 YYYY-MM-DD 字串，審查已驗證相容）。
  - **地址（審查修訂）**：直接複用 `components/AppAddressPicker.vue`（`v-model:county` / `v-model:township` / `v-model:road` / `v-model:detail` 四個必填綁定，stacked 版面；先例：`equipment-center/[id].vue`）。`road` 為該元件必填 prop，本實體僅有單一 residenceAddress → 以獨立暫存 ref 承接、儲存時條件合併（詳見實作註解），不自行拼裝縣市/鄉鎮下拉。
  - 資格多選：`UCheckbox` 橫向 wrap 群組（選項僅 4 個，checkbox 比 multi-select 直觀；`UCheckbox` 先例：ext-orgs）。

### 7.3 動作（全部 Teleport）

| 模式 | `#breadcrumb-actions-left` | `#breadcrumb-actions` |
|------|------|------|
| view | 返回 | 編輯（primary） |
| edit | — | 取消（secondary）、儲存（primary） |
| create | — | 取消（secondary）、儲存（primary） |

- 返回/取消/儲存後導向：`/template/crud` + 解析 `route.query.return` 還原（`navigateBack()` 統一處理；return 值為 query string，直接 `?${return}` 組回或以 `URLSearchParams` 解析為 query 物件）。
- view「編輯」→ `router.replace` 加上 `mode=edit`（保留 return）。

### 7.4 儲存流程

1. `errors = validateFields(form, rulesFor(form))`。
2. 有錯 → 錯誤物件寫入 `fieldErrors`；**聚焦第一個錯誤欄位（審查修訂）**：`TemplateFormField` 接受 `name` prop 並渲染為 `data-field` 屬性，save() 依表單欄位順序找出第一個錯誤 key，`document.querySelector('[data-field="key"]')` 內第一個可聚焦元素（input/select/button）呼叫 `.focus()`（自帶 scrollIntoView 效果），並 toast「請修正 N 個欄位」。
3. 無錯 → `create` 或 `update` → toast 成功 → `navigateBack()`。
4. 欄位輸入時清除該欄位錯誤（`watch` 或 input handler 擇一，擇簡單者）。

---

## 8. 範本元件

### 8.1 `TemplateFormField.vue`

```ts
interface Props { label: string; name: string; required?: boolean; error?: string }
```

- 結構 = FormRow 的擴充版：label（+紅星）→ slot → `<p v-if="error">`（`text-[var(--ui-sys-color-error)] text-label-small`，`:id` 供 `aria-describedby`）。
- 根元素渲染 `:data-field="name"`（儲存時聚焦定位用，見 §7.4）。
- 不修改共用 FormRow（開放封閉原則：以新元件擴充而非改既有）。

### 8.2 `TemplateStatusBadge.vue`

```ts
interface Props { status: TemplateMemberStatus }
```

- 在職 → `UBadge color="success"`；停用 → neutral（`bg-surface-variant text-on-surface-variant` 膠囊 span，比照 CLAUDE.md Badge 規範）。
- 狀態→樣式對照表定義為具名常數（Replace Conditional with Lookup）。

---

## 9. UIUX 規範（約束實作）

1. **Token**：一律 COMP/SYS token 或 Tailwind 別名（`text-on-surface`、`border-outline-variant`…）；禁止 hex、禁止 REF token、禁止 `<style scoped>` 蓋 Nuxt UI。
2. **模組類別**：平時 → township layout 預設白/淡色底，不做任何災時橘/演練黃樣式。
3. **間距**：頁面外層 `space-y-lg`；卡片內欄位間距 `gap-md`。
4. **按鈕**：麵包屑動作列一律 `size="md"`；列表操作 icon 鈕 ghost + `aria-label`。
5. **字體**：中英混排已由全域處理，頁面不要 inline style 重複宣告（roster 現況 AppTableFooter 的 inline style 為反例，不要仿效）。
6. **RWD 斷點**：`md`（768px）為表格/卡片切換點（NFR-T-01）。

---

## 10. Clean Code / Refactoring 對照表（教學錨點）

| 設計決策 | 原則（Fowler / Clean Code） | 對照 roster 現況 |
|----------|------|------|
| `useTemplateListPage` 抽取共用列表狀態 | Extract Function、Duplicated Code 除臭 | 三頁各自複製 ~200 行 |
| `TEMPLATE_POSITION_META` 查表 | Replace Conditional with Lookup | 散落 if/else 與魔術字串 |
| `validateFields` 純函式 + rules 資料化 | 分離業務規則與 UI；Replace Magic Literal | save() 內 50 行 if + toast |
| CRUD API 全非同步 | 針對介面而非實作寫程式（後端接縫） | 同步直改 ref，接後端需改呼叫端 |
| 字面量種子資料 | 顯性優於聰明（Explicit over clever） | hash 產生器 + 魔術乘數 |
| `matchesFilters` early return | Guard Clauses、單一抽象層級 | 巢狀三元與長布林鏈 |
| getById 回深拷貝 | 防禦性拷貝，杜絕表單改到 store | 直接引用共享物件 |
| 常數具名（SYNC_DEBOUNCE_MS 等） | Replace Magic Number with Constant | `500`、`31`、`131`… |
| TemplateFormField 擴充而非改 FormRow | 開放封閉原則 | AppTableFooter 雙 props 並存的教訓 |
| 複用 AppAddressPicker 而非重造 | 重複利用既有資產（DRY at component level） | 各頁自行拼縣市/鄉鎮下拉 |
| 單檔行數預算 | 小而專注的模組 | 2,255 行單檔 |
| 誠實標注抽象邊界（僅字串 filter） | 誠實原則（Harness 鐵律 2） | 「看似通用實則窄」的隱形陷阱 |

---

## 11. 驗收與審查

- 實作完成後依 SRS 第 8 章清單自檢。
- 程式碼審查維度：(a) SDD 符合度逐條、(b) CLAUDE.md 禁止事項、(c) Clean Code 對照表落實、(d) TypeScript 無 any 滲漏、(e) 響應式正確性（computed vs method、深拷貝時機）。
- E2E 視覺審查：桌機 1280×800 與手機 390×844 各截列表/檢視/表單/錯誤態/刪除確認。

---

## 12. 修訂紀錄

### v1.1（2026-07-10）— 依 SD Reviewer 對抗式審查修訂

| # | 審查編號 | 修訂內容 |
|---|---------|---------|
| 1 | A-1 ❌ | 地址：表單改複用 `AppAddressPicker`；篩選改 `USelectMenu` + async `loadTownships` + `'全部'` 哨兵（ext-orgs 既有模式）。移除「taiwanAddress 直接提供鄉鎮選項」的錯誤敘述 |
| 2 | C-1 ❌ | `activeFilterCount` 更名 `advancedActiveCount`，只計 `advancedKeys`（qual/county/township）非預設數，符合 FR-T-102 |
| 3 | C-2 ⚠️ | 下拉一律 `'全部'` 字面哨兵 + 純字串 options，defaultFilters 對應調整 |
| 4 | C-3 ⚠️ | 性別改 `USelectMenu`（生產頁無 URadioGroup 先例） |
| 5 | C-4 ⚠️ | 移除 `paginate` helper，分頁切片由頁面 computed 完成 |
| 6 | C-5 ⚠️ | 聚焦第一錯誤欄位：`TemplateFormField` 增加 `name` prop → `data-field` 屬性 → `.focus()` 真聚焦 |
| 7 | C-6 ⚠️ | 手機卡片操作鈕明文要求 `@click.stop` |
| 8 | A-5 | 刪除確認流程補「confirm 後自行關閉 modal」 |
| 9 | A-3 | 明確 URL sort 語意：僅使用者點擊後的單欄排序寫入 URL，預設雙規則不寫入 |
| 10 | A-8 | 明細頁採用 `township-page-title-override` useState 實現動態標題 |
| 11 | A-9 | utils 顯式 import（與專案現況一致） |
| 12 | B-1 | `useTemplateListPage` 檔頭誠實標注「僅支援字串 filter」 |
| 13 | C-7 | `[id].vue` 行數預算 480 → 550，並允許必要時抽 `TemplateMemberForm.vue` |

### v1.1 實作階段勘誤（程式碼審查回饋）

| # | 勘誤 |
|---|------|
| 1 | §6.2-4 手機卡片補列「資格、更新日期、檢視鈕」——原清單與 SRS NFR-T-01（資訊等價）衝突，裁定以 SRS 為準 |
| 2 | §3 補充：debounce 排程必須於 scope dispose 時清理，且寫回 URL 前須確認仍在原路由（防跨頁污染——雙 reviewer 審查發現） |
| 3 | §2.3 `today()` 一律使用**本地時區**組 YYYY-MM-DD，不得用 `toISOString()`（UTC 於台灣時區 00:00–08:00 會差一天） |

### v1.1 E2E 驗收階段勘誤（Playwright 實測回饋）

| # | 勘誤 |
|---|------|
| 4 | §7.2 生日欄改用**原生 `UInput type="date"`**：AppDatePicker 內層 v-calendar 3.1.2 與 Vue 3.5 不相容，選取日期即整頁崩潰（既有缺陷，非範本引入；全站僅 2 個既有頁使用該元件） |
| 5 | §6.2-8／§7.3 Teleport 一律加 `v-if="teleportReady"`（onMounted 後 true）：hard-load 時 `#breadcrumb-actions` 尚未插入文件，裸 Teleport 產生壞 vnode，配合 app.vue 的 fullPath key 整頁 remount 會在 unmount 時崩潰 |
| 6 | §7.1 動態標題的 `onUnmounted` 改為**條件清除**（目前值等於自己設的才清 null）：Suspense 下 keyed remount 是「新 setup 先跑、舊 unmount 後跑」，無條件清除會抹掉新實例的標題 |
| 7 | app 層修正（範本外、一行）：`app.vue` 補掛 `<UNotifications />`——先前未掛載導致**全站** `useToast()` 靜默失效 |
| 8 | §1 行數預算：`index.vue` 420 → 430（E2E 修正加入 teleportReady 模式與教學註解 +7 行，取可讀性優先） |
