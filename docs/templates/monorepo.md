# Monorepo

`template-monorepo` 是整个仓库的基础骨架，用于承载多个子模板。

## 包含内容

- 根 `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `tsconfig.json`
- 基础编辑器与忽略文件

## 使用方式

当你执行：

```bash
tm create my-workspace --mode monorepo
```

CLI 会先复制这套骨架，再把所选模板追加到：

```text
packages/template-react
packages/template-vue
packages/template-node
packages/template-nest
packages/template-nuxt
```

其中 `node` 子项目会进一步根据 `buildTool` 选择 `node-vite` 或 `node-tsdown`。

## 特点

- 强制使用 `pnpm`
- 默认集成 `turbo run dev` / `turbo run build`
- 适合作为多应用、多包模板分发的上层容器
