<template>
  <div class="at-control">
    <LayoutGrid class="control-icon" />
    <select
      class="control-select"
      v-model="layout"
      @change="selectLayout(layout)"
    >
      <option v-for="(label, value) in layoutLabels" :key="value" :value="value">
        {{ label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { LayoutGrid } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')
const layout = ref('page')
const layoutLabels = {
  'horizontal': 'Horizontal',
  'page': 'Page'
}

// 简化选择布局函数
const selectLayout = (selectedLayout) => {
  if (alphaTabApi.value) {
    alphaTabApi.value.settings.display.layoutMode = 
      selectedLayout === 'horizontal' ? alphaTab.LayoutMode.Horizontal : alphaTab.LayoutMode.Page
    alphaTabApi.value.updateSettings()
    alphaTabApi.value.render()
  }
}

onMounted(() => {
  if (alphaTabApi.value && alphaTabApi.value.settings.display.layoutMode) {
    layout.value = alphaTabApi.value.settings.display.layoutMode === alphaTab.LayoutMode.Horizontal 
      ? 'horizontal' 
      : 'page'
  }
})
</script>

<style scoped>
.at-control {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
}

.control-icon {
  width: 20px;
  height: 20px;
  color: #fff;
}

.control-select {
  appearance: none;
  background-color: transparent;
  color: #fff;
  border: none;
  padding: 4px 24px 4px 8px;
  font-size: 14px;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 2px center;
  background-size: 16px;
}

.control-select option {
  background-color: #2c3e50;
  color: #fff;
}
</style>
