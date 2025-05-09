<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import * as alphaTab from '@coderline/alphatab'

// 组件引用
const viewportRef = ref<HTMLElement | null>(null)
const scoreRef = ref<HTMLElement | null>(null)
const timePositionLabel = ref<HTMLElement | null>(null)
const timeSliderValue = ref<HTMLElement | null>(null)

// 播放器状态
const playerState = reactive({
  isReady: false,
  isPlaying: false,
  currentTime: 0,
  totalTime: 0,
  playbackSpeed: 1,
  isLooping: false,
  metronomeEnabled: false,
  countInEnabled: false
})

// 显示设置
const displaySettings = reactive({
  scale: 1,
  layoutMode: 'Page'
})

// 速度选项
const speedOptions = [0.25, 0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2]

// 缩放选项
const zoomOptions = [0.25, 0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2]

// 格式化时间显示
const formatDuration = (milliseconds: number) => {
  let seconds = milliseconds / 1000
  const minutes = Math.floor(seconds / 60)
  seconds = Math.floor(seconds - minutes * 60)
  return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0')
}

// API引用
let api: any = null

onMounted(() => {
  if (scoreRef.value) {
    api = new alphaTab.AlphaTabApi(scoreRef.value, {
      player: {
        enablePlayer: true,
        soundFont: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@alpha/dist/soundfont/sonivox.sf2',
        scrollElement: viewportRef.value,
        scrollOffsetX: -10,
        scrollMode: alphaTab.ScrollMode.Continuous,
        scrollSpeed: 300
      },
      display: {
        scale: displaySettings.scale,
        layoutMode: getLayoutMode(displaySettings.layoutMode)
      }
    })
    
    // 加载文件
    api.load('../assets/scores/东方妖妖梦 - 幽雅に咲かせ、墨染の桜　～ Border of Life(Drop D).gp5')
    
    // 设置事件处理
    setupEvents()
  }
})

// 设置AlphaTab事件
const setupEvents = () => {
  // 播放器就绪事件
  api.scoreLoaded.on(() => {
    playerState.isReady = true
    playerState.totalTime = api.score.duration
  })
  
  // 播放状态变更事件
  api.playerStateChanged.on((args: any) => {
    playerState.isPlaying = args.state !== 0
  })
  
  // 播放位置变更事件
  let previousTime = -1
  api.playerPositionChanged.on((args: any) => {
    // 减少UI更新频率，仅在秒数变化时更新
    const currentSeconds = Math.floor(args.currentTime / 1000)
    if (currentSeconds === previousTime) return
    previousTime = currentSeconds
    
    playerState.currentTime = args.currentTime
    
    if (timePositionLabel.value) {
      timePositionLabel.value.innerText = `${formatDuration(args.currentTime)} / ${formatDuration(args.endTime)}`
    }
    
    if (timeSliderValue.value) {
      const percentage = (args.currentTime / args.endTime) * 100
      timeSliderValue.value.style.width = `${percentage.toFixed(2)}%`
    }
  })
}

// 获取布局模式
const getLayoutMode = (mode: string) => {
  switch(mode) {
    case 'Page': return alphaTab.LayoutMode.Page
    case 'Horizontal': return alphaTab.LayoutMode.Horizontal
    default: return alphaTab.LayoutMode.Page
  }
}

// 控制方法
const playPause = () => {
  if (!playerState.isReady) return
  api.playPause()
}

const stop = () => {
  if (!playerState.isReady) return
  api.stop()
}

const toggleLoop = () => {
  playerState.isLooping = !playerState.isLooping
  api.isLooping = playerState.isLooping
}

const toggleMetronome = () => {
  playerState.metronomeEnabled = !playerState.metronomeEnabled
  api.metronomeVolume = playerState.metronomeEnabled ? 1 : 0
}

const toggleCountIn = () => {
  playerState.countInEnabled = !playerState.countInEnabled
  api.countInVolume = playerState.countInEnabled ? 1 : 0
}

const changeSpeed = (speed: number) => {
  playerState.playbackSpeed = speed
  api.playbackSpeed = speed
}

const changeScale = (scale: number) => {
  displaySettings.scale = scale
  api.settings.display.scale = scale
  api.updateSettings()
  api.render()
}

const changeLayout = (layout: string) => {
  displaySettings.layoutMode = layout
  const settings = api.settings
  
  switch (layout) {
    case 'Page':
      settings.display.layoutMode = alphaTab.LayoutMode.Page
      settings.player.scrollMode = alphaTab.ScrollMode.Continuous
      break
    case 'HorizontalBar':
      settings.display.layoutMode = alphaTab.LayoutMode.Horizontal
      settings.player.scrollMode = alphaTab.ScrollMode.Continuous
      break
    case 'HorizontalScreen':
      settings.display.layoutMode = alphaTab.LayoutMode.Horizontal
      settings.player.scrollMode = alphaTab.ScrollMode.OffScreen
      break
  }
  
  api.updateSettings()
  api.render()
}

const print = () => {
  if (api) api.print()
}
</script>

<template>
  <div class="player">
    <div class="at-wrap">
      <!-- 控制栏 -->
      <div class="at-controls">
        <div class="at-controls-left">
          <!-- 播放控制 -->
          <button class="btn at-play" :class="{ disabled: !playerState.isReady }" @click="playPause">
            {{ playerState.isPlaying ? '暂停' : '播放' }}
          </button>
          
          <button class="btn at-stop" :class="{ disabled: !playerState.isReady }" @click="stop">
            停止
          </button>
          
          <!-- 速度控制 -->
          <div class="at-speed">
            <span>速度:</span>
            <select v-model="playerState.playbackSpeed" @change="changeSpeed(playerState.playbackSpeed)">
              <option v-for="speed in speedOptions" :key="speed" :value="speed">{{ speed }}x</option>
            </select>
          </div>
        </div>
        
        <div class="at-controls-center">
          <!-- 进度条 -->
          <div class="at-time">
            <div ref="timePositionLabel" class="at-time-position">00:00 / 00:00</div>
            <div class="at-time-slider">
              <div ref="timeSliderValue" class="at-time-slider-value"></div>
            </div>
          </div>
        </div>
        
        <div class="at-controls-right">
          <!-- 辅助功能 -->
          <button class="btn at-metronome" :class="{ active: playerState.metronomeEnabled }" @click="toggleMetronome">
            节拍器
          </button>
          
          <button class="btn at-count-in" :class="{ active: playerState.countInEnabled }" @click="toggleCountIn">
            预备拍
          </button>
          
          <button class="btn at-loop" :class="{ active: playerState.isLooping }" @click="toggleLoop">
            循环
          </button>
          
          <!-- 布局控制 -->
          <div class="at-layout">
            <span>布局:</span>
            <select v-model="displaySettings.layoutMode" @change="changeLayout(displaySettings.layoutMode)">
              <option value="Page">垂直布局</option>
              <option value="HorizontalBar">水平条形布局</option>
              <option value="HorizontalScreen">水平屏幕布局</option>
            </select>
          </div>
          
          <!-- 缩放控制 -->
          <div class="at-zoom">
            <span>缩放:</span>
            <select v-model="displaySettings.scale" @change="changeScale(displaySettings.scale)">
              <option v-for="zoom in zoomOptions" :key="zoom" :value="zoom">{{ zoom * 100 }}%</option>
            </select>
          </div>
          
          <!-- 打印功能 -->
          <button class="btn at-print" @click="print">打印</button>
        </div>
      </div>

      <!-- 视图区域 -->
      <div ref="viewportRef" class="at-viewport">
        <div ref="scoreRef" class="at-main"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.at-wrap {
  width: 100%;
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.at-controls {
  height: 60px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.at-controls-left, .at-controls-right, .at-controls-center {
  display: flex;
  align-items: center;
  gap: 10px;
}

.at-controls-center {
  flex: 1;
  padding: 0 20px;
}

.at-viewport {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

.at-main {
  padding: 20px;
  position: relative;
}

.btn {
  padding: 5px 10px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:hover:not(.disabled) {
  background-color: #e5e5e5;
}

.btn.active {
  background-color: #4CAF50;
  color: white;
}

.btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.at-time {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.at-time-position {
  text-align: center;
  font-size: 12px;
  margin-bottom: 2px;
}

.at-time-slider {
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  position: relative;
  cursor: pointer;
}

.at-time-slider-value {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 3px;
  width: 0;
}

.at-speed, .at-layout, .at-zoom {
  display: flex;
  align-items: center;
  gap: 5px;
}

select {
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>
