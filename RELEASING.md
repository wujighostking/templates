# Release Guide

## 发布对象

当前仓库是 `pnpm workspace + turbo` 的 monorepo，实际发布到 npm 的包只有：

- `@tmes/cli`
- `@tmes/shared`
- `@tmes/templates`

根包 `tmes` 和 `docs` 仅用于仓库管理，不参与发布。

## 发版方式

仓库已经切换为 `changesets` 管理版本和变更说明，配合 Conventional Commits 使用：

1. 开发完成后执行 `pnpm changeset`
2. 选择需要发版的包，以及版本级别 `patch | minor | major`
3. 用中文或英文写本次变更说明
4. 提交代码和 `.changeset/*.md`
5. 合并到 `v2` 分支
6. GitHub Actions 会自动创建版本 PR，或在版本 PR 合并后自动发布到 npm

## 本地常用命令

```bash
pnpm changeset
pnpm release:status
pnpm version-packages
pnpm release
```

命令说明：

- `pnpm changeset`：新增发版说明文件
- `pnpm release:status`：查看待发版包和版本变更
- `pnpm version-packages`：写入版本号、更新包间依赖、生成各包 changelog
- `pnpm release`：构建并发布到 npm

## CI / CD 规则

- `ci.yml`：负责 `lint`、`test`、`build`
- `release.yml`：监听 `v2` 分支，使用 `changesets/action` 自动创建版本 PR 或发布
- 发布依赖仓库密钥 `NPM_TOKEN`

## 发布前检查

- Node 版本与 `.node-version` 一致
- 使用 `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run test`
- `pnpm run build`
- npm 组织下允许发布 `@tmes/*` 的 public scoped packages
