# Changelog

## [Unreleased]

### Added

- 新增 `changesets` 发版流程，统一管理多包版本、包间依赖更新和发布说明。
- 新增 GitHub Actions 发布工作流，支持在 `v2` 分支上自动创建版本 PR 或发布 npm 包。
- 新增 `RELEASING.md`，明确本地发版命令、CI/CD 规则和发布前检查项。

## [2.0.0] - 2026-05-06

### Added

- 发布 `@tmes/cli`、`@tmes/shared`、`@tmes/templates` 三个工作区包。
- 提供 `create`、`list`、`pkg`、`commitlint`、`githooks`、`lint-preset`、`oxlint`、`oxfmt` 等 CLI 能力。
- 内置 `monorepo`、`react`、`vue`、`nuxt`、`nest`、`node-vite`、`node-tsdown` 等模板。
- 支持 `pnpm workspace`、模板复制、依赖写入、模板忽略规则、Git 初始化和多种项目交互选项。
- 补充文档站、README、基础 CI 和测试用例。

### Changed

- 统一仓库为 `pnpm workspace` 管理，依赖版本收敛到 catalog。
- 优化创建项目时的依赖刷新、子包依赖同步和模板文件结构。
- 调整 CLI 二进制入口、构建配置和 TypeScript 产物结构。

### Fixed

- 修复 workspace 路径识别、导入路径、类型声明路径和构建入口问题。
- 修复模板忽略规则、异步命令执行、手动中断报错和跨平台兼容问题。
- 修复 Vue / Nuxt / UnoCSS 相关模板缺失文件与配置异常。
