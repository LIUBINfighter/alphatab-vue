

## 开发计划

`SimpleDisplay.vue` `ControlBar.vue`
- 添加自定义组件的选项，通过传入props决定呈现哪些组件
- 优化显示逻辑
- 移动端适配

`TexEditorView.vue` `TexEditor.vue`
- 代码编辑器Feature

## 胡乱写的

alphaTab

Vue 3
TypeScript
Vite
Bun

图标库 [lucide](https://lucide.dev/)

`bun add lucide-vue-next`

整体思路

1.复现[官方文档教程内容](https://www.alphatab.net/docs/tutorial-web/introduction)

- 基本音轨控制以及切换
- 控制栏按钮
- 查看歌曲标题和艺术家
- 启用/禁用倒数
- 启用/禁用节拍器
- 启用/禁用循环
- 打印乐谱
- 更改缩放级别
- 更改乐谱布局

2.使用[deepwiki](https://deepwiki.com/CoderLine/alphaTabWebsite)结合示范仓库进行功能添加[各类自定义](https://www.alphatab.net/docs/guides/coloring)以及使用[API](https://www.alphatab.net/docs/reference/settings/)。

- 高亮显示当前小节
- 曲谱自动滚动


