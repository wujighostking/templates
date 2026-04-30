# 快速开始

## 环境要求

- Node.js：仓库根目录当前使用 `.node-version` / `.nvmrc` 指向 `22`
- 包管理器：`pnpm@10`

## 安装依赖

```bash
pnpm install
```

## 本地开发

```bash
pnpm dev
```

这会通过 Turborepo 运行各工作区的开发任务。

## 使用 CLI 创建项目

工作区里已经暴露了三个命令别名：

- `tmes`
- `tm`
- `create-template`

常见示例：

```bash
tm create my-app
tm create my-admin --mode polyrepo --framework react
tm create my-lib --mode polyrepo --framework node --buildTool tsdown
tm create my-workspace --mode monorepo
tm list
```

`create` 命令默认会进入交互流程，让你补齐项目名、模式、框架和构建工具。

## 文档开发

```bash
pnpm docs:dev
```

## 文档构建

```bash
pnpm docs:build
pnpm docs:preview
```
