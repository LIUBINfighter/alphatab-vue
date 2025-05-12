<template>
  <a class="btn at-stop" 
     :class="{ disabled: isDisabled }" 
     @click="handleStop"
     title="Stop playback"
  >
    <StopCircle class="icon" />
  </a>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { StopCircle } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')
const isDisabled = ref(false) // 初始默认启用

// 处理停止播放逻辑
const handleStop = (e) => {
  e.preventDefault()
  if (!isDisabled.value && alphaTabApi.value) {
    alphaTabApi.value.stop()
  }
}

onMounted(() => {
  if (alphaTabApi.value) {
    // 监听谱子加载状态，确定按钮是否应该被禁用
    const onScoreLoaded = (score) => {
      isDisabled.value = !score
    }
    
    // 检查当前是否已加载谱子
    if (!alphaTabApi.value.score) {
      isDisabled.value = true
      alphaTabApi.value.scoreLoaded.on(onScoreLoaded)
    }
    
    // 清理事件
    onUnmounted(() => {
      alphaTabApi.value.scoreLoaded.off(onScoreLoaded)
    })
  }
})
</script>

<style scoped>
.disabled {
  opacity: 0.5;
  cursor: not-allowed !important;
}
</style>
