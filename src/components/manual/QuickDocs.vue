<!-- filepath: components/QuickDocs.vue -->
<template>
  <div class="quick-docs-overlay" @click="handleOverlayClick">
    <div class="quick-docs-modal" @click.stop>
      <div class="quick-docs-header">
        <h2>快速文档</h2>
        <button @click="$emit('close')" class="close-btn">
          <X class="icon" />
        </button>
      </div>
      <div class="quick-docs-content" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'
import { marked } from 'marked'
import { QUICK_DOCS_CONTENT } from './quickDocs'

const emit = defineEmits<{
  close: []
}>()

const renderedContent = computed(() => {
  return marked(QUICK_DOCS_CONTENT)
})

const handleOverlayClick = () => {
  emit('close')
}

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.quick-docs-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 1rem;
}

.quick-docs-modal {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
}

.quick-docs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.quick-docs-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  color: #666;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #e9ecef;
  color: #333;
}

.close-btn .icon {
  width: 1.25rem;
  height: 1.25rem;
}

.quick-docs-content {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  color: #333;
  line-height: 1.6;
  background: #ffffff;
}

/* Markdown 样式 */
.quick-docs-content :deep(h1),
.quick-docs-content :deep(h2),
.quick-docs-content :deep(h3) {
  color: #436d9d;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.quick-docs-content :deep(h1:first-child),
.quick-docs-content :deep(h2:first-child),
.quick-docs-content :deep(h3:first-child) {
  margin-top: 0;
}

.quick-docs-content :deep(p) {
  margin-bottom: 1rem;
}

.quick-docs-content :deep(ul),
.quick-docs-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.quick-docs-content :deep(li) {
  margin-bottom: 0.25rem;
}

.quick-docs-content :deep(code) {
  background: #f8f9fa;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.875rem;
  color: #e83e8c;
  border: 1px solid #e9ecef;
}

.quick-docs-content :deep(pre) {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  margin-bottom: 1rem;
  border: 1px solid #e9ecef;
}

.quick-docs-content :deep(pre code) {
  background: none;
  padding: 0;
  border: none;
  color: #333;
}

.quick-docs-content :deep(blockquote) {
  border-left: 4px solid #436d9d;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: #666;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0 0.375rem 0.375rem 0;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .quick-docs-modal {
    width: 95%;
    max-height: 90vh;
  }
  
  .quick-docs-header,
  .quick-docs-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .quick-docs-modal {
    width: 98%;
    max-height: 95vh;
  }
  
  .quick-docs-header h2 {
    font-size: 1.125rem;
  }
}
</style>