import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'tmes',
  description: 'tmes 模板仓库文档，覆盖 CLI、架构和内置模板。',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  cacheDir: '/.vitepress/cache',
  head: [['meta', { name: 'theme-color', content: '#c2410c' }]],
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '模板', link: '/templates/' },
      { text: 'GitHub', link: 'https://github.com/wujighostking/templates' },
    ],
    search: {
      provider: 'local',
    },
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '项目概览', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: 'CLI 命令', link: '/guide/cli' },
            { text: '仓库架构', link: '/guide/architecture' },
          ],
        },
      ],
      '/templates/': [
        {
          text: '模板',
          items: [
            { text: '模板总览', link: '/templates/' },
            { text: 'Monorepo', link: '/templates/monorepo' },
            { text: 'React', link: '/templates/react' },
            { text: 'Vue', link: '/templates/vue' },
            { text: 'Nuxt', link: '/templates/nuxt' },
            { text: 'Nest', link: '/templates/nest' },
            { text: 'Node + Vite', link: '/templates/node-vite' },
            { text: 'Node + tsdown', link: '/templates/node-tsdown' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/wujighostking/templates' }],
    footer: {
      message: 'Built with VitePress',
      copyright: 'MIT',
    },
  },
})
