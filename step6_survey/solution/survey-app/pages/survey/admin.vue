<!--
  課程回饋問卷 — 回覆管理頁（/survey/admin）
  ────────────────────────────────────────────────
  由 pages/template/crud/index.vue 複製改名精簡而來：主要動作 Teleport 至麵包屑、
  桌機表格 / 手機卡片資訊等價、空狀態不顯示空表格（NFR-4）、危險操作二次確認（BR-5）。

  本版 PRD 範圍只做「看全部 / 匯出 CSV / 清空全部」，
  故刻意不掛篩選、排序、分頁（useTemplateListPage / useTableSort）——不寫用不到的死碼。
-->
<template>
  <div class="space-y-lg">
    <!-- 主要動作一律 AppSafeTeleport 到麵包屑（hard-load 安全） -->
    <AppSafeTeleport to="#breadcrumb-actions">
      <UButton
        color="secondary"
        variant="outline"
        size="md"
        icon="i-heroicons-arrow-down-tray"
        :disabled="responses.length === 0"
        @click="handleExport"
      >
        匯出 CSV
      </UButton>
      <UButton
        color="error"
        variant="solid"
        size="md"
        icon="i-heroicons-trash"
        :disabled="responses.length === 0"
        @click="requestClear"
      >
        清空全部回覆
      </UButton>
    </AppSafeTeleport>

    <!-- 工具列：筆數 -->
    <div class="flex flex-wrap items-center justify-between gap-sm">
      <p class="text-body-medium text-on-surface-variant">共 {{ responses.length }} 筆回覆</p>
      <p class="text-label-small text-on-surface-variant">
        本版無後端，回覆只存在這台裝置的瀏覽器裡；換裝置或清除瀏覽器資料會看不到。
      </p>
    </div>

    <!-- 桌機：表格（UCard 無 padding prop，去除內距須用 :ui 覆蓋 body padding） -->
    <CardOutlined v-if="responses.length > 0" :ui="{ body: { padding: 'p-0' } }" class="hidden md:block">
      <div class="overflow-x-auto">
        <table class="w-full text-body-medium">
          <thead class="bg-surface-variant text-label-small text-on-surface-variant">
            <tr>
              <th class="px-3 py-2 text-left">送出時間</th>
              <th class="px-3 py-2 text-left">姓名</th>
              <th class="px-3 py-2 text-left">服務單位</th>
              <th class="px-3 py-2 text-left">滿意度</th>
              <th class="px-3 py-2 text-left">最有收穫的段落</th>
              <th class="px-3 py-2 text-left">課程難度</th>
              <th class="px-3 py-2 text-left">最想先導入</th>
              <th class="px-3 py-2 text-left">推薦</th>
              <th class="px-3 py-2 text-left">建議與想法</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant">
            <tr v-for="(row, index) in responses" :key="row.id" :class="rowClass(index)">
              <td class="whitespace-nowrap px-3 py-2.5 font-mono text-on-surface-variant">{{ row.submittedAt }}</td>
              <td class="px-3 py-2.5 font-emphasis text-on-surface">{{ displayName(row) }}</td>
              <td class="px-3 py-2.5 text-on-surface">{{ row.organization }}</td>
              <td class="px-3 py-2.5 font-mono text-on-surface">{{ row.rating }}</td>
              <td class="px-3 py-2.5 text-on-surface">{{ row.bestSection }}</td>
              <td class="px-3 py-2.5 text-on-surface">{{ row.difficulty }}</td>
              <td class="px-3 py-2.5 text-on-surface">{{ row.adoptPlan }}</td>
              <td class="px-3 py-2.5"><SurveyRecommendBadge :value="row.willRecommend" /></td>
              <td class="max-w-xs truncate px-3 py-2.5 text-on-surface-variant" :title="row.suggestion">
                {{ row.suggestion || '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardOutlined>

    <!-- 手機：卡片（與桌機表格資訊等價） -->
    <div v-if="responses.length > 0" class="space-y-sm md:hidden">
      <div
        v-for="row in responses"
        :key="`m-${row.id}`"
        class="rounded-lg border border-outline-variant bg-surface p-md"
      >
        <div class="flex items-start justify-between gap-sm">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-xs">
              <span class="font-emphasis text-on-surface">{{ displayName(row) }}</span>
              <UBadge color="secondary" variant="soft" size="xs">{{ row.organization }}</UBadge>
            </div>
            <div class="mt-1 text-label-small text-on-surface-variant">
              滿意度 <span class="font-mono text-on-surface">{{ row.rating }}</span> ／ 難度 {{ row.difficulty }}
            </div>
            <div class="mt-1 text-label-small text-on-surface-variant">最有收穫：{{ row.bestSection }}</div>
            <div class="mt-1 text-label-small text-on-surface-variant">最想先導入：{{ row.adoptPlan }}</div>
            <p v-if="row.suggestion" class="mt-1 whitespace-pre-wrap text-body-medium text-on-surface">
              {{ row.suggestion }}
            </p>
            <div class="mt-1 font-mono text-label-small text-on-surface-variant">{{ row.submittedAt }}</div>
          </div>
          <SurveyRecommendBadge :value="row.willRecommend" />
        </div>
      </div>
    </div>

    <!-- 空狀態（NFR-4：沒有回覆時不顯示空表格） -->
    <CardOutlined v-if="responses.length === 0">
      <div class="flex flex-col items-center justify-center gap-sm py-xl text-on-surface-variant">
        <UIcon name="i-heroicons-inbox" class="h-10 w-10 opacity-40" />
        <p class="text-headline-medium font-heavy text-on-surface">目前還沒有任何回覆</p>
        <p class="text-body-medium">把填答網址發給學員，收到的回覆會顯示在這裡。</p>
        <UButton color="primary" variant="solid" size="md" icon="i-heroicons-pencil-square" to="/survey">
          前往填答頁
        </UButton>
      </div>
    </CardOutlined>

    <!-- 清空全部確認（BR-5：確認鈕文字寫明動作；confirm 不自動關閉，由 confirmClear 自行關閉） -->
    <AppConfirmModal
      v-model="showClearModal"
      variant="danger"
      title="清空全部回覆"
      :message="`確定要清空全部 ${responses.length} 筆問卷回覆嗎？此動作無法復原，建議先匯出 CSV 備份。`"
      confirm-text="清空全部回覆"
      @confirm="confirmClear"
    />
  </div>
</template>

<script setup lang="ts">
import {
  useSurveyResponses,
  surveyDateStamp,
  type SurveyResponse,
} from '~/composables/useSurveyResponses'
import { exportCsv, type CsvColumn } from '~/utils/templateCsv'

definePageMeta({ layout: 'template', pageTitle: '回覆管理' })

const toast = useToast()
const { responses, clearAll } = useSurveyResponses()

/** 姓名選填，未填時顯示「匿名」而非空白（PRD 第 1 題） */
const ANONYMOUS_LABEL = '匿名'
function displayName(row: SurveyResponse): string {
  return row.respondentName || ANONYMOUS_LABEL
}

// 斑馬紋（比照範本列表頁；純 SYS token 別名，無硬編碼色碼）
function rowClass(index: number): string {
  return index % 2 === 1 ? 'bg-surface-variant' : 'bg-surface'
}

// ── 匯出 CSV（BR-6：UTF-8 BOM 由 exportCsv 負責，檔名含日期） ──
function handleExport() {
  const columns: CsvColumn<SurveyResponse>[] = [
    { label: '編號', value: row => row.id },
    { label: '送出時間', value: row => row.submittedAt },
    { label: '姓名', value: row => row.respondentName },
    { label: '服務單位', value: row => row.organization },
    { label: '整體滿意度', value: row => row.rating },
    { label: '最有收穫的段落', value: row => row.bestSection },
    { label: '課程難度', value: row => row.difficulty },
    { label: '回公司最想先導入', value: row => row.adoptPlan },
    { label: '建議與想法', value: row => row.suggestion },
    { label: '願意推薦給同事', value: row => row.willRecommend },
  ]
  // 本地時區日期，與 submittedAt 寫入邏輯一致（勿用 toISOString()，UTC 會差一天）
  exportCsv(`課程回饋問卷-回覆-${surveyDateStamp()}.csv`, columns, responses.value)
  toast.add({ title: `已匯出 ${responses.value.length} 筆`, color: 'green', icon: 'i-heroicons-check-circle' })
}

// ── 清空全部（危險操作 → 二次確認 → 清空 → toast，BR-5） ──
const showClearModal = ref(false)
function requestClear() {
  showClearModal.value = true
}
async function confirmClear() {
  const count = responses.value.length
  await clearAll()
  showClearModal.value = false
  toast.add({ title: `已清空 ${count} 筆回覆`, color: 'green', icon: 'i-heroicons-check-circle' })
}
</script>
