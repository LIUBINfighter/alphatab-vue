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
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'

const zoomLevels = [25, 50, 75, 90, 100, 110, 125, 150, 200]
const zoom = ref(100)

const handleZoomChange = () => {
  // 缩放逻辑
}
</script>
