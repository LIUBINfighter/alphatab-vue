# 项目日记：AlphaTab-Vue 重构

**日期：** 2025-05-24

## 条目：调试特定 CodeMirror 崩溃：`TypeError: tags3 is not iterable` 事件

### 问题

成功开发了一个为 AlphaTex 定制的 CodeMirror 6 语言包（解析器、高亮器通过 `StreamLanguage` 实现）。然而，在集成到 `TexEditor.vue` 后，CodeMirror 插件在 Vite 开发环境（通过 `bun run dev` 运行）中崩溃，抛出 `TypeError: tags3 is not iterable` 错误。该错误源自 `@codemirror/language` 模块内部，具体与 `HighlightStyle` 处理相关。因此，AlphaTex 的自定义语法高亮未能应用。

一个奇特且关键的线索是，*完全相同的代码*在构建并部署到 GitHub Pages 时运行得非常完美。这强烈表明问题出在环境上，而不是我们 AlphaTex 语言包逻辑中的根本缺陷。

## 调查与尝试

1. **初始假设 - 故障高亮配置**  
   我们的第一个想法是 `HighlightStyle.define` 数组在 `highlight.js` 中存在错误，或者我们的 `tokenTable`（将解析器标记类型链接到 Lezer `tags`）映射不正确。我们仔细检查了从 `@lezer/highlight` 导入的所有 `tags`，确保它们是有效的（例如，将一个非标准的 `tags.controlKeyword` 的潜在误用更正为有效的 `tags.labelName`）。

2. **代码修正**  
   实现了修正的标签映射。然而，错误仍然存在于开发服务器中，这令人困惑，因为代码在生产环境构建时是正确的。

3. **焦点转移 - 开发环境**  
   开发环境与生产环境的差异使我们怀疑以下问题：
   - Vite 的开发服务器模块解析或缓存 `@lezer/highlight`
   - `node_modules` 依赖项状态不一致
   - 潜在的 HMR（热模块替换）错误

4. **调试策略**  
   主要建议包括：
   - 在开发环境中直接在 `highlight.js` 中记录从 `@lezer/highlight` 导入的 `tags` 对象，以检查其结构和完整性
   - 暂时简化 `HighlightStyle` 的定义，只保留已知有效的标签集
   - 清除 Vite 的缓存

## 解决方案 & 根本原因

在广泛记录或简化之前，问题通过更直接的方法得到解决：

1. 完全删除 `node_modules` 目录
2. 使用 `bun i` 执行全新的依赖安装
3. 使用 `bun run dev` 重启 Vite 开发服务器

这立即解决了 `TypeError: tags3 is not iterable` 崩溃问题，并且自定义 AlphaTex 语法高亮在开发环境中按预期工作。

## 结论与要点

根本原因几乎肯定是 node_modules 目录内部损坏或不一致的状态，或与之相关的缓存问题（无论是 Vite 的内部缓存还是 Bun 对模块的处理）。重新安装依赖通过确保所有包（包括@lezer/highlight 及其 tags 导出）都被 Vite 开发服务器正确且干净地加载解决了这个问题。

尽管具体的错误信息可能显得有些特殊，但其根本原因（过时/损坏的 `node_modules` 或打包器缓存问题）是 JavaScript 开发中常见的麻烦。这次事件再次证明了"删除 `node_modules` 并重新安装"这一策略的有效性，尽管它有些粗暴，但对于无法解释的环境特定错误来说是一个宝贵的故障排除步骤。