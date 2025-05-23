<template>
  <header class="global-header">
    <div class="header-content">
      <span class="app-title">AlphaTab Vue Editor</span>
      <div class="header-buttons">
        <button @click="openLink('https://github.com/LIUBINfighter/alphatab-vue')" class="menu-button" title="GitHub Repository">
          <Github class="icon" />
        </button>
        <button @click="openLink('https://www.alphatab.net/')" class="menu-button" title="AlphaTab Official Website">
          <ExternalLink class="icon" />
        </button>
        <button @click="openLink('/alphatab-vue/docs/')" class="menu-button" title="Documentation">
          <BookOpen class="icon" />
        </button>
        <button @click="toggleMenu" class="menu-button" title="Open Menu">
          Menu
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { defineEmits } from 'vue';
import { Github, ExternalLink, BookOpen } from 'lucide-vue-next';

const emit = defineEmits(['toggle-menu']);

function toggleMenu() {
  emit('toggle-menu');
}

function openLink(url) {
  window.open(url, '_blank');
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

.header-buttons {
  display: flex;
  gap: 10px;
}

.icon {
  width: 18px;
  height: 18px;
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
