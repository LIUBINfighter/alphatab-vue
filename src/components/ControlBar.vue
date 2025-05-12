<template>
  <div class="at-controls">
    <div class="at-controls-left">
      <div class="at-song-info">
        <span class="at-song-title"></span> -
        <span class="at-song-artist"></span>
      </div>
    </div>
    <div class="at-controls-right">
      <CountInButton />
      <MetronomeButton />
      <LoopButton />
      <PrintButton />
      <ZoomControl />
      <LayoutControl />
    </div>
  </div>
</template>

<script setup>
import CountInButton from './controls/CountInButton.vue'
import MetronomeButton from './controls/MetronomeButton.vue'
import LoopButton from './controls/LoopButton.vue'
import PrintButton from './controls/PrintButton.vue'
import ZoomControl from './controls/ZoomControl.vue'
import LayoutControl from './controls/LayoutControl.vue'
</script>

<style scoped>
.at-controls {
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  background: #436d9d;
  color: #fff;
}
.at-controls>div {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
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
</style>
