import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AlphaTab Vue 文档',
  description: 'AlphaTab Vue组件库文档',
  base: '/docs/',
  themeConfig: {
    nav: [
      { text: '指南', link: '/custom-style/first-step' },
      { text: 'API', link: '/wiki/API' },
      { text: '开发', link: '/wiki/DEVELOPMENT' }
    ],
    sidebar: {
      '/custom-style/': [
        {
          text: '自定义样式',
          items: [
            { text: '入门', link: '/custom-style/first-step' },
            { text: '实现', link: '/custom-style/implementation' },
            { text: '颜色方案', link: '/custom-style/color-scheme' },
            { text: '暗色模式', link: '/custom-style/darkmode-prompt' },
            { text: '帮助', link: '/custom-style/help' },
            { text: '问题', link: '/custom-style/question' }
          ]
        }
      ],
      '/issue/': [
        {
          text: '问题跟踪',
          items: [
            { text: '不完整应用', link: '/issue/imcomplete-apply' }
          ]
        }
      ],
      '/refactor/': [
        {
          text: '重构记录',
          items: [
            { text: '清理事件', link: '/refactor/clean-emit' }
          ]
        }
      ],
      '/usecase/': [
        {
          text: '使用案例',
          items: [
            { text: '自定义控制栏', link: '/usecase/CustomControlBar' }
          ]
        }
      ],
      '/wiki/': [
        {
          text: '文档',
          items: [
            { text: 'API', link: '/wiki/API' },
            { text: '组件', link: '/wiki/COMPONENTS' },
            { text: '开发指南', link: '/wiki/DEVELOPMENT' },
            { text: 'README', link: '/wiki/README' }
          ]
        }
      ],
      '/working-set/': [
        {
          text: '工作集',
          items: [
            { text: '主题对比', link: '/working-set/compare-theme' },
            { text: '完整主题', link: '/working-set/complete-theme' },
            { text: '暗色主题', link: '/working-set/dark-theme' },
            { text: '意外白边', link: '/working-set/unexpected-white-border' }
          ]
        }
      ]
    }
  }
})