<template>
  <div class="at-control">
    <Search class="control-icon" />
    <select
      class="control-select"
      v-model="zoom"
      @change="selectZoom(zoom)"
    >
      <option v-for="value in zoomLevels" :key="value" :value="value">
        {{ value }}%
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { Search } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')
const zoomLevels = [25, 50, 75, 90, 100, 110, 125, 150, 200]
const zoom = ref(100)

// 简化缩放选择函数
const selectZoom = (zoomLevel) => {
  if (alphaTabApi.value) {
    alphaTabApi.value.settings.display.scale = Number(zoomLevel) / 100
    alphaTabApi.value.updateSettings()
    alphaTabApi.value.render()
  }
}

onMounted(() => {
  if (alphaTabApi.value && alphaTabApi.value.settings.display.scale) {
    zoom.value = Math.round(alphaTabApi.value.settings.display.scale * 100)
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
