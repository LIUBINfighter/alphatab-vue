// src/views/ScorePlayerView.vue
<template>
  <SimpleDisplay
    v-if="currentScoreInfo"
    :score="currentScoreInfo.path"
    :key="currentScoreInfo.alias"
    :control-bar-features="playerControlFeatures"
  />
  <div v-else>
    <p>Score with alias '{{ scoreAliasProp }}' not found, or scores are loading...</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SimpleDisplay from '../components/SimpleDisplay.vue';
import { playerControlFeatures } from '../config/playerControlFeatures';
import { availableScores, type ScoreInfo } from '../config/availableScores';

const props = defineProps<{
  scoreAlias: string;
}>();

const scoreAliasProp = computed(() => props.scoreAlias);

const currentScoreInfo = computed<ScoreInfo | undefined>(() => {
  return availableScores.value.find(score => score.alias === props.scoreAlias);
});
</script>

<style scoped>
/* 可以添加此视图特有的样式 */
</style>