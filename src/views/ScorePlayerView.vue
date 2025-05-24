// src/views/ScorePlayerView.vue
<template>
  <SimpleDisplay
    v-if="currentScore"
    :score="currentScore"
    :key="currentScore"
    :control-bar-features="playerControlFeatures"
  />
  <div v-else>
    <p>Loading score...</p>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import SimpleDisplay from '../components/SimpleDisplay.vue';
import { playerControlFeatures } from '../config/playerControlFeatures';

// 使用可选链和默认值来处理注入
const currentScore = inject('currentScoreRef', ref(''));
</script>

<style scoped>
/* 可以添加此视图特有的样式 */
</style>