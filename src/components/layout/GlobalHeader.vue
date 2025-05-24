<template>
  <header class="global-header">
    <div class="header-content">
      <span class="app-title">AlphaTab Vue</span>
      <div class="header-buttons">
        <button
          @click="openLink('https://github.com/LIUBINfighter/alphatab-vue')"
          class="menu-button"
          title="GitHub Repository"
        >
          <Github class="icon" />
          <!-- Github Repo -->
        </button>

        <button
          @click="openLink('https://www.alphatab.net/')"
          class="menu-button"
          title="AlphaTab Official Website"
        >
          <ExternalLink class="icon" />
          AlphaTab.js
        </button>

        <button
          @click="openLink('/alphatab-vue/docs/')"
          class="menu-button"
          title="Documentation"
        >
          <BookOpen class="icon" />
          Dev Record
        </button>

        <button
          @click="showQuickDocs = true"
          class="menu-button quick-docs-fab"
          title="快速文档"
        >
          <FileText class="icon" />
          Quick Docs
        </button>

        <button
          @click="toggleMenu"
          class="menu-button"
          title="Open Menu"
        >
        <FileMusic class="icon" />
          Menu
        </button>
      </div>
    </div>

    <QuickDocs
      v-if="showQuickDocs"
      @close="showQuickDocs = false"
    />
  </header>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue';
import { Github, ExternalLink, BookOpen, FileText ,FileMusic } from 'lucide-vue-next';
import QuickDocs from './QuickDocs.vue';

const emit = defineEmits(['toggle-menu']);

function toggleMenu() {
  emit('toggle-menu');
}

function openLink(url) {
  window.open(url, '_blank');
}

const showQuickDocs = ref(false);
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

.quick-docs-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-docs-btn:hover {
  background: var(--hover-bg);
  border-color: var(--primary-color);
}

.quick-docs-btn .icon {
  width: 1rem;
  height: 1rem;
}

.fab-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #436d9d;
  color: white;
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
}

.fab-button:hover {
  background-color: #365a8a;
}

.fab-button .icon {
  width: 20px;
  height: 20px;
}
</style>
