# tmes 项目说明

`tmes` 是一个基于 `pnpm workspace` 的项目模板仓库，核心职责是通过 CLI 把内置模板复制到目标目录。

## 仓库组成

- `packages/cli`：命令行入口与创建流程编排
- `packages/shared`：日志、文件系统、命令执行、交互等共享能力
- `packages/templates`：模板目录与 `templates.json` 模板清单
- `docs`：VitePress 文档站

## 环境要求

- Node.js `22`（由 `.node-version` / `.nvmrc` 指定）
- `pnpm@10`

## 快速开始

```bash
pnpm install
pnpm dev
```

## CLI 常用命令

```bash
tm create my-app
tm create my-admin --mode polyrepo --framework react
tm create my-lib --mode polyrepo --framework node --buildTool tsdown
tm create my-workspace --mode monorepo
tm list
```

命令别名：

- `tmes`
- `tm`
- `create-template`

## 模板清单

- `monorepo`
- `react`
- `vue`
- `nuxt`
- `nest`
- `node-vite`
- `node-tsdown`

## 文档相关命令

```bash
pnpm docs:dev
pnpm docs:build
pnpm docs:preview
```
