// 这里是 App.vue 需要的控件常量 
import { ref } from 'vue';

export const playerControlFeatures = ref([
  'short-info', 'time-position', 'stop', 'play-pause', 'speed-control', 
  'count-in', 'metronome', 'loop', 'print', 'download', 
  'zoom', 'layout', 'style-control', 'dark-theme','single-track-control'
]);