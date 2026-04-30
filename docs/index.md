---
layout: home

hero:
  name: tmes
  text: 项目模板与 CLI 文档
  tagline: 基于仓库当前实现整理，覆盖 monorepo、内置模板、CLI 工作流和实际行为。
  actions:
    - theme: brand
      text: 开始阅读
      link: /guide/
    - theme: alt
      text: 查看模板
      link: /templates/

features:
  - title: 围绕真实代码
    details: 文档内容直接来自 packages/cli、packages/shared 和 packages/templates 的现有实现，而不是理想化说明。
  - title: 模板可选项清晰
    details: 汇总 monorepo、React、Vue、Nuxt、Nest 和两套 Node 模板的差异，方便快速选型。
  - title: 兼顾使用与维护
    details: 同时说明使用者如何创建项目，以及维护者如何扩展自定义模板和调整仓库结构。
---

`tmes` 是一个 `pnpm workspace` 模板仓库，核心由三部分组成：

- `@tmes/cli`：对外暴露 `tmes`、`tm`、`create-template` 三个命令入口。
- `@tmes/shared`：封装日志、文件系统、命令执行、交互提示等共享能力。
- `@tmes/templates`：存放所有可复制的项目模板与 `templates.json` 模板清单。

如果你是第一次接触这个仓库，先看 [快速开始](/guide/getting-started)；如果你要判断该选哪个模板，直接进入 [模板总览](/templates/)。
