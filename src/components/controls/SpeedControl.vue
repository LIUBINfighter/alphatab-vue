<template>
  <div class="at-speed-control" ref="speedControlRef">
    <div class="btn-group">
      <button 
        type="button" 
        class="btn speed-btn" 
        @click="toggleDropdown"
        :disabled="isDisabled"
      >
        <Gauge class="icon" />
        <span class="at-speed-label">{{ currentSpeed }}x</span>
      </button>
      <div class="speed-dropdown" v-if="isOpen" @click.stop>
        <div 
          v-for="speed in speedOptions" 
          :key="speed" 
          class="speed-item"
          @click="selectSpeed(speed)"
        >
          {{ speed }}x
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { Gauge } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')
const speedControlRef = ref(null)
const isOpen = ref(false)
const isDisabled = ref(false)
const currentSpeed = ref('1')
const speedOptions = [0.25, 0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2]

// 切换下拉菜单
const toggleDropdown = () => {
  if (!isDisabled.value) {
    isOpen.value = !isOpen.value
  }
}

// 选择速度
const selectSpeed = (speed) => {
  if (alphaTabApi.value) {
    alphaTabApi.value.playbackSpeed = speed
    currentSpeed.value = speed
    isOpen.value = false
  }
}

// 添加全局点击事件以关闭下拉菜单
const handleClickOutside = (event) => {
  if (speedControlRef.value && !speedControlRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  // 添加点击外部关闭下拉菜单的事件监听
  document.addEventListener('click', handleClickOutside)
  
  if (alphaTabApi.value) {
    // 同步初始速度
    if (alphaTabApi.value.playbackSpeed) {
      currentSpeed.value = alphaTabApi.value.playbackSpeed
    }
    
    // 检查是否可用
    if (alphaTabApi.value.score) {
      isDisabled.value = false
    } else {
      const scoreLoadedHandler = (score) => {
        isDisabled.value = !score
      }
      alphaTabApi.value.scoreLoaded.on(scoreLoadedHandler)
    }
  }
})

onUnmounted(() => {
  // 移除事件监听器
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.at-speed-control {
  position: relative;
}

.speed-btn {
  color: #fff;
  background: transparent;
  border: none;
  height: 40px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
}

.speed-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.at-speed-label {
  margin-left: 5px;
}

.speed-dropdown {
  position: absolute;
  bottom: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 1000;
  min-width: 100px;
}

.speed-item {
  padding: 8px 16px;
  color: #333;
  cursor: pointer;
  text-align: center;
}

.speed-item:hover {
  background-color: #f5f5f5;
}
</style>
