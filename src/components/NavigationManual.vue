<template>
  <div class="navigation-fabs">
    <button @click="toggleScoreListVisibility" class="fab-button fab-open-score-list" title="选择乐谱">谱</button>
    <button @click="switchToTexEditor" class="fab-button fab-open-tex-editor" title="AlphaTex 编辑器">Tex</button>
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
import ScoreList from './manual/ScoreList.vue';

const props = defineProps({
  availableScores: Array
});

const emit = defineEmits(['navigate']); // 更新 emit 事件名称

const isScoreListVisible = ref(false);

function toggleScoreListVisibility() {
  isScoreListVisible.value = !isScoreListVisible.value;
}

function closeScoreList() {
  isScoreListVisible.value = false;
}

function handleScoreSelectedInManual(selectedScorePath) {
  emit('navigate', { view: 'score', path: selectedScorePath });
  isScoreListVisible.value = false; // 选择后自动关闭
}

function switchToTexEditor() {
  emit('navigate', { view: 'texEditor' });
  isScoreListVisible.value = false; // 如果乐谱列表打开则关闭它
}
</script>

<style scoped>
.navigation-fabs {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1005; /* 确保在 SimpleDisplay 之上，但在 ScoreList 模态框之下 */
  display: flex;
  flex-direction: column; /* 垂直排列按钮 */
  gap: 10px; /* 按钮之间的间距 */
}

.fab-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #436d9d;
  color: white;
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  font-size: 18px; /* 调整字体大小以适应文本 */
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
}

.fab-button:hover {
  background-color: #365a8a;
}

</style>
