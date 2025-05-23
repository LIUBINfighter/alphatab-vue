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
            { text: '实现', link: '/custom-style/implementation' }
          ]
        }
      ],
      '/wiki/': [
        {
          text: '文档',
          items: [
            { text: 'API', link: '/wiki/API' },
            { text: '组件', link: '/wiki/COMPONENTS' }
          ]
        }
      ]
    }
  }
})