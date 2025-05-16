<template>
  <header class="global-header">
    <div class="header-content">
      <span class="app-title">AlphaTab Vue Editor</span>
      <button @click="toggleMenu" class="menu-button" title="Open Menu">
        Menu
      </button>
    </div>
  </header>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['toggle-menu']);

function toggleMenu() {
  emit('toggle-menu');
}
</script>

<style scoped>
.global-header {
  width: 100%;
  height: 50px; /* Adjust height as needed */
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  padding: 20px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #444;
  flex-shrink: 0; /* Prevent header from shrinking if content overflows */
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.app-title {
  font-size: 1.2em;
  font-weight: bold;
}

.menu-button {
  background-color: #436d9d;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.menu-button:hover {
  background-color: #365a8a;
}
</style>
