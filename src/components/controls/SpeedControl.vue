<template>
  <div class="at-speed-control">
    <div class="btn-group">
      <button 
        type="button" 
        class="btn speed-btn" 
        @click="isOpen = !isOpen"
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
import { ref, inject, onClickOutside, onMounted, onUnmounted } from 'vue'
import { Gauge } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')
const isOpen = ref(false)
const isDisabled = ref(true)
const currentSpeed = ref('1')
const speedOptions = [0.25, 0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2]

// 关闭下拉菜单的ref
const speedControlRef = ref(null)
if (typeof onClickOutside === 'function') {
  onClickOutside(speedControlRef, () => {
    isOpen.value = false
  })
}

// 选择速度
const selectSpeed = (speed) => {
  if (alphaTabApi.value) {
    alphaTabApi.value.playbackSpeed = speed
    currentSpeed.value = speed
    isOpen.value = false
  }
}

// 监听相关事件
let scoreLoadedHandler = null
let playerReadyHandler = null

onMounted(() => {
  if (alphaTabApi.value) {
    // 当谱子加载完成后启用控件
    scoreLoadedHandler = (score) => {
      isDisabled.value = !score
    }
    alphaTabApi.value.scoreLoaded.on(scoreLoadedHandler)
    
    // 当播放器准备好时启用控件
    playerReadyHandler = (ready) => {
      isDisabled.value = !ready
    }
    alphaTabApi.value.playerReady.on(playerReadyHandler)
    
    // 同步初始速度
    currentSpeed.value = alphaTabApi.value.playbackSpeed || 1
  }
})

onUnmounted(() => {
  // 清理事件监听器
  if (alphaTabApi.value) {
    if (scoreLoadedHandler) {
      alphaTabApi.value.scoreLoaded.off(scoreLoadedHandler)
    }
    if (playerReadyHandler) {
      alphaTabApi.value.playerReady.off(playerReadyHandler)
    }
  }
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
