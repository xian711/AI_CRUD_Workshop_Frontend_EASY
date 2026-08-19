<!--
  SurveyFormField — 問卷欄位外框（label + 必填紅星 + slot + 欄位級錯誤紅字）

  由 components/template/TemplateFormField.vue 複製改名而來：內容雖然通用，
  但範本心法刻意做命名空間隔離，避免「A 模組改了共用元件、B 模組畫面壞掉」的連鎖。

  設計要點：
    - 根元素渲染 :data-field="name"，供送出失敗時 document.querySelector 聚焦第一個錯誤欄位（BR-1）。
    - 錯誤訊息帶 :id，供輸入元件以 aria-describedby 關聯。
-->
<template>
  <div :data-field="name">
    <!-- 用 span 而非 label：無 for 綁定的 label 是假語意，反而誤導輔助科技 -->
    <span class="block text-body-medium font-emphasis text-on-surface mb-xs">
      {{ label }}
      <span v-if="required" class="text-[var(--ui-sys-color-error)]">*</span>
    </span>
    <p v-if="hint" class="mb-xs text-label-small text-on-surface-variant">{{ hint }}</p>
    <slot />
    <p
      v-if="error"
      :id="`${name}-error`"
      class="mt-xs text-label-small text-[var(--ui-sys-color-error)]"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  /** 欄位鍵，渲染為 data-field 供錯誤聚焦定位 */
  name: string
  required?: boolean
  error?: string
  /** 題目補充說明（例：「5 = 非常滿意」），顯示於 label 下方 */
  hint?: string
}

withDefaults(defineProps<Props>(), {
  required: false,
  error: '',
  hint: '',
})
</script>
