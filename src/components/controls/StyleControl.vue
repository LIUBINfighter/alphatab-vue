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
import { ref, inject, onMounted } from 'vue';
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

// 当前选择的主题
const selectedTheme = ref('default');

// 主题切换方法
function onThemeChange() {
  console.log(`正在切换到主题: ${selectedTheme.value}`);
  applyTheme(selectedTheme.value, api);
}

// 组件挂载时检查当前已应用的主题
onMounted(() => {
  // 如果存在指定自定义样式的元素，则可能需要同步初始选择状态
  const styleElement = document.getElementById('alphatab-custom-style');
  if (styleElement) {
    // 可以基于内容判断当前主题，这里简化为默认使用暗色
    selectedTheme.value = 'dark';
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
