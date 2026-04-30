# React

`template-react` 是一个基于 React 19 和 Vite 8 的前端模板。

## 技术栈

- React 19
- React Router 7
- Vite 8
- UnoCSS
- oxlint / oxfmt

## 脚本

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm format
```

## 适合场景

- 管理后台
- 中小型 SPA
- 需要 React Compiler 的实验性项目

## 当前实现注意点

CLI 虽然会在交互中询问 `buildTool` 和 `type`，但 `createReactApp()` 目前始终只复制 `template-react`，不会因为选项变化而切换模板。
