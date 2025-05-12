<template>
  <div class="at-layout">
    <select v-model="layout" @change="handleLayoutChange">
      <option value="horizontal">Horizontal</option>
      <option value="page">Page</option>
    </select>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'

const alphaTabApi = inject('alphaTabApi')
const layout = ref('page')

const handleLayoutChange = () => {
  if (alphaTabApi.value) {
    switch (layout.value) {
      case 'horizontal':
        alphaTabApi.value.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal
        break
      case 'page':
        alphaTabApi.value.settings.display.layoutMode = alphaTab.LayoutMode.Page
        break
    }
    alphaTabApi.value.updateSettings()
    alphaTabApi.value.render()
  }
}

// 当组件挂载后同步初始布局模式
onMounted(() => {
  if (alphaTabApi.value && alphaTabApi.value.settings.display.layoutMode) {
    layout.value = alphaTabApi.value.settings.display.layoutMode === alphaTab.LayoutMode.Horizontal 
      ? 'horizontal' 
      : 'page'
  }
})
</script>
