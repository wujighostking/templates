module.exports = {
  packagerConfig: {
    name: 'Template Electron',
    appBundleId: 'com.example.template-electron',
    asar: true,
    // 打包时忽略源码与构建配置，只保留 dist/ 与 dist-electron/ 运行时产物
    ignore: [
      '[/\\\\]src([/\\\\]|$)',
      '[/\\\\](vite\\.config\\.mts|forge\\.config\\.js|tsconfig\\.json)$',
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      // Windows 安装包（Squirrel）
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      // macOS zip
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      // Linux rpm
      name: '@electron-forge/maker-rpm',
      config: {},
    },
    {
      // Linux deb
      name: '@electron-forge/maker-deb',
      config: {},
    },
  ],
}
