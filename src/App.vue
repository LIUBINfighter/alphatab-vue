<script setup lang="ts">
import { provide, shallowRef, ref } from 'vue';
import SimpleDisplay from './components/SimpleDisplay.vue';
import ScoreList from './components/ScoreList.vue'; // 导入 ScoreList 组件

// 使用 shallowRef 避免大型对象的深度响应性
const alphaTabApi = shallowRef(null);
provide('alphaTabApi', alphaTabApi);

const initialScorePath = `${import.meta.env.BASE_URL}scores/吉他与孤独与蓝色星球.gpx`;
const currentScore = ref(initialScorePath); // 当前乐谱路径

const isScoreListVisible = ref(false);

const availableScores = ref([
  { name: '吉他与孤独与蓝色星球', path: `${import.meta.env.BASE_URL}scores/吉他与孤独与蓝色星球.gpx` },
  { name: 'Canon Rock', path: 'https://www.alphatab.net/files/canon.gp' },
  { name: 'The Godfather', path: 'https://www.alphatab.net/files/The%20Godfather.gp5' },
  // 在这里添加更多乐谱
]);

function openScoreList() {
  isScoreListVisible.value = true;
}

function handleScoreSelected(selectedScorePath: string) {
  currentScore.value = selectedScorePath;
  isScoreListVisible.value = false; // 选择后自动关闭
}

</script>

<template>
  <SimpleDisplay :score="currentScore" :key="currentScore" />
  <button @click="openScoreList" class="fab-open-score-list">谱</button>
  <ScoreList 
    :visible="isScoreListVisible" 
    :scores="availableScores"
    @update:visible="isScoreListVisible = $event"
    @score-selected="handleScoreSelected"
  />
</template>

<style scoped>
.fab-open-score-list {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #436d9d;
  color: white;
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  font-size: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1005; /*确保在 SimpleDisplay 之上，但在 ScoreList 模态框之下*/
}

.fab-open-score-list:hover {
  background-color: #365a8a;
}
</style>
