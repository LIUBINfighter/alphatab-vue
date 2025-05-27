import { ref } from 'vue';
// 为编辑器视图的 SimpleDisplay 定义 ControlBar 功能
export const editorControlFeatures = ref([
  'stop', 
  'play-pause', 
  'speed-control', 
  'print', 
  'download',
  // 'zoom', // 添加 zoom 控件
  // 'style-control',
  'dark-theme',
  'layout'
]);