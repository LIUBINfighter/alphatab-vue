# alphaTab Vue 项目

## 技术栈

- **框架**: Vue 3
- **语言**: TypeScript
- **核心库**: Alphatab.js Codemirror.js
- **构建工具**: Vite
- **Runtime**: Bun
- **图标库**: [lucide](https://lucide.dev/)  
  安装命令: `bun add lucide-vue-next`

---

## 开发计划

### Working Set

#### 2025-05-21

- 完整css类 -> 暗色主题适配 -> 多个 built-in 主题
  - 修改切换主题的按钮为下拉栏
  - 修改多个主题的默认导出，添加到对应的内容
- 额外api微调关键元素样式

### `SimpleDisplay.vue` 和 `ControlBar.vue`

- 支持通过 `props` 传入自定义组件选项，决定呈现哪些组件。
- 优化显示逻辑。
- 控制栏目前仅支持底部布局，计划支持顶部和左右侧栏布局。
- 增强移动端适配。

### `TexEditorView.vue` 和 `TexEditor.vue`

- 增强代码编辑器功能。
- 当前高亮基于 JavaScript，但对于 `品位.弦号.时值` 三个位置缺乏特殊编码和显示逻辑。

示例代码：
```js
r.4 | 
:8 (3.5 0.3){d} 2.3{d} (3.5 0.3){d} 3.2{d} (3.5 0.3){d} 3.2 |
(3.5 0.3){d} 2.3{d} (0.3 3.5){d} 3.2{d} (0.3 3.5){d} 2.3 |
(2.3{gr} 2.5) 0.3 2.3 (0.3 2.5) 3.2 (0.3 2.5) 2.3 |
```

---

## 项目目标

1. 复现 [alphaTab 官方文档教程](https://www.alphatab.net/docs/tutorial-web/introduction)内容：
   - 基本音轨控制及切换。
   - 控制栏按钮。
   - 查看歌曲标题和艺术家信息。
   - 启用/禁用倒数计时。
   - 启用/禁用节拍器。
   - 启用/禁用循环播放。
   - 打印乐谱。
   - 更改缩放级别。
   - 更改乐谱布局。

2. 使用 [deepwiki](https://deepwiki.com/CoderLine/alphaTabWebsite) 和示范仓库，结合以下功能扩展：
   - 自定义功能：[各类自定义](https://www.alphatab.net/docs/guides/coloring)。
   - 使用 [API](https://www.alphatab.net/docs/reference/settings/) 进行功能开发。
   - 高亮显示当前小节。
   - 实现曲谱自动滚动。

3. 自定义主题

4. Alphatex 编辑器
