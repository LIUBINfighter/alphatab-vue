<template>
  <div class="at-zoom">
    <Search class="icon" />
    <select v-model="zoom" @change="handleZoomChange">
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

const handleZoomChange = () => {
  if (alphaTabApi.value) {
    const zoomLevel = parseInt(zoom.value)
    alphaTabApi.value.settings.display.scale = zoomLevel / 100
    alphaTabApi.value.updateSettings()
    alphaTabApi.value.render()
  }
}

// 当组件挂载后同步初始缩放等级
onMounted(() => {
  if (alphaTabApi.value && alphaTabApi.value.settings.display.scale) {
    zoom.value = Math.round(alphaTabApi.value.settings.display.scale * 100)
  }
})
</script>
