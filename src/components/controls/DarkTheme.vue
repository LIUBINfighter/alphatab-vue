<template>
  <div class="dark-theme control-group">
    <div class="btn" :class="{'active': customStyleEnabled}" @click="toggleStyle" :title="customStyleEnabled ? '恢复默认样式' : '切换到深色主题'">
      <!-- 使用 lucide 组件代替内联 SVG -->
      <Sun v-if="!customStyleEnabled" class="icon" />
      <Moon v-else class="icon" />
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { Sun, Moon } from 'lucide-vue-next'; // 导入 Lucide 图标组件

// 注入自定义样式状态和切换方法
const customStyleEnabled = inject('customStyleEnabled');
const toggleCustomStyle = inject('toggleCustomStyle');

// 检查StyleControl是否存在
const hasStyleControl = document.querySelector('.style-selector') !== null;

function toggleStyle() {
  if (hasStyleControl) {
    // 如果StyleControl存在，使用现有的toggleCustomStyle逻辑
    toggleCustomStyle();
  } else {
    // 如果StyleControl不存在，直接使用applyTheme在默认和暗色主题间切换
    customStyleEnabled.value = !customStyleEnabled.value;
    const newTheme = customStyleEnabled.value ? 'dark' : 'default';
    const api = inject('alphaTabApi');
    import('../../utils/alphaTabStyleUtils').then(({ applyTheme }) => {
      applyTheme(newTheme, api);
    });
  }
}
</script>

<style scoped>
.dark-theme {
  display: flex;
  align-items: center;
}

.dark-theme .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dark-theme .btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .btn.active {
  background-color: #5588c7;
}
</style>
