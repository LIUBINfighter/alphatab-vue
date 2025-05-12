<template>
  <div class="at-zoom-control" ref="zoomControlRef">
    <div class="btn-group">
      <button 
        type="button" 
        class="btn zoom-btn" 
        @click="toggleDropdown"
      >
        <Search class="icon" />
        <span class="at-zoom-label">{{ zoom }}%</span>
      </button>
      <div class="zoom-dropdown" v-if="isOpen" @click.stop>
        <div 
          v-for="value in zoomLevels" 
          :key="value" 
          class="zoom-item"
          @click="selectZoom(value)"
        >
          {{ value }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { Search } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')
const zoomControlRef = ref(null)
const isOpen = ref(false)
const zoomLevels = [25, 50, 75, 90, 100, 110, 125, 150, 200]
const zoom = ref(100)

// 切换下拉菜单
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 选择缩放等级
const selectZoom = (zoomLevel) => {
  if (alphaTabApi.value) {
    zoom.value = zoomLevel
    alphaTabApi.value.settings.display.scale = zoomLevel / 100
    alphaTabApi.value.updateSettings()
    alphaTabApi.value.render()
    isOpen.value = false
  }
}

// 添加全局点击事件以关闭下拉菜单
const handleClickOutside = (event) => {
  if (zoomControlRef.value && !zoomControlRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

// 当组件挂载后同步初始缩放等级
onMounted(() => {
  // 添加点击外部关闭下拉菜单的事件监听
  document.addEventListener('click', handleClickOutside)
  
  if (alphaTabApi.value && alphaTabApi.value.settings.display.scale) {
    zoom.value = Math.round(alphaTabApi.value.settings.display.scale * 100)
  }
})

onUnmounted(() => {
  // 移除事件监听器
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.at-zoom-control {
  position: relative;
}

.zoom-btn {
  color: #fff;
  background: transparent;
  border: none;
  height: 40px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
}

.zoom-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.at-zoom-label {
  margin-left: 5px;
}

.zoom-dropdown {
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

.zoom-item {
  padding: 8px 16px;
  color: #333;
  cursor: pointer;
  text-align: center;
}

.zoom-item:hover {
  background-color: #f5f5f5;
}
</style>
