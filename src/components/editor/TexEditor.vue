<template>
  <div ref="editorContainer" class="editor-container"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
// 确保 'codemirror' 包 (v6+) 已正确安装并在 package.json 中声明
import { EditorState } from '@codemirror/state'; // 从 @codemirror/state 导入
import { EditorView } from '@codemirror/view';   // 从 @codemirror/view 导入
import { basicSetup } from 'codemirror';        // basicSetup 通常可以从 codemirror 伞形包导入
import { oneDark } from '@codemirror/theme-one-dark'; // 重新导入暗色主题
import { javascript } from '@codemirror/lang-javascript'; // 导入 JavaScript 语言包

const props = defineProps({
  modelValue: String
});
const emit = defineEmits(['update:modelValue']);

const editorContainer = ref(null);
let editorView = null;

onMounted(() => {
  editorView = new EditorView({
    state: EditorState.create({
      doc: props.modelValue || '',
      extensions: [
        basicSetup,
        oneDark, // 添加暗色主题
        javascript({ jsx: true }), // 添加 JavaScript (及 JSX) 语言高亮
        EditorView.lineWrapping, // 添加自动换行
        EditorView.contentAttributes.of({ style: "padding-bottom: 50vh;" }), // 允许滚动过最后一行
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            const value = v.state.doc.toString();
            emit('update:modelValue', value);
          }
        })
      ]
    }),
    parent: editorContainer.value
  });
});

onBeforeUnmount(() => {
  if (editorView) editorView.destroy();
});

// 外部修改 modelValue 时同步到编辑器
watch(
  () => props.modelValue,
  (newValue) => {
    const current = editorView?.state.doc.toString();
    if (newValue !== current) {
      editorView?.dispatch({
        changes: {
          from: 0,
          to: current.length,
          insert: newValue
        }
      });
    }
  }
);
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 100%;
  font-size: 14px;
  border: none;
}

/* 为 CodeMirror 编辑器内容设置等宽字体 */
.editor-container :deep(.cm-editor) {
  font-family: monospace;
}
</style>
