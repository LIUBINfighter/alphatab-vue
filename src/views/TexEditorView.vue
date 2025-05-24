<!-- TexEditorView.vue -->
<template>
  <div class="tex-editor-container">
    <ToolBar 
      :currentFileName="currentFileName"
      @new-tex="createNewFile"
      @save-tex="saveCurrentFile"
      @load-tex="showFileList"
      @rename-tex="renameCurrentFile"
      @load-template="showTemplates"
    />
    <div class="editor-content">
      <div class="editor-panel">
        <TexEditor v-model="editorContent" />
      </div>
      <div class="preview-panel">
        <SimpleDisplay :tex="editorContent" :control-bar-features="editorControlFeatures" />
      </div>
    </div>

    <!-- 模态框: 保存文件 -->
    <div v-if="showSaveDialog" class="modal-overlay">
      <div class="modal-content">
        <h3>保存文件</h3>
        <input 
          v-model="saveFileName" 
          placeholder="输入文件名" 
          @keyup.enter="confirmSave"
        />
        <div class="modal-buttons">
          <button @click="confirmSave">保存</button>
          <button @click="cancelSave">取消</button>
        </div>
      </div>
    </div>

    <!-- 模态框: 加载文件列表 -->
    <div v-if="showLoadDialog" class="modal-overlay">
      <div class="modal-content">
        <h3>加载文件</h3>
        <div v-if="savedFiles.length === 0" class="empty-list">
          没有保存的文件
        </div>
        <ul v-else class="file-list">
          <li 
            v-for="file in savedFiles" 
            :key="file.id"
            @click="loadFile(file.id)"
          >
            {{ file.name }}
          </li>
        </ul>
        <div class="modal-buttons">
          <button @click="closeLoadDialog">取消</button>
        </div>
      </div>
    </div>

    <!-- 模态框: 模板列表 -->
    <div v-if="showTemplateDialog" class="modal-overlay">
      <div class="modal-content">
        <h3>选择模板</h3>
        <ul class="file-list">
          <li 
            v-for="template in templates" 
            :key="template.id"
            @click="loadTemplate(template.id)"
          >
            {{ template.name }}
          </li>
        </ul>
        <div class="modal-buttons">
          <button @click="closeTemplateDialog">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import ToolBar from '../components/editor/ToolBar.vue';
import TexEditor from '../components/editor/TexEditor.vue';
import SimpleDisplay from '../components/SimpleDisplay.vue';
import { editorControlFeatures } from '../config/editorControlFeatures';

// 编辑器状态
const editorContent = ref('');
const currentFileName = ref('');
const currentFileId = ref('');
const showSaveDialog = ref(false);
const showLoadDialog = ref(false);
const showTemplateDialog = ref(false);
const saveFileName = ref('');
const savedFiles = ref([]);

// 模板列表
const templates = ref([
  { id: 'simple', name: '简单示例', content: '\\title "简单示例"\n\\subtitle "AlphaTex"\n\\tempo 120\n.4 c d e f | g a b c5' },
  { id: 'scales', name: '音阶练习', content: '\\title "音阶练习"\n\\subtitle "C大调"\n\\tempo 90\n.4 c d e f | g a b c5 | c5 b a g | f e d c' },
  { id: 'chords', name: '和弦示例', content: '\\title "和弦示例"\n.2 c+e+g c+f+a c+e+g e+g+c5' }
]);

// 从localStorage中加载已保存文件列表
const loadSavedFilesList = () => {
  const fileKeys = Object.keys(localStorage).filter(key => key.startsWith('alphaTexFile:'));
  savedFiles.value = fileKeys.map(key => {
    return {
      id: key,
      name: key.replace('alphaTexFile:', '')
    };
  });
};

// 创建新文件
const createNewFile = () => {
  editorContent.value = '';
  currentFileName.value = '';
  currentFileId.value = '';
};

// 保存当前文件
const saveCurrentFile = () => {
  // 如果已有文件名，直接保存
  if (currentFileName.value) {
    const fileId = `alphaTexFile:${currentFileName.value}`;
    localStorage.setItem(fileId, editorContent.value);
    notifyTexFilesUpdated();
    return;
  }
  
  // 否则显示保存对话框
  showSaveDialog.value = true;
  saveFileName.value = '';
};

// 确认保存
const confirmSave = () => {
  if (!saveFileName.value.trim()) {
    alert('请输入文件名');
    return;
  }
  
  const fileId = `alphaTexFile:${saveFileName.value}`;
  localStorage.setItem(fileId, editorContent.value);
  currentFileName.value = saveFileName.value;
  currentFileId.value = fileId;
  showSaveDialog.value = false;
  notifyTexFilesUpdated();
};

const cancelSave = () => {
  showSaveDialog.value = false;
};

// 显示文件列表
const showFileList = () => {
  loadSavedFilesList();
  showLoadDialog.value = true;
};

// 加载文件
const loadFile = (fileId) => {
  const content = localStorage.getItem(fileId);
  if (content) {
    editorContent.value = content;
    currentFileName.value = fileId.replace('alphaTexFile:', '');
    currentFileId.value = fileId;
  }
  showLoadDialog.value = false;
};

// 关闭加载对话框
const closeLoadDialog = () => {
  showLoadDialog.value = false;
};

// 重命名当前文件
const renameCurrentFile = () => {
  if (!currentFileName.value) {
    alert('请先保存文件');
    return;
  }
  
  const newName = prompt('请输入新的文件名', currentFileName.value);
  if (!newName || newName === currentFileName.value) return;
  
  // 删除旧文件，保存为新文件
  localStorage.removeItem(currentFileId.value);
  const newFileId = `alphaTexFile:${newName}`;
  localStorage.setItem(newFileId, editorContent.value);
  
  currentFileName.value = newName;
  currentFileId.value = newFileId;
  notifyTexFilesUpdated();
};

// 显示模板列表
const showTemplates = () => {
  showTemplateDialog.value = true;
};

// 加载模板
const loadTemplate = (templateId) => {
  const template = templates.value.find(t => t.id === templateId);
  if (template) {
    editorContent.value = template.content;
    currentFileName.value = '';
    currentFileId.value = '';
  }
  showTemplateDialog.value = false;
};

// 关闭模板对话框
const closeTemplateDialog = () => {
  showTemplateDialog.value = false;
};

// 通知文件列表已更新
const notifyTexFilesUpdated = () => {
  window.dispatchEvent(new CustomEvent('tex-files-updated'));
};

// 监听来自App.vue的事件
const handleTexEditorAction = (event) => {
  const { action, fileId } = event.detail;
  
  if (action === 'new') {
    createNewFile();
  } else if (action === 'load' && fileId) {
    loadFile(fileId);
  } else if (action === 'showTemplates') {
    showTemplates();
  }
};

onMounted(() => {
  window.addEventListener('tex-editor-action', handleTexEditorAction);
  loadSavedFilesList();
});

onBeforeUnmount(() => {
  window.removeEventListener('tex-editor-action', handleTexEditorAction);
});
</script>

<style scoped>
.tex-editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.editor-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-panel {
  flex: 1;
  overflow: auto;
  border-right: 1px solid #ccc;
}

.preview-panel {
  flex: 1;
  overflow: auto;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.modal-content h3 {
  margin-top: 0;
}

.modal-content input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  box-sizing: border-box;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.modal-buttons button {
  padding: 6px 12px;
  background-color: #436d9d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
  max-height: 200px;
  overflow-y: auto;
}

.file-list li {
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.file-list li:hover {
  background-color: #f0f0f0;
}

.empty-list {
  text-align: center;
  padding: 16px;
  color: #666;
}
</style>
