<template>
  <div class="at-controls">
    <ShortInfo class="priority-low" />
    <div class="at-controls-right">
      <TimePosition class="priority-high" />
      <StopButton class="priority-low" />
      <PlayPauseButton class="priority-high" />
      <SpeedControl class="priority-low" />
      <CountInButton class="priority-low" />
      <MetronomeButton class="priority-high" />
      <LoopButton class="priority-low" />
      <PrintButton class="priority-low" />
      <DownloadButton class="priority-low" />
      <ZoomControl class="priority-low" />
      <LayoutControl class="priority-low" />
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import ShortInfo from './controls/ShortInfo.vue'
import TimePosition from './controls/TimePosition.vue'
import CountInButton from './controls/CountInButton.vue'
import MetronomeButton from './controls/MetronomeButton.vue'
import LoopButton from './controls/LoopButton.vue'
import PrintButton from './controls/PrintButton.vue'
import ZoomControl from './controls/ZoomControl.vue'
import LayoutControl from './controls/LayoutControl.vue'
import PlayPauseButton from './controls/PlayPauseButton.vue'
import StopButton from './controls/StopButton.vue'
import SpeedControl from './controls/SpeedControl.vue'
import DownloadButton from './controls/DownloadButton.vue'

// 确保 alphaTabApi 已被提供
const api = inject('alphaTabApi')
</script>

<style scoped>
.at-controls {
  flex: 0 0 auto;
  display: flex;
  background: #436d9d;
  color: #fff;
  min-width: min-content;
  overflow-x: auto;
  position: relative;
  z-index: 1010;  /* 确保控制栏在最上层 */
}

.at-controls-right {
  display: flex;
  margin-left: auto;
  flex-wrap: nowrap;
}

.at-controls>div {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
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
