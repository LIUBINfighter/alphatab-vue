// src/views/ScorePlayerView.vue
<template>
  <SimpleDisplay
    v-if="currentScoreFromApp"
    :score="currentScoreFromApp.value"
    :key="currentScoreFromApp.value"
    :control-bar-features="playerControlFeatures"
  />
  <div v-else>
    <p>Loading score...</p>
  </div>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue';
import SimpleDisplay from '../components/SimpleDisplay.vue';
// 确认 playerControlFeatures.ts 的实际路径
// 假设它在 src/components/playerControlFeatures.ts (根据你之前的目录)
// 如果你移动到了 src/config/，请相应修改
import { playerControlFeatures } from '../components/playerControlFeatures';

// 从 App.vue 注入 currentScore。这是一种临时方案，之后会用 Pinia 或路由参数替代
const currentScoreFromApp = inject<Ref<string>>('currentScoreRef');

</script>

<style scoped>
/* 可以添加此视图特有的样式 */
</style>