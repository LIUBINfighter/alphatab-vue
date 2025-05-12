<template>
  <div class="at-controls-left">
    <div class="at-song-info">
      <span class="at-song-title"></span>
      <span class="at-separator"> - </span>
      <span class="at-song-artist"></span>
    </div>
  </div>
</template>

<script setup>
// 如果将来需要添加逻辑可以在这里扩展
</script>

<style scoped>
.at-controls-left {
  max-width: 300px;
}

.at-song-info {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 10px;
}

.at-song-title {
  font-weight: bold;
}

.at-song-title, .at-song-artist {
  display: inline-block;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
}

.at-separator {
  margin: 0 5px;
}
</style>
