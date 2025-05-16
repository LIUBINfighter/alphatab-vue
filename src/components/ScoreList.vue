<template>
  <div class="score-list-container">
    <div class="score-list-header">
      <button @click="switchToTexEditor" class="list-button" title="AlphaTex 编辑器">Tex 编辑器</button>
      <span class="list-title">选择乐谱</span>
      <button @click="close" class="close-button">&times;</button>
    </div>
    <ul class="score-list">
      <li v-for="score in scores" :key="score.path" @click="selectScore(score.path)" class="score-item">
        {{ score.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  scores: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['score-selected', 'close', 'navigate']);

function selectScore(scorePath) {
  emit('score-selected', scorePath);
}

function switchToTexEditor() {
  emit('navigate', { view: 'texEditor' });
}

function close() {
  emit('close');
}
</script>

<style scoped>
.score-list-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1006; /* 确保在所有其他元素之上 */
}

.score-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #436d9d;
  color: white;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.list-title {
  font-weight: bold;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.list-button {
    background: none;
    border: none;
    color: white;
    font-size: 14px;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 3px;
}

.list-button:hover {
    background-color: #365a8a;
}

.score-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.score-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.score-item:hover {
  background-color: #eee;
}
</style>
