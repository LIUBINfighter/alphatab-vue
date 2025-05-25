<template>
  <div class="at-control">
    <Music class="control-icon" />
    <select
      class="control-select"
      v-model="selectedTrackIndex"
      @change="selectTrack"
    >
      <option value="-1">所有音轨</option>
      <option v-for="track in tracks" :key="track.index" :value="track.index">
        {{ track.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted, watch } from 'vue'
import { Music } from 'lucide-vue-next'

const emit = defineEmits(['track-selected'])

const alphaTabApi = inject('alphaTabApi')
const tracks = ref([])
const selectedTrackIndex = ref(-1)

// 用于存储事件监听器引用，以便在组件卸载时移除它们
const listeners = {
  scoreLoaded: null,
  renderStarted: null
}

const selectTrack = () => {
  if (!alphaTabApi.value || !alphaTabApi.value.score) return

  // Render selected tracks
  if (selectedTrackIndex.value === -1) {
    // Render all tracks
    console.log('正在渲染所有音轨:', alphaTabApi.value.score.tracks.length, '个音轨')
    alphaTabApi.value.renderTracks(alphaTabApi.value.score.tracks)
    
    // 验证是否所有音轨都被正确渲染
    setTimeout(() => {
      console.log('渲染后检查:', alphaTabApi.value.tracks.length, '个音轨被渲染')
      if (alphaTabApi.value.tracks.length !== alphaTabApi.value.score.tracks.length) {
        console.warn('音轨数量不匹配，可能没有全部渲染')
      }
    }, 100)

    // 发出选择所有音轨的事件，用于和 TrackSidebar 联动
    emit('track-selected', { index: -1 })
  } else {
    // Render only selected track
    const track = alphaTabApi.value.score.tracks.find(t => t.index === selectedTrackIndex.value)
    if (track) {
      console.log('正在渲染单个音轨:', track.name)
      alphaTabApi.value.renderTracks([track])
      
      // 发出选择单个音轨的事件，用于和 TrackSidebar 联动
      emit('track-selected', track)
    }
  }
}

// 当乐谱加载完成时更新音轨列表
const onScoreLoaded = (score) => {
  console.log('Score loaded with tracks:', score?.tracks)
  
  if (score) {
    tracks.value = score.tracks
    selectedTrackIndex.value = -1
  } else {
    tracks.value = []
    selectedTrackIndex.value = -1
  }
}

// 当渲染的音轨状态变化时更新选择器状态
const onTrackStateChanged = () => {
  if (!alphaTabApi.value?.score) return
  
  const renderedTracks = alphaTabApi.value.tracks
  console.log('Track state changed. Rendered tracks:', renderedTracks.length)
  
  if (renderedTracks.length === alphaTabApi.value.score.tracks.length) {
    selectedTrackIndex.value = -1
  } else if (renderedTracks.length === 1) {
    selectedTrackIndex.value = renderedTracks[0].index
  }
}

onMounted(() => {
  console.log('SingleTrack mounted, API available:', !!alphaTabApi.value)
  
  // 设置观察者监听 alphaTabApi 的变化，以防它是异步加载的
  watch(() => alphaTabApi.value, (api) => {
    if (!api) return
    
    console.log('AlphaTab API became available')
    
    // 移除之前的监听器（如果有）
    if (listeners.scoreLoaded) {
      api.scoreLoaded.off(listeners.scoreLoaded)
    }
    if (listeners.renderStarted) {
      api.renderStarted.off(listeners.renderStarted)
    }
    
    // 添加新的监听器
    listeners.scoreLoaded = onScoreLoaded
    listeners.renderStarted = onTrackStateChanged
    
    api.scoreLoaded.on(listeners.scoreLoaded)
    api.renderStarted.on(listeners.renderStarted)
    
    // 如果乐谱已加载，立即初始化
    if (api.score) {
      onScoreLoaded(api.score)
    }
  }, { immediate: true })
})

onUnmounted(() => {
  // 在组件卸载时清理事件监听器
  if (alphaTabApi.value) {
    if (listeners.scoreLoaded) {
      alphaTabApi.value.scoreLoaded.off(listeners.scoreLoaded)
    }
    if (listeners.renderStarted) {
      alphaTabApi.value.renderStarted.off(listeners.renderStarted)
    }
  }
  console.log('SingleTrack unmounted, listeners cleaned up')
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