<!--
  SurveyRecommendBadge — 「願意推薦給同事」徽章（是 / 否）

  由 components/template/TemplateStatusBadge.vue 複製改名而來：列舉值是實體特有的，
  值 → 樣式以具名對照表定義（Replace Conditional with Lookup），
  避免各處散落 willRecommend === '是' ? ... 的條件判斷。
  依 design-system-summary：正向 → success；中性 → neutral 膠囊（bg-surface-variant）。
-->
<template>
  <UBadge v-if="meta.color" :color="meta.color" variant="soft" size="sm">{{ meta.label }}</UBadge>
  <span
    v-else
    class="inline-flex items-center rounded-full bg-surface-variant px-2 py-0.5 text-label-small font-emphasis text-on-surface-variant"
  >{{ meta.label }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SurveyRecommend } from '~/composables/useSurveyResponses'

const props = defineProps<{ value: SurveyRecommend }>()

// 值 → 樣式對照表：color 為 null 時走 neutral 膠囊
const RECOMMEND_META: Record<SurveyRecommend, { label: string; color: 'success' | null }> = {
  是: { label: '願意推薦', color: 'success' },
  否: { label: '暫不推薦', color: null },
}
const meta = computed(() => RECOMMEND_META[props.value])
</script>
