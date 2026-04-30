# 项目概览

这个仓库本质上是一个“模板分发器”：

- `packages/templates` 提供模板源文件。
- `packages/cli` 根据用户选择把模板复制到目标目录。
- `packages/shared` 为 CLI 提供交互、文件操作和命令执行基础设施。

## 目录结构

```text
packages/
  cli/        # 命令行入口与动作编排
  shared/     # 共用工具
  templates/  # 内置模板与模板清单
docs/         # VitePress 文档站
```

## 内置模板

当前默认模板共有 7 套：

- `monorepo`
- `nest`
- `node-tsdown`
- `node-vite`
- `nuxt`
- `react`
- `vue`

除此之外，CLI 还支持通过 `set` 命令注册自定义模板。

## 代码层面的关键事实

- `create` 命令支持 `monorepo`、`polyrepo`、`custom` 三种模式。
- `node` 框架会根据 `buildTool` 在 `node-vite` 和 `node-tsdown` 间切换。
- `react` 与 `vue` 的 `buildTool`、`type` 参数目前只参与交互流程，实际创建时始终复制固定模板，并不会切换模板内容。
- `monorepo` 模式会先复制 `template-monorepo`，再按所选子项目往 `packages/template-*` 目录追加模板。

后两点值得维护者关注，因为它们属于“接口承诺”和“当前实现”之间的差异。
