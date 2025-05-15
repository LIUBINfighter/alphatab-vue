<template>
  <div v-if="visible" class="score-list-modal-backdrop">
    <div class="score-list-modal-content">
      <h3>选择乐谱</h3>
      <ul>
        <li v-for="scoreItem in scores" :key="scoreItem.name" @click="selectScore(scoreItem)">
          {{ scoreItem.name }}
        </li>
      </ul>
      <button @click="closeModal">关闭</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  visible: Boolean,
  scores: Array // [{ name: '乐谱1', path: 'url/to/score1.gpx' }, ...]
});

const emit = defineEmits(['update:visible', 'score-selected']);

function selectScore(scoreItem) {
  emit('score-selected', scoreItem.path);
  closeModal();
}

function closeModal() {
  emit('update:visible', false);
}
</script>

<style scoped>
.score-list-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it's above SimpleDisplay's overlay */
}

.score-list-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  text-align: center;
}

.score-list-modal-content h3 {
  margin-top: 0;
}

.score-list-modal-content ul {
  list-style: none;
  padding: 0;
  margin: 15px 0;
}

.score-list-modal-content li {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.score-list-modal-content li:hover {
  background-color: #f0f0f0;
}

.score-list-modal-content li:last-child {
  border-bottom: none;
}

.score-list-modal-content button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #436d9d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.score-list-modal-content button:hover {
  background-color: #365a8a;
}
</style>
