<template>
  <div class="at-layout-control" ref="layoutControlRef">
    <div class="btn-group">
      <button 
        type="button" 
        class="btn layout-btn" 
        @click="toggleDropdown"
      >
        <LayoutGrid class="icon" />
        <span class="at-layout-label">{{ layoutLabels[layout] }}</span>
      </button>
      <div class="layout-dropdown" v-if="isOpen" @click.stop>
        <div 
          v-for="(label, value) in layoutLabels" 
          :key="value" 
          class="layout-item"
          @click="selectLayout(value)"
        >
          {{ label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { LayoutGrid } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')
const layoutControlRef = ref(null)
const isOpen = ref(false)
const layout = ref('page')
const layoutLabels = {
  'horizontal': 'Horizontal',
  'page': 'Page'
}

// 切换下拉菜单
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 选择布局
const selectLayout = (selectedLayout) => {
  if (alphaTabApi.value) {
    layout.value = selectedLayout
    switch (selectedLayout) {
      case 'horizontal':
        alphaTabApi.value.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal
        break
      case 'page':
        alphaTabApi.value.settings.display.layoutMode = alphaTab.LayoutMode.Page
        break
    }
    alphaTabApi.value.updateSettings()
    alphaTabApi.value.render()
    isOpen.value = false
  }
}

// 添加全局点击事件以关闭下拉菜单
const handleClickOutside = (event) => {
  if (layoutControlRef.value && !layoutControlRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

// 当组件挂载后同步初始布局模式
onMounted(() => {
  // 添加点击外部关闭下拉菜单的事件监听
  document.addEventListener('click', handleClickOutside)
  
  if (alphaTabApi.value && alphaTabApi.value.settings.display.layoutMode) {
    layout.value = alphaTabApi.value.settings.display.layoutMode === alphaTab.LayoutMode.Horizontal 
      ? 'horizontal' 
      : 'page'
  }
})

onUnmounted(() => {
  // 移除事件监听器
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.at-layout-control {
  position: relative;
}

.layout-btn {
  color: #fff;
  background: transparent;
  border: none;
  height: 40px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
}

.layout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.at-layout-label {
  margin-left: 5px;
}

.layout-dropdown {
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

.layout-item {
  padding: 8px 16px;
  color: #333;
  cursor: pointer;
  text-align: center;
}

.layout-item:hover {
  background-color: #f5f5f5;
}
</style>
