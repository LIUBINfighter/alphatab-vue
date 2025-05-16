<template>
  <div class="score-list-container">
    <div class="score-list-header">
      <button 
        v-if="headerButtonConfig" 
        @click="handleHeaderAction" 
        class="list-button" 
        :title="headerButtonConfig.label"
      >
        {{ headerButtonConfig.label }}
      </button>
      <span class="list-title">{{ title }}</span>
      <button @click="close" class="close-button">&times;</button>
    </div>
    <ul class="score-list">
      <li v-for="item in listItems" :key="item.id" @click="handleItemClick(item)" class="score-item">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: '选择项目'
  },
  listItems: { // Renamed from scores
    type: Array,
    required: true
  },
  headerButtonConfig: { // New prop for the header button
    type: Object, // { label: String, actionPayload: any }
    default: null
  }
});

const emit = defineEmits(['score-selected', 'close', 'navigate']);

function handleItemClick(item) {
  if (item.type === 'score') {
    emit('score-selected', item.id); // id is the score path
  } else if (item.type === 'action') {
    emit('navigate', { action: item.id, itemDetails: item }); // id is the action identifier
  }
}

function handleHeaderAction() {
  if (props.headerButtonConfig && props.headerButtonConfig.actionPayload) {
    emit('navigate', props.headerButtonConfig.actionPayload);
  }
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
