import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AlphaTab Vue 文档',
  description: 'AlphaTab Vue组件库文档',
  base: '/alphatab-vue/docs/',
  themeConfig: {
    nav: [
      { text: '指南', link: '/custom-style/first-step' },
      { text: 'API', link: '/wiki/API' },
      { text: '开发', link: '/wiki/DEVELOPMENT' }
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '快速入门', link: '/custom-style/first-step' },
          { text: '样式实现', link: '/custom-style/implementation' },
          { text: '颜色方案', link: '/custom-style/color-scheme' },
          { text: '暗色模式', link: '/custom-style/darkmode-prompt' }
        ]
      },
      {
        text: '开发文档',
        items: [
          { text: 'API参考', link: '/wiki/API' },
          { text: '组件文档', link: '/wiki/COMPONENTS' },
          { text: '开发指南', link: '/wiki/DEVELOPMENT' },
          { text: 'README', link: '/wiki/README' }
        ]
      },
      {
        text: '实用资源',
        items: [
          { text: '控制栏组件', link: '/usecase/CustomControlBar' },
          { text: 'Tex编辑器视图', link: '/views/TexEditorView' },
          { text: '主题对比', link: '/working-set/compare-theme' },
          { text: '完整主题模板', link: '/working-set/complete-theme' },
          { text: '暗色主题实现', link: '/working-set/dark-theme' },
          { text: '部署方案', link: '/working-set/deployment-plan' },
          { text: '代码高亮方案', link: '/working-set/highlight-code' },
          { text: '快速文档按钮', link: '/working-set/quick-docs' },
          { text: '全局组件白边问题', link: '/working-set/unexpected-white-border' }
        ]
      },
      {
        text: '问题与优化',
        items: [
          { text: '暗色样式应用不完全', link: '/issue/imcomplete-apply' },
          { text: '(弃用)重构记录', link: '/refactor/clean-emit' },
          { text: '(Prompt)样式问题描述', link: '/custom-style/question' },
          { text: '(Deepwiki)alphaTab自定义渲染帮助', link: '/custom-style/help' },
          { text: 'CodeMirror插件崩溃', link: '/issue/codemirror-plugin-crash' },
          { text: '部署问题', link: '/issue/deploy' },
          { text: 'Roll-up (github action)', link: '/issue/Roll-up' },
          { text: 'Vitepress部署', link: '/issue/vitepress' },
          { text: '(vue router)路由重构', link: '/refactor/router' }
        ]
      }
    ]
  }
})