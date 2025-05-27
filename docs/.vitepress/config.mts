import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AlphaTab Vue 文档',
  description: 'AlphaTab Vue组件库文档',
  base: '/alphatab-vue/docs/',
  ignoreDeadLinks: [
    // './../../src/views/ScorePlayerView.vue',
    // './../../src/views/TexEditorView.vue'
  ],
  themeConfig: {
    nav: [ // 顶部导航
      { text: '首页', link: '/' },
      { text: '快速上手', link: '/welcome/' },
      { text: '设计架构', link: '/architecture/' },
      { text: '开发指南', link: '/develop/' },
      { text: '开发历程', link: '/pathway/engineering-logs/' }, // 可链接到日志概览页或第一篇日志
    ],
    sidebar: {
      '/welcome/': [
        {
          text: '欢迎 & 快速上手',
          items: [
            { text: '项目简介', link: '/welcome/' },
            { text: '播放器界面', link: '/welcome/player' },
            { text: 'AlphaTex编辑器界面', link: '/welcome/alphatex' },
            { text: '开发环境与依赖', link: '/welcome/development' },
            { text: '与 AI 协作的开发流程', link: '/welcome/workflow' },
            { text: 'SOP速查',link:'/welcome/sop'}
          ],
        },
      ],
      '/guide/':[
        {
          text: '使用指南',
          collapsed: true,
          items: [
            { text: 'QuickDocs' , link: '/guide/'},
            { text: '播放器' , link: '/guide/player'},
            { text: 'alphatex编辑器',
              collapsed: true,
              items: [
                { text: '基础语法', link:'/guide/alphatex/' },
              ],
            },

          ],
        },
      ],
      '/architecture/': [
        {
          text: '设计与架构',
          items: [
            { text: '整体架构概览', link: '/architecture/' },
            { text: '组件设计与关系', link: '/architecture/component' },
            { text: '视图管理', link: '/architecture/view-management' },
            { text: '样式与主题架构', link: '/architecture/styling' },
            { text: 'SimpleDisplay', link: '/architecture/components-simple-display' },
            { text: 'TexEditorView', link: '/architecture/components-tex-editor-view' },
          ],
        },
      ],
      '/develop/': [
        {
          text: '开发指南',
          items: [
            { text: '自定义主题与样式', link: '/develop/styling' },
            { text: '组件自定义与扩展', link: '/develop/component-customization' },
            { text: 'AlphaTex 编辑器指南', link: '/develop/alphatex-editor-guide' },
            { text: 'API 使用', link: '/develop/api-usage' }, // 视情况添加
            { text: '部署指南', link: '/develop/deployment-guide' },
          ],
        },
      ],
      '/pathway/': [ // 开发历程与追踪
        {
          text: '工程日志',
          collapsed: false, // 根据偏好设置是否默认折叠
          items: [
            // 示例链接，文件名需要你根据实际情况统一
            { text: '05-27 模板和SOP', link: '/pathway/diary/'},
            { text: '双站点部署方案', link: '/pathway/diary/dual-site-deployment' },
            { text: '日志：修复 GitHub Pages 深层链接', link: '/pathway/diary/gh-pages-deep-links' },
            // ... 更多日志
          ],
        },
        {
          text: '工作集',
          collapsed: false,
          items: [
            { text: '记录：暗色模式 CSS 调试', link: '/pathway/working-set/dark-mode-css-debug' },
            { text: '记录：CodeMirror 插件崩溃分析', link: '/pathway/working-set/codemirror-crash' },
            // ... 更多记录
          ],
        },
        {
          text: '版本更新日志',
          items: [{ text: 'Changelog', link: '/pathway/changelog' }], // 通常是一个 Changelog.md
        },
        {
          text: '功能规划与提案',
          collapsed: true, // 规划类内容较多时可默认折叠
          items: [
            { text: '规划：暗色模式需求定义', link: '/pathway/planning/dark-mode-requirements' },
            { text: '提案：QuickDocs 弹窗功能', link: '/pathway/planning/quickdocs-modal-proposal' },
            // ... 更多规划文档
          ],
        },
      ],
    }
}})