// src/stores/theme.ts
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { applyTheme as applyThemeUtil, type ThemeName } from '../utils/alphaTabStyleUtils'; // 导入你的工具函数和类型

export const useThemeStore = defineStore('theme', () => {
  // State
  const currentTheme = ref<ThemeName>('default'); // 默认主题

  // Actions
  function changeTheme(themeName: ThemeName) {
    currentTheme.value = themeName;
    applyThemeUtil(themeName, undefined); // 假设 api 实例暂时不通过 store 管理
    console.log('ThemeStore: Theme changed to:', themeName);
  }

  // 可以在 store 初始化时应用一次默认主题，或者由 App.vue 在 onMounted 时调用
  // applyThemeUtil(currentTheme.value, undefined); // 如果希望 store 自身初始化时就应用

  return {
    currentTheme, // 可以通过 getter 暴露 (例如: const actualTheme = computed(() => currentTheme.value))
    changeTheme,
  };
});