<template>
  <div class="at-controls">
    <ShortInfo class="priority-low" v-if="shouldShow('short-info')" />
    <div class="at-controls-right">
      <TimePosition class="priority-high" v-if="shouldShow('time-position')" />
      <StopButton class="priority-low" v-if="shouldShow('stop')" />
      <PlayPauseButton class="priority-high" v-if="shouldShow('play-pause')" />
      <SpeedControl class="priority-low" v-if="shouldShow('speed-control')" />
      <CountInButton class="priority-low" v-if="shouldShow('count-in')" />
      <MetronomeButton class="priority-high" v-if="shouldShow('metronome')" />
      <LoopButton class="priority-low" v-if="shouldShow('loop')" />
      <PrintButton class="priority-low" v-if="shouldShow('print')" />
      <DownloadButton class="priority-low" v-if="shouldShow('download')" />
      <ZoomControl class="priority-low" v-if="shouldShow('zoom')" />
      <LayoutControl class="priority-low" v-if="shouldShow('layout')" />
      <DarkTheme class="priority-low" v-if="shouldShow('dark-theme')" />
      <StyleControl class="priority-low" v-if="shouldShow('style-control')" />
      <TrackControl class="priority-low" v-if="shouldShow('track-control')" />
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
import ShortInfo from './controls/ShortInfo.vue'
import TimePosition from './controls/TimePosition.vue'
import CountInButton from './controls/CountInButton.vue'
import MetronomeButton from './controls/MetronomeButton.vue'
import LoopButton from './controls/LoopButton.vue'
import PrintButton from './controls/PrintButton.vue'
import ZoomControl from './controls/ZoomControl.vue'
import LayoutControl from './controls/LayoutControl.vue'
import TrackControl from './controls/TrackControl.vue'
import PlayPauseButton from './controls/PlayPauseButton.vue'
import StopButton from './controls/StopButton.vue'
import SpeedControl from './controls/SpeedControl.vue'
import DownloadButton from './controls/DownloadButton.vue'
import DarkTheme from './controls/DarkTheme.vue' // 导入样式控制组件
import StyleControl from './controls/StyleControl.vue'

const props = defineProps({
  features: {
    type: Array,
    // 如果为 null，则显示 'stop', 'play-pause', 'speed-control', 'print', 'download' 这五个默认控件。
    // 如果传入一个数组，则该数组决定显示哪些控件。
    default: null 
  }
});

// 确保 alphaTabApi 已被提供
const api = inject('alphaTabApi')

// 更新默认控件集，添加样式控制
const defaultFeatureSet = ['stop', 'play-pause', 'speed-control', 'print', 'download'];

const featureMap = {
  'short-info': ShortInfo,
  'time-position': TimePosition,
  'stop': StopButton,
  'play-pause': PlayPauseButton,
  'speed-control': SpeedControl,
  'count-in': CountInButton,
  'metronome': MetronomeButton,
  'loop': LoopButton,
  'print': PrintButton,
  'download': DownloadButton,
  'zoom': ZoomControl,
  'layout': LayoutControl,
  'dark-theme': DarkTheme,
  'style-control': StyleControl, // 添加样式控制到特性映射
  'track-control': TrackControl,
};

function shouldShow(featureName) {
  if (props.features === null) {
    // 如果父组件未提供 features 数组，则使用默认的控件集
    return defaultFeatureSet.includes(featureName);
  }
  // 如果父组件提供了 features 数组（包括空数组），则根据该数组判断
  return props.features.includes(featureName);
}

</script>

<style scoped>
.at-controls {
  flex: 0 0 auto;
  display: flex;
  background: #436d9d;
  color: #fff;
  width: 100%;
  max-width: 100%; /* 确保不超出父容器 */
  overflow-x: auto; /* 在小屏幕上允许横向滚动而不是溢出 */
  position: relative;
  z-index: 1010;  /* 确保控制栏在最上层 */
  box-sizing: border-box;
  justify-content: space-between; /* 帮助更好地分布空间 */
  padding: 0; /* 移除任何可能导致溢出的内边距 */
}

.at-controls-right {
  display: flex;
  flex-wrap: nowrap;
  max-width: 100%;
  box-sizing: border-box;
}

.at-controls>div {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  flex-shrink: 0; /* 防止压缩 */
}

.at-controls-center {
  flex: 0 1 auto;
}

.at-controls>div>* {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
  margin: 0 3px;
  box-sizing: border-box;
}

.at-controls .btn {
  color: #fff;
  border-radius: 0;
  height: 40px;
  width: 40px;
  height: 40px;
  font-size: 16px;
}

.at-controls a.active {
  background: #5588c7;
  text-decoration: none;
}

.at-controls .btn i {
  vertical-align: top;
}

.at-controls select {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  border: none;
  width: 100%;
  height: 40px;
  background: #436d9d;
  padding: 4px 10px;
  color: #fff;
  font-size: 16px;
  text-align-last: center;
  text-align: center;
  -ms-text-align-last: center;
  -moz-text-align-last: center;
  cursor: pointer;
}

.at-song-title {
  font-weight: bold;
}

.icon {
  width: 20px;
  height: 20px;
  stroke-width: 1.5px;
}

/* 确保下拉菜单显示在曲谱上方 */
:deep(.dropdown-content),
:deep(.select-wrapper) {
  position: absolute;
  z-index: 1011;
}

/* 响应式控制 */
@media screen and (max-width: 600px) {
  .priority-low {
    display: none !important;
  }
  
  .at-controls {
    justify-content: center;
  }
  
  .at-controls-right {
    margin-left: 0;
  }
}
</style>
