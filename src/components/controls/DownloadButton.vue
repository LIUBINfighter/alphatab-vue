<template>
  <a class="btn at-download" :class="{ disabled: isDisabled }" @click="handleDownload">
    <DownloadCloud class="icon" />
  </a>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { DownloadCloud } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')
const isDisabled = ref(true) // 初始状态禁用，直到谱子加载完成

// 处理下载逻辑
const handleDownload = (e) => {
  e.stopPropagation()
  if (isDisabled.value || !alphaTabApi.value || !alphaTabApi.value.score) return
  
  try {
    // 创建GP7导出器
    const exporter = new alphaTab.exporter.Gp7Exporter()
    const data = exporter.export(alphaTabApi.value.score, alphaTabApi.value.settings)
    
    // 创建下载链接
    const a = document.createElement('a')
    const fileName = alphaTabApi.value.score.title && alphaTabApi.value.score.title.length > 0 
      ? alphaTabApi.value.score.title + '.gp' 
      : 'song.gp'
    
    a.download = fileName
    a.href = URL.createObjectURL(new Blob([data]))
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch (error) {
    console.error('Failed to download file:', error)
  }
}

// 监听相关事件
let scoreLoadedHandler = null

onMounted(() => {
  if (alphaTabApi.value) {
    // 当谱子加载完成后启用按钮
    scoreLoadedHandler = (score) => {
      isDisabled.value = !score
    }
    alphaTabApi.value.scoreLoaded.on(scoreLoadedHandler)
  }
})

onUnmounted(() => {
  // 清理事件监听器
  if (alphaTabApi.value && scoreLoadedHandler) {
    alphaTabApi.value.scoreLoaded.off(scoreLoadedHandler)
  }
})
</script>

<style scoped>
.disabled {
  opacity: 0.5;
  cursor: not-allowed !important;
}
</style>
