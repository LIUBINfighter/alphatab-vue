<template>
  <div>
    <button @click="toggleScoreListVisibility" class="fab-open-score-list">谱</button>
    <ScoreList
      v-if="isScoreListVisible"
      :scores="availableScores"
      @score-selected="handleScoreSelectedInManual"
      @close="closeScoreList"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ScoreList from './ScoreList.vue';

const props = defineProps({
  availableScores: Array
});

const emit = defineEmits(['score-selected']);

const isScoreListVisible = ref(false);

function toggleScoreListVisibility() {
  isScoreListVisible.value = !isScoreListVisible.value;
}

function closeScoreList() {
  isScoreListVisible.value = false;
}

function handleScoreSelectedInManual(selectedScorePath) {
  emit('score-selected', selectedScorePath);
  isScoreListVisible.value = false; // 选择后自动关闭
}
</script>

<style scoped>
.fab-open-score-list {
  position: fixed;
  top: 20px;
  left: 20px;
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
  z-index: 1005; /* 确保在 SimpleDisplay 之上，但在 ScoreList 模态框之下 */
}

.fab-open-score-list:hover {
  background-color: #365a8a;
}
</style>
