<script setup lang="ts">
import { provide, shallowRef, ref } from 'vue';
import SimpleDisplay from './components/SimpleDisplay.vue';
import NavigationManual from './components/NavigationManual.vue'; // 导入 NavigationManual 组件

// 使用 shallowRef 避免大型对象的深度响应性
const alphaTabApi = shallowRef(null);
provide('alphaTabApi', alphaTabApi);

const initialScorePath = `${import.meta.env.BASE_URL}scores/吉他与孤独与蓝色星球.gpx`;
const currentScore = ref(initialScorePath); // 当前乐谱路径

const availableScores = ref([
  { name: '吉他与孤独与蓝色星球', path: `${import.meta.env.BASE_URL}scores/吉他与孤独与蓝色星球.gpx` },
  { name: '东方妖妖梦 - 幽雅に咲かせ、墨染の桜 ～ Border of Life (Drop D)', path: `${import.meta.env.BASE_URL}scores/东方妖妖梦 - 幽雅に咲かせ、墨染の桜　～ Border of Life(Drop D).gp5` },
  { name: 'Canon Rock', path: 'https://www.alphatab.net/files/canon.gp' },
]);

function handleScoreSelected(selectedScorePath: string) {
  currentScore.value = selectedScorePath;
}

</script>

<template>
  <SimpleDisplay :score="currentScore" :key="currentScore" />
  <NavigationManual
    :available-scores="availableScores"
    @score-selected="handleScoreSelected"
  />
</template>

<style scoped>
</style>
