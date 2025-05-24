这个 `TexEditorView.vue` 组件作为专门用于创建、编辑和管理 AlphaTex 文件的 **工作空间** 。这份文档写于迁移到pinia之前，所以包含了计划中的内容。

## TexEditorView.vue

1. **核心功能** :
	- 它提供了一个用户界面，带有 `ToolBar` 用于文件操作（新建、保存、加载、重命名、加载模板）。
	- 它嵌入了一个 `TexEditor` 组件（可能是文本区域或更专业的代码编辑器），用于编写 AlphaTex 标记，其内容绑定到 `editorContent` 。
	- 它包含一个 `SimpleDisplay` 组件，用于显示 `editorContent` 作为渲染的乐谱的实时预览。
	- 它管理着几个用于保存文件（提示输入文件名）、从列表中加载文件以及选择模板的模态对话框。
2. **状态管理（内部）** ：
	- **`editorContent`**: 核心数据——实际的 Tex 标记字符串。
	- **`currentFileName` / `currentFileId`**: 追踪当前打开的文件。
	- **`showSaveDialog`, `showLoadDialog`, `showTemplateDialog`**: 控制相应模态框可见性的布尔标志。
	- **`saveFileName`**: 保存对话框中输入的临时状态。
	- **`savedFiles`**: 一个数组，用于存储从 `localStorage` 中检索到的文件列表。这是我们在项目日志中特别强调的、用于 Pinia 集成的关键状态。
	- **`templates`**: 一份硬编码的 Tex 模板列表。
	- **`editorControlFeatures`**: `SimpleDisplay` 预览的配置。
3. **数据持久化 & 文件操作** :
	- 所有文件操作（加载、保存、重命名）目前直接与 `localStorage` 交互，键名前缀为 `alphaTexFile:`。
	- `createNewFile`: 清除编辑器和当前文件信息。
	- `saveCurrentFile` / `confirmSave`: 将 `editorContent` 保存到 `localStorage` 。处理"保存"（覆盖）和"另存为"（通过对话框）两种情况。
	- `loadSavedFilesList`: 从 `localStorage` 填充 `savedFiles` 。
	- `loadFile`: 将内容从 `localStorage` 加载到 `editorContent` 。
	- `renameCurrentFile`: 删除旧条目并在 `localStorage` 中添加新条目。
	- `loadTemplate`: 从预定义的 `templates` 中填充 `editorContent` 。
4. **沟通与活动** :
	- **子组件** :
		- 它将 `currentFileName` 传递给 `ToolBar` 并监听其各种动作事件 (`@new-tex`, `@save-tex` 等)。
		- 它使用 `v-model` 与 `TexEditor` 用于 `editorContent` 。
		- 它将 `editorContent` （作为 `tex` ）和 `editorControlFeatures` 传递给 `SimpleDisplay` 。
	- **全局/组件间通信（当前状态）**:
		- `notifyTexFilesUpdated()`: 触发一个全局 `window` 自定义事件 `tex-files-updated` 。我们的项目日志正确地识别了这是一个重构的目标： `App.vue` 以前会监听这个事件，但计划让 `TexEditorView` 直接调用 `texFilesStore.refreshSavedTexFiles()` （或更细粒度的操作）。
		- `handleTexEditorAction` & `window.addEventListener('tex-editor-action', ...)`: 它监听自定义事件 `tex-editor-action` 。这是 `App.vue` 在其 `handleNavigation` 函数中，目前告诉 `TexEditorView` 加载特定文件的方式。这是基于 Pinia 进行通信的另一个主要候选方案。
5. **Lifecycle Hooks**:
	- `onMounted`: 从 `localStorage` 加载保存文件的初始列表，并设置 `tex-editor-action` 监听器。
	- `onBeforeUnmount`: 清理事件监听器。

---

## 与 App.vue 的关系及 Pinia 的潜力

- **`App.vue` 的作用** ：
	- `App.vue` 作为主应用程序外壳，处理路由（通过 `vue-router` ）以及全局布局组件，如 `GlobalHeader` 和 `ScoreList` 。
	- `ScoreList` 在 `App.vue` 中是动态的：
		- 当路由是 `ScorePlayer` 时，它列出了乐谱。
		- 当路由是 `TexEditor` 时，它列出了保存的 Tex 文件。这个列表来自 `texFilesStore.savedTexFiles` 。
	- `App.vue` 的 `handleNavigation` 函数负责：
		- 在 `/score/:scoreAlias` 和 `/editor` 视图之间切换。
		- 当导航到编辑器以加载一个 *特定* Tex 文件（可能从 `ScoreList` 选择）时，它目前会派发 `tex-editor-action` 窗口事件，并带有 `fileId` 。
- **已识别重构点（连接到 Pinia - 根据我们之前的讨论）**:
	1. **文本文件状态 (`savedFiles`, `currentFileId` 等)**: 此状态 (`savedFiles`, 从/向 `localStorage` 加载/保存/重命名它们的方法) 目前仅限于 `TexEditorView.vue` 。这正是创建 `texFilesStore.ts` 的目的。 `TexEditorView` 应该：
		- 从 `texFilesStore.savedTexFiles` 读取 `savedFiles` 。
		- 对 `texFilesStore` 调用操作（例如， `addTexFile` 、 `updateTexFileContent` 、 `deleteTexFile` 、 `loadTexFileById` ），而不是直接操作 `localStorage` 及其本地 `savedFiles` 引用。
		- `当前文件名 ` 、 ` 当前文件 ID` 和 `编辑器内容` 也可能成为存储的一部分，或者存储可以管理"当前活动 Tex 文件"的概念。
	2. **替换 `notifyTexFilesUpdated()`** ：在保存/重命名/删除操作后， `TexEditorView` 应该直接在 `texFilesStore` 上调用一个动作（例如 `texFilesStore.refreshSavedTexFiles()` 或更具体的动作，如 `addFile` 、 `updateFile` 、 `removeFile` ）。然后，存储的状态将响应式更新， `App.vue` 的 `ScoreList` （它从 `texFilesStore.savedTexFiles` 读取）将自动更新。
	3. **替换 `window.addEventListener('tex-editor-action', ...)`** ：
		- 当 `App.vue` 需要使 `TexEditorView` 加载特定文件时，它不应该使用窗口事件。相反， `App.vue` 可以在 `texFilesStore` 中设置一个状态（例如 `texFilesStore.setCurrentFileToLoad(fileId)` ）。
		- `TexEditorView` 会接着 `  监视  ` 存储中的这个状态。当它变化时， `TexEditorView` 会加载相应的文件内容（同样，通过调用存储中的操作，比如 `await texFilesStore.fetchFileContent(fileId)` ，然后更新其本地 `editorContent` ）。或者，路由本身可以携带要编辑的文件的 ID（例如， `/editor/:fileIdToLoad?`），而 `TexEditorView` 可以对 `route.params` 的变化做出反应。

**本质上** ： `TexEditorView.vue` 目前是一个相当整体的组件，处理自己的 UI、状态和 Tex 文件的持久化。计划的优化是将 Tex 文件的状态管理和持久化逻辑委托给 `texFilesStore` ，使 `TexEditorView.vue` 主要负责用户界面和交互，并通过 Pinia 存储与其他应用部分通信。这将完美地符合我们已经做出的架构改进。