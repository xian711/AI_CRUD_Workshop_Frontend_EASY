<!--
  首頁：直接導向課程回饋問卷填答頁（/survey）。
  ssr:false（純 SPA），於 client 端 setup 立即 replace 導頁，不留歷史記錄。
  layout:false 避免導頁瞬間閃過任何 layout。
-->
<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
await navigateTo('/survey', { replace: true })
</script>
