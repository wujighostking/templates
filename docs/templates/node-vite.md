# Node + Vite

`template-node-vite` 适合需要构建 Node 库、并且希望沿用 Vite library mode 的场景。

## 技术栈

- TypeScript
- Vite 8
- `vite-plugin-dts`

## 构建方式

模板通过 `vite.config.ts` 使用 library mode：

- 入口：`src/main.ts`
- 输出格式：`es`
- 类型声明：由 `vite-plugin-dts` 生成

## 脚本

```bash
pnpm dev
pnpm build
```

## 适合场景

- ES Module Node 库
- 更习惯 Vite 配置和插件生态的工具包项目
