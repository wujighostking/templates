## Installation

```
npm i @tmes/cli -g
```

如果不想全局安装，可以执行以下命令创建项目:

```
pnpm create tmes
```

create \<projectName> 创建项目

```
tmes create project
```

pkg [dir] \[packageName]/-n=packageName 添加一个包到项目dir目录中

```
tmes pkg packages play/-n=play
```

set \<dirname> [templateName] 设置自定义模板

```
tmes set play template
```

cp \<template> [projectName] 复制已有模板到自定义文件夹

```
tmes cp template projectName
```

ls 展示已有的模板

```
tmes ls
```

delete \<template> 删除已有的模板

```
tmes delete template
```

commitlint 设置 commitlint 配置

```
tmes commitlint
```

git-hooks 设置 simple-git-hooks 配置

```
tmes git-hooks
```

lint-staged 设置 lint-staged 配置

```
tmes lint-staged
```
