<!--
  課程回饋問卷 — 填答頁（/survey）
  ────────────────────────────────────────────────
  由 pages/template/crud/[id].vue 的「新增模式」複製改名精簡而來：
  表單分區 + 欄位級驗證 + 送出時聚焦第一個錯誤欄位 + 主要動作 Teleport 至麵包屑。

  設計要點：
    - 驗證交給共用純函式 validateFields（utils/templateValidation.ts），本頁只提供規則資料。
    - 送出走資料層 submit()（Promise），未來換真 API 本頁一行都不用改（BR-7）。
    - 送出中以 loading + guard 雙重防重複點擊（BR-3）。
-->
<template>
  <div class="space-y-lg">
    <!-- 主要動作一律 AppSafeTeleport 到麵包屑（hard-load 安全）；麵包屑不在捲動區內，恆可見 -->
    <AppSafeTeleport to="#breadcrumb-actions">
      <UButton
        color="primary"
        variant="solid"
        size="md"
        icon="i-heroicons-paper-airplane"
        :loading="submitting"
        :disabled="submitting"
        @click="submitSurvey"
      >
        {{ submitting ? '送出中' : '送出問卷' }}
      </UButton>
    </AppSafeTeleport>

    <!-- 送出成功訊息（BR-2）：表單已清空，可以再填下一份 -->
    <CardOutlined v-if="justSubmitted">
      <div class="flex items-start gap-sm">
        <UIcon name="i-heroicons-check-circle" class="mt-0.5 h-6 w-6 shrink-0 text-[var(--ui-sys-color-success)]" />
        <div>
          <p class="text-body-large font-heavy text-on-surface">已收到你的回饋，感謝填寫！</p>
          <p class="mt-xs text-body-medium text-on-surface-variant">
            表單已清空，可以再填下一份。回覆只會存在這台裝置的瀏覽器裡。
          </p>
        </div>
      </div>
    </CardOutlined>

    <!-- 說明卡 -->
    <CardOutlined>
      <p class="text-body-medium text-on-surface-variant">
        感謝你參加這門課。以下 8 題大約 2 分鐘可以填完，標
        <span class="text-[var(--ui-sys-color-error)]">*</span>
        的是必填。
      </p>
    </CardOutlined>

    <CardOutlined>
      <div class="space-y-lg">
        <!-- ===== 基本資料 ===== -->
        <section>
          <h3 class="mb-md border-b border-outline-variant pb-xs text-body-medium font-heavy text-on-surface-variant">
            基本資料
          </h3>
          <div class="grid grid-cols-1 gap-md md:grid-cols-2">
            <SurveyFormField label="1. 姓名" name="respondentName" hint="選填，不填就是匿名回饋" :error="fieldErrors.respondentName">
              <UInput
                v-model="form.respondentName"
                placeholder="請輸入姓名（選填）"
                class="w-full"
                :aria-describedby="fieldErrors.respondentName ? 'respondentName-error' : undefined"
              />
            </SurveyFormField>
            <SurveyFormField label="2. 服務單位" name="organization" required :hint="`上限 ${ORGANIZATION_MAX_LENGTH} 字`" :error="fieldErrors.organization">
              <UInput
                v-model="form.organization"
                placeholder="請輸入服務單位"
                class="w-full"
                :aria-describedby="fieldErrors.organization ? 'organization-error' : undefined"
              />
            </SurveyFormField>
          </div>
        </section>

        <!-- ===== 課程回饋 ===== -->
        <section>
          <h3 class="mb-md border-b border-outline-variant pb-xs text-body-medium font-heavy text-on-surface-variant">
            課程回饋
          </h3>
          <div class="grid grid-cols-1 gap-md md:grid-cols-2">
            <SurveyFormField label="3. 整體滿意度" name="rating" required hint="5 = 非常滿意" :error="fieldErrors.rating">
              <!-- USelectMenu 的 attrs 會 fallthrough 到觸發按鈕，aria-describedby 可正確關聯 -->
              <USelectMenu
                v-model="form.rating"
                :options="ratingOptions"
                value-attribute="value"
                option-attribute="label"
                placeholder="請選擇滿意度"
                class="w-full"
                :aria-describedby="fieldErrors.rating ? 'rating-error' : undefined"
              />
            </SurveyFormField>
            <SurveyFormField label="4. 最有收穫的段落" name="bestSection" required :error="fieldErrors.bestSection">
              <USelectMenu
                v-model="form.bestSection"
                :options="bestSectionOptions"
                placeholder="請選擇一個段落"
                class="w-full"
                :aria-describedby="fieldErrors.bestSection ? 'bestSection-error' : undefined"
              />
            </SurveyFormField>
            <SurveyFormField label="5. 課程難度" name="difficulty" required :error="fieldErrors.difficulty">
              <USelectMenu
                v-model="form.difficulty"
                :options="difficultyOptions"
                placeholder="請選擇難度"
                class="w-full"
                :aria-describedby="fieldErrors.difficulty ? 'difficulty-error' : undefined"
              />
            </SurveyFormField>
            <SurveyFormField label="6. 回公司最想先導入" name="adoptPlan" required :error="fieldErrors.adoptPlan">
              <USelectMenu
                v-model="form.adoptPlan"
                :options="adoptPlanOptions"
                placeholder="請選擇一項"
                class="w-full"
                :aria-describedby="fieldErrors.adoptPlan ? 'adoptPlan-error' : undefined"
              />
            </SurveyFormField>
          </div>
        </section>

        <!-- ===== 其他 ===== -->
        <section>
          <h3 class="mb-md border-b border-outline-variant pb-xs text-body-medium font-heavy text-on-surface-variant">
            其他
          </h3>
          <SurveyFormField label="7. 建議與想法" name="suggestion" hint="選填" :error="fieldErrors.suggestion">
            <UTextarea
              v-model="form.suggestion"
              :rows="4"
              placeholder="想給講師或主辦方的話（選填）"
              class="w-full"
              :aria-describedby="fieldErrors.suggestion ? 'suggestion-error' : undefined"
            />
            <!-- 剩餘字數（PRD 第 7 題要求）：超出時轉紅字，與下方錯誤訊息呼應 -->
            <p
              class="mt-xs text-right text-label-small"
              :class="suggestionRemaining < 0 ? 'text-[var(--ui-sys-color-error)]' : 'text-on-surface-variant'"
            >
              還可輸入 {{ suggestionRemaining }} 字（上限 {{ SUGGESTION_MAX_LENGTH }} 字）
            </p>
          </SurveyFormField>
          <div class="mt-md md:w-1/2 md:pr-md">
            <SurveyFormField label="8. 願意推薦給同事" name="willRecommend" required :error="fieldErrors.willRecommend">
              <USelectMenu
                v-model="form.willRecommend"
                :options="recommendOptions"
                placeholder="請選擇是或否"
                class="w-full"
                :aria-describedby="fieldErrors.willRecommend ? 'willRecommend-error' : undefined"
              />
            </SurveyFormField>
          </div>
        </section>
      </div>
    </CardOutlined>
  </div>
</template>

<script setup lang="ts">
import {
  useSurveyResponses,
  emptySurveyDraft,
  toSurveyInput,
  ORGANIZATION_MAX_LENGTH,
  SUGGESTION_MAX_LENGTH,
  SURVEY_RATING_OPTIONS,
  SURVEY_BEST_SECTION_OPTIONS,
  SURVEY_DIFFICULTY_OPTIONS,
  SURVEY_ADOPT_PLAN_OPTIONS,
  SURVEY_RECOMMEND_OPTIONS,
  type SurveyResponseDraft,
} from '~/composables/useSurveyResponses'
import { validateFields, type FieldRules } from '~/utils/templateValidation'

definePageMeta({ layout: 'template', pageTitle: '填寫問卷' })

const toast = useToast()
const { submit } = useSurveyResponses()

// ── 下拉選項 ──
const ratingOptions = SURVEY_RATING_OPTIONS
const bestSectionOptions = SURVEY_BEST_SECTION_OPTIONS
const difficultyOptions = SURVEY_DIFFICULTY_OPTIONS
const adoptPlanOptions = SURVEY_ADOPT_PLAN_OPTIONS
const recommendOptions = SURVEY_RECOMMEND_OPTIONS

// ── 狀態 ──
const form = reactive<SurveyResponseDraft>(emptySurveyDraft())
const fieldErrors = reactive<Record<string, string>>({})
const submitting = ref(false)
const justSubmitted = ref(false)

const suggestionRemaining = computed(() => SUGGESTION_MAX_LENGTH - form.suggestion.length)

// ── 錯誤清除：只清「被變更的欄位」的錯誤，未修正的欄位錯誤保留（BR-1） ──
function clearErrors() {
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]
}
watch(
  () => ({ ...form }),
  (next, prev) => {
    for (const key of Object.keys(next) as (keyof SurveyResponseDraft)[]) {
      if (next[key] !== prev[key]) delete fieldErrors[key]
    }
  },
)

// ── 驗證規則（規則資料化；本問卷無相依規則，故為模組層常數） ──
const SURVEY_RULES: FieldRules<SurveyResponseDraft> = {
  organization: [
    { required: true, message: '請輸入服務單位' },
    { maxLength: ORGANIZATION_MAX_LENGTH, message: `服務單位不可超過 ${ORGANIZATION_MAX_LENGTH} 字` },
  ],
  rating: [{ required: true, message: '請選擇整體滿意度' }],
  bestSection: [{ required: true, message: '請選擇最有收穫的段落' }],
  difficulty: [{ required: true, message: '請選擇課程難度' }],
  adoptPlan: [{ required: true, message: '請選擇回公司最想先導入的事' }],
  suggestion: [{ maxLength: SUGGESTION_MAX_LENGTH, message: `建議與想法不可超過 ${SUGGESTION_MAX_LENGTH} 字` }],
  willRecommend: [{ required: true, message: '請選擇是否願意推薦給同事' }],
}

// 錯誤欄位聚焦順序＝題目順序（BR-1：聚焦第一個錯誤欄位）
const FIELD_ORDER = [
  'respondentName', 'organization', 'rating', 'bestSection',
  'difficulty', 'adoptPlan', 'suggestion', 'willRecommend',
]

function focusFirstError(errors: Record<string, string>) {
  const key = FIELD_ORDER.find(field => errors[field])
  if (!key) return
  nextTick(() => {
    const host = document.querySelector(`[data-field="${key}"]`)
    host?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    host?.querySelector<HTMLElement>('input, select, textarea, button')?.focus()
  })
}

// ── 送出（BR-1 / BR-2 / BR-3） ──
async function submitSurvey() {
  if (submitting.value) return // 防重複點擊：連點時後續呼叫直接短路
  justSubmitted.value = false

  const errors = validateFields(form, SURVEY_RULES)
  clearErrors()
  if (Object.keys(errors).length > 0) {
    Object.assign(fieldErrors, errors)
    focusFirstError(errors)
    toast.add({
      title: `請修正 ${Object.keys(errors).length} 個欄位`,
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    })
    return
  }

  const payload = toSurveyInput(form)
  if (!payload) return // 理論上不會發生（驗證已過），保留 guard 避免型別與規則不同步時默默存錯資料

  submitting.value = true
  try {
    await submit(payload)
    Object.assign(form, emptySurveyDraft())
    justSubmitted.value = true
    toast.add({ title: '問卷已送出，感謝你的回饋', color: 'green', icon: 'i-heroicons-check-circle' })
  } catch {
    toast.add({ title: '送出失敗，請稍後再試', color: 'red', icon: 'i-heroicons-exclamation-triangle' })
  } finally {
    submitting.value = false
  }
}
</script>
