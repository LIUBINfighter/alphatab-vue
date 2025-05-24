export const QUICK_DOCS_CONTENT = `
## Jump to Deepwiki

如果对 Alphatex 语法或者 Alphatab.js 有什么疑惑，问 Deepwiki 是最快的。

[基于官方文档的问答 repo:alphaTabWebsite](https://deepwiki.com/CoderLine/alphaTabWebsite) | [基于API的问答 repo:alphaTab](https://deepwiki.com/CoderLine/alphaTab/)

# AlphaTab QuickDocs

快速文档包含对**网页**和**AlphaTex语法**的简单介绍。

直接打开网站便是核心的展示曲谱和控制栏组件！挨个试一遍就知道什么意思了。

从左到右依次为 **曲谱标题 时间戳 停止 播放/暂停 播放速度 延迟一个小节播放 节拍器 循环播放 打印pdf 下载gp谱 缩放倍数 默认/横向显示 暗色模式 切换主题 当前音轨**.

侧边栏是**音轨和曲谱显示控制**，打开即可看见简单的指示。

## 切换曲谱以及跳转到编辑器页面

右上角的 **Menu** 按钮点击后可以选择切换曲谱或者切换到AlphaTex编辑器页面.

这些曲谱存放在仓库内，暂时不支持上传，有需要的可以到github repo提issue或者pr.

## AlphaTex 编辑器

左侧为**Codemirror**编辑器，高亮逻辑暂时使用**javascript**。

右侧为一个简化版的曲谱展示组件用于**预览和试听曲谱**。

**AlphaTex** 是 **AlphaTab.js** 包内置的一款极简标记吉他谱语言，即使没有学过乐理或者 Guitar Pro也能很快上手书写。

接下来介绍我自己在扒谱中最常用到的 AlphaTex 知识点（单轨道独奏，一章，包含扫弦/滑音/打板/闷音等简单的技巧），详细了解可访问[官英文档](https://www.alphatab.net/docs/alphatex/introduction)搭配沉浸式翻译或者问Deepwiki(开头链接)获得代码层面的解答。

### 文本型元数据标签

以下任选内容书写，也可以都不写，对演奏不会有任何影响

\`\`\` tex
\\title "乐谱标题"
\\subtitle "副标题"
\\artist "艺术家"
\\album "专辑名称"
\\words "作词者"
\\music "作曲者"
\\copyright "版权信息"
\\tab "制谱者"
\`\`\`

### 演奏型元数据标签

以下内容会对节奏，音符，特殊调弦等有影响，如果不填写将会使用默认设置。

\`\`\` tex
\\tempo 175 
\\instrument 25
\\tuning g4 d4 bb3 f3 c3 g2
\\capo 4
\`\`\` 

### 基本音符单元

写完元数据后记得写一个点 **.** 表示新开一章。

首先我们是在写吉他Tab谱！（六线谱） 所以我们考量音符的角度是在哪根弦弹几品。

音符的基本格式是 **品位.弦号.时值** 。休止符用 **r** 代替品位

由于确定一个音弹多久（即时值推断）比较难，我的方式是第一遍确定键位**x.y**，第二遍确定节奏**x.y.z**

AlphaTex解析引擎自带一定的时值解析功能，可以先听一遍看看准不准，然后有针对性地去调整。

如果出现一次弹奏多个音符则使用英文括号 () 括起来: (品位.弦号 品位.弦号).时值

\`\`\`tex

\`\`\`

写完一节后用小节线 | 表示此小节结束.

### 技巧符号

## 背景

本网站是我看了孤独摇滚之后写的网站，之前只是为了展示简单的gp谱以便练习**吉他与孤独与蓝色星球**，有扒谱的需求之后加上了 AlphaTex 编辑器.(为什么要演奏......)

参考了 AlphaTab [官方文档](https://www.alphatab.net/) 以及 [汇尘轩-锦恢的博客](https://kirigaya.cn/ktools/alphatab).

本网站使用 vue3 和 codemirror 重构 [原纯html网站](https://liubinfighter.github.io/AlphaTexSample/)(FOUC样式丢失警告.jpg).



`

/*



*/


// 初始版本 自动生成的，评价为不好改
// export const QUICK_DOCS_CONTENT = `
// # 欢迎使用 AlphaTab Vue

// ## 关于本网站

// 这是一个基于 **AlphaTab** 和 **Vue.js** 构建的吉他谱在线编辑器和播放器。

// ### 主要功能

// - **吉他谱编辑**: 直观的界面，支持多种编辑操作
// - **实时播放**: 内置音频引擎，支持实时播放吉他谱
// - **多格式支持**: 支持导入和导出多种吉他谱格式
// - **响应式设计**: 适配桌面端和移动端设备

// ### 快速开始

// 1. **加载乐谱**: 点击"打开文件"按钮选择本地吉他谱文件
// 2. **播放控制**: 使用底部播放控制器播放、暂停、调整速度
// 3. **编辑功能**: 双击音符进行编辑，使用工具栏添加各种记号
// 4. **导出分享**: 完成编辑后可导出为多种格式

// ### 支持的格式

// - **Guitar Pro** (.gp3, .gp4, .gp5, .gpx)
// - **TuxGuitar** (.tg)
// - **PowerTab** (.ptb)
// - **MusicXML** (.xml, .musicxml)

// ### 键盘快捷键

// - \`Space\`: 播放/暂停
// - \`Ctrl + O\`: 打开文件
// - \`Ctrl + S\`: 保存文件
// - \`Ctrl + Z\`: 撤销
// - \`Ctrl + Y\`: 重做

// ### 技术栈

// - **前端框架**: Vue.js 3 + TypeScript
// - **音乐引擎**: AlphaTab
// - **UI 组件**: 自定义组件库
// - **图标库**: Lucide Vue Next

// ### 联系我们

// 如果您在使用过程中遇到任何问题或有建议，欢迎通过以下方式联系我们：

// - **GitHub**: [alphatab-vue](https://github.com/yourusername/alphatab-vue)
// - **Issues**: 在 GitHub 仓库中提交问题
// - **文档**: 查看完整的在线文档

// ---

// *感谢您使用 AlphaTab Vue！*
// `