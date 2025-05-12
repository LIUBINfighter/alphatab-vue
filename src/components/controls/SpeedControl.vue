<template>
  <div class="at-control">
    <Gauge class="control-icon" />
    <select
      class="control-select"
      v-model="currentSpeed"
      @change="selectSpeed(currentSpeed)"
      :disabled="isDisabled"
    >
      <option v-for="speed in speedOptions" :key="speed" :value="speed">
        {{ speed }}x
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { Gauge } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')
const isDisabled = ref(false)
const currentSpeed = ref('1')
const speedOptions = [0.25, 0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2]

// 选择速度
const selectSpeed = (speed) => {
  if (alphaTabApi.value) {
    alphaTabApi.value.playbackSpeed = Number(speed)
  }
}

onMounted(() => {
  if (alphaTabApi.value) {
    if (alphaTabApi.value.playbackSpeed) {
      currentSpeed.value = alphaTabApi.value.playbackSpeed
    }
    if (alphaTabApi.value.score) {
      isDisabled.value = false
    }
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

.control-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-select option {
  background-color: #2c3e50;
  color: #fff;
}
</style>
