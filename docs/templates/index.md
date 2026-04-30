# 模板总览

## 模板矩阵

| 模板          | 适用场景          | 关键技术                              |
| ------------- | ----------------- | ------------------------------------- |
| `monorepo`    | 多包仓库骨架      | `pnpm workspace`、`turbo`、TypeScript |
| `react`       | 前端单页应用      | React 19、Vite 8、UnoCSS              |
| `vue`         | Vue 3 单页应用    | Vue 3、Vite 8、Vue Router、UnoCSS     |
| `nuxt`        | 全栈 Vue 应用     | Nuxt 4、UnoCSS                        |
| `nest`        | Node 服务端应用   | NestJS                                |
| `node-vite`   | Node 库构建       | Vite library mode、`vite-plugin-dts`  |
| `node-tsdown` | TypeScript 库模板 | `tsdown`、TypeScript                  |

## 如何选择

- 需要统一管理多个应用或包：选 `monorepo`
- 需要开箱即用前端 SPA：选 `react` 或 `vue`
- 需要 Vue 全栈 SSR：选 `nuxt`
- 需要后端 API 服务：选 `nest`
- 需要发布 Node/TypeScript 库：优先看 `node-tsdown`，若更偏向 Vite 生态可选 `node-vite`

## 默认模板与自定义模板

CLI 内部把以下模板视为默认模板：

- `react`
- `vue`
- `nest`
- `nuxt`
- `node-tsdown`
- `node-vite`
- `monorepo`

只有不在这个集合中的模板，才会出现在 `custom` 模式下。
