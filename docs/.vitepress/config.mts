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
          { text: '使用案例', link: '/usecase/CustomControlBar' },
          { text: 'Tex编辑器视图', link: '/views/TexEditorView' },
          { text: '主题对比', link: '/working-set/compare-theme' },
          { text: '完整主题', link: '/working-set/complete-theme' }
        ]
      },
      {
        text: '问题与优化',
        items: [
          { text: '已知问题', link: '/issue/imcomplete-apply' },
          { text: '重构记录', link: '/refactor/clean-emit' },
          { text: '样式问题', link: '/custom-style/question' },
          { text: '帮助文档', link: '/custom-style/help' }
        ]
      }
    ]
  }
})