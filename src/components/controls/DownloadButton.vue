<template>
  <a class="btn at-download" :class="{ disabled: isDisabled }" @click="handleDownload">
    <DownloadCloud class="icon" />
  </a>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { DownloadCloud } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')
const isDisabled = ref(false) // 初始默认启用

// 处理下载逻辑
const handleDownload = (e) => {
  e.preventDefault()
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
