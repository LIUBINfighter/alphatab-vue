<template>
  <div class="at-layout">
    <select v-model="layout" @change="handleLayoutChange">
      <option value="horizontal">Horizontal</option>
      <option value="page">Page</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const layout = ref('page')

const handleLayoutChange = () => {
  // 布局切换逻辑
}
</script>
