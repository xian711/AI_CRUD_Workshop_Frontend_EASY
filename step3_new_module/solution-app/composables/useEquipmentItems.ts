/**
 * useEquipmentItems — 中心裝備物資的資料層（型別 + 分類/項目查表 + 種子 + CRUD API）
 * ──────────────────────────────────────────────────────────────
 * 這個檔案的角色（比照 useTemplateMembers 範本）：
 *   示範一個「後端就緒」的資料層：對外 CRUD 一律非同步（Promise），未來把內部
 *   實作換成 useFetch 即可，呼叫端完全不用改（針對介面而非實作寫程式）。
 *
 * 設計要點：
 *   - module-level ref 單例 + ensureSeeded()。
 *   - getById 回「深拷貝」，杜絕表單直接改到 store（防禦性拷貝）。
 *   - 分類中文名 / 項目編碼由查表導出（Replace Conditional with Lookup）。
 *   - 品項編碼 {類別2碼}-{項目3碼}-{流水3碼} 於資料層產生，頁面只做即時預覽。
 *
 * ⚠️ 種子為「虛構測試資料」：品名取自真實裝備清單，數量/保管人/地點皆為演示杜撰。
 */
import { computed, ref } from 'vue'

// ── 型別與常數 ────────────────────────────────────────────────
export type EquipmentStatus = 'normal' | 'maintenance' | 'scrapped'

export interface EquipmentItem {
  id: string // 'E-001'
  code: string // 系統產生，如 IT-LAP-001
  categoryKey: string // 分類 value（見 EQUIPMENT_CATEGORIES）
  name: string // 項目（一般分類選單；「其他」分類自行輸入）
  qty: number
  unit: string
  spec1: string // 規格說明
  keeper: string
  keeperPhone: string
  locationName: string // 存放地點（單一文字欄，課堂簡化版）
  status: EquipmentStatus
  purchaseDate: string // YYYY-MM-DD，可空
  specNote: string // 備註
}

/** 新增/編輯的輸入型別：id 與 code 由系統產生 */
export type EquipmentItemInput = Omit<EquipmentItem, 'id' | 'code'>

/** 分類定義：value（程式值）+ code（2 碼類別碼）+ label（中文）+ items（標準項目清單） */
export interface EquipmentCategory {
  value: string
  code: string
  label: string
  items: string[]
}

/** 10 大分類（沿用 PRD 3.3 節 CATEGORIES；順序即排序權重，非中文筆劃） */
export const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  { value: 'ICT', code: 'IT', label: '資通訊設備', items: ['筆記型電腦', '平板電腦', 'WIFI分享器', '行動箱'] },
  { value: 'POWER', code: 'PW', label: '供電及照明設備', items: ['發電機', '行動太陽能電板組', '儲能設備(主)', '儲能設備(輔)', '塔燈'] },
  { value: 'STORAGE', code: 'ST', label: '儲物設備', items: ['貨架角鋼', '溫濕度計', '除濕機'] },
  { value: 'OFFICE', code: 'OF', label: '事務用品', items: ['遮陽棚', '摺疊桌椅組', '摺疊推車', '移動式白板', '大型垃圾桶', 'DC節能扇', '擴音器(大聲公)', '識別證與掛繩', '文書用品', '電源延長線', '轉接頭'] },
  { value: 'PPE', code: 'PP', label: '個人防護裝備', items: ['哨子', '反光背心', '頭燈', '手電筒', '頭盔', '口罩', '手套(拋棄式)', '手套(工作手套)', '雨衣', '防穿刺工作鞋', '避難包(EDC)', '行動電源(個人用)'] },
  { value: 'SHELTER_SUPPLY', code: 'SH', label: '支援避難收容設施', items: ['避難帳篷', '折疊床墊(睡墊)', '保暖毯', '緊急睡袋', '儲水桶'] },
  { value: 'EMFOOD', code: 'EF', label: '自用緊急物資', items: ['即時口糧', '補充型口糧', '鹽糖'] },
  { value: 'MEDICAL', code: 'MD', label: '醫療及衛生用品', items: ['簡易廁所組', '擔架床/軟式擔架', '止血帶', '急救箱', '盥洗用具'] },
  { value: 'DECON', code: 'DC', label: '清消及過濾設備', items: ['加壓式免電力緊急淨水設備', '重力式緊急濾水器', '免電力緊急消毒劑製造設備'] },
  { value: 'OTHER', code: 'OT', label: '其他', items: [] },
]

/** 項目名 → 3 碼項目碼；查不到時用 OTH（BR-EQ-04；「其他」分類一律 OTH） */
export const ITEM_CODE_MAP: Record<string, string> = {
  筆記型電腦: 'LAP', 平板電腦: 'TAB', WIFI分享器: 'WIF', 行動箱: 'MOB',
  發電機: 'GEN', 行動太陽能電板組: 'SOL', '儲能設備(主)': 'ESM', '儲能設備(輔)': 'ESS', 塔燈: 'TWL',
  貨架角鋼: 'RAK', 溫濕度計: 'THM', 除濕機: 'DEH',
  遮陽棚: 'CAN', 摺疊桌椅組: 'TBC', 摺疊推車: 'CRT', 移動式白板: 'WBD', 大型垃圾桶: 'BIN',
  DC節能扇: 'FAN', '擴音器(大聲公)': 'SPK', 識別證與掛繩: 'IDC', 文書用品: 'STA', 電源延長線: 'EXT', 轉接頭: 'ADP',
  哨子: 'WHS', 反光背心: 'VST', 頭燈: 'HLP', 手電筒: 'FLA', 頭盔: 'HLM', 口罩: 'MSK',
  '手套(拋棄式)': 'GLD', '手套(工作手套)': 'GLW', 雨衣: 'RNC', 防穿刺工作鞋: 'SHO', '避難包(EDC)': 'EDC', '行動電源(個人用)': 'PWB',
  避難帳篷: 'TNT', '折疊床墊(睡墊)': 'MAT', 保暖毯: 'BLK', 緊急睡袋: 'SLP', 儲水桶: 'WTK',
  即時口糧: 'RTE', 補充型口糧: 'SUP', 鹽糖: 'SLT',
  簡易廁所組: 'TLT', '擔架床/軟式擔架': 'STR', 止血帶: 'TQT', 急救箱: 'FAK', 盥洗用具: 'HYG',
  加壓式免電力緊急淨水設備: 'PWP', 重力式緊急濾水器: 'GWF', 免電力緊急消毒劑製造設備: 'DSF',
}

/** 狀態 → 中文顯示（enum 值嚴格照 SPEC；預設 normal） */
export const EQUIPMENT_STATUS_META: Record<EquipmentStatus, string> = {
  normal: '正常',
  maintenance: '維修中',
  scrapped: '已報廢',
}
export const EQUIPMENT_STATUS_OPTIONS: EquipmentStatus[] = ['normal', 'maintenance', 'scrapped']

/** 分類 value → 中文 label */
export function categoryLabelOf(key: string): string {
  return EQUIPMENT_CATEGORIES.find(c => c.value === key)?.label ?? key
}
/** 分類 value → 排序權重（依 EQUIPMENT_CATEGORIES 定義順序，非中文筆劃） */
export function categoryOrderOf(key: string): number {
  const index = EQUIPMENT_CATEGORIES.findIndex(c => c.value === key)
  return index < 0 ? EQUIPMENT_CATEGORIES.length : index
}
/** 分類 value → 該分類標準項目清單（「其他」回空陣列，頁面改文字輸入） */
export function itemsOfCategory(key: string): string[] {
  return EQUIPMENT_CATEGORIES.find(c => c.value === key)?.items ?? []
}
/** 狀態 → 中文顯示 */
export function statusLabelOf(status: EquipmentStatus): string {
  return EQUIPMENT_STATUS_META[status]
}

// ── 種子資料（24 筆字面量，虛構測試資料；顯性優於聰明）──
// 涵蓋全部 10 分類；狀態 normal / maintenance(E-002,E-007,E-022) / scrapped(E-005,E-016) 皆出現。
// 部分選填欄位（保管人/電話/採購日/備註）刻意留空，示範選填。
type SeedItem = Omit<EquipmentItem, 'id'>

const SEED: SeedItem[] = [
  { code: 'IT-LAP-001', categoryKey: 'ICT', name: '筆記型電腦', qty: 12, unit: '台', spec1: '14 吋商用機，i5／16G／512G SSD', keeper: '陳建豪', keeperPhone: '0912345678', locationName: '協作中心 2F 資訊機房', status: 'normal', purchaseDate: '2024-03-15', specNote: '含原廠充電器' },
  { code: 'IT-LAP-002', categoryKey: 'ICT', name: '筆記型電腦', qty: 3, unit: '台', spec1: '15 吋文書機，i3／8G／256G SSD', keeper: '林淑芬', keeperPhone: '0922333444', locationName: '協作中心 2F 資訊機房', status: 'maintenance', purchaseDate: '2022-06-10', specNote: '2 台鍵盤故障待修' },
  { code: 'IT-TAB-001', categoryKey: 'ICT', name: '平板電腦', qty: 8, unit: '台', spec1: '10 吋，含防摔保護殼', keeper: '王志明', keeperPhone: '', locationName: '協作中心 1F 器材室', status: 'normal', purchaseDate: '2024-09-01', specNote: '' },
  { code: 'IT-WIF-001', categoryKey: 'ICT', name: 'WIFI分享器', qty: 6, unit: '台', spec1: '4G LTE 行動網路分享器', keeper: '', keeperPhone: '', locationName: '協作中心 1F 器材室', status: 'normal', purchaseDate: '', specNote: 'SIM 卡另計' },
  { code: 'IT-MOB-001', categoryKey: 'ICT', name: '行動箱', qty: 2, unit: '箱', spec1: '整合供電與網路之行動指揮箱', keeper: '許家豪', keeperPhone: '0943444555', locationName: '協作中心 1F 器材室', status: 'scrapped', purchaseDate: '2019-01-20', specNote: '主機板燒毀，待報廢除帳' },
  { code: 'PW-GEN-001', categoryKey: 'POWER', name: '發電機', qty: 4, unit: '台', spec1: '汽油發電機 3kW，附輪組', keeper: '李國強', keeperPhone: '0966777888', locationName: '後勤倉庫 A 區', status: 'normal', purchaseDate: '2023-11-05', specNote: '' },
  { code: 'PW-GEN-002', categoryKey: 'POWER', name: '發電機', qty: 1, unit: '台', spec1: '柴油發電機 5kW', keeper: '李國強', keeperPhone: '0966777888', locationName: '後勤倉庫 A 區', status: 'maintenance', purchaseDate: '2021-04-18', specNote: '定期保養送修中' },
  { code: 'PW-TWL-001', categoryKey: 'POWER', name: '塔燈', qty: 3, unit: '組', spec1: 'LED 移動式照明塔，升降 6M', keeper: '', keeperPhone: '', locationName: '後勤倉庫 A 區', status: 'normal', purchaseDate: '2024-02-28', specNote: '' },
  { code: 'ST-DEH-001', categoryKey: 'STORAGE', name: '除濕機', qty: 5, unit: '台', spec1: '12 公升／日，適用倉儲防潮', keeper: '周淑惠', keeperPhone: '0954555666', locationName: '後勤倉庫 B 區', status: 'normal', purchaseDate: '2023-07-12', specNote: '' },
  { code: 'ST-THM-001', categoryKey: 'STORAGE', name: '溫濕度計', qty: 10, unit: '個', spec1: '數位式溫濕度計', keeper: '', keeperPhone: '', locationName: '後勤倉庫 B 區', status: 'normal', purchaseDate: '', specNote: '' },
  { code: 'OF-TBC-001', categoryKey: 'OFFICE', name: '摺疊桌椅組', qty: 20, unit: '組', spec1: '一桌四椅，塑鋼材質', keeper: '鄭文彬', keeperPhone: '0932333444', locationName: '協作中心 B1 儲藏室', status: 'normal', purchaseDate: '2024-01-10', specNote: '' },
  { code: 'OF-BIN-001', categoryKey: 'OFFICE', name: '大型垃圾桶', qty: 15, unit: '個', spec1: '子母車 240L，附輪', keeper: '', keeperPhone: '', locationName: '協作中心 B1 儲藏室', status: 'normal', purchaseDate: '2023-05-22', specNote: '' },
  { code: 'OF-SPK-001', categoryKey: 'OFFICE', name: '擴音器(大聲公)', qty: 6, unit: '支', spec1: '手持式擴音器 25W，附充電座', keeper: '許家豪', keeperPhone: '0943444555', locationName: '協作中心 1F 器材室', status: 'normal', purchaseDate: '2024-04-03', specNote: '' },
  { code: 'PP-HLM-001', categoryKey: 'PPE', name: '頭盔', qty: 30, unit: '頂', spec1: '工程安全帽，附下巴帶', keeper: '黃俊傑', keeperPhone: '0910111222', locationName: '搶救組裝備間', status: 'normal', purchaseDate: '2023-09-15', specNote: '' },
  { code: 'PP-FLA-001', categoryKey: 'PPE', name: '手電筒', qty: 40, unit: '支', spec1: 'LED 強光手電筒，充電式', keeper: '', keeperPhone: '', locationName: '搶救組裝備間', status: 'normal', purchaseDate: '2024-06-08', specNote: '含 18650 電池' },
  { code: 'PP-VST-001', categoryKey: 'PPE', name: '反光背心', qty: 8, unit: '件', spec1: '高視度反光背心 L 號', keeper: '', keeperPhone: '', locationName: '搶救組裝備間', status: 'scrapped', purchaseDate: '2018-03-01', specNote: '反光條老化，汰換中' },
  { code: 'SH-TNT-001', categoryKey: 'SHELTER_SUPPLY', name: '避難帳篷', qty: 10, unit: '頂', spec1: '4 人快速搭建帳篷，防水', keeper: '簡淑貞', keeperPhone: '0939000111', locationName: '收容物資倉庫', status: 'normal', purchaseDate: '2024-05-20', specNote: '' },
  { code: 'SH-BLK-001', categoryKey: 'SHELTER_SUPPLY', name: '保暖毯', qty: 100, unit: '件', spec1: '刷毛保暖毯 150×200cm', keeper: '', keeperPhone: '', locationName: '收容物資倉庫', status: 'normal', purchaseDate: '2023-12-01', specNote: '' },
  { code: 'EF-RTE-001', categoryKey: 'EMFOOD', name: '即時口糧', qty: 200, unit: '包', spec1: '即食主食包，保存期 3 年', keeper: '吳雅婷', keeperPhone: '0977888999', locationName: '緊急物資倉庫', status: 'normal', purchaseDate: '2025-01-05', specNote: '效期 2028-01' },
  { code: 'EF-SLT-001', categoryKey: 'EMFOOD', name: '鹽糖', qty: 150, unit: '包', spec1: '補充電解質鹽糖', keeper: '', keeperPhone: '', locationName: '緊急物資倉庫', status: 'normal', purchaseDate: '', specNote: '' },
  { code: 'MD-FAK-001', categoryKey: 'MEDICAL', name: '急救箱', qty: 12, unit: '箱', spec1: '綜合急救箱，含止血敷料', keeper: '潘美惠', keeperPhone: '0973444555', locationName: '醫護站', status: 'normal', purchaseDate: '2024-08-14', specNote: '每季盤點耗材' },
  { code: 'MD-STR-001', categoryKey: 'MEDICAL', name: '擔架床/軟式擔架', qty: 6, unit: '副', spec1: '摺疊式軟擔架，附固定帶', keeper: '', keeperPhone: '', locationName: '醫護站', status: 'maintenance', purchaseDate: '2022-10-30', specNote: '1 副扣具鬆脫待修' },
  { code: 'DC-GWF-001', categoryKey: 'DECON', name: '重力式緊急濾水器', qty: 8, unit: '組', spec1: '重力式濾水器，日產 30L', keeper: '', keeperPhone: '', locationName: '緊急物資倉庫', status: 'normal', purchaseDate: '2024-03-22', specNote: '濾芯備品另存' },
  { code: 'OT-OTH-001', categoryKey: 'OTHER', name: '柴油儲油桶', qty: 6, unit: '個', spec1: '200L 金屬儲油桶，附油泵', keeper: '洪世昌', keeperPhone: '0940111222', locationName: '後勤倉庫 A 區', status: 'normal', purchaseDate: '2023-06-18', specNote: '危險物品分區存放' },
]

// ── 單例 state ────────────────────────────────────────────────
const store = ref<EquipmentItem[]>([])
let seeded = false

function ensureSeeded(): void {
  if (seeded) return
  store.value = SEED.map((seed, index) => ({
    id: `E-${String(index + 1).padStart(3, '0')}`,
    ...seed,
  }))
  seeded = true
}

/**
 * 今天日期（本地時區 YYYY-MM-DD）：勿用 toISOString()——其為 UTC，台灣時區早上 8 點前會差一天。
 * 具名前綴 equipment，避免與範本 useTemplateMembers 的 todayString 撞名造成 Nuxt 重複自動匯入警告（R2 P2-7）。
 */
export function equipmentTodayString(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/** 深拷貝，避免呼叫端拿到 store 內部參考 */
function cloneItem(item: EquipmentItem): EquipmentItem {
  return { ...item }
}

/** 產生流水 id：E- + 現有最大序號 +1，補零至 3 位 */
function nextId(): string {
  const maxSerial = store.value.reduce((max, item) => {
    const serial = Number(item.id.replace('E-', ''))
    return Number.isFinite(serial) ? Math.max(max, serial) : max
  }, 0)
  return `E-${String(maxSerial + 1).padStart(3, '0')}`
}

/** 類別碼-項目碼前綴，如 IT-LAP-（BR-EQ-04；「其他」分類與查無項目皆用 OTH） */
function codePrefixOf(categoryKey: string, name: string): string {
  const cat2 = EQUIPMENT_CATEGORIES.find(c => c.value === categoryKey)?.code ?? 'OT'
  const item3 = ITEM_CODE_MAP[name] ?? 'OTH'
  return `${cat2}-${item3}-`
}

/**
 * 依「類別+項目」推算下一個可用品項編碼（流水 001~999，同前綴遞增）。
 * 課堂簡化版（SCOPE Q5）：允許同編碼多筆，不做同碼累加數量。
 * categoryKey 或 name 為空時回空字串（頁面即時預覽用）。
 */
export function nextEquipmentCode(categoryKey: string, name: string): string {
  if (!categoryKey || !name.trim()) return ''
  const prefix = codePrefixOf(categoryKey, name.trim())
  const maxSeq = store.value.reduce((max, item) => {
    if (!item.code.startsWith(prefix)) return max
    const seq = Number(item.code.slice(prefix.length))
    return Number.isFinite(seq) ? Math.max(max, seq) : max
  }, 0)
  return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`
}

export function useEquipmentItems() {
  ensureSeeded() // mock 模式：同步植入 24 筆種子（前端課離線可跑）

  /** 響應式清單（列表頁以 computed 過濾/排序；對外唯讀，變更請走 create/update/remove） */
  // 後端接軌：改為 useFetch('/api/equipment/items')（GET 全量清單）— [SD 待定]
  const records = computed(() => store.value)

  // 後端接軌：GET /api/equipment/items/{id}（單筆）— [SD 待定]
  async function getById(id: string): Promise<EquipmentItem | undefined> {
    const found = store.value.find(item => item.id === id)
    return found ? cloneItem(found) : undefined
  }

  // 後端接軌：POST /api/equipment/items（id / code 一律以後端回傳為準）— [SD 待定]
  async function create(input: EquipmentItemInput): Promise<EquipmentItem> {
    const created: EquipmentItem = { ...input, id: nextId(), code: nextEquipmentCode(input.categoryKey, input.name) }
    store.value = [created, ...store.value]
    return cloneItem(created)
  }

  // 後端接軌：PUT /api/equipment/items/{id} — [SD 待定]
  // 編輯時保留原 code；分類/項目改動則重算（在「類別+項目」新前綴內取下一流水）。
  async function update(id: string, input: EquipmentItemInput): Promise<EquipmentItem> {
    const index = store.value.findIndex(item => item.id === id)
    if (index < 0) throw new Error(`找不到品項 ${id}`)
    const original = store.value[index]
    const keepCode = original.code.startsWith(codePrefixOf(input.categoryKey, input.name.trim()))
    const updated: EquipmentItem = {
      ...input,
      id,
      code: keepCode ? original.code : nextEquipmentCode(input.categoryKey, input.name),
    }
    store.value = store.value.map((item, i) => (i === index ? updated : item))
    return cloneItem(updated)
  }

  // 後端接軌：DELETE /api/equipment/items/{id} — [SD 待定]
  async function remove(id: string): Promise<void> {
    store.value = store.value.filter(item => item.id !== id)
  }

  return { records, getById, create, update, remove }
}
