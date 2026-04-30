# 仓库架构

## packages/cli

`packages/cli` 负责两件事：

- 定义命令和选项
- 把用户输入路由到具体 action

关键文件：

- `src/index.ts`：初始化 `CAC`，注册命令并挂载全局异常处理
- `src/commands/index.ts`：集中定义所有命令签名
- `src/actions/createAction.ts`：创建项目的主流程
- `src/createApps/*`：把框架选择映射到具体模板复制逻辑

## packages/shared

`packages/shared` 是 CLI 的底层工具层，统一输出以下能力：

- 日志
- 文件系统操作
- 命令执行
- 交互式 prompts
- YAML 读写
- OS 与依赖相关工具

在实现上，`src/index.ts` 只是导出聚合入口，具体能力拆在多个小目录里维护。

## packages/templates

这个包既是模板仓库，也是模板注册表：

- `templates.json` 记录模板名和相对路径
- `template-*` 目录保存实际可复制文件

CLI 创建项目时不会“生成”代码，而是直接复制这里的模板目录。

## 模板复制机制

`createTemplate()` 的逻辑很直接：

1. 从 `@tmes/templates` 读取 `templates.json`
2. 按模板名找到模板路径
3. 定位到 `node_modules/@tmes/templates/<template-path>`
4. 把模板内容复制到目标目录

这意味着：

- 模板变更主要发生在 `packages/templates`
- CLI 逻辑变更主要发生在 `packages/cli`
- 模板命名和 `templates.json` 必须保持一致

## 维护注意点

- `commands/index.ts` 和 `createAction.ts` 里的参数语义要保持同步，否则文档和交互会出现偏差。
- `react` / `vue` 的 `buildTool`、`type` 还没有映射到不同模板，后续如果要支持多模板分支，需要先补齐 `createReactApp()` / `createVueApp()` 的选择逻辑。
- `setTemplateAction()` 会把模板写入 `node_modules/@tmes/templates`，适合本地扩展和实验，但如果希望模板可追踪、可发布，仍应回写到仓库源码。
