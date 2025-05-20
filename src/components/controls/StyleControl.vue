<template>
  <div class="style-control control-group">
    <div class="btn" :class="{'active': customStyleEnabled}" @click="toggleStyle" title="切换自定义样式">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <!-- 替换为调色板图标 -->
        <circle cx="13.5" cy="6.5" r="2.5"></circle>
        <circle cx="17.5" cy="10.5" r="2.5"></circle>
        <circle cx="9.5" cy="10.5" r="2.5"></circle>
        <circle cx="13.5" cy="14.5" r="2.5"></circle>
        <path d="M12 22v-7.5"></path>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

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
