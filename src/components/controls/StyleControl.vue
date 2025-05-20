<template>
  <div class="style-control control-group">
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

function toggleStyle() {
  toggleCustomStyle();
}
</script>

<style scoped>
.style-control {
  display: flex;
  align-items: center;
}

.style-control .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.style-control .btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.style-control .btn.active {
  background-color: #5588c7;
}
</style>
