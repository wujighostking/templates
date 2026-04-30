# Node + tsdown

`template-node-tsdown` 是一套更偏库开发的 TypeScript 模板。

## 技术栈

- TypeScript
- `tsdown`

## 脚本

```bash
pnpm dev
pnpm build
pnpm test
pnpm typecheck
```

## 适合场景

- npm 包开发
- 希望更直接使用 `tsdown` 的项目

## 特点

- `exports` 默认指向 `dist/index.mjs`
- `prepublishOnly` 会在发布前自动执行构建
- 模板中已经预留库项目常见字段，如 `repository`、`bugs`、`homepage`
