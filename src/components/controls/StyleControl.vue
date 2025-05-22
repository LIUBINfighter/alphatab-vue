<template>
  <div class="style-control">
    <select 
      class="style-selector" 
      v-model="selectedTheme" 
      @change="onThemeChange"
      :disabled="disabled">
      <option value="default">默认</option>
      <option value="dark">暗色默认</option>
      <option value="ocean">深海蓝</option>
      <option value="vibrant">炫彩夜晚</option>
    </select>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, watch } from 'vue';
import { applyTheme } from '../../utils/alphaTabStyleUtils';

// 接收props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});

// 注入API
const api = inject('alphaTabApi');

// 注入DarkTheme使用的状态
const customStyleEnabled = inject('customStyleEnabled', ref(false));

// 当前选择的主题
const selectedTheme = ref('default');

// 主题切换方法
function onThemeChange() {
  console.log(`正在切换到主题: ${selectedTheme.value}`);
  
  // 同步DarkTheme组件的状态
  if (selectedTheme.value === 'default') {
    customStyleEnabled.value = false;
  } else {
    customStyleEnabled.value = true;
  }
  
  // 应用新主题
  applyTheme(selectedTheme.value, api);
}

// 监听DarkTheme组件状态变化
watch(customStyleEnabled, (newValue) => {
  // 如果DarkTheme被切换关闭，更新为默认主题并应用
  if (!newValue && selectedTheme.value !== 'default') {
    selectedTheme.value = 'default';
    // 直接应用样式，而不仅仅是更新选择器
    applyTheme(selectedTheme.value, api);
  } 
  // 如果DarkTheme被切换开启，但当前是默认主题，更新为暗色主题并应用
  else if (newValue && selectedTheme.value === 'default') {
    selectedTheme.value = 'dark';
    // 直接应用样式，而不仅仅是更新选择器
    applyTheme(selectedTheme.value, api);
  }
}, { immediate: true });

// 组件挂载时检查当前已应用的主题
onMounted(() => {
  // 如果DarkTheme已开启，默认选择暗色主题
  if (customStyleEnabled.value) {
    selectedTheme.value = 'dark';
  }
  
  // 如果存在指定自定义样式的元素，检查是哪种主题
  const styleElement = document.getElementById('alphatab-custom-style');
  if (styleElement) {
    const styleContent = styleElement.innerHTML;
    
    // 基于样式内容判断当前主题
    if (styleContent.includes('#0F1A2D')) {
      selectedTheme.value = 'ocean';
    } else if (styleContent.includes('#69F0AE')) {
      selectedTheme.value = 'vibrant';
    } else {
      selectedTheme.value = 'dark';
    }
    
    // 确保customStyleEnabled与选择的主题同步
    if (selectedTheme.value !== 'default') {
      customStyleEnabled.value = true;
    }
  }
});
</script>

<style scoped>
.style-control {
  display: inline-block;
  margin: 0 10px;
}

.style-selector {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  font-size: 14px;
  min-width: 120px;
}

.style-selector:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>
