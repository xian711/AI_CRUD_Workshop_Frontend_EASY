/**
 * templateValidation — 純函式驗證引擎（範本用）
 * ─────────────────────────────────────────────
 * 這個檔案在範本中的角色：
 *   把「表單驗證」與「畫面呈現」徹底分離（Clean Code：業務規則與 UI 分離）。
 *   引擎本身無狀態、無 UI 依賴，只吃「表單值 + 規則」吐「欄位 → 錯誤訊息」。
 *
 * 設計要點：
 *   - 規則資料化（FieldRule[]）取代 save() 內散落的 if 判斷（Replace Magic Literal）。
 *   - 相依規則（如證號依 idType，BR-T-02）由頁面層以 rulesFor(form) 產生後傳入，
 *     引擎保持無狀態，不需認識任何特定欄位。
 *
 * 顯式匯入（審查修訂 A-9）：
 *   import { validateFields, PHONE_PATTERN, TW_ID_PATTERN, EMAIL_PATTERN } from '~/utils/templateValidation'
 */

export type FieldRule = {
  required?: boolean
  pattern?: RegExp
  maxLength?: number
  message: string
}

export type FieldRules<T> = Partial<Record<keyof T & string, FieldRule[]>>

/**
 * 電話：手機或市話都收（BR-T-03）
 *   - 手機：09 開頭共 10 碼，中間可加空白或減號（0912345678、0912-345-678、0912 345 678）
 *   - 市話：區碼開頭，區碼可加括號，中間可加空白或減號；連區碼共 9～10 碼（02-1234-5678、(02) 1234-5678、089-123456）
 *   - 不收：國碼 +886、全形數字、分機（要收的話是業務決定，先寫進 SPEC 再改這裡）
 * 要不要把手機、市話拆成兩欄，是業務決定：規格沒寫就在釐清時問。
 */
export const PHONE_PATTERN = /^(09\d{2}[\s-]?\d{3}[\s-]?\d{3}|(?=(?:\D*\d){9,10}\D*$)(\(0[2-8]\d{0,2}\)|0[2-8]\d{0,2})[\s-]?\d{2,4}[\s-]?\d{3,4})$/
/** 身分證：1 碼大寫英文 + 性別碼(1/2) + 8 碼數字（BR-T-02） */
export const TW_ID_PATTERN = /^[A-Z][12]\d{8}$/
/** Email：基本格式（BR-T-01：選填，但填了就必須合格） */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** 空值判定：空字串、null/undefined、或空陣列 */
function isEmptyValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length === 0
  return value === '' || value === null || value === undefined
}

/**
 * 逐欄套用規則，回傳 { 欄位名: 第一條未通過訊息 }；全部通過則回傳空物件。
 * BR-T-01：空值且該欄非 required 時跳過格式檢查（例：Email 未填不報錯）。
 */
export function validateFields<T extends Record<string, unknown>>(
  form: T,
  rules: FieldRules<T>,
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const field of Object.keys(rules) as (keyof T & string)[]) {
    const fieldRules = rules[field]
    if (!fieldRules) continue

    const raw = form[field]
    const value = typeof raw === 'string' ? raw.trim() : raw
    const empty = isEmptyValue(value)

    for (const rule of fieldRules) {
      if (rule.required && empty) {
        errors[field] = rule.message
        break
      }
      if (empty) continue // 非必填的空值 → 跳過長度/格式檢查
      if (rule.maxLength !== undefined && String(value).length > rule.maxLength) {
        errors[field] = rule.message
        break
      }
      if (rule.pattern && !rule.pattern.test(String(value))) {
        errors[field] = rule.message
        break
      }
    }
  }

  return errors
}
