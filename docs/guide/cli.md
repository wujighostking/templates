# CLI 命令

## 命令入口

`@tmes/cli` 在 `packages/cli/package.json` 中暴露了三个二进制命令：

- `create-template`
- `tm`
- `tmes`

它们都指向同一个入口文件：`packages/cli/lib/index.js`。

## create

```bash
tm create [name]
```

支持的选项：

- `--name, -n [name]`
- `--mode, -m [mode]`
- `--buildTool, -b [buildTool]`
- `--type, -t [type]`
- `--framework, -f [framework]`

### mode

- `polyrepo`
- `monorepo`
- `custom`

### polyrepo 流程

可选框架：

- `react`
- `vue`
- `nest`
- `nuxt`
- `node`

其中：

- `node` 会根据 `buildTool` 选择 `template-node-vite` 或 `template-node-tsdown`
- `react`、`vue` 当前不会根据 `buildTool` 切换模板
- `nest`、`nuxt` 直接复制固定模板

### monorepo 流程

执行顺序如下：

1. 复制 `template-monorepo`
2. 根据多选框架，将模板复制到 `packages/template-<framework>`
3. 对 `node` 子项目按 `buildTool` 选择 `node-vite` 或 `node-tsdown`
4. 在目标目录执行 `pnpm pkg set name=<project-name>`
5. 写入 lint preset 并执行项目初始化流程

### custom 流程

`custom` 模式只展示非默认模板，也就是通过 `set` 命令额外注册的模板。

## 模板管理

列出全部模板：

```bash
tm list
```

注册自定义模板：

```bash
tm set <template-name> <template-path>
```

删除模板：

```bash
tm delete <...template-names>
```

## 配置辅助命令

以下命令用于向项目中补充常用工程化配置：

- `tm commitlint`
- `tm githooks`
- `tm lintstaged`
- `tm oxlint`
- `tm oxfmt`
- `tm lint-preset`

`lint-preset` 会一次性串起 `commitlint`、`githooks`、`lint-staged`、`oxlint`、`oxfmt` 的写入流程。
